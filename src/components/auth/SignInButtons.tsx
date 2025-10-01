"use client";

/*
 * TRAUMA-INFORMED MOBILE OPTIMIZATION
 * This component has been optimized for users in emotional distress:
 * - Touch targets minimum 60px for trembling hands
 * - Gentle loading feedback ("Connecting safely...")  
 * - Prevents accidental touches with proper spacing
 * - Touch manipulation optimized for mobile devices
 */

import { getAuth } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  Auth
} from "firebase/auth";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
// Dynamic imports to prevent SSR issues
const monitorAuthFlow = () => ({ recordTokenFetch: () => {}, recordSessionCreation: () => {}, recordComplete: () => {} });

// Lazy load AccountLinker to reduce initial bundle size
const AccountLinker = dynamic(() => import("./AccountLinker").then(mod => ({ default: mod.AccountLinker })), {
  ssr: false,
  loading: () => <div className="animate-pulse h-12 bg-white/20 rounded-full" />
});

// Lazy load OfflineAuthFallback
const OfflineAuthFallback = dynamic(() => import("./OfflineAuthFallback").then(mod => ({ default: mod.OfflineAuthFallback })), {
  ssr: false,
  loading: () => null
});

// Memoize Safari detection to avoid repeated regex checks - only execute in browser
const isSafariOriOS = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (/Safari/.test(ua) && !/Chrome/.test(ua)) || /iPhone|iPad|iPod/.test(ua);
};

