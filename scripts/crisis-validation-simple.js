#!/usr/bin/env node

/**
 * ALCHM Crisis Resources Validation Script
 * Simple validation for crisis support system
 */

const fs = require('fs');
const path = require('path');

console.log('🆘 ALCHM Crisis Resources Validation');
console.log('====================================\n');

const results = {
  critical: [],
  warnings: [],
  passed: []
};

// Test 1: Verify crisis resources route exists
console.log('1. 📍 Testing Crisis Resources Route...');
try {
  const crisisPagePath = path.join(__dirname, '../src/app/crisis-resources/page.tsx');
  const crisisLayoutPath = path.join(__dirname, '../src/app/crisis-resources/layout.tsx');
  
  if (fs.existsSync(crisisPagePath)) {
    results.passed.push('✅ Crisis resources page exists');
  } else {
    results.critical.push('❌ CRITICAL: Crisis resources page missing');
  }
  
  if (fs.existsSync(crisisLayoutPath)) {
    results.passed.push('✅ Crisis-optimized layout exists');
  } else {
    results.warnings.push('⚠️ Crisis-optimized layout missing');
  }
} catch (error) {
  results.critical.push(`❌ CRITICAL: Route validation failed - ${error.message}`);
}

// Test 2: Validate emergency contact integration
console.log('2. 📞 Testing Emergency Contact Integration...');
try {
  const crisisPagePath = path.join(__dirname, '../src/app/crisis-resources/page.tsx');
  const crisisPageContent = fs.readFileSync(crisisPagePath, 'utf8');
  
  const requiredNumbers = ['988', '741741', '911'];
  const requiredFeatures = ['handleEmergencyCall', 'handleEmergencyText', 'tel:', 'sms:'];
  
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

// Test 3: Check service worker crisis features
console.log('3. ⚡ Testing Service Worker Crisis Features...');
try {
  const swPath = path.join(__dirname, '../public/crisis-sw.js');
  
  if (fs.existsSync(swPath)) {
    const swContent = fs.readFileSync(swPath, 'utf8');
    
    const swFeatures = ['CRISIS_CACHE', 'emergencyResourceHandler', 'getEmergencyOfflineFallback'];
    
    swFeatures.forEach(feature => {
      if (swContent.includes(feature)) {
        results.passed.push(`✅ Service worker feature ${feature} implemented`);
      } else {
        results.warnings.push(`⚠️ Service worker feature ${feature} missing`);
      }
    });
  } else {
    results.warnings.push('⚠️ Crisis service worker missing');
  }
} catch (error) {
  results.warnings.push(`⚠️ Service worker validation failed - ${error.message}`);
}

// Test 4: Check crisis integration
console.log('4. 🔗 Testing Crisis Detection Integration...');
try {
  const integrationPath = path.join(__dirname, '../src/components/crisis/CrisisResourceIntegration.tsx');
  
  if (fs.existsSync(integrationPath)) {
    const integrationContent = fs.readFileSync(integrationPath, 'utf8');
    
    const integrationFeatures = ['CrisisResourceIntegration', 'emergency-mode', 'tel:988'];
    
    integrationFeatures.forEach(feature => {
      if (integrationContent.includes(feature)) {
        results.passed.push(`✅ Integration feature ${feature} implemented`);
      } else {
        results.warnings.push(`⚠️ Integration feature ${feature} missing`);
      }
    });
  } else {
    results.warnings.push('⚠️ Crisis integration component missing');
  }
} catch (error) {
  results.warnings.push(`⚠️ Crisis integration validation failed - ${error.message}`);
}

// Generate report
console.log('\n🔍 CRISIS RESOURCES VALIDATION REPORT');
console.log('=====================================\n');

// Critical issues
if (results.critical.length > 0) {
  console.log('🚨 CRITICAL ISSUES:');
  results.critical.forEach(issue => console.log(`   ${issue}`));
  console.log('');
}

// Warnings
if (results.warnings.length > 0) {
  console.log('⚠️  WARNINGS:');
  results.warnings.forEach(warning => console.log(`   ${warning}`));
  console.log('');
}

// Passed tests
console.log('✅ PASSED TESTS:');
results.passed.forEach(pass => console.log(`   ${pass}`));
console.log('');

// Overall assessment
const criticalCount = results.critical.length;
const warningCount = results.warnings.length;
const passedCount = results.passed.length;

console.log('🎯 OVERALL ASSESSMENT:');
if (criticalCount === 0 && warningCount <= 3) {
  console.log('   🟢 SAFE FOR PRODUCTION - Crisis resources ready');
} else if (criticalCount === 0) {
  console.log('   🟡 MOSTLY SAFE - Address warnings');
} else {
  console.log('   🔴 NOT SAFE - Critical issues must be resolved');
}

console.log(`   Safety Score: ${passedCount}/${passedCount + warningCount + criticalCount} (${Math.round((passedCount / (passedCount + warningCount + criticalCount)) * 100)}%)`);

// Exit with appropriate code
if (criticalCount > 0) {
  console.log('\n❌ VALIDATION FAILED');
  process.exit(1);
} else {
  console.log('\n✅ VALIDATION PASSED');
  process.exit(0);
}