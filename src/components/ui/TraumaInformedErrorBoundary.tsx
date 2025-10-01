'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showCrisisSupport?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  crisisButtonRendered: boolean;
}

/**
 * Trauma-Informed Error Boundary
 * Ensures that application errors never remove crisis support access
 * and provides calming, non-alarming error messages
 */
export class TraumaInformedErrorBoundary extends Component<Props, State> {
  private crisisButtonId = 'trauma-informed-crisis-button';

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      crisisButtonRendered: false
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      crisisButtonRendered: false
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Immediately render crisis support when component fails
    this.renderEmergencyCrisisButton();

    // Log error for debugging (but don't include user content)
    console.error('ALCHM Component Error (Crisis support activated):', {
      error: error.message,
      stack: error.stack?.substring(0, 500), // Truncated for privacy
      component: errorInfo.componentStack?.substring(0, 200)
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.hasError && !this.state.crisisButtonRendered) {
      this.renderEmergencyCrisisButton();
    }
  }

  renderEmergencyCrisisButton = () => {
    if (this.state.crisisButtonRendered) return;

    let existingButton = document.getElementById(this.crisisButtonId);
    
    if (!existingButton) {
      existingButton = document.createElement('button');
      existingButton.id = this.crisisButtonId;
      existingButton.innerHTML = '🆘';
      existingButton.setAttribute('aria-label', 'Emergency Crisis Support - Call 988');
      existingButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 64px;
        height: 64px;
        background: linear-gradient(145deg, #dc2626, #b91c1c);
        border: 3px solid rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        color: white;
        font-size: 28px;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: emergency-pulse 1.5s infinite;
      `;
      
      // Add emergency CSS animation if not exists
      if (!document.getElementById('emergency-crisis-styles')) {
        const style = document.createElement('style');
        style.id = 'emergency-crisis-styles';
        style.textContent = `
          @keyframes emergency-pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4), 0 0 0 0 rgba(220, 38, 38, 0.8);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 12px 40px rgba(220, 38, 38, 0.6), 0 0 0 20px rgba(220, 38, 38, 0);
            }
          }
        `;
        document.head.appendChild(style);
      }

      existingButton.onclick = () => {
        // Multiple fallback methods for emergency call
        const emergencyCall = () => {
          try {
            window.open('tel:988', '_self');
          } catch (error) {
            try {
              window.location.href = 'tel:988';
            } catch (error2) {
              alert('EMERGENCY CRISIS SUPPORT\nCall 988 immediately\nNational Suicide Prevention Lifeline\n24/7 Free & Confidential');
            }
          }
        };
        
        // Haptic feedback for emergency
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        
        emergencyCall();
      };

      document.body.appendChild(existingButton);
      this.setState({ crisisButtonRendered: true });
    }
  };

  handleReload = () => {
    // Gentle reload with user consent
    if (confirm('Would you like to reload the page to try again? Your crisis support will remain available.')) {
      window.location.reload();
    }
  };

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined
    });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default trauma-informed error message
      if (this.props.fallback) {
        return (
          <div className="error-boundary-container">
            {this.props.fallback}
            {/* Always show crisis support when there's an error */}
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                variant="destructive"
                size="lg"
                onClick={() => window.open('tel:988', '_self')}
                className="rounded-full w-16 h-16 p-0 shadow-lg animate-pulse"
                aria-label="Emergency crisis support - Call 988"
              >
                <span className="text-2xl">🆘</span>
              </Button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            {/* Calming, non-alarming error message */}
            <div className="text-6xl mb-6 animate-gentle-pulse">🌿</div>
            <h1 className="text-2xl font-light mb-4 text-sanctuary-gray-800">
              Taking a gentle pause
            </h1>
            <p className="text-sanctuary-gray-600 mb-6 leading-relaxed">
              We're experiencing a small hiccup. Your safety and support remain our priority.
            </p>
            
            {/* Non-threatening action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Button 
                variant="primary" 
                onClick={this.handleRetry}
                className="min-w-[120px]"
              >
                Try again
              </Button>
              <Button 
                variant="secondary" 
                onClick={this.handleReload}
                className="min-w-[120px]"
              >
                Refresh page
              </Button>
            </div>
            
            {/* Always-present crisis support */}
            <div className="border-t border-sanctuary-gray-200 pt-6">
              <p className="text-sm text-sanctuary-gray-500 mb-4">
                Need support right now? We're here for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                    window.open('tel:988', '_self');
                  }}
                  className="flex items-center gap-2"
                >
                  <span>📞</span>
                  Call 988 Crisis Line
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (navigator.vibrate) navigator.vibrate([50, 25, 50]);
                    window.open('sms:741741&body=HOME', '_self');
                  }}
                  className="flex items-center gap-2"
                >
                  <span>💬</span>
                  Text HOME to 741741
                </Button>
              </div>
            </div>
            
            {/* Debug info for development (hidden in production) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-sanctuary-gray-400">
                  Technical details (development only)
                </summary>
                <div className="mt-2 p-4 bg-sanctuary-gray-50 rounded text-xs font-mono text-sanctuary-gray-700">
                  <div className="font-bold mb-2">Error:</div>
                  <div className="mb-4">{this.state.error.message}</div>
                  {this.state.error.stack && (
                    <>
                      <div className="font-bold mb-2">Stack Trace:</div>
                      <pre className="whitespace-pre-wrap text-xs">
                        {this.state.error.stack.substring(0, 1000)}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default TraumaInformedErrorBoundary;