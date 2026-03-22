// 5s Arena Blog — Service Worker (basic offline + cache)
const CACHE_NAME = '5s-arena-v1';
const OFFLINE_URL = '/';

// Assets to pre-cache on install
const PRE_CACHE = [
  '/',
  '/logo.png',
  '/favicon.ico',
  '/manifest.json',
];

// Install — pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network-first with cache fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET and chrome-extension requests
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension://')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && (
          event.request.url.includes('/assets/') ||
          event.request.url.includes('/posts/') ||
          event.request.url.includes('/authors/') ||
          event.request.url.includes('/logo.png')
        )) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Serve from cache on network failure
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, serve the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
          return new Response('', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
