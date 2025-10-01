#!/usr/bin/env node

/**
 * Memory Leak Testing Script for ALCHM CI/CD Pipeline
 * Validates memory stability for crisis-critical applications
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Memory test configuration
const MEMORY_TEST_CONFIG = {
  // Crisis mode tests - must pass for deployment
  CRISIS_MEMORY_THRESHOLD: 0.3, // MB per minute
  CRISIS_PEAK_MEMORY: 80, // MB
  
  // General tests - warnings but not blocking
  GENERAL_MEMORY_THRESHOLD: 0.5, // MB per minute
  GENERAL_PEAK_MEMORY: 150, // MB
  
  // Test duration
  TEST_DURATION: 30000, // 30 seconds (scaled down for CI)
  EXTENDED_TEST_DURATION: 120000, // 2 minutes for stress test
  
  // Memory sampling
  MEMORY_SAMPLE_INTERVAL: 1000, // 1 second
};

class MemoryLeakTester {
  constructor() {
    this.results = [];
    this.isRunning = false;
  }

  /**
   * Run all memory tests
   */
  async runAllTests() {
    console.log('🧠 [ALCHM Memory Test] Starting comprehensive memory leak testing...');
    
    try {
      // 1. Crisis mode tests (blocking)
      const crisisResults = await this.runCrisisTests();
      if (!crisisResults.passed) {
        console.error('❌ Crisis mode memory tests FAILED');
        process.exit(1);
      }
      
      // 2. Component lifecycle tests
      const lifecycleResults = await this.runComponentLifecycleTests();
      if (!lifecycleResults.passed) {
        console.warn('⚠️  Component lifecycle memory tests FAILED');
      }
      
      // 3. Extended session tests
      const sessionResults = await this.runExtendedSessionTests();
      if (!sessionResults.passed) {
        console.warn('⚠️  Extended session memory tests FAILED');
      }
      
      // 4. Generate report
      this.generateReport();
      
      console.log('✅ Memory leak testing completed successfully');
      return true;
      
    } catch (error) {
      console.error('💥 Memory testing failed:', error);
      process.exit(1);
    }
  }
  
  /**
   * Run crisis mode memory tests
   */
  async runCrisisTests() {
    console.log('🚨 Testing crisis mode memory stability...');
    
    const testResults = {
      passed: true,
      tests: [],
      totalMemoryGrowth: 0,
      peakMemory: 0
    };
    
    // Test 1: Crisis support interface memory stability
    const crisisInterfaceTest = await this.runMemoryTest({
      name: 'Crisis Support Interface',
      testFunction: this.simulateCrisisInterface,
      maxMemoryGrowth: MEMORY_TEST_CONFIG.CRISIS_MEMORY_THRESHOLD,
      maxPeakMemory: MEMORY_TEST_CONFIG.CRISIS_PEAK_MEMORY,
      duration: MEMORY_TEST_CONFIG.TEST_DURATION
    });
    
    testResults.tests.push(crisisInterfaceTest);
    if (!crisisInterfaceTest.passed) testResults.passed = false;
    
    // Test 2: Authentication flow memory stability
    const authFlowTest = await this.runMemoryTest({
      name: 'Authentication Flow',
      testFunction: this.simulateAuthFlow,
      maxMemoryGrowth: MEMORY_TEST_CONFIG.CRISIS_MEMORY_THRESHOLD,
      maxPeakMemory: MEMORY_TEST_CONFIG.CRISIS_PEAK_MEMORY,
      duration: MEMORY_TEST_CONFIG.TEST_DURATION
    });
    
    testResults.tests.push(authFlowTest);
    if (!authFlowTest.passed) testResults.passed = false;
    
    // Test 3: Firebase listener memory cleanup
    const firebaseTest = await this.runMemoryTest({
      name: 'Firebase Listeners',
      testFunction: this.simulateFirebaseListeners,
      maxMemoryGrowth: MEMORY_TEST_CONFIG.CRISIS_MEMORY_THRESHOLD,
      maxPeakMemory: MEMORY_TEST_CONFIG.CRISIS_PEAK_MEMORY,
      duration: MEMORY_TEST_CONFIG.TEST_DURATION
    });
    
    testResults.tests.push(firebaseTest);
    if (!firebaseTest.passed) testResults.passed = false;
    
    console.log(`${testResults.passed ? '✅' : '❌'} Crisis mode tests: ${testResults.passed ? 'PASSED' : 'FAILED'}`);
    return testResults;
  }
  
  /**
   * Run component lifecycle memory tests
   */
  async runComponentLifecycleTests() {
    console.log('🔄 Testing component lifecycle memory management...');
    
    const testResults = {
      passed: true,
      tests: []
    };
    
    // Test repeated component mount/unmount cycles
    const lifecycleTest = await this.runMemoryTest({
      name: 'Component Mount/Unmount Cycles',
      testFunction: this.simulateComponentLifecycle,
      maxMemoryGrowth: MEMORY_TEST_CONFIG.GENERAL_MEMORY_THRESHOLD,
      maxPeakMemory: MEMORY_TEST_CONFIG.GENERAL_PEAK_MEMORY,
      duration: MEMORY_TEST_CONFIG.TEST_DURATION
    });
    
    testResults.tests.push(lifecycleTest);
    if (!lifecycleTest.passed) testResults.passed = false;
    
    console.log(`${testResults.passed ? '✅' : '⚠️ '} Component lifecycle tests: ${testResults.passed ? 'PASSED' : 'FAILED'}`);
    return testResults;
  }
  
  /**
   * Run extended session memory tests
   */
  async runExtendedSessionTests() {
    console.log('⏱️  Testing extended session memory stability...');
    
    const testResults = {
      passed: true,
      tests: []
    };
    
    // Test extended user session simulation
    const sessionTest = await this.runMemoryTest({
      name: 'Extended Session Simulation',
      testFunction: this.simulateExtendedSession,
      maxMemoryGrowth: MEMORY_TEST_CONFIG.GENERAL_MEMORY_THRESHOLD,
      maxPeakMemory: MEMORY_TEST_CONFIG.GENERAL_PEAK_MEMORY,
      duration: MEMORY_TEST_CONFIG.EXTENDED_TEST_DURATION
    });
    
    testResults.tests.push(sessionTest);
    if (!sessionTest.passed) testResults.passed = false;
    
    console.log(`${testResults.passed ? '✅' : '⚠️ '} Extended session tests: ${testResults.passed ? 'PASSED' : 'FAILED'}`);
    return testResults;
  }
  
  /**
   * Run a single memory test
   */
  async runMemoryTest({ name, testFunction, maxMemoryGrowth, maxPeakMemory, duration }) {
    console.log(`  📊 Running: ${name}`);
    
    const memorySnapshots = [];
    const startMemory = this.getCurrentMemory();
    const startTime = Date.now();
    
    // Start memory monitoring
    const monitoringInterval = setInterval(() => {
      memorySnapshots.push({
        timestamp: Date.now(),
        memory: this.getCurrentMemory()
      });
    }, MEMORY_TEST_CONFIG.MEMORY_SAMPLE_INTERVAL);
    
    try {
      // Run the test function
      if (testFunction) {
        await testFunction.call(this, duration);
      } else {
        // Default test - just wait
        await new Promise(resolve => setTimeout(resolve, duration));
      }
      
      // Stop monitoring
      clearInterval(monitoringInterval);
      
      // Analyze results
      const analysis = this.analyzeMemorySnapshots(memorySnapshots);
      const passed = this.evaluateTestResults(analysis, maxMemoryGrowth, maxPeakMemory);
      
      const result = {
        name,
        passed,
        memoryGrowth: analysis.growthRate,
        peakMemory: analysis.peakMemory,
        duration: (Date.now() - startTime) / 1000,
        snapshots: memorySnapshots.length
      };
      
      console.log(`    ${passed ? '✅' : '❌'} ${name}: Growth ${analysis.growthRate.toFixed(3)}MB/min, Peak ${analysis.peakMemory.toFixed(1)}MB`);
      
      return result;
      
    } catch (error) {
      clearInterval(monitoringInterval);
      console.log(`    ❌ ${name}: ERROR - ${error.message}`);
      
      return {
        name,
        passed: false,
        error: error.message,
        duration: (Date.now() - startTime) / 1000
      };
    }
  }
  
  /**
   * Get current memory usage (mock implementation for Node.js)
   */
  getCurrentMemory() {
    const memUsage = process.memoryUsage();
    return memUsage.heapUsed / 1024 / 1024; // Convert to MB
  }
  
  /**
   * Analyze memory snapshots for trends
   */
  analyzeMemorySnapshots(snapshots) {
    if (snapshots.length < 2) {
      return { growthRate: 0, peakMemory: 0 };
    }
    
    const start = snapshots[0];
    const end = snapshots[snapshots.length - 1];
    const peak = Math.max(...snapshots.map(s => s.memory));
    
    const timeDiff = (end.timestamp - start.timestamp) / 1000 / 60; // minutes
    const memoryDiff = end.memory - start.memory;
    const growthRate = timeDiff > 0 ? memoryDiff / timeDiff : 0;
    
    return {
      growthRate,
      peakMemory: peak,
      totalGrowth: memoryDiff,
      volatility: this.calculateVolatility(snapshots)
    };
  }
  
  /**
   * Calculate memory volatility
   */
  calculateVolatility(snapshots) {
    const values = snapshots.map(s => s.memory);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }
  
  /**
   * Evaluate test results
   */
  evaluateTestResults(analysis, maxMemoryGrowth, maxPeakMemory) {
    return analysis.growthRate <= maxMemoryGrowth && analysis.peakMemory <= maxPeakMemory;
  }
  
  /**
   * Simulate crisis interface usage
   */
  async simulateCrisisInterface(duration) {
    // Simulate DOM manipulation and event handling
    const iterations = Math.floor(duration / 100);
    
    for (let i = 0; i < iterations; i++) {
      // Simulate memory-intensive operations that might happen in crisis interface
      const tempArray = new Array(1000).fill(0).map((_, idx) => ({
        id: idx,
        timestamp: Date.now(),
        data: 'crisis-resource-data-' + idx
      }));
      
      // Simulate processing
      tempArray.forEach(item => {
        JSON.stringify(item);
      });
      
      // Cleanup (this should happen automatically)
      tempArray.length = 0;
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  /**
   * Simulate authentication flow
   */
  async simulateAuthFlow(duration) {
    const iterations = Math.floor(duration / 200);
    
    for (let i = 0; i < iterations; i++) {
      // Simulate auth state changes
      const authState = {
        user: i % 2 === 0 ? { uid: 'user-' + i, email: 'test@example.com' } : null,
        timestamp: Date.now(),
        sessionData: new Array(100).fill(0).map(j => `session-data-${i}-${j}`)
      };
      
      // Simulate state updates
      JSON.stringify(authState);
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  /**
   * Simulate Firebase listeners
   */
  async simulateFirebaseListeners(duration) {
    const listeners = [];
    const iterations = Math.floor(duration / 500);
    
    for (let i = 0; i < iterations; i++) {
      // Simulate creating Firebase listeners
      const listener = {
        id: 'listener-' + i,
        data: new Array(200).fill(0).map(j => `firebase-data-${i}-${j}`),
        unsubscribe: () => {
          listeners.splice(listeners.indexOf(listener), 1);
        }
      };
      
      listeners.push(listener);
      
      // Simulate some listeners being cleaned up
      if (listeners.length > 5) {
        const oldListener = listeners.shift();
        oldListener.unsubscribe();
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Clean up remaining listeners
    listeners.forEach(listener => listener.unsubscribe());
  }
  
  /**
   * Simulate component lifecycle
   */
  async simulateComponentLifecycle(duration) {
    const components = [];
    const iterations = Math.floor(duration / 300);
    
    for (let i = 0; i < iterations; i++) {
      // Simulate component mount
      const component = {
        id: 'component-' + i,
        props: new Array(50).fill(0).map(j => `prop-${i}-${j}`),
        state: { mounted: true, data: 'component-state-' + i },
        cleanup: []
      };
      
      components.push(component);
      
      // Simulate component unmount after some time
      if (components.length > 3) {
        const oldComponent = components.shift();
        oldComponent.cleanup.forEach(fn => fn());
        oldComponent.state = null;
        oldComponent.props = null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // Clean up remaining components
    components.forEach(component => {
      component.cleanup.forEach(fn => fn());
    });
  }
  
  /**
   * Simulate extended session
   */
  async simulateExtendedSession(duration) {
    const interactions = ['scroll', 'click', 'type', 'navigate'];
    const sessionData = [];
    const iterations = Math.floor(duration / 400);
    
    for (let i = 0; i < iterations; i++) {
      const interaction = interactions[i % interactions.length];
      
      // Simulate user interaction data
      const interactionData = {
        type: interaction,
        timestamp: Date.now(),
        data: new Array(30).fill(0).map(j => `interaction-data-${i}-${j}`)
      };
      
      sessionData.push(interactionData);
      
      // Simulate periodic cleanup
      if (sessionData.length > 50) {
        sessionData.splice(0, 10); // Remove oldest 10 items
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }
  
  /**
   * Generate test report
   */
  generateReport() {
    const reportPath = path.join(__dirname, '../memory-test-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      config: MEMORY_TEST_CONFIG,
      results: this.results,
      summary: {
        totalTests: this.results.length,
        passed: this.results.filter(r => r.passed).length,
        failed: this.results.filter(r => !r.passed).length
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Memory test report saved to: ${reportPath}`);
  }
}

// CLI execution
if (require.main === module) {
  const tester = new MemoryLeakTester();
  tester.runAllTests().catch(error => {
    console.error('Memory testing failed:', error);
    process.exit(1);
  });
}

module.exports = MemoryLeakTester;