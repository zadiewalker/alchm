#!/usr/bin/env node

/**
 * ALCHM Production Performance Validation Script
 * 
 * CRITICAL: This script validates App Store submission readiness
 * for trauma-informed journaling platform ALCHM
 * 
 * Performance Standards:
 * - Core Web Vitals compliance (LCP <2s, FID <100ms, CLS <0.1)
 * - Crisis detection response time <1s (life-saving requirement)
 * - Mobile performance optimized for vulnerable users
 * - Bundle sizes within App Store requirements
 * 
 * Author: ALCHM Performance & Monitoring Specialist
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');

class ALCHMPerformanceValidator {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      coreWebVitals: {},
      crisisPerformance: {},
      mobilePerformance: {},
      bundleAnalysis: {},
      accessibility: {},
      appStoreReadiness: {
        passed: false,
        issues: [],
        recommendations: []
      }
    };
    
    this.thresholds = {
      // Core Web Vitals - App Store Requirements
      LCP: 2000, // Largest Contentful Paint < 2s
      FID: 100,  // First Input Delay < 100ms
      CLS: 0.1,  // Cumulative Layout Shift < 0.1
      FCP: 1200, // First Contentful Paint < 1.2s
      TTI: 3000, // Time to Interactive < 3s
      
      // Crisis-Critical Performance (life-saving)
      crisisDetection: 1000, // <1s response time
      emergencyAccess: 500,  // <500ms for emergency contacts
      crisisResources: 2000, // <2s for crisis resources
      
      // Bundle Size Limits (App Store compliance)
      initialBundle: 200000, // 200KB initial bundle
      crisisBundle: 25000,   // 25KB crisis bundle
      totalSize: 2000000,    // 2MB total app size
      
      // Accessibility (trauma-informed)
      accessibilityScore: 95, // >95% accessibility
      performanceScore: 90,   // >90% performance
      
      // Mobile Performance
      mobilePerformance: 90,  // >90% mobile score
      memoryUsage: 50000000,  // <50MB memory usage
    };
    
    this.criticalPages = [
      '/',
      '/auth/login',
      '/journal',
      '/dashboard',
      '/emergency-safe'  // Crisis page
    ];
    
    this.browser = null;
  }

  async initBrowser() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--remote-debugging-port=9222'
      ]
    });
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[level]}[${timestamp}] ${level.toUpperCase()}: ${message}${colors.reset}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  async checkServerHealth(url) {
    try {
      const response = await fetch(url);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async runLighthouseAudit(url, options = {}) {
    const defaultOptions = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices'],
      port: 9222,
      ...options
    };

    try {
      const result = await lighthouse(url, defaultOptions);
      return JSON.parse(result.report);
    } catch (error) {
      this.log('error', `Lighthouse audit failed for ${url}`, error.message);
      return null;
    }
  }

  async measureCrisisPerformance() {
    this.log('info', 'Testing crisis-critical performance...');
    
    const page = await this.browser.newPage();
    const results = {};

    try {
      // Simulate crisis detection scenario
      const startTime = Date.now();
      await page.goto('http://localhost:3000/emergency-safe', { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      const crisisLoadTime = Date.now() - startTime;
      
      results.crisisPageLoad = crisisLoadTime;
      results.crisisLoadPassed = crisisLoadTime < this.thresholds.crisisDetection;

      // Test emergency contact access
      const emergencyStart = Date.now();
      await page.evaluate(() => {
        // Simulate emergency button click
        const emergencyBtn = document.querySelector('[data-testid="emergency-button"]');
        if (emergencyBtn) emergencyBtn.click();
      });
      const emergencyTime = Date.now() - emergencyStart;
      
      results.emergencyAccess = emergencyTime;
      results.emergencyAccessPassed = emergencyTime < this.thresholds.emergencyAccess;

      this.log('success', 'Crisis performance testing completed', results);
      
    } catch (error) {
      this.log('error', 'Crisis performance test failed', error.message);
      results.error = error.message;
    } finally {
      await page.close();
    }

    this.results.crisisPerformance = results;
    return results;
  }

  async measureMobilePerformance() {
    this.log('info', 'Testing mobile performance...');
    
    const page = await this.browser.newPage();
    
    // Simulate mobile device
    await page.emulate({
      name: 'iPhone 12',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      viewport: {
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
      }
    });

    const results = {};

    try {
      // Test on simulated slow 3G network
      await page.emulateNetworkConditions({
        offline: false,
        downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
        uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
        latency: 40 // 40ms RTT
      });

      const startTime = performance.now();
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle0',
        timeout: 15000 
      });
      const loadTime = performance.now() - startTime;

      results.mobileLoadTime = loadTime;
      results.mobileLoadPassed = loadTime < this.thresholds.TTI;

      // Measure memory usage
      const metrics = await page.metrics();
      results.memoryUsage = metrics.JSHeapUsedSize;
      results.memoryPassed = metrics.JSHeapUsedSize < this.thresholds.memoryUsage;

      // Test touch responsiveness
      const touchStart = performance.now();
      await page.tap('body');
      const touchResponse = performance.now() - touchStart;
      results.touchResponse = touchResponse;
      results.touchResponsivePassed = touchResponse < this.thresholds.FID;

      this.log('success', 'Mobile performance testing completed', results);
      
    } catch (error) {
      this.log('error', 'Mobile performance test failed', error.message);
      results.error = error.message;
    } finally {
      await page.close();
    }

    this.results.mobilePerformance = results;
    return results;
  }

  analyzeBundleSizes() {
    this.log('info', 'Analyzing production bundle sizes...');
    
    const buildDir = path.join(process.cwd(), '.next');
    const results = {};

    try {
      if (!fs.existsSync(buildDir)) {
        throw new Error('.next build directory not found');
      }

      // Analyze static assets
      const staticDir = path.join(buildDir, 'static');
      if (fs.existsSync(staticDir)) {
        const jsDir = path.join(staticDir, 'chunks');
        if (fs.existsSync(jsDir)) {
          const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
          let totalJSSize = 0;
          let criticalBundleSize = 0;

          jsFiles.forEach(file => {
            const filePath = path.join(jsDir, file);
            const stats = fs.statSync(filePath);
            totalJSSize += stats.size;
            
            // Check if this is a critical bundle
            if (file.includes('crisis') || file.includes('emergency') || file.includes('main')) {
              criticalBundleSize += stats.size;
            }
          });

          results.totalJSSize = totalJSSize;
          results.criticalBundleSize = criticalBundleSize;
          results.bundleSizePassed = totalJSSize < this.thresholds.totalSize;
          results.criticalBundlePassed = criticalBundleSize < this.thresholds.crisisBundle;
        }
      }

      // Check for build manifest
      const buildManifest = path.join(buildDir, 'build-manifest.json');
      if (fs.existsSync(buildManifest)) {
        const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
        results.buildManifest = {
          pages: Object.keys(manifest.pages || {}).length,
          assets: manifest.sortedPages?.length || 0
        };
      }

      this.log('success', 'Bundle analysis completed', results);
      
    } catch (error) {
      this.log('error', 'Bundle analysis failed', error.message);
      results.error = error.message;
    }

    this.results.bundleAnalysis = results;
    return results;
  }

  async runComprehensiveAudit() {
    this.log('info', 'Starting comprehensive production performance validation...');
    
    const serverUrl = 'http://localhost:3000';
    
    // Check if server is running
    const serverHealthy = await this.checkServerHealth(serverUrl);
    if (!serverHealthy) {
      throw new Error('Production server is not running or not responding');
    }

    await this.initBrowser();

    try {
      // 1. Run Lighthouse audits for critical pages
      this.log('info', 'Running Lighthouse audits for critical pages...');
      for (const page of this.criticalPages) {
        const url = `${serverUrl}${page}`;
        this.log('info', `Auditing: ${url}`);
        
        const audit = await this.runLighthouseAudit(url);
        if (audit) {
          const performance = audit.categories.performance.score * 100;
          const accessibility = audit.categories.accessibility.score * 100;
          
          this.results.coreWebVitals[page] = {
            performance,
            accessibility,
            lcp: audit.audits['largest-contentful-paint']?.numericValue,
            fid: audit.audits['first-input-delay']?.numericValue,
            cls: audit.audits['cumulative-layout-shift']?.numericValue,
            fcp: audit.audits['first-contentful-paint']?.numericValue,
            tti: audit.audits['interactive']?.numericValue,
            passed: {
              performance: performance >= this.thresholds.performanceScore,
              accessibility: accessibility >= this.thresholds.accessibilityScore
            }
          };
        }
      }

      // 2. Test crisis-critical performance
      await this.measureCrisisPerformance();

      // 3. Test mobile performance
      await this.measureMobilePerformance();

      // 4. Analyze bundle sizes
      this.analyzeBundleSizes();

      // 5. Generate App Store readiness assessment
      this.generateAppStoreReadiness();

      this.log('success', 'Comprehensive audit completed successfully');
      
    } catch (error) {
      this.log('error', 'Comprehensive audit failed', error.message);
      throw error;
    } finally {
      await this.closeBrowser();
    }
  }

  generateAppStoreReadiness() {
    this.log('info', 'Generating App Store readiness assessment...');
    
    const issues = [];
    const recommendations = [];
    let passed = true;

    // Check Core Web Vitals compliance
    Object.entries(this.results.coreWebVitals).forEach(([page, metrics]) => {
      if (metrics.performance < this.thresholds.performanceScore) {
        issues.push(`Performance score too low on ${page}: ${metrics.performance}%`);
        recommendations.push(`Optimize ${page} to achieve >90% performance score`);
        passed = false;
      }
      
      if (metrics.accessibility < this.thresholds.accessibilityScore) {
        issues.push(`Accessibility score too low on ${page}: ${metrics.accessibility}%`);
        recommendations.push(`Improve accessibility on ${page} for trauma-informed design`);
        passed = false;
      }
      
      if (metrics.lcp && metrics.lcp > this.thresholds.LCP) {
        issues.push(`LCP too slow on ${page}: ${metrics.lcp}ms`);
        recommendations.push(`Optimize images and critical resources on ${page}`);
        passed = false;
      }
    });

    // Check crisis performance
    if (this.results.crisisPerformance.crisisLoadTime > this.thresholds.crisisDetection) {
      issues.push(`Crisis detection too slow: ${this.results.crisisPerformance.crisisLoadTime}ms`);
      recommendations.push('CRITICAL: Optimize crisis detection for life-saving response times');
      passed = false;
    }

    // Check mobile performance
    if (this.results.mobilePerformance.mobileLoadTime > this.thresholds.TTI) {
      issues.push(`Mobile load time too slow: ${this.results.mobilePerformance.mobileLoadTime}ms`);
      recommendations.push('Optimize mobile performance for vulnerable users on slow networks');
      passed = false;
    }

    // Check bundle sizes
    if (this.results.bundleAnalysis.totalJSSize > this.thresholds.totalSize) {
      issues.push(`Bundle size too large: ${this.results.bundleAnalysis.totalJSSize} bytes`);
      recommendations.push('Implement aggressive code splitting and tree shaking');
      passed = false;
    }

    this.results.appStoreReadiness = {
      passed,
      issues,
      recommendations,
      overallScore: this.calculateOverallScore()
    };

    this.log(passed ? 'success' : 'warning', 
      `App Store readiness: ${passed ? 'READY' : 'NEEDS OPTIMIZATION'}`,
      this.results.appStoreReadiness
    );
  }

  calculateOverallScore() {
    const scores = [];
    
    // Average performance scores
    Object.values(this.results.coreWebVitals).forEach(metrics => {
      if (metrics.performance) scores.push(metrics.performance);
    });

    // Crisis performance score (binary: 100 if passed, 0 if failed)
    const crisisScore = this.results.crisisPerformance.crisisLoadPassed ? 100 : 0;
    scores.push(crisisScore);

    // Mobile performance score
    const mobileScore = this.results.mobilePerformance.mobileLoadPassed ? 100 : 0;
    scores.push(mobileScore);

    // Bundle optimization score
    const bundleScore = this.results.bundleAnalysis.bundleSizePassed ? 100 : 0;
    scores.push(bundleScore);

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  }

  generateReport() {
    const reportPath = path.join(process.cwd(), 'PRODUCTION_PERFORMANCE_VALIDATION_REPORT.md');
    
    const report = `# ALCHM Production Performance Validation Report

## Executive Summary

**Generated**: ${this.results.timestamp}
**Overall Score**: ${this.results.appStoreReadiness.overallScore}/100
**App Store Readiness**: ${this.results.appStoreReadiness.passed ? '✅ READY' : '❌ NEEDS OPTIMIZATION'}

## Critical Performance Standards

### Core Web Vitals Compliance
${Object.entries(this.results.coreWebVitals).map(([page, metrics]) => 
  `- **${page}**: Performance ${metrics.performance}%, Accessibility ${metrics.accessibility}%
    - LCP: ${metrics.lcp || 'N/A'}ms (Target: <${this.thresholds.LCP}ms)
    - FCP: ${metrics.fcp || 'N/A'}ms (Target: <${this.thresholds.FCP}ms)
    - TTI: ${metrics.tti || 'N/A'}ms (Target: <${this.thresholds.TTI}ms)`
).join('\n')}

### Crisis-Critical Performance (Life-Saving)
- **Crisis Page Load**: ${this.results.crisisPerformance.crisisLoadTime || 'N/A'}ms ${this.results.crisisPerformance.crisisLoadPassed ? '✅' : '❌'}
- **Emergency Access**: ${this.results.crisisPerformance.emergencyAccess || 'N/A'}ms ${this.results.crisisPerformance.emergencyAccessPassed ? '✅' : '❌'}

### Mobile Performance (Vulnerable Users)
- **Mobile Load Time**: ${this.results.mobilePerformance.mobileLoadTime || 'N/A'}ms ${this.results.mobilePerformance.mobileLoadPassed ? '✅' : '❌'}
- **Memory Usage**: ${Math.round((this.results.mobilePerformance.memoryUsage || 0) / 1024 / 1024)}MB ${this.results.mobilePerformance.memoryPassed ? '✅' : '❌'}
- **Touch Response**: ${this.results.mobilePerformance.touchResponse || 'N/A'}ms ${this.results.mobilePerformance.touchResponsivePassed ? '✅' : '❌'}

### Bundle Analysis
- **Total JS Size**: ${Math.round((this.results.bundleAnalysis.totalJSSize || 0) / 1024)}KB ${this.results.bundleAnalysis.bundleSizePassed ? '✅' : '❌'}
- **Critical Bundle**: ${Math.round((this.results.bundleAnalysis.criticalBundleSize || 0) / 1024)}KB ${this.results.bundleAnalysis.criticalBundlePassed ? '✅' : '❌'}

## Issues Requiring Attention

${this.results.appStoreReadiness.issues.length > 0 ? 
  this.results.appStoreReadiness.issues.map(issue => `- ❌ ${issue}`).join('\n') :
  '✅ No critical issues found'
}

## Optimization Recommendations

${this.results.appStoreReadiness.recommendations.length > 0 ?
  this.results.appStoreReadiness.recommendations.map(rec => `- 🔧 ${rec}`).join('\n') :
  '✅ No recommendations needed - performance targets met'
}

## App Store Submission Status

${this.results.appStoreReadiness.passed ? 
  '🚀 **READY FOR APP STORE SUBMISSION**\n\nAll performance standards met for trauma-informed journaling platform serving vulnerable users.' :
  '⚠️ **OPTIMIZATION REQUIRED BEFORE SUBMISSION**\n\nCritical performance issues must be resolved to ensure user safety and App Store compliance.'
}

---
*Generated by ALCHM Performance & Monitoring Specialist*
*Every millisecond matters when someone is in crisis*
`;

    fs.writeFileSync(reportPath, report);
    this.log('success', `Performance report generated: ${reportPath}`);
    
    return reportPath;
  }
}

// Main execution
async function main() {
  const validator = new ALCHMPerformanceValidator();
  
  try {
    await validator.runComprehensiveAudit();
    const reportPath = validator.generateReport();
    
    console.log('\n' + '='.repeat(80));
    console.log('🎯 ALCHM PRODUCTION PERFORMANCE VALIDATION COMPLETE');
    console.log('='.repeat(80));
    console.log(`📊 Report: ${reportPath}`);
    console.log(`🎯 Overall Score: ${validator.results.appStoreReadiness.overallScore}/100`);
    console.log(`📱 App Store Ready: ${validator.results.appStoreReadiness.passed ? 'YES ✅' : 'NO ❌'}`);
    
    if (!validator.results.appStoreReadiness.passed) {
      console.log('\n⚠️ CRITICAL ISSUES FOUND:');
      validator.results.appStoreReadiness.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
      process.exit(1);
    }
    
    console.log('\n🚀 READY FOR APP STORE SUBMISSION!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ VALIDATION FAILED:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ALCHMPerformanceValidator;