'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AgeVerificationProps {
  onVerified?: (ageStatus: 'adult' | 'teen' | 'minor' | 'emergency_access') => void;
  onParentalConsentRequired?: () => void;
  className?: string;
}

// Device detection utilities
const isMobile = () => {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = () => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Crisis emergency access component - Trauma-informed design
const CrisisEmergencyAccess = ({ 
  onEmergencyAccess 
}: { 
  onEmergencyAccess: () => void; 
}) => (
  <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl p-6 mb-8 backdrop-blur-sm">
    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full shadow-soft">
      <div className="w-6 h-6 bg-white/40 rounded-full flex items-center justify-center">
        <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
      </div>
    </div>
    <h3 className="text-amber-800 font-light text-lg mb-3 text-center tracking-wide">Need Support?</h3>
    <p className="text-amber-700/80 text-sm mb-5 text-center font-light leading-relaxed">
      Immediate access to healing resources
    </p>
    <button
      onClick={onEmergencyAccess}
      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-4 px-6 rounded-2xl
                 focus:ring-4 focus:ring-amber-300/50 focus:outline-none transition-all duration-500
                 min-h-[56px] touch-manipulation shadow-soft hover:shadow-elevated hover:-translate-y-0.5
                 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
      aria-label="Access crisis support immediately without age verification"
    >
      Access Support Now
    </button>
  </div>
);

// Compliance-focused year picker with WCAG AA standards
const AccessibleYearPicker = ({ 
  onYearSelect, 
  onClose,
  onCrisisAccess,
  isVisible 
}: { 
  onYearSelect: (year: number) => void;
  onClose: () => void;
  onCrisisAccess: () => void;
  isVisible: boolean;
}) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(25); // Focus on ~1995
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Years from 1940-2010 as specified, focusing on adult range
  const years = Array.from({ length: 71 }, (_, i) => 2010 - i);
  
  // Handle year selection
  const handleYearSelect = useCallback((year: number) => {
    setSelectedYear(year);
    // Brief delay for user feedback, then proceed
    setTimeout(() => onYearSelect(year), 200);
  }, [onYearSelect]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isVisible) return;
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(years.length - 1, prev + 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleYearSelect(years[selectedIndex]);
        break;
    }
  }, [isVisible, selectedIndex, years, handleYearSelect, onClose]);

  // Setup keyboard listeners
  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus the modal for screen readers
      modalRef.current?.focus();
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handleKeyDown]);

  // Update selected year when index changes
  useEffect(() => {
    setSelectedYear(years[selectedIndex]);
  }, [selectedIndex, years]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-[#f8f9f6] via-[#fefcfb] to-[#f5f7f2] backdrop-blur-xl flex items-center justify-center p-6 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="year-picker-title"
      aria-describedby="year-picker-description"
    >
      <div 
        ref={modalRef}
        className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-floating border border-white/40"
        tabIndex={-1}
        style={{
          transform: 'translateY(0)',
          animation: 'gentleAppear 0.6s ease-out forwards'
        }}
      >
        {/* Crisis emergency access */}
        <CrisisEmergencyAccess onEmergencyAccess={onCrisisAccess} />

        {/* Main picker - Jony Ive inspired */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full flex items-center justify-center shadow-elevated">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-4 h-4 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 id="year-picker-title" className="text-3xl font-extralight text-[#2a2d2a] mb-3 text-center tracking-tight">
            Birth Year
          </h2>
          <p id="year-picker-description" className="text-[#93a682] text-sm font-light text-center tracking-wide">
            Privacy-first verification
          </p>
        </div>
        
        {/* Invisible elegance year selection */}
        <div className="mb-8">
          <div 
            className="h-80 overflow-y-auto scrollbar-hide"
            role="listbox"
            aria-label="Select your birth year"
            aria-activedescendant={`year-option-${selectedIndex}`}
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e.nativeEvent)}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            <div className="space-y-2 px-1">
              {years.map((year, index) => {
                const isSelected = index === selectedIndex;
                const age = new Date().getFullYear() - year;
                return (
                  <div
                    key={year}
                    id={`year-option-${index}`}
                    className={`
                      relative w-full p-5 text-lg cursor-pointer touch-manipulation rounded-2xl
                      transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                      min-h-[60px] flex items-center justify-between group
                      focus:outline-none focus:ring-4 focus:ring-[#a4b792]/30
                      ${isSelected 
                        ? 'bg-gradient-to-r from-[#a4b792]/20 to-[#93a682]/20 border-2 border-[#a4b792]/60 text-[#2a2d2a] shadow-soft transform scale-102' 
                        : 'bg-white/60 border border-white/40 text-[#5a6b5a] hover:bg-white/80 hover:border-[#a4b792]/30 hover:transform hover:scale-101 hover:shadow-soft'
                      }
                    `}
                    onClick={() => {
                      setSelectedIndex(index);
                      handleYearSelect(year);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleYearSelect(year);
                      }
                    }}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`Born in ${year}, age ${age}`}
                    tabIndex={isSelected ? 0 : -1}
                  >
                    <span className={`font-light tracking-wide ${isSelected ? 'font-medium' : ''}`}>
                      {year}
                    </span>
                    <span className={`text-sm font-light ${isSelected ? 'text-[#93a682]' : 'text-[#93a682]/60'}`}>
                      Age {age}
                    </span>
                    {isSelected && (
                      <div className="absolute right-4 w-2 h-2 bg-[#a4b792] rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Invisible action design */}
        <div className="space-y-4">
          <button
            onClick={() => selectedYear && handleYearSelect(selectedYear)}
            disabled={!selectedYear}
            className="w-full bg-gradient-to-r from-[#a4b792] to-[#93a682] hover:from-[#93a682] hover:to-[#84966e] 
                     text-white font-medium py-5 px-8 rounded-2xl
                     focus:ring-4 focus:ring-[#a4b792]/30 focus:outline-none
                     min-h-[64px] transition-all duration-500 touch-manipulation shadow-soft
                     disabled:from-[#d6e0cd] disabled:to-[#c8d4bf] disabled:cursor-not-allowed disabled:shadow-none
                     hover:shadow-elevated hover:-translate-y-0.5 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                     text-lg tracking-wide"
            aria-label={selectedYear ? `Continue with birth year ${selectedYear}` : 'Select a birth year to continue'}
          >
            {selectedYear ? `Continue with ${selectedYear}` : 'Select Year'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-white/80 hover:bg-white text-[#93a682] font-medium py-4 px-6 rounded-2xl
                     hover:shadow-soft focus:ring-4 focus:ring-[#a4b792]/20 focus:outline-none
                     min-h-[52px] transition-all duration-300 touch-manipulation backdrop-blur-sm
                     hover:-translate-y-0.5 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] border border-white/60"
            aria-label="Cancel age verification and close"
          >
            Not Right Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AgeVerification({ 
  onVerified, 
  onParentalConsentRequired,
  className = '' 
}: AgeVerificationProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMinorGuidance, setShowMinorGuidance] = useState(false);
  const [ageStatus, setAgeStatus] = useState<'adult' | 'teen' | 'minor' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check existing verification on mount
  useEffect(() => {
    const checkExistingVerification = () => {
      try {
        const sessionVerified = sessionStorage.getItem('alchm_age_session_verified');
        const emergencyAccess = sessionStorage.getItem('alchm_emergency_access');
        const verifiedTimestamp = localStorage.getItem('alchm_age_verified_timestamp');
        const ageCategory = localStorage.getItem('alchm_age_category');
        
        // Priority check for emergency access
        if (emergencyAccess === 'true' && sessionVerified === 'true') {
          setAgeStatus('adult');
          setIsVerified(true);
          onVerified?.('emergency_access');
          return;
        }
        
        const now = Date.now();
        const verificationAge = verifiedTimestamp ? now - parseInt(verifiedTimestamp) : 0;
        const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
        
        if (sessionVerified === 'true' && verificationAge < cacheDuration && ageCategory) {
          const status: 'adult' | 'teen' | 'minor' = 'adult'; // Category already verified as adult
          setAgeStatus(status);
          setIsVerified(true);
          onVerified?.(status);
          return;
        }
      } catch (error) {
        // Graceful fallback - never block access due to technical issues
        console.info('Verification check encountered an issue, showing welcome screen');
      }
      
      // Show welcome if no valid verification
      setShowWelcome(true);
    };

    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      checkExistingVerification();
    }, (error) => {
      console.warn('Auth state check failed, proceeding with local verification:', error);
      checkExistingVerification();
    });

    checkExistingVerification();
    return () => unsubscribe();
  }, [onVerified]);

  // Handle age verification input
  const handleAgeVerification = useCallback((birthYear: number) => {
    setIsProcessing(true);
    setShowYearPicker(false);
    
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;
    
    // Gentle processing delay for trauma-informed experience
    setTimeout(() => {
      try {
        if (age < 18) {
          setAgeStatus('minor');
          setShowMinorGuidance(true);
          onParentalConsentRequired?.();
          setIsProcessing(false);
          return;
        }
        
        // Adult verification (18+) - Store age range only for privacy compliance
        const ageGroup = age >= 25 ? '25+' : age >= 21 ? '21-24' : '18-20';
        setAgeStatus('adult');
        setIsVerified(true);
        
        // Privacy-compliant storage - NO exact birth year
        try {
          sessionStorage.setItem('alchm_age_session_verified', 'true');
          localStorage.setItem('alchm_age_verified_timestamp', Date.now().toString());
          localStorage.setItem('alchm_age_category', ageGroup); // Store age range only
          localStorage.setItem('alchm_age_status', 'adult');
        } catch (storageError) {
          // Graceful degradation - continue without storage
          console.info('Storage unavailable, continuing with session-only verification');
        }
        
        // Gentle completion transition
        setTimeout(() => {
          setShowWelcome(false);
          onVerified?.('adult');
          setIsProcessing(false);
        }, 800);
      } catch (error) {
        // Trauma-informed error handling - never blame the user
        console.info('Verification process encountered an issue, please try again');
        setIsProcessing(false);
        // Reset to welcome screen for retry
        setShowWelcome(true);
      }
    }, 600);
  }, [onVerified, onParentalConsentRequired]);

  // Handle crisis emergency access
  const handleCrisisAccess = useCallback(() => {
    setIsProcessing(true);
    setShowYearPicker(false);
    
    // Immediate priority access for crisis situations - no delays
    setTimeout(() => {
      setAgeStatus('adult');
      setIsVerified(true);
      
      try {
        sessionStorage.setItem('alchm_emergency_access', 'true');
        sessionStorage.setItem('alchm_age_session_verified', 'true');
        sessionStorage.setItem('alchm_crisis_access_timestamp', Date.now().toString());
      } catch (error) {
        // Emergency access continues regardless of storage issues
        console.info('Emergency access granted - storage unavailable but proceeding');
      }
      
      setShowWelcome(false);
      onVerified?.('emergency_access');
      setIsProcessing(false);
    }, 100); // Minimal delay for crisis access
  }, [onVerified]);

  // Don't render if already verified
  if (isVerified || (!showWelcome && !showMinorGuidance)) return null;

  // Minor guidance screen - Compassionate design
  if (showMinorGuidance) {
    return (
      <div className={`fixed inset-0 z-50 bg-gradient-to-br from-[#f8f9f6] via-[#fefcfb] to-[#f5f7f2] flex items-center justify-center p-6 ${className}`}>
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-floating border border-white/40">
          <div className="text-center space-y-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-soft animate-gentle-breathe">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-5 h-5 bg-white/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-extralight text-[#2a2d2a] tracking-tight">
                Your Path Awaits
              </h2>
              <p className="text-[#93a682] font-light text-lg leading-relaxed tracking-wide">
                We honor your journey wherever you are
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.open('https://kidshealth.org/teen/', '_blank')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                         text-white font-medium py-5 px-8 rounded-2xl
                         focus:ring-4 focus:ring-purple-300/50 focus:outline-none transition-all duration-500
                         min-h-[64px] touch-manipulation shadow-soft hover:shadow-elevated hover:-translate-y-0.5
                         ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-lg tracking-wide"
              >
                Find Resources for Your Journey
              </button>
              
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.reload();
                  } catch (error) {
                    window.location.reload();
                  }
                }}
                className="w-full bg-white/80 hover:bg-white text-[#93a682] font-medium py-4 px-6 rounded-2xl
                         focus:ring-4 focus:ring-purple-200/50 focus:outline-none transition-all duration-300
                         min-h-[52px] touch-manipulation backdrop-blur-sm border border-white/60
                         hover:shadow-soft hover:-translate-y-0.5 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                Try Again
              </button>
            </div>
            
            <div className="pt-6 border-t border-[#a4b792]/20">
              <p className="text-[#93a682]/80 text-sm font-light tracking-wide">
                Your privacy is always protected
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main welcome screen - Sanctuary design
  return (
    <>
      <div className={`fixed inset-0 z-50 bg-gradient-to-br from-[#f8f9f6] via-[#fefcfb] to-[#f5f7f2] flex items-center justify-center p-6 ${className}`}>
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-floating border border-white/40">
          <div className="text-center space-y-8">
            {/* Sanctuary icon with breathing animation */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full flex items-center justify-center shadow-elevated animate-gentle-breathe">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-6 h-6 bg-white/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Invisible elegance typography */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extralight text-[#2a2d2a] tracking-tight leading-none">
                Welcome
              </h1>
              <p className="text-[#93a682] font-light text-lg tracking-wide">
                Your sanctuary awaits
              </p>
            </div>
            
            {/* Purposeful action design */}
            <div className="space-y-5">
              <button
                onClick={() => setShowYearPicker(true)}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#a4b792] to-[#93a682] hover:from-[#93a682] hover:to-[#84966e] 
                         text-white font-medium py-5 px-8 rounded-2xl
                         focus:ring-4 focus:ring-[#a4b792]/30 focus:outline-none transition-all duration-500
                         min-h-[64px] touch-manipulation disabled:from-[#d6e0cd] disabled:to-[#c8d4bf] disabled:cursor-not-allowed
                         shadow-soft hover:shadow-elevated hover:-translate-y-0.5 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
                         text-lg tracking-wide"
                aria-label="Select your birth year to verify you are 18 or older"
              >
                {isProcessing ? 'Opening sanctuary...' : 'Begin Journey'}
              </button>
            </div>
            
            {/* Sacred privacy notice */}
            <div className="pt-6 border-t border-[#a4b792]/20">
              <p className="text-[#93a682]/80 text-sm font-light tracking-wide">
                Your privacy is sacred
              </p>
            </div>
            
            {/* Meditative processing overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full animate-gentle-breathe shadow-soft"></div>
                <p className="mt-6 text-[#2a2d2a] font-light text-lg tracking-wide">
                  Preparing your sanctuary...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Year picker overlay */}
      <AccessibleYearPicker
        onYearSelect={handleAgeVerification}
        onClose={() => setShowYearPicker(false)}
        onCrisisAccess={handleCrisisAccess}
        isVisible={showYearPicker}
      />

      <style jsx>{`
        @keyframes gentleAppear {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes gentle-breathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-gentle-breathe {
          animation: gentle-breathe 4s ease-in-out infinite;
        }
        
        .shadow-soft {
          box-shadow: 0 4px 20px rgba(164, 183, 146, 0.15);
        }
        
        .shadow-elevated {
          box-shadow: 0 8px 32px rgba(164, 183, 146, 0.25);
        }
        
        .shadow-floating {
          box-shadow: 0 12px 48px rgba(164, 183, 146, 0.2), 0 4px 16px rgba(164, 183, 146, 0.1);
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scale-101 {
          transform: scale(1.01);
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
        
        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          button {
            border: 2px solid currentColor;
          }
          .border-gray-300 {
            border-color: #000;
          }
        }
        
        /* Touch optimization */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
}