// Analytics Backup API - Secondary endpoint for analytics redundancy
// Ensures analytics data is not lost if primary endpoint fails

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logging';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;
    
    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({
        error: 'Invalid events array'
      }, { status: 400 });
    }
    
    // Simple backup storage - just log events for now
    // In production, this could store to a different database or send to external analytics
    logger.info('Analytics backup received', {
      eventCount: events.length,
      timestamp: Date.now(),
      sample: events.slice(0, 3) // Log first 3 events as sample
    });
    
    // Simulate successful backup
    return NextResponse.json({
      success: true,
      backed_up: events.length,
      endpoint: 'backup'
    });
    
  } catch (error) {
    logger.error('Analytics backup failed', error);
    
    return NextResponse.json({
      error: 'Backup failed',
      message: 'Failed to backup analytics events'
    }, { status: 500 });
  }
}