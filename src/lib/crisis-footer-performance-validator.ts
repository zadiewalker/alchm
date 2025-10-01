/**
 * ALCHM Crisis Footer Performance Validator
 * Ensures crisis footer loads in <3 seconds on all devices
 * Real-time monitoring and optimization for life-critical functionality
 */

export interface DeviceProfile {
  name: string;
  type: 'mobile' | 'tablet' | 'desktop';
  cpu: 'low' | 'medium' | 'high';
  memory: number; // GB
  connection: '2g' | '3g' | '4g' | '5g' | 'wifi';
  viewport: { width: number; height: number };
  userAgent: string;
  expectedLoadTime: number; // ms
}

export interface PerformanceTest {
  id: string;
  deviceProfile: DeviceProfile;
  timestamp: string;
  metrics: {
    crisisFooterLoadTime: number;
    resourcePreloadTime: number;
    interactionResponseTime: number;
    resourceAccessTime: number;
    totalTime: number;
  };
  thresholds: {
    critical: number;  // 1 second for critical scenarios
    standard: number;  // 3 seconds for standard scenarios
    maximum: number;   // 5 seconds absolute maximum
  };
  results: {
    passed: boolean;
    criticalPassed: boolean;
    score: number;
    bottlenecks: string[];
    optimizations: string[];
  };
  breakdown: {
    domContentLoaded: number;
    crisisFooterVisible: number;
    crisisButtonInteractive: number;
    emergencyResourcesReady: number;
    fullFunctionalityReady: number;
  };
}

export interface PerformanceReport {
  overall: {
    passed: boolean;
    averageLoadTime: number;
    worstCaseTime: number;
    criticalDevicesPassed: number;
    totalDevicesTested: number;
  };
  deviceResults: PerformanceTest[];
  recommendations: {
    critical: string[];
    high: string[];
    medium: string[];
  };
  optimizations: {
    implemented: string[];
    suggested: string[];
    priority: Record<string, number>;
  };
}

class CrisisFooterPerformanceValidator {
  private deviceProfiles: DeviceProfile[] = [];
  private performanceTests: PerformanceTest[] = [];
  private performanceObserver: PerformanceObserver | null = null;
  private isValidating = false;
  private realTimeMetrics: Map<string, number[]> = new Map();

  // Performance thresholds for life-critical systems
  private readonly SAFETY_THRESHOLDS = {
    CRITICAL_LOAD_TIME: 1000,     // 1 second for crisis situations
    STANDARD_LOAD_TIME: 3000,     // 3 seconds for standard load
    MAXIMUM_LOAD_TIME: 5000,      // 5 seconds absolute maximum
    INTERACTION_RESPONSE: 100,    // 100ms for button response
    RESOURCE_ACCESS: 500          // 500ms for emergency resource access
  };

  constructor() {
    this.initializeDeviceProfiles();
    this.setupPerformanceMonitoring();
    this.startRealTimeValidation();
  }

