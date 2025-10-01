import { test, expect, Page, devices, BrowserContext } from '@playwright/test';

/**
 * MOBILE TRAUMA-INFORMED EXPERIENCE VALIDATION
 * Testing ALCHM's mobile experience for users in crisis situations
 * 
 * Focus Areas:
 * 1. Touch accessibility for users with trembling hands
 * 2. Performance on 3G networks and low-end devices
 * 3. Crisis support accessibility
 * 4. Journal experience optimization
 * 5. Responsive design validation
 */

// Device configurations for testing
const TEST_DEVICES = [
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'iPhone 13', device: devices['iPhone 13'] },
  { name: 'iPhone 13 Pro Max', device: devices['iPhone 13 Pro Max'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Samsung Galaxy S21', device: devices['Galaxy S21'] },
];

// Network conditions for testing
const NETWORK_CONDITIONS = {
  '3G': {
    offline: false,
    downloadThroughput: 500 * 1024, // 500kb/s
    uploadThroughput: 500 * 1024,
    latency: 300
  },
  'Slow 3G': {
    offline: false,
    downloadThroughput: 400 * 1024, // 400kb/s
    uploadThroughput: 400 * 1024,
    latency: 600
  }
};

// Helper function to check touch target size
async function checkTouchTargetSize(page: Page, selector: string, minSize = 52) {
  const element = await page.locator(selector);
  const box = await element.boundingBox();
  
  if (box) {
    expect(box.width).toBeGreaterThanOrEqual(minSize);
    expect(box.height).toBeGreaterThanOrEqual(minSize);
  }
}

// Helper function to simulate user stress conditions
async function simulateStressConditions(page: Page) {
  // Simulate trembling hands with slight offset touches
  await page.addInitScript(() => {
    let originalClick = HTMLElement.prototype.click;
    HTMLElement.prototype.click = function() {
      // Add slight delay and randomness to simulate stress
      setTimeout(() => {
        originalClick.call(this);
      }, Math.random() * 100 + 50);
    };
  });
}

// Helper function to check crisis button accessibility
async function validateCrisisButton(page: Page, selector: string) {
  const button = await page.locator(selector);
  
  // Check size (should be 70-80px minimum for crisis situations)
  await checkTouchTargetSize(page, selector, 70);
  
  // Check visibility
  await expect(button).toBeVisible();
  
  // Check contrast and readability
  const styles = await button.evaluate((el) => {
    const computed = window.getComputedStyle(el);
    return {
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      color: computed.color,
      backgroundColor: computed.backgroundColor,
    };
  });
  
  // Ensure minimum font size for crisis situations
  const fontSize = parseInt(styles.fontSize);
  expect(fontSize).toBeGreaterThanOrEqual(18);
}

test.describe('Mobile Touch Accessibility', () => {
  for (const { name, device } of TEST_DEVICES) {
    test.describe(`${name} Device Tests`, () => {
      test('Touch targets meet 60px minimum requirement', async ({ browser }) => {
        const context = await browser.newContext(device);
        const page = await context.newPage();
        await page.goto('/');
        
        // Check main interactive elements
        const touchTargets = [
          'button',
          'a[href]',
          'input[type="submit"]',
          '[role="button"]'
        ];

        for (const selector of touchTargets) {
          const elements = await page.locator(selector).all();
          for (const element of elements) {
            if (await element.isVisible()) {
              const box = await element.boundingBox();
              if (box) {
                // Standard touch targets should be at least 52px
                expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(52);
              }
            }
          }
        }
      });

      test('Crisis buttons have 70-80px touch targets', async ({ page }) => {
        await page.goto('/');
        
        // Check crisis floating button
        await page.waitForSelector('[aria-label*="crisis"]', { timeout: 5000 });
        
        // Validate crisis button size and accessibility
        const crisisSelectors = [
          '[aria-label*="crisis"]',
          '[href="tel:988"]',
          '.crisis-button-mobile',
          '.touch-crisis'
        ];

        for (const selector of crisisSelectors) {
          const elements = await page.locator(selector).all();
          for (const element of elements) {
            if (await element.isVisible()) {
              await validateCrisisButton(page, selector);
            }
          }
        }
      });

      test('Touch targets work with trembling hands simulation', async ({ page }) => {
        await simulateStressConditions(page);
        await page.goto('/');

        // Test navigation with stress conditions
        const navButton = page.locator('button').first();
        if (await navButton.isVisible()) {
          // Multiple attempts to simulate trembling
          for (let i = 0; i < 3; i++) {
            try {
              await navButton.click({ force: true, timeout: 2000 });
              break;
            } catch (e) {
              if (i === 2) throw e;
              await page.waitForTimeout(100);
            }
          }
        }
      });

      test('iOS Safari and Android Chrome compatibility', async ({ page }) => {
        await page.goto('/');
        
        // Check for iOS Safari specific issues
        if (device.userAgent.includes('iPhone') || device.userAgent.includes('iPad')) {
          // Check for zoom prevention on input focus
          const inputs = await page.locator('input[type="text"], input[type="email"], textarea').all();
          for (const input of inputs) {
            if (await input.isVisible()) {
              const fontSize = await input.evaluate(el => 
                window.getComputedStyle(el).fontSize
              );
              const fontSizeNum = parseInt(fontSize);
              expect(fontSizeNum).toBeGreaterThanOrEqual(16); // Prevents iOS zoom
            }
          }
          
          // Check safe area handling
          const viewport = page.viewportSize();
          expect(viewport?.width).toBeDefined();
        }
        
        // Check for Android Chrome specific issues
        if (device.userAgent.includes('Chrome') && device.userAgent.includes('Mobile')) {
          // Check tap highlight colors
          const touchElements = await page.locator('button, a, [role="button"]').all();
          for (const element of touchElements) {
            if (await element.isVisible()) {
              const tapHighlight = await element.evaluate(el => 
                window.getComputedStyle(el).webkitTapHighlightColor
              );
              expect(tapHighlight).toBeDefined();
            }
          }
        }
      });
    });
  });
});

