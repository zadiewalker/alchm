// Consent Management Service for ALCHM - Handles GDPR consent requirements
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// ConsentRecord type is used in function implementations but not directly imported

const db = admin.firestore();

/**
 * Check if user has valid consent for a specific data processing activity
 * This is called before any data processing operation
 */
export const checkUserConsent = async (userId: string, consentType: string): Promise<boolean> => {
  try {
    // Get user's current privacy settings
    const privacyDoc = await db.collection('userPrivacySettings').doc(userId).get();
    
    if (!privacyDoc.exists) {
      return false; // No consent recorded
    }
    
    const privacyData = privacyDoc.data();
    const consent = privacyData?.dataProcessingConsent;
    
    if (!consent) {
      return false;
    }
    
    // Check specific consent types
    switch (consentType) {
      case 'ai_analysis':
        return consent.journalAnalysis === true;
      case 'crisis_monitoring':
        return consent.crisisMonitoring === true;
      case 'analytics':
        return consent.analyticsParticipation === true;
      case 'research':
        return consent.researchParticipation === true;
      case 'communication':
        return consent.communicationPreferences === true;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking user consent:', error);
    return false; // Fail safe - deny if cannot verify
  }
};

/**
 * Internal function to validate consent for AI analysis
 * This is called directly by other services
 */
export async function validateConsentForAIAnalysisInternal(userId: string, journalEntryId: string) {
  try {
    // Check AI analysis consent
    const hasAIConsent = await checkUserConsent(userId, 'ai_analysis');
    
    if (!hasAIConsent) {
      return {
        allowed: false,
        reason: 'User has not consented to AI analysis of journal entries',
        alternativeAction: 'offer_consent_update'
      };
    }

    // Check crisis monitoring consent (separate from AI analysis)
    const hasCrisisConsent = await checkUserConsent(userId, 'crisis_monitoring');

    // Log consent validation
    await db.collection('consentValidationLog').add({
      userId,
      action: 'ai_analysis_consent_validated',
      journalEntryId,
      aiAnalysisConsent: hasAIConsent,
      crisisMonitoringConsent: hasCrisisConsent,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      allowed: true,
      aiAnalysisEnabled: hasAIConsent,
      crisisMonitoringEnabled: hasCrisisConsent,
      consentValidatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error validating consent for AI analysis:', error);
    throw error;
  }
}

/**
 * Validate consent before AI analysis processing (Cloud Function endpoint)
 * This is called by the AI service before analyzing journal entries
 */
export const validateConsentForAIAnalysis = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { journalEntryId } = data;

  try {
    // Check AI analysis consent
    const hasAIConsent = await checkUserConsent(userId, 'ai_analysis');
    
    if (!hasAIConsent) {
      return {
        allowed: false,
        reason: 'User has not consented to AI analysis of journal entries',
        alternativeAction: 'offer_consent_update'
      };
    }

    // Check crisis monitoring consent (separate from AI analysis)
    const hasCrisisConsent = await checkUserConsent(userId, 'crisis_monitoring');

    // Log consent validation
    await db.collection('consentValidationLog').add({
      userId,
      action: 'ai_analysis_consent_validated',
      journalEntryId,
      aiAnalysisConsent: hasAIConsent,
      crisisMonitoringConsent: hasCrisisConsent,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return {
      allowed: true,
      aiAnalysisEnabled: hasAIConsent,
      crisisMonitoringEnabled: hasCrisisConsent,
      consentValidatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error validating consent for AI analysis:', error);
    throw new functions.https.HttpsError('internal', 'Failed to validate consent');
  }
});

/**
 * Record consent withdrawal and trigger immediate data processing cessation
 */
export const withdrawConsent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { consentTypes, reason } = data;

  if (!consentTypes || !Array.isArray(consentTypes)) {
    throw new functions.https.HttpsError('invalid-argument', 'consentTypes must be an array');
  }

  try {
    // Record consent withdrawal for each type
    const withdrawalPromises = consentTypes.map((consentType: string) => {
      return db.collection('consentRecords').add({
        userId,
        consentType,
        granted: false,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        consentMethod: 'withdrawal_request',
        consentText: `User withdrew consent for ${consentType}`,
        consentVersion: '1.1',
        withdrawnAt: admin.firestore.FieldValue.serverTimestamp(),
        withdrawalMethod: 'user_interface',
        withdrawalReason: reason || 'User requested'
      });
    });

    await Promise.all(withdrawalPromises);

    // Update privacy settings to reflect withdrawal
    const settingsUpdate: any = {
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    consentTypes.forEach((consentType: string) => {
      switch (consentType) {
        case 'ai_analysis':
          settingsUpdate['dataProcessingConsent.journalAnalysis'] = false;
          settingsUpdate['dataProcessingConsent.aiInsights'] = false;
          break;
        case 'crisis_monitoring':
          settingsUpdate['dataProcessingConsent.crisisMonitoring'] = false;
          break;
        case 'analytics':
          settingsUpdate['dataProcessingConsent.analyticsParticipation'] = false;
          break;
        case 'research':
          settingsUpdate['dataProcessingConsent.researchParticipation'] = false;
          break;
        case 'communication':
          settingsUpdate['dataProcessingConsent.communicationPreferences'] = false;
          break;
      }
    });

    await db.collection('userPrivacySettings').doc(userId).update(settingsUpdate);

    // Log the withdrawal in audit trail
    await db.collection('privacyAuditLog').add({
      userId,
      action: 'consent_withdrawn',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `User withdrew consent for: ${consentTypes.join(', ')}. Reason: ${reason || 'Not specified'}`,
      legalBasis: 'consent',
      ipAddress: context.rawRequest?.ip,
      userAgent: context.rawRequest?.headers?.['user-agent']
    });

    // Trigger immediate cessation of relevant data processing
    await triggerDataProcessingCessation(userId, consentTypes);

    return {
      success: true,
      message: 'Consent withdrawn successfully. Data processing has been stopped immediately.',
      withdrawnConsentTypes: consentTypes,
      effectiveDate: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error withdrawing consent:', error);
    throw new functions.https.HttpsError('internal', 'Failed to withdraw consent');
  }
});

/**
 * Immediately stop data processing when consent is withdrawn
 */
async function triggerDataProcessingCessation(userId: string, consentTypes: string[]) {
  try {
    // Mark user for cessation of specific processing activities
    const cessationDoc = {
      userId,
      cessationDate: admin.firestore.FieldValue.serverTimestamp(),
      affectedProcessing: consentTypes,
      status: 'active'
    };

    await db.collection('dataProcessingCessation').add(cessationDoc);

    // For AI analysis withdrawal, mark future analyses as disabled
    if (consentTypes.includes('ai_analysis')) {
      await db.collection('aiProcessingDisabled').doc(userId).set({
        disabledAt: admin.firestore.FieldValue.serverTimestamp(),
        reason: 'consent_withdrawn'
      });
    }

    // For analytics withdrawal, add to analytics opt-out list
    if (consentTypes.includes('analytics')) {
      await db.collection('analyticsOptOut').doc(userId).set({
        optedOutAt: admin.firestore.FieldValue.serverTimestamp(),
        reason: 'consent_withdrawn'
      });
    }

    console.log(`Data processing cessation triggered for user ${userId} for: ${consentTypes.join(', ')}`);

  } catch (error) {
    console.error('Error triggering data processing cessation:', error);
    throw error;
  }
}

/**
 * Re-grant consent (user can change their mind)
 */
export const regrantConsent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;
  const { consentTypes, consentDetails } = data;

  try {
    // Record new consent grants
    const consentPromises = consentTypes.map((consentType: string) => {
      return db.collection('consentRecords').add({
        userId,
        consentType,
        granted: true,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        consentMethod: 'regrant_request',
        consentText: consentDetails?.[consentType] || `User re-granted consent for ${consentType}`,
        consentVersion: '1.1'
      });
    });

    await Promise.all(consentPromises);

    // Update privacy settings
    const settingsUpdate: any = {
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    };

    consentTypes.forEach((consentType: string) => {
      switch (consentType) {
        case 'ai_analysis':
          settingsUpdate['dataProcessingConsent.journalAnalysis'] = true;
          settingsUpdate['dataProcessingConsent.aiInsights'] = true;
          break;
        case 'crisis_monitoring':
          settingsUpdate['dataProcessingConsent.crisisMonitoring'] = true;
          break;
        case 'analytics':
          settingsUpdate['dataProcessingConsent.analyticsParticipation'] = true;
          break;
        case 'research':
          settingsUpdate['dataProcessingConsent.researchParticipation'] = true;
          break;
        case 'communication':
          settingsUpdate['dataProcessingConsent.communicationPreferences'] = true;
          break;
      }
    });

    await db.collection('userPrivacySettings').doc(userId).update(settingsUpdate);

    // Remove cessation flags
    await removeDataProcessingCessation(userId, consentTypes);

    // Log the re-grant
    await db.collection('privacyAuditLog').add({
      userId,
      action: 'consent_regranted',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `User re-granted consent for: ${consentTypes.join(', ')}`,
      legalBasis: 'consent'
    });

    return {
      success: true,
      message: 'Consent re-granted successfully. Data processing will resume.',
      regrantedConsentTypes: consentTypes
    };

  } catch (error) {
    console.error('Error re-granting consent:', error);
    throw new functions.https.HttpsError('internal', 'Failed to re-grant consent');
  }
});

/**
 * Remove data processing cessation flags when consent is re-granted
 */
async function removeDataProcessingCessation(userId: string, consentTypes: string[]) {
  try {
    // Remove AI processing disabled flag
    if (consentTypes.includes('ai_analysis')) {
      await db.collection('aiProcessingDisabled').doc(userId).delete();
    }

    // Remove analytics opt-out
    if (consentTypes.includes('analytics')) {
      await db.collection('analyticsOptOut').doc(userId).delete();
    }

    // Mark cessation records as resolved
    const cessationSnapshot = await db.collection('dataProcessingCessation')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .get();

    const batch = db.batch();
    cessationSnapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        status: 'resolved',
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
        resolvedConsentTypes: consentTypes
      });
    });

    await batch.commit();

  } catch (error) {
    console.error('Error removing data processing cessation:', error);
    throw error;
  }
}

