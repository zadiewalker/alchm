/**
 * Crisis-Aware Performance Monitor
 * Trauma-informed performance tracking with <1s crisis response requirement
 */

import { safeStorage, measureCrisisResponseTime, isPageVisible } from './client-safe-apis';

// Crisis performance thresholds (trauma-informed)
export const CRISIS_THRESHOLDS = {
  CRISIS_BUTTON_LOAD: 1000,    // 1s maximum for crisis button
  CRISIS_MODAL_OPEN: 500,      // 500ms for crisis modal
  CRISIS_RESOURCE_LOAD: 2000,  // 2s for crisis resources
  NAVIGATION_RESPONSE: 300,    // 300ms for navigation
  GENERAL_INTERACTION: 100     // 100ms for general interactions
} as const;

// Performance budget enforcement
export const PERFORMANCE_BUDGETS = {
  INITIAL_LOAD: 75000,         // 75KB initial bundle
  CHUNK_SIZE: 25000,           // 25KB per chunk
  TOTAL_CSS: 50000,            // 50KB total CSS
  CRITICAL_CSS: 15000,         // 15KB critical CSS
  IMAGES_TOTAL: 500000,        // 500KB images budget
  FONTS_TOTAL: 100000          // 100KB fonts budget
} as const;

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  initiatorType?: string;
  transferSize?: number;
  encodedBodySize?: number;
  decodedBodySize?: number;
}

interface CrisisPerformanceMetrics {
  timestamp: number;
  crisisButtonLoad: number;
  crisisModalOpen: number;
  pageLoadTime: number;
  criticalPathTime: number;
  networkType: string;
  deviceMemory?: number;
  connectionSpeed: string;
  isTraumaticDelay: boolean;
}

interface PerformanceBudgetStatus {
  withinBudget: boolean;
  actualSize: number;
  budgetSize: number;
  category: string;
  exceedsBy?: number;
}

