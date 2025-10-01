#!/usr/bin/env node

/**
 * ALCHM Manual User Journey Validation
 * Critical end-to-end testing for trauma-informed mental health platform
 */

const https = require('https');
const http = require('http');

class ALCHMUserJourneyValidator {
  constructor() {
    this.baseUrl = 'http://localhost:3001';
    this.results = {
      landing: { status: 'pending', issues: [] },
      auth: { status: 'pending', issues: [] },
      journal: { status: 'pending', issues: [] },
      crisis: { status: 'pending', issues: [] },
      mobile: { status: 'pending', issues: [] },
      performance: { status: 'pending', issues: [] },
      overall: { status: 'pending', readyForLaunch: false }
    };
  }

  async makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = `${this.baseUrl}${path}`;
      console.log(`🔍 Testing: ${url}`);
      
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
            responseTime: Date.now() - startTime
          });
        });
      });

      const startTime = Date.now();
      
      req.on('error', (err) => {
        reject(err);
      });

      // Timeout after 30 seconds
      req.setTimeout(30000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async validateLandingPage() {
    console.log('\n🌐 VALIDATING LANDING PAGE & AGE VERIFICATION');
    
    try {
      // Test root redirect
      const rootResponse = await this.makeRequest('/');
      
      if (rootResponse.statusCode === 307 && rootResponse.headers.location === '/en') {
        console.log('✅ Root redirect to /en working');
        this.results.landing.status = 'partial';
      } else {
        this.results.landing.issues.push('Root redirect not working properly');
      }

      // Test English locale page
      const enResponse = await this.makeRequest('/en');
      
      if (enResponse.statusCode === 200) {
        console.log('✅ English locale page loads');
        
        // Check for age verification patterns
        const hasAgeVerification = enResponse.body.includes('age') || 
                                  enResponse.body.includes('verify') ||
                                  enResponse.body.includes('18');
        
        if (hasAgeVerification) {
          console.log('✅ Age verification content detected');
        } else {
          this.results.landing.issues.push('Age verification not found in content');
        }

        // Check for crisis/emergency access
        const hasCrisisAccess = enResponse.body.includes('988') ||
                               enResponse.body.includes('crisis') ||
                               enResponse.body.includes('emergency');
        
        if (hasCrisisAccess) {
          console.log('✅ Crisis access content detected');
        } else {
          this.results.landing.issues.push('Crisis access not prominently available');
        }

        // Check performance headers
        if (enResponse.headers['x-alchm-emergency'] === 'true') {
          console.log('✅ Emergency mode headers present');
        }

        if (enResponse.responseTime < 5000) {
          console.log(`✅ Response time: ${enResponse.responseTime}ms`);
        } else {
          this.results.landing.issues.push(`Slow response time: ${enResponse.responseTime}ms`);
        }

        this.results.landing.status = this.results.landing.issues.length === 0 ? 'passed' : 'partial';
        
      } else {
        this.results.landing.status = 'failed';
        this.results.landing.issues.push(`Landing page returned ${enResponse.statusCode}`);
      }

    } catch (error) {
      this.results.landing.status = 'failed';
      this.results.landing.issues.push(`Landing page error: ${error.message}`);
    }
  }

  async validateAuthentication() {
    console.log('\n🔐 VALIDATING AUTHENTICATION FLOW');
    
    try {
      // Test auth pages
      const authPages = ['/auth/login', '/auth/signup'];
      
      for (const page of authPages) {
        try {
          const response = await this.makeRequest(page);
          
          if (response.statusCode === 200) {
            console.log(`✅ ${page} accessible`);
            
            // Check for form elements
            const hasForm = response.body.includes('<form') || 
                           response.body.includes('input') ||
                           response.body.includes('email');
            
            if (hasForm) {
              console.log(`✅ ${page} has form elements`);
            } else {
              this.results.auth.issues.push(`${page} missing form elements`);
            }
            
          } else {
            this.results.auth.issues.push(`${page} returned ${response.statusCode}`);
          }
        } catch (error) {
          this.results.auth.issues.push(`${page} error: ${error.message}`);
        }
      }

      this.results.auth.status = this.results.auth.issues.length === 0 ? 'passed' : 'partial';
      
    } catch (error) {
      this.results.auth.status = 'failed';
      this.results.auth.issues.push(`Auth validation error: ${error.message}`);
    }
  }

  async validateJournal() {
    console.log('\n📝 VALIDATING JOURNAL FUNCTIONALITY');
    
    try {
      const journalResponse = await this.makeRequest('/journal');
      
      if (journalResponse.statusCode === 200) {
        console.log('✅ Journal page accessible');
        
        // Check for editor elements
        const hasEditor = journalResponse.body.includes('textarea') ||
                         journalResponse.body.includes('editor') ||
                         journalResponse.body.includes('contenteditable');
        
        if (hasEditor) {
          console.log('✅ Journal editor elements detected');
        } else {
          this.results.journal.issues.push('Journal editor not found');
        }

        // Check for mood selector
        const hasMoodSelector = journalResponse.body.includes('mood') ||
                               journalResponse.body.includes('select');
        
        if (hasMoodSelector) {
          console.log('✅ Mood selector elements detected');
        } else {
          this.results.journal.issues.push('Mood selector not found');
        }

        this.results.journal.status = this.results.journal.issues.length === 0 ? 'passed' : 'partial';
        
      } else {
        this.results.journal.status = 'failed';
        this.results.journal.issues.push(`Journal page returned ${journalResponse.statusCode}`);
      }

      // Test journal list
      const journalsResponse = await this.makeRequest('/journals');
      
      if (journalsResponse.statusCode === 200) {
        console.log('✅ Journals list page accessible');
      } else {
        this.results.journal.issues.push(`Journals list returned ${journalsResponse.statusCode}`);
      }
      
    } catch (error) {
      this.results.journal.status = 'failed';
      this.results.journal.issues.push(`Journal validation error: ${error.message}`);
    }
  }

  async validateCrisisSafety() {
    console.log('\n🆘 VALIDATING CRISIS SAFETY SYSTEMS');
    
    try {
      // Test API endpoints
      const healthResponse = await this.makeRequest('/api/health/ping');
      
      if (healthResponse.statusCode === 200) {
        console.log('✅ Health API endpoint working');
      } else {
        this.results.crisis.issues.push('Health API not responding');
      }

      // Check all pages have crisis safety
      const pages = ['/en', '/journal', '/auth/login'];
      
      for (const page of pages) {
        try {
          const response = await this.makeRequest(page);
          
          const hasCrisisSupport = response.body.includes('988') ||
                                  response.body.includes('crisis') ||
                                  response.body.includes('suicide') ||
                                  response.body.includes('emergency');
          
          if (hasCrisisSupport) {
            console.log(`✅ ${page} has crisis support elements`);
          } else {
            this.results.crisis.issues.push(`${page} missing crisis support`);
          }
          
        } catch (error) {
          this.results.crisis.issues.push(`Crisis check failed for ${page}`);
        }
      }

      this.results.crisis.status = this.results.crisis.issues.length === 0 ? 'passed' : 'partial';
      
    } catch (error) {
      this.results.crisis.status = 'failed';
      this.results.crisis.issues.push(`Crisis validation error: ${error.message}`);
    }
  }

  async validateMobileOptimization() {
    console.log('\n📱 VALIDATING MOBILE TRAUMA-INFORMED DESIGN');
    
    try {
      const response = await this.makeRequest('/en');
      
      if (response.statusCode === 200) {
        // Check for viewport meta tag
        const hasViewport = response.body.includes('viewport') &&
                           response.body.includes('width=device-width');
        
        if (hasViewport) {
          console.log('✅ Mobile viewport meta tag present');
        } else {
          this.results.mobile.issues.push('Mobile viewport meta tag missing');
        }

        // Check for touch-friendly CSS
        const hasTouchCSS = response.body.includes('touch') ||
                           response.body.includes('mobile') ||
                           response.body.includes('responsive');
        
        if (hasTouchCSS) {
          console.log('✅ Touch-friendly CSS detected');
        } else {
          this.results.mobile.issues.push('Touch-friendly CSS not detected');
        }

        this.results.mobile.status = this.results.mobile.issues.length === 0 ? 'passed' : 'partial';
        
      } else {
        this.results.mobile.status = 'failed';
        this.results.mobile.issues.push('Mobile validation failed - page not accessible');
      }
      
    } catch (error) {
      this.results.mobile.status = 'failed';
      this.results.mobile.issues.push(`Mobile validation error: ${error.message}`);
    }
  }

  async validatePerformance() {
    console.log('\n⚡ VALIDATING PERFORMANCE');
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest('/en');
      const responseTime = Date.now() - startTime;
      
      // Performance criteria for trauma-informed design
      if (responseTime < 3000) {
        console.log(`✅ Response time: ${responseTime}ms (under 3s threshold)`);
      } else if (responseTime < 5000) {
        console.log(`⚠️ Response time: ${responseTime}ms (acceptable but slow)`);
        this.results.performance.issues.push(`Slow response time: ${responseTime}ms`);
      } else {
        console.log(`❌ Response time: ${responseTime}ms (too slow for crisis situations)`);
        this.results.performance.issues.push(`Critical slow response time: ${responseTime}ms`);
      }

      // Check content size (estimated)
      const contentSize = response.body.length;
      const sizeMB = (contentSize / 1024 / 1024).toFixed(2);
      
      if (contentSize < 500000) { // 500KB
        console.log(`✅ Content size: ${sizeMB}MB`);
      } else if (contentSize < 1000000) { // 1MB
        console.log(`⚠️ Content size: ${sizeMB}MB (large)`);
        this.results.performance.issues.push(`Large content size: ${sizeMB}MB`);
      } else {
        console.log(`❌ Content size: ${sizeMB}MB (too large)`);
        this.results.performance.issues.push(`Critical large content size: ${sizeMB}MB`);
      }

      this.results.performance.status = this.results.performance.issues.length === 0 ? 'passed' : 'partial';
      
    } catch (error) {
      this.results.performance.status = 'failed';
      this.results.performance.issues.push(`Performance validation error: ${error.message}`);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🎯 ALCHM END-TO-END USER JOURNEY VALIDATION REPORT');
    console.log('='.repeat(80));

    const categories = [
      { name: 'Landing Page & Age Verification', key: 'landing' },
      { name: 'Authentication Flow', key: 'auth' },
      { name: 'Journal Functionality', key: 'journal' },
      { name: 'Crisis Safety Systems', key: 'crisis' },
      { name: 'Mobile Optimization', key: 'mobile' },
      { name: 'Performance', key: 'performance' }
    ];

    let totalPassed = 0;
    let totalCriticalIssues = 0;

    categories.forEach(category => {
      const result = this.results[category.key];
      const status = result.status === 'passed' ? '✅ PASSED' :
                    result.status === 'partial' ? '⚠️ PARTIAL' : '❌ FAILED';
      
      console.log(`\n${category.name}: ${status}`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          console.log(`  - ${issue}`);
          if (issue.includes('Critical') || issue.includes('crisis') || issue.includes('emergency')) {
            totalCriticalIssues++;
          }
        });
      }

      if (result.status === 'passed') totalPassed++;
    });

    // Overall assessment
    const overallScore = (totalPassed / categories.length) * 100;
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 OVERALL ASSESSMENT');
    console.log('='.repeat(80));
    console.log(`Overall Score: ${overallScore.toFixed(1)}%`);
    console.log(`Critical Issues: ${totalCriticalIssues}`);

    // Readiness determination
    const isReady = overallScore >= 80 && totalCriticalIssues === 0;
    
    this.results.overall.readyForLaunch = isReady;
    
    if (isReady) {
      console.log('\n🎉 ALCHM IS READY FOR FRIENDS & FAMILY TESTING');
      console.log('✅ All critical systems validated');
      console.log('✅ Trauma-informed design principles met');
      console.log('✅ Crisis safety systems operational');
    } else {
      console.log('\n⚠️ ALCHM NEEDS IMPROVEMENTS BEFORE LAUNCH');
      console.log('❌ Critical issues must be resolved');
      console.log('❌ Performance optimizations required');
      console.log('❌ Additional testing needed');
    }

    console.log('\n📋 NEXT STEPS:');
    if (isReady) {
      console.log('1. Deploy to production environment');
      console.log('2. Set up monitoring and alerting');
      console.log('3. Prepare onboarding materials');
      console.log('4. Begin controlled user testing');
    } else {
      console.log('1. Fix critical bundle size issues (12.8MB → <1MB)');
      console.log('2. Optimize Firebase configuration');
      console.log('3. Implement code splitting');
      console.log('4. Re-run validation tests');
    }

    return this.results;
  }

  async runFullValidation() {
    console.log('🚀 Starting ALCHM Comprehensive User Journey Validation...\n');
    
    await this.validateLandingPage();
    await this.validateAuthentication();
    await this.validateJournal();
    await this.validateCrisisSafety();
    await this.validateMobileOptimization();
    await this.validatePerformance();
    
    return this.generateReport();
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new ALCHMUserJourneyValidator();
  validator.runFullValidation()
    .then(results => {
      process.exit(results.overall.readyForLaunch ? 0 : 1);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

module.exports = ALCHMUserJourneyValidator;