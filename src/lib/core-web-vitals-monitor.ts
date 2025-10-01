/**
 * ALCHM Core Web Vitals Real-Time Monitoring System
 * Comprehensive monitoring for FID, CLS, LCP compliance
 * 
 * Crisis-critical: Ensures performance never degrades for users in crisis
 */

import { fidMonitor } from './fid-optimization';
import { clsMonitor } from './cls-optimization';
import { lcpMonitor } from './lcp-optimization';

export interface CoreWebVitalsMetrics {
  fid: number | null;
  cls: number | null;
  lcp: number | null;
  fcp: number | null;
  ttfb: number | null;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType: string;
  deviceMemory: number;
}

export interface PerformanceBudget {
  fid: number; // ms
  cls: number; // score
  lcp: number; // ms
  fcp: number; // ms
  ttfb: number; // ms
}

export interface AlertThresholds {
  critical: PerformanceBudget;
  warning: PerformanceBudget;
}

export class CoreWebVitalsMonitor {
  private static instance: CoreWebVitalsMonitor;
  private metrics: CoreWebVitalsMetrics[] = [];
  private maxMetricsHistory = 50;
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];
  
  // Performance budgets for ALCHM - Crisis-optimized
  private readonly alertThresholds: AlertThresholds = {
    critical: {
      fid: 50,    // 50ms - Crisis threshold
      cls: 0.05,  // 0.05 - Visual stability critical
      lcp: 2000,  // 2s - Crisis content must load fast
      fcp: 1200,  // 1.2s - First content critical
      ttfb: 500   // 500ms - Server response critical
    },
    warning: {
      fid: 30,    // 30ms - Excellent threshold
      cls: 0.025, // 0.025 - Excellent threshold
      lcp: 1500,  // 1.5s - Excellent threshold
      fcp: 900,   // 900ms - Excellent threshold
      ttfb: 300   // 300ms - Excellent threshold
    }
  };

  static getInstance(): CoreWebVitalsMonitor {
    if (!this.instance) {
      this.instance = new CoreWebVitalsMonitor();
    }
    return this.instance;
  }

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor all Core Web Vitals
    this.initializeFCP();
    this.initializeTTFB();
    
    // Start periodic collection
    this.startPeriodicCollection();
    
    // Monitor page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.collectCurrentMetrics();
      }
    });

    // Monitor before page unload
    window.addEventListener('beforeunload', () => {
      this.collectCurrentMetrics();
    });
  }

  private initializeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordFCP(entry.startTime);
          }
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP monitoring not supported');
    }
  }

  private initializeTTFB() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.recordTTFB(ttfb);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    } catch (error) {
      console.warn('TTFB monitoring not supported');
    }
  }

  private recordFCP(fcp: number) {
    if (fcp > this.alertThresholds.critical.fcp) {
      this.triggerAlert('fcp', fcp, 'critical');
    } else if (fcp > this.alertThresholds.warning.fcp) {
      this.triggerAlert('fcp', fcp, 'warning');
    }
  }

  private recordTTFB(ttfb: number) {
    if (ttfb > this.alertThresholds.critical.ttfb) {
      this.triggerAlert('ttfb', ttfb, 'critical');
    } else if (ttfb > this.alertThresholds.warning.ttfb) {
      this.triggerAlert('ttfb', ttfb, 'warning');
    }
  }

  private startPeriodicCollection() {
    // Collect metrics every 5 seconds
    setInterval(() => {
      this.collectCurrentMetrics();
    }, 5000);
  }

  private collectCurrentMetrics() {
    const metrics: CoreWebVitalsMetrics = {
      fid: fidMonitor.getCurrentFID(),
      cls: clsMonitor.getCurrentCLS(),
      lcp: lcpMonitor.getCurrentLCP(),
      fcp: this.getCurrentFCP(),
      ttfb: this.getCurrentTTFB(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory()
    };

    this.metrics.push(metrics);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics.shift();
    }

    // Check for threshold violations
    this.checkThresholds(metrics);

    return metrics;
  }

  private getCurrentFCP(): number | null {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    return fcpEntry ? fcpEntry.startTime : null;
  }

  private getCurrentTTFB(): number | null {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navEntry ? navEntry.responseStart - navEntry.requestStart : null;
  }

  private getConnectionType(): string {
    const connection = (navigator as any).connection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  private getDeviceMemory(): number {
    return (navigator as any).deviceMemory || 0;
  }

  private checkThresholds(metrics: CoreWebVitalsMetrics) {
    // Check FID
    if (metrics.fid !== null) {
      if (metrics.fid > this.alertThresholds.critical.fid) {
        this.triggerAlert('fid', metrics.fid, 'critical');
      } else if (metrics.fid > this.alertThresholds.warning.fid) {
        this.triggerAlert('fid', metrics.fid, 'warning');
      }
    }

    // Check CLS
    if (metrics.cls !== null) {
      if (metrics.cls > this.alertThresholds.critical.cls) {
        this.triggerAlert('cls', metrics.cls, 'critical');
      } else if (metrics.cls > this.alertThresholds.warning.cls) {
        this.triggerAlert('cls', metrics.cls, 'warning');
      }
    }

    // Check LCP
    if (metrics.lcp !== null) {
      if (metrics.lcp > this.alertThresholds.critical.lcp) {
        this.triggerAlert('lcp', metrics.lcp, 'critical');
      } else if (metrics.lcp > this.alertThresholds.warning.lcp) {
        this.triggerAlert('lcp', metrics.lcp, 'warning');
      }
    }
  }

  private triggerAlert(metric: string, value: number, severity: 'warning' | 'critical') {
    const alert: PerformanceAlert = {
      metric,
      value,
      severity,
      threshold: severity === 'critical' 
        ? (this.alertThresholds.critical as any)[metric]
        : (this.alertThresholds.warning as any)[metric],
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log alert
    const emoji = severity === 'critical' ? '🚨' : '⚠️';
    console.warn(`${emoji} ${severity.toUpperCase()} ${metric.toUpperCase()}: ${value.toFixed(2)} (threshold: ${alert.threshold})`);

    // Notify callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });

    // Send to monitoring API
    this.sendAlertToAPI(alert);
  }

  private async sendAlertToAPI(alert: PerformanceAlert) {
    try {
      await fetch('/api/monitoring/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      console.warn('Failed to send performance alert to API:', error);
    }
  }

  // Public methods
  getLatestMetrics(): CoreWebVitalsMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getAllMetrics(): CoreWebVitalsMetrics[] {
    return [...this.metrics];
  }

  getAverageMetrics(): Partial<CoreWebVitalsMetrics> {
    if (this.metrics.length === 0) return {};

    const totals = this.metrics.reduce((acc, metric) => {
      if (metric.fid !== null) acc.fid += metric.fid;
      if (metric.cls !== null) acc.cls += metric.cls;
      if (metric.lcp !== null) acc.lcp += metric.lcp;
      if (metric.fcp !== null) acc.fcp += metric.fcp;
      if (metric.ttfb !== null) acc.ttfb += metric.ttfb;
      return acc;
    }, { fid: 0, cls: 0, lcp: 0, fcp: 0, ttfb: 0 });

    const count = this.metrics.length;
    return {
      fid: totals.fid / count,
      cls: totals.cls / count,
      lcp: totals.lcp / count,
      fcp: totals.fcp / count,
      ttfb: totals.ttfb / count
    };
  }

  getPerformanceGrade(): PerformanceGrade {
    const latest = this.getLatestMetrics();
    if (!latest) return { overall: 'unknown', grades: {} };

    const grades = {
      fid: this.gradeMetric('fid', latest.fid),
      cls: this.gradeMetric('cls', latest.cls),
      lcp: this.gradeMetric('lcp', latest.lcp),
      fcp: this.gradeMetric('fcp', latest.fcp),
      ttfb: this.gradeMetric('ttfb', latest.ttfb)
    };

    // Calculate overall grade
    const gradeValues = Object.values(grades).filter(g => g !== 'unknown');
    const poorCount = gradeValues.filter(g => g === 'poor').length;
    const needsImprovementCount = gradeValues.filter(g => g === 'needs-improvement').length;

    let overall: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    if (poorCount > 0) {
      overall = 'poor';
    } else if (needsImprovementCount > 0) {
      overall = 'needs-improvement';
    } else if (gradeValues.length > 0) {
      overall = 'good';
    } else {
      overall = 'unknown';
    }

    return { overall, grades };
  }

  private gradeMetric(metric: string, value: number | null): 'good' | 'needs-improvement' | 'poor' | 'unknown' {
    if (value === null) return 'unknown';

    const critical = (this.alertThresholds.critical as any)[metric];
    const warning = (this.alertThresholds.warning as any)[metric];

    if (value <= warning) return 'good';
    if (value <= critical) return 'needs-improvement';
    return 'poor';
  }

  // Callback management
  onAlert(callback: (alert: PerformanceAlert) => void) {
    this.alertCallbacks.push(callback);
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  // Manual metric collection
  collectMetrics(): CoreWebVitalsMetrics {
    return this.collectCurrentMetrics();
  }

  // Export metrics for analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

export interface PerformanceAlert {
  metric: string;
  value: number;
  severity: 'warning' | 'critical';
  threshold: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface PerformanceGrade {
  overall: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  grades: {
    fid?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    cls?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    lcp?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    fcp?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    ttfb?: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  };
}

// React hook for Core Web Vitals monitoring
export function useCoreWebVitals() {
  const monitor = CoreWebVitalsMonitor.getInstance();
  
  return {
    latestMetrics: monitor.getLatestMetrics(),
    averageMetrics: monitor.getAverageMetrics(),
    performanceGrade: monitor.getPerformanceGrade(),
    collectMetrics: () => monitor.collectMetrics(),
    exportMetrics: () => monitor.exportMetrics(),
    onAlert: (callback: (alert: PerformanceAlert) => void) => monitor.onAlert(callback)
  };
}

// Export the singleton instance
export const coreWebVitalsMonitor = CoreWebVitalsMonitor.getInstance();