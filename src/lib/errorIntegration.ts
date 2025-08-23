// Error handling integration and setup for ALCHM
import { setupGlobalErrorHandling, ErrorHandler } from './errorHandling'
import { logger, structuredLogger } from './logging'
import { monitoring } from './monitoring'

// Initialize comprehensive error handling system
export function initializeErrorHandling(): void {
  if (typeof window === 'undefined') return

  console.log('🛡️ Initializing ALCHM Error Handling System...')

  // Setup global error handlers
  setupGlobalErrorHandling()

  // Setup React error boundary reporting
  setupReactErrorReporting()

  // Setup network error monitoring
  setupNetworkErrorMonitoring()

  // Setup performance error detection
  setupPerformanceErrorDetection()

  // Setup Firebase error monitoring
  setupFirebaseErrorMonitoring()

  // Setup user feedback collection
  setupUserFeedbackCollection()

  console.log('✅ Error handling system initialized')
}

// Setup React error boundary reporting
function setupReactErrorReporting(): void {
  // Listen for error boundary reports
  window.addEventListener('react-error-boundary', ((event: CustomEvent) => {
    const { error, errorInfo, errorId } = event.detail
    
    const errorHandler = ErrorHandler.getInstance()
    const alchmError = errorHandler.handleUnexpectedError(error, {
      component: 'react_boundary',
      action: 'boundary_caught',
      errorId,
      componentStack: errorInfo?.componentStack
    })

    logger.error('React error boundary triggered', error, {
      errorId: alchmError.id,
      boundaryError: true
    }, {
      component: 'error_boundary',
      action: 'error_caught'
    })

    monitoring.recordError(alchmError)
  }) as EventListener)
}

// Setup network error monitoring
function setupNetworkErrorMonitoring(): void {
  // Override fetch to monitor network errors
  const originalFetch = window.fetch
  
  window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
    const startTime = performance.now()
    const url = typeof input === 'string' ? input : input.toString()
    
    try {
      const response = await originalFetch(input, init)
      const duration = performance.now() - startTime
      
      // Record API call metrics
      monitoring.recordAPICall(url, response.status, duration)
      
      // Log API calls
      structuredLogger.logger.logAPICall(
        url,
        init?.method || 'GET',
        response.status,
        duration
      )
      
      // Handle error responses
      if (!response.ok) {
        const errorHandler = ErrorHandler.getInstance()
        const apiError = errorHandler.handleAPIError(response, {
          url,
          method: init?.method || 'GET',
          duration
        })
        
        monitoring.recordError(apiError)
      }
      
      return response
      
    } catch (error) {
      const duration = performance.now() - startTime
      const errorHandler = ErrorHandler.getInstance()
      
      const networkError = errorHandler.handleNetworkError(
        error instanceof Error ? error : new Error(String(error)),
        {
          url,
          method: init?.method || 'GET',
          duration
        }
      )
      
      logger.error('Network request failed', error instanceof Error ? error : new Error(String(error)), {
        url,
        method: init?.method || 'GET',
        duration
      }, {
        component: 'network_monitoring',
        action: 'request_failed'
      })
      
      monitoring.recordError(networkError)
      throw error
    }
  }
}

// Setup performance error detection
function setupPerformanceErrorDetection(): void {
  // Monitor for performance issues
  if ('PerformanceObserver' in window) {
    // Long task monitoring
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            logger.warn('Long task detected', undefined, {
              duration: entry.duration,
              startTime: entry.startTime,
              entryType: entry.entryType
            }, {
              component: 'performance_monitoring',
              action: 'long_task_detected'
            })
            
            // Record performance metric
            monitoring.recordPerformanceMetric('long_task_duration', entry.duration)
          }
        })
      })
      
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      console.warn('Long task monitoring not supported')
    }
    
    // Memory usage monitoring
    if ('memory' in performance) {
      setInterval(() => {
        const memInfo = (performance as any).memory
        const memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize
        
        if (memoryUsage > 0.9) {
          logger.warn('High memory usage detected', undefined, {
            usedHeapSize: memInfo.usedJSHeapSize,
            totalHeapSize: memInfo.totalJSHeapSize,
            usagePercentage: memoryUsage * 100
          }, {
            component: 'performance_monitoring',
            action: 'high_memory_usage'
          })
        }
        
        monitoring.recordPerformanceMetric('memory_usage', memoryUsage)
      }, 30000) // Check every 30 seconds
    }
  }
}

// Setup Firebase error monitoring
function setupFirebaseErrorMonitoring(): void {
  // Monitor for Firebase-specific errors
  const originalConsoleError = console.error
  
  console.error = function(...args) {
    const message = args.join(' ')
    
    // Check for Firebase errors
    if (message.includes('Firebase') || message.includes('firestore')) {
      const errorHandler = ErrorHandler.getInstance()
      const firebaseError = errorHandler.handleFirebaseError({
        code: 'firebase_console_error',
        message
      }, {
        component: 'firebase_monitoring',
        action: 'console_error_detected'
      })
      
      monitoring.recordError(firebaseError)
    }
    
    // Call original console.error
    originalConsoleError.apply(console, args)
  }
}

