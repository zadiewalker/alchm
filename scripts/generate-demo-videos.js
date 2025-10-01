#!/usr/bin/env node

/**
 * ALCHM Demo Video Generator
 * Creates 30-second app preview videos for App Store and Play Store submissions
 * Showcases trauma-informed journaling experience with sage green branding
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Video specifications for app stores
const VIDEO_SPECS = {
  ios: {
    'iphone-portrait': { 
      width: 1080, 
      height: 1920, 
      name: 'iPhone Portrait',
      orientation: 'portrait'
    },
    'iphone-landscape': { 
      width: 1920, 
      height: 1080, 
      name: 'iPhone Landscape',
      orientation: 'landscape'
    }
  },
  android: {
    'phone-portrait': { 
      width: 1080, 
      height: 1920, 
      name: 'Android Portrait',
      orientation: 'portrait'
    },
    'tablet-landscape': { 
      width: 1920, 
      height: 1080, 
      name: 'Android Tablet',
      orientation: 'landscape'
    }
  }
};

// Video storyline for trauma-informed experience
const VIDEO_SCRIPT = [
  {
    scene: 'welcome',
    duration: 3000,
    url: '/',
    title: 'Your Digital Sanctuary',
    subtitle: 'Write it raw. Turn it gold.',
    actions: []
  },
  {
    scene: 'safety-first',
    duration: 4000,
    url: '/auth/login',
    title: 'Safe. Private. Just for you.',
    subtitle: 'Your words are protected here.',
    actions: []
  },
  {
    scene: 'gentle-start',
    duration: 5000,
    url: '/onboarding',
    title: 'Start at your own pace',
    subtitle: 'Trauma-informed from the beginning.',
    actions: [
      { type: 'click', selector: '.gentle-start-button', delay: 2000 }
    ]
  },
  {
    scene: 'writing-flow',
    duration: 8000,
    url: '/journal',
    title: 'Express yourself freely',
    subtitle: 'AI that understands trauma without judgment.',
    actions: [
      { 
        type: 'type', 
        selector: 'textarea', 
        text: 'Today was hard, but I made it through...',
        delay: 1000,
        speed: 100
      },
      { type: 'wait', delay: 3000 },
      { type: 'click', selector: '.ai-insight-button', delay: 500 }
    ]
  },
  {
    scene: 'wise-reflection',
    duration: 6000,
    url: '/journal',
    title: 'Wisdom from your words',
    subtitle: 'AI mirrors back your own strength.',
    actions: [
      { type: 'scroll', direction: 'down', amount: 200, delay: 1000 },
      { type: 'highlight', selector: '.ai-insight-card', delay: 2000 }
    ]
  },
  {
    scene: 'growth-tracking',
    duration: 4000,
    url: '/dashboard',
    title: 'Watch yourself grow',
    subtitle: 'Patterns of healing, not productivity.',
    actions: [
      { type: 'hover', selector: '.growth-chart', delay: 1500 }
    ]
  }
];

class DemoVideoGenerator {
  constructor() {
    this.browser = null;
    this.outputDir = path.join(process.cwd(), 'app-store-assets', 'videos');
    this.frameRate = 30;
    this.totalDuration = VIDEO_SCRIPT.reduce((sum, scene) => sum + scene.duration, 0);
  }

  async init() {
    console.log('🎬 Initializing ALCHM Demo Video Generator...');
    
    // Create output directory
    await fs.mkdir(this.outputDir, { recursive: true });
    
    // Launch browser optimized for video capture
    this.browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--enable-gpu',
        '--enable-accelerated-video-decode',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding'
      ]
    });
  }

  async generateDemoVideos() {
    console.log('🎥 Generating demo videos...');
    console.log(`📊 Total video duration: ${this.totalDuration / 1000} seconds`);

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

    // Generate videos for each platform and orientation
    for (const [platform, specs] of Object.entries(VIDEO_SPECS)) {
      console.log(`\n🎭 Generating ${platform.toUpperCase()} videos...`);
      
      for (const [specKey, spec] of Object.entries(specs)) {
        console.log(`  🎨 ${spec.name} (${spec.width}x${spec.height})`);
        await this.captureVideoFrames(baseUrl, spec, platform, specKey);
      }
    }

    console.log('\n✨ All demo videos generated!');
    console.log(`📁 Video frames saved to: ${this.outputDir}`);
  }

  async captureVideoFrames(baseUrl, videoSpec, platform, specKey) {
    const page = await this.browser.newPage();
    const outputPath = path.join(this.outputDir, platform, specKey);
    await fs.mkdir(outputPath, { recursive: true });

    try {
      // Set viewport for video spec
      await page.setViewport({
        width: videoSpec.width,
        height: videoSpec.height,
        deviceScaleFactor: 1
      });

      // Set mobile user agent
      await page.setUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      );

      // Add enhanced sage styling for video
      await page.addStyleTag({
        content: `
          /* Enhanced sage green styling for video */
          :root {
            --sage-primary: #a4b792 !important;
            --sage-secondary: #8fa37c !important;
            --sage-light: #b8c5a6 !important;
            --sage-dark: #7a8869 !important;
            --sanctuary-white: #fefcfb !important;
          }
          
          .sage-sanctuary,
          .sage-enforced,
          [data-sage-enforced] {
            background: linear-gradient(145deg, #a4b792 0%, #8fa37c 100%) !important;
            color: rgba(254, 252, 251, 0.95) !important;
          }
          
          /* Smooth transitions for video */
          * {
            transition: all 0.3s ease !important;
          }
          
          /* Hide scrollbars for cleaner video */
          ::-webkit-scrollbar {
            display: none !important;
          }
          
          /* Video overlay styling */
          .video-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: linear-gradient(135deg, rgba(164, 183, 146, 0.95), rgba(143, 163, 124, 0.95)) !important;
            backdrop-filter: blur(20px) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 10000 !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          .video-overlay.active {
            opacity: 1 !important;
            pointer-events: all !important;
          }
          
          .video-title {
            font-size: ${videoSpec.width > 1000 ? '3rem' : '2rem'} !important;
            font-weight: 700 !important;
            color: rgba(254, 252, 251, 0.95) !important;
            text-align: center !important;
            margin-bottom: 1rem !important;
          }
          
          .video-subtitle {
            font-size: ${videoSpec.width > 1000 ? '1.5rem' : '1.2rem'} !important;
            font-weight: 400 !important;
            color: rgba(254, 252, 251, 0.8) !important;
            text-align: center !important;
          }
        `
      });

      let frameIndex = 0;
      let currentTime = 0;

      // Capture frames for each scene
      for (const scene of VIDEO_SCRIPT) {
        console.log(`    🎬 Capturing scene: ${scene.scene} (${scene.duration}ms)`);
        
        // Navigate to scene URL
        await page.goto(`${baseUrl}${scene.url}`, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });

        // Wait for page to load
        await page.waitForTimeout(1000);

        // Add video overlay with scene title
        await page.evaluate((scene, spec) => {
          // Remove existing overlay
          const existing = document.querySelector('.video-overlay');
          if (existing) existing.remove();

          // Create new overlay
          const overlay = document.createElement('div');
          overlay.className = 'video-overlay active';
          overlay.innerHTML = `
            <h1 class="video-title">${scene.title}</h1>
            <p class="video-subtitle">${scene.subtitle}</p>
          `;
          document.body.appendChild(overlay);
          
          // Auto-hide after showing title
          setTimeout(() => {
            overlay.classList.remove('active');
          }, Math.min(scene.duration * 0.3, 2000));
        }, scene, videoSpec);

        // Capture frames for this scene
        const sceneDuration = scene.duration;
        const framesInScene = Math.ceil((sceneDuration / 1000) * this.frameRate);
        
        for (let i = 0; i < framesInScene; i++) {
          const frameTime = (i / framesInScene) * sceneDuration;
          
          // Execute actions at appropriate times
          if (scene.actions) {
            for (const action of scene.actions) {
              if (action.delay && frameTime >= action.delay) {
                await this.executeVideoAction(page, action);
              }
            }
          }

          // Capture frame
          const frameFilename = `frame_${String(frameIndex).padStart(4, '0')}.png`;
          const framePath = path.join(outputPath, frameFilename);
          
          await page.screenshot({
            path: framePath,
            fullPage: false,
            clip: {
              x: 0,
              y: 0,
              width: videoSpec.width,
              height: videoSpec.height
            }
          });

          frameIndex++;
          
          // Small delay between frames for smooth animation
          await page.waitForTimeout(1000 / this.frameRate);
        }

        currentTime += sceneDuration;
      }

      // Generate video metadata
      await this.generateVideoMetadata(outputPath, videoSpec, frameIndex);
      
      console.log(`    ✅ Captured ${frameIndex} frames for ${specKey}`);

    } catch (error) {
      console.error(`    ❌ Failed to capture video ${specKey}: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async executeVideoAction(page, action) {
    try {
      switch (action.type) {
        case 'type':
          if (await page.$(action.selector)) {
            await page.type(action.selector, action.text, { 
              delay: action.speed || 100 
            });
          }
          break;
          
        case 'click':
          if (await page.$(action.selector)) {
            await page.click(action.selector);
          }
          break;
          
        case 'scroll':
          await page.evaluate((direction, amount) => {
            const scrollAmount = direction === 'down' ? amount : -amount;
            window.scrollBy(0, scrollAmount);
          }, action.direction, action.amount);
          break;
          
        case 'hover':
          if (await page.$(action.selector)) {
            await page.hover(action.selector);
          }
          break;
          
        case 'highlight':
          await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
              element.style.boxShadow = '0 0 20px rgba(164, 183, 146, 0.8)';
              element.style.transform = 'scale(1.02)';
            }
          }, action.selector);
          break;
          
        case 'wait':
          await page.waitForTimeout(action.delay);
          break;
      }
    } catch (error) {
      console.warn(`      ⚠️ Action failed: ${action.type} - ${error.message}`);
    }
  }

  async generateVideoMetadata(outputPath, videoSpec, frameCount) {
    const metadata = {
      title: 'ALCHM - Trauma-Informed AI Journaling',
      description: 'Transform your thoughts into wisdom with AI that understands trauma without judgment. Write it raw. Turn it gold.',
      platform: videoSpec.name,
      dimensions: `${videoSpec.width}x${videoSpec.height}`,
      frameRate: this.frameRate,
      totalFrames: frameCount,
      duration: `${this.totalDuration / 1000} seconds`,
      scenes: VIDEO_SCRIPT.map(scene => ({
        name: scene.scene,
        title: scene.title,
        duration: `${scene.duration}ms`
      })),
      ffmpegCommand: {
        basic: `ffmpeg -r ${this.frameRate} -i frame_%04d.png -c:v libx264 -r ${this.frameRate} -pix_fmt yuv420p alchm_demo_${videoSpec.width}x${videoSpec.height}.mp4`,
        high_quality: `ffmpeg -r ${this.frameRate} -i frame_%04d.png -c:v libx264 -crf 18 -preset slow -r ${this.frameRate} -pix_fmt yuv420p alchm_demo_${videoSpec.width}x${videoSpec.height}_hq.mp4`,
        web_optimized: `ffmpeg -r ${this.frameRate} -i frame_%04d.png -c:v libx264 -crf 23 -preset medium -r ${this.frameRate} -pix_fmt yuv420p -movflags +faststart alchm_demo_${videoSpec.width}x${videoSpec.height}_web.mp4`
      }
    };

    await fs.writeFile(
      path.join(outputPath, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
  }

  async generateConversionScript() {
    const scriptPath = path.join(this.outputDir, 'convert-to-video.sh');
    const script = `#!/bin/bash

# ALCHM Demo Video Converter
# Converts captured frames to MP4 videos using FFmpeg

echo "🎬 Converting ALCHM demo video frames to MP4..."

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg not found. Please install FFmpeg:"
    echo "   macOS: brew install ffmpeg"
    echo "   Ubuntu: sudo apt install ffmpeg"
    exit 1
fi

# Convert all video directories
for platform_dir in */; do
    echo "🎭 Processing platform: $platform_dir"
    
    cd "$platform_dir"
    for video_dir in */; do
        echo "  🎨 Converting: $video_dir"
        cd "$video_dir"
        
        if [ -f "metadata.json" ]; then
            # Extract dimensions from metadata
            width=$(grep -o '"width": [0-9]*' metadata.json | cut -d' ' -f2)
            height=$(grep -o '"height": [0-9]*' metadata.json | cut -d' ' -f2)
            
            # Create high-quality version
            ffmpeg -y -r 30 -i frame_%04d.png \\
                   -c:v libx264 -crf 18 -preset slow \\
                   -r 30 -pix_fmt yuv420p \\
                   -vf "scale=${width}:${height}" \\
                   "alchm_demo_${width}x${height}_hq.mp4"
            
            # Create web-optimized version
            ffmpeg -y -r 30 -i frame_%04d.png \\
                   -c:v libx264 -crf 23 -preset medium \\
                   -r 30 -pix_fmt yuv420p \\
                   -movflags +faststart \\
                   -vf "scale=${width}:${height}" \\
                   "alchm_demo_${width}x${height}_web.mp4"
            
            echo "    ✅ Created: alchm_demo_${width}x${height}_hq.mp4"
            echo "    ✅ Created: alchm_demo_${width}x${height}_web.mp4"
        fi
        
        cd ..
    done
    cd ..
done

echo "🎉 Video conversion complete!"
echo "📁 Videos saved in platform subdirectories"
`;

    await fs.writeFile(scriptPath, script);
    await fs.chmod(scriptPath, 0o755);
    
    console.log(`📝 Generated conversion script: ${scriptPath}`);
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const generator = new DemoVideoGenerator();
  
  try {
    await generator.init();
    await generator.generateDemoVideos();
    await generator.generateConversionScript();
    console.log('\n🎉 Demo video generation complete!');
    console.log('\nNext steps:');
    console.log('1. cd app-store-assets/videos');
    console.log('2. ./convert-to-video.sh');
    console.log('3. Upload videos to App Store Connect & Play Console');
  } catch (error) {
    console.error('💥 Video generation failed:', error);
    process.exit(1);
  } finally {
    await generator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { DemoVideoGenerator };