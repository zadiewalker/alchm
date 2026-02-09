'use client';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Radial Overlay - LOCKDOWN SPEC */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_transparent_50%)]" />
      {/* Header */}
      <div className="pt-16 pb-8 flex items-center">
        <Link href="/dashboard" className="text-white/70 text-lg mr-4">← Back</Link>
        <h1 className="text-white text-3xl font-light">Privacy</h1>
      </div>

      {/* Simple Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-[320px]">
          <div className="text-white/80 text-6xl mb-6">🔒</div>
          <h2 className="text-white text-xl font-light mb-4">Your Privacy Matters</h2>
          <p className="text-white/60 text-sm mb-8">Control your data and privacy settings in your healing sanctuary</p>
          <Link 
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300 mb-4"
          >
            Privacy Settings
          </Link>
          <div className="text-white/50 text-xs">
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      {/* Crisis Footer - LOCKDOWN SPEC */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Crisis support available · 988
        </p>
      </div>
    </div>
  );
}