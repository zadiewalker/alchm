/**
 * MOBILE DASHBOARD CRISIS TESTING SUITE
 * Tests dashboard card interactions under various crisis and stress conditions
 */

const { chromium, devices } = require('playwright');

// Test configurations for different mobile scenarios
const MOBILE_TEST_CONFIGS = [
  {
    name: 'iPhone SE - Crisis Scenario',
    device: devices['iPhone SE'],
    networkConditions: {
      speed: 400 * 1024, // 400 KB/s (slow 3G)
      latency: 2000
    },
    cpuThrottling: 6,
    scenario: 'crisis'
  },
  {
    name: 'iPhone 13 Pro - Optimal',
    device: devices['iPhone 13 Pro'],
    networkConditions: {
      speed: 10 * 1024 * 1024, // 10 MB/s
      latency: 50
    },
    cpuThrottling: 1,
    scenario: 'optimal'
  },
  {
    name: 'Android Low-end - Stress Test',
    device: {
      name: 'Android Low-end',
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-J330F) AppleWebKit/537.36',
      viewport: { width: 360, height: 640 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    },
    networkConditions: {
      speed: 200 * 1024, // 200 KB/s (2G)
      latency: 3000
    },
    cpuThrottling: 12,
    scenario: 'stress'
  },
  {
    name: 'iPad - Touch Target Test',
    device: devices['iPad Pro'],
    networkConditions: {
      speed: 5 * 1024 * 1024, // 5 MB/s
      latency: 100
    },
    cpuThrottling: 2,
    scenario: 'tablet'
  }
];

const TOUCH_TARGET_REQUIREMENTS = {
  minimum: 44, // WCAG AA minimum
  recommended: 52, // ALCHM standard
  crisis: 60 // Crisis scenario minimum
};

async function testMobileDashboard() {
  console.log('🚀 Starting Mobile Dashboard Crisis Testing Suite\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100
  });

  const results = [];

  for (const config of MOBILE_TEST_CONFIGS) {
    console.log(`📱 Testing: ${config.name} (${config.scenario} scenario)`);
    
    const context = await browser.newContext({
      ...config.device,
      locale: 'en-US',
      timezoneId: 'America/Los_Angeles'
    });

    const page = await context.newPage();

    // Apply network and CPU throttling
    await page.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, config.networkConditions.latency));
      route.continue();
    });

    // Simulate CPU throttling with slower navigation
    if (config.cpuThrottling > 1) {
      await page.addInitScript(`
        const originalSetTimeout = window.setTimeout;
        window.setTimeout = function(fn, delay) {
          return originalSetTimeout(fn, delay * ${config.cpuThrottling});
        };
      `);
    }

    try {
      const result = await runMobileTestSuite(page, config);
      results.push(result);
      console.log(`✅ ${config.name}: ${result.passed ? 'PASSED' : 'FAILED'}\n`);
    } catch (error) {
      console.error(`❌ ${config.name}: ERROR - ${error.message}\n`);
      results.push({
        device: config.name,
        scenario: config.scenario,
        passed: false,
        error: error.message
      });
    }

    await context.close();
  }

  await browser.close();

  // Generate report
  generateMobileTestReport(results);
}

async function runMobileTestSuite(page, config) {
  const startTime = Date.now();
  
  // Navigate to dashboard
  await page.goto('http://localhost:3002/auth/login');
  
  // Performance metrics collection
  const performanceMetrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve({
          lcp: entries.find(e => e.entryType === 'largest-contentful-paint')?.startTime || 0,
          fid: entries.find(e => e.entryType === 'first-input')?.processingStart || 0,
          cls: entries.reduce((acc, e) => acc + (e.entryType === 'layout-shift' ? e.value : 0), 0)
        });
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 5000);
      } catch {
        resolve({ lcp: 0, fid: 0, cls: 0 });
      }
    });
  });

  // Test touch targets
  const touchTargetResults = await testTouchTargets(page, config);
  
  // Test navigation performance
  const navigationResults = await testNavigationPerformance(page, config);
  
  // Test crisis accessibility
  const crisisResults = await testCrisisAccessibility(page, config);
  
  // Test performance under stress
  const stressResults = await testPerformanceUnderStress(page, config);

  const totalTime = Date.now() - startTime;

  return {
    device: config.name,
    scenario: config.scenario,
    passed: touchTargetResults.passed && navigationResults.passed && crisisResults.passed && stressResults.passed,
    totalTime,
    performanceMetrics,
    touchTargets: touchTargetResults,
    navigation: navigationResults,
    crisis: crisisResults,
    stress: stressResults
  };
}

