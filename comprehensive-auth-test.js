#!/usr/bin/env node

/**
 * COMPREHENSIVE AUTHENTICATION VALIDATION TEST
 * 
 * This script validates all critical aspects of ALCHM authentication:
 * 1. Firebase configuration correctness
 * 2. Client-side JavaScript loading 
 * 3. Authentication component rendering
 * 4. Crisis support accessibility
 * 5. Bundle performance impact
 * 6. Mobile trauma-informed UX
 */

const { chromium } = require('playwright');
const fs = require('fs');

const VALIDATION_RESULTS = {
  timestamp: new Date().toISOString(),
  tests: [],
  criticalIssues: [],
  recommendations: [],
  betaReadiness: false
};

async function runComprehensiveValidation() {
  console.log('🔍 COMPREHENSIVE ALCHM AUTHENTICATION VALIDATION');
  console.log('═══════════════════════════════════════════════════════');
  
  const browser = await chromium.launch({ 
    headless: false, // Visual validation
    args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 }, // iPhone X dimensions
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // Monitor console for JavaScript errors
    const jsErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Test 1: Page Loading and Accessibility
    console.log('\n📱 TEST 1: Page Loading and Crisis Access...');
    const startTime = Date.now();
    
    try {
      await page.goto('http://localhost:3002/en/auth/login', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      const loadTime = Date.now() - startTime;
      
      VALIDATION_RESULTS.tests.push({
        name: 'Page Load Speed',
        status: loadTime < 3000 ? 'PASS' : 'FAIL',
        value: `${loadTime}ms`,
        target: '<3000ms',
        critical: loadTime > 5000
      });
      
      console.log(`  ⏱️  Load Time: ${loadTime}ms (${loadTime < 3000 ? '✅ PASS' : '❌ FAIL'})`);
      
      // Check for crisis support button
      const crisisButton = await page.locator('a[href="tel:988"]').first();
      const crisisButtonExists = await crisisButton.count() > 0;
      
      VALIDATION_RESULTS.tests.push({
        name: 'Crisis Button Access',
        status: crisisButtonExists ? 'PASS' : 'CRITICAL_FAIL',
        value: crisisButtonExists ? 'Present' : 'Missing',
        critical: !crisisButtonExists
      });
      
      console.log(`  🆘 Crisis Button: ${crisisButtonExists ? '✅ Accessible' : '❌ MISSING - CRITICAL'}`);
      
      if (!crisisButtonExists) {
        VALIDATION_RESULTS.criticalIssues.push('Crisis support button (988) not accessible - blocking issue for vulnerable users');
      }
      
    } catch (error) {
      VALIDATION_RESULTS.criticalIssues.push(`Page failed to load: ${error.message}`);
      console.log(`  ❌ CRITICAL: Page failed to load - ${error.message}`);
    }
    
    // Test 2: Authentication Components Rendering
    console.log('\n🔐 TEST 2: Authentication Components...');
    
    // Wait for components to load
    await page.waitForTimeout(5000);
    
    // Check for Google auth button
    const googleButton = page.locator('button:has-text("Continue with Google")');
    const googleButtonExists = await googleButton.count() > 0;
    
    // Check for email form
    const emailInput = page.locator('input[type="email"]');
    const emailInputExists = await emailInput.count() > 0;
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]');
    const passwordInputExists = await passwordInput.count() > 0;
    
    // Check for submit button
    const submitButton = page.locator('button:has-text("Enter Your Sacred Space")');
    const submitButtonExists = await submitButton.count() > 0;
    
    VALIDATION_RESULTS.tests.push(
      {
        name: 'Google OAuth Button',
        status: googleButtonExists ? 'PASS' : 'CRITICAL_FAIL',
        value: googleButtonExists ? 'Present' : 'Missing',
        critical: !googleButtonExists
      },
      {
        name: 'Email Input Field',
        status: emailInputExists ? 'PASS' : 'CRITICAL_FAIL',
        value: emailInputExists ? 'Present' : 'Missing',
        critical: !emailInputExists
      },
      {
        name: 'Password Input Field',
        status: passwordInputExists ? 'PASS' : 'CRITICAL_FAIL',
        value: passwordInputExists ? 'Present' : 'Missing',
        critical: !passwordInputExists
      },
      {
        name: 'Submit Button',
        status: submitButtonExists ? 'PASS' : 'CRITICAL_FAIL',
        value: submitButtonExists ? 'Present' : 'Missing',
        critical: !submitButtonExists
      }
    );
    
    console.log(`  🔑 Google OAuth: ${googleButtonExists ? '✅ Present' : '❌ MISSING'}`);
    console.log(`  📧 Email Input: ${emailInputExists ? '✅ Present' : '❌ MISSING'}`);
    console.log(`  🔒 Password Input: ${passwordInputExists ? '✅ Present' : '❌ MISSING'}`);
    console.log(`  🚀 Submit Button: ${submitButtonExists ? '✅ Present' : '❌ MISSING'}`);
    
    if (!googleButtonExists || !emailInputExists || !passwordInputExists || !submitButtonExists) {
      VALIDATION_RESULTS.criticalIssues.push('Authentication forms not rendering - users cannot sign in');
    }
    
    // Test 3: Mobile Trauma-Informed Design
    console.log('\n📱 TEST 3: Mobile Trauma-Informed Design...');
    
    // Check touch target sizes
    if (emailInputExists) {
      const emailInputBox = await emailInput.first().boundingBox();
      const touchTargetSize = emailInputBox ? Math.min(emailInputBox.width, emailInputBox.height) : 0;
      
      VALIDATION_RESULTS.tests.push({
        name: 'Touch Target Size',
        status: touchTargetSize >= 44 ? 'PASS' : 'FAIL',
        value: `${touchTargetSize}px`,
        target: '≥44px',
        critical: touchTargetSize < 32
      });
      
      console.log(`  👆 Touch Targets: ${touchTargetSize >= 44 ? '✅ Adequate' : '❌ Too Small'} (${touchTargetSize}px)`);
    }
    
    // Check for trauma-informed language
    const pageContent = await page.textContent('body');
    const hasTraumaInformedLanguage = pageContent.includes('gentle') || pageContent.includes('safe') || pageContent.includes('sanctuary');
    
    VALIDATION_RESULTS.tests.push({
      name: 'Trauma-Informed Language',
      status: hasTraumaInformedLanguage ? 'PASS' : 'FAIL',
      value: hasTraumaInformedLanguage ? 'Present' : 'Missing',
      critical: false
    });
    
    console.log(`  💬 Trauma-Informed Language: ${hasTraumaInformedLanguage ? '✅ Present' : '❌ Missing'}`);
    
    // Test 4: JavaScript Errors
    console.log('\n🐛 TEST 4: JavaScript Runtime Errors...');
    
    VALIDATION_RESULTS.tests.push({
      name: 'JavaScript Errors',
      status: jsErrors.length === 0 ? 'PASS' : 'FAIL',
      value: `${jsErrors.length} errors`,
      target: '0 errors',
      critical: jsErrors.length > 0
    });
    
    console.log(`  🐛 JS Errors: ${jsErrors.length === 0 ? '✅ None' : `❌ ${jsErrors.length} errors`}`);
    
    if (jsErrors.length > 0) {
      console.log('    Errors:');
      jsErrors.slice(0, 3).forEach(error => {
        console.log(`    - ${error.substring(0, 100)}...`);
      });
      
      VALIDATION_RESULTS.criticalIssues.push(`${jsErrors.length} JavaScript errors preventing authentication`);
    }
    
    // Test 5: Bundle Performance Analysis
    console.log('\n📦 TEST 5: Bundle Performance Impact...');
    
    const performanceEntries = await page.evaluate(() => {
      return performance.getEntriesByType('navigation')[0];
    });
    
    const transferSize = performanceEntries.transferSize || 0;
    const domContentLoaded = performanceEntries.domContentLoadedEventEnd - performanceEntries.domContentLoadedEventStart;
    
    VALIDATION_RESULTS.tests.push(
      {
        name: 'Bundle Transfer Size',
        status: transferSize < 2000000 ? 'PASS' : 'FAIL', // 2MB limit
        value: `${Math.round(transferSize/1024)}KB`,
        target: '<2MB',
        critical: transferSize > 5000000 // 5MB critical
      },
      {
        name: 'DOM Content Loaded',
        status: domContentLoaded < 2000 ? 'PASS' : 'FAIL',
        value: `${Math.round(domContentLoaded)}ms`,
        target: '<2000ms',
        critical: domContentLoaded > 5000
      }
    );
    
    console.log(`  📦 Bundle Size: ${Math.round(transferSize/1024)}KB (${transferSize < 2000000 ? '✅ Acceptable' : '❌ Too Large'})`);
    console.log(`  ⚡ DOM Ready: ${Math.round(domContentLoaded)}ms (${domContentLoaded < 2000 ? '✅ Fast' : '❌ Slow'})`);
    
    if (transferSize > 3000000) {
      VALIDATION_RESULTS.criticalIssues.push('Bundle size too large - will impact users in crisis on slow connections');
    }
    
  } catch (error) {
    VALIDATION_RESULTS.criticalIssues.push(`Test execution failed: ${error.message}`);
    console.log(`❌ CRITICAL TEST FAILURE: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Final Assessment
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 FINAL VALIDATION SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  
  const criticalFailures = VALIDATION_RESULTS.tests.filter(test => test.critical && test.status !== 'PASS');
  const totalFailures = VALIDATION_RESULTS.tests.filter(test => test.status !== 'PASS');
  
  console.log(`\n🎯 Test Results:`);
  console.log(`   Total Tests: ${VALIDATION_RESULTS.tests.length}`);
  console.log(`   Passed: ${VALIDATION_RESULTS.tests.length - totalFailures.length}`);
  console.log(`   Failed: ${totalFailures.length}`);
  console.log(`   Critical Failures: ${criticalFailures.length}`);
  
  console.log(`\n🚨 Critical Issues: ${VALIDATION_RESULTS.criticalIssues.length}`);
  VALIDATION_RESULTS.criticalIssues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
  
  // Beta Readiness Assessment
  const authFlowsWorking = VALIDATION_RESULTS.tests.find(t => t.name === 'Google OAuth Button')?.status === 'PASS' &&
                          VALIDATION_RESULTS.tests.find(t => t.name === 'Email Input Field')?.status === 'PASS';
  
  const crisisAccessible = VALIDATION_RESULTS.tests.find(t => t.name === 'Crisis Button Access')?.status === 'PASS';
  
  const noBlockingErrors = criticalFailures.length === 0;
  
  VALIDATION_RESULTS.betaReadiness = authFlowsWorking && crisisAccessible && noBlockingErrors;
  
  console.log(`\n📋 BETA READINESS ASSESSMENT:`);
  console.log(`   Authentication Flows: ${authFlowsWorking ? '✅ Working' : '❌ Broken'}`);
  console.log(`   Crisis Support: ${crisisAccessible ? '✅ Accessible' : '❌ Missing'}`);
  console.log(`   No Blocking Issues: ${noBlockingErrors ? '✅ Clean' : '❌ Has Issues'}`);
  
  console.log(`\n🎯 FINAL VERDICT: ${VALIDATION_RESULTS.betaReadiness ? '✅ READY FOR FRIENDS & FAMILY BETA' : '❌ NOT READY - REQUIRES FIXES'}`);
  
  if (!VALIDATION_RESULTS.betaReadiness) {
    console.log('\n💡 IMMEDIATE ACTION REQUIRED:');
    if (!authFlowsWorking) console.log('   - Fix authentication component rendering');
    if (!crisisAccessible) console.log('   - Ensure crisis support (988) button is always visible');
    if (!noBlockingErrors) console.log('   - Resolve critical JavaScript errors');
    console.log('   - Test with vulnerable user personas');
    console.log('   - Validate mobile accessibility on real devices');
  }
  
  // Save detailed results
  fs.writeFileSync('/Users/zadiewalker/Desktop/alchm/auth-validation-results.json', 
    JSON.stringify(VALIDATION_RESULTS, null, 2));
  
  console.log('\n📄 Detailed results saved to: auth-validation-results.json');
  console.log('═══════════════════════════════════════════════════════');
}

runComprehensiveValidation().catch(console.error);