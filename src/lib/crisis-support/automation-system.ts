/**
 * ALCHM 24/7 Crisis Support System Automation
 * 
 * Comprehensive automated crisis support system that provides round-the-clock
 * safety monitoring, intervention triggers, and emergency response protocols.
 */

import { crisisDetectionEngine } from '../crisis-detection/crisis-detection-engine';
import { CrisisDetectionResult, CrisisResource, InterventionLevel } from '../crisis-detection/types';
import { analytics } from '../analytics';

export interface CrisisAlert {
  id: string;
  userId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectionResult: CrisisDetectionResult;
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'escalated' | 'resolved';
  responseTime?: number;
  interventions: CrisisIntervention[];
  followUp?: CrisisFollowUp;
}

export interface CrisisIntervention {
  id: string;
  type: 'automated' | 'human' | 'system';
  method: 'overlay' | 'notification' | 'email' | 'call' | 'emergency_services';
  resourcesProvided: CrisisResource[];
  userResponse?: 'engaged' | 'dismissed' | 'no_response';
  timestamp: Date;
  effectiveness?: number;
}

export interface CrisisFollowUp {
  scheduledTime: Date;
  method: 'gentle_check' | 'resource_reminder' | 'wellness_survey';
  completed: boolean;
  userEngagement?: 'positive' | 'neutral' | 'concerning';
  nextSteps?: string[];
}

export interface EmergencyContact {
  id: string;
  type: 'personal' | 'professional' | 'service';
  name: string;
  relationship: string;
  contact: string;
  contactMethod: 'phone' | 'email' | 'text';
  priority: number;
  timeZone?: string;
  availability?: string;
}

export interface CrisisProtocol {
  interventionLevel: InterventionLevel;
  automaticActions: AutomaticAction[];
  humanEscalationTriggers: string[];
  followUpSchedule: FollowUpSchedule;
  emergencyContacts: EmergencyContact[];
}

export interface AutomaticAction {
  action: 'show_resources' | 'gentle_check_in' | 'crisis_overlay' | 'emergency_alert' | 'disable_harmful_features';
  delaySeconds: number;
  conditions: string[];
  maxAttempts: number;
}

export interface FollowUpSchedule {
  immediate: number; // minutes
  short: number; // hours  
  medium: number; // days
  long: number; // weeks
}

export class CrisisSupportAutomationSystem {
  private protocols: Map<InterventionLevel, CrisisProtocol> = new Map();
  private activeAlerts: Map<string, CrisisAlert> = new Map();
  private userEmergencyContacts: Map<string, EmergencyContact[]> = new Map();
  private isMonitoring: boolean = false;

  constructor() {
    this.initializeProtocols();
    this.startMonitoring();
  }

  /**
   * Initialize crisis response protocols
   */
  private initializeProtocols(): void {
    // Immediate intervention protocol
    this.protocols.set('immediate', {
      interventionLevel: 'immediate',
      automaticActions: [
        {
          action: 'crisis_overlay',
          delaySeconds: 0,
          conditions: ['high_confidence'],
          maxAttempts: 1
        },
        {
          action: 'emergency_alert',
          delaySeconds: 30,
          conditions: ['no_user_response'],
          maxAttempts: 3
        }
      ],
      humanEscalationTriggers: ['no_response_5_minutes', 'explicit_threat', 'method_mentioned'],
      followUpSchedule: {
        immediate: 15, // 15 minutes
        short: 2,      // 2 hours
        medium: 1,     // 1 day
        long: 1        // 1 week
      },
      emergencyContacts: []
    });

    // Supportive intervention protocol
    this.protocols.set('supportive', {
      interventionLevel: 'supportive',
      automaticActions: [
        {
          action: 'show_resources',
          delaySeconds: 5,
          conditions: ['medium_confidence'],
          maxAttempts: 2
        },
        {
          action: 'gentle_check_in',
          delaySeconds: 300, // 5 minutes
          conditions: ['no_engagement'],
          maxAttempts: 2
        }
      ],
      humanEscalationTriggers: ['repeated_concerning_content', 'escalating_language'],
      followUpSchedule: {
        immediate: 60, // 1 hour
        short: 24,     // 24 hours
        medium: 3,     // 3 days
        long: 2        // 2 weeks
      },
      emergencyContacts: []
    });

    // Gentle intervention protocol
    this.protocols.set('gentle', {
      interventionLevel: 'gentle',
      automaticActions: [
        {
          action: 'gentle_check_in',
          delaySeconds: 30,
          conditions: ['pattern_detected'],
          maxAttempts: 1
        }
      ],
      humanEscalationTriggers: ['pattern_escalation'],
      followUpSchedule: {
        immediate: 0,  // No immediate follow-up
        short: 0,      // No short-term follow-up
        medium: 7,     // 1 week
        long: 4        // 1 month
      },
      emergencyContacts: []
    });
  }

  /**
   * Start 24/7 monitoring system
   */
  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // Monitor active alerts
    setInterval(() => {
      this.processActiveAlerts();
    }, 60000); // Every minute

    // Process follow-ups
    setInterval(() => {
      this.processScheduledFollowUps();
    }, 300000); // Every 5 minutes

