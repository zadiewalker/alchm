// Audit Trail Service for ALCHM - Comprehensive logging of privacy-related activities
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { PrivacyAuditLog } from "./privacyTypes";

const db = admin.firestore();

/**
 * Enhanced audit logging function with automatic categorization and risk assessment
 */
export async function logPrivacyAction(auditData: {
  userId: string;
  action: string;
  timestamp?: Date;
  details: Record<string, any>;
  legalBasis: string;
  ipAddress?: string;
  userAgent?: string;
  adminUserId?: string;
  dataCategories?: string[];
  riskLevel?: "low" | "medium" | "high";
  complianceNotes?: string;
}) {
  try {
    const logEntry: Partial<PrivacyAuditLog> = {
      userId: auditData.userId,
      action: auditData.action as any,
      timestamp: admin.firestore.FieldValue.serverTimestamp() as any,
      details: auditData.details,
      legalBasis: auditData.legalBasis as any,
      ipAddress: auditData.ipAddress,
      userAgent: auditData.userAgent
    };

    // Add risk assessment based on action type
    logEntry.riskLevel = assessActionRisk(auditData.action);
    
    // Add compliance tags
    logEntry.complianceTags = generateComplianceTags(auditData.action, auditData.legalBasis);
    
    // Store in audit log collection
    const auditRef = await db.collection("privacyAuditLog").add(logEntry);
    
    // For high-risk actions, create immediate alerts
    if (logEntry.riskLevel === "high") {
      await createHighRiskAlert(auditRef.id, auditData);
    }
    
    // Update user's audit summary
    await updateUserAuditSummary(auditData.userId, auditData.action);
    
    return auditRef.id;
    
  } catch (error) {
    console.error("Error logging privacy action:", error);
    // Audit logging failures are critical - attempt backup logging
    await attemptBackupAuditLog(auditData, error);
    throw error;
  }
}

/**
 * Assess risk level of privacy-related actions
 */
function assessActionRisk(action: string): "low" | "medium" | "high" {
  const highRiskActions = [
    "account_deletion_completed",
    "data_breach_detected",
    "unauthorized_access_attempt",
    "admin_data_access",
    "legal_request_fulfilled",
    "data_shared_externally"
  ];
  
  const mediumRiskActions = [
    "account_deletion_requested",
    "data_exported",
    "consent_withdrawn",
    "privacy_settings_updated",
    "admin_account_created"
  ];
  
  if (highRiskActions.includes(action)) return "high";
  if (mediumRiskActions.includes(action)) return "medium";
  return "low";
}

/**
 * Generate compliance tags for audit entries
 */
function generateComplianceTags(action: string, legalBasis: string): string[] {
  const tags = ["privacy_audit"];
  
  // Add GDPR-specific tags
  if (legalBasis === "consent") tags.push("gdpr_article_6_1_a");
  if (legalBasis === "legitimate_interest") tags.push("gdpr_article_6_1_f");
  if (legalBasis === "vital_interests") tags.push("gdpr_article_6_1_d");
  if (legalBasis === "legal_obligation") tags.push("gdpr_article_6_1_c");
  
  // Add action-specific tags
  if (action.includes("data_export")) tags.push("gdpr_article_20", "data_portability");
  if (action.includes("deletion")) tags.push("gdpr_article_17", "right_to_erasure");
  if (action.includes("consent")) tags.push("gdpr_article_7", "consent_management");
  if (action.includes("breach")) tags.push("gdpr_article_33", "breach_notification");
  
  return tags;
}

/**
 * Create high-risk alerts for immediate attention
 */
async function createHighRiskAlert(auditId: string, auditData: any) {
  await db.collection("privacyAlerts").add({
    auditId,
    alertType: "high_risk_action",
    action: auditData.action,
    userId: auditData.userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "open",
    severity: "high",
    requiresReview: true,
    details: auditData.details
  });
}

/**
 * Update user's audit activity summary
 */
async function updateUserAuditSummary(userId: string, action: string) {
  const summaryRef = db.collection("userAuditSummaries").doc(userId);
  
  await summaryRef.set({
    lastActivity: admin.firestore.FieldValue.serverTimestamp(),
    totalActions: admin.firestore.FieldValue.increment(1),
    [`actionCounts.${action}`]: admin.firestore.FieldValue.increment(1),
    lastAction: action
  }, { merge: true });
}

/**
 * Backup audit logging in case primary logging fails
 */
async function attemptBackupAuditLog(auditData: any, error: any) {
  try {
    await db.collection("auditLogBackup").add({
      ...auditData,
      originalError: error.message,
      backupTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      requiresManualReview: true
    });
  } catch (backupError) {
    console.error("Backup audit logging also failed:", backupError);
    // In a production system, you might want to write to a different system or alert administrators
  }
}

