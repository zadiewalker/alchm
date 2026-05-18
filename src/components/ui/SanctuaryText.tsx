'use client';

import type React from 'react';
import { DESIGN } from '@/lib/design';

type TextVariant = 'display' | 'title' | 'body' | 'caption' | 'muted' | 'khepera';

interface SanctuaryTextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

const variantStyles: Record<TextVariant, React.CSSProperties> = {
  display: {
    fontSize: DESIGN.typography.sizes.display,
    fontWeight: DESIGN.typography.weights.light,
    color: DESIGN.colors.textPrimary,
    lineHeight: DESIGN.typography.lineHeights.tight,
    fontFamily: DESIGN.typography.serif,
  },
  title: {
    fontSize: DESIGN.typography.sizes.xl,
    fontWeight: DESIGN.typography.weights.light,
    color: DESIGN.colors.textPrimary,
    lineHeight: DESIGN.typography.lineHeights.normal,
    fontFamily: DESIGN.typography.serif,
  },
  body: {
    fontSize: DESIGN.typography.sizes.base,
    fontWeight: DESIGN.typography.weights.regular,
    color: DESIGN.colors.textPrimary,
    lineHeight: DESIGN.typography.lineHeights.relaxed,
  },
  caption: {
    fontSize: DESIGN.typography.sizes.sm,
    color: DESIGN.colors.textSecondary,
    lineHeight: DESIGN.typography.lineHeights.normal,
  },
  muted: {
    fontSize: DESIGN.typography.sizes.sm,
    color: DESIGN.colors.textMuted,
    lineHeight: DESIGN.typography.lineHeights.normal,
  },
  khepera: {
    fontSize: DESIGN.typography.sizes.sm,
    color: DESIGN.colors.textKhepera,
    lineHeight: DESIGN.typography.lineHeights.normal,
    fontFamily: DESIGN.typography.serif,
  },
};

export function SanctuaryText({ variant = 'body', children, style, as: Tag = 'p' }: SanctuaryTextProps) {
  return <Tag style={{ fontFamily: DESIGN.typography.sansSerif, margin: 0, ...variantStyles[variant], ...style }}>{children}</Tag>;
}
