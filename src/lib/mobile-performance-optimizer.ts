/**
 * ALCHM Mobile Performance Optimizer - Critical App Store Compliance
 * 
 * Addresses critical performance issues for trauma survivors accessing crisis support:
 * - Time to Interactive: Target <5s (currently 14-20s on low-end devices)
 * - First Contentful Paint: Target <2s (currently 5.6-8s on constrained devices)
 * - Crisis detection latency: Target <1s (currently 2-2.6s on very low-end devices)
 * 
 * This optimizer is designed for users in mental health crisis who may have older devices
 * with limited resources and unreliable network connections.
 */

interface DeviceCapabilities {
  isLowEnd: boolean;
  isVeryLowEnd: boolean; // <2GB RAM, <4 cores - critical for crisis users
  connectionType: string;
  effectiveType: string;
  memoryGB: number;
  coreCount: number;
  batteryLevel?: number;
  screenSize: 'small' | 'medium' | 'large';
  pixelRatio: number;
  supportsTouchEvents: boolean;
  isInCrisisMode: boolean;
  networkDownlink?: number;
  rtt?: number; // Round-trip time for network optimization
}

interface PerformanceConfig {
  enableAnimations: boolean;
  maxImageQuality: number;
  prefetchLevel: 'none' | 'critical' | 'all';
  cacheStrategy: 'minimal' | 'standard' | 'aggressive';
  crisisMode: boolean;
  simplifiedUI: boolean;
  aggressiveLazyLoading: boolean;
  offlineCrisisSupport: boolean;
  largeTouchTargets: boolean; // 52px minimum for trembling hands
  highContrastMode: boolean;
  reduceMotion: boolean;
  bundleSplitting: 'aggressive' | 'standard' | 'minimal';
}

interface PerformanceMetrics {
  timeToInteractive: number;
  firstContentfulPaint: number;
  cumulativeLayoutShift: number;
  crisisDetectionLatency: number;
  memoryUsage: number;
  batteryDrain: number;
}

