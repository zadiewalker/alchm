// API route for error reporting in ALCHM
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logging'
import { monitoring } from '@/lib/monitoring'
import { ErrorSeverity, ErrorCategory } from '@/lib/errorHandling'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Validate error data
    if (!errorData.errorId || !errorData.error) {
      return NextResponse.json(
        { success: false, error: 'Invalid error data' },
        { status: 400 }
      )
    }

    // Log the error report
    logger.error('Client error reported', new Error('Client error reported'), {
      errorId: errorData.errorId,
      errorCode: errorData.error.code,
      userId: errorData.error.userId,
      sessionId: errorData.error.sessionId,
      url: errorData.error.url,
      userAgent: errorData.error.userAgent,
      buildId: errorData.error.buildId,
      retryCount: errorData.context?.retryCount || 0,
      level: errorData.context?.level || 'unknown'
    }, {
      component: 'error_reporting',
      action: 'client_error_reported'
    })

    // Record error in monitoring system
    const errorForMonitoring = {
      id: errorData.errorId,
      code: errorData.error.code || 'UNKNOWN_ERROR',
      message: errorData.error.message || 'Unknown error',
      severity: mapSeverityFromClient(errorData.error.severity),
      category: mapCategoryFromClient(errorData.error.category),
      context: {
        userId: errorData.error.userId,
        sessionId: errorData.error.sessionId,
        url: errorData.error.url,
        userAgent: errorData.error.userAgent,
        buildId: errorData.error.buildId,
        timestamp: errorData.error.timestamp
      },
      stack: errorData.error.stack,
      retryable: errorData.error.retryable || false
    }

    monitoring.recordError(errorForMonitoring)

    // Check if this is a critical error pattern
    await checkForCriticalPatterns(errorData)

    // Store error for analysis (you might want to store in Firebase/database)
    await storeErrorForAnalysis(errorData)

    return NextResponse.json({
      success: true,
      errorId: errorData.errorId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in error reporting endpoint:', error)
    
    // Log the error reporting failure
    logger.error('Failed to process error report', error instanceof Error ? error : new Error(String(error)), {
      endpoint: '/api/errors/report'
    }, {
      component: 'error_reporting',
      action: 'report_processing_failed'
    })

    return NextResponse.json(
      { success: false, error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}

// Helper function to map client severity to server severity
function mapSeverityFromClient(clientSeverity: string): ErrorSeverity {
  const severityMap: Record<string, ErrorSeverity> = {
    'low': ErrorSeverity.LOW,
    'medium': ErrorSeverity.MEDIUM,
    'high': ErrorSeverity.HIGH,
    'critical': ErrorSeverity.CRITICAL
  }
  
  return severityMap[clientSeverity] || ErrorSeverity.MEDIUM
}

// Helper function to map client category to server category
function mapCategoryFromClient(clientCategory: string): ErrorCategory {
  const categoryMap: Record<string, ErrorCategory> = {
    'authentication': ErrorCategory.AUTHENTICATION,
    'authorization': ErrorCategory.AUTHORIZATION,
    'network': ErrorCategory.NETWORK,
    'validation': ErrorCategory.VALIDATION,
    'business_logic': ErrorCategory.BUSINESS_LOGIC,
    'system': ErrorCategory.SYSTEM,
    'performance': ErrorCategory.PERFORMANCE,
    'security': ErrorCategory.SECURITY,
    'user_input': ErrorCategory.USER_INPUT,
    'third_party': ErrorCategory.THIRD_PARTY
  }
  
  return categoryMap[clientCategory] || ErrorCategory.SYSTEM
}

// Check for critical error patterns that need immediate attention
async function checkForCriticalPatterns(errorData: any) {
  const { error, context } = errorData
  
  // Check for security-related errors
  if (error.category === 'security' || error.message?.includes('security')) {
    logger.warn('Security-related error detected', {
      errorId: errorData.errorId,
      securityContext: {
        userId: error.userId,
        url: error.url,
        userAgent: error.userAgent,
        message: error.message
      }
    }, {
      component: 'security_monitoring',
      action: 'security_error_detected'
    })
  }
  
  // Check for widespread errors (affecting multiple users)
  if (error.category === 'system' && error.severity === 'critical') {
    // This would check if many users are experiencing the same error
    logger.fatal('Critical system error reported', new Error('Critical system error'), {
      errorId: errorData.errorId,
      errorCode: error.code,
      message: error.message
    }, {
      component: 'system_monitoring',
      action: 'critical_system_error'
    })
  }
  
  // Check for authentication failures spike
  if (error.category === 'authentication' && context?.retryCount > 3) {
    logger.warn('Multiple authentication failures detected', {
      errorId: errorData.errorId,
      userId: error.userId,
      retryCount: context.retryCount
    }, {
      component: 'auth_monitoring',
      action: 'auth_failure_spike'
    })
  }
}

// Store error for detailed analysis
async function storeErrorForAnalysis(errorData: any) {
  try {
    // In a real implementation, you would store this in your database
    // For now, we'll just structure the data for potential storage
    
    const errorRecord = {
      id: errorData.errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: errorData.error.name,
        message: errorData.error.message,
        code: errorData.error.code,
        stack: errorData.error.stack,
        severity: errorData.error.severity,
        category: errorData.error.category
      },
      context: {
        userId: errorData.error.userId,
        sessionId: errorData.error.sessionId,
        url: errorData.error.url,
        userAgent: errorData.error.userAgent,
        buildId: errorData.error.buildId,
        boundary: errorData.error.boundary,
        retryCount: errorData.context?.retryCount || 0,
        level: errorData.context?.level
      },
      componentStack: errorData.errorInfo?.componentStack,
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
    }
    
    // Log structured error data for analysis
    logger.info('Error stored for analysis', {
      errorId: errorData.errorId,
      category: errorData.error.category,
      severity: errorData.error.severity
    }, {
      component: 'error_analysis',
      action: 'error_stored'
    })
    
    // You could also:
    // - Store in Firebase Firestore
    // - Send to external error tracking service (Sentry, etc.)
    // - Queue for batch processing
    // - Trigger alerts for critical errors
    
  } catch (storageError) {
    console.error('Failed to store error for analysis:', storageError)
  }
}