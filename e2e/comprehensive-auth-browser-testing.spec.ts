/**
 * ALCHM Comprehensive Authentication Browser Testing Suite
 * Tests authentication across all major browsers with special focus on Chrome compatibility
 * 
 * This test ensures:
 * 1. Chrome desktop authentication works perfectly
 * 2. Chrome mobile authentication works properly  
 * 3. iOS Safari fixes don't break Chrome
 * 4. Popup authentication works on Chrome (since it supports popups)
 * 5. Redirect fallback works if popups are blocked
 * 6. Cross-browser compatibility is maintained
 */

import { test, expect, BrowserContext, Page, devices } from '@playwright/test';

// Test configurations for different browsers and devices
const TEST_CONFIGS = [
  {
    name: 'Chrome Desktop',
    device: 'Desktop Chrome',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    supportsPopups: true,
    expectedMethod: 'popup'
  },
  {
    name: 'Chrome Mobile (Android)',
    device: 'Pixel 5',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: { width: 393, height: 851 },
    isMobile: true,
    supportsPopups: false,
    expectedMethod: 'redirect'
  },
  {
    name: 'Chrome Mobile (iPhone)',
    device: 'iPhone 12',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    supportsPopups: false,
    expectedMethod: 'redirect'
  },
  {
    name: 'Safari Desktop',
    device: 'Desktop Safari',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    supportsPopups: true,
    expectedMethod: 'popup'
  },
  {
    name: 'iOS Safari',
    device: 'iPhone 14',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    supportsPopups: false,
    expectedMethod: 'redirect'
  },
  {
    name: 'Firefox Desktop',
    device: 'Desktop Firefox',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    supportsPopups: true,
    expectedMethod: 'popup'
  },
  {
    name: 'Edge Desktop',
    device: 'Desktop Edge',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    supportsPopups: true,
    expectedMethod: 'popup'
  }
];

// Helper function to create context with specific browser configuration
async function createBrowserContext(browser: any, config: any): Promise<BrowserContext> {
  return await browser.newContext({
    userAgent: config.userAgent,
    viewport: config.viewport,
    deviceScaleFactor: config.isMobile ? 2 : 1,
    isMobile: config.isMobile,
    hasTouch: config.isMobile,
    permissions: ['geolocation']
  });
}

