// Data Retention Service for ALCHM - Implements automated data lifecycle management
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserPrivacySettings } from "./privacyTypes";

const db = admin.firestore();
const AUTOMATED_RETENTION_ENFORCEMENT_ENABLED = false;

type RetentionStats = {
  journalEntriesDeleted: number;
  analysesDeleted: number;
  usersProcessed: number;
  errors: number;
};

type RetentionPreferenceUpdates = {
  "dataRetention.lastUpdated": admin.firestore.FieldValue;
  "dataRetention.journalRetentionMonths"?: number;
  "dataRetention.analysisRetentionMonths"?: number;
  "dataRetention.automaticDeletion"?: boolean;
};

type RetentionActivity = RetentionStats & {
  date: Date;
};

type MonthlyRetentionTrend = {
  month: string;
  journalEntriesDeleted: number;
  analysesDeleted: number;
  usersProcessed: number;
};

type RetentionComplianceMetrics = {
  successRate: string | number;
  totalUsersProcessed: number;
  totalErrors: number;
  lastRunDate: Date | null;
};

/**
 * Scheduled function to enforce data retention policies
 * Runs daily at 3 AM to clean up expired data
 */
export const enforceDataRetentionPolicies = functions.pubsub.schedule("0 3 * * *").onRun(async () => {
  if (!AUTOMATED_RETENTION_ENFORCEMENT_ENABLED) {
    console.info("Automatic retention enforcement is disabled pending verified policy and user controls.");
    return null;
  }

  console.log("Starting data retention policy enforcement...");
  
  try {
    const retentionStats = {
      journalEntriesDeleted: 0,
      analysesDeleted: 0,
      usersProcessed: 0,
      errors: 0
    };

    // Get all users with privacy settings
    const privacySettingsSnapshot = await db.collection("userPrivacySettings").get();
    
    for (const settingsDoc of privacySettingsSnapshot.docs) {
      const settings = settingsDoc.data() as UserPrivacySettings;
      const userId = settingsDoc.id;
      
      try {
        retentionStats.usersProcessed++;
        
        // Apply journal entry retention
        if (settings.dataRetention?.journalRetentionMonths > 0) {
          const journalDeleted = await applyJournalRetentionPolicy(userId, settings.dataRetention.journalRetentionMonths);
          retentionStats.journalEntriesDeleted += journalDeleted;
        }
        
        // Apply analysis retention
        if (settings.dataRetention?.analysisRetentionMonths > 0) {
          const analysesDeleted = await applyAnalysisRetentionPolicy(userId, settings.dataRetention.analysisRetentionMonths);
          retentionStats.analysesDeleted += analysesDeleted;
        }
        
        // Inactivity-driven account deletion is disabled pending clinical and privacy approval.
        if (settings.dataRetention?.automaticDeletion) {
          console.warn(`Automatic inactivity deletion is disabled for user ${userId}`);
        }
        
      } catch (error) {
        console.error(`Error processing retention for user ${userId}:`, error);
        retentionStats.errors++;
      }
    }
    
    // Log retention statistics
    await logRetentionActivity(retentionStats);
    
    console.log("Data retention policy enforcement completed:", retentionStats);
    return null;
    
  } catch (error) {
    console.error("Error in data retention enforcement:", error);
    return null;
  }
});

/**
 * Apply journal entry retention policy for a specific user
 */
async function applyJournalRetentionPolicy(userId: string, retentionMonths: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
  
  const expiredEntriesSnapshot = await db.collection("users").doc(userId)
    .collection("sessions")
    .where("createdAt", "<", cutoffDate)
    .get();
  const expiredLegacyEntriesSnapshot = await db.collection("journal-entries")
    .where("userId", "==", userId)
    .where("createdAt", "<", cutoffDate)
    .get();
  
  if (expiredEntriesSnapshot.empty && expiredLegacyEntriesSnapshot.empty) {
    return 0;
  }
  
  const batch = db.batch();
  let deletedCount = 0;
  
  expiredEntriesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
    deletedCount++;
  });
  expiredLegacyEntriesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
    deletedCount++;
  });
  
  await batch.commit();
  
  // Log the deletion
  await db.collection("privacyAuditLog").add({
    userId,
    action: "journal_entries_auto_deleted",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `${deletedCount} journal entries deleted due to ${retentionMonths}-month retention policy`,
    legalBasis: "legitimate_interest"
  });
  
  return deletedCount;
}

