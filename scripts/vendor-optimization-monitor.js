#!/usr/bin/env node

// scripts/vendor-optimization-monitor.js
// VENDOR OPTIMIZATION: Monitor bundle sizes and alert on vendor chunk regressions

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// VENDOR OPTIMIZATION: Performance budgets for crisis scenarios
const VENDOR_BUDGETS = {
  'react-vendor': 80000,        // 80KB for React ecosystem
  'next-framework': 50000,      // 50KB for Next.js
  'firebase-critical': 60000,   // 60KB for critical Firebase
  'firebase-firestore': 80000,  // 80KB for Firestore
  'utilities': 30000,           // 30KB for utilities
  'animations': 100000,         // 100KB for Framer Motion
  'ai-vendor': 80000,           // 80KB for Google AI
  'stripe': 60000,              // 60KB for Stripe
  'vendor-misc': 50000,         // 50KB for misc vendors
  'webpack-runtime': 10000,     // 10KB for webpack runtime
  'main': 200000,               // 200KB for main app bundle
  'total-initial': 400000,      // 400KB total initial load
  'crisis-critical-total': 50000, // 50KB for crisis components
};

// VENDOR OPTIMIZATION: Crisis performance thresholds
const CRISIS_THRESHOLDS = {
  '3G_LOAD_TIME': 3000,         // 3 seconds on 3G
  'FIRST_CONTENTFUL_PAINT': 1500, // 1.5 seconds FCP
  'LARGEST_CONTENTFUL_PAINT': 2500, // 2.5 seconds LCP
  'CUMULATIVE_LAYOUT_SHIFT': 0.1,   // CLS under 0.1
  'FIRST_INPUT_DELAY': 100,     // 100ms FID
};

function getBundleStats() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.log('⚠️  No build found. Run npm run build first.');
    return null;
  }
  
  const stats = {
    chunks: {},
    totalSize: 0,
    initialLoad: 0,
    vendorSize: 0,
    crisisSize: 0
  };
  
  // Analyze JavaScript chunks
  const chunksDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir)
      .filter(file => file.endsWith('.js'))
      .filter(file => !file.includes('.map'));
    
    chunkFiles.forEach(file => {
      const filePath = path.join(chunksDir, file);
      const size = fs.statSync(filePath).size;
      const chunkName = getChunkName(file);
      
      stats.chunks[chunkName] = (stats.chunks[chunkName] || 0) + size;
      stats.totalSize += size;
      
      // Categorize chunks
      if (isInitialChunk(chunkName)) {
        stats.initialLoad += size;
      }
      
      if (isVendorChunk(chunkName)) {
        stats.vendorSize += size;
      }
      
      if (isCrisisChunk(chunkName)) {
        stats.crisisSize += size;
      }
    });
  }
  
  return stats;
}

function getChunkName(filename) {
  // Extract meaningful chunk name from Next.js filename
  if (filename.includes('webpack-runtime')) return 'webpack-runtime';
  if (filename.includes('react-vendor')) return 'react-vendor';
  if (filename.includes('next-framework')) return 'next-framework';
  if (filename.includes('firebase-critical')) return 'firebase-critical';
  if (filename.includes('firebase-firestore')) return 'firebase-firestore';
  if (filename.includes('utilities')) return 'utilities';
  if (filename.includes('animations')) return 'animations';
  if (filename.includes('ai-vendor')) return 'ai-vendor';
  if (filename.includes('stripe')) return 'stripe';
  if (filename.includes('vendor-')) return 'vendor-misc';
  if (filename.includes('crisis')) return 'crisis-critical';
  if (filename.includes('common')) return 'common';
  if (filename.includes('main-')) return 'main';
  
  return 'other';
}

function isInitialChunk(chunkName) {
  return ['react-vendor', 'next-framework', 'utilities', 'main', 'webpack-runtime'].includes(chunkName);
}

function isVendorChunk(chunkName) {
  return chunkName.includes('vendor') || 
         ['react-vendor', 'next-framework', 'firebase-critical', 'firebase-firestore', 
          'utilities', 'animations', 'ai-vendor', 'stripe'].includes(chunkName);
}

function isCrisisChunk(chunkName) {
  return chunkName.includes('crisis') || chunkName.includes('emergency');
}

function formatSize(bytes) {
  const kb = bytes / 1024;
  return `${kb.toFixed(1)}KB`;
}

function calculateBudgetStatus(actual, budget) {
  const percentage = (actual / budget) * 100;
  const status = percentage <= 100 ? '✅' : percentage <= 120 ? '⚠️' : '🚨';
  return { status, percentage: percentage.toFixed(1) };
}

function estimateMobileLoadTime(totalBytes) {
  // Estimate load time on 3G (assuming 1.6 Mbps effective speed)
  const bitsPerSecond = 1600000;
  const bytesPerSecond = bitsPerSecond / 8;
  const loadTimeMs = (totalBytes / bytesPerSecond) * 1000;
  
  return Math.round(loadTimeMs);
}

