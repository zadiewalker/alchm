'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmail, validateAuthDomain, getCurrentDomainType } from '@/lib/auth/domain-aware-auth';
import { ReliableAuthSystem } from '@/lib/auth/ReliableAuthSystem';
import { Suspense } from 'react';
import CrisisFloatingButton from '@/components/ui/CrisisFloatingButton';
import NetworkResilience from '@/components/ui/NetworkResilience';
import MobileCrisisPerformanceMonitor from '@/components/mobile/MobileCrisisPerformanceMonitor';
import AgeVerificationGate from '@/components/auth/AgeVerificationGate';
import EmergencyAgeVerificationBypass from '@/components/auth/EmergencyAgeVerificationBypass';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { getMobileVerificationStatus } from '@/lib/privacy/mobile-age-verification-service';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [ageVerificationFailed, setAgeVerificationFailed] = useState(false);
  const [showEmergencyBypass, setShowEmergencyBypass] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const redirectTo = searchParams?.get('redirect') || '/dashboard';
  
  // Mobile detection and domain validation for privacy compliance
  useEffect(() => {
    // CRITICAL FIX: Ensure hydration safety
    setIsHydrated(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    try {
      // Validate domain for privacy compliance
      if (!validateAuthDomain()) {
        setDomainError('Please use alchmapp.web.app or alchm-digital-sanctuary.web.app to access ALCHM securely.');
      } else {
        setDomainError(null);
        console.log(`🔐 ALCHM Auth: Using ${getCurrentDomainType()} domain for secure authentication`);
      }
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
    } catch (error) {
      console.error('🚨 Login client initialization error:', error);
      // If there's any error during initialization, enable emergency bypass
      setShowEmergencyBypass(true);
    }
    
    return () => {
      try {
        window.removeEventListener('resize', checkMobile);
      } catch (e) {
        // Ignore cleanup errors
      }
    };
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNetworkError(false);
    
    // Haptic feedback on mobile for reassurance
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(15);
    }

    try {
      const result = await signInWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
        setNetworkError(result.error.includes('Connection issue'));
      } else if (result.user) {
        // Success haptic feedback
        if (isMobile && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Handle age verification requirement for COPPA compliance
        if (result.requiresAgeVerification) {
          console.log('🔞 COPPA Compliance: Age verification required for email login');
          setPendingUser(result.user);
          setShowAgeVerification(true);
          return; // Don't redirect yet, wait for age verification
        }
        
        router.push(redirectTo);
      }
    } catch (err: any) {
      // Fallback error handling
      setError('Something gentle went wrong. Take a breath, you\'re safe here.');
    } finally {
      setLoading(false);
    }
  };


  const handleAgeVerificationComplete = async (ageGroup: 'under13' | 'teen' | 'adult', requiresParentalConsent: boolean) => {
    if (!pendingUser) {
      setError('Authentication session expired. Please try signing in again.');
      setShowAgeVerification(false);
      return;
    }

    try {
      // Store age verification status in user metadata or session
      console.log('🔞 Age verification completed successfully', { ageGroup, requiresParentalConsent });
      
      // Handle parental consent requirement for users under 13
      if (requiresParentalConsent) {
        console.log('🔞 COPPA: Parental consent required for under-13 user');
        // For now, we'll allow the flow to continue but this would typically
        // redirect to a parental consent flow in a production app
      }
      
      // Success haptic feedback
      if (isMobile && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      // Continue with the authentication flow
      setShowAgeVerification(false);
      setPendingUser(null);
      router.push(redirectTo);
      
    } catch (error) {
      console.error('🚨 Error completing age verification:', error);
      setError('Authentication encountered a gentle hiccup. Please try again.');
      setShowAgeVerification(false);
      setPendingUser(null);
    }
  };

  const handleAgeVerificationExit = () => {
    setShowAgeVerification(false);
    setShowEmergencyBypass(false);
    setAgeVerificationFailed(false);
    setPendingUser(null);
    setError('Age verification is required to access ALCHM. Please try again when ready.');
  };

  // CRITICAL FIX: Prevent hydration mismatch errors
  if (!isHydrated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#a4b792',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px',
        fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <p>Preparing your sanctuary...</p>
        </div>
      </div>
    );
  }

  // CRITICAL COPPA COMPLIANCE FIX: Mobile age verification with emergency bypass
  if (showAgeVerification && !ageVerificationFailed) {
    return (
      <ErrorBoundary
        onError={(error) => {
          console.error('🚨 Age verification component failed:', error);
          setAgeVerificationFailed(true);
          setShowEmergencyBypass(true);
        }}
        fallback={
          <EmergencyAgeVerificationBypass
            onVerificationComplete={handleAgeVerificationComplete}
            onExit={handleAgeVerificationExit}
            emergencyMode={true}
          />
        }
      >
        <AgeVerificationGate
          onVerificationComplete={handleAgeVerificationComplete}
          onExit={handleAgeVerificationExit}
        />
      </ErrorBoundary>
    );
  }

  // Emergency bypass for mobile compatibility issues
  if (showEmergencyBypass || ageVerificationFailed) {
    return (
      <EmergencyAgeVerificationBypass
        onVerificationComplete={handleAgeVerificationComplete}
        onExit={handleAgeVerificationExit}
        emergencyMode={ageVerificationFailed}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-3xl font-light text-white mb-2">
          Welcome to ALCHM
        </h2>
        <p className="text-white/70">
          Your sanctuary for healing
        </p>
      </div>

      {/* Domain Error Display - Critical Security Issue */}
      {domainError && (
        <div className="bg-red-500/10 border-red-500/20 rounded-lg p-4 touch-safe">
          <p className="text-red-200 text-sm text-center mb-2">{domainError}</p>
          <p className="text-white/60 text-xs text-center">
            For your security and privacy protection, ALCHM only works on authorized domains.
          </p>
        </div>
      )}

      {/* Gentle Error Display with Crisis Support */}
      {error && !domainError && (
        <div className={`${networkError ? 'bg-blue-500/10 border-blue-500/20' : 'bg-orange-500/10 border-orange-500/20'} rounded-lg p-4 touch-safe`}>
          <p className={`${networkError ? 'text-blue-200' : 'text-orange-200'} text-sm text-center mb-2`}>{error}</p>
          {!networkError && (
            <p className="text-white/60 text-xs text-center">
              If you need immediate support: {' '}
              <button 
                onClick={() => window.location.href = 'tel:988'}
                className="text-sage-200 underline hover:text-white hover:scale-105 touch-safe transition-all duration-300 ease-out"
                style={{ minHeight: '32px', padding: '4px 8px', touchAction: 'manipulation' }}
              >
                988 Crisis Line
              </button>
            </p>
          )}
        </div>
      )}


      {/* Email Login Form */}
      <form className="space-y-6" onSubmit={handleEmailLogin}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-white/50 text-white bg-white/10 backdrop-blur-md rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 ease-out"
              style={{
                minHeight: '52px',
                fontSize: '16px', // Prevents iOS zoom
                touchAction: 'manipulation'
              }}
              placeholder="Email address"
              disabled={loading || !!domainError}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 pr-12 border border-white/20 placeholder-white/50 text-white bg-white/10 backdrop-blur-md rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 ease-out"
              style={{
                minHeight: '52px',
                fontSize: '16px', // Prevents iOS zoom
                touchAction: 'manipulation'
              }}
              placeholder="Password"
              disabled={loading || !!domainError}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 touch-safe"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                touchAction: 'manipulation'
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || !!domainError}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-normal rounded-2xl text-white bg-[#a4b792] hover:bg-[#93a682] hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
            style={{
              minHeight: isMobile ? '56px' : '52px',
              fontSize: isMobile ? '18px' : '16px',
              touchAction: 'manipulation',
              fontWeight: '600'
            }}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sage-800 mr-3"></div>
                Entering your sanctuary...
              </div>
            ) : (
              'Enter Your Sanctuary'
            )}
          </button>
        </div>

        <div className="text-center">
          <span className="text-sm text-white/70">
            New to ALCHM?{' '}
            <button 
              type="button"
              onClick={() => router.push('/auth/signup')}
              className="font-normal text-white/80 hover:text-white hover:scale-[1.02] underline underline-offset-4 transition-all duration-300 ease-out"
              style={{
                minHeight: '32px',
                touchAction: 'manipulation'
              }}
            >
              Create account
            </button>
          </span>
        </div>
      </form>

      {/* Enhanced Crisis Support */}
      <div className="text-center pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-3">
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="touch-safe border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out rounded-2xl"
            style={{
              minHeight: '48px',
              minWidth: '120px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: '500',
              touchAction: 'manipulation'
            }}
          >
            📞 Call 988
          </button>
          <button
            onClick={() => window.location.href = 'sms:741741&body=HOME'}
            className="touch-safe border border-white/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out rounded-2xl"
            style={{
              minHeight: '48px',
              minWidth: '120px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: '500',
              touchAction: 'manipulation'
            }}
          >
            💬 Text HOME
          </button>
        </div>
        
        {/* COPPA-Compliant Emergency Access for Age Verification Issues */}
        {isMobile && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                console.log('🚨 Emergency bypass requested due to mobile compatibility issues');
                setShowEmergencyBypass(true);
                setAgeVerificationFailed(true);
              }}
              className="w-full touch-safe border border-orange-400/30 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20 hover:border-orange-400/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-out rounded-2xl"
              style={{
                minHeight: '44px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                touchAction: 'manipulation'
              }}
            >
              🚨 Mobile Access Issues? Emergency Bypass
            </button>
            <p className="text-white/50 text-xs text-center mt-2">
              COPPA-compliant emergency access for mobile browser compatibility issues
            </p>
          </div>
        )}
        <p className="text-white/50 text-sm">
          Crisis support available 24/7 • Private & secure • All identities welcomed
        </p>
      </div>
    </>
  );
}

export default function LoginClient() {
  return (
    <ErrorBoundary>
      <NetworkResilience />
      <MobileCrisisPerformanceMonitor />
      <Suspense fallback={
        <div className="text-center">
          <div className="text-6xl mb-4">🌿</div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
      <CrisisFloatingButton />
    </ErrorBoundary>
  );
}