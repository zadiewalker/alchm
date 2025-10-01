#!/usr/bin/env node

/**
 * Firebase Authentication Flow Test
 * Tests the actual Firebase initialization and authentication flow
 */

const puppeteer = require('puppeteer');

async function testFirebaseAuth() {
  console.log('🔥 Firebase Authentication Flow Test');
  console.log('=====================================\n');

  let browser;
  let page;

  try {
    console.log('1️⃣ Starting browser...');
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI/CD
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 }
    });
    
    page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('🔴 Browser Error:', msg.text());
      } else if (msg.text().includes('Firebase') || msg.text().includes('Auth')) {
        console.log('🔥 Firebase Log:', msg.text());
      }
    });

    // Enable error tracking
    page.on('pageerror', error => {
      console.log('🚨 Page Error:', error.message);
    });

    // Enable network monitoring
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.url().includes('googleapis.com') || 
          request.url().includes('firebaseapp.com') ||
          request.url().includes('identitytoolkit')) {
        console.log('🌐 Firebase Request:', request.url());
      }
      request.continue();
    });

    console.log('2️⃣ Navigating to login page...');
    await page.goto('http://localhost:3001/auth/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('3️⃣ Checking page load...');
    const title = await page.title();
    console.log('📄 Page title:', title);

    console.log('4️⃣ Checking for Firebase initialization...');
    
    // Wait for Firebase to initialize
    await page.waitForTimeout(3000);
    
    // Check if Firebase is loaded
    const firebaseLoaded = await page.evaluate(() => {
      return typeof window.firebase !== 'undefined' || 
             document.querySelector('[src*="firebase"]') !== null ||
             window.console.log('Checking Firebase globals...', {
               firebase: typeof window.firebase,
               firebaseApp: typeof window.firebaseApp,
               firebaseAuth: typeof window.firebaseAuth
             });
    });

    console.log('🔥 Firebase loaded:', firebaseLoaded);

    console.log('5️⃣ Testing form elements...');
    
    // Check if login form exists
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    const googleButton = await page.$('button:contains("Google")');
    
    console.log('📧 Email input found:', !!emailInput);
    console.log('🔒 Password input found:', !!passwordInput);
    console.log('🔐 Google button found:', !!googleButton);

    console.log('6️⃣ Testing Firebase Auth initialization...');
    
    // Try to access Firebase Auth in the browser context
    const authTest = await page.evaluate(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          try {
            // Check various ways Firebase might be available
            const tests = {
              windowFirebase: typeof window.firebase !== 'undefined',
              firebaseApp: typeof window.firebaseApp !== 'undefined',
              firebaseAuth: typeof window.firebaseAuth !== 'undefined',
              getFirebaseAuth: typeof window.getFirebaseAuth === 'function',
              authInstance: !!window.authInstance,
              hasFirebaseScript: !!document.querySelector('script[src*="firebase"]'),
              hasAuthElements: !!document.querySelector('[data-testid="auth"]') || 
                              !!document.querySelector('button[type="submit"]'),
              consoleErrors: window.console._errors || []
            };
            
            resolve(tests);
          } catch (error) {
            resolve({ error: error.message });
          }
        }, 2000);
      });
    });

    console.log('🔍 Firebase Auth Tests:', JSON.stringify(authTest, null, 2));

    console.log('7️⃣ Attempting to trigger authentication initialization...');
    
    // Try clicking email field to trigger any lazy loading
    if (emailInput) {
      await emailInput.click();
      await page.type('input[type="email"]', 'test@example.com');
      console.log('✅ Email input interaction successful');
    }

    // Wait a bit more for any async Firebase initialization
    await page.waitForTimeout(2000);

    console.log('8️⃣ Final Firebase status check...');
    
    const finalStatus = await page.evaluate(() => {
      // Check for any Firebase-related global variables or DOM elements
      const firebaseIndicators = {
        scripts: Array.from(document.scripts).filter(s => 
          s.src.includes('firebase') || s.textContent.includes('firebase')
        ).length,
        firebaseInWindow: Object.keys(window).filter(key => 
          key.toLowerCase().includes('firebase')
        ),
        authInWindow: Object.keys(window).filter(key => 
          key.toLowerCase().includes('auth')
        ),
        errors: window.console._errors || [],
        networkRequests: window.performance.getEntriesByType('resource')
          .filter(r => r.name.includes('firebase')).length
      };
      
      return firebaseIndicators;
    });

    console.log('📊 Final Status:', JSON.stringify(finalStatus, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  console.log('\n📋 Firebase Auth Test Complete');
  console.log('=====================================');
}

// Check if puppeteer is available
async function main() {
  try {
    await testFirebaseAuth();
  } catch (error) {
    if (error.message.includes('puppeteer')) {
      console.log('⚠️ Puppeteer not available, running basic browser test...');
      
      // Fallback to basic fetch tests
      console.log('🔍 Testing with fetch requests...');
      
      try {
        const response = await fetch('http://localhost:3001/auth/login');
        const html = await response.text();
        
        console.log('✅ Login page accessible');
        console.log('🔍 Checking for Firebase in HTML...');
        
        if (html.includes('firebase')) {
          console.log('✅ Firebase references found in HTML');
        } else {
          console.log('⚠️ No Firebase references found in HTML');
        }
        
        if (html.includes('getFirebaseAuth')) {
          console.log('✅ Firebase Auth functions found');
        } else {
          console.log('⚠️ Firebase Auth functions not found');
        }
        
      } catch (fetchError) {
        console.error('❌ Fetch test failed:', fetchError.message);
      }
    } else {
      console.error('❌ Test error:', error.message);
    }
  }
}

if (require.main === module) {
  main();
}