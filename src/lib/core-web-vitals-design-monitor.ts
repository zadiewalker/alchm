/**
 * ALCHM Core Web Vitals Monitor for Premium Design Elements
 * 
 * Monitors how Jony Ive-inspired design elements impact Core Web Vitals:
 * - LCP: Impact of glass morphism and gradients on paint timing
 * - FID: Effect of backdrop-filter and animations on input responsiveness
 * - CLS: Layout stability with dynamic sanctuary elements
 * - INP: Interaction to Next Paint for crisis button responsiveness
 * 
 * Crisis-Critical Thresholds:
 * - LCP: <2s (vs Google's 2.5s) - Crisis users can't wait
 * - FID: <100ms (vs Google's 100ms) - Immediate crisis response needed
 * - CLS: <0.1 (vs Google's 0.1) - Visual stability during crisis
 * - INP: <200ms (new metric) - Next paint after interaction
 */

interface WebVitalsData {
  metric: 'LCP' | 'FID' | 'CLS' | 'INP' | 'FCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  attribution?: any;
  timestamp: number;
  designElements: DesignElementImpact[];
}

interface DesignElementImpact {
  element: string;
  type: 'glassomorphism' | 'animation' | 'gradient' | 'shadow' | 'typography';
  impactLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  performanceCost: number; // milliseconds
  optimizationApplied: string[];
}

interface VitalsConfig {
  enableDebugMode: boolean;
  enableAutomaticOptimization: boolean;
  thresholds: {
    LCP: { good: number; poor: number };
    FID: { good: number; poor: number };
    CLS: { good: number; poor: number };
    INP: { good: number; poor: number };
  };
  alertWebhook?: string;
  crisisMode: boolean;
}

interface PerformanceAlert {
  type: 'threshold_exceeded' | 'regression_detected' | 'crisis_impact';
  metric: string;
  value: number;
  threshold: number;
  designElementsCausing: string[];
  severity: 'warning' | 'critical';
  recommendations: string[];
  timestamp: number;
}

// Crisis-optimized thresholds (stricter than Google recommendations)
const CRISIS_THRESHOLDS = {
  LCP: { good: 2000, poor: 2500 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 }
};

// Design element performance impact tracking
const DESIGN_ELEMENT_SELECTORS = {
  glassomorphism: '[style*="backdrop-filter"], .glass-morphism, .card, .btn-primary',
  animations: '[class*="animate"], [style*="animation"], [style*="transition"], .fade-in, .slide-up, .breathe',
  gradients: '[style*="gradient"], .sanctuary-gradient, body',
  shadows: '[style*="box-shadow"], [style*="drop-shadow"], .card:hover, .btn:hover',
  typography: 'h1, h2, h3, h4, h5, h6, .heading, [style*="font-family"]'
};

