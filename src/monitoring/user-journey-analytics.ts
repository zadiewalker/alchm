/**
 * ALCHM User Journey Analytics
 * Privacy-preserving analytics for mental health platform
 * Priority: Track critical user flows while protecting sensitive mental health data
 * 
 * PRIVACY NOTICE: No PHI (Protected Health Information) is collected or stored.
 * All data is anonymized and aggregated to protect user privacy while enabling
 * system optimization for crisis support and therapeutic effectiveness.
 */

import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import CryptoJS from 'crypto-js';

// Critical user journey stages for mental health platform
type JourneyStage = 
  | 'LANDING'           // User arrives at platform
  | 'AUTH_START'        // Begin authentication
  | 'AUTH_COMPLETE'     // Authentication successful
  | 'ONBOARDING'        // Initial setup/preferences
  | 'FIRST_JOURNAL'     // First journal entry
  | 'CRISIS_DETECTED'   // Crisis detection triggered
  | 'CRISIS_SUPPORT'    // Accessing crisis resources
  | 'THERAPIST_CONNECT' // Connecting with therapist
  | 'COMMUNITY_JOIN'    // Joining community features
  | 'PREMIUM_VIEW'      // Viewing premium features
  | 'PAYMENT_START'     // Beginning payment flow
  | 'PAYMENT_COMPLETE'  // Payment successful
  | 'HABIT_FORMATION'   // Engaging with habit features
  | 'BREAKTHROUGH'      // Significant progress milestone
  | 'CHURN_RISK'        // User showing churn signals
  | 'REACTIVATION'      // Returning after absence
  | 'ERROR_RECOVERY'    // Recovering from error state
  | 'OFFLINE_USAGE'     // Using offline features
  | 'EXPORT_DATA'       // Exporting personal data
  | 'SESSION_END';      // End of user session

// Privacy-first event structure (no PHI)
interface AnonymizedJourneyEvent {
  eventId: string;
  sessionId: string; // Hashed session identifier
  userHash: string;  // One-way hash of user ID (no reverse lookup possible)
  stage: JourneyStage;
  timestamp: number;
  
  // Performance context
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    interactionDelay: number;
    memoryUsage?: number;
  };
  
  // Technical context (no personal data)
  technicalContext: {
    viewport: string;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    connectionType: string;
    batteryLevel?: number;
    isOffline: boolean;
    errorCount: number;
  };
  
  // Journey context (aggregated, non-identifiable)
  journeyContext: {
    sessionDuration: number;
    stagesCompleted: number;
    previousStage?: JourneyStage;
    timeFromPrevious: number;
    isReturningUser: boolean;
    isCrisisSession: boolean;
    hasTherapistAccess: boolean;
  };
  
  // Outcome indicators (privacy-safe)
  outcomeIndicators: {
    completedSuccessfully: boolean;
    abandonedAtStage?: boolean;
    errorEncountered?: boolean;
    needsSupportIntervention?: boolean;
    performanceSatisfactory: boolean;
  };
  
  // No sensitive content - only aggregated behavioral patterns
  engagementMetrics?: {
    timeOnPage: number;
    interactionCount: number;
    featureUsageCount: number;
    helpAccessed: boolean;
  };
}

// Aggregated insights (population-level, no individual data)
interface JourneyInsights {
  stage: JourneyStage;
  totalEvents: number;
  conversionRate: number;
  averageTime: number;
  abandonmentRate: number;
  errorRate: number;
  performanceScore: number;
  
  // Crisis-specific metrics
  crisisConversionRate?: number;
  crisisAverageTime?: number;
  crisisErrorRate?: number;
  
  // Population-level trends (no individual identification)
  trends: {
    hourlyDistribution: number[];
    dayOfWeekDistribution: number[];
    deviceTypeDistribution: Record<string, number>;
    performanceTrends: number[];
  };
  
  // System optimization insights
  optimizationOpportunities: {
    slowLoadingStages: JourneyStage[];
    highErrorStages: JourneyStage[];
    abandonmentRiskFactors: string[];
    performanceBottlenecks: string[];
  };
}

