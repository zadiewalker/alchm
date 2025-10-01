/**
 * ALCHM Error Tracking Excellence System
 * Comprehensive error detection, categorization, and resolution pipeline
 * Crisis-sensitive error handling with immediate escalation protocols
 */

import { logger } from './logging';

export interface ErrorContext {
  userId?: string;
  sessionId: string;
  url: string;
  userAgent: string;
  timestamp: number;
  network?: {
    type: string;
    downlink?: number;
    rtt?: number;
  };
  performance?: {
    memory?: number;
    timing?: any;
  };
  stackTrace?: string;
  breadcrumbs: ErrorBreadcrumb[];
}

export interface ErrorBreadcrumb {
  timestamp: number;
  category: 'navigation' | 'user-interaction' | 'api' | 'console' | 'dom';
  level: 'info' | 'warning' | 'error';
  message: string;
  data?: Record<string, any>;
}

export interface CategorizedError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  category: ErrorCategory;
  message: string;
  impact: ErrorImpact;
  context: ErrorContext;
  tags: string[];
  fingerprint: string;
  isResolved: boolean;
  resolutionSteps?: string[];
  affectedUsers: number;
  firstSeen: number;
  lastSeen: number;
  occurrenceCount: number;
}

export enum ErrorType {
  JAVASCRIPT = 'javascript',
  NETWORK = 'network',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  API = 'api',
  UI_INTERACTION = 'ui_interaction',
  CRISIS_SYSTEM = 'crisis_system',
  UNHANDLED_PROMISE = 'unhandled_promise'
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
  EMERGENCY = 'emergency' // For crisis system failures
}

export enum ErrorCategory {
  CLIENT_SIDE = 'client_side',
  SERVER_SIDE = 'server_side',
  NETWORK_ISSUE = 'network_issue',
  USER_ERROR = 'user_error',
  SYSTEM_ERROR = 'system_error',
  THIRD_PARTY = 'third_party'
}

export enum ErrorImpact {
  USER_BLOCKING = 'user_blocking',
  FEATURE_DEGRADATION = 'feature_degradation',
  PERFORMANCE_IMPACT = 'performance_impact',
  DATA_LOSS_RISK = 'data_loss_risk',
  SECURITY_RISK = 'security_risk',
  CRISIS_INTERVENTION_BLOCKED = 'crisis_intervention_blocked'
}

class ErrorTrackingExcellence {
  private static instance: ErrorTrackingExcellence | null = null;
  private errors: Map<string, CategorizedError> = new Map();
  private breadcrumbs: ErrorBreadcrumb[] = [];
  private sessionId: string;
  private isInitialized = false;

  // Error rate thresholds for alerting
  private readonly ERROR_RATE_THRESHOLDS = {
    WARNING: 0.05,     // 5% error rate
    CRITICAL: 0.15,    // 15% error rate
    EMERGENCY: 0.30    // 30% error rate
  };

  // Crisis-sensitive error patterns
  private readonly CRISIS_ERROR_PATTERNS = [
    /crisis.*failed/i,
    /emergency.*unavailable/i,
    /hotline.*error/i,
    /support.*timeout/i,
    /auth.*crisis/i
  ];

  private constructor() {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.initializeErrorTracking();
  }

  static getInstance(): ErrorTrackingExcellence {
    if (!this.instance) {
      this.instance = new ErrorTrackingExcellence();
    }
    return this.instance;
  }

  private initializeErrorTracking(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    console.log('🛡️ Initializing ALCHM Error Tracking Excellence...');

    // Global error handlers
    this.setupGlobalErrorHandlers();
    
    // Performance observer for errors
    this.setupPerformanceErrorTracking();
    
    // Network error monitoring
    this.setupNetworkErrorTracking();
    
    // UI interaction error tracking
    this.setupUIInteractionTracking();
    
    // Crisis system specific monitoring
    this.setupCrisisSystemMonitoring();

    this.isInitialized = true;
    console.log('✅ Error tracking system active with crisis-sensitive monitoring');
  }

