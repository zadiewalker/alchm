'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Log to analytics or error reporting service
    if (typeof window !== 'undefined') {
      console.log('📊 Error reported to console for debugging');
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI or default safe fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          color: 'white',
          fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
        }}>
          <div style={{
            background: 'rgba(254, 252, 251, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '420px',
            width: '100%',
            color: '#2e2e2e',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(164, 183, 146, 0.15)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '300', 
              margin: '0 0 16px 0',
              color: '#2e2e2e'
            }}>
              Taking a gentle pause
            </h2>
            <p style={{ 
              fontSize: '16px', 
              lineHeight: '1.6', 
              margin: '0 0 24px 0',
              color: '#4a4a4a'
            }}>
              We encountered a technical hiccup. Your privacy and data remain secure. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '12px',
                background: '#a4b792',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                minHeight: '52px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#93a682';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#a4b792';
              }}
            >
              Refresh Page
            </button>
            
            {/* Crisis support always accessible */}
            <div style={{
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(164, 183, 146, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <a
                href="tel:988"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  border: '1px solid #a4b792',
                  borderRadius: '8px',
                  background: 'rgba(164, 183, 146, 0.1)',
                  color: '#2e2e2e',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                📞 Crisis Support: Call 988
              </a>
              <a
                href="sms:741741&body=HOME"
                style={{
                  display: 'block',
                  padding: '12px 20px',
                  border: '1px solid #a4b792',
                  borderRadius: '8px',
                  background: 'rgba(164, 183, 146, 0.1)',
                  color: '#2e2e2e',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                💬 Text HOME to 741741
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;