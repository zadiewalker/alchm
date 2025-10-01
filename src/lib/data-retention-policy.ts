// ALCHM Data Retention and Deletion Policy Implementation
// Comprehensive FERPA/COPPA/GDPR compliant data lifecycle management

import { getFirestore, Timestamp, Query, DocumentReference } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { secureFirestoreClient } from '@/lib/secure-firestore-client';
import { createApiError, ApiErrorCode } from '@/lib/apiUtils';

// Data retention periods by type and compliance framework
export const DATA_RETENTION_PERIODS = {
  // Journal entries - FERPA allows indefinite retention with consent, COPPA requires parental control
  journalEntries: {
    activeUser: { days: -1 }, // Indefinite while account active
    inactiveUser: { days: 1095 }, // 3 years after account inactivity
    parentalRequest: { days: 0 }, // Immediate deletion on parental request (COPPA)
    userRequest: { days: 30 }, // 30-day grace period for user-initiated deletion
    accountClosure: { days: 90 } // 90 days after account closure
  },
  
  // AI processing data - Must be minimized for privacy
  aiProcessingData: {
    sessionData: { days: 1 }, // 24 hours for session isolation
    analysisCache: { days: 7 }, // 1 week for performance optimization
    insights: { days: 365 }, // 1 year for pattern analysis
    crisisData: { days: 2555 } // 7 years for safety/legal requirements
  },
  
  // Audit logs - Required for compliance monitoring
  auditLogs: {
    accessLogs: { days: 2555 }, // 7 years (FERPA requirement)
    securityLogs: { days: 2555 }, // 7 years (security standard)
    complianceEvents: { days: 2555 }, // 7 years (regulatory requirement)
    consentRecords: { days: 2555 } // 7 years (legal requirement)
  },
  
  // User account data
  accountData: {
    profile: { days: -1 }, // While account active
    preferences: { days: -1 }, // While account active
    parentalConsent: { days: 2555 }, // 7 years after account closure (COPPA)
    dataProcessingConsent: { days: 2555 } // 7 years (GDPR requirement)
  },
  
  // Anonymized analytics - Can be retained longer
  analyticsData: {
    aggregatedMetrics: { days: -1 }, // Indefinite (anonymized)
    usagePatterns: { days: 1095 }, // 3 years
    performanceMetrics: { days: 365 } // 1 year
  }
} as const;

// Deletion reasons for audit compliance
export enum DeletionReason {
  USER_REQUEST = 'user_request',
  PARENTAL_REQUEST = 'parental_request',
  ACCOUNT_CLOSURE = 'account_closure',
  RETENTION_EXPIRY = 'retention_expiry',
  COMPLIANCE_REQUIREMENT = 'compliance_requirement',
  SECURITY_INCIDENT = 'security_incident',
  LEGAL_REQUIREMENT = 'legal_requirement'
}

// Data lifecycle states
export enum DataLifecycleState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_DELETION = 'pending_deletion',
  DELETED = 'deleted',
  ARCHIVED = 'archived'
}

export interface DataRetentionRecord {
  id: string;
  userId: string;
  dataType: keyof typeof DATA_RETENTION_PERIODS;
  dataId: string;
  createdAt: Timestamp;
  lastAccessedAt: Timestamp;
  expirationDate: Timestamp;
  lifecycleState: DataLifecycleState;
  deletionReason?: DeletionReason;
  deletedAt?: Timestamp;
  parentalConsentRequired: boolean;
  complianceFrameworks: ('FERPA' | 'COPPA' | 'GDPR')[];
  encryptionStatus: 'encrypted' | 'unencrypted' | 'anonymized';
  auditTrail: DataLifecycleEvent[];
}

export interface DataLifecycleEvent {
  eventId: string;
  timestamp: Timestamp;
  eventType: 'created' | 'accessed' | 'modified' | 'scheduled_deletion' | 'deleted' | 'archived';
  reason: string;
  performedBy: 'system' | 'user' | 'parent' | 'admin';
  metadata: Record<string, any>;
}

