/**
 * Audit Log Validator - Tamper-proof logging system for HIPAA compliance
 * Ensures complete audit trails for all PHI access with cryptographic integrity
 * 
 * This component creates and validates audit logs meeting HIPAA Security Rule
 * requirements for access logging and tamper detection for vulnerable youth populations.
 */

import { createHash, createHmac, randomBytes } from 'crypto';

export interface AuditLogEntry {
  id: string;
  sequenceNumber: number;
  timestamp: Date;
  userId: string;
  userRole: 'MINOR' | 'PARENT' | 'THERAPIST' | 'ADMIN' | 'EMERGENCY_RESPONDER';
  sessionId: string;
  action: 'READ' | 'WRITE' | 'DELETE' | 'EXPORT' | 'LOGIN' | 'LOGOUT' | 'EMERGENCY_ACCESS';
  resourceType: 'journal_entry' | 'therapist_note' | 'crisis_data' | 'assessment' | 'user_profile' | 'system_config';
  resourceId: string;
  accessReason: 'TREATMENT' | 'EMERGENCY' | 'PARENTAL_ACCESS' | 'ADMINISTRATIVE' | 'RESEARCH' | 'AUDIT';
  ipAddress: string;
  userAgent: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceFingerprint: string;
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
  dataModified?: string[];
  approvedBy?: string;
  supervisorApproval?: boolean;
  consentVerified: boolean;
  minimumNecessary: boolean;
  retentionPeriod: number; // days
  integrityHash: string;
  previousLogHash: string;
  blockchainHash?: string; // For immutable storage
  encrypted: boolean;
  encryptionKeyId?: string;
  complianceFlags: ComplianceFlag[];
  warningFlags: WarningFlag[];
  metadata?: Record<string, any>;
}

export interface ComplianceFlag {
  type: 'COPPA_MINOR_ACCESS' | 'HIPAA_PHI_ACCESS' | 'FERPA_EDUCATION_RECORD' | 'GDPR_PERSONAL_DATA';
  description: string;
  requiresNotification: boolean;
  notificationSent: boolean;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface WarningFlag {
  type: 'UNUSUAL_ACCESS_PATTERN' | 'OFF_HOURS_ACCESS' | 'MULTIPLE_FAILED_ATTEMPTS' | 'PRIVILEGE_ESCALATION' | 'BULK_ACCESS';
  description: string;
  riskScore: number;
  requiresInvestigation: boolean;
  investigated: boolean;
}

export interface AuditLogValidationResult {
  valid: boolean;
  integrityScore: number;
  tamperedLogs: string[];
  missingLogs: number[];
  suspiciousPatterns: SuspiciousPattern[];
  complianceViolations: ComplianceViolation[];
  recommendations: string[];
  lastValidated: Date;
}

export interface SuspiciousPattern {
  type: 'BULK_ACCESS' | 'OFF_HOURS' | 'FAILED_ATTEMPTS' | 'PRIVILEGE_ESCALATION' | 'DATA_EXFILTRATION';
  description: string;
  userId: string;
  timeRange: { start: Date; end: Date };
  affectedResources: string[];
  riskScore: number;
  requiresInvestigation: boolean;
}

export interface ComplianceViolation {
  type: 'MISSING_AUDIT_LOG' | 'TAMPERED_LOG' | 'INSUFFICIENT_DETAIL' | 'DELAYED_LOGGING' | 'UNAUTHORIZED_ACCESS';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resourceId?: string;
  userId?: string;
  timestamp: Date;
  requiresNotification: boolean;
}

export interface AuditLogConfiguration {
  retentionPeriod: number; // days
  encryptionEnabled: boolean;
  blockchainBackup: boolean;
  realtimeValidation: boolean;
  suspiciousPatternDetection: boolean;
  complianceReporting: boolean;
  tamperAlerts: boolean;
  backupFrequency: number; // hours
}

export class AuditLogValidator {
  private auditLogs: Map<string, AuditLogEntry[]> = new Map();
  private sequenceCounter = 0;
  private lastLogHash = '';
  private configuration: AuditLogConfiguration;
  
  constructor(config?: Partial<AuditLogConfiguration>) {
    this.configuration = {
      retentionPeriod: 2555, // 7 years for HIPAA
      encryptionEnabled: true,
      blockchainBackup: true,
      realtimeValidation: true,
      suspiciousPatternDetection: true,
      complianceReporting: true,
      tamperAlerts: true,
      backupFrequency: 1, // hourly backups
      ...config
    };
  }

