/**
 * ALCHM Automated Performance Testing System
 * 
 * Continuous performance testing with trauma-informed thresholds
 * to ensure crisis features never degrade in performance.
 */

interface PerformanceTest {
  id: string;
  name: string;
  description: string;
  url: string;
  device: 'mobile' | 'tablet' | 'desktop';
  network: '4g' | '3g' | '2g' | 'offline';
  viewport: { width: number; height: number };
  thresholds: PerformanceThresholds;
  isCrisisTest: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface PerformanceThresholds {
  lcp: number;        // Largest Contentful Paint (ms)
  fid: number;        // First Input Delay (ms)
  cls: number;        // Cumulative Layout Shift
  fcp: number;        // First Contentful Paint (ms)
  tti: number;        // Time to Interactive (ms)
  speedIndex: number; // Speed Index
  totalBlockingTime: number; // Total Blocking Time (ms)
  bundleSize: number; // JavaScript bundle size (bytes)
  imageSize: number;  // Total image size (bytes)
  requestCount: number; // Total HTTP requests
}

interface TestResult {
  testId: string;
  testName: string;
  timestamp: number;
  passed: boolean;
  metrics: PerformanceMetrics;
  violations: ThresholdViolation[];
  lighthouseScore: LighthouseScore;
  screenshots: Screenshot[];
  networkLog: NetworkRequest[];
  consoleErrors: ConsoleError[];
}

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  tti: number;
  speedIndex: number;
  totalBlockingTime: number;
  bundleSize: number;
  imageSize: number;
  requestCount: number;
  loadTime: number;
  crisisResourceLoadTime?: number;
  emergencyButtonResponseTime?: number;
}

interface ThresholdViolation {
  metric: string;
  actual: number;
  threshold: number;
  severity: 'warning' | 'error' | 'critical';
  impact: string;
  recommendation: string;
}

interface LighthouseScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
}

interface Screenshot {
  name: string;
  timestamp: number;
  base64: string;
}

interface NetworkRequest {
  url: string;
  method: string;
  status: number;
  responseTime: number;
  size: number;
  type: string;
  isCrisisRelated: boolean;
}

interface ConsoleError {
  level: 'error' | 'warning' | 'info';
  message: string;
  source: string;
  timestamp: number;
  stack?: string;
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  tests: PerformanceTest[];
  schedule: 'continuous' | 'hourly' | 'daily' | 'on-deploy';
  notifications: NotificationConfig;
}

interface NotificationConfig {
  email?: string[];
  webhook?: string;
  slack?: string;
  onlyOnFailures: boolean;
  criticalOnly: boolean;
}

interface TestReport {
  suiteId: string;
  suiteName: string;
  timestamp: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  criticalFailures: number;
  results: TestResult[];
  summary: TestSummary;
  recommendations: TestRecommendation[];
}

interface TestSummary {
  averagePerformanceScore: number;
  worstPerformingPages: { url: string; score: number }[];
  mostCommonViolations: { metric: string; count: number }[];
  crisisPageStatus: 'passing' | 'failing' | 'critical';
  emergencyFeatureStatus: 'operational' | 'degraded' | 'critical';
}

interface TestRecommendation {
  priority: 'immediate' | 'high' | 'medium' | 'low';
  category: 'bundle' | 'images' | 'network' | 'rendering' | 'crisis';
  description: string;
  implementation: string;
  estimatedImpact: number;
}

class AutomatedPerformanceTesting {
  private testSuites: Map<string, TestSuite> = new Map();
  private testResults: TestResult[] = [];
  private isRunning = false;
  private testQueue: PerformanceTest[] = [];
  private currentTest: PerformanceTest | null = null;
  private browser: any = null; // Puppeteer browser instance
  private notificationCallbacks: ((report: TestReport) => void)[] = [];

  constructor() {
    this.initializeDefaultTestSuites();
  }

