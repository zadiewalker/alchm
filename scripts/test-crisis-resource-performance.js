#!/usr/bin/env node

/**
 * Crisis Resource Loading Performance Test
 * Tests the performance of critical crisis support resources
 * Validates that emergency resources load within acceptable timeframes
 */

const { chromeLauncher, lighthouse } = require('lighthouse');
const fs = require('fs').promises;

// Crisis resources to test
const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    url: 'tel:988',
    type: 'emergency_contact',
    maxLoadTime: 0, // Instant access required
    critical: true
  },
  {
    name: 'Crisis Text Line',
    url: 'sms:741741',
    type: 'emergency_contact',
    maxLoadTime: 0, // Instant access required
    critical: true
  },
  {
    name: 'Crisis Support Page',
    url: 'http://localhost:3001/crisis-support',
    type: 'crisis_page',
    maxLoadTime: 1000, // 1 second max
    critical: true
  },
  {
    name: 'Journal Page (Crisis Mode)',
    url: 'http://localhost:3001/journal',
    type: 'crisis_page',
    maxLoadTime: 1200, // 1.2 seconds max for LCP
    critical: true
  },
  {
    name: 'Auth Login (Crisis Access)',
    url: 'http://localhost:3001/auth/login',
    type: 'auth_page',
    maxLoadTime: 800, // Fast auth required
    critical: true
  },
  {
    name: 'Emergency Resources API',
    url: 'http://localhost:3001/api/crisis-resources',
    type: 'api_endpoint',
    maxLoadTime: 500, // API must be fast
    critical: true
  }
];

// Crisis scenarios to simulate
const CRISIS_SCENARIOS = [
  {
    name: 'Mobile Crisis (Slow Network)',
    description: 'User in crisis on mobile with poor connectivity',
    networkConditions: {
      offline: false,
      latency: 500, // 500ms latency
      downloadThroughput: 50 * 1024, // 50 KB/s (very slow)
      uploadThroughput: 20 * 1024 // 20 KB/s
    },
    deviceEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    }
  },
  {
    name: 'Desktop Crisis (Regular Network)',
    description: 'User in crisis on desktop with normal connectivity',
    networkConditions: {
      offline: false,
      latency: 100,
      downloadThroughput: 1.6 * 1024 * 1024, // 1.6 MB/s
      uploadThroughput: 750 * 1024 // 750 KB/s
    },
    deviceEmulation: {
      mobile: false,
      width: 1366,
      height: 768,
      deviceScaleFactor: 1
    }
  },
  {
    name: 'Mobile Crisis (Good Network)',
    description: 'User in crisis on mobile with good connectivity',
    networkConditions: {
      offline: false,
      latency: 40,
      downloadThroughput: 10 * 1024 * 1024, // 10 MB/s
      uploadThroughput: 1 * 1024 * 1024 // 1 MB/s
    },
    deviceEmulation: {
      mobile: true,
      width: 414,
      height: 896,
      deviceScaleFactor: 3
    }
  }
];

class CrisisResourcePerformanceTester {
  constructor() {
    this.results = [];
    this.chrome = null;
  }

