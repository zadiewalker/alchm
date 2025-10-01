/**
 * ADVANCED PERFORMANCE MONITORING SYSTEM FOR ALCHM
 * 
 * MISSION: Ensure optimal performance for users in emotional distress
 * Every millisecond matters when someone needs crisis support.
 */

import { logger } from '@/lib/logging';

export interface CrisisPerformanceMetrics {
  // Core Web Vitals - Crisis Optimized Thresholds
  lcp: number | null; // Target: <1.2s (more aggressive than standard 2.5s)
  fid: number | null; // Target: <50ms (crisis users need immediate response)
  cls: number | null; // Target: <0.05 (stability crucial during distress)
  fcp: number | null; // Target: <800ms (faster than standard 1.8s)
  tti: number | null; // Target: <2s (interactive immediately)
  ttfb: number | null; // Target: <200ms (server response)
  
  // Crisis-Specific Metrics
  crisisButtonResponseTime: number | null; // Target: <100ms
  journalSaveTime: number | null; // Target: <1s
  authLoadTime: number | null; // Target: <800ms
  crisisResourceLoadTime: number | null; // Target: <500ms
  aiResponseTime: number | null; // Target: <3s
  offlineCapabilityScore: number | null; // 0-100
  
  // Mobile Performance (Critical for Crisis Users)
  batteryImpactScore: number | null; // Lower is better
  memoryUsage: number | null; // Percentage
  networkEfficiency: number | null; // Bytes per operation
  
  // Real-time Crisis Monitoring
  crisisDetectionLatency: number | null; // Target: <100ms
  emergencyEscalationTime: number | null; // Target: <500ms
  
  // Context
  timestamp: number;
  sessionId: string;
  userId?: string;
  userAgent: string;
  url: string;
  connectionType?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  batteryLevel?: number;
  isInCrisis?: boolean;
}

export interface PerformanceAlert {
  id: string;
  metric: string;
  value: number;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: 'user_experience' | 'crisis_response' | 'system_stability';
  timestamp: number;
  context: {
    url: string;
    userAgent: string;
    sessionId: string;
    isInCrisis?: boolean;
  };
  recommendations: string[];
}

export interface PerformanceBudget {
  metric: string;
  target: number;
  warning: number;
  critical: number;
  budgetType: 'time' | 'size' | 'count' | 'score';
}

// Crisis-Optimized Performance Budgets
export const CRISIS_PERFORMANCE_BUDGETS: PerformanceBudget[] = [
  // Core Web Vitals - Stricter than Google recommendations
  { metric: 'LCP', target: 1200, warning: 1800, critical: 2500, budgetType: 'time' },
  { metric: 'FID', target: 50, warning: 75, critical: 100, budgetType: 'time' },
  { metric: 'CLS', target: 0.05, warning: 0.1, critical: 0.15, budgetType: 'score' },
  { metric: 'FCP', target: 800, warning: 1200, critical: 1800, budgetType: 'time' },
  { metric: 'TTI', target: 2000, warning: 3000, critical: 5000, budgetType: 'time' },
  { metric: 'TTFB', target: 200, warning: 400, critical: 800, budgetType: 'time' },
  
  // Crisis-Specific Budgets
  { metric: 'crisisButtonResponseTime', target: 100, warning: 150, critical: 200, budgetType: 'time' },
  { metric: 'journalSaveTime', target: 1000, warning: 1500, critical: 2000, budgetType: 'time' },
  { metric: 'authLoadTime', target: 800, warning: 1200, critical: 1500, budgetType: 'time' },
  { metric: 'crisisResourceLoadTime', target: 500, warning: 750, critical: 1000, budgetType: 'time' },
  { metric: 'aiResponseTime', target: 3000, warning: 4000, critical: 5000, budgetType: 'time' },
  { metric: 'crisisDetectionLatency', target: 100, warning: 200, critical: 300, budgetType: 'time' },
  { metric: 'emergencyEscalationTime', target: 500, warning: 750, critical: 1000, budgetType: 'time' },
  
  // Resource Budgets
  { metric: 'memoryUsage', target: 70, warning: 85, critical: 95, budgetType: 'score' },
  { metric: 'offlineCapabilityScore', target: 90, warning: 75, critical: 60, budgetType: 'score' },
  { metric: 'batteryImpactScore', target: 20, warning: 40, critical: 60, budgetType: 'score' }
];