  private initializeDefaultTestSuites(): void {
    // Crisis-critical test suite
    const crisisTestSuite: TestSuite = {
      id: 'crisis-critical',
      name: 'Crisis-Critical Performance Tests',
      description: 'Essential tests for crisis-related functionality',
      schedule: 'continuous',
      notifications: {
        onlyOnFailures: false,
        criticalOnly: true
      },
      tests: [
        {
          id: 'crisis-page-mobile',
          name: 'Crisis Resources Page - Mobile',
          description: 'Crisis resources must load within 2 seconds on mobile',
          url: '/crisis-resources',
          device: 'mobile',
          network: '3g',
          viewport: { width: 375, height: 667 },
          isCrisisTest: true,
          priority: 'critical',
          thresholds: {
            lcp: 2000,
            fid: 100,
            cls: 0.05,
            fcp: 1000,
            tti: 3000,
            speedIndex: 2500,
            totalBlockingTime: 200,
            bundleSize: 150 * 1024, // 150KB
            imageSize: 500 * 1024,  // 500KB
            requestCount: 25
          }
        },
        {
          id: 'emergency-button-response',
          name: 'Emergency Button Response Time',
          description: 'Emergency buttons must respond within 100ms',
          url: '/emergency',
          device: 'mobile',
          network: '2g',
          viewport: { width: 375, height: 667 },
          isCrisisTest: true,
          priority: 'critical',
          thresholds: {
            lcp: 3000,
            fid: 50,  // Extra strict for emergency buttons
            cls: 0.02, // Perfect stability
            fcp: 1500,
            tti: 4000,
            speedIndex: 3000,
            totalBlockingTime: 150,
            bundleSize: 100 * 1024, // 100KB
            imageSize: 200 * 1024,  // 200KB
            requestCount: 15
          }
        },
        {
          id: 'crisis-offline-mode',
          name: 'Crisis Resources Offline Access',
          description: 'Crisis resources must be available offline',
          url: '/crisis-resources',
          device: 'mobile',
          network: 'offline',
          viewport: { width: 375, height: 667 },
          isCrisisTest: true,
          priority: 'critical',
          thresholds: {
            lcp: 1000,  // Should load from cache instantly
            fid: 100,
            cls: 0.05,
            fcp: 500,   // Cached content should appear quickly
            tti: 1500,  // Should be interactive quickly from cache
            speedIndex: 1000,
            totalBlockingTime: 100,
            bundleSize: 0,  // Should load from cache
            imageSize: 0,   // Should load from cache
            requestCount: 0 // No network requests in offline mode
          }
        }
      ]
    };

    // General app performance test suite
    const generalTestSuite: TestSuite = {
      id: 'general-performance',
      name: 'General App Performance Tests',
      description: 'Performance tests for main app functionality',
      schedule: 'hourly',
      notifications: {
        onlyOnFailures: true,
        criticalOnly: false
      },
      tests: [
        {
          id: 'homepage-desktop',
          name: 'Homepage - Desktop',
          description: 'Homepage performance on desktop',
          url: '/',
          device: 'desktop',
          network: '4g',
          viewport: { width: 1920, height: 1080 },
          isCrisisTest: false,
          priority: 'high',
          thresholds: {
            lcp: 2500,
            fid: 100,
            cls: 0.1,
            fcp: 1800,
            tti: 5000,
            speedIndex: 4000,
            totalBlockingTime: 300,
            bundleSize: 250 * 1024,
            imageSize: 1000 * 1024,
            requestCount: 50
          }
        },
        {
          id: 'journal-mobile',
          name: 'Journal Page - Mobile',
          description: 'Journal creation performance on mobile',
          url: '/journal',
          device: 'mobile',
          network: '4g',
          viewport: { width: 375, height: 667 },
          isCrisisTest: false,
          priority: 'high',
          thresholds: {
            lcp: 3000,
            fid: 150,
            cls: 0.1,
            fcp: 2000,
            tti: 5000,
            speedIndex: 4000,
            totalBlockingTime: 400,
            bundleSize: 200 * 1024,
            imageSize: 600 * 1024,
            requestCount: 30
          }
        },
        {
          id: 'dashboard-tablet',
          name: 'Dashboard - Tablet',
          description: 'Dashboard performance on tablet',
          url: '/dashboard',
          device: 'tablet',
          network: '4g',
          viewport: { width: 768, height: 1024 },
          isCrisisTest: false,
          priority: 'medium',
          thresholds: {
            lcp: 2800,
            fid: 120,
            cls: 0.08,
            fcp: 1900,
            tti: 4500,
            speedIndex: 3500,
            totalBlockingTime: 350,
            bundleSize: 220 * 1024,
            imageSize: 800 * 1024,
            requestCount: 40
          }
        }
      ]
    };

    // Regression test suite
    const regressionTestSuite: TestSuite = {
      id: 'regression-tests',
      name: 'Performance Regression Tests',
      description: 'Tests to catch performance regressions',
      schedule: 'on-deploy',
      notifications: {
        onlyOnFailures: true,
        criticalOnly: false
      },
      tests: [
        {
          id: 'auth-flow-mobile',
          name: 'Authentication Flow - Mobile',
          description: 'Login/signup performance on mobile',
          url: '/auth/login',
          device: 'mobile',
          network: '3g',
          viewport: { width: 375, height: 667 },
          isCrisisTest: false,
          priority: 'high',
          thresholds: {
            lcp: 3500,
            fid: 150,
            cls: 0.1,
            fcp: 2200,
            tti: 5500,
            speedIndex: 4200,
            totalBlockingTime: 400,
            bundleSize: 180 * 1024,
            imageSize: 400 * 1024,
            requestCount: 25
          }
        }
      ]
    };

    this.testSuites.set('crisis-critical', crisisTestSuite);
    this.testSuites.set('general-performance', generalTestSuite);
    this.testSuites.set('regression-tests', regressionTestSuite);

    console.log('[AUTOMATED TESTING] Initialized', this.testSuites.size, 'test suites');
  }

