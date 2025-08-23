// Enhanced journal entry save API with comprehensive error handling and security
import { NextRequest } from 'next/server';
import { firestoreClient } from '@/lib/firestoreClient';
import { createAuthenticatedHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';

// Input validation schema
const SAVE_VALIDATION = {
  body: {
    emotion: { required: false, type: 'string', maxLength: 50 },
    content: { required: true, type: 'string', minLength: 1, maxLength: 10000 },
    title: { required: false, type: 'string', maxLength: 200 },
    isPrivate: { required: false, type: 'boolean' },
    tags: { required: false, type: 'object' }, // Array validation would need enhancement
    mood: { required: false, type: 'string', maxLength: 20 }
  }
};

async function saveJournalEntry(req: NextRequest, context: RequestContext) {
  const { body } = await validateAndExtractInput(req);
  const userId = context.userId!; // Guaranteed by authenticated handler

  try {
    // Create journal entry using enhanced Firestore client
    const entryId = await firestoreClient.createEntry({
      userId,
      title: body.title || generateTitleFromContent(body.content),
      content: body.content,
      emotion: body.emotion,
      mood: body.mood,
      tags: Array.isArray(body.tags) ? body.tags : [],
      isPrivate: body.isPrivate !== false // Default to private
    });

    return {
      success: true,
      data: {
        id: entryId,
        message: 'Journal entry saved successfully'
      }
    };

  } catch (error: any) {
    console.error('[Save API] Failed to save journal entry:', error);
    
    if (error.code?.includes('permission-denied')) {
      throw createApiError(
        ApiErrorCode.FORBIDDEN,
        'Permission denied to save journal entry',
        error,
        'You do not have permission to save journal entries',
        context.requestId
      );
    }

    if (error.code?.includes('quota-exceeded')) {
      throw createApiError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        'Storage quota exceeded',
        error,
        'Unable to save journal entry due to storage limits',
        context.requestId
      );
    }

    throw createApiError(
      ApiErrorCode.DATABASE_ERROR,
      'Failed to save journal entry',
      error,
      'Unable to save your journal entry at this time. Please try again.',
      context.requestId
    );
  }
}

// Helper function to validate and extract input
async function validateAndExtractInput(req: NextRequest) {
  try {
    const body = await req.json();
    return { body };
  } catch (error) {
    throw createApiError(
      ApiErrorCode.BAD_REQUEST,
      'Invalid JSON in request body',
      error,
      'Please check your request format and try again'
    );
  }
}

// Helper function to generate title from content
function generateTitleFromContent(content: string): string {
  const words = content.trim().split(/\s+/);
  const title = words.slice(0, 8).join(' ');
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
}

// Export enhanced POST handler
export const POST = createAuthenticatedHandler(saveJournalEntry, {
  allowedMethods: ['POST'],
  validation: SAVE_VALIDATION,
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true
  },
  security: {
    maxRequestSize: 50 * 1024 // 50KB limit for journal entries
  }
});
