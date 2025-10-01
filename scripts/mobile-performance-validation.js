#!/usr/bin/env node

/**
 * Mobile Performance Validation Script for ALCHM
 * Tests performance across different device classes and network conditions
 * Validates trauma-informed UX performance requirements
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

// Device profiles for testing
const DEVICE_PROFILES = {
  'crisis-mobile-slow': {
    name: 'Crisis Mobile (Slow 3G)',
    formFactor: 'mobile',
    throttling: {
      rttMs: 300,
      throughputKbps: 400,
      cpuSlowdownMultiplier: 4
    },
    description: 'Worst-case mobile scenario for crisis users'
  },
  'crisis-mobile-fast': {
    name: 'Crisis Mobile (Fast 3G)',
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1600,
      cpuSlowdownMultiplier: 2
    },
    description: 'Typical mobile scenario for crisis users'
  },
  'budget-android': {
    name: 'Budget Android (Regular 3G)',
    formFactor: 'mobile',
    throttling: {
      rttMs: 300,
      throughputKbps: 780,
      cpuSlowdownMultiplier: 6
    },
    description: 'Low-end Android device with limited resources'
  },
  'modern-mobile': {
    name: 'Modern Mobile (4G)',
    formFactor: 'mobile',
    throttling: {
      rttMs: 40,
      throughputKbps: 9000,
      cpuSlowdownMultiplier: 1
    },
    description: 'High-end mobile device with good connectivity'
  },
  'tablet': {
    name: 'Tablet (WiFi)',
    formFactor: 'mobile',
    throttling: {
      rttMs: 20,
      throughputKbps: 15000,
      cpuSlowdownMultiplier: 1
    },
    description: 'Tablet device with WiFi connection'
  }
};

// Crisis-critical pages to test
const CRISIS_PAGES = [
  {
    url: 'http://localhost:3001/',
    name: 'Homepage',
    category: 'CORE_PAGES',
    crisisImportance: 'high'
  },
  {
    url: 'http://localhost:3001/auth/login',
    name: 'Login',
    category: 'CORE_PAGES',
    crisisImportance: 'high'
  },
  {
    url: 'http://localhost:3001/journal',
    name: 'Journal',
    category: 'CORE_PAGES',
    crisisImportance: 'critical'
  },
  {
    url: 'http://localhost:3001/dashboard',
    name: 'Dashboard',
    category: 'CORE_PAGES',
    crisisImportance: 'medium'
  },
  {
    url: 'http://localhost:3001/crisis-support',
    name: 'Crisis Support',
    category: 'CRISIS_PAGES',
    crisisImportance: 'critical'
  },
  {
    url: 'http://localhost:3001/pricing',
    name: 'Pricing',
    category: 'SECONDARY_PAGES',
    crisisImportance: 'low'
  }
];

// Trauma-informed performance thresholds
const TRAUMA_INFORMED_THRESHOLDS = {
  CRISIS_PAGES: {
    lcp: 1200,    // Largest Contentful Paint - must be instant for crisis
    fid: 50,      // First Input Delay - immediate response required
    cls: 0.05,    // Cumulative Layout Shift - stability crucial
    fcp: 800,     // First Contentful Paint - show content immediately
    tti: 2000,    // Time to Interactive - interactive quickly
    psi: 90       // Performance Score - must be excellent
  },
  CORE_PAGES: {
    lcp: 2000,
    fid: 100,
    cls: 0.1,
    fcp: 1200,
    tti: 3000,
    psi: 85
  },
  SECONDARY_PAGES: {
    lcp: 2500,
    fid: 300,
    cls: 0.25,
    fcp: 1800,
    tti: 5000,
    psi: 75
  }
};

class MobilePerformanceValidator {
  constructor() {
    this.results = [];
    this.chrome = null;
  }

  async initialize() {
    console.log('🚀 Initializing Mobile Performance Validation...\n');
    
    // Launch Chrome
    this.chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
    
    console.log(`Chrome launched on port ${this.chrome.port}\n`);
  }

  async validateAllDevices() {
    console.log('📱 Starting comprehensive mobile performance validation...\n');
    console.log('=' .repeat(80));
    
    for (const [deviceKey, deviceConfig] of Object.entries(DEVICE_PROFILES)) {
      console.log(`\n🔍 Testing Device Profile: ${deviceConfig.name}`);
      console.log(`📊 Description: ${deviceConfig.description}`);
      console.log(`🌐 Network: ${deviceConfig.throttling.throughputKbps}kbps, ${deviceConfig.throttling.rttMs}ms RTT`);
      console.log(`⚡ CPU: ${deviceConfig.throttling.cpuSlowdownMultiplier}x slowdown`);
      console.log('-'.repeat(60));
      
      for (const page of CRISIS_PAGES) {
        console.log(`\n📄 Testing: ${page.name} (${page.crisisImportance} importance)`);
        
        const result = await this.testPageOnDevice(page, deviceConfig, deviceKey);
        this.results.push(result);
        
        // Show immediate results for critical pages
        if (page.crisisImportance === 'critical') {
          this.printCriticalResults(result);
        }
      }
    }
  }

  async testPageOnDevice(page, deviceConfig, deviceKey) {
    const startTime = Date.now();
    
    try {
      // Configure Lighthouse for mobile testing
      const config = {
        extends: 'lighthouse:default',
        settings: {
          formFactor: deviceConfig.formFactor,
          throttling: deviceConfig.throttling,
          screenEmulation: {
            mobile: deviceConfig.formFactor === 'mobile',
            width: deviceConfig.formFactor === 'mobile' ? 412 : 1024,
            height: deviceConfig.formFactor === 'mobile' ? 732 : 768,
            deviceScaleFactor: deviceConfig.formFactor === 'mobile' ? 2.625 : 1,
          },
          emulatedUserAgent: deviceConfig.formFactor === 'mobile' 
            ? 'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36'
            : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36'
        }
      };
      
      // Run Lighthouse audit
      const runnerResult = await lighthouse(page.url, {
        port: this.chrome.port,
        disableStorageReset: false
      }, config);
      
      const lhr = runnerResult.lhr;
      const testDuration = Date.now() - startTime;
      
      // Extract key metrics
      const metrics = {
        lcp: lhr.audits['largest-contentful-paint'].numericValue,
        fid: lhr.audits['max-potential-fid'].numericValue,
        cls: lhr.audits['cumulative-layout-shift'].numericValue,
        fcp: lhr.audits['first-contentful-paint'].numericValue,
        tti: lhr.audits['interactive'].numericValue,
        psi: lhr.categories.performance.score * 100,
        totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
        speedIndex: lhr.audits['speed-index'].numericValue
      };
      
      // Assess against trauma-informed thresholds
      const thresholds = TRAUMA_INFORMED_THRESHOLDS[page.category];
      const assessment = this.assessMetrics(metrics, thresholds, page.crisisImportance);
      
      const result = {
        page: page.name,
        url: page.url,
        category: page.category,
        crisisImportance: page.crisisImportance,
        device: deviceConfig.name,
        deviceKey,
        metrics,
        thresholds,
        assessment,
        testDuration,
        timestamp: new Date().toISOString(),
        passed: assessment.overallStatus === 'PASS'
      };
      
      // Show progress
      const statusIcon = result.passed ? '✅' : '❌';
      const scoreColor = metrics.psi >= 90 ? '🟢' : metrics.psi >= 75 ? '🟡' : '🔴';
      console.log(`   ${statusIcon} Score: ${scoreColor} ${metrics.psi.toFixed(0)}/100 | LCP: ${(metrics.lcp/1000).toFixed(1)}s | FID: ${metrics.fid.toFixed(0)}ms`);
      
      return result;
      
    } catch (error) {
      console.error(`❌ Error testing ${page.name} on ${deviceConfig.name}:`, error.message);
      
      return {
        page: page.name,
        url: page.url,
        device: deviceConfig.name,
        deviceKey,
        error: error.message,
        passed: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  assessMetrics(metrics, thresholds, crisisImportance) {
    const assessments = {};
    let failedMetrics = [];
    let criticalFailures = [];
    
    // Assess each metric against thresholds
    for (const [metric, value] of Object.entries(metrics)) {
      if (thresholds[metric]) {
        const threshold = thresholds[metric];
        const passed = value <= threshold;
        const overagePercentage = passed ? 0 : ((value - threshold) / threshold) * 100;
        
        assessments[metric] = {
          value,
          threshold,
          passed,
          overagePercentage: overagePercentage.toFixed(1),
          severity: this.getMetricSeverity(metric, overagePercentage, crisisImportance)
        };
        
        if (!passed) {
          failedMetrics.push(metric);
          
          if (assessments[metric].severity === 'CRITICAL') {
            criticalFailures.push(metric);
          }
        }
      }
    }
    
    // Overall assessment
    let overallStatus = 'PASS';
    let overallSeverity = 'LOW';
    
    if (criticalFailures.length > 0) {
      overallStatus = 'FAIL';
      overallSeverity = 'CRITICAL';
    } else if (failedMetrics.length > 0) {
      overallStatus = 'WARN';
      overallSeverity = 'HIGH';
    }
    
    // Crisis users have stricter requirements
    if (crisisImportance === 'critical' && failedMetrics.length > 0) {
      overallStatus = 'FAIL';
      overallSeverity = 'CRITICAL';
    }
    
    return {
      overallStatus,
      overallSeverity,
      failedMetrics,
      criticalFailures,
      assessments,
      recommendations: this.generateRecommendations(failedMetrics, crisisImportance)
    };
  }

  getMetricSeverity(metric, overagePercentage, crisisImportance) {
    // Crisis pages have stricter severity thresholds
    const isCriticalPage = crisisImportance === 'critical';
    
    if (['lcp', 'fid', 'cls'].includes(metric)) {
      if (isCriticalPage) {
        if (overagePercentage > 25) return 'CRITICAL';
        if (overagePercentage > 10) return 'HIGH';
        return 'MEDIUM';
      } else {
        if (overagePercentage > 100) return 'CRITICAL';
        if (overagePercentage > 50) return 'HIGH';
        return 'MEDIUM';
      }
    }
    
    if (overagePercentage > 150) return 'CRITICAL';
    if (overagePercentage > 75) return 'HIGH';
    if (overagePercentage > 25) return 'MEDIUM';
    return 'LOW';
  }

  generateRecommendations(failedMetrics, crisisImportance) {
    const recommendations = [];
    
    if (crisisImportance === 'critical') {
      recommendations.push('🚨 CRITICAL: This page serves users in crisis - performance must be optimized immediately');
    }
    
    if (failedMetrics.includes('lcp')) {
      recommendations.push('⚡ Optimize Largest Contentful Paint: preload critical resources, optimize images');
    }
    
    if (failedMetrics.includes('fid')) {
      recommendations.push('📱 Improve First Input Delay: reduce JavaScript execution time, use requestIdleCallback');
    }
    
    if (failedMetrics.includes('cls')) {
      recommendations.push('🎯 Fix Cumulative Layout Shift: set image dimensions, avoid dynamic content insertion');
    }
    
    if (failedMetrics.includes('fcp')) {
      recommendations.push('🔄 Optimize First Contentful Paint: inline critical CSS, preload key resources');
    }
    
    if (failedMetrics.includes('tti')) {
      recommendations.push('⚙️ Improve Time to Interactive: enable code splitting, optimize third-party code');
    }
    
    if (failedMetrics.includes('psi')) {
      recommendations.push('📊 Improve overall Performance Score: address all Core Web Vitals issues');
    }
    
    return recommendations;
  }

  printCriticalResults(result) {
    if (result.crisisImportance === 'critical') {
      console.log('\n🚨 CRITICAL PAGE ANALYSIS:');
      console.log(`   Status: ${result.passed ? '✅ PASS' : '❌ FAIL'}`);
      
      if (!result.passed) {
        console.log('   Failed Metrics:');
        result.assessment.failedMetrics.forEach(metric => {
          const assessment = result.assessment.assessments[metric];
          console.log(`   • ${metric.toUpperCase()}: ${assessment.value.toFixed(0)}${metric === 'psi' ? '/100' : 'ms'} (${assessment.overagePercentage}% over threshold)`);
        });
      }
    }
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📋 MOBILE PERFORMANCE VALIDATION REPORT');
    console.log('='.repeat(80));
    
    // Calculate overall statistics
    const stats = this.calculateStatistics();
    
    // Print executive summary
    this.printExecutiveSummary(stats);
    
    // Print device-specific results
    this.printDeviceResults();
    
    // Print crisis page analysis
    this.printCrisisPageAnalysis();
    
    // Print recommendations
    this.printRecommendations();
    
    // Save detailed report
    await this.saveDetailedReport();
    
    console.log('\n✅ Mobile performance validation complete!');
    console.log(`📁 Detailed report saved to: mobile-performance-report.json`);
  }

  calculateStatistics() {
    const validResults = this.results.filter(r => !r.error);
    
    const stats = {
      totalTests: this.results.length,
      validTests: validResults.length,
      passedTests: validResults.filter(r => r.passed).length,
      failedTests: validResults.filter(r => !r.passed).length,
      criticalPageResults: validResults.filter(r => r.crisisImportance === 'critical'),
      averageScoreByDevice: {},
      worstPerformers: [],
      bestPerformers: []
    };
    
    // Calculate average scores by device
    Object.keys(DEVICE_PROFILES).forEach(deviceKey => {
      const deviceResults = validResults.filter(r => r.deviceKey === deviceKey);
      if (deviceResults.length > 0) {
        const avgScore = deviceResults.reduce((sum, r) => sum + (r.metrics?.psi || 0), 0) / deviceResults.length;
        stats.averageScoreByDevice[deviceKey] = avgScore.toFixed(1);
      }
    });
    
    // Find worst and best performers
    stats.worstPerformers = validResults
      .sort((a, b) => (a.metrics?.psi || 0) - (b.metrics?.psi || 0))
      .slice(0, 5);
      
    stats.bestPerformers = validResults
      .sort((a, b) => (b.metrics?.psi || 0) - (a.metrics?.psi || 0))
      .slice(0, 5);
    
    return stats;
  }

  printExecutiveSummary(stats) {
    console.log('\n📊 EXECUTIVE SUMMARY');
    console.log('-'.repeat(40));
    console.log(`Total Tests Run: ${stats.totalTests}`);
    console.log(`Passed: ${stats.passedTests} | Failed: ${stats.failedTests}`);
    console.log(`Pass Rate: ${((stats.passedTests / stats.validTests) * 100).toFixed(1)}%`);
    
    console.log('\n🚨 CRISIS PAGE STATUS:');
    const criticalPassed = stats.criticalPageResults.filter(r => r.passed).length;
    const criticalTotal = stats.criticalPageResults.length;
    const criticalPassRate = ((criticalPassed / criticalTotal) * 100).toFixed(1);
    
    console.log(`Crisis Pages Passed: ${criticalPassed}/${criticalTotal} (${criticalPassRate}%)`);
    
    if (criticalPassRate < 100) {
      console.log('⚠️  WARNING: Crisis pages failing performance requirements!');
    } else {
      console.log('✅ All crisis pages meeting performance requirements');
    }
  }

  printDeviceResults() {
    console.log('\n📱 DEVICE PERFORMANCE SUMMARY');
    console.log('-'.repeat(40));
    
    Object.entries(this.calculateStatistics().averageScoreByDevice).forEach(([deviceKey, avgScore]) => {
      const deviceName = DEVICE_PROFILES[deviceKey].name;
      const scoreIcon = avgScore >= 90 ? '🟢' : avgScore >= 75 ? '🟡' : '🔴';
      console.log(`${scoreIcon} ${deviceName}: ${avgScore}/100 average`);
    });
  }

  printCrisisPageAnalysis() {
    console.log('\n🚨 CRISIS PAGE DETAILED ANALYSIS');
    console.log('-'.repeat(40));
    
    const crisisResults = this.results.filter(r => r.crisisImportance === 'critical' && !r.error);
    
    crisisResults.forEach(result => {
      const statusIcon = result.passed ? '✅' : '❌';
      console.log(`\n${statusIcon} ${result.page} on ${result.device}`);
      
      if (result.metrics) {
        console.log(`   Score: ${result.metrics.psi.toFixed(0)}/100`);
        console.log(`   LCP: ${(result.metrics.lcp/1000).toFixed(1)}s | FID: ${result.metrics.fid.toFixed(0)}ms | CLS: ${result.metrics.cls.toFixed(3)}`);
        
        if (!result.passed) {
          console.log('   Issues:');
          result.assessment.failedMetrics.forEach(metric => {
            const assessment = result.assessment.assessments[metric];
            console.log(`   • ${metric.toUpperCase()}: ${assessment.overagePercentage}% over threshold (${assessment.severity})`);
          });
        }
      }
    });
  }

  printRecommendations() {
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    const allRecommendations = [];
    const failedResults = this.results.filter(r => !r.passed && !r.error);
    
    failedResults.forEach(result => {
      if (result.assessment && result.assessment.recommendations) {
        allRecommendations.push(...result.assessment.recommendations);
      }
    });
    
    // Remove duplicates and prioritize
    const uniqueRecommendations = [...new Set(allRecommendations)];
    uniqueRecommendations.sort((a, b) => {
      if (a.includes('CRITICAL')) return -1;
      if (b.includes('CRITICAL')) return 1;
      return 0;
    });
    
    uniqueRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  async saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateStatistics(),
      deviceProfiles: DEVICE_PROFILES,
      traumaInformedThresholds: TRAUMA_INFORMED_THRESHOLDS,
      detailedResults: this.results,
      recommendations: this.generateOverallRecommendations()
    };
    
    await fs.writeFile(
      'mobile-performance-report.json',
      JSON.stringify(report, null, 2)
    );
  }

  generateOverallRecommendations() {
    const recs = [];
    
    const failedCrisisPages = this.results.filter(r => 
      r.crisisImportance === 'critical' && !r.passed && !r.error
    );
    
    if (failedCrisisPages.length > 0) {
      recs.push({
        priority: 'CRITICAL',
        action: 'Optimize crisis pages immediately - user lives may depend on performance',
        impact: 'User safety and crisis response capability'
      });
    }
    
    const budgetDeviceFailures = this.results.filter(r => 
      r.deviceKey === 'budget-android' && !r.passed && !r.error
    );
    
    if (budgetDeviceFailures.length > 0) {
      recs.push({
        priority: 'HIGH',
        action: 'Improve performance for low-end devices',
        impact: 'Accessibility for users with limited resources'
      });
    }
    
    return recs;
  }

  async cleanup() {
    if (this.chrome) {
      await this.chrome.kill();
    }
  }
}

// Main execution
async function main() {
  const validator = new MobilePerformanceValidator();
  
  try {
    await validator.initialize();
    await validator.validateAllDevices();
    await validator.generateReport();
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await validator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { MobilePerformanceValidator };