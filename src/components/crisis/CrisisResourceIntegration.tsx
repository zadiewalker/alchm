'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CrisisResourceIntegrationProps {
  children: React.ReactNode;
  userId?: string;
  emergencyMode?: boolean;
}

interface CrisisAlert {
  level: 'none' | 'gentle' | 'supportive' | 'immediate';
  confidence: number;
  timestamp: number;
  source: string;
}

// Crisis detection integration for the crisis resources page
export function CrisisResourceIntegration({ 
  children, 
  userId, 
  emergencyMode = false 
}: CrisisResourceIntegrationProps) {
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for crisis alerts from the main application
    const checkCrisisStatus = () => {
      try {
        // Check localStorage for crisis detection results
        const storedAlert = localStorage.getItem('alchm-crisis-alert');
        if (storedAlert) {
          const alert = JSON.parse(storedAlert);
          const alertAge = Date.now() - alert.timestamp;
          
          // Only process alerts from the last 5 minutes
          if (alertAge < 300000) {
            setCrisisAlert(alert);
            
            // Clear the alert after processing
            localStorage.removeItem('alchm-crisis-alert');
            
            // If immediate crisis, ensure emergency mode is activated
            if (alert.level === 'immediate') {
              const url = new URL(window.location.href);
              if (!url.searchParams.has('emergency')) {
                url.searchParams.set('emergency', 'true');
                window.history.replaceState({}, '', url.toString());
              }
            }
          }
        }
        
        // Check for crisis detection from session storage (real-time)
        const realtimeAlert = sessionStorage.getItem('alchm-realtime-crisis');
        if (realtimeAlert) {
          const alert = JSON.parse(realtimeAlert);
          setCrisisAlert(alert);
          sessionStorage.removeItem('alchm-realtime-crisis');
        }
      } catch (error) {
        console.warn('Crisis status check failed:', error);
      }
    };

    checkCrisisStatus();

    // Listen for crisis alerts from other parts of the application
    const handleCrisisMessage = (event: MessageEvent) => {
      if (event.data.type === 'CRISIS_DETECTED' && event.data.alert) {
        setCrisisAlert(event.data.alert);
        
        // Navigate to crisis resources if not already there
        if (!window.location.pathname.includes('crisis-resources')) {
          router.push('/crisis-resources?emergency=true');
        }
      }
    };

    window.addEventListener('message', handleCrisisMessage);

    // Monitor page visibility for crisis safety
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
      
      // If user hides crisis page, show floating emergency button
      if (document.hidden && window.location.pathname.includes('crisis')) {
        setShowFloatingButton(true);
        
        // Store that user was on crisis page (for safety monitoring)
        sessionStorage.setItem('alchm-crisis-page-visit', Date.now().toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Emergency keyboard shortcuts
    const handleKeyPress = (event: KeyboardEvent) => {
      // F1 for emergency call
      if (event.key === 'F1') {
        event.preventDefault();
        window.location.href = 'tel:988';
      }
      
      // Ctrl+Shift+X for quick exit
      if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        event.preventDefault();
        window.history.replaceState({}, '', 'about:blank');
        window.location.href = 'https://www.google.com';
      }
      
      // Escape to minimize crisis interface (safety feature)
      if (event.key === 'Escape' && window.location.pathname.includes('crisis')) {
        window.history.back();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Performance monitoring for crisis page
    if (typeof window !== 'undefined' && 'performance' in window) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 3000) {
        console.warn(`Crisis page load time: ${loadTime}ms - exceeds 3s target`);
      }
      
      // Mark crisis resources as accessible
      performance.mark('crisis-resources-accessible');
    }

    return () => {
      window.removeEventListener('message', handleCrisisMessage);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [router]);

  // Auto-scroll to immediate resources if crisis detected
  useEffect(() => {
    if (crisisAlert && crisisAlert.level === 'immediate') {
      setTimeout(() => {
        const emergencySection = document.querySelector('[data-crisis-level="immediate"]');
        if (emergencySection) {
          emergencySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    }
  }, [crisisAlert]);

  // Browser notification for crisis alerts
  useEffect(() => {
    if (crisisAlert && crisisAlert.level === 'immediate') {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Crisis Support Available', {
          body: 'Emergency crisis resources are ready. Tap for immediate help.',
          icon: '/icons/crisis-icon-192.png',
          tag: 'crisis-support',
          requireInteraction: true
        });
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Crisis Support Available', {
              body: 'Emergency crisis resources are ready.',
              icon: '/icons/crisis-icon-192.png'
            });
          }
        });
      }
    }
  }, [crisisAlert]);

  // Service worker integration for offline crisis support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Send crisis status to service worker
        if (registration.active) {
          registration.active.postMessage({
            type: 'CRISIS_PAGE_ACTIVE',
            crisisLevel: crisisAlert?.level || 'none',
            timestamp: Date.now()
          });
        }
      });
    }
  }, [crisisAlert]);

  return (
    <div className={`crisis-resource-integration ${emergencyMode ? 'emergency-mode' : ''}`}>
      {/* Crisis alert banner */}
      {crisisAlert && crisisAlert.level !== 'none' && (
        <div 
          className={`fixed top-0 left-0 right-0 z-40 p-4 text-center text-white font-medium ${
            crisisAlert.level === 'immediate' 
              ? 'bg-red-600 animate-pulse' 
              : 'bg-orange-500'
          }`}
          role="alert"
          aria-live="assertive"
        >
          {crisisAlert.level === 'immediate' 
            ? '🆘 Crisis support detected - Emergency resources below' 
            : '💛 Support resources available - You are not alone'
          }
        </div>
      )}

      {/* Main content with crisis context */}
      <div className={crisisAlert ? 'pt-16' : ''}>
        {children}
      </div>

      {/* Floating emergency button when page is hidden */}
      {showFloatingButton && !isPageVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => {
              window.focus();
              window.location.href = 'tel:988';
            }}
            className="w-12 h-12 bg-red-600 text-white rounded-full shadow-2xl animate-bounce"
            title="Emergency: Call 988"
          >
            🆘
          </button>
        </div>
      )}

      {/* Crisis analytics (privacy-preserving) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Track crisis resource accessibility
            if (typeof window !== 'undefined') {
              const crisisMetrics = {
                pageLoaded: Date.now(),
                hasAlert: ${crisisAlert ? 'true' : 'false'},
                alertLevel: '${crisisAlert?.level || 'none'}',
                userId: '${userId || 'anonymous'}'
              };
              
              // Store for emergency monitoring (local only)
              try {
                const existingMetrics = JSON.parse(localStorage.getItem('alchm-crisis-metrics') || '[]');
                existingMetrics.push(crisisMetrics);
                // Keep only last 5 entries for privacy
                localStorage.setItem('alchm-crisis-metrics', JSON.stringify(existingMetrics.slice(-5)));
              } catch (e) {
                // Ignore storage errors in crisis situations
              }
            }
          `
        }}
      />
    </div>
  );
}