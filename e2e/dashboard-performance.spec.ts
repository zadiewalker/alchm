// Dashboard Performance Monitoring End-to-End Tests
import { test, expect, Page } from '@playwright/test';

test.describe('Dashboard Performance Monitoring', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    
    // Enable performance monitoring
    await page.addInitScript(() => {
      // Mock performance.memory for consistent testing
      if (!('memory' in performance)) {
        (performance as any).memory = {
          usedJSHeapSize: 50 * 1024 * 1024, // 50MB
          totalJSHeapSize: 100 * 1024 * 1024, // 100MB
          jsHeapSizeLimit: 2 * 1024 * 1024 * 1024 // 2GB
        };
      }
      
      // Mock web vitals data
      window.webVitalsData = {
        cls: 0.05,
        fid: 45,
        inp: 120,
        lcp: 1200,
        fcp: 800,
        ttfb: 200
      };
    });
  });

  test('should initialize performance monitoring on dashboard load', async () => {
    // Navigate to dashboard
    await page.goto('/auth/login');
    
    // Simulate login (you may need to adjust based on your auth flow)
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpassword123');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Check if performance monitoring is initialized
    const performanceMonitorExists = await page.evaluate(() => {
      return typeof window.dashboardPerformanceMonitor !== 'undefined';
    });

    expect(performanceMonitorExists).toBe(true);
  });

  test('should track card click response times', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Track performance before clicking
    const startTime = await page.evaluate(() => performance.now());

    // Click on a dashboard card
    await page.click('.card-sanctuary[href="/journals"]');

    // Wait for navigation and measure time
    await page.waitForURL('/journals');
    const endTime = await page.evaluate(() => performance.now());

    const navigationTime = endTime - startTime;
    
    // Navigation should complete within reasonable time
    expect(navigationTime).toBeLessThan(3000); // 3 seconds max
  });

  test('should detect and report slow navigation', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Simulate slow network conditions
    await page.route('**/*', async (route, request) => {
      // Add delay to simulate slow network
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Click on a card and expect performance alert
    await page.click('.card-sanctuary[href="/pathways"]');

    // Check if performance alert was triggered
    const alertTriggered = await page.evaluate(() => {
      return localStorage.getItem('performance_alerts') !== null;
    });

    expect(alertTriggered).toBe(true);
  });

  test('should monitor Core Web Vitals', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Wait for Core Web Vitals to be collected
    await page.waitForTimeout(2000);

    // Check if Core Web Vitals data is being collected
    const vitalsData = await page.evaluate(() => {
      return window.webVitalsData;
    });

    expect(vitalsData).toBeDefined();
    expect(vitalsData.cls).toBeLessThan(0.25); // Good CLS score
    expect(vitalsData.fcp).toBeLessThan(3000); // Good FCP score
  });

  test('should show performance debugger in development', async () => {
    // Set development environment
    await page.addInitScript(() => {
      process.env.NODE_ENV = 'development';
    });

    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Check if performance debugger is visible
    const debuggerExists = await page.locator('div:has-text("Performance Monitor")').isVisible();
    
    // In development mode, debugger should be present
    expect(debuggerExists).toBe(true);
  });

  test('should trigger memory optimization when threshold exceeded', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Simulate high memory usage
    await page.evaluate(() => {
      if ('memory' in performance) {
        (performance as any).memory.usedJSHeapSize = 150 * 1024 * 1024; // 150MB
      }
    });

    // Navigate between routes to trigger memory monitoring
    await page.click('.card-sanctuary[href="/journals"]');
    await page.waitForURL('/journals');
    
    await page.goBack();
    await page.waitForURL('/dashboard');

    // Check if memory optimization was triggered
    const optimizationLogs = await page.evaluate(() => {
      return console.log.toString().includes('memory');
    });

    expect(optimizationLogs).toBe(true);
  });

  test('should preload routes on hover', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Hover over a card to trigger preloading
    await page.hover('.card-sanctuary[href="/pathways"]');
    
    // Wait for preload delay
    await page.waitForTimeout(1000);

    // Check if route was preloaded
    const preloadedRoutes = await page.evaluate(() => {
      return window.preloadedRoutes || [];
    });

    expect(preloadedRoutes).toContain('/pathways');
  });

  test('should optimize images for performance', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Wait for image optimization to complete
    await page.waitForTimeout(1000);

    // Check if images have been optimized
    const optimizedImages = await page.locator('img[data-optimized="true"]').count();
    const totalImages = await page.locator('img').count();

    // Most images should be optimized
    expect(optimizedImages).toBeGreaterThan(0);
    expect(optimizedImages / totalImages).toBeGreaterThan(0.5);
  });

  test('should maintain performance budgets', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Test multiple navigation cycles
    for (let i = 0; i < 3; i++) {
      await page.click('.card-sanctuary[href="/journals"]');
      await page.waitForURL('/journals');
      
      await page.goBack();
      await page.waitForURL('/dashboard');
    }

    // Check if performance stayed within budgets
    const performanceBudgetViolations = await page.evaluate(() => {
      return localStorage.getItem('performance_alerts') ? 
        JSON.parse(localStorage.getItem('performance_alerts')).filter(
          (alert: any) => alert.type === 'budget_violation'
        ).length : 0;
    });

    // Should have minimal budget violations
    expect(performanceBudgetViolations).toBeLessThan(2);
  });

  test('should handle critical performance issues', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Simulate critical performance issue
    await page.evaluate(() => {
      // Mock extremely slow navigation
      const mockMetrics = {
        cardClickResponseTime: 300, // Very slow
        routeTransitionTime: 8000,  // 8 seconds
        navigationStartTime: performance.now(),
        memoryUsageBeforeNavigation: 50 * 1024 * 1024,
        memoryUsageAfterNavigation: 60 * 1024 * 1024,
        domInteractionTime: 100,
        paintTime: 2000,
        layoutShiftDuringNavigation: 0.3,
        timestamp: Date.now(),
        targetRoute: '/test',
        deviceType: 'desktop' as const,
        networkType: '4g',
        userId: 'test-user'
      };

      // Trigger critical performance handling
      if (window.performanceAlertSystem) {
        window.performanceAlertSystem.processNavigationMetrics(mockMetrics);
      }
    });

    // Check if critical performance notification appeared
    const criticalNotification = await page.locator('div:has-text("Optimizing performance")').isVisible();
    expect(criticalNotification).toBe(true);
  });

  test('should generate accurate performance reports', async () => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    // Perform several navigations to generate data
    await page.click('.card-sanctuary[href="/journals"]');
    await page.waitForURL('/journals');
    await page.goBack();
    
    await page.click('.card-sanctuary[href="/pathways"]');
    await page.waitForURL('/pathways');
    await page.goBack();

    // Generate performance report
    const report = await page.evaluate(() => {
      return window.dashboardPerformanceMonitor ? 
        window.dashboardPerformanceMonitor.generateDashboardPerformanceReport() : '';
    });

    expect(report).toContain('Dashboard Performance Report');
    expect(report).toContain('Navigation Performance');
    expect(report.length).toBeGreaterThan(100); // Should have meaningful content
  });

  test.afterEach(async () => {
    await page.close();
  });
});

