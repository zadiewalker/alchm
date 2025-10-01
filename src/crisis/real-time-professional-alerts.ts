/**
 * ALCHM Real-Time Professional Alert System
 * 
 * Secure, HIPAA-compliant notification system that immediately alerts
 * mental health professionals when crisis interventions are needed.
 * 
 * Features:
 * - Multi-channel alert delivery (push, SMS, email, secure messaging)
 * - Encrypted crisis context sharing
 * - Professional response acknowledgment tracking
 * - Escalation to backup professionals if no response
 * - Real-time status updates for crisis coordinators
 */

import { CrisisEvent } from './emergency-escalation-system';
import { CrisisProfessional } from '../professional/crisis-professional-network';

export interface ProfessionalAlert {
  id: string;
  crisisEventId: string;
  professionalId: string;
  alertType: 'crisis_intervention' | 'safety_check' | 'follow_up' | 'emergency_escalation';
  severity: 'low' | 'moderate' | 'high' | 'severe' | 'imminent';
  timestamp: Date;
  expirationTime: Date;
  
  // HIPAA-compliant crisis context
  encryptedContext: {
    crisisType: string;
    severityIndicators: string[];
    culturalConsiderations: string;
    immediateNeeds: string[];
    safetyRisks: string[];
    // No PII - all encrypted and anonymized
  };
  
  // User consent and privacy settings
  privacyLevel: 'minimal' | 'standard' | 'detailed';
  userConsent: {
    professionalContact: boolean;
    contextSharing: boolean;
    followUpCare: boolean;
    emergencyServices: boolean;
  };
  
  // Delivery preferences
  deliveryMethods: {
    push_notification: boolean;
    secure_messaging: boolean;
    sms: boolean;
    email: boolean;
    phone_call: boolean;
  };
  
  // Response tracking
  response: {
    acknowledged: boolean;
    acknowledgedAt?: Date;
    accepted: boolean;
    acceptedAt?: Date;
    estimatedResponseTime?: number; // minutes
    professionalNotes?: string; // Encrypted
    escalationReason?: string;
  };
  
  // Geographic context for mobile response
  approximateLocation?: {
    region: string; // City/county level only
    timezone: string;
    mobileTeamAvailable: boolean;
  };
}

export interface AlertDeliveryChannel {
  channel: string;
  priority: number;
  maxAttempts: number;
  retryInterval: number; // seconds
  successRate: number;
  averageDeliveryTime: number; // seconds
}

export interface ProfessionalNotificationPreferences {
  professionalId: string;
  channels: {
    push: {
      enabled: boolean;
      deviceTokens: string[];
      quietHours: { start: string; end: string };
    };
    sms: {
      enabled: boolean;
      phoneNumber: string;
      emergencyOnly: boolean;
    };
    email: {
      enabled: boolean;
      primaryEmail: string;
      backupEmail?: string;
      immediateDelivery: boolean;
    };
    secureMessaging: {
      enabled: boolean;
      platform: string;
      userId: string;
    };
    phoneCall: {
      enabled: boolean;
      primaryNumber: string;
      backupNumber?: string;
      severityThreshold: 'high' | 'severe';
    };
  };
  escalationPreferences: {
    noResponseTimeout: number; // minutes
    backupProfessionals: string[];
    autoAcceptCriteria?: string[];
  };
  availability: {
    defaultStatus: 'available' | 'busy' | 'offline';
    currentStatus: 'available' | 'busy' | 'offline' | 'in_session';
    statusExpiration?: Date;
  };
}

export interface AlertDeliveryReceipt {
  alertId: string;
  channel: string;
  deliveredAt: Date;
  deliveryStatus: 'sent' | 'delivered' | 'failed' | 'acknowledged';
  errorReason?: string;
  responseTime?: number;
  retryAttempt: number;
}

export interface CrisisCoordinatorUpdate {
  eventId: string;
  coordinatorId: string;
  updateType: 'alert_sent' | 'professional_assigned' | 'no_response' | 'escalation_triggered';
  timestamp: Date;
  details: {
    professionalsContacted: string[];
    responseTimes: number[];
    escalationLevel: number;
    nextActions: string[];
  };
}

