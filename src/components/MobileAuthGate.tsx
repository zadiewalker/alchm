'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';

interface MobileAuthGateProps {
  children: React.ReactNode;
}

export default function MobileAuthGate({ children }: MobileAuthGateProps) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Protected routes that require authentication
  const protectedRoutes = ['/journal', '/journals', '/account', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    
    const setupAuthListener = async () => {
      try {
        const { onAuthStateChanged } = await import('firebase/auth');
        const auth = await getFirebaseAuth();
        
        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user as any);
          setLoading(false);

          // If this is a protected route and user is not authenticated, redirect to login
          if (isProtectedRoute && !user) {
            router.push('/auth');
          }
        });
      } catch (error) {
        console.warn('Firebase Auth initialization failed in MobileAuthGate:', error);
        setLoading(false);
        // If auth fails and this is a protected route, redirect to login
        if (isProtectedRoute) {
          router.push('/auth');
        }
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isProtectedRoute, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #a4b792 0%, #8ea876 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌿</div>
          <p style={{ color: '#2e2e2e', margin: 0 }}>Loading ALCHM...</p>
        </div>
      </div>
    );
  }

  // If protected route and no user, the redirect is handled in useEffect
  if (isProtectedRoute && !user) {
    return null;
  }

  // Render the app
  return <>{children}</>;
}