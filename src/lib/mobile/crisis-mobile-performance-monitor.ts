/**
 * Crisis Mobile Performance Monitor
 * Real-time monitoring of mobile authentication performance for trauma survivors
 * 
 * This system tracks authentication success rates, performance metrics, and
 * error patterns specifically for mobile users in crisis situations.
 * 
 * MONITORING FOCUS AREAS:
 * - Authentication success/failure rates by device type
 * - Network condition impact on authentication
 * - Touch interaction response times
 * - Crisis-specific error patterns
 * - Battery and memory impact during auth flows
 */

interface MobileAuthMetrics {
  deviceInfo: {
    userAgent: string;
    platform: string;
    isIOS: boolean;
    isAndroid: boolean;
    browserName: string;
    screenWidth: number;
    screenHeight: number;
    pixelRatio: number;
    touchPoints: number;
    orientation: string;
  };
  networkInfo: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    isOnline: boolean;
    connectionType: string;
  };
  authPerformance: {
    startTime: number;
    endTime: number;
    duration: number;
    method: 'popup' | 'redirect' | 'failed';
    success: boolean;
    errorCode?: string;
    errorMessage?: string;
    retryCount: number;
  };
  crisisContext: {
    timeOfDay: string;
    dayOfWeek: string;
    isWeekend: boolean;
    timezone: string;
    batteryLevel?: number;
    memoryUsage?: number;
  };
  userExperience: {
    touchTargetSize: number;
    interactionDelay: number;
    visualFeedbackDelay: number;
    hapticFeedbackUsed: boolean;
    accessibilityFeaturesEnabled: boolean;
  };
}

