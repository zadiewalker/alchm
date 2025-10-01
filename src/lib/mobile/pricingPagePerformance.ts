// Mobile Pricing Page Performance Optimizer
// Trauma-informed performance monitoring for users in crisis situations

export interface MobilePerformanceMetrics {
  connectionType: string;
  deviceMemory: number;
  isLowEndDevice: boolean;
  batteryLevel?: number;
  isCrisisMode: boolean;
  loadTime: number;
  interactionDelay: number;
}

export interface PerformanceOptimization {
  shouldReduceAnimations: boolean;
  shouldPreloadCritical: boolean;
  shouldDeferNonEssential: boolean;
  shouldShowOfflineNotice: boolean;
  shouldEnableCrisisMode: boolean;
}

export class MobilePricingPerformanceOptimizer {
  private static instance: MobilePricingPerformanceOptimizer | null = null;
  private metrics: Partial<MobilePerformanceMetrics> = {};
  private optimizations: PerformanceOptimization = {
    shouldReduceAnimations: false,
    shouldPreloadCritical: true,
    shouldDeferNonEssential: false,
    shouldShowOfflineNotice: false,
    shouldEnableCrisisMode: false
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  static getInstance(): MobilePricingPerformanceOptimizer {
    if (!this.instance) {
      this.instance = new MobilePricingPerformanceOptimizer();
    }
    return this.instance;
  }

  private initializeMonitoring(): void {
    console.log('📱 Initializing mobile pricing page performance monitoring...');
    
    this.detectDeviceCapabilities();
    this.monitorNetworkConditions();
    this.detectCrisisPatterns();
    this.optimizeForMobile();
  }

  private detectDeviceCapabilities(): void {
    // Device memory detection
    const memory = (navigator as any).deviceMemory || 4; // Default to 4GB
    this.metrics.deviceMemory = memory;
    this.metrics.isLowEndDevice = memory <= 2;

    // Battery level detection for crisis optimization
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.batteryLevel = battery.level;
        
        // Enable crisis mode for low battery (< 20%)
        if (battery.level < 0.2) {
          this.optimizations.shouldEnableCrisisMode = true;
          this.optimizations.shouldReduceAnimations = true;
          console.log('🔋 Low battery detected - enabling crisis optimization mode');
        }
      });
    }

    // Hardware concurrency for processing power
    const cores = navigator.hardwareConcurrency || 2;
    if (cores <= 2) {
      this.optimizations.shouldDeferNonEssential = true;
      console.log('🖥️ Low-end device detected - deferring non-essential features');
    }
  }

  private monitorNetworkConditions(): void {
    const connection = (navigator as any).connection;
    
    if (connection) {
      this.metrics.connectionType = connection.effectiveType;
      
      // Optimize for slow connections
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.optimizations.shouldShowOfflineNotice = true;
        this.optimizations.shouldReduceAnimations = true;
        this.optimizations.shouldDeferNonEssential = true;
        console.log('🐌 Slow connection detected - enabling data-saving mode');
      }
      
      if (connection.effectiveType === '3g') {
        this.optimizations.shouldDeferNonEssential = true;
        console.log('📶 3G connection detected - optimizing for limited bandwidth');
      }

      // Monitor for offline/online status
      window.addEventListener('online', () => {
        this.optimizations.shouldShowOfflineNotice = false;
        console.log('🌐 Connection restored');
      });

      window.addEventListener('offline', () => {
        this.optimizations.shouldShowOfflineNotice = true;
        this.optimizations.shouldEnableCrisisMode = true;
        console.log('📵 Offline detected - enabling crisis mode');
      });
    }
  }

  private detectCrisisPatterns(): void {
    let rapidInteractions = 0;
    let lastInteractionTime = Date.now();
    
    // Detect rapid, anxious interactions
    const handleInteraction = () => {
      const now = Date.now();
      const timeDiff = now - lastInteractionTime;
      
      if (timeDiff < 500) { // Less than 500ms between interactions
        rapidInteractions++;
        
        if (rapidInteractions > 8) {
          this.metrics.isCrisisMode = true;
          this.optimizations.shouldEnableCrisisMode = true;
          this.optimizations.shouldReduceAnimations = true;
          console.log('🚨 Crisis interaction pattern detected - enabling support mode');
          
          // Dispatch custom event for UI to respond
          window.dispatchEvent(new CustomEvent('crisisDetected', {
            detail: { reason: 'rapid-interactions', count: rapidInteractions }
          }));
        }
      } else {
        rapidInteractions = Math.max(0, rapidInteractions - 1);
      }
      
      lastInteractionTime = now;
    };

    // Monitor touch events for mobile
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('click', handleInteraction);
    
    // Reset crisis detection after 30 seconds of normal interaction
    setInterval(() => {
      if (rapidInteractions === 0 && this.metrics.isCrisisMode) {
        this.metrics.isCrisisMode = false;
        this.optimizations.shouldEnableCrisisMode = false;
        console.log('✅ Crisis mode reset - normal interaction resumed');
      }
    }, 30000);
  }

  private optimizeForMobile(): void {
    // Preload critical pricing page resources
    this.preloadCriticalResources();
    
    // Optimize images for mobile
    this.optimizeImages();
    
    // Setup intersection observer for lazy loading
    this.setupLazyLoading();
    
    // Monitor Core Web Vitals specifically for pricing page
    this.monitorPricingPageVitals();
  }

  private preloadCriticalResources(): void {
    if (!this.optimizations.shouldPreloadCritical) return;

    const criticalResources = [
      // Stripe payment processing script
      'https://js.stripe.com/v3/',
      // Essential fonts
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600',
      // Crisis support icons
      '/icons/crisis-support.svg'
    ];

    criticalResources.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.includes('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });

    console.log('⚡ Preloaded critical pricing page resources');
  }

  private optimizeImages(): void {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading optimization based on connection
      if (this.metrics.connectionType === '3g' || this.metrics.connectionType === 'slow-2g') {
        img.loading = 'lazy';
      }
      
      // Ensure proper dimensions to prevent layout shift
      if (!img.width || !img.height) {
        img.addEventListener('load', () => {
          if (img.naturalWidth && img.naturalHeight) {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;
          }
        });
      }
    });
  }

  private setupLazyLoading(): void {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Load non-essential content when in viewport
          if (element.hasAttribute('data-lazy-load')) {
            const content = element.getAttribute('data-lazy-content');
            if (content) {
              element.innerHTML = content;
              element.removeAttribute('data-lazy-load');
            }
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe FAQ sections and testimonials for lazy loading
    document.querySelectorAll('[data-lazy-load]').forEach(el => {
      observer.observe(el);
    });
  }

  private monitorPricingPageVitals(): void {
    // Monitor pricing-specific interactions
    const pricingButtons = document.querySelectorAll('[data-pricing-action]');
    
    pricingButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const startTime = performance.now();
        
        // Monitor how long it takes for payment flow to start
        const checkPaymentFlow = () => {
          const paymentModal = document.querySelector('[data-payment-modal]');
          if (paymentModal) {
            const loadTime = performance.now() - startTime;
            this.metrics.loadTime = loadTime;
            
            if (loadTime > 1000) {
              console.warn('⚠️ Slow payment flow detected:', loadTime + 'ms');
              
              // Trigger optimization for slow payment flows
              this.optimizePaymentFlow();
            }
          } else {
            setTimeout(checkPaymentFlow, 50);
          }
        };
        
        checkPaymentFlow();
      });
    });
  }

  private optimizePaymentFlow(): void {
    // Remove non-essential animations during payment
    const style = document.createElement('style');
    style.textContent = `
      .payment-modal *, .payment-modal *::before, .payment-modal *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('🚀 Payment flow optimized for performance');
  }

  // Public API methods
  public getOptimizations(): PerformanceOptimization {
    return { ...this.optimizations };
  }

  public getMetrics(): Partial<MobilePerformanceMetrics> {
    return { ...this.metrics };
  }

  public shouldShowCrisisSupport(): boolean {
    return this.optimizations.shouldEnableCrisisMode || 
           this.metrics.isCrisisMode || 
           this.optimizations.shouldShowOfflineNotice;
  }

  public shouldReduceMotion(): boolean {
    return this.optimizations.shouldReduceAnimations ||
           this.metrics.isLowEndDevice ||
           (this.metrics.batteryLevel !== undefined && this.metrics.batteryLevel < 0.2);
  }

  public shouldDeferNonEssentials(): boolean {
    return this.optimizations.shouldDeferNonEssential ||
           this.metrics.connectionType === '2g' ||
           this.metrics.connectionType === 'slow-2g';
  }

  public generatePerformanceReport(): string {
    let report = '📱 Mobile Pricing Performance Report\n';
    report += '=' .repeat(40) + '\n\n';
    
    // Device info
    report += `📱 Device: ${this.metrics.isLowEndDevice ? 'Low-end' : 'Standard'}\n`;
    report += `💾 Memory: ${this.metrics.deviceMemory}GB\n`;
    report += `🔋 Battery: ${this.metrics.batteryLevel ? Math.round(this.metrics.batteryLevel * 100) + '%' : 'Unknown'}\n`;
    report += `📶 Connection: ${this.metrics.connectionType || 'Unknown'}\n\n`;
    
    // Crisis detection
    report += `🚨 Crisis Mode: ${this.metrics.isCrisisMode ? 'Active' : 'Inactive'}\n`;
    report += `⚡ Optimizations: ${this.optimizations.shouldEnableCrisisMode ? 'Enabled' : 'Standard'}\n\n`;
    
    // Performance metrics
    if (this.metrics.loadTime) {
      report += `⏱️ Payment Flow Load Time: ${this.metrics.loadTime.toFixed(0)}ms\n`;
    }
    
    // Recommendations
    report += '💡 Recommendations:\n';
    if (this.shouldReduceMotion()) {
      report += '  • Reduced animations for better performance\n';
    }
    if (this.shouldDeferNonEssentials()) {
      report += '  • Deferred non-essential features for slow connection\n';
    }
    if (this.shouldShowCrisisSupport()) {
      report += '  • Enhanced crisis support visibility\n';
    }
    
    return report;
  }
}

// React hook for easy integration
export function useMobilePricingPerformance() {
  const optimizer = MobilePricingPerformanceOptimizer.getInstance();
  
  return {
    shouldShowCrisisSupport: optimizer.shouldShowCrisisSupport(),
    shouldReduceMotion: optimizer.shouldReduceMotion(),
    shouldDeferNonEssentials: optimizer.shouldDeferNonEssentials(),
    getOptimizations: () => optimizer.getOptimizations(),
    getMetrics: () => optimizer.getMetrics(),
    generateReport: () => optimizer.generatePerformanceReport()
  };
}

// Initialize on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MobilePricingPerformanceOptimizer.getInstance();
  });
}

export default MobilePricingPerformanceOptimizer;