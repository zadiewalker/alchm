// Data Deletion API - GDPR/CCPA right to erasure
// Handles user data deletion requests with compliance safeguards

import { NextRequest, NextResponse } from 'next/server';
import { privacyManager } from '@/lib/analytics/privacy-manager';
import { auth } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';
import { z } from 'zod';

const DataDeletionSchema = z.object({
  userId: z.string(),
  deletionType: z.enum(['partial', 'complete']),
  reason: z.string().min(1).max(500),
  confirmationToken: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const validationResult = DataDeletionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const { userId, deletionType, reason } = validationResult.data;

    // Verify user authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Ensure user can only delete their own data
    if (decodedClaims.uid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check for active subscriptions or legal retention requirements
    const retentionCheck = await checkRetentionRequirements(userId);
    
    if (retentionCheck.hasRetentionRequirements && deletionType === 'complete') {
      return NextResponse.json({
        error: 'Complete deletion not allowed',
        message: 'Some data must be retained for legal or business reasons',
        retentionReasons: retentionCheck.reasons,
        allowedDeletionType: 'partial'
      }, { status: 409 });
    }

    // Check rate limiting (prevent abuse)
    const recentDeletionRequest = await checkRecentDeletionRequests(userId);
    if (recentDeletionRequest) {
      return NextResponse.json({
        error: 'Deletion request in progress',
        message: 'You already have a pending deletion request'
      }, { status: 429 });
    }

    // Create deletion request
    const requestId = await privacyManager.requestDataDeletion(userId, deletionType, reason);

    // Log the deletion request for compliance audit
    logger.info('Data deletion requested', {
      userId,
      requestId,
      deletionType,
      reason,
      timestamp: Date.now(),
      ipAddress: getClientIP(request),
      userAgent: request.headers.get('user-agent')?.substring(0, 200) || 'unknown'
    });

    // Send notification email (in production)
    await sendDeletionConfirmationEmail(userId, requestId, deletionType);

    return NextResponse.json({
      success: true,
      requestId,
      message: deletionType === 'complete' 
        ? 'Complete data deletion request created. This will permanently delete all your data.'
        : 'Partial data deletion request created. Personal data will be deleted while preserving anonymized analytics.',
      estimatedCompletion: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      retentionPeriod: deletionType === 'partial' ? '30 days for backup recovery' : 'Immediate permanent deletion'
    });

  } catch (error) {
    logger.error('Failed to create data deletion request', error);
    
    return NextResponse.json({
      error: 'Failed to create data deletion request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get deletion status
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get('requestId');

    if (!requestId) {
      return NextResponse.json({
        error: 'Request ID is required'
      }, { status: 400 });
    }

    // Verify user authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userId = decodedClaims.uid;

    // Get deletion request status
    const deletionStatus = await getDeletionRequestStatus(requestId, userId);

    if (!deletionStatus) {
      return NextResponse.json({
        error: 'Deletion request not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      status: deletionStatus.status,
      deletionType: deletionStatus.deletionType,
      completedAt: deletionStatus.completedAt,
      retentionExceptions: deletionStatus.retentionExceptions
    });

  } catch (error) {
    logger.error('Failed to get deletion status', error);
    
    return NextResponse.json({
      error: 'Failed to get deletion status'
    }, { status: 500 });
  }
}

// Helper functions

async function checkRetentionRequirements(userId: string): Promise<{
  hasRetentionRequirements: boolean;
  reasons: string[];
}> {
  try {
    const reasons: string[] = [];

    // Check for active subscription
    const hasActiveSubscription = await checkActiveSubscription(userId);
    if (hasActiveSubscription) {
      reasons.push('Active subscription - financial records must be retained');
    }

    // Check for recent payments (tax/legal requirements)
    const hasRecentPayments = await checkRecentPayments(userId);
    if (hasRecentPayments) {
      reasons.push('Recent payments - financial records retained for 7 years per tax law');
    }

    // Check for legal holds or investigations
    const hasLegalHold = await checkLegalHold(userId);
    if (hasLegalHold) {
      reasons.push('Legal hold - data retention required by law enforcement or litigation');
    }

    return {
      hasRetentionRequirements: reasons.length > 0,
      reasons
    };

  } catch (error) {
    logger.error('Failed to check retention requirements', error);
    // Fail safe - assume no retention requirements
    return { hasRetentionRequirements: false, reasons: [] };
  }
}

async function checkActiveSubscription(userId: string): Promise<boolean> {
  try {
    // In a real implementation, check for active Stripe subscriptions
    // For now, return false
    return false;
  } catch (error) {
    return false;
  }
}

async function checkRecentPayments(userId: string): Promise<boolean> {
  try {
    // Check for payments within the last 7 years (typical tax retention period)
    const sevenYearsAgo = Date.now() - (7 * 365 * 24 * 60 * 60 * 1000);
    
    // In a real implementation, query payment records
    // For now, return false
    return false;
  } catch (error) {
    return false;
  }
}

async function checkLegalHold(userId: string): Promise<boolean> {
  try {
    // Check for any legal holds or ongoing investigations
    // In a real implementation, this would check a legal holds database
    return false;
  } catch (error) {
    return false;
  }
}

async function checkRecentDeletionRequests(userId: string): Promise<boolean> {
  try {
    // Check for deletion requests in the last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // In a real implementation, query deletion requests
    // For now, return false
    return false;
  } catch (error) {
    return false;
  }
}

async function getDeletionRequestStatus(requestId: string, userId: string): Promise<any> {
  try {
    // In a real implementation, query the database for deletion status
    // For now, return a mock response
    return {
      status: 'pending',
      deletionType: 'partial',
      completedAt: null,
      retentionExceptions: []
    };
  } catch (error) {
    logger.error('Failed to get deletion request status', error);
    return null;
  }
}

async function sendDeletionConfirmationEmail(
  userId: string, 
  requestId: string, 
  deletionType: string
): Promise<void> {
  try {
    // In a real implementation, send email confirmation
    logger.info('Deletion confirmation email sent', {
      userId,
      requestId,
      deletionType,
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Failed to send deletion confirmation email', error);
  }
}

function getClientIP(request: NextRequest): string {
  // Get client IP address for logging (anonymized)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  let ip = forwarded || realIP || 'unknown';
  
  // Anonymize IP address for privacy
  if (ip !== 'unknown') {
    const parts = ip.split('.');
    if (parts.length === 4) {
      // Replace last octet with 0 for IPv4
      ip = `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    } else {
      // For IPv6 or other formats, just mark as anonymized
      ip = 'anonymized';
    }
  }
  
  return ip;
}