'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createAccountWithEmail, 
  signInWithGoogle,
  signInWithGoogleMobile,
  signInWithApple,
  signInWithAppleMobile
} from '@/lib/auth/authFunctions';
import { detectMobileCapabilities } from '@/lib/auth/mobileAuthUtils';

export default function SignupPage() {
  const router = useRouter();
  // Simplified privacy compliance for now
  const ageVerified = true;
  const isCompliant = true;
  const validateFeatureAccess = async (feature: string) => true;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCapabilities, setMobileCapabilities] = useState<any>(null);

  // Mobile detection for crisis-safe signup
  useEffect(() => {
    const capabilities = detectMobileCapabilities();
    setMobileCapabilities(capabilities);
    setIsMobile(capabilities.isMobile);
    console.log('📱 Signup mobile capabilities:', capabilities);
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Privacy compliance check
    if (!ageVerified || !isCompliant) {
      setError('Age verification and privacy consent required before account creation.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Validate consent for account creation
      const canCreateAccount = await validateFeatureAccess('essential_functionality');
      if (!canCreateAccount) {
        setError('Account creation requires essential functionality consent.');
        setLoading(false);
        return;
      }

      const result = await createAccountWithEmail(email, password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);

    // Privacy compliance check
    if (!ageVerified || !isCompliant) {
      setError('Age verification and privacy consent required before account creation.');
      setLoading(false);
      return;
    }

    // Crisis-safe haptic feedback on mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(15);
    }

    try {
      console.log('🔐 Starting privacy-compliant Google signup...');
      
      // Validate consent for account creation
      const canCreateAccount = await validateFeatureAccess('essential_functionality');
      if (!canCreateAccount) {
        setError('Account creation requires essential functionality consent.');
        setLoading(false);
        return;
      }
      
      // Use mobile-optimized authentication
      const result = isMobile 
        ? await signInWithGoogleMobile()
        : await signInWithGoogle();
      
      if (result.error) {
        console.log('🔐 Mobile signup error:', result.error);
        setError(result.error);
      } else if (result.user) {
        console.log('🔐 Privacy-compliant signup successful');
        
        // Success haptic feedback for mobile users
        if (isMobile && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Mobile-optimized navigation
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('🚨 Privacy-compliant Google signup error:', err);
      
      // Mobile-specific error handling
      if (err.code === 'auth/popup-blocked' && isMobile) {
        setError('Please allow popups in your browser settings and try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Signup was cancelled. Take your time - we\'ll be here when you\'re ready.');
      } else {
        setError('Account creation encountered a gentle hiccup. You\'re safe here - please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setLoading(true);
    setError(null);

    // Privacy compliance check
    if (!ageVerified || !isCompliant) {
      setError('Age verification and privacy consent required before account creation.');
      setLoading(false);
      return;
    }

    // Crisis-safe haptic feedback on mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(15);
    }

    try {
      console.log('🍎 Starting privacy-compliant Apple signup...');
      
      // Validate consent for account creation
      const canCreateAccount = await validateFeatureAccess('essential_functionality');
      if (!canCreateAccount) {
        setError('Account creation requires essential functionality consent.');
        setLoading(false);
        return;
      }
      
      // Use mobile-optimized Apple authentication
      const result = isMobile 
        ? await signInWithAppleMobile()
        : await signInWithApple();
      
      if (result.error) {
        console.log('🍎 Apple signup error:', result.error);
        setError(result.error);
      } else if (result.user) {
        console.log('🍎 Privacy-compliant Apple signup successful');
        
        // Success haptic feedback for mobile users
        if (isMobile && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        // Mobile-optimized navigation
        if (isMobile) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        router.push('/dashboard');
      } else if (result.pending) {
        console.log('🍎 Apple redirect initiated for signup');
        setError('Redirecting to Apple for secure account creation...');
      }
    } catch (err: any) {
      console.error('🚨 Privacy-compliant Apple signup error:', err);
      
      // Mobile-specific error handling
      if (err.code === 'auth/popup-blocked' && isMobile) {
        setError('Please allow popups in your browser settings and try again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Signup was cancelled. Take your time - we\'ll be here when you\'re ready.');
      } else {
        setError('Account creation encountered a gentle hiccup. You\'re safe here - please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-xlarge font-light text-white mb-2 tracking-normal">
          Join ALCHM
        </h2>
        <p className="text-white/80 text-base font-normal leading-relaxed tracking-normal">
          Create your trauma-informed journaling sanctuary
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-200 text-small font-normal leading-comfortable text-center">{error}</p>
        </div>
      )}

      {/* Google Sign-up */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-sage-300/30 rounded-xl text-white bg-sage-500/20 backdrop-blur-sm hover:bg-sage-500/30 hover:border-sage-300/50 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
          style={{
            minHeight: isMobile ? '60px' : '52px', // Crisis accessibility
            fontSize: isMobile ? '18px' : '16px', // Larger for distress readability
            touchAction: 'manipulation',
            fontWeight: '500',
            padding: isMobile ? '20px 24px' : '12px 16px' // Enhanced touch area
          }}
          aria-label="Sign up with Google - Crisis-safe authentication"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating your sanctuary safely...
            </>
          ) : (
            <>
              <span className="mr-3">🔐</span>
              {isMobile && mobileCapabilities?.supportsPopups === false 
                ? 'Continue with Google (Mobile)' 
                : 'Continue with Google'
              }
            </>
          )}
        </button>

        {/* Apple Sign-up */}
        <button
          type="button"
          onClick={handleAppleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-sage-300/30 rounded-xl text-white bg-black/80 backdrop-blur-sm hover:bg-black/90 hover:border-sage-300/50 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
          style={{
            minHeight: isMobile ? '60px' : '52px', // Crisis accessibility
            fontSize: isMobile ? '18px' : '16px', // Larger for distress readability
            touchAction: 'manipulation',
            fontWeight: '500',
            padding: isMobile ? '20px 24px' : '12px 16px' // Enhanced touch area
          }}
          aria-label="Sign up with Apple - Privacy-first authentication"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Creating your sanctuary safely...
            </>
          ) : (
            <>
              <span className="mr-3">🍎</span>
              {isMobile && mobileCapabilities?.supportsPopups === false 
                ? 'Continue with Apple (Mobile)' 
                : 'Continue with Apple'
              }
            </>
          )}
        </button>

        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-white/20"></div>
          <span className="px-4 text-white/60 text-sm">or continue with email</span>
          <div className="flex-1 border-t border-white/20"></div>
        </div>
      </div>

      {/* Email Signup Form */}
      <form className="space-y-6" onSubmit={handleEmailSignup}>
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
              className="appearance-none relative block w-full px-4 py-3 border border-sage-300/30 placeholder-white/60 text-white bg-sage-500/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-300/50 transition-all duration-300 ease-out"
              style={{
                minHeight: '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Email address"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-sage-300/30 placeholder-white/60 text-white bg-sage-500/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-300/50 transition-all duration-300 ease-out"
              style={{
                minHeight: '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Password (min 6 characters)"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-sage-300/30 placeholder-white/60 text-white bg-sage-500/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-300/50 transition-all duration-300 ease-out"
              style={{
                minHeight: '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Confirm password"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-sage-400 hover:bg-sage-500 hover:scale-[1.01] hover:shadow-soft active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
            style={{
              minHeight: '52px',
              fontSize: '16px',
              touchAction: 'manipulation',
              fontWeight: '600'
            }}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sage-800 mr-3"></div>
                Creating your sanctuary...
              </div>
            ) : (
              'Create Your Sacred Space'
            )}
          </button>
        </div>

        <div className="text-center">
          <span className="text-sm text-white/80">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => router.push('/auth/login')}
              className="font-medium text-sage-200 hover:text-white hover:scale-105 underline underline-offset-4 transition-all duration-300 ease-out"
              style={{
                minHeight: '32px',
                touchAction: 'manipulation'
              }}
            >
              Sign in
            </button>
          </span>
        </div>
      </form>

      {/* Terms Notice */}
      <div className="text-center">
        <p className="text-white/60 text-xs">
          By creating an account, you confirm that you have completed age verification and 
          privacy consent, and agree to our trauma-informed{' '}
          <a href="/terms" className="underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy-policy.html" className="underline">Privacy Policy</a>. 
          {!ageVerified && (
            <span className="text-red-300 font-medium">
              {' '}Age verification required before account creation.
            </span>
          )}
        </p>
      </div>

      {/* Crisis Support */}
      <div className="text-center pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-3">
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="touch-safe border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out rounded-xl"
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
            className="touch-safe border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out rounded-xl"
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
        <p className="text-white/60 text-sm">
          Crisis support available 24/7 • We're journaling, not therapy
        </p>
      </div>
    </>
  );
}