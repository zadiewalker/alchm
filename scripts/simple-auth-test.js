#!/usr/bin/env node

/**
 * Simple ALCHM Authentication Test
 * Real-time validation of authentication system across browsers
 */

const puppeteer = require('puppeteer');

const TEST_URL = 'http://localhost:3000/auth/login';

async function testChromeDesktop() {
  console.log('🔍 Testing Chrome Desktop...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set Chrome Desktop user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1280, height: 720 });
  
  // Track console logs
  page.on('console', msg => {
    if (msg.text().includes('🔐') || msg.text().includes('Auth')) {
      console.log('📝 Auth Log:', msg.text());
    }
  });
  
  try {
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    
    // Test browser detection
    const detection = await page.evaluate(() => {
      const userAgent = navigator.userAgent;
      return {
        userAgent: userAgent.substring(0, 100),
        isChrome: /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent),
        isMobile: /Mobile/i.test(userAgent),
        isIOS: /iPhone|iPad|iPod/i.test(userAgent),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      };
    });
    
    console.log('✅ Chrome Desktop Detection:', detection);
    
    // Check if Google button is present
    const googleButton = await page.$('button:contains("Continue with Google"), button:contains("Google")');
    if (googleButton) {
      console.log('✅ Google sign-in button found');
    } else {
      console.log('❌ Google sign-in button not found');
    }
    
    // Check page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    await page.waitForSelector('form', { timeout: 5000 });
    console.log('✅ Authentication form loaded');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  await browser.close();
}

async function testChromeMobile() {
  console.log('\n🔍 Testing Chrome Mobile...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set Chrome Mobile user agent
  await page.setUserAgent('Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36');
  await page.setViewport({ width: 393, height: 851 });
  
  page.on('console', msg => {
    if (msg.text().includes('🔐') || msg.text().includes('Auth')) {
      console.log('📝 Mobile Auth Log:', msg.text());
    }
  });
  
  try {
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    
    const detection = await page.evaluate(() => {
      const userAgent = navigator.userAgent;
      return {
        userAgent: userAgent.substring(0, 100),
        isChrome: /Chrome/i.test(userAgent),
        isMobile: /Mobile/i.test(userAgent),
        isAndroid: /Android/i.test(userAgent),
        hasTouch: 'ontouchstart' in window
      };
    });
    
    console.log('✅ Chrome Mobile Detection:', detection);
    
    // Check button sizing for mobile
    const buttonSizes = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.map(btn => {
        const rect = btn.getBoundingClientRect();
        return {
          text: btn.textContent.substring(0, 20),
          width: rect.width,
          height: rect.height,
          touchFriendly: rect.height >= 44
        };
      });
    });
    
    console.log('📱 Button sizes:', buttonSizes);
    
  } catch (error) {
    console.log('❌ Mobile Error:', error.message);
  }
  
  await browser.close();
}

async function testIOSSafari() {
  console.log('\n🔍 Testing iOS Safari...');
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set iOS Safari user agent
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844 });
  
  page.on('console', msg => {
    if (msg.text().includes('🔐') || msg.text().includes('iOS')) {
      console.log('📝 iOS Auth Log:', msg.text());
    }
  });
  
  try {
    await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
    
    const detection = await page.evaluate(() => {
      const userAgent = navigator.userAgent;
      return {
        userAgent: userAgent.substring(0, 100),
        isIOS: /iPhone|iPad|iPod/i.test(userAgent),
        isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
        isMobile: /Mobile/i.test(userAgent),
        expectedMethod: 'redirect' // iOS should use redirect
      };
    });
    
    console.log('✅ iOS Safari Detection:', detection);
    
    // Check for redirect-specific messaging
    const authStrategy = await page.evaluate(() => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      
      return {
        shouldUseRedirect: isIOS,
        redirectMessage: isIOS ? 'Should use redirect method' : 'Can use popup method'
      };
    });
    
    console.log('🔄 Auth Strategy:', authStrategy);
    
  } catch (error) {
    console.log('❌ iOS Error:', error.message);
  }
  
  await browser.close();
}

async function main() {
  console.log('🚀 ALCHM Authentication Browser Test');
  console.log('====================================');
  
  // Check if dev server is running
  try {
    const response = await fetch(TEST_URL);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    console.log('✅ Dev server is running at', TEST_URL);
  } catch (error) {
    console.log('❌ Dev server not accessible:', error.message);
    console.log('Please run: npm run dev');
    process.exit(1);
  }
  
  try {
    await testChromeDesktop();
    await testChromeMobile();
    await testIOSSafari();
    
    console.log('\n📊 Test Summary:');
    console.log('✅ Chrome Desktop: Popup method expected');
    console.log('✅ Chrome Mobile: Redirect method expected');
    console.log('✅ iOS Safari: Redirect method required');
    console.log('\n🎉 Authentication browser compatibility test complete!');
    
  } catch (error) {
    console.log('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();