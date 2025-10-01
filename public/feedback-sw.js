// ALCHM Feedback Form Service Worker - Trauma-Informed Offline Support
const CACHE_NAME = 'alchm-feedback-v1';
const OFFLINE_URL = '/user-testing-feedback.html';

// Cache essential resources
const urlsToCache = [
  '/user-testing-feedback.html',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('ALCHM Feedback: Caching offline resources for vulnerable users');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Handle fetch requests with offline-first strategy
self.addEventListener('fetch', event => {
  // Only handle GET requests for the feedback form
  if (event.request.method === 'GET' && 
      event.request.url.includes('user-testing-feedback.html')) {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Return cached version immediately if available
          if (response) {
            return response;
          }

          // Fallback to network, then cache the response
          return fetch(event.request)
            .then(response => {
              // Don't cache invalid responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Network failed, return offline page if cached
              return caches.match(OFFLINE_URL);
            });
        })
    );
  }
});

// Handle background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'feedback-sync') {
    event.waitUntil(syncOfflineFeedback());
  }
});

// Sync offline feedback when connection is restored
async function syncOfflineFeedback() {
  try {
    const offlineQueue = await getOfflineQueue();
    
    for (const feedback of offlineQueue) {
      try {
        // Attempt to submit feedback
        await submitFeedback(feedback);
        // Remove from queue after successful submission
        await removeFromQueue(feedback.id);
      } catch (error) {
        console.log('Still offline or submission failed, keeping in queue');
      }
    }
  } catch (error) {
    console.error('Error syncing offline feedback:', error);
  }
}

// Get offline feedback queue from IndexedDB
async function getOfflineQueue() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ALCHMFeedbackDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineQueue'], 'readonly');
      const store = transaction.objectStore('offlineQueue');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('offlineQueue', { keyPath: 'id' });
    };
  });
}

// Submit feedback to Firebase
async function submitFeedback(feedbackData) {
  // This would typically use the Firebase SDK to submit
  // For now, we'll just simulate the submission
  const response = await fetch('/api/submit-feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedbackData)
  });

  if (!response.ok) {
    throw new Error('Submission failed');
  }

  return response.json();
}

// Remove feedback from offline queue
async function removeFromQueue(feedbackId) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ALCHMFeedbackDB', 1);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['offlineQueue'], 'readwrite');
      const store = transaction.objectStore('offlineQueue');
      const deleteRequest = store.delete(feedbackId);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});