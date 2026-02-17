import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");
    if (!fcmServerKey) {
      throw new Error("FCM_SERVER_KEY not configured");
    }

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

    const tokens = devices.map((d) => d.token);

    // Build FCM notification payload
    const notification: Record<string, string> = { title, body: message };
    if (image_url) {
      notification.image = image_url;
    }

    // Send to all tokens using FCM legacy HTTP API (supports multicast)
    const fcmResponse = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${fcmServerKey}`,
      },
      body: JSON.stringify({
        registration_ids: tokens,
        notification,
        data: { type: "marketing", title, message },
      }),
    });

    const fcmResult = await fcmResponse.json();

    console.log("FCM response:", JSON.stringify(fcmResult));

    return new Response(
      JSON.stringify({
        success: true,
        sent: tokens.length,
        fcm_success: fcmResult.success,
        fcm_failure: fcmResult.failure,
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
