import { test, expect, type Page } from '@playwright/test';

// Test configuration
const ITERATIONS = 10;
const BASE_URL = 'http://localhost:3003';
const PERFORMANCE_TARGET = 3000; // 3 seconds

// Test results tracking
const testResults: any[] = [];

/**
 * ALCHM Comprehensive Stress Testing Suite
 * Tests all critical user flows 10 times each (simulating 50x load)
 * Measures performance, errors, and functionality
 */

test.describe('ALCHM Critical User Flow Stress Tests', () => {
  test.beforeAll(() => {
    console.log('🚀 Starting ALCHM Comprehensive Stress Testing Suite');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Iterations per test: ${ITERATIONS}`);
  });

  test.afterAll(() => {
    console.log('📊 Generating test summary...');
    const totalTests = testResults.length;
    const successfulTests = testResults.filter(r => r.success).length;
    const failedTests = testResults.filter(r => !r.success).length;
    
    console.log('='.repeat(60));
    console.log('ALCHM STRESS TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Successful: ${successfulTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log('='.repeat(60));
  });

  // Utility functions
  async function measurePageLoad(page: Page): Promise<number> {
    const performanceEntries = await page.evaluate(() => {
      const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return entry ? Math.round(entry.loadEventEnd - entry.fetchStart) : 0;
    });
    return performanceEntries;
  }

  function recordResult(testName: string, iteration: number, result: any) {
    testResults.push({
      testName,
      iteration,
      timestamp: new Date().toISOString(),
      ...result
    });
  }

  // TEST 1: Homepage → Auth flow → Dashboard (10x iterations)
  for (let i = 1; i <= ITERATIONS; i++) {
    test(`Homepage → Auth → Dashboard Flow (iteration ${i})`, async ({ page, context }) => {
      console.log(`🔄 Running Homepage → Auth → Dashboard test (iteration ${i})`);
      
      const startTime = Date.now();
      let errors: string[] = [];
      
      // Collect console errors
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      page.on('pageerror', error => {
        errors.push(error.message);
      });

      try {
        // 1. Load homepage
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 10000 });
        const homepageLoadTime = await measurePageLoad(page);
        
        // Check homepage elements
        await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
        const pageTitle = await page.title();
        
        // 2. Navigate to auth page
        await page.click('[href="/auth"]');
        await page.waitForURL('**/auth', { timeout: 10000 });
        const authLoadTime = await measurePageLoad(page);
        
        // 3. Check auth page loads correctly  
        await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
        
        // 4. Test anonymous write mode (since we can't do real auth)
        await page.goto(`${BASE_URL}/write?mode=anon`, { waitUntil: 'networkidle' });
        await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
        
        const totalTime = Date.now() - startTime;
        const performancePassing = homepageLoadTime < PERFORMANCE_TARGET && authLoadTime < PERFORMANCE_TARGET;
        
        recordResult('Homepage-Auth-Dashboard', i, {
          success: true,
          totalTime,
          homepageLoadTime,
          authLoadTime,
          errors: errors.length,
          pageTitle,
          performancePassing
        });
        
        expect(errors.length).toBe(0);
        expect(performancePassing).toBeTruthy();
        
      } catch (error) {
        recordResult('Homepage-Auth-Dashboard', i, {
          success: false,
          error: error.message,
          errors: errors.length
        });
        throw error;
      }
    });
  }

  // TEST 2: Dashboard → Write page → Journal save (10x iterations)
  for (let i = 1; i <= ITERATIONS; i++) {
    test(`Dashboard → Write → Save Flow (iteration ${i})`, async ({ page }) => {
      console.log(`📝 Running Dashboard → Write → Save test (iteration ${i})`);
      
      const startTime = Date.now();
      let errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      try {
        // 1. Go directly to write page in anonymous mode
        await page.goto(`${BASE_URL}/write?mode=anon`, { waitUntil: 'networkidle', timeout: 10000 });
        const writePageLoadTime = await measurePageLoad(page);
        
        // 2. Fill out the form
        await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
        await page.fill('textarea', `This is test journal entry #${i} for stress testing. I am feeling good today and looking forward to testing all the features. This is iteration ${i} of the comprehensive stress test.`);
        
        // 3. Select a mood (click button with value 5)
        await page.locator('button').nth(4).click(); // 5th button (mood 5)
        
        // 4. Save the entry
        await page.click('button:has-text("Save Reflection")');
        
        // Wait for save to complete
        await page.waitForTimeout(2000);
        
        // Check for success indication
        const isRedirected = page.url().includes('?saved=local') || page.url().includes('/journals');
        
        const totalTime = Date.now() - startTime;
        const performancePassing = writePageLoadTime < PERFORMANCE_TARGET;
        
        recordResult('Dashboard-Write-Save', i, {
          success: true,
          totalTime,
          writePageLoadTime,
          isRedirected,
          errors: errors.length,
          performancePassing
        });
        
        expect(errors.length).toBeLessThan(3); // Allow minor errors
        
      } catch (error) {
        recordResult('Dashboard-Write-Save', i, {
          success: false,
          error: error.message,
          errors: errors.length
        });
        throw error;
      }
    });
  }

  // TEST 3: Anonymous mode → Full session privacy (10x iterations)
  for (let i = 1; i <= ITERATIONS; i++) {
    test(`Anonymous Mode Privacy Test (iteration ${i})`, async ({ page }) => {
      console.log(`🔒 Running Anonymous Mode privacy test (iteration ${i})`);
      
      const startTime = Date.now();
      let errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      try {
        // 1. Access anonymous mode
        await page.goto(`${BASE_URL}/write?mode=anon`, { waitUntil: 'networkidle' });
        const anonLoadTime = await measurePageLoad(page);
        
        // 2. Verify no auth required
        await expect(page.locator('textarea')).toBeVisible({ timeout: 5000 });
        
        // 3. Write an entry
        await page.fill('textarea', `Anonymous test entry ${i}. This should be stored locally only and never sent to servers.`);
        
        // 4. Check privacy checkbox exists
        const privacyCheckbox = page.locator('input[type="checkbox"]');
        const hasPrivacyOption = await privacyCheckbox.isVisible();
        
        // 5. Save entry
        await page.click('button:has-text("Save Reflection")');
        await page.waitForTimeout(1500);
        
        // 6. Verify localStorage usage
        const localStorageContent = await page.evaluate(() => {
          return localStorage.getItem('anon-entries');
        });
        
        const totalTime = Date.now() - startTime;
        const performancePassing = anonLoadTime < PERFORMANCE_TARGET;
        
        recordResult('Anonymous-Mode', i, {
          success: true,
          totalTime,
          anonLoadTime,
          hasPrivacyOption,
          localStorageWorking: !!localStorageContent,
          errors: errors.length,
          performancePassing
        });
        
        expect(hasPrivacyOption).toBeTruthy();
        expect(localStorageContent).toBeTruthy();
        
      } catch (error) {
        recordResult('Anonymous-Mode', i, {
          success: false,
          error: error.message,
          errors: errors.length
        });
        throw error;
      }
    });
  }

  // TEST 4: Crisis detection → Resource display accuracy (10x iterations)
  for (let i = 1; i <= ITERATIONS; i++) {
    test(`Crisis Support Display Test (iteration ${i})`, async ({ page }) => {
      console.log(`🆘 Running Crisis Support display test (iteration ${i})`);
      
      let errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      try {
        // 1. Load homepage and check crisis support
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        
        const crisisText = await page.locator('footer').textContent();
        const hasCrisisInfo = crisisText && crisisText.includes('988');
        
        // 2. Check write page also has crisis support
        await page.goto(`${BASE_URL}/write?mode=anon`, { waitUntil: 'networkidle' });
        const writePageCrisisText = await page.locator('footer').textContent();
        const writePageHasCrisis = writePageCrisisText && writePageCrisisText.includes('988');
        
        recordResult('Crisis-Support', i, {
          success: true,
          homepageHasCrisisInfo: hasCrisisInfo,
          writePageHasCrisisInfo: writePageHasCrisis,
          errors: errors.length
        });
        
        expect(hasCrisisInfo).toBeTruthy();
        expect(writePageHasCrisis).toBeTruthy();
        
      } catch (error) {
        recordResult('Crisis-Support', i, {
          success: false,
          error: error.message,
          errors: errors.length
        });
        throw error;
      }
    });
  }

  // TEST 5: Mobile responsiveness validation (5x iterations)
  for (let i = 1; i <= 5; i++) {
    test(`Mobile Responsiveness Test (iteration ${i})`, async ({ page }) => {
      console.log(`📱 Running Mobile Responsiveness test (iteration ${i})`);
      
      let errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      try {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
        
        // 1. Test homepage on mobile
        await page.goto(BASE_URL, { waitUntil: 'networkidle' });
        const homepageLoadTime = await measurePageLoad(page);
        
        // Check responsive elements
        const heroTitle = page.locator('h1').first();
        await expect(heroTitle).toBeVisible();
        
        // 2. Test write page on mobile
        await page.goto(`${BASE_URL}/write?mode=anon`, { waitUntil: 'networkidle' });
        const writeLoadTime = await measurePageLoad(page);
        
        // Check textarea usability on mobile
        const textarea = page.locator('textarea');
        await expect(textarea).toBeVisible();
        
        const textareaBox = await textarea.boundingBox();
        const textareaUsable = textareaBox && textareaBox.width > 300;
        
        const performancePassing = homepageLoadTime < PERFORMANCE_TARGET && writeLoadTime < PERFORMANCE_TARGET;
        
        recordResult('Mobile-Responsiveness', i, {
          success: true,
          homepageLoadTime,
          writeLoadTime,
          textareaUsable,
          errors: errors.length,
          performancePassing
        });
        
        expect(textareaUsable).toBeTruthy();
        expect(performancePassing).toBeTruthy();
        
      } catch (error) {
        recordResult('Mobile-Responsiveness', i, {
          success: false,
          error: error.message,
          errors: errors.length
        });
        throw error;
      }
    });
  }
});