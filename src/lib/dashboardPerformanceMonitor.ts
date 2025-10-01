// Dashboard Navigation Performance Monitor
// Critical performance monitoring for ALCHM Dashboard navigation system
import { monitor } from './monitoring';
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { performanceAlertSystem } from './performanceAlertSystem';

export interface DashboardNavigationMetrics {
  cardClickResponseTime: number;
  navigationStartTime: number;
  routeTransitionTime: number;
  memoryUsageBeforeNavigation: number;
  memoryUsageAfterNavigation: number;
  domInteractionTime: number;
  paintTime: number;
  layoutShiftDuringNavigation: number;
  timestamp: number;
  targetRoute: string;
  userId?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  networkType: string;
}

export interface CoreWebVitalsSnapshot {
  cls: number;
  fid: number;
  inp: number;
  lcp: number;
  fcp: number;
  ttfb: number;
  timestamp: number;
  route: string;
}

export interface PerformanceAlert {
  type: 'navigation_slow' | 'memory_leak' | 'layout_shift' | 'interaction_delay' | 'route_timeout';
  severity: 'low' | 'medium' | 'high' | 'critical';
  metrics: Partial<DashboardNavigationMetrics>;
  timestamp: number;
  recommendations: string[];
}

// Critical performance thresholds for crisis-sensitive platform
const PERFORMANCE_THRESHOLDS = {
  // Navigation must be instant for users in crisis
  CARD_CLICK_RESPONSE: 50, // 50ms max for immediate feedback
  ROUTE_TRANSITION: 1200, // 1.2s max for complete navigation on 3G
  MEMORY_LEAK_THRESHOLD: 50 * 1024 * 1024, // 50MB increase indicates leak
  DOM_INTERACTION: 16, // 16ms for 60fps interaction
  LAYOUT_SHIFT_MAX: 0.05, // Extremely low CLS during navigation
  PAINT_TIME_MAX: 800, // 800ms max for first paint after navigation
} as const;

