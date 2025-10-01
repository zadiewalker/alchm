#!/usr/bin/env node

/**
 * 🎯 ALCHM Firebase Studio Master Diagnostic System
 * 
 * Orchestrates all diagnostic, healing, and monitoring systems for comprehensive
 * Firebase Studio compliance validation and automated optimization.
 * 
 * @version 3.0.0 - Production Ready
 * @author ALCHM Core Team
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const { performance } = require('perf_hooks');

class FirebaseStudioMasterDiagnostic {
  constructor() {
    this.startTime = performance.now();
    this.mode = this.parseArguments();
    this.results = {
      diagnostic: null,
      healing: null,
      monitoring: null,
      overall: null
    };
    
    this.log('🎯 Firebase Studio Master Diagnostic System initialized');
    this.log(`Mode: ${this.mode.name}`, 'info');
  }

  parseArguments() {
    const args = process.argv.slice(2);
    
    const modes = {
      'full': {
        name: 'Full Diagnostic Suite',
        description: 'Complete diagnostic, healing, and validation',
        runDiagnostic: true,
        runHealing: true,
        runMonitoring: false,
        autoFix: true
      },
      'diagnostic': {
        name: 'Diagnostic Only',
        description: 'Run comprehensive diagnostic analysis',
        runDiagnostic: true,
        runHealing: false,
        runMonitoring: false,
        autoFix: false
      },
      'heal': {
        name: 'Auto-Healing',
        description: 'Diagnostic + automated healing',
        runDiagnostic: true,
        runHealing: true,
        runMonitoring: false,
        autoFix: true
      },
      'monitor': {
        name: 'Continuous Monitoring',
        description: 'Start continuous monitoring system',
        runDiagnostic: false,
        runHealing: false,
        runMonitoring: true,
        autoFix: true
      },
      'pre-deploy': {
        name: 'Pre-Deployment Validation',
        description: 'Critical pre-deployment checks',
        runDiagnostic: true,
        runHealing: true,
        runMonitoring: false,
        autoFix: true,
        strict: true
      }
    };
    
    const modeArg = args.find(arg => !arg.startsWith('--')) || 'full';
    const mode = modes[modeArg] || modes['full'];
    
    // Parse additional flags
    mode.verbose = args.includes('--verbose');
    mode.dryRun = args.includes('--dry-run');
    mode.force = args.includes('--force');
    mode.skipBackup = args.includes('--skip-backup');
    
    return mode;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🎯',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'critical': '🚨',
      'step': '📋'
    }[level] || '🎯';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // 1. COMPREHENSIVE DIAGNOSTIC PHASE
  async runDiagnosticPhase() {
    if (!this.mode.runDiagnostic) return null;
    
    this.log('🔍 Starting Comprehensive Diagnostic Phase...', 'step');
    
    try {
      // Run the ultimate diagnostic system
      const diagnosticResult = await this.executeDiagnosticSystem();
      
      this.results.diagnostic = {
        status: 'completed',
        ...diagnosticResult
      };
      
      this.log(`✅ Diagnostic phase completed - Score: ${diagnosticResult.complianceScore}/100`, 'success');
      return this.results.diagnostic;
      
    } catch (error) {
      this.log(`❌ Diagnostic phase failed: ${error.message}`, 'error');
      this.results.diagnostic = {
        status: 'failed',
        error: error.message
      };
      
      if (this.mode.strict) {
        throw error;
      }
      
      return this.results.diagnostic;
    }
  }

  async executeDiagnosticSystem() {
    // Execute the ultimate diagnostic system
    return new Promise((resolve, reject) => {
      const args = ['node', 'scripts/ultimate-firebase-studio-diagnostic-system.js'];
      if (this.mode.autoFix) args.push('--auto-heal');
      if (this.mode.verbose) args.push('--verbose');
      
      const diagnosticProcess = spawn(args[0], args.slice(1), {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      let output = '';
      let errorOutput = '';
      
      diagnosticProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (this.mode.verbose) {
          process.stdout.write(data);
        }
      });
      
      diagnosticProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        if (this.mode.verbose) {
          process.stderr.write(data);
        }
      });
      
      diagnosticProcess.on('close', (code) => {
        if (code === 0) {
          resolve(this.parseDiagnosticOutput(output));
        } else {
          reject(new Error(`Diagnostic system failed with code ${code}: ${errorOutput}`));
        }
      });
      
      diagnosticProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  parseDiagnosticOutput(output) {
    // Parse the diagnostic output to extract results
    const lines = output.split('\n');
    let complianceScore = 0;
    let criticalIssues = 0;
    let warningIssues = 0;
    let fixesApplied = 0;
    
    for (const line of lines) {
      if (line.includes('Compliance:') && line.includes('/100')) {
        const match = line.match(/(\d+)\/100/);
        if (match) complianceScore = parseInt(match[1]);
      }
      
      if (line.includes('Critical Issues:')) {
        const match = line.match(/Critical Issues:\s*(\d+)/);
        if (match) criticalIssues = parseInt(match[1]);
      }
      
      if (line.includes('Warnings:')) {
        const match = line.match(/Warnings:\s*(\d+)/);
        if (match) warningIssues = parseInt(match[1]);
      }
      
      if (line.includes('Auto-fixes Applied:')) {
        const match = line.match(/Auto-fixes Applied:\s*(\d+)/);
        if (match) fixesApplied = parseInt(match[1]);
      }
    }
    
    return {
      complianceScore,
      criticalIssues,
      warningIssues,
      fixesApplied,
      output
    };
  }

  // 2. AUTO-HEALING PHASE
  async runHealingPhase() {
    if (!this.mode.runHealing) return null;
    
    this.log('🔧 Starting Auto-Healing Phase...', 'step');
    
    try {
      const healingResult = await this.executeHealingSystem();
      
      this.results.healing = {
        status: 'completed',
        ...healingResult
      };
      
      this.log(`✅ Healing phase completed - ${healingResult.successful}/${healingResult.totalActions} fixes applied`, 'success');
      return this.results.healing;
      
    } catch (error) {
      this.log(`❌ Healing phase failed: ${error.message}`, 'error');
      this.results.healing = {
        status: 'failed',
        error: error.message
      };
      
      if (this.mode.strict) {
        throw error;
      }
      
      return this.results.healing;
    }
  }

  async executeHealingSystem() {
    return new Promise((resolve, reject) => {
      const args = ['node', 'scripts/firebase-studio-auto-healer.js'];
      if (this.mode.dryRun) args.push('--dry-run');
      if (this.mode.verbose) args.push('--verbose');
      
      const healingProcess = spawn(args[0], args.slice(1), {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      let output = '';
      let errorOutput = '';
      
      healingProcess.stdout.on('data', (data) => {
        output += data.toString();
        if (this.mode.verbose) {
          process.stdout.write(data);
        }
      });
      
      healingProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        if (this.mode.verbose) {
          process.stderr.write(data);
        }
      });
      
      healingProcess.on('close', (code) => {
        if (code === 0 || code === null) {
          resolve(this.parseHealingOutput(output));
        } else {
          reject(new Error(`Healing system failed with code ${code}: ${errorOutput}`));
        }
      });
      
      healingProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  parseHealingOutput(output) {
    const lines = output.split('\n');
    let totalActions = 0;
    let successful = 0;
    let failed = 0;
    
    for (const line of lines) {
      if (line.includes('Total Actions:')) {
        const match = line.match(/Total Actions:\s*(\d+)/);
        if (match) totalActions = parseInt(match[1]);
      }
      
      if (line.includes('Successful:')) {
        const match = line.match(/Successful:\s*(\d+)/);
        if (match) successful = parseInt(match[1]);
      }
      
      if (line.includes('Failed:')) {
        const match = line.match(/Failed:\s*(\d+)/);
        if (match) failed = parseInt(match[1]);
      }
    }
    
    return {
      totalActions,
      successful,
      failed,
      output
    };
  }

  // 3. FIREBASE STUDIO READINESS CHECK
  async checkFirebaseStudioReadiness() {
    this.log('🚀 Checking Firebase Studio deployment readiness...', 'step');
    
    const readinessChecks = [
      { name: 'Bundle Size', check: () => this.checkBundleSize() },
      { name: 'Build Process', check: () => this.checkBuildProcess() },
      { name: 'Firebase Config', check: () => this.checkFirebaseConfig() },
      { name: 'Environment Variables', check: () => this.checkEnvironmentVariables() }
    ];
    
    const results = [];
    let readyForDeployment = true;
    
    for (const checkItem of readinessChecks) {
      try {
        const result = await checkItem.check();
        results.push({
          name: checkItem.name,
          status: 'passed',
          result
        });
        this.log(`✅ ${checkItem.name} check passed`, 'success');
      } catch (error) {
        results.push({
          name: checkItem.name,
          status: 'failed',
          error: error.message
        });
        this.log(`❌ ${checkItem.name} check failed: ${error.message}`, 'error');
        readyForDeployment = false;
      }
    }
    
    return {
      readyForDeployment,
      checks: results,
      timestamp: new Date().toISOString()
    };
  }

  async checkBundleSize() {
    try {
      // Quick build to check bundle size
      const buildOutput = execSync('npm run build 2>&1', { encoding: 'utf8', timeout: 300000 });
      
      // Parse bundle size from output
      const bundleInfo = this.parseBuildOutput(buildOutput);
      const limitMB = 2; // Firebase Studio limit
      const sizeMB = bundleInfo.totalSize / 1024 / 1024;
      
      if (sizeMB > limitMB) {
        throw new Error(`Bundle size ${sizeMB.toFixed(2)}MB exceeds Firebase Studio limit of ${limitMB}MB`);
      }
      
      return { sizeMB, limitMB, status: 'within_limits' };
    } catch (error) {
      throw new Error(`Bundle size check failed: ${error.message}`);
    }
  }

  async checkBuildProcess() {
    try {
      // Test build process
      execSync('npm run build', { stdio: 'pipe', timeout: 300000 });
      return { status: 'build_successful' };
    } catch (error) {
      throw new Error(`Build process failed: ${error.message}`);
    }
  }

  async checkFirebaseConfig() {
    const requiredFiles = ['firebase.json'];
    
    for (const file of requiredFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Required Firebase file missing: ${file}`);
      }
    }
    
    // Validate firebase.json
    try {
      const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
      if (!firebaseConfig.hosting) {
        throw new Error('Firebase configuration missing hosting setup');
      }
    } catch (error) {
      throw new Error(`Firebase configuration invalid: ${error.message}`);
    }
    
    return { status: 'configuration_valid' };
  }

  async checkEnvironmentVariables() {
    const required = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    
    const missing = required.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      throw new Error(`Missing environment variables: ${missing.join(', ')}`);
    }
    
    return { status: 'environment_complete' };
  }

  parseBuildOutput(output) {
    const bundleInfo = { totalSize: 0, firstLoadJS: 0, assets: [] };
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes('.js') && line.includes('kB')) {
        const match = line.match(/(\d+(?:\.\d+)?)\s*kB/);
        if (match) {
          bundleInfo.totalSize += parseFloat(match[1]) * 1024;
        }
      }
    }
    
    return bundleInfo;
  }

  // 4. COMPREHENSIVE REPORTING
  generateComprehensiveReport() {
    const endTime = performance.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        duration: `${duration}s`,
        mode: this.mode,
        version: '3.0.0'
      },
      phases: {
        diagnostic: this.results.diagnostic,
        healing: this.results.healing,
        monitoring: this.results.monitoring
      },
      readiness: this.results.readiness,
      summary: this.generateSummary(),
      recommendations: this.generateRecommendations()
    };
    
    // Save comprehensive report
    fs.mkdirSync('diagnostic-reports', { recursive: true });
    const reportPath = `diagnostic-reports/master-diagnostic-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate executive summary
    this.generateExecutiveSummary(report, reportPath);
    
    return report;
  }

  generateSummary() {
    const summary = {
      overallStatus: 'unknown',
      firebaseStudioReady: false,
      criticalIssues: 0,
      warningIssues: 0,
      fixesApplied: 0,
      complianceScore: null
    };
    
    // Aggregate from diagnostic results
    if (this.results.diagnostic && this.results.diagnostic.status === 'completed') {
      summary.criticalIssues = this.results.diagnostic.criticalIssues || 0;
      summary.warningIssues = this.results.diagnostic.warningIssues || 0;
      summary.complianceScore = this.results.diagnostic.complianceScore;
    }
    
    // Aggregate from healing results
    if (this.results.healing && this.results.healing.status === 'completed') {
      summary.fixesApplied = this.results.healing.successful || 0;
    }
    
    // Aggregate from readiness check
    if (this.results.readiness) {
      summary.firebaseStudioReady = this.results.readiness.readyForDeployment;
    }
    
    // Determine overall status
    if (summary.criticalIssues === 0 && summary.complianceScore >= 90) {
      summary.overallStatus = 'excellent';
    } else if (summary.criticalIssues === 0 && summary.complianceScore >= 80) {
      summary.overallStatus = 'good';
    } else if (summary.criticalIssues === 0) {
      summary.overallStatus = 'needs_improvement';
    } else {
      summary.overallStatus = 'critical_issues';
    }
    
    return summary;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Based on diagnostic results
    if (this.results.diagnostic?.criticalIssues > 0) {
      recommendations.push({
        priority: 'high',
        category: 'critical_fixes',
        title: 'Resolve Critical Issues',
        description: `Address ${this.results.diagnostic.criticalIssues} critical issues before deployment`,
        action: 'Run auto-healer or manually fix critical issues'
      });
    }
    
    // Based on compliance score
    const score = this.results.diagnostic?.complianceScore;
    if (score && score < 90) {
      recommendations.push({
        priority: 'medium',
        category: 'optimization',
        title: 'Improve Compliance Score',
        description: `Current score: ${score}/100. Target: 90+`,
        action: 'Address remaining warnings and optimize bundle size'
      });
    }
    
    // Based on readiness check
    if (this.results.readiness && !this.results.readiness.readyForDeployment) {
      recommendations.push({
        priority: 'high',
        category: 'deployment_blocker',
        title: 'Deployment Readiness Issues',
        description: 'Critical deployment checks failed',
        action: 'Review readiness check failures and fix blocking issues'
      });
    }
    
    return recommendations;
  }

  generateExecutiveSummary(report, reportPath) {
    const summary = report.summary;
    const statusEmoji = {
      'excellent': '🎉',
      'good': '✅',
      'needs_improvement': '⚠️',
      'critical_issues': '🚨',
      'unknown': '❓'
    }[summary.overallStatus];
    
    const executiveSummary = `
🎯 ALCHM Firebase Studio Master Diagnostic Report
===============================================

${statusEmoji} EXECUTIVE SUMMARY
- Overall Status: ${summary.overallStatus.toUpperCase()}
- Firebase Studio Ready: ${summary.firebaseStudioReady ? '✅ YES' : '❌ NO'}
- Compliance Score: ${summary.complianceScore || 'N/A'}/100
- Duration: ${report.metadata.duration}

📊 ISSUES SUMMARY
- Critical Issues: ${summary.criticalIssues}
- Warning Issues: ${summary.warningIssues}
- Fixes Applied: ${summary.fixesApplied}

${summary.firebaseStudioReady ? 
  '🚀 DEPLOYMENT STATUS: READY FOR FIREBASE STUDIO' : 
  '🚨 DEPLOYMENT STATUS: BLOCKED - CRITICAL ISSUES MUST BE RESOLVED'}

📋 PHASES COMPLETED
${report.phases.diagnostic ? `✅ Diagnostic Analysis` : '⏭️ Diagnostic Analysis (Skipped)'}
${report.phases.healing ? `✅ Auto-Healing Process` : '⏭️ Auto-Healing Process (Skipped)'}
${report.phases.monitoring ? `✅ Continuous Monitoring` : '⏭️ Continuous Monitoring (Skipped)'}

🎯 TOP RECOMMENDATIONS
${report.recommendations.slice(0, 3).map((rec, i) => 
  `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}\n   ${rec.description}`
).join('\n') || 'No recommendations - system is optimized!'}

📄 DETAILED REPORTS
- Comprehensive Report: ${reportPath}
- Mode: ${report.metadata.mode.name}
- System Version: ${report.metadata.version}

${summary.firebaseStudioReady ? 
  '🎉 READY TO DEPLOY: All systems optimized for Firebase Studio!' :
  '⚠️  ACTION REQUIRED: Address critical issues before deployment'}

Generated: ${report.metadata.timestamp}
`;
    
    const summaryPath = 'FIREBASE_STUDIO_MASTER_DIAGNOSTIC_SUMMARY.md';
    fs.writeFileSync(summaryPath, executiveSummary);
    console.log(executiveSummary);
    
    this.log(`📄 Executive summary saved to: ${summaryPath}`, 'success');
    this.log(`📋 Detailed report saved to: ${reportPath}`, 'success');
  }

  // MAIN EXECUTION
  async execute() {
    this.log('🚀 Starting Firebase Studio Master Diagnostic System...', 'success');
    this.log(`Selected mode: ${this.mode.description}`, 'info');
    
    try {
      // Phase 1: Diagnostic Analysis
      this.results.diagnostic = await this.runDiagnosticPhase();
      
      // Phase 2: Auto-Healing (if enabled)
      this.results.healing = await this.runHealingPhase();
      
      // Phase 3: Firebase Studio Readiness Check
      this.results.readiness = await this.checkFirebaseStudioReadiness();
      
      // Phase 4: Generate Comprehensive Report
      const report = this.generateComprehensiveReport();
      
      // Determine exit code based on results
      const exitCode = this.determineExitCode(report);
      
      this.log(`🎯 Master diagnostic completed with exit code: ${exitCode}`, 'success');
      process.exit(exitCode);
      
    } catch (error) {
      this.log(`💥 Master diagnostic failed: ${error.message}`, 'critical');
      console.error('Full error:', error);
      
      // Generate error report
      this.generateErrorReport(error);
      
      process.exit(1);
    }
  }

  determineExitCode(report) {
    const summary = report.summary;
    
    if (summary.overallStatus === 'critical_issues') {
      return 1; // Critical issues - deployment blocked
    }
    
    if (!summary.firebaseStudioReady) {
      return 1; // Not ready for deployment
    }
    
    if (summary.overallStatus === 'excellent' || summary.overallStatus === 'good') {
      return 0; // Success - ready for deployment
    }
    
    if (this.mode.strict) {
      return 1; // In strict mode, anything less than good fails
    }
    
    return 0; // Non-strict mode allows warnings
  }

  generateErrorReport(error) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack
      },
      mode: this.mode,
      partialResults: this.results,
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        memory: process.memoryUsage()
      }
    };
    
    fs.mkdirSync('diagnostic-reports', { recursive: true });
    fs.writeFileSync(
      `diagnostic-reports/error-report-${Date.now()}.json`,
      JSON.stringify(errorReport, null, 2)
    );
    
    this.log('Error report generated', 'info');
  }
}

// CLI Help
function showHelp() {
  console.log(`
🎯 ALCHM Firebase Studio Master Diagnostic System

USAGE:
  node firebase-studio-master-diagnostic.js [mode] [options]

MODES:
  full        Complete diagnostic, healing, and validation (default)
  diagnostic  Run diagnostic analysis only
  heal        Run diagnostic + automated healing
  monitor     Start continuous monitoring system
  pre-deploy  Critical pre-deployment validation (strict mode)

OPTIONS:
  --verbose      Show detailed output
  --dry-run      Show what would be done without making changes
  --force        Force execution even with warnings
  --skip-backup  Skip creating backups during healing
  --help         Show this help message

EXAMPLES:
  node firebase-studio-master-diagnostic.js full --verbose
  node firebase-studio-master-diagnostic.js heal --dry-run
  node firebase-studio-master-diagnostic.js pre-deploy --force

For more information, see the generated reports in diagnostic-reports/
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const masterDiagnostic = new FirebaseStudioMasterDiagnostic();
  masterDiagnostic.execute().catch(error => {
    console.error('💥 Fatal error in master diagnostic:', error);
    process.exit(1);
  });
}

module.exports = FirebaseStudioMasterDiagnostic;