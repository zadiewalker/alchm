/**
 * MOBILE CRISIS PERFORMANCE MONITOR
 * Trauma-informed performance monitoring for mobile users in crisis
 * Automatically adapts interface based on device performance and network conditions
 */

interface PerformanceMetrics {
  connectionType: string;
  deviceMemory: number;
  batteryLevel: number;
  renderingPerformance: number;
  networkLatency: number;
  isLowEndDevice: boolean;
  isCrisisMode: boolean;
}

interface CrisisPerformanceSettings {
  animations: 'full' | 'reduced' | 'none';
  backgroundEffects: boolean;
  hapticFeedback: boolean;
  preloadAssets: boolean;
  optimizedRendering: boolean;
}

class MobileCrisisPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private settings: CrisisPerformanceSettings;
  private observers: PerformanceObserver[] = [];
  private crisisCallbacks: Set<(enabled: boolean) => void> = new Set();

  constructor() {
    this.metrics = this.initializeMetrics();
    this.settings = this.calculateOptimalSettings();
    this.setupPerformanceMonitoring();
    this.applySettings();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      connectionType: this.getConnectionType(),
      deviceMemory: this.getDeviceMemory(),
      batteryLevel: this.getBatteryLevel(),
      renderingPerformance: this.measureRenderingPerformance(),
      networkLatency: 0, // Will be measured
      isLowEndDevice: this.isLowEndDevice(),
      isCrisisMode: false
    };
  }

  private getConnectionType(): string {
    if ('connection' in typeof window !== 'undefined' && navigator) {
      const connection = (typeof window !== 'undefined' && navigator as any).connection;
      return connection?.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getDeviceMemory(): number {
    if ('deviceMemory' in typeof window !== 'undefined' && navigator) {
      return (typeof window !== 'undefined' && navigator as any).deviceMemory || 4;
    }
    return 4; // Assume 4GB default
  }

  private getBatteryLevel(): number {
    // Modern browsers have deprecated battery API for privacy
    // Use performance-based heuristics instead
    return 1.0; // Assume full battery if can't detect
  }

  private measureRenderingPerformance(): number {
    const start = performance.now();
    
    // Create a test rendering scenario
    const testElement = typeof window !== 'undefined' && document.createElement('div');
    testElement.style.cssText = `
      position: absolute;
      top: -1000px;
      width: 100px;
      height: 100px;
      background: linear-gradient(45deg, #a4b792, #93a682);
      border-radius: 8px;
      transform: translateZ(0);
    `;
    
    typeof window !== 'undefined' && document.body.appendChild(testElement);
    
    // Force layout and paint
    testElement.offsetHeight;
    
    typeof window !== 'undefined' && document.body.removeChild(testElement);
    
    return performance.now() - start;
  }

  private isLowEndDevice(): boolean {
    // Multiple heuristics to detect low-end devices
    const memory = this.getDeviceMemory();
    const cores = typeof window !== 'undefined' && navigator.hardwareConcurrency || 4;
    const userAgent = typeof window !== 'undefined' && navigator.userAgent.toLowerCase();
    const connection = this.getConnectionType();
    
    // Memory-based detection
    if (memory <= 2) return true;
    
    // Core count detection
    if (cores <= 2) return true;
    
    // Connection-based detection
    if (connection === 'slow-2g' || connection === '2g') return true;
    
    // User agent heuristics for older devices
    const lowEndPatterns = [
      /android 4\./,
      /android 5\./,
      /iphone os [5-8]_/,
      /samsung.*sm-j/,
      /huawei.*honor/
    ];
    
    return lowEndPatterns.some(pattern => pattern.test(userAgent));
  }

  private calculateOptimalSettings(): CrisisPerformanceSettings {
    const isLowEnd = this.metrics.isLowEndDevice;
    const isSlowNetwork = ['slow-2g', '2g', '3g'].includes(this.metrics.connectionType);
    
    return {
      animations: isLowEnd ? 'none' : isSlowNetwork ? 'reduced' : 'full',
      backgroundEffects: !isLowEnd && !isSlowNetwork,
      hapticFeedback: !isLowEnd,
      preloadAssets: !isSlowNetwork && this.metrics.deviceMemory > 2,
      optimizedRendering: isLowEnd || isSlowNetwork
    };
  }

  private setupPerformanceMonitoring(): void {
    // Monitor layout shifts for trauma-informed stability
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if ((entry as any).value > 0.1) {
              this.handleLayoutInstability();
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (error) {
        console.warn('Layout shift monitoring not supported');
      }

      // Monitor long tasks that could interrupt crisis interactions
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.handleLongTask(entry.duration);
            }
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task monitoring not supported');
      }
    }

    // Monitor network changes
    if ('connection' in typeof window !== 'undefined' && navigator) {
      const connection = (typeof window !== 'undefined' && navigator as any).connection;
      connection?.addEventListener('change', () => {
        this.updateNetworkMetrics();
      });
    }

    // Monitor memory pressure
    if ('memory' in performance) {
      setInterval(() => {
        this.checkMemoryPressure();
      }, 30000); // Check every 30 seconds
    }
  }

  private handleLayoutInstability(): void {
    // Reduce animations if layout is unstable
    this.settings.animations = 'reduced';
    this.applySettings();
    
    // Emit crisis mode if multiple instabilities
    this.enableCrisisMode();
  }

  private handleLongTask(duration: number): void {
    console.warn(`Long task detected: ${duration}ms - enabling crisis mode`);
    this.enableCrisisMode();
  }

  private updateNetworkMetrics(): void {
    this.metrics.connectionType = this.getConnectionType();
    this.settings = this.calculateOptimalSettings();
    this.applySettings();
  }

  private checkMemoryPressure(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedPercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      if (usedPercent > 0.8) {
        this.enableCrisisMode();
      }
    }
  }

  private enableCrisisMode(): void {
    if (this.metrics.isCrisisMode) return;
    
    this.metrics.isCrisisMode = true;
    this.settings = {
      animations: 'none',
      backgroundEffects: false,
      hapticFeedback: false,
      preloadAssets: false,
      optimizedRendering: true
    };
    
    this.applySettings();
    this.notifyCrisisCallbacks(true);
    
    // Auto-disable after 2 minutes
    setTimeout(() => {
      this.disableCrisisMode();
    }, 120000);
  }

  private disableCrisisMode(): void {
    this.metrics.isCrisisMode = false;
    this.settings = this.calculateOptimalSettings();
    this.applySettings();
    this.notifyCrisisCallbacks(false);
  }

  private notifyCrisisCallbacks(enabled: boolean): void {
    this.crisisCallbacks.forEach(callback => {
      try {
        callback(enabled);
      } catch (error) {
        console.error('Crisis callback error:', error);
      }
    });
  }

  private applySettings(): void {
    const root = typeof window !== 'undefined' && document.documentElement;
    
    // Apply CSS custom properties for settings
    root.style.setProperty('--crisis-animations', 
      this.settings.animations === 'none' ? '0.01ms' : 
      this.settings.animations === 'reduced' ? '150ms' : '300ms'
    );
    
    root.style.setProperty('--crisis-background-effects', 
      this.settings.backgroundEffects ? '1' : '0'
    );
    
    // Add performance classes
    root.classList.toggle('perf-tier-low', this.metrics.isLowEndDevice);
    root.classList.toggle('crisis-active', this.metrics.isCrisisMode);
    root.classList.toggle('slow-network', 
      ['slow-2g', '2g', '3g'].includes(this.metrics.connectionType)
    );
    
    // Dispatch performance update event
    typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('performanceUpdate', {
      detail: {
        metrics: this.metrics,
        settings: this.settings
      }
    }));
  }

  // Public API
  public getSettings(): CrisisPerformanceSettings {
    return { ...this.settings };
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public onCrisisMode(callback: (enabled: boolean) => void): () => void {
    this.crisisCallbacks.add(callback);
    return () => this.crisisCallbacks.delete(callback);
  }

  public forceCrisisMode(): void {
    this.enableCrisisMode();
  }

  public forceOptimalMode(): void {
    this.disableCrisisMode();
  }

  public measureCoreWebVitals(): Promise<{
    lcp: number;
    fid: number;
    cls: number;
  }> {
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

      // Measure LCP
      if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = (lastEntry as any).startTime;
            checkComplete();
          }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch {
          checkComplete();
        }

        // Measure FID
        try {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            fid = entries[0] ? (entries[0] as any).processingStart - entries[0].startTime : 0;
            checkComplete();
          }).observe({ entryTypes: ['first-input'] });
        } catch {
          checkComplete();
        }

        // Measure CLS
        try {
          new PerformanceObserver((list) => {
            let value = 0;
            for (const entry of list.getEntries()) {
              value += (entry as any).value;
            }
            cls = value;
            checkComplete();
          }).observe({ entryTypes: ['layout-shift'] });
        } catch {
          checkComplete();
        }
      } else {
        // Fallback for browsers without PerformanceObserver
        setTimeout(() => resolve({ lcp: 0, fid: 0, cls: 0 }), 100);
      }
    });
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.crisisCallbacks.clear();
  }
}

// Global instance
let performanceMonitor: MobileCrisisPerformanceMonitor | null = null;

export function initializeMobilePerformanceMonitor(): MobileCrisisPerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new MobileCrisisPerformanceMonitor();
  }
  return performanceMonitor;
}

export function getMobilePerformanceMonitor(): MobileCrisisPerformanceMonitor | null {
  return performanceMonitor;
}

export type { PerformanceMetrics, CrisisPerformanceSettings };