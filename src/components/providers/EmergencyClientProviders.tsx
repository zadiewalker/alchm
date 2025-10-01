'use client';

/**
 * EMERGENCY: ULTRA-MINIMAL CLIENT PROVIDERS
 * For crisis situations - only essential features
 * Bundle target: <50KB total - NO HEAVY COMPONENTS
 */

import React, { useEffect } from 'react';

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

interface EmergencyClientProvidersProps {
  children: React.ReactNode;
}

export default function EmergencyClientProviders({ children }: EmergencyClientProvidersProps) {
  useEffect(() => {
    // Emergency performance marker
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('emergency-providers-loaded');
    }
  }, []);

  // HYDRATION-SAFE: Always render the same structure on server and client
  return (
    <>
      {/* INSTANT: Crisis support renders immediately - SSR compatible */}
      <CrisisButton />
      
      {/* Children render without any heavy providers */}
      {children}
    </>
  );
}