'use client';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8 flex items-center">
        <Link href="/" className="text-white/70 text-lg mr-4">← Back</Link>
        <h1 className="text-3xl text-white font-extralight tracking-[0.2em]">Join ALCHM</h1>
      </div>

      {/* Simple Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-[320px]">
          <div className="text-white/80 text-6xl mb-6">🌱</div>
          <h2 className="text-white text-xl font-light mb-4">Begin Your Journey</h2>
          <p className="text-white/60 text-sm mb-8">Create your healing sanctuary</p>
          <Link 
            href="/dashboard"
            className="inline-block px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-all duration-300 mb-4"
          >
            Demo Signup
          </Link>
          <div className="text-white/50 text-xs">
            <Link href="/auth/login" className="underline">Already have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}