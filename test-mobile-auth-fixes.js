/**
 * ALCHM Mobile Authentication Testing Suite
 * Comprehensive testing for crisis-safe mobile authentication flows
 * 
 * Run with: node test-mobile-auth-fixes.js
 */

const { chromium, webkit, firefox } = require('playwright');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  screenshots: true,
  videos: false,
  reportPath: './mobile-auth-test-results.json'
};

// Device configurations for testing
const TEST_DEVICES = [
  // iOS Devices
  {
    name: 'iPhone 13 Safari',
    browser: 'webkit',
    device: 'iPhone 13',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPhone 13 Chrome',
    browser: 'chromium',
    device: 'iPhone 13',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/94.0.4606.76 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'iPad Safari',
    browser: 'webkit',
    device: 'iPad Pro',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
  },
  // Android Devices
  {
    name: 'Android Chrome',
    browser: 'chromium',
    device: 'Pixel 5',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Mobile Safari/537.36'
  },
  {
    name: 'Android Firefox',
    browser: 'firefox',
    device: 'Pixel 5',
    userAgent: 'Mozilla/5.0 (Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
  }
];

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Normal Authentication Flow',
    description: 'Standard Google OAuth authentication',
    crisisMode: false,
    networkCondition: 'online',
    batteryLevel: 80
  },
  {
    name: 'Popup Blocked Fallback',
    description: 'Test redirect fallback when popup is blocked',
    crisisMode: false,
    networkCondition: 'online',
    batteryLevel: 80,
    blockPopups: true
  },
  {
    name: 'Crisis Mode Authentication',
    description: 'Authentication during crisis with emergency options',
    crisisMode: true,
    networkCondition: 'online',
    batteryLevel: 60
  },
  {
    name: 'Low Battery Crisis Mode',
    description: 'Crisis authentication with low battery',
    crisisMode: true,
    networkCondition: 'online',
    batteryLevel: 5
  },
  {
    name: 'Offline Crisis Mode',
    description: 'Emergency access when offline',
    crisisMode: true,
    networkCondition: 'offline',
    batteryLevel: 30
  },
  {
    name: 'Private Browsing Mode',
    description: 'Authentication in private browsing',
    crisisMode: false,
    networkCondition: 'online',
    batteryLevel: 70,
    privateBrowsing: true
  },
  {
    name: 'Network Interruption',
    description: 'Authentication with network issues',
    crisisMode: false,
    networkCondition: 'slow',
    batteryLevel: 50
  }
];