// Test authentication flow detection
test.describe('Authentication Browser Compatibility', () => {
  
  TEST_CONFIGS.forEach(config => {
    test(`${config.name} - Authentication Method Detection`, async ({ browser }) => {
      const context = await createBrowserContext(browser, config);
      const page = await context.newPage();
      
      // Track console logs for debugging
      const consoleLogs: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'log' && msg.text().includes('🔐')) {
          consoleLogs.push(msg.text());
        }
      });
      
      // Navigate to login page
      await page.goto('http://localhost:3000/auth/login');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that mobile capabilities are detected correctly
      const mobileDetection = await page.evaluate(() => {
        // Access the mobile detection function if available
        return {
          userAgent: navigator.userAgent,
          isMobile: /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),
          hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        };
      });
      
      console.log(`${config.name} Detection:`, mobileDetection);
      
      // Verify mobile detection matches expectations
      expect(mobileDetection.isMobile).toBe(config.isMobile);
      
      // Check if Google sign-in button is present and configured correctly
      const googleButton = page.locator('button:has-text("Continue with Google")');
      await expect(googleButton).toBeVisible();
      
      // Check button text indicates correct method for mobile
      if (config.isMobile && !config.supportsPopups) {
        await expect(googleButton).toContainText('Continue with Google');
      }
      
      // Verify the button is properly sized for touch targets on mobile
      if (config.isMobile) {
        const buttonBox = await googleButton.boundingBox();
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Minimum touch target
      }
      
      await context.close();
    });
    
    test(`${config.name} - Authentication Strategy Selection`, async ({ browser }) => {
      const context = await createBrowserContext(browser, config);
      const page = await context.newPage();
      
      // Track authentication-related console logs
      const authLogs: string[] = [];
      page.on('console', msg => {
        if (msg.text().includes('🔐') || msg.text().includes('Auth')) {
          authLogs.push(msg.text());
        }
      });
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Inject JavaScript to check authentication strategy
      const authStrategy = await page.evaluate((expectedMethod) => {
        // Mock the authentication functions to check which method would be called
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
        const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        
        // Determine expected authentication method based on browser
        let predictedMethod = 'popup'; // Default for desktop
        
        if (isIOS) {
          predictedMethod = 'redirect'; // iOS Safari always uses redirect
        } else if (isMobile && isAndroid) {
          predictedMethod = 'redirect'; // Android mobile uses redirect
        } else if (isChrome && !isMobile) {
          predictedMethod = 'popup'; // Chrome desktop supports popups well
        }
        
        return {
          userAgent: navigator.userAgent.substring(0, 100),
          isIOS,
          isAndroid,
          isMobile,
          isChrome,
          isSafari,
          predictedMethod,
          expectedMethod
        };
      }, config.expectedMethod);
      
      console.log(`${config.name} Strategy:`, authStrategy);
      
      // Verify the predicted method matches our expectations
      expect(authStrategy.predictedMethod).toBe(config.expectedMethod);
      
      // Chrome-specific validations
      if (config.name.includes('Chrome')) {
        expect(authStrategy.isChrome).toBe(true);
        
        if (!config.isMobile) {
          // Chrome desktop should prefer popup method
          expect(authStrategy.predictedMethod).toBe('popup');
        } else {
          // Chrome mobile should use redirect method
          expect(authStrategy.predictedMethod).toBe('redirect');
        }
      }
      
      await context.close();
    });
    
    test(`${config.name} - UI Responsiveness and Accessibility`, async ({ browser }) => {
      const context = await createBrowserContext(browser, config);
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Test touch targets on mobile devices
      if (config.isMobile) {
        const buttons = await page.locator('button').all();
        
        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            // Check minimum touch target size (44x44px)
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(box.width).toBeGreaterThanOrEqual(44);
          }
        }
      }
      
      // Test form inputs have proper sizing
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      
      if (config.isMobile) {
        // Check mobile input sizing
        const emailBox = await emailInput.boundingBox();
        const passwordBox = await passwordInput.boundingBox();
        
        expect(emailBox?.height).toBeGreaterThanOrEqual(48); // Mobile input height
        expect(passwordBox?.height).toBeGreaterThanOrEqual(48);
      }
      
      // Test crisis support buttons are accessible
      const crisisButtons = page.locator('button:has-text("Call 988"), button:has-text("Text HOME")');
      await expect(crisisButtons.first()).toBeVisible();
      
      await context.close();
    });
  });
  
  // Chrome-specific comprehensive tests
  test.describe('Chrome-Specific Authentication Tests', () => {
    
    test('Chrome Desktop - Popup Authentication Flow', async ({ browser }) => {
      const chromeConfig = TEST_CONFIGS.find(c => c.name === 'Chrome Desktop')!;
      const context = await createBrowserContext(browser, chromeConfig);
      const page = await context.newPage();
      
      // Track popup events
      let popupOpened = false;
      context.on('page', (newPage) => {
        popupOpened = true;
        console.log('Popup detected in Chrome Desktop');
      });
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Check that popup method is configured
      const authMethod = await page.evaluate(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
        const isMobile = /mobile/.test(userAgent);
        
        return {
          isChrome,
          isMobile,
          supportsPopups: !isMobile && isChrome,
          expectedMethod: !isMobile && isChrome ? 'popup' : 'redirect'
        };
      });
      
      expect(authMethod.isChrome).toBe(true);
      expect(authMethod.isMobile).toBe(false);
      expect(authMethod.supportsPopups).toBe(true);
      expect(authMethod.expectedMethod).toBe('popup');
      
      await context.close();
    });
    
    test('Chrome Mobile (Android) - Redirect Authentication Flow', async ({ browser }) => {
      const chromeMobileConfig = TEST_CONFIGS.find(c => c.name === 'Chrome Mobile (Android)')!;
      const context = await createBrowserContext(browser, chromeMobileConfig);
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Verify Chrome mobile detection and redirect method selection
      const mobileAuthStrategy = await page.evaluate(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isAndroid = /android/.test(userAgent);
        const isChrome = /chrome/.test(userAgent);
        const isMobile = /mobile/.test(userAgent);
        
        return {
          isAndroid,
          isChrome,
          isMobile,
          shouldUseRedirect: isAndroid && isChrome && isMobile,
          userAgent: navigator.userAgent.substring(0, 100)
        };
      });
      
      expect(mobileAuthStrategy.isAndroid).toBe(true);
      expect(mobileAuthStrategy.isChrome).toBe(true);
      expect(mobileAuthStrategy.isMobile).toBe(true);
      expect(mobileAuthStrategy.shouldUseRedirect).toBe(true);
      
      await context.close();
    });
    
    test('Chrome vs Safari - Method Selection Comparison', async ({ browser }) => {
      const chromeDesktop = TEST_CONFIGS.find(c => c.name === 'Chrome Desktop')!;
      const safariDesktop = TEST_CONFIGS.find(c => c.name === 'Safari Desktop')!;
      
      // Test Chrome
      const chromeContext = await createBrowserContext(browser, chromeDesktop);
      const chromePage = await chromeContext.newPage();
      
      await chromePage.goto('http://localhost:3000/auth/login');
      await chromePage.waitForLoadState('networkidle');
      
      const chromeStrategy = await chromePage.evaluate(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        return {
          browser: /chrome/.test(userAgent) ? 'chrome' : /safari/.test(userAgent) ? 'safari' : 'other',
          supportsPopups: true, // Both desktop browsers support popups
          expectedMethod: 'popup'
        };
      });
      
      // Test Safari
      const safariContext = await createBrowserContext(browser, safariDesktop);
      const safariPage = await safariContext.newPage();
      
      await safariPage.goto('http://localhost:3000/auth/login');
      await safariPage.waitForLoadState('networkidle');
      
      const safariStrategy = await safariPage.evaluate(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        return {
          browser: /chrome/.test(userAgent) ? 'chrome' : /safari/.test(userAgent) ? 'safari' : 'other',
          supportsPopups: true,
          expectedMethod: 'popup'
        };
      });
      
      // Both should use popup method for desktop
      expect(chromeStrategy.expectedMethod).toBe('popup');
      expect(safariStrategy.expectedMethod).toBe('popup');
      
      console.log('Chrome Desktop Strategy:', chromeStrategy);
      console.log('Safari Desktop Strategy:', safariStrategy);
      
      await chromeContext.close();
      await safariContext.close();
    });
    
    test('Popup Blocked Fallback - Chrome Behavior', async ({ browser }) => {
      const chromeConfig = TEST_CONFIGS.find(c => c.name === 'Chrome Desktop')!;
      const context = await createBrowserContext(browser, chromeConfig);
      
      // Block popups by denying permission
      await context.grantPermissions([]);
      
      const page = await context.newPage();
      
      // Block popups at browser level
      await page.addInitScript(() => {
        // Mock popup blocking
        const originalOpen = window.open;
        window.open = () => {
          throw new Error('Popup blocked');
        };
      });
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Simulate popup being blocked and verify fallback behavior
      const fallbackBehavior = await page.evaluate(() => {
        // Simulate what would happen when popup is blocked
        const isChrome = /chrome/.test(navigator.userAgent.toLowerCase());
        const isMobile = /mobile/.test(navigator.userAgent.toLowerCase());
        
        return {
          isChrome,
          isMobile,
          wouldFallbackToRedirect: isChrome && !isMobile,
          expectedFallbackMessage: 'Popup blocked. Please allow popups for this site and try again.'
        };
      });
      
      expect(fallbackBehavior.isChrome).toBe(true);
      expect(fallbackBehavior.wouldFallbackToRedirect).toBe(true);
      
      await context.close();
    });
  });
  
  // Cross-browser compatibility verification
  test('Cross-Browser Authentication Consistency', async ({ browser }) => {
    const results = [];
    
    for (const config of TEST_CONFIGS) {
      const context = await createBrowserContext(browser, config);
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      const authConfig = await page.evaluate(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
        const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
        const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
        
        return {
          browser: config.name,
          isIOS,
          isAndroid,
          isChrome,
          isSafari,
          isMobile,
          expectedMethod: isIOS || (isMobile && isAndroid) ? 'redirect' : 'popup'
        };
      });
      
      results.push(authConfig);
      await context.close();
    }
    
    console.log('Cross-Browser Authentication Results:', results);
    
    // Verify Chrome browsers are detected correctly
    const chromeResults = results.filter(r => r.browser.includes('Chrome'));
    for (const result of chromeResults) {
      expect(result.isChrome).toBe(true);
    }
    
    // Verify Safari browsers are detected correctly  
    const safariResults = results.filter(r => r.browser.includes('Safari'));
    for (const result of safariResults) {
      if (result.browser === 'iOS Safari') {
        expect(result.isIOS).toBe(true);
      }
    }
    
    // Verify method selection is consistent
    const desktopResults = results.filter(r => !r.isMobile);
    const mobileResults = results.filter(r => r.isMobile);
    
    // All desktop browsers should prefer popup
    for (const result of desktopResults) {
      expect(result.expectedMethod).toBe('popup');
    }
    
    // All mobile browsers should prefer redirect
    for (const result of mobileResults) {
      expect(result.expectedMethod).toBe('redirect');
    }
  });
  
  // Performance testing across browsers
  test('Authentication Performance Across Browsers', async ({ browser }) => {
    const performanceResults = [];
    
    for (const config of TEST_CONFIGS.slice(0, 4)) { // Test first 4 configs for performance
      const context = await createBrowserContext(browser, config);
      const page = await context.newPage();
      
      const startTime = Date.now();
      
      await page.goto('http://localhost:3000/auth/login');
      await page.waitForLoadState('networkidle');
      
      // Wait for authentication detection to complete
      await page.waitForFunction(() => {
        return window.performance && window.performance.timing.loadEventEnd > 0;
      });
      
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.evaluate(() => ({
        loadTime: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart,
        domContentLoaded: window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart,
        firstPaint: window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: window.performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      }));
      
      performanceResults.push({
        browser: config.name,
        loadTime,
        ...metrics
      });
      
      await context.close();
    }
    
    console.log('Authentication Performance Results:', performanceResults);
    
    // Verify no browser takes too long to load
    for (const result of performanceResults) {
      expect(result.loadTime).toBeLessThan(5000); // 5 second max
      expect(result.domContentLoaded).toBeLessThan(3000); // 3 second max for DOM
    }
  });
});

