/**
 * ALCHM Digital Sanctuary Design Tokens
 * "Calibrated Serenity" - Design System Foundation
 * 
 * Philosophy: Purposeful simplicity serving vulnerable users
 * Every token carries the intention of healing and safety
 */

// Core Brand Colors - Morning Mist Over Meadows
export const sanctuaryColors = {
  // Primary Sage Palette - The heart of our visual identity
  sage: {
    50: '#f6f8f5',   // Whisper of sage - barely there backgrounds
    100: '#e8eee5',  // Soft sage - gentle hover states
    200: '#d1ddcc',  // Light sage - border elements
    300: '#b4c7a8',  // Medium sage - secondary elements
    400: '#a4b792',  // Primary sage - main brand color
    500: '#8ba078',  // Deeper sage - hover states for primary
    600: '#6f8862',  // Strong sage - text on light backgrounds
    700: '#5a6d4f',  // Bold sage - primary text
    800: '#485642',  // Dark sage - headings
    900: '#3d4838',  // Deepest sage - contrast text
  },

  // Supporting Neutrals - Warm Sanctuary Tones
  neutral: {
    white: '#fefefe',      // Pure sanctuary white
    softWhite: '#fcfcfc',  // Slightly warmed white
    50: '#f8f9f8',         // Barely-there gray
    100: '#f1f2f1',        // Subtle background
    200: '#e4e6e4',        // Light borders
    300: '#d1d4d1',        // Medium borders
    400: '#9ca09c',        // Placeholder text
    500: '#6b706b',        // Secondary text
    600: '#555a55',        // Primary text
    700: '#404540',        // Headings
    800: '#2a2f2a',        // Strong contrast
    900: '#1a1d1a',        // Maximum contrast
  },

  // Professional Mode - Therapist Interface
  professional: {
    50: '#f0f4f8',   // Light professional background
    100: '#e1eaf2',  // Subtle professional tint
    200: '#c3d5e5',  // Professional borders
    300: '#a5c0d8',  // Professional secondary
    400: '#7a9cc6',  // Primary professional accent
    500: '#6b8bb3',  // Professional hover
    600: '#5c7aa0',  // Professional text
    700: '#4d698d',  // Professional headings
    800: '#3e587a',  // Professional dark
    900: '#2f4767',  // Professional deepest
  },

  // Crisis Safety Colors - Gentle but Clear
  crisis: {
    background: '#fdf6f6',  // Soft crisis background
    border: '#e8b4b4',      // Gentle crisis border
    text: '#6b4545',        // Crisis text that doesn't alarm
    subtle: '#f9f2f2',      // Very subtle crisis tint
    hover: '#f5eaea',       // Crisis hover state
  },

  // Data Visualization - Soft Analytics
  data: {
    success: '#8fbc8f',     // Gentle success green
    warning: '#c4b17c',     // Warm warning amber
    info: '#7a9cc6',        // Professional info blue
    muted: '#a8b5a0',       // Muted sage for less important data
    error: '#c49292',       // Gentle error red
  },

  // Semantic Colors - Trauma-Informed
  semantic: {
    // Success states that feel nurturing, not aggressive
    success: {
      background: '#f1f8f1',
      border: '#8fbc8f',
      text: '#4a6b4a',
    },
    // Warning states that feel supportive, not alarming
    warning: {
      background: '#faf8f2',
      border: '#c4b17c',
      text: '#6b5d3a',
    },
    // Info states that feel calming
    info: {
      background: '#f0f4f8',
      border: '#7a9cc6',
      text: '#4a5c7a',
    },
    // Error states that feel supportive, not punitive
    error: {
      background: '#f8f2f2',
      border: '#c49292',
      text: '#6b4a4a',
    },
  },
} as const;

