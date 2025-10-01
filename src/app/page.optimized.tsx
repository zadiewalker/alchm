'use client';

import { useState, useEffect, startTransition, memo, useCallback } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useFIDOptimizedInteraction } from '@/lib/fid-optimization-simple';
import '../styles/jony-ive-design-system.css';

// CRITICAL: Inline CSS to prevent FOUC and improve FCP
if (typeof document !== 'undefined' && !document.getElementById('critical-styles')) {
  const style = document.createElement('style');
  style.id = 'critical-styles';
  style.textContent = `
    .gradient-sanctuary {
      background: linear-gradient(135deg, #a4b792 0%, #93a682 50%, #7a8c6a 100%);
    }
    .wordmark-sacred {
      font-size: clamp(2rem, 5vw, 4rem);
      font-weight: 300;
      letter-spacing: 0.1em;
    }
    .btn-primary {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      color: white;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn-primary:hover {
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.4);
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

// CRITICAL: Aggressive lazy loading for App Store performance compliance
// Primary goal: Reduce TTI from 25.6s to <5s, LCP from 4.1s to <2s
const PerformanceOptimizedLayout = dynamic(() => import('@/components/mobile/PerformanceOptimizedLayout'), {
  loading: () => <div className="min-h-screen gradient-sanctuary" />,
  ssr: false // Client-side only for performance
});

// Load crisis support after main content (non-blocking)
const CulturallyResponsiveCrisisSupport = dynamic(() => import('@/components/ui/CulturallyResponsiveCrisisSupport'), {
  loading: () => null,
  ssr: false // Client-side only
});

// Load economic notice after main content (non-blocking)  
const EconomicJusticeNotice = dynamic(() => import('@/components/ui/EconomicJusticeNotice'), {
  loading: () => null,
  ssr: false // Client-side only
});

// Load healing traditions after main content (non-blocking)
const HealingTraditionsIndicator = dynamic(() => import('@/components/ui/HealingTraditionsIndicator'), {
  loading: () => null,
  ssr: false // Client-side only
});

// CRITICAL: Memoized primary CTA button for performance
const PrimaryJourneyButton = memo(function PrimaryJourneyButton() {
  const [mounted, setMounted] = useState(false);
  const { createOptimizedHandler } = useFIDOptimizedInteraction();

  useEffect(() => {
    // Use startTransition for non-urgent state updates
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  const handleClick = useCallback(
    createOptimizedHandler(
      () => {
        // Optimized navigation for crisis users - immediate response
        window.location.href = '/auth/login';
      },
      { priority: 'crisis', immediate: true }
    ),
    [createOptimizedHandler]
  );

  // CRITICAL: Prevent CLS with exact dimensions and immediate rendering
  const buttonStyle = {
    width: '200px',
    height: '52px',
    minHeight: '52px',
    minWidth: '200px'
  };

  if (!mounted) {
    return (
      <div 
        className="btn-primary loading-gentle opacity-80" 
        style={buttonStyle}
      >
        <span>Begin Healing</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      data-testid="primary-cta"
      className="btn-primary"
      style={buttonStyle}
      aria-label="Begin your healing path with ALCHM - Free, private, and secure for all communities"
    >
      <span>Begin Healing</span>
    </button>
  );
});

// CRITICAL: Memoized home content for performance
const HomeContent = memo(function HomeContent() {
  const [mounted, setMounted] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);

  useEffect(() => {
    // Defer non-critical mounting for better FID
    startTransition(() => {
      setMounted(true);
      
      // Load secondary content after a delay
      setTimeout(() => {
        setSecondaryLoaded(true);
      }, 100);
    });
  }, []);

  // Memoize style objects to prevent re-renders
  const heroSectionStyle = { minHeight: '600px' };
  const heroContentStyle = { minHeight: '500px' };
  const spacingStyle = { height: '60px' };
  const messageStyle = { minHeight: '120px' };
  const headingStyle = { minHeight: '60px', lineHeight: '1.2' };
  const bodyStyle = { minHeight: '48px', lineHeight: '1.4' };
  const buttonContainerStyle = { minHeight: '80px' };
  const supportStyle = { minHeight: '60px' };
  const supportTextStyle = { minHeight: '40px' };
  const traditionsStyle = { minHeight: '40px' };

  return (
    <PerformanceOptimizedLayout>
      {/* Economic Justice Banner - Load after main content */}
      {secondaryLoaded && <EconomicJusticeNotice variant="landing" />}
      
      <main className="min-h-screen gradient-sanctuary pt-10">
        {/* Header - Sacred Wordmark - Immediate render */}
        <header className="absolute top-0 left-0 right-0 z-10 py-8 sm:py-16 px-4">
          <div className="text-center">
            <h1 className="wordmark-sacred text-white">ALCHM</h1>
          </div>
        </header>

        {/* Hero Section - Emotional Clarity Layout with CLS Prevention */}
        <section className="layout-centered" style={heroSectionStyle}>
          <div className="text-center text-white max-w-4xl mx-auto w-full">
            <div className={`transition-all duration-500 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} style={heroContentStyle}>
              
              {/* Generous Breathing Space - Fixed height to prevent CLS */}
              <div className="mt-3xl" style={spacingStyle}></div>
              
              {/* Primary Message - Reserved space to prevent CLS */}
              <div className="mb-2xl px-2" style={messageStyle}>
                <p className="text-heading text-white opacity-95 mb-xl max-w-2xl mx-auto" 
                   style={headingStyle}>
                  Your safe space for emotional healing & collective growth
                </p>
                <p className="text-body text-white opacity-85 max-w-xl mx-auto"
                   style={bodyStyle}>
                  Trauma-informed AI support that honors all healing traditions & identities
                </p>
              </div>
              
              {/* Single Dominant Element - Fixed dimensions to prevent CLS */}
              <div className="mb-2xl flex justify-center" style={buttonContainerStyle}>
                <PrimaryJourneyButton />
              </div>

              {/* Support Elements - Reserved space to prevent CLS */}
              <div className="mb-xl" style={supportStyle}>
                <div className="text-supporting text-white opacity-subtle text-center space-y-2"
                     style={supportTextStyle}>
                  <p style={{ margin: 0 }}>Always free • All identities welcomed • Private & secure</p>
                </div>
              </div>
              
              {/* Healing Traditions Acknowledgment - Reserved space */}
              <div style={traditionsStyle}>
                {secondaryLoaded && <HealingTraditionsIndicator variant="minimal" />}
              </div>

            </div>
          </div>
        </section>

        {/* Thumb Zone Indicators for Single-Handed Operation */}
        <div className="thumb-zone-primary" aria-hidden="true"></div>
        <div className="thumb-zone-secondary" aria-hidden="true"></div>
        
        {/* Culturally Responsive Crisis Support - Load after main content */}
        {secondaryLoaded && <CulturallyResponsiveCrisisSupport position="landing" />}

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
});

// CRITICAL: Optimized loading fallback to prevent LCP issues
const LoadingFallback = memo(function LoadingFallback() {
  const fallbackStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #a4b792 0%, #93a682 50%, #7a8c6a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px'
  };
  
  const spinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255,255,255,0.25)',
    borderTop: '2px solid rgba(255,255,255,0.7)',
    borderRadius: '50%',
    animation: 'spin 2s linear infinite',
    opacity: 0.8
  };

  return (
    <div style={fallbackStyle}>
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
        <div style={spinnerStyle}></div>
      </div>
    </div>
  );
});

// CRITICAL: Main HomePage component optimized for App Store performance
export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <HomeContent />
    </Suspense>
  );
}