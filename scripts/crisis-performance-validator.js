#!/usr/bin/env node

/**
 * CRISIS-CRITICAL: Performance Validator for ALCHM Emergency Bundle Splitting
 * Validates that our emergency optimizations meet life-safety performance standards
 */

const fs = require('fs');
const path = require('path');

// Crisis-critical performance thresholds for trauma-informed platform
const CRISIS_THRESHOLDS = {
  // Bundle sizes (bytes) - these are life-safety requirements
  EMERGENCY_PAGE: 15 * 1024,      // 15KB - absolute maximum for emergency access
  CRISIS_JOURNAL: 25 * 1024,      // 25KB - crisis journaling must be immediate
  AUTH_EMERGENCY: 10 * 1024,      // 10KB - emergency auth must be instant
  MAIN_INITIAL: 50 * 1024,        // 50KB - main initial bundle (reduced from 147KB)
  
  // Core Web Vitals - trauma-informed requirements
  FCP_TARGET: 1200,               // First Contentful Paint: 1.2s max
  LCP_TARGET: 2000,               // Largest Contentful Paint: 2.0s max
  FID_TARGET: 50,                 // First Input Delay: 50ms max (crisis responsiveness)
  CLS_TARGET: 0.05,               // Cumulative Layout Shift: minimal for trauma users
  TTI_TARGET: 3000,               // Time to Interactive: 3s max (crisis critical)
  
  // Network performance for vulnerable users
  SLOW_3G_TTI: 5000,              // TTI on slow 3G: 5s max
  OFFLINE_CACHE: 1000,            // Offline cache response: 1s max
};

function checkBuildExists() {
  const buildPath = path.join(process.cwd(), '.next');
  if (!fs.existsSync(buildPath)) {
    console.log('🚨 No build found. Running emergency build...\n');
    return false;
  }
  return true;
}

function analyzeBundles() {
  const chunksPath = path.join(process.cwd(), '.next', 'static', 'chunks');
  
  if (!fs.existsSync(chunksPath)) {
    return { error: 'Build chunks not found' };
  }

  const chunks = fs.readdirSync(chunksPath)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(chunksPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        category: categorizeChunk(file)
      };
    })
    .sort((a, b) => b.size - a.size);

  return { chunks };
}

function categorizeChunk(filename) {
  const name = filename.toLowerCase();
  
  if (name.includes('emergency') || name.includes('crisis')) {
    return 'emergency';
  } else if (name.includes('auth') && (name.includes('emergency') || name.includes('simple'))) {
    return 'auth-emergency';
  } else if (name.includes('journal') && name.includes('emergency')) {
    return 'journal-emergency';
  } else if (name.includes('react') || name.includes('next-framework')) {
    return 'framework-core';
  } else if (name.includes('firebase')) {
    return 'firebase';
  } else if (name.includes('stripe')) {
    return 'stripe';
  } else if (name.match(/^\d+/)) {
    return 'vendor';
  }
  
  return 'other';
}

function validateCrisisPerformance(chunks) {
  const results = {
    emergencyBundles: [],
    criticalIssues: [],
    passed: 0,
    failed: 0,
    crisisSafe: true
  };

  let emergencySize = 0;
  let authEmergencySize = 0;
  let journalEmergencySize = 0;
  let frameworkSize = 0;

  chunks.forEach(chunk => {
    switch (chunk.category) {
      case 'emergency':
        emergencySize += chunk.size;
        break;
      case 'auth-emergency':
        authEmergencySize += chunk.size;
        break;
      case 'journal-emergency':
        journalEmergencySize += chunk.size;
        break;
      case 'framework-core':
        frameworkSize += chunk.size;
        break;
    }
  });

  // Validate emergency page bundle
  if (emergencySize > CRISIS_THRESHOLDS.EMERGENCY_PAGE) {
    results.criticalIssues.push({
      type: 'CRITICAL',
      message: 'Emergency page bundle exceeds life-safety threshold',
      actual: emergencySize,
      threshold: CRISIS_THRESHOLDS.EMERGENCY_PAGE,
      impact: 'Users in crisis may abandon due to slow loading'
    });
    results.crisisSafe = false;
    results.failed++;
  } else {
    results.passed++;
  }

  // Validate auth emergency bundle
  if (authEmergencySize > CRISIS_THRESHOLDS.AUTH_EMERGENCY) {
    results.criticalIssues.push({
      type: 'HIGH',
      message: 'Emergency auth bundle too large',
      actual: authEmergencySize,
      threshold: CRISIS_THRESHOLDS.AUTH_EMERGENCY,
      impact: 'Delayed access during crisis situations'
    });
    results.failed++;
  } else {
    results.passed++;
  }

  // Validate framework size
  if (frameworkSize > CRISIS_THRESHOLDS.MAIN_INITIAL) {
    results.criticalIssues.push({
      type: 'HIGH',
      message: 'Framework bundle still too large',
      actual: frameworkSize,
      threshold: CRISIS_THRESHOLDS.MAIN_INITIAL,
      impact: 'Slow initial page loads across all routes'
    });
    results.failed++;
  } else {
    results.passed++;
  }

  return results;
}

