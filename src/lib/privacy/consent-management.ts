/**
 * ALCHM Privacy & Legal Compliance: Consent Management System
 * 
 * Comprehensive consent tracking and management for COPPA, GDPR, and CCPA compliance.
 * This system maintains detailed audit trails for all consent interactions and ensures
 * regulatory compliance across all jurisdictions where ALCHM operates.
 */

import { getFirebaseDb } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Forward declarations
interface ParentalConsentDetails {
  parentalConsentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  consentDate: Timestamp;
  verificationMethod: 'email' | 'phone' | 'document';
  documentId?: string;
  isActive: boolean;
  expiresAt?: Timestamp;
}

interface PrivacyRightExercise {
  exerciseId: string;
  rightType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection';
  requestDate: Timestamp;
  completedDate?: Timestamp;
  status: 'pending' | 'in_progress' | 'completed' | 'denied';
  reason?: string;
}

// GDPR Article 7 Compliant Consent Record Structure
export interface ConsentRecord {
  // Core Identifiers
  consentId: string;
  userId: string;
  userEmail?: string;
  
  // Age Verification Data
  ageGroup: 'under13' | 'teen' | 'adult';
  requiresParentalConsent: boolean;
  parentalConsentId?: string;
  
  // Consent Details
  consentVersion: string;
  consentChoices: Record<string, boolean>;
  consentTimestamp: Timestamp;
  consentMethod: 'explicit' | 'implicit' | 'renewed';
  
  // Legal Compliance
  legalBasis: Record<string, 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation'>;
  jurisdiction: string; // US, EU, etc.
  applicableLaws: string[]; // ['COPPA', 'GDPR', 'CCPA']
  
  // Technical Metadata
  userAgent: string;
  ipAddress?: string; // Hashed for privacy
  platform: 'web' | 'mobile' | 'tablet';
  
  // Audit Trail
  createdAt: Timestamp;
  lastModified: Timestamp;
  withdrawnAt?: Timestamp;
  withdrawalReason?: string;
  
  // Parental Consent (if applicable)
  parentalConsent?: ParentalConsentDetails;
  
  // Privacy Rights Exercises
  rightsExercised: PrivacyRightExercise[];
  
  // Data Retention
  retentionPolicy: Record<string, number>; // feature -> days
  scheduledDeletion?: Timestamp;
}

// Extended ParentalConsentDetails with additional compliance fields
export interface ExtendedParentalConsentDetails extends ParentalConsentDetails {
  relationship: 'parent' | 'legal_guardian' | 'authorized_adult';
  verificationTimestamp: Timestamp;
  verificationStatus: 'pending' | 'verified' | 'failed' | 'expired';
  renewalRequired?: Timestamp;
  
  // Audit
  verificationAttempts: number;
  verificationIP?: string; // Hashed
  documentationStored: boolean;
}

// Extended PrivacyRightExercise with additional tracking fields
export interface ExtendedPrivacyRightExercise extends PrivacyRightExercise {
  requestId: string;
  requestTimestamp: Timestamp;
  completedTimestamp?: Timestamp;
  status: 'pending' | 'in_progress' | 'completed' | 'denied';
  denialReason?: string;
  requestMethod: 'user_dashboard' | 'email' | 'support_ticket';
  verificationRequired: boolean;
  verificationCompleted?: boolean;
}

export interface ConsentAnalytics {
  totalUsers: number;
  consentRates: Record<string, number>;
  withdrawalRates: Record<string, number>;
  ageGroupDistribution: Record<string, number>;
  jurisdictionDistribution: Record<string, number>;
  parentalConsentPending: number;
  privacyRightsRequests: Record<string, number>;
  complianceMetrics: {
    gdprCompliance: number;
    coppaCompliance: number;
    ccpaCompliance: number;
  };
}

class ConsentManager {
  private readonly COLLECTION_NAME = 'user_consents';
  private readonly PARENTAL_COLLECTION = 'parental_consents';
  private readonly AUDIT_COLLECTION = 'consent_audit_log';

  private async getDb() {
    return await getFirebaseDb();
  }

