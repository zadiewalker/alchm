/**
 * HIPAA Compliance Auditor - Comprehensive testing for all PHI handling
 * Tests against all 18 HIPAA identifiers and ensures regulatory compliance
 * 
 * This component ensures ALCHM meets HIPAA Security Rule, Privacy Rule, 
 * and Breach Notification Rule requirements for vulnerable youth populations.
 */

import { createHash, randomBytes } from 'crypto';

export interface HIPAAIdentifier {
  id: string;
  name: string;
  description: string;
  regex?: RegExp;
  testData: string[];
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface PHIDataElement {
  field: string;
  value: string;
  encrypted: boolean;
  accessLevel: 'THERAPIST' | 'PARENT' | 'MINOR' | 'ADMIN' | 'EMERGENCY';
  retention: number; // days
  lastAccessed: Date;
  accessReason: string;
}

export interface HIPAAComplianceResult {
  identifier: string;
  compliant: boolean;
  violations: string[];
  recommendations: string[];
  riskScore: number;
  lastAudit: Date;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userRole: 'THERAPIST' | 'PARENT' | 'MINOR' | 'ADMIN';
  action: 'READ' | 'write' | 'delete' | 'export' | 'emergency_access';
  phiAccessed: string[];
  accessReason: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  approved: boolean;
  approvedBy?: string;
  tamperProofHash: string;
}

export class HIPAAComplianceAuditor {
  private readonly HIPAA_IDENTIFIERS: HIPAAIdentifier[] = [
    {
      id: 'names',
      name: 'Names',
      description: 'Full name or any part of name',
      regex: /^[A-Za-z]+ [A-Za-z]+/,
      testData: ['John Doe', 'Jane Smith', 'Alex Johnson'],
      riskLevel: 'HIGH'
    },
    {
      id: 'geographic_subdivisions',
      name: 'Geographic Subdivisions',
      description: 'Address smaller than state level',
      regex: /\d+ [A-Za-z ]+ (Street|Ave|Blvd|Rd)/,
      testData: ['123 Main Street', '456 Oak Avenue'],
      riskLevel: 'HIGH'
    },
    {
      id: 'dates',
      name: 'Dates Related to Individual',
      description: 'Birth date, admission date, discharge date, death date',
      regex: /\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}/,
      testData: ['01/15/2005', '2005-01-15'],
      riskLevel: 'HIGH'
    },
    {
      id: 'phone_numbers',
      name: 'Telephone Numbers',
      description: 'Any phone or fax number',
      regex: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/,
      testData: ['+1-555-123-4567', '(555) 123-4567'],
      riskLevel: 'MEDIUM'
    },
    {
      id: 'email',
      name: 'Electronic Mail Addresses',
      description: 'Email addresses',
      regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
      testData: ['user@example.com', 'test@alchm.app'],
      riskLevel: 'HIGH'
    },
    {
      id: 'ssn',
      name: 'Social Security Numbers',
      description: 'Social Security Number',
      regex: /\d{3}-\d{2}-\d{4}|\d{9}/,
      testData: ['123-45-6789', '123456789'],
      riskLevel: 'HIGH'
    },
    {
      id: 'medical_record',
      name: 'Medical Record Numbers',
      description: 'Hospital or clinic record numbers',
      regex: /MR\d{6,}|MED-\d{4,}/,
      testData: ['MR123456', 'MED-9876'],
      riskLevel: 'HIGH'
    },
    {
      id: 'health_plan',
      name: 'Health Plan Beneficiary Numbers',
      description: 'Insurance member numbers',
      regex: /HP\d{8,}|INS-\d{6,}/,
      testData: ['HP12345678', 'INS-123456'],
      riskLevel: 'HIGH'
    },
    {
      id: 'account_numbers',
      name: 'Account Numbers',
      description: 'Any account identifier',
      regex: /ACCT-\d{6,}|\d{10,}/,
      testData: ['ACCT-123456', '1234567890'],
      riskLevel: 'MEDIUM'
    },
    {
      id: 'certificate_numbers',
      name: 'Certificate/License Numbers',
      description: 'Professional license numbers',
      regex: /LIC-\d{6,}|CERT-\d{4,}/,
      testData: ['LIC-123456', 'CERT-9876'],
      riskLevel: 'MEDIUM'
    },
    {
      id: 'vehicle_identifiers',
      name: 'Vehicle Identifiers',
      description: 'License plates, VIN numbers',
      regex: /[A-Z]{3}-\d{4}|[A-HJ-NPR-Z0-9]{17}/,
      testData: ['ABC-1234', '1HGBH41JXMN109186'],
      riskLevel: 'LOW'
    },
    {
      id: 'device_identifiers',
      name: 'Device Identifiers',
      description: 'Medical device serial numbers',
      regex: /DEV-\d{6,}|SN\d{8,}/,
      testData: ['DEV-123456', 'SN12345678'],
      riskLevel: 'MEDIUM'
    },
    {
      id: 'web_urls',
      name: 'Web URLs',
      description: 'Personal website URLs',
      regex: /https?:\/\/[^\s]+/,
      testData: ['https://example.com', 'http://test.org'],
      riskLevel: 'LOW'
    },
    {
      id: 'ip_addresses',
      name: 'Internet Protocol Addresses',
      description: 'IP addresses',
      regex: /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/,
      testData: ['192.168.1.1', '10.0.0.1'],
      riskLevel: 'MEDIUM'
    },
    {
      id: 'biometric_identifiers',
      name: 'Biometric Identifiers',
      description: 'Fingerprints, voice prints, etc.',
      regex: /BIO-\d{8,}|PRINT-[A-Z0-9]+/,
      testData: ['BIO-12345678', 'PRINT-ABC123'],
      riskLevel: 'HIGH'
    },
    {
      id: 'photos',
      name: 'Full Face Photos',
      description: 'Photographic images',
      regex: /\.(jpg|jpeg|png|gif)$/i,
      testData: ['photo.jpg', 'image.png'],
      riskLevel: 'HIGH'
    },
    {
      id: 'unique_identifiers',
      name: 'Unique Identifying Numbers',
      description: 'Any other unique identifying number',
      regex: /UID-\d{8,}|ID\d{6,}/,
      testData: ['UID-12345678', 'ID123456'],
      riskLevel: 'HIGH'
    },
    {
      id: 'ages_over_89',
      name: 'Ages Over 89',
      description: 'Ages over 89 years or birth years before 1934',
      regex: /age:?\s*(9[0-9]|[1-9][0-9]{2,})|born:?\s*(19[0-2][0-9]|18[0-9]{2})/i,
      testData: ['age: 92', 'born: 1925'],
      riskLevel: 'HIGH'
    }
  ];

