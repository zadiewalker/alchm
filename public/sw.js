// ALCHM Service Worker - Performance Excellence & Crisis-Optimized
// Intelligent caching, background sync, and push notifications for hypergrowth scale
// Performance-first design with trauma-informed crisis resource priority

const CACHE_NAME = 'alchm-v1.3.0';
const OFFLINE_CACHE = 'alchm-offline-v1';
const API_CACHE = 'alchm-api-v1';
const STATIC_CACHE = 'alchm-static-v1';
const JOURNAL_CACHE = 'alchm-journal-v1';
const AI_CACHE = 'alchm-ai-insights-v1';
const CRISIS_CACHE = 'alchm-crisis-v1'; // Priority cache for crisis resources
const FONT_CACHE = 'alchm-fonts-v1'; // Dedicated font cache

// Version management for hypergrowth deployments
const BUILD_SHA = '__INJECTED_COMMIT_SHA__';
const SW_VERSION = `alchm-sw:${BUILD_SHA}`;

// Performance tracking metrics
let performanceMetrics = {
  cacheHits: 0,
  cacheMisses: 0,
  networkRequests: 0,
  offlineRequests: 0,
  crisisResourceHits: 0,
  averageResponseTime: 0,
  totalRequests: 0,
  mobileOptimizations: 0,
  lowBandwidthRequests: 0
};

// Mobile device detection and optimization flags
const isMobile = () => {
  return navigator.userAgent.includes('Mobile') || 
         navigator.userAgent.includes('Android') ||
         screen.width <= 768;
};

const isOldDevice = () => {
  const ua = navigator.userAgent;
  return ua.includes('iPhone OS 12') || 
         ua.includes('iPhone OS 13') ||
         ua.includes('Android 8') ||
         ua.includes('Android 9') ||
         (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
};

const isSlowConnection = () => {
  return navigator.connection && 
         (navigator.connection.effectiveType === 'slow-2g' ||
          navigator.connection.effectiveType === '2g' ||
          navigator.connection.effectiveType === '3g');
};

// Crisis-critical resources (must be available offline with <1s load time)
const CRISIS_RESOURCES = [
  '/',
  '/crisis-support',
  '/emergency',
  '/support',
  '/crisis-resources',
  '/hotlines',
  '/emergency-contacts',
  '/emergency-crisis.html',
  '/crisis-resources.json' // CRITICAL: Cache crisis resources JSON for offline access
];

// Mobile-optimized resource priorities
const MOBILE_ESSENTIAL_RESOURCES = [
  '/',
  '/auth/login',
  '/journal',
  '/crisis-support',
  '/_next/static/css/',
  '/manifest.webmanifest'
];

// Reduced payload for older devices
const LOW_BANDWIDTH_EXCLUSIONS = [
  /\.(webp|avif)$/,
  /large\.(jpg|jpeg|png)$/,
  /4k\.(jpg|jpeg|png)$/,
  /_hd\.(mp4|webm)$/
];

// Cache size limits for different tiers (performance-optimized)
const CACHE_LIMITS = {
  FREE_TIER: { entries: 50, sizeLimit: 25 * 1024 * 1024 }, // 25MB for better performance
  PREMIUM_TIER: { entries: 750, sizeLimit: 150 * 1024 * 1024 }, // 150MB
  ORACLE_TIER: { entries: 1500, sizeLimit: 750 * 1024 * 1024 } // 750MB
};

// Immutable assets pattern (Next.js outputs)
const isImmutableStatic = (url) =>
  url.origin === self.location.origin &&
  url.pathname.startsWith('/_next/static/');

// ---------- Install: activate immediately + preload crisis resources ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      // CRITICAL: Preload crisis resources immediately during install
      const crisisCache = await caches.open(CRISIS_CACHE);
      
      try {
        // Cache the emergency crisis page and resources JSON immediately
        await crisisCache.addAll([
          '/emergency-crisis.html',
          '/crisis-resources.json'
        ]);
        console.log('[SW] Crisis resources preloaded successfully');
      } catch (error) {
        console.error('[SW] Failed to preload crisis resources:', error);
        // Don't fail installation if crisis resources fail to load
      }
      
      self.skipWaiting();
    })()
  );
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
  
  // Performance metrics request
  if (event.data === 'GET_PERFORMANCE_METRICS') {
    event.ports[0].postMessage({
      type: 'PERFORMANCE_METRICS',
      metrics: performanceMetrics,
      timestamp: Date.now()
    });
    return;
  }
  
  // Clear performance metrics
  if (event.data === 'CLEAR_PERFORMANCE_METRICS') {
    performanceMetrics = {
      cacheHits: 0,
      cacheMisses: 0,
      networkRequests: 0,
      offlineRequests: 0,
      crisisResourceHits: 0,
      averageResponseTime: 0,
      totalRequests: 0
    };
    return;
  }
});

