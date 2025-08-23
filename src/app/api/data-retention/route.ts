// ALCHM Data Retention Management API
// Handles user data lifecycle, retention periods, and deletion requests

import { NextRequest } from 'next/server';
import { dataRetentionManager, DeletionReason } from '@/lib/data-retention-policy';
import { createAuthenticatedHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';
import { validateInput } from '@/lib/security';

// GET - Get user's data retention summary
async function getUserDataRetentionSummary(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;

  try {
    const summary = await dataRetentionManager.getUserDataRetentionSummary(userId);
    
    return {
      success: true,
      data: {
        summary,
        retentionPolicy: {
          journalEntries: {
            description: 'Your journal entries are kept while your account is active',
            activeRetention: 'Indefinite (while account active)',
            inactiveRetention: '3 years after account inactivity',
            userControlled: true
          },
          aiProcessingData: {
            description: 'AI processing data for insights and safety',
            sessionData: '24 hours (session isolation)',
            insights: '1 year (for pattern analysis)',
            crisisData: '7 years (safety/legal requirements)'
          },
          compliance: {
            frameworks: ['FERPA', 'COPPA', 'GDPR'],
            userRights: [
              'Right to access your data',
              'Right to request deletion',
              'Right to data portability',
              'Right to rectification'
            ]
          }
        }
      }
    };

  } catch (error: any) {
    console.error('[Data Retention API] Failed to get retention summary:', error);
    throw createApiError(
      ApiErrorCode.DATABASE_ERROR,
      'Failed to retrieve data retention summary',
      error,
      'Unable to load your data retention information',
      context.requestId
    );
  }
}

// POST - Request data deletion
async function requestDataDeletion(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;
  
  try {
    const body = await req.json();
    const { 
      deletionType, 
      dataTypes, 
      reason, 
      urgency, 
      parentalConsent 
    } = validateInput(body, {
      deletionType: { type: 'string', required: true, enum: ['partial', 'complete', 'specific_data'] },
      dataTypes: { type: 'array', required: false },
      reason: { type: 'string', required: false },
      urgency: { type: 'string', required: false, enum: ['standard', 'expedited', 'immediate'] },
      parentalConsent: { type: 'object', required: false }
    });

    // Validate deletion request based on compliance requirements
    if (deletionType === 'specific_data' && (!dataTypes || dataTypes.length === 0)) {
      throw createApiError(
        ApiErrorCode.BAD_REQUEST,
        'Data types must be specified for specific data deletion',
        null,
        'Please specify which types of data you want to delete',
        context.requestId
      );
    }

    // Map user-friendly reason to system enum
    const deletionReason = reason === 'parental_request' 
      ? DeletionReason.PARENTAL_REQUEST 
      : DeletionReason.USER_REQUEST;

    // For COPPA compliance, check if parental consent is required
    const userAge = await getUserAge(userId);
    const requiresParentalConsent = userAge !== null && userAge < 13;

    if (requiresParentalConsent && deletionReason === DeletionReason.USER_REQUEST) {
      throw createApiError(
        ApiErrorCode.FORBIDDEN,
        'Parental consent required for deletion',
        null,
        'Users under 13 require parental consent for data deletion',
        context.requestId
      );
    }

    // Create deletion request
    const deletionRequest = await dataRetentionManager.scheduleDataDeletion(userId, {
      requestedBy: deletionReason === DeletionReason.PARENTAL_REQUEST ? 'parent' : 'user',
      requestType: deletionType,
      dataTypes: dataTypes || Object.keys(await dataRetentionManager.getUserDataRetentionSummary(userId)).filter(key => key !== 'totalDataItems'),
      reason: deletionReason,
      urgency: urgency || 'standard',
      verificationRequired: true,
      parentalConsent: parentalConsent || undefined,
      legalBasis: getAppropriateGDPRBasis(deletionReason, urgency)
    });

    return {
      success: true,
      data: {
        deletionRequest: {
          requestId: deletionRequest.requestId,
          status: deletionRequest.status,
          scheduledFor: deletionRequest.scheduledFor?.toDate().toISOString(),
          dataTypes: deletionRequest.dataTypes,
          urgency: deletionRequest.urgency
        },
        timeline: getDeletionTimeline(deletionRequest.urgency || 'standard'),
        nextSteps: getNextSteps(deletionRequest, requiresParentalConsent)
      }
    };

  } catch (error: any) {
    console.error('[Data Retention API] Failed to request deletion:', error);
    
    if (error.code === ApiErrorCode.BAD_REQUEST || error.code === ApiErrorCode.FORBIDDEN) {
      throw error;
    }

    throw createApiError(
      ApiErrorCode.PROCESSING_ERROR,
      'Failed to process deletion request',
      error,
      'Unable to process your deletion request. Please try again.',
      context.requestId
    );
  }
}

// PUT - Update data retention preferences
async function updateRetentionPreferences(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;

  try {
    const body = await req.json();
    const { 
      journalRetention, 
      analyticsOptOut, 
      dataMinimization 
    } = validateInput(body, {
      journalRetention: { type: 'string', required: false, enum: ['minimal', 'standard', 'extended'] },
      analyticsOptOut: { type: 'boolean', required: false },
      dataMinimization: { type: 'boolean', required: false }
    });

    // Update user preferences for data retention
    const preferences = {
      journalRetention: journalRetention || 'standard',
      analyticsOptOut: analyticsOptOut || false,
      dataMinimization: dataMinimization || false,
      updatedAt: new Date().toISOString()
    };

    // Store preferences securely
    await storeUserRetentionPreferences(userId, preferences);

    return {
      success: true,
      data: {
        preferences,
        appliedSettings: {
          journalRetention: getJournalRetentionDescription(preferences.journalRetention),
          analyticsOptOut: preferences.analyticsOptOut 
            ? 'You have opted out of analytics data collection'
            : 'Analytics data is collected for improving the platform',
          dataMinimization: preferences.dataMinimization
            ? 'Data minimization is enabled - only essential data is collected'
            : 'Standard data collection is enabled'
        }
      }
    };

  } catch (error: any) {
    console.error('[Data Retention API] Failed to update preferences:', error);
    throw createApiError(
      ApiErrorCode.PROCESSING_ERROR,
      'Failed to update retention preferences',
      error,
      'Unable to update your data retention preferences',
      context.requestId
    );
  }
}

// Helper functions

async function getUserAge(userId: string): Promise<number | null> {
  try {
    // This would typically get the user's age from their profile
    // For privacy, we might only store age ranges or birth year
    // Implementation depends on how age is stored in your system
    return null; // Placeholder
  } catch (error) {
    console.error('[Data Retention] Failed to get user age:', error);
    return null;
  }
}

function getAppropriateGDPRBasis(reason: DeletionReason, urgency?: string): string {
  switch (reason) {
    case DeletionReason.USER_REQUEST:
      return 'GDPR Article 17 - Right to erasure (right to be forgotten)';
    case DeletionReason.PARENTAL_REQUEST:
      return 'COPPA parental rights and GDPR Article 17';
    case DeletionReason.RETENTION_EXPIRY:
      return 'Data retention policy compliance';
    case DeletionReason.LEGAL_REQUIREMENT:
      return 'Legal obligation compliance';
    default:
      return 'GDPR Article 17 - Right to erasure';
  }
}

function getDeletionTimeline(urgency: string): string {
  switch (urgency) {
    case 'immediate':
      return 'Data will be deleted within 24 hours';
    case 'expedited':
      return 'Data will be deleted within 24 hours';
    case 'standard':
    default:
      return 'Data will be deleted within 30 days as required by GDPR';
  }
}

function getNextSteps(deletionRequest: any, requiresParentalConsent: boolean): string[] {
  const steps = [];
  
  if (requiresParentalConsent) {
    steps.push('Parental consent verification required');
    steps.push('Parent/guardian will receive email confirmation request');
  }
  
  steps.push('Deletion request is being processed');
  
  if (deletionRequest.urgency === 'standard') {
    steps.push('You have 30 days to cancel this request if needed');
  }
  
  steps.push('You will receive confirmation once deletion is complete');
  steps.push('Deleted data cannot be recovered');
  
  return steps;
}

function getJournalRetentionDescription(retention: string): string {
  switch (retention) {
    case 'minimal':
      return 'Journal entries are kept for 1 year after creation';
    case 'extended':
      return 'Journal entries are kept indefinitely while account is active';
    case 'standard':
    default:
      return 'Journal entries are kept for 3 years after last access';
  }
}

async function storeUserRetentionPreferences(userId: string, preferences: any): Promise<void> {
  // Implementation would store preferences in secure storage
  // This is a placeholder for the actual implementation
  console.log(`Storing retention preferences for user ${userId}:`, preferences);
}

// Export HTTP handlers
export const GET = createAuthenticatedHandler(getUserDataRetentionSummary, {
  allowedMethods: ['GET'],
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true
  }
});

export const POST = createAuthenticatedHandler(requestDataDeletion, {
  allowedMethods: ['POST'],
  rateLimitConfig: 'strict',
  monitoring: {
    logLevel: 'warn',
    performanceTracking: true,
    securityLogging: true
  },
  security: {
    requireEncryption: true,
    auditLogging: true
  }
});

export const PUT = createAuthenticatedHandler(updateRetentionPreferences, {
  allowedMethods: ['PUT'],
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true
  }
});