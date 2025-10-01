// NUCLEAR OPTION: Complete cache and style destruction for mobile sage colors
console.log('💥 NUCLEAR OPTION: Complete cache destruction for sage colors');

// Force sage colors with brute force JavaScript
const SAGE_PRIMARY = '#a4b792';
const SAGE_SECONDARY = '#8fa37c';
const SAGE_TERTIARY = '#7a8f67';

function bruteForceSageColors() {
  console.log('💥 BRUTE FORCE: Applying sage colors to all elements');
  
  // Target html and body first
  document.documentElement.style.cssText = `background: linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%) !important;`;
  document.body.style.cssText = `background: linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%) !important;`;
  
  // Target all main elements
  document.querySelectorAll('main, .sanctuary-layout, .auth-sanctuary, .home-sanctuary').forEach(el => {
    el.style.cssText = `background: linear-gradient(145deg, ${SAGE_PRIMARY} 0%, ${SAGE_SECONDARY} 100%) !important; color: #fefcfb !important;`;
  });
  
  // Override any CSS custom properties
  document.documentElement.style.setProperty('--surface', SAGE_PRIMARY, 'important');
  document.documentElement.style.setProperty('--sage', SAGE_PRIMARY, 'important');
  document.documentElement.style.setProperty('--sage-primary', SAGE_PRIMARY, 'important');
  document.documentElement.style.setProperty('--sage-secondary', SAGE_SECONDARY, 'important');
  
  console.log('✅ Brute force sage colors applied');
}

// Nuclear cache clearing
function nuclearCacheClear() {
  // Clear everything possible
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        caches.delete(cacheName);
        console.log('💥 Nuked cache:', cacheName);
      });
    });
  }
  
  // Clear all storage
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('💥 Nuked all storage');
  } catch (e) {
    console.log('Storage clear failed:', e);
  }
  
  // Clear browser database storage
  if ('indexedDB' in window) {
    try {
      indexedDB.databases().then(databases => {
        databases.forEach(db => {
          indexedDB.deleteDatabase(db.name);
          console.log('💥 Nuked IndexedDB:', db.name);
        });
      });
    } catch (e) {
      console.log('IndexedDB clear failed:', e);
    }
  }
}

// Apply immediately and repeatedly
bruteForceSageColors();
nuclearCacheClear();

// Keep applying every 100ms for first 2 seconds
let forceCount = 0;
const forceInterval = setInterval(() => {
  bruteForceSageColors();
  forceCount++;
  if (forceCount >= 20) {
    clearInterval(forceInterval);
    console.log('💥 Nuclear option complete - 20 force applications completed');
  }
}, 100);

// Apply on DOM changes
const observer = new MutationObserver(() => {
  bruteForceSageColors();
});

observer.observe(document, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
});

console.log('💥 Nuclear option active - monitoring DOM for changes');