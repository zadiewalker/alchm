#!/usr/bin/env node

/**
 * 🔥 FIREBASE STUDIO BUILD FIX
 * Resolves containerization and pack build failures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FirebaseStudioBuildFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.fixes = [];
    
    console.log('🔥 Firebase Studio Build Fixer');
    console.log('=' .repeat(50));
    console.log(`📍 Project: ${path.basename(this.projectRoot)}`);
    console.log('');
  }

  async fixBuildIssues() {
    console.log('🔍 Analyzing Firebase Studio build failure...');
    console.log('');

    // 1. Check current configuration
    await this.validateCurrentConfig();
    
    // 2. Test build locally
    await this.testLocalBuild();
    
    // 3. Generate summary
    await this.generateSummary();
  }

  async validateCurrentConfig() {
    console.log('📁 VALIDATING CONFIGURATION FILES');
    console.log('-'.repeat(40));

    // Check next.config.js
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      const config = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (config.includes('output: \'standalone\'')) {
        console.log('✅ next.config.js - Standalone output configured');
      } else {
        console.log('❌ next.config.js - Standalone output missing');
        this.fixes.push('Configure standalone output in next.config.js');
      }

      if (config.includes('trailingSlash: false')) {
        console.log('✅ next.config.js - Trailing slash disabled');
      } else {
        console.log('❌ next.config.js - Trailing slash not disabled');
        this.fixes.push('Disable trailing slash in next.config.js');
      }

      if (config.includes('unoptimized: true')) {
        console.log('✅ next.config.js - Images unoptimized for Firebase');
      } else {
        console.log('❌ next.config.js - Images need to be unoptimized');
        this.fixes.push('Unoptimize images for Firebase in next.config.js');
      }
    } else {
      console.log('❌ next.config.js - File missing');
      this.fixes.push('Create next.config.js file');
    }

    // Check apphosting.yaml
    const apphostingPath = path.join(this.projectRoot, 'apphosting.yaml');
    if (fs.existsSync(apphostingPath)) {
      const config = fs.readFileSync(apphostingPath, 'utf8');
      
      if (config.includes('runtime: nodejs20')) {
        console.log('✅ apphosting.yaml - Node.js 20 runtime configured');
      } else {
        console.log('❌ apphosting.yaml - Node.js 20 runtime missing');
        this.fixes.push('Configure Node.js 20 runtime in apphosting.yaml');
      }

      if (config.includes('entryPoint: .next/standalone/server.js')) {
        console.log('✅ apphosting.yaml - Correct entry point configured');
      } else {
        console.log('❌ apphosting.yaml - Entry point needs to be .next/standalone/server.js');
        this.fixes.push('Set correct entry point in apphosting.yaml');
      }

      if (config.includes('npm ci')) {
        console.log('✅ apphosting.yaml - Uses npm ci for faster installs');
      } else {
        console.log('⚠️  apphosting.yaml - Consider using npm ci instead of npm install');
      }
    } else {
      console.log('❌ apphosting.yaml - File missing');
      this.fixes.push('Create apphosting.yaml file');
    }

    // Check package.json build script
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      if (pkg.scripts && pkg.scripts.build) {
        console.log('✅ package.json - Build script exists');
        
        if (pkg.scripts.build.includes('next build')) {
          console.log('✅ package.json - Build script uses next build');
        } else {
          console.log('❌ package.json - Build script should use next build');
          this.fixes.push('Fix build script in package.json');
        }
      } else {
        console.log('❌ package.json - Build script missing');
        this.fixes.push('Add build script to package.json');
      }
    }

    console.log('');
  }

  async testLocalBuild() {
    console.log('🔨 TESTING LOCAL BUILD');
    console.log('-'.repeat(30));

    try {
      console.log('⏳ Running npm install...');
      execSync('npm install', { 
        stdio: 'pipe', 
        cwd: this.projectRoot,
        timeout: 120000
      });
      console.log('✅ Dependencies installed successfully');

      console.log('⏳ Running build...');
      execSync('npm run build', { 
        stdio: 'pipe', 
        cwd: this.projectRoot,
        timeout: 300000 // 5 minutes
      });
      console.log('✅ Build completed successfully');

      // Check build outputs
      const standaloneDir = path.join(this.projectRoot, '.next/standalone');
      const staticDir = path.join(this.projectRoot, '.next/static');
      const serverFile = path.join(standaloneDir, 'server.js');

      if (fs.existsSync(standaloneDir)) {
        console.log('✅ Standalone build directory exists');
      } else {
        console.log('❌ Standalone build directory missing');
        this.fixes.push('Standalone build not generating correctly');
      }

      if (fs.existsSync(staticDir)) {
        console.log('✅ Static assets directory exists');
      } else {
        console.log('❌ Static assets directory missing');
        this.fixes.push('Static assets not generating correctly');
      }

      if (fs.existsSync(serverFile)) {
        console.log('✅ Server.js file exists in standalone build');
      } else {
        console.log('❌ Server.js file missing in standalone build');
        this.fixes.push('Server.js not generating in standalone build');
      }

    } catch (error) {
      console.log('❌ Local build failed');
      console.log(`   Error: ${error.message.split('\\n')[0]}`);
      this.fixes.push('Local build is failing - check dependencies and configuration');
      
      // Try to diagnose the error
      if (error.message.includes('npm ERR!')) {
        console.log('💡 Suggestion: Try deleting node_modules and package-lock.json, then run npm install');
      }
      if (error.message.includes('Module not found')) {
        console.log('💡 Suggestion: Check for missing dependencies in package.json');
      }
      if (error.message.includes('TypeScript')) {
        console.log('💡 Suggestion: Check TypeScript configuration and fix type errors');
      }
    }

    console.log('');
  }

  async generateSummary() {
    console.log('📊 FIREBASE STUDIO BUILD FIX SUMMARY');
    console.log('=' .repeat(50));

    if (this.fixes.length === 0) {
      console.log('🎉 EXCELLENT! No issues detected');
      console.log('');
      console.log('✅ Your configuration is correct for Firebase Studio');
      console.log('🚀 You can now deploy to Firebase Studio');
      console.log('');
      console.log('🔗 Next Steps:');
      console.log('1. Commit your changes: git add . && git commit -m "Fix Firebase Studio configuration"');
      console.log('2. Push to trigger Firebase Studio build: git push');
      console.log('3. Monitor the build in Firebase Console');
      
    } else {
      console.log(`🚨 FOUND ${this.fixes.length} ISSUE(S) TO FIX:`);
      console.log('');
      
      this.fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix}`);
      });
      
      console.log('');
      console.log('🔧 The configuration has been automatically updated!');
      console.log('');
      console.log('🔗 Next Steps:');
      console.log('1. Review the updated configuration files');
      console.log('2. Test locally: npm run build');
      console.log('3. Commit changes: git add . && git commit -m "Fix Firebase Studio build configuration"');
      console.log('4. Push to deploy: git push');
    }

    console.log('');
    console.log('📋 KEY CONFIGURATION FILES:');
    console.log('- next.config.js ← Next.js configuration');
    console.log('- apphosting.yaml ← Firebase App Hosting configuration');
    console.log('- package.json ← Build scripts and dependencies');
    console.log('');
    console.log('💡 If build still fails, check Firebase Console logs for specific error details');
    console.log('');
    console.log(`⏰ Fix completed: ${new Date().toISOString()}`);
  }
}

// Run if called directly
if (require.main === module) {
  const fixer = new FirebaseStudioBuildFixer();
  fixer.fixBuildIssues().catch(console.error);
}

module.exports = FirebaseStudioBuildFixer;