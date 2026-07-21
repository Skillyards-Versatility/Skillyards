// Web Push Utilities

export async function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      console.log("Service Worker registered with scope:", registration.scope);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
}

export async function subscribeToPushNotifications() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    return { success: false, message: "Push notifications not supported by browser." };
  }

  try {
    let registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      registration = await registerServiceWorker();
    }
    
    if (!registration) {
      return { success: false, message: "Service worker not registered." };
    }

    // Convert public VAPID key to Uint8Array
    const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
      console.error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing from environment variables.");
      return { success: false, message: "Configuration error." };
    }

    const padding = "=".repeat((4 - (publicVapidKey.length % 4)) % 4);
    const base64 = (publicVapidKey + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: outputArray,
    });

    // Send subscription to server
    const { API } = await import("@/lib/api");
    const { getRawToken } = await import("@/lib/auth");
    
    // In client components, we might just call a server action, or pass the token.
    // Actually, hitting the API from the client requires passing the cookie/auth header.
    // Instead of importing getRawToken, we can just do a relative fetch if rewrites are set up,
    // or we can use a server action. Let's just return the subscription and let the UI component call a server action.
    
    return { success: true, subscription: JSON.parse(JSON.stringify(subscription)) };
  } catch (error) {
    console.error("Push subscription failed:", error);
    return { success: false, message: error.message || "Failed to subscribe" };
  }
}
