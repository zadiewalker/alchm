// ALCHM AI Preferences Management API
// Handles user consent and AI interaction preferences

import { NextRequest } from 'next/server';
import { AIPreferences } from '@/components/AIOptOutToggle';
import { createAuthenticatedHandler, createApiError, ApiErrorCode } from '@/lib/apiWrapper';
import { RequestContext } from '@/lib/apiUtils';
import { validateInput } from '@/lib/security';
import { secureFirestoreClient } from '@/lib/secure-firestore-client';

// GET - Retrieve user's AI preferences
async function getUserAIPreferences(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;

  try {
    // Get user's current AI preferences
    const preferences = await secureFirestoreClient.getDocument('user_ai_preferences', userId);
    
    // Default preferences for new users
    const defaultPreferences: AIPreferences = {
      enableAIAnalysis: true,
      enableAIPrompts: true,
      enableCrisisSafety: true, // Always true for safety
      analogMode: false,
      consentGiven: false,
      lastUpdated: new Date().toISOString()
    };

    return {
      success: true,
      data: {
        preferences: preferences ? { ...defaultPreferences, ...preferences } : defaultPreferences,
        hasSetPreferences: !!preferences,
        aiCapabilities: {
          traumaInformed: true,
          culturallyResponsive: true,
          crisisDetection: true,
          medicalBoundaries: true,
          sessionIsolation: true
        }
      }
    };

  } catch (error: any) {
    console.error('[AI Preferences API] Failed to get preferences:', error);
    throw createApiError(
      ApiErrorCode.DATABASE_ERROR,
      'Failed to retrieve AI preferences',
      error,
      'Unable to load your AI interaction settings',
      context.requestId
    );
  }
}

// PUT - Update user's AI preferences
async function updateUserAIPreferences(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;

  try {
    const body = await req.json();
    const {
      enableAIAnalysis,
      enableAIPrompts,
      enableCrisisSafety,
      analogMode,
      consentGiven
    } = validateInput(body, {
      enableAIAnalysis: { type: 'boolean', required: false },
      enableAIPrompts: { type: 'boolean', required: false },
      enableCrisisSafety: { type: 'boolean', required: false },
      analogMode: { type: 'boolean', required: false },
      consentGiven: { type: 'boolean', required: false }
    });

    // Get current preferences
    const currentPreferences = await secureFirestoreClient.getDocument('user_ai_preferences', userId) || {};

    // Build updated preferences
    const updatedPreferences: AIPreferences = {
      enableAIAnalysis: enableAIAnalysis ?? currentPreferences.enableAIAnalysis ?? true,
      enableAIPrompts: enableAIPrompts ?? currentPreferences.enableAIPrompts ?? true,
      enableCrisisSafety: true, // Always true for safety - cannot be disabled
      analogMode: analogMode ?? currentPreferences.analogMode ?? false,
      consentGiven: consentGiven ?? currentPreferences.consentGiven ?? false,
      lastUpdated: new Date().toISOString()
    };

    // Validation rules
    if (updatedPreferences.analogMode) {
      // If analog mode is enabled, disable AI features
      updatedPreferences.enableAIAnalysis = false;
      updatedPreferences.enableAIPrompts = false;
    }

    // If AI features are enabled, analog mode should be disabled
    if (updatedPreferences.enableAIAnalysis || updatedPreferences.enableAIPrompts) {
      updatedPreferences.analogMode = false;
    }

    // Crisis safety is always enabled regardless of other settings
    updatedPreferences.enableCrisisSafety = true;

    // Save preferences securely
    await secureFirestoreClient.createOrUpdateDocument('user_ai_preferences', userId, updatedPreferences);

    // Log preference change for audit
    await logPreferenceChange(userId, currentPreferences, updatedPreferences, context.requestId);

    return {
      success: true,
      data: {
        preferences: updatedPreferences,
        message: getPreferenceChangeMessage(currentPreferences, updatedPreferences),
        effectiveImmediately: true,
        safetyNote: updatedPreferences.enableCrisisSafety 
          ? 'Crisis safety detection remains active for your protection'
          : undefined
      }
    };

  } catch (error: any) {
    console.error('[AI Preferences API] Failed to update preferences:', error);
    
    if (error.code === ApiErrorCode.BAD_REQUEST) {
      throw error;
    }

    throw createApiError(
      ApiErrorCode.PROCESSING_ERROR,
      'Failed to update AI preferences',
      error,
      'Unable to save your AI interaction settings',
      context.requestId
    );
  }
}

