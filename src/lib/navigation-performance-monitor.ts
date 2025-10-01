/**
 * NAVIGATION PERFORMANCE MONITORING SYSTEM
 * Tracks navigation performance and alerts on degradation for crisis users
 */

interface NavigationMetrics {
  path: string;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  errorMessage?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  connectionType: string;
  memoryPressure?: number;
  coreWebVitals?: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

interface NavigationPerformanceThresholds {
  warning: number;
  critical: number;
  crisis: number;
}

class NavigationPerformanceMonitor {
  private metrics: NavigationMetrics[] = [];
  private thresholds: NavigationPerformanceThresholds = {
    warning: 1500,  // 1.5s
    critical: 3000, // 3s  
    crisis: 5000    // 5s - user abandonment risk
  };

  private alertCallbacks: Set<(metric: NavigationMetrics, severity: string) => void> = new Set();

  constructor() {
    this.setupGlobalNavigationTracking();
  }

  private setupGlobalNavigationTracking(): void {
    // Track Next.js router navigation events
    if (typeof window !== 'undefined') {
      // Listen for router events
      const originalPushState = history.pushState;
      history.pushState = (...args) => {
        this.trackNavigationStart(args[2] as string);
        return originalPushState.apply(history, args);
      };

      // Track page visibility changes (user switching tabs during navigation)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.handleNavigationInterruption();
        }
      });
    }
  }

  public trackNavigationStart(path: string): string {
    const navigationId = `nav_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    // Store navigation start
    sessionStorage.setItem(`navigation_${navigationId}`, JSON.stringify({
      path,
      startTime,
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType()
    }));

    return navigationId;
  }

  public trackNavigationEnd(navigationId: string, success: boolean = true, errorMessage?: string): void {
    const navigationData = sessionStorage.getItem(`navigation_${navigationId}`);
    if (!navigationData) return;

    const startData = JSON.parse(navigationData);
    const endTime = performance.now();
    const duration = endTime - startData.startTime;

    const metric: NavigationMetrics = {
      ...startData,
      endTime,
      duration,
      success,
      errorMessage,
      memoryPressure: this.getMemoryPressure()
    };

    this.metrics.push(metric);
    this.analyzeNavigationPerformance(metric);
    
    // Cleanup
    sessionStorage.removeItem(`navigation_${navigationId}`);

    // Keep only last 50 metrics to prevent memory leaks
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50);
    }
  }

  private analyzeNavigationPerformance(metric: NavigationMetrics): void {
    let severity = 'normal';

    if (!metric.success) {
      severity = 'critical';
      this.triggerAlert(metric, severity);
      return;
    }

    if (metric.duration > this.thresholds.crisis) {
      severity = 'crisis';
    } else if (metric.duration > this.thresholds.critical) {
      severity = 'critical';  
    } else if (metric.duration > this.thresholds.warning) {
      severity = 'warning';
    }

    if (severity !== 'normal') {
      this.triggerAlert(metric, severity);
    }

    // Send performance data to monitoring endpoint
    this.sendPerformanceData(metric, severity);
  }

  private triggerAlert(metric: NavigationMetrics, severity: string): void {
    console.warn(`Navigation performance ${severity}:`, {
      path: metric.path,
      duration: `${metric.duration.toFixed(0)}ms`,
      threshold: `${this.thresholds[severity as keyof NavigationPerformanceThresholds]}ms`,
      deviceType: metric.deviceType,
      connectionType: metric.connectionType
    });

    // Notify registered callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(metric, severity);
      } catch (error) {
        console.error('Navigation alert callback error:', error);
      }
    });

    // Show user-friendly notification for crisis-level performance
    if (severity === 'crisis') {
      this.showCrisisPerformanceNotification(metric);
    }
  }

  private showCrisisPerformanceNotification(metric: NavigationMetrics): void {
    // Only show if performance is consistently bad
    const recentMetrics = this.metrics.slice(-3);
    const averageDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length;
    
    if (averageDuration > this.thresholds.critical) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(164, 183, 146, 0.95);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 999999;
        max-width: 350px;
        text-align: center;
        box-shadow: 0 8px 32px rgba(164, 183, 146, 0.3);
        backdrop-filter: blur(8px);
      `;

      notification.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">🌿</div>
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">
          Taking a moment to optimize...
        </div>
        <div style="font-size: 14px; margin-bottom: 12px;">
          We're adjusting for your network to ensure smooth navigation.
        </div>
        <button onclick="this.parentElement.remove()" style="
          background: white;
          color: #a4b792;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        ">Got it</button>
      `;

      document.body.appendChild(notification);

      // Auto-remove after 8 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 8000);
    }
  }

  private async sendPerformanceData(metric: NavigationMetrics, severity: string): Promise<void> {
    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'navigation_performance',
          metric,
          severity,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.warn('Failed to send performance data:', error);
    }
  }

  private handleNavigationInterruption(): void {
    // User switched tabs during navigation - this might indicate performance issues
    const activeNavigations = Object.keys(sessionStorage)
      .filter(key => key.startsWith('navigation_'))
      .map(key => JSON.parse(sessionStorage.getItem(key) || '{}'));

    activeNavigations.forEach(nav => {
      if (performance.now() - nav.startTime > 2000) {
        console.warn('Navigation interrupted - potential performance issue', nav.path);
      }
    });
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod/.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
      return 'tablet';
    }
    return 'desktop';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getMemoryPressure(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    }
    return 0;
  }

  // Public API
  public onNavigationAlert(callback: (metric: NavigationMetrics, severity: string) => void): () => void {
    this.alertCallbacks.add(callback);
    return () => this.alertCallbacks.delete(callback);
  }

  public getRecentMetrics(): NavigationMetrics[] {
    return [...this.metrics.slice(-10)];
  }

  public getAveragePerformance(): {
    averageDuration: number;
    successRate: number;
    totalNavigations: number;
  } {
    if (this.metrics.length === 0) {
      return { averageDuration: 0, successRate: 0, totalNavigations: 0 };
    }

    const totalDuration = this.metrics.reduce((sum, metric) => sum + metric.duration, 0);
    const successfulNavigations = this.metrics.filter(metric => metric.success).length;

    return {
      averageDuration: totalDuration / this.metrics.length,
      successRate: successfulNavigations / this.metrics.length,
      totalNavigations: this.metrics.length
    };
  }

  public measureCoreWebVitals(): Promise<{ lcp: number; fid: number; cls: number }> {
    return new Promise((resolve) => {
      let lcp = 0;
      let fid = 0;
      let cls = 0;
      let measurements = 0;
      const targetMeasurements = 3;

      const checkComplete = () => {
        measurements++;
        if (measurements >= targetMeasurements) {
          resolve({ lcp, fid, cls });
        }
      };

      if ('PerformanceObserver' in window) {
        try {
          // Measure LCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = (lastEntry as any).startTime;
            checkComplete();
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // Measure FID
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            fid = entries[0] ? (entries[0] as any).processingStart - entries[0].startTime : 0;
            checkComplete();
          }).observe({ entryTypes: ['first-input'] });

          // Measure CLS
          new PerformanceObserver((list) => {
            let value = 0;
            for (const entry of list.getEntries()) {
              value += (entry as any).value;
            }
            cls = value;
            checkComplete();
          }).observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          // Fallback if PerformanceObserver fails
          setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 100);
        }
      } else {
        // Fallback for browsers without PerformanceObserver
        setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 100);
      }
    });
  }

  public resetMetrics(): void {
    this.metrics = [];
  }

  public destroy(): void {
    this.alertCallbacks.clear();
    this.resetMetrics();
  }
}

// Global instance
let navigationMonitor: NavigationPerformanceMonitor | null = null;

export function initializeNavigationMonitor(): NavigationPerformanceMonitor {
  if (!navigationMonitor) {
    navigationMonitor = new NavigationPerformanceMonitor();
  }
  return navigationMonitor;
}

export function getNavigationMonitor(): NavigationPerformanceMonitor | null {
  return navigationMonitor;
}

export { NavigationPerformanceMonitor };
export type { NavigationMetrics, NavigationPerformanceThresholds };