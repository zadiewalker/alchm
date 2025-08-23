// ALCHM Service Worker - Advanced Offline Support
// Intelligent caching, background sync, and push notifications for hypergrowth scale

const CACHE_NAME = 'alchm-v1.2.0';
const OFFLINE_CACHE = 'alchm-offline-v1';
const API_CACHE = 'alchm-api-v1';
const STATIC_CACHE = 'alchm-static-v1';
const JOURNAL_CACHE = 'alchm-journal-v1';
const AI_CACHE = 'alchm-ai-insights-v1';

// Version management for hypergrowth deployments
const BUILD_SHA = '__INJECTED_COMMIT_SHA__';
const SW_VERSION = `alchm-sw:${BUILD_SHA}`;

// Cache size limits for different tiers
const CACHE_LIMITS = {
  FREE_TIER: { entries: 30, sizeLimit: 10 * 1024 * 1024 }, // 10MB
  PREMIUM_TIER: { entries: 500, sizeLimit: 100 * 1024 * 1024 }, // 100MB
  ORACLE_TIER: { entries: 1000, sizeLimit: 500 * 1024 * 1024 } // 500MB
};

// Immutable assets pattern (Next.js outputs)
const isImmutableStatic = (url) =>
  url.origin === self.location.origin &&
  url.pathname.startsWith('/_next/static/');

// ---------- Install: activate immediately ----------
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// ---------- Activate: claim all pages & clean old caches ----------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Cleanup old versioned caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith('alchm-static:') && k !== STATIC_CACHE)
          .map((k) => caches.delete(k)),
      );

      await self.clients.claim();

      // Broadcast active version to all controlled clients (for debugging / UI)
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      for (const client of clients) {
        client.postMessage({ type: 'SW_ACTIVATED', version: SW_VERSION });
      }
    })(),
  );
});

// ---------- Messages from pages ----------
self.addEventListener('message', (event) => {
  // Allow the app to tell the SW to take over immediately after a new deploy
  if (event.data === 'ALCHM_SW_UPDATE') {
    self.skipWaiting();
    return;
  }
});

// ---------- Fetch strategy ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET requests for caching
  if (req.method !== 'GET') {
    return;
  }

  // 1) Never cache HTML/document navigations → avoid stale route maps/404s post-deploy
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(networkNoStore(req));
    return;
  }

  // 2) Cache-first for immutable Next.js static chunks (safe for offline)
  if (isImmutableStatic(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // 3) Images - Cache first with fallback
  if (isImage(url)) {
    event.respondWith(cacheFirstWithFallback(req, 'alchm-images'));
    return;
  }

  // 4) API requests - Network first with cache fallback
  if (isAPI(url)) {
    event.respondWith(networkFirstWithCache(req, 'alchm-api'));
    return;
  }

  // 5) Fonts and critical assets - Cache first
  if (isCriticalAsset(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // 6) Everything else: pass through (browser/cache headers decide)
});

// ---------- Helpers ----------

// Always fetch fresh HTML to prevent stale bundles/routes.
// Falls back to a tiny offline page if the network is unavailable.
async function networkNoStore(request) {
  try {
    // Force a fresh fetch bypassing HTTP cache
    const fresh = await fetch(new Request(request, { cache: 'no-store' }));
    return fresh;
  } catch (e) {
    // Minimal offline fallback (kept tiny to avoid extra files)
    return new Response(
      `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline – ALCHM</title></head>
<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding:16px;">
  <h1>You're offline</h1>
  <p>Reconnect to continue. Your latest version will load automatically.</p>
  <small>SW ${SW_VERSION}</small>
</body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 200 },
    );
  }
}

// Cache-first for immutable static assets (safe because Next sets content-hash filenames)
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const res = await fetch(request);
  // Only cache successful, safe GETs
  if (request.method === 'GET' && res && res.ok) {
    cache.put(request, res.clone());
  }
  return res;
}

// Cache first with fallback for images
async function cacheFirstWithFallback(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      // Check if cache is still valid (30 days for images)
      const cacheDate = cached.headers.get('date');
      if (cacheDate) {
        const age = Date.now() - new Date(cacheDate).getTime();
        if (age < 30 * 24 * 60 * 60 * 1000) { // 30 days
          return cached;
        }
      } else {
        return cached; // No date header, assume valid
      }
    }
    
    // Fetch from network
    const response = await fetch(request);
    
    if (response.ok) {
      // Add timestamp for cache validation
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const responseToCache = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, responseToCache);
      
      // Limit cache size (150 images max)
      limitCacheSize(cache, 150);
    }
    
    return response;
  } catch (error) {
    // Return cached version even if expired
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return placeholder image
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#f3f4f6"/>
        <text x="100" y="100" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="14" fill="#6b7280">
          Image unavailable
        </text>
      </svg>`,
      {
        headers: { 'Content-Type': 'image/svg+xml' },
        status: 200
      }
    );
  }
}

// Network first with cache fallback for API requests
async function networkFirstWithCache(request, cacheName) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful API responses (5 minutes max)
      const cache = await caches.open(cacheName);
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      headers.set('sw-ttl', (5 * 60 * 1000).toString()); // 5 minutes
      
      const responseToCache = new Response(await response.clone().text(), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, responseToCache);
      
      // Limit cache size (100 API responses max)
      limitCacheSize(cache, 100);
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      // Check if cache is still valid
      const cachedAt = cached.headers.get('sw-cached-at');
      const ttl = cached.headers.get('sw-ttl');
      
      if (cachedAt && ttl) {
        const age = Date.now() - parseInt(cachedAt);
        if (age < parseInt(ttl)) {
          return cached;
        }
      }
      
      // Return stale cache with warning header
      const staleResponse = cached.clone();
      staleResponse.headers.set('sw-cache-status', 'stale');
      return staleResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable', 
        offline: true,
        message: 'This data is not available offline'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Helper function to limit cache size
async function limitCacheSize(cache, maxEntries) {
  try {
    const keys = await cache.keys();
    
    if (keys.length > maxEntries) {
      // Get cache metadata and sort by date
      const entries = await Promise.all(
        keys.map(async (key) => {
          const response = await cache.match(key);
          const cachedAt = response.headers.get('sw-cached-at') || '0';
          return { key, cachedAt: parseInt(cachedAt) };
        })
      );
      
      // Sort by cache date (oldest first)
      entries.sort((a, b) => a.cachedAt - b.cachedAt);
      
      // Delete oldest entries
      const toDelete = entries.slice(0, keys.length - maxEntries);
      await Promise.all(toDelete.map(({ key }) => cache.delete(key)));
    }
  } catch (error) {
    console.warn('[SW] Failed to limit cache size:', error);
  }
}

// Helper functions for request classification
function isImage(url) {
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|avif|ico)$/i);
}

