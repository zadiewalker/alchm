import { getFirestore, doc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Sentry from '@sentry/nextjs';

interface AnalyticsEvent {
  userId?: string;
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  page: string;
  device: 'mobile' | 'desktop';
  userAgent: string;
}

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: Date;
  lastActivity: Date;
  pageViews: number;
  events: number;
  device: 'mobile' | 'desktop';
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

class AnalyticsService {
  private db = getFirestore();
  private sessionId: string;
  private userId?: string;
  private sessionStartTime: Date;
  private lastEventTime: Date;
  private eventQueue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.lastEventTime = new Date();
    
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    // Initialize session tracking
    this.startSession();
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Track page unload
    window.addEventListener('beforeunload', this.endSession.bind(this));
    
    // Start periodic flush
    this.flushInterval = setInterval(() => {
      this.flushEvents();
    }, 30000); // Flush every 30 seconds
    
    // Track initial page view
    this.trackPageView();
    
    // Set up auth state listener
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.updateSession({ userId: user.uid });
      }
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDevice(): 'mobile' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  }

  private getUTMParams(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
    };
  }

  private async startSession() {
    try {
      const session: UserSession = {
        sessionId: this.sessionId,
        userId: this.userId,
        startTime: this.sessionStartTime,
        lastActivity: new Date(),
        pageViews: 0,
        events: 0,
        device: this.getDevice(),
        referrer: document.referrer || undefined,
        ...this.getUTMParams(),
      };

      await setDoc(doc(this.db, 'userSessions', this.sessionId), session);
      
      // Track daily active users
      if (this.userId) {
        const today = new Date().toISOString().split('T')[0];
        await setDoc(
          doc(this.db, 'dailyActiveUsers', `${this.userId}_${today}`),
          {
            userId: this.userId,
            date: today,
            sessionCount: increment(1),
            lastSeen: serverTimestamp(),
            device: this.getDevice(),
          },
          { merge: true }
        );
      }

    } catch (error) {
      console.error('Failed to start analytics session:', error);
      Sentry.captureException(error, { tags: { component: 'analytics' } });
    }
  }

  private async updateSession(updates: Partial<UserSession>) {
    try {
      await updateDoc(doc(this.db, 'userSessions', this.sessionId), {
        ...updates,
        lastActivity: serverTimestamp(),
      });
    } catch (error) {
      console.error('Failed to update session:', error);
    }
  }

  private async endSession() {
    try {
      const sessionDuration = Date.now() - this.sessionStartTime.getTime();
      
      await updateDoc(doc(this.db, 'userSessions', this.sessionId), {
        endTime: serverTimestamp(),
        duration: sessionDuration,
        lastActivity: serverTimestamp(),
      });

      // Flush any remaining events
      await this.flushEvents();
      
      if (this.flushInterval) {
        clearInterval(this.flushInterval);
      }

    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  private handleVisibilityChange() {
    if (document.hidden) {
      // Page hidden - flush events
      this.flushEvents();
    } else {
      // Page visible - update last activity
      this.lastEventTime = new Date();
      this.updateSession({});
    }
  }

  public trackEvent(event: string, properties?: Record<string, any>) {
    try {
      const analyticsEvent: AnalyticsEvent = {
        userId: this.userId,
        event,
        properties,
        timestamp: new Date(),
        sessionId: this.sessionId,
        page: typeof window !== 'undefined' ? window.location.pathname : '',
        device: this.getDevice(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      };

      this.eventQueue.push(analyticsEvent);
      this.lastEventTime = new Date();

      // Update session event count
      this.updateSession({ events: increment(1) as any });

      // Immediate flush for critical events
      const criticalEvents = ['subscription_started', 'crisis_detected', 'error_occurred'];
      if (criticalEvents.includes(event)) {
        this.flushEvents();
      }

      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics event:', analyticsEvent);
      }

    } catch (error) {
      console.error('Failed to track event:', error);
      Sentry.captureException(error, { tags: { component: 'analytics' } });
    }
  }

  public trackPageView(page?: string) {
    const currentPage = page || (typeof window !== 'undefined' ? window.location.pathname : '');
    
    this.trackEvent('page_view', {
      page: currentPage,
      title: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    });

    // Update session page view count
    this.updateSession({ pageViews: increment(1) as any });
  }

  public trackUserAction(action: string, context?: Record<string, any>) {
    this.trackEvent('user_action', {
      action,
      ...context,
    });
  }

  public trackPerformance(metric: string, value: number, context?: Record<string, any>) {
    this.trackEvent('performance_metric', {
      metric,
      value,
      ...context,
    });
  }

  public trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error_occurred', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context,
    });
  }

  public trackFeatureUsage(feature: string, usage?: Record<string, any>) {
    this.trackEvent('feature_used', {
      feature,
      ...usage,
    });
  }

  public async flushEvents() {
    if (this.eventQueue.length === 0) return;

    try {
      const eventsToFlush = [...this.eventQueue];
      this.eventQueue = [];

      // Batch write events to Firestore
      const batch = eventsToFlush.map(event => 
        addDoc(collection(this.db, 'analyticsEvents'), event)
      );

      await Promise.all(batch);

      // Add breadcrumb for monitoring
      Sentry.addBreadcrumb({
        message: `Analytics events flushed: ${eventsToFlush.length} events`,
        category: 'analytics',
        data: { eventCount: eventsToFlush.length },
        level: 'info',
      });

    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      Sentry.captureException(error, { tags: { component: 'analytics' } });
    }
  }

  // Convenience methods for common tracking scenarios
  public trackJournalEntry(action: 'created' | 'edited' | 'deleted', metadata?: Record<string, any>) {
    this.trackEvent('journal_entry', { action, ...metadata });
  }

  public trackAIInteraction(type: 'analysis' | 'insights' | 'crisis_detection', metadata?: Record<string, any>) {
    this.trackEvent('ai_interaction', { type, ...metadata });
  }

  public trackSubscription(action: 'started' | 'cancelled' | 'upgraded', tier?: string) {
    this.trackEvent('subscription', { action, tier });
  }

  public trackPathwayProgress(pathway: string, action: 'started' | 'completed' | 'abandoned', progress?: number) {
    this.trackEvent('pathway_progress', { pathway, action, progress });
  }

  public trackCrisisSupport(action: 'hotline_called' | 'resources_viewed' | 'emergency_contacted') {
    this.trackEvent('crisis_support', { action });
  }

  // Get analytics summary for current session
  public getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.sessionStartTime,
      duration: Date.now() - this.sessionStartTime.getTime(),
      eventsTracked: this.eventQueue.length,
      device: this.getDevice(),
    };
  }
}

// Create global analytics instance
export const analytics = new AnalyticsService();

// React hook for analytics
export function useAnalytics() {
  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackUserAction: analytics.trackUserAction.bind(analytics),
    trackPerformance: analytics.trackPerformance.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackJournalEntry: analytics.trackJournalEntry.bind(analytics),
    trackAIInteraction: analytics.trackAIInteraction.bind(analytics),
    trackSubscription: analytics.trackSubscription.bind(analytics),
    trackPathwayProgress: analytics.trackPathwayProgress.bind(analytics),
    trackCrisisSupport: analytics.trackCrisisSupport.bind(analytics),
    getSessionSummary: analytics.getSessionSummary.bind(analytics),
  };
}

// Initialize analytics when imported
if (typeof window !== 'undefined') {
  // Track initial page load
  analytics.trackEvent('app_loaded', {
    url: window.location.href,
    timestamp: new Date().toISOString(),
  });
}