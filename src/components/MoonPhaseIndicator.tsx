'use client';

import { useState } from 'react';
import { DESIGN } from '@/utils/design';
import type { MoonPhaseIndicatorProps } from '@/types/components';

export function MoonPhaseIndicator({ 
  phase, 
  metaphorText, 
  size = 20,
  style = {} 
}: MoonPhaseIndicatorProps): React.JSX.Element {
  const [showMetaphor, setShowMetaphor] = useState(false);

  const moonColor = 'var(--text-primary)';
  const opacity = 0.6;

  const getMoonPath = () => {
    const radius = size / 2 - 2;
    const cx = size / 2;
    const cy = size / 2;

    switch (phase) {
      case 'new_moon':
        return `M ${cx},${cy} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
      
      case 'waxing':
        return `M ${cx},${cy} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius / 2},${radius} 0 1,1 -${radius * 2},0`;
      
      case 'full_moon':
        return `M ${cx},${cy} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
      
      case 'waning':
        return `M ${cx},${cy} m -${radius},0 a ${radius / 2},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`;
      
      default:
        return `M ${cx},${cy} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
  };

  const getFillOpacity = () => {
    switch (phase) {
      case 'new_moon': return 0.1;
      case 'waxing': return 0.5;
      case 'full_moon': return 0.9;
      case 'waning': return 0.3;
      default: return 0.1;
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        onClick={() => setShowMetaphor(!showMetaphor)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          opacity,
          transition: DESIGN.transitions.fast,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.8';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = opacity.toString();
        }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <path
            d={getMoonPath()}
            fill={moonColor}
            fillOpacity={getFillOpacity()}
            stroke={moonColor}
            strokeWidth={1}
            strokeOpacity={0.4}
          />
        </svg>
      </button>

      {showMetaphor && (
        <div
          style={{
            position: 'absolute',
            top: size + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-divider)',
            borderRadius: DESIGN.radius.sm,
            padding: `${DESIGN.spacing.xs} ${DESIGN.spacing.sm}`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: DESIGN.shadows.card,
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              color: DESIGN.colors.onDark,
              fontSize: '11px',
              fontFamily: DESIGN.typography.sansSerif,
              fontStyle: 'italic',
              opacity: 0.9,
            }}
          >
            {metaphorText}
          </span>
          
          {/* Small triangle pointer */}
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderBottom: '4px solid var(--surface-elevated)',
            }}
          />
        </div>
      )}
    </div>
  );
}
