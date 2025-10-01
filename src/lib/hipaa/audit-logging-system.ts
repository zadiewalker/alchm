/**
 * HIPAA Audit Logging System
 * 
 * Implements comprehensive audit controls as required by 45 CFR 164.312(b)
 * - Information Access Management
 * - Audit Controls and Integrity
 * 
 * CRITICAL: This system maintains tamper-evident logs for HIPAA compliance
 * Audit logs must be retained for 6 years (45 CFR 164.316(b)(2))
 */

import { createHash, createHmac, randomBytes } from 'crypto';
import { Timestamp } from 'firebase/firestore';

export interface AuditEvent {
  eventId: string;
  timestamp: Date;
  eventType: AuditEventType;
  userId: string;
  userRole: 'therapist' | 'patient' | 'admin' | 'system';
  patientId?: string;
  resourceAccessed: string;
  actionPerformed: AuditAction;
  outcome: 'success' | 'failure' | 'warning';
  sourceIP: string;
  userAgent: string;
  sessionId: string;
  purposeOfUse?: 'treatment' | 'payment' | 'healthcare_operations' | 'research' | 'emergency';
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  minimumNecessaryFields?: string[];
  consentStatus?: 'granted' | 'denied' | 'pending' | 'revoked';
  errorDetails?: string;
  locationInfo?: GeolocationInfo;
  deviceFingerprint: string;
  integrity: AuditIntegrity;
}

export type AuditEventType = 
  | 'phi_access' 
  | 'phi_creation' 
  | 'phi_modification' 
  | 'phi_deletion' 
  | 'consent_management' 
  | 'authentication' 
  | 'authorization' 
  | 'system_access' 
  | 'data_export' 
  | 'configuration_change'
  | 'emergency_access'
  | 'breach_incident';

export type AuditAction =
  | 'login'
  | 'logout'
  | 'read'
  | 'write'
  | 'update'
  | 'delete'
  | 'export'
  | 'print'
  | 'share'
  | 'consent_grant'
  | 'consent_revoke'
  | 'emergency_override'
  | 'failed_access'
  | 'suspicious_activity';

export interface GeolocationInfo {
  country?: string;
  region?: string;
  city?: string;
  timezone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AuditIntegrity {
  hash: string;
  previousHash: string;
  signature: string;
  chainSequence: number;
}

export interface AuditQuery {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  patientId?: string;
  eventType?: AuditEventType;
  outcome?: 'success' | 'failure' | 'warning';
  dataClassification?: string;
  limit?: number;
  offset?: number;
}

export interface AuditReport {
  reportId: string;
  generatedAt: Date;
  generatedBy: string;
  reportType: 'compliance' | 'security' | 'access_review' | 'breach_investigation';
  timeRange: {
    start: Date;
    end: Date;
  };
  totalEvents: number;
  events: AuditEvent[];
  summary: AuditSummary;
  integrityVerified: boolean;
}

export interface AuditSummary {
  phiAccessEvents: number;
  failedAccessAttempts: number;
  emergencyAccesses: number;
  consentChanges: number;
  suspiciousActivities: number;
  uniqueUsers: number;
  dataExports: number;
  topAccessedResources: { resource: string; count: number; }[];
  accessByPurpose: { purpose: string; count: number; }[];
  riskIndicators: RiskIndicator[];
}

export interface RiskIndicator {
  type: 'unusual_access_pattern' | 'excessive_access' | 'off_hours_access' | 'geographic_anomaly' | 'failed_authentication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId: string;
  timestamp: Date;
  recommendedAction: string;
}

export class AuditLoggingSystem {
  private chainSequence = 0;
  private lastHash = '';
  private readonly HMAC_SECRET: string;

  constructor(hmacSecret?: string) {
    this.HMAC_SECRET = hmacSecret || process.env.AUDIT_HMAC_SECRET || '';
    if (!this.HMAC_SECRET) {
      throw new Error('AUDIT_HMAC_SECRET is required for audit integrity');
    }
  }