export class RealTimeProfessionalAlertSystem {
  private alertChannels: Map<string, AlertDeliveryChannel> = new Map();
  private notificationPreferences: Map<string, ProfessionalNotificationPreferences> = new Map();
  private activeAlerts: Map<string, ProfessionalAlert> = new Map();
  private deliveryReceipts: Map<string, AlertDeliveryReceipt[]> = new Map();
  private encryptionService: EncryptionService;
  private messagingService: SecureMessagingService;
  private coordinatorNotifications: CrisisCoordinatorNotificationService;

  constructor(
    encryptionService: EncryptionService,
    messagingService: SecureMessagingService,
    coordinatorService: CrisisCoordinatorNotificationService
  ) {
    this.encryptionService = encryptionService;
    this.messagingService = messagingService;
    this.coordinatorNotifications = coordinatorService;
    this.initializeDeliveryChannels();
    this.startResponseMonitoring();
  }

  /**
   * Send immediate crisis alert to assigned professional
   */
  async sendProfessionalAlert(
    crisisEvent: CrisisEvent,
    professional: CrisisProfessional,
    alertType: ProfessionalAlert['alertType'] = 'crisis_intervention'
  ): Promise<{ sent: boolean; alertId: string; estimatedResponse: Date }> {
    
    try {
      // Create encrypted alert
      const alert = await this.createSecureAlert(crisisEvent, professional, alertType);
      
      // Get professional's notification preferences
      const preferences = this.notificationPreferences.get(professional.id);
      if (!preferences) {
        throw new Error(`No notification preferences found for professional ${professional.id}`);
      }

      // Deliver alert through multiple channels simultaneously
      const deliveryPromises = await this.deliverMultiChannelAlert(alert, preferences);
      
      // Wait for at least one successful delivery
      const deliveryResults = await Promise.allSettled(deliveryPromises);
      const successfulDeliveries = deliveryResults.filter(result => 
        result.status === 'fulfilled' && result.value.deliveryStatus === 'sent'
      );

      if (successfulDeliveries.length === 0) {
        throw new Error('Failed to deliver alert through any channel');
      }

      // Store active alert for tracking
      this.activeAlerts.set(alert.id, alert);

      // Schedule response timeout monitoring
      this.scheduleResponseTimeout(alert, preferences.escalationPreferences.noResponseTimeout);

      // Notify crisis coordinators
      await this.coordinatorNotifications.notifyCoordinators({
        eventId: crisisEvent.id,
        coordinatorId: 'system',
        updateType: 'alert_sent',
        timestamp: new Date(),
        details: {
          professionalsContacted: [professional.id],
          responseTimes: [],
          escalationLevel: 1,
          nextActions: ['await_professional_response']
        }
      });

      // Calculate estimated response time
      const estimatedResponse = new Date(
        Date.now() + professional.availability.averageResponseTime * 1000
      );

      return {
        sent: true,
        alertId: alert.id,
        estimatedResponse
      };

    } catch (error) {
      console.error('Failed to send professional alert:', error);
      
      // Notify crisis coordinators of failure
      await this.coordinatorNotifications.notifyCoordinators({
        eventId: crisisEvent.id,
        coordinatorId: 'system',
        updateType: 'no_response',
        timestamp: new Date(),
        details: {
          professionalsContacted: [professional.id],
          responseTimes: [],
          escalationLevel: 2,
          nextActions: ['escalate_to_backup_professional']
        }
      });

      return {
        sent: false,
        alertId: '',
        estimatedResponse: new Date()
      };
    }
  }

