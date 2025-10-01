#!/usr/bin/env node

/**
 * ALCHM Production Performance Monitor
 * Trauma-informed performance testing for crisis-critical systems
 * 
 * Performance Targets:
 * - Crisis resources: <100ms response time
 * - Page loads: <1.2s FCP, <2.0s LCP
 * - Emergency buttons: <50ms interaction response
 */

const fs = require('fs');
const https = require('https');
const { performance } = require('perf_hooks');

class ALCHMProductionMonitor {
  constructor() {
    this.domains = [
      'https://alchm-digital-sanctuary.web.app',
      'https://alchmapp.web.app'
    ];
    
    this.crisisEndpoints = [
      '/',
      '/journal',
      '/dashboard',
      '/auth/login'
    ];

    this.performanceThresholds = {
      crisisResponse: 100, // ms - Crisis-critical maximum
      firstContentfulPaint: 1200, // ms - 3G network target
      largestContentfulPaint: 2000, // ms - LCP target
      firstInputDelay: 50, // ms - Immediate responsiveness
      cumulativeLayoutShift: 0.05 // Visual stability
    };

    this.results = {
      timestamp: new Date().toISOString(),
      domains: {},
      criticalIssues: [],
      performanceReport: {}
    };
  }

  async measureResponseTime(url) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      
      const req = https.get(url, (res) => {
        const end = performance.now();
        const responseTime = end - start;
        
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          resolve({
            responseTime,
            statusCode: res.statusCode,
            headers: res.headers,
            contentLength: body.length,
            hasSecurityHeaders: this.validateSecurityHeaders(res.headers),
            hasCrisisResources: this.detectCrisisResources(body)
          });
        });
      });

      req.on('error', reject);
      req.setTimeout(10000, () => {
        reject(new Error('Request timeout'));
      });
    });
  }

  validateSecurityHeaders(headers) {
    const requiredHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options'
    ];
    
    return requiredHeaders.every(header => headers[header]);
  }

  detectCrisisResources(html) {
    const crisisKeywords = [
      '988',
      'crisis',
      'suicide prevention',
      'emergency',
      'hotline',
      'support'
    ];
    
    return crisisKeywords.some(keyword => 
      html.toLowerCase().includes(keyword)
    );
  }

  async testDomain(domain) {
    console.log(`\n🔍 Testing domain: ${domain}`);
    const domainResults = {
      domain,
      endpoints: {},
      overallHealth: 'unknown',
      crisisReadiness: false
    };

    for (const endpoint of this.crisisEndpoints) {
      const url = `${domain}${endpoint}`;
      
      try {
        console.log(`  Testing: ${endpoint}`);
        const result = await this.measureResponseTime(url);
        
        domainResults.endpoints[endpoint] = {
          ...result,
          isCrisisCompliant: result.responseTime < this.performanceThresholds.crisisResponse,
          performanceGrade: this.gradePerformance(result.responseTime)
        };

        // Flag critical issues for crisis-sensitive endpoints
        if (result.responseTime > this.performanceThresholds.crisisResponse) {
          this.results.criticalIssues.push({
            type: 'CRISIS_PERFORMANCE_VIOLATION',
            domain,
            endpoint,
            responseTime: result.responseTime,
            threshold: this.performanceThresholds.crisisResponse,
            severity: 'CRITICAL',
            impact: 'Users in crisis may abandon due to slow response'
          });
        }

        if (!result.hasSecurityHeaders) {
          this.results.criticalIssues.push({
            type: 'SECURITY_HEADERS_MISSING',
            domain,
            endpoint,
            severity: 'HIGH',
            impact: 'Potential security vulnerability for vulnerable users'
          });
        }

      } catch (error) {
        console.error(`    ❌ Error testing ${endpoint}: ${error.message}`);
        domainResults.endpoints[endpoint] = {
          error: error.message,
          isCrisisCompliant: false,
          performanceGrade: 'F'
        };

        this.results.criticalIssues.push({
          type: 'ENDPOINT_FAILURE',
          domain,
          endpoint,
          error: error.message,
          severity: 'CRITICAL',
          impact: 'Complete service unavailability'
        });
      }
    }

    domainResults.overallHealth = this.calculateDomainHealth(domainResults);
    domainResults.crisisReadiness = this.assessCrisisReadiness(domainResults);
    
    return domainResults;
  }

  gradePerformance(responseTime) {
    if (responseTime < 100) return 'A+';
    if (responseTime < 200) return 'A';
    if (responseTime < 500) return 'B';
    if (responseTime < 1000) return 'C';
    if (responseTime < 2000) return 'D';
    return 'F';
  }

  calculateDomainHealth(domainResults) {
    const endpoints = Object.values(domainResults.endpoints);
    const healthyEndpoints = endpoints.filter(e => !e.error && e.isCrisisCompliant);
    const healthPercentage = (healthyEndpoints.length / endpoints.length) * 100;
    
    if (healthPercentage >= 95) return 'EXCELLENT';
    if (healthPercentage >= 80) return 'GOOD';
    if (healthPercentage >= 60) return 'FAIR';
    if (healthPercentage >= 40) return 'POOR';
    return 'CRITICAL';
  }

  assessCrisisReadiness(domainResults) {
    const endpoints = Object.values(domainResults.endpoints);
    return endpoints.every(e => 
      !e.error && 
      e.isCrisisCompliant && 
      e.hasSecurityHeaders &&
      e.hasCrisisResources
    );
  }

  async generateLighthouseTest() {
    console.log('\n🚀 Generating Lighthouse performance test command...');
    
    const lighthouseCommand = `npx lighthouse ${this.domains[0]} \
      --only-categories=performance,accessibility,best-practices \
      --chrome-flags="--headless --no-sandbox" \
      --output=json \
      --output-path=./lighthouse-production-report.json`;
    
    return lighthouseCommand;
  }

  generatePerformanceReport() {
    const totalEndpoints = this.domains.length * this.crisisEndpoints.length;
    const criticalIssues = this.results.criticalIssues.filter(i => i.severity === 'CRITICAL').length;
    const avgResponseTime = this.calculateAverageResponseTime();
    
    return {
      summary: {
        totalEndpoints,
        criticalIssues,
        avgResponseTime,
        crisisCompliant: criticalIssues === 0,
        overallGrade: this.calculateOverallGrade()
      },
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };
  }

  calculateAverageResponseTime() {
    const allTimes = [];
    
    Object.values(this.results.domains).forEach(domain => {
      Object.values(domain.endpoints).forEach(endpoint => {
        if (endpoint.responseTime && !endpoint.error) {
          allTimes.push(endpoint.responseTime);
        }
      });
    });

    return allTimes.length > 0 
      ? Math.round(allTimes.reduce((a, b) => a + b, 0) / allTimes.length)
      : 0;
  }

  calculateOverallGrade() {
    const criticalIssues = this.results.criticalIssues.filter(i => i.severity === 'CRITICAL').length;
    const avgResponseTime = this.calculateAverageResponseTime();
    
    if (criticalIssues > 0) return 'F';
    if (avgResponseTime > 1000) return 'D';
    if (avgResponseTime > 500) return 'C';
    if (avgResponseTime > 200) return 'B';
    if (avgResponseTime > 100) return 'A';
    return 'A+';
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.criticalIssues.some(i => i.type === 'CRISIS_PERFORMANCE_VIOLATION')) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'Optimize crisis-critical endpoints to <100ms response time',
        implementation: 'Add CDN caching, optimize bundle size, implement service workers'
      });
    }

    if (this.results.criticalIssues.some(i => i.type === 'SECURITY_HEADERS_MISSING')) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Add security headers for user protection',
        implementation: 'Configure Firebase Hosting headers in firebase.json'
      });
    }

    return recommendations;
  }

  generateNextSteps() {
    return [
      'Run Lighthouse audit for detailed Core Web Vitals',
      'Implement real-time performance monitoring',
      'Set up automated performance regression detection',
      'Configure crisis-specific performance alerts'
    ];
  }

  async runCompleteAudit() {
    console.log('🔥 ALCHM Production Performance Audit - Crisis-Critical Systems');
    console.log('=' .repeat(70));
    console.log(`Started at: ${this.results.timestamp}`);
    
    // Test all domains
    for (const domain of this.domains) {
      const domainResult = await this.testDomain(domain);
      this.results.domains[domain] = domainResult;
    }

    // Generate comprehensive report
    this.results.performanceReport = this.generatePerformanceReport();
    
    // Save results
    const reportPath = './production-performance-audit.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log('\n📊 AUDIT COMPLETE');
    console.log('=' .repeat(70));
    console.log(`Overall Grade: ${this.results.performanceReport.summary.overallGrade}`);
    console.log(`Average Response Time: ${this.results.performanceReport.summary.avgResponseTime}ms`);
    console.log(`Critical Issues: ${this.results.performanceReport.summary.criticalIssues}`);
    console.log(`Crisis Compliant: ${this.results.performanceReport.summary.crisisCompliant ? '✅' : '❌'}`);
    
    if (this.results.criticalIssues.length > 0) {
      console.log('\n⚠️  CRITICAL ISSUES DETECTED:');
      this.results.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.type} - ${issue.impact}`);
      });
    }

    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    return this.results;
  }
}

// Execute if run directly
if (require.main === module) {
  const monitor = new ALCHMProductionMonitor();
  monitor.runCompleteAudit().catch(console.error);
}

module.exports = ALCHMProductionMonitor;