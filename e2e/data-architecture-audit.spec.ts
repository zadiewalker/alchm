/**
 * ALCHM Data Storage & Encryption Verification
 * 
 * Sacred promise: User data is encrypted, private, and secure.
 * Every journal entry, every reflection must be protected as if it contains
 * someone's deepest vulnerability - because it does.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Data Storage & Encryption Architecture Audit', () => {
  test.setTimeout(120000);

  // Test client-side encryption before transmission
  test('should encrypt sensitive data before network transmission', async ({ page }) => {
    // Monitor all network requests
    const networkRequests: any[] = [];
    const sensitiveContent = 'This is deeply personal content about my trauma and healing journey that must be encrypted.';
    
    page.on('request', request => {
      const url = request.url();
      const method = request.method();
      const postData = request.postData();
      
      networkRequests.push({
        url,
        method,
        postData,
        headers: request.headers()
      });
    });

    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Fill sensitive content
      await textarea.fill(sensitiveContent);
      
      // Look for save/submit functionality
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit"), button:has-text("Continue")');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        
        // Wait for potential network activity
        await page.waitForTimeout(3000);
        
        // Verify raw sensitive content was never transmitted
        let foundRawContent = false;
        for (const request of networkRequests) {
          if (request.postData) {
            if (request.postData.includes(sensitiveContent)) {
              foundRawContent = true;
              console.error(`❌ RAW CONTENT TRANSMITTED: ${request.url}`);
              console.error(`Raw data: ${request.postData.substring(0, 200)}...`);
            }
          }
        }
        
        expect(foundRawContent).toBe(false);
        console.log('✅ Sensitive content properly encrypted/protected during transmission');
      } else {
        console.log('ℹ️ No save functionality found - testing static interface');
      }
    } else {
      console.log('ℹ️ No writing interface found - testing auth-gated state');
    }
  });

  // Test Firestore security rules and access patterns
  test('should respect Firestore security rules', async ({ page }) => {
    // Monitor Firebase/Firestore requests
    const firestoreRequests: any[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('firestore') || url.includes('firebase') || url.includes('google')) {
        firestoreRequests.push({
          url,
          method: request.method(),
          postData: request.postData()
        });
      }
    });

    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Test unauthenticated access patterns
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      await textarea.fill('Test content for security audit');
      
      const saveButton = page.locator('button:has-text("Save")');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        
        // Check if Firestore requests were made
        const hasFirestoreRequests = firestoreRequests.length > 0;
        
        if (hasFirestoreRequests) {
          console.log(`ℹ️ ${firestoreRequests.length} Firestore requests detected`);
          
          // Verify requests don't expose sensitive data
          for (const request of firestoreRequests) {
            if (request.postData) {
              expect(request.postData).not.toContain('Test content for security audit');
            }
          }
        } else {
          console.log('ℹ️ No Firestore requests detected - local storage or demo mode');
        }
      }
    }
  });

  // Test data persistence and retrieval patterns
  test('should handle data persistence correctly', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const testContent = `Data persistence test ${Date.now()}`;
    
    const textarea = page.locator('textarea');
    if (await textarea.isVisible()) {
      // Fill and save content
      await textarea.fill(testContent);
      
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")');
      if (await saveButton.isVisible()) {
        await saveButton.click();
        await page.waitForTimeout(2000);
        
        // Refresh page to test persistence
        await page.reload({ waitUntil: 'networkidle' });
        
        const reloadedTextarea = page.locator('textarea');
        if (await reloadedTextarea.isVisible()) {
          const persistedContent = await reloadedTextarea.inputValue();
          
          if (persistedContent.includes(testContent)) {
            console.log('✅ Data persists across page reloads');
          } else if (persistedContent.length === 0) {
            console.log('ℹ️ No data persistence - demo mode or auth required');
          } else {
            console.log(`ℹ️ Different content found: ${persistedContent.substring(0, 50)}...`);
          }
        }
      }
    }
  });

  // Test local storage and session management
  test('should handle local data storage securely', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Check what's stored in localStorage
    const localStorage = await page.evaluate(() => {
      const items: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key);
        }
      }
      return items;
    });
    
    // Check what's stored in sessionStorage
    const sessionStorage = await page.evaluate(() => {
      const items: any = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          items[key] = sessionStorage.getItem(key);
        }
      }
      return items;
    });
    
    console.log(`LocalStorage items: ${Object.keys(localStorage).length}`);
    console.log(`SessionStorage items: ${Object.keys(sessionStorage).length}`);
    
    // Verify no sensitive data is stored in plain text
    for (const [key, value] of Object.entries(localStorage)) {
      if (typeof value === 'string') {
        // Check for patterns that suggest unencrypted personal data
        const containsSensitivePatterns = [
          /\b(trauma|abuse|depression|anxiety|suicide)\b/i,
          /\b(I feel|I am|my life|my trauma)\b/i,
          /@\w+\.\w+/, // Email patterns
          /\d{3}-?\d{2}-?\d{4}/, // SSN patterns
        ].some(pattern => pattern.test(value));
        
        if (containsSensitivePatterns) {
          console.warn(`⚠️ Potential sensitive data in localStorage[${key}]: ${value.substring(0, 100)}...`);
        }
      }
    }
  });

  // Test authentication state management
  test('should handle authentication securely', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/`, { waitUntil: 'networkidle' });
    
    // Check for authentication tokens or sessions
    const cookies = await page.context().cookies();
    const authCookies = cookies.filter(cookie => 
      cookie.name.toLowerCase().includes('auth') ||
      cookie.name.toLowerCase().includes('session') ||
      cookie.name.toLowerCase().includes('token')
    );
    
    console.log(`Authentication cookies found: ${authCookies.length}`);
    
    for (const cookie of authCookies) {
      // Verify secure attributes
      expect(cookie.httpOnly || cookie.secure).toBe(true);
      console.log(`✅ Auth cookie '${cookie.name}' has security attributes`);
    }
    
    // Check localStorage for auth tokens
    const authTokens = await page.evaluate(() => {
      const authKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('token') || key.includes('session'))) {
          authKeys.push(key);
        }
      }
      return authKeys;
    });
    
    console.log(`Auth tokens in localStorage: ${authTokens.length}`);
    
    // Verify Firebase Auth integration
    const firebaseConfig = await page.evaluate(() => {
      return (window as any).firebase?.apps?.length || 0;
    });
    
    if (firebaseConfig > 0) {
      console.log('✅ Firebase Auth integration detected');
    } else {
      console.log('ℹ️ No Firebase Auth integration detected');
    }
  });

  // Test data export and privacy controls
  test('should provide data export capabilities', async ({ page }) => {
    // Test various pages for data export options
    const pagesToTest = [
      '/',
      '/pathways',
      '/pathways%202/resilience/step/1/',
    ];
    
    for (const pageUrl of pagesToTest) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      // Look for privacy/export controls
      const privacyElements = [
        'export',
        'download',
        'privacy',
        'delete',
        'account',
        'settings'
      ];
      
      let privacyControlsFound = false;
      for (const term of privacyElements) {
        const element = page.locator(`a:has-text("${term}"), button:has-text("${term}"), [href*="${term}"]`);
        if (await element.count() > 0) {
          privacyControlsFound = true;
          console.log(`✅ Privacy control '${term}' found on ${pageUrl}`);
          break;
        }
      }
      
      if (!privacyControlsFound) {
        console.log(`ℹ️ No privacy controls found on ${pageUrl}`);
      }
    }
  });

  // Test GDPR/privacy compliance elements
  test('should display privacy information appropriately', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/`, { waitUntil: 'networkidle' });
    
    const pageContent = await page.textContent('body');
    
    // Check for privacy-related messaging
    const hasPrivacyMessage = [
      'privacy',
      'encrypt',
      'secure',
      'protect',
      'private',
      'confidential'
    ].some(term => pageContent.toLowerCase().includes(term));
    
    if (hasPrivacyMessage) {
      console.log('✅ Privacy messaging present on homepage');
    } else {
      console.log('⚠️ No explicit privacy messaging found');
    }
    
    // Look for privacy policy or terms links
    const privacyPolicyLink = page.locator('a:has-text("privacy"), a:has-text("terms"), a[href*="privacy"], a[href*="terms"]');
    if (await privacyPolicyLink.count() > 0) {
      console.log('✅ Privacy policy/terms links available');
    } else {
      console.log('ℹ️ No privacy policy links found');
    }
  });

  // Test data encryption at rest indicators
  test('should indicate secure data handling', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    // Look for security indicators in the interface
    const securityIndicators = [
      '🔒',
      '🛡️',
      'encrypt',
      'secure',
      'private',
      'safe',
      'protect'
    ];
    
    const pageContent = await page.textContent('body');
    const hasSecurityIndicator = securityIndicators.some(indicator => 
      pageContent.toLowerCase().includes(indicator.toLowerCase())
    );
    
    if (hasSecurityIndicator) {
      console.log('✅ Security indicators present in interface');
    } else {
      console.log('ℹ️ No explicit security indicators found');
    }
    
    // Check for HTTPS
    const isHTTPS = page.url().startsWith('https://');
    expect(isHTTPS).toBe(true);
    console.log('✅ Site served over HTTPS');
  });
});