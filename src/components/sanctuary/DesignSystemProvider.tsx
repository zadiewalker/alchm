'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * ALCHM Digital Sanctuary Design System Provider
 * "Calibrated Serenity" - React Context for Healing-Centered Design
 * 
 * Philosophy: Every interaction whispers safety, never shouts
 * Purpose: Provide comprehensive design system state management
 */

// Design System Configuration Types
interface SanctuaryThemeConfig {
  mode: 'standard' | 'professional' | 'crisis';
  reducedMotion: boolean;
  highContrast: boolean;
  colorTemperature: 'warm' | 'neutral' | 'cool';
  spacingScale: 'compact' | 'comfortable' | 'spacious';
  accessibility: {
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    focusStyle: 'subtle' | 'prominent';
    soundEnabled: boolean;
    hapticFeedback: boolean;
  };
}

interface SanctuaryBreakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  wide: number;
}

interface SanctuaryDesignTokens {
  colors: {
    sage: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string; // Primary
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    neutral: {
      white: string;
      softWhite: string;
      gray50: string;
      gray100: string;
      gray200: string;
      gray300: string;
      gray400: string;
      gray500: string;
      gray600: string;
      gray700: string;
      gray800: string;
      gray900: string;
    };
    professional: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string; // Professional accent
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
    };
    crisis: {
      background: string;
      border: string;
      text: string;
    };
    data: {
      success: string;
      warning: string;
      info: string;
      muted: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      light: number;
      regular: number;
      medium: number;
    };
    letterSpacing: {
      tight: string;
      normal: string;
      wide: string;
      wider: string;
    };
    lineHeight: {
      none: number;
      tight: number;
      normal: number;
      relaxed: number;
      loose: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    sanctuary: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
    toast: number;
  };
}

interface SanctuaryDesignSystemContextType {
  theme: SanctuaryThemeConfig;
  tokens: SanctuaryDesignTokens;
  breakpoints: SanctuaryBreakpoints;
  currentBreakpoint: keyof SanctuaryBreakpoints;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  updateTheme: (updates: Partial<SanctuaryThemeConfig>) => void;
  setMode: (mode: SanctuaryThemeConfig['mode']) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  setAccessibilityFontSize: (size: SanctuaryThemeConfig['accessibility']['fontSize']) => void;
}

// Default Design Tokens - Calibrated Serenity Palette
const defaultTokens: SanctuaryDesignTokens = {
  colors: {
    sage: {
      50: '#f6f8f5',
      100: '#e8eee5',
      200: '#d1ddcc',
      300: '#b4c7a8',
      400: '#a4b792', // Primary sage
      500: '#8ba078',
      600: '#6f8862',
      700: '#5a6d4f',
      800: '#485642',
      900: '#3d4838',
    },
    neutral: {
      white: '#fefefe',
      softWhite: '#fcfcfc',
      gray50: '#f8f9f8',
      gray100: '#f1f2f1',
      gray200: '#e4e6e4',
      gray300: '#d1d4d1',
      gray400: '#9ca09c',
      gray500: '#6b706b',
      gray600: '#555a55',
      gray700: '#404540',
      gray800: '#2a2f2a',
      gray900: '#1a1d1a',
    },
    professional: {
      50: '#f0f4f8',
      100: '#e1eaf2',
      200: '#c3d5e5',
      300: '#a5c0d8',
      400: '#7a9cc6', // Professional accent
      500: '#6b8bb3',
      600: '#5c7aa0',
      700: '#4d698d',
      800: '#3e587a',
      900: '#2f4767',
    },
    crisis: {
      background: '#fdf6f6',
      border: '#e8b4b4',
      text: '#6b4545',
    },
    data: {
      success: '#8fbc8f',
      warning: '#c4b17c',
      info: '#7a9cc6',
      muted: '#a8b5a0',
    },
  },
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Segoe UI", Roboto, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px - Body text
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px - Subheads
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px - Headings
      '3xl': '1.875rem', // 30px
      '4xl': '2rem',    // 32px - Key elements
      '5xl': '2.5rem',  // 40px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500, // Maximum for accessibility
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.1em',
      wider: '0.15em',
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px - Minimum between elements
    '2xl': '2rem',   // 32px - Mobile margins
    '3xl': '3rem',   // 48px - Desktop margins
    '4xl': '4rem',   // 64px
    '5xl': '6rem',   // 96px
  },
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    sanctuary: '0 8px 32px rgb(164 183 146 / 0.12)',
  },
  transitions: {
    fast: '150ms ease-out',
    normal: '250ms ease-out',
    slow: '350ms ease-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
};

