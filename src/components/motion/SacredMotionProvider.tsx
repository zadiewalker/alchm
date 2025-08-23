// ALCHM Sacred Motion Provider
// React context and components for trauma-informed motion system
// Provides nervous system-aware animations throughout the application

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { SacredMotionManager, SacredMotionConfig, useSacredMotion } from '@/lib/sacred-motion-system';

// ===== CONTEXT TYPES =====

interface SacredMotionContextType {
  motionManager: SacredMotionManager | null;
  config: SacredMotionConfig;
  updateConfig: (newConfig: Partial<SacredMotionConfig>) => void;
  isReducedMotion: boolean;
  createTransition: (element: HTMLElement, property: string, value: string, timing?: string) => Promise<void>;
  animatePageTransition: (exitEl: HTMLElement, enterEl: HTMLElement) => Promise<void>;
  createBreathing: (element: HTMLElement, cycles?: number) => () => void;
  createGlow: (element: HTMLElement, color?: string, intensity?: string) => () => void;
  observeScrollReveal: (element: HTMLElement) => void;
}

// ===== CONTEXT CREATION =====

const SacredMotionContext = createContext<SacredMotionContextType | null>(null);

// ===== PROVIDER COMPONENT =====

interface SacredMotionProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<SacredMotionConfig>;
  culturalContext?: string;
  nervousSystemState?: 'regulated' | 'activated' | 'dorsal';
}

export function SacredMotionProvider({
  children,
  initialConfig = {},
  culturalContext = 'universal',
  nervousSystemState = 'regulated'
}: SacredMotionProviderProps) {
  
  const [config, setConfig] = useState<SacredMotionConfig>({
    respectsReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    culturalPacing: 'responsive',
    nervousSystemState: nervousSystemState,
    accessibilityLevel: 'standard',
    ...initialConfig
  });

  const [motionManager, setMotionManager] = useState<SacredMotionManager | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(config.respectsReducedMotion);

  // Initialize motion manager
  useEffect(() => {
    const manager = new SacredMotionManager(config);
    setMotionManager(manager);

    // Apply cultural pacing based on context
    if (culturalContext !== 'universal') {
      manager.applyCulturalPacing(culturalContext as any);
    }

    return () => manager.destroy();
  }, []);

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      updateConfig({ respectsReducedMotion: e.matches });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update nervous system state when prop changes
  useEffect(() => {
    if (motionManager && nervousSystemState !== config.nervousSystemState) {
      motionManager.adaptToNervousSystemState(nervousSystemState);
      setConfig(prev => ({ ...prev, nervousSystemState }));
    }
  }, [nervousSystemState, motionManager]);

  const updateConfig = (newConfig: Partial<SacredMotionConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    if (motionManager) {
      // Recreate motion manager with new config
      motionManager.destroy();
      const newManager = new SacredMotionManager({ ...config, ...newConfig });
      setMotionManager(newManager);
    }
  };

  const contextValue: SacredMotionContextType = {
    motionManager,
    config,
    updateConfig,
    isReducedMotion,
    createTransition: motionManager?.createSacredTransition.bind(motionManager) || (() => Promise.resolve()),
    animatePageTransition: motionManager?.animatePageTransition.bind(motionManager) || (() => Promise.resolve()),
    createBreathing: motionManager?.createBreathingAnimation.bind(motionManager) || (() => () => {}),
    createGlow: motionManager?.createGentleGlow.bind(motionManager) || (() => () => {}),
    observeScrollReveal: motionManager?.observeElement.bind(motionManager) || (() => {})
  };

  return (
    <SacredMotionContext.Provider value={contextValue}>
      {children}
    </SacredMotionContext.Provider>
  );
}

// ===== CONTEXT HOOK =====

export function useSacredMotionContext(): SacredMotionContextType {
  const context = useContext(SacredMotionContext);
  if (!context) {
    throw new Error('useSacredMotionContext must be used within a SacredMotionProvider');
  }
  return context;
}

// ===== COMPONENT WRAPPERS FOR COMMON MOTION PATTERNS =====

interface SacredHoverProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'gentle' | 'presence';
  disabled?: boolean;
}

