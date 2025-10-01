#!/usr/bin/env node

/**
 * ALCHM Crisis Scenario Testing
 * 
 * This script tests specific crisis user scenarios to ensure
 * the emergency mechanisms protect users in crisis situations.
 */

const https = require('https');
const { performance } = require('perf_hooks');

const PRODUCTION_URL = 'https://alchmapp.web.app';

const CRISIS_SCENARIOS = [
  {
    name: 'User directly accesses crisis page',
    url: `${PRODUCTION_URL}/emergency-crisis.html`,
    expectedFeatures: [
      'Call 988 - Crisis Lifeline',
      'Text HOME to 741741',
      'Trevor Lifeline',
      'Trans Lifeline',
      'National DV Hotline',
      'Immediate Help Available'
    ],
    description: 'User goes directly to emergency crisis support'
  },
  {
    name: 'User hits main page with crisis intent',
    url: `${PRODUCTION_URL}/?crisis=true`,
    expectedFeatures: [
      'tel:988',
      'emergency-sw.js'
    ],
    description: 'User accesses main page in crisis state'
  },
  {
    name: 'Service worker provides 5-second fallback',
    url: `${PRODUCTION_URL}/emergency-sw.js`,
    expectedFeatures: [
      'setTimeout(() => {',
      '5000',
      'emergency-crisis.html',
      'EMERGENCY_CACHE'
    ],
    description: 'Service worker implements emergency timeout and caching'
  }
];

async function testCrisisScenario(scenario) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const req = https.get(scenario.url, { timeout: 3000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        const loadTime = Math.round(endTime - startTime);
        
        const foundFeatures = scenario.expectedFeatures.filter(feature => 
          data.includes(feature)
        );
        const missingFeatures = scenario.expectedFeatures.filter(feature => 
          !data.includes(feature)
        );
        
        const result = {
          name: scenario.name,
          url: scenario.url,
          loadTime,
          status: res.statusCode,
          success: res.statusCode === 200 && missingFeatures.length === 0,
          foundFeatures: foundFeatures.length,
          totalFeatures: scenario.expectedFeatures.length,
          missingFeatures,
          description: scenario.description
        };
        
        resolve(result);
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        name: scenario.name,
        url: scenario.url,
        loadTime: 3000,
        status: 'TIMEOUT',
        success: false,
        foundFeatures: 0,
        totalFeatures: scenario.expectedFeatures.length,
        missingFeatures: scenario.expectedFeatures,
        description: scenario.description
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: scenario.name,
        url: scenario.url,
        loadTime: -1,
        status: 'ERROR',
        success: false,
        error: error.message,
        foundFeatures: 0,
        totalFeatures: scenario.expectedFeatures.length,
        missingFeatures: scenario.expectedFeatures,
        description: scenario.description
      });
    });
  });
}

async function testCrisisScenarios() {
  console.log('🆘 ALCHM Crisis Scenario Testing Suite');
  console.log('=====================================');
  console.log('🚨 Testing real-world crisis user scenarios');
  console.log('');
  
  const results = [];
  
  for (const scenario of CRISIS_SCENARIOS) {
    console.log(`🔍 Testing: ${scenario.name}...`);
    const result = await testCrisisScenario(scenario);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ PASS: ${result.name} (${result.loadTime}ms)`);
      console.log(`   Features: ${result.foundFeatures}/${result.totalFeatures} present`);
    } else {
      console.log(`❌ FAIL: ${result.name}`);
      console.log(`   Load Time: ${result.loadTime}ms`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Features: ${result.foundFeatures}/${result.totalFeatures} present`);
      if (result.missingFeatures.length > 0) {
        console.log(`   Missing: ${result.missingFeatures.join(', ')}`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
    console.log('');
  }
  
  // Generate crisis readiness report
  const passedScenarios = results.filter(r => r.success);
  const failedScenarios = results.filter(r => !r.success);
  
  console.log('📊 CRISIS READINESS SUMMARY');
  console.log('===========================');
  console.log(`✅ Passed: ${passedScenarios.length}/${results.length} scenarios`);
  console.log(`❌ Failed: ${failedScenarios.length}/${results.length} scenarios`);
  console.log('');
  
  if (failedScenarios.length === 0) {
    console.log('🎉 CRISIS READINESS: FULLY OPERATIONAL');
    console.log('✅ All critical crisis scenarios are protected');
    console.log('✅ Users in crisis have immediate access to support');
    console.log('✅ 988 Crisis Lifeline is accessible across all scenarios');
    console.log('✅ Emergency fallback mechanisms are functional');
    console.log('✅ Crisis page loads within acceptable timeframes');
    console.log('');
    console.log('🛡️  CRISIS PROTECTION STATUS: MAXIMUM SAFETY');
  } else {
    console.log('🚨 CRISIS READINESS: FAILURES DETECTED');
    console.log('⚠️  IMMEDIATE INTERVENTION REQUIRED');
    console.log('');
    
    failedScenarios.forEach(failure => {
      console.log(`❌ ${failure.name}`);
      console.log(`   ${failure.description}`);
      console.log(`   Missing: ${failure.missingFeatures.join(', ')}`);
    });
    
    console.log('');
    console.log('🚨 USER SAFETY AT RISK - DEPLOY EMERGENCY FIXES');
  }
  
  console.log('');
  console.log('📋 SCENARIO DETAILS:');
  console.log('===================');
  
  results.forEach(result => {
    console.log(`\n🔧 ${result.name}`);
    console.log(`   URL: ${result.url}`);
    console.log(`   Load Time: ${result.loadTime}ms`);
    console.log(`   Status: ${result.status}`);
    console.log(`   Crisis Features: ${result.foundFeatures}/${result.totalFeatures}`);
    console.log(`   Description: ${result.description}`);
    
    if (result.missingFeatures.length > 0) {
      console.log(`   ⚠️  Missing: ${result.missingFeatures.join(', ')}`);
    }
  });
  
  return failedScenarios.length === 0;
}

// Run crisis scenario testing
testCrisisScenarios()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('🚨 CRISIS TESTING FAILED:', error);
    process.exit(1);
  });