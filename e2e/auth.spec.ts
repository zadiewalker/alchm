// End-to-end tests for authentication flows
import { test, expect, Page } from '@playwright/test'

// Test utilities for authentication
class AuthPage {
  constructor(private page: Page) {}

  async navigateToLogin() {
    await this.page.goto('/login')
    await this.page.waitForLoadState('networkidle')
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email-input"]', email)
    await this.page.fill('[data-testid="password-input"]', password)
    await this.page.click('[data-testid="login-button"]')
  }

  async logout() {
    await this.page.click('[data-testid="user-menu"]')
    await this.page.click('[data-testid="logout-button"]')
  }

  async expectLoggedIn() {
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible()
  }

  async expectLoggedOut() {
    await expect(this.page.locator('[data-testid="login-button"]')).toBeVisible()
  }
}

test.describe('Authentication Flow', () => {
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
    // Clear any existing authentication state
    await page.context().clearCookies()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  })

  test('should display login page correctly', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Check for essential login elements
    await expect(page.locator('h1')).toContainText('Sign In')
    await expect(page.locator('[data-testid="email-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
  })

  test('should handle successful login', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Use test credentials
    await authPage.login('test@alchm.app', 'testpassword123')
    
    // Should redirect to dashboard/home
    await page.waitForURL('**/home', { timeout: 10000 })
    await authPage.expectLoggedIn()
    
    // Should display user information
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible()
  })

  test('should handle login validation errors', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Test empty form
    await page.click('[data-testid="login-button"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Email is required')
    
    // Test invalid email format
    await authPage.login('invalid-email', 'password')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a valid email')
    
    // Test short password
    await authPage.login('test@example.com', '123')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Password must be at least')
  })

  test('should handle login failure', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Use invalid credentials
    await authPage.login('invalid@example.com', 'wrongpassword')
    
    // Should show error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid email or password')
    
    // Should remain on login page
    await expect(page).toHaveURL(/.*login.*/)
    await authPage.expectLoggedOut()
  })

  test('should handle logout', async ({ page }) => {
    // First login
    await authPage.navigateToLogin()
    await authPage.login('test@alchm.app', 'testpassword123')
    await page.waitForURL('**/home')
    await authPage.expectLoggedIn()
    
    // Then logout
    await authPage.logout()
    
    // Should redirect to login page
    await page.waitForURL('**/login')
    await authPage.expectLoggedOut()
  })

  test('should persist session across page refreshes', async ({ page }) => {
    // Login
    await authPage.navigateToLogin()
    await authPage.login('test@alchm.app', 'testpassword123')
    await page.waitForURL('**/home')
    
    // Refresh page
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    // Should still be logged in
    await authPage.expectLoggedIn()
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible()
  })

  test('should handle session expiration', async ({ page }) => {
    // Login
    await authPage.navigateToLogin()
    await authPage.login('test@alchm.app', 'testpassword123')
    await page.waitForURL('**/home')
    
    // Simulate expired session by clearing tokens
    await page.evaluate(() => {
      localStorage.removeItem('alchm_session')
      sessionStorage.clear()
    })
    
    // Navigate to a protected route
    await page.goto('/journals')
    
    // Should redirect to login
    await page.waitForURL('**/login')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Session expired')
  })

  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access protected route while logged out
    await page.goto('/journals')
    
    // Should redirect to login with return URL
    await page.waitForURL(/.*login.*/)
    
    // Login
    await authPage.login('test@alchm.app', 'testpassword123')
    
    // Should redirect to originally requested page
    await page.waitForURL('**/journals')
    await expect(page.locator('h1')).toContainText('Journal Entries')
  })

  test('should handle "Remember Me" functionality', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Check remember me
    await page.check('[data-testid="remember-me-checkbox"]')
    await authPage.login('test@alchm.app', 'testpassword123')
    await page.waitForURL('**/home')
    
    // Close and reopen browser (simulate)
    await page.context().close()
    const newPage = await page.context().newPage()
    await newPage.goto('/')
    
    // Should still be logged in
    await expect(newPage.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should handle password reset flow', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Click forgot password
    await page.click('[data-testid="forgot-password-link"]')
    await page.waitForURL('**/reset-password')
    
    // Enter email
    await page.fill('[data-testid="reset-email-input"]', 'test@alchm.app')
    await page.click('[data-testid="reset-submit-button"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Password reset email sent')
  })

  test('should handle registration flow', async ({ page }) => {
    await authPage.navigateToLogin()
    
    // Click sign up link
    await page.click('[data-testid="signup-link"]')
    await page.waitForURL('**/register')
    
    // Fill registration form
    await page.fill('[data-testid="signup-email-input"]', 'newuser@alchm.app')
    await page.fill('[data-testid="signup-password-input"]', 'newpassword123')
    await page.fill('[data-testid="signup-confirm-password-input"]', 'newpassword123')
    await page.check('[data-testid="terms-checkbox"]')
    
    await page.click('[data-testid="signup-button"]')
    
    // Should redirect to verification page or dashboard
    await page.waitForURL(/.*verify.*|.*home.*/)
  })
})

test.describe('Authentication Security', () => {
  test('should protect against XSS in login form', async ({ page }) => {
    await page.goto('/login')
    
    const xssPayload = '<script>alert("xss")</script>'
    
    await page.fill('[data-testid="email-input"]', xssPayload)
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')
    
    // Should not execute script
    const alerts = []
    page.on('dialog', dialog => {
      alerts.push(dialog.message())
      dialog.dismiss()
    })
    
    await page.waitForTimeout(2000)
    expect(alerts).toHaveLength(0)
  })

  test('should handle rate limiting', async ({ page }) => {
    await page.goto('/login')
    
    // Attempt multiple failed logins
    for (let i = 0; i < 6; i++) {
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'wrongpassword')
      await page.click('[data-testid="login-button"]')
      await page.waitForTimeout(1000)
    }
    
    // Should show rate limit message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Too many attempts')
  })

  test('should clear sensitive data on logout', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@alchm.app')
    await page.fill('[data-testid="password-input"]', 'testpassword123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('**/home')
    
    // Logout
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    
    // Check that session data is cleared
    const sessionData = await page.evaluate(() => {
      return {
        localStorage: Object.keys(localStorage),
        sessionStorage: Object.keys(sessionStorage)
      }
    })
    
    expect(sessionData.localStorage).not.toContain('alchm_session')
    expect(sessionData.sessionStorage).toHaveLength(0)
  })
})