#!/usr/bin/env node

/**
 * Quick Firebase Studio Publication Check
 * Fast validation of critical Firebase Studio requirements
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

class QuickFirebaseStudioCheck {
  constructor() {
    this.projectRoot = process.cwd();
    this.issues = [];
    this.score = 100;
  }

  addIssue(category, message, severity = 'ERROR', fix = '') {
    this.issues.push({ category, message, severity, fix });
    if (severity === 'ERROR') this.score -= 25;
    if (severity === 'WARNING') this.score -= 5;
  }

  checkCriticalFiles() {
    console.log('🔍 Checking critical files...');
    
    const requiredFiles = [
      { file: 'package.json', critical: true },
      { file: 'next.config.js', critical: true },
      { file: 'apphosting.yaml', critical: true }
    ];

    for (const { file, critical } of requiredFiles) {
      const exists = fs.existsSync(path.join(this.projectRoot, file));
      if (!exists && critical) {
        this.addIssue('Files', `Missing critical file: ${file}`, 'ERROR', `Create ${file} with proper configuration`);
      } else if (exists) {
        console.log(`✅ Found: ${file}`);
      }
    }
  }

  checkPackageJson() {
    console.log('📦 Validating package.json...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Critical: No type: "module"
      if (packageJson.type === 'module') {
        this.addIssue('Configuration', 'package.json contains "type": "module"', 'ERROR', 'Remove "type": "module" from package.json');
      } else {
        console.log('✅ No type: "module" conflict');
      }

      // Check for Next.js
      if (!packageJson.dependencies?.next) {
        this.addIssue('Dependencies', 'Next.js not found in dependencies', 'ERROR', 'Install Next.js: npm install next');
      } else {
        console.log(`✅ Next.js found: ${packageJson.dependencies.next}`);
      }

      // Check Node.js version
      if (!packageJson.engines?.node || !packageJson.engines.node.includes('20')) {
        this.addIssue('Configuration', 'Node.js version not optimized for Firebase Studio', 'WARNING', 'Add "engines": {"node": ">=18 <=20"} to package.json');
      }

    } catch (error) {
      this.addIssue('Files', 'package.json is invalid or missing', 'ERROR', 'Fix package.json syntax');
    }
  }

  checkNextConfig() {
    console.log('⚙️ Validating next.config.js...');
    
    // Check for conflicting .mjs files
    const mjsFiles = ['next.config.mjs', 'next.config.performance.mjs'];
    const conflicts = mjsFiles.filter(file => fs.existsSync(file));
    
    if (conflicts.length > 0) {
      this.addIssue('Configuration', `Conflicting config files: ${conflicts.join(', ')}`, 'ERROR', `Remove: ${conflicts.join(', ')}`);
    } else {
      console.log('✅ No conflicting .mjs files');
    }

    try {
      const configContent = fs.readFileSync('next.config.js', 'utf8');
      
      // Critical: Must use CommonJS syntax
      if (configContent.includes('export default')) {
        this.addIssue('Configuration', 'next.config.js uses ES module syntax', 'ERROR', 'Change "export default" to "module.exports ="');
      } else if (configContent.includes('module.exports')) {
        console.log('✅ Uses CommonJS module.exports');
      }

      // Critical: Must have standalone output
      if (!configContent.includes("output: 'standalone'")) {
        this.addIssue('Configuration', 'Next.js not configured for standalone output', 'ERROR', 'Add output: "standalone" to next.config.js');
      } else {
        console.log('✅ Standalone output configured');
      }

    } catch (error) {
      this.addIssue('Files', 'next.config.js is missing or unreadable', 'ERROR', 'Create next.config.js with proper Firebase Studio configuration');
    }
  }

  checkAppHostingYaml() {
    console.log('🎯 Validating apphosting.yaml...');
    
    try {
      const yamlContent = fs.readFileSync('apphosting.yaml', 'utf8');
      const config = yaml.load(yamlContent);
      
      // Check runtime
      if (config.runConfig?.runtime !== 'nodejs20') {
        this.addIssue('App Hosting', 'Runtime not set to nodejs20', 'ERROR', 'Set runConfig.runtime to "nodejs20" in apphosting.yaml');
      } else {
        console.log('✅ Node.js 20 runtime configured');
      }

      // Check entry point
      const entryPoint = config.serve?.appConfig?.entryPoint;
      if (!entryPoint || !entryPoint.includes('standalone/server.js')) {
        this.addIssue('App Hosting', 'Incorrect entry point configuration', 'ERROR', 'Set serve.appConfig.entryPoint to ".next/standalone/server.js"');
      } else {
        console.log('✅ Correct entry point configured');
      }

      // Check build commands
      if (!config.build?.commands?.includes('npm run build')) {
        this.addIssue('App Hosting', 'Build commands not properly configured', 'WARNING', 'Ensure build.commands includes "npm run build"');
      } else {
        console.log('✅ Build commands configured');
      }

    } catch (error) {
      this.addIssue('App Hosting', 'apphosting.yaml is missing or invalid', 'ERROR', 'Create proper apphosting.yaml configuration');
    }
  }

  checkBuildOutput() {
    console.log('🏗️ Checking build output...');
    
    const buildDir = '.next';
    const standaloneDir = path.join(buildDir, 'standalone');
    const serverFile = path.join(standaloneDir, 'server.js');
    
    if (!fs.existsSync(buildDir)) {
      this.addIssue('Build', 'Build output not found', 'WARNING', 'Run "npm run build" to generate build output');
      return;
    }

    if (!fs.existsSync(standaloneDir)) {
      this.addIssue('Build', 'Standalone build directory not found', 'ERROR', 'Ensure next.config.js has output: "standalone" and rebuild');
    } else {
      console.log('✅ Standalone directory exists');
    }

    if (!fs.existsSync(serverFile)) {
      this.addIssue('Build', 'Standalone server.js not found', 'ERROR', 'Rebuild with proper standalone configuration');
    } else {
      console.log('✅ Standalone server.js exists');
    }
  }

  checkEnvironment() {
    console.log('🌍 Checking environment...');
    
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18 || majorVersion > 20) {
      this.addIssue('Environment', `Node.js version ${nodeVersion} not supported`, 'ERROR', 'Use Node.js version 18-20');
    } else {
      console.log(`✅ Node.js ${nodeVersion} is compatible`);
    }
  }

  generateReport() {
    console.log('\n🎯 FIREBASE STUDIO READINESS REPORT');
    console.log('='.repeat(50));
    console.log(`📊 Score: ${Math.max(0, this.score)}/100`);
    console.log(`🚨 Issues Found: ${this.issues.length}`);
    
    const errors = this.issues.filter(i => i.severity === 'ERROR');
    const warnings = this.issues.filter(i => i.severity === 'WARNING');
    
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`⚠️  Warnings: ${warnings.length}`);
    
    const isReady = errors.length === 0 && this.score >= 75;
    console.log(`🎯 Publication Ready: ${isReady ? '✅ YES' : '❌ NO'}`);
    
    if (errors.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES TO FIX:');
      errors.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️ WARNINGS:');
      warnings.forEach((issue, i) => {
        console.log(`${i + 1}. [${issue.category}] ${issue.message}`);
        console.log(`   Fix: ${issue.fix}`);
      });
    }
    
    if (isReady) {
      console.log('\n🎉 READY FOR FIREBASE STUDIO!');
      console.log('Your app meets all critical requirements.');
      console.log('\nNext steps:');
      console.log('1. Go to Firebase Console > App Hosting');
      console.log('2. Create new App Hosting backend');
      console.log('3. Connect your GitHub repository');
      console.log('4. Deploy to Firebase Studio');
    } else {
      console.log('\n🔧 FIXES REQUIRED');
      console.log('Please address the critical issues above before publication.');
    }
    
    console.log('='.repeat(50));
    
    return isReady;
  }

  async run() {
    console.log('🚀 Quick Firebase Studio Publication Check');
    console.log('==========================================\n');
    
    this.checkEnvironment();
    this.checkCriticalFiles();
    this.checkPackageJson();
    this.checkNextConfig();
    this.checkAppHostingYaml();
    this.checkBuildOutput();
    
    const isReady = this.generateReport();
    process.exit(isReady ? 0 : 1);
  }
}

// Run the check
const checker = new QuickFirebaseStudioCheck();
checker.run();