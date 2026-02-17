'use client';

import React from 'react';
import { ErrorState } from '@/components/ErrorState';
import { TypewriterText } from '@/components/TypewriterText';
import { DESIGN } from '@/lib/design';

export function NewEntryReflection(props: {
  visible: boolean;
  isReflecting: boolean;
  reflection: string;
  reflectionError: string;
  onReflect: () => void;
}) {
  if (!props.visible) return null;

  return (
    <div style={{ marginTop: '18px' }}>
      <div style={{ fontSize: '14px', fontWeight: DESIGN.typography.weights.semibold }}>Khepera</div>
      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={props.onReflect}
          aria-label="Request a Khepera reflection"
          disabled={props.isReflecting}
          style={{
            minHeight: '44px',
            padding: '10px 14px',
            borderRadius: DESIGN.radius.full,
            border: `1px solid rgba(232, 197, 109, 0.30)`,
            backgroundColor: 'rgba(232, 197, 109, 0.10)',
            color: DESIGN.colors.textPrimary,
            fontFamily: DESIGN.typography.sansSerif,
            cursor: props.isReflecting ? 'default' : 'pointer',
            opacity: props.isReflecting ? 0.7 : 1,
          }}
        >
          {props.isReflecting ? 'Reflecting…' : 'Reflect'}
        </button>
      </div>

      {props.reflectionError ? (
        <div style={{ marginTop: '12px' }}>
          <ErrorState title="Khepera couldn't reflect" message={props.reflectionError} />
        </div>
      ) : null}
      {props.reflection ? (
        <div
          style={{
            marginTop: '12px',
            backgroundColor: 'rgba(232, 197, 109, 0.06)',
            border: `1px solid rgba(232, 197, 109, 0.18)`,
            borderRadius: DESIGN.radius.lg,
            padding: '14px',
          }}
        >
          <TypewriterText text={props.reflection} />
        </div>
      ) : null}
    </div>
  );
}

