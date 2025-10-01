'use client';

/**
 * ALCHM Performance Integration System
 * Centralized initialization and management of all performance optimizations
 * 
 * This file orchestrates:
 * - FID optimization
 * - CLS prevention
 * - LCP improvements
 * - Core Web Vitals monitoring
 * - Critical resource management
 */

import { fidMonitor } from './fid-optimization';
import { clsMonitor, injectCLSOptimizationStyles } from './cls-optimization';
import { lcpMonitor, optimizeFontLoading } from './lcp-optimization';
import { coreWebVitalsMonitor } from './core-web-vitals-monitor';
import { criticalResourceManager } from './critical-resource-optimization';

export interface PerformanceConfig {
  enableFIDOptimization: boolean;
  enableCLSPrevention: boolean;
  enableLCPOptimization: boolean;
  enableMonitoring: boolean;
  enableCriticalResourceOptimization: boolean;
  crisisMode: boolean;
  debug: boolean;
}

export class ALCHMPerformanceManager {
  private static instance: ALCHMPerformanceManager;
  private isInitialized = false;
  private config: PerformanceConfig;
  
  private readonly defaultConfig: PerformanceConfig = {
    enableFIDOptimization: true,
    enableCLSPrevention: true,
    enableLCPOptimization: true,
    enableMonitoring: true,
    enableCriticalResourceOptimization: true,
    crisisMode: false,
    debug: process.env.NODE_ENV === 'development'
  };

  static getInstance(): ALCHMPerformanceManager {
    if (!this.instance) {
      this.instance = new ALCHMPerformanceManager();
    }
    return this.instance;
  }

  constructor() {
    this.config = { ...this.defaultConfig };
  }

  async initialize(userConfig?: Partial<PerformanceConfig>) {
    if (this.isInitialized) {
      if (this.config.debug) {
        console.log('⚡ Performance manager already initialized');
      }
      return;
    }

    // Merge user config with defaults
    this.config = { ...this.defaultConfig, ...userConfig };

    if (this.config.debug) {
      console.log('🚀 Initializing ALCHM Performance Manager...', this.config);
    }

    // Initialize components in optimal order
    await this.initializeInOrder();

    this.isInitialized = true;

    if (this.config.debug) {
      console.log('✅ ALCHM Performance Manager initialized successfully');
      this.logPerformanceStatus();
    }

    // Set up periodic health checks
    this.setupHealthChecks();
  }

  private async initializeInOrder() {
    try {
      // 1. Critical resource optimization (highest priority)
      if (this.config.enableCriticalResourceOptimization) {
        await this.initializeCriticalResourceOptimization();
      }

      // 2. LCP optimization (affects initial paint)
      if (this.config.enableLCPOptimization) {
        await this.initializeLCPOptimization();
      }

      // 3. CLS prevention (layout stability)
      if (this.config.enableCLSPrevention) {
        await this.initializeCLSPrevention();
      }

      // 4. FID optimization (interaction readiness)
      if (this.config.enableFIDOptimization) {
        await this.initializeFIDOptimization();
      }

      // 5. Monitoring (data collection)
      if (this.config.enableMonitoring) {
        await this.initializeMonitoring();
      }

      // 6. Crisis mode activation if needed
      if (this.config.crisisMode) {
        await this.activateCrisisMode();
      }

    } catch (error) {
      console.error('❌ Error initializing performance manager:', error);
      throw error;
    }
  }

  private async initializeCriticalResourceOptimization() {
    if (typeof window === 'undefined') return;

    try {
      // Critical resource manager is already initialized via singleton
      // Force preload crisis resources
      await criticalResourceManager.preloadCrisisResources();
      
      if (this.config.debug) {
        console.log('✅ Critical resource optimization initialized');
      }
    } catch (error) {
      console.error('❌ Critical resource optimization failed:', error);
    }
  }

  private async initializeLCPOptimization() {
    if (typeof window === 'undefined') return;

    try {
      // Optimize font loading for better LCP
      optimizeFontLoading();
      
      // LCP monitor is already initialized via singleton
      if (this.config.debug) {
        console.log('✅ LCP optimization initialized');
      }
    } catch (error) {
      console.error('❌ LCP optimization failed:', error);
    }
  }

  private async initializeCLSPrevention() {
    if (typeof window === 'undefined') return;

    try {
      // Inject CLS optimization styles
      injectCLSOptimizationStyles();
      
      // CLS monitor is already initialized via singleton
      if (this.config.debug) {
        console.log('✅ CLS prevention initialized');
      }
    } catch (error) {
      console.error('❌ CLS prevention failed:', error);
    }
  }

  private async initializeFIDOptimization() {
    if (typeof window === 'undefined') return;

    try {
      // FID monitor is already initialized via singleton
      if (this.config.debug) {
        console.log('✅ FID optimization initialized');
      }
    } catch (error) {
      console.error('❌ FID optimization failed:', error);
    }
  }

  private async initializeMonitoring() {
    if (typeof window === 'undefined') return;

    try {
      // Core Web Vitals monitor is already initialized via singleton
      
      // Set up alert handlers for critical thresholds
      coreWebVitalsMonitor.onAlert((alert) => {
        if (alert.severity === 'critical') {
          console.error('🚨 CRITICAL PERFORMANCE ALERT:', alert);
          
          // Auto-activate crisis mode for critical performance issues
          if (!this.config.crisisMode) {
            this.activateCrisisMode();
          }
        }
      });

      if (this.config.debug) {
        console.log('✅ Performance monitoring initialized');
      }
    } catch (error) {
      console.error('❌ Performance monitoring failed:', error);
    }
  }

