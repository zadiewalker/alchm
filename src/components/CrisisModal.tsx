'use client';

import type React from 'react';
import { DESIGN } from '@/lib/design';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: DESIGN.spacing.lg,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: DESIGN.radius.xl,
          background: DESIGN.colors.bgElevated,
          border: `1px solid ${DESIGN.colors.border}`,
          padding: DESIGN.spacing.lg,
          color: DESIGN.colors.textPrimary,
          fontFamily: DESIGN.typography.sansSerif,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: DESIGN.spacing.md }}>
          <h2 style={{ margin: 0, fontWeight: DESIGN.typography.weights.medium, fontSize: DESIGN.typography.sizes.lg }}>You're not alone.</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: DESIGN.radius.full,
              border: `1px solid ${DESIGN.colors.border}`,
              background: 'transparent',
              color: DESIGN.colors.textPrimary,
              fontFamily: DESIGN.typography.sansSerif,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'grid', gap: DESIGN.spacing.sm }}>
          <a href="tel:988" style={ctaStyle}>Call 988</a>
          <a href="sms:988" style={ctaStyle}>Text 988</a>
          <a href="sms:741741&body=HOME" style={ctaStyle}>Text HOME to 741741</a>
          <a href="https://www.iasp.info/crisis-centres-helplines/" target="_blank" rel="noreferrer" style={linkStyle}>
            International crisis resources
          </a>
        </div>

        <p style={{ marginTop: DESIGN.spacing.md, color: DESIGN.colors.textSecondary, fontSize: DESIGN.typography.sizes.sm }}>
          These services are free, confidential, and available 24/7.
        </p>
      </div>
    </div>
  );
}

const ctaStyle: React.CSSProperties = {
  display: 'block',
  textAlign: 'center',
  textDecoration: 'none',
  padding: '12px 14px',
  borderRadius: DESIGN.radius.md,
  border: `1px solid ${DESIGN.colors.goldDim}`,
  background: 'rgba(232, 197, 109, 0.12)',
  color: DESIGN.colors.textPrimary,
  fontFamily: DESIGN.typography.sansSerif,
  minHeight: '44px',
};

const linkStyle: React.CSSProperties = {
  ...ctaStyle,
  border: `1px solid ${DESIGN.colors.border}`,
  background: DESIGN.colors.cardBg,
};
