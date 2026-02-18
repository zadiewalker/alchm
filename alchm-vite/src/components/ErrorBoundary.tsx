
import React from 'react';
import { DESIGN } from '@/lib/design';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; name?: string },
  { hasError: boolean; message: string }
> {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Something went wrong.';
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    // The only acceptable console usage in this project.
    console.error('ErrorBoundary:', this.props.name || 'app', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: DESIGN.colors.bgDeep,
          color: DESIGN.colors.textPrimary,
          fontFamily: DESIGN.typography.sansSerif,
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '14px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: DESIGN.typography.weights.medium }}>ALCHM hit an error</div>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.5 }}>
          {this.state.message || 'Something went wrong.'}
        </div>
        <button
          type="button"
          onClick={this.handleReset}
          aria-label="Reset the app view"
          style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid ${DESIGN.colors.border}`,
            backgroundColor: DESIGN.colors.cardBg,
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }
}

