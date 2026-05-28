'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface JournalSuccessCeremonyProps {
  isVisible: boolean;
  onComplete: () => void;
  hasKheperaResponse: boolean;
}

const KheperaScarab = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <circle cx="50" cy="12" r="8" fillOpacity="0.9" />
    <circle cx="50" cy="26" r="5" fillOpacity="0.85" />
    <ellipse cx="50" cy="55" rx="15" ry="23" fillOpacity="0.85" />
    <path d="M35 48 Q18 40 21 62 Q23 71 35 66 Z" fillOpacity="0.8" />
    <path d="M65 48 Q82 40 79 62 Q77 71 65 66 Z" fillOpacity="0.8" />
  </svg>
);

export default function JournalSuccessCeremony({ 
  isVisible, 
  onComplete, 
  hasKheperaResponse 
}: JournalSuccessCeremonyProps) {
  const [stage, setStage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timeline = [
      { delay: 0, action: () => setStage(1) }, // Entry saved
      { delay: 1000, action: () => setStage(2) }, // Khepera acknowledgment
      { delay: 2500, action: () => setStage(3) }, // Celebration
      { delay: 3000, action: () => setShowCelebration(true) },
      { delay: 15000, action: () => onComplete() } // Auto-dismiss after 15 seconds
    ];

    const timeouts = timeline.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-white/20 to-white/15 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full border border-white/20 shadow-2xl">
        
        {/* Stage 1: Entry Saved */}
        <div className={`transition-all duration-1000 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white text-xl font-light mb-2">Entry Saved</h2>
            <p className="text-white/60 text-sm">Your thoughts are safely preserved in your sanctuary</p>
          </div>
        </div>

        {/* Stage 2: Khepera Acknowledgment */}
        {hasKheperaResponse && (
          <div className={`transition-all duration-1000 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#E5C97D]/25 to-[#E5C97D]/15 border border-[#E5C97D]/20 flex items-center justify-center">
                <KheperaScarab className="w-8 h-8 text-[#E5C97D]" />
              </div>
              <h3 className="text-white text-lg font-light mb-2">Khepera Responds</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                "Your courage to share creates ripples of healing. I see your strength."
              </p>
            </div>
          </div>
        )}

        {/* Stage 3: Progress Celebration */}
        <div className={`transition-all duration-1000 ${stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/25 to-purple-400/15 border border-purple-400/20 flex items-center justify-center transition-transform duration-500 ${showCelebration ? 'scale-110' : 'scale-100'}`}>
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-white text-lg font-light mb-2">Healing Journey Continues</h3>
            <p className="text-white/60 text-sm mb-6">
              Every reflection deepens your self-understanding and strengthens your sanctuary
            </p>

            {/* Progress Indicator */}
            <div className="bg-white/10 rounded-full p-1 mb-6">
              <div className="flex items-center justify-center space-x-2 py-2">
                <div className="w-2 h-2 rounded-full bg-[#E5C97D]"></div>
                <div className="w-6 h-0.5 bg-[#E5C97D]/50"></div>
                <div className="w-2 h-2 rounded-full bg-[#E5C97D]/60"></div>
                <div className="w-6 h-0.5 bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full py-3 bg-[#E5C97D] hover:bg-[#F2D99D] text-white text-center rounded-xl font-medium transition-colors duration-200"
                onClick={onComplete}
              >
                Return to Sanctuary
              </Link>
              <Link
                href="/containers"
                className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white text-center rounded-xl border border-white/20 font-medium transition-colors duration-200"
                onClick={onComplete}
              >
                Explore Healing Pathways
              </Link>
              <button
                onClick={onComplete}
                className="w-full py-2 text-white/60 hover:text-white/80 text-sm transition-colors duration-200"
              >
                Continue Journaling
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
