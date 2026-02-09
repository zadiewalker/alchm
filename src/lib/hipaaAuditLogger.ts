/**
 * HIPAA-Compliant Audit Logging System
 * 
 * COMPLIANCE REQUIREMENT: HIPAA 45 CFR 164.312(b) requires covered entities 
 * to implement procedures to record and examine activity in systems that 
 * contain PHI (Protected Health Information)
 */

interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: 'PHI_ACCESS' | 'PHI_CREATION' | 'PHI_MODIFICATION' | 'PHI_DELETION' | 'CRISIS_EVENT' | 'AUTH_EVENT' | 'SYSTEM_EVENT';
  userId: string;
  userType: 'patient' | 'provider' | 'admin' | 'system';
  resource: string;
  action: string;
  outcome: 'SUCCESS' | 'FAILURE' | 'WARNING';
  details: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    location?: string;
    dataClassification: 'PHI' | 'PII' | 'PUBLIC' | 'INTERNAL';
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    additionalInfo?: Record<string, any>;
  };
  hipaaCompliance: {
    dataMinimization: boolean;
    accessJustification: string;
    retentionPolicy: string;
    encryptionStatus: boolean;
  };
}

class HIPAAAuditLogger {
  private static instance: HIPAAAuditLogger;
  private auditQueue: AuditLogEntry[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds
  
  static getInstance(): HIPAAAuditLogger {
    if (!HIPAAAuditLogger.instance) {
      HIPAAAuditLogger.instance = new HIPAAAuditLogger();
    }
    return HIPAAAuditLogger.instance;
  }

  constructor() {
    // Auto-flush audit logs periodically
    if (typeof window !== 'undefined') {
      setInterval(() => {
        this.flushAuditLogs();
      }, this.FLUSH_INTERVAL);
    }
  }

  /**
   * Log PHI access events - HIPAA Required
   */
  logPHIAccess(userId: string, resource: string, action: string, outcome: 'SUCCESS' | 'FAILURE' = 'SUCCESS'): void {
    this.createAuditEntry({
      eventType: 'PHI_ACCESS',
      userId,
      userType: this.determineUserType(userId),
      resource,
      action,
      outcome,
      details: {
        ...this.getBrowserContext(),
        dataClassification: 'PHI',
        riskLevel: this.calculateRiskLevel(action, resource)
      },
      hipaaCompliance: {
        dataMinimization: true,
        accessJustification: `Authorized ${action} of patient health information`,
        retentionPolicy: '6_YEARS',
        encryptionStatus: true
      }
    });
  }

  /**
   * Log crisis events - Critical for patient safety audit trail
   */
  logCrisisEvent(userId: string, crisisType: string, interventionTaken: string, outcome: string): void {
    this.createAuditEntry({
      eventType: 'CRISIS_EVENT',
      userId,
      userType: 'patient',
      resource: 'crisis_detection_system',
      action: `crisis_detected_${crisisType}`,
      outcome: 'WARNING',
      details: {
        ...this.getBrowserContext(),
        dataClassification: 'PHI',
        riskLevel: 'CRITICAL',
        additionalInfo: {
          crisisType,
          interventionTaken,
          outcome,
          timestamp: new Date().toISOString()
        }
      },
      hipaaCompliance: {
        dataMinimization: false, // Crisis events require full detail for safety
        accessJustification: 'Patient safety crisis intervention',
        retentionPolicy: 'INDEFINITE',
        encryptionStatus: true
      }
    });
  }

  /**
   * Log authentication events
   */
  logAuthEvent(userId: string, action: string, outcome: 'SUCCESS' | 'FAILURE'): void {
    this.createAuditEntry({
      eventType: 'AUTH_EVENT',
      userId,
      userType: this.determineUserType(userId),
      resource: 'authentication_system',
      action,
      outcome,
      details: {
        ...this.getBrowserContext(),
        dataClassification: 'INTERNAL',
        riskLevel: outcome === 'FAILURE' ? 'HIGH' : 'LOW'
      },
      hipaaCompliance: {
        dataMinimization: true,
        accessJustification: 'User authentication and access control',
        retentionPolicy: '6_YEARS',
        encryptionStatus: true
      }
    });
  }

  /**
   * Log data modification events
   */
  logDataModification(userId: string, resource: string, action: string, dataType: 'PHI' | 'PII' | 'PUBLIC'): void {
    this.createAuditEntry({
      eventType: dataType === 'PHI' ? 'PHI_MODIFICATION' : 'SYSTEM_EVENT',
      userId,
      userType: this.determineUserType(userId),
      resource,
      action,
      outcome: 'SUCCESS',
      details: {
        ...this.getBrowserContext(),
        dataClassification: dataType,
        riskLevel: dataType === 'PHI' ? 'MEDIUM' : 'LOW'
      },
      hipaaCompliance: {
        dataMinimization: true,
        accessJustification: `Authorized ${action} of ${dataType} data`,
        retentionPolicy: dataType === 'PHI' ? '6_YEARS' : '1_YEAR',
        encryptionStatus: true
      }
    });
  }

  /**
   * Create and queue audit entry
   */
  private createAuditEntry(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const auditEntry: AuditLogEntry = {
      id: this.generateAuditId(),
      timestamp: new Date().toISOString(),
      ...entry
    };

    this.auditQueue.push(auditEntry);

    // Immediate flush for critical events
    if (entry.details.riskLevel === 'CRITICAL' || entry.eventType === 'CRISIS_EVENT') {
      this.flushAuditLogs();
    }

    // Prevent memory overflow
    if (this.auditQueue.length > this.MAX_QUEUE_SIZE) {
      this.flushAuditLogs();
    }
  }

  /**
   * Flush audit logs to secure storage
   */
  private async flushAuditLogs(): Promise<void> {
    if (this.auditQueue.length === 0) return;

    const logsToFlush = [...this.auditQueue];
    this.auditQueue = [];

    try {
      // Store in encrypted local storage for offline support
      await this.storeAuditLogsLocally(logsToFlush);
      
      // Attempt to send to secure audit server if online
      if (navigator.onLine) {
        await this.sendAuditLogsToServer(logsToFlush);
      }
    } catch (error) {
      console.error('Audit log flush failed:', error);
      // Re-queue failed logs
      this.auditQueue.unshift(...logsToFlush);
    }
  }

  /**
   * Store audit logs in encrypted local storage
   */
  private async storeAuditLogsLocally(logs: AuditLogEntry[]): Promise<void> {
    try {
      const { secureStorage } = await import('./secureStorage');
      const existingLogs = await secureStorage.getItem('hipaa_audit_logs', true) || [];
      const updatedLogs = [...existingLogs, ...logs];
      
      // Keep only last 1000 entries locally to prevent storage overflow
      const trimmedLogs = updatedLogs.slice(-1000);
      
      await secureStorage.setItem('hipaa_audit_logs', trimmedLogs, true);
    } catch (error) {
      console.error('Local audit storage failed:', error);
      throw error;
    }
  }

  /**
   * Send audit logs to secure HIPAA-compliant server
   */
  private async sendAuditLogsToServer(logs: AuditLogEntry[]): Promise<void> {
    try {
      // This would typically send to a HIPAA-compliant audit log service
      // For now, we'll log the intent
      console.info(`HIPAA Audit: ${logs.length} entries ready for secure transmission`);
      
      // In production, implement secure transmission to audit server:
      // - Use authenticated HTTPS endpoint
      // - Include integrity checksums
      // - Implement retry logic with exponential backoff
      // - Verify server certificate and HIPAA compliance
      
    } catch (error) {
      console.error('Server audit transmission failed:', error);
      throw error;
    }
  }

  /**
   * Get browser context for audit trail
   */
  private getBrowserContext() {
    if (typeof window === 'undefined') {
      return {
        ipAddress: 'server_side',
        userAgent: 'server',
        sessionId: 'ssr'
      };
    }

    return {
      ipAddress: 'client_side', // In production, get from server
      userAgent: navigator.userAgent.substring(0, 200), // Truncate for privacy
      sessionId: this.getSessionId(),
      location: window.location.hostname
    };
  }

  /**
   * Generate unique audit ID
   */
  private generateAuditId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `audit_${timestamp}_${random}`;
  }

