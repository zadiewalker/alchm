'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import * as Sentry from '@sentry/react';

export default function CapacitorErrorHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enhanced global error handling for Capacitor context
    const handleGlobalError = (event: ErrorEvent) => {
      const errorInfo = {
        message: event.message || 'Unknown error',
        filename: event.filename || 'Unknown file',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        error: event.error,
        stack: event.error?.stack,
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.group('🔴 Global Error Caught');
      console.error('Error details:', errorInfo);
      console.groupEnd();

      // Send to Sentry with enhanced context
      if (typeof window !== 'undefined') {
        Sentry.withScope((scope) => {
          scope.setTag('platform', errorInfo.platform);
          scope.setTag('isNative', errorInfo.isNative);
          scope.setContext('errorDetails', errorInfo);
          scope.setLevel('error');
          
          Sentry.captureException(event.error || new Error(errorInfo.message), {
            tags: {
              component: 'CapacitorErrorHandler',
              type: 'globalError'
            },
            extra: errorInfo
          });
        });
      }

      return false; // Allow default error handling
    };

    // Enhanced unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorInfo = {
        reason: event.reason,
        promise: event.promise,
        platform: Capacitor.getPlatform(),
        isNative: Capacitor.isNativePlatform(),
        timestamp: new Date().toISOString(),
        url: window.location.href
      };

      console.group('🟠 Unhandled Promise Rejection');
      console.error('Rejection details:', errorInfo);
      console.groupEnd();

      // Send to Sentry with enhanced context
      if (typeof window !== 'undefined') {
        Sentry.withScope((scope) => {
          scope.setTag('platform', errorInfo.platform);
          scope.setTag('isNative', errorInfo.isNative);
          scope.setContext('rejectionDetails', errorInfo);
          scope.setLevel('warning');
          
          const error = event.reason instanceof Error 
            ? event.reason 
            : new Error(String(event.reason));
          
          Sentry.captureException(error, {
            tags: {
              component: 'CapacitorErrorHandler',
              type: 'unhandledRejection'
            },
            extra: errorInfo
          });
        });
      }

      event.preventDefault(); // Prevent default rejection handling
    };

    // Console override to capture console.error calls
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Check for specific error patterns
      const errorMessage = args.join(' ');
      
      // Detect empty error objects or specific patterns
      if (errorMessage.includes('{}') || 
          errorMessage.includes('⚡️ [error]') ||
          errorMessage.includes('undefined is not an object')) {
        
        const enhancedError = {
          originalArgs: args,
          errorMessage,
          platform: Capacitor.getPlatform(),
          isNative: Capacitor.isNativePlatform(),
          timestamp: new Date().toISOString(),
          stack: new Error().stack,
          url: window.location.href
        };

        console.group('🔍 Enhanced Error Logging');
        console.log('Detected problematic error pattern:', enhancedError);
        console.groupEnd();

        // Send to Sentry
        if (typeof window !== 'undefined') {
          Sentry.captureMessage(`Capacitor Error Pattern: ${errorMessage}`, {
            level: 'error',
            tags: {
              component: 'CapacitorErrorHandler',
              type: 'consoleError',
              pattern: 'emptyObject'
            },
            extra: enhancedError
          });
        }
      }
    };

    // Add event listeners
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Capacitor-specific ready handler
    const handleCapacitorReady = () => {
      console.group('⚡ Capacitor Status');
      console.log('Platform:', Capacitor.getPlatform());
      console.log('Is Native:', Capacitor.isNativePlatform());
      console.log('Available Plugins: [Capacitor plugins loaded]');
      console.groupEnd();
    };

    if (Capacitor.isNativePlatform()) {
      document.addEventListener('deviceready', handleCapacitorReady);
    } else {
      handleCapacitorReady();
    }

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      document.removeEventListener('deviceready', handleCapacitorReady);
      console.error = originalConsoleError;
    };
  }, []);

  return <>{children}</>;
}