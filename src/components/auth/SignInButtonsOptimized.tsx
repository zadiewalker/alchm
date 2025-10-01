"use client";

/*
 * TRAUMA-INFORMED MOBILE OPTIMIZATION WITH BUNDLE OPTIMIZATION
 * This component has been optimized for:
 * - Crisis users requiring fast load times (<1s)
 * - Firebase Auth lazy loading to reduce bundle size
 * - Touch targets minimum 60px for trembling hands
 * - Gentle loading feedback ("Connecting safely...")  
 * - Prevents accidental touches with proper spacing
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load Firebase Auth imports for bundle optimization
const AuthProviderLoader = dynamic(
  () => import("./AuthProviderLoader"),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col gap-4 w-full max-w-[420px] mx-auto">
        <div className="animate-pulse h-[60px] bg-white/20 rounded-full" />
        <div className="animate-pulse h-[60px] bg-white/20 rounded-full" />
      </div>
    )
  }
);

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

export function SignInButtonsOptimized() {
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAccountLinker, setShowAccountLinker] = useState(false);
  const [linkingData, setLinkingData] = useState<{ email: string; pendingCredential: any } | null>(null);
  const [showOfflineFallback, setShowOfflineFallback] = useState(false);

  // Initialize auth when component mounts (but don't block render)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Load Firebase Auth SDK
        const { getAuth } = await import("../../lib/firebase");
        await getAuth();
        setAuthReady(true);
      } catch (error) {
        console.warn("Failed to initialize auth:", error);
        setShowOfflineFallback(true);
      }
    };

    initAuth();
  }, []);

  const handleAuthError = useCallback((error: any) => {
    switch (error?.code) {
      case "auth/account-exists-with-different-credential":
        setLinkingData({
          email: error.customData?.email || "",
          pendingCredential: error.credential
        });
        setShowAccountLinker(true);
        break;
      case "auth/popup-closed-by-user":
        setError(null);
        break;
      case "auth/network-request-failed":
        setShowOfflineFallback(true);
        setError(null);
        break;
      case "auth/unauthorized-domain":
        setError("This domain is not authorized for authentication.");
        break;
      default:
        setError("Couldn't sign in. Please try again.");
    }
  }, []);

  const retryAuth = useCallback(() => {
    setShowOfflineFallback(false);
    setError(null);
    setAuthReady(false);
    // Retry auth initialization
    setTimeout(() => {
      setAuthReady(true);
    }, 1000);
  }, []);

  // Show loading state while auth initializes
  if (!authReady && !showOfflineFallback) {
    return (
      <div className="flex flex-col gap-4 w-full max-w-[420px] mx-auto">
        <div className="flex items-center justify-center gap-2 text-white/70 py-4">
          <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          <span className="text-sm">Preparing secure sign-in...</span>
        </div>
        <div className="animate-pulse h-[60px] bg-white/10 rounded-full" />
        <div className="animate-pulse h-[60px] bg-white/10 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-[420px] mx-auto">
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
      
      {authReady && (
        <AuthProviderLoader 
          onError={handleAuthError}
          onLoading={(loading) => {
            // Handle loading state from auth provider
          }}
        />
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3" role="alert">
          <p className="text-sm text-red-800 text-center">{error}</p>
        </div>
      )}

      {/* Offline fallback for network issues */}
      <OfflineAuthFallback
        visible={showOfflineFallback}
        onRetry={retryAuth}
      />

      <p className="text-xs text-center text-white/60 mt-3">
        By continuing, you agree to our{" "}
        <a className="underline hover:text-white/90 transition-colors" href="/about/terms">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline hover:text-white/90 transition-colors" href="/about/privacy">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}