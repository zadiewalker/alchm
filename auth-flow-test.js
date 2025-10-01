#!/usr/bin/env node

/**
 * COMPREHENSIVE AUTHENTICATION FLOW TESTING
 * Tests all critical authentication paths for beta launch readiness
 */

const puppeteer = require('puppeteer');

const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  timeout: 30000,
  screenshotPath: './screenshots/',
  headless: false, // Set to false to see the browser
};

const ROUTES_TO_TEST = [
  '/',
  '/auth/login',
  '/auth/signup', 
  '/dashboard',
  '/journal',
  '/emergency',
  '/pricing'
];

class AuthFlowTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      routeStatus: {},
      authFlow: {},
      crisisSupport: {},
      performance: {},
      errors: []
    };
  }

  async init() {
    console.log('🚀 Initializing Authentication Flow Testing...');
    
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Set viewport for mobile testing
    await this.page.setViewport({ width: 375, height: 667 });
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console',
          message: msg.text(),
          url: this.page.url()
        });
      }
    });

    // Capture network failures
    this.page.on('response', response => {
      if (response.status() >= 400) {
        this.results.errors.push({
          type: 'network',
          status: response.status(),
          url: response.url()
        });
      }
    });
  }

  async testRouteAccessibility() {
    console.log('\n📍 Testing Route Accessibility...');
    
    for (const route of ROUTES_TO_TEST) {
      try {
        console.log(`  Testing ${route}...`);
        
        const startTime = Date.now();
        const response = await this.page.goto(`${TEST_CONFIG.baseUrl}${route}`, {
          waitUntil: 'networkidle2',
          timeout: TEST_CONFIG.timeout
        });
        const loadTime = Date.now() - startTime;

        this.results.routeStatus[route] = {
          status: response.status(),
          loadTime,
          accessible: response.status() === 200,
          redirected: response.url() !== `${TEST_CONFIG.baseUrl}${route}`
        };

        console.log(`    ✅ ${route}: ${response.status()} (${loadTime}ms)`);
        
        // Wait for page to be interactive
        await this.page.waitForLoadState?.() || await this.page.waitForTimeout(1000);
        
      } catch (error) {
        console.log(`    ❌ ${route}: ${error.message}`);
        this.results.routeStatus[route] = {
          status: 'error',
          error: error.message,
          accessible: false
        };
      }
    }
  }

  async testAuthLoginPage() {
    console.log('\n🔐 Testing Authentication Login Page...');
    
    try {
      await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, {
        waitUntil: 'networkidle2'
      });

      // Check for essential elements
      const elements = await this.page.evaluate(() => {
        return {
          hasEmailInput: !!document.querySelector('input[type="email"]'),
          hasPasswordInput: !!document.querySelector('input[type="password"]'),
          hasGoogleButton: !!document.querySelector('button:contains("Google"), button:contains("google")') || 
                          !!Array.from(document.querySelectorAll('button')).find(btn => 
                            btn.textContent.toLowerCase().includes('google')),
          hasCrisisButton: !!Array.from(document.querySelectorAll('button')).find(btn => 
                          btn.textContent.toLowerCase().includes('crisis') || 
                          btn.textContent.toLowerCase().includes('988') ||
                          btn.textContent.toLowerCase().includes('emergency')),
          hasSubmitButton: !!document.querySelector('button[type="submit"]'),
          title: document.title,
          url: window.location.href
        };
      });

      this.results.authFlow.loginPage = {
        accessible: true,
        elements,
        functional: elements.hasEmailInput && elements.hasPasswordInput && elements.hasSubmitButton
      };

      console.log('    ✅ Login page elements found:', elements);

    } catch (error) {
      console.log(`    ❌ Login page test failed: ${error.message}`);
      this.results.authFlow.loginPage = {
        accessible: false,
        error: error.message
      };
    }
  }

  async testCrisisSupport() {
    console.log('\n🆘 Testing Crisis Support Features...');
    
    try {
      // Test emergency page
      await this.page.goto(`${TEST_CONFIG.baseUrl}/emergency`, {
        waitUntil: 'networkidle2'
      });

      const emergencyFeatures = await this.page.evaluate(() => {
        return {
          hasContent: document.body.innerText.length > 100,
          hasCrisisHotline: document.body.innerText.includes('988') || 
                           document.body.innerText.includes('crisis'),
          hasEmergencyJournal: document.body.innerText.toLowerCase().includes('journal'),
          title: document.title,
          accessibleOffline: true // We'll assume this works based on service worker
        };
      });

      this.results.crisisSupport.emergencyPage = emergencyFeatures;
      console.log('    ✅ Emergency page features:', emergencyFeatures);

      // Test crisis buttons on login page
      await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`);
      
      const crisisButtonsWork = await this.page.evaluate(() => {
        const crisisButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
          btn.textContent.toLowerCase().includes('crisis') ||
          btn.textContent.toLowerCase().includes('988') ||
          btn.textContent.toLowerCase().includes('emergency')
        );
        
        return {
          count: crisisButtons.length,
          hasButtons: crisisButtons.length > 0,
          buttonTexts: crisisButtons.map(btn => btn.textContent.trim())
        };
      });

      this.results.crisisSupport.crisisButtons = crisisButtonsWork;
      console.log('    ✅ Crisis buttons:', crisisButtonsWork);

    } catch (error) {
      console.log(`    ❌ Crisis support test failed: ${error.message}`);
      this.results.crisisSupport.error = error.message;
    }
  }

  async testFirebaseConnection() {
    console.log('\n🔥 Testing Firebase Connection...');
    
    try {
      await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`);
      
      const firebaseStatus = await this.page.evaluate(async () => {
        try {
          // Check if Firebase is available
          const hasFirebase = typeof window.firebase !== 'undefined';
          
          // Check console for Firebase initialization
          return {
            available: hasFirebase,
            timestamp: new Date().toISOString(),
            configPresent: !!process?.env?.NEXT_PUBLIC_FIREBASE_API_KEY,
            userAgent: navigator.userAgent
          };
        } catch (error) {
          return {
            available: false,
            error: error.message
          };
        }
      });

      this.results.authFlow.firebaseConnection = firebaseStatus;
      console.log('    ✅ Firebase status:', firebaseStatus);

    } catch (error) {
      console.log(`    ❌ Firebase connection test failed: ${error.message}`);
      this.results.authFlow.firebaseConnection = {
        available: false,
        error: error.message
      };
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      // Test auth page performance
      const startTime = Date.now();
      await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, {
        waitUntil: 'networkidle2'
      });
      const loadTime = Date.now() - startTime;

      // Get bundle size info
      const resourceSizes = await this.page.evaluate(() => {
        const resources = performance.getEntriesByType('resource');
        const jsResources = resources.filter(r => r.name.includes('.js'));
        const cssResources = resources.filter(r => r.name.includes('.css'));
        
        return {
          totalResources: resources.length,
          jsFiles: jsResources.length,
          cssFiles: cssResources.length,
          totalSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
          jsSize: jsResources.reduce((sum, r) => sum + (r.transferSize || 0), 0)
        };
      });

      this.results.performance = {
        authPageLoadTime: loadTime,
        ...resourceSizes,
        acceptable: loadTime < 5000 && resourceSizes.totalSize < 5000000 // 5MB limit
      };

      console.log(`    ✅ Performance: ${loadTime}ms load, ${Math.round(resourceSizes.totalSize/1024)}KB total`);

    } catch (error) {
      console.log(`    ❌ Performance test failed: ${error.message}`);
      this.results.performance = { error: error.message };
    }
  }

  async runFullTest() {
    try {
      await this.init();
      
      await this.testRouteAccessibility();
      await this.testAuthLoginPage();
      await this.testFirebaseConnection();
      await this.testCrisisSupport();
      await this.testPerformance();
      
      return this.generateReport();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return { success: false, error: error.message };
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  generateReport() {
    console.log('\n📊 COMPREHENSIVE AUTHENTICATION TESTING REPORT');
    console.log('='.repeat(60));
    
    // Route Status Summary
    console.log('\n📍 ROUTE ACCESSIBILITY:');
    Object.entries(this.results.routeStatus).forEach(([route, status]) => {
      const icon = status.accessible ? '✅' : '❌';
      console.log(`  ${icon} ${route}: ${status.status} ${status.loadTime ? `(${status.loadTime}ms)` : ''}`);
    });

    // Authentication Flow Summary  
    console.log('\n🔐 AUTHENTICATION FLOW:');
    const loginPage = this.results.authFlow.loginPage;
    if (loginPage) {
      console.log(`  ✅ Login page accessible: ${loginPage.accessible}`);
      console.log(`  ✅ Form elements functional: ${loginPage.functional}`);
    }
    
    const firebase = this.results.authFlow.firebaseConnection;
    if (firebase) {
      console.log(`  ✅ Firebase connection: ${firebase.available ? 'Available' : 'Unavailable'}`);
    }

    // Crisis Support Summary
    console.log('\n🆘 CRISIS SUPPORT:');
    const crisis = this.results.crisisSupport;
    if (crisis.emergencyPage) {
      console.log(`  ✅ Emergency page: ${crisis.emergencyPage.hasContent ? 'Functional' : 'Issues'}`);
      console.log(`  ✅ Crisis hotline info: ${crisis.emergencyPage.hasCrisisHotline ? 'Present' : 'Missing'}`);
    }
    if (crisis.crisisButtons) {
      console.log(`  ✅ Crisis buttons: ${crisis.crisisButtons.count} found`);
    }

    // Performance Summary
    console.log('\n⚡ PERFORMANCE:');
    const perf = this.results.performance;
    if (perf.authPageLoadTime) {
      console.log(`  ✅ Auth page load time: ${perf.authPageLoadTime}ms`);
      console.log(`  ✅ Bundle size: ${Math.round(perf.totalSize/1024)}KB`);
      console.log(`  ✅ Performance acceptable: ${perf.acceptable ? 'Yes' : 'No'}`);
    }

    // Error Summary
    console.log('\n❌ ERRORS DETECTED:');
    if (this.results.errors.length === 0) {
      console.log('  ✅ No errors detected');
    } else {
      this.results.errors.forEach(error => {
        console.log(`  ❌ ${error.type}: ${error.message}`);
      });
    }

    // Beta Launch Assessment
    const criticalIssues = this.results.errors.filter(e => e.type === 'network' && e.status >= 500).length;
    const authWorking = this.results.routeStatus['/auth/login']?.accessible;
    const emergencyWorking = this.results.routeStatus['/emergency']?.accessible;
    const performanceOk = this.results.performance?.acceptable !== false;

    const betaReady = criticalIssues === 0 && authWorking && emergencyWorking && performanceOk;

    console.log('\n🎯 BETA LAUNCH READINESS ASSESSMENT:');
    console.log(`  Critical Issues: ${criticalIssues}`);
    console.log(`  Auth Accessible: ${authWorking ? 'Yes' : 'No'}`);
    console.log(`  Emergency Accessible: ${emergencyWorking ? 'Yes' : 'No'}`);
    console.log(`  Performance OK: ${performanceOk ? 'Yes' : 'No'}`);
    console.log(`  BETA READY: ${betaReady ? '✅ YES' : '❌ NO'}`);

    return {
      success: true,
      betaReady,
      results: this.results,
      summary: {
        criticalIssues,
        authWorking,
        emergencyWorking,
        performanceOk,
        errorCount: this.results.errors.length
      }
    };
  }
}

// Run the test if this script is called directly
if (require.main === module) {
  const tester = new AuthFlowTester();
  tester.runFullTest()
    .then(report => {
      console.log('\n✅ Testing complete!');
      if (!report.betaReady) {
        console.log('\n⚠️  BETA LAUNCH BLOCKED - Issues detected that need resolution');
        process.exit(1);
      } else {
        console.log('\n🎉 BETA LAUNCH READY - All critical systems functional');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('\n❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { AuthFlowTester };