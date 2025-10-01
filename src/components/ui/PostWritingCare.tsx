/**
 * Post-Writing Care Component
 * Provides gentle check-in and support options after writing
 * Creates a caring transition from writing to reflection
 */

"use client";

import { useState, useEffect } from 'react';
import { postWritingCare } from '@/lib/emotional-intelligence';

interface PostWritingCareProps {
  isVisible: boolean;
  currentState: 'reflection' | 'nextSteps' | 'complete' | null;
  onReflectionResponse: (response: string) => void;
  onNextStepResponse: (response: string) => void;
  onClose: () => void;
  className?: string;
}

export function PostWritingCare({ 
  isVisible, 
  currentState, 
  onReflectionResponse, 
  onNextStepResponse, 
  onClose,
  className = "" 
}: PostWritingCareProps) {
  const [selectedReflection, setSelectedReflection] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isVisible && currentState === 'reflection') {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 3000);
    }
  }, [isVisible, currentState]);

  if (!isVisible || currentState === 'complete') return null;

  return (
    <div className={`mt-6 ${className}`}>
      {/* Initial celebration */}
      {currentState === 'reflection' && (
        <div className="mb-4">
          <div className={`p-4 bg-gradient-to-r from-white/20 via-white/15 to-white/10 backdrop-blur-sm border border-white/30 rounded-2xl text-center transition-all duration-1000 ${
            showAnimation ? 'animate-gentle-glow' : ''
          }`}>
            <div className="mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {postWritingCare.immediate.message}
            </h3>
            <p className="text-sm text-white/80">
              Take a moment to honor what you just shared.
            </p>
          </div>
        </div>
      )}

      {/* Reflection check-in */}
      {currentState === 'reflection' && (
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
          <h4 className="text-white font-medium mb-3">
            {postWritingCare.reflection.question}
          </h4>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {postWritingCare.reflection.options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedReflection(option)}
                className={`p-3 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                  selectedReflection === option
                    ? 'bg-white text-[var(--ink)] border-white shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          
          {selectedReflection && (
            <div className="flex justify-between items-center pt-3 border-t border-white/20">
              <p className="text-sm text-white/80">
                Thank you for sharing that feeling.
              </p>
              <button
                onClick={() => {
                  onReflectionResponse(selectedReflection);
                  setSelectedReflection(null);
                }}
                className="px-4 py-2 bg-white text-[var(--ink)] rounded-full text-sm font-medium hover:bg-white/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}

      {/* Next steps options */}
      {currentState === 'nextSteps' && (
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
          <h4 className="text-white font-medium mb-3">
            {postWritingCare.nextSteps.question}
          </h4>
          
          <div className="space-y-3">
            {postWritingCare.nextSteps.options.map((option) => (
              <button
                key={option}
                onClick={() => onNextStepResponse(option)}
                className="w-full p-3 text-left bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 hover:border-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                    {option.includes('Khepera') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {option.includes('privately') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    {option.includes('breathing') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    )}
                    {option.includes('Write a little more') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {option.includes('community') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/20 flex justify-between items-center">
            <p className="text-xs text-white/70">
              All choices honor your journey.
            </p>
            <button
              onClick={onClose}
              className="text-sm text-white/70 underline decoration-white/50 hover:text-white transition-colors duration-200"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Add gentle glow animation to global CSS
export const postWritingCareStyles = `
@keyframes gentle-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 30px rgba(255, 255, 255, 0.2), 0 0 40px rgba(139, 115, 85, 0.1); }
}

.animate-gentle-glow {
  animation: gentle-glow 3s ease-in-out;
}
`;

export default PostWritingCare;