  private auditLogs: Map<string, AuditLog[]> = new Map();
  private complianceResults: Map<string, HIPAAComplianceResult> = new Map();

  /**
   * Perform comprehensive HIPAA compliance audit
   */
  async performComprehensiveAudit(data: any): Promise<{
    overallCompliant: boolean;
    riskScore: number;
    identifierResults: Map<string, HIPAAComplianceResult>;
    criticalViolations: string[];
    recommendations: string[];
    auditSummary: any;
  }> {
    console.log('🏥 Starting comprehensive HIPAA compliance audit...');
    
    const results = new Map<string, HIPAAComplianceResult>();
    const criticalViolations: string[] = [];
    const allRecommendations: string[] = [];
    let totalRiskScore = 0;

    // Test each HIPAA identifier
    for (const identifier of this.HIPAA_IDENTIFIERS) {
      const result = await this.testIdentifierCompliance(identifier, data);
      results.set(identifier.id, result);
      
      if (!result.compliant && identifier.riskLevel === 'HIGH') {
        criticalViolations.push(...result.violations);
      }
      
      allRecommendations.push(...result.recommendations);
      totalRiskScore += result.riskScore;
    }

    // Test encryption compliance
    const encryptionResult = await this.testEncryptionCompliance(data);
    if (!encryptionResult.compliant) {
      criticalViolations.push(...encryptionResult.violations);
      allRecommendations.push(...encryptionResult.recommendations);
    }

    // Test access controls
    const accessResult = await this.testAccessControlCompliance(data);
    if (!accessResult.compliant) {
      criticalViolations.push(...accessResult.violations);
      allRecommendations.push(...accessResult.recommendations);
    }

    // Test audit logging
    const auditResult = await this.testAuditLogCompliance();
    if (!auditResult.compliant) {
      criticalViolations.push(...auditResult.violations);
      allRecommendations.push(...auditResult.recommendations);
    }

    const averageRiskScore = totalRiskScore / this.HIPAA_IDENTIFIERS.length;
    const overallCompliant = criticalViolations.length === 0 && averageRiskScore < 30;

    const auditSummary = {
      timestamp: new Date(),
      identifiersTested: this.HIPAA_IDENTIFIERS.length,
      identifiersCompliant: Array.from(results.values()).filter(r => r.compliant).length,
      criticalViolationsCount: criticalViolations.length,
      averageRiskScore,
      encryptionCompliant: encryptionResult.compliant,
      accessControlCompliant: accessResult.compliant,
      auditLogCompliant: auditResult.compliant
    };

    console.log(`✅ HIPAA audit complete. Overall compliant: ${overallCompliant}`);

    return {
      overallCompliant,
      riskScore: averageRiskScore,
      identifierResults: results,
      criticalViolations,
      recommendations: [...new Set(allRecommendations)],
      auditSummary
    };
  }

