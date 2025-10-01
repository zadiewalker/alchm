#!/usr/bin/env node

/**
 * Performance CI Testing Script for ALCHM
 * Runs comprehensive performance tests in CI/CD pipeline
 */

const { PerformanceTestingPipeline, PERFORMANCE_TEST_CONFIGS } = require('../src/lib/performance-testing-pipeline');
const fs = require('fs').promises;
const path = require('path');

class PerformanceCIRunner {
  constructor() {
    this.args = process.argv.slice(2);
    this.config = this.parseConfig();
    this.failOnBudgetExceeded = this.args.includes('--fail-on-budget-exceeded');
    this.verbose = this.args.includes('--verbose');
  }

  parseConfig() {
    const configArg = this.args.find(arg => arg.startsWith('--config='));
    const configName = configArg ? configArg.split('=')[1] : 'comprehensive';
    
    if (!PERFORMANCE_TEST_CONFIGS[configName]) {
      console.error(`❌ Unknown config: ${configName}`);
      console.log('Available configs:', Object.keys(PERFORMANCE_TEST_CONFIGS).join(', '));
      process.exit(1);
    }
    
    return PERFORMANCE_TEST_CONFIGS[configName];
  }

  async run() {
    console.log('🚀 ALCHM Performance CI Testing Pipeline');
    console.log('=' .repeat(50));
    console.log(`📋 Config: ${this.getConfigName()}`);
    console.log(`📱 Device: ${this.config.device}`);
    console.log(`🌐 Connection: ${this.config.connection}`);
    console.log(`🔄 Iterations: ${this.config.iterations}`);
    console.log(`❌ Fail on budget exceeded: ${this.failOnBudgetExceeded}`);
    console.log('');

    try {
      // Initialize pipeline
      const pipeline = new PerformanceTestingPipeline(this.config);
      
      // Run test suite
      console.log('🧪 Running performance test suite...');
      const results = await pipeline.runTestSuite();
      
      // Generate reports
      await this.generateReports(results, pipeline);
      
      // Check exit conditions
      await this.checkExitConditions(results);
      
      console.log('✅ Performance testing completed successfully');
      
    } catch (error) {
      console.error('❌ Performance testing failed:', error.message);
      if (this.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  }

  getConfigName() {
    const configArg = this.args.find(arg => arg.startsWith('--config='));
    return configArg ? configArg.split('=')[1] : 'comprehensive';
  }

  async generateReports(results, pipeline) {
    console.log('📋 Generating performance reports...');
    
    // Generate markdown report
    const markdownReport = await pipeline.generateCIReport(results);
    await fs.writeFile('performance-report.md', markdownReport);
    
    // Generate JSON report for programmatic access
    const jsonReport = {
      timestamp: new Date().toISOString(),
      config: this.getConfigName(),
      device: this.config.device,
      connection: this.config.connection,
      ...results
    };
    await fs.writeFile('performance-report.json', JSON.stringify(jsonReport, null, 2));
    
    // Generate HTML report
    const htmlReport = await this.generateHTMLReport(results);
    await fs.writeFile('performance-report.html', htmlReport);
    
    // Create budget report
    const budgetReport = this.generateBudgetReport(results);
    await fs.writeFile('performance-budget-report.json', JSON.stringify(budgetReport, null, 2));
    
    // Critical issues summary
    const criticalIssues = this.extractCriticalIssues(results);
    if (criticalIssues.length > 0) {
      await fs.writeFile('performance-critical-failures.txt', criticalIssues.join('\n'));
    }
    
    console.log('📊 Reports generated:');
    console.log('  - performance-report.md');
    console.log('  - performance-report.json');
    console.log('  - performance-report.html');
    console.log('  - performance-budget-report.json');
    if (criticalIssues.length > 0) {
      console.log('  - performance-critical-failures.txt');
    }
    console.log('');
  }

  async generateHTMLReport(results) {
    const { overall, results: testResults, regression } = results;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALCHM Performance Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .status { font-size: 48px; font-weight: bold; margin: 20px 0; }
        .passed { color: #22c55e; }
        .failed { color: #ef4444; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .metric { background: #f8fafc; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-value { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .good { color: #22c55e; }
        .warning { color: #f59e0b; }
        .poor { color: #ef4444; }
        .test-result { margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .violations { margin: 10px 0; }
        .violation { background: #fef2f2; color: #dc2626; padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 14px; }
        .recommendations { background: #f0f9ff; color: #0369a1; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .regression { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .improvement { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; margin: 10px 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 ALCHM Performance Excellence Report</h1>
            <div class="status ${overall.passed ? 'passed' : 'failed'}">
                ${overall.passed ? '✅ PASSED' : '❌ FAILED'}
            </div>
            <p>Generated: ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div>Overall Score</div>
                <div class="metric-value ${overall.score >= 90 ? 'good' : overall.score >= 70 ? 'warning' : 'poor'}">
                    ${overall.score}/100
                </div>
            </div>
            <div class="metric">
                <div>Tests Passed</div>
                <div class="metric-value ${testResults.filter(r => r.passed).length === testResults.length ? 'good' : 'warning'}">
                    ${testResults.filter(r => r.passed).length}/${testResults.length}
                </div>
            </div>
            <div class="metric">
                <div>Critical Issues</div>
                <div class="metric-value ${overall.criticalIssues === 0 ? 'good' : 'poor'}">
                    ${overall.criticalIssues}
                </div>
            </div>
        </div>
        
        ${regression.hasRegression ? `
        <div class="regression">
            <h3>⚠️ Performance Regressions Detected</h3>
            ${regression.regressions.map(reg => `
                <div><strong>${reg.metric}:</strong> ${reg.baseline} → ${reg.current} (${reg.change > 0 ? '+' : ''}${reg.change.toFixed(1)}) - ${reg.significance}</div>
            `).join('')}
        </div>
        ` : ''}
        
        ${regression.improvements.length > 0 ? `
        <div class="improvement">
            <h3>🚀 Performance Improvements</h3>
            ${regression.improvements.map(imp => `
                <div><strong>${imp.metric}:</strong> ${imp.baseline} → ${imp.current} (+${imp.improvement.toFixed(1)})</div>
            `).join('')}
        </div>
        ` : ''}
        
        <h2>📊 Test Results by Page</h2>
        ${testResults.map(result => `
            <div class="test-result">
                <h3>${result.passed ? '✅' : '❌'} ${result.url}</h3>
                
                <div class="metrics">
                    <div class="metric">
                        <div>Performance</div>
                        <div class="metric-value ${result.lighthouse.performance >= 90 ? 'good' : result.lighthouse.performance >= 70 ? 'warning' : 'poor'}">
                            ${result.lighthouse.performance}/100
                        </div>
                    </div>
                    <div class="metric">
                        <div>Accessibility</div>
                        <div class="metric-value ${result.lighthouse.accessibility >= 90 ? 'good' : 'poor'}">
                            ${result.lighthouse.accessibility}/100
                        </div>
                    </div>
                    <div class="metric">
                        <div>LCP</div>
                        <div class="metric-value">${Math.round(result.lighthouse.metrics.lcp)}ms</div>
                    </div>
                    <div class="metric">
                        <div>CLS</div>
                        <div class="metric-value">${result.lighthouse.metrics.cls.toFixed(3)}</div>
                    </div>
                </div>
                
                ${result.violations.length > 0 ? `
                <div class="violations">
                    <h4>Violations:</h4>
                    ${result.violations.map(violation => `
                        <div class="violation">
                            ${violation.severity === 'critical' ? '🔴' : violation.severity === 'error' ? '🟡' : '🔵'} 
                            ${violation.metric}: ${violation.actual} (threshold: ${violation.threshold})
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${result.recommendations.length > 0 ? `
                <div class="recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  generateBudgetReport(results) {
    const { results: testResults } = results;
    
    const budgetReport = {
      timestamp: new Date().toISOString(),
      overall: {
        budgetPassed: testResults.every(r => r.passed),
        totalViolations: testResults.reduce((sum, r) => sum + r.violations.length, 0),
        criticalViolations: testResults.reduce((sum, r) => 
          sum + r.violations.filter(v => v.severity === 'critical').length, 0
        )
      },
      pages: testResults.map(result => ({
        url: result.url,
        passed: result.passed,
        violations: result.violations,
        metrics: {
          performanceScore: result.lighthouse.performance,
          lcp: Math.round(result.lighthouse.metrics.lcp),
          fid: Math.round(result.lighthouse.metrics.fid),
          cls: parseFloat(result.lighthouse.metrics.cls.toFixed(3)),
          fcp: Math.round(result.lighthouse.metrics.fcp),
          tti: Math.round(result.lighthouse.metrics.tti)
        }
      }))
    };
    
    return budgetReport;
  }

  extractCriticalIssues(results) {
    const criticalIssues = [];
    
    results.results.forEach(result => {
      result.violations.forEach(violation => {
        if (violation.severity === 'critical') {
          criticalIssues.push(`${result.url}: ${violation.metric} - ${violation.actual} exceeds ${violation.threshold}`);
        }
      });
    });
    
    if (results.regression.hasRegression) {
      results.regression.regressions.forEach(regression => {
        if (regression.significance === 'critical') {
          criticalIssues.push(`Regression: ${regression.metric} degraded by ${Math.abs(regression.change).toFixed(1)}`);
        }
      });
    }
    
    return criticalIssues;
  }

  async checkExitConditions(results) {
    const { overall, regression } = results;
    
    // Check for critical issues
    if (overall.criticalIssues > 0) {
      console.error(`❌ ${overall.criticalIssues} critical performance issues detected`);
      if (this.failOnBudgetExceeded) {
        process.exit(1);
      }
    }
    
    // Check for critical regressions
    const criticalRegressions = regression.regressions.filter(r => r.significance === 'critical');
    if (criticalRegressions.length > 0) {
      console.error(`❌ ${criticalRegressions.length} critical performance regressions detected`);
      if (this.failOnBudgetExceeded) {
        process.exit(1);
      }
    }
    
    // Check overall pass rate
    const failedTests = results.results.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.error(`❌ ${failedTests.length} performance tests failed`);
      failedTests.forEach(test => {
        console.error(`  - ${test.url}: ${test.violations.length} violations`);
      });
      
      if (this.failOnBudgetExceeded) {
        process.exit(1);
      }
    }
    
    // Summary
    console.log('📊 Performance Test Summary:');
    console.log(`  Overall Score: ${overall.score}/100`);
    console.log(`  Tests Passed: ${results.results.filter(r => r.passed).length}/${results.results.length}`);
    console.log(`  Critical Issues: ${overall.criticalIssues}`);
    console.log(`  Regressions: ${regression.regressions.length}`);
    console.log(`  Improvements: ${regression.improvements.length}`);
  }
}

// Run the CI performance testing
if (require.main === module) {
  const runner = new PerformanceCIRunner();
  runner.run().catch(error => {
    console.error('Performance CI runner failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceCIRunner;