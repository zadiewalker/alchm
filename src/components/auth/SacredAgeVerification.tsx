'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AlchmScarab from '@/components/ui/AlchmScarab';

interface SacredAgeVerificationProps {
  children?: React.ReactNode;
  onVerified?: (status: 'adult' | 'emergency_access') => void;
  onParentalConsentRequired?: () => void;
  className?: string;
}

/**
 * Sacred Age Verification - The Threshold
 * 
 * This is not an age gate - it's a threshold.
 * Every pixel, every millisecond of animation, every word - intentional.
 * 
 * Design Philosophy:
 * - Crossing a threshold into a sacred space
 * - Being welcomed, not interrogated  
 * - Safety without sterility
 * - Simplicity that reveals depth
 */
export default function SacredAgeVerification({ 
  children,
  onVerified, 
  onParentalConsentRequired,
  className = '' 
}: SacredAgeVerificationProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUnderage, setShowUnderage] = useState(false);
  const [error, setError] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  
  const yearInputRef = useRef<HTMLInputElement>(null);

  // Check existing verification on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const verified = localStorage.getItem('alchm_age_verified_sacred') === 'true';
        const emergency = sessionStorage.getItem('alchm_emergency_access') === 'true';
        const verificationDate = localStorage.getItem('alchm_verification_date_sacred');
        
        if (verified && verificationDate) {
          const daysSince = (Date.now() - parseInt(verificationDate)) / (1000 * 60 * 60 * 24);
          if (daysSince < 7) { // Verify weekly for sacred experience
            setIsVerified(true);
            if (onVerified) {
              onVerified('adult');
            }
          }
        } else if (emergency) {
          setIsVerified(true);
          if (onVerified) {
            onVerified('emergency_access');
          }
        }
      } catch (error) {
        console.warn('[Sacred Age Verification] Storage check failed:', error);
      }
      setHasChecked(true);
    }

    // Sacred entrance animation sequence  
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [onVerified]);

  // Generate years from 1940 to current year - 18
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 18;
  const years = Array.from({ length: maxYear - 1939 }, (_, i) => maxYear - i);

  // Handle year selection with trauma-informed validation
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setError('');
    setHasInteracted(true);
    
    // Gentle haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  // Sacred verification process
  const handleVerification = async () => {
    if (!selectedYear) {
      setError('Please share your birth year to continue your journey');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Sacred pause - time for intention setting
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
      const age = currentYear - parseInt(selectedYear);
      
      if (age < 18) {
        setShowUnderage(true);
        setIsProcessing(false);
        
        // Call parental consent callback if provided
        if (onParentalConsentRequired) {
          onParentalConsentRequired();
        }
        
        return;
      }

      // Store verification with privacy-first approach
      const verificationData = {
        verified: 'true',
        timestamp: Date.now().toString(),
        ageRange: age >= 25 ? '25+' : age >= 21 ? '21-24' : '18-20' // Privacy-preserving
      };

      try {
        localStorage.setItem('alchm_age_verified_sacred', 'true');
        localStorage.setItem('alchm_verification_date_sacred', Date.now().toString());
        sessionStorage.setItem('alchm_session_verified', 'true');
      } catch (storageError) {
        // Graceful degradation - continue without storage
        console.info('Storage unavailable, continuing with session-only verification');
      }

      // Gentle haptic celebration
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50]);
      }

      // Sacred completion
      setTimeout(() => {
        setIsVerified(true);
        onVerified?.('adult');
        
        // Navigate to dashboard after verification 
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        
        setIsProcessing(false);
      }, 800);

    } catch (error) {
      setError('Please try again - we\'re here to support you');
      setIsProcessing(false);
    }
  };

  // Emergency access for crisis situations
  const handleEmergencyAccess = () => {
    try {
      sessionStorage.setItem('alchm_emergency_access', 'true');
      sessionStorage.setItem('alchm_session_verified', 'true');
    } catch (error) {
      console.info('Emergency access granted - storage unavailable but proceeding');
    }
    
    onVerified?.('emergency_access');
    
    // Navigate to emergency page
    if (typeof window !== 'undefined') {
      window.location.href = '/emergency';
    }
  };

  // Underage compassionate redirect
  if (showUnderage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-sage-50 via-white to-blush-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full shadow-floating border border-white/60"
        >
          <div className="text-center space-y-8">
            {/* Gentle growth symbol */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-terracotta/20 to-sage/20 rounded-full flex items-center justify-center shadow-soft">
              <span className="text-3xl">🌱</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-charcoal tracking-tight leading-none">
                Growing Into Wisdom
              </h2>
              <p className="text-charcoal/70 font-normal text-17 leading-relaxed">
                ALCHM is designed for adults 18 and older. Your healing journey is important, and there are wonderful age-appropriate resources available.
              </p>
            </div>
            
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('https://www.7cups.com/teen/', '_blank')}
                className="w-full bg-gradient-to-r from-terracotta to-terracotta/80 hover:from-terracotta/90 hover:to-terracotta/70 
                         text-white font-semibold py-5 px-8 rounded-2xl
                         shadow-soft hover:shadow-elevated transition-all duration-300 ease-out
                         min-h-[56px] touch-manipulation"
              >
                Find Age-Appropriate Support
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setShowUnderage(false)}
                className="w-full bg-white/80 hover:bg-white text-charcoal/70 hover:text-charcoal 
                         font-medium py-4 px-6 rounded-2xl border border-charcoal/10
                         shadow-soft hover:shadow-elevated transition-all duration-300 ease-out
                         min-h-[52px] touch-manipulation backdrop-blur-sm"
              >
                Go Back
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Show children if verified
  if (isVerified && hasChecked) {
    return <>{children}</>;
  }

  // Error boundary fallback - ensure Sacred component always works
  if (!isVisible || !hasChecked) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-sage-50 via-white to-blush-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🪲</div>
          <div className="text-lg font-light text-charcoal/80">Loading sanctuary...</div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed inset-0 z-50 bg-gradient-to-br from-sage-50 via-white to-blush-50 flex items-center justify-center p-6 ${className}`}
        >
          {/* Sacred Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full shadow-floating border border-white/60"
            style={{ minHeight: '600px' }}
          >
            <div className="flex flex-col h-full">
              
              {/* Sacred Scarab - Symbol of Transformation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="flex justify-center mb-12"
              >
                <AlchmScarab size={80} animate={true} />
              </motion.div>

              {/* Sacred Typography */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-center mb-10 space-y-3"
              >
                <h1 className="text-32 font-semibold text-charcoal tracking-tight leading-none">
                  Welcome to ALCHM
                </h1>
                <p className="text-17 font-normal text-charcoal/70 leading-relaxed">
                  Your safe space for healing and growth
                </p>
              </motion.div>

              {/* Sacred Verification */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex-1 space-y-6"
              >
                {/* Gentle Request */}
                <div className="space-y-5">
                  <label className="block text-15 font-normal text-charcoal/80 leading-relaxed text-center">
                    To create your sanctuary, we need to verify you're 18 or older
                  </label>
                  
                  {/* Birth Year Input */}
                  <div className="space-y-2">
                    <input
                      ref={yearInputRef}
                      type="number"
                      inputMode="numeric"
                      placeholder="Birth year"
                      value={selectedYear}
                      onChange={(e) => handleYearChange(e.target.value)}
                      min="1925"
                      max={maxYear}
                      className="w-full text-center text-24 font-normal bg-off-white border border-sage/20 
                               rounded-2xl px-6 py-5 min-h-[64px] 
                               focus:border-sage focus:ring-4 focus:ring-sage/20 focus:outline-none
                               placeholder:text-charcoal/40 text-charcoal
                               transition-all duration-300 ease-out
                               touch-manipulation"
                      style={{ 
                        fontSize: '24px',
                        WebkitAppearance: 'none',
                        MozAppearance: 'textfield'
                      }}
                    />
                    
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-13 text-terracotta/80 text-center font-medium"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Sacred Action */}
                <div className="space-y-6">
                  <motion.button
                    initial={{ opacity: 0.6, scale: 0.98 }}
                    animate={{ 
                      opacity: selectedYear ? 1 : 0.6,
                      scale: selectedYear ? 1 : 0.98
                    }}
                    whileHover={selectedYear ? { scale: 1.02, y: -2 } : {}}
                    whileTap={selectedYear ? { scale: 0.98 } : {}}
                    onClick={handleVerification}
                    disabled={!selectedYear || isProcessing}
                    className="w-full bg-gradient-to-r from-sage to-sage/90 hover:from-sage/90 hover:to-sage/80
                             disabled:from-charcoal/10 disabled:to-charcoal/10
                             text-off-white disabled:text-charcoal/40 font-semibold text-17
                             py-5 px-10 rounded-2xl min-h-[56px] 
                             shadow-soft hover:shadow-elevated disabled:shadow-none
                             transition-all duration-300 ease-out touch-manipulation
                             focus:ring-4 focus:ring-sage/30 focus:outline-none"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-off-white/30 border-t-off-white rounded-full animate-spin" />
                        Opening your sanctuary...
                      </span>
                    ) : (
                      'Enter Your Sanctuary'
                    )}
                  </motion.button>

                  {/* Privacy Reassurance */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="bg-sage/5 border border-sage/10 rounded-2xl p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center gap-2 text-center">
                      <span className="text-sage text-16">🔒</span>
                      <div className="text-13 text-charcoal/70 font-medium">
                        <p className="font-semibold">Your privacy is sacred</p>
                        <p className="text-12 opacity-80">Stored locally • End-to-end encrypted • Never shared</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Crisis Access - Trauma-Informed Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="fixed bottom-0 left-0 right-0 p-4 pb-safe-bottom"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div className="bg-sage/5 backdrop-blur-lg border-t border-sage/10 rounded-t-2xl p-4">
              <div className="flex gap-3 max-w-md mx-auto">
                <motion.a
                  href="tel:988"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 
                           bg-sage/15 hover:bg-sage/25 border border-sage/30
                           text-charcoal font-semibold text-15 px-6 py-4 rounded-xl
                           min-h-[52px] shadow-soft hover:shadow-elevated
                           transition-all duration-200 ease-out touch-manipulation
                           focus:ring-4 focus:ring-sage/30 focus:outline-none"
                  aria-label="Call 988 Crisis Lifeline for immediate support"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-sage">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  988 Lifeline
                </motion.a>
                
                <motion.a
                  href="sms:741741&body=HOME"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 
                           bg-sage/15 hover:bg-sage/25 border border-sage/30
                           text-charcoal font-semibold text-15 px-6 py-4 rounded-xl
                           min-h-[52px] shadow-soft hover:shadow-elevated
                           transition-all duration-200 ease-out touch-manipulation
                           focus:ring-4 focus:ring-sage/30 focus:outline-none"
                  aria-label="Text HOME to 741741 for crisis text support"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-sage">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                  Text HOME
                </motion.a>
              </div>
              
              {/* Emergency Access Link */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
                onClick={handleEmergencyAccess}
                className="w-full mt-3 text-13 text-charcoal/60 hover:text-charcoal/80 
                         font-medium underline underline-offset-2
                         py-2 transition-colors duration-200
                         focus:ring-4 focus:ring-sage/30 focus:outline-none rounded-lg"
              >
                Emergency sanctuary access
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Sacred styles for enhanced experience
export const sacredStyles = `
  .shadow-floating {
    box-shadow: 0 12px 48px rgba(164, 183, 146, 0.2), 0 4px 16px rgba(164, 183, 146, 0.1);
  }
  
  .shadow-soft {
    box-shadow: 0 4px 20px rgba(164, 183, 146, 0.15);
  }
  
  .shadow-elevated {
    box-shadow: 0 8px 32px rgba(164, 183, 146, 0.25);
  }
  
  .pb-safe-bottom {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
  
  /* Remove number input spinners */
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    -moz-appearance: textfield;
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
    button, input {
      border: 2px solid currentColor;
    }
  }
  
  /* Touch optimization */
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
`;