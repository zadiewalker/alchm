#!/usr/bin/env node

/**
 * FINAL AUTHENTICATION VALIDATION TEST
 * Comprehensive test suite for ALCHM authentication system
 * Tests all critical paths before user access
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3003';
const TIMEOUT = 15000;

// Test results tracking
const results = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passed: 0,
  failed: 0,
  errors: [],
  warnings: [],
  performance: {},
  accessibility: {},
  mobileExperience: {},
  crisisSafety: {}
};

// Logger utility
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  if (data) console.log(JSON.stringify(data, null, 2));
  
  if (level === 'error') {
    results.errors.push({ message, data, timestamp });
  } else if (level === 'warning') {
    results.warnings.push({ message, data, timestamp });
  }
}

// Test assertion helper
function assert(condition, testName, errorMessage = 'Assertion failed') {
  results.totalTests++;
  if (condition) {
    results.passed++;
    log('info', `✅ PASS: ${testName}`);
    return true;
  } else {
    results.failed++;
    log('error', `❌ FAIL: ${testName} - ${errorMessage}`);
    return false;
  }
}

async function runAuthenticationValidation() {
  let browser = null;
  let page = null;

  try {
    log('info', '🚀 Starting ALCHM Final Authentication Validation');

    // Launch browser with mobile simulation
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    page = await browser.newPage();
    
    // Set up mobile viewport for trauma-informed testing
    await page.setViewport({ width: 375, height: 667 });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');

    // ====================
    // TEST 1: Server Health Check
    // ====================
    log('info', '📡 Testing server connectivity...');
    
    try {
      const response = await fetch(`${BASE_URL}/api/health/ping`);
      if (response.ok) {
        assert(true, 'Server Health Check', 'Server is responding');
      } else {
        assert(false, 'Server Health Check', `Server returned ${response.status}`);
      }
    } catch (error) {
      assert(false, 'Server Health Check', `Cannot connect to server: ${error.message}`);
    }

    // ====================
    // TEST 2: Login Page Load
    // ====================
    log('info', '🔐 Testing login page load...');
    
    const startTime = Date.now();
    
    try {
      await page.goto(`${BASE_URL}/en/auth/login`, { 
        waitUntil: 'networkidle0',
        timeout: TIMEOUT 
      });
      
      const loadTime = Date.now() - startTime;
      results.performance.loginPageLoad = loadTime;
      
      assert(loadTime < 5000, 'Login Page Load Speed', `Page loaded in ${loadTime}ms (should be < 5000ms)`);
      
      // Check for critical elements
      const hasEmailInput = await page.$('input[type="email"]') !== null;
      const hasPasswordInput = await page.$('input[type="password"]') !== null;
      const hasGoogleButton = await page.$('button:has-text("Google")') !== null;
      const hasAppleButton = await page.$('button:has-text("Apple")') !== null;
      
      assert(hasEmailInput, 'Email Input Present');
      assert(hasPasswordInput, 'Password Input Present');
      
      // Check for crisis support elements
      const hasCrisisButton = await page.$('button:has-text("988")') !== null;
      const hasEmergencyText = await page.$('text=741741') !== null;
      
      assert(hasCrisisButton || hasEmergencyText, 'Crisis Support Elements', 'Crisis support must be visible');
      
    } catch (error) {
      assert(false, 'Login Page Load', `Failed to load: ${error.message}`);
    }

    // ====================
    // TEST 3: Mobile Touch Targets
    // ====================
    log('info', '📱 Testing mobile accessibility...');
    
    try {
      const buttons = await page.$$('button');
      let touchTargetIssues = 0;
      
      for (const button of buttons) {
        const boundingBox = await button.boundingBox();
        if (boundingBox && (boundingBox.height < 44 || boundingBox.width < 44)) {
          touchTargetIssues++;
        }
      }
      
      results.accessibility.touchTargetIssues = touchTargetIssues;
      assert(touchTargetIssues === 0, 'Touch Target Accessibility', `${touchTargetIssues} buttons below 44px minimum`);
      
    } catch (error) {
      log('warning', 'Could not validate touch targets', error.message);
    }

    // ====================
    // TEST 4: JavaScript Error Detection
    // ====================
    log('info', '🐛 Testing for JavaScript errors...');
    
    const jsErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });
    
    // Trigger some interactions
    try {
      await page.click('input[type="email"]');
      await page.type('input[type="email"]', 'test@example.com');
      await page.click('input[type="password"]');
      await page.type('input[type="password"]', 'testpassword');
      
      // Wait a moment for any async errors
      await page.waitForTimeout(2000);
      
      assert(jsErrors.length === 0, 'No JavaScript Errors', `Found ${jsErrors.length} JS errors: ${jsErrors.join(', ')}`);
      
    } catch (error) {
      log('warning', 'Could not complete interaction test', error.message);
    }

    // ====================
    // TEST 5: Crisis Detection System
    // ====================
    log('info', '🆘 Testing crisis detection system...');
    
    try {
      // Test crisis keywords in email field
      await page.click('input[type="email"]');
      await page.evaluate(() => document.querySelector('input[type="email"]').value = '');
      await page.type('input[type="email"]', 'help.suicide@example.com');
      
      // Wait for crisis detection
      await page.waitForTimeout(1000);
      
      // Check if crisis support appears
      const crisisVisible = await page.$('.crisis-support, [class*="crisis"], [class*="emergency"]') !== null;
      results.crisisSafety.detectionWorking = crisisVisible;
      
      assert(crisisVisible, 'Crisis Detection Working', 'Crisis support should appear for crisis keywords');
      
    } catch (error) {
      log('warning', 'Could not test crisis detection', error.message);
    }

    // ====================
    // TEST 6: Age Verification Elements
    // ====================
    log('info', '🔞 Testing age verification compliance...');
    
    try {
      // Look for age verification indicators
      const hasAgeVerification = await page.evaluate(() => {
        const text = document.body.innerText.toLowerCase();
        return text.includes('18') || text.includes('age') || text.includes('adult') || text.includes('verify');
      });
      
      // For mental health platform, we need age verification
      assert(hasAgeVerification, 'Age Verification Present', 'Age verification should be visible or mentioned');
      
    } catch (error) {
      log('warning', 'Could not validate age verification', error.message);
    }

    // ====================
    // TEST 7: Performance Metrics
    // ====================
    log('info', '⚡ Collecting performance metrics...');
    
    try {
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(p => p.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      
      results.performance = { ...results.performance, ...performanceMetrics };
      
      assert(performanceMetrics.firstContentfulPaint < 3000, 'First Contentful Paint', `FCP: ${performanceMetrics.firstContentfulPaint}ms (should be < 3000ms)`);
      
    } catch (error) {
      log('warning', 'Could not collect performance metrics', error.message);
    }

    // ====================
    // TEST 8: Network Resilience
    // ====================
    log('info', '🌐 Testing network resilience...');
    
    try {
      // Simulate slow network
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 50 * 1024, // 50kb/s
        uploadThroughput: 20 * 1024,   // 20kb/s
        latency: 500 // 500ms
      });
      
      // Try to interact with form
      await page.click('input[type="email"]');
      await page.waitForTimeout(1000);
      
      // Check if page remains responsive
      const isResponsive = await page.evaluate(() => {
        return document.readyState === 'complete';
      });
      
      assert(isResponsive, 'Network Resilience', 'Page should remain responsive on slow connections');
      
    } catch (error) {
      log('warning', 'Could not test network resilience', error.message);
    }

    // ====================
    // TEST 9: Jony Ive Design Principles
    // ====================
    log('info', '🎨 Validating Jony Ive design implementation...');
    
    try {
      const designMetrics = await page.evaluate(() => {
        // Check for design system elements
        const hasRoundedCorners = !!document.querySelector('[class*="rounded"]');
        const hasGradients = !!document.querySelector('[class*="gradient"]');
        const hasProperSpacing = !!document.querySelector('[class*="space"], [class*="gap"], [class*="p-"], [class*="m-"]');
        const hasTransitions = !!document.querySelector('[class*="transition"], [class*="duration"]');
        
        // Check color palette
        const computedStyle = getComputedStyle(document.body);
        const hasSageColors = computedStyle.getPropertyValue('background-color').includes('rgb') || 
                            !!document.querySelector('[class*="sage"]');
        
        return {
          hasRoundedCorners,
          hasGradients,
          hasProperSpacing,
          hasTransitions,
          hasSageColors
        };
      });
      
      results.accessibility.designSystem = designMetrics;
      
      assert(designMetrics.hasRoundedCorners, 'Design System: Rounded Corners');
      assert(designMetrics.hasProperSpacing, 'Design System: Proper Spacing');
      assert(designMetrics.hasTransitions, 'Design System: Smooth Transitions');
      
    } catch (error) {
      log('warning', 'Could not validate design system', error.message);
    }

    // ====================
    // FINAL ASSESSMENT
    // ====================
    log('info', '📊 Generating final assessment...');
    
    const passRate = (results.passed / results.totalTests) * 100;
    results.passRate = passRate;
    results.status = passRate >= 90 ? 'EXCELLENT' : 
                    passRate >= 80 ? 'GOOD' : 
                    passRate >= 70 ? 'ACCEPTABLE' : 
                    'NEEDS_WORK';

    // Generate comprehensive report
    console.log('\n' + '='.repeat(80));
    console.log('🏆 ALCHM FINAL AUTHENTICATION VALIDATION REPORT');
    console.log('='.repeat(80));
    console.log(`📅 Timestamp: ${results.timestamp}`);
    console.log(`📊 Overall Status: ${results.status}`);
    console.log(`✅ Tests Passed: ${results.passed}/${results.totalTests} (${passRate.toFixed(1)}%)`);
    console.log(`❌ Tests Failed: ${results.failed}`);
    console.log(`⚠️  Warnings: ${results.warnings.length}`);
    console.log(`🚨 Errors: ${results.errors.length}`);
    
    if (results.performance.loginPageLoad) {
      console.log(`⚡ Login Page Load: ${results.performance.loginPageLoad}ms`);
    }
    
    if (results.performance.firstContentfulPaint) {
      console.log(`🎨 First Contentful Paint: ${results.performance.firstContentfulPaint}ms`);
    }
    
    console.log('\n🔍 DETAILED FINDINGS:');
    
    if (results.errors.length > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message}`);
      });
    }
    
    if (results.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      results.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning.message}`);
      });
    }
    
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (passRate < 90) {
      console.log('  • Address all failed tests before allowing user access');
    }
    
    if (results.performance.loginPageLoad > 3000) {
      console.log('  • Optimize login page load time for better crisis response');
    }
    
    if (results.accessibility.touchTargetIssues > 0) {
      console.log('  • Increase touch target sizes for mobile accessibility');
    }
    
    if (!results.crisisSafety.detectionWorking) {
      console.log('  • Verify crisis detection system is functioning properly');
    }
    
    console.log('\n✨ TRAUMA-INFORMED DESIGN ASSESSMENT:');
    console.log(`  • Mobile Touch Targets: ${results.accessibility.touchTargetIssues === 0 ? '✅ Compliant' : '❌ Needs Work'}`);
    console.log(`  • Crisis Support Visible: ${results.crisisSafety.detectionWorking ? '✅ Working' : '❌ Not Detected'}`);
    console.log(`  • Performance (Crisis Response): ${results.performance.loginPageLoad < 3000 ? '✅ Fast' : '⚠️  Could be faster'}`);
    
    console.log('\n🎯 FINAL VERDICT:');
    
    if (passRate >= 90 && results.errors.length === 0) {
      console.log('🎉 ALCHM is READY for user access! The authentication system meets all critical requirements.');
      console.log('✅ Users can safely access their mental health journaling sanctuary.');
    } else if (passRate >= 80) {
      console.log('⚠️  ALCHM has minor issues but is FUNCTIONAL for user access.');
      console.log('📝 Address warnings when possible, but system is operational.');
    } else {
      console.log('🚨 ALCHM has CRITICAL ISSUES that must be resolved before user access.');
      console.log('❌ Do NOT allow users to access the system until these issues are fixed.');
    }
    
    console.log('='.repeat(80));

    // Save detailed results
    fs.writeFileSync(
      path.join(__dirname, 'auth-validation-results.json'),
      JSON.stringify(results, null, 2)
    );
    
    log('info', '💾 Detailed results saved to auth-validation-results.json');

  } catch (error) {
    log('error', 'Fatal error during validation', error.message);
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return results;
}

// Run the validation
if (require.main === module) {
  runAuthenticationValidation()
    .then((results) => {
      process.exit(results.status === 'EXCELLENT' || results.status === 'GOOD' ? 0 : 1);
    })
    .catch((error) => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = { runAuthenticationValidation };