const CACHE_NAME = "snake-4d-cache-v3"; // Incremented cache version
const APP_SHELL_URLS = [
  "/",
  "/manifest.json",
  "/assets/icons/icon-192x192.png",
  "/assets/icons/icon-512x512.png",
  "/screenshots/desktop_screenshot.png",
  "/screenshots/mobile_screenshot.png",
];

// Install: Cache the app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache and caching app shell");
        return cache.addAll(APP_SHELL_URLS);
      })
      .catch((err) => {
        console.error("Failed to cache app shell:", err);
      }),
  );
});

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Fetch: Implement robust caching strategies
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Go to the network first for navigation requests
      if (event.request.mode === "navigate") {
        try {
          const networkResponse = await fetch(event.request);
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // If network fails, try the cache
          return cache.match(event.request);
        }
      }

      // For other requests, use a cache-first, then network-fallback-and-revalidate strategy
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // Serve from cache and update in the background
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn(
              `Failed to fetch and update ${event.request.url}`,
              err,
            );
          });
        return cachedResponse;
      }

      // If not in cache, go to the network
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error(`Fetch failed for ${event.request.url}`, error);
        // Optionally, return a fallback/offline page here
      }
    }),
  );
});