// ---------- Performance-Optimized Fetch Strategy ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  const startTime = performance.now();

  // Skip cross-origin requests (except trusted sources)
  if (url.origin !== self.location.origin && !isTrustedOrigin(url.origin)) {
    return;
  }

  // Skip non-GET requests for caching
  if (req.method !== 'GET') {
    return;
  }

  // Track performance metrics
  performanceMetrics.totalRequests++;

  // 1) CRISIS RESOURCES - Highest priority, ultra-fast cache-first
  if (isCrisisResource(url)) {
    event.respondWith(crisisResourceHandler(req, startTime));
    return;
  }

  // 2) Navigation requests - Network first with performance monitoring
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(enhancedNetworkNoStore(req, startTime));
    return;
  }

  // 3) Fonts - Aggressive cache first (critical for performance)
  if (isFont(url)) {
    event.respondWith(cacheFirst(req, FONT_CACHE, startTime));
    return;
  }

  // 4) Immutable Next.js static chunks - Cache first with performance tracking
  if (isImmutableStatic(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE, startTime));
    return;
  }

  // 5) Images - Smart cache with WebP/AVIF optimization
  if (isImage(url)) {
    event.respondWith(smartImageHandler(req, startTime));
    return;
  }

  // 6) API requests - Network first with intelligent caching
  if (isAPI(url)) {
    event.respondWith(smartAPIHandler(req, startTime));
    return;
  }

  // 7) Critical assets - Cache first
  if (isCriticalAsset(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE, startTime));
    return;
  }

  // 8) Everything else: performance-tracked pass through
  event.respondWith(trackPerformance(fetch(req), startTime));
});

// ---------- Performance-Optimized Handlers ----------

