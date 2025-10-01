'use client';

/**
 * ALCHM Crisis Performance Memory Manager
 * Critical memory leak prevention and performance optimization for crisis users
 * 
 * EMERGENCY PROTOCOL: Every millisecond matters for users in crisis
 */

interface MemoryMetrics {
  heapUsed: number;
  heapTotal: number;
  heapLimit: number;
  utilization: number;
  pressure: 'low' | 'medium' | 'high' | 'critical';
}

interface PerformanceProfile {
  isCrisisPage: boolean;
  isLowEndDevice: boolean;
  isSlowNetwork: boolean;
  memoryLimit: number;
  maxConcurrentOperations: number;
}

interface ComponentCleanup {
  timers: Set<NodeJS.Timeout>;
  intervals: Set<NodeJS.Timeout>;
  abortControllers: Set<AbortController>;
  eventListeners: Map<EventTarget, Map<string, EventListener>>;
  observers: Set<IntersectionObserver | MutationObserver | PerformanceObserver>;
}

class CrisisMemoryManager {
  private static instance: CrisisMemoryManager;
  private memoryPressureThreshold = 0.85; // 85% memory usage triggers optimization
  private criticalThreshold = 0.95; // 95% triggers emergency cleanup
  private performanceProfile: PerformanceProfile;
  private componentCleanups = new Map<string, ComponentCleanup>();
  private memoryPressureCallbacks = new Set<() => void>();
  private gcScheduled = false;

  constructor() {
    this.performanceProfile = this.detectPerformanceProfile();
    this.initializeMemoryMonitoring();
    this.setupMemoryPressureHandling();
  }

  public static getInstance(): CrisisMemoryManager {
    if (!CrisisMemoryManager.instance) {
      CrisisMemoryManager.instance = new CrisisMemoryManager();
    }
    return CrisisMemoryManager.instance;
  }

  private detectPerformanceProfile(): PerformanceProfile {
    const connection = (typeof window !== 'undefined' && navigator as any).connection;
    const memory = (performance as any).memory;
    
    return {
      isCrisisPage: this.isCrisisPage(),
      isLowEndDevice: this.isLowEndDevice(),
      isSlowNetwork: connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g',
      memoryLimit: memory?.jsHeapSizeLimit || 2147483648, // Default 2GB
      maxConcurrentOperations: this.calculateMaxOperations()
    };
  }

  private isCrisisPage(): boolean {
    const pathname = typeof window !== 'undefined' && window.location.pathname;
    return pathname.includes('crisis') || 
           pathname.includes('emergency') || 
           pathname.includes('support') ||
           pathname.includes('hotline');
  }

  private isLowEndDevice(): boolean {
    const memory = (performance as any).memory;
    const cores = typeof window !== 'undefined' && navigator.hardwareConcurrency || 1;
    
    return cores <= 2 || 
           (memory && memory.jsHeapSizeLimit < 1073741824); // < 1GB
  }

  private calculateMaxOperations(): number {
    if (this.performanceProfile?.isCrisisPage) return 3; // Maximum safety
    if (this.performanceProfile?.isLowEndDevice) return 5;
    return 10;
  }

  private initializeMemoryMonitoring(): void {
    // Monitor memory every 10 seconds
    setInterval(() => {
      this.checkMemoryPressure();
    }, 10000);

    // Monitor on page visibility change
    typeof window !== 'undefined' && document.addEventListener('visibilitychange', () => {
      if (typeof window !== 'undefined' && document.visibilityState === 'hidden') {
        this.performMaintenanceCleanup();
      }
    });

    // Emergency cleanup before page unload
    typeof window !== 'undefined' && window.addEventListener('beforeunload', () => {
      this.emergencyCleanup();
    });
  }

  private setupMemoryPressureHandling(): void {
    // Detect memory pressure using various APIs
    if ('memory' in performance) {
      const checkPressure = () => {
        const metrics = this.getMemoryMetrics();
        if (metrics.utilization > this.criticalThreshold) {
          this.handleCriticalMemoryPressure();
        } else if (metrics.utilization > this.memoryPressureThreshold) {
          this.handleMemoryPressure();
        }
      };

      setInterval(checkPressure, 5000); // Check every 5 seconds
    }

    // Listen for browser memory pressure events
    if ('onmemory' in typeof window !== 'undefined' && window) {
      (typeof window !== 'undefined' && window as any).addEventListener('memory', this.handleMemoryPressure.bind(this));
    }
  }

