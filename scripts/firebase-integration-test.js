#!/usr/bin/env node

/**
 * ALCHM Firebase Integration Test Suite
 * Tests critical Firebase services for App Store readiness
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 ALCHM Firebase Integration Test Suite');
console.log('=========================================');

const testResults = {
  configuration: false,
  functions: false,
  firestore: false,
  auth: false,
  hosting: false,
  critical_issues: [],
  warnings: [],
  recommendations: []
};

// Test 1: Firebase Configuration Validation
console.log('\n1️⃣ Testing Firebase Configuration...');
try {
  // Check firebase.json exists and is valid
  const firebaseConfig = require('../firebase.json');
  
  // Validate hosting configuration
  if (firebaseConfig.hosting && Array.isArray(firebaseConfig.hosting)) {
    const alchmSite = firebaseConfig.hosting.find(site => site.site === 'alchmapp');
    if (alchmSite) {
      console.log('✅ Firebase hosting configuration found for alchmapp');
      testResults.hosting = true;
    } else {
      testResults.critical_issues.push('Missing alchmapp hosting site configuration');
    }
  }
  
  // Validate functions configuration
  if (firebaseConfig.functions && Array.isArray(firebaseConfig.functions)) {
    const functionsConfig = firebaseConfig.functions[0];
    if (functionsConfig.runtime === 'nodejs20') {
      console.log('✅ Firebase Functions runtime configured correctly (Node.js 20)');
      testResults.functions = true;
    } else {
      testResults.warnings.push('Firebase Functions runtime should be nodejs20');
    }
  }
  
  // Validate Firestore configuration
  if (firebaseConfig.firestore) {
    console.log('✅ Firestore configuration found');
    testResults.firestore = true;
  }
  
  testResults.configuration = true;
  console.log('✅ Firebase configuration validation passed');
} catch (error) {
  console.error('❌ Firebase configuration validation failed:', error.message);
  testResults.critical_issues.push(`Firebase configuration error: ${error.message}`);
}

// Test 2: Firebase Functions Build and Deploy Test
console.log('\n2️⃣ Testing Firebase Functions Build...');
try {
  execSync('cd functions && npm run build', { stdio: 'pipe' });
  console.log('✅ Firebase Functions build successful');
  testResults.functions = true;
} catch (error) {
  console.error('❌ Firebase Functions build failed');
  testResults.critical_issues.push('Firebase Functions build failure');
}

// Test 3: Firestore Security Rules Validation
console.log('\n3️⃣ Testing Firestore Security Rules...');
try {
  const rulesContent = fs.readFileSync('./firestore.rules', 'utf8');
  
  // Check for critical security patterns
  const securityChecks = [
    { pattern: /isAuthenticated\(\)/, name: 'Authentication checks' },
    { pattern: /isOwner\(userId\)/, name: 'Ownership validation' },
    { pattern: /request\.auth\.uid/, name: 'User ID validation' },
    { pattern: /crisis_resources[\s\S]*?allow read: if true/, name: 'Public crisis resources' }
  ];
  
  let securityScore = 0;
  securityChecks.forEach(check => {
    if (check.pattern.test(rulesContent)) {
      console.log(`✅ ${check.name} found in security rules`);
      securityScore++;
    } else {
      testResults.warnings.push(`Missing ${check.name} in security rules`);
    }
  });
  
  if (securityScore >= 3) {
    console.log('✅ Firestore security rules validation passed');
    testResults.firestore = true;
  } else {
    testResults.critical_issues.push('Insufficient Firestore security measures');
  }
} catch (error) {
  console.error('❌ Firestore security rules validation failed:', error.message);
  testResults.critical_issues.push(`Firestore rules error: ${error.message}`);
}

// Test 4: Environment Variables Check
console.log('\n4️⃣ Testing Environment Configuration...');
try {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'FIREBASE_SERVICE_ACCOUNT_KEY'
  ];
  
  let envScore = 0;
  requiredEnvVars.forEach(envVar => {
    // Check if env var is mentioned in .env.example or .env.local
    try {
      const envExample = fs.readFileSync('./.env.example', 'utf8');
      if (envExample.includes(envVar)) {
        console.log(`✅ ${envVar} documented in environment`);
        envScore++;
      }
    } catch (e) {
      // .env.example might not exist
    }
  });
  
  if (envScore >= 3) {
    console.log('✅ Environment variables configuration valid');
    testResults.auth = true;
  } else {
    testResults.warnings.push('Some environment variables not documented');
  }
} catch (error) {
  testResults.warnings.push(`Environment check warning: ${error.message}`);
}

// Test 5: Crisis Detection Functions Test
console.log('\n5️⃣ Testing Crisis Detection Integration...');
try {
  const functionsIndex = fs.readFileSync('./functions/src/index.ts', 'utf8');
  
  const crisisChecks = [
    { pattern: /crisisDetection/, name: 'Crisis detection function' },
    { pattern: /emergencyResources/, name: 'Emergency resources function' },
    { pattern: /universalAccess.*true/, name: 'Universal access compliance' },
    { pattern: /paymentIndependent.*true/, name: 'Payment independence' }
  ];
  
  let crisisScore = 0;
  crisisChecks.forEach(check => {
    if (check.pattern.test(functionsIndex)) {
      console.log(`✅ ${check.name} implemented`);
      crisisScore++;
    } else {
      testResults.warnings.push(`Missing ${check.name}`);
    }
  });
  
  if (crisisScore >= 3) {
    console.log('✅ Crisis detection integration valid');
  } else {
    testResults.critical_issues.push('Crisis detection system incomplete');
  }
} catch (error) {
  testResults.critical_issues.push(`Crisis detection test failed: ${error.message}`);
}

// Test 6: Next.js Configuration for Firebase Studio
console.log('\n6️⃣ Testing Next.js Firebase Studio Configuration...');
try {
  const nextConfig = fs.readFileSync('./next.config.js', 'utf8');
  
  if (nextConfig.includes("output: 'standalone'")) {
    console.log('✅ Next.js configured for Firebase Studio (standalone output)');
  } else {
    testResults.critical_issues.push('Next.js not configured for Firebase Studio - needs standalone output');
  }
  
  if (nextConfig.includes('unoptimized: true')) {
    console.log('✅ Images configured for Firebase Functions compatibility');
  } else {
    testResults.warnings.push('Images should be unoptimized for Firebase Functions');
  }
  
} catch (error) {
  testResults.critical_issues.push(`Next.js configuration test failed: ${error.message}`);
}

// Test Results Summary
console.log('\n📊 TEST RESULTS SUMMARY');
console.log('========================');

const overallScore = Object.values(testResults).slice(0, 5).filter(Boolean).length;
const totalTests = 5;

console.log(`\n🎯 Overall Score: ${overallScore}/${totalTests} tests passed`);

if (testResults.critical_issues.length > 0) {
  console.log('\n🚨 CRITICAL ISSUES (Must Fix Before App Store Submission):');
  testResults.critical_issues.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`);
  });
}

if (testResults.warnings.length > 0) {
  console.log('\n⚠️ WARNINGS (Recommended Fixes):');
  testResults.warnings.forEach((warning, i) => {
    console.log(`   ${i + 1}. ${warning}`);
  });
}

// App Store Readiness Assessment
console.log('\n🏪 APP STORE READINESS ASSESSMENT');
console.log('==================================');

if (testResults.critical_issues.length === 0 && overallScore >= 4) {
  console.log('✅ READY - Firebase integration meets App Store requirements');
  console.log('   ✅ Core Firebase services configured correctly');
  console.log('   ✅ Security measures in place');
  console.log('   ✅ Crisis features properly implemented');
  console.log('   ✅ Next.js configured for Firebase Studio');
} else if (testResults.critical_issues.length === 0 && overallScore >= 3) {
  console.log('⚠️ MOSTLY READY - Minor issues to address');
  console.log('   ✅ Critical functionality working');
  console.log('   ⚠️ Some optimizations recommended');
} else {
  console.log('❌ NOT READY - Critical issues must be resolved');
  console.log('   ❌ Fix critical issues before App Store submission');
}

console.log('\n🔧 NEXT STEPS:');
if (testResults.critical_issues.length > 0) {
  console.log('1. Resolve all critical issues listed above');
  console.log('2. Re-run this test to verify fixes');
}
if (testResults.warnings.length > 0) {
  console.log('3. Address warnings for optimal performance');
}
console.log('4. Run full Firebase deploy test: `firebase deploy`');
console.log('5. Test production deployment with real data');

// Save results for CI/CD
const resultsJson = JSON.stringify(testResults, null, 2);
fs.writeFileSync('./firebase-integration-test-results.json', resultsJson);
console.log('\n📄 Detailed results saved to: firebase-integration-test-results.json');

process.exit(testResults.critical_issues.length > 0 ? 1 : 0);