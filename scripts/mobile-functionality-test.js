#!/usr/bin/env node

/**
 * ALCHM Mobile Functionality Test Suite
 * Tests crisis resource accessibility, navigation, and performance
 */

const https = require('https');
const http = require('http');

const PRODUCTION_URL = 'https://alchmapp.web.app';
const MOBILE_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

class MobileFunctionalityTester {
  constructor() {
    this.results = {
      crisisResources: {},
      navigation: {},
      performance: {},
      accessibility: {}
    };
  }

  async testCrisisResourceAccessibility() {
    console.log('🚨 Testing Crisis Resource Accessibility...');
    
    const resources = [
      '/crisis-resources.json',
      '/emergency-crisis.html',
      '/crisis-mobile-manifest.json',
      '/crisis-sw.js'
    ];

    for (const resource of resources) {
      try {
        const result = await this.makeRequest(PRODUCTION_URL + resource);
        this.results.crisisResources[resource] = {
          status: result.statusCode,
          accessible: result.statusCode === 200,
          contentType: result.headers['content-type'],
          responseTime: result.responseTime
        };
        
        console.log(`   ${result.statusCode === 200 ? '✅' : '❌'} ${resource}: ${result.statusCode} (${result.responseTime}ms)`);
      } catch (error) {
        this.results.crisisResources[resource] = {
          status: 'ERROR',
          accessible: false,
          error: error.message
        };
        console.log(`   ❌ ${resource}: ERROR - ${error.message}`);
      }
    }
  }

  async testMobileNavigation() {
    console.log('📱 Testing Mobile Navigation...');
    
    const navigationPaths = [
      '/',
      '/en',
      '/en/journal',
      '/en/dashboard',
      '/en/pathways',
      '/en/pricing'
    ];

    for (const path of navigationPaths) {
      try {
        const result = await this.makeRequest(PRODUCTION_URL + path, {
          'User-Agent': MOBILE_USER_AGENT
        });
        
        this.results.navigation[path] = {
          status: result.statusCode,
          accessible: result.statusCode === 200,
          responseTime: result.responseTime,
          mobileOptimized: result.headers['x-mobile-optimized'] === 'true'
        };
        
        console.log(`   ${result.statusCode === 200 ? '✅' : '❌'} ${path}: ${result.statusCode} (${result.responseTime}ms)`);
      } catch (error) {
        this.results.navigation[path] = {
          status: 'ERROR',
          accessible: false,
          error: error.message
        };
        console.log(`   ❌ ${path}: ERROR - ${error.message}`);
      }
    }
  }

  async testPerformanceMetrics() {
    console.log('⚡ Testing Mobile Performance...');
    
    const testUrl = PRODUCTION_URL + '/en';
    const startTime = Date.now();
    
    try {
      const result = await this.makeRequest(testUrl, {
        'User-Agent': MOBILE_USER_AGENT
      });
      
      const totalTime = Date.now() - startTime;
      
      this.results.performance = {
        totalLoadTime: totalTime,
        serverResponseTime: result.responseTime,
        status: result.statusCode,
        cacheHeaders: {
          cacheControl: result.headers['cache-control'],
          etag: result.headers['etag']
        },
        performanceBudget: {
          underBudget: totalTime < 3000, // 3 second trauma-informed threshold
          criticalResource: totalTime < 1000 // Critical resource threshold
        }
      };
      
      console.log(`   ✅ Total Load Time: ${totalTime}ms`);
      console.log(`   ${totalTime < 3000 ? '✅' : '❌'} Trauma-informed Budget (<3s): ${totalTime < 3000 ? 'PASS' : 'FAIL'}`);
      console.log(`   ${totalTime < 1000 ? '✅' : '⚠️'} Critical Resource Budget (<1s): ${totalTime < 1000 ? 'PASS' : 'WARNING'}`);
      
    } catch (error) {
      this.results.performance = {
        error: error.message,
        status: 'ERROR'
      };
      console.log(`   ❌ Performance test failed: ${error.message}`);
    }
  }

