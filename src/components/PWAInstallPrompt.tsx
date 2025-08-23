// PWA Install Prompt - Intelligent app installation prompts
// Encourages app installation with tier-specific benefits

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Zap, 
  Shield, 
  Wifi, 
  X,
  Apple,
  Chrome,
  Heart,
  Star,
  Clock
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  userTier?: 'free' | 'deep-cut' | 'oracle';
  onInstall?: () => void;
  onDismiss?: () => void;
}

export default function PWAInstallPrompt({ 
  userTier = 'free', 
  onInstall, 
  onDismiss 
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installStep, setInstallStep] = useState<'prompt' | 'installing' | 'instructions'>('prompt');
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    // Check if already running as PWA
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone ||
                            document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already dismissed recently
    const dismissed = localStorage.getItem('alchm-pwa-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) { // Don't show again for 7 days
        setHasBeenDismissed(true);
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds for first-time users
      setTimeout(() => {
        if (!isStandaloneMode && !hasBeenDismissed) {
          setShowPrompt(true);
        }
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show iOS install prompt if iOS and not standalone
    if (iOS && !isStandaloneMode && !hasBeenDismissed) {
      setTimeout(() => setShowPrompt(true), 45000); // Longer delay for iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [hasBeenDismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setInstallStep('instructions');
      return;
    }

    if (deferredPrompt) {
      setInstallStep('installing');
      
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        
        if (choice.outcome === 'accepted') {
          console.log('PWA install accepted');
          onInstall?.();
          setShowPrompt(false);
        } else {
          console.log('PWA install dismissed');
          setInstallStep('prompt');
        }
      } catch (error) {
        console.error('PWA install error:', error);
        setInstallStep('prompt');
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('alchm-pwa-dismissed', Date.now().toString());
    onDismiss?.();
  };

  const getTierBenefits = () => {
    const baseBenefits = [
      'Work offline - journal anytime, anywhere',
      'Instant loading and smooth performance',
      'Secure local storage for your entries',
      'Push notifications for daily check-ins'
    ];

    const tierBenefits = {
      'oracle': [
        ...baseBenefits,
        'Offline AI mentor conversations',
        'Background sync for all premium features',
        'Priority app updates and features'
      ],
      'deep-cut': [
        ...baseBenefits,
        'Offline pattern analysis',
        'Advanced insights sync',
        'Enhanced performance optimization'
      ],
      'free': baseBenefits
    };

    return tierBenefits[userTier];
  };

  const getInstallInstructions = () => {
    if (isIOS) {
      return [
        'Tap the Share button at the bottom of the screen',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install ALCHM as an app'
      ];
    }

    return [
      'Look for the install icon in your browser',
      'Click "Install" when prompted',
      'ALCHM will be added to your home screen'
    ];
  };

  if (isStandalone || !showPrompt || hasBeenDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-purple-900/90 to-pink-900/90 border-purple-500/30 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Install ALCHM</CardTitle>
                <p className="text-sm text-purple-200">Get the full app experience</p>
              </div>
            </div>
            <Button 
              onClick={handleDismiss}
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {installStep === 'prompt' && (
            <>
              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="font-medium text-purple-200">Why install the app?</h3>
                <div className="space-y-2">
                  {getTierBenefits().slice(0, 4).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tier-specific highlight */}
              {userTier !== 'free' && (
                <div className="p-3 bg-gradient-to-r from-gold-900/20 to-amber-900/20 border border-gold-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-gold-400" />
                    <Badge 
                      variant="outline" 
                      className="border-gold-400 text-gold-300 text-xs"
                    >
                      {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Exclusive
                    </Badge>
                  </div>
                  <p className="text-xs text-gold-200">
                    Premium offline features and enhanced performance for your tier
                  </p>
                </div>
              )}

              {/* Device detection */}
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  {isIOS ? <Apple className="h-4 w-4" /> : <Chrome className="h-4 w-4" />}
                  <span>{isIOS ? 'iOS Safari' : 'Chrome'} detected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Fast & secure</span>
                </div>
              </div>

              {/* Install button */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleInstallClick}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={!deferredPrompt && !isIOS}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isIOS ? 'Show Instructions' : 'Install App'}
                </Button>
                <Button 
                  onClick={handleDismiss}
                  variant="outline"
                  className="border-gray-600 text-gray-300"
                >
                  Maybe Later
                </Button>
              </div>
            </>
          )}

          {installStep === 'installing' && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <h3 className="font-medium text-white mb-2">Installing ALCHM...</h3>
              <p className="text-sm text-gray-300">
                This will just take a moment
              </p>
            </div>
          )}

          {installStep === 'instructions' && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium text-purple-200">Install on iOS</h3>
                <div className="space-y-3">
                  {getInstallInstructions().map((instruction, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-200">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-blue-300">Quick Tip</span>
                </div>
                <p className="text-xs text-blue-200">
                  Look for the share icon (square with arrow) at the bottom of Safari
                </p>
              </div>

              <Button 
                onClick={() => setShowPrompt(false)}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Got it!
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for PWA install status
export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone ||
                     document.referrer.includes('android-app://');
    
    setIsStandalone(standalone);
    setIsInstalled(standalone);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return {
    isInstalled,
    canInstall,
    isStandalone
  };
}