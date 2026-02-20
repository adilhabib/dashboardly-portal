import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function isServiceAccount(value: unknown): value is ServiceAccount {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.project_id === "string" &&
    typeof record.client_email === "string" &&
    typeof record.private_key === "string"
  );
}

function parseServiceAccountJson(raw: string): ServiceAccount | null {
  try {
    const parsed = JSON.parse(raw);
    if (isServiceAccount(parsed)) {
      return parsed;
    }
  } catch {
    // Try base64-decoded JSON next.
  }

  try {
    const decoded = atob(raw);
    const parsed = JSON.parse(decoded);
    if (isServiceAccount(parsed)) {
      return parsed;
    }
  } catch {
    // Ignore and fallback to split env vars.
  }

  return null;
}

function getServiceAccountFromEnv(): ServiceAccount {
  const serviceAccountJson = Deno.env.get("FCM_SERVICE_ACCOUNT_JSON")?.trim();
  if (serviceAccountJson) {
    const parsed = parseServiceAccountJson(serviceAccountJson);
    if (parsed) {
      return { ...parsed, private_key: parsed.private_key.replace(/\\n/g, "\n") };
    }
  }

  const project_id = Deno.env.get("FCM_PROJECT_ID")?.trim() ?? "";
  const client_email = Deno.env.get("FCM_CLIENT_EMAIL")?.trim() ?? "";
  const private_key = (Deno.env.get("FCM_PRIVATE_KEY") ?? "").replace(/\\n/g, "\n").trim();

  if (project_id && client_email && private_key) {
    return { project_id, client_email, private_key };
  }

  throw new Error(
    "Missing Firebase service account credentials. Set FCM_SERVICE_ACCOUNT_JSON (raw JSON or base64 JSON) or set FCM_PROJECT_ID, FCM_CLIENT_EMAIL, and FCM_PRIVATE_KEY."
  );
}

// Get a Google OAuth2 access token from a service account JSON using RS256 JWT
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    sub: sa.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
  };

  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signingInput = `${headerB64}.${payloadB64}`;

  // Import the RSA private key
  const pemKey = sa.private_key.replace(/\\n/g, "\n");
  const keyData = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const binaryKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

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
    new TextEncoder().encode(signingInput)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

  const jwt = `${signingInput}.${signatureB64}`;

  // Exchange JWT for an access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function sendFcmToToken(
  accessToken: string,
  projectId: string,
  fcmToken: string,
  title: string,
  body: string,
  imageUrl?: string | null,
  notificationId?: string
): Promise<{ success: boolean; error?: string }> {
  const message: Record<string, unknown> = {
    token: fcmToken,
    notification: {
      title,
      body,
      ...(imageUrl ? { image: imageUrl } : {}),
    },
    data: {
      type: "promotion",
      ...(notificationId ? { notification_id: notificationId } : {}),
    },
    android: {
      notification: {
        ...(imageUrl ? { image_url: imageUrl } : {}),
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
    },
    apns: {
      payload: {
        aps: { "mutable-content": 1 },
      },
      ...(imageUrl
        ? {
            fcm_options: { image: imageUrl },
          }
        : {}),
    },
    webpush: {
      notification: {
        ...(imageUrl ? { image: imageUrl } : {}),
      },
    },
  };

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    return { success: false, error: JSON.stringify(errorData) };
  }
  return { success: true };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const serviceAccount = getServiceAccountFromEnv();

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const projectId = serviceAccount.project_id;

    const body = await req.json();
    const { title, message, image_url, notification_id } = body;

    if (!title || !message) {
      return new Response(
        JSON.stringify({ error: "title and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to fetch all FCM tokens
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: tokens, error: tokensError } = await supabase
      .from("user_fcm_tokens")
      .select("token, user_id");

    if (tokensError) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch tokens: ${tokensError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ sent: 0, failed: 0, message: "No registered FCM tokens found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get access token once and reuse for all sends
    const accessToken = await getAccessToken(serviceAccount);

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    // Send to all tokens in parallel (batch of 20 at a time)
    const batchSize = 20;
    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map((t) =>
          sendFcmToToken(accessToken, projectId, t.token, title, message, image_url, notification_id)
        )
      );
      results.forEach((r) => {
        if (r.success) sent++;
        else {
          failed++;
          if (r.error) errors.push(r.error);
        }
      });
    }

    console.log(`Push notification sent: ${sent} success, ${failed} failed`);

    return new Response(
      JSON.stringify({ sent, failed, errors: errors.length > 0 ? errors : undefined }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error in send-push-notification:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
