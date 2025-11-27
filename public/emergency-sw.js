
// ALCHM Emergency Cache Buster - v1763242665984
const CACHE_VERSION = 'v1763242665984';
const CACHE_NAME = 'alchm-emergency-' + CACHE_VERSION;

// Force immediate cache invalidation
self.addEventListener('install', (event) => {
  console.log('🚀 New ALCHM version installing:', CACHE_VERSION);
  self.skipWaiting(); // Force immediate activation
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('alchm-') && cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('✅ Cache cleanup complete, claiming clients');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Network-first strategy for all requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Cache-Bust': CACHE_VERSION
      }
    }).catch(() => {
      // Only use cache as fallback for offline scenarios
      return caches.match(event.request);
    })
  );
});

// Force reload for critical updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    console.log('🔄 Force updating all clients');
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'FORCE_RELOAD' });
      });
    });
  }
});
