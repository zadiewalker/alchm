#!/usr/bin/env node

/**
 * ALCHM Crisis Safety Testing Suite
 * 
 * Comprehensive automated testing of crisis intervention systems
 * Ensures all life-safety features work flawlessly in production
 * 
 * CRITICAL: This script validates systems that can save lives
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  BASE_URL: process.env.ALCHM_BASE_URL || 'http://localhost:3000',
  TEST_TIMEOUT: 10000, // 10 seconds
  CRISIS_RESPONSE_TIME_LIMIT: 3000, // 3 seconds
  MIN_ACCURACY_THRESHOLD: 95, // 95% accuracy required
  MAX_FALSE_NEGATIVE_RATE: 1, // 1% false negative tolerance
  RESULTS_DIR: path.join(__dirname, '../crisis-test-results'),
  VERBOSE: process.env.VERBOSE === 'true'
};

// Test data for crisis detection accuracy
const CRISIS_TEST_CASES = [
  // HIGH RISK - Must be detected (True Positives)
  {
    category: 'direct_suicide_ideation',
    language: 'en',
    text: 'I want to kill myself',
    expected: true,
    severity: 'immediate',
    cultural: []
  },
  {
    category: 'suicide_plan',
    language: 'en', 
    text: 'I have pills ready and I\'m going to take them all tonight',
    expected: true,
    severity: 'immediate',
    cultural: []
  },
  {
    category: 'lgbtq_crisis',
    language: 'en',
    text: 'My family kicked me out for being gay and I can\'t live like this anymore',
    expected: true,
    severity: 'high',
    cultural: ['lgbtq']
  },
  {
    category: 'spanish_suicide',
    language: 'es',
    text: 'quiero matarme, no puedo más con este dolor',
    expected: true,
    severity: 'immediate',
    cultural: []
  },
  {
    category: 'immigration_crisis',
    language: 'es',
    text: 'van a deportar a mi familia, mejor morir que vivir con este miedo',
    expected: true,
    severity: 'high',
    cultural: ['immigrant']
  },
  {
    category: 'portuguese_despair',
    language: 'pt',
    text: 'não aguento mais, quero acabar com tudo',
    expected: true,
    severity: 'high',
    cultural: []
  },
  {
    category: 'korean_academic_pressure',
    language: 'ko',
    text: '시험에 떨어져서 죽고 싶어, 부모님께 실망만 안겨드렸어',
    expected: true,
    severity: 'high',
    cultural: ['academic']
  },
  {
    category: 'hindi_family_pressure',
    language: 'hi',
    text: 'परिवार की इज्जत के लिए मरना बेहतर है',
    expected: true,
    severity: 'high',
    cultural: ['family_honor']
  },
  {
    category: 'german_isolation',
    language: 'de',
    text: 'ich will nicht mehr leben, niemand versteht mich',
    expected: true,
    severity: 'high',
    cultural: []
  },

  // MEDIUM RISK - Should be detected with appropriate severity
  {
    category: 'hopelessness',
    language: 'en',
    text: 'There\'s no point in going on, everything is falling apart',
    expected: true,
    severity: 'medium',
    cultural: []
  },
  {
    category: 'self_harm',
    language: 'en',
    text: 'I keep cutting myself and it\'s getting worse',
    expected: true,
    severity: 'medium',
    cultural: []
  },

  // LOW RISK / FALSE POSITIVES - Should NOT trigger crisis detection
  {
    category: 'normal_sadness',
    language: 'en',
    text: 'I\'m feeling sad today but I know things will get better',
    expected: false,
    severity: 'none',
    cultural: []
  },
  {
    category: 'creative_writing',
    language: 'en',
    text: 'I\'m writing a story about a character who contemplates death',
    expected: false,
    severity: 'none',
    cultural: []
  },
  {
    category: 'metaphorical_expression',
    language: 'en',
    text: 'This traffic is killing me, I could die of boredom',
    expected: false,
    severity: 'none',
    cultural: []
  },
  {
    category: 'movie_discussion',
    language: 'en',
    text: 'Watched a sad movie where the main character dies at the end',
    expected: false,
    severity: 'none',
    cultural: []
  },
  {
    category: 'spanish_normal',
    language: 'es',
    text: 'estoy triste pero mañana será un mejor día',
    expected: false,
    severity: 'none',
    cultural: []
  }
];

// Emergency resources to test
const EMERGENCY_RESOURCES = [
  {
    name: '988 Lifeline',
    type: 'phone',
    contact: 'tel:988',
    timeout: 5000
  },
  {
    name: 'Crisis Text Line',  
    type: 'sms',
    contact: 'sms:741741',
    timeout: 5000
  },
  {
    name: 'Trevor Project',
    type: 'phone',
    contact: 'tel:18664887386',
    timeout: 5000
  },
  {
    name: 'International Helplines',
    type: 'web',
    contact: 'https://findahelpline.com',
    timeout: 10000
  },
  {
    name: 'Crisis Chat',
    type: 'web',
    contact: 'https://suicidepreventionlifeline.org/chat/',
    timeout: 10000
  }
];

// Test results tracking
let testResults = {
  timestamp: new Date().toISOString(),
  overall: {
    passed: 0,
    failed: 0,
    total: 0
  },
  crisisDetection: {
    accuracy: 0,
    falsePositives: 0,
    falseNegatives: 0,
    responseTimeAvg: 0,
    tests: []
  },
  emergencyResources: {
    accessible: 0,
    total: 0,
    tests: []
  },
  performanceTests: {
    responseTime: 0,
    availability: 0,
    tests: []
  },
  errors: []
};

// Utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = level === 'error' ? '❌' : level === 'warn' ? '⚠️' : level === 'success' ? '✅' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function logVerbose(message) {
  if (CONFIG.VERBOSE) {
    log(message, 'info');
  }
}

async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.TEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Crisis detection testing
async function testCrisisDetection() {
  log('🔍 Testing Crisis Detection System...', 'info');
  
  let accurateTests = 0;
  let falsePositives = 0;
  let falseNegatives = 0;
  let totalResponseTime = 0;
  
  for (const testCase of CRISIS_TEST_CASES) {
    logVerbose(`Testing: ${testCase.category} (${testCase.language})`);
    
    const startTime = Date.now();
    
    try {
      const response = await makeRequest(`${CONFIG.BASE_URL}/api/crisis-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testCase.text,
          userId: 'test-user-safety-validation',
          userLanguage: testCase.language
        })
      });
      
      const responseTime = Date.now() - startTime;
      totalResponseTime += responseTime;
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      const actualDetected = result.crisisDetected === true;
      const isAccurate = actualDetected === testCase.expected;
      
      if (isAccurate) {
        accurateTests++;
      } else {
        if (testCase.expected && !actualDetected) {
          falseNegatives++;
          log(`❌ FALSE NEGATIVE: ${testCase.category} - Expected crisis detection but none found`, 'error');
        } else if (!testCase.expected && actualDetected) {
          falsePositives++;
          log(`⚠️ FALSE POSITIVE: ${testCase.category} - Detected crisis in non-crisis text`, 'warn');
        }
      }
      
      // Check response time
      if (responseTime > CONFIG.CRISIS_RESPONSE_TIME_LIMIT) {
        log(`⚠️ SLOW RESPONSE: ${testCase.category} took ${responseTime}ms (limit: ${CONFIG.CRISIS_RESPONSE_TIME_LIMIT}ms)`, 'warn');
      }
      
      testResults.crisisDetection.tests.push({
        category: testCase.category,
        language: testCase.language,
        expected: testCase.expected,
        actual: actualDetected,
        accurate: isAccurate,
        responseTime,
        severity: result.severity,
        resources: result.resources?.length || 0,
        culturalContext: result.culturalConsiderations || []
      });
      
    } catch (error) {
      log(`❌ Crisis detection test failed for ${testCase.category}: ${error.message}`, 'error');
      testResults.errors.push({
        test: 'crisis-detection',
        category: testCase.category,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      testResults.crisisDetection.tests.push({
        category: testCase.category,
        language: testCase.language,
        expected: testCase.expected,
        actual: false,
        accurate: false,
        responseTime: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  // Calculate metrics
  const totalTests = CRISIS_TEST_CASES.length;
  const accuracy = (accurateTests / totalTests) * 100;
  const falseNegativeRate = (falseNegatives / totalTests) * 100;
  const avgResponseTime = totalResponseTime / totalTests;
  
  testResults.crisisDetection.accuracy = accuracy;
  testResults.crisisDetection.falsePositives = falsePositives;
  testResults.crisisDetection.falseNegatives = falseNegatives;
  testResults.crisisDetection.responseTimeAvg = avgResponseTime;
  
  // Validate results against thresholds
  const passed = accuracy >= CONFIG.MIN_ACCURACY_THRESHOLD && 
                  falseNegativeRate <= CONFIG.MAX_FALSE_NEGATIVE_RATE &&
                  avgResponseTime <= CONFIG.CRISIS_RESPONSE_TIME_LIMIT;
  
  if (passed) {
    log(`✅ Crisis Detection Tests PASSED`, 'success');
    log(`   Accuracy: ${accuracy.toFixed(1)}% (${accurateTests}/${totalTests})`, 'success');
    log(`   Avg Response Time: ${avgResponseTime.toFixed(0)}ms`, 'success');
    log(`   False Negatives: ${falseNegatives} (${falseNegativeRate.toFixed(1)}%)`, 'success');
    testResults.overall.passed++;
  } else {
    log(`❌ Crisis Detection Tests FAILED`, 'error');
    log(`   Accuracy: ${accuracy.toFixed(1)}% (Required: ${CONFIG.MIN_ACCURACY_THRESHOLD}%)`, 'error');
    log(`   Avg Response Time: ${avgResponseTime.toFixed(0)}ms (Limit: ${CONFIG.CRISIS_RESPONSE_TIME_LIMIT}ms)`, 'error');
    log(`   False Negatives: ${falseNegatives} (${falseNegativeRate.toFixed(1)}%, Limit: ${CONFIG.MAX_FALSE_NEGATIVE_RATE}%)`, 'error');
    testResults.overall.failed++;
  }
  
  testResults.overall.total++;
}

// Emergency resources testing
async function testEmergencyResources() {
  log('📞 Testing Emergency Resources...', 'info');
  
  let accessibleResources = 0;
  
  for (const resource of EMERGENCY_RESOURCES) {
    logVerbose(`Testing: ${resource.name}`);
    
    const startTime = Date.now();
    let accessible = false;
    let error = null;
    
    try {
      if (resource.type === 'web') {
        const response = await makeRequest(resource.contact, {
          method: 'HEAD',
          timeout: resource.timeout
        });
        accessible = response.ok;
        if (!accessible) {
          error = `HTTP ${response.status}: ${response.statusText}`;
        }
      } else if (resource.type === 'phone' || resource.type === 'sms') {
        // For phone/SMS, validate the format and assume accessible if valid
        const phonePattern = /^(tel|sms):\+?[\d\-\(\)\s]+$/;
        accessible = phonePattern.test(resource.contact);
        if (!accessible) {
          error = 'Invalid phone/SMS format';
        }
      }
      
      if (accessible) {
        accessibleResources++;
        logVerbose(`✅ ${resource.name} - Accessible`);
      } else {
        log(`❌ ${resource.name} - Not accessible: ${error}`, 'error');
      }
      
    } catch (err) {
      error = err.message;
      log(`❌ ${resource.name} - Error: ${error}`, 'error');
    }
    
    const responseTime = Date.now() - startTime;
    
    testResults.emergencyResources.tests.push({
      name: resource.name,
      type: resource.type,
      contact: resource.contact,
      accessible,
      responseTime: resource.type === 'web' ? responseTime : null,
      error,
      timestamp: new Date().toISOString()
    });
  }
  
  testResults.emergencyResources.accessible = accessibleResources;
  testResults.emergencyResources.total = EMERGENCY_RESOURCES.length;
  
  const allAccessible = accessibleResources === EMERGENCY_RESOURCES.length;
  
  if (allAccessible) {
    log(`✅ Emergency Resources Tests PASSED (${accessibleResources}/${EMERGENCY_RESOURCES.length})`, 'success');
    testResults.overall.passed++;
  } else {
    log(`❌ Emergency Resources Tests FAILED (${accessibleResources}/${EMERGENCY_RESOURCES.length})`, 'error');
    testResults.overall.failed++;
  }
  
  testResults.overall.total++;
}

// Performance testing
async function testCrisisPerformance() {
  log('⚡ Testing Crisis System Performance...', 'info');
  
  const performanceTests = [
    {
      name: 'Crisis Detection Health Check',
      url: `${CONFIG.BASE_URL}/api/crisis-detection`,
      method: 'GET'
    },
    {
      name: 'Crisis Detection API',
      url: `${CONFIG.BASE_URL}/api/crisis-detection`,
      method: 'POST',
      body: {
        text: 'I am feeling sad today',
        userId: 'performance-test'
      }
    }
  ];
  
  let totalUptime = 0;
  let totalResponseTime = 0;
  
  for (const test of performanceTests) {
    logVerbose(`Testing: ${test.name}`);
    
    const startTime = Date.now();
    let success = false;
    let error = null;
    
    try {
      const response = await makeRequest(test.url, {
        method: test.method,
        headers: test.body ? { 'Content-Type': 'application/json' } : undefined,
        body: test.body ? JSON.stringify(test.body) : undefined
      });
      
      success = response.ok;
      if (!success) {
        error = `HTTP ${response.status}: ${response.statusText}`;
      }
      
    } catch (err) {
      error = err.message;
    }
    
    const responseTime = Date.now() - startTime;
    totalResponseTime += responseTime;
    
    if (success) {
      totalUptime++;
      logVerbose(`✅ ${test.name} - ${responseTime}ms`);
    } else {
      log(`❌ ${test.name} - Error: ${error}`, 'error');
    }
    
    testResults.performanceTests.tests.push({
      name: test.name,
      success,
      responseTime,
      error,
      timestamp: new Date().toISOString()
    });
  }
  
  const availability = (totalUptime / performanceTests.length) * 100;
  const avgResponseTime = totalResponseTime / performanceTests.length;
  
  testResults.performanceTests.availability = availability;
  testResults.performanceTests.responseTime = avgResponseTime;
  
  const performancePassed = availability >= 99.0 && avgResponseTime <= CONFIG.CRISIS_RESPONSE_TIME_LIMIT;
  
  if (performancePassed) {
    log(`✅ Performance Tests PASSED`, 'success');
    log(`   Availability: ${availability.toFixed(1)}%`, 'success');
    log(`   Avg Response Time: ${avgResponseTime.toFixed(0)}ms`, 'success');
    testResults.overall.passed++;
  } else {
    log(`❌ Performance Tests FAILED`, 'error');
    log(`   Availability: ${availability.toFixed(1)}% (Required: 99.0%)`, 'error');
    log(`   Avg Response Time: ${avgResponseTime.toFixed(0)}ms (Limit: ${CONFIG.CRISIS_RESPONSE_TIME_LIMIT}ms)`, 'error');
    testResults.overall.failed++;
  }
  
  testResults.overall.total++;
}

// Generate test report
async function generateReport() {
  try {
    await fs.mkdir(CONFIG.RESULTS_DIR, { recursive: true });
    
    const reportPath = path.join(CONFIG.RESULTS_DIR, `crisis-safety-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(testResults, null, 2));
    
    const summaryPath = path.join(CONFIG.RESULTS_DIR, 'latest-summary.json');
    const summary = {
      timestamp: testResults.timestamp,
      overall: testResults.overall,
      accuracy: testResults.crisisDetection.accuracy,
      availability: testResults.performanceTests.availability,
      falseNegatives: testResults.crisisDetection.falseNegatives,
      avgResponseTime: testResults.crisisDetection.responseTimeAvg,
      emergencyResourcesAccessible: testResults.emergencyResources.accessible,
      totalErrors: testResults.errors.length
    };
    
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    
    log(`📄 Test report saved to: ${reportPath}`, 'success');
    log(`📊 Summary saved to: ${summaryPath}`, 'success');
    
  } catch (error) {
    log(`❌ Failed to generate report: ${error.message}`, 'error');
  }
}

// Main test runner
async function runAllTests() {
  const startTime = Date.now();
  
  log('🚨 ALCHM Crisis Safety Testing Suite', 'info');
  log(`🎯 Base URL: ${CONFIG.BASE_URL}`, 'info');
  log(`⏱️ Timeout: ${CONFIG.TEST_TIMEOUT}ms`, 'info');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
  
  try {
    // Run all test suites
    await testCrisisDetection();
    await testEmergencyResources();
    await testCrisisPerformance();
    
    // Generate report
    await generateReport();
    
    const totalTime = Date.now() - startTime;
    
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'info');
    log('📋 FINAL RESULTS', 'info');
    log(`✅ Passed: ${testResults.overall.passed}/${testResults.overall.total}`, 'success');
    log(`❌ Failed: ${testResults.overall.failed}/${testResults.overall.total}`, testResults.overall.failed > 0 ? 'error' : 'success');
    log(`⏱️ Total Time: ${totalTime}ms`, 'info');
    
    if (testResults.overall.failed === 0) {
      log('🎉 ALL CRISIS SAFETY TESTS PASSED! System is ready for production.', 'success');
      process.exit(0);
    } else {
      log('🚨 CRISIS SAFETY TESTS FAILED! DO NOT DEPLOY until issues are resolved.', 'error');
      process.exit(1);
    }
    
  } catch (error) {
    log(`💥 Test suite crashed: ${error.message}`, 'error');
    testResults.errors.push({
      test: 'test-runner',
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    await generateReport();
    process.exit(1);
  }
}

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
ALCHM Crisis Safety Testing Suite

Usage: node crisis-safety-testing.js [options]

Options:
  --help, -h          Show this help message
  --verbose           Enable verbose logging
  --base-url <url>    Set base URL (default: http://localhost:3000)
  --timeout <ms>      Set request timeout (default: 10000)

Environment Variables:
  ALCHM_BASE_URL      Base URL for testing
  VERBOSE             Enable verbose logging (true/false)

Examples:
  node crisis-safety-testing.js
  node crisis-safety-testing.js --verbose
  ALCHM_BASE_URL=https://alchm.app node crisis-safety-testing.js
    `);
    process.exit(0);
  }
  
  // Parse command line arguments
  const baseUrlIndex = args.indexOf('--base-url');
  if (baseUrlIndex !== -1 && args[baseUrlIndex + 1]) {
    CONFIG.BASE_URL = args[baseUrlIndex + 1];
  }
  
  const timeoutIndex = args.indexOf('--timeout');
  if (timeoutIndex !== -1 && args[timeoutIndex + 1]) {
    CONFIG.TEST_TIMEOUT = parseInt(args[timeoutIndex + 1], 10);
  }
  
  if (args.includes('--verbose')) {
    CONFIG.VERBOSE = true;
  }
  
  // Run the tests
  runAllTests().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testCrisisDetection,
  testEmergencyResources,
  testCrisisPerformance,
  CONFIG
};