  public registerComponent(componentId: string): ComponentCleanup {
    const cleanup: ComponentCleanup = {
      timers: new Set(),
      intervals: new Set(),
      abortControllers: new Set(),
      eventListeners: new Map(),
      observers: new Set()
    };

    this.componentCleanups.set(componentId, cleanup);
    return cleanup;
  }

  public unregisterComponent(componentId: string): void {
    const cleanup = this.componentCleanups.get(componentId);
    if (cleanup) {
      this.cleanupComponent(cleanup);
      this.componentCleanups.delete(componentId);
    }
  }

  private cleanupComponent(cleanup: ComponentCleanup): void {
    // Clear timers
    cleanup.timers.forEach(timer => clearTimeout(timer));
    cleanup.timers.clear();

    // Clear intervals
    cleanup.intervals.forEach(interval => clearInterval(interval));
    cleanup.intervals.clear();

    // Abort fetch requests
    cleanup.abortControllers.forEach(controller => {
      try {
        controller.abort();
      } catch (e) {
        // Already aborted
      }
    });
    cleanup.abortControllers.clear();

    // Remove event listeners
    cleanup.eventListeners.forEach((listeners, target) => {
      listeners.forEach((listener, event) => {
        try {
          target.removeEventListener(event, listener);
        } catch (e) {
          // Listener already removed
        }
      });
    });
    cleanup.eventListeners.clear();

    // Disconnect observers
    cleanup.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        // Observer already disconnected
      }
    });
    cleanup.observers.clear();
  }

  public getMemoryMetrics(): MemoryMetrics {
    const memory = (performance as any).memory;
    
    if (memory) {
      const utilization = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      return {
        heapUsed: memory.usedJSHeapSize,
        heapTotal: memory.totalJSHeapSize,
        heapLimit: memory.jsHeapSizeLimit,
        utilization,
        pressure: this.categorizeMemoryPressure(utilization)
      };
    }

    // Fallback for browsers without memory API
    return {
      heapUsed: 0,
      heapTotal: 0,
      heapLimit: 0,
      utilization: 0,
      pressure: 'low'
    };
  }

  private categorizeMemoryPressure(utilization: number): 'low' | 'medium' | 'high' | 'critical' {
    if (utilization > 0.95) return 'critical';
    if (utilization > 0.85) return 'high';
    if (utilization > 0.70) return 'medium';
    return 'low';
  }

  private checkMemoryPressure(): void {
    const metrics = this.getMemoryMetrics();
    
    if (metrics.pressure === 'critical') {
      this.handleCriticalMemoryPressure();
    } else if (metrics.pressure === 'high') {
      this.handleMemoryPressure();
    }
  }

  private handleMemoryPressure(): void {
    console.warn('Memory pressure detected, performing cleanup');
    
    // Notify registered callbacks
    this.memoryPressureCallbacks.forEach(callback => {
      try {
        callback();
      } catch (e) {
        console.error('Memory pressure callback error:', e);
      }
    });

    // Perform garbage collection if available
    this.requestGarbageCollection();
    
    // Reduce concurrent operations
    this.performanceProfile.maxConcurrentOperations = Math.max(
      this.performanceProfile.maxConcurrentOperations - 2,
      1
    );
  }

  private handleCriticalMemoryPressure(): void {
    console.error('CRITICAL memory pressure detected, performing emergency cleanup');
    
    // Emergency cleanup of all components
    this.componentCleanups.forEach((cleanup, componentId) => {
      console.warn(`Emergency cleanup of component: ${componentId}`);
      this.cleanupComponent(cleanup);
    });

    // Force garbage collection
    this.requestGarbageCollection();
    
    // Reduce to minimum operations
    this.performanceProfile.maxConcurrentOperations = 1;

    // Send alert to monitoring
    this.sendCriticalMemoryAlert();
  }

  private performMaintenanceCleanup(): void {
    // Clean up inactive components
    this.componentCleanups.forEach((cleanup, componentId) => {
      // Only cleanup if component has been inactive
      if (this.isComponentInactive(componentId)) {
        this.cleanupComponent(cleanup);
      }
    });

    this.requestGarbageCollection();
  }

  private emergencyCleanup(): void {
    // Clean up everything immediately
    this.componentCleanups.forEach(cleanup => {
      this.cleanupComponent(cleanup);
    });
    this.componentCleanups.clear();
  }

  private isComponentInactive(componentId: string): boolean {
    // Simple heuristic - check if component is in viewport or has recent activity
    const element = typeof window !== 'undefined' && document.querySelector(`[data-component-id="${componentId}"]`);
    if (!element) return true;

    const rect = element.getBoundingClientRect();
    return rect.bottom < 0 || rect.top > typeof window !== 'undefined' && window.innerHeight;
  }

  private requestGarbageCollection(): void {
    if (this.gcScheduled) return;
    
    this.gcScheduled = true;
    
    // Use various techniques to trigger GC
    if ('gc' in typeof window !== 'undefined' && window) {
      (typeof window !== 'undefined' && window as any).gc();
    }
    
    // Fallback: create memory pressure to trigger GC
    setTimeout(() => {
      const dummy = new Array(1000000).fill(null);
      dummy.length = 0;
      this.gcScheduled = false;
    }, 0);
  }

  private async sendCriticalMemoryAlert(): Promise<void> {
    try {
      const metrics = this.getMemoryMetrics();
      
      await fetch('/api/monitoring/critical-memory-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          url: typeof window !== 'undefined' && window.location.href,
          userAgent: typeof window !== 'undefined' && navigator.userAgent,
          metrics,
          performanceProfile: this.performanceProfile,
          severity: 'critical'
        })
      });
    } catch (error) {
      console.error('Failed to send critical memory alert:', error);
    }
  }

  public onMemoryPressure(callback: () => void): () => void {
    this.memoryPressureCallbacks.add(callback);
    
    return () => {
      this.memoryPressureCallbacks.delete(callback);
    };
  }

  public optimizeForCrisis(): void {
    // Ultra-aggressive optimizations for crisis pages
    this.memoryPressureThreshold = 0.70; // Lower threshold
    this.criticalThreshold = 0.85;
    this.performanceProfile.maxConcurrentOperations = 2;
    
    // Immediate cleanup
    this.performMaintenanceCleanup();
  }

  public getPerformanceProfile(): PerformanceProfile {
    return { ...this.performanceProfile };
  }

  public shouldDeferOperation(): boolean {
    const metrics = this.getMemoryMetrics();
    return metrics.utilization > this.memoryPressureThreshold;
  }

  public canStartOperation(): boolean {
    const activeOperations = this.getActiveOperationsCount();
    return activeOperations < this.performanceProfile.maxConcurrentOperations;
  }

  private getActiveOperationsCount(): number {
    let count = 0;
    this.componentCleanups.forEach(cleanup => {
      count += cleanup.abortControllers.size;
    });
    return count;
  }
}

