import { getToken, onMessage, Messaging } from "firebase/messaging";
import { messaging, VAPID_KEY } from "@/lib/firebase";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const requestNotificationPermission = async (userId?: string) => {
    if (!messaging) return null;

    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await getToken(messaging as Messaging, {
                vapidKey: VAPID_KEY,
            });

            if (token && userId) {
                await saveTokenToSupabase(userId, token);
            }
            return token;
        } else {
            console.warn("Notification permission denied.");
            return null;
        }
    } catch (error) {
        console.error("An error occurred while requesting permission:", error);
        return null;
    }
};

const saveTokenToSupabase = async (userId: string, token: string) => {
    try {
        const { error } = await (supabase as any)
            .from("user_fcm_tokens")
            .upsert(
                {
                    user_id: userId,
                    token: token,
                    device_type: 'web',
                    last_seen: new Date().toISOString()
                },
                { onConflict: 'token' }
            );

        if (error) throw error;
        console.log("FCM Token saved to Supabase successfully.");
    } catch (error) {
        console.error("Error saving FCM token to Supabase:", error);
    }
};

export const onMessageListener = (addNotification: (notif: any) => void) => {
    if (!messaging) return;

    return onMessage(messaging as Messaging, (payload) => {
        console.log("Foreground message received:", payload);

        const title = payload.notification?.title || "New Message";
        const body = payload.notification?.body || "";

        // Show toast notification
        toast({
            title: title,
            description: body,
            duration: 5000,
        });

        // Add to local notification state
        addNotification({
            title: title,
            description: body,
            type: 'system',
            link: payload.data?.link
        });
    });
};
