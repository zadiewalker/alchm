'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import PerformanceOptimizedLayout from '@/components/mobile/PerformanceOptimizedLayout';
import CulturallyResponsiveCrisisSupport from '@/components/ui/CulturallyResponsiveCrisisSupport';
import dynamic from 'next/dynamic';


function PrimaryJourneyButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="
        bg-[#a4b792] text-white opacity-90
        px-8 py-4 sm:px-12 sm:py-6
        text-lg font-light
        rounded-2xl
        flex items-center justify-center
        min-h-[56px] sm:min-h-[64px]
        min-w-[240px] sm:min-w-[280px]
        w-full max-w-[280px] sm:max-w-[320px]
        shadow-lg
      ">
        <span>Start Your Journey</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <Link
        href="/en/sanctuary"
        data-testid="primary-cta"
        className="
          bg-[#a4b792] hover:bg-[#93a682] text-white
          px-8 py-4 sm:px-12 sm:py-6
          text-lg font-normal
          rounded-2xl
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30
          transition-all duration-300 ease-out
          shadow-lg hover:shadow-xl
          flex items-center justify-center
          min-h-[56px] sm:min-h-[64px]
          min-w-[240px] sm:min-w-[280px]
          w-full max-w-[280px] sm:max-w-[320px]
          transform hover:scale-[1.02] active:scale-[0.98]
        "
        aria-label="Enter your unified healing sanctuary"
      >
        <span>Enter Your Sanctuary</span>
      </Link>
      
      <Link
        href="/auth/onboard"
        className="
          text-white/60 hover:text-white/80 text-sm font-light
          underline underline-offset-4 transition-colors duration-300
          min-h-[44px] px-4 py-3 flex items-center justify-center
        "
      >
        Create account instead
      </Link>
    </div>
  );
}

