// Comprehensive error handling utilities for ALCHM
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NETWORK = 'network',
  VALIDATION = 'validation',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM = 'system',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  USER_INPUT = 'user_input',
  THIRD_PARTY = 'third_party'
}

export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  action?: string
  component?: string
  url?: string
  userAgent?: string
  timestamp?: string
  buildId?: string
  feature?: string
  metadata?: Record<string, any>
}

export interface AlchmError {
  id: string
  code: string
  message: string
  severity: ErrorSeverity
  category: ErrorCategory
  context: ErrorContext
  originalError?: Error
  stack?: string
  retryable?: boolean
  userMessage?: string
  recoveryAction?: string
}

// Error handler class
export class ErrorHandler {
  private static instance: ErrorHandler | null = null

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!this.instance) {
      this.instance = new ErrorHandler()
    }
    return this.instance
  }

  // Create standardized error
  createError(
    code: string,
    message: string,
    severity: ErrorSeverity,
    category: ErrorCategory,
    context: ErrorContext = {},
    originalError?: Error
  ): AlchmError {
    const errorId = this.generateErrorId()
    
    return {
      id: errorId,
      code,
      message,
      severity,
      category,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown'
      },
      originalError,
      stack: originalError?.stack || new Error().stack,
      retryable: this.isRetryable(category, code),
      userMessage: this.getUserMessage(code, severity),
      recoveryAction: this.getRecoveryAction(category, code)
    }
  }

  // Handle different types of errors
  handleAuthenticationError(error: Error, context: ErrorContext = {}): AlchmError {
    return this.createError(
      'AUTH_FAILED',
      'Authentication failed',
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHENTICATION,
      { ...context, action: 'authentication' },
      error
    )
  }

  handleValidationError(field: string, message: string, context: ErrorContext = {}): AlchmError {
    return this.createError(
      'VALIDATION_ERROR',
      `Validation failed for ${field}: ${message}`,
      ErrorSeverity.MEDIUM,
      ErrorCategory.VALIDATION,
      { ...context, field, action: 'validation' }
    )
  }

  handleNetworkError(error: Error, context: ErrorContext = {}): AlchmError {
    const isTimeout = error.message.includes('timeout') || error.name === 'TimeoutError'
    const isOffline = !navigator.onLine
    
    return this.createError(
      isTimeout ? 'NETWORK_TIMEOUT' : isOffline ? 'NETWORK_OFFLINE' : 'NETWORK_ERROR',
      `Network error: ${error.message}`,
      isOffline ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      ErrorCategory.NETWORK,
      { ...context, timeout: isTimeout, offline: isOffline },
      error
    )
  }

  handleFirebaseError(error: any, context: ErrorContext = {}): AlchmError {
    const firebaseCode = error.code || 'unknown'
    const severity = this.getFirebaseErrorSeverity(firebaseCode)
    
    return this.createError(
      `FIREBASE_${firebaseCode.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`,
      error.message || 'Firebase operation failed',
      severity,
      ErrorCategory.THIRD_PARTY,
      { ...context, firebaseCode, service: 'firebase' },
      error
    )
  }

  handleAPIError(response: Response, context: ErrorContext = {}): AlchmError {
    const status = response.status
    let severity = ErrorSeverity.MEDIUM
    let category = ErrorCategory.NETWORK

    if (status >= 500) {
      severity = ErrorSeverity.HIGH
      category = ErrorCategory.SYSTEM
    } else if (status === 401) {
      severity = ErrorSeverity.HIGH
      category = ErrorCategory.AUTHENTICATION
    } else if (status === 403) {
      severity = ErrorSeverity.HIGH
      category = ErrorCategory.AUTHORIZATION
    } else if (status >= 400) {
      severity = ErrorSeverity.MEDIUM
      category = ErrorCategory.USER_INPUT
    }

    return this.createError(
      `API_ERROR_${status}`,
      `API request failed with status ${status}`,
      severity,
      category,
      { ...context, status, url: response.url }
    )
  }

  handleUnexpectedError(error: Error, context: ErrorContext = {}): AlchmError {
    return this.createError(
      'UNEXPECTED_ERROR',
      error.message || 'An unexpected error occurred',
      ErrorSeverity.HIGH,
      ErrorCategory.SYSTEM,
      { ...context, action: 'unexpected' },
      error
    )
  }

  // Utility methods
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private isRetryable(category: ErrorCategory, code: string): boolean {
    const retryableCategories = [ErrorCategory.NETWORK, ErrorCategory.THIRD_PARTY]
    const retryableCodes = ['NETWORK_TIMEOUT', 'NETWORK_ERROR', 'API_ERROR_503', 'API_ERROR_502']
    
    return retryableCategories.includes(category) || retryableCodes.includes(code)
  }

  private getUserMessage(code: string, severity: ErrorSeverity): string {
    const messages: Record<string, string> = {
      'AUTH_FAILED': 'Please check your credentials and try again.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'NETWORK_TIMEOUT': 'Request timed out. Please check your connection and try again.',
      'NETWORK_OFFLINE': 'You appear to be offline. Please check your connection.',
      'NETWORK_ERROR': 'Network error. Please try again later.',
      'API_ERROR_401': 'Please sign in to continue.',
      'API_ERROR_403': 'You don\'t have permission to perform this action.',
      'API_ERROR_404': 'The requested resource was not found.',
      'API_ERROR_500': 'Server error. Please try again later.',
      'UNEXPECTED_ERROR': 'Something unexpected happened. Please try again.'
    }

    return messages[code] || (
      severity === ErrorSeverity.CRITICAL 
        ? 'A critical error occurred. Please contact support.'
        : 'An error occurred. Please try again.'
    )
  }

  private getRecoveryAction(category: ErrorCategory, code: string): string {
    const actions: Record<string, string> = {
      'AUTH_FAILED': 'retry_auth',
      'NETWORK_TIMEOUT': 'retry_request',
      'NETWORK_OFFLINE': 'check_connection',
      'VALIDATION_ERROR': 'fix_input',
      'API_ERROR_401': 'sign_in',
      'API_ERROR_403': 'contact_support',
      'API_ERROR_500': 'retry_later'
    }

    return actions[code] || 'retry'
  }

  private getFirebaseErrorSeverity(code: string): ErrorSeverity {
    const highSeverityCodes = [
      'permission-denied',
      'unauthenticated',
      'resource-exhausted',
      'failed-precondition'
    ]
    
    const criticalSeverityCodes = [
      'internal',
      'data-loss',
      'unavailable'
    ]

    if (criticalSeverityCodes.includes(code)) return ErrorSeverity.CRITICAL
    if (highSeverityCodes.includes(code)) return ErrorSeverity.HIGH
    return ErrorSeverity.MEDIUM
  }
}

