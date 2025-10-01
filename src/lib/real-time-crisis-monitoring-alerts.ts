/**
 * REAL-TIME CRISIS MONITORING & ALERT SYSTEM FOR ALCHM
 * 
 * MISSION: Provide instant alerts and interventions for users in crisis
 * Every alert could be the difference between life and death.
 */

import { logger } from '@/lib/logging';

export interface CrisisAlert {
  id: string;
  userId: string;
  alertType: 'crisis_detected' | 'performance_degraded' | 'system_failure' | 'escalation_needed';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'emergency';
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'critical';
  triggers: string[];
  context: {
    userAgent: string;
    url: string;
    timestamp: number;
    sessionId: string;
    batteryLevel?: number;
    connectionType?: string;
    responseTime?: number;
    crisisKeywords?: string[];
    moodLevel?: number;
    journalContent?: string; // Encrypted/hashed for privacy
  };
  interventionActions: InterventionAction[];
  escalationChain: EscalationLevel[];
  status: 'active' | 'acknowledged' | 'resolved' | 'escalated';
  createdAt: number;
  resolvedAt?: number;
  acknowledgedBy?: string;
}

export interface InterventionAction {
  type: 'show_resources' | 'emergency_modal' | 'professional_contact' | 'emergency_services';
  priority: number;
  message: string;
  resources: CrisisResource[];
  timeframe: 'immediate' | 'within_minutes' | 'within_hour';
  culturallyAdapted: boolean;
}

export interface CrisisResource {
  name: string;
  type: 'hotline' | 'text_line' | 'chat_service' | 'local_service' | 'emergency';
  contact: string;
  description: string;
  available24h: boolean;
  languages: string[];
  specialties: string[];
  immediateAccess: boolean;
}

export interface EscalationLevel {
  level: number;
  trigger: string;
  timeThreshold: number; // milliseconds
  action: 'notify_professional' | 'alert_emergency' | 'escalate_system';
  contacts: string[];
}

export interface MonitoringConfig {
  enableRealTimeDetection: boolean;
  crisisKeywordThreshold: number;
  performanceThresholds: {
    crisisResponseTime: number;
    systemAvailability: number;
    memoryUsage: number;
  };
  escalationTimeouts: {
    initial: number;
    professional: number;
    emergency: number;
  };
  culturalAdaptations: {
    enabled: boolean;
    languages: string[];
    culturalContexts: string[];
  };
}

// Crisis-optimized monitoring configuration
export const DEFAULT_MONITORING_CONFIG: MonitoringConfig = {
  enableRealTimeDetection: true,
  crisisKeywordThreshold: 3, // Number of crisis keywords to trigger alert
  performanceThresholds: {
    crisisResponseTime: 3000, // 3 seconds maximum
    systemAvailability: 99.5, // 99.5% uptime minimum
    memoryUsage: 85 // 85% memory usage maximum
  },
  escalationTimeouts: {
    initial: 60000, // 1 minute
    professional: 300000, // 5 minutes
    emergency: 900000 // 15 minutes
  },
  culturalAdaptations: {
    enabled: true,
    languages: ['en', 'es', 'pt', 'ko', 'hi', 'de'],
    culturalContexts: ['lgbtq+', 'immigrant', 'youth', 'religious', 'racial_minority']
  }
};

// Crisis resources database
export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    type: 'hotline',
    contact: '988',
    description: '24/7 free and confidential support for people in distress',
    available24h: true,
    languages: ['en', 'es'],
    specialties: ['suicide_prevention', 'crisis_support'],
    immediateAccess: true
  },
  {
    name: 'Crisis Text Line',
    type: 'text_line',
    contact: 'Text HOME to 741741',
    description: '24/7 crisis support via text message',
    available24h: true,
    languages: ['en', 'es'],
    specialties: ['text_support', 'youth_friendly'],
    immediateAccess: true
  },
  {
    name: 'The Trevor Project',
    type: 'hotline',
    contact: '1-866-488-7386',
    description: '24/7 crisis support for LGBTQ youth',
    available24h: true,
    languages: ['en', 'es'],
    specialties: ['lgbtq+', 'youth', 'suicide_prevention'],
    immediateAccess: true
  },
  {
    name: 'Trans Lifeline',
    type: 'hotline',
    contact: '877-565-8860',
    description: 'Crisis support by and for transgender people',
    available24h: true,
    languages: ['en', 'es'],
    specialties: ['transgender', 'peer_support'],
    immediateAccess: true
  },
  {
    name: 'SAMHSA National Helpline',
    type: 'hotline',
    contact: '1-800-662-4357',
    description: 'Mental health support regardless of immigration status',
    available24h: true,
    languages: ['en', 'es'],
    specialties: ['immigration_safe', 'mental_health'],
    immediateAccess: true
  },
  {
    name: 'Emergency Services',
    type: 'emergency',
    contact: '911',
    description: 'Immediate emergency response',
    available24h: true,
    languages: ['en'],
    specialties: ['emergency', 'immediate_danger'],
    immediateAccess: true
  }
];

