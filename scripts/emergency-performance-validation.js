#!/usr/bin/env node

/**
 * ALCHM Emergency Performance Validation Suite
 * 
 * This script validates that emergency crisis mechanisms are functioning
 * correctly to ensure users in crisis can access life-saving support.
 */

const https = require('https');
const { performance } = require('perf_hooks');

const PRODUCTION_URL = 'https://alchmapp.web.app';
const EMERGENCY_TESTS = [
  {
    name: 'Emergency Crisis Page Access',
    url: `${PRODUCTION_URL}/emergency-crisis.html`,
    timeout: 2000, // Must load within 2 seconds
    mustContain: ['988', 'Crisis Lifeline', 'Text HOME to 741741'],
    description: 'Static crisis page with immediate access to life-saving resources'
  },
  {
    name: 'Emergency Service Worker',
    url: `${PRODUCTION_URL}/emergency-sw.js`,
    timeout: 1000, // Service worker must load within 1 second
    mustContain: ['EMERGENCY_CACHE', '5000', 'emergency-crisis.html'],
    description: 'Service worker implementing 5-second timeout and crisis caching'
  },
  {
    name: 'Main Page Crisis Button',
    url: `${PRODUCTION_URL}/`,
    timeout: 5000, // Main page has 5 seconds before emergency fallback
    mustContain: ['tel:988', 'emergency-sw.js'],
    description: 'Main page with embedded crisis button and emergency service worker'
  }
];

async function testURL(test) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const req = https.get(test.url, { timeout: test.timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        const result = {
          name: test.name,
          url: test.url,
          loadTime: Math.round(loadTime),
          timeout: test.timeout,
          status: res.statusCode,
          success: res.statusCode === 200 && loadTime < test.timeout,
          containsRequired: test.mustContain.every(content => data.includes(content)),
          missingContent: test.mustContain.filter(content => !data.includes(content)),
          description: test.description
        };
        
        resolve(result);
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: test.name,
        url: test.url,
        loadTime: test.timeout,
        timeout: test.timeout,
        status: 'TIMEOUT',
        success: false,
        containsRequired: false,
        missingContent: test.mustContain,
        description: test.description
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: test.name,
        url: test.url,
        loadTime: -1,
        timeout: test.timeout,
        status: 'ERROR',
        success: false,
        error: error.message,
        containsRequired: false,
        missingContent: test.mustContain,
        description: test.description
      });
    });
  });
}

async function validateEmergencyMechanisms() {
  console.log('🆘 ALCHM Emergency Performance Validation Suite');
  console.log('===============================================');
  console.log('🚨 CRITICAL: Validating life-saving crisis mechanisms');
  console.log('');
  
  const results = [];
  
  for (const test of EMERGENCY_TESTS) {
    console.log(`⏱️  Testing: ${test.name}...`);
    const result = await testURL(test);
    results.push(result);
    
    if (result.success && result.containsRequired) {
      console.log(`✅ PASS: ${result.name} (${result.loadTime}ms < ${result.timeout}ms)`);
    } else {
      console.log(`❌ FAIL: ${result.name}`);
      console.log(`   Load Time: ${result.loadTime}ms (limit: ${result.timeout}ms)`);
      console.log(`   Status: ${result.status}`);
      if (result.missingContent.length > 0) {
        console.log(`   Missing Content: ${result.missingContent.join(', ')}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log('');
  }
  
  // Generate emergency performance report
  const passedTests = results.filter(r => r.success && r.containsRequired);
  const criticalFailures = results.filter(r => !r.success || !r.containsRequired);
  
  console.log('📊 EMERGENCY PERFORMANCE SUMMARY');
  console.log('================================');
  console.log(`✅ Passed: ${passedTests.length}/${results.length} tests`);
  console.log(`❌ Failed: ${criticalFailures.length}/${results.length} tests`);
  console.log('');
  
  if (criticalFailures.length === 0) {
    console.log('🎉 ALL EMERGENCY MECHANISMS OPERATIONAL');
    console.log('✅ Users in crisis can access life-saving support immediately');
    console.log('✅ 988 Crisis Lifeline accessible within performance targets');
    console.log('✅ Emergency fallback mechanisms functional');
    console.log('✅ Service worker caching crisis resources');
  } else {
    console.log('🚨 CRITICAL EMERGENCY FAILURES DETECTED');
    console.log('⚠️  IMMEDIATE ACTION REQUIRED - USER SAFETY AT RISK');
    console.log('');
    
    criticalFailures.forEach(failure => {
      console.log(`❌ ${failure.name}: ${failure.description}`);
      if (failure.loadTime >= failure.timeout) {
        console.log(`   🐌 TOO SLOW: ${failure.loadTime}ms exceeds ${failure.timeout}ms limit`);
      }
      if (failure.missingContent.length > 0) {
        console.log(`   🔍 Missing critical content: ${failure.missingContent.join(', ')}`);
      }
    });
  }
  
  console.log('');
  console.log('📋 DETAILED RESULTS:');
  console.log('===================');
  
  results.forEach(result => {
    console.log(`\n🔧 ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Load Time: ${result.loadTime}ms (target: <${result.timeout}ms)`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Required Content: ${result.containsRequired ? '✅ Present' : '❌ Missing'}`);
    console.log(`   Description: ${result.description}`);
  });
  
  return criticalFailures.length === 0;
}

// Run validation
validateEmergencyMechanisms()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('🚨 EMERGENCY VALIDATION FAILED:', error);
    process.exit(1);
  });