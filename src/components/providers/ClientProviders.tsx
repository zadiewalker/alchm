'use client';

import React, { Suspense, useEffect, useState } from 'react';

// NUCLEAR: Instant crisis support - zero dependencies, inlined styles
const CrisisButton = React.memo(() => {
  const [isVisible, setIsVisible] = React.useState(true);
  
  React.useEffect(() => {
    // Performance mark for monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('crisis-button-rendered');
      performance.measure('crisis-button-load', 'navigationStart', 'crisis-button-rendered');
    }
  }, []);
  
  const handleClick = React.useCallback((e: React.MouseEvent) => {
    // Track crisis button usage for monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('crisis-button-clicked');
    }
    
    // Ensure the call goes through immediately
    e.preventDefault();
    window.location.href = 'tel:988';
  }, []);
  
  if (!isVisible) return null;
  
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

// EMERGENCY: Ultra-optimized provider loading system
const providerCache = new Map<string, any>();
let loadingPromises = new Map<string, Promise<any>>();

const loadProvider = async (name: string) => {
  // Return cached provider immediately
  if (providerCache.has(name)) {
    return providerCache.get(name);
  }
  
  // Return existing loading promise to avoid duplicate loads
  if (loadingPromises.has(name)) {
    return loadingPromises.get(name);
  }
  
  // Create new loading promise
  const loadPromise = (async () => {
    try {
      let module;
      switch (name) {
        case 'auth':
          module = await import(/* webpackChunkName: "auth-provider" */ '@/contexts/AuthContext');
          const provider = module.AuthProvider;
          providerCache.set(name, provider);
          return provider;
        default:
          return null;
      }
    } catch (error) {
      console.warn(`Failed to load provider ${name}:`, error);
      return null;
    } finally {
      loadingPromises.delete(name);
    }
  })();
  
  loadingPromises.set(name, loadPromise);
  return loadPromise;
};

// EMERGENCY: Smart lazy provider with interaction detection
const LazyAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [Provider, setProvider] = useState<any>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  
  useEffect(() => {
    // Detect user interaction intent
    const detectInteraction = () => {
      setShouldLoad(true);
      // Remove listeners after first interaction
      window.removeEventListener('mousedown', detectInteraction, true);
      window.removeEventListener('touchstart', detectInteraction, true);
      window.removeEventListener('keydown', detectInteraction, true);
      window.removeEventListener('scroll', detectInteraction, true);
    };
    
    // Listen for any user interaction
    window.addEventListener('mousedown', detectInteraction, true);
    window.addEventListener('touchstart', detectInteraction, true);
    window.addEventListener('keydown', detectInteraction, true);
    window.addEventListener('scroll', detectInteraction, true);
    
    // Fallback timeout for slow networks
    const fallbackTimer = setTimeout(() => setShouldLoad(true), 2000);
    
    return () => {
      window.removeEventListener('mousedown', detectInteraction, true);
      window.removeEventListener('touchstart', detectInteraction, true);
      window.removeEventListener('keydown', detectInteraction, true);
      window.removeEventListener('scroll', detectInteraction, true);
      clearTimeout(fallbackTimer);
    };
  }, []);
  
  useEffect(() => {
    if (!shouldLoad) return;
    
    let isMounted = true;
    
    const loadAuth = async () => {
      try {
        const AuthComp = await loadProvider('auth');
        if (AuthComp && isMounted) {
          setProvider(() => AuthComp);
        }
      } catch (error) {
        console.warn('Auth provider load failed:', error);
      }
    };
    
    loadAuth();
    
    return () => {
      isMounted = false;
    };
  }, [shouldLoad]);
  
  if (!Provider) {
    return <>{children}</>;
  }
  
  return (
    <Suspense fallback={<>{children}</>}>
      <Provider>{children}</Provider>
    </Suspense>
  );
};

interface ClientProvidersProps {
  children: React.ReactNode;
}

// Lazy load technical support chatbot
const LazySupportChatbot = React.lazy(() => 
  import('@/components/support/TechnicalSupportChatbot').then(module => ({
    default: module.TechnicalSupportChatbot
  }))
);

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [isClient, setIsClient] = useState(false);
  const [criticalLoaded, setCriticalLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Mark critical path as loaded for performance monitoring
    setCriticalLoaded(true);
    
    // Performance mark for monitoring
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark('crisis-providers-loaded');
    }
  }, []);

  // EMERGENCY: Crisis-first rendering with minimal overhead
  return (
    <>
      {/* INSTANT: Crisis support with zero dependencies - renders immediately */}
      <CrisisButton />
      
      {/* PROGRESSIVE: Load auth only when needed */}
      {isClient && criticalLoaded ? (
        <LazyAuthProvider>
          <Suspense fallback={children}>
            {children}
            
            {/* Technical Support Chatbot - Load after everything else */}
            <Suspense fallback={null}>
              <LazySupportChatbot />
            </Suspense>
          </Suspense>
        </LazyAuthProvider>
      ) : (
        children
      )}
    </>
  );
}