// ===== ALCHM CRISIS ALERT SERVICE WORKER =====
// Firebase Cloud Messaging service worker for background notifications

// Import Firebase messaging scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
firebase.initializeApp({
  apiKey: "AIzaSyBpZmKmUKLKtF8VJhaqLZdJ7rqEowTaOmY",
  authDomain: "alchm-digital-sanctuary.firebaseapp.com",
  projectId: "alchm-digital-sanctuary",
  messagingSenderId: "509595056499",
  appId: "1:509595056499:web:8d08b7b44b72c1b2dc835a"
});

// Get messaging instance
const messaging = firebase.messaging();

// ===== BACKGROUND MESSAGE HANDLING =====
messaging.onBackgroundMessage((payload) => {
  console.log('🚨 ALCHM Crisis Alert received in background:', payload);

  const { notification, data } = payload;
  
  // Extract crisis alert data
  const alertLevel = data?.riskLevel || 'HIGH';
  const participantId = data?.participantId || 'Unknown';
  const culturalContext = data?.culturalContext ? JSON.parse(data.culturalContext) : [];
  
  // Determine notification urgency
  const isExtreme = alertLevel === 'EXTREME';
  const isCritical = alertLevel === 'CRITICAL' || alertLevel === 'EXTREME';
  
  // Create notification title with urgency indicator
  const notificationTitle = `${isExtreme ? '🔴 EXTREME' : '🚨'} ALCHM Crisis Alert`;
  
  // Build notification body with key details
  let notificationBody = `Participant: ${participantId.substring(0, 8)}...\nRisk Level: ${alertLevel}`;
  
  if (culturalContext.length > 0) {
    notificationBody += `\nCultural: ${culturalContext.slice(0, 2).join(', ')}`;
  }
  
  notificationBody += '\n\nTap to respond immediately';

  // Notification options with crisis-specific settings
  const notificationOptions = {
    body: notificationBody,
    icon: '/icons/crisis-alert-icon-192.png',
    badge: '/icons/crisis-badge-72.png',
    image: data?.alertImage || '/icons/crisis-alert-banner.png',
    
    // Crisis-specific notification behavior
    tag: `crisis-alert-${data?.alertId || Date.now()}`,
    requireInteraction: isCritical, // Keep on screen for critical alerts
    persistent: isExtreme, // Persistent for extreme alerts
    renotify: true, // Always show even if similar notification exists
    
    // Visual and audio urgency
    vibrate: isExtreme ? [500, 100, 500, 100, 500] : [200, 100, 200], // Emergency vibration pattern
    silent: false, // Always play sound for crisis alerts
    
    // Action buttons for quick response
    actions: [
      {
        action: 'acknowledge',
        title: '✓ Acknowledge (2min)',
        icon: '/icons/acknowledge-icon.png'
      },
      {
        action: 'respond',
        title: '🚨 Respond Now',
        icon: '/icons/respond-icon.png'
      },
      {
        action: 'escalate',
        title: '📞 Call Backup',
        icon: '/icons/escalate-icon.png'
      }
    ],
    
    // Data for click handling
    data: {
      alertId: data?.alertId,
      riskLevel: alertLevel,
      participantId: participantId,
      culturalContext: data?.culturalContext,
      triggerIndicators: data?.triggerIndicators,
      timestamp: data?.timestamp || new Date().toISOString(),
      alertUrl: `https://alchm-digital-sanctuary.web.app/crisis/alert/${data?.alertId}`,
      dashboardUrl: 'https://alchm-digital-sanctuary.web.app/crisis/dashboard'
    }
  };

  // Show notification with crisis alert details
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// ===== NOTIFICATION CLICK HANDLING =====
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Crisis alert notification clicked:', event);
  
  const { action, data } = event.notification;
  const { alertId, alertUrl, dashboardUrl } = data || {};
  
  // Close the notification
  event.notification.close();
  
  // Handle different notification actions
  event.waitUntil(
    (async () => {
      try {
        // Get all open windows/tabs
        const windowClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });
        
        let targetUrl = dashboardUrl;
        
        // Determine action and target URL
        switch (action) {
          case 'acknowledge':
            targetUrl = `${alertUrl}?action=acknowledge`;
            console.log('📝 Acknowledging crisis alert:', alertId);
            break;
            
          case 'respond':
            targetUrl = `${alertUrl}?action=respond`;
            console.log('🚨 Responding to crisis alert:', alertId);
            break;
            
          case 'escalate':
            targetUrl = `${alertUrl}?action=escalate`;
            console.log('📞 Escalating crisis alert:', alertId);
            break;
            
          default:
            // Default click opens dashboard
            targetUrl = alertUrl || dashboardUrl;
            console.log('📊 Opening crisis dashboard');
        }
        
        // Check if crisis dashboard is already open
        const existingClient = windowClients.find(client => 
          client.url.includes('crisis') || client.url.includes('alert')
        );
        
        if (existingClient) {
          // Focus existing crisis window and navigate to alert
          await existingClient.focus();
          await existingClient.navigate(targetUrl);
        } else {
          // Open new window with crisis alert
          await clients.openWindow(targetUrl);
        }
        
        // Log notification interaction for analytics
        await logNotificationInteraction({
          alertId,
          action: action || 'default_click',
          timestamp: new Date().toISOString(),
          userAgent: self.navigator.userAgent
        });
        
      } catch (error) {
        console.error('❌ Failed to handle notification click:', error);
        // Fallback: open dashboard in new window
        await clients.openWindow(dashboardUrl || 'https://alchm-digital-sanctuary.web.app/crisis/dashboard');
      }
    })()
  );
});

// ===== NOTIFICATION CLOSE HANDLING =====
self.addEventListener('notificationclose', (event) => {
  console.log('📴 Crisis notification dismissed:', event.notification.data);
  
  const { alertId } = event.notification.data || {};
  
  // Log dismissal for analytics (missed alert tracking)
  event.waitUntil(
    logNotificationInteraction({
      alertId,
      action: 'dismissed',
      timestamp: new Date().toISOString(),
      userAgent: self.navigator.userAgent
    })
  );
});

// ===== UTILITY FUNCTIONS =====

async function logNotificationInteraction(data) {
  try {
    // Send interaction data to analytics endpoint
    const response = await fetch('/api/crisis/notification-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'notification_interaction',
        ...data
      })
    });
    
    if (!response.ok) {
      throw new Error(`Analytics logging failed: ${response.status}`);
    }
  } catch (error) {
    console.error('📊 Failed to log notification interaction:', error);
  }
}

// ===== SERVICE WORKER LIFECYCLE =====

// Cache crisis resources for offline access
self.addEventListener('install', (event) => {
  console.log('⚡ ALCHM Crisis Service Worker installing...');
  
  event.waitUntil(
    caches.open('alchm-crisis-v1').then((cache) => {
      return cache.addAll([
        '/crisis/dashboard',
        '/crisis/resources',
        '/icons/crisis-alert-icon-192.png',
        '/icons/crisis-badge-72.png',
        '/manifest.json'
      ]);
    })
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ ALCHM Crisis Service Worker activated');
  
  event.waitUntil(
    // Clean up old caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'alchm-crisis-v1') {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Handle fetch events for offline crisis resources
self.addEventListener('fetch', (event) => {
  // Only cache crisis-related requests
  if (event.request.url.includes('/crisis/') || 
      event.request.url.includes('/icons/crisis-')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
    );
  }
});