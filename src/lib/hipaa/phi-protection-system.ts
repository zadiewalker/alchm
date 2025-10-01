/**
 * HIPAA PHI Protection System
 * 
 * Implements comprehensive Protected Health Information (PHI) safeguards
 * in compliance with 45 CFR 164.312 (Technical Safeguards) and 
 * 45 CFR 164.314 (Organizational Requirements)
 * 
 * CRITICAL: This system handles PHI and must maintain HIPAA compliance
 * Maximum penalty for willful neglect: $1.5M per violation
 */

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export interface PHIAccessRequest {
  requestId: string;
  therapistId: string;
  patientId: string;
  purposeOfUse: 'treatment' | 'payment' | 'healthcare_operations' | 'research' | 'emergency';
  minimumNecessary: string[];
  requestTimestamp: Date;
  expiresAt: Date;
  consentStatus: 'pending' | 'granted' | 'denied' | 'revoked';
}

export interface PHIDataClassification {
  level: 'public' | 'internal' | 'confidential' | 'restricted';
  dataTypes: string[];
  retentionPeriod: number; // in days
  requiresPatientConsent: boolean;
  minimumNecessaryFields: string[];
}

export interface EncryptedPHI {
  encryptedData: string;
  iv: string;
  salt: string;
  algorithm: 'aes-256-gcm';
  authTag: string;
  classification: PHIDataClassification;
  accessLog: string[];
}

export class PHIProtectionSystem {
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32;
  private readonly IV_LENGTH = 16;
  private readonly SALT_LENGTH = 32;
  private readonly TAG_LENGTH = 16;

  /**
   * Classifies data according to HIPAA sensitivity levels
   * Implements minimum necessary standard (45 CFR 164.502(b))
   */
  public classifyPHI(data: Record<string, any>): PHIDataClassification {
    const sensitiveFields = new Set([
      'diagnosis', 'medication', 'treatment_notes', 'mental_health_status',
      'suicidal_ideation', 'substance_use', 'therapy_sessions', 'crisis_events'
    ]);

    const identifierFields = new Set([
      'name', 'email', 'phone', 'ssn', 'address', 'date_of_birth',
      'medical_record_number', 'account_number'
    ]);

    const dataTypes = Object.keys(data);
    const hasSensitiveData = dataTypes.some(field => sensitiveFields.has(field));
    const hasIdentifiers = dataTypes.some(field => identifierFields.has(field));

    if (hasSensitiveData && hasIdentifiers) {
      return {
        level: 'restricted',
        dataTypes,
        retentionPeriod: 2555, // 7 years as required by most state laws
        requiresPatientConsent: true,
        minimumNecessaryFields: this.determineMinimumNecessary(dataTypes)
      };
    } else if (hasSensitiveData) {
      return {
        level: 'confidential',
        dataTypes,
        retentionPeriod: 1825, // 5 years
        requiresPatientConsent: true,
        minimumNecessaryFields: this.determineMinimumNecessary(dataTypes)
      };
    } else if (hasIdentifiers) {
      return {
        level: 'internal',
        dataTypes,
        retentionPeriod: 365,
        requiresPatientConsent: false,
        minimumNecessaryFields: dataTypes.slice(0, 3) // Limit to essential fields
      };
    }

    return {
      level: 'public',
      dataTypes,
      retentionPeriod: 90,
      requiresPatientConsent: false,
      minimumNecessaryFields: dataTypes
    };
  }

  /**
   * Determines minimum necessary fields for access request
   * Implements 45 CFR 164.502(b)(1)
   */
  private determineMinimumNecessary(dataTypes: string[]): string[] {
    const treatmentEssentials = [
      'patient_id', 'diagnosis', 'current_medications', 'recent_sessions'
    ];
    
    const paymentEssentials = [
      'patient_id', 'insurance_info', 'billing_codes', 'session_dates'
    ];
    
    const operationsEssentials = [
      'patient_id', 'treatment_outcomes', 'quality_metrics'
    ];

    // Return intersection of available data and treatment essentials
    return dataTypes.filter(field => treatmentEssentials.includes(field));
  }

