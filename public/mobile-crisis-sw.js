/**
 * ALCHM Mobile Crisis Service Worker
 * Provides offline capabilities for users in emotional distress
 * Prioritizes crisis resources and enables basic journaling without auth
 */

const CACHE_VERSION = 'alchm-mobile-crisis-v1.0.0';
const CRISIS_CACHE = `alchm-crisis-${CACHE_VERSION}`;
const AUTH_CACHE = `alchm-auth-${CACHE_VERSION}`;

// Critical resources that must work offline for crisis situations
const CRISIS_RESOURCES = [
  '/crisis-resources',
  '/offline',
  '/crisis-hotlines.json',
  '/emergency-contacts.json',
  '/crisis-breathing-exercises.json',
  '/crisis-grounding-techniques.json',
  '/offline-crisis-guide.html',
  '/auth/login',
  '/journal/offline',
  '/emergency-contacts',
  '/styles/mobile-crisis-optimization.css',
  '/manifest.webmanifest'
];

// Auth-related resources for offline queueing
const AUTH_RESOURCES = [
  '/api/session/login',
  '/auth/login',
  '/_next/static/chunks/pages/_app',
  '/favicon.ico'
];

// Install: Cache critical crisis resources immediately
self.addEventListener('install', (event) => {
  console.log('🚨 Installing ALCHM Crisis Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache crisis resources with highest priority
      caches.open(CRISIS_CACHE).then((cache) => {
        console.log('📱 Caching crisis resources for offline access');
        return cache.addAll(CRISIS_RESOURCES.filter(url => !url.startsWith('http')));
      }),
      
      // Cache auth resources for offline queueing
      caches.open(AUTH_CACHE).then((cache) => {
        console.log('🔐 Caching auth resources for mobile optimization');
        return cache.addAll(AUTH_RESOURCES);
      }),
      
      // Skip waiting to activate immediately for crisis situations
      self.skipWaiting()
    ])
  );
});

// Activate: Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('✅ Activating ALCHM Crisis Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('alchm-') && 
              cacheName !== CRISIS_CACHE && 
              cacheName !== AUTH_CACHE
            )
            .map(cacheName => {
              console.log('🗑️ Cleaning up old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Claim all clients immediately for crisis access
      self.clients.claim()
    ])
  );
});

// Fetch: Crisis-first offline strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different request types with crisis-first priority
  if (isCrisisResource(url.pathname)) {
    // Crisis resources: Cache first, never fail
    event.respondWith(handleCrisisRequest(request));
  } else if (isAuthResource(url.pathname)) {
    // Auth resources: Network first with gentle fallback
    event.respondWith(handleAuthRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    // API requests: Network first with offline queueing
    event.respondWith(handleAPIRequest(request));
  } else {
    // Regular resources: Stale while revalidate
    event.respondWith(handleRegularRequest(request));
  }
});

// Check if resource is crisis-critical
function isCrisisResource(pathname) {
  const crisisPaths = ['/crisis', '/emergency', '/offline', '/988'];
  return crisisPaths.some(path => pathname.includes(path));
}

// Check if resource is auth-related
function isAuthResource(pathname) {
  return pathname.includes('/auth/') || pathname.includes('/login');
}

// Handle crisis resources with cache-first strategy (never fail)
async function handleCrisisRequest(request) {
  try {
    // Always try cache first for crisis resources
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('🛡️ Serving crisis resource from cache:', request.url);
      
      // Update cache in background
      updateCacheInBackground(request);
      
      return cachedResponse;
    }
    
    // If not cached, try network and cache result
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CRISIS_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('📥 Cached new crisis resource:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('⚠️ Crisis resource failed:', error);
    
    // Return emergency offline page for critical resources
    return createEmergencyResponse();
  }
}

// Handle auth requests with network-first, gentle fallback
async function handleAuthRequest(request) {
  try {
    // Try network first for fresh auth data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful auth responses
      const cache = await caches.open(AUTH_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('🔐 Cached auth response:', request.url);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('📱 Network failed, checking auth cache for:', request.url);
    
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('💾 Serving auth from cache:', request.url);
      return cachedResponse;
    }
    
    // Return offline auth page with guest mode option
    if (request.url.includes('/auth/login')) {
      return createOfflineAuthResponse();
    }
    
    throw error;
  }
}

