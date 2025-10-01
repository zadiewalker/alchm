// Performance Alert System for ALCHM Dashboard
// Provides automated monitoring, alerting, and optimization triggers
import type { PerformanceAlert, DashboardNavigationMetrics } from './dashboardPerformanceMonitor';
import { monitor } from './monitoring';

export interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: DashboardNavigationMetrics) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cooldown: number; // milliseconds
  action: (metrics: DashboardNavigationMetrics) => Promise<void>;
  lastTriggered?: number;
  triggerCount: number;
}

export interface OptimizationAction {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<boolean>;
  impact: 'low' | 'medium' | 'high';
  risksUserExperience: boolean;
}

export interface PerformanceBudget {
  metric: keyof DashboardNavigationMetrics;
  target: number;
  warning: number;
  critical: number;
  unit: string;
}

class PerformanceAlertSystem {
  private static instance: PerformanceAlertSystem | null = null;
  private alertRules: AlertRule[] = [];
  private optimizationActions: OptimizationAction[] = [];
  private performanceBudgets: PerformanceBudget[] = [];
  private alertHistory: PerformanceAlert[] = [];
  private isInitialized = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAlertSystem();
    }
  }

  static getInstance(): PerformanceAlertSystem {
    if (!this.instance) {
      this.instance = new PerformanceAlertSystem();
    }
    return this.instance;
  }

  private initializeAlertSystem(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    this.setupPerformanceBudgets();
    this.setupAlertRules();
    this.setupOptimizationActions();
    
    console.log('🎯 Performance Alert System initialized');
  }

  private setupPerformanceBudgets(): void {
    this.performanceBudgets = [
      {
        metric: 'cardClickResponseTime',
        target: 50,
        warning: 75,
        critical: 100,
        unit: 'ms'
      },
      {
        metric: 'routeTransitionTime',
        target: 1200,
        warning: 2000,
        critical: 3000,
        unit: 'ms'
      },
      {
        metric: 'layoutShiftDuringNavigation',
        target: 0.05,
        warning: 0.1,
        critical: 0.25,
        unit: ''
      },
      {
        metric: 'domInteractionTime',
        target: 16,
        warning: 32,
        critical: 50,
        unit: 'ms'
      },
      {
        metric: 'paintTime',
        target: 800,
        warning: 1200,
        critical: 1800,
        unit: 'ms'
      }
    ];
  }

  private setupAlertRules(): void {
    this.alertRules = [
      {
        id: 'slow_navigation',
        name: 'Slow Navigation Detection',
        condition: (metrics) => metrics.routeTransitionTime > 2000,
        severity: 'high',
        cooldown: 300000, // 5 minutes
        action: this.handleSlowNavigation.bind(this),
        triggerCount: 0
      },
      {
        id: 'unresponsive_cards',
        name: 'Unresponsive Card Detection',
        condition: (metrics) => metrics.cardClickResponseTime > 100,
        severity: 'medium',
        cooldown: 180000, // 3 minutes
        action: this.handleUnresponsiveCards.bind(this),
        triggerCount: 0
      },
      {
        id: 'memory_leak',
        name: 'Memory Leak Detection',
        condition: (metrics) => {
          const increase = metrics.memoryUsageAfterNavigation - metrics.memoryUsageBeforeNavigation;
          return increase > 50 * 1024 * 1024; // 50MB increase
        },
        severity: 'high',
        cooldown: 600000, // 10 minutes
        action: this.handleMemoryLeak.bind(this),
        triggerCount: 0
      },
      {
        id: 'layout_instability',
        name: 'Layout Instability Detection',
        condition: (metrics) => metrics.layoutShiftDuringNavigation > 0.1,
        severity: 'medium',
        cooldown: 240000, // 4 minutes
        action: this.handleLayoutInstability.bind(this),
        triggerCount: 0
      },
      {
        id: 'critical_performance',
        name: 'Critical Performance Degradation',
        condition: (metrics) => 
          metrics.routeTransitionTime > 5000 || 
          metrics.cardClickResponseTime > 200,
        severity: 'critical',
        cooldown: 120000, // 2 minutes
        action: this.handleCriticalPerformance.bind(this),
        triggerCount: 0
      }
    ];
  }

  private setupOptimizationActions(): void {
    this.optimizationActions = [
      {
        id: 'preload_routes',
        name: 'Aggressive Route Preloading',
        description: 'Preload all critical dashboard routes',
        execute: this.enableAggressivePreloading.bind(this),
        impact: 'medium',
        risksUserExperience: false
      },
      {
        id: 'reduce_animations',
        name: 'Reduce Animations',
        description: 'Temporarily disable non-essential animations',
        execute: this.reduceAnimations.bind(this),
        impact: 'low',
        risksUserExperience: true
      },
      {
        id: 'optimize_images',
        name: 'Optimize Images',
        description: 'Apply aggressive image optimization',
        execute: this.optimizeImages.bind(this),
        impact: 'low',
        risksUserExperience: false
      },
      {
        id: 'clear_caches',
        name: 'Clear Caches',
        description: 'Clear browser caches and force reload',
        execute: this.clearCaches.bind(this),
        impact: 'high',
        risksUserExperience: true
      },
      {
        id: 'lazy_load_components',
        name: 'Enhanced Lazy Loading',
        description: 'Implement more aggressive component lazy loading',
        execute: this.enhanceLazyLoading.bind(this),
        impact: 'medium',
        risksUserExperience: false
      }
    ];
  }

  public processNavigationMetrics(metrics: DashboardNavigationMetrics): void {
    // Check performance budgets
    this.checkPerformanceBudgets(metrics);
    
    // Check alert rules
    this.checkAlertRules(metrics);
    
    // Store metrics for trend analysis
    this.analyzePerformanceTrends(metrics);
  }

  private checkPerformanceBudgets(metrics: DashboardNavigationMetrics): void {
    this.performanceBudgets.forEach(budget => {
      const value = metrics[budget.metric] as number;
      if (value === undefined) return;

      let status: 'good' | 'warning' | 'critical' = 'good';
      if (value > budget.critical) status = 'critical';
      else if (value > budget.warning) status = 'warning';

      if (status !== 'good') {
        console.warn(`📊 Performance Budget Exceeded: ${budget.metric} = ${value.toFixed(2)}${budget.unit} (${status})`);
        
        // Report to monitoring system
        monitor.reportError({
          message: `Performance budget exceeded: ${budget.metric}`,
          component: 'PerformanceBudget',
          timestamp: Date.now(),
          severity: status === 'critical' ? 'high' : 'medium',
          userAgent: navigator.userAgent,
          url: window.location.href,
          performanceMetrics: { [budget.metric]: value }
        });
      }
    });
  }

  private checkAlertRules(metrics: DashboardNavigationMetrics): void {
    const now = Date.now();

    this.alertRules.forEach(rule => {
      // Check cooldown
      if (rule.lastTriggered && (now - rule.lastTriggered) < rule.cooldown) {
        return;
      }

      // Check condition
      if (rule.condition(metrics)) {
        rule.triggerCount++;
        rule.lastTriggered = now;
        
        console.warn(`🚨 Alert Triggered: ${rule.name} (${rule.severity})`);
        
        // Execute action
        rule.action(metrics).catch(error => {
          console.error('Alert action failed:', error);
        });

        // Store alert
        const alert: PerformanceAlert = {
          type: rule.id as any,
          severity: rule.severity,
          metrics,
          timestamp: now,
          recommendations: this.getRecommendationsForAlert(rule.id)
        };

        this.alertHistory.push(alert);
        this.sendAlert(alert);
      }
    });
  }

  private getRecommendationsForAlert(ruleId: string): string[] {
    const recommendationMap: Record<string, string[]> = {
      slow_navigation: [
        'Enable route preloading for faster navigation',
        'Optimize bundle size and code splitting',
        'Check for blocking network requests',
        'Consider server-side rendering for critical routes'
      ],
      unresponsive_cards: [
        'Reduce JavaScript execution on main thread',
        'Optimize event handlers and reduce DOM manipulation',
        'Use CSS transforms for visual interactions',
        'Implement debouncing for frequent interactions'
      ],
      memory_leak: [
        'Check for unsubscribed event listeners',
        'Verify Firebase listeners are properly cleaned up',
        'Use React DevTools to identify memory leaks',
        'Consider implementing component cleanup strategies'
      ],
      layout_instability: [
        'Add skeleton screens for loading states',
        'Reserve space for dynamic content',
        'Optimize font loading with fallbacks',
        'Use CSS containment for better isolation'
      ],
      critical_performance: [
        'Immediately enable performance optimizations',
        'Consider redirecting to a lighter version of the page',
        'Check network connectivity and server status',
        'Alert development team for immediate investigation'
      ]
    };

    return recommendationMap[ruleId] || ['Investigate performance issue immediately'];
  }

  private async sendAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/dashboard-performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
    } catch (error) {
      // Fallback to local storage
      const storedAlerts = JSON.parse(localStorage.getItem('performance_alerts') || '[]');
      storedAlerts.push(alert);
      localStorage.setItem('performance_alerts', JSON.stringify(storedAlerts.slice(-50)));
    }
  }

  private analyzePerformanceTrends(metrics: DashboardNavigationMetrics): void {
    // Store metrics for trend analysis
    const storedMetrics = JSON.parse(localStorage.getItem('navigation_metrics') || '[]');
    storedMetrics.push(metrics);
    
    // Keep only recent metrics
    const recentMetrics = storedMetrics.slice(-20);
    localStorage.setItem('navigation_metrics', JSON.stringify(recentMetrics));

    // Analyze trends (if we have enough data)
    if (recentMetrics.length >= 10) {
      this.detectPerformanceTrends(recentMetrics);
    }
  }

  private detectPerformanceTrends(metrics: DashboardNavigationMetrics[]): void {
    const recentAvg = metrics.slice(-5).reduce((sum, m) => sum + m.routeTransitionTime, 0) / 5;
    const olderAvg = metrics.slice(0, 5).reduce((sum, m) => sum + m.routeTransitionTime, 0) / 5;
    
    // Check for degradation trend
    if (recentAvg > olderAvg * 1.5) {
      console.warn('📉 Performance degradation trend detected');
      this.triggerAutomaticOptimization('performance_degradation');
    }
  }

  private async triggerAutomaticOptimization(reason: string): Promise<void> {
    console.log(`🚀 Triggering automatic optimization: ${reason}`);

    // Execute safe optimizations first
    const safeOptimizations = this.optimizationActions.filter(action => 
      !action.risksUserExperience && action.impact !== 'low'
    );

    for (const optimization of safeOptimizations) {
      try {
        const success = await optimization.execute();
        if (success) {
          console.log(`✅ Optimization applied: ${optimization.name}`);
        }
      } catch (error) {
        console.error(`❌ Optimization failed: ${optimization.name}`, error);
      }
    }
  }

  // Alert action handlers
  private async handleSlowNavigation(metrics: DashboardNavigationMetrics): Promise<void> {
    await this.triggerAutomaticOptimization('slow_navigation');
  }

  private async handleUnresponsiveCards(metrics: DashboardNavigationMetrics): Promise<void> {
    // Reduce animations temporarily
    await this.reduceAnimations();
  }

  private async handleMemoryLeak(metrics: DashboardNavigationMetrics): Promise<void> {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear unnecessary caches
    await this.clearCaches();
  }

  private async handleLayoutInstability(metrics: DashboardNavigationMetrics): Promise<void> {
    // Enable skeleton screens
    document.body.classList.add('enable-skeleton-screens');
  }

  private async handleCriticalPerformance(metrics: DashboardNavigationMetrics): Promise<void> {
    console.error('🚨 CRITICAL PERFORMANCE ISSUE DETECTED');
    
    // Execute all safe optimizations immediately
    await this.triggerAutomaticOptimization('critical_performance');
    
    // Show user notification
    this.showPerformanceNotification();
  }

  // Optimization action implementations
  private async enableAggressivePreloading(): Promise<boolean> {
    try {
      const routes = ['/journals', '/pathways', '/onboarding'];
      for (const route of routes) {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            fetch(route).catch(() => {}); // Prefetch route
          });
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  private async reduceAnimations(): Promise<boolean> {
    try {
      const style = document.createElement('style');
      style.id = 'performance-optimization-animations';
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `;
      document.head.appendChild(style);
      
      // Remove after 30 seconds
      setTimeout(() => {
        const element = document.getElementById('performance-optimization-animations');
        if (element) element.remove();
      }, 30000);
      
      return true;
    } catch {
      return false;
    }
  }

  private async optimizeImages(): Promise<boolean> {
    try {
      const images = document.querySelectorAll('img:not([data-optimized])');
      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;
        imageElement.loading = 'lazy';
        imageElement.decoding = 'async';
        imageElement.setAttribute('data-optimized', 'true');
      });
      return true;
    } catch {
      return false;
    }
  }

  private async clearCaches(): Promise<boolean> {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage non-essential data
      const essentialKeys = ['auth_token', 'user_preferences'];
      Object.keys(localStorage).forEach(key => {
        if (!essentialKeys.some(essential => key.includes(essential))) {
          localStorage.removeItem(key);
        }
      });
      
      return true;
    } catch {
      return false;
    }
  }

  private async enhanceLazyLoading(): Promise<boolean> {
    try {
      // Add intersection observer for better lazy loading
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              element.classList.add('loaded');
              observer.unobserve(element);
            }
          });
        }, { rootMargin: '50px' });
        
        document.querySelectorAll('[data-lazy]').forEach(el => observer.observe(el));
      }
      
      return true;
    } catch {
      return false;
    }
  }

  private showPerformanceNotification(): void {
    // Create a subtle notification for users
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      backdrop-filter: blur(10px);
    `;
    notification.textContent = '🚀 Optimizing performance for better experience...';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Public API
  public getAlertHistory(): PerformanceAlert[] {
    return [...this.alertHistory];
  }

  public getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  public getPerformanceBudgets(): PerformanceBudget[] {
    return [...this.performanceBudgets];
  }

  public generateAlertReport(): string {
    const recentAlerts = this.alertHistory.filter(alert => 
      Date.now() - alert.timestamp < 3600000 // Last hour
    );

    let report = '🚨 Performance Alert Report\n';
    report += '=' .repeat(40) + '\n\n';

    if (recentAlerts.length === 0) {
      report += '✅ No performance alerts in the last hour\n';
    } else {
      report += `📊 ${recentAlerts.length} alerts in the last hour\n\n`;
      
      const alertsByType = recentAlerts.reduce((acc, alert) => {
        acc[alert.type] = (acc[alert.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      Object.entries(alertsByType).forEach(([type, count]) => {
        report += `  • ${type}: ${count} occurrence${count > 1 ? 's' : ''}\n`;
      });
    }

    return report;
  }
}

// Global instance
export const performanceAlertSystem = PerformanceAlertSystem.getInstance();

// React hook for performance alerts
export function usePerformanceAlerts() {
  return {
    processNavigationMetrics: (metrics: DashboardNavigationMetrics) => 
      performanceAlertSystem.processNavigationMetrics(metrics),
    getAlertHistory: () => performanceAlertSystem.getAlertHistory(),
    generateReport: () => performanceAlertSystem.generateAlertReport()
  };
}

export default PerformanceAlertSystem;