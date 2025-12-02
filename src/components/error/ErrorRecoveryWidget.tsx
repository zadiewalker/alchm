'use client';

import React, { useState, useEffect } from 'react';
import { TraumaInformedErrorHandler, ErrorRecoveryAction } from '@/lib/error-handling/comprehensive-error-system';

interface ErrorRecoveryWidgetProps {
  error?: Error | string;
  context?: any;
  onRecovery?: () => void;
  className?: string;
}

export function ErrorRecoveryWidget({
  error,
  context = {},
  onRecovery,
  className = ''
}: ErrorRecoveryWidgetProps) {
  const [recoveryActions, setRecoveryActions] = useState<ErrorRecoveryAction[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    if (error) {
      const actions = TraumaInformedErrorHandler.handleError(error, context);
      setRecoveryActions(actions);
    }
  }, [error, context]);

  if (!error || recoveryActions.length === 0) {
    return null;
  }

  const handleRecoveryAction = async (action: ErrorRecoveryAction) => {
    setRecovering(true);
    try {
      await action.action();
      onRecovery?.();
    } catch (recoveryError) {
      console.error('Recovery action failed:', recoveryError);
      // Handle recovery failure
      TraumaInformedErrorHandler.handleError(
        `Recovery action failed: ${recoveryError}`,
        { 
          category: 'system', 
          severity: 'medium',
          action: 'recovery_failed',
          metadata: { originalError: error, actionLabel: action.label }
        }
      );
    } finally {
      setRecovering(false);
    }
  };

  const errorMessage = typeof error === 'string' ? error : error.message;
  const crisisActions = recoveryActions.filter(action => action.crisisSafe);
  const regularActions = recoveryActions.filter(action => !action.crisisSafe);

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-sage-200 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sage-900 flex items-center gap-2">
          <span className="text-yellow-500">⚠️</span>
          Something Went Wrong
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-sage-500 hover:text-sage-700 underline"
          aria-expanded={showDetails}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {/* Error Message */}
      <p className="text-sage-700 mb-4">
        We encountered an issue and are working to resolve it. Your safety and data remain our priority.
      </p>

      {/* Crisis Actions - Always Visible and Prominent */}
      {crisisActions.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-red-800 mb-3 flex items-center gap-2">
            <span>🚨</span>
            Need Immediate Support?
          </h4>
          <div className="space-y-2">
            {crisisActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleRecoveryAction(action)}
                disabled={recovering}
                className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                aria-label={`Crisis support: ${action.label}`}
              >
                {recovering ? 'Connecting...' : action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Regular Recovery Actions */}
      {regularActions.length > 0 && (
        <div className="space-y-2 mb-4">
          <h4 className="font-medium text-sage-800 mb-2">Try These Solutions:</h4>
          <div className="grid grid-cols-1 gap-2">
            {regularActions.slice(0, 3).map((action, index) => (
              <button
                key={index}
                onClick={() => handleRecoveryAction(action)}
                disabled={recovering}
                className="bg-sage-100 text-sage-700 py-2 px-4 rounded hover:bg-sage-200 disabled:opacity-50 transition-colors text-left"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Safe Navigation */}
      <div className="border-t border-sage-200 pt-4">
        <h4 className="text-sm font-medium text-sage-600 mb-2">Safe Places to Go:</h4>
        <div className="flex flex-wrap gap-2">
          <a
            href="/"
            className="text-sm text-sage-600 hover:text-sage-800 underline"
          >
            🏠 Home
          </a>
          <a
            href="/support"
            className="text-sm text-sage-600 hover:text-sage-800 underline"
          >
            💬 Support
          </a>
          <a
            href="/crisis-resources"
            className="text-sm text-sage-600 hover:text-sage-800 underline"
          >
            🆘 Crisis Resources
          </a>
        </div>
      </div>

      {/* Technical Details (Collapsible) */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-sage-200">
          <h4 className="text-sm font-medium text-sage-600 mb-2">Technical Details:</h4>
          <div className="bg-sage-50 rounded p-3 text-xs text-sage-600 font-mono">
            <p><strong>Error:</strong> {errorMessage}</p>
            <p><strong>Time:</strong> {new Date().toISOString()}</p>
            <p><strong>Context:</strong> {JSON.stringify(context, null, 2)}</p>
            {typeof error !== 'string' && error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer hover:text-sage-800">Stack Trace</summary>
                <pre className="mt-2 text-xs overflow-x-auto whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {recovering && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-2"></div>
            <p className="text-sm text-sage-600">Working on it...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized recovery widgets for different contexts
export function JournalErrorRecovery({ 
  error, 
  onRetry,
  onGoToDashboard 
}: { 
  error: Error | string; 
  onRetry?: () => void;
  onGoToDashboard?: () => void;
}) {
  return (
    <ErrorRecoveryWidget
      error={error}
      context={{ 
        category: 'data',
        component: 'journal',
        severity: 'medium',
        recoverable: true
      }}
      onRecovery={() => {
        onRetry?.();
      }}
      className="max-w-md mx-auto"
    />
  );
}

export function AuthErrorRecovery({ 
  error, 
  onRetryAuth,
  onUseGuest 
}: { 
  error: Error | string;
  onRetryAuth?: () => void;
  onUseGuest?: () => void;
}) {
  const handleRetry = () => {
    onRetryAuth?.();
    window.location.href = '/auth/login';
  };

  const handleGuest = () => {
    onUseGuest?.();
    localStorage.setItem('alchm-guest-mode', 'true');
    window.location.href = '/journal?mode=guest';
  };

  return (
    <div className="max-w-md mx-auto">
      <ErrorRecoveryWidget
        error={error}
        context={{ 
          category: 'auth',
          component: 'authentication',
          severity: 'high',
          recoverable: true
        }}
        className="mb-4"
      />
      
      {/* Additional auth-specific options */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-3">Authentication Options:</h4>
        <div className="space-y-2">
          <button
            onClick={handleRetry}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Try Signing In Again
          </button>
          <button
            onClick={handleGuest}
            className="w-full bg-blue-100 text-blue-700 py-2 px-4 rounded hover:bg-blue-200 border border-blue-300"
          >
            Continue as Guest
          </button>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Guest mode allows limited journaling without an account
        </p>
      </div>
    </div>
  );
}

export function NetworkErrorRecovery({ 
  error,
  onRetry,
  onOfflineMode 
}: { 
  error: Error | string;
  onRetry?: () => void;
  onOfflineMode?: () => void;
}) {
  const handleOffline = () => {
    onOfflineMode?.();
    localStorage.setItem('alchm-offline-mode', 'true');
    window.dispatchEvent(new CustomEvent('alchm:offline-mode-activated'));
  };

  return (
    <div className="max-w-md mx-auto">
      <ErrorRecoveryWidget
        error={error}
        context={{ 
          category: 'network',
          component: 'network',
          severity: 'medium',
          recoverable: true
        }}
        className="mb-4"
      />
      
      {/* Network-specific options */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h4 className="font-medium text-orange-800 mb-3">Connection Options:</h4>
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700"
          >
            Try Connecting Again
          </button>
          <button
            onClick={handleOffline}
            className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded hover:bg-orange-200 border border-orange-300"
          >
            Continue Offline
          </button>
        </div>
        <p className="text-xs text-orange-600 mt-2">
          Offline mode saves your entries locally until connection is restored
        </p>
      </div>
    </div>
  );
}