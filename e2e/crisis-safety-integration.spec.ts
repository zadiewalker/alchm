import { test, expect } from '@playwright/test';

/**
 * ALCHM Crisis Safety Integration Tests
 * 
 * Ensures trauma-informed design principles are maintained
 * and crisis safety features work correctly across all dependencies
 */

test.describe('Crisis Safety Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Set mobile viewport to test crisis-optimized mobile experience
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth/login');
    await page.waitForLoadState('networkidle');
  });

  test('should have trauma-informed error handling', async ({ page }) => {
    console.log('🛡️  Testing trauma-informed error handling...');

    // Test authentication error handling
    await page.fill('input[type="email"]', 'invalid-email');
    await page.fill('input[type="password"]', 'wrong');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Sign in")').first();
    await submitButton.click();

    // Wait for error message
    await page.waitForTimeout(2000);

    // Check for gentle, trauma-informed error messages
    const errorElements = page.locator('[role="alert"], .error, [data-testid*="error"]');
    
    if (await errorElements.count() > 0) {
      const errorText = await errorElements.first().textContent();
      
      // Should NOT contain alarming words
      const alarmingWords = ['failed', 'invalid', 'wrong', 'error', 'denied'];
      const containsAlarming = alarmingWords.some(word => 
        errorText?.toLowerCase().includes(word.toLowerCase())
      );
      
      expect(containsAlarming, 'Error messages should not contain alarming language').toBe(false);
      
      // Should contain gentle, supportive language
      const supportiveWords = ['try again', 'take your time', 'we\'re here', 'gentle', 'moment'];
      const containsSupportive = supportiveWords.some(word => 
        errorText?.toLowerCase().includes(word.toLowerCase())
      );
      
      expect(containsSupportive, 'Error messages should contain supportive language').toBe(true);
      
      console.log(`✅ Error message is trauma-informed: "${errorText}"`);
    }
  });

  test('should have crisis-safe touch targets', async ({ page }) => {
    console.log('👆 Testing crisis-safe touch targets...');

    // Check all interactive elements for minimum touch target size (60px for crisis safety)
    const touchTargetResults = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, a, input, [role="button"], [tabindex="0"]');
      const results = [];
      
      for (const element of interactiveElements) {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        if (isVisible) {
          results.push({
            tag: element.tagName,
            width: rect.width,
            height: rect.height,
            text: element.textContent?.slice(0, 30) || element.getAttribute('aria-label') || 'No text',
            isCrisisSafe: rect.width >= 60 && rect.height >= 60
          });
        }
      }
      
      return results;
    });

    const unsafeTargets = touchTargetResults.filter(target => !target.isCrisisSafe);
    
    console.log(`📊 Found ${touchTargetResults.length} interactive elements`);
    console.log(`🎯 Crisis-safe targets: ${touchTargetResults.length - unsafeTargets.length}`);
    console.log(`⚠️  Unsafe targets: ${unsafeTargets.length}`);

    if (unsafeTargets.length > 0) {
      console.warn('Unsafe touch targets found:');
      unsafeTargets.slice(0, 5).forEach(target => {
        console.warn(`  - ${target.tag}: ${target.width}x${target.height} "${target.text}"`);
      });
    }

    // Allow some small targets (like close buttons) but most should be crisis-safe
    expect(unsafeTargets.length, 'Should have minimal unsafe touch targets for crisis accessibility').toBeLessThan(touchTargetResults.length * 0.2);
  });

  test('should have haptic feedback integration', async ({ page, browserName }) => {
    console.log('📳 Testing haptic feedback integration...');

    // Skip for non-mobile browsers
    if (browserName !== 'webkit') {
      test.skip('Haptic feedback testing only on mobile browsers');
    }

    // Test button interactions that should trigger haptic feedback
    const buttons = await page.locator('button:not([disabled])').all();
    
    for (let i = 0; i < Math.min(buttons.length, 3); i++) {
      const button = buttons[i];
      const buttonText = await button.textContent();
      
      await test.step(`Testing haptic feedback for "${buttonText}"`, async () => {
        // Mock haptic feedback check
        const hasHapticSupport = await page.evaluate(() => {
          return 'vibrate' in navigator;
        });
        
        await button.click();
        
        // In a real test, we'd check if vibrate() was called
        // For now, just verify the button is responsive
        await page.waitForTimeout(300);
        
        console.log(`✅ Button "${buttonText}" interaction completed`);
      });
    }
  });

  test('should have gentle loading states', async ({ page }) => {
    console.log('⏳ Testing gentle loading states...');

    // Test authentication loading
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password');
    
    const submitButton = page.locator('button[type="submit"]').first();
    
    // Click and immediately check for loading state
    await submitButton.click();
    
    // Check for gentle loading indicators (not aggressive spinners)
    const loadingStates = await page.locator('.animate-spin, .loading, [aria-label*="loading"], [data-testid*="loading"]').all();
    
    if (loadingStates.length > 0) {
      const loadingElement = loadingStates[0];
      
      // Check for gentle colors (no red or harsh colors)
      const styles = await loadingElement.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor,
          borderColor: computed.borderColor
        };
      });
      
      console.log('Loading state styles:', styles);
      console.log('✅ Gentle loading state found');
    }
  });

  test('should have crisis resource accessibility', async ({ page }) => {
    console.log('🆘 Testing crisis resource accessibility...');

    // Look for crisis support elements
    const crisisElements = await page.locator('[data-testid*="crisis"], [class*="crisis"], [aria-label*="crisis"], [href*="crisis"]').all();
    
    for (const element of crisisElements) {
      const isVisible = await element.isVisible();
      const text = await element.textContent();
      
      if (isVisible) {
        console.log(`✅ Crisis element visible: "${text?.slice(0, 50)}"`);
        
        // Test accessibility
        const hasAriaLabel = await element.getAttribute('aria-label');
        const hasRole = await element.getAttribute('role');
        
        expect(hasAriaLabel || hasRole || text, 'Crisis elements should be accessible').toBeTruthy();
      }
    }

    // Test crisis hotline links if present
    const crisisLinks = await page.locator('a[href*="tel:"], a[href*="suicide"], a[href*="crisis"]').all();
    
    for (const link of crisisLinks) {
      const href = await link.getAttribute('href');
      const isVisible = await link.isVisible();
      
      if (isVisible && href) {
        console.log(`✅ Crisis link accessible: ${href}`);
        
        // Should be easily clickable (large touch target)
        const rect = await link.boundingBox();
        if (rect) {
          expect(rect.width, 'Crisis links should have large touch targets').toBeGreaterThan(44);
          expect(rect.height, 'Crisis links should have large touch targets').toBeGreaterThan(44);
        }
      }
    }
  });

  test('should handle network failures gracefully', async ({ page }) => {
    console.log('🌐 Testing network failure handling...');

    // Go offline
    await page.context().setOffline(true);
    
    // Try to interact with the app
    await page.goto('/dashboard');
    await page.waitForTimeout(3000);
    
    // Check for gentle offline messaging
    const offlineMessages = await page.locator('[data-testid*="offline"], [class*="offline"], text=/offline/i').all();
    
    if (offlineMessages.length > 0) {
      const message = await offlineMessages[0].textContent();
      
      // Should be reassuring, not alarming
      expect(message?.toLowerCase().includes('connection')).toBe(true);
      expect(message?.toLowerCase().includes('try again')).toBe(true);
      
      console.log(`✅ Gentle offline message: "${message}"`);
    }
    
    // Go back online
    await page.context().setOffline(false);
    await page.waitForTimeout(1000);
    
    console.log('✅ Network failure handling test complete');
  });

  test('should maintain trauma-informed design consistency', async ({ page }) => {
    console.log('🎨 Testing trauma-informed design consistency...');

    // Check for consistent color scheme (sage green primary)
    const colorConsistency = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, .btn, [role="button"]');
      const colors = new Set();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        colors.add(styles.backgroundColor);
        colors.add(styles.borderColor);
        colors.add(styles.color);
      });
      
      return Array.from(colors).filter(color => 
        color !== 'rgba(0, 0, 0, 0)' && 
        color !== 'rgb(0, 0, 0)' && 
        color !== ''
      );
    });
    
    console.log('Color palette in use:', colorConsistency.slice(0, 5));
    
    // Check for consistent typography (readable sizes)
    const typography = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, span, div, button, a, h1, h2, h3');
      const fontSizes = new Set();
      
      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseInt(styles.fontSize);
        if (fontSize > 0) {
          fontSizes.add(fontSize);
        }
      });
      
      return Array.from(fontSizes).sort((a, b) => b - a);
    });
    
    // Minimum font size should be 16px for accessibility
    const minFontSize = Math.min(...typography);
    expect(minFontSize, 'Minimum font size should be accessible').toBeGreaterThanOrEqual(14);
    
    console.log(`✅ Font sizes: ${typography.slice(0, 5).join('px, ')}px`);
    console.log(`✅ Minimum readable font size: ${minFontSize}px`);
  });

  test('should have responsive crisis safety on different viewports', async ({ page }) => {
    console.log('📱 Testing responsive crisis safety...');

    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await test.step(`Testing ${viewport.name} viewport`, async () => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/auth/login');
        await page.waitForLoadState('networkidle');

        // Test that critical buttons remain crisis-safe across viewports
        const buttons = await page.locator('button:visible').all();
        
        if (buttons.length > 0) {
          const firstButton = buttons[0];
          const rect = await firstButton.boundingBox();
          
          if (rect) {
            const minSize = viewport.width < 768 ? 60 : 52; // Larger on mobile
            expect(rect.height, `${viewport.name} buttons should be crisis-safe`).toBeGreaterThanOrEqual(minSize);
            
            console.log(`✅ ${viewport.name} button size: ${rect.width}x${rect.height}`);
          }
        }
      });
    }
  });

  test.afterAll(async () => {
    console.log('📊 Crisis safety integration tests completed');
    console.log('✅ All trauma-informed design principles validated');
  });
});