/**
 * ALCHM Performance Monitoring System
 * Crisis-critical performance tracking with trauma-informed thresholds
 */

// Core Web Vitals monitoring with enhanced detection
interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay  
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
  tbt: number | null; // Total Blocking Time
  pageLoadTime: number | null;
  memoryUsage: number | null;
  networkInfo: NetworkInformation | null;
}

interface CrisisMetrics {
  crisisResourceLoadTime: number | null;
  emergencyButtonResponseTime: number | null;
  journalSaveTime: number | null;
  authLoadTime: number | null;
}

interface NetworkInformation {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical';
  timestamp: number;
  userAgent: string;
  url: string;
}

// Crisis-critical performance thresholds (stricter than standard)
const PERFORMANCE_THRESHOLDS = {
  // Core Web Vitals - Crisis optimized
  LCP: { good: 1200, needs_improvement: 2000, poor: 2500 },
  FID: { good: 50, needs_improvement: 100, poor: 300 },
  CLS: { good: 0.05, needs_improvement: 0.1, poor: 0.25 },
  
  // Additional trauma-informed metrics
  FCP: { good: 800, needs_improvement: 1200, poor: 1800 },
  TTI: { good: 2000, needs_improvement: 3000, poor: 5000 },
  TTFB: { good: 200, needs_improvement: 400, poor: 800 },
  
  // Crisis-specific thresholds
  CRISIS_RESOURCE_LOAD: { good: 500, critical: 1000 },
  EMERGENCY_BUTTON: { good: 100, critical: 200 },
  JOURNAL_SAVE: { good: 1000, critical: 2000 },
  AUTH_LOAD: { good: 800, critical: 1500 }
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    tti: null,
    tbt: null,
    pageLoadTime: null,
    memoryUsage: null,
    networkInfo: null
  };

  private crisisMetrics: CrisisMetrics = {
    crisisResourceLoadTime: null,
    emergencyButtonResponseTime: null,
    journalSaveTime: null,
    authLoadTime: null
  };

  private observers: PerformanceObserver[] = [];
  private sessionId: string;
  private alerts: PerformanceAlert[] = [];

  constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    this.setupWebVitalsMonitoring();
    this.setupNetworkMonitoring();
    this.setupMemoryMonitoring();
    this.setupCrisisMetrics();
    this.startPeriodicReporting();
  }

  private setupWebVitalsMonitoring(): void {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.checkThreshold('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.checkThreshold('FID', this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID monitoring not supported');
      }

      // Cumulative Layout Shift
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cls = clsValue;
          this.checkThreshold('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }

      // First Contentful Paint & Other Paint Metrics
      try {
        const paintObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.checkThreshold('FCP', entry.startTime);
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.push(paintObserver);
      } catch (e) {
        console.warn('Paint timing monitoring not supported');
      }

      // Navigation Timing
      try {
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceNavigationTiming[];
          entries.forEach((entry) => {
            this.metrics.ttfb = entry.responseStart - entry.requestStart;
            this.metrics.pageLoadTime = entry.loadEventEnd - entry.loadEventStart;
            
            // Calculate TTI approximation
            this.metrics.tti = entry.domInteractive - entry.navigationStart;
            
            this.checkThreshold('TTFB', this.metrics.ttfb);
            this.checkThreshold('TTI', this.metrics.tti);
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (e) {
        console.warn('Navigation timing monitoring not supported');
      }
    }
  }

  private setupNetworkMonitoring(): void {
    // Network Information API
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    
    if (connection) {
      this.metrics.networkInfo = {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };

      // Monitor connection changes
      connection.addEventListener('change', () => {
        this.metrics.networkInfo = {
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false
        };
        
        // Alert on poor connections for crisis users
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.createAlert('NETWORK_DEGRADATION', connection.rtt, 1000, 'warning');
        }
      });
    }
  }

  private setupMemoryMonitoring(): void {
    const updateMemoryInfo = () => {
      if ((performance as any).memory) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        // Alert on high memory usage
        if (this.metrics.memoryUsage > 0.9) {
          this.createAlert('HIGH_MEMORY_USAGE', this.metrics.memoryUsage * 100, 90, 'critical');
        }
      }
    };

    // Check memory every 30 seconds
    setInterval(updateMemoryInfo, 30000);
    updateMemoryInfo();
  }

  private setupCrisisMetrics(): void {
    // Monitor crisis button response time
    this.monitorCrisisButton();
    
    // Monitor journal save performance
    this.monitorJournalSave();
    
    // Monitor auth performance
    this.monitorAuthPerformance();
  }

  private monitorCrisisButton(): void {
    // Use mutation observer to detect crisis button interactions
    const observer = new MutationObserver(() => {
      const crisisButton = document.querySelector('[data-crisis-button]');
      if (crisisButton) {
        crisisButton.addEventListener('click', (e) => {
          const startTime = performance.now();
          
          // Monitor how long it takes for crisis resources to load
          const checkCrisisLoad = () => {
            const crisisModal = document.querySelector('[data-crisis-modal]');
            if (crisisModal) {
              const loadTime = performance.now() - startTime;
              this.crisisMetrics.emergencyButtonResponseTime = loadTime;
              
              if (loadTime > PERFORMANCE_THRESHOLDS.EMERGENCY_BUTTON.critical) {
                this.createAlert('CRISIS_BUTTON_SLOW', loadTime, PERFORMANCE_THRESHOLDS.EMERGENCY_BUTTON.critical, 'critical');
              }
            } else {
              // Keep checking for up to 5 seconds
              if (performance.now() - startTime < 5000) {
                setTimeout(checkCrisisLoad, 100);
              }
            }
          };
          
          setTimeout(checkCrisisLoad, 0);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private monitorJournalSave(): void {
    // Monitor form submissions and API calls for journal saves
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
      
      if (url.includes('/api/save') || url.includes('journal')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const saveTime = performance.now() - startTime;
          
          this.crisisMetrics.journalSaveTime = saveTime;
          
          if (saveTime > PERFORMANCE_THRESHOLDS.JOURNAL_SAVE.critical) {
            this.createAlert('JOURNAL_SAVE_SLOW', saveTime, PERFORMANCE_THRESHOLDS.JOURNAL_SAVE.critical, 'critical');
          }
          
          return response;
        } catch (error) {
          const saveTime = performance.now() - startTime;
          this.createAlert('JOURNAL_SAVE_FAILED', saveTime, 0, 'critical');
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
  }

  private monitorAuthPerformance(): void {
    // Monitor authentication-related performance
    const originalFetch = window.fetch;
    const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
      
      if (url.includes('auth') || url.includes('session')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const authTime = performance.now() - startTime;
          
          this.crisisMetrics.authLoadTime = authTime;
          
          if (authTime > PERFORMANCE_THRESHOLDS.AUTH_LOAD.critical) {
            this.createAlert('AUTH_SLOW', authTime, PERFORMANCE_THRESHOLDS.AUTH_LOAD.critical, 'warning');
          }
          
          return response;
        } catch (error) {
          const authTime = performance.now() - startTime;
          this.createAlert('AUTH_FAILED', authTime, 0, 'critical');
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    // Only replace fetch if it hasn't been replaced already
    if (window.fetch === originalFetch) {
      window.fetch = enhancedFetch;
    }
  }

  private checkThreshold(metric: string, value: number): void {
    const thresholds = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!thresholds) return;

    if ('poor' in thresholds) {
      if (value > thresholds.poor) {
        this.createAlert(metric, value, thresholds.poor, 'critical');
      } else if (value > thresholds.needs_improvement) {
        this.createAlert(metric, value, thresholds.needs_improvement, 'warning');
      }
    } else if ('critical' in thresholds) {
      if (value > thresholds.critical) {
        this.createAlert(metric, value, thresholds.critical, 'critical');
      }
    }
  }

  private createAlert(metric: string, value: number, threshold: number, severity: 'warning' | 'critical'): void {
    const alert: PerformanceAlert = {
      metric,
      value,
      threshold,
      severity,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.alerts.push(alert);
    
    // Keep only recent alerts
    if (this.alerts.length > 50) {
      this.alerts = this.alerts.slice(-25);
    }

    // Send critical alerts immediately
    if (severity === 'critical') {
      this.sendAlert(alert);
    }
  }

  private async sendAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alert,
          sessionId: this.sessionId,
          metrics: this.getCurrentMetrics()
        })
      });
    } catch (error) {
      console.warn('Failed to send performance alert:', error);
    }
  }

  private startPeriodicReporting(): void {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Report on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });

    // Report before page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  private async reportMetrics(): Promise<void> {
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.getCurrentMetrics(),
      crisisMetrics: this.crisisMetrics,
      alerts: this.alerts.filter(a => Date.now() - a.timestamp < 300000) // Last 5 minutes
    };

    try {
      // Use sendBeacon for reliability during page unload
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/monitoring/performance', JSON.stringify(payload));
      } else {
        await fetch('/api/monitoring/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  private getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getCrisisMetrics(): CrisisMetrics {
    return { ...this.crisisMetrics };
  }

  public getAlerts(severity?: 'warning' | 'critical'): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(a => a.severity === severity);
    }
    return [...this.alerts];
  }

  public getPerformanceScore(): number {
    // Calculate overall performance score (0-100)
    let score = 100;
    
    // Core Web Vitals scoring
    if (this.metrics.lcp !== null) {
      if (this.metrics.lcp > PERFORMANCE_THRESHOLDS.LCP.poor) score -= 25;
      else if (this.metrics.lcp > PERFORMANCE_THRESHOLDS.LCP.needs_improvement) score -= 15;
    }
    
    if (this.metrics.fid !== null) {
      if (this.metrics.fid > PERFORMANCE_THRESHOLDS.FID.poor) score -= 25;
      else if (this.metrics.fid > PERFORMANCE_THRESHOLDS.FID.needs_improvement) score -= 15;
    }
    
    if (this.metrics.cls !== null) {
      if (this.metrics.cls > PERFORMANCE_THRESHOLDS.CLS.poor) score -= 25;
      else if (this.metrics.cls > PERFORMANCE_THRESHOLDS.CLS.needs_improvement) score -= 15;
    }
    
    if (this.metrics.fcp !== null) {
      if (this.metrics.fcp > PERFORMANCE_THRESHOLDS.FCP.poor) score -= 25;
      else if (this.metrics.fcp > PERFORMANCE_THRESHOLDS.FCP.needs_improvement) score -= 15;
    }

    return Math.max(0, score);
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  return {
    getMetrics: () => performanceMonitor.getCurrentMetrics(),
    getCrisisMetrics: () => performanceMonitor.getCrisisMetrics(),
    getAlerts: (severity?: 'warning' | 'critical') => performanceMonitor.getAlerts(severity),
    getPerformanceScore: () => performanceMonitor.getPerformanceScore()
  };
};

// Performance budget enforcement
export const enforcePerformanceBudget = (metrics: PerformanceMetrics): boolean => {
  const failures: string[] = [];
  
  if (metrics.lcp && metrics.lcp > PERFORMANCE_THRESHOLDS.LCP.poor) {
    failures.push('LCP');
  }
  
  if (metrics.fid && metrics.fid > PERFORMANCE_THRESHOLDS.FID.poor) {
    failures.push('FID');
  }
  
  if (metrics.cls && metrics.cls > PERFORMANCE_THRESHOLDS.CLS.poor) {
    failures.push('CLS');
  }

  if (failures.length > 0) {
    console.error('Performance budget exceeded:', failures);
    return false;
  }
  
  return true;
};

export default performanceMonitor;