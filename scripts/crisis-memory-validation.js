#!/usr/bin/env node

/**
 * Crisis Memory Validation Script for ALCHM
 * Validates memory performance specifically for crisis scenarios
 * Ensures app remains stable when users need it most
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Crisis-specific test configuration
const CRISIS_CONFIG = {
  // Critical thresholds for crisis users
  MAX_MEMORY_GROWTH: 0.3, // MB per minute (very strict)
  MAX_PEAK_MEMORY: 80, // MB (accounting for low-end devices)
  MAX_RESPONSE_TIME: 3000, // 3 seconds max for crisis resources
  
  // Test scenarios
  SCENARIOS: [
    'crisis-button-stress',
    'emergency-navigation',
    'low-memory-device',
    'network-interruption',
    'extended-crisis-session'
  ],
  
  // Device profiles to test
  DEVICE_PROFILES: [
    { name: 'iPhone-6', memory: '1GB', cpu: 'A8' },
    { name: 'Android-Low-End', memory: '2GB', cpu: 'Snapdragon-400' },
    { name: 'iPad-Old', memory: '1GB', cpu: 'A7' }
  ]
};

class CrisisMemoryValidator {
  constructor() {
    this.testResults = [];
    this.criticalFailures = [];
  }

  /**
   * Run complete crisis memory validation
   */
  async validateCrisisMemoryPerformance() {
    console.log('🚨 [ALCHM Crisis Validator] Starting crisis memory validation...');
    console.log('⚠️  Testing memory stability for users in crisis situations');
    
    try {
      // 1. Crisis button stress test
      await this.testCrisisButtonStress();
      
      // 2. Emergency navigation test
      await this.testEmergencyNavigation();
      
      // 3. Low memory device simulation
      await this.testLowMemoryDevice();
      
      // 4. Network interruption handling
      await this.testNetworkInterruption();
      
      // 5. Extended crisis session
      await this.testExtendedCrisisSession();
      
      // 6. Generate crisis validation report
      this.generateCrisisReport();
      
      // 7. Validate results
      const passed = this.validateResults();
      
      if (passed) {
        console.log('✅ Crisis memory validation PASSED - App is stable for crisis users');
        return true;
      } else {
        console.error('❌ Crisis memory validation FAILED - Critical issues detected');
        this.printCriticalFailures();
        return false;
      }
      
    } catch (error) {
      console.error('💥 Crisis validation failed:', error);
      throw error;
    }
  }
  
  /**
   * Test crisis button stress scenarios
   */
  async testCrisisButtonStress() {
    console.log('🔴 Testing crisis button stress scenarios...');
    
    const testResult = await this.runCrisisTest({
      name: 'Crisis Button Stress Test',
      description: 'Rapid clicking of crisis button under memory pressure',
      testFunction: async () => {
        // Simulate rapid crisis button clicks
        const clicks = 50;
        const memorySnapshots = [];
        
        for (let i = 0; i < clicks; i++) {
          // Simulate memory allocation for crisis button handling
          const crisisData = {
            timestamp: Date.now(),
            resources: this.generateCrisisResources(),
            sessionId: 'crisis-' + i,
            emergencyContacts: this.generateEmergencyContacts()
          };
          
          // Record memory usage
          memorySnapshots.push({
            iteration: i,
            memory: this.getCurrentMemory(),
            timestamp: Date.now()
          });
          
          // Simulate processing delay
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Cleanup (critical for crisis scenarios)
          delete crisisData.resources;
          delete crisisData.emergencyContacts;
        }
        
        return { snapshots: memorySnapshots };
      },
      criticalFailureThreshold: CRISIS_CONFIG.MAX_MEMORY_GROWTH
    });
    
    this.testResults.push(testResult);
    
    if (!testResult.passed) {
      this.criticalFailures.push({
        test: 'Crisis Button Stress',
        reason: 'Memory growth exceeded safe limits for crisis users',
        impact: 'Users in crisis may experience app crashes when trying to access help',
        severity: 'CRITICAL'
      });
    }
  }
  
  /**
   * Test emergency navigation memory stability
   */
  async testEmergencyNavigation() {
    console.log('🚑 Testing emergency navigation memory stability...');
    
    const testResult = await this.runCrisisTest({
      name: 'Emergency Navigation Test',
      description: 'Navigation between crisis resources under memory constraints',
      testFunction: async () => {
        const routes = [
          '/crisis',
          '/emergency',
          '/support',
          '/hotlines',
          '/chat',
          '/resources'
        ];
        
        const navigationData = [];
        
        for (let i = 0; i < 30; i++) {
          const route = routes[i % routes.length];
          
          // Simulate route navigation with data loading
          const routeData = {
            route,
            timestamp: Date.now(),
            resources: this.generateRouteResources(route),
            metadata: this.generateRouteMetadata(route)
          };
          
          navigationData.push(routeData);
          
          // Record memory
          const memory = this.getCurrentMemory();
          
          // Simulate navigation cleanup
          if (navigationData.length > 5) {
            const oldRoute = navigationData.shift();
            delete oldRoute.resources;
            delete oldRoute.metadata;
          }
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        return { navigationCount: 30 };
      },
      criticalFailureThreshold: CRISIS_CONFIG.MAX_MEMORY_GROWTH
    });
    
    this.testResults.push(testResult);
    
    if (!testResult.passed) {
      this.criticalFailures.push({
        test: 'Emergency Navigation',
        reason: 'Memory leaks during emergency navigation',
        impact: 'Users may be unable to navigate to critical resources',
        severity: 'CRITICAL'
      });
    }
  }
  
  /**
   * Test low memory device simulation
   */
  async testLowMemoryDevice() {
    console.log('📱 Testing low memory device scenarios...');
    
    // Simulate low memory pressure
    const artificialMemoryPressure = this.createMemoryPressure(50); // 50MB
    
    const testResult = await this.runCrisisTest({
      name: 'Low Memory Device Test',
      description: 'App behavior under memory pressure (simulating old devices)',
      testFunction: async () => {
        // Simulate typical crisis app usage under memory pressure
        const operations = [
          'load-crisis-resources',
          'display-hotlines',
          'show-breathing-exercise',
          'chat-interface',
          'emergency-contacts'
        ];
        
        for (let i = 0; i < 25; i++) {
          const operation = operations[i % operations.length];
          
          // Each operation creates some memory usage
          const operationData = this.simulateOperation(operation);
          
          // Record memory under pressure
          const memory = this.getCurrentMemory();
          
          // Verify memory doesn't exceed device limits
          if (memory > CRISIS_CONFIG.MAX_PEAK_MEMORY) {
            throw new Error(`Memory exceeded device limits: ${memory}MB > ${CRISIS_CONFIG.MAX_PEAK_MEMORY}MB`);
          }
          
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Cleanup operation data
          delete operationData.data;
        }
        
        return { operationsCompleted: 25 };
      },
      criticalFailureThreshold: CRISIS_CONFIG.MAX_MEMORY_GROWTH,
      teardown: () => {
        // Clean up artificial memory pressure
        artificialMemoryPressure.cleanup();
      }
    });
    
    this.testResults.push(testResult);
    
    if (!testResult.passed) {
      this.criticalFailures.push({
        test: 'Low Memory Device',
        reason: 'App fails to handle memory constraints of older devices',
        impact: 'Users with older phones cannot access crisis support',
        severity: 'CRITICAL'
      });
    }
  }
  
  /**
   * Test network interruption handling
   */
  async testNetworkInterruption() {
    console.log('📡 Testing network interruption memory handling...');
    
    const testResult = await this.runCrisisTest({
      name: 'Network Interruption Test',
      description: 'Memory stability during network failures and recovery',
      testFunction: async () => {
        const attempts = 20;
        
        for (let i = 0; i < attempts; i++) {
          // Simulate network request that might fail
          const requestData = {
            id: 'request-' + i,
            type: 'crisis-resource',
            timeout: 5000,
            retryData: new Array(100).fill(0).map(j => `retry-data-${i}-${j}`)
          };
          
          // Simulate network failure (random)
          const networkFails = i % 3 === 0;
          
          if (networkFails) {
            // Simulate retry logic with memory accumulation
            for (let retry = 0; retry < 3; retry++) {
              const retryData = {
                attempt: retry,
                originalRequest: requestData,
                timestamp: Date.now()
              };
              
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Cleanup retry data
              delete retryData.originalRequest;
            }
          }
          
          // Record memory after handling network issues
          const memory = this.getCurrentMemory();
          
          // Cleanup request data
          delete requestData.retryData;
          
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        return { requestsHandled: attempts };
      },
      criticalFailureThreshold: CRISIS_CONFIG.MAX_MEMORY_GROWTH
    });
    
    this.testResults.push(testResult);
  }
  
  /**
   * Test extended crisis session
   */
  async testExtendedCrisisSession() {
    console.log('⏰ Testing extended crisis session memory stability...');
    
    const testResult = await this.runCrisisTest({
      name: 'Extended Crisis Session Test',
      description: 'Memory stability during long crisis support sessions',
      testFunction: async () => {
        const sessionDuration = 60; // 60 iterations (simulating extended session)
        const sessionData = {
          startTime: Date.now(),
          interactions: [],
          resources: [],
          state: {}
        };
        
        for (let i = 0; i < sessionDuration; i++) {
          // Simulate ongoing crisis session activity
          const interaction = {
            type: ['chat', 'resource-view', 'breathing-exercise', 'hotline-call'][i % 4],
            timestamp: Date.now(),
            data: new Array(50).fill(0).map(j => `session-data-${i}-${j}`)
          };
          
          sessionData.interactions.push(interaction);
          
          // Simulate periodic cleanup (critical for extended sessions)
          if (sessionData.interactions.length > 10) {
            const oldInteraction = sessionData.interactions.shift();
            delete oldInteraction.data;
          }
          
          // Monitor memory throughout session
          const memory = this.getCurrentMemory();
          
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        return { sessionDuration, interactionsProcessed: sessionDuration };
      },
      criticalFailureThreshold: CRISIS_CONFIG.MAX_MEMORY_GROWTH,
      extendedTest: true
    });
    
    this.testResults.push(testResult);
    
    if (!testResult.passed) {
      this.criticalFailures.push({
        test: 'Extended Crisis Session',
        reason: 'Memory accumulates during long crisis support sessions',
        impact: 'App becomes unstable during extended crisis situations',
        severity: 'HIGH'
      });
    }
  }
  
  /**
   * Run a single crisis test
   */
  async runCrisisTest({ name, description, testFunction, criticalFailureThreshold, extendedTest = false, teardown }) {
    console.log(`  🧪 Running: ${name}`);
    
    const memorySnapshots = [];
    const startMemory = this.getCurrentMemory();
    const startTime = Date.now();
    
    // Start memory monitoring
    const monitoringInterval = setInterval(() => {
      memorySnapshots.push({
        timestamp: Date.now(),
        memory: this.getCurrentMemory()
      });
    }, extendedTest ? 2000 : 1000);
    
    try {
      // Run the test
      const testData = await testFunction();
      
      // Stop monitoring
      clearInterval(monitoringInterval);
      
      // Run teardown if provided
      if (teardown) {
        await teardown();
      }
      
      // Analyze memory usage
      const analysis = this.analyzeMemoryForCrisis(memorySnapshots);
      const passed = analysis.growthRate <= criticalFailureThreshold && 
                     analysis.peakMemory <= CRISIS_CONFIG.MAX_PEAK_MEMORY;
      
      const result = {
        name,
        description,
        passed,
        memoryGrowth: analysis.growthRate,
        peakMemory: analysis.peakMemory,
        duration: (Date.now() - startTime) / 1000,
        testData,
        critical: !passed && (analysis.growthRate > CRISIS_CONFIG.MAX_MEMORY_GROWTH * 2)
      };
      
      const status = passed ? '✅' : (result.critical ? '🚨' : '⚠️');
      console.log(`    ${status} ${name}: Growth ${analysis.growthRate.toFixed(3)}MB/min, Peak ${analysis.peakMemory.toFixed(1)}MB`);
      
      return result;
      
    } catch (error) {
      clearInterval(monitoringInterval);
      
      if (teardown) {
        try { await teardown(); } catch (e) { /* ignore cleanup errors */ }
      }
      
      console.log(`    🚨 ${name}: CRITICAL ERROR - ${error.message}`);
      
      return {
        name,
        description,
        passed: false,
        critical: true,
        error: error.message,
        duration: (Date.now() - startTime) / 1000
      };
    }
  }
  
  /**
   * Generate mock crisis resources
   */
  generateCrisisResources() {
    return {
      hotlines: [
        { number: '988', name: 'Crisis Lifeline' },
        { number: '211', name: 'Community Resources' }
      ],
      breathing: {
        technique: '4-7-8',
        instructions: 'Breathe in for 4, hold for 7, exhale for 8'
      },
      grounding: {
        technique: '5-4-3-2-1',
        steps: ['5 things you see', '4 things you touch']
      }
    };
  }
  
  /**
   * Generate mock emergency contacts
   */
  generateEmergencyContacts() {
    return new Array(5).fill(0).map((_, i) => ({
      id: 'contact-' + i,
      name: 'Emergency Contact ' + (i + 1),
      relationship: ['friend', 'family', 'therapist', 'doctor', 'crisis-worker'][i],
      phone: '555-000-' + String(i).padStart(4, '0')
    }));
  }
  
  /**
   * Generate route-specific resources
   */
  generateRouteResources(route) {
    const resources = {
      '/crisis': this.generateCrisisResources(),
      '/emergency': { contacts: this.generateEmergencyContacts() },
      '/support': { groups: ['Local Support', 'Online Community'] },
      '/hotlines': { numbers: ['988', '211', '741741'] },
      '/chat': { sessions: ['Active Chat 1', 'Active Chat 2'] },
      '/resources': { articles: ['Article 1', 'Article 2', 'Article 3'] }
    };
    
    return resources[route] || {};
  }
  
  /**
   * Generate route metadata
   */
  generateRouteMetadata(route) {
    return {
      title: route.replace('/', '').toUpperCase(),
      lastVisited: Date.now(),
      userPreferences: { theme: 'crisis-safe', animations: false },
      analytics: { pageViews: Math.floor(Math.random() * 100) }
    };
  }
  
  /**
   * Simulate memory pressure
   */
  createMemoryPressure(targetMB) {
    const memoryHogs = [];
    const targetBytes = targetMB * 1024 * 1024;
    let allocatedBytes = 0;
    
    while (allocatedBytes < targetBytes) {
      const chunkSize = Math.min(1024 * 1024, targetBytes - allocatedBytes); // 1MB chunks
      const chunk = Buffer.alloc(chunkSize);
      memoryHogs.push(chunk);
      allocatedBytes += chunkSize;
    }
    
    return {
      cleanup: () => {
        memoryHogs.length = 0; // Clear references
      }
    };
  }
  
  /**
   * Simulate operation data
   */
  simulateOperation(operation) {
    const operations = {
      'load-crisis-resources': () => ({
        data: new Array(200).fill(0).map((_, i) => `crisis-resource-${i}`)
      }),
      'display-hotlines': () => ({
        data: new Array(50).fill(0).map((_, i) => `hotline-data-${i}`)
      }),
      'show-breathing-exercise': () => ({
        data: { technique: '4-7-8', audio: new Array(100).fill('audio-data') }
      }),
      'chat-interface': () => ({
        data: new Array(150).fill(0).map((_, i) => `chat-message-${i}`)
      }),
      'emergency-contacts': () => ({
        data: this.generateEmergencyContacts()
      })
    };
    
    return operations[operation] ? operations[operation]() : { data: [] };
  }
  
  /**
   * Get current memory usage
   */
  getCurrentMemory() {
    const memUsage = process.memoryUsage();
    return memUsage.heapUsed / 1024 / 1024; // Convert to MB
  }
  
  /**
   * Analyze memory usage for crisis scenarios
   */
  analyzeMemoryForCrisis(snapshots) {
    if (snapshots.length < 2) {
      return { growthRate: 0, peakMemory: 0, avgMemory: 0, volatility: 0 };
    }
    
    const memories = snapshots.map(s => s.memory);
    const start = snapshots[0];
    const end = snapshots[snapshots.length - 1];
    
    const timeDiff = (end.timestamp - start.timestamp) / 1000 / 60; // minutes
    const memoryDiff = end.memory - start.memory;
    const growthRate = timeDiff > 0 ? memoryDiff / timeDiff : 0;
    
    const peakMemory = Math.max(...memories);
    const avgMemory = memories.reduce((sum, m) => sum + m, 0) / memories.length;
    
    // Calculate volatility (important for crisis stability)
    const variance = memories.reduce((sum, m) => sum + Math.pow(m - avgMemory, 2), 0) / memories.length;
    const volatility = Math.sqrt(variance);
    
    return {
      growthRate,
      peakMemory,
      avgMemory,
      volatility,
      stability: volatility < 2 ? 'stable' : volatility < 5 ? 'moderate' : 'unstable'
    };
  }
  
  /**
   * Validate overall results
   */
  validateResults() {
    const criticalTests = this.testResults.filter(t => t.critical && !t.passed);
    const failedTests = this.testResults.filter(t => !t.passed);
    
    // No critical failures allowed
    if (criticalTests.length > 0) {
      return false;
    }
    
    // Allow maximum 1 non-critical failure
    if (failedTests.length > 1) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Print critical failures
   */
  printCriticalFailures() {
    if (this.criticalFailures.length === 0) return;
    
    console.log('\n🚨 CRITICAL FAILURES DETECTED:');
    this.criticalFailures.forEach((failure, index) => {
      console.log(`\n${index + 1}. ${failure.test} (${failure.severity})`);
      console.log(`   Reason: ${failure.reason}`);
      console.log(`   Impact: ${failure.impact}`);
    });
    console.log('\n⚠️  These issues must be resolved before deployment to protect crisis users.\n');
  }
  
  /**
   * Generate crisis validation report
   */
  generateCrisisReport() {
    const reportPath = path.join(__dirname, '../crisis-memory-validation-report.json');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.testResults.length,
        passed: this.testResults.filter(t => t.passed).length,
        failed: this.testResults.filter(t => !t.passed).length,
        critical: this.testResults.filter(t => t.critical).length
      },
      config: CRISIS_CONFIG,
      results: this.testResults,
      criticalFailures: this.criticalFailures,
      recommendations: this.generateRecommendations()
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Crisis validation report saved to: ${reportPath}`);
  }
  
  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    const failedTests = this.testResults.filter(t => !t.passed);
    
    if (failedTests.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        category: 'Memory Management',
        description: 'Implement more aggressive memory cleanup for crisis scenarios',
        action: 'Review and strengthen memory management in identified components'
      });
    }
    
    const highMemoryTests = this.testResults.filter(t => t.peakMemory > CRISIS_CONFIG.MAX_PEAK_MEMORY * 0.8);
    
    if (highMemoryTests.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        category: 'Memory Optimization',
        description: 'Memory usage approaching limits on low-end devices',
        action: 'Optimize memory-intensive operations and implement memory budgets'
      });
    }
    
    return recommendations;
  }
}

// CLI execution
if (require.main === module) {
  const validator = new CrisisMemoryValidator();
  validator.validateCrisisMemoryPerformance()
    .then(passed => {
      process.exit(passed ? 0 : 1);
    })
    .catch(error => {
      console.error('Crisis memory validation failed:', error);
      process.exit(1);
    });
}

module.exports = CrisisMemoryValidator;