async function testTouchTargets(page, config) {
  console.log('  🎯 Testing touch targets...');
  
  const minSize = config.scenario === 'crisis' ? TOUCH_TARGET_REQUIREMENTS.crisis : TOUCH_TARGET_REQUIREMENTS.recommended;
  
  const touchTargets = await page.evaluate((minSize) => {
    const results = [];
    
    // Test dashboard cards
    const cards = document.querySelectorAll('[role="button"], button, a[href]');
    
    cards.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      const padding = parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom);
      
      const effectiveHeight = Math.max(rect.height, padding);
      const effectiveWidth = Math.max(rect.width, parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight));
      
      results.push({
        element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
        height: effectiveHeight,
        width: effectiveWidth,
        meetsRequirement: effectiveHeight >= minSize && effectiveWidth >= minSize,
        isCrisisElement: element.textContent?.includes('Crisis') || element.href?.includes('tel:')
      });
    });
    
    return results;
  }, minSize);

  const failed = touchTargets.filter(t => !t.meetsRequirement);
  const criticalFailed = failed.filter(t => t.isCrisisElement);

  return {
    passed: criticalFailed.length === 0,
    total: touchTargets.length,
    failed: failed.length,
    criticalFailed: criticalFailed.length,
    details: failed
  };
}

async function testNavigationPerformance(page, config) {
  console.log('  🧭 Testing navigation performance...');
  
  try {
    // Mock login to reach dashboard
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword');
    
    const navigationStart = Date.now();
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForSelector('[role="button"]', { timeout: 10000 });
    const navigationTime = Date.now() - navigationStart;

    // Test card navigation
    const cardNavigationTimes = [];
    
    const cards = await page.$$('[role="button"]');
    for (let i = 0; i < Math.min(cards.length, 3); i++) {
      const start = Date.now();
      await cards[i].click();
      await page.waitForTimeout(500); // Wait for navigation
      const time = Date.now() - start;
      cardNavigationTimes.push(time);
      
      // Go back
      await page.goBack();
      await page.waitForSelector('[role="button"]', { timeout: 5000 });
    }

    const avgNavigationTime = cardNavigationTimes.reduce((a, b) => a + b, 0) / cardNavigationTimes.length;

    return {
      passed: navigationTime < 3000 && avgNavigationTime < 1000,
      navigationTime,
      avgCardNavigationTime: avgNavigationTime,
      cardNavigationTimes
    };
  } catch (error) {
    return {
      passed: false,
      error: error.message
    };
  }
}

async function testCrisisAccessibility(page, config) {
  console.log('  🆘 Testing crisis accessibility...');
  
  try {
    // Test crisis button accessibility
    const crisisButtons = await page.$$('button:has-text("Crisis"), a[href^="tel:"], [aria-label*="crisis" i]');
    
    const crisisAccessibility = await Promise.all(
      crisisButtons.map(async (button) => {
        const isVisible = await button.isVisible();
        const isEnabled = await button.isEnabled();
        const ariaLabel = await button.getAttribute('aria-label');
        const tabIndex = await button.getAttribute('tabindex');
        
        return {
          visible: isVisible,
          enabled: isEnabled,
          hasAriaLabel: !!ariaLabel,
          keyboardAccessible: tabIndex !== '-1'
        };
      })
    );

    // Test crisis button positioning (should be easily reachable)
    const crisisButtonPosition = await page.evaluate(() => {
      const button = document.querySelector('button:has-text("Crisis"), a[href^="tel:"]');
      if (!button) return null;
      
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Check if button is in thumb-reachable area (bottom 60% of screen)
      const isThumbReachable = rect.bottom > viewportHeight * 0.4;
      
      return {
        isThumbReachable,
        position: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right
        }
      };
    });

    const allAccessible = crisisAccessibility.every(c => 
      c.visible && c.enabled && c.hasAriaLabel && c.keyboardAccessible
    );

    return {
      passed: allAccessible && crisisButtonPosition?.isThumbReachable,
      crisisButtonCount: crisisButtons.length,
      crisisAccessibility,
      crisisButtonPosition
    };
  } catch (error) {
    return {
      passed: false,
      error: error.message
    };
  }
}

