'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function StreamlinedAuthPage() {
  const router = useRouter();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showEmailAuth, setShowEmailAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data()?.ageVerified) {
          router.push('/en/dashboard');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Validate age
  const isAgeValid = (year: number): boolean => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return age >= 18;
  };

  // Create user profile
  const createUserProfile = async (userId: string, authMethod: string) => {
    const currentYear = new Date().getFullYear();
    const age = birthYear ? currentYear - birthYear : 0;

    await setDoc(doc(db, 'users', userId), {
      uid: userId,
      createdAt: new Date().toISOString(),
      authMethod,
      ageVerified: age >= 18,
      birthYear: birthYear || null,
      preferences: {
        kheperaArchetype: 'sage',
        traumaInformed: true,
        language: 'en',
        onboardingCompleted: false,
      },
      gamification: {
        graceTokens: { available: 2, weekRefreshDate: null },
        currentStreak: 0,
        badges: [],
      },
    }, { merge: true });
  };

  // Handle Start Healing (Guest Mode)
  const handleStartHealing = () => {
    setShowAgeModal(true);
  };

  // Handle age verification completion
  const handleAgeVerified = async () => {
    if (!birthYear) {
      setError('Please select your birth year');
      return;
    }

    if (!isAgeValid(birthYear)) {
      router.push('/crisis?reason=age');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sign in anonymously (guest mode)
      const result = await signInAnonymously(auth);
      
      // Create user profile
      await createUserProfile(result.user.uid, 'anonymous');

      console.log('✅ Guest sign-in successful');
      
      // Close modal and redirect
      setShowAgeModal(false);
      router.push('/en/dashboard?welcome=true');
    } catch (err: any) {
      console.error('❌ Authentication failed:', err);
      setError(err.message || 'Failed to start session. Please try again.');
      setIsLoading(false);
    }
  };


  // Handle Apple Sign-in
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { signInWithApple } = await import('@/lib/auth/domain-aware-auth');
      const result = await signInWithApple();
      
      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.user) {
        // Age verification might be required based on Apple account
        if (result.requiresAgeVerification) {
          setShowAgeModal(true);
        } else {
          router.push('/en/dashboard?welcome=true');
        }
      }
    } catch (err: any) {
      console.error('❌ Apple sign-in failed:', err);
      setError('Apple Sign-in encountered an issue. Please try again or use guest mode.');
      setIsLoading(false);
    }
  };

  // Handle Email Authentication
  const handleEmailAuth = async () => {
    if (!birthYear) {
      setShowAgeModal(true);
      return;
    }

    if (!isAgeValid(birthYear)) {
      router.push('/crisis?reason=age');
      return;
    }

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let result;
      
      if (isSignUp) {
        // Create new account
        result = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(result.user.uid, 'email');
        console.log('✅ Email sign-up successful');
      } else {
        // Sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Email sign-in successful');
      }
      
      setShowAgeModal(false);
      setShowEmailAuth(false);
      router.push('/en/dashboard?welcome=true');
    } catch (err: any) {
      console.error('❌ Email authentication failed:', err);
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists. Try signing in instead.';
        setIsSignUp(false);
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found. Try creating an account instead.';
        setIsSignUp(true);
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Main Authentication Screen */}
      <div className="min-h-screen bg-gradient-to-br from-[#a4b792]/20 via-white to-[#a4b792]/10 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(164,183,146,0.05)_0%,_transparent_70%)]" />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-lg mx-auto space-y-8">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#a4b792] to-[#93a682] rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-105">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-white">
              <path d="M16 4C9.38 4 4 9.38 4 16C4 22.62 9.38 28 16 28C22.62 28 28 22.62 28 16C28 9.38 22.62 4 16 4ZM16 6C21.54 6 26 10.46 26 16C26 21.54 21.54 26 16 26C10.46 26 6 21.54 6 16C6 10.46 10.46 6 16 6Z" fill="currentColor"/>
              <circle cx="16" cy="14" r="3" fill="currentColor"/>
              <path d="M16 20C18.5 20 20.5 18.5 20.5 16.5C20.5 16.2 20.3 16 20 16C19.7 16 19.5 16.2 19.5 16.5C19.5 18 18 19 16 19C14 19 12.5 18 12.5 16.5C12.5 16.2 12.3 16 12 16C11.7 16 11.5 16.2 11.5 16.5C11.5 18.5 13.5 20 16 20Z" fill="currentColor"/>
            </svg>
          </div>

          {/* Value Proposition - Crystal Clear */}
          <div className="space-y-6">
            <h1 className="text-largeTitle font-breath text-charcoal-800 tracking-tight leading-tight">
              Your Safe Space for Healing
            </h1>
            <div className="space-y-4">
              <p className="text-callout font-ground text-charcoal-700 leading-relaxed tracking-wide">
                Write your thoughts. Process emotions. Heal at your own pace.
              </p>
              <p className="text-footnote font-ground text-charcoal-500 leading-relaxed tracking-wide">
                AI-powered insights • Crisis support always available • Private by design
              </p>
            </div>
          </div>

          {/* PRIMARY ACTION - Jony Ive Button Perfection */}
          <button
            onClick={handleStartHealing}
            disabled={isLoading}
            className="group w-full relative overflow-hidden bg-sage-400 text-white py-6 px-8 rounded-sanctuary font-medium text-subhead shadow-blessing hover:shadow-divine transform transition-all duration-280 ease-luxury active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isLoading 
                ? 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)' 
                : 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)',
              transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1), transform 150ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #8fa37c 0%, #7a8c6a 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(164, 183, 146, 0.25), 0 16px 40px rgba(164, 183, 146, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)';
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(164, 183, 146, 0.15), 0 8px 24px rgba(164, 183, 146, 0.1)';
              }
            }}
          >
            <span className="relative z-10 tracking-wide">
              {isLoading ? 'Creating your space...' : 'Start Writing (Free)'}
            </span>
            {/* Luxury hover overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-280 ease-luxury"></div>
          </button>

          {/* Simple Secondary Option - Single Path */}
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setShowEmailAuth(true);
                setShowAgeModal(true);
              }}
              disabled={isLoading}
              className="group text-footnote font-ground text-charcoal-500 hover:text-sage-400 tracking-wide transition-all duration-280 ease-luxury disabled:opacity-50"
            >
              <span className="relative">
                Want to sync across devices? Create an account
                <div className="absolute bottom-0 left-0 w-0 h-px bg-sage-400 group-hover:w-full transition-all duration-280 ease-luxury"></div>
              </span>
            </button>
          </div>

          {/* Benefits - Clear Value Communication */}
          <div className="text-center space-y-4 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="space-y-2">
                <div className="text-title3 flex justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#a4b792]">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-caption font-ground text-charcoal-600 leading-relaxed">
                  Completely Private
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-title3 flex justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#a4b792]">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-caption font-ground text-charcoal-600 leading-relaxed">
                  AI Insights
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-title3 flex justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#a4b792]">
                    <path d="M20.84 4.61C19.32 3.08 17.16 2.84 15.54 3.84C14.84 4.25 14.12 4.92 12 7.58C9.88 4.92 9.16 4.25 8.46 3.84C6.84 2.84 4.68 3.08 3.16 4.61C0.32 7.45 3.26 12.44 12 21.35C20.74 12.44 23.68 7.45 20.84 4.61Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="text-caption font-ground text-charcoal-600 leading-relaxed">
                  Crisis Support
                </p>
              </div>
            </div>
            <p className="text-caption font-ground text-charcoal-500 mt-4 max-w-md mx-auto leading-relaxed">
              Free forever. No ads. Your data never leaves your device unless you choose to sync.
            </p>
          </div>

          {/* Crisis Support Link - Luxury Compassion */}
          <div className="text-center mt-8">
            <a 
              href="/crisis-support" 
              className="group inline-flex items-center gap-3 text-footnote text-sage-600 hover:text-sage-700 font-medium transition-all duration-280 ease-luxury"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-280 group-hover:scale-110">
                <path d="M20.84 4.61C19.32 3.08 17.16 2.84 15.54 3.84C14.84 4.25 14.12 4.92 12 7.58C9.88 4.92 9.16 4.25 8.46 3.84C6.84 2.84 4.68 3.08 3.16 4.61C0.32 7.45 3.26 12.44 12 21.35C20.74 12.44 23.68 7.45 20.84 4.61Z" fill="currentColor"/>
              </svg>
              <span className="relative tracking-wide">
                Need support? We're here for you
                <div className="absolute bottom-0 left-0 w-0 h-px bg-sage-600 group-hover:w-full transition-all duration-280 ease-luxury"></div>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Age Verification Modal */}
      {showAgeModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            // Close modal if clicking outside
            if (e.target === e.currentTarget) {
              setShowAgeModal(false);
              setShowEmailAuth(false);
              setError(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 space-y-6">
            {/* Modal Header */}
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowAgeModal(false);
                  setShowEmailAuth(false);
                  setError(null);
                }}
                className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
              
              <div className="text-center space-y-4">
                <div className="text-4xl">🌱</div>
                <h2 className="text-2xl font-light text-gray-800">
                  Welcome to Your Sanctuary
                </h2>
                <p className="text-gray-600">
                  To create your healing space, we need to verify you're 18 or older.
                </p>
              </div>
            </div>

            {/* Birth Year Selector */}
            <div className="space-y-4">
              <label className="block text-title3 font-presence text-charcoal-800 tracking-tight">
                What year were you born?
              </label>
            </div>
            <select
              value={birthYear || ''}
              onChange={(e) => {
                setBirthYear(parseInt(e.target.value));
                setError(null);
              }}
              className="w-full p-6 bg-sanctuary-glass backdrop-blur-xl border border-sage-400/30 rounded-embrace text-callout font-ground text-charcoal-800 focus:border-sage-400 focus:ring-4 focus:ring-sage-400/15 focus:bg-white/80 outline-none transition-all duration-280 ease-luxury shadow-breath hover:shadow-gentle"
              style={{
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 16px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px'
              }}
            >
              <option value="" className="text-charcoal-400">Select your birth year...</option>
              {Array.from({ length: 100 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return <option key={year} value={year} className="text-charcoal-800">{year}</option>;
              })}
            </select>

            {/* Account Creation Options - Streamlined */}
            {showEmailAuth && birthYear && (
              <div className="space-y-6 pt-6 border-t border-sage-400/20">
                <div className="text-center">
                  <h3 className="text-title3 font-presence text-charcoal-800 mb-4 tracking-tight">
                    Create Your Account
                  </h3>
                  
                  {/* Apple Sign-in Option */}
                  <button
                    onClick={handleAppleSignIn}
                    disabled={isLoading}
                    className="w-full bg-charcoal-900 text-white py-4 px-6 rounded-embrace font-medium text-footnote shadow-breath hover:shadow-sanctuary transition-all duration-280 ease-luxury active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-4"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="tracking-wide">
                      {isLoading ? 'Connecting...' : 'Continue with Apple'}
                    </span>
                  </button>
                  
                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-sage-400/30"></div>
                    </div>
                    <div className="relative flex justify-center text-footnote">
                      <span className="bg-white px-4 text-charcoal-500 tracking-wide">or use email</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-caption text-sage-400 hover:text-sage-600 font-medium tracking-wide transition-colors duration-280"
                  >
                    {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#a4b792] focus:ring-2 focus:ring-[#a4b792]/20 outline-none transition-all"
                    disabled={isLoading}
                  />
                  
                  <input
                    type="password"
                    placeholder="Password (at least 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#a4b792] focus:ring-2 focus:ring-[#a4b792]/20 outline-none transition-all"
                    disabled={isLoading}
                  />
                  
                  {isSignUp && (
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl text-sm focus:border-[#a4b792] focus:ring-2 focus:ring-[#a4b792]/20 outline-none transition-all"
                      disabled={isLoading}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons - Show appropriate button based on selected method */}
            {!showEmailAuth ? (
              <>
                {/* Guest Mode - Default and ONLY option */}
                <button
                  onClick={handleAgeVerified}
                  disabled={!birthYear || isLoading}
                  className="w-full bg-[#a4b792] text-white py-4 rounded-2xl font-medium hover:bg-[#93a682] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Starting Your Journey...' : 'Enter Sanctuary'}
                </button>
              </>
            ) : (
              <>
                {/* Email Authentication Button - Luxury Style */}
                <button
                  onClick={handleEmailAuth}
                  disabled={!birthYear || !email || !password || (isSignUp && !confirmPassword) || isLoading}
                  className="w-full bg-sage-400 text-white py-5 px-8 rounded-sanctuary font-medium text-callout shadow-blessing hover:shadow-divine transform transition-all duration-280 ease-luxury active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isLoading 
                      ? 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)' 
                      : 'linear-gradient(135deg, #a4b792 0%, #8fa37c 100%)',
                  }}
                >
                  <span className="tracking-wide">
                    {isLoading 
                      ? (isSignUp ? 'Creating sanctuary...' : 'Entering sanctuary...') 
                      : (isSignUp ? 'Create Account' : 'Sign In')
                    }
                  </span>
                </button>

                {/* Back to guest mode - Simple link */}
                <button
                  onClick={() => setShowEmailAuth(false)}
                  disabled={isLoading}
                  className="w-full text-charcoal-500 hover:text-sage-400 py-3 font-medium text-footnote tracking-wide transition-all duration-280 ease-luxury disabled:opacity-50"
                >
                  ← Back to Guest Mode
                </button>
              </>
            )}

            {/* Privacy Note */}
            <p className="text-center text-xs text-gray-500">
              🔒 Your privacy is protected • Stored locally • Never shared
            </p>
          </div>
          </div>
        </div>
      )}
    </>
  );
}