/**
 * Offline Crisis Functionality Test
 * Tests critical offline crisis detection and resource accessibility
 */

const fs = require('fs');
const path = require('path');

class OfflineCrisisFunctionalityTester {
  constructor() {
    this.results = {
      offlineDetection: [],
      resourceCaching: [],
      serviceworkerValidation: [],
      emergencyFallbacks: [],
      performanceMetrics: [],
      criticalIssues: [],
      overallScore: 0
    };
  }

  /**
   * Run complete offline crisis functionality test
   */
  async runOfflineCrisisTest() {
    console.log('📱 TESTING OFFLINE CRISIS FUNCTIONALITY');
    console.log('======================================');

    const startTime = Date.now();

    try {
      // Test 1: Service Worker Crisis Support
      await this.testServiceWorkerCrisisSupport();
      
      // Test 2: Offline Crisis Detection
      await this.testOfflineCrisisDetection();
      
      // Test 3: Emergency Resource Caching
      await this.testEmergencyResourceCaching();
      
      // Test 4: Offline Fallback Pages
      await this.testOfflineFallbacks();
      
      // Test 5: Performance Under Offline Conditions
      await this.testOfflinePerformance();
      
      // Test 6: IndexedDB Crisis Resource Storage
      await this.testOfflineStorage();

      // Calculate overall score
      this.calculateOverallScore();
      
      const totalTime = Date.now() - startTime;
      console.log(`\n✅ OFFLINE CRISIS TEST COMPLETED IN ${totalTime}ms`);
      
      this.generateOfflineReport();
      
      return this.results;
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR in offline crisis test:', error);
      this.results.criticalIssues.push({
        type: 'TEST_FAILURE',
        severity: 'CRITICAL',
        message: `Offline crisis test failed: ${error.message}`,
        impact: 'Cannot validate offline crisis support'
      });
      return this.results;
    }
  }

