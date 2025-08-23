// ALCHM Secure Firestore Client with Privacy Compliance
// Integrates encryption, PII redaction, and audit logging

import { firestoreClient } from './firestoreClient';
import { encryptionService, EncryptionResult } from './encryption';
import { piiRedactionService, PIIDetectionResult } from './pii-redaction';
import { JournalEntry } from '../types/journal';

export interface SecureJournalEntry extends Omit<JournalEntry, 'content'> {
  encryptedContent: EncryptionResult;
  piiRedactionLog: PIIDetectionResult;
  complianceMetadata: ComplianceMetadata;
}

export interface ComplianceMetadata {
  ferpaClassification: 'educational_record' | 'directory_info' | 'non_educational';
  coppaCompliant: boolean;
  gdprLawfulBasis: string;
  retentionPolicy: 'session_only' | 'educational_period' | 'user_controlled';
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  timestamp: Date;
  action: 'create' | 'read' | 'update' | 'delete' | 'encrypt' | 'decrypt' | 'redact';
  userId: string;
  sessionId?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceNotes: string;
}

export class SecureFirestoreClient {
  private userEncryptionKeys = new Map<string, string>();

  // Initialize user encryption key (derived from secure authentication)
  async initializeUserEncryption(userId: string, userAuthToken: string): Promise<void> {
    try {
      // Generate user-specific encryption key from auth token + device fingerprint
      const deviceFingerprint = await encryptionService.generateDeviceFingerprint();
      const combinedKey = userAuthToken + deviceFingerprint + userId;
      
      // Hash to create consistent encryption key
      const encoder = new TextEncoder();
      const keyData = encoder.encode(combinedKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
      const encryptionKey = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      this.userEncryptionKeys.set(userId, encryptionKey);
      console.log(`[Secure Firestore] Initialized encryption for user ${userId.substring(0, 8)}***`);
    } catch (error) {
      console.error('[Secure Firestore] Failed to initialize user encryption:', error);
      throw new Error('Failed to initialize secure storage');
    }
  }

  // Create secure journal entry with full compliance pipeline
  async createSecureEntry(
    userId: string,
    entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
    sessionId?: string
  ): Promise<string> {
    const userKey = this.userEncryptionKeys.get(userId);
    if (!userKey) {
      throw new Error('User encryption not initialized - security violation');
    }

    try {
      // Step 1: PII Detection and Redaction
      const piiResult = await piiRedactionService.detectAndRedactPII(entry.content, {
        confidenceThreshold: 0.7
      });

      // Step 2: Log PII detection for compliance
      const auditEvents: AuditEvent[] = [];
      if (piiResult.detectedPII.length > 0) {
        auditEvents.push({
          timestamp: new Date(),
          action: 'redact',
          userId,
          sessionId,
          riskLevel: piiResult.riskLevel,
          complianceNotes: `Redacted ${piiResult.detectedPII.length} PII items: ${piiResult.detectedPII.map(p => p.type).join(', ')}`
        });
      }

      // Step 3: Encrypt the redacted content
      const additionalData = `${userId}|${new Date().toISOString()}`;
      const encryptionResult = await encryptionService.encryptJournalContent(
        piiResult.redactedText,
        userKey,
        additionalData
      );

      auditEvents.push({
        timestamp: new Date(),
        action: 'encrypt',
        userId,
        sessionId,
        riskLevel: 'low',
        complianceNotes: 'Content encrypted with AES-256-GCM before storage'
      });

      // Step 4: Create compliance metadata
      const complianceMetadata: ComplianceMetadata = {
        ferpaClassification: this.classifyForFERPA(entry, piiResult),
        coppaCompliant: this.validateCOPPACompliance(userId, piiResult),
        gdprLawfulBasis: this.determineGDPRBasis(entry, piiResult),
        retentionPolicy: this.determineRetentionPolicy(entry, piiResult),
        auditTrail: auditEvents
      };

      // Step 5: Create secure journal entry
      const secureEntry: Omit<SecureJournalEntry, 'id' | 'createdAt' | 'updatedAt' | 'version'> = {
        ...entry,
        content: '', // Remove plaintext content
        encryptedContent: encryptionResult,
        piiRedactionLog: piiResult,
        complianceMetadata
      };

      // Step 6: Store in Firestore (encrypted content only)
      const entryId = await firestoreClient.createEntry({
        ...entry,
        content: JSON.stringify(encryptionResult), // Store encrypted data
        metadata: JSON.stringify({
          piiRedactionLog: {
            riskLevel: piiResult.riskLevel,
            piiCount: piiResult.detectedPII.length,
            detectedTypes: piiResult.detectedPII.map(p => p.type)
          },
          complianceMetadata
        })
      });

      // Step 7: Audit log the creation
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'create',
        userId,
        sessionId,
        riskLevel: piiResult.riskLevel,
        complianceNotes: `Secure entry created with ${piiResult.detectedPII.length} PII redactions`
      });

      console.log(`[Secure Firestore] Created secure entry ${entryId} for user ${userId.substring(0, 8)}***`);
      return entryId;

    } catch (error) {
      console.error('[Secure Firestore] Failed to create secure entry:', error);
      
      // Audit log the failure
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'create',
        userId,
        sessionId,
        riskLevel: 'high',
        complianceNotes: `Failed to create secure entry: ${error.message}`
      });

      throw new Error('Failed to create secure journal entry');
    }
  }

  // Retrieve and decrypt journal entry
  async getSecureEntry(userId: string, entryId: string, sessionId?: string): Promise<JournalEntry | null> {
    const userKey = this.userEncryptionKeys.get(userId);
    if (!userKey) {
      throw new Error('User encryption not initialized - security violation');
    }

    try {
      // Step 1: Retrieve encrypted entry from Firestore
      const encryptedEntry = await firestoreClient.getEntry(userId, entryId);
      if (!encryptedEntry) {
        return null;
      }

      // Step 2: Parse encrypted content and metadata
      const encryptionResult: EncryptionResult = JSON.parse(encryptedEntry.content);
      const metadata = encryptedEntry.metadata ? JSON.parse(encryptedEntry.metadata) : {};

      // Step 3: Decrypt content
      const additionalData = `${userId}|${encryptedEntry.createdAt.toISOString()}`;
      const decryptionResult = await encryptionService.decryptJournalContent(
        encryptionResult,
        userKey,
        additionalData
      );

      if (!decryptionResult.isValid) {
        throw new Error('Failed to decrypt journal content - integrity violation');
      }

      // Step 4: Audit log the access
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'read',
        userId,
        sessionId,
        riskLevel: metadata.piiRedactionLog?.riskLevel || 'low',
        complianceNotes: `Decrypted and accessed journal entry ${entryId}`
      });

      // Step 5: Return decrypted journal entry
      const decryptedEntry: JournalEntry = {
        ...encryptedEntry,
        content: decryptionResult.decryptedData
      };

      console.log(`[Secure Firestore] Retrieved secure entry ${entryId} for user ${userId.substring(0, 8)}***`);
      return decryptedEntry;

    } catch (error) {
      console.error('[Secure Firestore] Failed to retrieve secure entry:', error);
      
      // Audit log the failure
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'read',
        userId,
        sessionId,
        riskLevel: 'high',
        complianceNotes: `Failed to retrieve secure entry ${entryId}: ${error.message}`
      });

      throw new Error('Failed to retrieve secure journal entry');
    }
  }

  // Delete entry with compliance logging
  async deleteSecureEntry(userId: string, entryId: string, sessionId?: string): Promise<void> {
    try {
      // Step 1: Verify entry exists and ownership
      const entry = await firestoreClient.getEntry(userId, entryId);
      if (!entry) {
        throw new Error('Entry not found or access denied');
      }

      // Step 2: Delete from Firestore
      await firestoreClient.deleteEntry(userId, entryId);

      // Step 3: Clear encryption key cache for this entry
      // (In production, implement per-entry key management)

      // Step 4: Audit log the deletion
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'delete',
        userId,
        sessionId,
        riskLevel: 'medium',
        complianceNotes: `Permanently deleted journal entry ${entryId} and all associated data`
      });

      console.log(`[Secure Firestore] Deleted secure entry ${entryId} for user ${userId.substring(0, 8)}***`);

    } catch (error) {
      console.error('[Secure Firestore] Failed to delete secure entry:', error);
      
      // Audit log the failure
      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'delete',
        userId,
        sessionId,
        riskLevel: 'high',
        complianceNotes: `Failed to delete secure entry ${entryId}: ${error.message}`
      });

      throw new Error('Failed to delete secure journal entry');
    }
  }

  // Compliance classification helpers
  private classifyForFERPA(entry: any, piiResult: PIIDetectionResult): 'educational_record' | 'directory_info' | 'non_educational' {
    // If used in educational context with student content, classify as educational record
    if (entry.isPrivate && piiResult.riskLevel !== 'low') {
      return 'educational_record';
    }
    
    // Basic journal entries in educational context
    if (entry.tags?.includes('school') || entry.tags?.includes('education')) {
      return 'educational_record';
    }

    return 'non_educational';
  }

  private validateCOPPACompliance(userId: string, piiResult: PIIDetectionResult): boolean {
    // In production, check if user is under 13 and has parental consent
    // For now, ensure minimal data collection for all users
    return piiResult.detectedPII.length === 0;
  }

  private determineGDPRBasis(entry: any, piiResult: PIIDetectionResult): string {
    if (entry.isPrivate && piiResult.riskLevel === 'low') {
      return 'legitimate_interest_educational';
    }
    return 'consent';
  }

  private determineRetentionPolicy(entry: any, piiResult: PIIDetectionResult): 'session_only' | 'educational_period' | 'user_controlled' {
    if (piiResult.riskLevel === 'critical') {
      return 'session_only';
    }
    if (entry.tags?.includes('school')) {
      return 'educational_period';
    }
    return 'user_controlled';
  }

  // Audit logging for compliance
  private async auditLogEntry(event: AuditEvent): Promise<void> {
    try {
      // In production, store in secure audit database
      const auditEntry = {
        timestamp: event.timestamp.toISOString(),
        action: event.action,
        userId: event.userId.substring(0, 8) + '***', // Partial ID for privacy
        sessionId: event.sessionId?.substring(0, 8) + '***',
        riskLevel: event.riskLevel,
        complianceNotes: event.complianceNotes
      };

      console.log('[Secure Firestore Audit]', auditEntry);
      // TODO: Store in dedicated audit collection with proper access controls
      
    } catch (error) {
      console.error('[Secure Firestore] Failed to log audit event:', error);
      // Audit logging failures should not break main functionality
    }
  }

  // Data export for GDPR/user rights
  async exportUserData(userId: string): Promise<any> {
    try {
      const userKey = this.userEncryptionKeys.get(userId);
      if (!userKey) {
        throw new Error('User encryption not initialized');
      }

      // Get all user entries
      const entries = await firestoreClient.getEntries(userId);
      const decryptedEntries = [];

      for (const entry of entries) {
        try {
          const decrypted = await this.getSecureEntry(userId, entry.id);
          if (decrypted) {
            decryptedEntries.push({
              id: decrypted.id,
              content: decrypted.content,
              createdAt: decrypted.createdAt,
              emotion: decrypted.emotion,
              mood: decrypted.mood,
              tags: decrypted.tags
            });
          }
        } catch (error) {
          console.warn(`[Export] Failed to decrypt entry ${entry.id}:`, error);
        }
      }

      await this.auditLogEntry({
        timestamp: new Date(),
        action: 'read',
        userId,
        riskLevel: 'medium',
        complianceNotes: `Data export completed for ${decryptedEntries.length} entries`
      });

      return {
        exportDate: new Date().toISOString(),
        totalEntries: decryptedEntries.length,
        entries: decryptedEntries
      };

    } catch (error) {
      console.error('[Secure Firestore] Failed to export user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  // Clear user encryption key on logout
  clearUserEncryption(userId: string): void {
    this.userEncryptionKeys.delete(userId);
    console.log(`[Secure Firestore] Cleared encryption key for user ${userId.substring(0, 8)}***`);
  }

  // Get compliance statistics
  async getComplianceStats(userId: string): Promise<any> {
    try {
      const entries = await firestoreClient.getEntries(userId);
      
      let totalPIIDetected = 0;
      let riskLevelCounts = { low: 0, medium: 0, high: 0, critical: 0 };
      
      for (const entry of entries) {
        if (entry.metadata) {
          const metadata = JSON.parse(entry.metadata);
          const piiLog = metadata.piiRedactionLog;
          
          if (piiLog) {
            totalPIIDetected += piiLog.piiCount || 0;
            riskLevelCounts[piiLog.riskLevel as keyof typeof riskLevelCounts]++;
          }
        }
      }

      return {
        totalEntries: entries.length,
        totalPIIDetected,
        riskLevelDistribution: riskLevelCounts,
        encryptionStatus: 'AES-256-GCM',
        complianceFrameworks: ['FERPA', 'COPPA', 'GDPR']
      };

    } catch (error) {
      console.error('[Secure Firestore] Failed to get compliance stats:', error);
      throw new Error('Failed to retrieve compliance statistics');
    }
  }
}

// Export singleton instance
export const secureFirestoreClient = new SecureFirestoreClient();