#!/usr/bin/env node

/**
 * Mobile Sage Green Experience Tester
 * Comprehensive testing suite to verify sage colors display correctly on mobile devices
 * Tests the nuclear override system and JavaScript enforcement mechanisms
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Mobile device specifications for testing
const MOBILE_DEVICES = [
  {
    name: 'iPhone 14 Pro Max',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 428, height: 926, deviceScaleFactor: 3 }
  },
  {
    name: 'iPhone 13 Mini',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 375, height: 812, deviceScaleFactor: 3 }
  },
  {
    name: 'Samsung Galaxy S21',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    viewport: { width: 360, height: 800, deviceScaleFactor: 3 }
  },
  {
    name: 'iPad Air',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    viewport: { width: 820, height: 1180, deviceScaleFactor: 2 }
  },
  {
    name: 'Pixel 7',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36',
    viewport: { width: 412, height: 915, deviceScaleFactor: 2.6 }
  }
];

// Critical pages to test sage green enforcement
const TEST_PAGES = [
  { 
    url: '/', 
    name: 'Landing Page',
    sageElements: ['.sage-sanctuary', '[data-sage-enforced]', 'main'],
    criticalSelectors: ['.sage-sanctuary', '.heading-sanctuary']
  },
  { 
    url: '/auth/login', 
    name: 'Login Page',
    sageElements: ['.sage-enforced', '.sage-sanctuary', 'body'],
    criticalSelectors: ['.sage-enforced', '.auth-container']
  },
  { 
    url: '/onboarding', 
    name: 'Onboarding',
    sageElements: ['.sage-sanctuary', '.onboarding-container'],
    criticalSelectors: ['.sage-sanctuary']
  },
  { 
    url: '/journal', 
    name: 'Journal Interface',
    sageElements: ['.sage-journal-interface', '.journal-container'],
    criticalSelectors: ['.sage-journal-interface']
  },
  { 
    url: '/dashboard', 
    name: 'Dashboard',
    sageElements: ['.dashboard-container', '.sage-enforced'],
    criticalSelectors: ['.dashboard-container']
  }
];

// Expected sage green color values
const SAGE_COLORS = {
  primary: '#a4b792',
  secondary: '#8fa37c', 
  light: '#b8c5a6',
  dark: '#7a8869'
};

class MobileSageExperienceTester {
  constructor() {
    this.browser = null;
    this.testResults = [];
    this.outputDir = path.join(process.cwd(), 'test-results', 'mobile-sage-testing');
  }

  async init() {
    console.log('📱 Initializing Mobile Sage Green Experience Tester...');
    
    // Create output directory
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Launch browser with mobile-optimized settings
    this.browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--enable-gpu',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows'
      ]
    });
  }

  async runMobileSageTests() {
    console.log('🧪 Running comprehensive mobile sage green tests...\n');

    const baseUrl = 'http://localhost:3000';
    
    // Test if local server is running
    const testPage = await this.browser.newPage();
    try {
      await testPage.goto(baseUrl, { timeout: 5000 });
      console.log('✅ Local server detected at localhost:3000\n');
    } catch (error) {
      console.error('❌ Local server not running. Please start with: npm run dev');
      process.exit(1);
    }
    await testPage.close();

    // Test each mobile device
    for (const device of MOBILE_DEVICES) {
      console.log(`🔍 Testing device: ${device.name}`);
      await this.testDeviceSageExperience(baseUrl, device);
      console.log();
    }

    // Generate test report
    await this.generateTestReport();
    
    console.log('🎉 Mobile sage green testing complete!');
    console.log(`📊 Test report generated: ${path.join(this.outputDir, 'sage-test-report.html')}`);
  }

  async testDeviceSageExperience(baseUrl, device) {
    const page = await this.browser.newPage();
    
    try {
      // Configure mobile device
      await page.setUserAgent(device.userAgent);
      await page.setViewport(device.viewport);
      
      const deviceResults = {
        deviceName: device.name,
        pageResults: [],
        overallScore: 0,
        timestamp: new Date().toISOString()
      };

      // Test each page
      for (const testPage of TEST_PAGES) {
        console.log(`  📄 Testing ${testPage.name}...`);
        
        const pageResult = await this.testPageSageColors(page, baseUrl, testPage, device);
        deviceResults.pageResults.push(pageResult);
        
        // Take screenshot for visual verification
        await this.capturePageScreenshot(page, device.name, testPage.name);
      }

      // Calculate overall device score
      deviceResults.overallScore = this.calculateOverallScore(deviceResults.pageResults);
      this.testResults.push(deviceResults);

      console.log(`  📊 Device Score: ${deviceResults.overallScore}% sage green compliance`);
      
    } catch (error) {
      console.error(`  ❌ Device testing failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testPageSageColors(page, baseUrl, testPage, device) {
    const pageResult = {
      pageName: testPage.name,
      url: testPage.url,
      sageElementsFound: 0,
      sageElementsTested: 0,
      colorCompliantElements: 0,
      jsEnforcementActive: false,
      cssOverridesActive: false,
      criticalElementsCompliant: 0,
      errors: [],
      score: 0
    };

    try {
      // Navigate to page
      await page.goto(`${baseUrl}${testPage.url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for JavaScript enforcement to run
      await page.waitForTimeout(3000);

      // Check if mobile sage enforcer is active
      const jsEnforcementCheck = await page.evaluate(() => {
        return window.mobileSageEnforcerActive || 
               document.querySelector('[data-mobile-sage-enforced="true"]') !== null ||
               window.getComputedStyle(document.body).getPropertyValue('--mobile-sage-active') === 'true';
      });
      pageResult.jsEnforcementActive = jsEnforcementCheck;

      // Check CSS overrides
      const cssOverrideCheck = await page.evaluate(() => {
        const testEl = document.createElement('div');
        testEl.className = 'sage-enforced';
        document.body.appendChild(testEl);
        const styles = window.getComputedStyle(testEl);
        const hasOverride = styles.background.includes('164, 183, 146') || 
                           styles.backgroundColor.includes('#a4b792') ||
                           styles.backgroundImage.includes('gradient');
        document.body.removeChild(testEl);
        return hasOverride;
      });
      pageResult.cssOverridesActive = cssOverrideCheck;

      // Test sage elements
      for (const selector of testPage.sageElements) {
        try {
          const elements = await page.$$(selector);
          pageResult.sageElementsFound += elements.length;

          for (const element of elements) {
            pageResult.sageElementsTested++;
            
            const colorInfo = await element.evaluate((el) => {
              const styles = window.getComputedStyle(el);
              return {
                backgroundColor: styles.backgroundColor,
                backgroundImage: styles.backgroundImage,
                background: styles.background
              };
            });

            // Check if element has sage colors
            const hasSageColors = this.checkSageColors(colorInfo);
            if (hasSageColors) {
              pageResult.colorCompliantElements++;
            }
          }
        } catch (error) {
          pageResult.errors.push(`Failed to test ${selector}: ${error.message}`);
        }
      }

      // Test critical elements specifically
      for (const selector of testPage.criticalSelectors || []) {
        try {
          const element = await page.$(selector);
          if (element) {
            const colorInfo = await element.evaluate((el) => {
              const styles = window.getComputedStyle(el);
              return {
                backgroundColor: styles.backgroundColor,
                backgroundImage: styles.backgroundImage,
                background: styles.background
              };
            });

            if (this.checkSageColors(colorInfo)) {
              pageResult.criticalElementsCompliant++;
            }
          }
        } catch (error) {
          pageResult.errors.push(`Critical element ${selector} test failed: ${error.message}`);
        }
      }

      // Calculate page score
      pageResult.score = this.calculatePageScore(pageResult, testPage);

    } catch (error) {
      pageResult.errors.push(`Page load failed: ${error.message}`);
    }

    return pageResult;
  }

  checkSageColors(colorInfo) {
    const colorString = `${colorInfo.backgroundColor} ${colorInfo.backgroundImage} ${colorInfo.background}`.toLowerCase();
    
    // Check for sage color values
    const hasSagePrimary = colorString.includes('#a4b792') || 
                          colorString.includes('164, 183, 146') ||
                          colorString.includes('rgb(164, 183, 146)');
    
    const hasSageSecondary = colorString.includes('#8fa37c') || 
                            colorString.includes('143, 163, 124') ||
                            colorString.includes('rgb(143, 163, 124)');
    
    const hasSageGradient = colorString.includes('gradient') && 
                           (colorString.includes('164') || colorString.includes('183') || colorString.includes('146'));

    return hasSagePrimary || hasSageSecondary || hasSageGradient;
  }

  calculatePageScore(pageResult, testPage) {
    let score = 0;
    
    // Base score for JS and CSS enforcement
    if (pageResult.jsEnforcementActive) score += 25;
    if (pageResult.cssOverridesActive) score += 25;
    
    // Score for color compliance
    if (pageResult.sageElementsTested > 0) {
      const colorComplianceRate = pageResult.colorCompliantElements / pageResult.sageElementsTested;
      score += colorComplianceRate * 30;
    }
    
    // Critical elements bonus
    if (testPage.criticalSelectors && testPage.criticalSelectors.length > 0) {
      const criticalComplianceRate = pageResult.criticalElementsCompliant / testPage.criticalSelectors.length;
      score += criticalComplianceRate * 20;
    }
    
    // Penalty for errors
    score -= Math.min(pageResult.errors.length * 5, 20);
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  calculateOverallScore(pageResults) {
    if (pageResults.length === 0) return 0;
    
    const totalScore = pageResults.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / pageResults.length);
  }

  async capturePageScreenshot(page, deviceName, pageName) {
    try {
      const screenshotPath = path.join(
        this.outputDir, 
        'screenshots', 
        `${deviceName.replace(/\s+/g, '_')}_${pageName.replace(/\s+/g, '_')}.png`
      );
      
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });
    } catch (error) {
      console.warn(`    ⚠️ Screenshot failed: ${error.message}`);
    }
  }

  async generateTestReport() {
    const reportData = {
      testSuite: 'ALCHM Mobile Sage Green Experience',
      timestamp: new Date().toISOString(),
      totalDevicesTested: this.testResults.length,
      overallScore: this.calculateOverallTestScore(),
      deviceResults: this.testResults,
      sageColorStandards: SAGE_COLORS,
      recommendations: this.generateRecommendations()
    };

    // Generate JSON report
    await fs.writeFile(
      path.join(this.outputDir, 'sage-test-results.json'),
      JSON.stringify(reportData, null, 2)
    );

    // Generate HTML report
    const htmlReport = this.generateHTMLReport(reportData);
    await fs.writeFile(
      path.join(this.outputDir, 'sage-test-report.html'),
      htmlReport
    );

    console.log(`\n📊 Test Results Summary:`);
    console.log(`   Overall Score: ${reportData.overallScore}% sage compliance`);
    console.log(`   Devices Tested: ${reportData.totalDevicesTested}`);
    console.log(`   Pages per Device: ${TEST_PAGES.length}`);
  }

  calculateOverallTestScore() {
    if (this.testResults.length === 0) return 0;
    
    const totalScore = this.testResults.reduce((sum, result) => sum + result.overallScore, 0);
    return Math.round(totalScore / this.testResults.length);
  }

  generateRecommendations() {
    const recommendations = [];
    const overallScore = this.calculateOverallTestScore();
    
    if (overallScore < 80) {
      recommendations.push('🔴 URGENT: Sage green enforcement needs improvement');
    }
    
    if (overallScore >= 80 && overallScore < 95) {
      recommendations.push('🟡 GOOD: Minor sage color inconsistencies detected');
    }
    
    if (overallScore >= 95) {
      recommendations.push('🟢 EXCELLENT: Sage green experience is optimized');
    }

    // Specific recommendations based on results
    const jsEnforcementFailed = this.testResults.some(device => 
      device.pageResults.some(page => !page.jsEnforcementActive)
    );
    
    if (jsEnforcementFailed) {
      recommendations.push('📱 Check mobile-sage-enforcer.js loading and execution');
    }

    const cssOverridesFailed = this.testResults.some(device => 
      device.pageResults.some(page => !page.cssOverridesActive)
    );
    
    if (cssOverridesFailed) {
      recommendations.push('🎨 Verify mobile-sage-nuclear.css layer priorities');
    }

    return recommendations;
  }

  generateHTMLReport(reportData) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Mobile Sage Green Test Report</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #a4b792;
            padding-bottom: 20px;
        }
        .score-badge { 
            display: inline-block; 
            padding: 10px 20px; 
            border-radius: 50px; 
            color: white; 
            font-weight: bold; 
            font-size: 18px;
            margin: 10px;
        }
        .score-excellent { background: #4CAF50; }
        .score-good { background: #FF9800; }
        .score-poor { background: #f44336; }
        .device-results { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .device-card { 
            border: 2px solid #e0e0e0; 
            border-radius: 10px; 
            padding: 20px; 
            background: #fafafa;
        }
        .page-result { 
            margin: 15px 0; 
            padding: 15px; 
            background: white; 
            border-radius: 8px; 
            border-left: 4px solid #a4b792;
        }
        .recommendations { 
            background: #f8f9fa; 
            border: 2px solid #a4b792; 
            border-radius: 10px; 
            padding: 20px; 
            margin: 30px 0;
        }
        .color-swatch {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 3px;
            margin-right: 8px;
            vertical-align: middle;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .stat-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 2px solid #e9ecef;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #a4b792;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧙‍♀️ ALCHM Mobile Sage Green Experience Test Report</h1>
            <p>Generated: ${new Date(reportData.timestamp).toLocaleString()}</p>
            <div class="score-badge ${reportData.overallScore >= 95 ? 'score-excellent' : reportData.overallScore >= 80 ? 'score-good' : 'score-poor'}">
                Overall Score: ${reportData.overallScore}%
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${reportData.totalDevicesTested}</div>
                <div>Devices Tested</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${TEST_PAGES.length}</div>
                <div>Pages per Device</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${reportData.totalDevicesTested * TEST_PAGES.length}</div>
                <div>Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${reportData.overallScore}%</div>
                <div>Sage Compliance</div>
            </div>
        </div>

        <div class="recommendations">
            <h3>🎯 Recommendations</h3>
            <ul>
                ${reportData.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
        </div>

        <h3>🎨 Sage Color Standards</h3>
        <p>
            <span class="color-swatch" style="background: ${SAGE_COLORS.primary}"></span>Primary: ${SAGE_COLORS.primary}
            <span class="color-swatch" style="background: ${SAGE_COLORS.secondary}"></span>Secondary: ${SAGE_COLORS.secondary}
            <span class="color-swatch" style="background: ${SAGE_COLORS.light}"></span>Light: ${SAGE_COLORS.light}
            <span class="color-swatch" style="background: ${SAGE_COLORS.dark}"></span>Dark: ${SAGE_COLORS.dark}
        </p>

        <h3>📱 Device Results</h3>
        <div class="device-results">
            ${reportData.deviceResults.map(device => `
                <div class="device-card">
                    <h4>${device.deviceName}</h4>
                    <div class="score-badge ${device.overallScore >= 95 ? 'score-excellent' : device.overallScore >= 80 ? 'score-good' : 'score-poor'}">
                        ${device.overallScore}%
                    </div>
                    
                    ${device.pageResults.map(page => `
                        <div class="page-result">
                            <strong>${page.pageName}</strong> (${page.score}%)
                            <br>
                            <small>
                                Elements: ${page.colorCompliantElements}/${page.sageElementsTested} compliant |
                                JS: ${page.jsEnforcementActive ? '✅' : '❌'} |
                                CSS: ${page.cssOverridesActive ? '✅' : '❌'}
                            </small>
                            ${page.errors.length > 0 ? `<br><small style="color: red;">Errors: ${page.errors.length}</small>` : ''}
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>

        <footer style="text-align: center; margin-top: 40px; color: #666;">
            <p>ALCHM - Trauma-Informed AI Journaling | Sage Green Experience Testing Suite</p>
        </footer>
    </div>
</body>
</html>`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const tester = new MobileSageExperienceTester();
  
  try {
    await tester.init();
    await tester.runMobileSageTests();
  } catch (error) {
    console.error('💥 Mobile sage testing failed:', error);
    process.exit(1);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { MobileSageExperienceTester };