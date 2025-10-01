// Launch Monitoring & Analytics for ALCHM Platform Reviews
// Bulletproof monitoring for Product Hunt, EdSurge, and funding platform reviews

import { getAnalytics, logEvent, setUserProperties } from 'firebase/analytics';
import { getPerformance, trace, getMetric } from 'firebase/performance';
import { app } from './firebase';

// Initialize Firebase Analytics and Performance
let analytics: any = null;
let performance: any = null;

try {
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    performance = getPerformance(app);
  }
} catch (error) {
  console.warn('Firebase Analytics/Performance initialization failed:', error);
}

// Launch Metrics Interface
interface LaunchMetric {
  event: string;
  timestamp: number;
  source?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// Platform Traffic Sources for Reviews
const REVIEW_PLATFORMS = {
  'product_hunt': 'Product Hunt Launch',
  'edsurge': 'EdSurge Review',
  'ycombinator': 'Y Combinator Demo Day',
  'techcrunch': 'TechCrunch Coverage',
  'betalist': 'BetaList Feature',
  'hn': 'Hacker News',
  'reddit': 'Reddit Discussion',
  'linkedin': 'LinkedIn Professional',
  'twitter': 'Twitter/X Social',
  'instagram': 'Instagram Story/Reel',
  'tiktok': 'TikTok Discovery',
  'direct': 'Direct Traffic',
  'referral': 'Referral Link',
  'search': 'Google Search',
  'email': 'Email Campaign'
} as const;

// Critical Performance Monitoring
export class LaunchMonitor {
  private metrics: LaunchMetric[] = [];
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Track critical user journey events
    this.trackPageLoad();
    this.trackUserEngagement();
    this.trackPerformanceMetrics();
    this.trackErrorRecovery();
    
    // Platform review specific tracking
    this.identifyTrafficSource();
    this.trackConversionFunnels();
  }

  // === PLATFORM REVIEW TRAFFIC IDENTIFICATION ===
  
  private identifyTrafficSource(): void {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    // UTM campaign tracking for reviews
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    
    let trafficSource = 'direct';
    let platform = 'unknown';

    // Identify review platform sources
    if (utmSource) {
      platform = utmSource;
      trafficSource = 'campaign';
    } else if (referrer) {
      if (referrer.includes('producthunt.com')) {
        platform = 'product_hunt';
        trafficSource = 'referral';
      } else if (referrer.includes('edsurge.com')) {
        platform = 'edsurge';
        trafficSource = 'referral';
      } else if (referrer.includes('ycombinator.com') || referrer.includes('news.ycombinator.com')) {
        platform = 'ycombinator';
        trafficSource = 'referral';
      } else if (referrer.includes('techcrunch.com')) {
        platform = 'techcrunch';
        trafficSource = 'referral';
      } else if (referrer.includes('reddit.com')) {
        platform = 'reddit';
        trafficSource = 'social';
      } else if (referrer.includes('linkedin.com')) {
        platform = 'linkedin';
        trafficSource = 'professional';
      } else if (referrer.includes('twitter.com') || referrer.includes('x.com')) {
        platform = 'twitter';
        trafficSource = 'social';
      }
    }

    this.logLaunchMetric('traffic_source_identified', {
      platform,
      trafficSource,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer: referrer.substring(0, 200) // Truncate for privacy
    });

    // Set user properties for segmentation
    if (analytics) {
      setUserProperties(analytics, {
        traffic_source: trafficSource,
        review_platform: platform,
        session_id: this.sessionId
      });
    }
  }

  // === PERFORMANCE MONITORING FOR HIGH TRAFFIC ===
  
