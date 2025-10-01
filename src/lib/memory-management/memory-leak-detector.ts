/**
 * Memory Leak Detection System for ALCHM
 * Implements comprehensive memory monitoring and leak detection
 * for crisis-critical applications
 */

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
  pageUrl?: string;
  componentCount?: number;
  eventListenerCount?: number;
  timerCount?: number;
}

interface MemoryLeak {
  type: 'component' | 'event-listener' | 'timer' | 'firebase' | 'dom' | 'state';
  severity: 'low' | 'medium' | 'high' | 'critical';
  growth: number; // MB per minute
  component?: string;
  description: string;
  timestamp: number;
  stackTrace?: string;
}

interface CleanupFunction {
  name: string;
  cleanup: () => void;
  component?: string;
  type: 'timer' | 'listener' | 'subscription' | 'observer';
}

class MemoryLeakDetector {
  private static instance: MemoryLeakDetector;
  private metrics: MemoryMetrics[] = [];
  private cleanupFunctions: Set<CleanupFunction> = new Set();
  private monitoring: boolean = false;
  private monitoringInterval?: number;
  private alertThreshold: number = 0.5; // MB per minute
  private criticalThreshold: number = 1.5; // MB per minute
  private onLeakDetected?: (leak: MemoryLeak) => void;
  private onCriticalLeak?: (leak: MemoryLeak) => void;
  
  // Crisis-safe mode - more aggressive cleanup for crisis users
  private crisisSafeMode: boolean = false;
  
  private constructor() {
    this.detectCrisisSafeMode();
    this.setupPerformanceObserver();
    this.setupUnloadCleanup();
  }
  
