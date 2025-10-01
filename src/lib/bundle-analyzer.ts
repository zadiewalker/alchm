/**
 * Bundle Analysis and Optimization for ALCHM
 * Crisis-critical bundle size monitoring and optimization
 */

// Bundle size thresholds (trauma-informed - must be fast on slow networks)
export const BUNDLE_THRESHOLDS = {
  // Crisis-critical pages (must load fast for users in crisis)
  CRISIS_PAGES: {
    TOTAL_JS: 50 * 1024, // 50KB max for crisis resources
    MAIN_CHUNK: 25 * 1024, // 25KB max for main chunk
    CSS: 10 * 1024 // 10KB max for critical CSS
  },
  
  // Core user journey pages
  CORE_PAGES: {
    TOTAL_JS: 100 * 1024, // 100KB max for journal/auth pages
    MAIN_CHUNK: 60 * 1024, // 60KB max for main chunk
    CSS: 20 * 1024 // 20KB max for total CSS
  },
  
  // Secondary pages
  SECONDARY_PAGES: {
    TOTAL_JS: 200 * 1024, // 200KB max for dashboard/settings
    MAIN_CHUNK: 120 * 1024, // 120KB max for main chunk
    CSS: 40 * 1024 // 40KB max for total CSS
  }
};

// Page categorization for different performance budgets
export const PAGE_CATEGORIES = {
  CRISIS: [
    '/crisis-resources',
    '/support',
    '/emergency'
  ],
  CORE: [
    '/',
    '/auth/login',
    '/journal',
    '/write'
  ],
  SECONDARY: [
    '/dashboard',
    '/account',
    '/settings',
    '/pricing'
  ]
} as const;

interface BundleMetrics {
  totalSize: number;
  mainChunkSize: number;
  cssSize: number;
  jsChunks: ChunkInfo[];
  cssChunks: ChunkInfo[];
  thirdPartySize: number;
  firstPartySize: number;
  unusedCode: number;
}

interface ChunkInfo {
  name: string;
  size: number;
  gzipSize?: number;
  modules: string[];
  imports: string[];
  isAsync: boolean;
}

interface BundleOptimizationReport {
  currentMetrics: BundleMetrics;
  violations: BudgetViolation[];
  recommendations: OptimizationRecommendation[];
  potentialSavings: number;
  criticalIssues: string[];
}

interface BudgetViolation {
  page: string;
  category: 'CRISIS' | 'CORE' | 'SECONDARY';
  metric: string;
  current: number;
  budget: number;
  severity: 'warning' | 'critical';
}

interface OptimizationRecommendation {
  type: 'code-splitting' | 'tree-shaking' | 'dependency-removal' | 'compression' | 'lazy-loading';
  description: string;
  potentialSaving: number;
  implementation: string;
  priority: 'high' | 'medium' | 'low';
}

