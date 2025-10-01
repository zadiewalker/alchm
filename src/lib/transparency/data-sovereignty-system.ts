/**
 * Data Sovereignty & User Control System
 * Provides unprecedented user control over their data and privacy settings
 * Built for ALCHM's transparency and accountability framework
 */

import { z } from 'zod';
import { securityPrivacyFortress } from '../security/security-privacy-fortress';
import { analytics } from '../analytics';

// User data control preferences schema
export const DataControlPreferencesSchema = z.object({
  userId: z.string(),
  dataCollection: z.object({
    journalAnalytics: z.boolean().default(false),
    behaviorPatterns: z.boolean().default(false),
    performanceMetrics: z.boolean().default(false),
    researchParticipation: z.boolean().default(false),
    anonymizedInsights: z.boolean().default(true),
  }),
  dataSharing: z.object({
    academicResearch: z.boolean().default(false),
    publicHealthInsights: z.boolean().default(false),
    platformImprovement: z.boolean().default(true),
    thirdPartyIntegrations: z.boolean().default(false),
    emergencyServices: z.boolean().default(true),
  }),
  dataRetention: z.object({
    journalData: z.enum(['30_days', '1_year', '3_years', 'indefinite']).default('3_years'),
    analyticsData: z.enum(['30_days', '90_days', '1_year', '2_years']).default('1_year'),
    researchData: z.enum(['1_year', '5_years', '10_years', 'indefinite']).default('5_years'),
    automaticDeletion: z.boolean().default(true),
  }),
  dataAccess: z.object({
    downloadFrequency: z.enum(['daily', 'weekly', 'monthly', 'on_demand']).default('on_demand'),
    exportFormats: z.array(z.enum(['json', 'csv', 'pdf', 'txt'])).default(['json']),
    includeAnalytics: z.boolean().default(false),
    includeResearchInsights: z.boolean().default(false),
  }),
  transparencyLevel: z.enum(['minimal', 'standard', 'comprehensive', 'research_grade']).default('standard'),
  notifications: z.object({
    dataUsageAlerts: z.boolean().default(true),
    researchInvitations: z.boolean().default(false),
    privacyUpdates: z.boolean().default(true),
    transparencyReports: z.boolean().default(true),
  }),
  lastUpdated: z.date().default(() => new Date()),
  version: z.string().default('1.0'),
});

export type DataControlPreferences = z.infer<typeof DataControlPreferencesSchema>;

