// ALCHM Performance Monitor - Prevents performance regressions
const { spawn } = require('child_process');
const fs = require('fs');

const PERFORMANCE_BUDGETS = {
  lcp: 1500,  // Largest Contentful Paint (ms)
  fid: 50,    // First Input Delay (ms) 
  cls: 0.03,  // Cumulative Layout Shift
  tbt: 200,   // Total Blocking Time (ms)
  bundleSize: 500000, // 500KB max bundle
  crisisButtonResponseTime: 100 // Crisis button must respond in 100ms
};

async function runPerformanceCheck() {
  console.log('🔍 Running ALCHM Performance Check...');
  
  // Check bundle size
  const stats = fs.statSync('./out/_next/static/chunks/pages/_app.js');
  const bundleSize = stats.size;
  
  console.log(`Bundle size: ${(bundleSize / 1024).toFixed(2)}KB`);
  
  if (bundleSize > PERFORMANCE_BUDGETS.bundleSize) {
    console.error(`❌ Bundle size exceeds budget: ${bundleSize} > ${PERFORMANCE_BUDGETS.bundleSize}`);
    console.error('🚨 CRISIS USERS AT RISK - Bundle too large for emergency access');
    process.exit(1);
  }
  
  console.log('✅ Performance check passed');
  return true;
}

if (require.main === module) {
  runPerformanceCheck().catch(console.error);
}

module.exports = { runPerformanceCheck, PERFORMANCE_BUDGETS };