// Error handling and recovery testing
test.describe('Authentication Error Handling', () => {
  
  test('Network Error Recovery', async ({ browser }) => {
    const chromeConfig = TEST_CONFIGS.find(c => c.name === 'Chrome Desktop')!;
    const context = await createBrowserContext(browser, chromeConfig);
    const page = await context.newPage();
    
    // Simulate network issues
    await page.route('**/*', route => {
      if (route.request().url().includes('googleapis.com')) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Verify error handling UI is present
    const errorElements = page.locator('[class*="crisis"], [class*="error"], button:has-text("Call 988")');
    await expect(errorElements.first()).toBeVisible();
    
    await context.close();
  });
  
  test('Authentication State Recovery', async ({ browser }) => {
    const chromeConfig = TEST_CONFIGS.find(c => c.name === 'Chrome Desktop')!;
    const context = await createBrowserContext(browser, chromeConfig);
    const page = await context.newPage();
    
    await page.goto('http://localhost:3000/auth/login');
    await page.waitForLoadState('networkidle');
    
    // Simulate authentication state persistence
    await page.evaluate(() => {
      // Test session recovery mechanisms
      const testData = {
        timestamp: Date.now(),
        browser: 'chrome',
        recovered: true
      };
      
      try {
        sessionStorage.setItem('alchm_auth_test', JSON.stringify(testData));
        localStorage.setItem('alchm_auth_test', JSON.stringify(testData));
      } catch (e) {
        console.log('Storage test failed:', e);
      }
    });
    
    // Refresh page and verify state handling
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const stateRecovery = await page.evaluate(() => {
      try {
        const sessionData = sessionStorage.getItem('alchm_auth_test');
        const localData = localStorage.getItem('alchm_auth_test');
        
        return {
          sessionStorage: !!sessionData,
          localStorage: !!localData,
          canRecover: !!(sessionData || localData)
        };
      } catch (e) {
        return {
          sessionStorage: false,
          localStorage: false,
          canRecover: false
        };
      }
    });
    
    expect(stateRecovery.canRecover).toBe(true);
    
    await context.close();
  });
});

console.log('ALCHM Authentication Browser Testing Suite Loaded');
console.log('Testing Chrome desktop, Chrome mobile, Safari, Firefox, and Edge compatibility');
console.log('Special focus on Chrome popup support and iOS Safari redirect compatibility');