export interface DeletionRequest {
  requestId: string;
  userId: string;
  requestedBy: 'user' | 'parent' | 'admin' | 'system';
  requestType: 'partial' | 'complete' | 'specific_data';
  dataTypes: string[];
  reason: DeletionReason;
  requestedAt: Timestamp;
  scheduledFor?: Timestamp;
  urgency: 'standard' | 'expedited' | 'immediate';
  verificationRequired: boolean;
  parentalConsent?: ParentalConsentRecord;
  legalBasis: string;
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
}

export interface ParentalConsentRecord {
  consentId: string;
  parentId: string;
  childUserId: string;
  consentType: 'data_collection' | 'data_processing' | 'data_deletion' | 'account_creation';
  granted: boolean;
  timestamp: Timestamp;
  ipAddress: string;
  verification: 'email' | 'phone' | 'typeof window !== 'undefined' && document' | 'in_person';
  expirationDate?: Timestamp;
}

export class DataRetentionManager {
  private firestore = getFirestore();
  private auth = getAuth();

  // Calculate expiration date based on data type and retention policy
  calculateExpirationDate(
    dataType: keyof typeof DATA_RETENTION_PERIODS,
    subType: string,
    createdAt: Date = new Date()
  ): Date | null {
    const retentionPeriod = DATA_RETENTION_PERIODS[dataType]?.[subType as keyof typeof DATA_RETENTION_PERIODS[typeof dataType]];
    
    if (!retentionPeriod) {
      throw new Error(`Invalid data type or subtype: ${dataType}.${subType}`);
    }

    // -1 means indefinite retention
    if (retentionPeriod.days === -1) {
      return null;
    }

    const expirationDate = new Date(createdAt);
    expirationDate.setDate(expirationDate.getDate() + retentionPeriod.days);
    return expirationDate;
  }