function generateOptimizationSuggestions(chunks, results) {
  const suggestions = [];

  // Find largest chunks that need optimization
  const largeBundles = chunks.filter(chunk => chunk.size > 10 * 1024);
  
  if (largeBundles.length > 0) {
    suggestions.push({
      priority: 'HIGH',
      action: 'Bundle Splitting',
      details: `${largeBundles.length} chunks are >10KB. Consider further splitting.`,
      files: largeBundles.map(c => c.name).slice(0, 3)
    });
  }

  // Check for optimization opportunities
  const vendorChunks = chunks.filter(c => c.category === 'vendor');
  if (vendorChunks.some(c => c.size > 50 * 1024)) {
    suggestions.push({
      priority: 'MEDIUM',
      action: 'Vendor Optimization',
      details: 'Large vendor chunks found. Consider dynamic imports.',
      impact: 'Reduce initial bundle size'
    });
  }

  const firebaseChunks = chunks.filter(c => c.category === 'firebase');
  if (firebaseChunks.length > 0) {
    suggestions.push({
      priority: 'MEDIUM',
      action: 'Firebase Tree Shaking',
      details: 'Optimize Firebase imports to only include used features.',
      impact: 'Significant bundle size reduction'
    });
  }

  return suggestions;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function printReport(chunks, results, suggestions) {
  console.log('\n🆘 ALCHM CRISIS PERFORMANCE VALIDATION REPORT\n');
  console.log('=' * 70);
  
  // Crisis Safety Status
  if (results.crisisSafe) {
    console.log('✅ CRISIS SAFETY: VALIDATED');
    console.log('   Emergency bundles meet life-safety performance standards\n');
  } else {
    console.log('🚨 CRISIS SAFETY: FAILED');
    console.log('   IMMEDIATE ACTION REQUIRED - User safety at risk\n');
  }

  // Performance Summary
  console.log('📊 PERFORMANCE SUMMARY:');
  console.log(`   ✅ Passed: ${results.passed} checks`);
  console.log(`   ❌ Failed: ${results.failed} checks`);
  console.log(`   📦 Total Chunks: ${chunks.length}`);
  console.log(`   📈 Total Size: ${formatBytes(chunks.reduce((sum, c) => sum + c.size, 0))}\n`);

  // Critical Issues
  if (results.criticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ACTION:\n');
    results.criticalIssues.forEach((issue, index) => {
      const severity = issue.type === 'CRITICAL' ? '🚨' : '⚠️';
      console.log(`${severity} ${index + 1}. ${issue.message}`);
      console.log(`   Current: ${formatBytes(issue.actual)}`);
      console.log(`   Threshold: ${formatBytes(issue.threshold)}`);
      console.log(`   Impact: ${issue.impact}\n`);
    });
  }

  // Bundle Breakdown by Category
  console.log('📦 BUNDLE BREAKDOWN BY CATEGORY:\n');
  const categories = {};
  chunks.forEach(chunk => {
    if (!categories[chunk.category]) {
      categories[chunk.category] = { count: 0, size: 0 };
    }
    categories[chunk.category].count++;
    categories[chunk.category].size += chunk.size;
  });

  Object.entries(categories)
    .sort(([,a], [,b]) => b.size - a.size)
    .forEach(([category, data]) => {
      const status = getStatusForCategory(category, data.size);
      console.log(`${status} ${category}: ${data.count} chunks, ${formatBytes(data.size)}`);
    });

  // Top Largest Chunks
  console.log('\n📊 LARGEST CHUNKS (TOP 10):\n');
  chunks.slice(0, 10).forEach((chunk, index) => {
    const status = chunk.size > 15 * 1024 ? '🚨' : chunk.size > 10 * 1024 ? '⚠️' : '✅';
    console.log(`${index + 1}. ${status} ${chunk.name}`);
    console.log(`   Size: ${formatBytes(chunk.size)} | Category: ${chunk.category}`);
  });

  // Optimization Suggestions
  if (suggestions.length > 0) {
    console.log('\n🔧 OPTIMIZATION RECOMMENDATIONS:\n');
    suggestions.forEach((suggestion, index) => {
      const priority = suggestion.priority === 'HIGH' ? '🚨' : '💡';
      console.log(`${priority} ${index + 1}. ${suggestion.action} (${suggestion.priority})`);
      console.log(`   ${suggestion.details}`);
      if (suggestion.impact) {
        console.log(`   Impact: ${suggestion.impact}`);
      }
      if (suggestion.files) {
        console.log(`   Files: ${suggestion.files.join(', ')}`);
      }
      console.log('');
    });
  }

  // Crisis Performance Targets
  console.log('🎯 CRISIS PERFORMANCE TARGETS:\n');
  console.log(`   Emergency Page: <${formatBytes(CRISIS_THRESHOLDS.EMERGENCY_PAGE)}`);
  console.log(`   Crisis Journal: <${formatBytes(CRISIS_THRESHOLDS.CRISIS_JOURNAL)}`);
  console.log(`   Auth Emergency: <${formatBytes(CRISIS_THRESHOLDS.AUTH_EMERGENCY)}`);
  console.log(`   Time to Interactive: <${CRISIS_THRESHOLDS.TTI_TARGET}ms`);
  console.log(`   First Input Delay: <${CRISIS_THRESHOLDS.FID_TARGET}ms\n`);

  return results.crisisSafe;
}

function getStatusForCategory(category, size) {
  switch (category) {
    case 'emergency':
      return size > CRISIS_THRESHOLDS.EMERGENCY_PAGE ? '🚨' : '✅';
    case 'auth-emergency':
      return size > CRISIS_THRESHOLDS.AUTH_EMERGENCY ? '🚨' : '✅';
    case 'journal-emergency':
      return size > CRISIS_THRESHOLDS.CRISIS_JOURNAL ? '🚨' : '✅';
    case 'framework-core':
      return size > CRISIS_THRESHOLDS.MAIN_INITIAL ? '⚠️' : '✅';
    default:
      return size > 50 * 1024 ? '⚠️' : '✅';
  }
}

async function main() {
  console.log('🚀 Starting ALCHM Crisis Performance Validation...\n');

  if (!checkBuildExists()) {
    console.log('❌ Please run: npm run build');
    console.log('   Then re-run this validator to check performance\n');
    process.exit(1);
  }

  try {
    const { chunks, error } = analyzeBundles();
    
    if (error) {
      console.error('❌ Bundle analysis failed:', error);
      process.exit(1);
    }

    const results = validateCrisisPerformance(chunks);
    const suggestions = generateOptimizationSuggestions(chunks, results);
    const crisisSafe = printReport(chunks, results, suggestions);

    if (crisisSafe) {
      console.log('✅ CRISIS PERFORMANCE VALIDATED');
      console.log('   Bundle optimizations meet emergency standards\n');
      process.exit(0);
    } else {
      console.log('🚨 CRISIS PERFORMANCE FAILED');
      console.log('   Bundle sizes exceed life-safety thresholds');
      console.log('   User access during crisis situations at risk\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Performance validation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBundles,
  validateCrisisPerformance,
  CRISIS_THRESHOLDS
};