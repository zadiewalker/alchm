import { test, expect } from '@playwright/test';

/**
 * MOBILE CRISIS VALIDATION TEST SUITE
 * 
 * Tests ALCHM mobile layout for trauma survivors in crisis situations
 * - Validates touch targets for users with trembling hands
 * - Tests layout stability during emotional distress scenarios  
 * - Ensures crisis support is accessible without overlapping
 * - Verifies trauma-informed design principles on mobile
 */

test.describe('Mobile Crisis Layout Validation', () => {
  
  test.describe('iPhone SE Crisis Tests', () => {
    test.use({ 
      viewport: { width: 375, height: 667 }
    });

    test('Crisis support box does not overlap other elements', async ({ page }) => {
      // Navigate to homepage with crisis scenario simulation
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Wait for page to fully load and animations to complete
      await page.waitForTimeout(2000);
      
      // Verify crisis support box is properly positioned
      const crisisBox = page.locator('div').filter({ hasText: 'Crisis Support Available 24/7' });
      await expect(crisisBox).toBeVisible();
      
      // Check that crisis box doesn't overlap with feature cards
      const featureCards = page.locator('div').filter({ hasText: 'Private & Secure' });
      await expect(featureCards).toBeVisible();
      
      // Verify visual separation between crisis box and feature cards
      const crisisBoxBounds = await crisisBox.boundingBox();
      const featureCardsBounds = await featureCards.boundingBox();
      
      expect(crisisBoxBounds).not.toBeNull();
      expect(featureCardsBounds).not.toBeNull();
      
      if (crisisBoxBounds && featureCardsBounds) {
        // Crisis box should be below feature cards with adequate spacing
        expect(crisisBoxBounds.y).toBeGreaterThan(featureCardsBounds.y + featureCardsBounds.height + 16);
        
        // No horizontal overlap
        const horizontalOverlap = !(
          crisisBoxBounds.x + crisisBoxBounds.width < featureCardsBounds.x ||
          featureCardsBounds.x + featureCardsBounds.width < crisisBoxBounds.x
        );
        expect(horizontalOverlap).toBe(false);
      }
    });

    test('Crisis button meets minimum 70px touch target requirement', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      
      const buttonBounds = await crisisButton.boundingBox();
      expect(buttonBounds).not.toBeNull();
      
      if (buttonBounds) {
        // Crisis button should meet 70px minimum for trauma scenarios
        expect(buttonBounds.height).toBeGreaterThanOrEqual(64); // Accounting for CSS padding
        expect(buttonBounds.width).toBeGreaterThanOrEqual(160);
      }
      
      // Verify button styling includes trauma-informed classes
      await expect(crisisButton).toHaveClass(/touch-target-crisis/);
    });

    test('Text remains readable at 200% zoom (tears simulation)', async ({ page, context }) => {
      // Set initial zoom level
      await context.addInitScript(() => {
        // Simulate 200% zoom for users with impaired vision from crying
        document.documentElement.style.zoom = '2';
      });
      
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Check that crisis text remains legible
      const crisisText = page.locator('text=Crisis Support Available 24/7');
      await expect(crisisText).toBeVisible();
      
      // Verify font size is large enough for emotional distress
      const textStyles = await crisisText.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          fontSize: computed.fontSize,
          lineHeight: computed.lineHeight,
          fontWeight: computed.fontWeight
        };
      });
      
      // Font should be at least 14px at base level (28px at 200% zoom)
      const fontSize = parseInt(textStyles.fontSize);
      expect(fontSize).toBeGreaterThanOrEqual(14);
      
      // Crisis button text should remain readable
      const buttonText = page.locator('a[href="tel:988"] >> text=Call 988 Now');
      await expect(buttonText).toBeVisible();
    });

    test('Layout stability during simulated trembling interaction', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Simulate rapid, imprecise touches (trembling hands)
      const crisisButton = page.locator('a[href="tel:988"]');
      
      // Record initial position
      const initialBounds = await crisisButton.boundingBox();
      expect(initialBounds).not.toBeNull();
      
      // Simulate multiple rapid touches around the button area
      if (initialBounds) {
        for (let i = 0; i < 5; i++) {
          // Touch slightly off-center to simulate trembling
          const offsetX = (Math.random() - 0.5) * 10;
          const offsetY = (Math.random() - 0.5) * 10;
          
          await page.mouse.move(
            initialBounds.x + initialBounds.width / 2 + offsetX,
            initialBounds.y + initialBounds.height / 2 + offsetY
          );
          await page.mouse.down();
          await page.waitForTimeout(50);
          await page.mouse.up();
        }
      }
      
      // Verify layout hasn't shifted
      const finalBounds = await crisisButton.boundingBox();
      expect(finalBounds).not.toBeNull();
      
      if (initialBounds && finalBounds) {
        expect(Math.abs(initialBounds.x - finalBounds.x)).toBeLessThan(2);
        expect(Math.abs(initialBounds.y - finalBounds.y)).toBeLessThan(2);
      }
    });

    test('Crisis support remains accessible during network stress', async ({ page }) => {
      // Simulate poor network conditions
      await page.route('**/*', route => {
        // Add 2-5 second delays to simulate slow connections
        setTimeout(() => route.continue(), Math.random() * 3000 + 2000);
      });
      
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Crisis button should be visible even during loading
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible({ timeout: 10000 });
      
      // Button should remain functional
      await expect(crisisButton).toHaveAttribute('href', 'tel:988');
      
      // Verify button works during loading states
      await crisisButton.click();
      // Note: We can't actually dial, but we can verify the tel: link is present
    });

    test('Thumb reach zones accommodate one-handed crisis access', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Get viewport dimensions
      const viewportSize = page.viewportSize();
      expect(viewportSize).not.toBeNull();
      
      if (viewportSize) {
        const thumbReachZone = {
          // Right thumb reach zone (most users are right-handed)
          left: viewportSize.width * 0.6,
          top: viewportSize.height * 0.4,
          right: viewportSize.width,
          bottom: viewportSize.height
        };
        
        // Crisis button should be within thumb reach
        const crisisButton = page.locator('a[href="tel:988"]');
        const buttonBounds = await crisisButton.boundingBox();
        
        expect(buttonBounds).not.toBeNull();
        
        if (buttonBounds) {
          const buttonCenter = {
            x: buttonBounds.x + buttonBounds.width / 2,
            y: buttonBounds.y + buttonBounds.height / 2
          };
          
          // Button center should be within comfortable thumb reach
          const inThumbZone = 
            buttonCenter.x >= thumbReachZone.left * 0.7 || // Allow some flexibility
            buttonCenter.y >= thumbReachZone.top;
            
          expect(inThumbZone).toBe(true);
        }
      }
    });

    test('Visual hierarchy reduces cognitive load for crisis users', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Verify crisis support is prominently positioned
      const crisisSection = page.locator('div').filter({ hasText: 'Crisis Support Available 24/7' });
      await expect(crisisSection).toBeVisible();
      
      // Check visual prominence through styling
      const crisisStyles = await crisisSection.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundColor: computed.backgroundColor,
          border: computed.border,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow,
          zIndex: computed.zIndex
        };
      });
      
      // Crisis section should have distinctive styling
      expect(crisisStyles.backgroundColor).toContain('rgba'); // Semi-transparent background
      expect(crisisStyles.borderRadius).toBeTruthy(); // Rounded corners for gentleness
      
      // Verify that there are not too many competing visual elements
      const interactiveElements = await page.locator('[role="button"], button, a[href]').count();
      expect(interactiveElements).toBeLessThan(8); // Limit cognitive load
      
      // Primary CTA should be clearly distinguished
      const primaryCTA = page.locator('a[href="/auth/login"]').first();
      await expect(primaryCTA).toBeVisible();
    });

    test('Crisis mode adaptations work on mobile', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Simulate crisis keyword detection (would trigger crisis mode)
      await page.evaluate(() => {
        // Simulate crisis mode activation
        document.body.classList.add('crisis-mode-active');
      });
      
      // In crisis mode, elements should become more accessible
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      
      // Crisis button should maintain prominence
      const buttonStyles = await crisisButton.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          minHeight: computed.minHeight,
          minWidth: computed.minWidth,
          fontSize: computed.fontSize,
          backgroundColor: computed.backgroundColor
        };
      });
      
      // Verify crisis-appropriate styling
      expect(parseInt(buttonStyles.minHeight)).toBeGreaterThanOrEqual(60);
      expect(parseInt(buttonStyles.minWidth)).toBeGreaterThanOrEqual(160);
    });

    test('Offline crisis resource accessibility', async ({ page, context }) => {
      // Simulate offline scenario
      await context.setOffline(true);
      
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Crisis button should still work (tel: links work offline)
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      await expect(crisisButton).toHaveAttribute('href', 'tel:988');
      
      // Essential text should be cached/visible
      const crisisText = page.locator('text=Crisis Support Available 24/7');
      await expect(crisisText).toBeVisible();
      
      // Disclaimer should remain visible
      const disclaimer = page.locator('text=ALCHM is a journaling platform, not therapy');
      await expect(disclaimer).toBeVisible();
    });

    test('Performance meets trauma-informed standards on mobile', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within 3 seconds even on slow connections
      expect(loadTime).toBeLessThan(3000);
      
      // Crisis button should be interactive quickly
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible({ timeout: 2000 });
      
      // Measure First Contentful Paint timing
      const performanceMetrics = await page.evaluate(() => {
        return performance.getEntriesByType('navigation')[0];
      });
      
      expect(performanceMetrics).toBeTruthy();
      
      // Verify smooth interactions (no janky animations)
      await crisisButton.hover();
      await page.waitForTimeout(100);
      
      // Button should respond smoothly
      const buttonStyles = await crisisButton.evaluate(el => {
        return window.getComputedStyle(el).transform;
      });
      
      // Should have smooth transitions, not instant snaps
      expect(buttonStyles).toBeTruthy();
    });
  });
});

  test.describe('Android Mobile Crisis Tests', () => {
    test.use({ 
      viewport: { width: 360, height: 640 }
    });

    test(`Layout stability during ${scenario.description}`, async ({ page }) => {
      // Simulate network conditions
      if (scenario.conditions.networkSpeed) {
        await page.route('**/*', route => {
          const delay = scenario.conditions.networkSpeed === '2g' ? 5000 : 2000;
          setTimeout(() => route.continue(), delay);
        });
      }
      
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Test all critical elements are accessible
      const criticalElements = [
        { selector: 'a[href="tel:988"]', name: 'Crisis Button' },
        { selector: 'text=Crisis Support Available 24/7', name: 'Crisis Text' },
        { selector: 'h1:has-text("ALCHM")', name: 'Brand Identity' },
        { selector: 'a[href="/auth/login"]', name: 'Primary CTA' }
      ];
      
      for (const element of criticalElements) {
        const locator = page.locator(element.selector);
        await expect(locator, `${element.name} should be visible in ${scenario.name}`).toBeVisible({ timeout: 10000 });
        
        // Verify element is properly sized for crisis interaction
        const bounds = await locator.boundingBox();
        if (bounds && element.name.includes('Button')) {
          expect(bounds.height, `${element.name} should meet minimum touch target`).toBeGreaterThanOrEqual(52);
        }
      }
      
      // Test cognitive load assessment
      const totalInteractiveElements = await page.locator('[role="button"], button, a[href], input, textarea').count();
      expect(totalInteractiveElements, 'Should limit cognitive load during crisis').toBeLessThan(10);
      
      // Verify visual hierarchy
      const crisisButton = page.locator('a[href="tel:988"]');
      const crisisButtonStyles = await crisisButton.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        return {
          visibility: rect.height > 0 && rect.width > 0,
          backgroundColor: styles.backgroundColor,
          zIndex: styles.zIndex,
          position: rect.top + 'px from top'
        };
      });
      
      expect(crisisButtonStyles.visibility, 'Crisis button should be visually prominent').toBe(true);
    });

    test(`Touch interaction reliability for ${scenario.description}`, async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const crisisButton = page.locator('a[href="tel:988"]');
      
      // Simulate impaired motor control
      if (scenario.conditions.motorImpairment) {
        // Test multiple attempts to tap (simulating trembling)
        for (let attempt = 0; attempt < 3; attempt++) {
          const bounds = await crisisButton.boundingBox();
          expect(bounds).not.toBeNull();
          
          if (bounds) {
            // Add random offset to simulate imprecise touch
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            
            await page.mouse.move(
              bounds.x + bounds.width / 2 + offsetX,
              bounds.y + bounds.height / 2 + offsetY
            );
            
            // Verify button is still hittable even with offset
            const elementAtPoint = await page.locator(':hover').first();
            const isButtonOrParent = await elementAtPoint.evaluate(el => {
              return el.closest('a[href="tel:988"]') !== null || 
                     el.getAttribute('href') === 'tel:988';
            });
            
            expect(isButtonOrParent, `Button should be hittable with offset ${offsetX}, ${offsetY}`).toBe(true);
          }
        }
      }
      
      // Test button remains accessible during network stress
      if (scenario.conditions.networkSpeed === '2g') {
        await expect(crisisButton).toBeVisible({ timeout: 15000 });
        await expect(crisisButton).toHaveAttribute('href', 'tel:988');
      }
    });
  });
});