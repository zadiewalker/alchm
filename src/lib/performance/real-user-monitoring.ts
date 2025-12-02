/**
 * ALCHM Real User Monitoring (RUM) System
 * 
 * Captures actual user experiences in production to understand
 * how trauma-informed design performs for real users in crisis.
 */

import { getPerformanceMonitor, CRISIS_PERFORMANCE_THRESHOLDS } from '../monitoring/real-time-performance-monitor';

interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  userAgent: string;
  deviceInfo: DeviceInfo;
  connectionInfo: ConnectionInfo;
  locationInfo?: LocationInfo;
  isCrisisSession: boolean;
  journeyEvents: UserJourneyEvent[];
  performanceEvents: UserPerformanceEvent[];
  errorEvents: UserErrorEvent[];
  conversionEvents: ConversionEvent[];
}

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  screenResolution: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
  isLowEndDevice: boolean;
  batteryLevel?: number;
  chargingStatus?: boolean;
}

interface ConnectionInfo {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  isSlowConnection: boolean;
}

interface LocationInfo {
  country?: string;
  region?: string;
  timezone: string;
}

interface UserJourneyEvent {
  eventId: string;
  type: 'page_view' | 'click' | 'scroll' | 'focus' | 'blur' | 'crisis_action';
  timestamp: number;
  url: string;
  elementSelector?: string;
  eventData?: any;
  isCrisisRelated: boolean;
}

interface UserPerformanceEvent {
  eventId: string;
  metricType: string;
  value: number;
  timestamp: number;
  url: string;
  isCrisisContext: boolean;
  percentile?: number;
}

interface UserErrorEvent {
  eventId: string;
  type: 'javascript' | 'network' | 'resource' | 'api';
  message: string;
  stack?: string;
  url: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isCrisisImpacting: boolean;
}

interface ConversionEvent {
  eventId: string;
  type: 'crisis_help_sought' | 'journal_created' | 'auth_completed' | 'resource_accessed';
  timestamp: number;
  timeFromCrisis?: number;
  performanceAtTime: PerformanceSnapshot;
}

interface PerformanceSnapshot {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  memoryUsage?: number;
}

interface RUMAnalytics {
  totalSessions: number;
  crisisSessions: number;
  averageSessionDuration: number;
  conversionRate: number;
  performanceBenchmarks: PerformanceBenchmarks;
  errorRates: ErrorRates;
  deviceBreakdown: DeviceBreakdown;
  criticalIssues: CriticalIssue[];
}

interface PerformanceBenchmarks {
  p50: PerformanceSnapshot;
  p75: PerformanceSnapshot;
  p90: PerformanceSnapshot;
  p95: PerformanceSnapshot;
  crisisResourcesP50: PerformanceSnapshot;
}

interface ErrorRates {
  overall: number;
  crisisPages: number;
  lowEndDevices: number;
  slowConnections: number;
}

interface DeviceBreakdown {
  mobile: number;
  tablet: number;
  desktop: number;
  lowEndDevices: number;
}

interface CriticalIssue {
  type: string;
  severity: 'high' | 'critical';
  affectedUsers: number;
  description: string;
  firstSeen: number;
  lastSeen: number;
  isCrisisImpacting: boolean;
}

class RealUserMonitoring {
  private currentSession: UserSession | null = null;
  private sessionStorage: UserSession[] = [];
  private observerCallbacks: ((session: UserSession) => void)[] = [];
  private analyticsCallbacks: ((analytics: RUMAnalytics) => void)[] = [];
  private isInitialized = false;
  private samplingRate = 1.0; // 100% sampling for crisis users

  constructor() {
    this.initializeRUM();
  }

  private initializeRUM(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    console.log('[RUM] Initializing Real User Monitoring');

    this.startNewSession();
    this.setupEventListeners();
    this.setupPerformanceObserver();
    this.setupErrorTracking();
    this.setupBeaconReporting();

    this.isInitialized = true;
  }

  private startNewSession(): void {
    const sessionId = this.generateSessionId();
    
    this.currentSession = {
      sessionId,
      startTime: Date.now(),
      userAgent: navigator.userAgent,
      deviceInfo: this.getDeviceInfo(),
      connectionInfo: this.getConnectionInfo(),
      locationInfo: this.getLocationInfo(),
      isCrisisSession: this.isCrisisContext(),
      journeyEvents: [],
      performanceEvents: [],
      errorEvents: [],
      conversionEvents: []
    };

    // Adjust sampling for crisis sessions
    if (this.currentSession.isCrisisSession) {
      this.samplingRate = 1.0; // 100% sampling for crisis users
    } else {
      this.samplingRate = 0.1; // 10% sampling for regular users
    }

    this.recordJourneyEvent({
      type: 'page_view',
      url: window.location.href,
      isCrisisRelated: this.isCrisisContext()
    });

    console.log(`[RUM] Started session ${sessionId} (crisis: ${this.currentSession.isCrisisSession})`);
  }

