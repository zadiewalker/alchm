'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Check if we're on auth page
    setIsAuthPage(window.location.pathname.includes('/auth'));
    
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode || isIOSStandalone);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
          
          // Check for updates every 30 minutes
          setInterval(() => {
            registration.update();
          }, 1800000);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Show install prompt after 30 seconds of usage (but not on auth pages)
      setTimeout(() => {
        if (!isStandaloneMode && !isIOSStandalone && !window.location.pathname.includes('/auth')) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA install accepted');
    } else {
      console.log('PWA install dismissed');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < sevenDays) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // iOS install instructions
  const showIOSInstructions = () => {
    if (typeof window === 'undefined') return false;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isIOS && !isStandalone && !deferredPrompt;
  };

  // Don't show PWA installer on auth pages or when already installed
  if (!isMounted || isStandalone || isAuthPage || window.location.pathname.includes('/login')) return null;

  return (
    <>
      {/* PWA Install Banner */}
      {showInstallPrompt && deferredPrompt && (
        <div className="fixed top-4 left-4 right-4 z-20 bg-[#5E8E7F] text-white rounded-xl shadow-lg border border-white/20">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📱</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Install ALCHM App</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  Access your healing space offline. Install ALCHM for a better experience with faster loading and offline journaling.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstallClick}
                    className="bg-white text-[#5E8E7F] px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors"
                  >
                    Install App
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/90 hover:text-white p-2 touch-target"
                aria-label="Close install prompt"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Install Instructions */}
      {showIOSInstructions() && showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 z-20 bg-blue-600 text-white rounded-xl shadow-lg">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🍎</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">Install on iOS</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-2">
                  Tap the share button <span className="font-mono bg-white/20 px-1 rounded">⬆️</span> in Safari, then select "Add to Home Screen"
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDismiss}
                    className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
                  >
                    Got it
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="text-white/90 hover:text-white p-2 touch-target"
                aria-label="Close install prompt"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}