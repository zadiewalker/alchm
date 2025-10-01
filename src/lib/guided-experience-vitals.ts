/**
 * ALCHM Guided Experience Core Web Vitals Monitor
 * Specialized monitoring for onboarding, analytics dashboards, and badge experiences
 * Ensures optimal performance during vulnerable user interactions
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB, onINP } from 'web-vitals';
import type { Metric } from 'web-vitals';
import { mobilePerformanceMonitor } from './mobile-performance-monitor';
import { analyticsPerformanceOptimizer } from './analytics-performance-optimizer';

interface GuidedExperienceVitals {
  experienceId: string;
  experienceType: 'onboarding' | 'analytics_dashboard' | 'badge_journey' | 'crisis_support' | 'journal_guidance';
  step: string;
  metrics: {
    lcp: number | null;
    fid: number | null;
    inp: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
    tbt: number | null; // Total Blocking Time
    tti: number | null; // Time to Interactive
  };
  userContext: {
    isFirstTime: boolean;
    isVulnerable: boolean;
    deviceTier: string;
    networkQuality: string;
    emotionalState: 'stable' | 'processing' | 'vulnerable' | 'crisis';
  };
  timestamp: number;
  sessionId: string;
}

interface ExperiencePerformanceBudget {
  lcp: { excellent: number; good: number; poor: number };
  fid: { excellent: number; good: number; poor: number };
  inp: { excellent: number; good: number; poor: number };
  cls: { excellent: number; good: number; poor: number };
  fcp: { excellent: number; good: number; poor: number };
  tti: { excellent: number; good: number; poor: number };
}

interface PerformanceAlert {
  experienceId: string;
  step: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'warning' | 'critical' | 'emergency';
  userImpact: 'low' | 'medium' | 'high' | 'crisis';
  timestamp: number;
  recommendedActions: string[];
}

// Performance budgets for different guided experiences
const EXPERIENCE_BUDGETS: Record<string, ExperiencePerformanceBudget> = {
  // Crisis support has the strictest budgets
  crisis_support: {
    lcp: { excellent: 800, good: 1200, poor: 1800 },
    fid: { excellent: 30, good: 50, poor: 100 },
    inp: { excellent: 50, good: 100, poor: 200 },
    cls: { excellent: 0.02, good: 0.05, poor: 0.1 },
    fcp: { excellent: 600, good: 900, poor: 1200 },
    tti: { excellent: 1500, good: 2000, poor: 3000 }
  },

  // Onboarding needs to be fast to prevent dropoff
  onboarding: {
    lcp: { excellent: 1000, good: 1500, poor: 2500 },
    fid: { excellent: 50, good: 100, poor: 200 },
    inp: { excellent: 100, good: 200, poor: 400 },
    cls: { excellent: 0.05, good: 0.1, poor: 0.2 },
    fcp: { excellent: 800, good: 1200, poor: 1800 },
    tti: { excellent: 2000, good: 3000, poor: 5000 }
  },

  // Journal guidance should be responsive
  journal_guidance: {
    lcp: { excellent: 1200, good: 1800, poor: 2500 },
    fid: { excellent: 75, good: 150, poor: 300 },
    inp: { excellent: 150, good: 250, poor: 500 },
    cls: { excellent: 0.08, good: 0.15, poor: 0.25 },
    fcp: { excellent: 1000, good: 1500, poor: 2000 },
    tti: { excellent: 2500, good: 3500, poor: 5000 }
  },

  // Analytics dashboard can be more relaxed but should still be smooth
  analytics_dashboard: {
    lcp: { excellent: 1500, good: 2500, poor: 3500 },
    fid: { excellent: 100, good: 200, poor: 400 },
    inp: { excellent: 200, good: 350, poor: 600 },
    cls: { excellent: 0.1, good: 0.2, poor: 0.3 },
    fcp: { excellent: 1200, good: 1800, poor: 2500 },
    tti: { excellent: 3000, good: 4000, poor: 6000 }
  },

  // Badge journey should feel rewarding and smooth
  badge_journey: {
    lcp: { excellent: 1200, good: 2000, poor: 3000 },
    fid: { excellent: 75, good: 150, poor: 300 },
    inp: { excellent: 150, good: 300, poor: 500 },
    cls: { excellent: 0.08, good: 0.15, poor: 0.25 },
    fcp: { excellent: 1000, good: 1500, poor: 2200 },
    tti: { excellent: 2500, good: 3500, poor: 5000 }
  }
};

export class GuidedExperienceVitalsMonitor {
  private currentExperience: {
    id: string;
    type: keyof typeof EXPERIENCE_BUDGETS;
    step: string;
    startTime: number;
    isVulnerable: boolean;
  } | null = null;

  private vitalsData: Partial<GuidedExperienceVitals> = {};
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private experienceHistory: GuidedExperienceVitals[] = [];
  private isMonitoring = false;
  private sessionId = `guided_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  constructor() {
    this.initializeVitalsMonitoring();
  }

  /**
   * Initialize Core Web Vitals monitoring for guided experiences
   */
  private initializeVitalsMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.isMonitoring = true;

    // Initialize web vitals with custom handlers
    this.setupWebVitalsCollection();
    
    // Setup additional performance observers
    this.setupCustomPerformanceObservers();

    console.log('📊 Guided experience vitals monitoring initialized');
  }

  /**
   * Setup Web Vitals collection with guided experience context
   */
  private setupWebVitalsCollection(): void {
    // Largest Contentful Paint
    getLCP((metric: Metric) => {
      this.handleVitalsMetric('lcp', metric.value);
    });

    // First Input Delay
    getFID((metric: Metric) => {
      this.handleVitalsMetric('fid', metric.value);
    });

    // Interaction to Next Paint (replacing FID)
    onINP((metric: Metric) => {
      this.handleVitalsMetric('inp', metric.value);
    });

    // Cumulative Layout Shift
    getCLS((metric: Metric) => {
      this.handleVitalsMetric('cls', metric.value);
    });

    // First Contentful Paint
    getFCP((metric: Metric) => {
      this.handleVitalsMetric('fcp', metric.value);
    });

    // Time to First Byte
    getTTFB((metric: Metric) => {
      this.handleVitalsMetric('ttfb', metric.value);
    });
  }

  /**
   * Setup custom performance observers for guided experiences
   */
  private setupCustomPerformanceObservers(): void {
    if ('PerformanceObserver' in window) {
      // Monitor long tasks during guided experiences
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          if (!this.currentExperience) return;

          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.duration > 50) {
              this.handleLongTask(entry);
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (e) {
        console.warn('Long task monitoring not available');
      }

      // Monitor navigation timing for experience transitions
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries() as PerformanceNavigationTiming[];
          entries.forEach((entry) => {
            this.vitalsData.metrics = {
              ...this.vitalsData.metrics,
              tti: entry.domInteractive - entry.navigationStart,
              ttfb: entry.responseStart - entry.requestStart
            };
          });
        });

        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (e) {
        console.warn('Navigation timing monitoring not available');
      }
    }
  }

  /**
   * Handle Web Vitals metric collection
   */
  private handleVitalsMetric(metric: keyof GuidedExperienceVitals['metrics'], value: number): void {
    if (!this.currentExperience) return;

    // Update vitals data
    if (!this.vitalsData.metrics) {
      this.vitalsData.metrics = {
        lcp: null,
        fid: null,
        inp: null,
        cls: null,
        fcp: null,
        ttfb: null,
        tbt: null,
        tti: null
      };
    }

    this.vitalsData.metrics[metric] = value;

    // Check performance budgets
    this.checkPerformanceBudget(metric, value);

    // Log metric for vulnerable users
    if (this.currentExperience.isVulnerable) {
      console.log(`🔍 Vulnerable user metric - ${metric}: ${value}ms`, {
        experience: this.currentExperience.type,
        step: this.currentExperience.step,
        value,
        budget: this.getMetricBudget(metric)
      });
    }
  }

  /**
   * Handle long tasks during guided experiences
   */
  private handleLongTask(entry: PerformanceEntry): void {
    if (!this.currentExperience) return;

    // Long tasks are especially problematic during guided experiences
    const severity = entry.duration > 200 ? 'critical' : 
                    entry.duration > 100 ? 'warning' : 'info';

    this.createAlert({
      experienceId: this.currentExperience.id,
      step: this.currentExperience.step,
      metric: 'long_task',
      value: entry.duration,
      threshold: 50,
      severity: severity as 'warning' | 'critical',
      userImpact: this.currentExperience.isVulnerable ? 'crisis' : 'medium',
      recommendedActions: [
        'Break up long JavaScript tasks',
        'Use requestIdleCallback for non-critical work',
        'Consider deferring non-essential features'
      ]
    });

    // For vulnerable users, take immediate action
    if (this.currentExperience.isVulnerable && entry.duration > 100) {
      this.triggerEmergencyOptimizations();
    }
  }

  /**
   * Start monitoring a guided experience
   */
  public startExperienceMonitoring(
    experienceId: string,
    experienceType: keyof typeof EXPERIENCE_BUDGETS,
    step: string = 'start',
    userContext: {
      isFirstTime?: boolean;
      isVulnerable?: boolean;
      emotionalState?: 'stable' | 'processing' | 'vulnerable' | 'crisis';
    } = {}
  ): void {
    // Complete previous experience if exists
    if (this.currentExperience) {
      this.completeExperienceMonitoring();
    }

    this.currentExperience = {
      id: experienceId,
      type: experienceType,
      step,
      startTime: performance.now(),
      isVulnerable: userContext.isVulnerable || userContext.emotionalState === 'vulnerable' || userContext.emotionalState === 'crisis'
    };

    // Reset vitals data for new experience
    this.vitalsData = {
      experienceId,
      experienceType,
      step,
      metrics: {
        lcp: null,
        fid: null,
        inp: null,
        cls: null,
        fcp: null,
        ttfb: null,
        tbt: null,
        tti: null
      },
      userContext: {
        isFirstTime: userContext.isFirstTime || false,
        isVulnerable: this.currentExperience.isVulnerable,
        deviceTier: mobilePerformanceMonitor.getDeviceTier(),
        networkQuality: this.getNetworkQuality(),
        emotionalState: userContext.emotionalState || 'stable'
      },
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    console.log(`📈 Started monitoring guided experience: ${experienceType}/${step}`, {
      isVulnerable: this.currentExperience.isVulnerable,
      deviceTier: this.vitalsData.userContext?.deviceTier,
      budgets: EXPERIENCE_BUDGETS[experienceType]
    });
  }

  /**
   * Update current experience step
   */
  public updateExperienceStep(step: string): void {
    if (!this.currentExperience) return;

    const previousStep = this.currentExperience.step;
    this.currentExperience.step = step;

    if (this.vitalsData) {
      this.vitalsData.step = step;
    }

    console.log(`🔄 Experience step updated: ${previousStep} → ${step}`);
  }

  /**
   * Complete experience monitoring and save data
   */
  public completeExperienceMonitoring(): GuidedExperienceVitals | null {
    if (!this.currentExperience || !this.vitalsData) return null;

    const duration = performance.now() - this.currentExperience.startTime;
    
    // Create final experience record
    const experienceRecord: GuidedExperienceVitals = {
      ...this.vitalsData,
      timestamp: Date.now()
    } as GuidedExperienceVitals;

    // Add to history
    this.experienceHistory.push(experienceRecord);

    // Keep history manageable
    if (this.experienceHistory.length > 50) {
      this.experienceHistory = this.experienceHistory.slice(-25);
    }

    // Generate experience report
    const report = this.generateExperienceReport(experienceRecord);

    // Send to analytics if in production
    if (process.env.NODE_ENV === 'production') {
      this.sendExperienceData(experienceRecord, report);
    }

    console.log(`✅ Completed monitoring: ${this.currentExperience.type}/${this.currentExperience.step}`, {
      duration: Math.round(duration),
      metrics: experienceRecord.metrics,
      alerts: this.alerts.filter(a => a.experienceId === this.currentExperience?.id).length
    });

    // Reset current experience
    this.currentExperience = null;
    this.vitalsData = {};

    return experienceRecord;
  }

  /**
   * Check performance against budget thresholds
   */
  private checkPerformanceBudget(metric: keyof GuidedExperienceVitals['metrics'], value: number): void {
    if (!this.currentExperience) return;

    const budget = this.getMetricBudget(metric);
    if (!budget) return;

    let severity: 'warning' | 'critical' | 'emergency' = 'warning';
    let userImpact: 'low' | 'medium' | 'high' | 'crisis' = 'low';

    // Determine severity based on budget exceedance
    if (value > budget.poor) {
      severity = 'critical';
      userImpact = this.currentExperience.isVulnerable ? 'crisis' : 'high';
    } else if (value > budget.good) {
      severity = 'warning';
      userImpact = this.currentExperience.isVulnerable ? 'high' : 'medium';
    } else {
      return; // Performance is acceptable
    }

    // Create performance alert
    this.createAlert({
      experienceId: this.currentExperience.id,
      step: this.currentExperience.step,
      metric,
      value,
      threshold: budget.good,
      severity,
      userImpact,
      recommendedActions: this.getMetricRecommendations(metric, value, budget)
    });

    // Emergency response for vulnerable users
    if (userImpact === 'crisis') {
      this.triggerEmergencyOptimizations();
    }
  }

  /**
   * Get metric budget for current experience
   */
  private getMetricBudget(metric: keyof GuidedExperienceVitals['metrics']): ExperiencePerformanceBudget[keyof ExperiencePerformanceBudget] | null {
    if (!this.currentExperience) return null;

    const experienceBudgets = EXPERIENCE_BUDGETS[this.currentExperience.type];
    return experienceBudgets?.[metric] || null;
  }

  /**
   * Get recommendations for metric optimization
   */
  private getMetricRecommendations(
    metric: string,
    value: number,
    budget: ExperiencePerformanceBudget[keyof ExperiencePerformanceBudget]
  ): string[] {
    const recommendations: string[] = [];

    switch (metric) {
      case 'lcp':
        recommendations.push('Preload critical images and resources');
        recommendations.push('Optimize server response time');
        recommendations.push('Remove render-blocking resources');
        break;
      
      case 'fid':
      case 'inp':
        recommendations.push('Break up long JavaScript tasks');
        recommendations.push('Use requestIdleCallback for background work');
        recommendations.push('Optimize event handlers');
        break;
      
      case 'cls':
        recommendations.push('Set size attributes on media');
        recommendations.push('Reserve space for dynamic content');
        recommendations.push('Use CSS transforms instead of changing layout properties');
        break;
      
      case 'fcp':
        recommendations.push('Inline critical CSS');
        recommendations.push('Minimize render-blocking resources');
        recommendations.push('Optimize web fonts loading');
        break;
      
      case 'tti':
        recommendations.push('Reduce JavaScript bundle size');
        recommendations.push('Code split non-critical features');
        recommendations.push('Defer non-essential scripts');
        break;
    }

    // Add experience-specific recommendations
    if (this.currentExperience?.isVulnerable) {
      recommendations.push('Consider crisis mode optimizations');
      recommendations.push('Prioritize essential functionality only');
    }

    return recommendations;
  }

  /**
   * Create performance alert
   */
  private createAlert(alert: Omit<PerformanceAlert, 'timestamp'>): void {
    const fullAlert: PerformanceAlert = {
      ...alert,
      timestamp: Date.now()
    };

    this.alerts.push(fullAlert);

    // Keep alerts manageable
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }

    // Log critical alerts immediately
    if (alert.severity === 'critical' || alert.userImpact === 'crisis') {
      console.error('🚨 Critical guided experience performance alert:', fullAlert);
    }
  }

  /**
   * Trigger emergency optimizations for vulnerable users
   */
  private triggerEmergencyOptimizations(): void {
    console.warn('🚨 Triggering emergency optimizations for vulnerable user');

    // Notify performance optimizer
    analyticsPerformanceOptimizer.addToDeferredQueue({
      id: `emergency_optimization_${Date.now()}`,
      operation: async () => {
        // Disable non-essential features
        this.disableNonEssentialFeatures();
        
        // Reduce visual complexity
        this.enableMinimalMode();
        
        // Free up memory
        this.forceMemoryCleanup();
      },
      priority: 'critical',
      category: 'ui',
      estimatedCost: 50,
      retryCount: 0,
      maxRetries: 1
    });
  }

  /**
   * Disable non-essential features during performance issues
   */
  private disableNonEssentialFeatures(): void {
    const style = document.createElement('style');
    style.id = 'guided-experience-emergency-mode';
    style.textContent = `
      /* Hide non-essential guided experience elements */
      .analytics-charts,
      .badge-animations,
      .decorative-elements,
      .background-effects {
        display: none !important;
      }
      
      /* Simplify remaining elements */
      .guided-step {
        animation: none !important;
        transition: none !important;
      }
      
      /* Reduce visual complexity */
      .gradient-background {
        background: #f9f9f9 !important;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Enable minimal mode for performance
   */
  private enableMinimalMode(): void {
    document.body.classList.add('guided-experience-minimal-mode');
  }

  /**
   * Force memory cleanup
   */
  private forceMemoryCleanup(): void {
    // Clear any cached data specific to guided experiences
    this.experienceHistory = this.experienceHistory.slice(-5); // Keep only recent
    this.alerts = this.alerts.slice(-10); // Keep only recent alerts

    // Request garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  }

  /**
   * Generate experience performance report
   */
  private generateExperienceReport(experience: GuidedExperienceVitals): {
    overallScore: number;
    categoryScores: Record<string, number>;
    issues: string[];
    recommendations: string[];
  } {
    const budgets = EXPERIENCE_BUDGETS[experience.experienceType];
    let totalScore = 0;
    let categoryCount = 0;

    const categoryScores: Record<string, number> = {};
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Score each metric
    Object.entries(experience.metrics).forEach(([metric, value]) => {
      if (value === null) return;

      const budget = budgets[metric as keyof typeof budgets];
      if (!budget) return;

      let score = 100;
      if (value > budget.poor) {
        score = 0;
        issues.push(`${metric.toUpperCase()} is poor (${value}ms > ${budget.poor}ms)`);
      } else if (value > budget.good) {
        score = 50;
        issues.push(`${metric.toUpperCase()} needs improvement (${value}ms > ${budget.good}ms)`);
      } else if (value > budget.excellent) {
        score = 80;
      }

      categoryScores[metric] = score;
      totalScore += score;
      categoryCount++;
    });

    const overallScore = categoryCount > 0 ? totalScore / categoryCount : 100;

    // Generate recommendations based on issues
    if (issues.length > 0) {
      recommendations.push('Consider optimizing critical rendering path');
      
      if (experience.userContext.isVulnerable) {
        recommendations.push('Implement crisis-safe performance mode');
      }
      
      if (['ultra-low', 'low'].includes(experience.userContext.deviceTier)) {
        recommendations.push('Apply low-end device optimizations');
      }
    }

    return {
      overallScore,
      categoryScores,
      issues,
      recommendations
    };
  }

  /**
   * Send experience data to analytics
   */
  private async sendExperienceData(
    experience: GuidedExperienceVitals,
    report: ReturnType<typeof this.generateExperienceReport>
  ): Promise<void> {
    try {
      await fetch('/api/analytics/guided-experience-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience,
          report,
          alerts: this.alerts.filter(a => a.experienceId === experience.experienceId)
        })
      });
    } catch (error) {
      console.warn('Failed to send guided experience vitals:', error);
    }
  }

  /**
   * Get network quality
   */
  private getNetworkQuality(): string {
    const connection = (navigator as any).connection;
    if (!connection) return 'unknown';

    const effectiveType = connection.effectiveType || 'unknown';
    const rtt = connection.rtt || 0;

    if (rtt > 1000 || effectiveType === 'slow-2g') return 'critical';
    if (rtt > 500 || effectiveType === '2g') return 'poor';
    if (rtt > 200 || effectiveType === '3g') return 'good';
    return 'excellent';
  }

  /**
   * Get current experience data
   */
  public getCurrentExperience(): {
    experience: typeof this.currentExperience;
    vitals: Partial<GuidedExperienceVitals>;
    alerts: PerformanceAlert[];
  } {
    return {
      experience: this.currentExperience,
      vitals: this.vitalsData,
      alerts: this.alerts.filter(a => a.experienceId === this.currentExperience?.id)
    };
  }

  /**
   * Get experience history
   */
  public getExperienceHistory(): GuidedExperienceVitals[] {
    return [...this.experienceHistory];
  }

  /**
   * Get alerts for specific experience
   */
  public getExperienceAlerts(experienceId?: string): PerformanceAlert[] {
    if (experienceId) {
      return this.alerts.filter(a => a.experienceId === experienceId);
    }
    return [...this.alerts];
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    
    // Remove emergency styles
    const emergencyStyle = document.getElementById('guided-experience-emergency-mode');
    if (emergencyStyle) {
      emergencyStyle.remove();
    }
    
    document.body.classList.remove('guided-experience-minimal-mode');
    
    this.isMonitoring = false;
  }
}

// Global guided experience vitals monitor
export const guidedExperienceVitals = new GuidedExperienceVitalsMonitor();

// React hook for guided experience monitoring
export const useGuidedExperienceVitals = () => {
  return {
    startMonitoring: (
      experienceId: string,
      experienceType: keyof typeof EXPERIENCE_BUDGETS,
      step?: string,
      userContext?: Parameters<typeof guidedExperienceVitals.startExperienceMonitoring>[3]
    ) => guidedExperienceVitals.startExperienceMonitoring(experienceId, experienceType, step, userContext),
    
    updateStep: (step: string) => guidedExperienceVitals.updateExperienceStep(step),
    
    completeMonitoring: () => guidedExperienceVitals.completeExperienceMonitoring(),
    
    getCurrentData: () => guidedExperienceVitals.getCurrentExperience(),
    
    getHistory: () => guidedExperienceVitals.getExperienceHistory(),
    
    getAlerts: (experienceId?: string) => guidedExperienceVitals.getExperienceAlerts(experienceId)
  };
};

export default guidedExperienceVitals;