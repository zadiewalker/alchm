'use client';

import React from 'react';
import { DESIGN } from '@/lib/design';

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '28px 20px',
        fontFamily: DESIGN.typography.sansSerif,
      }}
    >
      <div style={{ fontSize: '16px', fontWeight: DESIGN.typography.weights.semibold, color: DESIGN.colors.textPrimary }}>
        {title}
      </div>
      <div style={{ marginTop: '10px', fontSize: '13px', color: DESIGN.colors.textSecondary, lineHeight: 1.6 }}>
        {message}
      </div>
      {action ? <div style={{ marginTop: '16px' }}>{action}</div> : null}
    </div>
  );
}

