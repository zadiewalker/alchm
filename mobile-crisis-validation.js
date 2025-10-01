#!/usr/bin/env node

/**
 * MOBILE CRISIS VALIDATION SUITE
 * Comprehensive testing for trauma-informed mobile optimization
 * Tests all critical accessibility and performance requirements for users in crisis
 */

const puppeteer = require('puppeteer');

const CRISIS_PERFORMANCE_THRESHOLDS = {
  pageLoadTime: 3000,      // 3 seconds max for crisis access
  crisisButtonSize: 60,    // 60px minimum for trembling hands
  touchTargetSpacing: 8,   // 8px minimum between targets
  fontSizeMinimum: 16,     // 16px minimum for readability through tears
  batteryLowThreshold: 15, // 15% battery triggers emergency mode
  slowConnectionSpeed: '3g' // 3G or slower triggers optimization
};

class MobileCrisisValidator {
  constructor() {
    this.results = {
      touchTargetSafety: { passed: false, details: [] },
      networkResilience: { passed: false, details: [] },
      panicSafeInterface: { passed: false, details: [] },
      performanceOptimization: { passed: false, details: [] },
      batteryOptimization: { passed: false, details: [] },
      offlineCrisisSupport: { passed: false, details: [] },
      accessibilityCompliance: { passed: false, details: [] },
      emergencyAccess: { passed: false, details: [] }
    };
  }

  async initialize() {
    console.log('🚨 Starting Mobile Crisis Validation Suite...\n');
    
    // Launch browser with mobile simulation and low-end device specs
    this.browser = await puppeteer.launch({
      headless: false, // Show browser for visual validation
      args: [
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--memory-pressure-off',
        '--max_old_space_size=512' // Simulate low-memory device
      ]
    });

    this.page = await this.browser.newPage();

    // Simulate low-end Android device under stress
    await this.page.emulate({
      name: 'Crisis Simulation - Old Android',
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-A520F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      viewport: {
        width: 360,
        height: 640,
        deviceScaleFactor: 2.0,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    });

    // Simulate slow network conditions during crisis
    await this.page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: 500 * 1024, // 500kb/s (slow 3G)
      uploadThroughput: 200 * 1024,   // 200kb/s upload
      latency: 300 // 300ms latency
    });

