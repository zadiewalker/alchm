/**
 * ALCHM Mobile Performance Optimizer
 * 
 * Specialized optimizations for mobile devices, with focus on 
 * trauma-informed design for users in crisis on mobile devices.
 */

interface MobileDeviceInfo {
  type: 'smartphone' | 'tablet' | 'feature_phone' | 'unknown';
  screenSize: { width: number; height: number };
  deviceMemory?: number;
  hardwareConcurrency?: number;
  connectionType?: string;
  effectiveType?: string;
  isLowEndDevice: boolean;
  batteryLevel?: number;
  isCharging?: boolean;
  supportsTouchEvents: boolean;
  pixelRatio: number;
}

interface MobileOptimization {
  id: string;
  name: string;
  description: string;
  condition: (device: MobileDeviceInfo) => boolean;
  optimization: () => Promise<void> | void;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isCrisisRelated: boolean;
  estimatedImpact: number; // Performance improvement percentage
}

interface TouchOptimization {
  minTouchTargetSize: number;
  touchPadding: number;
  gestureRecognition: boolean;
  hapticFeedback: boolean;
  emergencyGestures: boolean;
}

interface NetworkOptimization {
  enableImageCompression: boolean;
  enableDataSaver: boolean;
  prefetchStrategy: 'aggressive' | 'conservative' | 'crisis_only';
  cacheStrategy: 'aggressive' | 'standard' | 'minimal';
}

interface BatteryOptimization {
  reduceAnimations: boolean;
  darkModeForBattery: boolean;
  backgroundProcessing: boolean;
  pushNotificationStrategy: 'immediate' | 'batched' | 'urgent_only';
}

interface MobilePerformanceMetrics {
  touchResponseTime: number;
  scrollFrameRate: number;
  memoryPressure: number;
  batteryDrain: number;
  networkLatency: number;
  offlineCapability: boolean;
  emergencyModeActivations: number;
  crisisButtonResponseTime: number;
}

class MobilePerformanceOptimizer {
  private deviceInfo: MobileDeviceInfo;
  private optimizations: MobileOptimization[] = [];
  private touchOptimization: TouchOptimization;
  private networkOptimization: NetworkOptimization;
  private batteryOptimization: BatteryOptimization;
  private isOptimized = false;
  private performanceMetrics: MobilePerformanceMetrics = {
    touchResponseTime: 0,
    scrollFrameRate: 60,
    memoryPressure: 0,
    batteryDrain: 0,
    networkLatency: 0,
    offlineCapability: false,
    emergencyModeActivations: 0,
    crisisButtonResponseTime: 0
  };
  private observers: any[] = [];

  constructor() {
    this.deviceInfo = this.detectMobileDevice();
    this.initializeOptimizations();
    this.startPerformanceMonitoring();
    
    if (this.isMobileDevice()) {
      this.applyOptimizations();
    }
  }

  private detectMobileDevice(): MobileDeviceInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let deviceType: MobileDeviceInfo['type'] = 'unknown';
    if (userAgent.includes('mobile')) {
      deviceType = 'smartphone';
    } else if (userAgent.includes('tablet') || userAgent.includes('ipad')) {
      deviceType = 'tablet';
    } else if (isTouch) {
      deviceType = 'smartphone'; // Assume smartphone for touch devices
    }

    const screenSize = {
      width: window.screen.width,
      height: window.screen.height
    };

    // Detect low-end device based on various factors
    const deviceMemory = (navigator as any).deviceMemory || 2; // Default to 2GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const connection = (navigator as any).connection;
    
    const isLowEndDevice = 
      deviceMemory <= 2 || 
      hardwareConcurrency <= 2 || 
      screenSize.width <= 480 ||
      (connection && ['slow-2g', '2g'].includes(connection.effectiveType));

    const deviceInfo: MobileDeviceInfo = {
      type: deviceType,
      screenSize,
      deviceMemory,
      hardwareConcurrency,
      connectionType: connection?.type,
      effectiveType: connection?.effectiveType,
      isLowEndDevice,
      supportsTouchEvents: isTouch,
      pixelRatio: window.devicePixelRatio || 1
    };

    // Get battery information if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        deviceInfo.batteryLevel = battery.level;
        deviceInfo.isCharging = battery.charging;
        
