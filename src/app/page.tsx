'use client';

import Link from 'next/link';

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col items-center justify-center px-6 relative">
      {/* Khepera Scarab Icon */}
      <div className="mb-10">
        <svg 
          viewBox="0 0 100 100" 
          className="w-16 h-16"
          fill="white"
          fillOpacity="0.8"
        >
          {/* Scarab body */}
          <ellipse cx="50" cy="55" rx="25" ry="30" />
          {/* Scarab head */}
          <circle cx="50" cy="20" r="12" />
          {/* Left wing */}
          <path d="M25 55 Q5 40 15 70 Q20 80 25 75 Z" />
          {/* Right wing */}
          <path d="M75 55 Q95 40 85 70 Q80 80 75 75 Z" />
          {/* Sun disk above head */}
          <circle cx="50" cy="5" r="6" fillOpacity="0.6" />
        </svg>
      </div>

      {/* Wordmark */}
      <h1 className="text-5xl text-white font-extralight tracking-[0.3em] mb-4">
        ALCHM
      </h1>

      {/* Tagline */}
      <p className="text-white/60 text-center text-lg font-light mb-16 max-w-[280px] leading-relaxed">
        Your digital sanctuary for healing and transformation
      </p>

      {/* CTA Button - Using Link for static export compatibility */}
      <Link
        href="/dashboard"
        className="group relative px-12 py-5 inline-block"
      >
        <div 
          className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 group-active:bg-white/20 transition-all duration-500"
        />
        <span className="relative text-white uppercase tracking-[0.2em] text-sm font-medium">
          Begin Your Journey
        </span>
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 h-[1px] w-12 group-hover:w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-all duration-500"
        />
      </Link>

      {/* Crisis Footer */}
      <div className="absolute bottom-10 left-0 right-0">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}
