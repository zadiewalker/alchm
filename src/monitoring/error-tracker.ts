/**
 * ALCHM Error Tracker
 * Crisis-aware error tracking and incident response system
 * Priority: Mental health platform errors can be life-threatening
 */

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { performanceMonitor } from './performance-monitor';

// Error severity levels for mental health platform
type ErrorSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

// Crisis-specific error categories
type CrisisErrorType = 
  | 'CRISIS_RESOURCE_FAILURE' 
  | 'AUTH_FAILURE_CRISIS_USER'
  | 'AI_RESPONSE_FAILURE'
  | 'THERAPIST_DASHBOARD_ERROR'
  | 'PAYMENT_FAILURE'
  | 'DATA_LOSS_RISK'
  | 'NETWORK_FAILURE'
  | 'OFFLINE_SYNC_FAILURE'
  | 'SECURITY_BREACH'
  | 'PERFORMANCE_DEGRADATION';

interface ErrorContext {
  timestamp: number;
  route: string;
  userId?: string;
  sessionId: string;
  userAgent: string;
  viewport: string;
  connectionType?: string;
  batteryLevel?: number;
  isCrisisMode: boolean;
  isTherapistUser: boolean;
  errorBoundary?: string;
  componentStack?: string;
  props?: Record<string, any>;
  state?: Record<string, any>;
  performanceMetrics?: {
    memoryUsage: number;
    timing: PerformanceTiming;
  };
  userJourney?: string[];
  mentalHealthContext?: {
    journalEntryInProgress: boolean;
    crisisDetectionActive: boolean;
    therapistSessionActive: boolean;
    communityInteractionActive: boolean;
  };
}

interface ErrorEvent {
  id: string;
  message: string;
  stack: string;
  type: CrisisErrorType;
  severity: ErrorSeverity;
  source: 'javascript' | 'network' | 'resource' | 'csp' | 'unhandledrejection';
  context: ErrorContext;
  fingerprint: string; // For deduplication
  userImpact: 'BLOCKS_CRISIS_SUPPORT' | 'DEGRADES_EXPERIENCE' | 'MINOR_ISSUE';
  autoResolved?: boolean;
  resolutionAttempts: number;
  escalated: boolean;
  healthScore: number; // Impact on platform health (0-100)
}

interface AlertConfig {
  immediate: boolean;
  notificationChannels: ('email' | 'sms' | 'slack' | 'pager')[];
  escalationDelay: number;
  maxOccurrences: number;
  timeWindow: number; // minutes
}

class ALCHMErrorTracker {
  private errorQueue: ErrorEvent[] = [];
  private alertConfigs: Map<CrisisErrorType, AlertConfig> = new Map();
  private errorPatterns: Map<string, number> = new Map();
  private criticalErrorCallback?: (error: ErrorEvent) => void;
  private isInitialized = false;

  constructor() {
    this.initializeAlertConfigs();
    this.initializeErrorHandlers();
    this.initializeNetworkErrorTracking();
  }

  private initializeAlertConfigs() {
    // Crisis resource failures - immediate escalation
    this.alertConfigs.set('CRISIS_RESOURCE_FAILURE', {
      immediate: true,
      notificationChannels: ['sms', 'pager', 'email'],
      escalationDelay: 0,
      maxOccurrences: 1,
      timeWindow: 1
    });

    // Authentication failures for crisis users
    this.alertConfigs.set('AUTH_FAILURE_CRISIS_USER', {
      immediate: true,
      notificationChannels: ['sms', 'email'],
      escalationDelay: 30000, // 30 seconds
      maxOccurrences: 3,
      timeWindow: 5
    });

    // AI response failures
    this.alertConfigs.set('AI_RESPONSE_FAILURE', {
      immediate: true,
      notificationChannels: ['email', 'slack'],
      escalationDelay: 60000, // 1 minute
      maxOccurrences: 5,
      timeWindow: 10
    });

    // Therapist dashboard errors
    this.alertConfigs.set('THERAPIST_DASHBOARD_ERROR', {
      immediate: false,
      notificationChannels: ['email', 'slack'],
      escalationDelay: 300000, // 5 minutes
      maxOccurrences: 10,
      timeWindow: 30
    });

    // Data loss risks
    this.alertConfigs.set('DATA_LOSS_RISK', {
      immediate: true,
      notificationChannels: ['sms', 'pager', 'email'],
      escalationDelay: 0,
      maxOccurrences: 1,
      timeWindow: 1
    });

    // Security breaches
    this.alertConfigs.set('SECURITY_BREACH', {
      immediate: true,
      notificationChannels: ['sms', 'pager', 'email', 'slack'],
      escalationDelay: 0,
      maxOccurrences: 1,
      timeWindow: 1
    });
  }

