'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  OAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

type AuthMode = 'signin' | 'signup' | 'reset';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const getErrorMessage = (code: string): string => {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/email-already-in-use': 'An account already exists with this email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
      'auth/operation-not-allowed': 'This sign-in method is not enabled.',
      'auth/popup-closed-by-user': '', // Not an error
      'auth/popup-blocked': 'Popup was blocked. Please allow popups.',
    };
    return messages[code] || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const auth = await getFirebaseAuth();
      
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
      } else if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/en/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/en/dashboard');
      }
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      if (message) setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    setError(null);

    try {
      const auth = await getFirebaseAuth();
      const provider = new OAuthProvider('apple.com');
      provider.addScope('email');
      provider.addScope('name');
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      const message = getErrorMessage(err.code);
      if (message) setError(message);
    } finally {
      setAppleLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setGuestLoading(true);
    setError(null);

    try {
      const auth = await getFirebaseAuth();
      await signInAnonymously(auth);
      router.push('/dashboard');
    } catch (err: any) {
      // Fallback for network errors
      if (err.code === 'auth/network-request-failed' || err.message.includes('network')) {
        // Create temporary guest session
        const tempUser = {
          uid: 'temp_' + Date.now(),
          isAnonymous: true,
          email: null,
          displayName: 'Guest User',
          isTemporary: true
        };
        localStorage.setItem('alchm_temp_user', JSON.stringify(tempUser));
        router.push('/en/dashboard');
      } else {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setGuestLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setResetSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white mb-2">
              {mode === 'signin' && 'Welcome to ALCHM'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
            </h1>
            <p className="text-white/70 text-[15px]">
              {mode === 'signin' && 'Your sanctuary for healing'}
              {mode === 'signup' && 'Begin your healing journey'}
              {mode === 'reset' && 'We\'ll send you a reset link'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-5 py-4 rounded-2xl bg-white/95 
                         text-gray-900 placeholder:text-gray-400 
                         text-[17px] font-normal
                         focus:outline-none focus:ring-2 focus:ring-white/60
                         transition-all"
            />

            {/* Password - hidden in reset mode */}
            {mode !== 'reset' && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full px-5 py-4 rounded-2xl bg-white/95 
                           text-gray-900 placeholder:text-gray-400 
                           text-[17px] font-normal
                           focus:outline-none focus:ring-2 focus:ring-white/60
                           transition-all"
              />
            )}

            {/* Forgot Password Link - only on signin */}
            {mode === 'signin' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-white/60 text-sm hover:text-white/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Success Message (Reset) */}
            {resetSent && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                <p className="text-green-200 text-sm text-center">
                  Check your email for a reset link.
                </p>
              </div>
            )}

            {/* Primary Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5d6b4d] text-white font-semibold py-4 px-6 
                         rounded-2xl shadow-lg hover:bg-[#4a5a3d] 
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Spinner />
                  <span>{mode === 'reset' ? 'Sending...' : 'Entering...'}</span>
                </div>
              ) : (
                <>
                  {mode === 'signin' && 'Enter Your Sanctuary'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'reset' && 'Send Reset Link'}
                </>
              )}
            </button>
          </form>

          {/* Only show social/guest options on signin */}
          {mode === 'signin' && (
            <>
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 text-white/60 rounded-full text-sm">
                    or
                  </span>
                </div>
              </div>

              {/* Apple Sign-In */}
              <button
                onClick={handleAppleSignIn}
                disabled={appleLoading}
                className="w-full bg-black text-white font-semibold py-4 px-6 
                           rounded-2xl shadow-lg hover:bg-gray-900 
                           disabled:opacity-60 disabled:cursor-not-allowed
                           transition-all flex items-center justify-center space-x-3 mb-4"
              >
                {appleLoading ? (
                  <Spinner />
                ) : (
                  <>
                    <AppleIcon className="w-5 h-5" />
                    <span>Continue with Apple</span>
                  </>
                )}
              </button>

              {/* Guest Access - Minimal */}
              <button
                onClick={handleGuestAccess}
                disabled={guestLoading}
                className="w-full text-white/80 font-normal py-3 px-6 
                           hover:text-white hover:bg-white/5 
                           disabled:opacity-60 disabled:cursor-not-allowed
                           transition-all rounded-2xl"
              >
                {guestLoading ? 'Entering...' : 'Continue as Guest'}
              </button>
            </>
          )}

          {/* Mode Switcher */}
          <div className="text-center mt-8">
            {mode === 'signin' && (
              <p className="text-white/60 text-[15px]">
                New to ALCHM?{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-white font-semibold hover:underline"
                >
                  Create account
                </button>
              </p>
            )}

            {mode === 'signup' && (
              <p className="text-white/60 text-[15px]">
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('signin')}
                  className="text-white font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'reset' && (
              <button
                onClick={() => switchMode('signin')}
                className="text-white/60 text-[15px] hover:text-white/90"
              >
                ← Back to sign in
              </button>
            )}
          </div>
        </div>

        {/* Crisis Support - Outside card, subtle but accessible */}
        <div className="text-center mt-8 space-y-4">
          <p className="text-white/50 text-sm">
            Crisis support available 24/7
          </p>
          <div className="flex justify-center space-x-4">
            <a
              href="tel:988"
              className="px-5 py-2.5 rounded-full bg-white/90 text-[#5d6b4d] 
                         font-semibold text-sm flex items-center gap-2
                         hover:bg-white transition-colors shadow-sm"
            >
              <PhoneIcon className="w-4 h-4" />
              Call 988
            </a>
            <a
              href="sms:741741&body=HOME"
              className="px-5 py-2.5 rounded-full bg-white/90 text-[#5d6b4d] 
                         font-semibold text-sm flex items-center gap-2
                         hover:bg-white transition-colors shadow-sm"
            >
              <MessageIcon className="w-4 h-4" />
              Text HOME
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Spinner Component
const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin">
  </div>
);

// Apple Icon
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Phone Icon
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

// Message Icon
const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
  </svg>
);