  /**
   * Logs audit event with integrity protection
   * Implements 45 CFR 164.312(b) - Audit Controls
   */
  public async logEvent(
    eventData: Omit<AuditEvent, 'eventId' | 'timestamp' | 'integrity' | 'deviceFingerprint'>
  ): Promise<string> {
    try {
      const eventId = this.generateEventId();
      const timestamp = new Date();
      const deviceFingerprint = this.generateDeviceFingerprint(eventData.userAgent, eventData.sourceIP);
      
      const event: AuditEvent = {
        ...eventData,
        eventId,
        timestamp,
        deviceFingerprint,
        integrity: await this.calculateIntegrity(eventData, timestamp)
      };

      // Store in secure audit database
      await this.storeAuditEvent(event);
      
      // Check for suspicious patterns
      await this.analyzeSuspiciousActivity(event);
      
      // Trigger real-time alerts if necessary
      await this.checkAlertConditions(event);

      this.chainSequence++;
      return eventId;
    } catch (error) {
      // Even logging failures must be logged
      console.error(`Audit logging failed: ${error.message}`);
      throw new Error(`Critical audit logging failure: ${error.message}`);
    }
  }

  /**
   * Calculates cryptographic integrity for audit chain
   */
  private async calculateIntegrity(
    eventData: any,
    timestamp: Date
  ): Promise<AuditIntegrity> {
    const eventString = JSON.stringify({
      ...eventData,
      timestamp: timestamp.toISOString(),
      sequence: this.chainSequence
    });
    
    const hash = createHash('sha256').update(eventString).digest('hex');
    const signature = createHmac('sha256', this.HMAC_SECRET)
      .update(hash + this.lastHash)
      .digest('hex');
    
    const integrity: AuditIntegrity = {
      hash,
      previousHash: this.lastHash,
      signature,
      chainSequence: this.chainSequence
    };
    
    this.lastHash = hash;
    return integrity;
  }

  /**
   * Generates unique event ID
   */
  private generateEventId(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(8).toString('hex');
    return `AUD_${timestamp}_${random}`;
  }

