/**
 * SACRED CACHE CLEAR - Mobile Optimized
 * Clears all caches to show Sacred ALCHM design with trauma-informed styling
 */

const SACRED_VERSION = '1763369189670-sacred';

async function clearSacredCache() {
    console.log('🪲 Starting Sacred cache clear...');
    
    try {
        // 1. Clear all Service Worker caches
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            console.log('Found caches:', cacheNames);
            
            const deletePromises = cacheNames.map(async (cacheName) => {
                console.log('🧹 Deleting cache:', cacheName);
                return await caches.delete(cacheName);
            });
            
            await Promise.all(deletePromises);
            console.log('✅ All caches cleared');
        }
        
        // 2. Clear browser storage
        if (typeof(Storage) !== "undefined") {
            // Clear localStorage
            const lsKeys = Object.keys(localStorage);
            lsKeys.forEach(key => {
                if (key.includes('alchm') || key.includes('firebase')) {
                    localStorage.removeItem(key);
                }
            });
            
            // Clear sessionStorage
            sessionStorage.clear();
            console.log('✅ Storage cleared');
        }
        
        // 3. Clear IndexedDB (Firebase offline data)
        if ('indexedDB' in window) {
            try {
                const databases = await indexedDB.databases();
                for (const db of databases) {
                    if (db.name && (db.name.includes('firebase') || db.name.includes('alchm'))) {
                        console.log('🗄️ Deleting database:', db.name);
                        indexedDB.deleteDatabase(db.name);
                    }
                }
            } catch (e) {
                console.log('IndexedDB clear failed:', e);
            }
        }
        
        // 4. Unregister old Service Workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                console.log('🔄 Unregistering SW:', registration.scope);
                await registration.unregister();
            }
        }
        
        // 5. Set Sacred version marker
        localStorage.setItem('alchm-version', SACRED_VERSION);
        localStorage.setItem('alchm-sacred-update', Date.now().toString());
        localStorage.setItem('alchm-cache-cleared', 'true');
        
        console.log('🌿 Sacred cache clear complete!');
        return true;
        
    } catch (error) {
        console.error('❌ Sacred cache clear failed:', error);
        return false;
    }
}

// Auto-execute for mobile
if (typeof window !== 'undefined') {
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('📱 Mobile device detected - Sacred cache clear available');
        
        // Add to window for easy access
        window.clearSacredCache = clearSacredCache;
        
        // Check if already cleared recently
        const lastCleared = localStorage.getItem('alchm-sacred-update');
        const shouldClear = !lastCleared || (Date.now() - parseInt(lastCleared)) > 300000; // 5 minutes
        
        if (shouldClear) {
            console.log('🪲 Auto-clearing Sacred cache for mobile...');
            // Don't auto-clear immediately to prevent loops
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (confirm('Clear cache to see Sacred ALCHM design?')) {
                        clearSacredCache().then(success => {
                            if (success) {
                                window.location.href = `https://alchmapp.web.app/?v=${SACRED_VERSION}&sacred=true`;
                            }
                        });
                    }
                }, 2000);
            });
        }
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { clearSacredCache, SACRED_VERSION };
}