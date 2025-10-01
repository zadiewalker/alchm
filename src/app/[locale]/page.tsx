'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Suspense } from 'react';
import PerformanceOptimizedLayout from '@/components/mobile/PerformanceOptimizedLayout';
import CulturallyResponsiveCrisisSupport from '@/components/ui/CulturallyResponsiveCrisisSupport';
import EconomicJusticeNotice from '@/components/ui/EconomicJusticeNotice';
import HealingTraditionsIndicator from '@/components/ui/HealingTraditionsIndicator';

function PrimaryJourneyButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="
        bg-white text-[#7a8c6a] 
        px-8 py-6 sm:px-16 sm:py-8 
        text-lg sm:text-xl font-light 
        rounded-3xl opacity-80 
        flex items-center justify-center 
        min-h-[72px] sm:min-h-[88px] 
        min-w-[280px] sm:min-w-[400px] 
        w-full max-w-[340px] sm:max-w-[400px]
        shadow-lg
        touch-target-large btn-gentle
        landing-cta-button landing-loading-gentle
      ">
        <span>Start Your Journey</span>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      data-testid="primary-cta"
      className="
        bg-white hover:bg-[#fefcfb] text-[#7a8c6a] 
        px-8 py-6 sm:px-16 sm:py-8 
        text-lg sm:text-xl font-medium 
        rounded-3xl 
        focus:outline-none focus:ring-4 focus:ring-white/40 
        transition-all duration-200 
        shadow-lg hover:shadow-xl 
        flex items-center justify-center 
        min-h-[72px] sm:min-h-[88px] 
        min-w-[280px] sm:min-w-[400px] 
        w-full max-w-[340px] sm:max-w-[400px]
        touch-target-large btn-gentle btn-trauma-informed
        active:scale-98
        transform hover:scale-[1.02]
        landing-primary-cta
      "
      aria-label="Begin your healing path with ALCHM - Free, private, and secure for all communities"
    >
      <span>Begin Healing</span>
    </Link>
  );
}

function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PerformanceOptimizedLayout>
      {/* Economic Justice Banner */}
      <EconomicJusticeNotice variant="landing" />
      
      <main className="min-h-screen bg-gradient-to-br from-[#a4b792] via-[#93a682] to-[#7a8c6a] landing-progressive-enhancement pt-10 trauma-informed mobile-optimized sanctuary-visual-design">
      {/* Header - Single Centered Wordmark - Mobile Optimized */}
      <header className="absolute top-0 left-0 right-0 z-10 py-8 sm:py-16 px-4 landing-header-mobile">
        <div className="text-center">
          <h1 className="
            text-white 
            text-2xl sm:text-4xl 
            font-light tracking-wider
            leading-tight
            mt-2 sm:mt-0
            text-crisis-readable
          ">ALCHM</h1>
        </div>
      </header>

      {/* Hero Section - Mobile-First Trauma-Informed Hierarchy */}
      <section className="
        flex flex-col items-center justify-center 
        min-h-screen 
        px-4 sm:px-8 
        container-mobile
        landing-hero-mobile
        relative
      ">
        <div className="text-center text-white max-w-4xl mx-auto w-full">
          <div className={`transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            
            {/* Mobile-Optimized Breathing Space */}
            <div className="mb-16 sm:mb-32"></div>
            
            {/* Primary Message - Mobile Typography Hierarchy */}
            <div className="mb-16 sm:mb-24 px-2">
              <p className="
                text-lg sm:text-2xl 
                font-light opacity-95 
                leading-relaxed 
                max-w-lg sm:max-w-2xl mx-auto 
                mb-8 sm:mb-16 
                tracking-wide
                text-crisis-readable
                text-comfort
                landing-primary-text
              ">
                Your safe space for emotional healing & collective growth
              </p>
              <p className="
                text-base sm:text-lg 
                font-light opacity-85 
                leading-relaxed 
                max-w-sm sm:max-w-xl mx-auto 
                tracking-wide
                text-crisis-readable
                text-gentle
                landing-secondary-text
              ">
                Trauma-informed AI support that honors all healing traditions & identities
              </p>
            </div>
            
            {/* Single Dominant Element - The Journey Invitation - Mobile Centered */}
            <div className="mb-16 sm:mb-32 flex justify-center">
              <PrimaryJourneyButton />
            </div>

            {/* Support Elements - Mobile Stacked */}
            <div className="mb-12 sm:mb-16">
              <div className="
                flex flex-col sm:flex-row 
                items-center justify-center 
                gap-4 sm:gap-6 
                text-white/70 
                text-sm font-light tracking-wide
                text-gentle
                landing-support-text
              ">
                <span>Always free</span>
                <div className="hidden sm:block h-px bg-white/25 w-6"></div>
                <div className="sm:hidden w-1 h-1 bg-white/25 rounded-full"></div>
                <span>All identities welcomed</span>
                <div className="hidden sm:block h-px bg-white/25 w-6"></div>
                <div className="sm:hidden w-1 h-1 bg-white/25 rounded-full"></div>
                <span>Private & secure</span>
              </div>
            </div>
            
            {/* Healing Traditions Acknowledgment */}
            <HealingTraditionsIndicator variant="minimal" />

          </div>
        </div>
      </section>

      {/* Thumb Zone Indicators for Single-Handed Operation */}
      <div className="thumb-zone-primary" aria-hidden="true"></div>
      <div className="thumb-zone-secondary" aria-hidden="true"></div>
      
      {/* Culturally Responsive Crisis Support */}
      <CulturallyResponsiveCrisisSupport position="landing" />

      {/* Legal Compliance - Mobile-Optimized Footer */}
      <footer className="
        absolute bottom-0 left-0 right-0 
        py-4 sm:py-6 
        px-4 sm:px-8
        pb-6 sm:pb-6
        landing-footer-mobile
      ">
        <div className="text-center">
          <div className="
            text-white/50 
            text-xs sm:text-xs 
            flex flex-col sm:flex-row 
            items-center justify-center 
            gap-2 sm:gap-4
            leading-relaxed
          ">
            <span>Ages 18+ • Free forever • No insurance needed</span>
            <div className="flex items-center gap-3 sm:gap-4">
              <a 
                href="/privacy-policy.html"
                className="
                  hover:text-white/70 transition-colors underline
                  min-h-[72px] min-w-[72px] flex items-center justify-center
                  touch-target-large px-4 py-3
                "
                aria-label="Read our privacy policy"
              >
                Privacy
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="/terms.html"
                className="
                  hover:text-white/70 transition-colors underline
                  min-h-[72px] min-w-[72px] flex items-center justify-center
                  touch-target-large px-4 py-3
                "
                aria-label="Read our terms of service"
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

export default function LocalizedHomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#a4b792] via-[#93a682] to-[#7a8c6a] flex items-center justify-center px-4">
        <div className="text-center text-white container-mobile">
          <h1 className="
            text-2xl sm:text-4xl 
            font-light 
            mb-6 sm:mb-8 
            tracking-wider opacity-90
            text-crisis-readable
          ">ALCHM</h1>
          <p className="
            text-base sm:text-lg 
            font-light opacity-75 
            mb-8 sm:mb-12
            text-gentle
            max-w-xs sm:max-w-none mx-auto
          ">Preparing your sanctuary...</p>
          <div className="
            w-4 h-4 sm:w-5 sm:h-5 
            mx-auto 
            border-2 border-white/25 border-t-white/70 
            rounded-full 
            loading-gentle
            opacity-80
          " 
               style={{ animationDuration: '2.5s' }}></div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}