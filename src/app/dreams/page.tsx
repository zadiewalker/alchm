'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DreamAnalysis from '@/components/DreamAnalysis';
import { safeLocalStorage } from '@/utils/browser';

export default function DreamsPage() {
  const [userTier, setUserTier] = useState<'sanctuary' | 'growth' | 'transformation'>('sanctuary');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user's subscription tier from localStorage
    const storedTier = safeLocalStorage.getItem('userTier') as 'sanctuary' | 'growth' | 'transformation';
    if (storedTier) {
      setUserTier(storedTier);
    }
    setIsLoading(false);
  }, []);

  const canAccess = userTier === 'transformation';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col items-center justify-center px-6">
        <div className="bg-white/10 border border-white/20 p-8 rounded-3xl backdrop-blur-sm max-w-md text-center">
          <div className="text-6xl mb-6">🌙</div>
          <h1 className="text-2xl text-white font-light mb-4">Dream Analysis Locked</h1>
          <p className="text-white/70 mb-6">
            Access to advanced dream interpretation and subconscious analysis requires a Transformation subscription.
          </p>
          <div className="space-y-3">
            <Link
              href="/pricing/"
              className="block bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-full font-medium transition-all duration-300"
            >
              Upgrade to Transformation ($9.99/mo)
            </Link>
            <Link
              href="/dashboard"
              className="block text-white/70 hover:text-white py-3 px-6 font-light transition-all duration-300"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex flex-col px-6 relative">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="flex items-center mb-4">
          <Link href="/dashboard" className="text-white/70 text-lg mr-4">← Back</Link>
          <h1 className="text-2xl text-white font-extralight tracking-[0.2em]">Dreams & Intuition</h1>
        </div>
        <p className="text-white/70 text-sm font-light">
          Unlock the wisdom of your subconscious through dream analysis and shadow integration
        </p>
      </div>

      {/* Dream Analysis Component */}
      <div className="flex-1">
        <DreamAnalysis />
      </div>

      {/* Crisis Support */}
      <div className="pb-10">
        <p className="text-white/40 text-xs text-center tracking-wide">
          Dreams can reveal deep emotions · Your subconscious is wise
        </p>
      </div>
    </div>
  );
}