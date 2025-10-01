/**
 * CRISIS REAL USER MONITORING (RUM) SYSTEM
 * 
 * Specialized monitoring for users in crisis situations with trauma-informed thresholds
 * Tracks actual user experience data with immediate alerting for performance issues
 */

interface CrisisRUMMetrics {
  sessionId: string;
  userId?: string;
  timestamp: number;
  
  // Core Web Vitals
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
  
  // Crisis-specific metrics
  crisisButtonResponseTime: number | null;
  emergencyResourceLoadTime: number | null;
  journalSaveTime: number | null;
  authenticationTime: number | null;
  
  // User context
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connectionType: string;
  batteryLevel: number | null;
  isInCrisisMode: boolean;
  
  // Performance degradation indicators
  memoryPressure: 'low' | 'medium' | 'high';
  networkQuality: 'excellent' | 'good' | 'poor' | 'offline';
  
  // User engagement metrics
  timeToFirstInteraction: number | null;
  totalSessionTime: number;
  pageViews: number;
  
  // Error tracking
  jsErrors: number;
  networkErrors: number;
  
  // Geographic and demographic context
  timezone: string;
  language: string;
  
  // Trauma-informed metrics
  reducedMotionEnabled: boolean;
  highContrastEnabled: boolean;
  screenReaderDetected: boolean;
}

interface CrisisAlert {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'performance' | 'accessibility' | 'crisis-safety' | 'offline';
  metric: string;
  value: number;
  threshold: number;
  sessionId: string;
  timestamp: number;
  userContext: {
    deviceType: string;
    connectionType: string;
    isInCrisisMode: boolean;
    batteryLevel: number | null;
  };
}

// Crisis-optimized performance thresholds
const CRISIS_THRESHOLDS = {
  // Core Web Vitals - stricter for crisis users
  FCP_CRITICAL: 800,   // <800ms for users in distress
  FCP_WARNING: 1200,   // <1.2s standard crisis threshold
  
  LCP_CRITICAL: 1500,  // <1.5s for crisis content
  LCP_WARNING: 2000,   // <2.0s standard threshold
  
  FID_CRITICAL: 50,    // <50ms for immediate interaction
  FID_WARNING: 100,    // <100ms for crisis scenarios
  
  CLS_CRITICAL: 0.03,  // <0.03 to avoid triggering users
  CLS_WARNING: 0.05,   // <0.05 for stability
  
  TTI_CRITICAL: 2000,  // <2s for crisis functionality
  TTI_WARNING: 3000,   // <3s standard
  
  // Crisis-specific thresholds
  CRISIS_BUTTON_RESPONSE: 100,      // <100ms for emergency button
  EMERGENCY_RESOURCE_LOAD: 500,     // <500ms for crisis resources
  JOURNAL_SAVE_TIME: 1000,          // <1s for journal saves
  AUTH_TIME: 800,                   // <800ms for authentication
  
  // Network and device thresholds
  MEMORY_PRESSURE_HIGH: 0.85,       // 85% memory usage
  BATTERY_CRITICAL: 0.15,           // 15% battery remaining
  SLOW_CONNECTION_RTT: 200,         // >200ms RTT indicates slow connection
};

class CrisisRUMMonitor {
  private static instance: CrisisRUMMonitor | null = null;
  private sessionId: string;
  private metrics: CrisisRUMMetrics;
  private observers: PerformanceObserver[] = [];
  private alertQueue: CrisisAlert[] = [];
  private isMonitoring = false;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.metrics = this.initializeMetrics();
    
