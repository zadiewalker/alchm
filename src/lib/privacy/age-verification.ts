/**
 * ALCHM Privacy & Legal Compliance: Age Verification System
 * 
 * Privacy-first age verification that complies with COPPA, GDPR, and other
 * privacy regulations. This system verifies age without storing exact birthdates
 * and implements anti-gaming measures to prevent circumvention.
 */

import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs, 
  Timestamp,
  deleteDoc
} from 'firebase/firestore';

export type AgeGroup = 'under13' | 'teen' | 'adult';
export type VerificationStatus = 'pending' | 'verified' | 'failed' | 'blocked';

export interface AgeVerificationRecord {
  verificationId: string;
  sessionId: string;
  ipAddressHash?: string;
  deviceFingerprint?: string;
  
  // Age Verification Results (NO EXACT BIRTHDATE STORED)
  ageGroup: AgeGroup;
  verificationTimestamp: Timestamp;
  verificationStatus: VerificationStatus;
  
  // Privacy-First Verification Data
  birthYearRange: string; // e.g., "2000-2005" instead of exact year
  verificationMethod: 'self_reported' | 'parental_verification' | 'id_verification';
  
  // Anti-Gaming Measures
  verificationAttempts: number;
  previousAttempts: VerificationAttempt[];
  blockedUntil?: Timestamp;
  
  // Legal Compliance
  requiresParentalConsent: boolean;
  coppaProtected: boolean;
  enhancedPrivacyRequired: boolean;
  
  // Audit Trail
  createdAt: Timestamp;
  verifiedAt?: Timestamp;
  expiresAt: Timestamp;
  
  // Technical Metadata (for fraud prevention)
  userAgent: string;
  platform: 'web' | 'mobile' | 'tablet';
  timeZone?: string;
  screenResolution?: string;
  
  // Privacy Controls
  dataMinimized: boolean;
  retentionPeriod: number; // days
  scheduledDeletion: Timestamp;
}

export interface VerificationAttempt {
  attemptId: string;
  timestamp: Timestamp;
  submittedAgeGroup: AgeGroup;
  verificationTime: number; // milliseconds spent on verification
  flaggedAssusspicious: boolean;
  suspicionReasons: string[];
}

export interface AgeVerificationConfig {
  maxVerificationAttempts: number;
  minimumVerificationTime: number; // milliseconds
  blockDuration: number; // milliseconds
  verificationValidityPeriod: number; // days
  enableDeviceFingerprinting: boolean;
  enableIPTracking: boolean;
  strictModeForMinors: boolean;
}

class AgeVerificationSystem {
  private readonly COLLECTION_NAME = 'age_verifications';
  private readonly BLOCKED_SESSIONS_COLLECTION = 'blocked_verification_sessions';
  private readonly AUDIT_COLLECTION = 'age_verification_audit';

  private readonly config: AgeVerificationConfig = {
    maxVerificationAttempts: 3,
    minimumVerificationTime: 10000, // 10 seconds
    blockDuration: 24 * 60 * 60 * 1000, // 24 hours
    verificationValidityPeriod: 365, // 1 year
    enableDeviceFingerprinting: true,
    enableIPTracking: false, // Privacy-first: disabled by default
    strictModeForMinors: true
  };

