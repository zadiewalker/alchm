'use client'

import { DESIGN } from '@/lib/design'

export default function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: DESIGN.colors.bgSurface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          className="animate-pulse"
          style={{
            width: 64,
            height: 64,
            borderRadius: DESIGN.radius.full,
            background: DESIGN.colors.cardBg,
            border: `1px solid ${DESIGN.colors.borderLight}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${DESIGN.spacing.md}`,
          }}
        >
          {/* Khepera icon */}
          <svg viewBox="0 0 100 100" style={{ width: 32, height: 32, color: DESIGN.colors.textPrimary }}>
            <circle cx="50" cy="12" r="8" fill="currentColor" fillOpacity="0.9" />
            <circle cx="50" cy="26" r="5" fill="currentColor" fillOpacity="0.85" />
            <ellipse cx="50" cy="55" rx="15" ry="23" fill="currentColor" fillOpacity="0.85" />
            <path d="M35 48 Q18 42 22 62 Q24 70 35 65 Z" fill="currentColor" fillOpacity="0.8" />
            <path d="M65 48 Q82 42 78 62 Q76 70 65 65 Z" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </div>
        <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm }}>
          Loading ALCHM...
        </p>
      </div>
    </div>
  )
}
