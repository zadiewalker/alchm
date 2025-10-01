#!/usr/bin/env node

/**
 * 🔗 ALCHM Firebase Studio Integrated Performance System
 * 
 * Orchestrates the Firebase Studio diagnostic system with the Performance Guardian
 * to provide comprehensive monitoring for trauma-informed deployment excellence.
 * 
 * Integration Features:
 * - Real-time performance monitoring during Firebase Studio builds
 * - Automatic performance healing during diagnostic phases
 * - Predictive performance analytics for deployment readiness
 * - Crisis-critical performance validation
 * - Mobile trauma-informed optimization validation
 * 
 * @version 1.0.0 - Production Integration
 * @author ALCHM Performance Team
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');
const { performance } = require('perf_hooks');

// Import the Firebase Studio Master Diagnostic
const FirebaseStudioMasterDiagnostic = require('./firebase-studio-master-diagnostic.js');

// Import the Performance Guardian
const ALCHMPerformanceGuardian = require('./firebase-studio-performance-guardian.js');

class IntegratedPerformanceSystem {
  constructor() {
    this.startTime = performance.now();
    this.mode = this.parseArguments();
    this.results = {
      diagnostic: null,
      performance: null,
      integration: null,
      deployment: null
    };
    
    this.log('🔗 ALCHM Integrated Performance System initialized', 'success');
    this.log(`Mode: ${this.mode.name}`, 'info');
  }

  parseArguments() {
    const args = process.argv.slice(2);
    
    const modes = {
      'production-ready': {
        name: 'Production Readiness Validation',
        description: 'Complete validation for production deployment',
        runDiagnostic: true,
        runPerformance: true,
        runIntegration: true,
        runDeploymentValidation: true,
        performanceMode: 'comprehensive',
        diagnosticMode: 'pre-deploy',
        strictValidation: true,
        autoHealing: true
      },
      'crisis-validation': {
        name: 'Crisis Support Validation',
        description: 'Validate crisis support system performance',
        runDiagnostic: true,
        runPerformance: true,
        runIntegration: true,
        runDeploymentValidation: false,
        performanceMode: 'crisis-focused',
        diagnosticMode: 'full',
        strictValidation: true,
        autoHealing: true
      },
      'continuous-monitoring': {
        name: 'Continuous Performance Monitoring',
        description: 'Real-time monitoring during development',
        runDiagnostic: false,
        runPerformance: true,
        runIntegration: true,
        runDeploymentValidation: false,
        performanceMode: 'monitoring',
        diagnosticMode: 'diagnostic',
        strictValidation: false,
        autoHealing: false
      },
      'emergency-optimization': {
        name: 'Emergency Performance Optimization',
        description: 'Emergency performance healing and optimization',
        runDiagnostic: true,
        runPerformance: true,
        runIntegration: true,
        runDeploymentValidation: true,
        performanceMode: 'healing',
        diagnosticMode: 'heal',
        strictValidation: true,
        autoHealing: true,
        emergencyMode: true
      },
      'firebase-studio-deploy': {
        name: 'Firebase Studio Deployment Preparation',
        description: 'Comprehensive preparation for Firebase Studio deployment',
        runDiagnostic: true,
        runPerformance: true,
        runIntegration: true,
        runDeploymentValidation: true,
        performanceMode: 'comprehensive',
        diagnosticMode: 'pre-deploy',
        strictValidation: true,
        autoHealing: true,
        bundleOptimization: true
      }
    };
    
    const modeArg = args.find(arg => !arg.startsWith('--')) || 'production-ready';
    const mode = modes[modeArg] || modes['production-ready'];
    
    // Parse additional flags
    mode.verbose = args.includes('--verbose');
    mode.dryRun = args.includes('--dry-run');
    mode.skipBackup = args.includes('--skip-backup');
    mode.forceHealing = args.includes('--force-healing');
    mode.generateReport = !args.includes('--no-report');
    mode.parallel = args.includes('--parallel');
    
    return mode;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'info': '🔗',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'critical': '🚨',
      'integration': '🔄',
      'performance': '📊',
      'diagnostic': '🔍'
    }[level] || '🔗';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // 1. INTEGRATED DIAGNOSTIC AND PERFORMANCE ANALYSIS
  async runIntegratedAnalysis() {
    this.log('🔄 Starting integrated diagnostic and performance analysis...', 'integration');
    
    try {
      if (this.mode.parallel) {
        // Run diagnostic and performance analysis in parallel
        const [diagnosticResult, performanceResult] = await Promise.all([
          this.runDiagnosticAnalysis(),
          this.runPerformanceAnalysis()
        ]);
        
        this.results.diagnostic = diagnosticResult;
        this.results.performance = performanceResult;
      } else {
        // Run diagnostic first, then performance (allows for optimization between phases)
        this.results.diagnostic = await this.runDiagnosticAnalysis();
        
        // Apply diagnostic healing before performance analysis
        if (this.mode.autoHealing && this.results.diagnostic?.healing?.successful > 0) {
          this.log('🔧 Applying diagnostic healing before performance analysis...', 'integration');
          await this.waitForHealingStabilization();
        }
        
        this.results.performance = await this.runPerformanceAnalysis();
      }
      
      // Cross-validate results
      this.results.integration = await this.crossValidateResults();
      
      this.log('✅ Integrated analysis completed successfully', 'success');
      return {
        diagnostic: this.results.diagnostic,
        performance: this.results.performance,
        integration: this.results.integration
      };
      
    } catch (error) {
      this.log(`❌ Integrated analysis failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async runDiagnosticAnalysis() {
    if (!this.mode.runDiagnostic) return null;
    
    this.log('🔍 Running Firebase Studio diagnostic analysis...', 'diagnostic');
    
    try {
      const diagnosticArgs = [this.mode.diagnosticMode];
      if (this.mode.verbose) diagnosticArgs.push('--verbose');
      if (this.mode.dryRun) diagnosticArgs.push('--dry-run');
      if (this.mode.skipBackup) diagnosticArgs.push('--skip-backup');
      
      const diagnosticResult = await this.executeScript(
        'scripts/firebase-studio-master-diagnostic.js',
        diagnosticArgs
      );
      
      return this.parseDiagnosticResult(diagnosticResult);
    } catch (error) {
      throw new Error(`Diagnostic analysis failed: ${error.message}`);
    }
  }

  async runPerformanceAnalysis() {
    if (!this.mode.runPerformance) return null;
    
    this.log('📊 Running performance guardian analysis...', 'performance');
    
    try {
      const performanceArgs = [this.mode.performanceMode];
      if (this.mode.verbose) performanceArgs.push('--verbose');
      if (this.mode.dryRun) performanceArgs.push('--dry-run');
      if (this.mode.emergencyMode) performanceArgs.push('--emergency');
      if (!this.mode.generateReport) performanceArgs.push('--no-report');
      
      const performanceResult = await this.executeScript(
        'scripts/firebase-studio-performance-guardian.js',
        performanceArgs
      );
      
      return this.parsePerformanceResult(performanceResult);
    } catch (error) {
      throw new Error(`Performance analysis failed: ${error.message}`);
    }
  }

  async executeScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      const fullArgs = ['node', scriptPath, ...args];
      
      const process = spawn(fullArgs[0], fullArgs.slice(1), {
        stdio: 'pipe',
        cwd: process.cwd()
      });
      
      let output = '';
      let errorOutput = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
        if (this.mode.verbose) {
          process.stdout.write(data);
        }
      });
      
      process.stderr.on('data', (data) => {
        errorOutput += data.toString();
        if (this.mode.verbose) {
          process.stderr.write(data);
        }
      });
      
      process.on('close', (code) => {
        if (code === 0 || code === null) {
          resolve({ output, errorOutput, exitCode: code });
        } else {
          reject(new Error(`Script failed with code ${code}: ${errorOutput}`));
        }
      });
      
      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  parseDiagnosticResult(result) {
    // Parse diagnostic output to extract key metrics
    const lines = result.output.split('\n');
    
    let complianceScore = null;
    let criticalIssues = 0;
    let fixesApplied = 0;
    let readyForDeployment = false;
    
    for (const line of lines) {
      if (line.includes('Compliance Score:')) {
        const match = line.match(/(\d+)\/100/);
        if (match) complianceScore = parseInt(match[1]);
      }
      
      if (line.includes('Critical Issues:')) {
        const match = line.match(/(\d+)/);
        if (match) criticalIssues = parseInt(match[1]);
      }
      
      if (line.includes('Fixes Applied:')) {
        const match = line.match(/(\d+)/);
        if (match) fixesApplied = parseInt(match[1]);
      }
      
      if (line.includes('READY FOR DEPLOYMENT') || line.includes('READY TO DEPLOY')) {
        readyForDeployment = true;
      }
    }
    
    return {
      complianceScore,
      criticalIssues,
      fixesApplied,
      readyForDeployment,
      output: result.output,
      exitCode: result.exitCode
    };
  }

  parsePerformanceResult(result) {
    // Parse performance output to extract key metrics
    const lines = result.output.split('\n');
    
    let overallScore = null;
    let crisisReadiness = null;
    let criticalAlerts = 0;
    let optimizationsApplied = 0;
    
    for (const line of lines) {
      if (line.includes('Overall Performance Score:')) {
        const match = line.match(/(\d+(?:\.\d+)?)\/100/);
        if (match) overallScore = parseFloat(match[1]);
      }
      
      if (line.includes('Crisis Readiness:')) {
        const match = line.match(/Crisis Readiness:\s*(\w+)/);
        if (match) crisisReadiness = match[1].toLowerCase();
      }
      
      if (line.includes('Critical Alerts:')) {
        const match = line.match(/(\d+)/);
        if (match) criticalAlerts = parseInt(match[1]);
      }
      
      if (line.includes('optimizations applied')) {
        const match = line.match(/(\d+)\/\d+\s*optimizations applied/);
        if (match) optimizationsApplied = parseInt(match[1]);
      }
    }
    
    return {
      overallScore,
      crisisReadiness,
      criticalAlerts,
      optimizationsApplied,
      output: result.output,
      exitCode: result.exitCode
    };
  }

  async crossValidateResults() {
    this.log('🔄 Cross-validating diagnostic and performance results...', 'integration');
    
    const validation = {
      consistency: true,
      conflicts: [],
      recommendations: [],
      overallReadiness: 'unknown'
    };
    
    // Check for conflicts between diagnostic and performance results
    if (this.results.diagnostic?.readyForDeployment && this.results.performance?.criticalAlerts > 0) {
      validation.consistency = false;
      validation.conflicts.push({
        type: 'deployment_readiness_conflict',
        description: 'Diagnostic says ready but performance has critical alerts',
        severity: 'high'
      });
    }
    
    if (this.results.diagnostic?.criticalIssues === 0 && this.results.performance?.crisisReadiness === 'critical_issues') {
      validation.consistency = false;
      validation.conflicts.push({
        type: 'crisis_readiness_conflict',
        description: 'No diagnostic issues but crisis performance is critical',
        severity: 'critical'
      });
    }
    
    // Generate integrated recommendations
    validation.recommendations = this.generateIntegratedRecommendations();
    
    // Determine overall readiness
    validation.overallReadiness = this.determineOverallReadiness();
    
    return validation;
  }

  generateIntegratedRecommendations() {
    const recommendations = [];
    
    // Firebase Studio deployment recommendations
    if (this.results.diagnostic?.complianceScore < 90 || this.results.performance?.overallScore < 85) {
      recommendations.push({
        category: 'deployment_optimization',
        priority: 'high',
        title: 'Optimize for Firebase Studio Deployment',
        description: 'Both diagnostic and performance scores need improvement for optimal deployment',
        actions: [
          'Address remaining diagnostic compliance issues',
          'Optimize performance for crisis user scenarios',
          'Validate bundle size compliance with Firebase Studio limits'
        ]
      });
    }
    
    // Crisis support system recommendations
    if (this.results.performance?.crisisReadiness !== 'excellent' && this.results.performance?.crisisReadiness !== 'good') {
      recommendations.push({
        category: 'crisis_support',
        priority: 'critical',
        title: 'Critical Crisis Support Optimization Required',
        description: 'Crisis support system performance is below acceptable levels',
        actions: [
          'Optimize crisis button response times to <100ms',
          'Preload emergency resources for instant access',
          'Implement emergency mode performance monitoring',
          'Test crisis scenarios under network stress'
        ]
      });
    }
    
    // Memory and resource optimization
    if (this.results.performance?.overallScore < 80) {
      recommendations.push({
        category: 'resource_optimization',
        priority: 'medium',
        title: 'Resource Optimization for Sustained Performance',
        description: 'Memory and resource usage needs optimization for long-term stability',
        actions: [
          'Implement memory leak prevention measures',
          'Optimize garbage collection patterns',
          'Add resource usage monitoring alerts',
          'Test performance under extended usage scenarios'
        ]
      });
    }
    
    return recommendations;
  }

  determineOverallReadiness() {
    // Combine diagnostic and performance readiness
    const diagnosticReady = this.results.diagnostic?.readyForDeployment || false;
    const performanceReady = this.results.performance?.crisisReadiness === 'excellent' || this.results.performance?.crisisReadiness === 'good';
    const noCriticalAlerts = (this.results.performance?.criticalAlerts || 0) === 0;
    const noCriticalIssues = (this.results.diagnostic?.criticalIssues || 0) === 0;
    
    if (diagnosticReady && performanceReady && noCriticalAlerts && noCriticalIssues) {
      return 'production_ready';
    } else if (noCriticalIssues && noCriticalAlerts) {
      return 'needs_optimization';
    } else {
      return 'critical_issues';
    }
  }

  async waitForHealingStabilization() {
    // Wait for system to stabilize after healing actions
    this.log('⏳ Waiting for system stabilization after healing...', 'integration');
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second stabilization
  }

  // 2. FIREBASE STUDIO DEPLOYMENT VALIDATION
  async runFirebaseStudioDeploymentValidation() {
    if (!this.mode.runDeploymentValidation) return null;
    
    this.log('🚀 Running Firebase Studio deployment validation...', 'integration');
    
    try {
      const validation = {
        buildValidation: await this.validateBuildForFirebaseStudio(),
        performanceValidation: await this.validatePerformanceForDeployment(),
        complianceValidation: await this.validateComplianceForDeployment(),
        crisisValidation: await this.validateCrisisReadinessForDeployment()
      };
      
      validation.overallValidation = this.determineDeploymentReadiness(validation);
      
      this.results.deployment = validation;
      
      this.log(`✅ Firebase Studio deployment validation completed`, 'success');
      return validation;
      
    } catch (error) {
      this.log(`❌ Firebase Studio deployment validation failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async validateBuildForFirebaseStudio() {
    try {
      // Check if build exists and is compatible with Firebase Studio
      const buildPath = path.join(process.cwd(), '.next');
      if (!fs.existsSync(buildPath)) {
        this.log('📦 Building project for Firebase Studio validation...', 'info');
        execSync('npm run build', { stdio: 'pipe', timeout: 300000 });
      }
      
      // Validate build structure
      const requiredFiles = [
        '.next/build-manifest.json',
        '.next/static',
        '.next/server'
      ];
      
      const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(process.cwd(), file)));
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing required build files: ${missingFiles.join(', ')}`);
      }
      
      // Check build size compliance
      const buildSize = this.calculateBuildSize();
      const FIREBASE_STUDIO_LIMIT = 5 * 1024 * 1024; // 5MB
      
      return {
        buildExists: true,
        requiredFilesPresent: missingFiles.length === 0,
        buildSize,
        sizeCompliant: buildSize <= FIREBASE_STUDIO_LIMIT,
        status: buildSize <= FIREBASE_STUDIO_LIMIT ? 'compliant' : 'size_violation'
      };
    } catch (error) {
      return {
        buildExists: false,
        error: error.message,
        status: 'build_failed'
      };
    }
  }

  calculateBuildSize() {
    const buildPath = path.join(process.cwd(), '.next');
    return this.getDirectorySize(buildPath);
  }

  getDirectorySize(dirPath) {
    let totalSize = 0;
    
    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          totalSize += this.getDirectorySize(filePath);
        } else {
          totalSize += stats.size;
        }
      }
    } catch (error) {
      // Ignore errors for individual files
    }
    
    return totalSize;
  }

  async validatePerformanceForDeployment() {
    const performanceResult = this.results.performance;
    
    if (!performanceResult) {
      return { status: 'not_analyzed' };
    }
    
    return {
      overallScore: performanceResult.overallScore,
      crisisReadiness: performanceResult.crisisReadiness,
      criticalAlerts: performanceResult.criticalAlerts,
      status: performanceResult.overallScore >= 85 && performanceResult.criticalAlerts === 0 ? 'ready' : 'needs_optimization'
    };
  }

  async validateComplianceForDeployment() {
    const diagnosticResult = this.results.diagnostic;
    
    if (!diagnosticResult) {
      return { status: 'not_analyzed' };
    }
    
    return {
      complianceScore: diagnosticResult.complianceScore,
      criticalIssues: diagnosticResult.criticalIssues,
      fixesApplied: diagnosticResult.fixesApplied,
      status: diagnosticResult.complianceScore >= 90 && diagnosticResult.criticalIssues === 0 ? 'compliant' : 'needs_fixes'
    };
  }

  async validateCrisisReadinessForDeployment() {
    const performanceResult = this.results.performance;
    
    if (!performanceResult) {
      return { status: 'not_analyzed' };
    }
    
    const crisisReady = performanceResult.crisisReadiness === 'excellent' || performanceResult.crisisReadiness === 'good';
    
    return {
      crisisReadiness: performanceResult.crisisReadiness,
      status: crisisReady ? 'crisis_ready' : 'crisis_issues',
      critical: performanceResult.crisisReadiness === 'critical_issues'
    };
  }

  determineDeploymentReadiness(validation) {
    const issues = [];
    let readyForDeployment = true;
    
    // Check build validation
    if (validation.buildValidation.status !== 'compliant') {
      issues.push({
        category: 'build',
        severity: 'critical',
        message: 'Build validation failed or size exceeds Firebase Studio limits'
      });
      readyForDeployment = false;
    }
    
    // Check performance validation
    if (validation.performanceValidation.status !== 'ready') {
      issues.push({
        category: 'performance',
        severity: validation.performanceValidation.criticalAlerts > 0 ? 'critical' : 'high',
        message: 'Performance validation indicates optimization needed'
      });
      if (validation.performanceValidation.criticalAlerts > 0) {
        readyForDeployment = false;
      }
    }
    
    // Check compliance validation
    if (validation.complianceValidation.status !== 'compliant') {
      issues.push({
        category: 'compliance',
        severity: validation.complianceValidation.criticalIssues > 0 ? 'critical' : 'high',
        message: 'Compliance validation indicates fixes needed'
      });
      if (validation.complianceValidation.criticalIssues > 0) {
        readyForDeployment = false;
      }
    }
    
    // Check crisis readiness
    if (validation.crisisValidation.status === 'crisis_issues') {
      issues.push({
        category: 'crisis',
        severity: validation.crisisValidation.critical ? 'critical' : 'high',
        message: 'Crisis support system not ready for production'
      });
      if (validation.crisisValidation.critical) {
        readyForDeployment = false;
      }
    }
    
    return {
      readyForDeployment,
      issues,
      recommendedActions: this.generateDeploymentActions(issues),
      status: readyForDeployment ? 'ready' : 'blocked'
    };
  }

  generateDeploymentActions(issues) {
    const actions = [];
    
    issues.forEach(issue => {
      switch (issue.category) {
        case 'build':
          actions.push('Optimize bundle size to meet Firebase Studio limits');
          actions.push('Run build optimization scripts');
          break;
        case 'performance':
          actions.push('Address performance issues using performance guardian');
          actions.push('Optimize critical user paths for crisis scenarios');
          break;
        case 'compliance':
          actions.push('Run diagnostic healing to fix compliance issues');
          actions.push('Address remaining critical diagnostic issues');
          break;
        case 'crisis':
          actions.push('Optimize crisis support system performance');
          actions.push('Test emergency scenarios under load');
          break;
      }
    });
    
    return [...new Set(actions)]; // Remove duplicates
  }

  // 3. COMPREHENSIVE REPORTING AND MONITORING
  async generateIntegratedReport() {
    const endTime = performance.now();
    const duration = ((endTime - this.startTime) / 1000).toFixed(2);
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        duration: `${duration}s`,
        mode: this.mode,
        version: '1.0.0'
      },
      results: this.results,
      summary: this.generateIntegratedSummary(),
      recommendations: this.generateIntegratedRecommendations(),
      deploymentReadiness: this.results.deployment?.overallValidation || null,
      criticalAlerts: this.generateCriticalAlerts()
    };
    
    // Save integrated report
    if (this.mode.generateReport) {
      fs.mkdirSync('integrated-reports', { recursive: true });
      const reportPath = `integrated-reports/integrated-performance-system-${Date.now()}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      
      // Generate executive summary
      this.generateIntegratedExecutiveSummary(report, reportPath);
    }
    
    return report;
  }

  generateIntegratedSummary() {
    return {
      overallReadiness: this.results.integration?.overallReadiness || 'unknown',
      diagnosticScore: this.results.diagnostic?.complianceScore || null,
      performanceScore: this.results.performance?.overallScore || null,
      crisisReadiness: this.results.performance?.crisisReadiness || 'unknown',
      criticalIssuesCount: (this.results.diagnostic?.criticalIssues || 0) + (this.results.performance?.criticalAlerts || 0),
      optimizationsApplied: (this.results.diagnostic?.fixesApplied || 0) + (this.results.performance?.optimizationsApplied || 0),
      firebaseStudioReady: this.results.deployment?.overallValidation?.readyForDeployment || false
    };
  }

  generateCriticalAlerts() {
    const alerts = [];
    
    // Deployment blocking alerts
    if (this.results.deployment?.overallValidation && !this.results.deployment.overallValidation.readyForDeployment) {
      alerts.push({
        type: 'deployment_blocked',
        severity: 'critical',
        message: 'Firebase Studio deployment is blocked by critical issues',
        category: 'deployment'
      });
    }
    
    // Crisis system alerts
    if (this.results.performance?.crisisReadiness === 'critical_issues') {
      alerts.push({
        type: 'crisis_system_critical',
        severity: 'critical',
        message: 'Crisis support system has critical performance issues',
        category: 'crisis'
      });
    }
    
    // Integration conflicts
    if (this.results.integration && !this.results.integration.consistency) {
      alerts.push({
        type: 'integration_conflict',
        severity: 'high',
        message: 'Conflicts detected between diagnostic and performance results',
        category: 'integration'
      });
    }
    
    return alerts;
  }

  generateIntegratedExecutiveSummary(report, reportPath) {
    const summary = report.summary;
    const statusEmoji = this.getReadinessEmoji(summary.overallReadiness);
    
    const executiveSummary = `
🔗 ALCHM Integrated Performance System Report
=============================================

${statusEmoji} EXECUTIVE SUMMARY
- Overall Readiness: ${summary.overallReadiness.toUpperCase().replace('_', ' ')}
- Firebase Studio Ready: ${summary.firebaseStudioReady ? '✅ YES' : '❌ NO'}
- Diagnostic Score: ${summary.diagnosticScore || 'N/A'}/100
- Performance Score: ${summary.performanceScore?.toFixed(1) || 'N/A'}/100
- Crisis Readiness: ${summary.crisisReadiness.toUpperCase()}
- Duration: ${report.metadata.duration}

🆘 CRISIS USER PROTECTION STATUS
${summary.crisisReadiness === 'excellent' ? '✅ EXCELLENT - Crisis users fully protected' :
  summary.crisisReadiness === 'good' ? '✅ GOOD - Crisis users adequately protected' :
  summary.crisisReadiness === 'needs_improvement' ? '⚠️ NEEDS IMPROVEMENT - Crisis protection may be compromised' :
  summary.crisisReadiness === 'critical_issues' ? '🚨 CRITICAL - Crisis users at risk' :
  '❓ UNKNOWN - Crisis protection status not determined'}

📊 INTEGRATED ANALYSIS RESULTS
${this.results.diagnostic ? `✅ Diagnostic Analysis: ${this.results.diagnostic.complianceScore || 'N/A'}/100 compliance` : '⏭️ Diagnostic Analysis (Skipped)'}
${this.results.performance ? `✅ Performance Analysis: ${this.results.performance.overallScore?.toFixed(1) || 'N/A'}/100 performance` : '⏭️ Performance Analysis (Skipped)'}
${this.results.integration ? `✅ Integration Validation: ${this.results.integration.consistency ? 'Consistent' : 'Conflicts Detected'}` : '⏭️ Integration Validation (Skipped)'}
${this.results.deployment ? `✅ Deployment Validation: ${this.results.deployment.overallValidation?.status || 'Unknown'}` : '⏭️ Deployment Validation (Skipped)'}

🚨 CRITICAL ALERTS
${report.criticalAlerts.length === 0 ? '✅ No critical alerts - system ready for production' :
  report.criticalAlerts.map(alert => `- [${alert.severity.toUpperCase()}] ${alert.message}`).join('\n')}

⚡ OPTIMIZATIONS APPLIED
- Diagnostic Fixes: ${summary.optimizationsApplied}
- Performance Optimizations: ${this.results.performance?.optimizationsApplied || 0}
- Total Improvements: ${summary.optimizationsApplied}

🎯 KEY RECOMMENDATIONS
${report.recommendations.slice(0, 3).map((rec, i) => 
  `${i + 1}. [${rec.priority.toUpperCase()}] ${rec.title}\n   ${rec.description}`
).join('\n') || 'No recommendations - system is optimized!'}

🚀 FIREBASE STUDIO DEPLOYMENT STATUS
${summary.firebaseStudioReady ? 
  '✅ READY FOR DEPLOYMENT: All validations passed' :
  '❌ DEPLOYMENT BLOCKED: Critical issues must be resolved'}

${this.results.deployment?.overallValidation?.issues?.length > 0 ?
  `\n📋 DEPLOYMENT BLOCKERS:\n${this.results.deployment.overallValidation.issues.map(issue => `- [${issue.severity.toUpperCase()}] ${issue.message}`).join('\n')}` :
  ''}

📄 DETAILED REPORTS
- Integrated Report: ${reportPath}
- Mode: ${report.metadata.mode.name}
- System Version: ${report.metadata.version}

${summary.overallReadiness === 'production_ready' ? 
  '🎉 PRODUCTION READY: All systems optimized for trauma-informed deployment!' :
  summary.overallReadiness === 'needs_optimization' ?
  '⚠️ OPTIMIZATION REQUIRED: Address recommendations before deployment' :
  '🚨 CRITICAL ISSUES: Immediate action required before deployment'}

Generated: ${report.metadata.timestamp}
`;
    
    const summaryPath = 'ALCHM_INTEGRATED_PERFORMANCE_SYSTEM_SUMMARY.md';
    fs.writeFileSync(summaryPath, executiveSummary);
    console.log(executiveSummary);
    
    this.log(`📄 Executive summary saved to: ${summaryPath}`, 'success');
    this.log(`📋 Detailed report saved to: ${reportPath}`, 'success');
  }

  getReadinessEmoji(readiness) {
    switch (readiness) {
      case 'production_ready': return '🎉';
      case 'needs_optimization': return '⚠️';
      case 'critical_issues': return '🚨';
      default: return '❓';
    }
  }

  // MAIN EXECUTION
  async execute() {
    this.log('🔗 Starting ALCHM Integrated Performance System...', 'success');
    this.log(`Mode: ${this.mode.description}`, 'info');
    
    try {
      // Phase 1: Integrated Diagnostic and Performance Analysis
      await this.runIntegratedAnalysis();
      
      // Phase 2: Firebase Studio Deployment Validation
      await this.runFirebaseStudioDeploymentValidation();
      
      // Phase 3: Generate Integrated Report
      const report = await this.generateIntegratedReport();
      
      // Determine exit code
      const exitCode = this.determineExitCode(report);
      
      this.log(`🔗 Integrated Performance System completed with exit code: ${exitCode}`, 'success');
      process.exit(exitCode);
      
    } catch (error) {
      this.log(`💥 Integrated Performance System failed: ${error.message}`, 'critical');
      console.error('Full error:', error);
      process.exit(1);
    }
  }

  determineExitCode(report) {
    const summary = report.summary;
    
    // Critical alerts always fail
    const criticalAlerts = report.criticalAlerts.filter(a => a.severity === 'critical');
    if (criticalAlerts.length > 0) {
      return 1;
    }
    
    // Deployment readiness
    if (!summary.firebaseStudioReady && this.mode.strictValidation) {
      return 1;
    }
    
    // Crisis readiness critical
    if (summary.crisisReadiness === 'critical_issues') {
      return 1;
    }
    
    // Overall readiness
    if (summary.overallReadiness === 'critical_issues') {
      return 1;
    }
    
    return 0; // Success
  }
}

// CLI Help
function showHelp() {
  console.log(`
🔗 ALCHM Integrated Performance System - Complete Firebase Studio Deployment Validation

USAGE:
  node firebase-studio-integrated-performance-system.js [mode] [options]

MODES:
  production-ready          Complete validation for production deployment (default)
  crisis-validation         Validate crisis support system performance
  continuous-monitoring     Real-time monitoring during development
  emergency-optimization    Emergency performance healing and optimization
  firebase-studio-deploy    Comprehensive Firebase Studio deployment preparation

OPTIONS:
  --verbose          Show detailed output from all systems
  --dry-run          Show what would be done without making changes
  --skip-backup      Skip creating backups during healing
  --force-healing    Force healing even with warnings
  --no-report        Skip generating detailed reports
  --parallel         Run diagnostic and performance analysis in parallel
  --help             Show this help message

EXAMPLES:
  node firebase-studio-integrated-performance-system.js production-ready --verbose
  node firebase-studio-integrated-performance-system.js crisis-validation --force-healing
  node firebase-studio-integrated-performance-system.js firebase-studio-deploy --parallel

VALIDATION CRITERIA:
  - Firebase Studio bundle size compliance (<5MB)
  - Crisis support system performance (<100ms response)
  - Core Web Vitals for trauma-informed users
  - Memory leak prevention and optimization
  - Mobile trauma-informed design validation
  - Predictive performance analytics

For more information, see the generated reports in integrated-reports/
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  const integratedSystem = new IntegratedPerformanceSystem();
  integratedSystem.execute().catch(error => {
    console.error('💥 Fatal error in integrated performance system:', error);
    process.exit(1);
  });
}

module.exports = IntegratedPerformanceSystem;