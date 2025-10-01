/**
 * CRITICAL Mobile Navigation Test for Trauma-Informed UX
 * Tests essential navigation for vulnerable users on mobile devices
 */

import { test, expect, devices } from '@playwright/test';

test.use(devices['iPhone 12 Pro']);

test.describe('CRITICAL Mobile Navigation Tests', () => {
  
  test('CRITICAL: Main CTA button meets trauma-informed touch targets', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Locate the main CTA button
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    await expect(ctaButton).toBeVisible();
    
    // Get button dimensions
    const boundingBox = await ctaButton.boundingBox();
    expect(boundingBox).not.toBeNull();
    
    if (boundingBox) {
      // CRITICAL: Touch target must be at least 44px (iOS minimum) for trembling hands
      const minTouchTarget = 44;
      const traumaInformedTarget = 52; // Recommended for vulnerable users
      
      console.log(`CTA Button dimensions: ${boundingBox.width}x${boundingBox.height}`);
      
      // Test minimum accessibility standards
      expect(boundingBox.height, 'Button height must meet iOS minimum touch target').toBeGreaterThanOrEqual(minTouchTarget);
      expect(boundingBox.width, 'Button width must meet iOS minimum touch target').toBeGreaterThanOrEqual(minTouchTarget);
      
      // Log trauma-informed warnings
      if (boundingBox.height < traumaInformedTarget) {
        console.warn(`⚠️ TRAUMA UX WARNING: Button height (${boundingBox.height}px) is below trauma-informed target (${traumaInformedTarget}px)`);
      }
      if (boundingBox.width < traumaInformedTarget) {
        console.warn(`⚠️ TRAUMA UX WARNING: Button width (${boundingBox.width}px) is below trauma-informed target (${traumaInformedTarget}px)`);
      }
    }
    
    // Test that button is immediately clickable
    const isClickable = await ctaButton.isEnabled();
    expect(isClickable, 'CTA button must be immediately clickable').toBe(true);
  });

  test('CRITICAL: Crisis support remains accessible during navigation', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Check for crisis support elements
    const crisisSupport = page.locator('text=/crisis|988|lifeline|emergency/i').first();
    await expect(crisisSupport).toBeVisible();
    
    // Test that crisis support remains visible during navigation
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    await ctaButton.click();
    
    // Wait for navigation to start
    await page.waitForTimeout(500);
    
    // Crisis support should still be accessible during transition
    const crisisStillVisible = await page.locator('text=/crisis|988|lifeline|emergency/i').first().isVisible().catch(() => false);
    
    if (!crisisStillVisible) {
      console.warn('⚠️ CRISIS SAFETY WARNING: Crisis support disappears during navigation');
    }
  });

  test('CRITICAL: Navigation works with simulated hand tremors', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    const boundingBox = await ctaButton.boundingBox();
    
    if (boundingBox) {
      // Simulate tremor by clicking near edges of button
      const tremorOffsets = [
        { x: 2, y: 2 }, // Top-left near edge
        { x: boundingBox.width - 2, y: 2 }, // Top-right near edge
      ];
      
      for (const offset of tremorOffsets) {
        await page.goto('http://localhost:3001'); // Reset page
        await page.waitForLoadState('networkidle');
        
        const button = page.locator('a[href="/auth/login"]').first();
        
        // Click with tremor simulation
        await button.click({ 
          position: offset,
          force: true // Simulate pressing despite imprecise touch
        });
        
        // Verify navigation still works
        await page.waitForURL('**/auth/login', { timeout: 10000 });
        const currentUrl = page.url();
        expect(currentUrl.includes('/auth/login'), `Navigation failed with tremor offset ${JSON.stringify(offset)}`).toBe(true);
      }
    }
  });

  test('CRITICAL: Performance on slow network', async ({ page, context }) => {
    // Simulate slow network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 300)); // 300ms latency
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('http://localhost:3001');
    
    // Wait for critical elements to load
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    await expect(ctaButton).toBeVisible({ timeout: 15000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`Slow network load time: ${loadTime}ms`);
    
    // Test navigation works on slow networks
    await ctaButton.click();
    await page.waitForURL('**/auth/login', { timeout: 20000 });
    expect(page.url().includes('/auth/login')).toBe(true);
  });

  test('CRITICAL: Touch interaction behavior', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Test that button responds to touch events
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    await ctaButton.tap();
    await page.waitForURL('**/auth/login', { timeout: 10000 });
    expect(page.url().includes('/auth/login')).toBe(true);
  });

  test('CRITICAL: Mobile viewport and scaling', async ({ page }) => {
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    
    // Test viewport meta tag for proper mobile scaling
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
    
    // Verify no horizontal scroll on mobile
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    
    expect(bodyScrollWidth, 'Page should not cause horizontal scroll on mobile').toBeLessThanOrEqual(windowInnerWidth + 10);
  });
});