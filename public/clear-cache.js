// ALCHM Mobile Cache Clearer - Force Refresh for Button Updates
// Run this in the browser console if you're still seeing old button sizes

(function() {
  console.log('🧹 ALCHM Cache Cleaner v2.1 - Clearing mobile cache...');
  
  // Clear all service worker caches
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        console.log('🗑️ Unregistering service worker...');
        registration.unregister();
      }
    });
  }
  
  // Clear all cache storage
  if ('caches' in window) {
    caches.keys().then(function(names) {
      names.forEach(function(name) {
        console.log('🗑️ Deleting cache:', name);
        caches.delete(name);
      });
    });
  }
  
  // Clear browser storage
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🗑️ Cleared localStorage and sessionStorage');
  } catch(e) {
    console.log('⚠️ Could not clear storage:', e);
  }
  
  // Clear IndexedDB if present
  if ('indexedDB' in window) {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        if (db.name && db.name.includes('firebase')) {
          console.log('🗑️ Clearing Firebase database:', db.name);
          indexedDB.deleteDatabase(db.name);
        }
      });
    }).catch(e => console.log('IndexedDB clear attempted'));
  }
  
  console.log('✅ Cache clearing complete! Refreshing page...');
  
  // Force hard refresh
  setTimeout(() => {
    window.location.reload(true);
  }, 1000);
})();