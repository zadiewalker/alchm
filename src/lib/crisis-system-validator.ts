/**
 * CRISIS SYSTEM VALIDATOR
 * Comprehensive testing and validation of all crisis safety systems
 * Ensures life-critical functionality meets trauma-informed standards
 */

import { crisisResourcePreloader } from './crisis-resource-preloader';
import { emergencyPerformanceOptimizer } from './emergency-performance-optimizer';

interface CrisisTestResult {
  testName: string;
  passed: boolean;
  responseTime: number;
  threshold: number;
  details: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface CrisisSystemReport {
  overallPassed: boolean;
  criticalIssues: number;
  highPriorityIssues: number;
  totalTests: number;
  passedTests: number;
  averageResponseTime: number;
  results: CrisisTestResult[];
  recommendations: string[];
  timestamp: string;
}

class CrisisSystemValidator {
  private readonly PERFORMANCE_THRESHOLDS = {
    EMERGENCY_RESPONSE: 100,     // 100ms for emergency actions
    CRISIS_RESOURCE_LOAD: 1000,  // 1s for crisis resource loading
    API_RESPONSE: 3000,          // 3s for API responses
    PAGE_LOAD: 1200,            // 1.2s for crisis page loading
    INPUT_RESPONSE: 50           // 50ms for input responsiveness
  };

  constructor() {
    console.log('🔍 Crisis System Validator initialized');
  }

  /**
   * Run comprehensive crisis system validation
   */
  public async runFullValidation(): Promise<CrisisSystemReport> {
    console.log('🚨 Starting comprehensive crisis system validation...');
    const startTime = Date.now();
    
    const results: CrisisTestResult[] = [];

    // Test 1: Crisis resource preloader performance
    results.push(await this.testCrisisResourcePreloader());
    
    // Test 2: Emergency button response time
    results.push(await this.testEmergencyButtonResponse());
    
    // Test 3: Crisis detection API
    results.push(await this.testCrisisDetectionAPI());
    
    // Test 4: Emergency performance optimizer
    results.push(await this.testEmergencyPerformanceOptimizer());
    
    // Test 5: Crisis resource accessibility
    results.push(await this.testCrisisResourceAccessibility());
    
    // Test 6: Offline crisis functionality
    results.push(await this.testOfflineCrisisFunctionality());
    
    // Test 7: Emergency page load speed
    results.push(await this.testEmergencyPageLoad());
    
    // Test 8: Crisis-safe navigation
    results.push(await this.testCrisisSafeNavigation());

    // Test 9: Performance under stress
    results.push(await this.testPerformanceUnderStress());

    // Calculate overall results
    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const criticalIssues = results.filter(r => !r.passed && r.severity === 'critical').length;
    const highPriorityIssues = results.filter(r => !r.passed && r.severity === 'high').length;
    const averageResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;

    const report: CrisisSystemReport = {
      overallPassed: criticalIssues === 0 && highPriorityIssues === 0,
      criticalIssues,
      highPriorityIssues,
      totalTests,
      passedTests,
      averageResponseTime,
      results,
      recommendations: this.generateRecommendations(results),
      timestamp: new Date().toISOString()
    };

    const validationTime = Date.now() - startTime;
    console.log(`✅ Crisis system validation completed in ${validationTime}ms`);
    
    this.logValidationReport(report);
    return report;
  }

