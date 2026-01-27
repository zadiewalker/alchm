'use client';

import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="w-16 h-16 mb-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-white/90" fill="currentColor">
          <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-5xl text-white font-extralight tracking-[0.3em] mb-4">
        ALCHM
      </h1>

      {/* Tagline */}
      <p className="text-white/70 text-center text-lg mb-12 max-w-xs">
        Your digital sanctuary for healing and transformation
      </p>

      {/* CTA Button - Ethereal, NO heavy borders */}
      <button
        onClick={() => router.push('/dashboard')}
        className="group relative px-12 py-5"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-full backdrop-blur-sm transition-all duration-500" />
        <span className="relative text-white uppercase tracking-[0.2em] text-sm font-medium">
          Begin Your Journey
        </span>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:w-20 group-hover:via-white/60 transition-all duration-500" />
      </button>

      {/* Crisis Footer */}
      <p className="absolute bottom-8 text-white/50 text-sm text-center">
        Crisis support: 988 · Your privacy is protected
      </p>
    </div>
  );
}
