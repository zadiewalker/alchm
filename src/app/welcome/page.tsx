'use client';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8 flex items-center">
        <Link href="/" className="text-white/70 text-lg mr-4">← Back</Link>
        <h1 className="text-3xl text-white font-extralight tracking-[0.2em]">Welcome</h1>
      </div>

      {/* Simple Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-[400px]">
          <div className="text-white/80 text-6xl mb-6">🌱</div>
          <h2 className="text-white text-2xl font-light mb-4">Welcome to ALCHM</h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Your digital sanctuary for healing and transformation. Begin your journey with Khepera, 
            your AI companion trained in trauma-informed care.
          </p>
          
          {/* Features */}
          <div className="space-y-4 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <span className="text-white/80 text-lg">💚</span>
              <div>
                <h3 className="text-white font-light">Safe & Private</h3>
                <p className="text-white/50 text-xs">Your entries are secure and confidential</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-white/80 text-lg">🔮</span>
              <div>
                <h3 className="text-white font-light">AI-Guided Insights</h3>
                <p className="text-white/50 text-xs">Gentle wisdom from Khepera companion</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-white/80 text-lg">🤗</span>
              <div>
                <h3 className="text-white font-light">Your Pace, Your Way</h3>
                <p className="text-white/50 text-xs">You control your healing journey</p>
              </div>
            </div>
          </div>

          <Link 
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300 mb-4"
          >
            Enter Your Sanctuary
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