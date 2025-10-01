#!/usr/bin/env node

/**
 * ALCHM Performance Validation Script
 * 
 * Validates performance improvements against App Store compliance targets:
 * - Time to Interactive: Target <5s (baseline: 25.6s)
 * - Largest Contentful Paint: Target <2s (baseline: 4.1s)
 * - First Input Delay: Target <100ms
 * - Cumulative Layout Shift: Target <0.1
 * - Total Blocking Time: Target <500ms (baseline: 5.1s)
 * - Performance Score: Target >90% (baseline: 66-67%)
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Performance targets for App Store compliance
const PERFORMANCE_TARGETS = {
  'largest-contentful-paint': 2000, // 2s
  'first-input-delay': 100,         // 100ms
  'cumulative-layout-shift': 0.1,   // 0.1
  'first-contentful-paint': 1200,   // 1.2s for crisis users
  'interactive': 5000,               // 5s TTI
  'total-blocking-time': 500,        // 500ms
  'performance': 90                  // 90% performance score
};

// Test configurations for different scenarios
const TEST_CONFIGS = {
  'mobile-low-end': {
    formFactor: 'mobile',
    throttling: {
      rttMs: 150,
      throughputKbps: 1600, // 3G
      requestLatencyMs: 150,
      downloadThroughputKbps: 1600,
      uploadThroughputKbps: 750,
      cpuSlowdownMultiplier: 4 // Low-end device
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    }
  },
  'mobile-standard': {
    formFactor: 'mobile',
    throttling: {
      rttMs: 40,
      throughputKbps: 10240, // 4G
      requestLatencyMs: 40,
      downloadThroughputKbps: 10240,
      uploadThroughputKbps: 2048,
      cpuSlowdownMultiplier: 2
    },
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false
    }
  },
  'desktop': {
    formFactor: 'desktop',
    throttling: {
      rttMs: 40,
      throughputKbps: 20480,
      requestLatencyMs: 40,
      downloadThroughputKbps: 20480,
      uploadThroughputKbps: 4096,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  }
};

// Pages to test
const TEST_PAGES = [
  { name: 'Landing Page', url: 'http://localhost:3000', critical: true },
  { name: 'Journal Page', url: 'http://localhost:3000/journal', critical: true },
  { name: 'Auth Page', url: 'http://localhost:3000/auth/login', critical: false },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard', critical: false }
];

class PerformanceValidator {
  constructor() {
    this.results = {};
    this.violations = [];
    this.chrome = null;
  }

  async initialize() {
    console.log('🚀 Initializing Performance Validation...\n');
    
    this.chrome = await chromeLauncher.launch({
      chromeFlags: [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });

    console.log(`✅ Chrome launched on port ${this.chrome.port}\n`);
  }

  async runTests() {
    console.log('📊 Running Performance Tests...\n');

    for (const config of Object.keys(TEST_CONFIGS)) {
      console.log(`\n🔍 Testing with ${config} configuration:\n`);
      
      for (const page of TEST_PAGES) {
        await this.testPage(page, config);
      }
    }
  }

  async testPage(page, configName) {
    const config = TEST_CONFIGS[configName];
    
    console.log(`  📱 Testing ${page.name}...`);

    try {
      const options = {
        port: this.chrome.port,
        onlyCategories: ['performance'],
        formFactor: config.formFactor,
        throttling: config.throttling,
        screenEmulation: config.screenEmulation,
        output: 'json'
      };

      const result = await lighthouse(page.url, options);
      const metrics = this.extractMetrics(result.lhr);
      
      this.results[`${page.name}_${configName}`] = metrics;
      
      // Check violations for critical pages
      if (page.critical) {
        this.checkViolations(page.name, configName, metrics);
      }

      this.logResults(page.name, configName, metrics);

    } catch (error) {
      console.error(`  ❌ Failed to test ${page.name}: ${error.message}`);
      this.violations.push(`${page.name} (${configName}): Test failed - ${error.message}`);
    }
  }

  extractMetrics(lhr) {
    const audits = lhr.audits;
    
    return {
      performanceScore: Math.round(lhr.categories.performance.score * 100),
      lcp: audits['largest-contentful-paint']?.numericValue || null,
      fid: audits['max-potential-fid']?.numericValue || null, // Approximation
      cls: audits['cumulative-layout-shift']?.numericValue || null,
      fcp: audits['first-contentful-paint']?.numericValue || null,
      tti: audits['interactive']?.numericValue || null,
      tbt: audits['total-blocking-time']?.numericValue || null,
      si: audits['speed-index']?.numericValue || null,
      
      // Bundle metrics
      bundleSize: this.calculateBundleSize(audits),
      unusedCode: audits['unused-javascript']?.details?.overallSavingsBytes || 0,
      
      // Mobile specific
      tapTargets: audits['tap-targets']?.score || null,
      
      // Opportunities
      opportunities: this.extractOpportunities(audits)
    };
  }

  calculateBundleSize(audits) {
    const resourceSummary = audits['resource-summary'];
    if (resourceSummary && resourceSummary.details && resourceSummary.details.items) {
      const jsItems = resourceSummary.details.items.filter(item => item.resourceType === 'script');
      return jsItems.reduce((total, item) => total + (item.transferSize || 0), 0);
    }
    return 0;
  }

  extractOpportunities(audits) {
    const opportunityAudits = [
      'unused-css-rules',
      'unused-javascript', 
      'modern-image-formats',
      'next-gen-images',
      'efficient-animated-content',
      'render-blocking-resources'
    ];

    return opportunityAudits
      .map(auditId => {
        const audit = audits[auditId];
        if (audit && audit.details && audit.details.overallSavingsMs > 100) {
          return {
            audit: auditId,
            savings: Math.round(audit.details.overallSavingsMs),
            description: audit.description
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  checkViolations(pageName, configName, metrics) {
    Object.entries(PERFORMANCE_TARGETS).forEach(([metric, target]) => {
      let value = metrics[metric === 'performance' ? 'performanceScore' : metric.replace(/-/g, '')];
      
      // Handle special cases
      if (metric === 'largest-contentful-paint') value = metrics.lcp;
      if (metric === 'first-input-delay') value = metrics.fid;
      if (metric === 'cumulative-layout-shift') value = metrics.cls;
      if (metric === 'first-contentful-paint') value = metrics.fcp;
      if (metric === 'interactive') value = metrics.tti;
      if (metric === 'total-blocking-time') value = metrics.tbt;

      if (value !== null && value !== undefined) {
        const isViolation = metric === 'performance' ? value < target : value > target;
        
        if (isViolation) {
          const severity = this.getViolationSeverity(metric, value, target);
          this.violations.push({
            page: pageName,
            config: configName,
            metric,
            value,
            target,
            severity,
            message: `${metric}: ${this.formatValue(metric, value)} (target: ${this.formatTarget(metric, target)})`
          });
        }
      }
    });
  }

  getViolationSeverity(metric, value, target) {
    const criticalMetrics = ['interactive', 'largest-contentful-paint', 'performance'];
    const ratio = metric === 'performance' ? target / value : value / target;
    
    if (criticalMetrics.includes(metric) || ratio > 2) return 'CRITICAL';
    if (ratio > 1.5) return 'HIGH';
    if (ratio > 1.2) return 'MEDIUM';
    return 'LOW';
  }

  formatValue(metric, value) {
    if (metric === 'performance') return `${value}%`;
    if (metric === 'cumulative-layout-shift') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  }

  formatTarget(metric, target) {
    if (metric === 'performance') return `${target}%`;
    if (metric === 'cumulative-layout-shift') return target.toString();
    return `${target}ms`;
  }

  logResults(pageName, configName, metrics) {
    const status = this.getPageStatus(metrics);
    console.log(`    ${status} Performance Score: ${metrics.performanceScore}%`);
    console.log(`       LCP: ${Math.round(metrics.lcp || 0)}ms | FCP: ${Math.round(metrics.fcp || 0)}ms | TTI: ${Math.round(metrics.tti || 0)}ms`);
    console.log(`       CLS: ${(metrics.cls || 0).toFixed(3)} | TBT: ${Math.round(metrics.tbt || 0)}ms`);
    
    if (metrics.bundleSize > 0) {
      console.log(`       Bundle: ${Math.round(metrics.bundleSize / 1024)}KB`);
    }
  }

  getPageStatus(metrics) {
    if (metrics.performanceScore >= 90) return '✅';
    if (metrics.performanceScore >= 75) return '⚠️';
    return '❌';
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ALCHM PERFORMANCE VALIDATION REPORT');
    console.log('='.repeat(60));

    // Summary
    console.log('\n📈 PERFORMANCE SUMMARY:\n');
    
    const criticalPages = ['Landing Page_mobile-low-end', 'Journal Page_mobile-low-end'];
    criticalPages.forEach(pageKey => {
      if (this.results[pageKey]) {
        const metrics = this.results[pageKey];
        const status = this.getPageStatus(metrics);
        console.log(`${status} ${pageKey.replace('_', ' - ')}: ${metrics.performanceScore}% (TTI: ${Math.round(metrics.tti || 0)}ms, LCP: ${Math.round(metrics.lcp || 0)}ms)`);
      }
    });

    // Violations
    if (this.violations.length > 0) {
      console.log('\n🚨 PERFORMANCE VIOLATIONS:\n');
      
      const criticalViolations = this.violations.filter(v => v.severity === 'CRITICAL');
      const highViolations = this.violations.filter(v => v.severity === 'HIGH');
      const otherViolations = this.violations.filter(v => !['CRITICAL', 'HIGH'].includes(v.severity));

      if (criticalViolations.length > 0) {
        console.log('❌ CRITICAL VIOLATIONS (BLOCKING APP STORE SUBMISSION):');
        criticalViolations.forEach(v => {
          console.log(`   ${v.page} (${v.config}): ${v.message}`);
        });
        console.log('');
      }

      if (highViolations.length > 0) {
        console.log('⚠️  HIGH PRIORITY VIOLATIONS:');
        highViolations.forEach(v => {
          console.log(`   ${v.page} (${v.config}): ${v.message}`);
        });
        console.log('');
      }

      if (otherViolations.length > 0) {
        console.log('📋 OTHER VIOLATIONS:');
        otherViolations.forEach(v => {
          console.log(`   ${v.page} (${v.config}): ${v.message}`);
        });
      }
    } else {
      console.log('\n✅ NO PERFORMANCE VIOLATIONS - APP STORE READY!\n');
    }

    // Recommendations
    this.generateRecommendations();

    // App Store readiness
    this.assessAppStoreReadiness();
  }

  generateRecommendations() {
    console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:\n');

    const allOpportunities = {};
    Object.values(this.results).forEach(result => {
      result.opportunities.forEach(opp => {
        if (!allOpportunities[opp.audit]) {
          allOpportunities[opp.audit] = { total: 0, count: 0, description: opp.description };
        }
        allOpportunities[opp.audit].total += opp.savings;
        allOpportunities[opp.audit].count += 1;
      });
    });

    const sortedOpportunities = Object.entries(allOpportunities)
      .map(([audit, data]) => ({
        audit,
        avgSavings: data.total / data.count,
        totalSavings: data.total,
        description: data.description
      }))
      .sort((a, b) => b.totalSavings - a.totalSavings)
      .slice(0, 5);

    sortedOpportunities.forEach((opp, i) => {
      console.log(`${i + 1}. ${opp.audit}: ${Math.round(opp.avgSavings)}ms average savings`);
      console.log(`   ${opp.description}`);
    });

    if (sortedOpportunities.length === 0) {
      console.log('✅ No major optimization opportunities identified!');
    }
  }

  assessAppStoreReadiness() {
    console.log('\n🏪 APP STORE READINESS ASSESSMENT:\n');

    const criticalViolations = this.violations.filter(v => v.severity === 'CRITICAL');
    const landingPageMobile = this.results['Landing Page_mobile-low-end'];
    const journalPageMobile = this.results['Journal Page_mobile-low-end'];

    let readinessScore = 100;
    const issues = [];

    if (criticalViolations.length > 0) {
      readinessScore -= 40;
      issues.push(`${criticalViolations.length} critical performance violations`);
    }

    if (landingPageMobile && landingPageMobile.performanceScore < 90) {
      readinessScore -= 20;
      issues.push(`Landing page performance score: ${landingPageMobile.performanceScore}%`);
    }

    if (journalPageMobile && journalPageMobile.performanceScore < 85) {
      readinessScore -= 20;
      issues.push(`Journal page performance score: ${journalPageMobile.performanceScore}%`);
    }

    if (readinessScore >= 90) {
      console.log('✅ READY FOR APP STORE SUBMISSION');
      console.log(`   Readiness Score: ${readinessScore}%`);
    } else if (readinessScore >= 70) {
      console.log('⚠️  NEEDS MINOR IMPROVEMENTS');
      console.log(`   Readiness Score: ${readinessScore}%`);
      issues.forEach(issue => console.log(`   - ${issue}`));
    } else {
      console.log('❌ NOT READY FOR APP STORE SUBMISSION');
      console.log(`   Readiness Score: ${readinessScore}%`);
      console.log('   Critical issues must be resolved:');
      issues.forEach(issue => console.log(`   - ${issue}`));
    }
  }

  async saveReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      results: this.results,
      violations: this.violations,
      summary: {
        totalTests: Object.keys(this.results).length,
        violationsCount: this.violations.length,
        criticalViolations: this.violations.filter(v => v.severity === 'CRITICAL').length
      }
    };

    const reportPath = path.join(__dirname, '..', 'performance-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
  }

  async cleanup() {
    if (this.chrome) {
      await this.chrome.kill();
      console.log('\n🧹 Cleanup completed');
    }
  }
}

// Main execution
async function main() {
  const validator = new PerformanceValidator();
  
  try {
    await validator.initialize();
    await validator.runTests();
    validator.generateReport();
    await validator.saveReport();
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await validator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = PerformanceValidator;