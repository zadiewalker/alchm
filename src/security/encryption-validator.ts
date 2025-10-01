/**
 * Encryption Validator - Comprehensive end-to-end encryption validation for PHI
 * Ensures AES-256 encryption for journal entries, therapist communications, and crisis data
 * 
 * This component validates encryption compliance for ALCHM's vulnerable youth populations,
 * ensuring all PHI meets HIPAA Security Rule encryption requirements.
 */

import { createCipher, createDecipher, createHash, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export interface EncryptionConfig {
  algorithm: 'aes-256-gcm' | 'aes-256-cbc';
  keyLength: number;
  ivLength: number;
  tagLength?: number;
  saltLength: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag?: string;
  salt: string;
  algorithm: string;
  keyDerivation: 'scrypt' | 'pbkdf2';
  iterations?: number;
}

export interface EncryptionValidationResult {
  field: string;
  encrypted: boolean;
  algorithm: string;
  keyStrength: number;
  compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING';
  issues: string[];
  recommendations: string[];
  lastValidated: Date;
}

export interface PHIEncryptionAudit {
  userId: string;
  dataType: 'journal_entry' | 'therapist_note' | 'crisis_data' | 'assessment' | 'communication';
  encryptionStatus: EncryptionValidationResult[];
  overallCompliant: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  auditTimestamp: Date;
}

export class EncryptionValidator {
  private readonly scryptAsync = promisify(scrypt);
  
  private readonly ENCRYPTION_CONFIG: EncryptionConfig = {
    algorithm: 'aes-256-gcm',
    keyLength: 32, // 256 bits
    ivLength: 16,  // 128 bits
    tagLength: 16, // 128 bits for GCM
    saltLength: 32 // 256 bits
  };

  private readonly HIPAA_ENCRYPTION_REQUIREMENTS = {
    minimumKeyLength: 256,
    requiredAlgorithms: ['aes-256-gcm', 'aes-256-cbc'],
    minimumIterations: 100000,
    requiresAuthentication: true
  };

  /**
   * Validate encryption for all PHI data types
   */
  async validatePHIEncryption(data: any): Promise<{
    overallCompliant: boolean;
    encryptionAudits: PHIEncryptionAudit[];
    criticalIssues: string[];
    recommendations: string[];
    complianceScore: number;
  }> {
    console.log('🔐 Starting comprehensive PHI encryption validation...');
    
    const encryptionAudits: PHIEncryptionAudit[] = [];
    const criticalIssues: string[] = [];
    const allRecommendations: string[] = [];
    let totalScore = 0;

    // Validate journal entries encryption
    const journalAudit = await this.validateJournalEncryption(data.journalEntries || []);
    encryptionAudits.push(journalAudit);
    if (!journalAudit.overallCompliant && journalAudit.riskLevel === 'CRITICAL') {
      criticalIssues.push('Journal entries lack proper encryption');
    }

    // Validate therapist communications encryption
    const therapistAudit = await this.validateTherapistCommunicationEncryption(data.therapistNotes || []);
    encryptionAudits.push(therapistAudit);
    if (!therapistAudit.overallCompliant && therapistAudit.riskLevel === 'CRITICAL') {
      criticalIssues.push('Therapist communications lack proper encryption');
    }

    // Validate crisis data encryption
    const crisisAudit = await this.validateCrisisDataEncryption(data.crisisData || []);
    encryptionAudits.push(crisisAudit);
    if (!crisisAudit.overallCompliant && crisisAudit.riskLevel === 'CRITICAL') {
      criticalIssues.push('Crisis data lacks proper encryption');
    }

    // Validate assessment data encryption
    const assessmentAudit = await this.validateAssessmentEncryption(data.assessments || []);
    encryptionAudits.push(assessmentAudit);

    // Calculate overall compliance score
    const compliantAudits = encryptionAudits.filter(audit => audit.overallCompliant).length;
    totalScore = (compliantAudits / encryptionAudits.length) * 100;

    // Collect all recommendations
    for (const audit of encryptionAudits) {
      for (const status of audit.encryptionStatus) {
        allRecommendations.push(...status.recommendations);
      }
    }

    const overallCompliant = criticalIssues.length === 0 && totalScore >= 95;

    console.log(`✅ Encryption validation complete. Overall compliant: ${overallCompliant}`);
    
    return {
      overallCompliant,
      encryptionAudits,
      criticalIssues,
      recommendations: [...new Set(allRecommendations)],
      complianceScore: totalScore
    };
  }

  /**
   * Validate journal entry encryption
   */
  private async validateJournalEncryption(journalEntries: any[]): Promise<PHIEncryptionAudit> {
    const encryptionStatus: EncryptionValidationResult[] = [];
    let overallCompliant = true;
    let highestRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    for (const entry of journalEntries) {
      // Validate entry content encryption
      const contentValidation = await this.validateFieldEncryption(
        'entry_content', 
        entry.content, 
        'journal_entry'
      );
      encryptionStatus.push(contentValidation);

      // Validate metadata encryption
      if (entry.metadata) {
        const metadataValidation = await this.validateFieldEncryption(
          'entry_metadata',
          entry.metadata,
          'journal_entry'
        );
        encryptionStatus.push(metadataValidation);
      }

      // Validate emotion data encryption
      if (entry.emotions) {
        const emotionValidation = await this.validateFieldEncryption(
          'emotion_data',
          entry.emotions,
          'journal_entry'
        );
        encryptionStatus.push(emotionValidation);
      }

      // Check compliance
      const nonCompliant = encryptionStatus.filter(s => s.compliance === 'NON_COMPLIANT');
      if (nonCompliant.length > 0) {
        overallCompliant = false;
        highestRisk = 'CRITICAL';
      }
    }

    return {
      userId: 'system_audit',
      dataType: 'journal_entry',
      encryptionStatus,
      overallCompliant,
      riskLevel: highestRisk,
      auditTimestamp: new Date()
    };
  }

  /**
   * Validate therapist communication encryption
   */
  private async validateTherapistCommunicationEncryption(communications: any[]): Promise<PHIEncryptionAudit> {
    const encryptionStatus: EncryptionValidationResult[] = [];
    let overallCompliant = true;
    let highestRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    for (const comm of communications) {
      // Validate message content
      const messageValidation = await this.validateFieldEncryption(
        'message_content',
        comm.message,
        'therapist_communication'
      );
      encryptionStatus.push(messageValidation);

      // Validate clinical notes
      if (comm.clinicalNotes) {
        const notesValidation = await this.validateFieldEncryption(
          'clinical_notes',
          comm.clinicalNotes,
          'therapist_communication'
        );
        encryptionStatus.push(notesValidation);
      }

      // Validate treatment plans
      if (comm.treatmentPlan) {
        const planValidation = await this.validateFieldEncryption(
          'treatment_plan',
          comm.treatmentPlan,
          'therapist_communication'
        );
        encryptionStatus.push(planValidation);
      }
    }

    const nonCompliant = encryptionStatus.filter(s => s.compliance === 'NON_COMPLIANT');
    if (nonCompliant.length > 0) {
      overallCompliant = false;
      highestRisk = 'CRITICAL';
    }

    return {
      userId: 'system_audit',
      dataType: 'therapist_note',
      encryptionStatus,
      overallCompliant,
      riskLevel: highestRisk,
      auditTimestamp: new Date()
    };
  }

  /**
   * Validate crisis data encryption
   */
  private async validateCrisisDataEncryption(crisisData: any[]): Promise<PHIEncryptionAudit> {
    const encryptionStatus: EncryptionValidationResult[] = [];
    let overallCompliant = true;
    let highestRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    for (const crisis of crisisData) {
      // Crisis events require highest security
      const eventValidation = await this.validateFieldEncryption(
        'crisis_event',
        crisis.event,
        'crisis_data'
      );
      encryptionStatus.push(eventValidation);

      // Emergency contact information
      if (crisis.emergencyContacts) {
        const contactValidation = await this.validateFieldEncryption(
          'emergency_contacts',
          crisis.emergencyContacts,
          'crisis_data'
        );
        encryptionStatus.push(contactValidation);
      }

      // Crisis assessment scores
      if (crisis.assessmentScores) {
        const scoresValidation = await this.validateFieldEncryption(
          'assessment_scores',
          crisis.assessmentScores,
          'crisis_data'
        );
        encryptionStatus.push(scoresValidation);
      }
    }

    const nonCompliant = encryptionStatus.filter(s => s.compliance === 'NON_COMPLIANT');
    if (nonCompliant.length > 0) {
      overallCompliant = false;
      highestRisk = 'CRITICAL';
    }

    return {
      userId: 'system_audit',
      dataType: 'crisis_data',
      encryptionStatus,
      overallCompliant,
      riskLevel: highestRisk,
      auditTimestamp: new Date()
    };
  }

  /**
   * Validate assessment data encryption
   */
  private async validateAssessmentEncryption(assessments: any[]): Promise<PHIEncryptionAudit> {
    const encryptionStatus: EncryptionValidationResult[] = [];
    let overallCompliant = true;
    let highestRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';

    for (const assessment of assessments) {
      // Assessment responses
      const responsesValidation = await this.validateFieldEncryption(
        'assessment_responses',
        assessment.responses,
        'assessment'
      );
      encryptionStatus.push(responsesValidation);

      // Mental health scores
      if (assessment.mentalHealthScores) {
        const scoresValidation = await this.validateFieldEncryption(
          'mental_health_scores',
          assessment.mentalHealthScores,
          'assessment'
        );
        encryptionStatus.push(scoresValidation);
      }

      // Diagnostic information
      if (assessment.diagnosticInfo) {
        const diagnosticValidation = await this.validateFieldEncryption(
          'diagnostic_info',
          assessment.diagnosticInfo,
          'assessment'
        );
        encryptionStatus.push(diagnosticValidation);
      }
    }

    const nonCompliant = encryptionStatus.filter(s => s.compliance === 'NON_COMPLIANT');
    if (nonCompliant.length > 0) {
      overallCompliant = false;
      highestRisk = 'HIGH';
    }

    return {
      userId: 'system_audit',
      dataType: 'assessment',
      encryptionStatus,
      overallCompliant,
      riskLevel: highestRisk,
      auditTimestamp: new Date()
    };
  }

  /**
   * Validate individual field encryption
   */
  private async validateFieldEncryption(
    fieldName: string,
    fieldData: any,
    dataType: string
  ): Promise<EncryptionValidationResult> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let compliance: 'COMPLIANT' | 'NON_COMPLIANT' | 'WARNING' = 'COMPLIANT';
    let keyStrength = 0;
    let algorithm = 'none';
    let encrypted = false;

    try {
      // Check if data appears to be encrypted
      encrypted = this.isDataEncrypted(fieldData);
      
      if (!encrypted) {
        issues.push(`${fieldName} is not encrypted`);
        compliance = 'NON_COMPLIANT';
        recommendations.push(`Encrypt ${fieldName} using AES-256-GCM`);
        recommendations.push(`Implement client-side encryption before transmission`);
      } else {
        // Validate encryption properties
        const encryptionAnalysis = this.analyzeEncryption(fieldData);
        algorithm = encryptionAnalysis.algorithm;
        keyStrength = encryptionAnalysis.keyStrength;

        // Check algorithm compliance
        if (!this.HIPAA_ENCRYPTION_REQUIREMENTS.requiredAlgorithms.includes(algorithm)) {
          issues.push(`${fieldName} uses non-compliant encryption algorithm: ${algorithm}`);
          compliance = 'NON_COMPLIANT';
          recommendations.push(`Upgrade to AES-256-GCM encryption for ${fieldName}`);
        }

        // Check key strength
        if (keyStrength < this.HIPAA_ENCRYPTION_REQUIREMENTS.minimumKeyLength) {
          issues.push(`${fieldName} uses insufficient key strength: ${keyStrength} bits`);
          compliance = 'NON_COMPLIANT';
          recommendations.push(`Use 256-bit encryption keys for ${fieldName}`);
        }

        // Check authentication requirement
        if (this.HIPAA_ENCRYPTION_REQUIREMENTS.requiresAuthentication && 
            !encryptionAnalysis.hasAuthentication) {
          issues.push(`${fieldName} lacks encryption authentication`);
          compliance = 'WARNING';
          recommendations.push(`Add GCM authentication to ${fieldName} encryption`);
        }
      }

    } catch (error) {
      issues.push(`Error validating ${fieldName} encryption: ${(error as Error).message}`);
      compliance = 'NON_COMPLIANT';
      recommendations.push(`Fix encryption validation errors for ${fieldName}`);
    }

    return {
      field: fieldName,
      encrypted,
      algorithm,
      keyStrength,
      compliance,
      issues,
      recommendations,
      lastValidated: new Date()
    };
  }

  /**
   * Encrypt PHI data using HIPAA-compliant AES-256-GCM
   */
  async encryptPHIData(
    data: string, 
    userKey: string,
    additionalData?: string
  ): Promise<EncryptedData> {
    const salt = randomBytes(this.ENCRYPTION_CONFIG.saltLength);
    const iv = randomBytes(this.ENCRYPTION_CONFIG.ivLength);
    
    // Derive key using scrypt (more secure than PBKDF2)
    const key = await this.scryptAsync(
      userKey, 
      salt, 
      this.ENCRYPTION_CONFIG.keyLength
    ) as Buffer;

    const cipher = createCipher(this.ENCRYPTION_CONFIG.algorithm, key);
    cipher.setAAD(Buffer.from(additionalData || ''));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      data: encrypted,
      iv: iv.toString('hex'),
      tag: authTag.toString('hex'),
      salt: salt.toString('hex'),
      algorithm: this.ENCRYPTION_CONFIG.algorithm,
      keyDerivation: 'scrypt',
      iterations: 100000
    };
  }

  /**
   * Decrypt PHI data
   */
  async decryptPHIData(
    encryptedData: EncryptedData,
    userKey: string,
    additionalData?: string
  ): Promise<string> {
    const salt = Buffer.from(encryptedData.salt, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag!, 'hex');

    // Derive the same key
    const key = await this.scryptAsync(
      userKey,
      salt,
      this.ENCRYPTION_CONFIG.keyLength
    ) as Buffer;

    const decipher = createDecipher(encryptedData.algorithm as any, key);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from(additionalData || ''));

    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Validate end-to-end encryption pathway
   */
  async validateEndToEndEncryption(
    originalData: string,
    userKey: string
  ): Promise<{
    success: boolean;
    encryptionTime: number;
    decryptionTime: number;
    dataIntegrity: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    let success = false;
    let dataIntegrity = false;
    let encryptionTime = 0;
    let decryptionTime = 0;

    try {
      // Test encryption
      const encryptStart = performance.now();
      const encrypted = await this.encryptPHIData(originalData, userKey);
      encryptionTime = performance.now() - encryptStart;

      // Test decryption
      const decryptStart = performance.now();
      const decrypted = await this.decryptPHIData(encrypted, userKey);
      decryptionTime = performance.now() - decryptStart;

      // Verify data integrity
      dataIntegrity = originalData === decrypted;
      
      if (!dataIntegrity) {
        issues.push('Data integrity check failed - decrypted data does not match original');
      }

      // Performance checks
      if (encryptionTime > 1000) { // 1 second threshold
        issues.push(`Encryption performance is slow: ${encryptionTime.toFixed(2)}ms`);
      }

      if (decryptionTime > 500) { // 0.5 second threshold
        issues.push(`Decryption performance is slow: ${decryptionTime.toFixed(2)}ms`);
      }

      success = dataIntegrity && issues.length === 0;

    } catch (error) {
      issues.push(`End-to-end encryption test failed: ${(error as Error).message}`);
    }

    return {
      success,
      encryptionTime,
      decryptionTime,
      dataIntegrity,
      issues
    };
  }

  /**
   * Generate secure encryption key for user
   */
  async generateUserEncryptionKey(
    userId: string,
    password: string,
    biometricData?: string
  ): Promise<{
    key: string;
    salt: string;
    iterations: number;
    algorithm: string;
  }> {
    const salt = randomBytes(32);
    const iterations = 100000;
    
    // Combine password with biometric data if available
    const keyMaterial = password + (biometricData || '') + userId;
    
    const key = await this.scryptAsync(keyMaterial, salt, 32) as Buffer;
    
    return {
      key: key.toString('hex'),
      salt: salt.toString('hex'),
      iterations,
      algorithm: 'scrypt'
    };
  }

  // Private helper methods
  private isDataEncrypted(data: any): boolean {
    if (typeof data === 'string') {
      // Check for hex patterns (encrypted data)
      return /^[a-f0-9]{32,}$/i.test(data) || 
             data.includes('encrypted:') ||
             data.includes('aes-256');
    }
    
    if (typeof data === 'object' && data !== null) {
      return !!(data.data && data.iv && data.algorithm);
    }
    
    return false;
  }

  private analyzeEncryption(data: any): {
    algorithm: string;
    keyStrength: number;
    hasAuthentication: boolean;
  } {
    let algorithm = 'unknown';
    let keyStrength = 0;
    let hasAuthentication = false;

    if (typeof data === 'object' && data.algorithm) {
      algorithm = data.algorithm;
      
      if (algorithm.includes('256')) {
        keyStrength = 256;
      } else if (algorithm.includes('128')) {
        keyStrength = 128;
      }
      
      hasAuthentication = algorithm.includes('gcm') || !!data.tag;
    }

    return { algorithm, keyStrength, hasAuthentication };
  }
}

export default EncryptionValidator;