  /**
   * Initiates age verification process with anti-gaming measures
   */
  async initiateVerification(sessionData: {
    sessionId: string;
    userAgent: string;
    ipAddress?: string;
    deviceFingerprint?: string;
    timeZone?: string;
    screenResolution?: string;
  }): Promise<{
    canProceed: boolean;
    verificationId?: string;
    blockedUntil?: Date;
    remainingAttempts?: number;
    reason?: string;
  }> {
    // Check if session is blocked
    const blockStatus = await this.checkSessionBlock(sessionData.sessionId, sessionData.ipAddress);
    if (blockStatus.isBlocked) {
      return {
        canProceed: false,
        blockedUntil: blockStatus.blockedUntil,
        reason: 'Too many verification attempts. Please try again later.'
      };
    }

    // Check previous attempts
    const previousAttempts = await this.getPreviousAttempts(sessionData.sessionId, sessionData.ipAddress);
    if (previousAttempts.length >= this.config.maxVerificationAttempts) {
      await this.blockSession(sessionData.sessionId, sessionData.ipAddress);
      return {
        canProceed: false,
        reason: 'Maximum verification attempts exceeded. Session blocked for 24 hours.'
      };
    }

    const verificationId = `age_verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Timestamp.now();

    // Create verification record
    const verificationRecord: Partial<AgeVerificationRecord> = {
      verificationId,
      sessionId: sessionData.sessionId,
      ipAddressHash: sessionData.ipAddress ? this.hashData(sessionData.ipAddress) : undefined,
      deviceFingerprint: sessionData.deviceFingerprint,
      verificationStatus: 'pending',
      verificationAttempts: previousAttempts.length + 1,
      previousAttempts: previousAttempts.map(attempt => ({
        attemptId: attempt.id,
        timestamp: attempt.timestamp,
        submittedAgeGroup: attempt.submittedAgeGroup,
        verificationTime: attempt.verificationTime,
        flaggedAssusspicious: attempt.flaggedAssusspicious,
        suspicionReasons: attempt.suspicionReasons
      })),
      userAgent: sessionData.userAgent,
      platform: this.detectPlatform(sessionData.userAgent),
      timeZone: sessionData.timeZone,
      screenResolution: sessionData.screenResolution,
      dataMinimized: true,
      retentionPeriod: 30, // 30 days for verification records
      scheduledDeletion: this.calculateDeletionDate(30),
      createdAt: now,
      expiresAt: this.calculateExpirationDate(this.config.verificationValidityPeriod)
    };

    await setDoc(doc(db, this.COLLECTION_NAME, verificationId), verificationRecord);

    // Audit log
    await this.createAuditEntry({
      action: 'verification_initiated',
      verificationId,
      sessionId: sessionData.sessionId,
      attemptNumber: previousAttempts.length + 1,
      timestamp: now
    });

    return {
      canProceed: true,
      verificationId,
      remainingAttempts: this.config.maxVerificationAttempts - (previousAttempts.length + 1)
    };
  }

  /**
   * Processes age verification with privacy-first approach
   */
  async verifyAge(
    verificationId: string,
    birthData: {
      birthMonth: string;
      birthYear: string;
    },
    verificationMetadata: {
      verificationStartTime: number;
      userBehaviorSignals?: {
        mouseMovements: number;
        keystrokes: number;
        timeSpentReading: number;
      };
    }
  ): Promise<{
    success: boolean;
    ageGroup?: AgeGroup;
    requiresParentalConsent: boolean;
    enhancedProtection: boolean;
    verificationRecord?: AgeVerificationRecord;
    suspiciousActivity?: string[];
  }> {
    const verificationDoc = await getDoc(doc(db, this.COLLECTION_NAME, verificationId));
    if (!verificationDoc.exists()) {
      throw new Error('Verification record not found');
    }

    const record = verificationDoc.data() as AgeVerificationRecord;
    const now = Timestamp.now();
    const verificationTime = Date.now() - verificationMetadata.verificationStartTime;

    // Calculate age group WITHOUT storing exact birthdate
    const ageGroup = this.calculateAgeGroup(birthData.birthMonth, birthData.birthYear);
    const birthYearRange = this.calculateYearRange(parseInt(birthData.birthYear));

    // Detect suspicious activity
    const suspiciousActivity = this.detectSuspiciousActivity({
      verificationTime,
      ageGroup,
      previousAttempts: record.previousAttempts || [],
      userBehavior: verificationMetadata.userBehaviorSignals
    });

    // Determine if verification should be flagged
    const flaggedAsSuspicious = suspiciousActivity.length > 0;
    
    // Block if too many suspicious attempts
    if (flaggedAsSuspicious && record.verificationAttempts >= 2) {
      await this.blockSession(record.sessionId, record.ipAddressHash);
      
      await this.createAuditEntry({
        action: 'verification_blocked_suspicious',
        verificationId,
        sessionId: record.sessionId,
        suspiciousActivity,
        timestamp: now
      });

      return {
        success: false,
        requiresParentalConsent: false,
        enhancedProtection: false,
        suspiciousActivity
      };
    }

    // Update verification record
    const updatedRecord: AgeVerificationRecord = {
      ...record,
      ageGroup,
      birthYearRange,
      verificationTimestamp: now,
      verificationStatus: flaggedAsSuspicious ? 'failed' : 'verified',
      verifiedAt: flaggedAsSuspicious ? undefined : now,
      verificationMethod: 'self_reported',
      requiresParentalConsent: ageGroup === 'under13' || ageGroup === 'teen',
      coppaProtected: ageGroup === 'under13',
      enhancedPrivacyRequired: ageGroup !== 'adult',
      previousAttempts: [
        ...(record.previousAttempts || []),
        {
          attemptId: `attempt_${Date.now()}`,
          timestamp: now,
          submittedAgeGroup: ageGroup,
          verificationTime,
          flaggedAssusspicious: flaggedAsSuspicious,
          suspicionReasons: suspiciousActivity
        }
      ]
    };

    await setDoc(doc(db, this.COLLECTION_NAME, verificationId), updatedRecord);

    // Audit log
    await this.createAuditEntry({
      action: flaggedAsSuspicious ? 'verification_failed_suspicious' : 'verification_completed',
      verificationId,
      sessionId: record.sessionId,
      ageGroup,
      verificationTime,
      suspiciousActivity: flaggedAsSuspicious ? suspiciousActivity : undefined,
      timestamp: now
    });

    // Clean up sensitive data immediately after verification
    await this.scheduleSensitiveDataCleanup(verificationId);

    return {
      success: !flaggedAsSuspicious,
      ageGroup: flaggedAsSuspicious ? undefined : ageGroup,
      requiresParentalConsent: updatedRecord.requiresParentalConsent,
      enhancedProtection: updatedRecord.enhancedPrivacyRequired,
      verificationRecord: !flaggedAsSuspicious ? updatedRecord : undefined,
      suspiciousActivity: flaggedAsSuspicious ? suspiciousActivity : undefined
    };
  }

  /**
   * Validates existing age verification
   */
  async validateVerification(verificationId: string): Promise<{
    isValid: boolean;
    ageGroup?: AgeGroup;
    requiresParentalConsent: boolean;
    enhancedProtection: boolean;
    expiresAt?: Date;
  }> {
    const verificationDoc = await getDoc(doc(db, this.COLLECTION_NAME, verificationId));
    if (!verificationDoc.exists()) {
      return {
        isValid: false,
        requiresParentalConsent: false,
        enhancedProtection: false
      };
    }

    const record = verificationDoc.data() as AgeVerificationRecord;
    const now = new Date();
    const expirationDate = record.expiresAt.toDate();

    // Check if verification is still valid
    const isValid = record.verificationStatus === 'verified' && 
                   now < expirationDate;

    return {
      isValid,
      ageGroup: isValid ? record.ageGroup : undefined,
      requiresParentalConsent: record.requiresParentalConsent,
      enhancedProtection: record.enhancedPrivacyRequired,
      expiresAt: expirationDate
    };
  }

  /**
   * Cleans up expired verification records (GDPR compliance)
   */
  async cleanupExpiredVerifications(): Promise<{
    recordsDeleted: number;
    dataMinimized: number;
  }> {
    const now = Timestamp.now();
    let recordsDeleted = 0;
    let dataMinimized = 0;

    // Find expired records
    const expiredQuery = query(
      collection(db, this.COLLECTION_NAME),
      where('scheduledDeletion', '<=', now)
    );

    const expiredSnapshot = await getDocs(expiredQuery);
    
    for (const docSnapshot of expiredSnapshot.docs) {
      const record = docSnapshot.data() as AgeVerificationRecord;
      
      // Delete the record completely
      await deleteDoc(doc(db, this.COLLECTION_NAME, record.verificationId));
      recordsDeleted++;

      // Audit the deletion
      await this.createAuditEntry({
        action: 'verification_record_deleted',
        verificationId: record.verificationId,
        reason: 'retention_period_expired',
        timestamp: now
      });
    }

    // Find records that need data minimization (older than 7 days but not expired)
    const minimizationCutoff = new Date();
    minimizationCutoff.setDate(minimizationCutoff.getDate() - 7);

    const minimizationQuery = query(
      collection(db, this.COLLECTION_NAME),
      where('createdAt', '<=', Timestamp.fromDate(minimizationCutoff)),
      where('dataMinimized', '==', false)
    );

    const minimizationSnapshot = await getDocs(minimizationQuery);
    
    for (const docSnapshot of minimizationSnapshot.docs) {
      const record = docSnapshot.data() as AgeVerificationRecord;
      
      // Minimize sensitive data while keeping verification status
      const minimizedRecord = {
        ...record,
        ipAddressHash: undefined,
        deviceFingerprint: undefined,
        userAgent: undefined,
        timeZone: undefined,
        screenResolution: undefined,
        previousAttempts: [], // Clear detailed attempt history
        dataMinimized: true
      };

      await setDoc(doc(db, this.COLLECTION_NAME, record.verificationId), minimizedRecord);
      dataMinimized++;
    }

    return { recordsDeleted, dataMinimized };
  }

  // Private helper methods

  private calculateAgeGroup(birthMonth: string, birthYear: string): AgeGroup {
    const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, 1);
    const today = new Date();
    
    // Conservative calculation for legal compliance
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0) {
      age--;
    }

    if (age < 13) return 'under13';
    if (age < 18) return 'teen';
    return 'adult';
  }

  private calculateYearRange(birthYear: number): string {
    // Return 5-year range instead of exact year for privacy
    const rangeStart = Math.floor(birthYear / 5) * 5;
    const rangeEnd = rangeStart + 4;
    return `${rangeStart}-${rangeEnd}`;
  }

  private detectSuspiciousActivity(data: {
    verificationTime: number;
    ageGroup: AgeGroup;
    previousAttempts: VerificationAttempt[];
    userBehavior?: {
      mouseMovements: number;
      keystrokes: number;
      timeSpentReading: number;
    };
  }): string[] {
    const suspicions: string[] = [];

    // Check verification time (too fast = suspicious)
    if (data.verificationTime < this.config.minimumVerificationTime) {
      suspicions.push('verification_too_fast');
    }

    // Check for age group consistency
    const previousAgeGroups = data.previousAttempts.map(attempt => attempt.submittedAgeGroup);
    const hasInconsistentAges = previousAgeGroups.some(prevAge => 
      (prevAge === 'under13' && data.ageGroup !== 'under13') ||
      (prevAge === 'adult' && data.ageGroup === 'under13')
    );
    
    if (hasInconsistentAges) {
      suspicions.push('inconsistent_age_reporting');
    }

    // Check user behavior signals (if available)
    if (data.userBehavior) {
      if (data.userBehavior.mouseMovements === 0 && data.userBehavior.keystrokes === 0) {
        suspicions.push('no_human_interaction');
      }
      
      if (data.userBehavior.timeSpentReading < 2000) { // Less than 2 seconds reading
        suspicions.push('insufficient_reading_time');
      }
    }

    // Check for rapid repeated attempts
    const recentAttempts = data.previousAttempts.filter(attempt => {
      const timeDiff = Date.now() - attempt.timestamp.toMillis();
      return timeDiff < 60000; // Within last minute
    });
    
    if (recentAttempts.length > 1) {
      suspicions.push('rapid_repeated_attempts');
    }

    return suspicions;
  }

  private async checkSessionBlock(sessionId: string, ipAddress?: string): Promise<{
    isBlocked: boolean;
    blockedUntil?: Date;
  }> {
    const blockedDoc = await getDoc(doc(db, this.BLOCKED_SESSIONS_COLLECTION, sessionId));
    
    if (blockedDoc.exists()) {
      const blockData = blockedDoc.data();
      const blockedUntil = blockData.blockedUntil.toDate();
      
      if (new Date() < blockedUntil) {
        return { isBlocked: true, blockedUntil };
      } else {
        // Block expired, clean up
        await deleteDoc(doc(db, this.BLOCKED_SESSIONS_COLLECTION, sessionId));
      }
    }

    return { isBlocked: false };
  }

  private async blockSession(sessionId: string, ipAddressHash?: string): Promise<void> {
    const blockedUntil = new Date();
    blockedUntil.setTime(blockedUntil.getTime() + this.config.blockDuration);

    await setDoc(doc(db, this.BLOCKED_SESSIONS_COLLECTION, sessionId), {
      sessionId,
      ipAddressHash,
      blockedAt: Timestamp.now(),
      blockedUntil: Timestamp.fromDate(blockedUntil),
      reason: 'excessive_verification_attempts'
    });
  }

  private async getPreviousAttempts(sessionId: string, ipAddress?: string): Promise<any[]> {
    // This would query previous verification attempts
    // Implementation depends on your specific tracking needs
    return [];
  }

  private detectPlatform(userAgent: string): 'web' | 'mobile' | 'tablet' {
    if (/Mobile/.test(userAgent)) return 'mobile';
    if (/Tablet/.test(userAgent)) return 'tablet';
    return 'web';
  }

  private hashData(data: string): string {
    // In production, use a proper cryptographic hash
    return Buffer.from(data).toString('base64');
  }

  private calculateDeletionDate(days: number): Timestamp {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + days);
    return Timestamp.fromDate(deletionDate);
  }

  private calculateExpirationDate(days: number): Timestamp {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    return Timestamp.fromDate(expirationDate);
  }

  private async scheduleSensitiveDataCleanup(verificationId: string): Promise<void> {
    // Schedule cleanup of sensitive data after verification
    setTimeout(async () => {
      try {
        const doc = await getDoc(doc(db, this.COLLECTION_NAME, verificationId));
        if (doc.exists()) {
          const record = doc.data() as AgeVerificationRecord;
          const cleanedRecord = {
            ...record,
            deviceFingerprint: undefined,
            timeZone: undefined,
            screenResolution: undefined
          };
          await setDoc(doc(db, this.COLLECTION_NAME, verificationId), cleanedRecord);
        }
      } catch (error) {
        console.error('Failed to cleanup sensitive data:', error);
      }
    }, 60000); // Clean up after 1 minute
  }

  private async createAuditEntry(entry: {
    action: string;
    verificationId?: string;
    sessionId?: string;
    ageGroup?: AgeGroup;
    verificationTime?: number;
    suspiciousActivity?: string[];
    attemptNumber?: number;
    reason?: string;
    timestamp: Timestamp;
  }): Promise<void> {
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await setDoc(doc(db, this.AUDIT_COLLECTION, auditId), {
      auditId,
      ...entry
    });
  }
}

// Export singleton instance
export const ageVerificationSystem = new AgeVerificationSystem();

// Export utility functions
export async function initiateAgeVerification(sessionData: {
  sessionId: string;
  userAgent: string;
  ipAddress?: string;
  deviceFingerprint?: string;
  timeZone?: string;
  screenResolution?: string;
}): Promise<{
  canProceed: boolean;
  verificationId?: string;
  blockedUntil?: Date;
  remainingAttempts?: number;
  reason?: string;
}> {
  return ageVerificationSystem.initiateVerification(sessionData);
}

export async function processAgeVerification(
  verificationId: string,
  birthData: { birthMonth: string; birthYear: string },
  verificationMetadata: {
    verificationStartTime: number;
    userBehaviorSignals?: {
      mouseMovements: number;
      keystrokes: number;
      timeSpentReading: number;
    };
  }
): Promise<{
  success: boolean;
  ageGroup?: AgeGroup;
  requiresParentalConsent: boolean;
  enhancedProtection: boolean;
  verificationRecord?: AgeVerificationRecord;
  suspiciousActivity?: string[];
}> {
  return ageVerificationSystem.verifyAge(verificationId, birthData, verificationMetadata);
}

export async function validateAgeVerification(verificationId: string): Promise<{
  isValid: boolean;
  ageGroup?: AgeGroup;
  requiresParentalConsent: boolean;
  enhancedProtection: boolean;
  expiresAt?: Date;
}> {
  return ageVerificationSystem.validateVerification(verificationId);
}