'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';

export function CrisisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Crisis support resources"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '20px',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
        fontFamily: DESIGN.typography.sansSerif,
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: DESIGN.colors.bgSurface,
          borderRadius: DESIGN.radius.xl,
          border: `1px solid ${DESIGN.colors.border}`,
          padding: '18px',
          boxShadow: DESIGN.shadows.elevated,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold, color: DESIGN.colors.textPrimary }}>
            Crisis Support
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close crisis resources"
            style={{
              border: 'none',
              background: 'transparent',
              color: DESIGN.colors.textSecondary,
              fontSize: '15px',
              padding: '8px 10px',
              cursor: 'pointer',
              minHeight: '44px',
            }}
          >
            Close
          </button>
        </div>

        <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
          If you are in immediate danger, call emergency services. If you are in the US, you can call or text 988.
        </div>

        <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a
            href="tel:988"
            aria-label="Call 988 Suicide and Crisis Lifeline"
            style={{
              textDecoration: 'none',
              color: DESIGN.colors.textPrimary,
              backgroundColor: DESIGN.colors.cardBg,
              border: `1px solid ${DESIGN.colors.border}`,
              borderRadius: DESIGN.radius.lg,
              padding: '14px',
              minHeight: '44px',
            }}
          >
            <div style={{ fontWeight: DESIGN.typography.weights.semibold }}>Call or Text 988</div>
            <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, marginTop: '2px' }}>
              Suicide &amp; Crisis Lifeline (US)
            </div>
          </a>

          <a
            href="sms:741741&body=HOME"
            aria-label="Text HOME to 741741 Crisis Text Line"
            style={{
              textDecoration: 'none',
              color: DESIGN.colors.textPrimary,
              backgroundColor: DESIGN.colors.cardBg,
              border: `1px solid ${DESIGN.colors.border}`,
              borderRadius: DESIGN.radius.lg,
              padding: '14px',
              minHeight: '44px',
            }}
          >
            <div style={{ fontWeight: DESIGN.typography.weights.semibold }}>Text HOME to 741741</div>
            <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, marginTop: '2px' }}>
              Crisis Text Line (US)
            </div>
          </a>

          <a
            href="https://findahelpline.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Find a helpline in your country"
            style={{
              textDecoration: 'none',
              color: DESIGN.colors.textPrimary,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: `1px solid ${DESIGN.colors.borderLight}`,
              borderRadius: DESIGN.radius.lg,
              padding: '14px',
              minHeight: '44px',
            }}
          >
            <div style={{ fontWeight: DESIGN.typography.weights.semibold }}>Outside the US?</div>
            <div style={{ fontSize: '12px', color: DESIGN.colors.textMuted, marginTop: '2px' }}>Find local crisis support</div>
          </a>
        </div>
      </div>
    </div>
  );
}

