'use client';

import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useData } from '@/hooks/useData';
import CapacitorAppLoader from './CapacitorAppLoader';

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { isInitialized } = useData();
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const handleAppReady = async () => {
      try {
        console.log('🔄 App initialization starting...');
        console.log('Data initialized:', isInitialized);
        console.log('Platform:', Capacitor.getPlatform());
        
        // For iOS WebView performance, don't wait for full data initialization
        // Allow the app to render first, then initialize data in background
        if (Capacitor.getPlatform() === 'ios') {
          console.log('🍎 iOS detected: Fast initialization mode');
          setIsAppReady(true);
          
          // Initialize background services after UI is painted
          setTimeout(async () => {
            try {
              const { performanceMonitor } = await import('@/lib/performance');
              performanceMonitor.init();
              console.log('🔄 Performance monitoring initialized');
            } catch (error) {
              console.warn('Performance monitoring failed to initialize:', error);
            }
          }, 2000); // Longer delay for iOS
          
          return;
        }
        
        // Standard initialization for other platforms
        if (isInitialized) {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('✅ App initialization complete');
          setIsAppReady(true);
          
          setTimeout(async () => {
            try {
              const { performanceMonitor } = await import('@/lib/performance');
              performanceMonitor.init();
              console.log('🔄 Performance monitoring initialized');
            } catch (error) {
              console.warn('Performance monitoring failed to initialize:', error);
            }
          }, 1500);
        }
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        // Always allow app to load even if initialization fails
        setIsAppReady(true);
      }
    };

    handleAppReady();
  }, [isInitialized]);

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4">
            <div className="w-full h-full border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white/80 text-sm">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <CapacitorAppLoader>
      {children}
    </CapacitorAppLoader>
  );
}