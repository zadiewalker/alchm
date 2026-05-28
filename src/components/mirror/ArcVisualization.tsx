'use client';

import { useState } from 'react';
import { DESIGN } from '@/utils/design';
import type { ArcVisualizationProps } from '@/types/mirror';

const TONE_COLORS = {
  anxiety: 'var(--text-secondary)',
  grief: 'var(--text-secondary)',
  processing: 'var(--surface-elevated)',
  clarity: 'var(--text-secondary)',
  numbness: 'var(--surface-color)',
  tenderness: 'var(--text-secondary)',
  anger: 'var(--surface-elevated)',
  ambivalence: 'var(--text-secondary)',
} as const;

const TONE_SIZES = {
  anxiety: { width: 18, height: 24 },
  grief: { width: 20, height: 26 },
  processing: { width: 16, height: 22 },
  clarity: { width: 22, height: 28 },
  numbness: { width: 14, height: 20 },
  tenderness: { width: 24, height: 30 },
  anger: { width: 20, height: 26 },
  ambivalence: { width: 16, height: 22 },
} as const;

const TONE_OPACITIES = {
  anxiety: 0.7,
  grief: 0.8,
  processing: 0.6,
  clarity: 0.9,
  numbness: 0.4,
  tenderness: 0.85,
  anger: 0.75,
  ambivalence: 0.55,
} as const;

export function ArcVisualization({ arc, className }: ArcVisualizationProps): React.JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!arc.length) {
    return (
      <div style={emptyStateStyle} className={className}>
        Arc emerges with more writing
      </div>
    );
  }

  const maxPoints = 10;
  const displayArc = arc.slice(-maxPoints);

  return (
    <div style={containerStyle} className={className}>
      {displayArc.map((point, index) => {
        const tone = point.tone as keyof typeof TONE_COLORS;
        const color = TONE_COLORS[tone] || TONE_COLORS.processing;
        const size = TONE_SIZES[tone] || TONE_SIZES.processing;
        const opacity = TONE_OPACITIES[tone] || TONE_OPACITIES.processing;
        const isSelected = selectedIndex === index;

        return (
          <button
            className="btn-icon"
            key={`${point.sessionDate.getTime()}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(isSelected ? null : index)}
            style={{
              background: 'transparent',
              padding: 0,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: Math.max(size.width, 44),
              height: 60,
            }}
            aria-label={`Session ${index + 1}`}
          >
            <div
              style={{
                width: size.width,
                height: size.height,
                borderRadius: '50%',
                backgroundColor: color,
                opacity: isSelected ? 1 : opacity,
                transform: isSelected ? 'translateY(-0.5px)' : 'translateY(0)',
                transition: [
                  'opacity var(--motion-normal) var(--motion-easing)',
                  'transform var(--motion-normal) var(--motion-easing)',
                  'box-shadow var(--motion-normal) var(--motion-easing)',
                ].join(', '),
                boxShadow: isSelected ? '0 0 0 2px var(--accent-primary)' : 'none',
              }}
            />
            {isSelected && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -32,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--surface-color)',
                  border: '1px solid var(--border-divider)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 'var(--space-1) var(--space-2)',
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                }}
              >
                {tone}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  padding: '0 var(--space-4)',
  height: 60,
};

const emptyStateStyle: React.CSSProperties = {
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-family-body)',
  fontSize: 'var(--font-size-sm)',
};
