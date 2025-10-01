import { test, expect } from '@playwright/test';

// Direct production tests - no local server needed
test.describe('ALCHM Production Direct Tests', () => {
  const baseURL = 'https://alchmapp.web.app';

  test('Core API endpoints are functional', async ({ page, request }) => {
    console.log('Testing Firebase Functions health...');
    
    // Test status endpoint
    const statusResponse = await request.get('https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/status');
    expect(statusResponse.status()).toBe(200);
    
    const statusData = await statusResponse.json();
    expect(statusData.status).toBe('healthy');
    expect(statusData.functions.crisisDetection).toBe('active');
    console.log('✅ Status endpoint working');

    // Test crisis detection with concerning content
    const crisisResponse = await request.post('https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/crisisDetection', {
      data: {
        content: "I want to hurt myself",
        culturalContext: "en"
      }
    });
    
    expect(crisisResponse.status()).toBe(200);
    const crisisData = await crisisResponse.json();
    
    expect(crisisData.crisisDetected).toBe(true);
    expect(crisisData.level).toBe('medium');
    expect(crisisData.universalAccess).toBe(true);
    expect(crisisData.resources.immediate.suicideLifeline.number).toBe('988');
    console.log('✅ Crisis detection working properly');

    // Test non-crisis content
    const normalResponse = await request.post('https://us-central1-alchm-digital-sanctuary.cloudfunctions.net/crisisDetection', {
      data: {
        content: "I am feeling good today",
        culturalContext: "en"
      }
    });
    
    expect(normalResponse.status()).toBe(200);
    const normalData = await normalResponse.json();
    expect(normalData.crisisDetected).toBe(false);
    console.log('✅ Crisis detection properly filters non-crisis content');
  });

  test('Website loads and displays properly', async ({ page }) => {
    console.log('Testing main website...');
    
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // Check that we don't get errors
    await expect(page).toHaveTitle(/ALCHM/);
    
    // Look for crisis support
    const crisisButton = page.locator('a[href*="988"], button:has-text("Crisis"), a:has-text("988")');
    await expect(crisisButton.first()).toBeVisible({ timeout: 15000 });
    console.log('✅ Main site loads with crisis support visible');
  });

  test('Journal page functionality', async ({ page }) => {
    console.log('Testing journal page...');
    
    await page.goto(`${baseURL}/journal`);
    await page.waitForLoadState('networkidle');
    
    // Should have journal interface or auth gate
    const hasJournalUI = await page.locator('text=Start Writing, textarea, text=Write, text=Journal').first().isVisible({ timeout: 10000 });
    const hasAuthGate = await page.locator('text=Sign, text=Login, text=Auth').first().isVisible();
    
    expect(hasJournalUI || hasAuthGate).toBe(true);
    console.log('✅ Journal page loads properly');
  });

  test('Dashboard accessibility', async ({ page }) => {
    console.log('Testing dashboard...');
    
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Should not get 404
    const bodyText = await page.textContent('body');
    expect(bodyText).not.toContain('404');
    expect(bodyText).not.toContain('Not Found');
    
    // Should have some content
    expect(bodyText?.length || 0).toBeGreaterThan(100);
    console.log('✅ Dashboard loads successfully');
  });

  test('Mobile responsiveness', async ({ page }) => {
    console.log('Testing mobile responsiveness...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    
    // Check that content fits viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = 375;
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20); // 20px tolerance
    console.log('✅ Mobile layout is responsive');
  });

  test('Authentication pages load', async ({ page }) => {
    console.log('Testing auth pages...');
    
    const authUrls = ['/auth/login', '/auth/signup'];
    
    for (const url of authUrls) {
      await page.goto(`${baseURL}${url}`);
      await page.waitForLoadState('networkidle');
      
      const response = page.url();
      // Auth pages may redirect, that's OK
      expect(response).toMatch(/alchmapp\.web\.app/);
    }
    console.log('✅ Auth pages accessible');
  });

  test('Performance - Basic load time', async ({ page }) => {
    console.log('Testing performance...');
    
    const start = Date.now();
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    // Should load within 15 seconds on production
    expect(loadTime).toBeLessThan(15000);
    console.log(`✅ Page loaded in ${loadTime}ms`);
  });
});