class CrisisPerformanceMonitor {
  private metrics: CrisisPerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;
  private crisisStartTime: number | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    try {
      // Initialize Performance Observer for critical metrics
      if ('PerformanceObserver' in window) {
        this.observer = new PerformanceObserver((list) => {
          this.processPerformanceEntries(list.getEntries());
        });
        
        this.observer.observe({ 
          entryTypes: ['navigation', 'resource', 'measure', 'paint'] 
        });
      }

      // Monitor Web Vitals for trauma-informed thresholds
      this.initializeWebVitalsTracking();
      
      // Start monitoring
      this.isMonitoring = true;
      
      console.info('Crisis performance monitoring initialized');
    } catch (error) {
      console.warn('Performance monitoring initialization failed', error);
    }
  }

  private initializeWebVitalsTracking(): void {
    // FCP (First Contentful Paint) - Critical for crisis users
    this.observeMetric('first-contentful-paint', (value) => {
      if (value > 2000) { // 2s threshold
        this.flagTraumaticDelay('FCP', value);
      }
    });

    // LCP (Largest Contentful Paint) - Must be under 2.5s
    this.observeMetric('largest-contentful-paint', (value) => {
      if (value > 2500) {
        this.flagTraumaticDelay('LCP', value);
      }
    });

    // FID (First Input Delay) - Critical for crisis interactions
    this.observeMetric('first-input-delay', (value) => {
      if (value > 100) { // 100ms threshold
        this.flagTraumaticDelay('FID', value);
      }
    });

    // CLS (Cumulative Layout Shift) - Prevent jarring shifts
    this.observeMetric('cumulative-layout-shift', (value) => {
      if (value > 0.1) { // 0.1 threshold
        this.flagTraumaticDelay('CLS', value);
      }
    });
  }

  private observeMetric(name: string, callback: (value: number) => void): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === name) {
              callback(entry.value || entry.duration);
            }
          }
        });
        
        observer.observe({ entryTypes: ['paint', 'layout-shift', 'first-input'] });
      } catch (error) {
        console.warn(`Failed to observe ${name}`, error);
      }
    }
  }

  private processPerformanceEntries(entries: PerformanceEntry[]): void {
    for (const entry of entries) {
      // Monitor crisis-critical resources
      if (this.isCrisisResource(entry.name)) {
        this.trackCrisisResourcePerformance(entry);
      }
      
      // Monitor navigation performance
      if (entry.entryType === 'navigation') {
        this.trackNavigationPerformance(entry as any);
      }
    }
  }

  private isCrisisResource(resourceName: string): boolean {
    const crisisPatterns = [
      'crisis',
      'emergency',
      'CrisisButton',
      'CrisisModal',
      'emergency-contacts'
    ];
    
    return crisisPatterns.some(pattern => 
      resourceName.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  private trackCrisisResourcePerformance(entry: PerformanceEntry): void {
    const loadTime = entry.duration;
    
    if (loadTime > CRISIS_THRESHOLDS.CRISIS_RESOURCE_LOAD) {
      this.flagTraumaticDelay('CRISIS_RESOURCE', loadTime);
      
      // Auto-trigger performance optimization
      this.optimizeCrisisPerformance();
    }
  }

  private trackNavigationPerformance(entry: PerformanceNavigationTiming): void {
    const metrics: CrisisPerformanceMetrics = {
      timestamp: Date.now(),
      crisisButtonLoad: this.measureCrisisButtonLoad(),
      crisisModalOpen: this.measureCrisisModalOpen(),
      pageLoadTime: entry.loadEventEnd - entry.navigationStart,
      criticalPathTime: entry.domContentLoadedEventEnd - entry.navigationStart,
      networkType: this.getNetworkType(),
      deviceMemory: this.getDeviceMemory(),
      connectionSpeed: this.getConnectionSpeed(),
      isTraumaticDelay: false
    };

    // Check for traumatic delays
    if (metrics.pageLoadTime > 3000 || metrics.crisisButtonLoad > CRISIS_THRESHOLDS.CRISIS_BUTTON_LOAD) {
      metrics.isTraumaticDelay = true;
      this.handleTraumaticDelay(metrics);
    }

    this.metrics.push(metrics);
    this.persistMetrics();
  }

  private measureCrisisButtonLoad(): number {
    // Measure actual crisis button load time
    const crisisButton = document.querySelector('[data-crisis-button]');
    if (crisisButton && this.crisisStartTime) {
      return measureCrisisResponseTime(this.crisisStartTime);
    }
    return 0;
  }

  private measureCrisisModalOpen(): number {
    // This would be called when crisis modal actually opens
    if (this.crisisStartTime) {
      return measureCrisisResponseTime(this.crisisStartTime);
    }
    return 0;
  }

  private getNetworkType(): string {
    const connection = (navigator as any).connection;
    return connection?.type || 'unknown';
  }

  private getDeviceMemory(): number | undefined {
    return (navigator as any).deviceMemory;
  }

  private getConnectionSpeed(): string {
    const connection = (navigator as any).connection;
    return connection?.effectiveType || 'unknown';
  }

  private flagTraumaticDelay(metric: string, value: number): void {
    console.warn(`🚨 Traumatic delay detected - ${metric}: ${value}ms`);
    
    // Store for analytics
    const delay = {
      metric,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Persist traumatic delays for debugging
    const delays = JSON.parse(safeStorage.get('alchm-traumatic-delays') || '[]');
    delays.push(delay);
    safeStorage.set('alchm-traumatic-delays', JSON.stringify(delays.slice(-10))); // Keep last 10
  }

  private handleTraumaticDelay(metrics: CrisisPerformanceMetrics): void {
    // Immediate user feedback for traumatic delays
    if (metrics.crisisButtonLoad > CRISIS_THRESHOLDS.CRISIS_BUTTON_LOAD) {
      this.showPerformanceWarning('Crisis support is loading slowly. Your device is working hard to help you.');
    }
    
    // Auto-trigger optimization strategies
    this.optimizeCrisisPerformance();
  }

  private optimizeCrisisPerformance(): void {
    // Immediate performance optimizations for crisis scenarios
    
    // 1. Preload critical crisis resources
    this.preloadCrisisResources();
    
    // 2. Reduce non-essential animations
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    
    // 3. Prioritize crisis-related network requests
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.postMessage({
        type: 'CRISIS_MODE_ACTIVATED',
        timestamp: Date.now()
      });
    }
  }

  private preloadCrisisResources(): void {
    const crisisResources = [
      '/crisis-resources/hotlines.json',
      '/crisis-resources/emergency-contacts.html',
      '/api/crisis-detection'
    ];
    
    crisisResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  private showPerformanceWarning(message: string): void {
    // Non-intrusive performance warning
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(231, 76, 60, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 320px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  private persistMetrics(): void {
    // Keep only last 50 metrics to prevent storage bloat
    const recentMetrics = this.metrics.slice(-50);
    safeStorage.set('alchm-performance-metrics', JSON.stringify(recentMetrics));
  }

  // Public API
  public startCrisisTimer(): void {
    this.crisisStartTime = performance.now();
  }

  public endCrisisTimer(): number {
    if (this.crisisStartTime) {
      const duration = measureCrisisResponseTime(this.crisisStartTime);
      this.crisisStartTime = null;
      
      if (duration > CRISIS_THRESHOLDS.CRISIS_BUTTON_LOAD) {
        this.flagTraumaticDelay('CRISIS_INTERACTION', duration);
      }
      
      return duration;
    }
    return 0;
  }

  public checkPerformanceBudgets(): PerformanceBudgetStatus[] {
    const results: PerformanceBudgetStatus[] = [];
    
    if (typeof window === 'undefined') return results;

    try {
      // Check bundle sizes via performance API
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Aggregate by type
      const budgetChecks = {
        javascript: { budget: PERFORMANCE_BUDGETS.INITIAL_LOAD, actual: 0 },
        css: { budget: PERFORMANCE_BUDGETS.TOTAL_CSS, actual: 0 },
        images: { budget: PERFORMANCE_BUDGETS.IMAGES_TOTAL, actual: 0 },
        fonts: { budget: PERFORMANCE_BUDGETS.FONTS_TOTAL, actual: 0 }
      };

      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        
        if (resource.name.endsWith('.js')) {
          budgetChecks.javascript.actual += size;
        } else if (resource.name.endsWith('.css')) {
          budgetChecks.css.actual += size;
        } else if (/\.(jpg|jpeg|png|webp|avif|svg)$/i.test(resource.name)) {
          budgetChecks.images.actual += size;
        } else if (/\.(woff|woff2|ttf|otf)$/i.test(resource.name)) {
          budgetChecks.fonts.actual += size;
        }
      });

      // Generate results
      Object.entries(budgetChecks).forEach(([category, { budget, actual }]) => {
        const withinBudget = actual <= budget;
        const status: PerformanceBudgetStatus = {
          withinBudget,
          actualSize: actual,
          budgetSize: budget,
          category,
          exceedsBy: withinBudget ? undefined : actual - budget
        };
        results.push(status);
      });

    } catch (error) {
      console.warn('Performance budget check failed', error);
    }

    return results;
  }

  public getMetricsSummary() {
    if (this.metrics.length === 0) return null;

    const recent = this.metrics.slice(-10);
    const avgLoadTime = recent.reduce((sum, m) => sum + m.pageLoadTime, 0) / recent.length;
    const traumaticDelays = recent.filter(m => m.isTraumaticDelay).length;
    
    return {
      averageLoadTime: avgLoadTime,
      traumaticDelayRate: (traumaticDelays / recent.length) * 100,
      totalMeasurements: this.metrics.length,
      lastMeasurement: recent[recent.length - 1]?.timestamp
    };
  }

  public exportMetrics(): string {
    return JSON.stringify({
      metrics: this.metrics,
      budgets: this.checkPerformanceBudgets(),
      summary: this.getMetricsSummary(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isMonitoring = false;
  }
}

// Singleton instance
let performanceMonitor: CrisisPerformanceMonitor | null = null;

export function getPerformanceMonitor(): CrisisPerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new CrisisPerformanceMonitor();
  }
  return performanceMonitor!;
}

// Convenience functions
export function startCrisisTimer(): void {
  getPerformanceMonitor()?.startCrisisTimer();
}

export function endCrisisTimer(): number {
  return getPerformanceMonitor()?.endCrisisTimer() || 0;
}

export function checkPerformanceBudgets(): PerformanceBudgetStatus[] {
  return getPerformanceMonitor()?.checkPerformanceBudgets() || [];
}

export function exportPerformanceMetrics(): string {
  return getPerformanceMonitor()?.exportMetrics() || '{}';
}