// Cache clearing script for ALCHM users experiencing cached content issues
(function() {
    'use strict';
    
    // Clear browser cache for ALCHM domain
    function clearALCHMCache() {
        // Force reload without cache
        if ('caches' in window) {
            caches.keys().then(function(names) {
                names.forEach(function(name) {
                    if (name.includes('alchm') || name.includes('firebase')) {
                        caches.delete(name);
                    }
                });
            });
        }
        
        // Clear localStorage for ALCHM
        if (window.localStorage) {
            Object.keys(localStorage).forEach(function(key) {
                if (key.includes('alchm') || key.includes('firebase')) {
                    localStorage.removeItem(key);
                }
            });
        }
        
        // Clear sessionStorage
        if (window.sessionStorage) {
            Object.keys(sessionStorage).forEach(function(key) {
                if (key.includes('alchm') || key.includes('firebase')) {
                    sessionStorage.removeItem(key);
                }
            });
        }
        
        // Force page reload
        window.location.reload(true);
    }
    
    // Run cache clear
    clearALCHMCache();
})();