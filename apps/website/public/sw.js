const CACHE_NAME = "skillyards-frontend-v1";
const OFFLINE_URL = "/offline.html";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js",
);

if (!self.workbox) {
  console.error("Workbox failed to load");
}

// ---------------------------------------------
// SKIP WAITING
// ---------------------------------------------
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ---------------------------------------------
// INSTALL – OFFLINE ASSETS
// ---------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL])),
  );
});

// ---------------------------------------------
// ACTIVATE
// ---------------------------------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// ---------------------------------------------
// NEVER CACHE (ADMIN / POST)
// ---------------------------------------------
workbox.routing.registerRoute(
  ({ url, request }) =>
    request.method !== "GET" || url.pathname.startsWith("/admin"),
  new workbox.strategies.NetworkOnly(),
);

// ---------------------------------------------
// NEXT.JS STATIC FILES
// ---------------------------------------------
workbox.routing.registerRoute(
  ({ url }) => url.pathname.startsWith("/_next/static"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "next-static-assets",
  }),
);

// ---------------------------------------------
// STATIC ASSETS (CSS, JS, IMAGES, FONTS)
// ---------------------------------------------
workbox.routing.registerRoute(
  ({ request }) =>
    ["style", "script", "image", "font"].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "frontend-assets",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  }),
);

const navigationHandler = async ({ event }) => {
  try {
    return await fetch(event.request);
  } catch {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(OFFLINE_URL);
  }
};

const navigationRoute = new workbox.routing.NavigationRoute(navigationHandler, {
  denylist: [/^\/admin/, /_next/],
});

workbox.routing.registerRoute(navigationRoute);

// ---------------------------------------------
// PUSH NOTIFICATIONS
// ---------------------------------------------
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: event.data.text() };
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: "/icons/badge.png",
    data: {
      url: data.data?.url || "/",
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "SkillYards", options),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
