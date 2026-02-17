import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { encodeBase64Url } from "https://deno.land/std@0.220.0/encoding/base64url.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/** Create a signed JWT for Google OAuth2 using the service account. */
async function createSignedJwt(serviceAccount: {
  client_email: string;
  private_key: string;
}) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
  };

  const enc = new TextEncoder();
  const headerB64 = encodeBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = encodeBase64Url(enc.encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import the RSA private key
  const pemBody = serviceAccount.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const binaryKey = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    enc.encode(unsignedToken)
  );

  return `${unsignedToken}.${encodeBase64Url(new Uint8Array(signature))}`;
}

/** Exchange a signed JWT for a Google access token. */
async function getAccessToken(serviceAccount: {
  client_email: string;
  private_key: string;
}) {
  const jwt = await createSignedJwt(serviceAccount);
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`OAuth token error: ${JSON.stringify(data)}`);
  }
  return data.access_token as string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, message, image_url } = await req.json();

    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: "title and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse service account
    const saJson = Deno.env.get("FCM_SERVICE_ACCOUNT_JSON");
    if (!saJson) {
      throw new Error("FCM_SERVICE_ACCOUNT_JSON not configured");
    }
    const serviceAccount = JSON.parse(saJson);
    const projectId = serviceAccount.project_id;

    // Get access token for FCM v1
    const accessToken = await getAccessToken(serviceAccount);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all device tokens
    const { data: devices, error: devicesError } = await supabase
      .from("devices")
      .select("token, platform");

    if (devicesError) {
      throw new Error(`Failed to fetch devices: ${devicesError.message}`);
    }

    if (!devices || devices.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No registered devices" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // FCM v1 API sends one message per request; send to all tokens
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    let successCount = 0;
    let failureCount = 0;

    const sendPromises = devices.map(async (device) => {
      const fcmMessage: Record<string, unknown> = {
        message: {
          token: device.token,
          notification: {
            title,
            body: message,
            ...(image_url ? { image: image_url } : {}),
          },
          data: { type: "marketing", title, message },
        },
      };

      try {
        const resp = await fetch(fcmUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(fcmMessage),
        });
        if (resp.ok) {
          successCount++;
        } else {
          failureCount++;
          const errText = await resp.text();
          console.error(`FCM send failed for token ${device.token.slice(0, 10)}...: ${resp.status} ${errText}`);
        }
      } catch (e) {
        failureCount++;
        console.error(`FCM send error for token ${device.token.slice(0, 10)}...:`, e);
      }
    });

    await Promise.all(sendPromises);

    return new Response(
      JSON.stringify({
        success: true,
        sent: devices.length,
        fcm_success: successCount,
        fcm_failure: failureCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
