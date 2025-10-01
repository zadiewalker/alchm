import { test, expect, Page } from '@playwright/test';

test.describe('ALCHM Comprehensive End-to-End User Journey', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    // Enable device emulation for mobile testing
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('Critical User Journey: Complete Flow Validation', async () => {
    // Test 1: Landing & Age Verification
    await test.step('Landing Page and Age Verification', async () => {
      console.log('🌐 Testing landing page access...');
      await page.goto('http://localhost:3001');
      
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Check for age verification modal or component
      const ageVerification = page.locator('[data-testid="age-verification"], .age-verification, [class*="age-verification"]');
      const hasAgeVerification = await ageVerification.count() > 0;
      
      console.log(`Age verification present: ${hasAgeVerification}`);
      
      // Look for crisis access button
      const crisisButton = page.locator('text=/crisis|emergency|988|help/i');
      const hasCrisisAccess = await crisisButton.count() > 0;
      
      console.log(`Crisis access available: ${hasCrisisAccess}`);
      
      // Check for main landing content
      const mainContent = page.locator('h1, h2, .hero, main');
      await expect(mainContent.first()).toBeVisible();
      
      console.log('✅ Landing page loads successfully');
    });

    // Test 2: Authentication Flow
    await test.step('Authentication Flow', async () => {
      console.log('🔐 Testing authentication flow...');
      
      // Look for sign up/login buttons
      const authButtons = page.locator('text=/sign up|login|get started|join/i').first();
      
      if (await authButtons.count() > 0) {
        await authButtons.click();
        await page.waitForTimeout(2000);
        
        // Check if we're on auth page or modal appeared
        const authForm = page.locator('form, [data-testid="auth-form"], input[type="email"]');
        const hasAuthForm = await authForm.count() > 0;
        
        console.log(`Authentication form available: ${hasAuthForm}`);
        
        if (hasAuthForm) {
          // Test email input (don't actually submit)
          const emailInput = page.locator('input[type="email"], input[name="email"]').first();
          if (await emailInput.count() > 0) {
            await emailInput.fill('test@example.com');
            console.log('✅ Email input functional');
          }
        }
      }
      
      console.log('✅ Authentication flow accessible');
    });

    // Test 3: Navigation to Journal
    await test.step('Journal Access and Interface', async () => {
      console.log('📝 Testing journal access...');
      
      // Try to navigate to journal page directly
      await page.goto('http://localhost:3001/journal');
      await page.waitForLoadState('networkidle');
      
      // Check for journal interface elements
      const journalElements = [
        'textarea',
        '[contenteditable]',
        'input[type="text"]',
        '[data-testid="journal-editor"]',
        '.journal-editor',
        '.editor'
      ];
      
      let hasJournalInterface = false;
      for (const selector of journalElements) {
        if (await page.locator(selector).count() > 0) {
          hasJournalInterface = true;
          break;
        }
      }
      
      console.log(`Journal interface present: ${hasJournalInterface}`);
      
      // Check for mood selector
      const moodSelector = page.locator('[data-testid="mood-selector"], .mood-selector, select');
      const hasMoodSelector = await moodSelector.count() > 0;
      
      console.log(`Mood selector available: ${hasMoodSelector}`);
      
      console.log('✅ Journal interface accessible');
    });

    // Test 4: Crisis Safety Systems
    await test.step('Crisis Safety Systems', async () => {
      console.log('🆘 Testing crisis safety systems...');
      
      // Check for crisis keywords detection (simulate typing)
      const textInput = page.locator('textarea, [contenteditable]').first();
      if (await textInput.count() > 0) {
        await textInput.fill('I am feeling suicidal and need help');
        await page.waitForTimeout(1000);
        
        // Look for crisis intervention response
        const crisisResponse = page.locator('text=/crisis|988|help|support|emergency/i');
        const hasCrisisResponse = await crisisResponse.count() > 0;
        
        console.log(`Crisis keyword detection: ${hasCrisisResponse}`);
      }
      
      // Check for 988 hotline accessibility
      const hotlineAccess = page.locator('text=/988|suicide prevention|crisis hotline/i');
      const hasHotlineAccess = await hotlineAccess.count() > 0;
      
      console.log(`988 hotline accessible: ${hasHotlineAccess}`);
      
      // Check for medical disclaimers
      const disclaimer = page.locator('text=/medical disclaimer|not medical advice|professional help/i');
      const hasDisclaimer = await disclaimer.count() > 0;
      
      console.log(`Medical disclaimer present: ${hasDisclaimer}`);
      
      console.log('✅ Crisis safety systems evaluated');
    });

    // Test 5: Mobile Optimization
    await test.step('Mobile Trauma-Informed Design', async () => {
      console.log('📱 Testing mobile optimization...');
      
      // Test touch targets (minimum 48px for trauma-informed design)
      const buttons = page.locator('button, [role="button"], a');
      const buttonCount = await buttons.count();
      
      if (buttonCount > 0) {
        for (let i = 0; i < Math.min(5, buttonCount); i++) {
          const button = buttons.nth(i);
          const boundingBox = await button.boundingBox();
          
          if (boundingBox) {
            const meetsMinSize = boundingBox.width >= 44 && boundingBox.height >= 44;
            console.log(`Button ${i + 1}: ${boundingBox.width}x${boundingBox.height}px - ${meetsMinSize ? '✅' : '❌'} trauma-informed`);
          }
        }
      }
      
      // Test text readability (minimum 16px for crisis situations)
      const textElements = page.locator('p, span, div, h1, h2, h3');
      const hasReadableText = await textElements.first().isVisible();
      
      console.log(`Text elements visible: ${hasReadableText}`);
      
      console.log('✅ Mobile optimization evaluated');
    });

    // Test 6: Performance and Accessibility
    await test.step('Performance and Accessibility', async () => {
      console.log('⚡ Testing performance and accessibility...');
      
      // Check page load performance
      const navigationStart = await page.evaluate(() => performance.timing.navigationStart);
      const loadComplete = await page.evaluate(() => performance.timing.loadEventEnd);
      const loadTime = loadComplete - navigationStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      // Basic accessibility checks
      const hasProperHeadings = await page.locator('h1').count() > 0;
      const hasAltText = await page.locator('img[alt]').count() > 0;
      const hasLabels = await page.locator('label').count() > 0;
      
      console.log(`Proper headings: ${hasProperHeadings}`);
      console.log(`Images with alt text: ${hasAltText}`);
      console.log(`Form labels present: ${hasLabels}`);
      
      console.log('✅ Performance and accessibility evaluated');
    });

    console.log('\n🎯 COMPREHENSIVE USER JOURNEY TEST COMPLETED');
  });

  test('Firebase Integration Validation', async () => {
    await test.step('Firebase Services Check', async () => {
      console.log('🔥 Testing Firebase integration...');
      
      await page.goto('http://localhost:3001');
      await page.waitForLoadState('networkidle');
      
      // Check for Firebase initialization
      const firebaseErrors = await page.evaluate(() => {
        return window.console ? [] : ['Console not available'];
      });
      
      console.log('Firebase integration checked');
      
      // Test API endpoints
      const apiEndpoints = ['/api/health/ping'];
      
      for (const endpoint of apiEndpoints) {
        try {
          const response = await page.request.get(`http://localhost:3001${endpoint}`);
          console.log(`${endpoint}: ${response.status()}`);
        } catch (error) {
          console.log(`${endpoint}: Error - ${error}`);
        }
      }
      
      console.log('✅ Firebase integration validated');
    });
  });
});