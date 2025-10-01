#!/usr/bin/env node

/**
 * ALCHM Core Web Vitals Validation Script
 * Tests all critical pages for Core Web Vitals compliance
 * 
 * Targets:
 * - FID: <50ms
 * - CLS: <0.05
 * - LCP: <2000ms
 * - FCP: <1200ms
 * - TTFB: <500ms
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Performance thresholds for ALCHM
const THRESHOLDS = {
  // Crisis-critical thresholds
  crisis: {
    fid: 30,    // ms
    cls: 0.025, // score
    lcp: 1500,  // ms
    fcp: 900,   // ms
    ttfb: 300   // ms
  },
  // App Store compliance thresholds
  compliance: {
    fid: 50,    // ms
    cls: 0.05,  // score
    lcp: 2000,  // ms
    fcp: 1200,  // ms
    ttfb: 500   // ms
  },
  // Warning thresholds
  warning: {
    fid: 40,    // ms
    cls: 0.035, // score
    lcp: 1800,  // ms
    fcp: 1000,  // ms
    ttfb: 400   // ms
  }
};

// Critical pages to test
const CRITICAL_PAGES = [
  {
    name: 'Landing Page',
    path: '/',
    priority: 'crisis',
    description: 'Entry point for users in crisis'
  },
  {
    name: 'Login Page',
    path: '/auth/login',
    priority: 'crisis',
    description: 'Authentication gateway'
  },
  {
    name: 'Signup Page',
    path: '/auth/signup',
    priority: 'high',
    description: 'New user onboarding'
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    priority: 'high',
    description: 'Main user interface'
  },
  {
    name: 'Journal Page',
    path: '/journal',
    priority: 'crisis',
    description: 'Core journaling functionality'
  },
  {
    name: 'Journals List',
    path: '/journals',
    priority: 'high',
    description: 'Journal history and management'
  },
  {
    name: 'Crisis Support',
    path: '/crisis',
    priority: 'crisis',
    description: 'Emergency crisis support'
  },
  {
    name: 'Pricing',
    path: '/pricing',
    priority: 'normal',
    description: 'Subscription information'
  }
];

// Network conditions for testing
const NETWORK_CONDITIONS = [
  {
    name: 'Fast 3G',
    conditions: {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8, // 750 Kbps
      latency: 150
    }
  },
  {
    name: 'Slow 3G',
    conditions: {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 Kbps
      uploadThroughput: 500 * 1024 / 8, // 500 Kbps
      latency: 400
    }
  }
];

// Device configurations
const DEVICES = [
  {
    name: 'Desktop',
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    name: 'Mobile',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  {
    name: 'Tablet',
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  }
];

class CoreWebVitalsValidator {
  constructor() {
    this.browser = null;
    this.results = [];
    this.startTime = Date.now();
  }

  async initialize() {
    console.log('🚀 Initializing Core Web Vitals validation...');
    
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
  }

  async validateAllPages() {
    console.log('📊 Starting comprehensive Core Web Vitals validation...');
    console.log(`Testing ${CRITICAL_PAGES.length} pages across ${DEVICES.length} devices and ${NETWORK_CONDITIONS.length} network conditions`);
    
    for (const page of CRITICAL_PAGES) {
      for (const device of DEVICES) {
        for (const network of NETWORK_CONDITIONS) {
          await this.validatePage(page, device, network);
        }
      }
    }

    await this.generateReport();
  }

  async validatePage(pageConfig, deviceConfig, networkConfig) {
    const testName = `${pageConfig.name} - ${deviceConfig.name} - ${networkConfig.name}`;
    console.log(`\n🔍 Testing: ${testName}`);

    try {
      const page = await this.browser.newPage();
      
      // Set up device and network conditions
      await page.setViewport(deviceConfig.viewport);
      await page.setUserAgent(deviceConfig.userAgent);
      await page.emulateNetworkConditions(networkConfig.conditions);

      // Set up performance monitoring
      const metrics = await this.setupPerformanceMonitoring(page);
      
      // Navigate to page
      const startTime = Date.now();
      await page.goto(`http://localhost:3000${pageConfig.path}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait for page to stabilize
      await page.waitForTimeout(2000);

      // Collect Core Web Vitals
      const vitals = await this.collectCoreWebVitals(page);
      const navigationTime = Date.now() - startTime;

      // Calculate scores
      const scores = this.calculateScores(vitals, pageConfig.priority);
      
      const result = {
        page: pageConfig.name,
        path: pageConfig.path,
        priority: pageConfig.priority,
        device: deviceConfig.name,
        network: networkConfig.name,
        navigationTime,
        vitals,
        scores,
        timestamp: new Date().toISOString(),
        passed: scores.overall >= 80,
        warnings: scores.warnings || [],
        errors: scores.errors || []
      };

      this.results.push(result);
      this.logResult(result);

      await page.close();

    } catch (error) {
      console.error(`❌ Error testing ${testName}:`, error.message);
      
      this.results.push({
        page: pageConfig.name,
        path: pageConfig.path,
        priority: pageConfig.priority,
        device: deviceConfig.name,
        network: networkConfig.name,
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      });
    }
  }

  async setupPerformanceMonitoring(page) {
    // Enable performance domains
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');
    await client.send('Runtime.enable');

    // Set up Core Web Vitals collection
    await page.evaluateOnNewDocument(() => {
      window.vitalsData = {
        fid: null,
        cls: 0,
        lcp: null,
        fcp: null,
        ttfb: null
      };

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'first-input') {
              window.vitalsData.fid = entry.processingStart - entry.startTime;
            }
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {}

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              clsValue += entry.value;
              window.vitalsData.cls = clsValue;
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {}

      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (lastEntry) {
            window.vitalsData.lcp = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {}

      // FCP Observer
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              window.vitalsData.fcp = entry.startTime;
            }
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {}

      // TTFB calculation
      window.addEventListener('load', () => {
        const navEntry = performance.getEntriesByType('navigation')[0];
        if (navEntry) {
          window.vitalsData.ttfb = navEntry.responseStart - navEntry.requestStart;
        }
      });
    });

    return client;
  }

  async collectCoreWebVitals(page) {
    // Wait for vitals to be collected
    await page.waitForTimeout(3000);

    const vitals = await page.evaluate(() => {
      return window.vitalsData || {};
    });

    // Get additional performance metrics
    const performanceMetrics = await page.metrics();
    
    return {
      ...vitals,
      jsHeapUsedSize: performanceMetrics.JSHeapUsedSize,
      jsHeapTotalSize: performanceMetrics.JSHeapTotalSize,
      domNodes: performanceMetrics.Nodes,
      layoutCount: performanceMetrics.LayoutCount,
      recalcStyleCount: performanceMetrics.RecalcStyleCount
    };
  }

  calculateScores(vitals, priority) {
    const thresholds = THRESHOLDS[priority === 'crisis' ? 'crisis' : 'compliance'];
    const warnings = [];
    const errors = [];
    
    let totalScore = 0;
    let metricsCount = 0;

    // FID Score
    if (vitals.fid !== null) {
      metricsCount++;
      if (vitals.fid <= thresholds.fid) {
        totalScore += 100;
      } else if (vitals.fid <= THRESHOLDS.warning.fid) {
        totalScore += 75;
        warnings.push(`FID: ${vitals.fid.toFixed(2)}ms (target: <${thresholds.fid}ms)`);
      } else {
        totalScore += 50;
        errors.push(`FID: ${vitals.fid.toFixed(2)}ms (target: <${thresholds.fid}ms)`);
      }
    }

    // CLS Score
    if (vitals.cls !== null) {
      metricsCount++;
      if (vitals.cls <= thresholds.cls) {
        totalScore += 100;
      } else if (vitals.cls <= THRESHOLDS.warning.cls) {
        totalScore += 75;
        warnings.push(`CLS: ${vitals.cls.toFixed(4)} (target: <${thresholds.cls})`);
      } else {
        totalScore += 50;
        errors.push(`CLS: ${vitals.cls.toFixed(4)} (target: <${thresholds.cls})`);
      }
    }

    // LCP Score
    if (vitals.lcp !== null) {
      metricsCount++;
      if (vitals.lcp <= thresholds.lcp) {
        totalScore += 100;
      } else if (vitals.lcp <= THRESHOLDS.warning.lcp) {
        totalScore += 75;
        warnings.push(`LCP: ${vitals.lcp.toFixed(2)}ms (target: <${thresholds.lcp}ms)`);
      } else {
        totalScore += 50;
        errors.push(`LCP: ${vitals.lcp.toFixed(2)}ms (target: <${thresholds.lcp}ms)`);
      }
    }

    // FCP Score
    if (vitals.fcp !== null) {
      metricsCount++;
      if (vitals.fcp <= thresholds.fcp) {
        totalScore += 100;
      } else if (vitals.fcp <= THRESHOLDS.warning.fcp) {
        totalScore += 75;
        warnings.push(`FCP: ${vitals.fcp.toFixed(2)}ms (target: <${thresholds.fcp}ms)`);
      } else {
        totalScore += 50;
        errors.push(`FCP: ${vitals.fcp.toFixed(2)}ms (target: <${thresholds.fcp}ms)`);
      }
    }

    // TTFB Score
    if (vitals.ttfb !== null) {
      metricsCount++;
      if (vitals.ttfb <= thresholds.ttfb) {
        totalScore += 100;
      } else if (vitals.ttfb <= THRESHOLDS.warning.ttfb) {
        totalScore += 75;
        warnings.push(`TTFB: ${vitals.ttfb.toFixed(2)}ms (target: <${thresholds.ttfb}ms)`);
      } else {
        totalScore += 50;
        errors.push(`TTFB: ${vitals.ttfb.toFixed(2)}ms (target: <${thresholds.ttfb}ms)`);
      }
    }

    const overall = metricsCount > 0 ? totalScore / metricsCount : 0;

    return {
      overall: Math.round(overall),
      warnings,
      errors,
      metricsCount
    };
  }

  logResult(result) {
    const status = result.passed ? '✅' : '❌';
    const score = result.scores ? result.scores.overall : 0;
    
    console.log(`${status} ${result.page} (${result.device}/${result.network}): ${score}/100`);
    
    if (result.vitals) {
      console.log(`   FID: ${result.vitals.fid?.toFixed(2) || 'N/A'}ms | CLS: ${result.vitals.cls?.toFixed(4) || 'N/A'} | LCP: ${result.vitals.lcp?.toFixed(2) || 'N/A'}ms`);
    }
    
    if (result.scores?.errors?.length > 0) {
      result.scores.errors.forEach(error => console.log(`   🚨 ${error}`));
    }
    
    if (result.scores?.warnings?.length > 0) {
      result.scores.warnings.forEach(warning => console.log(`   ⚠️ ${warning}`));
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Core Web Vitals Compliance Report...');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const passRate = (passedTests / totalTests * 100).toFixed(1);
    
    // Group results by page and priority
    const pageResults = this.groupResultsByPage();
    const priorityResults = this.groupResultsByPriority();
    
    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        passRate: `${passRate}%`,
        testDuration: `${((Date.now() - this.startTime) / 1000).toFixed(1)}s`,
        timestamp: new Date().toISOString()
      },
      compliance: {
        appStoreReady: passRate >= 80,
        crisisCriticalPages: this.assessCrisisCriticalCompliance(),
        overallGrade: this.calculateOverallGrade(passRate)
      },
      results: {
        byPage: pageResults,
        byPriority: priorityResults,
        detailed: this.results
      },
      recommendations: this.generateRecommendations()
    };

    // Save report
    const reportPath = path.join(__dirname, '../', 'CORE_WEB_VITALS_VALIDATION_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    this.generateSummaryReport(report);
    
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    return report;
  }

  groupResultsByPage() {
    const pageGroups = {};
    
    this.results.forEach(result => {
      if (!pageGroups[result.page]) {
        pageGroups[result.page] = {
          tests: [],
          passRate: 0,
          averageScore: 0
        };
      }
      pageGroups[result.page].tests.push(result);
    });

    // Calculate metrics for each page
    Object.keys(pageGroups).forEach(pageName => {
      const tests = pageGroups[pageName].tests;
      const passedTests = tests.filter(t => t.passed).length;
      const scores = tests.filter(t => t.scores).map(t => t.scores.overall);
      
      pageGroups[pageName].passRate = (passedTests / tests.length * 100).toFixed(1);
      pageGroups[pageName].averageScore = scores.length > 0 
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : 0;
    });

    return pageGroups;
  }

  groupResultsByPriority() {
    const priorityGroups = {};
    
    this.results.forEach(result => {
      if (!priorityGroups[result.priority]) {
        priorityGroups[result.priority] = {
          tests: [],
          passRate: 0,
          averageScore: 0
        };
      }
      priorityGroups[result.priority].tests.push(result);
    });

    // Calculate metrics for each priority
    Object.keys(priorityGroups).forEach(priority => {
      const tests = priorityGroups[priority].tests;
      const passedTests = tests.filter(t => t.passed).length;
      const scores = tests.filter(t => t.scores).map(t => t.scores.overall);
      
      priorityGroups[priority].passRate = (passedTests / tests.length * 100).toFixed(1);
      priorityGroups[priority].averageScore = scores.length > 0 
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : 0;
    });

    return priorityGroups;
  }

  assessCrisisCriticalCompliance() {
    const crisisPages = this.results.filter(r => r.priority === 'crisis');
    const passedCrisis = crisisPages.filter(r => r.passed).length;
    
    return {
      totalCrisisTests: crisisPages.length,
      passedCrisisTests: passedCrisis,
      crisisPassRate: crisisPages.length > 0 ? (passedCrisis / crisisPages.length * 100).toFixed(1) : 0,
      compliant: passedCrisis === crisisPages.length
    };
  }

  calculateOverallGrade(passRate) {
    if (passRate >= 90) return 'A';
    if (passRate >= 80) return 'B';
    if (passRate >= 70) return 'C';
    if (passRate >= 60) return 'D';
    return 'F';
  }

  generateRecommendations() {
    const recommendations = [];
    const failedResults = this.results.filter(r => !r.passed);
    
    // Analyze common failure patterns
    const fidIssues = failedResults.filter(r => r.scores?.errors?.some(e => e.includes('FID')));
    const clsIssues = failedResults.filter(r => r.scores?.errors?.some(e => e.includes('CLS')));
    const lcpIssues = failedResults.filter(r => r.scores?.errors?.some(e => e.includes('LCP')));
    
    if (fidIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'First Input Delay violations',
        affected: `${fidIssues.length} tests`,
        solution: 'Implement code splitting, defer non-critical JavaScript, optimize event handlers'
      });
    }
    
    if (clsIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Cumulative Layout Shift violations',
        affected: `${clsIssues.length} tests`,
        solution: 'Add explicit dimensions to images, reserve space for dynamic content, optimize font loading'
      });
    }
    
    if (lcpIssues.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        issue: 'Largest Contentful Paint violations',
        affected: `${lcpIssues.length} tests`,
        solution: 'Optimize images, preload critical resources, improve server response times'
      });
    }
    
    return recommendations;
  }

  generateSummaryReport(report) {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ALCHM CORE WEB VITALS VALIDATION SUMMARY');
    console.log('='.repeat(60));
    
    console.log(`\n📈 Overall Results:`);
    console.log(`   Total Tests: ${report.summary.totalTests}`);
    console.log(`   Passed: ${report.summary.passedTests} (${report.summary.passRate})`);
    console.log(`   Failed: ${report.summary.failedTests}`);
    console.log(`   Grade: ${report.compliance.overallGrade}`);
    
    console.log(`\n🚨 Crisis-Critical Pages:`);
    console.log(`   Compliance: ${report.compliance.crisisCriticalPages.compliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
    console.log(`   Pass Rate: ${report.compliance.crisisCriticalPages.crisisPassRate}%`);
    
    console.log(`\n📱 App Store Readiness:`);
    console.log(`   Status: ${report.compliance.appStoreReady ? '✅ READY' : '❌ NOT READY'}`);
    console.log(`   Threshold: 80% pass rate required`);
    
    if (report.recommendations.length > 0) {
      console.log(`\n🔧 Priority Recommendations:`);
      report.recommendations.forEach(rec => {
        console.log(`   ${rec.priority}: ${rec.issue} (${rec.affected})`);
        console.log(`      → ${rec.solution}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const validator = new CoreWebVitalsValidator();
  
  try {
    await validator.initialize();
    const report = await validator.validateAllPages();
    
    // Exit with error code if not App Store ready
    const exitCode = report.compliance.appStoreReady ? 0 : 1;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await validator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { CoreWebVitalsValidator, THRESHOLDS, CRITICAL_PAGES };