class BundleAnalyzer {
  private metrics: BundleMetrics | null = null;
  private webpackStats: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAnalysis();
    }
  }

  private initializeAnalysis(): void {
    // Analyze bundle on page load
    window.addEventListener('load', () => {
      this.analyzeBundlePerformance();
    });

    // Monitor dynamic imports
    this.monitorDynamicImports();
  }

  private analyzeBundlePerformance(): void {
    if (!window.performance) return;

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalJsSize = 0;
    let totalCssSize = 0;
    let thirdPartySize = 0;
    let firstPartySize = 0;
    
    const jsChunks: ChunkInfo[] = [];
    const cssChunks: ChunkInfo[] = [];

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      const isThirdParty = this.isThirdPartyResource(resource.name);
      
      if (resource.name.endsWith('.js')) {
        totalJsSize += size;
        
        if (isThirdParty) {
          thirdPartySize += size;
        } else {
          firstPartySize += size;
        }

        jsChunks.push({
          name: resource.name,
          size,
          modules: [], // Would need webpack stats for this
          imports: [],
          isAsync: resource.name.includes('chunk') || resource.name.includes('lazy')
        });
      }
      
      if (resource.name.endsWith('.css')) {
        totalCssSize += size;
        
        cssChunks.push({
          name: resource.name,
          size,
          modules: [],
          imports: [],
          isAsync: false
        });
      }
    });

    this.metrics = {
      totalSize: totalJsSize + totalCssSize,
      mainChunkSize: jsChunks.find(chunk => chunk.name.includes('main'))?.size || 0,
      cssSize: totalCssSize,
      jsChunks,
      cssChunks,
      thirdPartySize,
      firstPartySize,
      unusedCode: 0 // Would need coverage API for this
    };
  }

  private isThirdPartyResource(url: string): boolean {
    const currentDomain = window.location.hostname;
    try {
      const resourceUrl = new URL(url);
      return resourceUrl.hostname !== currentDomain;
    } catch {
      return false;
    }
  }

  private monitorDynamicImports(): void {
    // Override dynamic import to track lazy loading
    const originalImport = window.eval('import');
    
    if (originalImport) {
      window.eval('import') = async (specifier: string) => {
        const startTime = performance.now();
        
        try {
          const result = await originalImport(specifier);
          const loadTime = performance.now() - startTime;
          
          // Track dynamic import performance
          this.trackDynamicImport(specifier, loadTime);
          
          return result;
        } catch (error) {
          this.trackDynamicImportError(specifier, error);
          throw error;
        }
      };
    }
  }

  private trackDynamicImport(specifier: string, loadTime: number): void {
    // Send to monitoring system
    fetch('/api/monitoring/bundle-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'dynamic_import',
        specifier,
        loadTime,
        timestamp: Date.now(),
        url: window.location.pathname
      })
    }).catch(() => {});
  }

  private trackDynamicImportError(specifier: string, error: any): void {
    fetch('/api/monitoring/bundle-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'dynamic_import_error',
        specifier,
        error: error.message,
        timestamp: Date.now(),
        url: window.location.pathname
      })
    }).catch(() => {});
  }

  public generateOptimizationReport(): BundleOptimizationReport {
    if (!this.metrics) {
      throw new Error('Bundle metrics not available. Ensure analysis has run.');
    }

    const currentPage = window.location.pathname;
    const pageCategory = this.categorizeePage(currentPage);
    const violations = this.checkBudgetViolations(pageCategory);
    const recommendations = this.generateRecommendations();
    
    return {
      currentMetrics: this.metrics,
      violations,
      recommendations,
      potentialSavings: recommendations.reduce((total, rec) => total + rec.potentialSaving, 0),
      criticalIssues: violations
        .filter(v => v.severity === 'critical')
        .map(v => `${v.metric} exceeded budget by ${((v.current - v.budget) / 1024).toFixed(1)}KB`)
    };
  }

  private categorizeePage(pathname: string): 'CRISIS' | 'CORE' | 'SECONDARY' {
    if (PAGE_CATEGORIES.CRISIS.some(path => pathname.startsWith(path))) {
      return 'CRISIS';
    }
    
    if (PAGE_CATEGORIES.CORE.some(path => pathname === path || pathname.startsWith(path))) {
      return 'CORE';
    }
    
    return 'SECONDARY';
  }

  private checkBudgetViolations(category: 'CRISIS' | 'CORE' | 'SECONDARY'): BudgetViolation[] {
    if (!this.metrics) return [];

    const thresholds = BUNDLE_THRESHOLDS[`${category}_PAGES`];
    const violations: BudgetViolation[] = [];
    const currentPage = window.location.pathname;

    // Check total JS size
    if (this.metrics.totalSize > thresholds.TOTAL_JS) {
      violations.push({
        page: currentPage,
        category,
        metric: 'Total JavaScript',
        current: this.metrics.totalSize,
        budget: thresholds.TOTAL_JS,
        severity: category === 'CRISIS' ? 'critical' : 'warning'
      });
    }

    // Check main chunk size
    if (this.metrics.mainChunkSize > thresholds.MAIN_CHUNK) {
      violations.push({
        page: currentPage,
        category,
        metric: 'Main Chunk',
        current: this.metrics.mainChunkSize,
        budget: thresholds.MAIN_CHUNK,
        severity: category === 'CRISIS' ? 'critical' : 'warning'
      });
    }

    // Check CSS size
    if (this.metrics.cssSize > thresholds.CSS) {
      violations.push({
        page: currentPage,
        category,
        metric: 'CSS Size',
        current: this.metrics.cssSize,
        budget: thresholds.CSS,
        severity: 'warning'
      });
    }

    return violations;
  }

  private generateRecommendations(): OptimizationRecommendation[] {
    if (!this.metrics) return [];

    const recommendations: OptimizationRecommendation[] = [];

    // Code splitting recommendations
    if (this.metrics.mainChunkSize > BUNDLE_THRESHOLDS.CORE_PAGES.MAIN_CHUNK) {
      recommendations.push({
        type: 'code-splitting',
        description: 'Split large components into dynamic imports',
        potentialSaving: Math.floor(this.metrics.mainChunkSize * 0.3),
        implementation: 'Use React.lazy() and dynamic imports for non-critical components',
        priority: 'high'
      });
    }

    // Third-party dependency optimization
    if (this.metrics.thirdPartySize > 50 * 1024) {
      recommendations.push({
        type: 'dependency-removal',
        description: 'Reduce third-party dependencies',
        potentialSaving: Math.floor(this.metrics.thirdPartySize * 0.4),
        implementation: 'Audit and remove unused dependencies, replace heavy libraries',
        priority: 'high'
      });
    }

    // Tree shaking opportunities
    recommendations.push({
      type: 'tree-shaking',
      description: 'Improve tree shaking configuration',
      potentialSaving: Math.floor(this.metrics.totalSize * 0.15),
      implementation: 'Configure webpack tree shaking, use ES modules',
      priority: 'medium'
    });

    // Compression recommendations
    recommendations.push({
      type: 'compression',
      description: 'Enable better compression',
      potentialSaving: Math.floor(this.metrics.totalSize * 0.25),
      implementation: 'Enable Brotli compression, optimize bundle splitting',
      priority: 'medium'
    });

    return recommendations;
  }

  public trackBundleLoad(): void {
    if (!window.performance) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const bundleMetrics = {
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      bundleSize: this.metrics?.totalSize || 0,
      mainChunkSize: this.metrics?.mainChunkSize || 0,
      page: window.location.pathname,
      timestamp: Date.now()
    };

    // Send bundle performance data
    fetch('/api/monitoring/bundle-performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bundleMetrics)
    }).catch(() => {});
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  public getBundleMetrics(): BundleMetrics | null {
    return this.metrics;
  }

  public checkCrisisPagePerformance(): boolean {
    const currentPage = window.location.pathname;
    const isCrisisPage = PAGE_CATEGORIES.CRISIS.some(path => currentPage.startsWith(path));
    
    if (!isCrisisPage || !this.metrics) return true;

    const violations = this.checkBudgetViolations('CRISIS');
    const hasCriticalViolations = violations.some(v => v.severity === 'critical');

    if (hasCriticalViolations) {
      console.error('CRISIS PAGE PERFORMANCE VIOLATION:', violations);
      
      // Send alert for crisis page performance issues
      fetch('/api/monitoring/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'crisis_page_performance',
          page: currentPage,
          violations,
          severity: 'critical',
          timestamp: Date.now()
        })
      }).catch(() => {});

      return false;
    }

    return true;
  }
}

