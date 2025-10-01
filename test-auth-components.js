// Test script to check if authentication components are rendering
const playwright = require('playwright');

async function testAuthComponents() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  console.log('🔍 Testing authentication components...');
  
  try {
    // Navigate to login page
    await page.goto('http://localhost:3000/en/auth/login', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait for the page to fully load
    await page.waitForTimeout(3000);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'auth-test-screenshot-before.png' });
    
    // Check if age verification is present and click it
    const ageVerificationButton = await page.$('button:has-text("I am 18+ and ready to heal")');
    if (ageVerificationButton) {
      console.log('🔞 Age verification required - clicking...');
      await ageVerificationButton.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'auth-test-screenshot-after-age.png' });
    }
    
    // Check for authentication elements
    const googleButton = await page.$('button:has-text("Continue with Google")');
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const submitButton = await page.$('button[type="submit"]');
    
    console.log('🔐 Google OAuth Button:', googleButton ? '✅ FOUND' : '❌ MISSING');
    console.log('📧 Email Input Field:', emailInput ? '✅ FOUND' : '❌ MISSING');
    console.log('🔒 Password Input Field:', passwordInput ? '✅ FOUND' : '❌ MISSING');
    console.log('🚀 Submit Button:', submitButton ? '✅ FOUND' : '❌ MISSING');
    
    // Check for crisis support elements
    const crisisButton = await page.$('a[href="tel:988"]');
    console.log('🆘 Crisis Support (988):', crisisButton ? '✅ FOUND' : '❌ MISSING');
    
    // Check for JavaScript errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Test a button click to see if JavaScript is working
    if (googleButton) {
      try {
        await googleButton.click();
        console.log('✅ Google button click works');
      } catch (e) {
        console.log('❌ Google button click failed:', e.message);
      }
    }
    
    if (errors.length > 0) {
      console.log('⚠️  JavaScript Errors:');
      errors.forEach(error => console.log('  -', error));
    } else {
      console.log('✅ No JavaScript errors detected');
    }
    
    // Check bundle size by looking at network requests
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 'unknown'
        });
      }
    });
    
    console.log('\n📦 JavaScript Bundle Analysis:');
    responses.forEach(resp => {
      console.log(`  ${resp.url.split('/').pop()}: ${resp.size} bytes`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  testAuthComponents().catch(console.error);
}

module.exports = { testAuthComponents };