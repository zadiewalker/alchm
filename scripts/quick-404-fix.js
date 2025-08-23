#!/usr/bin/env node

/**
 * 🚨 QUICK 404 FIX - Emergency Diagnostic
 * Rapid-fire 404 error detection and resolution for Firebase Studio
 */

const fs = require('fs');
const path = require('path');

class Quick404Fix {
  constructor() {
    this.projectRoot = process.cwd();
    this.fixesApplied = [];
    
    console.log('🚨 QUICK 404 FIX - Emergency Mode');
    console.log('=' .repeat(50));
  }

  async runQuickFix() {
    console.log('🔍 Scanning for immediate 404 causes...\n');

    // 1. Check and fix missing not-found.tsx
    await this.checkNotFoundPage();
    
    // 2. Check and fix firebase.json issues
    await this.checkFirebaseConfig();
    
    // 3. Check and fix next.config.js issues
    await this.checkNextConfig();
    
    // 4. Check and fix missing apphosting.yaml
    await this.checkAppHostingYaml();
    
    // 5. Check build output
    await this.checkBuildOutput();

    // Summary
    console.log('\n🎯 QUICK FIX SUMMARY');
    console.log('=' .repeat(30));
    
    if (this.fixesApplied.length === 0) {
      console.log('✅ No immediate 404 issues detected!');
      console.log('🚀 Your app should be ready for Firebase Studio');
    } else {
      console.log('🔧 Applied fixes:');
      this.fixesApplied.forEach((fix, i) => {
        console.log(`   ${i + 1}. ${fix}`);
      });
      console.log('\n✅ Quick fixes completed!');
      console.log('🔄 Run "npm run build" to test changes');
    }
  }

  async checkNotFoundPage() {
    const notFoundPath = path.join(this.projectRoot, 'src/app/not-found.tsx');
    
    if (!fs.existsSync(notFoundPath)) {
      console.log('❌ CRITICAL: not-found.tsx missing');
      await this.createNotFoundPage();
      this.fixesApplied.push('Created not-found.tsx page');
    } else {
      console.log('✅ not-found.tsx exists');
    }
  }

  async checkFirebaseConfig() {
    const configPath = path.join(this.projectRoot, 'firebase.json');
    
    if (!fs.existsSync(configPath)) {
      console.log('❌ CRITICAL: firebase.json missing');
      await this.createFirebaseConfig();
      this.fixesApplied.push('Created firebase.json configuration');
      return;
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      let needsUpdate = false;
      
      // Check hosting config
      if (!config.hosting) {
        config.hosting = {};
        needsUpdate = true;
      }
      
      // Check public directory
      if (config.hosting.public !== 'out') {
        config.hosting.public = 'out';
        needsUpdate = true;
        console.log('🔧 Fixed: public directory set to "out"');
      }
      
      // Check for catch-all rewrite
      if (!config.hosting.rewrites || !config.hosting.rewrites.some(r => r.source === '**')) {
        if (!config.hosting.rewrites) config.hosting.rewrites = [];
        config.hosting.rewrites.push({
          "source": "**",
          "destination": "/index.html"
        });
        needsUpdate = true;
        console.log('🔧 Fixed: added catch-all rewrite rule');
      }
      
      // Check clean URLs and trailing slash
      if (config.hosting.cleanUrls !== true) {
        config.hosting.cleanUrls = true;
        needsUpdate = true;
      }
      
      if (config.hosting.trailingSlash !== false) {
        config.hosting.trailingSlash = false;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        this.fixesApplied.push('Updated firebase.json configuration');
      } else {
        console.log('✅ firebase.json configuration looks good');
      }
      
    } catch (error) {
      console.log('❌ ERROR: Invalid firebase.json');
      await this.createFirebaseConfig();
      this.fixesApplied.push('Recreated firebase.json configuration');
    }
  }

