// ALCHM Secure Retrieve API - Privacy-Protected Journal Access
import { NextRequest } from 'next/server';
import { secureFirestoreClient } from '@/lib/secure-firestore-client';
import { aiSessionManager } from '@/lib/ai-session-isolation';
import { createAuthenticatedHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';

async function retrieveSecureJournalEntry(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;
  const url = new URL(req.url);
  const entryId = url.searchParams.get('entryId');
  const sessionId = url.searchParams.get('sessionId');

  // Validation
  if (!entryId) {
    throw createApiError(
      ApiErrorCode.BAD_REQUEST,
      'Entry ID is required',
      null,
      'Please provide a valid entry ID',
      context.requestId
    );
  }

  // Validate entry ID format for security
  if (!/^[a-zA-Z0-9_-]+$/.test(entryId) || entryId.length > 50) {
    throw createApiError(
      ApiErrorCode.BAD_REQUEST,
      'Invalid entry ID format',
      null,
      'Entry ID contains invalid characters',
      context.requestId
    );
  }

  try {
    // Step 1: Initialize user encryption if not already done
    const userAuthToken = context.authToken || 'fallback_token';
    await secureFirestoreClient.initializeUserEncryption(userId, userAuthToken);

    // Step 2: Validate AI session if provided
    let validatedSessionId: string | undefined;
    if (sessionId) {
      const isValidSession = await aiSessionManager.isSessionValid(sessionId);
      if (isValidSession) {
        validatedSessionId = sessionId;
      }
    }

    // Step 3: Retrieve and decrypt journal entry
    const entry = await secureFirestoreClient.getSecureEntry(
      userId,
      entryId,
      validatedSessionId
    );

    if (!entry) {
      throw createApiError(
        ApiErrorCode.NOT_FOUND,
        'Journal entry not found',
        null,
        'The requested journal entry does not exist or you do not have access to it',
        context.requestId
      );
    }

    // Step 4: Prepare response with security metadata
    const response = {
      success: true,
      data: {
        entry: {
          id: entry.id,
          title: entry.title,
          content: entry.content, // Decrypted content
          emotion: entry.emotion,
          mood: entry.mood,
          tags: entry.tags,
          isPrivate: entry.isPrivate,
          createdAt: entry.createdAt.toISOString(),
          updatedAt: entry.updatedAt.toISOString()
        },
        security: {
          decrypted: true,
          accessLogged: true,
          sessionValidated: !!validatedSessionId,
          complianceFrameworks: ['FERPA', 'COPPA', 'GDPR']
        }
      }
    };

    return response;

  } catch (error: any) {
    console.error('[Secure Retrieve API] Failed to retrieve secure journal entry:', error);
    
    // Enhanced error handling
    if (error.message?.includes('encryption not initialized')) {
      throw createApiError(
        ApiErrorCode.SECURITY_ERROR,
        'Security initialization failed',
        error,
        'Unable to access your journal entry securely. Please refresh and try again.',
        context.requestId
      );
    }

    if (error.message?.includes('Failed to decrypt')) {
      throw createApiError(
        ApiErrorCode.SECURITY_ERROR,
        'Decryption failed',
        error,
        'Unable to decrypt your journal entry. The data may be corrupted.',
        context.requestId
      );
    }

    if (error.message?.includes('integrity violation')) {
      throw createApiError(
        ApiErrorCode.SECURITY_ERROR,
        'Data integrity violation',
        error,
        'Journal entry failed security validation. Please contact support.',
        context.requestId
      );
    }

    if (error.code?.includes('permission-denied')) {
      throw createApiError(
        ApiErrorCode.FORBIDDEN,
        'Permission denied to access journal entry',
        error,
        'You do not have permission to access this journal entry',
        context.requestId
      );
    }

    // Check if it's a "not found" error from our custom logic
    if (error.code === ApiErrorCode.NOT_FOUND) {
      throw error; // Re-throw as-is
    }

    throw createApiError(
      ApiErrorCode.SECURITY_ERROR,
      'Failed to retrieve secure journal entry',
      error,
      'Unable to access your journal entry. Please try again.',
      context.requestId
    );
  }
}

// Export secure GET handler
export const GET = createAuthenticatedHandler(retrieveSecureJournalEntry, {
  allowedMethods: ['GET'],
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true,
    securityLogging: true
  },
  security: {
    requireEncryption: true,
    auditLogging: true,
    validateAccess: true
  }
});