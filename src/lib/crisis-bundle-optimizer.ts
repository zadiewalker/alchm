/**
 * ALCHM Crisis Bundle Optimizer
 * Emergency-grade bundle optimization for users in crisis
 * 
 * TARGET: <200KB total bundle for crisis resources
 * GOAL: Sub-3 second loading on 2G networks
 */

interface BundleMetrics {
  totalSize: number;
  jsSize: number;
  cssSize: number;
  imageSize: number;
  fontSize: number;
  requestCount: number;
  criticalResourcesSize: number;
}

interface OptimizationStrategy {
  lazyLoadNonCritical: boolean;
  preloadCriticalResources: boolean;
  inlineCriticalCSS: boolean;
  deferNonCriticalJS: boolean;
  compressImages: boolean;
  minimizeRequests: boolean;
  enableServiceWorker: boolean;
}

interface CrisisPage {
  path: string;
  priority: 'emergency' | 'critical' | 'high';
  maxBundleSize: number;
  requiredFeatures: string[];
  optionalFeatures: string[];
}

class CrisisBundleOptimizer {
  private static instance: CrisisBundleOptimizer;
  private bundleCache = new Map<string, any>();
  private criticalResourceCache = new Map<string, string>();
  private loadingQueue = new Set<string>();
  private maxConcurrentLoads = 3;

  // Crisis page definitions with strict budgets
  private crisisPages: CrisisPage[] = [
    {
      path: '/crisis',
      priority: 'emergency',
      maxBundleSize: 150 * 1024, // 150KB max
      requiredFeatures: ['crisis-hotlines', 'emergency-chat', 'safety-plan'],
      optionalFeatures: []
    },
    {
      path: '/emergency',
      priority: 'emergency', 
      maxBundleSize: 150 * 1024,
      requiredFeatures: ['911-link', 'crisis-resources', 'immediate-support'],
      optionalFeatures: []
    },
    {
      path: '/support',
      priority: 'critical',
      maxBundleSize: 200 * 1024, // 200KB max
      requiredFeatures: ['support-chat', 'resource-links', 'coping-tools'],
      optionalFeatures: ['community-links']
    },
    {
      path: '/journal',
      priority: 'high',
      maxBundleSize: 300 * 1024, // 300KB max
      requiredFeatures: ['text-editor', 'save-function', 'crisis-detection'],
      optionalFeatures: ['ai-suggestions', 'mood-tracking', 'analytics']
    }
  ];

  public static getInstance(): CrisisBundleOptimizer {
    if (!CrisisBundleOptimizer.instance) {
      CrisisBundleOptimizer.instance = new CrisisBundleOptimizer();
    }
    return CrisisBundleOptimizer.instance;
  }

  constructor() {
    this.initializeBundleOptimization();
    this.setupResourcePreloading();
    this.monitorBundlePerformance();
  }