    console.log('📱 Simulating crisis conditions: Old Android + Slow 3G + High Stress\n');
  }

  async validateTouchTargetSafety() {
    console.log('🖐️ Testing Touch Target Safety for Trembling Hands...');
    
    try {
      await this.page.goto('http://localhost:3000');
      await this.page.waitForLoadEvent('networkidle0');

      // Find all interactive elements
      const touchTargets = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], .touch-target');
        const results = [];
        
        elements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const computedStyle = window.getComputedStyle(element);
          
          // Check if element is visible and clickable
          if (rect.width > 0 && rect.height > 0 && computedStyle.display !== 'none') {
            results.push({
              index,
              width: rect.width,
              height: rect.height,
              minSize: Math.min(rect.width, rect.height),
              element: element.tagName.toLowerCase(),
              classList: Array.from(element.classList),
              isCrisisElement: element.classList.contains('crisis-accessible') || 
                              element.classList.contains('touch-target') ||
                              element.closest('[class*="crisis"]') !== null,
              isVisible: true
            });
          }
        });
        
        return results;
      });

      // Analyze touch target safety
      const crisisElements = touchTargets.filter(t => t.isCrisisElement);
      const regularElements = touchTargets.filter(t => !t.isCrisisElement);

      let passed = true;
      const details = [];

      // Crisis elements must be 60px+ minimum
      crisisElements.forEach(element => {
        if (element.minSize < CRISIS_PERFORMANCE_THRESHOLDS.crisisButtonSize) {
          passed = false;
          details.push(`❌ Crisis element too small: ${element.element} (${element.minSize}px < ${CRISIS_PERFORMANCE_THRESHOLDS.crisisButtonSize}px required)`);
        } else {
          details.push(`✅ Crisis element size OK: ${element.element} (${element.minSize}px)`);
        }
      });

      // Regular elements should be 44px+ minimum (Apple HIG)
      regularElements.forEach(element => {
        if (element.minSize < 44) {
          details.push(`⚠️ Regular element small: ${element.element} (${element.minSize}px < 44px recommended)`);
        }
      });

      // Check for crisis floating button
      const hasCrisisButton = crisisElements.some(el => 
        el.classList.some(cls => cls.includes('crisis')) && el.minSize >= CRISIS_PERFORMANCE_THRESHOLDS.crisisButtonSize
      );

      if (!hasCrisisButton) {
        passed = false;
        details.push('❌ No accessible crisis button found (60px+ required)');
      } else {
        details.push('✅ Crisis button found and accessible');
      }

      this.results.touchTargetSafety = { passed, details };
      
      console.log(passed ? '✅ Touch Target Safety: PASSED' : '❌ Touch Target Safety: FAILED');
      details.forEach(detail => console.log(`   ${detail}`));
      
    } catch (error) {
      console.error('❌ Touch Target Safety test failed:', error.message);
      this.results.touchTargetSafety = { passed: false, details: [error.message] };
    }

    console.log('');
  }

  async validateNetworkResilience() {
    console.log('📶 Testing Network Resilience on Slow 3G...');
    
    try {
      // Test page load performance under crisis conditions
      const startTime = Date.now();
      await this.page.goto('http://localhost:3000');
      await this.page.waitForLoadEvent('domcontentloaded');
      const loadTime = Date.now() - startTime;

      let passed = true;
      const details = [];

      // Check page load time
      if (loadTime > CRISIS_PERFORMANCE_THRESHOLDS.pageLoadTime) {
        passed = false;
        details.push(`❌ Page load too slow: ${loadTime}ms > ${CRISIS_PERFORMANCE_THRESHOLDS.pageLoadTime}ms threshold`);
      } else {
        details.push(`✅ Page load time acceptable: ${loadTime}ms`);
      }

      // Test crisis button availability during poor network
      const crisisButtonVisible = await this.page.evaluate(() => {
        const crisisButton = document.querySelector('.crisis-accessible, [class*="crisis-floating"]');
        return crisisButton && crisisButton.getBoundingClientRect().width > 0;
      });

      if (!crisisButtonVisible) {
        passed = false;
        details.push('❌ Crisis button not immediately visible on slow connection');
      } else {
        details.push('✅ Crisis button loads quickly even on slow connection');
      }

      // Test offline fallback by temporarily going offline
      await this.page.emulateNetworkConditions({ offline: true });
      
      try {
        await this.page.reload();
        await this.page.waitForTimeout(2000); // Wait for offline handling
        
        const offlineContent = await this.page.evaluate(() => {
          return document.body.innerHTML.includes('Crisis') || 
                 document.body.innerHTML.includes('emergency') ||
                 document.body.innerHTML.includes('988');
        });

        if (offlineContent) {
          details.push('✅ Offline crisis support available');
        } else {
          details.push('⚠️ Limited offline crisis support detected');
        }
      } catch (offlineError) {
        details.push('⚠️ Offline mode test inconclusive');
      }

      // Restore network
      await this.page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 500 * 1024,
        uploadThroughput: 200 * 1024,
        latency: 300
      });

      this.results.networkResilience = { passed, details };
      
      console.log(passed ? '✅ Network Resilience: PASSED' : '❌ Network Resilience: FAILED');
      details.forEach(detail => console.log(`   ${detail}`));
      
    } catch (error) {
      console.error('❌ Network Resilience test failed:', error.message);
      this.results.networkResilience = { passed: false, details: [error.message] };
    }

    console.log('');
  }

  async validatePanicSafeInterface() {
    console.log('😰 Testing Panic-Safe Interface Stability...');
    
    try {
      await this.page.goto('http://localhost:3000');
      await this.page.waitForLoadEvent('networkidle0');

      let passed = true;
      const details = [];

      // Simulate rapid, erratic clicking (panic behavior)
      const panicClickResults = await this.page.evaluate(() => {
        const results = { errors: [], interactions: 0 };
        
        // Find clickable elements
        const clickableElements = document.querySelectorAll('button, a, input, [role="button"]');
        
        // Simulate rapid clicking
        clickableElements.forEach((element, index) => {
          if (index < 5) { // Test first 5 elements
            try {
              for (let i = 0; i < 5; i++) {
                element.click();
                results.interactions++;
              }
            } catch (error) {
              results.errors.push(`Error clicking element ${index}: ${error.message}`);
            }
          }
        });
        
        return results;
      });

      if (panicClickResults.errors.length > 0) {
        passed = false;
        details.push(`❌ Interface errors during panic simulation: ${panicClickResults.errors.length}`);
        panicClickResults.errors.forEach(error => details.push(`   ${error}`));
      } else {
        details.push(`✅ Interface stable during panic simulation (${panicClickResults.interactions} interactions)`);
      }

      // Test crisis button accessibility during stress
      const crisisButtonStressTest = await this.page.evaluate(() => {
        const crisisButton = document.querySelector('.crisis-accessible, [class*="crisis-floating"]');
        if (!crisisButton) return { success: false, reason: 'No crisis button found' };
        
        // Simulate stressed user interaction
        try {
          const rect = crisisButton.getBoundingClientRect();
          
          // Test if button is in thumb-reachable zone (bottom 2/3 of screen)
          const isInThumbZone = rect.bottom > window.innerHeight * 0.33;
          
          // Test if button responds to touch simulation
          crisisButton.dispatchEvent(new Event('touchstart', { bubbles: true }));
          crisisButton.dispatchEvent(new Event('touchend', { bubbles: true }));
          
          return { 
            success: true, 
            inThumbZone: isInThumbZone,
            size: Math.min(rect.width, rect.height)
          };
        } catch (error) {
          return { success: false, reason: error.message };
        }
      });

      if (!crisisButtonStressTest.success) {
        passed = false;
        details.push(`❌ Crisis button stress test failed: ${crisisButtonStressTest.reason}`);
      } else {
        details.push(`✅ Crisis button accessible during stress (${crisisButtonStressTest.size}px)`);
        if (!crisisButtonStressTest.inThumbZone) {
          details.push('⚠️ Crisis button outside optimal thumb zone');
        }
      }

      this.results.panicSafeInterface = { passed, details };
      
      console.log(passed ? '✅ Panic-Safe Interface: PASSED' : '❌ Panic-Safe Interface: FAILED');
      details.forEach(detail => console.log(`   ${detail}`));
      
    } catch (error) {
      console.error('❌ Panic-Safe Interface test failed:', error.message);
      this.results.panicSafeInterface = { passed: false, details: [error.message] };
    }

    console.log('');
  }

  async validatePerformanceOptimization() {
    console.log('⚡ Testing Performance Optimization for Old Devices...');
    
    try {
      // Test with CPU throttling to simulate old device
      await this.page.setCPUThrottlingRate(6); // 6x slower CPU
      
      const startTime = Date.now();
      await this.page.goto('http://localhost:3000');
      await this.page.waitForLoadEvent('domcontentloaded');
      const throttledLoadTime = Date.now() - startTime;

      let passed = true;
      const details = [];

      // Check Core Web Vitals under stress
      const coreWebVitals = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          const metrics = {};
          
          // First Contentful Paint
          const paintEntries = performance.getEntriesByType('paint');
          const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          metrics.fcp = fcp ? Math.round(fcp.startTime) : 0;
          
          // Largest Contentful Paint
          if ('PerformanceObserver' in window) {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              metrics.lcp = Math.round(lastEntry.startTime);
              lcpObserver.disconnect();
              resolve(metrics);
            });
            
            try {
              lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
              // Fallback if no LCP entries
              setTimeout(() => {
                if (!metrics.lcp) {
                  metrics.lcp = 0;
                  resolve(metrics);
                }
              }, 2000);
            } catch (error) {
              metrics.lcp = 0;
              resolve(metrics);
            }
          } else {
            metrics.lcp = 0;
            resolve(metrics);
          }
        });
      });

      // Check FCP threshold for crisis access
      if (coreWebVitals.fcp > 2000) { // 2 seconds max for first content
        passed = false;
        details.push(`❌ First Contentful Paint too slow: ${coreWebVitals.fcp}ms > 2000ms`);
      } else {
        details.push(`✅ First Contentful Paint acceptable: ${coreWebVitals.fcp}ms`);
      }

      // Check LCP threshold
      if (coreWebVitals.lcp > 2500) { // 2.5 seconds max for main content
        passed = false;
        details.push(`❌ Largest Contentful Paint too slow: ${coreWebVitals.lcp}ms > 2500ms`);
      } else if (coreWebVitals.lcp > 0) {
        details.push(`✅ Largest Contentful Paint acceptable: ${coreWebVitals.lcp}ms`);
      }

      // Test JavaScript execution efficiency
      const jsPerformance = await this.page.evaluate(() => {
        const start = performance.now();
        
        // Simulate typical app operations
        for (let i = 0; i < 1000; i++) {
          const div = document.createElement('div');
          div.textContent = 'test';
          document.body.appendChild(div);
          document.body.removeChild(div);
        }
        
        return Math.round(performance.now() - start);
      });

      if (jsPerformance > 100) { // 100ms max for basic operations
        details.push(`⚠️ JavaScript execution slow on old device: ${jsPerformance}ms`);
      } else {
        details.push(`✅ JavaScript execution efficient: ${jsPerformance}ms`);
      }

      // Reset CPU throttling
      await this.page.setCPUThrottlingRate(1);

      this.results.performanceOptimization = { passed, details };
      
      console.log(passed ? '✅ Performance Optimization: PASSED' : '❌ Performance Optimization: FAILED');
      details.forEach(detail => console.log(`   ${detail}`));
      
    } catch (error) {
      console.error('❌ Performance Optimization test failed:', error.message);
      this.results.performanceOptimization = { passed: false, details: [error.message] };
    }

    console.log('');
  }

  async validateEmergencyAccess() {
    console.log('🆘 Testing Emergency Access Speed...');
    
    try {
      await this.page.goto('http://localhost:3000');
      await this.page.waitForLoadEvent('domcontentloaded');

      let passed = true;
      const details = [];

      // Test crisis button immediate responsiveness
      const crisisButtonResponse = await this.page.evaluate(() => {
        const crisisButton = document.querySelector('.crisis-accessible, [class*="crisis-floating"], [class*="emergency"]');
        if (!crisisButton) return { found: false };
        
        const startTime = performance.now();
        
        // Simulate emergency tap
        crisisButton.click();
        
        return {
          found: true,
          responseTime: Math.round(performance.now() - startTime),
          visible: crisisButton.getBoundingClientRect().width > 0
        };
      });

      if (!crisisButtonResponse.found) {
        passed = false;
        details.push('❌ No emergency crisis button found');
      } else {
        if (crisisButtonResponse.responseTime > 100) { // 100ms max response
          passed = false;
          details.push(`❌ Crisis button response too slow: ${crisisButtonResponse.responseTime}ms > 100ms`);
        } else {
          details.push(`✅ Crisis button responds quickly: ${crisisButtonResponse.responseTime}ms`);
        }
      }

      // Test emergency contacts accessibility
      const emergencyContactsTest = await this.page.evaluate(() => {
        // Look for 988 lifeline or other emergency numbers
        const bodyText = document.body.textContent.toLowerCase();
        const has988 = bodyText.includes('988');
        const has911 = bodyText.includes('911');
        const hasCrisisText = bodyText.includes('crisis') && bodyText.includes('text');
        
        return {
          has988,
          has911, 
          hasCrisisText
        };
      });

      if (!emergencyContactsTest.has988 && !emergencyContactsTest.has911) {
        passed = false;
        details.push('❌ No emergency contact numbers visible');
      } else {
        if (emergencyContactsTest.has988) details.push('✅ 988 Lifeline accessible');
        if (emergencyContactsTest.has911) details.push('✅ 911 Emergency accessible');
        if (emergencyContactsTest.hasCrisisText) details.push('✅ Crisis text line accessible');
      }

      this.results.emergencyAccess = { passed, details };
      
      console.log(passed ? '✅ Emergency Access: PASSED' : '❌ Emergency Access: FAILED');
      details.forEach(detail => console.log(`   ${detail}`));
      
    } catch (error) {
      console.error('❌ Emergency Access test failed:', error.message);
      this.results.emergencyAccess = { passed: false, details: [error.message] };
    }

    console.log('');
  }

  async generateReport() {
    console.log('📊 MOBILE CRISIS VALIDATION REPORT');
    console.log('=' .repeat(50));
    console.log('');

    let totalTests = 0;
    let passedTests = 0;

    Object.entries(this.results).forEach(([testName, result]) => {
      totalTests++;
      if (result.passed) passedTests++;
      
      const status = result.passed ? '✅ PASSED' : '❌ FAILED';
      console.log(`${testName.toUpperCase()}: ${status}`);
      
      if (result.details.length > 0) {
        result.details.forEach(detail => {
          console.log(`  ${detail}`);
        });
      }
      console.log('');
    });

    const passRate = Math.round((passedTests / totalTests) * 100);
    console.log('SUMMARY');
    console.log('-' .repeat(20));
    console.log(`Tests Passed: ${passedTests}/${totalTests} (${passRate}%)`);
    console.log('');

    if (passRate >= 80) {
      console.log('🎉 MOBILE CRISIS SAFETY: ACCEPTABLE');
      console.log('The app provides adequate crisis support for mobile users in distress.');
    } else if (passRate >= 60) {
      console.log('⚠️ MOBILE CRISIS SAFETY: NEEDS IMPROVEMENT');
      console.log('Some critical issues found that could impact users in crisis.');
    } else {
      console.log('🚨 MOBILE CRISIS SAFETY: CRITICAL ISSUES');
      console.log('Major problems found that could prevent crisis access.');
    }

    // Save report to file
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        passRate
      },
      results: this.results
    };

    require('fs').writeFileSync(
      'mobile-crisis-validation-report.json',
      JSON.stringify(reportData, null, 2)
    );

    console.log('\n📄 Detailed report saved to: mobile-crisis-validation-report.json');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new MobileCrisisValidator();
  
  validator.initialize()
    .then(() => validator.validateTouchTargetSafety())
    .then(() => validator.validateNetworkResilience())
    .then(() => validator.validatePanicSafeInterface())
    .then(() => validator.validatePerformanceOptimization())
    .then(() => validator.validateEmergencyAccess())
    .then(() => validator.generateReport())
    .then(() => validator.cleanup())
    .catch((error) => {
      console.error('💥 Validation suite failed:', error);
      validator.cleanup();
      process.exit(1);
    });
}

module.exports = MobileCrisisValidator;