export function SignInButtons() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccountLinker, setShowAccountLinker] = useState(false);
  const [linkingData, setLinkingData] = useState<{ email: string; pendingCredential: any } | null>(null);
  const [showOfflineFallback, setShowOfflineFallback] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isInCrisis, setIsInCrisis] = useState(false);
  const router = useRouter();
  
  // Simplified performance state for SSR compatibility
  const [performanceState, setPerformanceState] = useState({
    tier: { name: 'medium' },
    deviceCapabilities: { batteryLevel: 1, isCharging: true, networkType: 'unknown', memoryGB: 4 },
    shouldUseAnimations: true,
    transitionDuration: 200
  });
  
  // Crisis mode state
  const enableCrisisMode = () => {
    setPerformanceState(prev => ({
      ...prev,
      shouldUseAnimations: false,
      tier: { name: 'ultra-low' }
    }));
  };

  // Initialize Firebase Auth on component mount
  useEffect(() => {
    let mounted = true;
    
    getAuth()
      .then((authInstance) => {
        if (mounted) {
          setAuth(authInstance);
        }
      })
      .catch((error) => {
        console.error('Failed to initialize Firebase Auth:', error);
        if (mounted) {
          setError('Authentication service unavailable. Please refresh the page.');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Simplified crisis detection for SSR compatibility
  useEffect(() => {
    // Only run crisis detection in browser
    if (typeof window === 'undefined') return;
    
    const detectCrisisConditions = () => {
      // Simple battery check if available
      if ('getBattery' in navigator) {
        navigator.getBattery?.().then((battery: any) => {
          const criticalBattery = battery.level < 0.15 && !battery.charging;
          if (criticalBattery && !isInCrisis) {
            setIsInCrisis(true);
            enableCrisisMode();
            console.log('[Auth] Crisis mode activated - low battery detected');
          }
        }).catch(() => {
          // Battery API not supported or failed
        });
      }
    };

    detectCrisisConditions();
    
    // Check crisis conditions every 30 seconds during auth
    const crisisCheckInterval = setInterval(detectCrisisConditions, 30000);
    
    return () => clearInterval(crisisCheckInterval);
  }, [isInCrisis]);

  // Optimize auth state handler with useCallback
  const handleAuthUser = useCallback(async (user: any) => {
    if (user) {
      const authPerformance = monitorAuthFlow();
      
      try {
        // Lazy load user bootstrap and analytics
        const [{ upsertUser }, { trackLogin, trackSignUp }] = await Promise.all([
          import("../../lib/user-bootstrap"),
          import("../../lib/analytics")
        ]);
        
        const [userResult, idToken] = await Promise.all([
          upsertUser(user),
          user.getIdToken()
        ]);
        
        authPerformance.recordTokenFetch();
        
        const isNewUser = userResult?.isNew || false;
        const provider = user.providerData[0]?.providerId;
        const providerType = provider === "google.com" ? "google" : 
                            provider === "apple.com" ? "apple" : "email_link";
        
        // Parallel execution of session creation and analytics
        await Promise.all([
          fetch('/api/session/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          }),
          isNewUser ? trackSignUp(providerType as "google" | "apple" | "email_link") 
                    : trackLogin(providerType as "google" | "apple" | "email_link")
        ]);
        
        authPerformance.recordSessionCreation();
        
        // Store auth info and redirect
        localStorage.setItem('alchm_auth_token', idToken);
        localStorage.setItem('alchm_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName
        }));
        
        authPerformance.recordComplete();
        
        // Crisis-safe post-authentication navigation
        const redirectUrl = new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
        
        // Show gentle transition message before navigation
        const transitionMessage = document.createElement('div');
        transitionMessage.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(164, 183, 146, 0.95), rgba(164, 183, 146, 0.98));
            backdrop-filter: blur(20px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="text-align: center; max-width: 320px; padding: 0 20px;">
              <div style="font-size: 32px; margin-bottom: 16px;">🌿</div>
              <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 12px; line-height: 1.4;">
                Welcome to your sanctuary
              </h2>
              <p style="font-size: 14px; opacity: 0.9; line-height: 1.5; margin-bottom: 24px;">
                ${isInCrisis ? 'Crisis support is ready. ' : ''}Taking you to your safe space...
              </p>
              <div style="
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
              "></div>
            </div>
          </div>
          <style>
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        `;
        
        document.body.appendChild(transitionMessage);
        
        // Add a gentle delay to prevent jarring transitions, especially in crisis mode
        const navigationDelay = isInCrisis ? 2000 : 1500;
        
        setTimeout(() => {
          // Preload the destination page for faster loading
          if (redirectUrl.startsWith('/')) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = redirectUrl;
            document.head.appendChild(link);
          }
          
          // Navigate with a smooth transition
          if (typeof window !== 'undefined' && window.history?.pushState) {
            // Use pushState for smoother navigation when possible
            window.history.pushState({}, '', redirectUrl);
            window.location.href = redirectUrl;
          } else {
            window.location.href = redirectUrl;
          }
        }, navigationDelay);
      } catch (e) {
        console.error("Session creation error:", e);
        setBusy(false);
        setError("Authentication failed. Please try again.");
      }
    } else {
      setBusy(false);
    }
  }, []);

  // Handle redirect completions and auth state changes
  useEffect(() => {
    if (!auth) return;

    // Handle redirect result (ignore if no redirect pending)
    getRedirectResult(auth).catch(() => {});

    // Listen for auth state changes with optimized handler
    const unsubscribe = onAuthStateChanged(auth, handleAuthUser);
    return () => unsubscribe();
  }, [auth, handleAuthUser]);

  const retryAuth = useCallback(() => {
    setShowOfflineFallback(false);
    setError(null);
    setBusy(false);
  }, []);

  const doPopupOrRedirect = useCallback(async (provider: GoogleAuthProvider | OAuthProvider) => {
    if (!auth) {
      setError('Authentication service not ready. Please wait a moment and try again.');
      return;
    }

    setBusy(true);
    setError(null);
    
    try {
      if (isSafariOriOS()) {
        await signInWithRedirect(auth, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
    } catch (e: any) {
      setBusy(false);
      
      // Handle specific error cases
      switch (e?.code) {
        case "auth/account-exists-with-different-credential":
          setLinkingData({
            email: e.customData?.email || "",
            pendingCredential: e.credential
          });
          setShowAccountLinker(true);
          break;
        case "auth/popup-closed-by-user":
          setError(null);
          break;
        case "auth/network-request-failed":
          setShowOfflineFallback(true);
          setError(null); // Don't show generic error when showing offline fallback
          break;
        case "auth/unauthorized-domain":
          setError("This domain is not authorized for authentication.");
          break;
        default:
          setError("Couldn't sign in. Please try again.");
      }
    }
  }, [auth]);

  // Memoize provider configurations
  const providers = useMemo(() => {
    const googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
      hd: "" // Remove domain restriction
    });
    googleProvider.addScope("email");
    googleProvider.addScope("profile");

    const appleProvider = new OAuthProvider("apple.com");
    appleProvider.addScope("email");
    appleProvider.addScope("name");

    return { googleProvider, appleProvider };
  }, []);

  const isGoogleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";
  const isAppleEnabled = process.env.NEXT_PUBLIC_ENABLE_APPLE_AUTH === "true";
  
  // Trauma-informed error messaging that provides comfort and clear next steps
  const getTraumaInformedErrorMessage = (errorMessage: string): string => {
    const traumaInformedMessages = {
      'Authentication service unavailable. Please refresh the page.': 
        "Sometimes our connection needs a moment to settle. Take a breath, and we'll try refreshing together when you're ready.",
      'Authentication service not ready. Please wait a moment and try again.':
        "Your sanctuary is still being prepared. It's okay to wait - we're creating a safe space for you.",
      "Couldn't sign in. Please try again.":
        "That didn't work quite right, but that's completely okay. These things happen sometimes. When you feel ready, we can try once more.",
      'This domain is not authorized for authentication.':
        "It looks like there's a technical issue on our end. You're doing everything right - this isn't your fault. Please contact support if this continues.",
      'Unable to reach sign-in servers. You can still browse ALCHM offline.':
        "Your connection is having trouble right now, and that's frustrating. You can still use ALCHM to write privately while we work on reconnecting.",
      'default':
        "Something unexpected happened, but you're safe here. Take your time, breathe, and try again when you feel ready. We're here to support you."
    };
    
    return traumaInformedMessages[errorMessage as keyof typeof traumaInformedMessages] || 
           traumaInformedMessages.default;
  };
  
  // Show loading state if auth is not initialized
  const isAuthLoading = !auth;

  // Enhanced loading states with trauma-informed progress indication
  const [authProgress, setAuthProgress] = useState<'initializing' | 'connecting' | 'securing' | 'completing'>('initializing');
  
  useEffect(() => {
    if (busy) {
      let progressTimer: NodeJS.Timeout;
      
      // Simulate authentic auth progress stages for user reassurance
      const progressStages = [
        { stage: 'connecting' as const, delay: 500 },
        { stage: 'securing' as const, delay: 1200 },
        { stage: 'completing' as const, delay: 2000 }
      ];
      
      progressStages.forEach(({ stage, delay }) => {
        progressTimer = setTimeout(() => {
          setAuthProgress(stage);
        }, delay);
      });
      
      return () => clearTimeout(progressTimer);
    } else {
      setAuthProgress('initializing');
    }
  }, [busy]);

  // Trauma-informed loading messages that provide comfort and security
  const getLoadingMessage = (stage: typeof authProgress) => {
    const messages = {
      initializing: 'Preparing your sanctuary...',
      connecting: 'Creating secure connection...',
      securing: 'Protecting your privacy...',
      completing: 'Almost there...'
    };
    return messages[stage];
  };

  // Performance-optimized button styling based on device capabilities
  const getButtonStyles = (isGoogle = false) => {
    const baseClasses = `min-h-[${isInCrisis ? '64px' : '60px'}] min-w-[120px] px-8 py-4 my-2 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanctuary-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-400`;
    
    const performanceClasses = performanceState.shouldUseAnimations 
      ? `transition-all duration-200 ease-out` 
      : 'transition-none';
    
    const backgroundClasses = isGoogle 
      ? 'bg-sanctuary-white text-sage-600 hover:bg-sanctuary-white/95 hover:shadow-soft border border-sanctuary-white/20'
      : 'bg-sanctuary-white/10 backdrop-blur-sm text-sanctuary-white border border-sanctuary-white/20 hover:bg-sanctuary-white/20 hover:border-sanctuary-white/40';
      
    const crisisClasses = isInCrisis 
      ? 'ring-2 ring-yellow-400/40 shadow-elevated' 
      : 'shadow-subtle';
    
    return `${baseClasses} ${performanceClasses} ${backgroundClasses} ${crisisClasses}`;
  };

  // Apple button component
  const AppleButton = () => (
    <button
      onClick={() => doPopupOrRedirect(providers.appleProvider)}
      disabled={busy || isAuthLoading}
      className={getButtonStyles(false)}
      style={{
        touchAction: 'manipulation', // Prevents double-tap zoom for mobile
        WebkitTapHighlightColor: 'transparent', // Remove default highlight
        minHeight: isInCrisis ? '64px' : '60px', // Extra height in crisis mode
        margin: '8px 0' // Prevents accidental touches
      }}
      aria-label={`Continue with Apple - ${isInCrisis ? 'Crisis-optimized for' : 'Optimized for'} mobile accessibility`}
      aria-busy={busy || isAuthLoading}
      aria-describedby={busy ? "auth-status-apple" : undefined}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
      </svg>
      {isAuthLoading ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite">
          <div className="animate-pulse w-4 h-4 bg-white/60 rounded-full" aria-hidden="true" />
          <span>Preparing sanctuary...</span>
        </span>
      ) : busy ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite" id="auth-status-apple">
          <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" aria-hidden="true" />
          <span>{getLoadingMessage(authProgress)}</span>
        </span>
      ) : "Continue with Apple"}
    </button>
  );

  // Google button component
  const GoogleButton = () => (
    <button
      onClick={() => doPopupOrRedirect(providers.googleProvider)}
      disabled={busy || isAuthLoading}
      className={getButtonStyles(true)}
      style={{
        touchAction: 'manipulation', // Prevents double-tap zoom for mobile
        WebkitTapHighlightColor: 'transparent', // Remove default highlight
        minHeight: isInCrisis ? '64px' : '60px', // Extra height in crisis mode
        margin: '8px 0' // Prevents accidental touches
      }}
      aria-label={`Continue with Google - ${isInCrisis ? 'Crisis-optimized for' : 'Optimized for'} mobile accessibility`}
      aria-busy={busy || isAuthLoading}
      aria-describedby={busy ? "auth-status-google" : undefined}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {isAuthLoading ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite">
          <div className="animate-pulse w-4 h-4 bg-gray-600 rounded-full" aria-hidden="true" />
          <span>Preparing sanctuary...</span>
        </span>
      ) : busy ? (
        <span className="flex items-center gap-2" role="status" aria-live="polite" id="auth-status-google">
          <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full" aria-hidden="true" />
          <span>{getLoadingMessage(authProgress)}</span>
        </span>
      ) : "Continue with Google"}
    </button>
  );

  return (
    <div className="flex flex-col gap-0 w-full max-w-[320px] mx-auto">
      {/* Crisis mode indicator */}
      {isInCrisis && (
        <div className="bg-sanctuary-white/10 backdrop-blur-sm border border-sanctuary-white/20 rounded-xl p-4 text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-sanctuary-white">
            <span className="text-sm" aria-hidden="true">⚡</span>
            <span className="text-sm font-medium">Crisis mode enabled</span>
          </div>
          <p className="text-xs text-sanctuary-white/70 mt-2 leading-relaxed">
            Simplified access to your sanctuary
          </p>
        </div>
      )}

      {/* Authentication progress indicator */}
      {busy && (
        <div className="bg-sanctuary-white/5 backdrop-blur-sm rounded-xl p-6 border border-sanctuary-white/10 mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className={performanceState.shouldUseAnimations ? "animate-spin w-4 h-4 border-2 border-sanctuary-white/30 border-t-sanctuary-white rounded-full" : "w-4 h-4 border-2 border-sanctuary-white/50 rounded-full"} aria-hidden="true" />
            <span className="text-sanctuary-white font-light text-sm">
              {getLoadingMessage(authProgress)}
            </span>
          </div>
          
          {/* Simplified progress indicator */}
          <div className="flex justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${authProgress === 'connecting' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
            <div className={`w-2 h-2 rounded-full ${authProgress === 'securing' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
            <div className={`w-2 h-2 rounded-full ${authProgress === 'completing' ? 'bg-sanctuary-white' : 'bg-sanctuary-white/30'} ${performanceState.shouldUseAnimations ? 'transition-all duration-200' : ''}`} />
          </div>
        </div>
      )}
      
      {showAccountLinker && linkingData && (
        <AccountLinker
          email={linkingData.email}
          pendingCredential={linkingData.pendingCredential}
          onSuccess={() => {
            setShowAccountLinker(false);
            setLinkingData(null);
          }}
          onCancel={() => {
            setShowAccountLinker(false);
            setLinkingData(null);
            setError(null);
          }}
        />
      )}
      
      {/* Show Apple first on iOS/Safari, Google first elsewhere */}
      {isSafariOriOS() ? (
        <>
          {isAppleEnabled && <AppleButton />}
          {isGoogleEnabled && <GoogleButton />}
        </>
      ) : (
        <>
          {isGoogleEnabled && <GoogleButton />}
          {isAppleEnabled && <AppleButton />}
        </>
      )}

      {error && (
        <div 
          className="rounded-xl bg-sanctuary-white/10 backdrop-blur-sm border border-sanctuary-white/20 p-6 text-center shadow-subtle mt-4" 
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-lg" aria-hidden="true">🌿</span>
            <h3 className="text-sm font-medium text-sanctuary-white">Let's try again gently</h3>
          </div>
          <p className="text-sm text-sanctuary-white/80 leading-relaxed mb-4">
            {getTraumaInformedErrorMessage(error)}
          </p>
          <button
            onClick={() => {
              setError(null);
              setBusy(false);
            }}
            className="px-6 py-2 text-sm bg-sanctuary-white/20 text-sanctuary-white rounded-xl hover:bg-sanctuary-white/30 transition-all duration-200 font-medium border border-sanctuary-white/30 hover:border-sanctuary-white/50 focus:outline-none focus:ring-2 focus:ring-sanctuary-white/40"
          >
            I'm ready to try again
          </button>
        </div>
      )}

      {/* Offline fallback for network issues */}
      <OfflineAuthFallback
        visible={showOfflineFallback}
        onRetry={retryAuth}
      />

      <p className="text-xs text-center text-sanctuary-white/50 mt-6 leading-relaxed">
        By continuing, you agree to our{" "}
        <a className="underline hover:text-sanctuary-white/80 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-sanctuary-white/30 rounded px-1" href="/about/terms">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline hover:text-sanctuary-white/80 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-sanctuary-white/30 rounded px-1" href="/about/privacy">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}