/**
 * Apply AI analysis retention policy for a specific user
 */
async function applyAnalysisRetentionPolicy(userId: string, retentionMonths: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
  
  const expiredAnalysesSnapshot = await db.collection("users").doc(userId)
    .collection("analyses")
    .where("analyzedAt", "<", cutoffDate)
    .get();
  
  if (expiredAnalysesSnapshot.empty) {
    return 0;
  }
  
  const batch = db.batch();
  let deletedCount = 0;
  
  expiredAnalysesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
    deletedCount++;
  });
  
  await batch.commit();
  
  // Log the deletion
  await db.collection("privacyAuditLog").add({
    userId,
    action: "ai_analyses_auto_deleted",
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `${deletedCount} AI analyses deleted due to ${retentionMonths}-month retention policy`,
    legalBasis: "legitimate_interest"
  });
  
  return deletedCount;
}

/**
 * Log retention activity statistics
 */
async function logRetentionActivity(stats: RetentionStats) {
  await db.collection("dataRetentionLogs").add({
    date: admin.firestore.FieldValue.serverTimestamp(),
    stats,
    totalRecordsProcessed: stats.usersProcessed,
    totalDataDeleted: stats.journalEntriesDeleted + stats.analysesDeleted,
    errors: stats.errors
  });
}

/**
 * Manual data retention enforcement for a specific user
 * Can be called by support team or user request
 */
export const enforceUserDataRetention = functions.https.onCall(async (data, context) => {
  // Verify admin authentication for manual enforcement
  if (!context.auth || !await isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }

  const adminUserId = context.auth.uid;

  throw new functions.https.HttpsError(
    "failed-precondition",
    "Manual retention enforcement is unavailable pending verified user authorization and policy review"
  );
  
  const { userId, forceRetention = false } = data;
  
  if (!userId) {
    throw new functions.https.HttpsError("invalid-argument", "User ID is required");
  }
  
  try {
    // Get user's privacy settings
    const settingsDoc = await db.collection("userPrivacySettings").doc(userId).get();
    
    if (!settingsDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User privacy settings not found");
    }
    
    const settings = settingsDoc.data() as UserPrivacySettings;
    
    const results = {
      journalEntriesDeleted: 0,
      analysesDeleted: 0,
      executed: false
    };
    
    if (forceRetention || settings.dataRetention?.automaticDeletion) {
      // Apply journal retention
      if (settings.dataRetention?.journalRetentionMonths > 0) {
        results.journalEntriesDeleted = await applyJournalRetentionPolicy(
          userId, 
          settings.dataRetention.journalRetentionMonths
        );
      }
      
      // Apply analysis retention
      if (settings.dataRetention?.analysisRetentionMonths > 0) {
        results.analysesDeleted = await applyAnalysisRetentionPolicy(
          userId, 
          settings.dataRetention.analysisRetentionMonths
        );
      }
      
      results.executed = true;
    }
    
    // Log manual enforcement
    await db.collection("privacyAuditLog").add({
      userId,
      action: "manual_retention_enforcement",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Manual data retention enforced by admin. Deleted: ${results.journalEntriesDeleted} journals, ${results.analysesDeleted} analyses`,
      legalBasis: "legitimate_interest",
      adminUserId
    });
    
    return {
      success: true,
      results
    };
    
  } catch (error) {
    console.error("Error in manual data retention enforcement:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError("internal", "Failed to enforce data retention");
  }
});

/**
 * Update user data retention preferences
 */
export const updateDataRetentionPreferences = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }
  
  const userId = context.auth.uid;
  const { journalRetentionMonths, analysisRetentionMonths, automaticDeletion } = data;

  if (automaticDeletion === true) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Automatic deletion is unavailable pending privacy and clinical review"
    );
  }
  
  // Validate retention periods (GDPR allows maximum 5 years for most data)
  if (journalRetentionMonths && (journalRetentionMonths < 0 || journalRetentionMonths > 60)) {
    throw new functions.https.HttpsError("invalid-argument", "Journal retention must be between 0-60 months");
  }
  
  if (analysisRetentionMonths && (analysisRetentionMonths < 1 || analysisRetentionMonths > 36)) {
    throw new functions.https.HttpsError("invalid-argument", "Analysis retention must be between 1-36 months");
  }
  
  try {
    const updates: RetentionPreferenceUpdates = {
      "dataRetention.lastUpdated": admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (journalRetentionMonths !== undefined) {
      updates["dataRetention.journalRetentionMonths"] = journalRetentionMonths;
    }
    
    if (analysisRetentionMonths !== undefined) {
      updates["dataRetention.analysisRetentionMonths"] = analysisRetentionMonths;
    }
    
    if (automaticDeletion !== undefined) {
      updates["dataRetention.automaticDeletion"] = automaticDeletion;
    }
    
    await db.collection("userPrivacySettings").doc(userId).update(updates);
    
    // Log the preference update
    await db.collection("privacyAuditLog").add({
      userId,
      action: "data_retention_preferences_updated",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Updated retention preferences: journal=${journalRetentionMonths}mo, analysis=${analysisRetentionMonths}mo, auto=${automaticDeletion}`,
      legalBasis: "consent"
    });
    
    return { success: true, message: "Data retention preferences updated successfully" };
    
  } catch (error) {
    console.error("Error updating data retention preferences:", error);
    throw new functions.https.HttpsError("internal", "Failed to update retention preferences");
  }
});

