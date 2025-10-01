'use client';

import { useState, useEffect } from 'react';

interface NetworkResilienceProps {
  onNetworkChange?: (isOnline: boolean) => void;
  showIndicator?: boolean;
}

export default function NetworkResilience({ 
  onNetworkChange, 
  showIndicator = true 
}: NetworkResilienceProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionQuality, setConnectionQuality] = useState<'fast' | 'slow' | 'offline'>('fast');
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  useEffect(() => {
    // Initial network status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setReconnectAttempts(0);
      setConnectionQuality('fast');
      onNetworkChange?.(true);
      
      // Gentle haptic feedback for reconnection
      if (navigator.vibrate) {
        navigator.vibrate([50, 25, 50]);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOnline(new Date());
      setConnectionQuality('offline');
      onNetworkChange?.(false);
      
      // Start reconnection attempts
      startReconnectionAttempts();
    };

    // Connection quality detection
    const detectConnectionQuality = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // Effective connection type: 'slow-2g', '2g', '3g', '4g'
          const effectiveType = connection.effectiveType;
          if (effectiveType === 'slow-2g' || effectiveType === '2g') {
            setConnectionQuality('slow');
          } else if (effectiveType === '3g' || effectiveType === '4g') {
            setConnectionQuality('fast');
          }
        }
      }
    };

    const startReconnectionAttempts = () => {
      const attemptReconnect = () => {
        if (!navigator.onLine) {
          setReconnectAttempts(prev => prev + 1);
          // Try again with exponential backoff (trauma-informed: not too aggressive)
          const delay = Math.min(10000, 1000 * Math.pow(1.5, reconnectAttempts));
          setTimeout(attemptReconnect, delay);
        }
      };
      
      setTimeout(attemptReconnect, 1000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Monitor connection changes
    if ('connection' in navigator) {
      (navigator as any).connection.addEventListener('change', detectConnectionQuality);
    }

    // Initial quality check
    detectConnectionQuality();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        (navigator as any).connection.removeEventListener('change', detectConnectionQuality);
      }
    };
  }, [onNetworkChange, reconnectAttempts]);

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isOnline && connectionQuality === 'fast' ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div 
        className="px-4 py-2 rounded-full backdrop-blur-md border shadow-lg text-sm font-medium flex items-center gap-2"
        style={{
          background: isOnline 
            ? connectionQuality === 'slow' 
              ? 'rgba(245, 158, 11, 0.9)' // amber for slow
              : 'rgba(34, 197, 94, 0.9)'  // green for online
            : 'rgba(239, 68, 68, 0.9)',   // red for offline
          borderColor: isOnline 
            ? connectionQuality === 'slow' 
              ? 'rgba(245, 158, 11, 0.3)'
              : 'rgba(34, 197, 94, 0.3)'
            : 'rgba(239, 68, 68, 0.3)',
          color: 'white'
        }}
      >
        <div className={`w-2 h-2 rounded-full ${
          isOnline 
            ? connectionQuality === 'slow'
              ? 'bg-yellow-300 animate-pulse'
              : 'bg-green-300'
            : 'bg-red-300 animate-pulse'
        }`} />
        
        {!isOnline ? (
          <span>
            Working offline • Crisis support still available
            {reconnectAttempts > 0 && ` • Retry ${reconnectAttempts}`}
          </span>
        ) : connectionQuality === 'slow' ? (
          <span>Slow connection • Take your time</span>
        ) : (
          <span>Connected</span>
        )}
      </div>
    </div>
  );
}

// Hook for network status in other components
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator?.onLine ?? true);
  const [connectionQuality, setConnectionQuality] = useState<'fast' | 'slow' | 'offline'>('fast');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionQuality };
}