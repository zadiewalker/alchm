#!/usr/bin/env node

/**
 * ALCHM App Store Screenshot Generator
 * Generates screenshots for both iOS and Android app store submissions
 * Supports all required device sizes and orientations
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Screenshot configurations for different platforms
const SCREENSHOT_CONFIGS = {
  ios: {
    devices: [
      {
        name: 'iPhone 6.7',
        width: 1290,
        height: 2796,
        deviceScaleFactor: 3,
        folder: 'iphone-6-7'
      },
      {
        name: 'iPhone 6.5',
        width: 1242,
        height: 2688,
        deviceScaleFactor: 3,
        folder: 'iphone-6-5'
      },
      {
        name: 'iPhone 5.5',
        width: 1242,
        height: 2208,
        deviceScaleFactor: 3,
        folder: 'iphone-5-5'
      },
      {
        name: 'iPad Pro 12.9',
        width: 2048,
        height: 2732,
        deviceScaleFactor: 2,
        folder: 'ipad-12-9'
      },
      {
        name: 'iPad Pro 11',
        width: 1668,
        height: 2388,
        deviceScaleFactor: 2,
        folder: 'ipad-11'
      }
    ]
  },
  android: {
    devices: [
      {
        name: 'Phone',
        width: 1080,
        height: 1920,
        deviceScaleFactor: 3,
        folder: 'phone'
      },
      {
        name: '7inch Tablet',
        width: 1200,
        height: 1920,
        deviceScaleFactor: 2,
        folder: 'tablet-7'
      },
      {
        name: '10inch Tablet',
        width: 1920,
        height: 1200,
        deviceScaleFactor: 2,
        folder: 'tablet-10'
      }
    ]
  }
};

// Screenshot scenarios to capture
const SCREENSHOT_SCENARIOS = [
  {
    name: '1-home-screen',
    path: '/',
    description: 'Home screen with trauma-informed interface',
    waitSelector: 'main, .landing-container, .home-content'
  },
  {
    name: '2-journal-interface',
    path: '/journal',
    description: 'Journal writing interface with AI support',
    waitSelector: '.journal-container, .writing-area, textarea'
  },
  {
    name: '3-crisis-support',
    path: '/crisis',
    description: 'Crisis resources and safety features',
    waitSelector: '.crisis-container, .crisis-resources'
  },
  {
    name: '4-dashboard-insights',
    path: '/dashboard',
    description: 'Personal insights and progress tracking',
    waitSelector: '.dashboard-container, .insights-container'
  },
  {
    name: '5-privacy-settings',
    path: '/dashboard',
    description: 'Privacy controls and data management',
    waitSelector: '.dashboard-container, .settings-section'
  },
  {
    name: '6-healing-pathways',
    path: '/pathways',
    description: 'Healing pathways and growth tracking',
    waitSelector: '.pathways-container, .pathway-grid'
  }
];

class AppStoreScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.baseUrl = process.env.SCREENSHOT_URL || 'https://alchm-digital-sanctuary.web.app';
    this.outputDir = path.join(process.cwd(), 'assets', 'screenshots');
  }

  async initialize() {
    console.log('🚀 Launching browser for screenshot generation...');
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    // Ensure output directories exist
    await this.createDirectories();
  }

  async createDirectories() {
    const platforms = ['ios', 'android'];
    
    for (const platform of platforms) {
      const platformPath = path.join(this.outputDir, platform);
      await fs.mkdir(platformPath, { recursive: true });
      
      for (const device of SCREENSHOT_CONFIGS[platform].devices) {
        const devicePath = path.join(platformPath, device.folder);
        await fs.mkdir(devicePath, { recursive: true });
      }
    }
    
    console.log('📁 Created screenshot directories');
  }

  async generateScreenshotsForDevice(platform, device) {
    console.log(`📱 Generating ${platform} screenshots for ${device.name}...`);
    
    const page = await this.browser.newPage();
    
    // Set viewport and device settings
    await page.setViewport({
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.deviceScaleFactor
    });

    // Set user agent for better compatibility
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

    for (const scenario of SCREENSHOT_SCENARIOS) {
      try {
        console.log(`  📸 Capturing ${scenario.name}...`);
        
        // Navigate to the page
        await page.goto(`${this.baseUrl}${scenario.path}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for specific elements to load
        try {
          await page.waitForSelector(scenario.waitSelector, { timeout: 10000 });
        } catch (error) {
          console.log(`    ⚠️ Warning: Could not find selector ${scenario.waitSelector}, continuing...`);
        }

        // Additional wait for animations and content
        await page.waitForTimeout(3000);

        // Hide any development/beta elements that shouldn't appear in store screenshots
        await page.evaluate(() => {
          // Remove development indicators
          const devElements = document.querySelectorAll('.dev-indicator, .beta-badge, .debug-info');
          devElements.forEach(el => el.style.display = 'none');
          
          // Hide cookie banners, notifications, etc.
          const hideElements = document.querySelectorAll('.cookie-banner, .notification-banner, .dev-tools');
          hideElements.forEach(el => el.style.display = 'none');
        });

        // Capture screenshot
        const filename = `${scenario.name}-${device.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        const filepath = path.join(this.outputDir, platform, device.folder, filename);
        
        await page.screenshot({
          path: filepath,
          type: 'png',
          fullPage: false // Capture viewport only for app store
        });
        
        console.log(`    ✅ Saved: ${filename}`);

      } catch (error) {
        console.error(`    ❌ Failed to capture ${scenario.name}: ${error.message}`);
      }
    }

    await page.close();
  }

  async generateAllScreenshots() {
    console.log('🎯 Starting app store screenshot generation...');
    
    for (const platform of ['ios', 'android']) {
      console.log(`\n📱 Generating ${platform.toUpperCase()} screenshots...`);
      
      for (const device of SCREENSHOT_CONFIGS[platform].devices) {
        await this.generateScreenshotsForDevice(platform, device);
      }
    }
  }

  async generateManifest() {
    const manifest = {
      generated: new Date().toISOString(),
      baseUrl: this.baseUrl,
      platforms: {},
      scenarios: SCREENSHOT_SCENARIOS.map(s => ({
        name: s.name,
        description: s.description,
        path: s.path
      }))
    };

    for (const platform of ['ios', 'android']) {
      manifest.platforms[platform] = {
        devices: SCREENSHOT_CONFIGS[platform].devices.map(device => ({
          name: device.name,
          resolution: `${device.width}x${device.height}`,
          folder: device.folder
        }))
      };
    }

    const manifestPath = path.join(this.outputDir, 'screenshot-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log('📄 Generated screenshot manifest');
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser closed');
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.generateAllScreenshots();
      await this.generateManifest();
      
      console.log('\n🎉 Screenshot generation completed successfully!');
      console.log(`📁 Screenshots saved to: ${this.outputDir}`);
      
    } catch (error) {
      console.error('❌ Screenshot generation failed:', error);
      process.exit(1);
    } finally {
      await this.cleanup();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const generator = new AppStoreScreenshotGenerator();
  generator.run();
}

module.exports = AppStoreScreenshotGenerator;