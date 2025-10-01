'use client';

/**
 * ALCHM Crisis Core Web Vitals Optimizer
 * Emergency-grade performance optimization for life-critical scenarios
 * 
 * TARGETS (Crisis Users):
 * - LCP: <1.2s (vs 2.5s standard)
 * - FID: <50ms (vs 100ms standard) 
 * - CLS: <0.05 (vs 0.1 standard)
 * - FCP: <800ms for immediate feedback
 * - TTI: <2s for immediate interactivity
 */

interface CoreWebVitalsTargets {
  LCP: number;  // Largest Contentful Paint
  FID: number;  // First Input Delay
  CLS: number;  // Cumulative Layout Shift
  FCP: number;  // First Contentful Paint
  TTI: number;  // Time to Interactive
  TTFB: number; // Time to First Byte
}

interface VitalsMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  tti: number | null;
  ttfb: number | null;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  isCrisisSafe: boolean;
}

interface OptimizationTechnique {
  name: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  implementation: () => Promise<void>;
  impact: number; // Expected improvement in ms
  riskLevel: 'none' | 'low' | 'medium' | 'high';
}

class CrisisCoreWebVitalsOptimizer {
  private static instance: CrisisCoreWebVitalsOptimizer;
  private vitalsTargets: CoreWebVitalsTargets;
  private currentMetrics: VitalsMetrics;
  private observers: PerformanceObserver[] = [];
  private optimizationQueue: OptimizationTechnique[] = [];
  private isOptimizing = false;

  // Ultra-strict targets for crisis users
  private readonly CRISIS_TARGETS: CoreWebVitalsTargets = {
    LCP: 1200,  // 1.2s
    FID: 50,    // 50ms
    CLS: 0.05,  // 0.05
    FCP: 800,   // 800ms
    TTI: 2000,  // 2s
    TTFB: 200   // 200ms
  };

  // Standard targets for comparison
  private readonly STANDARD_TARGETS: CoreWebVitalsTargets = {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1200,
    TTI: 3800,
    TTFB: 600
  };

  public static getInstance(): CrisisCoreWebVitalsOptimizer {
    if (!CrisisCoreWebVitalsOptimizer.instance) {
      CrisisCoreWebVitalsOptimizer.instance = new CrisisCoreWebVitalsOptimizer();
    }
    return CrisisCoreWebVitalsOptimizer.instance;
  }

  constructor() {
    this.vitalsTargets = this.isCrisisContext() ? this.CRISIS_TARGETS : this.STANDARD_TARGETS;
    this.currentMetrics = this.initializeMetrics();
    this.initializeVitalsMonitoring();
    this.setupOptimizationTechniques();
    this.startContinuousOptimization();
  }

  private isCrisisContext(): boolean {
    const pathname = typeof window !== 'undefined' && window.location.pathname;
    const crisisPaths = ['/crisis', '/emergency', '/support', '/hotline'];
    const hasUrgentParams = typeof window !== 'undefined' && window.location.search.includes('urgent=true');
    
    return crisisPaths.some(path => pathname.includes(path)) || hasUrgentParams;
  }

  private initializeMetrics(): VitalsMetrics {
    return {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      tti: null,
      ttfb: null,
      score: 0,
      grade: 'F',
      isCrisisSafe: false
    };
  }

  private initializeVitalsMonitoring(): void {
    this.setupLCPMonitoring();
    this.setupFIDMonitoring();
    this.setupCLSMonitoring();
    this.setupFCPMonitoring();
    this.setupTTIMonitoring();
    this.setupTTFBMonitoring();

    // Real-time optimization triggers
    setInterval(() => {
      this.evaluateAndOptimize();
    }, 2000); // Check every 2 seconds for crisis scenarios
  }