class CoreWebVitalsDesignMonitor {
  private config: VitalsConfig;
  private vitalsData: WebVitalsData[] = [];
  private observers: PerformanceObserver[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private isMonitoring: boolean = false;
  private designElementCache: Map<string, DesignElementImpact> = new Map();
  private crisisButtonElement: HTMLElement | null = null;
  private lastCLSValue: number = 0;

  constructor(config: Partial<VitalsConfig> = {}) {
    this.config = {
      enableDebugMode: false,
      enableAutomaticOptimization: true,
      thresholds: CRISIS_THRESHOLDS,
      crisisMode: false,
      ...config
    };

    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring(): void {
    this.isMonitoring = true;
    
    // Set up Core Web Vitals observers
    this.setupLCPObserver();
    this.setupFIDObserver();
    this.setupCLSObserver();
    this.setupINPObserver();
    
    // Monitor design elements
    this.setupDesignElementMonitoring();
    
    // Monitor crisis button specifically
    this.setupCrisisButtonMonitoring();
    
    // Set up automatic optimization
    if (this.config.enableAutomaticOptimization) {
      this.setupAutomaticOptimization();
    }
    
    // Start reporting
    this.setupReporting();
  }

  private setupLCPObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Analyze what elements might be impacting LCP
        const designImpact = this.analyzeLCPDesignImpact(lastEntry);
        
        const vitalsData: WebVitalsData = {
          metric: 'LCP',
          value: lastEntry.startTime,
          rating: this.getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: this.generateId(),
          timestamp: Date.now(),
          designElements: designImpact,
          attribution: {
            element: (lastEntry as any).element?.tagName || 'unknown',
            url: (lastEntry as any).url || window.location.href,
            renderTime: lastEntry.startTime,
            loadTime: (lastEntry as any).loadTime || 0
          }
        };

        this.processVitalsData(vitalsData);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (error) {
      console.warn('LCP observer setup failed:', error);
    }
  }

  private setupFIDObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          
          // Analyze design elements that might be causing FID issues
          const designImpact = this.analyzeFIDDesignImpact(entry, fid);
          
          const vitalsData: WebVitalsData = {
            metric: 'FID',
            value: fid,
            rating: this.getRating('FID', fid),
            delta: fid,
            id: this.generateId(),
            timestamp: Date.now(),
            designElements: designImpact,
            attribution: {
              eventType: entry.name,
              eventTime: entry.startTime,
              processingStart: entry.processingStart,
              processingEnd: entry.processingStart + entry.duration,
              inputDelay: fid,
              processingTime: entry.duration
            }
          };

          this.processVitalsData(vitalsData);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (error) {
      console.warn('FID observer setup failed:', error);
    }
  }