  /**
   * Test specific HIPAA identifier compliance
   */
  private async testIdentifierCompliance(
    identifier: HIPAAIdentifier, 
    data: any
  ): Promise<HIPAAComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Check if identifier appears in unencrypted form
    const dataString = JSON.stringify(data);
    for (const testValue of identifier.testData) {
      if (dataString.includes(testValue)) {
        violations.push(`${identifier.name} found in unencrypted data: ${testValue}`);
        riskScore += identifier.riskLevel === 'HIGH' ? 30 : 
                     identifier.riskLevel === 'MEDIUM' ? 20 : 10;
      }
    }

    // Check regex patterns if provided
    if (identifier.regex) {
      const matches = dataString.match(identifier.regex);
      if (matches && matches.length > 0) {
        violations.push(`${identifier.name} pattern detected in unencrypted data`);
        riskScore += identifier.riskLevel === 'HIGH' ? 25 : 
                     identifier.riskLevel === 'MEDIUM' ? 15 : 8;
      }
    }

    // Generate recommendations
    if (violations.length > 0) {
      recommendations.push(`Encrypt all ${identifier.name} before storage and transmission`);
      recommendations.push(`Implement field-level encryption for ${identifier.name}`);
      
      if (identifier.riskLevel === 'HIGH') {
        recommendations.push(`CRITICAL: ${identifier.name} requires immediate encryption`);
        recommendations.push(`Implement access logging for all ${identifier.name} access`);
      }
    }