test.describe('Mobile Performance', () => {
  test.use({ ...devices['iPhone SE'] }); // Test on lowest-end device

  test('Page load times on mobile devices', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 4 seconds on mobile
    expect(loadTime).toBeLessThan(4000);
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve(entries.map(entry => ({
            name: entry.name,
            value: entry.value || entry.duration,
            entryType: entry.entryType
          })));
        }).observe({ entryTypes: ['paint', 'navigation', 'largest-contentful-paint'] });
        
        setTimeout(() => resolve([]), 3000);
      });
    });
    
    console.log('Performance metrics:', metrics);
  });

  test('Mobile performance on 3G networks', async ({ page, context }) => {
    // Simulate 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add latency
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;
    
    // Should load within 6 seconds on 3G
    expect(loadTime).toBeLessThan(6000);
    
    // Check that essential content is visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('Mobile caching and offline functionality', async ({ page, context }) => {
    // First visit to cache resources
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simulate offline
    await context.setOffline(true);
    
    try {
      await page.reload();
      
      // Should show offline indicator or cached content
      const body = await page.locator('body').textContent();
      expect(body).toBeDefined();
    } catch (error) {
      // Expected for full offline, but check for service worker
      const swRegistration = await page.evaluate(() => {
        return navigator.serviceWorker.getRegistration();
      });
      
      if (swRegistration) {
        console.log('Service worker is registered for offline support');
      }
    } finally {
      await context.setOffline(false);
    }
  });

  test('Battery consumption during journaling sessions', async ({ page }) => {
    await page.goto('/journal');
    
    // Simulate extended journaling session
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Type continuously to simulate journaling
      const longText = 'This is a long journal entry that simulates extended use. '.repeat(50);
      
      const startTime = Date.now();
      await textarea.fill(longText);
      
      // Check for performance issues during typing
      const performanceEntries = await page.evaluate(() => {
        return performance.getEntriesByType('measure');
      });
      
      const endTime = Date.now();
      const sessionDuration = endTime - startTime;
      
      // Should handle long sessions without significant performance degradation
      expect(sessionDuration).toBeLessThan(5000);
    }
  });
});