  /**
   * Create HIPAA-compliant encrypted alert
   */
  private async createSecureAlert(
    crisisEvent: CrisisEvent,
    professional: CrisisProfessional,
    alertType: ProfessionalAlert['alertType']
  ): Promise<ProfessionalAlert> {
    
    // Create anonymized context (no PII)
    const contextData = {
      crisisType: this.categorizeCrisisType(crisisEvent),
      severityIndicators: this.extractSeverityIndicators(crisisEvent),
      culturalConsiderations: this.anonymizeCulturalContext(crisisEvent.culturalContext),
      immediateNeeds: this.identifyImmediateNeeds(crisisEvent),
      safetyRisks: this.assessSafetyRisks(crisisEvent)
    };

    // Encrypt context for professional access
    const encryptedContext = await this.encryptionService.encryptForProfessional(
      contextData,
      professional.id
    );

    return {
      id: this.generateAlertId(),
      crisisEventId: crisisEvent.id,
      professionalId: professional.id,
      alertType,
      severity: crisisEvent.severity,
      timestamp: new Date(),
      expirationTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
      
      encryptedContext,
      
      privacyLevel: this.determinePrivacyLevel(crisisEvent.userConsent),
      userConsent: crisisEvent.userConsent,
      
      deliveryMethods: this.selectDeliveryMethods(professional, crisisEvent.severity),
      
      response: {
        acknowledged: false,
        accepted: false
      },
      
      approximateLocation: crisisEvent.location ? {
        region: await this.anonymizeLocation(crisisEvent.location),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        mobileTeamAvailable: professional.geographic.mobileTeamAccess
      } : undefined
    };
  }

  /**
   * Deliver alert through multiple channels simultaneously
   */
  private async deliverMultiChannelAlert(
    alert: ProfessionalAlert,
    preferences: ProfessionalNotificationPreferences
  ): Promise<Promise<AlertDeliveryReceipt>[]> {
    
    const deliveryPromises: Promise<AlertDeliveryReceipt>[] = [];

    // Push notification (highest priority, fastest)
    if (alert.deliveryMethods.push_notification && preferences.channels.push.enabled) {
      deliveryPromises.push(this.sendPushNotification(alert, preferences.channels.push));
    }

    // Secure messaging (encrypted, professional platform)
    if (alert.deliveryMethods.secure_messaging && preferences.channels.secureMessaging.enabled) {
      deliveryPromises.push(this.sendSecureMessage(alert, preferences.channels.secureMessaging));
    }

    // SMS (for immediate alerts)
    if (alert.deliveryMethods.sms && preferences.channels.sms.enabled) {
      const shouldSendSMS = alert.severity === 'severe' || alert.severity === 'imminent' || 
                           !preferences.channels.sms.emergencyOnly;
      if (shouldSendSMS) {
        deliveryPromises.push(this.sendSMSAlert(alert, preferences.channels.sms));
      }
    }

    // Email (for typeof window !== 'undefined' && documentation and follow-up)
    if (alert.deliveryMethods.email && preferences.channels.email.enabled) {
      deliveryPromises.push(this.sendEmailAlert(alert, preferences.channels.email));
    }

    // Phone call (for highest severity only)
    if (alert.deliveryMethods.phone_call && preferences.channels.phoneCall.enabled) {
      const shouldCall = alert.severity === 'severe' || alert.severity === 'imminent';
      const meetsThreshold = alert.severity === preferences.channels.phoneCall.severityThreshold ||
                            (preferences.channels.phoneCall.severityThreshold === 'high' && 
                             (alert.severity === 'severe' || alert.severity === 'imminent'));
      
      if (shouldCall && meetsThreshold) {
        deliveryPromises.push(this.initiatePhoneCall(alert, preferences.channels.phoneCall));
      }
    }

    return deliveryPromises;
  }

  /**
   * Send push notification to professional's devices
   */
  private async sendPushNotification(
    alert: ProfessionalAlert,
    pushConfig: ProfessionalNotificationPreferences['channels']['push']
  ): Promise<AlertDeliveryReceipt> {
    
    const receipt: AlertDeliveryReceipt = {
      alertId: alert.id,
      channel: 'push_notification',
      deliveredAt: new Date(),
      deliveryStatus: 'failed',
      retryAttempt: 1
    };

    try {
      // Check quiet hours
      if (this.isInQuietHours(pushConfig.quietHours) && alert.severity !== 'imminent') {
        receipt.deliveryStatus = 'failed';
        receipt.errorReason = 'quiet_hours_active';
        return receipt;
      }

      // Send to all registered devices
      const pushPayload = {
        title: `ALCHM Crisis Alert - ${alert.severity.toUpperCase()}`,
        body: `Crisis intervention needed. Tap to respond.`,
        data: {
          alertId: alert.id,
          crisisEventId: alert.crisisEventId,
          severity: alert.severity,
          alertType: alert.alertType,
          encrypted: true
        },
        priority: alert.severity === 'imminent' || alert.severity === 'severe' ? 'high' : 'normal'
      };

      const results = await Promise.allSettled(
        pushConfig.deviceTokens.map(token => 
          this.messagingService.sendPushNotification(token, pushPayload)
        )
      );

      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      if (successCount > 0) {
        receipt.deliveryStatus = 'sent';
        receipt.responseTime = Date.now() - alert.timestamp.getTime();
      } else {
        receipt.errorReason = 'all_devices_failed';
      }

    } catch (error) {
      receipt.errorReason = error.message;
    }

    return receipt;
  }

