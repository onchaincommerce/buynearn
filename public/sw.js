const CACHE_NAME = 'buy-earn-cache-v1';
const urlsToCache = [
  '/',
  '/?standalone=true',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/base-logo.png',
  '/cbBTC.png',
  '/icons/usdc.png',
  '/icons/btc.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients as soon as it activates
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Check if request is made by chrome-extension
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Add ?standalone=true to the URL if it's not there
          const url = new URL(event.request.url);
          if (!url.searchParams.has('standalone')) {
            url.searchParams.set('standalone', 'true');
            return Response.redirect(url.toString(), 302);
          }
          return response;
        })
        .catch(() => {
          return caches.match('/?standalone=true');
        })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 