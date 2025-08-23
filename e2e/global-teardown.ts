// Global teardown for Playwright tests
import { chromium, FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting ALCHM E2E Test Teardown...')

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  try {
    await page.goto(config.webServer?.url || 'http://localhost:3000')
    
    // Clean up test data
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    console.log('✅ ALCHM E2E Test Teardown Complete')
  } catch (error) {
    console.error('❌ Teardown failed:', error)
  } finally {
    await context.close()
    await browser.close()
  }
}

export default globalTeardown