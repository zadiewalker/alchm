#!/usr/bin/env node

/**
 * FIREBASE HOMEPAGE 404 DIAGNOSTIC AUDIT
 * 
 * Award-winning debugging module for Firebase-hosted Next.js 15 apps
 * Specifically targets homepage (/) route visibility issues
 * 
 * Author: Firebase Studio & Next.js App Router Specialist
 * Focus: Surgical diagnosis and resolution of homepage 404 errors
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FirebaseHomepageDiagnostic {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.findings = [];
    this.errors = [];
    this.fixes = [];
    this.firebaseConfig = null;
    this.nextConfig = null;
    this.packageJson = null;
    
    console.log('🔍 Firebase Homepage 404 Diagnostic Audit');
    console.log('==================================================');
    console.log(`📁 Project Path: ${this.projectPath}`);
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      fix: '🔧'
    }[type];
    
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    this.findings.push({ timestamp, type, message });
  }

  async runDiagnostic() {
    try {
      this.log('Starting comprehensive homepage diagnostic...', 'info');
      
      // Phase 1: Environment & Config Verification
      await this.verifyEnvironment();
      
      // Phase 2: Firebase Deployment Configuration
      await this.auditFirebaseConfig();
      
      // Phase 3: Next.js App Router Structure
      await this.auditNextjsRouting();
      
      // Phase 4: Build Artifacts Inspection
      await this.inspectBuildArtifacts();
      
      // Phase 5: Live Testing Simulation
      await this.performLiveTesting();
      
      // Phase 6: Generate Resolution Report
      await this.generateResolutionReport();
      
    } catch (error) {
      this.log(`Critical diagnostic failure: ${error.message}`, 'error');
      this.errors.push(error);
    }
  }

  async verifyEnvironment() {
    this.log('Phase 1: Environment & Configuration Verification', 'info');
    
    // Check package.json
    const packagePath = path.join(this.projectPath, 'package.json');
    if (!fs.existsSync(packagePath)) {
      this.log('package.json not found - invalid project structure', 'error');
      return;
    }
    
    this.packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    this.log(`Detected project: ${this.packageJson.name}`, 'success');
    
    // Verify Next.js version
    const nextVersion = this.packageJson.dependencies?.next || this.packageJson.devDependencies?.next;
    if (!nextVersion) {
      this.log('Next.js not found in dependencies', 'error');
    } else {
      this.log(`Next.js version: ${nextVersion}`, 'success');
      
      // Check if it's Next.js 15+
      const version = nextVersion.replace(/[^0-9.]/g, '');
      if (parseInt(version.split('.')[0]) >= 15) {
        this.log('Next.js 15+ detected - App Router expected', 'info');
      }
    }
    
    // Check Firebase CLI
    try {
      const firebaseVersion = execSync('firebase --version', { encoding: 'utf8' }).trim();
      this.log(`Firebase CLI: ${firebaseVersion}`, 'success');
    } catch (error) {
      this.log('Firebase CLI not installed or not in PATH', 'warning');
    }
  }

  async auditFirebaseConfig() {
    this.log('Phase 2: Firebase Deployment Configuration Audit', 'info');
    
    const firebaseJsonPath = path.join(this.projectPath, 'firebase.json');
    
    if (!fs.existsSync(firebaseJsonPath)) {
      this.log('firebase.json not found', 'error');
      this.generateFirebaseConfig();
      return;
    }
    
    this.firebaseConfig = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
    this.log('firebase.json found and parsed', 'success');
    
    // Audit hosting configuration
    if (!this.firebaseConfig.hosting) {
      this.log('No hosting configuration in firebase.json', 'error');
      this.fixes.push('Add hosting configuration to firebase.json');
      return;
    }
    
    const hosting = Array.isArray(this.firebaseConfig.hosting) 
      ? this.firebaseConfig.hosting[0] 
      : this.firebaseConfig.hosting;
    
    // Check public directory
    const publicDir = hosting.public || 'public';
    this.log(`Public directory: ${publicDir}`, 'info');
    
    if (!fs.existsSync(path.join(this.projectPath, publicDir))) {
      this.log(`Public directory '${publicDir}' does not exist`, 'error');
      this.fixes.push(`Create ${publicDir} directory or update firebase.json`);
    }
    
    // Critical: Check rewrite rules for Next.js App Router
    this.auditRewriteRules(hosting);
    
    // Check ignore patterns
    if (hosting.ignore && hosting.ignore.includes('**')) {
      this.log('Overly broad ignore patterns detected', 'warning');
    }
  }

  auditRewriteRules(hosting) {
    this.log('Auditing rewrite rules for Next.js App Router compatibility...', 'info');
    
    if (!hosting.rewrites) {
      this.log('No rewrite rules found - this will cause 404s for Next.js', 'error');
      this.fixes.push('Add Next.js-compatible rewrite rules');
      return;
    }
    
    const rewrites = hosting.rewrites;
    let hasHomepageRewrite = false;
    let hasNextjsSupport = false;
    
    rewrites.forEach((rule, index) => {
      this.log(`Rewrite rule ${index + 1}: ${rule.source} → ${rule.destination}`, 'info');
      
      // Check for homepage-specific rules
      if (rule.source === '/' && rule.destination === '/index.html') {
        hasHomepageRewrite = true;
        this.log('Direct homepage rewrite rule found', 'success');
      }
      
      // Check for Next.js function routing
      if (rule.source === '**' && rule.function) {
        hasNextjsSupport = true;
        this.log(`Next.js function routing: ${rule.function}`, 'success');
      }
      
      // Check for catch-all static routing
      if (rule.source === '**' && rule.destination === '/index.html') {
        this.log('Catch-all static routing found', 'info');
      }
    });
    
    if (!hasHomepageRewrite && !hasNextjsSupport) {
      this.log('Missing homepage routing configuration', 'error');
      this.fixes.push('Add homepage rewrite rule or Next.js function routing');
    }
  }

  async auditNextjsRouting() {
    this.log('Phase 3: Next.js App Router Structure Analysis', 'info');
    
    // Check for Next.js config
    const nextConfigPath = path.join(this.projectPath, 'next.config.js');
    const nextConfigMjsPath = path.join(this.projectPath, 'next.config.mjs');
    
    let configPath = null;
    if (fs.existsSync(nextConfigPath)) configPath = nextConfigPath;
    else if (fs.existsSync(nextConfigMjsPath)) configPath = nextConfigMjsPath;
    
    if (configPath) {
      this.log(`Next.js config found: ${path.basename(configPath)}`, 'success');
      // Note: We don't execute the config for security, just verify it exists
    }
    
    // Check App Router structure (Next.js 13+)
    const appDirPath = path.join(this.projectPath, 'src', 'app');
    const appRootPath = path.join(this.projectPath, 'app');
    
    let appDirectory = null;
    if (fs.existsSync(appDirPath)) appDirectory = appDirPath;
    else if (fs.existsSync(appRootPath)) appDirectory = appRootPath;
    
    if (appDirectory) {
      this.log(`App Router directory found: ${appDirectory}`, 'success');
      this.auditAppRouterHomepage(appDirectory);
    } else {
      // Check Pages Router (legacy)
      const pagesDirPath = path.join(this.projectPath, 'src', 'pages');
      const pagesRootPath = path.join(this.projectPath, 'pages');
      
      let pagesDirectory = null;
      if (fs.existsSync(pagesDirPath)) pagesDirectory = pagesDirPath;
      else if (fs.existsSync(pagesRootPath)) pagesDirectory = pagesRootPath;
      
      if (pagesDirectory) {
        this.log(`Pages Router directory found: ${pagesDirectory}`, 'info');
        this.auditPagesRouterHomepage(pagesDirectory);
      } else {
        this.log('No Next.js routing structure found', 'error');
        this.fixes.push('Create App Router or Pages Router structure');
      }
    }
  }

  auditAppRouterHomepage(appDir) {
    this.log('Auditing App Router homepage configuration...', 'info');
    
    // Check for root layout
    const layoutFiles = ['layout.tsx', 'layout.ts', 'layout.jsx', 'layout.js'];
    const hasLayout = layoutFiles.some(file => 
      fs.existsSync(path.join(appDir, file))
    );
    
    if (!hasLayout) {
      this.log('Root layout not found in app directory', 'error');
      this.fixes.push('Create app/layout.tsx for App Router');
    } else {
      this.log('Root layout found', 'success');
    }
    
    // Check for homepage (page.tsx/jsx)
    const pageFiles = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'];
    const homepageFile = pageFiles.find(file => 
      fs.existsSync(path.join(appDir, file))
    );
    
    if (!homepageFile) {
      this.log('Homepage (page.tsx/jsx) not found in app directory', 'error');
      this.fixes.push('Create app/page.tsx for homepage');
    } else {
      this.log(`Homepage found: app/${homepageFile}`, 'success');
      
      // Verify the homepage file has valid content
      const homepageContent = fs.readFileSync(path.join(appDir, homepageFile), 'utf8');
      if (homepageContent.includes('export default')) {
        this.log('Homepage has default export', 'success');
      } else {
        this.log('Homepage missing default export', 'warning');
        this.fixes.push('Add default export to homepage component');
      }
    }
  }

  auditPagesRouterHomepage(pagesDir) {
    this.log('Auditing Pages Router homepage configuration...', 'info');
    
    const indexFiles = ['index.tsx', 'index.ts', 'index.jsx', 'index.js'];
    const homepageFile = indexFiles.find(file => 
      fs.existsSync(path.join(pagesDir, file))
    );
    
    if (!homepageFile) {
      this.log('Homepage (index.tsx/jsx) not found in pages directory', 'error');
      this.fixes.push('Create pages/index.tsx for homepage');
    } else {
      this.log(`Homepage found: pages/${homepageFile}`, 'success');
    }
  }

  async inspectBuildArtifacts() {
    this.log('Phase 4: Build Artifacts Inspection', 'info');
    
    // Check .next directory
    const nextBuildPath = path.join(this.projectPath, '.next');
    if (!fs.existsSync(nextBuildPath)) {
      this.log('.next build directory not found', 'error');
      this.fixes.push('Run "npm run build" to generate build artifacts');
      return;
    }
    
    this.log('.next build directory found', 'success');
    
    // Check for server directory (SSR/ISR)
    const serverPath = path.join(nextBuildPath, 'server');
    if (fs.existsSync(serverPath)) {
      this.log('Server-side build artifacts detected', 'info');
      
      // Check for homepage in server artifacts
      const serverPagesPath = path.join(serverPath, 'pages');
      const serverAppPath = path.join(serverPath, 'app');
      
      if (fs.existsSync(serverAppPath)) {
        const homepageServerFile = path.join(serverAppPath, 'page.js');
        if (fs.existsSync(homepageServerFile)) {
          this.log('Homepage server component found', 'success');
        } else {
          this.log('Homepage server component missing', 'warning');
        }
      }
    }
    
    // Check static directory
    const staticPath = path.join(nextBuildPath, 'static');
    if (fs.existsSync(staticPath)) {
      this.log('Static assets directory found', 'success');
    }
    
    // Check for export artifacts (if using static export)
    const outPath = path.join(this.projectPath, 'out');
    if (fs.existsSync(outPath)) {
      this.log('Static export directory found', 'info');
      
      const indexHtml = path.join(outPath, 'index.html');
      if (fs.existsSync(indexHtml)) {
        this.log('Exported index.html found', 'success');
      } else {
        this.log('Exported index.html missing', 'error');
        this.fixes.push('Verify static export configuration');
      }
    }
  }

  async performLiveTesting() {
    this.log('Phase 5: Live Testing Simulation', 'info');
    
    try {
      // Test local serve capability
      this.log('Testing local Firebase emulator capability...', 'info');
      
      // Check if we can start Firebase emulator
      const emulatorProcess = this.startFirebaseEmulator();
      
      if (emulatorProcess) {
        // Wait a moment for emulator to start
        await this.sleep(3000);
        
        try {
          const localResponse = await this.testUrl('http://localhost:5000');
          if (localResponse.success) {
            this.log('Local emulator serves homepage successfully', 'success');
          } else {
            this.log(`Local emulator homepage test failed: ${localResponse.error}`, 'error');
            this.fixes.push('Fix local Firebase hosting configuration');
          }
        } catch (error) {
          this.log(`Local testing failed: ${error.message}`, 'warning');
        }
        
        // Clean up emulator
        if (emulatorProcess && !emulatorProcess.killed) {
          emulatorProcess.kill();
        }
      }
      
    } catch (error) {
      this.log(`Live testing error: ${error.message}`, 'warning');
    }
  }

  startFirebaseEmulator() {
    try {
      const emulatorProcess = spawn('firebase', ['emulators:start', '--only', 'hosting'], {
        cwd: this.projectPath,
        stdio: 'pipe',
        detached: false
      });
      
      this.log('Firebase emulator starting...', 'info');
      return emulatorProcess;
      
    } catch (error) {
      this.log('Could not start Firebase emulator', 'warning');
      return null;
    }
  }

  async testUrl(url) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      
      const req = client.get(url, (res) => {
        if (res.statusCode === 200) {
          resolve({ success: true, status: res.statusCode });
        } else {
          resolve({ success: false, status: res.statusCode, error: `HTTP ${res.statusCode}` });
        }
      });
      
      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout' });
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateFirebaseConfig() {
    this.log('Generating recommended firebase.json configuration...', 'fix');
    
    const recommendedConfig = {
      "hosting": {
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
        "headers": [
          {
            "source": "**/*.@(js|jsx|ts|tsx)",
            "headers": [
              {
                "key": "Cache-Control",
                "value": "public, max-age=31536000, immutable"
              }
            ]
          }
        ]
      }
    };
    
    this.fixes.push('Create firebase.json with Next.js-compatible configuration');
    this.log('Recommended firebase.json generated', 'fix');
    
    return recommendedConfig;
  }

  async generateResolutionReport() {
    this.log('Phase 6: Generating Resolution Report', 'info');
    
    console.log('\n📊 DIAGNOSTIC SUMMARY');
    console.log('==================================================');
    
    // Count findings by type
    const summary = this.findings.reduce((acc, finding) => {
      acc[finding.type] = (acc[finding.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(summary).forEach(([type, count]) => {
      const icon = {
        info: '📝',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        fix: '🔧'
      }[type];
      console.log(`${icon} ${type.toUpperCase()}: ${count}`);
    });
    
    if (this.errors.length > 0) {
      console.log('\n❌ CRITICAL ERRORS DETECTED:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.message}`);
      });
    }
    
    if (this.fixes.length > 0) {
      console.log('\n🔧 RECOMMENDED FIXES:');
      this.fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix}`);
      });
      
      console.log('\n📋 RESOLUTION COMMANDS:');
      this.generateResolutionCommands();
    } else {
      console.log('\n✅ No critical issues detected. Homepage should be accessible.');
    }
    
    // Generate updated firebase.json if needed
    if (this.fixes.some(fix => fix.includes('firebase.json'))) {
      console.log('\n📄 RECOMMENDED FIREBASE.JSON:');
      console.log(JSON.stringify(this.generateFirebaseConfig(), null, 2));
    }
    
    console.log('\n🚀 DEPLOYMENT VERIFICATION:');
    console.log('1. npm run build');
    console.log('2. firebase deploy --only hosting');
    console.log('3. Test: curl -I https://your-project.web.app/');
    
    console.log('\n✨ Diagnostic completed successfully!');
  }

  generateResolutionCommands() {
    const commands = [];
    
    if (this.fixes.some(fix => fix.includes('npm run build'))) {
      commands.push('# Build the Next.js application');
      commands.push('npm run build');
      commands.push('');
    }
    
    if (this.fixes.some(fix => fix.includes('app/page.tsx'))) {
      commands.push('# Create homepage component');
      commands.push('mkdir -p src/app');
      commands.push('echo "export default function HomePage() { return <h1>Welcome</h1>; }" > src/app/page.tsx');
      commands.push('echo "export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }" > src/app/layout.tsx');
      commands.push('');
    }
    
    if (this.fixes.some(fix => fix.includes('firebase.json'))) {
      commands.push('# Update Firebase configuration');
      commands.push('# Copy the recommended firebase.json above');
      commands.push('');
    }
    
    commands.push('# Deploy to Firebase');
    commands.push('firebase deploy --only hosting');
    
    commands.forEach(command => console.log(command));
  }
}

// Execute diagnostic if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const diagnostic = new FirebaseHomepageDiagnostic(process.argv[2]);
  diagnostic.runDiagnostic().catch(console.error);
}

export default FirebaseHomepageDiagnostic;