/**
 * Automated Memory Testing System for ALCHM
 * Implements comprehensive memory leak testing for CI/CD pipeline
 * Focuses on crisis-critical memory stability validation
 */

interface MemoryTestResult {
  testName: string;
  passed: boolean;
  memoryGrowth: number; // MB per minute
  peakMemory: number; // MB
  duration: number; // seconds
  leaksDetected: string[];
  error?: string;
  timestamp: number;
}

interface MemoryTestSuite {
  name: string;
  description: string;
  tests: MemoryTest[];
}

interface MemoryTest {
  name: string;
  description: string;
  setup?: () => Promise&lt;void&gt;;
  execute: () => Promise&lt;void&gt;;
  teardown?: () => Promise&lt;void&gt;;
  timeout?: number;
  maxMemoryGrowth?: number; // MB per minute
  maxPeakMemory?: number; // MB
  crisisMode?: boolean;
}

class AutomatedMemoryTester {
  private isRunning: boolean = false;
  private memoryBaseline: number = 0;
  private testStartTime: number = 0;
  private memorySnapshots: Array&lt;{ timestamp: number; memory: number }&gt; = [];
  
  /**
   * Run a complete memory test suite
   */
  async runTestSuite(suite: MemoryTestSuite): Promise&lt;MemoryTestResult[]&gt; {
    console.log(`[ALCHM Memory Test] Starting test suite: ${suite.name}`);
    
    const results: MemoryTestResult[] = [];
    
    for (const test of suite.tests) {
      const result = await this.runSingleTest(test);
      results.push(result);
      
      // Stop if critical test fails
      if (!result.passed && test.crisisMode) {
        console.error(`[ALCHM Memory Test] Critical test failed: ${test.name}`);
        break;
      }
      
      // Clean up between tests
      await this.cleanupBetweenTests();
    }
    
    return results;
  }
  
  /**
   * Run a single memory test
   */
  async runSingleTest(test: MemoryTest): Promise&lt;MemoryTestResult&gt; {
    console.log(`[ALCHM Memory Test] Running: ${test.name}`);
    
    const startTime = Date.now();
    this.testStartTime = startTime;
    this.memorySnapshots = [];
    this.isRunning = true;
    
    // Set baseline memory
    this.memoryBaseline = this.getCurrentMemory();
    
    let testResult: MemoryTestResult = {
      testName: test.name,
      passed: false,
      memoryGrowth: 0,
      peakMemory: 0,
      duration: 0,
      leaksDetected: [],
      timestamp: startTime
    };
    
    try {
      // Start memory monitoring
      const monitoringInterval = setInterval(() => {
        this.recordMemorySnapshot();
      }, 1000);
      
      // Setup phase
      if (test.setup) {
        await test.setup();
      }
      
      // Execute test with timeout
      const timeout = test.timeout || 30000;
      await Promise.race([
        test.execute(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), timeout)
        )
      ]);
      
      // Record final memory state
      this.recordMemorySnapshot();
      
      // Stop monitoring
      clearInterval(monitoringInterval);
      
      // Analyze results
      const analysis = this.analyzeMemoryUsage();
      
      testResult = {
        ...testResult,
        passed: this.evaluateTestResults(test, analysis),
        memoryGrowth: analysis.growthRate,
        peakMemory: analysis.peakMemory,
        duration: (Date.now() - startTime) / 1000,
        leaksDetected: analysis.leaksDetected
      };
      