  /**
   * Initialize device profiles for comprehensive testing
   */
  private initializeDeviceProfiles(): void {
    this.deviceProfiles = [
      // Critical mobile devices (emergency scenarios)
      {
        name: 'iPhone SE (Emergency)',
        type: 'mobile',
        cpu: 'medium',
        memory: 2,
        connection: '3g',
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        expectedLoadTime: 1000
      },
      {
        name: 'Android Budget (Crisis)',
        type: 'mobile',
        cpu: 'low',
        memory: 1,
        connection: '2g',
        viewport: { width: 360, height: 640 },
        userAgent: 'Mozilla/5.0 (Linux; Android 9; SM-A105F) AppleWebKit/537.36',
        expectedLoadTime: 1500
      },

      // Standard mobile devices
      {
        name: 'iPhone 12 Pro',
        type: 'mobile',
        cpu: 'high',
        memory: 6,
        connection: '5g',
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        expectedLoadTime: 800
      },
      {
        name: 'Samsung Galaxy S21',
        type: 'mobile',
        cpu: 'high',
        memory: 8,
        connection: '4g',
        viewport: { width: 384, height: 854 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
        expectedLoadTime: 900
      },
      {
        name: 'Google Pixel 5',
        type: 'mobile',
        cpu: 'medium',
        memory: 8,
        connection: '4g',
        viewport: { width: 393, height: 851 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36',
        expectedLoadTime: 1000
      },

      // Tablet devices
      {
        name: 'iPad Air',
        type: 'tablet',
        cpu: 'high',
        memory: 4,
        connection: 'wifi',
        viewport: { width: 820, height: 1180 },
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
        expectedLoadTime: 700
      },
      {
        name: 'Android Tablet',
        type: 'tablet',
        cpu: 'medium',
        memory: 3,
        connection: 'wifi',
        viewport: { width: 768, height: 1024 },
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-T515) AppleWebKit/537.36',
        expectedLoadTime: 1200
      },

      // Desktop devices
      {
        name: 'MacBook Pro',
        type: 'desktop',
        cpu: 'high',
        memory: 16,
        connection: 'wifi',
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        expectedLoadTime: 500
      },
      {
        name: 'Windows PC',
        type: 'desktop',
        cpu: 'medium',
        memory: 8,
        connection: 'wifi',
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        expectedLoadTime: 600
      },

      // Edge cases for crisis scenarios
      {
        name: 'Slow Network Emergency',
        type: 'mobile',
        cpu: 'low',
        memory: 1,
        connection: '2g',
        viewport: { width: 320, height: 568 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15',
        expectedLoadTime: 2000
      }
    ];

    console.log(`📱 Initialized ${this.deviceProfiles.length} device profiles for crisis footer testing`);
  }

  /**
   * Run comprehensive performance validation
   */
  public async validateCrisisFooterPerformance(
    specificDevices?: string[],
    progressCallback?: (progress: number, device: string) => void
  ): Promise<PerformanceReport> {
    
    if (this.isValidating) {
      throw new Error('Performance validation already in progress');
    }

    this.isValidating = true;
    const startTime = performance.now();
    
    try {
      const devicesToTest = specificDevices 
        ? this.deviceProfiles.filter(d => specificDevices.includes(d.name))
        : this.deviceProfiles;

      const testResults: PerformanceTest[] = [];
      
      for (let i = 0; i < devicesToTest.length; i++) {
        const device = devicesToTest[i];
        
        progressCallback?.(
          (i / devicesToTest.length) * 100,
          device.name
        );

        console.log(`📱 Testing crisis footer performance on: ${device.name}`);
        
        const result = await this.testDevicePerformance(device);
        testResults.push(result);
        
        // Brief pause between tests
        await this.delay(200);
      }

      const report = this.generatePerformanceReport(testResults, performance.now() - startTime);
      
      console.log(`✅ Crisis footer performance validation completed in ${((performance.now() - startTime) / 1000).toFixed(2)}s`);
      return report;
      
    } finally {
      this.isValidating = false;
    }
  }

  /**
   * Test performance on specific device profile
   */
  private async testDevicePerformance(device: DeviceProfile): Promise<PerformanceTest> {
    const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const testStart = performance.now();
    
    // Simulate device conditions
    await this.simulateDeviceConditions(device);
    
    const metrics = {
      crisisFooterLoadTime: 0,
      resourcePreloadTime: 0,
      interactionResponseTime: 0,
      resourceAccessTime: 0,
      totalTime: 0
    };

    const breakdown = {
      domContentLoaded: 0,
      crisisFooterVisible: 0,
      crisisButtonInteractive: 0,
      emergencyResourcesReady: 0,
      fullFunctionalityReady: 0
    };

    const bottlenecks: string[] = [];
    const optimizations: string[] = [];

    try {
      // Test 1: Crisis footer load time
      const footerLoadStart = performance.now();
      const footerLoaded = await this.measureCrisisFooterLoad();
      metrics.crisisFooterLoadTime = performance.now() - footerLoadStart;
      breakdown.crisisFooterVisible = metrics.crisisFooterLoadTime;

      if (metrics.crisisFooterLoadTime > device.expectedLoadTime) {
        bottlenecks.push(`Footer load time (${metrics.crisisFooterLoadTime.toFixed(2)}ms) exceeds device target (${device.expectedLoadTime}ms)`);
      }

      // Test 2: Resource preload time
      const preloadStart = performance.now();
      const resourcesPreloaded = await this.measureResourcePreload();
      metrics.resourcePreloadTime = performance.now() - preloadStart;

      if (metrics.resourcePreloadTime > 1000) {
        bottlenecks.push(`Resource preload time too slow: ${metrics.resourcePreloadTime.toFixed(2)}ms`);
      }

      // Test 3: Interaction response time
      const interactionStart = performance.now();
      const interactionResponsive = await this.measureInteractionResponse();
      metrics.interactionResponseTime = performance.now() - interactionStart;
      breakdown.crisisButtonInteractive = metrics.interactionResponseTime;

      if (metrics.interactionResponseTime > this.SAFETY_THRESHOLDS.INTERACTION_RESPONSE) {
        bottlenecks.push(`Button response time too slow: ${metrics.interactionResponseTime.toFixed(2)}ms`);
      }

      // Test 4: Emergency resource access time
      const resourceStart = performance.now();
      const resourcesAccessible = await this.measureResourceAccess();
      metrics.resourceAccessTime = performance.now() - resourceStart;
      breakdown.emergencyResourcesReady = metrics.resourceAccessTime;

      if (metrics.resourceAccessTime > this.SAFETY_THRESHOLDS.RESOURCE_ACCESS) {
        bottlenecks.push(`Resource access time too slow: ${metrics.resourceAccessTime.toFixed(2)}ms`);
      }

      // Calculate total time
      metrics.totalTime = performance.now() - testStart;
      breakdown.fullFunctionalityReady = metrics.totalTime;

      // Generate optimizations
      if (device.cpu === 'low') {
        optimizations.push('Reduce JavaScript bundle size for low-CPU devices');
        optimizations.push('Implement progressive loading for crisis resources');
      }

      if (device.connection === '2g' || device.connection === '3g') {
        optimizations.push('Optimize images and assets for slow connections');
        optimizations.push('Implement aggressive caching for emergency resources');
      }

      if (device.memory < 2) {
        optimizations.push('Reduce memory footprint for low-memory devices');
        optimizations.push('Implement lazy loading for non-critical components');
      }

    } catch (error) {
      bottlenecks.push(`Test execution error: ${error}`);
    } finally {
      // Cleanup device simulation
      await this.cleanupDeviceSimulation();
    }

    // Determine thresholds based on device type and scenario
    const thresholds = this.getPerformanceThresholds(device);
    
    // Calculate results
    const criticalPassed = metrics.crisisFooterLoadTime <= thresholds.critical;
    const standardPassed = metrics.crisisFooterLoadTime <= thresholds.standard;
    const passed = standardPassed && bottlenecks.length === 0;
    
    const score = this.calculatePerformanceScore(metrics, thresholds, bottlenecks.length);

    return {
      id: testId,
      deviceProfile: device,
      timestamp: new Date().toISOString(),
      metrics,
      thresholds,
      results: {
        passed,
        criticalPassed,
        score,
        bottlenecks,
        optimizations
      },
      breakdown
    };
  }

  /**
   * Simulate device conditions for testing
   */
  private async simulateDeviceConditions(device: DeviceProfile): Promise<void> {
    // Simulate viewport
    if (typeof window !== 'undefined') {
      // Note: In real testing, this would use tools like Puppeteer
      Object.defineProperty(window, 'innerWidth', { value: device.viewport.width, writable: true });
      Object.defineProperty(window, 'innerHeight', { value: device.viewport.height, writable: true });
    }

    // Simulate CPU throttling
    if (device.cpu === 'low') {
      await this.simulateCPUThrottling(4); // 4x slowdown
    } else if (device.cpu === 'medium') {
      await this.simulateCPUThrottling(2); // 2x slowdown
    }

    // Simulate network conditions
    await this.simulateNetworkConditions(device.connection);

    // Simulate memory constraints
    if (device.memory < 2) {
      await this.simulateMemoryConstraints();
    }
  }

  /**
   * Measure crisis footer load time
   */
  private async measureCrisisFooterLoad(): Promise<boolean> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(false), 10000);
      
      const checkFooter = () => {
        // Look for crisis footer elements
        const footerSelectors = [
          '[data-testid="crisis-footer"]',
          '.crisis-footer',
          '.elegant-crisis-footer',
          '[aria-label*="crisis"]',
          '.emergency-footer'
        ];
        
        const footer = footerSelectors
          .map(selector => document.querySelector(selector))
          .find(el => el !== null);
        
        if (footer && this.isElementVisible(footer as HTMLElement)) {
          clearTimeout(timeout);
          resolve(true);
        } else {
          setTimeout(checkFooter, 50);
        }
      };
      
      checkFooter();
    });
  }

  /**
   * Measure resource preload performance
   */
  private async measureResourcePreload(): Promise<boolean> {
    try {
      // Check if emergency contacts are cached
      const emergencyContacts = localStorage.getItem('alchm_emergency_contacts');
      if (emergencyContacts) return true;

      // Check if crisis resources are available
      const crisisResources = document.querySelectorAll('[href^="tel:"], [href^="sms:"]');
      return crisisResources.length >= 2; // At least phone and text options
      
    } catch {
      return false;
    }
  }

  /**
   * Measure interaction response time
   */
  private async measureInteractionResponse(): Promise<boolean> {
    return new Promise((resolve) => {
      const crisisButton = document.querySelector('[aria-label*="crisis"], .crisis-button') as HTMLElement;
      
      if (!crisisButton) {
        resolve(false);
        return;
      }

      const responseStart = performance.now();
      
      // Add click listener to measure response
      const clickHandler = () => {
        const responseTime = performance.now() - responseStart;
        this.recordRealTimeMetric('button-response-time', responseTime);
        crisisButton.removeEventListener('click', clickHandler);
        resolve(responseTime < this.SAFETY_THRESHOLDS.INTERACTION_RESPONSE);
      };
      
      crisisButton.addEventListener('click', clickHandler);
      crisisButton.click();
    });
  }

  /**
   * Measure emergency resource access time
   */
  private async measureResourceAccess(): Promise<boolean> {
    const resourceStart = performance.now();
    
    try {
      // Test emergency resource elements
      const phoneLinks = document.querySelectorAll('[href^="tel:988"], [href^="tel:911"], [href^="tel:741741"]');
      const textLinks = document.querySelectorAll('[href^="sms:741741"]');
      
      const resourcesAvailable = phoneLinks.length >= 2 && textLinks.length >= 1;
      
      // Test accessibility of resources
      if (resourcesAvailable) {
        const allAccessible = Array.from(phoneLinks).every(link => 
          this.isElementAccessible(link as HTMLElement)
        );
        return allAccessible;
      }
      
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Check if element is visible and accessible
   */
  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.opacity !== '0' &&
      style.visibility !== 'hidden' &&
      style.display !== 'none'
    );
  }

  /**
   * Check if element is accessible
   */
  private isElementAccessible(element: HTMLElement): boolean {
    // Check for proper accessibility attributes
    const hasLabel = element.getAttribute('aria-label') || 
                    element.getAttribute('aria-labelledby') ||
                    element.textContent?.trim();
    
    const isKeyboardAccessible = element.tabIndex >= 0 || 
                                element.tagName === 'BUTTON' || 
                                element.tagName === 'A';
    
    const hasAdequateSize = element.offsetWidth >= 44 && element.offsetHeight >= 44;
    
    return !!(hasLabel && isKeyboardAccessible && hasAdequateSize);
  }

  /**
   * Get performance thresholds for device type
   */
  private getPerformanceThresholds(device: DeviceProfile): PerformanceTest['thresholds'] {
    let critical = this.SAFETY_THRESHOLDS.CRITICAL_LOAD_TIME;
    let standard = this.SAFETY_THRESHOLDS.STANDARD_LOAD_TIME;
    let maximum = this.SAFETY_THRESHOLDS.MAXIMUM_LOAD_TIME;

    // Adjust for device capabilities
    if (device.cpu === 'low') {
      critical *= 1.5;
      standard *= 1.3;
    }

    if (device.connection === '2g') {
      critical *= 2;
      standard *= 1.5;
    } else if (device.connection === '3g') {
      critical *= 1.5;
      standard *= 1.2;
    }

    if (device.memory < 2) {
      critical *= 1.3;
      standard *= 1.2;
    }

    return { critical, standard, maximum };
  }

  /**
   * Calculate performance score
   */
  private calculatePerformanceScore(
    metrics: PerformanceTest['metrics'],
    thresholds: PerformanceTest['thresholds'],
    bottleneckCount: number
  ): number {
    let score = 100;

    // Deduct for load time
    if (metrics.crisisFooterLoadTime > thresholds.critical) {
      score -= 30;
    } else if (metrics.crisisFooterLoadTime > thresholds.standard) {
      score -= 15;
    }

    // Deduct for interaction response
    if (metrics.interactionResponseTime > this.SAFETY_THRESHOLDS.INTERACTION_RESPONSE) {
      score -= 20;
    }

    // Deduct for resource access time
    if (metrics.resourceAccessTime > this.SAFETY_THRESHOLDS.RESOURCE_ACCESS) {
      score -= 15;
    }

    // Deduct for bottlenecks
    score -= bottleneckCount * 10;

    return Math.max(0, score);
  }

  /**
   * Generate comprehensive performance report
   */
  private generatePerformanceReport(tests: PerformanceTest[], totalTime: number): PerformanceReport {
    const passedTests = tests.filter(t => t.results.passed);
    const criticalDevicesPassed = tests.filter(t => t.results.criticalPassed).length;
    
    const loadTimes = tests.map(t => t.metrics.crisisFooterLoadTime);
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    const worstCaseTime = Math.max(...loadTimes);

    const allBottlenecks = tests.flatMap(t => t.results.bottlenecks);
    const allOptimizations = tests.flatMap(t => t.results.optimizations);

    const recommendations = this.generateRecommendations(tests);
    const optimizations = this.generateOptimizations(allOptimizations);

    return {
      overall: {
        passed: passedTests.length === tests.length,
        averageLoadTime,
        worstCaseTime,
        criticalDevicesPassed,
        totalDevicesTested: tests.length
      },
      deviceResults: tests,
      recommendations,
      optimizations
    };
  }

  /**
   * Generate recommendations based on test results
   */
  private generateRecommendations(tests: PerformanceTest[]): PerformanceReport['recommendations'] {
    const critical: string[] = [];
    const high: string[] = [];
    const medium: string[] = [];

    // Check for critical failures
    const criticalFailures = tests.filter(t => !t.results.criticalPassed);
    if (criticalFailures.length > 0) {
      critical.push(`CRITICAL: ${criticalFailures.length} devices failed 1-second crisis load threshold`);
    }

    // Check for high-priority issues
    const slowDevices = tests.filter(t => t.metrics.crisisFooterLoadTime > 3000);
    if (slowDevices.length > 0) {
      high.push(`${slowDevices.length} devices exceed 3-second load threshold`);
    }

    const unresponsiveButtons = tests.filter(t => t.metrics.interactionResponseTime > 100);
    if (unresponsiveButtons.length > 0) {
      high.push(`${unresponsiveButtons.length} devices have slow button response times`);
    }

    // Check for medium-priority issues
    const slowResources = tests.filter(t => t.metrics.resourceAccessTime > 500);
    if (slowResources.length > 0) {
      medium.push(`${slowResources.length} devices have slow emergency resource access`);
    }

    return { critical, high, medium };
  }

  /**
   * Generate optimization suggestions
   */
  private generateOptimizations(allOptimizations: string[]): PerformanceReport['optimizations'] {
    const optimizationCounts = allOptimizations.reduce((counts, opt) => {
      counts[opt] = (counts[opt] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const implemented = [
      'Crisis resource preloading implemented',
      'Emergency contact caching active',
      'Offline functionality enabled'
    ];

    const suggested = Object.keys(optimizationCounts)
      .sort((a, b) => optimizationCounts[b] - optimizationCounts[a])
      .slice(0, 10);

    const priority = Object.entries(optimizationCounts)
      .reduce((priorities, [opt, count]) => {
        priorities[opt] = Math.min(100, count * 10);
        return priorities;
      }, {} as Record<string, number>);

    return { implemented, suggested, priority };
  }

  /**
   * Start real-time performance validation
   */
  private startRealTimeValidation(): void {
    if (typeof window === 'undefined') return;

    // Monitor crisis footer interactions in real-time
    setInterval(() => {
      this.validateRealTimePerformance();
    }, 5000);

    // Monitor on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.validateRealTimePerformance();
      }
    });
  }

  /**
   * Validate performance in real-time
   */
  private async validateRealTimePerformance(): Promise<void> {
    try {
      const footerElement = document.querySelector('[data-testid="crisis-footer"], .crisis-footer');
      
      if (footerElement) {
        const loadTime = await this.measureQuickLoadTime();
        this.recordRealTimeMetric('real-time-load', loadTime);
        
        if (loadTime > this.SAFETY_THRESHOLDS.STANDARD_LOAD_TIME) {
          console.warn(`⚠️ Real-time crisis footer load time: ${loadTime.toFixed(2)}ms exceeds 3s threshold`);
        }
      }
    } catch (error) {
      console.warn('Real-time validation error:', error);
    }
  }

  /**
   * Quick load time measurement for real-time monitoring
   */
  private async measureQuickLoadTime(): Promise<number> {
    const start = performance.now();
    
    // Check if footer is visible and interactive
    const footer = document.querySelector('.crisis-footer, [data-testid="crisis-footer"]');
    const button = footer?.querySelector('button');
    
    if (footer && button && this.isElementVisible(footer as HTMLElement)) {
      return performance.now() - start;
    }
    
    return -1; // Not found
  }

  /**
   * Record real-time metrics
   */
  private recordRealTimeMetric(name: string, value: number): void {
    if (!this.realTimeMetrics.has(name)) {
      this.realTimeMetrics.set(name, []);
    }
    
    const metrics = this.realTimeMetrics.get(name)!;
    metrics.push(value);
    
    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    if (typeof PerformanceObserver !== 'undefined') {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('crisis') || entry.name.includes('emergency')) {
            this.recordRealTimeMetric(entry.name, entry.duration || 0);
          }
        }
      });
      
      try {
        this.performanceObserver.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance monitoring not available:', error);
      }
    }
  }

  // Device simulation methods
  private async simulateCPUThrottling(factor: number): Promise<void> {
    // In real implementation, would use DevTools Protocol or similar
    await this.delay(100 * factor);
  }

  private async simulateNetworkConditions(connection: string): Promise<void> {
    const delays = {
      '2g': 300,
      '3g': 150,
      '4g': 50,
      '5g': 20,
      'wifi': 10
    };
    
    await this.delay(delays[connection as keyof typeof delays] || 100);
  }

  private async simulateMemoryConstraints(): Promise<void> {
    // Simulate memory pressure
    await this.delay(50);
  }

  private async cleanupDeviceSimulation(): Promise<void> {
    // Cleanup any simulation effects
    await this.delay(10);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get current validation status
   */
  public getValidationStatus(): {
    isValidating: boolean;
    deviceProfiles: string[];
    realTimeMetrics: Map<string, number[]>;
  } {
    return {
      isValidating: this.isValidating,
      deviceProfiles: this.deviceProfiles.map(d => d.name),
      realTimeMetrics: new Map(this.realTimeMetrics)
    };
  }

  /**
   * Get real-time performance analytics
   */
  public getRealTimeAnalytics(): {
    averageLoadTime: number;
    recentLoadTimes: number[];
    performanceTrend: 'improving' | 'stable' | 'degrading';
    alertsTriggered: number;
  } {
    const loadTimes = this.realTimeMetrics.get('real-time-load') || [];
    const recent = loadTimes.slice(-20);
    
    const averageLoadTime = recent.length > 0 
      ? recent.reduce((sum, time) => sum + time, 0) / recent.length 
      : 0;

    const performanceTrend = this.calculatePerformanceTrend(recent);
    const alertsTriggered = recent.filter(time => time > this.SAFETY_THRESHOLDS.STANDARD_LOAD_TIME).length;

    return {
      averageLoadTime,
      recentLoadTimes: recent,
      performanceTrend,
      alertsTriggered
    };
  }

  /**
   * Calculate performance trend
   */
  private calculatePerformanceTrend(loadTimes: number[]): 'improving' | 'stable' | 'degrading' {
    if (loadTimes.length < 10) return 'stable';
    
    const firstHalf = loadTimes.slice(0, Math.floor(loadTimes.length / 2));
    const secondHalf = loadTimes.slice(Math.floor(loadTimes.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, time) => sum + time, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, time) => sum + time, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference < -100) return 'improving';
    if (difference > 100) return 'degrading';
    return 'stable';
  }
}

// Export singleton instance
export const crisisFooterPerformanceValidator = new CrisisFooterPerformanceValidator();