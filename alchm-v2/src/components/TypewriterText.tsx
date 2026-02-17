'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DESIGN } from '@/lib/design';

export function TypewriterText({
  text,
  speedCps = 55,
  onComplete,
}: {
  text: string;
  speedCps?: number;
  onComplete?: () => void;
}) {
  const safeText = useMemo(() => (text || '').trim(), [text]);
  const [visible, setVisible] = useState('');

  useEffect(() => {
    if (!safeText) return;
    let raf = 0;
    let idx = 0;
    let last = 0;

    const baseDelay = 1000 / Math.max(10, speedCps);

    const charDelay = (ch: string) => {
      if ('.!?'.includes(ch)) return baseDelay * 6;
      if (',;:'.includes(ch)) return baseDelay * 3;
      if (ch === ' ') return baseDelay * 1.5;
      return baseDelay;
    };

    let nextDelay = baseDelay;

    const tick = (t: number) => {
      if (!last) last = t;
      const elapsed = t - last;
      if (elapsed >= nextDelay) {
        if (idx < safeText.length) {
          const ch = safeText[idx] || '';
          idx += 1;
          setVisible(safeText.slice(0, idx));
          nextDelay = charDelay(ch);
          last = t;
          raf = requestAnimationFrame(tick);
        } else {
          onComplete?.();
        }
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    setVisible('');
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [safeText, speedCps, onComplete]);

  if (!safeText) return null;

  return (
    <div
      aria-label="Khepera reflection"
      style={{
        fontFamily: DESIGN.typography.sansSerif,
        fontSize: '14px',
        lineHeight: 1.7,
        color: DESIGN.colors.textSecondary,
        whiteSpace: 'pre-wrap',
      }}
    >
      {visible}
    </div>
  );
}