/**
 * Get comprehensive audit trail for a specific user
 */
export const getUserAuditTrail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  const requestingUserId = context.auth.uid;
  const { userId, startDate, endDate, actionTypes, limit = 100 } = data;

  // Users can only view their own audit trail, unless they're admins
  if (userId !== requestingUserId && !await isAdmin(requestingUserId)) {
    throw new functions.https.HttpsError("permission-denied", "Can only access own audit trail");
  }

  try {
    let query = db.collection("privacyAuditLog")
      .where("userId", "==", userId)
      .orderBy("timestamp", "desc")
      .limit(Math.min(limit, 1000)); // Cap at 1000 records

    // Apply date filters if provided
    if (startDate) {
      query = query.where("timestamp", ">=", new Date(startDate));
    }
    if (endDate) {
      query = query.where("timestamp", "<=", new Date(endDate));
    }

    const auditSnapshot = await query.get();
    
    const auditTrail = auditSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        action: data.action,
        timestamp: data.timestamp.toDate(),
        details: data.details,
        legalBasis: data.legalBasis,
        riskLevel: data.riskLevel,
        complianceTags: data.complianceTags || [],
        ipAddress: data.ipAddress ? maskIP(data.ipAddress) : undefined // Mask IP for privacy
      };
    });

    // Filter by action types if specified
    const filteredTrail = actionTypes ? 
      auditTrail.filter(entry => actionTypes.includes(entry.action)) : 
      auditTrail;

    // Get audit summary
    const summaryDoc = await db.collection("userAuditSummaries").doc(userId).get();
    const summary = summaryDoc.exists ? summaryDoc.data() : {};

    return {
      auditTrail: filteredTrail,
      summary: {
        totalRecords: auditTrail.length,
        dateRange: {
          earliest: auditTrail.length > 0 ? auditTrail[auditTrail.length - 1].timestamp : null,
          latest: auditTrail.length > 0 ? auditTrail[0].timestamp : null
        },
        actionCounts: summary?.actionCounts || {},
        lastActivity: summary?.lastActivity?.toDate()
      }
    };

  } catch (error) {
    console.error("Error getting audit trail:", error);
    throw new functions.https.HttpsError("internal", "Failed to retrieve audit trail");
  }
});

/**
 * Generate compliance audit report for admins
 */
