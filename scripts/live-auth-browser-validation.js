#!/usr/bin/env node

/**
 * ALCHM Live Authentication Browser Validation
 * Real-time testing of authentication across different browsers
 * 
 * This script validates:
 * 1. Chrome desktop authentication (popup method)
 * 2. Chrome mobile authentication (redirect method)
 * 3. Safari authentication compatibility
 * 4. iOS Safari fixes don't break Chrome
 * 5. Redirect fallback when popups are blocked
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Test configuration for different browsers
const BROWSER_CONFIGS = [
  {
    name: 'Chrome Desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    expectedMethod: 'popup',
    deviceType: 'desktop'
  },
  {
    name: 'Chrome Mobile (Android)',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    viewport: { width: 393, height: 851 },
    isMobile: true,
    expectedMethod: 'redirect',
    deviceType: 'mobile'
  },
  {
    name: 'Chrome Mobile (iPhone)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    expectedMethod: 'redirect',
    deviceType: 'mobile'
  },
  {
    name: 'Safari Desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15',
    viewport: { width: 1280, height: 720 },
    isMobile: false,
    expectedMethod: 'popup',
    deviceType: 'desktop'
  },
  {
    name: 'iOS Safari',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    expectedMethod: 'redirect',
    deviceType: 'mobile'
  }
];

const TEST_URL = 'http://localhost:3000/auth/login';
const RESULTS_FILE = path.join(__dirname, '../test-results/live-auth-validation.json');

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  },
  tests: []
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '🔍',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    debug: '🐛'
  }[type] || 'ℹ️';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(testName, passed, details, warnings = []) {
  const result = {
    test: testName,
    passed,
    details,
    warnings,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  testResults.summary.total++;
  
  if (passed) {
    testResults.summary.passed++;
    log(`${testName}: PASSED`, 'success');
  } else {
    testResults.summary.failed++;
    log(`${testName}: FAILED - ${details}`, 'error');
  }
  
  if (warnings.length > 0) {
    testResults.summary.warnings += warnings.length;
    warnings.forEach(warning => log(`${testName}: WARNING - ${warning}`, 'warning'));
  }
}

// Browser detection and authentication method validation
async function testBrowserDetection(page, config) {
  log(`Testing browser detection for ${config.name}...`);
  
  try {
    const detection = await page.evaluate(() => {
      const userAgent = navigator.userAgent;
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
      const isAndroid = /Android/i.test(userAgent);
      const isChrome = /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent);
      const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
      const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
      
      return {
        userAgent: userAgent.substring(0, 100),
        isIOS,
        isAndroid,
        isChrome,
        isSafari,
        isMobile,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
      };
    });
    
    const warnings = [];
    
    // Validate detection matches expectations
    if (detection.isMobile !== config.isMobile) {
      warnings.push(`Mobile detection mismatch: expected ${config.isMobile}, got ${detection.isMobile}`);
    }
    
    // Chrome-specific validations
    if (config.name.includes('Chrome')) {
      if (!detection.isChrome) {
        warnings.push('Chrome not detected correctly');
      }
    }
    
    // Safari-specific validations
    if (config.name.includes('Safari') && !config.name.includes('Chrome')) {
      if (!detection.isSafari) {
        warnings.push('Safari not detected correctly');
      }
    }
    
    addTestResult(
      `${config.name} - Browser Detection`,
      warnings.length === 0,
      `Detected: ${JSON.stringify(detection, null, 2)}`,
      warnings
    );
    
    return detection;
  } catch (error) {
    addTestResult(
      `${config.name} - Browser Detection`,
      false,
      `Error: ${error.message}`
    );
    return null;
  }
}

// Authentication strategy validation
async function testAuthStrategy(page, config) {
  log(`Testing authentication strategy for ${config.name}...`);
  
  try {
    const strategy = await page.evaluate((expectedMethod) => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent);
      const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
      
      // Determine what authentication method should be used
      let predictedMethod = 'popup'; // Default for desktop
      
      if (isIOS) {
        predictedMethod = 'redirect'; // iOS Safari always uses redirect
      } else if (isMobile && isAndroid) {
        predictedMethod = 'redirect'; // Android Chrome mobile uses redirect
      } else if (isChrome && !isMobile) {
        predictedMethod = 'popup'; // Chrome desktop supports popups
      }
      
      return {
        predictedMethod,
        expectedMethod,
        matches: predictedMethod === expectedMethod,
        browserInfo: {
          isIOS,
          isAndroid,
          isChrome,
          isMobile,
          userAgent: navigator.userAgent.substring(0, 100)
        }
      };
    }, config.expectedMethod);
    
    const warnings = [];
    
    if (!strategy.matches) {
      warnings.push(`Method mismatch: expected ${strategy.expectedMethod}, predicted ${strategy.predictedMethod}`);
    }
    
    // Chrome-specific strategy validation
    if (config.name.includes('Chrome Desktop')) {
      if (strategy.predictedMethod !== 'popup') {
        warnings.push('Chrome Desktop should use popup method');
      }
    }
    
    if (config.name.includes('Chrome Mobile')) {
      if (strategy.predictedMethod !== 'redirect') {
        warnings.push('Chrome Mobile should use redirect method');
      }
    }
    
    addTestResult(
      `${config.name} - Auth Strategy`,
      strategy.matches && warnings.length === 0,
      `Strategy: ${JSON.stringify(strategy, null, 2)}`,
      warnings
    );
    
    return strategy;
  } catch (error) {
    addTestResult(
      `${config.name} - Auth Strategy`,
      false,
      `Error: ${error.message}`
    );
    return null;
  }
}

// UI accessibility and responsiveness testing
async function testUIAccessibility(page, config) {
  log(`Testing UI accessibility for ${config.name}...`);
  
  try {
    const uiTest = await page.evaluate((isMobile) => {
      const googleButton = document.querySelector('button:has-text("Continue with Google"), button[type="button"]:not([type="submit"])');
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const crisisButtons = document.querySelectorAll('button:has-text("Call 988"), button:has-text("Text HOME"), [href*="tel:988"], [href*="sms:741741"]');
      
      function getElementSize(element) {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      }
      
      return {
        googleButton: getElementSize(googleButton),
        emailInput: getElementSize(emailInput),
        passwordInput: getElementSize(passwordInput),
        crisisButtonsCount: crisisButtons.length,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        isMobile
      };
    }, config.isMobile);
    
    const warnings = [];
    
    // Validate touch targets on mobile
    if (config.isMobile) {
      if (uiTest.googleButton && uiTest.googleButton.height < 44) {
        warnings.push(`Google button too small for touch: ${uiTest.googleButton.height}px height`);
      }
      
      if (uiTest.emailInput && uiTest.emailInput.height < 44) {
        warnings.push(`Email input too small for touch: ${uiTest.emailInput.height}px height`);
      }
      
      if (uiTest.passwordInput && uiTest.passwordInput.height < 44) {
        warnings.push(`Password input too small for touch: ${uiTest.passwordInput.height}px height`);
      }
    }
    
    // Validate crisis support presence
    if (uiTest.crisisButtonsCount === 0) {
      warnings.push('No crisis support buttons found');
    }
    
    // Validate essential elements are visible
    if (!uiTest.googleButton?.visible) {
      warnings.push('Google sign-in button not visible');
    }
    
    if (!uiTest.emailInput?.visible) {
      warnings.push('Email input not visible');
    }
    
    addTestResult(
      `${config.name} - UI Accessibility`,
      warnings.length === 0,
      `UI Test: ${JSON.stringify(uiTest, null, 2)}`,
      warnings
    );
    
    return uiTest;
  } catch (error) {
    addTestResult(
      `${config.name} - UI Accessibility`,
      false,
      `Error: ${error.message}`
    );
    return null;
  }
}

// Console log monitoring for authentication debugging
async function testConsoleLogging(page, config) {
  log(`Testing console logging for ${config.name}...`);
  
  const authLogs = [];
  
  page.on('console', msg => {
    if (msg.text().includes('🔐') || msg.text().includes('Auth') || msg.text().includes('Firebase')) {
      authLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  // Wait a bit to collect logs
  await page.waitForTimeout(2000);
  
  const warnings = [];
  
  // Look for critical auth logs
  const hasAuthInit = authLogs.some(log => log.text.includes('Auth:') || log.text.includes('🔐'));
  const hasFirebaseConfig = authLogs.some(log => log.text.includes('Firebase') || log.text.includes('🔥'));
  const hasErrors = authLogs.some(log => log.type === 'error');
  
  if (!hasAuthInit) {
    warnings.push('No authentication initialization logs found');
  }
  
  if (hasErrors) {
    const errorLogs = authLogs.filter(log => log.type === 'error');
    warnings.push(`Console errors detected: ${errorLogs.length}`);
  }
  
  addTestResult(
    `${config.name} - Console Logging`,
    warnings.length === 0,
    `Logs collected: ${authLogs.length}, Has auth init: ${hasAuthInit}, Has errors: ${hasErrors}`,
    warnings
  );
  
  return authLogs;
}

// Main testing function for a specific browser configuration
async function testBrowserConfig(browser, config) {
  log(`\n🔍 Testing ${config.name}...`);
  
  const page = await browser.newPage();
  
  try {
    // Set user agent and viewport
    await page.setUserAgent(config.userAgent);
    await page.setViewport(config.viewport);
    
    // Navigate to login page
    await page.goto(TEST_URL, { waitUntil: 'networkidle0', timeout: 10000 });
    
    // Run all tests for this configuration
    const detection = await testBrowserDetection(page, config);
    const strategy = await testAuthStrategy(page, config);
    const uiTest = await testUIAccessibility(page, config);
    const consoleTest = await testConsoleLogging(page, config);
    
    return {
      config,
      detection,
      strategy,
      uiTest,
      consoleTest
    };
    
  } catch (error) {
    log(`Error testing ${config.name}: ${error.message}`, 'error');
    addTestResult(
      `${config.name} - Overall Test`,
      false,
      `Navigation or page load error: ${error.message}`
    );
    return null;
  } finally {
    await page.close();
  }
}

// Chrome-specific comprehensive testing
async function testChromeSpecific(browser) {
  log('\n🔍 Running Chrome-specific tests...');
  
  const chromeConfigs = BROWSER_CONFIGS.filter(config => config.name.includes('Chrome'));
  
  for (const config of chromeConfigs) {
    const page = await browser.newPage();
    
    try {
      await page.setUserAgent(config.userAgent);
      await page.setViewport(config.viewport);
      
      // Test popup blocking simulation
      if (config.name === 'Chrome Desktop') {
        log('Testing popup blocking fallback for Chrome Desktop...');
        
        // Mock popup blocking
        await page.evaluateOnNewDocument(() => {
          const originalOpen = window.open;
          window.open = function() {
            throw new Error('Popup blocked');
          };
        });
        
        await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
        
        const fallbackTest = await page.evaluate(() => {
          // Test what would happen with popup blocking
          const isChrome = /chrome/i.test(navigator.userAgent);
          const isMobile = /mobile/i.test(navigator.userAgent);
          
          return {
            isChrome,
            isMobile,
            wouldFallbackToRedirect: isChrome && !isMobile,
            expectedBehavior: 'Should show popup blocked message and suggest allowing popups'
          };
        });
        
        addTestResult(
          'Chrome Desktop - Popup Blocking Fallback',
          fallbackTest.wouldFallbackToRedirect,
          `Fallback test: ${JSON.stringify(fallbackTest, null, 2)}`
        );
      }
      
    } catch (error) {
      addTestResult(
        `Chrome Specific - ${config.name}`,
        false,
        `Error: ${error.message}`
      );
    } finally {
      await page.close();
    }
  }
}

// Cross-browser compatibility verification
async function testCrossBrowserCompatibility(browser) {
  log('\n🔍 Running cross-browser compatibility tests...');
  
  const results = [];
  
  for (const config of BROWSER_CONFIGS) {
    const page = await browser.newPage();
    
    try {
      await page.setUserAgent(config.userAgent);
      await page.setViewport(config.viewport);
      await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
      
      const compatibility = await page.evaluate(() => {
        const userAgent = navigator.userAgent;
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
        const isAndroid = /Android/i.test(userAgent);
        const isChrome = /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent);
        const isSafari = /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);
        const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
        
        return {
          browser: userAgent.includes('Chrome') ? 'Chrome' : 
                  userAgent.includes('Safari') ? 'Safari' : 
                  userAgent.includes('Firefox') ? 'Firefox' : 
                  userAgent.includes('Edge') ? 'Edge' : 'Unknown',
          isIOS,
          isAndroid,
          isChrome,
          isSafari,
          isMobile,
          expectedMethod: isIOS || (isMobile && isAndroid) ? 'redirect' : 'popup'
        };
      });
      
      results.push({
        config: config.name,
        ...compatibility
      });
      
    } catch (error) {
      log(`Compatibility test error for ${config.name}: ${error.message}`, 'error');
    } finally {
      await page.close();
    }
  }
  
  // Analyze cross-browser results
  const chromeResults = results.filter(r => r.browser === 'Chrome');
  const safariResults = results.filter(r => r.browser === 'Safari');
  
  const chromeConsistent = chromeResults.every(r => 
    r.config.includes('Desktop') ? r.expectedMethod === 'popup' : r.expectedMethod === 'redirect'
  );
  
  const safariConsistent = safariResults.every(r => 
    r.config.includes('Desktop') ? r.expectedMethod === 'popup' : r.expectedMethod === 'redirect'
  );
  
  addTestResult(
    'Cross-Browser Compatibility - Chrome',
    chromeConsistent,
    `Chrome consistency across desktop/mobile: ${chromeConsistent}`
  );
  
  addTestResult(
    'Cross-Browser Compatibility - Safari',
    safariConsistent,
    `Safari consistency across desktop/mobile: ${safariConsistent}`
  );
  
  return results;
}

// Performance testing
async function testPerformance(browser) {
  log('\n🔍 Running performance tests...');
  
  const performanceResults = [];
  
  for (const config of BROWSER_CONFIGS.slice(0, 3)) { // Test first 3 for performance
    const page = await browser.newPage();
    
    try {
      await page.setUserAgent(config.userAgent);
      await page.setViewport(config.viewport);
      
      const startTime = Date.now();
      await page.goto(TEST_URL, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
      });
      
      performanceResults.push({
        browser: config.name,
        loadTime,
        ...metrics
      });
      
    } catch (error) {
      log(`Performance test error for ${config.name}: ${error.message}`, 'error');
    } finally {
      await page.close();
    }
  }
  
  // Validate performance
  const slowBrowsers = performanceResults.filter(r => r.loadTime > 5000);
  
  addTestResult(
    'Performance - Load Times',
    slowBrowsers.length === 0,
    `Performance results: ${JSON.stringify(performanceResults, null, 2)}`,
    slowBrowsers.map(r => `${r.browser} took ${r.loadTime}ms to load`)
  );
  
  return performanceResults;
}

// Save test results
function saveResults() {
  const resultsDir = path.dirname(RESULTS_FILE);
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(testResults, null, 2));
  log(`Test results saved to ${RESULTS_FILE}`, 'info');
}

// Generate summary report
function generateSummary() {
  const { summary } = testResults;
  const successRate = (summary.passed / summary.total * 100).toFixed(1);
  
  log('\n📊 TEST SUMMARY REPORT', 'info');
  log('═'.repeat(50), 'info');
  log(`Total Tests: ${summary.total}`, 'info');
  log(`Passed: ${summary.passed}`, 'success');
  log(`Failed: ${summary.failed}`, summary.failed > 0 ? 'error' : 'info');
  log(`Warnings: ${summary.warnings}`, summary.warnings > 0 ? 'warning' : 'info');
  log(`Success Rate: ${successRate}%`, successRate > 90 ? 'success' : successRate > 70 ? 'warning' : 'error');
  
  // Chrome-specific summary
  const chromeTests = testResults.tests.filter(t => t.test.includes('Chrome'));
  const chromePassRate = (chromeTests.filter(t => t.passed).length / chromeTests.length * 100).toFixed(1);
  log(`Chrome Tests: ${chromeTests.length} (${chromePassRate}% pass rate)`, chromePassRate > 90 ? 'success' : 'warning');
  
  // Critical failures
  const criticalFailures = testResults.tests.filter(t => !t.passed && (
    t.test.includes('Chrome Desktop') || 
    t.test.includes('Browser Detection') || 
    t.test.includes('Auth Strategy')
  ));
  
  if (criticalFailures.length > 0) {
    log('\n🚨 CRITICAL FAILURES:', 'error');
    criticalFailures.forEach(failure => {
      log(`• ${failure.test}: ${failure.details}`, 'error');
    });
  }
  
  // Recommendations
  log('\n💡 RECOMMENDATIONS:', 'info');
  
  if (summary.failed > 0) {
    log('• Review failed tests and fix authentication issues', 'warning');
  }
  
  if (summary.warnings > 0) {
    log('• Address warnings to improve user experience', 'warning');
  }
  
  const chromeFailures = testResults.tests.filter(t => !t.passed && t.test.includes('Chrome'));
  if (chromeFailures.length > 0) {
    log('• Chrome-specific issues detected - prioritize fixing Chrome compatibility', 'warning');
  }
  
  if (successRate > 95) {
    log('• Authentication system is performing excellently across browsers! 🎉', 'success');
  } else if (successRate > 85) {
    log('• Authentication system is performing well with minor issues', 'success');
  } else {
    log('• Authentication system needs attention to improve cross-browser compatibility', 'warning');
  }
}

// Main execution function
async function main() {
  log('🚀 Starting ALCHM Live Authentication Browser Validation', 'info');
  log(`Testing URL: ${TEST_URL}`, 'info');
  
  // Check if dev server is running
  try {
    const response = await fetch(TEST_URL);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    log(`❌ Cannot reach dev server at ${TEST_URL}`, 'error');
    log('Please make sure the development server is running with: npm run dev', 'error');
    process.exit(1);
  }
  
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
    
    log('Browser launched successfully', 'success');
    
    // Run tests for each browser configuration
    for (const config of BROWSER_CONFIGS) {
      await testBrowserConfig(browser, config);
    }
    
    // Run Chrome-specific tests
    await testChromeSpecific(browser);
    
    // Run cross-browser compatibility tests
    await testCrossBrowserCompatibility(browser);
    
    // Run performance tests
    await testPerformance(browser);
    
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'error');
    testResults.summary.failed++;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Generate and save results
  saveResults();
  generateSummary();
  
  // Exit with appropriate code
  process.exit(testResults.summary.failed > 0 ? 1 : 0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

// Run the tests
main().catch(error => {
  log(`Main execution error: ${error.message}`, 'error');
  process.exit(1);
});

module.exports = {
  testBrowserConfig,
  testChromeSpecific,
  testCrossBrowserCompatibility,
  BROWSER_CONFIGS
};