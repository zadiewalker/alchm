'use client';

/**
 * EMERGENCY LOGIN PAGE - MINIMAL BUNDLE SIZE
 * Ultra-lightweight authentication for crisis situations
 * Bundle target: <500KB
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmergencyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ultra-minimal email authentication
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Dynamic import only when needed
      const { signInWithEmailAndPassword, getAuth } = await import('firebase/auth');
      const { getFirebaseApp } = await import('@/lib/firebase');
      
      const app = await getFirebaseApp();
      const auth = getAuth(app);
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (result.user) {
        // Create session
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: result.user.uid,
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
            }
          }),
        });
        
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Sign-in failed. Please check your credentials.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ultra-minimal Google authentication
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        { GoogleAuthProvider, signInWithPopup, getAuth },
        { getFirebaseApp }
      ] = await Promise.all([
        import('firebase/auth'),
        import('@/lib/firebase')
      ]);
      
      const app = await getFirebaseApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      const result = await signInWithPopup(auth, provider);
      
      if (result.user) {
        // Create session
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: result.user.uid,
            user: {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName,
            }
          }),
        });
        
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError('Google sign-in failed. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crisis access
  const handleCrisisAccess = () => {
    router.push('/journal?mode=emergency');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
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
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Authentication Form */}
        <div className="space-y-6">
          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center py-4 px-6 border border-white/30 rounded-xl text-white bg-white/10 hover:bg-white/20 disabled:opacity-50 transition-all duration-200"
            style={{ minHeight: '56px', fontSize: '18px' }}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            ) : (
              <span className="mr-3">🔐</span>
            )}
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <div className="flex items-center justify-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-white/60 text-sm">or continue with email</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Email Login Form */}
          <form className="space-y-4" onSubmit={handleEmailLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 border border-white/20 placeholder-white/60 text-white bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Email address"
              required
              disabled={loading}
              style={{ fontSize: '16px', minHeight: '56px' }}
            />
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 border border-white/20 placeholder-white/60 text-white bg-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="Password"
              required
              disabled={loading}
              style={{ fontSize: '16px', minHeight: '56px' }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition-all duration-200"
              style={{ minHeight: '56px' }}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Entering...
                </div>
              ) : (
                'Enter Your Sacred Space'
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center">
            <span className="text-sm text-white/80">
              New to ALCHM?{' '}
              <button 
                type="button"
                onClick={() => router.push('/auth/signup')}
                className="font-medium text-green-200 hover:text-white underline"
                style={{ minHeight: '32px' }}
              >
                Create account
              </button>
            </span>
          </div>

          {/* Crisis Support */}
          <div className="pt-6 border-t border-white/20">
            <div className="space-y-3">
              <p className="text-white/80 text-sm text-center">
                Need immediate support?
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.href = 'tel:988'}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200"
                  style={{ minHeight: '48px', fontSize: '16px' }}
                >
                  📞 Call 988
                </button>
                
                <button
                  onClick={handleCrisisAccess}
                  className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all duration-200"
                  style={{ minHeight: '48px', fontSize: '16px' }}
                >
                  🏠 Emergency Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}