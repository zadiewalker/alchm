/**
 * ALCHM Trauma-Informed Analytics System
 * 
 * Privacy-first analytics that respect user autonomy and emotional state.
 * Designed specifically for mental health applications with crisis awareness.
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  anonymized: boolean;
  traumaSafe: boolean;
  crisisContext?: boolean;
}

export interface UserJourneyEvent {
  step: string;
  outcome: 'success' | 'abandonment' | 'error';
  emotionalState?: 'calm' | 'neutral' | 'distressed' | 'crisis';
  duration?: number;
  metadata?: Record<string, any>;
}

export interface WellnessMetric {
  type: 'journal_entry' | 'mood_check' | 'pathway_completion' | 'crisis_access';
  value: number | string;
  date: Date;
  category: 'engagement' | 'wellness' | 'safety' | 'growth';
  privacyLevel: 'public' | 'aggregated' | 'private' | 'sensitive';
}

class TraumaInformedAnalytics {
  private sessionId: string;
  private userId?: string;
  private crisisMode: boolean = false;
  private analyticsEnabled: boolean = true;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private maxQueueSize: number = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
    this.setupFlushTimer();
    this.detectCrisisMode();
  }

  /**
   * Track user journey events with trauma-informed context
   */
  trackUserJourney(event: UserJourneyEvent): void {
    // Skip tracking if user is in crisis mode
    if (this.crisisMode && event.step !== 'crisis_support_accessed') {
      return;
    }

    // Anonymize sensitive journey steps
    const safeName = this.sanitizeEventName(event.step);
    
    this.track(safeName, {
      outcome: event.outcome,
      emotional_state: event.emotionalState,
      duration_ms: event.duration,
      step_category: this.categorizeJourneyStep(event.step),
      ...this.sanitizeProperties(event.metadata || {})
    }, {
      traumaSafe: true,
      anonymized: this.shouldAnonymize(event.step),
      crisisContext: event.emotionalState === 'crisis'
    });
  }

  /**
   * Track wellness metrics with privacy protection
   */
  trackWellnessMetric(metric: WellnessMetric): void {
    // Skip sensitive metrics during crisis
    if (this.crisisMode && metric.privacyLevel === 'sensitive') {
      return;
    }

    // Aggregate sensitive data before tracking
    const aggregatedValue = this.aggregateIfSensitive(metric);
    
    this.track('wellness_metric_recorded', {
      metric_type: metric.type,
      category: metric.category,
      privacy_level: metric.privacyLevel,
      value: aggregatedValue,
      date: metric.date.toISOString()
    }, {
      traumaSafe: metric.category === 'safety',
      anonymized: metric.privacyLevel !== 'public',
      crisisContext: metric.type === 'crisis_access'
    });
  }

  /**
   * Track feature usage with emotional context awareness
   */
  trackFeatureUsage(
    feature: string, 
    action: string, 
    context?: {
      emotionalState?: string;
      duration?: number;
      success?: boolean;
      metadata?: Record<string, any>;
    }
  ): void {
    // Crisis features get special handling
    if (feature === 'crisis_support' || action === 'emergency_contact') {
      this.trackCrisisInteraction(feature, action, context);
      return;
    }

    // Skip non-essential tracking during crisis
    if (this.crisisMode && !this.isSafetyFeature(feature)) {
      return;
    }

    this.track('feature_used', {
      feature_name: feature,
      action_type: action,
      emotional_context: context?.emotionalState,
      duration_ms: context?.duration,
      success: context?.success,
      ...this.sanitizeProperties(context?.metadata || {})
    }, {
      traumaSafe: this.isSafetyFeature(feature),
      anonymized: this.shouldAnonymizeFeature(feature),
      crisisContext: context?.emotionalState === 'crisis'
    });
  }

  /**
   * Track crisis interactions with maximum privacy
   */
  trackCrisisInteraction(
    feature: string, 
    action: string, 
    context?: any
  ): void {
    // Crisis tracking is minimal and anonymized
    this.track('crisis_support_interaction', {
      support_type: feature,
      interaction_type: action,
      timestamp: new Date().toISOString(),
      // No personal context stored for crisis events
    }, {
      traumaSafe: true,
      anonymized: true,
      crisisContext: true
    });

    // Activate crisis mode temporarily
    this.activateCrisisMode();
  }

  /**
   * Track error events with recovery context
   */
  trackError(
    error: string,
    context: {
      component?: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      recovered?: boolean;
      recoveryAction?: string;
      userState?: string;
    }
  ): void {
    // Always track errors for system health, but anonymize user data
    this.track('error_occurred', {
      error_category: this.categorizeError(error),
      error_severity: context.severity,
      component_type: context.component,
      recovery_successful: context.recovered,
      recovery_method: context.recoveryAction,
      user_emotional_state: context.userState,
      // Never include actual error messages or stack traces
    }, {
      traumaSafe: false,
      anonymized: true,
      crisisContext: context.severity === 'critical'
    });
  }

  /**
   * Track performance metrics for optimization
   */
  trackPerformance(
    metric: string,
    value: number,
    context?: {
      page?: string;
      feature?: string;
      userState?: string;
      deviceInfo?: any;
    }
  ): void {
    // Performance tracking helps crisis responsiveness
    this.track('performance_metric', {
      metric_name: metric,
      metric_value: value,
      page_context: context?.page,
      feature_context: context?.feature,
      user_emotional_state: context?.userState,
      device_category: context?.deviceInfo ? this.categorizeDevice(context.deviceInfo) : undefined
    }, {
      traumaSafe: true,
      anonymized: false, // Performance data is not personally identifiable
      crisisContext: false
    });
  }

  /**
   * Core tracking method with privacy controls
   */
  private track(
    eventName: string, 
    properties: Record<string, any> = {},
    options: {
      traumaSafe?: boolean;
      anonymized?: boolean;
      crisisContext?: boolean;
    } = {}
  ): void {
    // Respect user analytics preferences
    if (!this.analyticsEnabled) {
      return;
    }

    // Crisis context suspends non-essential analytics
    if (this.crisisMode && !options.traumaSafe) {
      return;
    }

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        session_id: this.sessionId,
        user_id: options.anonymized ? this.hashUserId() : this.userId,
        timestamp: new Date().toISOString(),
        privacy_level: options.anonymized ? 'anonymized' : 'standard',
        crisis_context: options.crisisContext || false,
        analytics_version: '1.0.0'
      },
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: options.anonymized ? undefined : this.userId,
      anonymized: options.anonymized || false,
      traumaSafe: options.traumaSafe || false,
      crisisContext: options.crisisContext || false
    };

    // Add to queue for batched sending
    this.queue.push(event);

    // Immediate flush for crisis events
    if (options.crisisContext) {
      this.flush();
    } else if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  /**
   * User preference management
   */
  setAnalyticsEnabled(enabled: boolean): void {
    this.analyticsEnabled = enabled;
    
    if (!enabled) {
      // Clear queued events when disabled
      this.queue = [];
      localStorage.setItem('alchm_analytics_disabled', 'true');
    } else {
      localStorage.removeItem('alchm_analytics_disabled');
    }

    this.track('analytics_preference_changed', {
      analytics_enabled: enabled
    }, { traumaSafe: true, anonymized: false });
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Crisis mode management
   */
  private activateCrisisMode(): void {
    this.crisisMode = true;
    
    // Crisis mode auto-deactivates after 30 minutes
    setTimeout(() => {
      this.crisisMode = false;
    }, 30 * 60 * 1000);

    // Store crisis state for session persistence
    sessionStorage.setItem('alchm_crisis_mode', 'true');
  }

  private detectCrisisMode(): void {
    const crisisModeStored = sessionStorage.getItem('alchm_crisis_mode') === 'true';
    const emergencyMode = localStorage.getItem('alchm-emergency-mode');
    
    if (crisisModeStored || emergencyMode) {
      this.crisisMode = true;
    }
  }

  /**
   * Data sanitization and anonymization
   */
  private sanitizeEventName(eventName: string): string {
    // Remove potentially sensitive information from event names
    return eventName
      .replace(/user[_-]?\d+/gi, 'user_xxx')
      .replace(/email[_-]?[\w@.]+/gi, 'email_xxx')
      .replace(/id[_-]?\w+/gi, 'id_xxx');
  }

  private sanitizeProperties(properties: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    Object.entries(properties).forEach(([key, value]) => {
      // Skip sensitive fields
      if (this.isSensitiveField(key)) {
        return;
      }

      // Hash or truncate potentially identifying values
      if (typeof value === 'string' && this.containsPII(value)) {
        sanitized[key] = this.hashSensitiveValue(value);
      } else {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }

  private isSensitiveField(fieldName: string): boolean {
    const sensitiveFields = [
      'email', 'password', 'ssn', 'phone', 'address', 'name',
      'journal_content', 'personal_note', 'crisis_detail'
    ];
    
    return sensitiveFields.some(sensitive => 
      fieldName.toLowerCase().includes(sensitive)
    );
  }

  private containsPII(value: string): boolean {
    // Simple PII detection patterns
    const piiPatterns = [
      /@\w+\.\w+/, // Email pattern
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone pattern
    ];

    return piiPatterns.some(pattern => pattern.test(value));
  }

  private hashSensitiveValue(value: string): string {
    // Simple hash for demonstration - use proper crypto in production
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      const char = value.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash).toString(36)}`;
  }

  private hashUserId(): string | undefined {
    return this.userId ? this.hashSensitiveValue(this.userId) : undefined;
  }

  /**
   * Event categorization for analysis
   */
  private categorizeJourneyStep(step: string): string {
    if (step.includes('auth') || step.includes('login')) return 'authentication';
    if (step.includes('journal') || step.includes('write')) return 'journaling';
    if (step.includes('crisis') || step.includes('emergency')) return 'crisis_support';
    if (step.includes('pathway') || step.includes('lesson')) return 'learning';
    if (step.includes('dashboard') || step.includes('home')) return 'navigation';
    return 'other';
  }

  private categorizeError(error: string): string {
    if (error.includes('network') || error.includes('fetch')) return 'network';
    if (error.includes('auth') || error.includes('token')) return 'authentication';
    if (error.includes('database') || error.includes('data')) return 'data';
    if (error.includes('render') || error.includes('component')) return 'ui';
    return 'system';
  }

  private categorizeDevice(deviceInfo: any): string {
    if (deviceInfo.mobile) return 'mobile';
    if (deviceInfo.tablet) return 'tablet';
    return 'desktop';
  }

  /**
   * Privacy utility methods
   */
  private shouldAnonymize(eventType: string): boolean {
    const anonymizeEvents = [
      'journal_entry', 'mood_selection', 'crisis_contact',
      'personal_reflection', 'therapy_note', 'emergency_access'
    ];
    
    return anonymizeEvents.some(anon => eventType.includes(anon));
  }

  private shouldAnonymizeFeature(feature: string): boolean {
    const sensitiveFeatures = [
      'journal', 'diary', 'personal', 'private', 'crisis', 'emergency'
    ];
    
    return sensitiveFeatures.some(sensitive => feature.includes(sensitive));
  }

  private isSafetyFeature(feature: string): boolean {
    const safetyFeatures = [
      'crisis', 'emergency', 'hotline', 'support', 'help', 'safety'
    ];
    
    return safetyFeatures.some(safety => feature.includes(safety));
  }

  private aggregateIfSensitive(metric: WellnessMetric): string | number {
    if (metric.privacyLevel === 'sensitive' || metric.privacyLevel === 'private') {
      // Aggregate sensitive metrics into ranges
      if (typeof metric.value === 'number') {
        if (metric.value < 3) return 'low';
        if (metric.value < 7) return 'medium';
        return 'high';
      }
    }
    
    return metric.value;
  }

  /**
   * Data transmission and storage
   */
  private flush(): void {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Send to analytics endpoint
    this.sendEvents(events).catch(error => {
      console.warn('Analytics transmission failed:', error);
      
      // Re-queue failed events (up to limit)
      if (this.queue.length < this.maxQueueSize / 2) {
        this.queue.unshift(...events.slice(0, this.maxQueueSize - this.queue.length));
      }
    });
  }

  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'production') {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } else {
      console.log('Analytics Events:', events);
    }
  }

  /**
   * Initialization and cleanup
   */
  private initializeAnalytics(): void {
    // Check user preferences
    const analyticsDisabled = localStorage.getItem('alchm_analytics_disabled') === 'true';
    this.analyticsEnabled = !analyticsDisabled;

    // Listen for user preference changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'alchm_analytics_disabled') {
        this.analyticsEnabled = event.newValue !== 'true';
      }
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flush();
      }
    });

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  private setupFlushTimer(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Public utility methods for components
   */
  getSessionId(): string {
    return this.sessionId;
  }

  isCrisisMode(): boolean {
    return this.crisisMode;
  }

  isAnalyticsEnabled(): boolean {
    return this.analyticsEnabled;
  }
}

// Singleton instance
export const analytics = new TraumaInformedAnalytics();

// React hooks for easy component integration
export function useAnalytics() {
  return {
    trackUserJourney: (event: UserJourneyEvent) => analytics.trackUserJourney(event),
    trackFeatureUsage: (feature: string, action: string, context?: any) => 
      analytics.trackFeatureUsage(feature, action, context),
    trackWellnessMetric: (metric: WellnessMetric) => analytics.trackWellnessMetric(metric),
    trackError: (error: string, context: any) => analytics.trackError(error, context),
    trackPerformance: (metric: string, value: number, context?: any) => 
      analytics.trackPerformance(metric, value, context),
    setAnalyticsEnabled: (enabled: boolean) => analytics.setAnalyticsEnabled(enabled),
    setUserId: (userId: string) => analytics.setUserId(userId),
    isAnalyticsEnabled: () => analytics.isAnalyticsEnabled(),
    isCrisisMode: () => analytics.isCrisisMode()
  };
}

export { TraumaInformedAnalytics };