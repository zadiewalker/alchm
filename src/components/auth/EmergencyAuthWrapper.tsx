'use client';

/**
 * CRISIS-CRITICAL: Emergency Auth Wrapper
 * Ensures age verification happens BEFORE any auth flow
 * Provides emergency bypass for crisis situations
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileSafeAgeVerification from './MobileSafeAgeVerification';

interface EmergencyAuthWrapperProps {
  children: React.ReactNode;
  requiresAgeVerification?: boolean;
}

interface AgeVerificationState {
  isVerified: boolean;
  ageGroup: 'under13' | 'teen' | 'adult' | null;
  requiresParentalConsent: boolean;
  bypassedForCrisis: boolean;
}

// CRISIS-SAFE: Check if user already completed verification
function getStoredVerification(): AgeVerificationState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = sessionStorage.getItem('alchm_age_verification');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Verify it's not expired (24 hours)
      const verifiedAt = new Date(parsed.verifiedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - verifiedAt.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        return {
          isVerified: true,
          ageGroup: parsed.ageGroup,
          requiresParentalConsent: parsed.requiresParentalConsent,
          bypassedForCrisis: parsed.bypassedForCrisis || false
        };
      } else {
        // Expired, clear it
        sessionStorage.removeItem('alchm_age_verification');
      }
    }
  } catch (error) {
    console.error('Error reading age verification:', error);
    // Trauma-informed: Gentle handling of data issues
    // Clear corrupted data without alarming user
    sessionStorage.removeItem('alchm_age_verification');
  }
  
  return null;
}

// CRISIS-SAFE: Store verification securely
function storeVerification(ageGroup: 'under13' | 'teen' | 'adult', requiresParentalConsent: boolean, bypassedForCrisis = false) {
  if (typeof window === 'undefined') return;
  
  try {
    const verification = {
      isVerified: true,
      ageGroup,
      requiresParentalConsent,
      bypassedForCrisis,
      verifiedAt: new Date().toISOString()
    };
    
    sessionStorage.setItem('alchm_age_verification', JSON.stringify(verification));
    
    // Also store in a backup location
    sessionStorage.setItem('alchm_age_backup', JSON.stringify(verification));
  } catch (error) {
    console.error('Error storing age verification:', error);
  }
}

export default function EmergencyAuthWrapper({ 
  children, 
  requiresAgeVerification = true 
}: EmergencyAuthWrapperProps) {
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<AgeVerificationState>({
    isVerified: false,
    ageGroup: null,
    requiresParentalConsent: false,
    bypassedForCrisis: false
  });
  const [showCrisisBypass, setShowCrisisBypass] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check existing verification on mount
  useEffect(() => {
    try {
      const stored = getStoredVerification();
      if (stored) {
        setVerificationState(stored);
      }
      setLoading(false);
    } catch (error) {
      console.error('🚨 CRITICAL: Age verification component error:', error);
      // Trauma-informed: Show gentle fallback instead of technical error
      setHasError(true);
      setLoading(false);
      
      // Immediate redirect to static fallback for P0 incident
      setTimeout(() => {
        window.location.href = '/emergency-age-verification.html';
      }, 100);
    }
  }, []);

  // CRISIS-CRITICAL: Emergency bypass after timeout AND error detection
  useEffect(() => {
    if (!requiresAgeVerification) return;
    
    const timer = setTimeout(() => {
      if (!verificationState.isVerified && !hasError) {
        console.log('⚠️ Emergency: Showing crisis bypass option');
        setShowCrisisBypass(true);
      }
    }, 15000); // Reduced to 15 seconds for crisis situations
    
    return () => clearTimeout(timer);
  }, [verificationState.isVerified, requiresAgeVerification, hasError]);

  // EMERGENCY: Auto-redirect to static fallback on React component errors
  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('🚨 EMERGENCY: Client-side error detected:', error);
      if (error.message.includes('Application error') || 
          error.message.includes('client side exception') ||
          error.filename?.includes('_app') ||
          error.filename?.includes('age') ||
          error.filename?.includes('verification')) {
        console.log('🚨 REDIRECTING TO STATIC FALLBACK');
        window.location.href = '/emergency-age-verification.html';
      }
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  const handleVerificationComplete = (ageGroup: 'under13' | 'teen' | 'adult', requiresParentalConsent: boolean) => {
    console.log('✅ Age verification completed:', { ageGroup, requiresParentalConsent });
    
    const newState = {
      isVerified: true,
      ageGroup,
      requiresParentalConsent,
      bypassedForCrisis: false
    };
    
    setVerificationState(newState);
    storeVerification(ageGroup, requiresParentalConsent, false);
  };

  const handleCrisisBypass = () => {
    console.log('🚨 CRISIS: Emergency bypass activated');
    
    const crisisState = {
      isVerified: true,
      ageGroup: 'adult' as const, // Default to adult for crisis access
      requiresParentalConsent: false,
      bypassedForCrisis: true
    };
    
    setVerificationState(crisisState);
    storeVerification('adult', false, true);
    
    // Log crisis bypass for safety monitoring
    if (typeof window !== 'undefined') {
      console.log('🚨 CRISIS BYPASS LOGGED:', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  };

  const handleExit = () => {
    // Redirect to crisis resources page or main landing
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p>Loading your safe space...</p>
          {/* Emergency timeout fallback */}
          <script dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                if (!window.alchm_verification_loaded) {
                  console.log('🚨 EMERGENCY TIMEOUT: Redirecting to static fallback');
                  window.location.href = '/emergency-age-verification.html';
                }
              }, 10000);
            `
          }} />
        </div>
      </div>
    );
  }

  // EMERGENCY: If error detected, show immediate fallback options
  if (hasError) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ marginBottom: '16px' }}>Something gentle went wrong</h2>
          <p style={{ marginBottom: '24px', lineHeight: '1.4' }}>
            Take a breath, you're safe here. We're gently redirecting you to continue your journey...
          </p>
          <div style={{ 
            background: 'rgba(220, 38, 38, 0.1)', 
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <a 
              href="tel:988" 
              style={{ 
                color: '#fee', 
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px'
              }}
            >
              📞 Crisis Support: Call 988
            </a>
          </div>
          <button
            onClick={() => window.location.href = '/emergency-age-verification.html'}
            style={{
              background: 'white',
              color: '#333',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Continue to Backup System
          </button>
        </div>
      </div>
    );
  }

  // If age verification not required or already completed, show children
  if (!requiresAgeVerification || verificationState.isVerified) {
    return <>{children}</>;
  }

  // Show age verification with crisis bypass option
  try {
    return (
      <div style={{ position: 'relative' }}>
        <MobileSafeAgeVerification
          onVerificationComplete={handleVerificationComplete}
          onExit={handleExit}
        />
        
        {/* CRISIS-CRITICAL: Emergency bypass option */}
        {showCrisisBypass && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
            textAlign: 'center',
            maxWidth: '320px',
            width: '90%',
            fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
          }}>
            <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚨</div>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              margin: '0 0 12px 0',
              lineHeight: '1.4'
            }}>
              Need immediate access for crisis support?
            </p>
            <button
              onClick={handleCrisisBypass}
              style={{
                width: '100%',
                background: 'white',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                minHeight: '48px',
                transition: 'all 0.2s ease',
                touchAction: 'manipulation'
              }}
              onTouchStart={() => {
                if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
              }}
            >
              Emergency Access
            </button>
            <p style={{ 
              fontSize: '11px', 
              margin: '8px 0 0 0', 
              opacity: 0.9,
              lineHeight: '1.3'
            }}>
              For users in crisis who need immediate journal access
            </p>
            <button
              onClick={() => window.location.href = '/emergency-age-verification.html'}
              style={{
                width: '100%',
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '8px',
                touchAction: 'manipulation'
              }}
            >
              Backup Verification System
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('🚨 CRITICAL ERROR in EmergencyAuthWrapper render:', error);
    // Immediate fallback to static page
    if (typeof window !== 'undefined') {
      window.location.href = '/emergency-age-verification.html';
    }
    return null;
  }
}