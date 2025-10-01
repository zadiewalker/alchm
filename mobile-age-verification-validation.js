#!/usr/bin/env node

/**
 * MOBILE AGE VERIFICATION VALIDATION SUITE
 * Comprehensive testing for mobile crisis access
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 MOBILE AGE VERIFICATION VALIDATION SUITE');
console.log('Testing emergency mobile optimizations...\n');

const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function test(name, testFn) {
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      results.passed++;
      results.tests.push({ name, status: 'PASS', details: result });
    } else {
      console.log(`❌ ${name}`);
      results.failed++;
      results.tests.push({ name, status: 'FAIL', details: 'Test returned false' });
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    results.failed++;
    results.tests.push({ name, status: 'ERROR', details: error.message });
  }
}

// Test 1: Emergency Mobile Age Verification Component Exists
test('Emergency Mobile Age Verification Component', () => {
  const componentPath = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  return fs.existsSync(componentPath);
});

// Test 2: Mobile Error Boundary Exists
test('Mobile Error Boundary Component', () => {
  const boundaryPath = './src/components/auth/MobileAgeVerificationErrorBoundary.tsx';
  return fs.existsSync(boundaryPath);
});

// Test 3: Layout Uses Emergency Component
test('Layout Configuration Updated', () => {
  const layoutPath = './src/app/layout.tsx';
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  return layoutContent.includes('EmergencyMobileAgeVerification');
});

// Test 4: Crisis Resources Always Accessible
test('Crisis Resources in Components', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasCrisisPhone = content.includes('tel:988');
  const hasCrisisSMS = content.includes('sms:741741');
  const hasEmergencyAccess = content.includes('crisis-button') || content.includes('crisisButton');
  
  return hasCrisisPhone && hasCrisisSMS && hasEmergencyAccess;
});

// Test 5: Mobile Touch Targets
test('Mobile Touch Target Specifications', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  // Check for minimum touch target sizes (64px for emergency mode)
  const hasLargeTouchTargets = content.includes('minHeight: \'64px\'') || content.includes('min-height: 64px');
  const hasTouchAction = content.includes('touchAction: \'manipulation\'');
  
  return hasLargeTouchTargets && hasTouchAction;
});

// Test 6: Error Boundary Fallback
test('Error Boundary Fallback Implementation', () => {
  const boundaryPath = './src/components/auth/MobileAgeVerificationErrorBoundary.tsx';
  const content = fs.readFileSync(boundaryPath, 'utf8');
  
  const hasSimpleFallback = content.includes('I am 18 or older');
  const hasCrisisAccess = content.includes('tel:988');
  const hasErrorHandling = content.includes('componentDidCatch');
  
  return hasSimpleFallback && hasCrisisAccess && hasErrorHandling;
});

// Test 7: Inline Styles for Reliability
test('Inline Styles Usage', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  // Check that styles are defined inline, not dependent on external CSS
  const hasInlineStyles = content.includes('const styles = {');
  const hasDirectStyles = content.includes('style={styles.');
  
  return hasInlineStyles && hasDirectStyles;
});

// Test 8: Local Storage Handling
test('Local Storage Error Handling', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasTryCatch = content.includes('try {') && content.includes('catch (error)');
  const hasLocalStorage = content.includes('localStorage.setItem');
  
  return hasTryCatch && hasLocalStorage;
});

// Test 9: Development Server Response
test('Development Server Mobile Response', () => {
  try {
    const response = execSync(`curl -s -I -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" http://localhost:3000/en/auth/login`, 
      { encoding: 'utf8', timeout: 10000 });
    
    return response.includes('200 OK');
  } catch (error) {
    return false;
  }
});

// Test 10: Mobile Viewport Configuration
test('Mobile Viewport Meta Tags', () => {
  const layoutPath = './src/app/layout.tsx';
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const hasViewport = content.includes('viewport-fit=cover');
  const hasUserScalable = content.includes('user-scalable=yes');
  const hasMaxScale = content.includes('maximum-scale=5.0');
  
  return hasViewport && hasUserScalable && hasMaxScale;
});

// Test 11: Crisis Mode CSS
test('Crisis Mode CSS Classes', () => {
  const layoutPath = './src/app/layout.tsx';
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const hasCrisisCSS = content.includes('crisis-level-crisis');
  const hasTouchTargets = content.includes('min-height:64px');
  
  return hasCrisisCSS && hasTouchTargets;
});

// Test 12: Diagnostic Test Page
test('Mobile Diagnostic Test Page', () => {
  const testPagePath = './mobile-age-verification-test.html';
  if (!fs.existsSync(testPagePath)) return false;
  
  const content = fs.readFileSync(testPagePath, 'utf8');
  const hasAgeTest = content.includes('testAgeVerification');
  const hasCrisisTest = content.includes('testCrisisAccessibility');
  const hasTouchTest = content.includes('testTouchTargets');
  
  return hasAgeTest && hasCrisisTest && hasTouchTest;
});

// Run all tests
console.log('Running validation tests...\n');

// File system tests
test('Emergency Mobile Age Verification Component', () => {
  const componentPath = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  return fs.existsSync(componentPath);
});

test('Mobile Error Boundary Component', () => {
  const boundaryPath = './src/components/auth/MobileAgeVerificationErrorBoundary.tsx';
  return fs.existsSync(boundaryPath);
});

test('Layout Configuration Updated', () => {
  const layoutPath = './src/app/layout.tsx';
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  return layoutContent.includes('EmergencyMobileAgeVerification');
});

test('Crisis Resources in Components', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasCrisisPhone = content.includes('tel:988');
  const hasCrisisSMS = content.includes('sms:741741');
  const hasEmergencyAccess = content.includes('crisis-button') || content.includes('crisisButton');
  
  return hasCrisisPhone && hasCrisisSMS && hasEmergencyAccess;
});

test('Mobile Touch Target Specifications', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasLargeTouchTargets = content.includes('minHeight: \'64px\'') || content.includes('min-height: 64px');
  const hasTouchAction = content.includes('touchAction: \'manipulation\'');
  
  return hasLargeTouchTargets && hasTouchAction;
});

test('Error Boundary Fallback Implementation', () => {
  const boundaryPath = './src/components/auth/MobileAgeVerificationErrorBoundary.tsx';
  const content = fs.readFileSync(boundaryPath, 'utf8');
  
  const hasSimpleFallback = content.includes('I am 18 or older');
  const hasCrisisAccess = content.includes('tel:988');
  const hasErrorHandling = content.includes('componentDidCatch');
  
  return hasSimpleFallback && hasCrisisAccess && hasErrorHandling;
});

test('Inline Styles Usage', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasInlineStyles = content.includes('const styles = {');
  const hasDirectStyles = content.includes('style={styles.');
  
  return hasInlineStyles && hasDirectStyles;
});

test('Local Storage Error Handling', () => {
  const emergencyComponent = './src/components/auth/EmergencyMobileAgeVerification.tsx';
  const content = fs.readFileSync(emergencyComponent, 'utf8');
  
  const hasTryCatch = content.includes('try {') && content.includes('catch (error)');
  const hasLocalStorage = content.includes('localStorage.setItem');
  
  return hasTryCatch && hasLocalStorage;
});

test('Mobile Viewport Configuration', () => {
  const layoutPath = './src/app/layout.tsx';
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const hasViewport = content.includes('viewport-fit=cover');
  const hasUserScalable = content.includes('user-scalable=yes');
  const hasMaxScale = content.includes('maximum-scale=5.0');
  
  return hasViewport && hasUserScalable && hasMaxScale;
});

test('Crisis Mode CSS Classes', () => {
  const layoutPath = './src/app/layout.tsx';
  const content = fs.readFileSync(layoutPath, 'utf8');
  
  const hasCrisisCSS = content.includes('crisis-level-crisis');
  const hasTouchTargets = content.includes('min-height:64px');
  
  return hasCrisisCSS && hasTouchTargets;
});

test('Mobile Diagnostic Test Page', () => {
  const testPagePath = './mobile-age-verification-test.html';
  if (!fs.existsSync(testPagePath)) return false;
  
  const content = fs.readFileSync(testPagePath, 'utf8');
  const hasAgeTest = content.includes('testAgeVerification');
  const hasCrisisTest = content.includes('testCrisisAccessibility');
  const hasTouchTest = content.includes('testTouchTargets');
  
  return hasAgeTest && hasCrisisTest && hasTouchTest;
});

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('═'.repeat(50));
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

if (results.failed > 0) {
  console.log('\n🚨 FAILED TESTS:');
  results.tests
    .filter(test => test.status !== 'PASS')
    .forEach(test => {
      console.log(`   ❌ ${test.name}: ${test.details}`);
    });
}

console.log('\n🎯 MOBILE OPTIMIZATION STATUS:');
if (results.passed >= 8) {
  console.log('✅ EXCELLENT - Mobile crisis access optimized');
} else if (results.passed >= 6) {
  console.log('⚠️  GOOD - Minor improvements needed');
} else {
  console.log('🚨 CRITICAL - Immediate attention required');
}

console.log('\n📱 NEXT STEPS:');
console.log('1. Test on actual mobile devices (iOS Safari, Chrome Mobile)');
console.log('2. Use diagnostic page: http://localhost:3000/mobile-age-verification-test.html');
console.log('3. Verify crisis resources work in airplane mode');
console.log('4. Test with poor network conditions (3G throttling)');
console.log('5. Validate with screen readers and accessibility tools');

// Generate detailed report
const reportPath = './mobile-age-verification-validation-report.json';
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    passed: results.passed,
    failed: results.failed,
    successRate: Math.round((results.passed / (results.passed + results.failed)) * 100)
  },
  tests: results.tests,
  recommendations: [
    'Test on physical mobile devices',
    'Validate crisis resource accessibility',
    'Check performance under network stress',
    'Verify accessibility compliance',
    'Test with various mobile browsers'
  ]
}, null, 2));

console.log(`\n📋 Detailed report saved: ${reportPath}`);
console.log('\n🚀 READY FOR MOBILE CRISIS ACCESS TESTING');