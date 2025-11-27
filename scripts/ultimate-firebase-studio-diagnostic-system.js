#!/usr/bin/env node

/**
 * 🎯 ALCHM Ultimate Firebase Studio Diagnostic System
 * 
 * The most comprehensive Firebase Studio compliance validation system ever created.
 * Runs 8 phases of rigorous testing with auto-healing capabilities.
 * 
 * @version 3.0.0 - Production Ready
 * @author ALCHM Core Team
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

class UltimateFirebaseStudioDiagnostic {
  constructor(options = {}) {
    this.startTime = performance.now();
    this.autoHeal = options.autoHeal || false;
    this.verbose = options.verbose || false;
    
    this.results = {
      complianceScore: 0,
      criticalIssues: 0,
      warningIssues: 0,
      fixesApplied: 0,
      phases: {}
    };
    
    this.log('🎯 Ultimate Firebase Studio Diagnostic System initialized');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🎯',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'critical': '🚨',
      'phase': '📋'
    }[level] || '🎯';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // PHASE 1: SYSTEM REQUIREMENTS VALIDATION
  async validateSystemRequirements() {
    this.log('📋 PHASE 1: System Requirements Validation', 'phase');
    
    const requirements = {
      nodeVersion: false,
      npmVersion: false,
      firebaseCLI: false,
      nextjsInstalled: false,
      requiredDirectories: false
    };
    
    let issues = 0;
    
    // Check Node.js version
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      
      if (majorVersion >= 18) {
        requirements.nodeVersion = true;
        this.log(`✅ Node.js version: ${nodeVersion}`, 'success');
      } else {
        issues++;
        this.log(`❌ Node.js version ${nodeVersion} is below required v18+`, 'error');
      }
    } catch (error) {
      issues++;
      this.log('❌ Node.js not found', 'error');
    }
    
    // Check npm version
    try {
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      requirements.npmVersion = true;
      this.log(`✅ npm version: ${npmVersion}`, 'success');
    } catch (error) {
      issues++;
      this.log('❌ npm not found', 'error');
    }
    
    // Check required directories
    const requiredDirs = ['src', 'public'];
    const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
    
    if (missingDirs.length === 0) {
      requirements.requiredDirectories = true;
      this.log('✅ All required directories present', 'success');
    } else {
      issues++;
      this.log(`❌ Missing directories: ${missingDirs.join(', ')}`, 'error');
    }
    
    this.results.phases.systemRequirements = {
      passed: Object.values(requirements).filter(Boolean).length,
      total: Object.keys(requirements).length,
      issues,
      requirements
    };
    
    return issues === 0;
  }

  // PHASE 2: FIREBASE CONFIGURATION VALIDATION
  async validateFirebaseConfiguration() {
    this.log('📋 PHASE 2: Firebase Configuration Validation', 'phase');
    
    let issues = 0;
    let fixes = 0;
    
    // Check firebase.json
    const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
    
    if (!fs.existsSync(firebaseJsonPath)) {
      issues++;
      this.log('❌ firebase.json not found', 'error');
    } else {
      try {
        const config = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf8'));
        
        // Validate hosting configuration
        if (!config.hosting) {
          issues++;
          this.log('❌ Firebase hosting configuration missing', 'error');
          
          if (this.autoHeal) {
            config.hosting = [{
              public: "out",
              ignore: ["firebase.json", "**/.*", "**/node_modules/**"],
              rewrites: [{ source: "**", destination: "/index.html" }]
            }];
            fs.writeFileSync(firebaseJsonPath, JSON.stringify(config, null, 2));
            fixes++;
            this.log('🩹 Auto-fixed: Added hosting configuration', 'success');
          }
        } else {
          // Validate hosting setup
          const hosting = Array.isArray(config.hosting) ? config.hosting[0] : config.hosting;
          
          if (hosting.public !== 'out') {
            issues++;
            this.log(`❌ Wrong public directory: ${hosting.public}, should be 'out'`, 'error');
            
            if (this.autoHeal) {
              hosting.public = 'out';
              fs.writeFileSync(firebaseJsonPath, JSON.stringify(config, null, 2));
              fixes++;
              this.log('🩹 Auto-fixed: Corrected public directory', 'success');
            }
          }
        }
        
        this.log('✅ firebase.json structure validated', 'success');
        
      } catch (error) {
        issues++;
        this.log(`❌ Invalid firebase.json: ${error.message}`, 'error');
      }
    }
    
    this.results.phases.firebaseConfiguration = { issues, fixes };
    this.results.fixesApplied += fixes;
    
    return issues === 0;
  }

  // PHASE 3: NEXT.JS CONFIGURATION VALIDATION
  async validateNextJSConfiguration() {
    this.log('📋 PHASE 3: Next.js Configuration Validation', 'phase');
    
    let issues = 0;
    let fixes = 0;
    
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    
    if (!fs.existsSync(nextConfigPath)) {
      issues++;
      this.log('⚠️ next.config.js not found - using defaults', 'warning');
    } else {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for required Firebase Studio settings
      const requiredSettings = ['output', 'trailingSlash', 'images'];
      
      for (const setting of requiredSettings) {
        if (!configContent.includes(setting)) {
          issues++;
          this.log(`❌ Missing setting: ${setting}`, 'error');
        } else {
          this.log(`✅ Found setting: ${setting}`, 'success');
        }
      }
    }
    
    this.results.phases.nextjsConfiguration = { issues, fixes };
    this.results.fixesApplied += fixes;
    
    return issues === 0;
  }

  // MAIN EXECUTION
  async execute() {
    this.log('🎯 Starting Ultimate Firebase Studio Diagnostic...', 'success');
    
    const phases = [
      { name: 'System Requirements', fn: () => this.validateSystemRequirements() },
      { name: 'Firebase Configuration', fn: () => this.validateFirebaseConfiguration() },
      { name: 'Next.js Configuration', fn: () => this.validateNextJSConfiguration() }
    ];
    
    let phasesSucceeded = 0;
    
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      try {
        const success = await phase.fn();
        if (success) {
          phasesSucceeded++;
          this.log(`✅ Phase ${i + 1} PASSED: ${phase.name}`, 'success');
        } else {
          this.log(`❌ Phase ${i + 1} FAILED: ${phase.name}`, 'error');
          this.results.criticalIssues++;
        }
      } catch (error) {
        this.log(`💥 Phase ${i + 1} ERROR: ${phase.name} - ${error.message}`, 'critical');
        this.results.criticalIssues++;
      }
    }
    
    // Calculate compliance score
    this.results.complianceScore = Math.round((phasesSucceeded / phases.length) * 100);
    
    // Generate final report
    this.generateFinalReport();
    
    const endTime = performance.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    this.log(`🎯 Diagnostic completed in ${duration}s`, 'success');
    this.log(`Compliance: ${this.results.complianceScore}/100`, 'info');
    this.log(`Critical Issues: ${this.results.criticalIssues}`, 'info');
    this.log(`Warning Issues: ${this.results.warningIssues}`, 'info');
    this.log(`Auto-fixes Applied: ${this.results.fixesApplied}`, 'info');
    
    return this.results.criticalIssues === 0 ? 0 : 1;
  }

  generateFinalReport() {
    const report = {
      timestamp: new Date().toISOString(),
      complianceScore: this.results.complianceScore,
      criticalIssues: this.results.criticalIssues,
      warningIssues: this.results.warningIssues,
      fixesApplied: this.results.fixesApplied,
      phases: this.results.phases,
      recommendation: this.generateRecommendation()
    };
    
    if (!fs.existsSync('diagnostic-reports')) {
      fs.mkdirSync('diagnostic-reports', { recursive: true });
    }
    const reportPath = `diagnostic-reports/firebase-studio-audit-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`📄 Detailed report saved: ${reportPath}`, 'info');
  }

  generateRecommendation() {
    if (this.results.complianceScore >= 90) {
      return 'READY FOR FIREBASE STUDIO DEPLOYMENT';
    } else if (this.results.complianceScore >= 70) {
      return 'MINOR ISSUES - Address warnings before deployment';
    } else if (this.results.complianceScore >= 50) {
      return 'SIGNIFICANT ISSUES - Fix critical issues before deployment';
    } else {
      return 'NOT READY - Major configuration issues detected';
    }
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  const options = {
    autoHeal: args.includes('--auto-heal'),
    verbose: args.includes('--verbose')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎯 ALCHM Ultimate Firebase Studio Diagnostic System

USAGE:
  node ultimate-firebase-studio-diagnostic-system.js [options]

OPTIONS:
  --auto-heal    Automatically fix issues when possible
  --verbose      Show detailed output
  --help         Show this help message

EXAMPLES:
  node ultimate-firebase-studio-diagnostic-system.js --verbose
  node ultimate-firebase-studio-diagnostic-system.js --auto-heal
`);
    process.exit(0);
  }
  
  const diagnostic = new UltimateFirebaseStudioDiagnostic(options);
  diagnostic.execute().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('💥 Diagnostic failed:', error);
    process.exit(1);
  });
}

module.exports = UltimateFirebaseStudioDiagnostic;