/**
 * Get data retention statistics for admin dashboard
 */
export const getDataRetentionStats = functions.https.onCall(async (data, context) => {
  if (!context.auth || !await isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError("permission-denied", "Admin access required");
  }
  
  try {
    // Get recent retention logs
    const recentLogsSnapshot = await db.collection("dataRetentionLogs")
      .orderBy("date", "desc")
      .limit(30)
      .get();
    
    const recentActivity = recentLogsSnapshot.docs.map(doc => ({
      date: doc.data().date.toDate(),
      ...doc.data().stats
    }));
    
    // Get overall statistics
    const totalUsersWithSettings = await db.collection("userPrivacySettings").count().get();
    const usersWithAutoDelete = await db.collection("userPrivacySettings")
      .where("dataRetention.automaticDeletion", "==", true)
      .count().get();
    
    // Get pending inactivity warnings
    const pendingWarnings = await db.collection("inactivityWarnings")
      .where("resolved", "==", false)
      .count().get();
    
    return {
      overview: {
        totalUsersWithSettings: totalUsersWithSettings.data().count,
        usersWithAutoDelete: usersWithAutoDelete.data().count,
        pendingInactivityWarnings: pendingWarnings.data().count
      },
      recentActivity: recentActivity.slice(0, 7), // Last 7 days
      trends: {
        monthlyDataDeleted: calculateMonthlyTrends(recentActivity),
        retentionCompliance: calculateRetentionCompliance(recentActivity)
      }
    };
    
  } catch (error) {
    console.error("Error getting retention stats:", error);
    throw new functions.https.HttpsError("internal", "Failed to get retention statistics");
  }
});

/**
 * Helper function to check admin status
 */
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await db.collection("adminUsers").doc(userId).get();
    return adminDoc.exists && adminDoc.data()?.verified === true;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate monthly data deletion trends
 */
function calculateMonthlyTrends(recentActivity: RetentionActivity[]): MonthlyRetentionTrend[] {
  const monthlyData: Record<string, MonthlyRetentionTrend> = {};
  
  recentActivity.forEach(activity => {
    const monthKey = activity.date.toISOString().substring(0, 7); // YYYY-MM
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        journalEntriesDeleted: 0,
        analysesDeleted: 0,
        usersProcessed: 0
      };
    }
    
    monthlyData[monthKey].journalEntriesDeleted += activity.journalEntriesDeleted || 0;
    monthlyData[monthKey].analysesDeleted += activity.analysesDeleted || 0;
    monthlyData[monthKey].usersProcessed += activity.usersProcessed || 0;
  });
  
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Calculate retention compliance metrics
 */
function calculateRetentionCompliance(recentActivity: RetentionActivity[]): RetentionComplianceMetrics {
  const totalProcessed = recentActivity.reduce((sum, activity) => sum + (activity.usersProcessed || 0), 0);
  const totalErrors = recentActivity.reduce((sum, activity) => sum + (activity.errors || 0), 0);
  
  return {
    successRate: totalProcessed > 0 ? ((totalProcessed - totalErrors) / totalProcessed * 100).toFixed(2) : 100,
    totalUsersProcessed: totalProcessed,
    totalErrors: totalErrors,
    lastRunDate: recentActivity.length > 0 ? recentActivity[0].date : null
  };
}
