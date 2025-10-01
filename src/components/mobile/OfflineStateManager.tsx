'use client';

import { useEffect, useState } from 'react';

interface OfflineStateManagerProps {
  children: React.ReactNode;
}

export default function OfflineStateManager({ children }: OfflineStateManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
      
      // Show brief "back online" message
      const banner = document.createElement('div');
      banner.className = 'online-banner';
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(34, 197, 94, 0.95);
        color: white;
        padding: 12px 16px;
        text-align: center;
        font-weight: 600;
        z-index: 9999;
        backdrop-filter: blur(10px);
        animation: gentle-slide-down 0.3s ease;
      `;
      banner.textContent = '🌐 Back online - All features restored';
      document.body.appendChild(banner);
      
      setTimeout(() => {
        banner.remove();
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
      
      // Vibrate if available (mobile haptic feedback)
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      {showOfflineBanner && (
        <div 
          className="offline-banner"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: 'rgba(245, 158, 11, 0.95)',
            color: 'white',
            padding: 'clamp(12px, 3vw, 16px)',
            textAlign: 'center',
            fontWeight: 600,
            zIndex: 9998,
            backdropFilter: 'blur(10px)',
            animation: 'gentle-slide-down 0.3s ease',
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span aria-hidden="true">📵</span>
            <span>You're offline - Basic features still work</span>
          </div>
        </div>
      )}

      {/* Add offline class to body for styling */}
      <div className={`app-container ${!isOnline ? 'offline-mode' : ''}`}>
        {children}
      </div>

      {/* Offline Crisis Support Modal */}
      {!isOnline && (
        <div
          style={{
            position: 'fixed',
            bottom: 'clamp(20px, 5vw, 40px)',
            right: 'clamp(16px, 4vw, 24px)',
            background: 'rgba(220, 38, 38, 0.95)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            touchAction: 'manipulation',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
            zIndex: 10001,
            animation: 'crisis-pulse 2s infinite'
          }}
          onClick={() => {
            if (navigator.vibrate) navigator.vibrate(200);
            // Try to call even when offline (will use device's cellular)
            window.open('tel:988', '_self');
          }}
          role="button"
          tabIndex={0}
          aria-label="Emergency crisis support - Works offline"
          title="Crisis support works even when offline"
        >
          <span aria-hidden="true" style={{ fontSize: '20px' }}>🆘</span>
          <span className="crisis-text" style={{ whiteSpace: 'nowrap' }}>
            Crisis? Call 988
          </span>
        </div>
      )}
    </>
  );
}

// Hook for components to check online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Component to conditionally render based on online status
export function OnlineOnly({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const isOnline = useOnlineStatus();
  
  return isOnline ? <>{children}</> : <>{fallback}</>;
}

export function OfflineOnly({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  
  return !isOnline ? <>{children}</> : null;
}