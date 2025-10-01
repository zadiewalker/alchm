'use client';

import Script from 'next/script';

// Metadata moved to static export to avoid server component issues
export const crisisMetadata = {
  title: 'Crisis Support Resources - Immediate Help Available 24/7 | ALCHM',
  description: 'Free, confidential crisis support resources available 24/7. Emergency hotlines, text support, and immediate help for mental health crises.',
  keywords: 'crisis support, suicide prevention, mental health emergency, 988, crisis text line, emergency help',
  robots: 'index, follow',
  
  // Open Graph for social sharing
  openGraph: {
    title: 'Crisis Support - Immediate Help Available',
    description: 'Free, confidential crisis support available 24/7',
    type: 'website',
  },
  
  // Critical for mobile crisis access
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1, // Prevent zoom issues during panic
  },
  
  // PWA optimization for offline access
  manifest: '/crisis-mobile-manifest.json',
  
  // Security headers for crisis safety
  other: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
  }
};

interface CrisisLayoutProps {
  children: React.ReactNode;
}

export default function CrisisResourcesLayout({ children }: CrisisLayoutProps) {
  return (
    <>
      {/* Crisis-optimized head */}
      <Script
        id="crisis-performance-monitor"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Crisis performance monitoring
            window.crisisStartTime = Date.now();
            
            // Emergency contact preloader
            try {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/crisis-sw.js');
              }
            } catch (e) {
              console.warn('Crisis service worker registration failed:', e);
            }
            
            // Emergency escape key handler
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey && e.shiftKey && e.key === 'X') {
                // Quick exit: Clear history and redirect to safe site
                window.history.replaceState({}, '', 'about:blank');
                window.location.href = 'https://www.google.com';
              }
            });
            
            // Panic button accessibility
            document.addEventListener('keydown', function(e) {
              if (e.key === 'F1') {
                e.preventDefault();
                window.location.href = 'tel:988';
              }
            });
          `
        }}
      />
      
      {/* Crisis-specific CSS for high contrast and large targets */}
      <style jsx global>{`
        /* Crisis mode overrides */
        .crisis-layout {
          --crisis-red: #dc2626;
          --crisis-red-hover: #b91c1c;
          --crisis-green: #059669;
          --crisis-blue: #2563eb;
          --crisis-text: #1f2937;
          --crisis-bg: #f9fafb;
          --crisis-border: #e5e7eb;
          
          /* High contrast for visibility during panic */
          color-scheme: light;
          forced-color-adjust: auto;
        }
        
        /* Large touch targets for tremor compensation */
        .crisis-touch-target {
          min-width: 80px;
          min-height: 80px;
          padding: 16px;
          touch-action: manipulation;
        }
        
        /* Reduce motion for crisis states */
        @media (prefers-reduced-motion: reduce) {
          .crisis-layout * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Emergency button positioning */
        .crisis-emergency-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--crisis-red);
          color: white;
          border: none;
          font-size: 24px;
          box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
          cursor: pointer;
          touch-action: manipulation;
        }
        
        .crisis-emergency-button:hover,
        .crisis-emergency-button:focus {
          background: var(--crisis-red-hover);
          transform: scale(1.05);
        }
        
        /* Quick exit button */
        .crisis-quick-exit {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9998;
          background: #6b7280;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
        }
        
        /* Offline indicator */
        .crisis-offline-indicator {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #f59e0b;
          color: white;
          text-align: center;
          padding: 8px;
          z-index: 9997;
          font-weight: 600;
        }
        
        /* Accessibility improvements */
        .crisis-layout button:focus,
        .crisis-layout a:focus {
          outline: 3px solid #2563eb;
          outline-offset: 2px;
        }
        
        /* Print styles for offline reference */
        @media print {
          .crisis-emergency-button,
          .crisis-quick-exit,
          .crisis-layout nav {
            display: none !important;
          }
          
          .crisis-layout {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
      
      <div className="crisis-layout min-h-screen">
        {/* Offline status indicator */}
        <div 
          id="crisis-offline-indicator" 
          className="crisis-offline-indicator hidden"
          role="alert"
          aria-live="polite"
        >
          📶 You're offline - Crisis resources still available
        </div>
        
        {/* Quick exit button */}
        <button 
          className="crisis-quick-exit"
          onClick={() => {
            // Clear browsing data and redirect to safe site
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
              });
            }
            window.history.replaceState({}, '', 'about:blank');
            window.location.href = 'https://www.google.com';
          }}
          title="Quick Exit (Ctrl+Shift+X)"
          aria-label="Quickly exit this page for safety"
        >
          ← Quick Exit
        </button>
        
        {/* Main content */}
        <main className="crisis-main">
          {children}
        </main>
        
        {/* Emergency floating button - always accessible */}
        <button 
          className="crisis-emergency-button"
          onClick={() => {
            // Haptic feedback
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
            // Emergency call
            window.location.href = 'tel:988';
          }}
          title="Emergency: Call 988 (Press F1)"
          aria-label="Emergency crisis support - Call 988 immediately"
        >
          🆘
        </button>
      </div>
      
      {/* Crisis mode JavaScript */}
      <Script
        id="crisis-functionality"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Monitor connection status
            function updateConnectionStatus() {
              const indicator = document.getElementById('crisis-offline-indicator');
              if (!navigator.onLine && indicator) {
                indicator.classList.remove('hidden');
              } else if (indicator) {
                indicator.classList.add('hidden');
              }
            }
            
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);
            updateConnectionStatus();
            
            // Performance monitoring for crisis resource loading
            window.addEventListener('load', function() {
              const loadTime = Date.now() - window.crisisStartTime;
              if (loadTime > 3000) {
                console.warn('Crisis page load time exceeded 3 seconds:', loadTime + 'ms');
              }
              
              // Mark successful crisis resource loading
              if (window.performance && window.performance.mark) {
                window.performance.mark('crisis-resources-loaded');
              }
            });
            
            // Emergency escape handlers
            document.addEventListener('visibilitychange', function() {
              if (document.hidden && window.location.pathname.includes('crisis')) {
                // User may be hiding crisis page for safety
                sessionStorage.setItem('crisis-page-hidden', Date.now());
              }
            });
            
            // Voice activation for accessibility (experimental)
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
              const recognition = new SpeechRecognition();
              recognition.continuous = false;
              recognition.lang = 'en-US';
              
              recognition.onresult = function(event) {
                const command = event.results[0][0].transcript.toLowerCase();
                if (command.includes('emergency') || command.includes('help') || command.includes('call')) {
                  window.location.href = 'tel:988';
                }
              };
              
              // Enable voice activation with double-tap
              let tapCount = 0;
              document.addEventListener('click', function() {
                tapCount++;
                setTimeout(() => { tapCount = 0; }, 500);
                if (tapCount === 2) {
                  recognition.start();
                }
              });
            }
          `
        }}
      />
    </>
  );
}