/**
 * ALCHM Privacy-First Analytics Engine
 * 
 * Implements:
 * - K-anonymity (minimum cohort size: 5)
 * - Differential privacy with calibrated noise
 * - HIPAA-compliant data anonymization
 * - Cryptographic user ID hashing
 * - Automated PII detection and removal
 */

import crypto from 'crypto';
import { PrivacyConfig, AnonymizedUserId, PrivacyValidationResult, DataMinimizationReport } from './types';

export class PrivacyEngine {
  private config: PrivacyConfig;
  private readonly SALT_ROTATION_DAYS = 30;
  private readonly NOISE_SEED = 'alchm_privacy_noise_2024';

  constructor(config?: Partial<PrivacyConfig>) {
    this.config = {
      minimumCohortSize: 5,
      noiseLevel: 0.1,
      retentionDays: 90,
      anonymizationSalt: this.generateSalt(),
      ...config
    };
  }

  /**
   * Anonymize user ID using cryptographic hashing
   */
  anonymizeUserId(userId: string, cohortIdentifier?: string): AnonymizedUserId {
    const hash = crypto
      .createHash('sha256')
      .update(userId + this.config.anonymizationSalt)
      .digest('hex');

    const cohortId = cohortIdentifier || this.generateCohortId(hash);

    return {
      hash: hash.substring(0, 16), // Use first 16 chars for storage efficiency
      cohortId,
      created: new Date()
    };
  }

  /**
   * Apply differential privacy noise to numerical data
   */
  applyDifferentialPrivacy(value: number, sensitivity: number = 1): number {
    const epsilon = this.config.noiseLevel;
    const scale = sensitivity / epsilon;
    
    // Generate Laplace noise
    const u = Math.random() - 0.5;
    const noise = -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
    
    return Math.max(0, Math.round(value + noise));
  }

  /**
   * Validate k-anonymity for a dataset
   */
  validateKAnonymity(dataset: any[], groupByFields: string[]): boolean {
    const groups = new Map<string, number>();
    
    dataset.forEach(record => {
      const key = groupByFields.map(field => record[field]).join('|');
      groups.set(key, (groups.get(key) || 0) + 1);
    });

    // Check if all groups meet minimum cohort size
    return Array.from(groups.values()).every(count => count >= this.config.minimumCohortSize);
  }

  /**
   * Aggregate data to ensure k-anonymity
   */
  enforceKAnonymity<T extends Record<string, any>>(
    dataset: T[],
    groupByFields: string[],
    aggregationFields: string[]
  ): T[] {
    const groups = new Map<string, T[]>();
    
    // Group records by quasi-identifiers
    dataset.forEach(record => {
      const key = groupByFields.map(field => record[field]).join('|');
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(record);
    });

    const result: T[] = [];

    groups.forEach((records, key) => {
      if (records.length >= this.config.minimumCohortSize) {
        // If group meets k-anonymity, aggregate the values
        const aggregated = this.aggregateRecords(records, aggregationFields);
        result.push(aggregated);
      }
      // Groups smaller than k are suppressed (not included in result)
    });

    return result;
  }

  /**
   * Remove or mask personally identifiable information
   */
  sanitizePersonalData(data: any): any {
    if (typeof data !== 'object' || data === null) {
      return this.sanitizeValue(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizePersonalData(item));
    }

    const sanitized: any = {};
    Object.entries(data).forEach(([key, value]) => {
      if (this.isPIIField(key)) {
        sanitized[key] = this.maskPII(value, key);
      } else {
        sanitized[key] = this.sanitizePersonalData(value);
      }
    });

    return sanitized;
  }