  static getInstance(): MemoryLeakDetector {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector();
    }
    return MemoryLeakDetector.instance;
  }
  
  /**
   * Detect if user is in crisis mode based on navigation patterns
   */
  private detectCrisisSafeMode(): void {
    if (typeof window === 'undefined') return;
    
    const crisisIndicators = [
      '/crisis',
      '/emergency',
      '/support',
      'crisis=true',
      'emergency=true'
    ];
    
    const currentUrl = window.location.href.toLowerCase();
    this.crisisSafeMode = crisisIndicators.some(indicator => 
      currentUrl.includes(indicator)
    );
    
    // More aggressive thresholds for crisis users
    if (this.crisisSafeMode) {
      this.alertThreshold = 0.3; // MB per minute
      this.criticalThreshold = 1.0; // MB per minute
    }
  }
  
  /**
   * Setup performance observer for memory monitoring
   */
  private setupPerformanceObserver(): void {
    if (typeof window === 'undefined' || !window.performance) return;
    
    // Monitor memory pressure events (iOS specific)
    if ('memory' in performance) {
      this.trackMemoryMetrics();
    }
    
    // Listen for memory warnings
    window.addEventListener('memory-warning', this.handleMemoryWarning.bind(this));
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
  }
  
  /**
   * Setup cleanup on page unload
   */
  private setupUnloadCleanup(): void {
    if (typeof window === 'undefined') return;
    
    const cleanup = () => {
      this.stopMonitoring();
      this.executeAllCleanup();
    };
    
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);
    
    // iOS Safari specific
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        cleanup();
      }
    });
  }
  
  /**
   * Start memory monitoring
   */
  startMonitoring(options?: {
    interval?: number;
    onLeakDetected?: (leak: MemoryLeak) => void;
    onCriticalLeak?: (leak: MemoryLeak) => void;
  }): void {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.onLeakDetected = options?.onLeakDetected;
    this.onCriticalLeak = options?.onCriticalLeak;
    
    const interval = this.crisisSafeMode ? 5000 : (options?.interval || 10000);
    
    this.monitoringInterval = window.setInterval(() => {
      this.trackMemoryMetrics();
      this.analyzeMemoryTrends();
      
      // Crisis mode: more frequent cleanup
      if (this.crisisSafeMode && this.metrics.length % 6 === 0) {
        this.performEmergencyCleanup();
      }
    }, interval);
    
    console.log(`[ALCHM Memory] Monitoring started (Crisis mode: ${this.crisisSafeMode})`);
  }
  
  /**
   * Stop memory monitoring
   */
  stopMonitoring(): void {
    if (!this.monitoring) return;
    
    this.monitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    
    console.log('[ALCHM Memory] Monitoring stopped');
  }
  
  /**
   * Track current memory metrics
   */
  private trackMemoryMetrics(): void {
    if (typeof window === 'undefined' || !window.performance) return;
    
    const memory = (performance as any).memory;
    if (!memory) return;
    
    const metrics: MemoryMetrics = {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      timestamp: Date.now(),
      pageUrl: window.location.pathname,
      componentCount: this.getComponentCount(),
      eventListenerCount: this.getEventListenerCount(),
      timerCount: this.getTimerCount()
    };
    
    this.metrics.push(metrics);
    
    // Keep only last 50 measurements (or 25 in crisis mode)
    const maxMetrics = this.crisisSafeMode ? 25 : 50;
    if (this.metrics.length > maxMetrics) {
      this.metrics = this.metrics.slice(-maxMetrics);
    }
  }
  
  /**
   * Analyze memory trends for leak detection
   */
  private analyzeMemoryTrends(): void {
    if (this.metrics.length < 3) return;
    
    const recent = this.metrics.slice(-3);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    const timeDiff = (newest.timestamp - oldest.timestamp) / 1000 / 60; // minutes
    const memoryDiff = (newest.usedJSHeapSize - oldest.usedJSHeapSize) / 1024 / 1024; // MB
    
    if (timeDiff > 0) {
      const growthRate = memoryDiff / timeDiff; // MB per minute
      
      if (growthRate > this.criticalThreshold) {
        const leak: MemoryLeak = {
          type: 'component',
          severity: 'critical',
          growth: growthRate,
          description: `Critical memory leak detected: ${growthRate.toFixed(2)}MB/min growth`,
          timestamp: Date.now(),
          stackTrace: this.getStackTrace()
        };
        
        console.error('[ALCHM Memory] CRITICAL LEAK DETECTED:', leak);
        this.onCriticalLeak?.(leak);
        
        // Emergency cleanup in crisis mode
        if (this.crisisSafeMode) {
          this.performEmergencyCleanup();
        }
        
      } else if (growthRate > this.alertThreshold) {
        const leak: MemoryLeak = {
          type: 'component',
          severity: growthRate > 1.0 ? 'high' : 'medium',
          growth: growthRate,
          description: `Memory leak detected: ${growthRate.toFixed(2)}MB/min growth`,
          timestamp: Date.now()
        };
        
        console.warn('[ALCHM Memory] Leak detected:', leak);
        this.onLeakDetected?.(leak);
      }
    }
  }
  
  /**
   * Register cleanup function for automatic execution
   */
  registerCleanup(cleanup: CleanupFunction): void {
    this.cleanupFunctions.add(cleanup);
  }
  
  /**
   * Unregister cleanup function
   */
  unregisterCleanup(cleanup: CleanupFunction): void {
    this.cleanupFunctions.delete(cleanup);
  }
  
  /**
   * Execute all registered cleanup functions
   */
  executeAllCleanup(): void {
    let cleanedCount = 0;
    
    this.cleanupFunctions.forEach(cleanup => {
      try {
        cleanup.cleanup();
        cleanedCount++;
      } catch (error) {
        console.error(`[ALCHM Memory] Cleanup failed for ${cleanup.name}:`, error);
      }
    });
    
    this.cleanupFunctions.clear();
    console.log(`[ALCHM Memory] Executed ${cleanedCount} cleanup functions`);
  }
  
  /**
   * Perform emergency cleanup for crisis users
   */
  private performEmergencyCleanup(): void {
    console.log('[ALCHM Memory] Performing emergency cleanup...');
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }
    
    // Clear non-essential caches
    this.clearNonEssentialCaches();
    
    // Execute cleanup functions
    this.executeAllCleanup();
    
    // Clear old metrics
    this.metrics = this.metrics.slice(-10);
  }
  
  /**
   * Clear non-essential caches to free memory
   */
  private clearNonEssentialCaches(): void {
    try {
      // Clear browser caches if possible
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            if (!name.includes('crisis') && !name.includes('emergency')) {
              caches.delete(name);
            }
          });
        });
      }
      
      // Clear session storage of non-essential items
      if (typeof Storage !== 'undefined') {
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          if (!key.includes('crisis') && !key.includes('emergency') && !key.includes('auth')) {
            sessionStorage.removeItem(key);
          }
        });
      }
    } catch (error) {
      console.warn('[ALCHM Memory] Cache cleanup failed:', error);
    }
  }
  
  /**
   * Handle memory warning events
   */
  private handleMemoryWarning(): void {
    console.warn('[ALCHM Memory] Memory warning received');
    this.performEmergencyCleanup();
  }
  
  /**
   * Handle page unload
   */
  private handlePageUnload(): void {
    this.stopMonitoring();
    this.executeAllCleanup();
  }
  
  /**
   * Get current component count estimate
   */
  private getComponentCount(): number {
    return document.querySelectorAll('[data-reactroot], [data-react-component]').length || 0;
  }
  
  /**
   * Get event listener count estimate
   */
  private getEventListenerCount(): number {
    // This is an approximation - actual tracking would require patching addEventListener
    return document.querySelectorAll('[onclick], [onload], [onerror]').length || 0;
  }
  
  /**
   * Get timer count estimate
   */
  private getTimerCount(): number {
    // This would need to be tracked by patching setTimeout/setInterval
    return 0;
  }
  
  /**
   * Get stack trace for debugging
   */
  private getStackTrace(): string {
    try {
      throw new Error('Stack trace');
    } catch (e) {
      return e.stack || 'No stack trace available';
    }
  }
  
  /**
   * Get current memory usage summary
   */
  getMemoryUsage(): {
    current: number;
    peak: number;
    growth: number;
    status: 'healthy' | 'warning' | 'critical';
  } {
    if (this.metrics.length === 0) {
      return { current: 0, peak: 0, growth: 0, status: 'healthy' };
    }
    
    const latest = this.metrics[this.metrics.length - 1];
    const peak = Math.max(...this.metrics.map(m => m.usedJSHeapSize));
    
    let growth = 0;
    if (this.metrics.length >= 2) {
      const recent = this.metrics.slice(-3);
      const oldest = recent[0];
      const newest = recent[recent.length - 1];
      const timeDiff = (newest.timestamp - oldest.timestamp) / 1000 / 60;
      const memoryDiff = (newest.usedJSHeapSize - oldest.usedJSHeapSize) / 1024 / 1024;
      growth = timeDiff > 0 ? memoryDiff / timeDiff : 0;
    }
    
    const status = growth > this.criticalThreshold ? 'critical' : 
                   growth > this.alertThreshold ? 'warning' : 'healthy';
    
    return {
      current: latest.usedJSHeapSize / 1024 / 1024, // MB
      peak: peak / 1024 / 1024, // MB
      growth, // MB per minute
      status
    };
  }
}

export default MemoryLeakDetector;
export type { MemoryMetrics, MemoryLeak, CleanupFunction };