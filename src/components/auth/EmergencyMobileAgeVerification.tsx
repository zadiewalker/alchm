'use client';

import { useState, useEffect } from 'react';
import { MobileAgeVerificationErrorBoundary } from './MobileAgeVerificationErrorBoundary';

interface EmergencyMobileAgeVerificationProps {
  children: React.ReactNode;
  onVerificationComplete?: (verified: boolean) => void;
}

/**
 * EMERGENCY MOBILE AGE VERIFICATION
 * Ultra-robust fallback for mobile crisis situations
 * - No external dependencies
 * - Inline styles only
 * - Maximum touch target sizes
 * - Crisis resources always accessible
 * - Works offline
 * - Compatible with all mobile browsers
 */
export default function EmergencyMobileAgeVerification({ 
  children, 
  onVerificationComplete 
}: EmergencyMobileAgeVerificationProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Emergency inline styles - no external CSS dependencies
  const styles = {
    overlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
      background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      textRendering: 'optimizeLegibility',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
    },
    container: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '32px 24px',
      maxWidth: '380px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      textAlign: 'center' as const,
      position: 'relative' as const,
    },
    icon: {
      fontSize: '64px',
      marginBottom: '24px',
      display: 'block',
      lineHeight: '1',
    },
    title: {
      fontSize: '28px',
      fontWeight: '300' as const,
      color: '#2a2d2a',
      margin: '0 0 8px 0',
      letterSpacing: '-0.5px',
      lineHeight: '1.2',
    },
    subtitle: {
      fontSize: '16px',
      color: '#6b7568',
      margin: '0 0 32px 0',
      lineHeight: '1.5',
      fontWeight: '300' as const,
    },
    label: {
      display: 'block',
      fontSize: '16px',
      color: '#4a4a4a',
      marginBottom: '12px',
      textAlign: 'left' as const,
      fontWeight: '500' as const,
    },
    select: {
      width: '100%',
      padding: '20px 16px',
      fontSize: '18px',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      background: '#ffffff',
      color: '#2a2d2a',
      appearance: 'none' as const,
      WebkitAppearance: 'none' as const,
      cursor: 'pointer',
      minHeight: '64px', // Extra large for mobile
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 20px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '20px 20px',
      paddingRight: '60px',
      touchAction: 'manipulation',
    },
    selectFocused: {
      borderColor: '#a4b792',
      boxShadow: '0 0 0 4px rgba(164, 183, 146, 0.1)',
    },
    button: {
      width: '100%',
      padding: '20px 24px',
      fontSize: '18px',
      fontWeight: '600' as const,
      border: 'none',
      borderRadius: '16px',
      background: '#a4b792',
      color: 'white',
      cursor: 'pointer',
      minHeight: '64px', // Extra large for mobile
      margin: '24px 0 16px 0',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      outline: 'none',
      touchAction: 'manipulation',
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    buttonLoading: {
      background: '#93a682',
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      margin: '16px 0',
      color: '#dc2626',
      fontSize: '15px',
      fontWeight: '500' as const,
    },
    privacy: {
      fontSize: '12px',
      color: '#93a682',
      lineHeight: '1.4',
      marginTop: '24px',
      padding: '16px 0',
      borderTop: '1px solid rgba(164, 183, 146, 0.2)',
    },
    crisisContainer: {
      position: 'absolute' as const,
      bottom: '24px',
      left: '24px',
      right: '24px',
      display: 'flex',
      gap: '12px',
    },
    crisisButton: {
      flex: 1,
      padding: '16px 12px',
      background: '#dc2626',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600' as const,
      textAlign: 'center' as const,
      minHeight: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      touchAction: 'manipulation',
      border: 'none',
      cursor: 'pointer',
    },
  };

  // Check existing verification on mount
  useEffect(() => {
    try {
      const verified = localStorage.getItem('alchm_age_verified_emergency');
      const verificationDate = localStorage.getItem('alchm_verification_date_emergency');
      
      if (verified === 'true' && verificationDate) {
        const daysSince = (Date.now() - parseInt(verificationDate)) / (1000 * 60 * 60 * 24);
        if (daysSince < 7) { // Verify weekly for emergency mode
          setIsVerified(true);
          if (onVerificationComplete) {
            onVerificationComplete(true);
          }
        }
      }
    } catch (error) {
      console.warn('[Emergency Age Verification] Storage check failed:', error);
    }
    setHasChecked(true);
  }, [onVerificationComplete]);

  const handleVerification = async () => {
    if (!selectedYear) {
      setError('Please select your birth year to continue');
      return;
    }

    setError('');
    setIsLoading(true);

    // Add delay for better UX and to prevent rapid attempts
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const age = new Date().getFullYear() - parseInt(selectedYear);
      
      if (age < 18) {
        // Redirect to age-appropriate resources
        window.location.href = 'https://kidshealth.org/teen/';
        return;
      }

      // Store verification
      localStorage.setItem('alchm_age_verified_emergency', 'true');
      localStorage.setItem('alchm_verification_date_emergency', Date.now().toString());
      
      setIsVerified(true);
      
      if (onVerificationComplete) {
        onVerificationComplete(true);
      }
    } catch (error) {
      setError('Unable to verify age. Please try again.');
      console.error('[Emergency Age Verification] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#a4b792';
    e.target.style.boxShadow = '0 0 0 4px rgba(164, 183, 146, 0.1)';
  };

  const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = '#e5e7eb';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading && selectedYear) {
      e.currentTarget.style.background = '#93a682';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isLoading) {
      e.currentTarget.style.background = '#a4b792';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  // Generate year options
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 100; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  // If verified, show children
  if (isVerified && hasChecked) {
    return <>{children}</>;
  }

  // Show verification overlay with error boundary
  return (
    <MobileAgeVerificationErrorBoundary
      onError={(error, errorInfo) => {
        console.error('🚨 Mobile Age Verification Failed:', error);
        
        // Attempt to continue with simple verification
        if (typeof window !== 'undefined') {
          console.log('📊 Falling back to simple age verification');
        }
      }}
    >
    <div style={styles.overlay}>
      <div style={styles.container}>
        <span style={styles.icon}>🛡️</span>
        
        <h1 style={styles.title}>Welcome to ALCHM</h1>
        <p style={styles.subtitle}>
          Your safe space for healing and growth
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={{ textAlign: 'left' }}>
          <label htmlFor="emergency-birth-year" style={styles.label}>
            What year were you born?
          </label>
          
          <select
            id="emergency-birth-year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setError('');
            }}
            onFocus={handleSelectFocus}
            onBlur={handleSelectBlur}
            style={styles.select}
            disabled={isLoading}
          >
            <option value="">Choose your birth year...</option>
            {generateYearOptions().map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleVerification}
          disabled={!selectedYear || isLoading}
          style={{
            ...styles.button,
            ...((!selectedYear || isLoading) ? styles.buttonDisabled : {}),
            ...(isLoading ? styles.buttonLoading : {}),
          }}
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleButtonLeave}
        >
          {isLoading ? (
            <span>⏳ Verifying...</span>
          ) : (
            'Enter Your Sanctuary'
          )}
        </button>

        <div style={styles.privacy}>
          Your privacy is protected • Stored locally • Never shared
        </div>
      </div>

      {/* Crisis support always available */}
      <div style={styles.crisisContainer}>
        <a 
          href="tel:988" 
          style={styles.crisisButton}
          onTouchStart={(e) => {
            e.currentTarget.style.background = '#b91c1c';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
        >
          📞 988
        </a>
        <a 
          href="sms:741741&body=HOME" 
          style={styles.crisisButton}
          onTouchStart={(e) => {
            e.currentTarget.style.background = '#b91c1c';
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.background = '#dc2626';
          }}
        >
          💬 HOME
        </a>
      </div>
    </div>
    </MobileAgeVerificationErrorBoundary>
  );
}