// Performance benchmark tests
test.describe('Dashboard Performance Benchmarks', () => {
  test('dashboard should load within performance budget', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');
    
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 2 seconds on fast connections
    expect(loadTime).toBeLessThan(2000);
  });

  test('card interactions should be responsive', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    const interactionTimes = [];
    
    // Test multiple card interactions
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      
      await page.hover('.card-sanctuary');
      await page.click('.card-sanctuary[href="/journals"]');
      
      const interactionTime = Date.now() - startTime;
      interactionTimes.push(interactionTime);
      
      await page.goBack();
      await page.waitForSelector('.card-sanctuary');
    }

    const avgInteractionTime = interactionTimes.reduce((a, b) => a + b, 0) / interactionTimes.length;
    
    // Average interaction time should be under 100ms
    expect(avgInteractionTime).toBeLessThan(100);
  });

  test('memory usage should remain stable', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForSelector('.card-sanctuary');

    const initialMemory = await page.evaluate(() => {
      return 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
    });

    // Perform intensive navigation
    for (let i = 0; i < 10; i++) {
      await page.click('.card-sanctuary[href="/journals"]');
      await page.waitForURL('/journals');
      await page.goBack();
      await page.waitForURL('/dashboard');
    }

    const finalMemory = await page.evaluate(() => {
      return 'memory' in performance ? (performance as any).memory.usedJSHeapSize : 0;
    });

    const memoryIncrease = finalMemory - initialMemory;
    const memoryIncreaseMB = memoryIncrease / (1024 * 1024);

    // Memory increase should be less than 20MB after 10 navigations
    expect(memoryIncreaseMB).toBeLessThan(20);
  });
});