/**
 * ALCHM Comprehensive Error Handling System
 * 
 * Trauma-informed error handling that maintains crisis support access
 * and provides graceful degradation for all edge cases.
 */

export interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  url?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'network' | 'data' | 'ui' | 'crisis' | 'system';
  recoverable: boolean;
  metadata?: Record<string, any>;
}

export interface ErrorRecoveryAction {
  label: string;
  action: () => void;
  priority: number;
  crisisSafe: boolean;
}

export class TraumaInformedErrorHandler {
  private static errorLog: ErrorContext[] = [];
  private static maxLogSize = 100;

  /**
   * Handle errors with trauma-informed approach
   */
  static handleError(
    error: Error | string,
    context: Partial<ErrorContext> = {}
  ): ErrorRecoveryAction[] {
    const errorContext: ErrorContext = {
      timestamp: new Date(),
      severity: context.severity || 'medium',
      category: context.category || 'system',
      recoverable: context.recoverable !== false,
      component: context.component || 'unknown',
      action: context.action || 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
      userId: context.userId,
      metadata: context.metadata || {}
    };

    // Add error message
    const errorMessage = typeof error === 'string' ? error : error.message;
    errorContext.metadata = {
      ...errorContext.metadata,
      message: errorMessage,
      stack: typeof error !== 'string' ? error.stack : undefined
    };

    // Log error
    this.logError(errorContext);

    // Generate recovery actions
    const recoveryActions = this.generateRecoveryActions(errorContext);

    // Handle crisis scenarios specially
    if (errorContext.category === 'crisis' || errorContext.severity === 'critical') {
      this.handleCrisisError(errorContext);
    }

    // Track error patterns
    this.trackErrorPatterns(errorContext);

    return recoveryActions;
  }

