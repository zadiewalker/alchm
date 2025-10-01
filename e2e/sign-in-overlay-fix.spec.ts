import { test, expect } from '@playwright/test';

test.describe('Sign-in Page Overlay Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page
    await page.goto('/auth/login');
  });

  test('should not have floating elements blocking sign-in buttons', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that crisis floating button is not visible on auth pages
    const crisisButton = page.locator('[aria-label*="Emergency crisis support"]');
    await expect(crisisButton).not.toBeVisible();
    
    // Check that PWA installer is not visible on auth pages
    const pwaInstaller = page.locator('text="Install ALCHM App"');
    await expect(pwaInstaller).not.toBeVisible();
    
    // Check that navigation overlay is not visible on auth pages
    const navigation = page.locator('[aria-label*="navigation"]');
    await expect(navigation).not.toBeVisible();
  });

  test('should have accessible sign-in buttons', async ({ page }) => {
    // Wait for sign-in buttons to be available
    await page.waitForSelector('button[aria-label*="Continue with"]', { state: 'visible' });
    
    // Check that Google sign-in button is visible and clickable
    const googleButton = page.locator('button[aria-label="Continue with Google"]');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
    
    // Check that Apple sign-in button is visible and clickable (if enabled)
    const appleButton = page.locator('button[aria-label="Continue with Apple"]');
    if (await appleButton.isVisible()) {
      await expect(appleButton).toBeEnabled();
    }
  });

  test('should not have any elements with z-index higher than sign-in content', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check that main sign-in content has appropriate z-index
    const mainContent = page.locator('.sign-in-page-priority');
    await expect(mainContent).toBeVisible();
    
    // Verify no elements are blocking the sign-in buttons by checking click accessibility
    const signInButtons = page.locator('button[aria-label*="Continue with"]');
    const buttonCount = await signInButtons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = signInButtons.nth(i);
      await expect(button).toBeVisible();
      // Check that button is not covered by other elements
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        // Click at the center of the button to ensure it's accessible
        await button.click({ trial: true }); // Trial click to verify accessibility
      }
    }
  });

  test('should handle responsive design without overlay issues', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Check that sign-in buttons are still accessible on mobile
    const googleButton = page.locator('button[aria-label="Continue with Google"]');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
    
    // Verify no overlapping elements on mobile
    const signInSection = page.locator('.card-sanctuary');
    await expect(signInSection).toBeVisible();
    
    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    
    // Check accessibility on tablet
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });

  test('should maintain crisis support accessibility without blocking sign-in', async ({ page }) => {
    // Even though crisis button should be hidden on auth pages,
    // ensure crisis support information is still available
    const crisisFooter = page.locator('footer');
    await expect(crisisFooter).toBeVisible();
    
    // Check that crisis information is present but not blocking
    const crisisText = page.locator('text="988 Lifeline"');
    await expect(crisisText).toBeVisible();
    
    // Verify footer doesn't block sign-in buttons
    const googleButton = page.locator('button[aria-label="Continue with Google"]');
    await expect(googleButton).toBeVisible();
    
    // Check that footer has appropriate z-index (lower than sign-in content)
    const footerZIndex = await crisisFooter.evaluate(el => 
      window.getComputedStyle(el).zIndex
    );
    expect(parseInt(footerZIndex) || 0).toBeLessThan(100); // Should be less than sign-in priority
  });

  test('should handle page navigation without overlay persistence', async ({ page }) => {
    // Navigate away from auth page
    await page.goto('/');
    
    // Verify floating elements appear on non-auth pages
    const crisisButton = page.locator('[aria-label*="Emergency crisis support"]');
    await expect(crisisButton).toBeVisible();
    
    // Navigate back to auth page
    await page.goto('/auth/login');
    await page.waitForLoadState('domcontentloaded');
    
    // Verify floating elements are hidden again
    await expect(crisisButton).not.toBeVisible();
    
    // Ensure sign-in buttons are still accessible
    const googleButton = page.locator('button[aria-label="Continue with Google"]');
    await expect(googleButton).toBeVisible();
    await expect(googleButton).toBeEnabled();
  });
});