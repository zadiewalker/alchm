import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';
import * as Sentry from '@sentry/nextjs';

interface PerformanceMetric extends Metric {
  timestamp: number;
  url: string;
  device: 'mobile' | 'desktop';
  connection?: string;
}

interface PerformanceBudget {
  LCP: number;    // Largest Contentful Paint
  INP: number;    // Interaction to Next Paint  
  CLS: number;    // Cumulative Layout Shift
  FCP: number;    // First Contentful Paint
  TTFB: number;   // Time to First Byte
}

// Performance budgets (in milliseconds, except CLS which is unitless)
const PERFORMANCE_BUDGETS: PerformanceBudget = {
  LCP: 2500,    // 2.5 seconds
  INP: 200,     // 200 milliseconds
  CLS: 0.1,     // 0.1 CLS score
  FCP: 1800,    // 1.8 seconds  
  TTFB: 600,    // 600 milliseconds
};

// Track performance metrics
class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    this.isInitialized = true;

    // Track Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onINP(this.handleMetric.bind(this)); // Interaction to Next Paint (replaces FID)
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));

    // Track custom performance events
    this.trackPageLoadTime();
    this.trackResourceLoadTimes();
    
    // Send metrics to monitoring service periodically
    setInterval(() => {
      this.sendMetricsToMonitoring();
    }, 30000); // Every 30 seconds
  }

  private handleMetric(metric: Metric) {
    const enhancedMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
      url: window.location.pathname,
      device: this.getDeviceType(),
      connection: this.getConnectionType(),
    };

    this.metrics.push(enhancedMetric);

    // Check against performance budget
    this.checkPerformanceBudget(enhancedMetric);

    // Send critical metrics immediately
    if (this.isCriticalMetric(enhancedMetric)) {
      this.sendCriticalMetric(enhancedMetric);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance metric:', enhancedMetric);
    }
  }

  private checkPerformanceBudget(metric: PerformanceMetric) {
    const budget = PERFORMANCE_BUDGETS[metric.name as keyof PerformanceBudget];
    if (!budget) return;

    const exceedsbudget = metric.value > budget;
    
    if (exceedsbudget) {
      // Log performance budget violation
      Sentry.addBreadcrumb({
        message: `Performance budget exceeded: ${metric.name}`,
        category: 'performance',
        data: {
          metricName: metric.name,
          value: metric.value,
          budget: budget,
          excess: metric.value - budget,
          url: metric.url,
          device: metric.device,
        },
        level: 'warning',
      });

      // Track in analytics
      this.trackBudgetViolation(metric, budget);
    }
  }

  private isCriticalMetric(metric: PerformanceMetric): boolean {
    // Consider metrics critical if they significantly exceed budgets
    const budget = PERFORMANCE_BUDGETS[metric.name as keyof PerformanceBudget];
    if (!budget) return false;

    const criticalThreshold = budget * 2; // 2x budget
    return metric.value > criticalThreshold;
  }

  private async sendCriticalMetric(metric: PerformanceMetric) {
    // Skip API calls for static export - just log to console and Sentry
    console.warn('Critical performance metric:', metric);
    
    // Send to Sentry for monitoring
    Sentry.addBreadcrumb({
      message: 'Critical performance metric detected',
      category: 'performance',
      data: metric,
      level: 'warning',
    });
  }

  private async sendMetricsToMonitoring() {
    if (this.metrics.length === 0) return;

    try {
      const metricsToSend = [...this.metrics];
      this.metrics = []; // Clear metrics after copying

      // Skip API calls for static export - just send to Sentry for monitoring
      Sentry.addBreadcrumb({
        message: `Performance metrics batch: ${metricsToSend.length} metrics`,
        category: 'performance',
        data: {
          metricsCount: metricsToSend.length,
          avgLCP: this.calculateAverage(metricsToSend, 'LCP'),
          avgINP: this.calculateAverage(metricsToSend, 'INP'),
          avgCLS: this.calculateAverage(metricsToSend, 'CLS'),
          avgFCP: this.calculateAverage(metricsToSend, 'FCP'),
          avgTTFB: this.calculateAverage(metricsToSend, 'TTFB'),
        },
        level: 'info',
      });

    } catch (error) {
      console.error('Error sending performance metrics:', error);
      Sentry.captureException(error, {
        tags: { component: 'performance-monitor' },
      });
    }
  }

  private trackPageLoadTime() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        this.handleMetric({
          id: `page-load-${Date.now()}`,
          name: 'page-load-time' as any,
          value: pageLoadTime,
          delta: pageLoadTime,
          entries: [],
          rating: 'good',
          navigationType: 'navigate',
        } as any);
      }
    });
  }

  private trackResourceLoadTimes() {
    // Track slow resource loads
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          const loadTime = resource.responseEnd - resource.fetchStart;
          
          // Flag slow resources (over 1 second)
          if (loadTime > 1000) {
            Sentry.addBreadcrumb({
              message: 'Slow resource load detected',
              category: 'performance',
              data: {
                url: resource.name,
                loadTime: Math.round(loadTime),
                size: resource.transferSize,
                type: this.getResourceType(resource.name),
              },
              level: 'warning',
            });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private getDeviceType(): 'mobile' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  private getConnectionType(): string {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getSessionInfo() {
    return {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      screen: typeof screen !== 'undefined' 
        ? { width: screen.width, height: screen.height }
        : null,
      viewport: typeof window !== 'undefined'
        ? { width: window.innerWidth, height: window.innerHeight }
        : null,
      timestamp: Date.now(),
    };
  }

  private calculateAverage(metrics: PerformanceMetric[], name: string): number {
    const filtered = metrics.filter(m => m.name === name);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return Math.round(sum / filtered.length);
  }

  private trackBudgetViolation(metric: PerformanceMetric, budget: number) {
    // This would integrate with your analytics service
    console.warn('Performance budget violation:', {
      metric: metric.name,
      value: metric.value,
      budget: budget,
      url: metric.url,
      device: metric.device,
    });
  }

  private getResourceType(url: string): string {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  // Public methods for manual tracking
  markStart(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  markEnd(name: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.handleMetric({
          id: `custom-${name}-${Date.now()}`,
          name: `custom-${name}` as any,
          value: measure.duration,
          delta: measure.duration,
          entries: [measure],
          rating: 'good',
          navigationType: 'navigate',
        } as any);
      }
    }
  }

  // Get current performance summary
  getPerformanceSummary() {
    return {
      budgetViolations: this.metrics.filter(m => {
        const budget = PERFORMANCE_BUDGETS[m.name as keyof PerformanceBudget];
        return budget && m.value > budget;
      }).length,
      avgMetrics: {
        LCP: this.calculateAverage(this.metrics, 'LCP'),
        INP: this.calculateAverage(this.metrics, 'INP'),
        CLS: this.calculateAverage(this.metrics, 'CLS'),
        FCP: this.calculateAverage(this.metrics, 'FCP'),
        TTFB: this.calculateAverage(this.metrics, 'TTFB'),
      },
      deviceBreakdown: {
        mobile: this.metrics.filter(m => m.device === 'mobile').length,
        desktop: this.metrics.filter(m => m.device === 'desktop').length,
      },
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance monitoring hook for React components
export function usePerformanceMonitoring(componentName: string) {
  const markComponentStart = () => {
    performanceMonitor.markStart(`component-${componentName}`);
  };

  const markComponentEnd = () => {
    performanceMonitor.markEnd(`component-${componentName}`);
  };

  return {
    markStart: markComponentStart,
    markEnd: markComponentEnd,
    markAction: (actionName: string) => {
      performanceMonitor.markStart(`${componentName}-${actionName}`);
      return () => performanceMonitor.markEnd(`${componentName}-${actionName}`);
    },
  };
}

// Initialize performance monitoring after delay to prevent iOS WebView blocking
if (typeof window !== 'undefined') {
  // Defer initialization for iOS WebView performance
  const initPerformanceMonitoring = () => {
    setTimeout(() => {
      performanceMonitor.init();
    }, 2000); // 2 second delay to allow WebView to stabilize
  };

  if (document.readyState === 'complete') {
    initPerformanceMonitoring();
  } else {
    window.addEventListener('load', initPerformanceMonitoring);
  }
}