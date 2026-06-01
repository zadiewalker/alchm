// Privacy & GDPR Compliance Types for ALCHM
export interface UserPrivacySettings {
  userId: string;
  dataProcessingConsent: {
    journalAnalysis: boolean;
    aiInsights: boolean;
    crisisMonitoring: boolean;
    analyticsParticipation: boolean;
    consentDate: Date;
    consentVersion: string;
  };
  dataRetention: {
    journalRetentionMonths: number; // 0 = indefinite, max 60 per GDPR
    analysisRetentionMonths: number;
    automaticDeletion: boolean;
  };
  dataSharing: {
    allowAnonymizedResearch: boolean;
    allowTrendAnalysis: boolean;
    allowSystemImprovement: boolean;
  };
  communication: {
    privacyUpdates: boolean;
    dataProcessingNotifications: boolean;
    breachNotifications: boolean;
  };
  createdAt: Date;
  lastUpdated: Date;
}

export interface DataExportRequest {
  id: string;
  userId: string;
  requestedAt: Date;
  status: "pending" | "processing" | "ready" | "completed" | "failed";
  formats: ("json" | "csv" | "pdf")[];
  includeAnalyses: boolean;
  includeMetadata: boolean;
  downloadUrl?: string;
  expiresAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
}

export interface AccountDeletionRequest {
  id: string;
  userId: string;
  userEmail: string;
  requestedAt: Date;
  verificationToken: string;
  verified: boolean;
  verifiedAt?: Date;
  status: "pending_verification" | "verified" | "processing" | "completed" | "cancelled";
  scheduledDeletionDate: Date;
  completedAt?: Date;
  retainForLegal: boolean;
  legalRetentionPeriod?: number; // months
  cancellationDeadline: Date; // 30 days grace period
}

export interface UserDataSnapshot {
  profile: {
    uid: string;
    email: string;
    createdAt: Date;
    lastLogin: Date;
  };
  journalEntries: Array<{
    id: string;
    content: string;
    createdAt: Date;
    wordCount: number;
    kheperaResponse?: string;
    seed?: string;
    emotionalTone?: string;
    themes?: string[];
    reflectionTiming?: string;
  }>;
  aiAnalyses: Array<{
    id: string;
    journalEntryId: string;
    analysisDate: Date;
    emotionalThemes: string[];
    insights: string;
    crisisLevel: string;
  }>;
  kheperaMemory: Array<{
    id: string;
    data: Record<string, unknown>;
  }>;
  delayedReflections: Array<{
    id: string;
    data: Record<string, unknown>;
  }>;
  continuityRecords: {
    containers: Array<{
      id: string;
      data: Record<string, unknown>;
    }>;
    activeContainerState: Array<{
      id: string;
      data: Record<string, unknown>;
    }>;
  };
  privacySettings: UserPrivacySettings;
  systemInteractions: {
    totalSessions: number;
    totalJournalEntries: number;
    firstEntry: Date;
    lastActivity: Date;
  };
  exportMetadata: {
    exportDate: Date;
    exportVersion: string;
    dataProcessingBasis: string;
    retentionPolicies: string;
  };
}

export interface PrivacyAuditLog {
  id: string;
  userId: string;
  action: "consent_given" | "consent_withdrawn" | "data_exported" | "data_deleted" |
          "privacy_settings_updated" | "account_deletion_requested" | "data_breach_notified" |
          "data_access_requested" | "data_correction_made" | "data_portability_exercised";
  timestamp: Date;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  legalBasis: "consent" | "legitimate_interest" | "legal_obligation" | "vital_interests" |
             "public_task" | "contract";
  riskLevel?: "low" | "medium" | "high";
  complianceTags?: string[];
}

export interface DataProcessingRecord {
  id: string;
  dataCategory: "user_profile" | "journal_content" | "ai_analysis" | "crisis_data" |
                "system_analytics" | "communication_preferences";
  processingPurpose: string;
  legalBasis: string;
  dataTypes: string[];
  storageLocation: string;
  retentionPeriod: string;
  recipientCategories: string[];
  internationalTransfers: boolean;
  safeguards: string[];
  lastReviewed: Date;
}

export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: "initial_signup" | "ai_analysis" | "crisis_monitoring" | "analytics" |
               "marketing" | "research_participation";
  granted: boolean;
  timestamp: Date;
  consentMethod: "signup_form" | "privacy_dashboard" | "email_confirmation" | "in_app_popup";
  consentText: string;
  consentVersion: string;
  withdrawnAt?: Date;
  withdrawalMethod?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface DataBreachNotification {
  id: string;
  incidentDate: Date;
  discoveredDate: Date;
  reportedToAuthority: boolean;
  authorityReportDate?: Date;
  affectedUsers: number;
  dataCategories: string[];
  riskLevel: "low" | "medium" | "high";
  mitigationSteps: string[];
  userNotificationRequired: boolean;
  userNotificationDate?: Date;
  resolved: boolean;
  resolvedDate?: Date;
}

export interface PrivacyImpactAssessment {
  id: string;
  feature: string;
  assessmentDate: Date;
  dataTypes: string[];
  processingOperations: string[];
  riskLevel: "low" | "medium" | "high";
  riskMitigations: string[];
  legalBasis: string;
  reviewDate: Date;
  approved: boolean;
  approvedBy: string;
}

export interface DataMinimizationRule {
  id: string;
  dataType: string;
  collectionJustification: string;
  minimumRequired: string[];
  automaticDeletion: {
    enabled: boolean;
    deleteAfterDays: number;
    exceptions: string[];
  };
  anonymization: {
    enabled: boolean;
    anonymizeAfterDays: number;
    method: "hash" | "aggregate" | "remove";
  };
  lastReviewed: Date;
}