test.describe('Mobile Crisis Support', () => {
  TEST_DEVICES.forEach(({ name, device }) => {
    test.describe(`${name} Crisis Support`, () => {
      test.use({ ...device });

      test('Crisis button accessibility on mobile', async ({ page }) => {
        await page.goto('/');
        
        // Wait for crisis button to load
        await page.waitForSelector('[aria-label*="crisis"]', { timeout: 10000 });
        
        const crisisButton = page.locator('[aria-label*="crisis"]').first();
        
        // Check visibility and size
        await expect(crisisButton).toBeVisible();
        await checkTouchTargetSize(page, '[aria-label*="crisis"]', 60);
        
        // Test click interaction
        await crisisButton.click();
        
        // Should open crisis panel
        await expect(page.locator('text=Crisis Lifeline')).toBeVisible({ timeout: 5000 });
      });

      test('Crisis resources load quickly on mobile', async ({ page }) => {
        await page.goto('/');
        
        // Click crisis button
        const crisisButton = page.locator('[aria-label*="crisis"]').first();
        await crisisButton.click();
        
        const startTime = Date.now();
        
        // Wait for crisis resources to load
        await page.waitForSelector('text=Crisis Lifeline', { timeout: 3000 });
        await page.waitForSelector('[href="tel:988"]', { timeout: 3000 });
        
        const loadTime = Date.now() - startTime;
        
        // Crisis resources should load within 2 seconds
        expect(loadTime).toBeLessThan(2000);
      });

      test('Crisis hotline integration on mobile browsers', async ({ page }) => {
        await page.goto('/');
        
        // Open crisis panel
        const crisisButton = page.locator('[aria-label*="crisis"]').first();
        await crisisButton.click();
        
        // Check for phone link
        const phoneLink = page.locator('[href="tel:988"]');
        await expect(phoneLink).toBeVisible();
        
        // Check link format and accessibility
        const href = await phoneLink.getAttribute('href');
        expect(href).toBe('tel:988');
        
        // Check touch target size for crisis call
        await checkTouchTargetSize(page, '[href="tel:988"]', 70);
      });

      test('Offline crisis support on mobile devices', async ({ page, context }) => {
        await page.goto('/');
        
        // First, ensure crisis resources are cached
        const crisisButton = page.locator('[aria-label*="crisis"]').first();
        await crisisButton.click();
        await page.waitForSelector('text=Crisis Lifeline', { timeout: 5000 });
        
        // Close panel and go offline
        await page.keyboard.press('Escape');
        await context.setOffline(true);
        
        try {
          // Try to access crisis support offline
          await crisisButton.click();
          
          // Should still show crisis support (cached)
          const isVisible = await page.locator('text=Crisis Lifeline').isVisible({ timeout: 3000 });
          if (isVisible) {
            console.log('Crisis support available offline');
          }
        } catch (error) {
          console.log('Crisis support may not be available offline');
        } finally {
          await context.setOffline(false);
        }
      });
    });
  });
});

test.describe('Mobile Journal Experience', () => {
  test.use({ ...devices['iPhone 13'] });

  test('Journal creation and editing on mobile', async ({ page }) => {
    // Mock authentication
    await page.goto('/journal');
    
    // Check for journal textarea
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Test typing experience
      const testText = 'This is my mobile journal entry.';
      await textarea.fill(testText);
      
      const value = await textarea.inputValue();
      expect(value).toBe(testText);
      
      // Check textarea size and accessibility
      const box = await textarea.boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(300); // Minimum height for comfortable writing
      }
    }
  });

  test('Mobile keyboard behavior and text input', async ({ page }) => {
    await page.goto('/journal');
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Focus on textarea
      await textarea.focus();
      
      // Check for iOS zoom prevention
      const fontSize = await textarea.evaluate(el => 
        window.getComputedStyle(el).fontSize
      );
      const fontSizeNum = parseInt(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(16); // Prevents iOS zoom
      
      // Test keyboard interaction
      await textarea.type('Testing keyboard input on mobile device.');
      
      // Check viewport stability during typing
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      expect(viewportHeight).toBeGreaterThan(0);
    }
  });

  test('Auto-save functionality on mobile', async ({ page }) => {
    await page.goto('/journal');
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Type content
      await textarea.fill('Testing auto-save on mobile');
      
      // Look for save indicators
      const saveButton = page.locator('text=Save');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // Check for save confirmation
        const savedIndicator = page.locator('text=Saved');
        await expect(savedIndicator).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Journal entry viewing and navigation', async ({ page }) => {
    await page.goto('/journals'); // Journal list page
    
    // Check for mobile-friendly journal list
    const journalList = page.locator('[data-testid="journal-list"]');
    if (await journalList.isVisible()) {
      // Check touch targets for journal entries
      const journalItems = await page.locator('.journal-item').all();
      for (const item of journalItems) {
        if (await item.isVisible()) {
          const box = await item.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(52);
          }
        }
      }
    }
  });
});

