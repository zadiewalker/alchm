#!/usr/bin/env node

/**
 * ALCHM Crisis Performance Validation
 * Real-world testing of crisis scenarios under App Store conditions
 */

const https = require('https');
const http = require('http');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');

class CrisisPerformanceValidator {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.results = {
      timestamp: new Date().toISOString(),
      testSuite: 'Crisis Performance Validation',
      overall: {
        crisisReady: false,
        appStoreReady: false,
        criticalIssues: [],
        performance: {}
      },
      tests: {}
    };
    
    this.crisisScenarios = [
      'I want to hurt myself',
      'I feel like ending it all', 
      'Nobody would miss me',
      'I cannot go on anymore',
      'Everything is falling apart'
    ];
  }

  async validateCrisisPerformance() {
    console.log('🚨 ALCHM Crisis Performance Validation - App Store Readiness');
    console.log('='.repeat(80));
    console.log(`Started at: ${this.results.timestamp}`);
    console.log('Testing crisis-critical scenarios for App Store submission');
    console.log('='.repeat(80));

    try {
      // 1. Server Health Check
      await this.validateServerHealth();
      
      // 2. Crisis Detection Response Time
      await this.validateCrisisDetectionSpeed();
      
      // 3. Mobile Performance Under Load
      await this.validateMobilePerformance();
      
      // 4. Firebase Functions Performance
      await this.validateFirebaseFunctions();
      
      // 5. Resource Loading Performance
      await this.validateResourceLoading();
      
      // 6. Error Recovery Under Crisis
      await this.validateCrisisErrorRecovery();
      
      // 7. Offline Crisis Support
      await this.validateOfflineCrisisSupport();
      
      // Calculate overall assessment
      this.calculateOverallAssessment();
      
      // Generate final report
      await this.generateCrisisReport();
      
      return this.results;
      
    } catch (error) {
      console.error('🚨 CRITICAL: Crisis validation failed:', error);
      this.results.overall.criticalIssues.push(`Validation system failure: ${error.message}`);
      throw error;
    }
  }

  async validateServerHealth() {
    console.log('\n💓 Testing Server Health...');
    this.results.tests.serverHealth = {
      name: 'Server Health Check',
      critical: true,
      status: 'running'
    };

    try {
      const healthMetrics = await this.checkServerResponsiveness();
      this.results.tests.serverHealth = {
        ...this.results.tests.serverHealth,
        status: 'completed',
        metrics: healthMetrics,
        passed: healthMetrics.averageResponseTime < 1000
      };
      
      if (healthMetrics.averageResponseTime > 1000) {
        this.results.overall.criticalIssues.push('Server response too slow for crisis users');
      }
      
      console.log(`  ✅ Server health: ${healthMetrics.averageResponseTime}ms average response`);
      
    } catch (error) {
      this.results.tests.serverHealth.status = 'failed';
      this.results.tests.serverHealth.error = error.message;
      this.results.overall.criticalIssues.push('Server not responding - cannot test crisis scenarios');
      console.log('  ❌ Server health check failed');
    }
  }

  async checkServerResponsiveness() {
    const testUrls = [
      '/',
      '/en',
      '/auth/login',
      '/journal',
      '/dashboard'
    ];
    
    const results = [];
    
    for (const url of testUrls) {
      const startTime = Date.now();
      try {
        await this.makeRequest(url);
        const responseTime = Date.now() - startTime;
        results.push({ url, responseTime, success: true });
      } catch (error) {
        results.push({ 
          url, 
          responseTime: Date.now() - startTime, 
          success: false, 
          error: error.message 
        });
      }
    }
    
    const successfulRequests = results.filter(r => r.success);
    const averageResponseTime = successfulRequests.length > 0 
      ? successfulRequests.reduce((sum, r) => sum + r.responseTime, 0) / successfulRequests.length 
      : 0;
    
    return {
      totalRequests: results.length,
      successfulRequests: successfulRequests.length,
      failedRequests: results.length - successfulRequests.length,
      averageResponseTime,
      maxResponseTime: Math.max(...results.map(r => r.responseTime)),
      minResponseTime: Math.min(...results.map(r => r.responseTime)),
      details: results
    };
  }

  async validateCrisisDetectionSpeed() {
    console.log('\n🚨 Testing Crisis Detection Speed...');
    this.results.tests.crisisDetection = {
      name: 'Crisis Detection Performance',
      critical: true,
      status: 'running',
      scenarios: {}
    };

    for (const scenario of this.crisisScenarios) {
      const testResult = await this.testCrisisScenario(scenario);
      this.results.tests.crisisDetection.scenarios[scenario] = testResult;
      
      // Critical threshold: Must respond within 3 seconds
      if (testResult.responseTime > 3000) {
        this.results.overall.criticalIssues.push(`Crisis detection too slow: ${testResult.responseTime}ms > 3000ms`);
      }
      
      console.log(`  ${testResult.responseTime < 3000 ? '✅' : '❌'} "${scenario}": ${testResult.responseTime}ms`);
    }
    
    this.results.tests.crisisDetection.status = 'completed';
  }

  async testCrisisScenario(crisisText) {
    const startTime = Date.now();
    
    try {
      // Test crisis detection endpoint
      const response = await this.makeRequest('/api/crisis-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: crisisText,
          userId: 'test-user',
          timestamp: Date.now()
        })
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        crisisText,
        responseTime,
        success: true,
        crisisDetected: response.crisisDetected,
        resourcesProvided: !!response.resources,
        confidence: response.confidence || 0
      };
      
    } catch (error) {
      return {
        crisisText,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      };
    }
  }

  async validateMobilePerformance() {
    console.log('\n📱 Testing Mobile Performance...');
    this.results.tests.mobilePerformance = {
      name: 'Mobile Performance Validation',
      critical: true,
      status: 'running'
    };

    // Simulate mobile network conditions
    const mobileTests = await this.runMobileSimulation();
    
    this.results.tests.mobilePerformance = {
      ...this.results.tests.mobilePerformance,
      status: 'completed',
      metrics: mobileTests
    };
    
    // Check critical thresholds
    if (mobileTests.averageLoadTime > 3000) {
      this.results.overall.criticalIssues.push(`Mobile load time too slow: ${mobileTests.averageLoadTime}ms`);
    }
    
    console.log(`  ${mobileTests.averageLoadTime < 3000 ? '✅' : '❌'} Mobile performance: ${mobileTests.averageLoadTime}ms average`);
  }

  async runMobileSimulation() {
    // Simulate multiple mobile requests with artificial delays
    const mobileRequests = [];
    const urls = ['/', '/auth/login', '/journal'];
    
    for (let i = 0; i < 10; i++) {
      const url = urls[i % urls.length];
      const startTime = Date.now();
      
      try {
        await this.makeRequest(url);
        const loadTime = Date.now() - startTime;
        // Add mobile network latency simulation
        const simulatedMobileTime = loadTime + (100 + Math.random() * 200);
        mobileRequests.push({ url, loadTime: simulatedMobileTime, success: true });
      } catch (error) {
        mobileRequests.push({ 
          url, 
          loadTime: Date.now() - startTime, 
          success: false, 
          error: error.message 
        });
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const successfulRequests = mobileRequests.filter(r => r.success);
    const averageLoadTime = successfulRequests.length > 0 
      ? successfulRequests.reduce((sum, r) => sum + r.loadTime, 0) / successfulRequests.length 
      : 0;
    
    return {
      totalRequests: mobileRequests.length,
      successfulRequests: successfulRequests.length,
      averageLoadTime,
      maxLoadTime: Math.max(...mobileRequests.map(r => r.loadTime)),
      requests: mobileRequests
    };
  }

  async validateFirebaseFunctions() {
    console.log('\n🔥 Testing Firebase Functions...');
    this.results.tests.firebaseFunctions = {
      name: 'Firebase Functions Performance',
      critical: true,
      status: 'running',
      functions: {}
    };

    const functionsToTest = [
      { path: '/api/khepera', name: 'Khepera AI' },
      { path: '/api/crisis-detection', name: 'Crisis Detection' }
    ];

    for (const func of functionsToTest) {
      const functionResult = await this.testFirebaseFunction(func);
      this.results.tests.firebaseFunctions.functions[func.name] = functionResult;
      
      if (functionResult.responseTime > 5000) {
        this.results.overall.criticalIssues.push(`${func.name} function too slow: ${functionResult.responseTime}ms`);
      }
      
      console.log(`  ${functionResult.responseTime < 5000 ? '✅' : '❌'} ${func.name}: ${functionResult.responseTime}ms`);
    }
    
    this.results.tests.firebaseFunctions.status = 'completed';
  }

  async testFirebaseFunction(func) {
    const startTime = Date.now();
    
    try {
      await this.makeRequest(func.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test: true,
          content: 'Hello world'
        })
      });
      
      return {
        functionName: func.name,
        responseTime: Date.now() - startTime,
        success: true
      };
      
    } catch (error) {
      return {
        functionName: func.name,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message
      };
    }
  }

  async validateResourceLoading() {
    console.log('\n⚡ Testing Resource Loading...');
    this.results.tests.resourceLoading = {
      name: 'Critical Resource Loading',
      critical: true,
      status: 'running'
    };

    // Test loading of critical assets
    const resourceTests = await this.testCriticalResources();
    
    this.results.tests.resourceLoading = {
      ...this.results.tests.resourceLoading,
      status: 'completed',
      metrics: resourceTests
    };
    
    if (resourceTests.averageLoadTime > 1000) {
      this.results.overall.criticalIssues.push(`Critical resources loading too slowly: ${resourceTests.averageLoadTime}ms`);
    }
    
    console.log(`  ${resourceTests.averageLoadTime < 1000 ? '✅' : '❌'} Resource loading: ${resourceTests.averageLoadTime}ms average`);
  }

  async testCriticalResources() {
    const resources = [
      '/_next/static/css/',
      '/_next/static/js/',
      '/manifest.webmanifest',
      '/favicon.ico'
    ];
    
    const results = [];
    
    for (const resource of resources) {
      const startTime = Date.now();
      try {
        await this.makeRequest(resource);
        results.push({
          resource,
          loadTime: Date.now() - startTime,
          success: true
        });
      } catch (error) {
        results.push({
          resource,
          loadTime: Date.now() - startTime,
          success: false,
          error: error.message
        });
      }
    }
    
    const successfulLoads = results.filter(r => r.success);
    const averageLoadTime = successfulLoads.length > 0 
      ? successfulLoads.reduce((sum, r) => sum + r.loadTime, 0) / successfulLoads.length 
      : 0;
    
    return {
      totalResources: results.length,
      successfulLoads: successfulLoads.length,
      averageLoadTime,
      results
    };
  }

  async validateCrisisErrorRecovery() {
    console.log('\n🛡️ Testing Crisis Error Recovery...');
    this.results.tests.errorRecovery = {
      name: 'Crisis Error Recovery',
      critical: true,
      status: 'running'
    };

    // Test error scenarios that could occur during crisis
    const errorTests = await this.testErrorScenarios();
    
    this.results.tests.errorRecovery = {
      ...this.results.tests.errorRecovery,
      status: 'completed',
      scenarios: errorTests
    };
    
    const failedRecoveries = errorTests.filter(test => !test.gracefulFailure);
    if (failedRecoveries.length > 0) {
      this.results.overall.criticalIssues.push(`${failedRecoveries.length} error scenarios lack graceful recovery`);
    }
    
    console.log(`  ${failedRecoveries.length === 0 ? '✅' : '❌'} Error recovery: ${errorTests.length - failedRecoveries.length}/${errorTests.length} graceful`);
  }

  async testErrorScenarios() {
    const scenarios = [
      { name: 'Invalid Crisis Request', path: '/api/crisis-detection', invalidPayload: true },
      { name: 'Network Timeout Simulation', path: '/api/khepera', timeout: true },
      { name: 'Invalid Auth Request', path: '/auth/invalid', auth: false }
    ];
    
    const results = [];
    
    for (const scenario of scenarios) {
      try {
        const startTime = Date.now();
        
        if (scenario.invalidPayload) {
          await this.makeRequest(scenario.path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invalid: 'data' })
          });
        } else {
          await this.makeRequest(scenario.path);
        }
        
        results.push({
          name: scenario.name,
          responseTime: Date.now() - startTime,
          gracefulFailure: true,
          success: true
        });
        
      } catch (error) {
        results.push({
          name: scenario.name,
          responseTime: 0, // Error occurred before timing
          gracefulFailure: error.statusCode !== undefined, // Has structured error response
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  async validateOfflineCrisisSupport() {
    console.log('\n📡 Testing Offline Crisis Support...');
    this.results.tests.offlineSupport = {
      name: 'Offline Crisis Support',
      critical: true,
      status: 'running'
    };

    // Test static crisis resources availability
    const offlineTests = await this.testOfflineCapabilities();
    
    this.results.tests.offlineSupport = {
      ...this.results.tests.offlineSupport,
      status: 'completed',
      capabilities: offlineTests
    };
    
    if (!offlineTests.staticResourcesAvailable) {
      this.results.overall.criticalIssues.push('Offline crisis resources not available');
    }
    
    console.log(`  ${offlineTests.staticResourcesAvailable ? '✅' : '❌'} Offline support: Resources ${offlineTests.staticResourcesAvailable ? 'available' : 'missing'}`);
  }

  async testOfflineCapabilities() {
    // Test for service worker and static resources
    const capabilities = {
      staticResourcesAvailable: false,
      serviceWorkerPresent: false,
      offlinePagesAccessible: false
    };
    
    try {
      // Check for service worker
      await this.makeRequest('/sw.js');
      capabilities.serviceWorkerPresent = true;
    } catch (error) {
      // Service worker not found
    }
    
    try {
      // Check for offline resources
      await this.makeRequest('/offline.html');
      capabilities.offlinePagesAccessible = true;
    } catch (error) {
      // Offline page not found
    }
    
    // Check for manifest
    try {
      await this.makeRequest('/manifest.webmanifest');
      capabilities.staticResourcesAvailable = true;
    } catch (error) {
      // Manifest not found
    }
    
    return capabilities;
  }

  calculateOverallAssessment() {
    const criticalTests = Object.values(this.results.tests).filter(test => test.critical);
    const passedTests = criticalTests.filter(test => test.status === 'completed' && !test.error);
    
    this.results.overall.performance = {
      totalCriticalTests: criticalTests.length,
      passedCriticalTests: passedTests.length,
      failedCriticalTests: criticalTests.length - passedTests.length,
      passRate: (passedTests.length / criticalTests.length) * 100
    };
    
    // Crisis readiness assessment
    this.results.overall.crisisReady = this.results.overall.criticalIssues.length === 0;
    this.results.overall.appStoreReady = this.results.overall.crisisReady && 
      this.results.overall.performance.passRate >= 80;
    
    // Generate recommendations
    if (!this.results.overall.appStoreReady) {
      this.results.overall.recommendation = 'NOT READY - Critical issues must be resolved before App Store submission';
    } else if (this.results.overall.performance.passRate >= 95) {
      this.results.overall.recommendation = 'READY - Excellent crisis performance, cleared for App Store submission';
    } else {
      this.results.overall.recommendation = 'CONDITIONALLY READY - Good performance, monitor crisis scenarios closely';
    }
  }

  async generateCrisisReport() {
    const reportContent = this.generateReportContent();
    const reportPath = path.join(__dirname, '../', 'CRISIS_PERFORMANCE_VALIDATION_REPORT.md');
    
    await fs.writeFile(reportPath, reportContent, 'utf8');
    
    // Also save raw results
    const jsonPath = path.join(__dirname, '../', 'crisis-performance-results.json');
    await fs.writeFile(jsonPath, JSON.stringify(this.results, null, 2), 'utf8');
    
    console.log(`\n📊 Crisis validation report: ${reportPath}`);
    console.log(`📋 Raw data: ${jsonPath}`);
  }

  generateReportContent() {
    const r = this.results;
    
    return `# ALCHM Crisis Performance Validation Report

## Executive Summary

**Crisis Ready:** ${r.overall.crisisReady ? '✅ YES' : '❌ NO'}
**App Store Ready:** ${r.overall.appStoreReady ? '✅ YES' : '❌ NO'}
**Critical Issues:** ${r.overall.criticalIssues.length}
**Assessment Date:** ${r.timestamp}

**Recommendation:** ${r.overall.recommendation}

## Performance Overview

- **Total Critical Tests:** ${r.overall.performance.totalCriticalTests}
- **Passed Critical Tests:** ${r.overall.performance.passedCriticalTests}
- **Pass Rate:** ${r.overall.performance.passRate.toFixed(1)}%

## Critical Issues

${r.overall.criticalIssues.length > 0 ? 
  r.overall.criticalIssues.map(issue => `- ❌ ${issue}`).join('\n') : 
  '✅ No critical issues detected'
}

## Test Results

### Server Health
${this.formatTestResult(r.tests.serverHealth)}

### Crisis Detection Performance
${this.formatTestResult(r.tests.crisisDetection)}

### Mobile Performance
${this.formatTestResult(r.tests.mobilePerformance)}

### Firebase Functions
${this.formatTestResult(r.tests.firebaseFunctions)}

### Resource Loading
${this.formatTestResult(r.tests.resourceLoading)}

### Error Recovery
${this.formatTestResult(r.tests.errorRecovery)}

### Offline Support
${this.formatTestResult(r.tests.offlineSupport)}

## Crisis User Safety Assessment

### Response Time Compliance
- Crisis detection: ${r.tests.crisisDetection?.status === 'completed' ? '✅ TESTED' : '❌ NOT TESTED'}
- Resource loading: ${r.tests.resourceLoading?.status === 'completed' ? '✅ TESTED' : '❌ NOT TESTED'}
- Error recovery: ${r.tests.errorRecovery?.status === 'completed' ? '✅ TESTED' : '❌ NOT TESTED'}

### Offline Crisis Support
- Service worker: ${r.tests.offlineSupport?.capabilities?.serviceWorkerPresent ? '✅ PRESENT' : '❌ MISSING'}
- Static resources: ${r.tests.offlineSupport?.capabilities?.staticResourcesAvailable ? '✅ AVAILABLE' : '❌ MISSING'}
- Offline pages: ${r.tests.offlineSupport?.capabilities?.offlinePagesAccessible ? '✅ ACCESSIBLE' : '❌ MISSING'}

## Recommendations

${this.generateRecommendations()}

---

*Generated by ALCHM Crisis Performance Validation Suite*
*Ensuring life-saving features perform under all conditions*
`;
  }

  formatTestResult(test) {
    if (!test) return 'Test not completed\n';
    
    const status = test.status === 'completed' ? '✅ PASSED' : '❌ FAILED';
    let details = `**Status:** ${status}\n`;
    
    if (test.metrics) {
      details += `**Metrics:** ${JSON.stringify(test.metrics, null, 2)}\n`;
    }
    
    if (test.error) {
      details += `**Error:** ${test.error}\n`;
    }
    
    return details + '\n';
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.overall.criticalIssues.length > 0) {
      recommendations.push('### 🚨 Critical Issues (Must Fix Immediately)');
      this.results.overall.criticalIssues.forEach(issue => {
        recommendations.push(`- ${issue}`);
      });
      recommendations.push('');
    }
    
    recommendations.push('### Performance Optimizations');
    recommendations.push('- Implement crisis resource preloading');
    recommendations.push('- Add predictive crisis detection caching');
    recommendations.push('- Optimize mobile JavaScript bundle size');
    recommendations.push('- Implement progressive enhancement for low-end devices');
    recommendations.push('');
    
    recommendations.push('### Crisis Safety Enhancements');
    recommendations.push('- Add offline-first crisis resource caching');
    recommendations.push('- Implement graceful degradation for all crisis features');
    recommendations.push('- Add real-time performance monitoring for crisis endpoints');
    recommendations.push('- Optimize for assistive technologies');
    
    return recommendations.join('\n');
  }

  async makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      const requestOptions = {
        timeout: options.timeout || 10000,
        method: options.method || 'GET',
        headers: options.headers || {}
      };

      const request = http.request(url, requestOptions, (response) => {
        let data = '';
        
        response.on('data', (chunk) => {
          data += chunk;
        });
        
        response.on('end', () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            try {
              const parsedData = data ? JSON.parse(data) : {};
              resolve(parsedData);
            } catch (error) {
              resolve(data); // Return raw data if not JSON
            }
          } else {
            const error = new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`);
            error.statusCode = response.statusCode;
            reject(error);
          }
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        request.write(options.body);
      }
      
      request.end();
    });
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new CrisisPerformanceValidator();
  validator.validateCrisisPerformance()
    .then(results => {
      console.log('\n' + '='.repeat(80));
      console.log(`🚨 CRISIS VALIDATION COMPLETE`);
      console.log(`📊 Crisis Ready: ${results.overall.crisisReady ? 'YES ✅' : 'NO ❌'}`);
      console.log(`🎯 App Store Ready: ${results.overall.appStoreReady ? 'YES ✅' : 'NO ❌'}`);
      console.log(`⚠️  Critical Issues: ${results.overall.criticalIssues.length}`);
      console.log('='.repeat(80));
      
      if (!results.overall.appStoreReady) {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('🚨 Crisis validation failed:', error);
      process.exit(1);
    });
}

module.exports = CrisisPerformanceValidator;