// Typography System - Whispered Confidence
export const sanctuaryTypography = {
  // Font Families - Premium, accessible fonts
  fontFamily: {
    primary: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"Inter"',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(', '),
    mono: [
      '"SF Mono"',
      'Monaco',
      '"Cascadia Code"',
      '"Roboto Mono"',
      'Consolas',
      'monospace',
    ].join(', '),
  },

  // Font Sizes - Generous Hierarchy
  fontSize: {
    xs: '0.75rem',     // 12px - Small annotations
    sm: '0.875rem',    // 14px - Body text
    base: '1rem',      // 16px - Default
    lg: '1.125rem',    // 18px - Subheadings
    xl: '1.25rem',     // 20px - Small headings
    '2xl': '1.5rem',   // 24px - Medium headings
    '3xl': '1.875rem', // 30px - Large headings
    '4xl': '2rem',     // 32px - Key elements
    '5xl': '2.5rem',   // 40px - Hero text
    '6xl': '3rem',     // 48px - Display text
  },

  // Font Weights - Never Heavy, Always Elegant
  fontWeight: {
    light: 300,        // Light weight for display text
    regular: 400,      // Regular weight for body text
    medium: 500,       // Medium weight - maximum for accessibility
  },

  // Letter Spacing - Premium Feel
  letterSpacing: {
    tight: '-0.025em',   // Slightly condensed
    normal: '0',         // Default spacing
    wide: '0.1em',       // Premium spacing
    wider: '0.15em',     // Maximum premium spacing
  },

  // Line Heights - Reading Comfort
  lineHeight: {
    none: 1,           // Compact text
    tight: 1.25,       // Headings
    normal: 1.5,       // Default
    relaxed: 1.6,      // Body text
    loose: 1.8,        // Maximum comfort
  },
} as const;

// Spacing System - Intentional Breathing Room
export const sanctuarySpacing = {
  // Core Spacing Scale
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px - Minimum between elements
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px - Mobile margins
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px - Desktop margins
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px

  // Semantic Spacing
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px - Minimum between elements
  '2xl': '2rem',     // 32px - Mobile margins
  '3xl': '3rem',     // 48px - Desktop margins
  '4xl': '4rem',     // 64px
  '5xl': '6rem',     // 96px
  '6xl': '8rem',     // 128px
  '7xl': '12rem',    // 192px
  '8xl': '16rem',    // 256px
  '9xl': '20rem',    // 320px
} as const;

// Border Radius - Subtle Rounded Corners
export const sanctuaryBorderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',   // 24px
  '3xl': '2rem',     // 32px
  full: '9999px',    // Fully rounded
} as const;

// Shadows - Gentle Elevation
export const sanctuaryShadows = {
  none: '0 0 #0000',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Sanctuary-specific shadows with sage tinting
  sanctuary: '0 8px 32px rgb(164 183 146 / 0.12)',
  sanctuaryLg: '0 16px 40px rgb(164 183 146 / 0.15)',
  sanctuaryXl: '0 24px 48px rgb(164 183 146 / 0.18)',
} as const;

// Animation & Timing - Gentle, Never Jarring
export const sanctuaryTiming = {
  // Transition Durations
  duration: {
    instant: '0ms',
    fast: '150ms',     // Quick interactions
    normal: '250ms',   // Default transitions
    slow: '350ms',     // Gentle page transitions
    slower: '500ms',   // Modal openings
    slowest: '750ms',  // Page loads
  },

  // Easing Functions - Calming curves
  easing: {
    linear: 'linear',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',      // Default ease-out
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',       // Ease-in
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',  // Ease-in-out
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Extra gentle
    sanctuary: 'cubic-bezier(0.23, 1, 0.32, 1)', // Sanctuary signature easing
  },

  // Complete Transition Values
  transition: {
    fast: '150ms cubic-bezier(0, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0, 0, 0.2, 1)',
    gentle: '250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    sanctuary: '300ms cubic-bezier(0.23, 1, 0.32, 1)',
  },
} as const;

// Z-Index Scale - Layering System
export const sanctuaryZIndex = {
  auto: 'auto',
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  
  // Semantic Z-Index
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
  crisis: 1090,      // Crisis elements get highest priority
} as const;

// Breakpoints - Responsive Design
export const sanctuaryBreakpoints = {
  mobile: '768px',    // Up to tablet
  tablet: '1024px',   // Up to desktop
  desktop: '1280px',  // Up to wide
  wide: '1536px',     // Wide screens
  
  // Numeric values for JavaScript
  mobileValue: 768,
  tabletValue: 1024,
  desktopValue: 1280,
  wideValue: 1536,
} as const;

// Touch Targets - Accessibility & Motor Impairments
export const sanctuaryTouchTargets = {
  // Minimum touch target sizes
  minimum: '44px',    // WCAG AA minimum
  comfortable: '48px', // Recommended size
  spacious: '56px',   // Extra comfortable
  
  // Touch target spacing
  spacing: {
    tight: '4px',     // Minimum spacing
    comfortable: '8px', // Recommended spacing
    spacious: '12px',  // Extra spacing
  },
} as const;

