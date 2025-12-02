'use client';

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * Trauma-Informed Error Boundary
 * 
 * Handles errors gracefully without triggering emotional distress.
 * Maintains crisis support access even during application failures.
 */

interface TraumaInformedErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetErrorBoundary: () => void;
  }>;
  onError?: (error: Error, errorInfo: any) => void;
}

function CrisisSafeErrorFallback({ 
  error, 
  resetErrorBoundary 
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const isNetworkError = error.message.includes('fetch') || error.message.includes('network');
  const isAuthError = error.message.includes('auth') || error.message.includes('authentication');
  const isDataError = error.message.includes('journal') || error.message.includes('data');

  const handleEmergencyCrisis = () => {
    // Direct crisis support - bypasses all app functionality
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:988';
    }
  };

  const getHelpfulMessage = () => {
    if (isNetworkError) {
      return "We're having trouble connecting. Your journal entries are safe and saved locally.";
    }
    if (isAuthError) {
      return "We're having trouble with sign-in. You can still access crisis resources below.";
    }
    if (isDataError) {
      return "We're having trouble loading your content. Your entries are safe and will appear once we're back up.";
    }
    return "We're experiencing a temporary issue. Your safety and data remain our priority.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        {/* Crisis Support - Always Available */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-3">
            💚 You're Not Alone
          </h2>
          <p className="text-red-700 mb-4">
            If you're in crisis or need immediate support, help is available right now.
          </p>
          <button
            onClick={handleEmergencyCrisis}
            className="w-full bg-red-600 text-white text-lg font-medium py-3 px-6 rounded-lg hover:bg-red-700 transition-colors mb-3"
            aria-label="Call 988 Suicide & Crisis Lifeline"
          >
            📞 Call 988 - Crisis Lifeline
          </button>
          <a 
            href="sms:741741&body=HOME"
            className="block w-full bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Text HOME to 741741 - Crisis Text Line"
          >
            💬 Text HOME to 741741
          </a>
        </div>

        {/* Gentle Error Explanation */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-sage-200 text-center">
          <h3 className="text-lg font-medium text-sage-900 mb-3">
            🌿 Something Went Wrong
          </h3>
          <p className="text-sage-700 mb-4">
            {getHelpfulMessage()}
          </p>
          
          {/* Recovery Actions */}
          <div className="space-y-3">
            <button
              onClick={resetErrorBoundary}
              className="w-full bg-sage-600 text-white py-2 px-4 rounded-lg hover:bg-sage-700 transition-colors"
            >
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-sage-100 text-sage-700 py-2 px-4 rounded-lg hover:bg-sage-200 transition-colors border border-sage-300"
            >
              Refresh Page
            </button>

            {/* Safe navigation options */}
            <div className="pt-3 border-t border-sage-200">
              <p className="text-sm text-sage-600 mb-2">Safe spaces to go:</p>
              <div className="space-y-2">
                <a 
                  href="/"
                  className="block text-sage-600 hover:text-sage-800 text-sm underline"
                >
                  Return to Home
                </a>
                <a 
                  href="/support"
                  className="block text-sage-600 hover:text-sage-800 text-sm underline"
                >
                  Get Support
                </a>
                <a 
                  href="/privacy"
                  className="block text-sage-600 hover:text-sage-800 text-sm underline"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details (Collapsible) */}
        <details className="mt-4">
          <summary className="text-sm text-sage-500 cursor-pointer hover:text-sage-700">
            Technical details (for support)
          </summary>
          <div className="mt-2 p-3 bg-sage-50 rounded text-xs text-sage-600 font-mono break-words">
            <p><strong>Error:</strong> {error.message}</p>
            <p><strong>Time:</strong> {new Date().toISOString()}</p>
            <p><strong>Page:</strong> {typeof window !== 'undefined' ? window.location.href : 'Unknown'}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

function handleError(error: Error, errorInfo: any) {
  // Log error for monitoring but don't expose sensitive information
  console.error('ALCHM Error Boundary caught an error:', {
    error: error.message,
    stack: error.stack?.split('\n').slice(0, 3).join('\n'), // Limit stack trace
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'
  });

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Send to error tracking service
    // errorTrackingService.captureException(error, { extra: errorInfo });
  }
}

export function TraumaInformedErrorBoundary({
  children,
  fallback: CustomFallback,
  onError = handleError
}: TraumaInformedErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={CustomFallback || CrisisSafeErrorFallback}
      onError={onError}
      onReset={() => {
        // Clear any error state and optionally reload
        if (typeof window !== 'undefined') {
          // Clear localStorage error flags
          localStorage.removeItem('alchm-error-state');
          // Optionally reload the page
          // window.location.reload();
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundaries for different parts of the app
export function JournalErrorBoundary({ children }: { children: React.ReactNode }) {
  const JournalErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-medium text-yellow-800 mb-2">
        🌿 Journal Temporarily Unavailable
      </h3>
      <p className="text-yellow-700 mb-4">
        Your journal entries are safe. We're working to restore access.
      </p>
      
      {/* Crisis support always available */}
      <div className="mb-4 p-4 bg-red-100 rounded border border-red-200">
        <p className="text-red-800 font-medium mb-2">Need immediate support?</p>
        <a 
          href="tel:988"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded mr-2 hover:bg-red-700"
        >
          📞 Call 988
        </a>
        <a 
          href="sms:741741&body=HOME"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💬 Text HOME
        </a>
      </div>

      <button
        onClick={resetErrorBoundary}
        className="bg-sage-600 text-white px-4 py-2 rounded hover:bg-sage-700 mr-2"
      >
        Try Again
      </button>
      <a
        href="/dashboard"
        className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded hover:bg-sage-200 border border-sage-300"
      >
        Go to Dashboard
      </a>
    </div>
  );

  return (
    <TraumaInformedErrorBoundary fallback={JournalErrorFallback}>
      {children}
    </TraumaInformedErrorBoundary>
  );
}

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const AuthErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-4">
      <h3 className="text-lg font-medium text-blue-800 mb-2">
        🔐 Authentication Issue
      </h3>
      <p className="text-blue-700 mb-4">
        We're having trouble signing you in. Your data is safe and secure.
      </p>
      
      {/* Crisis support */}
      <div className="mb-4 p-3 bg-red-100 rounded border border-red-200">
        <p className="text-red-800 text-sm mb-2">In crisis? Support is available:</p>
        <a href="tel:988" className="text-red-600 underline mr-4">📞 Call 988</a>
        <a href="sms:741741&body=HOME" className="text-red-600 underline">💬 Text HOME</a>
      </div>

      <div className="space-x-2">
        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
        <a
          href="/auth/login"
          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 border border-blue-300"
        >
          Go to Login
        </a>
      </div>
    </div>
  );

  return (
    <TraumaInformedErrorBoundary fallback={AuthErrorFallback}>
      {children}
    </TraumaInformedErrorBoundary>
  );
}

export function CrisisErrorBoundary({ children }: { children: React.ReactNode }) {
  const CrisisErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 m-4">
      <h3 className="text-xl font-semibold text-red-800 mb-3">
        🚨 Emergency: Crisis Support Active
      </h3>
      <p className="text-red-700 mb-4">
        Even though we're experiencing technical difficulties, crisis support is still available.
      </p>
      
      {/* Direct crisis access - bypasses all app functionality */}
      <div className="space-y-3 mb-6">
        <a
          href="tel:988"
          className="block w-full bg-red-600 text-white text-center text-lg font-medium py-3 rounded hover:bg-red-700"
        >
          📞 Call 988 Suicide & Crisis Lifeline
        </a>
        <a
          href="sms:741741&body=HOME"
          className="block w-full bg-blue-600 text-white text-center text-lg font-medium py-3 rounded hover:bg-blue-700"
        >
          💬 Text HOME to 741741
        </a>
        <a
          href="tel:911"
          className="block w-full bg-orange-600 text-white text-center text-lg font-medium py-3 rounded hover:bg-orange-700"
        >
          🚑 Call 911 for Medical Emergency
        </a>
      </div>

      <p className="text-sm text-red-600 text-center">
        These emergency resources work even when our app doesn't.
      </p>
    </div>
  );

  return (
    <TraumaInformedErrorBoundary fallback={CrisisErrorFallback}>
      {children}
    </TraumaInformedErrorBoundary>
  );
}

// Hook for manual error reporting
export function useErrorReporting() {
  const reportError = (error: Error, context: any = {}) => {
    handleError(error, context);
  };

  return { reportError };
}