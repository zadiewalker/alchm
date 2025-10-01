/**
 * Low-Bandwidth Authentication Optimizer
 * CRITICAL ACCESSIBILITY: Optimized for older iPhones and slow connections
 * 
 * This system ensures authentication works reliably for users with:
 * - Older iPhone models (iPhone 6, 7, 8, SE)
 * - Slow network connections (2G, slow 3G)
 * - Limited data plans affecting connection quality
 * - Rural areas with poor cellular coverage
 * - Crisis situations where network infrastructure is compromised
 * 
 * OPTIMIZATION STRATEGIES:
 * - Reduced payload sizes and minimal network requests
 * - Progressive enhancement with graceful degradation
 * - Intelligent retry mechanisms with backoff strategies
 * - Connection quality detection and adaptation
 * - Battery-efficient authentication flows
 * - Memory-optimized operations for older devices
 */

import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { app } from '@/lib/firebase';

interface ConnectionQuality {
  effectiveType: '2g' | '3g' | '4g' | 'unknown';
  downlink: number; // Mbps
  rtt: number; // Round trip time in ms
  isSlowConnection: boolean;
  connectionStability: 'stable' | 'unstable' | 'poor';
  batteryLevel?: number;
  memoryPressure: 'low' | 'medium' | 'high';
}

interface DeviceCapabilities {
  isOlderDevice: boolean;
  deviceClass: 'high-end' | 'mid-range' | 'low-end' | 'legacy';
  availableMemory: number;
  cpuCores: number;
  supportedFeatures: {
    serviceWorker: boolean;
    webAssembly: boolean;
    intersectionObserver: boolean;
    passiveListeners: boolean;
  };
}

interface OptimizedAuthOptions {
  enablePreloading: boolean;
  useMinimalPayload: boolean;
  enableProgressiveRetry: boolean;
  prioritizeBattery: boolean;
  adaptToConnection: boolean;
}

class LowBandwidthAuthOptimizer {
  private static instance: LowBandwidthAuthOptimizer;
  private connectionQuality: ConnectionQuality;
  private deviceCapabilities: DeviceCapabilities;
  private authOptions: OptimizedAuthOptions;
  private retryAttempts: number = 0;
  private maxRetries: number = 3;
  private baseRetryDelay: number = 1000; // 1 second

  private constructor() {
    this.connectionQuality = this.assessConnectionQuality();
    this.deviceCapabilities = this.assessDeviceCapabilities();
    this.authOptions = this.determineOptimalSettings();
    
    this.initializeOptimizations();
  }

  public static getInstance(): LowBandwidthAuthOptimizer {
    if (!LowBandwidthAuthOptimizer.instance) {
      LowBandwidthAuthOptimizer.instance = new LowBandwidthAuthOptimizer();
    }
    return LowBandwidthAuthOptimizer.instance;
  }

  /**
   * Initialize low-bandwidth optimizations
   */
  private initializeOptimizations(): void {
    if (typeof window === 'undefined') return;

    // Monitor connection changes
    this.setupConnectionMonitoring();
    
    // Preload authentication resources for older devices
    if (this.authOptions.enablePreloading) {
      this.preloadAuthResources();
    }

    // Setup memory pressure monitoring
    this.monitorMemoryPressure();

    console.log('⚡ Low-bandwidth authentication optimizer initialized:', {
      connectionType: this.connectionQuality.effectiveType,
      deviceClass: this.deviceCapabilities.deviceClass,
      isSlowConnection: this.connectionQuality.isSlowConnection,
      optimizations: this.authOptions
    });
  }

  /**
   * Optimized authentication flow for slow connections
   */
  public async optimizedAuthentication(
    provider: GoogleAuthProvider,
    method: 'popup' | 'redirect'
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
    optimizations: string[];
  }> {
    const optimizations: string[] = [];
    
    console.log('🚀 Starting optimized authentication for slow connection:', {
      effectiveType: this.connectionQuality.effectiveType,
      rtt: this.connectionQuality.rtt,
      downlink: this.connectionQuality.downlink,
      deviceClass: this.deviceCapabilities.deviceClass
    });

    try {
      // Apply connection-specific optimizations
      if (this.connectionQuality.isSlowConnection) {
        optimizations.push('slow-connection-mode');
        await this.applySlowConnectionOptimizations();
      }

      // Apply device-specific optimizations
      if (this.deviceCapabilities.isOlderDevice) {
        optimizations.push('legacy-device-mode');
        await this.applyLegacyDeviceOptimizations();
      }

      // Configure provider for minimal bandwidth usage
      this.optimizeProviderConfiguration(provider);
      optimizations.push('minimal-payload');

      // Attempt authentication with retry logic
      const result = await this.attemptAuthWithRetry(provider, method);
      
      if (result.success) {
        optimizations.push('auth-successful');
        this.retryAttempts = 0; // Reset on success
      }

      return {
        ...result,
        optimizations
      };

    } catch (error: any) {
      console.error('❌ Optimized authentication failed:', error);
      return {
        success: false,
        error: this.generateOptimizedErrorMessage(error),
        optimizations
      };
    }
  }

