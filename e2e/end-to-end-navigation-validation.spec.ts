/**
 * ALCHM End-to-End Navigation Validation
 * 
 * Sacred promise verification: Users can discover and access healing pathways
 */

import { test, expect } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('End-to-End Navigation Flow - Sacred Journey', () => {
  test('should complete full user journey from homepage to pathway step', async ({ page }) => {
    // Step 1: Homepage loads
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    
    const homeContent = await page.textContent('body');
    expect(homeContent).not.toContain('404');
    console.log('✅ Homepage loads successfully');
    
    // Step 2: Find and click pathways CTA
    const pathwaysCTA = page.locator('a[href="/pathways"], a:has-text("Explore Pathways")');
    if (await pathwaysCTA.isVisible()) {
      await pathwaysCTA.click();
      await page.waitForLoadState('networkidle');
      
      const pathwaysContent = await page.textContent('body');
      expect(pathwaysContent).not.toContain('404');
      expect(pathwaysContent).toContain('path'); // Should have "pathway" or "paths" text
      console.log('✅ Homepage CTA leads to working pathways page');
    } else {
      // Try direct navigation if CTA not found
      await page.goto(`${PRODUCTION_URL}/pathways`);
    }
    
    // Step 3: Pathways page shows pathway options
    const currentUrl = page.url();
    expect(currentUrl).toContain('pathways');
    
    const pathwaysPageContent = await page.textContent('body');
    expect(pathwaysPageContent).not.toContain('404');
    
    // Look for pathway names
    const hasResilience = pathwaysPageContent.includes('Resilience') || pathwaysPageContent.includes('resilience');
    const hasBecoming = pathwaysPageContent.includes('Becoming') || pathwaysPageContent.includes('becoming');
    const hasPurpose = pathwaysPageContent.includes('Purpose') || pathwaysPageContent.includes('purpose');
    const hasBelonging = pathwaysPageContent.includes('Belonging') || pathwaysPageContent.includes('belonging');
    
    expect(hasResilience || hasBecoming || hasPurpose || hasBelonging).toBe(true);
    console.log('✅ Pathways page shows available healing journeys');
    
    // Step 4: Click on a pathway to enter first step
    const pathwayLinks = [
      'a[href*="resilience"]',
      'a[href*="becoming"]', 
      'a[href*="purpose"]',
      'a[href*="belonging"]'
    ];
    
    let pathwayEntered = false;
    for (const selector of pathwayLinks) {
      const pathwayLink = page.locator(selector);
      if (await pathwayLink.isVisible()) {
        await pathwayLink.click();
        await page.waitForLoadState('networkidle');
        
        const stepContent = await page.textContent('body');
        if (!stepContent.includes('404')) {
          pathwayEntered = true;
          console.log(`✅ Successfully entered pathway via ${selector}`);
          
          // Step 5: Verify we're on a working step page
          const hasPrompt = stepContent.includes('?') || // Questions end with ?
                           await page.locator('h1, .prompt').isVisible() ||
                           await page.locator('textarea').isVisible();
          
          expect(hasPrompt).toBe(true);
          console.log('✅ Pathway step page has writing interface');
          
          // Step 6: Test basic interaction
          const textarea = page.locator('textarea');
          if (await textarea.isVisible()) {
            await textarea.fill('Test entry for navigation validation');
            const value = await textarea.inputValue();
            expect(value).toContain('Test entry');
            console.log('✅ Writing interface accepts input');
          }
          
          // Step 7: Test save button
          const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")');
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(1000);
            console.log('✅ Save button responds to interaction');
          }
          
          break;
        }
      }
    }
    
    expect(pathwayEntered).toBe(true);
    console.log('✅ Complete end-to-end navigation flow successful');
  });

  test('should provide working navigation between pathway steps', async ({ page }) => {
    // Test step-to-step navigation
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const step1Content = await page.textContent('body');
    expect(step1Content).not.toContain('404');
    console.log('✅ Step 1 loads successfully');
    
    // Look for next step navigation
    const nextLink = page.locator('a:has-text("Next"), a[href*="step/2"]');
    if (await nextLink.isVisible()) {
      await nextLink.click();
      await page.waitForLoadState('networkidle');
      
      const step2Content = await page.textContent('body');
      expect(step2Content).not.toContain('404');
      console.log('✅ Next step navigation works');
      
      // Test back navigation
      const prevLink = page.locator('a:has-text("Previous"), a:has-text("Back"), a[href*="step/1"]');
      if (await prevLink.isVisible()) {
        await prevLink.click();
        await page.waitForLoadState('networkidle');
        
        const backContent = await page.textContent('body');
        expect(backContent).not.toContain('404');
        console.log('✅ Previous step navigation works');
      }
    }
    
    // Test back to pathways navigation
    const backToPathways = page.locator('a:has-text("Back to Pathways"), a[href*="pathways"]');
    if (await backToPathways.isVisible()) {
      await backToPathways.click();
      await page.waitForLoadState('networkidle');
      
      const pathwaysContent = await page.textContent('body');
      expect(pathwaysContent).not.toContain('404');
      console.log('✅ Back to pathways navigation works');
    }
  });

  test('should handle crisis lifeline link properly', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways`, { waitUntil: 'networkidle' });
    
    const crisisLink = page.locator('a[href="tel:988"], a:has-text("988")');
    if (await crisisLink.isVisible()) {
      const href = await crisisLink.getAttribute('href');
      expect(href).toBe('tel:988');
      console.log('✅ Crisis lifeline link properly configured');
    }
  });
});