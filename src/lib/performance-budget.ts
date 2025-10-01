/**
 * Performance Budget System for ALCHM
 * Crisis-critical performance enforcement and CI/CD integration
 */

// Performance budgets based on trauma-informed design principles
export const PERFORMANCE_BUDGETS = {
  // Crisis pages - strictest budgets (lives depend on this)
  CRISIS_PAGES: {
    // Core Web Vitals
    LCP: 1200, // ms - must load critical content fast
    FID: 50,   // ms - immediate response to crisis interactions
    CLS: 0.05, // minimal layout shift to prevent user confusion
    
    // Loading metrics
    FCP: 800,  // ms - show something immediately
    TTI: 2000, // ms - interactive quickly
    TBT: 100,  // ms - minimal blocking time
    
    // Resource budgets
    TOTAL_JS: 50 * 1024,   // 50KB - minimal JS for crisis resources
    TOTAL_CSS: 10 * 1024,  // 10KB - critical CSS only
    TOTAL_IMAGES: 200 * 1024, // 200KB - essential images only
    
    // Network budgets
    TOTAL_REQUESTS: 10,    // minimal requests
    TOTAL_SIZE: 300 * 1024 // 300KB total page weight
  },
  
  // Core user journeys (journal, auth)
  CORE_PAGES: {
    LCP: 2000,
    FID: 100,
    CLS: 0.1,
    
    FCP: 1200,
    TTI: 3000,
    TBT: 200,
    
    TOTAL_JS: 100 * 1024,
    TOTAL_CSS: 20 * 1024,
    TOTAL_IMAGES: 500 * 1024,
    
    TOTAL_REQUESTS: 20,
    TOTAL_SIZE: 600 * 1024
  },
  
  // Secondary pages (dashboard, settings)
  SECONDARY_PAGES: {
    LCP: 2500,
    FID: 300,
    CLS: 0.25,
    
    FCP: 1800,
    TTI: 5000,
    TBT: 500,
    
    TOTAL_JS: 200 * 1024,
    TOTAL_CSS: 40 * 1024,
    TOTAL_IMAGES: 1024 * 1024, // 1MB
    
    TOTAL_REQUESTS: 50,
    TOTAL_SIZE: 1200 * 1024
  }
} as const;

export type PageCategory = keyof typeof PERFORMANCE_BUDGETS;
export type BudgetMetric = keyof typeof PERFORMANCE_BUDGETS['CRISIS_PAGES'];

interface BudgetViolation {
  metric: BudgetMetric;
  actual: number;
  budget: number;
  difference: number;
  percentageOver: number;
  severity: 'warning' | 'error' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'crisis';
}

interface BudgetReport {
  page: string;
  category: PageCategory;
  passed: boolean;
  violations: BudgetViolation[];
  score: number;
  recommendations: string[];
  timestamp: number;
}

interface CIBudgetConfig {
  enabled: boolean;
  failOnViolation: boolean;
  crisisPageThreshold: number; // fail CI if crisis pages violate budgets
  reportPath: string;
  alertWebhook?: string;
}