  private setupGlobalErrorHandlers(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        type: ErrorType.JAVASCRIPT,
        message: event.message,
        source: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        type: ErrorType.UNHANDLED_PROMISE,
        message: `Unhandled Promise Rejection: ${event.reason}`,
        error: event.reason,
        stack: event.reason?.stack
      });
    });

    // Network errors (fetch failures)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof Request ? args[0].url : 'unknown';
      
      try {
        const response = await originalFetch(...args);
        
        // Track slow responses
        const responseTime = performance.now() - startTime;
        if (responseTime > 5000) {
          this.captureError({
            type: ErrorType.PERFORMANCE,
            message: `Slow API response: ${url}`,
            responseTime,
            url
          });
        }
        
        // Track HTTP errors
        if (!response.ok) {
          this.captureError({
            type: ErrorType.NETWORK,
            message: `HTTP ${response.status}: ${response.statusText}`,
            url,
            status: response.status,
            statusText: response.statusText
          });
        }
        
        return response;
      } catch (error) {
        this.captureError({
          type: ErrorType.NETWORK,
          message: `Network request failed: ${url}`,
          url,
          error,
          stack: error.stack
        });
        throw error;
      }
    };
  }

  private setupPerformanceErrorTracking(): void {
    if (!('PerformanceObserver' in window)) return;

    // Monitor for performance issues
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Long tasks (blocking main thread)
          if (entry.entryType === 'longtask' && entry.duration > 100) {
            this.captureError({
              type: ErrorType.PERFORMANCE,
              message: `Long task detected: ${entry.duration.toFixed(0)}ms`,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
          
          // Layout shifts
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput && entry.value > 0.1) {
            this.captureError({
              type: ErrorType.PERFORMANCE,
              message: `Significant layout shift: ${entry.value.toFixed(3)}`,
              clsValue: entry.value,
              sources: entry.sources
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask', 'layout-shift'] });
    } catch (error) {
      console.warn('Performance observer setup failed:', error);
    }
  }

  private setupNetworkErrorTracking(): void {
    // Monitor connection changes
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.addBreadcrumb({
            category: 'navigation',
            level: 'warning',
            message: `Slow network detected: ${connection.effectiveType}`,
            data: {
              downlink: connection.downlink,
              rtt: connection.rtt,
              saveData: connection.saveData
            }
          });
        }
      });
    }

    // Monitor offline/online events
    window.addEventListener('offline', () => {
      this.captureError({
        type: ErrorType.NETWORK,
        message: 'User went offline',
        severity: ErrorSeverity.MEDIUM
      });
    });

    window.addEventListener('online', () => {
      this.addBreadcrumb({
        category: 'navigation',
        level: 'info',
        message: 'User came back online'
      });
    });
  }

  private setupUIInteractionTracking(): void {
    // Track failed form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formName = form.getAttribute('name') || form.id || 'unknown';
      
      // Add breadcrumb for form submission
      this.addBreadcrumb({
        category: 'user-interaction',
        level: 'info',
        message: `Form submitted: ${formName}`,
        data: { formName, action: form.action }
      });
    });

    // Track click errors on critical elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Crisis button clicks
      if (target.dataset.crisisButton || target.closest('[data-crisis-button]')) {
        this.addBreadcrumb({
          category: 'user-interaction',
          level: 'info',
          message: 'Crisis button clicked',
          data: { 
            elementId: target.id,
            className: target.className,
            timestamp: Date.now()
          }
        });
      }
    });

    // Track rage clicks (repeated rapid clicks)
    let clickCount = 0;
    let clickTarget: EventTarget | null = null;
    let clickTimer: NodeJS.Timeout;

    document.addEventListener('click', (event) => {
      if (event.target === clickTarget) {
        clickCount++;
        if (clickCount >= 5) {
          this.captureError({
            type: ErrorType.UI_INTERACTION,
            message: 'Rage clicking detected - possible UI frustration',
            element: (event.target as HTMLElement).tagName,
            clickCount,
            severity: ErrorSeverity.MEDIUM
          });
        }
      } else {
        clickTarget = event.target;
        clickCount = 1;
      }

      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
        clickTarget = null;
      }, 2000);
    });
  }

  private setupCrisisSystemMonitoring(): void {
    // Monitor crisis-related elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for crisis modals/components
            if (element.getAttribute('data-crisis-modal') || 
                element.className.includes('crisis') ||
                element.textContent?.toLowerCase().includes('crisis')) {
              
              this.addBreadcrumb({
                category: 'dom',
                level: 'info',
                message: 'Crisis component rendered',
                data: {
                  elementType: element.tagName,
                  className: element.className,
                  isCrisisModal: !!element.getAttribute('data-crisis-modal')
                }
              });
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  captureError(errorData: any): void {
    const error = this.categorizeAndEnrichError(errorData);
    const fingerprint = this.generateErrorFingerprint(error);
    
    // Check if this error already exists
    const existingError = this.errors.get(fingerprint);
    if (existingError) {
      existingError.occurrenceCount++;
      existingError.lastSeen = Date.now();
      existingError.affectedUsers = this.countAffectedUsers(fingerprint);
    } else {
      error.fingerprint = fingerprint;
      error.id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      error.firstSeen = Date.now();
      error.lastSeen = Date.now();
      error.occurrenceCount = 1;
      error.affectedUsers = 1;
      
      this.errors.set(fingerprint, error);
    }

    // Send to analytics/monitoring
    this.sendErrorToAnalytics(error);
    
    // Check for crisis-sensitive errors
    if (this.isCrisisRelatedError(error)) {
      this.handleCrisisError(error);
    }
    
    // Check error rate thresholds
    this.checkErrorRateThresholds();
    
    // Add to breadcrumbs
    this.addBreadcrumb({
      category: 'console',
      level: 'error',
      message: error.message,
      data: { type: error.type, severity: error.severity }
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 Error captured:', error);
    }
  }

  private categorizeAndEnrichError(errorData: any): CategorizedError {
    const context = this.gatherErrorContext();
    
    // Determine error category and severity
    const type = errorData.type || this.detectErrorType(errorData);
    const severity = this.determineSeverity(errorData);
    const category = this.determineCategory(errorData);
    const impact = this.assessImpact(errorData);
    
    return {
      id: '',
      type,
      severity,
      category,
      impact,
      message: errorData.message || 'Unknown error',
      context: {
        ...context,
        stackTrace: errorData.stack || errorData.error?.stack
      },
      tags: this.generateErrorTags(errorData),
      fingerprint: '',
      isResolved: false,
      affectedUsers: 0,
      firstSeen: 0,
      lastSeen: 0,
      occurrenceCount: 0
    };
  }

  private gatherErrorContext(): ErrorContext {
    const context: ErrorContext = {
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      breadcrumbs: [...this.breadcrumbs].slice(-20) // Last 20 breadcrumbs
    };

    // Network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      context.network = {
        type: connection.effectiveType || 'unknown',
        downlink: connection.downlink,
        rtt: connection.rtt
      };
    }

    // Performance information
    if ('memory' in (performance as any)) {
      context.performance = {
        memory: (performance as any).memory.usedJSHeapSize
      };
    }

    // Navigation timing
    if (performance.getEntriesByType) {
      const navEntries = performance.getEntriesByType('navigation')[0];
      if (navEntries) {
        context.performance = {
          ...context.performance,
          timing: {
            domContentLoaded: navEntries.domContentLoadedEventEnd - navEntries.domContentLoadedEventStart,
            load: navEntries.loadEventEnd - navEntries.loadEventStart
          }
        };
      }
    }

    return context;
  }

  private detectErrorType(errorData: any): ErrorType {
    if (errorData.url || errorData.status) return ErrorType.NETWORK;
    if (errorData.responseTime || errorData.duration) return ErrorType.PERFORMANCE;
    if (errorData.message?.includes('auth')) return ErrorType.AUTHENTICATION;
    if (errorData.message?.includes('database') || errorData.message?.includes('firestore')) return ErrorType.DATABASE;
    if (errorData.clickCount) return ErrorType.UI_INTERACTION;
    if (errorData.reason) return ErrorType.UNHANDLED_PROMISE;
    return ErrorType.JAVASCRIPT;
  }

  private determineSeverity(errorData: any): ErrorSeverity {
    // Crisis-related errors are always high severity
    if (this.isCrisisRelatedError(errorData)) {
      return ErrorSeverity.EMERGENCY;
    }
    
    // Authentication errors are critical
    if (errorData.type === ErrorType.AUTHENTICATION) {
      return ErrorSeverity.CRITICAL;
    }
    
    // Network errors depend on the endpoint
    if (errorData.type === ErrorType.NETWORK) {
      if (errorData.status >= 500) return ErrorSeverity.HIGH;
      if (errorData.status >= 400) return ErrorSeverity.MEDIUM;
      return ErrorSeverity.LOW;
    }
    
    // Performance errors depend on impact
    if (errorData.type === ErrorType.PERFORMANCE) {
      if (errorData.duration > 5000 || errorData.clsValue > 0.25) return ErrorSeverity.HIGH;
      if (errorData.duration > 2000 || errorData.clsValue > 0.1) return ErrorSeverity.MEDIUM;
      return ErrorSeverity.LOW;
    }
    
    return ErrorSeverity.MEDIUM;
  }

  private determineCategory(errorData: any): ErrorCategory {
    if (errorData.url) return ErrorCategory.NETWORK_ISSUE;
    if (errorData.stack) return ErrorCategory.CLIENT_SIDE;
    return ErrorCategory.SYSTEM_ERROR;
  }

  private assessImpact(errorData: any): ErrorImpact {
    if (this.isCrisisRelatedError(errorData)) {
      return ErrorImpact.CRISIS_INTERVENTION_BLOCKED;
    }
    
    if (errorData.type === ErrorType.AUTHENTICATION) {
      return ErrorImpact.USER_BLOCKING;
    }
    
    if (errorData.type === ErrorType.PERFORMANCE && errorData.duration > 3000) {
      return ErrorImpact.PERFORMANCE_IMPACT;
    }
    
    if (errorData.type === ErrorType.DATABASE) {
      return ErrorImpact.DATA_LOSS_RISK;
    }
    
    return ErrorImpact.FEATURE_DEGRADATION;
  }

  private generateErrorTags(errorData: any): string[] {
    const tags = [];
    
    if (errorData.url) {
      tags.push(`url:${new URL(errorData.url).pathname}`);
    }
    
    if (errorData.userAgent) {
      const isMobile = /Mobile|Android|iPhone|iPad/.test(errorData.userAgent);
      tags.push(isMobile ? 'device:mobile' : 'device:desktop');
    }
    
    if (errorData.type) {
      tags.push(`type:${errorData.type}`);
    }
    
    return tags;
  }

  private generateErrorFingerprint(error: CategorizedError): string {
    // Create a unique fingerprint for grouping similar errors
    const components = [
      error.type,
      error.message.replace(/\d+/g, 'N'), // Replace numbers with N for grouping
      error.context.url.split('?')[0], // Remove query params
      error.context.stackTrace?.split('\n')[0] || '' // First line of stack trace
    ];
    
    return btoa(components.join('|')).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  private isCrisisRelatedError(errorData: any): boolean {
    const message = errorData.message?.toLowerCase() || '';
    const url = errorData.url?.toLowerCase() || '';
    
    return this.CRISIS_ERROR_PATTERNS.some(pattern => 
      pattern.test(message) || pattern.test(url)
    ) || 
    url.includes('crisis') || 
    url.includes('emergency') ||
    url.includes('support');
  }

  private handleCrisisError(error: CategorizedError): void {
    console.error('🚨 CRISIS SYSTEM ERROR DETECTED:', error);
    
    // Immediate escalation for crisis errors
    this.sendCrisisAlert(error);
    
    // Trigger fallback systems
    this.activateCrisisFallbacks();
  }

  private async sendCrisisAlert(error: CategorizedError): Promise<void> {
    try {
      await fetch('/api/monitoring/crisis-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'crisis_system_error',
          severity: 'emergency',
          error: {
            id: error.id,
            message: error.message,
            type: error.type,
            context: error.context
          },
          timestamp: Date.now()
        })
      });
    } catch (alertError) {
      console.error('Failed to send crisis alert:', alertError);
    }
  }

  private activateCrisisFallbacks(): void {
    // Activate offline crisis resources
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'ACTIVATE_CRISIS_FALLBACKS'
        });
      });
    }
    
    // Show emergency contacts overlay
    this.showEmergencyContacts();
  }

  private showEmergencyContacts(): void {
    // Create emergency contacts overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.9); z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; max-width: 400px;">
        <h2 style="color: #dc2626; margin: 0 0 20px;">System Error Detected</h2>
        <p style="margin: 15px 0;">If you're in crisis, please contact:</p>
        <div style="font-size: 24px; font-weight: bold; color: #dc2626; margin: 20px 0;">
          988 - Suicide & Crisis Lifeline
        </div>
        <div style="font-size: 20px; margin: 10px 0;">
          911 - Emergency Services
        </div>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="margin-top: 20px; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Close
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (overlay.parentElement) {
        overlay.remove();
      }
    }, 30000);
  }

  private checkErrorRateThresholds(): void {
    const recentErrors = Array.from(this.errors.values())
      .filter(error => Date.now() - error.lastSeen < 5 * 60 * 1000); // Last 5 minutes
    
    const totalRequests = this.getTotalRequests();
    const errorRate = recentErrors.length / Math.max(totalRequests, 1);
    
    if (errorRate >= this.ERROR_RATE_THRESHOLDS.EMERGENCY) {
      this.sendErrorRateAlert('emergency', errorRate);
    } else if (errorRate >= this.ERROR_RATE_THRESHOLDS.CRITICAL) {
      this.sendErrorRateAlert('critical', errorRate);
    } else if (errorRate >= this.ERROR_RATE_THRESHOLDS.WARNING) {
      this.sendErrorRateAlert('warning', errorRate);
    }
  }

  private getTotalRequests(): number {
    // This would integrate with performance monitoring
    return 100; // Placeholder
  }

  private async sendErrorRateAlert(level: string, rate: number): Promise<void> {
    try {
      await fetch('/api/monitoring/error-rate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          errorRate: rate,
          threshold: this.ERROR_RATE_THRESHOLDS[level.toUpperCase() as keyof typeof this.ERROR_RATE_THRESHOLDS],
          timestamp: Date.now(),
          sessionId: this.sessionId
        })
      });
    } catch (error) {
      console.error('Failed to send error rate alert:', error);
    }
  }

  private async sendErrorToAnalytics(error: CategorizedError): Promise<void> {
    try {
      await fetch('/api/monitoring/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      });
    } catch (analyticsError) {
      console.warn('Failed to send error to analytics:', analyticsError);
    }
  }

  private countAffectedUsers(fingerprint: string): number {
    // This would track unique users affected by this error
    return 1; // Placeholder
  }

  addBreadcrumb(breadcrumb: Omit<ErrorBreadcrumb, 'timestamp'>): void {
    this.breadcrumbs.push({
      ...breadcrumb,
      timestamp: Date.now()
    });
    
    // Keep only last 50 breadcrumbs
    if (this.breadcrumbs.length > 50) {
      this.breadcrumbs = this.breadcrumbs.slice(-25);
    }
  }

  // Public API methods
  getErrorSummary(): {
    totalErrors: number;
    criticalErrors: number;
    errorRate: number;
    topErrors: CategorizedError[];
  } {
    const errors = Array.from(this.errors.values());
    const criticalErrors = errors.filter(e => 
      e.severity === ErrorSeverity.CRITICAL || 
      e.severity === ErrorSeverity.EMERGENCY
    ).length;
    
    const topErrors = errors
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
      .slice(0, 10);
    
    return {
      totalErrors: errors.length,
      criticalErrors,
      errorRate: this.calculateCurrentErrorRate(),
      topErrors
    };
  }

  private calculateCurrentErrorRate(): number {
    const recentErrors = Array.from(this.errors.values())
      .filter(error => Date.now() - error.lastSeen < 5 * 60 * 1000);
    
    const totalRequests = this.getTotalRequests();
    return recentErrors.length / Math.max(totalRequests, 1);
  }

  resolveError(errorId: string, resolutionSteps: string[]): void {
    const error = Array.from(this.errors.values()).find(e => e.id === errorId);
    if (error) {
      error.isResolved = true;
      error.resolutionSteps = resolutionSteps;
      
      logger.info('Error resolved', {
        errorId,
        resolutionSteps
      }, {
        component: 'error-tracking',
        action: 'resolve_error'
      });
    }
  }

  clearErrors(): void {
    this.errors.clear();
    this.breadcrumbs = [];
    console.log('🧹 Error tracking data cleared');
  }

  exportErrorReport(): string {
    const errors = Array.from(this.errors.values());
    
    return JSON.stringify({
      sessionId: this.sessionId,
      timestamp: Date.now(),
      summary: this.getErrorSummary(),
      errors: errors.map(error => ({
        ...error,
        context: {
          ...error.context,
          breadcrumbs: error.context.breadcrumbs.slice(-5) // Last 5 breadcrumbs per error
        }
      }))
    }, null, 2);
  }
}

// Global error tracking instance
export const errorTracking = ErrorTrackingExcellence.getInstance();

// React hook for error tracking
export function useErrorTracking() {
  return {
    captureError: (error: any) => errorTracking.captureError(error),
    addBreadcrumb: (breadcrumb: Omit<ErrorBreadcrumb, 'timestamp'>) => 
      errorTracking.addBreadcrumb(breadcrumb),
    getErrorSummary: () => errorTracking.getErrorSummary(),
    resolveError: (errorId: string, steps: string[]) => 
      errorTracking.resolveError(errorId, steps),
    exportReport: () => errorTracking.exportErrorReport()
  };
}

export default ErrorTrackingExcellence;