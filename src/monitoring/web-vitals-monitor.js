// ALCHM Core Web Vitals Monitor
// Generated: 2025-09-16T16:44:58.292Z

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

class ALCHMWebVitalsMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      CLS: 0.1,
      FID: 100,
      FCP: 1200,
      LCP: 2000,
      TTFB: 600
    };
    
    this.init();
  }

  init() {
    // Monitor Core Web Vitals
    getCLS(this.handleMetric.bind(this, 'CLS'));
    getFID(this.handleMetric.bind(this, 'FID'));
    getFCP(this.handleMetric.bind(this, 'FCP'));
    getLCP(this.handleMetric.bind(this, 'LCP'));
    getTTFB(this.handleMetric.bind(this, 'TTFB'));
    
    // Crisis-specific monitoring
    this.monitorCrisisPerformance();
    
    // Mobile-specific monitoring
    this.monitorMobilePerformance();
  }

  handleMetric(name, metric) {
    this.metrics.set(name, metric);
    
    // Check thresholds
    const threshold = this.thresholds[name];
    const value = metric.value;
    
    if (value > threshold) {
      this.reportPerformanceIssue(name, value, threshold);
    }
    
    // Send to analytics (Firebase Analytics or custom endpoint)
    this.sendToAnalytics(name, metric);
  }

  monitorCrisisPerformance() {
    // Monitor crisis component load times
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('crisis') || entry.name.includes('emergency')) {
          const loadTime = entry.loadEventEnd - entry.loadEventStart;
          
          if (loadTime > 1000) {
            this.reportCrisisSlowLoad(entry.name, loadTime);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation', 'resource'] });
  }

  monitorMobilePerformance() {
    // Enhanced mobile monitoring
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
        // Adjust monitoring thresholds for slow connections
        this.thresholds.LCP = 3000;
        this.thresholds.FCP = 2000;
      }
    }
  }

  reportPerformanceIssue(metric, value, threshold) {
    const issue = {
      timestamp: new Date().toISOString(),
      metric,
      value,
      threshold,
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: navigator.connection?.effectiveType || 'unknown'
    };
    
    console.warn('🚨 Performance threshold exceeded:', issue);
    
    // Send to monitoring service
    this.sendAlert('performance_threshold_exceeded', issue);
  }

  reportCrisisSlowLoad(resource, loadTime) {
    const alert = {
      timestamp: new Date().toISOString(),
      type: 'crisis_slow_load',
      resource,
      loadTime,
      critical: true,
      url: window.location.href
    };
    
    console.error('🚨 CRITICAL: Crisis resource slow load:', alert);
    
    // Immediate alert for crisis performance issues
    this.sendAlert('crisis_performance_critical', alert);
  }

  sendToAnalytics(name, metric) {
    // Send to Firebase Analytics or custom analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vital', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(metric.value),
        custom_map: {
          metric_id: metric.id,
          metric_delta: metric.delta
        }
      });
    }
  }

  sendAlert(type, data) {
    // Send to alerting system (could be Firebase Functions, webhook, etc.)
    fetch('/api/monitoring/alert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data })
    }).catch(error => {
      console.error('Failed to send monitoring alert:', error);
    });
  }
}

// Initialize monitoring
if (typeof window !== 'undefined') {
  new ALCHMWebVitalsMonitor();
}

export default ALCHMWebVitalsMonitor;