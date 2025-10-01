/**
 * MOBILE TRAUMA-INFORMED PERFORMANCE MONITOR
 * Real-time performance monitoring specifically for vulnerable users
 * Tracks metrics that could impact crisis accessibility
 */

interface TraumaInformedMetrics {
  // Core Web Vitals with trauma context
  lcp: number | null; // Critical for crisis access time
  fid: number | null; // Important for trembling hands/motor issues
  cls: number | null; // Critical - layout shifts cause anxiety
  
  // Trauma-specific metrics
  touchTargetCompliance: boolean; // 60px minimum for crisis access
  loadingFeedbackPresent: boolean; // Gentle feedback during loading
  offlineCapability: boolean; // Can function without network
  crisisResourcesAccessible: boolean; // Emergency resources work offline
  
  // Mobile-specific metrics
  deviceMemory: number | null;
  connectionType: string | null;
  batteryLevel: number | null; // Critical for long journaling sessions
  
  // User experience metrics
  authCompleteTime: number | null; // Time from click to dashboard
  errorRecoveryTime: number | null; // Time to recover from errors
  stressIndicators: number; // Failed touches, rapid interactions
  
  timestamp: number;
  userAgent: string;
  viewport: { width: number; height: number };
}

interface PerformanceAlert {
  severity: 'critical' | 'warning' | 'info';
  metric: string;
  value: number;
  threshold: number;
  impact: string;
  recommendation: string;
  traumaContext: string;
}

export class MobileTraumaPerformanceMonitor {
  private static instance: MobileTraumaPerformanceMonitor | null = null;
  private metrics: Partial<TraumaInformedMetrics> = {};
  private observers: PerformanceObserver[] = [];
  private touchEventLogger: TouchEventLogger;
  private isMonitoring = false;

  private constructor() {
    this.touchEventLogger = new TouchEventLogger();
    if (typeof window !== 'undefined') {
      this.initialize();
    }
  }

  static getInstance(): MobileTraumaPerformanceMonitor {
    if (!this.instance) {
      this.instance = new MobileTraumaPerformanceMonitor();
    }
    return this.instance;
  }

  private initialize(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    console.log('📱 Starting Mobile Trauma-Informed Performance Monitoring...');

    // Initialize basic metrics
    this.metrics = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    // Start monitoring core web vitals
    this.monitorCoreWebVitals();
    
    // Monitor trauma-specific metrics
    this.monitorTraumaSpecificMetrics();
    
    // Monitor mobile-specific metrics
    this.monitorMobileMetrics();
    
    // Monitor user experience metrics
    this.monitorUserExperienceMetrics();

    // Start touch event monitoring for stress indicators
    this.touchEventLogger.start();
  }

