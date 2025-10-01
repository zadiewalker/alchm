/**
 * ALCHM Mobile Crisis Performance Optimizer
 * 
 * Critical mobile optimizations for users accessing the app during emotional distress.
 * Every optimization here could be the difference between a user getting help or giving up.
 * 
 * Trauma-informed principles:
 * - 60fps animations even on 3-year-old devices
 * - <2s page load times on 3G networks  
 * - 52px+ touch targets for trembling hands
 * - High contrast support for dissociation
 * - Offline functionality for poor connections
 */

interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  hasSlowConnection: boolean;
  supportsWebGL: boolean;
  memoryGB: number;
  connectionType: string;
  devicePixelRatio: number;
  isInCrisis: boolean;
}

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  memoryUsage: number;
  batteryLevel?: number;
  isCharging?: boolean;
}

class MobileCrisisPerformanceOptimizer {
  private deviceCapabilities: DeviceCapabilities;
  private performanceMetrics: PerformanceMetrics;
  private optimizations: Map<string, boolean> = new Map();
  
  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.performanceMetrics = this.initializeMetrics();
    this.applyInitialOptimizations();
  }

  /**
   * Detect device capabilities for crisis-appropriate optimizations
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(typeof window !== 'undefined' && navigator.userAgent);
    const isLowEnd = this.detectLowEndDevice();
    const hasSlowConnection = this.detectSlowConnection();
    
    return {
      isMobile,
      isLowEnd,
      hasSlowConnection,
      supportsWebGL: this.detectWebGLSupport(),
      memoryGB: this.estimateDeviceMemory(),
      connectionType: this.getConnectionType(),
      devicePixelRatio: typeof window !== 'undefined' && window.devicePixelRatio || 1,
      isInCrisis: false // Will be updated by crisis detection
    };
  }

  /**
   * Detect low-end devices that need aggressive optimization
   */
  private detectLowEndDevice(): boolean {
    // Hardware concurrency check (CPU cores)
    if (typeof window !== 'undefined' && navigator.hardwareConcurrency && typeof window !== 'undefined' && navigator.hardwareConcurrency <= 2) {
      return true;
    }

    // Memory check
    if ((typeof window !== 'undefined' && navigator as any).deviceMemory && (typeof window !== 'undefined' && navigator as any).deviceMemory <= 2) {
      return true;
    }

    // User agent patterns for known low-end devices
    const lowEndPatterns = [
      /Android [4-6]\./,
      /iPhone OS [8-11]_/,
      /Chrome\/[4-7][0-9]\./
    ];

    return lowEndPatterns.some(pattern => pattern.test(typeof window !== 'undefined' && navigator.userAgent));
  }

  /**
   * Detect slow network connections
   */
  private detectSlowConnection(): boolean {
    const connection = (typeof window !== 'undefined' && navigator as any).connection;
    if (!connection) return false;

    return (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.effectiveType === '3g' ||
      connection.downlink < 1.5
    );
  }

  /**
   * Apply crisis-appropriate performance optimizations
   */
  private applyInitialOptimizations(): void {
    // Critical: Reduce animations for low-end devices
    if (this.deviceCapabilities.isLowEnd) {
      this.enableLowEndModeOptimizations();
    }

    // Critical: Optimize for slow connections
    if (this.deviceCapabilities.hasSlowConnection) {
      this.enableSlowConnectionOptimizations();
    }

    // Critical: Enhanced touch targets for mobile
    if (this.deviceCapabilities.isMobile) {
      this.enableMobileTouchOptimizations();
    }

    // Battery-conscious optimizations
    this.enableBatteryOptimizations();
  }

  /**
   * Enable optimizations for low-end devices
   */
  private enableLowEndModeOptimizations(): void {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-low-end-optimizations';
    style.textContent = `
      /* Reduce complex animations to 60fps on low-end devices */
      * {
        animation-duration: 0.2s !important;
        transition-duration: 0.15s !important;
      }
      
      /* Remove expensive effects */
      .backdrop-blur {
        backdrop-filter: none !important;
        background: rgba(164, 183, 146, 0.9) !important;
      }
      
      /* Simplify gradients */
      .bg-gradient-to-br {
        background: #a4b792 !important;
      }
      
      /* Reduce shadow complexity */
      .shadow-2xl,
      .shadow-xl,
      .shadow-lg {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }
      
      /* Hardware acceleration for critical elements */
      .crisis-support,
      .touch-target-crisis,
      .btn-crisis {
        transform: translateZ(0);
        will-change: transform;
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('lowEndMode', true);
  }

  /**
   * Enable optimizations for slow connections
   */
  private enableSlowConnectionOptimizations(): void {
    // Preload critical crisis resources
    this.preloadCrisisResources();
    
    // Lazy load non-critical images
    this.enableLazyImageLoading();
    
    // Defer non-critical scripts
    this.deferNonCriticalScripts();
    
    this.optimizations.set('slowConnection', true);
  }

  /**
   * Enable mobile touch optimizations
   */
  private enableMobileTouchOptimizations(): void {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-mobile-touch-optimizations';
    style.textContent = `
      /* Ensure all interactive elements meet 52px minimum for crisis situations */
      button,
      input,
      select,
      textarea,
      .touch-target,
      .crisis-button,
      a[role="button"] {
        min-height: 52px !important;
        min-width: 52px !important;
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(164, 183, 146, 0.3);
      }
      
      /* Crisis-specific touch targets */
      .crisis-support,
      .crisis-button,
      [href^="tel:"],
      [href^="sms:"] {
        min-height: 72px !important;
        min-width: 72px !important;
        padding: 18px !important;
      }
      
      /* Prevent zoom on iOS */
      input,
      textarea,
      select {
        font-size: 16px !important;
        -webkit-appearance: none;
      }
      
      /* One-handed operation support */
      .mobile-primary-action {
        position: fixed;
        bottom: max(20px, env(safe-area-inset-bottom));
        right: 20px;
        z-index: 50;
      }
      
      /* High contrast for crisis situations */
      @media (prefers-contrast: high) {
        .crisis-support,
        .crisis-button {
          border: 3px solid #ffffff !important;
          background: #dc2626 !important;
          color: #ffffff !important;
        }
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('mobileTouch', true);
  }

  /**
   * Enable battery-conscious optimizations
   */
  private enableBatteryOptimizations(): void {
    if ('getBattery' in typeof window !== 'undefined' && navigator) {
      (typeof window !== 'undefined' && navigator as any).getBattery().then((battery: any) => {
        if (battery.level < 0.2 && !battery.charging) {
          this.enableLowBatteryMode();
        }
        
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2 && !battery.charging) {
            this.enableLowBatteryMode();
          }
        });
      });
    }
  }

  /**
   * Enable low battery mode optimizations
   */
  private enableLowBatteryMode(): void {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-low-battery-mode';
    style.textContent = `
      /* Reduce animations to preserve battery */
      * {
        animation: none !important;
        transition: none !important;
      }
      
      /* Remove background animations */
      .animate-pulse,
      .animate-spin,
      .animate-bounce {
        animation: none !important;
      }
      
      /* Simplify backgrounds */
      .bg-gradient-to-br {
        background: #a4b792 !important;
      }
      
      /* Keep crisis button prominent */
      .crisis-support {
        background: #dc2626 !important;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4) !important;
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('lowBattery', true);
  }

  /**
   * Preload critical crisis resources
   */
  private preloadCrisisResources(): void {
    const criticalResources = [
      '/crisis-support',
      '/emergency',
      '/api/crisis-detection',
      '/_next/static/css/crisis-critical.css'
    ];

    criticalResources.forEach(resource => {
      const link = typeof window !== 'undefined' && document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      typeof window !== 'undefined' && document.head.appendChild(link);
    });
  }

  /**
   * Enable lazy loading for non-critical images
   */
  private enableLazyImageLoading(): void {
    if ('IntersectionObserver' in typeof window !== 'undefined' && window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src
      typeof window !== 'undefined' && document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  /**
   * Defer non-critical scripts
   */
  private deferNonCriticalScripts(): void {
    const nonCriticalScripts = typeof window !== 'undefined' && document.querySelectorAll('script[data-defer]');
    nonCriticalScripts.forEach(script => {
      script.setAttribute('defer', '');
    });
  }

  /**
   * Monitor performance metrics
   */
  public monitorPerformance(): void {
    // Web Vitals monitoring
    this.monitorWebVitals();
    
    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // Frame rate monitoring
    this.monitorFrameRate();
  }

  /**
   * Monitor Core Web Vitals for crisis-appropriate performance
   */
  private monitorWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.performanceMetrics.lcp = lastEntry.startTime;
      
      // Alert if LCP > 2.5s (poor for crisis situations)
      if (this.performanceMetrics.lcp > 2500) {
        this.enableEmergencyPerformanceMode();
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        this.performanceMetrics.fid = (entry as any).processingStart - entry.startTime;
        
        // Alert if FID > 100ms (poor for crisis interactions)
        if (this.performanceMetrics.fid > 100) {
          this.enableEmergencyPerformanceMode();
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          this.performanceMetrics.cls += (entry as any).value;
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Monitor memory usage
   */
  private monitorMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.performanceMetrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      
      // Alert if memory usage > 80%
      if (this.performanceMetrics.memoryUsage > 0.8) {
        this.enableMemoryOptimizations();
      }
    }
  }

  /**
   * Monitor frame rate for smooth animations
   */
  private monitorFrameRate(): void {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const checkFrameRate = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Alert if FPS < 30 (poor for crisis situations)
        if (fps < 30) {
          this.enableFrameRateOptimizations();
        }
      }
      
      requestAnimationFrame(checkFrameRate);
    };
    
    requestAnimationFrame(checkFrameRate);
  }

  /**
   * Enable emergency performance mode for critical situations
   */
  private enableEmergencyPerformanceMode(): void {
    if (this.optimizations.get('emergencyMode')) return;

    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-emergency-performance';
    style.textContent = `
      /* Emergency mode: Strip all non-essential visuals */
      * {
        animation: none !important;
        transition: none !important;
        transform: none !important;
      }
      
      /* Keep only essential styles */
      .crisis-support {
        background: #dc2626 !important;
        color: white !important;
        border: 2px solid white !important;
        border-radius: 50% !important;
      }
      
      /* High contrast for maximum visibility */
      body {
        background: #ffffff !important;
        color: #000000 !important;
      }
      
      /* Ensure crisis button is always visible */
      .crisis-support {
        z-index: 999999 !important;
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('emergencyMode', true);
  }

  /**
   * Enable memory optimizations
   */
  private enableMemoryOptimizations(): void {
    // Clear unused intervals and timeouts
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // Trigger garbage collection if available
    if ('gc' in typeof window !== 'undefined' && window) {
      (typeof window !== 'undefined' && window as any).gc();
    }

    this.optimizations.set('memoryOptimized', true);
  }

  /**
   * Enable frame rate optimizations
   */
  private enableFrameRateOptimizations(): void {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-framerate-optimizations';
    style.textContent = `
      /* Reduce animation complexity */
      * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      
      /* Use CSS transforms for better performance */
      .btn-hover:hover {
        transform: translateY(-1px) !important;
      }
      
      /* Disable expensive effects */
      .backdrop-blur {
        backdrop-filter: none !important;
      }
    `;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('frameRateOptimized', true);
  }

  /**
   * Update crisis state and apply appropriate optimizations
   */
  public updateCrisisState(isInCrisis: boolean, severity: 'mild' | 'moderate' | 'severe' | 'critical'): void {
    this.deviceCapabilities.isInCrisis = isInCrisis;
    
    if (isInCrisis) {
      // Apply crisis-specific optimizations
      this.applyCrisisOptimizations(severity);
    }
  }

  /**
   * Apply crisis-specific optimizations based on severity
   */
  private applyCrisisOptimizations(severity: string): void {
    const style = typeof window !== 'undefined' && document.createElement('style');
    style.id = 'alchm-crisis-optimizations';
    
    let crisisStyles = `
      /* Crisis mode: Prioritize accessibility and reliability */
      .crisis-support {
        width: 88px !important;
        height: 88px !important;
        bottom: max(48px, env(safe-area-inset-bottom, 48px)) !important;
        right: max(48px, env(safe-area-inset-right, 48px)) !important;
        background: #dc2626 !important;
        border: 4px solid #ffffff !important;
        box-shadow: 0 12px 40px rgba(220, 38, 38, 0.6) !important;
        z-index: 999999 !important;
      }
      
      /* High contrast text for crisis readability */
      .crisis-text {
        color: #000000 !important;
        background: #ffffff !important;
        border: 2px solid #000000 !important;
        padding: 8px !important;
        font-weight: bold !important;
      }
    `;

    if (severity === 'critical') {
      crisisStyles += `
        /* Critical mode: Maximum accessibility */
        body {
          filter: contrast(1.5) brightness(1.2);
        }
        
        .crisis-support {
          animation: critical-pulse 1s infinite;
        }
        
        @keyframes critical-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `;
    }

    style.textContent = crisisStyles;
    typeof window !== 'undefined' && document.head.appendChild(style);
    this.optimizations.set('crisisMode', true);
  }

  /**
   * Get current optimization status
   */
  public getOptimizationStatus(): {
    applied: string[];
    deviceCapabilities: DeviceCapabilities;
    performanceMetrics: PerformanceMetrics;
  } {
    return {
      applied: Array.from(this.optimizations.keys()).filter(key => this.optimizations.get(key)),
      deviceCapabilities: this.deviceCapabilities,
      performanceMetrics: this.performanceMetrics
    };
  }

  /**
   * Utility methods
   */
  private detectWebGLSupport(): boolean {
    try {
      const canvas = typeof window !== 'undefined' && document.createElement('canvas');
      return !!(typeof window !== 'undefined' && window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch {
      return false;
    }
  }

  private estimateDeviceMemory(): number {
    return (typeof window !== 'undefined' && navigator as any).deviceMemory || 4; // Default to 4GB if unknown
  }

  private getConnectionType(): string {
    const connection = (typeof window !== 'undefined' && navigator as any).connection;
    return connection ? connection.effectiveType : 'unknown';
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
      memoryUsage: 0
    };
  }
}

// Initialize global optimizer
const mobileCrisisOptimizer = new MobileCrisisPerformanceOptimizer();

// Start performance monitoring
mobileCrisisOptimizer.monitorPerformance();

export { MobileCrisisPerformanceOptimizer, mobileCrisisOptimizer };