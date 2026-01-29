// Data Retention Service for ALCHM - Implements automated data lifecycle management
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserPrivacySettings } from './privacyTypes';

const db = admin.firestore();

/**
 * Scheduled function to enforce data retention policies
 * Runs daily at 3 AM to clean up expired data
 */
export const enforceDataRetentionPolicies = functions.pubsub.schedule('0 3 * * *').onRun(async () => {
  console.log('Starting data retention policy enforcement...');
  
  try {
    const retentionStats = {
      journalEntriesDeleted: 0,
      analysesDeleted: 0,
      usersProcessed: 0,
      errors: 0
    };

    // Get all users with privacy settings
    const privacySettingsSnapshot = await db.collection('userPrivacySettings').get();
    
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
        
        // Apply automatic deletion if enabled
        if (settings.dataRetention?.automaticDeletion) {
          await applyAutomaticDeletionPolicy(userId, settings);
        }
        
      } catch (error) {
        console.error(`Error processing retention for user ${userId}:`, error);
        retentionStats.errors++;
      }
    }
    
    // Log retention statistics
    await logRetentionActivity(retentionStats);
    
    console.log('Data retention policy enforcement completed:', retentionStats);
    
  } catch (error) {
    console.error('Error in data retention enforcement:', error);
  }
});

/**
 * Apply journal entry retention policy for a specific user
 */
async function applyJournalRetentionPolicy(userId: string, retentionMonths: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
  
  const expiredEntriesSnapshot = await db.collection('journal-entries')
    .where('userId', '==', userId)
    .where('createdAt', '<', cutoffDate)
    .get();
  
  if (expiredEntriesSnapshot.empty) {
    return 0;
  }
  
  const batch = db.batch();
  let deletedCount = 0;
  
  expiredEntriesSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
    deletedCount++;
  });
  
  await batch.commit();
  
  // Log the deletion
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'journal_entries_auto_deleted',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `${deletedCount} journal entries deleted due to ${retentionMonths}-month retention policy`,
    legalBasis: 'legitimate_interest'
  });
  
  return deletedCount;
}

/**
 * Apply AI analysis retention policy for a specific user
 */
async function applyAnalysisRetentionPolicy(userId: string, retentionMonths: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - retentionMonths);
  
  const expiredAnalysesSnapshot = await db.collection('users').doc(userId)
    .collection('analyses')
    .where('analyzedAt', '<', cutoffDate)
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
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'ai_analyses_auto_deleted',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `${deletedCount} AI analyses deleted due to ${retentionMonths}-month retention policy`,
    legalBasis: 'legitimate_interest'
  });
  
  return deletedCount;
}

/**
 * Apply automatic deletion policies for inactive accounts
 */
async function applyAutomaticDeletionPolicy(userId: string, settings: UserPrivacySettings) {
  try {
    // Get user's last activity
    const userLastActivity = await getUserLastActivity(userId);
    const inactivityThreshold = new Date();
    inactivityThreshold.setMonth(inactivityThreshold.getMonth() - 12); // 12 months of inactivity
    
    if (userLastActivity < inactivityThreshold) {
      // Warn user before automatic deletion (would send email in production)
      await createInactivityWarning(userId, userLastActivity);
    }
    
    // Check for accounts that have been warned and are still inactive
    const finalDeletionThreshold = new Date();
    finalDeletionThreshold.setMonth(finalDeletionThreshold.getMonth() - 15); // 15 months total
    
    if (userLastActivity < finalDeletionThreshold) {
      await scheduleAccountForAutomaticDeletion(userId);
    }
    
  } catch (error) {
    console.error(`Error applying automatic deletion policy for user ${userId}:`, error);
  }
}

/**
 * Get user's last activity date
 */
async function getUserLastActivity(userId: string): Promise<Date> {
  // Check last journal entry
  const lastJournalSnapshot = await db.collection('journal-entries')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();
  
  if (!lastJournalSnapshot.empty) {
    return lastJournalSnapshot.docs[0].data().createdAt.toDate();
  }
  
  // Fallback to user auth record
  try {
    const userRecord = await admin.auth().getUser(userId);
    return new Date(userRecord.metadata.lastSignInTime || userRecord.metadata.creationTime);
  } catch (error) {
    // If user record doesn't exist, return very old date
    return new Date(0);
  }
}

/**
 * Create inactivity warning for user
 */
async function createInactivityWarning(userId: string, lastActivity: Date) {
  const existingWarning = await db.collection('inactivityWarnings')
    .where('userId', '==', userId)
    .where('resolved', '==', false)
    .limit(1)
    .get();
  
  if (!existingWarning.empty) {
    return; // Warning already exists
  }
  
  await db.collection('inactivityWarnings').add({
    userId,
    lastActivity,
    warningDate: admin.firestore.FieldValue.serverTimestamp(),
    resolved: false,
    finalDeletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from warning
  });
  
  // Log warning
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'inactivity_warning_issued',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `User warned about account inactivity. Last activity: ${lastActivity.toISOString()}`,
    legalBasis: 'legitimate_interest'
  });
  
  // Send warning email (implement with your email service)
  // await sendInactivityWarningEmail(userId);
}

/**
 * Schedule account for automatic deletion due to extended inactivity
 */