export function SacredHover({ 
  children, 
  className = '', 
  intensity = 'gentle',
  disabled = false 
}: SacredHoverProps) {
  const { isReducedMotion } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || isReducedMotion || !elementRef.current) return;

    const element = elementRef.current;
    const liftValues = {
      subtle: '-1px',
      gentle: '-2px', 
      presence: '-4px'
    };

    const glowValues = {
      subtle: '0 2px 4px rgba(164, 183, 146, 0.1)',
      gentle: '0 4px 8px rgba(164, 183, 146, 0.2)',
      presence: '0 6px 12px rgba(164, 183, 146, 0.3)'
    };

    const handleMouseEnter = () => {
      element.style.transform = `translateY(${liftValues[intensity]})`;
      element.style.boxShadow = glowValues[intensity];
      element.style.transition = 'transform 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    };

    const handleMouseLeave = () => {
      element.style.transform = '';
      element.style.boxShadow = '';
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity, disabled, isReducedMotion]);

  return (
    <div ref={elementRef} className={`sacred-hover ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED FADE TRANSITION =====

interface SacredFadeProps {
  children: React.ReactNode;
  show: boolean;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export function SacredFade({ 
  children, 
  show, 
  duration,
  className = '',
  onComplete 
}: SacredFadeProps) {
  const { isReducedMotion, config } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(show);

  const effectiveDuration = duration || (isReducedMotion ? 50 : 300);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    if (show) {
      setShouldRender(true);
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      
      // Trigger reflow
      element.offsetHeight;
      
      element.style.transition = isReducedMotion 
        ? 'none'
        : `opacity ${effectiveDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${effectiveDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';

      if (onComplete) {
        setTimeout(onComplete, effectiveDuration);
      }
    } else {
      element.style.transition = isReducedMotion 
        ? 'none'
        : `opacity ${effectiveDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${effectiveDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';

      setTimeout(() => {
        setShouldRender(false);
        if (onComplete) onComplete();
      }, effectiveDuration);
    }
  }, [show, effectiveDuration, isReducedMotion, onComplete]);

  if (!shouldRender) return null;

  return (
    <div ref={elementRef} className={`sacred-fade ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED BREATHING ANIMATION =====

interface SacredBreathingProps {
  children: React.ReactNode;
  cycles?: number;
  className?: string;
  disabled?: boolean;
}

export function SacredBreathing({ 
  children, 
  cycles = Infinity, 
  className = '',
  disabled = false 
}: SacredBreathingProps) {
  const { createBreathing, isReducedMotion } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (disabled || isReducedMotion || !elementRef.current) return;

    cleanupRef.current = createBreathing(elementRef.current, cycles);

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [cycles, disabled, isReducedMotion, createBreathing]);

  return (
    <div ref={elementRef} className={`sacred-breathing ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED SCROLL REVEAL =====

interface SacredScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  disabled?: boolean;
}

export function SacredScrollReveal({ 
  children, 
  threshold = 0.1, 
  className = '',
  disabled = false 
}: SacredScrollRevealProps) {
  const { observeScrollReveal, isReducedMotion } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled || isReducedMotion || !elementRef.current) {
      // For reduced motion, just show the element
      if (elementRef.current) {
        elementRef.current.style.opacity = '1';
        elementRef.current.style.transform = 'none';
      }
      return;
    }

    observeScrollReveal(elementRef.current);
  }, [disabled, isReducedMotion, observeScrollReveal]);

  return (
    <div ref={elementRef} className={`sacred-scroll-reveal ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED GLOW EFFECT =====

interface SacredGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: 'whisper' | 'breath' | 'gentle' | 'presence';
  trigger?: 'hover' | 'focus' | 'always' | 'pulse';
  className?: string;
  disabled?: boolean;
}

export function SacredGlow({ 
  children, 
  color = 'rgba(164, 183, 146, 0.3)',
  intensity = 'gentle',
  trigger = 'hover',
  className = '',
  disabled = false 
}: SacredGlowProps) {
  const { createGlow, isReducedMotion } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (disabled || isReducedMotion || !elementRef.current) return;

    const element = elementRef.current;

    if (trigger === 'always' || trigger === 'pulse') {
      cleanupRef.current = createGlow(element, color, intensity);
    } else if (trigger === 'hover') {
      const handleMouseEnter = () => {
        cleanupRef.current = createGlow(element, color, intensity);
      };

      const handleMouseLeave = () => {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    } else if (trigger === 'focus') {
      const handleFocus = () => {
        cleanupRef.current = createGlow(element, color, intensity);
      };

      const handleBlur = () => {
        if (cleanupRef.current) {
          cleanupRef.current();
          cleanupRef.current = null;
        }
      };

      element.addEventListener('focus', handleFocus);
      element.addEventListener('blur', handleBlur);

      return () => {
        element.removeEventListener('focus', handleFocus);
        element.removeEventListener('blur', handleBlur);
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [color, intensity, trigger, disabled, isReducedMotion, createGlow]);

  return (
    <div ref={elementRef} className={`sacred-glow ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED PAGE TRANSITION =====

interface SacredPageTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export function SacredPageTransition({ 
  children, 
  isActive, 
  className = '' 
}: SacredPageTransitionProps) {
  const { isReducedMotion } = useSacredMotionContext();
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    if (isReducedMotion) {
      element.style.display = isActive ? 'block' : 'none';
      return;
    }

    if (isActive) {
      element.style.display = 'block';
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      
      // Trigger reflow
      element.offsetHeight;
      
      element.style.transition = 'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    } else {
      element.style.transition = 'opacity 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.opacity = '0';
      element.style.transform = 'translateY(8px)';
      
      setTimeout(() => {
        element.style.display = 'none';
      }, 300);
    }
  }, [isActive, isReducedMotion]);

  return (
    <div ref={elementRef} className={`sacred-page-transition ${className}`}>
      {children}
    </div>
  );
}

// ===== SACRED LOADING ANIMATION =====

interface SacredLoadingProps {
  isLoading: boolean;
  className?: string;
  message?: string;
}

export function SacredLoading({ 
  isLoading, 
  className = '',
  message = 'Loading...'
}: SacredLoadingProps) {
  const { isReducedMotion } = useSacredMotionContext();

  if (!isLoading) return null;

  if (isReducedMotion) {
    return (
      <div className={`sacred-loading-reduced ${className}`}>
        <div className="text-center py-4 text-text-secondary">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={`sacred-loading ${className}`}>
      <div className="sacred-loading-container">
        <div className="sacred-loading-bar"></div>
        {message && (
          <div className="sacred-loading-message text-text-secondary text-center mt-2">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== NERVOUS SYSTEM STATE ADAPTER =====

interface NervousSystemAdapterProps {
  children: React.ReactNode;
  state: 'regulated' | 'activated' | 'dorsal';
}

export function NervousSystemAdapter({ children, state }: NervousSystemAdapterProps) {
  const { updateConfig } = useSacredMotionContext();

  useEffect(() => {
    updateConfig({ nervousSystemState: state });
  }, [state, updateConfig]);

  return <>{children}</>;
}

// ===== EXPORT MOTION COMPONENTS =====

export {
  SacredHover,
  SacredFade,
  SacredBreathing,
  SacredScrollReveal,
  SacredGlow,
  SacredPageTransition,
  SacredLoading,
  NervousSystemAdapter
};