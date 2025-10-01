/**
 * AI Safety Test Runner
 * 
 * Executes comprehensive AI safety validation and generates detailed reports
 * for App Store compliance verification.
 */

import { 
  aiSafetyValidator, 
  AI_SAFETY_TEST_SCENARIOS,
  SafetyValidationResult,
  ComprehensiveSafetyReport,
  SafetyTestScenario
} from './ai-safety-validation-suite';

export interface TestExecutionSummary {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  criticalIssues: number;
  appStoreReady: boolean;
  executionTimeMs: number;
  complianceScore: number;
}

export class AISafetyTestRunner {
  
  /**
   * Execute live API tests against actual Khepera endpoint
   */
  async executeLiveValidation(): Promise<{
    summary: TestExecutionSummary;
    report: ComprehensiveSafetyReport;
    detailedLog: string;
  }> {
    const startTime = Date.now();
    const logEntries: string[] = [];
    
    logEntries.push('='.repeat(80));
    logEntries.push('ALCHM AI SAFETY VALIDATION - LIVE EXECUTION');
    logEntries.push('='.repeat(80));
    logEntries.push(`Started: ${new Date().toISOString()}`);
    logEntries.push(`Total Test Scenarios: ${AI_SAFETY_TEST_SCENARIOS.length}`);
    logEntries.push('');
    
    try {
      // Execute comprehensive validation
      logEntries.push('Executing comprehensive safety validation...');
      const report = await aiSafetyValidator.executeComprehensiveValidation();
      
      const executionTime = Date.now() - startTime;
      
      // Generate execution summary
      const summary: TestExecutionSummary = {
        timestamp: new Date().toISOString(),
        totalTests: AI_SAFETY_TEST_SCENARIOS.length,
        passedTests: report.detailedResults.filter(r => r.passed).length,
        failedTests: report.detailedResults.filter(r => !r.passed).length,
        criticalIssues: report.criticalFailures,
        appStoreReady: report.appStoreReadiness,
        executionTimeMs: executionTime,
        complianceScore: report.overallCompliance
      };
      
      // Generate detailed log
      logEntries.push('');
      logEntries.push('EXECUTION SUMMARY:');
      logEntries.push('-'.repeat(50));
      logEntries.push(`Total Tests: ${summary.totalTests}`);
      logEntries.push(`Passed: ${summary.passedTests}`);
      logEntries.push(`Failed: ${summary.failedTests}`);
      logEntries.push(`Critical Issues: ${summary.criticalIssues}`);
      logEntries.push(`App Store Ready: ${summary.appStoreReady ? 'YES' : 'NO'}`);
      logEntries.push(`Compliance Score: ${summary.complianceScore}%`);
      logEntries.push(`Execution Time: ${executionTime}ms`);
      logEntries.push('');
      
      // Category breakdown
      logEntries.push('CATEGORY BREAKDOWN:');
      logEntries.push('-'.repeat(50));
      Object.entries(report.categoryResults).forEach(([category, results]) => {
        logEntries.push(`${category.toUpperCase()}: ${results.passed}/${results.passed + results.failed} passed (${results.compliance}%)`);
      });
      logEntries.push('');
      
      // Critical failures (must be fixed for App Store)
      if (report.criticalFailures > 0) {
        logEntries.push('CRITICAL FAILURES (MUST FIX FOR APP STORE):');
        logEntries.push('-'.repeat(50));
        report.detailedResults
          .filter(r => r.riskLevel === 'critical' && !r.passed)
          .forEach(result => {
            logEntries.push(`❌ ${result.scenarioId}`);
            result.failures.forEach(failure => {
              logEntries.push(`   - ${failure}`);
            });
          });
        logEntries.push('');
      }
      
      // High risk issues
      if (report.highRiskIssues > 0) {
        logEntries.push('HIGH RISK ISSUES:');
        logEntries.push('-'.repeat(50));
        report.detailedResults
          .filter(r => r.riskLevel === 'high' && !r.passed)
          .forEach(result => {
            logEntries.push(`⚠️  ${result.scenarioId}`);
            result.failures.forEach(failure => {
              logEntries.push(`   - ${failure}`);
            });
          });
        logEntries.push('');
      }
      
      // Mandatory fixes
      if (report.mandatoryFixes.length > 0) {
        logEntries.push('MANDATORY FIXES FOR APP STORE APPROVAL:');
        logEntries.push('-'.repeat(50));
        report.mandatoryFixes.forEach(fix => {
          logEntries.push(`🚨 ${fix}`);
        });
        logEntries.push('');
      }
      
      // Recommendations
      if (report.recommendations.length > 0) {
        logEntries.push('RECOMMENDATIONS:');
        logEntries.push('-'.repeat(50));
        report.recommendations.forEach(rec => {
          logEntries.push(`💡 ${rec}`);
        });
        logEntries.push('');
      }
      
      // Detailed test results
      logEntries.push('DETAILED TEST RESULTS:');
      logEntries.push('-'.repeat(50));
      report.detailedResults.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        const scenario = AI_SAFETY_TEST_SCENARIOS.find(s => s.id === result.scenarioId);
        logEntries.push(`${status} ${result.scenarioId} (${result.responseTime}ms)`);
        
        if (scenario) {
          logEntries.push(`   Category: ${scenario.category}`);
          logEntries.push(`   Description: ${scenario.description}`);
          logEntries.push(`   Severity: ${scenario.severityLevel}`);
          logEntries.push(`   App Store Guideline: ${scenario.appStoreCompliance.guideline}`);
        }
        
        if (result.failures.length > 0) {
          logEntries.push('   Failures:');
          result.failures.forEach(failure => {
            logEntries.push(`     - ${failure}`);
          });
        }
        
        if (result.warnings.length > 0) {
          logEntries.push('   Warnings:');
          result.warnings.forEach(warning => {
            logEntries.push(`     - ${warning}`);
          });
        }
        
        logEntries.push('');
      });
      
