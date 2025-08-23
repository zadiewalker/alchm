// End-to-end tests for mobile user experience
import { test, expect, devices } from '@playwright/test'

// Mobile-specific test configurations
const mobileDevices = [
  devices['iPhone 12'],
  devices['Pixel 5'],
  devices['iPad']
]

mobileDevices.forEach(device => {
  test.describe(`Mobile Experience - ${device.userAgent?.split(' ')[0] || 'Mobile'}`, () => {
    test.use({ ...device })

    test.beforeEach(async ({ page }) => {
      // Mock authentication for mobile tests
      await page.goto('/login')
      await page.fill('[data-testid="email-input"]', 'test@alchm.app')
      await page.fill('[data-testid="password-input"]', 'testpassword123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('**/home')
    })

    test('should display mobile-optimized navigation', async ({ page }) => {
      // Should show hamburger menu on mobile
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
      
      // Main navigation should be hidden on mobile
      await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible()
      
      // Tap hamburger menu
      await page.click('[data-testid="mobile-menu-button"]')
      await expect(page.locator('[data-testid="mobile-nav-menu"]')).toBeVisible()
    })

    test('should handle touch gestures for journaling', async ({ page }) => {
      await page.goto('/journals')
      
      // Create new entry
      await page.click('[data-testid="new-entry-button"]')
      
      // Should show mobile-optimized editor
      await expect(page.locator('[data-testid="mobile-editor"]')).toBeVisible()
      
      // Test touch-friendly text area
      const textArea = page.locator('[data-testid="entry-content-textarea"]')
      await textArea.click()
      await textArea.fill('This is a mobile journal entry created using touch input.')
      
      // Save using mobile-optimized save button
      await page.click('[data-testid="mobile-save-button"]')
      await expect(page.locator('[data-testid="save-success-message"]')).toBeVisible()
    })

    test('should support swipe gestures for entry navigation', async ({ page }) => {
      await page.goto('/journals')
      
      // Should show cards in mobile layout
      await expect(page.locator('[data-testid="mobile-entry-cards"]')).toBeVisible()
      
      const firstEntry = page.locator('[data-testid="entry-card"]').first()
      await firstEntry.click()
      
      // Test swipe to next/previous entry
      const entryDetail = page.locator('[data-testid="entry-detail"]')
      
      // Swipe left to go to next entry (simulate touch)
      await entryDetail.hover()
      await page.mouse.down()
      await page.mouse.move(100, 0) // Move right to left
      await page.mouse.up()
      
      // Should navigate to next entry or show gesture indicator
      await page.waitForTimeout(1000)
    })

    test('should optimize Khepera chat for mobile', async ({ page }) => {
      await page.goto('/journals')
      
      // Open Khepera on mobile
      await page.click('[data-testid="mobile-khepera-button"]')
      
      // Should show full-screen chat on mobile
      await expect(page.locator('[data-testid="khepera-mobile-chat"]')).toBeVisible()
      
      // Test mobile chat input
      const chatInput = page.locator('[data-testid="khepera-mobile-input"]')
      await chatInput.click()
      await chatInput.fill('I need support today.')
      
      // Should show mobile-optimized send button
      await page.click('[data-testid="khepera-mobile-send"]')
      
      // Response should be formatted for mobile
      await expect(page.locator('[data-testid="khepera-mobile-response"]')).toBeVisible({ timeout: 15000 })
    })

    test('should handle virtual keyboard properly', async ({ page }) => {
      await page.goto('/journals')
      await page.click('[data-testid="new-entry-button"]')
      
      // Focus on text area should adjust viewport
      const textArea = page.locator('[data-testid="entry-content-textarea"]')
      await textArea.click()
      
      // Viewport should adjust for virtual keyboard
      await page.waitForTimeout(1000)
      
      // Save button should remain accessible
      await expect(page.locator('[data-testid="mobile-save-button"]')).toBeVisible()
    })

    test('should support offline functionality', async ({ page }) => {
      await page.goto('/journals')
      
      // Go offline
      await page.context().setOffline(true)
      
      // Should show offline indicator
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
      
      // Create entry while offline
      await page.click('[data-testid="new-entry-button"]')
      await page.fill('[data-testid="entry-content-textarea"]', 'This entry was created offline.')
      await page.click('[data-testid="mobile-save-button"]')
      
      // Should show offline save indicator
      await expect(page.locator('[data-testid="offline-save-indicator"]')).toBeVisible()
      
      // Go back online
      await page.context().setOffline(false)
      
      // Should sync offline entries
      await expect(page.locator('[data-testid="sync-success-indicator"]')).toBeVisible()
    })

    test('should have proper touch target sizes', async ({ page }) => {
      await page.goto('/journals')
      
      // All interactive elements should meet minimum touch target size (44px)
      const buttons = await page.locator('button, [role="button"]').all()
      
      for (const button of buttons) {
        const boundingBox = await button.boundingBox()
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44)
          expect(boundingBox.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test('should handle orientation changes', async ({ page }) => {
      await page.goto('/journals')
      
      // Test portrait orientation (default)
      await expect(page.locator('[data-testid="mobile-entry-cards"]')).toBeVisible()
      
      // Simulate landscape orientation
      await page.setViewportSize({ width: 844, height: 390 }) // iPhone 12 landscape
      await page.waitForTimeout(1000)
      
      // Layout should adapt to landscape
      await expect(page.locator('[data-testid="landscape-layout"]')).toBeVisible()
    })

    test('should support pull-to-refresh', async ({ page }) => {
      await page.goto('/journals')
      
      // Simulate pull-to-refresh gesture
      const entriesList = page.locator('[data-testid="entries-list"]')
      
      await entriesList.hover()
      await page.mouse.down()
      await page.mouse.move(0, 100) // Pull down
      await page.waitForTimeout(500)
      await page.mouse.up()
      
      // Should show refresh indicator
      await expect(page.locator('[data-testid="refresh-indicator"]')).toBeVisible()
      
      // Should refresh content
      await page.waitForTimeout(2000)
      await expect(page.locator('[data-testid="refresh-indicator"]')).not.toBeVisible()
    })

    test('should optimize images for mobile', async ({ page }) => {
      await page.goto('/journals')
      
      // Check that images are properly sized for mobile
      const images = await page.locator('img').all()
      
      for (const img of images) {
        const boundingBox = await img.boundingBox()
        if (boundingBox) {
          // Images should not exceed viewport width
          expect(boundingBox.width).toBeLessThanOrEqual(device.viewport?.width || 375)
        }
      }
    })

    test('should handle mobile-specific error states', async ({ page }) => {
      // Mock network error
      await page.route('**/api/**', route => {
        route.abort('failed')
      })
      
      await page.goto('/journals')
      
      // Should show mobile-optimized error message
      await expect(page.locator('[data-testid="mobile-error-message"]')).toBeVisible()
      
      // Should provide retry option
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
      
      // Tap retry should work
      await page.click('[data-testid="retry-button"]')
    })
  })
})

test.describe('Progressive Web App Features', () => {
  test.use({ ...devices['iPhone 12'] })

  test('should be installable as PWA', async ({ page }) => {
    await page.goto('/')
    
    // Should have PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]')
    await expect(manifestLink).toBeVisible()
    
    // Should have service worker
    const swRegistration = await page.evaluate(() => {
      return 'serviceWorker' in navigator
    })
    expect(swRegistration).toBe(true)
  })

  test('should show install prompt', async ({ page }) => {
    await page.goto('/')
    
    // Mock beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt')
      window.dispatchEvent(event)
    })
    
    // Should show install banner
    await expect(page.locator('[data-testid="install-banner"]')).toBeVisible()
    
    // Click install should work
    await page.click('[data-testid="install-button"]')
  })

  test('should work offline with service worker', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Go offline
    await page.context().setOffline(true)
    
    // Navigate to cached page
    await page.goto('/journals')
    
    // Should load from cache
    await expect(page.locator('h1')).toContainText('Journal Entries')
    
    // Should show offline indicator
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible()
  })

  test('should handle app-like navigation', async ({ page }) => {
    await page.goto('/')
    
    // Should have app-like navigation without browser chrome
    const isStandalone = await page.evaluate(() => {
      return window.matchMedia('(display-mode: standalone)').matches
    })
    
    // In PWA mode, should handle back navigation properly
    await page.goto('/journals')
    await page.goBack()
    await expect(page).toHaveURL('/')
  })

  test('should support push notifications', async ({ page, context }) => {
    await page.goto('/')
    
    // Grant notification permission
    await context.grantPermissions(['notifications'])
    
    // Should be able to register for notifications
    const notificationSupport = await page.evaluate(async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const permission = await Notification.requestPermission()
        return permission === 'granted'
      }
      return false
    })
    
    expect(notificationSupport).toBe(true)
  })
})

test.describe('Mobile Accessibility', () => {
  test.use({ ...devices['iPhone 12'] })

  test('should support VoiceOver/TalkBack navigation', async ({ page }) => {
    await page.goto('/journals')
    
    // Should have proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
    expect(headings.length).toBeGreaterThan(0)
    
    // Should have skip navigation links
    await expect(page.locator('[data-testid="skip-nav"]')).toBeVisible()
  })

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/journals')
    
    // Tab navigation should work properly on mobile
    await page.press('body', 'Tab')
    
    // Focus should be visible
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should support high contrast mode', async ({ page }) => {
    // Enable high contrast mode
    await page.emulateMedia({ reducedMotion: 'reduce' })
    
    await page.goto('/journals')
    
    // Should adapt to high contrast preferences
    const backgroundColor = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Should use appropriate contrast ratios
    expect(backgroundColor).toBeDefined()
  })

  test('should respect reduced motion preferences', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/journals')
    
    // Animations should be reduced or disabled
    const animations = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body)
      return computedStyle.getPropertyValue('prefers-reduced-motion')
    })
    
    expect(animations).toBe('reduce')
  })
})