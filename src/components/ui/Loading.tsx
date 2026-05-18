'use client';

import { DESIGN } from '@/lib/design';

interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ message = "Loading...", size = 'md' }: LoadingProps) {
  const iconSize = size === 'lg' ? 'w-12 h-12' : size === 'md' ? 'w-8 h-8' : 'w-6 h-6';
  const containerSize = size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-12 h-12' : 'w-8 h-8';
  
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${containerSize} rounded-full flex items-center justify-center animate-pulse`}
        style={{
          background: DESIGN.colors.cardBg,
          border: `1px solid ${DESIGN.colors.borderLight}`,
        }}
      >
        <svg viewBox="0 0 100 100" className={`${iconSize} animate-spin`} style={{ animationDuration: '3s', color: DESIGN.colors.textPrimary }}>
          <circle cx="50" cy="15" r="8" fill="currentColor" fillOpacity="0.86" />
          
          <circle cx="50" cy="28" r="5" fill="currentColor" fillOpacity="0.7" />
          
          <ellipse cx="50" cy="55" rx="16" ry="24" fill="currentColor" fillOpacity="0.7" />
          
          <line x1="37" y1="42" x2="63" y2="42" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="36" y1="50" x2="64" y2="50" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="36" y1="58" x2="64" y2="58" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
          <line x1="37" y1="66" x2="63" y2="66" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" />
          
          <path d="M34 48 Q18 40 22 60 Q24 70 34 65 Z" fill="currentColor" fillOpacity="0.7" />
          <path d="M66 48 Q82 40 78 60 Q76 70 66 65 Z" fill="currentColor" fillOpacity="0.7" />
        </svg>
      </div>
      
      {message && (
        <p style={{ color: DESIGN.colors.textSecondary, fontFamily: DESIGN.typography.sansSerif, fontSize: DESIGN.typography.sizes.sm, textAlign: 'center' }}>{message}</p>
      )}
    </div>
  );
}
