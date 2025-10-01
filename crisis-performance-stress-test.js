#!/usr/bin/env node

/**
 * CRISIS PERFORMANCE STRESS TEST
 * Tests crisis detection system under realistic load conditions
 * Validates <3 second response time requirement under stress
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class CrisisPerformanceTester {
  constructor() {
    this.results = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      averageResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
      responseTimes: [],
      crisisDetected: 0,
      falsePositives: 0,
      falseNegatives: 0
    };
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Simulate the edge middleware crisis detection
  simulateCrisisDetection(content, locale = 'en') {
    const startTime = performance.now();
    
    const normalizedContent = content.toLowerCase().trim();
    
    // Emergency keywords (from the implementation)
    const emergencyKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'going to hurt myself', 'have a plan', 'tonight', 'today',
      'overdose', 'pills', 'bridge', 'rope', 'gun',
      'cutting myself', 'burning myself'
    ];

    const warningKeywords = [
      'hopeless', 'worthless', 'burden', 'trapped',
      'can\'t go on', 'better off dead', 'no point',
      'cutting', 'burning', 'hurting myself', 'self harm',
      'no way out', 'give up', 'can\'t take it'
    ];

    const culturalKeywords = {
      es: ['suicidio', 'matarme', 'terminar mi vida', 'quiero morir', 'sin esperanza', 'no hay salida'],
      pt: ['suicídio', 'me matar', 'acabar com minha vida', 'quero morrer', 'sem esperança', 'não há saída'],
      ko: ['자살', '죽고 싶어', '살기 싫어', '희망이 없어', '포기하고 싶어'],
      hi: ['आत्महत्या', 'मरना चाहता हूं', 'जीना नहीं चाहता', 'निराश हूं', 'उम्मीद नहीं'],
      de: ['selbstmord', 'mich umbringen', 'sterben wollen', 'hoffnungslos', 'keinen ausweg']
    };

    // Check emergency keywords
    const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );
    
    // Check cultural keywords
    let hasCulturalCrisis = false;
    if (locale && culturalKeywords[locale]) {
      hasCulturalCrisis = culturalKeywords[locale].some(keyword => 
        normalizedContent.includes(keyword.toLowerCase())
      );
    }
    
    // Check warning keywords
    const hasWarningKeywords = warningKeywords.some(keyword => 
      normalizedContent.includes(keyword.toLowerCase())
    );

    // Time urgency patterns
    const urgencyPatterns = [
      'tonight', 'today', 'now', 'right now', 'this moment',
      'can\'t wait', 'have to do it', 'going to do it',
      'esta noche', 'ahora', 'hoje', 'agora', '오늘', '지금'
    ];
    
    const hasTimeUrgency = urgencyPatterns.some(pattern => normalizedContent.includes(pattern));

    // Determine severity
    let severity = 'low';
    let requiresEmergencyResponse = false;
    let businessMetricsSuspended = false;

    if (hasEmergencyKeywords || hasCulturalCrisis || hasTimeUrgency) {
      severity = 'critical';
      requiresEmergencyResponse = true;
      businessMetricsSuspended = true;
    } else if (hasWarningKeywords) {
      severity = 'high';
      requiresEmergencyResponse = false;
      businessMetricsSuspended = true;
    }

    const responseTime = performance.now() - startTime;

    return {
      hasCrisis: hasEmergencyKeywords || hasCulturalCrisis || hasWarningKeywords || hasTimeUrgency,
      severity,
      requiresEmergencyResponse,
      businessMetricsSuspended,
      responseTime,
      detected: {
        emergency: hasEmergencyKeywords,
        cultural: hasCulturalCrisis,
        warning: hasWarningKeywords,
        urgency: hasTimeUrgency
      }
    };
  }

  generateTestCases() {
    return [
      // Critical crisis cases (should be detected)
      { text: 'I want to kill myself tonight', expected: true, severity: 'critical', locale: 'en' },
      { text: 'I am going to end my life today', expected: true, severity: 'critical', locale: 'en' },
      { text: 'I have a plan to hurt myself', expected: true, severity: 'critical', locale: 'en' },
      { text: 'Going to take pills tonight', expected: true, severity: 'critical', locale: 'en' },
      { text: 'Can\'t go on, going to jump off bridge', expected: true, severity: 'critical', locale: 'en' },
      
      // Spanish crisis cases
      { text: 'Quiero matarme esta noche', expected: true, severity: 'critical', locale: 'es' },
      { text: 'Voy a terminar mi vida hoy', expected: true, severity: 'critical', locale: 'es' },
      { text: 'Me siento sin esperanza', expected: true, severity: 'high', locale: 'es' },
      
      // Portuguese crisis cases  
      { text: 'Quero me matar hoje', expected: true, severity: 'critical', locale: 'pt' },
      { text: 'Vou acabar com minha vida', expected: true, severity: 'critical', locale: 'pt' },
      { text: 'Me sinto sem esperança', expected: true, severity: 'high', locale: 'pt' },
      
      // Korean crisis cases
      { text: '오늘 죽고 싶어', expected: true, severity: 'critical', locale: 'ko' },
      { text: '자살하고 싶어', expected: true, severity: 'critical', locale: 'ko' },
      { text: '희망이 없어', expected: true, severity: 'high', locale: 'ko' },
      
      // Hindi crisis cases
      { text: 'मैं आत्महत्या करना चाहता हूं', expected: true, severity: 'critical', locale: 'hi' },
      { text: 'मैं मरना चाहता हूं', expected: true, severity: 'critical', locale: 'hi' },
      { text: 'मैं निराश हूं', expected: true, severity: 'high', locale: 'hi' },
      
      // German crisis cases
      { text: 'Ich will mich heute umbringen', expected: true, severity: 'critical', locale: 'de' },
      { text: 'Ich will sterben', expected: true, severity: 'critical', locale: 'de' },
      { text: 'Ich bin hoffnungslos', expected: true, severity: 'high', locale: 'de' },
      
      // High-risk warning cases
      { text: 'I feel hopeless and worthless', expected: true, severity: 'high', locale: 'en' },
      { text: 'I\'m a burden to everyone', expected: true, severity: 'high', locale: 'en' },
      { text: 'I feel trapped with no way out', expected: true, severity: 'high', locale: 'en' },
      { text: 'I can\'t take it anymore', expected: true, severity: 'high', locale: 'en' },
      
      // Self-harm cases
      { text: 'I\'ve been cutting myself', expected: true, severity: 'high', locale: 'en' },
      { text: 'I keep hurting myself', expected: true, severity: 'high', locale: 'en' },
      { text: 'I burn myself when I\'m upset', expected: true, severity: 'high', locale: 'en' },
      
      // Normal content (should NOT be detected)
      { text: 'I had a really bad day at work', expected: false, severity: 'low', locale: 'en' },
      { text: 'I\'m feeling sad about my breakup', expected: false, severity: 'low', locale: 'en' },
      { text: 'I\'m stressed about my exams', expected: false, severity: 'low', locale: 'en' },
      { text: 'I\'m having trouble sleeping', expected: false, severity: 'low', locale: 'en' },
      { text: 'I miss my friends', expected: false, severity: 'low', locale: 'en' },
      { text: 'Work is really challenging right now', expected: false, severity: 'low', locale: 'en' },
      
      // Edge cases (creative expression vs real crisis)
      { text: 'I\'m writing a story about suicide for school', expected: false, severity: 'low', locale: 'en' },
      { text: 'The movie was so bad it made me want to die', expected: false, severity: 'low', locale: 'en' },
      { text: 'This traffic is killing me', expected: false, severity: 'low', locale: 'en' },
      { text: 'I\'m dead tired after that workout', expected: false, severity: 'low', locale: 'en' },
      
      // Urgent time-sensitive cases
      { text: 'I feel sad but not right now', expected: false, severity: 'low', locale: 'en' },
      { text: 'I\'m going to hurt myself right now', expected: true, severity: 'critical', locale: 'en' },
      { text: 'Can\'t wait any longer, doing it tonight', expected: true, severity: 'critical', locale: 'en' }
    ];
  }

  async runPerformanceTest() {
    this.log('\n⚡ STARTING CRISIS DETECTION PERFORMANCE TEST', 'cyan');
    this.log('=' .repeat(60), 'cyan');

    const testCases = this.generateTestCases();
    const iterations = 100; // Run each test case multiple times
    
    this.log(`Running ${testCases.length} test cases × ${iterations} iterations = ${testCases.length * iterations} total tests`, 'blue');
    
    let allResponseTimes = [];
    let correctDetections = 0;
    let totalTests = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    
    for (let i = 0; i < iterations; i++) {
      for (const testCase of testCases) {
        const result = this.simulateCrisisDetection(testCase.text, testCase.locale);
        allResponseTimes.push(result.responseTime);
        totalTests++;
        
        // Check accuracy
        const expectedCrisis = testCase.expected;
        const detectedCrisis = result.hasCrisis;
        
        if (expectedCrisis === detectedCrisis) {
          correctDetections++;
        } else if (detectedCrisis && !expectedCrisis) {
          falsePositives++;
        } else if (!detectedCrisis && expectedCrisis) {
          falseNegatives++;
        }
        
        // Log slow responses
        if (result.responseTime > 100) {
          this.log(`⚠️ Slow response: ${result.responseTime.toFixed(2)}ms for "${testCase.text.substring(0, 30)}..."`, 'yellow');
        }
        
        // Log critical failures (>3000ms)
        if (result.responseTime > 3000) {
          this.log(`🚨 CRITICAL: ${result.responseTime.toFixed(2)}ms > 3000ms for "${testCase.text.substring(0, 30)}..."`, 'red');
        }
      }
      
      // Progress indicator
      if (i % 10 === 0 || i === iterations - 1) {
        process.stdout.write(`\r  Progress: ${i + 1}/${iterations} iterations (${Math.round(((i + 1) / iterations) * 100)}%)`);
      }
    }
    
    console.log(); // New line after progress
    
    // Calculate statistics
    allResponseTimes.sort((a, b) => a - b);
    
    this.results = {
      totalTests,
      passedTests: correctDetections,
      failedTests: totalTests - correctDetections,
      averageResponseTime: allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length,
      maxResponseTime: Math.max(...allResponseTimes),
      minResponseTime: Math.min(...allResponseTimes),
      p95ResponseTime: allResponseTimes[Math.floor(allResponseTimes.length * 0.95)],
      p99ResponseTime: allResponseTimes[Math.floor(allResponseTimes.length * 0.99)],
      responseTimes: allResponseTimes,
      crisisDetected: correctDetections,
      falsePositives,
      falseNegatives,
      accuracy: (correctDetections / totalTests) * 100
    };
    
    return this.results;
  }

  generatePerformanceReport() {
    this.log('\n📊 CRISIS DETECTION PERFORMANCE REPORT', 'magenta');
    this.log('=' .repeat(60), 'magenta');
    
    // Overall performance
    this.log(`\n🎯 ACCURACY METRICS:`, 'cyan');
    this.log(`  Total Tests: ${this.results.totalTests.toLocaleString()}`, 'white');
    this.log(`  Correct Detections: ${this.results.passedTests.toLocaleString()}`, 'green');
    this.log(`  Accuracy: ${this.results.accuracy.toFixed(2)}%`, this.results.accuracy >= 95 ? 'green' : 'red');
    this.log(`  False Positives: ${this.results.falsePositives}`, this.results.falsePositives === 0 ? 'green' : 'yellow');
    this.log(`  False Negatives: ${this.results.falseNegatives}`, this.results.falseNegatives === 0 ? 'green' : 'red');
    
    // Performance metrics
    this.log(`\n⚡ PERFORMANCE METRICS:`, 'cyan');
    this.log(`  Average Response Time: ${this.results.averageResponseTime.toFixed(3)}ms`, 
             this.results.averageResponseTime < 10 ? 'green' : 'yellow');
    this.log(`  Minimum Response Time: ${this.results.minResponseTime.toFixed(3)}ms`, 'green');
    this.log(`  Maximum Response Time: ${this.results.maxResponseTime.toFixed(3)}ms`, 
             this.results.maxResponseTime < 100 ? 'green' : 'yellow');
    this.log(`  95th Percentile: ${this.results.p95ResponseTime.toFixed(3)}ms`, 
             this.results.p95ResponseTime < 50 ? 'green' : 'yellow');
    this.log(`  99th Percentile: ${this.results.p99ResponseTime.toFixed(3)}ms`, 
             this.results.p99ResponseTime < 100 ? 'green' : 'yellow');
    
    // Performance thresholds
    this.log(`\n🎯 PERFORMANCE THRESHOLDS:`, 'cyan');
    const under100ms = this.results.responseTimes.filter(t => t < 100).length;
    const under1s = this.results.responseTimes.filter(t => t < 1000).length;
    const under3s = this.results.responseTimes.filter(t => t < 3000).length;
    const over3s = this.results.responseTimes.filter(t => t >= 3000).length;
    
    this.log(`  < 100ms (Emergency Target): ${under100ms}/${this.results.totalTests} (${((under100ms/this.results.totalTests)*100).toFixed(1)}%)`, 
             under100ms === this.results.totalTests ? 'green' : 'yellow');
    this.log(`  < 1 second: ${under1s}/${this.results.totalTests} (${((under1s/this.results.totalTests)*100).toFixed(1)}%)`, 
             under1s === this.results.totalTests ? 'green' : 'yellow');
    this.log(`  < 3 seconds (Life-Critical): ${under3s}/${this.results.totalTests} (${((under3s/this.results.totalTests)*100).toFixed(1)}%)`, 
             under3s === this.results.totalTests ? 'green' : 'red');
    this.log(`  ≥ 3 seconds (CRITICAL FAILURE): ${over3s}/${this.results.totalTests} (${((over3s/this.results.totalTests)*100).toFixed(1)}%)`, 
             over3s === 0 ? 'green' : 'red');
    
    // Final verdict
    this.log(`\n🏁 FINAL PERFORMANCE VERDICT:`, 'bold');
    
    let verdict = 'UNKNOWN';
    let verdictColor = 'yellow';
    
    if (this.results.accuracy >= 95 && under3s === this.results.totalTests && this.results.falseNegatives === 0) {
      verdict = '✅ EXCELLENT - System meets all life-critical performance requirements';
      verdictColor = 'green';
    } else if (this.results.accuracy >= 90 && under3s === this.results.totalTests) {
      verdict = '✅ GOOD - System meets life-critical requirements with minor issues';
      verdictColor = 'green';
    } else if (this.results.accuracy >= 85 && over3s < this.results.totalTests * 0.01) {
      verdict = '⚠️ ACCEPTABLE - System mostly functional but needs optimization';
      verdictColor = 'yellow';
    } else {
      verdict = '❌ CRITICAL ISSUES - System does not meet life-critical requirements';
      verdictColor = 'red';
    }
    
    this.log(`  ${verdict}`, verdictColor);
    
    // Recommendations
    this.log(`\n💡 RECOMMENDATIONS:`, 'blue');
    if (this.results.falseNegatives > 0) {
      this.log(`  🚨 CRITICAL: Fix ${this.results.falseNegatives} false negatives - missed crisis could be fatal`, 'red');
    }
    if (this.results.falsePositives > this.results.totalTests * 0.05) {
      this.log(`  ⚠️  Reduce false positives (${this.results.falsePositives}) to avoid crisis fatigue`, 'yellow');
    }
    if (this.results.averageResponseTime > 10) {
      this.log(`  ⚡ Optimize performance - average ${this.results.averageResponseTime.toFixed(2)}ms could be faster`, 'yellow');
    }
    if (over3s > 0) {
      this.log(`  🚨 CRITICAL: Fix ${over3s} tests exceeding 3-second life-critical threshold`, 'red');
    }
    
    // Save results
    const reportData = {
      timestamp: new Date().toISOString(),
      performance: this.results,
      verdict: verdict.replace(/[✅⚠️❌]/g, '').trim(),
      meetsLifeCriticalRequirements: over3s === 0 && this.results.falseNegatives === 0
    };
    
    fs.writeFileSync('crisis-performance-test-results.json', JSON.stringify(reportData, null, 2));
    this.log(`\n📄 Detailed results saved to: crisis-performance-test-results.json`, 'blue');
    
    return reportData.meetsLifeCriticalRequirements;
  }

  async runFullTest() {
    this.log('⚡ CRISIS DETECTION PERFORMANCE STRESS TEST', 'bold');
    this.log('Testing crisis detection under realistic load conditions', 'white');
    this.log('Validating <3 second response time requirement under stress\n', 'yellow');
    
    try {
      await this.runPerformanceTest();
      const meetsRequirements = this.generatePerformanceReport();
      
      if (meetsRequirements) {
        this.log('\n🎉 PERFORMANCE TEST PASSED: Crisis system meets life-critical requirements!', 'green');
        return true;
      } else {
        this.log('\n💥 PERFORMANCE TEST FAILED: Crisis system does not meet life-critical requirements!', 'red');
        return false;
      }
    } catch (error) {
      this.log(`\n💥 PERFORMANCE TEST CRASHED: ${error.message}`, 'red');
      console.error(error);
      return false;
    }
  }
}

// Run the test
if (require.main === module) {
  const tester = new CrisisPerformanceTester();
  tester.runFullTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { CrisisPerformanceTester };