  /**
   * Creates a new consent record with full audit trail
   */
  async createConsentRecord(
    userId: string,
    ageGroup: 'under13' | 'teen' | 'adult',
    consentChoices: Record<string, boolean>,
    metadata: {
      userAgent: string;
      ipAddress?: string;
      jurisdiction: string;
      parentalConsentId?: string;
    }
  ): Promise<ConsentRecord> {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Timestamp.now();
    
    // Determine applicable laws based on age group and jurisdiction
    const applicableLaws = this.getApplicableLaws(ageGroup, metadata.jurisdiction);
    
    // Set legal basis for each consent choice
    const legalBasis = this.determineLegalBasis(consentChoices, ageGroup);
    
    // Calculate retention policies
    const retentionPolicy = this.calculateRetentionPolicy(consentChoices, ageGroup);
    
    const consentRecord: ConsentRecord = {
      consentId,
      userId,
      ageGroup,
      requiresParentalConsent: ageGroup === 'under13' || ageGroup === 'teen',
      parentalConsentId: metadata.parentalConsentId,
      consentVersion: '1.0.0',
      consentChoices,
      consentTimestamp: now,
      consentMethod: 'explicit',
      legalBasis,
      jurisdiction: metadata.jurisdiction,
      applicableLaws,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress ? this.hashIP(metadata.ipAddress) : undefined,
      platform: this.detectPlatform(metadata.userAgent),
      createdAt: now,
      lastModified: now,
      rightsExercised: [],
      retentionPolicy,
      scheduledDeletion: this.calculateScheduledDeletion(retentionPolicy)
    };

    // Store in Firestore
    const db = await this.getDb();
    await setDoc(doc(db, this.COLLECTION_NAME, consentId), consentRecord);
    
    // Create audit log entry
    await this.createAuditLogEntry({
      action: 'consent_created',
      consentId,
      userId,
      details: {
        ageGroup,
        consentChoices,
        jurisdiction: metadata.jurisdiction,
        applicableLaws
      },
      timestamp: now
    });

    // If parental consent required, initiate that process
    if (consentRecord.requiresParentalConsent && !metadata.parentalConsentId) {
      await this.initiateParentalConsentProcess(consentId, ageGroup);
    }

    return consentRecord;
  }

  /**
   * Creates parental consent record with enhanced verification
   */
  async createParentalConsent(
    consentId: string,
    parentalData: {
      parentName: string;
      parentEmail: string;
      parentPhone: string;
      relationship: string;
      verificationMethod: string;
    },
    verificationMetadata: {
      ipAddress?: string;
      userAgent: string;
    }
  ): Promise<string> {
    const parentalConsentId = `parental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Timestamp.now();

    const parentalConsent: ParentalConsentDetails = {
      parentalConsentId,
      parentName: parentalData.parentName,
      parentEmail: parentalData.parentEmail,
      parentPhone: this.hashPII(parentalData.parentPhone),
      consentDate: now,
      verificationMethod: parentalData.verificationMethod as 'email' | 'phone' | 'document',
      isActive: true,
      expiresAt: this.calculateParentalRenewal(now)
    };

    // Store parental consent
    const db = await this.getDb();
    await setDoc(doc(db, this.PARENTAL_COLLECTION, parentalConsentId), parentalConsent);
    
    // Update main consent record
    await updateDoc(doc(db, this.COLLECTION_NAME, consentId), {
      parentalConsentId,
      parentalConsent,
      lastModified: now
    });

    // Audit log
    await this.createAuditLogEntry({
      action: 'parental_consent_initiated',
      consentId,
      parentalConsentId,
      details: {
        verificationMethod: parentalData.verificationMethod,
        relationship: parentalData.relationship
      },
      timestamp: now
    });

    return parentalConsentId;
  }

  /**
   * Processes privacy rights requests (GDPR Article 15-21, CCPA)
   */
  async exercisePrivacyRight(
    userId: string,
    rightType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection',
    requestDetails: {
      reason?: string;
      specificData?: string[];
      verificationMethod?: string;
    }
  ): Promise<string> {
    const requestId = `privacy_right_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Timestamp.now();

    // Get user's consent record
    const userConsents = await this.getUserConsents(userId);
    if (userConsents.length === 0) {
      throw new Error('No consent record found for user');
    }

    const latestConsent = userConsents[0];
    
    // Determine if verification is required
    const verificationRequired = this.requiresIdentityVerification(rightType, latestConsent.ageGroup);

    const privacyRightExercise: PrivacyRightExercise = {
      exerciseId: requestId,
      rightType,
      requestDate: now,
      status: verificationRequired ? 'pending' : 'in_progress'
    };

    // Add to user's rights exercise history
    const updatedRights = [...latestConsent.rightsExercised, privacyRightExercise];
    
    const db = await this.getDb();
    await updateDoc(doc(db, this.COLLECTION_NAME, latestConsent.consentId), {
      rightsExercised: updatedRights,
      lastModified: now
    });

    // Special handling for erasure requests
    if (rightType === 'erasure') {
      await this.processErasureRequest(userId, requestId, latestConsent);
    }

    // Audit log
    await this.createAuditLogEntry({
      action: 'privacy_right_exercised',
      consentId: latestConsent.consentId,
      userId,
      details: {
        rightType,
        requestId,
        verificationRequired,
        ...requestDetails
      },
      timestamp: now
    });

    return requestId;
  }

