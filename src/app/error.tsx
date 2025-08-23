// Global error page for ALCHM
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ErrorHandler, ErrorCategory, ErrorSeverity } from '@/lib/errorHandling'
import { logger } from '@/lib/logging'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log the error
    const errorHandler = ErrorHandler.getInstance()
    const alchmError = errorHandler.createError(
      'PAGE_ERROR',
      error.message || 'Page error occurred',
      ErrorSeverity.HIGH,
      ErrorCategory.SYSTEM,
      {
        component: 'error_page',
        action: 'page_error'
      },
      error
    )

    logger.error('Page error occurred', error, {
      errorId: alchmError.id,
      digest: error.digest
    }, {
      component: 'error_page',
      action: 'error_logged'
    })
  }, [error])

  const getErrorInfo = () => {
    // Analyze error to provide specific guidance
    if (error.message?.includes('ChunkLoadError')) {
      return {
        title: 'Loading Error',
        description: 'There was a problem loading page resources. This usually happens after an app update.',
        icon: '📦',
        suggestion: 'Try refreshing the page or clearing your browser cache.',
        action: 'refresh'
      }
    }

    if (error.message?.includes('Network')) {
      return {
        title: 'Connection Error',
        description: 'Unable to connect to our servers. Please check your internet connection.',
        icon: '🌐',
        suggestion: 'Check your internet connection and try again.',
        action: 'retry'
      }
    }

    if (error.message?.includes('Auth') || error.message?.includes('Authentication')) {
      return {
        title: 'Authentication Error',
        description: 'There was a problem with your session. Please sign in again.',
        icon: '🔐',
        suggestion: 'Sign in again to continue.',
        action: 'signin'
      }
    }

    // Default error info
    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred while loading this page.',
      icon: '⚠️',
      suggestion: 'Try refreshing the page or contact support if the problem persists.',
      action: 'retry'
    }
  }

  const errorInfo = getErrorInfo()

  const handleAction = () => {
    switch (errorInfo.action) {
      case 'refresh':
        window.location.reload()
        break
      case 'retry':
        reset()
        break
      case 'signin':
        window.location.href = '/auth/signin'
        break
      default:
        reset()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          {/* Error Icon */}
          <div className="text-6xl mb-6">
            {errorInfo.icon}
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>

          {/* Error Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {errorInfo.description}
          </p>

          {/* Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              💡 {errorInfo.suggestion}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleAction}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {errorInfo.action === 'refresh' ? 'Refresh Page' : 
               errorInfo.action === 'signin' ? 'Sign In' : 'Try Again'}
            </button>

            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
            >
              Go to Home
            </Link>
          </div>

          {/* Error ID for support */}
          {error.digest && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Error ID: {error.digest}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Please include this ID when contacting support
              </p>
            </div>
          )}

          {/* Support Link */}
          <div className="mt-6">
            <Link
              href="/support"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Need more help?
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span>📧</span>
              <span>Email: support@alchm.app</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>💬</span>
              <span>Chat support available 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📚</span>
              <Link href="/help" className="text-blue-600 hover:text-blue-700">
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Development Info */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <summary className="text-sm font-medium text-red-800 cursor-pointer">
              Development Details
            </summary>
            <div className="mt-3 text-xs text-red-700">
              <div className="mb-2">
                <strong>Error:</strong> {error.name}
              </div>
              <div className="mb-2">
                <strong>Message:</strong> {error.message}
              </div>
              {error.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}