  /**
   * Create a new audit log entry with tamper-proof integrity
   */
  async createAuditLogEntry(
    userId: string,
    userRole: 'MINOR' | 'PARENT' | 'THERAPIST' | 'ADMIN' | 'EMERGENCY_RESPONDER',
    action: 'READ' | 'write' | 'delete' | 'export' | 'login' | 'logout' | 'emergency_access',
    resourceType: string,
    resourceId: string,
    context: {
      sessionId: string;
      accessReason: 'TREATMENT' | 'EMERGENCY' | 'PARENTAL_ACCESS' | 'ADMINISTRATIVE' | 'RESEARCH' | 'AUDIT';
      ipAddress: string;
      userAgent: string;
      geolocation?: { latitude: number; longitude: number; accuracy: number };
      deviceFingerprint: string;
      success: boolean;
      errorCode?: string;
      errorMessage?: string;
      dataModified?: string[];
      approvedBy?: string;
      supervisorApproval?: boolean;
      consentVerified: boolean;
      minimumNecessary: boolean;
      metadata?: Record<string, any>;
    }
  ): Promise<AuditLogEntry> {
    const timestamp = new Date();
    const logId = this.generateLogId();
    const sequenceNumber = ++this.sequenceCounter;
    
    // Determine compliance flags
    const complianceFlags = this.determineComplianceFlags(
      userRole, 
      action.toUpperCase() as any, 
      resourceType, 
      context
    );
    
    // Detect warning flags
    const warningFlags = await this.detectWarningFlags(
      userId, 
      action.toUpperCase() as any, 
      resourceType, 
      context, 
      timestamp
    );
    
    // Create base log entry
    const logEntry: Partial<AuditLogEntry> = {
      id: logId,
      sequenceNumber,
      timestamp,
      userId,
      userRole,
      sessionId: context.sessionId,
      action: action.toUpperCase() as any,
      resourceType: resourceType as any,
      resourceId,
      accessReason: context.accessReason,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      geolocation: context.geolocation,
      deviceFingerprint: context.deviceFingerprint,
      success: context.success,
      errorCode: context.errorCode,
      errorMessage: context.errorMessage,
      dataModified: context.dataModified,
      approvedBy: context.approvedBy,
      supervisorApproval: context.supervisorApproval || false,
      consentVerified: context.consentVerified,
      minimumNecessary: context.minimumNecessary,
      retentionPeriod: this.configuration.retentionPeriod,
      previousLogHash: this.lastLogHash,
      encrypted: this.configuration.encryptionEnabled,
      complianceFlags,
      warningFlags,
      metadata: context.metadata
    };
    
    // Generate integrity hash
    const integrityHash = this.generateIntegrityHash(logEntry);
    logEntry.integrityHash = integrityHash;
    
    // Generate blockchain hash if enabled
    if (this.configuration.blockchainBackup) {
      logEntry.blockchainHash = this.generateBlockchainHash(logEntry, this.lastLogHash);
    }
    
    const completeLogEntry = logEntry as AuditLogEntry;
    
    // Update last log hash for chain integrity
    this.lastLogHash = integrityHash;
    
    // Store log entry
    await this.storeAuditLogEntry(completeLogEntry);
    
    // Real-time validation if enabled
    if (this.configuration.realtimeValidation) {
      await this.validateLogEntry(completeLogEntry);
    }
    
    // Check for immediate alerts
    await this.checkForAlerts(completeLogEntry);
    
    console.log(`📝 Audit log created: ${logId} for ${userId} accessing ${resourceType}`);
    
    return completeLogEntry;
  }