export const generateComplianceAuditReport = functions.https.onCall(async (data, context) => {
  if (!context.auth || !await isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  const { startDate, endDate } = data;

  try {
    // Get audit logs for the specified period
    let query = db.collection("privacyAuditLog")
      .orderBy("timestamp", "desc");

    if (startDate) query = query.where("timestamp", ">=", new Date(startDate));
    if (endDate) query = query.where("timestamp", "<=", new Date(endDate));

    const auditSnapshot = await query.get();
    const auditLogs = auditSnapshot.docs.map(doc => doc.data());

    // Analyze compliance metrics
    const complianceReport = {
      period: { startDate, endDate },
      overview: {
        totalAuditEntries: auditLogs.length,
        uniqueUsers: new Set(auditLogs.map(log => log.userId)).size,
        highRiskActions: auditLogs.filter(log => log.riskLevel === "high").length
      },
      gdprCompliance: {
        consentActions: auditLogs.filter(log => log.complianceTags?.includes("consent_management")).length,
        dataPortabilityRequests: auditLogs.filter(log => log.complianceTags?.includes("data_portability")).length,
        erasureRequests: auditLogs.filter(log => log.complianceTags?.includes("right_to_erasure")).length,
        breachNotifications: auditLogs.filter(log => log.complianceTags?.includes("breach_notification")).length
      },
      actionBreakdown: getActionBreakdown(auditLogs),
      legalBasisAnalysis: getLegalBasisAnalysis(auditLogs),
      riskAssessment: getRiskAssessment(auditLogs),
      recommendations: generateComplianceRecommendations(auditLogs)
    };

    // Log the report generation
    await logPrivacyAction({
      userId: context.auth.uid,
      action: "compliance_audit_report_generated",
      details: {
        message: "Generated compliance audit report",
        startDate,
        endDate,
        reportType: "compliance_audit"
      },
      legalBasis: "legal_obligation"
    });

    return complianceReport;

  } catch (error) {
    console.error("Error generating compliance audit report:", error);
    throw new functions.https.HttpsError("internal", "Failed to generate audit report");
  }
});

/**
 * Detect anomalous privacy-related activities
 */
export const detectAuditAnomalies = functions.pubsub.schedule("0 6 * * *").onRun(async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentAuditsSnapshot = await db.collection("privacyAuditLog")
      .where("timestamp", ">=", yesterday)
      .get();
    
    const auditLogs = recentAuditsSnapshot.docs.map(doc => doc.data());
    
    // Detect potential anomalies
    const anomalies = [];
    
    // Unusual deletion request patterns
    const deletionRequests = auditLogs.filter(log => log.action === "account_deletion_requested");
    if (deletionRequests.length > 10) { // Threshold for unusual deletion activity
      anomalies.push({
        type: "unusual_deletion_volume",
        severity: "medium",
        count: deletionRequests.length,
        description: "Higher than normal account deletion requests"
      });
    }
    
    // Multiple export requests from same IP
    const exportsByIP: Record<string, number> = {};
    auditLogs.filter(log => log.action === "data_exported" && log.ipAddress)
      .forEach(log => {
        exportsByIP[log.ipAddress!] = (exportsByIP[log.ipAddress!] || 0) + 1;
      });
    
    Object.entries(exportsByIP).forEach(([ip, count]) => {
      if (count > 5) {
        anomalies.push({
          type: "multiple_exports_same_ip",
          severity: "high",
          ip: maskIP(ip),
          count,
          description: "Multiple data export requests from same IP address"
        });
      }
    });
    
    // Rapid consent changes
    const consentChanges = auditLogs.filter(log => 
      log.action.includes("consent_") && (log.action.includes("withdrawn") || log.action.includes("updated"))
    );
    
    const userConsentChanges: Record<string, number> = {};
    consentChanges.forEach(log => {
      userConsentChanges[log.userId] = (userConsentChanges[log.userId] || 0) + 1;
    });
    
    Object.entries(userConsentChanges).forEach(([, count]) => {
      if (count > 3) {
        anomalies.push({
          type: "rapid_consent_changes",
          severity: "medium",
          userId: "[REDACTED]", // Don't include actual user ID in alerts
          count,
          description: "User made multiple consent changes in short period"
        });
      }
    });
    
    // Store anomaly detection results
    if (anomalies.length > 0) {
      await db.collection("auditAnomalies").add({
        detectionDate: admin.firestore.FieldValue.serverTimestamp(),
        period: yesterday.toISOString(),
        anomaliesDetected: anomalies,
        totalAuditLogs: auditLogs.length,
        requiresReview: anomalies.some(a => a.severity === "high")
      });
      
      console.log(`Detected ${anomalies.length} audit anomalies for ${yesterday.toISOString()}`);
    }
    
  } catch (error) {
    console.error("Error in anomaly detection:", error);
  }
});

/**
 * Helper functions for compliance analysis
 */
function getActionBreakdown(auditLogs: any[]) {
  const breakdown: Record<string, number> = {};
  auditLogs.forEach(log => {
    breakdown[log.action] = (breakdown[log.action] || 0) + 1;
  });
  return Object.entries(breakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10); // Top 10 actions
}

function getLegalBasisAnalysis(auditLogs: any[]) {
  const analysis: Record<string, number> = {};
  auditLogs.forEach(log => {
    analysis[log.legalBasis] = (analysis[log.legalBasis] || 0) + 1;
  });
  return analysis;
}

function getRiskAssessment(auditLogs: any[]) {
  return {
    low: auditLogs.filter(log => log.riskLevel === "low").length,
    medium: auditLogs.filter(log => log.riskLevel === "medium").length,
    high: auditLogs.filter(log => log.riskLevel === "high").length
  };
}

function generateComplianceRecommendations(auditLogs: any[]): string[] {
  const recommendations = [];
  
  const highRiskCount = auditLogs.filter(log => log.riskLevel === "high").length;
  if (highRiskCount > auditLogs.length * 0.1) { // More than 10% high risk
    recommendations.push("Review high-risk activities - unusually high proportion of high-risk privacy actions");
  }
  
  const consentWithdrawals = auditLogs.filter(log => log.action.includes("consent_withdrawn")).length;
  if (consentWithdrawals > 20) {
    recommendations.push("Investigate consent withdrawal patterns - consider improving consent experience");
  }
  
  const deletionRequests = auditLogs.filter(log => log.action.includes("deletion_requested")).length;
  if (deletionRequests > 10) {
    recommendations.push("Review account deletion trends - may indicate user experience issues");
  }
  
  return recommendations.length > 0 ? recommendations : ["No compliance concerns identified"];
}

/**
 * Helper functions
 */
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await db.collection("adminUsers").doc(userId).get();
    return adminDoc.exists && adminDoc.data()?.verified === true;
  } catch (error) {
    return false;
  }
}

function maskIP(ip: string): string {
  const parts = ip.split(".");
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.xxx.xxx`;
  }
  return "xxx.xxx.xxx.xxx";
}
