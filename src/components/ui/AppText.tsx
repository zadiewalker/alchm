'use client';

import type React from 'react';
import type { AppTextProps } from '@/types/ui';

const VARIANT_STYLES: Record<NonNullable<AppTextProps['variant']>, React.CSSProperties> = {
  display: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-3xl)',
    lineHeight: '1.12',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
    letterSpacing: 0,
    textWrap: 'balance',
  },
  title: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--text-title)',
    lineHeight: '1.12',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
    letterSpacing: 0,
    textWrap: 'balance',
  },
  label: {
    fontFamily: 'var(--font-family-body)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 'var(--line-height-base)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-secondary)',
  },
  whisper: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '13px',
    lineHeight: '1.4',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-secondary)',
  },
  h1: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--text-title)',
    lineHeight: '1.12',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
    letterSpacing: 0,
  },
  h2: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-xl)',
    lineHeight: '1.2',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
    letterSpacing: 0,
  },
  h3: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-lg)',
    lineHeight: '1.2',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--text-primary)',
  },
  body: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '17px',
    lineHeight: '1.5',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-primary)',
  },
  secondary: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '15px',
    lineHeight: '1.45',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-secondary)',
  },
  caption: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '13px',
    lineHeight: '1.4',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-secondary)',
  },
  muted: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '13px',
    lineHeight: '1.4',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-secondary)',
  },
  subtle: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '13px',
    lineHeight: '1.4',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--text-secondary)',
  },
  khepera: {
    fontFamily: 'var(--font-family-khepera)',
    fontSize: '19px',
    lineHeight: '1.68',
    fontWeight: 'var(--font-weight-regular)',
    letterSpacing: 0,
    color: 'var(--khepera-reflection-text)',
  },
  kheperaWitness: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '18px',
    lineHeight: '1.68',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--khepera-reflection-text)',
  },
  kheperaPerspective: {
    fontFamily: 'var(--font-family-body)',
    fontSize: '18px',
    lineHeight: '1.68',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--khepera-perspective-text)',
  },
  kheperaSeed: {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--text-seed)',
    lineHeight: '1.45',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--khepera-seed-text)',
    letterSpacing: 0,
  },
};

export function AppText({ variant = 'body', children, style, as: Tag, className }: AppTextProps): React.JSX.Element {
  // Use semantic HTML tags by default based on variant
  const defaultTag = 
    variant === 'display' ? 'h1' :
    variant === 'title' ? 'h1' :
    variant === 'label' ? 'p' :
    variant === 'whisper' ? 'p' :
    variant === 'h1' ? 'h1' :
    variant === 'h2' ? 'h2' :
    variant === 'h3' ? 'h3' :
    'p';

  const Component = Tag || defaultTag;
  
  // Map variants to CSS classes
  const variantClass = variant === 'display' ? 'text-display' :
                      variant === 'title' ? 'text-title' :
                      variant === 'label' ? 'text-label' :
                      variant === 'whisper' ? 'text-whisper' :
                      variant === 'h1' ? 'text-h1' :
                      variant === 'h2' ? 'text-h2' :
                      variant === 'h3' ? 'text-h3' :
                      variant === 'body' ? 'text-body' :
                      variant === 'secondary' ? 'text-secondary' :
                      variant === 'caption' ? 'text-caption' :
                      variant === 'muted' ? 'text-muted' :
                      variant === 'subtle' ? 'text-subtle' :
                      variant === 'kheperaWitness' ? 'text-khepera-witness' :
                      variant === 'kheperaPerspective' ? 'text-khepera-perspective' :
                      variant === 'kheperaSeed' ? 'text-khepera-seed' :
                      variant === 'khepera' ? 'text-khepera' :
                      'text-body';

  const combinedClassName = [variantClass, className].filter(Boolean).join(' ');

  return (
    <Component 
      className={combinedClassName}
      style={{ margin: 0, ...VARIANT_STYLES[variant], ...style }}
    >
      {children}
    </Component>
  );
}
