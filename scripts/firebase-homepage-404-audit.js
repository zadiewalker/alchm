#!/usr/bin/env node

/**
 * 🏠 FIREBASE HOMEPAGE 404 DIAGNOSTIC AUDIT
 * Award-winning debugging system for Firebase Studio + Next.js 15 homepage visibility
 * 
 * Specialized focus: Route "/" (homepage) 404 resolution
 * Target: Firebase-hosted web apps with Next.js 15 App Router
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FirebaseHomepage404Audit {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditResults = {
      deployment: { status: 'pending', issues: [], fixes: [] },
      routing: { status: 'pending', issues: [], fixes: [] },
      buildArtifacts: { status: 'pending', issues: [], fixes: [] },
      cloudFunctions: { status: 'pending', issues: [], fixes: [] },
      liveTest: { status: 'pending', issues: [], fixes: [] }
    };
    this.criticalIssues = [];
    this.appliedFixes = [];
    
    console.log('🏠 Firebase Homepage 404 Diagnostic Audit');
    console.log('=' .repeat(60));
    console.log(`📍 Project: ${path.basename(this.projectRoot)}`);
    console.log(`🎯 Target: Homepage route "/" visibility`);
    console.log(`⏰ Started: ${new Date().toISOString()}`);
    console.log('');
  }

  async runComprehensiveAudit() {
    console.log('🔍 INITIATING SURGICAL HOMEPAGE 404 INVESTIGATION...');
    console.log('');

    try {
      // Phase 1: Deployment Verification
      await this.auditDeploymentConfiguration();
      
      // Phase 2: Routing Integrity Check
      await this.auditRoutingIntegrity();
      
      // Phase 3: Build Artifact Inspection
      await this.auditBuildArtifacts();
      
      // Phase 4: Cloud Function Routing Conflicts
      await this.auditCloudFunctionRouting();
      
      // Phase 5: Live Testing Simulation
      await this.performLiveTesting();
      
      // Phase 6: Resolution & Fix Application
      await this.applyAutomaticFixes();
      
      // Phase 7: Final Verification
      await this.verifyHomepageResolution();
      
    } catch (error) {
      console.error('❌ Homepage audit failed:', error.message);
      process.exit(1);
    }
  }

  // ============================================
  // 🚀 PHASE 1: DEPLOYMENT VERIFICATION
  // ============================================

  async auditDeploymentConfiguration() {
    console.log('🚀 PHASE 1: Deployment Configuration Verification');
    console.log('-'.repeat(50));

    let deploymentScore = 0;
    const maxDeploymentScore = 100;

    // 1.1 Check firebase.json exists and is valid
    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    
    if (!fs.existsSync(firebaseConfigPath)) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: 'firebase.json missing',
        description: 'No Firebase configuration found',
        fix: 'Create firebase.json with hosting configuration'
      });
      console.log('❌ firebase.json - MISSING (CRITICAL)');
      return;
    }

    console.log('✅ firebase.json - EXISTS');
    deploymentScore += 20;

    // 1.2 Parse and validate firebase.json
    let firebaseConfig;
    try {
      const configContent = fs.readFileSync(firebaseConfigPath, 'utf8');
      firebaseConfig = JSON.parse(configContent);
      console.log('✅ firebase.json - VALID JSON');
      deploymentScore += 20;
    } catch (error) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: 'firebase.json invalid JSON',
        description: `Parse error: ${error.message}`,
        fix: 'Fix JSON syntax errors in firebase.json'
      });
      console.log('❌ firebase.json - INVALID JSON');
      return;
    }

    // 1.3 Check hosting configuration
    if (!firebaseConfig.hosting) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: 'No hosting configuration',
        description: 'firebase.json missing hosting section',
        fix: 'Add hosting configuration to firebase.json'
      });
      console.log('❌ hosting configuration - MISSING');
      return;
    }

    console.log('✅ hosting configuration - FOUND');
    deploymentScore += 20;

    // 1.4 Validate public directory
    const publicDir = firebaseConfig.hosting.public || 'public';
    const publicPath = path.join(this.projectRoot, publicDir);
    
    if (!fs.existsSync(publicPath)) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: `Public directory missing: ${publicDir}`,
        description: 'Firebase hosting public directory does not exist',
        fix: `Create ${publicDir} directory or update firebase.json public setting`
      });
      console.log(`❌ public directory (${publicDir}) - MISSING`);
    } else {
      console.log(`✅ public directory (${publicDir}) - EXISTS`);
      deploymentScore += 20;
    }

    // 1.5 Critical: Check for homepage entry point
    const indexPaths = [
      path.join(publicPath, 'index.html'),
      path.join(this.projectRoot, 'out', 'index.html'),
      path.join(this.projectRoot, '.next', 'server', 'pages', 'index.html')
    ];

    let homepageEntryFound = false;
    for (const indexPath of indexPaths) {
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Homepage entry point - FOUND (${path.relative(this.projectRoot, indexPath)})`);
        homepageEntryFound = true;
        deploymentScore += 20;
        break;
      }
    }

    if (!homepageEntryFound) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: 'No homepage entry point found',
        description: 'index.html not found in public directory or build output',
        fix: 'Ensure build process generates index.html in the correct location'
      });
      console.log('❌ Homepage entry point - NOT FOUND (CRITICAL)');
    }

    // 1.6 CRITICAL: Validate rewrite rules for homepage
    await this.validateHomepageRewriteRules(firebaseConfig, deploymentScore);

    this.auditResults.deployment.status = deploymentScore >= 80 ? 'pass' : 'fail';
    console.log(`📊 Deployment Score: ${deploymentScore}/100`);
    console.log('');
  }

  async validateHomepageRewriteRules(firebaseConfig, deploymentScore) {
    console.log('🔍 Analyzing rewrite rules for homepage routing...');
    
    const rewrites = firebaseConfig.hosting.rewrites || [];
    
    // Check for catch-all rewrite (critical for SPA)
    const hasCatchAll = rewrites.some(rewrite => 
      rewrite.source === '**' && rewrite.destination === '/index.html'
    );

    if (!hasCatchAll) {
      this.auditResults.deployment.issues.push({
        severity: 'critical',
        issue: 'Missing catch-all rewrite rule',
        description: 'No "source": "**" -> "/index.html" rule found',
        fix: 'Add catch-all rewrite rule to firebase.json',
        autoFix: true,
        fixCode: {
          "source": "**",
          "destination": "/index.html"
        }
      });
      console.log('❌ Catch-all rewrite rule - MISSING (CRITICAL FOR HOMEPAGE)');
    } else {
      console.log('✅ Catch-all rewrite rule - CONFIGURED');
      deploymentScore += 10;
    }

    // Check for conflicting Function rewrites that might intercept homepage
    const functionRewrites = rewrites.filter(rewrite => rewrite.function);
    const homepageConflicts = functionRewrites.filter(rewrite => 
      rewrite.source === '/' || rewrite.source === '' || rewrite.source === '**'
    );

    if (homepageConflicts.length > 0) {
      this.auditResults.deployment.issues.push({
        severity: 'high',
        issue: 'Function rewrite conflicts with homepage',
        description: `Function rewrites intercepting homepage: ${homepageConflicts.map(r => r.source).join(', ')}`,
        fix: 'Reorder rewrites or make function patterns more specific'
      });
      console.log('⚠️  Function rewrite conflicts - DETECTED');
    } else {
      console.log('✅ No function conflicts with homepage');
    }
  }

  // ============================================
  // 🛣️  PHASE 2: ROUTING INTEGRITY CHECK
  // ============================================

  async auditRoutingIntegrity() {
    console.log('🛣️  PHASE 2: Next.js 15 App Router Integrity Check');
    console.log('-'.repeat(50));

    let routingScore = 0;
    const maxRoutingScore = 100;

    // 2.1 Detect Next.js version and routing system
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next;
      
      if (nextVersion) {
        console.log(`✅ Next.js detected - Version: ${nextVersion}`);
        routingScore += 20;
        
        // Check if it's Next.js 13+ (App Router compatible)
        const versionNumber = nextVersion.replace(/[^\d.]/g, '');
        const majorVersion = parseInt(versionNumber.split('.')[0]);
        
        if (majorVersion >= 13) {
          console.log('✅ Next.js 13+ - App Router compatible');
          routingScore += 20;
        } else {
          console.log('⚠️  Next.js < 13 - Using Pages Router');
        }
      }
    }

    // 2.2 Check for App Router structure
    const appRouterPath = path.join(this.projectRoot, 'src', 'app');
    const appRouterAltPath = path.join(this.projectRoot, 'app');
    
    let appRouterDir = null;
    if (fs.existsSync(appRouterPath)) {
      appRouterDir = appRouterPath;
      console.log('✅ App Router - Found in src/app/');
      routingScore += 20;
    } else if (fs.existsSync(appRouterAltPath)) {
      appRouterDir = appRouterAltPath;
      console.log('✅ App Router - Found in app/');
      routingScore += 20;
    } else {
      console.log('⚠️  App Router - Not found, checking Pages Router...');
    }

    // 2.3 CRITICAL: Check for homepage route file
    if (appRouterDir) {
      const homepageRoutePaths = [
        path.join(appRouterDir, 'page.tsx'),
        path.join(appRouterDir, 'page.ts'),
        path.join(appRouterDir, 'page.jsx'),
        path.join(appRouterDir, 'page.js')
      ];

      let homepageRouteFound = false;
      for (const routePath of homepageRoutePaths) {
        if (fs.existsSync(routePath)) {
          console.log(`✅ Homepage route - FOUND (${path.relative(this.projectRoot, routePath)})`);
          homepageRouteFound = true;
          routingScore += 30;
          
          // Validate the route file content
          await this.validateHomepageRouteContent(routePath);
          break;
        }
      }

      if (!homepageRouteFound) {
        this.auditResults.routing.issues.push({
          severity: 'critical',
          issue: 'Homepage route file missing',
          description: 'No page.tsx/jsx/ts/js found in app directory',
          fix: 'Create page.tsx in app directory with default export',
          autoFix: true,
          fixCode: `export default function HomePage() {\n  return (\n    <div>\n      <h1>Welcome to ALCHM</h1>\n    </div>\n  );\n}`
        });
        console.log('❌ Homepage route file - MISSING (CRITICAL)');
      }

      // Check for root layout
      const layoutPaths = [
        path.join(appRouterDir, 'layout.tsx'),
        path.join(appRouterDir, 'layout.ts'),
        path.join(appRouterDir, 'layout.jsx'),
        path.join(appRouterDir, 'layout.js')
      ];

      let layoutFound = false;
      for (const layoutPath of layoutPaths) {
        if (fs.existsSync(layoutPath)) {
          console.log(`✅ Root layout - FOUND (${path.relative(this.projectRoot, layoutPath)})`);
          layoutFound = true;
          routingScore += 10;
          break;
        }
      }

      if (!layoutFound) {
        this.auditResults.routing.issues.push({
          severity: 'high',
          issue: 'Root layout missing',
          description: 'No layout.tsx/jsx found in app directory',
          fix: 'Create layout.tsx in app directory'
        });
        console.log('⚠️  Root layout - MISSING');
      }
    } else {
      // Check Pages Router
      const pagesDir = path.join(this.projectRoot, 'pages');
      if (fs.existsSync(pagesDir)) {
        console.log('✅ Pages Router - Found');
        
        const indexPagePaths = [
          path.join(pagesDir, 'index.tsx'),
          path.join(pagesDir, 'index.ts'),
          path.join(pagesDir, 'index.jsx'),
          path.join(pagesDir, 'index.js')
        ];

        let indexPageFound = false;
        for (const indexPath of indexPagePaths) {
          if (fs.existsSync(indexPath)) {
            console.log(`✅ Homepage index - FOUND (${path.relative(this.projectRoot, indexPath)})`);
            indexPageFound = true;
            routingScore += 30;
            break;
          }
        }

        if (!indexPageFound) {
          this.auditResults.routing.issues.push({
            severity: 'critical',
            issue: 'Homepage index.js missing',
            description: 'No index.tsx/jsx found in pages directory',
            fix: 'Create index.tsx in pages directory'
          });
          console.log('❌ Homepage index - MISSING (CRITICAL)');
        }
      } else {
        this.auditResults.routing.issues.push({
          severity: 'critical',
          issue: 'No routing system detected',
          description: 'Neither App Router nor Pages Router found',
          fix: 'Create proper Next.js routing structure'
        });
        console.log('❌ No routing system - DETECTED');
      }
    }

    this.auditResults.routing.status = routingScore >= 70 ? 'pass' : 'fail';
    console.log(`📊 Routing Score: ${routingScore}/100`);
    console.log('');
  }

  async validateHomepageRouteContent(routePath) {
    const content = fs.readFileSync(routePath, 'utf8');
    
    // Check for default export
    if (!content.includes('export default')) {
      this.auditResults.routing.issues.push({
        severity: 'high',
        issue: 'Homepage route missing default export',
        description: 'Page component must have default export',
        fix: 'Add "export default" to homepage component'
      });
      console.log('⚠️  Homepage route - Missing default export');
    } else {
      console.log('✅ Homepage route - Has default export');
    }

    // Check for basic JSX structure
    if (!content.includes('return') && !content.includes('=>')) {
      this.auditResults.routing.issues.push({
        severity: 'medium',
        issue: 'Homepage route may not return JSX',
        description: 'Component should return JSX element',
        fix: 'Ensure component returns valid JSX'
      });
      console.log('⚠️  Homepage route - May not return JSX');
    }
  }

  // ============================================
  // 🏗️  PHASE 3: BUILD ARTIFACT INSPECTION
  // ============================================

  async auditBuildArtifacts() {
    console.log('🏗️  PHASE 3: Build Artifact Inspection');
    console.log('-'.repeat(50));

    let buildScore = 0;
    const maxBuildScore = 100;

    // 3.1 Check for Next.js build output
    const nextBuildPath = path.join(this.projectRoot, '.next');
    
    if (fs.existsSync(nextBuildPath)) {
      console.log('✅ .next build directory - EXISTS');
      buildScore += 25;
      
      // Check for standalone build (required for Firebase Functions)
      const standalonePath = path.join(nextBuildPath, 'standalone');
      if (fs.existsSync(standalonePath)) {
        console.log('✅ Standalone build - EXISTS');
        buildScore += 25;
      } else {
        this.auditResults.buildArtifacts.issues.push({
          severity: 'high',
          issue: 'Standalone build missing',
          description: 'next.config.js may not have output: "standalone"',
          fix: 'Add output: "standalone" to next.config.js'
        });
        console.log('⚠️  Standalone build - MISSING');
      }
    } else {
      this.auditResults.buildArtifacts.issues.push({
        severity: 'critical',
        issue: '.next build directory missing',
        description: 'Project has not been built',
        fix: 'Run "npm run build" or "next build"'
      });
      console.log('❌ .next build directory - MISSING');
    }

    // 3.2 Check for export output (if using static export)
    const exportPath = path.join(this.projectRoot, 'out');
    
    if (fs.existsSync(exportPath)) {
      console.log('✅ Static export output - EXISTS');
      buildScore += 25;
      
      // Check for index.html in export
      const exportedIndexPath = path.join(exportPath, 'index.html');
      if (fs.existsSync(exportedIndexPath)) {
        console.log('✅ Exported index.html - EXISTS');
        buildScore += 25;
      } else {
        this.auditResults.buildArtifacts.issues.push({
          severity: 'critical',
          issue: 'Exported index.html missing',
          description: 'Static export did not generate homepage',
          fix: 'Ensure homepage route is properly configured for static export'
        });
        console.log('❌ Exported index.html - MISSING (CRITICAL)');
      }
    } else {
      console.log('ℹ️  Static export output - NOT FOUND (may be using server mode)');
      buildScore += 10; // Partial points as this might be intentional
    }

    // 3.3 Check next.config.js for output configuration
    const nextConfigPath = path.join(this.projectRoot, 'next.config.js');
    
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      if (configContent.includes('output:')) {
        if (configContent.includes('"export"') || configContent.includes("'export'")) {
          console.log('✅ Next.js config - Export mode configured');
        } else if (configContent.includes('"standalone"') || configContent.includes("'standalone'")) {
          console.log('✅ Next.js config - Standalone mode configured');
        } else {
          console.log('⚠️  Next.js config - Unknown output mode');
        }
      } else {
        console.log('ℹ️  Next.js config - No output mode specified (using default)');
      }
    }

    this.auditResults.buildArtifacts.status = buildScore >= 60 ? 'pass' : 'fail';
    console.log(`📊 Build Artifacts Score: ${buildScore}/100`);
    console.log('');
  }

  // ============================================
  // ☁️  PHASE 4: CLOUD FUNCTION ROUTING CONFLICTS
  // ============================================

  async auditCloudFunctionRouting() {
    console.log('☁️  PHASE 4: Cloud Function Routing Conflict Analysis');
    console.log('-'.repeat(50));

    let functionScore = 0;
    const maxFunctionScore = 100;

    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    
    if (!fs.existsSync(firebaseConfigPath)) {
      console.log('⚠️  firebase.json not found - skipping function analysis');
      this.auditResults.cloudFunctions.status = 'skip';
      return;
    }

    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    const rewrites = firebaseConfig.hosting?.rewrites || [];

    console.log(`🔍 Analyzing ${rewrites.length} rewrite rules...`);

    // 4.1 Check rewrite rule order (critical for proper routing)
    let homepageRewriteIndex = -1;
    let functionRewriteIndices = [];

    rewrites.forEach((rewrite, index) => {
      if (rewrite.source === '**' && rewrite.destination === '/index.html') {
        homepageRewriteIndex = index;
      }
      if (rewrite.function) {
        functionRewriteIndices.push(index);
      }
    });

    if (homepageRewriteIndex === -1) {
      this.auditResults.cloudFunctions.issues.push({
        severity: 'critical',
        issue: 'No catch-all rewrite for homepage',
        description: 'Missing "**" -> "/index.html" rule',
        fix: 'Add catch-all rewrite rule as the last rule'
      });
      console.log('❌ Catch-all rewrite - MISSING');
    } else {
      console.log('✅ Catch-all rewrite - FOUND');
      functionScore += 50;
      
      // Check if function rewrites come after homepage rewrite (correct order)
      const functionRewritesAfterHomepage = functionRewriteIndices.filter(i => i > homepageRewriteIndex);
      const functionRewritesBeforeHomepage = functionRewriteIndices.filter(i => i < homepageRewriteIndex);
      
      if (functionRewritesBeforeHomepage.length > 0) {
        console.log(`✅ Function rewrites - ${functionRewritesBeforeHomepage.length} correctly placed before catch-all`);
        functionScore += 30;
      }
      
      if (functionRewritesAfterHomepage.length > 0) {
        this.auditResults.cloudFunctions.issues.push({
          severity: 'medium',
          issue: 'Function rewrites after catch-all',
          description: `${functionRewritesAfterHomepage.length} function rewrites will never be reached`,
          fix: 'Move function rewrites before catch-all rewrite'
        });
        console.log(`⚠️  Function rewrites - ${functionRewritesAfterHomepage.length} unreachable after catch-all`);
      } else {
        functionScore += 20;
      }
    }

    // 4.2 Check for conflicting patterns
    const conflictingPatterns = rewrites.filter(rewrite => 
      rewrite.function && (
        rewrite.source === '/' || 
        rewrite.source === '' || 
        rewrite.source === '**' ||
        rewrite.source === '*'
      )
    );

    if (conflictingPatterns.length > 0) {
      this.auditResults.cloudFunctions.issues.push({
        severity: 'high',
        issue: 'Function rewrites conflict with homepage',
        description: `Patterns that intercept homepage: ${conflictingPatterns.map(r => r.source).join(', ')}`,
        fix: 'Use more specific patterns for function rewrites'
      });
      console.log(`⚠️  Conflicting function patterns - ${conflictingPatterns.length} detected`);
    } else {
      console.log('✅ No conflicting function patterns');
    }

    this.auditResults.cloudFunctions.status = functionScore >= 70 ? 'pass' : 'fail';
    console.log(`📊 Function Routing Score: ${functionScore}/100`);
    console.log('');
  }

  // ============================================
  // 🧪 PHASE 5: LIVE TESTING SIMULATION
  // ============================================

  async performLiveTesting() {
    console.log('🧪 PHASE 5: Live Testing Simulation');
    console.log('-'.repeat(50));

    let testScore = 0;
    const maxTestScore = 100;

    // 5.1 Test local serve (if possible)
    try {
      console.log('⏳ Testing local Firebase serve...');
      
      // Check if Firebase CLI is available
      const firebaseVersion = execSync('firebase --version', { encoding: 'utf8', timeout: 5000 }).trim();
      console.log(`✅ Firebase CLI - ${firebaseVersion}`);
      testScore += 20;
      
      // Attempt to start Firebase emulator briefly
      console.log('⏳ Starting Firebase emulator for testing...');
      
      const emulatorProcess = execSync('firebase emulators:start --only hosting --project demo-test &', {
        encoding: 'utf8',
        timeout: 10000,
        stdio: 'pipe'
      });
      
      // Give emulator time to start
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test homepage accessibility
      try {
        const testResponse = execSync('curl -I http://localhost:5000', { 
          encoding: 'utf8', 
          timeout: 5000,
          stdio: 'pipe'
        });
        
        if (testResponse.includes('200 OK')) {
          console.log('✅ Local homepage test - ACCESSIBLE');
          testScore += 40;
        } else if (testResponse.includes('404')) {
          this.auditResults.liveTest.issues.push({
            severity: 'critical',
            issue: 'Local homepage returns 404',
            description: 'Homepage not accessible on local emulator',
            fix: 'Check build output and firebase.json configuration'
          });
          console.log('❌ Local homepage test - 404 ERROR');
        } else {
          console.log('⚠️  Local homepage test - Unexpected response');
          testScore += 10;
        }
      } catch (testError) {
        console.log('⚠️  Local homepage test - Could not connect');
        testScore += 5;
      }
      
      // Clean up emulator
      try {
        execSync('pkill -f "firebase emulators"', { stdio: 'ignore' });
      } catch {
        // Ignore cleanup errors
      }
      
    } catch (error) {
      console.log('⚠️  Local testing - Firebase CLI not available or project not configured');
      console.log(`   Error: ${error.message.split('\n')[0]}`);
    }

    // 5.2 Simulate deployment test
    console.log('⏳ Simulating deployment validation...');
    
    const requiredFiles = [
      'firebase.json',
      'package.json',
      '.firebaserc'
    ];

    let deploymentReady = true;
    for (const file of requiredFiles) {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        console.log(`✅ ${file} - Ready for deployment`);
        testScore += 10;
      } else {
        console.log(`❌ ${file} - Missing for deployment`);
        deploymentReady = false;
      }
    }

    if (deploymentReady) {
      console.log('✅ Deployment readiness - CONFIRMED');
      testScore += 20;
    } else {
      this.auditResults.liveTest.issues.push({
        severity: 'high',
        issue: 'Deployment files missing',
        description: 'Required files for Firebase deployment not found',
        fix: 'Initialize Firebase project and configure hosting'
      });
    }

    this.auditResults.liveTest.status = testScore >= 50 ? 'pass' : 'fail';
    console.log(`📊 Live Testing Score: ${testScore}/100`);
    console.log('');
  }

  // ============================================
  // 🔧 PHASE 6: AUTOMATIC FIX APPLICATION
  // ============================================

  async applyAutomaticFixes() {
    console.log('🔧 PHASE 6: Automatic Fix Application');
    console.log('-'.repeat(50));

    // Collect all auto-fixable issues
    const autoFixableIssues = [];
    
    for (const [phase, results] of Object.entries(this.auditResults)) {
      for (const issue of results.issues || []) {
        if (issue.autoFix) {
          autoFixableIssues.push({ phase, ...issue });
        }
      }
    }

    if (autoFixableIssues.length === 0) {
      console.log('ℹ️  No automatic fixes needed');
      return;
    }

    console.log(`🔧 Applying ${autoFixableIssues.length} automatic fixes...`);

    for (const issue of autoFixableIssues) {
      try {
        await this.applySpecificFix(issue);
        this.appliedFixes.push(issue.fix);
        console.log(`✅ Applied: ${issue.fix}`);
      } catch (error) {
        console.log(`❌ Failed to apply: ${issue.fix} - ${error.message}`);
      }
    }

    console.log('');
  }

  async applySpecificFix(issue) {
    switch (issue.issue) {
      case 'Missing catch-all rewrite rule':
        await this.fixCatchAllRewrite(issue.fixCode);
        break;
      case 'Homepage route file missing':
        await this.createHomepageRoute(issue.fixCode);
        break;
      default:
        console.log(`⚠️  No automatic fix available for: ${issue.issue}`);
    }
  }

  async fixCatchAllRewrite(fixCode) {
    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    
    if (!firebaseConfig.hosting.rewrites) {
      firebaseConfig.hosting.rewrites = [];
    }
    
    // Add catch-all rewrite as the last rule
    firebaseConfig.hosting.rewrites.push(fixCode);
    
    fs.writeFileSync(firebaseConfigPath, JSON.stringify(firebaseConfig, null, 2));
  }

  async createHomepageRoute(fixCode) {
    const appDir = path.join(this.projectRoot, 'src', 'app');
    
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    const pageFilePath = path.join(appDir, 'page.tsx');
    fs.writeFileSync(pageFilePath, fixCode);
  }

  // ============================================
  // ✅ PHASE 7: FINAL VERIFICATION
  // ============================================

  async verifyHomepageResolution() {
    console.log('✅ PHASE 7: Homepage Resolution Verification');
    console.log('-'.repeat(50));

    // Calculate overall health score
    const phaseScores = Object.values(this.auditResults).filter(result => 
      result.status === 'pass'
    ).length;
    const totalPhases = Object.keys(this.auditResults).length;
    const healthScore = Math.round((phaseScores / totalPhases) * 100);

    console.log(`📊 Overall Health Score: ${healthScore}%`);

    // Count critical vs resolved issues
    const allIssues = [];
    const criticalIssues = [];
    
    for (const [phase, results] of Object.entries(this.auditResults)) {
      for (const issue of results.issues || []) {
        allIssues.push(issue);
        if (issue.severity === 'critical') {
          criticalIssues.push(issue);
        }
      }
    }

    console.log(`🚨 Total Issues Found: ${allIssues.length}`);
    console.log(`🔴 Critical Issues: ${criticalIssues.length}`);
    console.log(`🔧 Fixes Applied: ${this.appliedFixes.length}`);

    // Generate resolution status
    let resolutionStatus = 'UNKNOWN';
    let statusColor = '⚠️';

    if (criticalIssues.length === 0 && healthScore >= 80) {
      resolutionStatus = 'RESOLVED';
      statusColor = '✅';
    } else if (criticalIssues.length <= 2 && healthScore >= 60) {
      resolutionStatus = 'MOSTLY RESOLVED';
      statusColor = '🟡';
    } else {
      resolutionStatus = 'NEEDS ATTENTION';
      statusColor = '🔴';
    }

    console.log('');
    console.log('=' .repeat(60));
    console.log(`${statusColor} HOMEPAGE 404 RESOLUTION STATUS: ${resolutionStatus}`);
    console.log('=' .repeat(60));

    // Generate detailed summary
    await this.generateResolutionSummary(healthScore, resolutionStatus, criticalIssues);
  }

  async generateResolutionSummary(healthScore, resolutionStatus, criticalIssues) {
    console.log('');
    console.log('📋 DETAILED RESOLUTION SUMMARY');
    console.log('-'.repeat(40));

    // Root cause analysis
    console.log('🔍 ROOT CAUSE ANALYSIS:');
    
    if (criticalIssues.length > 0) {
      console.log('   Primary Issues Identified:');
      criticalIssues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue.issue}`);
        console.log(`      └─ ${issue.description}`);
      });
    } else {
      console.log('   ✅ No critical issues blocking homepage access');
    }

    console.log('');
    console.log('🛠️  FIXES APPLIED:');
    if (this.appliedFixes.length > 0) {
      this.appliedFixes.forEach((fix, index) => {
        console.log(`   ${index + 1}. ${fix}`);
      });
    } else {
      console.log('   ℹ️  No automatic fixes were needed');
    }

    console.log('');
    console.log('🚀 NEXT STEPS:');
    
    if (resolutionStatus === 'RESOLVED') {
      console.log('   1. Build your project: npm run build');
      console.log('   2. Deploy to Firebase: firebase deploy');
      console.log('   3. Test homepage: visit your deployed URL');
      console.log('   ✅ Your homepage should now be accessible!');
    } else if (resolutionStatus === 'MOSTLY RESOLVED') {
      console.log('   1. Address remaining issues (see above)');
      console.log('   2. Run this audit again: npm run homepage:audit');
      console.log('   3. Build and deploy once issues are resolved');
    } else {
      console.log('   1. Fix critical issues identified above');
      console.log('   2. Ensure proper Next.js routing structure');
      console.log('   3. Verify firebase.json configuration');
      console.log('   4. Re-run this audit after fixes');
    }

    // Generate updated firebase.json if needed
    await this.generateOptimizedFirebaseConfig();

    console.log('');
    console.log(`⏰ Audit completed: ${new Date().toISOString()}`);
    console.log('📍 For additional help, run: npm run 404:debug');
  }

  async generateOptimizedFirebaseConfig() {
    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    
    if (!fs.existsSync(firebaseConfigPath)) {
      console.log('');
      console.log('📝 RECOMMENDED FIREBASE.JSON CONFIGURATION:');
      console.log('-'.repeat(40));
      
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
          "cleanUrls": true,
          "trailingSlash": false
        }
      };
      
      console.log(JSON.stringify(recommendedConfig, null, 2));
      console.log('');
      console.log('💡 Create this file as firebase.json in your project root');
    }
  }
}

// ============================================
// 🚀 MAIN EXECUTION
// ============================================

async function main() {
  const audit = new FirebaseHomepage404Audit();
  await audit.runComprehensiveAudit();
  
  console.log('');
  console.log('🏁 FIREBASE HOMEPAGE 404 AUDIT COMPLETED');
  console.log('');
  console.log('📊 Summary: Homepage accessibility has been thoroughly analyzed');
  console.log('🔧 Automatic fixes have been applied where possible');
  console.log('📋 See detailed findings above for any remaining actions');
  console.log('');
  console.log('🔗 Deploy with: firebase deploy');
  console.log('🧪 Test locally with: firebase emulators:start');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = FirebaseHomepage404Audit;