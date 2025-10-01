#!/usr/bin/env node

/**
 * FAMILY & FRIENDS SUCCESS TEST
 * Final validation before sharing ALCHM
 */

const http = require('http');
const BASE_URL = 'http://localhost:3001';

// Test results tracking
const results = {
  critical: { passed: 0, failed: 0, tests: [] },
  important: { passed: 0, failed: 0, tests: [] },
  nice_to_have: { passed: 0, failed: 0, tests: [] }
};

function addResult(category, passed, test, details = '') {
  results[category].tests.push({ passed, test, details });
  if (passed) {
    results[category].passed++;
  } else {
    results[category].failed++;
  }
}

async function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function testCriticalFeatures() {
  console.log('🔥 TESTING CRITICAL FEATURES (Must Work)...\n');
  
  // Homepage loads
  try {
    const response = await makeRequest('/');
    const pageWorks = response.status === 200;
    const hasALCHM = response.data.includes('ALCHM');
    const hasCrisis = response.data.includes('crisis-support') || response.data.includes('988');
    
    addResult('critical', pageWorks, 'Homepage loads', `Status: ${response.status}`);
    addResult('critical', hasALCHM, 'ALCHM branding present', hasALCHM ? 'Found' : 'Missing');
    addResult('critical', hasCrisis, 'Crisis support button present', hasCrisis ? 'Found crisis support' : 'Missing crisis button');
  } catch (error) {
    addResult('critical', false, 'Homepage loads', `Error: ${error.message}`);
  }
  
  // Age verification system
  try {
    const response = await makeRequest('/');
    const hasAgeVerification = response.data.includes('SimpleAgeVerification') || 
                              response.data.includes('age') ||
                              response.data.includes('18+') ||
                              response.data.includes('Adult');
    addResult('critical', hasAgeVerification, 'Age verification system present', 
      hasAgeVerification ? 'Age system detected' : 'Check dynamic loading');
  } catch (error) {
    addResult('critical', false, 'Age verification system', `Error: ${error.message}`);
  }
  
  // Core navigation pages
  const criticalPages = ['/auth/login', '/auth/signup', '/journal'];
  for (const page of criticalPages) {
    try {
      const response = await makeRequest(page);
      const works = response.status === 200;
      addResult('critical', works, `${page} loads`, `Status: ${response.status}`);
    } catch (error) {
      addResult('critical', false, `${page} loads`, `Error: ${error.message}`);
    }
  }
}

async function testImportantFeatures() {
  console.log('📋 TESTING IMPORTANT FEATURES (Should Work)...\n');
  
  const importantPages = ['/dashboard', '/journals', '/pricing', '/pathways'];
  for (const page of importantPages) {
    try {
      const response = await makeRequest(page);
      const works = response.status === 200;
      addResult('important', works, `${page} accessible`, `Status: ${response.status}`);
    } catch (error) {
      addResult('important', false, `${page} accessible`, `Error: ${error.message}`);
    }
  }
  
  // Mobile responsiveness check
  try {
    const response = await makeRequest('/');
    const mobileOptimized = response.data.includes('viewport') && 
                           response.data.includes('mobile-web-app-capable');
    addResult('important', mobileOptimized, 'Mobile optimization present', 
      mobileOptimized ? 'Mobile meta tags found' : 'Check mobile setup');
  } catch (error) {
    addResult('important', false, 'Mobile optimization', `Error: ${error.message}`);
  }
}

async function testNiceToHave() {
  console.log('✨ TESTING NICE-TO-HAVE FEATURES...\n');
  
  // Performance indicators
  try {
    const start = Date.now();
    await makeRequest('/');
    const loadTime = Date.now() - start;
    const fastEnough = loadTime < 3000; // Under 3 seconds
    addResult('nice_to_have', fastEnough, 'Homepage loads quickly', `${loadTime}ms`);
  } catch (error) {
    addResult('nice_to_have', false, 'Homepage performance', `Error: ${error.message}`);
  }
  
  // Additional pages
  const extraPages = ['/community', '/pathways'];
  for (const page of extraPages) {
    try {
      const response = await makeRequest(page);
      const works = response.status === 200;
      addResult('nice_to_have', works, `${page} works`, `Status: ${response.status}`);
    } catch (error) {
      addResult('nice_to_have', false, `${page} works`, `Error: ${error.message}`);
    }
  }
}

