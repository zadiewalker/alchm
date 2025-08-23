// Privacy-focused analytics for ALCHM
'use client';

import { sanitizeInput } from './security';

// Types for analytics events
export interface AnalyticsEvent {
  event: string;
  category: 'journal' | 'user' | 'ai' | 'navigation' | 'error' | 'performance';
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId: string;
  timestamp: number;
  metadata?: Record<string, any>;
  anonymized?: boolean;
}

export interface UserMetrics {
  totalJournals: number;
  journalStreak: number;
  avgSessionTime: number;
  preferredWritingTime: string;
  moodTrends: Array<{ date: string; mood: string }>;
  wordCountProgress: Array<{ date: string; words: number }>;
  aiInteractions: number;
  lastActive: string;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

// Privacy-first analytics manager
class AnalyticsManager {
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isOptedIn: boolean = false;
  private batchSize = 10;
  private batchTimeout = 5000; // 5 seconds
  private batchTimer?: NodeJS.Timeout;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;

    // Check user consent
    this.checkConsent();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    // Setup error tracking
    this.setupErrorTracking();
    
    // Setup navigation tracking
    this.setupNavigationTracking();
    
    // Process queue periodically
    this.startBatchProcessor();
  }

  // Check and request user consent
  private checkConsent(): void {
    const consent = localStorage.getItem('alchm:analytics:consent');
    this.isOptedIn = consent === 'true';
    
    if (!consent) {
      // Show consent banner (implement in UI)
      this.dispatchConsentEvent();
    }
  }

  // Set user consent
  setConsent(granted: boolean): void {
    this.isOptedIn = granted;
    localStorage.setItem('alchm:analytics:consent', granted.toString());
    
    if (granted) {
      this.track('user', 'consent_granted');
    } else {
      this.clearData();
    }
  }

  // Set user ID (after authentication)
  setUserId(userId: string): void {
    this.userId = userId;
  }

  // Track event
  track(
    category: AnalyticsEvent['category'],
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.isOptedIn) return;

    const event: AnalyticsEvent = {
      event: `${category}_${action}`,
      category,
      action,
      label,
      value,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      metadata: this.sanitizeMetadata(metadata),
      anonymized: !this.userId // Anonymous if no user ID
    };