      // Final assessment
      logEntries.push('FINAL ASSESSMENT:');
      logEntries.push('-'.repeat(50));
      if (summary.appStoreReady) {
        logEntries.push('✅ READY FOR APP STORE SUBMISSION');
        logEntries.push('All critical safety requirements have been met.');
      } else {
        logEntries.push('❌ NOT READY FOR APP STORE SUBMISSION');
        logEntries.push('Critical issues must be resolved before submission.');
      }
      
      logEntries.push('');
      logEntries.push(`Completed: ${new Date().toISOString()}`);
      logEntries.push('='.repeat(80));
      
      return {
        summary,
        report,
        detailedLog: logEntries.join('\n')
      };
      
    } catch (error) {
      logEntries.push(`FATAL ERROR: ${error.message}`);
      logEntries.push('Test execution failed');
      
      const summary: TestExecutionSummary = {
        timestamp: new Date().toISOString(),
        totalTests: AI_SAFETY_TEST_SCENARIOS.length,
        passedTests: 0,
        failedTests: AI_SAFETY_TEST_SCENARIOS.length,
        criticalIssues: 1,
        appStoreReady: false,
        executionTimeMs: Date.now() - startTime,
        complianceScore: 0
      };
      
      const report: ComprehensiveSafetyReport = {
        overallCompliance: 0,
        criticalFailures: 1,
        highRiskIssues: 0,
        mediumRiskIssues: 0,
        lowRiskIssues: 0,
        categoryResults: {},
        detailedResults: [],
        appStoreReadiness: false,
        recommendations: ['Fix fatal test execution error'],
        mandatoryFixes: [`CRITICAL: Test execution failed - ${error.message}`]
      };
      
      return {
        summary,
        report,
        detailedLog: logEntries.join('\n')
      };
    }
  }
  
  /**
   * Execute specific category of tests
   */
  async executeCategoryTests(category: string): Promise<SafetyValidationResult[]> {
    const categoryScenarios = AI_SAFETY_TEST_SCENARIOS.filter(s => s.category === category);
    const results: SafetyValidationResult[] = [];
    
    for (const scenario of categoryScenarios) {
      const result = await aiSafetyValidator.validateScenario(scenario);
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Execute single test scenario
   */
  async executeSingleTest(scenarioId: string): Promise<SafetyValidationResult | null> {
    const scenario = AI_SAFETY_TEST_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return null;
    }
    
    return await aiSafetyValidator.validateScenario(scenario);
  }
  
  /**
   * Generate App Store compliance report
   */
  generateAppStoreComplianceReport(report: ComprehensiveSafetyReport): string {
    const reportLines: string[] = [];
    
    reportLines.push('# ALCHM AI Safety Compliance Report');
    reportLines.push('## App Store Submission Readiness Assessment');
    reportLines.push('');
    
    // Executive Summary
    reportLines.push('## Executive Summary');
    reportLines.push('');
    reportLines.push(`- **Overall Compliance Score**: ${report.overallCompliance}%`);
    reportLines.push(`- **App Store Readiness**: ${report.appStoreReadiness ? '✅ READY' : '❌ NOT READY'}`);
    reportLines.push(`- **Critical Issues**: ${report.criticalFailures}`);
    reportLines.push(`- **High Risk Issues**: ${report.highRiskIssues}`);
    reportLines.push('');
    
    // Compliance by Category
    reportLines.push('## Compliance by Category');
    reportLines.push('');
    Object.entries(report.categoryResults).forEach(([category, results]) => {
      const emoji = results.compliance >= 90 ? '✅' : results.compliance >= 70 ? '⚠️' : '❌';
      reportLines.push(`- **${category.replace('_', ' ').toUpperCase()}**: ${emoji} ${results.compliance}% (${results.passed}/${results.passed + results.failed})`);
    });
    reportLines.push('');
    
    // Critical Issues
    if (report.criticalFailures > 0) {
      reportLines.push('## 🚨 Critical Issues (Must Fix for App Store)');
      reportLines.push('');
      const criticalResults = report.detailedResults.filter(r => r.riskLevel === 'critical' && !r.passed);
      criticalResults.forEach(result => {
        const scenario = AI_SAFETY_TEST_SCENARIOS.find(s => s.id === result.scenarioId);
        reportLines.push(`### ${result.scenarioId}`);
        if (scenario) {
          reportLines.push(`**Guideline**: ${scenario.appStoreCompliance.guideline}`);
          reportLines.push(`**Requirement**: ${scenario.appStoreCompliance.requirement}`);
        }
        reportLines.push('**Failures**:');
        result.failures.forEach(failure => {
          reportLines.push(`- ${failure}`);
        });
        reportLines.push('');
      });
    }
    
    // Mandatory Fixes
    if (report.mandatoryFixes.length > 0) {
      reportLines.push('## Mandatory Fixes');
      reportLines.push('');
      report.mandatoryFixes.forEach(fix => {
        reportLines.push(`- ${fix}`);
      });
      reportLines.push('');
    }
    
    // Recommendations
    if (report.recommendations.length > 0) {
      reportLines.push('## Recommendations');
      reportLines.push('');
      report.recommendations.forEach(rec => {
        reportLines.push(`- ${rec}`);
      });
      reportLines.push('');
    }
    
    // App Store Guidelines Coverage
    reportLines.push('## App Store Guidelines Coverage');
    reportLines.push('');
    const guidelines = Array.from(new Set(AI_SAFETY_TEST_SCENARIOS.map(s => s.appStoreCompliance.guideline)));
    guidelines.forEach(guideline => {
      const guidelineTests = AI_SAFETY_TEST_SCENARIOS.filter(s => s.appStoreCompliance.guideline === guideline);
      const passedTests = report.detailedResults.filter(r => 
        guidelineTests.some(gt => gt.id === r.scenarioId) && r.passed
      ).length;
      const compliance = Math.round((passedTests / guidelineTests.length) * 100);
      const emoji = compliance >= 90 ? '✅' : compliance >= 70 ? '⚠️' : '❌';
      reportLines.push(`- **${guideline}**: ${emoji} ${compliance}% (${passedTests}/${guidelineTests.length})`);
    });
    reportLines.push('');
    
    // Conclusion
    reportLines.push('## Conclusion');
    reportLines.push('');
    if (report.appStoreReadiness) {
      reportLines.push('✅ **ALCHM is ready for App Store submission**');
      reportLines.push('');
      reportLines.push('All critical safety requirements have been validated and met. The AI system demonstrates:');
      reportLines.push('- Proper medical advice boundaries');
      reportLines.push('- Accurate crisis detection with appropriate intervention');
      reportLines.push('- Cultural sensitivity across diverse populations');
      reportLines.push('- Clear AI transparency and limitation disclosure');
      reportLines.push('- Reliable performance under various conditions');
    } else {
      reportLines.push('❌ **ALCHM is NOT ready for App Store submission**');
      reportLines.push('');
      reportLines.push('Critical safety issues must be resolved before submission. Priority should be given to:');
      if (report.criticalFailures > 0) {
        reportLines.push('- Resolving all critical failures');
      }
      if (report.highRiskIssues > 0) {
        reportLines.push('- Addressing high-risk safety issues');
      }
      reportLines.push('- Implementing mandatory fixes listed above');
    }
    
    return reportLines.join('\n');
  }
}

// Export singleton instance
export const aiSafetyTestRunner = new AISafetyTestRunner();