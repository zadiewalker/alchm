'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';

interface CapacitorAppLoaderProps {
  children: React.ReactNode;
}

export default function CapacitorAppLoader({ children }: CapacitorAppLoaderProps) {
  const [isCapacitorReady, setIsCapacitorReady] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeCapacitor = async () => {
      try {
        console.group('⚡ Initializing Capacitor');
        console.log('Platform:', Capacitor.getPlatform());
        console.log('Is Native:', Capacitor.isNativePlatform());
        
        if (Capacitor.isNativePlatform()) {
          // Initialize native plugins
          try {
            // Configure StatusBar for iOS
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#8B9A7C' });
            console.log('✅ StatusBar configured');
          } catch (error) {
            console.warn('⚠️ StatusBar configuration failed:', error);
          }

          try {
            // Configure Keyboard for iOS
            await Keyboard.setAccessoryBarVisible({ isVisible: false });
            console.log('✅ Keyboard configured');
          } catch (error) {
            console.warn('⚠️ Keyboard configuration failed:', error);
          }

          // Hide splash screen after initialization
          try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Ensure UI is ready
            await SplashScreen.hide({
              fadeOutDuration: 150
            });
            console.log('✅ SplashScreen hidden');
          } catch (error) {
            console.warn('⚠️ SplashScreen hide failed:', error);
          }
        }

        if (mounted) {
          setIsCapacitorReady(true);
          console.log('✅ Capacitor initialization complete');
        }
        
        console.groupEnd();
      } catch (error) {
        console.error('❌ Capacitor initialization failed:', error);
        if (mounted) {
          setInitializationError(error instanceof Error ? error.message : 'Unknown error');
          setIsCapacitorReady(true); // Still allow app to load
        }
      }
    };

    // Enhanced initialization for iOS WebView performance
    if (Capacitor.isNativePlatform()) {
      const platform = Capacitor.getPlatform();
      const isIOS = platform === 'ios';
      
      const handleDeviceReady = () => {
        console.log('📱 deviceready event fired');
        initializeCapacitor();
      };
      
      // For iOS, add multiple initialization strategies
      if (isIOS) {
        // Strategy 1: Standard deviceready
        document.addEventListener('deviceready', handleDeviceReady);
        
        // Strategy 2: DOMContentLoaded fallback for iOS WebView
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
              if (mounted && !isCapacitorReady) {
                console.log('🍎 iOS DOMContentLoaded fallback triggered');
                initializeCapacitor();
              }
            }, 100);
          });
        }
        
        // Strategy 3: Immediate timeout for iOS WebView issues
        setTimeout(() => {
          if (mounted && !isCapacitorReady) {
            console.log('🍎 iOS immediate fallback triggered');
            initializeCapacitor();
          }
        }, 1000); // Shorter timeout for iOS
      } else {
        // Standard Android/other native platform handling
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            document.addEventListener('deviceready', handleDeviceReady);
          });
        } else {
          document.addEventListener('deviceready', handleDeviceReady);
        }
      }

      // Final fallback timeout
      const fallbackTimeout = setTimeout(() => {
        if (mounted && !isCapacitorReady) {
          console.warn('⚠️ Final deviceready timeout, initializing anyway');
          initializeCapacitor();
        }
      }, isIOS ? 2000 : 3000);

      return () => {
        mounted = false;
        clearTimeout(fallbackTimeout);
        document.removeEventListener('deviceready', handleDeviceReady);
      };
    } else {
      // Web platform - initialize immediately
      initializeCapacitor();
      return () => {
        mounted = false;
      };
    }
  }, []);

  if (!isCapacitorReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse">
              <circle cx="50" cy="12" r="10" fill="#E5C97D" />
              <circle cx="50" cy="28" r="6" fill="white" fillOpacity="0.8" />
              <ellipse cx="50" cy="58" rx="18" ry="28" fill="white" fillOpacity="0.8" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-light">Initializing ALCHM</h2>
          {initializationError && (
            <p className="text-white/60 text-sm mt-2">
              Note: {initializationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}