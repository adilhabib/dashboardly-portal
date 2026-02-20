import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ScheduledNotification = {
  id: string;
  title: string;
  message: string;
  image_url: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: dueNotifications, error: dueError } = await supabase
      .from("marketing_notifications")
      .select("id, title, message, image_url")
      .eq("is_active", true)
      .eq("send_status", "scheduled")
      .lte("scheduled_for", new Date().toISOString())
      .is("sent_at", null)
      .order("scheduled_for", { ascending: true })
      .limit(50);

    if (dueError) {
      return new Response(
        JSON.stringify({ error: `Failed to load due notifications: ${dueError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const notifications = (dueNotifications ?? []) as ScheduledNotification[];
    if (notifications.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, sent: 0, failed: 0, message: "No due scheduled notifications" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processed = 0;
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const notification of notifications) {
      const res = await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: notification.title,
          message: notification.message,
          image_url: notification.image_url,
          notification_id: notification.id,
        }),
      });

      processed++;
      if (!res.ok) {
        failed++;
        const payload = await res.text();
        errors.push(`notification ${notification.id}: ${payload}`);
        continue;
      }

      const payload = (await res.json()) as { sent?: number; failed?: number; error?: string };
      if (payload.error || (payload.sent ?? 0) === 0) {
        failed++;
        errors.push(`notification ${notification.id}: ${payload.error ?? "No devices delivered"}`);
      } else {
        sent++;
      }
    }

    return new Response(
      JSON.stringify({
        processed,
        sent,
        failed,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

