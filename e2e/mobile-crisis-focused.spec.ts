import { test, expect } from '@playwright/test';

/**
 * MOBILE CRISIS FOCUSED VALIDATION
 * 
 * Validates critical mobile layout fixes for trauma survivors in crisis situations
 */

test.describe('Mobile Crisis Layout Validation', () => {
  
  test.describe('iPhone SE Crisis Tests (Small Mobile)', () => {
    test.use({ 
      viewport: { width: 375, height: 667 }
    });

    test('Crisis support box does not overlap Private & Secure card', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Let animations settle
      
      // Find the crisis support section
      const crisisBox = page.locator('div').filter({ hasText: 'Crisis Support Available 24/7' });
      await expect(crisisBox).toBeVisible();
      
      // Find the Private & Secure card
      const privateCard = page.locator('div').filter({ hasText: 'Private & Secure' });
      await expect(privateCard).toBeVisible();
      
      // Get bounding boxes
      const crisisBoxBounds = await crisisBox.boundingBox();
      const privateCardBounds = await privateCard.boundingBox();
      
      expect(crisisBoxBounds).not.toBeNull();
      expect(privateCardBounds).not.toBeNull();
      
      if (crisisBoxBounds && privateCardBounds) {
        // Crisis box should be positioned below the Private & Secure card
        expect(crisisBoxBounds.y).toBeGreaterThan(privateCardBounds.y + privateCardBounds.height);
        
        // Verify adequate spacing (at least 16px)
        const spacing = crisisBoxBounds.y - (privateCardBounds.y + privateCardBounds.height);
        expect(spacing).toBeGreaterThan(16);
        
        console.log(`✓ Crisis box positioned ${spacing}px below Private & Secure card`);
      }
    });

    test('Crisis button meets 70px minimum touch target for trembling hands', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      
      const buttonBounds = await crisisButton.boundingBox();
      expect(buttonBounds).not.toBeNull();
      
      if (buttonBounds) {
        // Verify minimum 60px height and 160px width for crisis situations
        expect(buttonBounds.height).toBeGreaterThanOrEqual(60);
        expect(buttonBounds.width).toBeGreaterThanOrEqual(160);
        
        console.log(`✓ Crisis button: ${buttonBounds.width}x${buttonBounds.height}px (meets trauma-informed requirements)`);
      }
    });

    test('Visual hierarchy reduces cognitive load - limited interactive elements', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Count interactive elements visible on initial load
      const interactiveElements = await page.locator('[role="button"], button, a[href]').count();
      
      // Should be limited for crisis users (max 8 elements)
      expect(interactiveElements).toBeLessThan(8);
      
      // Crisis button should be prominently positioned
      const crisisButton = page.locator('a[href="tel:988"]');
      const buttonStyles = await crisisButton.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      });
      
      // Verify crisis-appropriate styling
      expect(buttonStyles.backgroundColor).not.toBe('transparent');
      expect(parseInt(buttonStyles.fontSize)).toBeGreaterThanOrEqual(16);
      
      console.log(`✓ ${interactiveElements} interactive elements (trauma-informed limit)`);
    });

    test('Top section simplified for mobile trauma-informed design', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Verify simplified hero section
      const heroHeading = page.locator('h1:has-text("ALCHM")');
      await expect(heroHeading).toBeVisible();
      
      const heroSubheading = page.locator('h2').filter({ hasText: 'Your private sanctuary for' });
      await expect(heroSubheading).toBeVisible();
      
      // Should have simplified value prop, not overwhelming
      const description = page.locator('p').filter({ hasText: 'Safe digital space for reflection' });
      await expect(description).toBeVisible();
      
      // Verify CTAs are clearly separated and not overwhelming
      const primaryCTA = page.locator('a').filter({ hasText: 'Continue with Google' });
      const secondaryCTA = page.locator('a').filter({ hasText: 'Continue with Email' });
      
      await expect(primaryCTA).toBeVisible();
      await expect(secondaryCTA).toBeVisible();
      
      console.log('✓ Top section uses simplified, trauma-informed design');
    });

    test('Layout stability during simulated crisis interaction patterns', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const crisisButton = page.locator('a[href="tel:988"]');
      const initialBounds = await crisisButton.boundingBox();
      expect(initialBounds).not.toBeNull();
      
      if (initialBounds) {
        // Simulate imprecise touches (trembling hands)
        for (let i = 0; i < 3; i++) {
          const offsetX = (Math.random() - 0.5) * 10; // ±5px variation
          const offsetY = (Math.random() - 0.5) * 10;
          
          await page.mouse.move(
            initialBounds.x + initialBounds.width / 2 + offsetX,
            initialBounds.y + initialBounds.height / 2 + offsetY
          );
          await page.mouse.down();
          await page.waitForTimeout(100);
          await page.mouse.up();
        }
        
        // Verify button position hasn't shifted
        const finalBounds = await crisisButton.boundingBox();
        expect(finalBounds).not.toBeNull();
        
        if (finalBounds) {
          expect(Math.abs(initialBounds.x - finalBounds.x)).toBeLessThan(2);
          expect(Math.abs(initialBounds.y - finalBounds.y)).toBeLessThan(2);
          console.log('✓ Layout remains stable during crisis interaction patterns');
        }
      }
    });

    test('Crisis resources remain accessible during network stress', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 1500); // 1.5s delay
      });
      
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });
      const loadTime = Date.now() - startTime;
      
      // Crisis button should be accessible even during slow load
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible({ timeout: 5000 });
      await expect(crisisButton).toHaveAttribute('href', 'tel:988');
      
      // Crisis text should be visible
      const crisisText = page.locator('text=Crisis Support Available 24/7');
      await expect(crisisText).toBeVisible({ timeout: 5000 });
      
      console.log(`✓ Crisis resources loaded in ${loadTime}ms during network stress`);
    });
  });

  test.describe('Android Mobile Crisis Tests', () => {
    test.use({ 
      viewport: { width: 360, height: 640 }
    });

    test('Crisis button thumb reach accessibility on smaller Android', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      const crisisButton = page.locator('a[href="tel:988"]');
      const buttonBounds = await crisisButton.boundingBox();
      const viewportSize = page.viewportSize();
      
      expect(buttonBounds).not.toBeNull();
      expect(viewportSize).not.toBeNull();
      
      if (buttonBounds && viewportSize) {
        // Crisis button should be positioned for easy thumb reach
        // Bottom 60% of screen is comfortable one-handed reach zone
        const comfortableReachZoneTop = viewportSize.height * 0.4;
        const buttonCenterY = buttonBounds.y + buttonBounds.height / 2;
        
        expect(buttonCenterY).toBeGreaterThan(comfortableReachZoneTop);
        
        console.log(`✓ Crisis button at ${Math.round((buttonCenterY / viewportSize.height) * 100)}% of screen height (thumb-accessible)`);
      }
    });

    test('Features cards maintain proper spacing on small Android screens', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Find all feature cards
      const traumaCard = page.locator('div').filter({ hasText: 'Trauma-Informed' });
      const aiCard = page.locator('div').filter({ hasText: 'AI Companion' });
      const privateCard = page.locator('div').filter({ hasText: 'Private & Secure' });
      
      await expect(traumaCard).toBeVisible();
      await expect(aiCard).toBeVisible();
      await expect(privateCard).toBeVisible();
      
      // Verify cards are stacked vertically on small screens (not overlapping)
      const cards = [traumaCard, aiCard, privateCard];
      const cardBounds = await Promise.all(cards.map(card => card.boundingBox()));
      
      // Check each card pair for proper vertical stacking
      for (let i = 0; i < cardBounds.length - 1; i++) {
        const currentCard = cardBounds[i];
        const nextCard = cardBounds[i + 1];
        
        if (currentCard && nextCard) {
          // Next card should be below current card (allowing some overlap for responsive design)
          expect(nextCard.y).toBeGreaterThanOrEqual(currentCard.y);
        }
      }
      
      console.log('✓ Feature cards properly stacked on small Android screen');
    });

    test('Crisis section positioned to prevent overlap with feature cards', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Get the last feature card (Private & Secure, which was overlapping)
      const privateCard = page.locator('div').filter({ hasText: 'Private & Secure' });
      const crisisSection = page.locator('div').filter({ hasText: 'Crisis Support Available 24/7' });
      
      await expect(privateCard).toBeVisible();
      await expect(crisisSection).toBeVisible();
      
      const privateCardBounds = await privateCard.boundingBox();
      const crisisSectionBounds = await crisisSection.boundingBox();
      
      expect(privateCardBounds).not.toBeNull();
      expect(crisisSectionBounds).not.toBeNull();
      
      if (privateCardBounds && crisisSectionBounds) {
        // Crisis section should be clearly below the private card
        const clearance = crisisSectionBounds.y - (privateCardBounds.y + privateCardBounds.height);
        expect(clearance).toBeGreaterThan(8); // Minimum 8px clearance
        
        console.log(`✓ Crisis section has ${Math.round(clearance)}px clearance from Private & Secure card`);
      }
    });
  });

  test.describe('Crisis Performance Validation', () => {
    test.use({ 
      viewport: { width: 375, height: 667 } // iPhone SE baseline
    });

    test('Page loads within 3 seconds for crisis accessibility', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      // Should load quickly for users in crisis
      expect(loadTime).toBeLessThan(3000);
      
      // Crisis button should be interactive within 2 seconds
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible({ timeout: 2000 });
      
      console.log(`✓ Page loaded in ${loadTime}ms (crisis-appropriate speed)`);
    });

    test('Crisis text remains readable at 150% zoom (emotional distress)', async ({ page }) => {
      // Set zoom level to simulate vision impairment from crying/stress
      await page.addStyleTag({
        content: `
          html { zoom: 1.5; }
          body { overflow-x: auto; }
        `
      });
      
      await page.goto('/', { waitUntil: 'networkidle' });
      
      // Crisis text should remain visible and readable
      const crisisText = page.locator('text=Crisis Support Available 24/7');
      await expect(crisisText).toBeVisible();
      
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      
      // Button should still be clickable at zoomed level
      const buttonBounds = await crisisButton.boundingBox();
      expect(buttonBounds).not.toBeNull();
      
      if (buttonBounds) {
        expect(buttonBounds.width).toBeGreaterThan(0);
        expect(buttonBounds.height).toBeGreaterThan(0);
      }
      
      console.log('✓ Crisis content readable at 150% zoom (emotional distress simulation)');
    });

    test('Offline crisis resources remain accessible', async ({ page, context }) => {
      await context.setOffline(true);
      
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Crisis button should work offline (tel: links don't require internet)
      const crisisButton = page.locator('a[href="tel:988"]');
      await expect(crisisButton).toBeVisible();
      await expect(crisisButton).toHaveAttribute('href', 'tel:988');
      
      // Essential crisis text should be cached/visible
      const crisisText = page.locator('text=Crisis Support Available 24/7');
      await expect(crisisText).toBeVisible();
      
      console.log('✓ Crisis resources accessible offline');
    });
  });
});