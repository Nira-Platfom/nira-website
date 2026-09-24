// Nira dashboard service worker — Web Push only. Not a full offline/cache
// worker (the dashboard is data-driven and stale-cached data would be
// actively misleading for a business owner), so its only job is turning
// an incoming push into a visible notification and handling a tap on it.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = { title: "Nira", body: "You have a new update" };
  try {
    if (event.data) payload = event.data.json();
  } catch (e) {
    // Non-JSON payload — fall back to the default above rather than
    // showing no notification at all.
  }

  const { title, body, data } = payload;
  event.waitUntil(
    self.registration.showNotification(title || "Nira", {
      body: body || "",
      icon: "/android-chrome-192x192.png",
      badge: "/favicon-32x32.png",
      data: data || {},
      tag: (data && data.type) || undefined,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Route to a specific page when the notification's data says so,
  // otherwise just open the dashboard — every notification type this
  // sends (new booking, new order, needs_human, reminders) is actionable
  // from there regardless.
  const data = event.notification.data || {};
  let path = "/dashboard";
  if (data.type === "new_booking") path = "/bookings";
  else if (data.type === "new_order") path = "/orders";
  else if (data.type === "needs_human") path = "/customers?needs_human=true";
  else if (data.type === "booking_reminder") path = "/bookings";
  else if (data.type === "order_alert") path = "/orders";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) {
          client.navigate(path);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(path);
    })
  );
});
