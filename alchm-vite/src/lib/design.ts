import type React from 'react';

export const DESIGN = {
  colors: {
    // Sanctuary palette (no pure black / near-black backgrounds).
    bgDeep: '#2D332A', // sanctuary
    bgElevated: '#343B30',
    bgSurface: '#3B4236',
    bgHover: '#434A3D',

    // Sage spectrum (core brand).
    sage50: '#F0F3ED',
    sage100: '#DDE4D6',
    sage200: '#C1CCBA',
    sage300: '#A4B494',
    sage400: '#8B9A7C',
    sage500: '#6B7A5E',
    sage600: '#4E5A44',

    // Kept for backward compatibility across existing components.
    sageMuted: '#6B7A5E',
    sage: '#8B9A7C', // core sage
    sageLight: '#A8B5A0', // splash gradient (protected in CLAUDE.md)
    sageBright: '#C1CCBA',

    // Gold / amber
    gold: '#E8C87A',
    goldBright: '#F0D99A',
    goldDim: '#BFA65A',

    // Text (warm cream, not pure white).
    textPrimary: '#E8E4DC',
    textSecondary: '#A4A08C',
    textMuted: '#7A7768',
    textInverse: '#2D332A',
    textKhepera: '#E8C87A',

    // Functional
    crisis: '#D4A843',
    error: '#C47A6B',
    success: '#7A9A6B',
    warning: '#D4A843',

    // Borders (sage-based)
    border: 'rgba(164, 180, 148, 0.25)',
    borderLight: 'rgba(164, 180, 148, 0.12)',
    borderStrong: 'rgba(164, 180, 148, 0.40)',
    borderGold: 'rgba(232, 200, 122, 0.50)',

    // Surfaces
    cardBg: '#343B30',
    cardBgHover: '#434A3D',
  },
  gradients: {
    sanctuary: 'linear-gradient(180deg, #4E5A44 0%, #3B4236 120px, #2D332A 300px)',
    onboarding: 'linear-gradient(180deg, #4E5A44 0%, #2D332A 60%)',
    dashboardHeader: 'linear-gradient(180deg, #4E5A44 0%, #3B4236 100%)',
    cardWarm: 'linear-gradient(180deg, #3B4236 0%, #343B30 100%)',
    splash: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
  },
  typography: {
    sansSerif: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
    serif: "'New York', 'Georgia', serif",
    sizes: {
      xs: '11px',
      sm: '13px',
      base: '16px',
      lg: '18px',
      xl: '22px',
      xxl: '28px',
      display: '36px',
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    pagePadding: '20px',
    safeBottom: '100px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    card: '0 2px 12px rgba(0, 0, 0, 0.3)',
    elevated: '0 8px 32px rgba(0, 0, 0, 0.4)',
    glow: '0 0 20px rgba(232, 197, 109, 0.15)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease-out',
  },
} as const;

export const cardStyle = (elevated = false): React.CSSProperties => ({
  background: elevated ? DESIGN.gradients.cardWarm : DESIGN.colors.cardBg,
  borderRadius: DESIGN.radius.lg,
  border: `1px solid ${elevated ? DESIGN.colors.borderGold : DESIGN.colors.borderLight}`,
  padding: DESIGN.spacing.lg,
  boxShadow: elevated ? DESIGN.shadows.glow : 'none',
  transition: DESIGN.transitions.normal,
});

export const pageContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: DESIGN.gradients.sanctuary,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  paddingLeft: DESIGN.spacing.pagePadding,
  paddingRight: DESIGN.spacing.pagePadding,
  paddingBottom: DESIGN.spacing.safeBottom,
};
