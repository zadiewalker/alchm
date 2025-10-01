#!/usr/bin/env node

/**
 * Crisis Resource Validation System
 * Validates that all crisis support resources are accessible and performant
 */

const https = require('https');
const { performance } = require('perf_hooks');

class CrisisResourceValidator {
  constructor() {
    this.domains = [
      'https://alchm-digital-sanctuary.web.app',
      'https://alchmapp.web.app'
    ];

    // Crisis-critical resources that must be instantly accessible
    this.crisisResources = [
      {
        name: '988 Suicide & Crisis Lifeline',
        url: 'https://988lifeline.org',
        type: 'external',
        maxResponseTime: 2000,
        critical: true,
        offline: false
      },
      {
        name: 'National Domestic Violence Hotline',
        url: 'https://www.thehotline.org',
        type: 'external', 
        maxResponseTime: 2000,
        critical: true,
        offline: false
      },
      {
        name: 'Crisis Text Line',
        url: 'https://www.crisistextline.org',
        type: 'external',
        maxResponseTime: 2000,
        critical: true,
        offline: false
      },
      {
        name: 'ALCHM Crisis Support Page',
        path: '/crisis-support',
        type: 'internal',
        maxResponseTime: 100,
        critical: true,
        offline: true
      },
      {
        name: 'ALCHM Emergency Resources',
        path: '/emergency',
        type: 'internal',
        maxResponseTime: 100,
        critical: true,
        offline: true
      },
      {
        name: 'Crisis Detection API',
        path: '/api/crisis-detection',
        type: 'api',
        maxResponseTime: 500,
        critical: true,
        offline: false
      }
    ];

    // Crisis keywords that should trigger immediate support
    this.crisisKeywords = [
      'suicide',
      'kill myself', 
      'end it all',
      'want to die',
      'hurt myself',
      'self harm',
      'cutting',
      'overdose',
      'jumping',
      'hanging',
      'gun',
      'pills',
      'hopeless',
      'worthless',
      'better off dead',
      'can\'t go on',
      'abuse',
      'domestic violence',
      'rape',
      'sexual assault',
      'panic attack',
      'crisis',
      'emergency',
      '988'
    ];

    this.results = {
      timestamp: new Date().toISOString(),
      domains: {},
      resources: {},
      keywordTests: {},
      summary: {},
      criticalFailures: []
    };
  }