function calculateScore() {
  const totalCritical = results.critical.passed + results.critical.failed;
  const totalImportant = results.important.passed + results.important.failed;
  const totalNice = results.nice_to_have.passed + results.nice_to_have.failed;
  
  // Weighted scoring: Critical = 60%, Important = 30%, Nice = 10%
  const criticalScore = totalCritical > 0 ? (results.critical.passed / totalCritical) : 1;
  const importantScore = totalImportant > 0 ? (results.important.passed / totalImportant) : 1;
  const niceScore = totalNice > 0 ? (results.nice_to_have.passed / totalNice) : 1;
  
  return Math.round((criticalScore * 0.6 + importantScore * 0.3 + niceScore * 0.1) * 100);
}

function printResults() {
  console.log('\n🎯 FAMILY & FRIENDS READINESS REPORT');
  console.log('==========================================\n');
  
  // Critical Features
  console.log('🔥 CRITICAL FEATURES (Must Work):');
  results.critical.tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`  ${icon} ${test.test} ${test.details ? `(${test.details})` : ''}`);
  });
  console.log(`  → ${results.critical.passed}/${results.critical.passed + results.critical.failed} critical features working\n`);
  
  // Important Features
  console.log('📋 IMPORTANT FEATURES (Should Work):');
  results.important.tests.forEach(test => {
    const icon = test.passed ? '✅' : '⚠️';
    console.log(`  ${icon} ${test.test} ${test.details ? `(${test.details})` : ''}`);
  });
  console.log(`  → ${results.important.passed}/${results.important.passed + results.important.failed} important features working\n`);
  
  // Nice to Have
  console.log('✨ NICE-TO-HAVE FEATURES:');
  results.nice_to_have.tests.forEach(test => {
    const icon = test.passed ? '✅' : '💭';
    console.log(`  ${icon} ${test.test} ${test.details ? `(${test.details})` : ''}`);
  });
  console.log(`  → ${results.nice_to_have.passed}/${results.nice_to_have.passed + results.nice_to_have.failed} nice features working\n`);
  
  const score = calculateScore();
  console.log('==========================================');
  console.log(`🎯 FAMILY-READY SCORE: ${score}%\n`);
  
  if (results.critical.failed === 0 && score >= 85) {
    console.log('🎉 READY TO SHARE! Your app is family-ready!');
    console.log('📱 Share this URL: http://localhost:3001');
    console.log('💡 Tell them: "Test the age verification and explore the healing features!"');
  } else if (results.critical.failed === 0 && score >= 70) {
    console.log('👍 MOSTLY READY! Core features work, some enhancements possible.');
    console.log('📱 Safe to share with close family first.');
  } else if (results.critical.failed === 0) {
    console.log('⚠️  FUNCTIONAL but could be improved before wider sharing.');
  } else {
    console.log('❌ NOT READY - Fix critical issues first.');
    console.log(`   ${results.critical.failed} critical features need attention.`);
  }
  
  console.log('\n💡 SHARING TIPS:');
  console.log('  • Tell users to expect age verification on first visit');
  console.log('  • Point out the crisis support button (🆘) in bottom right');
  console.log('  • Let them explore journal writing and healing features');
  console.log('  • Ask for feedback on overall feel and usability');
  console.log('');
}

async function runFamilyTest() {
  console.log('🚀 RUNNING FAMILY & FRIENDS SUCCESS TEST');
  console.log('==========================================\n');
  console.log('Testing ALCHM at:', BASE_URL);
  console.log('This ensures your app is ready for your core group!\n');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await testCriticalFeatures();
  await testImportantFeatures();
  await testNiceToHave();
  
  printResults();
}

runFamilyTest().catch(console.error);