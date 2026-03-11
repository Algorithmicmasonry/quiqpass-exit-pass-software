import { useEffect } from "react";
import { supabase } from "supabase/supabase-client";

/**
 * Converts a base64url string to a Uint8Array.
 * Required to pass the VAPID public key to pushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0))) as Uint8Array<ArrayBuffer>;
}

/**
 * Subscribes the current device to Web Push and saves the subscription
 * to the push_subscriptions table in Supabase.
 *
 * - Runs once on mount, after the service worker is ready.
 * - Safe to call on every page load — uses upsert to avoid duplicates.
 * - Silently skips if push is unsupported or permission is denied.
 */
export function usePushSubscription() {
  useEffect(() => {
    // Only run client-side and only when push is supported
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as
      | string
      | undefined;

    if (!vapidPublicKey) {
      console.warn("VITE_VAPID_PUBLIC_KEY is not set — skipping push setup");
      return;
    }

    const subscribe = async () => {
      try {
        // Get the authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Wait until the service worker is active
        const registration = await navigator.serviceWorker.ready;

        // Reuse an existing subscription if one already exists
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          // Ask the user for permission
          const permission = await Notification.requestPermission();
          if (permission !== "granted") return;

          // Create a new push subscription
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
        }

        // Extract the keys from the subscription
        const subJson = subscription.toJSON();
        const p256dh = subJson.keys?.p256dh;
        const authKey = subJson.keys?.auth;

        if (!p256dh || !authKey) {
          console.error("Push subscription is missing keys — cannot save");
          return;
        }

        // Persist to Supabase (upsert — safe to call on every load)
        const { error } = await supabase.from("push_subscriptions").upsert(
          {
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh,
            auth_key: authKey,
          },
          { onConflict: "user_id,endpoint" }
        );

        if (error) {
          console.error("Failed to save push subscription:", error);
        }
      } catch (err) {
        // Don't surface push errors to the user — silently fail
        console.error("Push subscription setup failed:", err);
      }
    };

    subscribe();
  }, []);
}