export class AdvancedPerformanceMonitoringSystem {
  private static instance: AdvancedPerformanceMonitoringSystem | null = null;
  private metrics: Partial<CrisisPerformanceMetrics> = {};
  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private sessionId: string;
  private isMonitoring = false;
  private performanceBudgets = CRISIS_PERFORMANCE_BUDGETS;
  
  private crisisContext = {
    isInCrisis: false,
    riskLevel: 'none' as 'none' | 'low' | 'moderate' | 'high' | 'critical',
    lastCrisisDetection: 0
  };

  constructor() {
    this.sessionId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (typeof window !== 'undefined') {
      this.initializeAdvancedMonitoring();
    }
  }

  static getInstance(): AdvancedPerformanceMonitoringSystem {
    if (!this.instance) {
      this.instance = new AdvancedPerformanceMonitoringSystem();
    }
    return this.instance;
  }

  private async initializeAdvancedMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    console.log('🎯 Initializing Advanced Performance Monitoring for Crisis Support...');

    // Initialize core monitoring
    this.setupCoreWebVitalsMonitoring();
    this.setupCrisisSpecificMonitoring();
    this.setupMobilePerformanceMonitoring();
    this.setupRealTimeCrisisMonitoring();
    this.setupNetworkOptimizations();
    this.setupBatteryOptimizations();
    
    // Start continuous monitoring
    this.startContinuousMonitoring();
    this.setupPerformanceBudgetEnforcement();
    
    // Listen for crisis state changes
    this.setupCrisisStateMonitoring();

