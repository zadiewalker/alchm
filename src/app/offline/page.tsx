// Offline page for ALCHM PWA
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [retryAttempts, setRetryAttempts] = useState(0)

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      // Automatically redirect when back online
      setTimeout(() => {
        window.location.href = '/'
      }, 1000)
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setRetryAttempts(prev => prev + 1)
    
    try {
      // Test connectivity
      const response = await fetch('/api/health/ping', {
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      if (response.ok) {
        window.location.href = '/'
      }
    } catch (error) {
      // Still offline
      console.log('Still offline, retry failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Connection Status */}
        <div className="mb-8">
          <div className={`text-6xl mb-4 ${isOnline ? 'animate-bounce' : ''}`}>
            {isOnline ? '🌐' : '📵'}
          </div>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOnline ? 'bg-green-400' : 'bg-red-400'
            }`}></div>
            {isOnline ? 'Back Online!' : 'Offline'}
          </div>
        </div>

        {/* Title and Description */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {isOnline 
            ? 'Great! Your internet connection has been restored. Redirecting you back to ALCHM...'
            : 'No internet connection detected. Some features may not be available, but you can still access your cached content.'
          }
        </p>

        {/* Offline Features */}
        {!isOnline && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-900 mb-3">
              What you can do offline:
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex items-center">
                <span className="mr-2">📖</span>
                <span>Read previously loaded journal entries</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✍️</span>
                <span>Write new journal entries (will sync when online)</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">🔍</span>
                <span>Search through cached content</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">⚙️</span>
                <span>Access app settings and preferences</span>
              </li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {!isOnline && (
            <button
              onClick={handleRetry}
              disabled={isOnline}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {retryAttempts > 0 ? `Retry Connection (${retryAttempts})` : 'Check Connection'}
            </button>
          )}
          
          <Link
            href="/"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Continue Offline
          </Link>
        </div>

        {/* Tips for Better Offline Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            💡 Offline Tips:
          </h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Your drafts are automatically saved locally</p>
            <p>• Content will sync when you're back online</p>
            <p>• Check your WiFi or mobile data connection</p>
            <p>• Try moving to an area with better signal</p>
          </div>
        </div>

        {/* Connection Troubleshooting */}
        {!isOnline && retryAttempts > 2 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">
              🔧 Troubleshooting:
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Check if other websites work</li>
              <li>• Try turning WiFi off and on</li>
              <li>• Switch between WiFi and mobile data</li>
              <li>• Restart your browser or app</li>
            </ul>
          </div>
        )}

        {/* Cached Content Access */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Quick Access:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link 
              href="/journals" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded flex items-center"
            >
              <span className="mr-2">📝</span>
              <span>Journals</span>
            </Link>
            <Link 
              href="/profile" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded flex items-center"
            >
              <span className="mr-2">👤</span>
              <span>Profile</span>
            </Link>
            <Link 
              href="/settings" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded flex items-center"
            >
              <span className="mr-2">⚙️</span>
              <span>Settings</span>
            </Link>
            <Link 
              href="/help" 
              className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded flex items-center"
            >
              <span className="mr-2">❓</span>
              <span>Help</span>
            </Link>
          </div>
        </div>

        {/* Auto-retry indicator */}
        {!isOnline && (
          <div className="mt-6 text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
              <span>Automatically checking for connection...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}