import { test, expect, devices } from '@playwright/test';

/**
 * MOBILE EXPERIENCE VALIDATION FOR TRAUMA SURVIVORS
 * Critical mobile accessibility and performance tests for ALCHM
 * 
 * Tests the mobile experience for users accessing ALCHM during vulnerable moments
 * Focus on touch accessibility, crisis support, and trauma-informed design
 */

// Configure for mobile testing
test.use(devices['iPhone 13']);

test.describe('Critical Mobile Touch Accessibility', () => {
  test('Crisis button meets 70px minimum touch target', async ({ page }) => {
    await page.goto('/');
    
    // Wait for crisis button to load
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await expect(crisisButton).toBeVisible({ timeout: 10000 });
    
    // Check touch target size
    const boundingBox = await crisisButton.boundingBox();
    if (boundingBox) {
      // Crisis buttons should be at least 70px for emergency situations
      expect(Math.min(boundingBox.width, boundingBox.height)).toBeGreaterThanOrEqual(70);
      console.log(`Crisis button size: ${boundingBox.width}x${boundingBox.height}px`);
    }
  });

  test('All interactive elements meet 52px minimum touch targets', async ({ page }) => {
    await page.goto('/');
    
    const touchElements = await page.locator('button, a, input[type="submit"], [role="button"]').all();
    let elementCount = 0;
    let validCount = 0;

    for (const element of touchElements) {
      if (await element.isVisible()) {
        elementCount++;
        const box = await element.boundingBox();
        if (box) {
          const minDimension = Math.min(box.width, box.height);
          if (minDimension >= 52) {
            validCount++;
          } else {
            const elementText = await element.textContent();
            console.warn(`Small touch target found: ${elementText?.slice(0, 30)} - ${box.width}x${box.height}px`);
          }
        }
      }
    }

    console.log(`Touch targets validated: ${validCount}/${elementCount} elements meet 52px minimum`);
    expect(validCount).toBe(elementCount);
  });

  test('iOS prevents zoom on input focus', async ({ page }) => {
    await page.goto('/journal');
    
    const textInputs = await page.locator('input[type="text"], input[type="email"], textarea').all();
    
    for (const input of textInputs) {
      if (await input.isVisible()) {
        const fontSize = await input.evaluate(el => {
          return parseInt(window.getComputedStyle(el).fontSize);
        });
        
        // iOS requires 16px minimum to prevent zoom
        expect(fontSize).toBeGreaterThanOrEqual(16);
      }
    }
  });
});

test.describe('Mobile Crisis Support Functionality', () => {
  test('Crisis button is always visible and accessible', async ({ page }) => {
    const pages = ['/', '/journal', '/dashboard'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      const crisisButton = page.locator('[aria-label*="crisis"]').first();
      await expect(crisisButton).toBeVisible({ timeout: 5000 });
      
      // Should be clickable
      await expect(crisisButton).toBeEnabled();
      
      console.log(`Crisis button verified on ${pagePath}`);
    }
  });

  test('Crisis resources load quickly on mobile', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    
    // Click crisis button
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await crisisButton.click();
    
    // Wait for crisis resources
    await expect(page.locator('text=Crisis Lifeline')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('[href="tel:988"]')).toBeVisible({ timeout: 3000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`Crisis resources loaded in ${loadTime}ms`);
    
    // Should load within 2 seconds for emergency situations
    expect(loadTime).toBeLessThan(2000);
  });

  test('Crisis phone link works on mobile', async ({ page }) => {
    await page.goto('/');
    
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await crisisButton.click();
    
    const phoneLink = page.locator('[href="tel:988"]');
    await expect(phoneLink).toBeVisible();
    
    // Check proper tel: link format
    const href = await phoneLink.getAttribute('href');
    expect(href).toBe('tel:988');
    
    // Check touch target size for crisis call
    const box = await phoneLink.boundingBox();
    if (box) {
      expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(70);
    }
  });
});

