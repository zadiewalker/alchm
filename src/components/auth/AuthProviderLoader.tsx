"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// Memoize Safari detection to avoid repeated regex checks
const isSafariOriOS = (() => {
  if (typeof typeof window !== 'undefined' && navigator === "undefined") return false;
  const ua = typeof window !== 'undefined' && navigator.userAgent;
  return (/Safari/.test(ua) && !/Chrome/.test(ua)) || /iPhone|iPad|iPod/.test(ua);
})();

interface AuthProviderLoaderProps {
  onError: (error: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function AuthProviderLoader({ onError, onLoading }: AuthProviderLoaderProps) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  // Optimize auth state handler with useCallback
  const handleAuthUser = useCallback(async (user: any) => {
    if (user) {
      onLoading(true);
      
      try {
        // Lazy load performance monitoring and analytics
        const [{ monitorAuthFlow }, { upsertUser }, { trackLogin, trackSignUp }] = await Promise.all([
          import("../../lib/firebase-performance"),
          import("../../lib/user-bootstrap"),
          import("../../lib/analytics")
        ]);

        const authPerformance = monitorAuthFlow();
        
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
        typeof window !== 'undefined' && localStorage.setItem('alchm_auth_token', idToken);
        typeof window !== 'undefined' && localStorage.setItem('alchm_user', JSON.stringify({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName
        }));
        
        authPerformance.recordComplete();
        
        const redirectUrl = new URLSearchParams(typeof window !== 'undefined' && window.location.search).get("redirect") || "/en/sanctuary";
        typeof window !== 'undefined' && window.location.href = redirectUrl;
      } catch (e) {
        console.error("Session creation error:", e);
        setBusy(false);
        onLoading(false);
        onError(e);
      }
    } else {
      setBusy(false);
      onLoading(false);
    }
  }, [onError, onLoading]);

  const doPopupOrRedirect = useCallback(async (providerType: 'google' | 'apple') => {
    setBusy(true);
    onLoading(true);
    
    try {
      // Load Firebase Auth modules dynamically
      const [
        { getAuth },
        authModule
      ] = await Promise.all([
        import("../../lib/firebase-dynamic"),
        import("firebase/auth")
      ]);

      const auth = await getAuth();
      const { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithRedirect } = authModule;

      // Create provider
      let provider;
      if (providerType === 'google') {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: "select_account",
          hd: "" // Remove domain restriction
        });
        provider.addScope("email");
        provider.addScope("profile");
      } else {
        provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
      }

      // Set up auth state listener
      const { onAuthStateChanged } = await import("firebase/auth");
      const unsubscribe = onAuthStateChanged(auth, handleAuthUser);

      try {
        if (isSafariOriOS) {
          await signInWithRedirect(auth, provider);
        } else {
          await signInWithPopup(auth, provider);
        }
      } finally {
        unsubscribe();
      }
    } catch (e: any) {
      setBusy(false);
      onLoading(false);
      onError(e);
    }
  }, [handleAuthUser, onError, onLoading]);

  const isGoogleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH === "true";
  const isAppleEnabled = process.env.NEXT_PUBLIC_ENABLE_APPLE_AUTH === "true";

  // Apple button component
  const AppleButton = () => (
    <button
      onClick={() => doPopupOrRedirect('apple')}
      disabled={busy}
      className="min-h-[60px] min-w-[120px] px-6 py-4 my-3 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)',
        minHeight: '60px',
        margin: '12px 0'
      }}
      aria-label="Continue with Apple - Optimized for mobile accessibility"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
      </svg>
      {busy ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          <span>Connecting safely...</span>
        </span>
      ) : "Continue with Apple"}
    </button>
  );

  // Google button component
  const GoogleButton = () => (
    <button
      onClick={() => doPopupOrRedirect('google')}
      disabled={busy}
      className="min-h-[60px] min-w-[120px] px-6 py-4 my-3 rounded-full bg-white backdrop-blur-sm text-[var(--ink)] border border-white/30 hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(164, 183, 146, 0.3)',
        minHeight: '60px',
        margin: '12px 0'
      }}
      aria-label="Continue with Google - Optimized for mobile accessibility"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {busy ? (
        <span className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full" />
          <span>Connecting safely...</span>
        </span>
      ) : "Continue with Google"}
    </button>
  );

  return (
    <>
      {/* Show Apple first on iOS/Safari, Google first elsewhere */}
      {isSafariOriOS ? (
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
    </>
  );
}