async function scheduleAccountForAutomaticDeletion(userId: string) {
  const existingDeletionRequest = await db.collection('accountDeletionRequests')
    .where('userId', '==', userId)
    .where('status', 'in', ['pending_verification', 'verified', 'processing'])
    .limit(1)
    .get();
  
  if (!existingDeletionRequest.empty) {
    return; // Deletion already scheduled
  }
  
  await db.collection('accountDeletionRequests').add({
    userId,
    userEmail: '', // Will be populated from auth record
    requestedAt: admin.firestore.FieldValue.serverTimestamp(),
    verificationToken: 'AUTO_DELETION',
    verified: true,
    verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    status: 'verified',
    scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days grace
    cancellationDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
    retainForLegal: false,
    automaticDeletion: true,
    reason: 'Extended account inactivity (>15 months)'
  });
  
  // Log automatic deletion scheduling
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'account_scheduled_for_auto_deletion',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: 'Account scheduled for automatic deletion due to extended inactivity',
    legalBasis: 'legitimate_interest'
  });
}

/**
 * Log retention activity statistics
 */
async function logRetentionActivity(stats: any) {
  await db.collection('dataRetentionLogs').add({
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
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  const { userId, forceRetention = false } = data;
  
  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }
  
  try {
    // Get user's privacy settings
    const settingsDoc = await db.collection('userPrivacySettings').doc(userId).get();
    
    if (!settingsDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User privacy settings not found');
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
    await db.collection('privacyAuditLog').add({
      userId,
      action: 'manual_retention_enforcement',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Manual data retention enforced by admin. Deleted: ${results.journalEntriesDeleted} journals, ${results.analysesDeleted} analyses`,
      legalBasis: 'legitimate_interest',
      adminUserId: context.auth.uid
    });
    
    return {
      success: true,
      results
    };
    
  } catch (error) {
    console.error('Error in manual data retention enforcement:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Failed to enforce data retention');
  }
});

/**
 * Update user data retention preferences
 */
export const updateDataRetentionPreferences = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const userId = context.auth.uid;
  const { journalRetentionMonths, analysisRetentionMonths, automaticDeletion } = data;
  
  // Validate retention periods (GDPR allows maximum 5 years for most data)
  if (journalRetentionMonths && (journalRetentionMonths < 0 || journalRetentionMonths > 60)) {
    throw new functions.https.HttpsError('invalid-argument', 'Journal retention must be between 0-60 months');
  }
  
  if (analysisRetentionMonths && (analysisRetentionMonths < 1 || analysisRetentionMonths > 36)) {
    throw new functions.https.HttpsError('invalid-argument', 'Analysis retention must be between 1-36 months');
  }
  
  try {
    const updates: any = {
      'dataRetention.lastUpdated': admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (journalRetentionMonths !== undefined) {
      updates['dataRetention.journalRetentionMonths'] = journalRetentionMonths;
    }
    
    if (analysisRetentionMonths !== undefined) {
      updates['dataRetention.analysisRetentionMonths'] = analysisRetentionMonths;
    }
    
    if (automaticDeletion !== undefined) {
      updates['dataRetention.automaticDeletion'] = automaticDeletion;
    }
    
    await db.collection('userPrivacySettings').doc(userId).update(updates);
    
    // Log the preference update
    await db.collection('privacyAuditLog').add({
      userId,
      action: 'data_retention_preferences_updated',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Updated retention preferences: journal=${journalRetentionMonths}mo, analysis=${analysisRetentionMonths}mo, auto=${automaticDeletion}`,
      legalBasis: 'consent'
    });
    
    return { success: true, message: 'Data retention preferences updated successfully' };
    
  } catch (error) {
    console.error('Error updating data retention preferences:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update retention preferences');
  }
});

/**
 * Get data retention statistics for admin dashboard
 */
export const getDataRetentionStats = functions.https.onCall(async (data, context) => {
  if (!context.auth || !await isAdmin(context.auth.uid)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }
  
  try {
    // Get recent retention logs
    const recentLogsSnapshot = await db.collection('dataRetentionLogs')
      .orderBy('date', 'desc')
      .limit(30)
      .get();
    
    const recentActivity = recentLogsSnapshot.docs.map(doc => ({
      date: doc.data().date.toDate(),
      ...doc.data().stats
    }));
    
    // Get overall statistics
    const totalUsersWithSettings = await db.collection('userPrivacySettings').count().get();
    const usersWithAutoDelete = await db.collection('userPrivacySettings')
      .where('dataRetention.automaticDeletion', '==', true)
      .count().get();
    
    // Get pending inactivity warnings
    const pendingWarnings = await db.collection('inactivityWarnings')
      .where('resolved', '==', false)
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
    console.error('Error getting retention stats:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get retention statistics');
  }
});

/**
 * Helper function to check admin status
 */
async function isAdmin(userId: string): Promise<boolean> {
  try {
    const adminDoc = await db.collection('adminUsers').doc(userId).get();
    return adminDoc.exists && adminDoc.data()?.verified === true;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate monthly data deletion trends
 */
function calculateMonthlyTrends(recentActivity: any[]): any[] {
  const monthlyData: Record<string, any> = {};
  
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
  
  return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));
}

/**
 * Calculate retention compliance metrics
 */
function calculateRetentionCompliance(recentActivity: any[]): any {
  const totalProcessed = recentActivity.reduce((sum, activity) => sum + (activity.usersProcessed || 0), 0);
  const totalErrors = recentActivity.reduce((sum, activity) => sum + (activity.errors || 0), 0);
  
  return {
    successRate: totalProcessed > 0 ? ((totalProcessed - totalErrors) / totalProcessed * 100).toFixed(2) : 100,
    totalUsersProcessed: totalProcessed,
    totalErrors: totalErrors,
    lastRunDate: recentActivity.length > 0 ? recentActivity[0].date : null
  };
}