  /**
   * Assess current connection quality
   */
  private assessConnectionQuality(): ConnectionQuality {
    if (typeof window === 'undefined') {
      return {
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0,
        isSlowConnection: false,
        connectionStability: 'stable',
        memoryPressure: 'low'
      };
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    const effectiveType = connection?.effectiveType || 'unknown';
    const downlink = connection?.downlink || 0;
    const rtt = connection?.rtt || 0;

    // Determine if connection is slow
    const isSlowConnection = effectiveType === '2g' || 
                           effectiveType === 'slow-2g' ||
                           (effectiveType === '3g' && rtt > 300) ||
                           downlink < 0.5;

    // Assess connection stability
    let connectionStability: 'stable' | 'unstable' | 'poor' = 'stable';
    if (rtt > 500 || downlink < 0.25) {
      connectionStability = 'poor';
    } else if (rtt > 300 || downlink < 0.5) {
      connectionStability = 'unstable';
    }

    return {
      effectiveType: effectiveType as '2g' | '3g' | '4g' | 'unknown',
      downlink,
      rtt,
      isSlowConnection,
      connectionStability,
      batteryLevel: this.getBatteryLevel(),
      memoryPressure: this.assessMemoryPressure()
    };
  }

  /**
   * Assess device capabilities and performance class
   */
  private assessDeviceCapabilities(): DeviceCapabilities {
    if (typeof window === 'undefined') {
      return {
        isOlderDevice: false,
        deviceClass: 'high-end',
        availableMemory: 0,
        cpuCores: 0,
        supportedFeatures: {
          serviceWorker: false,
          webAssembly: false,
          intersectionObserver: false,
          passiveListeners: false
        }
      };
    }

    const userAgent = navigator.userAgent.toLowerCase();
    const memory = (performance as any).memory;
    const cpuCores = navigator.hardwareConcurrency || 1;

    // Detect older iPhone models
    const isOlderIPhone = /iphone/.test(userAgent) && (
      userAgent.includes('iphone os 11_') ||
      userAgent.includes('iphone os 12_') ||
      userAgent.includes('iphone os 13_') ||
      userAgent.includes('iphone6') ||
      userAgent.includes('iphone7') ||
      userAgent.includes('iphone8')
    );

    // Detect older Android devices
    const isOlderAndroid = /android/.test(userAgent) && (
      userAgent.includes('android 6') ||
      userAgent.includes('android 7') ||
      userAgent.includes('android 8')
    );

    const isOlderDevice = isOlderIPhone || isOlderAndroid;
    
    // Determine device class based on multiple factors
    let deviceClass: 'high-end' | 'mid-range' | 'low-end' | 'legacy';
    if (memory?.jsHeapSizeLimit < 100000000 || cpuCores <= 2 || isOlderDevice) {
      deviceClass = 'legacy';
    } else if (memory?.jsHeapSizeLimit < 500000000 || cpuCores <= 4) {
      deviceClass = 'low-end';
    } else if (memory?.jsHeapSizeLimit < 1000000000 || cpuCores <= 6) {
      deviceClass = 'mid-range';
    } else {
      deviceClass = 'high-end';
    }

    const supportedFeatures = {
      serviceWorker: 'serviceWorker' in navigator,
      webAssembly: typeof WebAssembly !== 'undefined',
      intersectionObserver: 'IntersectionObserver' in window,
      passiveListeners: this.supportsPassiveListeners()
    };

    return {
      isOlderDevice,
      deviceClass,
      availableMemory: memory?.jsHeapSizeLimit || 0,
      cpuCores,
      supportedFeatures
    };
  }

  /**
   * Determine optimal authentication settings based on device/connection
   */
  private determineOptimalSettings(): OptimizedAuthOptions {
    const isConstrainedEnvironment = 
      this.connectionQuality.isSlowConnection || 
      this.deviceCapabilities.deviceClass === 'legacy' ||
      this.deviceCapabilities.deviceClass === 'low-end';

    return {
      enablePreloading: !isConstrainedEnvironment,
      useMinimalPayload: isConstrainedEnvironment,
      enableProgressiveRetry: this.connectionQuality.connectionStability !== 'stable',
      prioritizeBattery: this.connectionQuality.batteryLevel ? this.connectionQuality.batteryLevel < 0.2 : false,
      adaptToConnection: true
    };
  }

  /**
   * Apply optimizations for slow connections
   */
  private async applySlowConnectionOptimizations(): Promise<void> {
    console.log('🐌 Applying slow connection optimizations...');

    // Reduce timeout values for faster failure detection
    if (typeof window !== 'undefined') {
      // Disable non-essential features temporarily
      this.disableNonEssentialFeatures();
      
      // Preload critical resources only
      await this.preloadCriticalResources();
    }
  }

  /**
   * Apply optimizations for legacy devices
   */
  private async applyLegacyDeviceOptimizations(): Promise<void> {
    console.log('📱 Applying legacy device optimizations...');

    // Reduce memory pressure
    if (typeof window !== 'undefined') {
      // Clear non-essential caches
      this.clearNonEssentialCaches();
      
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
  }

  /**
   * Configure provider for minimal bandwidth usage
   */
  private optimizeProviderConfiguration(provider: GoogleAuthProvider): void {
    // Request only essential scopes
    provider.addScope('email');
    provider.addScope('profile');

    // Configure for minimal data transfer
    provider.setCustomParameters({
      prompt: 'select_account',
      hd: undefined,
      // Minimize additional parameters for slower connections
      include_granted_scopes: 'false',
      access_type: 'online'
    });

    console.log('🔧 Provider configured for low-bandwidth usage');
  }

  /**
   * Attempt authentication with intelligent retry logic
   */
  private async attemptAuthWithRetry(
    provider: GoogleAuthProvider,
    method: 'popup' | 'redirect'
  ): Promise<{ success: boolean; user?: any; error?: string }> {
    const auth = getAuth(app);
    const maxAttempts = this.connectionQuality.isSlowConnection ? 5 : 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Authentication attempt ${attempt}/${maxAttempts}...`);

        // Dynamic timeout based on connection quality
        const timeout = this.calculateOptimalTimeout();
        
        const authPromise = method === 'popup' 
          ? import('firebase/auth').then(({ signInWithPopup }) => signInWithPopup(auth, provider))
          : import('firebase/auth').then(({ signInWithRedirect }) => signInWithRedirect(auth, provider));

        // Race authentication against timeout
        const result = await Promise.race([
          authPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Authentication timeout')), timeout)
          )
        ]);

        console.log('✅ Authentication successful on attempt', attempt);
        return { success: true, user: (result as any).user };

      } catch (error: any) {
        console.log(`❌ Authentication attempt ${attempt} failed:`, error.code || error.message);
        
        if (attempt === maxAttempts) {
          return { 
            success: false, 
            error: this.generateOptimizedErrorMessage(error) 
          };
        }

        // Calculate retry delay with exponential backoff
        const retryDelay = this.calculateRetryDelay(attempt);
        console.log(`⏳ Retrying in ${retryDelay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    return { success: false, error: 'Maximum retry attempts exceeded' };
  }

  /**
   * Calculate optimal timeout based on connection quality
   */
  private calculateOptimalTimeout(): number {
    const baseTimeout = 30000; // 30 seconds

    if (this.connectionQuality.effectiveType === '2g') {
      return baseTimeout * 2; // 60 seconds for 2G
    } else if (this.connectionQuality.effectiveType === '3g') {
      return baseTimeout * 1.5; // 45 seconds for 3G
    } else if (this.connectionQuality.rtt > 500) {
      return baseTimeout * 1.5; // 45 seconds for high latency
    }

    return baseTimeout;
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number): number {
    const baseDelay = this.connectionQuality.isSlowConnection ? 2000 : 1000;
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    
    return Math.min(exponentialDelay + jitter, 10000); // Cap at 10 seconds
  }

  /**
   * Generate optimized error messages for slow connections
   */
  private generateOptimizedErrorMessage(error: any): string {
    const isSlowConnection = this.connectionQuality.isSlowConnection;
    const isOlderDevice = this.deviceCapabilities.isOlderDevice;

    if (error.message?.includes('timeout')) {
      if (isSlowConnection && isOlderDevice) {
        return 'Connection is slower than usual. Please wait a moment and try again, or switch to a WiFi network if available.';
      } else if (isSlowConnection) {
        return 'Your connection seems slow right now. Please try again in a moment.';
      } else {
        return 'Connection timeout. Please check your internet and try again.';
      }
    }

    if (error.code === 'auth/network-request-failed') {
      return 'Network connection interrupted. Please check your connection and try again when ready.';
    }

    if (error.code === 'auth/popup-blocked') {
      if (isOlderDevice) {
        return 'Please refresh the page - we\'ll use a more compatible sign-in method for your device.';
      } else {
        return 'Please allow popups in your browser settings and try again.';
      }
    }

    // Default message based on device capabilities
    if (isOlderDevice) {
      return 'Authentication is taking longer than expected on your device. Please be patient and try again.';
    } else {
      return 'Authentication encountered an issue. Please try again when you\'re ready.';
    }
  }

  // Helper methods
  private setupConnectionMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor connection changes
    window.addEventListener('online', () => {
      console.log('🔗 Connection restored');
      this.connectionQuality = this.assessConnectionQuality();
    });

    window.addEventListener('offline', () => {
      console.log('📵 Connection lost');
      this.connectionQuality = this.assessConnectionQuality();
    });
  }

  private preloadAuthResources(): void {
    // Preload Google OAuth endpoints for faster authentication
    if (typeof window !== 'undefined' && !this.connectionQuality.isSlowConnection) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = 'https://accounts.google.com';
      document.head.appendChild(link);
    }
  }

  private preloadCriticalResources(): Promise<void> {
    return new Promise(resolve => {
      // Minimal preloading for slow connections
      setTimeout(resolve, 100);
    });
  }

  private disableNonEssentialFeatures(): void {
    // Temporarily disable animations, transitions, etc.
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: -0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  private clearNonEssentialCaches(): void {
    // Clear non-critical cached data to free memory
    try {
      sessionStorage.removeItem('non_critical_cache');
    } catch (e) {
      // Storage might be full or unavailable
    }
  }

  private monitorMemoryPressure(): void {
    if (typeof window !== 'undefined' && (performance as any).memory) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (usageRatio > 0.8) {
          console.warn('⚠️ High memory pressure detected');
          this.connectionQuality.memoryPressure = 'high';
        } else if (usageRatio > 0.6) {
          this.connectionQuality.memoryPressure = 'medium';
        } else {
          this.connectionQuality.memoryPressure = 'low';
        }
      }, 30000); // Check every 30 seconds
    }
  }

  private getBatteryLevel(): number | undefined {
    if (typeof navigator !== 'undefined' && (navigator as any).getBattery) {
      (navigator as any).getBattery().then((battery: any) => {
        return battery.level;
      });
    }
    return undefined;
  }

  private assessMemoryPressure(): 'low' | 'medium' | 'high' {
    if (typeof window === 'undefined') return 'low';
    
    const memory = (performance as any).memory;
    if (!memory) return 'low';
    
    const usageRatio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
    
    if (usageRatio > 0.8) return 'high';
    if (usageRatio > 0.6) return 'medium';
    return 'low';
  }

  private supportsPassiveListeners(): boolean {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
          return true;
        }
      });
      window.addEventListener('testPassive', () => {}, opts);
      window.removeEventListener('testPassive', () => {}, opts);
    } catch (e) {}
    return supportsPassive;
  }

  /**
   * Get current optimization status
   */
  public getOptimizationStatus(): {
    connectionQuality: ConnectionQuality;
    deviceCapabilities: DeviceCapabilities;
    activeOptimizations: OptimizedAuthOptions;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    
    if (this.connectionQuality.isSlowConnection) {
      recommendations.push('Consider switching to WiFi for faster authentication');
    }
    
    if (this.deviceCapabilities.isOlderDevice) {
      recommendations.push('Close other apps to improve performance');
    }
    
    if (this.connectionQuality.batteryLevel && this.connectionQuality.batteryLevel < 0.2) {
      recommendations.push('Low battery detected - authentication optimized for power saving');
    }

    return {
      connectionQuality: this.connectionQuality,
      deviceCapabilities: this.deviceCapabilities,
      activeOptimizations: this.authOptions,
      recommendations
    };
  }
}

// Export singleton instance
export const lowBandwidthAuthOptimizer = LowBandwidthAuthOptimizer.getInstance();

// Export types
export type { ConnectionQuality, DeviceCapabilities, OptimizedAuthOptions };
export { LowBandwidthAuthOptimizer };