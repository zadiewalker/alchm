#!/usr/bin/env node

/**
 * Mobile Trauma-Informed Experience Testing Script
 * Tests ALCHM mobile optimizations for trauma survivors
 * 
 * Focus Areas:
 * - Touch target accessibility (60px+ minimum)
 * - Crisis support instant access
 * - Performance on older devices
 * - Single-handed operation compatibility
 * - Text readability during emotional distress
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Mobile device configurations for testing
const MOBILE_DEVICES = [
  // Older devices trauma survivors might use
  {
    name: 'iPhone 6',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true
  },
  {
    name: 'iPhone SE',
    viewport: { width: 320, height: 568 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_0 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: true
  },
  {
    name: 'Budget Android',
    viewport: { width: 360, height: 640 },
    userAgent: 'Mozilla/5.0 (Linux; Android 8.0; SM-G360V) AppleWebKit/537.36',
    deviceScaleFactor: 1.5,
    hasTouch: true,
    isMobile: true
  },
  {
    name: 'iPhone 12 Pro',
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true
  }
];

// Network conditions for testing
const NETWORK_CONDITIONS = [
  { name: 'Slow 3G', downloadThroughput: 0.5 * 1024 * 1024 / 8, uploadThroughput: 0.5 * 1024 * 1024 / 8, latency: 2000 },
  { name: 'Fast 3G', downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 0.75 * 1024 * 1024 / 8, latency: 562.5 },
  { name: 'WiFi', downloadThroughput: 30 * 1024 * 1024 / 8, uploadThroughput: 15 * 1024 * 1024 / 8, latency: 28 }
];

// Touch target minimum requirements (trauma-informed)
const TOUCH_TARGET_REQUIREMENTS = {
  minimum: 52, // WCAG AA
  traumaInformed: 60, // Enhanced for trembling hands
  crisis: 70 // Crisis situations
};

// Performance thresholds for trauma survivors
const PERFORMANCE_THRESHOLDS = {
  loadTime: 3000, // 3 seconds maximum
  crisisLoadTime: 1000, // Crisis resources must load within 1 second
  interactionDelay: 100, // Maximum delay for touch response
  coreWebVitals: {
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1   // Cumulative Layout Shift
  }
};

class MobileTraumaExperienceTester {
  constructor() {
    this.results = {
      devices: [],
      overallScore: 0,
      criticalIssues: [],
      recommendations: []
    };
  }

  async run() {
    console.log('🏥 Starting Mobile Trauma-Informed Experience Testing...\n');
    
    const browser = await chromium.launch({ headless: false });
    
    for (const device of MOBILE_DEVICES) {
      console.log(`📱 Testing on ${device.name}...`);
      await this.testDevice(browser, device);
    }
    
    await browser.close();
    
    this.generateReport();
    this.saveResults();
  }

  async testDevice(browser, device) {
    const context = await browser.newContext({
      viewport: device.viewport,
      userAgent: device.userAgent,
      deviceScaleFactor: device.deviceScaleFactor,
      hasTouch: device.hasTouch,
      isMobile: device.isMobile
    });

    const deviceResults = {
      device: device.name,
      viewport: device.viewport,
      tests: {},
      score: 0,
      issues: []
    };

    const page = await context.newPage();

    // Test different network conditions
    for (const network of NETWORK_CONDITIONS) {
      console.log(`  🌐 Testing ${network.name} connection...`);
      
      await page.route('**/*', route => {
        route.continue();
      });

      // Simulate network conditions
      await context.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * network.latency));
        await route.continue();
      });

      const testResult = await this.runDeviceTests(page, device, network);
      deviceResults.tests[network.name] = testResult;
    }

    // Calculate device score
    const testScores = Object.values(deviceResults.tests).map(t => t.score);
    deviceResults.score = testScores.reduce((a, b) => a + b, 0) / testScores.length;

    this.results.devices.push(deviceResults);
    await context.close();
  }

  async runDeviceTests(page, device, network) {
    const testResult = {
      network: network.name,
      score: 0,
      metrics: {},
      touchTargets: [],
      accessibility: {},
      performance: {},
      crisisSupport: {}
    };

    try {
      // Navigate to homepage
      const startTime = Date.now();
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      testResult.performance.loadTime = loadTime;
      
      // Test 1: Touch Target Accessibility
      console.log('    🎯 Testing touch targets...');
      await this.testTouchTargets(page, testResult);
      
      // Test 2: Crisis Support Accessibility
      console.log('    🚨 Testing crisis support access...');
      await this.testCrisisSupport(page, testResult);
      
      // Test 3: Text Readability
      console.log('    📖 Testing text readability...');
      await this.testTextReadability(page, testResult);
      
      // Test 4: Single-handed Operation
      console.log('    👍 Testing single-handed operation...');
      await this.testSingleHandedOperation(page, testResult);
      
      // Test 5: Performance Metrics
      console.log('    ⚡ Testing performance metrics...');
      await this.testPerformanceMetrics(page, testResult);
      
      // Test 6: Reduced Motion Compliance
      console.log('    🌊 Testing animation safety...');
      await this.testAnimationSafety(page, testResult);

      // Calculate test score
      testResult.score = this.calculateTestScore(testResult);
      
    } catch (error) {
      console.error(`    ❌ Error testing ${device.name} on ${network.name}:`, error.message);
      testResult.error = error.message;
      testResult.score = 0;
    }

    return testResult;
  }

  async testTouchTargets(page, testResult) {
    const touchTargets = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, input, [role="button"]');
      return Array.from(elements).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          text: el.textContent?.trim().substring(0, 50) || '',
          width: rect.width,
          height: rect.height,
          area: rect.width * rect.height,
          classes: el.className
        };
      });
    });

    testResult.touchTargets = touchTargets;
    
    // Evaluate touch targets
    const inadequateTargets = touchTargets.filter(target => 
      target.width < TOUCH_TARGET_REQUIREMENTS.minimum || 
      target.height < TOUCH_TARGET_REQUIREMENTS.minimum
    );
    
    const traumaOptimizedTargets = touchTargets.filter(target =>
      target.width >= TOUCH_TARGET_REQUIREMENTS.traumaInformed &&
      target.height >= TOUCH_TARGET_REQUIREMENTS.traumaInformed
    );

    if (inadequateTargets.length > 0) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`${inadequateTargets.length} touch targets below 52px minimum`);
    }

    testResult.touchTargetScore = Math.max(0, 100 - (inadequateTargets.length * 10));
  }

  async testCrisisSupport(page, testResult) {
    // Test crisis button presence and accessibility
    const crisisButton = await page.$('[href="tel:988"], .crisis-button-mobile, .touch-target-crisis');
    
    if (!crisisButton) {
      testResult.crisisSupport.available = false;
      testResult.issues = testResult.issues || [];
      testResult.issues.push('Crisis support button not found');
      return;
    }

    testResult.crisisSupport.available = true;
    
    // Test crisis button accessibility
    const crisisButtonInfo = await crisisButton.evaluate(el => {
      const rect = el.getBoundingClientRect();
      return {
        visible: rect.width > 0 && rect.height > 0,
        width: rect.width,
        height: rect.height,
        text: el.textContent?.trim(),
        href: el.href
      };
    });

    testResult.crisisSupport.button = crisisButtonInfo;
    
    // Test crisis button tap response time
    const tapStartTime = Date.now();
    await crisisButton.tap();
    const tapResponseTime = Date.now() - tapStartTime;
    
    testResult.crisisSupport.responseTime = tapResponseTime;
    
    if (tapResponseTime > PERFORMANCE_THRESHOLDS.interactionDelay) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`Crisis button response time too slow: ${tapResponseTime}ms`);
    }
  }

  async testTextReadability(page, testResult) {
    const textMetrics = await page.evaluate(() => {
      const textElements = document.querySelectorAll('h1, h2, h3, p, span, a, button');
      const metrics = [];
      
      textElements.forEach(el => {
        const styles = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        if (rect.width > 0 && rect.height > 0) {
          metrics.push({
            tag: el.tagName,
            fontSize: parseFloat(styles.fontSize),
            lineHeight: styles.lineHeight,
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontWeight: styles.fontWeight,
            text: el.textContent?.trim().substring(0, 30) || ''
          });
        }
      });
      
      return metrics;
    });

    // Check for minimum font sizes (crisis readability)
    const smallText = textMetrics.filter(text => text.fontSize < 16);
    
    if (smallText.length > 0) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`${smallText.length} text elements below 16px (poor crisis readability)`);
    }

    testResult.accessibility.textMetrics = textMetrics;
    testResult.accessibility.smallTextCount = smallText.length;
  }

  async testSingleHandedOperation(page, testResult) {
    // Test if critical elements are in thumb-reach zones
    const thumbZoneElements = await page.evaluate(() => {
      const viewportHeight = window.innerHeight;
      const thumbZoneHeight = Math.min(viewportHeight * 0.75, 120); // Bottom 75% or 120px
      const thumbZoneBottom = viewportHeight;
      const thumbZoneTop = thumbZoneBottom - thumbZoneHeight;
      
      const criticalElements = document.querySelectorAll('button, a[href], input, [role="button"]');
      const elementsInThumbZone = [];
      const elementsOutsideThumbZone = [];
      
      criticalElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        
        if (elementCenter >= thumbZoneTop && elementCenter <= thumbZoneBottom) {
          elementsInThumbZone.push({
            tag: el.tagName,
            text: el.textContent?.trim().substring(0, 30) || '',
            y: elementCenter
          });
        } else {
          elementsOutsideThumbZone.push({
            tag: el.tagName,
            text: el.textContent?.trim().substring(0, 30) || '',
            y: elementCenter
          });
        }
      });
      
      return {
        thumbZoneHeight,
        thumbZoneTop,
        elementsInThumbZone,
        elementsOutsideThumbZone
      };
    });

    testResult.singleHanded = thumbZoneElements;
    
    if (thumbZoneElements.elementsOutsideThumbZone.length > 0) {
      const criticalOutside = thumbZoneElements.elementsOutsideThumbZone.filter(el => 
        el.text.includes('Begin') || el.text.includes('Sign') || el.text.includes('Crisis')
      );
      
      if (criticalOutside.length > 0) {
        testResult.issues = testResult.issues || [];
        testResult.issues.push(`${criticalOutside.length} critical elements outside thumb reach zone`);
      }
    }
  }

  async testPerformanceMetrics(page, testResult) {
    // Get Core Web Vitals and performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {};
          
          entries.forEach(entry => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.LCP = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.FID = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.CLS = (metrics.CLS || 0) + entry.value;
            }
          });
          
          // Resolve after a short timeout to collect metrics
          setTimeout(() => resolve(metrics), 1000);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 3000);
      });
    });

    testResult.performance = { ...testResult.performance, ...performanceMetrics };
    
    // Check against thresholds
    if (performanceMetrics.LCP > PERFORMANCE_THRESHOLDS.coreWebVitals.LCP) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`LCP too slow: ${performanceMetrics.LCP}ms`);
    }
    
    if (performanceMetrics.FID > PERFORMANCE_THRESHOLDS.coreWebVitals.FID) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`FID too slow: ${performanceMetrics.FID}ms`);
    }
    
    if (performanceMetrics.CLS > PERFORMANCE_THRESHOLDS.coreWebVitals.CLS) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`CLS too high: ${performanceMetrics.CLS}`);
    }
  }

  async testAnimationSafety(page, testResult) {
    // Test for prefers-reduced-motion compliance
    const animationCompliance = await page.evaluate(() => {
      // Check if reduced motion is respected
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      // Get all elements with transitions or animations
      const animatedElements = document.querySelectorAll('*');
      let unsafeAnimations = 0;
      
      animatedElements.forEach(el => {
        const styles = getComputedStyle(el);
        const transition = styles.transitionDuration;
        const animation = styles.animationDuration;
        
        if (mediaQuery.matches) {
          // If reduced motion is preferred, animations should be minimal
          if (transition && transition !== '0s' && parseFloat(transition) > 0.1) {
            unsafeAnimations++;
          }
          if (animation && animation !== '0s' && parseFloat(animation) > 0.1) {
            unsafeAnimations++;
          }
        }
      });
      
      return {
        reducedMotionPreferred: mediaQuery.matches,
        unsafeAnimationCount: unsafeAnimations
      };
    });

    testResult.accessibility.animationCompliance = animationCompliance;
    
    if (animationCompliance.unsafeAnimationCount > 0) {
      testResult.issues = testResult.issues || [];
      testResult.issues.push(`${animationCompliance.unsafeAnimationCount} animations don't respect reduced motion preference`);
    }
  }

  calculateTestScore(testResult) {
    let score = 100;
    
    // Deduct points for issues
    if (testResult.issues) {
      score -= testResult.issues.length * 10;
    }
    
    // Performance penalties
    if (testResult.performance.loadTime > PERFORMANCE_THRESHOLDS.loadTime) {
      score -= 20;
    }
    
    // Crisis support is critical
    if (!testResult.crisisSupport.available) {
      score -= 50;
    }
    
    // Touch target penalties
    if (testResult.accessibility.smallTextCount > 3) {
      score -= 15;
    }
    
    return Math.max(0, score);
  }

  generateReport() {
    console.log('\n📊 Mobile Trauma-Informed Experience Test Results\n');
    console.log('=' .repeat(60));
    
    this.results.devices.forEach(device => {
      console.log(`\n📱 ${device.device} (${device.viewport.width}x${device.viewport.height})`);
      console.log(`   Overall Score: ${device.score.toFixed(1)}/100`);
      
      Object.entries(device.tests).forEach(([network, test]) => {
        console.log(`   ${network}: ${test.score}/100`);
        if (test.issues && test.issues.length > 0) {
          test.issues.forEach(issue => {
            console.log(`     ⚠️  ${issue}`);
          });
        }
      });
    });
    
    // Overall assessment
    const overallScore = this.results.devices.reduce((sum, device) => sum + device.score, 0) / this.results.devices.length;
    this.results.overallScore = overallScore;
    
    console.log(`\n🏆 Overall Mobile Trauma Experience Score: ${overallScore.toFixed(1)}/100`);
    
    if (overallScore >= 90) {
      console.log('✅ Excellent trauma-informed mobile experience!');
    } else if (overallScore >= 80) {
      console.log('✅ Good mobile experience with room for improvement');
    } else if (overallScore >= 70) {
      console.log('⚠️  Needs improvement for trauma survivors');
    } else {
      console.log('❌ Critical issues need immediate attention');
    }
  }

  saveResults() {
    const resultsPath = path.join(__dirname, '../mobile-trauma-test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Results saved to: ${resultsPath}`);
  }
}

// Run the tests
if (require.main === module) {
  const tester = new MobileTraumaExperienceTester();
  tester.run().catch(console.error);
}

module.exports = MobileTraumaExperienceTester;