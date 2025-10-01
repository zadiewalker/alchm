// Performance budget monitoring for crisis-critical loading times
// Ensures bundle sizes stay within trauma-informed limits

interface PerformanceBudget {
  // Critical path resources (must load in <1s on 3G)
  criticalJS: number; // Max 100KB
  criticalCSS: number; // Max 50KB
  
  // Auth page resources (sign-in must be <2s)
  authJS: number; // Max 200KB total
  
  // Dashboard resources (can lazy load)
  dashboardJS: number; // Max 300KB total
  
  // Vendor bundles
  vendorJS: number; // Max 800KB (our target)
  
  // Images and assets
  criticalImages: number; // Max 500KB
  totalImages: number; // Max 2MB
}

// Crisis-informed performance budgets
export const PERFORMANCE_BUDGETS: PerformanceBudget = {
  criticalJS: 100 * 1024,     // 100KB - homepage JS
  criticalCSS: 50 * 1024,     // 50KB - critical styles
  authJS: 200 * 1024,         // 200KB - auth page total
  dashboardJS: 300 * 1024,    // 300KB - dashboard features
  vendorJS: 800 * 1024,       // 800KB - vendor bundle target
  criticalImages: 500 * 1024, // 500KB - above-fold images
  totalImages: 2 * 1024 * 1024 // 2MB - total image budget
};

