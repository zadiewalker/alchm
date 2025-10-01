/**
 * Mobile Performance Monitor - Trauma-Informed Crisis-Safe Implementation
 * Provides real-time device performance monitoring with crisis mode optimization
 * Prioritizes user safety and accessibility during emotional distress
 */

interface PerformanceMetrics {
  deviceTier: 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';
  cpuScore: number;
  memoryScore: number;
  batteryLevel: number;
  isCharging: boolean;
  networkSpeed: '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown';
  frameRate: number;
  isOverheating: boolean;
  isCrisisModeOptimal: boolean;
}

interface CrisisOptimizations {
  disableAnimations: boolean;
  reduceVisualEffects: boolean;
  prioritizeTouch: boolean;
  enlargeTouchTargets: boolean;
  simplifyLayout: boolean;
  conserveBattery: boolean;
}

class MobilePerformanceMonitor {
  private metrics: PerformanceMetrics;
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;
  private updateCallbacks: ((metrics: PerformanceMetrics) => void)[] = [];
  private frameRateBuffer: number[] = [];
  private lastFrameTime = 0;
  private batteryAPI: any = null;

  constructor() {
    this.metrics = {
      deviceTier: 'medium',
      cpuScore: 50,
      memoryScore: 50,
      batteryLevel: 100,
      isCharging: true,
      networkSpeed: 'unknown',
      frameRate: 60,
      isOverheating: false,
      isCrisisModeOptimal: true
    };
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('[Mobile Performance Monitor] Initializing crisis-safe performance monitoring');
      
      await Promise.allSettled([
        this.initializeBatteryMonitoring(),
        this.initializeNetworkMonitoring(),
        this.initializeFrameRateMonitoring(),
        this.initializeThermalMonitoring(),
        this.initializeMemoryMonitoring()
      ]);
      
      this.startContinuousMonitoring();
      this.updateDeviceTier();
      this.isInitialized = true;
      
      console.log('[Mobile Performance Monitor] Initialized successfully');
    } catch (error) {
      console.warn('[Mobile Performance Monitor] Initialization failed:', error);
      // Provide safe defaults even if monitoring fails
      this.metrics.isCrisisModeOptimal = false;
    }
  }

  getDeviceTier(): 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high' {
    return this.metrics.deviceTier;
  }
  
  private updateDeviceTier() {
    if (typeof typeof window !== 'undefined' && navigator === 'undefined') {
      this.metrics.deviceTier = 'medium';
      return;
    }
    
    const memory = (typeof window !== 'undefined' && navigator as any).deviceMemory || 2;
    const cores = typeof window !== 'undefined' && navigator.hardwareConcurrency || 2;
    const cpuScore = this.metrics.cpuScore;
    const memoryScore = this.metrics.memoryScore;
    const avgFrameRate = this.metrics.frameRate;
    
    // Comprehensive device tier calculation
    let score = 0;
    
    // Memory contribution (30%)
    if (memory >= 8) score += 30;
    else if (memory >= 4) score += 20;
    else if (memory >= 2) score += 10;
    else score += 5;
    
    // CPU cores contribution (25%)
    if (cores >= 8) score += 25;
    else if (cores >= 4) score += 20;
    else if (cores >= 2) score += 10;
    else score += 5;
    
    // Performance scores (25%)
    score += (cpuScore + memoryScore) / 2 * 0.25;
    
    // Frame rate contribution (20%)
    if (avgFrameRate >= 55) score += 20;
    else if (avgFrameRate >= 45) score += 15;
    else if (avgFrameRate >= 30) score += 10;
    else score += 5;
    
    // Determine tier based on total score
    if (score >= 85) this.metrics.deviceTier = 'ultra-high';
    else if (score >= 70) this.metrics.deviceTier = 'high';
    else if (score >= 50) this.metrics.deviceTier = 'medium';
    else if (score >= 30) this.metrics.deviceTier = 'low';
    else this.metrics.deviceTier = 'ultra-low';
    
    // Update crisis mode optimization status
    this.metrics.isCrisisModeOptimal = score >= 40 && !this.metrics.isOverheating;
  }

  isCrisisModeOptimal(): boolean {
    return this.metrics.isCrisisModeOptimal;
  }
  
  getCrisisOptimizations(): CrisisOptimizations {
    const tier = this.metrics.deviceTier;
    const batteryLow = this.metrics.batteryLevel < 20;
    const isOverheating = this.metrics.isOverheating;
    const slowNetwork = ['2g', '3g'].includes(this.metrics.networkSpeed);
    
    return {
      disableAnimations: tier === 'ultra-low' || batteryLow || isOverheating,
      reduceVisualEffects: ['ultra-low', 'low'].includes(tier) || batteryLow,
      prioritizeTouch: true, // Always prioritize for trauma-informed design
      enlargeTouchTargets: ['ultra-low', 'low'].includes(tier) || this.metrics.frameRate < 45,
      simplifyLayout: tier === 'ultra-low' || slowNetwork,
      conserveBattery: batteryLow || !this.metrics.isCharging
    };
  }

  private async initializeBatteryMonitoring() {
    try {
      // @ts-ignore - Battery API is experimental
      this.batteryAPI = await typeof window !== 'undefined' && navigator.getBattery?.();
      
      if (this.batteryAPI) {
        const updateBattery = () => {
          this.metrics.batteryLevel = this.batteryAPI.level * 100;
          this.metrics.isCharging = this.batteryAPI.charging;
          this.notifyUpdates();
        };
        
        this.batteryAPI.addEventListener('levelchange', updateBattery);
        this.batteryAPI.addEventListener('chargingchange', updateBattery);
        updateBattery();
      }
    } catch (error) {
      console.log('[Performance Monitor] Battery API not available');
    }
  }
  
  private initializeNetworkMonitoring() {
    try {
      // @ts-ignore - Connection API is experimental
      const connection = typeof window !== 'undefined' && navigator.connection || typeof window !== 'undefined' && navigator.mozConnection || typeof window !== 'undefined' && navigator.webkitConnection;
      
      if (connection) {
        const updateConnection = () => {
          const effectiveType = connection.effectiveType;
          this.metrics.networkSpeed = effectiveType || 'unknown';
          this.notifyUpdates();
        };
        
        connection.addEventListener('change', updateConnection);
        updateConnection();
      }
    } catch (error) {
      console.log('[Performance Monitor] Network API not available');
    }
  }
  
  private initializeFrameRateMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFrameRate = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        this.frameRateBuffer.push(fps);
        
        // Keep buffer at reasonable size
        if (this.frameRateBuffer.length > 10) {
          this.frameRateBuffer.shift();
        }
        
        // Calculate average frame rate
        this.metrics.frameRate = this.frameRateBuffer.reduce((sum, rate) => sum + rate, 0) / this.frameRateBuffer.length;
        
        frameCount = 0;
        lastTime = currentTime;
        this.notifyUpdates();
      }
      
      // Continue monitoring if performance is good
      if (!this.metrics.isOverheating) {
        requestAnimationFrame(measureFrameRate);
      }
    };
    
    requestAnimationFrame(measureFrameRate);
  }
  
  private initializeThermalMonitoring() {
    // Monitor for thermal throttling indicators
    const checkThermalState = () => {
      const wasOverheating = this.metrics.isOverheating;
      
      // Detect thermal issues through frame rate drops and CPU performance
      const avgFrameRate = this.metrics.frameRate;
      const significantFrameDrop = avgFrameRate < 30 && this.metrics.deviceTier !== 'ultra-low';
      
      this.metrics.isOverheating = significantFrameDrop;
      
      if (this.metrics.isOverheating !== wasOverheating) {
        this.notifyUpdates();
      }
    };
    
    setInterval(checkThermalState, 5000); // Check every 5 seconds
  }
  
  private initializeMemoryMonitoring() {
    try {
      // @ts-ignore - Memory API is experimental
      if ((performance as any).memory) {
        const updateMemoryScore = () => {
          const memory = (performance as any).memory;
          const usedPercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          
          // Score based on memory efficiency (lower usage = higher score)
          this.metrics.memoryScore = Math.max(0, 100 - usedPercent);
          this.notifyUpdates();
        };
        
        setInterval(updateMemoryScore, 10000); // Check every 10 seconds
        updateMemoryScore();
      }
    } catch (error) {
      console.log('[Performance Monitor] Memory API not available');
    }
  }

  private startContinuousMonitoring() {
    // Update device tier every 30 seconds
    setInterval(() => {
      this.updateDeviceTier();
    }, 30000);
  }
  
  private notifyUpdates() {
    this.updateCallbacks.forEach(callback => {
      try {
        callback(this.metrics);
      } catch (error) {
        console.error('[Performance Monitor] Callback error:', error);
      }
    });
  }
  
  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.updateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }
  
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  getMemoryInfo(): { total?: number; available?: number; score: number } {
    // Get comprehensive memory information
    const info: { total?: number; available?: number; score: number } = {
      score: this.metrics.memoryScore
    };
    
    if (typeof typeof window !== 'undefined' && navigator !== 'undefined' && (typeof window !== 'undefined' && navigator as any).deviceMemory) {
      info.total = (typeof window !== 'undefined' && navigator as any).deviceMemory * 1024; // Convert GB to MB
    }
    
    // @ts-ignore - Memory API is experimental
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      info.available = (memory.jsHeapSizeLimit - memory.usedJSHeapSize) / 1048576; // Convert to MB
    }
    
    return info;
  }
  
  // Crisis-safe performance recommendations
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const optimizations = this.getCrisisOptimizations();
    
    if (this.metrics.batteryLevel < 20) {
      recommendations.push('Low battery detected - enabling power saving mode');
    }
    
    if (this.metrics.isOverheating) {
      recommendations.push('Device overheating - reducing visual effects');
    }
    
    if (this.metrics.deviceTier === 'ultra-low') {
      recommendations.push('Optimizing for low-end device performance');
    }
    
    if (['2g', '3g'].includes(this.metrics.networkSpeed)) {
      recommendations.push('Slow network detected - prioritizing essential features');
    }
    
    if (this.metrics.frameRate < 30) {
      recommendations.push('Low frame rate - simplifying animations');
    }
    
    return recommendations;
  }
}

export const mobilePerformanceMonitor = new MobilePerformanceMonitor();

// Legacy API compatibility
export const mobilePerformanceMonitorCompat = {
  async initialize() {
    return mobilePerformanceMonitor.initialize();
  },

  getDeviceTier(): string {
    return mobilePerformanceMonitor.getDeviceTier();
  },

  isCrisisModeOptimal(): boolean {
    return mobilePerformanceMonitor.isCrisisModeOptimal();
  },

  getCPUTier(): string {
    const tier = mobilePerformanceMonitor.getDeviceTier();
    if (['ultra-high', 'high'].includes(tier)) return 'high';
    if (tier === 'medium') return 'medium';
    return 'low';
  },

  getMemoryInfo(): { total?: number; available?: number } {
    const info = mobilePerformanceMonitor.getMemoryInfo();
    return {
      total: info.total,
      available: info.available
    };
  }
};