  async checkNextConfig() {
    const configPath = path.join(this.projectRoot, 'next.config.js');
    
    if (!fs.existsSync(configPath)) {
      console.log('❌ CRITICAL: next.config.js missing');
      await this.createNextConfig();
      this.fixesApplied.push('Created next.config.js');
      return;
    }

    try {
      const content = fs.readFileSync(configPath, 'utf8');
      
      // Check for critical Firebase Studio settings
      const fixes = [];
      
      if (!/output:\s*['""]standalone['""]/.test(content)) {
        fixes.push('Missing standalone output mode');
      }
      
      if (!/trailingSlash:\s*false/.test(content)) {
        fixes.push('Missing trailingSlash: false');
      }
      
      if (!/images:\s*{[^}]*unoptimized:\s*true/.test(content)) {
        fixes.push('Missing unoptimized images setting');
      }
      
      if (fixes.length > 0) {
        console.log('❌ next.config.js needs updates:');
        fixes.forEach(fix => console.log(`   - ${fix}`));
        await this.createNextConfig();
        this.fixesApplied.push('Updated next.config.js for Firebase Studio');
      } else {
        console.log('✅ next.config.js configuration looks good');
      }
      
    } catch (error) {
      console.log('❌ ERROR: Invalid next.config.js');
      await this.createNextConfig();
      this.fixesApplied.push('Recreated next.config.js');
    }
  }

  async checkAppHostingYaml() {
    const yamlPath = path.join(this.projectRoot, 'apphosting.yaml');
    
    if (!fs.existsSync(yamlPath)) {
      console.log('❌ WARNING: apphosting.yaml missing (required for App Hosting)');
      await this.createAppHostingYaml();
      this.fixesApplied.push('Created apphosting.yaml');
    } else {
      console.log('✅ apphosting.yaml exists');
    }
  }

  async checkBuildOutput() {
    const outDir = path.join(this.projectRoot, 'out');
    const nextDir = path.join(this.projectRoot, '.next');
    
    if (!fs.existsSync(outDir) && !fs.existsSync(nextDir)) {
      console.log('⚠️  No build output detected');
      console.log('   Run "npm run build" to generate build artifacts');
    } else {
      console.log('✅ Build artifacts detected');
    }
  }

  // Fix implementations
  async createNotFoundPage() {
    const dir = path.join(this.projectRoot, 'src/app');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const content = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | ALCHM',
  description: 'The page you are looking for could not be found.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}`;

    fs.writeFileSync(path.join(this.projectRoot, 'src/app/not-found.tsx'), content);
    console.log('✅ Created not-found.tsx');
  }

  async createFirebaseConfig() {
    const config = {
      "hosting": {
        "site": "alchm-digital-sanctuary",
        "public": "out",
        "ignore": [
          "firebase.json",
          "**/.*",
          "**/node_modules/**"
        ],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ],
        "cleanUrls": true,
        "trailingSlash": false
      }
    };

    fs.writeFileSync(
      path.join(this.projectRoot, 'firebase.json'), 
      JSON.stringify(config, null, 2)
    );
    console.log('✅ Created firebase.json');
  }

  async createNextConfig() {
    const config = `/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  distDir: 'out',
  experimental: {
    outputFileTracingIncludes: {
      '*': ['./public/**/*'],
    },
  },
  serverExternalPackages: ['firebase-admin'],
};

module.exports = nextConfig;`;

    fs.writeFileSync(path.join(this.projectRoot, 'next.config.js'), config);
    console.log('✅ Created next.config.js');
  }

  async createAppHostingYaml() {
    const yaml = `# Firebase App Hosting Configuration
runConfig:
  runtime: nodejs20
  env:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: "1"

buildConfig:
  commands:
    - npm ci
    - npm run build
  outputDir: out
`;

    fs.writeFileSync(path.join(this.projectRoot, 'apphosting.yaml'), yaml);
    console.log('✅ Created apphosting.yaml');
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new Quick404Fix();
  fixer.runQuickFix().catch(console.error);
}

module.exports = Quick404Fix;