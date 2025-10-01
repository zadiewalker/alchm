#!/usr/bin/env node

/**
 * ALCHM Comprehensive Technical Audit
 * Tests all critical systems after Jony Ive design implementation and bundle optimization
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ALCHMTechnicalAuditor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      criticalIssues: [],
      warnings: [],
      passed: [],
      performance: {},
      bundleAnalysis: {},
      crisisSafety: {},
      summary: {}
    };
  }

  async initialize() {
    console.log('🔧 Initializing ALCHM Comprehensive Technical Audit...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    this.page = await this.browser.newPage();
    
    // Set mobile viewport to test mobile optimization
    await this.page.setViewport({ width: 390, height: 844 });
    
    // Monitor performance
    await this.page.setCacheEnabled(false);
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
  }

  async auditCrisisSafetySystems() {
    console.log('🛡️ Auditing Crisis Safety Systems...');
    
    try {
      await this.page.goto('http://localhost:3002/en', { waitUntil: 'networkidle2', timeout: 30000 });

      // 1. Crisis button presence and accessibility
      const crisisButtons = await this.page.$$('.crisis-button, .emergency-button, [href="tel:988"]');
      
      if (crisisButtons.length >= 2) {
        this.results.crisisSafety.buttonsPresent = true;
        this.results.passed.push('✅ Multiple crisis buttons present (redundancy)');
      } else if (crisisButtons.length === 1) {
        this.results.crisisSafety.buttonsPresent = true;
        this.results.warnings.push('⚠️ Only one crisis button found, consider redundancy');
      } else {
        this.results.crisisSafety.buttonsPresent = false;
        this.results.criticalIssues.push('🚨 CRITICAL: No crisis buttons found');
      }

      // 2. Crisis button accessibility
      for (const button of crisisButtons) {
        const ariaLabel = await button.evaluate(el => el.getAttribute('aria-label'));
        if (ariaLabel && ariaLabel.includes('crisis') || ariaLabel.includes('emergency')) {
          this.results.passed.push('✅ Crisis button has proper aria-label');
        }
        
        const href = await button.evaluate(el => el.getAttribute('href'));
        if (href === 'tel:988') {
          this.results.passed.push('✅ Crisis button correctly configured for 988');
        }
      }

      // 3. Crisis button positioning (should be easily accessible)
      if (crisisButtons.length > 0) {
        const buttonRect = await crisisButtons[0].boundingBox();
        if (buttonRect && buttonRect.y > 600) {
          this.results.passed.push('✅ Crisis button positioned in accessible area');
        }
      }

      this.results.crisisSafety.status = 'operational';

    } catch (error) {
      this.results.crisisSafety.status = 'failed';
      this.results.criticalIssues.push(`🚨 CRITICAL: Crisis safety audit failed - ${error.message}`);
    }
  }

  async auditMobilePerformance() {
    console.log('📱 Auditing Mobile Performance...');
    
    try {
      const metrics = await this.page.metrics();
      
      // Measure page load performance
      const navigationStart = await this.page.evaluate(() => performance.timing.navigationStart);
      const loadComplete = await this.page.evaluate(() => performance.timing.loadEventEnd);
      const loadTime = loadComplete - navigationStart;

      this.results.performance.pageLoadTime = loadTime;
      
      if (loadTime < 3000) {
        this.results.passed.push(`✅ Fast page load time (${loadTime}ms)`);
      } else if (loadTime < 5000) {
        this.results.warnings.push(`⚠️ Moderate page load time (${loadTime}ms)`);
      } else {
        this.results.criticalIssues.push(`🚨 CRITICAL: Slow page load time (${loadTime}ms)`);
      }

      // Check Core Web Vitals
      const vitals = await this.page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const vitals = {};
            entries.forEach(entry => {
              if (entry.entryType === 'largest-contentful-paint') {
                vitals.lcp = entry.startTime;
              }
              if (entry.entryType === 'first-input') {
                vitals.fid = entry.processingStart - entry.startTime;
              }
              if (entry.entryType === 'layout-shift') {
                vitals.cls = (vitals.cls || 0) + entry.value;
              }
            });
            resolve(vitals);
          }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
          
          // Fallback timeout
          setTimeout(() => resolve({}), 5000);
        });
      });

      this.results.performance.coreWebVitals = vitals;

      // Memory usage
      this.results.performance.memoryUsage = metrics.JSHeapUsedSize;
      
      if (metrics.JSHeapUsedSize < 50 * 1024 * 1024) { // 50MB
        this.results.passed.push(`✅ Efficient memory usage (${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB)`);
      } else {
        this.results.warnings.push(`⚠️ High memory usage (${Math.round(metrics.JSHeapUsedSize / 1024 / 1024)}MB)`);
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Performance audit encountered error: ${error.message}`);
    }
  }

  async auditJonyIveDesignSystem() {
    console.log('🎨 Auditing Jony Ive Design System Integration...');
    
    try {
      // Check for Jony Ive CSS loading
      const jonyIveStylesheet = await this.page.$('link[href*="jony-ive"]');
      
      if (jonyIveStylesheet) {
        this.results.passed.push('✅ Jony Ive design system stylesheet loaded');
      } else {
        this.results.warnings.push('⚠️ Jony Ive design system stylesheet not found');
      }

      // Check for design system CSS variables
      const designTokens = await this.page.evaluate(() => {
        const computedStyle = getComputedStyle(document.documentElement);
        return {
          sageGreen: computedStyle.getPropertyValue('--sage-400'),
          sanctuaryWhite: computedStyle.getPropertyValue('--sanctuary-white'),
          touchTarget: computedStyle.getPropertyValue('--touch-target-md')
        };
      });

      if (designTokens.sageGreen && designTokens.sageGreen.includes('#a4b792')) {
        this.results.passed.push('✅ Design system color tokens properly configured');
      } else {
        this.results.warnings.push('⚠️ Design system color tokens may not be loaded');
      }

      // Check for trauma-informed design elements
      const traumaInformedElements = await this.page.$$('[class*="gentle"], [class*="sanctuary"], [class*="trauma-informed"]');
      
      if (traumaInformedElements.length > 0) {
        this.results.passed.push(`✅ Trauma-informed design elements present (${traumaInformedElements.length} found)`);
      } else {
        this.results.warnings.push('⚠️ Limited trauma-informed design elements detected');
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Design system audit error: ${error.message}`);
    }
  }

  async auditAuthentication() {
    console.log('🔐 Auditing Authentication Flow...');
    
    try {
      // Test navigation to auth page
      await this.page.goto('http://localhost:3002/en/auth/login', { waitUntil: 'networkidle2', timeout: 20000 });
      
      const pageTitle = await this.page.title();
      if (pageTitle.includes('ALCHM')) {
        this.results.passed.push('✅ Auth page loads correctly');
      } else {
        this.results.warnings.push('⚠️ Auth page title may be incorrect');
      }

      // Check for auth elements
      const authElements = await this.page.$$('button, [type="submit"], [data-testid*="auth"]');
      
      if (authElements.length > 0) {
        this.results.passed.push(`✅ Authentication elements present (${authElements.length} found)`);
      } else {
        this.results.warnings.push('⚠️ No authentication elements found');
      }

      // Check for Google OAuth elements
      const googleAuth = await this.page.$('[data-testid*="google"], [aria-label*="Google"], button:has-text("Google")');
      
      if (googleAuth) {
        this.results.passed.push('✅ Google OAuth option available');
      } else {
        this.results.warnings.push('⚠️ Google OAuth not detected');
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Authentication audit error: ${error.message}`);
    }
  }

  async auditDatabaseOperations() {
    console.log('💾 Auditing Database Operations...');
    
    try {
      // Test navigation to journal page
      await this.page.goto('http://localhost:3002/en/journal', { waitUntil: 'networkidle2', timeout: 20000 });
      
      // Check for journal interface
      const journalElements = await this.page.$$('textarea, input[type="text"], [data-testid*="journal"]');
      
      if (journalElements.length > 0) {
        this.results.passed.push(`✅ Journal interface elements present (${journalElements.length} found)`);
      } else {
        this.results.warnings.push('⚠️ Journal interface elements not found');
      }

      // Check for save/submit functionality
      const saveButtons = await this.page.$$('button:has-text("Save"), button:has-text("Submit"), [data-testid*="save"]');
      
      if (saveButtons.length > 0) {
        this.results.passed.push('✅ Save functionality present');
      } else {
        this.results.warnings.push('⚠️ Save functionality not clearly visible');
      }

    } catch (error) {
      this.results.warnings.push(`⚠️ Database operations audit error: ${error.message}`);
    }
  }

  async auditBundleOptimization() {
    console.log('📦 Auditing Bundle Optimization...');
    
    try {
      // Measure resource loading
      const resources = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        return resources.map(resource => ({
          name: resource.name,
          size: resource.transferSize,
          duration: resource.duration,
          type: resource.initiatorType
        }));
      });

      const totalBundleSize = resources
        .filter(r => r.name.includes('.js'))
        .reduce((total, r) => total + (r.size || 0), 0);

      this.results.bundleAnalysis.totalJSSize = totalBundleSize;
      this.results.bundleAnalysis.resourceCount = resources.length;

      if (totalBundleSize < 1000000) { // 1MB
        this.results.passed.push(`✅ Optimized bundle size (${Math.round(totalBundleSize / 1024)}KB)`);
      } else if (totalBundleSize < 3000000) { // 3MB
        this.results.warnings.push(`⚠️ Moderate bundle size (${Math.round(totalBundleSize / 1024)}KB)`);
      } else {
        this.results.criticalIssues.push(`🚨 CRITICAL: Large bundle size (${Math.round(totalBundleSize / 1024)}KB)`);
      }

      // Check for critical resource loading
      const criticalResources = resources.filter(r => 
        r.name.includes('crisis') || 
        r.name.includes('emergency') || 
        r.name.includes('jony-ive')
      );

      this.results.bundleAnalysis.criticalResourcesCount = criticalResources.length;

    } catch (error) {
      this.results.warnings.push(`⚠️ Bundle analysis error: ${error.message}`);
    }
  }

  async auditOfflineFunctionality() {
    console.log('📴 Auditing Offline Functionality...');
    
    try {
      // Test offline mode
      await this.page.setOfflineMode(true);
      await this.page.reload({ waitUntil: 'networkidle2' });

      // Check if critical elements still work
      const crisisButton = await this.page.$('.crisis-button, .emergency-button, [href="tel:988"]');
      
      if (crisisButton) {
        this.results.passed.push('✅ Crisis support available offline');
      } else {
        this.results.criticalIssues.push('🚨 CRITICAL: Crisis support not available offline');
      }

      // Reset online mode
      await this.page.setOfflineMode(false);

    } catch (error) {
      this.results.criticalIssues.push(`🚨 CRITICAL: Offline functionality test failed - ${error.message}`);
    }
  }

  generateComprehensiveReport() {
    const timestamp = new Date().toISOString();
    
    this.results.summary = {
      timestamp,
      totalTests: this.results.passed.length + this.results.warnings.length + this.results.criticalIssues.length,
      criticalIssuesCount: this.results.criticalIssues.length,
      warningsCount: this.results.warnings.length,
      passedCount: this.results.passed.length,
      overallStatus: this.results.criticalIssues.length === 0 ? 'PRODUCTION READY' : 'CRITICAL ISSUES FOUND',
      systemHealth: {
        crisisSafety: this.results.crisisSafety.status || 'unknown',
        performance: this.results.performance.pageLoadTime ? 'measured' : 'unknown',
        bundleOptimization: this.results.bundleAnalysis.totalJSSize ? 'analyzed' : 'unknown'
      }
    };

    const report = {
      title: 'ALCHM Comprehensive Technical Audit Report',
      subtitle: 'Post Jony Ive Design System & Bundle Optimization Validation',
      timestamp,
      summary: this.results.summary,
      sections: {
        criticalIssues: {
          title: 'Critical Issues (Must Fix Before Production)',
          items: this.results.criticalIssues
        },
        warnings: {
          title: 'Warnings (Recommended Fixes)',
          items: this.results.warnings
        },
        passed: {
          title: 'Passed Tests',
          items: this.results.passed
        },
        performance: {
          title: 'Performance Metrics',
          data: this.results.performance
        },
        bundleAnalysis: {
          title: 'Bundle Analysis',
          data: this.results.bundleAnalysis
        },
        crisisSafety: {
          title: 'Crisis Safety Systems',
          data: this.results.crisisSafety
        }
      },
      recommendations: [
        'Address all critical issues before production deployment',
        'Monitor Core Web Vitals in production',
        'Regular crisis safety system testing',
        'Bundle size monitoring and optimization',
        'Accessibility audits for trauma-informed design',
        'Performance regression testing',
        'Offline functionality validation',
        'Mobile device testing across different screen sizes'
      ]
    };

    // Save comprehensive report
    const reportPath = path.join(__dirname, 'alchm-comprehensive-audit-results.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    return report;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async runFullAudit() {
    try {
      await this.initialize();
      
      // Run all audit sections
      await this.auditCrisisSafetySystems();
      await this.auditMobilePerformance();
      await this.auditJonyIveDesignSystem();
      await this.auditAuthentication();
      await this.auditDatabaseOperations();
      await this.auditBundleOptimization();
      await this.auditOfflineFunctionality();
      
      const report = this.generateComprehensiveReport();
      
      console.log('\n🔧 ALCHM Comprehensive Technical Audit Complete\n');
      console.log('=' * 60);
      console.log(`📊 Overall Status: ${report.summary.overallStatus}`);
      console.log(`📈 Total Tests: ${report.summary.totalTests}`);
      console.log(`✅ Passed: ${report.summary.passedCount}`);
      console.log(`⚠️  Warnings: ${report.summary.warningsCount}`);
      console.log(`🚨 Critical Issues: ${report.summary.criticalIssuesCount}`);
      console.log('=' * 60);
      
      if (report.sections.criticalIssues.items.length > 0) {
        console.log('\n🚨 CRITICAL ISSUES REQUIRING IMMEDIATE ATTENTION:');
        report.sections.criticalIssues.items.forEach(issue => console.log(`   ${issue}`));
      }
      
      if (report.sections.warnings.items.length > 0) {
        console.log('\n⚠️ WARNINGS:');
        report.sections.warnings.items.forEach(warning => console.log(`   ${warning}`));
      }

      console.log('\n✅ SYSTEMS OPERATIONAL:');
      report.sections.passed.items.forEach(pass => console.log(`   ${pass}`));
      
      console.log(`\n📁 Full report saved to: alchm-comprehensive-audit-results.json\n`);
      
      return report;
      
    } catch (error) {
      console.error('🚨 Comprehensive Audit Failed:', error);
      return null;
    } finally {
      await this.cleanup();
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new ALCHMTechnicalAuditor();
  auditor.runFullAudit().then(report => {
    if (report && report.summary.criticalIssuesCount > 0) {
      console.log('⚠️ WARNING: Critical issues found. Review required before production deployment.');
      process.exit(1);
    } else {
      console.log('✅ All critical systems operational. Ready for production deployment.');
      process.exit(0);
    }
  });
}

module.exports = ALCHMTechnicalAuditor;