  private initializeBundleOptimization(): void {
    const currentPage = this.getCurrentCrisisPage();
    if (currentPage) {
      this.optimizeForCrisisPage(currentPage);
    }

    // Monitor navigation for SPA optimization
    if ('navigation' in performance) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.handleNavigationOptimization();
          }
        });
      });
      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private getCurrentCrisisPage(): CrisisPage | null {
    const pathname = typeof window !== 'undefined' && window.location.pathname;
    return this.crisisPages.find(page => 
      pathname.startsWith(page.path) || pathname.includes(page.path)
    ) || null;
  }

  private optimizeForCrisisPage(page: CrisisPage): void {
    console.log(`🚨 Crisis optimization active for ${page.path} (${page.priority} priority)`);
    
    const strategy: OptimizationStrategy = {
      lazyLoadNonCritical: true,
      preloadCriticalResources: true,
      inlineCriticalCSS: page.priority === 'emergency',
      deferNonCriticalJS: true,
      compressImages: true,
      minimizeRequests: true,
      enableServiceWorker: page.priority !== 'emergency' // Skip SW for absolute emergency
    };

    this.applyOptimizationStrategy(strategy, page);
  }

  private applyOptimizationStrategy(strategy: OptimizationStrategy, page: CrisisPage): void {
    // 1. Preload critical resources
    if (strategy.preloadCriticalResources) {
      this.preloadCriticalResources(page.requiredFeatures);
    }

    // 2. Inline critical CSS for emergency pages
    if (strategy.inlineCriticalCSS) {
      this.inlineCriticalCSS();
    }

    // 3. Defer non-critical JavaScript
    if (strategy.deferNonCriticalJS) {
      this.deferNonCriticalJS(page.optionalFeatures);
    }

    // 4. Lazy load non-critical features
    if (strategy.lazyLoadNonCritical) {
      this.setupLazyLoading(page.optionalFeatures);
    }

    // 5. Compress and optimize images
    if (strategy.compressImages) {
      this.optimizeImages();
    }

    // 6. Enable service worker for caching (except emergency pages)
    if (strategy.enableServiceWorker) {
      this.enableCrisisServiceWorker();
    }
  }

  private preloadCriticalResources(requiredFeatures: string[]): void {
    const criticalResources = this.getCriticalResourcesForFeatures(requiredFeatures);
    
    criticalResources.forEach(resource => {
      if (!this.loadingQueue.has(resource.url) && this.loadingQueue.size < this.maxConcurrentLoads) {
        this.preloadResource(resource);
      }
    });
  }

  private getCriticalResourcesForFeatures(features: string[]): Array<{url: string, type: string, priority: number}> {
    const resourceMap: Record<string, Array<{url: string, type: string, priority: number}>> = {
      'crisis-hotlines': [
        { url: '/crisis-resources.json', type: 'fetch', priority: 1 },
        { url: '/css/crisis-minimal.css', type: 'style', priority: 1 }
      ],
      'emergency-chat': [
        { url: '/js/crisis-chat.min.js', type: 'script', priority: 1 },
        { url: '/css/chat-minimal.css', type: 'style', priority: 2 }
      ],
      'safety-plan': [
        { url: '/js/safety-plan.min.js', type: 'script', priority: 2 },
        { url: '/templates/safety-plan.html', type: 'fetch', priority: 3 }
      ],
      'text-editor': [
        { url: '/js/editor-minimal.min.js', type: 'script', priority: 1 },
        { url: '/css/editor-minimal.css', type: 'style', priority: 1 }
      ],
      'crisis-detection': [
        { url: '/js/crisis-detection.min.js', type: 'script', priority: 1 }
      ]
    };

    return features.flatMap(feature => resourceMap[feature] || [])
                  .sort((a, b) => a.priority - b.priority);
  }

  private preloadResource(resource: {url: string, type: string, priority: number}): void {
    this.loadingQueue.add(resource.url);

    const link = typeof window !== 'undefined' && document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    
    switch (resource.type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'fetch':
        link.as = 'fetch';
        link.setAttribute('crossorigin', 'anonymous');
        break;
    }

    // Add priority hint for critical resources
    if (resource.priority === 1) {
      link.setAttribute('importance', 'high');
    }

    link.onload = () => {
      this.loadingQueue.delete(resource.url);
      console.log(`✅ Preloaded critical resource: ${resource.url}`);
    };

    link.onerror = () => {
      this.loadingQueue.delete(resource.url);
      console.error(`❌ Failed to preload: ${resource.url}`);
    };

    typeof window !== 'undefined' && document.head.appendChild(link);
  }

  private inlineCriticalCSS(): void {
    // Inline only the most critical CSS for emergency pages
    const criticalCSS = `
      .crisis-emergency { display: block !important; }
      .crisis-button { 
        background: #dc2626; 
        color: white; 
        padding: 1rem 2rem; 
        border-radius: 0.5rem; 
        font-size: 1.125rem; 
        font-weight: 600; 
        border: none; 
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .crisis-button:hover { background: #b91c1c; }
      .crisis-container { 
        max-width: 42rem; 
        margin: 0 auto; 
        padding: 1rem; 
      }
      .crisis-header { 
        font-size: 1.5rem; 
        font-weight: 700; 
        margin-bottom: 1rem; 
        color: #1f2937; 
      }
      .crisis-text { 
        font-size: 1rem; 
        line-height: 1.5; 
        color: #374151; 
        margin-bottom: 1rem; 
      }
      .crisis-hidden { display: none !important; }
    `;

    const style = typeof window !== 'undefined' && document.createElement('style');
    style.textContent = criticalCSS;
    typeof window !== 'undefined' && document.head.insertBefore(style, typeof window !== 'undefined' && document.head.firstChild);
  }

  private deferNonCriticalJS(optionalFeatures: string[]): void {
    // Find and defer non-critical JavaScript
    const scripts = typeof window !== 'undefined' && document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      
      // Check if script is for optional features
      const isOptional = optionalFeatures.some(feature => 
        src.includes(feature) || this.isNonCriticalScript(src)
      );

      if (isOptional) {
        script.setAttribute('defer', '');
        script.setAttribute('data-deferred', 'true');
      }
    });
  }

  private isNonCriticalScript(src: string): boolean {
    const nonCriticalPatterns = [
      'analytics',
      'tracking',
      'social',
      'ads',
      'marketing',
      'charts',
      'animations',
      'tooltip',
      'popover'
    ];

    return nonCriticalPatterns.some(pattern => src.includes(pattern));
  }

  private setupLazyLoading(optionalFeatures: string[]): void {
    // Lazy load non-critical components
    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadLazyComponent(entry.target as HTMLElement);
          lazyLoadObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px' // Load 100px before entering viewport
    });

    // Find elements to lazy load
    typeof window !== 'undefined' && document.querySelectorAll('[data-lazy-feature]').forEach(element => {
      const feature = element.getAttribute('data-lazy-feature');
      if (optionalFeatures.includes(feature || '')) {
        lazyLoadObserver.observe(element);
      }
    });
  }

  private loadLazyComponent(element: HTMLElement): void {
    const feature = element.getAttribute('data-lazy-feature');
    const src = element.getAttribute('data-lazy-src');
    
    if (src && feature) {
      this.loadComponentScript(src, feature)
        .then(() => {
          element.classList.remove('lazy-loading');
          element.classList.add('lazy-loaded');
          console.log(`📦 Lazy loaded feature: ${feature}`);
        })
        .catch(error => {
          console.error(`❌ Failed to lazy load ${feature}:`, error);
        });
    }
  }

  private async loadComponentScript(src: string, feature: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.bundleCache.has(src)) {
        resolve(this.bundleCache.get(src));
        return;
      }

      const script = typeof window !== 'undefined' && document.createElement('script');
      script.src = src;
      script.async = true;
      
      script.onload = () => {
        this.bundleCache.set(src, true);
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load ${src}`));
      };
      
      typeof window !== 'undefined' && document.head.appendChild(script);
    });
  }

  private optimizeImages(): void {
    const images = typeof window !== 'undefined' && document.querySelectorAll('img[data-crisis-optimize]');
    
    images.forEach(img => {
      const element = img as HTMLImageElement;
      const originalSrc = element.src;
      
      // Use WebP if supported, fall back to optimized JPEG
      if (this.supportsWebP()) {
        element.src = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      } else {
        // Use optimized JPEG version
        element.src = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.opt.jpg');
      }
      
      // Add loading attributes
      element.loading = 'lazy';
      element.decoding = 'async';
    });
  }

  private supportsWebP(): boolean {
    const canvas = typeof window !== 'undefined' && document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private enableCrisisServiceWorker(): void {
    if ('serviceWorker' in typeof window !== 'undefined' && navigator) {
      typeof window !== 'undefined' && navigator.serviceWorker.register('/crisis-sw.js', {
        scope: '/',
        updateViaCache: 'none'
      }).then(registration => {
        console.log('✅ Crisis service worker registered');
        
        // Update service worker immediately if needed
        registration.update();
      }).catch(error => {
        console.error('❌ Crisis service worker registration failed:', error);
      });
    }
  }

  private handleNavigationOptimization(): void {
    // Clean up previous page resources
    this.cleanupPreviousPageResources();
    
    // Optimize for new page
    const currentPage = this.getCurrentCrisisPage();
    if (currentPage) {
      // Use requestIdleCallback for non-blocking optimization
      if ('requestIdleCallback' in typeof window !== 'undefined' && window) {
        requestIdleCallback(() => {
          this.optimizeForCrisisPage(currentPage);
        });
      } else {
        setTimeout(() => {
          this.optimizeForCrisisPage(currentPage);
        }, 0);
      }
    }
  }

  private cleanupPreviousPageResources(): void {
    // Remove deferred scripts that are no longer needed
    typeof window !== 'undefined' && document.querySelectorAll('script[data-deferred="true"]').forEach(script => {
      if (!this.isScriptNeededForCurrentPage(script as HTMLScriptElement)) {
        script.remove();
      }
    });

    // Clear component cache for memory management
    if (this.bundleCache.size > 20) { // Keep last 20 cached resources
      const entries = Array.from(this.bundleCache.entries());
      entries.slice(0, entries.length - 20).forEach(([key]) => {
        this.bundleCache.delete(key);
      });
    }
  }

  private isScriptNeededForCurrentPage(script: HTMLScriptElement): boolean {
    const currentPage = this.getCurrentCrisisPage();
    if (!currentPage) return false;

    const src = script.src;
    return currentPage.requiredFeatures.some(feature => src.includes(feature));
  }

  private monitorBundlePerformance(): void {
    // Monitor bundle size and performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this.trackResourceLoad(entry as PerformanceResourceTiming);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    // Report bundle metrics every 30 seconds
    setInterval(() => {
      this.reportBundleMetrics();
    }, 30000);
  }

  private trackResourceLoad(entry: PerformanceResourceTiming): void {
    // Track only our application resources
    if (!entry.name.includes(typeof window !== 'undefined' && window.location.origin)) return;

    const metrics = this.calculateBundleMetrics();
    const currentPage = this.getCurrentCrisisPage();
    
    if (currentPage && metrics.totalSize > currentPage.maxBundleSize) {
      console.warn(`🚨 Bundle size exceeded for ${currentPage.path}: ${metrics.totalSize} > ${currentPage.maxBundleSize}`);
      this.triggerEmergencyOptimization();
    }
  }

  private calculateBundleMetrics(): BundleMetrics {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imageSize = 0;
    let fontSize = 0;
    let requestCount = 0;
    let criticalResourcesSize = 0;

    resources.forEach(resource => {
      if (!resource.name.includes(typeof window !== 'undefined' && window.location.origin)) return;
      
      const size = resource.transferSize || resource.encodedBodySize || 0;
      totalSize += size;
      requestCount++;

      // Categorize by resource type
      if (resource.name.endsWith('.js')) {
        jsSize += size;
      } else if (resource.name.endsWith('.css')) {
        cssSize += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
        imageSize += size;
      } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/i)) {
        fontSize += size;
      }

      // Check if it's a critical resource
      if (this.isCriticalResource(resource.name)) {
        criticalResourcesSize += size;
      }
    });

    return {
      totalSize,
      jsSize,
      cssSize,
      imageSize,
      fontSize,
      requestCount,
      criticalResourcesSize
    };
  }

  private isCriticalResource(url: string): boolean {
    const criticalPatterns = [
      'crisis',
      'emergency',
      'safety',
      'support',
      'hotline',
      'critical.css',
      'main.js'
    ];

    return criticalPatterns.some(pattern => url.includes(pattern));
  }

  private triggerEmergencyOptimization(): void {
    console.log('🚨 Triggering emergency bundle optimization');
    
    // Remove all non-critical resources immediately
    typeof window !== 'undefined' && document.querySelectorAll('script[data-deferred="true"]').forEach(script => {
      script.remove();
    });

    // Hide all non-critical elements
    typeof window !== 'undefined' && document.querySelectorAll('[data-non-critical]').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    // Disable all optional features
    typeof window !== 'undefined' && document.querySelectorAll('[data-lazy-feature]').forEach(element => {
      (element as HTMLElement).classList.add('crisis-hidden');
    });

    // Reduce image quality
    this.reduceImageQuality();
  }

  private reduceImageQuality(): void {
    typeof window !== 'undefined' && document.querySelectorAll('img').forEach(img => {
      const element = img as HTMLImageElement;
      if (element.src && !element.src.includes('.low.')) {
        // Switch to low-quality version if available
        element.src = element.src.replace(/\.(jpg|jpeg|png)$/i, '.low.$1');
      }
    });
  }

  private async reportBundleMetrics(): Promise<void> {
    const metrics = this.calculateBundleMetrics();
    const currentPage = this.getCurrentCrisisPage();
    
    try {
      await fetch('/api/monitoring/bundle-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          url: typeof window !== 'undefined' && window.location.href,
          page: currentPage?.path || 'unknown',
          priority: currentPage?.priority || 'low',
          metrics,
          exceedsBudget: currentPage ? metrics.totalSize > currentPage.maxBundleSize : false
        })
      });
    } catch (error) {
      console.warn('Failed to report bundle metrics:', error);
    }
  }

  public getBundleMetrics(): BundleMetrics {
    return this.calculateBundleMetrics();
  }

  public getCurrentPageBudget(): number {
    const currentPage = this.getCurrentCrisisPage();
    return currentPage?.maxBundleSize || 500 * 1024; // Default 500KB
  }

  public isBudgetExceeded(): boolean {
    const metrics = this.calculateBundleMetrics();
    const budget = this.getCurrentPageBudget();
    return metrics.totalSize > budget;
  }
}

// React hook for bundle optimization
export const useCrisisBundleOptimization = () => {
  const optimizer = CrisisBundleOptimizer.getInstance();

  return {
    getBundleMetrics: () => optimizer.getBundleMetrics(),
    getCurrentPageBudget: () => optimizer.getCurrentPageBudget(),
    isBudgetExceeded: () => optimizer.isBudgetExceeded()
  };
};

// Initialize crisis bundle optimization
export const initializeCrisisBundleOptimization = () => {
  return CrisisBundleOptimizer.getInstance();
};

export default CrisisBundleOptimizer;