  // Create retention record for new data
  async createRetentionRecord(
    userId: string,
    dataType: keyof typeof DATA_RETENTION_PERIODS,
    dataId: string,
    metadata: {
      subType: string;
      parentalConsentRequired?: boolean;
      complianceFrameworks?: ('FERPA' | 'COPPA' | 'GDPR')[];
      encryptionStatus?: 'encrypted' | 'unencrypted' | 'anonymized';
    }
  ): Promise<DataRetentionRecord> {
    const now = Timestamp.now();
    const expirationDate = this.calculateExpirationDate(dataType, metadata.subType);
    
    const retentionRecord: DataRetentionRecord = {
      id: `retention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      dataType,
      dataId,
      createdAt: now,
      lastAccessedAt: now,
      expirationDate: expirationDate ? Timestamp.fromDate(expirationDate) : null as any,
      lifecycleState: DataLifecycleState.ACTIVE,
      parentalConsentRequired: metadata.parentalConsentRequired || false,
      complianceFrameworks: metadata.complianceFrameworks || ['FERPA', 'COPPA', 'GDPR'],
      encryptionStatus: metadata.encryptionStatus || 'encrypted',
      auditTrail: [{
        eventId: `event_${Date.now()}`,
        timestamp: now,
        eventType: 'created',
        reason: 'Data retention record created',
        performedBy: 'system',
        metadata: { dataType, subType: metadata.subType }
      }]
    };

    try {
      await secureFirestoreClient.createDocument('data_retention', retentionRecord.id, retentionRecord);
      return retentionRecord;
    } catch (error) {
      console.error('[DataRetention] Failed to create retention record:', error);
      throw createApiError(
        ApiErrorCode.DATABASE_ERROR,
        'Failed to create data retention record',
        error,
        'Unable to track data retention policy'
      );
    }
  }

  // Update last accessed timestamp
  async updateLastAccessed(retentionRecordId: string, userId: string): Promise<void> {
    try {
      const now = Timestamp.now();
      await secureFirestoreClient.updateDocument('data_retention', retentionRecordId, {
        lastAccessedAt: now,
        'auditTrail': [...(await this.getRetentionRecord(retentionRecordId))?.auditTrail || [], {
          eventId: `event_${Date.now()}`,
          timestamp: now,
          eventType: 'accessed',
          reason: 'Data accessed by user',
          performedBy: 'user',
          metadata: { userId }
        }]
      });
    } catch (error) {
      console.error('[DataRetention] Failed to update last accessed:', error);
      // Non-critical error, don't throw
    }
  }

  // Schedule data for deletion
  async scheduleDataDeletion(
    userId: string,
    deletionRequest: Partial<DeletionRequest>
  ): Promise<DeletionRequest> {
    const now = Timestamp.now();
    const scheduledFor = deletionRequest.urgency === 'immediate' 
      ? now 
      : Timestamp.fromDate(new Date(Date.now() + (deletionRequest.urgency === 'expedited' ? 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)));

    const request: DeletionRequest = {
      requestId: `del_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      requestedBy: deletionRequest.requestedBy || 'user',
      requestType: deletionRequest.requestType || 'complete',
      dataTypes: deletionRequest.dataTypes || Object.keys(DATA_RETENTION_PERIODS),
      reason: deletionRequest.reason || DeletionReason.USER_REQUEST,
      requestedAt: now,
      scheduledFor,
      urgency: deletionRequest.urgency || 'standard',
      verificationRequired: deletionRequest.verificationRequired ?? true,
      legalBasis: deletionRequest.legalBasis || 'User right to deletion under GDPR Article 17',
      status: 'pending'
    };

    try {
      await secureFirestoreClient.createDocument('deletion_requests', request.requestId, request);
      
      // Update relevant retention records
      await this.markDataForDeletion(userId, request.dataTypes, request.reason, scheduledFor);
      
      return request;
    } catch (error) {
      console.error('[DataRetention] Failed to schedule deletion:', error);
      throw createApiError(
        ApiErrorCode.DATABASE_ERROR,
        'Failed to schedule data deletion',
        error,
        'Unable to process deletion request'
      );
    }
  }

  // Execute scheduled deletions
  async executeScheduledDeletions(): Promise<void> {
    try {
      const now = Timestamp.now();
      
      // Get all pending deletion requests that are due
      const pendingDeletions = await secureFirestoreClient.queryDocuments('deletion_requests', [
        { field: 'status', operator: '==', value: 'approved' },
        { field: 'scheduledFor', operator: '<=', value: now }
      ]);

      for (const deletionRequest of pendingDeletions) {
        await this.executeDeletion(deletionRequest as DeletionRequest);
      }

      // Also check for expired data based on retention periods
      await this.deleteExpiredData();
      
    } catch (error) {
      console.error('[DataRetention] Failed to execute scheduled deletions:', error);
      throw createApiError(
        ApiErrorCode.PROCESSING_ERROR,
        'Failed to execute scheduled deletions',
        error,
        'Deletion process encountered an error'
      );
    }
  }

