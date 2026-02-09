'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeWindow } from '@/utils/browser';

export default function DashboardClient() {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Get time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Check for success parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(safeWindow.location.search);
      if (urlParams.get('success') === 'true') {
        setShowSuccessMessage(true);
        // Remove the parameter from URL
        const newUrl = safeWindow.location.href.split('?')[0];
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, newUrl);
        }
        // Hide message after 8 seconds
        setTimeout(() => setShowSuccessMessage(false), 8000);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mx-6 mt-14 mb-4 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
          <div className="flex items-center gap-3">
            <span className="text-green-300 text-lg">🎉</span>
            <div>
              <p className="text-green-200 font-medium">Welcome to Transformation!</p>
              <p className="text-green-200/80 text-sm">Your subscription is active. Enjoy all the premium features!</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-6 pt-6 pb-6 flex items-start justify-between">
        <div>
          <p className="text-white/60 text-base mb-1">{greeting}</p>
          <h1 className="text-white text-3xl font-light">Your Sanctuary</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link 
            href="/emergency/"
            className="w-10 h-10 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/20 flex items-center justify-center transition-all duration-200 ease-out active:scale-95"
            title="Emergency Support"
          >
            <span className="text-amber-200 text-lg">☾</span>
          </Link>
          <Link 
            href="/settings/"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center transition-all duration-200 ease-out active:scale-95"
          >
            <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        
        {/* Khepera Card - The Heart of the Dashboard */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 shadow-xl shadow-black/5">
            {/* Khepera Icon */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5C97D]/25 to-[#E5C97D]/15 border border-[#E5C97D]/20 flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-7 h-7">
                <circle cx="50" cy="12" r="8" fill="#E5C97D" />
                <circle cx="50" cy="28" r="5" fill="white" fillOpacity="0.7" />
                <ellipse cx="50" cy="55" rx="16" ry="24" fill="white" fillOpacity="0.7" />
                <path d="M34 48 Q18 40 22 60 Q24 70 34 65 Z" fill="white" fillOpacity="0.7" />
                <path d="M66 48 Q82 40 78 60 Q76 70 66 65 Z" fill="white" fillOpacity="0.7" />
              </svg>
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed mb-1">
              "What's present for you today?"
            </p>
            <p className="text-white/50 text-sm mb-5">— Khepera</p>
            
            <Link 
              href="/journal/new/"
              className="inline-block px-6 py-3 rounded-full bg-[#E5C97D] hover:bg-[#F2D99D]
                         border border-[#E5C97D]/20 hover:border-[#F2D99D]/30
                         shadow-md shadow-[#E5C97D]/20 hover:shadow-lg
                         transition-all duration-200 ease-out active:scale-[0.98]
                         min-h-[44px] flex items-center justify-center"
            >
              <span className="text-white text-sm font-medium">Begin writing</span>
            </Link>
          </div>
        </section>

        {/* Navigation Cards - Subtle but clearly tappable */}
        <section className="space-y-3">
          <Link 
            href="/journal/"
            className="flex items-center justify-between p-5 rounded-2xl
                       bg-white/[0.07] hover:bg-white/[0.11]
                       border border-white/[0.08] hover:border-white/[0.12]
                       transition-all duration-200 active:scale-[0.99]
                       group"
          >
            <div>
              <h3 className="text-white/90 text-base font-medium mb-0.5">Journal</h3>
              <p className="text-white/50 text-sm">Your past reflections</p>
            </div>
            
            {/* Chevron - subtle affordance */}
            <svg 
              className="w-5 h-5 text-white/30 group-hover:text-white/50 
                         group-hover:translate-x-0.5 transition-all duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

          <Link 
            href="/insights/"
            className="flex items-center justify-between p-5 rounded-2xl
                       bg-white/[0.07] hover:bg-white/[0.11]
                       border border-white/[0.08] hover:border-white/[0.12]
                       transition-all duration-200 active:scale-[0.99]
                       group"
          >
            <div>
              <h3 className="text-white/90 text-base font-medium mb-0.5">Insights</h3>
              <p className="text-white/50 text-sm">Patterns Khepera has noticed</p>
            </div>
            
            {/* Chevron - subtle affordance */}
            <svg 
              className="w-5 h-5 text-white/30 group-hover:text-white/50 
                         group-hover:translate-x-0.5 transition-all duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

          <Link 
            href="/pathways/"
            className="flex items-center justify-between p-5 rounded-2xl
                       bg-white/[0.07] hover:bg-white/[0.11]
                       border border-white/[0.08] hover:border-white/[0.12]
                       transition-all duration-200 active:scale-[0.99]
                       group"
          >
            <div>
              <h3 className="text-white/90 text-base font-medium mb-0.5">Pathways</h3>
              <p className="text-white/50 text-sm">Guided healing journeys</p>
            </div>
            
            {/* Chevron - subtle affordance */}
            <svg 
              className="w-5 h-5 text-white/30 group-hover:text-white/50 
                         group-hover:translate-x-0.5 transition-all duration-200" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>

        </section>

        {/* Crisis Support Footer */}
        <div className="mt-8 pb-8 pt-6">
          <p className="text-white/30 text-xs text-center tracking-wide">
            Crisis support available · 988
          </p>
        </div>

      </div>

    </div>
  );
}