function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force mobile Chrome cache invalidation
    if (typeof window !== 'undefined' && window.location.href.includes('alchmapp.web.app')) {
      console.log('🔄 Mobile cache invalidation - Oct 2024 15:43');
    }
  }, []);

  return (
    <PerformanceOptimizedLayout>
      <main className="min-h-screen bg-[#a4b792] pt-24">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 py-8 px-4">
                {/* Khepera Scarab Navigation */}
        <div className="absolute top-4 left-4 z-10">
          <div className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <svg viewBox="0 0 32 32" className="w-full h-full text-white/90" fill="currentColor">
              <path d="M16 4c-1.5 0-3 0.5-4 1.5L8 9c-1 1-1.5 2.5-1.5 4v6c0 1.5 0.5 3 1.5 4l4 3.5c1 1 2.5 1.5 4 1.5s3-0.5 4-1.5L24 23c1-1 1.5-2.5 1.5-4v-6c0-1.5-0.5-3-1.5-4l-4-3.5c-1-1-2.5-1.5-4-1.5zm0 2c1 0 2 0.3 2.8 1L22 10.5c0.7 0.7 1 1.8 1 2.8v5.4c0 1-0.3 2.1-1 2.8L18.8 25c-0.8 0.7-1.8 1-2.8 1s-2-0.3-2.8-1L10 21.5c-0.7-0.7-1-1.8-1-2.8v-5.4c0-1 0.3-2.1 1-2.8L13.2 7c0.8-0.7 1.8-1 2.8-1z"/>
              <circle cx="16" cy="16" r="3" className="animate-pulse"/>
              <circle cx="12" cy="13" r="1"/>
              <circle cx="20" cy="13" r="1"/>
            </svg>
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="
            text-white
            text-4xl sm:text-6xl
            font-light tracking-[0.2em]
            leading-none
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]
          ">ALCHM</h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="
        flex flex-col items-center justify-center 
        min-h-screen 
        px-4 sm:px-8 
        relative
      ">
        <div className="text-center text-white max-w-4xl mx-auto w-full">
          <div className={`transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* Breathing Space */}
            <div className="mb-16 sm:mb-24"></div>
            
            {/* Primary Message - Clean Typography Hierarchy */}
            <div className="mb-16 sm:mb-20 px-4">
              <h2 className="
                text-xl sm:text-2xl
                font-light opacity-95
                leading-relaxed
                max-w-2xl mx-auto
                mb-8
                tracking-wide
                drop-shadow-[0_1px_4px_rgba(0,0,0,0.1)]
              ">
                Your sanctuary for healing
              </h2>
              <p className="
                text-base sm:text-lg
                font-light opacity-85
                leading-relaxed
                max-w-lg mx-auto
                tracking-normal
              ">
                A safe space that honors all traditions and identities
              </p>
            </div>
            
            {/* Primary Call to Action */}
            <div className="mb-8 sm:mb-12 flex justify-center">
              <PrimaryJourneyButton />
            </div>

            {/* Secondary CTA - Direct Sanctuary Access */}
            <div className="mb-16 text-center">
              <Link
                href="/en/sanctuary"
                className="
                  bg-white/10 hover:bg-white/20 text-white
                  px-6 py-3 rounded-xl
                  border border-white/20 hover:border-white/30
                  transition-all duration-300 ease-out
                  inline-flex items-center gap-3
                  min-h-[52px] min-w-[200px]
                  font-normal text-base
                  shadow-lg hover:shadow-xl
                  transform hover:scale-[1.02] active:scale-[0.98]
                "
                aria-label="Enter your healing sanctuary directly"
              >
                <span className="text-lg">🪲</span>
                <span>Enter Sanctuary</span>
              </Link>
            </div>

            {/* Supporting Information */}
            <div className="mb-12 sm:mb-16">
              <div className="
                flex flex-col sm:flex-row 
                items-center justify-center 
                gap-3 sm:gap-8 
                text-white/75 
                text-sm font-light
              ">
                <span>Always free</span>
                <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
                <span>Private & secure</span>
                <div className="hidden sm:block w-1 h-1 bg-white/30 rounded-full"></div>
                <span>All identities welcomed</span>
              </div>
              
              {/* Privacy Policy Link - Prominently displayed for Google verification */}
              <div className="mt-8 text-center">
                <a 
                  href="/privacy-policy.html"
                  className="
                    text-white/60 hover:text-white/80 
                    text-sm font-light underline underline-offset-2
                    min-h-[44px] min-w-[44px] 
                    inline-flex items-center justify-center
                    px-4 py-2
                    transition-colors duration-200
                  "
                  aria-label="Read our privacy policy"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
            
            {/* Minimal Acknowledgment */}
            <div className="text-center text-white/60 text-sm font-light">
              <p>Honoring all healing traditions</p>
            </div>

          </div>
        </div>
      </section>

      {/* Culturally Responsive Crisis Support */}
      <CulturallyResponsiveCrisisSupport position="landing" />

      {/* Minimal Footer */}
      <footer className="
        absolute bottom-0 left-0 right-0 
        py-6 
        px-4 sm:px-8
      ">
        <div className="text-center">
          <div className="
            text-white/60 
            text-xs 
            flex flex-col sm:flex-row 
            items-center justify-center 
            gap-2 sm:gap-6
            leading-relaxed
          ">
            <span>Ages 18+ • Always free • Private & secure</span>
            <div className="flex items-center gap-4">
              <a 
                href="/privacy-policy.html"
                className="
                  hover:text-white/80 transition-colors 
                  min-h-[44px] min-w-[44px] flex items-center justify-center
                  px-2 py-2
                "
                aria-label="Privacy policy"
              >
                Privacy
              </a>
              <span className="text-white/40">•</span>
              <a 
                href="/terms.html"
                className="
                  hover:text-white/80 transition-colors 
                  min-h-[44px] min-w-[44px] flex items-center justify-center
                  px-2 py-2
                "
                aria-label="Terms of service"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </PerformanceOptimizedLayout>
  );
}

// Cache bust: Oct 2024 15:43 Mobile Chrome Force Update
export default function LocalizedHomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#a4b792] flex items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="
            text-3xl sm:text-5xl 
            font-light 
            mb-8 
            tracking-widest opacity-90
          ">ALCHM</h1>
          <p className="
            text-base 
            font-light opacity-75 
            mb-12
            max-w-xs mx-auto
          ">Preparing your sanctuary...</p>
          <div className="
            w-5 h-5 
            mx-auto 
            border-2 border-white/30 border-t-white/80 
            rounded-full 
            animate-spin
            opacity-80
          "></div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}