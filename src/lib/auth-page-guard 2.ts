/**
 * Auth Page Guard - Prevents overlay components from blocking sign-in
 * 
 * This utility ensures that overlay components like crisis buttons, modals,
 * PWA installers, and other floating elements are hidden on authentication
 * pages to prevent blocking user sign-in.
 * 
 * EMERGENCY FIX: This was created to resolve critical blocking overlay issues
 * that prevented users from signing in to the application.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Auth page patterns that should block overlays
const AUTH_PAGE_PATTERNS = [
  '/auth',
  '/login',
  '/sign-in',
  '/signin',
  '/auth/login',
  '/auth/signin',
  '/auth/sign-in'
];

/**
 * Hook to detect if current page is an auth page
 * Returns true if overlays should be hidden
 */
export function useAuthPageGuard(): boolean {
  const pathname = usePathname();
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    if (!pathname) {
      setIsAuthPage(false);
      return;
    }

    const authPage = AUTH_PAGE_PATTERNS.some(pattern => 
      pathname.includes(pattern)
    );
    
    setIsAuthPage(authPage);

    // Log for debugging (remove in production)
    if (authPage) {
      console.log('🚨 AUTH PAGE GUARD: Blocking overlays on auth page:', pathname);
    }
  }, [pathname]);

  return isAuthPage;
}

/**
 * Client-side auth page detection (for components that can't use hooks)
 */
export function isAuthPageClient(): boolean {
  if (typeof window === 'undefined') return false;
  
  const pathname = window.location.pathname;
  return AUTH_PAGE_PATTERNS.some(pattern => 
    pathname.includes(pattern)
  );
}

/**
 * Server-side auth page detection
 */
export function isAuthPageServer(pathname: string): boolean {
  if (!pathname) return false;
  
  return AUTH_PAGE_PATTERNS.some(pattern => 
    pathname.includes(pattern)
  );
}

/**
 * HOC to wrap overlay components with auth page guard
 */
export function withAuthPageGuard<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function GuardedComponent(props: P) {
    const isAuthPage = useAuthPageGuard();
    
    // Don't render component on auth pages
    if (isAuthPage) {
      return null;
    }
    
    return React.createElement(Component, props);
  };
}