// Error logging utility
export class ErrorLogger {
  private static instance: ErrorLogger | null = null

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!this.instance) {
      this.instance = new ErrorLogger()
    }
    return this.instance
  }

  async logError(error: AlchmError): Promise<void> {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚨 ${error.severity.toUpperCase()} Error: ${error.code}`)
        console.error('Message:', error.message)
        console.error('Category:', error.category)
        console.error('Context:', error.context)
        if (error.originalError) {
          console.error('Original Error:', error.originalError)
        }
        console.groupEnd()
      }

      // Send to logging service
      await this.sendToLoggingService(error)

      // Store locally for offline scenarios
      this.storeLocalError(error)

    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }

  private async sendToLoggingService(error: AlchmError): Promise<void> {
    try {
      await fetch('/api/errors/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(error)
      })
    } catch (e) {
      // If logging fails, store for retry
      this.storeLocalError(error, true)
    }
  }

  private storeLocalError(error: AlchmError, failedToSend: boolean = false): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('alchm_error_log') || '[]'
        const errors = JSON.parse(stored)
        
        errors.push({
          ...error,
          failedToSend,
          storedAt: Date.now()
        })

        // Keep only last 50 errors
        if (errors.length > 50) {
          errors.splice(0, errors.length - 50)
        }

        localStorage.setItem('alchm_error_log', JSON.stringify(errors))
      }
    } catch (e) {
      console.warn('Failed to store error locally:', e)
    }
  }

  async retryFailedLogs(): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('alchm_error_log') || '[]'
        const errors = JSON.parse(stored)
        
        const failedErrors = errors.filter((e: any) => e.failedToSend)
        
        for (const error of failedErrors) {
          try {
            await this.sendToLoggingService(error)
            // Mark as sent
            error.failedToSend = false
          } catch (e) {
            // Still failing, keep for next retry
          }
        }

        localStorage.setItem('alchm_error_log', JSON.stringify(errors))
      }
    } catch (e) {
      console.warn('Failed to retry failed logs:', e)
    }
  }
}

// Recovery strategies
export class ErrorRecovery {
  private static instance: ErrorRecovery | null = null

  private constructor() {}

  static getInstance(): ErrorRecovery {
    if (!this.instance) {
      this.instance = new ErrorRecovery()
    }
    return this.instance
  }

  async attemptRecovery(error: AlchmError): Promise<boolean> {
    if (!error.retryable) {
      return false
    }

    const action = error.recoveryAction || 'retry'
    
    switch (action) {
      case 'retry_request':
        return this.retryWithBackoff(async () => {
          // This would be implemented by the caller
          return true
        })
      
      case 'check_connection':
        return this.checkAndWaitForConnection()
      
      case 'retry_auth':
        return this.retryAuthentication()
      
      default:
        return false
    }
  }

  private async retryWithBackoff(
    operation: () => Promise<boolean>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await operation()
        if (result) return true
      } catch (e) {
        // Continue to next retry
      }

      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    return false
  }

  private async checkAndWaitForConnection(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    return new Promise((resolve) => {
      if (navigator.onLine) {
        resolve(true)
        return
      }

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

  private async retryAuthentication(): Promise<boolean> {
    try {
      // This would integrate with your auth system
      // For now, just check if user is still authenticated
      const response = await fetch('/api/auth/check')
      return response.ok
    } catch (e) {
      return false
    }
  }
}

// Global error handler setup
export function setupGlobalErrorHandling(): void {
  if (typeof window === 'undefined') return

  const errorHandler = ErrorHandler.getInstance()
  const errorLogger = ErrorLogger.getInstance()

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = errorHandler.handleUnexpectedError(
      new Error(event.reason?.message || 'Unhandled promise rejection'),
      { action: 'unhandled_rejection' }
    )
    
    errorLogger.logError(error)
    
    // Prevent the default browser console error
    event.preventDefault()
  })

  // Global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = errorHandler.handleUnexpectedError(
      event.error || new Error(event.message),
      { 
        action: 'global_error',
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      }
    )
    
    errorLogger.logError(error)
  })

  // Retry failed logs periodically
  setInterval(() => {
    errorLogger.retryFailedLogs()
  }, 5 * 60 * 1000) // Every 5 minutes
}

// Utility functions
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: ErrorContext = {}
) => {
  return async (...args: T): Promise<R> => {
    const errorHandler = ErrorHandler.getInstance()
    const errorLogger = ErrorLogger.getInstance()
    
    try {
      return await fn(...args)
    } catch (error) {
      const alchmError = errorHandler.handleUnexpectedError(
        error instanceof Error ? error : new Error(String(error)),
        context
      )
      
      await errorLogger.logError(alchmError)
      throw alchmError
    }
  }
}

export default ErrorHandler