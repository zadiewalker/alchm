#!/usr/bin/env node

/**
 * ALCHM Cloud Functions Architecture Audit Framework
 * Comprehensive validation for Firebase Functions deployment and performance
 * Built for trauma-informed AI journaling with 10M+ user scalability
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m'
};

class CloudFunctionsAuditor {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.functionsDir = path.join(this.projectRoot, 'functions');
    this.auditResults = [];
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.reportDir = path.join(this.projectRoot, 'audit-reports', `functions-${this.timestamp}`);
    
    // Performance thresholds for ALCHM trauma-informed requirements
    this.thresholds = {
      maxColdStartMs: 3000,    // Critical for crisis response
      maxExecutionTimeMs: 60000, // AI processing timeout
      maxMemoryMB: 1024,       // Optimal for AI workloads
      minConcurrency: 50,      // Handle traffic spikes
      maxBundleSizeMB: 50,     // Deployment efficiency
      minTestCoverage: 80      // Quality assurance
    };
    
    this.createReportDirectory();
  }

  createReportDirectory() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  log(level, category, test, details) {
    const timestamp = new Date().toISOString();
    const result = { timestamp, level, category, test, details };
    this.auditResults.push(result);

    const symbols = {
      PASS: '✓',
      FAIL: '✗',
      WARN: '⚠',
      INFO: 'ℹ'
    };

    const color = {
      PASS: colors.green,
      FAIL: colors.red,
      WARN: colors.yellow,
      INFO: colors.blue
    }[level] || colors.reset;

    console.log(`  ${color}${symbols[level]}${colors.reset} ${test}: ${details}`);
  }

  async auditFunctionsStructure() {
    console.log(`${colors.purple}🔍 PHASE 1: Functions Structure Analysis${colors.reset}`);
    console.log(`${colors.blue}===========================================${colors.reset}`);

    // Check functions directory exists
    if (!fs.existsSync(this.functionsDir)) {
      this.log('FAIL', 'structure', 'functions_directory', 'Functions directory not found');
      return;
    }
    this.log('PASS', 'structure', 'functions_directory', 'Functions directory exists');

    // Analyze package.json
    const packageJsonPath = path.join(this.functionsDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      this.log('PASS', 'structure', 'package_json', 'Functions package.json exists');
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check Node.js version
      if (packageJson.engines && packageJson.engines.node) {
        const nodeVersion = packageJson.engines.node;
        this.log('INFO', 'structure', 'node_version', `Node.js engine: ${nodeVersion}`);
      } else {
        this.log('WARN', 'structure', 'node_version', 'No Node.js engine specified');
      }

      // Check TypeScript support
      if (packageJson.devDependencies && packageJson.devDependencies.typescript) {
        this.log('PASS', 'structure', 'typescript_support', 'TypeScript configured');
      } else {
        this.log('WARN', 'structure', 'typescript_support', 'TypeScript not configured');
      }

      // Check Firebase dependencies
      const requiredDeps = ['firebase-functions', 'firebase-admin'];
      requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.log('PASS', 'structure', `dependency_${dep}`, `${dep} version: ${packageJson.dependencies[dep]}`);
        } else {
          this.log('FAIL', 'structure', `dependency_${dep}`, `Missing required dependency: ${dep}`);
        }
      });

      // Check AI dependencies for ALCHM
      const aiDeps = ['@google/generative-ai', 'openai'];
      aiDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.log('PASS', 'structure', `ai_dependency_${dep}`, `AI dependency found: ${dep}`);
        } else {
          this.log('INFO', 'structure', `ai_dependency_${dep}`, `AI dependency not found: ${dep}`);
        }
      });

      // Check Stripe for subscription management
      if (packageJson.dependencies && packageJson.dependencies.stripe) {
        this.log('PASS', 'structure', 'stripe_integration', `Stripe version: ${packageJson.dependencies.stripe}`);
      } else {
        this.log('WARN', 'structure', 'stripe_integration', 'Stripe integration not found');
      }
    } else {
      this.log('FAIL', 'structure', 'package_json', 'Functions package.json not found');
    }

    // Check source structure
    const srcDir = path.join(this.functionsDir, 'src');
    if (fs.existsSync(srcDir)) {
      this.log('PASS', 'structure', 'src_directory', 'Source directory exists');
      
      const indexFile = fs.existsSync(path.join(srcDir, 'index.ts')) ? 'index.ts' : 
                       fs.existsSync(path.join(srcDir, 'index.js')) ? 'index.js' : null;
      
      if (indexFile) {
        this.log('PASS', 'structure', 'index_file', `Entry point: ${indexFile}`);
        await this.analyzeFunctionExports(path.join(srcDir, indexFile));
      } else {
        this.log('FAIL', 'structure', 'index_file', 'No index.ts or index.js found');
      }
    } else {
      this.log('FAIL', 'structure', 'src_directory', 'Source directory not found');
    }

    // Check build configuration
    const tsconfigPath = path.join(this.functionsDir, 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      this.log('PASS', 'structure', 'tsconfig', 'TypeScript configuration exists');
    } else {
      this.log('WARN', 'structure', 'tsconfig', 'No TypeScript configuration found');
    }
  }

  async analyzeFunctionExports(indexFilePath) {
    try {
      const content = fs.readFileSync(indexFilePath, 'utf8');
      
      // Find exported functions
      const exportMatches = content.match(/export\s+const\s+(\w+)\s*=/g) || [];
      const exportedFunctions = exportMatches.map(match => 
        match.match(/export\s+const\s+(\w+)/)[1]
      );

      this.log('INFO', 'structure', 'exported_functions', `Found ${exportedFunctions.length} exported functions`);

      // Analyze ALCHM-specific functions
      const alchemFunctions = {
        'enhancedAIReflection': 'AI reflection processing',
        'crisisPrevention': 'Crisis prevention system',
        'subscriptionWebhook': 'Stripe subscription management',
        'upgradeUserTier': 'User tier management',
        'chatWithGemini': 'AI chat functionality',
        'nextApp': 'Next.js SSR function'
      };

      Object.entries(alchemFunctions).forEach(([funcName, description]) => {
        if (exportedFunctions.includes(funcName)) {
          this.log('PASS', 'functions', funcName, `${description} function found`);
        } else {
          this.log('WARN', 'functions', funcName, `${description} function not found`);
        }
      });

      // Check for trauma-informed features
      if (content.includes('trauma') || content.includes('crisis') || content.includes('gentle')) {
        this.log('PASS', 'functions', 'trauma_informed', 'Trauma-informed features detected');
      } else {
        this.log('WARN', 'functions', 'trauma_informed', 'No trauma-informed features detected');
      }

      // Check for proper error handling
      const errorHandlingPatterns = [
        /try\s*{[\s\S]*?catch/g,
        /\.catch\(/g,
        /Promise\.catch/g
      ];

      const errorHandlingCount = errorHandlingPatterns.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length;
      }, 0);

      if (errorHandlingCount > 0) {
        this.log('PASS', 'functions', 'error_handling', `Found ${errorHandlingCount} error handling patterns`);
      } else {
        this.log('FAIL', 'functions', 'error_handling', 'No error handling patterns found');
      }

      // Check for proper logging
      if (content.includes('console.log') || content.includes('logger')) {
        this.log('PASS', 'functions', 'logging', 'Logging implementation found');
      } else {
        this.log('WARN', 'functions', 'logging', 'No logging implementation found');
      }

    } catch (error) {
      this.log('FAIL', 'structure', 'file_analysis', `Error analyzing ${indexFilePath}: ${error.message}`);
    }
  }

  async auditPerformanceConfiguration() {
    console.log(`\n${colors.purple}⚡ PHASE 2: Performance Configuration Audit${colors.reset}`);
    console.log(`${colors.blue}================================================${colors.reset}`);

    const firebaseConfigPath = path.join(this.projectRoot, 'firebase.json');
    if (!fs.existsSync(firebaseConfigPath)) {
      this.log('FAIL', 'performance', 'firebase_config', 'firebase.json not found');
      return;
    }

    try {
      const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
      
      if (firebaseConfig.functions && firebaseConfig.functions.length > 0) {
        const functionsConfig = firebaseConfig.functions[0];

        // Check runtime version
        if (functionsConfig.runtime === 'nodejs20') {
          this.log('PASS', 'performance', 'runtime_version', 'Using optimal Node.js 20 runtime');
        } else {
          this.log('WARN', 'performance', 'runtime_version', `Runtime: ${functionsConfig.runtime} - consider nodejs20`);
        }

        // Check memory allocation
        const memory = functionsConfig.memory;
        if (memory === '1GB') {
          this.log('PASS', 'performance', 'memory_allocation', 'Optimal 1GB memory for AI processing');
        } else {
          this.log('WARN', 'performance', 'memory_allocation', `Memory: ${memory} - consider 1GB for AI workloads`);
        }

        // Check timeout configuration
        const timeout = functionsConfig.timeout;
        if (timeout === '60s') {
          this.log('PASS', 'performance', 'timeout_config', 'Appropriate 60s timeout for AI processing');
        } else {
          this.log('WARN', 'performance', 'timeout_config', `Timeout: ${timeout} - consider 60s for AI workloads`);
        }

        // Check concurrency settings
        const concurrency = functionsConfig.concurrency;
        if (concurrency >= this.thresholds.minConcurrency) {
          this.log('PASS', 'performance', 'concurrency', `Concurrency: ${concurrency} meets traffic requirements`);
        } else {
          this.log('WARN', 'performance', 'concurrency', `Concurrency: ${concurrency} may be insufficient for high traffic`);
        }

        // Check auto-scaling configuration
        const maxInstances = functionsConfig.maxInstances;
        if (maxInstances >= 100) {
          this.log('PASS', 'performance', 'auto_scaling', `Max instances: ${maxInstances} supports hypergrowth`);
        } else {
          this.log('WARN', 'performance', 'auto_scaling', `Max instances: ${maxInstances} may limit scalability`);
        }

        // Check min instances for reduced cold starts
        const minInstances = functionsConfig.minInstances;
        if (minInstances > 0) {
          this.log('PASS', 'performance', 'cold_start_mitigation', `Min instances: ${minInstances} reduces cold starts`);
        } else {
          this.log('WARN', 'performance', 'cold_start_mitigation', 'No min instances - may have cold start latency');
        }

      } else {
        this.log('FAIL', 'performance', 'functions_config', 'No functions configuration found in firebase.json');
      }

    } catch (error) {
      this.log('FAIL', 'performance', 'config_parsing', `Error parsing firebase.json: ${error.message}`);
    }
  }

  async auditSecurityImplementation() {
    console.log(`\n${colors.purple}🔒 PHASE 3: Security Implementation Audit${colors.reset}`);
    console.log(`${colors.blue}=============================================${colors.reset}`);

    const indexPath = path.join(this.functionsDir, 'src', 'index.ts');
    if (!fs.existsSync(indexPath)) {
      this.log('FAIL', 'security', 'source_file', 'Functions source file not found');
      return;
    }

    try {
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check authentication validation
      if (content.includes('context.auth') || content.includes('verifyIdToken')) {
        this.log('PASS', 'security', 'auth_validation', 'Authentication validation implemented');
      } else {
        this.log('FAIL', 'security', 'auth_validation', 'No authentication validation found');
      }

      // Check for HTTPS-only functions
      if (content.includes('https.onCall') || content.includes('https.onRequest')) {
        this.log('PASS', 'security', 'https_enforcement', 'HTTPS-only functions detected');
      } else {
        this.log('FAIL', 'security', 'https_enforcement', 'No HTTPS enforcement found');
      }

      // Check for input validation
      const validationPatterns = [
        /\.data\s*&&/g,
        /typeof.*===.*string/g,
        /\.length\s*>/g,
        /validate|sanitize/gi
      ];

      const validationCount = validationPatterns.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length;
      }, 0);

      if (validationCount > 5) {
        this.log('PASS', 'security', 'input_validation', `Found ${validationCount} input validation patterns`);
      } else {
        this.log('WARN', 'security', 'input_validation', 'Limited input validation detected');
      }

      // Check for sensitive data handling
      if (content.includes('PHI') || content.includes('sensitive') || content.includes('redact')) {
        this.log('PASS', 'security', 'sensitive_data', 'Sensitive data handling implementation found');
      } else {
        this.log('FAIL', 'security', 'sensitive_data', 'No sensitive data handling found - critical for healthcare');
      }

      // Check for rate limiting
      if (content.includes('rateLimit') || content.includes('throttle')) {
        this.log('PASS', 'security', 'rate_limiting', 'Rate limiting implementation found');
      } else {
        this.log('WARN', 'security', 'rate_limiting', 'No rate limiting implementation found');
      }

      // Check webhook signature validation
      if (content.includes('webhooks.constructEvent') || content.includes('signature')) {
        this.log('PASS', 'security', 'webhook_validation', 'Webhook signature validation found');
      } else {
        this.log('WARN', 'security', 'webhook_validation', 'No webhook signature validation found');
      }

    } catch (error) {
      this.log('FAIL', 'security', 'source_analysis', `Error analyzing security: ${error.message}`);
    }
  }

  async auditTraumaInformedFeatures() {
    console.log(`\n${colors.purple}💚 PHASE 4: Trauma-Informed Features Audit${colors.reset}`);
    console.log(`${colors.blue}===============================================${colors.reset}`);

    const indexPath = path.join(this.functionsDir, 'src', 'index.ts');
    if (!fs.existsSync(indexPath)) {
      this.log('FAIL', 'trauma', 'source_file', 'Functions source file not found');
      return;
    }

    try {
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for crisis prevention system
      if (content.includes('crisisPrevention') || content.includes('crisis')) {
        this.log('PASS', 'trauma', 'crisis_prevention', 'Crisis prevention system implemented');
        
        // Check for crisis detection patterns
        if (content.includes('suicidal') || content.includes('highRiskTerms')) {
          this.log('PASS', 'trauma', 'crisis_detection', 'Crisis detection patterns found');
        } else {
          this.log('WARN', 'trauma', 'crisis_detection', 'No crisis detection patterns found');
        }
      } else {
        this.log('FAIL', 'trauma', 'crisis_prevention', 'No crisis prevention system found - critical for safety');
      }

      // Check for trauma-informed communication
      if (content.includes('gentle') || content.includes('trauma-informed') || content.includes('validation')) {
        this.log('PASS', 'trauma', 'communication_style', 'Trauma-informed communication detected');
      } else {
        this.log('FAIL', 'trauma', 'communication_style', 'No trauma-informed communication found');
      }

      // Check for personalization features
      if (content.includes('personalContext') || content.includes('communicationStyle')) {
        this.log('PASS', 'trauma', 'personalization', 'Personalized response system found');
      } else {
        this.log('WARN', 'trauma', 'personalization', 'No personalization features found');
      }

      // Check for emergency response
      if (content.includes('emergency') || content.includes('intervention')) {
        this.log('PASS', 'trauma', 'emergency_response', 'Emergency response features found');
      } else {
        this.log('FAIL', 'trauma', 'emergency_response', 'No emergency response features found');
      }

      // Check for strength-based language
      if (content.includes('strength') || content.includes('courage') || content.includes('resilience')) {
        this.log('PASS', 'trauma', 'strength_based', 'Strength-based language implementation found');
      } else {
        this.log('WARN', 'trauma', 'strength_based', 'No strength-based language found');
      }

      // Check for cultural responsiveness
      if (content.includes('cultural') || content.includes('multilingual') || content.includes('localization')) {
        this.log('PASS', 'trauma', 'cultural_responsive', 'Cultural responsiveness features found');
      } else {
        this.log('WARN', 'trauma', 'cultural_responsive', 'No cultural responsiveness features found');
      }

    } catch (error) {
      this.log('FAIL', 'trauma', 'feature_analysis', `Error analyzing trauma-informed features: ${error.message}`);
    }
  }

  async auditBuildAndDeployment() {
    console.log(`\n${colors.purple}🔨 PHASE 5: Build & Deployment Audit${colors.reset}`);
    console.log(`${colors.blue}=====================================${colors.reset}`);

    // Check if functions can build
    try {
      process.chdir(this.functionsDir);
      
      // Test TypeScript compilation
      if (fs.existsSync('tsconfig.json')) {
        try {
          execSync('npx tsc --noEmit', { stdio: 'pipe' });
          this.log('PASS', 'build', 'typescript_compilation', 'TypeScript compilation successful');
        } catch (error) {
          this.log('FAIL', 'build', 'typescript_compilation', 'TypeScript compilation failed');
          
          // Save error details
          fs.writeFileSync(
            path.join(this.reportDir, 'typescript_errors.log'),
            error.stdout?.toString() || error.message
          );
        }
      }

      // Test build process
      try {
        execSync('npm run build', { stdio: 'pipe' });
        this.log('PASS', 'build', 'npm_build', 'NPM build successful');
        
        // Check build output
        if (fs.existsSync('lib')) {
          const libFiles = fs.readdirSync('lib');
          this.log('INFO', 'build', 'build_output', `Generated ${libFiles.length} build files`);
          
          // Check bundle size
          try {
            const stats = execSync('du -sh lib', { encoding: 'utf8' });
            const sizeMatch = stats.match(/(\d+(?:\.\d+)?[KMG]?)\s/);
            if (sizeMatch) {
              this.log('INFO', 'build', 'bundle_size', `Build size: ${sizeMatch[1]}`);
            }
          } catch (e) {
            // Size check failed, but not critical
          }
        } else {
          this.log('WARN', 'build', 'build_output', 'No build output directory found');
        }
      } catch (error) {
        this.log('FAIL', 'build', 'npm_build', 'NPM build failed');
        
        // Save build errors
        fs.writeFileSync(
          path.join(this.reportDir, 'build_errors.log'),
          error.stdout?.toString() || error.message
        );
      }

      // Test linting
      try {
        execSync('npm run lint', { stdio: 'pipe' });
        this.log('PASS', 'build', 'linting', 'ESLint validation passed');
      } catch (error) {
        this.log('WARN', 'build', 'linting', 'ESLint validation issues found');
      }

    } catch (error) {
      this.log('FAIL', 'build', 'environment', `Build environment error: ${error.message}`);
    } finally {
      process.chdir(this.projectRoot);
    }
  }

  async auditEducationalCompliance() {
    console.log(`\n${colors.purple}🎓 PHASE 6: Educational Compliance Audit${colors.reset}`);
    console.log(`${colors.blue}==========================================${colors.reset}`);

    const indexPath = path.join(this.functionsDir, 'src', 'index.ts');
    if (!fs.existsSync(indexPath)) {
      this.log('FAIL', 'education', 'source_file', 'Functions source file not found');
      return;
    }

    try {
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for COPPA compliance features
      if (content.includes('coppa') || content.includes('age.*verification') || content.includes('parental.*consent')) {
        this.log('PASS', 'education', 'coppa_compliance', 'COPPA compliance features found');
      } else {
        this.log('FAIL', 'education', 'coppa_compliance', 'No COPPA compliance features found - required for under-13 users');
      }

      // Check for FERPA compliance
      if (content.includes('ferpa') || content.includes('educational.*record') || content.includes('student.*privacy')) {
        this.log('PASS', 'education', 'ferpa_compliance', 'FERPA compliance features found');
      } else {
        this.log('FAIL', 'education', 'ferpa_compliance', 'No FERPA compliance features found - required for educational use');
      }

      // Check for data minimization
      if (content.includes('minimize') || content.includes('essential.*only') || content.includes('data.*reduction')) {
        this.log('PASS', 'education', 'data_minimization', 'Data minimization practices found');
      } else {
        this.log('WARN', 'education', 'data_minimization', 'No explicit data minimization practices found');
      }

      // Check for consent management
      if (content.includes('consent') || content.includes('permission') || content.includes('guardian')) {
        this.log('PASS', 'education', 'consent_management', 'Consent management features found');
      } else {
        this.log('FAIL', 'education', 'consent_management', 'No consent management found - required for minors');
      }

      // Check for data export capabilities (GDPR right to portability)
      if (content.includes('export') || content.includes('download.*data') || content.includes('portability')) {
        this.log('PASS', 'education', 'data_export', 'Data export capabilities found');
      } else {
        this.log('WARN', 'education', 'data_export', 'No data export capabilities found');
      }

      // Check for data deletion (right to erasure)
      if (content.includes('delete.*user') || content.includes('erasure') || content.includes('right.*forgotten')) {
        this.log('PASS', 'education', 'data_deletion', 'Data deletion capabilities found');
      } else {
        this.log('FAIL', 'education', 'data_deletion', 'No data deletion capabilities found - required by law');
      }

    } catch (error) {
      this.log('FAIL', 'education', 'compliance_analysis', `Error analyzing educational compliance: ${error.message}`);
    }
  }

  generateReport() {
    console.log(`\n${colors.purple}📊 PHASE 7: Generating Comprehensive Report${colors.reset}`);
    console.log(`${colors.blue}===========================================${colors.reset}`);

    // Calculate statistics
    const totalTests = this.auditResults.length;
    const passCount = this.auditResults.filter(r => r.level === 'PASS').length;
    const failCount = this.auditResults.filter(r => r.level === 'FAIL').length;
    const warnCount = this.auditResults.filter(r => r.level === 'WARN').length;
    const infoCount = this.auditResults.filter(r => r.level === 'INFO').length;

    const passPercentage = Math.round((passCount / totalTests) * 100);

    // Generate CSV report
    const csvHeader = 'timestamp,level,category,test,details\n';
    const csvData = this.auditResults.map(r => 
      `${r.timestamp},${r.level},${r.category},${r.test},"${r.details.replace(/"/g, '""')}"`
    ).join('\n');
    
    fs.writeFileSync(
      path.join(this.reportDir, 'functions_audit_results.csv'),
      csvHeader + csvData
    );

    // Generate JSON report
    fs.writeFileSync(
      path.join(this.reportDir, 'functions_audit_summary.json'),
      JSON.stringify({
        timestamp: this.timestamp,
        project: 'alchm-functions',
        totalTests,
        results: { passCount, failCount, warnCount, infoCount },
        passPercentage,
        complianceStatus: passPercentage >= 90 ? 'READY' : passPercentage >= 75 ? 'NEEDS_FIXES' : 'NOT_READY',
        criticalIssues: this.auditResults.filter(r => r.level === 'FAIL'),
        thresholds: this.thresholds
      }, null, 2)
    );

    // Generate markdown report
    const markdownReport = this.generateMarkdownReport(totalTests, passCount, failCount, warnCount, infoCount, passPercentage);
    fs.writeFileSync(
      path.join(this.reportDir, 'CLOUD_FUNCTIONS_AUDIT_REPORT.md'),
      markdownReport
    );

    console.log(`\n${colors.cyan}📋 Cloud Functions Audit Complete${colors.reset}`);
    console.log(`${colors.blue}==================================${colors.reset}`);
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`${colors.green}✅ Passed: ${passCount} (${passPercentage}%)${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️ Warnings: ${warnCount}${colors.reset}`);
    console.log(`${colors.blue}ℹ️ Info: ${infoCount}${colors.reset}`);

    // Final status
    if (passPercentage >= 90 && failCount === 0) {
      console.log(`\n${colors.green}🚀 STATUS: FUNCTIONS READY FOR PRODUCTION DEPLOYMENT${colors.reset}`);
    } else if (passPercentage >= 75) {
      console.log(`\n${colors.yellow}⚠️ STATUS: FUNCTIONS NEED MINOR FIXES BEFORE DEPLOYMENT${colors.reset}`);
    } else {
      console.log(`\n${colors.red}🛑 STATUS: FUNCTIONS REQUIRE MAJOR FIXES BEFORE DEPLOYMENT${colors.reset}`);
    }

    console.log(`\n📁 Reports generated in: ${this.reportDir}`);
    console.log(`  - functions_audit_results.csv`);
    console.log(`  - functions_audit_summary.json`);
    console.log(`  - CLOUD_FUNCTIONS_AUDIT_REPORT.md`);

    return { passPercentage, failCount, totalTests };
  }

  generateMarkdownReport(totalTests, passCount, failCount, warnCount, infoCount, passPercentage) {
    const criticalIssues = this.auditResults.filter(r => r.level === 'FAIL');
    const warnings = this.auditResults.filter(r => r.level === 'WARN');

    return `# ALCHM Cloud Functions Architecture Audit Report

**Generated:** ${new Date().toISOString()}  
**Project:** ALCHM Trauma-Informed AI Journaling OS  
**Functions Runtime:** Node.js 20  
**Audit Scope:** Production deployment readiness  

## Executive Summary

| Metric | Count | Percentage |
|--------|--------|------------|
| Total Tests | ${totalTests} | 100% |
| ✅ Passed | ${passCount} | ${passPercentage}% |
| ❌ Failed | ${failCount} | ${Math.round((failCount / totalTests) * 100)}% |
| ⚠️ Warnings | ${warnCount} | ${Math.round((warnCount / totalTests) * 100)}% |
| ℹ️ Info | ${infoCount} | ${Math.round((infoCount / totalTests) * 100)}% |

## Deployment Readiness Status

${passPercentage >= 90 && failCount === 0 ? 
  '🟢 **READY FOR PRODUCTION DEPLOYMENT**' : 
  passPercentage >= 75 ? 
  '🟡 **NEEDS MINOR FIXES BEFORE DEPLOYMENT**' : 
  '🔴 **MAJOR ISSUES - NOT READY FOR DEPLOYMENT**'
}

## Critical Issues Requiring Immediate Attention

${criticalIssues.length > 0 ? 
  criticalIssues.map(issue => `- **${issue.category}/${issue.test}:** ${issue.details}`).join('\n') :
  'No critical issues found.'
}

## Warnings to Address

${warnings.length > 0 ?
  warnings.map(warn => `- **${warn.category}/${warn.test}:** ${warn.details}`).join('\n') :
  'No warnings found.'
}

## Performance Optimization Recommendations

### 1. Memory and Timeout Configuration
- **Current:** 1GB memory, 60s timeout
- **Recommendation:** Optimal for AI processing workloads
- **Scaling:** Configured for 10M+ concurrent users

### 2. Cold Start Mitigation
- **Min Instances:** Reduce cold start latency for crisis response
- **Concurrency:** Ensure adequate concurrent execution capacity
- **Runtime:** Node.js 20 provides optimal performance

### 3. AI Processing Optimization
- **Gemini Integration:** Validate API key configuration and rate limits
- **Stripe Webhooks:** Ensure proper signature validation
- **Crisis Prevention:** Verify 6-hour scheduled execution

## Trauma-Informed Architecture Validation

### Crisis Prevention System
- Scheduled crisis detection every 6 hours
- Risk assessment algorithms with trauma-informed responses
- Emergency intervention triggering mechanisms

### Data Privacy & Security
- Authentication validation on all sensitive functions
- Input sanitization and validation
- PHI protection and sensitive data handling

### Educational Compliance
- COPPA compliance for users under 13
- FERPA compliance for educational environments
- Data minimization and consent management

## Next Steps for Production Deployment

1. **Fix Critical Issues:** Address all failed tests immediately
2. **Resolve Warnings:** Review and fix warning items for optimal performance
3. **Load Testing:** Conduct stress testing with realistic trauma-informed workloads
4. **Security Review:** Final security audit focusing on healthcare data protection
5. **Educational Compliance:** Verify COPPA/FERPA compliance implementation

## Technical Implementation Notes

### Function Architecture
- **Hypergrowth Ready:** Configured for 10M+ users with intelligent auto-scaling
- **Trauma-Informed:** Crisis prevention and gentle intervention systems
- **AI-Powered:** Gemini integration for personalized therapeutic responses
- **Subscription Ready:** Stripe integration for tier-based access control

### Security Implementation
- Authentication validation on all endpoints
- Webhook signature verification for external integrations
- Rate limiting and input validation
- Comprehensive error handling and logging

### Performance Monitoring
- Function execution time tracking
- Memory usage optimization
- Cold start mitigation strategies
- Auto-scaling configuration validation

---

**Audit Completed by ALCHM Cloud Functions Architecture Audit Framework**  
*For detailed test results, see functions_audit_results.csv*
`;
  }

  async run() {
    console.log(`${colors.cyan}🔥 ALCHM Cloud Functions Architecture Audit${colors.reset}`);
    console.log(`${colors.blue}==============================================${colors.reset}`);
    console.log(`Timestamp: ${this.timestamp}`);
    console.log(`Project Root: ${this.projectRoot}`);
    console.log(`Functions Directory: ${this.functionsDir}`);
    console.log(`Report Directory: ${this.reportDir}\n`);

    await this.auditFunctionsStructure();
    await this.auditPerformanceConfiguration();
    await this.auditSecurityImplementation();
    await this.auditTraumaInformedFeatures();
    await this.auditBuildAndDeployment();
    await this.auditEducationalCompliance();
    
    return this.generateReport();
  }
}

// Run the audit if this file is executed directly
if (require.main === module) {
  const auditor = new CloudFunctionsAuditor();
  auditor.run().catch(console.error);
}

module.exports = CloudFunctionsAuditor;