class CrisisMobilePerformanceMonitor {
  private static instance: CrisisMobilePerformanceMonitor;
  private metrics: MobileAuthMetrics[] = [];
  private currentSession: Partial<MobileAuthMetrics> | null = null;
  private startTime: number = 0;

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): CrisisMobilePerformanceMonitor {
    if (!CrisisMobilePerformanceMonitor.instance) {
      CrisisMobilePerformanceMonitor.instance = new CrisisMobilePerformanceMonitor();
    }
    return CrisisMobilePerformanceMonitor.instance;
  }

  /**
   * Initialize comprehensive mobile monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Monitor network changes during auth
    window.addEventListener('online', () => {
      this.logNetworkChange('online');
    });

    window.addEventListener('offline', () => {
      this.logNetworkChange('offline');
    });

    // Monitor orientation changes that might affect auth flows
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.logOrientationChange();
      }, 100); // Allow time for orientation to settle
    });

    // Monitor visibility changes (user switching apps during auth)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.currentSession) {
        this.logVisibilityChange('hidden');
      } else if (!document.hidden && this.currentSession) {
        this.logVisibilityChange('visible');
      }
    });

    console.log('🔍 Crisis mobile performance monitoring initialized');
  }

  /**
   * Start monitoring an authentication attempt
   */
  public startAuthMonitoring(): void {
    this.startTime = performance.now();
    this.currentSession = {
      deviceInfo: this.collectDeviceInfo(),
      networkInfo: this.collectNetworkInfo(),
      crisisContext: this.collectCrisisContext(),
      userExperience: this.initializeUXMetrics()
    };

    console.log('🔍 Started mobile auth monitoring:', {
      deviceType: this.currentSession.deviceInfo?.isIOS ? 'iOS' : 
                 this.currentSession.deviceInfo?.isAndroid ? 'Android' : 'Other',
      network: this.currentSession.networkInfo?.effectiveType,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Record successful authentication
   */
  public recordAuthSuccess(method: 'popup' | 'redirect'): void {
    if (!this.currentSession) return;

    const endTime = performance.now();
    const duration = endTime - this.startTime;

    const completeMetrics: MobileAuthMetrics = {
      ...this.currentSession,
      authPerformance: {
        startTime: this.startTime,
        endTime: endTime,
        duration: duration,
        method: method,
        success: true,
        retryCount: 0
      }
    } as MobileAuthMetrics;

    this.metrics.push(completeMetrics);
    this.analyzeMetrics(completeMetrics);
    this.currentSession = null;

    console.log('✅ Mobile auth success recorded:', {
      method,
      duration: `${Math.round(duration)}ms`,
      device: completeMetrics.deviceInfo.isIOS ? 'iOS' : 'Android',
      network: completeMetrics.networkInfo.effectiveType
    });
  }

  /**
   * Record failed authentication with crisis-safe error tracking
   */
  public recordAuthFailure(errorCode: string, errorMessage: string, retryCount: number = 0): void {
    if (!this.currentSession) return;

    const endTime = performance.now();
    const duration = endTime - this.startTime;

    const completeMetrics: MobileAuthMetrics = {
      ...this.currentSession,
      authPerformance: {
        startTime: this.startTime,
        endTime: endTime,
        duration: duration,
        method: 'failed',
        success: false,
        errorCode,
        errorMessage,
        retryCount
      }
    } as MobileAuthMetrics;

    this.metrics.push(completeMetrics);
    this.analyzeErrorPattern(completeMetrics);
    this.currentSession = null;

    console.error('❌ Mobile auth failure recorded:', {
      errorCode,
      duration: `${Math.round(duration)}ms`,
      device: completeMetrics.deviceInfo.isIOS ? 'iOS' : 'Android',
      network: completeMetrics.networkInfo.effectiveType,
      retryCount
    });

    // Alert for critical error patterns that affect crisis users
    this.checkForCriticalPatterns(completeMetrics);
  }

  /**
   * Record touch interaction metrics
   */
  public recordTouchInteraction(targetSize: number, responseTime: number): void {
    if (!this.currentSession?.userExperience) return;

    this.currentSession.userExperience.touchTargetSize = targetSize;
    this.currentSession.userExperience.interactionDelay = responseTime;

    // Log warning for small touch targets that could affect crisis users
    if (targetSize < 52) {
      console.warn('⚠️ Small touch target detected:', {
        size: `${targetSize}px`,
        recommended: '52px minimum for crisis accessibility'
      });
    }

    // Log warning for slow interactions
    if (responseTime > 300) {
      console.warn('⚠️ Slow touch response detected:', {
        responseTime: `${responseTime}ms`,
        recommended: '< 300ms for crisis users'
      });
    }
  }

  /**
   * Get current performance insights
   */
  public getPerformanceInsights(): {
    successRate: number;
    averageAuthTime: number;
    commonErrors: string[];
    devicePerformance: { [key: string]: number };
    networkImpact: { [key: string]: number };
    crisisRecommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        successRate: 0,
        averageAuthTime: 0,
        commonErrors: [],
        devicePerformance: {},
        networkImpact: {},
        crisisRecommendations: []
      };
    }

    const successful = this.metrics.filter(m => m.authPerformance.success);
    const successRate = (successful.length / this.metrics.length) * 100;
    const averageAuthTime = successful.reduce((sum, m) => sum + m.authPerformance.duration, 0) / successful.length;

    const errors = this.metrics
      .filter(m => !m.authPerformance.success)
      .map(m => m.authPerformance.errorCode || 'unknown')
      .reduce((acc: { [key: string]: number }, error) => {
        acc[error] = (acc[error] || 0) + 1;
        return acc;
      }, {});

    const commonErrors = Object.entries(errors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([error]) => error);

    const devicePerformance = this.calculateDevicePerformance();
    const networkImpact = this.calculateNetworkImpact();
    const crisisRecommendations = this.generateCrisisRecommendations();

    return {
      successRate,
      averageAuthTime,
      commonErrors,
      devicePerformance,
      networkImpact,
      crisisRecommendations
    };
  }

  /**
   * Collect comprehensive device information
   */
  private collectDeviceInfo() {
    if (typeof window === 'undefined') {
      return {} as any;
    }

    const userAgent = navigator.userAgent.toLowerCase();
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      browserName: this.getBrowserName(userAgent),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      pixelRatio: window.devicePixelRatio || 1,
      touchPoints: navigator.maxTouchPoints || 0,
      orientation: window.screen.orientation?.type || 'unknown'
    };
  }

  /**
   * Collect network performance information
   */
  private collectNetworkInfo() {
    if (typeof window === 'undefined') {
      return {} as any;
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    return {
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      isOnline: navigator.onLine,
      connectionType: connection?.type || 'unknown'
    };
  }

  /**
   * Collect crisis-relevant contextual information
   */
  private collectCrisisContext() {
    const now = new Date();
    return {
      timeOfDay: this.getTimeOfDay(now),
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
      isWeekend: now.getDay() === 0 || now.getDay() === 6,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      batteryLevel: this.getBatteryLevel(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * Initialize user experience metrics tracking
   */
  private initializeUXMetrics() {
    return {
      touchTargetSize: 0,
      interactionDelay: 0,
      visualFeedbackDelay: 0,
      hapticFeedbackUsed: 'vibrate' in navigator,
      accessibilityFeaturesEnabled: this.checkAccessibilityFeatures()
    };
  }

  /**
   * Analyze successful auth metrics for patterns
   */
  private analyzeMetrics(metrics: MobileAuthMetrics): void {
    // Check for slow auth times that might indicate crisis user difficulty
    if (metrics.authPerformance.duration > 10000) {
      console.warn('⚠️ Slow authentication detected:', {
        duration: `${Math.round(metrics.authPerformance.duration)}ms`,
        device: metrics.deviceInfo.isIOS ? 'iOS' : 'Android',
        network: metrics.networkInfo.effectiveType,
        recommendation: 'Consider pre-loading auth for crisis users'
      });
    }

    // Check for crisis time patterns
    if (metrics.crisisContext.timeOfDay === 'late-night' || metrics.crisisContext.timeOfDay === 'early-morning') {
      console.log('🌙 Crisis time authentication:', {
        time: metrics.crisisContext.timeOfDay,
        success: metrics.authPerformance.success,
        note: 'Peak crisis support hours'
      });
    }
  }

  /**
   * Analyze error patterns for crisis users
   */
  private analyzeErrorPattern(metrics: MobileAuthMetrics): void {
    const errorCode = metrics.authPerformance.errorCode;
    const device = metrics.deviceInfo.isIOS ? 'iOS' : 'Android';
    const network = metrics.networkInfo.effectiveType;

    // Pattern analysis for specific combinations
    if (errorCode === 'auth/popup-blocked' && metrics.deviceInfo.isIOS) {
      console.error('🚨 iOS popup blocking detected - critical for crisis users');
    }

    if (errorCode === 'auth/network-request-failed' && network === '2g') {
      console.error('🚨 Network failure on slow connection - implement retry logic');
    }

    if (metrics.authPerformance.retryCount > 2) {
      console.error('🚨 Multiple auth failures - crisis user may need help');
    }
  }

  /**
   * Check for critical error patterns that need immediate attention
   */
  private checkForCriticalPatterns(metrics: MobileAuthMetrics): void {
    // High retry count during crisis hours
    if (metrics.authPerformance.retryCount > 1 && 
        (metrics.crisisContext.timeOfDay === 'late-night' || metrics.crisisContext.timeOfDay === 'early-morning')) {
      console.error('🚨 CRITICAL: Auth failures during crisis hours', {
        retryCount: metrics.authPerformance.retryCount,
        timeOfDay: metrics.crisisContext.timeOfDay,
        errorCode: metrics.authPerformance.errorCode
      });
    }

    // iOS Safari popup issues
    if (metrics.authPerformance.errorCode === 'auth/popup-blocked' && metrics.deviceInfo.isIOS) {
      console.error('🚨 CRITICAL: iOS Safari blocking auth - implement redirect fallback immediately');
    }
  }

  // Helper methods
  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('safari') && userAgent.includes('iphone')) return 'ios-safari';
    if (userAgent.includes('chrome') && userAgent.includes('android')) return 'android-chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('edge')) return 'edge';
    return 'unknown';
  }

  private getTimeOfDay(date: Date): string {
    const hour = date.getHours();
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'late-night'; // 22-6 are crisis hours
  }

  private getBatteryLevel(): number | undefined {
    return (navigator as any).getBattery?.().then((battery: any) => battery.level) || undefined;
  }

  private getMemoryUsage(): number | undefined {
    return (performance as any).memory?.usedJSHeapSize || undefined;
  }

  private checkAccessibilityFeatures(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
           window.matchMedia('(prefers-contrast: high)').matches ||
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private calculateDevicePerformance(): { [key: string]: number } {
    // Implementation for device-specific performance analysis
    return {};
  }

  private calculateNetworkImpact(): { [key: string]: number } {
    // Implementation for network impact analysis
    return {};
  }

  private generateCrisisRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const recentMetrics = this.metrics.slice(-10);
    const recentFailures = recentMetrics.filter(m => !m.authPerformance.success);

    if (recentFailures.length > 3) {
      recommendations.push('High authentication failure rate detected - consider implementing additional fallback methods');
    }

    const avgDuration = recentMetrics
      .filter(m => m.authPerformance.success)
      .reduce((sum, m) => sum + m.authPerformance.duration, 0) / recentMetrics.length;

    if (avgDuration > 5000) {
      recommendations.push('Slow authentication times - implement auth pre-warming for crisis users');
    }

    return recommendations;
  }

  private logNetworkChange(status: string): void {
    console.log(`📶 Network status changed: ${status}`);
  }

  private logOrientationChange(): void {
    console.log(`📱 Orientation changed: ${window.screen.orientation?.type}`);
  }

  private logVisibilityChange(visibility: string): void {
    console.log(`👁️ Visibility changed: ${visibility}`);
  }
}

// Export singleton instance
export const mobilePerformanceMonitor = CrisisMobilePerformanceMonitor.getInstance();

// Export types
export type { MobileAuthMetrics };
export { CrisisMobilePerformanceMonitor };