  private monitorCoreWebVitals(): void {
    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ onLCP, onFID, onCLS }) => {
      // LCP monitoring - critical for crisis access
      onLCP((metric) => {
        this.metrics.lcp = metric.value;
        this.checkPerformanceThreshold('LCP', metric.value, 2000, 'Crisis access time');
      });

      // FID monitoring - important for motor difficulties
      onFID((metric) => {
        this.metrics.fid = metric.value;
        this.checkPerformanceThreshold('FID', metric.value, 100, 'Touch responsiveness');
      });

      // CLS monitoring - critical for anxiety prevention
      onCLS((metric) => {
        this.metrics.cls = metric.value;
        this.checkPerformanceThreshold('CLS', metric.value, 0.1, 'Visual stability');
      });
    });
  }

  private monitorTraumaSpecificMetrics(): void {
    // Check touch target compliance
    this.checkTouchTargetCompliance();
    
    // Check loading feedback presence
    this.checkLoadingFeedbackPresence();
    
    // Check offline capability
    this.checkOfflineCapability();
    
    // Check crisis resources accessibility
    this.checkCrisisResourcesAccessibility();
  }

  private checkTouchTargetCompliance(): void {
    const buttons = document.querySelectorAll('button, a[role="button"], input[type="submit"]');
    let compliant = true;

    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      if (rect.height < 60 || rect.width < 60) {
        compliant = false;
        console.warn(`⚠️ Touch target too small for crisis access: ${rect.width}x${rect.height}px`, button);
      }
    });

    this.metrics.touchTargetCompliance = compliant;
    
    if (!compliant) {
      this.createAlert('warning', 'Touch Target Compliance', 0, 60, 
        'Small touch targets may prevent access during emotional distress',
        'Increase button sizes to minimum 60x60px',
        'Users experiencing panic attacks or trembling hands need larger touch targets'
      );
    }
  }

  private checkLoadingFeedbackPresence(): void {
    const loadingElements = document.querySelectorAll(
      '[aria-label*="loading"], [aria-label*="Loading"], .loading, .spinner, [data-loading]'
    );
    
    this.metrics.loadingFeedbackPresent = loadingElements.length > 0;
    
    if (!this.metrics.loadingFeedbackPresent) {
      this.createAlert('warning', 'Loading Feedback', 0, 1,
        'No loading indicators found - users may think app is broken',
        'Add gentle loading feedback like "Connecting safely..."',
        'Users in crisis need reassurance that the system is working'
      );
    }
  }

  private checkOfflineCapability(): void {
    this.metrics.offlineCapability = 'serviceWorker' in navigator;
    
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        const hasOfflineCapability = registrations.length > 0;
        this.metrics.offlineCapability = hasOfflineCapability;
        
        if (!hasOfflineCapability) {
          this.createAlert('critical', 'Offline Capability', 0, 1,
            'No offline capability - app fails during network issues',
            'Implement service worker with offline authentication queue',
            'Users in crisis may have unstable connections and need offline access'
          );
        }
      });
    }
  }

  private checkCrisisResourcesAccessibility(): void {
    const crisisElements = document.querySelectorAll(
      '[href*="988"], [href*="crisis"], [href*="emergency"], [aria-label*="crisis"]'
    );
    
    this.metrics.crisisResourcesAccessible = crisisElements.length > 0;
    
    if (crisisElements.length === 0) {
      this.createAlert('critical', 'Crisis Resources', 0, 1,
        'No crisis resources found on this page',
        'Add prominent crisis support links (988 Lifeline, etc.)',
        'Users in emotional distress need immediate access to crisis resources'
      );
    }
  }

  private monitorMobileMetrics(): void {
    // Device memory
    if ('deviceMemory' in navigator) {
      this.metrics.deviceMemory = (navigator as any).deviceMemory;
    }

    // Connection type
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.metrics.connectionType = connection?.effectiveType || null;
    }

    // Battery level (if available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.metrics.batteryLevel = battery.level * 100;
        
        if (battery.level < 0.2) {
          this.createAlert('warning', 'Battery Level', battery.level * 100, 20,
            'Low battery may affect extended journaling sessions',
            'Optimize for battery efficiency during crisis use',
            'Users in crisis may have extended sessions - preserve battery'
          );
        }
      });
    }
  }

  private monitorUserExperienceMetrics(): void {
    // Auth completion time tracking
    const authStartTime = Date.now();
    
    // Listen for auth completion
    window.addEventListener('authComplete', () => {
      this.metrics.authCompleteTime = Date.now() - authStartTime;
      this.checkPerformanceThreshold('Auth Complete Time', this.metrics.authCompleteTime, 5000, 'Crisis access speed');
    });

    // Error recovery time tracking
    window.addEventListener('authError', () => {
      const errorStartTime = Date.now();
      
      const errorRecoveryListener = () => {
        this.metrics.errorRecoveryTime = Date.now() - errorStartTime;
        window.removeEventListener('authComplete', errorRecoveryListener);
      };
      
      window.addEventListener('authComplete', errorRecoveryListener);
    });

    // Monitor viewport changes (device rotation, keyboard)
    window.addEventListener('resize', () => {
      this.metrics.viewport = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
  }

  private checkPerformanceThreshold(
    metric: string, 
    value: number, 
    threshold: number, 
    context: string
  ): void {
    if (value > threshold) {
      const severity = value > threshold * 2 ? 'critical' : 'warning';
      this.createAlert(severity, metric, value, threshold,
        `${context} is slower than recommended for vulnerable users`,
        this.getRecommendation(metric),
        this.getTraumaContext(metric)
      );
    }
  }

  private createAlert(
    severity: 'critical' | 'warning' | 'info',
    metric: string,
    value: number,
    threshold: number,
    impact: string,
    recommendation: string,
    traumaContext: string
  ): void {
    const alert: PerformanceAlert = {
      severity,
      metric,
      value,
      threshold,
      impact,
      recommendation,
      traumaContext
    };

    console.log(`🚨 ${severity.toUpperCase()} Performance Alert:`, alert);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendAlertToMonitoring(alert);
    }
  }

  private getRecommendation(metric: string): string {
    const recommendations: Record<string, string> = {
      'LCP': 'Preload critical resources, optimize images, reduce server response time',
      'FID': 'Minimize JavaScript execution time, use requestIdleCallback for non-essential work',
      'CLS': 'Reserve space for dynamic content, use transform instead of changing layout properties',
      'Auth Complete Time': 'Optimize authentication flow, implement progressive loading',
      'Crisis access time': 'Prioritize crisis resources loading over aesthetic elements'
    };
    
    return recommendations[metric] || 'Optimize resource loading and reduce complexity';
  }

  private getTraumaContext(metric: string): string {
    const contexts: Record<string, string> = {
      'LCP': 'Users in crisis need immediate access - every second delay increases abandonment risk',
      'FID': 'Motor difficulties from emotional distress require highly responsive interactions',
      'CLS': 'Unexpected layout shifts increase anxiety and confusion during vulnerable moments',
      'Auth Complete Time': 'Delayed access to support platform can escalate crisis situations',
      'Crisis access time': 'Emergency resource access must be instantaneous during mental health crises'
    };
    
    return contexts[metric] || 'Performance impacts vulnerable users disproportionately';
  }

  private async sendAlertToMonitoring(alert: PerformanceAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/performance-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert,
          metrics: this.metrics,
          timestamp: Date.now(),
          url: window.location.href
        })
      });
    } catch (error) {
      console.warn('Failed to send performance alert:', error);
    }
  }

  // Public API for getting current metrics
  getMetrics(): Partial<TraumaInformedMetrics> {
    return { ...this.metrics };
  }

  // Get stress indicators from touch events
  getStressIndicators(): number {
    return this.touchEventLogger.getStressScore();
  }

  // Generate trauma-informed performance report
  generateReport(): string {
    const metrics = this.getMetrics();
    const stressScore = this.getStressIndicators();
    
    let report = '📱 Mobile Trauma-Informed Performance Report\n';
    report += '=' .repeat(50) + '\n\n';

    // Core Web Vitals
    report += '🎯 Core Web Vitals (Trauma Context):\n';
    report += `LCP: ${metrics.lcp?.toFixed(0) || 'N/A'}ms (Crisis Access: ${this.getStatus(metrics.lcp, 2000)})\n`;
    report += `FID: ${metrics.fid?.toFixed(0) || 'N/A'}ms (Touch Responsiveness: ${this.getStatus(metrics.fid, 100)})\n`;
    report += `CLS: ${metrics.cls?.toFixed(3) || 'N/A'} (Visual Stability: ${this.getStatus(metrics.cls, 0.1)})\n\n`;

    // Trauma-specific metrics
    report += '🛡️ Trauma-Informed Accessibility:\n';
    report += `Touch Target Compliance: ${metrics.touchTargetCompliance ? '✅' : '❌'}\n`;
    report += `Loading Feedback Present: ${metrics.loadingFeedbackPresent ? '✅' : '❌'}\n`;
    report += `Offline Capability: ${metrics.offlineCapability ? '✅' : '❌'}\n`;
    report += `Crisis Resources Accessible: ${metrics.crisisResourcesAccessible ? '✅' : '❌'}\n\n`;

    // User stress indicators
    report += '😰 Stress Indicators:\n';
    report += `Interaction Stress Score: ${stressScore}/10\n`;
    report += `Device Memory: ${metrics.deviceMemory || 'Unknown'}GB\n`;
    report += `Connection: ${metrics.connectionType || 'Unknown'}\n`;
    report += `Battery Level: ${metrics.batteryLevel?.toFixed(0) || 'Unknown'}%\n\n`;

    // Performance summary
    const overallScore = this.calculateOverallScore();
    report += `🏆 Overall Crisis Accessibility Score: ${overallScore}/100\n`;

    return report;
  }

  private getStatus(value: number | null | undefined, threshold: number): string {
    if (!value) return 'Unknown';
    return value <= threshold ? 'Good' : value <= threshold * 2 ? 'Needs Work' : 'Critical';
  }

  private calculateOverallScore(): number {
    let score = 100;
    
    // Deduct for poor Core Web Vitals
    if (this.metrics.lcp && this.metrics.lcp > 2000) score -= 20;
    if (this.metrics.fid && this.metrics.fid > 100) score -= 15;
    if (this.metrics.cls && this.metrics.cls > 0.1) score -= 15;
    
    // Deduct for trauma-specific issues
    if (!this.metrics.touchTargetCompliance) score -= 15;
    if (!this.metrics.loadingFeedbackPresent) score -= 10;
    if (!this.metrics.offlineCapability) score -= 20;
    if (!this.metrics.crisisResourcesAccessible) score -= 25;
    
    return Math.max(0, score);
  }
}

