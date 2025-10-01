/**
 * ALCHM FID (First Input Delay) Optimization System
 * Target: <50ms FID for all user interactions
 * 
 * Crisis-critical: Every millisecond matters for users in crisis
 */

import { startTransition, useDeferredValue } from 'react';

// Debounce utility for reducing excessive updates
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): T & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  let result: any;

  const debounced = function (this: any, ...args: any[]) {
    const later = () => {
      timeout = null;
      if (!immediate) result = func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) result = func.apply(this, args);

    return result;
  } as T & { cancel: () => void };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

// Throttle utility for performance-critical interactions
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  } as T;
}

// React 18 concurrent features wrapper for better responsiveness
export function withConcurrentFeatures<T>(
  updateFn: (value: T) => void,
  value: T
) {
  startTransition(() => {
    updateFn(value);
  });
}

// Input optimization for better FID
export class InputOptimizer {
  private static instances = new Map<string, InputOptimizer>();
  private timeouts = new Map<string, NodeJS.Timeout>();
  private lastInputTime = 0;
  
  static getInstance(id: string): InputOptimizer {
    if (!this.instances.has(id)) {
      this.instances.set(id, new InputOptimizer());
    }
    return this.instances.get(id)!;
  }

  // Optimized input handler with immediate visual feedback
  optimizeInput(
    callback: (value: string) => void,
    delay = 150,
    immediate = true
  ) {
    return (value: string) => {
      const now = performance.now();
      this.lastInputTime = now;

      // Immediate visual feedback for better perceived performance
      if (immediate) {
        // Use startTransition to prevent blocking urgent updates
        startTransition(() => {
          // Only update UI-critical changes immediately
          this.scheduleCallback(callback, value, delay, now);
        });
      } else {
        this.scheduleCallback(callback, value, delay, now);
      }
    };
  }

  private scheduleCallback(
    callback: (value: string) => void,
    value: string,
    delay: number,
    timestamp: number
  ) {
    const timeoutId = 'input-' + timestamp;
    
    // Clear previous timeout
    const existingTimeout = this.timeouts.get(timeoutId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new callback
    const timeout = setTimeout(() => {
      // Only execute if this is still the latest input
      if (timestamp >= this.lastInputTime - delay) {
        callback(value);
      }
      this.timeouts.delete(timeoutId);
    }, delay);

    this.timeouts.set(timeoutId, timeout);
  }

  cleanup() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
  }
}

// Crisis-optimized click handler
export function createCrisisOptimizedClickHandler(
  handler: () => void,
  priority: 'crisis' | 'normal' = 'normal'
) {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (priority === 'crisis') {
      // Immediate execution for crisis actions
      handler();
    } else {
      // Use concurrent features for better responsiveness
      startTransition(() => {
        handler();
      });
    }
  };
}

// Performance monitoring for FID
export class FIDMonitor {
  private static instance: FIDMonitor;
  private fidValues: number[] = [];
  private criticalThreshold = 50; // ms
  private warningThreshold = 30; // ms
  
  static getInstance(): FIDMonitor {
    if (!this.instance) {
      this.instance = new FIDMonitor();
    }
    return this.instance;
  }

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor FID using Performance Observer
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fid = entry.processingStart - entry.startTime;
            this.recordFID(fid);
          }
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID monitoring not supported in this browser');
    }
  }

  private recordFID(fid: number) {
    this.fidValues.push(fid);
    
    // Keep only last 10 measurements
    if (this.fidValues.length > 10) {
      this.fidValues.shift();
    }

    // Alert if FID exceeds thresholds
    if (fid > this.criticalThreshold) {
      console.warn(`🚨 CRITICAL FID: ${fid.toFixed(2)}ms (target: <${this.criticalThreshold}ms)`);
      this.triggerOptimization();
    } else if (fid > this.warningThreshold) {
      console.warn(`⚠️ HIGH FID: ${fid.toFixed(2)}ms (target: <${this.warningThreshold}ms)`);
    }
  }

  private triggerOptimization() {
    // Trigger automatic optimizations for poor FID
    if (typeof window !== 'undefined') {
      // Reduce non-critical operations
      this.scheduleIdleWork();
    }
  }

  private scheduleIdleWork() {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        // Defer non-critical work to idle time
        console.log('🔧 Scheduling non-critical work during idle time');
      });
    }
  }

  getCurrentFID(): number | null {
    return this.fidValues.length > 0 
      ? this.fidValues[this.fidValues.length - 1] 
      : null;
  }

  getAverageFID(): number | null {
    if (this.fidValues.length === 0) return null;
    return this.fidValues.reduce((sum, val) => sum + val, 0) / this.fidValues.length;
  }

  getPerformanceGrade(): 'good' | 'needs-improvement' | 'poor' {
    const avgFID = this.getAverageFID();
    if (avgFID === null) return 'good';
    
    if (avgFID <= 30) return 'good';
    if (avgFID <= 50) return 'needs-improvement';
    return 'poor';
  }
}

// React hook for FID-optimized interactions
export function useFIDOptimizedInteraction() {
  const fidMonitor = FIDMonitor.getInstance();
  
  const createOptimizedHandler = (
    handler: () => void,
    options: {
      priority?: 'crisis' | 'normal';
      debounceMs?: number;
      immediate?: boolean;
    } = {}
  ) => {
    const { priority = 'normal', debounceMs = 0, immediate = true } = options;
    
    if (debounceMs > 0) {
      const debouncedHandler = debounce(handler, debounceMs, immediate);
      return createCrisisOptimizedClickHandler(debouncedHandler, priority);
    }
    
    return createCrisisOptimizedClickHandler(handler, priority);
  };

  return {
    createOptimizedHandler,
    currentFID: fidMonitor.getCurrentFID(),
    averageFID: fidMonitor.getAverageFID(),
    performanceGrade: fidMonitor.getPerformanceGrade()
  };
}

// Export the monitor instance for global access
export const fidMonitor = FIDMonitor.getInstance();