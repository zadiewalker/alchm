#!/usr/bin/env node

/**
 * Firebase Functions Load Testing Script
 * Tests the performance and reliability of ALCHM Firebase Functions under load
 * Validates crisis-critical functions can handle surge traffic
 */

const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const { performance } = require('perf_hooks');

// Firebase Functions to test
const FUNCTIONS_TO_TEST = [
  {
    name: 'Crisis Detection API',
    endpoint: '/api/crisis-detection',
    method: 'POST',
    payload: {
      text: "I'm feeling really hopeless and don't know what to do",
      userId: 'test_user_123',
      timestamp: Date.now()
    },
    expectedResponseTime: 3000, // 3 seconds max for crisis detection
    critical: true,
    description: 'Analyzes user input for crisis keywords and risk assessment'
  },
  {
    name: 'Journal Save API',
    endpoint: '/api/save',
    method: 'POST',
    payload: {
      content: 'This is a test journal entry for load testing',
      mood: 5,
      timestamp: Date.now(),
      userId: 'test_user_123'
    },
    expectedResponseTime: 2000, // 2 seconds max for journal saves
    critical: true,
    description: 'Saves user journal entries securely to Firestore'
  },
  {
    name: 'AI Reflection API (Khepera)',
    endpoint: '/api/khepera',
    method: 'POST',
    payload: {
      journalEntry: 'Today was challenging but I made it through',
      userId: 'test_user_123',
      mood: 6
    },
    expectedResponseTime: 5000, // 5 seconds max for AI processing
    critical: true,
    description: 'Generates AI-powered reflections and insights'
  },
  {
    name: 'Auth Session Validation',
    endpoint: '/api/auth/session',
    method: 'GET',
    payload: null,
    expectedResponseTime: 800, // 800ms max for auth checks
    critical: true,
    description: 'Validates user authentication sessions'
  },
  {
    name: 'Health Check API',
    endpoint: '/api/health/ping',
    method: 'GET',
    payload: null,
    expectedResponseTime: 500, // 500ms max for health checks
    critical: false,
    description: 'System health monitoring endpoint'
  },
  {
    name: 'System Status API',
    endpoint: '/api/status/systems',
    method: 'GET',
    payload: null,
    expectedResponseTime: 1000, // 1 second max for status
    critical: false,
    description: 'Returns system component status information'
  }
];

// Load testing scenarios
const LOAD_TEST_SCENARIOS = [
  {
    name: 'Normal Load',
    description: 'Typical daily usage patterns',
    concurrentUsers: 10,
    requestsPerUser: 5,
    duration: 30000, // 30 seconds
    rampUpTime: 5000 // 5 seconds
  },
  {
    name: 'Crisis Surge',
    description: 'Spike in usage during crisis events',
    concurrentUsers: 50,
    requestsPerUser: 10,
    duration: 60000, // 60 seconds
    rampUpTime: 10000 // 10 seconds
  },
  {
    name: 'Peak Traffic',
    description: 'Maximum expected concurrent load',
    concurrentUsers: 100,
    requestsPerUser: 3,
    duration: 45000, // 45 seconds
    rampUpTime: 15000 // 15 seconds
  },
  {
    name: 'Crisis Storm',
    description: 'Extreme load during major crisis event',
    concurrentUsers: 200,
    requestsPerUser: 8,
    duration: 90000, // 90 seconds
    rampUpTime: 20000 // 20 seconds
  }
];