// Touch Event Logger for detecting stress indicators
class TouchEventLogger {
  private touchEvents: TouchEvent[] = [];
  private rapidTouchCount = 0;
  private failedTouchCount = 0;

  start(): void {
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(event: TouchEvent): void {
    this.touchEvents.push(event);
    
    // Detect rapid touches (stress indicator)
    const recentTouches = this.touchEvents.filter(
      touch => Date.now() - touch.timeStamp < 1000
    );
    
    if (recentTouches.length > 3) {
      this.rapidTouchCount++;
    }

    // Clean old events
    if (this.touchEvents.length > 100) {
      this.touchEvents = this.touchEvents.slice(-50);
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    // Detect failed touches (touches that don't result in action)
    setTimeout(() => {
      // Simple heuristic: if no navigation or state change occurred
      if (window.location.href === window.location.href) {
        this.failedTouchCount++;
      }
    }, 100);
  }

  getStressScore(): number {
    // Calculate stress score based on interaction patterns
    const rapidTouchScore = Math.min(this.rapidTouchCount * 2, 5);
    const failedTouchScore = Math.min(this.failedTouchCount, 5);
    
    return rapidTouchScore + failedTouchScore;
  }
}

// Initialize monitoring on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    MobileTraumaPerformanceMonitor.getInstance();
  });
}

export default MobileTraumaPerformanceMonitor;