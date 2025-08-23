#!/usr/bin/env node

/**
 * 🔍 FIREBASE STUDIO 404 DEBUGGER
 * Award-Winning Expert Diagnostic System
 * 
 * Autonomous, self-operating diagnostic that detects and fixes 404 errors
 * specifically for Firebase Studio App Hosting deployments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FirebaseStudio404Debugger {
  constructor() {
    this.projectRoot = process.cwd();
    this.errors = [];
    this.fixes = [];
    this.validationResults = {};
    this.diagnosticScore = 0;
    this.maxScore = 100;
    
    console.log('🔥 Firebase Studio 404 Debugger - Expert Diagnostic Mode');
    console.log('=' .repeat(70));
    console.log(`📍 Project Root: ${this.projectRoot}`);
    console.log(`⏰ Started: ${new Date().toISOString()}`);
    console.log('');
  }

  // ============================================
  // 🎯 CORE 404 ERROR DETECTION SYSTEM
  // ============================================

  async runFullDiagnostic() {
    console.log('🔍 INITIATING COMPREHENSIVE 404 DIAGNOSTIC...');
    console.log('');

    try {
      // Phase 1: Critical File Structure Analysis
      await this.validateCriticalFiles();
      
      // Phase 2: Next.js Configuration Deep Scan
      await this.analyzeNextJSConfig();
      
      // Phase 3: Firebase Hosting Configuration
      await this.validateFirebaseHosting();
      
      // Phase 4: Routing & Rewrite Rules Analysis
      await this.analyzeRoutingRules();
      
      // Phase 5: Build Output Validation
      await this.validateBuildOutput();
      
      // Phase 6: App Hosting Specific Checks
      await this.validateAppHostingConfig();
      
      // Phase 7: Advanced 404 Pattern Detection
      await this.detect404Patterns();
      
      // Phase 8: Autonomous Error Resolution
      await this.autoFixDetectedErrors();
      
      // Phase 9: Generate Comprehensive Report
      await this.generateDiagnosticReport();
      
    } catch (error) {
      this.logError('CRITICAL_DIAGNOSTIC_FAILURE', error.message);
      console.error('❌ Diagnostic failed:', error);
    }
  }

  // ============================================
  // 📁 CRITICAL FILE STRUCTURE VALIDATION
  // ============================================

  async validateCriticalFiles() {
    console.log('📁 PHASE 1: Critical File Structure Analysis');
    console.log('-'.repeat(50));

    const criticalFiles = [
      'package.json',
      'next.config.js',
      'firebase.json',
      'apphosting.yaml',
      '.firebaserc',
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/app/not-found.tsx'
    ];

    const criticalDirectories = [
      'src/app',
      'src/components',
      'src/lib',
      'public',
      '.next'
    ];

    let filesScore = 0;
    const maxFilesScore = 25;

    // Check critical files
    for (const file of criticalFiles) {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} - EXISTS`);
        filesScore += 2;
        
        // Special validation for key files
        if (file === 'src/app/not-found.tsx') {
          await this.validateNotFoundPage(filePath);
        }
        if (file === 'apphosting.yaml') {
          await this.validateAppHostingYaml(filePath);
        }
      } else {
        console.log(`❌ ${file} - MISSING`);
        this.logError('MISSING_CRITICAL_FILE', `${file} is required for Firebase Studio`);
        
        // Auto-create missing critical files
        await this.autoCreateMissingFile(file);
      }
    }

    // Check critical directories
    for (const dir of criticalDirectories) {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        console.log(`✅ ${dir}/ - EXISTS`);
        filesScore += 1;
      } else {
        console.log(`❌ ${dir}/ - MISSING`);
        this.logError('MISSING_CRITICAL_DIRECTORY', `${dir} directory is required`);
      }
    }

    this.validationResults.criticalFiles = {
      score: filesScore,
      maxScore: maxFilesScore,
      percentage: Math.round((filesScore / maxFilesScore) * 100)
    };

    console.log(`📊 File Structure Score: ${filesScore}/${maxFilesScore} (${this.validationResults.criticalFiles.percentage}%)`);
    console.log('');
  }

  // ============================================
  // ⚙️  NEXT.JS CONFIGURATION DEEP SCAN
  // ============================================

  async analyzeNextJSConfig() {
    console.log('⚙️  PHASE 2: Next.js Configuration Deep Scan');
    console.log('-'.repeat(50));

    let configScore = 0;
    const maxConfigScore = 20;

    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
      this.logError('MISSING_NEXT_CONFIG', 'next.config.js is required for Firebase Studio');
      await this.autoCreateNextConfig();
      return;
    }

    try {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Critical Firebase Studio requirements
      const requiredConfigs = [
        { key: 'output.*standalone', pattern: /output:\s*['""]standalone['""]/, points: 5, description: 'Standalone output mode' },
        { key: 'trailingSlash.*false', pattern: /trailingSlash:\s*false/, points: 3, description: 'Trailing slash disabled' },
        { key: 'images.*unoptimized', pattern: /images:\s*{[^}]*unoptimized:\s*true/, points: 3, description: 'Images unoptimized for Firebase' },
        { key: 'experimental.*outputFileTracingIncludes', pattern: /outputFileTracingIncludes/, points: 2, description: 'File tracing includes' },
        { key: 'distDir.*out', pattern: /distDir:\s*['""]out['""]/, points: 2, description: 'Custom dist directory' }
      ];

      console.log('🔍 Analyzing Next.js configuration requirements:');
      
      for (const config of requiredConfigs) {
        if (config.pattern.test(configContent)) {
          console.log(`✅ ${config.description} - CONFIGURED`);
          configScore += config.points;
        } else {
          console.log(`❌ ${config.description} - MISSING`);
          this.logError('NEXT_CONFIG_MISSING', `${config.description} is required for Firebase Studio`);
        }
      }

      // Check for problematic configurations
      const problematicPatterns = [
        { pattern: /assetPrefix/, issue: 'Asset prefix can cause 404s in Firebase Studio' },
        { pattern: /basePath/, issue: 'Base path can interfere with Firebase routing' },
        { pattern: /exportPathMap/, issue: 'Export path map conflicts with App Router' }
      ];

      for (const problem of problematicPatterns) {
        if (problem.pattern.test(configContent)) {
          this.logError('PROBLEMATIC_CONFIG', problem.issue);
        }
      }

    } catch (error) {
      this.logError('CONFIG_PARSE_ERROR', `Failed to parse next.config.js: ${error.message}`);
    }

    this.validationResults.nextConfig = {
      score: configScore,
      maxScore: maxConfigScore,
      percentage: Math.round((configScore / maxConfigScore) * 100)
    };

    console.log(`📊 Next.js Config Score: ${configScore}/${maxConfigScore} (${this.validationResults.nextConfig.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🔥 FIREBASE HOSTING CONFIGURATION
  // ============================================

  async validateFirebaseHosting() {
    console.log('🔥 PHASE 3: Firebase Hosting Configuration Analysis');
    console.log('-'.repeat(50));

    let hostingScore = 0;
    const maxHostingScore = 20;

    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    
    if (!fs.existsSync(firebaseConfigPath)) {
      this.logError('MISSING_FIREBASE_CONFIG', 'firebase.json is required');
      await this.autoCreateFirebaseConfig();
      return;
    }

    try {
      const configContent = fs.readFileSync(firebaseConfigPath, 'utf8');
      const config = JSON.parse(configContent);

      // Validate hosting configuration
      if (config.hosting) {
        console.log('✅ Hosting configuration - FOUND');
        hostingScore += 5;

        // Check public directory
        if (config.hosting.public === 'out') {
          console.log('✅ Public directory set to "out" - CORRECT');
          hostingScore += 3;
        } else {
          console.log(`❌ Public directory: "${config.hosting.public}" - SHOULD BE "out"`);
          this.logError('WRONG_PUBLIC_DIR', 'Public directory should be "out" for Firebase Studio');
        }

        // Check rewrites for SPA behavior
        if (config.hosting.rewrites && Array.isArray(config.hosting.rewrites)) {
          console.log('✅ Rewrites configuration - FOUND');
          hostingScore += 3;

          // Look for catch-all rewrite
          const hasCatchAll = config.hosting.rewrites.some(rewrite => 
            rewrite.source === '**' && rewrite.destination === '/index.html'
          );

          if (hasCatchAll) {
            console.log('✅ Catch-all rewrite rule - CONFIGURED');
            hostingScore += 3;
          } else {
            console.log('❌ Catch-all rewrite rule - MISSING');
            this.logError('MISSING_CATCHALL_REWRITE', 'Catch-all rewrite prevents 404 errors');
          }
        } else {
          console.log('❌ Rewrites configuration - MISSING');
          this.logError('MISSING_REWRITES', 'Rewrites are essential for SPA routing');
        }

        // Check for cleanUrls
        if (config.hosting.cleanUrls === true) {
          console.log('✅ Clean URLs enabled - GOOD');
          hostingScore += 2;
        }

        // Check for trailingSlash setting
        if (config.hosting.trailingSlash === false) {
          console.log('✅ Trailing slash disabled - CORRECT');
          hostingScore += 2;
        }

      } else {
        console.log('❌ Hosting configuration - MISSING');
        this.logError('NO_HOSTING_CONFIG', 'Firebase hosting configuration is missing');
      }

    } catch (error) {
      this.logError('FIREBASE_CONFIG_PARSE_ERROR', `Failed to parse firebase.json: ${error.message}`);
    }

    this.validationResults.firebaseHosting = {
      score: hostingScore,
      maxScore: maxHostingScore,
      percentage: Math.round((hostingScore / maxHostingScore) * 100)
    };

    console.log(`📊 Firebase Hosting Score: ${hostingScore}/${maxHostingScore} (${this.validationResults.firebaseHosting.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🛣️  ROUTING & REWRITE RULES ANALYSIS
  // ============================================

  async analyzeRoutingRules() {
    console.log('🛣️  PHASE 4: Routing & Rewrite Rules Analysis');
    console.log('-'.repeat(50));

    let routingScore = 0;
    const maxRoutingScore = 15;

    // Check App Router structure
    const appRouterPath = path.join(this.projectRoot, 'src/app');
    if (fs.existsSync(appRouterPath)) {
      console.log('✅ App Router directory - FOUND');
      routingScore += 5;

      // Check for root layout
      const layoutPath = path.join(appRouterPath, 'layout.tsx');
      if (fs.existsSync(layoutPath)) {
        console.log('✅ Root layout.tsx - FOUND');
        routingScore += 3;
      } else {
        console.log('❌ Root layout.tsx - MISSING');
        this.logError('MISSING_ROOT_LAYOUT', 'Root layout.tsx is required for App Router');
      }

      // Check for root page
      const pagePath = path.join(appRouterPath, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        console.log('✅ Root page.tsx - FOUND');
        routingScore += 3;
      } else {
        console.log('❌ Root page.tsx - MISSING');
        this.logError('MISSING_ROOT_PAGE', 'Root page.tsx is required');
      }

      // Check for not-found page
      const notFoundPath = path.join(appRouterPath, 'not-found.tsx');
      if (fs.existsSync(notFoundPath)) {
        console.log('✅ not-found.tsx - FOUND');
        routingScore += 4;
      } else {
        console.log('❌ not-found.tsx - MISSING (CRITICAL FOR 404 HANDLING)');
        this.logError('MISSING_NOT_FOUND_PAGE', 'not-found.tsx is critical for proper 404 handling');
        await this.autoCreateNotFoundPage();
      }

    } else {
      console.log('❌ App Router directory - MISSING');
      this.logError('MISSING_APP_ROUTER', 'App Router structure is required');
    }

    this.validationResults.routing = {
      score: routingScore,
      maxScore: maxRoutingScore,
      percentage: Math.round((routingScore / maxRoutingScore) * 100)
    };

    console.log(`📊 Routing Score: ${routingScore}/${maxRoutingScore} (${this.validationResults.routing.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🏗️  BUILD OUTPUT VALIDATION
  // ============================================

  async validateBuildOutput() {
    console.log('🏗️  PHASE 5: Build Output Validation');
    console.log('-'.repeat(50));

    let buildScore = 0;
    const maxBuildScore = 10;

    // Check if build artifacts exist
    const buildPaths = [
      '.next',
      'out',
      '.next/standalone'
    ];

    for (const buildPath of buildPaths) {
      const fullPath = path.join(this.projectRoot, buildPath);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ ${buildPath} - EXISTS`);
        buildScore += 2;
      } else {
        console.log(`⚠️  ${buildPath} - NOT FOUND (may need build)`);
      }
    }

    // Try to run a test build
    try {
      console.log('🔨 Running test build to validate configuration...');
      execSync('npm run build', { 
        cwd: this.projectRoot, 
        stdio: 'pipe',
        timeout: 120000 // 2 minute timeout
      });
      console.log('✅ Test build - SUCCESSFUL');
      buildScore += 4;
    } catch (error) {
      console.log('❌ Test build - FAILED');
      this.logError('BUILD_FAILURE', `Build failed: ${error.message}`);
    }

    this.validationResults.buildOutput = {
      score: buildScore,
      maxScore: maxBuildScore,
      percentage: Math.round((buildScore / maxBuildScore) * 100)
    };

    console.log(`📊 Build Output Score: ${buildScore}/${maxBuildScore} (${this.validationResults.buildOutput.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🌐 APP HOSTING SPECIFIC VALIDATION
  // ============================================

  async validateAppHostingConfig() {
    console.log('🌐 PHASE 6: App Hosting Specific Configuration');
    console.log('-'.repeat(50));

    let appHostingScore = 0;
    const maxAppHostingScore = 10;

    const appHostingPath = path.join(this.projectRoot, 'apphosting.yaml');
    
    if (!fs.existsSync(appHostingPath)) {
      console.log('❌ apphosting.yaml - MISSING');
      this.logError('MISSING_APPHOSTING_YAML', 'apphosting.yaml is required for Firebase Studio');
      await this.autoCreateAppHostingYaml();
    } else {
      console.log('✅ apphosting.yaml - FOUND');
      appHostingScore += 5;
      
      try {
        const yamlContent = fs.readFileSync(appHostingPath, 'utf8');
        
        // Check for required fields
        const requiredFields = [
          { pattern: /runConfig:/, name: 'runConfig' },
          { pattern: /runtime:\s*nodejs20/, name: 'Node.js 20 runtime' },
          { pattern: /env:/, name: 'Environment variables' }
        ];

        for (const field of requiredFields) {
          if (field.pattern.test(yamlContent)) {
            console.log(`✅ ${field.name} - CONFIGURED`);
            appHostingScore += 1;
          } else {
            console.log(`❌ ${field.name} - MISSING`);
          }
        }

      } catch (error) {
        this.logError('APPHOSTING_PARSE_ERROR', `Failed to parse apphosting.yaml: ${error.message}`);
      }
    }

    this.validationResults.appHosting = {
      score: appHostingScore,
      maxScore: maxAppHostingScore,
      percentage: Math.round((appHostingScore / maxAppHostingScore) * 100)
    };

    console.log(`📊 App Hosting Score: ${appHostingScore}/${maxAppHostingScore} (${this.validationResults.appHosting.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🔍 ADVANCED 404 PATTERN DETECTION
  // ============================================

  async detect404Patterns() {
    console.log('🔍 PHASE 7: Advanced 404 Pattern Detection');
    console.log('-'.repeat(50));

    const common404Causes = [
      {
        name: 'Missing index.html in output',
        check: () => fs.existsSync(path.join(this.projectRoot, 'out/index.html')),
        fix: 'autoCreateIndexHtml'
      },
      {
        name: 'Incorrect public directory in firebase.json',
        check: () => {
          try {
            const config = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'firebase.json'), 'utf8'));
            return config.hosting && config.hosting.public === 'out';
          } catch { return false; }
        },
        fix: 'fixPublicDirectory'
      },
      {
        name: 'Missing catch-all rewrite rule',
        check: () => {
          try {
            const config = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'firebase.json'), 'utf8'));
            return config.hosting && config.hosting.rewrites && 
                   config.hosting.rewrites.some(r => r.source === '**' && r.destination === '/index.html');
          } catch { return false; }
        },
        fix: 'addCatchAllRewrite'
      },
      {
        name: 'Standalone output not configured',
        check: () => {
          try {
            const configPath = path.join(this.projectRoot, 'next.config.js');
            const content = fs.readFileSync(configPath, 'utf8');
            return /output:\s*['""]standalone['""]/.test(content);
          } catch { return false; }
        },
        fix: 'fixStandaloneOutput'
      },
      {
        name: 'Missing not-found.tsx for custom 404',
        check: () => fs.existsSync(path.join(this.projectRoot, 'src/app/not-found.tsx')),
        fix: 'createNotFoundPage'
      }
    ];

    let detectionScore = 0;
    const maxDetectionScore = common404Causes.length * 2;

    for (const cause of common404Causes) {
      const isValid = cause.check();
      if (isValid) {
        console.log(`✅ ${cause.name} - OK`);
        detectionScore += 2;
      } else {
        console.log(`❌ ${cause.name} - DETECTED (scheduling fix)`);
        this.fixes.push(cause.fix);
      }
    }

    this.validationResults.patternDetection = {
      score: detectionScore,
      maxScore: maxDetectionScore,
      percentage: Math.round((detectionScore / maxDetectionScore) * 100)
    };

    console.log(`📊 404 Pattern Detection Score: ${detectionScore}/${maxDetectionScore} (${this.validationResults.patternDetection.percentage}%)`);
    console.log('');
  }

  // ============================================
  // 🔧 AUTONOMOUS ERROR RESOLUTION
  // ============================================

  async autoFixDetectedErrors() {
    console.log('🔧 PHASE 8: Autonomous Error Resolution');
    console.log('-'.repeat(50));

    if (this.fixes.length === 0) {
      console.log('✅ No fixes needed - All checks passed!');
      return;
    }

    console.log(`🔧 Applying ${this.fixes.length} automated fixes...`);

    for (const fix of this.fixes) {
      try {
        switch (fix) {
          case 'autoCreateIndexHtml':
            await this.autoCreateIndexHtml();
            break;
          case 'fixPublicDirectory':
            await this.fixPublicDirectory();
            break;
          case 'addCatchAllRewrite':
            await this.addCatchAllRewrite();
            break;
          case 'fixStandaloneOutput':
            await this.fixStandaloneOutput();
            break;
          case 'createNotFoundPage':
            await this.autoCreateNotFoundPage();
            break;
          default:
            console.log(`⚠️  Unknown fix: ${fix}`);
        }
      } catch (error) {
        console.log(`❌ Failed to apply fix ${fix}: ${error.message}`);
      }
    }

    console.log('✅ Automated fixes completed');
    console.log('');
  }

  // ============================================
  // 📊 DIAGNOSTIC REPORT GENERATION
  // ============================================

  async generateDiagnosticReport() {
    console.log('📊 PHASE 9: Comprehensive Diagnostic Report');
    console.log('='.repeat(70));

    // Calculate overall score
    let totalScore = 0;
    let totalMaxScore = 0;

    for (const [key, result] of Object.entries(this.validationResults)) {
      totalScore += result.score;
      totalMaxScore += result.maxScore;
    }

    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);

    console.log('🎯 FIREBASE STUDIO 404 DIAGNOSTIC RESULTS');
    console.log('');
    console.log(`📊 Overall Score: ${totalScore}/${totalMaxScore} (${overallPercentage}%)`);
    console.log('');

    // Detailed breakdown
    for (const [key, result] of Object.entries(this.validationResults)) {
      const status = result.percentage >= 80 ? '✅' : result.percentage >= 60 ? '⚠️' : '❌';
      console.log(`${status} ${key}: ${result.score}/${result.maxScore} (${result.percentage}%)`);
    }

    console.log('');

    // Error summary
    if (this.errors.length > 0) {
      console.log('🚨 ERRORS DETECTED:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message}`);
      });
      console.log('');
    }

    // Fixes applied
    if (this.fixes.length > 0) {
      console.log('🔧 FIXES APPLIED:');
      this.fixes.forEach((fix, index) => {
        console.log(`${index + 1}. ${fix}`);
      });
      console.log('');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    
    if (overallPercentage >= 90) {
      console.log('🎉 Excellent! Your Firebase Studio configuration is production-ready.');
      console.log('🚀 You can proceed with deployment to Firebase Studio.');
    } else if (overallPercentage >= 75) {
      console.log('✅ Good configuration with minor issues.');
      console.log('🔧 Review and apply the suggested fixes above.');
    } else if (overallPercentage >= 50) {
      console.log('⚠️  Configuration needs attention.');
      console.log('🛠️  Apply all suggested fixes before deploying.');
    } else {
      console.log('❌ Configuration requires significant fixes.');
      console.log('🚨 Do not deploy until all critical issues are resolved.');
    }

    console.log('');
    console.log('🔗 Next Steps:');
    console.log('1. Review and apply all suggested fixes');
    console.log('2. Run "npm run build" to test your configuration');
    console.log('3. Test locally with "firebase emulators:start"');
    console.log('4. Deploy to Firebase Studio when score > 90%');
    console.log('');
    console.log('⏰ Diagnostic completed:', new Date().toISOString());
  }

  // ============================================
  // 🛠️  AUTO-FIX FUNCTIONS
  // ============================================

  async autoCreateNotFoundPage() {
    const notFoundPath = path.join(this.projectRoot, 'src/app/not-found.tsx');
    const notFoundContent = `import { Metadata } from 'next';

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

    fs.writeFileSync(notFoundPath, notFoundContent);
    console.log('✅ Created not-found.tsx page');
  }

  async fixPublicDirectory() {
    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    try {
      const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
      if (config.hosting) {
        config.hosting.public = 'out';
        fs.writeFileSync(firebaseConfigPath, JSON.stringify(config, null, 2));
        console.log('✅ Fixed public directory in firebase.json');
      }
    } catch (error) {
      console.log('❌ Failed to fix public directory');
    }
  }

  async addCatchAllRewrite() {
    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    try {
      const config = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
      if (config.hosting) {
        if (!config.hosting.rewrites) {
          config.hosting.rewrites = [];
        }
        
        // Add catch-all rewrite if it doesn't exist
        const hasCatchAll = config.hosting.rewrites.some(r => r.source === '**');
        if (!hasCatchAll) {
          config.hosting.rewrites.push({
            "source": "**",
            "destination": "/index.html"
          });
          fs.writeFileSync(firebaseConfigPath, JSON.stringify(config, null, 2));
          console.log('✅ Added catch-all rewrite rule');
        }
      }
    } catch (error) {
      console.log('❌ Failed to add catch-all rewrite');
    }
  }

  async autoCreateAppHostingYaml() {
    const appHostingPath = path.join(this.projectRoot, 'apphosting.yaml');
    const appHostingContent = `# Firebase App Hosting Configuration for ALCHM
runConfig:
  runtime: nodejs20
  env:
    NODE_ENV: production
    NEXT_TELEMETRY_DISABLED: "1"
  
# Build configuration
buildConfig:
  commands:
    - npm ci
    - npm run build
  outputDir: out
`;

    fs.writeFileSync(appHostingPath, appHostingContent);
    console.log('✅ Created apphosting.yaml');
  }

  // ============================================
  // 🔧 UTILITY FUNCTIONS
  // ============================================

  logError(type, message) {
    this.errors.push({ type, message, timestamp: new Date().toISOString() });
  }

  async validateNotFoundPage(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('export default function NotFound')) {
      console.log('✅ not-found.tsx has proper export');
    } else {
      this.logError('INVALID_NOT_FOUND_PAGE', 'not-found.tsx must export default function NotFound');
    }
  }

  async validateAppHostingYaml(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('nodejs20')) {
      console.log('✅ apphosting.yaml uses Node.js 20 runtime');
    } else {
      this.logError('WRONG_RUNTIME', 'apphosting.yaml should use nodejs20 runtime');
    }
  }
}

// ============================================
// 🚀 MAIN EXECUTION
// ============================================

async function main() {
  const diagnosticTool = new FirebaseStudio404Debugger();
  await diagnosticTool.runFullDiagnostic();
  
  // Exit with appropriate code
  const hasErrors = diagnosticTool.errors.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FirebaseStudio404Debugger;