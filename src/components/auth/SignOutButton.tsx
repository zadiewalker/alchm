"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackLogout } from "@/lib/analytics";

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export function SignOutButton({ children, className = "" }: SignOutButtonProps) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setBusy(true);
    
    try {
      // Track analytics before sign out
      await trackLogout();
      
      // Sign out of Firebase Auth
      await signOut(auth);
      
      // Clear the session cookie
      const response = await fetch("/api/session/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to home page after successful logout
        typeof window !== 'undefined' && window.location.href = "/";
      } else {
        console.error("Failed to clear session:", await response.text());
        // Still redirect even if session clear failed
        typeof window !== 'undefined' && window.location.href = "/";
      }
    } catch (error) {
      console.error("Sign-out error:", error);
      // Redirect anyway to prevent being stuck
      typeof window !== 'undefined' && window.location.href = "/";
    }
    
    setBusy(false);
  }

  const defaultClassName = "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      onClick={handleSignOut}
      disabled={busy}
      className={className || defaultClassName}
    >
      {busy ? "Signing out..." : (children || "Sign Out")}
    </button>
  );
}