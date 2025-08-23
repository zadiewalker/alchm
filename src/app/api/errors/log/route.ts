// API route for error logging in ALCHM
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logging'
import { monitoring } from '@/lib/monitoring'
import { ErrorSeverity, ErrorCategory } from '@/lib/errorHandling'

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json()
    
    // Validate log data
    if (!logData.id || !logData.level || !logData.message) {
      return NextResponse.json(
        { success: false, error: 'Invalid log data' },
        { status: 400 }
      )
    }

    // Process the log entry based on level
    switch (logData.level) {
      case 'debug':
        logger.debug(logData.message, logData.metadata, logData.context)
        break
      case 'info':
        logger.info(logData.message, logData.metadata, logData.context)
        break
      case 'warn':
        logger.warn(logData.message, logData.metadata, logData.context)
        break
      case 'error':
        const error = logData.error ? new Error(logData.error.message) : undefined
        if (error && logData.error.stack) {
          error.stack = logData.error.stack
        }
        logger.error(logData.message, error, logData.metadata, logData.context)
        
        // Record error in monitoring system
        if (logData.error) {
          monitoring.recordError({
            id: logData.id,
            code: logData.error.code || 'CLIENT_ERROR',
            message: logData.message,
            severity: ErrorSeverity.MEDIUM,
            category: ErrorCategory.SYSTEM,
            context: logData.context || {},
            stack: logData.error.stack,
            retryable: false
          })
        }
        break
      case 'fatal':
        const fatalError = logData.error ? new Error(logData.error.message) : undefined
        if (fatalError && logData.error.stack) {
          fatalError.stack = logData.error.stack
        }
        logger.fatal(logData.message, fatalError, logData.metadata, logData.context)
        
        // Record critical error in monitoring
        if (logData.error) {
          monitoring.recordError({
            id: logData.id,
            code: logData.error.code || 'FATAL_ERROR',
            message: logData.message,
            severity: ErrorSeverity.CRITICAL,
            category: ErrorCategory.SYSTEM,
            context: logData.context || {},
            stack: logData.error.stack,
            retryable: false
          })
        }
        break
      default:
        logger.info(logData.message, logData.metadata, logData.context)
    }

    // Process special log types
    if (logData.metadata?.type) {
      await processSpecialLogType(logData)
    }

    return NextResponse.json({
      success: true,
      logId: logData.id,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in log processing endpoint:', error)
    
    // Log the logging failure (meta!)
    logger.error('Failed to process log entry', error instanceof Error ? error : new Error(String(error)), {
      endpoint: '/api/errors/log'
    }, {
      component: 'log_processing',
      action: 'log_processing_failed'
    })

    return NextResponse.json(
      { success: false, error: 'Failed to process log entry' },
      { status: 500 }
    )
  }
}

// Process special log types with additional handling
async function processSpecialLogType(logData: any) {
  const { metadata } = logData
  
  switch (metadata.type) {
    case 'performance':
      // Handle performance metrics
      if (metadata.metric && typeof metadata.value === 'number') {
        monitoring.recordPerformanceMetric(metadata.metric, metadata.value)
        
        logger.info('Performance metric recorded via log', {
          metric: metadata.metric,
          value: metadata.value,
          logId: logData.id
        }, {
          component: 'performance_logging',
          action: 'metric_recorded'
        })
      }
      break
      
    case 'security':
      // Handle security events
      if (metadata.event && metadata.severity) {
        logger.warn('Security event logged', {
          event: metadata.event,
          severity: metadata.severity,
          logId: logData.id,
          userId: logData.context?.userId,
          url: logData.context?.url
        }, {
          component: 'security_logging',
          action: 'security_event_logged'
        })
        
        // Record in monitoring for alerting
        monitoring.recordError({
          id: logData.id,
          code: `SECURITY_${metadata.event.toUpperCase()}`,
          message: logData.message,
          severity: metadata.severity === 'high' ? ErrorSeverity.CRITICAL : ErrorSeverity.MEDIUM,
          category: ErrorCategory.SECURITY,
          context: logData.context || {},
          retryable: false
        })
      }
      break
      
    case 'api_call':
      // Handle API call logging
      if (metadata.endpoint && metadata.method && metadata.status && metadata.duration) {
        monitoring.recordAPICall(
          metadata.endpoint,
          metadata.status,
          metadata.duration
        )
        
        logger.info('API call logged', {
          endpoint: metadata.endpoint,
          method: metadata.method,
          status: metadata.status,
          duration: metadata.duration,
          logId: logData.id
        }, {
          component: 'api_logging',
          action: 'api_call_logged'
        })
      }
      break
      
    case 'user_action':
      // Handle user action logging
      if (metadata.action && metadata.userId) {
        monitoring.recordUserAction(
          metadata.action,
          metadata.userId,
          metadata.success !== false
        )
        
        logger.info('User action logged', {
          action: metadata.action,
          userId: metadata.userId,
          success: metadata.success !== false,
          logId: logData.id
        }, {
          component: 'user_logging',
          action: 'user_action_logged'
        })
      }
      break
      
    case 'business':
      // Handle business metrics
      if (metadata.metric && typeof metadata.value === 'number') {
        monitoring.recordBusinessMetric(
          metadata.metric,
          metadata.value,
          metadata
        )
        
        logger.info('Business metric logged', {
          metric: metadata.metric,
          value: metadata.value,
          logId: logData.id
        }, {
          component: 'business_logging',
          action: 'business_metric_logged'
        })
      }
      break
      
    default:
      // No special processing needed
      break
  }
}

// GET endpoint to retrieve recent logs (for debugging)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const userId = searchParams.get('userId')
    const component = searchParams.get('component')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // In a real implementation, you would query your log storage
    // For now, return a placeholder response
    
    logger.info('Log retrieval requested', {
      level,
      userId,
      component,
      limit
    }, {
      component: 'log_retrieval',
      action: 'logs_requested'
    })
    
    return NextResponse.json({
      success: true,
      logs: [], // This would contain actual log entries
      filters: { level, userId, component, limit },
      message: 'Log retrieval endpoint - implement with your log storage solution'
    })
    
  } catch (error) {
    console.error('Error in log retrieval endpoint:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve logs' },
      { status: 500 }
    )
  }
}