'use client';

/**
 * Crisis Performance Monitor
 * Ensures optimal performance for vulnerable users on low-end devices
 * Automatically adapts interface based on device capabilities and crisis state
 */

interface PerformanceMetrics {
  memoryUsage: number;
  cpuUtilization: number;
  batteryLevel: number;
  networkSpeed: 'fast' | 'moderate' | 'slow' | 'offline';
  frameRate: number;
  renderTime: number;
  interactionDelay: number;
}

interface OptimizationLevel {
  level: 'standard' | 'reduced' | 'minimal' | 'crisis';
  disableAnimations: boolean;
  reduceImageQuality: boolean;
  simplifyLayout: boolean;
  prioritizeCrisisElements: boolean;
  maxMemoryUsage: number;
  targetFrameRate: number;
}

class CrisisPerformanceMonitor {
  private metrics: PerformanceMetrics;
  private optimizationLevel: OptimizationLevel;
  private monitoringInterval: number | null = null;
  private observers: Set<(level: OptimizationLevel) => void> = new Set();
  private emergencyMode = false;
  private criticalResourcesLoaded = false;

  constructor() {
    this.metrics = {
      memoryUsage: 0,
      cpuUtilization: 0,
      batteryLevel: 1,
      networkSpeed: 'moderate',
      frameRate: 60,
      renderTime: 0,
      interactionDelay: 0
    };

    this.optimizationLevel = {
      level: 'standard',
      disableAnimations: false,
      reduceImageQuality: false,
      simplifyLayout: false,
      prioritizeCrisisElements: false,
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      targetFrameRate: 60
    };

    this.initializeMonitoring();
  }

  private async initializeMonitoring() {
    // Initial device assessment
    await this.assessDeviceCapabilities();
    
    // Start continuous monitoring
    this.startMonitoring();
    
    // Monitor for crisis situations
    this.setupCrisisDetection();
    
    // Preload critical crisis resources
    this.preloadCrisisResources();
  }