  async validateResource(resource, domain = null) {
    const url = resource.type === 'external' 
      ? resource.url 
      : `${domain}${resource.path}`;
    
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        timeout: resource.maxResponseTime + 1000,
        headers: {
          'User-Agent': 'ALCHM-Crisis-Validator/1.0'
        }
      }, (response) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        let body = '';
        response.on('data', (chunk) => body += chunk);
        response.on('end', () => {
          resolve({
            url,
            statusCode: response.statusCode,
            responseTime,
            accessible: response.statusCode >= 200 && response.statusCode < 400,
            withinThreshold: responseTime <= resource.maxResponseTime,
            contentLength: body.length,
            hasHelpContent: this.detectHelpContent(body),
            hasCrisisKeywords: this.detectCrisisKeywords(body),
            securityHeaders: this.checkSecurityHeaders(response.headers)
          });
        });
      });

      request.on('error', (error) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        reject({
          url,
          error: error.message,
          responseTime,
          accessible: false,
          withinThreshold: false
        });
      });

      request.on('timeout', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        request.destroy();
        reject({
          url,
          error: 'Request timeout',
          responseTime,
          accessible: false,
          withinThreshold: false
        });
      });
    });
  }

  detectHelpContent(html) {
    const helpIndicators = [
      'help',
      'support',
      'crisis',
      'hotline',
      'chat',
      'call',
      'text',
      'counselor',
      'therapist',
      '24/7',
      'emergency'
    ];
    
    const content = html.toLowerCase();
    return helpIndicators.some(indicator => content.includes(indicator));
  }

  detectCrisisKeywords(html) {
    const content = html.toLowerCase();
    return this.crisisKeywords.some(keyword => content.includes(keyword));
  }

  checkSecurityHeaders(headers) {
    const requiredHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options'
    ];
    
    return requiredHeaders.every(header => headers[header]);
  }

  async validateCrisisKeywordDetection(domain) {
    console.log(`\n🔍 Testing crisis keyword detection on ${domain}`);
    
    const keywordResults = {};
    
    // Test sample of high-priority keywords
    const testKeywords = [
      'suicide',
      'kill myself',
      'self harm',
      'abuse',
      'crisis',
      '988'
    ];

    for (const keyword of testKeywords) {
      try {
        const testPayload = JSON.stringify({
          text: `I'm feeling like I want to ${keyword}`,
          userId: 'test-crisis-validation'
        });

        const startTime = performance.now();
        
        const response = await this.makeRequest(`${domain}/api/crisis-detection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(testPayload)
          }
        }, testPayload);

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        keywordResults[keyword] = {
          detected: response.statusCode === 200,
          responseTime,
          withinThreshold: responseTime <= 500,
          response: response.body ? JSON.parse(response.body.substring(0, 500)) : null
        };

        console.log(`   ${keyword}: ${keywordResults[keyword].detected ? '✅' : '❌'} (${Math.round(responseTime)}ms)`);

      } catch (error) {
        keywordResults[keyword] = {
          detected: false,
          responseTime: -1,
          withinThreshold: false,
          error: error.message
        };
        
        console.log(`   ${keyword}: ❌ Error - ${error.message}`);
      }
    }

    return keywordResults;
  }

  makeRequest(url, options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body
          });
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (data) {
        req.write(data);
      }
      
      req.end();
    });
  }

  async validateOfflineAccessibility(domain) {
    console.log(`\n📱 Testing offline accessibility for ${domain}`);
    
    // Test service worker registration
    // Note: This would typically be done in browser context
    // For now, we'll check if service worker file exists
    
    try {
      const swResponse = await this.validateResource({
        path: '/sw.js',
        type: 'internal',
        maxResponseTime: 1000,
        critical: true
      }, domain);

      return {
        hasServiceWorker: swResponse.accessible,
        serviceWorkerSize: swResponse.contentLength,
        offlineReady: swResponse.accessible && swResponse.contentLength > 1000
      };
    } catch (error) {
      return {
        hasServiceWorker: false,
        serviceWorkerSize: 0,
        offlineReady: false,
        error: error.message
      };
    }
  }

  async runCrisisResourceAudit() {
    console.log('🚨 ALCHM Crisis Resource Validation');
    console.log('=' .repeat(60));
    console.log('Validating trauma-informed crisis support accessibility');
    console.log(`Started: ${this.results.timestamp}`);

    for (const domain of this.domains) {
      console.log(`\n🔍 Testing domain: ${domain}`);
      
      const domainResults = {
        domain,
        resources: {},
        keywordDetection: {},
        offlineAccessibility: {},
        overallCrisisReadiness: false
      };

      // Test each crisis resource
      for (const resource of this.crisisResources) {
        console.log(`\n   📋 Testing: ${resource.name}`);
        
        try {
          const result = await this.validateResource(resource, domain);
          
          domainResults.resources[resource.name] = {
            ...resource,
            ...result,
            grade: this.gradeResourcePerformance(result, resource),
            crisisCompliant: this.assessCrisisCompliance(result, resource)
          };

          console.log(`      Status: ${result.statusCode || 'Error'}`);
          console.log(`      Response Time: ${Math.round(result.responseTime)}ms`);
          console.log(`      Accessible: ${result.accessible ? '✅' : '❌'}`);
          console.log(`      Within Threshold: ${result.withinThreshold ? '✅' : '❌'}`);

          // Flag critical failures
          if (!result.accessible || !result.withinThreshold) {
            this.results.criticalFailures.push({
              type: 'CRISIS_RESOURCE_FAILURE',
              resource: resource.name,
              domain,
              issue: !result.accessible ? 'Not accessible' : 'Response time exceeded',
              severity: resource.critical ? 'CRITICAL' : 'HIGH',
              impact: `${resource.name} unavailable for crisis users`
            });
          }

        } catch (error) {
          console.log(`      ❌ Failed: ${error.error || error.message}`);
          
          domainResults.resources[resource.name] = {
            ...resource,
            ...error,
            grade: 'F',
            crisisCompliant: false
          };

          this.results.criticalFailures.push({
            type: 'CRISIS_RESOURCE_ERROR',
            resource: resource.name,
            domain,
            error: error.error || error.message,
            severity: 'CRITICAL',
            impact: `${resource.name} completely inaccessible`
          });
        }
      }

      // Test crisis keyword detection
      if (domain.includes('alchm')) {
        domainResults.keywordDetection = await this.validateCrisisKeywordDetection(domain);
      }

      // Test offline accessibility  
      domainResults.offlineAccessibility = await this.validateOfflineAccessibility(domain);

      // Assess overall crisis readiness
      domainResults.overallCrisisReadiness = this.assessOverallCrisisReadiness(domainResults);

      this.results.domains[domain] = domainResults;
    }

    this.generateCrisisResourceSummary();
    this.displayCrisisResults();

    return this.results;
  }

  gradeResourcePerformance(result, resource) {
    if (!result.accessible) return 'F';
    
    const responseRatio = result.responseTime / resource.maxResponseTime;
    
    if (responseRatio <= 0.5) return 'A+';
    if (responseRatio <= 0.75) return 'A';
    if (responseRatio <= 1.0) return 'B';
    if (responseRatio <= 1.5) return 'C';
    if (responseRatio <= 2.0) return 'D';
    return 'F';
  }

  assessCrisisCompliance(result, resource) {
    return result.accessible && 
           result.withinThreshold && 
           (resource.type !== 'internal' || result.hasHelpContent);
  }

  assessOverallCrisisReadiness(domainResults) {
    const resources = Object.values(domainResults.resources);
    const criticalResources = resources.filter(r => r.critical);
    const readyCriticalResources = criticalResources.filter(r => r.crisisCompliant);
    
    return readyCriticalResources.length === criticalResources.length;
  }

  generateCrisisResourceSummary() {
    const domains = Object.values(this.results.domains);
    const readyDomains = domains.filter(d => d.overallCrisisReadiness).length;
    const totalResources = this.crisisResources.length;
    const criticalFailures = this.results.criticalFailures.filter(f => f.severity === 'CRITICAL').length;

    this.results.summary = {
      totalDomains: domains.length,
      crisisReadyDomains: readyDomains,
      crisisReadinessRate: Math.round((readyDomains / domains.length) * 100),
      totalResources,
      criticalFailures,
      overallGrade: this.calculateOverallCrisisGrade()
    };
  }

  calculateOverallCrisisGrade() {
    const criticalFailures = this.results.criticalFailures.filter(f => f.severity === 'CRITICAL').length;
    const domains = Object.values(this.results.domains);
    const readyRate = this.results.summary.crisisReadinessRate;

    if (criticalFailures > 0) return 'F';
    if (readyRate >= 100) return 'A';
    if (readyRate >= 80) return 'B';
    if (readyRate >= 60) return 'C';
    if (readyRate >= 40) return 'D';
    return 'F';
  }

  displayCrisisResults() {
    console.log('\n🚨 CRISIS RESOURCE VALIDATION SUMMARY');
    console.log('=' .repeat(60));
    console.log(`Overall Crisis Grade: ${this.results.summary.overallGrade}`);
    console.log(`Crisis-Ready Domains: ${this.results.summary.crisisReadyDomains}/${this.results.summary.totalDomains}`);
    console.log(`Crisis Readiness Rate: ${this.results.summary.crisisReadinessRate}%`);
    console.log(`Critical Failures: ${this.results.summary.criticalFailures}`);

    if (this.results.criticalFailures.length > 0) {
      console.log('\n⚠️  CRITICAL CRISIS RESOURCE FAILURES:');
      this.results.criticalFailures.forEach((failure, index) => {
        console.log(`${index + 1}. [${failure.severity}] ${failure.resource} - ${failure.impact}`);
      });
    }

    // Save results
    const fs = require('fs');
    fs.writeFileSync('./crisis-resource-validation.json', JSON.stringify(this.results, null, 2));
    console.log('\n📄 Full crisis validation saved to: crisis-resource-validation.json');
  }
}

// Execute if run directly
if (require.main === module) {
  const validator = new CrisisResourceValidator();
  validator.runCrisisResourceAudit().catch(console.error);
}

module.exports = CrisisResourceValidator;