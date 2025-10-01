'use client';

/**
 * Auth Page Guard - Hook to detect auth pages
 * Prevents overlays from blocking authentication flows
 */

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useAuthPageGuard(): boolean {
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    // Check if we're on an authentication page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const authPaths = [
        '/auth',
        '/auth/login',
        '/auth/signup',
        '/auth/reset',
        '/auth/verify',
        '/login',
        '/signup',
        '/reset-password'
      ];
      
      const isAuth = authPaths.some(path => currentPath.startsWith(path));
      setIsAuthPage(isAuth);
    }
  }, []);

  return isAuthPage;
}

export function isAuthPage(pathname?: string): boolean {
  const path = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  
  const authPaths = [
    '/auth',
    '/auth/login',
    '/auth/signup', 
    '/auth/reset',
    '/auth/verify',
    '/login',
    '/signup',
    '/reset-password'
  ];
  
  return authPaths.some(authPath => path.startsWith(authPath));
}