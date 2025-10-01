/**
 * CRISIS-CRITICAL: EMERGENCY SERVICE WORKER
 * Ultra-minimal service worker for offline crisis support
 * Bundle target: <10KB total - EVERY BYTE MATTERS FOR CRISIS USERS
 */

const CACHE_NAME = 'alchm-emergency-v2';
const EMERGENCY_CACHE = 'alchm-emergency-critical-v2';

// CRISIS-CRITICAL: Cache only essential resources for immediate crisis access
const CRITICAL_RESOURCES = [
  '/',
  '/emergency',
  '/auth/login',
  '/manifest.json',
];

// EMERGENCY: Install service worker immediately
self.addEventListener('install', event => {
  console.log('🚨 Emergency Service Worker installing...');
  
  event.waitUntil(
    caches.open(EMERGENCY_CACHE)
      .then(cache => {
        console.log('🚨 Caching emergency resources');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .catch(error => {
        console.warn('🚨 Emergency cache failed, continuing anyway:', error);
      })
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// EMERGENCY: Activate immediately
self.addEventListener('activate', event => {
  console.log('🚨 Emergency Service Worker activated');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== EMERGENCY_CACHE) {
            console.log('🚨 Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control immediately
  return self.clients.claim();
});

// CRISIS-CRITICAL: Fetch strategy - offline-first for emergency pages
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // EMERGENCY: Special handling for crisis pages
  if (url.pathname === '/emergency' || url.pathname === '/auth/login') {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            console.log('🚨 Serving from emergency cache:', url.pathname);
            return cachedResponse;
          }
          
          // Try network, cache if successful
          return fetch(event.request)
            .then(response => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(EMERGENCY_CACHE)
                  .then(cache => cache.put(event.request, responseClone))
                  .catch(error => console.warn('🚨 Cache put failed:', error));
              }
              return response;
            })
            .catch(error => {
              console.warn('🚨 Network failed for emergency page:', error);
              // Return a minimal emergency page
              return new Response(`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>ALCHM Emergency - Offline</title>
                  <style>
                    body {
                      font-family: system-ui, -apple-system, sans-serif;
                      background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                      color: white;
                      margin: 0;
                      padding: 20px;
                      min-height: 100vh;
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      justify-content: center;
                    }
                    .container { max-width: 400px; text-align: center; }
                    .emergency-btn {
                      display: block;
                      width: 100%;
                      padding: 16px;
                      font-size: 18px;
                      background: #dc2626;
                      color: white;
                      border: none;
                      border-radius: 8px;
                      text-decoration: none;
                      margin: 12px 0;
                    }
                    textarea {
                      width: 100%;
                      min-height: 200px;
                      padding: 16px;
                      border-radius: 8px;
                      border: 1px solid rgba(255,255,255,0.3);
                      background: rgba(255,255,255,0.1);
                      color: white;
                      font-size: 16px;
                      margin: 16px 0;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div style="font-size: 48px; margin-bottom: 16px;">🌿</div>
                    <h1>ALCHM Emergency - Offline Mode</h1>
                    <p>You're in a safe space. The app is working offline.</p>
                    
                    <a href="tel:988" class="emergency-btn">📞 Call 988 Crisis Hotline</a>
                    <a href="sms:741741" class="emergency-btn">💬 Text HOME to 741741</a>
                    
                    <textarea placeholder="Write your thoughts here. They'll be saved locally and private."></textarea>
                    
                    <script>
                      // Auto-save to localStorage
                      const textarea = document.querySelector('textarea');
                      textarea.addEventListener('input', (e) => {
                        localStorage.setItem('alchm_offline_emergency', e.target.value);
                      });
                      
                      // Load saved text
                      const saved = localStorage.getItem('alchm_offline_emergency');
                      if (saved) textarea.value = saved;
                    </script>
                  </div>
                </body>
                </html>
              `, {
                headers: { 'Content-Type': 'text/html' }
              });
            });
        })
    );
    return;
  }
  
  // STANDARD: For other resources, try network first
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone))
              .catch(error => console.warn('Cache put failed:', error));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || new Response('Offline - Please try again when connected', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  }
});

// EMERGENCY: Handle crisis detection messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CRISIS_DETECTED') {
    console.log('🚨 Crisis detected - preparing emergency resources');
    
    // Pre-cache emergency resources immediately
    caches.open(EMERGENCY_CACHE)
      .then(cache => {
        return cache.addAll(['/emergency', '/auth/login']);
      })
      .catch(error => console.warn('🚨 Emergency pre-cache failed:', error));
  }
});

console.log('🚨 Emergency Service Worker loaded and ready');