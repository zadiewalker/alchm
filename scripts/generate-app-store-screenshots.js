#!/usr/bin/env node

/**
 * App Store Screenshot Generator
 * Generates all required screenshot sizes for iOS and Android submissions
 * Showcases sage green mobile experience and trauma-informed features
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Screenshot specifications for app stores
const SCREENSHOT_SPECS = {
  ios: {
    // iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)
    'iphone-67': { width: 1290, height: 2796, name: 'iPhone 6.7"' },
    // iPhone 6.5" (iPhone 11 Pro Max, XS Max)  
    'iphone-65': { width: 1242, height: 2688, name: 'iPhone 6.5"' },
    // iPhone 5.5" (iPhone 8 Plus)
    'iphone-55': { width: 1242, height: 2208, name: 'iPhone 5.5"' },
    // iPad Pro 12.9" (6th gen)
    'ipad-129': { width: 2048, height: 2732, name: 'iPad Pro 12.9"' },
    // iPad Pro 12.9" (2nd gen)
    'ipad-129-2nd': { width: 2048, height: 2732, name: 'iPad Pro 12.9" 2nd' }
  },
  android: {
    // Phone
    'phone': { width: 1080, height: 1920, name: 'Android Phone' },
    // 7" Tablet  
    'tablet-7': { width: 1200, height: 1920, name: '7" Tablet' },
    // 10" Tablet
    'tablet-10': { width: 1920, height: 1200, name: '10" Tablet' }
  }
};

// Key screens to showcase
const SCREENSHOT_FLOWS = [
  {
    name: '01-landing-sage-sanctuary',
    url: '/',
    description: 'Landing page showcasing sage sanctuary design',
    waitFor: '.sage-sanctuary'
  },
  {
    name: '02-login-cultural-welcome',
    url: '/auth/login', 
    description: 'Login page with cultural inclusivity',
    waitFor: '.cultural-welcome'
  },
  {
    name: '03-onboarding-trauma-informed',
    url: '/onboarding',
    description: 'Trauma-informed onboarding flow',
    waitFor: '.trauma-informed-welcome'
  },
  {
    name: '04-journal-sage-interface',
    url: '/journal',
    description: 'Journal interface with sage green colors',
    waitFor: '.sage-journal-interface',
    interactions: [
      { type: 'fill', selector: 'textarea', value: 'Today I felt grateful for the small moments of peace...' }
    ]
  },
  {
    name: '05-dashboard-growth-tracking',
    url: '/dashboard',
    description: 'Dashboard showing growth patterns and insights',
    waitFor: '.growth-dashboard'
  }
];

class AppStoreScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.outputDir = path.join(process.cwd(), 'app-store-assets', 'screenshots');
  }

  async init() {
    console.log('🚀 Initializing App Store Screenshot Generator...');
    
    // Create output directory
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Launch browser with mobile settings
    this.browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
  }

  async generateScreenshots() {
    console.log('📸 Generating app store screenshots...');

    const baseUrl = 'http://localhost:3000';
    
    // Test if local server is running
    const testPage = await this.browser.newPage();
    try {
      await testPage.goto(baseUrl, { timeout: 5000 });
      console.log('✅ Local server detected at localhost:3000');
    } catch (error) {
      console.error('❌ Local server not running. Please start with: npm run dev');
      process.exit(1);
    }
    await testPage.close();

    // Generate for each platform and device
    for (const [platform, devices] of Object.entries(SCREENSHOT_SPECS)) {
      console.log(`\n📱 Generating ${platform.toUpperCase()} screenshots...`);
      
      for (const [deviceKey, device] of Object.entries(devices)) {
        console.log(`  📐 ${device.name} (${device.width}x${device.height})`);
        
        const deviceDir = path.join(this.outputDir, platform, deviceKey);
        await fs.mkdir(deviceDir, { recursive: true });
        
        // Generate screenshots for each flow
        for (const flow of SCREENSHOT_FLOWS) {
          await this.captureScreenshot(baseUrl, flow, device, deviceDir);
        }
      }
    }

    console.log('\n✨ All screenshots generated successfully!');
    console.log(`📁 Screenshots saved to: ${this.outputDir}`);
  }

  async captureScreenshot(baseUrl, flow, device, outputDir) {
    const page = await this.browser.newPage();
    
    try {
      // Set viewport for device
      await page.setViewport({
        width: device.width,
        height: device.height,
        deviceScaleFactor: 1
      });

      // Set mobile user agent
      await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      );

      // Add sage green enforcement CSS
      await page.addStyleTag({
        content: `
          /* Force sage green colors for screenshots */
          :root {
            --sage-primary: #a4b792 !important;
            --sage-secondary: #8fa37c !important;
            --sage-light: #b8c5a6 !important;
          }
          
          .sage-sanctuary,
          .sage-enforced,
          [data-sage-enforced] {
            background: linear-gradient(145deg, #a4b792 0%, #8fa37c 100%) !important;
            color: rgba(254, 252, 251, 0.95) !important;
          }
          
          .btn-primary {
            background: #a4b792 !important;
            border-color: #8fa37c !important;
          }
          
          .card-sanctuary {
            background: rgba(164, 183, 146, 0.1) !important;
            border-color: rgba(164, 183, 146, 0.3) !important;
            backdrop-filter: blur(20px) !important;
          }
        `
      });

      console.log(`    📷 Capturing ${flow.name}...`);
      
      // Navigate to page
      await page.goto(`${baseUrl}${flow.url}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for specific element if specified
      if (flow.waitFor) {
        try {
          await page.waitForSelector(flow.waitFor, { timeout: 10000 });
        } catch (error) {
          console.warn(`    ⚠️  Element ${flow.waitFor} not found, continuing...`);
        }
      }

      // Perform interactions if specified
      if (flow.interactions) {
        for (const interaction of flow.interactions) {
          try {
            if (interaction.type === 'fill') {
              await page.waitForSelector(interaction.selector, { timeout: 5000 });
              await page.type(interaction.selector, interaction.value);
              await page.waitForTimeout(1000); // Let UI update
            }
          } catch (error) {
            console.warn(`    ⚠️  Interaction failed: ${error.message}`);
          }
        }
      }

      // Wait for page to fully render
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshotPath = path.join(outputDir, `${flow.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: device.width,
          height: device.height
        }
      });

      console.log(`    ✅ Saved: ${flow.name}.png`);

    } catch (error) {
      console.error(`    ❌ Failed to capture ${flow.name}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async generateReadme() {
    const readmePath = path.join(this.outputDir, 'README.md');
    const readme = `# App Store Screenshots

Generated on: ${new Date().toISOString()}

## iOS Screenshots
- iPhone 6.7" (1290x2796) - iPhone 14/15 Pro Max
- iPhone 6.5" (1242x2688) - iPhone 11/12/13 Pro Max  
- iPhone 5.5" (1242x2208) - iPhone 8 Plus
- iPad Pro 12.9" (2048x2732) - 6th generation
- iPad Pro 12.9" (2048x2732) - 2nd generation

## Android Screenshots  
- Phone (1080x1920) - Standard Android phone
- 7" Tablet (1200x1920) - 7-inch tablet
- 10" Tablet (1920x1200) - 10-inch tablet

## Screenshot Flows
1. **Landing Page** - Sage sanctuary welcome experience
2. **Login** - Cultural inclusivity and safety messaging  
3. **Onboarding** - Trauma-informed introduction flow
4. **Journal** - Core journaling interface with sage colors
5. **Dashboard** - Growth tracking and insights view

## Usage
These screenshots are optimized for:
- App Store Connect (iOS)
- Google Play Console (Android)  
- Social media promotion
- Press kit materials
- Website gallery

Each screenshot showcases ALCHM's trauma-informed design and sage green color palette.
`;

    await fs.writeFile(readmePath, readme);
    console.log(`📝 Generated README at: ${readmePath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const generator = new AppStoreScreenshotGenerator();
  
  try {
    await generator.init();
    await generator.generateScreenshots();
    await generator.generateReadme();
    console.log('\n🎉 App store screenshot generation complete!');
  } catch (error) {
    console.error('💥 Screenshot generation failed:', error);
    process.exit(1);
  } finally {
    await generator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { AppStoreScreenshotGenerator };