  private initializeErrorHandlers() {
    if (typeof window === 'undefined') return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleUnhandledRejection(event);
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true);

    // CSP violations
    document.addEventListener('securitypolicyviolation', (event) => {
      this.handleCSPViolation(event);
    });

    this.isInitialized = true;
    console.log('🛡️ ALCHM Error Tracker initialized');
  }

  private initializeNetworkErrorTracking() {
    // Intercept fetch failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          await this.handleNetworkError(args[0], response);
        }
        
        return response;
      } catch (error) {
        await this.handleNetworkError(args[0], null, error);
        throw error;
      }
    };

    // Track XMLHttpRequest failures
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends originalXHR {
      constructor() {
        super();
        
        this.addEventListener('error', () => {
          this.handleXHRError(this);
        });
        
        this.addEventListener('timeout', () => {
          this.handleXHRTimeout(this);
        });
      }
    } as any;
  }

  private async handleError(errorInfo: any) {
    const context = await this.gatherContext();
    const errorType = this.classifyError(errorInfo, context);
    const severity = this.assessSeverity(errorType, context);
    
    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: errorInfo.message || 'Unknown error',
      stack: errorInfo.error?.stack || '',
      type: errorType,
      severity,
      source: 'javascript',
      context,
      fingerprint: this.generateFingerprint(errorInfo, context),
      userImpact: this.assessUserImpact(errorType, context),
      autoResolved: false,
      resolutionAttempts: 0,
      escalated: false,
      healthScore: this.calculateHealthScore(errorType, context)
    };

    await this.processError(errorEvent);
  }

  private async handleUnhandledRejection(event: PromiseRejectionEvent) {
    const context = await this.gatherContext();
    const errorType = this.classifyPromiseRejection(event.reason, context);
    
    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: `Unhandled Promise Rejection: ${event.reason}`,
      stack: event.reason?.stack || '',
      type: errorType,
      severity: 'HIGH',
      source: 'unhandledrejection',
      context,
      fingerprint: this.generateFingerprint(event.reason, context),
      userImpact: this.assessUserImpact(errorType, context),
      autoResolved: false,
      resolutionAttempts: 0,
      escalated: false,
      healthScore: this.calculateHealthScore(errorType, context)
    };

    await this.processError(errorEvent);
  }

  private async handleResourceError(event: Event) {
    const target = event.target as HTMLElement;
    const context = await this.gatherContext();
    
    let errorType: CrisisErrorType = 'NETWORK_FAILURE';
    
    if (target.getAttribute('src')?.includes('crisis') || 
        target.getAttribute('href')?.includes('emergency')) {
      errorType = 'CRISIS_RESOURCE_FAILURE';
    }

    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: `Resource failed to load: ${target.tagName} ${target.getAttribute('src') || target.getAttribute('href')}`,
      stack: '',
      type: errorType,
      severity: errorType === 'CRISIS_RESOURCE_FAILURE' ? 'CRITICAL' : 'MEDIUM',
      source: 'resource',
      context,
      fingerprint: this.generateFingerprint(target, context),
      userImpact: errorType === 'CRISIS_RESOURCE_FAILURE' ? 'BLOCKS_CRISIS_SUPPORT' : 'DEGRADES_EXPERIENCE',
      autoResolved: false,
      resolutionAttempts: 0,
      escalated: false,
      healthScore: this.calculateHealthScore(errorType, context)
    };

    await this.processError(errorEvent);
  }

  private async handleCSPViolation(event: SecurityPolicyViolationEvent) {
    const context = await this.gatherContext();
    
    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: `CSP Violation: ${event.violatedDirective} - ${event.blockedURI}`,
      stack: '',
      type: 'SECURITY_BREACH',
      severity: 'CRITICAL',
      source: 'csp',
      context: {
        ...context,
        cspViolation: {
          violatedDirective: event.violatedDirective,
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          effectiveDirective: event.effectiveDirective
        }
      },
      fingerprint: this.generateFingerprint(event, context),
      userImpact: 'BLOCKS_CRISIS_SUPPORT',
      autoResolved: false,
      resolutionAttempts: 0,
      escalated: false,
      healthScore: 0 // Security breach gets lowest health score
    };

    await this.processError(errorEvent);
  }

  private async handleNetworkError(url: RequestInfo, response: Response | null, error?: Error) {
    const context = await this.gatherContext();
    const urlString = typeof url === 'string' ? url : url.url;
    
    let errorType: CrisisErrorType = 'NETWORK_FAILURE';
    
    // Classify network errors by endpoint
    if (urlString.includes('/api/crisis') || urlString.includes('/emergency')) {
      errorType = 'CRISIS_RESOURCE_FAILURE';
    } else if (urlString.includes('/api/auth')) {
      errorType = context.isCrisisMode ? 'AUTH_FAILURE_CRISIS_USER' : 'NETWORK_FAILURE';
    } else if (urlString.includes('/api/ai') || urlString.includes('/khepera')) {
      errorType = 'AI_RESPONSE_FAILURE';
    } else if (urlString.includes('/stripe') || urlString.includes('/payment')) {
      errorType = 'PAYMENT_FAILURE';
    }

    const errorEvent: ErrorEvent = {
      id: this.generateErrorId(),
      message: `Network error: ${response?.status} ${response?.statusText} - ${urlString}`,
      stack: error?.stack || '',
      type: errorType,
      severity: this.assessSeverity(errorType, context),
      source: 'network',
      context: {
        ...context,
        networkError: {
          url: urlString,
          status: response?.status,
          statusText: response?.statusText,
          headers: response?.headers ? Object.fromEntries(response.headers.entries()) : undefined
        }
      },
      fingerprint: this.generateFingerprint({ url: urlString, status: response?.status }, context),
      userImpact: this.assessUserImpact(errorType, context),
      autoResolved: false,
      resolutionAttempts: 0,
      escalated: false,
      healthScore: this.calculateHealthScore(errorType, context)
    };

    await this.processError(errorEvent);
  }

  private handleXHRError(xhr: XMLHttpRequest) {
    // Handle XMLHttpRequest errors
    console.warn('XHR Error detected:', xhr.responseURL, xhr.status);
  }

  private handleXHRTimeout(xhr: XMLHttpRequest) {
    // Handle XMLHttpRequest timeouts
    console.warn('XHR Timeout detected:', xhr.responseURL);
  }

  private async gatherContext(): Promise<ErrorContext> {
    const context: ErrorContext = {
      timestamp: Date.now(),
      route: window.location.pathname,
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isCrisisMode: this.detectCrisisMode(),
      isTherapistUser: this.detectTherapistUser(),
      userJourney: this.getUserJourney(),
      mentalHealthContext: await this.getMentalHealthContext()
    };

    // Add connection info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      context.connectionType = connection.effectiveType;
    }

    // Add battery info
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        context.batteryLevel = Math.round(battery.level * 100);
      } catch {}
    }

    // Add performance metrics
    if ('memory' in performance) {
      context.performanceMetrics = {
        memoryUsage: (performance as any).memory.usedJSHeapSize,
        timing: performance.timing
      };
    }

    // Add user ID if available
    const userId = this.getCurrentUserId();
    if (userId) {
      context.userId = userId;
    }

    return context;
  }

  private classifyError(errorInfo: any, context: ErrorContext): CrisisErrorType {
    const message = errorInfo.message?.toLowerCase() || '';
    const stack = errorInfo.error?.stack?.toLowerCase() || '';
    
    // Crisis-specific error classification
    if (context.isCrisisMode) {
      if (message.includes('auth') || message.includes('login')) {
        return 'AUTH_FAILURE_CRISIS_USER';
      }
      if (message.includes('network') || message.includes('fetch')) {
        return 'CRISIS_RESOURCE_FAILURE';
      }
    }

    // AI/Khepera errors
    if (message.includes('ai') || message.includes('khepera') || stack.includes('khepera')) {
      return 'AI_RESPONSE_FAILURE';
    }

    // Therapist dashboard errors
    if (context.isTherapistUser || context.route.includes('/therapist')) {
      return 'THERAPIST_DASHBOARD_ERROR';
    }

    // Data persistence errors
    if (message.includes('indexeddb') || message.includes('localstorage') || 
        message.includes('firestore') || stack.includes('firebase')) {
      return 'DATA_LOSS_RISK';
    }

    // Performance-related errors
    if (message.includes('memory') || message.includes('performance')) {
      return 'PERFORMANCE_DEGRADATION';
    }

    // Network errors
    if (message.includes('network') || message.includes('fetch') || message.includes('xhr')) {
      return 'NETWORK_FAILURE';
    }

    // Default classification
    return 'NETWORK_FAILURE';
  }

  private classifyPromiseRejection(reason: any, context: ErrorContext): CrisisErrorType {
    const reasonString = String(reason).toLowerCase();
    
    if (reasonString.includes('firestore') || reasonString.includes('firebase')) {
      return context.mentalHealthContext?.journalEntryInProgress ? 'DATA_LOSS_RISK' : 'NETWORK_FAILURE';
    }
    
    if (reasonString.includes('auth')) {
      return context.isCrisisMode ? 'AUTH_FAILURE_CRISIS_USER' : 'NETWORK_FAILURE';
    }
    
    return 'NETWORK_FAILURE';
  }

  private assessSeverity(errorType: CrisisErrorType, context: ErrorContext): ErrorSeverity {
    // Crisis mode escalates everything
    if (context.isCrisisMode) {
      switch (errorType) {
        case 'CRISIS_RESOURCE_FAILURE':
        case 'AUTH_FAILURE_CRISIS_USER':
        case 'DATA_LOSS_RISK':
          return 'CRITICAL';
        case 'AI_RESPONSE_FAILURE':
        case 'NETWORK_FAILURE':
          return 'HIGH';
        default:
          return 'MEDIUM';
      }
    }

    // Standard severity assessment
    switch (errorType) {
      case 'CRISIS_RESOURCE_FAILURE':
      case 'SECURITY_BREACH':
      case 'DATA_LOSS_RISK':
        return 'CRITICAL';
      case 'AI_RESPONSE_FAILURE':
      case 'AUTH_FAILURE_CRISIS_USER':
      case 'THERAPIST_DASHBOARD_ERROR':
        return 'HIGH';
      case 'PAYMENT_FAILURE':
      case 'PERFORMANCE_DEGRADATION':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  private assessUserImpact(errorType: CrisisErrorType, context: ErrorContext): 'BLOCKS_CRISIS_SUPPORT' | 'DEGRADES_EXPERIENCE' | 'MINOR_ISSUE' {
    if (context.isCrisisMode) {
      return 'BLOCKS_CRISIS_SUPPORT';
    }

    switch (errorType) {
      case 'CRISIS_RESOURCE_FAILURE':
      case 'AUTH_FAILURE_CRISIS_USER':
      case 'SECURITY_BREACH':
      case 'DATA_LOSS_RISK':
        return 'BLOCKS_CRISIS_SUPPORT';
      case 'AI_RESPONSE_FAILURE':
      case 'THERAPIST_DASHBOARD_ERROR':
      case 'PAYMENT_FAILURE':
        return 'DEGRADES_EXPERIENCE';
      default:
        return 'MINOR_ISSUE';
    }
  }

  private calculateHealthScore(errorType: CrisisErrorType, context: ErrorContext): number {
    let score = 100;

    // Deduct based on error type
    switch (errorType) {
      case 'SECURITY_BREACH':
        score = 0;
        break;
      case 'CRISIS_RESOURCE_FAILURE':
      case 'DATA_LOSS_RISK':
        score = 10;
        break;
      case 'AUTH_FAILURE_CRISIS_USER':
      case 'AI_RESPONSE_FAILURE':
        score = 30;
        break;
      case 'THERAPIST_DASHBOARD_ERROR':
      case 'PAYMENT_FAILURE':
        score = 60;
        break;
      default:
        score = 80;
    }

    // Additional deductions for crisis context
    if (context.isCrisisMode) {
      score = Math.max(0, score - 20);
    }

    if (context.mentalHealthContext?.crisisDetectionActive) {
      score = Math.max(0, score - 30);
    }

    return score;
  }

  private async processError(errorEvent: ErrorEvent) {
    // Add to error queue
    this.errorQueue.push(errorEvent);

    // Pattern detection
    this.updateErrorPatterns(errorEvent);

    // Store error
    await this.storeError(errorEvent);

    // Check for immediate escalation
    const alertConfig = this.alertConfigs.get(errorEvent.type);
    if (alertConfig?.immediate || errorEvent.severity === 'CRITICAL') {
      await this.escalateError(errorEvent);
    }

    // Attempt auto-resolution
    if (this.canAutoResolve(errorEvent)) {
      await this.attemptAutoResolution(errorEvent);
    }

    // Update health monitoring
    await this.updateHealthStatus(errorEvent);

    // Emit error event for dashboard
    this.emitErrorEvent(errorEvent);

    // Callback for critical errors
    if (this.criticalErrorCallback && errorEvent.severity === 'CRITICAL') {
      this.criticalErrorCallback(errorEvent);
    }
  }

  private updateErrorPatterns(errorEvent: ErrorEvent) {
    const pattern = errorEvent.fingerprint;
    const count = this.errorPatterns.get(pattern) || 0;
    this.errorPatterns.set(pattern, count + 1);

    // Check for error spikes
    if (count > 5) {
      console.warn(`🚨 Error spike detected: ${pattern} (${count + 1} occurrences)`);
    }
  }

  private async storeError(errorEvent: ErrorEvent) {
    try {
      await addDoc(collection(db, 'error_events'), {
        ...errorEvent,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to store error event:', error);
      // Fallback to local storage for critical errors
      if (errorEvent.severity === 'CRITICAL') {
        this.storeErrorLocally(errorEvent);
      }
    }
  }

  private storeErrorLocally(errorEvent: ErrorEvent) {
    try {
      const errors = JSON.parse(localStorage.getItem('alchm_critical_errors') || '[]');
      errors.push(errorEvent);
      localStorage.setItem('alchm_critical_errors', JSON.stringify(errors));
    } catch {
      // If localStorage fails, at least log to console
      console.error('CRITICAL ERROR STORAGE FAILURE:', errorEvent);
    }
  }

  private async escalateError(errorEvent: ErrorEvent) {
    console.error('🚨 ESCALATING ERROR:', errorEvent);

    // Mark as escalated
    errorEvent.escalated = true;

    // Store escalation event
    await addDoc(collection(db, 'error_escalations'), {
      errorId: errorEvent.id,
      errorType: errorEvent.type,
      severity: errorEvent.severity,
      userImpact: errorEvent.userImpact,
      context: errorEvent.context,
      timestamp: serverTimestamp(),
      escalationReason: 'IMMEDIATE_ATTENTION_REQUIRED'
    });

    // Trigger external notifications
    await this.triggerNotifications(errorEvent);
  }

  private async triggerNotifications(errorEvent: ErrorEvent) {
    const alertConfig = this.alertConfigs.get(errorEvent.type);
    if (!alertConfig) return;

    // Emit notification event for external systems
    const notificationEvent = new CustomEvent('alchm:error:notification', {
      detail: {
        error: errorEvent,
        channels: alertConfig.notificationChannels,
        immediate: alertConfig.immediate
      }
    });
    
    window.dispatchEvent(notificationEvent);
  }

  private canAutoResolve(errorEvent: ErrorEvent): boolean {
    // Only attempt auto-resolution for specific error types
    const autoResolvableTypes: CrisisErrorType[] = [
      'NETWORK_FAILURE',
      'PERFORMANCE_DEGRADATION',
      'OFFLINE_SYNC_FAILURE'
    ];

    return autoResolvableTypes.includes(errorEvent.type) && 
           errorEvent.resolutionAttempts < 3;
  }

  private async attemptAutoResolution(errorEvent: ErrorEvent) {
    errorEvent.resolutionAttempts++;

    switch (errorEvent.type) {
      case 'NETWORK_FAILURE':
        await this.resolveNetworkFailure(errorEvent);
        break;
      case 'PERFORMANCE_DEGRADATION':
        await this.resolvePerformanceDegradation(errorEvent);
        break;
      case 'OFFLINE_SYNC_FAILURE':
        await this.resolveOfflineSyncFailure(errorEvent);
        break;
    }
  }

  private async resolveNetworkFailure(errorEvent: ErrorEvent) {
    // Activate offline mode
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'ACTIVATE_OFFLINE_MODE',
        errorId: errorEvent.id
      });
    }

    // Mark as auto-resolved
    errorEvent.autoResolved = true;
    console.log('✅ Auto-resolved network failure with offline mode');
  }

  private async resolvePerformanceDegradation(errorEvent: ErrorEvent) {
    // Trigger performance optimization
    performanceMonitor.startMonitoring();
    
    // Clear memory if possible
    if ('gc' in window) {
      (window as any).gc();
    }

    errorEvent.autoResolved = true;
    console.log('✅ Auto-resolved performance degradation');
  }

  private async resolveOfflineSyncFailure(errorEvent: ErrorEvent) {
    // Queue for retry when online
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'QUEUE_OFFLINE_SYNC',
        errorId: errorEvent.id
      });
    }

    errorEvent.autoResolved = true;
    console.log('✅ Auto-resolved offline sync failure');
  }

  private async updateHealthStatus(errorEvent: ErrorEvent) {
    const healthStatus = {
      timestamp: Date.now(),
      errorId: errorEvent.id,
      healthScore: errorEvent.healthScore,
      errorType: errorEvent.type,
      severity: errorEvent.severity,
      userImpact: errorEvent.userImpact
    };

    // Emit health update event
    const healthEvent = new CustomEvent('alchm:health:update', {
      detail: healthStatus
    });
    window.dispatchEvent(healthEvent);
  }

  private emitErrorEvent(errorEvent: ErrorEvent) {
    const event = new CustomEvent('alchm:error:tracked', {
      detail: errorEvent
    });
    window.dispatchEvent(event);
  }

  // Utility methods
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: any, context: ErrorContext): string {
    const message = error?.message || String(error);
    const route = context.route;
    const userAgent = context.userAgent.split(' ')[0]; // Simplified user agent
    
    return btoa(`${message}:${route}:${userAgent}`).substr(0, 16);
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('alchm_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('alchm_session_id', sessionId);
    }
    return sessionId;
  }

  private detectCrisisMode(): boolean {
    return [
      window.location.pathname.includes('/crisis'),
      window.location.pathname.includes('/emergency'),
      document.body.classList.contains('crisis-mode'),
      sessionStorage.getItem('crisis-mode') === 'true',
      localStorage.getItem('user-crisis-state') === 'active'
    ].some(Boolean);
  }

  private detectTherapistUser(): boolean {
    return [
      window.location.pathname.includes('/therapist'),
      window.location.pathname.includes('/professional'),
      localStorage.getItem('user-role') === 'therapist',
      document.body.classList.contains('therapist-user')
    ].some(Boolean);
  }

  private getUserJourney(): string[] {
    const journey = JSON.parse(sessionStorage.getItem('user_journey') || '[]');
    return journey.slice(-10); // Last 10 pages
  }

  private async getMentalHealthContext() {
    return {
      journalEntryInProgress: !!document.querySelector('[data-journal-active]'),
      crisisDetectionActive: !!sessionStorage.getItem('crisis-detection-active'),
      therapistSessionActive: !!sessionStorage.getItem('therapist-session-active'),
      communityInteractionActive: !!document.querySelector('[data-community-active]')
    };
  }

  private getCurrentUserId(): string | undefined {
    return localStorage.getItem('user-id') || undefined;
  }

  // Public methods
  public setCriticalErrorCallback(callback: (error: ErrorEvent) => void) {
    this.criticalErrorCallback = callback;
  }

  public async getErrorStats() {
    const recentErrors = this.errorQueue.slice(-50);
    const criticalErrors = recentErrors.filter(e => e.severity === 'CRITICAL');
    const crisisErrors = recentErrors.filter(e => e.context.isCrisisMode);

    return {
      totalErrors: recentErrors.length,
      criticalErrors: criticalErrors.length,
      crisisErrors: crisisErrors.length,
      autoResolvedCount: recentErrors.filter(e => e.autoResolved).length,
      averageHealthScore: recentErrors.reduce((sum, e) => sum + e.healthScore, 0) / recentErrors.length || 100,
      errorPatterns: Object.fromEntries(this.errorPatterns),
      timestamp: Date.now()
    };
  }

  public async getRecentErrors(limit = 20): Promise<ErrorEvent[]> {
    return this.errorQueue.slice(-limit);
  }

  public async getCriticalErrors(): Promise<ErrorEvent[]> {
    return this.errorQueue.filter(error => 
      error.severity === 'CRITICAL' || 
      error.userImpact === 'BLOCKS_CRISIS_SUPPORT'
    );
  }

  public reportCustomError(message: string, context?: Partial<ErrorContext>) {
    this.handleError({
      message,
      filename: 'custom',
      lineno: 0,
      colno: 0,
      error: new Error(message)
    });
  }

  public getHealthStatus() {
    const recentErrors = this.errorQueue.slice(-20);
    const averageHealthScore = recentErrors.length > 0 
      ? recentErrors.reduce((sum, e) => sum + e.healthScore, 0) / recentErrors.length 
      : 100;

    return {
      status: averageHealthScore > 80 ? 'healthy' : averageHealthScore > 50 ? 'degraded' : 'critical',
      score: Math.round(averageHealthScore),
      criticalCount: recentErrors.filter(e => e.severity === 'CRITICAL').length,
      timestamp: Date.now()
    };
  }
}

// Initialize global error tracker
export const errorTracker = new ALCHMErrorTracker();

// Auto-initialize when window is available
if (typeof window !== 'undefined') {
  console.log('🛡️ ALCHM Error Tracker ready for crisis monitoring');
}

export default errorTracker;