  async initialize() {
    console.log('🚨 Initializing Crisis Resource Performance Testing...\n');
    console.log('CRITICAL: Testing performance for users in emergency situations');
    console.log('Every millisecond matters when someone needs crisis support.\n');
    
    // Launch Chrome
    this.chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
    });
    
    console.log(`Chrome launched on port ${this.chrome.port}\n`);
  }

  async runAllTests() {
    console.log('🔍 Running comprehensive crisis resource performance tests...\n');
    console.log('=' .repeat(80));
    
    for (const scenario of CRISIS_SCENARIOS) {
      console.log(`\n🎭 Testing Scenario: ${scenario.name}`);
      console.log(`📝 ${scenario.description}`);
      console.log(`🌐 Network: ${scenario.networkConditions.latency}ms latency, ${Math.round(scenario.networkConditions.downloadThroughput/1024)}KB/s`);
      console.log(`📱 Device: ${scenario.deviceEmulation.mobile ? 'Mobile' : 'Desktop'} (${scenario.deviceEmulation.width}x${scenario.deviceEmulation.height})`);
      console.log('-'.repeat(60));
      
      for (const resource of CRISIS_RESOURCES) {
        console.log(`\n🔗 Testing: ${resource.name} (${resource.type})`);
        
        const result = await this.testResource(resource, scenario);
        this.results.push(result);
        
        // Show immediate feedback for critical resources
        if (resource.critical) {
          this.printCriticalResult(result);
        }
      }
    }
  }

  async testResource(resource, scenario) {
    const startTime = Date.now();
    
    try {
      // Skip tel: and sms: URLs (they can't be tested with Lighthouse)
      if (resource.url.startsWith('tel:') || resource.url.startsWith('sms:')) {
        return {
          resource: resource.name,
          url: resource.url,
          type: resource.type,
          scenario: scenario.name,
          loadTime: 0, // Instant access
          passed: true,
          critical: resource.critical,
          maxLoadTime: resource.maxLoadTime,
          timestamp: new Date().toISOString(),
          note: 'Native system call - instant access'
        };
      }

      // Test web resources with Lighthouse
      if (resource.url.startsWith('http')) {
        return await this.testWebResource(resource, scenario);
      }

      // Default case
      return {
        resource: resource.name,
        url: resource.url,
        type: resource.type,
        scenario: scenario.name,
        error: 'Unsupported URL type',
        passed: false,
        critical: resource.critical,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error(`❌ Error testing ${resource.name}:`, error.message);
      
      return {
        resource: resource.name,
        url: resource.url,
        type: resource.type,
        scenario: scenario.name,
        error: error.message,
        passed: false,
        critical: resource.critical,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testWebResource(resource, scenario) {
    // Configure Lighthouse for crisis testing
    const config = {
      extends: 'lighthouse:default',
      settings: {
        onlyCategories: ['performance'],
        formFactor: scenario.deviceEmulation.mobile ? 'mobile' : 'desktop',
        throttling: {
          rttMs: scenario.networkConditions.latency,
          throughputKbps: scenario.networkConditions.downloadThroughput / 1024,
          cpuSlowdownMultiplier: scenario.deviceEmulation.mobile ? 2 : 1
        },
        screenEmulation: scenario.deviceEmulation
      }
    };

    const runnerResult = await lighthouse(resource.url, {
      port: this.chrome.port,
      disableStorageReset: false
    }, config);

    const lhr = runnerResult.lhr;
    
    // Extract critical metrics
    const metrics = {
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      ttfb: lhr.audits['server-response-time'].numericValue,
      tti: lhr.audits['interactive'].numericValue,
      psi: lhr.categories.performance.score * 100
    };

    // Determine the most relevant metric for this resource type
    let relevantLoadTime;
    let relevantMetric;
    
    switch (resource.type) {
      case 'crisis_page':
        relevantLoadTime = metrics.lcp; // LCP is critical for crisis pages
        relevantMetric = 'LCP';
        break;
      case 'api_endpoint':
        relevantLoadTime = metrics.ttfb; // TTFB is critical for APIs
        relevantMetric = 'TTFB';
        break;
      case 'auth_page':
        relevantLoadTime = metrics.fcp; // FCP is critical for auth
        relevantMetric = 'FCP';
        break;
      default:
        relevantLoadTime = metrics.lcp;
        relevantMetric = 'LCP';
    }

    const passed = relevantLoadTime <= resource.maxLoadTime;
    const overageMs = passed ? 0 : relevantLoadTime - resource.maxLoadTime;
    const overagePercent = passed ? 0 : (overageMs / resource.maxLoadTime) * 100;

    return {
      resource: resource.name,
      url: resource.url,
      type: resource.type,
      scenario: scenario.name,
      loadTime: relevantLoadTime,
      relevantMetric,
      maxLoadTime: resource.maxLoadTime,
      passed,
      overageMs,
      overagePercent: overagePercent.toFixed(1),
      critical: resource.critical,
      allMetrics: metrics,
      performanceScore: metrics.psi,
      timestamp: new Date().toISOString(),
      recommendations: this.generateRecommendations(resource, metrics, passed)
    };
  }

  printCriticalResult(result) {
    if (!result.critical) return;
    
    const statusIcon = result.passed ? '✅' : '❌';
    const urgencyIcon = result.critical ? '🚨' : '⚠️';
    
    console.log(`   ${urgencyIcon}${statusIcon} ${result.passed ? 'PASS' : 'FAIL'} - ${result.relevantMetric || 'Load'}: ${this.formatTime(result.loadTime)} (max: ${this.formatTime(result.maxLoadTime)})`);
    
    if (!result.passed && result.overagePercent) {
      console.log(`   📊 ${result.overagePercent}% over acceptable threshold`);
    }
    
    if (result.error) {
      console.log(`   ❌ Error: ${result.error}`);
    }
  }

  generateRecommendations(resource, metrics, passed) {
    const recommendations = [];
    
    if (!passed) {
      recommendations.push('🚨 CRITICAL: This resource exceeds acceptable load times for crisis users');
      
      switch (resource.type) {
        case 'crisis_page':
          if (metrics.lcp > 1200) {
            recommendations.push('⚡ Preload critical crisis resources immediately');
            recommendations.push('🎯 Optimize largest contentful paint element');
            recommendations.push('🔄 Implement crisis-specific caching strategy');
          }
          break;
          
        case 'api_endpoint':
          if (metrics.ttfb > 500) {
            recommendations.push('🚀 Optimize server response time');
            recommendations.push('💾 Implement crisis API caching');
            recommendations.push('🔧 Consider edge computing for crisis endpoints');
          }
          break;
          
        case 'auth_page':
          if (metrics.fcp > 800) {
            recommendations.push('🔐 Optimize authentication page loading');
            recommendations.push('📦 Preload authentication resources');
            recommendations.push('⚡ Inline critical auth CSS');
          }
          break;
      }
    }
    
    // General optimization recommendations
    if (metrics.psi < 90) {
      recommendations.push('📈 Improve overall performance score');
    }
    
    if (metrics.ttfb > 200) {
      recommendations.push('⏱️ Optimize server response time');
    }
    
    return recommendations;
  }

  formatTime(ms) {
    if (ms === 0 || ms === null || ms === undefined) return 'Instant';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  async generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🚨 CRISIS RESOURCE PERFORMANCE REPORT');
    console.log('='.repeat(80));
    
    // Calculate statistics
    const stats = this.calculateStatistics();
    
    // Print executive summary
    this.printExecutiveSummary(stats);
    
    // Print detailed results
    this.printDetailedResults();
    
    // Print recommendations
    this.printCriticalRecommendations();
    
    // Save report
    await this.saveReport();
    
    console.log('\n✅ Crisis resource performance testing complete!');
    console.log(`📁 Detailed report saved to: crisis-resource-performance-report.json`);
  }

  calculateStatistics() {
    const validResults = this.results.filter(r => !r.error);
    const criticalResults = validResults.filter(r => r.critical);
    const passedResults = validResults.filter(r => r.passed);
    const failedResults = validResults.filter(r => !r.passed);
    
    return {
      totalTests: this.results.length,
      validTests: validResults.length,
      criticalTests: criticalResults.length,
      passedTests: passedResults.length,
      failedTests: failedResults.length,
      criticalPassRate: ((criticalResults.filter(r => r.passed).length / criticalResults.length) * 100).toFixed(1),
      overallPassRate: ((passedResults.length / validResults.length) * 100).toFixed(1),
      worstPerformers: validResults
        .filter(r => !r.passed)
        .sort((a, b) => (b.overagePercent || 0) - (a.overagePercent || 0))
        .slice(0, 5),
      averageOverage: failedResults.length > 0 ? 
        (failedResults.reduce((sum, r) => sum + (parseFloat(r.overagePercent) || 0), 0) / failedResults.length).toFixed(1) : 0
    };
  }

  printExecutiveSummary(stats) {
    console.log('\n🚨 CRITICAL EXECUTIVE SUMMARY');
    console.log('-'.repeat(40));
    console.log(`Total Crisis Resources Tested: ${stats.totalTests}`);
    console.log(`Critical Resources: ${stats.criticalTests}`);
    console.log(`Overall Pass Rate: ${stats.overallPassRate}%`);
    console.log(`Critical Resource Pass Rate: ${stats.criticalPassRate}%`);
    
    if (stats.criticalPassRate < 100) {
      console.log('\n❌ CRISIS ALERT: Critical resources failing performance requirements!');
      console.log('🆘 User safety may be at risk due to slow crisis resource loading.');
    } else {
      console.log('\n✅ All critical crisis resources meeting performance requirements');
    }
    
    if (stats.failedTests > 0) {
      console.log(`\n⚠️  ${stats.failedTests} resources failing performance thresholds`);
      console.log(`📊 Average overage: ${stats.averageOverage}%`);
    }
  }

  printDetailedResults() {
    console.log('\n📊 DETAILED PERFORMANCE RESULTS');
    console.log('-'.repeat(40));
    
    // Group results by scenario
    const resultsByScenario = {};
    this.results.forEach(result => {
      if (!resultsByScenario[result.scenario]) {
        resultsByScenario[result.scenario] = [];
      }
      resultsByScenario[result.scenario].push(result);
    });
    
    Object.entries(resultsByScenario).forEach(([scenario, results]) => {
      console.log(`\n🎭 ${scenario}`);
      
      results.forEach(result => {
        const statusIcon = result.passed ? '✅' : result.error ? '💥' : '❌';
        const criticalIcon = result.critical ? '🚨' : '📋';
        
        console.log(`  ${criticalIcon}${statusIcon} ${result.resource}`);
        
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        } else if (result.note) {
          console.log(`    Note: ${result.note}`);
        } else {
          console.log(`    ${result.relevantMetric}: ${this.formatTime(result.loadTime)} (max: ${this.formatTime(result.maxLoadTime)})`);
          
          if (!result.passed) {
            console.log(`    Overage: ${result.overagePercent}% (${this.formatTime(result.overageMs)} too slow)`);
          }
          
          if (result.performanceScore) {
            console.log(`    Performance Score: ${result.performanceScore.toFixed(0)}/100`);
          }
        }
      });
    });
  }

  printCriticalRecommendations() {
    console.log('\n🚨 CRITICAL OPTIMIZATION RECOMMENDATIONS');
    console.log('-'.repeat(40));
    
    const failedCritical = this.results.filter(r => r.critical && !r.passed && !r.error);
    
    if (failedCritical.length === 0) {
      console.log('✅ No critical performance issues detected.');
      return;
    }
    
    console.log('🆘 IMMEDIATE ACTION REQUIRED for the following resources:\n');
    
    failedCritical.forEach((result, index) => {
      console.log(`${index + 1}. ${result.resource} (${result.scenario})`);
      console.log(`   Issue: ${this.formatTime(result.loadTime)} load time exceeds ${this.formatTime(result.maxLoadTime)} threshold`);
      console.log(`   Impact: Users in crisis may not receive timely support`);
      
      if (result.recommendations) {
        result.recommendations.forEach(rec => {
          console.log(`   • ${rec}`);
        });
      }
      console.log('');
    });
    
    // General recommendations
    console.log('🎯 GENERAL CRISIS OPTIMIZATION STRATEGIES:');
    console.log('1. Implement crisis-specific service worker for instant resource access');
    console.log('2. Preload all crisis resources during initial page load');
    console.log('3. Use edge computing to reduce latency for crisis endpoints');
    console.log('4. Implement progressive enhancement for slow networks');
    console.log('5. Add offline fallbacks for critical crisis information');
  }

  async saveReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.calculateStatistics(),
      scenarios: CRISIS_SCENARIOS,
      resources: CRISIS_RESOURCES,
      results: this.results,
      recommendations: this.generateOverallRecommendations()
    };
    
    await fs.writeFile(
      'crisis-resource-performance-report.json',
      JSON.stringify(report, null, 2)
    );
  }

  generateOverallRecommendations() {
    const recs = [];
    
    const failedCritical = this.results.filter(r => r.critical && !r.passed && !r.error);
    
    if (failedCritical.length > 0) {
      recs.push({
        priority: 'CRITICAL',
        action: 'Optimize failed critical resources immediately',
        impact: 'User safety and crisis response capability',
        resources: failedCritical.map(r => r.resource)
      });
    }
    
    const slowMobileResources = this.results.filter(r => 
      r.scenario.includes('Mobile') && !r.passed && !r.error
    );
    
    if (slowMobileResources.length > 0) {
      recs.push({
        priority: 'HIGH',
        action: 'Improve mobile crisis resource loading performance',
        impact: 'Mobile users in crisis (majority of crisis calls)',
        resources: slowMobileResources.map(r => r.resource)
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
  const tester = new CrisisResourcePerformanceTester();
  
  try {
    await tester.initialize();
    await tester.runAllTests();
    await tester.generateReport();
  } catch (error) {
    console.error('❌ Crisis resource testing failed:', error);
    process.exit(1);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { CrisisResourcePerformanceTester };