'use client';

/**
 * CRISIS-CRITICAL: AUTH-ONLY PROVIDERS
 * Ultra-minimal providers for authentication pages only
 * Bundle target: <200KB - NO HEAVY COMPONENTS
 */

import React, { Suspense, useEffect, useState } from 'react';

// INSTANT: Crisis support with zero dependencies
const CrisisButton = React.memo(() => {
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = 'tel:988';
  }, []);
  
  return (
    <a 
      href="tel:988" 
      className="crisis-support"
      aria-label="Crisis Support - Call 988 Suicide & Crisis Lifeline"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        right: 'max(24px, env(safe-area-inset-right, 24px))',
        zIndex: 1000,
        width: '72px',
        height: '72px',
        background: '#dc2626',
        borderRadius: '50%',
        color: 'white',
        fontSize: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer'
      }}
    >
      📞
    </a>
  );
});

CrisisButton.displayName = 'CrisisButton';

// MINIMAL: Auth provider with NO chatbot
const MinimalAuthProvider = React.lazy(() => 
  import('@/contexts/AuthContext').then(module => ({
    default: module.AuthProvider
  }))
);

interface AuthOnlyProvidersProps {
  children: React.ReactNode;
}

export default function AuthOnlyProviders({ children }: AuthOnlyProvidersProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // CRISIS-FIRST: Only crisis support + minimal auth, NO CHATBOT
  return (
    <>
      {/* INSTANT: Crisis support with zero dependencies */}
      <CrisisButton />
      
      {/* MINIMAL: Auth only when needed, NO HEAVY COMPONENTS */}
      {isClient ? (
        <Suspense fallback={children}>
          <MinimalAuthProvider>
            {children}
          </MinimalAuthProvider>
        </Suspense>
      ) : (
        children
      )}
    </>
  );
}