  private trackPerformanceMetrics(): void {
    if (typeof window === 'undefined' || !performance) return;

    // Core Web Vitals tracking
    const trackWebVitals = () => {
      // First Contentful Paint (FCP)
      getMetric('first-contentful-paint', (metric) => {
        this.logLaunchMetric('core_web_vitals', {
          metric: 'FCP',
          value: metric.value,
          rating: this.getPerformanceRating(metric.value, [1800, 3000]) // Good, Needs Improvement, Poor
        });
      });

      // Largest Contentful Paint (LCP)
      getMetric('largest-contentful-paint', (metric) => {
        this.logLaunchMetric('core_web_vitals', {
          metric: 'LCP',
          value: metric.value,
          rating: this.getPerformanceRating(metric.value, [2500, 4000])
        });
      });

      // First Input Delay (FID)
      getMetric('first-input-delay', (metric) => {
        this.logLaunchMetric('core_web_vitals', {
          metric: 'FID',
          value: metric.value,
          rating: this.getPerformanceRating(metric.value, [100, 300])
        });
      });

      // Cumulative Layout Shift (CLS)
      getMetric('cumulative-layout-shift', (metric) => {
        this.logLaunchMetric('core_web_vitals', {
          metric: 'CLS',
          value: metric.value,
          rating: this.getPerformanceRating(metric.value, [0.1, 0.25])
        });
      });
    };

    // Track after page load
    if (document.readyState === 'complete') {
      setTimeout(trackWebVitals, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackWebVitals, 1000);
      });
    }
  }

  private getPerformanceRating(value: number, thresholds: [number, number]): string {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }

  // === USER ENGAGEMENT TRACKING ===
  
  private trackUserEngagement(): void {
    if (typeof window === 'undefined') return;

    let scrollDepth = 0;
    let timeOnPage = 0;
    let interactionCount = 0;

    // Scroll depth tracking
    const trackScrollDepth = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const currentDepth = Math.round(((scrollTop + windowHeight) / documentHeight) * 100);
      
      if (currentDepth > scrollDepth) {
        scrollDepth = currentDepth;
        
        // Track milestone scroll depths
        if ([25, 50, 75, 90].includes(scrollDepth)) {
          this.logLaunchMetric('scroll_depth_milestone', {
            depth: scrollDepth,
            timeToReach: Date.now() - this.startTime
          });
        }
      }
    };

    // Time on page tracking
    const startTimeTracking = () => {
      setInterval(() => {
        timeOnPage += 1;
        
        // Track engagement milestones (30s, 1m, 2m, 5m)
        if ([30, 60, 120, 300].includes(timeOnPage)) {
          this.logLaunchMetric('time_on_page_milestone', {
            seconds: timeOnPage,
            scrollDepth,
            interactionCount
          });
        }
      }, 1000);
    };

    // Interaction tracking
    const trackInteractions = () => {
      ['click', 'keydown', 'touchstart'].forEach(eventType => {
        document.addEventListener(eventType, () => {
          interactionCount++;
        });
      });
    };

    // Initialize tracking
    window.addEventListener('scroll', trackScrollDepth);
    startTimeTracking();
    trackInteractions();

    // Track page exit
    window.addEventListener('beforeunload', () => {
      this.logLaunchMetric('session_end', {
        totalTime: timeOnPage,
        maxScrollDepth: scrollDepth,
        totalInteractions: interactionCount,
        conversionCompleted: this.checkConversionCompleted()
      });
    });
  }

  // === CONVERSION FUNNEL TRACKING ===
  
  private trackConversionFunnels(): void {
    // Critical conversion events for platform reviews
    const conversionEvents = {
      'page_view': { step: 1, description: 'Landing page viewed' },
      'cta_click': { step: 2, description: 'Primary CTA clicked' },
      'auth_start': { step: 3, description: 'Authentication started' },
      'auth_complete': { step: 4, description: 'Authentication completed' },
      'onboarding_start': { step: 5, description: 'Onboarding started' },
      'first_entry': { step: 6, description: 'First journal entry created' },
      'feature_engagement': { step: 7, description: 'Core feature used' },
      'retention_day_1': { step: 8, description: 'Returned within 24 hours' }
    };

    // Expose global conversion tracking
    (window as any).alchm_trackConversion = (event: string, metadata: any = {}) => {
      if (conversionEvents[event as keyof typeof conversionEvents]) {
        const eventData = conversionEvents[event as keyof typeof conversionEvents];
        this.logLaunchMetric('conversion_funnel', {
          event,
          step: eventData.step,
          description: eventData.description,
          ...metadata
        });
      }
    };
  }

  private checkConversionCompleted(): boolean {
    return this.metrics.some(metric => 
      metric.event === 'conversion_funnel' && 
      (metric.metadata?.event === 'first_entry' || metric.metadata?.event === 'feature_engagement')
    );
  }

  // === ERROR RECOVERY TRACKING ===
  
  private trackErrorRecovery(): void {
    if (typeof window === 'undefined') return;

    // Global error handling
    window.addEventListener('error', (event) => {
      this.logLaunchMetric('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack?.substring(0, 500) // Truncated stack trace
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logLaunchMetric('unhandled_promise_rejection', {
        reason: event.reason?.toString?.()?.substring(0, 200) || 'Unknown error',
        stack: event.reason?.stack?.substring(0, 500)
      });
    });

    // Firebase errors
    window.addEventListener('firebase-error', ((event: CustomEvent) => {
      this.logLaunchMetric('firebase_error', {
        code: event.detail?.code,
        message: event.detail?.message,
        service: event.detail?.service
      });
    }) as EventListener);
  }

  // === CRISIS SUPPORT MONITORING ===
  
  trackCrisisEngagement(level: 'low' | 'moderate' | 'high', source: string): void {
    this.logLaunchMetric('crisis_support_engagement', {
      riskLevel: level,
      source,
      responseTime: Date.now() - this.startTime,
      userAgent: navigator.userAgent.substring(0, 200)
    });

    // Immediate alert for high-risk situations
    if (level === 'high') {
      this.logLaunchMetric('crisis_high_risk_detected', {
        source,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId
      }, true); // Force immediate send
    }
  }

  // === CORE METRIC LOGGING ===
  
  private trackPageLoad(): void {
    this.logLaunchMetric('page_load_start', {
      url: window.location.href,
      userAgent: navigator.userAgent.substring(0, 200),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      connection: (navigator as any).connection?.effectiveType || 'unknown'
    });

    window.addEventListener('load', () => {
      this.logLaunchMetric('page_load_complete', {
        loadTime: Date.now() - this.startTime
      });
    });
  }

  public logLaunchMetric(event: string, metadata: Record<string, any> = {}, immediate = false): void {
    const metric: LaunchMetric = {
      event,
      timestamp: Date.now(),
      metadata: {
        sessionId: this.sessionId,
        ...metadata
      }
    };

    this.metrics.push(metric);

    // Log to Firebase Analytics
    if (analytics) {
      try {
        logEvent(analytics, event, {
          ...metadata,
          session_id: this.sessionId
        });
      } catch (error) {
        console.warn('Analytics logging failed:', error);
      }
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 Launch Metric: ${event}`, metadata);
    }

    // Immediate sending for critical events
    if (immediate) {
      this.flushMetrics();
    }
  }

  // === BATCH METRIC REPORTING ===
  
  private flushMetrics(): void {
    if (this.metrics.length === 0) return;

    // Send metrics to custom endpoint for detailed analysis
    if (typeof fetch !== 'undefined') {
      fetch('/api/launch-metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          metrics: this.metrics,
          timestamp: Date.now()
        })
      }).catch(error => {
        console.warn('Failed to send launch metrics:', error);
      });
    }

    // Clear sent metrics
    this.metrics = [];
  }

  // === REAL-TIME DASHBOARD DATA ===
  
  public getLaunchSummary() {
    const summary = {
      sessionId: this.sessionId,
      startTime: this.startTime,
      duration: Date.now() - this.startTime,
      totalMetrics: this.metrics.length,
      trafficSource: this.metrics.find(m => m.event === 'traffic_source_identified')?.metadata,
      performanceRating: this.calculateOverallPerformance(),
      conversionProgress: this.calculateConversionProgress(),
      errorCount: this.metrics.filter(m => m.event.includes('error')).length
    };

    return summary;
  }

  private calculateOverallPerformance(): string {
    const performanceMetrics = this.metrics.filter(m => m.event === 'core_web_vitals');
    if (performanceMetrics.length === 0) return 'measuring';

    const ratings = performanceMetrics.map(m => m.metadata?.rating);
    const poorCount = ratings.filter(r => r === 'poor').length;
    const goodCount = ratings.filter(r => r === 'good').length;

    if (poorCount > goodCount) return 'poor';
    if (goodCount > poorCount) return 'good';
    return 'needs-improvement';
  }

  private calculateConversionProgress(): number {
    const conversionMetrics = this.metrics.filter(m => m.event === 'conversion_funnel');
    if (conversionMetrics.length === 0) return 0;

    const maxStep = Math.max(...conversionMetrics.map(m => m.metadata?.step || 0));
    return Math.round((maxStep / 8) * 100); // 8 total conversion steps
  }
}

// Global launch monitoring instance
export const launchMonitor = typeof window !== 'undefined' ? new LaunchMonitor() : null;

// Convenience functions for common tracking
export const trackReviewPlatformVisit = (platform: string, source?: string) => {
  launchMonitor?.logLaunchMetric('review_platform_visit', { platform, source });
};

export const trackFeatureEngagement = (feature: string, context?: string) => {
  launchMonitor?.logLaunchMetric('feature_engagement', { feature, context });
  (window as any).alchm_trackConversion?.('feature_engagement', { feature });
};

export const trackCrisisIntervention = (level: 'low' | 'moderate' | 'high') => {
  launchMonitor?.trackCrisisEngagement(level, 'automated_detection');
};

export const trackConversionEvent = (event: string, metadata?: Record<string, any>) => {
  (window as any).alchm_trackConversion?.(event, metadata);
};

// Export for external usage
if (typeof window !== 'undefined') {
  (window as any).alchm_launchMonitor = launchMonitor;
}