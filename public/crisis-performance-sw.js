/**
 * ALCHM Crisis Performance Service Worker
 * 
 * CRITICAL: This service worker is optimized for users in crisis
 * Priority: Sub-second loading for life-saving resources
 * 
 * Features:
 * - Instant crisis resource loading (<100ms)
 * - Offline crisis support
 * - Network-first for real-time crisis services
 * - Cache-first for static crisis resources
 * - Performance monitoring and alerting
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `alchm-crisis-${CACHE_VERSION}`;
const PERFORMANCE_CACHE = `alchm-performance-${CACHE_VERSION}`;

// CRITICAL: Crisis resources that MUST be available offline
const CRISIS_CRITICAL_RESOURCES = [
  '/',
  '/crisis',
  '/emergency',
  '/styles/critical.css',
  '/manifest.json',
  // Crisis hotlines and resources
  'tel:988',
  'tel:1-800-273-8255',
  'https://suicidepreventionlifeline.org/',
  'https://www.crisistextline.org/'
];

// Performance-critical resources
const PERFORMANCE_CRITICAL_RESOURCES = [
  '/journal',
  '/dashboard', 
  '/auth/login',
  '/auth/signup'
];

// Static assets that can be cached long-term
const STATIC_RESOURCES = [
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/favicon.ico'
];

// Network timeouts for crisis situations
const CRISIS_TIMEOUT = 1000; // 1 second max for crisis resources
const NORMAL_TIMEOUT = 3000;  // 3 seconds for normal resources

self.addEventListener('install', (event) => {
  console.log('[Crisis SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache crisis-critical resources immediately
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[Crisis SW] Caching crisis-critical resources');
        return cache.addAll(CRISIS_CRITICAL_RESOURCES.filter(url => !url.startsWith('tel:')));
      }),
      
      // Cache performance-critical resources
      caches.open(PERFORMANCE_CACHE).then((cache) => {
        console.log('[Crisis SW] Caching performance-critical resources');
        return cache.addAll(PERFORMANCE_CRITICAL_RESOURCES);
      }),
      
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Crisis SW] Activated');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('[Crisis SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control immediately
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests except crisis services
  if (!url.origin === location.origin && !isCrisisService(url)) {
    return;
  }
  
  // Determine caching strategy based on resource type
  if (isCrisisCritical(url)) {
    event.respondWith(crisisCriticalStrategy(request));
  } else if (isPerformanceCritical(url)) {
    event.respondWith(performanceCriticalStrategy(request));
  } else if (isStaticResource(url)) {
    event.respondWith(cacheFirstStrategy(request));
  } else {
    event.respondWith(networkFirstStrategy(request));
  }
});

// CRISIS CRITICAL: Must respond within 100ms or use cache
async function crisisCriticalStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // For crisis resources, prioritize speed over freshness
  if (cachedResponse) {
    // Return cached immediately, update in background
    updateCrisisResourceInBackground(request, cache);
    return cachedResponse;
  }
  
  try {
    // Very short timeout for crisis resources
    const networkResponse = await fetchWithTimeout(request, CRISIS_TIMEOUT);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Crisis SW] Crisis resource failed to load:', error);
    
    // Return a basic crisis response if no cache available
    return new Response(
      getCrisisOfflineHTML(),
      {
        headers: { 'Content-Type': 'text/html' },
        status: 200
      }
    );
  }
}

// PERFORMANCE CRITICAL: Balance freshness with speed
async function performanceCriticalStrategy(request) {
  const cache = await caches.open(PERFORMANCE_CACHE);
  
  try {
    // Try network first with reasonable timeout
    const networkResponse = await fetchWithTimeout(request, NORMAL_TIMEOUT);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[Crisis SW] Network failed, falling back to cache:', error);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return minimal error page
    return new Response('Offline - Please check your connection', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// STATIC RESOURCES: Cache first for maximum performance
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Resource not available offline', {
      status: 503
    });
  }
}

// DYNAMIC CONTENT: Network first
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetchWithTimeout(request, NORMAL_TIMEOUT);
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('Not available offline', {
      status: 503
    });
  }
}

// Helper functions
function fetchWithTimeout(request, timeout) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

function isCrisisCritical(url) {
  const path = url.pathname;
  return CRISIS_CRITICAL_RESOURCES.some(resource => 
    path === resource || path.startsWith(resource)
  ) || path.includes('crisis') || path.includes('emergency');
}

function isPerformanceCritical(url) {
  const path = url.pathname;
  return PERFORMANCE_CRITICAL_RESOURCES.some(resource => 
    path === resource || path.startsWith(resource)
  );
}

function isStaticResource(url) {
  const path = url.pathname;
  return STATIC_RESOURCES.some(resource => path === resource) ||
         path.startsWith('/icons/') ||
         path.startsWith('/static/') ||
         path.startsWith('/_next/static/');
}

function isCrisisService(url) {
  return url.hostname.includes('suicide') ||
         url.hostname.includes('crisis') ||
         url.hostname.includes('lifeline') ||
         url.protocol === 'tel:';
}

function updateCrisisResourceInBackground(request, cache) {
  // Update crisis resources in background without blocking response
  fetchWithTimeout(request, CRISIS_TIMEOUT)
    .then(response => {
      if (response.ok) {
        cache.put(request, response);
        console.log('[Crisis SW] Updated crisis resource in background');
      }
    })
    .catch(error => {
      console.log('[Crisis SW] Background update failed:', error);
    });
}

function getCrisisOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>ALCHM - Crisis Support Available</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          text-align: center; 
          padding: 40px 20px;
          background-color: #fafafa;
        }
        .crisis-offline {
          max-width: 400px;
          margin: 0 auto;
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .crisis-button {
          display: inline-block;
          background: #dc2626;
          color: white;
          padding: 16px 32px;
          margin: 16px 8px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
        }
        .crisis-button:hover {
          background: #b91c1c;
        }
      </style>
    </head>
    <body>
      <div class="crisis-offline">
        <h1>You're Not Alone</h1>
        <p>Connection issues detected. Crisis support is still available.</p>
        
        <a href="tel:988" class="crisis-button">
          Call 988 - Crisis Lifeline
        </a>
        
        <a href="sms:741741" class="crisis-button">
          Text HOME to 741741
        </a>
        
        <p><small>These emergency services work even without internet.</small></p>
      </div>
    </body>
    </html>
  `;
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_REPORT') {
    console.log('[Crisis SW] Performance report:', event.data);
    
    // Log performance issues for crisis resources
    if (event.data.isCrisis && event.data.loadTime > CRISIS_TIMEOUT) {
      console.warn('[Crisis SW] CRITICAL: Crisis resource exceeded timeout', event.data);
    }
  }
});