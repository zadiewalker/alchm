#!/usr/bin/env node
// ALCHM Emergency Cache Bust
// Force immediate cache invalidation across all user browsers

const fs = require('fs');
const path = require('path');

class EmergencyCacheBust {
  constructor() {
    this.deploymentId = 'FdtqGkDehojY0aRYUiiwJ';
    this.timestamp = Date.now();
    this.outDir = path.join(process.cwd(), 'out');
  }

  async execute() {
    console.log('🚨 EMERGENCY CACHE BUST INITIATED');
    console.log('─'.repeat(50));
    console.log(`🎯 Target Build: ${this.deploymentId}`);
    console.log(`⏰ Timestamp: ${this.timestamp}`);
    console.log();

    try {
      // 1. Update service worker with emergency cache versioning
      await this.updateServiceWorker();
      
      // 2. Add cache-busting to critical assets
      await this.addCacheBustingHeaders();
      
      // 3. Create emergency manifest with version info
      await this.createEmergencyManifest();
      
      // 4. Generate client-side cache clearing script
      await this.createCacheClearingScript();
      
      console.log('✅ Emergency cache bust completed!');
      console.log();
      console.log('NEXT STEPS:');
      console.log('1. Deploy immediately: firebase deploy --only hosting');
      console.log('2. Monitor with: node scripts/live-deployment-monitor.js');
      console.log('3. Verify with: node scripts/deployment-verification.js');
      console.log();
      console.log('⚠️  Users may need to hard refresh once for SW update');

    } catch (error) {
      console.error('❌ Emergency cache bust failed:', error.message);
      process.exit(1);
    }
  }

  async updateServiceWorker() {
    console.log('🔧 Updating service worker with emergency versioning...');
    
    const swPath = path.join(this.outDir, 'sw.js');
    
    if (!fs.existsSync(swPath)) {
      console.log('⚠️  sw.js not found, creating emergency version...');
      await this.createEmergencyServiceWorker();
      return;
    }

    let swContent = fs.readFileSync(swPath, 'utf8');
    
    // Force unique cache names with timestamp
    const cacheVersion = `emergency-${this.timestamp}`;
    
    swContent = swContent.replace(
      /const CACHE_VERSION = `v\${Date\.now\(\)}`/,
      `const CACHE_VERSION = '${cacheVersion}'`
    );

    // Add emergency cache clearing on activation
    const emergencyActivation = `
// EMERGENCY: Clear ALL caches on activation
self.addEventListener('activate', (event) => {
  console.log('[SW EMERGENCY] Clearing all caches for deployment ${this.deploymentId}');
  event.waitUntil(
    (async () => {
      // Delete ALL existing caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          console.log('[SW EMERGENCY] Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );

      await self.clients.claim();
      
      // Force refresh all controlled clients
      const clients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      
      clients.forEach(client => {
        client.postMessage({ 
          type: 'EMERGENCY_CACHE_CLEARED',
          deploymentId: '${this.deploymentId}',
          timestamp: ${this.timestamp}
        });
      });
    })()
  );
});`;

    // Replace the existing activate listener
    swContent = swContent.replace(
      /self\.addEventListener\('activate'[\s\S]*?\}\);/m,
      emergencyActivation
    );

