'use client';

/**
 * CRISIS-CRITICAL: ULTRA-LIGHTWEIGHT LOGIN CLIENT
 * Bundle target: <100KB initial load for crisis users
 * Heavy components loaded only when needed
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const MobileCrisisPerformanceMonitor = dynamic(
  () => import('@/components/mobile/MobileCrisisPerformanceMonitor'),
  { ssr: false }
);

const NetworkResilience = dynamic(
  () => import('@/components/ui/NetworkResilience'),
  { ssr: false }
);

const CrisisFloatingButton = dynamic(
  () => import('@/components/ui/CrisisFloatingButton'),
  { ssr: false }
);

// Ultra-minimal inline styles for critical path
const styles = {
  container: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  header: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '300' as const,
    color: 'white',
    marginBottom: '8px',
    margin: 0,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },
  errorContainer: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '16px',
  },
  errorText: {
    color: 'rgba(239, 68, 68, 0.9)',
    fontSize: '14px',
    textAlign: 'center' as const,
    margin: 0,
  },
  buttonContainer: {
    marginBottom: '16px',
  },
  googleButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    minHeight: '52px',
    textDecoration: 'none',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    padding: '0 16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    fontSize: '16px',
    backdropFilter: 'blur(10px)',
  },
  submitButton: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#16a34a',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    minHeight: '52px',
  },
  createAccountContainer: {
    textAlign: 'center' as const,
    marginTop: '16px',
  },
  createAccountText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  createAccountLink: {
    background: 'none',
    border: 'none',
    color: '#86efac',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px 4px',
    minHeight: '32px',
  },
  crisisContainer: {
    textAlign: 'center' as const,
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    marginTop: '20px',
  },
  crisisButtonsContainer: {
    display: 'flex',
    gap: '12px',
    flexDirection: 'column' as const,
    marginBottom: '12px',
  },
  crisisButton: {
    padding: '12px 20px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    minHeight: '48px',
    textDecoration: 'none',
    display: 'block',
  },
  crisisText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
  },
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  
  const redirectTo = searchParams?.get('redirect') || '/dashboard';

  // Lazy load auth functions only when needed
  const loadAuth = async () => {
    if (authLoaded) return;
    
    try {
      // Dynamic import to keep initial bundle small
      await import('@/lib/auth/domain-aware-auth');
      setAuthLoaded(true);
    } catch (error) {
      console.error('Failed to load auth module:', error);
      setError('Failed to load authentication. Please refresh the page.');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Load auth module if not already loaded
      if (!authLoaded) {
        await loadAuth();
      }
      
      // Dynamic import to avoid bundling Firebase in initial load
      const { signInWithEmail } = await import('@/lib/auth/domain-aware-auth');
      const result = await signInWithEmail(email, password);
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Something gentle went wrong. Take a breath, you\'re safe here.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load auth module if not already loaded
      if (!authLoaded) {
        await loadAuth();
      }

      // Dynamic import to avoid bundling Firebase in initial load
      const { signInWithApple } = await import('@/lib/auth/domain-aware-auth');
      const result = await signInWithApple();

      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        router.push(redirectTo);
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
      <div style={styles.container}>
        <div style={styles.header}>🌿</div>
        <h2 style={styles.title}>Welcome to ALCHM</h2>
        <p style={styles.subtitle}>Your trauma-informed journaling companion</p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
        </div>
      )}

      {/* Apple Sign-in */}
      <div style={styles.buttonContainer}>
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={loading}
          style={styles.googleButton}
        >
          {loading ? '🔄 Connecting...' : '🍎 Continue with Apple'}
        </button>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or continue with email</span>
          <div style={styles.dividerLine}></div>
        </div>
      </div>

      {/* Email Login Form */}
      <form style={styles.form} onSubmit={handleEmailLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          placeholder="Email address"
          required
          disabled={loading}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          placeholder="Password"
          required
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? '🔄 Entering...' : '✨ Enter Your Sacred Space'}
        </button>
      </form>

      {/* Create Account Link */}
      <div style={styles.createAccountContainer}>
        <span style={styles.createAccountText}>
          New to ALCHM?{' '}
          <button 
            type="button"
            onClick={() => router.push('/auth/signup')}
            style={styles.createAccountLink}
          >
            Create account
          </button>
        </span>
      </div>

      {/* Crisis Support */}
      <div style={styles.crisisContainer}>
        <div style={styles.crisisButtonsContainer}>
          <a
            href="tel:988"
            style={styles.crisisButton}
          >
            📞 Call 988
          </a>
          <a
            href="sms:741741&body=HOME"
            style={styles.crisisButton}
          >
            💬 Text HOME
          </a>
        </div>
        <p style={styles.crisisText}>
          Crisis support available 24/7 • We're journaling, not therapy
        </p>
      </div>
    </>
  );
}

export default function LoginClientOptimized() {
  return (
    <>
      {/* Load performance monitoring components only in background */}
      <NetworkResilience />
      <MobileCrisisPerformanceMonitor />
      
      <Suspense fallback={
        <div style={styles.container}>
          <div style={styles.header}>🌿</div>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
      
      {/* Crisis button loads last */}
      <CrisisFloatingButton />
    </>
  );
}