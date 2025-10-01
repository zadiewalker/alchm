/**
 * Client-side error tracking system for ALCHM
 * Captures and reports JavaScript errors, performance issues, and user interactions
 */

interface ErrorTrackingConfig {
  apiEndpoint: string;
  enableAutoTracking: boolean;
  enablePerformanceTracking: boolean;
  enableUserInteractionTracking: boolean;
  crisisDetection: boolean;
  batchSize: number;
  flushInterval: number;
}

interface TrackedError {
  message: string;
  stack?: string;
  name: string;
  type: 'javascript' | 'network' | 'performance' | 'user-interaction' | 'console';
  source?: string;
  lineno?: number;
  colno?: number;
  filename?: string;
  timestamp: number;
  
  // Context
  url: string;
  userAgent: string;
  sessionId: string;
  userId?: string;
  
  // Crisis context
  isInCrisis: boolean;
  crisisRiskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  
  // Performance context
  performanceMetrics?: {
    navigationTiming?: PerformanceNavigationTiming;
    memoryUsage?: any;
    connectionType?: string;
  };
  
  // User interaction context
  interactionContext?: {
    lastClickedElement?: string;
    formData?: any;
    scrollPosition?: { x: number; y: number };
    viewport?: { width: number; height: number };
    focusedElement?: string;
  };
}

class ErrorTrackingClient {
  private static instance: ErrorTrackingClient | null = null;
  private config: ErrorTrackingConfig;
  private errorQueue: TrackedError[] = [];
  private sessionId: string;
  private isInCrisis = false;
  private crisisRiskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical' = 'none';
  private lastInteractionContext: any = {};
  private isInitialized = false;

  constructor(config?: Partial<ErrorTrackingConfig>) {
    this.config = {
      apiEndpoint: '/api/monitoring/errors',
      enableAutoTracking: true,
      enablePerformanceTracking: true,
      enableUserInteractionTracking: true,
      crisisDetection: true,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      ...config
    };
    
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getInstance(config?: Partial<ErrorTrackingConfig>): ErrorTrackingClient {
    if (!this.instance) {
      this.instance = new ErrorTrackingClient(config);
    }
    return this.instance;
  }

  public initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    console.log('🔍 Initializing ALCHM Error Tracking System...');

    // Set up automatic error tracking
    if (this.config.enableAutoTracking) {
      this.setupGlobalErrorHandlers();
      this.setupUnhandledRejectionHandler();
      this.setupConsoleErrorTracking();
    }

    // Set up performance tracking
    if (this.config.enablePerformanceTracking) {
      this.setupPerformanceTracking();
    }

    // Set up user interaction tracking
    if (this.config.enableUserInteractionTracking) {
      this.setupUserInteractionTracking();
    }

    // Set up crisis detection
    if (this.config.crisisDetection) {
      this.setupCrisisDetection();
    }

    // Start periodic flushing
    this.startPeriodicFlush();

    // Flush on page unload
    this.setupPageUnloadHandler();

    this.isInitialized = true;
    console.log('✅ Error tracking system initialized');
  }

