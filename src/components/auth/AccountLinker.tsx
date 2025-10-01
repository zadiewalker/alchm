"use client";

import { getAuth } from "../../lib/firebase";
import {
  GoogleAuthProvider,
  OAuthProvider,
  linkWithPopup,
  linkWithRedirect,
  fetchSignInMethodsForEmail,
  signInWithPopup,
  signInWithRedirect,
  Auth
} from "firebase/auth";
import { useState, useEffect } from "react";

interface AccountLinkerProps {
  email: string;
  pendingCredential: any;
  onSuccess: () => void;
  onCancel: () => void;
}

function isSafariOriOS() {
  if (typeof typeof window !== 'undefined' && navigator === "undefined") return false;
  const ua = typeof window !== 'undefined' && navigator.userAgent;
  return (/Safari/.test(ua) && !/Chrome/.test(ua)) || /iPhone|iPad|iPod/.test(ua);
}

export function AccountLinker({ email, pendingCredential, onSuccess, onCancel }: AccountLinkerProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

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
        console.error('Failed to initialize Firebase Auth in AccountLinker:', error);
        if (mounted) {
          setError('Authentication service unavailable. Please try again.');
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLinkAccount() {
    if (!auth) {
      setError('Authentication service not ready. Please wait a moment and try again.');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      // Get the sign-in methods for this email
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length === 0) {
        setError("No existing account found for this email.");
        setBusy(false);
        return;
      }

      // Determine which provider to use for sign-in
      let provider: GoogleAuthProvider | OAuthProvider;
      
      if (signInMethods.includes(GoogleAuthProvider.PROVIDER_ID)) {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        provider.addScope("email");
        provider.addScope("profile");
      } else if (signInMethods.includes("apple.com")) {
        provider = new OAuthProvider("apple.com");
        provider.addScope("email");
        provider.addScope("name");
      } else {
        setError("This email is linked to an unsupported sign-in method.");
        setBusy(false);
        return;
      }

      // Sign in with the existing provider first
      let result;
      if (isSafariOriOS()) {
        await signInWithRedirect(auth, provider);
        return; // Redirect will handle the rest
      } else {
        result = await signInWithPopup(auth, provider);
      }

      if (result?.user) {
        // Now link the pending credential to this account
        try {
          await linkWithPopup(result.user, pendingCredential);
          console.log("Account linking successful");
          onSuccess();
        } catch (linkError: any) {
          console.error("Account linking failed:", linkError);
          if (linkError.code === "auth/credential-already-in-use") {
            // This shouldn't happen, but handle gracefully
            setError("This credential is already linked to your account.");
          } else {
            setError("Failed to link accounts. Please try again.");
          }
        }
      }
    } catch (e: any) {
      console.error("Account linking error:", e);
      setError("Failed to link accounts. Please try again.");
    }
    
    setBusy(false);
  }

  return (
    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
      <div className="flex items-start gap-3">
        <div className="text-amber-600 mt-0.5">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">Account Already Exists</h3>
          <p className="text-sm text-amber-800 mb-4">
            An account with <strong>{email}</strong> already exists. 
            To continue, sign in with your existing provider first, then we'll link this new sign-in method.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleLinkAccount}
              disabled={busy || !auth}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!auth ? "Loading..." : busy ? "Linking..." : "Link Accounts"}
            </button>
            <button
              onClick={onCancel}
              disabled={busy}
              className="px-4 py-2 bg-white text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 font-medium text-sm transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}