  /**
   * Detect potential PHI/PII in text content
   */
  detectPHI(text: string): Array<{ type: string; match: string; position: number }> {
    const patterns = [
      { type: 'ssn', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
      { type: 'email', pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
      { type: 'phone', pattern: /\b\d{3}-\d{3}-\d{4}\b/g },
      { type: 'creditCard', pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g },
      { type: 'name', pattern: /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g }, // Simple name pattern
      { type: 'address', pattern: /\b\d{1,5}\s\w+\s(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd)\b/gi }
    ];

    const detected: Array<{ type: string; match: string; position: number }> = [];

    patterns.forEach(({ type, pattern }) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        detected.push({
          type,
          match: match[0],
          position: match.index
        });
      }
    });

    return detected;
  }

  /**
   * Validate privacy compliance of a dataset
   */
  validatePrivacyCompliance(dataset: any[], context: string): PrivacyValidationResult {
    const violations: PrivacyValidationResult['violations'] = [];
    const recommendations: string[] = [];

    // Check k-anonymity
    if (!this.validateKAnonymity(dataset, ['userId', 'cohortId'])) {
      violations.push({
        type: 'k_anonymity',
        severity: 'high',
        description: `Dataset does not meet k-anonymity threshold (k=${this.config.minimumCohortSize})`,
        affectedRecords: dataset.length
      });
      recommendations.push('Increase aggregation level or suppress small cohorts');
    }

    // Check for personal data
    let piiFound = 0;
    dataset.forEach(record => {
      Object.entries(record).forEach(([key, value]) => {
        if (this.isPIIField(key) || this.containsPII(String(value))) {
          piiFound++;
        }
      });
    });

    if (piiFound > 0) {
      violations.push({
        type: 'personal_data',
        severity: 'critical',
        description: 'Personal data detected in analytics dataset',
        affectedRecords: piiFound
      });
      recommendations.push('Apply data sanitization before aggregation');
    }

    // Check data retention
    const oldRecords = dataset.filter(record => {
      const recordDate = new Date(record.date || record.timestamp || record.created);
      const retentionLimit = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
      return recordDate < retentionLimit;
    });

    if (oldRecords.length > 0) {
      violations.push({
        type: 'retention',
        severity: 'medium',
        description: 'Records exceed data retention policy',
        affectedRecords: oldRecords.length
      });
      recommendations.push('Implement automated data cleanup');
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      recommendations,
      lastChecked: new Date()
    };
  }

  /**
   * Generate data minimization report
   */
  generateDataMinimizationReport(collections: Record<string, any[]>): DataMinimizationReport {
    const personalDataFound: DataMinimizationReport['personalDataFound'] = [];
    const retentionViolations: DataMinimizationReport['retentionViolations'] = [];
    let totalFields = 0;
    let minimizedFields = 0;

    Object.entries(collections).forEach(([collectionName, records]) => {
      if (records.length === 0) return;

      // Check each field in the collection
      const sampleRecord = records[0];
      Object.keys(sampleRecord).forEach(field => {
        totalFields++;
        
        if (this.isPIIField(field)) {
          personalDataFound.push({
            collection: collectionName,
            field,
            recordCount: records.length,
            recommendation: this.getMinimizationRecommendation(field)
          });
        } else {
          minimizedFields++;
        }
      });

      // Check retention violations
      const oldRecords = records.filter(record => {
        const recordDate = new Date(record.date || record.timestamp || record.created);
        const retentionLimit = new Date(Date.now() - this.config.retentionDays * 24 * 60 * 60 * 1000);
        return recordDate < retentionLimit;
      });

      if (oldRecords.length > 0) {
        retentionViolations.push({
          collection: collectionName,
          oldestRecord: new Date(Math.min(...oldRecords.map(r => new Date(r.date || r.timestamp || r.created).getTime()))),
          recordCount: oldRecords.length
        });
      }
    });

    const minimizationScore = totalFields > 0 ? Math.round((minimizedFields / totalFields) * 100) : 100;

    return {
      collectionsAudited: Object.keys(collections).length,
      personalDataFound,
      retentionViolations,
      minimizationScore,
      lastAudit: new Date()
    };
  }

