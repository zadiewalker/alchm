'use client';

import { useState, useEffect } from 'react';

/**
 * Mobile Performance Manager - Battery-Efficient Resource Management
 * Trauma-informed mobile optimization for users accessing ALCHM during crisis
 * 
 * Features:
 * - Battery level monitoring and adaptation
 * - Network condition detection
 * - Performance tier adjustment
 * - Memory usage optimization
 * - Touch response optimization
 */

interface DeviceCapabilities {
  batteryLevel: number;
  isCharging: boolean;
  networkType: string;
  memoryGB: number;
  cpuCores: number;
  devicePixelRatio: number;
  touchPoints: number;
}

interface PerformanceTier {
  name: 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';
  animations: boolean;
  transitionDuration: number;
  imageQuality: number;
  cacheLimit: number;
  backgroundSync: boolean;
}

class MobilePerformanceManager {
  private deviceCapabilities: DeviceCapabilities;
  private currentTier: PerformanceTier;
  private batteryManager: any = null;
  private networkInfo: any = null;
  private observers: Set<(tier: PerformanceTier) => void> = new Set();
  
  // Performance tiers optimized for trauma-informed experience
  private readonly PERFORMANCE_TIERS: Record<string, PerformanceTier> = {
    'ultra-low': {
      name: 'ultra-low',
      animations: false,
      transitionDuration: 0,
      imageQuality: 0.3,
      cacheLimit: 5 * 1024 * 1024, // 5MB
      backgroundSync: false
    },
    'low': {
      name: 'low',
      animations: false,
      transitionDuration: 100,
      imageQuality: 0.5,
      cacheLimit: 15 * 1024 * 1024, // 15MB
      backgroundSync: false
    },
    'medium': {
      name: 'medium',
      animations: true,
      transitionDuration: 200,
      imageQuality: 0.7,
      cacheLimit: 50 * 1024 * 1024, // 50MB
      backgroundSync: true
    },
    'high': {
      name: 'high',
      animations: true,
      transitionDuration: 300,
      imageQuality: 0.85,
      cacheLimit: 100 * 1024 * 1024, // 100MB
      backgroundSync: true
    },
    'ultra-high': {
      name: 'ultra-high',
      animations: true,
      transitionDuration: 500,
      imageQuality: 1.0,
      cacheLimit: 200 * 1024 * 1024, // 200MB
      backgroundSync: true
    }
  };

