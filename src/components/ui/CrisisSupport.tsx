/**
 * Crisis Support Component
 * Provides warm, non-alarming support when crisis language is detected
 * Designed with trauma-informed care principles
 */

"use client";

import { useState } from 'react';
import { crisisCare } from '@/lib/emotional-intelligence';

interface CrisisSupportProps {
  isVisible: boolean;
  onContinueWriting: () => void;
  className?: string;
}

export function CrisisSupport({ isVisible, onContinueWriting, className = "" }: CrisisSupportProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!isVisible) return null;

  return (
    <div className={`mb-6 ${className}`}>
      {/* Gentle, non-alarming notification - Enhanced for mobile accessibility */}
      <div className="p-gentle sm:p-mindful bg-sanctuary-glass backdrop-blur-xl border border-sage-200/50 rounded-sanctuary shadow-blessing transition-all duration-meditation ease-blessing">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-sage-200/80 rounded-full flex items-center justify-center mt-1 shadow-breath">
            <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sage-800 text-base leading-comfortable mb-lg font-ground">
              {crisisCare.detection.message}
            </p>
            
            {!isExpanded ? (
              <div className="flex flex-col gap-md">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-xl py-lg bg-sage-100 border border-sage-200/70 rounded-sanctuary text-base text-sage-700 hover:bg-sage-200/80 transition-all duration-breath ease-blessing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50 focus-visible:ring-offset-2 min-h-touch-crisis font-ground shadow-breath hover:shadow-blessing"
                  aria-label="Show crisis support options"
                >
                  Show support options
                </button>
                <button
                  onClick={onContinueWriting}
                  className="px-xl py-lg bg-sage-400 text-sanctuary-white rounded-sanctuary text-base font-presence hover:bg-sage-500 transition-all duration-breath ease-blessing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanctuary-white focus-visible:ring-offset-2 focus-visible:ring-offset-sage-400 min-h-touch-crisis shadow-blessing hover:shadow-temple"
                  aria-label="Continue writing in your journal"
                >
                  Keep writing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sage-700 text-base leading-comfortable font-ground">
                  {crisisCare.resources.message}
                </p>
                
                <div className="grid gap-md">
                  {crisisCare.resources.options.map((option, index) => (
                    <div key={index} className="w-full">
                      {option.action === 'tel:988' ? (
                        <a
                          href={option.action}
                          className="flex w-full p-lg bg-red-50/80 border border-red-200/60 rounded-sanctuary text-red-700 text-base hover:bg-red-100/80 transition-all duration-breath ease-blessing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 focus-visible:ring-offset-2 min-h-touch-emergency shadow-breath hover:shadow-blessing font-ground"
                          aria-label="Call 988 Suicide & Crisis Lifeline"
                        >
                          <div className="flex items-center justify-center gap-md w-full">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span className="font-presence">{option.text}</span>
                          </div>
                        </a>
                      ) : option.action === 'sms:741741' ? (
                        <a
                          href={option.action}
                          className="flex w-full p-lg bg-blue-50/80 border border-blue-200/60 rounded-sanctuary text-blue-700 text-base hover:bg-blue-100/80 transition-all duration-breath ease-blessing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 min-h-touch-crisis shadow-breath hover:shadow-blessing font-ground"
                          aria-label="Text HOME to 741741 Crisis Text Line"
                        >
                          <div className="flex items-center justify-center gap-md w-full">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span className="font-presence">{option.text}</span>
                          </div>
                        </a>
                      ) : (
                        <button
                          onClick={onContinueWriting}
                          className="flex w-full p-lg bg-sage-400 text-sanctuary-white rounded-sanctuary text-base font-presence hover:bg-sage-500 transition-all duration-breath ease-blessing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanctuary-white focus-visible:ring-offset-2 focus-visible:ring-offset-sage-400 min-h-touch-crisis shadow-blessing hover:shadow-temple"
                          aria-label="Continue with your journaling session"
                        >
                          <div className="flex items-center justify-center gap-md w-full">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{option.text}</span>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-small text-sage-600 underline decoration-sage-300 hover:text-sage-700 transition-colors duration-breath ease-blessing font-ground min-h-touch-default px-md py-sm rounded-caress focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400/50"
                  aria-label="Hide crisis support options"
                >
                  Hide options
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Continued support message when expanded - Enhanced accessibility */}
      {isExpanded && (
        <div className="mt-lg p-lg bg-sage-50/80 border border-sage-200/70 rounded-sanctuary shadow-breath">
          <p className="text-base text-sage-700 text-center leading-comfortable font-ground">
            {crisisCare.continuedSupport.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default CrisisSupport;