// Default Breakpoints
const defaultBreakpoints: SanctuaryBreakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
};

// Default Theme Configuration
const defaultTheme: SanctuaryThemeConfig = {
  mode: 'standard',
  reducedMotion: false,
  highContrast: false,
  colorTemperature: 'warm',
  spacingScale: 'comfortable',
  accessibility: {
    fontSize: 'medium',
    focusStyle: 'subtle',
    soundEnabled: false,
    hapticFeedback: true,
  },
};

// Create Context
const SanctuaryDesignSystemContext = createContext<SanctuaryDesignSystemContextType | null>(null);

// Custom Hook for accessing design system
export function useSanctuaryDesignSystem(): SanctuaryDesignSystemContextType {
  const context = useContext(SanctuaryDesignSystemContext);
  if (!context) {
    throw new Error('useSanctuaryDesignSystem must be used within a SanctuaryDesignSystemProvider');
  }
  return context;
}

// Utility hook for responsive design
export function useResponsive() {
  const { currentBreakpoint, isMobile, isTablet, isDesktop } = useSanctuaryDesignSystem();
  return { currentBreakpoint, isMobile, isTablet, isDesktop };
}

// Utility hook for theme-aware styling
export function useSanctuaryTheme() {
  const { theme, tokens } = useSanctuaryDesignSystem();
  
  const getColor = (colorPath: string) => {
    const keys = colorPath.split('.');
    let value: any = tokens.colors;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || tokens.colors.sage[400];
  };

  const getSpacing = (size: keyof typeof tokens.spacing) => {
    return tokens.spacing[size];
  };

  const getFontSize = (size: keyof typeof tokens.typography.fontSize) => {
    const baseSize = tokens.typography.fontSize[size];
    const fontSize = theme.accessibility.fontSize;
    
    // Scale font sizes based on accessibility preference
    const scaleMap = {
      'small': 0.875,
      'medium': 1,
      'large': 1.125,
      'extra-large': 1.25,
    };
    
    const scale = scaleMap[fontSize];
    const numericSize = parseFloat(baseSize);
    return `${numericSize * scale}rem`;
  };

  return {
    theme,
    tokens,
    getColor,
    getSpacing,
    getFontSize,
  };
}

// Provider Component
interface SanctuaryDesignSystemProviderProps {
  children: React.ReactNode;
  initialTheme?: Partial<SanctuaryThemeConfig>;
  customTokens?: Partial<SanctuaryDesignTokens>;
  customBreakpoints?: Partial<SanctuaryBreakpoints>;
}