  private generateSessionId(): string {
    return `rum-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    
    let deviceType: DeviceInfo['type'] = 'unknown';
    if (userAgent.includes('mobile')) deviceType = 'mobile';
    else if (userAgent.includes('tablet')) deviceType = 'tablet';
    else if (userAgent.includes('desktop') || !userAgent.includes('mobile')) deviceType = 'desktop';

    const deviceMemory = (navigator as any).deviceMemory;
    const hardwareConcurrency = navigator.hardwareConcurrency;
    
    // Heuristic for low-end device detection
    const isLowEndDevice = deviceMemory < 4 || hardwareConcurrency < 4 || deviceType === 'mobile';

    const deviceInfo: DeviceInfo = {
      type: deviceType,
      screenResolution: `${screen.width}x${screen.height}`,
      deviceMemory,
      hardwareConcurrency,
      isLowEndDevice
    };

    // Battery API if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        deviceInfo.batteryLevel = battery.level;
        deviceInfo.chargingStatus = battery.charging;
      });
    }

    return deviceInfo;
  }

  private getConnectionInfo(): ConnectionInfo {
    const connection = (navigator as any).connection;
    
    const connectionInfo: ConnectionInfo = {
      isSlowConnection: false
    };

    if (connection) {
      connectionInfo.type = connection.type;
      connectionInfo.effectiveType = connection.effectiveType;
      connectionInfo.downlink = connection.downlink;
      connectionInfo.rtt = connection.rtt;
      connectionInfo.saveData = connection.saveData;
      connectionInfo.isSlowConnection = ['slow-2g', '2g'].includes(connection.effectiveType);
    }

    return connectionInfo;
  }

  private getLocationInfo(): LocationInfo {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  private isCrisisContext(): boolean {
    const url = window.location.href.toLowerCase();
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support'];
    return crisisKeywords.some(keyword => url.includes(keyword));
  }

  private setupEventListeners(): void {
    // Page navigation
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });

    // Visibility changes
    document.addEventListener('visibilitychange', () => {
      this.recordJourneyEvent({
        type: document.hidden ? 'blur' : 'focus',
        url: window.location.href,
        isCrisisRelated: this.isCrisisContext()
      });
    });

    // Click tracking for crisis elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const isCrisisElement = this.isCrisisElement(target);
      
      if (isCrisisElement || this.shouldSampleClick()) {
        this.recordJourneyEvent({
          type: isCrisisElement ? 'crisis_action' : 'click',
          url: window.location.href,
          elementSelector: this.getElementSelector(target),
          isCrisisRelated: isCrisisElement
        });
      }
    }, { passive: true });

    // Scroll depth tracking
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.recordJourneyEvent({
          type: 'scroll',
          url: window.location.href,
          eventData: { scrollDepth },
          isCrisisRelated: this.isCrisisContext()
        });
      }
    }, { passive: true });
  }

  private setupPerformanceObserver(): void {
    const performanceMonitor = getPerformanceMonitor();
    
    // Subscribe to performance alerts
    performanceMonitor.onAlert((alert) => {
      this.recordPerformanceEvent({
        metricType: alert.metric,
        value: alert.value,
        url: alert.url || window.location.href,
        isCrisisContext: alert.isCrisisContext
      });
    });

    // Monitor Web Vitals
    this.setupWebVitalsTracking();
  }

  private setupWebVitalsTracking(): void {
    // This would integrate with web-vitals library
    // For now, we'll listen for performance events
    
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.recordPerformanceEvent({
              metricType: 'LCP',
              value: entry.startTime,
              url: window.location.href,
              isCrisisContext: this.isCrisisContext()
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
      } catch (error) {
        console.warn('[RUM] Performance observer not fully supported');
      }
    }
  }

  private setupErrorTracking(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.recordErrorEvent({
        type: 'javascript',
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        severity: this.categorizeErrorSeverity(event.message),
        isCrisisImpacting: this.isCrisisContext() || this.isCrisisError(event.message)
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.recordErrorEvent({
        type: 'javascript',
        message: event.reason?.toString() || 'Unhandled promise rejection',
        url: window.location.href,
        severity: this.categorizeErrorSeverity(event.reason?.toString()),
        isCrisisImpacting: this.isCrisisContext()
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const target = event.target as HTMLElement;
        this.recordErrorEvent({
          type: 'resource',
          message: `Failed to load resource: ${target.tagName}`,
          url: (target as any).src || (target as any).href || window.location.href,
          severity: this.isCrisisResource((target as any).src || (target as any).href) ? 'critical' : 'medium',
          isCrisisImpacting: this.isCrisisResource((target as any).src || (target as any).href)
        });
      }
    }, true);
  }

  private setupBeaconReporting(): void {
    // Send data periodically
    setInterval(() => {
      this.sendSessionData();
    }, 30000); // Every 30 seconds

    // Send data on page unload
    window.addEventListener('beforeunload', () => {
      this.sendSessionData(true);
    });
  }

  private recordJourneyEvent(eventData: Omit<UserJourneyEvent, 'eventId' | 'timestamp'>): void {
    if (!this.currentSession || !this.shouldSample()) return;

    const event: UserJourneyEvent = {
      eventId: this.generateEventId(),
      timestamp: Date.now(),
      ...eventData
    };

    this.currentSession.journeyEvents.push(event);

    // Check for conversion events
    this.checkForConversion(event);
  }

  private recordPerformanceEvent(eventData: Omit<UserPerformanceEvent, 'eventId' | 'timestamp' | 'percentile'>): void {
    if (!this.currentSession || !this.shouldSample()) return;

    const event: UserPerformanceEvent = {
      eventId: this.generateEventId(),
      timestamp: Date.now(),
      ...eventData
    };

    this.currentSession.performanceEvents.push(event);
  }

  private recordErrorEvent(eventData: Omit<UserErrorEvent, 'eventId' | 'timestamp'>): void {
    if (!this.currentSession) return;

    const event: UserErrorEvent = {
      eventId: this.generateEventId(),
      timestamp: Date.now(),
      ...eventData
    };

    this.currentSession.errorEvents.push(event);

    // Always report critical errors, especially crisis-impacting ones
    if (event.severity === 'critical' || event.isCrisisImpacting) {
      this.sendCriticalError(event);
    }
  }

  private checkForConversion(event: UserJourneyEvent): void {
    let conversionType: ConversionEvent['type'] | null = null;
    
    if (event.type === 'crisis_action') {
      conversionType = 'crisis_help_sought';
    } else if (event.url.includes('journal') && event.type === 'click') {
      conversionType = 'journal_created';
    } else if (event.url.includes('auth') && event.type === 'page_view') {
      conversionType = 'auth_completed';
    } else if (event.isCrisisRelated && event.type === 'click') {
      conversionType = 'resource_accessed';
    }

    if (conversionType) {
      const conversionEvent: ConversionEvent = {
        eventId: this.generateEventId(),
        type: conversionType,
        timestamp: Date.now(),
        timeFromCrisis: this.calculateTimeFromCrisis(),
        performanceAtTime: this.getCurrentPerformanceSnapshot()
      };

      this.currentSession!.conversionEvents.push(conversionEvent);
      
      console.log(`[RUM] Conversion recorded: ${conversionType}`);
    }
  }

  private calculateTimeFromCrisis(): number | undefined {
    if (!this.currentSession) return undefined;

    const firstCrisisEvent = this.currentSession.journeyEvents.find(e => e.isCrisisRelated);
    return firstCrisisEvent ? Date.now() - firstCrisisEvent.timestamp : undefined;
  }

  private getCurrentPerformanceSnapshot(): PerformanceSnapshot {
    const performanceMonitor = getPerformanceMonitor();
    const recentMetrics = performanceMonitor.getRecentMetrics(10000); // Last 10 seconds
    
    const snapshot: PerformanceSnapshot = {};
    
    recentMetrics.forEach(metric => {
      switch (metric.type) {
        case 'LCP':
          snapshot.lcp = metric.value;
          break;
        case 'FID':
          snapshot.fid = metric.value;
          break;
        case 'CLS':
          snapshot.cls = metric.value;
          break;
        case 'TTFB':
          snapshot.ttfb = metric.value;
          break;
        case 'MEMORY_USAGE':
          snapshot.memoryUsage = metric.value;
          break;
      }
    });

    return snapshot;
  }

  private generateEventId(): string {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  }

  private shouldSample(): boolean {
    return Math.random() < this.samplingRate;
  }

  private shouldSampleClick(): boolean {
    // Sample 10% of regular clicks, 100% of crisis-related clicks
    return Math.random() < 0.1;
  }

  private isCrisisElement(element: HTMLElement): boolean {
    const crisisSelectors = ['crisis-button', 'emergency-button', 'help-button'];
    const crisisAttributes = ['data-crisis', 'data-emergency', 'data-crisis-action'];
    
    return crisisSelectors.some(cls => element.classList.contains(cls)) ||
           crisisAttributes.some(attr => element.hasAttribute(attr)) ||
           element.textContent?.toLowerCase().includes('crisis') ||
           element.textContent?.toLowerCase().includes('emergency');
  }

  private isCrisisResource(url: string): boolean {
    if (!url) return false;
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support', 'hotline'];
    return crisisKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  private isCrisisError(message: string): boolean {
    if (!message) return false;
    const crisisKeywords = ['crisis', 'emergency', 'help', 'support'];
    return crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  private categorizeErrorSeverity(message: string): UserErrorEvent['severity'] {
    if (!message) return 'low';
    
    const criticalKeywords = ['crisis', 'emergency', 'auth', 'security'];
    const highKeywords = ['api', 'network', 'timeout'];
    const mediumKeywords = ['validation', 'format'];
    
    if (criticalKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return 'critical';
    } else if (highKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return 'medium';
    }
    
    return 'low';
  }

  private async sendSessionData(isBeacon: boolean = false): Promise<void> {
    if (!this.currentSession) return;

    const sessionData = {
      ...this.currentSession,
      endTime: Date.now()
    };

    const payload = JSON.stringify(sessionData);

    try {
      if (isBeacon && 'sendBeacon' in navigator) {
        navigator.sendBeacon('/api/rum/sessions', payload);
      } else {
        await fetch('/api/rum/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        });
      }
    } catch (error) {
      console.error('[RUM] Failed to send session data:', error);
    }
  }

  private async sendCriticalError(error: UserErrorEvent): Promise<void> {
    try {
      await fetch('/api/rum/critical-errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.currentSession?.sessionId,
          error,
          timestamp: Date.now()
        }),
        keepalive: true
      });
    } catch (err) {
      console.error('[RUM] Failed to send critical error:', err);
    }
  }

  private endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.sessionStorage.push(this.currentSession);
    
    this.sendSessionData(true);
    
    console.log(`[RUM] Ended session ${this.currentSession.sessionId}`);
    this.currentSession = null;
  }

  // Public API
  public onSessionUpdate(callback: (session: UserSession) => void): () => void {
    this.observerCallbacks.push(callback);
    return () => {
      const index = this.observerCallbacks.indexOf(callback);
      if (index > -1) {
        this.observerCallbacks.splice(index, 1);
      }
    };
  }

  public onAnalyticsUpdate(callback: (analytics: RUMAnalytics) => void): () => void {
    this.analyticsCallbacks.push(callback);
    return () => {
      const index = this.analyticsCallbacks.indexOf(callback);
      if (index > -1) {
        this.analyticsCallbacks.splice(index, 1);
      }
    };
  }

  public getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  public trackCustomEvent(eventName: string, eventData: any = {}): void {
    this.recordJourneyEvent({
      type: 'click', // Custom events as clicks for now
      url: window.location.href,
      elementSelector: `custom-${eventName}`,
      eventData: { customEvent: eventName, ...eventData },
      isCrisisRelated: this.isCrisisContext()
    });
  }

  public trackConversion(type: ConversionEvent['type']): void {
    if (!this.currentSession) return;

    const conversionEvent: ConversionEvent = {
      eventId: this.generateEventId(),
      type,
      timestamp: Date.now(),
      timeFromCrisis: this.calculateTimeFromCrisis(),
      performanceAtTime: this.getCurrentPerformanceSnapshot()
    };

    this.currentSession.conversionEvents.push(conversionEvent);
  }

  public getAnalytics(): RUMAnalytics {
    // This would typically be computed on the backend
    // Here's a simplified version for immediate insights
    
    const allSessions = [...this.sessionStorage];
    if (this.currentSession) {
      allSessions.push(this.currentSession);
    }

    return {
      totalSessions: allSessions.length,
      crisisSessions: allSessions.filter(s => s.isCrisisSession).length,
      averageSessionDuration: this.calculateAverageSessionDuration(allSessions),
      conversionRate: this.calculateConversionRate(allSessions),
      performanceBenchmarks: this.calculatePerformanceBenchmarks(allSessions),
      errorRates: this.calculateErrorRates(allSessions),
      deviceBreakdown: this.calculateDeviceBreakdown(allSessions),
      criticalIssues: this.identifyCriticalIssues(allSessions)
    };
  }

  private calculateAverageSessionDuration(sessions: UserSession[]): number {
    const completedSessions = sessions.filter(s => s.endTime);
    if (completedSessions.length === 0) return 0;
    
    const totalDuration = completedSessions.reduce(
      (sum, session) => sum + (session.endTime! - session.startTime), 
      0
    );
    
    return totalDuration / completedSessions.length;
  }

  private calculateConversionRate(sessions: UserSession[]): number {
    if (sessions.length === 0) return 0;
    
    const sessionsWithConversions = sessions.filter(s => s.conversionEvents.length > 0);
    return (sessionsWithConversions.length / sessions.length) * 100;
  }

  private calculatePerformanceBenchmarks(sessions: UserSession[]): PerformanceBenchmarks {
    // Simplified calculation - would be more sophisticated in production
    return {
      p50: { lcp: 2000, fid: 100, cls: 0.1 },
      p75: { lcp: 3000, fid: 150, cls: 0.15 },
      p90: { lcp: 4000, fid: 200, cls: 0.2 },
      p95: { lcp: 5000, fid: 250, cls: 0.25 },
      crisisResourcesP50: { lcp: 1500, fid: 75, cls: 0.05 }
    };
  }

  private calculateErrorRates(sessions: UserSession[]): ErrorRates {
    const totalEvents = sessions.reduce((sum, s) => sum + s.errorEvents.length, 0);
    const crisisErrors = sessions.reduce((sum, s) => 
      sum + s.errorEvents.filter(e => e.isCrisisImpacting).length, 0
    );
    
    return {
      overall: totalEvents / Math.max(sessions.length, 1),
      crisisPages: crisisErrors / Math.max(sessions.filter(s => s.isCrisisSession).length, 1),
      lowEndDevices: 0, // Would calculate based on device info
      slowConnections: 0 // Would calculate based on connection info
    };
  }

  private calculateDeviceBreakdown(sessions: UserSession[]): DeviceBreakdown {
    const breakdown = { mobile: 0, tablet: 0, desktop: 0, lowEndDevices: 0 };
    
    sessions.forEach(session => {
      breakdown[session.deviceInfo.type as keyof typeof breakdown]++;
      if (session.deviceInfo.isLowEndDevice) {
        breakdown.lowEndDevices++;
      }
    });

    return breakdown;
  }

  private identifyCriticalIssues(sessions: UserSession[]): CriticalIssue[] {
    // Simplified critical issue detection
    const issues: CriticalIssue[] = [];
    
    const crisisErrors = sessions.flatMap(s => 
      s.errorEvents.filter(e => e.isCrisisImpacting)
    );

    if (crisisErrors.length > 0) {
      issues.push({
        type: 'Crisis Feature Errors',
        severity: 'critical',
        affectedUsers: new Set(sessions.filter(s => 
          s.errorEvents.some(e => e.isCrisisImpacting)
        ).map(s => s.sessionId)).size,
        description: 'Errors affecting crisis-related functionality',
        firstSeen: Math.min(...crisisErrors.map(e => e.timestamp)),
        lastSeen: Math.max(...crisisErrors.map(e => e.timestamp)),
        isCrisisImpacting: true
      });
    }

    return issues;
  }

  public destroy(): void {
    this.endSession();
    this.observerCallbacks = [];
    this.analyticsCallbacks = [];
    this.isInitialized = false;
  }
}

// Singleton instance
let rumInstance: RealUserMonitoring | null = null;

export function getRUM(): RealUserMonitoring {
  if (!rumInstance) {
    rumInstance = new RealUserMonitoring();
  }
  return rumInstance;
}

// Convenience functions
export function trackCrisisAction(action: string, data?: any): void {
  const rum = getRUM();
  rum.trackCustomEvent(`crisis_${action}`, data);
}

export function trackConversion(type: ConversionEvent['type']): void {
  const rum = getRUM();
  rum.trackConversion(type);
}

export type {
  UserSession,
  UserJourneyEvent,
  UserPerformanceEvent,
  UserErrorEvent,
  ConversionEvent,
  RUMAnalytics,
  CriticalIssue
};

export default RealUserMonitoring;