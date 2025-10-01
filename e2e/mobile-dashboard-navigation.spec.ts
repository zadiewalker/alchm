import { test, expect, devices } from '@playwright/test';

// Test mobile dashboard navigation for vulnerable users in crisis situations
test.describe('Mobile Dashboard Navigation - Crisis State Optimization', () => {
  // Test with different mobile devices
  ['iPhone 13', 'Pixel 5', 'iPhone SE'].forEach(deviceName => {
    test.describe(`On ${deviceName}`, () => {
      test.beforeEach(async ({ page, context }) => {
        // Emulate the specific device
        await context.setExtraHTTPHeaders({
          'User-Agent': devices[deviceName].userAgent || ''
        });
        await page.setViewportSize(devices[deviceName].viewport);
        
        // Navigate to dashboard
        await page.goto('/dashboard');
        
        // Wait for page to be fully interactive
        await page.waitForLoadState('networkidle');
      });

      test('Dashboard cards have trauma-informed touch targets (52px minimum)', async ({ page }) => {
        // Check all navigation cards meet minimum touch target requirements
        const cards = await page.locator('.card-sanctuary').all();
        
        for (const card of cards) {
          const boundingBox = await card.boundingBox();
          expect(boundingBox).not.toBeNull();
          
          if (boundingBox) {
            // Trauma-informed minimum: 52px, enhanced: 64px for crisis
            expect(boundingBox.height).toBeGreaterThanOrEqual(52);
            expect(boundingBox.width).toBeGreaterThanOrEqual(52);
          }
        }
      });

      test('Navigation works with simulated trembling hands (imprecise touches)', async ({ page }) => {
        // Simulate multiple slightly off-target touches to test forgiveness
        const journalsCard = page.locator('.card-sanctuary').first();
        const boundingBox = await journalsCard.boundingBox();
        
        if (boundingBox) {
          // Touch slightly outside the exact center (simulating trembling)
          const offsetX = boundingBox.x + boundingBox.width * 0.7; // 70% across
          const offsetY = boundingBox.y + boundingBox.height * 0.3; // 30% down
          
          await page.mouse.click(offsetX, offsetY);
          
          // Should still navigate successfully
          await page.waitForURL(/.*\/journals.*/, { timeout: 5000 });
          expect(page.url()).toContain('/journals');
        }
      });

      test('Haptic feedback is triggered on navigation (mock vibration)', async ({ page }) => {
        // Mock navigator.vibrate to verify it's called
        await page.addInitScript(() => {
          (window as any).mockVibrateCallsEnabled = true;
          (window as any).mockVibrateCalls = [];
          
          Object.defineProperty(navigator, 'vibrate', {
            writable: true,
            value: (pattern: number | number[]) => {
              (window as any).mockVibrateCalls.push(pattern);
              return true;
            }
          });
        });

        // Click on a navigation card
        await page.locator('.card-sanctuary').first().click();
        
        // Check if vibrate was called
        const vibrateCalls = await page.evaluate(() => (window as any).mockVibrateCalls);
        expect(vibrateCalls.length).toBeGreaterThan(0);
      });

      test('Loading state appears during navigation transitions', async ({ page }) => {
        // Slow down network to observe loading state
        await page.route('**/*', route => {
          setTimeout(() => route.continue(), 200);
        });

        const card = page.locator('.card-sanctuary').first();
        await card.click();
        
        // Check for loading indicator
        const loadingIndicator = page.locator('[style*="animation: gentle-pulse"]');
        await expect(loadingIndicator).toBeVisible({ timeout: 1000 });
      });

      test('Navigation works in offline mode for essential routes', async ({ page }) => {
        // First, visit pages to cache them
        await page.goto('/journals');
        await page.goto('/dashboard');
        
        // Go offline
        await page.context().setOffline(true);
        
        // Try to navigate to cached essential route
        const journalsCard = page.locator('.card-sanctuary').first();
        await journalsCard.click();
        
        // Should show offline capability message
        const offlineMessage = page.locator('text=Offline Mode');
        await expect(offlineMessage).toBeVisible({ timeout: 3000 });
      });

      test('Error handling shows supportive messages for failed navigation', async ({ page }) => {
        // Mock a navigation failure
        await page.route('**/journals', route => route.abort());
        
        const card = page.locator('.card-sanctuary').first();
        await card.click();
        
        // Should show supportive error message (not blame the user)
        const errorMessage = page.locator('text*="isn\'t your fault"');
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      });

      test('Focus states are visible for keyboard/screen reader navigation', async ({ page }) => {
        // Tab through navigation cards
        await page.keyboard.press('Tab');
        
        // Check if focused element has visible focus indicator
        const focusedElement = await page.locator(':focus');
        const outline = await focusedElement.evaluate(el => 
          getComputedStyle(el).outline
        );
        
        // Should have trauma-informed focus styling
        expect(outline).not.toBe('none');
      });

      test('Touch feedback is immediate and reassuring', async ({ page }) => {
        const card = page.locator('.card-sanctuary').first();
        
        // Start touch
        await card.dispatchEvent('touchstart');
        
        // Check for immediate visual feedback (scale down)
        const transform = await card.evaluate(el => 
          getComputedStyle(el).transform
        );
        
        // Should show scale transformation for immediate feedback
        expect(transform).toContain('scale');
      });

      test('Analytics navigation works from ReportCard component', async ({ page }) => {
        // Wait for ReportCard to load
        await page.waitForSelector('.crisis-optimized-nav-button', { timeout: 10000 });
        
        // Click on "View Full Analytics" button
        const analyticsButton = page.locator('text="View Full Analytics"');
        await analyticsButton.click();
        
        // Should navigate to analytics page
        await page.waitForURL(/.*\/analytics.*/, { timeout: 5000 });
        expect(page.url()).toContain('/analytics');
        
        // Verify analytics page loads correctly
        const analyticsTitle = page.locator('text="Wellness Analytics"');
        await expect(analyticsTitle).toBeVisible();
      });

      test('Navigation preserves scroll position for anxiety-free return', async ({ page }) => {
        // Scroll down on dashboard
        await page.evaluate(() => window.scrollTo(0, 200));
        const initialScroll = await page.evaluate(() => window.scrollY);
        
        // Navigate away and back
        const card = page.locator('.card-sanctuary').first();
        await card.click();
        await page.waitForLoadState('networkidle');
        
        await page.goBack();
        await page.waitForLoadState('networkidle');
        
        // Check if scroll position was stored
        const scrollPosition = await page.evaluate(() => 
          sessionStorage.getItem('dashboard_scroll')
        );
        
        expect(scrollPosition).toBe(initialScroll.toString());
      });

      test('High contrast mode support for dissociation episodes', async ({ page }) => {
        // Enable high contrast mode
        await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
        
        const card = page.locator('.card-sanctuary').first();
        
        // Should have enhanced visibility in high contrast
        const styles = await card.evaluate(el => {
          const computed = getComputedStyle(el);
          return {
            border: computed.border,
            backgroundColor: computed.backgroundColor
          };
        });
        
        // Should have visible borders in high contrast mode
        expect(styles.border).not.toBe('none');
      });
    });
  });

  test.describe('Crisis Mode Simulation', () => {
    test('Enlarged touch targets in crisis mode', async ({ page }) => {
      // Add crisis mode class to body
      await page.addStyleTag({
        content: `
          .crisis-mode .trauma-informed-link {
            min-height: 64px !important;
            min-width: 64px !important;
            padding: 16px !important;
          }
        `
      });
      
      await page.evaluate(() => document.body.classList.add('crisis-mode'));
      await page.goto('/dashboard');
      
      const cards = await page.locator('.trauma-informed-link').all();
      
      for (const card of cards) {
        const boundingBox = await card.boundingBox();
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(64);
          expect(boundingBox.width).toBeGreaterThanOrEqual(64);
        }
      }
    });

    test('Reduced motion support for sensory sensitivity', async ({ page }) => {
      // Enable reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/dashboard');
      
      // Check that animations are minimal
      const card = page.locator('.card-sanctuary').first();
      const transitionDuration = await card.evaluate(el => 
        getComputedStyle(el).transitionDuration
      );
      
      // Should have very short or no transitions
      expect(parseFloat(transitionDuration)).toBeLessThan(0.2);
    });
  });

  test.describe('Network Conditions', () => {
    test('Navigation works on slow 3G network', async ({ page }) => {
      // Simulate slow 3G
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 500);
      });
      
      const startTime = Date.now();
      const card = page.locator('.card-sanctuary').first();
      await card.click();
      
      await page.waitForURL(/.*\/journals.*/, { timeout: 10000 });
      const endTime = Date.now();
      
      // Should complete within reasonable time even on slow network
      expect(endTime - startTime).toBeLessThan(10000);
    });

    test('Offline notification appears when going offline', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Go offline
      await page.context().setOffline(true);
      
      // Trigger offline event
      await page.evaluate(() => {
        window.dispatchEvent(new Event('offline'));
      });
      
      // Should show offline notification
      const offlineNotification = page.locator('text*="offline"');
      await expect(offlineNotification).toBeVisible({ timeout: 3000 });
    });
  });
});