export function SanctuaryDesignSystemProvider({
  children,
  initialTheme = {},
  customTokens = {},
  customBreakpoints = {},
}: SanctuaryDesignSystemProviderProps) {
  // Merge custom configurations with defaults
  const tokens: SanctuaryDesignTokens = {
    ...defaultTokens,
    ...customTokens,
    colors: { ...defaultTokens.colors, ...customTokens.colors },
    typography: { ...defaultTokens.typography, ...customTokens.typography },
    spacing: { ...defaultTokens.spacing, ...customTokens.spacing },
  };

  const breakpoints: SanctuaryBreakpoints = {
    ...defaultBreakpoints,
    ...customBreakpoints,
  };

  // Theme state
  const [theme, setTheme] = useState<SanctuaryThemeConfig>({
    ...defaultTheme,
    ...initialTheme,
    accessibility: {
      ...defaultTheme.accessibility,
      ...initialTheme.accessibility,
    },
  });

  // Responsive state
  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof SanctuaryBreakpoints>('desktop');
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Initialize and handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < breakpoints.mobile) {
        setCurrentBreakpoint('mobile');
      } else if (width < breakpoints.tablet) {
        setCurrentBreakpoint('tablet');
      } else if (width < breakpoints.desktop) {
        setCurrentBreakpoint('desktop');
      } else {
        setCurrentBreakpoint('wide');
      }
    };

    // Initial measurement
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  // Detect user motion preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setTheme(prev => ({ ...prev, reducedMotion: true }));
    }
  }, []);

  // Apply CSS custom properties based on theme
  useEffect(() => {
    const root = document.documentElement;

    // Apply color mode
    if (theme.mode === 'professional') {
      root.classList.add('sanctuary-professional');
    } else {
      root.classList.remove('sanctuary-professional');
    }

    // Apply accessibility preferences
    if (theme.reducedMotion) {
      root.style.setProperty('--sanctuary-transition-fast', '0ms');
      root.style.setProperty('--sanctuary-transition-normal', '0ms');
      root.style.setProperty('--sanctuary-transition-slow', '0ms');
    } else {
      root.style.setProperty('--sanctuary-transition-fast', tokens.transitions.fast);
      root.style.setProperty('--sanctuary-transition-normal', tokens.transitions.normal);
      root.style.setProperty('--sanctuary-transition-slow', tokens.transitions.slow);
    }

    // Apply font size scaling
    const fontSizeScale = {
      'small': '0.875',
      'medium': '1',
      'large': '1.125',
      'extra-large': '1.25',
    }[theme.accessibility.fontSize];
    
    root.style.setProperty('--sanctuary-font-scale', fontSizeScale);

  }, [theme, tokens]);

  // Calculated responsive values
  const isMobile = currentBreakpoint === 'mobile';
  const isTablet = currentBreakpoint === 'tablet';
  const isDesktop = currentBreakpoint === 'desktop' || currentBreakpoint === 'wide';

  // Theme update functions
  const updateTheme = (updates: Partial<SanctuaryThemeConfig>) => {
    setTheme(prev => ({
      ...prev,
      ...updates,
      accessibility: {
        ...prev.accessibility,
        ...updates.accessibility,
      },
    }));
  };

  const setMode = (mode: SanctuaryThemeConfig['mode']) => {
    updateTheme({ mode });
  };

  const toggleReducedMotion = () => {
    updateTheme({ reducedMotion: !theme.reducedMotion });
  };

  const toggleHighContrast = () => {
    updateTheme({ highContrast: !theme.highContrast });
  };

  const setAccessibilityFontSize = (fontSize: SanctuaryThemeConfig['accessibility']['fontSize']) => {
    updateTheme({
      accessibility: {
        ...theme.accessibility,
        fontSize,
      },
    });
  };

  const contextValue: SanctuaryDesignSystemContextType = {
    theme,
    tokens,
    breakpoints,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    updateTheme,
    setMode,
    toggleReducedMotion,
    toggleHighContrast,
    setAccessibilityFontSize,
  };

  return (
    <SanctuaryDesignSystemContext.Provider value={contextValue}>
      <div className="sanctuary-foundation">
        {children}
      </div>
    </SanctuaryDesignSystemContext.Provider>
  );
}

// Convenience exports
export type {
  SanctuaryThemeConfig,
  SanctuaryDesignTokens,
  SanctuaryBreakpoints,
  SanctuaryDesignSystemContextType,
};

export { defaultTokens, defaultBreakpoints, defaultTheme };