// Setup user feedback collection
function setupUserFeedbackCollection(): void {
  // Listen for user feedback events
  window.addEventListener('user-feedback', ((event: CustomEvent) => {
    const { feedback, context } = event.detail
    
    logger.info('User feedback received', {
      feedback,
      context
    }, {
      component: 'user_feedback',
      action: 'feedback_received'
    })
    
    // You could send this to a feedback service
  }) as EventListener)
  
  // Setup rage click detection (potential frustration indicator)
  let clickCount = 0
  let clickTimer: NodeJS.Timeout | null = null
  
  document.addEventListener('click', (event) => {
    clickCount++
    
    if (clickTimer) {
      clearTimeout(clickTimer)
    }
    
    clickTimer = setTimeout(() => {
      if (clickCount >= 5) {
        // Potential rage clicking detected
        logger.warn('Potential user frustration detected', undefined, {
          clickCount,
          target: (event.target as Element)?.tagName,
          timestamp: Date.now()
        }, {
          component: 'user_experience',
          action: 'rage_clicking_detected'
        })
      }
      clickCount = 0
    }, 1000)
  })
}

// Error recovery utilities
export class ErrorRecoveryManager {
  private static instance: ErrorRecoveryManager | null = null
  private recoveryStrategies = new Map<string, () => Promise<boolean>>()

  private constructor() {
    this.setupDefaultRecoveryStrategies()
  }

  static getInstance(): ErrorRecoveryManager {
    if (!this.instance) {
      this.instance = new ErrorRecoveryManager()
    }
    return this.instance
  }

  private setupDefaultRecoveryStrategies(): void {
    // Network error recovery
    this.recoveryStrategies.set('NETWORK_ERROR', async () => {
      // Wait for connection to be restored
      if (!navigator.onLine) {
        return new Promise((resolve) => {
          const handleOnline = () => {
            window.removeEventListener('online', handleOnline)
            resolve(true)
          }
          window.addEventListener('online', handleOnline)
          
          // Timeout after 30 seconds
          setTimeout(() => {
            window.removeEventListener('online', handleOnline)
            resolve(false)
          }, 30000)
        })
      }
      return true
    })

    // Authentication error recovery
    this.recoveryStrategies.set('AUTH_FAILED', async () => {
      try {
        // Try to refresh authentication
        const response = await fetch('/api/auth/refresh', { method: 'POST' })
        return response.ok
      } catch {
        return false
      }
    })

    // Chunk load error recovery (common after deployments)
    this.recoveryStrategies.set('CHUNK_LOAD_ERROR', async () => {
      // Hard reload to get new chunks
      window.location.reload()
      return true
    })
  }

  async attemptRecovery(errorCode: string): Promise<boolean> {
    const strategy = this.recoveryStrategies.get(errorCode)
    
    if (strategy) {
      try {
        logger.info('Attempting error recovery', {
          errorCode
        }, {
          component: 'error_recovery',
          action: 'recovery_attempted'
        })
        
        const recovered = await strategy()
        
        logger.info('Error recovery result', {
          errorCode,
          recovered
        }, {
          component: 'error_recovery',
          action: 'recovery_completed'
        })
        
        return recovered
      } catch (recoveryError) {
        logger.error('Error recovery failed', recoveryError instanceof Error ? recoveryError : new Error(String(recoveryError)), {
          errorCode
        }, {
          component: 'error_recovery',
          action: 'recovery_failed'
        })
        
        return false
      }
    }
    
    return false
  }

  registerRecoveryStrategy(errorCode: string, strategy: () => Promise<boolean>): void {
    this.recoveryStrategies.set(errorCode, strategy)
    
    logger.info('Recovery strategy registered', {
      errorCode
    }, {
      component: 'error_recovery',
      action: 'strategy_registered'
    })
  }
}

// User-friendly error helpers
export function showUserFriendlyError(error: any, context?: any): void {
  const errorHandler = ErrorHandler.getInstance()
  
  let userMessage = 'Something went wrong. Please try again.'
  
  if (error.code) {
    switch (error.code) {
      case 'AUTH_FAILED':
        userMessage = 'Please sign in to continue.'
        break
      case 'NETWORK_ERROR':
        userMessage = 'Please check your internet connection and try again.'
        break
      case 'VALIDATION_ERROR':
        userMessage = 'Please check your input and try again.'
        break
      case 'PERMISSION_DENIED':
        userMessage = "You don't have permission to perform this action."
        break
    }
  }
  
  // Show user-friendly notification
  if (typeof window !== 'undefined' && 'Notification' in window) {
    // You could integrate with a toast notification system here
    console.log('User notification:', userMessage)
  }
  
  // Log the user-facing error display
  logger.info('User-friendly error shown', {
    originalError: error.code || 'unknown',
    userMessage,
    context
  }, {
    component: 'user_experience',
    action: 'error_shown_to_user'
  })
}

export default { initializeErrorHandling, ErrorRecoveryManager, showUserFriendlyError }