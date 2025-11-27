// Comprehensive error boundary system for ALCHM
'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
  retryCount: number
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  level?: 'page' | 'component' | 'critical'
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void
  enableRetry?: boolean
  maxRetries?: number
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props
    const { errorId } = this.state

    // Enhanced error information
    const enhancedError = {
      ...error,
      boundary: level,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown'
    }

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary (${level})`)
      console.error('Error:', error)
      console.error('Error Info:', errorInfo)
      console.error('Enhanced Error:', enhancedError)
      console.groupEnd()
    }

    // Update state with error info
    this.setState({ errorInfo })

    // Call custom error handler
    if (onError && errorId) {
      onError(error, errorInfo, errorId)
    }

    // Report to error tracking service
    this.reportError(enhancedError, errorInfo, errorId!)
  }

  private getCurrentUserId(): string | null {
    try {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('alchm_user')
        return user ? JSON.parse(user).uid : null
      }
    } catch {
      return null
    }
    return null
  }

  private getSessionId(): string {
    try {
      if (typeof window !== 'undefined') {
        let sessionId = sessionStorage.getItem('alchm_session_id')
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem('alchm_session_id', sessionId)
        }
        return sessionId
      }
    } catch {
      return 'unknown'
    }
    return 'unknown'
  }

  private async reportError(error: any, errorInfo: ErrorInfo, errorId: string) {
    try {
      // Only log to console for now - no API call that might cause more errors
      console.log('Error reported:', {
        errorId,
        error: {
          name: error.name,
          message: error.message,
          boundary: error.boundary,
          timestamp: error.timestamp
        },
        level: this.props.level
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  handleRetry = () => {
    const { maxRetries = 3 } = this.props
    const { retryCount } = this.state

    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1
      }))

      // Auto-retry with exponential backoff for component-level errors
      if (this.props.level === 'component' && retryCount < 2) {
        const delay = Math.pow(2, retryCount) * 1000 // 1s, 2s, 4s
        this.retryTimeoutId = setTimeout(() => {
          this.handleRetry()
        }, delay)
      }
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  render() {
    const { hasError, error, errorInfo, errorId, retryCount } = this.state
    const { children, fallback, enableRetry = true, maxRetries = 3, level = 'component' } = this.props

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Render appropriate error UI based on level
      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          errorId={errorId}
          retryCount={retryCount}
          maxRetries={maxRetries}
          level={level}
          onRetry={enableRetry ? this.handleRetry : undefined}
          onReload={this.handleReload}
        />
      )
    }

    return children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string | null
  retryCount: number
  maxRetries: number
  level: string
  onRetry?: () => void
  onReload: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  retryCount,
  maxRetries,
  level,
  onRetry,
  onReload
}) => {
  const canRetry = onRetry && retryCount < maxRetries
  const isProduction = process.env.NODE_ENV === 'production'

  // Different UI based on error level
  const getErrorContent = () => {
    switch (level) {
      case 'critical':
        return {
          title: 'You\'re safe here',
          message: 'Something needs a gentle reset. Your healing space will return refreshed. Crisis support is always available.',
          icon: '🌿',
          severity: 'high'
        }
      case 'page':
        return {
          title: 'Taking a sacred pause',
          message: 'This space needs a moment to breathe. Your journey can continue when you\'re ready.',
          icon: '🌸',
          severity: 'medium'
        }
      case 'component':
        return {
          title: 'A gentle moment',
          message: 'Something paused for healing. Like nature, we grow through rest and renewal.',
          icon: '🕊️',
          severity: 'low'
        }
      default:
        return {
          title: 'Breathing space',
          message: 'Your sanctuary is taking a healing pause. All is well.',
          icon: '✨',
          severity: 'medium'
        }
    }
  }

  const { title, message, icon, severity } = getErrorContent()

  return (
    <div className={`error-boundary ${level} severity-${severity}`}>
      <div className="error-boundary-content">
        <div className="error-icon">{icon}</div>
        <h2 className="error-title">{title}</h2>
        <p className="error-message">{message}</p>
        
        {errorId && (
          <div className="error-id">
            <small>Error ID: {errorId}</small>
          </div>
        )}

        <div className="error-actions">
          {canRetry && (
            <button 
              onClick={onRetry}
              className="btn btn-primary"
              disabled={retryCount >= maxRetries}
            >
              Retry {retryCount > 0 && `(${retryCount}/${maxRetries})`}
            </button>
          )}
          
          <button 
            onClick={onReload}
            className="btn btn-secondary"
          >
            Refresh Page
          </button>
        </div>

        {/* Show technical details in development */}
        {!isProduction && error && (
          <details className="error-details">
            <summary>Technical Details (Development Only)</summary>
            <div className="error-technical">
              <div className="error-stack">
                <h4>Error:</h4>
                <pre>{error.toString()}</pre>
              </div>
              {error.stack && (
                <div className="error-stack">
                  <h4>Stack Trace:</h4>
                  <pre>{error.stack}</pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div className="error-stack">
                  <h4>Component Stack:</h4>
                  <pre>{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>

      <style jsx>{`
        .error-boundary {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          padding: 2rem;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .error-boundary.critical {
          background-color: #fef2f2;
          border-color: #fecaca;
        }

        .error-boundary.page {
          min-height: 400px;
          background-color: #fefce8;
          border-color: #fde68a;
        }

        .error-boundary-content {
          text-align: center;
          max-width: 500px;
        }

        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .error-message {
          color: #6b7280;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .error-id {
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          background-color: #f3f4f6;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #2563eb;
          color: white;
          border: none;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .btn-primary:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .btn-secondary {
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
        }

        .btn-secondary:hover {
          background-color: #f9fafb;
        }

        .error-details {
          text-align: left;
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f3f4f6;
          border-radius: 6px;
        }

        .error-technical {
          font-size: 0.875rem;
        }

        .error-stack {
          margin-bottom: 1rem;
        }

        .error-stack h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .error-stack pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          font-size: 0.75rem;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  )
}

// Specialized error boundaries for different use cases

export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page" enableRetry={false}>
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="component" enableRetry={true} maxRetries={2}>
    {children}
  </ErrorBoundary>
)

export const CriticalErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="critical" enableRetry={false}>
    {children}
  </ErrorBoundary>
)

export default ErrorBoundary