  /**
   * Send secure encrypted message to professional platform
   */
  private async sendSecureMessage(
    alert: ProfessionalAlert,
    messagingConfig: ProfessionalNotificationPreferences['channels']['secureMessaging']
  ): Promise<AlertDeliveryReceipt> {
    
    const receipt: AlertDeliveryReceipt = {
      alertId: alert.id,
      channel: 'secure_messaging',
      deliveredAt: new Date(),
      deliveryStatus: 'failed',
      retryAttempt: 1
    };

    try {
      const secureMessage = {
        recipientId: messagingConfig.userId,
        subject: `Crisis Alert ${alert.id}`,
        encryptedContent: alert.encryptedContext,
        priority: alert.severity === 'imminent' ? 'urgent' : 'high',
        requiresResponse: true,
        expirationTime: alert.expirationTime
      };

      const messageId = await this.messagingService.sendSecureMessage(
        messagingConfig.platform,
        secureMessage
      );

      if (messageId) {
        receipt.deliveryStatus = 'sent';
        receipt.responseTime = Date.now() - alert.timestamp.getTime();
      }

    } catch (error) {
      receipt.errorReason = error.message;
    }

    return receipt;
  }

  /**
   * Send SMS alert (limited information due to non-encrypted channel)
   */
  private async sendSMSAlert(
    alert: ProfessionalAlert,
    smsConfig: ProfessionalNotificationPreferences['channels']['sms']
  ): Promise<AlertDeliveryReceipt> {
    
    const receipt: AlertDeliveryReceipt = {
      alertId: alert.id,
      channel: 'sms',
      deliveredAt: new Date(),
      deliveryStatus: 'failed',
      retryAttempt: 1
    };

    try {
      // SMS content is minimal due to security concerns
      const smsContent = `ALCHM Crisis Alert ${alert.id.slice(-8)}. ${alert.severity.toUpperCase()} priority. Login to secure platform for details. Respond ASAP.`;

      const messageId = await this.messagingService.sendSMS(
        smsConfig.phoneNumber,
        smsContent
      );

      if (messageId) {
        receipt.deliveryStatus = 'sent';
        receipt.responseTime = Date.now() - alert.timestamp.getTime();
      }

    } catch (error) {
      receipt.errorReason = error.message;
    }

    return receipt;
  }

  /**
   * Send email alert with encrypted attachment
   */
  private async sendEmailAlert(
    alert: ProfessionalAlert,
    emailConfig: ProfessionalNotificationPreferences['channels']['email']
  ): Promise<AlertDeliveryReceipt> {
    
    const receipt: AlertDeliveryReceipt = {
      alertId: alert.id,
      channel: 'email',
      deliveredAt: new Date(),
      deliveryStatus: 'failed',
      retryAttempt: 1
    };

    try {
      const emailContent = {
        to: emailConfig.primaryEmail,
        subject: `ALCHM Crisis Intervention Required - ${alert.severity.toUpperCase()}`,
        body: this.generateEmailBody(alert),
        encryptedAttachment: alert.encryptedContext,
        priority: alert.severity === 'imminent' ? 'urgent' : 'high'
      };

      const messageId = await this.messagingService.sendSecureEmail(emailContent);

      if (messageId) {
        receipt.deliveryStatus = 'sent';
        receipt.responseTime = Date.now() - alert.timestamp.getTime();
      }

    } catch (error) {
      receipt.errorReason = error.message;
    }

    return receipt;
  }