  private setupLCPMonitoring(): void {
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.currentMetrics.lcp = lastEntry.startTime;
        
        // Immediate intervention if LCP is too slow
        if (lastEntry.startTime > this.vitalsTargets.LCP) {
          this.triggerEmergencyLCPOptimization();
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private setupFIDMonitoring(): void {
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          this.currentMetrics.fid = fid;
          
          // Immediate intervention if FID is too slow
          if (fid > this.vitalsTargets.FID) {
            this.triggerEmergencyFIDOptimization();
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  private setupCLSMonitoring(): void {
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.currentMetrics.cls = clsValue;
        
        // Immediate intervention if CLS is too high
        if (clsValue > this.vitalsTargets.CLS) {
          this.triggerEmergencyCLSOptimization();
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  private setupFCPMonitoring(): void {
    if ('PerformanceObserver' in typeof window !== 'undefined' && window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.currentMetrics.fcp = entry.startTime;
            
            if (entry.startTime > this.vitalsTargets.FCP) {
              this.triggerEmergencyFCPOptimization();
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  private setupTTIMonitoring(): void {
    // TTI approximation using navigation timing
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const tti = navigationEntry.domInteractive - navigationEntry.navigationStart;
      this.currentMetrics.tti = tti;
      
      if (tti > this.vitalsTargets.TTI) {
        this.triggerEmergencyTTIOptimization();
      }
    }
  }

  private setupTTFBMonitoring(): void {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      this.currentMetrics.ttfb = ttfb;
      
      if (ttfb > this.vitalsTargets.TTFB) {
        this.triggerEmergencyTTFBOptimization();
      }
    }
  }

  private setupOptimizationTechniques(): void {
    this.optimizationQueue = [
      // Critical LCP Optimizations
      {
        name: 'Inline Critical CSS',
        priority: 'critical',
        implementation: this.inlineCriticalCSS.bind(this),
        impact: 400,
        riskLevel: 'none'
      },
      {
        name: 'Preload Critical Resources',
        priority: 'critical', 
        implementation: this.preloadCriticalResources.bind(this),
        impact: 300,
        riskLevel: 'none'
      },
      {
        name: 'Eliminate Render Blocking',
        priority: 'critical',
        implementation: this.eliminateRenderBlocking.bind(this),
        impact: 500,
        riskLevel: 'low'
      },

      // Critical FID Optimizations
      {
        name: 'Defer Heavy JavaScript',
        priority: 'critical',
        implementation: this.deferHeavyJavaScript.bind(this),
        impact: 200,
        riskLevel: 'low'
      },
      {
        name: 'Minimize Main Thread Work',
        priority: 'high',
        implementation: this.minimizeMainThreadWork.bind(this),
        impact: 150,
        riskLevel: 'medium'
      },

      // Critical CLS Optimizations
      {
        name: 'Fix Layout Shifts',
        priority: 'critical',
        implementation: this.fixLayoutShifts.bind(this),
        impact: 100,
        riskLevel: 'none'
      },
      {
        name: 'Reserve Space for Dynamic Content',
        priority: 'high',
        implementation: this.reserveSpaceForDynamicContent.bind(this),
        impact: 80,
        riskLevel: 'none'
      },

      // FCP Optimizations
      {
        name: 'Optimize Critical Path',
        priority: 'high',
        implementation: this.optimizeCriticalPath.bind(this),
        impact: 250,
        riskLevel: 'low'
      },

      // TTI Optimizations
      {
        name: 'Code Split Non-Critical',
        priority: 'medium',
        implementation: this.codeSplitNonCritical.bind(this),
        impact: 400,
        riskLevel: 'medium'
      }
    ];

    // Sort by priority and impact
    this.optimizationQueue.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      return b.impact - a.impact;
    });
  }

  private async startContinuousOptimization(): Promise<void> {
    // For crisis contexts, start optimization immediately
    if (this.isCrisisContext()) {
      await this.runEmergencyOptimizations();
    }

    // Continue monitoring and optimizing
    setInterval(() => {
      if (!this.isOptimizing && this.shouldOptimize()) {
        this.runNextOptimization();
      }
    }, 1000);
  }

  private async runEmergencyOptimizations(): Promise<void> {
    console.log('🚨 Running emergency Core Web Vitals optimizations');
    
    const criticalOptimizations = this.optimizationQueue
      .filter(opt => opt.priority === 'critical' && opt.riskLevel !== 'high');

    for (const optimization of criticalOptimizations) {
      try {
        await optimization.implementation();
        console.log(`✅ Emergency optimization completed: ${optimization.name}`);
      } catch (error) {
        console.error(`❌ Emergency optimization failed: ${optimization.name}`, error);
      }
    }
  }

  private shouldOptimize(): boolean {
    return !this.currentMetrics.isCrisisSafe || this.currentMetrics.score < 80;
  }

  private async runNextOptimization(): Promise<void> {
    if (this.optimizationQueue.length === 0) return;

    this.isOptimizing = true;
    const optimization = this.optimizationQueue.shift()!;

    try {
      console.log(`🔧 Running optimization: ${optimization.name}`);
      await optimization.implementation();
      console.log(`✅ Optimization completed: ${optimization.name}`);
    } catch (error) {
      console.error(`❌ Optimization failed: ${optimization.name}`, error);
    } finally {
      this.isOptimizing = false;
    }
  }

  private async evaluateAndOptimize(): Promise<void> {
    this.calculateOverallScore();
    
    // Trigger specific optimizations based on failing metrics
    if (this.currentMetrics.lcp && this.currentMetrics.lcp > this.vitalsTargets.LCP) {
      this.prioritizeLCPOptimizations();
    }
    
    if (this.currentMetrics.fid && this.currentMetrics.fid > this.vitalsTargets.FID) {
      this.prioritizeFIDOptimizations();
    }
    
    if (this.currentMetrics.cls && this.currentMetrics.cls > this.vitalsTargets.CLS) {
      this.prioritizeCLSOptimizations();
    }
  }

  private calculateOverallScore(): void {
    let score = 100;
    let failedTargets = 0;

    // LCP scoring
    if (this.currentMetrics.lcp) {
      if (this.currentMetrics.lcp > this.vitalsTargets.LCP * 2) {
        score -= 30;
        failedTargets++;
      } else if (this.currentMetrics.lcp > this.vitalsTargets.LCP) {
        score -= 15;
      }
    }

    // FID scoring
    if (this.currentMetrics.fid) {
      if (this.currentMetrics.fid > this.vitalsTargets.FID * 2) {
        score -= 30;
        failedTargets++;
      } else if (this.currentMetrics.fid > this.vitalsTargets.FID) {
        score -= 15;
      }
    }

    // CLS scoring
    if (this.currentMetrics.cls) {
      if (this.currentMetrics.cls > this.vitalsTargets.CLS * 2) {
        score -= 30;
        failedTargets++;
      } else if (this.currentMetrics.cls > this.vitalsTargets.CLS) {
        score -= 15;
      }
    }

    // FCP scoring
    if (this.currentMetrics.fcp) {
      if (this.currentMetrics.fcp > this.vitalsTargets.FCP) {
        score -= 10;
      }
    }

    // TTI scoring
    if (this.currentMetrics.tti) {
      if (this.currentMetrics.tti > this.vitalsTargets.TTI) {
        score -= 10;
      }
    }

    this.currentMetrics.score = Math.max(0, score);
    this.currentMetrics.grade = this.scoreToGrade(this.currentMetrics.score);
    this.currentMetrics.isCrisisSafe = failedTargets === 0 && this.currentMetrics.score >= 90;
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  // Emergency Optimization Implementations

  private async triggerEmergencyLCPOptimization(): Promise<void> {
    console.log('🚨 Emergency LCP optimization triggered');
    await this.inlineCriticalCSS();
    await this.preloadCriticalResources();
    await this.eliminateRenderBlocking();
  }

  private async triggerEmergencyFIDOptimization(): Promise<void> {
    console.log('🚨 Emergency FID optimization triggered');
    await this.deferHeavyJavaScript();
    await this.minimizeMainThreadWork();
  }

  private async triggerEmergencyCLSOptimization(): Promise<void> {
    console.log('🚨 Emergency CLS optimization triggered');
    await this.fixLayoutShifts();
    await this.reserveSpaceForDynamicContent();
  }

  private async triggerEmergencyFCPOptimization(): Promise<void> {
    console.log('🚨 Emergency FCP optimization triggered');
    await this.optimizeCriticalPath();
    await this.inlineCriticalCSS();
  }

  private async triggerEmergencyTTIOptimization(): Promise<void> {
    console.log('🚨 Emergency TTI optimization triggered');
    await this.codeSplitNonCritical();
    await this.deferHeavyJavaScript();
  }

  private async triggerEmergencyTTFBOptimization(): Promise<void> {
    console.log('🚨 Emergency TTFB optimization triggered');
    // TTFB is primarily server-side, but we can help with caching
    await this.enableAggressiveCaching();
  }

  // Specific Optimization Implementations

  private async inlineCriticalCSS(): Promise<void> {
    const criticalCSS = `
      .crisis-container { max-width: 42rem; margin: 0 auto; padding: 1rem; }
      .crisis-button { 
        background: #dc2626; color: white; padding: 1rem 2rem; 
        border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; 
        border: none; cursor: pointer; display: inline-block;
        text-decoration: none; text-align: center;
      }
      .crisis-button:hover { background: #b91c1c; }
      .crisis-header { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
      .crisis-text { font-size: 1rem; line-height: 1.5; margin-bottom: 1rem; }
      .loading-placeholder { background: #f3f4f6; min-height: 3rem; border-radius: 0.375rem; }
    `;

    const style = typeof window !== 'undefined' && document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    typeof window !== 'undefined' && document.head.insertBefore(style, typeof window !== 'undefined' && document.head.firstChild);
  }

  private async preloadCriticalResources(): Promise<void> {
    const criticalResources = [
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/critical.js', as: 'script' },
      { href: '/crisis-resources.json', as: 'fetch' }
    ];

    criticalResources.forEach(resource => {
      const link = typeof window !== 'undefined' && document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'fetch') {
        link.setAttribute('crossorigin', 'anonymous');
      }
      typeof window !== 'undefined' && document.head.appendChild(link);
    });
  }

  private async eliminateRenderBlocking(): Promise<void> {
    // Move non-critical CSS to load asynchronously
    const stylesheets = typeof window !== 'undefined' && document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(link => {
      const href = (link as HTMLLinkElement).href;
      if (!href.includes('critical') && !href.includes('crisis')) {
        link.setAttribute('media', 'print');
        link.setAttribute('onload', 'this.media="all"');
      }
    });

    // Defer non-critical scripts
    const scripts = typeof window !== 'undefined' && document.querySelectorAll('script[src]');
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (!src.includes('critical') && !src.includes('crisis')) {
        script.setAttribute('defer', '');
      }
    });
  }

  private async deferHeavyJavaScript(): Promise<void> {
    // Move heavy JavaScript to load after critical path
    const heavyScriptPatterns = ['analytics', 'tracking', 'charts', 'animations'];
    
    typeof window !== 'undefined' && document.querySelectorAll('script[src]').forEach(script => {
      const src = (script as HTMLScriptElement).src;
      if (heavyScriptPatterns.some(pattern => src.includes(pattern))) {
        script.setAttribute('defer', '');
        script.setAttribute('data-heavy', 'true');
      }
    });
  }

  private async minimizeMainThreadWork(): Promise<void> {
    // Use requestIdleCallback for non-critical work
    if ('requestIdleCallback' in typeof window !== 'undefined' && window) {
      const deferredTasks = typeof window !== 'undefined' && document.querySelectorAll('[data-defer-until-idle]');
      deferredTasks.forEach(element => {
        requestIdleCallback(() => {
          (element as HTMLElement).style.display = 'block';
        });
      });
    }
  }

  private async fixLayoutShifts(): Promise<void> {
    // Add dimensions to images without them
    typeof window !== 'undefined' && document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
        img.style.aspectRatio = '16/9'; // Default aspect ratio
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    });

    // Reserve space for dynamic content
    typeof window !== 'undefined' && document.querySelectorAll('[data-dynamic-content]').forEach(element => {
      if (!(element as HTMLElement).style.minHeight) {
        (element as HTMLElement).style.minHeight = '3rem';
      }
    });
  }

  private async reserveSpaceForDynamicContent(): Promise<void> {
    // Add placeholders for content that loads dynamically
    typeof window !== 'undefined' && document.querySelectorAll('[data-async-content]').forEach(element => {
      if (!element.querySelector('.loading-placeholder')) {
        const placeholder = typeof window !== 'undefined' && document.createElement('div');
        placeholder.className = 'loading-placeholder';
        placeholder.setAttribute('aria-hidden', 'true');
        element.appendChild(placeholder);
      }
    });
  }

  private async optimizeCriticalPath(): Promise<void> {
    // Remove non-critical elements from initial render
    typeof window !== 'undefined' && document.querySelectorAll('[data-non-critical]').forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    // Show critical elements immediately
    typeof window !== 'undefined' && document.querySelectorAll('[data-critical]').forEach(element => {
      (element as HTMLElement).style.display = 'block';
    });
  }

  private async codeSplitNonCritical(): Promise<void> {
    // Dynamically import non-critical modules
    const nonCriticalModules = typeof window !== 'undefined' && document.querySelectorAll('[data-module]');
    nonCriticalModules.forEach(element => {
      const moduleName = element.getAttribute('data-module');
      if (moduleName && !moduleName.includes('critical')) {
        // Lazy load the module
        if ('requestIdleCallback' in typeof window !== 'undefined' && window) {
          requestIdleCallback(async () => {
            try {
              await import(`/js/modules/${moduleName}.js`);
            } catch (error) {
              console.warn(`Failed to load module: ${moduleName}`, error);
            }
          });
        }
      }
    });
  }

  private async enableAggressiveCaching(): Promise<void> {
    // Set aggressive cache headers for static resources
    if ('serviceWorker' in typeof window !== 'undefined' && navigator && typeof window !== 'undefined' && navigator.serviceWorker.controller) {
      try {
        await typeof window !== 'undefined' && navigator.serviceWorker.controller.postMessage({
          type: 'ENABLE_AGGRESSIVE_CACHING',
          timestamp: Date.now()
        });
      } catch (error) {
        console.warn('Failed to enable aggressive caching:', error);
      }
    }
  }

  private prioritizeLCPOptimizations(): void {
    const lcpOptimizations = this.optimizationQueue.filter(opt => 
      opt.name.includes('CSS') || opt.name.includes('Preload') || opt.name.includes('Render')
    );
    
    lcpOptimizations.forEach(opt => opt.priority = 'critical');
  }

  private prioritizeFIDOptimizations(): void {
    const fidOptimizations = this.optimizationQueue.filter(opt => 
      opt.name.includes('JavaScript') || opt.name.includes('Thread')
    );
    
    fidOptimizations.forEach(opt => opt.priority = 'critical');
  }

  private prioritizeCLSOptimizations(): void {
    const clsOptimizations = this.optimizationQueue.filter(opt => 
      opt.name.includes('Layout') || opt.name.includes('Space')
    );
    
    clsOptimizations.forEach(opt => opt.priority = 'critical');
  }

  // Public API

  public getCurrentMetrics(): VitalsMetrics {
    return { ...this.currentMetrics };
  }

  public getTargets(): CoreWebVitalsTargets {
    return { ...this.vitalsTargets };
  }

  public async forceOptimization(): Promise<void> {
    await this.runEmergencyOptimizations();
  }

  public isCrisisSafe(): boolean {
    return this.currentMetrics.isCrisisSafe;
  }

  public async reportMetrics(): Promise<void> {
    try {
      await fetch('/api/monitoring/core-web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: Date.now(),
          url: typeof window !== 'undefined' && window.location.href,
          metrics: this.currentMetrics,
          targets: this.vitalsTargets,
          context: this.isCrisisContext() ? 'crisis' : 'standard'
        })
      });
    } catch (error) {
      console.warn('Failed to report Core Web Vitals:', error);
    }
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for Core Web Vitals optimization
export const useCrisisCoreWebVitalsOptimization = () => {
  const optimizer = CrisisCoreWebVitalsOptimizer.getInstance();

  React.useEffect(() => {
    return () => {
      optimizer.cleanup();
    };
  }, [optimizer]);

  return {
    getCurrentMetrics: () => optimizer.getCurrentMetrics(),
    getTargets: () => optimizer.getTargets(),
    forceOptimization: () => optimizer.forceOptimization(),
    isCrisisSafe: () => optimizer.isCrisisSafe(),
    reportMetrics: () => optimizer.reportMetrics()
  };
};

// Initialize crisis Core Web Vitals optimization
export const initializeCrisisCoreWebVitalsOptimization = () => {
  return CrisisCoreWebVitalsOptimizer.getInstance();
};

export default CrisisCoreWebVitalsOptimizer;