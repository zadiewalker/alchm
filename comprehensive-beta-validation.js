#!/usr/bin/env node

/**
 * ALCHM Comprehensive Beta Launch Validation Script
 * Tests all core features for beta readiness
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const REPORT_FILE = 'beta-validation-report.json';

class BetaValidator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      timestamp: new Date().toISOString(),
      testsSummary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      },
      coreFeatures: {},
      performanceMetrics: {},
      criticalIssues: [],
      recommendations: []
    };
  }

  async init() {
    console.log('🚀 Initializing ALCHM Beta Validation Suite...');
    
    this.browser = await puppeteer.launch({
      headless: false, // Set to false to watch tests
      devtools: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set mobile viewport for mobile testing
    await this.page.setViewport({ width: 375, height: 667 });
    
    // Monitor console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('❌ Console Error:', msg.text());
      }
    });
    
    console.log('✅ Browser initialized successfully');
  }

  async testLandingPage() {
    console.log('📱 Testing Landing Page...');
    const test = { name: 'Landing Page', status: 'pending', issues: [] };
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 10000 });
      
      // Check if page loads
      const title = await this.page.title();
      if (!title.includes('ALCHM')) {
        test.issues.push('Page title does not contain ALCHM branding');
      }
      
      // Check for auth buttons
      const signInButton = await this.page.$('a[href*="login"], button:contains("Sign"), a:contains("Login")');
      const signUpButton = await this.page.$('a[href*="signup"], button:contains("Sign"), a:contains("Sign")');
      
      if (!signInButton && !signUpButton) {
        test.issues.push('No authentication buttons found on landing page');
      }
      
      // Check for crisis support
      const crisisButton = await this.page.$('[href="tel:988"], button:contains("988"), [aria-label*="crisis"]');
      if (!crisisButton) {
        test.issues.push('Crisis support button not visible on landing page');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Landing page failed to load: ${error.message}`);
    }
    
    this.results.coreFeatures.landingPage = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Landing Page: ${test.status}`);
  }

  async testAuthentication() {
    console.log('🔐 Testing Authentication System...');
    const test = { name: 'Authentication', status: 'pending', issues: [] };
    
    try {
      // Test login page
      await this.page.goto(`${BASE_URL}/auth/login`, { waitUntil: 'networkidle0' });
      
      // Check for login form elements
      const emailInput = await this.page.$('input[type="email"], input[name="email"]');
      const passwordInput = await this.page.$('input[type="password"], input[name="password"]');
      const googleButton = await this.page.$('button:contains("Google"), [aria-label*="Google"]');
      
      if (!emailInput) test.issues.push('Email input field not found');
      if (!passwordInput) test.issues.push('Password input field not found');
      if (!googleButton) test.issues.push('Google OAuth button not found');
      
      // Test signup page
      await this.page.goto(`${BASE_URL}/auth/signup`, { waitUntil: 'networkidle0' });
      
      const signupForm = await this.page.$('form, input[type="email"]');
      if (!signupForm) {
        test.issues.push('Signup form not found');
      }
      
      // Test dashboard requires auth
      await this.page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
      const currentUrl = this.page.url();
      
      if (!currentUrl.includes('/auth/') && !currentUrl.includes('/login')) {
        test.issues.push('Dashboard accessible without authentication');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Authentication test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.authentication = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Authentication: ${test.status}`);
  }

  async testJournalFunctionality() {
    console.log('📝 Testing Journal Functionality...');
    const test = { name: 'Journal System', status: 'pending', issues: [] };
    
    try {
      // Test journal page loads
      await this.page.goto(`${BASE_URL}/journal`, { waitUntil: 'networkidle0' });
      
      // Should redirect to auth since not logged in
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/auth/') && !currentUrl.includes('/login')) {
        test.issues.push('Journal page accessible without authentication');
      }
      
      // Test journals list page
      await this.page.goto(`${BASE_URL}/journals`, { waitUntil: 'networkidle0' });
      
      // Should also redirect to auth
      const journalsUrl = this.page.url();
      if (!journalsUrl.includes('/auth/') && !journalsUrl.includes('/login')) {
        test.issues.push('Journals list page accessible without authentication');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Journal functionality test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.journalSystem = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Journal System: ${test.status}`);
  }

  async testPathwaysSystem() {
    console.log('🛤️ Testing Pathways System...');
    const test = { name: 'Pathways', status: 'pending', issues: [] };
    
    try {
      await this.page.goto(`${BASE_URL}/pathways`, { waitUntil: 'networkidle0' });
      
      // Should redirect to auth since not logged in
      const currentUrl = this.page.url();
      if (!currentUrl.includes('/auth/') && !currentUrl.includes('/login')) {
        test.issues.push('Pathways page accessible without authentication');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Pathways test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.pathways = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Pathways: ${test.status}`);
  }

  async testPricingPage() {
    console.log('💳 Testing Pricing Page...');
    const test = { name: 'Pricing & Subscriptions', status: 'pending', issues: [] };
    
    try {
      await this.page.goto(`${BASE_URL}/pricing`, { waitUntil: 'networkidle0' });
      
      // Check for pricing tiers
      const pricingCards = await this.page.$$('.pricing, [class*="pricing"], [class*="sanctuary"], .card');
      if (pricingCards.length === 0) {
        test.issues.push('No pricing cards found on pricing page');
      }
      
      // Check for payment buttons
      const paymentButtons = await this.page.$$('button:contains("Subscribe"), button:contains("Invest"), button:contains("Enter")');
      if (paymentButtons.length === 0) {
        test.issues.push('No payment buttons found');
      }
      
      // Check for crisis support on pricing page
      const crisisButton = await this.page.$('[href="tel:988"], button:contains("988")');
      if (!crisisButton) {
        test.issues.push('Crisis support not visible on pricing page');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Pricing page test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.pricing = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Pricing: ${test.status}`);
  }

  async testAPIsEndpoints() {
    console.log('🔗 Testing API Endpoints...');
    const test = { name: 'API Endpoints', status: 'pending', issues: [] };
    
    try {
      // Test health endpoint
      const healthResponse = await this.page.evaluate(async () => {
        try {
          const response = await fetch('/api/health/ping');
          return { status: response.status, ok: response.ok };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      if (!healthResponse.ok) {
        test.issues.push('Health API endpoint not responding');
      }
      
      // Test journal endpoints (should require auth)
      const journalResponse = await this.page.evaluate(async () => {
        try {
          const response = await fetch('/api/journal/save');
          return { status: response.status };
        } catch (error) {
          return { error: error.message };
        }
      });
      
      if (journalResponse.status !== 401) {
        test.issues.push('Journal API endpoint not properly protected');
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`API endpoints test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.apiEndpoints = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} API Endpoints: ${test.status}`);
  }

  async testMobileResponsiveness() {
    console.log('📱 Testing Mobile Responsiveness...');
    const test = { name: 'Mobile Responsiveness', status: 'pending', issues: [] };
    
    try {
      // Test different viewport sizes
      const viewports = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 414, height: 896, name: 'iPhone 11' }
      ];
      
      for (const viewport of viewports) {
        await this.page.setViewport(viewport);
        await this.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        
        // Check if navigation is accessible
        const mobileNav = await this.page.$('nav, header, [role="navigation"]');
        if (!mobileNav) {
          test.issues.push(`Navigation not found on ${viewport.name}`);
        }
        
        // Check if text is readable (not too small)
        const bodyText = await this.page.$eval('body', el => 
          window.getComputedStyle(el).fontSize
        );
        
        const fontSize = parseInt(bodyText);
        if (fontSize < 14) {
          test.issues.push(`Text too small on ${viewport.name}: ${fontSize}px`);
        }
      }
      
      test.status = test.issues.length === 0 ? 'passed' : 'failed';
      
    } catch (error) {
      test.status = 'failed';
      test.issues.push(`Mobile responsiveness test failed: ${error.message}`);
    }
    
    this.results.coreFeatures.mobileResponsiveness = test;
    console.log(`${test.status === 'passed' ? '✅' : '❌'} Mobile Responsiveness: ${test.status}`);
  }

  async testPerformance() {
    console.log('⚡ Testing Performance Metrics...');
    
    try {
      await this.page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      // Get performance metrics
      const performanceMetrics = await this.page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
        };
      });
      
      this.results.performanceMetrics = performanceMetrics;
      
      // Check for performance issues
      if (performanceMetrics.domContentLoaded > 3000) {
        this.results.criticalIssues.push('DOM Content Loaded > 3 seconds');
      }
      
      if (performanceMetrics.firstContentfulPaint > 2500) {
        this.results.criticalIssues.push('First Contentful Paint > 2.5 seconds');
      }
      
    } catch (error) {
      this.results.criticalIssues.push(`Performance test failed: ${error.message}`);
    }
    
    console.log('⚡ Performance testing completed');
  }

  async generateReport() {
    console.log('📊 Generating comprehensive report...');
    
    // Calculate test summary
    const tests = Object.values(this.results.coreFeatures);
    this.results.testsSummary.total = tests.length;
    this.results.testsSummary.passed = tests.filter(t => t.status === 'passed').length;
    this.results.testsSummary.failed = tests.filter(t => t.status === 'failed').length;
    
    // Generate recommendations
    if (this.results.testsSummary.failed > 0) {
      this.results.recommendations.push('Address failed core features before beta launch');
    }
    
    if (this.results.criticalIssues.length > 0) {
      this.results.recommendations.push('Optimize performance metrics before beta launch');
    }
    
    // Determine beta readiness
    const criticalFailures = tests.filter(t => 
      t.status === 'failed' && ['Authentication', 'Landing Page'].includes(t.name)
    );
    
    this.results.betaReadiness = {
      ready: criticalFailures.length === 0 && this.results.criticalIssues.length < 3,
      confidence: Math.max(0, 100 - (this.results.testsSummary.failed * 20) - (this.results.criticalIssues.length * 10)),
      blockers: criticalFailures.map(t => t.name)
    };
    
    // Save report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(this.results, null, 2));
    
    console.log('\\n' + '='.repeat(60));
    console.log('🎯 ALCHM BETA VALIDATION REPORT');
    console.log('='.repeat(60));
    console.log(`📊 Tests: ${this.results.testsSummary.passed}/${this.results.testsSummary.total} passed`);
    console.log(`🚀 Beta Ready: ${this.results.betaReadiness.ready ? 'YES' : 'NO'}`);
    console.log(`🎯 Confidence: ${this.results.betaReadiness.confidence}%`);
    
    if (this.results.criticalIssues.length > 0) {
      console.log('\\n❌ Critical Issues:');
      this.results.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('\\n💡 Recommendations:');
      this.results.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
    
    console.log(`\\n📄 Full report saved to: ${REPORT_FILE}`);
    console.log('='.repeat(60));
  }

  async runAllTests() {
    try {
      await this.init();
      
      await this.testLandingPage();
      await this.testAuthentication();
      await this.testJournalFunctionality();
      await this.testPathwaysSystem();
      await this.testPricingPage();
      await this.testAPIsEndpoints();
      await this.testMobileResponsiveness();
      await this.testPerformance();
      
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      this.results.criticalIssues.push(`Test suite error: ${error.message}`);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the validation suite
if (require.main === module) {
  const validator = new BetaValidator();
  validator.runAllTests().catch(console.error);
}

module.exports = BetaValidator;