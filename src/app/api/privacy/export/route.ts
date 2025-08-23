// Data Export API - GDPR/CCPA data portability rights
// Generates secure data exports for users

import { NextRequest, NextResponse } from 'next/server';
import { privacyManager } from '@/lib/analytics/privacy-manager';
import { auth } from '@/lib/firebaseAdmin';
import { logger } from '@/lib/logging';
import { z } from 'zod';

const DataExportSchema = z.object({
  userId: z.string(),
  dataTypes: z.array(z.enum(['profile', 'journal_entries', 'ai_insights', 'analytics', 'all']))
});

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const validationResult = DataExportSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Invalid request format',
        details: validationResult.error.errors
      }, { status: 400 });
    }

    const { userId, dataTypes } = validationResult.data;

    // Verify user authentication
    const sessionCookie = request.cookies.get('alchm_session')?.value;
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    
    // Ensure user can only export their own data
    if (decodedClaims.uid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check rate limiting (one export per day per user)
    const existingRequests = await checkExistingExportRequests(userId);
    if (existingRequests.recentRequest) {
      return NextResponse.json({
        error: 'Export request limit exceeded',
        message: 'You can only request one data export per day',
        nextAllowedAt: existingRequests.nextAllowedAt
      }, { status: 429 });
    }

    // Create data export request
    const requestId = await privacyManager.requestDataExport(userId, dataTypes);

    // Log the export request for compliance
    logger.info('Data export requested', {
      userId,
      requestId,
      dataTypes,
      timestamp: Date.now(),
      ipAddress: getClientIP(request)
    });

    return NextResponse.json({
      success: true,
      requestId,
      message: 'Data export request created successfully',
      estimatedCompletion: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });

  } catch (error) {
    logger.error('Failed to create data export request', error);
    
    return NextResponse.json({
      error: 'Failed to create data export request'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get export status
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

    // Get export request status
    const exportStatus = await getExportRequestStatus(requestId, userId);

    if (!exportStatus) {
      return NextResponse.json({
        error: 'Export request not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      status: exportStatus.status,
      downloadUrl: exportStatus.downloadUrl,
      expiresAt: exportStatus.expiresAt,
      completedAt: exportStatus.completedAt
    });

  } catch (error) {
    logger.error('Failed to get export status', error);
    
    return NextResponse.json({
      error: 'Failed to get export status'
    }, { status: 500 });
  }
}

// Helper functions

async function checkExistingExportRequests(userId: string): Promise<{
  recentRequest: boolean;
  nextAllowedAt?: number;
}> {
  // Check for recent export requests (within 24 hours)
  const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
  
  try {
    // In a real implementation, query the database for recent requests
    // For now, return no recent requests
    return { recentRequest: false };
  } catch (error) {
    logger.error('Failed to check existing export requests', error);
    return { recentRequest: false };
  }
}

async function getExportRequestStatus(requestId: string, userId: string): Promise<any> {
  try {
    // In a real implementation, query the database for export status
    // For now, return a mock response
    return {
      status: 'processing',
      downloadUrl: null,
      expiresAt: null,
      completedAt: null
    };
  } catch (error) {
    logger.error('Failed to get export request status', error);
    return null;
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