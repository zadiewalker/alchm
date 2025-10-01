/**
 * EMERGENCY PERFORMANCE OPTIMIZER
 * Critical performance optimization for crisis users
 * Ensures life-critical features load within safety thresholds
 */

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  tbt: number; // Total Blocking Time
}

interface CrisisPerformanceThresholds {
  emergency: {
    lcp: 1200; // 1.2s for crisis users
    fid: 50;   // 50ms input delay max
    cls: 0.05; // Minimal layout shift
    tbt: 150;  // 150ms blocking time max
  };
  standard: {
    lcp: 2500;
    fid: 100;
    cls: 0.1;
    tbt: 300;
  };
}

class EmergencyPerformanceOptimizer {
  private isEmergencyMode = false;
  private performanceObserver: PerformanceObserver | null = null;
  private metrics: Partial<PerformanceMetrics> = {};
  private thresholds: CrisisPerformanceThresholds = {
    emergency: {
      lcp: 1200,
      fid: 50,
      cls: 0.05,
      tbt: 150
    },
    standard: {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      tbt: 300
    }
  };

  constructor() {
    this.initializePerformanceMonitoring();
    this.detectEmergencyMode();
  }

  /**
   * Initialize performance monitoring for crisis safety
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      // Monitor Core Web Vitals
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              this.metrics.lcp = entry.startTime;
              this.checkCrisisPerformance('lcp', entry.startTime);
              break;
            case 'first-input':
              this.metrics.fid = entry.processingStart - entry.startTime;
              this.checkCrisisPerformance('fid', this.metrics.fid);
              break;
            case 'layout-shift':
              if (!('cls' in this.metrics)) this.metrics.cls = 0;
              this.metrics.cls! += entry.value;
              this.checkCrisisPerformance('cls', this.metrics.cls!);
              break;
          }
        }
      });

      // Observe all Core Web Vitals
      this.performanceObserver.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });

      // Monitor Total Blocking Time
      this.monitorBlockingTime();

    } catch (error) {
      console.error('[Emergency Performance] Monitoring initialization failed:', error);
    }
  }

  /**
   * Detect if user needs emergency performance mode
   */
  private detectEmergencyMode(): void {
    // Check for crisis indicators in URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const emergencyMode = urlParams.get('emergency') === 'true' || 
                         localStorage.getItem('alchm_emergency_mode') === 'true';

    if (emergencyMode) {
      this.enableEmergencyMode();
    }

    // Check for slow device/network
    this.detectSlowConditions();
  }

  /**
   * Enable emergency performance mode for crisis users
   */
  public enableEmergencyMode(): void {
    console.log('🚨 EMERGENCY PERFORMANCE MODE ACTIVATED');
    this.isEmergencyMode = true;
    
    // Store emergency mode state
    localStorage.setItem('alchm_emergency_mode', 'true');
    
    // Apply emergency optimizations immediately
    this.applyEmergencyOptimizations();
    
    // Add visual indicator for development
    if (process.env.NODE_ENV === 'development') {
      this.addEmergencyModeIndicator();
    }
  }

  /**
   * Apply critical performance optimizations for crisis users
   */
  private applyEmergencyOptimizations(): void {
    // Disable non-critical animations
    this.disableNonCriticalAnimations();
    
    // Reduce image quality for faster loading
    this.optimizeImageLoading();
    
    // Preconnect to critical crisis resources
    this.preconnectCrisisServices();
    
    // Disable analytics and non-essential scripts
    this.disableNonEssentialServices();
    
    // Enable aggressive caching
    this.enableAggressiveCaching();
  }