    console.log('✅ Advanced Performance Monitoring Active');
  }

  private setupCoreWebVitalsMonitoring(): void {
    // Enhanced Core Web Vitals with crisis-specific optimizations
    if ('PerformanceObserver' in window) {
      // LCP - Critical for crisis users who need immediate visual feedback
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          
          this.checkCrisisPerformanceBudget('LCP', lastEntry.startTime);
          this.optimizeLCPForCrisis(lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP monitoring not supported');
      }

      // FID - Critical responsiveness for users in distress
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            
            this.checkCrisisPerformanceBudget('FID', this.metrics.fid);
            this.optimizeFIDForCrisis(this.metrics.fid);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID monitoring not supported');
      }

      // CLS - Visual stability crucial during emotional distress
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.cls = clsValue;
          this.checkCrisisPerformanceBudget('CLS', clsValue);
          this.optimizeCLSForCrisis(clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS monitoring not supported');
      }
    }
  }

  private setupCrisisSpecificMonitoring(): void {
    // Monitor crisis button interactions
    this.monitorCrisisButtonPerformance();
    
    // Monitor journal save operations
    this.monitorJournalSavePerformance();
    
    // Monitor authentication flows
    this.monitorAuthPerformance();
    
    // Monitor AI response times
    this.monitorAIResponseTimes();
    
    // Monitor crisis resource loading
    this.monitorCrisisResourceLoading();
  }

  private monitorCrisisButtonPerformance(): void {
    const observer = new MutationObserver(() => {
      const crisisButtons = document.querySelectorAll('[data-crisis-button], .crisis-button, .emergency-button');
      
      crisisButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          const startTime = performance.now();
          
          // Monitor time to crisis modal/overlay appearance
          const checkCrisisResponse = () => {
            const crisisModal = document.querySelector('[data-crisis-modal], .crisis-modal, .emergency-overlay');
            if (crisisModal) {
              const responseTime = performance.now() - startTime;
              this.metrics.crisisButtonResponseTime = responseTime;
              
              this.checkCrisisPerformanceBudget('crisisButtonResponseTime', responseTime);
              
              if (responseTime > 200) {
                this.createCriticalAlert('crisisButtonResponseTime', responseTime, 200, 
                  'Crisis button response time exceeded acceptable threshold');
              }
            } else {
              if (performance.now() - startTime < 5000) {
                setTimeout(checkCrisisResponse, 50);
              }
            }
          };
          
          setTimeout(checkCrisisResponse, 0);
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private monitorJournalSavePerformance(): void {
    // Intercept journal save API calls
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
      
      if (url.includes('/api/save') || url.includes('/api/journal')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const saveTime = performance.now() - startTime;
          
          this.metrics.journalSaveTime = saveTime;
          this.checkCrisisPerformanceBudget('journalSaveTime', saveTime);
          
          // Critical for users in crisis - journal must save reliably and quickly
          if (this.crisisContext.isInCrisis && saveTime > 1500) {
            this.createCriticalAlert('journalSaveTime', saveTime, 1500,
              'Journal save time too slow for user in crisis');
          }
          
          return response;
        } catch (error) {
          const saveTime = performance.now() - startTime;
          this.createCriticalAlert('journalSaveTime', saveTime, 0,
            'Journal save failed - critical for crisis users');
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
  }

  private monitorAIResponseTimes(): void {
    // Monitor AI reflection and crisis detection API calls
    const originalFetch = window.fetch;
    const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : '';
      
      if (url.includes('/api/ai') || url.includes('/api/khepera') || url.includes('crisis-detection')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const responseTime = performance.now() - startTime;
          
          if (url.includes('crisis')) {
            this.metrics.crisisDetectionLatency = responseTime;
            this.checkCrisisPerformanceBudget('crisisDetectionLatency', responseTime);
          } else {
            this.metrics.aiResponseTime = responseTime;
            this.checkCrisisPerformanceBudget('aiResponseTime', responseTime);
          }
          
          return response;
        } catch (error) {
          const responseTime = performance.now() - startTime;
          this.createCriticalAlert('aiResponseTime', responseTime, 0,
            'AI service failed - impacts crisis detection');
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    if (window.fetch === originalFetch) {
      window.fetch = enhancedFetch;
    }
  }

  private monitorCrisisResourceLoading(): void {
    // Monitor loading of crisis resources (hotlines, emergency contacts)
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('crisis') || 
            entry.name.includes('emergency') || 
            entry.name.includes('988') ||
            entry.name.includes('suicide-prevention')) {
          
          const loadTime = entry.responseEnd - entry.fetchStart;
          this.metrics.crisisResourceLoadTime = loadTime;
          
          this.checkCrisisPerformanceBudget('crisisResourceLoadTime', loadTime);
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (e) {
      console.warn('Resource timing monitoring not supported');
    }
  }

  private setupMobilePerformanceMonitoring(): void {
    // Battery monitoring for crisis optimization
    this.monitorBatteryImpact();
    
    // Memory usage monitoring
    this.monitorMemoryUsage();
    
    // Network efficiency monitoring
    this.monitorNetworkEfficiency();
    
    // Device performance monitoring
    this.monitorDevicePerformance();
  }

  private async monitorBatteryImpact(): Promise<void> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryMetrics = () => {
          // Calculate battery impact score (lower is better)
          const batteryLevel = battery.level;
          const isCharging = battery.charging;
          
          // If battery is low and not charging, optimize aggressively
          if (batteryLevel < 0.2 && !isCharging) {
            this.metrics.batteryImpactScore = 80; // High impact, need optimization
            this.applyCrisisBatteryOptimizations();
          } else if (batteryLevel < 0.5 && !isCharging) {
            this.metrics.batteryImpactScore = 50; // Medium impact
          } else {
            this.metrics.batteryImpactScore = 20; // Low impact
          }
          
          this.checkCrisisPerformanceBudget('batteryImpactScore', this.metrics.batteryImpactScore);
        };

        battery.addEventListener('levelchange', updateBatteryMetrics);
        battery.addEventListener('chargingchange', updateBatteryMetrics);
        updateBatteryMetrics();
      }
    } catch (error) {
      console.warn('Battery API not available');
    }
  }

  private monitorMemoryUsage(): void {
    if ((performance as any).memory) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        
        this.metrics.memoryUsage = memoryUsagePercent;
        this.checkCrisisPerformanceBudget('memoryUsage', memoryUsagePercent);
        
        // Critical memory usage requires immediate optimization
        if (memoryUsagePercent > 90) {
          this.applyCrisisMemoryOptimizations();
        }
      };

      setInterval(checkMemory, 30000); // Check every 30 seconds
      checkMemory();
    }
  }

  private monitorNetworkEfficiency(): void {
    // Track bytes transferred per operation
    const originalFetch = window.fetch;
    let totalBytes = 0;
    let operationCount = 0;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      if (response.headers.get('content-length')) {
        const bytes = parseInt(response.headers.get('content-length') || '0');
        totalBytes += bytes;
        operationCount++;
        
        this.metrics.networkEfficiency = totalBytes / operationCount;
      }
      
      return response;
    };
  }

  private setupRealTimeCrisisMonitoring(): void {
    // Monitor for crisis indicators in real-time
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        this.performRealTimeCrisisDetection(target.value);
      }
    });

    // Monitor page visibility for crisis users
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.crisisContext.isInCrisis) {
        // User in crisis left the page - ensure data is saved
        this.emergencySaveUserData();
      }
    });
  }

  private performRealTimeCrisisDetection(text: string): void {
    const startTime = performance.now();
    
    // Quick crisis keyword detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die',
      'self harm', 'hurt myself', 'emergency', 'crisis'
    ];
    
    const textLower = text.toLowerCase();
    const hasCrisisIndicators = crisisKeywords.some(keyword => textLower.includes(keyword));
    
    const detectionTime = performance.now() - startTime;
    this.metrics.crisisDetectionLatency = detectionTime;
    
    if (hasCrisisIndicators) {
      this.crisisContext.isInCrisis = true;
      this.crisisContext.riskLevel = 'high';
      this.crisisContext.lastCrisisDetection = Date.now();
      
      // Trigger emergency performance optimizations
      this.activateEmergencyPerformanceMode();
    }
    
    this.checkCrisisPerformanceBudget('crisisDetectionLatency', detectionTime);
  }

  private activateEmergencyPerformanceMode(): void {
    console.log('🚨 EMERGENCY PERFORMANCE MODE ACTIVATED');
    
    // Apply all crisis optimizations immediately
    this.applyCrisisBatteryOptimizations();
    this.applyCrisisMemoryOptimizations();
    this.applyCrisisNetworkOptimizations();
    
    // Tighten performance budgets for crisis users
    this.adjustPerformanceBudgetsForCrisis();
    
    // Preload emergency resources
    this.preloadEmergencyResources();
  }

  private applyCrisisBatteryOptimizations(): void {
    // Disable animations to save battery
    const style = document.createElement('style');
    style.id = 'crisis-battery-optimization';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    if (!document.getElementById('crisis-battery-optimization')) {
      document.head.appendChild(style);
    }
    
    // Reduce screen refresh rate if possible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Defer non-critical operations
      });
    }
  }

  private applyCrisisMemoryOptimizations(): void {
    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (!name.includes('crisis') && !name.includes('emergency')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Remove non-essential DOM elements
    const nonEssential = document.querySelectorAll('.non-essential, .decoration');
    nonEssential.forEach(el => el.remove());
  }

  private applyCrisisNetworkOptimizations(): void {
    // Enable compression for all requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const [url, options = {}] = args;
      const enhancedOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Accept-Encoding': 'gzip, deflate, br'
        }
      };
      
      return originalFetch(url, enhancedOptions);
    };
  }

  private checkCrisisPerformanceBudget(metric: string, value: number): void {
    const budget = this.performanceBudgets.find(b => b.metric === metric);
    if (!budget) return;

    let severity: PerformanceAlert['severity'] = 'low';
    let threshold = budget.target;

    if (value > budget.critical) {
      severity = 'critical';
      threshold = budget.critical;
    } else if (value > budget.warning) {
      severity = 'high';
      threshold = budget.warning;
    } else if (value > budget.target) {
      severity = 'medium';
      threshold = budget.target;
    } else {
      return; // Within budget
    }

    this.createPerformanceAlert(metric, value, threshold, severity);
  }

  private createPerformanceAlert(
    metric: string, 
    value: number, 
    threshold: number, 
    severity: PerformanceAlert['severity']
  ): void {
    const alert: PerformanceAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metric,
      value,
      threshold,
      severity,
      impact: this.getImpactType(metric),
      timestamp: Date.now(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        isInCrisis: this.crisisContext.isInCrisis
      },
      recommendations: this.getRecommendations(metric, value)
    };

    this.alerts.push(alert);
    
    // Send critical alerts immediately
    if (severity === 'critical' || this.crisisContext.isInCrisis) {
      this.sendCriticalAlert(alert);
    }

    // Keep only recent alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  private createCriticalAlert(metric: string, value: number, threshold: number, message: string): void {
    const alert: PerformanceAlert = {
      id: `critical_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metric,
      value,
      threshold,
      severity: 'critical',
      impact: 'crisis_response',
      timestamp: Date.now(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        isInCrisis: this.crisisContext.isInCrisis
      },
      recommendations: [message, ...this.getRecommendations(metric, value)]
    };

    this.alerts.push(alert);
    this.sendCriticalAlert(alert);
  }

  private getImpactType(metric: string): PerformanceAlert['impact'] {
    const crisisMetrics = [
      'crisisButtonResponseTime', 'crisisDetectionLatency', 
      'emergencyEscalationTime', 'crisisResourceLoadTime'
    ];
    
    if (crisisMetrics.includes(metric)) {
      return 'crisis_response';
    } else if (['LCP', 'FID', 'CLS', 'FCP'].includes(metric)) {
      return 'user_experience';
    } else {
      return 'system_stability';
    }
  }

  private getRecommendations(metric: string, value: number): string[] {
    const recommendations: Record<string, string[]> = {
      'LCP': [
        'Preload critical resources',
        'Optimize largest content element',
        'Use efficient image formats (WebP, AVIF)',
        'Implement proper caching strategy'
      ],
      'FID': [
        'Break up long JavaScript tasks',
        'Use requestIdleCallback for non-essential work',
        'Optimize event handlers',
        'Defer non-critical JavaScript'
      ],
      'CLS': [
        'Add size attributes to images',
        'Reserve space for dynamic content',
        'Use font-display: swap',
        'Avoid inserting content above existing content'
      ],
      'crisisButtonResponseTime': [
        'Preload crisis modal components',
        'Optimize crisis button event handlers',
        'Use CSS containment for crisis UI',
        'Implement crisis button debouncing'
      ],
      'journalSaveTime': [
        'Implement optimistic updates',
        'Use background sync for saves',
        'Compress journal data',
        'Implement retry logic'
      ],
      'crisisDetectionLatency': [
        'Optimize crisis keyword detection algorithm',
        'Use Web Workers for text analysis',
        'Implement progressive crisis detection',
        'Cache crisis detection patterns'
      ]
    };

    return recommendations[metric] || ['Review and optimize implementation'];
  }

  private async sendCriticalAlert(alert: PerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/critical-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert,
          sessionData: this.getSessionData(),
          metrics: this.metrics
        })
      });
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  private startContinuousMonitoring(): void {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Health check every 10 seconds for crisis users
    setInterval(() => {
      if (this.crisisContext.isInCrisis) {
        this.performCrisisHealthCheck();
      }
    }, 10000);

    // Clean up old data
    setInterval(() => {
      this.cleanupOldData();
    }, 300000); // 5 minutes
  }

  private performCrisisHealthCheck(): void {
    // Check all critical systems for crisis users
    const criticalMetrics = [
      'crisisButtonResponseTime',
      'journalSaveTime', 
      'crisisDetectionLatency',
      'memoryUsage',
      'batteryImpactScore'
    ];

    let healthScore = 100;
    const issues: string[] = [];

    criticalMetrics.forEach(metric => {
      const value = this.metrics[metric as keyof CrisisPerformanceMetrics];
      const budget = this.performanceBudgets.find(b => b.metric === metric);
      
      if (value !== null && budget) {
        if (value > budget.critical) {
          healthScore -= 30;
          issues.push(`${metric} is critical`);
        } else if (value > budget.warning) {
          healthScore -= 15;
          issues.push(`${metric} needs attention`);
        }
      }
    });

    if (healthScore < 70) {
      logger.warn('Crisis user system health degraded', {
        healthScore,
        issues,
        sessionId: this.sessionId
      });
      
      // Apply emergency optimizations
      this.activateEmergencyPerformanceMode();
    }
  }

  private setupPerformanceBudgetEnforcement(): void {
    // Monitor performance budgets in real-time
    setInterval(() => {
      this.enforcePerformanceBudgets();
    }, 5000);
  }

  private enforcePerformanceBudgets(): void {
    this.performanceBudgets.forEach(budget => {
      const currentValue = this.metrics[budget.metric as keyof CrisisPerformanceMetrics];
      
      if (currentValue !== null && currentValue !== undefined) {
        this.checkCrisisPerformanceBudget(budget.metric, currentValue);
      }
    });
  }

  private adjustPerformanceBudgetsForCrisis(): void {
    // Tighten budgets for crisis users
    this.performanceBudgets = this.performanceBudgets.map(budget => ({
      ...budget,
      target: budget.target * 0.8, // 20% stricter
      warning: budget.warning * 0.8,
      critical: budget.critical * 0.9
    }));
  }

  private preloadEmergencyResources(): void {
    const emergencyResources = [
      '/crisis-resources',
      '/emergency-contacts',
      'tel:988'
    ];

    emergencyResources.forEach(resource => {
      if (resource.startsWith('/')) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      }
    });
  }

  private async emergencySaveUserData(): Promise<void> {
    // Save any unsaved journal data locally
    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input[type="text"]');
    
    [...textareas, ...inputs].forEach((element, index) => {
      const input = element as HTMLInputElement | HTMLTextAreaElement;
      if (input.value) {
        localStorage.setItem(`emergency_save_${index}_${Date.now()}`, input.value);
      }
    });
  }

  private setupCrisisStateMonitoring(): void {
    // Listen for crisis state changes from other parts of the application
    window.addEventListener('alchm:crisis-detected', (event: any) => {
      this.crisisContext.isInCrisis = true;
      this.crisisContext.riskLevel = event.detail.riskLevel || 'high';
      this.activateEmergencyPerformanceMode();
    });

    window.addEventListener('alchm:crisis-resolved', () => {
      this.crisisContext.isInCrisis = false;
      this.crisisContext.riskLevel = 'none';
      // Reset performance budgets to normal
      this.performanceBudgets = CRISIS_PERFORMANCE_BUDGETS;
    });
  }

  private setupNetworkOptimizations(): void {
    // Implement adaptive loading based on connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const optimizeForConnection = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Apply aggressive optimizations for slow connections
          this.applyCrisisNetworkOptimizations();
          
          // Preload only critical resources
          this.metrics.offlineCapabilityScore = 60; // Reduced capability
        } else {
          this.metrics.offlineCapabilityScore = 90; // Full capability
        }
      };

      connection.addEventListener('change', optimizeForConnection);
      optimizeForConnection();
    }
  }

  private setupBatteryOptimizations(): void {
    // Automatic battery optimization based on level
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const optimizeForBattery = () => {
          if (battery.level < 0.15 && !battery.charging) {
            this.applyCrisisBatteryOptimizations();
          }
        };

        battery.addEventListener('levelchange', optimizeForBattery);
        battery.addEventListener('chargingchange', optimizeForBattery);
      });
    }
  }

  private optimizeLCPForCrisis(lcpTime: number): void {
    if (lcpTime > 1500 && this.crisisContext.isInCrisis) {
      // Emergency LCP optimization
      const images = document.querySelectorAll('img');
      images.forEach((img, index) => {
        if (index > 2) { // Only keep first 3 images
          img.style.display = 'none';
        } else {
          img.loading = 'eager';
        }
      });
    }
  }

  private optimizeFIDForCrisis(fidTime: number): void {
    if (fidTime > 100 && this.crisisContext.isInCrisis) {
      // Break up any long-running tasks
      if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
        // Use modern scheduler API for task prioritization
      } else {
        // Fallback to setTimeout for task yielding
        const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0));
        (window as any).yieldToMain = yieldToMain;
      }
    }
  }

  private optimizeCLSForCrisis(clsValue: number): void {
    if (clsValue > 0.1 && this.crisisContext.isInCrisis) {
      // Emergency CLS stabilization
      const style = document.createElement('style');
      style.textContent = `
        img:not([width]):not([height]) { aspect-ratio: 16/9; }
        [data-dynamic-content] { min-height: 200px; }
      `;
      document.head.appendChild(style);
    }
  }

  private async reportMetrics(): Promise<void> {
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.getCurrentMetrics(),
      alerts: this.getRecentAlerts(),
      crisisContext: this.crisisContext,
      deviceContext: {
        connectionType: (navigator as any).connection?.effectiveType,
        deviceMemory: (navigator as any).deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency
      }
    };

    try {
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/monitoring/performance', JSON.stringify(payload));
      } else {
        await fetch('/api/monitoring/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.warn('Failed to report performance metrics:', error);
    }
  }

  private cleanupOldData(): void {
    // Remove alerts older than 1 hour
    const oneHourAgo = Date.now() - 3600000;
    this.alerts = this.alerts.filter(alert => alert.timestamp > oneHourAgo);
  }

  private getCurrentMetrics(): CrisisPerformanceMetrics {
    return {
      ...this.metrics,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      isInCrisis: this.crisisContext.isInCrisis
    } as CrisisPerformanceMetrics;
  }

  private getRecentAlerts(): PerformanceAlert[] {
    const fiveMinutesAgo = Date.now() - 300000;
    return this.alerts.filter(alert => alert.timestamp > fiveMinutesAgo);
  }

  private getSessionData(): any {
    return {
      sessionId: this.sessionId,
      crisisContext: this.crisisContext,
      startTime: Date.now(),
      url: window.location.href
    };
  }

  // Public API
  public getMetrics(): CrisisPerformanceMetrics {
    return this.getCurrentMetrics();
  }

  public getAlerts(severity?: PerformanceAlert['severity']): PerformanceAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  public generatePerformanceReport(): string {
    const metrics = this.getCurrentMetrics();
    let report = '🎯 CRISIS-OPTIMIZED PERFORMANCE REPORT\n';
    report += '=' .repeat(50) + '\n\n';

    // Crisis Context
    report += `🚨 Crisis Context:\n`;
    report += `  In Crisis: ${this.crisisContext.isInCrisis ? '🔴 YES' : '✅ NO'}\n`;
    report += `  Risk Level: ${this.crisisContext.riskLevel.toUpperCase()}\n`;
    report += `  Session: ${this.sessionId}\n\n`;

    // Core Web Vitals
    report += `📊 Core Web Vitals (Crisis Thresholds):\n`;
    if (metrics.lcp) report += `  LCP: ${metrics.lcp.toFixed(0)}ms ${this.getStatusIcon('LCP', metrics.lcp)}\n`;
    if (metrics.fid) report += `  FID: ${metrics.fid.toFixed(0)}ms ${this.getStatusIcon('FID', metrics.fid)}\n`;
    if (metrics.cls) report += `  CLS: ${metrics.cls.toFixed(3)} ${this.getStatusIcon('CLS', metrics.cls)}\n`;
    if (metrics.fcp) report += `  FCP: ${metrics.fcp.toFixed(0)}ms ${this.getStatusIcon('FCP', metrics.fcp)}\n`;

    // Crisis-Specific Metrics
    report += `\n🆘 Crisis Response Metrics:\n`;
    if (metrics.crisisButtonResponseTime) 
      report += `  Crisis Button: ${metrics.crisisButtonResponseTime.toFixed(0)}ms ${this.getStatusIcon('crisisButtonResponseTime', metrics.crisisButtonResponseTime)}\n`;
    if (metrics.journalSaveTime) 
      report += `  Journal Save: ${metrics.journalSaveTime.toFixed(0)}ms ${this.getStatusIcon('journalSaveTime', metrics.journalSaveTime)}\n`;
    if (metrics.crisisDetectionLatency) 
      report += `  Crisis Detection: ${metrics.crisisDetectionLatency.toFixed(0)}ms ${this.getStatusIcon('crisisDetectionLatency', metrics.crisisDetectionLatency)}\n`;

    // Recent Alerts
    const recentAlerts = this.getRecentAlerts();
    if (recentAlerts.length > 0) {
      report += `\n⚠️ Recent Alerts (${recentAlerts.length}):\n`;
      recentAlerts.slice(0, 5).forEach(alert => {
        const icon = alert.severity === 'critical' ? '🔴' : alert.severity === 'high' ? '🟠' : '🟡';
        report += `  ${icon} ${alert.metric}: ${alert.value.toFixed(0)} > ${alert.threshold}\n`;
      });
    }

    return report;
  }

  private getStatusIcon(metric: string, value: number): string {
    const budget = this.performanceBudgets.find(b => b.metric === metric);
    if (!budget) return '❓';

    if (value <= budget.target) return '✅';
    if (value <= budget.warning) return '⚠️';
    if (value <= budget.critical) return '🟠';
    return '🔴';
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Initialize global monitoring
export const advancedPerformanceMonitor = AdvancedPerformanceMonitoringSystem.getInstance();

// React hook for performance monitoring
export const useAdvancedPerformanceMonitoring = () => {
  return {
    getMetrics: () => advancedPerformanceMonitor.getMetrics(),
    getAlerts: (severity?: PerformanceAlert['severity']) => advancedPerformanceMonitor.getAlerts(severity),
    generateReport: () => advancedPerformanceMonitor.generatePerformanceReport()
  };
};

export default AdvancedPerformanceMonitoringSystem;