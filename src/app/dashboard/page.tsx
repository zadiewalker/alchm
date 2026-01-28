'use client';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <h1 className="text-3xl text-white font-extralight tracking-[0.2em] text-center mb-4">Dashboard</h1>
        <div className="text-white/60 text-center text-sm font-light italic max-w-[300px] mx-auto">
          "What the caterpillar calls the end of the world, the master calls a butterfly." — Richard Bach
        </div>
      </div>

      {/* Navigation Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 max-w-[320px] w-full">
          <Link 
            href="/journal/new"
            className="group relative aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white/80 text-2xl mb-3">📝</div>
            <span className="text-white text-sm font-light tracking-wide text-center">New Entry</span>
          </Link>

          <Link 
            href="/insights"
            className="group relative aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white/80 text-2xl mb-3">💡</div>
            <span className="text-white text-sm font-light tracking-wide text-center">Insights</span>
          </Link>

          <Link 
            href="/pathways"
            className="group relative aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white/80 text-2xl mb-3">🌱</div>
            <span className="text-white text-sm font-light tracking-wide text-center">Pathways</span>
          </Link>

          <Link 
            href="/settings"
            className="group relative aspect-square rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex flex-col items-center justify-center hover:bg-white/20 transition-all duration-300"
          >
            <div className="text-white/80 text-2xl mb-3">⚙️</div>
            <span className="text-white text-sm font-light tracking-wide text-center">Settings</span>
          </Link>
        </div>
      </div>

      {/* Crisis Support */}
      <div className="pb-10">
        <p className="text-white/40 text-xs text-center tracking-wide">Crisis support available · 988</p>
      </div>
    </div>
  );
}
