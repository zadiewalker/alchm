#!/usr/bin/env node

/**
 * MOBILE 3G PERFORMANCE TEST FOR ALCHM
 * 
 * Simulates slow network conditions for crisis users
 * Critical: Mental health users often on poor networks
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class Mobile3GPerformanceTest {
  constructor() {
    this.results = {
      networkConditions: {},
      pageTests: {},
      criticalPaths: {},
      summary: {},
      criticalIssues: []
    };
    this.browser = null;
    this.page = null;
  }

  async test() {
    console.log('📱 ALCHM Mobile 3G Performance Test');
    console.log('🐌 Simulating poor network conditions');
    console.log('⚡ Crisis users need fast access on slow networks');
    console.log('='.repeat(50));

    try {
      await this.setupBrowser();
      await this.testCriticalPaths();
      await this.testOfflineCapability();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Mobile 3G test failed:', error);
      this.results.criticalIssues.push({
        type: 'MOBILE_TEST_FAILURE',
        message: error.message,
        impact: 'CRITICAL'
      });
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async setupBrowser() {
    console.log('\n📱 Setting up mobile browser with 3G simulation...');
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Simulate iPhone on slow 3G
    await this.page.emulate({
      name: 'iPhone 12 on Slow 3G',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      viewport: {
        width: 375,
        height: 812,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    });

    // Set slow 3G network conditions
    const client = await this.page.target().createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 kbps
      uploadThroughput: 500 * 1024 / 8,   // 500 kbps
      latency: 400 // 400ms latency
    });

    this.results.networkConditions = {
      downloadSpeed: '500 kbps',
      uploadSpeed: '500 kbps',
      latency: '400ms',
      device: 'iPhone 12',
      network: 'Slow 3G'
    };

    console.log('   ✅ Mobile device: iPhone 12');
    console.log('   🐌 Network: Slow 3G (500kbps, 400ms latency)');
  }

  async testCriticalPaths() {
    console.log('\n🛣️ Testing Critical User Paths...');

    const criticalPages = [
      {
        url: 'http://localhost:3000/',
        name: 'Landing Page',
        maxLoadTime: 5000,
        description: 'First impression on slow mobile'
      },
      {
        url: 'http://localhost:3000/emergency',
        name: 'Emergency Page',
        maxLoadTime: 3000,
        description: 'CRITICAL: Crisis user access'
      },
      {
        url: 'http://localhost:3000/auth/login',
        name: 'Login Page',
        maxLoadTime: 4000,
        description: 'Authentication entry'
      },
      {
        url: 'http://localhost:3000/en/dashboard',
        name: 'Dashboard',
        maxLoadTime: 6000,
        description: 'Main interface after login'
      },
      {
        url: 'http://localhost:3000/en/journal',
        name: 'Journal Page',
        maxLoadTime: 6000,
        description: 'Core journaling feature'
      }
    ];

    for (const pageTest of criticalPages) {
      console.log(`\\n   📄 Testing: ${pageTest.name}`);
      
      const testResult = await this.testPage(pageTest);
      this.results.pageTests[pageTest.name] = testResult;

      console.log(`      ⚡ Load time: ${testResult.loadTime}ms (max: ${pageTest.maxLoadTime}ms)`);
      console.log(`      📊 Performance score: ${testResult.performanceScore}/100`);
      console.log(`      📦 Total size: ${(testResult.totalSize / 1024).toFixed(1)}KB`);
      console.log(`      🎯 Meets target: ${testResult.meetsTarget ? 'Yes' : 'No'}`);

      if (!testResult.meetsTarget) {
        this.results.criticalIssues.push({
          type: pageTest.name === 'Emergency Page' ? 'CRITICAL_EMERGENCY_SLOW' : 'PAGE_SLOW_3G',
          message: `${pageTest.name} loaded in ${testResult.loadTime}ms on 3G (max: ${pageTest.maxLoadTime}ms)`,
          impact: pageTest.name === 'Emergency Page' ? 'CRITICAL' : 'HIGH',
          page: pageTest.name
        });
      }
    }
  }

  async testPage(pageConfig) {
    try {
      const startTime = Date.now();
      
      // Navigate with network monitoring
      const navigationPromise = this.page.goto(pageConfig.url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Monitor network requests
      const requests = [];
      this.page.on('request', request => {
        requests.push({
          url: request.url(),
          resourceType: request.resourceType(),
          method: request.method()
        });
      });

      const responses = [];
      this.page.on('response', response => {
        responses.push({
          url: response.url(),
          status: response.status(),
          size: response.headers()['content-length'] || 0
        });
      });

      await navigationPromise;
      const loadTime = Date.now() - startTime;

      // Calculate total transfer size
      const totalSize = responses.reduce((total, response) => {
        return total + (parseInt(response.size) || 0);
      }, 0);

      // Get performance metrics
      const performanceMetrics = await this.page.evaluate(() => {
        const paint = performance.getEntriesByType('paint');
        const navigation = performance.getEntriesByType('navigation')[0];
        
        return {
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0
        };
      });

      // Basic performance score calculation
      const performanceScore = this.calculatePerformanceScore(loadTime, totalSize, performanceMetrics);

      return {
        loadTime,
        totalSize,
        performanceScore,
        meetsTarget: loadTime <= pageConfig.maxLoadTime,
        requestCount: requests.length,
        performanceMetrics,
        pageConfig
      };

    } catch (error) {
      console.error(`      ❌ Failed to test ${pageConfig.name}:`, error.message);
      return {
        loadTime: 30000,
        totalSize: 0,
        performanceScore: 0,
        meetsTarget: false,
        error: error.message,
        pageConfig
      };
    }
  }

  calculatePerformanceScore(loadTime, totalSize, metrics) {
    let score = 100;
    
    // Penalize for slow load time
    if (loadTime > 3000) score -= 30;
    else if (loadTime > 2000) score -= 20;
    else if (loadTime > 1000) score -= 10;
    
    // Penalize for large bundle size
    if (totalSize > 500000) score -= 20; // 500KB
    else if (totalSize > 200000) score -= 10; // 200KB
    
    // Penalize for slow FCP
    if (metrics.firstContentfulPaint > 3000) score -= 20;
    else if (metrics.firstContentfulPaint > 2000) score -= 10;
    
    return Math.max(0, score);
  }

  async testOfflineCapability() {
    console.log('\\n📡 Testing Offline Capability...');

    try {
      // Test emergency page offline
      await this.page.goto('http://localhost:3000/emergency');
      
      // Go offline
      await this.page.setOfflineMode(true);
      
      // Test if page still works
      const offlineTest = await this.page.evaluate(() => {
        return {
          canWrite: !!document.querySelector('textarea'),
          canSave: !!localStorage,
          serviceWorkerActive: !!navigator.serviceWorker?.controller
        };
      });

      this.results.offlineCapability = {
        ...offlineTest,
        emergencyPageOffline: offlineTest.canWrite && offlineTest.canSave
      };

      console.log(`   📝 Can write offline: ${offlineTest.canWrite ? 'Yes' : 'No'}`);
      console.log(`   💾 Can save offline: ${offlineTest.canSave ? 'Yes' : 'No'}`);
      console.log(`   🔧 Service worker: ${offlineTest.serviceWorkerActive ? 'Active' : 'Inactive'}`);

      if (!offlineTest.canWrite || !offlineTest.canSave) {
        this.results.criticalIssues.push({
          type: 'OFFLINE_CAPABILITY_MISSING',
          message: 'Emergency page does not work offline',
          impact: 'HIGH'
        });
      }

    } catch (error) {
      console.error('❌ Offline test failed:', error.message);
      this.results.criticalIssues.push({
        type: 'OFFLINE_TEST_FAILED',
        message: error.message,
        impact: 'MEDIUM'
      });
    }
  }

  async generateReport() {
    const criticalCount = this.results.criticalIssues.filter(i => i.impact === 'CRITICAL').length;
    const highCount = this.results.criticalIssues.filter(i => i.impact === 'HIGH').length;
    
    // Calculate overall mobile readiness
    const pageResults = Object.values(this.results.pageTests);
    const avgLoadTime = pageResults.reduce((sum, p) => sum + p.loadTime, 0) / pageResults.length;
    const avgPerformanceScore = pageResults.reduce((sum, p) => sum + p.performanceScore, 0) / pageResults.length;
    const pagesPassTarget = pageResults.filter(p => p.meetsTarget).length;
    
    const isMobileReady = criticalCount === 0 && pagesPassTarget >= pageResults.length * 0.8;

    this.results.summary = {
      averageLoadTime: avgLoadTime,
      averagePerformanceScore: avgPerformanceScore,
      pagesPassingTarget: pagesPassTarget,
      totalPages: pageResults.length,
      criticalIssues: criticalCount,
      highIssues: highCount,
      mobileReady: isMobileReady,
      offlineCapable: this.results.offlineCapability?.emergencyPageOffline || false
    };

    console.log('\\n' + '='.repeat(50));
    console.log('📱 MOBILE 3G PERFORMANCE SUMMARY');
    console.log('='.repeat(50));
    console.log(`🐌 Network: ${this.results.networkConditions.network} (${this.results.networkConditions.downloadSpeed})`);
    console.log(`⚡ Average load time: ${avgLoadTime.toFixed(0)}ms`);
    console.log(`📊 Average performance: ${avgPerformanceScore.toFixed(0)}/100`);
    console.log(`🎯 Pages meeting targets: ${pagesPassTarget}/${pageResults.length}`);
    console.log(`📡 Offline capable: ${this.results.summary.offlineCapable ? 'Yes' : 'No'}`);
    console.log(`⚠️  Critical Issues: ${criticalCount}`);
    console.log(`📈 High Priority Issues: ${highCount}`);
    console.log('');
    console.log(`🚦 Mobile 3G Readiness: ${isMobileReady ? 'READY' : 'NOT READY'}`);

    if (!isMobileReady) {
      console.log('\\n❌ CRITICAL MOBILE ISSUES:');
      this.results.criticalIssues
        .filter(i => i.impact === 'CRITICAL')
        .forEach(issue => {
          console.log(`   • ${issue.type}: ${issue.message}`);
        });

      console.log('\\n⚠️  HIGH PRIORITY MOBILE ISSUES:');
      this.results.criticalIssues
        .filter(i => i.impact === 'HIGH')
        .forEach(issue => {
          console.log(`   • ${issue.type}: ${issue.message}`);
        });
    }

    // Save detailed report
    await fs.writeFile(
      path.join(__dirname, 'mobile-3g-performance-report.json'),
      JSON.stringify(this.results, null, 2)
    );

    console.log('\\n📋 Mobile 3G report saved to: mobile-3g-performance-report.json');
  }
}

// Check dependencies
async function checkDependencies() {
  try {
    require('puppeteer');
    return true;
  } catch (error) {
    console.log('📦 Missing puppeteer dependency');
    console.log('   Run: npm install puppeteer');
    return false;
  }
}

// Run test
async function main() {
  const hasRequiredDeps = await checkDependencies();
  
  if (!hasRequiredDeps) {
    console.log('❌ Cannot run mobile test without puppeteer');
    return;
  }

  const test = new Mobile3GPerformanceTest();
  await test.test();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = Mobile3GPerformanceTest;