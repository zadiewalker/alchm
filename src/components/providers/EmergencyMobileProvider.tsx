'use client';

/**
 * CRISIS-CRITICAL: EMERGENCY MOBILE PROVIDER
 * Ultra-minimal mobile optimizations for crisis situations
 * Bundle target: <15KB total
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

interface EmergencyMobileState {
  isMobile: boolean;
  crisisMode: boolean;
  setCrisisMode: (enabled: boolean) => void;
}

const EmergencyMobileContext = createContext<EmergencyMobileState>({
  isMobile: false,
  crisisMode: false,
  setCrisisMode: () => {},
});

export const useEmergencyMobile = () => useContext(EmergencyMobileContext);

interface EmergencyMobileProviderProps {
  children: React.ReactNode;
  enableEmergencyMode?: boolean;
}

export default function EmergencyMobileProvider({ 
  children, 
  enableEmergencyMode = false 
}: EmergencyMobileProviderProps) {
  // HYDRATION-SAFE: Start with false for both server and client, then detect
  const [isMobile, setIsMobile] = useState(false);
  const [crisisMode, setCrisisMode] = useState(enableEmergencyMode);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    // EMERGENCY: Simple mobile detection - only after hydration
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const value: EmergencyMobileState = {
    isMobile,
    crisisMode,
    setCrisisMode,
  };

  return (
    <EmergencyMobileContext.Provider value={value}>
      <div className={`${hasMounted && isMobile ? 'mobile-optimized' : ''} ${crisisMode ? 'crisis-mode' : ''}`}>
        {children}
      </div>
    </EmergencyMobileContext.Provider>
  );
}