    // Health check
    setInterval(() => {
      this.performSystemHealthCheck();
    }, 900000); // Every 15 minutes

    console.log('[CrisisSupport] 24/7 monitoring system started');
  }

  /**
   * Process crisis detection and trigger appropriate response
   */
  public async processCrisisDetection(
    userId: string, 
    detectionResult: CrisisDetectionResult
  ): Promise<CrisisAlert | null> {
    
    if (detectionResult.interventionLevel === 'none') {
      return null;
    }

    // Create crisis alert
    const alert: CrisisAlert = {
      id: this.generateAlertId(),
      userId,
      severity: this.mapInterventionLevelToSeverity(detectionResult.interventionLevel),
      detectionResult,
      timestamp: new Date(),
      status: 'pending',
      interventions: []
    };

    // Store alert
    this.activeAlerts.set(alert.id, alert);

    // Execute protocol
    await this.executeProtocol(alert);

    // Log alert
    analytics.track('crisis_alert_created', {
      alertId: alert.id,
      userId,
      severity: alert.severity,
      interventionLevel: detectionResult.interventionLevel,
      confidence: detectionResult.confidence
    });

    return alert;
  }

  /**
   * Execute crisis response protocol
   */
  private async executeProtocol(alert: CrisisAlert): Promise<void> {
    const protocol = this.protocols.get(alert.detectionResult.interventionLevel);
    if (!protocol) return;

    // Execute automatic actions
    for (const action of protocol.automaticActions) {
      setTimeout(async () => {
        await this.executeAutomaticAction(alert, action);
      }, action.delaySeconds * 1000);
    }

    // Schedule follow-ups
    this.scheduleFollowUps(alert, protocol.followUpSchedule);

    // Check escalation triggers
    await this.checkEscalationTriggers(alert, protocol.humanEscalationTriggers);
  }

  /**
   * Execute automatic intervention action
   */
  private async executeAutomaticAction(alert: CrisisAlert, action: AutomaticAction): Promise<void> {
    // Check if conditions are met
    if (!this.evaluateActionConditions(alert, action.conditions)) {
      return;
    }

    const intervention: CrisisIntervention = {
      id: this.generateInterventionId(),
      type: 'automated',
      method: this.mapActionToMethod(action.action),
      resourcesProvided: alert.detectionResult.recommendedResources,
      timestamp: new Date()
    };

    try {
      switch (action.action) {
        case 'show_resources':
          await this.showCrisisResources(alert.userId, alert.detectionResult.recommendedResources);
          break;
        
        case 'gentle_check_in':
          await this.sendGentleCheckIn(alert.userId);
          break;
        
        case 'crisis_overlay':
          await this.triggerCrisisOverlay(alert.userId, alert.detectionResult);
          break;
        
        case 'emergency_alert':
          await this.sendEmergencyAlert(alert);
          break;
        
        case 'disable_harmful_features':
          await this.disableHarmfulFeatures(alert.userId);
          break;
      }

      intervention.userResponse = await this.trackUserResponse(alert.userId, intervention.id);
      intervention.effectiveness = this.calculateInterventionEffectiveness(intervention);

    } catch (error) {
      console.error('[CrisisSupport] Action execution failed:', error);
    }

    // Add intervention to alert
    alert.interventions.push(intervention);
    this.activeAlerts.set(alert.id, alert);

    // Log intervention
    analytics.track('crisis_intervention_executed', {
      alertId: alert.id,
      interventionId: intervention.id,
      type: intervention.type,
      method: intervention.method,
      userResponse: intervention.userResponse
    });
  }

  /**
   * Schedule follow-up check-ins
   */
  private scheduleFollowUps(alert: CrisisAlert, schedule: FollowUpSchedule): void {
    const scheduleFollowUp = (minutes: number, method: CrisisFollowUp['method']) => {
      if (minutes === 0) return;

      setTimeout(async () => {
        await this.executeFollowUp(alert.userId, method);
      }, minutes * 60 * 1000);
    };

    scheduleFollowUp(schedule.immediate, 'gentle_check');
    scheduleFollowUp(schedule.short * 60, 'resource_reminder');
    scheduleFollowUp(schedule.medium * 24 * 60, 'wellness_survey');
  }

  /**
   * Check for human escalation triggers
   */
  private async checkEscalationTriggers(alert: CrisisAlert, triggers: string[]): Promise<void> {
    for (const trigger of triggers) {
      if (await this.evaluateEscalationTrigger(alert, trigger)) {
        await this.escalateToHuman(alert, trigger);
        break;
      }
    }
  }

  /**
   * Escalate to human intervention
   */
  private async escalateToHuman(alert: CrisisAlert, reason: string): Promise<void> {
    alert.status = 'escalated';
    
    // Notify crisis response team
    await this.notifyCrisisResponseTeam(alert, reason);

    // Contact emergency contacts if available
    const emergencyContacts = this.userEmergencyContacts.get(alert.userId);
    if (emergencyContacts && alert.severity === 'critical') {
      await this.contactEmergencyContacts(alert, emergencyContacts);
    }

    analytics.track('crisis_human_escalation', {
      alertId: alert.id,
      userId: alert.userId,
      reason,
      severity: alert.severity,
      escalationTime: Date.now() - alert.timestamp.getTime()
    });
  }

  /**
   * Execute follow-up check-in
   */
  private async executeFollowUp(userId: string, method: CrisisFollowUp['method']): Promise<void> {
    const followUp: CrisisFollowUp = {
      scheduledTime: new Date(),
      method,
      completed: false
    };

    try {
      switch (method) {
        case 'gentle_check':
          await this.sendGentleCheckIn(userId);
          break;
        
        case 'resource_reminder':
          await this.sendResourceReminder(userId);
          break;
        
        case 'wellness_survey':
          await this.sendWellnessSurvey(userId);
          break;
      }

      followUp.completed = true;
      followUp.userEngagement = await this.assessUserEngagement(userId);

    } catch (error) {
      console.error('[CrisisSupport] Follow-up failed:', error);
    }

    analytics.track('crisis_followup_executed', {
      userId,
      method,
      completed: followUp.completed,
      userEngagement: followUp.userEngagement
    });
  }

  /**
   * Process active alerts for timeouts and updates
   */
  private async processActiveAlerts(): Promise<void> {
    const now = new Date();

    for (const [alertId, alert] of this.activeAlerts.entries()) {
      const timeSinceAlert = now.getTime() - alert.timestamp.getTime();

      // Check for response timeouts
      if (alert.status === 'pending' && timeSinceAlert > 300000) { // 5 minutes
        if (alert.severity === 'critical') {
          await this.escalateToHuman(alert, 'no_response_timeout');
        }
      }

      // Auto-resolve gentle interventions after 24 hours
      if (alert.severity === 'low' && timeSinceAlert > 86400000) { // 24 hours
        alert.status = 'resolved';
        this.activeAlerts.delete(alertId);
      }
    }
  }

  /**
   * Process scheduled follow-ups
   */
  private async processScheduledFollowUps(): Promise<void> {
    // This would check a scheduled follow-up queue
    // Implementation depends on persistent storage solution
  }

  /**
   * Perform system health check
   */
  private async performSystemHealthCheck(): Promise<void> {
    const healthMetrics = {
      activeAlerts: this.activeAlerts.size,
      systemUptime: process.uptime(),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024,
      lastCheckTime: new Date()
    };

    // Log health metrics
    analytics.track('crisis_system_health_check', healthMetrics);

    // Alert if system health is concerning
    if (healthMetrics.memoryUsage > 100 || healthMetrics.activeAlerts > 50) {
      console.warn('[CrisisSupport] System health warning:', healthMetrics);
    }
  }

  // Helper methods (implementation would depend on specific integrations)
  private generateAlertId(): string { return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; }
  private generateInterventionId(): string { return `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; }
  
  private mapInterventionLevelToSeverity(level: InterventionLevel): CrisisAlert['severity'] {
    const mapping = {
      immediate: 'critical' as const,
      supportive: 'high' as const,
      gentle: 'medium' as const,
      none: 'low' as const
    };
    return mapping[level];
  }

  private mapActionToMethod(action: string): CrisisIntervention['method'] {
    const mapping = {
      show_resources: 'overlay' as const,
      gentle_check_in: 'notification' as const,
      crisis_overlay: 'overlay' as const,
      emergency_alert: 'emergency_services' as const,
      disable_harmful_features: 'system' as const
    };
    return mapping[action as keyof typeof mapping] || 'notification';
  }

  private evaluateActionConditions(alert: CrisisAlert, conditions: string[]): boolean {
    // Implementation would check various conditions
    return true; // Simplified for demo
  }

  private async evaluateEscalationTrigger(alert: CrisisAlert, trigger: string): Promise<boolean> {
    // Implementation would evaluate specific escalation conditions
    return false; // Simplified for demo
  }

  // Placeholder methods for specific actions
  private async showCrisisResources(userId: string, resources: CrisisResource[]): Promise<void> {}
  private async sendGentleCheckIn(userId: string): Promise<void> {}
  private async triggerCrisisOverlay(userId: string, result: CrisisDetectionResult): Promise<void> {}
  private async sendEmergencyAlert(alert: CrisisAlert): Promise<void> {}
  private async disableHarmfulFeatures(userId: string): Promise<void> {}
  private async trackUserResponse(userId: string, interventionId: string): Promise<CrisisIntervention['userResponse']> { return 'no_response'; }
  private calculateInterventionEffectiveness(intervention: CrisisIntervention): number { return 0.5; }
  private async notifyCrisisResponseTeam(alert: CrisisAlert, reason: string): Promise<void> {}
  private async contactEmergencyContacts(alert: CrisisAlert, contacts: EmergencyContact[]): Promise<void> {}
  private async sendResourceReminder(userId: string): Promise<void> {}
  private async sendWellnessSurvey(userId: string): Promise<void> {}
  private async assessUserEngagement(userId: string): Promise<CrisisFollowUp['userEngagement']> { return 'neutral'; }
}

// Export singleton instance
export const crisisSupportAutomationSystem = new CrisisSupportAutomationSystem();