async function testPerformanceUnderStress(page, config) {
  console.log('  ⚡ Testing performance under stress...');
  
  try {
    // Simulate rapid interactions
    const startTime = Date.now();
    
    // Rapid card taps
    const cards = await page.$$('[role="button"]');
    for (let i = 0; i < 10; i++) {
      if (cards.length > 0) {
        await cards[i % cards.length].click();
        await page.waitForTimeout(100);
      }
    }
    
    const rapidInteractionTime = Date.now() - startTime;

    // Test memory usage (basic simulation)
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        };
      }
      return null;
    });

    // Test CSS animations performance
    const animationPerformance = await page.evaluate(() => {
      const start = performance.now();
      
      // Create multiple animated elements
      const elements = [];
      for (let i = 0; i < 50; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
          position: absolute;
          width: 10px;
          height: 10px;
          background: #a4b792;
          animation: gentle-fade-in 300ms ease;
          top: ${Math.random() * 100}px;
          left: ${Math.random() * 100}px;
        `;
        document.body.appendChild(el);
        elements.push(el);
      }
      
      // Force layout
      elements.forEach(el => el.offsetHeight);
      
      const duration = performance.now() - start;
      
      // Cleanup
      elements.forEach(el => el.remove());
      
      return duration;
    });

    return {
      passed: rapidInteractionTime < 5000 && animationPerformance < 100,
      rapidInteractionTime,
      memoryUsage,
      animationPerformance
    };
  } catch (error) {
    return {
      passed: false,
      error: error.message
    };
  }
}

function generateMobileTestReport(results) {
  console.log('\n📊 MOBILE DASHBOARD CRISIS TEST REPORT');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`Overall Results: ${passed}/${total} configurations passed`);
  console.log(`Success Rate: ${Math.round((passed / total) * 100)}%\n`);

  results.forEach(result => {
    console.log(`\n${result.device} (${result.scenario}):`);
    console.log(`  Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (result.error) {
      console.log(`  Error: ${result.error}`);
      return;
    }
    
    console.log(`  Total Time: ${result.totalTime}ms`);
    
    if (result.performanceMetrics) {
      console.log(`  LCP: ${result.performanceMetrics.lcp.toFixed(2)}ms`);
      console.log(`  FID: ${result.performanceMetrics.fid.toFixed(2)}ms`);
      console.log(`  CLS: ${result.performanceMetrics.cls.toFixed(4)}`);
    }
    
    if (result.touchTargets) {
      console.log(`  Touch Targets: ${result.touchTargets.total - result.touchTargets.failed}/${result.touchTargets.total} passed`);
      if (result.touchTargets.criticalFailed > 0) {
        console.log(`    ⚠️  ${result.touchTargets.criticalFailed} critical touch targets failed`);
      }
    }
    
    if (result.navigation) {
      console.log(`  Navigation Time: ${result.navigation.navigationTime}ms`);
      console.log(`  Avg Card Navigation: ${result.navigation.avgCardNavigationTime?.toFixed(2)}ms`);
    }
    
    if (result.crisis) {
      console.log(`  Crisis Buttons: ${result.crisis.crisisButtonCount} found`);
      console.log(`  Crisis Accessibility: ${result.crisis.passed ? 'Passed' : 'Failed'}`);
    }
  });

  // Generate recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  const failedResults = results.filter(r => !r.passed);
  if (failedResults.length === 0) {
    console.log('✅ All tests passed! Dashboard is optimized for mobile crisis scenarios.');
  } else {
    failedResults.forEach(result => {
      console.log(`\n${result.device}:`);
      
      if (result.touchTargets?.criticalFailed > 0) {
        console.log('  - Increase touch target sizes for crisis elements');
      }
      
      if (result.navigation?.navigationTime > 3000) {
        console.log('  - Optimize navigation performance with better loading states');
      }
      
      if (result.stress?.animationPerformance > 100) {
        console.log('  - Reduce animation complexity for this device class');
      }
    });
  }
  
  console.log('\n🔚 Test Complete');
}

// Run tests if called directly
if (require.main === module) {
  testMobileDashboard()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testMobileDashboard };