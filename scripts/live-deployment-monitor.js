#!/usr/bin/env node
// ALCHM Live Deployment Monitor
// Real-time monitoring for deployment propagation and cache invalidation

const https = require('https');
const { performance } = require('perf_hooks');

class LiveDeploymentMonitor {
  constructor() {
    this.domains = [
      'alchmapp.web.app',
      'alchm-digital-sanctuary.web.app'
    ];
    
    this.targetAssets = [
      '/_next/static/css/ded9ef65f6045742.css',
      '/sw.js',
      '/'
    ];
    
    this.expectedBuild = 'FdtqGkDehojY0aRYUiiwJ';
    this.isRunning = false;
    this.checkCount = 0;
  }

  async start(duration = 60000) { // Default 1 minute
    console.log('🚀 ALCHM Live Deployment Monitor Starting...');
    console.log(`📊 Monitoring for ${duration/1000}s across ${this.domains.length} domains`);
    console.log(`🎯 Target Build: ${this.expectedBuild}`);
    console.log('─'.repeat(80));

    this.isRunning = true;
    const startTime = Date.now();
    
    while (this.isRunning && (Date.now() - startTime) < duration) {
      await this.performCheck();
      await this.sleep(5000); // Check every 5 seconds
    }
    
    console.log('✅ Monitoring completed');
  }

  async performCheck() {
    this.checkCount++;
    const timestamp = new Date().toISOString().slice(11, 19);
    console.log(`\n[${timestamp}] Check #${this.checkCount}`);

    const results = await Promise.all(
      this.domains.map(domain => this.checkDomain(domain))
    );

    // Summary for this check
    const allHealthy = results.every(r => r.healthy);
    const status = allHealthy ? '✅ ALL HEALTHY' : '⚠️  ISSUES DETECTED';
    console.log(`Status: ${status}`);

    if (!allHealthy) {
      console.log('Issues:');
      results.forEach(result => {
        if (!result.healthy) {
          console.log(`  • ${result.domain}: ${result.issues.join(', ')}`);
        }
      });
    }
  }

  async checkDomain(domain) {
    const result = {
      domain,
      healthy: true,
      issues: [],
      assets: {}
    };

    for (const asset of this.targetAssets) {
      try {
        const assetResult = await this.quickCheck(domain, asset);
        result.assets[asset] = assetResult;

        if (!assetResult.success) {
          result.healthy = false;
          result.issues.push(`${asset} failed (${assetResult.status})`);
        } else if (asset === '/sw.js') {
          // Check if SW has been updated
          const content = await this.getContent(domain, asset);
          if (content.includes('__INJECTED_COMMIT_SHA__')) {
            result.healthy = false;
            result.issues.push('SW has uninjected build hash');
          }
        }

      } catch (error) {
        result.healthy = false;
        result.issues.push(`${asset}: ${error.message}`);
      }
    }

    // Performance check
    const perfResult = await this.performanceCheck(domain);
    if (perfResult.ttfb > 1000) {
      result.issues.push(`Slow TTFB: ${perfResult.ttfb}ms`);
    }

    const status = result.healthy ? '✅' : '❌';
    console.log(`  ${status} ${domain} (${result.issues.length} issues)`);

    return result;
  }

  async quickCheck(domain, path) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const req = https.request({
        hostname: domain,
        path,
        method: 'HEAD',
        timeout: 5000,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'User-Agent': 'ALCHM-Monitor/1.0'
        }
      }, (res) => {
        const loadTime = Math.round(performance.now() - startTime);
        
        resolve({
          success: res.statusCode === 200,
          status: res.statusCode,
          loadTime,
          cacheControl: res.headers['cache-control'],
          etag: res.headers['etag'],
          xCache: res.headers['x-cache'] || 'unknown'
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          status: 0,
          error: error.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          success: false,
          status: 0,
          error: 'timeout'
        });
      });

      req.end();
    });
  }

  async getContent(domain, path, limit = 500) {
    return new Promise((resolve, reject) => {
      https.get(`https://${domain}${path}`, (res) => {
        let data = '';
        let received = 0;
        
        res.on('data', chunk => {
          received += chunk.length;
          if (received <= limit) {
            data += chunk;
          }
        });
        
        res.on('end', () => resolve(data));
        res.on('error', reject);
      }).on('error', reject);
    });
  }

  async performanceCheck(domain) {
    const startTime = performance.now();
    const result = await this.quickCheck(domain, '/');
    const ttfb = Math.round(performance.now() - startTime);
    
    return { ttfb };
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
    console.log('\n🛑 Monitor stopping...');
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Received interrupt signal, stopping monitor...');
  process.exit(0);
});

// CLI execution
if (require.main === module) {
  const monitor = new LiveDeploymentMonitor();
  const duration = process.argv[2] ? parseInt(process.argv[2]) * 1000 : 60000;
  
  monitor.start(duration).catch(console.error);
}

module.exports = LiveDeploymentMonitor;