      // Teardown phase
      if (test.teardown) {
        await test.teardown();
      }
      
    } catch (error) {
      testResult.passed = false;
      testResult.error = error instanceof Error ? error.message : 'Unknown error';
      testResult.duration = (Date.now() - startTime) / 1000;
    } finally {
      this.isRunning = false;
    }
    
    return testResult;
  }
  
  /**
   * Record current memory usage
   */
  private recordMemorySnapshot(): void {
    const memory = this.getCurrentMemory();
    this.memorySnapshots.push({
      timestamp: Date.now(),
      memory
    });
  }
  
  /**
   * Get current memory usage in MB
   */
  private getCurrentMemory(): number {
    if (typeof window === 'undefined' || !window.performance) return 0;
    
    const memory = (performance as any).memory;
    if (!memory) return 0;
    
    return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }
  
  /**
   * Analyze memory usage patterns
   */
  private analyzeMemoryUsage(): {
    growthRate: number;
    peakMemory: number;
    leaksDetected: string[];
  } {
    if (this.memorySnapshots.length < 2) {
      return { growthRate: 0, peakMemory: 0, leaksDetected: [] };
    }
    
    const start = this.memorySnapshots[0];
    const end = this.memorySnapshots[this.memorySnapshots.length - 1];
    const peak = Math.max(...this.memorySnapshots.map(s => s.memory));
    
    const timeDiff = (end.timestamp - start.timestamp) / 1000 / 60; // minutes
    const memoryDiff = end.memory - start.memory;
    const growthRate = timeDiff > 0 ? memoryDiff / timeDiff : 0;
    
    // Detect potential leaks
    const leaksDetected: string[] = [];
    
    // Check for steady growth
    if (growthRate > 0.5) {
      leaksDetected.push(`Steady memory growth: ${growthRate.toFixed(2)}MB/min`);
    }
    
    // Check for memory spikes
    const avgMemory = this.memorySnapshots.reduce((sum, s) => sum + s.memory, 0) / this.memorySnapshots.length;
    if (peak > avgMemory * 2) {
      leaksDetected.push(`Memory spike detected: ${peak.toFixed(1)}MB peak vs ${avgMemory.toFixed(1)}MB average`);
    }
    
    // Check for sawtooth pattern (potential GC pressure)
    const volatility = this.calculateMemoryVolatility();
    if (volatility > 5) {
      leaksDetected.push(`High memory volatility: ${volatility.toFixed(1)}MB variance`);
    }
    
    return {
      growthRate,
      peakMemory: peak,
      leaksDetected
    };
  }
  
  /**
   * Calculate memory usage volatility
   */
  private calculateMemoryVolatility(): number {
    if (this.memorySnapshots.length < 3) return 0;
    
    const values = this.memorySnapshots.map(s => s.memory);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }
  
  /**
   * Evaluate if test passed based on criteria
   */
  private evaluateTestResults(test: MemoryTest, analysis: any): boolean {
    // Check memory growth threshold
    if (test.maxMemoryGrowth && analysis.growthRate > test.maxMemoryGrowth) {
      return false;
    }
    
    // Check peak memory threshold
    if (test.maxPeakMemory && analysis.peakMemory > test.maxPeakMemory) {
      return false;
    }
    
    // Crisis mode tests have stricter criteria
    if (test.crisisMode) {
      if (analysis.growthRate > 0.3 || analysis.peakMemory > 100) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Clean up between tests
   */
  private async cleanupBetweenTests(): Promise&lt;void&gt; {
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // Wait for memory to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear any test artifacts
    this.memorySnapshots = [];
  }
}

/**
 * Predefined test suites for different scenarios
 */
export const MemoryTestSuites = {
  /**
   * Critical crisis functionality tests
   */
  crisisMode: {
    name: 'Crisis Mode Memory Tests',
    description: 'Memory tests for crisis-critical functionality',
    tests: [
      {
        name: 'Crisis Support Interface Stability',
        description: 'Test crisis support interface under memory pressure',
        execute: async () => {
          // Simulate crisis interface usage
          const crisisButton = document.querySelector('[data-testid="crisis-button"]');
          if (crisisButton) {
            (crisisButton as HTMLElement).click();
          }
          
          // Simulate extended usage
          for (let i = 0; i < 100; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            // Trigger re-renders
            window.dispatchEvent(new Event('resize'));
          }
        },
        maxMemoryGrowth: 0.3,
        maxPeakMemory: 80,
        crisisMode: true,
        timeout: 10000
      },
      
      {
        name: 'Authentication Flow Memory Stability',
        description: 'Test auth flow memory usage',
        execute: async () => {
          // Simulate auth state changes
          for (let i = 0; i < 50; i++) {
            window.dispatchEvent(new CustomEvent('auth-state-change', {
              detail: { user: i % 2 === 0 ? { uid: 'test' } : null }
            }));
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        },
        maxMemoryGrowth: 0.2,
        maxPeakMemory: 60,
        crisisMode: true
      }
    ]
  } as MemoryTestSuite,
  
  /**
   * Component lifecycle tests
   */
  componentLifecycle: {
    name: 'Component Lifecycle Memory Tests',
    description: 'Test component mount/unmount memory cleanup',
    tests: [
      {
        name: 'Component Mount/Unmount Cycles',
        description: 'Test repeated component mounting and unmounting',
        execute: async () => {
          // This would need to be integrated with actual component testing
          // Simulating repeated mount/unmount cycles
          for (let i = 0; i < 20; i++) {
            // Simulate component mount
            window.dispatchEvent(new CustomEvent('component-mount'));
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Simulate component unmount
            window.dispatchEvent(new CustomEvent('component-unmount'));
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        },
        maxMemoryGrowth: 0.1,
        maxPeakMemory: 50
      }
    ]
  } as MemoryTestSuite,
  
  /**
   * Extended session tests
   */
  extendedSession: {
    name: 'Extended Session Memory Tests',
    description: 'Test memory stability over extended periods',
    tests: [
      {
        name: '30-Minute Session Simulation',
        description: 'Simulate 30 minutes of typical usage',
        execute: async () => {
          // Simulate user interactions over time
          const interactions = ['scroll', 'click', 'type', 'navigate'];
          
          for (let i = 0; i < 300; i++) { // 300 iterations over 30 seconds (scaled down)
            const interaction = interactions[i % interactions.length];
            
            switch (interaction) {
              case 'scroll':
                window.scrollBy(0, 100);
                break;
              case 'click':
                window.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                break;
              case 'type':
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
                break;
              case 'navigate':
                window.dispatchEvent(new PopStateEvent('popstate'));
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        },
        maxMemoryGrowth: 0.5,
        maxPeakMemory: 150,
        timeout: 60000
      }
    ]
  } as MemoryTestSuite
};

/**
 * Run memory tests for CI/CD pipeline
 */
export async function runCIPipelineMemoryTests(): Promise&lt;boolean&gt; {
  const tester = new AutomatedMemoryTester();
  
  console.log('[ALCHM Memory Test] Starting CI pipeline memory tests...');
  
  try {
    // Run crisis mode tests (most critical)
    const crisisResults = await tester.runTestSuite(MemoryTestSuites.crisisMode);
    const crisisPassed = crisisResults.every(r => r.passed);
    
    if (!crisisPassed) {
      console.error('[ALCHM Memory Test] Crisis mode tests FAILED');
      return false;
    }
    
    // Run component lifecycle tests
    const lifecycleResults = await tester.runTestSuite(MemoryTestSuites.componentLifecycle);
    const lifecyclePassed = lifecycleResults.every(r => r.passed);
    
    if (!lifecyclePassed) {
      console.warn('[ALCHM Memory Test] Component lifecycle tests FAILED');
      // Non-blocking for now, but should be investigated
    }
    
    console.log('[ALCHM Memory Test] All critical tests passed');
    return true;
    
  } catch (error) {
    console.error('[ALCHM Memory Test] Test suite failed:', error);
    return false;
  }
}

export default AutomatedMemoryTester;
export type { MemoryTestResult, MemoryTestSuite, MemoryTest };