class MobileAuthTester {
  constructor() {
    this.results = {
      testRun: {
        timestamp: new Date().toISOString(),
        totalTests: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      deviceResults: [],
      detailedResults: []
    };
  }

  async runAllTests() {
    console.log('🔐 Starting ALCHM Mobile Authentication Test Suite');
    console.log('==================================================');
    console.log(`Testing ${TEST_DEVICES.length} devices × ${TEST_SCENARIOS.length} scenarios`);
    console.log('');

    for (const device of TEST_DEVICES) {
      console.log(`📱 Testing device: ${device.name}`);
      const deviceResults = await this.testDevice(device);
      this.results.deviceResults.push(deviceResults);
      console.log('');
    }

    await this.generateReport();
    console.log('✅ Testing complete! Check mobile-auth-test-results.json for full report.');
  }

  async testDevice(deviceConfig) {
    const browser = await this.launchBrowser(deviceConfig.browser);
    const context = await browser.newContext({
      userAgent: deviceConfig.userAgent,
      viewport: this.getViewportForDevice(deviceConfig.device),
      hasTouch: true,
      isMobile: true
    });

    const deviceResults = {
      device: deviceConfig.name,
      scenarios: [],
      overallSuccess: true
    };

    for (const scenario of TEST_SCENARIOS) {
      console.log(`  Testing: ${scenario.name}`);
      try {
        const result = await this.testScenario(context, scenario, deviceConfig);
        deviceResults.scenarios.push(result);
        this.results.totalTests++;
        
        if (result.success) {
          this.results.passed++;
          console.log(`    ✅ Passed`);
        } else {
          this.results.failed++;
          deviceResults.overallSuccess = false;
          console.log(`    ❌ Failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
        this.results.failed++;
        deviceResults.scenarios.push({
          scenario: scenario.name,
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }

    await browser.close();
    return deviceResults;
  }

  async testScenario(context, scenario, deviceConfig) {
    const page = await context.newPage();
    
    try {
      // Setup scenario conditions
      await this.setupScenarioConditions(page, scenario);
      
      // Navigate to login page
      await page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, { 
        waitUntil: 'networkidle',
        timeout: TEST_CONFIG.timeout 
      });

      // Wait for mobile detection to complete
      await page.waitForSelector('[data-testid="mobile-auth-button"], button:has-text("Continue with Google")', {
        timeout: 10000
      });

      // Take screenshot if enabled
      if (TEST_CONFIG.screenshots) {
        await page.screenshot({
          path: `screenshots/${deviceConfig.name}-${scenario.name}-initial.png`
        });
      }

      // Test authentication flow
      const authResult = await this.testAuthenticationFlow(page, scenario, deviceConfig);
      
      return {
        scenario: scenario.name,
        success: authResult.success,
        error: authResult.error,
        metrics: authResult.metrics,
        timestamp: new Date().toISOString()
      };

    } finally {
      await page.close();
    }
  }

  async testAuthenticationFlow(page, scenario, deviceConfig) {
    const startTime = Date.now();
    
    try {
      // Check for crisis mode detection
      if (scenario.crisisMode) {
        await this.verifyCrisisModeActivation(page);
      }

      // Test authentication button interaction
      const authButton = await page.waitForSelector(
        'button:has-text("Continue with Google")', 
        { timeout: 5000 }
      );

      // Check button accessibility (minimum 48px touch target)
      const buttonBox = await authButton.boundingBox();
      if (buttonBox && (buttonBox.height < 48 || buttonBox.width < 100)) {
        throw new Error('Authentication button does not meet minimum touch target requirements');
      }

      // Simulate authentication attempt
      await authButton.click();

      // Wait for authentication response or error
      await page.waitForTimeout(2000);

      // Check for appropriate error handling or success
      const errorMessage = await page.$('.test-result.error, [data-testid="auth-error"]');
      const successIndicator = await page.$('[data-testid="auth-success"], .auth-success');
      const crisisSupport = await page.$('[data-testid="crisis-support"]');

      const metrics = {
        responseTime: Date.now() - startTime,
        buttonAccessible: buttonBox?.height >= 48,
        crisisSupportVisible: !!crisisSupport,
        errorHandlingPresent: !!errorMessage
      };

      // Scenario-specific validations
      if (scenario.crisisMode && !crisisSupport) {
        throw new Error('Crisis support options not displayed in crisis mode');
      }

      if (scenario.networkCondition === 'offline' && !crisisSupport) {
        throw new Error('Offline crisis resources not available');
      }

      return {
        success: true,
        metrics
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        metrics: {
          responseTime: Date.now() - startTime
        }
      };
    }
  }

  async setupScenarioConditions(page, scenario) {
    // Set network conditions
    if (scenario.networkCondition === 'offline') {
      await page.setOffline(true);
    } else if (scenario.networkCondition === 'slow') {
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 500);
      });
    }

    // Set crisis mode
    if (scenario.crisisMode) {
      await page.addInitScript(() => {
        localStorage.setItem('alchm_crisis_mode', 'active');
        sessionStorage.setItem('alchm_emergency_access', 'true');
      });
    }

    // Simulate battery level
    if (scenario.batteryLevel !== undefined) {
      await page.addInitScript((batteryLevel) => {
        Object.defineProperty(navigator, 'getBattery', {
          writable: false,
          value: () => Promise.resolve({
            level: batteryLevel / 100,
            charging: batteryLevel > 20
          })
        });
      }, scenario.batteryLevel);
    }

    // Block popups if needed
    if (scenario.blockPopups) {
      await page.addInitScript(() => {
        window.open = () => null;
      });
    }
  }

  async verifyCrisisModeActivation(page) {
    // Check for crisis mode indicators
    const crisisIndicators = [
      '.crisis-alert',
      '[data-testid="crisis-banner"]',
      'text="Crisis support is available"',
      'button:has-text("Call 988")',
      'button:has-text("Text HOME")'
    ];

    let found = false;
    for (const indicator of crisisIndicators) {
      try {
        await page.waitForSelector(indicator, { timeout: 3000 });
        found = true;
        break;
      } catch (e) {
        // Continue checking other indicators
      }
    }

    if (!found) {
      throw new Error('Crisis mode not properly activated');
    }
  }

  async launchBrowser(browserType) {
    const browserOptions = {
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-dev-shm-usage']
    };

    switch (browserType) {
      case 'chromium':
        return await chromium.launch(browserOptions);
      case 'webkit':
        return await webkit.launch(browserOptions);
      case 'firefox':
        return await firefox.launch(browserOptions);
      default:
        return await chromium.launch(browserOptions);
    }
  }

  getViewportForDevice(deviceName) {
    const viewports = {
      'iPhone 13': { width: 390, height: 844 },
      'iPad Pro': { width: 1024, height: 1366 },
      'Pixel 5': { width: 393, height: 851 }
    };
    return viewports[deviceName] || { width: 375, height: 667 };
  }

  async generateReport() {
    this.results.summary = {
      successRate: (this.results.passed / this.results.totalTests * 100).toFixed(2) + '%',
      criticalIssues: this.identifyCriticalIssues(),
      recommendations: this.generateRecommendations()
    };

    fs.writeFileSync(
      TEST_CONFIG.reportPath, 
      JSON.stringify(this.results, null, 2)
    );

    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${this.results.totalTests}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${this.results.summary.successRate}`);
    
    if (this.results.summary.criticalIssues.length > 0) {
      console.log('\n🚨 Critical Issues Found:');
      this.results.summary.criticalIssues.forEach(issue => {
        console.log(`- ${issue}`);
      });
    }
  }

  identifyCriticalIssues() {
    const issues = [];
    
    // Check for devices with complete failure
    this.results.deviceResults.forEach(device => {
      if (!device.overallSuccess) {
        issues.push(`${device.device} has authentication failures`);
      }
    });

    // Check for crisis mode failures
    const crisisModeFailures = this.results.deviceResults.filter(device => 
      device.scenarios.some(scenario => 
        scenario.scenario.includes('Crisis') && !scenario.success
      )
    );

    if (crisisModeFailures.length > 0) {
      issues.push('Crisis mode authentication failures detected');
    }

    return issues;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.failed > 0) {
      recommendations.push('Review failed test cases and implement fixes');
    }

    if (this.results.summary.criticalIssues.length > 0) {
      recommendations.push('Address critical issues before deployment');
    }

    recommendations.push('Test on real devices to confirm results');
    recommendations.push('Monitor authentication success rates in production');

    return recommendations;
  }
}

// Ensure screenshots directory exists
if (!fs.existsSync('screenshots')) {
  fs.mkdirSync('screenshots');
}

// Run tests
(async () => {
  const tester = new MobileAuthTester();
  await tester.runAllTests();
})().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});