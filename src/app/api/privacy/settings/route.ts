// Privacy Settings API - Manage user privacy preferences
// GDPR/CCPA compliant privacy settings management

import { NextRequest, NextResponse } from 'next/server';
import { privacyManager } from '@/lib/analytics/privacy-manager';
import { auth } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';
import { z } from 'zod';

const PrivacySettingsSchema = z.object({
  analyticsConsent: z.boolean(),
  performanceTracking: z.boolean(),
  marketingAnalytics: z.boolean(),
  anonymizedUsageData: z.boolean(),
  crossDeviceTracking: z.boolean(),
  dataRetentionPeriod: z.number().min(30).max(3650), // 30 days to 10 years
  allowResearchParticipation: z.boolean(),
  shareAggregatedInsights: z.boolean()
});

const UpdatePrivacySettingsSchema = z.object({
  userId: z.string(),
  settings: PrivacySettingsSchema
});

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get current privacy settings
    const settings = await privacyManager.getPrivacySettings(userId);

    return NextResponse.json({
      success: true,
      settings
    });

  } catch (error) {
    logger.error('Failed to get privacy settings', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve privacy settings'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const validationResult = UpdatePrivacySettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const { userId, settings } = validationResult.data;

    // Verify user authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Ensure user can only update their own settings
    if (decodedClaims.uid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update privacy settings
    await privacyManager.updatePrivacySettings(userId, settings);

    // Log the settings update for compliance
    logger.info('Privacy settings updated', {
      userId,
      settingsChanged: Object.keys(settings),
      timestamp: Date.now(),
      source: 'user_request'
    });

    return NextResponse.json({
      success: true,
      message: 'Privacy settings updated successfully'
    });

  } catch (error) {
    logger.error('Failed to update privacy settings', error);
    
    return NextResponse.json({
      error: 'Failed to update privacy settings'
    }, { status: 500 });
  }
}