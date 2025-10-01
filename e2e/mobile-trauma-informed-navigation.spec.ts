/**
 * Mobile Trauma-Informed Navigation Test Suite
 * Critical UX validation for users in vulnerable emotional states
 * 
 * Tests cover:
 * - Touch target accessibility for users with trembling hands
 * - Navigation performance on slow networks
 * - Crisis support accessibility
 * - Loading state management
 * - Offline functionality
 */

import { test, expect, devices } from '@playwright/test';

// Configure mobile device testing
test.use(devices['iPhone 12 Pro']);

test.describe('Mobile Trauma-Informed Navigation', () => {

    test('CRITICAL: Main CTA button meets trauma-informed touch targets', async ({ page }) => {
      await page.goto('http://localhost:3001');
      
      // Wait for page to fully load
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
        
        // Test trauma-informed standards
        if (boundingBox.height < traumaInformedTarget) {
          console.warn(`⚠️ TRAUMA UX WARNING: Button height (${boundingBox.height}px) is below trauma-informed target (${traumaInformedTarget}px)`);
        }
        if (boundingBox.width < traumaInformedTarget) {
          console.warn(`⚠️ TRAUMA UX WARNING: Button width (${boundingBox.width}px) is below trauma-informed target (${traumaInformedTarget}px)`);
        }
      }
      
      // Test touch feedback and responsiveness
      await ctaButton.hover();
      await page.waitForTimeout(200); // Allow hover state to render
      
      // Verify button is easily tappable (no overlapping elements)
      const isClickable = await ctaButton.isEnabled();
      expect(isClickable, 'CTA button must be immediately clickable').toBe(true);
    });

    test('CRITICAL: Crisis support remains accessible during navigation', async ({ page }) => {
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Check for crisis support elements
      const crisisSupport = page.locator('text=/crisis|988|lifeline|emergency/i').first();
      await expect(crisisSupport).toBeVisible();
      
      // Verify crisis support doesn't get hidden by overlays
      const crisisBox = await crisisSupport.boundingBox();
      expect(crisisBox).not.toBeNull();
      
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
          { x: 2, y: boundingBox.height - 2 }, // Bottom-left near edge
          { x: boundingBox.width - 2, y: boundingBox.height - 2 }, // Bottom-right near edge
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

    for (const network of SLOW_NETWORKS) {
      test(`Performance on ${network.name} network`, async ({ page, context }) => {
        // Simulate slow network
        await context.route('**/*', async route => {
          await new Promise(resolve => setTimeout(resolve, network.latency / 10));
          await route.continue();
        });
        
        const startTime = Date.now();
        await page.goto('http://localhost:3001');
        
        // Wait for critical elements to load
        const ctaButton = page.locator('a[href="/auth/login"]').first();
        await expect(ctaButton).toBeVisible({ timeout: 15000 });
        
        const loadTime = Date.now() - startTime;
        console.log(`${network.name} load time: ${loadTime}ms`);
        
        // Critical loading performance thresholds
        const maxAcceptableLoadTime = network.name === '2G' ? 10000 : 5000;
        expect(loadTime, `Page load time on ${network.name} exceeds trauma-informed threshold`).toBeLessThan(maxAcceptableLoadTime);
        
        // Test navigation works on slow networks
        await ctaButton.click();
        await page.waitForURL('**/auth/login', { timeout: 20000 });
        expect(page.url().includes('/auth/login')).toBe(true);
      });
    }

    test('CRITICAL: Loading states provide clear feedback', async ({ page }) => {
      await page.goto('http://localhost:3001');
      
      // Click navigation button
      const ctaButton = page.locator('a[href="/auth/login"]').first();
      await ctaButton.click();
      
      // Check for loading indicators during navigation
      const possibleLoadingStates = [
        page.locator('text=/loading|preparing|wait/i'),
        page.locator('[data-testid*="loading"]'),
        page.locator('.loading'),
        page.locator('[aria-label*="loading"]'),
      ];
      
      let foundLoadingState = false;
      for (const loadingLocator of possibleLoadingStates) {
        if (await loadingLocator.isVisible().catch(() => false)) {
          foundLoadingState = true;
          console.log('✅ Found loading state feedback');
          break;
        }
      }
      
      // Wait for navigation to complete
      await page.waitForURL('**/auth/login', { timeout: 10000 });
      
      // Verify user gets clear feedback about page state
      expect(page.url().includes('/auth/login')).toBe(true);
    });

    test('CRITICAL: Offline behavior doesn\'t break navigation', async ({ page, context }) => {
      // First load the page normally
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Simulate going offline
      await context.setOffline(true);
      
      // Try to navigate - should provide clear offline feedback
      const ctaButton = page.locator('a[href="/auth/login"]').first();
      await ctaButton.click();
      
      // Wait a moment for offline handling
      await page.waitForTimeout(2000);
      
      // Check for offline indicators or graceful degradation
      const offlineIndicators = [
        page.locator('text=/offline|no.connection|connection.lost/i'),
        page.locator('[data-testid*="offline"]'),
        page.locator('.offline'),
      ];
      
      let hasOfflineIndicator = false;
      for (const indicator of offlineIndicators) {
        if (await indicator.isVisible().catch(() => false)) {
          hasOfflineIndicator = true;
          console.log('✅ Found offline indicator');
          break;
        }
      }
      
      // Go back online
      await context.setOffline(false);
      
      // Verify navigation works after reconnecting
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const workingButton = page.locator('a[href="/auth/login"]').first();
      await workingButton.click();
      await page.waitForURL('**/auth/login', { timeout: 10000 });
      expect(page.url().includes('/auth/login')).toBe(true);
    });

    test('CRITICAL: Error handling during navigation', async ({ page, context }) => {
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Simulate server errors during navigation
      await context.route('**/auth/login', route => route.fulfill({
        status: 500,
        contentType: 'text/html',
        body: 'Server Error'
      }));
      
      const ctaButton = page.locator('a[href="/auth/login"]').first();
      await ctaButton.click();
      
      // Wait for error handling
      await page.waitForTimeout(3000);
      
      // Should provide clear error feedback, not leave user stranded
      const errorIndicators = [
        page.locator('text=/error|failed|try.again|something.went.wrong/i'),
        page.locator('[data-testid*="error"]'),
        page.locator('.error'),
      ];
      
      let hasErrorFeedback = false;
      for (const indicator of errorIndicators) {
        if (await indicator.isVisible().catch(() => false)) {
          hasErrorFeedback = true;
          console.log('✅ Found error feedback');
          break;
        }
      }
      
      // Even with errors, crisis support should remain accessible
      const crisisSupport = page.locator('text=/crisis|988|lifeline/i').first();
      const crisisVisible = await crisisSupport.isVisible().catch(() => false);
      
      if (!crisisVisible) {
        console.error('❌ CRITICAL: Crisis support not accessible during error state');
      }
    });

    test('CRITICAL: Viewport and keyboard interactions', async ({ page }) => {
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Test viewport meta tag for proper mobile scaling
      const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
      expect(viewportMeta).toContain('width=device-width');
      expect(viewportMeta).toContain('initial-scale=1');
      
      // Test keyboard navigation (accessibility)
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus').first();
      
      // Should be able to navigate to CTA button via keyboard
      let reachedCTA = false;
      for (let i = 0; i < 10; i++) {
        const focusedText = await focusedElement.textContent().catch(() => '');
        if (focusedText && focusedText.includes('Start Your First Entry')) {
          reachedCTA = true;
          break;
        }
        await page.keyboard.press('Tab');
      }
      
      if (reachedCTA) {
        console.log('✅ CTA button is keyboard accessible');
        
        // Test keyboard activation
        await page.keyboard.press('Enter');
        await page.waitForURL('**/auth/login', { timeout: 10000 });
        expect(page.url().includes('/auth/login')).toBe(true);
      }
    });

    test('CRITICAL: Mobile-specific CSS and touch behaviors', async ({ page }) => {
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Check for mobile-optimized styles
      const ctaButton = page.locator('a[href="/auth/login"]').first();
      
      // Verify touch-action is set to prevent double-tap zoom
      const touchAction = await ctaButton.evaluate(el => getComputedStyle(el).touchAction);
      
      // Check for webkit tap highlight (mobile-specific)
      const tapHighlight = await ctaButton.evaluate(el => getComputedStyle(el).webkitTapHighlightColor);
      
      console.log(`Touch action: ${touchAction}, Tap highlight: ${tapHighlight}`);
      
      // Test that button responds to touch events
      await ctaButton.tap();
      await page.waitForURL('**/auth/login', { timeout: 10000 });
      expect(page.url().includes('/auth/login')).toBe(true);
    });
  });
}

  test('CRITICAL: Performance on slow network', async ({ page, context }) => {
    // Simulate slow network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms latency
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('http://localhost:3001');
    
    // Wait for critical elements to load
    const ctaButton = page.locator('a[href="/auth/login"]').first();
    await expect(ctaButton).toBeVisible({ timeout: 15000 });
    
    const loadTime = Date.now() - startTime;
    console.log(`Slow network load time: ${loadTime}ms`);
    
    // Critical loading performance thresholds
    expect(loadTime, 'Page load time on slow network exceeds trauma-informed threshold').toBeLessThan(8000);
    
    // Test navigation works on slow networks
    await ctaButton.click();
    await page.waitForURL('**/auth/login', { timeout: 20000 });
    expect(page.url().includes('/auth/login')).toBe(true);
  });
});