  private async activateCrisisMode() {
    if (typeof window === 'undefined') return;

    try {
      console.log('🚨 ACTIVATING CRISIS PERFORMANCE MODE');
      
      this.config.crisisMode = true;
      
      // Enable emergency mode in critical resource manager
      criticalResourceManager.enableEmergencyMode();
      
      // Disable non-critical features
      this.disableNonCriticalFeatures();
      
      // Increase monitoring frequency
      this.increaseMonitoringFrequency();
      
      if (this.config.debug) {
        console.log('🚨 Crisis mode activated');
      }
    } catch (error) {
      console.error('❌ Crisis mode activation failed:', error);
    }
  }

  private disableNonCriticalFeatures() {
    // Remove non-critical animations
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      
      .non-critical {
        display: none !important;
      }
    `;
    style.setAttribute('data-crisis-mode', 'true');
    document.head.appendChild(style);
  }

  private increaseMonitoringFrequency() {
    // Collect metrics more frequently in crisis mode
    setInterval(() => {
      if (this.config.crisisMode) {
        coreWebVitalsMonitor.collectMetrics();
      }
    }, 1000); // Every second in crisis mode
  }

  private setupHealthChecks() {
    // Periodic health check every 30 seconds
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private performHealthCheck() {
    if (typeof window === 'undefined') return;

    try {
      const vitals = coreWebVitalsMonitor.getLatestMetrics();
      const grade = coreWebVitalsMonitor.getPerformanceGrade();
      
      if (grade.overall === 'poor' && !this.config.crisisMode) {
        console.warn('⚠️ Performance degradation detected, considering crisis mode');
        
        // Auto-activate crisis mode if performance is consistently poor
        this.activateCrisisMode();
      }

      if (this.config.debug && vitals) {
        console.log('💓 Performance health check:', {
          grade: grade.overall,
          fid: vitals.fid,
          cls: vitals.cls,
          lcp: vitals.lcp
        });
      }
    } catch (error) {
      console.warn('⚠️ Health check failed:', error);
    }
  }

  private logPerformanceStatus() {
    console.log('📊 Performance Status:', {
      fid: {
        current: fidMonitor.getCurrentFID(),
        average: fidMonitor.getAverageFID(),
        grade: fidMonitor.getPerformanceGrade()
      },
      cls: {
        current: clsMonitor.getCurrentCLS(),
        average: clsMonitor.getAverageCLS(),
        grade: clsMonitor.getPerformanceGrade()
      },
      lcp: {
        current: lcpMonitor.getCurrentLCP(),
        average: lcpMonitor.getAverageLCP(),
        grade: lcpMonitor.getPerformanceGrade()
      },
      overall: coreWebVitalsMonitor.getPerformanceGrade()
    });
  }

  // Public methods
  async enableCrisisMode() {
    await this.activateCrisisMode();
  }

  disableCrisisMode() {
    this.config.crisisMode = false;
    
    // Remove crisis mode styles
    const crisisStyles = document.querySelectorAll('[data-crisis-mode="true"]');
    crisisStyles.forEach(style => style.remove());
    
    console.log('✅ Crisis mode deactivated');
  }

  getPerformanceStatus() {
    return {
      isInitialized: this.isInitialized,
      config: this.config,
      vitals: coreWebVitalsMonitor.getLatestMetrics(),
      grade: coreWebVitalsMonitor.getPerformanceGrade(),
      resourceStatus: {
        loaded: criticalResourceManager.getLoadedResources(),
        failed: criticalResourceManager.getFailedResources()
      }
    };
  }

  async updateConfig(newConfig: Partial<PerformanceConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    if (this.config.debug) {
      console.log('🔧 Performance config updated:', this.config);
    }
    
    // Re-initialize if needed
    if (this.isInitialized) {
      await this.initializeInOrder();
    }
  }

  async generatePerformanceReport() {
    const status = this.getPerformanceStatus();
    const report = {
      timestamp: new Date().toISOString(),
      status,
      compliance: {
        coreWebVitals: status.grade,
        appStoreReady: status.grade.overall !== 'poor',
        crisisReady: status.config.crisisMode || status.grade.overall !== 'poor'
      },
      recommendations: this.generateRecommendations(status)
    };

    if (this.config.debug) {
      console.log('📊 Performance Report:', report);
    }

    return report;
  }

  private generateRecommendations(status: any) {
    const recommendations = [];
    
    if (status.grade.grades.fid === 'poor') {
      recommendations.push('Optimize JavaScript execution and reduce main thread blocking');
    }
    
    if (status.grade.grades.cls === 'poor') {
      recommendations.push('Add explicit dimensions to images and reserve space for dynamic content');
    }
    
    if (status.grade.grades.lcp === 'poor') {
      recommendations.push('Optimize critical resource loading and improve server response times');
    }
    
    if (status.resourceStatus.failed.length > 0) {
      recommendations.push('Fix failed resource loading issues');
    }
    
    return recommendations;
  }
}

// React hook for easy integration
export function useALCHMPerformance(config?: Partial<PerformanceConfig>) {
  const manager = ALCHMPerformanceManager.getInstance();
  
  React.useEffect(() => {
    manager.initialize(config);
  }, [config]);

  return {
    enableCrisisMode: () => manager.enableCrisisMode(),
    disableCrisisMode: () => manager.disableCrisisMode(),
    getStatus: () => manager.getPerformanceStatus(),
    generateReport: () => manager.generatePerformanceReport()
  };
}

// Export singleton instance
export const alchMPerformanceManager = ALCHMPerformanceManager.getInstance();