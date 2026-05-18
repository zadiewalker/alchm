'use client';

import * as Sentry from '@sentry/react';
import { Component, ReactNode } from 'react';
import { safeWindow } from '@/utils/browser';
import { DESIGN } from '@/lib/design';

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
      this.clearRecoveryState()
      safeWindow.open('/', '_self')
    } else {
      // Avoid window.location.reload() in Capacitor (can create loops); re-open current URL instead.
      safeWindow.open(safeWindow.location.href || '/', '_self')
    }
  }

  handleReset = () => {
    this.clearRecoveryState()
    safeWindow.open('/', '_self')
  }

  clearRecoveryState = () => {
    sessionStorage.removeItem('alchm-reload-count')
    sessionStorage.removeItem('alchm-error-state')
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced error UI with reload loop detection
      return (
        <div style={{ minHeight: '100vh', background: DESIGN.colors.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: DESIGN.spacing.md }}>
          <div style={{ background: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.border}`, borderRadius: DESIGN.radius.lg, padding: DESIGN.spacing.md, color: DESIGN.colors.textPrimary, maxWidth: 420 }}>
            <h2 style={{ fontFamily: DESIGN.typography.serif, fontWeight: DESIGN.typography.weights.light, marginBottom: DESIGN.spacing.sm }}>Something went wrong</h2>
            
            {this.state.reloadCount > 2 && (
              <div className="mb-4 p-3 bg-red-500/20 rounded-xl">
                <p style={{ color: DESIGN.colors.error, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm }}>
                  Multiple reload attempts detected. This might be a loop issue.
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <button 
                onClick={this.handleReload}
                style={{ width: '100%', minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.md, border: `1px solid ${DESIGN.colors.border}`, background: DESIGN.colors.bgElevated, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}
                disabled={this.state.reloadCount > 3}
              >
                {this.state.reloadCount > 3 ? 'Too many attempts' : 'Reload App'}
              </button>
              
              <button
                onClick={this.handleReset}
                style={{ width: '100%', minHeight: '44px', padding: '10px 14px', borderRadius: DESIGN.radius.md, border: `1px solid ${DESIGN.colors.borderLight}`, background: DESIGN.colors.cardBg, color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, marginTop: DESIGN.spacing.sm }}
              >
                Return to Start
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
      <div style={{ minHeight: '100vh', background: DESIGN.colors.bgSurface, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: DESIGN.spacing.md }}>
        <div style={{ background: DESIGN.colors.cardBg, border: `1px solid ${DESIGN.colors.border}`, borderRadius: DESIGN.radius.lg, padding: DESIGN.spacing.lg, maxWidth: 420, textAlign: 'center' }}>
          <h2 style={{ color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.serif, fontWeight: DESIGN.typography.weights.light, marginBottom: DESIGN.spacing.sm }}>Application Error</h2>
          <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm, marginBottom: DESIGN.spacing.md }}>Something interrupted this screen.</p>
          <button
            onClick={resetError}
            style={{ width: '100%', minHeight: '44px', borderRadius: DESIGN.radius.md, border: `1px solid ${DESIGN.colors.border}`, background: DESIGN.colors.bgElevated, color: DESIGN.colors.textPrimary, fontFamily: DESIGN.typography.sansSerif }}
          >
            <span>Reset</span>
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
