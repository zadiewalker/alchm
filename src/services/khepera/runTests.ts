#!/usr/bin/env tsx
/**
 * Khepera Enhanced System Test Runner
 * 
 * This script validates the deterministic Khepera gold-output set
 * against structure, clinical invariants, and tone consistency.
 */

import { runKheperaValidation, runSingleTest } from './testValidation';

async function main() {
  console.log('🧠 Khepera Enhanced System Validation Tests');
  console.log('='.repeat(50));
  
  try {
    // Run all validation tests
    console.log('\n🚀 Running all validation tests...\n');
    const results = await runKheperaValidation();
    
    // Report results
    let passedCount = 0;
    
    for (const result of results) {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      console.log(`\n${status} ${result.testName}`);
      
      if (result.passed) {
        passedCount++;
        if (result.response) {
          console.log(`   📊 Response: ${result.response.wordCount} words`);
          console.log(`   🌱 Seed: ${result.response.seedWordCount} words`);
          console.log(`   📝 "${result.response.seed}"`);
        }
      } else {
        console.log(`   💥 Error: ${result.error}`);
        if (result.analysis) {
          console.log(`   🧱 Structure valid: ${result.analysis.structureValid ? '✅' : '❌'}`);
          console.log(`   🛡️ Clinical invariants: ${result.analysis.clinicalInvariantValid ? '✅' : '❌'}`);
          console.log(`   🎚️ Tone consistent: ${result.analysis.toneConsistent ? '✅' : '❌'}`);
        }
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📈 SUMMARY: ${passedCount}/${results.length} tests passed`);
    
    if (passedCount === results.length) {
      console.log('🎉 All tests passed! Khepera enhanced system is ready.');
    } else {
      console.log('⚠️  Some tests failed. Review the implementation before deployment.');
    }
    
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Allow running individual tests
if (process.argv.length > 2) {
  const testIndex = parseInt(process.argv[2]);
  if (!isNaN(testIndex)) {
    console.log('🧠 Khepera Enhanced System - Single Test');
    console.log('='.repeat(50));
    runSingleTest(testIndex)
      .then(result => {
        const status = result.passed ? '✅ PASS' : '❌ FAIL';
        console.log(`\n${status} ${result.testName}`);
        if (!result.passed) {
          console.log(`💥 Error: ${result.error}`);
        }
      })
      .catch(error => {
        console.error('💥 Single test failed:', error);
        process.exit(1);
      });
  } else {
      console.log('Usage: tsx runTests.ts [testIndex]');
      console.log('Test indices: 0-19');
    process.exit(1);
  }
} else {
  main();
}

export { main };
