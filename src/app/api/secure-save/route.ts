// ALCHM Secure Save API - FERPA/COPPA Compliant Journal Storage
import { NextRequest } from 'next/server';
import { secureFirestoreClient } from '@/lib/secure-firestore-client';
import { aiSessionManager } from '@/lib/ai-session-isolation';
import { createAuthenticatedHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';

// Enhanced input validation for security compliance
const SECURE_SAVE_VALIDATION = {
  body: {
    emotion: { required: false, type: 'string', maxLength: 50 },
    content: { required: true, type: 'string', minLength: 1, maxLength: 10000 },
    title: { required: false, type: 'string', maxLength: 200 },
    isPrivate: { required: false, type: 'boolean' },
    tags: { required: false, type: 'object' },
    mood: { required: false, type: 'string', maxLength: 20 },
    sessionId: { required: false, type: 'string', maxLength: 100 } // AI session tracking
  }
};

async function saveSecureJournalEntry(req: NextRequest, context: RequestContext) {
  const { body } = await validateAndExtractInput(req);
  const userId = context.userId!;

  try {
    // Step 1: Initialize user encryption if not already done
    const userAuthToken = context.authToken || 'fallback_token';
    await secureFirestoreClient.initializeUserEncryption(userId, userAuthToken);

    // Step 2: Validate AI session if provided
    let validatedSessionId: string | undefined;
    if (body.sessionId) {
      const isValidSession = await aiSessionManager.isSessionValid(body.sessionId);
      if (isValidSession) {
        validatedSessionId = body.sessionId;
      }
    }

    // Step 3: Create secure journal entry with full compliance pipeline
    const entryId = await secureFirestoreClient.createSecureEntry(
      userId,
      {
        title: body.title || generateTitleFromContent(body.content),
        content: body.content, // Will be encrypted and PII-redacted
        emotion: body.emotion,
        mood: body.mood,
        tags: Array.isArray(body.tags) ? body.tags : [],
        isPrivate: body.isPrivate !== false // Default to private for student safety
      },
      validatedSessionId
    );

    // Step 4: Get compliance statistics for response
    const complianceStats = await secureFirestoreClient.getComplianceStats(userId);

    return {
      success: true,
      data: {
        id: entryId,
        message: 'Journal entry securely saved with privacy protection',
        compliance: {
          encrypted: true,
          piiProtected: true,
          frameworks: ['FERPA', 'COPPA', 'GDPR'],
          sessionId: validatedSessionId
        },
        stats: complianceStats
      }
    };

  } catch (error: any) {
    console.error('[Secure Save API] Failed to save secure journal entry:', error);
    
    // Enhanced error handling with compliance considerations
    if (error.message?.includes('encryption not initialized')) {
      throw createApiError(
        ApiErrorCode.SECURITY_ERROR,
        'Security initialization failed',
        error,
        'Unable to secure your journal entry. Please refresh and try again.',
        context.requestId
      );
    }

    if (error.message?.includes('PII detection failed')) {
      throw createApiError(
        ApiErrorCode.VALIDATION_ERROR,
        'Content validation failed',
        error,
        'Your entry contains information that cannot be safely stored. Please review and try again.',
        context.requestId
      );
    }

    if (error.code?.includes('permission-denied')) {
      throw createApiError(
        ApiErrorCode.FORBIDDEN,
        'Permission denied to save secure journal entry',
        error,
        'You do not have permission to save journal entries',
        context.requestId
      );
    }

    throw createApiError(
      ApiErrorCode.SECURITY_ERROR,
      'Failed to save secure journal entry',
      error,
      'Unable to securely save your journal entry. Please try again.',
      context.requestId
    );
  }
}

// Enhanced input validation with security checks
async function validateAndExtractInput(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic security validation
    if (typeof body.content === 'string') {
      // Check for potential injection attempts
      const suspiciousPatterns = [
        /<script[^>]*>/i,
        /javascript:/i,
        /data:text\/html/i,
        /vbscript:/i
      ];
      
      const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
        pattern.test(body.content)
      );
      
      if (hasSuspiciousContent) {
        throw new Error('Content contains potentially unsafe elements');
      }
    }
    
    return { body };
  } catch (error) {
    throw createApiError(
      ApiErrorCode.BAD_REQUEST,
      'Invalid or unsafe JSON in request body',
      error,
      'Please check your request format and content safety'
    );
  }
}

// Helper function to generate secure title
function generateTitleFromContent(content: string): string {
  // Remove any potential PII from title generation
  const words = content
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]') // Remove emails
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]') // Remove phone numbers
    .trim()
    .split(/\s+/);
    
  const title = words.slice(0, 6).join(' '); // Shorter titles for privacy
  return title.length > 40 ? title.substring(0, 37) + '...' : title;
}

// Export secure POST handler with enhanced security
export const POST = createAuthenticatedHandler(saveSecureJournalEntry, {
  allowedMethods: ['POST'],
  validation: SECURE_SAVE_VALIDATION,
  rateLimitConfig: 'strict', // Enhanced rate limiting for security
  monitoring: {
    logLevel: 'info',
    performanceTracking: true,
    securityLogging: true
  },
  security: {
    maxRequestSize: 25 * 1024, // Reduced size for security (25KB)
    requireEncryption: true,
    validatePII: true,
    auditLogging: true
  }
});