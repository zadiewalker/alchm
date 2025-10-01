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
      {/* Gentle, non-alarming notification */}
      <div className="p-6 sanctuary-glass border border-sage-200 rounded-3xl shadow-soft">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center mt-1">
            <svg className="w-5 h-5 text-sage-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sage-700 text-sm leading-relaxed mb-4">
              {crisisCare.detection.message}
            </p>
            
            {!isExpanded ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="px-6 py-3 bg-sage-100 border border-sage-200 rounded-2xl text-sm text-sage-700 hover:bg-sage-200 transition-all duration-300 ease-sanctuary focus:outline-none focus:ring-2 focus:ring-sage-400/50 min-h-[48px]"
                >
                  Show support options
                </button>
                <button
                  onClick={onContinueWriting}
                  className="px-6 py-3 bg-sage-400 text-sanctuary-white rounded-2xl text-sm font-medium hover:bg-sage-500 transition-all duration-300 ease-sanctuary focus:outline-none focus:ring-2 focus:ring-sage-400/50 min-h-[48px]"
                >
                  Keep writing
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sage-600 text-sm leading-relaxed">
                  {crisisCare.resources.message}
                </p>
                
                <div className="grid gap-3">
                  {crisisCare.resources.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {option.action === 'tel:988' ? (
                        <a
                          href={option.action}
                          className="flex-1 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm hover:bg-red-100 transition-all duration-300 ease-sanctuary focus:outline-none focus:ring-2 focus:ring-red-400/50 min-h-[52px] flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <span>{option.text}</span>
                          </div>
                        </a>
                      ) : option.action === 'sms:741741' ? (
                        <a
                          href={option.action}
                          className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-700 text-sm hover:bg-blue-100 transition-all duration-300 ease-sanctuary focus:outline-none focus:ring-2 focus:ring-blue-400/50 min-h-[52px] flex items-center"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            <span>{option.text}</span>
                          </div>
                        </a>
                      ) : (
                        <button
                          onClick={onContinueWriting}
                          className="flex-1 p-4 bg-sage-400 text-sanctuary-white rounded-2xl text-sm font-medium hover:bg-sage-500 transition-all duration-300 ease-sanctuary focus:outline-none focus:ring-2 focus:ring-sage-400/50 min-h-[52px]"
                        >
                          <div className="flex items-center gap-2 justify-center">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                  className="text-xs text-sage-500 underline decoration-sage-300 hover:text-sage-600 transition-colors duration-300 ease-sanctuary"
                >
                  Hide options
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Continued support message when expanded */}
      {isExpanded && (
        <div className="mt-4 p-4 bg-sage-50 border border-sage-200 rounded-2xl">
          <p className="text-sm text-sage-600 text-center leading-relaxed">
            {crisisCare.continuedSupport.message}
          </p>
        </div>
      )}
    </div>
  );
}

export default CrisisSupport;