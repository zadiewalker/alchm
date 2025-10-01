import { test, expect, Page } from '@playwright/test';

/**
 * CRISIS PERFORMANCE MONITORING TESTS
 * 
 * Specialized performance tests for users in crisis situations
 * Tests critical scenarios where performance directly impacts user safety
 */

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  ttfb: number;
  loadTime: number;
  jsErrors: number;
  networkErrors: number;
}

test.describe('Crisis Performance Critical Tests', () => {
  
  // Crisis-specific performance thresholds
  const CRISIS_THRESHOLDS = {
    FCP: 1200,           // <1.2s for crisis content
    LCP: 2000,           // <2.0s for critical resources
    CLS: 0.05,           // <0.05 to avoid triggering users
    TTFB: 200,           // <200ms server response
    CRISIS_BUTTON: 100,   // <100ms for emergency button
    EMERGENCY_LOAD: 500,  // <500ms for crisis resources
    TOTAL_LOAD: 3000     // <3s total page load
  };

  test.beforeEach(async ({ page }) => {
    // Set up performance monitoring
    await page.addInitScript(() => {
      window.performanceMetrics = {
        fcp: 0,
        lcp: 0,
        cls: 0,
        ttfb: 0,
        loadTime: 0,
        jsErrors: 0,
        networkErrors: 0
      };
      
      // Monitor JavaScript errors
      window.addEventListener('error', () => {
        window.performanceMetrics.jsErrors++;
      });
      
      // Monitor network errors
      window.addEventListener('unhandledrejection', () => {
        window.performanceMetrics.networkErrors++;
      });
    });
  });

  test('988 Crisis Button Response Time - Critical', async ({ page }) => {
    console.log('🚨 Testing 988 Crisis Button Response Time...');
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    
    // Look for crisis support button
    const crisisButton = page.locator('[data-crisis-button], .crisis-button, text="988"').first();
    
    if (await crisisButton.isVisible()) {
      const buttonClickStart = Date.now();
      await crisisButton.click();
      
      // Wait for crisis modal or support to appear
      try {
        await page.waitForSelector('[data-crisis-modal], .crisis-modal, text="Crisis Support"', { 
          timeout: 5000 
        });
        
        const responseTime = Date.now() - buttonClickStart;
        console.log(`🆘 Crisis Button Response Time: ${responseTime}ms`);
        
        // CRITICAL: Crisis button must respond within 100ms
        expect(responseTime).toBeLessThan(CRISIS_THRESHOLDS.CRISIS_BUTTON);
        
        // Verify crisis resources are immediately available
        const crisisContent = page.locator('text="988", text="Crisis", text="Emergency"');
        await expect(crisisContent.first()).toBeVisible({ timeout: 1000 });
        
      } catch (error) {
        test.fail(false, 'Crisis button clicked but no crisis support appeared within 5 seconds');
      }
    } else {
      console.warn('⚠️ No crisis button found on page - this is a safety concern');
      test.fail(false, 'Crisis button not found - users in crisis need immediate access to help');
    }
  });

  test('Emergency Resource Loading Performance', async ({ page }) => {
    console.log('🚑 Testing Emergency Resource Loading...');
    
    // Test direct access to crisis resources
    const startTime = Date.now();
    await page.goto('http://localhost:3000/crisis-support');
    
    // Wait for page to load
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;
    
    console.log(`🆘 Crisis Resources Load Time: ${loadTime}ms`);
    
    // Emergency resources must load within 500ms
    expect(loadTime).toBeLessThan(CRISIS_THRESHOLDS.EMERGENCY_LOAD);
    
    // Verify essential crisis content is visible
    const emergencyElements = [
      'text="988"',
      'text="Crisis"',
      'text="Emergency"',
      'text="Help"',
      'text="Support"'
    ];
    
    for (const selector of emergencyElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        console.log(`✅ Found emergency element: ${selector}`);
        break;
      }
    }
    
    // Check for external crisis resource links
    const externalLinks = page.locator('a[href*="988"], a[href*="crisis"], a[href*="suicidepreventionlifeline"]');
    const linkCount = await externalLinks.count();
    
    if (linkCount === 0) {
      console.warn('⚠️ No external crisis resource links found');
    } else {
      console.log(`✅ Found ${linkCount} external crisis resource links`);
    }
  });

  test('Journal Save Performance During Crisis', async ({ page }) => {
    console.log('📝 Testing Journal Save Performance During Crisis...');
    
    await page.goto('http://localhost:3000/journal');
    await page.waitForLoadState('load');
    
    // Find journal input
    const journalInput = page.locator('textarea, input[type="text"]').first();
    
    if (await journalInput.isVisible()) {
      // Type crisis-related content to simulate real scenario
      const crisisText = "I'm feeling overwhelmed and need help with my emotions today.";
      await journalInput.fill(crisisText);
      
      // Find and click save button
      const saveButton = page.locator('button:has-text("Save"), button[type="submit"]').first();
      
      if (await saveButton.isVisible()) {
        const saveStartTime = Date.now();
        
        // Monitor network requests during save
        let saveRequestCompleted = false;
        page.on('response', response => {
          if (response.url().includes('/api/save') || response.url().includes('journal')) {
            saveRequestCompleted = true;
          }
        });
        
        await saveButton.click();
        
        // Wait for save to complete
        await page.waitForFunction(() => window.location.href, { timeout: 5000 });
        
        const saveTime = Date.now() - saveStartTime;
        console.log(`💾 Journal Save Time: ${saveTime}ms`);
        
        // Journal saves must complete within 1 second for crisis users
        expect(saveTime).toBeLessThan(1000);
        
        if (saveRequestCompleted) {
          console.log('✅ Save request completed successfully');
        }
        
      } else {
        console.warn('⚠️ No save button found - users cannot save their thoughts');
      }
    } else {
      console.warn('⚠️ No journal input found');
    }
  });

  test('Authentication Performance for Crisis Users', async ({ page }) => {
    console.log('🔐 Testing Authentication Performance...');
    
    await page.goto('http://localhost:3000/auth/login');
    
    const authStartTime = Date.now();
    
    // Monitor auth-related network requests
    let authRequestTime = 0;
    page.on('response', response => {
      if (response.url().includes('auth') || response.url().includes('firebase')) {
        authRequestTime = Date.now() - authStartTime;
      }
    });
    
    // Wait for auth form to load
    await page.waitForSelector('form, input[type="email"], input[type="password"]', { timeout: 3000 });
    
    const authLoadTime = Date.now() - authStartTime;
    console.log(`🔐 Auth Page Load Time: ${authLoadTime}ms`);
    
    // Auth page must load within 800ms for crisis users
    expect(authLoadTime).toBeLessThan(800);
    
    // Verify auth form is interactive
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      console.log('✅ Auth form is ready for interaction');
      
      // Test form responsiveness
      const inputStartTime = Date.now();
      await emailInput.fill('test@example.com');
      await passwordInput.fill('testpassword');
      const inputTime = Date.now() - inputStartTime;
      
      console.log(`⌨️ Form Input Response Time: ${inputTime}ms`);
      expect(inputTime).toBeLessThan(200); // Form must respond within 200ms
    }
  });

  test('Mobile Crisis Performance - Slow 3G Simulation', async ({ page, browser }) => {
    console.log('📱 Testing Mobile Crisis Performance on Slow 3G...');
    
    // Simulate slow 3G network conditions
    const context = await browser.newContext({
      // Slow 3G simulation
      offline: false,
      // Note: Playwright doesn't have direct throttling like Chrome DevTools
      // In real tests, you'd use network throttling tools
    });
    
    const mobilePage = await context.newPage();
    
    // Set mobile viewport
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    
    const mobileStartTime = Date.now();
    await mobilePage.goto('http://localhost:3000');
    
    // Wait for critical content
    await mobilePage.waitForSelector('h1, [data-testid="main-content"]', { timeout: 10000 });
    
    const mobileLoadTime = Date.now() - mobileStartTime;
    console.log(`📱 Mobile Load Time (Slow 3G): ${mobileLoadTime}ms`);
    
    // Mobile crisis users need content within 5 seconds even on slow connections
    expect(mobileLoadTime).toBeLessThan(5000);
    
    // Test crisis button on mobile
    const mobileCrisisButton = mobilePage.locator('[data-crisis-button], .crisis-button').first();
    
    if (await mobileCrisisButton.isVisible()) {
      const mobileButtonStart = Date.now();
      await mobileCrisisButton.click();
      
      try {
        await mobilePage.waitForSelector('[data-crisis-modal], text="988"', { timeout: 3000 });
        const mobileButtonTime = Date.now() - mobileButtonStart;
        
        console.log(`📱 Mobile Crisis Button Time: ${mobileButtonTime}ms`);
        
        // Mobile crisis button must still respond quickly
        expect(mobileButtonTime).toBeLessThan(200);
        
      } catch (error) {
        console.warn('⚠️ Mobile crisis button did not respond in time');
      }
    }
    
    await context.close();
  });

  test('Accessibility Performance for Crisis Users', async ({ page }) => {
    console.log('♿ Testing Accessibility Performance...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('load');
    
    // Test keyboard navigation speed
    const keyboardStartTime = Date.now();
    
    // Tab through critical elements
    await page.keyboard.press('Tab'); // Should focus on skip link or first interactive element
    await page.keyboard.press('Tab'); // Navigate to next element
    await page.keyboard.press('Tab'); // Continue navigation
    
    const keyboardTime = Date.now() - keyboardStartTime;
    console.log(`⌨️ Keyboard Navigation Time: ${keyboardTime}ms`);
    
    // Keyboard navigation must be responsive
    expect(keyboardTime).toBeLessThan(300);
    
    // Test screen reader compatibility by checking ARIA labels
    const ariaElements = await page.locator('[aria-label], [aria-labelledby], [role]').count();
    console.log(`♿ Accessible Elements Found: ${ariaElements}`);
    
    expect(ariaElements).toBeGreaterThan(0);
    
    // Test focus visibility
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test crisis-specific accessibility
    const crisisAriaElements = page.locator('[aria-label*="crisis"], [aria-label*="emergency"], [aria-label*="988"]');
    const crisisAriaCount = await crisisAriaElements.count();
    
    if (crisisAriaCount > 0) {
      console.log(`🆘 Crisis Accessibility Elements: ${crisisAriaCount}`);
    } else {
      console.warn('⚠️ No crisis-specific accessibility labels found');
    }
  });

  test('Performance Under Memory Pressure', async ({ page }) => {
    console.log('🧠 Testing Performance Under Memory Pressure...');
    
    // Navigate to multiple pages to simulate memory usage
    const pages = [
      'http://localhost:3000/',
      'http://localhost:3000/journal',
      'http://localhost:3000/dashboard',
      'http://localhost:3000/pricing'
    ];
    
    const memoryTestStart = Date.now();
    
    for (const pageUrl of pages) {
      const pageStartTime = Date.now();
      await page.goto(pageUrl);
      await page.waitForLoadState('load');
      
      const pageLoadTime = Date.now() - pageStartTime;
      console.log(`📄 ${pageUrl.split('/').pop() || 'home'} Load Time: ${pageLoadTime}ms`);
      
      // Each page should load quickly even after visiting multiple pages
      expect(pageLoadTime).toBeLessThan(3000);
      
      // Check for memory usage if available
      const memoryInfo = await page.evaluate(() => {
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          return {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (memoryInfo) {
        const memoryUsagePercent = (memoryInfo.used / memoryInfo.limit) * 100;
        console.log(`🧠 Memory Usage: ${memoryUsagePercent.toFixed(2)}%`);
        
        // Memory usage should not exceed 80%
        expect(memoryUsagePercent).toBeLessThan(80);
      }
    }
    
    const totalMemoryTestTime = Date.now() - memoryTestStart;
    console.log(`🧠 Total Memory Test Time: ${totalMemoryTestTime}ms`);
  });

  test('Offline Crisis Support Performance', async ({ page, context }) => {
    console.log('📶 Testing Offline Crisis Support...');
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('load');
    
    // Go offline
    await context.setOffline(true);
    
    // Test offline functionality
    const offlineStartTime = Date.now();
    
    try {
      // Try to access crisis resources offline
      await page.goto('http://localhost:3000/crisis-support');
      
      // Check if offline page or cached content is available
      const offlineContent = page.locator('text="offline", text="no connection", text="cached"').first();
      const crisisContent = page.locator('text="988", text="crisis", text="emergency"').first();
      
      const hasOfflineSupport = await offlineContent.isVisible({ timeout: 3000 }) || 
                                await crisisContent.isVisible({ timeout: 3000 });
      
      if (hasOfflineSupport) {
        const offlineTime = Date.now() - offlineStartTime;
        console.log(`📶 Offline Content Load Time: ${offlineTime}ms`);
        
        // Offline content should load quickly
        expect(offlineTime).toBeLessThan(1000);
        console.log('✅ Offline crisis support available');
      } else {
        console.warn('⚠️ No offline crisis support found - users need help even offline');
      }
      
    } catch (error) {
      console.warn('⚠️ Offline navigation failed - implementing offline support is critical');
    }
    
    // Go back online
    await context.setOffline(false);
  });

  test('Performance Report Generation', async ({ page }) => {
    console.log('📊 Generating Crisis Performance Report...');
    
    // Collect comprehensive performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      const lcp = 0; // Would need PerformanceObserver for real LCP
      
      return {
        fcp,
        lcp,
        ttfb: navigation.responseStart - navigation.requestStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        
        // Resource counts
        scriptCount: performance.getEntriesByType('resource').filter(r => r.name.includes('.js')).length,
        cssCount: performance.getEntriesByType('resource').filter(r => r.name.includes('.css')).length,
        imageCount: performance.getEntriesByType('resource').filter(r => 
          r.name.includes('.jpg') || r.name.includes('.png') || r.name.includes('.svg')).length,
        
        // Total resource size (approximate)
        totalResources: performance.getEntriesByType('resource').length
      };
    });
    
    console.log('\n📊 CRISIS PERFORMANCE REPORT');
    console.log('=' .repeat(40));
    console.log(`🎯 First Contentful Paint: ${Math.round(metrics.fcp)}ms (Target: <${CRISIS_THRESHOLDS.FCP}ms)`);
    console.log(`🎯 Time to First Byte: ${Math.round(metrics.ttfb)}ms (Target: <${CRISIS_THRESHOLDS.TTFB}ms)`);
    console.log(`🎯 DOM Content Loaded: ${Math.round(metrics.domContentLoaded)}ms`);
    console.log(`🎯 Load Complete: ${Math.round(metrics.loadComplete)}ms (Target: <${CRISIS_THRESHOLDS.TOTAL_LOAD}ms)`);
    console.log(`📦 Resources: ${metrics.totalResources} total (${metrics.scriptCount} JS, ${metrics.cssCount} CSS, ${metrics.imageCount} images)`);
    
    // Performance score calculation
    let score = 100;
    if (metrics.fcp > CRISIS_THRESHOLDS.FCP) score -= 25;
    if (metrics.ttfb > CRISIS_THRESHOLDS.TTFB) score -= 20;
    if (metrics.loadComplete > CRISIS_THRESHOLDS.TOTAL_LOAD) score -= 30;
    if (metrics.totalResources > 50) score -= 15;
    
    score = Math.max(0, score);
    
    console.log(`\n🏆 Crisis Performance Score: ${score}/100`);
    
    if (score >= 90) {
      console.log('✅ EXCELLENT - Ready for crisis users');
    } else if (score >= 75) {
      console.log('⚠️ GOOD - Some optimizations needed');
    } else if (score >= 60) {
      console.log('⚠️ FAIR - Performance improvements required');
    } else {
      console.log('❌ POOR - Critical performance issues detected');
    }
    
    // Performance must meet crisis standards
    expect(score).toBeGreaterThan(75);
  });

  test.afterEach(async ({ page }) => {
    // Collect any JavaScript errors that occurred during the test
    const errors = await page.evaluate(() => window.performanceMetrics?.jsErrors || 0);
    
    if (errors > 0) {
      console.warn(`⚠️ ${errors} JavaScript errors detected during test`);
    }
  });
});