class DashboardPerformanceMonitor {
  private static instance: DashboardPerformanceMonitor | null = null;
  private metricsHistory: DashboardNavigationMetrics[] = [];
  private vitalsSnapshots: CoreWebVitalsSnapshot[] = [];
  private performanceAlerts: PerformanceAlert[] = [];
  private currentNavigation: Partial<DashboardNavigationMetrics> | null = null;
  private observersInitialized = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializePerformanceObservers();
      this.setupNavigationTracking();
      this.startCoreWebVitalsMonitoring();
    }
  }

  static getInstance(): DashboardPerformanceMonitor {
    if (!this.instance) {
      this.instance = new DashboardPerformanceMonitor();
    }
    return this.instance;
  }

  private initializePerformanceObservers(): void {
    if (this.observersInitialized || !('PerformanceObserver' in window)) return;
    this.observersInitialized = true;

    // Monitor long tasks that could impact navigation
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms during navigation
            this.reportPerformanceIssue('interaction_delay', 'high', {
              domInteractionTime: entry.duration,
              timestamp: Date.now(),
              targetRoute: 'unknown',
              cardClickResponseTime: 0,
              navigationStartTime: 0,
              routeTransitionTime: 0,
              memoryUsageBeforeNavigation: 0,
              memoryUsageAfterNavigation: 0,
              paintTime: 0,
              layoutShiftDuringNavigation: 0,
              deviceType: this.getDeviceType(),
              networkType: this.getNetworkType()
            }, [
              'Break up long JavaScript tasks during navigation',
              'Use requestIdleCallback for non-essential work',
              'Consider code splitting for dashboard components'
            ]);
          }
        }
      });
      
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }

    // Monitor navigation timing
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.analyzeNavigationPerformance(navEntry);
          }
        }
      });
      
      navigationObserver.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }

    // Monitor layout shifts specifically during navigation
    try {
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as any;
          if (this.currentNavigation && layoutShiftEntry.value > 0.01) {
            this.currentNavigation.layoutShiftDuringNavigation = 
              (this.currentNavigation.layoutShiftDuringNavigation || 0) + layoutShiftEntry.value;
          }
        }
      });
      
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('Layout shift observer not supported:', error);
    }
  }

  private setupNavigationTracking(): void {
    // Track dashboard card clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('.card-sanctuary, .card-pathway');
      
      if (cardElement) {
        this.startNavigationTracking(cardElement);
      }
    }, { passive: true });

    // Track route changes for Next.js App Router
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.onRouteChange();
      return originalPushState.apply(history, args);
    };

    history.replaceState = (...args) => {
      this.onRouteChange();
      return originalReplaceState.apply(history, args);
    };

    window.addEventListener('popstate', () => {
      this.onRouteChange();
    });
  }

  private startNavigationTracking(cardElement: Element): void {
    const startTime = performance.now();
    const targetLink = cardElement.querySelector('a') || cardElement as HTMLAnchorElement;
    const targetRoute = targetLink.getAttribute('href') || 'unknown';

    this.currentNavigation = {
      navigationStartTime: startTime,
      targetRoute,
      cardClickResponseTime: 0,
      timestamp: Date.now(),
      memoryUsageBeforeNavigation: this.getCurrentMemoryUsage(),
      deviceType: this.getDeviceType(),
      networkType: this.getNetworkType(),
      layoutShiftDuringNavigation: 0
    };

    // Measure click response time
    requestAnimationFrame(() => {
      if (this.currentNavigation) {
        this.currentNavigation.cardClickResponseTime = performance.now() - startTime;
        
        // Alert if click response is too slow
        if (this.currentNavigation.cardClickResponseTime > PERFORMANCE_THRESHOLDS.CARD_CLICK_RESPONSE) {
          this.reportPerformanceIssue('interaction_delay', 'high', {
            ...this.currentNavigation,
            routeTransitionTime: 0,
            memoryUsageAfterNavigation: 0,
            domInteractionTime: 0,
            paintTime: 0
          } as DashboardNavigationMetrics, [
            'Reduce JavaScript execution on main thread',
            'Optimize card hover/click event handlers',
            'Consider using CSS transforms for interactions'
          ]);
        }
      }
    });

    // Set timeout for maximum navigation time
    setTimeout(() => {
      if (this.currentNavigation && this.currentNavigation.navigationStartTime === startTime) {
        this.reportPerformanceIssue('route_timeout', 'critical', {
          ...this.currentNavigation,
          routeTransitionTime: performance.now() - startTime,
          memoryUsageAfterNavigation: this.getCurrentMemoryUsage(),
          domInteractionTime: 0,
          paintTime: 0
        } as DashboardNavigationMetrics, [
          'Route navigation timed out - check for JavaScript errors',
          'Verify network connectivity and API response times',
          'Consider implementing route preloading for dashboard'
        ]);
      }
    }, PERFORMANCE_THRESHOLDS.ROUTE_TRANSITION);
  }

  private onRouteChange(): void {
    if (!this.currentNavigation) return;

    const endTime = performance.now();
    const routeTransitionTime = endTime - this.currentNavigation.navigationStartTime!;
    const memoryAfter = this.getCurrentMemoryUsage();

    const completeMetrics: DashboardNavigationMetrics = {
      ...this.currentNavigation,
      routeTransitionTime,
      memoryUsageAfterNavigation: memoryAfter,
      domInteractionTime: this.measureDOMInteractionTime(),
      paintTime: this.getPaintTime()
    } as DashboardNavigationMetrics;

    this.metricsHistory.push(completeMetrics);
    this.analyzeNavigationMetrics(completeMetrics);
    
    // Process metrics through alert system
    performanceAlertSystem.processNavigationMetrics(completeMetrics);
    
    this.currentNavigation = null;

    // Keep only recent metrics in memory
    if (this.metricsHistory.length > 100) {
      this.metricsHistory = this.metricsHistory.slice(-50);
    }
  }

  private analyzeNavigationMetrics(metrics: DashboardNavigationMetrics): void {
    const issues: PerformanceAlert[] = [];

    // Check navigation speed
    if (metrics.routeTransitionTime > PERFORMANCE_THRESHOLDS.ROUTE_TRANSITION) {
      issues.push({
        type: 'navigation_slow',
        severity: metrics.routeTransitionTime > PERFORMANCE_THRESHOLDS.ROUTE_TRANSITION * 2 ? 'critical' : 'high',
        metrics,
        timestamp: Date.now(),
        recommendations: [
          'Optimize route components with React.lazy() and Suspense',
          'Implement route preloading for dashboard navigation',
          'Reduce bundle size for target route',
          'Check for blocking network requests during navigation'
        ]
      });
    }

    // Check memory usage
    const memoryIncrease = metrics.memoryUsageAfterNavigation - metrics.memoryUsageBeforeNavigation;
    if (memoryIncrease > PERFORMANCE_THRESHOLDS.MEMORY_LEAK_THRESHOLD) {
      issues.push({
        type: 'memory_leak',
        severity: 'high',
        metrics,
        timestamp: Date.now(),
        recommendations: [
          'Check for memory leaks in React components',
          'Ensure proper cleanup of event listeners',
          'Verify Firebase listeners are properly unsubscribed',
          'Use React DevTools Profiler to identify memory issues'
        ]
      });
    }

    // Check layout stability
    if (metrics.layoutShiftDuringNavigation > PERFORMANCE_THRESHOLDS.LAYOUT_SHIFT_MAX) {
      issues.push({
        type: 'layout_shift',
        severity: 'medium',
        metrics,
        timestamp: Date.now(),
        recommendations: [
          'Add skeleton screens for loading states',
          'Reserve space for dynamic content',
          'Optimize image loading with proper dimensions',
          'Use CSS containment for navigation transitions'
        ]
      });
    }

    // Report all identified issues
    issues.forEach(issue => {
      this.performanceAlerts.push(issue);
      this.sendPerformanceAlert(issue);
    });

    // Keep only recent alerts
    if (this.performanceAlerts.length > 50) {
      this.performanceAlerts = this.performanceAlerts.slice(-25);
    }
  }

  private startCoreWebVitalsMonitoring(): void {
    const recordVitals = () => {
      const snapshot: Partial<CoreWebVitalsSnapshot> = {
        timestamp: Date.now(),
        route: window.location.pathname
      };

      onCLS((metric) => {
        snapshot.cls = metric.value;
        this.checkVitalThreshold('CLS', metric.value, 0.1, 0.25);
      });

      // FID is deprecated in favor of INP in web-vitals v5
      // onFID is not available in this version

      onINP((metric) => {
        snapshot.inp = metric.value;
        this.checkVitalThreshold('INP', metric.value, 200, 500);
      });

      onLCP((metric) => {
        snapshot.lcp = metric.value;
        this.checkVitalThreshold('LCP', metric.value, 2500, 4000);
      });

      onFCP((metric) => {
        snapshot.fcp = metric.value;
        this.checkVitalThreshold('FCP', metric.value, 1800, 3000);
      });

      onTTFB((metric) => {
        snapshot.ttfb = metric.value;
        this.checkVitalThreshold('TTFB', metric.value, 800, 1800);
      });

      if (Object.keys(snapshot).length > 2) {
        this.vitalsSnapshots.push(snapshot as CoreWebVitalsSnapshot);
      }
    };

    // Record vitals on page load and route changes
    if (document.readyState === 'complete') {
      recordVitals();
    } else {
      window.addEventListener('load', recordVitals);
    }

    // Record vitals on visibility change (when user returns to tab)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        recordVitals();
      }
    });
  }

  private checkVitalThreshold(metric: string, value: number, good: number, needsImprovement: number): void {
    if (value > needsImprovement) {
      const severity = value > needsImprovement * 2 ? 'critical' : 'high';
      console.warn(`🚨 Poor ${metric} detected: ${value.toFixed(metric === 'CLS' ? 3 : 0)}${metric === 'CLS' ? '' : 'ms'}`);
      
      // Report to monitoring system
      monitor.reportError({
        message: `Poor ${metric} performance: ${value}`,
        component: 'CoreWebVitals',
        timestamp: Date.now(),
        severity: severity === 'critical' ? 'critical' : 'high',
        userAgent: navigator.userAgent,
        url: window.location.href,
        performanceMetrics: { [metric.toLowerCase()]: value }
      });
    }
  }

  private analyzeNavigationPerformance(navEntry: PerformanceNavigationTiming): void {
    const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
    const domContentLoadedTime = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
    const serverResponseTime = navEntry.responseEnd - navEntry.requestStart;

    if (loadTime > 3000) {
      this.reportPerformanceIssue('navigation_slow', 'high', {
        routeTransitionTime: loadTime,
        timestamp: Date.now(),
        targetRoute: window.location.pathname,
        cardClickResponseTime: 0,
        navigationStartTime: navEntry.startTime,
        memoryUsageBeforeNavigation: 0,
        memoryUsageAfterNavigation: this.getCurrentMemoryUsage(),
        domInteractionTime: domContentLoadedTime,
        paintTime: navEntry.loadEventEnd - navEntry.responseEnd,
        layoutShiftDuringNavigation: 0,
        deviceType: this.getDeviceType(),
        networkType: this.getNetworkType()
      }, [
        'Optimize server response time',
        'Implement efficient caching strategies',
        'Reduce JavaScript bundle size',
        'Use code splitting for better performance'
      ]);
    }

    // Track server response time specifically for TTFB optimization
    if (serverResponseTime > 800) {
      console.warn(`🐌 Slow server response: ${serverResponseTime.toFixed(0)}ms`);
    }
  }

  private reportPerformanceIssue(
    type: PerformanceAlert['type'],
    severity: PerformanceAlert['severity'],
    metrics: DashboardNavigationMetrics,
    recommendations: string[]
  ): void {
    const alert: PerformanceAlert = {
      type,
      severity,
      metrics,
      timestamp: Date.now(),
      recommendations
    };

    this.performanceAlerts.push(alert);
    this.sendPerformanceAlert(alert);

    // Log critical issues immediately
    if (severity === 'critical') {
      console.error('🚨 CRITICAL Dashboard Performance Issue:', alert);
    }
  }

  private async sendPerformanceAlert(alert: PerformanceAlert): Promise<void> {
    try {
      // Send high and critical alerts to monitoring API
      if (alert.severity === 'high' || alert.severity === 'critical') {
        await fetch('/api/monitoring/dashboard-performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        });
      }
    } catch (error) {
      // Store in localStorage as fallback
      const storedAlerts = JSON.parse(localStorage.getItem('dashboard_performance_alerts') || '[]');
      storedAlerts.push(alert);
      localStorage.setItem('dashboard_performance_alerts', JSON.stringify(storedAlerts.slice(-20)));
    }
  }

  private getCurrentMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private measureDOMInteractionTime(): number {
    const start = performance.now();
    // Measure time to query and manipulate DOM
    const elements = document.querySelectorAll('.card-sanctuary');
    return performance.now() - start;
  }

  private getPaintTime(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getNetworkType(): string {
    const connection = (navigator as any).connection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  // Public API methods
  public getNavigationMetrics(): DashboardNavigationMetrics[] {
    return [...this.metricsHistory];
  }

  public getCoreWebVitalsSnapshots(): CoreWebVitalsSnapshot[] {
    return [...this.vitalsSnapshots];
  }

  public getPerformanceAlerts(): PerformanceAlert[] {
    return [...this.performanceAlerts];
  }

  public generateDashboardPerformanceReport(): string {
    const recentMetrics = this.metricsHistory.slice(-10);
    const recentAlerts = this.performanceAlerts.filter(alert => 
      Date.now() - alert.timestamp < 300000 // Last 5 minutes
    );

    let report = '🎯 ALCHM Dashboard Performance Report\n';
    report += '=' .repeat(50) + '\n\n';

    if (recentMetrics.length > 0) {
      const avgTransitionTime = recentMetrics.reduce((sum, m) => sum + m.routeTransitionTime, 0) / recentMetrics.length;
      const avgClickResponse = recentMetrics.reduce((sum, m) => sum + m.cardClickResponseTime, 0) / recentMetrics.length;

      report += '📊 Recent Navigation Performance:\n';
      report += `  • Average Route Transition: ${avgTransitionTime.toFixed(0)}ms\n`;
      report += `  • Average Click Response: ${avgClickResponse.toFixed(0)}ms\n`;
      report += `  • Recent Navigations: ${recentMetrics.length}\n\n`;
    }

    if (recentAlerts.length > 0) {
      report += '🚨 Recent Performance Alerts:\n';
      recentAlerts.forEach(alert => {
        const icon = alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : '🟡';
        report += `  ${icon} ${alert.type}: ${alert.severity}\n`;
        alert.recommendations.slice(0, 2).forEach(rec => {
          report += `    • ${rec}\n`;
        });
      });
      report += '\n';
    } else {
      report += '✅ No recent performance issues detected!\n\n';
    }

    // Core Web Vitals summary
    const latestVitals = this.vitalsSnapshots.slice(-1)[0];
    if (latestVitals) {
      report += '📈 Latest Core Web Vitals:\n';
      report += `  • CLS: ${latestVitals.cls?.toFixed(3) || 'N/A'}\n`;
      report += `  • FID: ${latestVitals.fid?.toFixed(0) || 'N/A'}ms\n`;
      report += `  • INP: ${latestVitals.inp?.toFixed(0) || 'N/A'}ms\n`;
      report += `  • LCP: ${latestVitals.lcp?.toFixed(0) || 'N/A'}ms\n`;
      report += `  • FCP: ${latestVitals.fcp?.toFixed(0) || 'N/A'}ms\n`;
      report += `  • TTFB: ${latestVitals.ttfb?.toFixed(0) || 'N/A'}ms\n`;
    }

    return report;
  }

  public setUserId(userId: string): void {
    this.metricsHistory.forEach(metric => {
      metric.userId = userId;
    });
  }
}

// Global instance for dashboard performance monitoring
export const dashboardPerformanceMonitor = DashboardPerformanceMonitor.getInstance();

// React hook for dashboard performance monitoring
export function useDashboardPerformance() {
  return {
    getNavigationMetrics: () => dashboardPerformanceMonitor.getNavigationMetrics(),
    getCoreWebVitalsSnapshots: () => dashboardPerformanceMonitor.getCoreWebVitalsSnapshots(),
    getPerformanceAlerts: () => dashboardPerformanceMonitor.getPerformanceAlerts(),
    generateReport: () => dashboardPerformanceMonitor.generateDashboardPerformanceReport(),
    setUserId: (userId: string) => dashboardPerformanceMonitor.setUserId(userId)
  };
}

export default DashboardPerformanceMonitor;