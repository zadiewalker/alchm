'use client';

/**
 * CRITICAL FIX: Redirect to guest-first landing page
 * No OAuth popups - users should start healing immediately
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect all login attempts to the guest-first landing page
export default function LoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Immediate redirect to landing page for guest-first experience
    router.replace('/');
  }, [router]);

  // Show nothing while redirecting
  return null;
}