    fs.writeFileSync(swPath, swContent);
    console.log('✅ Service worker updated with emergency cache clearing');
  }

  async createEmergencyServiceWorker() {
    const swPath = path.join(this.outDir, 'sw.js');
    const emergencySW = `
// ALCHM Emergency Service Worker - Cache Bust ${this.deploymentId}
const DEPLOYMENT_ID = '${this.deploymentId}';
const CACHE_VERSION = 'emergency-${this.timestamp}';

console.log('[SW EMERGENCY] Initializing with deployment:', DEPLOYMENT_ID);

// Immediate activation
self.addEventListener('install', (event) => {
  console.log('[SW EMERGENCY] Installing...');
  self.skipWaiting();
});

// Clear all caches on activation
self.addEventListener('activate', (event) => {
  console.log('[SW EMERGENCY] Activating and clearing all caches...');
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => {
          console.log('[SW EMERGENCY] Clearing cache:', name);
          return caches.delete(name);
        })
      );
      
      await self.clients.claim();
      
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.postMessage({
          type: 'CACHE_CLEARED',
          deploymentId: DEPLOYMENT_ID
        });
      });
    })()
  );
});

// Network-only strategy for all requests during emergency
self.addEventListener('fetch', (event) => {
  // Force fresh network requests
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).catch(error => {
      console.error('[SW EMERGENCY] Fetch failed:', error);
      return new Response('Emergency mode: Network required', { status: 503 });
    })
  );
});`;

    fs.writeFileSync(swPath, emergencySW);
    console.log('✅ Emergency service worker created');
  }

  async addCacheBustingHeaders() {
    console.log('🔄 Adding cache-busting query parameters...');
    
    const indexPath = path.join(this.outDir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      
      // Add cache-busting to CSS imports
      content = content.replace(
        /href="([^"]*\.css)"/g,
        `href="$1?v=${this.timestamp}"`
      );
      
      // Add cache-busting to JS imports  
      content = content.replace(
        /src="([^"]*\.js)"/g,
        `src="$1?v=${this.timestamp}"`
      );
      
      fs.writeFileSync(indexPath, content);
      console.log('✅ Cache-busting parameters added to index.html');
    }
  }

  async createEmergencyManifest() {
    console.log('📋 Creating emergency deployment manifest...');
    
    const manifest = {
      deploymentId: this.deploymentId,
      timestamp: this.timestamp,
      version: `emergency-${this.timestamp}`,
      cacheBust: true,
      instructions: [
        'Hard refresh required: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)',
        'Clear browser data if issues persist',
        'Check Developer Tools > Application > Service Workers for updates'
      ],
      verification: {
        cssHash: 'ded9ef65f6045742',
        buildId: this.deploymentId,
        swVersion: `emergency-${this.timestamp}`
      }
    };
    
    const manifestPath = path.join(this.outDir, 'emergency-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Emergency manifest created');
  }

  async createCacheClearingScript() {
    console.log('🧹 Creating client-side cache clearing script...');
    
    const clearScript = `
// ALCHM Emergency Cache Clear - Deployment ${this.deploymentId}
(function() {
  console.log('[ALCHM EMERGENCY] Cache clearing initiated for deployment ${this.deploymentId}');
  
  // Clear all browser caches
  if ('caches' in window) {
    caches.keys().then(function(names) {
      names.forEach(function(name) {
        console.log('[ALCHM] Deleting cache:', name);
        caches.delete(name);
      });
    });
  }
  
  // Unregister service worker if needed
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      registrations.forEach(function(registration) {
        console.log('[ALCHM] Updating service worker registration');
        registration.update();
      });
    });
    
    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', function(event) {
      if (event.data.type === 'CACHE_CLEARED' || event.data.type === 'EMERGENCY_CACHE_CLEARED') {
        console.log('[ALCHM] Service worker cache cleared, deployment:', event.data.deploymentId);
        
        // Show user notification
        if (document.createElement) {
          const notification = document.createElement('div');
          notification.style.cssText = 'position:fixed;top:10px;right:10px;background:#10b981;color:white;padding:16px;border-radius:8px;font-family:system-ui;font-size:14px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15)';
          notification.textContent = 'ALCHM updated successfully! ✨';
          document.body?.appendChild(notification);
          
          setTimeout(() => notification.remove(), 5000);
        }
      }
    });
  }
  
  // Force reload if still showing old version after 3 seconds
  setTimeout(function() {
    const cssLink = document.querySelector('link[href*="ded9ef65f6045742"]');
    if (!cssLink) {
      console.log('[ALCHM] Still showing old version, forcing reload...');
      location.reload(true);
    }
  }, 3000);
})();`;

    const scriptPath = path.join(this.outDir, 'emergency-cache-clear.js');
    fs.writeFileSync(scriptPath, clearScript);
    
    // Add to index.html
    const indexPath = path.join(this.outDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      const scriptTag = `<script src="/emergency-cache-clear.js?v=${this.timestamp}"></script>`;
      
      if (content.includes('</body>')) {
        content = content.replace('</body>', `  ${scriptTag}\n</body>`);
      } else {
        content += scriptTag;
      }
      
      fs.writeFileSync(indexPath, content);
    }
    
    console.log('✅ Cache clearing script created and injected');
  }
}

// CLI execution
if (require.main === module) {
  const cacheBust = new EmergencyCacheBust();
  cacheBust.execute().catch(console.error);
}

module.exports = EmergencyCacheBust;