        // Monitor battery changes
        battery.addEventListener('levelchange', () => {
          deviceInfo.batteryLevel = battery.level;
          this.adjustOptimizationsForBattery();
        });
        
        battery.addEventListener('chargingchange', () => {
          deviceInfo.isCharging = battery.charging;
          this.adjustOptimizationsForBattery();
        });
      });
    }

    console.log('[MOBILE OPTIMIZER] Device detected:', deviceInfo);
    return deviceInfo;
  }

  private initializeOptimizations(): void {
    // Crisis-critical mobile optimizations
    this.optimizations.push({
      id: 'crisis_touch_optimization',
      name: 'Crisis Button Touch Optimization',
      description: 'Optimize touch targets for emergency buttons',
      condition: (device) => device.supportsTouchEvents,
      optimization: () => this.optimizeCrisisTouchTargets(),
      priority: 'critical',
      isCrisisRelated: true,
      estimatedImpact: 40
    });

    this.optimizations.push({
      id: 'low_end_device_mode',
      name: 'Low-End Device Optimization',
      description: 'Reduce resource usage for low-end devices',
      condition: (device) => device.isLowEndDevice,
      optimization: () => this.enableLowEndDeviceMode(),
      priority: 'critical',
      isCrisisRelated: false,
      estimatedImpact: 60
    });

    this.optimizations.push({
      id: 'offline_crisis_mode',
      name: 'Offline Crisis Support',
      description: 'Enable offline access to crisis resources',
      condition: () => true,
      optimization: () => this.enableOfflineCrisisMode(),
      priority: 'critical',
      isCrisisRelated: true,
      estimatedImpact: 100 // Critical for offline access
    });

    // Network-specific optimizations
    this.optimizations.push({
      id: 'slow_network_optimization',
      name: 'Slow Network Optimization',
      description: 'Optimize for 2G/3G connections',
      condition: (device) => ['slow-2g', '2g', '3g'].includes(device.effectiveType || ''),
      optimization: () => this.optimizeForSlowNetwork(),
      priority: 'high',
      isCrisisRelated: false,
      estimatedImpact: 50
    });

    this.optimizations.push({
      id: 'image_lazy_loading',
      name: 'Mobile Image Lazy Loading',
      description: 'Implement aggressive image lazy loading for mobile',
      condition: (device) => device.type === 'smartphone',
      optimization: () => this.enableMobileImageOptimization(),
      priority: 'high',
      isCrisisRelated: false,
      estimatedImpact: 30
    });

    // Battery optimizations
    this.optimizations.push({
      id: 'battery_saver_mode',
      name: 'Battery Saver Mode',
      description: 'Reduce animations and background activity when battery is low',
      condition: (device) => (device.batteryLevel || 1) < 0.2,
      optimization: () => this.enableBatterySaverMode(),
      priority: 'medium',
      isCrisisRelated: false,
      estimatedImpact: 25
    });

    // Performance optimizations
    this.optimizations.push({
      id: 'scroll_performance',
      name: 'Scroll Performance Optimization',
      description: 'Optimize scrolling performance on mobile',
      condition: (device) => device.supportsTouchEvents,
      optimization: () => this.optimizeScrollPerformance(),
      priority: 'medium',
      isCrisisRelated: false,
      estimatedImpact: 20
    });

    this.optimizations.push({
      id: 'memory_management',
      name: 'Mobile Memory Management',
      description: 'Aggressive memory management for mobile devices',
      condition: (device) => device.deviceMemory ? device.deviceMemory <= 4 : true,
      optimization: () => this.enableMemoryManagement(),
      priority: 'high',
      isCrisisRelated: false,
      estimatedImpact: 35
    });

    // Initialize optimization configs
    this.touchOptimization = {
      minTouchTargetSize: 44, // Apple/Google recommendation
      touchPadding: 8,
      gestureRecognition: true,
      hapticFeedback: this.deviceInfo.supportsTouchEvents,
      emergencyGestures: true
    };

    this.networkOptimization = {
      enableImageCompression: true,
      enableDataSaver: this.deviceInfo.effectiveType === 'slow-2g' || this.deviceInfo.effectiveType === '2g',
      prefetchStrategy: this.deviceInfo.isLowEndDevice ? 'crisis_only' : 'conservative',
      cacheStrategy: this.deviceInfo.isLowEndDevice ? 'minimal' : 'standard'
    };

    this.batteryOptimization = {
      reduceAnimations: (this.deviceInfo.batteryLevel || 1) < 0.3,
      darkModeForBattery: (this.deviceInfo.batteryLevel || 1) < 0.2,
      backgroundProcessing: (this.deviceInfo.batteryLevel || 1) > 0.3,
      pushNotificationStrategy: (this.deviceInfo.batteryLevel || 1) < 0.2 ? 'urgent_only' : 'immediate'
    };
  }

  private async applyOptimizations(): Promise<void> {
    if (this.isOptimized) return;

    console.log('[MOBILE OPTIMIZER] Applying mobile optimizations');

    // Apply optimizations in priority order
    const sortedOptimizations = this.optimizations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    for (const optimization of sortedOptimizations) {
      if (optimization.condition(this.deviceInfo)) {
        try {
          await optimization.optimization();
          console.log(`[MOBILE OPTIMIZER] Applied: ${optimization.name}`);
        } catch (error) {
          console.error(`[MOBILE OPTIMIZER] Failed to apply ${optimization.name}:`, error);
        }
      }
    }

    this.isOptimized = true;
    this.logOptimizationSummary();
  }

  private optimizeCrisisTouchTargets(): void {
    const crisisButtons = document.querySelectorAll('[data-crisis-action], .crisis-button, .emergency-button');
    
    crisisButtons.forEach((button) => {
      const element = button as HTMLElement;
      
      // Ensure minimum touch target size
      const currentWidth = element.offsetWidth;
      const currentHeight = element.offsetHeight;
      
      if (currentWidth < this.touchOptimization.minTouchTargetSize) {
        element.style.minWidth = `${this.touchOptimization.minTouchTargetSize}px`;
        element.style.padding = `${this.touchOptimization.touchPadding}px`;
      }
      
      if (currentHeight < this.touchOptimization.minTouchTargetSize) {
        element.style.minHeight = `${this.touchOptimization.minTouchTargetSize}px`;
        element.style.padding = `${this.touchOptimization.touchPadding}px`;
      }

      // Add haptic feedback for crisis buttons
      if (this.touchOptimization.hapticFeedback && 'vibrate' in navigator) {
        element.addEventListener('touchstart', () => {
          navigator.vibrate([50]); // Short vibration for feedback
        }, { passive: true });
      }

      // Improve touch responsiveness
      element.style.touchAction = 'manipulation';
      element.style.userSelect = 'none';
    });
  }

  private enableLowEndDeviceMode(): void {
    console.log('[MOBILE OPTIMIZER] Enabling low-end device mode');

    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
      .low-end-device * {
        animation-duration: 0.01ms !important;
        animation-delay: -0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('low-end-device');

    // Reduce image quality
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    images.forEach((img) => {
      if (img.src && !img.src.includes('crisis')) {
        const url = new URL(img.src, window.location.origin);
        url.searchParams.set('quality', '60');
        img.src = url.toString();
      }
    });

    // Disable unnecessary features
    this.disableNonEssentialFeatures();
  }

  private enableOfflineCrisisMode(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/crisis-sw.js')
        .then((registration) => {
          console.log('[MOBILE OPTIMIZER] Crisis service worker registered');
          
          // Cache critical crisis resources
          this.cacheCrisisResources();
        })
        .catch((error) => {
          console.error('[MOBILE OPTIMIZER] Crisis service worker registration failed:', error);
        });
    }

    // Store critical crisis information locally
    this.storeCrisisResourcesLocally();
    
    this.performanceMetrics.offlineCapability = true;
  }

  private cacheCrisisResources(): void {
    const criticalUrls = [
      '/crisis-resources',
      '/emergency',
      '/support',
      '/api/crisis-hotlines'
    ];

    if ('caches' in window) {
      caches.open('crisis-cache-v1').then((cache) => {
        cache.addAll(criticalUrls).catch((error) => {
          console.error('[MOBILE OPTIMIZER] Failed to cache crisis resources:', error);
        });
      });
    }
  }

  private storeCrisisResourcesLocally(): void {
    const crisisData = {
      hotlines: [
        { name: 'National Suicide Prevention Lifeline', number: '988', available24: true },
        { name: 'Crisis Text Line', number: '741741', text: true, available24: true },
        { name: 'National Domestic Violence Hotline', number: '1-800-799-7233', available24: true }
      ],
      techniques: [
        { name: 'Box Breathing', description: 'Inhale 4, hold 4, exhale 4, hold 4' },
        { name: '5-4-3-2-1 Grounding', description: '5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste' }
      ],
      timestamp: Date.now()
    };

    try {
      localStorage.setItem('alchm_crisis_resources', JSON.stringify(crisisData));
    } catch (error) {
      console.error('[MOBILE OPTIMIZER] Failed to store crisis resources:', error);
    }
  }

  private optimizeForSlowNetwork(): void {
    console.log('[MOBILE OPTIMIZER] Optimizing for slow network');

    // Enable data saver mode
    this.networkOptimization.enableDataSaver = true;

    // Reduce image quality more aggressively
    const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
    images.forEach((img) => {
      if (img.src && !img.src.includes('crisis')) {
        const url = new URL(img.src, window.location.origin);
        url.searchParams.set('quality', '40');
        url.searchParams.set('format', 'webp');
        img.src = url.toString();
      }
    });

    // Defer non-critical resources
    this.deferNonCriticalResources();

    // Enable aggressive caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.active?.postMessage({
          type: 'ENABLE_AGGRESSIVE_CACHING'
        });
      });
    }
  }

  private enableMobileImageOptimization(): void {
    // Implement intersection observer for lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Apply to all non-crisis images
    const images = document.querySelectorAll('img:not([data-crisis])') as NodeListOf<HTMLImageElement>;
    images.forEach((img) => {
      if (!img.src.includes('crisis') && !img.complete) {
        img.dataset.src = img.src;
        img.src = this.generatePlaceholder(img.width || 200, img.height || 150);
        img.classList.add('lazy');
        imageObserver.observe(img);
      }
    });

    this.observers.push(imageObserver);
  }

  private enableBatterySaverMode(): void {
    console.log('[MOBILE OPTIMIZER] Enabling battery saver mode');

    this.batteryOptimization.reduceAnimations = true;
    this.batteryOptimization.backgroundProcessing = false;

    // Apply battery-saving styles
    const style = document.createElement('style');
    style.textContent = `
      .battery-saver * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
      .battery-saver [data-animate] {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('battery-saver');

    // Reduce screen brightness if supported
    if ('screen' in navigator && 'brightness' in (navigator.screen as any)) {
      try {
        (navigator.screen as any).brightness = 0.7;
      } catch (error) {
        // Brightness control not supported
      }
    }

    // Enable dark mode for battery saving
    if (this.batteryOptimization.darkModeForBattery) {
      document.body.classList.add('dark-mode-battery');
    }
  }

  private optimizeScrollPerformance(): void {
    // Enable passive scroll listeners
    let ticking = false;
    
    const optimizeScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Optimize scroll performance
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizeScroll, { passive: true });

    // Enable will-change for scroll containers
    const scrollContainers = document.querySelectorAll('[data-scroll], .scroll-container');
    scrollContainers.forEach((container) => {
      (container as HTMLElement).style.willChange = 'transform';
    });

    // Monitor scroll frame rate
    this.monitorScrollPerformance();
  }

  private enableMemoryManagement(): void {
    console.log('[MOBILE OPTIMIZER] Enabling aggressive memory management');

    // Clear caches periodically
    setInterval(() => {
      this.clearNonEssentialCaches();
    }, 60000); // Every minute

    // Monitor memory pressure
    if ('memory' in performance) {
      setInterval(() => {
        const memoryInfo = (performance as any).memory;
        const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        
        if (usageRatio > 0.85) {
          console.warn('[MOBILE OPTIMIZER] High memory usage detected, clearing caches');
          this.clearNonEssentialCaches();
          this.performanceMetrics.memoryPressure = usageRatio;
        }
      }, 30000);
    }

    // Implement automatic garbage collection hints
    if ('gc' in window) {
      setInterval(() => {
        (window as any).gc();
      }, 300000); // Every 5 minutes
    }
  }

  private deferNonCriticalResources(): void {
    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script:not([data-critical])') as NodeListOf<HTMLScriptElement>;
    scripts.forEach((script) => {
      if (!script.src.includes('crisis') && !script.src.includes('emergency')) {
        script.defer = true;
      }
    });

    // Defer non-critical stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])') as NodeListOf<HTMLLinkElement>;
    stylesheets.forEach((link) => {
      if (!link.href.includes('crisis')) {
        link.media = 'print';
        link.addEventListener('load', () => {
          link.media = 'all';
        });
      }
    });
  }

  private disableNonEssentialFeatures(): void {
    // Disable autoplay videos
    const videos = document.querySelectorAll('video[autoplay]') as NodeListOf<HTMLVideoElement>;
    videos.forEach((video) => {
      video.autoplay = false;
      video.preload = 'none';
    });

    // Disable unnecessary animations
    const animatedElements = document.querySelectorAll('[data-animate]:not([data-crisis])');
    animatedElements.forEach((element) => {
      element.removeAttribute('data-animate');
    });

    // Reduce the frequency of non-critical updates
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('disable-non-essential-features');
      window.dispatchEvent(event);
    }
  }

  private clearNonEssentialCaches(): void {
    // Clear image caches (keep crisis images)
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          if (!cacheName.includes('crisis')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Clear localStorage items (keep crisis data)
    const keysToKeep = ['alchm_crisis_resources', 'alchm_auth_token'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToKeep.some(keepKey => key.includes(keepKey))) {
        localStorage.removeItem(key);
      }
    });
  }

  private adjustOptimizationsForBattery(): void {
    const batteryLevel = this.deviceInfo.batteryLevel || 1;
    
    if (batteryLevel < 0.2 && !document.body.classList.contains('battery-saver')) {
      this.enableBatterySaverMode();
    } else if (batteryLevel > 0.3 && document.body.classList.contains('battery-saver')) {
      document.body.classList.remove('battery-saver');
      this.batteryOptimization.reduceAnimations = false;
    }
  }

  private startPerformanceMonitoring(): void {
    // Monitor touch response time
    this.monitorTouchPerformance();
    
    // Monitor scroll performance
    this.monitorScrollPerformance();
    
    // Monitor memory usage
    this.monitorMemoryUsage();
    
    // Monitor network performance
    this.monitorNetworkPerformance();
  }

  private monitorTouchPerformance(): void {
    if (!this.deviceInfo.supportsTouchEvents) return;

    let touchStartTime = 0;

    document.addEventListener('touchstart', () => {
      touchStartTime = performance.now();
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (touchStartTime) {
        const responseTime = performance.now() - touchStartTime;
        this.performanceMetrics.touchResponseTime = responseTime;

        // Check crisis button response time
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && this.isCrisisElement(activeElement)) {
          this.performanceMetrics.crisisButtonResponseTime = responseTime;
          
          if (responseTime > 100) {
            console.warn(`[MOBILE OPTIMIZER] Crisis button slow response: ${responseTime}ms`);
          }
        }
      }
    }, { passive: true });
  }

  private monitorScrollPerformance(): void {
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const measureFrameRate = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastFrameTime >= 1000) {
        this.performanceMetrics.scrollFrameRate = frameCount;
        
        if (frameCount < 30) {
          console.warn(`[MOBILE OPTIMIZER] Low scroll frame rate: ${frameCount}fps`);
        }
        
        frameCount = 0;
        lastFrameTime = currentTime;
      }
      
      requestAnimationFrame(measureFrameRate);
    };

    requestAnimationFrame(measureFrameRate);
  }

  private monitorMemoryUsage(): void {
    if (!('memory' in performance)) return;

    setInterval(() => {
      const memoryInfo = (performance as any).memory;
      const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      this.performanceMetrics.memoryPressure = usageRatio;
    }, 15000);
  }

  private monitorNetworkPerformance(): void {
    const connection = (navigator as any).connection;
    if (!connection) return;

    const updateNetworkMetrics = () => {
      this.performanceMetrics.networkLatency = connection.rtt || 0;
      
      // Adjust optimizations based on network changes
      if (['slow-2g', '2g'].includes(connection.effectiveType)) {
        this.optimizeForSlowNetwork();
      }
    };

    connection.addEventListener('change', updateNetworkMetrics);
    updateNetworkMetrics();
  }

  private generatePlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }

  private isCrisisElement(element: HTMLElement): boolean {
    return element.hasAttribute('data-crisis-action') ||
           element.classList.contains('crisis-button') ||
           element.classList.contains('emergency-button') ||
           element.textContent?.toLowerCase().includes('crisis') ||
           element.textContent?.toLowerCase().includes('emergency');
  }

  private isMobileDevice(): boolean {
    return this.deviceInfo.type === 'smartphone' || this.deviceInfo.type === 'tablet';
  }

  private logOptimizationSummary(): void {
    const appliedOptimizations = this.optimizations.filter(opt => 
      opt.condition(this.deviceInfo)
    );

    console.log('[MOBILE OPTIMIZER] Optimization Summary:', {
      deviceType: this.deviceInfo.type,
      isLowEndDevice: this.deviceInfo.isLowEndDevice,
      appliedOptimizations: appliedOptimizations.length,
      estimatedImpact: appliedOptimizations.reduce((sum, opt) => sum + opt.estimatedImpact, 0),
      crisisOptimizations: appliedOptimizations.filter(opt => opt.isCrisisRelated).length
    });
  }

  // Public API
  public getDeviceInfo(): MobileDeviceInfo {
    return { ...this.deviceInfo };
  }

  public getPerformanceMetrics(): MobilePerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  public isOptimizedForMobile(): boolean {
    return this.isOptimized && this.isMobileDevice();
  }

  public enableEmergencyMode(): void {
    console.log('[MOBILE OPTIMIZER] Enabling emergency mode');
    
    this.performanceMetrics.emergencyModeActivations++;
    
    // Apply most aggressive optimizations
    this.enableLowEndDeviceMode();
    this.optimizeForSlowNetwork();
    this.enableBatterySaverMode();
    
    // Ensure crisis resources are cached
    this.cacheCrisisResources();
    
    // Notify the app
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('mobile-emergency-mode', {
        detail: { metrics: this.performanceMetrics }
      });
      window.dispatchEvent(event);
    }
  }

  public disableEmergencyMode(): void {
    console.log('[MOBILE OPTIMIZER] Disabling emergency mode');
    
    document.body.classList.remove('low-end-device', 'battery-saver');
    
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('mobile-emergency-mode-off');
      window.dispatchEvent(event);
    }
  }

  public forceReoptimize(): void {
    this.isOptimized = false;
    this.deviceInfo = this.detectMobileDevice();
    this.initializeOptimizations();
    this.applyOptimizations();
  }

  public getOptimizationReport(): any {
    const appliedOptimizations = this.optimizations.filter(opt => 
      opt.condition(this.deviceInfo)
    );

    return {
      deviceInfo: this.deviceInfo,
      appliedOptimizations: appliedOptimizations.map(opt => ({
        name: opt.name,
        priority: opt.priority,
        isCrisisRelated: opt.isCrisisRelated,
        estimatedImpact: opt.estimatedImpact
      })),
      performanceMetrics: this.performanceMetrics,
      touchOptimization: this.touchOptimization,
      networkOptimization: this.networkOptimization,
      batteryOptimization: this.batteryOptimization,
      timestamp: Date.now()
    };
  }

  public destroy(): void {
    this.observers.forEach(observer => {
      if (observer && typeof observer.disconnect === 'function') {
        observer.disconnect();
      }
    });
    this.observers = [];
    
    console.log('[MOBILE OPTIMIZER] Destroyed');
  }
}

// Singleton instance
let mobileOptimizerInstance: MobilePerformanceOptimizer | null = null;

export function getMobileOptimizer(): MobilePerformanceOptimizer {
  if (!mobileOptimizerInstance) {
    mobileOptimizerInstance = new MobilePerformanceOptimizer();
  }
  return mobileOptimizerInstance;
}

export type {
  MobileDeviceInfo,
  MobileOptimization,
  TouchOptimization,
  NetworkOptimization,
  BatteryOptimization,
  MobilePerformanceMetrics
};

export default MobilePerformanceOptimizer;