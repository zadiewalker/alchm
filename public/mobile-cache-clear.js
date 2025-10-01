// MOBILE EMERGENCY: Aggressive cache clearing for sage colors
console.log('🚨 MOBILE EMERGENCY: Starting aggressive cache clearing for sage colors');

// Clear all possible caches
if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    console.log('🧹 Clearing', cacheNames.length, 'caches');
    return Promise.all(
      cacheNames.map(function(cacheName) {
        console.log('🧹 Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(function() {
    console.log('✅ All caches cleared for sage colors');
    
    // Force reload to ensure fresh styles
    if (document.readyState === 'complete') {
      console.log('🔄 Force reloading to apply sage colors');
      window.location.reload(true);
    }
  });
}

// Clear service worker if it exists
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      console.log('🧹 Unregistering service worker');
      registration.unregister();
    }
  });
}

// Clear localStorage for styles
try {
  Object.keys(localStorage).forEach(key => {
    if (key.includes('style') || key.includes('css') || key.includes('color')) {
      localStorage.removeItem(key);
      console.log('🧹 Cleared localStorage:', key);
    }
  });
} catch (e) {
  console.log('LocalStorage clear failed:', e);
}

// Force CSS refresh by touching stylesheets
document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
  const href = link.href;
  link.href = href + (href.includes('?') ? '&' : '?') + 'cache-bust=' + Date.now();
  console.log('🔄 Refreshed stylesheet:', href);
});

console.log('✅ Mobile cache clear complete');