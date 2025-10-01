// Test crisis user access to emergency resources
const playwright = require('playwright');

async function testCrisisAccess() {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  
  console.log('🚨 Testing crisis user access to emergency resources...');
  
  try {
    // Test 1: 988 Crisis Button from Login Page
    console.log('\n📋 Test 1: Crisis Access from Login Page');
    await page.goto('http://localhost:3000/en/auth/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for age verification and click if present
    const ageVerificationButton = await page.$('button:has-text("I am 18+ and ready to heal")');
    if (ageVerificationButton) {
      await ageVerificationButton.click();
      await page.waitForTimeout(1000);
    }
    
    // Check for 988 crisis button
    const crisisCall = await page.$('a[href="tel:988"]');
    const crisisText = await page.$('a[href="sms:741741&body=HOME"]');
    console.log('  - 988 Call link accessible:', crisisCall ? '✅' : '❌');
    console.log('  - Crisis text link accessible:', crisisText ? '✅' : '❌');
    
    // Test 2: Global Crisis Button (SOS)
    console.log('\n📋 Test 2: Global Crisis Support (SOS Button)');
    const globalCrisisButton = await page.$('.crisis-support');
    if (globalCrisisButton) {
      console.log('✅ Global SOS button found');
      const href = await globalCrisisButton.getAttribute('href');
      const ariaLabel = await globalCrisisButton.getAttribute('aria-label');
      console.log('  - SOS button href:', href);
      console.log('  - SOS button aria-label:', ariaLabel);
      console.log('  - Accessible without auth: ✅');
    } else {
      console.log('❌ Global SOS button not found');
    }
    
    // Test 3: Direct Emergency Page Access
    console.log('\n📋 Test 3: Direct Emergency Page Access');
    try {
      await page.goto('http://localhost:3000/en/emergency', { waitUntil: 'networkidle', timeout: 10000 });
      const pageTitle = await page.title();
      console.log('  - Emergency page accessible:', pageTitle ? '✅' : '❌');
      console.log('  - Page title:', pageTitle);
    } catch (e) {
      console.log('  - Emergency page access: ❌', e.message);
    }
    
    // Test 4: Crisis Resources Without Authentication
    console.log('\n📋 Test 4: Crisis Resources Without Auth');
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for crisis resources on homepage
    const homeCrisisButton = await page.$('.crisis-support');
    console.log('  - Homepage SOS button:', homeCrisisButton ? '✅' : '❌');
    
    // Test 5: Mobile Crisis Access
    console.log('\n📋 Test 5: Mobile Crisis Access');
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('http://localhost:3000/en/auth/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Handle age verification on mobile
    const mobileAgeButton = await page.$('button:has-text("I am 18+ and ready to heal")');
    if (mobileAgeButton) {
      await mobileAgeButton.click();
      await page.waitForTimeout(1000);
    }
    
    const mobileCrisisCall = await page.$('a[href="tel:988"]');
    const mobileSOS = await page.$('.crisis-support');
    
    console.log('  - Mobile 988 button:', mobileCrisisCall ? '✅' : '❌');
    console.log('  - Mobile SOS button:', mobileSOS ? '✅' : '❌');
    
    if (mobileSOS) {
      const box = await mobileSOS.boundingBox();
      if (box) {
        console.log(`  - Mobile SOS size: ${Math.round(box.width)}x${Math.round(box.height)}px`);
        console.log('  - Touch-friendly size:', (box.width >= 80 && box.height >= 80) ? '✅' : '❌');
      }
    }
    
    // Test 6: Crisis Hotline Numbers
    console.log('\n📋 Test 6: Crisis Hotline Verification');
    const crisisNumbers = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="tel:"]'));
      return links.map(link => ({
        href: link.href,
        text: link.textContent?.trim()
      }));
    });
    
    crisisNumbers.forEach(number => {
      console.log(`  - Crisis number: ${number.href} (${number.text})`);
    });
    
    const has988 = crisisNumbers.some(n => n.href.includes('988'));
    console.log('  - 988 Crisis Hotline available:', has988 ? '✅' : '❌');
    
    // Test 7: Crisis Text Support
    console.log('\n📋 Test 7: Crisis Text Support');
    const textNumbers = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="sms:"]'));
      return links.map(link => ({
        href: link.href,
        text: link.textContent?.trim()
      }));
    });
    
    textNumbers.forEach(number => {
      console.log(`  - Crisis text: ${number.href} (${number.text})`);
    });
    
    const hasTextCrisis = textNumbers.some(n => n.href.includes('741741'));
    console.log('  - Crisis Text Line (741741) available:', hasTextCrisis ? '✅' : '❌');
    
    // Final screenshot
    await page.screenshot({ path: 'crisis-access-test.png' });
    
    console.log('\n🎉 Crisis access verification complete!');
    console.log('\n📊 CRISIS SAFETY SUMMARY:');
    console.log(`✅ 988 Crisis Hotline: ${has988 ? 'ACCESSIBLE' : 'MISSING'}`);
    console.log(`✅ Crisis Text Line: ${hasTextCrisis ? 'ACCESSIBLE' : 'MISSING'}`);
    console.log(`✅ Global SOS Button: ${globalCrisisButton ? 'ACCESSIBLE' : 'MISSING'}`);
    console.log(`✅ Mobile Crisis Support: ${mobileCrisisCall && mobileSOS ? 'ACCESSIBLE' : 'NEEDS WORK'}`);
    
  } catch (error) {
    console.error('❌ Crisis access test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  testCrisisAccess().catch(console.error);
}

module.exports = { testCrisisAccess };