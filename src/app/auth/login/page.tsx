'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSessionManager } from '@/lib/sessionManager';
import { AuthError, AuthErrorCode } from '@/types/auth';

// Error message components
const ErrorAlert = ({ error, onDismiss }: { error: AuthError; onDismiss: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-red-800">
          Authentication Error
        </h3>
        <div className="mt-2 text-sm text-red-700">
          {error.userMessage}
        </div>
        {error.canRefresh && (
          <div className="mt-3 text-sm text-red-600">
            Your session may have expired. Please try logging in again.
          </div>
        )}
      </div>
      <div className="ml-auto pl-3">
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          <span className="sr-only">Dismiss</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

const SessionExpiredBanner = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium text-yellow-800">
          Session Expired
        </h3>
        <div className="mt-2 text-sm text-yellow-700">
          Your session has expired for security. Please sign in again to continue.
        </div>
      </div>
      <div className="ml-auto pl-3">
        <button
          onClick={onRefresh}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium"
        >
          Sign In Again
        </button>
      </div>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSessionManager();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  // Handle URL parameters for error states and redirects
  useEffect(() => {
    const reason = searchParams.get('reason');
    const redirect = searchParams.get('redirect');
    const refresh = searchParams.get('refresh');

    // Show appropriate error messages based on URL parameters
    if (reason === 'session_expired') {
      setShowSessionExpired(true);
    } else if (reason === 'session_invalid') {
      setError({
        code: AuthErrorCode.VERIFICATION_FAILED,
        message: 'Session verification failed',
        userMessage: 'Your session is invalid. Please sign in again.',
        canRefresh: false
      });
    } else if (reason === 'no_session') {
      setError({
        code: AuthErrorCode.NO_SESSION,
        message: 'No session found',
        userMessage: 'Please sign in to access this page.',
        canRefresh: false
      });
    }

    // Auto-focus email field if there's an attempted refresh
    if (refresh === 'true') {
      setShowSessionExpired(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowSessionExpired(false);

    try {
      await signIn(email, password, rememberMe);
      
      // Redirect to intended page or dashboard
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSession = () => {
    setShowSessionExpired(false);
    setError(null);
    // Focus on email field for re-authentication
    document.getElementById('email')?.focus();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to ALCHM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your trauma-informed journaling companion
          </p>
        </div>

        {/* Error Messages */}
        {showSessionExpired && (
          <SessionExpiredBanner onRefresh={handleRefreshSession} />
        )}

        {error && (
          <ErrorAlert error={error} onDismiss={clearError} />
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Keep me signed in
              </label>
            </div>

            <div className="text-sm">
              <a href="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign up here
              </a>
            </span>
          </div>
        </form>

        {/* Session Status Indicator */}
        {loading && (
          <div className="text-center text-sm text-gray-500">
            Verifying your credentials...
          </div>
        )}
      </div>
    </div>
  );
}