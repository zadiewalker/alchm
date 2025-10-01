#!/usr/bin/env node
// ALCHM Deployment Verification Suite
// Verify deployment integrity across global CDN edge locations

const https = require('https');
const crypto = require('crypto');

const ALCHM_DOMAINS = [
  'alchmapp.web.app',
  'alchm-digital-sanctuary.web.app'
];

const GLOBAL_EDGE_LOCATIONS = [
  { name: 'US East', host: 'us-east1-firebase.com' },
  { name: 'US West', host: 'us-west1-firebase.com' },
  { name: 'Europe', host: 'europe-west1-firebase.com' },
  { name: 'Asia Pacific', host: 'asia-east1-firebase.com' }
];

const CRITICAL_ASSETS = [
  '/_next/static/css/ded9ef65f6045742.css',
  '/_next/static/chunks/main-app-7f72337ee7321f13.js',
  '/manifest.json',
  '/sw.js',
  '/'
];

class DeploymentVerifier {
  constructor() {
    this.results = {};
    this.startTime = Date.now();
  }

  async verify() {
    console.log('🚀 ALCHM Deployment Verification Starting...\n');
    console.log(`Target Build: FdtqGkDehojY0aRYUiiwJ`);
    console.log(`CSS Hash: ded9ef65f6045742.css\n`);

    for (const domain of ALCHM_DOMAINS) {
      console.log(`📍 Verifying domain: ${domain}`);
      await this.verifyDomain(domain);
      console.log('');
    }

    this.printSummary();
  }

  async verifyDomain(domain) {
    this.results[domain] = {
      assets: {},
      cacheHeaders: {},
      performance: {},
      integrity: true
    };

    // Test critical assets
    for (const asset of CRITICAL_ASSETS) {
      console.log(`  🔍 Checking ${asset}...`);
      const result = await this.checkAsset(domain, asset);
      this.results[domain].assets[asset] = result;
      
      if (!result.success) {
        this.results[domain].integrity = false;
        console.log(`    ❌ Failed: ${result.error}`);
      } else {
        console.log(`    ✅ Size: ${result.size}B, Cache: ${result.cacheControl}`);
      }
    }

    // Performance check
    await this.performanceCheck(domain);
    
    // Service Worker status
    await this.checkServiceWorker(domain);
  }

  async checkAsset(domain, path) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const req = https.request({
        hostname: domain,
        path: path,
        method: 'HEAD',
        headers: {
          'User-Agent': 'ALCHM-Deploy-Verifier/1.0',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      }, (res) => {
        const loadTime = Date.now() - startTime;
        
        resolve({
          success: res.statusCode === 200,
          statusCode: res.statusCode,
          size: res.headers['content-length'] || 'unknown',
          cacheControl: res.headers['cache-control'] || 'none',
          etag: res.headers['etag'] || 'none',
          lastModified: res.headers['last-modified'] || 'unknown',
          loadTime,
          served: res.headers['x-served-by'] || 'unknown',
          cacheHits: res.headers['x-cache-hits'] || '0'
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: error.message
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        resolve({
          success: false,
          error: 'Request timeout'
        });
      });

      req.end();
    });
  }

  async performanceCheck(domain) {
    console.log(`  ⚡ Performance check...`);
    const startTime = Date.now();
    
    const result = await this.checkAsset(domain, '/');
    const ttfb = result.loadTime;
    
    this.results[domain].performance = {
      ttfb,
      grade: ttfb < 200 ? 'A' : ttfb < 500 ? 'B' : ttfb < 1000 ? 'C' : 'F'
    };
    
    console.log(`    TTFB: ${ttfb}ms (Grade: ${this.results[domain].performance.grade})`);
  }

  async checkServiceWorker(domain) {
    console.log(`  🔧 Service Worker check...`);
    const result = await this.checkAsset(domain, '/sw.js');
    
    if (result.success) {
      // Check if SW content matches expected version
      const swContent = await this.getAssetContent(domain, '/sw.js');
      const hasCorrectVersion = swContent.includes('alchm-v1.2.0');
      const hasPlaceholder = swContent.includes('__INJECTED_COMMIT_SHA__');
      
      if (hasPlaceholder) {
        console.log(`    ⚠️  Service Worker contains uninjected build hash placeholder`);
        this.results[domain].integrity = false;
      } else if (hasCorrectVersion) {
        console.log(`    ✅ Service Worker version detected`);
      } else {
        console.log(`    ❓ Service Worker version uncertain`);
      }
    }
  }

  async getAssetContent(domain, path) {
    return new Promise((resolve, reject) => {
      https.get(`https://${domain}${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  printSummary() {
    const elapsed = Date.now() - this.startTime;
    console.log('═'.repeat(80));
    console.log('🎯 DEPLOYMENT VERIFICATION SUMMARY');
    console.log('═'.repeat(80));

    let allGood = true;
    
    for (const [domain, result] of Object.entries(this.results)) {
      const status = result.integrity ? '✅' : '❌';
      console.log(`${status} ${domain} - ${result.integrity ? 'HEALTHY' : 'ISSUES DETECTED'}`);
      
      if (!result.integrity) {
        allGood = false;
        console.log(`   Issues found in asset delivery or caching`);
      }
      
      console.log(`   Performance: TTFB ${result.performance?.ttfb}ms (${result.performance?.grade})`);
    }

    console.log('');
    
    if (allGood) {
      console.log('🎉 ALL SYSTEMS GO - Deployment verified across all locations');
    } else {
      console.log('🚨 DEPLOYMENT ISSUES DETECTED');
      console.log('');
      console.log('IMMEDIATE ACTIONS REQUIRED:');
      console.log('1. Clear service worker cache: DevTools → Application → Storage → Clear');
      console.log('2. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)');
      console.log('3. Check incognito/private browsing to verify fresh deployment');
      console.log('4. Monitor service worker registration for cache updates');
    }

    console.log(`\nVerification completed in ${elapsed}ms`);
    console.log('═'.repeat(80));
  }
}

// CLI execution
if (require.main === module) {
  const verifier = new DeploymentVerifier();
  verifier.verify().catch(console.error);
}

module.exports = DeploymentVerifier;