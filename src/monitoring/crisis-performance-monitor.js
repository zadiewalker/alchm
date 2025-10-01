// ALCHM Crisis Performance Monitor
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
        body: `Crisis feature slow response: ${report.responseTime}ms`,
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

export default CrisisPerformanceMonitor;