function isAPI(url) {
  return url.pathname.startsWith('/api/');
}

function isCriticalAsset(url) {
  return url.pathname.match(/\.(woff2?|ttf|eot|css)$/i) ||
         url.pathname.includes('/fonts/') ||
         url.pathname.includes('/critical/');
}

// ---------- PWA Features ----------

// Background sync for offline journal entries
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-journal-entries') {
    event.waitUntil(syncOfflineJournalEntries());
  } else if (event.tag === 'offline-queue-sync') {
    event.waitUntil(processOfflineQueue());
  }
});

// Enhanced offline journal sync
async function syncOfflineJournalEntries() {
  try {
    console.log('[SW] Starting offline journal sync');
    
    // Notify main thread to process offline queue
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_OFFLINE_JOURNALS',
        payload: { tag: 'sync-journal-entries' }
      });
    });
    
    // Get offline entries from IndexedDB or cache
    const db = await openOfflineDB();
    const transaction = db.transaction(['offline_queue'], 'readonly');
    const store = transaction.objectStore('offline_queue');
    const offlineItems = await getAllFromStore(store);
    
    let syncedCount = 0;
    let failedCount = 0;
    
    for (const item of offlineItems) {
      try {
        await syncOfflineItem(item);
        await removeFromOfflineQueue(db, item.id);
        syncedCount++;
      } catch (error) {
        console.error('[SW] Failed to sync item:', item.id, error);
        failedCount++;
        
        // Update retry count
        item.retryCount = (item.retryCount || 0) + 1;
        if (item.retryCount < 3) {
          await updateOfflineItem(db, item);
        } else {
          await removeFromOfflineQueue(db, item.id);
          console.warn('[SW] Max retries reached for item:', item.id);
        }
      }
    }
    
    console.log(`[SW] Sync completed: ${syncedCount} synced, ${failedCount} failed`);
    
    // Notify clients of sync completion
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        payload: { syncedCount, failedCount }
      });
    });
    
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Process general offline queue
async function processOfflineQueue() {
  try {
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => {
      client.postMessage({
        type: 'PROCESS_OFFLINE_QUEUE'
      });
    });
  } catch (error) {
    console.error('[SW] Failed to process offline queue:', error);
  }
}

// Sync individual offline item
async function syncOfflineItem(item) {
  const { operation, collection, docId, data } = item;
  
  let url = `/api/${collection}`;
  let method = 'POST';
  let body = JSON.stringify(data);
  
  if (operation === 'update' && docId) {
    url += `/${docId}`;
    method = 'PUT';
  } else if (operation === 'delete' && docId) {
    url += `/${docId}`;
    method = 'DELETE';
    body = null;
  }
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body
  });
  
  if (!response.ok) {
    throw new Error(`Sync failed: ${response.status} ${response.statusText}`);
  }
  
  return response;
}

// IndexedDB helpers
async function openOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('alchm_offline_db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains('offline_queue')) {
        const store = db.createObjectStore('offline_queue', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('journal_entries')) {
        const store = db.createObjectStore('journal_entries', { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

async function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function removeFromOfflineQueue(db, itemId) {
  const transaction = db.transaction(['offline_queue'], 'readwrite');
  const store = transaction.objectStore('offline_queue');
  await store.delete(itemId);
}

async function updateOfflineItem(db, item) {
  const transaction = db.transaction(['offline_queue'], 'readwrite');
  const store = transaction.objectStore('offline_queue');
  await store.put(item);
}

// Push notifications for journal reminders
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'ALCHM Journal Reminder',
    body: 'Time for your daily reflection and self-care',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'journal-reminder',
    requireInteraction: false,
    actions: [
      {
        action: 'write',
        title: 'Start Writing',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Maybe Later'
      }
    ],
    data: {
      url: '/journals/new',
      timestamp: Date.now()
    }
  };
  
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (e) {
      notificationData.body = event.data.text() || notificationData.body;
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  const targetUrl = event.action === 'write' ? '/journals/new' : '/';
  
  if (event.action !== 'dismiss') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          // Check if app is already open
          for (const client of clients) {
            if (client.url.includes(self.location.origin)) {
              client.focus();
              client.postMessage({ 
                type: 'NAVIGATE',
                url: targetUrl 
              });
              return;
            }
          }
          // Open new window if not already open
          return clients.openWindow(targetUrl);
        })
    );
  }
});

// Handle notification close (for analytics)
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed without interaction');
  // Could send analytics event here
});