class FirebaseFunctionsLoadTester {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.results = [];
    this.activeRequests = 0;
    this.completedRequests = 0;
    this.errorCount = 0;
  }

  async runLoadTests() {
    console.log('🚀 Starting Firebase Functions Load Testing...\n');
    console.log('🎯 Testing ALCHM crisis-critical functions under various load conditions');
    console.log('🚨 Validating performance during crisis surge scenarios\n');
    console.log('=' .repeat(80));

    for (const scenario of LOAD_TEST_SCENARIOS) {
      console.log(`\n📊 Load Test Scenario: ${scenario.name}`);
      console.log(`📝 ${scenario.description}`);
      console.log(`👥 ${scenario.concurrentUsers} concurrent users`);
      console.log(`📨 ${scenario.requestsPerUser} requests per user`);
      console.log(`⏱️  ${scenario.duration/1000}s duration, ${scenario.rampUpTime/1000}s ramp-up`);
      console.log('-'.repeat(60));

      for (const func of FUNCTIONS_TO_TEST) {
        console.log(`\n🔧 Testing Function: ${func.name}`);
        console.log(`🎯 Critical: ${func.critical ? 'YES - User Safety Dependent' : 'NO'}`);
        console.log(`📋 ${func.description}`);
        
        const result = await this.loadTestFunction(func, scenario);
        this.results.push(result);
        
        // Show immediate results for critical functions
        if (func.critical) {
          this.printCriticalResults(result);
        }
        
        // Brief pause between function tests
        await this.sleep(2000);
      }
      
      // Longer pause between scenarios
      console.log('\n⏸️  Cooling down before next scenario...');
      await this.sleep(10000);
    }
  }

  async loadTestFunction(func, scenario) {
    const startTime = performance.now();
    this.activeRequests = 0;
    this.completedRequests = 0;
    this.errorCount = 0;
    
    const responseTimes = [];
    const errorTypes = {};
    const statusCodes = {};

    try {
      // Create all user simulation promises
      const userPromises = [];
      const totalUsers = scenario.concurrentUsers;
      const rampUpInterval = scenario.rampUpTime / totalUsers;

      for (let i = 0; i < totalUsers; i++) {
        const userPromise = this.simulateUser(func, scenario, i * rampUpInterval);
        userPromises.push(userPromise);
      }

      // Wait for all users to complete
      const userResults = await Promise.all(userPromises);
      
      // Aggregate results
      userResults.forEach(userResult => {
        userResult.responseTimes.forEach(rt => responseTimes.push(rt));
        Object.entries(userResult.errorTypes).forEach(([type, count]) => {
          errorTypes[type] = (errorTypes[type] || 0) + count;
        });
        Object.entries(userResult.statusCodes).forEach(([code, count]) => {
          statusCodes[code] = (statusCodes[code] || 0) + count;
        });
      });

      const testDuration = performance.now() - startTime;
      const totalRequests = responseTimes.length + this.errorCount;
      
      // Calculate statistics
      const stats = this.calculateStatistics(responseTimes, totalRequests, testDuration);
      
      // Assess performance
      const assessment = this.assessPerformance(stats, func, scenario);

      return {
        function: func.name,
        endpoint: func.endpoint,
        scenario: scenario.name,
        critical: func.critical,
        statistics: stats,
        assessment,
        errorTypes,
        statusCodes,
        testDuration,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Load test failed for ${func.name}:`, error.message);
      
      return {
        function: func.name,
        endpoint: func.endpoint,
        scenario: scenario.name,
        critical: func.critical,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async simulateUser(func, scenario, delay) {
    // Wait for ramp-up delay
    if (delay > 0) {
      await this.sleep(delay);
    }

    const responseTimes = [];
    const errorTypes = {};
    const statusCodes = {};
    
    // Make requests for this user
    for (let i = 0; i < scenario.requestsPerUser; i++) {
      try {
        const startTime = performance.now();
        const response = await this.makeRequest(func);
        const responseTime = performance.now() - startTime;
        
        responseTimes.push(responseTime);
        statusCodes[response.statusCode] = (statusCodes[response.statusCode] || 0) + 1;
        
        this.completedRequests++;
        
        // Brief pause between requests from same user
        await this.sleep(Math.random() * 1000 + 500); // 500-1500ms
        
      } catch (error) {
        const errorType = this.categorizeError(error);
        errorTypes[errorType] = (errorTypes[errorType] || 0) + 1;
        this.errorCount++;
      }
    }

    return { responseTimes, errorTypes, statusCodes };
  }

  async makeRequest(func) {
    return new Promise((resolve, reject) => {
      const url = new URL(func.endpoint, this.baseUrl);
      const options = {
        method: func.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ALCHM-LoadTest/1.0'
        },
        timeout: func.expectedResponseTime + 5000 // Add 5s buffer
      };

      this.activeRequests++;

      const request = (url.protocol === 'https:' ? https : http).request(url, options, (response) => {
        let data = '';
        
        response.on('data', chunk => {
          data += chunk;
        });
        
        response.on('end', () => {
          this.activeRequests--;
          resolve({
            statusCode: response.statusCode,
            data,
            headers: response.headers
          });
        });
      });

      request.on('error', (error) => {
        this.activeRequests--;
        reject(error);
      });

      request.on('timeout', () => {
        request.destroy();
        this.activeRequests--;
        reject(new Error('Request timeout'));
      });

      // Send payload if present
      if (func.payload) {
        request.write(JSON.stringify(func.payload));
      }
      
      request.end();
    });
  }

  categorizeError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('timeout')) return 'timeout';
    if (message.includes('connection')) return 'connection';
    if (message.includes('econnrefused')) return 'connection_refused';
    if (message.includes('enotfound')) return 'dns_error';
    if (message.includes('socket')) return 'socket_error';
    
    return 'unknown_error';
  }

  calculateStatistics(responseTimes, totalRequests, testDuration) {
    if (responseTimes.length === 0) {
      return {
        totalRequests,
        successfulRequests: 0,
        errorRate: 100,
        averageResponseTime: 0,
        medianResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        throughput: 0,
        testDurationMs: testDuration
      };
    }

    const sortedTimes = responseTimes.sort((a, b) => a - b);
    const successfulRequests = responseTimes.length;
    const errorRate = ((totalRequests - successfulRequests) / totalRequests) * 100;

    return {
      totalRequests,
      successfulRequests,
      errorRate: errorRate.toFixed(2),
      averageResponseTime: (responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length).toFixed(0),
      medianResponseTime: sortedTimes[Math.floor(sortedTimes.length / 2)].toFixed(0),
      p95ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.95)].toFixed(0),
      p99ResponseTime: sortedTimes[Math.floor(sortedTimes.length * 0.99)].toFixed(0),
      minResponseTime: sortedTimes[0].toFixed(0),
      maxResponseTime: sortedTimes[sortedTimes.length - 1].toFixed(0),
      throughput: (successfulRequests / (testDuration / 1000)).toFixed(2),
      testDurationMs: testDuration.toFixed(0)
    };
  }

  assessPerformance(stats, func, scenario) {
    const assessment = {
      passed: false,
      issues: [],
      severity: 'low',
      recommendations: []
    };

    // Check error rate
    const errorRate = parseFloat(stats.errorRate);
    if (errorRate > 5) {
      assessment.issues.push(`High error rate: ${errorRate}%`);
      assessment.severity = func.critical ? 'critical' : 'high';
      assessment.recommendations.push('Investigate and fix error causes');
    } else if (errorRate > 1) {
      assessment.issues.push(`Elevated error rate: ${errorRate}%`);
      assessment.severity = 'medium';
    }

    // Check response times
    const avgResponseTime = parseFloat(stats.averageResponseTime);
    const p95ResponseTime = parseFloat(stats.p95ResponseTime);
    
    if (avgResponseTime > func.expectedResponseTime) {
      assessment.issues.push(`Average response time ${avgResponseTime}ms exceeds ${func.expectedResponseTime}ms threshold`);
      assessment.severity = func.critical ? 'critical' : 'high';
      assessment.recommendations.push('Optimize function performance and cold start times');
    }

    if (p95ResponseTime > func.expectedResponseTime * 1.5) {
      assessment.issues.push(`95th percentile response time ${p95ResponseTime}ms is concerning`);
      assessment.severity = func.critical ? 'critical' : 'high';
      assessment.recommendations.push('Investigate performance outliers and optimize slow queries');
    }

    // Check throughput for high-load scenarios
    if (scenario.concurrentUsers > 50) {
      const throughput = parseFloat(stats.throughput);
      const expectedMinThroughput = scenario.concurrentUsers * 0.5; // Conservative estimate
      
      if (throughput < expectedMinThroughput) {
        assessment.issues.push(`Low throughput: ${throughput} req/s (expected: >${expectedMinThroughput})`);
        assessment.severity = 'high';
        assessment.recommendations.push('Scale Firebase Functions or optimize resource allocation');
      }
    }

    // Crisis-specific assessments
    if (func.critical && scenario.name.includes('Crisis')) {
      if (errorRate > 0.1) {
        assessment.issues.push('ANY errors in crisis functions during crisis scenarios are unacceptable');
        assessment.severity = 'critical';
        assessment.recommendations.push('Implement crisis-specific error handling and failover mechanisms');
      }
      
      if (avgResponseTime > func.expectedResponseTime * 0.8) {
        assessment.issues.push('Crisis function response times must be optimal during crisis scenarios');
        assessment.severity = 'critical';
        assessment.recommendations.push('Implement crisis-mode optimizations and resource prioritization');
      }
    }

    assessment.passed = assessment.issues.length === 0;
    
    return assessment;
  }

  printCriticalResults(result) {
    if (!result.critical) return;

    const statusIcon = result.assessment.passed ? '✅' : '❌';
    const severityIcon = result.assessment.severity === 'critical' ? '🚨' : 
                        result.assessment.severity === 'high' ? '⚠️' : '📊';

    console.log(`   ${severityIcon}${statusIcon} ${result.assessment.passed ? 'PASS' : 'FAIL'}`);
    
    if (result.statistics) {
      console.log(`   📊 Avg: ${result.statistics.averageResponseTime}ms | P95: ${result.statistics.p95ResponseTime}ms | Errors: ${result.statistics.errorRate}%`);
      console.log(`   🔄 Throughput: ${result.statistics.throughput} req/s | Success: ${result.statistics.successfulRequests}/${result.statistics.totalRequests}`);
    }

    if (result.assessment.issues.length > 0) {
      console.log('   Issues detected:');
      result.assessment.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 FIREBASE FUNCTIONS LOAD TEST REPORT');
    console.log('='.repeat(80));

    // Calculate overall statistics
    const overallStats = this.calculateOverallStatistics();

    // Print executive summary
    this.printExecutiveSummary(overallStats);

    // Print function performance summary
    this.printFunctionPerformance();

    // Print scenario analysis
    this.printScenarioAnalysis();

    // Print critical recommendations
    this.printCriticalRecommendations();

    // Save detailed report
    await this.saveDetailedReport();

    console.log('\n✅ Firebase Functions load testing complete!');
    console.log(`📁 Detailed report saved to: firebase-functions-load-test-report.json`);
  }

  calculateOverallStatistics() {
    const validResults = this.results.filter(r => !r.error && r.statistics);
    const criticalResults = validResults.filter(r => r.critical);
    const passedResults = validResults.filter(r => r.assessment.passed);
    const failedResults = validResults.filter(r => !r.assessment.passed);

    return {
      totalTests: this.results.length,
      validTests: validResults.length,
      criticalTests: criticalResults.length,
      passedTests: passedResults.length,
      failedTests: failedResults.length,
      overallPassRate: ((passedResults.length / validResults.length) * 100).toFixed(1),
      criticalPassRate: ((criticalResults.filter(r => r.assessment.passed).length / criticalResults.length) * 100).toFixed(1),
      averageErrorRate: (validResults.reduce((sum, r) => sum + parseFloat(r.statistics.errorRate), 0) / validResults.length).toFixed(2),
      averageThroughput: (validResults.reduce((sum, r) => sum + parseFloat(r.statistics.throughput), 0) / validResults.length).toFixed(2)
    };
  }

  printExecutiveSummary(stats) {
    console.log('\n🎯 EXECUTIVE SUMMARY');
    console.log('-'.repeat(40));
    console.log(`Total Function Tests: ${stats.totalTests}`);
    console.log(`Critical Function Tests: ${stats.criticalTests}`);
    console.log(`Overall Pass Rate: ${stats.overallPassRate}%`);
    console.log(`Critical Function Pass Rate: ${stats.criticalPassRate}%`);
    console.log(`Average Error Rate: ${stats.averageErrorRate}%`);
    console.log(`Average Throughput: ${stats.averageThroughput} req/s`);

    if (stats.criticalPassRate < 100) {
      console.log('\n🚨 CRITICAL ALERT: Crisis functions failing under load!');
      console.log('🆘 User safety may be compromised during high-traffic events.');
    } else {
      console.log('\n✅ All critical functions performing within acceptable parameters');
    }
  }

  printFunctionPerformance() {
    console.log('\n⚡ FUNCTION PERFORMANCE SUMMARY');
    console.log('-'.repeat(40));

    // Group results by function
    const resultsByFunction = {};
    this.results.forEach(result => {
      if (!resultsByFunction[result.function]) {
        resultsByFunction[result.function] = [];
      }
      resultsByFunction[result.function].push(result);
    });

    Object.entries(resultsByFunction).forEach(([funcName, results]) => {
      const validResults = results.filter(r => !r.error && r.statistics);
      if (validResults.length === 0) return;

      const avgResponseTime = (validResults.reduce((sum, r) => sum + parseFloat(r.statistics.averageResponseTime), 0) / validResults.length).toFixed(0);
      const avgErrorRate = (validResults.reduce((sum, r) => sum + parseFloat(r.statistics.errorRate), 0) / validResults.length).toFixed(2);
      const passCount = validResults.filter(r => r.assessment.passed).length;
      const isCritical = validResults[0].critical;

      const statusIcon = passCount === validResults.length ? '✅' : passCount > validResults.length / 2 ? '⚠️' : '❌';
      const criticalIcon = isCritical ? '🚨' : '📊';

      console.log(`${criticalIcon}${statusIcon} ${funcName}`);
      console.log(`   Avg Response: ${avgResponseTime}ms | Avg Errors: ${avgErrorRate}% | Passed: ${passCount}/${validResults.length}`);
    });
  }

  printScenarioAnalysis() {
    console.log('\n📊 LOAD SCENARIO ANALYSIS');
    console.log('-'.repeat(40));

    LOAD_TEST_SCENARIOS.forEach(scenario => {
      const scenarioResults = this.results.filter(r => r.scenario === scenario.name && !r.error);
      if (scenarioResults.length === 0) return;

      const passCount = scenarioResults.filter(r => r.assessment.passed).length;
      const criticalResults = scenarioResults.filter(r => r.critical);
      const criticalPassCount = criticalResults.filter(r => r.assessment.passed).length;

      console.log(`\n🎭 ${scenario.name} (${scenario.concurrentUsers} users)`);
      console.log(`   Overall: ${passCount}/${scenarioResults.length} functions passed`);
      console.log(`   Critical: ${criticalPassCount}/${criticalResults.length} critical functions passed`);

      if (criticalPassCount < criticalResults.length) {
        console.log(`   ⚠️ ${criticalResults.length - criticalPassCount} critical functions failed under this load`);
      }
    });
  }

  printCriticalRecommendations() {
    console.log('\n🚨 CRITICAL OPTIMIZATION RECOMMENDATIONS');
    console.log('-'.repeat(40));

    const failedCritical = this.results.filter(r => r.critical && !r.assessment.passed && !r.error);
    
    if (failedCritical.length === 0) {
      console.log('✅ No critical performance issues detected.');
      return;
    }

    console.log('🆘 IMMEDIATE ACTION REQUIRED:\n');

    const uniqueRecommendations = new Set();
    failedCritical.forEach(result => {
      console.log(`🔧 ${result.function} (${result.scenario})`);
      result.assessment.issues.forEach(issue => {
        console.log(`   Issue: ${issue}`);
      });
      result.assessment.recommendations.forEach(rec => {
        console.log(`   • ${rec}`);
        uniqueRecommendations.add(rec);
      });
      console.log('');
    });

    console.log('🎯 PRIORITY OPTIMIZATION STRATEGIES:');
    Array.from(uniqueRecommendations).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    console.log('\n💡 ADDITIONAL CRISIS OPTIMIZATION RECOMMENDATIONS:');
    console.log('• Implement Firebase Functions concurrency controls');
    console.log('• Set up auto-scaling based on crisis detection');
    console.log('• Create dedicated crisis-mode resource allocation');
    console.log('• Implement circuit breakers for overloaded functions');
    console.log('• Set up real-time monitoring and alerting');
  }

  async saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateOverallStatistics(),
      scenarios: LOAD_TEST_SCENARIOS,
      functions: FUNCTIONS_TO_TEST,
      results: this.results,
      recommendations: this.generateOverallRecommendations()
    };

    await fs.writeFile(
      'firebase-functions-load-test-report.json',
      JSON.stringify(report, null, 2)
    );
  }

  generateOverallRecommendations() {
    const recommendations = [];

    const failedCritical = this.results.filter(r => r.critical && !r.assessment.passed && !r.error);
    
    if (failedCritical.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        category: 'Crisis Function Performance',
        action: 'Optimize failed critical functions immediately',
        impact: 'User safety during crisis situations',
        functions: failedCritical.map(r => r.function)
      });
    }

    // Check for high error rates
    const highErrorFunctions = this.results.filter(r => 
      r.statistics && parseFloat(r.statistics.errorRate) > 5
    );

    if (highErrorFunctions.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Error Rate',
        action: 'Investigate and fix high error rate functions',
        impact: 'System reliability and user experience',
        functions: highErrorFunctions.map(r => r.function)
      });
    }

    return recommendations;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main execution
async function main() {
  const tester = new FirebaseFunctionsLoadTester();

  try {
    await tester.runLoadTests();
    await tester.generateReport();
  } catch (error) {
    console.error('❌ Load testing failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { FirebaseFunctionsLoadTester };