  /**
   * Generates device fingerprint for tracking
   */
  private generateDeviceFingerprint(userAgent: string, sourceIP: string): string {
    return createHash('sha256')
      .update(`${userAgent}:${sourceIP}:${process.env.DEVICE_FINGERPRINT_SALT || 'default_salt'}`)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Stores audit event in tamper-evident storage
   */
  private async storeAuditEvent(event: AuditEvent): Promise<void> {
    // In production, this would write to a secure, append-only database
    // For Firebase implementation, use Firestore with security rules that prevent updates/deletes
    const auditDoc = {
      ...event,
      timestamp: Timestamp.fromDate(event.timestamp),
      writeProtected: true, // Prevents modification
      retentionDate: Timestamp.fromDate(new Date(Date.now() + 6 * 365 * 24 * 60 * 60 * 1000)) // 6 years
    };
    
    // Store in dedicated audit collection with strict security rules
    console.log(`AUDIT_LOG_STORE: ${JSON.stringify(auditDoc)}`);
  }

  /**
   * Analyzes event for suspicious activity patterns
   */
  private async analyzeSuspiciousActivity(event: AuditEvent): Promise<void> {
    const suspiciousPatterns = [
      this.checkExcessiveAccess(event),
      this.checkOffHoursAccess(event),
      this.checkGeographicAnomalies(event),
      this.checkUnusualAccessPatterns(event),
      this.checkFailedAuthenticationAttempts(event)
    ];

    const risks = (await Promise.all(suspiciousPatterns)).filter(Boolean);
    
    if (risks.length > 0) {
      await this.handleSuspiciousActivity(event, risks as RiskIndicator[]);
    }
  }

  /**
   * Checks for excessive access patterns
   */
  private async checkExcessiveAccess(event: AuditEvent): Promise<RiskIndicator | null> {
    // Check if user has accessed more than 50 patient records in the last hour
    // This would query recent audit logs in production
    const recentAccessCount = await this.getRecentAccessCount(event.userId, 1); // 1 hour
    
    if (recentAccessCount > 50) {
      return {
        type: 'excessive_access',
        severity: 'high',
        description: `User ${event.userId} accessed ${recentAccessCount} records in the last hour`,
        userId: event.userId,
        timestamp: event.timestamp,
        recommendedAction: 'Suspend user access and investigate immediately'
      };
    }
    
    return null;
  }

  /**
   * Checks for off-hours access
   */
  private async checkOffHoursAccess(event: AuditEvent): Promise<RiskIndicator | null> {
    const hour = event.timestamp.getHours();
    const isWeekend = [0, 6].includes(event.timestamp.getDay());
    
    // Flag access outside business hours (9 AM - 6 PM, Monday-Friday)
    if (hour < 9 || hour > 18 || isWeekend) {
      return {
        type: 'off_hours_access',
        severity: 'medium',
        description: `Off-hours PHI access at ${event.timestamp.toISOString()}`,
        userId: event.userId,
        timestamp: event.timestamp,
        recommendedAction: 'Review access justification and purpose'
      };
    }
    
    return null;
  }

  /**
   * Checks for geographic anomalies
   */
  private async checkGeographicAnomalies(event: AuditEvent): Promise<RiskIndicator | null> {
    if (!event.locationInfo) return null;
    
    // Get user's typical location pattern
    const typicalLocation = await this.getUserTypicalLocation(event.userId);
    
    if (typicalLocation && event.locationInfo.country !== typicalLocation.country) {
      return {
        type: 'geographic_anomaly',
        severity: 'high',
        description: `Access from unusual location: ${event.locationInfo.country}`,
        userId: event.userId,
        timestamp: event.timestamp,
        recommendedAction: 'Verify user identity and access authorization'
      };
    }
    
    return null;
  }

  /**
   * Checks for unusual access patterns
   */
  private async checkUnusualAccessPatterns(event: AuditEvent): Promise<RiskIndicator | null> {
    // Check if accessing patient records outside of typical caseload
    if (event.patientId && event.eventType === 'phi_access') {
      const isTypicalPatient = await this.isTypicalPatientForTherapist(event.userId, event.patientId);
      
      if (!isTypicalPatient) {
        return {
          type: 'unusual_access_pattern',
          severity: 'medium',
          description: `Access to patient outside typical caseload: ${event.patientId}`,
          userId: event.userId,
          timestamp: event.timestamp,
          recommendedAction: 'Verify clinical necessity and typeof window !== 'undefined' && document justification'
        };
      }
    }
    
    return null;
  }

  /**
   * Checks for failed authentication attempts
   */
  private async checkFailedAuthenticationAttempts(event: AuditEvent): Promise<RiskIndicator | null> {
    if (event.outcome === 'failure' && event.eventType === 'authentication') {
      const recentFailures = await this.getRecentFailedAttempts(event.sourceIP, 1); // 1 hour
      
      if (recentFailures > 5) {
        return {
          type: 'failed_authentication',
          severity: 'high',
          description: `${recentFailures} failed authentication attempts from ${event.sourceIP}`,
          userId: event.userId,
          timestamp: event.timestamp,
          recommendedAction: 'Block IP address and investigate potential breach attempt'
        };
      }
    }
    
    return null;
  }

  /**
   * Handles suspicious activity detection
   */
  private async handleSuspiciousActivity(event: AuditEvent, risks: RiskIndicator[]): Promise<void> {
    // Log security event
    await this.logEvent({
      eventType: 'suspicious_activity',
      userId: 'system',
      userRole: 'system',
      resourceAccessed: 'security_monitoring',
      actionPerformed: 'suspicious_activity',
      outcome: 'warning',
      sourceIP: 'internal',
      userAgent: 'audit_system',
      sessionId: 'system',
      dataClassification: 'internal',
      errorDetails: `Suspicious activity detected: ${risks.map(r => r.type).join(', ')}`
    });

    // Send real-time alerts for high/critical risks
    const criticalRisks = risks.filter(r => ['high', 'critical'].includes(r.severity));
    if (criticalRisks.length > 0) {
      await this.sendSecurityAlert(event, criticalRisks);
    }
  }

  /**
   * Checks conditions that require immediate alerts
   */
  private async checkAlertConditions(event: AuditEvent): Promise<void> {
    const alertConditions = [
      // Emergency access without proper justification
      event.purposeOfUse === 'emergency' && !event.minimumNecessaryFields?.includes('emergency_justification'),
      
      // Failed access to restricted data
      event.outcome === 'failure' && event.dataClassification === 'restricted',
      
      // Consent revocation
      event.eventType === 'consent_management' && event.consentStatus === 'revoked',
      
      // After-hours access to sensitive data
      event.dataClassification === 'restricted' && this.isOffHours(event.timestamp)
    ];

    if (alertConditions.some(Boolean)) {
      await this.sendComplianceAlert(event);
    }
  }

  /**
   * Sends security alerts for critical events
   */
  private async sendSecurityAlert(event: AuditEvent, risks: RiskIndicator[]): Promise<void> {
    const alert = {
      alertId: this.generateEventId(),
      timestamp: new Date(),
      severity: Math.max(...risks.map(r => this.getSeverityLevel(r.severity))),
      event,
      risks,
      recommendedActions: risks.map(r => r.recommendedAction)
    };

    // In production, integrate with security incident response system
    console.log(`SECURITY_ALERT: ${JSON.stringify(alert)}`);
  }

  /**
   * Sends compliance alerts for regulatory events
   */
  private async sendComplianceAlert(event: AuditEvent): Promise<void> {
    const alert = {
      alertId: this.generateEventId(),
      timestamp: new Date(),
      type: 'compliance_notification',
      event,
      requiresDocumentation: true
    };

    console.log(`COMPLIANCE_ALERT: ${JSON.stringify(alert)}`);
  }

  /**
   * Generates comprehensive audit report
   * Required for HIPAA compliance reviews
   */
  public async generateAuditReport(
    query: AuditQuery,
    reportType: AuditReport['reportType'] = 'compliance'
  ): Promise<AuditReport> {
    const events = await this.queryAuditEvents(query);
    const summary = await this.generateAuditSummary(events);
    const integrityVerified = await this.verifyAuditIntegrity(events);

    return {
      reportId: this.generateEventId(),
      generatedAt: new Date(),
      generatedBy: 'audit_system',
      reportType,
      timeRange: {
        start: query.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        end: query.endDate || new Date()
      },
      totalEvents: events.length,
      events,
      summary,
      integrityVerified
    };
  }

  /**
   * Verifies audit log integrity
   */
  private async verifyAuditIntegrity(events: AuditEvent[]): Promise<boolean> {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const expectedHash = createHash('sha256')
        .update(JSON.stringify({
          ...event,
          integrity: undefined, // Exclude integrity from hash calculation
          timestamp: event.timestamp.toISOString()
        }))
        .digest('hex');
      
      if (event.integrity.hash !== expectedHash) {
        console.error(`Audit integrity violation detected for event ${event.eventId}`);
        return false;
      }
    }
    
    return true;
  }