function generateOptimizationRecommendations(stats) {
  const recommendations = [];
  
  // Check individual chunk budgets
  Object.entries(VENDOR_BUDGETS).forEach(([chunkName, budget]) => {
    const actual = stats.chunks[chunkName] || 0;
    if (actual > budget) {
      const excess = actual - budget;
      recommendations.push(`🔧 ${chunkName}: Reduce by ${formatSize(excess)} (currently ${formatSize(actual)})`);
    }
  });
  
  // Crisis-specific recommendations
  if (stats.crisisSize > VENDOR_BUDGETS['crisis-critical-total']) {
    recommendations.push(`🆘 Crisis components too large: ${formatSize(stats.crisisSize)}. Move non-essential code to async chunks.`);
  }
  
  // Initial load recommendations
  const loadTime = estimateMobileLoadTime(stats.initialLoad);
  if (loadTime > CRISIS_THRESHOLDS['3G_LOAD_TIME']) {
    recommendations.push(`📱 Initial load too slow: ${loadTime}ms on 3G. Target: ${CRISIS_THRESHOLDS['3G_LOAD_TIME']}ms`);
  }
  
  // Vendor size recommendations
  if (stats.vendorSize > 500000) { // 500KB total vendor budget
    recommendations.push(`📦 Total vendor size too large: ${formatSize(stats.vendorSize)}. Consider more aggressive code splitting.`);
  }
  
  return recommendations;
}

function generateReport(stats) {
  console.log('\n📊 ALCHM Vendor Optimization Report');
  console.log('=====================================');
  
  // Overall metrics
  console.log(`\n📈 Bundle Metrics:`);
  console.log(`   Total Size: ${formatSize(stats.totalSize)}`);
  console.log(`   Initial Load: ${formatSize(stats.initialLoad)}`);
  console.log(`   Vendor Size: ${formatSize(stats.vendorSize)}`);
  console.log(`   Crisis Size: ${formatSize(stats.crisisSize)}`);
  
  // Mobile performance estimate
  const loadTime = estimateMobileLoadTime(stats.initialLoad);
  const loadStatus = loadTime <= CRISIS_THRESHOLDS['3G_LOAD_TIME'] ? '✅' : '🚨';
  console.log(`\n📱 Mobile Performance (3G):`);
  console.log(`   ${loadStatus} Estimated Load Time: ${loadTime}ms`);
  console.log(`   Target: ${CRISIS_THRESHOLDS['3G_LOAD_TIME']}ms for crisis scenarios`);
  
  // Chunk analysis
  console.log(`\n📦 Chunk Analysis:`);
  Object.entries(stats.chunks)
    .sort(([,a], [,b]) => b - a)
    .forEach(([chunkName, size]) => {
      const budget = VENDOR_BUDGETS[chunkName];
      if (budget) {
        const { status, percentage } = calculateBudgetStatus(size, budget);
        console.log(`   ${status} ${chunkName}: ${formatSize(size)} (${percentage}% of ${formatSize(budget)} budget)`);
      } else {
        console.log(`   📄 ${chunkName}: ${formatSize(size)}`);
      }
    });
  
  // Budget status
  const budgetViolations = Object.entries(VENDOR_BUDGETS)
    .filter(([chunkName, budget]) => (stats.chunks[chunkName] || 0) > budget);
  
  if (budgetViolations.length > 0) {
    console.log(`\n🚨 Budget Violations (${budgetViolations.length}):`);
    budgetViolations.forEach(([chunkName, budget]) => {
      const actual = stats.chunks[chunkName];
      const excess = actual - budget;
      console.log(`   ${chunkName}: ${formatSize(excess)} over budget`);
    });
  } else {
    console.log(`\n✅ All vendor budgets met!`);
  }
  
  // Optimization recommendations
  const recommendations = generateOptimizationRecommendations(stats);
  if (recommendations.length > 0) {
    console.log(`\n💡 Optimization Recommendations:`);
    recommendations.forEach(rec => console.log(`   ${rec}`));
  } else {
    console.log(`\n🎉 No optimization recommendations - excellent vendor chunking!`);
  }
  
  // Crisis readiness assessment
  const crisisReady = loadTime <= CRISIS_THRESHOLDS['3G_LOAD_TIME'] && 
                     stats.crisisSize <= VENDOR_BUDGETS['crisis-critical-total'];
  
  console.log(`\n🆘 Crisis Readiness Assessment:`);
  console.log(`   ${crisisReady ? '✅' : '❌'} Ready for crisis scenarios`);
  console.log(`   Load Time: ${loadTime}ms (target: ${CRISIS_THRESHOLDS['3G_LOAD_TIME']}ms)`);
  console.log(`   Crisis Bundle: ${formatSize(stats.crisisSize)} (target: ${formatSize(VENDOR_BUDGETS['crisis-critical-total'])})`);
}

function saveReport(stats) {
  const reportData = {
    timestamp: new Date().toISOString(),
    stats,
    budgets: VENDOR_BUDGETS,
    thresholds: CRISIS_THRESHOLDS,
    recommendations: generateOptimizationRecommendations(stats)
  };
  
  const reportsDir = path.join(process.cwd(), 'bundle-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, `vendor-optimization-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`\n💾 Report saved: ${reportPath}`);
}

// Main execution
function main() {
  console.log('🔍 Analyzing vendor chunk optimization...\n');
  
  const stats = getBundleStats();
  if (!stats) {
    process.exit(1);
  }
  
  generateReport(stats);
  saveReport(stats);
  
  // Exit with error code if critical thresholds are exceeded
  const loadTime = estimateMobileLoadTime(stats.initialLoad);
  const criticalFailures = loadTime > CRISIS_THRESHOLDS['3G_LOAD_TIME'] ||
                          stats.crisisSize > VENDOR_BUDGETS['crisis-critical-total'];
  
  if (criticalFailures) {
    console.log('\n❌ Critical performance thresholds exceeded!');
    process.exit(1);
  } else {
    console.log('\n✅ Vendor optimization goals met!');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  getBundleStats,
  generateReport,
  VENDOR_BUDGETS,
  CRISIS_THRESHOLDS
};