  private setupGlobalErrorHandlers(): void {
    // Global JavaScript error handler
    window.addEventListener('error', (event: ErrorEvent) => {
      const error: TrackedError = {
        message: event.message || 'Unknown error',
        stack: event.error?.stack || null,
        name: event.error?.name || 'Error',
        type: 'javascript',
        source: event.filename || 'unknown',
        lineno: event.lineno || null,
        colno: event.colno || null,
        filename: event.filename || null,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        isInCrisis: this.isInCrisis,
        crisisRiskLevel: this.crisisRiskLevel,
        interactionContext: { ...this.lastInteractionContext }
      };

      this.trackError(error);
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        const error: TrackedError = {
          message: `Failed to load resource: ${target.tagName}`,
          name: 'ResourceError',
          type: 'network',
          source: target.getAttribute('src') || target.getAttribute('href') || 'unknown',
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: this.sessionId,
          isInCrisis: this.isInCrisis,
          crisisRiskLevel: this.crisisRiskLevel
        };

        this.trackError(error);
      }
    }, true);
  }

  private setupUnhandledRejectionHandler(): void {
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
      const error: TrackedError = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack || null,
        name: event.reason?.name || 'UnhandledRejection',
        type: 'javascript',
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        isInCrisis: this.isInCrisis,
        crisisRiskLevel: this.crisisRiskLevel
      };

      this.trackError(error);
    });
  }

  private setupConsoleErrorTracking(): void {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);

      // Track the console error
      const error: TrackedError = {
        message: args.join(' '),
        name: 'ConsoleError',
        type: 'console',
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        isInCrisis: this.isInCrisis,
        crisisRiskLevel: this.crisisRiskLevel
      };

      this.trackError(error);
    };
  }

  private setupPerformanceTracking(): void {
    // Track performance errors
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'longtask' && entry.duration > 100) {
              const error: TrackedError = {
                message: `Long task detected: ${entry.duration}ms`,
                name: 'PerformanceError',
                type: 'performance',
                timestamp: Date.now(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                sessionId: this.sessionId,
                isInCrisis: this.isInCrisis,
                crisisRiskLevel: this.crisisRiskLevel,
                performanceMetrics: {
                  navigationTiming: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
                }
              };

              this.trackError(error);
            }
          });
        });

        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Performance tracking not supported');
      }
    }

    // Track memory issues
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;

        if (memoryUsagePercent > 90) {
          const error: TrackedError = {
            message: `High memory usage: ${memoryUsagePercent.toFixed(1)}%`,
            name: 'MemoryError',
            type: 'performance',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
            isInCrisis: this.isInCrisis,
            crisisRiskLevel: this.crisisRiskLevel,
            performanceMetrics: {
              memoryUsage: memory
            }
          };

          this.trackError(error);
        }
      }, 30000);
    }
  }

  private setupUserInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      this.lastInteractionContext.lastClickedElement = target.tagName + 
        (target.className ? '.' + target.className.split(' ')[0] : '') +
        (target.id ? '#' + target.id : '');
      this.lastInteractionContext.scrollPosition = {
        x: window.scrollX,
        y: window.scrollY
      };
      this.lastInteractionContext.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.lastInteractionContext.formData = {
        action: form.action,
        method: form.method,
        formId: form.id,
        fieldCount: form.elements.length
      };
    });

    // Track focus changes
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement;
      this.lastInteractionContext.focusedElement = target.tagName + 
        (target.id ? '#' + target.id : '');
    });
  }

  private setupCrisisDetection(): void {
    // Monitor for crisis keywords in text inputs
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        const text = target.value.toLowerCase();
        
        const crisisKeywords = [
          'suicide', 'kill myself', 'end my life', 'want to die',
          'self harm', 'hurt myself', 'can\'t go on', 'hopeless',
          'emergency', 'crisis', 'help me', 'desperate'
        ];

        const hasEmergencyKeyword = crisisKeywords.some(keyword => text.includes(keyword));
        
        if (hasEmergencyKeyword && !this.isInCrisis) {
          this.isInCrisis = true;
          this.crisisRiskLevel = 'high';
          
          // Dispatch crisis detection event
          window.dispatchEvent(new CustomEvent('alchm:crisis-detected', {
            detail: { riskLevel: this.crisisRiskLevel }
          }));

          // Track crisis detection as special event
          const error: TrackedError = {
            message: 'Crisis keywords detected in user input',
            name: 'CrisisDetection',
            type: 'user-interaction',
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.sessionId,
            isInCrisis: true,
            crisisRiskLevel: this.crisisRiskLevel
          };

          this.trackError(error);
        }
      }
    });

    // Listen for crisis events from other parts of the application
    window.addEventListener('alchm:crisis-detected', (event: any) => {
      this.isInCrisis = true;
      this.crisisRiskLevel = event.detail?.riskLevel || 'high';
    });

    window.addEventListener('alchm:crisis-resolved', () => {
      this.isInCrisis = false;
      this.crisisRiskLevel = 'none';
    });
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      if (this.errorQueue.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  private setupPageUnloadHandler(): void {
    window.addEventListener('beforeunload', () => {
      if (this.errorQueue.length > 0) {
        // Use sendBeacon for reliability during page unload
        this.flush(true);
      }
    });

    // Also flush on visibility change (tab switching, etc.)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && this.errorQueue.length > 0) {
        this.flush(true);
      }
    });
  }

  public trackError(error: Partial<TrackedError>): void {
    const completeError: TrackedError = {
      message: error.message || 'Unknown error',
      stack: error.stack || null,
      name: error.name || 'Error',
      type: error.type || 'javascript',
      timestamp: error.timestamp || Date.now(),
      url: error.url || window.location.href,
      userAgent: error.userAgent || navigator.userAgent,
      sessionId: this.sessionId,
      isInCrisis: error.isInCrisis !== undefined ? error.isInCrisis : this.isInCrisis,
      crisisRiskLevel: error.crisisRiskLevel || this.crisisRiskLevel,
      ...error
    };

    this.errorQueue.push(completeError);

    // Flush immediately for critical errors or crisis users
    if (completeError.isInCrisis || 
        completeError.message.toLowerCase().includes('critical') ||
        completeError.message.toLowerCase().includes('crisis')) {
      this.flush();
    } else if (this.errorQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  public trackCustomError(message: string, context?: any): void {
    const error: TrackedError = {
      message,
      name: 'CustomError',
      type: 'javascript',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      isInCrisis: this.isInCrisis,
      crisisRiskLevel: this.crisisRiskLevel,
      interactionContext: context || this.lastInteractionContext
    };

    this.trackError(error);
  }

  public setCrisisState(isInCrisis: boolean, riskLevel?: 'none' | 'low' | 'moderate' | 'high' | 'critical'): void {
    this.isInCrisis = isInCrisis;
    this.crisisRiskLevel = riskLevel || (isInCrisis ? 'high' : 'none');
  }

  private async flush(useBeacon = false): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    const payload = {
      errors,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      batchSize: errors.length
    };

    try {
      if (useBeacon && 'sendBeacon' in navigator) {
        // Use sendBeacon for reliability during page unload
        const success = navigator.sendBeacon(
          this.config.apiEndpoint,
          JSON.stringify(payload)
        );
        
        if (!success) {
          // Fallback to fetch if sendBeacon fails
          await this.sendWithFetch(payload);
        }
      } else {
        await this.sendWithFetch(payload);
      }
    } catch (error) {
      console.warn('Failed to send error reports:', error);
      // Put errors back in queue for retry
      this.errorQueue.unshift(...errors);
    }
  }

  private async sendWithFetch(payload: any): Promise<void> {
    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Public API methods
  public getSessionId(): string {
    return this.sessionId;
  }

  public isTrackingEnabled(): boolean {
    return this.isInitialized;
  }

  public getQueueLength(): number {
    return this.errorQueue.length;
  }

  public forceFlush(): Promise<void> {
    return this.flush();
  }
}

// Initialize and export global error tracking instance
export const errorTracker = ErrorTrackingClient.getInstance();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      errorTracker.initialize();
    });
  } else {
    errorTracker.initialize();
  }
}

export default ErrorTrackingClient;