// React hook for memory management
export const useCrisisMemoryManagement = (componentId: string) => {
  const memoryManager = CrisisMemoryManager.getInstance();
  const cleanupRef = React.useRef<ComponentCleanup | null>(null);

  React.useEffect(() => {
    cleanupRef.current = memoryManager.registerComponent(componentId);
    
    return () => {
      memoryManager.unregisterComponent(componentId);
    };
  }, [componentId, memoryManager]);

  const createTimer = React.useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    cleanupRef.current?.timers.add(timer);
    return timer;
  }, []);

  const createInterval = React.useCallback((callback: () => void, delay: number) => {
    const interval = setInterval(callback, delay);
    cleanupRef.current?.intervals.add(interval);
    return interval;
  }, []);

  const createAbortController = React.useCallback(() => {
    const controller = new AbortController();
    cleanupRef.current?.abortControllers.add(controller);
    return controller;
  }, []);

  const addEventListener = React.useCallback((
    target: EventTarget, 
    event: string, 
    listener: EventListener
  ) => {
    target.addEventListener(event, listener);
    
    if (!cleanupRef.current?.eventListeners.has(target)) {
      cleanupRef.current?.eventListeners.set(target, new Map());
    }
    cleanupRef.current?.eventListeners.get(target)?.set(event, listener);
  }, []);

  const createObserver = React.useCallback((observer: any) => {
    cleanupRef.current?.observers.add(observer);
    return observer;
  }, []);

  return {
    createTimer,
    createInterval,
    createAbortController,
    addEventListener,
    createObserver,
    getMemoryMetrics: () => memoryManager.getMemoryMetrics(),
    shouldDeferOperation: () => memoryManager.shouldDeferOperation(),
    canStartOperation: () => memoryManager.canStartOperation(),
    onMemoryPressure: (callback: () => void) => memoryManager.onMemoryPressure(callback)
  };
};

// Crisis-specific performance optimization
export const optimizeForCrisisUser = () => {
  const memoryManager = CrisisMemoryManager.getInstance();
  memoryManager.optimizeForCrisis();
  
  // Additional crisis optimizations
  if ('requestIdleCallback' in typeof window !== 'undefined' && window) {
    requestIdleCallback(() => {
      // Defer non-critical operations
      const nonCriticalElements = typeof window !== 'undefined' && document.querySelectorAll('[data-non-critical]');
      nonCriticalElements.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    });
  }
};

export default CrisisMemoryManager;