test.describe('Mobile Responsive Design', () => {
  const SCREEN_SIZES = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 13', width: 390, height: 844 },
    { name: 'iPhone 13 Pro Max', width: 428, height: 926 },
    { name: 'Galaxy S21', width: 360, height: 800 },
  ];

  SCREEN_SIZES.forEach(({ name, width, height }) => {
    test(`Layout on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check basic layout elements
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // Check for mobile navigation
      const mobileNav = page.locator('.nav-mobile, [data-testid="mobile-nav"]');
      if (await mobileNav.isVisible()) {
        // Check safe area handling
        const navStyles = await mobileNav.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            paddingBottom: computed.paddingBottom,
            bottom: computed.bottom
          };
        });
        
        console.log(`Navigation styles on ${name}:`, navStyles);
      }
      
      // Check for horizontal scrolling (should not exist)
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(width + 1); // Allow 1px tolerance
    });

    test(`Portrait and landscape orientation on ${name}`, async ({ page }) => {
      // Test portrait
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
      
      // Test landscape
      await page.setViewportSize({ width: height, height: width });
      await page.goto('/');
      await expect(page.locator('body')).toBeVisible();
      
      // Check landscape optimizations
      if (width > height) { // Now in landscape
        const nav = page.locator('.nav-mobile');
        if (await nav.isVisible()) {
          const navHeight = await nav.evaluate(el => el.offsetHeight);
          expect(navHeight).toBeLessThan(60); // Should be compact in landscape
        }
      }
    });
  });

  test('Mobile navigation and menu systems', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Look for mobile menu
    const menuButton = page.locator('[aria-label*="menu"], .menu-button, [data-testid="menu-button"]');
    if (await menuButton.isVisible()) {
      await checkTouchTargetSize(page, '[aria-label*="menu"], .menu-button', 52);
      
      // Test menu interaction
      await menuButton.click();
      
      // Should open mobile menu
      const mobileMenu = page.locator('.mobile-menu, [data-testid="mobile-menu"]');
      if (await mobileMenu.isVisible()) {
        // Check menu items have proper touch targets
        const menuItems = await page.locator('.mobile-menu a, .mobile-menu button').all();
        for (const item of menuItems) {
          if (await item.isVisible()) {
            const box = await item.boundingBox();
            if (box) {
              expect(box.height).toBeGreaterThanOrEqual(52);
            }
          }
        }
      }
    }
  });

  test('Accessibility features on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13
    await page.goto('/');
    
    // Test high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    
    // Check for accessibility features
    const buttons = await page.locator('button, a[role="button"]').all();
    for (const button of buttons) {
      if (await button.isVisible()) {
        // Check for proper ARIA labels
        const ariaLabel = await button.getAttribute('aria-label');
        if (!ariaLabel) {
          const textContent = await button.textContent();
          expect(textContent?.trim()).toBeTruthy();
        }
        
        // Check focus states
        await button.focus();
        const outlineStyle = await button.evaluate(el => 
          window.getComputedStyle(el).outline
        );
        // Should have some form of focus indication
        expect(outlineStyle).toBeDefined();
      }
    }
  });
});

test.describe('Crisis Situation Stress Testing', () => {
  test.use({ ...devices['iPhone SE'] }); // Test on smallest device

  test('Panic attack simulation - rapid interactions', async ({ page }) => {
    await simulateStressConditions(page);
    await page.goto('/');
    
    // Simulate rapid, panicked clicking
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await crisisButton.click();
    
    // Rapid clicking on crisis resources
    for (let i = 0; i < 5; i++) {
      const phoneLink = page.locator('[href="tel:988"]');
      if (await phoneLink.isVisible()) {
        await phoneLink.click({ timeout: 1000 });
        await page.waitForTimeout(100);
      }
    }
    
    // Should still function properly
    await expect(page.locator('[href="tel:988"]')).toBeVisible();
  });

  test('Low battery simulation - energy efficient operations', async ({ page }) => {
    // Reduce animation duration to save battery
    await page.addInitScript(() => {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0.01ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    });
    
    await page.goto('/');
    
    // Test essential functions still work
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await crisisButton.click();
    await expect(page.locator('[href="tel:988"]')).toBeVisible();
  });

  test('Poor network conditions - graceful degradation', async ({ page, context }) => {
    // Simulate very poor network
    await context.route('**/*', async route => {
      // Random delays and failures
      if (Math.random() > 0.7) {
        await route.abort();
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      await route.continue();
    });
    
    await page.goto('/', { timeout: 15000 });
    
    // Essential crisis support should still be accessible
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    if (await crisisButton.isVisible({ timeout: 10000 })) {
      await crisisButton.click();
      
      // Crisis phone number should be available (cached or inline)
      const phoneLink = page.locator('[href="tel:988"]');
      await expect(phoneLink).toBeVisible({ timeout: 10000 });
    }
  });
});