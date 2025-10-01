'use client';

/**
 * CRISIS-CRITICAL: Mobile-Safe Age Verification
 * Ultra-lightweight, mobile-optimized age verification for crisis situations
 * Uses only inline styles to avoid dependency failures
 */

import React, { useState, useEffect } from 'react';

interface MobileSafeAgeVerificationProps {
  onVerificationComplete: (ageGroup: 'under13' | 'teen' | 'adult', requiresParentalConsent: boolean) => void;
  onExit: () => void;
}

interface VerificationState {
  step: 'initial' | 'birthdate' | 'under13_notice' | 'teen_notice' | 'adult_verification';
  birthMonth: string;
  birthYear: string;
  ageGroup: 'under13' | 'teen' | 'adult' | null;
  startTime: number;
}

// CRISIS-SAFE: Inline styles that work on ALL mobile browsers
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    // Safe area support for iOS
    paddingTop: 'max(24px, env(safe-area-inset-top))',
    paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
    paddingLeft: 'max(16px, env(safe-area-inset-left))',
    paddingRight: 'max(16px, env(safe-area-inset-right))',
    // Prevent zoom on touch
    touchAction: 'manipulation'
  } as React.CSSProperties,
  
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 8px 32px rgba(164, 183, 146, 0.15)',
    color: '#2e2e2e',
    textAlign: 'center'
  } as React.CSSProperties,
  
  icon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 24px',
    background: 'linear-gradient(135deg, #a4b792, #93a682)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    boxShadow: '0 8px 24px rgba(164, 183, 146, 0.3)'
  } as React.CSSProperties,
  
  title: {
    fontSize: '28px',
    fontWeight: '300',
    color: '#2e2e2e',
    margin: '0 0 8px 0',
    letterSpacing: '-0.01em',
    lineHeight: '1.3'
  } as React.CSSProperties,
  
  subtitle: {
    fontSize: '16px',
    fontWeight: '400',
    color: '#4a4a4a',
    margin: '0 0 32px 0',
    lineHeight: '1.5'
  } as React.CSSProperties,
  
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    margin: '24px 0'
  } as React.CSSProperties,
  
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '500',
    color: '#4a4a4a',
    marginBottom: '8px',
    textAlign: 'left'
  } as React.CSSProperties,
  
  select: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid rgba(164, 183, 146, 0.3)',
    borderRadius: '12px',
    color: '#2e2e2e',
    fontSize: '16px',
    fontWeight: '400',
    padding: '16px',
    appearance: 'none',
    cursor: 'pointer',
    // CRISIS-CRITICAL: Large touch targets for mobile
    minHeight: '56px',
    boxShadow: '0 2px 8px rgba(164, 183, 146, 0.1)',
    transition: 'all 0.3s ease',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 1rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    // Prevent zoom on iOS
    touchAction: 'manipulation'
  } as React.CSSProperties,
  
  primaryButton: {
    width: '100%',
    background: '#a4b792',
    color: 'white',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    // CRISIS-CRITICAL: Extra large touch targets
    minHeight: '60px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(164, 183, 146, 0.3)',
    touchAction: 'manipulation'
  } as React.CSSProperties,
  
  secondaryButton: {
    width: '100%',
    background: 'transparent',
    color: '#d97706',
    padding: '12px 20px',
    border: '2px solid #d97706',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    minHeight: '52px',
    transition: 'all 0.3s ease',
    touchAction: 'manipulation'
  } as React.CSSProperties,
  
  exitButton: {
    background: 'none',
    border: 'none',
    color: '#6b6b6b',
    fontSize: '14px',
    fontWeight: '400',
    cursor: 'pointer',
    padding: '12px 16px',
    minHeight: '40px',
    transition: 'all 0.3s ease',
    touchAction: 'manipulation'
  } as React.CSSProperties,
  
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px'
  } as React.CSSProperties,
  
  crisisSupport: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(164, 183, 146, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  } as React.CSSProperties,
  
  crisisButton: {
    display: 'block',
    padding: '12px 20px',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    background: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    minHeight: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'manipulation'
  } as React.CSSProperties
};

