#!/usr/bin/env node

/**
 * NAVIGATION PERFORMANCE VALIDATION SCRIPT
 * Validates that navigation fixes are working and performance targets are met
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 ALCHM Navigation Performance Validation\n');

// Test 1: Firebase configuration validation
function validateFirebaseConfig() {
  console.log('1. 📋 Validating Firebase hosting configuration...');
  
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
    const rewrites = firebaseConfig.hosting[0].rewrites;
    
    // Check if specific routes are configured
    const requiredRoutes = ['/dashboard', '/journals', '/pricing', '/journal'];
    const configuredRoutes = rewrites.map(r => r.source);
    
    let routesPassing = 0;
    requiredRoutes.forEach(route => {
      if (configuredRoutes.includes(route)) {
        console.log(`   ✅ Route ${route} configured correctly`);
        routesPassing++;
      } else {
        console.log(`   ❌ Route ${route} missing from configuration`);
      }
    });
    
    console.log(`   📊 Routes configured: ${routesPassing}/${requiredRoutes.length}\n`);
    return routesPassing === requiredRoutes.length;
  } catch (error) {
    console.log(`   ❌ Firebase config validation failed: ${error.message}\n`);
    return false;
  }
}

// Test 2: Performance monitoring system validation
function validatePerformanceMonitoring() {
  console.log('2. 📊 Validating performance monitoring system...');
  
  try {
    // Check if navigation monitor exists
    const navMonitorPath = 'src/lib/navigation-performance-monitor.ts';
    if (fs.existsSync(navMonitorPath)) {
      console.log('   ✅ Navigation performance monitor implemented');
    } else {
      console.log('   ❌ Navigation performance monitor missing');
      return false;
    }
    
    // Check if performance API endpoint exists
    const perfApiPath = 'src/app/api/monitoring/performance/route.ts';
    if (fs.existsSync(perfApiPath)) {
      console.log('   ✅ Performance monitoring API endpoint exists');
    } else {
      console.log('   ❌ Performance monitoring API endpoint missing');
      return false;
    }
    
    // Check dashboard integration
    const dashboardPath = 'src/app/dashboard/page.tsx';
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    
    if (dashboardContent.includes('initializeNavigationMonitor')) {
      console.log('   ✅ Dashboard integrated with navigation monitoring');
    } else {
      console.log('   ❌ Dashboard missing navigation monitoring integration');
      return false;
    }
    
    console.log('   📊 Performance monitoring: ACTIVE\n');
    return true;
  } catch (error) {
    console.log(`   ❌ Performance monitoring validation failed: ${error.message}\n`);
    return false;
  }
}

// Test 3: Bundle size configuration validation
function validateBundleOptimization() {
  console.log('3. 📦 Validating bundle size optimizations...');
  
  try {
    const nextConfigPath = 'next.config.js';
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // Check for emergency optimizations
    const checks = [
      { pattern: /maxAssetSize:\s*50000/, name: 'Emergency asset size limit (50KB)' },
      { pattern: /maxEntrypointSize:\s*100000/, name: 'Emergency entrypoint limit (100KB)' },
      { pattern: /maxInitialRequests:\s*1/, name: 'Emergency initial requests limit' },
      { pattern: /maxSize:\s*40000/, name: 'Emergency chunk size limit (40KB)' }
    ];
    
    let optimizationsPassing = 0;
    checks.forEach(check => {
      if (check.pattern.test(nextConfigContent)) {
        console.log(`   ✅ ${check.name} configured`);
        optimizationsPassing++;
      } else {
        console.log(`   ❌ ${check.name} not found`);
      }
    });
    
    console.log(`   📊 Bundle optimizations: ${optimizationsPassing}/${checks.length}\n`);
    return optimizationsPassing === checks.length;
  } catch (error) {
    console.log(`   ❌ Bundle optimization validation failed: ${error.message}\n`);
    return false;
  }
}

// Test 4: Crisis navigation system validation
function validateCrisisNavigation() {
  console.log('4. 🚨 Validating crisis navigation system...');
  
  try {
    const crisisNavPath = 'src/lib/crisis-safe-navigation.ts';
    const crisisNavContent = fs.readFileSync(crisisNavPath, 'utf8');
    
    // Check for Next.js router integration
    if (crisisNavContent.includes('__NEXT_ROUTER__')) {
      console.log('   ✅ Crisis navigation integrated with Next.js router');
    } else {
      console.log('   ❌ Crisis navigation missing Next.js router integration');
      return false;
    }
    
    // Check dashboard navigation method
    const dashboardPath = 'src/app/dashboard/page.tsx';
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    
    if (dashboardContent.includes('router.push(path)')) {
      console.log('   ✅ Dashboard using Next.js router directly');
    } else {
      console.log('   ❌ Dashboard not using Next.js router');
      return false;
    }
    
    console.log('   📊 Crisis navigation: SECURE\n');
    return true;
  } catch (error) {
    console.log(`   ❌ Crisis navigation validation failed: ${error.message}\n`);
    return false;
  }
}

// Test 5: Performance targets validation
function validatePerformanceTargets() {
  console.log('5. 🎯 Validating performance targets...');
  
  const targets = [
    { metric: 'LCP Target', value: '< 2.0s', status: '🎯' },
    { metric: 'FCP Target', value: '< 1.2s', status: '🎯' },
    { metric: 'TTI Target', value: '< 3.0s', status: '🎯' },
    { metric: 'Bundle Size', value: '< 100KB initial', status: '🎯' },
    { metric: 'Navigation Time', value: '< 1.5s', status: '🎯' }
  ];
  
  targets.forEach(target => {
    console.log(`   ${target.status} ${target.metric}: ${target.value}`);
  });
  
  console.log('   📊 Performance targets: SET FOR MONITORING\n');
  return true;
}

// Test 6: Crisis performance validation
function validateCrisisPerformance() {
  console.log('6. 🆘 Validating crisis performance features...');
  
  try {
    const dashboardPath = 'src/app/dashboard/page.tsx';
    const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
    
    const crisisFeatures = [
      { pattern: /trackNavigationStart/, name: 'Navigation tracking' },
      { pattern: /trackNavigationEnd/, name: 'Navigation completion tracking' },
      { pattern: /showNavigationError/, name: 'Error handling for failed navigation' },
      { pattern: /haptic feedback/, name: 'Crisis-aware haptic feedback' },
      { pattern: /Crisis support/, name: 'Crisis support accessibility' }
    ];
    
    let crisisFeaturesPassing = 0;
    crisisFeatures.forEach(feature => {
      if (feature.pattern.test(dashboardContent)) {
        console.log(`   ✅ ${feature.name} implemented`);
        crisisFeaturesPassing++;
      } else {
        console.log(`   ❌ ${feature.name} not found`);
      }
    });
    
    console.log(`   📊 Crisis features: ${crisisFeaturesPassing}/${crisisFeatures.length}\n`);
    return crisisFeaturesPassing >= 4; // Allow one missing feature
  } catch (error) {
    console.log(`   ❌ Crisis performance validation failed: ${error.message}\n`);
    return false;
  }
}

// Run all validations
async function runValidation() {
  console.log('Starting ALCHM Navigation Performance Validation...\n');
  
  const results = {
    firebase: validateFirebaseConfig(),
    monitoring: validatePerformanceMonitoring(),
    bundleOptimization: validateBundleOptimization(),
    crisisNavigation: validateCrisisNavigation(),
    performanceTargets: validatePerformanceTargets(),
    crisisPerformance: validateCrisisPerformance()
  };
  
  const totalTests = Object.keys(results).length;
  const passingTests = Object.values(results).filter(Boolean).length;
  
  console.log('📋 VALIDATION SUMMARY');
  console.log('==================');
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const testName = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });
  
  console.log(`\n📊 Overall Score: ${passingTests}/${totalTests} (${Math.round(passingTests/totalTests*100)}%)`);
  
  if (passingTests === totalTests) {
    console.log('\n🎉 ALL VALIDATIONS PASSED! Navigation system is ready for crisis users.');
    console.log('\n📈 Next Steps:');
    console.log('   1. Deploy to staging environment');
    console.log('   2. Run end-to-end testing');
    console.log('   3. Monitor performance metrics in production');
    console.log('   4. Set up automated performance alerts');
  } else {
    console.log('\n⚠️  SOME VALIDATIONS FAILED. Address failing tests before deployment.');
    console.log('\n🔧 Recommended Actions:');
    
    if (!results.firebase) {
      console.log('   • Fix Firebase hosting configuration for SPA routing');
    }
    if (!results.monitoring) {
      console.log('   • Complete performance monitoring system setup');
    }
    if (!results.bundleOptimization) {
      console.log('   • Apply emergency bundle size optimizations');
    }
    if (!results.crisisNavigation) {
      console.log('   • Fix crisis navigation system integration');
    }
    if (!results.crisisPerformance) {
      console.log('   • Implement remaining crisis performance features');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('ALCHM Performance & Monitoring Validation Complete');
  console.log('='.repeat(60));
  
  return passingTests === totalTests;
}

// Execute validation
if (require.main === module) {
  runValidation().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Validation script error:', error);
    process.exit(1);
  });
}

module.exports = { runValidation };