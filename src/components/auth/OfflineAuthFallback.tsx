'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OfflineAuthFallbackProps {
  onRetry: () => void;
  visible: boolean;
}

export function OfflineAuthFallback({ onRetry, visible }: OfflineAuthFallbackProps) {
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-retry when coming back online
  useEffect(() => {
    if (isOnline && visible) {
      const retryTimer = setTimeout(() => {
        onRetry();
      }, 1000); // Wait 1 second after coming online

      return () => clearTimeout(retryTimer);
    }
  }, [isOnline, visible, onRetry]);

  if (!visible) return null;

  return (
    <div className="rounded-lg bg-sage-50/90 backdrop-blur-sm border border-sage-200/50 p-5 text-center shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="text-2xl mb-1">
          {isOnline ? '💚' : '🌿'}
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-sage-800 mb-2">
            {isOnline ? 'Connection is back' : 'Having connection trouble?'}
          </h3>
          
          <p className="text-sm text-sage-700 leading-relaxed mb-4">
            {isOnline 
              ? 'Great news! We\'re reconnected and ready to safely sign you in.'
              : 'Network issues happen, especially when you need support most. You\'re not alone, and your sanctuary is still here for you.'
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onRetry}
            disabled={!isOnline}
            className="flex-1 min-h-[44px] px-4 py-3 text-sm bg-sage-600 text-white rounded-full hover:bg-sage-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium touch-safe"
            style={{
              touchAction: 'manipulation',
              minHeight: '44px'
            }}
          >
            {isOnline ? 'Continue to sanctuary' : 'Waiting for connection...'}
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex-1 min-h-[44px] px-4 py-3 text-sm bg-white text-sage-700 rounded-full border border-sage-300 hover:bg-sage-50 transition-all duration-200 font-medium touch-safe"
            style={{
              touchAction: 'manipulation',
              minHeight: '44px'
            }}
          >
            Journal privately offline
          </button>
        </div>

        <div className="text-xs text-sage-600 mt-2 space-y-1">
          <p className="flex items-center justify-center gap-2">
            <span>✍️</span> 
            <span>You can write and reflect without signing in</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>🔒</span> 
            <span>Your private thoughts stay safe on your device</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span>🌱</span> 
            <span>Everything syncs when you're ready to connect</span>
          </p>
        </div>

        {!isOnline && (
          <div className="bg-sage-100/50 rounded-lg p-3 mt-2 text-xs text-sage-700">
            <p className="italic">
              "Sometimes going offline gives us the space we need to process. 
              Take all the time you need - we'll be here when you're ready."
            </p>
          </div>
        )}
      </div>
    </div>
  );
}