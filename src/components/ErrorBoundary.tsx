'use client';

import * as Sentry from '@sentry/react';
import { Component, ReactNode } from 'react';
import { safeWindow } from '@/utils/browser';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  reloadCount: number;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private reloadTimer?: NodeJS.Timeout

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    // Track reload attempts
    const reloadCount = parseInt(sessionStorage.getItem('alchm-reload-count') || '0')
    
    this.state = { 
      hasError: false,
      reloadCount 
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      reloadCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error boundary caught:', error)
    console.error('📍 Component stack:', errorInfo.componentStack)
    
    // Check for potential infinite loops
    if (this.state.reloadCount > 3) {
      console.error('🔄 Potential infinite reload loop detected!')
      sessionStorage.setItem('alchm-error-state', 'loop-detected')
    }

    // Log error to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setTag('errorBoundary', this.props.name || 'unknown');
      scope.setLevel('error');
      scope.setContext('errorBoundary', {
        componentStack: errorInfo.componentStack,
        name: this.props.name,
        reloadCount: this.state.reloadCount,
      });
      Sentry.captureException(error);
    });

    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    const newCount = this.state.reloadCount + 1
    sessionStorage.setItem('alchm-reload-count', newCount.toString())
    
    if (newCount > 3) {
      // Too many reloads - clear everything
      localStorage.clear()
      sessionStorage.clear()
      safeWindow.open('/', '_self')
    } else {
      // Avoid window.location.reload() in Capacitor (can create loops); re-open current URL instead.
      safeWindow.open(safeWindow.location.href || '/', '_self')
    }
  }

  handleReset = () => {
    // Clear all data and restart
    localStorage.clear()
    sessionStorage.clear()
    
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name))
      })
    }
    
    safeWindow.open('/', '_self')
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced error UI with reload loop detection
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] 
                        flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white max-w-md">
            <h2 className="text-lg font-medium mb-3">Something went wrong</h2>
            
            {this.state.reloadCount > 2 && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-xl">
                <p className="text-sm text-red-200">
                  Multiple reload attempts detected. This might be a loop issue.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <button 
                onClick={this.handleReload}
                className="w-full px-4 py-2 bg-white/20 rounded-xl text-sm hover:bg-white/30 transition-colors"
                disabled={this.state.reloadCount > 3}
              >
                {this.state.reloadCount > 3 ? 'Too many attempts' : 'Reload App'}
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full px-4 py-2 bg-white/10 rounded-xl text-xs opacity-70 hover:opacity-100 transition-opacity"
              >
                Reset Everything & Start Fresh
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary className="text-xs opacity-50 cursor-pointer">Debug Info</summary>
                <pre className="text-xs mt-2 p-2 bg-black/20 rounded overflow-auto max-h-32">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC version using Sentry's error boundary
export const SentryErrorBoundary = Sentry.withErrorBoundary(
  ({ children }: { children: ReactNode }) => <>{children}</>,
  {
    fallback: ({ error, resetError }) => (
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center">
          <h2 className="text-white text-xl font-light mb-4">Application Error</h2>
          <p className="text-white/80 text-sm mb-6">{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
          <button
            onClick={resetError}
            className="w-full py-3 rounded-xl bg-[#E5C97D] hover:bg-[#F2D99D] transition-all duration-200"
          >
            <span className="text-white text-sm font-medium">Reset</span>
          </button>
        </div>
      </div>
    ),
    beforeCapture: (scope, error, errorInfo) => {
      scope.setTag('errorBoundary', 'sentry');
      scope.setLevel('error');
    },
  }
);

export default ErrorBoundary;
