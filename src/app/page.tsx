'use client';

import Link from 'next/link';

// Force static generation
export const dynamic = 'force-static';
export const revalidate = false;

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col items-center justify-center px-8 relative">
      {/* Faint organic texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />
      
      {/* Main content group — pushed slightly above center */}
      <div className="flex flex-col items-center -mt-16">
        {/* Scarab icon */}
        <div className="mb-8">
          <svg
            viewBox="0 0 64 80"
            xmlns="http://www.w3.org/2000/svg"
            className="w-14 h-[72px]"
            aria-label="Khepera scarab"
          >
            {/* ===== SUN DISK — soft muted gold circle ===== */}
            <circle cx="32" cy="6" r="5.5" fill="#E8C56D" />

            {/* ===== HEAD — dome/bell shape, NOT a circle ===== */}
            <path
              d="M26,22 Q26,13 32,12 Q38,13 38,22 Z"
              fill="#EAE5D9"
            />

            {/* ===== ANTENNAE — two thin curved lines ===== */}
            <path d="M28,15 Q24,8 22,6" stroke="#EAE5D9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M36,15 Q40,8 42,6" stroke="#EAE5D9" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* ===== LEFT WING — small rounded lobe at upper-side of body ===== */}
            <ellipse cx="12" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />

            {/* ===== RIGHT WING — mirror of left ===== */}
            <ellipse cx="52" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />

            {/* ===== CENTRAL BODY / ABDOMEN — large dominant vertical oval ===== */}
            <ellipse cx="32" cy="44" rx="14" ry="24" fill="#EAE5D9" />

            {/* ===== BODY SEGMENT LINES — curved, following body contour ===== */}
            <path d="M20,33 Q32,30 44,33" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M19,40 Q32,37 45,40" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M20,47 Q32,44 44,47" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M22,54 Q32,51 42,54" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-[42px] font-light tracking-[0.35em] mb-4 uppercase" style={{ color: 'rgba(255, 255, 255, 0.92)' }}>
          ALCHM
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-center text-[18px] font-light leading-relaxed max-w-[280px]" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          Your digital sanctuary for healing and transformation
        </p>

        {/* Button — part of the same group, moderate gap */}
        <div className="px-8 mt-12 w-full">
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              paddingTop: '20px',
              paddingBottom: '20px',
              borderRadius: '9999px',
              backgroundColor: '#E8C56D',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '16px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
              }}
            >
              BEGIN YOUR JOURNEY
            </span>
          </Link>
        </div>
      </div>

      {/* 988 footer — absolute bottom */}
      <div className="absolute bottom-8 left-0 right-0">
        <p className="text-xs text-center tracking-wide" style={{ color: 'rgba(255, 255, 255, 0.48)' }}>
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}