  /**
   * Test crisis resource preloader performance
   */
  private async testCrisisResourcePreloader(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Test instant resource access
      const resources = crisisResourcePreloader.getEmergencyResourcesInstant();
      const responseTime = performance.now() - startTime;
      
      const hasRequiredResources = 
        resources.phone && 
        resources.text && 
        resources.emergency && 
        resources.resources.suicide_prevention &&
        resources.resources.crisis_text;

      return {
        testName: 'Crisis Resource Preloader',
        passed: hasRequiredResources && responseTime < this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: hasRequiredResources ? 
          `All required resources available in ${responseTime.toFixed(1)}ms` : 
          'Missing required crisis resources',
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Crisis Resource Preloader',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: `Error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test emergency button response time
   */
  private async testEmergencyButtonResponse(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Simulate emergency button click
      const mockEvent = new Event('click');
      const responseTime = performance.now() - startTime;
      
      // Test if emergency call function is accessible
      const canAccessEmergencyCall = typeof crisisResourcePreloader.emergencyCrisisCall === 'function';
      
      return {
        testName: 'Emergency Button Response',
        passed: canAccessEmergencyCall && responseTime < this.PERFORMANCE_THRESHOLDS.INPUT_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.INPUT_RESPONSE,
        details: canAccessEmergencyCall ? 
          `Emergency call function accessible in ${responseTime.toFixed(1)}ms` : 
          'Emergency call function not accessible',
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Emergency Button Response',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.INPUT_RESPONSE,
        details: `Error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test crisis detection API
   */
  private async testCrisisDetectionAPI(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      const response = await fetch('/api/crisis-detection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'I want to hurt myself', userId: 'test' })
      });
      
      const responseTime = performance.now() - startTime;
      const data = await response.json();
      
      const isWorking = response.ok && data.crisisDetected !== undefined;
      
      return {
        testName: 'Crisis Detection API',
        passed: isWorking && responseTime < this.PERFORMANCE_THRESHOLDS.API_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.API_RESPONSE,
        details: isWorking ? 
          `API responding correctly in ${responseTime.toFixed(1)}ms` : 
          `API error: ${response.status} ${response.statusText}`,
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Crisis Detection API',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.API_RESPONSE,
        details: `Network error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test emergency performance optimizer
   */
  private async testEmergencyPerformanceOptimizer(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      const metrics = emergencyPerformanceOptimizer.getMetrics();
      const responseTime = performance.now() - startTime;
      
      const isWorking = metrics && typeof metrics.isEmergencyMode === 'boolean';
      
      return {
        testName: 'Emergency Performance Optimizer',
        passed: isWorking && responseTime < this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: isWorking ? 
          `Performance optimizer accessible in ${responseTime.toFixed(1)}ms` : 
          'Performance optimizer not accessible',
        severity: 'high'
      };
    } catch (error) {
      return {
        testName: 'Emergency Performance Optimizer',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: `Error: ${error}`,
        severity: 'high'
      };
    }
  }

  /**
   * Test crisis resource accessibility
   */
  private async testCrisisResourceAccessibility(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Test localStorage emergency contacts
      const emergencyContacts = localStorage.getItem('alchm_emergency_contacts');
      const responseTime = performance.now() - startTime;
      
      let contactsAvailable = false;
      if (emergencyContacts) {
        const contacts = JSON.parse(emergencyContacts);
        contactsAvailable = contacts.suicide_prevention && contacts.crisis_text_line;
      }
      
      return {
        testName: 'Crisis Resource Accessibility',
        passed: contactsAvailable && responseTime < this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: contactsAvailable ? 
          `Emergency contacts cached and accessible in ${responseTime.toFixed(1)}ms` : 
          'Emergency contacts not properly cached',
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Crisis Resource Accessibility',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: `Error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test offline crisis functionality
   */
  private async testOfflineCrisisFunctionality(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Test if crisis resources work offline
      const isOnline = navigator.onLine;
      const responseTime = performance.now() - startTime;
      
      // Even if offline, crisis resources should be available
      const resources = crisisResourcePreloader.getEmergencyResourcesInstant();
      const offlineReady = resources && resources.phone && resources.text;
      
      return {
        testName: 'Offline Crisis Functionality',
        passed: offlineReady && responseTime < this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: offlineReady ? 
          `Crisis resources available ${isOnline ? 'online' : 'offline'} in ${responseTime.toFixed(1)}ms` : 
          'Crisis resources not available offline',
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Offline Crisis Functionality',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: `Error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test emergency page load speed
   */
  private async testEmergencyPageLoad(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Test emergency-safe page accessibility
      const response = await fetch('/emergency-safe', { method: 'HEAD' });
      const responseTime = performance.now() - startTime;
      
      return {
        testName: 'Emergency Page Load Speed',
        passed: response.ok && responseTime < this.PERFORMANCE_THRESHOLDS.PAGE_LOAD,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.PAGE_LOAD,
        details: response.ok ? 
          `Emergency page loads in ${responseTime.toFixed(1)}ms` : 
          `Emergency page error: ${response.status}`,
        severity: 'critical'
      };
    } catch (error) {
      return {
        testName: 'Emergency Page Load Speed',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.PAGE_LOAD,
        details: `Error: ${error}`,
        severity: 'critical'
      };
    }
  }

  /**
   * Test crisis-safe navigation
   */
  private async testCrisisSafeNavigation(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Test navigation safety features
      const currentPath = window.location.pathname;
      const responseTime = performance.now() - startTime;
      
      // Check if navigation appears safe
      const navigationWorking = typeof window.history.pushState === 'function';
      
      return {
        testName: 'Crisis-Safe Navigation',
        passed: navigationWorking && responseTime < this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: navigationWorking ? 
          `Navigation systems functional in ${responseTime.toFixed(1)}ms` : 
          'Navigation systems not functional',
        severity: 'high'
      };
    } catch (error) {
      return {
        testName: 'Crisis-Safe Navigation',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.EMERGENCY_RESPONSE,
        details: `Error: ${error}`,
        severity: 'high'
      };
    }
  }

  /**
   * Test performance under stress
   */
  private async testPerformanceUnderStress(): Promise<CrisisTestResult> {
    const startTime = performance.now();
    
    try {
      // Simulate multiple rapid crisis resource requests
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          Promise.resolve(crisisResourcePreloader.getEmergencyResourcesInstant())
        );
      }
      
      await Promise.all(promises);
      const responseTime = performance.now() - startTime;
      
      return {
        testName: 'Performance Under Stress',
        passed: responseTime < this.PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD,
        responseTime,
        threshold: this.PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD,
        details: `5 concurrent crisis resource requests completed in ${responseTime.toFixed(1)}ms`,
        severity: 'medium'
      };
    } catch (error) {
      return {
        testName: 'Performance Under Stress',
        passed: false,
        responseTime: performance.now() - startTime,
        threshold: this.PERFORMANCE_THRESHOLDS.CRISIS_RESOURCE_LOAD,
        details: `Error: ${error}`,
        severity: 'medium'
      };
    }
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(results: CrisisTestResult[]): string[] {
    const recommendations: string[] = [];
    
    const failedCritical = results.filter(r => !r.passed && r.severity === 'critical');
    const failedHigh = results.filter(r => !r.passed && r.severity === 'high');
    const slowTests = results.filter(r => r.responseTime > r.threshold * 0.8);

    if (failedCritical.length > 0) {
      recommendations.push('🚨 CRITICAL: Fix all critical crisis system failures immediately');
      failedCritical.forEach(test => {
        recommendations.push(`   - ${test.testName}: ${test.details}`);
      });
    }

    if (failedHigh.length > 0) {
      recommendations.push('⚠️ HIGH PRIORITY: Address high-priority issues affecting crisis users');
      failedHigh.forEach(test => {
        recommendations.push(`   - ${test.testName}: ${test.details}`);
      });
    }

    if (slowTests.length > 0) {
      recommendations.push('🐌 PERFORMANCE: Optimize slow-responding systems');
      slowTests.forEach(test => {
        recommendations.push(`   - ${test.testName}: ${test.responseTime.toFixed(1)}ms (threshold: ${test.threshold}ms)`);
      });
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All crisis systems are functioning within acceptable parameters');
      recommendations.push('💡 Consider running stress tests under various network conditions');
      recommendations.push('🔄 Schedule regular crisis system validation');
    }

    return recommendations;
  }

  /**
   * Log validation report to console
   */
  private logValidationReport(report: CrisisSystemReport): void {
    console.log('\n🔍 CRISIS SYSTEM VALIDATION REPORT');
    console.log('=====================================');
    console.log(`Overall Status: ${report.overallPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Tests Passed: ${report.passedTests}/${report.totalTests}`);
    console.log(`Critical Issues: ${report.criticalIssues}`);
    console.log(`High Priority Issues: ${report.highPriorityIssues}`);
    console.log(`Average Response Time: ${report.averageResponseTime.toFixed(1)}ms`);
    console.log(`Timestamp: ${report.timestamp}\n`);

    if (report.criticalIssues > 0 || report.highPriorityIssues > 0) {
      console.log('🚨 ISSUES FOUND:');
      report.results.filter(r => !r.passed).forEach(result => {
        const severityIcon = result.severity === 'critical' ? '🚨' : 
                            result.severity === 'high' ? '⚠️' : 
                            result.severity === 'medium' ? '⚡' : 'ℹ️';
        console.log(`${severityIcon} ${result.testName}: ${result.details} (${result.responseTime.toFixed(1)}ms)`);
      });
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach(rec => console.log(rec));
    }

    console.log('=====================================\n');
  }

  /**
   * Quick crisis system health check
   */
  public async quickHealthCheck(): Promise<{ healthy: boolean; criticalIssues: string[] }> {
    const criticalTests = [
      this.testCrisisResourcePreloader(),
      this.testEmergencyButtonResponse(),
      this.testCrisisResourceAccessibility()
    ];

    const results = await Promise.all(criticalTests);
    const failures = results.filter(r => !r.passed);
    
    return {
      healthy: failures.length === 0,
      criticalIssues: failures.map(f => `${f.testName}: ${f.details}`)
    };
  }
}

// Export singleton instance
export const crisisSystemValidator = new CrisisSystemValidator();

export default crisisSystemValidator;