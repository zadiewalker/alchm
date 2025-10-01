import { NextResponse } from 'next/server';

/**
 * Health check endpoint for ALCHM
 * Returns system status for monitoring and validation
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'ALCHM API',
      uptime: process.uptime(),
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}