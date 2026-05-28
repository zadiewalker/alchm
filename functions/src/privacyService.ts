// Privacy Service for ALCHM - Handles GDPR compliance and user data management
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserPrivacySettings, AccountDeletionRequest, UserDataSnapshot } from "./privacyTypes";

const db = admin.firestore();
const SECURE_DATA_EXPORT_DELIVERY_ENABLED = false;
const VERIFIED_DELETION_REQUEST_DELIVERY_ENABLED = false;
const ACCOUNT_DELETION_PROCESSING_ENABLED = false;
const CANONICAL_USER_SUBCOLLECTIONS = [
  "sessions",
  "analyses",
  "khepera",
  "kheperaDelayedReflections",
  "containers",
  "containerState",
  "profile"
] as const;

type JournalExportEntry = UserDataSnapshot["journalEntries"][number];
type AnalysisExportEntry = UserDataSnapshot["aiAnalyses"][number];

/**
 * Generates a comprehensive user data export in multiple formats
 * Implements GDPR Article 20 (Right to data portability)
 */
export const exportUserData = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  if (!SECURE_DATA_EXPORT_DELIVERY_ENABLED) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Data export is unavailable until secure delivery is configured"
    );
  }

  const userId = context.auth.uid;
  const { formats = ["json"], includeAnalyses = true, includeMetadata = true } = data;

  try {
    // Create export request record
    const exportRequestRef = await db.collection("dataExportRequests").add({
      userId,
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "processing",
      formats,
      includeAnalyses,
      includeMetadata
    });

    // Log the export request for audit trail
    await db.collection("privacyAuditLog").add({
      userId,
      action: "data_export_requested",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `User requested data export in formats: ${formats.join(", ")}`,
      legalBasis: "consent",
      ipAddress: context.rawRequest?.ip,
      userAgent: context.rawRequest?.headers?.["user-agent"]
    });

    // Generate the data export asynchronously
    await generateDataExport(userId, exportRequestRef.id, formats, includeAnalyses, includeMetadata);

    return { 
      success: true, 
      exportId: exportRequestRef.id,
      message: "Data export request submitted successfully. You will receive an email when ready."
    };

  } catch (error) {
    console.error("Error creating data export:", error);
    throw new functions.https.HttpsError("internal", "Failed to create data export request");
  }
});

/**
 * Generates the actual data export files
 * Runs asynchronously to avoid timeout issues
 */
async function generateDataExport(
  userId: string, 
  exportId: string, 
  formats: string[], 
  includeAnalyses: boolean, 
  includeMetadata: boolean
) {
  try {
    // Collect all user data
    const userDataSnapshot = await collectUserData(userId, includeAnalyses, includeMetadata);
    
    // Generate files in requested formats
    const exportFiles: Record<string, string> = {};
    
    if (formats.includes("json")) {
      exportFiles["user_data.json"] = JSON.stringify(userDataSnapshot, null, 2);
    }
    
    if (formats.includes("csv")) {
      exportFiles["journal_entries.csv"] = generateJournalEntriesCSV(userDataSnapshot.journalEntries);
      exportFiles["ai_analyses.csv"] = generateAnalysesCSV(userDataSnapshot.aiAnalyses);
    }
    
    if (formats.includes("pdf")) {
      // PDF generation would typically use a library like Puppeteer
      // For now, we'll create a structured text format
      exportFiles["data_report.txt"] = generateDataReport(userDataSnapshot);
    }

    // Store files (in a real implementation, you'd upload to Cloud Storage)
    // For demo purposes, we'll store the data directly in Firestore
    const exportData = {
      files: exportFiles,
      metadata: {
        exportedAt: admin.firestore.FieldValue.serverTimestamp(),
        userId: userId,
        exportId: exportId,
        formats: formats
      }
    };

    // Update export request with download information
    await db.collection("dataExportRequests").doc(exportId).update({
      status: "ready",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      downloadUrl: `https://yourapp.com/api/download-export/${exportId}`, // Placeholder
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      exportData: exportData
    });

    // Log completion
    await db.collection("privacyAuditLog").add({
      userId,
      action: "data_export_completed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Data export completed successfully in formats: ${formats.join(", ")}`,
      legalBasis: "consent"
    });

    // Send email notification (implement with your email service)
    // await sendExportReadyEmail(userDataSnapshot.profile.email, exportId);

  } catch (error) {
    console.error("Error generating data export:", error);
    
    // Update export request with error status
    await db.collection("dataExportRequests").doc(exportId).update({
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error occurred"
    });

    // Log the error
    await db.collection("privacyAuditLog").add({
      userId,
      action: "data_export_failed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: `Data export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      legalBasis: "consent"
    });
  }
}