  /**
   * Disable non-critical animations for crisis users
   */
  private disableNonCriticalAnimations(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency mode - disable non-critical animations */
      .emergency-disable-animation * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Keep critical animations for crisis buttons */
      .crisis-button,
      .emergency-crisis-button,
      [data-crisis-critical="true"] {
        animation-duration: revert !important;
        transition-duration: revert !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('emergency-disable-animation');
  }

  /**
   * Optimize image loading for emergency mode
   */
  private optimizeImageLoading(): void {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      // Reduce image quality for faster loading
      if (img.src && !img.src.includes('crisis') && !img.src.includes('emergency')) {
        const url = new URL(img.src);
        url.searchParams.set('quality', '60');
        url.searchParams.set('emergency', 'true');
        img.src = url.toString();
      }
    });
  }

  /**
   * Preconnect to critical crisis services
   */
  private preconnectCrisisServices(): void {
    const criticalServices = [
      'tel:988',
      'sms:741741',
      'tel:911'
    ];

    // Add DNS prefetch for crisis websites
    const crisisDomains = [
      'suicidepreventionlifeline.org',
      'crisistextline.org'
    ];

    crisisDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });
  }

  /**
   * Disable non-essential services in emergency mode
   */
  private disableNonEssentialServices(): void {
    // Disable analytics in emergency mode
    window.gtag = window.gtag || function() {
      console.log('[Emergency Mode] Analytics disabled');
    };

    // Disable non-critical third-party scripts
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src') || '';
      if (src.includes('google-analytics') || 
          src.includes('mixpanel') ||
          src.includes('segment') ||
          src.includes('hotjar')) {
        script.remove();
      }
    });
  }

  /**
   * Enable aggressive caching for crisis resources
   */
  private enableAggressiveCaching(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'ENABLE_EMERGENCY_CACHING',
          timestamp: Date.now()
        });
      });
    }
  }

  /**
   * Monitor Total Blocking Time
   */
  private monitorBlockingTime(): void {
    let totalBlockingTime = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) {
          totalBlockingTime += entry.duration - 50;
        }
      }
      
      this.metrics.tbt = totalBlockingTime;
      this.checkCrisisPerformance('tbt', totalBlockingTime);
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (error) {
      console.warn('[Emergency Performance] Long task monitoring not supported');
    }
  }

  /**
   * Check if performance meets crisis safety thresholds
   */
  private checkCrisisPerformance(metric: keyof PerformanceMetrics, value: number): void {
    const threshold = this.isEmergencyMode ? 
      this.thresholds.emergency[metric] : 
      this.thresholds.standard[metric];

    if (value > threshold) {
      console.warn(`⚠️ CRISIS PERFORMANCE WARNING: ${metric.toUpperCase()} ${value}ms exceeds threshold ${threshold}ms`);
      
      // Auto-enable emergency mode if performance is critically poor
      if (!this.isEmergencyMode && this.shouldActivateEmergencyMode(metric, value)) {
        this.enableEmergencyMode();
      }
    } else {
      console.log(`✅ Crisis performance OK: ${metric.toUpperCase()} ${value}ms (threshold: ${threshold}ms)`);
    }
  }

  /**
   * Determine if emergency mode should be activated based on performance
   */
  private shouldActivateEmergencyMode(metric: keyof PerformanceMetrics, value: number): boolean {
    // Activate emergency mode if any metric is 2x over standard threshold
    const standardThreshold = this.thresholds.standard[metric];
    return value > (standardThreshold * 2);
  }

  /**
   * Detect slow device/network conditions
   */
  private detectSlowConditions(): void {
    // Check device memory
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory <= 2) {
      console.log('🐌 Low memory device detected - enabling emergency optimizations');
      this.enableEmergencyMode();
      return;
    }

    // Check network connection
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        console.log('🐌 Slow network detected - enabling emergency optimizations');
        this.enableEmergencyMode();
        return;
      }
    }
  }

  /**
   * Add visual indicator for emergency mode (development only)
   */
  private addEmergencyModeIndicator(): void {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #dc2626;
      color: white;
      text-align: center;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: bold;
      z-index: 9999;
      pointer-events: none;
    `;
    indicator.textContent = '🚨 EMERGENCY PERFORMANCE MODE ACTIVE';
    document.body.appendChild(indicator);
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): {
    metrics: Partial<PerformanceMetrics>;
    isEmergencyMode: boolean;
    thresholds: CrisisPerformanceThresholds;
  } {
    return {
      metrics: { ...this.metrics },
      isEmergencyMode: this.isEmergencyMode,
      thresholds: this.thresholds
    };
  }

  /**
   * Force disable emergency mode
   */
  public disableEmergencyMode(): void {
    this.isEmergencyMode = false;
    localStorage.removeItem('alchm_emergency_mode');
    console.log('Emergency performance mode disabled');
  }

  /**
   * Check if crisis resources are loading fast enough
   */
  public async validateCrisisResourceSpeed(): Promise<{
    passed: boolean;
    resourceTimes: Record<string, number>;
    warnings: string[];
  }> {
    const results = {
      passed: true,
      resourceTimes: {} as Record<string, number>,
      warnings: [] as string[]
    };

    const criticalEndpoints = [
      '/api/crisis-detection',
      '/api/health/ping'
    ];

    for (const endpoint of criticalEndpoints) {
      const startTime = performance.now();
      
      try {
        await fetch(endpoint, { method: 'HEAD' });
        const responseTime = performance.now() - startTime;
        
        results.resourceTimes[endpoint] = responseTime;
        
        if (responseTime > 100) {
          results.passed = false;
          results.warnings.push(`${endpoint} took ${responseTime.toFixed(1)}ms (>100ms threshold)`);
        }
        
      } catch (error) {
        results.passed = false;
        results.warnings.push(`${endpoint} failed to load: ${error}`);
      }
    }

    return results;
  }
}

// Export singleton instance
export const emergencyPerformanceOptimizer = new EmergencyPerformanceOptimizer();

export default emergencyPerformanceOptimizer;