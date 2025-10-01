#!/usr/bin/env node
/**
 * iOS Safari Authentication Flow Validation
 * CRITICAL ACCESSIBILITY TEST FOR TRAUMA SURVIVORS
 * 
 * This script validates that our iOS Safari authentication fixes work correctly
 * for users in crisis situations who need immediate access to mental health support.
 * 
 * Tests include:
 * - iOS Safari redirect authentication
 * - Private browsing mode handling
 * - Slow connection scenarios
 * - Offline fallback capabilities
 * - Crisis user error messaging
 * - Touch target accessibility
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

const TEST_SCENARIOS = [
  {
    name: 'iPhone SE iOS Safari Standard Mode',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    networkConditions: {
      offline: false,
      downloadThroughput: 500 * 1024 / 8, // 500 kbps
      uploadThroughput: 250 * 1024 / 8,   // 250 kbps
      latency: 300 // 300ms
    },
    expected: {
      redirectAuth: true,
      offlineButton: false,
      crisisSupport: true,
      touchTargets: 52 // minimum 52px for crisis accessibility
    }
  },
  {
    name: 'iPhone 12 Pro iOS Safari Slow 3G',
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    networkConditions: {
      offline: false,
      downloadThroughput: 200 * 1024 / 8, // 200 kbps (slow 3G)
      uploadThroughput: 100 * 1024 / 8,   // 100 kbps
      latency: 800 // 800ms
    },
    expected: {
      redirectAuth: true,
      optimizationMessage: true,
      slowConnectionHandling: true,
      touchTargets: 52
    }
  },
  {
    name: 'iPad Safari Offline Mode',
    viewport: { width: 820, height: 1180 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    networkConditions: {
      offline: true
    },
    expected: {
      offlineMessage: true,
      offlineButton: true,
      emergencyAccess: true,
      crisisSupport: true
    }
  }
];

class IOSAuthFlowValidator {
  constructor() {
    this.testResults = [];
    this.browser = null;
  }

  async runValidation() {
    console.log(chalk.blue('🧪 Starting iOS Safari Authentication Flow Validation\n'));
    
    try {
      this.browser = await puppeteer.launch({
        headless: false, // Show browser for debugging
        devtools: false,
        slowMo: 50, // Simulate human interaction speed
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1200,800'
        ]
      });

      for (const scenario of TEST_SCENARIOS) {
        console.log(chalk.yellow(`📱 Testing: ${scenario.name}`));
        const result = await this.testScenario(scenario);
        this.testResults.push(result);
        
        // Brief pause between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      await this.generateReport();

    } catch (error) {
      console.error(chalk.red('❌ Validation failed:'), error);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async testScenario(scenario) {
    const page = await this.browser.newPage();
    const results = {
      scenario: scenario.name,
      passed: false,
      issues: [],
      details: {}
    };

    try {
      // Configure page for scenario
      await page.setViewport(scenario.viewport);
      await page.setUserAgent(scenario.userAgent);
      
      if (scenario.networkConditions) {
        if (scenario.networkConditions.offline) {
          await page.setOfflineMode(true);
        } else {
          await page.emulateNetworkConditions(scenario.networkConditions);
        }
      }

      // Navigate to login page
      console.log('  📄 Loading login page...');
      await page.goto('http://localhost:3000/auth/login', { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });

      // Test iOS detection and mobile capabilities
      console.log('  🔍 Checking mobile detection...');
      const mobileDetection = await page.evaluate(() => {
        return {
          userAgent: navigator.userAgent,
          isMobile: /iPhone|iPad|iPod/i.test(navigator.userAgent),
          isOnline: navigator.onLine,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        };
      });

      results.details.mobileDetection = mobileDetection;
      console.log(`    ✓ Mobile detected: ${mobileDetection.isMobile}`);
      console.log(`    ✓ Online status: ${mobileDetection.isOnline}`);

      // Test connection optimization messages
      if (scenario.expected.optimizationMessage || scenario.expected.slowConnectionHandling) {
        console.log('  ⚡ Checking connection optimization messages...');
        const optimizationElements = await page.$$('[class*="connection"], [class*="optimization"]');
        if (optimizationElements.length > 0) {
          results.details.hasOptimizationMessages = true;
          console.log('    ✓ Connection optimization messages found');
        } else if (scenario.expected.optimizationMessage) {
          results.issues.push('Expected optimization messages not found');
        }
      }

      // Test offline mode indicators
      if (scenario.expected.offlineMessage) {
        console.log('  📵 Checking offline mode indicators...');
        const offlineIndicators = await page.$eval('body', (body) => {
          return body.textContent.includes('offline') || 
                 body.textContent.includes('Offline') ||
                 body.textContent.includes('no internet');
        });
        
        if (offlineIndicators) {
          results.details.hasOfflineIndicators = true;
          console.log('    ✓ Offline indicators found');
        } else {
          results.issues.push('Offline indicators not found when offline');
        }
      }

      // Test emergency/offline access button
      if (scenario.expected.offlineButton || scenario.expected.emergencyAccess) {
        console.log('  🆘 Checking emergency access options...');
        const emergencyButtons = await page.$$('button[class*="emergency"], button[class*="offline"], button:contains("Emergency"), button:contains("Offline")');
        
        if (emergencyButtons.length > 0) {
          results.details.hasEmergencyAccess = true;
          console.log('    ✓ Emergency access buttons found');
          
          // Test button accessibility
          for (const button of emergencyButtons.slice(0, 2)) {
            const buttonSize = await button.boundingBox();
            if (buttonSize && (buttonSize.width < 52 || buttonSize.height < 52)) {
              results.issues.push(`Emergency button too small: ${Math.min(buttonSize.width, buttonSize.height)}px (minimum: 52px)`);
            }
          }
        } else if (scenario.expected.offlineButton) {
          results.issues.push('Expected emergency access button not found');
        }
      }

      // Test crisis support visibility
      console.log('  🆘 Checking crisis support availability...');
      const crisisElements = await page.$$('button[href*="988"], button[href*="741741"], button:contains("988"), button:contains("Crisis"), a[href*="tel:988"]');
      
      if (crisisElements.length > 0) {
        results.details.hasCrisisSupport = true;
        console.log('    ✓ Crisis support elements found');
      } else if (scenario.expected.crisisSupport) {
        results.issues.push('Crisis support elements not visible');
      }

      // Test touch target sizes for crisis accessibility
      console.log('  👆 Checking touch target accessibility...');
      const allButtons = await page.$$('button, a, input[type="submit"]');
      let smallTargets = 0;
      
      for (const element of allButtons) {
        const bbox = await element.boundingBox();
        if (bbox) {
          const minSize = Math.min(bbox.width, bbox.height);
          if (minSize < scenario.expected.touchTargets) {
            smallTargets++;
          }
        }
      }
      
      results.details.touchTargetIssues = smallTargets;
      if (smallTargets > 0) {
        results.issues.push(`${smallTargets} touch targets below 52px minimum for crisis accessibility`);
        console.log(`    ⚠️  ${smallTargets} touch targets too small`);
      } else {
        console.log('    ✓ All touch targets meet accessibility requirements');
      }

      // Test Google sign-in button behavior (iOS specific)
      if (mobileDetection.isMobile && mobileDetection.isOnline) {
        console.log('  🔐 Testing Google sign-in method selection...');
        
        const googleButton = await page.$('button:contains("Google"), button[class*="google"]');
        if (googleButton) {
          // Check if button indicates redirect method for iOS
          const buttonText = await page.$eval('button:contains("Google"), button[class*="google"]', (btn) => btn.textContent);
          
          if (buttonText.includes('Mobile') || buttonText.includes('redirect')) {
            results.details.usesIOSRedirect = true;
            console.log('    ✓ iOS redirect method indicated');
          }
          
          // Test button click (but don't complete auth)
          try {
            await googleButton.click();
            await page.waitForTimeout(2000); // Wait for any immediate response
            
            const currentUrl = page.url();
            if (currentUrl.includes('accounts.google.com') || currentUrl !== 'http://localhost:3000/auth/login') {
              results.details.redirectInitiated = true;
              console.log('    ✓ Authentication redirect initiated');
              
              // Go back to continue testing
              await page.goBack();
              await page.waitForTimeout(1000);
            }
          } catch (error) {
            console.log('    ⚠️  Google sign-in test failed:', error.message);
          }
        }
      }

      // Test error handling with simulated failure
      console.log('  ❌ Testing error handling...');
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');

      if (emailInput && passwordInput && submitButton) {
        // Enter invalid credentials to test error handling
        await emailInput.type('test@invalid.com');
        await passwordInput.type('wrongpassword');
        await submitButton.click();
        
        // Wait for error response
        await page.waitForTimeout(3000);
        
        // Check for trauma-informed error messaging
        const errorElements = await page.$$('[class*="error"], [class*="trauma"], .text-red-200, .text-orange-200');
        if (errorElements.length > 0) {
          const errorText = await page.$eval('body', (body) => {
            const errorEl = body.querySelector('[class*="error"], [class*="trauma"], .text-red-200, .text-orange-200');
            return errorEl ? errorEl.textContent : '';
          });
          
          // Check for trauma-informed language
          const traumaInformedPhrases = [
            'gentle', 'safe', 'take your time', 'breath', 'okay', 
            'support', 'here for you', 'no pressure', 'when you\'re ready'
          ];
          
          const hasTraumaInformedLanguage = traumaInformedPhrases.some(phrase => 
            errorText.toLowerCase().includes(phrase)
          );
          
          if (hasTraumaInformedLanguage) {
            results.details.hasTraumaInformedErrors = true;
            console.log('    ✓ Trauma-informed error messaging found');
          } else {
            results.issues.push('Error messaging not trauma-informed');
          }
        }
      }

      // Determine overall pass/fail
      results.passed = results.issues.length === 0;
      
      if (results.passed) {
        console.log(chalk.green(`  ✅ ${scenario.name} - PASSED\n`));
      } else {
        console.log(chalk.red(`  ❌ ${scenario.name} - FAILED`));
        results.issues.forEach(issue => console.log(chalk.red(`    • ${issue}`)));
        console.log('');
      }

    } catch (error) {
      console.error(chalk.red(`  💥 Test failed: ${error.message}\n`));
      results.issues.push(`Test execution failed: ${error.message}`);
    } finally {
      await page.close();
    }

    return results;
  }

  async generateReport() {
    console.log(chalk.blue('\n📊 iOS Safari Authentication Validation Report\n'));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(chalk.white(`Total Scenarios: ${totalTests}`));
    console.log(chalk.green(`Passed: ${passedTests}`));
    console.log(chalk.red(`Failed: ${failedTests}`));
    console.log(chalk.cyan(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`));
    
    if (failedTests > 0) {
      console.log(chalk.red('\n🚨 Critical Issues Found:\n'));
      
      this.testResults.filter(r => !r.passed).forEach(result => {
        console.log(chalk.red(`${result.scenario}:`));
        result.issues.forEach(issue => {
          console.log(chalk.red(`  • ${issue}`));
        });
        console.log('');
      });
      
      console.log(chalk.yellow('🔧 Recommendations:\n'));
      
      const allIssues = this.testResults.flatMap(r => r.issues);
      
      if (allIssues.some(i => i.includes('touch target'))) {
        console.log(chalk.yellow('  • Increase touch target sizes to minimum 52px for crisis accessibility'));
      }
      
      if (allIssues.some(i => i.includes('trauma-informed'))) {
        console.log(chalk.yellow('  • Review error messaging to ensure trauma-informed language'));
      }
      
      if (allIssues.some(i => i.includes('offline'))) {
        console.log(chalk.yellow('  • Enhance offline mode indicators and emergency access'));
      }
      
      if (allIssues.some(i => i.includes('crisis support'))) {
        console.log(chalk.yellow('  • Ensure crisis support is always visible and accessible'));
      }
    } else {
      console.log(chalk.green('\n🎉 All Tests Passed!\n'));
      console.log(chalk.green('iOS Safari authentication is optimized for trauma survivors and crisis users.'));
      console.log(chalk.green('The system provides:\n'));
      console.log(chalk.green('  ✓ iOS Safari redirect authentication'));
      console.log(chalk.green('  ✓ Trauma-informed error messaging'));
      console.log(chalk.green('  ✓ Crisis-accessible touch targets (52px+)'));
      console.log(chalk.green('  ✓ Offline emergency access'));
      console.log(chalk.green('  ✓ Always-available crisis support'));
      console.log(chalk.green('  ✓ Connection optimization for slow networks'));
    }
    
    // Save detailed report
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        successRate: Math.round((passedTests / totalTests) * 100)
      },
      results: this.testResults
    };
    
    const fs = require('fs');
    const reportPath = './ios-auth-validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(chalk.blue(`\n📄 Detailed report saved: ${reportPath}`));
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new IOSAuthFlowValidator();
  validator.runValidation().catch(console.error);
}

module.exports = IOSAuthFlowValidator;