// Global bundle analyzer instance
export const bundleAnalyzer = new BundleAnalyzer();

// React hook for bundle analysis
export const useBundleAnalysis = () => {
  return {
    getMetrics: () => bundleAnalyzer.getBundleMetrics(),
    generateReport: () => bundleAnalyzer.generateOptimizationReport(),
    checkCrisisPerformance: () => bundleAnalyzer.checkCrisisPagePerformance(),
    trackBundleLoad: () => bundleAnalyzer.trackBundleLoad()
  };
};

// Bundle optimization utilities
export const optimizeBundleForCrisis = (): string[] => {
  const recommendations = [
    'Implement code splitting for non-critical components',
    'Use dynamic imports for crisis resources',
    'Minimize third-party dependencies on crisis pages',
    'Enable aggressive compression',
    'Implement service worker caching for repeat visits',
    'Use resource hints (preload, prefetch) strategically',
    'Optimize images with modern formats (WebP, AVIF)',
    'Inline critical CSS for above-fold content'
  ];

  return recommendations;
};

export const generateBundleBudget = (pageCategory: 'CRISIS' | 'CORE' | 'SECONDARY') => {
  const thresholds = BUNDLE_THRESHOLDS[`${pageCategory}_PAGES`];
  
  return {
    maxTotalJS: thresholds.TOTAL_JS,
    maxMainChunk: thresholds.MAIN_CHUNK,
    maxCSS: thresholds.CSS,
    recommendations: optimizeBundleForCrisis()
  };
};

export default bundleAnalyzer;