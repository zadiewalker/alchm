#!/usr/bin/env node

/**
 * Bundle Performance Analyzer for ALCHM
 * Analyzes build output to ensure crisis-critical performance targets
 * 
 * Usage:
 *   node scripts/analyze-bundle-performance.js
 *   npm run build && node scripts/analyze-bundle-performance.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Performance targets for crisis-critical loading
const PERFORMANCE_TARGETS = {
  vendorBundle: 800 * 1024,      // 800KB - main target
  criticalJS: 100 * 1024,        // 100KB - homepage
  authPageJS: 200 * 1024,        // 200KB - auth page total
  dashboardJS: 300 * 1024,       // 300KB - dashboard
  totalJS: 1.5 * 1024 * 1024,    // 1.5MB - total JS budget
  criticalCSS: 50 * 1024,        // 50KB - critical styles
  firstLoadJS: 150 * 1024        // 150KB - first load JS
};

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(__dirname, '..', 'out');
    this.results = {
      passed: 0,
      warnings: 0,
      failures: 0,
      summary: {}
    };
  }

  analyze() {
    console.log('🔍 Analyzing ALCHM Bundle Performance...\n');
    console.log('📊 Crisis-Critical Performance Targets:');
    console.log(`   • Vendor Bundle: <${Math.round(PERFORMANCE_TARGETS.vendorBundle / 1024)}KB`);
    console.log(`   • Homepage JS: <${Math.round(PERFORMANCE_TARGETS.criticalJS / 1024)}KB`);
    console.log(`   • Auth Page JS: <${Math.round(PERFORMANCE_TARGETS.authPageJS / 1024)}KB`);
    console.log(`   • First Load JS: <${Math.round(PERFORMANCE_TARGETS.firstLoadJS / 1024)}KB\n`);

    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Run `npm run build` first.');
      process.exit(1);
    }

    this.analyzeJSBundles();
    this.analyzeCSSBundles();
    this.analyzePageBundles();
    this.generateReport();
    this.generateOptimizationSuggestions();

    // Exit with error code if critical failures
    if (this.results.failures > 0) {
      console.log('\n🚨 CRITICAL: Bundle size failures detected. Crisis users may experience slow loading.');
      process.exit(1);
    } else if (this.results.warnings > 0) {
      console.log('\n⚠️  Warnings detected. Monitor performance closely.');
      process.exit(0);
    } else {
      console.log('\n✅ All performance targets met! Bundle optimized for crisis users.');
      process.exit(0);
    }
  }

  analyzeJSBundles() {
    console.log('📦 Analyzing JavaScript Bundles:');
    
    const staticDir = path.join(this.buildDir, '_next', 'static');
    if (!fs.existsSync(staticDir)) {
      console.log('   ⚠️  No static directory found');
      return;
    }

    const jsFiles = this.findFiles(staticDir, '.js');
    let totalJS = 0;
    let vendorSize = 0;
    let firstLoadJS = 0;

    jsFiles.forEach(file => {
      const stats = fs.statSync(file);
      const size = stats.size;
      const filename = path.basename(file);
      const sizeKB = Math.round(size / 1024);
      
      totalJS += size;

      // Categorize bundles
      if (filename.includes('vendors')) {
        vendorSize = size;
        this.checkTarget('Vendor Bundle', size, PERFORMANCE_TARGETS.vendorBundle, filename);
      } else if (filename.includes('main-app') || filename.includes('page') && !filename.includes('dashboard')) {
        firstLoadJS += size;
      }

      // Log significant bundles
      if (size > 50 * 1024) { // >50KB
        const status = this.getStatusIcon(size, PERFORMANCE_TARGETS.vendorBundle);
        console.log(`   ${status} ${filename}: ${sizeKB}KB`);
      }
    });

    // Check aggregate targets
    this.checkTarget('First Load JS', firstLoadJS, PERFORMANCE_TARGETS.firstLoadJS, 'Initial page load');
    this.checkTarget('Total JS', totalJS, PERFORMANCE_TARGETS.totalJS, 'All JavaScript');

    this.results.summary.totalJS = totalJS;
    this.results.summary.vendorSize = vendorSize;
    this.results.summary.firstLoadJS = firstLoadJS;
    
    console.log('');
  }

  analyzeCSSBundles() {
    console.log('🎨 Analyzing CSS Bundles:');
    
    const staticDir = path.join(this.buildDir, '_next', 'static');
    if (!fs.existsSync(staticDir)) return;

    const cssFiles = this.findFiles(staticDir, '.css');
    let totalCSS = 0;

    cssFiles.forEach(file => {
      const stats = fs.statSync(file);
      const size = stats.size;
      const filename = path.basename(file);
      const sizeKB = Math.round(size / 1024);
      
      totalCSS += size;

      if (size > 20 * 1024) { // >20KB
        const status = this.getStatusIcon(size, PERFORMANCE_TARGETS.criticalCSS);
        console.log(`   ${status} ${filename}: ${sizeKB}KB`);
      }
    });

    this.checkTarget('Total CSS', totalCSS, PERFORMANCE_TARGETS.criticalCSS, 'All stylesheets');
    this.results.summary.totalCSS = totalCSS;
    
    console.log('');
  }

  analyzePageBundles() {
    console.log('📄 Analyzing Page-Specific Bundles:');
    
    const pagesDir = path.join(this.buildDir, '_next', 'static', 'chunks', 'pages');
    if (!fs.existsSync(pagesDir)) {
      console.log('   ℹ️  No page-specific bundles found (using App Router)');
      return;
    }

    const pageFiles = this.findFiles(pagesDir, '.js');
    
    pageFiles.forEach(file => {
      const stats = fs.statSync(file);
      const size = stats.size;
      const filename = path.basename(file);
      const sizeKB = Math.round(size / 1024);
      
      // Check specific page targets
      let target = PERFORMANCE_TARGETS.criticalJS;
      let context = 'page';
      
      if (filename.includes('auth') || filename.includes('login')) {
        target = PERFORMANCE_TARGETS.authPageJS;
        context = 'auth page';
      } else if (filename.includes('dashboard')) {
        target = PERFORMANCE_TARGETS.dashboardJS;
        context = 'dashboard';
      }

      this.checkTarget(`${context} (${filename})`, size, target, filename);
    });
    
    console.log('');
  }

  checkTarget(name, actual, target, context) {
    const actualKB = Math.round(actual / 1024);
    const targetKB = Math.round(target / 1024);
    const percentage = Math.round((actual / target) * 100);

    if (actual <= target) {
      console.log(`   ✅ ${name}: ${actualKB}KB (${percentage}% of ${targetKB}KB budget)`);
      this.results.passed++;
    } else if (actual <= target * 1.1) { // Within 10% - warning
      console.log(`   ⚠️  ${name}: ${actualKB}KB (${percentage}% of ${targetKB}KB budget) - Close to limit`);
      this.results.warnings++;
    } else {
      const overage = actualKB - targetKB;
      console.log(`   ❌ ${name}: ${actualKB}KB (${percentage}% of ${targetKB}KB budget) - EXCEEDS by ${overage}KB`);
      this.results.failures++;
    }
  }

  getStatusIcon(size, target) {
    if (size <= target) return '✅';
    if (size <= target * 1.1) return '⚠️';
    return '❌';
  }

  findFiles(dir, extension, files = []) {
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        this.findFiles(fullPath, extension, files);
      } else if (item.endsWith(extension)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  generateReport() {
    console.log('📋 Performance Summary:');
    console.log(`   • Tests Passed: ${this.results.passed}`);
    console.log(`   • Warnings: ${this.results.warnings}`);
    console.log(`   • Failures: ${this.results.failures}`);
    
    const { totalJS, vendorSize, firstLoadJS, totalCSS } = this.results.summary;
    
    console.log('\n📊 Bundle Sizes:');
    console.log(`   • Total JavaScript: ${Math.round(totalJS / 1024)}KB`);
    console.log(`   • Vendor Bundle: ${Math.round(vendorSize / 1024)}KB`);
    console.log(`   • First Load JS: ${Math.round(firstLoadJS / 1024)}KB`);
    console.log(`   • Total CSS: ${Math.round(totalCSS / 1024)}KB`);

    // Calculate improvement from original 1.7MB
    const originalSize = 1700 * 1024; // 1.7MB
    if (vendorSize > 0) {
      const improvement = ((originalSize - vendorSize) / originalSize) * 100;
      console.log(`\n🎯 Bundle Size Improvement:`);
      console.log(`   • Original: 1700KB`);
      console.log(`   • Current: ${Math.round(vendorSize / 1024)}KB`);
      console.log(`   • Reduction: ${Math.round(improvement)}%`);
      
      if (improvement >= 53) { // Target 53% reduction (1700KB -> 800KB)
        console.log(`   ✅ Target reduction achieved!`);
      } else {
        console.log(`   ⚠️  Target: 53% reduction (800KB goal)`);
      }
    }
  }

  generateOptimizationSuggestions() {
    console.log('\n💡 Optimization Suggestions:');
    
    const { vendorSize, firstLoadJS } = this.results.summary;
    
    if (vendorSize > PERFORMANCE_TARGETS.vendorBundle) {
      console.log('   📦 Large vendor bundle detected:');
      console.log('      • Review webpack-bundle-analyzer output: ANALYZE=true npm run build');
      console.log('      • Consider lazy loading non-critical dependencies');
      console.log('      • Split Firebase SDKs into separate chunks');
    }
    
    if (firstLoadJS > PERFORMANCE_TARGETS.firstLoadJS) {
      console.log('   🚀 First load JS too large:');
      console.log('      • Move components to dynamic imports');
      console.log('      • Defer non-critical JavaScript');
      console.log('      • Use React.lazy() for heavy components');
    }
    
    console.log('   🎯 Crisis-critical optimizations:');
    console.log('      • Preload crisis resources (/crisis-resources)');
    console.log('      • Optimize Firebase Auth for mobile networks');
    console.log('      • Monitor Core Web Vitals in production');
    console.log('      • Test loading performance on 3G networks');
  }
}

// Run the analyzer
const analyzer = new BundleAnalyzer();
analyzer.analyze();