  // Helper methods (implementation details)
  private async getRecentAccessCount(userId: string, hours: number): Promise<number> {
    // In production, query audit database
    return Math.floor(Math.random() * 100); // Mock implementation
  }

  private async getUserTypicalLocation(userId: string): Promise<GeolocationInfo | null> {
    // In production, analyze user's access patterns
    return null; // Mock implementation
  }

  private async isTypicalPatientForTherapist(therapistId: string, patientId: string): Promise<boolean> {
    // In production, check therapist-patient assignments
    return true; // Mock implementation
  }

  private async getRecentFailedAttempts(sourceIP: string, hours: number): Promise<number> {
    // In production, query failed authentication attempts
    return Math.floor(Math.random() * 10); // Mock implementation
  }

  private isOffHours(timestamp: Date): boolean {
    const hour = timestamp.getHours();
    const isWeekend = [0, 6].includes(timestamp.getDay());
    return hour < 9 || hour > 18 || isWeekend;
  }

  private getSeverityLevel(severity: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity as keyof typeof levels] || 1;
  }

  private async queryAuditEvents(query: AuditQuery): Promise<AuditEvent[]> {
    // In production, implement secure database query
    return []; // Mock implementation
  }

  private async generateAuditSummary(events: AuditEvent[]): Promise<AuditSummary> {
    // In production, calculate real statistics
    return {
      phiAccessEvents: 0,
      failedAccessAttempts: 0,
      emergencyAccesses: 0,
      consentChanges: 0,
      suspiciousActivities: 0,
      uniqueUsers: 0,
      dataExports: 0,
      topAccessedResources: [],
      accessByPurpose: [],
      riskIndicators: []
    };
  }
}