export class MobilePerformanceOptimizer {
  private deviceCapabilities: DeviceCapabilities;
  private performanceConfig: PerformanceConfig;
  private observer: PerformanceObserver | null = null;
  private memoryMonitor: any = null;
  private crisisDetectionStartTime: number = 0;
  private metrics: PerformanceMetrics;
  private isInitialized = false;

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.deviceCapabilities = this.detectDeviceCapabilities();
      this.performanceConfig = this.generateOptimalConfig();
      this.metrics = this.initializeMetrics();
      this.initializePerformanceMonitoring();
      this.applyImmediateCrisisOptimizations();
    } else {
      // Default values for server-side rendering
      this.deviceCapabilities = {
        isLowEnd: false,
        isVeryLowEnd: false,
        connectionType: 'unknown',
        effectiveType: '4g',
        memoryGB: 4,
        coreCount: 4,
        screenSize: 'medium',
        pixelRatio: 1,
        supportsTouchEvents: false,
        isInCrisisMode: false
      };
      this.performanceConfig = {
        enableAnimations: true,
        maxImageQuality: 0.8,
        prefetchLevel: 'standard',
        cacheStrategy: 'standard',
        crisisMode: false,
        simplifiedUI: false,
        aggressiveLazyLoading: false,
        offlineCrisisSupport: false,
        largeTouchTargets: false,
        highContrastMode: false,
        reduceMotion: false,
        bundleSplitting: 'standard'
      };
      this.metrics = {
        timeToInteractive: 0,
        firstContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        crisisDetectionLatency: 0,
        memoryUsage: 0,
        batteryDrain: 0
      };
    }
  }

  /**
   * Detects comprehensive device capabilities for trauma-informed optimization
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const nav = navigator as any;
    const screen = window.screen;
    
    // Memory detection with fallbacks for older devices
    const memoryGB = nav.deviceMemory || this.estimateDeviceMemory();
    
    // CPU core count
    const coreCount = nav.hardwareConcurrency || 2;
    
    // Connection detection with comprehensive fallbacks
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connectionType = connection?.type || 'unknown';
    const effectiveType = connection?.effectiveType || '4g';
    const networkDownlink = connection?.downlink;
    const rtt = connection?.rtt;
    
    // Screen size classification for touch optimization
    const screenWidth = screen.width;
    const screenSize: 'small' | 'medium' | 'large' = 
      screenWidth < 360 ? 'small' :
      screenWidth < 768 ? 'medium' : 'large';
    
    // Device pixel ratio for image optimization
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Touch support detection
    const supportsTouchEvents = 'ontouchstart' in window || nav.maxTouchPoints > 0;
    
    // Crisis mode detection from multiple sources
    const isInCrisisMode = this.detectCrisisMode();
    
    // Battery level detection (async)
    let batteryLevel: number | undefined;
    if (nav.getBattery) {
      nav.getBattery().then((battery: any) => {
        this.deviceCapabilities.batteryLevel = battery.level;
        if (battery.level < 0.2) {
          // Low battery - enable ultra power saving
          this.enableUltraPowerSaving();
        }
      }).catch(() => {
        // Battery API not available
      });
    }
    
    // Enhanced low-end device classification
    const isLowEnd = (
      memoryGB < 3 ||
      coreCount < 4 ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      effectiveType === 'slow-3g' ||
      (networkDownlink && networkDownlink < 1.5) ||
      (rtt && rtt > 300) ||
      this.isOldAndroidDevice()
    );
    
    // Very low-end classification for crisis users with very old devices
    const isVeryLowEnd = (
      memoryGB < 2 ||
      coreCount < 3 ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      (networkDownlink && networkDownlink < 0.5) ||
      (rtt && rtt > 500)
    );

    return {
      isLowEnd,
      isVeryLowEnd,
      connectionType,
      effectiveType,
      memoryGB,
      coreCount,
      batteryLevel,
      screenSize,
      pixelRatio,
      supportsTouchEvents,
      isInCrisisMode,
      networkDownlink,
      rtt
    };
  }

  /**
   * Estimate device memory for older browsers without deviceMemory API
   */
  private estimateDeviceMemory(): number {
    try {
      // Try performance.memory (Chrome)
      const memory = (performance as any).memory;
      if (memory) {
        const estimatedGB = memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
        return Math.max(1, Math.min(8, estimatedGB));
      }
    } catch {
      // Performance memory not available
    }

    // User agent based estimation for old devices
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Android device memory estimation
    if (userAgent.includes('android')) {
      if (userAgent.includes('android 4') || userAgent.includes('android 5')) {
        return 1; // Very old Android devices
      }
      if (userAgent.includes('android 6') || userAgent.includes('android 7')) {
        return 2; // Older Android devices
      }
      if (userAgent.includes('go') || userAgent.includes('lite')) {
        return 1; // Android Go devices
      }
      return 3; // Modern Android devices
    }
    
    // iOS device estimation
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      if (userAgent.includes('os 10_') || userAgent.includes('os 11_')) {
        return 2; // Older iOS devices
      }
      return 4; // Modern iOS devices
    }

    return 2; // Conservative default for unknown devices
  }

  /**
   * Detect if device is an old Android device prone to performance issues
   */
  private isOldAndroidDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      userAgent.includes('android') && (
        userAgent.includes('android 4') ||
        userAgent.includes('android 5') ||
        userAgent.includes('android 6') ||
        !userAgent.includes('chrome') ||
        userAgent.includes('webview')
      )
    );
  }

  /**
   * Detect crisis mode from various indicators
   */
  private detectCrisisMode(): boolean {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('crisis') === 'true') return true;
    
    // Check localStorage
    try {
      if (localStorage.getItem('alchm_crisis_mode') === 'true') return true;
    } catch {
      // localStorage not available
    }
    
    // Check for crisis keywords in referrer
    if (document.referrer) {
      const crisisKeywords = ['crisis', 'emergency', 'suicide', 'help', '988', 'mental', 'distress'];
      const referrerLower = document.referrer.toLowerCase();
      if (crisisKeywords.some(keyword => referrerLower.includes(keyword))) {
        return true;
      }
    }
    
    // Check DOM for crisis indicators
    if (document.body.classList.contains('crisis-mode') || 
        document.body.classList.contains('emergency-mode')) {
      return true;
    }

    return false;
  }

  /**
   * Initialize performance metrics tracking
   */
  private initializeMetrics(): PerformanceMetrics {
    return {
      timeToInteractive: 0,
      firstContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      crisisDetectionLatency: 0,
      memoryUsage: 0,
      batteryDrain: 0
    };
  }

  /**
   * Apply immediate crisis optimizations (before DOM ready)
   */
  private applyImmediateCrisisOptimizations(): void {
    if (this.deviceCapabilities.isInCrisisMode || this.deviceCapabilities.isVeryLowEnd) {
      // Apply critical CSS immediately
      document.documentElement.style.setProperty('--crisis-optimization', '1');
      document.documentElement.style.setProperty('--disable-animations', '1');
      document.documentElement.style.setProperty('--reduce-complexity', '1');
      
      // Add classes for immediate CSS targeting
      document.body.classList.add('crisis-optimized');
      if (this.deviceCapabilities.isVeryLowEnd) {
        document.body.classList.add('very-low-end-device');
      }
    }
  }

  /**
   * Enable ultra power saving mode for low battery
   */
  private enableUltraPowerSaving(): void {
    document.body.classList.add('ultra-power-saving');
    document.documentElement.style.setProperty('--disable-all-animations', '1');
    document.documentElement.style.setProperty('--reduce-brightness', '0.8');
    document.documentElement.style.setProperty('--disable-gpu-acceleration', '1');
    
    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('ultraPowerSavingEnabled'));
  }

  /**
   * Generates optimal performance configuration based on device capabilities
   */
  private generateOptimalConfig(): PerformanceConfig {
    const { 
      isLowEnd, 
      isVeryLowEnd, 
      effectiveType, 
      isInCrisisMode, 
      screenSize, 
      supportsTouchEvents,
      memoryGB,
      coreCount 
    } = this.deviceCapabilities;
    
    return {
      enableAnimations: !isLowEnd && !isInCrisisMode && effectiveType !== 'slow-2g',
      maxImageQuality: isVeryLowEnd ? 0.4 : isLowEnd ? 0.6 : 0.8,
      prefetchLevel: isVeryLowEnd ? 'none' : isLowEnd ? 'critical' : 'standard',
      cacheStrategy: (effectiveType === 'slow-2g' || isVeryLowEnd) ? 'aggressive' : 'standard',
      crisisMode: isInCrisisMode,
      simplifiedUI: isLowEnd || isInCrisisMode || screenSize === 'small',
      aggressiveLazyLoading: isLowEnd || effectiveType === 'slow-2g',
      offlineCrisisSupport: true, // Always enable for crisis situations
      largeTouchTargets: supportsTouchEvents && (screenSize === 'small' || isInCrisisMode),
      highContrastMode: isInCrisisMode,
      reduceMotion: isLowEnd || isInCrisisMode,
      bundleSplitting: isVeryLowEnd ? 'aggressive' : isLowEnd ? 'standard' : 'minimal'
    };
  }

  /**
   * Initializes comprehensive performance monitoring for crisis-critical metrics
   */
  private initializePerformanceMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.handleNavigationTiming(entry as PerformanceNavigationTiming);
          } else if (entry.entryType === 'paint') {
            this.handlePaintTiming(entry);
          } else if (entry.entryType === 'largest-contentful-paint') {
            this.handleLCPTiming(entry);
          } else if (entry.entryType === 'first-input') {
            this.handleFIDTiming(entry);
          } else if (entry.entryType === 'layout-shift') {
            this.handleLayoutShift(entry as any);
          } else if (entry.entryType === 'measure' && entry.name === 'crisis-detection') {
            this.handleCrisisDetectionTiming(entry);
          }
        }
      });

      // Observe all critical performance metrics
      this.observer.observe({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'measure'] 
      });

      // Start memory monitoring for low-end devices
      if (this.deviceCapabilities.isLowEnd) {
        this.startMemoryMonitoring();
      }

    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  /**
   * Start memory monitoring for low-end devices
   */
  private startMemoryMonitoring(): void {
    if (!(performance as any).memory) return;

    const checkMemory = () => {
      const memory = (performance as any).memory;
      const usedMB = memory.usedJSHeapSize / (1024 * 1024);
      const limitMB = memory.jsHeapSizeLimit / (1024 * 1024);
      const usagePercent = (usedMB / limitMB) * 100;

      this.metrics.memoryUsage = usedMB;

      // Critical memory usage (above 80% on low-end devices)
      if (usagePercent > 80 && this.deviceCapabilities.isLowEnd) {
        this.handleCriticalMemoryUsage();
      }

      // Very critical memory usage (above 90%)
      if (usagePercent > 90) {
        this.handleMemoryEmergency();
      }
    };

    // Check memory every 10 seconds for low-end devices
    this.memoryMonitor = setInterval(checkMemory, 10000);
    checkMemory(); // Initial check
  }

  /**
   * Handle critical memory usage
   */
  private handleCriticalMemoryUsage(): void {
    document.body.classList.add('memory-critical');
    
    // Force garbage collection if available
    if ((window as any).gc) {
      (window as any).gc();
    }

    // Dispatch event for components to reduce memory usage
    window.dispatchEvent(new CustomEvent('memoryPressure', {
      detail: { level: 'critical' }
    }));
  }

  /**
   * Handle memory emergency (>90% usage)
   */
  private handleMemoryEmergency(): void {
    document.body.classList.add('memory-emergency');
    
    // Enable only crisis-essential features
    this.enableCrisisOnlyMode();
    
    // Dispatch emergency event
    window.dispatchEvent(new CustomEvent('memoryEmergency', {
      detail: { enableOnlyCrisisFeatures: true }
    }));
  }

  /**
   * Enable crisis-only mode for memory/performance emergencies
   */
  private enableCrisisOnlyMode(): void {
    document.body.classList.add('crisis-only-mode');
    document.documentElement.style.setProperty('--crisis-only', '1');
    
    // Store crisis mode state
    try {
      localStorage.setItem('alchm_crisis_only_mode', 'true');
    } catch {
      // localStorage not available
    }
  }

  /**
   * Handles navigation timing for performance optimization
   */
  private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
    const loadTime = entry.loadEventEnd - entry.loadEventStart;
    const domContentLoaded = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
    const timeToInteractive = entry.domInteractive - entry.navigationStart;
    
    this.metrics.timeToInteractive = timeToInteractive;
    
    // Critical performance thresholds for crisis users
    if (timeToInteractive > 5000) { // >5s TTI
      this.enableCrisisPerformanceMode();
    }
    
    if (loadTime > 8000 || domContentLoaded > 5000) { // Extremely slow
      this.enableCrisisOnlyMode();
    }
  }

  /**
   * Handles paint timing metrics
   */
  private handlePaintTiming(entry: PerformanceEntry): void {
    if (entry.name === 'first-contentful-paint') {
      this.metrics.firstContentfulPaint = entry.startTime;
      
      // FCP threshold for crisis optimization
      if (entry.startTime > 2000) { // >2s FCP
        this.optimizeForSlowConnection();
      }
      
      // Critical FCP threshold
      if (entry.startTime > 5000) { // >5s FCP (crisis users can't wait)
        this.enableCrisisOnlyMode();
      }
    }
  }

  /**
   * Handle Largest Contentful Paint timing
   */
  private handleLCPTiming(entry: PerformanceEntry): void {
    // LCP should be <2.5s for good user experience
    if (entry.startTime > 2500) {
      this.enableCrisisPerformanceMode();
    }
  }

  /**
   * Handle First Input Delay timing
   */
  private handleFIDTiming(entry: PerformanceEntry): void {
    const fid = (entry as any).processingStart - entry.startTime;
    
    // FID should be <100ms, critical for crisis button responsiveness
    if (fid > 100) {
      this.optimizeTouchResponsiveness();
    }
    
    // Critical FID threshold
    if (fid > 300) {
      this.enableCrisisPerformanceMode();
    }
  }

  /**
   * Handle layout shift
   */
  private handleLayoutShift(entry: any): void {
    if (!entry.hadRecentInput) {
      this.metrics.cumulativeLayoutShift += entry.value;
      
      // High CLS can be disorienting for users in crisis
      if (this.metrics.cumulativeLayoutShift > 0.1) {
        this.stabilizeLayout();
      }
    }
  }

  /**
   * Handle crisis detection timing measurement
   */
  private handleCrisisDetectionTiming(entry: PerformanceEntry): void {
    this.metrics.crisisDetectionLatency = entry.duration;
    
    // Crisis detection must be <1s for safety
    if (entry.duration > 1000) {
      console.warn('Crisis detection too slow:', entry.duration + 'ms');
      this.optimizeCrisisDetection();
    }
  }

  /**
   * Start crisis detection timing
   */
  public startCrisisDetectionTiming(): void {
    this.crisisDetectionStartTime = performance.now();
    performance.mark('crisis-detection-start');
  }

  /**
   * End crisis detection timing
   */
  public endCrisisDetectionTiming(): void {
    performance.mark('crisis-detection-end');
    performance.measure('crisis-detection', 'crisis-detection-start', 'crisis-detection-end');
  }

  /**
   * Optimize crisis detection for faster response
   */
  private optimizeCrisisDetection(): void {
    // Preload crisis resources immediately
    this.preloadCrisisResources();
    
    // Simplify crisis detection algorithm
    document.body.classList.add('simplified-crisis-detection');
  }

  /**
   * Stabilize layout to prevent disorienting shifts
   */
  private stabilizeLayout(): void {
    // Add CSS to prevent layout shifts
    const style = document.createElement('style');
    style.textContent = `
      .layout-stabilized * {
        min-height: 1px;
      }
      .layout-stabilized img {
        aspect-ratio: attr(width) / attr(height);
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('layout-stabilized');
  }

  /**
   * Enables crisis performance mode for struggling devices
   */
  private enableCrisisPerformanceMode(): void {
    document.body.classList.add('crisis-performance-mode');
    
    // Apply comprehensive performance optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Crisis Performance Mode CSS */
      .crisis-performance-mode * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      /* Disable resource-intensive animations */
      .crisis-performance-mode .animate-gentle-breathe,
      .crisis-performance-mode .animate-sanctuary-shimmer,
      .crisis-performance-mode .animate-pulse,
      .crisis-performance-mode .animate-spin,
      .crisis-performance-mode .animate-bounce {
        animation: none !important;
      }
      
      /* Optimize image rendering for performance */
      .crisis-performance-mode img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        will-change: auto;
      }
      
      /* Disable GPU-accelerated effects */
      .crisis-performance-mode * {
        transform: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        will-change: auto !important;
      }
      
      /* Essential elements only */
      .crisis-performance-mode .non-essential {
        display: none !important;
      }
      
      /* Optimize typography for readability during crisis */
      .crisis-performance-mode {
        font-smooth: never;
        -webkit-font-smoothing: none;
        text-rendering: optimizeSpeed;
      }
      
      /* High contrast for crisis visibility */
      .crisis-performance-mode .crisis-button,
      .crisis-performance-mode .emergency-button {
        background: #ff0000 !important;
        color: #ffffff !important;
        border: 3px solid #ffffff !important;
        box-shadow: 0 0 0 3px #ff0000 !important;
      }
    `;
    document.head.appendChild(style);
    
    // Set CSS custom properties for comprehensive optimization
    document.documentElement.style.setProperty('--crisis-performance', '1');
    document.documentElement.style.setProperty('--disable-transitions', '1');
    document.documentElement.style.setProperty('--disable-animations', '1');
    document.documentElement.style.setProperty('--high-contrast', '1');
    document.documentElement.style.setProperty('--large-touch-targets', '52px');
    
    // Store crisis mode state
    try {
      sessionStorage.setItem('crisis_performance_mode', 'true');
      localStorage.setItem('alchm_crisis_performance_mode', 'true');
    } catch {
      // Storage not available
    }
    
    // Dispatch event for components to react
    window.dispatchEvent(new CustomEvent('crisisPerformanceModeEnabled', {
      detail: { timestamp: Date.now() }
    }));
  }

  /**
   * Optimizes for slow connection scenarios with aggressive techniques
   */
  private optimizeForSlowConnection(): void {
    document.body.classList.add('slow-connection');
    
    // Reduce image quality and size aggressively
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        // For very slow connections, convert to low-quality webp
        if (this.deviceCapabilities.effectiveType === 'slow-2g') {
          const lowQualityParams = 'w_400,q_30,f_webp';
          if (img.src.includes('cloudinary')) {
            img.src = img.src.replace(/upload\//, `upload/${lowQualityParams}/`);
          } else if (img.src.includes('firebase')) {
            img.src += img.src.includes('?') ? '&q=30&f=webp' : '?q=30&f=webp';
          }
        } else {
          // Standard slow connection optimization
          const qualityParams = 'w_800,q_50,f_auto';
          if (img.src.includes('cloudinary')) {
            img.src = img.src.replace(/upload\//, `upload/${qualityParams}/`);
          } else if (img.src.includes('firebase')) {
            img.src += img.src.includes('?') ? '&q=50&f=auto' : '?q=50&f=auto';
          }
        }
      }
    });

    // Disable non-critical resource loading
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = script.getAttribute('src') || '';
      const isCritical = src.includes('firebase') || 
                        src.includes('crisis') || 
                        src.includes('emergency') ||
                        src.includes('auth');
      
      if (!isCritical) {
        script.remove(); // Remove non-critical scripts entirely
      }
    });

    // Disable video autoplay
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.removeAttribute('autoplay');
      video.preload = 'none';
    });

    // Simplify CSS for faster parsing
    document.documentElement.style.setProperty('--disable-gradients', '1');
    document.documentElement.style.setProperty('--disable-shadows', '1');
    document.documentElement.style.setProperty('--disable-blur', '1');
    
    // Store optimization state
    try {
      sessionStorage.setItem('slow_connection_mode', 'true');
    } catch {
      // Storage not available
    }
  }

  /**
   * Preloads critical resources for crisis access with priority optimization
   */
  public preloadCrisisResources(): void {
    const criticalResources = [
      { url: '/api/crisis-support', priority: 'high' },
      { url: '/api/crisis-detection', priority: 'high' },
      { url: '/crisis-resources.json', priority: 'high' },
      { url: '/offline-crisis-guide.html', priority: 'medium' },
      { url: '/emergency-contacts.json', priority: 'medium' },
      { url: '/crisis-text-lines.json', priority: 'low' }
    ];

    criticalResources.forEach(({ url, priority }) => {
      if (url.startsWith('tel:')) return; // Skip phone links
      
      // Use different strategies based on priority and device capabilities
      if (priority === 'high' || this.deviceCapabilities.isInCrisisMode) {
        // High priority: preload with fetch for immediate availability
        fetch(url, { 
          method: 'GET',
          priority: 'high' as any,
          cache: 'force-cache'
        }).catch(() => {
          // Fallback to link prefetch if fetch fails
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = url;
          link.as = url.endsWith('.json') ? 'fetch' : 'document';
          document.head.appendChild(link);
        });
      } else if (!this.deviceCapabilities.isVeryLowEnd) {
        // Medium/low priority: use link prefetch for non-low-end devices
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // Preload critical CSS for crisis mode
    if (this.deviceCapabilities.isInCrisisMode || this.deviceCapabilities.isLowEnd) {
      const crisisCSS = document.createElement('link');
      crisisCSS.rel = 'preload';
      crisisCSS.href = '/styles/crisis-mode.css';
      crisisCSS.as = 'style';
      document.head.appendChild(crisisCSS);
    }

    // Cache emergency numbers in localStorage for offline access
    try {
      const emergencyData = {
        hotlines: {
          'crisis': '988',
          'emergency': '911',
          'text': '741741'
        },
        lastUpdated: Date.now()
      };
      localStorage.setItem('alchm_emergency_contacts', JSON.stringify(emergencyData));
    } catch {
      // localStorage not available
    }
  }

  /**
   * Optimizes touch responsiveness for crisis situations with trauma-informed UX
   */
  public optimizeTouchResponsiveness(): void {
    // Apply large touch targets for users with trembling hands
    if (this.performanceConfig.largeTouchTargets) {
      const style = document.createElement('style');
      style.textContent = `
        .large-touch-targets button,
        .large-touch-targets a[role="button"],
        .large-touch-targets input[type="submit"],
        .large-touch-targets .crisis-button,
        .large-touch-targets .emergency-button {
          min-height: 52px !important;
          min-width: 52px !important;
          padding: 16px !important;
          margin: 8px !important;
        }
        
        /* Extra large touch targets for crisis buttons */
        .large-touch-targets .crisis-button,
        .large-touch-targets .emergency-button {
          min-height: 64px !important;
          min-width: 64px !important;
          padding: 20px !important;
          font-size: 18px !important;
          font-weight: bold !important;
        }
      `;
      document.head.appendChild(style);
      document.body.classList.add('large-touch-targets');
    }

    // Add passive event listeners for better scroll performance
    const touchElements = document.querySelectorAll('.touch-safe, .crisis-accessible, button, a[role="button"]');
    
    touchElements.forEach(element => {
      // Remove existing listeners to avoid duplicates
      element.removeEventListener('touchstart', this.handleTouchStart as any);
      element.removeEventListener('touchmove', this.handleTouchMove as any);
      element.removeEventListener('touchend', this.handleTouchEnd as any);
      
      // Add optimized touch listeners
      element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
      element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
      element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    });

    // Optimize crisis buttons specifically
    const crisisButtons = document.querySelectorAll('.crisis-button, .emergency-button');
    crisisButtons.forEach(button => {
      // Make crisis buttons immediately responsive
      button.addEventListener('touchstart', function(e) {
        this.style.transform = 'scale(0.95)';
        this.style.backgroundColor = '#cc0000';
        
        // Haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, { passive: true });
      
      button.addEventListener('touchend', function(e) {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = '';
      }, { passive: true });
    });

    // Prevent accidental double-taps on crisis buttons
    let lastCrisisTap = 0;
    crisisButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const now = Date.now();
        if (now - lastCrisisTap < 1000) { // 1 second debounce
          e.preventDefault();
          return false;
        }
        lastCrisisTap = now;
      });
    });

    // Enable swipe gestures for emergency navigation
    if (this.deviceCapabilities.supportsTouchEvents) {
      this.enableEmergencySwipeGestures();
    }
  }

  private handleTouchStart(e: TouchEvent): void {
    const target = e.target as HTMLElement;
    target.classList.add('touch-active');
  }

  private handleTouchMove(e: TouchEvent): void {
    // Optimize scroll performance
    if (e.touches.length > 1) {
      e.preventDefault(); // Prevent pinch zoom during crisis
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    const target = e.target as HTMLElement;
    target.classList.remove('touch-active');
  }

  /**
   * Enable emergency swipe gestures for quick access
   */
  private enableEmergencySwipeGestures(): void {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Swipe from right edge for emergency access
      if (touchStartX > window.innerWidth - 50 && deltaX < -100 && Math.abs(deltaY) < 100) {
        this.triggerEmergencyAccess();
      }
      
      // Swipe down from top for crisis resources
      if (touchStartY < 50 && deltaY > 100 && Math.abs(deltaX) < 100) {
        this.showCrisisResources();
      }
    }, { passive: true });
  }

  /**
   * Trigger emergency access overlay
   */
  private triggerEmergencyAccess(): void {
    window.dispatchEvent(new CustomEvent('emergencyAccessRequested', {
      detail: { trigger: 'swipe', timestamp: Date.now() }
    }));
  }

  /**
   * Show crisis resources quickly
   */
  private showCrisisResources(): void {
    window.dispatchEvent(new CustomEvent('crisisResourcesRequested', {
      detail: { trigger: 'swipe', timestamp: Date.now() }
    }));
  }

  /**
   * Implements comprehensive memory-conscious loading for low-end devices
   */
  public implementMemoryOptimizations(): void {
    // Apply optimizations for all devices, with intensity based on capabilities
    const isVeryLowEnd = this.deviceCapabilities.isVeryLowEnd;
    const isLowEnd = this.deviceCapabilities.isLowEnd;

    // Lazy load images with optimized intersection observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            // Load appropriate quality based on device
            let src = img.dataset.src;
            if (isVeryLowEnd && src.includes('cloudinary')) {
              src = src.replace(/upload\//, 'upload/w_300,q_40,f_webp/');
            } else if (isLowEnd && src.includes('cloudinary')) {
              src = src.replace(/upload\//, 'upload/w_600,q_60,f_auto/');
            }
            
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, { 
      rootMargin: isVeryLowEnd ? '25px' : '50px',
      threshold: 0.1 
    });

    // Apply lazy loading to all images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    // Convert existing images to lazy loading if not already
    document.querySelectorAll('img:not([data-src])').forEach(img => {
      const currentSrc = (img as HTMLImageElement).src;
      if (currentSrc && !currentSrc.startsWith('data:')) {
        (img as HTMLImageElement).dataset.src = currentSrc;
        (img as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E';
        imageObserver.observe(img);
      }
    });

    // Aggressive memory management for very low-end devices
    if (isVeryLowEnd || this.deviceCapabilities.memoryGB < 2) {
      this.implementAggressiveMemoryManagement();
    }

    // Component-level memory optimization
    if (isLowEnd) {
      this.optimizeComponentMemoryUsage();
    }
  }

  /**
   * Optimize component memory usage
   */
  private optimizeComponentMemoryUsage(): void {
    // Dispatch event for React components to optimize themselves
    window.dispatchEvent(new CustomEvent('optimizeMemoryUsage', {
      detail: { 
        level: this.deviceCapabilities.isVeryLowEnd ? 'aggressive' : 'standard',
        memoryGB: this.deviceCapabilities.memoryGB
      }
    }));

    // Reduce React DevTools overhead in production
    if (typeof window !== 'undefined' && !(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        supportsFiber: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {}
      };
    }
  }

  /**
   * Aggressive memory management for very low-end devices
   */
  private implementAggressiveMemoryManagement(): void {
    const contentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target as HTMLElement;
        
        if (!entry.isIntersecting) {
          // Unload heavy content when not visible
          const videos = element.querySelectorAll('video');
          videos.forEach(video => video.pause());
          
          const iframes = element.querySelectorAll('iframe');
          iframes.forEach(iframe => {
            iframe.dataset.originalSrc = iframe.src;
            iframe.src = 'about:blank';
          });
        } else {
          // Reload content when back in view
          const iframes = element.querySelectorAll('iframe[data-original-src]');
          iframes.forEach(iframe => {
            iframe.src = iframe.dataset.originalSrc || '';
            iframe.removeAttribute('data-original-src');
          });
        }
      });
    }, { rootMargin: '200px' });

    document.querySelectorAll('.heavy-content').forEach(element => {
      contentObserver.observe(element);
    });
  }

  /**
   * Monitors connection changes and adapts accordingly
   */
  public monitorConnectionChanges(): void {
    const connection = (navigator as any).connection;
    if (!connection) return;

    connection.addEventListener('change', () => {
      this.deviceCapabilities.connectionType = connection.type;
      this.deviceCapabilities.effectiveType = connection.effectiveType;
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.enableCrisisPerformanceMode();
        this.optimizeForSlowConnection();
      }
    });
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }

  /**
   * Force crisis mode for testing or emergency activation
   */
  public forceCrisisMode(): void {
    this.deviceCapabilities.isInCrisisMode = true;
    this.performanceConfig.crisisMode = true;
    this.enableCrisisPerformanceMode();
    this.enableCrisisOnlyMode();
  }

  /**
   * Check if device is struggling with performance
   */
  public isDeviceStruggling(): boolean {
    return (
      this.metrics.timeToInteractive > 5000 ||
      this.metrics.firstContentfulPaint > 3000 ||
      this.metrics.memoryUsage > 100 ||
      this.deviceCapabilities.isVeryLowEnd
    );
  }

  /**
   * Get optimization recommendations for current device
   */
  public getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.deviceCapabilities.isVeryLowEnd) {
      recommendations.push('Enable crisis-only mode for essential features');
      recommendations.push('Disable all animations and transitions');
      recommendations.push('Use aggressive image compression');
    }

    if (this.deviceCapabilities.isLowEnd) {
      recommendations.push('Enable simplified UI mode');
      recommendations.push('Use lazy loading for all non-critical content');
      recommendations.push('Preload only crisis-essential resources');
    }

    if (this.deviceCapabilities.effectiveType === 'slow-2g') {
      recommendations.push('Enable offline crisis support');
      recommendations.push('Use minimal image quality');
      recommendations.push('Disable video autoplay');
    }

    if (this.metrics.memoryUsage > 80) {
      recommendations.push('Enable aggressive memory management');
      recommendations.push('Unload off-screen content');
      recommendations.push('Reduce component complexity');
    }

    return recommendations;
  }

  /**
   * Initializes all mobile performance optimizations
   */
  public initialize(): void {
    // Only run on client side
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      // Apply immediate optimizations
      this.optimizeTouchResponsiveness();
      this.implementMemoryOptimizations();
      this.preloadCrisisResources();
      this.monitorConnectionChanges();

      // Apply performance config to DOM
      document.body.classList.toggle('low-end-device', this.deviceCapabilities.isLowEnd);
      document.body.classList.toggle('very-low-end-device', this.deviceCapabilities.isVeryLowEnd);
      document.body.classList.toggle('slow-connection', 
        this.deviceCapabilities.effectiveType === 'slow-2g' || 
        this.deviceCapabilities.effectiveType === '2g'
      );
      document.body.classList.toggle('crisis-mode', this.deviceCapabilities.isInCrisisMode);

      // Store config for other components
      try {
        sessionStorage.setItem('performance_config', JSON.stringify(this.performanceConfig));
        sessionStorage.setItem('device_capabilities', JSON.stringify(this.deviceCapabilities));
      } catch {
        // Storage not available
      }

      this.isInitialized = true;

      // Report initialization metrics
      this.reportInitializationMetrics();

    } catch (error) {
      console.error('Mobile performance optimizer initialization failed:', error);
    }
  }

  /**
   * Report initialization metrics for monitoring
   */
  private reportInitializationMetrics(): void {
    const initMetrics = {
      deviceType: this.deviceCapabilities.isVeryLowEnd ? 'very-low-end' : 
                  this.deviceCapabilities.isLowEnd ? 'low-end' : 'standard',
      connectionType: this.deviceCapabilities.effectiveType,
      memoryGB: this.deviceCapabilities.memoryGB,
      coreCount: this.deviceCapabilities.coreCount,
      crisisMode: this.deviceCapabilities.isInCrisisMode,
      optimizationsApplied: this.getAppliedOptimizations(),
      timestamp: Date.now()
    };

    // Store metrics locally for analytics
    try {
      const metrics = JSON.parse(localStorage.getItem('alchm_optimization_metrics') || '[]');
      metrics.push(initMetrics);
      // Keep only last 10 entries
      localStorage.setItem('alchm_optimization_metrics', JSON.stringify(metrics.slice(-10)));
    } catch {
      // Storage not available
    }
  }

  /**
   * Get list of optimizations that were applied
   */
  private getAppliedOptimizations(): string[] {
    const applied: string[] = [];
    
    if (this.performanceConfig.crisisMode) applied.push('crisis-mode');
    if (this.performanceConfig.simplifiedUI) applied.push('simplified-ui');
    if (this.performanceConfig.largeTouchTargets) applied.push('large-touch-targets');
    if (this.performanceConfig.aggressiveLazyLoading) applied.push('aggressive-lazy-loading');
    if (this.performanceConfig.offlineCrisisSupport) applied.push('offline-crisis-support');
    if (this.performanceConfig.highContrastMode) applied.push('high-contrast');
    if (this.performanceConfig.reduceMotion) applied.push('reduce-motion');
    if (!this.performanceConfig.enableAnimations) applied.push('disable-animations');
    
    return applied;
  }

  /**
   * Gets current performance configuration
   */
  public getConfig(): PerformanceConfig {
    return { ...this.performanceConfig };
  }

  /**
   * Cleanup performance monitoring and resources
   */
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
      this.memoryMonitor = null;
    }

    this.isInitialized = false;
  }
}

