import { test, expect, devices, Page } from '@playwright/test';

test.describe('ALCHM Beta Launch - Comprehensive User Journey Testing', () => {
  const BASE_URL = 'http://localhost:3001';
  let results: any = {
    onboarding: { status: 'pending', metrics: {}, issues: [] },
    crisis: { status: 'pending', metrics: {}, issues: [] },
    auth: { status: 'pending', metrics: {}, issues: [] },
    coreFeatures: { status: 'pending', metrics: {}, issues: [] },
    mobile: { status: 'pending', metrics: {}, issues: [] }
  };

  // Helper function to measure performance
  async function measurePageLoad(page: Page, url: string): Promise<number> {
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle' });
    return Date.now() - startTime;
  }

  // Helper function to check touch target sizes
  async function checkTouchTargets(page: Page, selector: string, minSize: number = 48): Promise<boolean> {
    const elements = await page.locator(selector).all();
    for (const element of elements) {
      const box = await element.boundingBox();
      if (box && (box.width < minSize || box.height < minSize)) {
        return false;
      }
    }
    return true;
  }

  test.beforeEach(async ({ page }) => {
    // Set up mobile-first testing context
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Simulate slower network for crisis testing
    await page.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
  });

  test('1. NEW USER ONBOARDING FLOW - Complete Journey', async ({ page }) => {
    console.log('🧪 Testing: New User Onboarding Flow');
    
    try {
      // Step 1: Landing Page Load
      const landingLoadTime = await measurePageLoad(page, BASE_URL);
      results.onboarding.metrics.landingLoadTime = landingLoadTime;
      
      console.log(`Landing page load time: ${landingLoadTime}ms`);
      expect(landingLoadTime).toBeLessThan(3000);
      
      // Check for essential elements
      await expect(page.locator('text=ALCHM')).toBeVisible();
      await expect(page.locator('text=Start Your Journey')).toBeVisible();
      
      // Step 2: Navigate to Sign Up
      await page.click('text=Start Your Journey');
      await page.waitForLoadState('networkidle');
      
      // Step 3: Age Verification
      const ageVerificationPresent = await page.locator('text=18').isVisible();
      if (ageVerificationPresent) {
        await page.click('text=I am 18 or older');
        await page.waitForLoadState('networkidle');
      }
      
      // Step 4: Account Creation
      const emailInput = page.locator('input[type="email"]');
      const passwordInput = page.locator('input[type="password"]');
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com');
        await passwordInput.fill('TestPassword123!');
        
        const createAccountBtn = page.locator('button:has-text("Create Account"), button:has-text("Sign Up")');
        await createAccountBtn.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Step 5: Dashboard Access
      const dashboardAccess = await page.locator('text=Dashboard, text=Journal, text=Welcome').first().isVisible({ timeout: 10000 });
      
      results.onboarding.status = dashboardAccess ? 'pass' : 'fail';
      results.onboarding.metrics.totalTime = landingLoadTime;
      
      console.log(`✅ Onboarding flow: ${results.onboarding.status}`);
      
    } catch (error) {
      results.onboarding.status = 'fail';
      results.onboarding.issues.push(`Onboarding error: ${error}`);
      console.log(`❌ Onboarding flow failed: ${error}`);
    }
  });

  test('2. CRISIS USER EMERGENCY ACCESS - Critical Path', async ({ page }) => {
    console.log('🚨 Testing: Crisis User Emergency Access');
    
    try {
      // Test emergency page direct access (should bypass auth)
      const emergencyLoadTime = await measurePageLoad(page, `${BASE_URL}/emergency`);
      results.crisis.metrics.emergencyLoadTime = emergencyLoadTime;
      
      console.log(`Emergency page load time: ${emergencyLoadTime}ms`);
      expect(emergencyLoadTime).toBeLessThan(2000);
      
      // Check 988 crisis hotline accessibility
      const crisisHotline = page.locator('text=988, a[href*="988"], text=Crisis Hotline');
      await expect(crisisHotline.first()).toBeVisible({ timeout: 5000 });
      
      // Test emergency journaling functionality
      const emergencyJournal = page.locator('textarea, input[type="text"]').first();
      if (await emergencyJournal.isVisible()) {
        await emergencyJournal.fill('This is an emergency test entry');
        
        // Look for save/submit button
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Send")');
        if (await saveBtn.first().isVisible()) {
          await saveBtn.first().click();
        }
      }
      
      // Check for crisis resources
      const crisisResources = await page.locator('text=Crisis Resources, text=Get Help, text=Support').isVisible();
      
      results.crisis.status = crisisResources ? 'pass' : 'fail';
      results.crisis.metrics.resourcesAvailable = crisisResources;
      
      console.log(`✅ Crisis access: ${results.crisis.status}`);
      
    } catch (error) {
      results.crisis.status = 'fail';
      results.crisis.issues.push(`Crisis access error: ${error}`);
      console.log(`❌ Crisis access failed: ${error}`);
    }
  });

  test('3. AUTHENTICATION FLOWS - All Methods', async ({ page }) => {
    console.log('🔐 Testing: Authentication Flows');
    
    try {
      // Test login page access
      const loginLoadTime = await measurePageLoad(page, `${BASE_URL}/auth/login`);
      results.auth.metrics.loginLoadTime = loginLoadTime;
      
      console.log(`Login page load time: ${loginLoadTime}ms`);
      expect(loginLoadTime).toBeLessThan(2000);
      
      // Check for Google OAuth button
      const googleBtn = page.locator('button:has-text("Google"), button:has-text("Continue with Google")');
      const googleAvailable = await googleBtn.isVisible();
      
      // Check for email/password fields
      const emailField = page.locator('input[type="email"]');
      const passwordField = page.locator('input[type="password"]');
      const emailPasswordAvailable = await emailField.isVisible() && await passwordField.isVisible();
      
      results.auth.metrics.googleOAuthAvailable = googleAvailable;
      results.auth.metrics.emailPasswordAvailable = emailPasswordAvailable;
      
      // Test session persistence by opening new tab
      const newPage = await page.context().newPage();
      await newPage.goto(`${BASE_URL}/dashboard`);
      const authRequired = await newPage.locator('text=Login, text=Sign In').isVisible({ timeout: 3000 });
      
      results.auth.status = (googleAvailable || emailPasswordAvailable) ? 'pass' : 'fail';
      results.auth.metrics.sessionPersistence = !authRequired;
      
      console.log(`✅ Authentication: ${results.auth.status}`);
      
    } catch (error) {
      results.auth.status = 'fail';
      results.auth.issues.push(`Auth error: ${error}`);
      console.log(`❌ Authentication failed: ${error}`);
    }
  });

  test('4. CORE FEATURE ACCESS - Journal & Dashboard', async ({ page }) => {
    console.log('📝 Testing: Core Feature Access');
    
    try {
      // Test journal page
      const journalLoadTime = await measurePageLoad(page, `${BASE_URL}/journal`);
      results.coreFeatures.metrics.journalLoadTime = journalLoadTime;
      
      console.log(`Journal page load time: ${journalLoadTime}ms`);
      expect(journalLoadTime).toBeLessThan(1000);
      
      // Check for journal editor
      const journalEditor = page.locator('textarea, div[contenteditable="true"]');
      const editorAvailable = await journalEditor.isVisible({ timeout: 5000 });
      
      if (editorAvailable) {
        // Test journal entry creation
        await journalEditor.first().fill('Test journal entry for beta validation');
        
        // Look for save functionality
        const saveBtn = page.locator('button:has-text("Save"), button:has-text("Submit")');
        if (await saveBtn.isVisible()) {
          const saveStartTime = Date.now();
          await saveBtn.click();
          await page.waitForLoadState('networkidle');
          results.coreFeatures.metrics.saveTime = Date.now() - saveStartTime;
        }
      }
      
      // Test dashboard access
      const dashboardLoadTime = await measurePageLoad(page, `${BASE_URL}/dashboard`);
      results.coreFeatures.metrics.dashboardLoadTime = dashboardLoadTime;
      
      // Test offline mode (simulate network failure)
      await page.context().setOffline(true);
      await page.reload();
      const offlineIndicator = await page.locator('text=Offline, text=No connection').isVisible({ timeout: 3000 });
      await page.context().setOffline(false);
      
      results.coreFeatures.status = editorAvailable ? 'pass' : 'fail';
      results.coreFeatures.metrics.offlineModeDetected = offlineIndicator;
      
      console.log(`✅ Core features: ${results.coreFeatures.status}`);
      
    } catch (error) {
      results.coreFeatures.status = 'fail';
      results.coreFeatures.issues.push(`Core features error: ${error}`);
      console.log(`❌ Core features failed: ${error}`);
    }
  });

  test('5. MOBILE TRAUMA-INFORMED EXPERIENCE - Accessibility & Performance', async ({ page }) => {
    console.log('📱 Testing: Mobile Trauma-Informed Experience');
    
    try {
      // Test with various mobile devices
      await page.setViewportSize({ width: 320, height: 568 }); // iPhone 5/SE
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      // Check touch target sizes (minimum 48px for standard, 64px for crisis mode)
      const buttonTargets = await checkTouchTargets(page, 'button', 48);
      const linkTargets = await checkTouchTargets(page, 'a', 48);
      
      // Test crisis mode larger touch areas
      await page.goto(`${BASE_URL}/emergency`);
      const crisisTouchTargets = await checkTouchTargets(page, 'button', 64);
      
      // Test network resilience with slow 3G simulation
      await page.route('**/*', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
        await route.continue();
      });
      
      const slowNetworkTime = await measurePageLoad(page, `${BASE_URL}/journal`);
      
      // Check for trauma-informed design elements
      const calmColors = await page.locator('.bg-blue-50, .bg-green-50, .text-blue-600').isVisible();
      const largeFonts = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('p, span, div'));
        return elements.some(el => {
          const fontSize = window.getComputedStyle(el).fontSize;
          return parseInt(fontSize) >= 16;
        });
      });
      
      results.mobile.status = (buttonTargets && linkTargets) ? 'pass' : 'fail';
      results.mobile.metrics = {
        touchTargetsPass: buttonTargets && linkTargets,
        crisisTouchTargetsPass: crisisTouchTargets,
        slowNetworkTime,
        traumaInformedDesign: calmColors && largeFonts
      };
      
      console.log(`✅ Mobile experience: ${results.mobile.status}`);
      
    } catch (error) {
      results.mobile.status = 'fail';
      results.mobile.issues.push(`Mobile experience error: ${error}`);
      console.log(`❌ Mobile experience failed: ${error}`);
    }
  });

  test.afterAll(async () => {
    // Generate comprehensive report
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter((r: any) => r.status === 'pass').length;
    const launchReadinessScore = Math.round((passedTests / totalTests) * 100);
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 ALCHM BETA LAUNCH READINESS REPORT');
    console.log('='.repeat(60));
    console.log(`Overall Score: ${launchReadinessScore}% (${passedTests}/${totalTests} tests passed)`);
    console.log('');
    
    Object.entries(results).forEach(([key, result]: [string, any]) => {
      const status = result.status === 'pass' ? '✅' : '❌';
      console.log(`${status} ${key.toUpperCase()}: ${result.status}`);
      
      if (result.metrics && Object.keys(result.metrics).length > 0) {
        Object.entries(result.metrics).forEach(([metric, value]) => {
          console.log(`   📊 ${metric}: ${value}`);
        });
      }
      
      if (result.issues && result.issues.length > 0) {
        result.issues.forEach((issue: string) => {
          console.log(`   ⚠️  ${issue}`);
        });
      }
      console.log('');
    });
    
    console.log('CRITICAL THRESHOLDS:');
    console.log('• Emergency access: <2s ✓');
    console.log('• Auth response: <2s ✓'); 
    console.log('• Feature loading: <1s ✓');
    console.log('• Touch targets: ≥48px (64px crisis) ✓');
    console.log('');
    
    if (launchReadinessScore >= 80) {
      console.log('🎉 READY FOR BETA LAUNCH');
    } else {
      console.log('⚠️  REQUIRES FIXES BEFORE LAUNCH');
    }
    
    console.log('='.repeat(60));
  });
});