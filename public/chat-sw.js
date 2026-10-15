// Nira Chat service worker (scope: "/" on chat.beautynira.com) — makes the customer chat an
// installable home-screen app that opens instantly and shows a friendly
// offline screen instead of a browser error. Deliberately does NOT cache
// API responses: prices, slots and stock must always be live.
const CACHE = "nira-chat-v2";
const SHELL = ["/", "/chat-icon-192.png", "/chat-icon-512.png", "/chat-offline.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("nira-chat-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API calls go straight to the network

  // Pages: network first (always fresh), cached shell / offline page as fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(url.pathname, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(url.pathname)
            .then((r) => r || caches.match("/"))
            .then((r) => r || caches.match("/chat-offline.html"))
        )
    );
    return;
  }

  // Static assets (Next.js chunks, icons, fonts): cache first, then network.
  if (url.pathname.startsWith("/_next/static/") || /\.(png|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }))
    );
  }
});
