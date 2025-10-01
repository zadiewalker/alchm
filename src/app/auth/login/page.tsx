'use client';

// CRISIS-CRITICAL: Emergency auth optimization for immediate access

/**
 * CRISIS-CRITICAL: EMERGENCY LOGIN PAGE - MINIMAL BUNDLE SIZE
 * Ultra-lightweight authentication for crisis situations
 * Bundle target: <500KB - EVERY BYTE MATTERS FOR CRISIS USERS
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// EMERGENCY: Minimal inline styles to avoid CSS bundle bloat
const emergencyStyles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '32px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  input: {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    marginBottom: '16px',
    minHeight: '56px',
  },
  button: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    background: '#16a34a',
    color: 'white',
    cursor: 'pointer',
    minHeight: '56px',
    marginBottom: '12px',
  },
  crisisButton: {
    width: '100%',
    padding: '16px',
    fontSize: '18px',
    border: 'none',
    borderRadius: '8px',
    background: '#dc2626',
    color: 'white',
    cursor: 'pointer',
    minHeight: '56px',
    marginTop: '20px',
  },
};

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
      // Dynamic import only when needed - CRISIS CRITICAL BUNDLE SIZE
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
      // CRISIS CRITICAL: Dynamic imports to prevent massive bundle bloat
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

  // Crisis access - prioritize emergency page
  const handleCrisisAccess = () => {
    router.push('/emergency');
  };

  return (
    <div style={emergencyStyles.container}>
      <div style={emergencyStyles.card}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontSize: '24px', fontWeight: '300', color: 'white', marginBottom: '8px', margin: 0 }}>
            Welcome to ALCHM
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
            Your safe space for healing
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '8px', 
            padding: '12px',
            marginBottom: '16px' 
          }}>
            <p style={{ color: 'rgba(239, 68, 68, 0.9)', fontSize: '14px', textAlign: 'center', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Crisis Support - TOP PRIORITY */}
        <div style={{ 
          padding: '16px 0', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '20px'
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textAlign: 'center', margin: '0 0 12px 0' }}>
            Need immediate support?
          </p>
          
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button
              onClick={() => window.location.href = 'tel:988'}
              style={{
                ...emergencyStyles.crisisButton,
                background: '#dc2626',
                marginTop: 0,
              }}
            >
              📞 Call 988 - Crisis Hotline
            </button>
            
            <button
              onClick={handleCrisisAccess}
              style={{
                ...emergencyStyles.crisisButton,
                background: '#ea580c',
                marginTop: 0,
              }}
            >
              🏠 Emergency Journal Access
            </button>
          </div>
        </div>

        {/* Authentication Form */}
        <div>
          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              ...emergencyStyles.button,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            {loading ? (
              <span>🔄 Connecting...</span>
            ) : (
              <span>🔐 Continue with Google</span>
            )}
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            margin: '16px 0',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
            <span style={{ padding: '0 16px' }}>or use email</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...emergencyStyles.input,
                outline: 'none',
              }}
              placeholder="Email address"
              required
              disabled={loading}
            />
            
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                ...emergencyStyles.input,
                outline: 'none',
              }}
              placeholder="Password"
              required
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              style={emergencyStyles.button}
            >
              {loading ? '🔄 Entering...' : '✨ Enter Your Sacred Space'}
            </button>
          </form>

          {/* Create Account Link */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
              New to ALCHM?{' '}
              <button 
                type="button"
                onClick={() => router.push('/auth/signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#86efac',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '8px 4px',
                  minHeight: '32px',
                }}
              >
                Create account
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}