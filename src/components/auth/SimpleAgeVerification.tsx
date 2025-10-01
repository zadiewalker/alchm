'use client';

import { useState, useEffect } from 'react';

interface SimpleAgeVerificationProps {
  children: React.ReactNode;
}

export default function SimpleAgeVerification({ children }: SimpleAgeVerificationProps) {
  // HYDRATION-SAFE: Start with consistent state on server and client
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(true); // Start with modal visible to prevent hydration mismatch
  const [selectedYear, setSelectedYear] = useState('');
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasCheckedVerification, setHasCheckedVerification] = useState(false);

  useEffect(() => {
    // Only check after component mounts to prevent hydration issues
    checkExistingVerification();
  }, []);

  const checkExistingVerification = () => {
    setHasCheckedVerification(true);
    
    try {
      const verified = localStorage.getItem('alchm_age_verified');
      const verificationDate = localStorage.getItem('alchm_verification_date');
      
      if (verified === 'true' && verificationDate) {
        const daysSince = (Date.now() - parseInt(verificationDate)) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) { // Verify every 30 days
          setIsVerified(true);
          setShowModal(false);
          return;
        }
      }
    } catch (error) {
      console.warn('Age verification check failed:', error);
    }
    
    // Keep modal visible if not verified
    setShowModal(true);
  };

  const handleAgeVerification = () => {
    const year = parseInt(selectedYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (!year || year < 1900 || year > currentYear) {
      setError('Please choose your birth year to continue');
      return;
    }
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (age < 18) {
        // Under 18 - redirect to age-appropriate resources
        window.location.href = 'https://kidshealth.org/teen/';
        return;
      }
      
      // 18+ - grant access
      try {
        localStorage.setItem('alchm_age_verified', 'true');
        localStorage.setItem('alchm_verification_date', Date.now().toString());
        sessionStorage.setItem('alchm_session_verified', 'true');
        
        setIsVerified(true);
        setShowModal(false);
      } catch (error) {
        setError('Unable to save your preference. Please try again.');
        setIsAnimating(false);
      }
    }, 800);
  };

  // HYDRATION-SAFE: Show children if verified and we've checked
  if (isVerified && hasCheckedVerification) {
    return <>{children}</>;
  }

  // HYDRATION-SAFE: Show age verification modal (default state for both server and initial client render)
  if (showModal || !hasCheckedVerification) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#a4b792]/95 to-[#93a682]/95 backdrop-blur-xl flex items-center justify-center p-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-sm w-full p-10 shadow-[0_25px_80px_rgba(164,183,146,0.15)] animate-fade-in border border-white/40">
          <div className="text-center space-y-8">
            {/* Sanctuary Symbol */}
            <div className={`w-24 h-24 mx-auto bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(164,183,146,0.25)] transition-all duration-700 ${isAnimating ? 'animate-pulse scale-110' : ''}`}>
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-6 h-6 bg-white/60 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Gentle Welcome */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extralight text-[#2a2d2a] tracking-tight leading-tight">
                Welcome to Your
              </h1>
              <h2 className="text-2xl font-light text-[#a4b792] tracking-wide -mt-2">
                Healing Sanctuary
              </h2>
              <p className="text-[#6b7568] text-sm font-light leading-relaxed mt-4">
                A safe space designed for adults to explore healing and growth
              </p>
              {error && (
                <p className="text-[#8b5a3c] text-sm bg-orange-50/80 border border-orange-200/50 rounded-2xl px-4 py-3 font-light">
                  Please select your birth year to continue
                </p>
              )}
            </div>
            
            {/* Birth Year Selection */}
            <div className="text-left space-y-4">
              <label htmlFor="birth-year" className="block text-sm font-light text-[#7a8c6a] tracking-wide">
                What year were you born?
              </label>
              <select
                id="birth-year"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setError('');
                }}
                className="w-full bg-white/95 backdrop-blur-sm border-0 rounded-2xl text-[#2a2d2a] px-6 py-4 text-base font-light focus:outline-none focus:bg-white focus:shadow-[0_8px_30px_rgba(164,183,146,0.12)] focus:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] appearance-none cursor-pointer min-h-[56px]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a4b792' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="" className="text-[#93a682] font-light">Choose year...</option>
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year} className="text-[#2a2d2a] font-light">
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleAgeVerification}
              disabled={!selectedYear || isAnimating}
              className="w-full bg-[#a4b792] hover:bg-[#93a682] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl py-4 px-8 font-light text-lg transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_12px_40px_rgba(164,183,146,0.25)] hover:-translate-y-1 min-h-[56px] tracking-wide"
            >
              {isAnimating ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 bg-white/40 rounded-full animate-pulse"></div>
                  <span className="font-light">Creating your sanctuary...</span>
                </div>
              ) : (
                'Enter Your Sanctuary'
              )}
            </button>
            
            {/* Privacy Assurance */}
            <div className="pt-6 border-t border-white/30">
              <p className="text-xs text-[#93a682] font-light leading-relaxed tracking-wide text-center">
                Your privacy is sacred • Stored locally • Never shared
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HYDRATION-SAFE: This should never be reached with new logic
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#a4b792] to-[#93a682] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-6xl mb-4 animate-pulse">🌿</div>
        <div className="text-xl font-light">Loading sanctuary...</div>
        <div className="w-6 h-6 mx-auto mt-4 border-2 border-white/25 border-t-white rounded-full animate-spin"></div>
      </div>
    </div>
  );
}