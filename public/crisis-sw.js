/**
 * ALCHM Crisis Service Worker
 * Ensures crisis detection and resources work offline
 * 
 * CRITICAL: This worker ensures crisis support is available even when network fails
 * Caches essential crisis resources and provides offline fallbacks
 */

const CACHE_NAME = 'alchm-crisis-v1';
const CRISIS_CACHE_NAME = 'alchm-crisis-resources-v1';

// Essential crisis resources to cache
const CRISIS_RESOURCES = [
  '/api/crisis-detection',
  '/api/health/ping'
];

// Crisis data for offline access
const OFFLINE_CRISIS_DATA = {
  resources: [
    {
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      type: 'phone',
      country: 'US',
      description: '24/7 crisis support and suicide prevention',
      available24h: true
    },
    {
      name: 'Crisis Text Line',
      contact: '741741',
      type: 'text',
      country: 'US',
      description: 'Text HOME to 741741 for 24/7 crisis support',
      available24h: true
    },
    {
      name: 'Emergency Services',
      contact: '911',
      type: 'phone',
      country: 'US',
      description: 'For immediate medical emergencies',
      available24h: true
    },
    {
      name: 'Trevor Project (LGBTQ)',
      contact: '1-866-488-7386',
      type: 'phone',
      country: 'US',
      description: '24/7 crisis support for LGBTQ youth',
      available24h: true
    },
    {
      name: 'Trans Lifeline',
      contact: '877-565-8860',
      type: 'phone',
      country: 'US',
      description: 'Crisis support for transgender individuals',
      available24h: true
    }
  ],
  emergencyContacts: [
    {
      name: 'Emergency Services (US)',
      number: '911',
      country: 'US',
      type: 'emergency'
    },
    {
      name: '988 Suicide & Crisis Lifeline',
      number: '988',
      country: 'US',
      type: 'crisis'
    }
  ],
  patterns: {
    en: [
      'want to die', 'kill myself', 'end it all', 'suicide', 'can\'t go on',
      'better off dead', 'no point living', 'ending my life', 'not worth living'
    ],
    es: [
      'quiero morir', 'matarme', 'suicidio', 'terminar con todo', 'no puedo más'
    ],
    pt: [
      'quero morrer', 'me matar', 'suicídio', 'acabar com tudo', 'não aguento mais'
    ]
  }
};

// Install event - cache crisis resources
self.addEventListener('install', (event) => {
  console.log('Crisis service worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CRISIS_CACHE_NAME).then((cache) => {
        return cache.addAll(CRISIS_RESOURCES.map(url => new Request(url, { cache: 'no-cache' })));
      }),
      // Store offline crisis data
      caches.open(CRISIS_CACHE_NAME).then((cache) => {
        const response = new Response(JSON.stringify(OFFLINE_CRISIS_DATA), {
          headers: { 'Content-Type': 'application/json' }
        });
        return cache.put('/offline-crisis-data', response);
      })
    ]).then(() => {
      console.log('Crisis resources cached successfully');
      self.skipWaiting();
    }).catch((error) => {
      console.error('Failed to cache crisis resources:', error);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Crisis service worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CRISIS_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Crisis service worker activated');
      return self.clients.claim();
    })
  );
});

// Simple offline crisis detection
function detectCrisisOffline(text) {
  if (!text || typeof text !== 'string') return false;
  
  const lowerText = text.toLowerCase();
  
  // Check English patterns
  const englishPatterns = OFFLINE_CRISIS_DATA.patterns.en;
  if (englishPatterns.some(pattern => lowerText.includes(pattern))) {
    return true;
  }
  
  // Check Spanish patterns
  const spanishPatterns = OFFLINE_CRISIS_DATA.patterns.es;
  if (spanishPatterns.some(pattern => lowerText.includes(pattern))) {
    return true;
  }
  
  // Check Portuguese patterns
  const portuguesePatterns = OFFLINE_CRISIS_DATA.patterns.pt;
  if (portuguesePatterns.some(pattern => lowerText.includes(pattern))) {
    return true;
  }
  
  return false;
}

