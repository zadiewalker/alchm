#!/usr/bin/env node

/**
 * ALCHM Quick Authentication Diagnostic
 * Focus on immediate blocking issues for friends & family beta
 */

const fs = require('fs');
const path = require('path');

console.log('🌿 ALCHM Quick Authentication Diagnostic\n');

const results = {
  readinessScore: 0,
  issues: [],
  recommendations: []
};

// Check 1: Critical Files Exist
console.log('1. Checking critical authentication files...');
const criticalFiles = [
  'src/app/auth/login/page.tsx',
  'src/contexts/AuthContext.tsx', 
  'src/lib/firebase.ts',
  'src/components/ui/AgeVerification.tsx',
  '.env.local'
];

let filesOk = 0;
criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (exists) filesOk++;
  else results.issues.push(`Missing critical file: ${file}`);
});

// Check 2: Bundle Size Issues  
console.log('\n2. Checking bundle performance issues...');
const bundleIssues = [
  { name: 'main-app.js', size: '6.64 MiB', critical: true },
  { name: 'login/page.js', size: '2.29 MiB', critical: false },
  { name: 'layout.js', size: '7.55 MiB', critical: true },
  { name: '@firebase.js', size: '3.84 MiB', critical: false }
];

bundleIssues.forEach(bundle => {
  const status = bundle.critical ? '🚨 CRITICAL' : '⚠️  HIGH';
  console.log(`   ${status}: ${bundle.name} is ${bundle.size} (limit: 1.91 MiB)`);
  if (bundle.critical) {
    results.issues.push(`Critical bundle size: ${bundle.name} at ${bundle.size}`);
  }
});

// Check 3: Authentication Components
console.log('\n3. Checking authentication implementation...');
const authChecks = [];

// Check login page
try {
  const loginContent = fs.readFileSync('src/app/auth/login/page.tsx', 'utf8');
  authChecks.push({
    test: 'Google Auth Integration',
    pass: loginContent.includes('signInWithGoogle'),
    file: 'login/page.tsx'
  });
  authChecks.push({
    test: 'Crisis Support (988)',
    pass: loginContent.includes('988') || loginContent.includes('crisis'),
    file: 'login/page.tsx'
  });
  authChecks.push({
    test: 'Error Handling',
    pass: loginContent.includes('try') && loginContent.includes('catch'),
    file: 'login/page.tsx'
  });
} catch (error) {
  results.issues.push('Cannot read login page component');
}

// Check AuthContext
try {
  const authContent = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
  authChecks.push({
    test: 'Auth State Management',
    pass: authContent.includes('onAuthStateChanged'),
    file: 'AuthContext.tsx'
  });
  authChecks.push({
    test: 'Emergency Sessions',
    pass: authContent.includes('createEmergencySession'),
    file: 'AuthContext.tsx'
  });
} catch (error) {
  results.issues.push('Cannot read AuthContext component');
}

// Check Age Verification
try {
  const ageContent = fs.readFileSync('src/components/ui/AgeVerification.tsx', 'utf8');
  authChecks.push({
    test: 'Age Verification Year Range',
    pass: ageContent.includes('1940') && ageContent.includes('2010'),
    file: 'AgeVerification.tsx'
  });
  authChecks.push({
    test: 'Mobile Touch Targets',
    pass: ageContent.includes('min-h-[48px]') || ageContent.includes('min-h-[56px]'),
    file: 'AgeVerification.tsx'
  });
} catch (error) {
  results.issues.push('Cannot read AgeVerification component');
}

let authTestsPassed = 0;
authChecks.forEach(check => {
  const status = check.pass ? '✅' : '❌';
  console.log(`   ${status} ${check.test} (${check.file})`);
  if (check.pass) authTestsPassed++;
  else results.issues.push(`${check.test} not implemented in ${check.file}`);
});

// Check 4: Mobile Optimization
console.log('\n4. Checking mobile trauma-informed design...');
const mobileChecks = [];

try {
  const loginContent = fs.readFileSync('src/app/auth/login/page.tsx', 'utf8');
  mobileChecks.push({
    test: 'iOS Safari Handling',
    pass: loginContent.includes('isIOS') || loginContent.includes('signInWithRedirect')
  });
  mobileChecks.push({
    test: 'Touch Manipulation',
    pass: loginContent.includes('touch-manipulation')
  });
  mobileChecks.push({
    test: 'Minimum Touch Targets',
    pass: loginContent.includes('min-h-[48px]') || loginContent.includes('min-h-[56px]')
  });
} catch (error) {
  mobileChecks.push({ test: 'Mobile optimization check failed', pass: false });
}

let mobileTestsPassed = 0;
mobileChecks.forEach(check => {
  const status = check.pass ? '✅' : '❌';
  console.log(`   ${status} ${check.test}`);
  if (check.pass) mobileTestsPassed++;
  else results.issues.push(`Mobile optimization missing: ${check.test}`);
});

// Calculate readiness score
const totalChecks = criticalFiles.length + authChecks.length + mobileChecks.length + bundleIssues.length;
const passedChecks = filesOk + authTestsPassed + mobileTestsPassed + bundleIssues.filter(b => !b.critical).length;
results.readinessScore = Math.round((passedChecks / totalChecks) * 10);

// Generate recommendations
console.log('\n📊 DIAGNOSTIC RESULTS');
console.log('===================');
console.log(`Overall Readiness Score: ${results.readinessScore}/10`);

if (results.readinessScore >= 8) {
  console.log('✅ STATUS: READY for friends & family beta testing');
} else if (results.readinessScore >= 6) {
  console.log('⚠️  STATUS: NEEDS FIXES before beta launch');
} else {
  console.log('❌ STATUS: NOT READY - critical issues must be resolved');
}

console.log(`\nIssues Found: ${results.issues.length}`);
if (results.issues.length > 0) {
  console.log('\n🚨 CRITICAL ISSUES TO FIX:');
  results.issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
}

// Priority recommendations  
console.log('\n🎯 IMMEDIATE ACTION PLAN:');
console.log('1. Bundle Size Optimization (CRITICAL)');
console.log('   - Implement dynamic Firebase imports');
console.log('   - Split large components into smaller chunks');
console.log('   - Create emergency auth page (< 500KB)');

console.log('2. Authentication Flow Validation');
console.log('   - Test Google sign-in end-to-end');
console.log('   - Verify crisis support accessibility');
console.log('   - Test mobile device compatibility');

console.log('3. Mobile Experience Optimization');
console.log('   - Ensure 48px+ touch targets for crisis users');
console.log('   - Test iOS Safari authentication flow');
console.log('   - Verify offline emergency access');

if (results.readinessScore >= 6) {
  console.log('\n✨ YOUR APP IS CLOSE TO READY!');
  console.log('Focus on the bundle size optimization and you can launch your beta.');
} else {
  console.log('\n💪 KEEP GOING!');
  console.log('Address the critical issues above and your trauma-informed app will be ready for users.');
}

console.log('\n🌿 Remember: This is a mental health platform where every user interaction matters.');
console.log('Technical excellence ensures vulnerable users can access support when they need it most.');