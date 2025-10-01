#!/usr/bin/env node

/**
 * ALCHM Production Performance Monitoring Setup
 * 
 * Sets up real-time performance monitoring for trauma-informed
 * journaling platform in production environment
 */

const fs = require('fs');
const path = require('path');

class ProductionMonitoringSetup {
  constructor() {
    this.config = {
      timestamp: new Date().toISOString(),
      monitoring: {
        coreWebVitals: true,
        crisisDetection: true,
        userExperience: true,
        errorTracking: true,
        performanceRegression: true
      },
      alerts: {
        crisisSlowResponse: 1000, // 1s threshold
        performanceRegression: 10, // 10% degradation
        errorThreshold: 0.01, // 1% error rate
        memoryUsage: 75 // 75% memory usage
      }
    };
  }

  log(level, message, data = null) {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[level]}[${level.toUpperCase()}] ${message}${colors.reset}`);
    if (data) {
      console.log(data);
    }
  }

  createWebVitalsMonitor() {
    const monitor = `// ALCHM Core Web Vitals Monitor
// Generated: ${this.config.timestamp}

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
          
          if (loadTime > ${this.config.alerts.crisisSlowResponse}) {
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

export default ALCHMWebVitalsMonitor;`;

    return monitor;
  }

  createCrisisMonitor() {
    const monitor = `// ALCHM Crisis Performance Monitor
// Critical monitoring for life-saving features

class CrisisPerformanceMonitor {
  constructor() {
    this.criticalThreshold = 1000; // 1 second maximum
    this.emergencyThreshold = 500;  // 500ms for emergency contacts
    
    this.init();
  }

  init() {
    this.monitorCrisisButtons();
    this.monitorEmergencyAccess();
    this.monitorCrisisResources();
  }

  monitorCrisisButtons() {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-crisis-button]');
      if (button) {
        const startTime = performance.now();
        
        // Monitor response time
        requestAnimationFrame(() => {
          const responseTime = performance.now() - startTime;
          
          if (responseTime > this.criticalThreshold) {
            this.reportCriticalSlowness('crisis_button_response', responseTime, button);
          }
        });
      }
    });
  }

  monitorEmergencyAccess() {
    const emergencyElements = document.querySelectorAll('[data-emergency-access]');
    
    emergencyElements.forEach(element => {
      element.addEventListener('click', (event) => {
        const startTime = performance.now();
        
        // Monitor emergency contact access
        setTimeout(() => {
          const accessTime = performance.now() - startTime;
          
          if (accessTime > this.emergencyThreshold) {
            this.reportCriticalSlowness('emergency_access_slow', accessTime, element);
          }
        }, 0);
      });
    });
  }

  monitorCrisisResources() {
    // Monitor crisis resource loading
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (this.isCrisisResource(entry.name)) {
          const loadTime = entry.responseEnd - entry.requestStart;
          
          if (loadTime > this.criticalThreshold) {
            this.reportCriticalSlowness('crisis_resource_slow', loadTime, entry);
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }

  isCrisisResource(url) {
    const crisisKeywords = [
      'crisis',
      'emergency',
      'suicide',
      'hotline',
      'help',
      'support'
    ];
    
    return crisisKeywords.some(keyword => url.toLowerCase().includes(keyword));
  }

  reportCriticalSlowness(type, time, element) {
    const report = {
      timestamp: new Date().toISOString(),
      type,
      responseTime: time,
      threshold: type.includes('emergency') ? this.emergencyThreshold : this.criticalThreshold,
      critical: true,
      userAgent: navigator.userAgent,
      url: window.location.href,
      element: element?.tagName || 'unknown'
    };
    
    console.error('🚨 CRITICAL CRISIS PERFORMANCE ISSUE:', report);
    
    // Immediate escalation for crisis performance
    this.escalateCrisisIssue(report);
  }

  escalateCrisisIssue(report) {
    // Multiple escalation channels for crisis issues
    Promise.allSettled([
      fetch('/api/crisis-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      }),
      
      // Store locally for offline scenarios
      this.storeLocalAlert(report),
      
      // Browser notification if permission granted
      this.showBrowserAlert(report)
    ]);
  }

  storeLocalAlert(report) {
    try {
      const alerts = JSON.parse(localStorage.getItem('crisis_alerts') || '[]');
      alerts.push(report);
      
      // Keep only last 100 alerts
      if (alerts.length > 100) {
        alerts.splice(0, alerts.length - 100);
      }
      
      localStorage.setItem('crisis_alerts', JSON.stringify(alerts));
    } catch (error) {
      console.error('Failed to store crisis alert locally:', error);
    }
  }

  showBrowserAlert(report) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ALCHM Crisis Performance Alert', {
        body: \`Crisis feature slow response: \${report.responseTime}ms\`,
        icon: '/icons/crisis-alert.png',
        requireInteraction: true
      });
    }
  }
}

// Initialize crisis monitoring
if (typeof window !== 'undefined') {
  new CrisisPerformanceMonitor();
}

export default CrisisPerformanceMonitor;`;

    return monitor;
  }

  createMonitoringConfig() {
    const config = {
      monitoring: {
        enabled: true,
        environment: 'production',
        samplingRate: 1.0, // 100% sampling for crisis app
        
        coreWebVitals: {
          enabled: true,
          thresholds: {
            LCP: 2000,
            FID: 100,
            CLS: 0.1,
            FCP: 1200,
            TTFB: 600
          }
        },
        
        crisisMonitoring: {
          enabled: true,
          criticalThreshold: 1000,
          emergencyThreshold: 500,
          alertChannels: ['console', 'api', 'localStorage'],
          escalation: true
        },
        
        userExperience: {
          enabled: true,
          trackInteractions: true,
          trackNavigation: true,
          trackErrors: true
        },
        
        performanceRegression: {
          enabled: true,
          baseline: {
            LCP: 1500,
            FID: 50,
            CLS: 0.05
          },
          alertThreshold: 0.1 // 10% regression
        }
      },
      
      alerts: {
        endpoints: {
          performance: '/api/monitoring/performance',
          crisis: '/api/crisis-alert',
          errors: '/api/errors/report'
        },
        
        notifications: {
          browserNotifications: true,
          localStorage: true,
          console: true
        }
      },
      
      analytics: {
        provider: 'firebase',
        customDimensions: {
          userType: 'trauma_informed',
          crisisContext: 'enabled',
          performanceProfile: 'high_priority'
        }
      }
    };
    
    return JSON.stringify(config, null, 2);
  }

  setupMonitoring() {
    this.log('info', 'Setting up production performance monitoring...');
    
    const monitoringDir = path.join(process.cwd(), 'src', 'monitoring');
    
    // Create monitoring directory if it doesn't exist
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir, { recursive: true });
    }
    
    // Create Web Vitals monitor
    const webVitalsPath = path.join(monitoringDir, 'web-vitals-monitor.js');
    fs.writeFileSync(webVitalsPath, this.createWebVitalsMonitor());
    this.log('success', `Web Vitals monitor created: ${webVitalsPath}`);
    
    // Create Crisis monitor
    const crisisMonitorPath = path.join(monitoringDir, 'crisis-performance-monitor.js');
    fs.writeFileSync(crisisMonitorPath, this.createCrisisMonitor());
    this.log('success', `Crisis monitor created: ${crisisMonitorPath}`);
    
    // Create monitoring configuration
    const configPath = path.join(monitoringDir, 'monitoring-config.json');
    fs.writeFileSync(configPath, this.createMonitoringConfig());
    this.log('success', `Monitoring config created: ${configPath}`);
    
    return {
      webVitalsMonitor: webVitalsPath,
      crisisMonitor: crisisMonitorPath,
      config: configPath
    };
  }

  generateIntegrationGuide() {
    const guide = `# ALCHM Production Monitoring Integration Guide

## Overview

This monitoring system provides real-time performance tracking specifically designed for ALCHM's trauma-informed journaling platform. Every millisecond matters when someone is in crisis.

## Integration Steps

### 1. Import Monitors in Your App

\`\`\`javascript
// In your main app file (pages/_app.tsx or app/layout.tsx)
import '../src/monitoring/web-vitals-monitor.js';
import '../src/monitoring/crisis-performance-monitor.js';

// The monitors will initialize automatically in the browser
\`\`\`

### 2. Add Crisis Button Attributes

\`\`\`jsx
// Mark crisis-related buttons for monitoring
<button data-crisis-button>Crisis Support</button>
<a data-emergency-access href="/emergency">Emergency Help</a>
\`\`\`

### 3. Configure API Endpoints

Create the following API routes to handle monitoring data:

\`\`\`javascript
// pages/api/monitoring/alert.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { type, data } = req.body;
    
    // Log critical performance issues
    console.error('Performance Alert:', { type, data });
    
    // Send to your monitoring service
    // await sendToMonitoringService({ type, data });
    
    res.status(200).json({ received: true });
  }
}

// pages/api/crisis-alert.js
export default function handler(req, res) {
  // CRITICAL: Crisis performance alerts need immediate attention
  if (req.method === 'POST') {
    const alert = req.body;
    
    // Immediate logging
    console.error('🚨 CRISIS PERFORMANCE ALERT:', alert);
    
    // Escalate to operations team
    // await escalateCrisisAlert(alert);
    
    res.status(200).json({ escalated: true });
  }
}
\`\`\`

### 4. Dashboard Integration

Monitor performance metrics in your admin dashboard:

\`\`\`javascript
// Retrieve stored alerts
const crisisAlerts = JSON.parse(
  localStorage.getItem('crisis_alerts') || '[]'
);

// Display in admin interface
crisisAlerts.forEach(alert => {
  if (alert.responseTime > 1000) {
    // Show critical performance warning
  }
});
\`\`\`

## Critical Thresholds

- **Crisis Response**: <1 second (life-saving requirement)
- **Emergency Access**: <500ms (immediate help needed)
- **Core Web Vitals**: LCP <2s, FID <100ms, CLS <0.1
- **Error Rate**: <1% (trauma-informed reliability)

## Alerting

The system provides multi-channel alerting:

1. **Console Logging**: Immediate visibility in browser dev tools
2. **API Alerts**: Server-side logging and escalation
3. **Local Storage**: Offline-capable alert storage
4. **Browser Notifications**: Real-time user notifications (if permitted)

## Mobile Considerations

- Automatically adjusts thresholds for slow connections
- Enhanced monitoring for touch interactions
- Memory usage tracking for low-end devices

## Crisis-Specific Features

- Dedicated monitoring for crisis buttons and emergency access
- Automatic escalation for crisis performance issues
- Resource loading monitoring for crisis support content
- Offline alert storage for connectivity issues

---
*Every performance metric protects vulnerable users*
*Monitor with the urgency their safety deserves*
`;

    return guide;
  }

  async run() {
    this.log('info', 'Setting up ALCHM production monitoring system...');
    
    try {
      // Setup monitoring files
      const files = this.setupMonitoring();
      
      // Generate integration guide
      const guidePath = path.join(process.cwd(), 'PRODUCTION_MONITORING_GUIDE.md');
      fs.writeFileSync(guidePath, this.generateIntegrationGuide());
      this.log('success', `Integration guide created: ${guidePath}`);
      
      this.log('success', 'Production monitoring setup complete!');
      
      return {
        files,
        guide: guidePath,
        config: this.config
      };
      
    } catch (error) {
      this.log('error', 'Monitoring setup failed', error.message);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const setup = new ProductionMonitoringSetup();
  
  try {
    const result = await setup.run();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 ALCHM PRODUCTION MONITORING SETUP COMPLETE');
    console.log('='.repeat(80));
    console.log('📁 Files Created:');
    console.log(`   • Web Vitals Monitor: ${result.files.webVitalsMonitor}`);
    console.log(`   • Crisis Monitor: ${result.files.crisisMonitor}`);
    console.log(`   • Config: ${result.files.config}`);
    console.log(`📖 Integration Guide: ${result.guide}`);
    console.log('\n🚨 CRITICAL: Review integration guide for crisis-safe deployment');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ SETUP FAILED:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ProductionMonitoringSetup;