  /**
   * Initiate phone call for highest priority alerts
   */
  private async initiatePhoneCall(
    alert: ProfessionalAlert,
    phoneConfig: ProfessionalNotificationPreferences['channels']['phoneCall']
  ): Promise<AlertDeliveryReceipt> {
    
    const receipt: AlertDeliveryReceipt = {
      alertId: alert.id,
      channel: 'phone_call',
      deliveredAt: new Date(),
      deliveryStatus: 'failed',
      retryAttempt: 1
    };

    try {
      // Automated call with alert information
      const callId = await this.messagingService.initiateCall(
        phoneConfig.primaryNumber,
        {
          message: `This is an ALCHM crisis alert. Case ID ${alert.id.slice(-8)}. ${alert.severity} priority crisis intervention needed. Please acknowledge by pressing 1 or logging into the secure platform immediately.`,
          requireAcknowledgment: true,
          maxRingTime: 30,
          fallbackNumber: phoneConfig.backupNumber
        }
      );

      if (callId) {
        receipt.deliveryStatus = 'sent';
        receipt.responseTime = Date.now() - alert.timestamp.getTime();
      }

    } catch (error) {
      receipt.errorReason = error.message;
    }

    return receipt;
  }

  /**
   * Track professional response to alert
   */
  async acknowledgeProfessionalResponse(
    alertId: string,
    professionalId: string,
    response: {
      acknowledged: boolean;
      accepted: boolean;
      estimatedResponseTime?: number;
      notes?: string;
    }
  ): Promise<void> {
    
    const alert = this.activeAlerts.get(alertId);
    if (!alert || alert.professionalId !== professionalId) {
      throw new Error('Invalid alert or professional mismatch');
    }

    // Update alert response
    alert.response = {
      ...alert.response,
      acknowledged: response.acknowledged,
      acknowledgedAt: new Date(),
      accepted: response.accepted,
      acceptedAt: response.accepted ? new Date() : undefined,
      estimatedResponseTime: response.estimatedResponseTime,
      professionalNotes: response.notes ? 
        await this.encryptionService.encrypt(response.notes) : undefined
    };

    // Notify crisis coordinators
    await this.coordinatorNotifications.notifyCoordinators({
      eventId: alert.crisisEventId,
      coordinatorId: professionalId,
      updateType: response.accepted ? 'professional_assigned' : 'no_response',
      timestamp: new Date(),
      details: {
        professionalsContacted: [professionalId],
        responseTimes: [Date.now() - alert.timestamp.getTime()],
        escalationLevel: response.accepted ? 1 : 2,
        nextActions: response.accepted ? ['monitor_intervention'] : ['find_backup_professional']
      }
    });

    // Cancel timeout monitoring if accepted
    if (response.accepted) {
      clearTimeout(this.responseTimeouts.get(alertId));
      this.responseTimeouts.delete(alertId);
    }
  }

  /**
   * Schedule response timeout monitoring
   */
  private responseTimeouts: Map<string, NodeJS.Timeout> = new Map();
  
  private scheduleResponseTimeout(alert: ProfessionalAlert, timeoutMinutes: number): void {
    const timeout = setTimeout(async () => {
      const currentAlert = this.activeAlerts.get(alert.id);
      if (currentAlert && !currentAlert.response.accepted) {
        await this.handleResponseTimeout(currentAlert);
      }
    }, timeoutMinutes * 60 * 1000);
    
    this.responseTimeouts.set(alert.id, timeout);
  }

  /**
   * Handle professional non-response timeout
   */
  private async handleResponseTimeout(alert: ProfessionalAlert): Promise<void> {
    // Notify crisis coordinators of timeout
    await this.coordinatorNotifications.notifyCoordinators({
      eventId: alert.crisisEventId,
      coordinatorId: 'system',
      updateType: 'escalation_triggered',
      timestamp: new Date(),
      details: {
        professionalsContacted: [alert.professionalId],
        responseTimes: [],
        escalationLevel: 2,
        nextActions: ['escalate_to_backup_network']
      }
    });

    // Clean up
    this.activeAlerts.delete(alert.id);
    this.responseTimeouts.delete(alert.id);
  }

