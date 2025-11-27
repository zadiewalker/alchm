'use client';

/**
 * CRISIS-CRITICAL: ULTRA-LIGHTWEIGHT LOGIN CLIENT
 * Bundle target: <100KB initial load for crisis users
 * Heavy components loaded only when needed
 */

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
// Mock components for missing dependencies - emergency deployment
const AuthPageVitalsTracker = () => null;

// Lazy load heavy components
const MobileCrisisPerformanceMonitor = dynamic(
  () => Promise.resolve(() => null),
  { ssr: false }
);

const NetworkResilience = dynamic(
  () => Promise.resolve(() => null),
  { ssr: false }
);

const CrisisFloatingButton = dynamic(
  () => Promise.resolve(() => null),
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
  appleButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    background: '#000000',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500' as const,
    cursor: 'pointer',
    minHeight: '52px',
    textDecoration: 'none',
    marginBottom: '12px',
    transition: 'all 300ms ease',
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
    transition: 'all 300ms ease',
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
  emergencyAccess: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '20px',
    margin: '20px 0',
    textAlign: 'center' as const,
    display: 'none',
  },
  emergencyAccessVisible: {
    display: 'block',
  },
  emergencyButton: {
    background: 'rgba(239, 68, 68, 0.8)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600' as const,
    cursor: 'pointer',
    margin: '8px',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 300ms ease',
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
  const [authMethod, setAuthMethod] = useState<'apple' | 'email' | undefined>();
  const [authStartTime, setAuthStartTime] = useState<number | null>(null);
  const [showEmergencyAccess, setShowEmergencyAccess] = useState(false);
  
  const redirectTo = searchParams?.get('redirect') || '/dashboard';
  
  // Crisis-safe timeout constants
  const CRISIS_TIMEOUT = 5000; // 5 seconds maximum before emergency access
  const EMERGENCY_ACCESS_DELAY = 3000; // 3 seconds before showing emergency options

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
    setAuthMethod('email');
    
    // Start crisis timeout
    const startTime = Date.now();
    setAuthStartTime(startTime);
    
    // Set emergency access timer
    const emergencyTimer = setTimeout(() => {
      setShowEmergencyAccess(true);
    }, EMERGENCY_ACCESS_DELAY);
    
    // Set crisis timeout
    const crisisTimer = setTimeout(() => {
      if (loading) {
        setError('Authentication is taking longer than expected. Emergency access is available below.');
        setShowEmergencyAccess(true);
      }
    }, CRISIS_TIMEOUT);

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
        clearTimeout(emergencyTimer);
        clearTimeout(crisisTimer);
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Something gentle went wrong. Take a breath, you\'re safe here. Crisis support: Call 988 or text HOME to 741741.');
    } finally {
      clearTimeout(emergencyTimer);
      clearTimeout(crisisTimer);
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    setAuthMethod('guest' as any);
    
    // Start crisis timeout
    const startTime = Date.now();
    setAuthStartTime(startTime);
    
    // Set emergency access timer
    const emergencyTimer = setTimeout(() => {
      setShowEmergencyAccess(true);
    }, EMERGENCY_ACCESS_DELAY);
    
    // Set crisis timeout
    const crisisTimer = setTimeout(() => {
      if (loading) {
        setError('Authentication is taking longer than expected. Emergency access is available below.');
        setShowEmergencyAccess(true);
      }
    }, CRISIS_TIMEOUT);

    try {
      // Load auth module if not already loaded
      if (!authLoaded) {
        await loadAuth();
      }
      
      // Dynamic import to avoid bundling Firebase in initial load
      const { signInAsGuest } = await import('@/lib/auth/domain-aware-auth');
      const result = await signInAsGuest();
      
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        clearTimeout(emergencyTimer);
        clearTimeout(crisisTimer);
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Guest access encountered a gentle issue. You\'re safe here. Crisis support: Call 988 or text HOME to 741741.');
    } finally {
      clearTimeout(emergencyTimer);
      clearTimeout(crisisTimer);
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError(null);
    setAuthMethod('apple');
    
    // Start crisis timeout
    const startTime = Date.now();
    setAuthStartTime(startTime);
    
    // Set emergency access timer
    const emergencyTimer = setTimeout(() => {
      setShowEmergencyAccess(true);
    }, EMERGENCY_ACCESS_DELAY);
    
    // Set crisis timeout
    const crisisTimer = setTimeout(() => {
      if (loading) {
        setError('Authentication is taking longer than expected. Emergency access is available below.');
        setShowEmergencyAccess(true);
      }
    }, CRISIS_TIMEOUT);

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
        clearTimeout(emergencyTimer);
        clearTimeout(crisisTimer);
        router.push(redirectTo);
      }
    } catch (err: any) {
      setError('Something gentle went wrong. You\'re safe here. Crisis support: Call 988 or text HOME to 741741.');
    } finally {
      clearTimeout(emergencyTimer);
      clearTimeout(crisisTimer);
      setLoading(false);
    }
  };


  const handleEmergencyAccess = () => {
    // Redirect to emergency journal access
    router.push('/emergency-journal');
  };

  return (
    <>
      {/* CRISIS-CRITICAL: Performance monitoring for localized authentication */}
      <AuthPageVitalsTracker 
        pageName="localized-login" 
        authMethod={authMethod}
      />
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

      {/* Sign-in Options */}
      <div style={styles.buttonContainer}>
        {/* Apple Sign-in - Primary */}
        <button
          type="button"
          onClick={handleAppleLogin}
          disabled={loading}
          style={styles.appleButton}
        >
          {loading && authMethod === 'apple' ? '🔄 Connecting...' : '🍎 Continue with Apple'}
        </button>

        {/* Guest Access */}
        <button
          type="button"
          onClick={handleGuestLogin}
          disabled={loading}
          style={{
            ...styles.googleButton,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            marginBottom: '12px'
          }}
        >
          {loading && authMethod === 'guest' ? '🔄 Creating private space...' : '🏠 Continue as Guest'}
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

      {/* Emergency Access */}
      {showEmergencyAccess && (
        <div style={{...styles.emergencyAccess, ...styles.emergencyAccessVisible}}>
          <h4 style={{color: '#FCA5A5', margin: '0 0 16px 0'}}>🆘 Emergency Access Available</h4>
          <p style={{color: 'rgba(255, 255, 255, 0.9)', margin: '0 0 16px 0'}}>
            Authentication is taking longer than expected. You can access emergency resources:
          </p>
          <button 
            onClick={handleEmergencyAccess}
            style={styles.emergencyButton}
          >
            📝 Emergency Journal Access
          </button>
          <a
            href="/crisis-access.html"
            style={styles.emergencyButton}
          >
            🆘 Crisis Resources
          </a>
        </div>
      )}

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