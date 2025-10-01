// ALCHM Crisis Performance Monitor
// Real-time performance tracking and battery optimization for trauma-informed mobile users
// Ensures <3 second crisis resource access with intelligent resource management

interface PerformanceMetrics {
  timestamp: number;
  loadTime: number;
  resourceType: string;
  url: string;
  cacheStatus: 'hit' | 'miss' | 'stale';
  connectionType: string;
  batteryLevel: number;
  memoryUsage: number;
  isEmergencyAccess: boolean;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  isCrisisMode: boolean;
}

interface CrisisPerformanceThresholds {
  criticalResourceLoad: 1000; // 1 second max for crisis resources
  emergencyResourceLoad: 2000; // 2 seconds max for emergency resources
  normalResourceLoad: 3000; // 3 seconds max for normal resources
  batteryLowThreshold: 0.2; // 20% battery
  batteryCriticalThreshold: 0.1; // 10% battery
  memoryHighThreshold: 100; // 100MB memory usage
  memoryCriticalThreshold: 200; // 200MB memory usage
}

interface BatteryOptimizationStrategy {
  level: 'normal' | 'conservation' | 'emergency';
  disableAnimations: boolean;
  reducePolling: boolean;
  limitCacheSize: boolean;
  disableBackground: boolean;
  minimizeNetworkRequests: boolean;
}

class CrisisPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private thresholds: CrisisPerformanceThresholds = {
    criticalResourceLoad: 1000,
    emergencyResourceLoad: 2000,
    normalResourceLoad: 3000,
    batteryLowThreshold: 0.2,
    batteryCriticalThreshold: 0.1,
    memoryHighThreshold: 100,
    memoryCriticalThreshold: 200
  };
  
  private battery: any = null;
  private performanceObserver: PerformanceObserver | null = null;
  private memoryMonitorInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private crisisMode = false;
  private optimizationStrategy: BatteryOptimizationStrategy = {
    level: 'normal',
    disableAnimations: false,
    reducePolling: false,
    limitCacheSize: false,
    disableBackground: false,
    minimizeNetworkRequests: false
  };

  constructor() {
    this.initializeMonitoring();
  }

  // Initialize comprehensive monitoring system
  private async initializeMonitoring(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Battery monitoring
    await this.initializeBatteryMonitoring();
    
    // Performance monitoring
    this.initializePerformanceObserver();
    
    // Memory monitoring
    this.initializeMemoryMonitoring();
    
    // Network monitoring
    this.initializeNetworkMonitoring();
    
    // User interaction monitoring
    this.initializeUserInteractionMonitoring();
    
    // Crisis mode detection
    this.initializeCrisisModeDetection();
    
    this.isMonitoring = true;
    console.log('[Crisis Monitor] Performance monitoring initialized');
  }

  // Battery monitoring with adaptive optimization
  private async initializeBatteryMonitoring(): Promise<void> {
    if (!('getBattery' in navigator)) {
      console.warn('[Crisis Monitor] Battery API not available');
      return;
    }

    try {
      this.battery = await (navigator as any).getBattery();
      
      // Initial battery optimization
      this.updateBatteryOptimization(this.battery.level, this.battery.charging);
      
      // Monitor battery changes
      this.battery.addEventListener('levelchange', () => {
        this.updateBatteryOptimization(this.battery.level, this.battery.charging);
      });
      
      this.battery.addEventListener('chargingchange', () => {
        this.updateBatteryOptimization(this.battery.level, this.battery.charging);
      });
      
    } catch (error) {
      console.warn('[Crisis Monitor] Battery monitoring initialization failed:', error);
    }
  }

  // Performance observer for resource loading
  private initializePerformanceObserver(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('[Crisis Monitor] PerformanceObserver not available');
      return;
    }

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processPerformanceEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.performanceObserver.observe({ 
        entryTypes: ['navigation', 'resource', 'measure', 'paint', 'largest-contentful-paint']
      });
      
    } catch (error) {
      console.warn('[Crisis Monitor] PerformanceObserver initialization failed:', error);
    }
  }

  // Memory monitoring for mobile devices
  private initializeMemoryMonitoring(): void {
    if (!('memory' in performance)) {
      console.warn('[Crisis Monitor] Memory API not available');
      return;
    }

    this.memoryMonitorInterval = setInterval(() => {
      const memInfo = (performance as any).memory;
      const memoryUsage = memInfo.usedJSHeapSize / 1024 / 1024; // MB
      
      this.checkMemoryThresholds(memoryUsage);
      
      // Trigger garbage collection hint if memory is high
      if (memoryUsage > this.thresholds.memoryHighThreshold) {
        this.triggerMemoryOptimization();
      }
      
    }, 5000); // Check every 5 seconds
  }

  // Network monitoring for adaptive loading
  private initializeNetworkMonitoring(): void {
    if (!('connection' in navigator)) {
      console.warn('[Crisis Monitor] Network Information API not available');
      return;
    }

    const connection = (navigator as any).connection;
    
    const updateNetworkStrategy = () => {
      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      
      // Adaptive loading based on connection quality
      if (['slow-2g', '2g'].includes(effectiveType) || downlink < 0.5) {
        this.enableSlowConnectionOptimizations();
      } else if (['3g'].includes(effectiveType) || downlink < 2) {
        this.enableMediumConnectionOptimizations();
      } else {
        this.disableConnectionOptimizations();
      }
    };
    
    updateNetworkStrategy();
    connection.addEventListener('change', updateNetworkStrategy);
  }

  // User interaction monitoring for crisis detection
  private initializeUserInteractionMonitoring(): void {
    // Monitor for rapid interactions that might indicate distress
    let rapidClickCount = 0;
    let rapidClickTimer: NodeJS.Timeout | null = null;
    
    document.addEventListener('click', () => {
      rapidClickCount++;
      
      if (rapidClickTimer) {
        clearTimeout(rapidClickTimer);
      }
      
      rapidClickTimer = setTimeout(() => {
        if (rapidClickCount > 10) { // More than 10 clicks in 5 seconds
          this.detectPotentialCrisis('rapid_interactions');
        }
        rapidClickCount = 0;
      }, 5000);
    });
    
    // Monitor for long presses (might indicate trembling hands)
    let longPressTimer: NodeJS.Timeout | null = null;
    
    document.addEventListener('touchstart', () => {
      longPressTimer = setTimeout(() => {
        this.detectPotentialCrisis('long_press_detected');
      }, 2000);
    });
    
    document.addEventListener('touchend', () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    });
  }

  // Crisis mode detection and activation
  private initializeCrisisModeDetection(): void {
    // Check if crisis mode is already active
    const storedCrisisLevel = localStorage.getItem('alchm-crisis-level');
    if (storedCrisisLevel && storedCrisisLevel !== 'normal') {
      this.activateCrisisMode();
    }
    
    // Monitor for crisis-related URL patterns
    const currentPath = window.location.pathname;
    if (currentPath.includes('crisis') || currentPath.includes('emergency')) {
      this.activateCrisisMode();
    }
  }

  // Process performance entries and check thresholds
  private processPerformanceEntry(entry: PerformanceEntry): void {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      loadTime: entry.duration || 0,
      resourceType: entry.entryType,
      url: entry.name,
      cacheStatus: this.determineCacheStatus(entry),
      connectionType: this.getConnectionType(),
      batteryLevel: this.getBatteryLevel(),
      memoryUsage: this.getMemoryUsage(),
      isEmergencyAccess: this.isEmergencyResource(entry.name),
      deviceType: this.getDeviceType(),
      isCrisisMode: this.crisisMode
    };
    
    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory bloat
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-50);
    }
    
    // Check performance thresholds
    this.checkPerformanceThresholds(metric);
  }

  // Check if performance exceeds crisis thresholds
  private checkPerformanceThresholds(metric: PerformanceMetrics): void {
    const { loadTime, isEmergencyAccess, resourceType } = metric;
    
    // Crisis resource threshold checking
    if (isEmergencyAccess && loadTime > this.thresholds.criticalResourceLoad) {
      console.warn(`[Crisis Monitor] CRITICAL: Crisis resource exceeded 1s threshold: ${loadTime}ms`);
      this.triggerEmergencyOptimization();
    }
    
    // Emergency resource threshold
    if (this.isEmergencyResourceType(resourceType) && loadTime > this.thresholds.emergencyResourceLoad) {
      console.warn(`[Crisis Monitor] Emergency resource slow: ${loadTime}ms`);
      this.triggerPerformanceOptimization();
    }
    
    // General resource threshold
    if (loadTime > this.thresholds.normalResourceLoad) {
      console.warn(`[Crisis Monitor] Slow resource detected: ${loadTime}ms`);
      this.suggestOptimization();
    }
  }

  // Update battery optimization strategy
  private updateBatteryOptimization(level: number, isCharging: boolean): void {
    const previousLevel = this.optimizationStrategy.level;
    
    if (level < this.thresholds.batteryCriticalThreshold) {
      this.optimizationStrategy = {
        level: 'emergency',
        disableAnimations: true,
        reducePolling: true,
        limitCacheSize: true,
        disableBackground: true,
        minimizeNetworkRequests: true
      };
    } else if (level < this.thresholds.batteryLowThreshold && !isCharging) {
      this.optimizationStrategy = {
        level: 'conservation',
        disableAnimations: true,
        reducePolling: true,
        limitCacheSize: true,
        disableBackground: false,
        minimizeNetworkRequests: false
      };
    } else {
      this.optimizationStrategy = {
        level: 'normal',
        disableAnimations: false,
        reducePolling: false,
        limitCacheSize: false,
        disableBackground: false,
        minimizeNetworkRequests: false
      };
    }
    
    if (previousLevel !== this.optimizationStrategy.level) {
      this.applyBatteryOptimizations();
    }
  }

  // Apply battery optimizations to the system
  private applyBatteryOptimizations(): void {
    const { level, disableAnimations, reducePolling } = this.optimizationStrategy;
    
    // Apply CSS-based optimizations
    const root = document.documentElement;
    
    if (disableAnimations) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Notify service worker of battery optimization
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'BATTERY_OPTIMIZATION',
          level,
          strategy: this.optimizationStrategy
        });
      });
    }
    
    console.log(`[Crisis Monitor] Battery optimization level: ${level}`);
  }

  // Crisis mode activation
  private activateCrisisMode(): void {
    if (this.crisisMode) return;
    
    this.crisisMode = true;
    
    // Immediately apply crisis optimizations
    this.triggerEmergencyOptimization();
    
    // Store crisis mode state
    localStorage.setItem('alchm-crisis-level', 'crisis');
    
    // Add crisis mode class to document
    document.documentElement.classList.add('crisis-mode-active');
    
    console.log('[Crisis Monitor] Crisis mode activated');
  }

  // Trigger emergency performance optimizations
  private triggerEmergencyOptimization(): void {
    // Clear non-essential caches
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'EMERGENCY_MODE_ACTIVATE' });
      });
    }
    
    // Disable non-essential features
    this.disableNonEssentialFeatures();
    
    // Force battery conservation
    this.optimizationStrategy.level = 'emergency';
    this.applyBatteryOptimizations();
  }

  // Trigger general performance optimization
  private triggerPerformanceOptimization(): void {
    // Suggest cache clearing
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'CLEAR_NON_CRITICAL_CACHE' });
      });
    }
  }

  // Disable non-essential features during crisis
  private disableNonEssentialFeatures(): void {
    // Disable analytics
    window.gtag && window.gtag('config', 'GA_MEASUREMENT_ID', { 'send_page_view': false });
    
    // Reduce polling intervals
    const pollingElements = document.querySelectorAll('[data-polling]');
    pollingElements.forEach(element => {
      element.setAttribute('data-polling-disabled', 'true');
    });
    
    // Disable auto-refresh features
    const autoRefreshElements = document.querySelectorAll('[data-auto-refresh]');
    autoRefreshElements.forEach(element => {
      element.setAttribute('data-auto-refresh-disabled', 'true');
    });
  }

  // Utility functions
  private determineCacheStatus(entry: PerformanceEntry): 'hit' | 'miss' | 'stale' {
    const transferSize = (entry as any).transferSize;
    if (transferSize === 0) return 'hit';
    if (transferSize < 1000) return 'stale';
    return 'miss';
  }

  private getConnectionType(): string {
    return (navigator as any).connection?.effectiveType || 'unknown';
  }

  private getBatteryLevel(): number {
    return this.battery?.level || 1;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent;
    if (/iPad/i.test(userAgent)) return 'tablet';
    if (/Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private isEmergencyResource(url: string): boolean {
    return url.includes('crisis') || 
           url.includes('emergency') || 
           url.includes('988') ||
           url.includes('hotline');
  }

  private isEmergencyResourceType(type: string): boolean {
    return type === 'navigation' || type === 'resource';
  }

  private detectPotentialCrisis(trigger: string): void {
    console.log(`[Crisis Monitor] Potential crisis detected: ${trigger}`);
    
    // Don't immediately activate crisis mode, but prepare optimizations
    this.triggerPerformanceOptimization();
    
    // Could trigger gentle intervention here
    this.notifyPotentialCrisis(trigger);
  }

  private notifyPotentialCrisis(trigger: string): void {
    // Subtle notification that doesn't overwhelm the user
    // This could integrate with crisis intervention systems
    console.log(`[Crisis Monitor] Crisis intervention available if needed (${trigger})`);
  }

  private enableSlowConnectionOptimizations(): void {
    document.documentElement.classList.add('slow-connection');
  }

  private enableMediumConnectionOptimizations(): void {
    document.documentElement.classList.add('medium-connection');
  }

  private disableConnectionOptimizations(): void {
    document.documentElement.classList.remove('slow-connection', 'medium-connection');
  }

  private checkMemoryThresholds(memoryUsage: number): void {
    if (memoryUsage > this.thresholds.memoryCriticalThreshold) {
      this.triggerMemoryOptimization();
    }
  }

  private triggerMemoryOptimization(): void {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Clear old metrics
    this.metrics = this.metrics.slice(-20);
    
    // Suggest cache clearing
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({ type: 'CLEAR_CRISIS_CACHE' });
      });
    }
  }

  private suggestOptimization(): void {
    // Log suggestion for potential improvements
    console.log('[Crisis Monitor] Performance optimization suggested');
  }

  // Public API methods
  public getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  public getCurrentOptimizationLevel(): BatteryOptimizationStrategy {
    return { ...this.optimizationStrategy };
  }

  public forceCrisisMode(): void {
    this.activateCrisisMode();
  }

  public resetCrisisMode(): void {
    this.crisisMode = false;
    localStorage.setItem('alchm-crisis-level', 'normal');
    document.documentElement.classList.remove('crisis-mode-active');
    
    // Reset optimizations
    this.optimizationStrategy.level = 'normal';
    this.applyBatteryOptimizations();
  }

  public destroy(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }
    
    this.isMonitoring = false;
  }
}

// Export singleton instance
export const crisisPerformanceMonitor = new CrisisPerformanceMonitor();

// Export types for external use
export type { PerformanceMetrics, BatteryOptimizationStrategy };