export class RealTimeCrisisMonitoringSystem {
  private static instance: RealTimeCrisisMonitoringSystem | null = null;
  private config: MonitoringConfig;
  private activeAlerts = new Map<string, CrisisAlert>();
  private monitoringEnabled = false;
  private alertQueue: CrisisAlert[] = [];
  private escalationTimers = new Map<string, NodeJS.Timeout>();
  
  private crisisPatterns = {
    immediate: [
      'kill myself', 'end my life', 'suicide', 'want to die', 'better off dead',
      'take my own life', 'ready to die', 'going to end it', 'final goodbye',
      'tonight is the night', 'today is the day', 'this is it', 'no more tomorrow'
    ],
    urgent: [
      'hurt myself worse', 'cut myself deeper', 'self harm escalating',
      'completely hopeless', 'no hope left', 'can\'t go on anymore',
      'breaking point reached', 'giving up completely', 'abandoned by everyone'
    ],
    concerning: [
      'thoughts of death', 'death seems peaceful', 'researching methods',
      'can\'t cope anymore', 'everything falling apart', 'losing control',
      'drowning in problems', 'exhausted from fighting', 'no energy left'
    ]
  };

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...DEFAULT_MONITORING_CONFIG, ...config };
  }

  static getInstance(config?: Partial<MonitoringConfig>): RealTimeCrisisMonitoringSystem {
    if (!this.instance) {
      this.instance = new RealTimeCrisisMonitoringSystem(config);
    }
    return this.instance;
  }

  async startRealTimeMonitoring(): Promise<void> {
    if (this.monitoringEnabled) return;

    console.log('🚨 Starting Real-Time Crisis Monitoring...');
    this.monitoringEnabled = true;

    // Initialize monitoring systems
    this.setupTextAnalysisMonitoring();
    this.setupPerformanceMonitoring();
    this.setupSystemHealthMonitoring();
    this.setupUserBehaviorMonitoring();
    this.setupNetworkMonitoring();
    
    // Start continuous monitoring loops
    this.startAlertProcessing();
    this.startEscalationManagement();
    this.startSystemStatusChecks();

    console.log('✅ Real-Time Crisis Monitoring Active');
  }

  private setupTextAnalysisMonitoring(): void {
    // Monitor all text inputs for crisis indicators
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement | HTMLTextAreaElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        this.analyzeTextForCrisis(target.value, {
          elementId: target.id || 'anonymous',
          sessionId: this.getSessionId(),
          timestamp: Date.now()
        });
      }
    });

    // Monitor form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const textContent = Array.from(formData.values())
        .filter(value => typeof value === 'string')
        .join(' ');

      if (textContent) {
        this.analyzeTextForCrisis(textContent, {
          elementId: 'form_submission',
          sessionId: this.getSessionId(),
          timestamp: Date.now()
        });
      }
    });
  }

  private analyzeTextForCrisis(text: string, context: any): void {
    const startTime = performance.now();
    const textLower = text.toLowerCase();
    
    // Count crisis indicators by severity
    const immediateIndicators = this.crisisPatterns.immediate.filter(pattern => 
      textLower.includes(pattern)
    );
    const urgentIndicators = this.crisisPatterns.urgent.filter(pattern => 
      textLower.includes(pattern)
    );
    const concerningIndicators = this.crisisPatterns.concerning.filter(pattern => 
      textLower.includes(pattern)
    );

    const analysisTime = performance.now() - startTime;
    
    // Determine risk level and create alert if necessary
    let riskLevel: CrisisAlert['riskLevel'] = 'none';
    let severity: CrisisAlert['severity'] = 'low';
    let alertType: CrisisAlert['alertType'] = 'crisis_detected';

    if (immediateIndicators.length > 0) {
      riskLevel = 'critical';
      severity = 'emergency';
      this.createCrisisAlert(riskLevel, severity, alertType, {
        triggers: immediateIndicators,
        keywords: immediateIndicators,
        analysisTime,
        textLength: text.length,
        ...context
      });
    } else if (urgentIndicators.length >= 2) {
      riskLevel = 'high';
      severity = 'critical';
      this.createCrisisAlert(riskLevel, severity, alertType, {
        triggers: urgentIndicators,
        keywords: urgentIndicators,
        analysisTime,
        textLength: text.length,
        ...context
      });
    } else if (urgentIndicators.length >= 1 || concerningIndicators.length >= 3) {
      riskLevel = 'moderate';
      severity = 'high';
      this.createCrisisAlert(riskLevel, severity, alertType, {
        triggers: [...urgentIndicators, ...concerningIndicators],
        keywords: [...urgentIndicators, ...concerningIndicators],
        analysisTime,
        textLength: text.length,
        ...context
      });
    } else if (concerningIndicators.length >= 1) {
      riskLevel = 'low';
      severity = 'medium';
      // Only create alert if multiple concerning indicators
      if (concerningIndicators.length >= 2) {
        this.createCrisisAlert(riskLevel, severity, alertType, {
          triggers: concerningIndicators,
          keywords: concerningIndicators,
          analysisTime,
          textLength: text.length,
          ...context
        });
      }
    }

    // Check analysis performance
    if (analysisTime > 100) {
      this.createPerformanceAlert('crisis_detection_slow', analysisTime, 100);
    }
  }

  private createCrisisAlert(
    riskLevel: CrisisAlert['riskLevel'],
    severity: CrisisAlert['severity'],
    alertType: CrisisAlert['alertType'],
    context: any
  ): void {
    const alertId = `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userId = this.getUserId() || 'anonymous';

    const alert: CrisisAlert = {
      id: alertId,
      userId,
      alertType,
      severity,
      riskLevel,
      triggers: context.triggers || [],
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        batteryLevel: this.getBatteryLevel(),
        connectionType: this.getConnectionType(),
        responseTime: context.analysisTime,
        crisisKeywords: context.keywords || []
      },
      interventionActions: this.generateInterventionActions(riskLevel, severity),
      escalationChain: this.generateEscalationChain(riskLevel, severity),
      status: 'active',
      createdAt: Date.now()
    };

    this.activeAlerts.set(alertId, alert);
    this.alertQueue.push(alert);

    // Immediate action for emergency alerts
    if (severity === 'emergency' || severity === 'critical') {
      this.executeEmergencyProtocol(alert);
    }

    // Start escalation timer
    this.startEscalationTimer(alert);

    // Log alert (without sensitive content)
    logger.error('Crisis alert created', {
      alertId,
      riskLevel,
      severity,
      triggerCount: alert.triggers.length,
      userId: userId.substring(0, 8), // Partial ID for privacy
      timestamp: alert.createdAt
    });
  }

  private generateInterventionActions(
    riskLevel: CrisisAlert['riskLevel'],
    severity: CrisisAlert['severity']
  ): InterventionAction[] {
    const actions: InterventionAction[] = [];

    if (severity === 'emergency' || riskLevel === 'critical') {
      actions.push({
        type: 'emergency_modal',
        priority: 1,
        message: 'You seem to be in crisis. Immediate help is available.',
        resources: CRISIS_RESOURCES.filter(r => r.immediateAccess),
        timeframe: 'immediate',
        culturallyAdapted: true
      });

      actions.push({
        type: 'emergency_services',
        priority: 2,
        message: 'If you are in immediate danger, call 911',
        resources: CRISIS_RESOURCES.filter(r => r.type === 'emergency'),
        timeframe: 'immediate',
        culturallyAdapted: false
      });
    }

    if (severity === 'critical' || riskLevel === 'high') {
      actions.push({
        type: 'show_resources',
        priority: 3,
        message: 'Crisis support is available 24/7. You are not alone.',
        resources: CRISIS_RESOURCES.filter(r => r.available24h),
        timeframe: 'immediate',
        culturallyAdapted: true
      });

      actions.push({
        type: 'professional_contact',
        priority: 4,
        message: 'Consider reaching out to a mental health professional',
        resources: CRISIS_RESOURCES.filter(r => r.specialties.includes('mental_health')),
        timeframe: 'within_hour',
        culturallyAdapted: true
      });
    }

    if (riskLevel === 'moderate' || riskLevel === 'low') {
      actions.push({
        type: 'show_resources',
        priority: 5,
        message: 'Support is available if you need it',
        resources: CRISIS_RESOURCES.slice(0, 3), // Top 3 resources
        timeframe: 'within_hour',
        culturallyAdapted: true
      });
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }

  private generateEscalationChain(
    riskLevel: CrisisAlert['riskLevel'],
    severity: CrisisAlert['severity']
  ): EscalationLevel[] {
    const chain: EscalationLevel[] = [];

    if (severity === 'emergency') {
      chain.push({
        level: 1,
        trigger: 'immediate_response_required',
        timeThreshold: 30000, // 30 seconds
        action: 'alert_emergency',
        contacts: ['emergency_team@alchm.app']
      });
    }

    if (severity === 'critical' || riskLevel === 'critical') {
      chain.push({
        level: 2,
        trigger: 'crisis_team_notification',
        timeThreshold: this.config.escalationTimeouts.initial,
        action: 'notify_professional',
        contacts: ['crisis_team@alchm.app', 'clinical_supervisor@alchm.app']
      });
    }

    if (severity === 'high' || riskLevel === 'high') {
      chain.push({
        level: 3,
        trigger: 'professional_intervention',
        timeThreshold: this.config.escalationTimeouts.professional,
        action: 'escalate_system',
        contacts: ['support_team@alchm.app']
      });
    }

    return chain;
  }

  private executeEmergencyProtocol(alert: CrisisAlert): void {
    console.log('🚨 EXECUTING EMERGENCY PROTOCOL');

    // Show immediate crisis support modal
    this.showEmergencyCrisisModal(alert);

    // Preload emergency resources
    this.preloadEmergencyResources();

    // Enable emergency performance mode
    this.enableEmergencyPerformanceMode();

    // Notify emergency systems immediately
    this.notifyEmergencySystems(alert);

    // Start continuous monitoring for this user
    this.startContinuousUserMonitoring(alert.userId);
  }

  private showEmergencyCrisisModal(alert: CrisisAlert): void {
    // Remove any existing crisis modals
    const existingModal = document.getElementById('emergency-crisis-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'emergency-crisis-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ">
        <div style="
          background: white;
          border-radius: 12px;
          padding: 32px;
          max-width: 500px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        ">
          <div style="font-size: 48px; margin-bottom: 16px;">🆘</div>
          <h2 style="
            color: #dc2626;
            font-size: 24px;
            margin: 0 0 16px 0;
            font-weight: 700;
          ">Crisis Support Available</h2>
          <p style="
            color: #374151;
            font-size: 16px;
            line-height: 1.5;
            margin: 0 0 24px 0;
          ">
            You're not alone. Crisis support is available 24/7. 
            Your life has value and help is just a call away.
          </p>
          <div style="margin-bottom: 24px;">
            <a href="tel:988" style="
              background: #dc2626;
              color: white;
              padding: 16px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 700;
              font-size: 18px;
              display: inline-block;
              margin: 8px;
            ">Call 988 Now</a>
            <a href="sms:741741&body=HOME" style="
              background: #2563eb;
              color: white;
              padding: 16px 32px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 700;
              font-size: 18px;
              display: inline-block;
              margin: 8px;
            ">Text for Help</a>
          </div>
          <button onclick="document.getElementById('emergency-crisis-modal').remove()" style="
            background: transparent;
            border: 2px solid #d1d5db;
            color: #6b7280;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
          ">Continue to Safety Resources</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 2 minutes if not interacted with
    setTimeout(() => {
      const modalElement = document.getElementById('emergency-crisis-modal');
      if (modalElement) {
        modalElement.remove();
      }
    }, 120000);
  }

  private preloadEmergencyResources(): void {
    const emergencyPages = [
      '/crisis-resources',
      '/emergency-contacts',
      '/safety-plan'
    ];

    emergencyPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });
  }

  private enableEmergencyPerformanceMode(): void {
    // Disable non-essential features to prioritize crisis support
    const style = document.createElement('style');
    style.id = 'emergency-performance-mode';
    style.textContent = `
      .non-essential, .decoration, .animation {
        display: none !important;
      }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    `;
    
    if (!document.getElementById('emergency-performance-mode')) {
      document.head.appendChild(style);
    }
  }

  private async notifyEmergencySystems(alert: CrisisAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/emergency-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert.id,
          severity: alert.severity,
          riskLevel: alert.riskLevel,
          timestamp: alert.createdAt,
          anonymizedContext: {
            sessionId: alert.context.sessionId,
            triggerCount: alert.triggers.length,
            responseTime: alert.context.responseTime
          }
        })
      });
    } catch (error) {
      console.error('Failed to notify emergency systems:', error);
    }
  }

  private startContinuousUserMonitoring(userId: string): void {
    // Enhanced monitoring for users in crisis
    const monitoringInterval = setInterval(() => {
      this.performCrisisUserHealthCheck(userId);
    }, 30000); // Check every 30 seconds

    // Stop after 2 hours unless renewed
    setTimeout(() => {
      clearInterval(monitoringInterval);
    }, 7200000);
  }

  private performCrisisUserHealthCheck(userId: string): void {
    // Check if user is still active
    const lastActivity = this.getLastUserActivity(userId);
    const timeSinceActivity = Date.now() - lastActivity;

    // If user has been inactive for 10 minutes, show gentle check-in
    if (timeSinceActivity > 600000) {
      this.showGentleCheckIn();
    }
  }

  private showGentleCheckIn(): void {
    // Show subtle check-in message
    const checkIn = document.createElement('div');
    checkIn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f3f4f6;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    checkIn.innerHTML = `
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">
        We're here if you need support. Crisis resources are always available.
      </p>
      <button onclick="this.parentElement.remove()" style="
        background: #6b7280;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">OK</button>
    `;

    document.body.appendChild(checkIn);

    // Auto-remove after 30 seconds
    setTimeout(() => {
      if (checkIn.parentNode) {
        checkIn.remove();
      }
    }, 30000);
  }

  private setupPerformanceMonitoring(): void {
    // Monitor critical performance metrics
    setInterval(() => {
      this.checkCrisisSystemPerformance();
    }, 10000); // Check every 10 seconds
  }

  private checkCrisisSystemPerformance(): void {
    // Check crisis button response time
    const crisisButtons = document.querySelectorAll('[data-crisis-button]');
    if (crisisButtons.length === 0) {
      this.createPerformanceAlert('crisis_button_missing', 0, 1);
    }

    // Check memory usage
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      if (memoryUsagePercent > this.config.performanceThresholds.memoryUsage) {
        this.createPerformanceAlert('high_memory_usage', memoryUsagePercent, 
          this.config.performanceThresholds.memoryUsage);
      }
    }

    // Check API response times
    this.checkAPIPerformance();
  }

  private async checkAPIPerformance(): Promise<void> {
    const startTime = performance.now();
    
    try {
      await fetch('/api/health/ping', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      const responseTime = performance.now() - startTime;
      
      if (responseTime > this.config.performanceThresholds.crisisResponseTime) {
        this.createPerformanceAlert('api_response_slow', responseTime,
          this.config.performanceThresholds.crisisResponseTime);
      }
    } catch (error) {
      this.createPerformanceAlert('api_unavailable', performance.now() - startTime, 0);
    }
  }

  private createPerformanceAlert(metric: string, value: number, threshold: number): void {
    const alertId = `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: CrisisAlert = {
      id: alertId,
      userId: this.getUserId() || 'system',
      alertType: 'performance_degraded',
      severity: value > threshold * 2 ? 'critical' : value > threshold * 1.5 ? 'high' : 'medium',
      riskLevel: 'none',
      triggers: [`${metric}_threshold_exceeded`],
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        responseTime: value
      },
      interventionActions: [],
      escalationChain: [],
      status: 'active',
      createdAt: Date.now()
    };

    this.activeAlerts.set(alertId, alert);
    this.alertQueue.push(alert);

    logger.warn('Performance alert created', {
      alertId,
      metric,
      value,
      threshold,
      severity: alert.severity
    });
  }

  private setupSystemHealthMonitoring(): void {
    // Monitor system health indicators
    this.monitorBatteryStatus();
    this.monitorNetworkStatus();
    this.monitorVisibilityChanges();
  }

  private monitorBatteryStatus(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          if (battery.level < 0.1 && !battery.charging) {
            // Critical battery during crisis could be dangerous
            this.showBatteryWarning();
          }
        };

        battery.addEventListener('levelchange', checkBattery);
        battery.addEventListener('chargingchange', checkBattery);
        checkBattery();
      });
    }
  }

  private showBatteryWarning(): void {
    const warning = document.createElement('div');
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #fbbf24;
      color: #92400e;
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;
    
    warning.textContent = '🔋 Low battery detected. Consider charging your device or saving important information.';
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      if (warning.parentNode) {
        warning.remove();
      }
    }, 10000);
  }

  private monitorNetworkStatus(): void {
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
    });

    window.addEventListener('offline', () => {
      console.log('📴 Network connection lost - enabling offline mode');
      this.enableOfflineMode();
    });
  }

  private enableOfflineMode(): void {
    // Ensure critical crisis resources are available offline
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.active?.postMessage({
          type: 'ENABLE_OFFLINE_CRISIS_MODE'
        });
      });
    }
  }

  private monitorVisibilityChanges(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // User left the app - save any unsaved data
        this.emergencySaveUserData();
      }
    });
  }

  private emergencySaveUserData(): void {
    // Save any unsaved form data to localStorage
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      const formData = new FormData(form);
      const data: Record<string, any> = {};
      
      formData.forEach((value, key) => {
        if (typeof value === 'string') {
          data[key] = value;
        }
      });
      
      if (Object.keys(data).length > 0) {
        localStorage.setItem(`emergency_save_${index}_${Date.now()}`, JSON.stringify(data));
      }
    });
  }

  private setupUserBehaviorMonitoring(): void {
    // Monitor for concerning user behaviors
    this.monitorNavigationPatterns();
    this.monitorInteractionPatterns();
  }

  private monitorNavigationPatterns(): void {
    let rapidNavigationCount = 0;
    let lastNavigationTime = 0;

    const observer = new MutationObserver(() => {
      const currentTime = Date.now();
      
      if (currentTime - lastNavigationTime < 1000) {
        rapidNavigationCount++;
        
        if (rapidNavigationCount > 5) {
          // Rapid navigation might indicate distress
          this.createBehaviorAlert('rapid_navigation', rapidNavigationCount);
        }
      } else {
        rapidNavigationCount = 0;
      }
      
      lastNavigationTime = currentTime;
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  private monitorInteractionPatterns(): void {
    let interactionCount = 0;
    let lastInteractionTime = Date.now();

    ['click', 'keydown', 'scroll'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        lastInteractionTime = Date.now();
      });
    });

    // Check for lack of interaction (might indicate user in distress)
    setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteractionTime;
      
      if (timeSinceInteraction > 300000) { // 5 minutes
        this.createBehaviorAlert('no_interaction', timeSinceInteraction);
      }
    }, 60000); // Check every minute
  }

  private createBehaviorAlert(behavior: string, value: number): void {
    // Create low-severity alerts for concerning behaviors
    const alertId = `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: CrisisAlert = {
      id: alertId,
      userId: this.getUserId() || 'anonymous',
      alertType: 'crisis_detected',
      severity: 'low',
      riskLevel: 'low',
      triggers: [behavior],
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      },
      interventionActions: [],
      escalationChain: [],
      status: 'active',
      createdAt: Date.now()
    };

    this.activeAlerts.set(alertId, alert);
  }

  private setupNetworkMonitoring(): void {
    // Monitor network quality for crisis response optimization
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          // Optimize for slow network during crisis
          this.optimizeForSlowNetwork();
        }
      });
    }
  }

  private optimizeForSlowNetwork(): void {
    // Apply network optimizations for crisis scenarios
    console.log('📶 Optimizing for slow network during crisis monitoring');
    
    // Disable non-essential network requests
    const style = document.createElement('style');
    style.textContent = `
      img:not(.essential) { display: none; }
      video { display: none; }
      iframe:not(.crisis-resource) { display: none; }
    `;
    document.head.appendChild(style);
  }

  private startAlertProcessing(): void {
    // Process alert queue every second
    setInterval(() => {
      this.processAlertQueue();
    }, 1000);
  }

  private processAlertQueue(): void {
    while (this.alertQueue.length > 0) {
      const alert = this.alertQueue.shift()!;
      this.processAlert(alert);
    }
  }

  private processAlert(alert: CrisisAlert): void {
    // Execute intervention actions
    alert.interventionActions.forEach(action => {
      this.executeInterventionAction(action, alert);
    });

    // Send to monitoring API
    this.sendAlertToMonitoring(alert);
  }

  private executeInterventionAction(action: InterventionAction, alert: CrisisAlert): void {
    switch (action.type) {
      case 'emergency_modal':
        this.showEmergencyCrisisModal(alert);
        break;
      case 'show_resources':
        this.showCrisisResources(action.resources);
        break;
      case 'professional_contact':
        this.offerProfessionalContact(action.resources);
        break;
      case 'emergency_services':
        // Already handled in emergency modal
        break;
    }
  }

  private showCrisisResources(resources: CrisisResource[]): void {
    // Show crisis resources in a non-intrusive way
    const resourcesList = document.createElement('div');
    resourcesList.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    `;

    const resourcesHTML = resources.slice(0, 3).map(resource => `
      <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6;">
        <strong style="color: #374151; font-size: 14px;">${resource.name}</strong>
        <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">${resource.description}</p>
        <a href="${resource.type === 'hotline' ? 'tel:' : resource.type === 'text_line' ? 'sms:' : ''}${resource.contact}" 
           style="color: #2563eb; font-size: 12px; text-decoration: none;">
          ${resource.contact}
        </a>
      </div>
    `).join('');

    resourcesList.innerHTML = `
      <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">Crisis Support</h4>
      ${resourcesHTML}
      <button onclick="this.parentElement.remove()" style="
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        color: #374151;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        width: 100%;
      ">Close</button>
    `;

    document.body.appendChild(resourcesList);

    // Auto-remove after 2 minutes
    setTimeout(() => {
      if (resourcesList.parentNode) {
        resourcesList.remove();
      }
    }, 120000);
  }

  private offerProfessionalContact(resources: CrisisResource[]): void {
    // Offer to connect with mental health professionals
    console.log('Offering professional contact resources:', resources);
  }

  private async sendAlertToMonitoring(alert: CrisisAlert): Promise<void> {
    try {
      await fetch('/api/monitoring/crisis-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert.id,
          alertType: alert.alertType,
          severity: alert.severity,
          riskLevel: alert.riskLevel,
          triggerCount: alert.triggers.length,
          timestamp: alert.createdAt,
          sessionId: alert.context.sessionId
        })
      });
    } catch (error) {
      console.error('Failed to send alert to monitoring:', error);
    }
  }

  private startEscalationManagement(): void {
    // Check escalation timers every 30 seconds
    setInterval(() => {
      this.checkEscalationTimers();
    }, 30000);
  }

  private startEscalationTimer(alert: CrisisAlert): void {
    alert.escalationChain.forEach(level => {
      const timerId = setTimeout(() => {
        this.executeEscalation(alert, level);
      }, level.timeThreshold);
      
      this.escalationTimers.set(`${alert.id}_${level.level}`, timerId);
    });
  }

  private executeEscalation(alert: CrisisAlert, level: EscalationLevel): void {
    console.log(`🚨 Executing escalation level ${level.level} for alert ${alert.id}`);
    
    // Update alert status
    alert.status = 'escalated';
    
    // Send escalation notification
    this.sendEscalationNotification(alert, level);
  }

  private async sendEscalationNotification(alert: CrisisAlert, level: EscalationLevel): Promise<void> {
    try {
      await fetch('/api/monitoring/escalation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: alert.id,
          escalationLevel: level.level,
          action: level.action,
          contacts: level.contacts,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.error('Failed to send escalation notification:', error);
    }
  }

  private checkEscalationTimers(): void {
    // Clean up completed escalation timers
    for (const [key, timer] of this.escalationTimers.entries()) {
      const alertId = key.split('_')[0];
      const alert = this.activeAlerts.get(alertId);
      
      if (!alert || alert.status !== 'active') {
        clearTimeout(timer);
        this.escalationTimers.delete(key);
      }
    }
  }

  private startSystemStatusChecks(): void {
    // Comprehensive system health check every minute
    setInterval(() => {
      this.performSystemHealthCheck();
    }, 60000);
  }

  private performSystemHealthCheck(): void {
    const healthChecks = [
      this.checkCrisisButtonAvailability(),
      this.checkAPIEndpoints(),
      this.checkServiceWorkerStatus(),
      this.checkLocalStorageAvailability(),
      this.checkNetworkConnectivity()
    ];

    Promise.all(healthChecks).then(results => {
      const failedChecks = results.filter(result => !result.success);
      
      if (failedChecks.length > 0) {
        this.createSystemAlert(failedChecks);
      }
    });
  }

  private checkCrisisButtonAvailability(): Promise<{ success: boolean; check: string }> {
    return Promise.resolve({
      success: document.querySelectorAll('[data-crisis-button]').length > 0,
      check: 'crisis_button_availability'
    });
  }

  private async checkAPIEndpoints(): Promise<{ success: boolean; check: string }> {
    try {
      const response = await fetch('/api/health/ping', { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return { success: response.ok, check: 'api_endpoints' };
    } catch {
      return { success: false, check: 'api_endpoints' };
    }
  }

  private checkServiceWorkerStatus(): Promise<{ success: boolean; check: string }> {
    return Promise.resolve({
      success: 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null,
      check: 'service_worker'
    });
  }

  private checkLocalStorageAvailability(): Promise<{ success: boolean; check: string }> {
    try {
      localStorage.setItem('alchm_health_check', 'test');
      localStorage.removeItem('alchm_health_check');
      return Promise.resolve({ success: true, check: 'local_storage' });
    } catch {
      return Promise.resolve({ success: false, check: 'local_storage' });
    }
  }

  private checkNetworkConnectivity(): Promise<{ success: boolean; check: string }> {
    return Promise.resolve({
      success: navigator.onLine,
      check: 'network_connectivity'
    });
  }

  private createSystemAlert(failedChecks: Array<{ success: boolean; check: string }>): void {
    const alertId = `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const alert: CrisisAlert = {
      id: alertId,
      userId: 'system',
      alertType: 'system_failure',
      severity: failedChecks.length > 2 ? 'critical' : 'high',
      riskLevel: 'none',
      triggers: failedChecks.map(check => check.check),
      context: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        sessionId: this.getSessionId()
      },
      interventionActions: [],
      escalationChain: [],
      status: 'active',
      createdAt: Date.now()
    };

    this.activeAlerts.set(alertId, alert);
    this.alertQueue.push(alert);
  }

  // Helper methods
  private getSessionId(): string {
    return sessionStorage.getItem('alchm_session_id') || 
           `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | null {
    return localStorage.getItem('alchm_user_id') || null;
  }

  private getBatteryLevel(): number | undefined {
    return (navigator as any).getBattery?.()?.then((battery: any) => battery.level);
  }

  private getConnectionType(): string | undefined {
    return (navigator as any).connection?.effectiveType;
  }

  private getLastUserActivity(userId: string): number {
    const stored = localStorage.getItem(`alchm_last_activity_${userId}`);
    return stored ? parseInt(stored) : Date.now();
  }

  // Public API
  public getActiveAlerts(): CrisisAlert[] {
    return Array.from(this.activeAlerts.values());
  }

  public acknowledgeAlert(alertId: string, acknowledgedBy: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedBy = acknowledgedBy;
      
      // Clear escalation timers
      this.escalationTimers.forEach((timer, key) => {
        if (key.startsWith(alertId)) {
          clearTimeout(timer);
          this.escalationTimers.delete(key);
        }
      });
    }
  }

  public resolveAlert(alertId: string): void {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = Date.now();
      
      // Clear escalation timers
      this.escalationTimers.forEach((timer, key) => {
        if (key.startsWith(alertId)) {
          clearTimeout(timer);
          this.escalationTimers.delete(key);
        }
      });
    }
  }

  public generateMonitoringReport(): string {
    const activeAlertsCount = this.getActiveAlerts().length;
    const criticalAlerts = this.getActiveAlerts().filter(a => a.severity === 'critical' || a.severity === 'emergency');
    
    let report = '🚨 REAL-TIME CRISIS MONITORING REPORT\n';
    report += '=' .repeat(50) + '\n\n';
    
    report += `Monitoring Status: ${this.monitoringEnabled ? '✅ ACTIVE' : '❌ DISABLED'}\n`;
    report += `Active Alerts: ${activeAlertsCount}\n`;
    report += `Critical Alerts: ${criticalAlerts.length}\n`;
    report += `Escalation Timers: ${this.escalationTimers.size}\n\n`;
    
    if (criticalAlerts.length > 0) {
      report += `🔴 CRITICAL ALERTS:\n`;
      criticalAlerts.forEach(alert => {
        report += `  • ${alert.id.substring(0, 8)}: ${alert.riskLevel} risk, ${alert.triggers.length} triggers\n`;
      });
      report += '\n';
    }
    
    report += `Configuration:\n`;
    report += `  Crisis Detection: ${this.config.enableRealTimeDetection ? '✅' : '❌'}\n`;
    report += `  Keyword Threshold: ${this.config.crisisKeywordThreshold}\n`;
    report += `  Crisis Response Time Target: ${this.config.performanceThresholds.crisisResponseTime}ms\n`;
    report += `  Cultural Adaptations: ${this.config.culturalAdaptations.enabled ? '✅' : '❌'}\n`;
    
    return report;
  }

  public cleanup(): void {
    this.monitoringEnabled = false;
    
    // Clear all timers
    this.escalationTimers.forEach(timer => clearTimeout(timer));
    this.escalationTimers.clear();
    
    // Clear active alerts
    this.activeAlerts.clear();
    this.alertQueue = [];
  }
}

// Initialize monitoring system
export const realTimeCrisisMonitor = RealTimeCrisisMonitoringSystem.getInstance();

// Auto-start monitoring on page load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    realTimeCrisisMonitor.startRealTimeMonitoring();
  });
}

export default RealTimeCrisisMonitoringSystem;