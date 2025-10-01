#!/usr/bin/env node

const { performance } = require('perf_hooks');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const fs = require('fs');
const path = require('path');

/**
 * ALCHM Crisis Performance Test Suite
 * 
 * CRITICAL: Tests performance from the perspective of users in crisis
 * - Simulates slow 3G networks
 * - Tests emergency resource loading
 * - Validates Core Web Vitals meet crisis user requirements
 * - Identifies performance regressions that could be life-threatening
 */

const CRISIS_PERFORMANCE_TARGETS = {
  fcp: 1200,     // First Contentful Paint (ms)
  lcp: 2000,     // Largest Contentful Paint (ms)
  fid: 50,       // First Input Delay (ms)
  cls: 0.05,     // Cumulative Layout Shift
  tti: 3000,     // Time to Interactive (ms)
  crisisButton: 100, // Crisis button response time (ms)
  bundleSize: 800    // Maximum JavaScript bundle size (KB)
};

const NETWORK_CONDITIONS = {
  'Fast 3G': { downloadThroughput: 1.6 * 1024, uploadThroughput: 750, latency: 150 },
  'Slow 3G': { downloadThroughput: 500, uploadThroughput: 500, latency: 300 },
  'Emergency': { downloadThroughput: 200, uploadThroughput: 200, latency: 500 }
};