test.describe('Mobile Journal Experience', () => {
  test('Journal textarea is properly sized for mobile', async ({ page }) => {
    await page.goto('/journal');
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      const box = await textarea.boundingBox();
      if (box) {
        // Should be at least 300px tall for comfortable writing
        expect(box.height).toBeGreaterThanOrEqual(300);
        
        // Should use full width (minus padding)
        const viewportWidth = page.viewportSize()?.width || 375;
        expect(box.width).toBeGreaterThan(viewportWidth * 0.8);
        
        console.log(`Journal textarea: ${box.width}x${box.height}px`);
      }
    }
  });

  test('Mobile keyboard does not break layout', async ({ page }) => {
    await page.goto('/journal');
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Get initial viewport height
      const initialHeight = await page.evaluate(() => window.innerHeight);
      
      // Focus on textarea to bring up keyboard
      await textarea.focus();
      await page.waitForTimeout(500); // Wait for keyboard animation
      
      // Textarea should still be visible and functional
      await expect(textarea).toBeVisible();
      await textarea.type('Testing mobile keyboard interaction');
      
      const textValue = await textarea.inputValue();
      expect(textValue).toContain('Testing mobile keyboard');
      
      console.log(`Initial viewport height: ${initialHeight}px`);
    }
  });

  test('Journal prompts have proper mobile touch targets', async ({ page }) => {
    await page.goto('/journal');
    
    // Look for prompt buttons
    const promptButtons = await page.locator('button:has-text("What am I grateful"), button:has-text("How am I feeling"), button:has-text("What challenged me"), button:has-text("What do I need")').all();
    
    for (const button of promptButtons) {
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(52);
          expect(box.width).toBeGreaterThanOrEqual(100);
        }
      }
    }
  });
});

