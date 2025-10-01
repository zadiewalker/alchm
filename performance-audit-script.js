#!/usr/bin/env node

/**
 * ALCHM PERFORMANCE AUDIT SCRIPT
 * 
 * Comprehensive performance analysis for mental health app beta launch
 * CRITICAL: User safety depends on performance - every millisecond matters
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs').promises;
const path = require('path');

// Critical performance targets for mental health app
const PERFORMANCE_TARGETS = {
  // Core Web Vitals
  firstContentfulPaint: 1.2, // seconds
  largestContentfulPaint: 2.0, // seconds
  firstInputDelay: 0.05, // seconds (50ms)
  cumulativeLayoutShift: 0.05,
  timeToInteractive: 3.0, // seconds
  
  // Mental health specific
  crisisResourceLoad: 1.0, // Crisis resources must load in 1 second
  authenticationFlow: 2.0, // Auth must complete in 2 seconds
  emergencyPageLoad: 0.8, // Emergency page critical
  
  // Bundle size targets
  mainBundleSize: 150000, // 150KB main bundle
  pageSpecificSize: 50000, // 50KB per page
  crisisPageSize: 30000, // 30KB emergency page
};

// Test pages (critical user journeys)
const TEST_PAGES = [
  {
    url: 'http://localhost:3000/',
    name: 'Landing Page',
    critical: true,
    description: 'First impression - must load fast'
  },
  {
    url: 'http://localhost:3000/auth/login',
    name: 'Login Page',
    critical: true,
    description: 'Authentication entry point'
  },
  {
    url: 'http://localhost:3000/emergency',
    name: 'Emergency Page',
    critical: true,
    description: 'Crisis user access - CRITICAL PATH'
  },
  {
    url: 'http://localhost:3000/en/dashboard',
    name: 'Dashboard',
    critical: true,
    description: 'Main user interface'
  },
  {
    url: 'http://localhost:3000/en/journal',
    name: 'Journal Page',
    critical: true,
    description: 'Core journaling functionality'
  }
];

class ALCHMPerformanceAuditor {
  constructor() {
    this.results = {};
    this.startTime = Date.now();
    this.criticalIssues = [];
    this.readinessScore = 0;
  }

  async runAudit() {
    console.log('🔍 ALCHM Performance Audit Starting...');
    console.log('⚡ Mental Health App - Zero Tolerance for Performance Issues');
    console.log('');

    try {
      // Launch Chrome
      console.log('🚀 Launching Chrome...');
      const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});

      // Test each critical page
      for (const page of TEST_PAGES) {
        console.log(`\n📊 Testing: ${page.name} - ${page.description}`);
        await this.testPage(chrome.port, page);
      }

      await chrome.kill();

      // Generate report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Audit failed:', error);
      this.criticalIssues.push({
        type: 'AUDIT_FAILURE',
        message: error.message,
        impact: 'CRITICAL'
      });
    }
  }

  async testPage(port, pageConfig) {
    try {
      const options = {
        logLevel: 'error',
        output: 'json',
        onlyCategories: ['performance'],
        port: port,
      };

      const runnerResult = await lighthouse(pageConfig.url, options);
      const report = runnerResult.lhr;

      // Extract key metrics
      const metrics = {
        url: pageConfig.url,
        name: pageConfig.name,
        critical: pageConfig.critical,
        description: pageConfig.description,
        
        // Core Web Vitals
        firstContentfulPaint: this.getMetric(report, 'first-contentful-paint'),
        largestContentfulPaint: this.getMetric(report, 'largest-contentful-paint'),
        timeToInteractive: this.getMetric(report, 'interactive'),
        cumulativeLayoutShift: this.getMetric(report, 'cumulative-layout-shift'),
        
        // Performance score
        performanceScore: report.categories.performance.score * 100,
        
        // Resource analysis
        totalBundleSize: this.getTotalBundleSize(report),
        mainThreadBlockingTime: this.getMetric(report, 'total-blocking-time'),
        
        // Timestamp
        timestamp: new Date().toISOString()
      };

      // Analyze against targets
      this.analyzeMetrics(metrics, pageConfig);
      
      this.results[pageConfig.name] = metrics;

      console.log(`   ✅ Performance Score: ${metrics.performanceScore}/100`);
      console.log(`   ⚡ FCP: ${metrics.firstContentfulPaint}s (target: ${PERFORMANCE_TARGETS.firstContentfulPaint}s)`);
      console.log(`   🎯 LCP: ${metrics.largestContentfulPaint}s (target: ${PERFORMANCE_TARGETS.largestContentfulPaint}s)`);
      console.log(`   📦 Bundle: ${(metrics.totalBundleSize / 1024).toFixed(1)}KB`);

    } catch (error) {
      console.error(`❌ Failed to test ${pageConfig.name}:`, error.message);
      this.criticalIssues.push({
        type: 'PAGE_TEST_FAILURE',
        page: pageConfig.name,
        message: error.message,
        impact: pageConfig.critical ? 'CRITICAL' : 'HIGH'
      });
    }
  }

  getMetric(report, id) {
    const audit = report.audits[id];
    if (!audit) return null;
    
    if (audit.numericValue !== undefined) {
      return audit.numericValue / 1000; // Convert to seconds
    }
    
    return audit.score;
  }

  getTotalBundleSize(report) {
    const resourceSummary = report.audits['resource-summary'];
    if (resourceSummary && resourceSummary.details && resourceSummary.details.items) {
      const scriptItem = resourceSummary.details.items.find(item => item.resourceType === 'script');
      return scriptItem ? scriptItem.transferSize : 0;
    }
    return 0;
  }

  analyzeMetrics(metrics, pageConfig) {
    // Check critical performance thresholds
    const issues = [];

    // Core Web Vitals checks
    if (metrics.firstContentfulPaint > PERFORMANCE_TARGETS.firstContentfulPaint) {
      issues.push({
        type: 'FCP_SLOW',
        value: metrics.firstContentfulPaint,
        target: PERFORMANCE_TARGETS.firstContentfulPaint,
        impact: 'HIGH'
      });
    }

    if (metrics.largestContentfulPaint > PERFORMANCE_TARGETS.largestContentfulPaint) {
      issues.push({
        type: 'LCP_SLOW',
        value: metrics.largestContentfulPaint,
        target: PERFORMANCE_TARGETS.largestContentfulPaint,
        impact: 'HIGH'
      });
    }

    if (metrics.timeToInteractive > PERFORMANCE_TARGETS.timeToInteractive) {
      issues.push({
        type: 'TTI_SLOW',
        value: metrics.timeToInteractive,
        target: PERFORMANCE_TARGETS.timeToInteractive,
        impact: 'MEDIUM'
      });
    }

    // Crisis-specific checks
    if (pageConfig.name === 'Emergency Page' && metrics.firstContentfulPaint > PERFORMANCE_TARGETS.crisisResourceLoad) {
      issues.push({
        type: 'CRISIS_PAGE_SLOW',
        value: metrics.firstContentfulPaint,
        target: PERFORMANCE_TARGETS.crisisResourceLoad,
        impact: 'CRITICAL'
      });
    }

    // Bundle size checks
    if (metrics.totalBundleSize > PERFORMANCE_TARGETS.mainBundleSize) {
      issues.push({
        type: 'BUNDLE_TOO_LARGE',
        value: metrics.totalBundleSize,
        target: PERFORMANCE_TARGETS.mainBundleSize,
        impact: 'MEDIUM'
      });
    }

    // Performance score check
    if (metrics.performanceScore < 90) {
      issues.push({
        type: 'LOW_PERFORMANCE_SCORE',
        value: metrics.performanceScore,
        target: 90,
        impact: pageConfig.critical ? 'HIGH' : 'MEDIUM'
      });
    }

    // Add issues to critical list
    issues.forEach(issue => {
      this.criticalIssues.push({
        ...issue,
        page: pageConfig.name,
        description: pageConfig.description
      });
    });
  }

  calculateReadinessScore() {
    const totalPages = Object.keys(this.results).length;
    let totalScore = 0;
    let criticalFailures = 0;

    Object.values(this.results).forEach(metrics => {
      totalScore += metrics.performanceScore || 0;
      
      // Check for critical failures
      if (metrics.name === 'Emergency Page' && metrics.performanceScore < 80) {
        criticalFailures++;
      }
      if (metrics.performanceScore < 70) {
        criticalFailures++;
      }
    });

    const avgScore = totalPages > 0 ? totalScore / totalPages : 0;
    
    // Penalize for critical issues
    const criticalPenalty = this.criticalIssues.filter(i => i.impact === 'CRITICAL').length * 20;
    const highPenalty = this.criticalIssues.filter(i => i.impact === 'HIGH').length * 10;
    
    this.readinessScore = Math.max(0, Math.min(10, 
      (avgScore / 10) - (criticalPenalty / 10) - (highPenalty / 10) - (criticalFailures * 2)
    ));
  }

  async generateReport() {
    this.calculateReadinessScore();
    
    const auditDuration = Date.now() - this.startTime;
    
    const report = {
      summary: {
        auditTimestamp: new Date().toISOString(),
        auditDuration: auditDuration,
        readinessScore: this.readinessScore,
        betaLaunchRecommendation: this.readinessScore >= 7 ? 'GO' : 'NO-GO',
        totalCriticalIssues: this.criticalIssues.filter(i => i.impact === 'CRITICAL').length,
        totalHighIssues: this.criticalIssues.filter(i => i.impact === 'HIGH').length,
        testedPages: Object.keys(this.results).length
      },
      results: this.results,
      criticalIssues: this.criticalIssues,
      targets: PERFORMANCE_TARGETS,
      recommendations: this.generateRecommendations()
    };

    // Save detailed report
    await fs.writeFile(
      path.join(__dirname, 'alchm-performance-audit-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate human-readable summary
    await this.generateSummaryReport(report);
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 ALCHM PERFORMANCE AUDIT COMPLETE');
    console.log('='.repeat(60));
    console.log(`🎯 Beta Launch Readiness Score: ${this.readinessScore.toFixed(1)}/10`);
    console.log(`🚦 Recommendation: ${report.summary.betaLaunchRecommendation}`);
    console.log(`⚠️  Critical Issues: ${report.summary.totalCriticalIssues}`);
    console.log(`📈 High Priority Issues: ${report.summary.totalHighIssues}`);
    console.log('');
    
    if (report.summary.betaLaunchRecommendation === 'NO-GO') {
      console.log('❌ NOT READY FOR BETA LAUNCH');
      console.log('Critical performance issues must be resolved before launch');
    } else {
      console.log('✅ READY FOR BETA LAUNCH');
      console.log('Performance meets mental health app requirements');
    }
    
    console.log('');
    console.log('📋 Report saved to: alchm-performance-audit-report.json');
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Analyze critical issues for recommendations
    const bundleIssues = this.criticalIssues.filter(i => i.type === 'BUNDLE_TOO_LARGE');
    if (bundleIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'Optimize Bundle Size',
        description: 'JavaScript bundles exceed targets for mental health app',
        actions: [
          'Implement dynamic imports for non-critical features',
          'Split vendor bundles more aggressively', 
          'Remove unused dependencies',
          'Enable tree shaking optimization'
        ]
      });
    }

    const crisisIssues = this.criticalIssues.filter(i => i.type === 'CRISIS_PAGE_SLOW');
    if (crisisIssues.length > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        title: 'Emergency Page Performance',
        description: 'Crisis resources loading too slowly - user safety risk',
        actions: [
          'Inline critical CSS for emergency page',
          'Preload emergency page resources',
          'Implement service worker for offline access',
          'Remove all non-essential JavaScript from emergency page'
        ]
      });
    }

    const fcpIssues = this.criticalIssues.filter(i => i.type === 'FCP_SLOW');
    if (fcpIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        title: 'First Contentful Paint Optimization',
        description: 'Users wait too long to see content',
        actions: [
          'Optimize critical rendering path',
          'Implement server-side rendering for critical pages',
          'Minimize main thread blocking time',
          'Optimize web font loading strategy'
        ]
      });
    }

    return recommendations;
  }

  async generateSummaryReport(report) {
    const summary = `
# ALCHM Performance Audit Summary

**Audit Date:** ${report.summary.auditTimestamp}
**Readiness Score:** ${this.readinessScore.toFixed(1)}/10
**Beta Launch Recommendation:** ${report.summary.betaLaunchRecommendation}

## Critical Issues (${report.summary.totalCriticalIssues})
${this.criticalIssues
  .filter(i => i.impact === 'CRITICAL')
  .map(issue => `- **${issue.type}** on ${issue.page}: ${issue.message || 'Performance below target'}`)
  .join('\n')}

## High Priority Issues (${report.summary.totalHighIssues})
${this.criticalIssues
  .filter(i => i.impact === 'HIGH')
  .map(issue => `- **${issue.type}** on ${issue.page}: ${issue.message || 'Performance below target'}`)
  .join('\n')}

## Page Performance Summary
${Object.values(this.results)
  .map(page => `- **${page.name}**: ${page.performanceScore}/100 (FCP: ${page.firstContentfulPaint}s, LCP: ${page.largestContentfulPaint}s)`)
  .join('\n')}

## Recommendations
${report.recommendations
  .map(rec => `
### ${rec.title} (${rec.priority})
${rec.description}

Actions:
${rec.actions.map(action => `- ${action}`).join('\n')}
`).join('\n')}

---
*This audit prioritizes user safety and mental health considerations.*
`;

    await fs.writeFile(
      path.join(__dirname, 'ALCHM_PERFORMANCE_AUDIT_SUMMARY.md'),
      summary
    );
  }
}

// Run the audit
async function main() {
  const auditor = new ALCHMPerformanceAuditor();
  await auditor.runAudit();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ALCHMPerformanceAuditor;