class CrisisPerformanceTester {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        passed: 0,
        failed: 0,
        critical: 0
      }
    };
  }

  async runAllTests() {
    console.log('🚨 ALCHM CRISIS PERFORMANCE TEST SUITE');
    console.log('=' .repeat(60));
    console.log('Testing performance for users in crisis situations...\n');

    try {
      // Test bundle size first (fastest test)
      await this.testBundleSize();
      
      // Test critical resource loading
      await this.testCrisisResourceLoading();
      
      // Test Core Web Vitals under different network conditions
      for (const [networkName, conditions] of Object.entries(NETWORK_CONDITIONS)) {
        await this.testCoreWebVitals(networkName, conditions);
      }
      
      // Test emergency button responsiveness
      await this.testEmergencyButtonResponse();
      
      // Generate report
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Critical test failure:', error);
      process.exit(1);
    }
  }

  async testBundleSize() {
    console.log('📦 Testing bundle size...');
    
    try {
      const buildDir = path.join(__dirname, '../.next');
      const staticDir = path.join(buildDir, 'static', 'chunks');
      
      if (!fs.existsSync(staticDir)) {
        throw new Error('Build directory not found. Run npm run build first.');
      }
      
      let totalSize = 0;
      const jsFiles = [];
      
      // Calculate total JavaScript bundle size
      const scanDirectory = (dir) => {
        const items = fs.readdirSync(dir);
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            scanDirectory(itemPath);
          } else if (item.endsWith('.js') && !item.includes('.map')) {
            const sizeKB = stats.size / 1024;
            totalSize += sizeKB;
            jsFiles.push({ name: item, size: sizeKB });
          }
        });
      };
      
      scanDirectory(staticDir);
      
      const testResult = {
        name: 'Bundle Size',
        target: `< ${CRISIS_PERFORMANCE_TARGETS.bundleSize}KB`,
        actual: `${Math.round(totalSize)}KB`,
        passed: totalSize < CRISIS_PERFORMANCE_TARGETS.bundleSize,
        critical: totalSize > CRISIS_PERFORMANCE_TARGETS.bundleSize * 2,
        details: {
          totalSizeKB: Math.round(totalSize),
          largestFiles: jsFiles.sort((a, b) => b.size - a.size).slice(0, 5)
        }
      };
      
      this.results.tests.push(testResult);
      this.logTestResult(testResult);
      
    } catch (error) {
      this.logTestError('Bundle Size', error);
    }
  }

  async testCrisisResourceLoading() {
    console.log('🆘 Testing crisis resource loading...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Simulate emergency network conditions
      await page.emulateNetworkConditions(NETWORK_CONDITIONS['Emergency']);
      
      const startTime = performance.now();
      
      // Test critical crisis routes
      const crisisRoutes = [
        'http://localhost:3000/',
        'http://localhost:3000/crisis',
        'http://localhost:3000/emergency'
      ];
      
      for (const route of crisisRoutes) {
        const routeStartTime = performance.now();
        
        try {
          await page.goto(route, { waitUntil: 'domcontentloaded', timeout: 5000 });
          const loadTime = performance.now() - routeStartTime;
          
          const testResult = {
            name: `Crisis Route: ${route}`,
            target: `< ${CRISIS_PERFORMANCE_TARGETS.tti}ms`,
            actual: `${Math.round(loadTime)}ms`,
            passed: loadTime < CRISIS_PERFORMANCE_TARGETS.tti,
            critical: loadTime > CRISIS_PERFORMANCE_TARGETS.tti * 2,
            details: { loadTime: Math.round(loadTime), route }
          };
          
          this.results.tests.push(testResult);
          this.logTestResult(testResult);
          
        } catch (error) {
          this.logTestError(`Crisis Route: ${route}`, error);
        }
      }
      
    } finally {
      await browser.close();
    }
  }

  async testCoreWebVitals(networkName, networkConditions) {
    console.log(`⚡ Testing Core Web Vitals on ${networkName}...`);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.emulateNetworkConditions(networkConditions);
      
      // Run Lighthouse audit
      const { lhr } = await lighthouse('http://localhost:3000', {
        port: 9222,
        onlyCategories: ['performance'],
        settings: {
          emulatedFormFactor: 'mobile',
          throttlingMethod: 'devtools'
        }
      });
      
      const metrics = lhr.audits;
      
      const tests = [
        {
          name: `FCP (${networkName})`,
          target: `< ${CRISIS_PERFORMANCE_TARGETS.fcp}ms`,
          actual: `${Math.round(metrics['first-contentful-paint'].numericValue)}ms`,
          passed: metrics['first-contentful-paint'].numericValue < CRISIS_PERFORMANCE_TARGETS.fcp,
          score: metrics['first-contentful-paint'].score
        },
        {
          name: `LCP (${networkName})`,
          target: `< ${CRISIS_PERFORMANCE_TARGETS.lcp}ms`,
          actual: `${Math.round(metrics['largest-contentful-paint'].numericValue)}ms`,
          passed: metrics['largest-contentful-paint'].numericValue < CRISIS_PERFORMANCE_TARGETS.lcp,
          score: metrics['largest-contentful-paint'].score
        },
        {
          name: `CLS (${networkName})`,
          target: `< ${CRISIS_PERFORMANCE_TARGETS.cls}`,
          actual: metrics['cumulative-layout-shift'].numericValue.toFixed(3),
          passed: metrics['cumulative-layout-shift'].numericValue < CRISIS_PERFORMANCE_TARGETS.cls,
          score: metrics['cumulative-layout-shift'].score
        }
      ];
      
      tests.forEach(test => {
        test.critical = !test.passed && test.score < 0.5;
        this.results.tests.push(test);
        this.logTestResult(test);
      });
      
    } catch (error) {
      this.logTestError(`Core Web Vitals (${networkName})`, error);
    } finally {
      await browser.close();
    }
  }

  async testEmergencyButtonResponse() {
    console.log('🆘 Testing emergency button responsiveness...');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
      
      // Test crisis button click response time
      const startTime = performance.now();
      
      await page.evaluate(() => {
        const crisisButton = document.querySelector('.crisis-button, [aria-label*="crisis"], [href="tel:988"]');
        if (crisisButton) {
          // Simulate click without actually making the call
          crisisButton.dispatchEvent(new Event('mousedown'));
        }
      });
      
      const responseTime = performance.now() - startTime;
      
      const testResult = {
        name: 'Emergency Button Response',
        target: `< ${CRISIS_PERFORMANCE_TARGETS.crisisButton}ms`,
        actual: `${Math.round(responseTime)}ms`,
        passed: responseTime < CRISIS_PERFORMANCE_TARGETS.crisisButton,
        critical: responseTime > CRISIS_PERFORMANCE_TARGETS.crisisButton * 3,
        details: { responseTime: Math.round(responseTime) }
      };
      
      this.results.tests.push(testResult);
      this.logTestResult(testResult);
      
    } catch (error) {
      this.logTestError('Emergency Button Response', error);
    } finally {
      await browser.close();
    }
  }

  logTestResult(test) {
    const status = test.passed ? '✅' : (test.critical ? '🚨' : '⚠️');
    console.log(`${status} ${test.name}: ${test.actual} (target: ${test.target})`);
    
    if (test.passed) {
      this.results.summary.passed++;
    } else {
      this.results.summary.failed++;
      if (test.critical) {
        this.results.summary.critical++;
      }
    }
  }

  logTestError(testName, error) {
    console.log(`❌ ${testName}: ERROR - ${error.message}`);
    this.results.tests.push({
      name: testName,
      passed: false,
      critical: true,
      error: error.message
    });
    this.results.summary.failed++;
    this.results.summary.critical++;
  }

  generateReport() {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 CRISIS PERFORMANCE TEST RESULTS');
    console.log('=' .repeat(60));
    
    console.log(`\nSUMMARY:`);
    console.log(`✅ Passed: ${this.results.summary.passed}`);
    console.log(`❌ Failed: ${this.results.summary.failed}`);
    console.log(`🚨 Critical: ${this.results.summary.critical}`);
    
    const passRate = (this.results.summary.passed / this.results.tests.length * 100).toFixed(1);
    console.log(`📈 Pass Rate: ${passRate}%`);
    
    // Save detailed results
    const reportPath = path.join(__dirname, '../crisis-performance-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Determine exit code
    if (this.results.summary.critical > 0) {
      console.log('\n🚨 CRITICAL FAILURES DETECTED - Users in crisis may not get help in time!');
      process.exit(1);
    } else if (this.results.summary.failed > 0) {
      console.log('\n⚠️ Performance issues detected - Consider optimizing before deployment');
      process.exit(1);
    } else {
      console.log('\n✅ All tests passed - Performance is optimized for crisis users');
      process.exit(0);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new CrisisPerformanceTester();
  tester.runAllTests().catch(error => {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = CrisisPerformanceTester;