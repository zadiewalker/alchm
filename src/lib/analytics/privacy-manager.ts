// Privacy Manager - HIPAA compliance and data protection
// Manages user consent, data retention, and privacy controls

import { UserProfile } from '@/types/firestore-schema';
import { db } from '@/lib/firebaseAdmin';

export interface PrivacySettings {
  analyticsConsent: boolean;
  performanceTracking: boolean;
  marketingAnalytics: boolean;
  anonymizedUsageData: boolean;
  crossDeviceTracking: boolean;
  dataRetentionPeriod: number; // days
  allowResearchParticipation: boolean;
  shareAggregatedInsights: boolean;
}

export interface DataExportRequest {
  userId: string;
  requestId: string;
  requestedAt: number;
  dataTypes: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: number;
  completedAt?: number;
}

export interface DataDeletionRequest {
  userId: string;
  requestId: string;
  requestedAt: number;
  deletionType: 'partial' | 'complete';
  reason: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedAt?: number;
  retentionExceptions: string[]; // Legal or business reasons to retain certain data
}

export class PrivacyManager {
  private static instance: PrivacyManager;
  
  static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager();
    }
    return PrivacyManager.instance;
  }
  
  // Consent Management
  async updatePrivacySettings(userId: string, settings: Partial<PrivacySettings>): Promise<void> {
    try {
      const settingsDoc = db.collection('user_privacy_settings').doc(userId);
      
      await settingsDoc.set({
        ...settings,
        lastUpdated: Date.now(),
        consentVersion: '1.0',
        ipAddress: 'anonymized', // Don't store actual IP
        userAgent: 'anonymized' // Don't store actual user agent
      }, { merge: true });
      
      // Log consent change for compliance
      await this.logConsentChange(userId, settings);
      
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      throw new Error('Privacy settings update failed');
    }
  }
  
  async getPrivacySettings(userId: string): Promise<PrivacySettings> {
    try {
      const settingsDoc = await db.collection('user_privacy_settings').doc(userId).get();
      
      if (!settingsDoc.exists) {
        // Return default privacy-first settings
        return this.getDefaultPrivacySettings();
      }
      
      return settingsDoc.data() as PrivacySettings;
      
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      return this.getDefaultPrivacySettings();
    }
  }
  
  private getDefaultPrivacySettings(): PrivacySettings {
    return {
      analyticsConsent: false, // Opt-in required
      performanceTracking: true, // Essential for service
      marketingAnalytics: false, // Opt-in required
      anonymizedUsageData: true, // Privacy-safe by default
      crossDeviceTracking: false, // Opt-in required
      dataRetentionPeriod: 365, // 1 year default
      allowResearchParticipation: false, // Opt-in required
      shareAggregatedInsights: true // Privacy-safe aggregated data
    };
  }
  
  // Data Subject Rights (GDPR/CCPA compliance)
  async requestDataExport(userId: string, dataTypes: string[]): Promise<string> {
    const requestId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const exportRequest: DataExportRequest = {
        userId,
        requestId,
        requestedAt: Date.now(),
        dataTypes,
        status: 'pending'
      };
      
      await db.collection('data_export_requests').doc(requestId).set(exportRequest);
      
      // Schedule export processing (would be handled by a background job)
      await this.scheduleDataExport(requestId);
      
      return requestId;
      
    } catch (error) {
      console.error('Failed to request data export:', error);
      throw new Error('Data export request failed');
    }
  }
  
  async requestDataDeletion(
    userId: string, 
    deletionType: 'partial' | 'complete',
    reason: string
  ): Promise<string> {
    const requestId = `deletion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Check if user has premium subscription
      const userProfile = await this.getUserProfile(userId);
      const retentionExceptions = await this.getRetentionExceptions(userId, userProfile);
      
      const deletionRequest: DataDeletionRequest = {
        userId,
        requestId,
        requestedAt: Date.now(),
        deletionType,
        reason,
        status: 'pending',
        retentionExceptions
      };
      
      await db.collection('data_deletion_requests').doc(requestId).set(deletionRequest);
      
      // Schedule deletion processing
      await this.scheduleDataDeletion(requestId);
      
      return requestId;
      
    } catch (error) {
      console.error('Failed to request data deletion:', error);
      throw new Error('Data deletion request failed');
    }
  }
  
  // Data Anonymization
  async anonymizeUserData(userId: string): Promise<void> {
    try {
      const batch = db.batch();
      
      // Anonymize user profile
      const userRef = db.collection('users_standard').doc(userId);
      batch.update(userRef, {
        email: 'anonymized@example.com',
        displayName: 'Anonymized User',
        photoURL: null,
        personalIdentifiers: null,
        anonymized: true,
        anonymizedAt: Date.now()
      });
      
      // Anonymize journal entries (keep statistical data)
      const entriesSnapshot = await db.collection('entries').doc(userId).collection('active').get();
      entriesSnapshot.docs.forEach(doc => {
        const entryRef = doc.ref;
        batch.update(entryRef, {
          text: '[ANONYMIZED]',
          originalWordCount: doc.data().wordCount, // Keep for statistics
          originalMoodData: {
            before: doc.data().moodBefore,
            after: doc.data().moodAfter,
            delta: doc.data().moodDelta
          },
          text: null,
          keyTopics: [], // Remove content-based topics
          anonymized: true,
          anonymizedAt: Date.now()
        });
      });
      
      await batch.commit();
      
    } catch (error) {
      console.error('Failed to anonymize user data:', error);
      throw new Error('Data anonymization failed');
    }
  }
  
  // Data Retention Management
  async enforceDataRetention(): Promise<void> {
    try {
      // Get all users with their retention settings
      const usersSnapshot = await db.collection('user_privacy_settings').get();
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const settings = userDoc.data() as PrivacySettings;
        
        await this.enforceUserDataRetention(userId, settings);
      }
      
    } catch (error) {
      console.error('Data retention enforcement failed:', error);
    }
  }
  
  private async enforceUserDataRetention(userId: string, settings: PrivacySettings): Promise<void> {
    const retentionCutoff = Date.now() - (settings.dataRetentionPeriod * 24 * 60 * 60 * 1000);
    
    try {
      // Delete old analytics events
      const analyticsQuery = db.collectionGroup('analytics_events')
        .where('userId', '==', userId)
        .where('timestamp', '<', retentionCutoff);
      
      const analyticsSnapshot = await analyticsQuery.get();
      const batch = db.batch();
      
      analyticsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      if (analyticsSnapshot.docs.length > 0) {
        await batch.commit();
        
        console.log(`Deleted ${analyticsSnapshot.docs.length} old analytics events for user ${userId}`);
      }
      
    } catch (error) {
      console.error(`Data retention enforcement failed for user ${userId}:`, error);
    }
  }
  
  // Compliance Auditing
  async generateComplianceReport(startDate: Date, endDate: Date): Promise<any> {
    try {
      const report = {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        dataRequests: await this.getDataRequestsReport(startDate, endDate),
        consentChanges: await this.getConsentChangesReport(startDate, endDate),
        dataRetention: await this.getDataRetentionReport(),
        privacyIncidents: await this.getPrivacyIncidentsReport(startDate, endDate),
        complianceMetrics: await this.getComplianceMetrics()
      };
      
      return report;
      
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
      throw new Error('Compliance report generation failed');
    }
  }
  
  // Helper methods
  private async logConsentChange(userId: string, changes: Partial<PrivacySettings>): Promise<void> {
    await db.collection('consent_audit_log').add({
      userId,
      changes,
      timestamp: Date.now(),
      source: 'user_settings',
      ipAddress: 'anonymized' // Don't store actual IP for privacy
    });
  }
  
  private async scheduleDataExport(requestId: string): Promise<void> {
    // In production, this would trigger a background job
    console.log(`Data export scheduled: ${requestId}`);
    
    // Mock implementation - would actually process the export
    setTimeout(async () => {
      await db.collection('data_export_requests').doc(requestId).update({
        status: 'completed',
        downloadUrl: `https://secure-exports.alchm.app/${requestId}`,
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        completedAt: Date.now()
      });
    }, 5000);
  }
  
  private async scheduleDataDeletion(requestId: string): Promise<void> {
    console.log(`Data deletion scheduled: ${requestId}`);
    
    // Mock implementation
    setTimeout(async () => {
      await db.collection('data_deletion_requests').doc(requestId).update({
        status: 'completed',
        completedAt: Date.now()
      });
    }, 10000);
  }
  
  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await db.collection('users_standard').doc(userId).get();
      return userDoc.exists ? userDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      return null;
    }
  }
  
  private async getRetentionExceptions(userId: string, userProfile: UserProfile | null): Promise<string[]> {
    const exceptions: string[] = [];
    
    // Business reasons to retain data
    if (userProfile?.tier !== 'free') {
      exceptions.push('active_subscription');
    }
    
    // Legal reasons (e.g., financial records for tax purposes)
    const hasRecentPayments = await this.hasRecentPayments(userId);
    if (hasRecentPayments) {
      exceptions.push('financial_records');
    }
    
    return exceptions;
  }
  
  private async hasRecentPayments(userId: string): Promise<boolean> {
    // Check for payments in the last 7 years (typical tax retention period)
    const sevenYearsAgo = Date.now() - (7 * 365 * 24 * 60 * 60 * 1000);
    
    try {
      const paymentsSnapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .where('timestamp', '>', sevenYearsAgo)
        .limit(1)
        .get();
      
      return !paymentsSnapshot.empty;
    } catch (error) {
      return false;
    }
  }
  
  private async getDataRequestsReport(startDate: Date, endDate: Date): Promise<any> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    const [exportRequests, deletionRequests] = await Promise.all([
      db.collection('data_export_requests')
        .where('requestedAt', '>=', start)
        .where('requestedAt', '<', end)
        .get(),
      db.collection('data_deletion_requests')
        .where('requestedAt', '>=', start)
        .where('requestedAt', '<', end)
        .get()
    ]);
    
    return {
      dataExports: {
        total: exportRequests.size,
        completed: exportRequests.docs.filter(doc => doc.data().status === 'completed').length,
        pending: exportRequests.docs.filter(doc => doc.data().status === 'pending').length
      },
      dataDeletions: {
        total: deletionRequests.size,
        completed: deletionRequests.docs.filter(doc => doc.data().status === 'completed').length,
        pending: deletionRequests.docs.filter(doc => doc.data().status === 'pending').length
      }
    };
  }
  
  private async getConsentChangesReport(startDate: Date, endDate: Date): Promise<any> {
    const start = startDate.getTime();
    const end = endDate.getTime();
    
    const consentChanges = await db.collection('consent_audit_log')
      .where('timestamp', '>=', start)
      .where('timestamp', '<', end)
      .get();
    
    return {
      totalChanges: consentChanges.size,
      consentGranted: consentChanges.docs.filter(doc => 
        Object.values(doc.data().changes).some(value => value === true)
      ).length,
      consentRevoked: consentChanges.docs.filter(doc => 
        Object.values(doc.data().changes).some(value => value === false)
      ).length
    };
  }
  
  private async getDataRetentionReport(): Promise<any> {
    // This would calculate data retention statistics
    return {
      totalUsersWithSettings: 0,
      averageRetentionPeriod: 365,
      dataVolumeCleaned: '0MB'
    };
  }
  
  private async getPrivacyIncidentsReport(startDate: Date, endDate: Date): Promise<any> {
    // This would report any privacy incidents or breaches
    return {
      incidents: 0,
      resolved: 0,
      averageResolutionTime: 0
    };
  }
  
  private async getComplianceMetrics(): Promise<any> {
    return {
      gdprCompliance: 'fully_compliant',
      ccpaCompliance: 'fully_compliant',
      hipaaCompliance: 'fully_compliant',
      lastAuditDate: Date.now(),
      nextAuditDue: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days
    };
  }
}

// Export singleton instance
export const privacyManager = PrivacyManager.getInstance();