  async testMobileCrisisDetection() {
    console.log('🔍 Testing Mobile Crisis Detection...');
    
    // Test if crisis detection API is accessible
    try {
      const apiUrl = PRODUCTION_URL + '/api/khepera';
      const testPayload = JSON.stringify({
        journalText: "I'm feeling really overwhelmed today and could use some support",
        userId: "test-mobile-user",
        mood: "challenging",
        userCulture: "en-US"
      });
      
      const result = await this.makeRequest(apiUrl, {
        'User-Agent': MOBILE_USER_AGENT,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testPayload)
      }, 'POST', testPayload);
      
      this.results.accessibility.crisisDetection = {
        apiAccessible: result.statusCode === 200,
        status: result.statusCode,
        responseTime: result.responseTime
      };
      
      console.log(`   ${result.statusCode === 200 ? '✅' : '❌'} Crisis Detection API: ${result.statusCode} (${result.responseTime}ms)`);
      
    } catch (error) {
      this.results.accessibility.crisisDetection = {
        apiAccessible: false,
        error: error.message
      };
      console.log(`   ❌ Crisis Detection API: ERROR - ${error.message}`);
    }
  }

  makeRequest(url, headers = {}, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: method,
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          ...headers
        }
      };

      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        const responseTime = Date.now() - startTime;
        
        // Collect response data for POST requests
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            responseTime: responseTime
          });
        });
      });

      req.on('error', reject);
      
      if (body) {
        req.write(body);
      }
      
      req.end();
    });
  }

  async generateReport() {
    console.log('\n📊 MOBILE FUNCTIONALITY TEST REPORT');
    console.log('=====================================');
    
    // Crisis Resources Summary
    const crisisResourceCount = Object.keys(this.results.crisisResources).length;
    const accessibleCrisisResources = Object.values(this.results.crisisResources)
      .filter(r => r.accessible).length;
    
    console.log(`\n🚨 Crisis Resources: ${accessibleCrisisResources}/${crisisResourceCount} accessible`);
    
    // Navigation Summary
    const navigationCount = Object.keys(this.results.navigation).length;
    const accessibleNavigation = Object.values(this.results.navigation)
      .filter(r => r.accessible).length;
    
    console.log(`📱 Navigation: ${accessibleNavigation}/${navigationCount} paths accessible`);
    
    // Performance Summary
    if (this.results.performance.totalLoadTime) {
      const loadTime = this.results.performance.totalLoadTime;
      const budgetStatus = loadTime < 3000 ? 'PASS' : 'FAIL';
      console.log(`⚡ Performance: ${loadTime}ms (Trauma Budget: ${budgetStatus})`);
    }
    
    // Overall Health Score
    const totalTests = crisisResourceCount + navigationCount + 1; // +1 for performance
    const passedTests = accessibleCrisisResources + accessibleNavigation + 
      (this.results.performance.performanceBudget?.underBudget ? 1 : 0);
    
    const healthScore = Math.round((passedTests / totalTests) * 100);
    console.log(`\n🏥 Overall Mobile Health Score: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log('✅ EXCELLENT: Mobile functionality is operating optimally');
    } else if (healthScore >= 80) {
      console.log('⚠️  GOOD: Mobile functionality is mostly working with minor issues');
    } else if (healthScore >= 70) {
      console.log('⚠️  WARNING: Mobile functionality has significant issues');
    } else {
      console.log('❌ CRITICAL: Mobile functionality requires immediate attention');
    }
    
    return {
      healthScore,
      results: this.results,
      summary: {
        crisisResources: `${accessibleCrisisResources}/${crisisResourceCount}`,
        navigation: `${accessibleNavigation}/${navigationCount}`,
        performance: this.results.performance.totalLoadTime ? 
          `${this.results.performance.totalLoadTime}ms` : 'ERROR'
      }
    };
  }

  async runAllTests() {
    console.log('🚀 Starting ALCHM Mobile Functionality Tests...\n');
    
    await this.testCrisisResourceAccessibility();
    await this.testMobileNavigation();
    await this.testPerformanceMetrics();
    await this.testMobileCrisisDetection();
    
    const report = await this.generateReport();
    
    // Save detailed results
    const fs = require('fs');
    fs.writeFileSync('./mobile-functionality-test-results.json', 
      JSON.stringify(report, null, 2));
    
    console.log('\n📄 Detailed results saved to: mobile-functionality-test-results.json');
    
    return report;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new MobileFunctionalityTester();
  tester.runAllTests()
    .then((report) => {
      process.exit(report.healthScore >= 80 ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = MobileFunctionalityTester;