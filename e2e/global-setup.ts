// Global setup for Playwright tests
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting ALCHM E2E Test Setup...')

  // Start browser for setup
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...')
    await page.goto(config.webServer?.url || 'http://localhost:3000')
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    // Verify the app is running
    const title = await page.title()
    console.log(`📄 App title: ${title}`)
    
    // Setup test data if needed
    await setupTestData(page)
    
    console.log('✅ ALCHM E2E Test Setup Complete')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    throw error
  } finally {
    await context.close()
    await browser.close()
  }
}

async function setupTestData(page: any) {
  console.log('📝 Setting up test data...')
  
  // Clear any existing test data
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  // Set up test environment variables
  await page.evaluate(() => {
    localStorage.setItem('e2e-test-mode', 'true')
  })
  
  console.log('✅ Test data setup complete')
}

export default globalSetup