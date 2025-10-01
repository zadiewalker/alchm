'use client';

import React, { useState, useEffect } from 'react';

interface AgeVerificationGateProps {
  onVerificationComplete: (ageGroup: 'under13' | 'teen' | 'adult', requiresParentalConsent: boolean) => void;
  onExit: () => void;
}

interface AgeVerificationState {
  step: 'initial' | 'birthdate' | 'under13_notice' | 'teen_notice' | 'adult_verification';
  birthMonth: string;
  birthYear: string;
  ageGroup: 'under13' | 'teen' | 'adult' | null;
  verificationAttempts: number;
  startTime: number;
}

// Safe inline styles that don't depend on custom Tailwind classes
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
  },
  card: {
    background: 'rgba(254, 252, 251, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(164, 183, 146, 0.15)',
    color: '#2e2e2e',
    textAlign: 'center' as const
  },
  icon: {
    width: '96px',
    height: '96px',
    margin: '0 auto 24px',
    background: 'linear-gradient(135deg, #a4b792, #93a682)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    boxShadow: '0 8px 24px rgba(164, 183, 146, 0.3)'
  },
  title: {
    fontSize: '32px',
    fontWeight: '200' as const,
    color: '#2e2e2e',
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
    lineHeight: '1.3'
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: '300' as const,
    color: '#4a4a4a',
    margin: '0 0 32px 0',
    lineHeight: '1.6',
    letterSpacing: '0.015em'
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    margin: '24px 0'
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '400' as const,
    color: '#4a4a4a',
    marginBottom: '8px',
    textAlign: 'left' as const,
    letterSpacing: '0.015em'
  },
  select: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '12px',
    color: '#2e2e2e',
    fontSize: '16px',
    fontWeight: '400' as const,
    padding: '16px',
    appearance: 'none' as const,
    cursor: 'pointer',
    minHeight: '52px',
    boxShadow: '0 2px 8px rgba(164, 183, 146, 0.1)',
    transition: 'all 0.3s ease',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 1.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em'
  },
  primaryButton: {
    width: '100%',
    background: '#a4b792',
    color: 'white',
    padding: '16px 32px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    minHeight: '56px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(164, 183, 146, 0.3)',
    letterSpacing: '0.015em'
  },
  secondaryButton: {
    width: '100%',
    background: 'transparent',
    color: '#d97706',
    padding: '12px 24px',
    border: '2px solid #d97706',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '400' as const,
    cursor: 'pointer',
    minHeight: '48px',
    transition: 'all 0.3s ease',
    letterSpacing: '0.015em'
  },
  textButton: {
    background: 'none',
    border: 'none',
    color: '#6b6b6b',
    fontSize: '14px',
    fontWeight: '300' as const,
    cursor: 'pointer',
    padding: '8px 16px',
    minHeight: '32px',
    transition: 'all 0.3s ease'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    marginTop: '24px'
  },
  notice: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(164, 183, 146, 0.2)',
    fontSize: '14px',
    color: '#6b6b6b',
    lineHeight: '1.6'
  }
};