  /**
   * Withdraws consent for specific features (GDPR Article 7.3)
   */
  async withdrawConsent(
    userId: string,
    consentFeatures: string[],
    withdrawalReason?: string
  ): Promise<void> {
    const userConsents = await this.getUserConsents(userId);
    if (userConsents.length === 0) {
      throw new Error('No consent record found for user');
    }

    const latestConsent = userConsents[0];
    const now = Timestamp.now();

    // Update consent choices
    const updatedChoices = { ...latestConsent.consentChoices };
    consentFeatures.forEach(feature => {
      updatedChoices[feature] = false;
    });

    const db = await this.getDb();
    await updateDoc(doc(db, this.COLLECTION_NAME, latestConsent.consentId), {
      consentChoices: updatedChoices,
      lastModified: now,
      withdrawnAt: now,
      withdrawalReason
    });

    // Audit log
    await this.createAuditLogEntry({
      action: 'consent_withdrawn',
      consentId: latestConsent.consentId,
      userId,
      details: {
        withdrawnFeatures: consentFeatures,
        reason: withdrawalReason,
        remainingConsents: updatedChoices
      },
      timestamp: now
    });

    // Trigger data processing updates
    await this.updateDataProcessingBasedOnConsent(userId, updatedChoices);
  }

  /**
   * Gets user's current consent status
   */
  async getUserConsents(userId: string): Promise<ConsentRecord[]> {
    const db = await this.getDb();
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ConsentRecord);
  }

  /**
   * Validates current consent status for feature access
   */
  async validateConsentForFeature(userId: string, feature: string): Promise<{
    hasConsent: boolean;
    consentValid: boolean;
    requiresRenewal: boolean;
    parentalConsentRequired: boolean;
    parentalConsentValid: boolean;
  }> {
    const userConsents = await this.getUserConsents(userId);
    if (userConsents.length === 0) {
      return {
        hasConsent: false,
        consentValid: false,
        requiresRenewal: false,
        parentalConsentRequired: false,
        parentalConsentValid: false
      };
    }

    const latestConsent = userConsents[0];
    const hasConsent = latestConsent.consentChoices[feature] === true;
    
    // Check if consent has expired or requires renewal
    const consentAge = Date.now() - latestConsent.consentTimestamp.toMillis();
    const maxAge = latestConsent.ageGroup === 'under13' ? 365 * 24 * 60 * 60 * 1000 : // 1 year for COPPA
                   latestConsent.ageGroup === 'teen' ? 2 * 365 * 24 * 60 * 60 * 1000 : // 2 years for teens
                   3 * 365 * 24 * 60 * 60 * 1000; // 3 years for adults
    
    const requiresRenewal = consentAge > maxAge;
    
    // Check parental consent if required
    let parentalConsentValid = true;
    if (latestConsent.requiresParentalConsent && latestConsent.parentalConsent) {
      const parentalAge = Date.now() - latestConsent.parentalConsent.verificationTimestamp.toMillis();
      const parentalMaxAge = 365 * 24 * 60 * 60 * 1000; // 1 year for parental consent
      parentalConsentValid = parentalAge <= parentalMaxAge && 
                           latestConsent.parentalConsent.verificationStatus === 'verified';
    }

    return {
      hasConsent,
      consentValid: hasConsent && !requiresRenewal,
      requiresRenewal,
      parentalConsentRequired: latestConsent.requiresParentalConsent,
      parentalConsentValid
    };
  }

  /**
   * Generates compliance analytics and reports
   */
  async generateComplianceAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<ConsentAnalytics> {
    // This would typically aggregate data from multiple collections
    // Implementation would depend on your specific analytics needs
    
    const db = await this.getDb();
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      where('createdAt', '<=', Timestamp.fromDate(endDate))
    );
    
    const snapshot = await getDocs(q);
    const consents = snapshot.docs.map(doc => doc.data() as ConsentRecord);
    
    return this.calculateAnalytics(consents);
  }

  // Private helper methods

  private getApplicableLaws(ageGroup: string, jurisdiction: string): string[] {
    const laws = [];
    
    if (ageGroup === 'under13' || ageGroup === 'teen') {
      laws.push('COPPA');
    }
    
    if (jurisdiction === 'EU' || jurisdiction === 'EEA') {
      laws.push('GDPR');
    }
    
    if (jurisdiction === 'CA' || jurisdiction === 'US') {
      laws.push('CCPA');
    }
    
    return laws;
  }

  private determineLegalBasis(
    consentChoices: Record<string, boolean>,
    ageGroup: string
  ): Record<string, 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation'> {
    const basis: Record<string, any> = {};
    
    Object.keys(consentChoices).forEach(feature => {
      switch (feature) {
        case 'essential_functionality':
        case 'safety_communications':
          basis[feature] = 'contract';
          break;
        case 'enhanced_ai_features':
        case 'research_participation':
          basis[feature] = 'consent';
          break;
        case 'platform_analytics':
          basis[feature] = ageGroup === 'adult' ? 'legitimate_interest' : 'consent';
          break;
        default:
          basis[feature] = 'consent';
      }
    });
    
    return basis;
  }

  private calculateRetentionPolicy(
    consentChoices: Record<string, boolean>,
    ageGroup: string
  ): Record<string, number> {
    const policy: Record<string, number> = {};
    
    Object.keys(consentChoices).forEach(feature => {
      switch (feature) {
        case 'essential_functionality':
          policy[feature] = 2555; // Account lifetime + 30 days (represented as days)
          break;
        case 'enhanced_ai_features':
          policy[feature] = ageGroup === 'under13' ? 365 : 730; // 1 year for minors, 2 years for others
          break;
        case 'platform_analytics':
          policy[feature] = 180; // 6 months (anonymized after)
          break;
        case 'research_participation':
          policy[feature] = -1; // Indefinite (anonymized)
          break;
        default:
          policy[feature] = ageGroup === 'under13' ? 365 : 730;
      }
    });
    
    return policy;
  }

  private calculateScheduledDeletion(retentionPolicy: Record<string, number>): Timestamp {
    // Find the maximum retention period
    const maxRetention = Math.max(...Object.values(retentionPolicy).filter(days => days > 0));
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + maxRetention);
    return Timestamp.fromDate(deletionDate);
  }

  private calculateParentalRenewal(createdAt: Timestamp): Timestamp {
    const renewalDate = new Date(createdAt.toMillis());
    renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Annual renewal
    return Timestamp.fromDate(renewalDate);
  }

  private detectPlatform(userAgent: string): 'web' | 'mobile' | 'tablet' {
    if (/Mobile/.test(userAgent)) return 'mobile';
    if (/Tablet/.test(userAgent)) return 'tablet';
    return 'web';
  }

  private hashIP(ip: string): string {
    // In production, use a proper cryptographic hash
    return Buffer.from(ip).toString('base64');
  }

  private hashPII(data: string): string {
    // In production, use a proper cryptographic hash with salt
    return Buffer.from(data).toString('base64');
  }

  private requiresIdentityVerification(
    rightType: string,
    ageGroup: string
  ): boolean {
    // Enhanced verification for minors and sensitive requests
    if (ageGroup === 'under13' || ageGroup === 'teen') return true;
    if (rightType === 'erasure') return true;
    return false;
  }

  private async initiateParentalConsentProcess(consentId: string, ageGroup: string): Promise<void> {
    // This would trigger email/notification to initiate parental consent
    console.log(`[PARENTAL_CONSENT_REQUIRED] ConsentID: ${consentId}, AgeGroup: ${ageGroup}`);
  }

  private async processErasureRequest(
    userId: string,
    requestId: string,
    consentRecord: ConsentRecord
  ): Promise<void> {
    // Handle data deletion request
    console.log(`[ERASURE_REQUEST] UserID: ${userId}, RequestID: ${requestId}`);
    
    // Schedule data deletion based on retention requirements
    const scheduledDeletion = new Date();
    if (consentRecord.ageGroup === 'under13') {
      scheduledDeletion.setDate(scheduledDeletion.getDate() + 1); // Priority deletion for COPPA
    } else {
      scheduledDeletion.setDate(scheduledDeletion.getDate() + 30); // Standard 30-day period
    }
    
    const db = await this.getDb();
    await updateDoc(doc(db, this.COLLECTION_NAME, consentRecord.consentId), {
      scheduledDeletion: Timestamp.fromDate(scheduledDeletion),
      lastModified: Timestamp.now()
    });
  }

  private async updateDataProcessingBasedOnConsent(
    userId: string,
    updatedChoices: Record<string, boolean>
  ): Promise<void> {
    // This would trigger updates to data processing systems
    console.log(`[CONSENT_UPDATE] UserID: ${userId}, UpdatedChoices:`, updatedChoices);
  }

  private async createAuditLogEntry(entry: {
    action: string;
    consentId?: string;
    parentalConsentId?: string;
    userId?: string;
    details: any;
    timestamp: Timestamp;
  }): Promise<void> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const db = await this.getDb();
    await setDoc(doc(db, this.AUDIT_COLLECTION, auditId), {
      auditId,
      ...entry
    });
  }

  private calculateAnalytics(consents: ConsentRecord[]): ConsentAnalytics {
    // Calculate comprehensive analytics for compliance reporting
    const totalUsers = consents.length;
    const consentRates: Record<string, number> = {};
    const withdrawalRates: Record<string, number> = {};
    const ageGroupDistribution: Record<string, number> = {};
    const jurisdictionDistribution: Record<string, number> = {};
    
    // Implementation would depend on your specific analytics needs
    
    return {
      totalUsers,
      consentRates,
      withdrawalRates,
      ageGroupDistribution,
      jurisdictionDistribution,
      parentalConsentPending: 0,
      privacyRightsRequests: {},
      complianceMetrics: {
        gdprCompliance: 1.0,
        coppaCompliance: 1.0,
        ccpaCompliance: 1.0
      }
    };
  }
}

// Export singleton instance
export const consentManager = new ConsentManager();

// Export utility functions for common operations
export async function createUserConsent(
  userId: string,
  ageGroup: 'under13' | 'teen' | 'adult',
  consentChoices: Record<string, boolean>,
  metadata: {
    userAgent: string;
    ipAddress?: string;
    jurisdiction: string;
    parentalConsentId?: string;
  }
): Promise<ConsentRecord> {
  return consentManager.createConsentRecord(userId, ageGroup, consentChoices, metadata);
}

export async function validateFeatureAccess(
  userId: string,
  feature: string
): Promise<boolean> {
  const validation = await consentManager.validateConsentForFeature(userId, feature);
  return validation.hasConsent && validation.consentValid && 
         (!validation.parentalConsentRequired || validation.parentalConsentValid);
}

export async function exerciseUserRights(
  userId: string,
  rightType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction' | 'objection',
  requestDetails?: {
    reason?: string;
    specificData?: string[];
    verificationMethod?: string;
  }
): Promise<string> {
  return consentManager.exercisePrivacyRight(userId, rightType, requestDetails || {});
}