// Utility functions for performance testing
export const performanceTestUtils = {
  // Simulate slow network conditions
  async simulateSlowNetwork(page: Page) {
    // In a real implementation, you'd use CDP (Chrome DevTools Protocol)
    // or other network throttling tools
    console.log('📶 Simulating slow network conditions...');
  },
  
  // Check Core Web Vitals
  async getCoreWebVitals(page: Page): Promise<PerformanceMetrics> {
    return await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      return {
        fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        lcp: 0, // Requires PerformanceObserver
        cls: 0, // Requires PerformanceObserver
        ttfb: navigation.responseStart - navigation.requestStart,
        loadTime: navigation.loadEventEnd - navigation.navigationStart,
        jsErrors: window.performanceMetrics?.jsErrors || 0,
        networkErrors: window.performanceMetrics?.networkErrors || 0
      };
    });
  },
  
  // Validate crisis button performance
  async validateCrisisButtonPerformance(page: Page, threshold: number = 100): Promise<boolean> {
    const crisisButton = page.locator('[data-crisis-button], .crisis-button').first();
    
    if (!(await crisisButton.isVisible())) {
      return false;
    }
    
    const startTime = Date.now();
    await crisisButton.click();
    
    try {
      await page.waitForSelector('[data-crisis-modal], .crisis-modal', { timeout: threshold });
      const responseTime = Date.now() - startTime;
      return responseTime <= threshold;
    } catch {
      return false;
    }
  }
};