// Create offline crisis response
function createOfflineCrisisResponse(text, crisisDetected) {
  const response = {
    crisisDetected,
    severity: crisisDetected ? 'high' : 'none',
    resources: OFFLINE_CRISIS_DATA.resources,
    interventions: crisisDetected ? [
      'We care about you and want you to be safe',
      'Crisis support is available right now',
      'Call 988 for immediate help',
      'You are not alone in this struggle'
    ] : [],
    culturalConsiderations: [],
    emergencyContacts: OFFLINE_CRISIS_DATA.emergencyContacts,
    confidence: crisisDetected ? 'medium' : 'low',
    urgency: crisisDetected ? 'high' : 'none',
    offline: true,
    timestamp: new Date().toISOString()
  };
  
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Crisis-Offline': 'true'
    }
  });
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle crisis detection API requests
  if (request.url.includes('/api/crisis-detection')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Network request succeeded
          if (response.ok) {
            return response;
          }
          throw new Error('Network response not ok');
        })
        .catch(async (error) => {
          console.log('Crisis detection API failed, using offline fallback:', error);
          
          // Extract text from request body for offline analysis
          let text = '';
          try {
            if (request.method === 'POST') {
              const body = await request.clone().json();
              text = body.text || '';
            }
          } catch (e) {
            console.warn('Could not parse request body:', e);
          }
          
          // Perform offline crisis detection
          const crisisDetected = detectCrisisOffline(text);
          
          return createOfflineCrisisResponse(text, crisisDetected);
        })
    );
    return;
  }
  
  // Handle health check requests
  if (request.url.includes('/api/health/ping')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline status
          return new Response(JSON.stringify({
            status: 'offline',
            crisis: 'available',
            timestamp: new Date().toISOString()
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // Handle offline crisis data requests
  if (request.url.includes('/offline-crisis-data')) {
    event.respondWith(
      caches.match('/offline-crisis-data').then((response) => {
        return response || new Response(JSON.stringify(OFFLINE_CRISIS_DATA), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }
  
  // Default fetch handling
  event.respondWith(
    caches.match(request)
      .then((response) => {
        return response || fetch(request);
      })
      .catch(() => {
        // For navigation requests, return a basic offline page
        if (request.mode === 'navigate') {
          return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>ALCHM - Offline</title>
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                  text-align: center; 
                  padding: 2rem;
                  background: #0f0f23;
                  color: #e2e8f0;
                }
                .crisis-help {
                  background: #ef4444;
                  color: white;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  margin: 1rem 0;
                }
                .phone {
                  font-size: 2rem;
                  font-weight: bold;
                  margin: 0.5rem 0;
                }
              </style>
            </head>
            <body>
              <h1>ALCHM - You're Offline</h1>
              <div class="crisis-help">
                <h2>Crisis Support Always Available</h2>
                <div class="phone">Call 988</div>
                <p>24/7 Suicide & Crisis Lifeline</p>
                <div class="phone">Text 741741</div>
                <p>Crisis Text Line - Text HOME</p>
                <div class="phone">Call 911</div>
                <p>Emergency Services</p>
              </div>
              <p>Crisis resources work even when offline. You are not alone.</p>
            </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        
        return new Response('Offline', { status: 503 });
      })
  );
});

// Handle background sync for crisis events
self.addEventListener('sync', (event) => {
  if (event.tag === 'crisis-event') {
    console.log('Background sync: Crisis event detected while offline');
    
    event.waitUntil(
      // Attempt to sync crisis events when back online
      fetch('/api/crisis-detection', {
        method: 'GET'
      }).then(() => {
        console.log('Crisis detection service reconnected');
      }).catch((error) => {
        console.log('Crisis detection service still unavailable:', error);
      })
    );
  }
});

// Handle push notifications for crisis support
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    if (data.type === 'crisis-support') {
      const options = {
        body: data.message || 'Crisis support resources are available',
        icon: '/icons/crisis-support-192.png',
        badge: '/icons/crisis-badge-72.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
          {
            action: 'call-988',
            title: 'Call 988'
          },
          {
            action: 'text-crisis',
            title: 'Text Crisis Line'
          }
        ],
        data: {
          type: 'crisis-support',
          url: '/crisis-resources'
        }
      };
      
      event.waitUntil(
        self.registration.showNotification('ALCHM Crisis Support', options)
      );
    }
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'call-988') {
    // Attempt to make a call (limited support)
    event.waitUntil(
      clients.openWindow('tel:988')
    );
  } else if (event.action === 'text-crisis') {
    event.waitUntil(
      clients.openWindow('sms:741741?body=HOME')
    );
  } else if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

console.log('Crisis service worker loaded and ready');