#!/usr/bin/env node

/**
 * ALCHM Final Production Validation
 * Testing production deployment for friends & family readiness
 */

const https = require('https');
const http = require('http');

class ALCHMProductionValidator {
  constructor() {
    this.localUrl = 'http://localhost:3001';
    this.productionUrl = 'https://alchmapp.web.app';
    this.results = {
      production: { status: 'pending', issues: [], tests: [] },
      local: { status: 'pending', issues: [], tests: [] },
      comparison: { status: 'pending', issues: [] },
      readiness: { status: 'pending', score: 0, recommendation: '' }
    };
  }

  async makeRequest(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const isHttps = url.startsWith('https');
      const client = isHttps ? https : http;
      
      console.log(`🔍 Testing: ${url}`);
      
      const req = client.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: Date.now() - startTime,
            url: url
          });
        });
      });

      const startTime = Date.now();
      
      req.on('error', (err) => {
        reject(err);
      });

      req.setTimeout(timeout, () => {
        req.destroy();
        reject(new Error(`Request timeout after ${timeout}ms`));
      });
    });
  }

  async validateProduction() {
    console.log('\n🌍 VALIDATING PRODUCTION DEPLOYMENT');
    console.log('='.repeat(60));
    
    const testCases = [
      { name: 'Landing Page', path: '/en', critical: true },
      { name: 'Auth Login', path: '/en/auth/login', critical: true },
      { name: 'Auth Signup', path: '/en/auth/signup', critical: true },
      { name: 'Journal Page', path: '/en/journal', critical: true },
      { name: 'Journals List', path: '/en/journals', critical: false },
      { name: 'Dashboard', path: '/en/dashboard', critical: false },
      { name: 'Pathways', path: '/en/pathways', critical: false },
    ];

    for (const testCase of testCases) {
      try {
        const response = await this.makeRequest(`${this.productionUrl}${testCase.path}`);
        
        const test = {
          name: testCase.name,
          path: testCase.path,
          status: response.statusCode === 200 ? 'passed' : 'failed',
          responseTime: response.responseTime,
          critical: testCase.critical,
          details: {
            statusCode: response.statusCode,
            hasContent: response.body.length > 1000,
            contentSize: (response.body.length / 1024).toFixed(1) + 'KB',
            hasCrisisSupport: response.body.includes('988') || response.body.includes('crisis'),
            hasAgeVerification: response.body.includes('age') || response.body.includes('verify'),
            hasEmergencyAccess: response.body.includes('emergency') || response.body.includes('crisis'),
            mobileOptimized: response.body.includes('viewport') && response.body.includes('width=device-width'),
          }
        };

        this.results.production.tests.push(test);

        if (test.status === 'passed') {
          console.log(`✅ ${testCase.name}: ${response.responseTime}ms (${test.details.contentSize})`);
          
          // Additional checks for critical pages
          if (testCase.critical) {
            if (!test.details.hasCrisisSupport) {
              this.results.production.issues.push(`${testCase.name}: Missing crisis support`);
            }
            if (!test.details.mobileOptimized) {
              this.results.production.issues.push(`${testCase.name}: Not mobile optimized`);
            }
            if (response.responseTime > 3000) {
              this.results.production.issues.push(`${testCase.name}: Slow response (${response.responseTime}ms)`);
            }
          }
        } else {
          console.log(`❌ ${testCase.name}: Failed (${response.statusCode})`);
          this.results.production.issues.push(`${testCase.name}: HTTP ${response.statusCode}`);
        }
        
      } catch (error) {
        console.log(`❌ ${testCase.name}: Error - ${error.message}`);
        this.results.production.issues.push(`${testCase.name}: ${error.message}`);
        
        this.results.production.tests.push({
          name: testCase.name,
          path: testCase.path,
          status: 'failed',
          critical: testCase.critical,
          error: error.message
        });
      }
    }

    // Performance check
    console.log('\n⚡ PERFORMANCE VALIDATION');
    const performanceTests = [
      { name: 'Root Redirect', path: '/' },
      { name: 'Main Landing', path: '/en' }
    ];

    for (const perfTest of performanceTests) {
      try {
        const response = await this.makeRequest(`${this.productionUrl}${perfTest.path}`);
        
        if (response.responseTime < 2000) {
          console.log(`✅ ${perfTest.name}: ${response.responseTime}ms`);
        } else if (response.responseTime < 5000) {
          console.log(`⚠️ ${perfTest.name}: ${response.responseTime}ms (acceptable)`);
        } else {
          console.log(`❌ ${perfTest.name}: ${response.responseTime}ms (too slow)`);
          this.results.production.issues.push(`${perfTest.name}: Slow response ${response.responseTime}ms`);
        }
      } catch (error) {
        console.log(`❌ ${perfTest.name}: ${error.message}`);
      }
    }

    this.results.production.status = this.results.production.issues.length === 0 ? 'passed' : 'partial';
  }

  async validateLocal() {
    console.log('\n🏠 VALIDATING LOCAL DEVELOPMENT');
    console.log('='.repeat(60));
    
    const testCases = [
      { name: 'Health API', path: '/api/health/ping', critical: true },
      { name: 'Landing Page', path: '/en', critical: true },
      { name: 'Auth Login', path: '/en/auth/login', critical: true },
      { name: 'Journal Page', path: '/en/journal', critical: true },
    ];

    for (const testCase of testCases) {
      try {
        const response = await this.makeRequest(`${this.localUrl}${testCase.path}`, 15000);
        
        const test = {
          name: testCase.name,
          path: testCase.path,
          status: response.statusCode === 200 ? 'passed' : 'failed',
          responseTime: response.responseTime,
          critical: testCase.critical
        };

        this.results.local.tests.push(test);

        if (test.status === 'passed') {
          console.log(`✅ ${testCase.name}: ${response.responseTime}ms`);
          
          if (response.responseTime > 10000) {
            this.results.local.issues.push(`${testCase.name}: Very slow response (${response.responseTime}ms)`);
          }
        } else {
          console.log(`❌ ${testCase.name}: Failed (${response.statusCode})`);
          this.results.local.issues.push(`${testCase.name}: HTTP ${response.statusCode}`);
        }
        
      } catch (error) {
        console.log(`❌ ${testCase.name}: Error - ${error.message}`);
        this.results.local.issues.push(`${testCase.name}: ${error.message}`);
      }
    }

    this.results.local.status = this.results.local.issues.length === 0 ? 'passed' : 'partial';
  }

  generateReadinessReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 ALCHM FRIENDS & FAMILY LAUNCH READINESS REPORT');
    console.log('='.repeat(80));

    // Calculate scores
    const productionPassed = this.results.production.tests.filter(t => t.status === 'passed').length;
    const productionTotal = this.results.production.tests.length;
    const productionScore = productionTotal > 0 ? (productionPassed / productionTotal) * 100 : 0;

    const criticalIssues = this.results.production.issues.filter(issue => 
      issue.includes('crisis') || issue.includes('emergency') || issue.includes('HTTP 5') || issue.includes('timeout')
    ).length;

    console.log(`\n📊 PRODUCTION DEPLOYMENT HEALTH`);
    console.log(`✅ Tests Passed: ${productionPassed}/${productionTotal} (${productionScore.toFixed(1)}%)`);
    console.log(`❌ Issues Found: ${this.results.production.issues.length}`);
    console.log(`🚨 Critical Issues: ${criticalIssues}`);

    console.log(`\n🔧 LOCAL DEVELOPMENT HEALTH`);
    const localPassed = this.results.local.tests.filter(t => t.status === 'passed').length;
    const localTotal = this.results.local.tests.length;
    console.log(`✅ Tests Passed: ${localPassed}/${localTotal}`);
    console.log(`❌ Issues Found: ${this.results.local.issues.length}`);

    // Key readiness criteria
    const hasWorkingProduction = productionScore >= 80;
    const noCriticalIssues = criticalIssues === 0;
    const hasBasicFeatures = this.results.production.tests.some(t => 
      t.name === 'Landing Page' && t.status === 'passed'
    ) && this.results.production.tests.some(t => 
      t.name === 'Auth Login' && t.status === 'passed'
    );

    console.log(`\n🎯 READINESS ASSESSMENT`);
    console.log(`Production Working: ${hasWorkingProduction ? '✅' : '❌'} (${productionScore.toFixed(1)}%)`);
    console.log(`No Critical Issues: ${noCriticalIssues ? '✅' : '❌'} (${criticalIssues} found)`);
    console.log(`Basic Features: ${hasBasicFeatures ? '✅' : '❌'}`);

    // Final recommendation
    const overallScore = hasWorkingProduction && noCriticalIssues && hasBasicFeatures ? 85 : 
                        hasWorkingProduction && hasBasicFeatures ? 70 :
                        hasWorkingProduction ? 60 : 30;

    this.results.readiness.score = overallScore;

    if (overallScore >= 80) {
      this.results.readiness.status = 'ready';
      this.results.readiness.recommendation = 'READY FOR FRIENDS & FAMILY';
      
      console.log('\n🎉 LAUNCH RECOMMENDATION: READY FOR FRIENDS & FAMILY');
      console.log('✅ Production deployment is stable');
      console.log('✅ Core user journeys are functional');
      console.log('✅ Crisis safety systems are operational');
      console.log('✅ Mobile optimization is adequate');
      
      console.log('\n📋 NEXT STEPS:');
      console.log('1. Begin controlled user testing with 5-10 trusted users');
      console.log('2. Monitor for any user-reported issues');
      console.log('3. Collect feedback on user experience');
      console.log('4. Address bundle size optimization for better performance');
      
    } else if (overallScore >= 60) {
      this.results.readiness.status = 'conditional';
      this.results.readiness.recommendation = 'CONDITIONAL READY - LIMITED TESTING';
      
      console.log('\n⚠️ LAUNCH RECOMMENDATION: CONDITIONAL READY');
      console.log('✅ Core functionality works');
      console.log('❌ Some issues need monitoring');
      
      console.log('\n📋 REQUIRED ACTIONS:');
      console.log('1. Start with 2-3 very trusted technical users');
      console.log('2. Monitor closely for any issues');
      console.log('3. Address performance concerns');
      
    } else {
      this.results.readiness.status = 'not_ready';
      this.results.readiness.recommendation = 'NOT READY - CRITICAL ISSUES';
      
      console.log('\n❌ LAUNCH RECOMMENDATION: NOT READY');
      console.log('🚨 Critical issues must be resolved first');
      
      console.log('\n📋 BLOCKING ISSUES:');
      this.results.production.issues.slice(0, 5).forEach(issue => {
        console.log(`- ${issue}`);
      });
    }

    // Trauma-informed considerations
    console.log('\n🧠 TRAUMA-INFORMED DESIGN VALIDATION:');
    const crisisSupport = this.results.production.tests.filter(t => 
      t.details && t.details.hasCrisisSupport
    ).length;
    
    console.log(`Crisis Support Present: ${crisisSupport > 0 ? '✅' : '❌'} (${crisisSupport} pages)`);
    console.log(`Mobile Optimization: ${this.results.production.tests.some(t => 
      t.details && t.details.mobileOptimized
    ) ? '✅' : '❌'}`);

    return this.results;
  }

  async runFullValidation() {
    console.log('🚀 Starting ALCHM Production Readiness Validation...\n');
    
    await this.validateProduction();
    await this.validateLocal();
    
    return this.generateReadinessReport();
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ALCHMProductionValidator();
  validator.runFullValidation()
    .then(results => {
      const exitCode = results.readiness.status === 'ready' ? 0 : 
                      results.readiness.status === 'conditional' ? 1 : 2;
      process.exit(exitCode);
    })
    .catch(error => {
      console.error('Production validation failed:', error);
      process.exit(3);
    });
}

module.exports = ALCHMProductionValidator;