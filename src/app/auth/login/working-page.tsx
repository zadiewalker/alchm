'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Import authentication functions
import { signInWithEmail, signInWithGoogleMobile, signInWithGoogle, signInWithApple, signInWithAppleMobile } from '@/lib/auth/authFunctions';
import { Suspense } from 'react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createEmergencySession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const redirectTo = searchParams?.get('redirect') || '/dashboard';
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = isMobile 
        ? await signInWithGoogleMobile()
        : await signInWithGoogle();
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = isMobile 
        ? await signInWithAppleMobile()
        : await signInWithApple();
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Apple sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="text-3xl font-light text-white mb-2">
          Welcome to ALCHM
        </h2>
        <p className="text-white/80">
          Your trauma-informed journaling companion
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-200 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Google Sign-in */}
      <div className="space-y-4 mb-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-white/30 rounded-xl text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out"
          style={{ 
            minHeight: isMobile ? '60px' : '52px',
            fontSize: isMobile ? '18px' : '16px',
            touchAction: 'manipulation'
          }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Connecting...
            </>
          ) : (
            <>
              <span className="mr-3">🔐</span>
              Continue with Google
            </>
          )}
        </button>

        {/* Apple Sign-in */}
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={loading}
          className="w-full flex justify-center items-center py-3 px-4 border border-white/30 rounded-xl text-white bg-black/80 backdrop-blur-sm hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out"
          style={{ 
            minHeight: isMobile ? '60px' : '52px',
            fontSize: isMobile ? '18px' : '16px',
            touchAction: 'manipulation'
          }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Connecting...
            </>
          ) : (
            <>
              <span className="mr-3">🍎</span>
              Continue with Apple
            </>
          )}
        </button>

        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-white/20"></div>
          <span className="px-4 text-white/60 text-sm">or continue with email</span>
          <div className="flex-1 border-t border-white/20"></div>
        </div>
      </div>

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
              className="appearance-none relative block w-full px-4 py-3 border border-white/20 placeholder-white/60 text-white bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              style={{
                minHeight: isMobile ? '60px' : '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Email address"
              disabled={loading}
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
              className="appearance-none relative block w-full px-4 py-3 pr-12 border border-white/20 placeholder-white/60 text-white bg-white/10 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              style={{
                minHeight: isMobile ? '60px' : '52px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
              style={{
                minHeight: '44px',
                minWidth: '44px',
                touchAction: 'manipulation'
              }}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-[#a4b792] hover:bg-[#93a682] focus:outline-none focus:ring-2 focus:ring-[#a4b792]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 ease-out"
            style={{
              minHeight: isMobile ? '56px' : '52px',
              fontSize: isMobile ? '18px' : '16px',
              touchAction: 'manipulation'
            }}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Signing in...
              </div>
            ) : (
              'Enter Your Sacred Space'
            )}
          </button>
        </div>

        <div className="text-center">
          <span className="text-sm text-white/80">
            New to ALCHM?{' '}
            <button 
              type="button"
              onClick={() => router.push('/auth/signup')}
              className="font-medium text-[#a4b792] hover:text-white underline underline-offset-4 transition-all duration-300 ease-out"
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

      {/* Crisis Support */}
      <div className="text-center pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-3">
          <button
            onClick={() => window.location.href = 'tel:988'}
            className="border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 rounded-xl"
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
            className="border border-white/30 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 rounded-xl"
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

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #a4b792 0%, #93a682 50%, #7a8c6a 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
      }}
    >
      <div 
        className="max-w-md w-full space-y-8 p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Suspense fallback={
          <div className="text-center">
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}