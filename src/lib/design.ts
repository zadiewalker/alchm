import type React from 'react';

export const DESIGN = {
  colors: {
    bgDeep: '#1a1f16',
    bgSurface: '#242b1e',
    bgElevated: '#2d3527',
    bgWarm: '#2a2520',
    sageMuted: '#6b7a5e',
    sage: '#8B9A7C',
    sageLight: '#A8B5A0',
    sageBright: '#c2d1b8',
    goldDim: '#b89d4a',
    gold: '#E8C56D',
    goldBright: '#f5dfa0',
    textPrimary: 'rgba(255, 255, 255, 0.92)',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textMuted: 'rgba(255, 255, 255, 0.40)',
    textKhepera: '#E8C56D',
    error: '#c47a6a',
    success: '#8ba88a',
    border: 'rgba(255, 255, 255, 0.10)',
    borderLight: 'rgba(255, 255, 255, 0.06)',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBgHover: 'rgba(255, 255, 255, 0.10)',
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
  backgroundColor: elevated ? DESIGN.colors.bgElevated : DESIGN.colors.cardBg,
  borderRadius: DESIGN.radius.lg,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: DESIGN.spacing.lg,
  boxShadow: elevated ? DESIGN.shadows.card : 'none',
  transition: DESIGN.transitions.normal,
});

export const pageContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: `linear-gradient(to bottom, ${DESIGN.colors.sage}, ${DESIGN.colors.sageLight})`,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  paddingLeft: DESIGN.spacing.pagePadding,
  paddingRight: DESIGN.spacing.pagePadding,
  paddingBottom: DESIGN.spacing.safeBottom,
};