// Initialize performance optimizer with enhanced singleton pattern
let _mobilePerformanceOptimizer: MobilePerformanceOptimizer | null = null;

/**
 * Get the mobile performance optimizer instance
 */
export function getMobilePerformanceOptimizer(): MobilePerformanceOptimizer {
  if (!_mobilePerformanceOptimizer && typeof window !== 'undefined') {
    _mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
  }
  return _mobilePerformanceOptimizer!;
}

/**
 * Initialize mobile performance optimizations
 */
export function initializeMobileOptimizations(): void {
  const optimizer = getMobilePerformanceOptimizer();
  optimizer?.initialize();
}

/**
 * Force crisis mode activation
 */
export function activateCrisisMode(): void {
  const optimizer = getMobilePerformanceOptimizer();
  optimizer?.forceCrisisMode();
}

/**
 * Check if device is struggling with performance
 */
export function isDeviceStruggling(): boolean {
  const optimizer = getMobilePerformanceOptimizer();
  return optimizer?.isDeviceStruggling() || false;
}

/**
 * React hook for mobile optimization
 */
export function useMobileOptimization() {
  const optimizer = getMobilePerformanceOptimizer();
  
  return {
    capabilities: optimizer?.getDeviceCapabilities(),
    config: optimizer?.getConfig(),
    metrics: optimizer?.getMetrics(),
    isStruggling: optimizer?.isDeviceStruggling(),
    recommendations: optimizer?.getOptimizationRecommendations(),
    activateCrisisMode: () => optimizer?.forceCrisisMode(),
    startCrisisDetectionTiming: () => optimizer?.startCrisisDetectionTiming(),
    endCrisisDetectionTiming: () => optimizer?.endCrisisDetectionTiming()
  };
}

// Legacy export for backward compatibility
export const mobilePerformanceOptimizer = {
  initialize: initializeMobileOptimizations,
  getConfig: () => getMobilePerformanceOptimizer()?.getConfig(),
  getCapabilities: () => getMobilePerformanceOptimizer()?.getDeviceCapabilities(),
  getMetrics: () => getMobilePerformanceOptimizer()?.getMetrics(),
  forceCrisisMode: activateCrisisMode,
  isDeviceStruggling: isDeviceStruggling,
  destroy: () => {
    if (_mobilePerformanceOptimizer) {
      _mobilePerformanceOptimizer.destroy();
      _mobilePerformanceOptimizer = null;
    }
  }
};

export default MobilePerformanceOptimizer;