  /**
   * Generate contextual recovery actions
   */
  private static generateRecoveryActions(context: ErrorContext): ErrorRecoveryAction[] {
    const actions: ErrorRecoveryAction[] = [];

    // Always provide crisis support if error is blocking user access
    if (context.severity === 'high' || context.severity === 'critical') {
      actions.push({
        label: '🚨 Get Emergency Help',
        action: () => this.activateEmergencySupport(),
        priority: 1,
        crisisSafe: true
      });
    }

    // Category-specific recovery actions
    switch (context.category) {
      case 'auth':
        actions.push(
          {
            label: 'Try Signing In Again',
            action: () => this.retryAuthentication(),
            priority: 2,
            crisisSafe: true
          },
          {
            label: 'Use Guest Mode',
            action: () => this.activateGuestMode(),
            priority: 3,
            crisisSafe: true
          }
        );
        break;

      case 'network':
        actions.push(
          {
            label: 'Retry Connection',
            action: () => this.retryNetworkOperation(),
            priority: 2,
            crisisSafe: true
          },
          {
            label: 'Work Offline',
            action: () => this.activateOfflineMode(),
            priority: 3,
            crisisSafe: true
          }
        );
        break;

      case 'data':
        actions.push(
          {
            label: 'Refresh Data',
            action: () => this.refreshData(),
            priority: 2,
            crisisSafe: false
          },
          {
            label: 'Use Cached Version',
            action: () => this.useCachedData(),
            priority: 3,
            crisisSafe: true
          }
        );
        break;

      case 'ui':
        actions.push(
          {
            label: 'Reset Interface',
            action: () => this.resetUIState(),
            priority: 2,
            crisisSafe: true
          },
          {
            label: 'Simple View',
            action: () => this.activateSimpleView(),
            priority: 3,
            crisisSafe: true
          }
        );
        break;
    }

    // General recovery actions
    actions.push(
      {
        label: 'Reload Page',
        action: () => this.reloadPage(),
        priority: 8,
        crisisSafe: true
      },
      {
        label: 'Go Home',
        action: () => this.goToSafeSpace(),
        priority: 9,
        crisisSafe: true
      }
    );

    return actions.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Handle crisis-level errors with immediate support access
   */
  private static handleCrisisError(context: ErrorContext): void {
    // Log crisis error with high priority
    console.error('CRISIS ERROR:', context);

    // Notify monitoring systems immediately
    this.notifyEmergencyMonitoring(context);

    // Activate emergency mode if possible
    if (typeof window !== 'undefined') {
      try {
        // Set emergency flag in localStorage for persistent state
        localStorage.setItem('alchm-emergency-mode', JSON.stringify({
          activated: true,
          timestamp: new Date().toISOString(),
          reason: context.metadata?.message || 'Unknown error'
        }));

        // Show emergency notification
        this.showEmergencyNotification();
      } catch (storageError) {
        console.error('Failed to activate emergency mode:', storageError);
      }
    }
  }

  /**
   * Track error patterns for proactive prevention
   */
  private static trackErrorPatterns(context: ErrorContext): void {
    // Add to error log
    this.errorLog.push(context);

    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Detect error patterns
    const recentErrors = this.errorLog.filter(
      log => Date.now() - log.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );

    // Check for error cascades
    if (recentErrors.length >= 5) {
      this.handleErrorCascade(recentErrors);
    }

    // Check for specific error patterns
    const categoryErrors = recentErrors.filter(log => log.category === context.category);
    if (categoryErrors.length >= 3) {
      this.handleCategoryErrorPattern(context.category, categoryErrors);
    }
  }

  /**
   * Handle error cascades by activating safe mode
   */
  private static handleErrorCascade(errors: ErrorContext[]): void {
    console.warn('Error cascade detected, activating safe mode');
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-safe-mode', JSON.stringify({
        activated: true,
        timestamp: new Date().toISOString(),
        errorCount: errors.length
      }));

      // Show safe mode notification
      this.showSafeModeNotification();
    }
  }

  /**
   * Handle category-specific error patterns
   */
  private static handleCategoryErrorPattern(category: string, errors: ErrorContext[]): void {
    switch (category) {
      case 'network':
        this.activateOfflineMode();
        break;
      case 'auth':
        this.showAuthenticationHelp();
        break;
      case 'data':
        this.activateDataRecoveryMode();
        break;
    }
  }

  // Recovery Action Implementations
  private static activateEmergencySupport(): void {
    if (typeof window !== 'undefined') {
      // Try to call 988 directly
      const confirmed = window.confirm(
        'Would you like to call the 988 Suicide & Crisis Lifeline for immediate support?'
      );
      if (confirmed) {
        window.location.href = 'tel:988';
      }
    }
  }

  private static retryAuthentication(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login?retry=true';
    }
  }

  private static activateGuestMode(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-guest-mode', 'true');
      window.location.href = '/journal?mode=guest';
    }
  }

  private static retryNetworkOperation(): void {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  private static activateOfflineMode(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-offline-mode', 'true');
      // Trigger offline mode UI update
      window.dispatchEvent(new CustomEvent('alchm:offline-mode-activated'));
    }
  }

  private static refreshData(): void {
    if (typeof window !== 'undefined') {
      // Clear relevant caches and reload
      localStorage.removeItem('alchm-cached-data');
      window.location.reload();
    }
  }

  private static useCachedData(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-use-cache', 'true');
      window.dispatchEvent(new CustomEvent('alchm:use-cached-data'));
    }
  }

  private static resetUIState(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alchm-ui-state');
      window.location.reload();
    }
  }

  private static activateSimpleView(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-simple-view', 'true');
      window.dispatchEvent(new CustomEvent('alchm:simple-view-activated'));
    }
  }

  private static reloadPage(): void {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  private static goToSafeSpace(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Utility functions
  private static logError(context: ErrorContext): void {
    console.error('[ALCHM Error]', {
      category: context.category,
      severity: context.severity,
      component: context.component,
      message: context.metadata?.message,
      timestamp: context.timestamp.toISOString()
    });

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(context);
    }
  }

  private static sendToMonitoring(context: ErrorContext): void {
    // Example integration with monitoring service
    try {
      fetch('/api/error-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: context,
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(err => {
        console.warn('Failed to send error to monitoring:', err);
      });
    } catch (error) {
      console.warn('Error monitoring service unavailable');
    }
  }

  private static notifyEmergencyMonitoring(context: ErrorContext): void {
    // High-priority notification for crisis errors
    try {
      fetch('/api/emergency-monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          severity: 'emergency',
          error: context,
          requiresImmediate: true
        })
      }).catch(err => {
        console.error('Failed to notify emergency monitoring:', err);
      });
    } catch (error) {
      console.error('Emergency monitoring unavailable');
    }
  }

  private static showEmergencyNotification(): void {
    // Show emergency support notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #dc2626; color: white; padding: 1rem; text-align: center; z-index: 9999;">
        <p><strong>Emergency Mode Activated</strong></p>
        <p>Crisis support: <a href="tel:988" style="color: #fca5a5;">Call 988</a> | <a href="sms:741741&body=HOME" style="color: #fca5a5;">Text HOME</a></p>
      </div>
    `;
    document.body.appendChild(notification);
  }

  private static showSafeModeNotification(): void {
    // Show safe mode notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="position: fixed; top: 0; left: 0; right: 0; background: #f59e0b; color: white; padding: 1rem; text-align: center; z-index: 9998;">
        <p><strong>Safe Mode Activated</strong> - Simplified interface for better stability</p>
      </div>
    `;
    document.body.appendChild(notification);
  }

  private static showAuthenticationHelp(): void {
    console.log('Activating authentication help mode');
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-auth-help', 'true');
    }
  }

  private static activateDataRecoveryMode(): void {
    console.log('Activating data recovery mode');
    if (typeof window !== 'undefined') {
      localStorage.setItem('alchm-data-recovery', 'true');
    }
  }

  /**
   * Get error statistics for monitoring
   */
  static getErrorStatistics(): {
    total: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    recentErrors: number;
  } {
    const now = Date.now();
    const recentThreshold = 24 * 60 * 60 * 1000; // 24 hours

    const recentErrors = this.errorLog.filter(
      log => now - log.timestamp.getTime() < recentThreshold
    );

    const byCategory = this.errorLog.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = this.errorLog.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorLog.length,
      byCategory,
      bySeverity,
      recentErrors: recentErrors.length
    };
  }

  /**
   * Clear error log (for testing or reset)
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Global error handlers
if (typeof window !== 'undefined') {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', event => {
    TraumaInformedErrorHandler.handleError(
      `Unhandled Promise Rejection: ${event.reason}`,
      {
        category: 'system',
        severity: 'high',
        action: 'promise_rejection',
        metadata: { reason: event.reason }
      }
    );
  });

  // Handle global JavaScript errors
  window.addEventListener('error', event => {
    TraumaInformedErrorHandler.handleError(
      event.error || event.message,
      {
        category: 'system',
        severity: 'high',
        action: 'javascript_error',
        metadata: {
          filename: event.filename,
          line: event.lineno,
          column: event.colno
        }
      }
    );
  });
}

// Export utilities for component use
export const useErrorHandler = () => {
  const handleError = (error: Error | string, context?: Partial<ErrorContext>) => {
    return TraumaInformedErrorHandler.handleError(error, context);
  };

  return { handleError };
};

export const useCrisisErrorHandler = () => {
  const handleCrisisError = (error: Error | string, metadata?: any) => {
    return TraumaInformedErrorHandler.handleError(error, {
      category: 'crisis',
      severity: 'critical',
      metadata
    });
  };

  return { handleCrisisError };
};

export { TraumaInformedErrorHandler };