import type React from 'react';

export const DESIGN = {
  colors: {
    primary: '#A4B792',
    bgDeep: '#6B7A5C',
    bgSurface: '#6B7A5C',
    bgElevated: '#8B9A7C',
    bgWarm: '#6B7A5C',
    sageMuted: '#6B7A5C',
    sage: '#8b9a7c',
    sageLight: '#A4B792',
    sageBright: '#F2D99D',
    goldDim: '#A4B792',
    gold: '#A4B792',
    goldBright: '#E5C97D',
    textPrimary: '#F2D99D',
    textSecondary: 'rgba(255,255,255,0.8)',
    textMuted: 'rgba(255,255,255,0.8)',
    textKhepera: '#F2D99D',
    error: '#B91C1C',
    success: '#A4B792',
    border: 'color-mix(in srgb, #A4B792 42%, transparent)',
    borderLight: 'color-mix(in srgb, #A4B792 28%, transparent)',
    cardBg: 'color-mix(in srgb, #A4B792 18%, transparent)',
    cardBgHover: 'color-mix(in srgb, #A4B792 28%, transparent)',
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
    card: '0 24px 70px color-mix(in srgb, #A4B792 22%, transparent)',
    elevated: '0 34px 110px color-mix(in srgb, #A4B792 28%, transparent)',
    glow: '0 0 28px color-mix(in srgb, #A4B792 28%, transparent)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '400ms ease-out',
  },
} as const;

export const cardStyle = (elevated = false): React.CSSProperties => ({
  background: elevated
    ? 'linear-gradient(180deg, color-mix(in srgb, #A4B792 28%, transparent), color-mix(in srgb, #A4B792 16%, transparent))'
    : 'linear-gradient(180deg, color-mix(in srgb, #A4B792 18%, transparent), rgba(255,255,255,0.1))',
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