// Real User Monitoring for bundle performance
export class BundlePerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private startTime: number;

  constructor() {
    this.startTime = performance.now();
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor script loading performance
    this.observeResourceTiming();
    
    // Monitor bundle size impact on Core Web Vitals
    this.monitorWebVitals();
    
    // Crisis-specific: Monitor time to interactive for auth pages
    this.monitorTimeToInteractive();
  }

  private observeResourceTiming() {
    if (!window.PerformanceObserver) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('.js')) {
          const resource = entry as PerformanceResourceTiming;
          this.checkJSBudget(entry.name, resource.transferSize || 0);
        }
        if (entry.name.includes('.css')) {
          const resource = entry as PerformanceResourceTiming;
          this.checkCSSBudget(entry.name, resource.transferSize || 0);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  private checkJSBudget(resourceName: string, size: number) {
    const sizeKB = Math.round(size / 1024);
    
    // Check different budget categories
    if (resourceName.includes('vendors')) {
      if (size > PERFORMANCE_BUDGETS.vendorJS) {
        this.reportBudgetViolation('vendor-js', size, PERFORMANCE_BUDGETS.vendorJS);
      }
    } else if (resourceName.includes('firebase-auth')) {
      if (size > PERFORMANCE_BUDGETS.authJS / 3) { // Auth should be ~1/3 of budget
        this.reportBudgetViolation('auth-js', size, PERFORMANCE_BUDGETS.authJS / 3);
      }
    } else if (resourceName.includes('page') && !resourceName.includes('dashboard')) {
      if (size > PERFORMANCE_BUDGETS.criticalJS) {
        this.reportBudgetViolation('critical-js', size, PERFORMANCE_BUDGETS.criticalJS);
      }
    }

    this.metrics.set(resourceName, size);
  }

  private checkCSSBudget(resourceName: string, size: number) {
    if (size > PERFORMANCE_BUDGETS.criticalCSS) {
      this.reportBudgetViolation('critical-css', size, PERFORMANCE_BUDGETS.criticalCSS);
    }
  }

  private monitorWebVitals() {
    // Use web-vitals library to monitor Core Web Vitals
    this.getCLS((metric) => {
      if (metric.value > 0.1) { // Target: <0.05, warn at >0.1
        this.reportWebVitalIssue('CLS', metric.value, 0.05);
      }
    });

    this.getLCP((metric) => {
      if (metric.value > 2000) { // Target: <2s, warn at >2s
        this.reportWebVitalIssue('LCP', metric.value, 2000);
      }
    });

    this.getFID((metric) => {
      if (metric.value > 50) { // Target: <50ms
        this.reportWebVitalIssue('FID', metric.value, 50);
      }
    });
  }

  private monitorTimeToInteractive() {
    // Crisis-critical: Auth buttons must be interactive quickly
    const isAuthPage = window.location.pathname.includes('/auth');
    
    if (isAuthPage) {
      const checkInteractive = () => {
        const authButtons = document.querySelectorAll('[aria-label*="Continue with"]');
        if (authButtons.length > 0) {
          const timeToInteractive = performance.now() - this.startTime;
          
          if (timeToInteractive > 3000) { // 3s limit for crisis users
            this.reportCrisisIssue('slow-auth-interactive', timeToInteractive, 3000);
          }
          
          this.metrics.set('time-to-auth-interactive', timeToInteractive);
        } else {
          // Keep checking for up to 10 seconds
          if (performance.now() - this.startTime < 10000) {
            setTimeout(checkInteractive, 100);
          }
        }
      };

      setTimeout(checkInteractive, 100);
    }
  }

  private reportBudgetViolation(category: string, actual: number, budget: number) {
    const violation = {
      category,
      actualSize: actual,
      budgetSize: budget,
      overrun: actual - budget,
      overrunPercent: Math.round(((actual - budget) / budget) * 100),
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `🚨 PERFORMANCE BUDGET VIOLATION - ${category}:`,
        `${Math.round(actual / 1024)}KB exceeds ${Math.round(budget / 1024)}KB budget by ${Math.round((actual - budget) / 1024)}KB (${violation.overrunPercent}%)`
      );
    }

    // Send to monitoring in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring('budget-violation', violation);
    }
  }

  private reportWebVitalIssue(metric: string, value: number, threshold: number) {
    const issue = {
      metric,
      value,
      threshold,
      url: window.location.pathname,
      timestamp: new Date().toISOString(),
      bundleSizes: Object.fromEntries(this.metrics)
    };

    if (process.env.NODE_ENV === 'development') {
      console.warn(`🚨 WEB VITAL ISSUE - ${metric}: ${value} (threshold: ${threshold})`);
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring('web-vital-issue', issue);
    }
  }

  private reportCrisisIssue(type: string, value: number, threshold: number) {
    const issue = {
      type,
      value,
      threshold,
      severity: 'crisis',
      url: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development') {
      console.error(`🚨 CRISIS PERFORMANCE ISSUE - ${type}: ${Math.round(value)}ms (max: ${threshold}ms)`);
    }

    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring('crisis-performance', issue);
    }
  }

  private async sendToMonitoring(type: string, data: any) {
    try {
      // Send to Firebase Analytics or monitoring endpoint
      const { getFirebaseAnalytics } = await import('./firebase-lazy');
      const analytics = await getFirebaseAnalytics();
      
      if (analytics) {
        const { logEvent } = await import('firebase/analytics');
        logEvent(analytics, 'performance_issue', {
          issue_type: type,
          ...data
        });
      }
    } catch (error) {
      // Fallback: Send to API endpoint
      try {
        fetch('/api/monitoring/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data })
        });
      } catch (e) {
        // Silent fail - don't impact user experience
      }
    }
  }

  // Web Vitals measurement methods
  private getCLS(callback: (metric: any) => void) {
    import('web-vitals').then(({ getCLS }) => {
      getCLS(callback);
    }).catch(() => {});
  }

  private getLCP(callback: (metric: any) => void) {
    import('web-vitals').then(({ getLCP }) => {
      getLCP(callback);
    }).catch(() => {});
  }

  private getFID(callback: (metric: any) => void) {
    import('web-vitals').then(({ getFID }) => {
      getFID(callback);
    }).catch(() => {});
  }

  // Public method to get current metrics
  public getMetrics() {
    return {
      bundleSizes: Object.fromEntries(this.metrics),
      budgets: PERFORMANCE_BUDGETS,
      timeFromStart: performance.now() - this.startTime
    };
  }
}

// Initialize global monitor
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && !window.__bundleMonitor) {
    window.__bundleMonitor = new BundlePerformanceMonitor();
  }
  return window.__bundleMonitor;
};

// Type augmentation for global monitor
declare global {
  interface Window {
    __bundleMonitor?: BundlePerformanceMonitor;
  }
}