// POST - Record AI consent decision
async function recordAIConsent(req: NextRequest, context: RequestContext) {
  const userId = context.userId!;

  try {
    const body = await req.json();
    const { consentDecision, consentType, metadata } = validateInput(body, {
      consentDecision: { type: 'string', required: true, enum: ['accept', 'decline', 'customize'] },
      consentType: { type: 'string', required: true, enum: ['initial', 'updated', 'withdrawn'] },
      metadata: { type: 'object', required: false }
    });

    const consentRecord = {
      userId,
      consentDecision,
      consentType,
      timestamp: new Date().toISOString(),
      ipAddress: getClientIP(req),
      userAgent: req.headers.get('user-agent') || 'unknown',
      metadata: metadata || {},
      complianceFrameworks: ['FERPA', 'COPPA', 'GDPR'],
      consentId: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Store consent record for compliance
    await secureFirestoreClient.createDocument('ai_consent_records', consentRecord.consentId, consentRecord);

    // Update user preferences based on consent
    let preferences: Partial<AIPreferences> = {};
    
    switch (consentDecision) {
      case 'accept':
        preferences = {
          enableAIAnalysis: true,
          enableAIPrompts: true,
          analogMode: false,
          consentGiven: true
        };
        break;
      case 'decline':
        preferences = {
          enableAIAnalysis: false,
          enableAIPrompts: false,
          analogMode: true,
          consentGiven: true
        };
        break;
      case 'customize':
        preferences = {
          consentGiven: true
        };
        break;
    }

    if (Object.keys(preferences).length > 0) {
      await updateUserPreferences(userId, preferences);
    }

    return {
      success: true,
      data: {
        consentRecord: {
          consentId: consentRecord.consentId,
          decision: consentDecision,
          timestamp: consentRecord.timestamp
        },
        preferences,
        message: getConsentMessage(consentDecision)
      }
    };

  } catch (error: any) {
    console.error('[AI Preferences API] Failed to record consent:', error);
    throw createApiError(
      ApiErrorCode.PROCESSING_ERROR,
      'Failed to record consent decision',
      error,
      'Unable to save your consent preferences',
      context.requestId
    );
  }
}

// Helper functions

async function logPreferenceChange(
  userId: string,
  oldPreferences: any,
  newPreferences: AIPreferences,
  requestId: string
): Promise<void> {
  try {
    const auditLog = {
      userId,
      requestId,
      timestamp: new Date().toISOString(),
      action: 'ai_preferences_updated',
      changes: {
        old: oldPreferences,
        new: newPreferences
      },
      complianceImpact: determineComplianceImpact(oldPreferences, newPreferences)
    };

    await secureFirestoreClient.createDocument('audit_logs', `audit_${Date.now()}`, auditLog);
  } catch (error) {
    console.error('[AI Preferences] Failed to log preference change:', error);
    // Non-critical error, don't throw
  }
}

function determineComplianceImpact(oldPrefs: any, newPrefs: AIPreferences): string[] {
  const impacts: string[] = [];
  
  if (oldPrefs.enableAIAnalysis !== newPrefs.enableAIAnalysis) {
    impacts.push(newPrefs.enableAIAnalysis ? 'ai_analysis_enabled' : 'ai_analysis_disabled');
  }
  
  if (oldPrefs.analogMode !== newPrefs.analogMode) {
    impacts.push(newPrefs.analogMode ? 'analog_mode_enabled' : 'analog_mode_disabled');
  }
  
  if (!oldPrefs.consentGiven && newPrefs.consentGiven) {
    impacts.push('initial_consent_given');
  }

  return impacts;
}

function getPreferenceChangeMessage(oldPrefs: any, newPrefs: AIPreferences): string {
  if (newPrefs.analogMode && !oldPrefs.analogMode) {
    return 'Switched to analog journaling mode. AI analysis is now disabled.';
  }
  
  if (!newPrefs.analogMode && oldPrefs.analogMode) {
    return 'AI assistance is now enabled. You can customize these settings anytime.';
  }
  
  if (newPrefs.enableAIAnalysis && !oldPrefs.enableAIAnalysis) {
    return 'AI analysis and insights are now enabled.';
  }
  
  if (!newPrefs.enableAIAnalysis && oldPrefs.enableAIAnalysis) {
    return 'AI analysis has been disabled. You can still use analog journaling.';
  }

  return 'Your AI interaction preferences have been updated.';
}

function getConsentMessage(decision: string): string {
  switch (decision) {
    case 'accept':
      return 'Thank you for enabling AI assistance. You can customize these settings anytime.';
    case 'decline':
      return 'You have chosen analog journaling. Your privacy is completely protected.';
    case 'customize':
      return 'You can now customize your AI interaction preferences.';
    default:
      return 'Your consent preferences have been recorded.';
  }
}

async function updateUserPreferences(userId: string, preferences: Partial<AIPreferences>): Promise<void> {
  const currentPrefs = await secureFirestoreClient.getDocument('user_ai_preferences', userId) || {};
  const updatedPrefs = {
    ...currentPrefs,
    ...preferences,
    lastUpdated: new Date().toISOString()
  };
  
  await secureFirestoreClient.createOrUpdateDocument('user_ai_preferences', userId, updatedPrefs);
}

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const clientIP = req.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || clientIP || 'unknown';
}

// Export HTTP handlers
export const GET = createAuthenticatedHandler(getUserAIPreferences, {
  allowedMethods: ['GET'],
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true
  }
});

export const PUT = createAuthenticatedHandler(updateUserAIPreferences, {
  allowedMethods: ['PUT'],
  rateLimitConfig: 'standard',
  monitoring: {
    logLevel: 'info',
    performanceTracking: true,
    securityLogging: true
  },
  security: {
    auditLogging: true
  }
});

export const POST = createAuthenticatedHandler(recordAIConsent, {
  allowedMethods: ['POST'],
  rateLimitConfig: 'strict',
  monitoring: {
    logLevel: 'warn',
    performanceTracking: true,
    securityLogging: true
  },
  security: {
    auditLogging: true,
    requireEncryption: true
  }
});