export default function MobileSafeAgeVerification({ onVerificationComplete, onExit }: MobileSafeAgeVerificationProps) {
  const [state, setState] = useState<VerificationState>({
    step: 'initial',
    birthMonth: '',
    birthYear: '',
    ageGroup: null,
    startTime: Date.now()
  });

  const [error, setError] = useState<string | null>(null);

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
    try {
      const birthDate = new Date(parseInt(birthYear), parseInt(birthMonth) - 1, 1);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const adjustedAge = monthDiff < 0 ? age - 1 : age;

      if (adjustedAge < 13) return 'under13';
      if (adjustedAge < 18) return 'teen';
      return 'adult';
    } catch (error) {
      console.error('Age calculation error:', error);
      return 'adult'; // Default to adult for safety
    }
  };

  const handleDateSubmit = () => {
    setError(null);
    
    if (!state.birthMonth || !state.birthYear) {
      setError('Please select both month and year');
      return;
    }

    // COPPA compliance: Minimum time check
    const timeSpent = Date.now() - state.startTime;
    if (timeSpent < 5000) { // Reduced for crisis situations
      setError('Please take a moment to carefully enter your birth date');
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
    
    // Log for compliance (minimal data)
    console.log('[MOBILE_AGE_VERIFICATION]', {
      ageGroup: state.ageGroup,
      requiresParentalConsent,
      timestamp: new Date().toISOString(),
      isMobile: true
    });

    onVerificationComplete(state.ageGroup, requiresParentalConsent);
  };

  const renderStep = () => {
    switch (state.step) {
      case 'initial':
        return (
          <>
            <div style={styles.icon}>
              <span>🛡️</span>
            </div>
            <h1 style={styles.title}>Safe Space</h1>
            <p style={styles.subtitle}>Privacy-first age verification</p>
            
            {error && (
              <div style={{ 
                background: 'rgba(220, 38, 38, 0.1)', 
                border: '1px solid rgba(220, 38, 38, 0.3)', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate', startTime: Date.now() }))}
                style={styles.primaryButton}
                onTouchStart={() => {
                  // Haptic feedback if available
                  if (navigator.vibrate) navigator.vibrate(50);
                }}
              >
                Begin Verification
              </button>
              <button
                onClick={onExit}
                style={styles.secondaryButton}
              >
                Not Right Now
              </button>
            </div>
            
            {/* CRISIS-CRITICAL: Always accessible crisis support */}
            <div style={styles.crisisSupport}>
              <a
                href="tel:988"
                style={styles.crisisButton}
              >
                📞 Crisis Support: Call 988
              </a>
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
            
            {error && (
              <div style={{ 
                background: 'rgba(220, 38, 38, 0.1)', 
                border: '1px solid rgba(220, 38, 38, 0.3)', 
                borderRadius: '8px', 
                padding: '12px',
                marginBottom: '16px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}
            
            <div style={styles.form}>
              <div>
                <label style={styles.label}>Birth Month</label>
                <select
                  value={state.birthMonth}
                  onChange={(e) => setState(prev => ({ ...prev, birthMonth: e.target.value }))}
                  style={styles.select}
                >
                  <option value="">Select month...</option>
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
                >
                  <option value="">Select year...</option>
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
              >
                Verify My Age
              </button>
              <button
                onClick={onExit}
                style={styles.secondaryButton}
              >
                Cancel
              </button>
            </div>
            
            {/* Crisis support always available */}
            <div style={styles.crisisSupport}>
              <a href="tel:988" style={styles.crisisButton}>📞 Crisis Support: Call 988</a>
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
              >
                Continue with Parent
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate', birthMonth: '', birthYear: '' }))} 
                style={styles.secondaryButton}
              >
                Re-enter Date
              </button>
              <button onClick={onExit} style={styles.exitButton}>Exit</button>
            </div>
            <div style={styles.crisisSupport}>
              <a href="tel:988" style={styles.crisisButton}>📞 Crisis Support: Call 988</a>
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
              >
                Continue with Protection
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate', birthMonth: '', birthYear: '' }))} 
                style={styles.secondaryButton}
              >
                Re-enter Date
              </button>
              <button onClick={onExit} style={styles.exitButton}>Exit</button>
            </div>
            <div style={styles.crisisSupport}>
              <a href="tel:988" style={styles.crisisButton}>📞 Crisis Support: Call 988</a>
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
                onTouchStart={() => {
                  // Success haptic feedback
                  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                }}
              >
                Continue to ALCHM
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate', birthMonth: '', birthYear: '' }))} 
                style={styles.secondaryButton}
              >
                Re-enter Date
              </button>
              <button onClick={onExit} style={styles.exitButton}>Exit</button>
            </div>
            <div style={styles.crisisSupport}>
              <a href="tel:988" style={styles.crisisButton}>📞 Crisis Support: Call 988</a>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      sessionStorage.removeItem('age_verification_temp');
    };
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {renderStep()}
      </div>
    </div>
  );
}