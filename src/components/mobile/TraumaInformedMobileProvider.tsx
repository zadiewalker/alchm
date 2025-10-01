'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Crisis State Detection and Response System
interface TraumaMobileState {
  isCrisisMode: boolean;
  isEmergencyMode: boolean;
  tremorsDetected: boolean;
  lowBattery: boolean;
  slowConnection: boolean;
  isOneHandedMode: boolean;
  deviceTier: 'ultra-low' | 'low' | 'medium' | 'high' | 'ultra-high';
  touchTargetSize: 'default' | 'large' | 'crisis' | 'emergency';
  cognitiveLoadLevel: 'minimal' | 'reduced' | 'standard';
}

interface TraumaMobileContextType {
  state: TraumaMobileState;
  actions: {
    activateCrisisMode: () => void;
    activateEmergencyMode: () => void;
    enableTremorCompensation: () => void;
    toggleOneHandedMode: () => void;
    reduceCognitiveLoad: () => void;
    optimizeForSlowDevice: () => void;
  };
}

const TraumaMobileContext = createContext<TraumaMobileContextType | undefined>(undefined);

interface TraumaInformedMobileProviderProps {
  children: ReactNode;
}

export function TraumaInformedMobileProvider({ children }: TraumaInformedMobileProviderProps) {
  const [state, setState] = useState<TraumaMobileState>({
    isCrisisMode: false,
    isEmergencyMode: false,
    tremorsDetected: false,
    lowBattery: false,
    slowConnection: false,
    isOneHandedMode: false,
    deviceTier: 'medium',
    touchTargetSize: 'default',
    cognitiveLoadLevel: 'standard'
  });

  // Device Performance Assessment
  useEffect(() => {
    const assessDevicePerformance = () => {
      const hardwareConcurrency = navigator.hardwareConcurrency || 2;
      const deviceMemory = (navigator as any).deviceMemory || 2;
      const connection = (navigator as any).connection;
      
      let tier: TraumaMobileState['deviceTier'] = 'medium';
      
      if (hardwareConcurrency <= 2 && deviceMemory <= 2) {
        tier = 'ultra-low';
      } else if (hardwareConcurrency <= 4 && deviceMemory <= 4) {
        tier = 'low';
      } else if (hardwareConcurrency <= 8 && deviceMemory <= 8) {
        tier = 'medium';
      } else if (hardwareConcurrency <= 12 && deviceMemory <= 16) {
        tier = 'high';
      } else {
        tier = 'ultra-high';
      }
      
      const slowConnection = connection && (
        connection.effectiveType === 'slow-2g' ||
        connection.effectiveType === '2g' ||
        connection.effectiveType === '3g'
      );
      
      setState(prev => ({
        ...prev,
        deviceTier: tier,
        slowConnection: Boolean(slowConnection)
      }));
    };
    
    assessDevicePerformance();
  }, []);

  // Battery Status Monitoring
  useEffect(() => {
    const monitorBattery = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          
          const updateBatteryStatus = () => {
            setState(prev => ({
              ...prev,
              lowBattery: battery.level < 0.15 || battery.dischargingTime < 1800 // Less than 30 minutes
            }));
          };
          
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('dischargingtimechange', updateBatteryStatus);
          updateBatteryStatus();
        } catch (error) {
          console.warn('Battery API not available');
        }
      }
    };
    
    monitorBattery();
  }, []);

  // Tremor Detection through Touch Patterns
  useEffect(() => {
    let touchStartTime = 0;
    let touchMoveCount = 0;
    let jitterThreshold = 0;
    
    const detectTremors = (e: TouchEvent) => {
      if (e.type === 'touchstart') {
        touchStartTime = Date.now();
        touchMoveCount = 0;
        jitterThreshold = 0;
      } else if (e.type === 'touchmove') {
        touchMoveCount++;
        const touch = e.touches[0];
        if (touch) {
          // Simple jitter detection based on micro-movements
          jitterThreshold += Math.abs(touch.clientX % 1) + Math.abs(touch.clientY % 1);
        }
      } else if (e.type === 'touchend') {
        const duration = Date.now() - touchStartTime;
        const avgJitter = jitterThreshold / Math.max(touchMoveCount, 1);
        
        // If excessive micro-movements detected, suggest tremor compensation
        if (duration > 500 && touchMoveCount > 10 && avgJitter > 0.3) {
          setState(prev => ({ ...prev, tremorsDetected: true }));
        }
      }
    };
    
    document.addEventListener('touchstart', detectTremors, { passive: true });
    document.addEventListener('touchmove', detectTremors, { passive: true });
    document.addEventListener('touchend', detectTremors, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', detectTremors);
      document.removeEventListener('touchmove', detectTremors);
      document.removeEventListener('touchend', detectTremors);
    };
  }, []);

  // Crisis Keyword Detection in Text Inputs
  useEffect(() => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'can\'t go on', 'worthless',
      'hopeless', 'want to die', 'hurt myself', 'self harm', 'cutting',
      'overdose', 'pills', 'razor', 'bridge', 'gun', 'rope'
    ];
    
    const detectCrisisLanguage = (e: Event) => {
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) {
        const text = target.value.toLowerCase();
        const containsCrisisKeywords = crisisKeywords.some(keyword => text.includes(keyword));
        
        if (containsCrisisKeywords && !state.isCrisisMode) {
          setState(prev => ({ ...prev, isCrisisMode: true, touchTargetSize: 'crisis' }));
        }
      }
    };
    
    document.addEventListener('input', detectCrisisLanguage);
    return () => document.removeEventListener('input', detectCrisisLanguage);
  }, [state.isCrisisMode]);

  // Apply CSS Classes Based on State
  useEffect(() => {
    const body = document.body;
    
    // Clear previous classes
    body.classList.remove(
      'crisis-active', 'emergency-active', 'tremor-detected', 'tremor-compensation',
      'perf-tier-ultra-low', 'perf-tier-low', 'perf-tier-medium', 'perf-tier-high', 'perf-tier-ultra-high',
      'large-touch-targets', 'battery-saver-mode', 'slow-connection', 'one-handed-mode',
      'cognitive-load-minimal', 'cognitive-load-reduced'
    );
    
    // Apply current state classes
    if (state.isCrisisMode) body.classList.add('crisis-active');
    if (state.isEmergencyMode) body.classList.add('emergency-active');
    if (state.tremorsDetected) body.classList.add('tremor-detected', 'tremor-compensation');
    if (state.lowBattery) body.classList.add('battery-saver-mode');
    if (state.slowConnection) body.classList.add('slow-connection');
    if (state.isOneHandedMode) body.classList.add('one-handed-mode');
    
    body.classList.add(`perf-tier-${state.deviceTier}`);
    
    if (state.touchTargetSize !== 'default') {
      body.classList.add('large-touch-targets');
    }
    
    if (state.cognitiveLoadLevel === 'minimal') {
      body.classList.add('cognitive-load-minimal');
    } else if (state.cognitiveLoadLevel === 'reduced') {
      body.classList.add('cognitive-load-reduced');
    }
  }, [state]);

  const actions = {
    activateCrisisMode: () => {
      setState(prev => ({
        ...prev,
        isCrisisMode: true,
        touchTargetSize: 'crisis',
        cognitiveLoadLevel: 'minimal'
      }));
      
      // Haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    },
    
    activateEmergencyMode: () => {
      setState(prev => ({
        ...prev,
        isEmergencyMode: true,
        isCrisisMode: true,
        touchTargetSize: 'emergency',
        cognitiveLoadLevel: 'minimal'
      }));
      
      // Strong haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([500, 200, 500, 200, 500]);
      }
    },
    
    enableTremorCompensation: () => {
      setState(prev => ({
        ...prev,
        tremorsDetected: true,
        touchTargetSize: 'emergency' // Always use emergency-sized targets for tremor compensation
      }));
      
      // Apply CSS custom properties for consistent tremor compensation
      document.documentElement.style.setProperty('--touch-target-size', 'var(--touch-target-emergency)');
      document.documentElement.style.setProperty('--touch-padding', 'var(--space-lg)');
      document.documentElement.style.setProperty('--stabilize-interactions', '1');
    },
    
    toggleOneHandedMode: () => {
      setState(prev => ({ ...prev, isOneHandedMode: !prev.isOneHandedMode }));
    },
    
    reduceCognitiveLoad: () => {
      setState(prev => ({
        ...prev,
        cognitiveLoadLevel: prev.cognitiveLoadLevel === 'standard' ? 'reduced' : 'minimal'
      }));
    },
    
    optimizeForSlowDevice: () => {
      setState(prev => ({
        ...prev,
        deviceTier: 'ultra-low',
        cognitiveLoadLevel: 'minimal'
      }));
    }
  };

  return (
    <TraumaMobileContext.Provider value={{ state, actions }}>
      {children}
    </TraumaMobileContext.Provider>
  );
}

export function useTraumaMobile() {
  const context = useContext(TraumaMobileContext);
  if (context === undefined) {
    throw new Error('useTraumaMobile must be used within a TraumaInformedMobileProvider');
  }
  return context;
}

// Hook for component-level mobile optimization
export function useMobileOptimization() {
  const { state } = useTraumaMobile();
  
  return {
    isMobileOptimized: true,
    touchTargetClass: `touch-target-${state.touchTargetSize}`,
    isHighContrast: state.isCrisisMode || state.isEmergencyMode,
    shouldReduceMotion: state.deviceTier === 'ultra-low' || state.lowBattery,
    isSlowDevice: state.deviceTier === 'ultra-low' || state.deviceTier === 'low',
    oneHandedStyle: state.isOneHandedMode ? {
      maxWidth: '320px',
      marginLeft: 'auto',
      marginRight: '16px'
    } : {},
    crisisMode: state.isCrisisMode
  };
}