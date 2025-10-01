#!/usr/bin/env node

/**
 * ALCHM Automated E2E Test Runner
 * 
 * Catches missing dependencies early with intelligent test orchestration
 * Integrates with development workflow for continuous validation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutomatedE2ERunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.testResultsDir = path.join(this.projectRoot, 'test-results');
    this.reportsDir = path.join(this.projectRoot, 'e2e-reports');
    
    this.testSuites = {
      'dependency-validation': {
        name: 'Dependency Validation',
        spec: 'dependency-validation.spec.ts',
        priority: 1,
        runCondition: 'always'
      },
      'crisis-safety': {
        name: 'Crisis Safety Integration', 
        spec: 'crisis-safety-integration.spec.ts',
        priority: 2,
        runCondition: 'build-success'
      },
      'comprehensive': {
        name: 'Comprehensive E2E Tests',
        spec: '**/*.spec.ts',
        priority: 3,
        runCondition: 'manual'
      }
    };
    
    this.config = {
      maxRetries: 2,
      timeoutMs: 60000,
      parallelWorkers: 1,
      headless: true,
      browsers: ['chromium'],
      mobileTests: true,
      screenshots: true,
      videos: false
    };

    this.results = {
      startTime: new Date(),
      endTime: null,
      duration: 0,
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      criticalIssues: [],
      warnings: [],
      recommendations: []
    };
  }

  async run(suiteType = 'dependency-validation', options = {}) {
    console.log('🚀 ALCHM Automated E2E Test Runner');
    console.log('===================================');
    
    this.config = { ...this.config, ...options };
    
    try {
      await this.setupTestEnvironment();
      await this.runTestSuite(suiteType);
      await this.generateReports();
      await this.cleanup();
      
      console.log('🎉 E2E test run completed successfully!');
      return this.results;
    } catch (error) {
      console.error('❌ E2E test run failed:', error.message);
      await this.handleFailure(error);
      throw error;
    }
  }

  async setupTestEnvironment() {
    console.log('🔧 Setting up test environment...');
    
    // Ensure directories exist
    if (!fs.existsSync(this.testResultsDir)) {
      fs.mkdirSync(this.testResultsDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
    
    // Check if development server is running
    const isDevRunning = await this.checkDevServer();
    
    if (!isDevRunning && this.config.autoStartDev !== false) {
      console.log('🌐 Starting development server...');
      await this.startDevServer();
      await this.waitForServer('http://localhost:3000', 60000);
    }
    
    // Pre-flight checks
    await this.runPreflightChecks();
    
    console.log('✅ Test environment ready');
  }

  async runPreflightChecks() {
    console.log('✈️  Running pre-flight checks...');
    
    // Check TypeScript compilation
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        cwd: this.projectRoot
      });
      console.log('✅ TypeScript compilation check passed');
    } catch (error) {
      console.warn('⚠️  TypeScript compilation issues detected');
      this.results.warnings.push('TypeScript compilation errors found');
      
      // Try to auto-fix with stub generator
      try {
        console.log('🔧 Attempting to fix with stub generator...');
        execSync('npm run stubs:generate', { cwd: this.projectRoot });
        console.log('✅ Stub generator completed');
      } catch (stubError) {
        console.warn('⚠️  Stub generator failed:', stubError.message);
      }
    }
    
    // Check critical files exist
    const criticalFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/components/ui/button.tsx',
      'src/lib/firebase.ts'
    ];
    
    for (const file of criticalFiles) {
      if (!fs.existsSync(path.join(this.projectRoot, file))) {
        this.results.criticalIssues.push(`Missing critical file: ${file}`);
      }
    }
    
    console.log('✅ Pre-flight checks completed');
  }

  async runTestSuite(suiteType) {
    const suite = this.testSuites[suiteType];
    if (!suite) {
      throw new Error(`Unknown test suite: ${suiteType}`);
    }
    
    console.log(`🧪 Running ${suite.name} tests...`);
    
    const playwrightCmd = this.buildPlaywrightCommand(suite.spec);
    
    try {
      const output = execSync(playwrightCmd, {
        encoding: 'utf8',
        cwd: this.projectRoot,
        timeout: this.config.timeoutMs * 2
      });
      
      await this.parseTestResults(output);
      console.log(`✅ ${suite.name} tests completed`);
      
    } catch (error) {
      console.error(`❌ ${suite.name} tests failed`);
      await this.parseTestResults(error.stdout || error.stderr || '');
      
      // Continue with analysis even if tests failed
      this.results.criticalIssues.push(`Test suite failed: ${suite.name}`);
    }
  }

  buildPlaywrightCommand(specPattern) {
    const cmd = [
      'npx playwright test',
      specPattern,
      '--config=playwright.config.ts',
      `--workers=${this.config.parallelWorkers}`,
      `--retries=${this.config.maxRetries}`,
      '--reporter=json,html,junit'
    ];
    
    if (this.config.headless) {
      cmd.push('--headed=false');
    }
    
    if (this.config.browsers.length > 0) {
      cmd.push(`--project=${this.config.browsers.join(',')}`);
    }
    
    return cmd.join(' ');
  }

  async parseTestResults(output) {
    try {
      // Try to read JSON results if available
      const jsonResultsPath = path.join(this.testResultsDir, 'results.json');
      
      if (fs.existsSync(jsonResultsPath)) {
        const results = JSON.parse(fs.readFileSync(jsonResultsPath, 'utf8'));
        
        this.results.totalTests = results.stats?.total || 0;
        this.results.passedTests = results.stats?.passed || 0;
        this.results.failedTests = results.stats?.failed || 0;
        this.results.skippedTests = results.stats?.skipped || 0;
        
        // Extract critical issues from failed tests
        if (results.suites) {
          results.suites.forEach(suite => {
            suite.specs?.forEach(spec => {
              spec.tests?.forEach(test => {
                if (test.status === 'failed') {
                  this.results.criticalIssues.push(`Failed: ${test.title}`);
                }
              });
            });
          });
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not parse detailed test results:', error.message);
    }
    
    // Parse from stdout/stderr as fallback
    const passedMatch = output.match(/(\d+) passed/);
    const failedMatch = output.match(/(\d+) failed/);
    
    if (passedMatch) this.results.passedTests = parseInt(passedMatch[1]);
    if (failedMatch) this.results.failedTests = parseInt(failedMatch[1]);
  }

  async generateReports() {
    console.log('📊 Generating test reports...');
    
    this.results.endTime = new Date();
    this.results.duration = this.results.endTime - this.results.startTime;
    
    // Generate summary report
    const summaryReport = {
      meta: {
        timestamp: this.results.startTime.toISOString(),
        duration: `${Math.round(this.results.duration / 1000)}s`,
        environment: 'development'
      },
      results: {
        total: this.results.totalTests,
        passed: this.results.passedTests,
        failed: this.results.failedTests,
        skipped: this.results.skippedTests,
        successRate: this.results.totalTests > 0 
          ? Math.round((this.results.passedTests / this.results.totalTests) * 100) 
          : 0
      },
      issues: {
        critical: this.results.criticalIssues,
        warnings: this.results.warnings,
        recommendations: this.generateRecommendations()
      },
      artifacts: {
        screenshots: fs.existsSync(path.join(this.testResultsDir, 'screenshots')),
        videos: fs.existsSync(path.join(this.testResultsDir, 'videos')),
        traces: fs.existsSync(path.join(this.testResultsDir, 'traces'))
      }
    };
    
    // Save reports
    const reportPath = path.join(this.reportsDir, `e2e-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(summaryReport, null, 2));
    
    // Generate human-readable summary
    this.printSummary(summaryReport);
    
    console.log(`📄 Detailed report saved: ${reportPath}`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.criticalIssues.length > 0) {
      recommendations.push('🚨 Fix critical issues before deployment');
      recommendations.push('Run "npm run stubs:generate" to fix import issues');
    }
    
    if (this.results.failedTests > 0) {
      recommendations.push('🔧 Review failed test cases and implement fixes');
    }
    
    if (this.results.warnings.length > 0) {
      recommendations.push('⚠️  Address warnings to improve stability');
    }
    
    if (this.results.passedTests === this.results.totalTests && this.results.totalTests > 0) {
      recommendations.push('✅ All tests passing - ready for deployment');
    }
    
    return recommendations;
  }

  printSummary(report) {
    console.log('\n📊 E2E Test Summary');
    console.log('==================');
    console.log(`Duration: ${report.meta.duration}`);
    console.log(`Total Tests: ${report.results.total}`);
    console.log(`✅ Passed: ${report.results.passed}`);
    console.log(`❌ Failed: ${report.results.failed}`);
    console.log(`⏭️  Skipped: ${report.results.skipped}`);
    console.log(`📈 Success Rate: ${report.results.successRate}%`);
    
    if (report.issues.critical.length > 0) {
      console.log('\n🚨 Critical Issues:');
      report.issues.critical.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (report.issues.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      report.issues.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    if (report.issues.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.issues.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
  }

  async checkDevServer() {
    try {
      const { default: fetch } = await import('node-fetch');
      const response = await fetch('http://localhost:3000', { timeout: 3000 });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async startDevServer() {
    return new Promise((resolve, reject) => {
      console.log('🚀 Starting dev server...');
      
      const devProcess = spawn('npm', ['run', 'dev'], {
        cwd: this.projectRoot,
        stdio: 'pipe'
      });
      
      devProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready') || output.includes('localhost:3000')) {
          console.log('✅ Dev server started');
          resolve();
        }
      });
      
      devProcess.stderr.on('data', (data) => {
        console.error('Dev server error:', data.toString());
      });
      
      // Timeout after 60 seconds
      setTimeout(() => {
        reject(new Error('Dev server startup timeout'));
      }, 60000);
    });
  }

  async waitForServer(url, timeoutMs) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const { default: fetch } = await import('node-fetch');
        const response = await fetch(url, { timeout: 3000 });
        if (response.ok) return true;
      } catch (error) {
        // Continue waiting
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Server at ${url} not ready within ${timeoutMs}ms`);
  }

  async handleFailure(error) {
    console.error('🔧 Handling test failure...');
    
    // Save failure report
    const failureReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      results: this.results,
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      }
    };
    
    const failurePath = path.join(this.reportsDir, `failure-report-${Date.now()}.json`);
    fs.writeFileSync(failurePath, JSON.stringify(failureReport, null, 2));
    
    console.log(`💾 Failure report saved: ${failurePath}`);
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    // Clean up old reports (keep last 10)
    try {
      const reports = fs.readdirSync(this.reportsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(this.reportsDir, file),
          mtime: fs.statSync(path.join(this.reportsDir, file)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      if (reports.length > 10) {
        const toDelete = reports.slice(10);
        toDelete.forEach(report => {
          fs.unlinkSync(report.path);
        });
        console.log(`🗑️  Cleaned up ${toDelete.length} old reports`);
      }
    } catch (error) {
      console.warn('⚠️  Could not clean up old reports:', error.message);
    }
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const suiteType = args[0] || 'dependency-validation';
  
  const options = {};
  
  // Parse CLI options
  if (args.includes('--headless=false')) options.headless = false;
  if (args.includes('--no-auto-start')) options.autoStartDev = false;
  
  const runner = new AutomatedE2ERunner();
  runner.run(suiteType, options)
    .then(results => {
      console.log('🎉 Test run completed successfully');
      process.exit(results.failedTests > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test run failed:', error.message);
      process.exit(1);
    });
}

module.exports = AutomatedE2ERunner;