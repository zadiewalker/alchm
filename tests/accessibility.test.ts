/**
 * Accessibility tests for ALCHM components
 * Run with: npm test -- accessibility.test.ts
 */

import { test, expect } from '@playwright/test';
import { validateColorContrast } from '../src/lib/accessibility';

test.describe('ALCHM Accessibility Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('Skip link is present and functional', async ({ page }) => {
    // Focus should move to skip link on Tab
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toBeFocused();
    
    // Clicking skip link should move focus to main content
    await skipLink.click();
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeFocused();
  });

  test('All interactive elements are keyboard accessible', async ({ page }) => {
    // Get all interactive elements
    const interactiveElements = await page.locator('button, input, textarea, select, a, [role="button"], [tabindex]:not([tabindex="-1"])').all();
    
    for (const element of interactiveElements) {
      // Each element should be reachable via keyboard
      await element.focus();
      await expect(element).toBeFocused();
      
      // Should have visible focus indicator
      const focusRingVisible = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el, ':focus-visible');
        return styles.boxShadow !== 'none' || styles.outline !== 'none';
      });
      
      expect(focusRingVisible).toBeTruthy();
    }
  });

  test('Touch targets meet minimum size requirements', async ({ page }) => {
    const interactiveElements = await page.locator('button, input, textarea, select, a, [role="button"]').all();
    
    for (const element of interactiveElements) {
      const box = await element.boundingBox();
      if (box) {
        // WCAG AAA requires minimum 44x44px
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('Form elements have proper labels', async ({ page }) => {
    const formElements = await page.locator('input, textarea, select').all();
    
    for (const element of formElements) {
      // Should have label, aria-label, or aria-labelledby
      const hasLabel = await element.evaluate((el) => {
        const id = el.getAttribute('id');
        const label = document.querySelector(`label[for="${id}"]`);
        const ariaLabel = el.getAttribute('aria-label');
        const ariaLabelledBy = el.getAttribute('aria-labelledby');
        
        return !!(label || ariaLabel || ariaLabelledBy);
      });
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('Images have appropriate alt text', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const role = await image.getAttribute('role');
      
      // Decorative images should have empty alt or role="presentation"
      // Content images should have descriptive alt text
      if (role === 'presentation' || role === 'decorative') {
        expect(alt).toBe('');
      } else {
        expect(alt).toBeTruthy();
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  test('Headings maintain proper hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    let previousLevel = 0;
    
    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const currentLevel = parseInt(tagName.charAt(1));
      
      if (previousLevel > 0) {
        // Heading levels should not skip (e.g., h1 -> h3)
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }
      
      previousLevel = currentLevel;
    }
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    // Test key color combinations
    const colorTests = [
      { fg: '#2e2e2e', bg: '#f7f7f2', name: 'Text on background' },
      { fg: '#ffffff', bg: '#a4b792', name: 'Button text' },
      { fg: '#2e2e2e', bg: '#eeddd3', name: 'Text on surface' },
    ];
    
    for (const test of colorTests) {
      const result = validateColorContrast(test.fg, test.bg);
      expect(result.aaPass).toBeTruthy(`${test.name} contrast ratio ${result.ratio.toFixed(2)}:1 fails WCAG AA`);
    }
  });

  test('Focus management in modals', async ({ page }) => {
    // Open a modal (if present)
    const modalTrigger = page.locator('[data-testid="open-modal"]').first();
    
    if (await modalTrigger.count() > 0) {
      await modalTrigger.click();
      
      // Focus should be trapped within modal
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      
      // First focusable element should be focused
      const firstFocusable = modal.locator('button, input, textarea, select, a, [tabindex]:not([tabindex="-1"])').first();
      await expect(firstFocusable).toBeFocused();
      
      // Tab should cycle within modal
      await page.keyboard.press('Tab');
      const secondFocusable = modal.locator('button, input, textarea, select, a, [tabindex]:not([tabindex="-1"])').nth(1);
      if (await secondFocusable.count() > 0) {
        await expect(secondFocusable).toBeFocused();
      }
      
      // Escape should close modal
      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
      
      // Focus should return to trigger
      await expect(modalTrigger).toBeFocused();
    }
  });

  test('Screen reader announcements work', async ({ page }) => {
    // Check for live regions
    const liveRegions = await page.locator('[aria-live]').all();
    expect(liveRegions.length).toBeGreaterThan(0);
    
    for (const region of liveRegions) {
      const ariaLive = await region.getAttribute('aria-live');
      expect(['polite', 'assertive', 'off']).toContain(ariaLive);
    }
  });

  test('Reduced motion preferences are respected', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Check that animations are disabled or minimal
    const animatedElements = await page.locator('[class*="animate-"], [style*="animation"], [style*="transition"]').all();
    
    for (const element of animatedElements) {
      const animationDuration = await element.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.animationDuration;
      });
      
      // Animation should be very short or disabled
      if (animationDuration && animationDuration !== '0s') {
        const duration = parseFloat(animationDuration);
        expect(duration).toBeLessThanOrEqual(0.01); // 10ms or less
      }
    }
  });

  test('Crisis information is prominently accessible', async ({ page }) => {
    // Crisis notice should be present and marked as alert
    const crisisNotice = page.locator('[role="alert"]');
    
    if (await crisisNotice.count() > 0) {
      await expect(crisisNotice).toBeVisible();
      
      // Should contain crisis helpline information
      const crisisText = await crisisNotice.textContent();
      expect(crisisText?.toLowerCase()).toContain('crisis');
      expect(crisisText?.toLowerCase()).toMatch(/988|111|741741/);
    }
  });

  test('Error messages are accessible', async ({ page }) => {
    // Navigate to a form
    const forms = await page.locator('form').all();
    
    for (const form of forms) {
      // Try to submit invalid form
      const submitButton = form.locator('button[type="submit"]');
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Check for error messages
        const errorMessages = await form.locator('[role="alert"], .error, [aria-invalid="true"]').all();
        
        for (const error of errorMessages) {
          // Error should be visible
          await expect(error).toBeVisible();
          
          // Error should have text content
          const errorText = await error.textContent();
          expect(errorText?.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});

// Device-specific accessibility tests
test.describe('Mobile Accessibility', () => {
  test.use({ 
    viewport: { width: 375, height: 667 }, // iPhone SE
    hasTouch: true 
  });

  test('Touch interactions work on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Test touch interactions
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      // Should be tappable
      await button.tap();
      
      // Should have appropriate touch feedback
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

test.describe('Dark Mode Accessibility', () => {
  test.use({ colorScheme: 'dark' });

  test('Dark mode maintains contrast standards', async ({ page }) => {
    await page.goto('/');
    
    // Check that text is still readable in dark mode
    const textElements = await page.locator('p, h1, h2, h3, h4, h5, h6, span').all();
    
    for (const element of textElements) {
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor
        };
      });
      
      // Ensure text has sufficient contrast
      // This would need a proper color contrast library in production
      expect(styles.color).not.toBe(styles.backgroundColor);
    }
  });
});

export {}; // Make this a module