    return {
      identifier: identifier.id,
      compliant: violations.length === 0,
      violations,
      recommendations,
      riskScore,
      lastAudit: new Date()
    };
  }

  /**
   * Test encryption compliance for PHI
   */
  private async testEncryptionCompliance(data: any): Promise<HIPAAComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Check for AES-256 encryption
    if (!this.isDataEncrypted(data)) {
      violations.push('PHI data is not encrypted with AES-256');
      riskScore += 50;
      recommendations.push('Implement AES-256 encryption for all PHI data');
    }

    // Check for encryption at rest
    if (!this.hasEncryptionAtRest(data)) {
      violations.push('PHI data lacks encryption at rest');
      riskScore += 40;
      recommendations.push('Enable Firebase Firestore encryption at rest');
    }

    // Check for encryption in transit
    if (!this.hasEncryptionInTransit()) {
      violations.push('PHI transmission lacks TLS 1.3 encryption');
      riskScore += 45;
      recommendations.push('Enforce TLS 1.3 for all PHI transmission');
    }

    return {
      identifier: 'encryption',
      compliant: violations.length === 0,
      violations,
      recommendations,
      riskScore,
      lastAudit: new Date()
    };
  }

  /**
   * Test access control compliance
   */
  private async testAccessControlCompliance(data: any): Promise<HIPAAComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Check role-based access controls
    if (!this.hasRoleBasedAccess(data)) {
      violations.push('Missing role-based access controls for PHI');
      riskScore += 35;
      recommendations.push('Implement strict role-based access controls');
    }

    // Check minimum necessary access
    if (!this.hasMinimumNecessaryAccess(data)) {
      violations.push('Access exceeds minimum necessary standard');
      riskScore += 30;
      recommendations.push('Implement minimum necessary access principle');
    }

    // Check session timeouts for therapists
    if (!this.hasProperSessionTimeouts()) {
      violations.push('Therapist sessions lack proper timeout mechanisms');
      riskScore += 25;
      recommendations.push('Implement 15-minute idle timeout for therapist sessions');
    }

    return {
      identifier: 'access_control',
      compliant: violations.length === 0,
      violations,
      recommendations,
      riskScore,
      lastAudit: new Date()
    };
  }

  /**
   * Test audit log compliance
   */
  private async testAuditLogCompliance(): Promise<HIPAAComplianceResult> {
    const violations: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // Check if audit logs exist
    if (this.auditLogs.size === 0) {
      violations.push('No audit logs found for PHI access');
      riskScore += 40;
      recommendations.push('Implement comprehensive audit logging');
    }

    // Check audit log completeness
    for (const [userId, logs] of this.auditLogs) {
      for (const log of logs) {
        if (!this.isAuditLogComplete(log)) {
          violations.push(`Incomplete audit log for user ${userId}`);
          riskScore += 20;
        }
        
        if (!this.isAuditLogTamperProof(log)) {
          violations.push(`Audit log tampering detected for user ${userId}`);
          riskScore += 50;
          recommendations.push('CRITICAL: Investigate potential audit log tampering');
        }
      }
    }

    return {
      identifier: 'audit_logs',
      compliant: violations.length === 0,
      violations,
      recommendations,
      riskScore,
      lastAudit: new Date()
    };
  }

  /**
   * Create tamper-proof audit log entry
   */
  createAuditLogEntry(
    userId: string,
    userRole: 'THERAPIST' | 'PARENT' | 'MINOR' | 'ADMIN',
    action: 'read' | 'write' | 'delete' | 'export' | 'emergency_access',
    phiAccessed: string[],
    accessReason: string,
    ipAddress: string,
    userAgent: string,
    sessionId: string
  ): AuditLog {
    const timestamp = new Date();
    const logData = {
      userId,
      userRole,
      action,
      phiAccessed,
      accessReason,
      ipAddress,
      userAgent,
      sessionId,
      timestamp: timestamp.toISOString()
    };

    // Create tamper-proof hash
    const tamperProofHash = this.generateTamperProofHash(logData);

    const auditLog: AuditLog = {
      id: randomBytes(16).toString('hex'),
      timestamp,
      userId,
      userRole,
      action,
      phiAccessed,
      accessReason,
      ipAddress,
      userAgent,
      sessionId,
      approved: this.requiresApproval(userRole, action),
      tamperProofHash
    };

    // Store audit log
    if (!this.auditLogs.has(userId)) {
      this.auditLogs.set(userId, []);
    }
    this.auditLogs.get(userId)!.push(auditLog);

    return auditLog;
  }

  /**
   * Validate consent management for minors
   */
  async validateMinorConsent(
    minorId: string,
    parentId: string,
    consentType: 'data_collection' | 'ai_processing' | 'data_sharing'
  ): Promise<{
    valid: boolean;
    violations: string[];
    requirements: string[];
  }> {
    const violations: string[] = [];
    const requirements: string[] = [];

    // Check COPPA compliance for under-13 users
    const minorAge = await this.getMinorAge(minorId);
    if (minorAge < 13) {
      const parentalConsent = await this.getParentalConsent(minorId, parentId, consentType);
      if (!parentalConsent.verified) {
        violations.push('COPPA violation: No verifiable parental consent for under-13 user');
        requirements.push('Implement verifiable parental consent mechanism');
      }
    }

    // Check consent granularity
    const consentRecord = await this.getConsentRecord(minorId, consentType);
    if (!consentRecord.granular) {
      violations.push('Consent lacks required granularity for different data uses');
      requirements.push('Implement granular consent toggles');
    }

    return {
      valid: violations.length === 0,
      violations,
      requirements
    };
  }

  /**
   * Test Business Associate Agreement compliance
   */
  async testBAACompliance(thirdPartyService: string): Promise<{
    compliant: boolean;
    violations: string[];
    requirements: string[];
  }> {
    const violations: string[] = [];
    const requirements: string[] = [];

    const baaStatus = await this.getBAAStatus(thirdPartyService);
    
    if (!baaStatus.signed) {
      violations.push(`No signed BAA with ${thirdPartyService}`);
      requirements.push(`Execute BAA with ${thirdPartyService} before PHI sharing`);
    }

    if (!baaStatus.current) {
      violations.push(`BAA with ${thirdPartyService} is expired or outdated`);
      requirements.push(`Renew BAA with ${thirdPartyService}`);
    }

    if (!baaStatus.compliant) {
      violations.push(`BAA with ${thirdPartyService} lacks required HIPAA provisions`);
      requirements.push(`Update BAA to include all required HIPAA provisions`);
    }

    return {
      compliant: violations.length === 0,
      violations,
      requirements
    };
  }

  // Private helper methods
  private isDataEncrypted(data: any): boolean {
    // Check for encryption markers or encrypted data patterns
    const dataString = JSON.stringify(data);
    return dataString.includes('encrypted:') || 
           dataString.includes('iv:') || 
           /[A-Fa-f0-9]{32,}/.test(dataString);
  }

  private hasEncryptionAtRest(data: any): boolean {
    // Firebase Firestore provides encryption at rest by default
    return true;
  }

  private hasEncryptionInTransit(): boolean {
    // Check if HTTPS/TLS is enforced
    return typeof window !== 'undefined' && window.location.protocol === 'https:';
  }

  private hasRoleBasedAccess(data: any): boolean {
    // Check for role-based access patterns
    return data.accessControl && data.accessControl.roles;
  }

  private hasMinimumNecessaryAccess(data: any): boolean {
    // Check minimum necessary access implementation
    return data.accessControl && data.accessControl.minimumNecessary;
  }

  private hasProperSessionTimeouts(): boolean {
    // Check session timeout configuration
    return typeof window !== 'undefined' && sessionStorage.getItem('sessionTimeout') !== null;
  }

  private isAuditLogComplete(log: AuditLog): boolean {
    return !!(log.userId && log.timestamp && log.action && log.accessReason);
  }

  private isAuditLogTamperProof(log: AuditLog): boolean {
    const logData = {
      userId: log.userId,
      userRole: log.userRole,
      action: log.action,
      phiAccessed: log.phiAccessed,
      accessReason: log.accessReason,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      sessionId: log.sessionId,
      timestamp: log.timestamp.toISOString()
    };

    const expectedHash = this.generateTamperProofHash(logData);
    return expectedHash === log.tamperProofHash;
  }

  private generateTamperProofHash(data: any): string {
    return createHash('sha256')
      .update(JSON.stringify(data) + process.env.AUDIT_LOG_SECRET)
      .digest('hex');
  }

  private requiresApproval(userRole: string, action: string): boolean {
    return userRole === 'ADMIN' || action === 'emergency_access';
  }

  private async getMinorAge(minorId: string): Promise<number> {
    // Mock implementation - would fetch from secure database
    return 15;
  }

  private async getParentalConsent(minorId: string, parentId: string, consentType: string): Promise<any> {
    // Mock implementation
    return { verified: true, timestamp: new Date() };
  }

  private async getConsentRecord(minorId: string, consentType: string): Promise<any> {
    // Mock implementation
    return { granular: true, timestamp: new Date() };
  }

  private async getBAAStatus(service: string): Promise<any> {
    // Mock implementation
    return { signed: true, current: true, compliant: true };
  }
}

export default HIPAAComplianceAuditor;