    if (typeof window !== 'undefined') {
      this.startMonitoring();
    }
  }

  static getInstance(): CrisisRUMMonitor {
    if (!this.instance) {
      this.instance = new CrisisRUMMonitor();
    }
    return this.instance;
  }

  private generateSessionId(): string {
    return `crisis_rum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMetrics(): CrisisRUMMetrics {
    return {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      
      // Core Web Vitals
      fcp: null,
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      tti: null,
      
      // Crisis-specific metrics
      crisisButtonResponseTime: null,
      emergencyResourceLoadTime: null,
      journalSaveTime: null,
      authenticationTime: null,
      
      // User context
      deviceType: this.detectDeviceType(),
      connectionType: this.getConnectionType(),
      batteryLevel: null,
      isInCrisisMode: false,
      
      // Performance indicators
      memoryPressure: 'low',
      networkQuality: 'good',
      
      // User engagement
      timeToFirstInteraction: null,
      totalSessionTime: 0,
      pageViews: 1,
      
      // Error tracking
      jsErrors: 0,
      networkErrors: 0,
      
      // Context
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      
      // Trauma-informed metrics
      reducedMotionEnabled: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      highContrastEnabled: window.matchMedia('(prefers-contrast: high)').matches,
      screenReaderDetected: this.detectScreenReader()
    };
  }

  private async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    console.log('🚨 Starting Crisis RUM Monitoring...', {
      sessionId: this.sessionId,
      deviceType: this.metrics.deviceType,
      connectionType: this.metrics.connectionType
    });

    // Initialize all monitoring systems
    await Promise.all([
      this.monitorCoreWebVitals(),
      this.monitorCrisisInteractions(),
      this.monitorDeviceContext(),
      this.monitorNetworkQuality(),
      this.monitorUserEngagement(),
      this.monitorErrors()
    ]);

    // Start periodic reporting
    this.startPeriodicReporting();

    // Monitor for crisis mode activation
    this.monitorCrisisMode();

    console.log('✅ Crisis RUM Monitoring Active');
  }

  private async monitorCoreWebVitals(): Promise<void> {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
        this.checkThreshold('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.checkThreshold('FID', this.metrics.fid);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.checkThreshold('CLS', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // First Contentful Paint & TTFB
      const paintObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.checkThreshold('FCP', entry.startTime);
          }
        });
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Navigation timing for TTFB and TTI
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[];
        entries.forEach((entry) => {
          this.metrics.ttfb = entry.responseStart - entry.requestStart;
          this.metrics.tti = entry.domInteractive - entry.navigationStart;
          
          this.checkThreshold('TTFB', this.metrics.ttfb);
          this.checkThreshold('TTI', this.metrics.tti);
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

    } catch (error) {
      console.warn('Failed to setup Core Web Vitals monitoring:', error);
    }
  }

  private async monitorCrisisInteractions(): Promise<void> {
    // Monitor 988 crisis button performance
    this.monitorCrisisButton();
    
    // Monitor emergency resource loading
    this.monitorEmergencyResources();
    
    // Monitor journal save performance
    this.monitorJournalSaves();
    
    // Monitor authentication performance
    this.monitorAuthentication();
  }

  private monitorCrisisButton(): void {
    // Use event delegation to monitor crisis button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (target.matches('[data-crisis-button], .crisis-button, [aria-label*="crisis"], [aria-label*="988"]')) {
        const startTime = performance.now();
        
        // Monitor how long crisis resources take to appear
        const checkCrisisResponse = () => {
          const crisisModal = document.querySelector('[data-crisis-modal], .crisis-modal');
          const crisisPanel = document.querySelector('[data-crisis-panel], .crisis-panel');
          
          if (crisisModal || crisisPanel) {
            const responseTime = performance.now() - startTime;
            this.metrics.crisisButtonResponseTime = responseTime;
            
            if (responseTime > CRISIS_THRESHOLDS.CRISIS_BUTTON_RESPONSE) {
              this.createAlert({
                severity: 'critical',
                type: 'crisis-safety',
                metric: 'crisis_button_response_time',
                value: responseTime,
                threshold: CRISIS_THRESHOLDS.CRISIS_BUTTON_RESPONSE,
                sessionId: this.sessionId,
                timestamp: Date.now(),
                userContext: this.getUserContext()
              });
            }
          } else if (performance.now() - startTime < 5000) {
            // Keep checking for up to 5 seconds
            setTimeout(checkCrisisResponse, 50);
          }
        };
        
        setTimeout(checkCrisisResponse, 0);
      }
    });
  }

  private monitorEmergencyResources(): void {
    // Monitor emergency resource loading performance
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      
      if (this.isCrisisResource(url)) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const loadTime = performance.now() - startTime;
          
          this.metrics.emergencyResourceLoadTime = loadTime;
          
          if (loadTime > CRISIS_THRESHOLDS.EMERGENCY_RESOURCE_LOAD) {
            this.createAlert({
              severity: 'critical',
              type: 'crisis-safety',
              metric: 'emergency_resource_load_time',
              value: loadTime,
              threshold: CRISIS_THRESHOLDS.EMERGENCY_RESOURCE_LOAD,
              sessionId: this.sessionId,
              timestamp: Date.now(),
              userContext: this.getUserContext()
            });
          }
          
          return response;
        } catch (error) {
          this.metrics.networkErrors++;
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
  }

  private isCrisisResource(url: string): boolean {
    const crisisPatterns = [
      '/crisis',
      '/emergency',
      '/support',
      '988',
      '/hotline',
      '/help'
    ];
    
    return crisisPatterns.some(pattern => url.includes(pattern));
  }

  private monitorJournalSaves(): void {
    // Monitor journal save performance
    const originalFetch = window.fetch;
    const enhancedFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      
      if (url.includes('/api/save') || url.includes('journal')) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const saveTime = performance.now() - startTime;
          
          this.metrics.journalSaveTime = saveTime;
          
          if (saveTime > CRISIS_THRESHOLDS.JOURNAL_SAVE_TIME) {
            this.createAlert({
              severity: 'high',
              type: 'performance',
              metric: 'journal_save_time',
              value: saveTime,
              threshold: CRISIS_THRESHOLDS.JOURNAL_SAVE_TIME,
              sessionId: this.sessionId,
              timestamp: Date.now(),
              userContext: this.getUserContext()
            });
          }
          
          return response;
        } catch (error) {
          this.metrics.networkErrors++;
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    if (window.fetch === originalFetch) {
      window.fetch = enhancedFetch;
    }
  }

  private monitorAuthentication(): void {
    // Monitor authentication performance
    const authUrls = ['/api/auth', '/auth/', 'firebase', 'session'];
    
    const originalFetch = window.fetch;
    const authFetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      
      if (authUrls.some(pattern => url.includes(pattern))) {
        const startTime = performance.now();
        
        try {
          const response = await originalFetch(...args);
          const authTime = performance.now() - startTime;
          
          this.metrics.authenticationTime = authTime;
          
          if (authTime > CRISIS_THRESHOLDS.AUTH_TIME) {
            this.createAlert({
              severity: 'medium',
              type: 'performance',
              metric: 'authentication_time',
              value: authTime,
              threshold: CRISIS_THRESHOLDS.AUTH_TIME,
              sessionId: this.sessionId,
              timestamp: Date.now(),
              userContext: this.getUserContext()
            });
          }
          
          return response;
        } catch (error) {
          this.metrics.networkErrors++;
          throw error;
        }
      }
      
      return originalFetch(...args);
    };

    if (window.fetch === originalFetch) {
      window.fetch = authFetch;
    }
  }

  private async monitorDeviceContext(): Promise<void> {
    // Monitor battery level
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.metrics.batteryLevel = battery.level;
        
        const updateBatteryStatus = () => {
          this.metrics.batteryLevel = battery.level;
          
          if (battery.level < CRISIS_THRESHOLDS.BATTERY_CRITICAL && !battery.charging) {
            this.createAlert({
              severity: 'high',
              type: 'crisis-safety',
              metric: 'battery_level',
              value: battery.level * 100,
              threshold: CRISIS_THRESHOLDS.BATTERY_CRITICAL * 100,
              sessionId: this.sessionId,
              timestamp: Date.now(),
              userContext: this.getUserContext()
            });
          }
        };

        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
      } catch (error) {
        console.warn('Battery API not available');
      }
    }

    // Monitor memory pressure
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        if (memoryUsage > CRISIS_THRESHOLDS.MEMORY_PRESSURE_HIGH) {
          this.metrics.memoryPressure = 'high';
          
          this.createAlert({
            severity: 'medium',
            type: 'performance',
            metric: 'memory_pressure',
            value: memoryUsage * 100,
            threshold: CRISIS_THRESHOLDS.MEMORY_PRESSURE_HIGH * 100,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            userContext: this.getUserContext()
          });
        } else if (memoryUsage > 0.7) {
          this.metrics.memoryPressure = 'medium';
        } else {
          this.metrics.memoryPressure = 'low';
        }
      };

      setInterval(checkMemory, 30000); // Check every 30 seconds
      checkMemory(); // Initial check
    }
  }

  private async monitorNetworkQuality(): Promise<void> {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      const updateNetworkQuality = () => {
        this.metrics.connectionType = connection.effectiveType || 'unknown';
        
        // Determine network quality
        if (connection.rtt > CRISIS_THRESHOLDS.SLOW_CONNECTION_RTT || 
            ['slow-2g', '2g'].includes(connection.effectiveType)) {
          this.metrics.networkQuality = 'poor';
        } else if (['3g'].includes(connection.effectiveType)) {
          this.metrics.networkQuality = 'good';
        } else {
          this.metrics.networkQuality = 'excellent';
        }
        
        // Alert on poor network conditions for crisis users
        if (this.metrics.networkQuality === 'poor' && this.metrics.isInCrisisMode) {
          this.createAlert({
            severity: 'high',
            type: 'crisis-safety',
            metric: 'network_quality',
            value: connection.rtt,
            threshold: CRISIS_THRESHOLDS.SLOW_CONNECTION_RTT,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            userContext: this.getUserContext()
          });
        }
      };

      connection.addEventListener('change', updateNetworkQuality);
      updateNetworkQuality(); // Initial check
    }

    // Monitor for offline status
    window.addEventListener('offline', () => {
      this.metrics.networkQuality = 'offline';
      
      this.createAlert({
        severity: 'critical',
        type: 'offline',
        metric: 'network_status',
        value: 0,
        threshold: 1,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userContext: this.getUserContext()
      });
    });

    window.addEventListener('online', () => {
      this.metrics.networkQuality = 'good';
    });
  }

  private monitorUserEngagement(): void {
    const sessionStartTime = performance.now();
    
    // Track time to first interaction
    const trackFirstInteraction = () => {
      if (this.metrics.timeToFirstInteraction === null) {
        this.metrics.timeToFirstInteraction = performance.now() - sessionStartTime;
      }
    };

    ['click', 'keydown', 'touchstart', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, trackFirstInteraction, { once: true });
    });

    // Track page views
    window.addEventListener('popstate', () => {
      this.metrics.pageViews++;
    });

    // Track total session time
    setInterval(() => {
      this.metrics.totalSessionTime = performance.now() - sessionStartTime;
    }, 10000); // Update every 10 seconds
  }

  private monitorErrors(): void {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.metrics.jsErrors++;
      
      // Critical error during crisis mode
      if (this.metrics.isInCrisisMode) {
        this.createAlert({
          severity: 'high',
          type: 'crisis-safety',
          metric: 'javascript_error',
          value: this.metrics.jsErrors,
          threshold: 1,
          sessionId: this.sessionId,
          timestamp: Date.now(),
          userContext: this.getUserContext()
        });
      }
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.jsErrors++;
    });
  }

  private monitorCrisisMode(): void {
    // Listen for crisis mode activation
    window.addEventListener('alchm:emergency-mode-activated', () => {
      this.metrics.isInCrisisMode = true;
      console.log('🚨 Crisis mode activated - RUM monitoring heightened');
    });

    // Monitor for crisis keywords in inputs
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && target.value) {
        const crisisKeywords = [
          'suicide', 'kill myself', 'end my life', 'want to die',
          'self harm', 'hurt myself', 'emergency', 'crisis'
        ];
        
        const text = target.value.toLowerCase();
        const hasCrisisKeyword = crisisKeywords.some(keyword => text.includes(keyword));
        
        if (hasCrisisKeyword && !this.metrics.isInCrisisMode) {
          this.metrics.isInCrisisMode = true;
          console.log('🆘 Crisis keywords detected - activating heightened monitoring');
        }
      }
    });
  }

  private checkThreshold(metric: string, value: number): void {
    const thresholds = this.getThresholdsForMetric(metric);
    if (!thresholds) return;

    let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
    let threshold = 0;

    if (value > thresholds.critical) {
      severity = 'critical';
      threshold = thresholds.critical;
    } else if (value > thresholds.warning) {
      severity = 'high';
      threshold = thresholds.warning;
    }

    if (severity !== 'low') {
      this.createAlert({
        severity,
        type: 'performance',
        metric: metric.toLowerCase(),
        value,
        threshold,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userContext: this.getUserContext()
      });
    }
  }

  private getThresholdsForMetric(metric: string): { critical: number; warning: number } | null {
    switch (metric) {
      case 'FCP':
        return { critical: CRISIS_THRESHOLDS.FCP_CRITICAL, warning: CRISIS_THRESHOLDS.FCP_WARNING };
      case 'LCP':
        return { critical: CRISIS_THRESHOLDS.LCP_CRITICAL, warning: CRISIS_THRESHOLDS.LCP_WARNING };
      case 'FID':
        return { critical: CRISIS_THRESHOLDS.FID_CRITICAL, warning: CRISIS_THRESHOLDS.FID_WARNING };
      case 'CLS':
        return { critical: CRISIS_THRESHOLDS.CLS_CRITICAL, warning: CRISIS_THRESHOLDS.CLS_WARNING };
      case 'TTI':
        return { critical: CRISIS_THRESHOLDS.TTI_CRITICAL, warning: CRISIS_THRESHOLDS.TTI_WARNING };
      default:
        return null;
    }
  }

  private createAlert(alert: CrisisAlert): void {
    this.alertQueue.push(alert);
    
    // Send critical alerts immediately
    if (alert.severity === 'critical') {
      this.sendImmediateAlert(alert);
    }
    
    // Keep alert queue manageable
    if (this.alertQueue.length > 100) {
      this.alertQueue = this.alertQueue.slice(-50);
    }
  }

  private async sendImmediateAlert(alert: CrisisAlert): Promise<void> {
    try {
      // In production, this would send to your monitoring service
      console.error('🚨 CRITICAL PERFORMANCE ALERT:', alert);
      
      await fetch('/api/monitoring/crisis-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alert,
          metrics: this.getCurrentMetrics()
        })
      });
    } catch (error) {
      console.warn('Failed to send crisis alert:', error);
    }
  }

  private startPeriodicReporting(): void {
    // Report metrics every 30 seconds
    setInterval(() => {
      this.reportMetrics();
    }, 30000);

    // Report on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.reportMetrics();
      }
    });

    // Report before page unload
    window.addEventListener('beforeunload', () => {
      this.reportMetrics();
    });
  }

  private async reportMetrics(): Promise<void> {
    const payload = {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.getCurrentMetrics(),
      alerts: this.alertQueue.filter(a => Date.now() - a.timestamp < 300000) // Last 5 minutes
    };

    try {
      if ('sendBeacon' in navigator) {
        navigator.sendBeacon('/api/monitoring/crisis-rum', JSON.stringify(payload));
      } else {
        await fetch('/api/monitoring/crisis-rum', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (error) {
      console.warn('Failed to report RUM metrics:', error);
    }
  }

  private getCurrentMetrics(): CrisisRUMMetrics {
    return { ...this.metrics };
  }

  private getUserContext() {
    return {
      deviceType: this.metrics.deviceType,
      connectionType: this.metrics.connectionType,
      isInCrisisMode: this.metrics.isInCrisisMode,
      batteryLevel: this.metrics.batteryLevel
    };
  }

  private detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/mobile|android|iphone/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getConnectionType(): string {
    if ('connection' in navigator) {
      return (navigator as any).connection.effectiveType || 'unknown';
    }
    return 'unknown';
  }

  private detectScreenReader(): boolean {
    return Boolean(
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver') ||
      window.speechSynthesis
    );
  }

  // Public API
  public getMetrics(): CrisisRUMMetrics {
    return this.getCurrentMetrics();
  }

  public getAlerts(severity?: 'critical' | 'high' | 'medium' | 'low'): CrisisAlert[] {
    if (severity) {
      return this.alertQueue.filter(a => a.severity === severity);
    }
    return [...this.alertQueue];
  }

  public markCrisisMode(): void {
    this.metrics.isInCrisisMode = true;
  }

  public generatePerformanceReport(): string {
    const metrics = this.getCurrentMetrics();
    const alerts = this.getAlerts();
    
    let report = '📊 Crisis RUM Performance Report\n';
    report += '=' .repeat(40) + '\n\n';
    
    report += `Session: ${this.sessionId}\n`;
    report += `Device: ${metrics.deviceType} | Connection: ${metrics.connectionType}\n`;
    report += `Crisis Mode: ${metrics.isInCrisisMode ? '🚨 ACTIVE' : '✅ INACTIVE'}\n`;
    report += `Battery: ${metrics.batteryLevel ? Math.round(metrics.batteryLevel * 100) + '%' : 'Unknown'}\n\n`;
    
    report += 'Core Web Vitals:\n';
    report += `• FCP: ${metrics.fcp ? Math.round(metrics.fcp) + 'ms' : 'Not measured'}\n`;
    report += `• LCP: ${metrics.lcp ? Math.round(metrics.lcp) + 'ms' : 'Not measured'}\n`;
    report += `• FID: ${metrics.fid ? Math.round(metrics.fid) + 'ms' : 'Not measured'}\n`;
    report += `• CLS: ${metrics.cls ? metrics.cls.toFixed(3) : 'Not measured'}\n`;
    report += `• TTI: ${metrics.tti ? Math.round(metrics.tti) + 'ms' : 'Not measured'}\n\n`;
    
    report += 'Crisis Metrics:\n';
    report += `• Crisis Button: ${metrics.crisisButtonResponseTime ? Math.round(metrics.crisisButtonResponseTime) + 'ms' : 'Not used'}\n`;
    report += `• Emergency Resources: ${metrics.emergencyResourceLoadTime ? Math.round(metrics.emergencyResourceLoadTime) + 'ms' : 'Not loaded'}\n`;
    report += `• Journal Save: ${metrics.journalSaveTime ? Math.round(metrics.journalSaveTime) + 'ms' : 'Not used'}\n\n`;
    
    const criticalAlerts = alerts.filter(a => a.severity === 'critical').length;
    const highAlerts = alerts.filter(a => a.severity === 'high').length;
    
    report += `Alerts: ${criticalAlerts} Critical, ${highAlerts} High\n`;
    
    return report;
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}

// Initialize global instance
export const crisisRUMMonitor = CrisisRUMMonitor.getInstance();

// React hook for RUM monitoring
export const useCrisisRUMMonitoring = () => {
  return {
    getMetrics: () => crisisRUMMonitor.getMetrics(),
    getAlerts: (severity?: 'critical' | 'high' | 'medium' | 'low') => crisisRUMMonitor.getAlerts(severity),
    markCrisisMode: () => crisisRUMMonitor.markCrisisMode(),
    generateReport: () => crisisRUMMonitor.generatePerformanceReport()
  };
};

// Export types
export type { CrisisRUMMetrics, CrisisAlert };

export default CrisisRUMMonitor;