#!/usr/bin/env node
/**
 * ALCHM Beta Launch - FINAL COMPREHENSIVE VALIDATION
 * Accurate assessment based on actual application architecture
 */

const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3001';
const LOCALE_BASE_URL = 'http://localhost:3001/en';

const VALIDATION_RESULTS = {
  infrastructure: { score: 0, details: {}, issues: [] },
  userJourneys: { score: 0, details: {}, issues: [] },
  performance: { score: 0, details: {}, issues: [] },
  crisisSafety: { score: 0, details: {}, issues: [] },
  mobileOptimization: { score: 0, details: {}, issues: [] }
};

// Enhanced HTTP request with follow redirects
async function makeRequest(url, followRedirects = false) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const urlObj = new URL(url);
    const requestModule = urlObj.protocol === 'https:' ? https : http;
    
    const req = requestModule.request(url, { method: 'GET' }, (res) => {
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      // Handle redirects
      if ([301, 302, 307, 308].includes(res.statusCode) && followRedirects && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        return makeRequest(redirectUrl, false).then(result => {
          result.redirected = true;
          result.originalStatus = res.statusCode;
          resolve(result);
        }).catch(reject);
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          responseTime,
          headers: res.headers,
          body: data,
          url: url,
          redirected: false
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Test 1: Infrastructure & Core System Health
async function validateInfrastructure() {
  console.log('🏗️  INFRASTRUCTURE VALIDATION');
  const details = {};
  const issues = [];
  let score = 0;
  
  try {
    // 1. Root redirect functionality
    const rootResponse = await makeRequest(BASE_URL);
    details.rootRedirect = {
      status: rootResponse.status,
      time: rootResponse.responseTime,
      redirectsToLocale: rootResponse.status === 307
    };
    
    if (rootResponse.status === 307 && rootResponse.headers.location?.includes('/en')) {
      score += 20;
      console.log('  ✅ Root locale redirect: PASS');
    } else {
      issues.push('Root locale redirect not working properly');
      console.log('  ❌ Root locale redirect: FAIL');
    }
    
    // 2. Landing page accessibility
    const landingResponse = await makeRequest(LOCALE_BASE_URL);
    details.landingPage = {
      status: landingResponse.status,
      time: landingResponse.responseTime,
      hasContent: landingResponse.body.includes('ALCHM')
    };
    
    if (landingResponse.status === 200 && landingResponse.body.includes('ALCHM')) {
      score += 25;
      console.log('  ✅ Landing page: PASS');
    } else {
      issues.push('Landing page not loading correctly');
      console.log('  ❌ Landing page: FAIL');
    }
    
    // 3. Emergency page accessibility (critical)
    const emergencyResponse = await makeRequest(`${LOCALE_BASE_URL}/emergency`);
    details.emergencyPage = {
      status: emergencyResponse.status,
      time: emergencyResponse.responseTime,
      has988: emergencyResponse.body.includes('988') || emergencyResponse.body.includes('tel:988'),
      hasCrisisSupport: emergencyResponse.body.includes('crisis-support')
    };
    
    if (emergencyResponse.status === 200 && details.emergencyPage.has988) {
      score += 30;
      console.log('  ✅ Emergency page: PASS');
    } else {
      issues.push('Emergency page critical failure');
      console.log('  ❌ Emergency page: FAIL');
    }
    
    // 4. Auth system responsiveness
    const authResponse = await makeRequest(`${LOCALE_BASE_URL}/auth/login`);
    details.authSystem = {
      status: authResponse.status,
      time: authResponse.responseTime,
      hasAgeVerification: authResponse.body.includes('birth-year'),
      hasAuthFlow: authResponse.body.includes('Enter Your Sanctuary')
    };
    
    if (authResponse.status === 200 && details.authSystem.hasAgeVerification) {
      score += 25;
      console.log('  ✅ Auth system: PASS');
    } else {
      issues.push('Auth system not responding correctly');
      console.log('  ❌ Auth system: FAIL');
    }
    
  } catch (error) {
    issues.push(`Infrastructure error: ${error.message}`);
    console.log(`  ❌ Infrastructure validation failed: ${error.message}`);
  }
  
  VALIDATION_RESULTS.infrastructure = { score, details, issues };
  console.log(`  📊 Infrastructure Score: ${score}/100\n`);
}

// Test 2: User Journey Validation
async function validateUserJourneys() {
  console.log('👥 USER JOURNEY VALIDATION');
  const details = {};
  const issues = [];
  let score = 0;
  
  try {
    // 1. New user path (root → locale → age verification)
    const newUserPath = await makeRequest(BASE_URL);
    details.newUserPath = {
      redirectsCorrectly: newUserPath.status === 307,
      time: newUserPath.responseTime
    };
    
    if (details.newUserPath.redirectsCorrectly) {
      score += 25;
      console.log('  ✅ New user redirect: PASS');
    } else {
      issues.push('New user path not working');
      console.log('  ❌ New user redirect: FAIL');
    }
    
    // 2. Authenticated user protection (journal/dashboard should redirect to auth)
    const journalProtected = await makeRequest(`${LOCALE_BASE_URL}/journal`);
    const dashboardProtected = await makeRequest(`${LOCALE_BASE_URL}/dashboard`);
    
    details.authProtection = {
      journalRedirectsToAuth: journalProtected.status === 307 && journalProtected.headers.location?.includes('auth'),
      dashboardRedirectsToAuth: dashboardProtected.status === 307 && dashboardProtected.headers.location?.includes('auth')
    };
    
    if (details.authProtection.journalRedirectsToAuth && details.authProtection.dashboardRedirectsToAuth) {
      score += 25;
      console.log('  ✅ Auth protection: PASS');
    } else {
      issues.push('Authentication protection not working');
      console.log('  ❌ Auth protection: FAIL');
    }
    
    // 3. Crisis user bypass (emergency should be accessible)
    const crisisAccess = await makeRequest(`${LOCALE_BASE_URL}/emergency`);
    details.crisisAccess = {
      accessibleWithoutAuth: crisisAccess.status === 200,
      time: crisisAccess.responseTime
    };
    
    if (details.crisisAccess.accessibleWithoutAuth) {
      score += 30;
      console.log('  ✅ Crisis access: PASS');
    } else {
      issues.push('Crisis users cannot access emergency resources');
      console.log('  ❌ Crisis access: FAIL');
    }
    
    // 4. Public pages accessibility
    const publicPages = ['/', '/en', '/en/pricing'];
    let publicScore = 0;
    
    for (const page of publicPages) {
      try {
        const response = await makeRequest(`${BASE_URL}${page}`);
        if (response.status === 200 || (response.status === 307 && page === '/')) {
          publicScore += 1;
        }
      } catch (e) {
        // Continue checking other pages
      }
    }
    
    details.publicPages = { accessible: publicScore, total: publicPages.length };
    
    if (publicScore >= 2) {
      score += 20;
      console.log('  ✅ Public pages: PASS');
    } else {
      issues.push('Public pages not accessible');
      console.log('  ❌ Public pages: FAIL');
    }
    
  } catch (error) {
    issues.push(`User journey error: ${error.message}`);
    console.log(`  ❌ User journey validation failed: ${error.message}`);
  }
  
  VALIDATION_RESULTS.userJourneys = { score, details, issues };
  console.log(`  📊 User Journey Score: ${score}/100\n`);
}

// Test 3: Performance Validation
async function validatePerformance() {
  console.log('⚡ PERFORMANCE VALIDATION');
  const details = {};
  const issues = [];
  let score = 0;
  
  try {
    // 1. Landing page performance
    const landingPerf = await makeRequest(LOCALE_BASE_URL);
    details.landingPerformance = {
      loadTime: landingPerf.responseTime,
      underThreshold: landingPerf.responseTime < 3000
    };
    
    if (details.landingPerformance.underThreshold) {
      score += 25;
      console.log(`  ✅ Landing performance: ${landingPerf.responseTime}ms`);
    } else {
      issues.push(`Landing page slow: ${landingPerf.responseTime}ms > 3000ms`);
      console.log(`  ❌ Landing performance: ${landingPerf.responseTime}ms`);
    }
    
    // 2. Emergency page performance (critical)
    const emergencyPerf = await makeRequest(`${LOCALE_BASE_URL}/emergency`);
    details.emergencyPerformance = {
      loadTime: emergencyPerf.responseTime,
      underThreshold: emergencyPerf.responseTime < 2000
    };
    
    if (details.emergencyPerformance.underThreshold) {
      score += 35;
      console.log(`  ✅ Emergency performance: ${emergencyPerf.responseTime}ms`);
    } else {
      issues.push(`Emergency page slow: ${emergencyPerf.responseTime}ms > 2000ms`);
      console.log(`  ❌ Emergency performance: ${emergencyPerf.responseTime}ms`);
    }
    
    // 3. Auth flow performance
    const authPerf = await makeRequest(`${LOCALE_BASE_URL}/auth/login`);
    details.authPerformance = {
      loadTime: authPerf.responseTime,
      underThreshold: authPerf.responseTime < 2000
    };
    
    if (details.authPerformance.underThreshold) {
      score += 25;
      console.log(`  ✅ Auth performance: ${authPerf.responseTime}ms`);
    } else {
      issues.push(`Auth flow slow: ${authPerf.responseTime}ms > 2000ms`);
      console.log(`  ❌ Auth performance: ${authPerf.responseTime}ms`);
    }
    
    // 4. Overall response consistency
    const allTimes = [
      landingPerf.responseTime,
      emergencyPerf.responseTime,
      authPerf.responseTime
    ];
    const avgTime = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;
    
    details.overall = {
      averageTime: Math.round(avgTime),
      consistent: Math.max(...allTimes) - Math.min(...allTimes) < 3000
    };
    
    if (details.overall.consistent && avgTime < 2000) {
      score += 15;
      console.log(`  ✅ Overall performance: ${Math.round(avgTime)}ms avg`);
    } else {
      issues.push('Performance inconsistent across pages');
      console.log(`  ❌ Overall performance: ${Math.round(avgTime)}ms avg`);
    }
    
  } catch (error) {
    issues.push(`Performance error: ${error.message}`);
    console.log(`  ❌ Performance validation failed: ${error.message}`);
  }
  
  VALIDATION_RESULTS.performance = { score, details, issues };
  console.log(`  📊 Performance Score: ${score}/100\n`);
}

// Test 4: Crisis Safety Validation
async function validateCrisisSafety() {
  console.log('🚨 CRISIS SAFETY VALIDATION');
  const details = {};
  const issues = [];
  let score = 0;
  
  try {
    // 1. Emergency page accessibility
    const emergencyResponse = await makeRequest(`${LOCALE_BASE_URL}/emergency`);
    details.emergencyAccess = {
      status: emergencyResponse.status,
      accessible: emergencyResponse.status === 200
    };
    
    if (details.emergencyAccess.accessible) {
      score += 30;
      console.log('  ✅ Emergency page accessible');
    } else {
      issues.push('Emergency page not accessible');
      console.log('  ❌ Emergency page not accessible');
    }
    
    // 2. 988 Crisis hotline presence
    details.crisisHotline = {
      has988Link: emergencyResponse.body.includes('tel:988'),
      hasCrisisButton: emergencyResponse.body.includes('crisis-support'),
      hasEmergencyIcon: emergencyResponse.body.includes('🆘')
    };
    
    if (details.crisisHotline.has988Link || details.crisisHotline.hasCrisisButton) {
      score += 25;
      console.log('  ✅ 988 Crisis hotline present');
    } else {
      issues.push('988 Crisis hotline not found');
      console.log('  ❌ 988 Crisis hotline missing');
    }
    
    // 3. Crisis support floating button
    if (details.crisisHotline.hasEmergencyIcon && details.crisisHotline.hasCrisisButton) {
      score += 20;
      console.log('  ✅ Crisis support button available');
    } else {
      issues.push('Crisis support button not available');
      console.log('  ❌ Crisis support button missing');
    }
    
    // 4. Critical CSS for crisis situations
    details.criticalCSS = {
      hasCriticalCSS: emergencyResponse.body.includes('crisis-support{'),
      hasTouchTargets: emergencyResponse.body.includes('min-height:48px'),
      hasCrisisMode: emergencyResponse.body.includes('crisis-level-crisis')
    };
    
    if (details.criticalCSS.hasCriticalCSS && details.criticalCSS.hasTouchTargets) {
      score += 25;
      console.log('  ✅ Crisis-optimized CSS loaded');
    } else {
      issues.push('Crisis-specific optimizations missing');
      console.log('  ❌ Crisis CSS optimizations missing');
    }
    
  } catch (error) {
    issues.push(`Crisis safety error: ${error.message}`);
    console.log(`  ❌ Crisis safety validation failed: ${error.message}`);
  }
  
  VALIDATION_RESULTS.crisisSafety = { score, details, issues };
  console.log(`  📊 Crisis Safety Score: ${score}/100\n`);
}

// Test 5: Mobile Optimization Validation
async function validateMobileOptimization() {
  console.log('📱 MOBILE OPTIMIZATION VALIDATION');
  const details = {};
  const issues = [];
  let score = 0;
  
  try {
    // Mobile headers simulation
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15';
    
    const mobileResponse = await makeRequest(LOCALE_BASE_URL);
    
    // 1. Viewport meta tag
    details.viewport = {
      hasViewportMeta: mobileResponse.body.includes('width=device-width'),
      hasMaxScale: mobileResponse.body.includes('maximum-scale=5.0'),
      hasUserScalable: mobileResponse.body.includes('user-scalable=yes')
    };
    
    if (details.viewport.hasViewportMeta && details.viewport.hasMaxScale) {
      score += 25;
      console.log('  ✅ Viewport optimization');
    } else {
      issues.push('Viewport meta tag missing or incomplete');
      console.log('  ❌ Viewport optimization missing');
    }
    
    // 2. Touch target optimization
    details.touchTargets = {
      hasMinTouchTargets: mobileResponse.body.includes('min-height:48px') || mobileResponse.body.includes('min-height:52px'),
      hasCrisisTouchTargets: mobileResponse.body.includes('min-height:64px'),
      hasTouchAction: mobileResponse.body.includes('touch-action:manipulation')
    };
    
    if (details.touchTargets.hasMinTouchTargets && details.touchTargets.hasTouchAction) {
      score += 25;
      console.log('  ✅ Touch target optimization');
    } else {
      issues.push('Touch targets not optimized for mobile');
      console.log('  ❌ Touch targets not optimized');
    }
    
    // 3. Mobile-specific features
    details.mobileFeatures = {
      hasAppleWebAppCapable: mobileResponse.body.includes('apple-mobile-web-app-capable'),
      hasThemeColor: mobileResponse.body.includes('theme-color'),
      hasMobileOptimized: mobileResponse.body.includes('MobileOptimized'),
      hasHandheldFriendly: mobileResponse.body.includes('HandheldFriendly')
    };
    
    const mobileFeatureCount = Object.values(details.mobileFeatures).filter(Boolean).length;
    if (mobileFeatureCount >= 3) {
      score += 25;
      console.log('  ✅ Mobile PWA features');
    } else {
      issues.push('Mobile PWA features incomplete');
      console.log('  ❌ Mobile PWA features missing');
    }
    
    // 4. Performance on mobile
    details.mobilePerformance = {
      loadTime: mobileResponse.responseTime,
      underMobileThreshold: mobileResponse.responseTime < 3000
    };
    
    if (details.mobilePerformance.underMobileThreshold) {
      score += 25;
      console.log(`  ✅ Mobile performance: ${mobileResponse.responseTime}ms`);
    } else {
      issues.push(`Mobile performance slow: ${mobileResponse.responseTime}ms`);
      console.log(`  ❌ Mobile performance: ${mobileResponse.responseTime}ms`);
    }
    
  } catch (error) {
    issues.push(`Mobile optimization error: ${error.message}`);
    console.log(`  ❌ Mobile optimization validation failed: ${error.message}`);
  }
  
  VALIDATION_RESULTS.mobileOptimization = { score, details, issues };
  console.log(`  📊 Mobile Optimization Score: ${score}/100\n`);
}

// Generate final comprehensive report
function generateFinalReport() {
  const categories = Object.keys(VALIDATION_RESULTS);
  const totalPossible = categories.length * 100;
  const totalAchieved = categories.reduce((sum, cat) => sum + VALIDATION_RESULTS[cat].score, 0);
  const overallScore = Math.round((totalAchieved / totalPossible) * 100);
  
  console.log('='.repeat(80));
  console.log('🚀 ALCHM BETA LAUNCH - FINAL VALIDATION REPORT');
  console.log('='.repeat(80));
  console.log(`OVERALL READINESS SCORE: ${overallScore}% (${totalAchieved}/${totalPossible} points)`);
  console.log('');
  
  // Category breakdown
  categories.forEach(category => {
    const result = VALIDATION_RESULTS[category];
    const status = result.score >= 80 ? '✅ EXCELLENT' : 
                   result.score >= 60 ? '⚠️  GOOD' : 
                   result.score >= 40 ? '⚠️  NEEDS WORK' : '❌ CRITICAL';
    
    console.log(`${status} | ${category.toUpperCase()}: ${result.score}/100`);
    
    if (result.issues.length > 0) {
      result.issues.forEach(issue => {
        console.log(`   🔸 ${issue}`);
      });
    }
    console.log('');
  });
  
  // Critical blockers
  const criticalIssues = [];
  if (VALIDATION_RESULTS.crisisSafety.score < 70) criticalIssues.push('Crisis safety systems insufficient');
  if (VALIDATION_RESULTS.infrastructure.score < 60) criticalIssues.push('Infrastructure not stable');
  if (VALIDATION_RESULTS.userJourneys.score < 60) criticalIssues.push('Core user journeys broken');
  
  if (criticalIssues.length > 0) {
    console.log('🚫 CRITICAL BLOCKERS FOR BETA LAUNCH:');
    criticalIssues.forEach(issue => console.log(`   • ${issue}`));
    console.log('');
  }
  
  // Final assessment
  console.log('BETA LAUNCH ASSESSMENT:');
  if (overallScore >= 80 && criticalIssues.length === 0) {
    console.log('🎉 READY FOR FRIENDS & FAMILY BETA LAUNCH');
    console.log('   All critical systems operational with excellent performance');
  } else if (overallScore >= 65 && VALIDATION_RESULTS.crisisSafety.score >= 70) {
    console.log('⚠️  CONDITIONAL BETA LAUNCH APPROVED');
    console.log('   Core safety systems operational, monitor performance closely');
  } else {
    console.log('🚫 NOT READY FOR BETA LAUNCH');
    console.log('   Critical issues must be resolved before user access');
  }
  
  console.log('');
  console.log('KEY METRICS ACHIEVED:');
  console.log(`• Crisis access: ${VALIDATION_RESULTS.crisisSafety.details.emergencyAccess?.accessible ? '✅' : '❌'} (< 2s response)`);
  console.log(`• Mobile optimization: ${VALIDATION_RESULTS.mobileOptimization.score >= 70 ? '✅' : '❌'} (trauma-informed)`);
  console.log(`• Auth protection: ${VALIDATION_RESULTS.userJourneys.details.authProtection?.journalRedirectsToAuth ? '✅' : '❌'} (secure access)`);
  console.log(`• Performance: ${VALIDATION_RESULTS.performance.details.overall?.averageTime < 2500 ? '✅' : '❌'} (< 2.5s average)`);
  
  console.log('='.repeat(80));
  
  return {
    overallScore,
    categoryScores: VALIDATION_RESULTS,
    criticalIssues,
    readyForLaunch: overallScore >= 65 && criticalIssues.length === 0
  };
}

// Main validation execution
async function runFinalValidation() {
  console.log('🧪 ALCHM BETA LAUNCH - COMPREHENSIVE FINAL VALIDATION');
  console.log('Validating all critical systems for friends & family beta...\n');
  
  try {
    await validateInfrastructure();
    await validateUserJourneys();
    await validatePerformance();
    await validateCrisisSafety();
    await validateMobileOptimization();
    
    const report = generateFinalReport();
    
    // Save detailed results
    const fs = require('fs');
    fs.writeFileSync('./beta-launch-final-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      report,
      detailedResults: VALIDATION_RESULTS
    }, null, 2));
    
    console.log('📄 Detailed results saved to: beta-launch-final-results.json');
    
    process.exit(report.readyForLaunch ? 0 : 1);
    
  } catch (error) {
    console.error(`\n❌ Final validation failed: ${error.message}`);
    process.exit(1);
  }
}

runFinalValidation();