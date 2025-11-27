'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CrisisFloatingButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'default' | 'large';
  autoDetect?: boolean;
  offlineMode?: boolean;
}

export function CrisisFloatingButton({ 
  position = 'bottom-right',
  size = 'default',
  autoDetect = true,
  offlineMode = false
}: CrisisFloatingButtonProps) {
  const [showResources, setShowResources] = useState(false);
  const [isCrisisDetected, setIsCrisisDetected] = useState(false);
  const [isLowBattery, setIsLowBattery] = useState(false);
  const [isOffline, setIsOffline] = useState(typeof window === 'undefined' ? false : !navigator.onLine);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLAnchorElement>(null);
  const batteryRef = useRef<any>(null);
  const batteryHandlersRef = useRef<{
    levelchange?: () => void;
    dischargingtimechange?: () => void;
  }>({});

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6', 
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    default: 'text-xl', // 72px minimum enforced via inline styles
    large: 'text-2xl'   // 80px for crisis detection
  };

  // Enhanced crisis detection and device monitoring
  useEffect(() => {
    if (!autoDetect) return;

    // Battery monitoring for emergency mode with comprehensive fallback
    const monitorBattery = async () => {
      // Check for Battery API support with proper feature detection
      if ('getBattery' in navigator && typeof (navigator as any).getBattery === 'function') {
        try {
          const battery = await (navigator as any).getBattery();
          if (battery && typeof battery.addEventListener === 'function') {
            // Store battery reference for cleanup
            batteryRef.current = battery;
            
            const updateBatteryStatus = () => {
              // Ensure battery properties exist before accessing
              if (typeof battery.level === 'number' && typeof battery.dischargingTime === 'number') {
                setIsLowBattery(battery.level < 0.2 || battery.dischargingTime < 1800);
              }
            };
            
            // Store handlers for proper cleanup
            batteryHandlersRef.current.levelchange = updateBatteryStatus;
            batteryHandlersRef.current.dischargingtimechange = updateBatteryStatus;
            
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('dischargingtimechange', updateBatteryStatus);
            updateBatteryStatus();
          } else {
            console.warn('ALCHM Crisis Support: Battery object invalid, skipping battery monitoring');
          }
        } catch (error) {
          console.warn('ALCHM Crisis Support: Battery API unavailable, crisis functionality continues normally', error);
        }
      } else {
        // Graceful fallback - crisis support continues without battery monitoring
        console.warn('ALCHM Crisis Support: Battery API not supported in this browser, crisis functionality continues normally');
      }
    };

    // Network status monitoring
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Crisis keyword detection
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'cant go on', 'worthless',
      'hopeless', 'want to die', 'hurt myself', 'self harm', 'cutting',
      'overdose', 'pills', 'razor', 'bridge', 'gun', 'rope', 'emergency'
    ];
    
    const detectCrisisLanguage = (e: Event) => {
      try {
        const target = e.target as HTMLTextAreaElement | HTMLInputElement;
        
        // Enhanced input validation and sanitization
        if (!target || !target.value || typeof target.value !== 'string') {
          return;
        }
        
        // Validate target element type for security
        const validInputTypes = ['TEXTAREA', 'INPUT'];
        if (!validInputTypes.includes(target.tagName)) {
          return;
        }
        
        // Sanitize and validate input length (prevent memory issues)
        const rawText = target.value;
        if (rawText.length > 10000) { // Reasonable limit for crisis detection
          console.warn('ALCHM Crisis Detection: Input too long, limiting analysis to first 10000 characters');
        }
        
        // Sanitize input: remove HTML tags, normalize whitespace, handle special characters safely
        const sanitizedText = rawText
          .slice(0, 10000) // Limit processing length
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .replace(/[^\w\s'-]/gi, ' ') // Keep only alphanumeric, whitespace, apostrophes, hyphens
          .toLowerCase()
          .trim();
        
        // Additional validation
        if (!sanitizedText || sanitizedText.length < 3) {
          return; // Ignore very short inputs
        }
        
        // Enhanced keyword matching with word boundaries to reduce false positives
        const containsCrisisKeywords = crisisKeywords.some(keyword => {
          // Use word boundaries for more accurate detection
          const keywordPattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
          return keywordPattern.test(sanitizedText);
        });
        
        if (containsCrisisKeywords && !isCrisisDetected) {
          setIsCrisisDetected(true);
          
          // Enhanced haptic feedback for crisis detection
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          
          // Log crisis detection for monitoring (without sensitive content)
          console.warn('ALCHM Crisis Detection: Crisis language pattern detected - activating enhanced support mode');
        }
      } catch (error) {
        // Graceful error handling - crisis detection failure should not break the app
        console.error('ALCHM Crisis Detection: Error in crisis language detection, continuing normally:', error);
      }
    };
    
    document.addEventListener('input', detectCrisisLanguage);
    monitorBattery();
    
    return () => {
      document.removeEventListener('input', detectCrisisLanguage);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clean up battery event listeners if they exist
      if (batteryRef.current && typeof batteryRef.current.removeEventListener === 'function') {
        try {
          if (batteryHandlersRef.current.levelchange) {
            batteryRef.current.removeEventListener('levelchange', batteryHandlersRef.current.levelchange);
          }
          if (batteryHandlersRef.current.dischargingtimechange) {
            batteryRef.current.removeEventListener('dischargingtimechange', batteryHandlersRef.current.dischargingtimechange);
          }
        } catch (error) {
          console.warn('ALCHM Crisis Support: Error cleaning up battery listeners, no impact on crisis functionality');
        }
      }
    };
  }, [autoDetect, isCrisisDetected]);

  const handleCrisisAccess = () => {
    // Enhanced haptic feedback based on crisis level
    if (navigator.vibrate) {
      const vibrationPattern = isCrisisDetected 
        ? [500, 200, 500, 200, 500] // Emergency pattern
        : [200, 100, 200, 100, 200]; // Standard pattern
      navigator.vibrate(vibrationPattern);
    }
    
    // Smart crisis response based on device and context
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // In offline mode or crisis detected, show resources immediately
      if (isOffline || isCrisisDetected || isLowBattery) {
        setShowResources(true);
        // Focus first actionable element for screen readers
        setTimeout(() => {
          firstFocusableRef.current?.focus();
        }, 100);
      } else if (isMobile) {
        // Direct call to 988 Crisis Lifeline on mobile
        try {
          window.location.href = 'tel:988';
          // Fallback to resources if call fails
          setTimeout(() => setShowResources(true), 3000);
        } catch (error) {
          setShowResources(true);
          setTimeout(() => {
            firstFocusableRef.current?.focus();
          }, 100);
        }
      } else {
        setShowResources(true);
        setTimeout(() => {
          firstFocusableRef.current?.focus();
        }, 100);
      }
    }
  };

  const CrisisResourcesModal = () => (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[10000] p-6 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="crisis-modal-title"
      aria-describedby="crisis-modal-description"
      aria-modal="true"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setShowResources(false);
          setIsCrisisDetected(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto">
        {/* Crisis indicator with appropriate urgency */}
        <div className={`text-7xl mb-6 ${isCrisisDetected ? 'animate-pulse' : ''}`}>
          {isCrisisDetected ? '🚨' : '🆘'}
        </div>
        
        <h2 id="crisis-modal-title" className="text-3xl font-medium text-gray-900 mb-4">
          {isCrisisDetected ? 'Emergency Support Now' : 'Crisis Support Available'}
        </h2>
        
        <p id="crisis-modal-description" className="text-gray-700 mb-8 text-lg leading-relaxed">
          {isCrisisDetected 
            ? 'You are not alone. Help is available right now.'
            : 'If you are having thoughts of self-harm, please reach out immediately.'}
        </p>
        
        {/* Offline resources note */}
        {isOffline && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-medium">📱 You're offline - Crisis resources cached locally</p>
          </div>
        )}
        
        <div className="space-y-4 mb-8">
          {/* Primary crisis line */}
          <a 
            ref={firstFocusableRef}
            href="tel:988"
            className="block w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium py-6 px-8 rounded-2xl transition-colors touch-manipulation focus:outline-none focus:ring-4 focus:ring-red-500/50 mb-2"
            style={{ minHeight: '80px', touchAction: 'manipulation' }}
            aria-label="Call 988 Crisis Lifeline immediately"
          >
            <div className="text-2xl mb-1">📞</div>
            <div>Call 988 Crisis Lifeline</div>
            <div className="text-sm opacity-90">Free • 24/7 • Confidential</div>
          </a>
          
          {/* Text crisis line */}
          <a 
            href="sms:741741?body=HOME"
            className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-6 px-8 rounded-2xl transition-colors touch-manipulation focus:outline-none focus:ring-4 focus:ring-blue-500/50 mb-2"
            style={{ minHeight: '80px', touchAction: 'manipulation' }}
            aria-label="Text HOME to 741741 for crisis support"
          >
            <div className="text-2xl mb-1">💬</div>
            <div>Text HOME to 741741</div>
            <div className="text-sm opacity-90">Crisis Text Line</div>
          </a>
          
          {/* Online chat - only if online */}
          {!isOffline && (
            <a 
              href="https://suicidepreventionlifeline.org/chat/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium py-6 px-8 rounded-2xl transition-colors touch-manipulation focus:outline-none focus:ring-4 focus:ring-green-500/50 mb-2"
              style={{ minHeight: '80px', touchAction: 'manipulation' }}
              aria-label="Start live chat with crisis counselor"
            >
              <div className="text-2xl mb-1">💻</div>
              <div>Live Chat Support</div>
              <div className="text-sm opacity-90">Online counselors</div>
            </a>
          )}
          
          {/* Emergency services for severe crisis */}
          {isCrisisDetected && (
            <a 
              href="tel:911"
              className="block w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium py-6 px-8 rounded-2xl transition-colors touch-manipulation focus:outline-none focus:ring-4 focus:ring-orange-500/50 mb-2"
              style={{ minHeight: '80px', touchAction: 'manipulation' }}
              aria-label="Call 911 for immediate emergency assistance"
            >
              <div className="text-2xl mb-1">🚑</div>
              <div>Call 911</div>
              <div className="text-sm opacity-90">Emergency services</div>
            </a>
          )}
        </div>
        
        {/* Safe dismissal */}
        <button
          onClick={() => {
            setShowResources(false);
            setIsCrisisDetected(false);
            // Return focus to crisis button for accessibility
            setTimeout(() => {
              buttonRef.current?.focus();
            }, 100);
          }}
          className="w-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 font-medium py-5 px-8 rounded-2xl transition-colors touch-manipulation focus:outline-none focus:ring-4 focus:ring-gray-500/50 mt-4"
          style={{ minHeight: '72px', touchAction: 'manipulation' }}
          aria-label="Close crisis resources - I am safe now"
        >
          ✅ I'm Safe Now - Close
        </button>
        
        {/* Battery warning */}
        {isLowBattery && (
          <div className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl">
            🔋 Low battery detected - Crisis resources remain available offline
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleCrisisAccess}
        className={`
          fixed z-[9999] ${positionClasses[position]} ${sizeClasses[size]}
          ${isCrisisDetected ? 'bg-red-600 animate-pulse' : 'bg-red-500'}
          ${isLowBattery ? 'bg-orange-500' : ''}
          hover:bg-red-600 active:bg-red-700 text-white
          rounded-full shadow-xl hover:shadow-2xl
          flex items-center justify-center
          transition-all duration-200 ease-out
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:ring-offset-2
          border-2 border-white/30
        `}
        style={{
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(220, 38, 38, 0.3)',
          minHeight: size === 'large' ? '80px' : '72px', // Trauma-informed minimums
          minWidth: size === 'large' ? '80px' : '72px',
          width: size === 'large' ? '80px' : '72px',
          height: size === 'large' ? '80px' : '72px',
          bottom: `max(${position.includes('bottom') ? '40px' : 'auto'}, env(safe-area-inset-bottom, 40px))`,
          right: `max(${position.includes('right') ? '40px' : 'auto'}, env(safe-area-inset-right, 40px))`,
          left: `max(${position.includes('left') ? '40px' : 'auto'}, env(safe-area-inset-left, 40px))`,
          top: `max(${position.includes('top') ? '40px' : 'auto'}, env(safe-area-inset-top, 40px))`
        }}
        title={`${isCrisisDetected ? 'CRISIS DETECTED - ' : ''}Emergency Crisis Support - Tap for immediate help`}
        aria-label={`${isCrisisDetected ? 'Crisis detected - ' : ''}Emergency Crisis Support`}
        aria-pressed={showResources}
        aria-expanded={showResources}
      >
        <span className="sr-only">
          {isCrisisDetected ? 'Crisis detected - ' : ''}Emergency crisis support button. 
          {isOffline ? 'Offline resources available. ' : ''}
          {isLowBattery ? 'Low battery mode. ' : ''}
          Tap for immediate help.
        </span>
        <span aria-hidden="true" className={isCrisisDetected ? 'animate-bounce' : ''}>
          {isCrisisDetected ? '🚨' : isLowBattery ? '⚡' : '🆘'}
        </span>
      </button>

      {showResources && <CrisisResourcesModal />}
      
      {/* Offline notification */}
      {isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          📱 Offline - Crisis resources cached
        </div>
      )}
      
      {/* Battery warning for crisis users */}
      {isLowBattery && !isOffline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          🔋 Low battery - Crisis support remains available
        </div>
      )}
    </>
  );
}