import api from "@/lib/api";

export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Web Push's applicationServerKey wants the VAPID public key as a raw
// Uint8Array, not the base64url string the backend hands back.
function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const decoded = atob(raw);
  const buffer = new ArrayBuffer(decoded.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  return buffer;
}

export async function getPushPermissionState(): Promise<NotificationPermission | "unsupported"> {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

// True when THIS browser/device already has an active push subscription —
// used to render the settings toggle in the right state on load, since
// permission alone doesn't mean a subscription was actually created (the
// customer could have granted permission then closed the tab before the
// subscribe POST finished).
export async function isCurrentlySubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) return false;
    const sub = await registration.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}

export async function subscribeToPush(): Promise<void> {
  if (!isPushSupported()) {
    throw new Error("Push notifications aren't supported in this browser");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted");
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const { data } = await api.get("/devices/web-push/vapid-public-key");
  const publicKey = data.public_key;
  if (!publicKey) {
    throw new Error("Push isn't configured on the server yet");
  }

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const json = subscription.toJSON();
  await api.post("/devices/web-push/subscribe", {
    endpoint: json.endpoint,
    keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
  });
}

export async function unsubscribeFromPush(): Promise<void> {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();
  await api.delete("/devices/web-push/unsubscribe", { params: { endpoint } });
}
