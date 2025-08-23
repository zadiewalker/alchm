'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthErrorCode, AUTH_ERROR_MESSAGES } from '@/types/auth';

interface ErrorInfo {
  title: string;
  message: string;
  icon: 'warning' | 'error' | 'info';
  actions: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    primary?: boolean;
  }>;
}

const ErrorIcon = ({ type }: { type: 'warning' | 'error' | 'info' }) => {
  const baseClasses = "h-12 w-12";
  
  switch (type) {
    case 'error':
      return (
        <svg className={`${baseClasses} text-red-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className={`${baseClasses} text-yellow-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'info':
      return (
        <svg className={`${baseClasses} text-blue-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    if (!searchParams) return;
    
    const errorCode = searchParams.get('code') as AuthErrorCode;
    const reason = searchParams.get('reason');
    const redirect = searchParams.get('redirect');

    let info: ErrorInfo;

    if (errorCode === AuthErrorCode.SESSION_EXPIRED || reason === 'session_expired') {
      info = {
        title: 'Session Expired',
        message: 'Your session has expired for security reasons. Please sign in again to continue.',
        icon: 'warning',
        actions: [
          {
            label: 'Sign In Again',
            href: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
            primary: true
          },
          {
            label: 'Go Home',
            href: '/'
          }
        ]
      };
    } else if (errorCode === AuthErrorCode.SESSION_REVOKED || reason === 'session_revoked') {
      info = {
        title: 'Session Revoked',
        message: 'Your session has been revoked. This may have happened because you signed in from another device or changed your password.',
        icon: 'error',
        actions: [
          {
            label: 'Sign In Again',
            href: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
            primary: true
          }
        ]
      };
    } else if (errorCode === AuthErrorCode.NO_SESSION || reason === 'no_session') {
      info = {
        title: 'Authentication Required',
        message: 'You need to be signed in to access this page. Please sign in to continue.',
        icon: 'info',
        actions: [
          {
            label: 'Sign In',
            href: `/auth/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`,
            primary: true
          },
          {
            label: 'Create Account',
            href: '/auth/signup'
          }
        ]
      };
    } else if (errorCode === AuthErrorCode.INVALID_CREDENTIALS) {
      info = {
        title: 'Invalid Credentials',
        message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
        icon: 'error',
        actions: [
          {
            label: 'Try Again',
            href: '/auth/login',
            primary: true
          },
          {
            label: 'Reset Password',
            href: '/auth/forgot-password'
          }
        ]
      };
    } else if (errorCode === AuthErrorCode.USER_NOT_FOUND) {
      info = {
        title: 'Account Not Found',
        message: 'No account was found with this email address. Would you like to create a new account?',
        icon: 'info',
        actions: [
          {
            label: 'Create Account',
            href: '/auth/signup',
            primary: true
          },
          {
            label: 'Try Different Email',
            href: '/auth/login'
          }
        ]
      };
    } else if (errorCode === AuthErrorCode.USER_DISABLED) {
        info = {
          title: 'Account Disabled',
          message: 'Your account has been disabled. Please contact support for assistance.',
          icon: 'error',
          actions: [
            {
              label: 'Contact Support',
              href: '/contact',
              primary: true
            },
            {
              label: 'Go Home',
              href: '/'
            }
          ]
        };
    } else if (errorCode === AuthErrorCode.TOO_MANY_REQUESTS) {
        info = {
          title: 'Too Many Attempts',
          message: 'Too many failed sign-in attempts. Please wait a few minutes before trying again.',
          icon: 'warning',
          actions: [
            {
              label: 'Try Again Later',
              onClick: () => {
                setTimeout(() => router.push('/auth/login'), 60000); // Wait 1 minute
              },
              primary: true
            },
            {
              label: 'Reset Password',
              href: '/auth/forgot-password'
            }
          ]
        };
    } else if (errorCode === AuthErrorCode.NETWORK_ERROR) {
        info = {
          title: 'Connection Problem',
          message: 'Unable to connect to our servers. Please check your internet connection and try again.',
          icon: 'warning',
          actions: [
            {
              label: 'Retry',
              onClick: () => window.location.reload(),
              primary: true
            },
            {
              label: 'Go Home',
              href: '/'
            }
          ]
        };
    } else if (errorCode === AuthErrorCode.SERVICE_UNAVAILABLE) {
        info = {
          title: 'Service Temporarily Unavailable',
          message: 'Our authentication service is temporarily unavailable. Please try again in a few minutes.',
          icon: 'warning',
          actions: [
            {
              label: 'Try Again',
              onClick: () => router.refresh(),
              primary: true
            },
            {
              label: 'Check Status',
              href: '/status'
            }
          ]
        };
    } else if (reason === 'access_denied') {
        info = {
          title: 'Access Denied',
          message: 'You don\'t have permission to access this resource. Please contact support if you believe this is an error.',
          icon: 'error',
          actions: [
            {
              label: 'Sign In',
              href: '/auth/login',
              primary: true
            },
            {
              label: 'Contact Support',
              href: '/contact'
            }
          ]
        };
    } else {
        info = {
          title: 'Authentication Error',
          message: 'An unexpected authentication error occurred. Please try signing in again.',
          icon: 'error',
          actions: [
            {
              label: 'Sign In',
              href: '/auth/login',
              primary: true
            },
            {
              label: 'Go Home',
              href: '/'
            }
          ]
        };
    }

    setErrorInfo(info);
  }, [searchParams, router]);

  if (!errorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <ErrorIcon type={errorInfo.icon} />
        </div>

        {/* Title and Message */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {errorInfo.message}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {errorInfo.actions.map((action, index) => (
            <div key={index}>
              {action.href ? (
                <a
                  href={action.href}
                  className={`w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    action.primary
                      ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500'
                  }`}
                >
                  {action.label}
                </a>
              ) : (
                <button
                  onClick={action.onClick}
                  className={`w-full flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    action.primary
                      ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500'
                  }`}
                >
                  {action.label}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="text-sm text-gray-500 mt-8">
          <p>Still having trouble?</p>
          <a href="/contact" className="text-indigo-600 hover:text-indigo-500 font-medium">
            Contact our support team
          </a>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}