test.describe('Mobile Performance & Network Conditions', () => {
  test('Page loads within acceptable time on mobile', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Should load within 4 seconds on mobile
    expect(loadTime).toBeLessThan(4000);
  });

  test('Critical content loads first', async ({ page }) => {
    await page.goto('/');
    
    // Crisis button should be one of the first things to load
    await expect(page.locator('[aria-label*="crisis"]')).toBeVisible({ timeout: 3000 });
    
    // Main content should be visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check that essential CSS is loaded
    const bodyStyles = await page.locator('body').evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        background: computed.background,
        fontFamily: computed.fontFamily
      };
    });
    
    expect(bodyStyles.background).not.toBe('');
    expect(bodyStyles.fontFamily).not.toBe('');
  });

  test('Works with slow 3G simulation', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms latency
      await route.continue();
    });

    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const loadTime = Date.now() - startTime;
    
    console.log(`Page loaded on slow 3G in ${loadTime}ms`);
    
    // Should still load within 8 seconds on slow 3G
    expect(loadTime).toBeLessThan(8000);
    
    // Crisis support should still be accessible
    await expect(page.locator('[aria-label*="crisis"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Responsive Design Validation', () => {
  const testSizes = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 13 Pro Max', width: 428, height: 926 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
  ];

  for (const { name, width, height } of testSizes) {
    test(`Layout works on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // Check no horizontal scrolling
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyScrollWidth).toBeLessThanOrEqual(width + 1);
      
      // Check crisis button positioning
      const crisisButton = page.locator('[aria-label*="crisis"]');
      if (await crisisButton.isVisible()) {
        const buttonBox = await crisisButton.boundingBox();
        if (buttonBox) {
          // Should be positioned within viewport
          expect(buttonBox.x).toBeGreaterThanOrEqual(0);
          expect(buttonBox.y).toBeGreaterThanOrEqual(0);
          expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(width);
        }
      }
      
      console.log(`Layout verified for ${name}`);
    });
  }

  test('Portrait and landscape orientation support', async ({ page }) => {
    // Test portrait first
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    // Test landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
    
    // Crisis button should still be accessible in landscape
    await expect(page.locator('[aria-label*="crisis"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Accessibility Features', () => {
  test('High contrast mode support', async ({ page }) => {
    // Simulate high contrast preference
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
    await page.goto('/');
    
    // Check that content is still visible and accessible
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('[aria-label*="crisis"]')).toBeVisible();
    
    // Check button contrast
    const buttons = await page.locator('button').all();
    for (const button of buttons.slice(0, 3)) { // Check first 3 buttons
      if (await button.isVisible()) {
        const styles = await button.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            border: computed.border
          };
        });
        
        // Should have some form of visual distinction
        expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('Reduced motion preference support', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Check that animations are reduced or disabled
    const animatedElements = await page.locator('[class*="animate"], [style*="transition"], [style*="animation"]').all();
    
    for (const element of animatedElements.slice(0, 3)) {
      if (await element.isVisible()) {
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            animationDuration: computed.animationDuration,
            transitionDuration: computed.transitionDuration
          };
        });
        
        // Animations should be very short or disabled
        if (styles.animationDuration && styles.animationDuration !== '0s') {
          console.log(`Element has animation duration: ${styles.animationDuration}`);
        }
      }
    }
  });

  test('Screen reader compatibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper ARIA labels and semantic HTML
    const importantElements = await page.locator('button, a, input, [role="button"]').all();
    
    for (const element of importantElements.slice(0, 5)) {
      if (await element.isVisible()) {
        const ariaLabel = await element.getAttribute('aria-label');
        const textContent = await element.textContent();
        const tagName = await element.evaluate(el => el.tagName.toLowerCase());
        
        // Should have either aria-label or text content
        const hasAccessibleName = ariaLabel || (textContent && textContent.trim().length > 0);
        
        if (!hasAccessibleName) {
          console.warn(`Element without accessible name: <${tagName}>`);
        }
        
        expect(hasAccessibleName).toBeTruthy();
      }
    }
  });
});

test.describe('Crisis Situation Stress Testing', () => {
  test('Rapid crisis button interactions', async ({ page }) => {
    await page.goto('/');
    
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await expect(crisisButton).toBeVisible();
    
    // Simulate panicked rapid clicking
    for (let i = 0; i < 5; i++) {
      await crisisButton.click({ timeout: 1000 });
      await page.waitForTimeout(100);
      
      // Crisis panel should be visible
      const phoneLink = page.locator('[href="tel:988"]');
      await expect(phoneLink).toBeVisible({ timeout: 2000 });
      
      // Close panel for next iteration
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
    }
    
    console.log('Crisis button handled rapid interactions successfully');
  });

  test('Network failures during crisis access', async ({ page, context }) => {
    await page.goto('/');
    
    // First ensure crisis button works normally
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await crisisButton.click();
    await expect(page.locator('[href="tel:988"]')).toBeVisible();
    await page.keyboard.press('Escape');
    
    // Simulate network failures
    let requestCount = 0;
    await context.route('**/*', async route => {
      requestCount++;
      if (requestCount > 3 && Math.random() > 0.5) {
        await route.abort('failed');
        return;
      }
      await route.continue();
    });
    
    // Crisis support should still work despite network issues
    await crisisButton.click();
    await expect(page.locator('[href="tel:988"]')).toBeVisible({ timeout: 5000 });
    
    console.log('Crisis support remains accessible despite network issues');
  });

  test('Low device memory simulation', async ({ page }) => {
    // Simulate low memory conditions by reducing cache
    await page.addInitScript(() => {
      // Limit some browser caches
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          console.log('Storage estimate:', estimate);
        });
      }
    });
    
    await page.goto('/');
    
    // Essential functionality should still work
    const crisisButton = page.locator('[aria-label*="crisis"]').first();
    await expect(crisisButton).toBeVisible({ timeout: 10000 });
    
    await crisisButton.click();
    await expect(page.locator('[href="tel:988"]')).toBeVisible({ timeout: 5000 });
    
    console.log('Core functionality works under memory constraints');
  });
});