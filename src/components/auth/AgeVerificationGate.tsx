'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import dynamic from 'next/dynamic';

// Lazy load the safe fallback component
const AgeVerificationGateSafe = dynamic(
  () => import('./AgeVerificationGateSafe'),
  { 
    ssr: false,
    loading: () => (
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
          <p>Loading verification...</p>
        </div>
      </div>
    )
  }
);

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
  isAnimating: boolean;
}

function AgeVerificationGateMain({ onVerificationComplete, onExit }: AgeVerificationGateProps) {
  const [state, setState] = useState<AgeVerificationState>({
    step: 'initial',
    birthMonth: '',
    birthYear: '',
    ageGroup: null,
    verificationAttempts: 0,
    startTime: Date.now(),
    isAnimating: false
  });

  // COPPA Compliance: Track verification attempts to prevent gaming
  const MAX_VERIFICATION_ATTEMPTS = 3;
  const MINIMUM_VERIFICATION_TIME = 10000; // 10 seconds minimum

  // Generate year options (current year - 100 to current year)
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
    
    // Conservative age calculation for legal compliance
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const adjustedAge = monthDiff < 0 ? age - 1 : age;

    if (adjustedAge < 13) return 'under13';
    if (adjustedAge < 18) return 'teen';
    return 'adult';
  };

  const handleDateSubmit = () => {
    if (!state.birthMonth || !state.birthYear) return;

    // Anti-gaming protection: Ensure minimum time spent
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
    
    // Log verification for compliance audit trail
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

  // COPPA Compliance: Clear any stored data on component unmount
  useEffect(() => {
    return () => {
      // Clear any temporary verification data
      sessionStorage.removeItem('age_verification_temp');
    };
  }, []);

  if (state.step === 'initial') {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-xl">
        <div className="glass-sanctuary rounded-sanctuary max-w-md w-full p-2xl shadow-temple border border-white/30">
          <div className="text-center space-y-2xl">
            {/* Premium Digital Sanctuary Icon */}
            <div className="w-24 h-24 mx-auto sage-gradient rounded-infinite flex items-center justify-center shadow-sanctuary animate-sacred-breathing">
              <div className="w-12 h-12 bg-white/30 rounded-infinite flex items-center justify-center glass-sanctuary">
                <div className="w-6 h-6 bg-white/60 rounded-infinite animate-gentle-pulse"></div>
              </div>
            </div>
            
            {/* Premium Digital Sanctuary Typography */}
            <div className="space-y-sm">
              <h1 className="text-3xlarge font-breath text-charcoal-800 tracking-tight leading-tight">
                Safe Space
              </h1>
              <p className="text-sage-dark font-presence text-medium leading-relaxed tracking-wide">
                Privacy-first verification
              </p>
            </div>
            
            {/* Premium Sanctuary Actions */}
            <div className="space-y-lg pt-md">
              <button
                onClick={() => setState(prev => ({ ...prev, step: 'birthdate' }))}
                className="w-full bg-sage-primary hover:bg-sage-dark text-white rounded-sanctuary 
                         py-lg px-xl font-ground text-medium transition-all duration-breath 
                         ease-blessing hover:shadow-sanctuary hover:-translate-y-0.5 
                         touch-safe shadow-blessing tracking-wide min-h-touch-emergency"
              >
                Begin Verification
              </button>
              
              <button
                onClick={onExit}
                className="w-full bg-transparent hover:bg-sage-50 text-terracotta-400 rounded-sanctuary 
                         py-md px-lg font-ground border-2 border-terracotta-400 hover:border-terracotta-500
                         transition-all duration-breath ease-blessing hover:shadow-breath 
                         hover:-translate-y-0.5 touch-safe min-h-touch-comfortable"
              >
                Not Right Now
              </button>
            </div>

            {/* Sacred Privacy Notice */}
            <div className="pt-xl border-t border-sage-primary/20">
              <p className="text-small text-sage-dark/80 font-presence leading-relaxed tracking-wide">
                Privacy protected by design
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.step === 'birthdate') {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-xl">
        <div className="glass-sanctuary rounded-sanctuary max-w-md w-full p-2xl shadow-temple border border-white/30">
          <div className="text-center space-y-2xl">
            {/* Premium Digital Sanctuary Icon */}
            <div className="w-24 h-24 mx-auto sage-gradient rounded-infinite flex items-center justify-center shadow-sanctuary animate-sacred-breathing">
              <div className="w-12 h-12 bg-white/30 rounded-infinite flex items-center justify-center glass-sanctuary">
                <div className="w-6 h-6 bg-white/60 rounded-infinite animate-gentle-pulse"></div>
              </div>
            </div>
            
            {/* Premium Digital Sanctuary Typography */}
            <div className="space-y-sm">
              <h1 className="text-3xlarge font-breath text-charcoal-800 tracking-tight leading-tight">
                Birth Date
              </h1>
              <p className="text-sage-dark font-presence text-medium tracking-wide">
                Month and year for privacy
              </p>
            </div>
            
            {/* Premium Sanctuary Form Design */}
            <div className="space-y-xl">
              <div>
                <label htmlFor="birth-month" className="block text-base font-ground text-charcoal-600 mb-md tracking-wide">
                  Birth Month
                </label>
                <select
                  id="birth-month"
                  value={state.birthMonth}
                  onChange={(e) => setState(prev => ({ ...prev, birthMonth: e.target.value }))}
                  className="w-full bg-white/95 glass-sanctuary border-0 rounded-embrace text-charcoal-800 
                           focus:bg-white focus:shadow-sanctuary focus:-translate-y-0.5 transition-all 
                           duration-breath ease-blessing text-medium font-ground px-lg py-lg 
                           appearance-none cursor-pointer touch-safe min-h-touch-crisis shadow-blessing
                           form-input"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="" className="text-sage-dark font-ground">Choose month...</option>
                  {monthOptions.map(month => (
                    <option key={month.value} value={month.value} className="text-charcoal-800 font-ground">{month.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="birth-year" className="block text-base font-ground text-charcoal-600 mb-md tracking-wide">
                  Birth Year
                </label>
                <select
                  id="birth-year"
                  value={state.birthYear}
                  onChange={(e) => setState(prev => ({ ...prev, birthYear: e.target.value }))}
                  className="w-full bg-white/95 glass-sanctuary border-0 rounded-embrace text-charcoal-800 
                           focus:bg-white focus:shadow-sanctuary focus:-translate-y-0.5 transition-all 
                           duration-breath ease-blessing text-medium font-ground px-lg py-lg 
                           appearance-none cursor-pointer touch-safe min-h-touch-crisis shadow-blessing
                           form-input"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em'
                  }}
                >
                  <option value="" className="text-sage-dark font-ground">Choose year...</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year.toString()} className="text-charcoal-800 font-ground">{year}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Premium Sanctuary Actions */}
            <div className="space-y-md pt-lg">
              <button
                onClick={handleDateSubmit}
                disabled={!state.birthMonth || !state.birthYear}
                className="w-full bg-sage-primary hover:bg-sage-dark disabled:bg-sage-lighter/50 
                         disabled:cursor-not-allowed text-white rounded-sanctuary py-lg px-xl 
                         font-ground text-medium transition-all duration-breath ease-blessing 
                         hover:shadow-sanctuary hover:-translate-y-0.5 touch-safe shadow-blessing 
                         tracking-wide min-h-touch-emergency"
              >
                Verify My Age
              </button>
              
              <button
                onClick={onExit}
                className="w-full bg-transparent hover:bg-sage-50 text-terracotta-400 rounded-sanctuary 
                         py-md px-lg font-ground border-2 border-terracotta-400 hover:border-terracotta-500
                         transition-all duration-breath ease-blessing hover:shadow-breath 
                         hover:-translate-y-0.5 touch-safe min-h-touch-comfortable"
              >
                Cancel
              </button>
            </div>
            
            {/* Sacred Privacy Notice */}
            <div className="pt-xl border-t border-sage-primary/20">
              <p className="text-small text-sage-dark/80 font-presence leading-relaxed tracking-wide">
                Information protected locally
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.step === 'under13_notice') {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-xl">
        <div className="glass-sanctuary rounded-sanctuary max-w-sm w-full p-2xl shadow-temple animate-sacred-emergence">
          <div className="text-center space-y-2xl">
            {/* Gentle Warning Icon */}
            <div className="w-20 h-20 mx-auto terracotta-gradient rounded-infinite flex items-center justify-center shadow-sanctuary">
              <div className="w-10 h-10 bg-white/30 rounded-infinite flex items-center justify-center glass-sanctuary">
                <div className="w-3 h-3 bg-white/80 rounded-infinite"></div>
              </div>
            </div>
            
            {/* Premium Digital Sanctuary Message */}
            <div className="space-y-sm">
              <h1 className="text-2xlarge font-breath text-charcoal-800 tracking-tight leading-tight">
                Parental Consent
              </h1>
              <p className="text-sage-dark font-presence text-small leading-relaxed">
                COPPA requires guardian consent for users under 13
              </p>
            </div>
            
            {/* Premium Sanctuary Actions */}
            <div className="space-y-sm pt-lg">
              <button
                onClick={handleVerificationComplete}
                className="w-full bg-warning hover:bg-warning/90 text-white rounded-sanctuary py-lg px-xl 
                         font-ground text-base transition-all duration-breath ease-blessing 
                         hover:shadow-sanctuary hover:-translate-y-0.5 touch-safe min-h-touch-comfortable"
              >
                Continue with Parent
              </button>
              
              <button
                onClick={handleRetry}
                className="w-full bg-transparent hover:bg-sage-50 text-terracotta-400 rounded-sanctuary 
                         py-md px-lg font-ground border-2 border-terracotta-400 hover:border-terracotta-500
                         text-small transition-all duration-breath ease-blessing hover:shadow-breath 
                         hover:-translate-y-0.5 touch-safe min-h-touch-base"
              >
                Re-enter Date
              </button>
              
              <button
                onClick={onExit}
                className="w-full text-sage-dark rounded-sanctuary py-sm px-lg font-presence text-small 
                         transition-all duration-breath ease-blessing hover:bg-white/50 touch-safe 
                         min-h-touch-base"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.step === 'teen_notice') {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-xl">
        <div className="glass-sanctuary rounded-sanctuary max-w-sm w-full p-2xl shadow-temple animate-sacred-emergence">
          <div className="text-center space-y-2xl">
            {/* Enhanced Protection Icon */}
            <div className="w-20 h-20 mx-auto sage-gradient rounded-infinite flex items-center justify-center shadow-sanctuary">
              <div className="w-10 h-10 bg-white/30 rounded-infinite flex items-center justify-center glass-sanctuary">
                <div className="w-5 h-5 bg-white/60 rounded-infinite animate-sacred-breathing"></div>
              </div>
            </div>
            
            {/* Premium Digital Sanctuary Message */}
            <div className="space-y-sm">
              <h1 className="text-2xlarge font-breath text-charcoal-800 tracking-tight leading-tight">
                Enhanced Privacy
              </h1>
              <p className="text-sage-dark font-presence text-small leading-relaxed">
                Teen users receive additional protections
              </p>
            </div>
            
            {/* Premium Sanctuary Actions */}
            <div className="space-y-sm pt-lg">
              <button
                onClick={handleVerificationComplete}
                className="w-full bg-sage-primary hover:bg-sage-dark text-white rounded-sanctuary py-lg px-xl 
                         font-ground text-base transition-all duration-breath ease-blessing 
                         hover:shadow-sanctuary hover:-translate-y-0.5 touch-safe min-h-touch-comfortable"
              >
                Continue with Protection
              </button>
              
              <button
                onClick={handleRetry}
                className="w-full bg-transparent hover:bg-sage-50 text-terracotta-400 rounded-sanctuary 
                         py-md px-lg font-ground border-2 border-terracotta-400 hover:border-terracotta-500
                         text-small transition-all duration-breath ease-blessing hover:shadow-breath 
                         hover:-translate-y-0.5 touch-safe min-h-touch-base"
              >
                Re-enter Date
              </button>
              
              <button
                onClick={onExit}
                className="w-full text-sage-dark rounded-sanctuary py-sm px-lg font-presence text-small 
                         transition-all duration-breath ease-blessing hover:bg-white/50 touch-safe 
                         min-h-touch-base"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (state.step === 'adult_verification') {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-xl">
        <div className="glass-sanctuary rounded-sanctuary max-w-sm w-full p-2xl shadow-temple animate-sacred-emergence">
          <div className="text-center space-y-2xl">
            {/* Success Icon with Gentle Animation */}
            <div className="w-20 h-20 mx-auto sage-gradient rounded-infinite flex items-center justify-center shadow-sanctuary animate-celebration-bloom">
              <div className="w-10 h-10 bg-white/40 rounded-infinite flex items-center justify-center glass-sanctuary">
                <div className="w-2 h-6 bg-white/80 rounded-whisper transform rotate-45 translate-x-0.5"></div>
                <div className="w-2 h-3 bg-white/80 rounded-whisper transform -rotate-45 -translate-x-0.5 -translate-y-1"></div>
              </div>
            </div>
            
            {/* Premium Celebratory Message */}
            <div className="space-y-sm">
              <h1 className="text-2xlarge font-breath text-charcoal-800 tracking-tight leading-tight">
                Verified
              </h1>
              <p className="text-sage-dark font-presence text-small leading-relaxed">
                Adult user • Full access
              </p>
            </div>
            
            {/* Premium Sanctuary Continue */}
            <div className="space-y-sm pt-lg">
              <button
                onClick={handleVerificationComplete}
                className="w-full bg-sage-primary hover:bg-sage-dark text-white rounded-sanctuary py-lg px-xl 
                         font-ground text-base transition-all duration-breath ease-blessing 
                         hover:shadow-sanctuary hover:-translate-y-0.5 touch-safe min-h-touch-comfortable"
              >
                Continue to ALCHM
              </button>
              
              <button
                onClick={handleRetry}
                className="w-full bg-transparent hover:bg-sage-50 text-terracotta-400 rounded-sanctuary 
                         py-md px-lg font-ground border-2 border-terracotta-400 hover:border-terracotta-500
                         text-small transition-all duration-breath ease-blessing hover:shadow-breath 
                         hover:-translate-y-0.5 touch-safe min-h-touch-base"
              >
                Re-enter Date
              </button>
              
              <button
                onClick={onExit}
                className="w-full text-sage-dark rounded-sanctuary py-sm px-lg font-presence text-small 
                         transition-all duration-breath ease-blessing hover:bg-white/50 touch-safe 
                         min-h-touch-base"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function AgeVerificationGate(props: AgeVerificationGateProps) {
  return (
    <ErrorBoundary
      fallback={<AgeVerificationGateSafe {...props} />}
      onError={(error, errorInfo) => {
        console.error('🚨 AgeVerificationGate Error:', error);
        console.error('📊 Error Info:', errorInfo);
        
        // In a real app, you might send this to an error reporting service
        if (typeof window !== 'undefined') {
          // Report to analytics
          console.log('📈 Age verification error logged for debugging');
        }
      }}
    >
      <AgeVerificationGateMain {...props} />
    </ErrorBoundary>
  );
}