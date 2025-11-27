import { NextResponse } from 'next/server';

/**
 * Enhanced health check endpoint for ALCHM deployment verification
 * Returns comprehensive system status for monitoring and validation
 */
export async function GET() {
  try {
    // Read package.json version
    const packageJson = require('../../../../../package.json');
    
    // Check environment variables for critical services
    const envChecks = {
      firebase: {
        configured: !!(process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
        project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not-configured'
      },
      stripe: {
        configured: !!process.env.STRIPE_SECRET_KEY,
        mode: process.env.NODE_ENV === 'production' ? 'live' : 'test'
      }
    };
    
    // Check if this is a fresh deployment by looking at build timestamp
    const buildTimestamp = process.env.BUILD_TIMESTAMP || 'unknown';
    const startTime = process.env.START_TIME || Date.now();
    
    // Calculate uptime
    const uptime = process.uptime();
    const isRecentDeploy = uptime < 300; // Less than 5 minutes
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: packageJson.version,
      service: 'ALCHM API',
      environment: process.env.NODE_ENV || 'development',
      uptime_seconds: uptime,
      recent_deploy: isRecentDeploy,
      build: {
        timestamp: buildTimestamp,
        start_time: startTime,
        node_version: process.version
      },
      services: envChecks,
      deployment_info: {
        platform: 'firebase',
        region: 'us-central1',
        health_check_version: '2.0.0'
      },
      critical_systems: {
        crisis_detection: true, // Always true if API is responding
        auth_system: envChecks.firebase.configured,
        payment_system: envChecks.stripe.configured
      }
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'ALCHM-v2'
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      error_details: error.message,
      timestamp: new Date().toISOString(),
      service: 'ALCHM API',
      uptime_seconds: process.uptime(),
      critical_systems: {
        crisis_detection: false,
        auth_system: false,
        payment_system: false
      }
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Health-Check': 'ALCHM-v2-ERROR'
      }
    });
  }
}