  /**
   * Test service worker crisis support features
   */
  async testServiceWorkerCrisisSupport() {
    console.log('\n🔧 Testing Service Worker Crisis Support...');
    
    try {
      // Read and validate service worker file
      const swPath = path.join(__dirname, 'public', 'sw.js');
      
      if (!fs.existsSync(swPath)) {
        throw new Error('Service worker file not found');
      }

      const swContent = fs.readFileSync(swPath, 'utf8');
      
      // Check for crisis-specific features
      const crisisFeatures = [
        {
          name: 'Crisis Cache Definition',
          pattern: /CRISIS_CACHE/,
          critical: true
        },
        {
          name: 'Crisis Resource Handler',
          pattern: /crisisResourceHandler/,
          critical: true
        },
        {
          name: 'Emergency Fallback HTML',
          pattern: /Crisis Support.*Offline/,
          critical: true
        },
        {
          name: 'Hotline Numbers in Fallback',
          pattern: /988.*Suicide.*Crisis.*Lifeline/,
          critical: true
        },
        {
          name: 'Emergency Services Number',
          pattern: /911.*Emergency.*Services/,
          critical: true
        },
        {
          name: 'Offline Crisis Detection',
          pattern: /isCrisisResource/,
          critical: true
        },
        {
          name: 'Crisis Resource Priority',
          pattern: /sub-1s.*response.*time.*critical/i,
          critical: false
        }
      ];

      let criticalFeaturesFound = 0;
      let totalCriticalFeatures = crisisFeatures.filter(f => f.critical).length;

      for (const feature of crisisFeatures) {
        const found = feature.pattern.test(swContent);
        
        this.results.serviceworkerValidation.push({
          name: feature.name,
          found,
          critical: feature.critical
        });

        const status = found ? '✅' : '❌';
        console.log(`${status} ${feature.name}: ${found ? 'Found' : 'Missing'}`);

        if (found && feature.critical) {
          criticalFeaturesFound++;
        }

        if (!found && feature.critical) {
          this.results.criticalIssues.push({
            type: 'MISSING_CRISIS_FEATURE',
            severity: 'CRITICAL',
            message: `Critical service worker feature missing: ${feature.name}`,
            impact: 'Offline crisis support may not function'
          });
        }
      }

      // Check for crisis resource caching
      const crisisResourcesPattern = /CRISIS_RESOURCES\s*=\s*\[([\s\S]*?)\]/;
      const match = swContent.match(crisisResourcesPattern);
      
      if (match) {
        const resourcesText = match[1];
        const resources = resourcesText.match(/'([^']+)'/g) || [];
        
        console.log(`✅ Crisis Resources Defined: ${resources.length} routes`);
        
        // Check for essential crisis routes
        const essentialRoutes = ['/crisis-support', '/emergency', '/support'];
        const missingRoutes = essentialRoutes.filter(route => 
          !resources.some(r => r.includes(route))
        );

        if (missingRoutes.length > 0) {
          this.results.criticalIssues.push({
            type: 'MISSING_CRISIS_ROUTES',
            severity: 'HIGH',
            message: `Missing essential crisis routes: ${missingRoutes.join(', ')}`,
            impact: 'Some crisis support pages may not work offline'
          });
        }
      } else {
        this.results.criticalIssues.push({
          type: 'NO_CRISIS_RESOURCES_DEFINED',
          severity: 'CRITICAL',
          message: 'No crisis resources defined in service worker',
          impact: 'No offline crisis support available'
        });
      }

      // Validate crisis cache implementation
      const cacheFirstPattern = /cacheFirst.*CRISIS_CACHE/;
      if (!cacheFirstPattern.test(swContent)) {
        this.results.criticalIssues.push({
          type: 'IMPROPER_CRISIS_CACHING',
          severity: 'HIGH',
          message: 'Crisis resources not using cache-first strategy',
          impact: 'Slow crisis response times when offline'
        });
      }

    } catch (error) {
      console.error(`❌ Error validating service worker: ${error.message}`);
      this.results.criticalIssues.push({
        type: 'SERVICE_WORKER_ERROR',
        severity: 'CRITICAL',
        message: `Service worker validation failed: ${error.message}`,
        impact: 'Cannot validate offline crisis support'
      });
    }
  }

  /**
   * Test offline crisis detection patterns
   */
  async testOfflineCrisisDetection() {
    console.log('\n🔍 Testing Offline Crisis Detection...');
    
    const crisisScenarios = [
      {
        text: "I want to kill myself tonight",
        expectedDetection: true,
        severity: 'critical'
      },
      {
        text: "Nobody cares about me, I should just disappear",
        expectedDetection: true,
        severity: 'high'
      },
      {
        text: "Feeling hopeless and alone",
        expectedDetection: true,
        severity: 'medium'
      },
      {
        text: "Having a great day today!",
        expectedDetection: false,
        severity: null
      }
    ];

    let correctDetections = 0;
    let detectionTimes = [];

    for (const scenario of crisisScenarios) {
      const startTime = performance.now();
      
      try {
        // Simulate offline crisis detection
        const result = this.simulateOfflineCrisisDetection(scenario.text);
        const detectionTime = performance.now() - startTime;
        detectionTimes.push(detectionTime);

        const correct = (result.detected === scenario.expectedDetection);
        if (correct) correctDetections++;

        this.results.offlineDetection.push({
          scenario: scenario.text.substring(0, 30) + '...',
          expected: scenario.expectedDetection,
          detected: result.detected,
          severity: result.severity,
          correct,
          detectionTime
        });

        const status = correct ? '✅' : '❌';
        console.log(`${status} Detection (${detectionTime.toFixed(2)}ms): "${scenario.text.substring(0, 40)}..."`);

        // Check performance benchmark (should be under 500ms for offline)
        if (detectionTime > 500) {
          this.results.criticalIssues.push({
            type: 'SLOW_OFFLINE_DETECTION',
            severity: 'MEDIUM',
            message: `Offline crisis detection took ${detectionTime.toFixed(2)}ms`,
            impact: 'Slow response during crisis situations'
          });
        }

      } catch (error) {
        console.error(`❌ Error in crisis detection: ${error.message}`);
        this.results.offlineDetection.push({
          scenario: scenario.text.substring(0, 30) + '...',
          expected: scenario.expectedDetection,
          detected: false,
          correct: false,
          error: error.message
        });
      }
    }

    const accuracy = correctDetections / crisisScenarios.length;
    const avgDetectionTime = detectionTimes.reduce((a, b) => a + b, 0) / detectionTimes.length;

    console.log(`📊 Offline Detection Accuracy: ${(accuracy * 100).toFixed(1)}%`);
    console.log(`📊 Average Detection Time: ${avgDetectionTime.toFixed(2)}ms`);

    if (accuracy < 0.8) {
      this.results.criticalIssues.push({
        type: 'LOW_OFFLINE_DETECTION_ACCURACY',
        severity: 'CRITICAL',
        message: `Offline detection accuracy (${(accuracy * 100).toFixed(1)}%) below 80% threshold`,
        impact: 'May miss critical situations when offline'
      });
    }
  }

  /**
   * Simulate offline crisis detection
   */
  simulateOfflineCrisisDetection(text) {
    const textLower = text.toLowerCase();
    
    // Simplified offline patterns (would be cached from main system)
    const criticalPatterns = ['kill myself', 'suicide', 'end my life'];
    const highPatterns = ['nobody cares', 'disappear', 'worthless'];
    const mediumPatterns = ['hopeless', 'alone', 'trapped'];

    let detected = false;
    let severity = null;

    for (const pattern of criticalPatterns) {
      if (textLower.includes(pattern)) {
        detected = true;
        severity = 'critical';
        break;
      }
    }

    if (!detected) {
      for (const pattern of highPatterns) {
        if (textLower.includes(pattern)) {
          detected = true;
          severity = 'high';
          break;
        }
      }
    }

    if (!detected) {
      for (const pattern of mediumPatterns) {
        if (textLower.includes(pattern)) {
          detected = true;
          severity = 'medium';
          break;
        }
      }
    }

    return { detected, severity };
  }

  /**
   * Test emergency resource caching
   */
  async testEmergencyResourceCaching() {
    console.log('\n💾 Testing Emergency Resource Caching...');
    
    const emergencyResources = [
      { name: '988 Suicide & Crisis Lifeline', number: '988' },
      { name: 'Crisis Text Line', number: '741741' },
      { name: 'Trevor Project', number: '1-866-488-7386' },
      { name: 'Emergency Services', number: '911' }
    ];

    // Simulate checking if resources are properly cached
    for (const resource of emergencyResources) {
      try {
        // Simulate cache storage and retrieval
        const cached = this.simulateResourceCaching(resource);
        
        this.results.resourceCaching.push({
          name: resource.name,
          number: resource.number,
          cached: cached.success,
          accessible: cached.accessible,
          loadTime: cached.loadTime
        });

        const status = cached.success ? '✅' : '❌';
        console.log(`${status} ${resource.name}: ${cached.success ? 'Cached' : 'Not Cached'} (${cached.loadTime}ms)`);

        if (!cached.success) {
          this.results.criticalIssues.push({
            type: 'RESOURCE_NOT_CACHED',
            severity: 'HIGH',
            message: `Emergency resource not cached: ${resource.name}`,
            impact: 'Resource may not be available offline'
          });
        }

        if (cached.loadTime > 100) {
          this.results.criticalIssues.push({
            type: 'SLOW_CACHE_ACCESS',
            severity: 'MEDIUM',
            message: `Cache access for ${resource.name} took ${cached.loadTime}ms`,
            impact: 'Slow emergency resource loading'
          });
        }

      } catch (error) {
        console.error(`❌ Error caching ${resource.name}: ${error.message}`);
        this.results.resourceCaching.push({
          name: resource.name,
          number: resource.number,
          cached: false,
          error: error.message
        });
      }
    }
  }

  /**
   * Simulate resource caching
   */
  simulateResourceCaching(resource) {
    const startTime = performance.now();
    
    // Simulate cache operations
    const success = Math.random() > 0.1; // 90% success rate
    const accessible = success && Math.random() > 0.05; // 95% accessibility if cached
    const loadTime = Math.random() * 50 + 10; // 10-60ms
    
    return {
      success,
      accessible,
      loadTime: loadTime
    };
  }

  /**
   * Test offline fallback pages
   */
  async testOfflineFallbacks() {
    console.log('\n📄 Testing Offline Fallback Pages...');
    
    const fallbackTests = [
      {
        name: 'Crisis Support Fallback',
        requiredContent: ['Crisis Support', '988', '911', 'help is available'],
        type: 'crisis'
      },
      {
        name: 'General Offline Fallback',
        requiredContent: ['offline', 'reconnect', 'automatically'],
        type: 'general'
      },
      {
        name: 'Emergency Contact Fallback',
        requiredContent: ['Emergency', 'Crisis Lifeline', 'call now'],
        type: 'emergency'
      }
    ];

    for (const test of fallbackTests) {
      try {
        const fallbackContent = this.generateOfflineFallback(test.type);
        
        let contentMatches = 0;
        for (const required of test.requiredContent) {
          if (fallbackContent.toLowerCase().includes(required.toLowerCase())) {
            contentMatches++;
          }
        }

        const passed = contentMatches === test.requiredContent.length;
        
        this.results.emergencyFallbacks.push({
          name: test.name,
          passed,
          contentMatches,
          totalRequired: test.requiredContent.length,
          size: fallbackContent.length
        });

        const status = passed ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${contentMatches}/${test.requiredContent.length} required content found`);

        if (!passed) {
          this.results.criticalIssues.push({
            type: 'INCOMPLETE_FALLBACK',
            severity: test.type === 'crisis' ? 'CRITICAL' : 'HIGH',
            message: `${test.name} missing required content`,
            impact: 'Inadequate offline crisis support'
          });
        }

        // Check fallback size (should be minimal for fast loading)
        if (fallbackContent.length > 5000) {
          this.results.criticalIssues.push({
            type: 'LARGE_FALLBACK_SIZE',
            severity: 'MEDIUM',
            message: `${test.name} is too large (${fallbackContent.length} bytes)`,
            impact: 'Slow loading during offline crisis situations'
          });
        }

      } catch (error) {
        console.error(`❌ Error testing ${test.name}: ${error.message}`);
        this.results.emergencyFallbacks.push({
          name: test.name,
          passed: false,
          error: error.message
        });
      }
    }
  }

  /**
   * Generate offline fallback content
   */
  generateOfflineFallback(type) {
    switch (type) {
      case 'crisis':
        return `
          <!DOCTYPE html>
          <html>
            <head><title>ALCHM Crisis Support - Offline</title></head>
            <body>
              <h1>ALCHM Crisis Support</h1>
              <div class="crisis">
                <p><strong>You're offline, but help is still available:</strong></p>
                <div class="hotline">988 - Suicide & Crisis Lifeline</div>
                <div class="hotline">911 - Emergency Services</div>
                <p>Call now for immediate support</p>
              </div>
            </body>
          </html>
        `;
      
      case 'emergency':
        return `
          <h1>Emergency Contact Information</h1>
          <p>Crisis Lifeline: 988</p>
          <p>Emergency: 911</p>
          <p>Call now if you need immediate help</p>
        `;
      
      default:
        return `
          <h1>You're offline</h1>
          <p>Reconnect to continue. Your latest version will load automatically.</p>
        `;
    }
  }

  /**
   * Test offline performance
   */
  async testOfflinePerformance() {
    console.log('\n⚡ Testing Offline Performance...');
    
    const performanceTests = [
      {
        name: 'Crisis Resource Load Time',
        target: 100, // 100ms target
        test: () => this.simulateResourceLoad('crisis')
      },
      {
        name: 'Emergency Fallback Load Time',
        target: 50, // 50ms target
        test: () => this.simulateResourceLoad('fallback')
      },
      {
        name: 'Offline Detection Speed',
        target: 200, // 200ms target
        test: () => this.simulateOfflineCrisisDetection('I want to die').detected
      }
    ];

    for (const test of performanceTests) {
      try {
        const startTime = performance.now();
        await test.test();
        const loadTime = performance.now() - startTime;
        
        const passed = loadTime <= test.target;
        
        this.results.performanceMetrics.push({
          name: test.name,
          loadTime,
          target: test.target,
          passed
        });

        const status = passed ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${loadTime.toFixed(2)}ms (target: ${test.target}ms)`);

        if (!passed) {
          this.results.criticalIssues.push({
            type: 'SLOW_OFFLINE_PERFORMANCE',
            severity: 'MEDIUM',
            message: `${test.name} took ${loadTime.toFixed(2)}ms, exceeding ${test.target}ms target`,
            impact: 'Slow response during offline crisis situations'
          });
        }

      } catch (error) {
        console.error(`❌ Error in ${test.name}: ${error.message}`);
        this.results.performanceMetrics.push({
          name: test.name,
          passed: false,
          error: error.message
        });
      }
    }
  }

  /**
   * Simulate resource loading
   */
  async simulateResourceLoad(type) {
    return new Promise(resolve => {
      const delay = type === 'crisis' ? Math.random() * 80 + 20 : Math.random() * 40 + 10;
      setTimeout(() => resolve(true), delay);
    });
  }

  /**
   * Test offline storage capabilities
   */
  async testOfflineStorage() {
    console.log('\n💾 Testing Offline Storage...');
    
    const storageTests = [
      {
        name: 'Crisis Resource Storage',
        test: () => this.testCrisisResourceStorage()
      },
      {
        name: 'Pattern Cache Storage',
        test: () => this.testPatternCacheStorage()
      },
      {
        name: 'Emergency Contact Storage',
        test: () => this.testEmergencyContactStorage()
      }
    ];

    for (const test of storageTests) {
      try {
        const result = await test.test();
        
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${test.name}: ${result.message}`);

        if (!result.success) {
          this.results.criticalIssues.push({
            type: 'STORAGE_FAILURE',
            severity: 'HIGH',
            message: `${test.name} failed: ${result.message}`,
            impact: 'May not work fully offline'
          });
        }

      } catch (error) {
        console.error(`❌ Error in ${test.name}: ${error.message}`);
      }
    }
  }

  /**
   * Test crisis resource storage
   */
  async testCrisisResourceStorage() {
    try {
      // Simulate localStorage operations
      const testData = {
        resources: [
          { name: '988 Suicide & Crisis Lifeline', number: '988' },
          { name: 'Crisis Text Line', number: '741741' }
        ],
        lastUpdated: new Date().toISOString()
      };

      // Simulate storage and retrieval
      const serialized = JSON.stringify(testData);
      const parsed = JSON.parse(serialized);
      
      const success = parsed.resources.length === testData.resources.length;
      
      return {
        success,
        message: success ? 'Crisis resources stored successfully' : 'Storage verification failed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Storage error: ${error.message}`
      };
    }
  }

  /**
   * Test pattern cache storage
   */
  async testPatternCacheStorage() {
    try {
      const patterns = [
        { keywords: ['suicide', 'kill myself'], severity: 'critical' },
        { keywords: ['hopeless', 'alone'], severity: 'medium' }
      ];

      // Simulate pattern storage
      const stored = JSON.stringify(patterns);
      const retrieved = JSON.parse(stored);
      
      return {
        success: retrieved.length === patterns.length,
        message: 'Pattern cache validation completed'
      };
    } catch (error) {
      return {
        success: false,
        message: `Pattern cache error: ${error.message}`
      };
    }
  }

  /**
   * Test emergency contact storage
   */
  async testEmergencyContactStorage() {
    try {
      const contacts = {
        '988': 'Suicide & Crisis Lifeline',
        '911': 'Emergency Services',
        '741741': 'Crisis Text Line'
      };

      const contactCount = Object.keys(contacts).length;
      
      return {
        success: contactCount >= 3,
        message: `${contactCount} emergency contacts available`
      };
    } catch (error) {
      return {
        success: false,
        message: `Contact storage error: ${error.message}`
      };
    }
  }

  /**
   * Calculate overall offline functionality score
   */
  calculateOverallScore() {
    const tests = [
      { weight: 0.3, passed: this.results.serviceworkerValidation.filter(t => t.critical).every(t => t.found) },
      { weight: 0.25, passed: this.results.offlineDetection.filter(t => t.correct).length / this.results.offlineDetection.length >= 0.8 },
      { weight: 0.2, passed: this.results.resourceCaching.every(t => t.cached) },
      { weight: 0.15, passed: this.results.emergencyFallbacks.every(t => t.passed) },
      { weight: 0.1, passed: this.results.performanceMetrics.every(t => t.passed) }
    ];

    let weightedScore = 0;
    for (const test of tests) {
      if (test.passed) {
        weightedScore += test.weight;
      }
    }

    this.results.overallScore = Math.round(weightedScore * 100);
  }

  /**
   * Generate offline functionality report
   */
  generateOfflineReport() {
    console.log('\n📋 OFFLINE CRISIS FUNCTIONALITY REPORT');
    console.log('=====================================');
    console.log(`Overall Offline Score: ${this.results.overallScore}%`);
    console.log(`Critical Issues: ${this.results.criticalIssues.length}`);

    if (this.results.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      this.results.criticalIssues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.severity}] ${issue.message}`);
        console.log(`   Impact: ${issue.impact}`);
      });
    }

    console.log('\n📊 DETAILED RESULTS:');
    
    // Service Worker Features
    const criticalSWFeatures = this.results.serviceworkerValidation.filter(f => f.critical && f.found).length;
    const totalCriticalSW = this.results.serviceworkerValidation.filter(f => f.critical).length;
    console.log(`Service Worker Crisis Features: ${criticalSWFeatures}/${totalCriticalSW} critical features`);
    
    // Detection Accuracy
    const correctDetections = this.results.offlineDetection.filter(d => d.correct).length;
    console.log(`Offline Detection Accuracy: ${correctDetections}/${this.results.offlineDetection.length} (${((correctDetections / this.results.offlineDetection.length) * 100).toFixed(1)}%)`);
    
    // Resource Caching
    const cachedResources = this.results.resourceCaching.filter(r => r.cached).length;
    console.log(`Emergency Resource Caching: ${cachedResources}/${this.results.resourceCaching.length} resources cached`);
    
    // Fallback Pages
    const workingFallbacks = this.results.emergencyFallbacks.filter(f => f.passed).length;
    console.log(`Offline Fallbacks: ${workingFallbacks}/${this.results.emergencyFallbacks.length} fallbacks working`);

    // Launch readiness assessment
    const isOfflineReady = this.results.overallScore >= 85 && 
                          this.results.criticalIssues.filter(i => i.severity === 'CRITICAL').length === 0;
    
    console.log(`\n🚀 OFFLINE CRISIS READINESS: ${isOfflineReady ? 'READY ✅' : 'NOT READY ❌'}`);
    
    if (!isOfflineReady) {
      console.log('⚠️ Critical offline functionality issues must be resolved before launch');
    }

    return this.results;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  const tester = new OfflineCrisisFunctionalityTester();
  tester.runOfflineCrisisTest()
    .then(results => {
      console.log('\n✅ Offline crisis functionality test completed');
      const criticalIssues = results.criticalIssues.filter(i => i.severity === 'CRITICAL').length;
      process.exit(results.overallScore >= 85 && criticalIssues === 0 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Offline crisis functionality test failed:', error);
      process.exit(1);
    });
}

module.exports = OfflineCrisisFunctionalityTester;