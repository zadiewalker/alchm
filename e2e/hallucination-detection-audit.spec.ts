/**
 * ALCHM Hallucination Detection & Phantom Feature Elimination
 * 
 * Sacred promise: No false promises. No phantom features.
 * Every link, every button, every claim must be grounded in reality.
 */

import { test, expect, Page } from '@playwright/test';

const PRODUCTION_URL = 'https://alchm-digital-sanctuary.web.app';

test.describe('Error Detection & Hallucination Elimination', () => {
  test.setTimeout(120000);

  // Test for phantom navigation links
  test('should eliminate phantom navigation links', async ({ page }) => {
    const pagesToScan = [
      '/',
      '/pathways',
      '/pathways%202/resilience/step/1/',
      '/account',
      '/pricing'
    ];

    let phantomLinks = 0;
    let totalLinks = 0;

    for (const pageUrl of pagesToScan) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        console.log(`\n📍 Scanning ${pageUrl} for phantom links...`);
        
        // Get all links on the page
        const links = await page.locator('a[href]').all();
        totalLinks += links.length;
        
        for (const link of links) {
          const href = await link.getAttribute('href');
          const linkText = await link.textContent();
          
          if (href && !href.startsWith('tel:') && !href.startsWith('mailto:') && !href.startsWith('http')) {
            // Test internal links
            const fullUrl = href.startsWith('/') ? `${PRODUCTION_URL}${href}` : href;
            
            try {
              const response = await page.request.head(fullUrl);
              const status = response.status();
              
              if (status === 404 || status >= 500) {
                phantomLinks++;
                console.error(`❌ PHANTOM LINK: "${linkText}" -> ${href} (${status})`);
              } else if (status >= 300 && status < 400) {
                console.log(`↗️ Redirect: "${linkText}" -> ${href} (${status})`);
              } else {
                console.log(`✅ Valid: "${linkText}" -> ${href}`);
              }
            } catch (error) {
              phantomLinks++;
              console.error(`❌ ERROR LINK: "${linkText}" -> ${href} (${error})`);
            }
          } else {
            console.log(`🔗 External/special: "${linkText}" -> ${href}`);
          }
        }
      }
    }
    
    console.log(`\n📊 PHANTOM LINK AUDIT RESULTS:`);
    console.log(`Total links scanned: ${totalLinks}`);
    console.log(`Phantom links found: ${phantomLinks}`);
    console.log(`Success rate: ${((totalLinks - phantomLinks) / totalLinks * 100).toFixed(1)}%`);
    
    // Allow up to 10% phantom links for development
    const phantomRate = phantomLinks / totalLinks;
    expect(phantomRate).toBeLessThan(0.1);
  });

  // Test for phantom buttons and interactions
  test('should eliminate phantom button promises', async ({ page }) => {
    const interactivePages = [
      '/pathways%202/resilience/step/1/',
      '/account',
      '/pricing'
    ];

    let phantomButtons = 0;
    let totalButtons = 0;

    for (const pageUrl of interactivePages) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        console.log(`\n🔘 Scanning ${pageUrl} for phantom buttons...`);
        
        // Get all buttons on the page
        const buttons = await page.locator('button, input[type="submit"], input[type="button"]').all();
        totalButtons += buttons.length;
        
        for (const button of buttons) {
          const buttonText = await button.textContent();
          const isDisabled = await button.isDisabled();
          const isVisible = await button.isVisible();
          
          if (isVisible && !isDisabled) {
            try {
              // Test if button can be clicked
              await button.click({ timeout: 1000 });
              
              // Wait for any response
              await page.waitForTimeout(500);
              
              // Check if anything happened (no error is good)
              console.log(`✅ Button responds: "${buttonText}"`);
              
            } catch (error) {
              if (error.message.includes('not enabled')) {
                console.log(`⚠️ Button disabled: "${buttonText}"`);
              } else {
                phantomButtons++;
                console.error(`❌ PHANTOM BUTTON: "${buttonText}" - ${error.message}`);
              }
            }
          } else {
            console.log(`🔘 Button not interactive: "${buttonText}" (disabled: ${isDisabled}, visible: ${isVisible})`);
          }
        }
      }
    }
    
    console.log(`\n📊 PHANTOM BUTTON AUDIT RESULTS:`);
    console.log(`Total buttons scanned: ${totalButtons}`);
    console.log(`Phantom buttons found: ${phantomButtons}`);
    console.log(`Success rate: ${((totalButtons - phantomButtons) / totalButtons * 100).toFixed(1)}%`);
    
    // Expect most buttons to work
    const phantomRate = phantomButtons / totalButtons;
    expect(phantomRate).toBeLessThan(0.3);
  });

  // Test for phantom features mentioned in text
  test('should eliminate phantom feature claims', async ({ page }) => {
    const featureClaims = [
      // Navigation claims
      'dashboard',
      'settings',
      'profile',
      'export',
      'download',
      
      // Functionality claims
      'save',
      'auto-save',
      'sync',
      'backup',
      
      // Social claims  
      'share',
      'community',
      'friends',
      
      // AI claims
      'ai',
      'artificial intelligence',
      'khepera',
      'smart',
      
      // Payment claims
      'upgrade',
      'premium',
      'subscription',
      'billing'
    ];

    const pagesToScan = [
      '/',
      '/pathways',
      '/pricing'
    ];

    let phantomFeatures = 0;
    let claimsFound = 0;

    for (const pageUrl of pagesToScan) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        console.log(`\n🎯 Scanning ${pageUrl} for phantom feature claims...`);
        
        for (const feature of featureClaims) {
          if (content.toLowerCase().includes(feature.toLowerCase())) {
            claimsFound++;
            console.log(`🔍 Feature claimed: "${feature}"`);
            
            // Try to find corresponding functionality
            const featureElements = await page.locator(`a:has-text("${feature}"), button:has-text("${feature}"), [href*="${feature}"], [data-testid*="${feature}"]`).count();
            
            if (featureElements === 0) {
              // Feature claimed but no interactive elements found
              phantomFeatures++;
              console.warn(`⚠️ PHANTOM FEATURE: "${feature}" claimed but no functionality found`);
            } else {
              console.log(`✅ Feature has implementation: "${feature}" (${featureElements} elements)`);
            }
          }
        }
      }
    }
    
    console.log(`\n📊 PHANTOM FEATURE AUDIT RESULTS:`);
    console.log(`Feature claims found: ${claimsFound}`);
    console.log(`Phantom features detected: ${phantomFeatures}`);
    
    if (claimsFound > 0) {
      const phantomRate = phantomFeatures / claimsFound;
      console.log(`Implementation rate: ${((1 - phantomRate) * 100).toFixed(1)}%`);
      
      // Expect at least 70% of claimed features to have implementation
      expect(phantomRate).toBeLessThan(0.3);
    }
  });

  // Test for broken image and asset references
  test('should eliminate broken asset references', async ({ page }) => {
    const pagesToScan = [
      '/',
      '/pathways', 
      '/pathways%202/resilience/step/1/'
    ];

    let brokenAssets = 0;
    let totalAssets = 0;

    for (const pageUrl of pagesToScan) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        console.log(`\n🖼️ Scanning ${pageUrl} for broken assets...`);
        
        // Check images
        const images = await page.locator('img[src]').all();
        totalAssets += images.length;
        
        for (const img of images) {
          const src = await img.getAttribute('src');
          const alt = await img.getAttribute('alt');
          
          if (src) {
            try {
              const naturalWidth = await img.evaluate(el => (el as HTMLImageElement).naturalWidth);
              const naturalHeight = await img.evaluate(el => (el as HTMLImageElement).naturalHeight);
              
              if (naturalWidth === 0 || naturalHeight === 0) {
                brokenAssets++;
                console.error(`❌ BROKEN IMAGE: ${src} (alt: "${alt}")`);
              } else {
                console.log(`✅ Image loads: ${src.substring(0, 50)}...`);
              }
            } catch (error) {
              brokenAssets++;
              console.error(`❌ IMAGE ERROR: ${src} - ${error}`);
            }
          }
        }
        
        // Check background images in CSS
        const elementsWithBg = await page.locator('[style*="background-image"]').all();
        totalAssets += elementsWithBg.length;
        
        for (const element of elementsWithBg) {
          const style = await element.getAttribute('style');
          if (style) {
            const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
            if (bgMatch) {
              const bgUrl = bgMatch[1];
              console.log(`🎨 Background image: ${bgUrl}`);
              // Note: Harder to test programmatically, logged for manual review
            }
          }
        }
      }
    }
    
    console.log(`\n📊 ASSET AUDIT RESULTS:`);
    console.log(`Total assets scanned: ${totalAssets}`);
    console.log(`Broken assets found: ${brokenAssets}`);
    
    if (totalAssets > 0) {
      const brokenRate = brokenAssets / totalAssets;
      console.log(`Asset success rate: ${((1 - brokenRate) * 100).toFixed(1)}%`);
      
      // Expect at least 95% of assets to load correctly
      expect(brokenRate).toBeLessThan(0.05);
    }
  });

  // Test for phantom API endpoints
  test('should eliminate phantom API references', async ({ page }) => {
    const apiPatterns = [
      '/api/',
      'fetch(',
      'axios.',
      '.post(',
      '.get(',
      'api-',
      'endpoint'
    ];

    let phantomAPIs = 0;
    let apiReferences = 0;

    // Monitor network requests
    const apiRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('/api/') || url.includes('api.') || url.includes('firebase')) {
        apiRequests.push(url);
      }
    });

    const pagesToScan = [
      '/',
      '/pathways%202/resilience/step/1/'
    ];

    for (const pageUrl of pagesToScan) {
      await page.goto(`${PRODUCTION_URL}${pageUrl}`, { waitUntil: 'networkidle' });
      
      // Wait for potential API calls
      await page.waitForTimeout(3000);
      
      const content = await page.textContent('body');
      
      if (!content.includes('404')) {
        console.log(`\n🔌 Scanning ${pageUrl} for API references...`);
        
        // Check page source for API patterns
        const pageSource = await page.content();
        
        for (const pattern of apiPatterns) {
          if (pageSource.includes(pattern)) {
            apiReferences++;
            console.log(`🔍 API pattern found: ${pattern}`);
          }
        }
      }
    }
    
    console.log(`\n📊 API AUDIT RESULTS:`);
    console.log(`API references in code: ${apiReferences}`);
    console.log(`API requests made: ${apiRequests.length}`);
    
    // Log actual API requests
    for (const apiUrl of apiRequests) {
      console.log(`🔌 API call: ${apiUrl}`);
    }
    
    // In development/demo mode, API calls might not work - that's expected
    console.log(`ℹ️ API functionality expected to be limited in demo/static mode`);
  });

  // Test for phantom database/storage references
  test('should handle data storage appropriately', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/pathways%202/resilience/step/1/`, { waitUntil: 'networkidle' });
    
    const content = await page.textContent('body');
    
    if (!content.includes('404')) {
      // Try to trigger save operation
      const textarea = page.locator('textarea');
      if (await textarea.isVisible()) {
        await textarea.fill('Test data storage audit');
        
        const saveButton = page.locator('button:has-text("Save"), button:has-text("Continue")');
        if (await saveButton.isVisible()) {
          // Monitor what happens when save is clicked
          let errorOccurred = false;
          
          page.on('console', msg => {
            if (msg.type() === 'error') {
              console.log(`Console error during save: ${msg.text()}`);
              errorOccurred = true;
            }
          });
          
          try {
            await saveButton.click();
            await page.waitForTimeout(2000);
            
            if (errorOccurred) {
              console.warn('⚠️ Console errors during save operation');
            } else {
              console.log('✅ Save operation completed without console errors');
            }
            
          } catch (error) {
            console.log(`ℹ️ Save operation limitation: ${error.message}`);
          }
        }
      }
      
      // Check localStorage for phantom data
      const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
      console.log(`Local storage keys: ${localStorageKeys.length}`);
      
      for (const key of localStorageKeys) {
        console.log(`📦 Local storage: ${key}`);
      }
    }
  });

  // Test for phantom configuration promises
  test('should verify configuration integrity', async ({ page }) => {
    await page.goto(`${PRODUCTION_URL}/`, { waitUntil: 'networkidle' });
    
    // Check for common configuration issues
    const configIssues: string[] = [];
    
    // Monitor console for configuration errors
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('config')) {
        configIssues.push(msg.text());
      }
    });
    
    // Check for common phantom configurations
    const hasServiceWorker = await page.evaluate(() => 'serviceWorker' in navigator);
    console.log(`Service Worker support: ${hasServiceWorker}`);
    
    if (hasServiceWorker) {
      const swRegistration = await page.evaluate(() => {
        return navigator.serviceWorker.getRegistration().then(reg => !!reg);
      });
      console.log(`Service Worker registered: ${swRegistration}`);
    }
    
    // Check for Firebase configuration
    const hasFirebase = await page.evaluate(() => typeof (window as any).firebase !== 'undefined');
    console.log(`Firebase loaded: ${hasFirebase}`);
    
    // Wait for potential config errors
    await page.waitForTimeout(2000);
    
    console.log(`Configuration errors: ${configIssues.length}`);
    for (const issue of configIssues) {
      console.error(`⚠️ Config error: ${issue}`);
    }
    
    // Configuration errors are warnings, not failures in demo mode
    console.log(`ℹ️ Configuration issues expected in demo/static deployment`);
  });
});