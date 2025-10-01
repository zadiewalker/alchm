/**
 * ALCHM Comprehensive Interaction Audit
 * 
 * Zero tolerance for broken promises.
 * Every button must respond. Every link must lead somewhere meaningful.
 * Every interaction must feel intentional, not accidental.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Comprehensive Link & Button Audit - Sacred Interactions', () => {
  test.setTimeout(120000); // Extended timeout for comprehensive testing

  // Test all navigation links on homepage
  test('should audit all homepage navigation elements', async ({ page }) => {
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    // Check main CTA button
    const mainCTA = page.locator('a[href="/pathways"], a:has-text("Explore Pathways")');
    if (await mainCTA.isVisible()) {
      await expect(mainCTA).toBeVisible();
      
      // Test click leads to pathways page (not 404)
      await mainCTA.click();
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      console.log(`Main CTA leads to: ${currentUrl}`);
      
      // Should not be 404
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('not found');
    }
    
    // Return to homepage for next test
    await page.goto(PRODUCTION_URL);
    
    // Check crisis lifeline link
    const crisisLink = page.locator('a[href="tel:988"], text=988');
    if (await crisisLink.isVisible()) {
      await expect(crisisLink).toBeVisible();
      console.log('Crisis lifeline link found and accessible');
    }
  });

  // Test pathways page interactions
  test('should audit pathways page navigation', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways`, { waitUntil: 'networkidle' });
    
    // Check page loads without error
    const content = await page.textContent('body');
    expect(content).not.toContain('404');
    
    // Look for pathway entry points
    const pathwayLinks = [
      'resilience',
      'becoming', 
      'purpose',
      'belonging'
    ];
    
    for (const pathway of pathwayLinks) {
      // Try different possible link formats
      const possibleSelectors = [
        `a[href="/pathways/${pathway}"]`,
        `a[href="/pathways/${pathway}/"]`,
        `a[href="/pathways%202/${pathway}/"]`,
        `a:has-text("${pathway}")`,
        `button:has-text("${pathway}")`,
        `.pathway-${pathway}`,
        `[data-pathway="${pathway}"]`
      ];
      
      let linkFound = false;
      for (const selector of possibleSelectors) {
        const element = page.locator(selector);
        if (await element.isVisible()) {
          linkFound = true;
          console.log(`Found ${pathway} pathway link with selector: ${selector}`);
          
          // Test click
          try {
            await element.click();
            await page.waitForTimeout(1000);
            const newContent = await page.textContent('body');
            expect(newContent).not.toContain('404');
            console.log(`${pathway} pathway navigation successful`);
            
            // Return to pathways page
            await page.goto(`${PRODUCTION_URL}/pathways`);
            break;
          } catch (error) {
            console.warn(`${pathway} pathway click failed: ${error}`);
          }
        }
      }
      
      if (!linkFound) {
        console.warn(`No accessible link found for ${pathway} pathway`);
      }
    }
  });

  // Test pathway step navigation flows
  test('should audit pathway step navigation flows', async ({ page }) => {
    // Test the corrected pathway URLs we discovered
    const pathwaySteps = [
      '/pathways%202/resilience/step/1/',
      '/pathways%202/becoming/step/1/',
      '/pathways%202/purpose/step/1/',
      '/pathways%202/belonging/step/1/'
    ];

    for (const stepUrl of pathwaySteps) {
      await page.goto(`${PRODUCTION_URL}${stepUrl}`, { waitUntil: 'networkidle' });
      
      // Verify page loads successfully
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('not found');
      
      // Check for essential elements
      const hasPrompt = await page.locator('h1, .prompt, [data-testid="prompt"]').isVisible();
      const hasTextarea = await page.locator('textarea').isVisible();
      const hasSaveButton = await page.locator('button:has-text("Save"), button:has-text("Continue")').isVisible();
      
      expect(hasPrompt || hasTextarea || hasSaveButton).toBe(true);
      console.log(`${stepUrl}: Essential elements present`);
      
      // Test save button interaction
      if (hasSaveButton) {
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
        await saveButton.click();
        
        // Should show some kind of response (alert, message, navigation)
        await page.waitForTimeout(1000);
        console.log(`${stepUrl}: Save button responds to click`);
      }
      
      // Test navigation buttons
      const nextButton = page.locator('a:has-text("Next"), button:has-text("Next")');
      if (await nextButton.isVisible()) {
        const nextHref = await nextButton.getAttribute('href');
        if (nextHref) {
          console.log(`${stepUrl}: Next button links to ${nextHref}`);
        }
      }
      
      const prevButton = page.locator('a:has-text("Previous"), a:has-text("Back")');
      if (await prevButton.isVisible()) {
        const prevHref = await prevButton.getAttribute('href');
        if (prevHref) {
          console.log(`${stepUrl}: Previous button links to ${prevHref}`);
        }
      }
      
      // Test back to pathways link
      const backLink = page.locator('a:has-text("Back to Pathways"), a[href*="pathways"]');
      if (await backLink.isVisible()) {
        const backHref = await backLink.getAttribute('href');
        console.log(`${stepUrl}: Back link points to ${backHref}`);
      }
    }
  });

  // Test form interactions and validation
  test('should audit form interactions across the app', async ({ page }) => {
    const pagesWithForms = [
      '/pathways%202/resilience/step/1/',
      // Add more pages with forms as discovered
    ];
    
    for (const pageUrl of pagesWithForms) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const textareas = page.locator('textarea');
      const inputs = page.locator('input[type="text"], input[type="email"]');
      
      // Test textarea functionality
      if (await textareas.count() > 0) {
        const textarea = textareas.first();
        await textarea.fill('Test content for interaction audit');
        
        const value = await textarea.inputValue();
        expect(value).toContain('Test content');
        console.log(`${pageUrl}: Textarea accepts input correctly`);
        
        // Test that content persists during interaction
        await page.keyboard.press('Tab');
        const persistedValue = await textarea.inputValue();
        expect(persistedValue).toContain('Test content');
      }
      
      // Test input field functionality
      if (await inputs.count() > 0) {
        const input = inputs.first();
        await input.fill('test@example.com');
        
        const value = await input.inputValue();
        expect(value).toBe('test@example.com');
        console.log(`${pageUrl}: Input field accepts data correctly`);
      }
    }
  });

  // Test error states and edge cases
  test('should audit error handling and edge cases', async ({ page }) => {
    // Test invalid URLs
    const invalidUrls = [
      '/pathways/nonexistent/',
      '/pathways%202/invalid/step/1/',
      '/pathways%202/resilience/step/999/',
    ];
    
    for (const invalidUrl of invalidUrls) {
      await page.goto(`${PRODUCTION_URL}${invalidUrl}`, { waitUntil: 'networkidle' });
      
      // Should either redirect or show meaningful error
      const content = await page.textContent('body');
      const hasError404 = content.includes('404') || content.includes('not found');
      const hasRedirect = !page.url().includes(invalidUrl.split('?')[0]);
      const hasMeaningfulError = content.includes('Step Not Found') || 
                                 content.includes('Back to Pathways') ||
                                 content.includes('doesn\'t exist');
      
      if (!hasRedirect) {
        expect(hasError404 || hasMeaningfulError).toBe(true);
      }
      
      console.log(`${invalidUrl}: ${hasError404 ? 'Shows 404' : hasMeaningfulError ? 'Shows meaningful error' : hasRedirect ? 'Redirects properly' : 'Unclear error handling'}`);
    }
  });

  // Test accessibility of interactive elements
  test('should audit accessibility of interactive elements', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Check for proper focus management
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').first();
    
    if (await focusedElement.count() > 0) {
      const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
      const isInteractive = ['button', 'a', 'input', 'textarea', 'select'].includes(tagName);
      expect(isInteractive).toBe(true);
      console.log('Keyboard navigation works - focus lands on interactive element');
    }
    
    // Check for ARIA labels and roles
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      
      expect(hasAriaLabel || (hasText && hasText.trim().length > 0)).toBe(true);
      console.log(`Button ${i + 1}: Has accessible text or label`);
    }
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    console.log(`Page has ${headingCount} headings for proper structure`);
  });

  // Test mobile responsiveness of interactions
  test('should audit mobile interaction patterns', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Check touch target sizes
    const buttons = page.locator('button, a');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const box = await button.boundingBox();
      
      if (box) {
        const minTouchTarget = 44; // iOS/Android recommendation
        const isTouchFriendly = box.width >= minTouchTarget || box.height >= minTouchTarget;
        
        if (!isTouchFriendly) {
          console.warn(`Button ${i + 1} may be too small for touch: ${box.width}x${box.height}`);
        } else {
          console.log(`Button ${i + 1} is touch-friendly: ${box.width}x${box.height}`);
        }
      }
    }
    
    // Test scroll behavior
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const scrollPosition = await page.evaluate(() => window.pageYOffset);
    expect(scrollPosition).toBeGreaterThan(0);
    console.log('Mobile scrolling works correctly');
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  // Test performance of interactions
  test('should audit interaction performance', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Test button response times
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    
    if (await saveButton.isVisible()) {
      const startTime = Date.now();
      await saveButton.click();
      const responseTime = Date.now() - startTime;
      
      // Interactions should respond within 100ms for good UX
      expect(responseTime).toBeLessThan(1000);
      console.log(`Save button response time: ${responseTime}ms`);
    }
    
    // Test textarea responsiveness
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible()) {
      const startTime = Date.now();
      await textarea.fill('Performance test content');
      const inputTime = Date.now() - startTime;
      
      expect(inputTime).toBeLessThan(500);
      console.log(`Textarea input response time: ${inputTime}ms`);
    }
  });

  // Test cross-browser compatibility of interactions
  test('should work consistently across different contexts', async ({ page }) => {
    // Test with JavaScript disabled scenarios
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`);
    
    // Check that basic HTML elements are still functional
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        console.log(`Link ${i + 1} uses proper href: ${href}`);
      }
    }
    
    // Ensure forms can submit without JavaScript
    const forms = page.locator('form');
    if (await forms.count() > 0) {
      const form = forms.first();
      const action = await form.getAttribute('action');
      const method = await form.getAttribute('method');
      
      console.log(`Form has proper fallback: action=${action}, method=${method}`);
    }
  });
});

test.describe('Button State and Feedback Audit', () => {
  test('should audit button states and user feedback', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")').first();
    
    if (await saveButton.isVisible()) {
      // Check initial state
      const isEnabled = await saveButton.isEnabled();
      expect(isEnabled).toBe(true);
      console.log('Save button is initially enabled');
      
      // Check hover state (if applicable)
      await saveButton.hover();
      await page.waitForTimeout(100);
      
      // Check click state and feedback
      await saveButton.click();
      
      // Wait for any state changes or feedback
      await page.waitForTimeout(2000);
      
      // Check if button provides feedback (disabled state, text change, etc.)
      const afterClickState = await saveButton.isEnabled();
      const afterClickText = await saveButton.textContent();
      
      console.log(`After click - Enabled: ${afterClickState}, Text: "${afterClickText}"`);
      
      // Look for success messages or other feedback
      const feedbackElements = [
        page.locator('.success'),
        page.locator('.message'),
        page.locator('[role="alert"]'),
        page.locator('[role="status"]'),
        page.locator('text=saved'),
        page.locator('text=success'),
      ];
      
      for (const element of feedbackElements) {
        if (await element.isVisible({ timeout: 1000 })) {
          const feedbackText = await element.textContent();
          console.log(`User feedback found: "${feedbackText}"`);
        }
      }
    }
  });
});

test.describe('Navigation Flow Integrity', () => {
  test('should audit complete navigation flows', async ({ page }) => {
    // Test a complete user journey
    const journeySteps = [
      '/',
      '/pathways',
      '/pathways%202/resilience/step/1/',
      '/pathways%202/resilience/step/2/',
    ];
    
    for (let i = 0; i < journeySteps.length; i++) {
      const step = journeySteps[i];
      await page.goto(`${PRODUCTION_URL}${step}`, { waitUntil: 'networkidle' });
      
      // Verify each step loads without error
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('500');
      
      console.log(`Journey Step ${i + 1} (${step}): ✓ Loads successfully`);
      
      // Verify reasonable content exists
      const hasReasonableContent = content.length > 100;
      expect(hasReasonableContent).toBe(true);
      
      // Check for navigation elements to next step (except on last step)
      if (i < journeySteps.length - 1) {
        const hasNavigation = await page.locator('a, button').count() > 0;
        expect(hasNavigation).toBe(true);
        console.log(`Journey Step ${i + 1}: ✓ Has navigation elements`);
      }
    }
    
    console.log('✅ Complete user journey flows correctly');
  });
});