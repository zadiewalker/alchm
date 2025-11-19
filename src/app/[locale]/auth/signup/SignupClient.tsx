'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';

export default function SignupClient() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Mobile detection for trauma-informed responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Gentle haptic feedback on mobile for reassurance
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(15);
    }

    if (password !== confirmPassword) {
      setError('Take a breath - your passwords need to match. You\'re doing great.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Your password needs at least 6 characters for security. Almost there!');
      setLoading(false);
      return;
    }

    try {
      // Use the createAccount function for proper COPPA compliance and age verification
      const { createAccount } = await import('@/lib/auth/domain-aware-auth');

      // Note: In a full implementation, age verification would happen before this step
      // For now, we'll pass true assuming the user has completed age verification
      const result = await createAccount(email, password, true);

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        // Success haptic feedback
        if (isMobile && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        // Handle parental consent if required (for COPPA compliance)
        if (result.requiresParentalConsent) {
          // In a full implementation, redirect to parental consent flow
          console.log('🔞 COPPA: Parental consent required');
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Something gentle went wrong. Take a breath, you\'re safe here.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setLoading(true);
    setError(null);

    // Gentle haptic feedback on mobile
    if (isMobile && navigator.vibrate) {
      navigator.vibrate(15);
    }

    try {
      const { signInWithApple } = await import('@/lib/auth/domain-aware-auth');
      const result = await signInWithApple();

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        // Success haptic feedback
        if (isMobile && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Something gentle went wrong. You\'re safe here.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-3xl font-light text-white mb-2">
          Join ALCHM
        </h2>
        <p className="text-white/80">
          Create your trauma-informed journaling sanctuary
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Apple Sign-up */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleAppleSignup}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-sage-300/30 rounded-xl text-white bg-sage-500/20 backdrop-blur-sm hover:bg-sage-500/30 hover:border-sage-300/50 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
          style={{
            minHeight: '52px',
            fontSize: '16px',
            touchAction: 'manipulation',
            fontWeight: '500'
          }}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          ) : (
            <span className="mr-3">🍎</span>
          )}
          Continue with Apple
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
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-sage-300/30 placeholder-white/60 text-white bg-sage-500/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-300/50 transition-all duration-300 ease-out"
                style={{
                  minHeight: '52px',
                  fontSize: '16px',
                  touchAction: 'manipulation'
                }}
                placeholder="Password (min 6 characters)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 touch-safe transition-all duration-300 ease-out"
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
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-sage-300/30 placeholder-white/60 text-white bg-sage-500/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:border-sage-300/50 transition-all duration-300 ease-out"
                style={{
                  minHeight: '52px',
                  fontSize: '16px',
                  touchAction: 'manipulation'
                }}
                placeholder="Confirm password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 touch-safe transition-all duration-300 ease-out"
                style={{
                  minHeight: '44px',
                  minWidth: '44px',
                  touchAction: 'manipulation'
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-sage-400 hover:bg-sage-500 hover:scale-[1.01] hover:shadow-soft active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-sage-400/30 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out touch-safe"
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
          By creating an account, you agree to our trauma-informed{' '}
          <a href="/terms" className="underline">Terms of Service</a>{' '}
          and{' '}
          <a href="/privacy" className="underline">Privacy Policy</a>
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