    this.queue.push(event);
    this.processQueueIfReady();
  }

  // Track journal-specific events
  trackJournal = {
    created: (wordCount: number, timeSpent: number) => {
      this.track('journal', 'created', undefined, wordCount, {
        timeSpent,
        timestamp: Date.now()
      });
    },

    edited: (entryId: string, wordCount: number) => {
      this.track('journal', 'edited', entryId, wordCount);
    },

    deleted: (entryId: string) => {
      this.track('journal', 'deleted', entryId);
    },

    aiAnalyzed: (entryId: string, analysisType: string) => {
      this.track('journal', 'ai_analyzed', entryId, undefined, {
        analysisType
      });
    },

    exported: (format: string, entryCount: number) => {
      this.track('journal', 'exported', format, entryCount);
    },

    streak: (days: number) => {
      this.track('journal', 'streak_achieved', undefined, days);
    }
  };

  // Track AI interactions
  trackAI = {
    request: (type: 'analysis' | 'reflection' | 'assessment', duration: number) => {
      this.track('ai', 'request', type, duration);
    },

    success: (type: string, confidence: number) => {
      this.track('ai', 'success', type, confidence);
    },

    error: (type: string, errorCode: string) => {
      this.track('ai', 'error', type, undefined, { errorCode });
    },

    rateLimited: (type: string) => {
      this.track('ai', 'rate_limited', type);
    }
  };

  // Track user behavior
  trackUser = {
    login: (method: string) => {
      this.track('user', 'login', method);
    },

    logout: () => {
      this.track('user', 'logout');
    },

    profileUpdated: (field: string) => {
      this.track('user', 'profile_updated', field);
    },

    preferencesChanged: (setting: string, value: string) => {
      this.track('user', 'preferences_changed', setting, undefined, { value });
    },

    themeChanged: (theme: string) => {
      this.track('user', 'theme_changed', theme);
    },

    notificationEnabled: (type: string) => {
      this.track('user', 'notification_enabled', type);
    }
  };

  // Track navigation
  trackNavigation = {
    pageView: (path: string, referrer?: string) => {
      this.track('navigation', 'page_view', path, undefined, { referrer });
    },

    linkClick: (url: string, text: string) => {
      this.track('navigation', 'link_click', url, undefined, { text });
    },

    search: (query: string, results: number) => {
      // Sanitize search query to remove personal information
      const sanitizedQuery = sanitizeInput(query).substring(0, 50);
      this.track('navigation', 'search', sanitizedQuery, results);
    }
  };

  // Track errors
  trackError = {
    javascript: (error: Error, source: string) => {
      this.track('error', 'javascript', source, undefined, {
        message: error.message,
        stack: error.stack?.substring(0, 500) // Limit stack trace
      });
    },

    api: (endpoint: string, status: number, message: string) => {
      this.track('error', 'api', endpoint, status, { message });
    },

    validation: (field: string, rule: string) => {
      this.track('error', 'validation', field, undefined, { rule });
    }
  };

  // Track performance metrics
  trackPerformance(metrics: Partial<PerformanceMetrics>): void {
    this.track('performance', 'page_metrics', undefined, undefined, metrics);
  }

  // Get user metrics (for dashboard)
  async getUserMetrics(): Promise<UserMetrics | null> {
    if (!this.userId || !this.isOptedIn) return null;

    try {
      const response = await fetch(`/api/analytics/user/${this.userId}/metrics`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('[Analytics] Failed to fetch user metrics:', error);
    }
    return null;
  }

  // Setup performance monitoring
  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.trackPerformance({ largestContentfulPaint: entry.startTime });
        } else if (entry.entryType === 'first-input') {
          this.trackPerformance({ firstInputDelay: (entry as any).processingStart - entry.startTime });
        } else if (entry.entryType === 'layout-shift') {
          if (!(entry as any).hadRecentInput) {
            this.trackPerformance({ cumulativeLayoutShift: (entry as any).value });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      console.warn('[Analytics] Performance observer not supported');
    }

    // Page load metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          this.trackPerformance({
            pageLoadTime: perfData.loadEventEnd - perfData.startTime,
            firstContentfulPaint: this.getFCP(),
            timeToInteractive: this.getTTI()
          });
        }
      }, 0);
    });
  }

  // Setup error tracking
  private setupErrorTracking(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', (event) => {
      this.trackError.javascript(event.error, event.filename || 'unknown');
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError.javascript(
        new Error(event.reason?.toString() || 'Unhandled promise rejection'),
        'promise'
      );
    });
  }

  // Setup navigation tracking
  private setupNavigationTracking(): void {
    if (typeof window === 'undefined') return;

    // Track initial page view
    this.trackNavigation.pageView(window.location.pathname, document.referrer);

    // Track route changes (for SPA)
    let currentPath = window.location.pathname;
    const checkPathChange = () => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.trackNavigation.pageView(currentPath);
      }
    };

    // Use mutation observer to detect route changes
    const observer = new MutationObserver(checkPathChange);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Process analytics queue
  private processQueueIfReady(): void {
    if (this.queue.length >= this.batchSize) {
      this.processBatch();
    }
  }

  private startBatchProcessor(): void {
    this.batchTimer = setInterval(() => {
      if (this.queue.length > 0) {
        this.processBatch();
      }
    }, this.batchTimeout);
  }

  private async processBatch(): Promise<void> {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);
    
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: batch }),
      });
    } catch (error) {
      console.error('[Analytics] Failed to send batch:', error);
      // Put events back in queue for retry
      this.queue.unshift(...batch);
    }
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    Object.entries(metadata).forEach(([key, value]) => {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeInput(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      }
    });
    return sanitized;
  }

  private getFCP(): number {
    const entries = performance.getEntriesByType('paint');
    const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
    return fcpEntry?.startTime || 0;
  }

  private getTTI(): number {
    // Simplified TTI calculation - in practice, use a proper library
    return performance.timing.domInteractive - performance.timing.navigationStart;
  }

  private dispatchConsentEvent(): void {
    window.dispatchEvent(new CustomEvent('analytics:consent:required'));
  }

  private clearData(): void {
    this.queue = [];
    localStorage.removeItem('alchm:analytics:consent');
  }

  // Cleanup
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.processBatch(); // Send remaining events
  }
}

// Create singleton instance
export const analytics = new AnalyticsManager();

// React hook for analytics
export function useAnalytics() {
  return {
    track: analytics.track.bind(analytics),
    trackJournal: analytics.trackJournal,
    trackAI: analytics.trackAI,
    trackUser: analytics.trackUser,
    trackNavigation: analytics.trackNavigation,
    trackError: analytics.trackError,
    trackPerformance: analytics.trackPerformance.bind(analytics),
    setConsent: analytics.setConsent.bind(analytics),
    setUserId: analytics.setUserId.bind(analytics),
    getUserMetrics: analytics.getUserMetrics.bind(analytics),
  };
}

// Performance monitoring hook
export function usePerformanceMonitoring() {
  React.useEffect(() => {
    // Track component mount performance
    const mountTime = performance.now();
    
    return () => {
      const unmountTime = performance.now();
      analytics.trackPerformance({
        pageLoadTime: unmountTime - mountTime
      });
    };
  }, []);
}

// Import React for hook
import React from 'react';