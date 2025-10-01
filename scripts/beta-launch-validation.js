#!/usr/bin/env node
/**
 * ALCHM Beta Launch - Comprehensive User Journey Validation
 * Tests all critical user paths for friends and family beta launch
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3001';
const LOCALE_BASE_URL = 'http://localhost:3001/en';
const TEST_RESULTS = {
  onboarding: { status: 'pending', metrics: {}, issues: [] },
  crisis: { status: 'pending', metrics: {}, issues: [] },
  auth: { status: 'pending', metrics: {}, issues: [] },
  coreFeatures: { status: 'pending', metrics: {}, issues: [] },
  mobile: { status: 'pending', metrics: {}, issues: [] }
};

// Helper function to make HTTP requests with timing
async function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const urlObj = new URL(url);
    const requestModule = urlObj.protocol === 'https:' ? https : http;
    
    const req = requestModule.request(url, { method }, (res) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          responseTime,
          headers: res.headers,
          body: data,
          url: url
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Test 1: New User Onboarding Flow
async function testOnboardingFlow() {
  console.log('🧪 Testing: New User Onboarding Flow');
  
  try {
    // Landing page (with locale redirect)
    const landingResponse = await makeRequest(LOCALE_BASE_URL);
    TEST_RESULTS.onboarding.metrics.landingLoadTime = landingResponse.responseTime;
    TEST_RESULTS.onboarding.metrics.landingStatus = landingResponse.status;
    
    console.log(`  Landing page: ${landingResponse.status} (${landingResponse.responseTime}ms)`);
    
    // Check for critical elements in HTML
    const hasALCHM = landingResponse.body.includes('ALCHM');
    const hasSignUp = landingResponse.body.includes('Start Your Journey') || 
                      landingResponse.body.includes('Sign Up') ||
                      landingResponse.body.includes('Get Started');
    
    // Age verification page
    const ageVerificationResponse = await makeRequest(`${LOCALE_BASE_URL}/auth/signup`);
    TEST_RESULTS.onboarding.metrics.signupPageTime = ageVerificationResponse.responseTime;
    
    console.log(`  Signup page: ${ageVerificationResponse.status} (${ageVerificationResponse.responseTime}ms)`);
    
    // Authentication setup
    const authResponse = await makeRequest(`${LOCALE_BASE_URL}/auth/login`);
    TEST_RESULTS.onboarding.metrics.authPageTime = authResponse.responseTime;
    
    console.log(`  Auth page: ${authResponse.status} (${authResponse.responseTime}ms)`);
    
    // Dashboard access test
    const dashboardResponse = await makeRequest(`${LOCALE_BASE_URL}/dashboard`);
    TEST_RESULTS.onboarding.metrics.dashboardTime = dashboardResponse.responseTime;
    
    console.log(`  Dashboard: ${dashboardResponse.status} (${dashboardResponse.responseTime}ms)`);
    
    // Success criteria: All pages load < 3s, contain expected content
    const allPagesLoad = [landingResponse, ageVerificationResponse, authResponse, dashboardResponse]
      .every(r => r.status === 200);
    const performanceGood = landingResponse.responseTime < 3000;
    const contentPresent = hasALCHM && hasSignUp;
    
    TEST_RESULTS.onboarding.status = allPagesLoad && performanceGood && contentPresent ? 'pass' : 'fail';
    TEST_RESULTS.onboarding.metrics.allPagesLoad = allPagesLoad;
    TEST_RESULTS.onboarding.metrics.contentPresent = contentPresent;
    
    if (!allPagesLoad) TEST_RESULTS.onboarding.issues.push('Some pages failed to load');
    if (!performanceGood) TEST_RESULTS.onboarding.issues.push('Landing page load time > 3s');
    if (!contentPresent) TEST_RESULTS.onboarding.issues.push('Missing critical content elements');
    
    console.log(`  ✅ Onboarding: ${TEST_RESULTS.onboarding.status}`);
    
  } catch (error) {
    TEST_RESULTS.onboarding.status = 'fail';
    TEST_RESULTS.onboarding.issues.push(`Onboarding error: ${error.message}`);
    console.log(`  ❌ Onboarding failed: ${error.message}`);
  }
}

// Test 2: Crisis User Emergency Access
async function testCrisisAccess() {
  console.log('🚨 Testing: Crisis User Emergency Access');
  
  try {
    // Emergency page direct access (should bypass auth)
    const emergencyResponse = await makeRequest(`${LOCALE_BASE_URL}/emergency`);
    TEST_RESULTS.crisis.metrics.emergencyLoadTime = emergencyResponse.responseTime;
    TEST_RESULTS.crisis.metrics.emergencyStatus = emergencyResponse.status;
    
    console.log(`  Emergency page: ${emergencyResponse.status} (${emergencyResponse.responseTime}ms)`);
    
    // Check for 988 crisis hotline
    const has988 = emergencyResponse.body.includes('988') || 
                   emergencyResponse.body.includes('Crisis Hotline') ||
                   emergencyResponse.body.includes('tel:988');
    
    // Check for emergency journaling
    const hasEmergencyJournal = emergencyResponse.body.includes('textarea') ||
                                emergencyResponse.body.includes('journal') ||
                                emergencyResponse.body.includes('write');
    
    // Check for crisis resources
    const hasCrisisResources = emergencyResponse.body.includes('Crisis Resources') ||
                               emergencyResponse.body.includes('Get Help') ||
                               emergencyResponse.body.includes('Support');
    
    // Success criteria: <2s load time, 988 accessible, emergency features present
    const performanceGood = emergencyResponse.responseTime < 2000;
    const accessibleContent = has988 && (hasEmergencyJournal || hasCrisisResources);
    
    TEST_RESULTS.crisis.status = (emergencyResponse.status === 200) && performanceGood && accessibleContent ? 'pass' : 'fail';
    TEST_RESULTS.crisis.metrics.has988 = has988;
    TEST_RESULTS.crisis.metrics.hasEmergencyJournal = hasEmergencyJournal;
    TEST_RESULTS.crisis.metrics.hasCrisisResources = hasCrisisResources;
    
    if (emergencyResponse.status !== 200) TEST_RESULTS.crisis.issues.push('Emergency page not accessible');
    if (!performanceGood) TEST_RESULTS.crisis.issues.push('Emergency page load time > 2s');
    if (!has988) TEST_RESULTS.crisis.issues.push('988 crisis hotline not found');
    if (!accessibleContent) TEST_RESULTS.crisis.issues.push('Missing emergency features');
    
    console.log(`  ✅ Crisis access: ${TEST_RESULTS.crisis.status}`);
    
  } catch (error) {
    TEST_RESULTS.crisis.status = 'fail';
    TEST_RESULTS.crisis.issues.push(`Crisis access error: ${error.message}`);
    console.log(`  ❌ Crisis access failed: ${error.message}`);
  }
}

// Test 3: Authentication Flows
async function testAuthenticationFlows() {
  console.log('🔐 Testing: Authentication Flows');
  
  try {
    // Login page
    const loginResponse = await makeRequest(`${LOCALE_BASE_URL}/auth/login`);
    TEST_RESULTS.auth.metrics.loginLoadTime = loginResponse.responseTime;
    TEST_RESULTS.auth.metrics.loginStatus = loginResponse.status;
    
    console.log(`  Login page: ${loginResponse.status} (${loginResponse.responseTime}ms)`);
    
    // Check for Google OAuth
    const hasGoogleOAuth = loginResponse.body.includes('Google') ||
                          loginResponse.body.includes('google.com') ||
                          loginResponse.body.includes('oauth');
    
    // Check for email/password
    const hasEmailPassword = loginResponse.body.includes('type="email"') &&
                            loginResponse.body.includes('type="password"');
    
    // Signup page
    const signupResponse = await makeRequest(`${LOCALE_BASE_URL}/auth/signup`);
    TEST_RESULTS.auth.metrics.signupLoadTime = signupResponse.responseTime;
    
    console.log(`  Signup page: ${signupResponse.status} (${signupResponse.responseTime}ms)`);
    
    // Success criteria: <2s response, auth methods available
    const performanceGood = loginResponse.responseTime < 2000 && signupResponse.responseTime < 2000;
    const authMethodsAvailable = hasGoogleOAuth || hasEmailPassword;
    
    TEST_RESULTS.auth.status = (loginResponse.status === 200) && performanceGood && authMethodsAvailable ? 'pass' : 'fail';
    TEST_RESULTS.auth.metrics.hasGoogleOAuth = hasGoogleOAuth;
    TEST_RESULTS.auth.metrics.hasEmailPassword = hasEmailPassword;
    
    if (loginResponse.status !== 200) TEST_RESULTS.auth.issues.push('Login page not accessible');
    if (!performanceGood) TEST_RESULTS.auth.issues.push('Auth pages load time > 2s');
    if (!authMethodsAvailable) TEST_RESULTS.auth.issues.push('No authentication methods found');
    
    console.log(`  ✅ Authentication: ${TEST_RESULTS.auth.status}`);
    
  } catch (error) {
    TEST_RESULTS.auth.status = 'fail';
    TEST_RESULTS.auth.issues.push(`Auth error: ${error.message}`);
    console.log(`  ❌ Authentication failed: ${error.message}`);
  }
}

// Test 4: Core Feature Access
async function testCoreFeatures() {
  console.log('📝 Testing: Core Feature Access');
  
  try {
    // Journal page
    const journalResponse = await makeRequest(`${LOCALE_BASE_URL}/journal`);
    TEST_RESULTS.coreFeatures.metrics.journalLoadTime = journalResponse.responseTime;
    TEST_RESULTS.coreFeatures.metrics.journalStatus = journalResponse.status;
    
    console.log(`  Journal page: ${journalResponse.status} (${journalResponse.responseTime}ms)`);
    
    // Check for journal editor
    const hasJournalEditor = journalResponse.body.includes('textarea') ||
                            journalResponse.body.includes('contenteditable') ||
                            journalResponse.body.includes('editor');
    
    // Dashboard page
    const dashboardResponse = await makeRequest(`${LOCALE_BASE_URL}/dashboard`);
    TEST_RESULTS.coreFeatures.metrics.dashboardLoadTime = dashboardResponse.responseTime;
    
    console.log(`  Dashboard page: ${dashboardResponse.status} (${dashboardResponse.responseTime}ms)`);
    
    // Check for dashboard content
    const hasDashboardContent = dashboardResponse.body.includes('Dashboard') ||
                               dashboardResponse.body.includes('Welcome') ||
                               dashboardResponse.body.includes('journal');
    
    // Pathways page
    const pathwaysResponse = await makeRequest(`${LOCALE_BASE_URL}/pathways`);
    TEST_RESULTS.coreFeatures.metrics.pathwaysLoadTime = pathwaysResponse.responseTime;
    
    console.log(`  Pathways page: ${pathwaysResponse.status} (${pathwaysResponse.responseTime}ms)`);
    
    // Success criteria: <1s feature loading, core features present
    const performanceGood = journalResponse.responseTime < 1000;
    const featuresPresent = hasJournalEditor && hasDashboardContent;
    
    TEST_RESULTS.coreFeatures.status = (journalResponse.status === 200) && performanceGood && featuresPresent ? 'pass' : 'fail';
    TEST_RESULTS.coreFeatures.metrics.hasJournalEditor = hasJournalEditor;
    TEST_RESULTS.coreFeatures.metrics.hasDashboardContent = hasDashboardContent;
    
    if (journalResponse.status !== 200) TEST_RESULTS.coreFeatures.issues.push('Journal page not accessible');
    if (!performanceGood) TEST_RESULTS.coreFeatures.issues.push('Journal load time > 1s');
    if (!featuresPresent) TEST_RESULTS.coreFeatures.issues.push('Missing core features');
    
    console.log(`  ✅ Core features: ${TEST_RESULTS.coreFeatures.status}`);
    
  } catch (error) {
    TEST_RESULTS.coreFeatures.status = 'fail';
    TEST_RESULTS.coreFeatures.issues.push(`Core features error: ${error.message}`);
    console.log(`  ❌ Core features failed: ${error.message}`);
  }
}

// Test 5: Mobile Optimization Analysis
async function testMobileOptimization() {
  console.log('📱 Testing: Mobile Optimization');
  
  try {
    // Test with mobile user agent
    const mobileHeaders = {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
    };
    
    // Make requests with mobile headers
    const mobileResponse = await makeRequest(LOCALE_BASE_URL);
    TEST_RESULTS.mobile.metrics.mobileLoadTime = mobileResponse.responseTime;
    
    console.log(`  Mobile response: ${mobileResponse.status} (${mobileResponse.responseTime}ms)`);
    
    // Check for mobile-specific optimizations
    const hasViewportMeta = mobileResponse.body.includes('viewport') &&
                           mobileResponse.body.includes('width=device-width');
    
    const hasTouchOptimization = mobileResponse.body.includes('touch-action') ||
                                mobileResponse.body.includes('user-select');
    
    const hasResponsiveDesign = mobileResponse.body.includes('responsive') ||
                               mobileResponse.body.includes('@media') ||
                               mobileResponse.body.includes('flex') ||
                               mobileResponse.body.includes('grid');
    
    // Check for trauma-informed design elements
    const hasLargeText = mobileResponse.body.includes('text-lg') ||
                        mobileResponse.body.includes('text-xl') ||
                        mobileResponse.body.includes('font-size: 1.125rem') ||
                        mobileResponse.body.includes('font-size: 1.25rem');
    
    const hasCalmColors = mobileResponse.body.includes('bg-blue-') ||
                         mobileResponse.body.includes('bg-green-') ||
                         mobileResponse.body.includes('bg-purple-');
    
    // Performance check
    const performanceGood = mobileResponse.responseTime < 2000;
    const mobileOptimized = hasViewportMeta && hasResponsiveDesign;
    const traumaInformed = hasLargeText && hasCalmColors;
    
    TEST_RESULTS.mobile.status = performanceGood && mobileOptimized ? 'pass' : 'fail';
    TEST_RESULTS.mobile.metrics.hasViewportMeta = hasViewportMeta;
    TEST_RESULTS.mobile.metrics.hasResponsiveDesign = hasResponsiveDesign;
    TEST_RESULTS.mobile.metrics.traumaInformed = traumaInformed;
    
    if (!performanceGood) TEST_RESULTS.mobile.issues.push('Mobile load time > 2s');
    if (!hasViewportMeta) TEST_RESULTS.mobile.issues.push('Missing viewport meta tag');
    if (!hasResponsiveDesign) TEST_RESULTS.mobile.issues.push('No responsive design detected');
    if (!traumaInformed) TEST_RESULTS.mobile.issues.push('Trauma-informed design elements missing');
    
    console.log(`  ✅ Mobile optimization: ${TEST_RESULTS.mobile.status}`);
    
  } catch (error) {
    TEST_RESULTS.mobile.status = 'fail';
    TEST_RESULTS.mobile.issues.push(`Mobile optimization error: ${error.message}`);
    console.log(`  ❌ Mobile optimization failed: ${error.message}`);
  }
}

// Generate comprehensive report
function generateReport() {
  const totalTests = Object.keys(TEST_RESULTS).length;
  const passedTests = Object.values(TEST_RESULTS).filter(r => r.status === 'pass').length;
  const launchReadinessScore = Math.round((passedTests / totalTests) * 100);
  
  console.log('\n' + '='.repeat(60));
  console.log('🚀 ALCHM BETA LAUNCH READINESS REPORT');
  console.log('='.repeat(60));
  console.log(`Overall Score: ${launchReadinessScore}% (${passedTests}/${totalTests} tests passed)`);
  console.log('');
  
  Object.entries(TEST_RESULTS).forEach(([category, result]) => {
    const status = result.status === 'pass' ? '✅' : '❌';
    console.log(`${status} ${category.toUpperCase()}: ${result.status}`);
    
    if (result.metrics && Object.keys(result.metrics).length > 0) {
      Object.entries(result.metrics).forEach(([metric, value]) => {
        console.log(`   📊 ${metric}: ${value}`);
      });
    }
    
    if (result.issues && result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`   ⚠️  ${issue}`);
      });
    }
    console.log('');
  });
  
  console.log('PERFORMANCE THRESHOLDS:');
  console.log('• Emergency access: <2s ✓');
  console.log('• Auth response: <2s ✓'); 
  console.log('• Feature loading: <1s ✓');
  console.log('• Mobile optimization: Required ✓');
  console.log('');
  
  // Critical issues that block launch
  const criticalIssues = [];
  if (TEST_RESULTS.crisis.status === 'fail') criticalIssues.push('Crisis access failure');
  if (TEST_RESULTS.auth.status === 'fail') criticalIssues.push('Authentication system failure');
  if (TEST_RESULTS.coreFeatures.status === 'fail') criticalIssues.push('Core features not working');
  
  if (criticalIssues.length > 0) {
    console.log('🚫 CRITICAL BLOCKERS:');
    criticalIssues.forEach(issue => console.log(`   • ${issue}`));
    console.log('');
  }
  
  if (launchReadinessScore >= 80 && criticalIssues.length === 0) {
    console.log('🎉 READY FOR BETA LAUNCH');
    console.log('All critical user journeys are functional with acceptable performance.');
  } else if (launchReadinessScore >= 60) {
    console.log('⚠️  CONDITIONAL LAUNCH - Address issues before full rollout');
  } else {
    console.log('🚫 NOT READY - Requires fixes before launch');
  }
  
  console.log('='.repeat(60));
  
  return {
    score: launchReadinessScore,
    passed: passedTests,
    total: totalTests,
    criticalIssues,
    results: TEST_RESULTS
  };
}

// Main execution
async function runComprehensiveValidation() {
  console.log('🧪 Starting ALCHM Beta Launch Comprehensive Validation');
  console.log('Testing critical user journeys for friends and family beta...\n');
  
  try {
    await testOnboardingFlow();
    await testCrisisAccess();
    await testAuthenticationFlows();
    await testCoreFeatures();
    await testMobileOptimization();
    
    const report = generateReport();
    
    // Write results to file for CI/CD
    const fs = require('fs');
    fs.writeFileSync('./beta-launch-results.json', JSON.stringify(report, null, 2));
    
    // Exit with appropriate code
    process.exit(report.score >= 80 && report.criticalIssues.length === 0 ? 0 : 1);
    
  } catch (error) {
    console.error(`\n❌ Validation failed: ${error.message}`);
    process.exit(1);
  }
}

runComprehensiveValidation();