  /**
   * Create privacy-safe aggregated metrics
   */
  createAggregatedMetrics(
    rawData: any[],
    groupBy: string[],
    metrics: Record<string, 'sum' | 'avg' | 'count' | 'max' | 'min'>
  ): any[] {
    // First, sanitize the data
    const sanitizedData = rawData.map(record => this.sanitizePersonalData(record));

    // Apply k-anonymity
    const kAnonymousData = this.enforceKAnonymity(
      sanitizedData,
      groupBy,
      Object.keys(metrics)
    );

    // Apply differential privacy to numerical results
    return kAnonymousData.map(record => {
      const result = { ...record };
      Object.entries(metrics).forEach(([field, operation]) => {
        if (typeof result[field] === 'number' && operation !== 'count') {
          result[field] = this.applyDifferentialPrivacy(result[field]);
        }
      });
      
      // Add cohort size for transparency
      result.cohortSize = this.config.minimumCohortSize;
      
      return result;
    });
  }

  // ===== PRIVATE HELPER METHODS =====

  private generateSalt(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private generateCohortId(hash: string): string {
    // Create cohort based on first few characters of hash
    return 'cohort_' + hash.substring(0, 8);
  }

  private aggregateRecords<T extends Record<string, any>>(
    records: T[],
    fields: string[]
  ): T {
    const result = { ...records[0] } as T;

    fields.forEach(field => {
      const values = records.map(r => r[field]).filter(v => typeof v === 'number');
      if (values.length > 0) {
        result[field] = values.reduce((sum, val) => sum + val, 0) / values.length;
      }
    });

    // Add aggregation metadata
    result.recordCount = records.length;
    result.aggregated = true;

    return result;
  }

  private isPIIField(fieldName: string): boolean {
    const piiFields = [
      'email', 'phone', 'address', 'ssn', 'name', 'firstName', 'lastName',
      'fullName', 'phoneNumber', 'socialSecurityNumber', 'dateOfBirth',
      'birthDate', 'creditCard', 'userId', 'ip', 'ipAddress', 'location',
      'zipCode', 'postalCode', 'deviceId', 'sessionId'
    ];
    
    return piiFields.some(pii => 
      fieldName.toLowerCase().includes(pii.toLowerCase())
    );
  }

  private maskPII(value: any, fieldType: string): any {
    if (typeof value !== 'string') return '[REDACTED]';

    if (fieldType.includes('email')) {
      return value.replace(/(.{2}).+(@.+)/, '$1***$2');
    }
    
    if (fieldType.includes('phone')) {
      return value.replace(/(\d{3})-(\d{3})-(\d{4})/, '$1-***-$3');
    }
    
    if (fieldType.includes('name')) {
      return value.split(' ').map(part => part.charAt(0) + '*'.repeat(part.length - 1)).join(' ');
    }

    // Default masking
    return '[REDACTED]';
  }

  private sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      // Remove potential PII patterns
      return value
        .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN_REDACTED]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[PHONE_REDACTED]');
    }
    return value;
  }

  private containsPII(text: string): boolean {
    return this.detectPHI(text).length > 0;
  }

  private getMinimizationRecommendation(field: string): string {
    const recommendations: Record<string, string> = {
      email: 'Hash email addresses or use domain-only analysis',
      phone: 'Remove or hash phone numbers',
      name: 'Remove names or use initials only',
      address: 'Use ZIP code or city-level aggregation only',
      userId: 'Use cryptographic hashing with salt rotation',
      sessionId: 'Use anonymous session tracking',
      ip: 'Remove IP addresses or use country-level geolocation',
      deviceId: 'Hash device identifiers'
    };

    for (const [key, recommendation] of Object.entries(recommendations)) {
      if (field.toLowerCase().includes(key)) {
        return recommendation;
      }
    }

    return 'Review field for potential PII and apply appropriate anonymization';
  }
}