// Handle API requests with offline queueing
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(AUTH_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('📡 API request failed, handling offline:', request.url);
    
    // For auth-related API calls, provide offline response
    if (request.url.includes('/api/session') || request.url.includes('/api/auth')) {
      return new Response(
        JSON.stringify({ 
          offline: true,
          message: 'You are offline. Sign-in will continue when connection returns.',
          guestMode: true
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Try cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Handle regular requests with stale-while-revalidate
async function handleRegularRequest(request) {
  const cachedResponse = await caches.match(request);
  
  // Update cache in background
  const fetchPromise = updateCacheInBackground(request);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  try {
    return await fetchPromise;
  } catch (error) {
    // Return basic offline response
    return createOfflineResponse();
  }
}

// Update cache in background
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(AUTH_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Background update failed, but that's okay
    console.log('Background cache update failed:', error);
    return null;
  }
}

// Create emergency offline response for crisis situations
function createEmergencyResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Emergency Support - ALCHM</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0; 
          padding: 20px;
          background: linear-gradient(145deg, #a4b792 0%, #8fa37c 100%);
          color: #fefcfb;
          text-align: center;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 400px;
          background: rgba(254, 252, 251, 0.1);
          backdrop-filter: blur(20px);
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px solid rgba(254, 252, 251, 0.2);
        }
        .sacred-contract {
          background: rgba(164, 183, 146, 0.15) !important;
          backdrop-filter: blur(8px) !important;
          border: 1px solid rgba(164, 183, 146, 0.3) !important;
          border-radius: 16px !important;
          padding: 2rem !important;
          margin: 2rem 0 !important;
          color: #2c2c2c !important;
          text-align: center !important;
        }
        .crisis-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          margin: 10px 0;
          width: 100%;
          min-height: 60px;
          text-decoration: none;
          display: block;
          touch-action: manipulation;
          -webkit-tap-highlight-color: rgba(220, 38, 38, 0.3);
        }
        .crisis-button:active {
          transform: scale(0.98);
        }
        .support-link {
          color: white;
          font-size: 24px;
          font-weight: bold;
          text-decoration: none;
          display: block;
          margin: 20px 0;
        }
        h1 { 
          font-size: 24px; 
          margin-bottom: 20px; 
          font-weight: 300;
          color: #fefcfb;
        }
        h2 {
          font-size: 18px;
          font-weight: 300;
          color: #2c2c2c;
          margin-bottom: 1rem;
        }
        p { 
          font-size: 16px; 
          line-height: 1.5; 
          margin-bottom: 20px; 
          color: #fefcfb;
        }
        .wisdom-text {
          color: #525f44 !important;
          font-style: italic;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚨 You are safe</h1>
        <p>You're offline, but your sacred space remains.</p>
        
        <div class="sacred-contract">
          <h2>This is your sacred contract.</h2>
          <p class="wisdom-text">
            You show up. You write the truth. We hold the space, protect the words, 
            and mirror back your wisdom. Even offline, this contract holds.
          </p>
        </div>
        
        <a href="tel:988" class="crisis-button">
          📞 Call 988 Lifeline
        </a>
        
        <a href="tel:911" class="crisis-button">
          🚨 Call 911 Emergency
        </a>
        
        <a href="sms:741741" class="crisis-button">
          💬 Text HOME to 741741
        </a>
        
        <p style="font-size: 14px; opacity: 0.8;">
          ALCHM will reconnect automatically when your internet returns.
        </p>
      </div>
      
      <script>
        // Force Sacred Contract styling on load
        setTimeout(() => {
          const contract = document.querySelector('.sacred-contract');
          if (contract) {
            contract.style.cssText = \`
              background: rgba(164, 183, 146, 0.15) !important;
              backdrop-filter: blur(8px) !important;
              border: 1px solid rgba(164, 183, 146, 0.3) !important;
              border-radius: 16px !important;
              padding: 2rem !important;
              margin: 2rem 0 !important;
              color: #2c2c2c !important;
              text-align: center !important;
            \`;
          }
        }, 100);
      </script>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create offline auth response with guest mode
function createOfflineAuthResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline Mode - ALCHM</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0; 
          padding: 20px;
          background: linear-gradient(145deg, #a4b792 0%, #8fa37c 100%);
          color: white;
          text-align: center;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 420px;
          background: rgba(254, 252, 251, 0.1);
          backdrop-filter: blur(20px);
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .guest-button {
          background: rgba(254, 252, 251, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 16px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          margin: 10px 0;
          width: 100%;
          min-height: 60px;
          text-decoration: none;
          display: block;
          transition: all 0.2s ease;
        }
        .guest-button:hover {
          background: rgba(254, 252, 251, 0.3);
          transform: translateY(-1px);
        }
        .crisis-notice {
          background: rgba(220, 38, 38, 0.9);
          padding: 12px 16px;
          border-radius: 12px;
          margin: 20px 0;
          font-size: 14px;
        }
        h1 { font-size: 24px; margin-bottom: 16px; font-weight: 300; }
        p { font-size: 16px; line-height: 1.5; margin-bottom: 20px; opacity: 0.9; }
      </style>
      <script>
        // Auto-retry connection every 30 seconds
        setInterval(() => {
          fetch('/auth/login', { mode: 'no-cors' })
            .then(() => {
              window.location.reload();
            })
            .catch(() => {
              // Still offline, keep trying
            });
        }, 30000);
      </script>
    </head>
    <body>
      <div class="container">
        <div style="font-size: 48px; margin-bottom: 20px;">🌿</div>
        
        <h1>You're offline</h1>
        <p>Your sanctuary travels with you. You can still journal while we reconnect.</p>
        
        <a href="/journal/offline" class="guest-button">
          Continue as Guest
        </a>
        
        <p style="font-size: 14px; opacity: 0.7;">
          We'll sign you in automatically when connection returns.
        </p>
        
        <div class="crisis-notice">
          <strong>In crisis?</strong> Call 988 or text HOME to 741741
        </div>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Create basic offline response
function createOfflineResponse() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - ALCHM</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          margin: 0; 
          padding: 20px;
          background: #a4b792;
          color: white;
          text-align: center;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container { max-width: 400px; }
        .retry-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="font-size: 48px; margin-bottom: 20px;">🌿</div>
        <h1>You're offline</h1>
        <p>Your sanctuary is loading. Check your connection and try again.</p>
        <button class="retry-button" onclick="location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    status: 200,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Message event for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('📱 ALCHM Mobile Crisis Service Worker loaded successfully');