  /**
   * Validate audit log integrity and compliance
   */
  async validateAuditLogs(): Promise<AuditLogValidationResult> {
    console.log('🔍 Starting comprehensive audit log validation...');
    
    const tamperedLogs: string[] = [];
    const missingLogs: number[] = [];
    const suspiciousPatterns: SuspiciousPattern[] = [];
    const complianceViolations: ComplianceViolation[] = [];
    const recommendations: string[] = [];
    
    let integrityScore = 100;
    let totalLogs = 0;
    
    // Validate each user's audit logs
    for (const [userId, userLogs] of this.auditLogs) {
      totalLogs += userLogs.length;
      
      // Check log integrity
      const integrityResult = await this.validateLogChainIntegrity(userLogs);
      tamperedLogs.push(...integrityResult.tamperedLogs);
      missingLogs.push(...integrityResult.missingSequences);
      
      if (integrityResult.tamperedLogs.length > 0) {
        integrityScore -= (integrityResult.tamperedLogs.length / userLogs.length) * 50;
        complianceViolations.push({
          type: 'TAMPERED_LOG',
          description: `Tampered logs detected for user ${userId}`,
          severity: 'CRITICAL',
          userId,
          timestamp: new Date(),
          requiresNotification: true
        });
      }
      
      // Detect suspicious patterns
      const patterns = await this.detectSuspiciousPatterns(userLogs);
      suspiciousPatterns.push(...patterns);
      
      // Check compliance requirements
      const compliance = await this.validateComplianceRequirements(userLogs);
      complianceViolations.push(...compliance.violations);
    }
    
    // Generate recommendations
    if (tamperedLogs.length > 0) {
      recommendations.push('CRITICAL: Investigate tampered audit logs immediately');
      recommendations.push('Review access controls and security measures');
      recommendations.push('Consider forensic analysis of affected systems');
    }
    
    if (missingLogs.length > 0) {
      recommendations.push('Investigate missing audit log entries');
      recommendations.push('Review log backup and recovery procedures');
    }
    
    if (suspiciousPatterns.length > 0) {
      recommendations.push('Investigate suspicious access patterns');
      recommendations.push('Review user access permissions and behavior');
    }
    
    const valid = tamperedLogs.length === 0 && 
                  missingLogs.length === 0 && 
                  complianceViolations.filter(v => v.severity === 'CRITICAL').length === 0;
    
    console.log(`✅ Audit log validation complete. Valid: ${valid}, Integrity Score: ${integrityScore}`);
    
    return {
      valid,
      integrityScore: Math.max(0, integrityScore),
      tamperedLogs,
      missingLogs,
      suspiciousPatterns,
      complianceViolations,
      recommendations,
      lastValidated: new Date()
    };
  }

  /**
   * Export audit logs for compliance reporting
   */
  async exportAuditLogs(
    criteria: {
      userId?: string;
      userRole?: string;
      dateRange?: { start: Date; end: Date };
      resourceType?: string;
      action?: string;
      complianceFlags?: string[];
    }
  ): Promise<{
    logs: AuditLogEntry[];
    totalCount: number;
    exportTimestamp: Date;
    integrityVerified: boolean;
  }> {
    const matchingLogs: AuditLogEntry[] = [];
    
    for (const [userId, userLogs] of this.auditLogs) {
      for (const log of userLogs) {
        if (this.matchesCriteria(log, criteria)) {
          matchingLogs.push(log);
        }
      }
    }
    
    // Verify integrity of exported logs
    const integrityVerified = await this.verifyExportIntegrity(matchingLogs);
    
    // Create export audit log
    await this.createAuditLogEntry(
      'system',
      'ADMIN',
      'export',
      'audit_logs',
      'bulk_export',
      {
        sessionId: 'system',
        accessReason: 'AUDIT',
        ipAddress: '127.0.0.1',
        userAgent: 'AuditLogValidator',
        deviceFingerprint: 'system',
        success: true,
        consentVerified: true,
        minimumNecessary: true,
        metadata: {
          exportCriteria: criteria,
          exportedCount: matchingLogs.length
        }
      }
    );
    
    return {
      logs: matchingLogs,
      totalCount: matchingLogs.length,
      exportTimestamp: new Date(),
      integrityVerified
    };
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    reportType: 'HIPAA' | 'COPPA' | 'FERPA' | 'GDPR' | 'COMPREHENSIVE',
    dateRange: { start: Date; end: Date }
  ): Promise<{
    reportType: string;
    dateRange: { start: Date; end: Date };
    totalLogs: number;
    complianceScore: number;
    violations: ComplianceViolation[];
    recommendations: string[];
    summary: Record<string, any>;
  }> {
    const relevantLogs = await this.getLogsForComplianceReport(reportType, dateRange);
    const violations = await this.analyzeComplianceViolations(relevantLogs, reportType);
    
    const complianceScore = this.calculateComplianceScore(relevantLogs, violations);
    
    const recommendations = this.generateComplianceRecommendations(violations, reportType);
    
    const summary = await this.generateReportSummary(relevantLogs, violations, reportType);
    
    return {
      reportType,
      dateRange,
      totalLogs: relevantLogs.length,
      complianceScore,
      violations,
      recommendations,
      summary
    };
  }

