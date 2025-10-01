#!/usr/bin/env node

/**
 * ALCHM Mobile Crisis Validation Suite
 * Comprehensive testing for trauma-informed mobile experience
 * 
 * Tests:
 * 1. Touch target sizes (60px+ minimum for crisis users)
 * 2. Performance on simulated low-end devices
 * 3. Offline crisis functionality
 * 4. iOS Safari and Android Chrome compatibility
 * 5. Crisis button accessibility during emotional distress
 */

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

const MOBILE_DEVICES = {
  'iPhone SE (1st gen)': {
    name: 'iPhone 6',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
    viewport: { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
  },
  'Android Low-End': {
    name: 'Galaxy S5',
    userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36',
    viewport: { width: 360, height: 640, deviceScaleFactor: 3, isMobile: true, hasTouch: true }
  }
};

const CRITICAL_PAGES = [
  '/', // Home
  '/auth/login', // Authentication
  '/dashboard', // Main dashboard
  '/journal', // Journal writing
  '/crisis-resources' // Crisis support
];

class MobileCrisisValidator {
  constructor() {
    this.results = {
      touchTargets: [],
      performance: [],
      accessibility: [],
      offline: [],
      errors: []
    };
    this.startTime = performance.now();
  }

  async runValidation() {
    console.log('🚀 ALCHM Mobile Crisis Validation Suite');
    console.log('=========================================\\n');
    
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: false, // Show browser for debugging
        devtools: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security', // For testing cross-origin
          '--simulate-outdated-no-au', // Simulate slow devices
          '--enable-low-end-device-mode',
          '--max_old_space_size=256' // Limit memory like budget phones
        ]
      });
      
      // Test each device configuration
      for (const [deviceName, deviceConfig] of Object.entries(MOBILE_DEVICES)) {
        console.log(`\\n📱 Testing ${deviceName}...`);
        await this.testDevice(browser, deviceName, deviceConfig);
      }
      
      // Run specialized tests
      await this.testOfflineCrisisMode(browser);
      await this.testCrisisDetectionSystem(browser);
      await this.testTremorCompensation(browser);
      
    } catch (error) {
      this.results.errors.push({
        type: 'VALIDATION_ERROR',
        message: error.message,
        stack: error.stack
      });
    } finally {
      if (browser) {
        await browser.close();
      }
      await this.generateReport();
    }
  }

  async testDevice(browser, deviceName, deviceConfig) {
    const page = await browser.newPage();
    
    try {
      // Set device emulation
      await page.setUserAgent(deviceConfig.userAgent);
      await page.setViewport(deviceConfig.viewport);
      
      // Enable slow network simulation for crisis testing
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 50 * 1024, // 50kb/s - simulate poor connection
        uploadThroughput: 20 * 1024,   // 20kb/s
        latency: 500 // 500ms latency
      });
      
      // CPU throttling for budget devices
      const client = await page.target().createCDPSession();
      await client.send('Emulation.setCPUThrottlingRate', { rate: 6 });
      
      // Test each critical page
      for (const pagePath of CRITICAL_PAGES) {
        console.log(`  📄 Testing ${pagePath}...`);
        await this.testPage(page, deviceName, pagePath);
      }
      
    } catch (error) {
      this.results.errors.push({
        device: deviceName,
        type: 'DEVICE_TEST_ERROR',
        message: error.message
      });
    } finally {
      await page.close();
    }
  }

  async testPage(page, deviceName, pagePath) {
    const pageStartTime = performance.now();
    
    try {
      // Navigate with timeout for slow connections
      await page.goto(`http://localhost:3000${pagePath}`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for critical elements to load
      await page.waitForSelector('body', { timeout: 10000 });
      
      const pageLoadTime = performance.now() - pageStartTime;
      
      // Test touch targets
      await this.validateTouchTargets(page, deviceName, pagePath);
      
      // Test performance metrics
      await this.measurePerformance(page, deviceName, pagePath, pageLoadTime);
      
      // Test accessibility
      await this.validateAccessibility(page, deviceName, pagePath);
      
      // Test crisis-specific features
      if (pagePath === '/dashboard' || pagePath === '/') {
        await this.testCrisisButton(page, deviceName, pagePath);
      }
      
    } catch (error) {
      this.results.errors.push({
        device: deviceName,
        page: pagePath,
        type: 'PAGE_TEST_ERROR',
        message: error.message
      });
    }
  }

  async validateTouchTargets(page, deviceName, pagePath) {
    console.log(`    👆 Validating touch targets...`);
    
    const touchTargets = await page.evaluate(() => {
      const selectors = [
        'button', 'a', 'input', 'textarea', '[role="button"]', 
        '.touch-safe', '.touch-target-large', '.touch-crisis',
        '[onclick]', '[tabindex]'
      ];
      
      const elements = [];
      
      selectors.forEach(selector => {
        const nodeList = document.querySelectorAll(selector);
        nodeList.forEach(element => {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          
          if (rect.width > 0 && rect.height > 0) { // Only visible elements
            elements.push({
              selector: selector,
              tagName: element.tagName,
              className: element.className,
              id: element.id,
              width: rect.width,
              height: rect.height,
              minWidth: parseInt(computedStyle.minWidth) || rect.width,
              minHeight: parseInt(computedStyle.minHeight) || rect.height,
              text: element.textContent?.slice(0, 50) + '...',
              isCrisisElement: element.classList.contains('crisis-accessible') || 
                              element.classList.contains('touch-crisis') ||
                              element.innerHTML.includes('crisis') ||
                              element.innerHTML.includes('988')
            });
          }
        });
      });
      
      return elements;
    });
    
    // Analyze touch target sizes
    const inadequateTargets = touchTargets.filter(target => {
      const minSize = target.isCrisisElement ? 70 : 60; // Crisis elements need 70px+
      return target.width < minSize || target.height < minSize;
    });
    
    this.results.touchTargets.push({
      device: deviceName,
      page: pagePath,
      totalTargets: touchTargets.length,
      inadequateTargets: inadequateTargets.length,
      inadequateDetails: inadequateTargets,
      passRate: ((touchTargets.length - inadequateTargets.length) / touchTargets.length * 100).toFixed(1)
    });
    
    console.log(`      ✅ ${touchTargets.length - inadequateTargets.length}/${touchTargets.length} targets meet minimum size (${inadequateTargets.length === 0 ? 'PASS' : 'NEEDS_FIX'})`);
  }

  async measurePerformance(page, deviceName, pagePath, pageLoadTime) {
    console.log(`    ⚡ Measuring performance...`);
    
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        // Memory usage (Chrome only)
        memoryUsage: performance.memory ? {
          used: performance.memory.usedJSHeapSize / 1024 / 1024,
          total: performance.memory.totalJSHeapSize / 1024 / 1024,
          limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
        } : null
      };
    });
    
    // Core Web Vitals assessment for crisis situations
    const assessment = {
      pageLoad: pageLoadTime < 3000 ? 'GOOD' : pageLoadTime < 5000 ? 'NEEDS_IMPROVEMENT' : 'POOR',
      fcp: metrics.firstContentfulPaint < 1800 ? 'GOOD' : metrics.firstContentfulPaint < 3000 ? 'NEEDS_IMPROVEMENT' : 'POOR',
      memory: metrics.memoryUsage ? 
        (metrics.memoryUsage.used < 50 ? 'GOOD' : metrics.memoryUsage.used < 100 ? 'NEEDS_IMPROVEMENT' : 'POOR') : 
        'UNKNOWN'
    };
    
    this.results.performance.push({
      device: deviceName,
      page: pagePath,
      pageLoadTime: Math.round(pageLoadTime),
      metrics: metrics,
      assessment: assessment,
      overallScore: Object.values(assessment).filter(v => v === 'GOOD').length / Object.keys(assessment).length
    });
    
    console.log(`      ⚡ Load: ${Math.round(pageLoadTime)}ms (${assessment.pageLoad}), FCP: ${Math.round(metrics.firstContentfulPaint)}ms (${assessment.fcp})`);
  }

  async validateAccessibility(page, deviceName, pagePath) {
    console.log(`    ♿ Validating accessibility...`);
    
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for proper ARIA labels on interactive elements
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, [role="button"]');
      interactiveElements.forEach(element => {
        const hasAriaLabel = element.hasAttribute('aria-label');
        const hasAriaDescribedBy = element.hasAttribute('aria-describedby');
        const hasVisibleText = element.textContent.trim().length > 0;
        const hasAltText = element.hasAttribute('alt');
        
        if (!hasAriaLabel && !hasAriaDescribedBy && !hasVisibleText && !hasAltText) {
          issues.push({
            type: 'MISSING_LABEL',
            element: element.tagName + (element.className ? '.' + element.className : ''),
            message: 'Interactive element lacks accessible name'
          });
        }
      });
      
      // Check color contrast for crisis elements
      const crisisElements = document.querySelectorAll('[class*="crisis"], [class*="emergency"]');
      crisisElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const bgColor = styles.backgroundColor;
        const color = styles.color;
        
        // Simple check - should have actual contrast calculation
        if (bgColor === 'rgba(0, 0, 0, 0)' && color === 'rgb(255, 255, 255)') {
          issues.push({
            type: 'LOW_CONTRAST',
            element: element.tagName + (element.className ? '.' + element.className : ''),
            message: 'Crisis element may have insufficient contrast'
          });
        }
      });
      
      return issues;
    });
    
    this.results.accessibility.push({
      device: deviceName,
      page: pagePath,
      issuesCount: accessibilityIssues.length,
      issues: accessibilityIssues,
      score: accessibilityIssues.length === 0 ? 'EXCELLENT' : 
             accessibilityIssues.length <= 2 ? 'GOOD' : 
             accessibilityIssues.length <= 5 ? 'NEEDS_IMPROVEMENT' : 'POOR'
    });
    
    console.log(`      ♿ ${accessibilityIssues.length} accessibility issues found (${accessibilityIssues.length === 0 ? 'PASS' : 'NEEDS_ATTENTION'})`);
  }

  async testCrisisButton(page, deviceName, pagePath) {
    console.log(`    🆘 Testing crisis support accessibility...`);
    
    try {
      // Look for crisis floating button
      const crisisButton = await page.$('.crisis-accessible, [class*="crisis"], button[aria-label*="crisis" i]');
      
      if (crisisButton) {
        const buttonInfo = await page.evaluate(button => {
          const rect = button.getBoundingClientRect();
          return {
            visible: rect.width > 0 && rect.height > 0,
            size: { width: rect.width, height: rect.height },
            position: { x: rect.x, y: rect.y },
            zIndex: window.getComputedStyle(button).zIndex,
            accessible: button.hasAttribute('aria-label') || button.textContent.trim().length > 0
          };
        }, crisisButton);
        
        console.log(`      🆘 Crisis button found: ${buttonInfo.size.width}x${buttonInfo.size.height}px (${buttonInfo.visible ? 'VISIBLE' : 'HIDDEN'})`);
        
        // Test if it's easily reachable (bottom area of screen)
        const viewport = page.viewport();
        const isReachable = buttonInfo.position.y > viewport.height * 0.6; // Bottom 40% of screen
        
        console.log(`      👆 Crisis button reachability: ${isReachable ? 'GOOD' : 'NEEDS_IMPROVEMENT'}`);
      } else {
        console.log(`      ❌ Crisis button not found on ${pagePath}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Crisis button test failed: ${error.message}`);
    }
  }

  async testOfflineCrisisMode(browser) {
    console.log(`\\n📵 Testing offline crisis functionality...`);
    
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
      
      // Go online first to load the app
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
      
      // Trigger offline mode
      await page.setOfflineMode(true);
      
      // Try to navigate to crisis resources
      await page.goto('http://localhost:3000/crisis-resources', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      // Check if crisis resources are available offline
      const offlineContent = await page.evaluate(() => {
        return {
          hasContent: document.body.textContent.length > 100,
          hasCrisisNumbers: document.body.textContent.includes('988') || document.body.textContent.includes('911'),
          hasOfflineIndicator: document.body.textContent.includes('offline') || document.body.textContent.includes('Offline')
        };
      });
      
      this.results.offline.push({
        test: 'crisis_resources_offline',
        passed: offlineContent.hasCrisisNumbers,
        details: offlineContent
      });
      
      console.log(`  📵 Crisis resources offline: ${offlineContent.hasCrisisNumbers ? 'AVAILABLE' : 'UNAVAILABLE'}`);
      
    } catch (error) {
      this.results.errors.push({
        type: 'OFFLINE_TEST_ERROR',
        message: error.message
      });
    } finally {
      await page.close();
    }
  }

  async testCrisisDetectionSystem(browser) {
    console.log(`\\n🔍 Testing crisis detection system...`);
    
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
      await page.goto('http://localhost:3000/journal', { waitUntil: 'networkidle0' });
      
      // Simulate crisis-related text input
      const textarea = await page.$('textarea');
      if (textarea) {
        await textarea.type('I am feeling really overwhelmed and having thoughts of self-harm. I need help.');
        
        // Wait for crisis detection to potentially trigger
        await page.waitForTimeout(3000);
        
        // Check if crisis support was activated
        const crisisDetected = await page.evaluate(() => {
          return document.body.classList.contains('crisis-detected') || 
                 document.body.classList.contains('crisis-mode') ||
                 document.querySelector('[class*="crisis-overlay"]') !== null;
        });
        
        console.log(`  🔍 Crisis detection: ${crisisDetected ? 'TRIGGERED' : 'NOT_TRIGGERED'}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Crisis detection test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testTremorCompensation(browser) {
    console.log(`\\n🤝 Testing tremor compensation...`);
    
    const page = await browser.newPage();
    try {
      await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
      await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
      
      // Simulate rapid, small movements (tremor-like behavior)
      const button = await page.$('button');
      if (button) {
        // Quick succession of small movements
        for (let i = 0; i < 5; i++) {
          await page.mouse.move(200 + i * 2, 300 + i * 2);
          await page.waitForTimeout(50);
        }
        
        // Check if tremor compensation was applied
        const hasCompensation = await page.evaluate(() => {
          return document.body.classList.contains('tremor-compensation') ||
                 document.querySelector('.tremor-safe') !== null;
        });
        
        console.log(`  🤝 Tremor compensation: ${hasCompensation ? 'ACTIVE' : 'INACTIVE'}`);
      }
    } catch (error) {
      console.log(`  ⚠️  Tremor compensation test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async generateReport() {
    const totalTime = Math.round(performance.now() - this.startTime);
    
    console.log('\\n\\n📊 ALCHM Mobile Crisis Validation Report');
    console.log('==========================================\\n');
    
    // Touch Targets Summary
    console.log('👆 TOUCH TARGETS:');
    const touchTargetsSummary = this.results.touchTargets.reduce((acc, result) => {
      acc.total += result.totalTargets;
      acc.inadequate += result.inadequateTargets;
      return acc;
    }, { total: 0, inadequate: 0 });
    
    const touchTargetScore = ((touchTargetsSummary.total - touchTargetsSummary.inadequate) / touchTargetsSummary.total * 100).toFixed(1);
    console.log(`  Overall: ${touchTargetScore}% of touch targets meet trauma-informed size requirements`);
    console.log(`  Status: ${touchTargetScore >= 90 ? '✅ EXCELLENT' : touchTargetScore >= 75 ? '⚠️  GOOD' : '❌ NEEDS_IMPROVEMENT'}\\n`);
    
    // Performance Summary
    console.log('⚡ PERFORMANCE:');
    const performanceScores = this.results.performance.map(p => p.overallScore);
    const avgPerformanceScore = (performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length * 100).toFixed(1);
    console.log(`  Average Score: ${avgPerformanceScore}%`);
    console.log(`  Status: ${avgPerformanceScore >= 80 ? '✅ EXCELLENT' : avgPerformanceScore >= 60 ? '⚠️  GOOD' : '❌ NEEDS_IMPROVEMENT'}\\n`);
    
    // Accessibility Summary
    console.log('♿ ACCESSIBILITY:');
    const totalA11yIssues = this.results.accessibility.reduce((acc, result) => acc + result.issuesCount, 0);
    console.log(`  Total Issues: ${totalA11yIssues}`);
    console.log(`  Status: ${totalA11yIssues === 0 ? '✅ EXCELLENT' : totalA11yIssues <= 5 ? '⚠️  GOOD' : '❌ NEEDS_IMPROVEMENT'}\\n`);
    
    // Offline Crisis Support
    console.log('📵 OFFLINE CRISIS SUPPORT:');
    const offlinePassed = this.results.offline.filter(test => test.passed).length;
    const offlineTotal = this.results.offline.length;
    console.log(`  Tests Passed: ${offlinePassed}/${offlineTotal}`);
    console.log(`  Status: ${offlinePassed === offlineTotal ? '✅ EXCELLENT' : '❌ NEEDS_IMPROVEMENT'}\\n`);
    
    // Errors
    if (this.results.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.results.errors.forEach(error => {
        console.log(`  - ${error.type}: ${error.message}`);
      });
      console.log('');
    }
    
    // Overall Assessment
    const overallScore = (
      (touchTargetScore / 100) * 0.3 +
      (avgPerformanceScore / 100) * 0.3 +
      (totalA11yIssues === 0 ? 1 : totalA11yIssues <= 5 ? 0.7 : 0.3) * 0.2 +
      (offlinePassed / Math.max(offlineTotal, 1)) * 0.2
    ) * 100;
    
    console.log('🎯 OVERALL MOBILE CRISIS READINESS:');
    console.log(`  Score: ${overallScore.toFixed(1)}%`);
    console.log(`  Status: ${overallScore >= 80 ? '✅ READY FOR CRISIS USERS' : overallScore >= 60 ? '⚠️  NEEDS_MINOR_IMPROVEMENTS' : '❌ REQUIRES_MAJOR_IMPROVEMENTS'}`);
    console.log(`  Test Duration: ${totalTime}ms\\n`);
    
    // Save detailed results
    const fs = require('fs');
    fs.writeFileSync('./mobile-crisis-validation-results.json', JSON.stringify(this.results, null, 2));
    console.log('📄 Detailed results saved to: mobile-crisis-validation-results.json');
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MobileCrisisValidator();
  validator.runValidation().catch(console.error);
}

module.exports = MobileCrisisValidator;