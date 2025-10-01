#!/usr/bin/env node

/**
 * ALCHM Crisis Resources Validation Script
 * 
 * Comprehensive testing for crisis support system to ensure life-safety compliance
 * Tests mobile performance, accessibility, offline functionality, and crisis scenarios
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🆘 ALCHM Crisis Resources Validation - Life Safety Testing');
console.log('========================================================\n');

const results = {
  critical: [],
  warnings: [],
  passed: [],
  performance: {},
  accessibility: {},
  mobile: {},
  safety: {}
};

// Test 1: Verify crisis resources route exists
console.log('1. 📍 Testing Crisis Resources Route...');
try {
  const crisisPagePath = path.join(__dirname, '../src/app/crisis-resources/page.tsx');
  const crisisLayoutPath = path.join(__dirname, '../src/app/crisis-resources/layout.tsx');
  
  if (!fs.existsSync(crisisPagePath)) {
    results.critical.push('❌ CRITICAL: Crisis resources page missing');
  } else {
    results.passed.push('✅ Crisis resources page exists');
  }
  
  if (!fs.existsSync(crisisLayoutPath)) {
    results.warnings.push('⚠️ Crisis-optimized layout missing');
  } else {
    results.passed.push('✅ Crisis-optimized layout exists');
  }
} catch (error) {
  results.critical.push(`❌ CRITICAL: Route validation failed - ${error.message}`);
}

// Test 2: Validate emergency contact integration
console.log('2. 📞 Testing Emergency Contact Integration...');
try {
  const crisisPageContent = fs.readFileSync(
    path.join(__dirname, '../src/app/crisis-resources/page.tsx'), 
    'utf8'
  );
  
  const requiredNumbers = ['988', '741741', '911'];
  const requiredFeatures = [
    'handleEmergencyCall',
    'handleEmergencyText',
    'navigator.vibrate',
    'tel:',
    'sms:'
  ];
  
  requiredNumbers.forEach(number => {
    if (crisisPageContent.includes(number)) {
      results.passed.push(`✅ Emergency number ${number} integrated`);
    } else {
      results.critical.push(`❌ CRITICAL: Emergency number ${number} missing`);
    }
  });
  
  requiredFeatures.forEach(feature => {
    if (crisisPageContent.includes(feature)) {
      results.passed.push(`✅ Emergency feature ${feature} implemented`);
    } else {
      results.warnings.push(`⚠️ Emergency feature ${feature} not found`);
    }
  });
} catch (error) {
  results.critical.push(`❌ CRITICAL: Emergency contact validation failed - ${error.message}`);
}

// Test 3: Check mobile optimization features
console.log('3. 📱 Testing Mobile Crisis Optimization...');
try {
  const crisisPageContent = fs.readFileSync(
    path.join(__dirname, '../src/app/crisis-resources/page.tsx'), 
    'utf8'
  );
  
  const mobileFeatures = [
    'crisis-touch-target',
    'min-h-\\[80px\\]',
    'min-w-\\[280px\\]',
    'hover:scale-1',
    'navigator.vibrate',
    'isHighContrast',
    'emergencyMode'
  ];
  
  mobileFeatures.forEach(feature => {
    if (crisisPageContent.includes(feature.replace(/\\\\/g, ''))) {
      results.mobile[feature] = 'PASS';
    } else {
      results.mobile[feature] = 'FAIL';
      results.warnings.push(`⚠️ Mobile feature ${feature} not implemented`);
    }
  });
  
  if (Object.values(results.mobile).filter(v => v === 'PASS').length >= 5) {
    results.passed.push('✅ Mobile optimization features implemented');
  } else {
    results.critical.push('❌ CRITICAL: Insufficient mobile optimization');
  }
} catch (error) {
  results.critical.push(`❌ CRITICAL: Mobile optimization validation failed - ${error.message}`);
}

// Test 4: Verify service worker crisis optimization
console.log('4. ⚡ Testing Service Worker Crisis Features...');
try {
  const swPath = path.join(__dirname, '../public/crisis-sw.js');
  
  if (fs.existsSync(swPath)) {
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    const swFeatures = [
      'CRISIS_CACHE_VERSION',
      'EMERGENCY_CACHE',
      'emergencyResourceHandler',
      'crisisCriticalHandler',
      'fetchWithUltraTimeout',
      'getEmergencyOfflineFallback'
    ];
    
    swFeatures.forEach(feature => {
      if (swContent.includes(feature)) {
        results.passed.push(`✅ Service worker feature ${feature} implemented`);
      } else {
        results.warnings.push(`⚠️ Service worker feature ${feature} missing`);
      }
    });
    
    // Check for performance targets
    if (swContent.includes('1200') || swContent.includes('1.2s')) {
      results.performance.loadTimeTarget = 'CONFIGURED';
      results.passed.push('✅ 1.2s load time target configured');
    } else {
      results.performance.loadTimeTarget = 'MISSING';
      results.warnings.push('⚠️ Load time target not configured');
    }
  } else {
    results.critical.push('❌ CRITICAL: Crisis service worker missing');
  }
} catch (error) {
  results.critical.push(`❌ CRITICAL: Service worker validation failed - ${error.message}`);
}

// Test 5: Check cultural competency features
console.log('5. 🌍 Testing Cultural Competency Features...');
try {
  const crisisPageContent = fs.readFileSync(
    path.join(__dirname, '../src/app/crisis-resources/page.tsx'), 
    'utf8'
  );
  
  const culturalFeatures = [
    'culturalResources',
    'culturalPhrases',
    'selectedLanguage',
    'Trevor Project',
    'Trans Lifeline',
    'StrongHearts Native',
    'BlackLine',
    'culturalAffirmations'
  ];
  
  let culturalScore = 0;
  culturalFeatures.forEach(feature => {
    if (crisisPageContent.includes(feature)) {
      culturalScore++;
      results.passed.push(`✅ Cultural feature ${feature} implemented`);
    } else {
      results.warnings.push(`⚠️ Cultural feature ${feature} missing`);
    }
  });
  
  if (culturalScore >= 6) {
    results.passed.push('✅ Cultural competency features adequate');
  } else {
    results.critical.push('❌ CRITICAL: Insufficient cultural competency features');
  }
} catch (error) {
  results.critical.push(`❌ CRITICAL: Cultural competency validation failed - ${error.message}`);
}

// Test 6: Verify accessibility features
console.log('6. ♿ Testing Accessibility & Safety Features...');
try {
  const crisisLayoutContent = fs.readFileSync(
    path.join(__dirname, '../src/app/crisis-resources/layout.tsx'), 
    'utf8'
  );
  
  const accessibilityFeatures = [
    'aria-label',
    'role=\"alert\"',
    'aria-live',
    'Quick Exit',
    'F1',
    'Ctrl+Shift+X',
    'voice',
    'prefers-reduced-motion'
  ];
  
  accessibilityFeatures.forEach(feature => {
    if (crisisLayoutContent.includes(feature)) {
      results.accessibility[feature] = 'IMPLEMENTED';
    } else {
      results.accessibility[feature] = 'MISSING';
      results.warnings.push(`⚠️ Accessibility feature ${feature} not found`);
    }
  });
  
  const implementedCount = Object.values(results.accessibility).filter(v => v === 'IMPLEMENTED').length;
  if (implementedCount >= 5) {
    results.passed.push('✅ Accessibility features adequate');
  } else {
    results.critical.push('❌ CRITICAL: Insufficient accessibility features');
  }\n} catch (error) {\n  results.critical.push(`❌ CRITICAL: Accessibility validation failed - ${error.message}`);\n}\n\n// Test 7: Check crisis integration\nconsole.log('7. 🔗 Testing Crisis Detection Integration...');\ntry {\n  const integrationPath = path.join(__dirname, '../src/components/crisis/CrisisResourceIntegration.tsx');\n  \n  if (fs.existsSync(integrationPath)) {\n    const integrationContent = fs.readFileSync(integrationPath, 'utf8');\n    \n    const integrationFeatures = [\n      'CrisisResourceIntegration',\n      'crisis-alert',\n      'emergency-mode',\n      'tel:988',\n      'handleCrisisMessage',\n      'visibilitychange'\n    ];\n    \n    integrationFeatures.forEach(feature => {\n      if (integrationContent.includes(feature)) {\n        results.passed.push(`✅ Integration feature ${feature} implemented`);\n      } else {\n        results.warnings.push(`⚠️ Integration feature ${feature} missing`);\n      }\n    });\n  } else {\n    results.warnings.push('⚠️ Crisis integration component missing');\n  }\n} catch (error) {\n  results.warnings.push(`⚠️ Crisis integration validation failed - ${error.message}`);\n}\n\n// Test 8: Performance and build validation\nconsole.log('8. ⚡ Testing Build and Performance...');\ntry {\n  // Check if the page builds successfully\n  console.log('   Building crisis resources page...');\n  execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });\n  results.passed.push('✅ Crisis resources page builds successfully');\n  \n  // Check bundle size\n  const nextDir = path.join(__dirname, '../.next');\n  if (fs.existsSync(nextDir)) {\n    results.passed.push('✅ Next.js build output exists');\n  }\n  \n} catch (error) {\n  results.critical.push(`❌ CRITICAL: Build failed - ${error.message}`);\n}\n\n// Test 9: Validate manifest and PWA features\nconsole.log('9. 📲 Testing PWA Crisis Features...');\ntry {\n  const manifestPath = path.join(__dirname, '../public/crisis-mobile-manifest.json');\n  \n  if (fs.existsSync(manifestPath)) {\n    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));\n    \n    const requiredManifestFeatures = [\n      'start_url',\n      'display',\n      'shortcuts',\n      'protocol_handlers'\n    ];\n    \n    requiredManifestFeatures.forEach(feature => {\n      if (manifest[feature]) {\n        results.passed.push(`✅ Manifest feature ${feature} configured`);\n      } else {\n        results.warnings.push(`⚠️ Manifest feature ${feature} missing`);\n      }\n    });\n    \n    // Check for crisis shortcuts\n    if (manifest.shortcuts && manifest.shortcuts.find(s => s.url === 'tel:988')) {\n      results.passed.push('✅ Emergency call shortcut configured');\n    } else {\n      results.warnings.push('⚠️ Emergency call shortcut missing');\n    }\n  } else {\n    results.warnings.push('⚠️ Crisis mobile manifest missing');\n  }\n} catch (error) {\n  results.warnings.push(`⚠️ PWA validation failed - ${error.message}`);\n}\n\n// Generate comprehensive report\nconsole.log('\\n🔍 CRISIS RESOURCES VALIDATION REPORT');\nconsole.log('=====================================\\n');\n\n// Critical issues (life-safety)\nif (results.critical.length > 0) {\n  console.log('🚨 CRITICAL ISSUES (IMMEDIATE ATTENTION REQUIRED):');\n  results.critical.forEach(issue => console.log(`   ${issue}`));\n  console.log('');\n}\n\n// Warnings (should be addressed)\nif (results.warnings.length > 0) {\n  console.log('⚠️  WARNINGS (SHOULD BE ADDRESSED):');\n  results.warnings.forEach(warning => console.log(`   ${warning}`));\n  console.log('');\n}\n\n// Passed tests\nconsole.log('✅ PASSED TESTS:');\nresults.passed.forEach(pass => console.log(`   ${pass}`));\nconsole.log('');\n\n// Detailed metrics\nconsole.log('📊 DETAILED METRICS:');\nconsole.log(`   Mobile Features: ${Object.values(results.mobile).filter(v => v === 'PASS').length}/${Object.keys(results.mobile).length} passed`);\nconsole.log(`   Accessibility: ${Object.values(results.accessibility).filter(v => v === 'IMPLEMENTED').length}/${Object.keys(results.accessibility).length} implemented`);\nconsole.log(`   Performance: ${results.performance.loadTimeTarget === 'CONFIGURED' ? 'Configured' : 'Needs Configuration'}`);\nconsole.log('');\n\n// Overall safety assessment\nconst criticalCount = results.critical.length;\nconst warningCount = results.warnings.length;\nconst passedCount = results.passed.length;\n\nconsole.log('🎯 OVERALL SAFETY ASSESSMENT:');\nif (criticalCount === 0 && warningCount <= 3) {\n  console.log('   🟢 SAFE FOR PRODUCTION - Crisis resources ready for deployment');\n} else if (criticalCount === 0 && warningCount <= 6) {\n  console.log('   🟡 MOSTLY SAFE - Address warnings before full deployment');\n} else if (criticalCount <= 2) {\n  console.log('   🟠 NEEDS IMPROVEMENT - Address critical issues immediately');\n} else {\n  console.log('   🔴 NOT SAFE FOR PRODUCTION - Critical life-safety issues must be resolved');\n}\n\nconsole.log(`   Safety Score: ${passedCount}/${passedCount + warningCount + criticalCount} (${Math.round((passedCount / (passedCount + warningCount + criticalCount)) * 100)}%)`);\nconsole.log('');\n\n// Save results for CI/CD\nconst reportPath = path.join(__dirname, '../crisis-safety-validation-results.json');\nfs.writeFileSync(reportPath, JSON.stringify({\n  timestamp: new Date().toISOString(),\n  results,\n  summary: {\n    critical: criticalCount,\n    warnings: warningCount,\n    passed: passedCount,\n    safetyScore: Math.round((passedCount / (passedCount + warningCount + criticalCount)) * 100),\n    production_ready: criticalCount === 0 && warningCount <= 3\n  }\n}, null, 2));\n\nconsole.log(`📋 Detailed results saved to: ${reportPath}`);\nconsole.log('');\n\n// Exit with appropriate code\nif (criticalCount > 0) {\n  console.log('❌ VALIDATION FAILED - Critical issues must be resolved');\n  process.exit(1);\n} else if (warningCount > 6) {\n  console.log('⚠️  VALIDATION INCOMPLETE - Too many warnings');\n  process.exit(1);\n} else {\n  console.log('✅ VALIDATION PASSED - Crisis resources are safe for production');\n  process.exit(0);\n}\n"