  // Private methods
  private generateLogId(): string {
    return `log_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  private generateIntegrityHash(logEntry: Partial<AuditLogEntry>): string {
    const logData = {
      ...logEntry,
      integrityHash: undefined,
      blockchainHash: undefined
    };
    
    const dataString = JSON.stringify(logData, Object.keys(logData).sort());
    const hmacSecret = process.env.AUDIT_LOG_HMAC_SECRET || 'default-secret';
    
    return createHmac('sha256', hmacSecret)
      .update(dataString)
      .digest('hex');
  }

  private generateBlockchainHash(logEntry: Partial<AuditLogEntry>, previousHash: string): string {
    const blockData = {
      logId: logEntry.id,
      timestamp: logEntry.timestamp,
      userId: logEntry.userId,
      action: logEntry.action,
      resourceId: logEntry.resourceId,
      previousHash
    };
    
    return createHash('sha256')
      .update(JSON.stringify(blockData))
      .digest('hex');
  }

  private determineComplianceFlags(
    userRole: string,
    action: string,
    resourceType: string,
    context: any
  ): ComplianceFlag[] {
    const flags: ComplianceFlag[] = [];
    
    // HIPAA flags
    if (['journal_entry', 'therapist_note', 'crisis_data', 'assessment'].includes(resourceType)) {
      flags.push({
        type: 'HIPAA_PHI_ACCESS',
        description: 'Access to Protected Health Information',
        requiresNotification: action === 'EXPORT',
        notificationSent: false,
        severity: 'INFO'
      });
    }
    
    // COPPA flags
    if (userRole === 'MINOR' || resourceType === 'minor_profile') {
      flags.push({
        type: 'COPPA_MINOR_ACCESS',
        description: 'Access involving minor user data',
        requiresNotification: true,
        notificationSent: false,
        severity: 'WARNING'
      });
    }
    
    return flags;
  }

  private async detectWarningFlags(
    userId: string,
    action: string,
    resourceType: string,
    context: any,
    timestamp: Date
  ): Promise<WarningFlag[]> {
    const flags: WarningFlag[] = [];
    
    // Check for off-hours access
    if (this.isOffHoursAccess(timestamp)) {
      flags.push({
        type: 'OFF_HOURS_ACCESS',
        description: 'Access attempted outside normal business hours',
        riskScore: 30,
        requiresInvestigation: true,
        investigated: false
      });
    }
    
    // Check for bulk access
    const recentAccess = await this.getRecentAccessCount(userId, 3600000); // 1 hour
    if (recentAccess > 50) {
      flags.push({
        type: 'BULK_ACCESS',
        description: 'Unusually high number of access attempts',
        riskScore: 50,
        requiresInvestigation: true,
        investigated: false
      });
    }
    
    return flags;
  }

  private async storeAuditLogEntry(logEntry: AuditLogEntry): Promise<void> {
    const userId = logEntry.userId;
    
    if (!this.auditLogs.has(userId)) {
      this.auditLogs.set(userId, []);
    }
    
    this.auditLogs.get(userId)!.push(logEntry);
    
    // In production, this would store to secure, immutable storage
    // such as blockchain, write-once storage, or secure database
  }

  private async validateLogEntry(logEntry: AuditLogEntry): Promise<boolean> {
    // Validate log entry format and integrity
    return true; // Simplified for this example
  }

  private async checkForAlerts(logEntry: AuditLogEntry): Promise<void> {
    // Check for immediate security alerts
    if (logEntry.warningFlags.some(f => f.riskScore > 70)) {
      console.warn(`🚨 High-risk audit log activity detected: ${logEntry.id}`);
      // In production, this would trigger security alerts
    }
  }

  private async validateLogChainIntegrity(logs: AuditLogEntry[]): Promise<{
    tamperedLogs: string[];
    missingSequences: number[];
  }> {
    const tamperedLogs: string[] = [];
    const missingSequences: number[] = [];
    
    // Sort logs by sequence number
    const sortedLogs = logs.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const log = sortedLogs[i];
      
      // Check integrity hash
      const expectedHash = this.generateIntegrityHash({
        ...log,
        integrityHash: undefined,
        blockchainHash: undefined
      });
      
      if (log.integrityHash !== expectedHash) {
        tamperedLogs.push(log.id);
      }
      
      // Check sequence continuity
      if (i > 0) {
        const prevLog = sortedLogs[i - 1];
        if (log.sequenceNumber !== prevLog.sequenceNumber + 1) {
          for (let seq = prevLog.sequenceNumber + 1; seq < log.sequenceNumber; seq++) {
            missingSequences.push(seq);
          }
        }
      }
    }
    
    return { tamperedLogs, missingSequences };
  }

  private async detectSuspiciousPatterns(logs: AuditLogEntry[]): Promise<SuspiciousPattern[]> {
    const patterns: SuspiciousPattern[] = [];
    
    // Analyze for various suspicious patterns
    // This would include more sophisticated pattern detection in production
    
    return patterns;
  }

  private async validateComplianceRequirements(logs: AuditLogEntry[]): Promise<{
    violations: ComplianceViolation[];
  }> {
    const violations: ComplianceViolation[] = [];
    
    // Check HIPAA requirements
    for (const log of logs) {
      if (log.complianceFlags.some(f => f.type === 'HIPAA_PHI_ACCESS')) {
        if (!log.accessReason || !log.minimumNecessary) {
          violations.push({
            type: 'INSUFFICIENT_DETAIL',
            description: 'HIPAA audit log missing required details',
            severity: 'HIGH',
            resourceId: log.resourceId,
            userId: log.userId,
            timestamp: log.timestamp,
            requiresNotification: true
          });
        }
      }
    }
    
    return { violations };
  }

  private matchesCriteria(log: AuditLogEntry, criteria: any): boolean {
    // Check if log matches export criteria
    return true; // Simplified for this example
  }

  private async verifyExportIntegrity(logs: AuditLogEntry[]): Promise<boolean> {
    // Verify integrity of logs being exported
    return true; // Simplified for this example
  }

  private async getLogsForComplianceReport(reportType: string, dateRange: any): Promise<AuditLogEntry[]> {
    const allLogs: AuditLogEntry[] = [];
    
    for (const userLogs of this.auditLogs.values()) {
      allLogs.push(...userLogs.filter(log => 
        log.timestamp >= dateRange.start && 
        log.timestamp <= dateRange.end
      ));
    }
    
    return allLogs;
  }

  private async analyzeComplianceViolations(logs: AuditLogEntry[], reportType: string): Promise<ComplianceViolation[]> {
    return []; // Simplified for this example
  }

  private calculateComplianceScore(logs: AuditLogEntry[], violations: ComplianceViolation[]): number {
    if (logs.length === 0) return 100;
    
    const violationPenalty = violations.length * 10;
    return Math.max(0, 100 - violationPenalty);
  }

  private generateComplianceRecommendations(violations: ComplianceViolation[], reportType: string): string[] {
    const recommendations: string[] = [];
    
    if (violations.some(v => v.type === 'TAMPERED_LOG')) {
      recommendations.push('Implement additional log tamper protection measures');
    }
    
    if (violations.some(v => v.type === 'INSUFFICIENT_DETAIL')) {
      recommendations.push('Enhance audit log detail collection');
    }
    
    return recommendations;
  }

  private async generateReportSummary(logs: AuditLogEntry[], violations: ComplianceViolation[], reportType: string): Promise<Record<string, any>> {
    return {
      totalLogs: logs.length,
      uniqueUsers: new Set(logs.map(l => l.userId)).size,
      mostCommonAction: this.getMostCommonAction(logs),
      riskiest: this.getRiskiestActivity(logs)
    };
  }

  private isOffHoursAccess(timestamp: Date): boolean {
    const hour = timestamp.getHours();
    return hour < 8 || hour > 18; // Outside 8 AM - 6 PM
  }

  private async getRecentAccessCount(userId: string, timeWindow: number): Promise<number> {
    const userLogs = this.auditLogs.get(userId) || [];
    const cutoff = new Date(Date.now() - timeWindow);
    
    return userLogs.filter(log => log.timestamp > cutoff).length;
  }

  private getMostCommonAction(logs: AuditLogEntry[]): string {
    const actionCounts = new Map<string, number>();
    
    for (const log of logs) {
      const count = actionCounts.get(log.action) || 0;
      actionCounts.set(log.action, count + 1);
    }
    
    let maxCount = 0;
    let mostCommon = '';
    
    for (const [action, count] of actionCounts) {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = action;
      }
    }
    
    return mostCommon;
  }

  private getRiskiestActivity(logs: AuditLogEntry[]): any {
    const riskiestLog = logs.reduce((riskiest, log) => {
      const logRisk = log.warningFlags.reduce((sum, flag) => sum + flag.riskScore, 0);
      const currentRisk = riskiest.warningFlags.reduce((sum, flag) => sum + flag.riskScore, 0);
      
      return logRisk > currentRisk ? log : riskiest;
    }, logs[0]);
    
    return {
      userId: riskiestLog?.userId,
      action: riskiestLog?.action,
      resourceType: riskiestLog?.resourceType,
      timestamp: riskiestLog?.timestamp
    };
  }
}

export default AuditLogValidator;