  // Helper methods
  private initializeDeliveryChannels(): void {
    this.alertChannels.set('push_notification', {
      channel: 'push_notification',
      priority: 1,
      maxAttempts: 3,
      retryInterval: 30,
      successRate: 0.95,
      averageDeliveryTime: 2
    });

    this.alertChannels.set('secure_messaging', {
      channel: 'secure_messaging',
      priority: 2,
      maxAttempts: 2,
      retryInterval: 60,
      successRate: 0.98,
      averageDeliveryTime: 5
    });
    
    // Initialize other channels...
  }

  private startResponseMonitoring(): void {
    // Monitor alert responses and delivery receipts
    setInterval(() => {
      this.cleanupExpiredAlerts();
      this.updateDeliveryMetrics();
    }, 60000); // Every minute
  }

  private cleanupExpiredAlerts(): void {
    const now = new Date();
    for (const [alertId, alert] of this.activeAlerts.entries()) {
      if (alert.expirationTime < now) {
        this.activeAlerts.delete(alertId);
        const timeout = this.responseTimeouts.get(alertId);
        if (timeout) {
          clearTimeout(timeout);
          this.responseTimeouts.delete(alertId);
        }
      }
    }
  }

  private updateDeliveryMetrics(): void {
    // Update delivery channel success rates and timing
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private categorizeCrisisType(event: CrisisEvent): string {
    // Categorize crisis type without revealing PII
    return 'mental_health_crisis'; // Simplified
  }

  private extractSeverityIndicators(event: CrisisEvent): string[] {
    return [`severity_${event.severity}`, `trigger_${event.triggerType}`];
  }

  private anonymizeCulturalContext(context?: any): string {
    if (!context) return '';
    return `lang_${context.primaryLanguage || 'en'}`;
  }

  private identifyImmediateNeeds(event: CrisisEvent): string[] {
    const needs = ['safety_assessment', 'professional_support'];
    if (event.severity === 'severe' || event.severity === 'imminent') {
      needs.push('emergency_intervention');
    }
    return needs;
  }

  private assessSafetyRisks(event: CrisisEvent): string[] {
    const risks = [];
    if (event.severity === 'high' || event.severity === 'severe') {
      risks.push('elevated_risk');
    }
    if (event.severity === 'imminent') {
      risks.push('immediate_risk');
    }
    return risks;
  }

  private determinePrivacyLevel(consent: any): ProfessionalAlert['privacyLevel'] {
    if (consent.professionalContact && consent.contextSharing) {
      return 'detailed';
    }
    if (consent.professionalContact) {
      return 'standard';
    }
    return 'minimal';
  }

  private selectDeliveryMethods(professional: CrisisProfessional, severity: string): ProfessionalAlert['deliveryMethods'] {
    return {
      push_notification: true,
      secure_messaging: true,
      sms: severity === 'severe' || severity === 'imminent',
      email: true,
      phone_call: severity === 'imminent'
    };
  }

  private async anonymizeLocation(location: any): Promise<string> {
    // Return only city/county level location
    return 'metro_area'; // Placeholder
  }

  private isInQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date().toTimeString().slice(0, 5);
    return now >= quietHours.start && now <= quietHours.end;
  }

  private generateEmailBody(alert: ProfessionalAlert): string {
    return `
Crisis Intervention Required

Alert ID: ${alert.id}
Severity: ${alert.severity.toUpperCase()}
Time: ${alert.timestamp.toISOString()}
Type: ${alert.alertType}

Please log into the secure ALCHM professional platform immediately to access encrypted crisis details and begin intervention.

This message is confidential and intended only for the designated mental health professional.
    `;
  }
}

// Supporting interfaces and services
export interface EncryptionService {
  encryptForProfessional(data: any, professionalId: string): Promise<any>;
  encrypt(data: string): Promise<string>;
}

export interface SecureMessagingService {
  sendPushNotification(deviceToken: string, payload: any): Promise<string>;
  sendSecureMessage(platform: string, message: any): Promise<string>;
  sendSMS(phoneNumber: string, content: string): Promise<string>;
  sendSecureEmail(emailContent: any): Promise<string>;
  initiateCall(phoneNumber: string, callConfig: any): Promise<string>;
}

export interface CrisisCoordinatorNotificationService {
  notifyCoordinators(update: CrisisCoordinatorUpdate): Promise<void>;
}