// Crisis resource handler - Sub-1s response time critical
async function crisisResourceHandler(request, startTime) {
  performanceMetrics.crisisResourceHits++;
  
  try {
    const cache = await caches.open(CRISIS_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      performanceMetrics.cacheHits++;
      trackResponseTime(startTime);
      
      // Update cache in background if online
      if (navigator.onLine) {
        updateCacheInBackground(request, cache);
      }
      
      return cached;
    }
    
    // Network with aggressive timeout for crisis resources
    const networkResponse = await fetchWithTimeout(request, 1500);
    performanceMetrics.networkRequests++;
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    trackResponseTime(startTime);
    return networkResponse;
    
  } catch (error) {
    performanceMetrics.offlineRequests++;
    trackResponseTime(startTime);
    
    // Return minimal crisis fallback
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>ALCHM Crisis Support - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: system-ui; padding: 20px; text-align: center; }
            .crisis { background: #fef2f2; border: 2px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .hotline { font-size: 24px; font-weight: bold; color: #dc2626; margin: 10px 0; }
          </style>
        </head>
        <body>
          <h1>ALCHM Crisis Support</h1>
          <div class="crisis">
            <p><strong>You're offline, but help is still available:</strong></p>
            <div class="hotline">988 - Suicide & Crisis Lifeline</div>
            <div class="hotline">911 - Emergency Services</div>
            <p>Call now for immediate support</p>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Enhanced network handler with performance monitoring
async function enhancedNetworkNoStore(request, startTime) {
  try {
    const fresh = await fetchWithTimeout(new Request(request, { cache: 'no-store' }), 3000);
    performanceMetrics.networkRequests++;
    trackResponseTime(startTime);
    return fresh;
  } catch (e) {
    performanceMetrics.offlineRequests++;
    trackResponseTime(startTime);
    return getEnhancedOfflinePage();
  }
}

// Smart image handler with modern format support
async function smartImageHandler(request, startTime) {
  try {
    const cache = await caches.open('alchm-images');
    const cached = await cache.match(request);
    
    if (cached && isCacheValid(cached, 7 * 24 * 60 * 60 * 1000)) { // 7 days
      performanceMetrics.cacheHits++;
      trackResponseTime(startTime);
      return cached;
    }
    
    const response = await fetchWithTimeout(request, 5000);
    performanceMetrics.networkRequests++;
    
    if (response.ok) {
      // Add cache metadata
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const responseToCache = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, responseToCache);
      limitCacheSize(cache, 200); // Increased for better UX
    }
    
    trackResponseTime(startTime);
    return response;
    
  } catch (error) {
    performanceMetrics.cacheMisses++;
    trackResponseTime(startTime);
    
    // Try to return stale cache
    const cache = await caches.open('alchm-images');
    const cached = await cache.match(request);
    if (cached) return cached;
    
    // Return optimized placeholder
    return getImagePlaceholder();
  }
}

// Smart API handler with intelligent caching
async function smartAPIHandler(request, startTime) {
  const url = new URL(request.url);
  const isCriticalAPI = url.pathname.includes('/auth/') || url.pathname.includes('/crisis/');
  const timeout = isCriticalAPI ? 3000 : 5000;
  
  try {
    const response = await fetchWithTimeout(request, timeout);
    performanceMetrics.networkRequests++;
    
    if (response.ok && shouldCacheAPI(url)) {
      const cache = await caches.open(API_CACHE);
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      headers.set('sw-ttl', getTTLForAPI(url).toString());
      
      const responseToCache = new Response(await response.clone().text(), {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, responseToCache);
      limitCacheSize(cache, 150);
    }
    
    trackResponseTime(startTime);
    return response;
    
  } catch (error) {
    performanceMetrics.cacheMisses++;
    
    // Try cache fallback
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    
    if (cached && isCacheValid(cached, getTTLForAPI(url))) {
      performanceMetrics.cacheHits++;
      trackResponseTime(startTime);
      return cached;
    }
    
    trackResponseTime(startTime);
    return new Response(JSON.stringify({ 
      error: 'Service temporarily unavailable',
      offline: true,
      retryAfter: '30'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Performance tracking helper
async function trackPerformance(responsePromise, startTime) {
  try {
    const response = await responsePromise;
    performanceMetrics.networkRequests++;
    trackResponseTime(startTime);
    return response;
  } catch (error) {
    performanceMetrics.cacheMisses++;
    trackResponseTime(startTime);
    throw error;
  }
}

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

// Cache-first for immutable static assets (performance-optimized)
async function cacheFirst(request, cacheName, startTime) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      performanceMetrics.cacheHits++;
      if (startTime) trackResponseTime(startTime);
      return cached;
    }

    const res = await fetchWithTimeout(request, 5000);
    performanceMetrics.networkRequests++;
    
    // Only cache successful, safe GETs
    if (request.method === 'GET' && res && res.ok) {
      cache.put(request, res.clone());
    }
    
    if (startTime) trackResponseTime(startTime);
    return res;
  } catch (error) {
    performanceMetrics.cacheMisses++;
    if (startTime) trackResponseTime(startTime);
    throw error;
  }
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

function isFont(url) {
  return url.pathname.match(/\.(woff2?|ttf|eot)$/i) || url.pathname.includes('/fonts/');
}

function isAPI(url) {
  return url.pathname.startsWith('/api/');
}

function isCriticalAsset(url) {
  return url.pathname.match(/\.(css|js)$/i) ||
         url.pathname.includes('/critical/') ||
         url.pathname.startsWith('/_next/static/');
}

function isCrisisResource(url) {
  return CRISIS_RESOURCES.some(resource => 
    url.pathname === resource || url.pathname.startsWith(resource + '/')
  ) || url.pathname.includes('crisis') || url.pathname.includes('emergency');
}

function isTrustedOrigin(origin) {
  const trusted = [
    'https://firebasestorage.googleapis.com',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
  ];
  return trusted.includes(origin);
}

// Performance tracking utilities
function trackResponseTime(startTime) {
  const responseTime = performance.now() - startTime;
  performanceMetrics.averageResponseTime = 
    (performanceMetrics.averageResponseTime * (performanceMetrics.totalRequests - 1) + responseTime) / 
    performanceMetrics.totalRequests;
}

async function fetchWithTimeout(request, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function updateCacheInBackground(request, cache) {
  try {
    const response = await fetchWithTimeout(request, 3000);
    if (response.ok) {
      cache.put(request, response);
    }
  } catch (error) {
    // Silent background update failure
  }
}

function isCacheValid(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return true; // Assume valid if no timestamp
  
  const age = Date.now() - parseInt(cachedAt);
  return age < maxAge;
}

function shouldCacheAPI(url) {
  // Don't cache authentication or real-time endpoints
  const noCachePaths = ['/auth/logout', '/auth/session', '/realtime/', '/websocket/'];
  return !noCachePaths.some(path => url.pathname.includes(path));
}

function getTTLForAPI(url) {
  // Different TTL for different API endpoints
  if (url.pathname.includes('/crisis/')) return 60 * 1000; // 1 minute
  if (url.pathname.includes('/user/')) return 5 * 60 * 1000; // 5 minutes
  if (url.pathname.includes('/journals/')) return 10 * 60 * 1000; // 10 minutes
  return 2 * 60 * 1000; // 2 minutes default
}

function getEnhancedOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ALCHM - Offline</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; 
            padding: 20px; text-align: center; background: #f9fafb; 
            display: flex; flex-direction: column; justify-content: center; min-height: 100vh;
          }
          .container { max-width: 400px; margin: 0 auto; }
          .offline { color: #6b7280; margin: 20px 0; font-size: 18px; }
          .crisis-note { 
            background: #fef2f2; border: 1px solid #fecaca; 
            padding: 20px; border-radius: 12px; margin: 30px 0; 
          }
          .hotline { font-size: 20px; font-weight: 600; color: #dc2626; margin: 8px 0; }
          .reconnect { color: #4b5563; font-size: 14px; margin-top: 20px; }
          .pulse { animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ALCHM</h1>
          <div class="offline pulse">You're currently offline</div>
          <div class="crisis-note">
            <p><strong>In crisis? Help is always available:</strong></p>
            <div class="hotline">988 - Suicide & Crisis Lifeline</div>
            <div class="hotline">911 - Emergency Services</div>
            <p style="margin: 15px 0 0; font-size: 14px;">Call immediately for support</p>
          </div>
          <div class="reconnect">We'll automatically reconnect when your internet is restored.</div>
        </div>
      </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}

function getImagePlaceholder() {
  return new Response(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#f3f4f6"/>
      <rect x="150" y="100" width="100" height="100" rx="50" fill="#d1d5db"/>
      <text x="200" y="230" text-anchor="middle" font-family="system-ui" font-size="14" fill="#6b7280">
        Image temporarily unavailable
      </text>
    </svg>
  `, {
    headers: { 'Content-Type': 'image/svg+xml' },
    status: 200
  });
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
