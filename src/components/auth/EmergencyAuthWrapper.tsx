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
    // Clear corrupted data
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

  // Check existing verification on mount
  useEffect(() => {
    const stored = getStoredVerification();
    if (stored) {
      setVerificationState(stored);
    }
    setLoading(false);
  }, []);

  // CRISIS-CRITICAL: Emergency bypass after timeout
  useEffect(() => {
    if (!requiresAgeVerification) return;
    
    const timer = setTimeout(() => {
      if (!verificationState.isVerified) {
        console.log('⚠️ Emergency: Showing crisis bypass option');
        setShowCrisisBypass(true);
      }
    }, 30000); // Show bypass after 30 seconds
    
    return () => clearTimeout(timer);
  }, [verificationState.isVerified, requiresAgeVerification]);

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
        </div>
      </div>
    );
  }

  // If age verification not required or already completed, show children
  if (!requiresAgeVerification || verificationState.isVerified) {
    return <>{children}</>;
  }

  // Show age verification with crisis bypass option
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
        </div>
      )}
    </div>
  );
}