  private async assessDeviceCapabilities() {
    try {
      // Memory assessment
      const deviceMemory = (navigator as any).deviceMemory || 2;
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      
      // Network assessment
      const connection = (navigator as any).connection;
      if (connection) {
        this.metrics.networkSpeed = this.getNetworkSpeed(connection);
      }
      
      // Battery assessment
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        this.metrics.batteryLevel = battery.level;
        
        // Monitor battery changes
        battery.addEventListener('levelchange', () => {
          this.metrics.batteryLevel = battery.level;
          this.updateOptimizationLevel();
        });
      }
      
      // Initial optimization level based on device
      if (deviceMemory <= 2 || hardwareConcurrency <= 2) {
        this.setOptimizationLevel('minimal');
      } else if (deviceMemory <= 4 || hardwareConcurrency <= 4) {
        this.setOptimizationLevel('reduced');
      }
      
    } catch (error) {
      console.warn('Device assessment failed, using conservative settings:', error);
      this.setOptimizationLevel('minimal');
    }
  }

  private getNetworkSpeed(connection: any): PerformanceMetrics['networkSpeed'] {
    const effectiveType = connection.effectiveType;
    const downlink = connection.downlink;
    
    if (!navigator.onLine) return 'offline';
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g' || downlink < 1.5) return 'slow';
    if (effectiveType === '4g' && downlink > 10) return 'fast';
    return 'moderate';
  }

  private startMonitoring() {
    // Monitor every 5 seconds during normal operation
    // Every 1 second during crisis mode
    const interval = this.emergencyMode ? 1000 : 5000;
    
    this.monitoringInterval = window.setInterval(() => {
      this.updateMetrics();
      this.updateOptimizationLevel();
    }, interval);

    // Monitor frame rate
    this.monitorFrameRate();
    
    // Monitor user interactions
    this.monitorInteractionLatency();
  }

  private updateMetrics() {
    try {
      // Memory usage (if available)
      if ('memory' in performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
      }
      
      // CPU utilization estimation based on task scheduling
      this.estimateCPUUtilization();
      
    } catch (error) {
      console.warn('Metrics update failed:', error);
    }
  }

  private estimateCPUUtilization() {
    const start = performance.now();
    const iterations = 10000;
    
    // Perform a small computation task
    let result = 0;
    for (let i = 0; i < iterations; i++) {
      result += Math.random();
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Estimate CPU load based on how long this took
    // On fast devices: ~0.1ms, on slow devices: >2ms
    this.metrics.cpuUtilization = Math.min(duration / 2, 1);
  }

  private monitorFrameRate() {
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fpsSum = 0;
    
    const measureFrame = (currentTime: number) => {
      const delta = currentTime - lastFrameTime;
      const fps = 1000 / delta;
      
      fpsSum += fps;
      frameCount++;
      
      // Update average every 60 frames
      if (frameCount >= 60) {
        this.metrics.frameRate = fpsSum / frameCount;
        frameCount = 0;
        fpsSum = 0;
      }
      
      lastFrameTime = currentTime;
      
      if (!this.emergencyMode || this.metrics.frameRate > 30) {
        requestAnimationFrame(measureFrame);
      }
    };
    
    requestAnimationFrame(measureFrame);
  }

  private monitorInteractionLatency() {
    let interactionStart = 0;
    
    // Monitor click/touch response time
    const measureInteraction = (event: Event) => {
      if (event.type === 'mousedown' || event.type === 'touchstart') {
        interactionStart = performance.now();
      } else if (event.type === 'click' || event.type === 'touchend') {
        if (interactionStart > 0) {
          this.metrics.interactionDelay = performance.now() - interactionStart;
          interactionStart = 0;
        }
      }
    };
    
    document.addEventListener('mousedown', measureInteraction, { passive: true });
    document.addEventListener('touchstart', measureInteraction, { passive: true });
    document.addEventListener('click', measureInteraction, { passive: true });
    document.addEventListener('touchend', measureInteraction, { passive: true });
  }

  private setupCrisisDetection() {
    // Monitor for crisis keywords in text inputs
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'worthless', 'hopeless',
      'want to die', 'hurt myself', 'cutting', 'overdose'
    ];
    
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLTextAreaElement | HTMLInputElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        const text = target.value.toLowerCase();
        const containsCrisisKeywords = crisisKeywords.some(keyword => text.includes(keyword));
        
        if (containsCrisisKeywords && !this.emergencyMode) {
          this.activateEmergencyMode();
        }
      }
    });
    
    // Monitor for rapid, erratic interactions (panic/distress)
    let rapidInteractionCount = 0;
    let lastInteractionTime = 0;
    
    document.addEventListener('click', () => {
      const now = performance.now();
      if (now - lastInteractionTime < 500) { // Rapid clicks
        rapidInteractionCount++;
        if (rapidInteractionCount > 5 && !this.emergencyMode) {
          this.activateEmergencyMode();
        }
      } else {
        rapidInteractionCount = 0;
      }
      lastInteractionTime = now;
    }, { passive: true });
  }

  private async preloadCrisisResources() {
    try {
      // Preload essential crisis resources
      const criticalResources = [
        '/crisis-support',
        '/emergency-contacts',
        '/offline-resources'
      ];
      
      // Only preload if we have sufficient bandwidth
      if (this.metrics.networkSpeed !== 'slow' && this.metrics.networkSpeed !== 'offline') {
        await Promise.all(criticalResources.map(url => 
          fetch(url, { method: 'HEAD' }).catch(() => {})
        ));
      }
      
      this.criticalResourcesLoaded = true;
    } catch (error) {
      console.warn('Crisis resource preloading failed:', error);
    }
  }

  private updateOptimizationLevel() {
    let newLevel: OptimizationLevel['level'] = 'standard';
    
    // Crisis mode always gets highest priority
    if (this.emergencyMode) {
      newLevel = 'crisis';
    }
    // Performance-based optimization
    else if (
      this.metrics.memoryUsage > 50 * 1024 * 1024 || // >50MB
      this.metrics.frameRate < 20 ||
      this.metrics.cpuUtilization > 0.8 ||
      this.metrics.batteryLevel < 0.15
    ) {
      newLevel = 'minimal';
    }
    else if (
      this.metrics.memoryUsage > 25 * 1024 * 1024 || // >25MB
      this.metrics.frameRate < 45 ||
      this.metrics.cpuUtilization > 0.6 ||
      this.metrics.batteryLevel < 0.25 ||
      this.metrics.networkSpeed === 'slow'
    ) {
      newLevel = 'reduced';
    }
    
    if (newLevel !== this.optimizationLevel.level) {
      this.setOptimizationLevel(newLevel);
    }
  }

  private setOptimizationLevel(level: OptimizationLevel['level']) {
    const optimizations: Record<OptimizationLevel['level'], OptimizationLevel> = {
      standard: {
        level: 'standard',
        disableAnimations: false,
        reduceImageQuality: false,
        simplifyLayout: false,
        prioritizeCrisisElements: false,
        maxMemoryUsage: 100 * 1024 * 1024,
        targetFrameRate: 60
      },
      reduced: {
        level: 'reduced',
        disableAnimations: false,
        reduceImageQuality: true,
        simplifyLayout: false,
        prioritizeCrisisElements: false,
        maxMemoryUsage: 50 * 1024 * 1024,
        targetFrameRate: 45
      },
      minimal: {
        level: 'minimal',
        disableAnimations: true,
        reduceImageQuality: true,
        simplifyLayout: true,
        prioritizeCrisisElements: false,
        maxMemoryUsage: 25 * 1024 * 1024,
        targetFrameRate: 30
      },
      crisis: {
        level: 'crisis',
        disableAnimations: true,
        reduceImageQuality: true,
        simplifyLayout: true,
        prioritizeCrisisElements: true,
        maxMemoryUsage: 15 * 1024 * 1024,
        targetFrameRate: 30
      }
    };
    
    this.optimizationLevel = optimizations[level];
    this.applyOptimizations();
    this.notifyObservers();
  }

  private applyOptimizations() {
    const body = document.body;
    
    // Remove previous optimization classes
    body.classList.remove(
      'perf-standard', 'perf-reduced', 'perf-minimal', 'perf-crisis',
      'disable-animations', 'reduce-images', 'simplify-layout', 'crisis-priority'
    );
    
    // Apply current optimization classes
    body.classList.add(`perf-${this.optimizationLevel.level}`);
    
    if (this.optimizationLevel.disableAnimations) {
      body.classList.add('disable-animations');
    }
    
    if (this.optimizationLevel.reduceImageQuality) {
      body.classList.add('reduce-images');
    }
    
    if (this.optimizationLevel.simplifyLayout) {
      body.classList.add('simplify-layout');
    }
    
    if (this.optimizationLevel.prioritizeCrisisElements) {
      body.classList.add('crisis-priority');
    }
    
    // Force garbage collection if available
    if ('gc' in window && this.optimizationLevel.level === 'crisis') {
      try {
        (window as any).gc();
      } catch (error) {
        // Ignore - not available in production
      }
    }
  }

  public activateEmergencyMode() {
    if (!this.emergencyMode) {
      this.emergencyMode = true;
      this.setOptimizationLevel('crisis');
      
      // Restart monitoring with higher frequency
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
      }
      this.startMonitoring();
      
      // Ensure crisis resources are immediately available
      this.ensureCrisisResourceAvailability();
    }
  }

  public deactivateEmergencyMode() {
    this.emergencyMode = false;
    this.updateOptimizationLevel();
  }

  private async ensureCrisisResourceAvailability() {
    try {
      // Check if service worker has crisis resources cached
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'VERIFY_CRISIS_CACHE'
        });
      }
      
      // Prefetch critical crisis components if not loaded
      if (!this.criticalResourcesLoaded) {
        await this.preloadCrisisResources();
      }
    } catch (error) {
      console.warn('Crisis resource verification failed:', error);
    }
  }

  public subscribe(callback: (level: OptimizationLevel) => void) {
    this.observers.add(callback);
    
    // Immediately notify with current level
    callback(this.optimizationLevel);
    
    return () => {
      this.observers.delete(callback);
    };
  }

  private notifyObservers() {
    this.observers.forEach(callback => {
      try {
        callback(this.optimizationLevel);
      } catch (error) {
        console.warn('Observer notification failed:', error);
      }
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getOptimizationLevel(): OptimizationLevel {
    return { ...this.optimizationLevel };
  }

  public isEmergencyMode(): boolean {
    return this.emergencyMode;
  }

  public destroy() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.observers.clear();
  }
}

// Global instance for the app
let globalMonitor: CrisisPerformanceMonitor | null = null;

export function getCrisisPerformanceMonitor(): CrisisPerformanceMonitor {
  if (!globalMonitor) {
    globalMonitor = new CrisisPerformanceMonitor();
  }
  return globalMonitor;
}

export type { PerformanceMetrics, OptimizationLevel };
export { CrisisPerformanceMonitor };