  // Execute a specific deletion request
  private async executeDeletion(request: DeletionRequest): Promise<void> {
    try {
      // Update request status
      await secureFirestoreClient.updateDocument('deletion_requests', request.requestId, {
        status: 'in_progress'
      });

      const deletionResults: Array<{ dataType: string; success: boolean; error?: string }> = [];

      for (const dataType of request.dataTypes) {
        try {
          await this.deleteUserDataByType(request.userId, dataType, request.reason);
          deletionResults.push({ dataType, success: true });
        } catch (error) {
          console.error(`[DataRetention] Failed to delete ${dataType} for user ${request.userId}:`, error);
          deletionResults.push({ 
            dataType, 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      // Update request with results
      await secureFirestoreClient.updateDocument('deletion_requests', request.requestId, {
        status: deletionResults.every(r => r.success) ? 'completed' : 'partially_completed',
        completedAt: Timestamp.now(),
        results: deletionResults
      });

    } catch (error) {
      console.error('[DataRetention] Failed to execute deletion:', error);
      await secureFirestoreClient.updateDocument('deletion_requests', request.requestId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  // Delete user data by type
  private async deleteUserDataByType(
    userId: string, 
    dataType: string, 
    reason: DeletionReason
  ): Promise<void> {
    const now = Timestamp.now();

    switch (dataType) {
      case 'journalEntries':
        // Delete encrypted journal entries
        await secureFirestoreClient.deleteUserJournalEntries(userId);
        break;

      case 'aiProcessingData':
        // Delete AI session data, cache, and insights
        await secureFirestoreClient.deleteCollectionByUser('ai_sessions', userId);
        await secureFirestoreClient.deleteCollectionByUser('ai_insights', userId);
        await secureFirestoreClient.deleteCollectionByUser('ai_cache', userId);
        break;

      case 'accountData':
        // Delete user profile and preferences (but preserve audit trail)
        await secureFirestoreClient.deleteCollectionByUser('user_profiles', userId);
        await secureFirestoreClient.deleteCollectionByUser('user_preferences', userId);
        break;

      case 'analyticsData':
        // Anonymize analytics data instead of deletion
        await this.anonymizeAnalyticsData(userId);
        break;

      default:
        console.warn(`[DataRetention] Unknown data type for deletion: ${dataType}`);
    }

    // Update retention records
    await this.updateRetentionRecordsForDeletion(userId, dataType, reason, now);
  }

  // Delete expired data based on retention periods
  private async deleteExpiredData(): Promise<void> {
    try {
      const now = Timestamp.now();
      
      // Get all retention records that have expired
      const expiredRecords = await secureFirestoreClient.queryDocuments('data_retention', [
        { field: 'expirationDate', operator: '<=', value: now },
        { field: 'lifecycleState', operator: '==', value: DataLifecycleState.ACTIVE }
      ]);

      for (const record of expiredRecords) {
        const retentionRecord = record as DataRetentionRecord;
        await this.deleteUserDataByType(
          retentionRecord.userId, 
          retentionRecord.dataType, 
          DeletionReason.RETENTION_EXPIRY
        );
      }

    } catch (error) {
      console.error('[DataRetention] Failed to delete expired data:', error);
      throw error;
    }
  }

  // Mark data for pending deletion
  private async markDataForDeletion(
    userId: string, 
    dataTypes: string[], 
    reason: DeletionReason,
    scheduledFor: Timestamp
  ): Promise<void> {
    try {
      const retentionRecords = await secureFirestoreClient.queryDocuments('data_retention', [
        { field: 'userId', operator: '==', value: userId },
        { field: 'dataType', operator: 'in', value: dataTypes }
      ]);

      for (const record of retentionRecords) {
        const retentionRecord = record as DataRetentionRecord;
        await secureFirestoreClient.updateDocument('data_retention', retentionRecord.id, {
          lifecycleState: DataLifecycleState.PENDING_DELETION,
          deletionReason: reason,
          expirationDate: scheduledFor,
          'auditTrail': [...retentionRecord.auditTrail, {
            eventId: `event_${Date.now()}`,
            timestamp: Timestamp.now(),
            eventType: 'scheduled_deletion',
            reason: `Deletion scheduled: ${reason}`,
            performedBy: 'system',
            metadata: { scheduledFor: scheduledFor.toDate().toISOString() }
          }]
        });
      }

    } catch (error) {
      console.error('[DataRetention] Failed to mark data for deletion:', error);
      throw error;
    }
  }

  // Update retention records after deletion
  private async updateRetentionRecordsForDeletion(
    userId: string,
    dataType: string,
    reason: DeletionReason,
    deletedAt: Timestamp
  ): Promise<void> {
    try {
      const retentionRecords = await secureFirestoreClient.queryDocuments('data_retention', [
        { field: 'userId', operator: '==', value: userId },
        { field: 'dataType', operator: '==', value: dataType }
      ]);

      for (const record of retentionRecords) {
        const retentionRecord = record as DataRetentionRecord;
        await secureFirestoreClient.updateDocument('data_retention', retentionRecord.id, {
          lifecycleState: DataLifecycleState.DELETED,
          deletionReason: reason,
          deletedAt,
          'auditTrail': [...retentionRecord.auditTrail, {
            eventId: `event_${Date.now()}`,
            timestamp: deletedAt,
            eventType: 'deleted',
            reason: `Data deleted: ${reason}`,
            performedBy: 'system',
            metadata: { dataType }
          }]
        });
      }

    } catch (error) {
      console.error('[DataRetention] Failed to update retention records:', error);
      throw error;
    }
  }

  // Anonymize analytics data instead of deletion
  private async anonymizeAnalyticsData(userId: string): Promise<void> {
    try {
      // Replace user ID with anonymous hash in analytics data
      const anonymousId = `anon_${userId.slice(-8)}_${Date.now()}`;
      
      await secureFirestoreClient.updateCollectionByUser('analytics_data', userId, {
        userId: anonymousId,
        anonymized: true,
        anonymizedAt: Timestamp.now()
      });

    } catch (error) {
      console.error('[DataRetention] Failed to anonymize analytics data:', error);
      throw error;
    }
  }

  // Get retention record by ID
  private async getRetentionRecord(retentionRecordId: string): Promise<DataRetentionRecord | null> {
    try {
      return await secureFirestoreClient.getDocument('data_retention', retentionRecordId) as DataRetentionRecord;
    } catch (error) {
      console.error('[DataRetention] Failed to get retention record:', error);
      return null;
    }
  }

  // Public method to get user's data retention summary
  async getUserDataRetentionSummary(userId: string): Promise<{
    totalDataItems: number;
    dataByType: Record<string, number>;
    nextExpirations: Array<{ dataType: string; expirationDate: Date; count: number }>;
    deletionRequests: DeletionRequest[];
  }> {
    try {
      const retentionRecords = await secureFirestoreClient.queryDocuments('data_retention', [
        { field: 'userId', operator: '==', value: userId },
        { field: 'lifecycleState', operator: '!=', value: DataLifecycleState.DELETED }
      ]) as DataRetentionRecord[];

      const deletionRequests = await secureFirestoreClient.queryDocuments('deletion_requests', [
        { field: 'userId', operator: '==', value: userId }
      ]) as DeletionRequest[];

      const dataByType: Record<string, number> = {};
      const expirationMap: Record<string, { count: number; earliestExpiration: Date }> = {};

      for (const record of retentionRecords) {
        dataByType[record.dataType] = (dataByType[record.dataType] || 0) + 1;

        if (record.expirationDate) {
          const expirationDate = record.expirationDate.toDate();
          if (!expirationMap[record.dataType] || expirationDate < expirationMap[record.dataType].earliestExpiration) {
            expirationMap[record.dataType] = {
              count: (expirationMap[record.dataType]?.count || 0) + 1,
              earliestExpiration: expirationDate
            };
          }
        }
      }

      const nextExpirations = Object.entries(expirationMap)
        .map(([dataType, data]) => ({
          dataType,
          expirationDate: data.earliestExpiration,
          count: data.count
        }))
        .sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime())
        .slice(0, 5); // Next 5 expirations

      return {
        totalDataItems: retentionRecords.length,
        dataByType,
        nextExpirations,
        deletionRequests
      };

    } catch (error) {
      console.error('[DataRetention] Failed to get user retention summary:', error);
      throw createApiError(
        ApiErrorCode.DATABASE_ERROR,
        'Failed to get data retention summary',
        error,
        'Unable to retrieve data retention information'
      );
    }
  }
}

// Export singleton instance
export const dataRetentionManager = new DataRetentionManager();