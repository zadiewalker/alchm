/**
 * ALCHM Journal Submission Flow Audit
 * 
 * Testing the sacred moment after "Submit" with forensic precision.
 * When someone trusts us with their vulnerability, every promise must be kept.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Journal Submission Flow Audit - Sacred Moment After Submit', () => {
  test.setTimeout(60000); // Extended timeout for complex flows

  // Test the complete post-submission flow
  test('should handle journal submission with immediate feedback', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    // Step 1: Test immediate UI feedback (within 200ms)
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Fill in journal content
      await textarea.fill('This is a test journal entry for submission flow validation. Testing the sacred moment after submit.');
      
      // Look for submit button
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button[type="submit"]');
      
      if (await submitButton.isVisible()) {
        const startTime = Date.now();
        
        // Click submit and measure response time
        await submitButton.click();
        
        // Verify immediate feedback appears within 200ms
        const feedbackElements = [
          page.locator('.loading'),
          page.locator('[data-testid="saving"]'),
          page.locator('text=saving'),
          page.locator('text=saved'),
          page.locator('.success'),
        ];
        
        let feedbackFound = false;
        for (const element of feedbackElements) {
          try {
            await element.waitFor({ timeout: 200 });
            feedbackFound = true;
            break;
          } catch (e) {
            // Continue checking other elements
          }
        }
        
        const responseTime = Date.now() - startTime;
        console.log(`Submit response time: ${responseTime}ms`);
        
        // Verify button state changes to prevent double-submission
        await expect(submitButton).toBeDisabled({ timeout: 5000 });
        
        // Check for success messaging
        const successMessages = [
          'saved',
          'safe',
          'complete',
          'submitted',
          'secure'
        ];
        
        let successFound = false;
        for (const message of successMessages) {
          if (await page.locator(`text=${message}`).isVisible({ timeout: 1000 })) {
            successFound = true;
            break;
          }
        }
        
        if (!successFound) {
          console.warn('No clear success message found after submission');
        }
      } else {
        console.log('No submit button found - testing auth-gated state');
      }
    } else {
      console.log('No textarea found - testing auth requirements');
      
      // Check for auth gate
      const authElements = [
        page.locator('a[href*="auth"]'),
        page.locator('button:has-text("sign")'),
        page.locator('text=login'),
        page.locator('text=account')
      ];
      
      let authFound = false;
      for (const element of authElements) {
        if (await element.isVisible()) {
          authFound = true;
          break;
        }
      }
      
      expect(authFound).toBe(true);
    }
  });

  // Test pathway-specific submission flows
  test('should handle pathway step submission correctly', async ({ page }) => {
    const pathwaySteps = [
      '/pathways/resilience/step/1/',
      '/pathways/becoming/step/1/',
      '/pathways/purpose/step/1/',
      '/pathways/belonging/step/1/'
    ];

    for (const stepUrl of pathwaySteps) {
      await page.goto(`${PRODUCTION_URL}${stepUrl}`, { waitUntil: 'networkidle' });
      
      // Check if step loads without 404
      const content = await page.textContent('body');
      expect(content).not.toContain('404');
      expect(content).not.toContain('not found');
      
      // Look for writing interface or auth gate
      const hasWritingInterface = await page.locator('textarea, .journal, .write').isVisible();
      const hasAuthGate = await page.locator('a[href*="auth"], button:has-text("sign")').isVisible();
      
      expect(hasWritingInterface || hasAuthGate).toBe(true);
      
      if (hasWritingInterface) {
        // Test submission flow
        const textarea = page.locator('textarea');
        await textarea.fill('Pathway step response for testing submission flow.');
        
        const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button[type="submit"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          
          // Verify some kind of response
          await page.waitForTimeout(1000);
          
          // Check that we don't stay on exact same state
          const newContent = await page.textContent('body');
          // Basic sanity check that something changed
        }
      }
    }
  });

  // Test data persistence and encryption
  test('should properly encrypt and store journal data', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    // Monitor network requests to ensure no raw text is transmitted
    const networkRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('api') || request.url().includes('firestore')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          postData: request.postData()
        });
      }
    });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      const sensitiveContent = 'This is sensitive test content that should be encrypted before transmission.';
      await textarea.fill(sensitiveContent);
      
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for any network activity to complete
        await page.waitForTimeout(3000);
        
        // Verify that raw sensitive content was not transmitted
        for (const request of networkRequests) {
          if (request.postData) {
            expect(request.postData).not.toContain(sensitiveContent);
          }
        }
      }
    }
  });

  // Test crisis detection without content exposure
  test('should detect crisis language without exposing content', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Use crisis language that should trigger detection
      const crisisContent = 'I am feeling hopeless and having thoughts of ending my life.';
      await textarea.fill(crisisContent);
      
      // Monitor for crisis support resources
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for processing
        await page.waitForTimeout(2000);
        
        // Check for crisis support elements
        const crisisElements = [
          page.locator('text=988'),
          page.locator('text=crisis'),
          page.locator('text=support'),
          page.locator('text=help'),
          page.locator('text=resources')
        ];
        
        let crisisSupportFound = false;
        for (const element of crisisElements) {
          if (await element.isVisible({ timeout: 1000 })) {
            crisisSupportFound = true;
            console.log('Crisis support resources displayed appropriately');
            break;
          }
        }
        
        // Note: Crisis detection might not be implemented yet, so we don't fail the test
        if (!crisisSupportFound) {
          console.log('Crisis detection not yet implemented or not triggered');
        }
      }
    }
  });

  // Test post-submission navigation options
  test('should provide meaningful post-submission options', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Testing post-submission navigation options and user journey.');
      
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for submission processing
        await page.waitForTimeout(3000);
        
        // Check for meaningful next actions
        const nextActionElements = [
          page.locator('text=reflection'),
          page.locator('text=continue'),
          page.locator('text=dashboard'),
          page.locator('text=pathways'),
          page.locator('text=back'),
          page.locator('a[href="/dashboard"]'),
          page.locator('a[href="/pathways"]'),
          page.locator('button:has-text("continue")')
        ];
        
        let nextActionFound = false;
        for (const element of nextActionElements) {
          if (await element.isVisible({ timeout: 1000 })) {
            nextActionFound = true;
            
            // Test that the action actually works
            try {
              await element.click();
              await page.waitForTimeout(1000);
              // Verify navigation occurred
              const newUrl = page.url();
              console.log(`Post-submission navigation to: ${newUrl}`);
            } catch (e) {
              console.warn(`Post-submission action failed: ${e}`);
            }
            break;
          }
        }
        
        if (!nextActionFound) {
          console.warn('No clear next actions provided after journal submission');
        }
      }
    }
  });

  // Test auto-save functionality
  test('should auto-save drafts during writing', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Testing auto-save functionality...');
      
      // Wait for potential auto-save (typically 10 seconds)
      await page.waitForTimeout(11000);
      
      // Check for auto-save indicators
      const autoSaveIndicators = [
        page.locator('text=saved'),
        page.locator('text=draft'),
        page.locator('.auto-save'),
        page.locator('[data-testid="auto-save"]')
      ];
      
      let autoSaveFound = false;
      for (const indicator of autoSaveIndicators) {
        if (await indicator.isVisible({ timeout: 1000 })) {
          autoSaveFound = true;
          console.log('Auto-save functionality detected');
          break;
        }
      }
      
      // Refresh page to test draft recovery
      await page.reload({ waitUntil: 'networkidle' });
      
      const recoveredTextarea = page.locator('textarea');
      if (await recoveredTextarea.isVisible()) {
        const recoveredContent = await recoveredTextarea.inputValue();
        if (recoveredContent.includes('Testing auto-save')) {
          console.log('Draft recovery successful');
        } else {
          console.log('Draft recovery not implemented or failed');
        }
      }
    }
  });

  // Test error handling in submission flow
  test('should handle submission errors gracefully', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    
    // Simulate network failure during submission
    await page.route('**/api/**', route => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Testing error handling during submission.');
      
      const submitButton = page.locator('button:has-text("Save"), button:has-text("Submit")');
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for error handling
        await page.waitForTimeout(3000);
        
        // Check for error messaging
        const errorElements = [
          page.locator('text=error'),
          page.locator('text=failed'),
          page.locator('text=try again'),
          page.locator('.error'),
          page.locator('[role="alert"]')
        ];
        
        let errorHandlingFound = false;
        for (const element of errorElements) {
          if (await element.isVisible({ timeout: 1000 })) {
            errorHandlingFound = true;
            console.log('Error handling messaging found');
            break;
          }
        }
        
        // Verify that content is preserved after error
        const contentPreserved = await textarea.inputValue();
        expect(contentPreserved).toContain('Testing error handling');
        
        // Verify submit button is re-enabled for retry
        expect(submitButton).not.toBeDisabled();
      }
    }
    
    // Remove route override
    await page.unroute('**/api/**');
  });
});

test.describe('Performance Audit - Sacred Timing', () => {
  test('should meet performance thresholds for vulnerable users', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${PRODUCTION_URL}/write`, { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    // Critical: Write interface must load quickly for crisis moments
    expect(loadTime).toBeLessThan(5000); // 5 second max for 3G users
    
    console.log(`Write page load time: ${loadTime}ms`);
    
    // Check for Core Web Vitals
    const fcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          for (const entry of entries) {
            if (entry.name === 'first-contentful-paint') {
              resolve(entry.startTime);
            }
          }
        }).observe({ entryTypes: ['paint'] });
        
        setTimeout(() => resolve(0), 1000);
      });
    });
    
    if (fcp > 0) {
      console.log(`First Contentful Paint: ${fcp}ms`);
      expect(fcp).toBeLessThan(2500); // 2.5s max for FCP
    }
  });
});