class PerformanceBudgetMonitor {
  private currentPage: string = '';
  private pageCategory: PageCategory = 'SECONDARY_PAGES';
  private violations: BudgetViolation[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.currentPage = window.location.pathname;
      this.pageCategory = this.categorizeCurrentPage();
      this.initializeBudgetMonitoring();
    }
  }

  private categorizeCurrentPage(): PageCategory {
    const pathname = this.currentPage;
    
    // Crisis pages - highest priority
    if (pathname.includes('crisis') || 
        pathname.includes('support') || 
        pathname.includes('emergency') ||
        pathname.includes('hotline')) {
      return 'CRISIS_PAGES';
    }
    
    // Core user journeys
    if (pathname === '/' ||
        pathname.includes('auth') ||
        pathname.includes('login') ||
        pathname.includes('journal') ||
        pathname.includes('write')) {
      return 'CORE_PAGES';
    }
    
    // Everything else
    return 'SECONDARY_PAGES';
  }

  private initializeBudgetMonitoring(): void {
    // Monitor on page load
    window.addEventListener('load', () => {
      this.checkAllBudgets();
    });

    // Monitor periodically for SPA navigation
    setInterval(() => {
      const newPath = window.location.pathname;
      if (newPath !== this.currentPage) {
        this.currentPage = newPath;
        this.pageCategory = this.categorizeCurrentPage();
        this.checkAllBudgets();
      }
    }, 1000);
  }

  public checkAllBudgets(): BudgetReport {
    const budgets = PERFORMANCE_BUDGETS[this.pageCategory];
    this.violations = [];

    // Check Core Web Vitals
    this.checkWebVitals(budgets);
    
    // Check resource budgets
    this.checkResourceBudgets(budgets);
    
    // Check network budgets
    this.checkNetworkBudgets(budgets);

    const report = this.generateBudgetReport();
    
    // Send to monitoring if there are violations
    if (this.violations.length > 0) {
      this.reportBudgetViolations(report);
    }

    return report;
  }

  private checkWebVitals(budgets: typeof PERFORMANCE_BUDGETS['CRISIS_PAGES']): void {
    // Check LCP
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    if (lcpEntries.length > 0) {
      const lcp = lcpEntries[lcpEntries.length - 1].startTime;
      this.checkMetric('LCP', lcp, budgets.LCP);
    }

    // Check FID (approximation with first input delay)
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries.length > 0) {
      const fid = (fidEntries[0] as any).processingStart - fidEntries[0].startTime;
      this.checkMetric('FID', fid, budgets.FID);
    }

    // Check CLS (tracked separately via Performance Observer)
    if ((window as any).clsValue !== undefined) {
      this.checkMetric('CLS', (window as any).clsValue, budgets.CLS);
    }

    // Check FCP
    const fcpEntries = performance.getEntriesByType('paint')
      .filter(entry => entry.name === 'first-contentful-paint');
    if (fcpEntries.length > 0) {
      this.checkMetric('FCP', fcpEntries[0].startTime, budgets.FCP);
    }

    // Check TTI (approximation)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const tti = navigationEntry.domInteractive - navigationEntry.navigationStart;
      this.checkMetric('TTI', tti, budgets.TTI);
    }
  }

  private checkResourceBudgets(budgets: typeof PERFORMANCE_BUDGETS['CRISIS_PAGES']): void {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    let totalJS = 0;
    let totalCSS = 0;
    let totalImages = 0;
    let totalSize = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;
      totalSize += size;

      if (resource.name.endsWith('.js')) {
        totalJS += size;
      } else if (resource.name.endsWith('.css')) {
        totalCSS += size;
      } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) {
        totalImages += size;
      }
    });

    this.checkMetric('TOTAL_JS', totalJS, budgets.TOTAL_JS);
    this.checkMetric('TOTAL_CSS', totalCSS, budgets.TOTAL_CSS);
    this.checkMetric('TOTAL_IMAGES', totalImages, budgets.TOTAL_IMAGES);
    this.checkMetric('TOTAL_SIZE', totalSize, budgets.TOTAL_SIZE);
  }

  private checkNetworkBudgets(budgets: typeof PERFORMANCE_BUDGETS['CRISIS_PAGES']): void {
    const resources = performance.getEntriesByType('resource');
    const totalRequests = resources.length + 1; // +1 for main document

    this.checkMetric('TOTAL_REQUESTS', totalRequests, budgets.TOTAL_REQUESTS);
  }

  private checkMetric(metric: BudgetMetric, actual: number, budget: number): void {
    if (actual > budget) {
      const difference = actual - budget;
      const percentageOver = (difference / budget) * 100;
      
      const violation: BudgetViolation = {
        metric,
        actual,
        budget,
        difference,
        percentageOver,
        severity: this.determineSeverity(metric, percentageOver),
        impact: this.determineImpact(metric, this.pageCategory)
      };

      this.violations.push(violation);
    }
  }

  private determineSeverity(metric: BudgetMetric, percentageOver: number): 'warning' | 'error' | 'critical' {
    // Crisis pages have stricter severity levels
    if (this.pageCategory === 'CRISIS_PAGES') {
      if (percentageOver > 50) return 'critical';
      if (percentageOver > 20) return 'error';
      return 'warning';
    }

    if (percentageOver > 100) return 'critical';
    if (percentageOver > 50) return 'error';
    return 'warning';
  }

  private determineImpact(metric: BudgetMetric, category: PageCategory): 'low' | 'medium' | 'high' | 'crisis' {
    if (category === 'CRISIS_PAGES') {
      // Any violation on crisis pages is high impact
      if (['LCP', 'FID', 'FCP'].includes(metric)) return 'crisis';
      return 'high';
    }

    if (category === 'CORE_PAGES' && ['LCP', 'FID', 'CLS'].includes(metric)) {
      return 'high';
    }

    if (['TOTAL_JS', 'TOTAL_SIZE'].includes(metric)) {
      return 'medium';
    }

    return 'low';
  }

  private generateBudgetReport(): BudgetReport {
    const totalViolations = this.violations.length;
    const criticalViolations = this.violations.filter(v => v.severity === 'critical').length;
    const crisisImpactViolations = this.violations.filter(v => v.impact === 'crisis').length;

    // Calculate performance score (0-100)
    let score = 100;
    this.violations.forEach(violation => {
      const penalty = this.getSeverityPenalty(violation.severity) * 
                     this.getImpactMultiplier(violation.impact);
      score -= penalty;
    });
    score = Math.max(0, score);

    const passed = this.pageCategory === 'CRISIS_PAGES' ? 
      crisisImpactViolations === 0 : criticalViolations === 0;

    return {
      page: this.currentPage,
      category: this.pageCategory,
      passed,
      violations: this.violations,
      score,
      recommendations: this.generateRecommendations(),
      timestamp: Date.now()
    };
  }

  private getSeverityPenalty(severity: 'warning' | 'error' | 'critical'): number {
    switch (severity) {
      case 'critical': return 30;
      case 'error': return 20;
      case 'warning': return 10;
    }
  }

  private getImpactMultiplier(impact: 'low' | 'medium' | 'high' | 'crisis'): number {
    switch (impact) {
      case 'crisis': return 2.0;
      case 'high': return 1.5;
      case 'medium': return 1.2;
      case 'low': return 1.0;
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.violations.forEach(violation => {
      switch (violation.metric) {
        case 'LCP':
          recommendations.push('Optimize largest contentful paint: reduce server response time, eliminate render-blocking resources');
          break;
        case 'FID':
          recommendations.push('Improve first input delay: reduce JavaScript execution time, use web workers for heavy tasks');
          break;
        case 'CLS':
          recommendations.push('Fix cumulative layout shift: set dimensions for media, avoid dynamic content injection');
          break;
        case 'TOTAL_JS':
          recommendations.push('Reduce JavaScript bundle size: implement code splitting, remove unused dependencies');
          break;
        case 'TOTAL_CSS':
          recommendations.push('Optimize CSS: remove unused styles, inline critical CSS, use CSS optimization tools');
          break;
        case 'TOTAL_IMAGES':
          recommendations.push('Optimize images: use modern formats (WebP/AVIF), implement responsive images, compress images');
          break;
        case 'TOTAL_SIZE':
          recommendations.push('Reduce total page weight: enable compression, optimize all resources, implement efficient caching');
          break;
        case 'TOTAL_REQUESTS':
          recommendations.push('Reduce HTTP requests: bundle resources, use CSS sprites, implement resource hints');
          break;
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  private async reportBudgetViolations(report: BudgetReport): Promise<void> {
    try {
      await fetch('/api/monitoring/performance-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });

      // For crisis page violations, send immediate alert
      if (report.category === 'CRISIS_PAGES' && report.violations.some(v => v.impact === 'crisis')) {
        await fetch('/api/monitoring/alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'crisis_page_budget_violation',
            severity: 'critical',
            report,
            timestamp: Date.now()
          })
        });
      }
    } catch (error) {
      console.warn('Failed to report budget violations:', error);
    }
  }

  public getBudgetsForPage(category: PageCategory) {
    return PERFORMANCE_BUDGETS[category];
  }

  public getCurrentViolations(): BudgetViolation[] {
    return [...this.violations];
  }

  public getPageCategory(): PageCategory {
    return this.pageCategory;
  }
}

// CI/CD Budget Enforcement
export class CIBudgetEnforcer {
  private config: CIBudgetConfig;

  constructor(config: CIBudgetConfig) {
    this.config = config;
  }

  public async enforceBudgets(buildArtifacts: any): Promise<boolean> {
    if (!this.config.enabled) return true;

    const violations = await this.analyzeBuildBudgets(buildArtifacts);
    const report = this.generateCIReport(violations);

    if (violations.length > 0) {
      await this.reportCIViolations(report);
    }

    // Fail CI if there are critical violations
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const shouldFail = this.config.failOnViolation && criticalViolations.length > 0;

    return !shouldFail;
  }

  private async analyzeBuildBudgets(buildArtifacts: any): Promise<BudgetViolation[]> {
    // This would analyze the build output (webpack stats, etc.)
    // For now, return empty array
    return [];
  }

  private generateCIReport(violations: BudgetViolation[]) {
    return {
      buildId: process.env.BUILD_ID || 'unknown',
      violations,
      passed: violations.length === 0,
      timestamp: Date.now()
    };
  }

  private async reportCIViolations(report: any): Promise<void> {
    if (this.config.alertWebhook) {
      try {
        await fetch(this.config.alertWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report)
        });
      } catch (error) {
        console.error('Failed to send CI budget alert:', error);
      }
    }
  }
}

// Global performance budget monitor
export const performanceBudgetMonitor = new PerformanceBudgetMonitor();

// React hook for budget monitoring
export const usePerformanceBudget = () => {
  return {
    checkBudgets: () => performanceBudgetMonitor.checkAllBudgets(),
    getViolations: () => performanceBudgetMonitor.getCurrentViolations(),
    getPageCategory: () => performanceBudgetMonitor.getPageCategory(),
    getBudgets: (category: PageCategory) => performanceBudgetMonitor.getBudgetsForPage(category)
  };
};

export default performanceBudgetMonitor;