/**
 * Collects all user data from various collections
 * Implements data minimization - only collects what's necessary
 */
async function collectUserData(
  userId: string, 
  includeAnalyses: boolean, 
  includeMetadata: boolean
): Promise<UserDataSnapshot> {
  void includeMetadata;

  // Get user profile data
  const authUser = await admin.auth().getUser(userId);
  
  // Canonical journal sessions contain the persisted writing and Khepera reflection.
  const sessionsSnapshot = await db.collection("users").doc(userId)
    .collection("sessions")
    .orderBy("createdAt", "desc")
    .get();

  const canonicalJournalEntries = sessionsSnapshot.docs.map(doc => {
    const data = doc.data();
    const content = typeof data.entryText === "string" ? data.entryText : "";
    return {
      id: doc.id,
      content,
      createdAt: data.createdAt?.toDate(),
      wordCount: content.split(/\s+/).filter(Boolean).length,
      kheperaResponse: typeof data.kheperaResponse === "string" ? data.kheperaResponse : undefined,
      seed: typeof data.seed === "string" ? data.seed : undefined,
      emotionalTone: typeof data.emotionalTone === "string" ? data.emotionalTone : undefined,
      themes: Array.isArray(data.themes) ? data.themes : undefined,
      reflectionTiming: typeof data.reflectionTiming === "string" ? data.reflectionTiming : undefined
    };
  });

  // Retain legacy entries in exports until migration status is resolved.
  const legacyJournalEntriesSnapshot = await db.collection("journal-entries")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  const legacyJournalEntries = legacyJournalEntriesSnapshot.docs.map(doc => {
    const data = doc.data();
    const content = typeof data.content === "string" ? data.content : "";
    return {
      id: doc.id,
      content,
      createdAt: data.createdAt?.toDate(),
      wordCount: content.split(/\s+/).filter(Boolean).length
    };
  });
  const journalEntries = [...canonicalJournalEntries, ...legacyJournalEntries]
    .sort((left, right) => (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0));

  // Get AI analyses if requested and consented
  let aiAnalyses: AnalysisExportEntry[] = [];
  if (includeAnalyses) {
    const analysesSnapshot = await db.collection("users").doc(userId)
      .collection("analyses").orderBy("analyzedAt", "desc").get();
    
    aiAnalyses = analysesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        journalEntryId: data.journalEntryId,
        analysisDate: data.analyzedAt?.toDate(),
        emotionalThemes: data.emotionalThemes?.primaryEmotions || [],
        insights: data.analysis?.gentleInsight || "",
        crisisLevel: data.crisisAssessment?.confidenceLevel || "low"
      };
    });
  }

  // Get privacy settings
  const privacyDoc = await db.collection("userPrivacySettings").doc(userId).get();
  const privacySettings = privacyDoc.data() as UserPrivacySettings;

  // Calculate system interactions
  const systemInteractions = {
    totalSessions: canonicalJournalEntries.length,
    totalJournalEntries: journalEntries.length,
    firstEntry: journalEntries.length > 0 ? journalEntries[journalEntries.length - 1].createdAt : null,
    lastActivity: journalEntries.length > 0 ? journalEntries[0].createdAt : authUser.metadata.lastSignInTime
  };

  return {
    profile: {
      uid: userId,
      email: authUser.email || "",
      createdAt: new Date(authUser.metadata.creationTime),
      lastLogin: authUser.metadata.lastSignInTime ? new Date(authUser.metadata.lastSignInTime) : new Date()
    },
    journalEntries,
    aiAnalyses,
    privacySettings: privacySettings || {} as UserPrivacySettings,
    systemInteractions,
    exportMetadata: {
      exportDate: new Date(),
      exportVersion: "1.0",
      dataProcessingBasis: "User consent under GDPR Article 6(1)(a)",
      retentionPolicies: "Data retained according to user privacy preferences and legal requirements"
    }
  };
}

/**
 * Generate CSV format for journal entries
 */
function generateJournalEntriesCSV(entries: JournalExportEntry[]): string {
  const headers = "ID,Date,Word Count,Content Preview\n";
  const rows = entries.map(entry => {
    const preview = entry.content.substring(0, 100).replace(/"/g, "\"\"");
    return `"${entry.id}","${entry.createdAt?.toISOString()}","${entry.wordCount}","${preview}..."`;
  }).join("\n");
  
  return headers + rows;
}

/**
 * Generate CSV format for AI analyses
 */
function generateAnalysesCSV(analyses: AnalysisExportEntry[]): string {
  const headers = "ID,Journal Entry ID,Analysis Date,Emotional Themes,Crisis Level\n";
  const rows = analyses.map(analysis => {
    const themes = analysis.emotionalThemes.join("; ");
    return `"${analysis.id}","${analysis.journalEntryId}","${analysis.analysisDate?.toISOString()}","${themes}","${analysis.crisisLevel}"`;
  }).join("\n");
  
  return headers + rows;
}

/**
 * Generate human-readable data report
 */
function generateDataReport(data: UserDataSnapshot): string {
  return `ALCHM Personal Data Report
Generated: ${data.exportMetadata.exportDate.toISOString()}

ACCOUNT INFORMATION
===================
User ID: ${data.profile.uid}
Email: ${data.profile.email}
Account Created: ${data.profile.createdAt.toISOString()}
Last Login: ${data.profile.lastLogin.toISOString()}

JOURNAL STATISTICS
==================
Total Entries: ${data.journalEntries.length}
First Entry: ${data.systemInteractions.firstEntry?.toISOString() || "N/A"}
Last Activity: ${data.systemInteractions.lastActivity?.toISOString() || "N/A"}
Total Words Written: ${data.journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0)}

AI ANALYSIS SUMMARY
===================
Total Analyses: ${data.aiAnalyses.length}
Most Common Emotions: ${getMostCommonEmotions(data.aiAnalyses)}

PRIVACY SETTINGS
================
Journal Analysis Consent: ${data.privacySettings.dataProcessingConsent?.journalAnalysis ? "Yes" : "No"}
Crisis Monitoring Consent: ${data.privacySettings.dataProcessingConsent?.crisisMonitoring ? "Yes" : "No"}
Analytics Participation: ${data.privacySettings.dataProcessingConsent?.analyticsParticipation ? "Yes" : "No"}

This report contains all personal data associated with your ALCHM account.
For questions about your data, contact privacy@alchm.app`;
}

function getMostCommonEmotions(analyses: AnalysisExportEntry[]): string {
  const emotionCounts: Record<string, number> = {};
  analyses.forEach(analysis => {
    analysis.emotionalThemes.forEach((emotion: string) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
  });
  
  return Object.entries(emotionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([emotion, count]) => `${emotion} (${count})`)
    .join(", ");
}

/**
 * Handle account deletion requests with proper verification
 * Implements GDPR Article 17 (Right to erasure)
 */
export const requestAccountDeletion = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  if (!VERIFIED_DELETION_REQUEST_DELIVERY_ENABLED) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Account deletion requests are unavailable until verification delivery is configured"
    );
  }

  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;

  try {
    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);

    // Create deletion request with 30-day grace period
    const deletionRequest: Record<string, unknown> = {
      id: "",
      userId,
      userEmail: userEmail || "",
      requestedAt: admin.firestore.FieldValue.serverTimestamp(),
      verificationToken,
      verified: false,
      status: "pending_verification",
      scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      completedAt: undefined,
      legalRetentionPeriod: undefined,
      cancellationDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
      retainForLegal: false
    };

    const deletionRequestRef = await db.collection("accountDeletionRequests").add(deletionRequest);

    // Log the deletion request
    await db.collection("privacyAuditLog").add({
      userId,
      action: "account_deletion_requested",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: "User requested account deletion with 30-day grace period",
      legalBasis: "consent",
      ipAddress: context.rawRequest?.ip,
      userAgent: context.rawRequest?.headers?.["user-agent"]
    });

    // Send verification email (implement with your email service)
    // await sendDeletionVerificationEmail(userEmail, verificationToken);

    return { 
      success: true,
      requestId: deletionRequestRef.id,
      message: "Account deletion request submitted. Please check your email for verification instructions."
    };

  } catch (error) {
    console.error("Error creating deletion request:", error);
    throw new functions.https.HttpsError("internal", "Failed to create deletion request");
  }
});

/**
 * Verify account deletion request
 */
export const verifyAccountDeletion = functions.https.onCall(async (data) => {
  const { token } = data;
  
  if (!token) {
    throw new functions.https.HttpsError("invalid-argument", "Verification token is required");
  }

  try {
    // Find deletion request by token
    const requestsSnapshot = await db.collection("accountDeletionRequests")
      .where("verificationToken", "==", token)
      .where("verified", "==", false)
      .limit(1)
      .get();

    if (requestsSnapshot.empty) {
      throw new functions.https.HttpsError("not-found", "Invalid or expired verification token");
    }

    const requestDoc = requestsSnapshot.docs[0];
    const requestData = requestDoc.data() as AccountDeletionRequest;

    // Check if still within grace period
    if (new Date() > new Date(requestData.cancellationDeadline)) {
      throw new functions.https.HttpsError("deadline-exceeded", "Verification deadline has passed");
    }

    // Mark as verified
    await requestDoc.ref.update({
      verified: true,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: "verified"
    });

    // Log verification
    await db.collection("privacyAuditLog").add({
      userId: requestData.userId,
      action: "account_deletion_verified",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: "User verified account deletion request",
      legalBasis: "consent"
    });

    return { success: true, message: "Account deletion verified. Your data will be deleted on the scheduled date." };

  } catch (error) {
    console.error("Error verifying deletion request:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError("internal", "Failed to verify deletion request");
  }
});

/**
 * Cancel account deletion request (within grace period)
 */
export const cancelAccountDeletion = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated");
  }

  const userId = context.auth.uid;

  try {
    // Find active deletion request
    const requestsSnapshot = await db.collection("accountDeletionRequests")
      .where("userId", "==", userId)
      .where("status", "in", ["pending_verification", "verified"])
      .limit(1)
      .get();

    if (requestsSnapshot.empty) {
      throw new functions.https.HttpsError("not-found", "No active deletion request found");
    }

    const requestDoc = requestsSnapshot.docs[0];
    const requestData = requestDoc.data() as AccountDeletionRequest;

    // Check if still within cancellation period
    if (new Date() > new Date(requestData.cancellationDeadline)) {
      throw new functions.https.HttpsError("deadline-exceeded", "Cancellation deadline has passed");
    }

    // Cancel the request
    await requestDoc.ref.update({
      status: "cancelled",
      cancelledAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log cancellation
    await db.collection("privacyAuditLog").add({
      userId,
      action: "account_deletion_cancelled",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: "User cancelled account deletion request",
      legalBasis: "consent"
    });

    return { success: true, message: "Account deletion request cancelled successfully." };

  } catch (error) {
    console.error("Error cancelling deletion request:", error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError("internal", "Failed to cancel deletion request");
  }
});

/**
 * Scheduled function to process verified account deletions
 * Runs daily to check for accounts scheduled for deletion
 */
export const processAccountDeletions = functions.pubsub.schedule("0 2 * * *").onRun(async () => {
  if (!ACCOUNT_DELETION_PROCESSING_ENABLED) {
    console.info("Account deletion processing is disabled pending verified request delivery and policy review.");
    return null;
  }

  const now = new Date();
  
  try {
    // Find verified deletion requests that are due
    const dueRequestsSnapshot = await db.collection("accountDeletionRequests")
      .where("status", "==", "verified")
      .where("scheduledDeletionDate", "<=", now)
      .get();

    for (const requestDoc of dueRequestsSnapshot.docs) {
      const requestData = requestDoc.data() as AccountDeletionRequest;
      
      try {
        // Perform complete data deletion
        await deleteAllUserData(requestData.userId);
        
        // Update request status
        await requestDoc.ref.update({
          status: "completed",
          completedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log(`Account deletion completed for user: ${requestData.userId}`);
        
      } catch (error) {
        console.error(`Failed to delete account for user ${requestData.userId}:`, error);
        // Mark as failed but don't throw to continue with other deletions
        await requestDoc.ref.update({
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    console.log(`Processed ${dueRequestsSnapshot.docs.length} account deletion requests`);
    return null;

  } catch (error) {
    console.error("Error processing account deletions:", error);
    return null;
  }
});

/**
 * Completely delete all user data across all collections
 * Implements comprehensive data deletion per GDPR requirements
 */
async function deleteAllUserData(userId: string) {
  try {
    // Delete user authentication record
    await admin.auth().deleteUser(userId);

    // Delete canonical user-owned data before removing the parent document.
    for (const subcollection of CANONICAL_USER_SUBCOLLECTIONS) {
      await deleteCollection(db.collection("users").doc(userId).collection(subcollection));
    }

    // Delete legacy journal entries retained during migration.
    const journalEntriesSnapshot = await db.collection("journal-entries")
      .where("userId", "==", userId)
      .get();
    await deleteDocuments(journalEntriesSnapshot.docs);

    // Delete privacy settings
    await db.collection("userPrivacySettings").doc(userId).delete();

    // Delete user profile
    await db.collection("users").doc(userId).delete();

    // Delete export requests
    const exportRequestsSnapshot = await db.collection("dataExportRequests")
      .where("userId", "==", userId)
      .get();
    await deleteDocuments(exportRequestsSnapshot.docs);

    // Note: Privacy audit log is retained for legal compliance
    // But we anonymize it by removing the userId
    const auditLogSnapshot = await db.collection("privacyAuditLog")
      .where("userId", "==", userId)
      .get();

    for (const doc of auditLogSnapshot.docs) {
      await doc.ref.update({
        userId: "[DELETED_USER]",
        anonymized: true,
        anonymizedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Log final deletion (anonymously)
    await db.collection("privacyAuditLog").add({
      userId: "[DELETED_USER]",
      action: "account_deletion_completed",
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: "User account and all associated data permanently deleted",
      legalBasis: "consent"
    });

    console.log(`Complete data deletion successful for user: ${userId}`);

  } catch (error) {
    console.error(`Error during complete data deletion for user ${userId}:`, error);
    throw error;
  }
}

async function deleteCollection(
  collection: FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>
): Promise<void> {
  const snapshot = await collection.get();
  await deleteDocuments(snapshot.docs);
}

async function deleteDocuments(
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
): Promise<void> {
  for (let index = 0; index < docs.length; index += 450) {
    const batch = db.batch();
    docs.slice(index, index + 450).forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
}