export default function AgeVerificationGateSafe({ onVerificationComplete, onExit }: AgeVerificationGateProps) {
  const [state, setState] = useState<AgeVerificationState>({
    step: 'initial',
    birthMonth: '',
    birthYear: '',
    ageGroup: null,
    verificationAttempts: 0,
    startTime: Date.now()
  });

  const MAX_VERIFICATION_ATTEMPTS = 3;
  const MINIMUM_VERIFICATION_TIME = 10000;

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - i);
  const monthOptions = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const calculateAgeGroup = (birthMonth: string, birthYear: string): 'under13' | 'teen' | 'adult' => {
    const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, 1);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const adjustedAge = monthDiff < 0 ? age - 1 : age;

    if (adjustedAge < 13) return 'under13';
    if (adjustedAge < 18) return 'teen';
    return 'adult';
  };

  const handleDateSubmit = () => {
    if (!state.birthMonth || !state.birthYear) return;

    const timeSpent = Date.now() - state.startTime;
    if (timeSpent < MINIMUM_VERIFICATION_TIME) {
      alert('Please take time to carefully enter your birth date.');
      return;
    }

    const ageGroup = calculateAgeGroup(state.birthMonth, state.birthYear);
    setState(prev => ({
      ...prev,
      ageGroup,
      step: ageGroup === 'under13' ? 'under13_notice' : 
            ageGroup === 'teen' ? 'teen_notice' : 'adult_verification'
    }));
  };

  const handleVerificationComplete = () => {
    if (!state.ageGroup) return;

    const requiresParentalConsent = state.ageGroup === 'under13' || state.ageGroup === 'teen';
    
    console.log('[AGE_VERIFICATION]', {
      ageGroup: state.ageGroup,
      requiresParentalConsent,
      timestamp: new Date().toISOString(),
      verificationTime: Date.now() - state.startTime
    });

    onVerificationComplete(state.ageGroup, requiresParentalConsent);
  };

  const handleRetry = () => {
    if (state.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      alert('Maximum verification attempts reached. Please contact support.');
      onExit();
      return;
    }

    setState(prev => ({
      ...prev,
      step: 'birthdate',
      birthMonth: '',
      birthYear: '',
      ageGroup: null,
      verificationAttempts: prev.verificationAttempts + 1,
      startTime: Date.now()
    }));
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('age_verification_temp');
    };
  }, []);

  const renderStep = () => {
    switch (state.step) {
      case 'initial':
        return (
          <>
            <div style={styles.icon}>
              <span>🛡️</span>
            </div>
            <h1 style={styles.title}>Safe Space</h1>
            <p style={styles.subtitle}>Privacy-first verification</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate' }))}
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.background = '#93a682'}
                onMouseOut={(e) => e.currentTarget.style.background = '#a4b792'}
              >
                Begin Verification
              </button>
              <button
                onClick={onExit}
                style={styles.secondaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(217, 119, 6, 0.1)';
                  e.currentTarget.style.borderColor = '#b45309';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = '#d97706';
                }}
              >
                Not Right Now
              </button>
            </div>
            <div style={styles.notice}>
              Privacy protected by design
            </div>
          </>
        );

      case 'birthdate':
        return (
          <>
            <div style={styles.icon}>
              <span>📅</span>
            </div>
            <h1 style={styles.title}>Birth Date</h1>
            <p style={styles.subtitle}>Month and year for privacy</p>
            <div style={styles.form}>
              <div>
                <label style={styles.label}>Birth Month</label>
                <select
                  value={state.birthMonth}
                  onChange={(e) => setState(prev => ({ ...prev, birthMonth: e.target.value }))}
                  style={styles.select}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(164, 183, 146, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(164, 183, 146, 0.1)';
                  }}
                >
                  <option value="">Choose month...</option>
                  {monthOptions.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Birth Year</label>
                <select
                  value={state.birthYear}
                  onChange={(e) => setState(prev => ({ ...prev, birthYear: e.target.value }))}
                  style={styles.select}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(164, 183, 146, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(164, 183, 146, 0.1)';
                  }}
                >
                  <option value="">Choose year...</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year.toString()}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleDateSubmit}
                disabled={!state.birthMonth || !state.birthYear}
                style={{
                  ...styles.primaryButton,
                  opacity: (!state.birthMonth || !state.birthYear) ? 0.5 : 1,
                  cursor: (!state.birthMonth || !state.birthYear) ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if (state.birthMonth && state.birthYear) {
                    e.currentTarget.style.background = '#93a682';
                  }
                }}
                onMouseOut={(e) => {
                  if (state.birthMonth && state.birthYear) {
                    e.currentTarget.style.background = '#a4b792';
                  }
                }}
              >
                Verify My Age
              </button>
              <button
                onClick={onExit}
                style={styles.secondaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(217, 119, 6, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Cancel
              </button>
            </div>
            <div style={styles.notice}>
              Information protected locally
            </div>
          </>
        );

      case 'under13_notice':
        return (
          <>
            <div style={{ ...styles.icon, background: 'linear-gradient(135deg, #d97706, #b45309)' }}>
              <span>👨‍👩‍👧‍👦</span>
            </div>
            <h1 style={styles.title}>Parental Consent</h1>
            <p style={styles.subtitle}>COPPA requires guardian consent for users under 13</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleVerificationComplete}
                style={{...styles.primaryButton, background: '#d97706'}}
                onMouseOver={(e) => e.currentTarget.style.background = '#b45309'}
                onMouseOut={(e) => e.currentTarget.style.background = '#d97706'}
              >
                Continue with Parent
              </button>
              <button onClick={handleRetry} style={styles.secondaryButton}>Re-enter Date</button>
              <button onClick={onExit} style={styles.textButton}>Exit</button>
            </div>
          </>
        );

      case 'teen_notice':
        return (
          <>
            <div style={styles.icon}>
              <span>🛡️</span>
            </div>
            <h1 style={styles.title}>Enhanced Privacy</h1>
            <p style={styles.subtitle}>Teen users receive additional protections</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleVerificationComplete}
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.background = '#93a682'}
                onMouseOut={(e) => e.currentTarget.style.background = '#a4b792'}
              >
                Continue with Protection
              </button>
              <button onClick={handleRetry} style={styles.secondaryButton}>Re-enter Date</button>
              <button onClick={onExit} style={styles.textButton}>Exit</button>
            </div>
          </>
        );

      case 'adult_verification':
        return (
          <>
            <div style={styles.icon}>
              <span>✅</span>
            </div>
            <h1 style={styles.title}>Verified</h1>
            <p style={styles.subtitle}>Adult user • Full access</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={handleVerificationComplete}
                style={styles.primaryButton}
                onMouseOver={(e) => e.currentTarget.style.background = '#93a682'}
                onMouseOut={(e) => e.currentTarget.style.background = '#a4b792'}
              >
                Continue to ALCHM
              </button>
              <button onClick={handleRetry} style={styles.secondaryButton}>Re-enter Date</button>
              <button onClick={onExit} style={styles.textButton}>Exit</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {renderStep()}
      </div>
    </div>
  );
}