  /**
   * Determine user type from user ID
   */
  private determineUserType(userId: string): 'patient' | 'provider' | 'admin' | 'system' {
    if (userId.startsWith('admin_')) return 'admin';
    if (userId.startsWith('provider_')) return 'provider';
    if (userId.startsWith('system_')) return 'system';
    return 'patient';
  }

  /**
   * Calculate risk level based on action and resource
   */
  private calculateRiskLevel(action: string, resource: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (resource.includes('crisis') || action.includes('emergency')) return 'CRITICAL';
    if (action.includes('delete') || action.includes('export')) return 'HIGH';
    if (action.includes('modify') || action.includes('update')) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'ssr_session';
    
    let sessionId = sessionStorage.getItem('hipaa_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem('hipaa_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get audit summary for compliance reporting
   */
  async getAuditSummary(days: number = 30): Promise<any> {
    try {
      const { secureStorage } = await import('./secureStorage');
      const logs = await secureStorage.getItem('hipaa_audit_logs', true) || [];
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      const recentLogs = logs.filter((log: AuditLogEntry) => 
        new Date(log.timestamp) > cutoffDate
      );

      return {
        totalEvents: recentLogs.length,
        phiAccess: recentLogs.filter((log: AuditLogEntry) => log.eventType === 'PHI_ACCESS').length,
        crisisEvents: recentLogs.filter((log: AuditLogEntry) => log.eventType === 'CRISIS_EVENT').length,
        authEvents: recentLogs.filter((log: AuditLogEntry) => log.eventType === 'AUTH_EVENT').length,
        failures: recentLogs.filter((log: AuditLogEntry) => log.outcome === 'FAILURE').length,
        highRiskEvents: recentLogs.filter((log: AuditLogEntry) => 
          log.details.riskLevel === 'HIGH' || log.details.riskLevel === 'CRITICAL'
        ).length,
        period: `${days} days`,
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Audit summary failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const hipaaAuditLogger = HIPAAAuditLogger.getInstance();

// Convenience functions for common audit events
export const auditPHIAccess = (userId: string, resource: string, action: string) => {
  hipaaAuditLogger.logPHIAccess(userId, resource, action);
};

export const auditCrisisEvent = (userId: string, crisisType: string, intervention: string, outcome: string) => {
  hipaaAuditLogger.logCrisisEvent(userId, crisisType, intervention, outcome);
};

export const auditAuth = (userId: string, action: string, success: boolean) => {
  hipaaAuditLogger.logAuthEvent(userId, action, success ? 'SUCCESS' : 'FAILURE');
};

export const auditDataChange = (userId: string, resource: string, action: string, dataType: 'PHI' | 'PII' | 'PUBLIC' = 'PHI') => {
  hipaaAuditLogger.logDataModification(userId, resource, action, dataType);
};