  private setupCLSObserver(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            this.lastCLSValue += entry.value;
            
            // Analyze which design elements might be causing layout shifts
            const designImpact = this.analyzeCLSDesignImpact(entry);
            
            const vitalsData: WebVitalsData = {
              metric: 'CLS',
              value: this.lastCLSValue,
              rating: this.getRating('CLS', this.lastCLSValue),
              delta: entry.value,
              id: this.generateId(),
              timestamp: Date.now(),
              designElements: designImpact,
              attribution: {
                largestShiftSource: entry.sources?.[0] || null,
                largestShiftValue: entry.value,
                allSources: entry.sources || []
              }
            };

            this.processVitalsData(vitalsData);
          }
        });
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (error) {
      console.warn('CLS observer setup failed:', error);
    }
  }

  private setupINPObserver(): void {
    // INP (Interaction to Next Paint) - newer metric
    if (!('PerformanceObserver' in window)) return;

    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry: any) => {
          if (entry.interactionId) {
            const inp = entry.processingEnd - entry.startTime;
            
            // Focus on crisis button interactions
            const isCrisisInteraction = this.isCrisisButtonInteraction(entry);
            const designImpact = this.analyzeINPDesignImpact(entry, inp, isCrisisInteraction);
            
            const vitalsData: WebVitalsData = {
              metric: 'INP',
              value: inp,
              rating: this.getRating('INP', inp),
              delta: inp,
              id: this.generateId(),
              timestamp: Date.now(),
              designElements: designImpact,
              attribution: {
                interactionType: entry.name,
                interactionId: entry.interactionId,
                isCrisisButton: isCrisisInteraction,
                processingTime: entry.processingEnd - entry.processingStart,
                presentationTime: entry.duration,
                inputDelay: entry.processingStart - entry.startTime
              }
            };

            this.processVitalsData(vitalsData);
          }
        });
      });

      inpObserver.observe({ entryTypes: ['event'] });
      this.observers.push(inpObserver);
    } catch (error) {
      console.warn('INP observer setup failed:', error);
    }
  }

  private setupDesignElementMonitoring(): void {
    // Monitor design element mutations that could impact performance
    this.mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.analyzeNewElement(node as Element);
            }
          });
        } else if (mutation.type === 'attributes') {
          this.analyzeElementChange(mutation.target as Element, mutation.attributeName);
        }
      });
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Monitor element size changes that could affect CLS
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          this.analyzeElementResize(entry);
        });
      });

      // Observe key elements that might cause layout shifts
      document.querySelectorAll('.card, .btn, img, .crisis-button').forEach((element) => {
        this.resizeObserver?.observe(element);
      });
    }
  }

  private setupCrisisButtonMonitoring(): void {
    // Special monitoring for crisis button performance
    const findCrisisButton = () => {
      return document.querySelector('.crisis-button, .emergency-button, [data-crisis-button]') as HTMLElement;
    };

    this.crisisButtonElement = findCrisisButton();
    
    if (this.crisisButtonElement) {
      this.instrumentCrisisButton(this.crisisButtonElement);
    }

    // Watch for crisis button being added dynamically
    const observer = new MutationObserver(() => {
      if (!this.crisisButtonElement) {
        const button = findCrisisButton();
        if (button) {
          this.crisisButtonElement = button;
          this.instrumentCrisisButton(button);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private instrumentCrisisButton(button: HTMLElement): void {
    // Monitor crisis button interaction timing
    const measureInteraction = (eventType: string) => {
      const startTime = performance.now();
      
      // Wait for next frame to measure visual update
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const interactionTime = endTime - startTime;
        
        // Report if crisis button response is slow
        if (interactionTime > 100) { // 100ms threshold for crisis interactions
          this.reportCrisisButtonSlowness(eventType, interactionTime);
        }
      });
    };

    button.addEventListener('click', () => measureInteraction('click'), { passive: true });
    button.addEventListener('touchstart', () => measureInteraction('touchstart'), { passive: true });
  }

  private analyzeLCPDesignImpact(entry: PerformanceEntry): DesignElementImpact[] {
    const impacts: DesignElementImpact[] = [];
    
    // Check if LCP element has design enhancements that could slow rendering
    const lcpElement = (entry as any).element;
    if (lcpElement) {
      const computedStyle = window.getComputedStyle(lcpElement);
      
      // Check for backdrop-filter
      if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
        impacts.push({
          element: lcpElement.tagName.toLowerCase(),
          type: 'glassomorphism',
          impactLevel: 'high',
          performanceCost: this.estimateBackdropFilterCost(),
          optimizationApplied: []
        });
      }
      
      // Check for complex gradients
      if (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('gradient')) {
        impacts.push({
          element: lcpElement.tagName.toLowerCase(),
          type: 'gradient',
          impactLevel: 'medium',
          performanceCost: this.estimateGradientCost(),
          optimizationApplied: []
        });
      }
      
      // Check for box shadows
      if (computedStyle.boxShadow && computedStyle.boxShadow !== 'none') {
        impacts.push({
          element: lcpElement.tagName.toLowerCase(),
          type: 'shadow',
          impactLevel: 'low',
          performanceCost: this.estimateShadowCost(),
          optimizationApplied: []
        });
      }
    }
    
    return impacts;
  }

  private analyzeFIDDesignImpact(entry: any, fid: number): DesignElementImpact[] {
    const impacts: DesignElementImpact[] = [];
    
    // Check for animations running during input
    const animatedElements = document.querySelectorAll('[class*="animate"], [style*="animation"]');
    if (animatedElements.length > 0) {
      impacts.push({
        element: 'animated-elements',
        type: 'animation',
        impactLevel: animatedElements.length > 5 ? 'high' : 'medium',
        performanceCost: animatedElements.length * 10, // Rough estimate
        optimizationApplied: []
      });
    }
    
    // Check for backdrop-filter elements that might block main thread
    const glassElements = document.querySelectorAll('[style*="backdrop-filter"]');
    if (glassElements.length > 0) {
      impacts.push({
        element: 'glass-morphism-elements',
        type: 'glassomorphism',
        impactLevel: 'high',
        performanceCost: glassElements.length * 15,
        optimizationApplied: []
      });
    }
    
    return impacts;
  }

  private analyzeCLSDesignImpact(entry: any): DesignElementImpact[] {
    const impacts: DesignElementImpact[] = [];
    
    // Analyze layout shift sources
    if (entry.sources) {
      entry.sources.forEach((source: any) => {
        const element = source.node;
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          
          // Check if element has dynamic sizing that could cause shifts
          if (!element.style.width && !element.style.height) {
            impacts.push({
              element: element.tagName.toLowerCase(),
              type: 'typography',
              impactLevel: 'medium',
              performanceCost: entry.value * 1000, // Convert to ms equivalent
              optimizationApplied: []
            });
          }
        }
      });
    }
    
    return impacts;
  }

  private analyzeINPDesignImpact(entry: any, inp: number, isCrisisInteraction: boolean): DesignElementImpact[] {
    const impacts: DesignElementImpact[] = [];
    
    // Crisis interactions get special attention
    if (isCrisisInteraction && inp > 100) {
      impacts.push({
        element: 'crisis-button',
        type: 'animation',
        impactLevel: 'critical',
        performanceCost: inp,
        optimizationApplied: []
      });
    }
    
    return impacts;
  }

  private isCrisisButtonInteraction(entry: any): boolean {
    // Check if interaction was with crisis button
    const target = entry.target;
    return target && (
      target.classList?.contains('crisis-button') ||
      target.classList?.contains('emergency-button') ||
      target.hasAttribute?.('data-crisis-button')
    );
  }

  private estimateBackdropFilterCost(): number {
    // Estimate performance cost of backdrop-filter
    return 20; // milliseconds - rough estimate
  }

  private estimateGradientCost(): number {
    return 5; // milliseconds
  }

  private estimateShadowCost(): number {
    return 3; // milliseconds
  }

  private analyzeNewElement(element: Element): void {
    // Check if new element has performance-impacting styles
    const computedStyle = window.getComputedStyle(element);
    
    if (computedStyle.backdropFilter && computedStyle.backdropFilter !== 'none') {
      this.optimizeGlassMorphism(element);
    }
    
    if (computedStyle.animation && computedStyle.animation !== 'none') {
      this.optimizeAnimation(element);
    }
  }

  private analyzeElementChange(element: Element, attributeName: string | null): void {
    if (attributeName === 'style' || attributeName === 'class') {
      this.analyzeNewElement(element);
    }
  }

  private analyzeElementResize(entry: ResizeObserverEntry): void {
    // Monitor for unexpected size changes that could cause CLS
    const element = entry.target;
    
    // If element doesn't have explicit dimensions, it might cause CLS
    if (!element.style.width && !element.style.height) {
      console.warn('Element without explicit dimensions detected:', element);
      this.applyCLSPrevention(element);
    }
  }

  private setupAutomaticOptimization(): void {
    // Monitor for performance issues and apply optimizations
    setInterval(() => {
      this.analyzeRecentPerformance();
    }, 10000); // Check every 10 seconds
  }

  private analyzeRecentPerformance(): void {
    const recentData = this.vitalsData.filter(data => Date.now() - data.timestamp < 30000); // Last 30 seconds
    
    // Check for performance regressions
    recentData.forEach(data => {
      if (data.rating === 'poor') {
        this.applyAutomaticOptimizations(data);
      }
    });
  }

  private applyAutomaticOptimizations(vitalsData: WebVitalsData): void {
    vitalsData.designElements.forEach(element => {
      switch (element.type) {
        case 'glassomorphism':
          this.optimizeGlassMorphismGlobal();
          break;
        case 'animation':
          this.optimizeAnimationsGlobal();
          break;
        case 'gradient':
          this.optimizeGradientsGlobal();
          break;
      }
    });
  }

  private optimizeGlassMorphism(element: Element): void {
    // Reduce backdrop-filter on low-end devices
    if (this.isLowEndDevice()) {
      (element as HTMLElement).style.backdropFilter = 'blur(4px)';
    }
  }

  private optimizeAnimation(element: Element): void {
    // Reduce animation duration for performance
    (element as HTMLElement).style.animationDuration = '0.1s';
  }

  private optimizeGlassMorphismGlobal(): void {
    if (this.isLowEndDevice()) {
      document.documentElement.style.setProperty('--backdrop-blur', 'blur(4px)');
    }
  }

  private optimizeAnimationsGlobal(): void {
    document.documentElement.style.setProperty('--duration-fast', '50ms');
    document.documentElement.style.setProperty('--duration-base', '100ms');
  }

  private optimizeGradientsGlobal(): void {
    // Simplify gradients for performance
    const style = document.createElement('style');
    style.textContent = `
      .performance-optimized * {
        background-image: none !important;
      }
      .performance-optimized body {
        background: var(--sage-primary) !important;
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add('performance-optimized');
  }

  private applyCLSPrevention(element: Element): void {
    // Add explicit dimensions to prevent CLS
    const rect = element.getBoundingClientRect();
    (element as HTMLElement).style.minHeight = `${rect.height}px`;
    (element as HTMLElement).style.minWidth = `${rect.width}px`;
  }

  private isLowEndDevice(): boolean {
    const nav = navigator as any;
    const memory = nav.deviceMemory || 4;
    const cores = nav.hardwareConcurrency || 4;
    return memory < 2 || cores < 4;
  }

  private processVitalsData(data: WebVitalsData): void {
    this.vitalsData.push(data);
    
    // Keep only recent data
    if (this.vitalsData.length > 1000) {
      this.vitalsData = this.vitalsData.slice(-500);
    }
    
    // Check thresholds and alert if necessary
    this.checkThresholds(data);
    
    // Debug logging
    if (this.config.enableDebugMode) {
      console.log(`Core Web Vitals - ${data.metric}:`, data);
    }
    
    // Send to analytics
    this.reportToAnalytics(data);
  }

  private checkThresholds(data: WebVitalsData): void {
    const threshold = this.config.thresholds[data.metric];
    if (!threshold) return;
    
    if (data.value > threshold.poor) {
      this.sendAlert({
        type: 'threshold_exceeded',
        metric: data.metric,
        value: data.value,
        threshold: threshold.poor,
        designElementsCausing: data.designElements.map(e => e.element),
        severity: 'critical',
        recommendations: this.getRecommendations(data),
        timestamp: Date.now()
      });
    } else if (data.value > threshold.good) {
      this.sendAlert({
        type: 'threshold_exceeded',
        metric: data.metric,
        value: data.value,
        threshold: threshold.good,
        designElementsCausing: data.designElements.map(e => e.element),
        severity: 'warning',
        recommendations: this.getRecommendations(data),
        timestamp: Date.now()
      });
    }
  }

  private getRecommendations(data: WebVitalsData): string[] {
    const recommendations: string[] = [];
    
    data.designElements.forEach(element => {
      switch (element.type) {
        case 'glassomorphism':
          recommendations.push('Reduce backdrop-filter blur radius on low-end devices');
          recommendations.push('Use will-change: backdrop-filter sparingly');
          break;
        case 'animation':
          recommendations.push('Use transform and opacity for animations');
          recommendations.push('Add animation-fill-mode: both to prevent layout shifts');
          break;
        case 'gradient':
          recommendations.push('Use simpler gradients or solid colors on slow devices');
          break;
      }
    });
    
    return recommendations;
  }

  private reportCrisisButtonSlowness(eventType: string, interactionTime: number): void {
    this.sendAlert({
      type: 'crisis_impact',
      metric: 'crisis_button_response',
      value: interactionTime,
      threshold: 100,
      designElementsCausing: ['crisis-button'],
      severity: 'critical',
      recommendations: [
        'Crisis button response too slow',
        'Disable animations on crisis button in performance mode',
        'Use simpler styling for crisis elements'
      ],
      timestamp: Date.now()
    });
  }

  private async sendAlert(alert: PerformanceAlert): Promise<void> {
    try {
      // Send to monitoring endpoint
      await fetch('/api/monitoring/web-vitals-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      
      // Send to webhook if configured
      if (this.config.alertWebhook) {
        await fetch(this.config.alertWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        });
      }
    } catch (error) {
      console.warn('Failed to send performance alert:', error);
    }
  }

  private async reportToAnalytics(data: WebVitalsData): Promise<void> {
    try {
      await fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.warn('Failed to report web vitals to analytics:', error);
    }
  }

  private setupReporting(): void {
    // Report metrics periodically
    setInterval(() => {
      this.generatePerformanceReport();
    }, 60000); // Every minute
    
    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.generatePerformanceReport();
    });
  }

  private generatePerformanceReport(): void {
    const report = {
      timestamp: Date.now(),
      vitalsData: this.vitalsData.slice(-10), // Last 10 measurements
      designElementsActive: this.getActiveDesignElements(),
      optimizationsApplied: this.getAppliedOptimizations(),
      deviceInfo: this.getDeviceInfo()
    };
    
    // Send beacon for reliability
    if ('sendBeacon' in navigator) {
      navigator.sendBeacon('/api/monitoring/web-vitals-report', JSON.stringify(report));
    }
  }

  private getActiveDesignElements(): string[] {
    const elements: string[] = [];
    
    Object.entries(DESIGN_ELEMENT_SELECTORS).forEach(([type, selector]) => {
      if (document.querySelector(selector)) {
        elements.push(type);
      }
    });
    
    return elements;
  }

  private getAppliedOptimizations(): string[] {
    const optimizations: string[] = [];
    
    if (document.body.classList.contains('performance-optimized')) {
      optimizations.push('gradient-simplification');
    }
    
    if (document.documentElement.style.getPropertyValue('--duration-fast') === '50ms') {
      optimizations.push('animation-acceleration');
    }
    
    return optimizations;
  }

  private getDeviceInfo(): any {
    const nav = navigator as any;
    return {
      memory: nav.deviceMemory || 'unknown',
      cores: nav.hardwareConcurrency || 'unknown',
      connection: nav.connection?.effectiveType || 'unknown',
      userAgent: navigator.userAgent
    };
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = this.config.thresholds[metric as keyof typeof this.config.thresholds];
    if (!thresholds) return 'good';
    
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Public API
  public getVitalsData(): WebVitalsData[] {
    return [...this.vitalsData];
  }

  public getLatestMetrics(): Record<string, WebVitalsData | null> {
    const latest: Record<string, WebVitalsData | null> = {
      LCP: null,
      FID: null,
      CLS: null,
      INP: null
    };
    
    this.vitalsData.forEach(data => {
      if (!latest[data.metric] || data.timestamp > latest[data.metric]!.timestamp) {
        latest[data.metric] = data;
      }
    });
    
    return latest;
  }

  public enableCrisisMode(): void {
    this.config.crisisMode = true;
    // Apply immediate optimizations for crisis mode
    this.optimizeAnimationsGlobal();
    this.optimizeGlassMorphismGlobal();
  }

  public disableCrisisMode(): void {
    this.config.crisisMode = false;
  }

  public cleanup(): void {
    this.isMonitoring = false;
    
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }
}

// Global instance
export const webVitalsDesignMonitor = new CoreWebVitalsDesignMonitor();

// React hook
export const useWebVitalsMonitoring = () => {
  return {
    getVitalsData: () => webVitalsDesignMonitor.getVitalsData(),
    getLatestMetrics: () => webVitalsDesignMonitor.getLatestMetrics(),
    enableCrisisMode: () => webVitalsDesignMonitor.enableCrisisMode(),
    disableCrisisMode: () => webVitalsDesignMonitor.disableCrisisMode()
  };
};

export default webVitalsDesignMonitor;