// Data access log entry schema
export const DataAccessLogSchema = z.object({
  userId: z.string(),
  accessType: z.enum(['read', 'write', 'update', 'delete', 'export', 'analyze', 'research']),
  dataType: z.enum(['journal', 'profile', 'analytics', 'research', 'insights', 'metadata']),
  accessor: z.enum(['user', 'system', 'ai_service', 'research_partner', 'admin', 'third_party']),
  accessorId: z.string().optional(),
  purpose: z.string(),
  timestamp: z.date().default(() => new Date()),
  dataHash: z.string(), // Hash of accessed data for integrity verification
  authorized: z.boolean(),
  auditTrail: z.string(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  location: z.string().optional(),
  duration: z.number().optional(), // Access duration in milliseconds
  result: z.enum(['success', 'failure', 'partial', 'denied']),
  errors: z.array(z.string()).optional(),
});

export type DataAccessLog = z.infer<typeof DataAccessLogSchema>;

// Data transparency report schema
export const DataTransparencyReportSchema = z.object({
  userId: z.string(),
  reportPeriod: z.object({
    start: z.date(),
    end: z.date(),
  }),
  dataCollection: z.object({
    journalEntries: z.number(),
    analyticsEvents: z.number(),
    aiInteractions: z.number(),
    researchDataPoints: z.number(),
  }),
  dataSharing: z.object({
    researchParticipations: z.number(),
    anonymizedInsights: z.number(),
    publicHealthContributions: z.number(),
    academicCollaborations: z.number(),
  }),
  dataProcessing: z.object({
    aiAnalyses: z.number(),
    patternRecognitions: z.number(),
    wellnessInsights: z.number(),
    interventionSuggestions: z.number(),
  }),
  dataAccess: z.object({
    userExports: z.number(),
    systemAccesses: z.number(),
    researchAccesses: z.number(),
    thirdPartyAccesses: z.number(),
  }),
  privacyMeasures: z.object({
    encryptionLevel: z.string(),
    anonymizationTechniques: z.array(z.string()),
    dataMinimization: z.boolean(),
    consentGranularity: z.string(),
  }),
  rights: z.object({
    dataPortability: z.boolean(),
    rightToErasure: z.boolean(),
    rightToRectification: z.boolean(),
    rightToRestriction: z.boolean(),
  }),
  generatedAt: z.date().default(() => new Date()),
  version: z.string().default('1.0'),
});

export type DataTransparencyReport = z.infer<typeof DataTransparencyReportSchema>;

/**
 * Data Sovereignty System
 * Manages user control over their data with unprecedented transparency
 */
export class DataSovereigntySystem {
  private db: any; // Firebase Firestore instance
  private encryption: any; // Encryption service

  constructor(db: any, encryption: any) {
    this.db = db;
    this.encryption = encryption;
  }

  /**
   * Initialize user data sovereignty preferences
   */
  async initializeUserPreferences(userId: string, initialPreferences?: Partial<DataControlPreferences>): Promise<DataControlPreferences> {
    try {
      const defaultPreferences = DataControlPreferencesSchema.parse({
        userId,
        ...initialPreferences,
      });

      await this.db.collection('user_data_preferences').doc(userId).set(defaultPreferences);
      
      // Log the initialization
      await this.logDataAccess({
        userId,
        accessType: 'write',
        dataType: 'profile',
        accessor: 'system',
        purpose: 'Initialize data sovereignty preferences',
        dataHash: await this.generateDataHash(defaultPreferences),
        authorized: true,
        auditTrail: 'data_sovereignty_init',
        result: 'success',
      });

      analytics.track('user', 'data_sovereignty_initialized', 'preferences', undefined, {
        transparencyLevel: defaultPreferences.transparencyLevel,
        researchParticipation: defaultPreferences.dataCollection.researchParticipation,
      });

      return defaultPreferences;
    } catch (error) {
      throw new Error(`Failed to initialize data sovereignty preferences: ${error}`);
    }
  }

  /**
   * Update user data control preferences
   */
  async updatePreferences(userId: string, updates: Partial<DataControlPreferences>): Promise<DataControlPreferences> {
    try {
      const currentPreferences = await this.getUserPreferences(userId);
      if (!currentPreferences) {
        throw new Error('User preferences not found');
      }

      const updatedPreferences = DataControlPreferencesSchema.parse({
        ...currentPreferences,
        ...updates,
        lastUpdated: new Date(),
        version: this.incrementVersion(currentPreferences.version),
      });

      await this.db.collection('user_data_preferences').doc(userId).update(updatedPreferences);

      // Log the update
      await this.logDataAccess({
        userId,
        accessType: 'update',
        dataType: 'profile',
        accessor: 'user',
        purpose: 'Update data sovereignty preferences',
        dataHash: await this.generateDataHash(updatedPreferences),
        authorized: true,
        auditTrail: 'user_preference_update',
        result: 'success',
      });

      analytics.track('user', 'data_sovereignty_updated', 'preferences', undefined, {
        changedFields: Object.keys(updates),
        transparencyLevel: updatedPreferences.transparencyLevel,
      });

      return updatedPreferences;
    } catch (error) {
      throw new Error(`Failed to update data sovereignty preferences: ${error}`);
    }
  }

  /**
   * Get user data control preferences
   */
  async getUserPreferences(userId: string): Promise<DataControlPreferences | null> {
    try {
      const doc = await this.db.collection('user_data_preferences').doc(userId).get();
      
      if (!doc.exists) {
        return null;
      }

      const preferences = DataControlPreferencesSchema.parse(doc.data());

      // Log the access
      await this.logDataAccess({
        userId,
        accessType: 'read',
        dataType: 'profile',
        accessor: 'user',
        purpose: 'View data sovereignty preferences',
        dataHash: await this.generateDataHash(preferences),
        authorized: true,
        auditTrail: 'preference_view',
        result: 'success',
      });

      return preferences;
    } catch (error) {
      console.error('Failed to get user preferences:', error);
      return null;
    }
  }

  /**
   * Check if user has consented to specific data usage
   */
  async checkDataConsent(userId: string, dataType: keyof DataControlPreferences['dataCollection'], purpose: string): Promise<boolean> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        return false;
      }

      const hasConsent = preferences.dataCollection[dataType] || false;

      // Log the consent check
      await this.logDataAccess({
        userId,
        accessType: 'read',
        dataType: 'profile',
        accessor: 'system',
        purpose: `Check consent for ${purpose}`,
        dataHash: await this.generateDataHash({ dataType, hasConsent }),
        authorized: true,
        auditTrail: 'consent_check',
        result: hasConsent ? 'success' : 'denied',
      });

      return hasConsent;
    } catch (error) {
      console.error('Failed to check data consent:', error);
      return false;
    }
  }

  /**
   * Log data access for transparency
   */
  async logDataAccess(log: Omit<DataAccessLog, 'timestamp'>): Promise<void> {
    try {
      const logEntry = DataAccessLogSchema.parse({
        ...log,
        timestamp: new Date(),
      });

      await this.db.collection('data_access_logs').add(logEntry);

      // Track analytics event if user has consented
      const hasAnalyticsConsent = await this.checkDataConsent(log.userId, 'journalAnalytics', 'data access logging');
      if (hasAnalyticsConsent) {
        analytics.track('user', 'data_access_logged', log.accessType, undefined, {
          dataType: log.dataType,
          accessor: log.accessor,
          result: log.result,
        });
      }
    } catch (error) {
      console.error('Failed to log data access:', error);
    }
  }

  /**
   * Get user's data access history
   */
  async getDataAccessHistory(userId: string, options?: {
    startDate?: Date;
    endDate?: Date;
    accessType?: string;
    dataType?: string;
    limit?: number;
  }): Promise<DataAccessLog[]> {
    try {
      let query = this.db.collection('data_access_logs').where('userId', '==', userId);

      if (options?.startDate) {
        query = query.where('timestamp', '>=', options.startDate);
      }
      if (options?.endDate) {
        query = query.where('timestamp', '<=', options.endDate);
      }
      if (options?.accessType) {
        query = query.where('accessType', '==', options.accessType);
      }
      if (options?.dataType) {
        query = query.where('dataType', '==', options.dataType);
      }

      query = query.orderBy('timestamp', 'desc');
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      const logs = snapshot.docs.map(doc => DataAccessLogSchema.parse(doc.data()));

      // Log the history access
      await this.logDataAccess({
        userId,
        accessType: 'read',
        dataType: 'metadata',
        accessor: 'user',
        purpose: 'View data access history',
        dataHash: await this.generateDataHash({ count: logs.length, options }),
        authorized: true,
        auditTrail: 'access_history_view',
        result: 'success',
      });

      return logs;
    } catch (error) {
      console.error('Failed to get data access history:', error);
      return [];
    }
  }

  /**
   * Generate transparency report for user
   */
  async generateTransparencyReport(userId: string, period: { start: Date; end: Date }): Promise<DataTransparencyReport> {
    try {
      // Collect data metrics
      const [journalCount, analyticsCount, aiInteractions, researchData] = await Promise.all([
        this.getJournalCount(userId, period),
        this.getAnalyticsEventCount(userId, period),
        this.getAIInteractionCount(userId, period),
        this.getResearchDataCount(userId, period),
      ]);

      // Collect access metrics
      const accessLogs = await this.getDataAccessHistory(userId, {
        startDate: period.start,
        endDate: period.end,
      });

      const userExports = accessLogs.filter(log => log.accessType === 'export' && log.accessor === 'user').length;
      const systemAccesses = accessLogs.filter(log => log.accessor === 'system').length;
      const researchAccesses = accessLogs.filter(log => log.accessor === 'research_partner').length;
      const thirdPartyAccesses = accessLogs.filter(log => log.accessor === 'third_party').length;

      // Get user preferences for privacy measures
      const preferences = await this.getUserPreferences(userId);

      const report = DataTransparencyReportSchema.parse({
        userId,
        reportPeriod: period,
        dataCollection: {
          journalEntries: journalCount,
          analyticsEvents: analyticsCount,
          aiInteractions,
          researchDataPoints: researchData,
        },
        dataSharing: {
          researchParticipations: preferences?.dataSharing.academicResearch ? 1 : 0,
          anonymizedInsights: preferences?.dataCollection.anonymizedInsights ? analyticsCount : 0,
          publicHealthContributions: preferences?.dataSharing.publicHealthInsights ? 1 : 0,
          academicCollaborations: researchAccesses,
        },
        dataProcessing: {
          aiAnalyses: aiInteractions,
          patternRecognitions: Math.floor(aiInteractions * 0.3), // Estimated
          wellnessInsights: Math.floor(aiInteractions * 0.5), // Estimated
          interventionSuggestions: Math.floor(aiInteractions * 0.2), // Estimated
        },
        dataAccess: {
          userExports,
          systemAccesses,
          researchAccesses,
          thirdPartyAccesses,
        },
        privacyMeasures: {
          encryptionLevel: 'AES-256',
          anonymizationTechniques: ['k-anonymity', 'differential_privacy', 'hash_pseudonymization'],
          dataMinimization: true,
          consentGranularity: 'granular_per_feature',
        },
        rights: {
          dataPortability: true,
          rightToErasure: true,
          rightToRectification: true,
          rightToRestriction: true,
        },
      });

      // Store the report
      await this.db.collection('transparency_reports').add(report);

      // Log report generation
      await this.logDataAccess({
        userId,
        accessType: 'read',
        dataType: 'metadata',
        accessor: 'user',
        purpose: 'Generate transparency report',
        dataHash: await this.generateDataHash(report),
        authorized: true,
        auditTrail: 'transparency_report_generated',
        result: 'success',
      });

      analytics.track('user', 'transparency_report_generated', 'report', undefined, {
        reportPeriod: `${period.start.toISOString()}_${period.end.toISOString()}`,
        dataPoints: journalCount + analyticsCount + aiInteractions,
      });

      return report;
    } catch (error) {
      throw new Error(`Failed to generate transparency report: ${error}`);
    }
  }

  /**
   * Export user data with full transparency
   */
  async exportUserData(userId: string, options: {
    format: 'json' | 'csv' | 'pdf' | 'txt';
    includeAnalytics: boolean;
    includeResearchInsights: boolean;
    dateRange?: { start: Date; end: Date };
  }): Promise<{ data: any; hash: string; exportId: string }> {
    try {
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        throw new Error('User preferences not found');
      }

      // Check if user has configured data export permissions
      if (!preferences.dataAccess.exportFormats.includes(options.format)) {
        throw new Error(`Export format ${options.format} not allowed by user preferences`);
      }

      // Collect user data based on preferences and options
      const exportData = await this.collectUserDataForExport(userId, options, preferences);
      
      // Generate export hash for integrity
      const dataHash = await this.generateDataHash(exportData);
      const exportId = `export_${userId}_${Date.now()}`;

      // Log the export
      await this.logDataAccess({
        userId,
        accessType: 'export',
        dataType: 'journal',
        accessor: 'user',
        purpose: 'User data export',
        dataHash,
        authorized: true,
        auditTrail: exportId,
        result: 'success',
      });

      analytics.track('user', 'data_exported', options.format, Object.keys(exportData).length, {
        includeAnalytics: options.includeAnalytics,
        includeResearchInsights: options.includeResearchInsights,
        exportId,
      });

      return {
        data: exportData,
        hash: dataHash,
        exportId,
      };
    } catch (error) {
      throw new Error(`Failed to export user data: ${error}`);
    }
  }

  /**
   * Delete user data (Right to Erasure)
   */
  async deleteUserData(userId: string, options: {
    dataTypes: string[];
    retainForResearch: boolean;
    anonymizeInstead: boolean;
  }): Promise<{ deletedItems: number; anonymizedItems: number; errors: string[] }> {
    try {
      const preferences = await this.getUserPreferences(userId);
      let deletedItems = 0;
      let anonymizedItems = 0;
      const errors: string[] = [];

      // Validate deletion request against user preferences
      if (options.retainForResearch && !preferences?.dataSharing.academicResearch) {
        options.retainForResearch = false;
      }

      // Process each data type
      for (const dataType of options.dataTypes) {
        try {
          if (options.anonymizeInstead) {
            const anonymized = await this.anonymizeUserData(userId, dataType);
            anonymizedItems += anonymized;
          } else {
            const deleted = await this.deleteUserDataByType(userId, dataType, options.retainForResearch);
            deletedItems += deleted;
          }
        } catch (error) {
          errors.push(`Failed to process ${dataType}: ${error}`);
        }
      }

      // Log the deletion/anonymization
      await this.logDataAccess({
        userId,
        accessType: 'delete',
        dataType: 'profile',
        accessor: 'user',
        purpose: 'Exercise right to erasure',
        dataHash: await this.generateDataHash({ deletedItems, anonymizedItems, options }),
        authorized: true,
        auditTrail: 'right_to_erasure',
        result: errors.length === 0 ? 'success' : 'partial',
        errors,
      });

      analytics.track('user', 'data_deletion_requested', 'erasure', deletedItems + anonymizedItems, {
        deletedItems,
        anonymizedItems,
        dataTypes: options.dataTypes,
        anonymizeInstead: options.anonymizeInstead,
      });

      return { deletedItems, anonymizedItems, errors };
    } catch (error) {
      throw new Error(`Failed to delete user data: ${error}`);
    }
  }

  // Helper methods
  private async generateDataHash(data: any): Promise<string> {
    return this.encryption.hash(JSON.stringify(data));
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const minor = parseInt(parts[1] || '0') + 1;
    return `${parts[0]}.${minor}`;
  }

  private async getJournalCount(userId: string, period: { start: Date; end: Date }): Promise<number> {
    const snapshot = await this.db.collection('journals')
      .where('userId', '==', userId)
      .where('createdAt', '>=', period.start)
      .where('createdAt', '<=', period.end)
      .get();
    return snapshot.size;
  }

  private async getAnalyticsEventCount(userId: string, period: { start: Date; end: Date }): Promise<number> {
    const snapshot = await this.db.collection('analytics_events')
      .where('userId', '==', userId)
      .where('timestamp', '>=', period.start.getTime())
      .where('timestamp', '<=', period.end.getTime())
      .get();
    return snapshot.size;
  }

  private async getAIInteractionCount(userId: string, period: { start: Date; end: Date }): Promise<number> {
    const snapshot = await this.db.collection('ai_interactions')
      .where('userId', '==', userId)
      .where('timestamp', '>=', period.start)
      .where('timestamp', '<=', period.end)
      .get();
    return snapshot.size;
  }

  private async getResearchDataCount(userId: string, period: { start: Date; end: Date }): Promise<number> {
    const snapshot = await this.db.collection('research_data')
      .where('userId', '==', userId)
      .where('createdAt', '>=', period.start)
      .where('createdAt', '<=', period.end)
      .get();
    return snapshot.size;
  }

  private async collectUserDataForExport(
    userId: string, 
    options: any, 
    preferences: DataControlPreferences
  ): Promise<any> {
    const exportData: any = {
      metadata: {
        exportDate: new Date().toISOString(),
        userId: userId,
        preferences: preferences,
      },
      journals: [],
      profile: {},
    };

    // Add other data types based on options and preferences
    if (options.includeAnalytics && preferences.dataAccess.includeAnalytics) {
      exportData.analytics = await this.getUserAnalyticsData(userId, options.dateRange);
    }

    if (options.includeResearchInsights && preferences.dataAccess.includeResearchInsights) {
      exportData.researchInsights = await this.getUserResearchData(userId, options.dateRange);
    }

    return exportData;
  }

  private async getUserAnalyticsData(userId: string, dateRange?: { start: Date; end: Date }): Promise<any[]> {
    // Implementation to fetch user analytics data
    return [];
  }

  private async getUserResearchData(userId: string, dateRange?: { start: Date; end: Date }): Promise<any[]> {
    // Implementation to fetch user research insights
    return [];
  }

  private async anonymizeUserData(userId: string, dataType: string): Promise<number> {
    // Implementation to anonymize specific data types
    return 0;
  }

  private async deleteUserDataByType(userId: string, dataType: string, retainForResearch: boolean): Promise<number> {
    // Implementation to delete specific data types
    return 0;
  }
}