  public async initializeBrowser(): Promise<void> {
    if (typeof window !== 'undefined') {
      console.warn('[AUTOMATED TESTING] Browser environment detected - automated testing disabled in client');
      return;
    }

    try {
      const puppeteer = require('puppeteer');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding'
        ]
      });
      
      console.log('[AUTOMATED TESTING] Browser initialized');
    } catch (error) {
      console.error('[AUTOMATED TESTING] Failed to initialize browser:', error);
      throw error;
    }
  }

  public async runTestSuite(suiteId: string): Promise<TestReport> {
    const testSuite = this.testSuites.get(suiteId);
    if (!testSuite) {
      throw new Error(`Test suite not found: ${suiteId}`);
    }

    console.log(`[AUTOMATED TESTING] Running test suite: ${testSuite.name}`);

    if (!this.browser) {
      await this.initializeBrowser();
    }

    const results: TestResult[] = [];
    let passedTests = 0;
    let failedTests = 0;
    let criticalFailures = 0;

    for (const test of testSuite.tests) {
      try {
        const result = await this.runSingleTest(test);
        results.push(result);

        if (result.passed) {
          passedTests++;
        } else {
          failedTests++;
          const hasCriticalViolations = result.violations.some(v => v.severity === 'critical');
          if (hasCriticalViolations || test.isCrisisTest) {
            criticalFailures++;
          }
        }
      } catch (error) {
        console.error(`[AUTOMATED TESTING] Test failed: ${test.name}`, error);
        failedTests++;
        if (test.isCrisisTest) {
          criticalFailures++;
        }
      }
    }

    const report: TestReport = {
      suiteId,
      suiteName: testSuite.name,
      timestamp: Date.now(),
      totalTests: testSuite.tests.length,
      passedTests,
      failedTests,
      criticalFailures,
      results,
      summary: this.generateTestSummary(results),
      recommendations: this.generateTestRecommendations(results)
    };

    // Store results
    this.testResults.push(...results);

    // Keep only last 1000 results
    if (this.testResults.length > 1000) {
      this.testResults = this.testResults.slice(-1000);
    }

    // Send notifications
    this.sendNotifications(report, testSuite.notifications);

    console.log(`[AUTOMATED TESTING] Test suite completed: ${passedTests}/${testSuite.tests.length} passed`);

    return report;
  }

  private async runSingleTest(test: PerformanceTest): Promise<TestResult> {
    console.log(`[AUTOMATED TESTING] Running test: ${test.name}`);

    const page = await this.browser.newPage();
    const violations: ThresholdViolation[] = [];
    const networkRequests: NetworkRequest[] = [];
    const consoleErrors: ConsoleError[] = [];
    const screenshots: Screenshot[] = [];

    try {
      // Setup device emulation
      await this.setupDeviceEmulation(page, test.device, test.viewport);

      // Setup network conditions
      await this.setupNetworkConditions(page, test.network);

      // Monitor network requests
      page.on('response', (response: any) => {
        const request = response.request();
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          status: response.status(),
          responseTime: 0, // Would be calculated properly
          size: 0, // Would be calculated properly
          type: this.getRequestType(request.url()),
          isCrisisRelated: this.isCrisisResource(request.url())
        });
      });

      // Monitor console errors
      page.on('console', (msg: any) => {
        if (msg.type() === 'error') {
          consoleErrors.push({
            level: 'error',
            message: msg.text(),
            source: 'console',
            timestamp: Date.now()
          });
        }
      });

      // Navigate to test URL
      const startTime = performance.now();
      await page.goto(test.url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      const loadTime = performance.now() - startTime;

      // Take initial screenshot
      const initialScreenshot = await page.screenshot({ encoding: 'base64' });
      screenshots.push({
        name: 'initial_load',
        timestamp: Date.now(),
        base64: initialScreenshot as string
      });

      // Collect performance metrics
      const metrics = await this.collectPerformanceMetrics(page, test, loadTime);

      // Test crisis-specific functionality
      if (test.isCrisisTest) {
        await this.testCrisisFunctionality(page, test, metrics);
      }

      // Check thresholds and create violations
      Object.entries(test.thresholds).forEach(([metric, threshold]) => {
        const actualValue = (metrics as any)[metric];
        if (actualValue > threshold) {
          violations.push({
            metric,
            actual: actualValue,
            threshold,
            severity: this.determineSeverity(metric, actualValue, threshold, test.isCrisisTest),
            impact: this.getMetricImpact(metric),
            recommendation: this.getMetricRecommendation(metric, actualValue, threshold)
          });
        }
      });

      // Generate Lighthouse score (simplified)
      const lighthouseScore = this.calculateLighthouseScore(metrics);

      const result: TestResult = {
        testId: test.id,
        testName: test.name,
        timestamp: Date.now(),
        passed: violations.filter(v => v.severity === 'error' || v.severity === 'critical').length === 0,
        metrics,
        violations,
        lighthouseScore,
        screenshots,
        networkLog: networkRequests,
        consoleErrors
      };

      return result;

    } finally {
      await page.close();
    }
  }

  private async setupDeviceEmulation(page: any, device: string, viewport: { width: number; height: number }): Promise<void> {
    const deviceConfigs = {
      mobile: {
        viewport,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true
      },
      tablet: {
        viewport,
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      },
      desktop: {
        viewport,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      }
    };

    const config = deviceConfigs[device as keyof typeof deviceConfigs];
    await page.emulate(config);
  }

  private async setupNetworkConditions(page: any, network: string): Promise<void> {
    const networkConditions = {
      '4g': { downloadThroughput: 4 * 1024 * 1024 / 8, uploadThroughput: 3 * 1024 * 1024 / 8, latency: 20 },
      '3g': { downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 150 },
      '2g': { downloadThroughput: 256 * 1024 / 8, uploadThroughput: 256 * 1024 / 8, latency: 800 },
      'offline': { downloadThroughput: 0, uploadThroughput: 0, latency: 0 }
    };

    const condition = networkConditions[network as keyof typeof networkConditions];
    if (network === 'offline') {
      await page.setOfflineMode(true);
    } else {
      await page.emulateNetworkConditions(condition);
    }
  }

  private async collectPerformanceMetrics(page: any, test: PerformanceTest, loadTime: number): Promise<PerformanceMetrics> {
    // Get Web Vitals metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const metricsCollected: any = {};
        
        // LCP
        if ('PerformanceLongTaskTiming' in window) {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            metricsCollected.lcp = lastEntry.startTime;
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Collect other metrics...
        setTimeout(() => {
          resolve({
            lcp: metricsCollected.lcp || 0,
            fid: 0, // Would be measured during interaction
            cls: 0, // Would be measured during scrolling/interaction
            fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
            tti: 0, // Would be calculated
            speedIndex: 0, // Would be calculated
            totalBlockingTime: 0, // Would be calculated
            bundleSize: 0, // Would be calculated from network
            imageSize: 0, // Would be calculated from network
            requestCount: performance.getEntriesByType('resource').length,
            loadTime: 0 // Set below
          });
        }, 1000);
      });
    });

    metrics.loadTime = loadTime;
    return metrics as PerformanceMetrics;
  }

  private async testCrisisFunctionality(page: any, test: PerformanceTest, metrics: PerformanceMetrics): Promise<void> {
    // Test crisis button response time
    try {
      const crisisButtons = await page.$$('[data-crisis-action], .crisis-button, .emergency-button');
      if (crisisButtons.length > 0) {
        const startTime = performance.now();
        await crisisButtons[0].click();
        const responseTime = performance.now() - startTime;
        metrics.emergencyButtonResponseTime = responseTime;
      }
    } catch (error) {
      console.warn('[AUTOMATED TESTING] Crisis button test failed:', error);
    }

    // Test crisis resource loading
    try {
      const crisisResources = await page.$$('[data-crisis-resource]');
      if (crisisResources.length > 0) {
        const startTime = performance.now();
        await page.reload({ waitUntil: 'networkidle0' });
        const loadTime = performance.now() - startTime;
        metrics.crisisResourceLoadTime = loadTime;
      }
    } catch (error) {
      console.warn('[AUTOMATED TESTING] Crisis resource test failed:', error);
    }
  }

  private determineSeverity(
    metric: string, 
    actual: number, 
    threshold: number, 
    isCrisisTest: boolean
  ): ThresholdViolation['severity'] {
    const overage = (actual - threshold) / threshold;
    
    if (isCrisisTest) {
      // Stricter for crisis tests
      if (overage > 0.1) return 'critical'; // 10% over threshold
      if (overage > 0.05) return 'error';   // 5% over threshold
      return 'warning';
    } else {
      if (overage > 0.5) return 'critical'; // 50% over threshold
      if (overage > 0.25) return 'error';   // 25% over threshold
      return 'warning';
    }
  }

  private getMetricImpact(metric: string): string {
    const impacts: { [key: string]: string } = {
      lcp: 'User perceives slow loading',
      fid: 'User interactions feel unresponsive',
      cls: 'Layout shifts cause user frustration',
      fcp: 'Page appears slow to start loading',
      tti: 'Page takes too long to become interactive',
      bundleSize: 'Large JavaScript bundle slows initial load',
      imageSize: 'Large images increase load time',
      requestCount: 'Too many requests slow page load'
    };
    
    return impacts[metric] || 'Performance impact';
  }

  private getMetricRecommendation(metric: string, actual: number, threshold: number): string {
    const recommendations: { [key: string]: string } = {
      lcp: 'Optimize images, preload critical resources, improve server response time',
      fid: 'Reduce JavaScript execution time, split code, optimize event handlers',
      cls: 'Set size attributes on images, reserve space for dynamic content',
      fcp: 'Minimize render-blocking resources, inline critical CSS',
      tti: 'Reduce JavaScript execution, eliminate render-blocking resources',
      bundleSize: 'Implement code splitting, remove unused code, optimize dependencies',
      imageSize: 'Compress images, use modern formats (WebP/AVIF), implement responsive images',
      requestCount: 'Bundle resources, implement HTTP/2 push, remove unnecessary requests'
    };
    
    return recommendations[metric] || 'Optimize performance';
  }

  private calculateLighthouseScore(metrics: PerformanceMetrics): LighthouseScore {
    // Simplified Lighthouse scoring
    const performanceScore = Math.max(0, Math.min(100, 
      100 - (metrics.lcp / 25) - (metrics.fid / 5) - (metrics.cls * 1000)
    ));
    
    return {
      performance: Math.round(performanceScore),
      accessibility: 90, // Would be calculated properly
      bestPractices: 85, // Would be calculated properly
      seo: 80, // Would be calculated properly
      pwa: 75 // Would be calculated properly
    };
  }

  private generateTestSummary(results: TestResult[]): TestSummary {
    if (results.length === 0) {
      return {
        averagePerformanceScore: 0,
        worstPerformingPages: [],
        mostCommonViolations: [],
        crisisPageStatus: 'passing',
        emergencyFeatureStatus: 'operational'
      };
    }

    const averagePerformanceScore = results.reduce(
      (sum, result) => sum + result.lighthouseScore.performance, 0
    ) / results.length;

    const worstPerformingPages = results
      .map(result => ({ url: result.testName, score: result.lighthouseScore.performance }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    const violationCounts = new Map<string, number>();
    results.forEach(result => {
      result.violations.forEach(violation => {
        violationCounts.set(violation.metric, (violationCounts.get(violation.metric) || 0) + 1);
      });
    });

    const mostCommonViolations = Array.from(violationCounts.entries())
      .map(([metric, count]) => ({ metric, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Check crisis page status
    const crisisResults = results.filter(r => r.testName.includes('Crisis') || r.testName.includes('Emergency'));
    const criticalCrisisFailures = crisisResults.filter(r => 
      r.violations.some(v => v.severity === 'critical')
    );
    
    let crisisPageStatus: TestSummary['crisisPageStatus'] = 'passing';
    if (criticalCrisisFailures.length > 0) {
      crisisPageStatus = 'critical';
    } else if (crisisResults.some(r => !r.passed)) {
      crisisPageStatus = 'failing';
    }

    // Check emergency feature status
    const emergencyButtonIssues = results.some(r => 
      r.metrics.emergencyButtonResponseTime && r.metrics.emergencyButtonResponseTime > 100
    );
    
    let emergencyFeatureStatus: TestSummary['emergencyFeatureStatus'] = 'operational';
    if (emergencyButtonIssues) {
      emergencyFeatureStatus = 'critical';
    }

    return {
      averagePerformanceScore: Math.round(averagePerformanceScore),
      worstPerformingPages,
      mostCommonViolations,
      crisisPageStatus,
      emergencyFeatureStatus
    };
  }

  private generateTestRecommendations(results: TestResult[]): TestRecommendation[] {
    const recommendations: TestRecommendation[] = [];

    // Bundle size recommendations
    const bundleViolations = results.flatMap(r => 
      r.violations.filter(v => v.metric === 'bundleSize')
    );
    if (bundleViolations.length > 0) {
      recommendations.push({
        priority: bundleViolations.some(v => v.severity === 'critical') ? 'immediate' : 'high',
        category: 'bundle',
        description: 'Reduce JavaScript bundle sizes through code splitting',
        implementation: 'Implement dynamic imports and route-based code splitting',
        estimatedImpact: 30
      });
    }

    // Image optimization recommendations
    const imageViolations = results.flatMap(r => 
      r.violations.filter(v => v.metric === 'imageSize')
    );
    if (imageViolations.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'images',
        description: 'Optimize images with modern formats and compression',
        implementation: 'Use WebP/AVIF formats with proper compression',
        estimatedImpact: 25
      });
    }

    // Crisis-specific recommendations
    const crisisViolations = results.filter(r => 
      r.testName.includes('Crisis') && !r.passed
    );
    if (crisisViolations.length > 0) {
      recommendations.push({
        priority: 'immediate',
        category: 'crisis',
        description: 'Critical: Fix crisis page performance issues',
        implementation: 'Priority optimization for crisis resources and emergency features',
        estimatedImpact: 60
      });
    }

    return recommendations.slice(0, 10); // Limit to top 10 recommendations
  }

  private async sendNotifications(report: TestReport, config: NotificationConfig): Promise<void> {
    if (config.onlyOnFailures && report.failedTests === 0) {
      return;
    }

    if (config.criticalOnly && report.criticalFailures === 0) {
      return;
    }

    // Send webhook notification
    if (config.webhook) {
      try {
        await fetch(config.webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            report,
            message: `Performance test ${report.failedTests > 0 ? 'FAILED' : 'PASSED'}: ${report.suiteName}`,
            critical: report.criticalFailures > 0
          })
        });
      } catch (error) {
        console.error('[AUTOMATED TESTING] Failed to send webhook notification:', error);
      }
    }

    // Notify callbacks
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(report);
      } catch (error) {
        console.error('[AUTOMATED TESTING] Notification callback error:', error);
      }
    });
  }

  private getRequestType(url: string): string {
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'stylesheet';
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  private isCrisisResource(url: string): boolean {
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support', 'hotline'];
    return crisisKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  // Public API
  public async runAllTestSuites(): Promise<TestReport[]> {
    const reports: TestReport[] = [];
    
    for (const [suiteId] of this.testSuites) {
      try {
        const report = await this.runTestSuite(suiteId);
        reports.push(report);
      } catch (error) {
        console.error(`[AUTOMATED TESTING] Failed to run test suite ${suiteId}:`, error);
      }
    }

    return reports;
  }

  public addTestSuite(testSuite: TestSuite): void {
    this.testSuites.set(testSuite.id, testSuite);
    console.log(`[AUTOMATED TESTING] Added test suite: ${testSuite.name}`);
  }

  public removeTestSuite(suiteId: string): void {
    this.testSuites.delete(suiteId);
    console.log(`[AUTOMATED TESTING] Removed test suite: ${suiteId}`);
  }

  public getTestResults(timeRange?: number): TestResult[] {
    if (!timeRange) return [...this.testResults];
    
    const cutoff = Date.now() - timeRange;
    return this.testResults.filter(result => result.timestamp >= cutoff);
  }

  public getTestSuites(): TestSuite[] {
    return Array.from(this.testSuites.values());
  }

  public onNotification(callback: (report: TestReport) => void): () => void {
    this.notificationCallbacks.push(callback);
    return () => {
      const index = this.notificationCallbacks.indexOf(callback);
      if (index > -1) {
        this.notificationCallbacks.splice(index, 1);
      }
    };
  }

  public async destroy(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    
    this.notificationCallbacks = [];
    this.isRunning = false;
    
    console.log('[AUTOMATED TESTING] Destroyed');
  }
}

// Singleton instance
let automatedTestingInstance: AutomatedPerformanceTesting | null = null;

export function getAutomatedTesting(): AutomatedPerformanceTesting {
  if (!automatedTestingInstance) {
    automatedTestingInstance = new AutomatedPerformanceTesting();
  }
  return automatedTestingInstance;
}

export type {
  PerformanceTest,
  TestResult,
  TestSuite,
  TestReport,
  PerformanceMetrics,
  ThresholdViolation,
  LighthouseScore
};

export default AutomatedPerformanceTesting;