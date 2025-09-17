'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import ElegantCrisisFooter from '@/components/ui/ElegantCrisisFooter';

// Simplified primary journey button
function PrimaryJourneyButton() {
  const handleClick = () => {
    window.location.href = '/auth/login';
  };

  return (
    <button
      onClick={handleClick}
      data-testid="primary-cta"
      className="btn-primary"
      aria-label="Begin your healing path with ALCHM"
    >
      Begin Healing
    </button>
  );
}

// Simplified home content
function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen gradient-sanctuary">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 py-8 px-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="hidden sm:flex items-center gap-6">
            <a 
              href="/privacy-policy.html"
              className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
              aria-label="Privacy Policy"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            <a 
              href="/terms.html"
              className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
              aria-label="Terms of Service"
              rel="noopener noreferrer"
            >
              Terms
            </a>
          </div>
          <div className="flex-1 text-center">
            <h1 className="wordmark-sacred text-white">ALCHM</h1>
          </div>
          <div className="hidden sm:w-24"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="layout-centered">
        <div className="text-center text-white max-w-4xl mx-auto px-4">
          <div className={mounted ? 'opacity-100' : 'opacity-0'}>
            
            <div className="mt-16 mb-8">
              <p className="text-heading text-white mb-4 max-w-2xl mx-auto">
                Your safe space for emotional healing & collective growth
              </p>
              <p className="text-body text-white opacity-85 max-w-xl mx-auto">
                Trauma-informed AI support that honors all healing traditions & identities
              </p>
            </div>
            
            <div className="mb-8">
              <PrimaryJourneyButton />
            </div>

            <div className="text-white opacity-60 text-sm">
              <p>Always free • All identities welcomed • Private & secure</p>
            </div>
            
            {/* Privacy Policy Link - Prominent for Google OAuth Verification */}
            <div className="mt-6 mb-4">
              <a 
                href="/privacy-policy.html"
                className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 px-4 py-2 rounded-md hover:bg-white/10 inline-block"
                aria-label="Read ALCHM's comprehensive privacy policy"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <span className="text-white/40 mx-3">•</span>
              <a 
                href="/terms.html"
                className="text-white/80 hover:text-white text-sm underline underline-offset-4 hover:underline-offset-2 transition-all duration-200 px-4 py-2 rounded-md hover:bg-white/10 inline-block"
                aria-label="Read ALCHM's terms of service"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
            
            <div className="mt-2">
              <div className="text-white/60 text-sm">
                <p>Honoring all healing traditions & wisdom</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Elegant Crisis Support - Jony Ive Design */}
      <ElegantCrisisFooter autoDetect={true} position="floating" theme="minimal" />

      {/* Enhanced Footer with Prominent Legal Links */}
      <footer className="absolute bottom-0 left-0 right-0 py-4 px-4">
        <div className="text-center">
          <div className="text-white/50 text-xs flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
            <span>Ages 18+ • Free forever • No insurance needed</span>
            <div className="flex items-center gap-3">
              <a 
                href="/privacy-policy.html"
                className="hover:text-white/70 transition-colors underline underline-offset-2 px-4 py-3 rounded-md hover:bg-white/10 font-medium"
                aria-label="Read ALCHM's comprehensive privacy policy - Required for Google OAuth"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <span className="text-white/30">•</span>
              <a 
                href="/terms.html"
                className="hover:text-white/70 transition-colors underline underline-offset-2 px-4 py-3 rounded-md hover:bg-white/10"
                aria-label="Read ALCHM's terms of service"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#a4b792] to-[#7a8c6a] flex items-center justify-center px-4">
        <div className="text-center text-white">
          <h1 className="text-4xl font-light mb-8 tracking-wider opacity-90">ALCHM</h1>
          <p className="text-lg font-light opacity-75 mb-12">Preparing your sanctuary...</p>
          <div className="w-5 h-5 mx-auto border-2 border-white/25 border-t-white/70 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}