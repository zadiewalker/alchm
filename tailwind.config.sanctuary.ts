import type { Config } from 'tailwindcss';
import { sanctuaryTokens } from './src/lib/design/sanctuary-tokens';

/**
 * ALCHM Digital Sanctuary Design System - Extended Tailwind Configuration
 * "Calibrated Serenity" - Complete Design Token Integration
 * 
 * Philosophy: Every utility class serves the healing journey
 * Purpose: Extend Tailwind with trauma-informed design tokens
 */

const sanctuaryConfig: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  
  // Disable Tailwind's default theme to fully control design system
  corePlugins: {
    preflight: true, // Keep CSS reset
  },
  
  theme: {
    // Override default Tailwind theme with Sanctuary tokens
    colors: {
      // Transparent and current for utility
      transparent: 'transparent',
      current: 'currentColor',
      
      // Sanctuary Sage - Primary brand palette
      sage: sanctuaryTokens.colors.sage,
      
      // Sanctuary Neutrals - Supporting palette  
      neutral: sanctuaryTokens.colors.neutral,
      white: sanctuaryTokens.colors.neutral.white,
      gray: {
        50: sanctuaryTokens.colors.neutral['50'],
        100: sanctuaryTokens.colors.neutral['100'],
        200: sanctuaryTokens.colors.neutral['200'],
        300: sanctuaryTokens.colors.neutral['300'],
        400: sanctuaryTokens.colors.neutral['400'],
        500: sanctuaryTokens.colors.neutral['500'],
        600: sanctuaryTokens.colors.neutral['600'],
        700: sanctuaryTokens.colors.neutral['700'],
        800: sanctuaryTokens.colors.neutral['800'],
        900: sanctuaryTokens.colors.neutral['900'],
      },
      
      // Professional Mode Colors
      professional: sanctuaryTokens.colors.professional,
      
      // Crisis Safety Colors
      crisis: sanctuaryTokens.colors.crisis,
      
      // Data Visualization Colors
      data: sanctuaryTokens.colors.data,
      
      // Semantic Colors for UI states
      success: {
        50: sanctuaryTokens.colors.semantic.success.background,
        500: sanctuaryTokens.colors.semantic.success.border,
        700: sanctuaryTokens.colors.semantic.success.text,
      },
      warning: {
        50: sanctuaryTokens.colors.semantic.warning.background,
        500: sanctuaryTokens.colors.semantic.warning.border,
        700: sanctuaryTokens.colors.semantic.warning.text,
      },
      info: {
        50: sanctuaryTokens.colors.semantic.info.background,
        500: sanctuaryTokens.colors.semantic.info.border,
        700: sanctuaryTokens.colors.semantic.info.text,
      },
      error: {
        50: sanctuaryTokens.colors.semantic.error.background,
        500: sanctuaryTokens.colors.semantic.error.border,
        700: sanctuaryTokens.colors.semantic.error.text,
      },
    },

    // Typography System
    fontFamily: {
      sans: sanctuaryTokens.typography.fontFamily.primary.split(', '),
      mono: sanctuaryTokens.typography.fontFamily.mono.split(', '),
    },
    
    fontSize: {
      xs: [sanctuaryTokens.typography.fontSize.xs, { lineHeight: sanctuaryTokens.typography.lineHeight.normal }],
      sm: [sanctuaryTokens.typography.fontSize.sm, { lineHeight: sanctuaryTokens.typography.lineHeight.relaxed }],
      base: [sanctuaryTokens.typography.fontSize.base, { lineHeight: sanctuaryTokens.typography.lineHeight.relaxed }],
      lg: [sanctuaryTokens.typography.fontSize.lg, { lineHeight: sanctuaryTokens.typography.lineHeight.relaxed }],
      xl: [sanctuaryTokens.typography.fontSize.xl, { lineHeight: sanctuaryTokens.typography.lineHeight.normal }],
      '2xl': [sanctuaryTokens.typography.fontSize['2xl'], { lineHeight: sanctuaryTokens.typography.lineHeight.normal }],
      '3xl': [sanctuaryTokens.typography.fontSize['3xl'], { lineHeight: sanctuaryTokens.typography.lineHeight.tight }],
      '4xl': [sanctuaryTokens.typography.fontSize['4xl'], { lineHeight: sanctuaryTokens.typography.lineHeight.tight }],
      '5xl': [sanctuaryTokens.typography.fontSize['5xl'], { lineHeight: sanctuaryTokens.typography.lineHeight.tight }],
      '6xl': [sanctuaryTokens.typography.fontSize['6xl'], { lineHeight: sanctuaryTokens.typography.lineHeight.tight }],
    },
    
    fontWeight: {
      light: sanctuaryTokens.typography.fontWeight.light,
      normal: sanctuaryTokens.typography.fontWeight.regular,
      medium: sanctuaryTokens.typography.fontWeight.medium,
      // Remove bold weights to maintain accessibility
    },
    
    letterSpacing: {
      tight: sanctuaryTokens.typography.letterSpacing.tight,
      normal: sanctuaryTokens.typography.letterSpacing.normal,
      wide: sanctuaryTokens.typography.letterSpacing.wide,
      wider: sanctuaryTokens.typography.letterSpacing.wider,
    },
    
    lineHeight: {
      none: sanctuaryTokens.typography.lineHeight.none,
      tight: sanctuaryTokens.typography.lineHeight.tight,
      normal: sanctuaryTokens.typography.lineHeight.normal,
      relaxed: sanctuaryTokens.typography.lineHeight.relaxed,
      loose: sanctuaryTokens.typography.lineHeight.loose,
    },

    // Spacing System - Intentional Breathing Room
    spacing: sanctuaryTokens.spacing,

    // Border Radius - Subtle Rounded Corners
    borderRadius: sanctuaryTokens.borderRadius,

    // Box Shadow - Gentle Elevation
    boxShadow: sanctuaryTokens.shadows,

    // Z-Index - Layering System
    zIndex: sanctuaryTokens.zIndex,

    // Transition Duration & Timing
    transitionDuration: {
      0: '0ms',
      75: '75ms',
      100: '100ms',
      150: sanctuaryTokens.timing.duration.fast,
      200: '200ms',
      250: sanctuaryTokens.timing.duration.normal,
      300: '300ms',
      350: sanctuaryTokens.timing.duration.slow,
      500: sanctuaryTokens.timing.duration.slower,
      700: '700ms',
      750: sanctuaryTokens.timing.duration.slowest,
      1000: '1000ms',
    },
    
    transitionTimingFunction: {
      linear: 'linear',
      in: sanctuaryTokens.timing.easing.easeIn,
      out: sanctuaryTokens.timing.easing.easeOut,
      'in-out': sanctuaryTokens.timing.easing.easeInOut,
      gentle: sanctuaryTokens.timing.easing.gentle,
      sanctuary: sanctuaryTokens.timing.easing.sanctuary,
    },

    // Breakpoints for responsive design
    screens: {
      sm: sanctuaryTokens.breakpoints.mobile,
      md: sanctuaryTokens.breakpoints.tablet,
      lg: sanctuaryTokens.breakpoints.desktop,
      xl: sanctuaryTokens.breakpoints.wide,
      
      // Trauma-informed breakpoints
      'mobile-only': { 'max': '767px' },
      'tablet-only': { 'min': '768px', 'max': '1023px' },
      'desktop-up': { 'min': '1024px' },
      
      // Touch-friendly breakpoints
      'touch': { 'max': '1023px' }, // Mobile and tablet
      'pointer': { 'min': '1024px' }, // Desktop with mouse
    },

    extend: {
      // Additional spacing for trauma-informed design
      spacing: {
        // Touch target sizes
        'touch-sm': sanctuaryTokens.touchTargets.minimum,
        'touch-md': sanctuaryTokens.touchTargets.comfortable,
        'touch-lg': sanctuaryTokens.touchTargets.spacious,
        
        // Crisis-specific spacing
        'crisis-margin': '16px',
        'crisis-padding': '20px',
        'crisis-touch': '56px',
        
        // Sanctuary sections
        'sanctuary-section': '80px',
        'sanctuary-gap': '40px',
      },

      // Animation keyframes for gentle interactions
      keyframes: {
        // Gentle breathing animation for calming effect
        'sanctuary-breathe': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            opacity: '0.8' 
          },
          '50%': { 
            transform: 'scale(1.02)', 
            opacity: '1' 
          },
        },
        
        // Soft fade in for new content
        'sanctuary-fade-in': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(8px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        
        // Gentle slide up for modals
        'sanctuary-slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(16px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        
        // Subtle shimmer for loading states
        'sanctuary-shimmer': {
          '0%': { 
            backgroundPosition: '-200% 0' 
          },
          '100%': { 
            backgroundPosition: '200% 0' 
          },
        },
        
        // Gentle pulse for interactive elements
        'sanctuary-pulse': {
          '0%, 100%': { 
            opacity: '1' 
          },
          '50%': { 
            opacity: '0.85' 
          },
        },
        
        // Crisis attention animation (gentle but noticeable)
        'sanctuary-crisis-pulse': {
          '0%, 100%': { 
            backgroundColor: sanctuaryTokens.colors.crisis.background,
            transform: 'scale(1)' 
          },
          '50%': { 
            backgroundColor: sanctuaryTokens.colors.crisis.hover,
            transform: 'scale(1.01)' 
          },
        },
        
        // Float animation for decorative elements
        'sanctuary-float': {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-4px)' 
          },
        },
      },

      animation: {
        'sanctuary-breathe': 'sanctuary-breathe 4s ease-in-out infinite',
        'sanctuary-fade-in': 'sanctuary-fade-in 350ms cubic-bezier(0.23, 1, 0.32, 1)',
        'sanctuary-slide-up': 'sanctuary-slide-up 300ms cubic-bezier(0.23, 1, 0.32, 1)',
        'sanctuary-shimmer': 'sanctuary-shimmer 2s ease-in-out infinite',
        'sanctuary-pulse': 'sanctuary-pulse 2s ease-in-out infinite',
        'sanctuary-crisis-pulse': 'sanctuary-crisis-pulse 2s ease-in-out infinite',
        'sanctuary-float': 'sanctuary-float 6s ease-in-out infinite',
        
        // Speed variants for different contexts
        'fade-fast': 'sanctuary-fade-in 200ms cubic-bezier(0.23, 1, 0.32, 1)',
        'fade-slow': 'sanctuary-fade-in 500ms cubic-bezier(0.23, 1, 0.32, 1)',
      },

      // Gradient backgrounds using sage colors
      backgroundImage: {
        'sanctuary-gradient': `linear-gradient(135deg, ${sanctuaryTokens.colors.sage[50]} 0%, ${sanctuaryTokens.colors.sage[100]} 100%)`,
        'sanctuary-gradient-primary': `linear-gradient(135deg, ${sanctuaryTokens.colors.sage[300]} 0%, ${sanctuaryTokens.colors.sage[400]} 50%, ${sanctuaryTokens.colors.sage[500]} 100%)`,
        'sanctuary-gradient-deep': `linear-gradient(135deg, ${sanctuaryTokens.colors.sage[600]} 0%, ${sanctuaryTokens.colors.sage[700]} 100%)`,
        'professional-gradient': `linear-gradient(135deg, ${sanctuaryTokens.colors.professional[100]} 0%, ${sanctuaryTokens.colors.professional[200]} 100%)`,
        
        // Shimmer effect for loading states
        'sanctuary-shimmer': 'linear-gradient(90deg, transparent, rgba(164, 183, 146, 0.1), transparent)',
      },

      // Custom backdrop blur for modals
      backdropBlur: {
        'sanctuary': '12px',
      },

      // Custom backdrop brightness for overlays
      backdropBrightness: {
        'sanctuary': '0.95',
      },

      // Text decoration thickness for accessibility
      textDecorationThickness: {
        3: '3px',
        4: '4px',
      },

      // Text underline offset for readability
      textUnderlineOffset: {
        3: '3px',
        4: '4px',
      },

      // Outline styles for focus states
      outlineWidth: {
        3: '3px',
      },
      
      outlineOffset: {
        3: '3px',
      },

      // Ring styles for focus indicators
      ringWidth: {
        3: '3px',
      },
      
      ringOffsetWidth: {
        3: '3px',
      },
    },
  },
  
  plugins: [
    // Tailwind plugins for enhanced functionality
    require('@tailwindcss/forms')({
      strategy: 'class', // Use form classes rather than universal styling
    }),
    require('@tailwindcss/typography'),
    
    // Custom plugin for sanctuary-specific utilities
    function({ addUtilities, addComponents, theme }: any) {
      // Sanctuary button components
      addComponents({
        '.sanctuary-btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme('spacing.2'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          fontFamily: theme('fontFamily.sans').join(', '),
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.normal'),
          letterSpacing: theme('letterSpacing.wider'),
          lineHeight: '1',
          border: '1px solid transparent',
          borderRadius: theme('borderRadius.md'),
          cursor: 'pointer',
          transition: `all ${theme('transitionDuration.250')} ${theme('transitionTimingFunction.sanctuary')}`,
          textDecoration: 'none',
          outline: 'none',
          minHeight: theme('spacing.touch-md'),
          
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.sage.400')}`,
            outlineOffset: '2px',
          },
        },
        
        '.sanctuary-btn-primary': {
          backgroundColor: theme('colors.sage.400'),
          color: theme('colors.neutral.white'),
          borderColor: theme('colors.sage.400'),
          
          '&:hover': {
            backgroundColor: theme('colors.sage.500'),
            borderColor: theme('colors.sage.500'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.md'),
          },
        },
        
        '.sanctuary-btn-secondary': {
          backgroundColor: theme('colors.neutral.white'),
          color: theme('colors.sage.600'),
          borderColor: theme('colors.sage.300'),
          
          '&:hover': {
            backgroundColor: theme('colors.sage.50'),
            borderColor: theme('colors.sage.400'),
          },
        },
        
        '.sanctuary-btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.neutral.700'),
          borderColor: 'transparent',
          
          '&:hover': {
            backgroundColor: theme('colors.neutral.50'),
            color: theme('colors.neutral.800'),
          },
        },
        
        // Crisis-safe button variant
        '.sanctuary-btn-crisis': {
          backgroundColor: theme('colors.crisis.background'),
          color: theme('colors.crisis.text'),
          borderColor: theme('colors.crisis.border'),
          
          '&:hover': {
            backgroundColor: theme('colors.crisis.border'),
            color: theme('colors.neutral.white'),
          },
        },
      });
      
      // Sanctuary input components
      addComponents({
        '.sanctuary-input': {
          width: '100%',
          padding: `${theme('spacing.3')} ${theme('spacing.4')}`,
          fontFamily: theme('fontFamily.sans').join(', '),
          fontSize: theme('fontSize.sm')[0],
          lineHeight: theme('lineHeight.normal'),
          color: theme('colors.neutral.800'),
          backgroundColor: theme('colors.neutral.white'),
          border: `1px solid ${theme('colors.neutral.300')}`,
          borderRadius: theme('borderRadius.md'),
          transition: `all ${theme('transitionDuration.250')} ${theme('transitionTimingFunction.out')}`,
          minHeight: theme('spacing.touch-md'),
          
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.sage.400'),
            boxShadow: `0 0 0 3px ${theme('colors.sage.100')}`,
          },
          
          '&::placeholder': {
            color: theme('colors.neutral.500'),
            letterSpacing: theme('letterSpacing.normal'),
          },
        },
      });
      
      // Sanctuary card components
      addComponents({
        '.sanctuary-card': {
          backgroundColor: theme('colors.neutral.white'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.sanctuary'),
          transition: `all ${theme('transitionDuration.250')} ${theme('transitionTimingFunction.sanctuary')}`,
          
          '&:hover': {
            boxShadow: theme('boxShadow.lg'),
            transform: 'translateY(-1px)',
          },
        },
      });
      
      // Utility classes for trauma-informed design
      addUtilities({
        // Touch-friendly sizing
        '.touch-target-sm': {
          minWidth: theme('spacing.touch-sm'),
          minHeight: theme('spacing.touch-sm'),
        },
        '.touch-target': {
          minWidth: theme('spacing.touch-md'),
          minHeight: theme('spacing.touch-md'),
        },
        '.touch-target-lg': {
          minWidth: theme('spacing.touch-lg'),
          minHeight: theme('spacing.touch-lg'),
        },
        
        // Sanctuary typography classes
        '.sanctuary-heading': {
          fontSize: theme('fontSize.2xl')[0],
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('lineHeight.normal'),
          letterSpacing: theme('letterSpacing.wide'),
          color: theme('colors.neutral.800'),
        },
        
        '.sanctuary-subheading': {
          fontSize: theme('fontSize.lg')[0],
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('lineHeight.relaxed'),
          letterSpacing: theme('letterSpacing.wider'),
          color: theme('colors.neutral.700'),
        },
        
        '.sanctuary-body': {
          fontSize: theme('fontSize.sm')[0],
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('lineHeight.loose'),
          letterSpacing: theme('letterSpacing.normal'),
          color: theme('colors.neutral.700'),
        },
        
        // Reduced motion utilities
        '.sanctuary-no-motion': {
          animation: 'none !important',
          transition: 'none !important',
        },
        
        // High contrast utilities for accessibility
        '.sanctuary-high-contrast': {
          filter: 'contrast(1.2)',
        },
      });
    },
  ],
  
  // Dark mode configuration (if needed in future)
  darkMode: 'class',
  
  // Important selector for overriding other styles when necessary
  important: false,
};

export default sanctuaryConfig;