#!/usr/bin/env node

/**
 * Firebase Functions Performance Testing
 * Tests all deployed functions for response times and reliability
 */

const https = require('https');
const { performance } = require('perf_hooks');

class FirebaseFunctionsPerformanceTest {
  constructor() {
    this.baseUrl = 'https://us-central1-alchm-ai-9c90e.cloudfunctions.net';
    
    this.functions = [
      {
        name: 'healthCheck',
        endpoint: '/healthCheck',
        method: 'GET',
        expectedResponseTime: 500, // ms
        critical: true
      },
      {
        name: 'khepera',
        endpoint: '/khepera',
        method: 'POST', 
        data: '{"prompt":"test","userId":"test"}',
        expectedResponseTime: 3000, // ms - AI processing
        critical: false
      }
    ];

    this.results = {
      timestamp: new Date().toISOString(),
      functions: {},
      summary: {},
      issues: []
    };
  }

  async testFunction(func) {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'us-central1-alchm-ai-9c90e.cloudfunctions.net',
        port: 443,
        path: func.endpoint,
        method: func.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'ALCHM-Performance-Monitor/1.0'
        },
        timeout: 10000
      };

      if (func.data && func.method === 'POST') {
        options.headers['Content-Length'] = Buffer.byteLength(func.data);
      }

      const req = https.request(options, (res) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            responseTime,
            headers: res.headers,
            body: body.substring(0, 1000), // First 1000 chars
            success: res.statusCode >= 200 && res.statusCode < 300,
            withinThreshold: responseTime <= func.expectedResponseTime
          });
        });
      });

      req.on('error', (error) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        reject({
          error: error.message,
          responseTime,
          success: false,
          withinThreshold: false
        });
      });

      req.on('timeout', () => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        req.destroy();
        reject({
          error: 'Request timeout',
          responseTime,
          success: false,
          withinThreshold: false
        });
      });

      if (func.data && func.method === 'POST') {
        req.write(func.data);
      }
      
      req.end();
    });
  }

  async runAllTests() {
    console.log('🔥 Firebase Functions Performance Test');
    console.log('=' .repeat(50));

    for (const func of this.functions) {
      console.log(`\n🧪 Testing: ${func.name} (${func.method} ${func.endpoint})`);
      
      try {
        const result = await this.testFunction(func);
        
        this.results.functions[func.name] = {
          ...func,
          ...result,
          grade: this.gradePerformance(result.responseTime, func.expectedResponseTime)
        };

        console.log(`   Status: ${result.statusCode}`);
        console.log(`   Response Time: ${Math.round(result.responseTime)}ms`);
        console.log(`   Within Threshold: ${result.withinThreshold ? '✅' : '❌'}`);
        console.log(`   Grade: ${this.results.functions[func.name].grade}`);

        // Flag issues
        if (!result.success) {
          this.results.issues.push({
            function: func.name,
            type: 'HTTP_ERROR',
            severity: func.critical ? 'CRITICAL' : 'HIGH',
            message: `HTTP ${result.statusCode} error`
          });
        }

        if (!result.withinThreshold) {
          this.results.issues.push({
            function: func.name,
            type: 'PERFORMANCE_VIOLATION',
            severity: func.critical ? 'CRITICAL' : 'MEDIUM',
            message: `Response time ${Math.round(result.responseTime)}ms exceeds threshold ${func.expectedResponseTime}ms`
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.error || error.message}`);
        
        this.results.functions[func.name] = {
          ...func,
          ...error,
          grade: 'F'
        };

        this.results.issues.push({
          function: func.name,
          type: 'FUNCTION_FAILURE',
          severity: 'CRITICAL',
          message: error.error || error.message
        });
      }
    }

    this.generateSummary();
    this.displayResults();
    
    return this.results;
  }

  gradePerformance(responseTime, threshold) {
    const ratio = responseTime / threshold;
    
    if (ratio <= 0.5) return 'A+';
    if (ratio <= 0.75) return 'A';
    if (ratio <= 1.0) return 'B';
    if (ratio <= 1.5) return 'C';
    if (ratio <= 2.0) return 'D';
    return 'F';
  }

  generateSummary() {
    const functions = Object.values(this.results.functions);
    const successfulFunctions = functions.filter(f => f.success).length;
    const avgResponseTime = Math.round(
      functions.reduce((sum, f) => sum + (f.responseTime || 0), 0) / functions.length
    );
    const criticalIssues = this.results.issues.filter(i => i.severity === 'CRITICAL').length;

    this.results.summary = {
      totalFunctions: functions.length,
      successfulFunctions,
      successRate: Math.round((successfulFunctions / functions.length) * 100),
      avgResponseTime,
      criticalIssues,
      overallGrade: this.calculateOverallGrade(functions)
    };
  }

  calculateOverallGrade(functions) {
    const criticalIssues = this.results.issues.filter(i => i.severity === 'CRITICAL').length;
    
    if (criticalIssues > 0) return 'F';
    
    const grades = functions.map(f => f.grade).filter(g => g);
    const gradeValues = {
      'A+': 4.3,
      'A': 4.0,
      'B': 3.0,
      'C': 2.0,
      'D': 1.0,
      'F': 0.0
    };

    const avgGradeValue = grades.reduce((sum, grade) => sum + gradeValues[grade], 0) / grades.length;
    
    if (avgGradeValue >= 4.0) return 'A';
    if (avgGradeValue >= 3.0) return 'B';
    if (avgGradeValue >= 2.0) return 'C';
    if (avgGradeValue >= 1.0) return 'D';
    return 'F';
  }

  displayResults() {
    console.log('\n📊 FIREBASE FUNCTIONS PERFORMANCE SUMMARY');
    console.log('=' .repeat(50));
    console.log(`Overall Grade: ${this.results.summary.overallGrade}`);
    console.log(`Success Rate: ${this.results.summary.successRate}%`);
    console.log(`Average Response Time: ${this.results.summary.avgResponseTime}ms`);
    console.log(`Critical Issues: ${this.results.summary.criticalIssues}`);

    if (this.results.issues.length > 0) {
      console.log('\n⚠️  ISSUES DETECTED:');
      this.results.issues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity}] ${issue.function}: ${issue.message}`);
      });
    }

    // Save results
    const fs = require('fs');
    fs.writeFileSync('./firebase-functions-performance.json', JSON.stringify(this.results, null, 2));
    console.log('\n📄 Full report saved to: firebase-functions-performance.json');
  }
}

// Execute if run directly
if (require.main === module) {
  const test = new FirebaseFunctionsPerformanceTest();
  test.runAllTests().catch(console.error);
}

module.exports = FirebaseFunctionsPerformanceTest;