// Focus States - Accessibility
export const sanctuaryFocus = {
  // Focus ring styles
  ring: {
    width: '2px',
    color: sanctuaryColors.sage[400],
    offset: '2px',
    style: 'solid',
  },
  
  // High contrast focus for accessibility
  highContrast: {
    width: '3px',
    color: sanctuaryColors.professional[600],
    offset: '2px',
    style: 'solid',
  },
} as const;

// Complete Token Export
export const sanctuaryTokens = {
  colors: sanctuaryColors,
  typography: sanctuaryTypography,
  spacing: sanctuarySpacing,
  borderRadius: sanctuaryBorderRadius,
  shadows: sanctuaryShadows,
  timing: sanctuaryTiming,
  zIndex: sanctuaryZIndex,
  breakpoints: sanctuaryBreakpoints,
  touchTargets: sanctuaryTouchTargets,
  focus: sanctuaryFocus,
} as const;

// Type exports for TypeScript
export type SanctuaryColors = typeof sanctuaryColors;
export type SanctuaryTypography = typeof sanctuaryTypography;
export type SanctuarySpacing = typeof sanctuarySpacing;
export type SanctuaryBorderRadius = typeof sanctuaryBorderRadius;
export type SanctuaryShadows = typeof sanctuaryShadows;
export type SanctuaryTiming = typeof sanctuaryTiming;
export type SanctuaryZIndex = typeof sanctuaryZIndex;
export type SanctuaryBreakpoints = typeof sanctuaryBreakpoints;
export type SanctuaryTouchTargets = typeof sanctuaryTouchTargets;
export type SanctuaryFocus = typeof sanctuaryFocus;
export type SanctuaryTokens = typeof sanctuaryTokens;

// Utility functions for token access
export function getSageColor(shade: keyof typeof sanctuaryColors.sage): string {
  return sanctuaryColors.sage[shade];
}

export function getNeutralColor(shade: keyof typeof sanctuaryColors.neutral): string {
  return sanctuaryColors.neutral[shade];
}

export function getProfessionalColor(shade: keyof typeof sanctuaryColors.professional): string {
  return sanctuaryColors.professional[shade];
}

export function getSpacing(size: keyof typeof sanctuarySpacing): string {
  return sanctuarySpacing[size];
}

export function getFontSize(size: keyof typeof sanctuaryTypography.fontSize): string {
  return sanctuaryTypography.fontSize[size];
}

export function getBorderRadius(size: keyof typeof sanctuaryBorderRadius): string {
  return sanctuaryBorderRadius[size];
}

export function getShadow(size: keyof typeof sanctuaryShadows): string {
  return sanctuaryShadows[size];
}

export function getTransition(speed: keyof typeof sanctuaryTiming.transition): string {
  return sanctuaryTiming.transition[speed];
}

// CSS Custom Property Generator
export function generateCSSCustomProperties(): Record<string, string> {
  const properties: Record<string, string> = {};

  // Generate color custom properties
  Object.entries(sanctuaryColors.sage).forEach(([key, value]) => {
    properties[`--sanctuary-sage-${key}`] = value;
  });

  Object.entries(sanctuaryColors.neutral).forEach(([key, value]) => {
    properties[`--sanctuary-neutral-${key}`] = value;
  });

  Object.entries(sanctuaryColors.professional).forEach(([key, value]) => {
    properties[`--sanctuary-professional-${key}`] = value;
  });

  // Generate spacing custom properties
  Object.entries(sanctuarySpacing).forEach(([key, value]) => {
    properties[`--sanctuary-space-${key}`] = value;
  });

  // Generate typography custom properties
  Object.entries(sanctuaryTypography.fontSize).forEach(([key, value]) => {
    properties[`--sanctuary-text-${key}`] = value;
  });

  // Generate border radius custom properties
  Object.entries(sanctuaryBorderRadius).forEach(([key, value]) => {
    properties[`--sanctuary-radius-${key}`] = value;
  });

  // Generate shadow custom properties
  Object.entries(sanctuaryShadows).forEach(([key, value]) => {
    properties[`--sanctuary-shadow-${key}`] = value;
  });

  return properties;
}

// Default export
export default sanctuaryTokens;