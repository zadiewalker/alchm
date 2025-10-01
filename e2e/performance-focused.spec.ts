import { test, expect } from '@playwright/test';

test.describe('ALCHM Core Performance Tests', () => {
  
  test('Homepage Load Performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000', { waitUntil: 'load' });
    
    const loadTime = Date.now() - startTime;
    console.log(`🏠 Homepage Load Time: ${loadTime}ms`);
    
    // Check for critical content
    await expect(page.locator('text=The World\'s First Identity OS.')).toBeVisible();
    
    // Performance threshold
    expect(loadTime).toBeLessThan(3000);
  });

  test('Crisis Resources Critical Performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000/crisis-resources', { waitUntil: 'load' });
    
    const loadTime = Date.now() - startTime;
    console.log(`🆘 Crisis Resources Load Time: ${loadTime}ms`);
    
    // Crisis resources must load under 1 second
    expect(loadTime).toBeLessThan(1000);
  });

  test('JavaScript Bundle Analysis', async ({ page }) => {
    let totalJSSize = 0;
    let jsFileCount = 0;
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        jsFileCount++;
        response.body().then(body => {
          totalJSSize += body.length;
        }).catch(() => {});
      }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    await page.waitForTimeout(2000); // Allow all requests to complete
    
    console.log(`📦 JavaScript Files: ${jsFileCount}`);
    console.log(`📦 Total JS Size: ${(totalJSSize / 1024).toFixed(2)} KB`);
    
    // Bundle size expectations
    expect(totalJSSize).toBeLessThan(2 * 1024 * 1024); // Max 2MB total JS
  });
});