  constructor() {
    this.deviceCapabilities = {
      batteryLevel: 1,
      isCharging: true,
      networkType: '4g',
      memoryGB: 4,
      cpuCores: 4,
      devicePixelRatio: typeof window !== 'undefined' && window.devicePixelRatio || 1,
      touchPoints: typeof window !== 'undefined' && navigator.maxTouchPoints || 1
    };
    
    this.currentTier = this.PERFORMANCE_TIERS.medium;
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      await this.detectDeviceCapabilities();
      await this.setupBatteryMonitoring();
      this.setupNetworkMonitoring();
      this.setupMemoryMonitoring();
      this.setupTouchOptimization();
      this.calculateOptimalTier();
      
      // Monitor for changes
      this.startPerformanceMonitoring();
      
      console.log('[MobilePerf] Initialized with tier:', this.currentTier.name);
    } catch (error) {
      console.warn('[MobilePerf] Initialization failed, using safe defaults:', error);
      this.currentTier = this.PERFORMANCE_TIERS.low;
    }
  }

  private async detectDeviceCapabilities(): Promise<void> {
    // Detect memory (Chrome only)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.deviceCapabilities.memoryGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
    }
    
    // Detect CPU cores
    this.deviceCapabilities.cpuCores = typeof window !== 'undefined' && navigator.hardwareConcurrency || 4;
    
    // Detect touch capabilities
    this.deviceCapabilities.touchPoints = typeof window !== 'undefined' && navigator.maxTouchPoints || 1;
  }

  private async setupBatteryMonitoring(): Promise<void> {
    try {
      // @ts-ignore - Battery API is experimental
      this.batteryManager = await typeof window !== 'undefined' && navigator.getBattery?.();
      
      if (this.batteryManager) {
        this.deviceCapabilities.batteryLevel = this.batteryManager.level;
        this.deviceCapabilities.isCharging = this.batteryManager.charging;
        
        this.batteryManager.addEventListener('levelchange', () => {
          this.deviceCapabilities.batteryLevel = this.batteryManager.level;
          this.onDeviceStateChange();
        });
        
        this.batteryManager.addEventListener('chargingchange', () => {
          this.deviceCapabilities.isCharging = this.batteryManager.charging;
          this.onDeviceStateChange();
        });
      }
    } catch (error) {
      console.log('[MobilePerf] Battery API not available:', error);
    }
  }

  private setupNetworkMonitoring(): void {
    // @ts-ignore - Connection API is experimental
    this.networkInfo = typeof window !== 'undefined' && navigator.connection || typeof window !== 'undefined' && navigator.mozConnection || typeof window !== 'undefined' && navigator.webkitConnection;
    
    if (this.networkInfo) {
      this.deviceCapabilities.networkType = this.networkInfo.effectiveType || '4g';
      
      this.networkInfo.addEventListener?.('change', () => {
        this.deviceCapabilities.networkType = this.networkInfo.effectiveType || '4g';
        this.onDeviceStateChange();
      });
    }
  }

  private setupMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemoryMB = memory.usedJSHeapSize / (1024 * 1024);
        const limitMemoryMB = memory.jsHeapSizeLimit / (1024 * 1024);
        
        // If using over 80% of available memory, reduce performance tier
        if (usedMemoryMB / limitMemoryMB > 0.8) {
          this.emergencyPerformanceReduction();
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private setupTouchOptimization(): void {
    const isMobile = this.deviceCapabilities.touchPoints > 0;
    if (isMobile) {
      // Apply mobile-specific optimizations
      typeof window !== 'undefined' && document.body.classList.add('mobile-device');
      
      // Optimize touch delay for crisis situations
      typeof window !== 'undefined' && document.addEventListener('touchstart', this.optimizeTouchResponse, { passive: true });
    }
  }

  private optimizeTouchResponse = (event: TouchEvent): void => {
    // Priority touch handling for crisis elements
    const target = event.target as Element;
    if (target?.closest('.crisis-accessible, .touch-target-large')) {
      // Immediate haptic feedback for crisis interactions
      if ('vibrate' in typeof window !== 'undefined' && navigator) {
        typeof window !== 'undefined' && navigator.vibrate([10, 5, 10]);
      }
    }
  };

  private calculateOptimalTier(): void {
    let score = 100; // Start with maximum performance
    
    // Battery level impact (critical for extended journaling sessions)
    if (!this.deviceCapabilities.isCharging) {
      if (this.deviceCapabilities.batteryLevel < 0.2) {
        score -= 60; // Very low battery - major performance reduction
      } else if (this.deviceCapabilities.batteryLevel < 0.4) {
        score -= 30; // Low battery - moderate reduction
      } else if (this.deviceCapabilities.batteryLevel < 0.6) {
        score -= 15; // Medium battery - slight reduction
      }
    }
    
    // Network speed impact
    const networkSpeedImpact = {
      'slow-2g': -50,
      '2g': -40,
      '3g': -20,
      '4g': 0,
      '5g': 10
    };
    score += networkSpeedImpact[this.deviceCapabilities.networkType] || 0;
    
    // Memory impact
    if (this.deviceCapabilities.memoryGB < 2) {
      score -= 40; // Very low memory
    } else if (this.deviceCapabilities.memoryGB < 4) {
      score -= 20; // Low memory
    } else if (this.deviceCapabilities.memoryGB > 8) {
      score += 10; // High memory
    }
    
    // CPU impact
    if (this.deviceCapabilities.cpuCores < 4) {
      score -= 20;
    } else if (this.deviceCapabilities.cpuCores > 8) {
      score += 15;
    }
    
    // Determine tier based on score
    let newTier: PerformanceTier;
    if (score < 20) {
      newTier = this.PERFORMANCE_TIERS['ultra-low'];
    } else if (score < 40) {
      newTier = this.PERFORMANCE_TIERS.low;
    } else if (score < 70) {
      newTier = this.PERFORMANCE_TIERS.medium;
    } else if (score < 90) {
      newTier = this.PERFORMANCE_TIERS.high;
    } else {
      newTier = this.PERFORMANCE_TIERS['ultra-high'];
    }
    
    if (newTier.name !== this.currentTier.name) {
      this.updatePerformanceTier(newTier);
    }
  }

  private updatePerformanceTier(newTier: PerformanceTier): void {
    const previousTier = this.currentTier;
    this.currentTier = newTier;
    
    console.log(`[MobilePerf] Performance tier updated: ${previousTier.name} → ${newTier.name}`);
    
    // Apply tier-specific optimizations
    this.applyTierOptimizations();
    
    // Notify observers
    this.observers.forEach(callback => {
      try {
        callback(newTier);
      } catch (error) {
        console.error('[MobilePerf] Observer callback failed:', error);
      }
    });
  }

  private applyTierOptimizations(): void {
    const { animations, transitionDuration } = this.currentTier;
    
    // Update CSS custom properties
    typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.style.setProperty('--mobile-animations', animations ? '1' : '0');
    typeof window !== 'undefined' && document.typeof window !== 'undefined' && documentElement.style.setProperty('--mobile-transition-duration', `${transitionDuration}ms`);
    
    // Apply body classes for CSS targeting
    typeof window !== 'undefined' && document.body.className = typeof window !== 'undefined' && document.body.className.replace(/perf-tier-\w+/g, '');
    typeof window !== 'undefined' && document.body.classList.add(`perf-tier-${this.currentTier.name}`);
    
    // Battery-specific optimizations
    if (!this.deviceCapabilities.isCharging && this.deviceCapabilities.batteryLevel < 0.3) {
      typeof window !== 'undefined' && document.body.classList.add('battery-saver-mode');
      
      // Disable expensive operations
      this.disableExpensiveFeatures();
    } else {
      typeof window !== 'undefined' && document.body.classList.remove('battery-saver-mode');
    }
  }

  private disableExpensiveFeatures(): void {
    // Disable unnecessary background processes
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      typeof window !== 'undefined' && navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'BATTERY_SAVER_MODE',
          enabled: true
        });
      });
    }
    
    // Reduce animation frame rates
    const animatedElements = typeof window !== 'undefined' && document.querySelectorAll('[class*="animate-"]');
    animatedElements.forEach(element => {
      element.classList.add('battery-efficient');
    });
  }

  private emergencyPerformanceReduction(): void {
    console.warn('[MobilePerf] Emergency performance reduction activated');
    this.updatePerformanceTier(this.PERFORMANCE_TIERS['ultra-low']);
    
    // Force garbage collection if available
    if ('gc' in typeof window !== 'undefined' && window) {
      (typeof window !== 'undefined' && window as any).gc();
    }
  }

  private onDeviceStateChange(): void {
    // Debounce rapid changes
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.calculateOptimalTier();
    }, 1000);
  }

  private debounceTimeout: NodeJS.Timeout | null = null;

  private startPerformanceMonitoring(): void {
    // Monitor performance every 60 seconds
    setInterval(() => {
      this.monitorPerformanceMetrics();
    }, 60000);
  }

  private monitorPerformanceMetrics(): void {
    // Core Web Vitals monitoring
    const paintEntries = performance.getEntriesByType('paint');
    const navigationEntries = performance.getEntriesByType('navigation');
    
    if (navigationEntries.length > 0) {
      const navigation = navigationEntries[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      
      // If load time is consistently high, reduce performance tier
      if (loadTime > 3000) {
        console.warn('[MobilePerf] High load times detected, reducing performance');
        const lowerTierMap = {
          'ultra-high': 'high',
          'high': 'medium',
          'medium': 'low',
          'low': 'ultra-low',
          'ultra-low': 'ultra-low'
        };
        const lowerTier = lowerTierMap[this.currentTier.name];
        if (lowerTier) {
          this.updatePerformanceTier(this.PERFORMANCE_TIERS[lowerTier]);
        }
      }
    }
  }

  // Public API
  public getCurrentTier(): PerformanceTier {
    return { ...this.currentTier };
  }

  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }

  public subscribe(callback: (tier: PerformanceTier) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  public forcePerformanceTier(tierName: keyof typeof this.PERFORMANCE_TIERS): void {
    if (this.PERFORMANCE_TIERS[tierName]) {
      this.updatePerformanceTier(this.PERFORMANCE_TIERS[tierName]);
    }
  }

  public emergencyMode(): void {
    console.log('[MobilePerf] Emergency mode activated - maximum accessibility');
    typeof window !== 'undefined' && document.body.classList.add('emergency-mode');
    this.updatePerformanceTier(this.PERFORMANCE_TIERS['ultra-low']);
    
    // Disable all non-essential features
    const nonEssential = typeof window !== 'undefined' && document.querySelectorAll('.non-essential, [data-non-essential]');
    nonEssential.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });
  }

  public enableCrisisMode(): void {
    console.log('[MobilePerf] Crisis mode activated - trauma-informed optimizations');
    typeof window !== 'undefined' && document.body.classList.add('crisis-mode');
    
    // Ensure crisis elements have maximum touch targets
    const crisisElements = typeof window !== 'undefined' && document.querySelectorAll('.crisis-accessible, .emergency-contact');
    crisisElements.forEach(element => {
      element.classList.add('touch-target-large', 'high-contrast');
    });
    
    // Prioritize crisis-related network requests
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      typeof window !== 'undefined' && navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'CRISIS_MODE_ACTIVATED',
          prioritize: ['crisis-resources', 'emergency-contacts', 'support-lines']
        });
      });
    }
  }

  public disableCrisisMode(): void {
    typeof window !== 'undefined' && document.body.classList.remove('crisis-mode', 'emergency-mode');
  }

  // Utility methods for components
  public shouldUseHighQualityImages(): boolean {
    return this.currentTier.imageQuality > 0.7;
  }

  public shouldEnableAnimations(): boolean {
    return this.currentTier.animations;
  }

  public getOptimalTransitionDuration(): number {
    return this.currentTier.transitionDuration;
  }

  public getCacheLimit(): number {
    return this.currentTier.cacheLimit;
  }
}

// Singleton instance
export const mobilePerformanceManager = new MobilePerformanceManager();

// React hook for performance tier awareness
export function usePerformanceTier() {
  const [tier, setTier] = useState(mobilePerformanceManager.getCurrentTier());
  
  useEffect(() => {
    const unsubscribe = mobilePerformanceManager.subscribe(setTier);
    return unsubscribe;
  }, []);
  
  return {
    tier,
    deviceCapabilities: mobilePerformanceManager.getDeviceCapabilities(),
    shouldUseAnimations: mobilePerformanceManager.shouldEnableAnimations(),
    shouldUseHighQualityImages: mobilePerformanceManager.shouldUseHighQualityImages(),
    transitionDuration: mobilePerformanceManager.getOptimalTransitionDuration(),
    enableCrisisMode: mobilePerformanceManager.enableCrisisMode.bind(mobilePerformanceManager),
    emergencyMode: mobilePerformanceManager.emergencyMode.bind(mobilePerformanceManager)
  };
}

export default mobilePerformanceManager;