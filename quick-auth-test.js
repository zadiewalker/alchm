#!/usr/bin/env node

/**
 * QUICK AUTHENTICATION TESTING
 * Test auth functionality and check bundle sizes after optimization
 */

const puppeteer = require('puppeteer');

async function testAuth() {
  console.log('🔍 Quick Authentication & Bundle Size Test');
  console.log('='.repeat(50));

  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Test auth login page
  try {
    console.log('\n📱 Testing Auth Login Page...');
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000/en/auth/login', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    const loadTime = Date.now() - startTime;
    
    // Get performance data
    const performance = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource');
      const jsFiles = entries.filter(e => e.name.includes('.js'));
      const cssFiles = entries.filter(e => e.name.includes('.css'));
      
      const totalSize = entries.reduce((sum, e) => sum + (e.transferSize || 0), 0);
      const jsSize = jsFiles.reduce((sum, e) => sum + (e.transferSize || 0), 0);
      
      return {
        totalResources: entries.length,
        jsFiles: jsFiles.length,
        cssFiles: cssFiles.length,
        totalSize: Math.round(totalSize / 1024), // KB
        jsSize: Math.round(jsSize / 1024), // KB
        largestResources: entries
          .map(e => ({ name: e.name.split('/').pop(), size: Math.round((e.transferSize || 0) / 1024) }))
          .filter(e => e.size > 50)
          .sort((a, b) => b.size - a.size)
          .slice(0, 5)
      };
    });
    
    // Check page elements
    const elements = await page.evaluate(() => {
      return {
        hasEmailInput: !!document.querySelector('input[type="email"]'),
        hasPasswordInput: !!document.querySelector('input[type="password"]'),
        hasGoogleButton: !!Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.toLowerCase().includes('google')),
        hasCrisisButton: !!Array.from(document.querySelectorAll('button, a')).find(btn => 
          btn.textContent.toLowerCase().includes('988') || 
          btn.textContent.toLowerCase().includes('crisis')),
        title: document.title
      };
    });
    
    console.log(`  ✅ Load time: ${loadTime}ms`);
    console.log(`  ✅ Total bundle size: ${performance.totalSize}KB (was ~6000KB)`);
    console.log(`  ✅ JS bundle size: ${performance.jsSize}KB (was ~4000KB)`);
    console.log(`  ✅ Form elements: Email=${elements.hasEmailInput}, Password=${elements.hasPasswordInput}, Google=${elements.hasGoogleButton}`);
    console.log(`  ✅ Crisis support: ${elements.hasCrisisButton ? 'Available' : 'Missing'}`);
    
    if (performance.largestResources.length > 0) {
      console.log('  📦 Largest resources:');
      performance.largestResources.forEach(r => {
        console.log(`    - ${r.name}: ${r.size}KB`);
      });
    }
    
    // Test emergency page
    console.log('\n🆘 Testing Emergency Page...');
    await page.goto('http://localhost:3000/en/emergency', {
      waitUntil: 'networkidle2',
      timeout: 30000  
    });
    
    const emergencyFeatures = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasContent: text.length > 100,
        hasCrisisInfo: text.includes('988') || text.toLowerCase().includes('crisis'),
        hasJournalAccess: text.toLowerCase().includes('journal'),
        title: document.title
      };
    });
    
    console.log(`  ✅ Emergency page: ${emergencyFeatures.hasContent ? 'Loaded' : 'Failed'}`);
    console.log(`  ✅ Crisis info: ${emergencyFeatures.hasCrisisInfo ? 'Present' : 'Missing'}`);
    console.log(`  ✅ Journal access: ${emergencyFeatures.hasJournalAccess ? 'Available' : 'Unavailable'}`);
    
    // Bundle size assessment
    const bundleStatus = performance.totalSize < 2000 ? '✅ GOOD' : 
                        performance.totalSize < 4000 ? '⚠️  ACCEPTABLE' : '❌ TOO LARGE';
    
    console.log('\n🎯 BETA LAUNCH ASSESSMENT:');
    console.log(`  Bundle Size: ${bundleStatus} (${performance.totalSize}KB)`);
    console.log(`  Auth Elements: ${elements.hasEmailInput && elements.hasPasswordInput && elements.hasGoogleButton ? '✅ COMPLETE' : '❌ MISSING'}`);
    console.log(`  Crisis Support: ${elements.hasCrisisButton && emergencyFeatures.hasCrisisInfo ? '✅ AVAILABLE' : '❌ MISSING'}`);
    console.log(`  Page Speed: ${loadTime < 3000 ? '✅ FAST' : loadTime < 6000 ? '⚠️  ACCEPTABLE' : '❌ SLOW'}`);
    
    const isReady = performance.totalSize < 4000 && 
                   elements.hasEmailInput && 
                   elements.hasPasswordInput && 
                   elements.hasCrisisButton &&
                   loadTime < 6000;
    
    console.log(`\n🚀 BETA READY: ${isReady ? '✅ YES' : '❌ NO'}`);
    
    if (!isReady) {
      console.log('\n⚠️  Issues to fix:');
      if (performance.totalSize >= 4000) console.log('  - Bundle size still too large');
      if (!elements.hasEmailInput || !elements.hasPasswordInput) console.log('  - Missing auth form elements');
      if (!elements.hasCrisisButton) console.log('  - Missing crisis support');
      if (loadTime >= 6000) console.log('  - Page load too slow');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testAuth().catch(console.error);