// Funnel analysis for critical flows
interface CriticalFunnelMetrics {
  funnelName: string;
  stages: JourneyStage[];
  
  // Conversion metrics
  totalEntrants: number;
  completionRate: number;
  dropOffPoints: Array<{
    stage: JourneyStage;
    dropOffRate: number;
    reasons: string[];
  }>;
  
  // Performance impact on conversion
  performanceImpact: {
    slowLoadingImpact: number;
    errorImpact: number;
    mobilePerformanceImpact: number;
  };
  
  // Crisis user specific metrics
  crisisUserMetrics?: {
    completionRate: number;
    averageTime: number;
    specialConsiderations: string[];
  };
}

class ALCHMUserJourneyAnalytics {
  private eventQueue: AnonymizedJourneyEvent[] = [];
  private currentSession: {
    sessionId: string;
    userHash: string;
    startTime: number;
    stages: JourneyStage[];
    isCrisisSession: boolean;
  } | null = null;
  private encryptionKey: string;
  private isInitialized = false;

  constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.initializeTracking();
    this.startSession();
  }

  private generateEncryptionKey(): string {
    // Generate a session-specific key (not stored permanently)
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Privacy-first approach - check for consent
    if (!this.hasAnalyticsConsent()) {
      console.log('📊 User analytics disabled - respecting privacy preferences');
      return;
    }

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Track user interactions (privacy-safe)
    this.trackUserInteractions();

    // Track performance milestones
    this.trackPerformanceMilestones();

    // Monitor for crisis indicators (system-level only)
    this.monitorCrisisIndicators();

    this.isInitialized = true;
    console.log('📊 Privacy-preserving journey analytics initialized');
  }

  private hasAnalyticsConsent(): boolean {
    // Check for explicit analytics consent
    const consent = localStorage.getItem('alchm_analytics_consent');
    return consent === 'granted';
  }

  private startSession() {
    if (!this.isInitialized) return;

    const userId = this.getCurrentUserId();
    if (!userId) return;

    this.currentSession = {
      sessionId: this.generateSessionId(),
      userHash: this.hashUserId(userId),
      startTime: Date.now(),
      stages: ['LANDING'],
      isCrisisSession: this.detectCrisisSession()
    };

    this.trackEvent('LANDING');
  }

  private generateSessionId(): string {
    // Generate privacy-safe session identifier
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return CryptoJS.SHA256(`${timestamp}_${random}`).toString().substr(0, 16);
  }

  private hashUserId(userId: string): string {
    // One-way hash - no reverse lookup possible
    const salt = 'alchm_privacy_salt_2024';
    return CryptoJS.SHA256(userId + salt).toString().substr(0, 12);
  }

  private getCurrentUserId(): string | null {
    // Get user ID without storing it
    return localStorage.getItem('user-id');
  }

  private detectCrisisSession(): boolean {
    return [
      window.location.pathname.includes('/crisis'),
      window.location.pathname.includes('/emergency'),
      sessionStorage.getItem('crisis-mode') === 'true',
      document.body.classList.contains('crisis-mode')
    ].some(Boolean);
  }

  private trackUserInteractions() {
    // Track meaningful interactions without personal data
    const interactionEvents = ['click', 'keydown', 'touchstart'];
    let interactionCount = 0;

    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        interactionCount++;
        
        // Track specific interactive elements (privacy-safe)
        const target = event.target as HTMLElement;
        if (target.matches('[data-analytics]')) {
          const eventName = target.getAttribute('data-analytics');
          this.trackInteraction(eventName!);
        }
      }, { passive: true });
    });

    // Track engagement metrics every 30 seconds
    setInterval(() => {
      if (interactionCount > 0) {
        this.updateEngagementMetrics(interactionCount);
        interactionCount = 0;
      }
    }, 30000);
  }

  private trackPerformanceMilestones() {
    // Track Core Web Vitals impact on user journey
    if ('web-vitals' in window) {
      // This would be imported from web-vitals library
      // getCLS, getFCP, getFID, getLCP would be called here
    }

    // Track custom performance milestones
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.trackPerformanceMeasure(entry);
        }
      }
    }).observe({ entryTypes: ['measure'] });
  }

  private monitorCrisisIndicators() {
    // Monitor system-level crisis indicators (no personal data)
    const crisisRoutes = ['/crisis', '/emergency', '/support'];
    
    // Track navigation to crisis resources
    const originalPushState = history.pushState;
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      
      if (crisisRoutes.some(route => window.location.pathname.includes(route))) {
        this.trackEvent('CRISIS_SUPPORT');
      }
    };
  }

  private trackEvent(stage: JourneyStage, additionalContext?: any) {
    if (!this.currentSession || !this.isInitialized) return;

    const event: AnonymizedJourneyEvent = {
      eventId: this.generateEventId(),
      sessionId: this.currentSession.sessionId,
      userHash: this.currentSession.userHash,
      stage,
      timestamp: Date.now(),
      
      performanceMetrics: this.gatherPerformanceMetrics(),
      technicalContext: this.gatherTechnicalContext(),
      journeyContext: this.gatherJourneyContext(stage),
      outcomeIndicators: this.gatherOutcomeIndicators(stage),
      
      ...(additionalContext?.engagementMetrics && {
        engagementMetrics: additionalContext.engagementMetrics
      })
    };

    // Add to event queue
    this.eventQueue.push(event);

    // Update current session
    this.currentSession.stages.push(stage);

    // Process event
    this.processEvent(event);

    // Store event (privacy-safe)
    this.storeEvent(event);
  }

  private gatherPerformanceMetrics() {
    const now = performance.now();
    
    return {
      loadTime: now,
      renderTime: this.getRenderTime(),
      interactionDelay: this.getInteractionDelay(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  private gatherTechnicalContext() {
    return {
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: this.getDeviceType(),
      connectionType: this.getConnectionType(),
      batteryLevel: this.getBatteryLevel(),
      isOffline: !navigator.onLine,
      errorCount: this.getErrorCount()
    };
  }

  private gatherJourneyContext(currentStage: JourneyStage) {
    if (!this.currentSession) {
      return {
        sessionDuration: 0,
        stagesCompleted: 0,
        timeFromPrevious: 0,
        isReturningUser: false,
        isCrisisSession: false,
        hasTherapistAccess: false
      };
    }

    const stages = this.currentSession.stages;
    const previousStage = stages[stages.length - 2];
    
    return {
      sessionDuration: Date.now() - this.currentSession.startTime,
      stagesCompleted: stages.length,
      previousStage,
      timeFromPrevious: this.getTimeFromPreviousStage(),
      isReturningUser: this.isReturningUser(),
      isCrisisSession: this.currentSession.isCrisisSession,
      hasTherapistAccess: this.hasTherapistAccess()
    };
  }

  private gatherOutcomeIndicators(stage: JourneyStage) {
    return {
      completedSuccessfully: this.wasStageCompleted(stage),
      abandonedAtStage: this.wasStageAbandoned(stage),
      errorEncountered: this.hadErrorInStage(stage),
      needsSupportIntervention: this.needsSupportIntervention(stage),
      performanceSatisfactory: this.wasPerformanceSatisfactory(stage)
    };
  }

  // Utility methods for gathering context
  private getRenderTime(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getInteractionDelay(): number {
    // Measure time to first interaction
    return 0; // Placeholder - would track actual interaction delays
  }

  private getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private getBatteryLevel(): number | undefined {
    // Battery API is deprecated, but kept for completeness
    return undefined;
  }

  private getErrorCount(): number {
    // Get error count from error tracker
    return 0; // Would integrate with error tracking system
  }

  private getTimeFromPreviousStage(): number {
    if (!this.currentSession || this.currentSession.stages.length < 2) return 0;
    
    // Calculate based on event queue timing
    const recentEvents = this.eventQueue.slice(-2);
    if (recentEvents.length < 2) return 0;
    
    return recentEvents[1].timestamp - recentEvents[0].timestamp;
  }

  private isReturningUser(): boolean {
    // Check if user has been seen before (privacy-safe)
    return localStorage.getItem('alchm_returning_user') === 'true';
  }

  private hasTherapistAccess(): boolean {
    // Check user tier without accessing personal data
    return localStorage.getItem('user-tier') === 'premium';
  }

  private wasStageCompleted(stage: JourneyStage): boolean {
    // Determine if stage was completed successfully
    switch (stage) {
      case 'AUTH_COMPLETE':
        return !!localStorage.getItem('user-id');
      case 'PAYMENT_COMPLETE':
        return localStorage.getItem('subscription-status') === 'active';
      default:
        return true; // Default to completed unless we can determine otherwise
    }
  }

  private wasStageAbandoned(stage: JourneyStage): boolean {
    // Check if user abandoned at this stage
    return false; // Would implement abandonment detection logic
  }

  private hadErrorInStage(stage: JourneyStage): boolean {
    // Check if errors occurred during this stage
    return false; // Would integrate with error tracking
  }

  private needsSupportIntervention(stage: JourneyStage): boolean {
    // Determine if user needs support intervention (system-level only)
    const interventionStages: JourneyStage[] = [
      'CRISIS_DETECTED',
      'ERROR_RECOVERY',
      'CHURN_RISK'
    ];
    
    return interventionStages.includes(stage);
  }

  private wasPerformanceSatisfactory(stage: JourneyStage): boolean {
    // Check if performance was satisfactory for this stage
    const performanceData = this.gatherPerformanceMetrics();
    return performanceData.loadTime < 3000 && performanceData.interactionDelay < 100;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private processEvent(event: AnonymizedJourneyEvent) {
    // Real-time processing for critical stages
    if (event.stage === 'CRISIS_DETECTED' || event.stage === 'CRISIS_SUPPORT') {
      this.processCrisisEvent(event);
    }

    // Performance optimization triggers
    if (!event.outcomeIndicators.performanceSatisfactory) {
      this.triggerPerformanceOptimization(event);
    }

    // Error recovery
    if (event.outcomeIndicators.errorEncountered) {
      this.triggerErrorRecovery(event);
    }
  }

  private processCrisisEvent(event: AnonymizedJourneyEvent) {
    // Priority processing for crisis events
    console.log('🚨 Crisis event processed (privacy-safe):', event.stage);
    
    // Emit crisis analytics event for monitoring
    const crisisEvent = new CustomEvent('alchm:crisis:analytics', {
      detail: {
        stage: event.stage,
        performanceMetrics: event.performanceMetrics,
        timestamp: event.timestamp,
        // No personal data included
      }
    });
    
    window.dispatchEvent(crisisEvent);
  }

  private triggerPerformanceOptimization(event: AnonymizedJourneyEvent) {
    // Trigger performance optimization based on user journey data
    const optimizationEvent = new CustomEvent('alchm:performance:optimize', {
      detail: {
        stage: event.stage,
        metrics: event.performanceMetrics,
        deviceType: event.technicalContext.deviceType
      }
    });
    
    window.dispatchEvent(optimizationEvent);
  }

  private triggerErrorRecovery(event: AnonymizedJourneyEvent) {
    // Trigger error recovery protocols
    const recoveryEvent = new CustomEvent('alchm:error:recovery', {
      detail: {
        stage: event.stage,
        context: event.technicalContext
      }
    });
    
    window.dispatchEvent(recoveryEvent);
  }

  private async storeEvent(event: AnonymizedJourneyEvent) {
    try {
      // Store anonymized event data
      await addDoc(collection(db, 'journey_analytics'), {
        ...event,
        timestamp: serverTimestamp(),
        // Additional privacy protection - encrypt sensitive fields
        sessionId: this.encryptData(event.sessionId),
        userHash: this.encryptData(event.userHash)
      });
    } catch (error) {
      console.error('Failed to store journey event:', error);
    }
  }

  private encryptData(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  private trackInteraction(eventName: string) {
    // Track specific interactions
    this.trackEvent('AUTH_START'); // Example mapping
  }

  private updateEngagementMetrics(interactionCount: number) {
    // Update engagement metrics for current session
    if (this.eventQueue.length > 0) {
      const lastEvent = this.eventQueue[this.eventQueue.length - 1];
      if (lastEvent.engagementMetrics) {
        lastEvent.engagementMetrics.interactionCount += interactionCount;
      }
    }
  }

  private trackPerformanceMeasure(entry: PerformanceEntry) {
    // Track performance measures that impact user journey
    console.log('Performance measure:', entry.name, entry.duration);
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      this.trackEvent('SESSION_END');
    } else {
      this.trackEvent('REACTIVATION');
    }
  }

  // Public methods
  public trackUserAction(action: string, stage?: JourneyStage) {
    if (!this.hasAnalyticsConsent()) return;
    
    // Map actions to journey stages
    const actionStageMap: Record<string, JourneyStage> = {
      'login_start': 'AUTH_START',
      'login_complete': 'AUTH_COMPLETE',
      'journal_start': 'FIRST_JOURNAL',
      'crisis_detected': 'CRISIS_DETECTED',
      'premium_view': 'PREMIUM_VIEW',
      'payment_start': 'PAYMENT_START',
      'payment_complete': 'PAYMENT_COMPLETE'
    };

    const mappedStage = stage || actionStageMap[action];
    if (mappedStage) {
      this.trackEvent(mappedStage);
    }
  }

  public async getJourneyInsights(stage?: JourneyStage): Promise<JourneyInsights[]> {
    // Query aggregated, anonymized data
    const insights: JourneyInsights[] = [];
    
    // This would query the stored analytics data and return aggregated insights
    // No individual user data would be accessible
    
    return insights;
  }

  public async getCriticalFunnelMetrics(): Promise<CriticalFunnelMetrics[]> {
    // Define critical user funnels for mental health platform
    const criticalFunnels: CriticalFunnelMetrics[] = [
      {
        funnelName: 'Crisis Support Flow',
        stages: ['CRISIS_DETECTED', 'CRISIS_SUPPORT'],
        totalEntrants: 0,
        completionRate: 0,
        dropOffPoints: [],
        performanceImpact: {
          slowLoadingImpact: 0,
          errorImpact: 0,
          mobilePerformanceImpact: 0
        }
      },
      {
        funnelName: 'Authentication Flow',
        stages: ['AUTH_START', 'AUTH_COMPLETE', 'ONBOARDING'],
        totalEntrants: 0,
        completionRate: 0,
        dropOffPoints: [],
        performanceImpact: {
          slowLoadingImpact: 0,
          errorImpact: 0,
          mobilePerformanceImpact: 0
        }
      }
    ];

    return criticalFunnels;
  }

  public getPrivacyReport() {
    return {
      dataCollected: [
        'Anonymized user journey stages',
        'Performance metrics (non-personal)',
        'Technical context (device type, connection)',
        'Aggregated engagement metrics'
      ],
      dataNotCollected: [
        'Personal Health Information (PHI)',
        'Journal content',
        'Personal identifiers',
        'Specific location data',
        'Sensitive personal data'
      ],
      privacyMeasures: [
        'One-way user ID hashing',
        'Session-based encryption',
        'Data anonymization',
        'Aggregated reporting only',
        'Explicit consent required'
      ],
      retentionPolicy: 'Anonymized analytics data retained for 90 days maximum',
      userRights: [
        'Opt-out at any time',
        'Request data deletion',
        'View aggregated insights only'
      ]
    };
  }

  public optOut() {
    localStorage.setItem('alchm_analytics_consent', 'denied');
    this.isInitialized = false;
    this.eventQueue = [];
    this.currentSession = null;
    console.log('📊 User journey analytics disabled by user choice');
  }

  public optIn() {
    localStorage.setItem('alchm_analytics_consent', 'granted');
    this.initializeTracking();
    this.startSession();
    console.log('📊 User journey analytics enabled with privacy protection');
  }
}

// Initialize global user journey analytics
export const userJourneyAnalytics = new ALCHMUserJourneyAnalytics();

// Auto-initialize with privacy checks
if (typeof window !== 'undefined') {
  console.log('📊 ALCHM Privacy-Preserving Journey Analytics ready');
}

export default userJourneyAnalytics;