/**
 * Get user's complete consent history for transparency
 */
export const getUserConsentHistory = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    // Get consent records ordered by timestamp
    const consentRecordsSnapshot = await db.collection('consentRecords')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .get();

    const consentHistory = consentRecordsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        consentType: data.consentType,
        granted: data.granted,
        timestamp: data.timestamp.toDate(),
        method: data.consentMethod,
        version: data.consentVersion,
        withdrawnAt: data.withdrawnAt?.toDate(),
        withdrawalMethod: data.withdrawalMethod
      };
    });

    // Get current consent status
    const currentSettingsDoc = await db.collection('userPrivacySettings').doc(userId).get();
    const currentSettings = currentSettingsDoc.data()?.dataProcessingConsent || {};

    return {
      currentConsents: {
        aiAnalysis: currentSettings.journalAnalysis || false,
        crisisMonitoring: currentSettings.crisisMonitoring || false,
        analytics: currentSettings.analyticsParticipation || false,
        research: currentSettings.researchParticipation || false,
        communication: currentSettings.communicationPreferences || false
      },
      consentHistory,
      lastUpdated: currentSettingsDoc.data()?.lastUpdated?.toDate(),
      totalConsentRecords: consentHistory.length
    };

  } catch (error) {
    console.error('Error getting consent history:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get consent history');
  }
});

/**
 * Scheduled function to check for consent expiry (GDPR requires periodic re-consent)
 * Runs weekly to check for consents older than 24 months
 */
export const checkConsentExpiry = functions.pubsub.schedule('0 9 * * MON').onRun(async () => {
  const expiryThreshold = new Date();
  expiryThreshold.setMonth(expiryThreshold.getMonth() - 24); // 24 months ago

  try {
    // Find users with old consents that need renewal
    const expiredConsentsSnapshot = await db.collection('userPrivacySettings')
      .where('dataProcessingConsent.consentDate', '<', expiryThreshold)
      .get();

    let notificationsSent = 0;

    for (const doc of expiredConsentsSnapshot.docs) {
      const userId = doc.id;
      const userData = doc.data();

      try {
        // Check if user has been active recently
        const recentActivity = await getUserRecentActivity(userId);
        
        if (recentActivity) {
          // Send consent renewal notification
          await createConsentRenewalNotification(userId, userData.dataProcessingConsent.consentDate);
          notificationsSent++;
        } else {
          // User inactive - consider for automatic consent withdrawal
          await handleInactiveUserConsent(userId);
        }

      } catch (error) {
        console.error(`Error processing consent expiry for user ${userId}:`, error);
      }
    }

    console.log(`Consent expiry check completed. Notifications sent: ${notificationsSent}`);

  } catch (error) {
    console.error('Error in consent expiry check:', error);
  }
});

/**
 * Check if user has been active recently
 */
async function getUserRecentActivity(userId: string): Promise<boolean> {
  const recentThreshold = new Date();
  recentThreshold.setMonth(recentThreshold.getMonth() - 3); // 3 months

  const recentJournalSnapshot = await db.collection('journal-entries')
    .where('userId', '==', userId)
    .where('createdAt', '>', recentThreshold)
    .limit(1)
    .get();

  return !recentJournalSnapshot.empty;
}

/**
 * Create consent renewal notification
 */
async function createConsentRenewalNotification(userId: string, lastConsentDate: any) {
  await db.collection('consentRenewalNotifications').add({
    userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    lastConsentDate: lastConsentDate,
    status: 'pending',
    reminderCount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days to renew
  });

  // Log notification
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'consent_renewal_notification_sent',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: `User notified that consent requires renewal (last consent: ${lastConsentDate.toDate().toISOString()})`,
    legalBasis: 'legitimate_interest'
  });
}

/**
 * Handle consent for inactive users
 */
async function handleInactiveUserConsent(userId: string) {
  // For inactive users, we might want to automatically withdraw certain non-essential consents
  // This is a conservative approach to privacy protection
  
  await db.collection('privacyAuditLog').add({
    userId,
    action: 'inactive_user_consent_review',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    details: 'Inactive user flagged for consent review due to consent age',
    legalBasis: 'legitimate_interest'
  });

  // Could implement automatic withdrawal of non-essential consents here
  // For now, just flag for manual review
}