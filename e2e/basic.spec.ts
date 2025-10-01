// Basic smoke test for ALCHM
import { test, expect } from '@playwright/test'

test.describe('Basic Application Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check for the ALCHM title
    await expect(page.locator('h1')).toContainText('ALCHM')
    
    // Check for key elements
    await expect(page.locator('text=Your Digital Sanctuary')).toBeVisible()
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Click on Sign In link
    await page.click('text=Sign In')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/)
  })

  test('should load journal static page', async ({ page }) => {
    await page.goto('/journal.html')
    
    // Should show journal interface with specific selector
    await expect(page.locator('h1').filter({ hasText: 'Your Journal' }).first()).toBeVisible()
    await expect(page.locator('text=Welcome back to your digital sanctuary')).toBeVisible()
  })

  test('should show authentication test page', async ({ page }) => {
    await page.goto('/login.html')
    
    // Should show authentication elements
    await expect(page.locator('text=ALCHM Authentication')).toBeVisible()
    await expect(page.locator('text=Continue with Google')).toBeVisible()
  })
})