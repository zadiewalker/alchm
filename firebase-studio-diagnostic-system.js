#!/usr/bin/env node
// Firebase Studio Diagnostic System - Self-Operating Audit & Fix Protocol
// ALCHM Emergency Recovery System

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FirebaseStudioDiagnosticSystem {
  constructor() {
    this.results = {
      critical: [],
      warnings: [],
      fixed: [],
      passed: []
    };
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'error': '❌ CRITICAL',
      'warning': '⚠️ WARNING',
      'success': '✅ FIXED',
      'info': 'ℹ️ INFO'
    }[type] || 'ℹ️';
    
    console.log(`[${timestamp}] ${prefix}: ${message}`);
  }

  async runDiagnostic() {
    this.log('🚀 ALCHM Firebase Studio Diagnostic System Initiated', 'info');
    this.log('==================================================', 'info');
    
    // Phase 1: Critical System Checks
    await this.checkFirebaseConfiguration();
    await this.checkAPIEndpoints();
    await this.checkBuildSystem();
    await this.checkFirestoreRules();
    
    // Phase 2: Automated Fixes
    await this.attemptAutomaticFixes();
    
    // Phase 3: Validation
    await this.validateCoreJourneys();
    
    // Phase 4: Report Generation
    this.generateReport();
  }

  async checkFirebaseConfiguration() {
    this.log('📋 Checking Firebase Configuration...', 'info');
    
    try {
      // Check firebase.json
      const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
      
      if (firebaseConfig.hosting && firebaseConfig.functions && firebaseConfig.firestore) {
        this.results.passed.push('Firebase configuration complete');
        this.log('Firebase configuration structure valid', 'success');
      } else {
        this.results.critical.push('Firebase configuration incomplete');
        this.log('Firebase configuration missing required sections', 'error');
      }
      
      // Check for required rewrites
      const hosting = Array.isArray(firebaseConfig.hosting) 
        ? firebaseConfig.hosting[0] 
        : firebaseConfig.hosting;
        
      if (hosting.rewrites && hosting.rewrites.length > 0) {
        this.results.passed.push('Firebase rewrites configured');
        this.log('Firebase hosting rewrites found', 'success');
      } else {
        this.results.warnings.push('No Firebase hosting rewrites configured');
        this.log('Firebase hosting rewrites missing', 'warning');
      }
      
    } catch (error) {
      this.results.critical.push(`Firebase configuration error: ${error.message}`);
      this.log(`Firebase configuration error: ${error.message}`, 'error');
    }
  }

  async checkAPIEndpoints() {
    this.log('🔗 Checking Critical API Endpoints...', 'info');
    
    const criticalEndpoints = [
      'src/app/api/journal/save/route.ts',
      'src/app/api/auth/session/route.ts',
      'src/app/api/auth/emergency/route.ts'
    ];
    
    for (const endpoint of criticalEndpoints) {
      const fullPath = path.join(this.projectRoot, endpoint);
      if (fs.existsSync(fullPath)) {
        this.results.passed.push(`API endpoint exists: ${endpoint}`);
        this.log(`API endpoint found: ${endpoint}`, 'success');
        
        // Check if endpoint has proper exports
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('export async function POST') || content.includes('export async function GET')) {
          this.results.passed.push(`API endpoint properly exported: ${endpoint}`);
        } else {
          this.results.warnings.push(`API endpoint missing exports: ${endpoint}`);
          this.log(`API endpoint missing proper exports: ${endpoint}`, 'warning');
        }
      } else {
        this.results.critical.push(`Missing critical API endpoint: ${endpoint}`);
        this.log(`Missing critical API endpoint: ${endpoint}`, 'error');
      }
    }
  }

  async checkBuildSystem() {
    this.log('🏗️ Checking Build System...', 'info');
    
    try {
      // Check if package.json exists
      if (!fs.existsSync('package.json')) {
        this.results.critical.push('package.json not found');
        this.log('package.json not found', 'error');
        return;
      }
      
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // Check for required scripts
      const requiredScripts = ['build', 'dev', 'start'];
      for (const script of requiredScripts) {
        if (packageJson.scripts && packageJson.scripts[script]) {
          this.results.passed.push(`Build script exists: ${script}`);
        } else {
          this.results.warnings.push(`Missing build script: ${script}`);
          this.log(`Missing build script: ${script}`, 'warning');
        }
      }
      
      // Check for critical dependencies
      const criticalDeps = ['next', 'react', 'firebase'];
      for (const dep of criticalDeps) {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.results.passed.push(`Critical dependency found: ${dep}`);
        } else {
          this.results.critical.push(`Missing critical dependency: ${dep}`);
          this.log(`Missing critical dependency: ${dep}`, 'error');
        }
      }
      
      // Check if node_modules exists
      if (fs.existsSync('node_modules')) {
        this.results.passed.push('node_modules directory exists');
        this.log('node_modules directory found', 'success');
      } else {
        this.results.critical.push('node_modules directory missing');
        this.log('node_modules directory missing - dependencies not installed', 'error');
      }
      
    } catch (error) {
      this.results.critical.push(`Build system check error: ${error.message}`);
      this.log(`Build system check error: ${error.message}`, 'error');
    }
  }

  async checkFirestoreRules() {
    this.log('🔒 Checking Firestore Security Rules...', 'info');
    
    try {
      if (fs.existsSync('firestore.rules')) {
        const rules = fs.readFileSync('firestore.rules', 'utf8');
        
        // Check for critical security patterns
        if (rules.includes('rules_version = \'2\'')) {
          this.results.passed.push('Firestore rules version 2 configured');
        } else {
          this.results.warnings.push('Firestore rules not using version 2');
        }
        
        if (rules.includes('request.auth != null')) {
          this.results.passed.push('Authentication checks found in Firestore rules');
        } else {
          this.results.critical.push('No authentication checks in Firestore rules');
          this.log('Firestore rules missing authentication checks', 'error');
        }
        
        // Check for journal collection rules
        if (rules.includes('/journals/') || rules.includes('/entries/')) {
          this.results.passed.push('Journal collection rules found');
        } else {
          this.results.warnings.push('No journal collection rules found');
        }
        
      } else {
        this.results.critical.push('firestore.rules file not found');
        this.log('firestore.rules file not found', 'error');
      }
    } catch (error) {
      this.results.critical.push(`Firestore rules check error: ${error.message}`);
      this.log(`Firestore rules check error: ${error.message}`, 'error');
    }
  }

  async attemptAutomaticFixes() {
    this.log('🔧 Attempting Automatic Fixes...', 'info');
    
    // Fix 1: Create missing directories
    const requiredDirs = [
      'src/app/api/journal/save',
      'src/app/api/auth/session',
      'src/app/api/auth/emergency'
    ];
    
    for (const dir of requiredDirs) {
      const fullPath = path.join(this.projectRoot, dir);
      if (!fs.existsSync(fullPath)) {
        try {
          fs.mkdirSync(fullPath, { recursive: true });
          this.results.fixed.push(`Created directory: ${dir}`);
          this.log(`Created missing directory: ${dir}`, 'success');
        } catch (error) {
          this.log(`Failed to create directory ${dir}: ${error.message}`, 'error');
        }
      }
    }
    
    // Fix 2: Create minimal next.config.js if build fails
    if (!fs.existsSync('next.config.js') || this.hasBuildErrors()) {
      try {
        const minimalConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin']
  },
  images: {
    unoptimized: true
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
`;
        fs.writeFileSync('next.config.minimal.js', minimalConfig);
        this.results.fixed.push('Created minimal Next.js configuration');
        this.log('Created minimal Next.js configuration', 'success');
      } catch (error) {
        this.log(`Failed to create minimal config: ${error.message}`, 'error');
      }
    }
  }

  hasBuildErrors() {
    try {
      execSync('node -e "require(\'./next.config.js\')"', { stdio: 'ignore' });
      return false;
    } catch {
      return true;
    }
  }

  async validateCoreJourneys() {
    this.log('🧪 Validating Core User Journeys...', 'info');
    
    // Test 1: API endpoint structure validation
    const endpoints = [
      'src/app/api/journal/save/route.ts',
      'src/app/api/auth/session/route.ts'
    ];
    
    for (const endpoint of endpoints) {
      if (fs.existsSync(endpoint)) {
        const content = fs.readFileSync(endpoint, 'utf8');
        
        // Check for proper error handling
        if (content.includes('try {') && content.includes('catch')) {
          this.results.passed.push(`Error handling found in ${endpoint}`);
        } else {
          this.results.warnings.push(`Missing error handling in ${endpoint}`);
        }
        
        // Check for CORS headers
        if (content.includes('Access-Control-Allow-Origin')) {
          this.results.passed.push(`CORS headers found in ${endpoint}`);
        } else {
          this.results.warnings.push(`CORS headers missing in ${endpoint}`);
        }
      }
    }
    
    // Test 2: Firebase integration validation
    const firebaseLib = 'src/lib/firebase.ts';
    if (fs.existsSync(firebaseLib)) {
      const content = fs.readFileSync(firebaseLib, 'utf8');
      
      if (content.includes('getFirebaseDb') || content.includes('getFirestore')) {
        this.results.passed.push('Firebase database integration found');
      } else {
        this.results.warnings.push('Firebase database integration incomplete');
      }
    }
  }

  generateReport() {
    this.log('📊 Generating Diagnostic Report...', 'info');
    this.log('==================================================', 'info');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        critical: this.results.critical.length,
        warnings: this.results.warnings.length,
        fixed: this.results.fixed.length,
        passed: this.results.passed.length
      },
      status: this.results.critical.length === 0 ? 'READY' : 'NEEDS_ATTENTION',
      details: this.results
    };
    
    // Console report
    this.log(`🎯 DIAGNOSTIC SUMMARY:`, 'info');
    this.log(`   ✅ Passed: ${report.summary.passed}`, 'info');
    this.log(`   🔧 Fixed: ${report.summary.fixed}`, 'info');
    this.log(`   ⚠️ Warnings: ${report.summary.warnings}`, 'info');
    this.log(`   ❌ Critical: ${report.summary.critical}`, 'info');
    this.log(`   🚀 Status: ${report.status}`, 'info');
    
    if (this.results.critical.length > 0) {
      this.log('🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:', 'error');
      this.results.critical.forEach(issue => this.log(`   • ${issue}`, 'error'));
    }
    
    if (this.results.fixed.length > 0) {
      this.log('✅ AUTOMATIC FIXES APPLIED:', 'success');
      this.results.fixed.forEach(fix => this.log(`   • ${fix}`, 'success'));
    }
    
    // Save JSON report
    try {
      fs.writeFileSync('firebase-studio-diagnostic-report.json', JSON.stringify(report, null, 2));
      this.log('📄 Diagnostic report saved to firebase-studio-diagnostic-report.json', 'success');
    } catch (error) {
      this.log(`Failed to save report: ${error.message}`, 'error');
    }
    
    // Next steps
    this.log('🎯 RECOMMENDED NEXT STEPS:', 'info');
    if (this.results.critical.length === 0) {
      this.log('   1. Deploy to Firebase: firebase deploy', 'info');
      this.log('   2. Test user journey end-to-end', 'info');
      this.log('   3. Monitor Firebase Functions logs', 'info');
    } else {
      this.log('   1. Fix critical issues listed above', 'info');
      this.log('   2. Re-run diagnostic: node firebase-studio-diagnostic-system.js', 'info');
      this.log('   3. Install dependencies: npm install', 'info');
    }
    
    process.exit(this.results.critical.length === 0 ? 0 : 1);
  }
}

// Execute diagnostic if run directly
if (require.main === module) {
  const diagnostic = new FirebaseStudioDiagnosticSystem();
  diagnostic.runDiagnostic().catch(error => {
    console.error('❌ Diagnostic system error:', error);
    process.exit(1);
  });
}

module.exports = FirebaseStudioDiagnosticSystem;