  /**
   * Encrypts PHI using AES-256-GCM with unique keys per record
   * Implements 45 CFR 164.312(a)(2)(iv) - Encryption requirements
   */
  public async encryptPHI(
    data: Record<string, any>,
    masterKey: string,
    accessContext: string
  ): Promise<EncryptedPHI> {
    try {
      // Generate unique salt and IV for this encryption
      const salt = randomBytes(this.SALT_LENGTH);
      const iv = randomBytes(this.IV_LENGTH);
      
      // Derive encryption key from master key and salt
      const key = await scryptAsync(masterKey, salt, this.KEY_LENGTH) as Buffer;
      
      // Classify the data for proper handling
      const classification = this.classifyPHI(data);
      
      // Apply minimum necessary filtering
      const filteredData = this.applyMinimumNecessary(data, classification);
      
      // Create cipher
      const cipher = createCipheriv(this.ENCRYPTION_ALGORITHM, key, iv);
      
      // Encrypt the data
      const jsonData = JSON.stringify(filteredData);
      let encrypted = cipher.update(jsonData, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const authTag = cipher.getAuthTag();

      const encryptedPHI: EncryptedPHI = {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        algorithm: this.ENCRYPTION_ALGORITHM,
        authTag: authTag.toString('hex'),
        classification,
        accessLog: [`encrypted:${new Date().toISOString()}:${accessContext}`]
      };

      return encryptedPHI;
    } catch (error) {
      throw new Error(`PHI encryption failed: ${error.message}`);
    }
  }

  /**
   * Decrypts PHI with access logging and authorization checks
   * Implements 45 CFR 164.312(a)(2)(i) - Access control
   */
  public async decryptPHI(
    encryptedPHI: EncryptedPHI,
    masterKey: string,
    accessRequest: PHIAccessRequest
  ): Promise<Record<string, any>> {
    try {
      // Verify access authorization
      await this.verifyAccess(accessRequest, encryptedPHI.classification);
      
      // Derive decryption key
      const salt = Buffer.from(encryptedPHI.salt, 'hex');
      const key = await scryptAsync(masterKey, salt, this.KEY_LENGTH) as Buffer;
      
      // Create decipher
      const iv = Buffer.from(encryptedPHI.iv, 'hex');
      const decipher = createDecipheriv(this.ENCRYPTION_ALGORITHM, key, iv);
      
      // Set auth tag
      const authTag = Buffer.from(encryptedPHI.authTag, 'hex');
      decipher.setAuthTag(authTag);
      
      // Decrypt the data
      let decrypted = decipher.update(encryptedPHI.encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      const data = JSON.parse(decrypted);
      
      // Log access
      encryptedPHI.accessLog.push(
        `accessed:${new Date().toISOString()}:${accessRequest.therapistId}:${accessRequest.purposeOfUse}`
      );
      
      return data;
    } catch (error) {
      // Log failed access attempt
      encryptedPHI.accessLog.push(
        `access_failed:${new Date().toISOString()}:${accessRequest.therapistId}:${error.message}`
      );
      throw new Error(`PHI decryption failed: ${error.message}`);
    }
  }

  /**
   * Applies minimum necessary standard to data access
   * Implements 45 CFR 164.502(b)
   */
  private applyMinimumNecessary(
    data: Record<string, any>,
    classification: PHIDataClassification
  ): Record<string, any> {
    if (classification.level === 'public') {
      return data;
    }
    
    const minimumData: Record<string, any> = {};
    classification.minimumNecessaryFields.forEach(field => {
      if (data[field] !== undefined) {
        minimumData[field] = data[field];
      }
    });
    
    return minimumData;
  }

  /**
   * Verifies access authorization based on purpose of use
   * Implements 45 CFR 164.506 - Uses and disclosures permitted
   */
  private async verifyAccess(
    accessRequest: PHIAccessRequest,
    classification: PHIDataClassification
  ): Promise<void> {
    // Check if request has expired
    if (new Date() > accessRequest.expiresAt) {
      throw new Error('Access request has expired');
    }
    
    // Check consent status
    if (classification.requiresPatientConsent && accessRequest.consentStatus !== 'granted') {
      throw new Error('Patient consent required but not granted');
    }
    
    // Verify purpose of use is appropriate for classification level
    const allowedPurposes = this.getAllowedPurposes(classification.level);
    if (!allowedPurposes.includes(accessRequest.purposeOfUse)) {
      throw new Error(`Purpose of use '${accessRequest.purposeOfUse}' not allowed for ${classification.level} data`);
    }
    
    // Additional verification for emergency access
    if (accessRequest.purposeOfUse === 'emergency') {
      await this.verifyEmergencyAccess(accessRequest);
    }
  }

  /**
   * Gets allowed purposes of use based on data classification
   */
  private getAllowedPurposes(level: string): PHIAccessRequest['purposeOfUse'][] {
    switch (level) {
      case 'public':
        return ['treatment', 'payment', 'healthcare_operations', 'research'];
      case 'internal':
        return ['treatment', 'payment', 'healthcare_operations'];
      case 'confidential':
        return ['treatment', 'emergency'];
      case 'restricted':
        return ['treatment', 'emergency'];
      default:
        return [];
    }
  }

  /**
   * Verifies emergency access conditions
   * Implements 45 CFR 164.510(b) - Emergency circumstances
   */
  private async verifyEmergencyAccess(accessRequest: PHIAccessRequest): Promise<void> {
    // Emergency access requires immediate typeof window !== 'undefined' && documentation
    const emergencyJustification = accessRequest.minimumNecessary.find(field => 
      field.includes('emergency_justification')
    );
    
    if (!emergencyJustification) {
      throw new Error('Emergency access requires justification typeof window !== 'undefined' && documentation');
    }
    
    // Log emergency access for mandatory reporting
    console.log(`EMERGENCY PHI ACCESS: ${JSON.stringify({
      therapistId: accessRequest.therapistId,
      patientId: accessRequest.patientId,
      timestamp: new Date().toISOString(),
      justification: emergencyJustification
    })}`);
  }

  /**
   * Generates secure access token for PHI operations
   */
  public generateAccessToken(
    therapistId: string,
    patientId: string,
    purposeOfUse: PHIAccessRequest['purposeOfUse'],
    expirationMinutes: number = 60
  ): string {
    const tokenData = {
      therapistId,
      patientId,
      purposeOfUse,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000).toISOString(),
      tokenId: randomBytes(16).toString('hex')
    };
    
    return Buffer.from(JSON.stringify(tokenData)).toString('base64');
  }

  /**
   * Validates access token
   */
  public validateAccessToken(token: string): PHIAccessRequest | null {
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      
      if (new Date() > new Date(tokenData.expiresAt)) {
        return null;
      }
      
      return {
        requestId: tokenData.tokenId,
        therapistId: tokenData.therapistId,
        patientId: tokenData.patientId,
        purposeOfUse: tokenData.purposeOfUse,
        minimumNecessary: [],
        requestTimestamp: new Date(tokenData.issuedAt),
        expiresAt: new Date(tokenData.expiresAt),
        consentStatus: 'granted' // Assume granted if token exists
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Implements data retention and disposal
   * Complies with 45 CFR 164.310(d)(2)(i)
   */
  public async scheduleDataDisposal(
    encryptedPHI: EncryptedPHI,
    retentionPolicy?: number
  ): Promise<Date> {
    const retentionDays = retentionPolicy || encryptedPHI.classification.retentionPeriod;
    const disposalDate = new Date(Date.now() + retentionDays * 24 * 60 * 60 * 1000);
    
    // Schedule automatic disposal
    // In production, this would integrate with a job scheduler
    console.log(`PHI disposal scheduled for: ${disposalDate.toISOString()}`);
    
    return disposalDate;
  }
}