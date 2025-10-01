/**
 * ALCHM Comprehensive Performance Monitor
 * 
 * Monitors all critical performance metrics for App Store compliance:
 * - Time to Interactive: Target <5s (currently 25.6s on journal page)
 * - Largest Contentful Paint: Target <2s (currently 4.1s on landing)
 * - First Input Delay: Target <100ms
 * - Cumulative Layout Shift: Target <0.1
 * - Total Blocking Time: Target <500ms (currently 5.1s)
 */

interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number; // Cumulative Layout Shift
  
  // Additional metrics
  fcp: number | null; // First Contentful Paint
  tti: number | null; // Time to Interactive
  tbt: number; // Total Blocking Time
  si: number | null; // Speed Index
  
  // Custom metrics
  crisisDetectionLatency: number | null;
  authResponseTime: number | null;
  journalSaveTime: number | null;
  
  // Device context
  deviceMemory: number;
  connectionType: string;
  effectiveType: string;
  isLowEndDevice: boolean;
  
  // Timestamps
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number | null;
  
  // Bundle metrics
  initialBundleSize: number;
  totalAssetSize: number;
  
  // Performance scores
  performanceScore: number | null;
  accessibilityScore: number | null;
  bestPracticesScore: number | null;
  seoScore: number | null;
}

interface PerformanceBudgets {
  lcp: number; // 2000ms
  fid: number; // 100ms
  cls: number; // 0.1
  fcp: number; // 1200ms
  tti: number; // 5000ms
  tbt: number; // 500ms
  crisisDetectionLatency: number; // 1000ms
  initialBundleSize: number; // 200KB
  totalAssetSize: number; // 500KB
}

class ComprehensivePerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private budgets: PerformanceBudgets;
  private observers: PerformanceObserver[] = [];
  private violations: string[] = [];
  private isMonitoring = false;
  private reportCallback: ((metrics: PerformanceMetrics, violations: string[]) => void) | null = null;

  constructor() {
    this.budgets = {
      lcp: 2000, // App Store requirement
      fid: 100,  // App Store requirement  
      cls: 0.1,  // App Store requirement
      fcp: 1200, // Crisis user requirement
      tti: 5000, // App Store requirement
      tbt: 500,  // App Store requirement
      crisisDetectionLatency: 1000, // Life-safety requirement
      initialBundleSize: 200 * 1024, // 200KB for mobile
      totalAssetSize: 500 * 1024     // 500KB total budget
    };

    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Initialize device context
    this.captureDeviceContext();
    
    // Initialize navigation timing
    this.captureNavigationTiming();
    
    // Set up performance observers
    this.setupPerformanceObservers();
    
    // Monitor bundle sizes
    this.monitorBundleSizes();
    
    // Set up crisis-specific monitoring
    this.setupCrisisMonitoring();
    
    // Start continuous monitoring
    this.startContinuousMonitoring();
  }

  private captureDeviceContext(): void {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    this.metrics.deviceMemory = nav.deviceMemory || this.estimateDeviceMemory();
    this.metrics.connectionType = connection?.type || 'unknown';
    this.metrics.effectiveType = connection?.effectiveType || '4g';
    this.metrics.isLowEndDevice = this.detectLowEndDevice();
  }

  private estimateDeviceMemory(): number {
    try {
      const memory = (performance as any).memory;
      if (memory) {
        return memory.jsHeapSizeLimit / (1024 * 1024 * 1024);
      }
    } catch {
      // Fallback estimation
    }
    
    // Device estimation based on user agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      if (userAgent.includes('go') || userAgent.includes('lite')) return 1;
      if (userAgent.includes('android 4') || userAgent.includes('android 5')) return 1;
      return 3;
    }
    return 4; // Conservative default
  }

  private detectLowEndDevice(): boolean {
    const memory = this.metrics.deviceMemory || 0;
    const cores = (navigator as any).hardwareConcurrency || 2;
    const effectiveType = this.metrics.effectiveType;
    
    return (
      memory < 3 ||
      cores < 4 ||
      effectiveType === 'slow-2g' ||
      effectiveType === '2g' ||
      effectiveType === 'slow-3g'
    );
  }

  private captureNavigationTiming(): void {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (nav) {
      this.metrics.navigationStart = nav.navigationStart;
      this.metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.navigationStart;
      this.metrics.loadComplete = nav.loadEventEnd - nav.navigationStart;
    }
  }

  private setupPerformanceObservers(): void {
    // Paint timing observer
    this.createObserver(['paint'], (entries) => {
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.checkBudgetViolation('fcp', entry.startTime);
        }
        if (entry.name === 'first-paint') {
          this.metrics.firstPaint = entry.startTime;
        }
      });
    });

    // LCP observer
    this.createObserver(['largest-contentful-paint'], (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.checkBudgetViolation('lcp', lastEntry.startTime);
    });

    // FID observer
    this.createObserver(['first-input'], (entries) => {
      const firstInput = entries[0];
      const fid = (firstInput as any).processingStart - firstInput.startTime;
      this.metrics.fid = fid;
      this.checkBudgetViolation('fid', fid);
    });

    // CLS observer
    let clsValue = 0;
    this.createObserver(['layout-shift'], (entries) => {
      entries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      this.metrics.cls = clsValue;
      this.checkBudgetViolation('cls', clsValue);
    });

    // Long tasks observer (for TTI and TBT)
    this.createObserver(['longtask'], (entries) => {
      let tbt = 0;
      entries.forEach(entry => {
        if (entry.duration > 50) {
          tbt += entry.duration - 50;
        }
      });
      this.metrics.tbt = tbt;
      this.checkBudgetViolation('tbt', tbt);
    });

    // Custom measures observer
    this.createObserver(['measure'], (entries) => {
      entries.forEach(entry => {
        switch (entry.name) {
          case 'crisis-detection':
            this.metrics.crisisDetectionLatency = entry.duration;
            this.checkBudgetViolation('crisisDetectionLatency', entry.duration);
            break;
          case 'auth-response':
            this.metrics.authResponseTime = entry.duration;
            break;
          case 'journal-save':
            this.metrics.journalSaveTime = entry.duration;
            break;
        }
      });
    });
  }

  private createObserver(entryTypes: string[], callback: (entries: PerformanceEntry[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ entryTypes });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Failed to create observer for ${entryTypes}:`, error);
    }
  }

  private monitorBundleSizes(): void {
    // Monitor resource loading
    this.createObserver(['resource'], (entries) => {
      let initialBundleSize = 0;
      let totalAssetSize = 0;

      entries.forEach(entry => {
        const resource = entry as PerformanceResourceTiming;
        const size = resource.transferSize || 0;
        
        if (resource.name.includes('/_next/static/chunks/pages/') || 
            resource.name.includes('/_next/static/chunks/main-')) {
          initialBundleSize += size;
        }
        
        if (resource.name.includes('/_next/static/') || 
            resource.name.includes('.js') || 
            resource.name.includes('.css')) {
          totalAssetSize += size;
        }
      });

      this.metrics.initialBundleSize = initialBundleSize;
      this.metrics.totalAssetSize = totalAssetSize;
      
      this.checkBudgetViolation('initialBundleSize', initialBundleSize);
      this.checkBudgetViolation('totalAssetSize', totalAssetSize);
    });
  }

  private setupCrisisMonitoring(): void {
    // Monitor crisis detection performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0]?.toString() || '';
      
      if (url.includes('/api/crisis') || url.includes('/crisis')) {
        const startTime = performance.now();
        try {
          const response = await originalFetch(...args);
          const endTime = performance.now();
          
          performance.mark('crisis-response-start');
          performance.mark('crisis-response-end');
          performance.measure('crisis-detection', 'crisis-response-start', 'crisis-response-end');
          
          return response;
        } catch (error) {
          const endTime = performance.now();
          console.error('Crisis API failed:', error);
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    // Monitor auth performance
    const monitorAuth = () => {
      const authButtons = document.querySelectorAll('[data-auth-action]');
      authButtons.forEach(button => {
        button.addEventListener('click', () => {
          performance.mark('auth-start');
        });
      });
    };

    // Delay auth monitoring until DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', monitorAuth);
    } else {
      monitorAuth();
    }
  }

  private startContinuousMonitoring(): void {
    // Calculate TTI using a simplified algorithm
    const calculateTTI = () => {
      const longTasks = performance.getEntriesByType('longtask');
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (!navigation) return;

      const domContentLoaded = navigation.domContentLoadedEventEnd;
      let lastLongTask = domContentLoaded;

      longTasks.forEach(task => {
        if (task.startTime > domContentLoaded) {
          lastLongTask = Math.max(lastLongTask, task.startTime + task.duration);
        }
      });

      // TTI is 5 seconds after the last long task (simplified)
      const tti = lastLongTask + 5000;
      this.metrics.tti = tti;
      this.checkBudgetViolation('tti', tti);
    };

    // Calculate TTI periodically
    const ttiInterval = setInterval(() => {
      calculateTTI();
      
      // Stop monitoring after 30 seconds
      if (performance.now() > 30000) {
        clearInterval(ttiInterval);
        this.finalizeReport();
      }
    }, 1000);

    // Memory monitoring for low-end devices
    if (this.metrics.isLowEndDevice) {
      const memoryInterval = setInterval(() => {
        const memory = (performance as any).memory;
        if (memory) {
          const usagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
          if (usagePercent > 90) {
            this.violations.push(`Critical memory usage: ${usagePercent.toFixed(1)}%`);
          }
        }
      }, 5000);

      // Stop memory monitoring after 60 seconds
      setTimeout(() => clearInterval(memoryInterval), 60000);
    }
  }

  private checkBudgetViolation(metric: keyof PerformanceBudgets, value: number): void {
    const budget = this.budgets[metric];
    if (value > budget) {
      const violation = `${metric}: ${value.toFixed(1)} > ${budget} (${((value - budget) / budget * 100).toFixed(1)}% over budget)`;
      this.violations.push(violation);
      
      // Log critical violations immediately
      if (metric === 'crisisDetectionLatency' || metric === 'tti' || metric === 'lcp') {
        console.error(`CRITICAL PERFORMANCE VIOLATION: ${violation}`);
      }
    }
  }

  private finalizeReport(): void {
    // Calculate performance scores (simplified)
    this.calculatePerformanceScores();
    
    // Report final metrics
    if (this.reportCallback) {
      this.reportCallback(this.metrics as PerformanceMetrics, this.violations);
    }

    // Store metrics for analytics
    this.storeMetrics();
  }

  private calculatePerformanceScores(): void {
    // Simplified Lighthouse-style scoring
    const lcp = this.metrics.lcp || 0;
    const fid = this.metrics.fid || 0;
    const cls = this.metrics.cls || 0;
    const fcp = this.metrics.fcp || 0;
    const tti = this.metrics.tti || 0;

    // Performance score (0-100)
    let performanceScore = 100;
    
    if (lcp > 2500) performanceScore -= 30;
    else if (lcp > 2000) performanceScore -= 15;
    
    if (fid > 300) performanceScore -= 25;
    else if (fid > 100) performanceScore -= 10;
    
    if (cls > 0.25) performanceScore -= 20;
    else if (cls > 0.1) performanceScore -= 10;
    
    if (fcp > 2000) performanceScore -= 15;
    else if (fcp > 1200) performanceScore -= 8;
    
    if (tti > 8000) performanceScore -= 25;
    else if (tti > 5000) performanceScore -= 12;

    this.metrics.performanceScore = Math.max(0, performanceScore);
  }

  private storeMetrics(): void {
    try {
      const report = {
        metrics: this.metrics,
        violations: this.violations,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      };

      // Store locally
      const reports = JSON.parse(localStorage.getItem('alchm_performance_reports') || '[]');
      reports.push(report);
      
      // Keep only last 10 reports
      localStorage.setItem('alchm_performance_reports', JSON.stringify(reports.slice(-10)));

      // Send to analytics (non-blocking)
      this.sendToAnalytics(report);
    } catch (error) {
      console.warn('Failed to store performance metrics:', error);
    }
  }

  private async sendToAnalytics(report: any): Promise<void> {
    try {
      // Send to your analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
    } catch (error) {
      // Analytics failure should not affect user experience
    }
  }

  // Public methods
  public onReport(callback: (metrics: PerformanceMetrics, violations: string[]) => void): void {
    this.reportCallback = callback;
  }

  public getCurrentMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public getViolations(): string[] {
    return [...this.violations];
  }

  public markCrisisDetectionStart(): void {
    performance.mark('crisis-detection-start');
  }

  public markCrisisDetectionEnd(): void {
    performance.mark('crisis-detection-end');
    performance.measure('crisis-detection', 'crisis-detection-start', 'crisis-detection-end');
  }

  public markAuthStart(): void {
    performance.mark('auth-start');
  }

  public markAuthEnd(): void {
    performance.mark('auth-end');
    performance.measure('auth-response', 'auth-start', 'auth-end');
  }

  public markJournalSaveStart(): void {
    performance.mark('journal-save-start');
  }

  public markJournalSaveEnd(): void {
    performance.mark('journal-save-end');
    performance.measure('journal-save', 'journal-save-start', 'journal-save-end');
  }

  public getPerformanceReport(): string {
    const metrics = this.metrics;
    const violations = this.violations;
    
    return `
ALCHM Performance Report
========================

Core Web Vitals:
- LCP: ${metrics.lcp?.toFixed(1)}ms (target: <2000ms) ${metrics.lcp && metrics.lcp > 2000 ? '❌' : '✅'}
- FID: ${metrics.fid?.toFixed(1)}ms (target: <100ms) ${metrics.fid && metrics.fid > 100 ? '❌' : '✅'}
- CLS: ${metrics.cls?.toFixed(3)} (target: <0.1) ${metrics.cls && metrics.cls > 0.1 ? '❌' : '✅'}

Performance Metrics:
- FCP: ${metrics.fcp?.toFixed(1)}ms (target: <1200ms) ${metrics.fcp && metrics.fcp > 1200 ? '❌' : '✅'}
- TTI: ${metrics.tti?.toFixed(1)}ms (target: <5000ms) ${metrics.tti && metrics.tti > 5000 ? '❌' : '✅'}
- TBT: ${metrics.tbt?.toFixed(1)}ms (target: <500ms) ${metrics.tbt && metrics.tbt > 500 ? '❌' : '✅'}

Crisis Performance:
- Crisis Detection: ${metrics.crisisDetectionLatency?.toFixed(1)}ms (target: <1000ms) ${metrics.crisisDetectionLatency && metrics.crisisDetectionLatency > 1000 ? '❌' : '✅'}

Device Context:
- Memory: ${metrics.deviceMemory}GB
- Connection: ${metrics.effectiveType}
- Low-end device: ${metrics.isLowEndDevice ? 'Yes' : 'No'}

Bundle Sizes:
- Initial Bundle: ${(metrics.initialBundleSize || 0 / 1024).toFixed(1)}KB (target: <200KB)
- Total Assets: ${(metrics.totalAssetSize || 0 / 1024).toFixed(1)}KB (target: <500KB)

Performance Score: ${metrics.performanceScore || 0}/100

Violations (${violations.length}):
${violations.map(v => `- ${v}`).join('\n')}
    `;
  }

  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Singleton instance
let performanceMonitor: ComprehensivePerformanceMonitor | null = null;

export function getPerformanceMonitor(): ComprehensivePerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new ComprehensivePerformanceMonitor();
  }
  return performanceMonitor!;
}

export function initializePerformanceMonitoring(): void {
  getPerformanceMonitor();
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const monitor = getPerformanceMonitor();
  
  return {
    getCurrentMetrics: () => monitor?.getCurrentMetrics(),
    getViolations: () => monitor?.getViolations() || [],
    getReport: () => monitor?.getPerformanceReport() || '',
    markCrisisDetectionStart: () => monitor?.markCrisisDetectionStart(),
    markCrisisDetectionEnd: () => monitor?.markCrisisDetectionEnd(),
    markAuthStart: () => monitor?.markAuthStart(),
    markAuthEnd: () => monitor?.markAuthEnd(),
    markJournalSaveStart: () => monitor?.markJournalSaveStart(),
    markJournalSaveEnd: () => monitor?.markJournalSaveEnd()
  };
}

export default ComprehensivePerformanceMonitor;