import type React from 'react';

export const DESIGN = {
  colors: {
    bgDeep: '#1f2a1b',
    bgSurface: '#2d3a25',
    bgElevated: '#5e6f4e',
    bgWarm: '#2d3a25',
    sageMuted: '#445339',
    sage: '#8b9a7c',
    sageLight: '#a8b993',
    sageBright: '#f3e7c8',
    goldDim: '#b9974e',
    gold: '#b9974e',
    goldBright: '#c7a967',
    textPrimary: '#fff3d6',
    textSecondary: 'rgba(243, 231, 200, 0.78)',
    textMuted: 'rgba(168, 185, 147, 0.72)',
    textKhepera: '#f3e7c8',
    error: '#c47a6a',
    success: '#8ba88a',
    border: 'rgba(185, 151, 78, 0.22)',
    borderLight: 'rgba(185, 151, 78, 0.16)',
    cardBg: 'rgba(68, 83, 57, 0.72)',
    cardBgHover: 'rgba(94, 111, 78, 0.82)',
  },
  typography: {
    sansSerif: "var(--font-family-body), -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
    serif: "var(--font-family-heading), 'Georgia', serif",
    sizes: {
      xs: '11px',
      sm: '13px',
      base: '16px',
      lg: '18px',
      xl: '22px',
      xxl: '28px',
      display: 'clamp(52px, 12vw, 96px)',
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
    lg: '28px 28px 10px 10px',
    xl: '44px 44px 12px 12px',
    full: '9999px',
  },
  shadows: {
    card: '0 24px 70px rgba(31, 42, 27, 0.24)',
    elevated: '0 34px 110px rgba(31, 42, 27, 0.32)',
    glow: '0 0 28px rgba(185, 151, 78, 0.14)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease-out',
  },
} as const;

export const cardStyle = (elevated = false): React.CSSProperties => ({
  background: elevated
    ? 'linear-gradient(180deg, rgba(168,185,147,0.2), rgba(68,83,57,0.68))'
    : 'linear-gradient(180deg, rgba(168,185,147,0.13), rgba(45,58,37,0.72))',
  borderRadius: DESIGN.radius.lg,
  border: `1px solid ${DESIGN.colors.border}`,
  padding: DESIGN.spacing.lg,
  boxShadow: elevated ? DESIGN.shadows.card : 'none',
  transition: DESIGN.transitions.normal,
});

export const pageContainerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: `linear-gradient(to bottom, ${DESIGN.colors.bgDeep}, ${DESIGN.colors.bgSurface})`,
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  paddingLeft: DESIGN.spacing.pagePadding,
  paddingRight: DESIGN.spacing.pagePadding,
  paddingBottom: DESIGN.spacing.safeBottom,
};
