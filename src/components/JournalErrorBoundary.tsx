// src/components/JournalErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class JournalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State | null {
    // Ignore empty errors entirely — do not update state
    if (!error || !error.message || error.message.trim() === '') {
      return null; // Returning null means state is not updated = no error UI
    }
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Empty error — ignore completely
    if (!error || !error.message) return;

    console.error('[JournalErrorBoundary]', error.message, errorInfo.componentStack?.split('\n')[1]);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          background: 'var(--bg-base)',
        }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '16px',
            fontWeight: 300,
            color: 'var(--text-secondary)',
            textAlign: 'center',
            lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            Something interrupted your writing.{'\n'}
            Your words are safe.
          </p>
          <button
            className="btn-primary"
            style={{
              width: '200px',
            }}
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
          >
            Continue writing
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
