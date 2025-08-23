// Health status API endpoint for ALCHM
import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/monitoring'
import { logger } from '@/lib/logging'

export async function GET(request: NextRequest) {
  try {
    // Perform comprehensive health check
    const healthCheck = await monitoring.performHealthCheck()
    
    // Log health check
    logger.info('Health check performed', {
      status: healthCheck.status,
      checks: healthCheck.checks,
      metrics: healthCheck.metrics
    }, {
      component: 'health_check',
      action: 'health_check_performed'
    })

    // Determine HTTP status code based on health
    let statusCode = 200
    if (healthCheck.status === 'degraded') {
      statusCode = 206 // Partial Content
    } else if (healthCheck.status === 'unhealthy') {
      statusCode = 503 // Service Unavailable
    }

    return NextResponse.json({
      status: healthCheck.status,
      timestamp: new Date().toISOString(),
      checks: healthCheck.checks,
      metrics: healthCheck.metrics,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      activeAlerts: monitoring.getActiveAlerts().length
    }, { status: statusCode })

  } catch (error) {
    console.error('Health check failed:', error)
    
    logger.error('Health check failed', error instanceof Error ? error : new Error(String(error)), {
      endpoint: '/api/health/status'
    }, {
      component: 'health_check',
      action: 'health_check_failed'
    })

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {
        database: false,
        api: false,
        performance: false,
        errors: false
      }
    }, { status: 503 })
  }
}

// Simple ping endpoint for basic availability checks
export async function HEAD(request: NextRequest) {
  try {
    // Basic health check - just verify the service is responding
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Health-Status': 'ok',
        'X-Timestamp': new Date().toISOString(),
        'X-Version': process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
      }
    })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}