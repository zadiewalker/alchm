#!/usr/bin/env node
/**
 * ALCHM Bundle Size Monitor
 * 
 * Keeps mobile performance optimized by tracking and alerting on bundle size changes
 * Critical for trauma-informed mobile experience during crisis situations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Crisis-informed mobile performance budgets (in KB)
const PERFORMANCE_BUDGETS = {
  // Critical for first load during crisis situations
  firstLoadJS: 300,      // 300KB max for initial JS
  mainBundle: 250,       // 250KB max for main app bundle  
  vendorBundle: 500,     // 500KB max for vendor libraries
  cssBundle: 50,         // 50KB max for CSS
  totalInitial: 800,     // 800KB max total for first load
  
  // Per-page budgets for trauma-informed navigation
  authPage: 100,         // Login/signup should be fast
  journalPage: 150,      // Journal entry - most critical
  dashboardPage: 200,    // Dashboard with analytics
  pricingPage: 100,      // Pricing - should be lightweight
};

const BUILD_DIR = '.next/static/chunks';
const REPORTS_DIR = 'bundle-reports';

function formatSize(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

function analyzeBundle() {
  console.log('📊 ALCHM Bundle Size Monitor');
  console.log('=============================');
  
  try {
    // Ensure build exists
    ensureBuild();
    
    // Analyze bundle structure
    const analysis = analyzeBundleStructure();
    
    // Check against performance budgets
    const budgetResults = checkPerformanceBudgets(analysis);
    
    // Generate reports
    generateReports(analysis, budgetResults);
    
    // Print comprehensive summary
    printComprehensiveSummary(analysis, budgetResults);
    
    return budgetResults;
    
  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    return { overallStatus: 'error', alerts: [error.message] };
  }
}

function ensureBuild() {
  if (!fs.existsSync(BUILD_DIR)) {
    console.log('🔨 No build found, creating production build...');
    try {
      execSync('npm run build', { 
        cwd: process.cwd(),
        stdio: 'inherit' 
      });
    } catch (error) {
      throw new Error('Failed to create production build for analysis');
    }
  } else {
    console.log('✅ Using existing build for analysis');
  }
}

function analyzeBundleStructure() {
  console.log('🔍 Analyzing bundle structure...');
  
  const analysis = {
    timestamp: new Date().toISOString(),
    bundles: {
      javascript: analyzeJSBundles(),
      css: analyzeCSS()
    },
    summary: {}
  };

  // Generate summary statistics
  analysis.summary = generateBundleSummary(analysis);
  
  return analysis;
}

function analyzeJSBundles() {
  const bundles = {};
  
  if (!fs.existsSync(BUILD_DIR)) {
    console.warn('⚠️  JS chunks directory not found');
    return bundles;
  }
  
  try {
    const files = fs.readdirSync(BUILD_DIR);
    
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(BUILD_DIR, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        // Categorize bundles
        let category = 'other';
        if (file.includes('main-app') || file.includes('app-')) category = 'main';
        else if (file.includes('webpack')) category = 'webpack-runtime';
        else if (file.includes('vendor') || file.includes('framework')) category = 'vendor';
        else if (file.includes('pages/') || file.includes('app/')) category = 'page';
        
        bundles[file] = {
          path: filePath,
          size: stats.size,
          sizeKB,
          category,
          isGzipped: file.endsWith('.gz')
        };
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not analyze JS bundles:', error.message);
  }
  
  return bundles;
}

function analyzeCSS() {
  const css = {};
  const cssDir = path.join('.next', 'static', 'css');
  
  if (!fs.existsSync(cssDir)) {
    return css;
  }
  
  try {
    const files = fs.readdirSync(cssDir);
    
    for (const file of files) {
      if (file.endsWith('.css')) {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        css[file] = {
          path: filePath,
          size: stats.size,
          sizeKB,
          isGzipped: file.endsWith('.gz')
        };
      }
    }
  } catch (error) {
    console.warn('⚠️  Could not analyze CSS bundles:', error.message);
  }
  
  return css;
}

function generateBundleSummary(analysis) {
  const summary = {
    totalJS: 0,
    totalCSS: 0,
    totalBundles: Object.keys(analysis.bundles.javascript).length,
    mainBundleSize: 0,
    vendorBundleSize: 0,
    criticalPathSize: 0,
    largestBundle: null,
    bundlesByCategory: {}
  };

  // Calculate JavaScript totals by category
  const categories = {};
  for (const [name, bundle] of Object.entries(analysis.bundles.javascript)) {
    summary.totalJS += bundle.sizeKB;
    
    if (!categories[bundle.category]) categories[bundle.category] = 0;
    categories[bundle.category] += bundle.sizeKB;
    
    if (bundle.category === 'main') {
      summary.mainBundleSize += bundle.sizeKB;
    } else if (bundle.category === 'vendor') {
      summary.vendorBundleSize += bundle.sizeKB;
    }
    
    if (!summary.largestBundle || bundle.sizeKB > summary.largestBundle.sizeKB) {
      summary.largestBundle = { name, ...bundle };
    }
  }
  summary.bundlesByCategory = categories;

  // Calculate CSS totals
  for (const bundle of Object.values(analysis.bundles.css)) {
    summary.totalCSS += bundle.sizeKB;
  }

  // Calculate critical path size (initial load)
  summary.criticalPathSize = summary.mainBundleSize + summary.vendorBundleSize + summary.totalCSS;

  return summary;
}

function checkPerformanceBudgets(analysis) {
  console.log('💰 Checking performance budgets...');
  
  const results = {
    timestamp: analysis.timestamp,
    budgets: {},
    alerts: [],
    overallStatus: 'good',
    recommendations: []
  };

  const summary = analysis.summary;

  // Check main budgets
  results.budgets.vendorBundle = checkBudget('Vendor Bundle', summary.vendorBundleSize, PERFORMANCE_BUDGETS.vendorBundle);
  results.budgets.mainBundle = checkBudget('Main Bundle', summary.mainBundleSize, PERFORMANCE_BUDGETS.mainBundle);
  results.budgets.cssBundle = checkBudget('CSS Bundle', summary.totalCSS, PERFORMANCE_BUDGETS.cssBundle);
  results.budgets.totalInitial = checkBudget('Total Initial Load', summary.criticalPathSize, PERFORMANCE_BUDGETS.totalInitial);

  // Aggregate alerts and determine overall status
  let criticalCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  for (const budget of Object.values(results.budgets)) {
    if (budget.status === 'error') errorCount++;
    else if (budget.status === 'critical') criticalCount++;  
    else if (budget.status === 'warning') warningCount++;
    
    if (budget.alert) {
      results.alerts.push(budget.alert);
    }
  }

  // Determine overall status
  if (errorCount > 0) results.overallStatus = 'error';
  else if (criticalCount > 0) results.overallStatus = 'critical';
  else if (warningCount > 0) results.overallStatus = 'warning';

  // Generate recommendations
  results.recommendations = generateOptimizationRecommendations(results, analysis);

  return results;
}

function checkBudget(name, actual, budget) {
  const usageRatio = actual / budget;
  let status = 'good';
  let alert = null;

  if (usageRatio >= 1.0) {
    status = 'error';
    alert = `🚨 BUDGET EXCEEDED: ${name} is ${actual}KB (${Math.round(usageRatio * 100)}% of ${budget}KB budget)`;
  } else if (usageRatio >= 0.95) {
    status = 'critical';  
    alert = `⚠️  BUDGET CRITICAL: ${name} is ${actual}KB (${Math.round(usageRatio * 100)}% of ${budget}KB budget)`;
  } else if (usageRatio >= 0.8) {
    status = 'warning';
    alert = `💛 BUDGET WARNING: ${name} is ${actual}KB (${Math.round(usageRatio * 100)}% of ${budget}KB budget)`;
  }

  return {
    name,
    actual,
    budget,
    usageRatio,
    usagePercent: Math.round(usageRatio * 100),
    status,
    alert,
    remainingKB: Math.max(0, budget - actual)
  };
}

function generateOptimizationRecommendations(results, analysis) {
  const recommendations = [];

  // Bundle-specific recommendations
  if (results.budgets.vendorBundle?.status === 'critical' || results.budgets.vendorBundle?.status === 'error') {
    recommendations.push('🔧 Consider code splitting vendor libraries');
    recommendations.push('📦 Analyze vendor bundle with: npm run analyze');
    recommendations.push('🗑️  Remove unused Firebase modules');
  }

  if (results.budgets.mainBundle?.status === 'critical' || results.budgets.mainBundle?.status === 'error') {
    recommendations.push('⚡ Implement dynamic imports for non-critical features');
    recommendations.push('🗜️  Enable tree shaking for unused exports');
    recommendations.push('📋 Move large components to separate chunks');
  }

  if (results.budgets.cssBundle?.status === 'critical' || results.budgets.cssBundle?.status === 'error') {
    recommendations.push('🎨 Optimize CSS with unused style purging');
    recommendations.push('📐 Consider critical CSS inlining');
  }

  // Crisis-informed recommendations
  if (results.overallStatus === 'error') {
    recommendations.push('🚨 CRITICAL: Bundle sizes exceed crisis-safe mobile limits');
    recommendations.push('📱 Users in crisis need fast loading - immediate optimization required');
  }

  return recommendations;
}

function generateReports(analysis, budgetResults) {
  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  // Generate JSON report
  const report = {
    meta: {
      timestamp: analysis.timestamp,
      version: getVersion(),
      environment: 'production'
    },
    analysis,
    budgetResults
  };

  const reportPath = path.join(REPORTS_DIR, `bundle-report-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`📄 Report saved: ${reportPath}`);
}

function printComprehensiveSummary(analysis, results) {
  const summary = analysis.summary;
  
  console.log('\n📊 Bundle Size Analysis Summary');
  console.log('================================');
  
  const statusColors = {
    good: '\x1b[32m',     // Green
    warning: '\x1b[33m',  // Yellow  
    critical: '\x1b[35m', // Magenta
    error: '\x1b[31m'     // Red
  };
  const resetColor = '\x1b[0m';
  const statusColor = statusColors[results.overallStatus] || resetColor;
  
  console.log(`Overall Status: ${statusColor}${results.overallStatus.toUpperCase()}${resetColor}`);
  console.log(`Total Bundles: ${summary.totalBundles}`);
  console.log(`Total JS Size: ${summary.totalJS}KB`);
  console.log(`Total CSS Size: ${summary.totalCSS}KB`);
  console.log(`Critical Path: ${summary.criticalPathSize}KB`);

  // Budget status
  console.log('\n💰 Budget Status:');
  for (const budget of Object.values(results.budgets)) {
    const statusIcon = {
      good: '✅',
      warning: '⚠️',
      critical: '🔥',
      error: '🚨'
    }[budget.status];
    
    console.log(`  ${statusIcon} ${budget.name}: ${budget.actual}KB/${budget.budget}KB (${budget.usagePercent}%)`);
  }

  if (results.alerts.length > 0) {
    console.log('\n🚨 Budget Alerts:');
    results.alerts.forEach(alert => console.log(`  ${alert}`));
  }

  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    results.recommendations.slice(0, 3).forEach(rec => console.log(`  ${rec}`));
  }

  // Crisis-informed context
  console.log('\n🛡️  Crisis-Informed Performance Impact:');
  const loadTime3G = Math.round(summary.criticalPathSize / 50);
  console.log(`  📱 3G Load Time: ~${loadTime3G}s ${loadTime3G > 10 ? '(Too slow for crisis situations)' : '(Crisis-safe)'}`);
  
  const isCrisisSafe = results.overallStatus === 'good' || results.overallStatus === 'warning';
  console.log(`  🆘 Crisis Accessibility: ${isCrisisSafe ? '✅ Maintained' : '❌ Compromised'}`);
}

function getVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version || '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle };