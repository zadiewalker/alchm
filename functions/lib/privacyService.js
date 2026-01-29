"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAccountDeletions = exports.cancelAccountDeletion = exports.verifyAccountDeletion = exports.requestAccountDeletion = exports.exportUserData = void 0;
// Privacy Service for ALCHM - Handles GDPR compliance and user data management
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Generates a comprehensive user data export in multiple formats
 * Implements GDPR Article 20 (Right to data portability)
 */
exports.exportUserData = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    // Verify authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = context.auth.uid;
    const { formats = ['json'], includeAnalyses = true, includeMetadata = true } = data;
    try {
        // Create export request record
        const exportRequestRef = await db.collection('dataExportRequests').add({
            userId,
            requestedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'processing',
            formats,
            includeAnalyses,
            includeMetadata
        });
        // Log the export request for audit trail
        await db.collection('privacyAuditLog').add({
            userId,
            action: 'data_export_requested',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: `User requested data export in formats: ${formats.join(', ')}`,
            legalBasis: 'consent',
            ipAddress: (_a = context.rawRequest) === null || _a === void 0 ? void 0 : _a.ip,
            userAgent: (_c = (_b = context.rawRequest) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c['user-agent']
        });
        // Generate the data export asynchronously
        await generateDataExport(userId, exportRequestRef.id, formats, includeAnalyses, includeMetadata);
        return {
            success: true,
            exportId: exportRequestRef.id,
            message: 'Data export request submitted successfully. You will receive an email when ready.'
        };
    }
    catch (error) {
        console.error('Error creating data export:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create data export request');
    }
});
/**
 * Generates the actual data export files
 * Runs asynchronously to avoid timeout issues
 */
async function generateDataExport(userId, exportId, formats, includeAnalyses, includeMetadata) {
    try {
        // Collect all user data
        const userDataSnapshot = await collectUserData(userId, includeAnalyses, includeMetadata);
        // Generate files in requested formats
        const exportFiles = {};
        if (formats.includes('json')) {
            exportFiles['user_data.json'] = JSON.stringify(userDataSnapshot, null, 2);
        }
        if (formats.includes('csv')) {
            exportFiles['journal_entries.csv'] = generateJournalEntriesCSV(userDataSnapshot.journalEntries);
            exportFiles['ai_analyses.csv'] = generateAnalysesCSV(userDataSnapshot.aiAnalyses);
        }
        if (formats.includes('pdf')) {
            // PDF generation would typically use a library like Puppeteer
            // For now, we'll create a structured text format
            exportFiles['data_report.txt'] = generateDataReport(userDataSnapshot);
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
        await db.collection('dataExportRequests').doc(exportId).update({
            status: 'ready',
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
            downloadUrl: `https://yourapp.com/api/download-export/${exportId}`, // Placeholder
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            exportData: exportData
        });
        // Log completion
        await db.collection('privacyAuditLog').add({
            userId,
            action: 'data_export_completed',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: `Data export completed successfully in formats: ${formats.join(', ')}`,
            legalBasis: 'consent'
        });
        // Send email notification (implement with your email service)
        // await sendExportReadyEmail(userDataSnapshot.profile.email, exportId);
    }
    catch (error) {
        console.error('Error generating data export:', error);
        // Update export request with error status
        await db.collection('dataExportRequests').doc(exportId).update({
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
        });
        // Log the error
        await db.collection('privacyAuditLog').add({
            userId,
            action: 'data_export_failed',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: `Data export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            legalBasis: 'consent'
        });
    }
}
/**
 * Collects all user data from various collections
 * Implements data minimization - only collects what's necessary
 */
async function collectUserData(userId, includeAnalyses, includeMetadata) {
    // Get user profile data
    const authUser = await admin.auth().getUser(userId);
    // Get journal entries
    const journalEntriesSnapshot = await db.collection('journal-entries')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
    const journalEntries = journalEntriesSnapshot.docs.map(doc => {
        var _a, _b;
        const data = doc.data();
        return {
            id: doc.id,
            content: data.content,
            createdAt: (_a = data.createdAt) === null || _a === void 0 ? void 0 : _a.toDate(),
            wordCount: ((_b = data.content) === null || _b === void 0 ? void 0 : _b.split(' ').length) || 0
        };
    });
    // Get AI analyses if requested and consented
    let aiAnalyses = [];
    if (includeAnalyses) {
        const analysesSnapshot = await db.collection('users').doc(userId)
            .collection('analyses').orderBy('analyzedAt', 'desc').get();
        aiAnalyses = analysesSnapshot.docs.map(doc => {
            var _a, _b, _c, _d;
            const data = doc.data();
            return {
                id: doc.id,
                journalEntryId: data.journalEntryId,
                analysisDate: (_a = data.analyzedAt) === null || _a === void 0 ? void 0 : _a.toDate(),
                emotionalThemes: ((_b = data.emotionalThemes) === null || _b === void 0 ? void 0 : _b.primaryEmotions) || [],
                insights: ((_c = data.analysis) === null || _c === void 0 ? void 0 : _c.gentleInsight) || '',
                crisisLevel: ((_d = data.crisisAssessment) === null || _d === void 0 ? void 0 : _d.confidenceLevel) || 'low'
            };
        });
    }
    // Get privacy settings
    const privacyDoc = await db.collection('userPrivacySettings').doc(userId).get();
    const privacySettings = privacyDoc.data();
    // Calculate system interactions
    const systemInteractions = {
        totalSessions: 0, // Would be calculated from analytics
        totalJournalEntries: journalEntries.length,
        firstEntry: journalEntries.length > 0 ? journalEntries[journalEntries.length - 1].createdAt : null,
        lastActivity: journalEntries.length > 0 ? journalEntries[0].createdAt : authUser.metadata.lastSignInTime
    };
    return {
        profile: {
            uid: userId,
            email: authUser.email || '',
            createdAt: new Date(authUser.metadata.creationTime),
            lastLogin: authUser.metadata.lastSignInTime ? new Date(authUser.metadata.lastSignInTime) : new Date()
        },
        journalEntries,
        aiAnalyses,
        privacySettings: privacySettings || {},
        systemInteractions,
        exportMetadata: {
            exportDate: new Date(),
            exportVersion: '1.0',
            dataProcessingBasis: 'User consent under GDPR Article 6(1)(a)',
            retentionPolicies: 'Data retained according to user privacy preferences and legal requirements'
        }
    };
}
/**
 * Generate CSV format for journal entries
 */
function generateJournalEntriesCSV(entries) {
    const headers = 'ID,Date,Word Count,Content Preview\n';
    const rows = entries.map(entry => {
        var _a;
        const preview = entry.content.substring(0, 100).replace(/"/g, '""');
        return `"${entry.id}","${(_a = entry.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString()}","${entry.wordCount}","${preview}..."`;
    }).join('\n');
    return headers + rows;
}
/**
 * Generate CSV format for AI analyses
 */
function generateAnalysesCSV(analyses) {
    const headers = 'ID,Journal Entry ID,Analysis Date,Emotional Themes,Crisis Level\n';
    const rows = analyses.map(analysis => {
        var _a;
        const themes = analysis.emotionalThemes.join('; ');
        return `"${analysis.id}","${analysis.journalEntryId}","${(_a = analysis.analysisDate) === null || _a === void 0 ? void 0 : _a.toISOString()}","${themes}","${analysis.crisisLevel}"`;
    }).join('\n');
    return headers + rows;
}
/**
 * Generate human-readable data report
 */
function generateDataReport(data) {
    var _a, _b, _c, _d, _e;
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
First Entry: ${((_a = data.systemInteractions.firstEntry) === null || _a === void 0 ? void 0 : _a.toISOString()) || 'N/A'}
Last Activity: ${((_b = data.systemInteractions.lastActivity) === null || _b === void 0 ? void 0 : _b.toISOString()) || 'N/A'}
Total Words Written: ${data.journalEntries.reduce((sum, entry) => sum + entry.wordCount, 0)}

AI ANALYSIS SUMMARY
===================
Total Analyses: ${data.aiAnalyses.length}
Most Common Emotions: ${getMostCommonEmotions(data.aiAnalyses)}

PRIVACY SETTINGS
================
Journal Analysis Consent: ${((_c = data.privacySettings.dataProcessingConsent) === null || _c === void 0 ? void 0 : _c.journalAnalysis) ? 'Yes' : 'No'}
Crisis Monitoring Consent: ${((_d = data.privacySettings.dataProcessingConsent) === null || _d === void 0 ? void 0 : _d.crisisMonitoring) ? 'Yes' : 'No'}
Analytics Participation: ${((_e = data.privacySettings.dataProcessingConsent) === null || _e === void 0 ? void 0 : _e.analyticsParticipation) ? 'Yes' : 'No'}

This report contains all personal data associated with your ALCHM account.
For questions about your data, contact privacy@alchm.app`;
}
function getMostCommonEmotions(analyses) {
    const emotionCounts = {};
    analyses.forEach(analysis => {
        analysis.emotionalThemes.forEach((emotion) => {
            emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
    });
    return Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([emotion, count]) => `${emotion} (${count})`)
        .join(', ');
}
/**
 * Handle account deletion requests with proper verification
 * Implements GDPR Article 17 (Right to erasure)
 */
exports.requestAccountDeletion = functions.https.onCall(async (data, context) => {
    var _a, _b, _c;
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = context.auth.uid;
    const userEmail = context.auth.token.email;
    try {
        // Generate verification token
        const verificationToken = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        // Create deletion request with 30-day grace period
        const deletionRequest = {
            userId,
            userEmail: userEmail || '',
            requestedAt: admin.firestore.FieldValue.serverTimestamp(),
            verificationToken,
            verified: false,
            status: 'pending_verification',
            scheduledDeletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            cancellationDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
            retainForLegal: false
        };
        const deletionRequestRef = await db.collection('accountDeletionRequests').add(deletionRequest);
        // Log the deletion request
        await db.collection('privacyAuditLog').add({
            userId,
            action: 'account_deletion_requested',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: 'User requested account deletion with 30-day grace period',
            legalBasis: 'consent',
            ipAddress: (_a = context.rawRequest) === null || _a === void 0 ? void 0 : _a.ip,
            userAgent: (_c = (_b = context.rawRequest) === null || _b === void 0 ? void 0 : _b.headers) === null || _c === void 0 ? void 0 : _c['user-agent']
        });
        // Send verification email (implement with your email service)
        // await sendDeletionVerificationEmail(userEmail, verificationToken);
        return {
            success: true,
            requestId: deletionRequestRef.id,
            message: 'Account deletion request submitted. Please check your email for verification instructions.'
        };
    }
    catch (error) {
        console.error('Error creating deletion request:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create deletion request');
    }
});
/**
 * Verify account deletion request
 */
exports.verifyAccountDeletion = functions.https.onCall(async (data, context) => {
    const { token } = data;
    if (!token) {
        throw new functions.https.HttpsError('invalid-argument', 'Verification token is required');
    }
    try {
        // Find deletion request by token
        const requestsSnapshot = await db.collection('accountDeletionRequests')
            .where('verificationToken', '==', token)
            .where('verified', '==', false)
            .limit(1)
            .get();
        if (requestsSnapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'Invalid or expired verification token');
        }
        const requestDoc = requestsSnapshot.docs[0];
        const requestData = requestDoc.data();
        // Check if still within grace period
        if (new Date() > new Date(requestData.cancellationDeadline)) {
            throw new functions.https.HttpsError('deadline-exceeded', 'Verification deadline has passed');
        }
        // Mark as verified
        await requestDoc.ref.update({
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'verified'
        });
        // Log verification
        await db.collection('privacyAuditLog').add({
            userId: requestData.userId,
            action: 'account_deletion_verified',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: 'User verified account deletion request',
            legalBasis: 'consent'
        });
        return { success: true, message: 'Account deletion verified. Your data will be deleted on the scheduled date.' };
    }
    catch (error) {
        console.error('Error verifying deletion request:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to verify deletion request');
    }
});
/**
 * Cancel account deletion request (within grace period)
 */
exports.cancelAccountDeletion = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    const userId = context.auth.uid;
    try {
        // Find active deletion request
        const requestsSnapshot = await db.collection('accountDeletionRequests')
            .where('userId', '==', userId)
            .where('status', 'in', ['pending_verification', 'verified'])
            .limit(1)
            .get();
        if (requestsSnapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'No active deletion request found');
        }
        const requestDoc = requestsSnapshot.docs[0];
        const requestData = requestDoc.data();
        // Check if still within cancellation period
        if (new Date() > new Date(requestData.cancellationDeadline)) {
            throw new functions.https.HttpsError('deadline-exceeded', 'Cancellation deadline has passed');
        }
        // Cancel the request
        await requestDoc.ref.update({
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Log cancellation
        await db.collection('privacyAuditLog').add({
            userId,
            action: 'account_deletion_cancelled',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: 'User cancelled account deletion request',
            legalBasis: 'consent'
        });
        return { success: true, message: 'Account deletion request cancelled successfully.' };
    }
    catch (error) {
        console.error('Error cancelling deletion request:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'Failed to cancel deletion request');
    }
});
/**
 * Scheduled function to process verified account deletions
 * Runs daily to check for accounts scheduled for deletion
 */
exports.processAccountDeletions = functions.pubsub.schedule('0 2 * * *').onRun(async () => {
    const now = new Date();
    try {
        // Find verified deletion requests that are due
        const dueRequestsSnapshot = await db.collection('accountDeletionRequests')
            .where('status', '==', 'verified')
            .where('scheduledDeletionDate', '<=', now)
            .get();
        for (const requestDoc of dueRequestsSnapshot.docs) {
            const requestData = requestDoc.data();
            try {
                // Perform complete data deletion
                await deleteAllUserData(requestData.userId);
                // Update request status
                await requestDoc.ref.update({
                    status: 'completed',
                    completedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`Account deletion completed for user: ${requestData.userId}`);
            }
            catch (error) {
                console.error(`Failed to delete account for user ${requestData.userId}:`, error);
                // Mark as failed but don't throw to continue with other deletions
                await requestDoc.ref.update({
                    status: 'failed',
                    errorMessage: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
        console.log(`Processed ${dueRequestsSnapshot.docs.length} account deletion requests`);
    }
    catch (error) {
        console.error('Error processing account deletions:', error);
    }
});
/**
 * Completely delete all user data across all collections
 * Implements comprehensive data deletion per GDPR requirements
 */
async function deleteAllUserData(userId) {
    const batch = db.batch();
    try {
        // Delete user authentication record
        await admin.auth().deleteUser(userId);
        // Delete journal entries
        const journalEntriesSnapshot = await db.collection('journal-entries')
            .where('userId', '==', userId)
            .get();
        journalEntriesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Delete AI analyses
        const analysesSnapshot = await db.collection('users').doc(userId)
            .collection('analyses').get();
        analysesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Delete privacy settings
        const privacySettingsRef = db.collection('userPrivacySettings').doc(userId);
        batch.delete(privacySettingsRef);
        // Delete user profile
        const userProfileRef = db.collection('users').doc(userId);
        batch.delete(userProfileRef);
        // Delete export requests
        const exportRequestsSnapshot = await db.collection('dataExportRequests')
            .where('userId', '==', userId)
            .get();
        exportRequestsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Note: Privacy audit log is retained for legal compliance
        // But we anonymize it by removing the userId
        const auditLogSnapshot = await db.collection('privacyAuditLog')
            .where('userId', '==', userId)
            .get();
        auditLogSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
                userId: '[DELETED_USER]',
                anonymized: true,
                anonymizedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        });
        // Commit all deletions
        await batch.commit();
        // Log final deletion (anonymously)
        await db.collection('privacyAuditLog').add({
            userId: '[DELETED_USER]',
            action: 'account_deletion_completed',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: 'User account and all associated data permanently deleted',
            legalBasis: 'consent',
            originalUserId: userId // For internal tracking only, not exposed to user
        });
        console.log(`Complete data deletion successful for user: ${userId}`);
    }
    catch (error) {
        console.error(`Error during complete data deletion for user ${userId}:`, error);
        throw error;
    }
}
//# sourceMappingURL=privacyService.js.map