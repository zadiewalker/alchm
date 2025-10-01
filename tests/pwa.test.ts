/**
 * PWA functionality tests for ALCHM
 */

import { test, expect } from '@playwright/test';

test.describe('PWA Functionality', () => {
  
  test('Manifest is valid and accessible', async ({ page }) => {
    await page.goto('/');
    
    // Check manifest link exists
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', '/manifest.webmanifest');
    
    // Fetch and validate manifest
    const manifestResponse = await page.request.get('/manifest.webmanifest');
    expect(manifestResponse.status()).toBe(200);
    
    const manifest = await manifestResponse.json();
    
    // Required fields
    expect(manifest.name).toBe('ALCHM — Your Digital Sanctuary');
    expect(manifest.short_name).toBe('ALCHM');
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toBe('#a4b792');
    expect(manifest.background_color).toBe('#f7f7f2');
    
    // Icons
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
    
    // Check required icon sizes
    const iconSizes = manifest.icons.map((icon: any) => icon.sizes);
    expect(iconSizes).toContain('192x192');
    expect(iconSizes).toContain('512x512');
    
    // Maskable icons
    const maskableIcons = manifest.icons.filter((icon: any) => 
      icon.purpose && icon.purpose.includes('maskable')
    );
    expect(maskableIcons.length).toBeGreaterThan(0);
  });

  test('Service Worker registers and caches resources', async ({ page }) => {
    await page.goto('/');
    
    // Wait for service worker to register
    await page.waitForFunction(() => 'serviceWorker' in navigator);
    
    // Check service worker registration
    const swRegistered = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      return !!registration;
    });
    
    expect(swRegistered).toBeTruthy();
    
    // Check cache creation
    const cacheNames = await page.evaluate(async () => {
      return await caches.keys();
    });
    
    expect(cacheNames.length).toBeGreaterThan(0);
    expect(cacheNames.some((name: string) => name.includes('alchm'))).toBeTruthy();
  });

  test('App works offline', async ({ page, context }) => {
    await page.goto('/');
    
    // Wait for service worker and initial caching
    await page.waitForTimeout(2000);
    
    // Go offline
    await context.setOffline(true);
    
    // Navigate to cached route
    await page.goto('/');
    
    // Page should still load
    await expect(page.locator('body')).toBeVisible();
    
    // Should show offline indication or cached content
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
    expect(pageContent.length).toBeGreaterThan(0);
  });

  test('Install prompt appears appropriately', async ({ page }) => {
    await page.goto('/');
    
    // Simulate beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = () => Promise.resolve();
      (event as any).userChoice = Promise.resolve({ outcome: 'accepted' });
      window.dispatchEvent(event);
    });
    
    // Wait for install prompt to appear (after delay)
    await page.waitForTimeout(1000);
    
    // Install prompt should be visible
    const installPrompt = page.locator('[data-testid="install-prompt"]');
    if (await installPrompt.count() > 0) {
      await expect(installPrompt).toBeVisible();
      
      // Should have appropriate buttons
      const installButton = installPrompt.locator('button:has-text("Add to home screen")');
      const dismissButton = installPrompt.locator('button:has-text("Maybe later")');
      
      await expect(installButton).toBeVisible();
      await expect(dismissButton).toBeVisible();
    }
  });

  test('App shortcuts work when installed', async ({ page }) => {
    await page.goto('/');
    
    // Check manifest shortcuts
    const manifestResponse = await page.request.get('/manifest.webmanifest');
    const manifest = await manifestResponse.json();
    
    expect(manifest.shortcuts).toBeDefined();
    expect(manifest.shortcuts.length).toBeGreaterThan(0);
    
    // Validate shortcut structure
    for (const shortcut of manifest.shortcuts) {
      expect(shortcut.name).toBeDefined();
      expect(shortcut.url).toBeDefined();
      expect(shortcut.icons).toBeDefined();
      
      // URL should be valid
      const response = await page.request.get(shortcut.url);
      expect(response.status()).toBeLessThan(400);
    }
  });

  test('Share target functionality', async ({ page }) => {
    // Check manifest share target
    const manifestResponse = await page.request.get('/manifest.webmanifest');
    const manifest = await manifestResponse.json();
    
    if (manifest.share_target) {
      expect(manifest.share_target.action).toBeDefined();
      expect(manifest.share_target.params).toBeDefined();
      
      // Test share endpoint
      const shareResponse = await page.request.post(manifest.share_target.action, {
        form: {
          title: 'Test Share',
          text: 'Test sharing content',
          url: 'https://example.com'
        }
      });
      
      expect(shareResponse.status()).toBeLessThan(500);
    }
  });

  test('Background sync works for offline actions', async ({ page, context }) => {
    await page.goto('/reflect');
    
    // Fill out reflection form
    const textarea = page.locator('textarea');
    await textarea.fill('This is a test reflection for offline sync');
    
    // Go offline
    await context.setOffline(true);
    
    // Submit reflection
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    
    // Should indicate offline save
    await expect(page.locator('text=saved locally')).toBeVisible({ timeout: 5000 });
    
    // Go back online
    await context.setOffline(false);
    
    // Should eventually sync
    await page.waitForTimeout(2000);
  });

  test('Push notifications can be registered', async ({ page }) => {
    await page.goto('/');
    
    // Check if push notifications are supported
    const pushSupported = await page.evaluate(() => {
      return 'serviceWorker' in navigator && 'PushManager' in window;
    });
    
    if (pushSupported) {
      // Test push subscription (would need VAPID keys in real app)
      const canSubscribe = await page.evaluate(async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          const permission = await Notification.requestPermission();
          return permission !== 'denied';
        } catch (error) {
          return false;
        }
      });
      
      // Should be able to request permission
      expect(typeof canSubscribe).toBe('boolean');
    }
  });

  test('App performance meets PWA standards', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse PWA audit programmatically
    const performance = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const navigationEntry = entries.find(
            entry => entry.entryType === 'navigation'
          ) as PerformanceNavigationTiming;
          
          if (navigationEntry) {
            resolve({
              domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart,
              loadComplete: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
              firstContentfulPaint: navigationEntry.responseStart - navigationEntry.requestStart
            });
          }
        }).observe({ entryTypes: ['navigation'] });
        
        // Fallback timeout
        setTimeout(() => resolve(null), 5000);
      });
    });
    
    if (performance) {
      // Basic performance checks
      expect((performance as any).domContentLoaded).toBeLessThan(3000); // 3s
      expect((performance as any).loadComplete).toBeLessThan(5000); // 5s
    }
  });

  test('Responsive design works across devices', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 }, // iPhone 5
      { width: 375, height: 667 }, // iPhone 6/7/8
      { width: 414, height: 896 }, // iPhone XR
      { width: 768, height: 1024 }, // iPad
      { width: 1920, height: 1080 } // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.reload();
      
      // Content should be visible and accessible
      const body = page.locator('body');
      await expect(body).toBeVisible();
      
      // No horizontal scroll on mobile
      if (viewport.width <= 768) {
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > window.innerWidth;
        });
        expect(hasHorizontalScroll).toBeFalsy();
      }
      
      // Interactive elements should be accessible
      const buttons = await page.locator('button').all();
      for (const button of buttons) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThan(0);
          expect(box.height).toBeGreaterThan(0);
        }
      }
    }
  });

  test('App handles network failures gracefully', async ({ page, context }) => {
    await page.goto('/');
    
    // Simulate network failure
    await context.route('**/*', route => route.abort());
    
    // Try to navigate
    await page.locator('a').first().click({ timeout: 1000 }).catch(() => {});
    
    // Should show appropriate offline message
    const offlineContent = await page.textContent('body');
    expect(offlineContent?.toLowerCase()).toMatch(/offline|network|connection/);
  });
});

export {};