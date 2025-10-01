/**
 * ALCHM Design System Provider
 * 
 * Ensures consistent Jony Ive design application across all metric amplification
 * components with trauma-informed accessibility and crisis-safe interactions.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface DesignSystemConfig {
  colorScheme: 'sage' | 'high-contrast';
  reducedMotion: boolean;
  crisisMode: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  touchTargets: 'standard' | 'large' | 'crisis-safe';
}

interface DesignSystemContextType {
  config: DesignSystemConfig;
  updateConfig: (updates: Partial<DesignSystemConfig>) => void;
  toggleCrisisMode: () => void;
  applyTheme: (element: HTMLElement) => void;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<DesignSystemConfig>({
    colorScheme: 'sage',
    reducedMotion: false,
    crisisMode: false,
    fontSize: 'normal',
    touchTargets: 'standard'
  });

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    setConfig(prev => ({
      ...prev,
      reducedMotion: prefersReducedMotion,
      colorScheme: prefersHighContrast ? 'high-contrast' : 'sage'
    }));

    // Apply initial theme to document
    applyGlobalTheme();
  }, []);

  useEffect(() => {
    // Update CSS custom properties when config changes
    applyGlobalTheme();
  }, [config]);

  const updateConfig = (updates: Partial<DesignSystemConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleCrisisMode = () => {
    setConfig(prev => ({
      ...prev,
      crisisMode: !prev.crisisMode,
      touchTargets: !prev.crisisMode ? 'crisis-safe' : 'standard',
      reducedMotion: !prev.crisisMode ? true : prev.reducedMotion
    }));
  };

  const applyTheme = (element: HTMLElement) => {
    // Apply design system classes to specific elements
    element.classList.add('alchm-design-system');
    
    if (config.crisisMode) {
      element.classList.add('crisis-mode');
    } else {
      element.classList.remove('crisis-mode');
    }

    if (config.reducedMotion) {
      element.classList.add('reduced-motion');
    } else {
      element.classList.remove('reduced-motion');
    }

    element.classList.add(`font-size-${config.fontSize}`);
    element.classList.add(`touch-targets-${config.touchTargets}`);
    element.classList.add(`color-scheme-${config.colorScheme}`);
  };

  const applyGlobalTheme = () => {
    const root = document.documentElement;
    
    // Crisis mode adjustments
    if (config.crisisMode) {
      root.style.setProperty('--timing-gentle', '0ms');
      root.style.setProperty('--timing-calm', '0ms');
      root.style.setProperty('--timing-meditative', '0ms');
      root.style.setProperty('--btn-min-height', '64px');
      root.style.setProperty('--base-font-size', '1.25rem');
    } else {
      root.style.setProperty('--timing-gentle', '300ms');
      root.style.setProperty('--timing-calm', '500ms');
      root.style.setProperty('--timing-meditative', '700ms');
      root.style.setProperty('--btn-min-height', '48px');
      root.style.setProperty('--base-font-size', '1rem');
    }

    // Reduced motion
    if (config.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // Font size scaling
    const fontScales = {
      normal: '1rem',
      large: '1.125rem',
      'extra-large': '1.25rem'
    };
    root.style.setProperty('--base-font-size', fontScales[config.fontSize]);

    // Color scheme
    if (config.colorScheme === 'high-contrast') {
      root.style.setProperty('--sage-400', '#2d4a3e');
      root.style.setProperty('--sanctuary-gray-600', '#000000');
      root.style.setProperty('--sanctuary-gray-300', '#666666');
    } else {
      root.style.setProperty('--sage-400', '#a4b792');
      root.style.setProperty('--sanctuary-gray-600', '#525252');
      root.style.setProperty('--sanctuary-gray-300', '#d4d4d4');
    }
  };

  const contextValue: DesignSystemContextType = {
    config,
    updateConfig,
    toggleCrisisMode,
    applyTheme
  };

  return (
    <DesignSystemContext.Provider value={contextValue}>
      <div className="alchm-design-system-root">
        {children}
      </div>
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (context === undefined) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}

// Hook for components to apply consistent Jony Ive styling
export function useJonyIveStyles() {
  const { config, applyTheme } = useDesignSystem();

  const getCardStyle = (variant: 'sanctuary' | 'elevated' | 'sacred' = 'sanctuary') => {
    const baseClasses = 'transition-all duration-300 ease-out';
    const variants = {
      sanctuary: 'bg-sanctuary-white border border-sanctuary-gray-100 rounded-lg shadow-whisper',
      elevated: 'bg-sanctuary-white border border-sanctuary-gray-200 rounded-xl shadow-soft',
      sacred: 'bg-gradient-to-br from-sanctuary-white to-sage-50/30 border border-sage-200 rounded-2xl shadow-sacred'
    };
    
    return `${baseClasses} ${variants[variant]}`;
  };

  const getButtonStyle = (variant: 'primary' | 'secondary' | 'gentle' = 'primary') => {
    const baseClasses = 'font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-sage-400 focus:ring-offset-2';
    const variants = {
      primary: 'bg-sage-400 hover:bg-sage-500 text-white border-none rounded-lg px-6 py-3 shadow-whisper hover:shadow-soft hover:-translate-y-0.5',
      secondary: 'bg-sanctuary-white hover:bg-sage-50/50 text-sage-700 border border-sage-200 rounded-lg px-6 py-3',
      gentle: 'bg-transparent hover:bg-sage-50/30 text-sanctuary-gray-600 hover:text-sage-700 border-none rounded px-4 py-2'
    };

    const sizeAdjustment = config.crisisMode ? 'min-h-[64px] text-lg' : 'min-h-[48px]';
    
    return `${baseClasses} ${variants[variant]} ${sizeAdjustment}`;
  };

  const getTextStyle = (variant: 'display' | 'hero' | 'heading-1' | 'heading-2' | 'heading-3' | 'body' | 'body-large' | 'body-small' | 'caption' = 'body') => {
    const variants = {
      display: 'text-5xl font-light leading-tight tracking-tight text-sanctuary-gray-900',
      hero: 'text-4xl font-light leading-tight tracking-tight text-sanctuary-gray-900',
      'heading-1': 'text-3xl font-normal leading-tight text-sanctuary-gray-900',
      'heading-2': 'text-2xl font-medium leading-tight text-sanctuary-gray-800',
      'heading-3': 'text-xl font-medium leading-snug text-sanctuary-gray-800',
      body: 'text-base font-normal leading-relaxed text-sanctuary-gray-700',
      'body-large': 'text-lg font-normal leading-relaxed text-sanctuary-gray-700',
      'body-small': 'text-sm font-normal leading-relaxed text-sanctuary-gray-600',
      caption: 'text-xs font-normal leading-normal text-sanctuary-gray-500'
    };

    return variants[variant];
  };

  const getProgressStyle = () => {
    return {
      container: 'w-full h-2 bg-sanctuary-gray-100 rounded-full overflow-hidden',
      fill: 'h-full bg-gradient-to-r from-sage-400 to-warm-amber rounded-full transition-all duration-1000 ease-out'
    };
  };

  const getAnimationClass = (type: 'breathe' | 'float' | 'pulse' | 'glow' = 'breathe') => {
    if (config.reducedMotion || config.crisisMode) return '';
    
    const animations = {
      breathe: 'animate-breathe',
      float: 'animate-float',
      pulse: 'animate-gentle-pulse',
      glow: 'animate-sanctuary-glow'
    };

    return animations[type];
  };

  return {
    getCardStyle,
    getButtonStyle,
    getTextStyle,
    getProgressStyle,
    getAnimationClass,
    config,
    applyTheme
  };
}

// Utility component for consistent spacing
export function SanctuaryContainer({ 
  children, 
  className = '',
  variant = 'default' 
}: { 
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide';
}) {
  const variants = {
    default: 'max-w-4xl mx-auto px-6 py-8',
    narrow: 'max-w-2xl mx-auto px-6 py-8',
    wide: 'max-w-7xl mx-auto px-6 py-8'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}

// Utility component for consistent card layouts
export function SacredCard({ 
  children, 
  variant = 'sanctuary',
  className = '',
  hover = true 
}: { 
  children: React.ReactNode;
  variant?: 'sanctuary' | 'elevated' | 'sacred';
  className?: string;
  hover?: boolean;
}) {
  const { getCardStyle } = useJonyIveStyles();
  const hoverClass = hover ? 'hover:-translate-y-1 hover:shadow-nurturing' : '';
  
  return (
    <div className={`${getCardStyle(variant)} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}