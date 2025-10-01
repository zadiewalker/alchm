'use client';

import { useEffect, useState } from 'react';

/**
 * MobileAuthOptimizer
 * 
 * Optimizes authentication flows for mobile browsers, especially for users in emotional distress.
 * Handles iOS Safari and Android Chrome specific behaviors to ensure smooth sign-in.
 */
export default function MobileAuthOptimizer() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    // Detect mobile platforms
    const userAgent = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
    setIsAndroid(/Android/.test(userAgent));
    setViewportHeight(window.innerHeight);

    // iOS Safari specific optimizations
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      // Prevent zoom on input focus - critical for sign-in forms
      const inputs = document.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        (input as HTMLElement).style.fontSize = '16px';
      });

      // Handle viewport changes for keyboard appearance
      const handleViewportChange = () => {
        const currentHeight = window.innerHeight;
        if (currentHeight < viewportHeight * 0.75) {
          document.body.classList.add('ios-keyboard-active');
        } else {
          document.body.classList.remove('ios-keyboard-active');
        }
      };

      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('orientationchange', handleViewportChange);

      // CSS for iOS safe areas and keyboard handling
      const iosStyles = document.createElement('style');
      iosStyles.textContent = `
        @supports (padding: max(0px)) {
          .ios-safe-area {
            padding-top: max(20px, env(safe-area-inset-top));
            padding-bottom: max(20px, env(safe-area-inset-bottom));
            padding-left: max(16px, env(safe-area-inset-left));
            padding-right: max(16px, env(safe-area-inset-right));
          }
          
          .ios-keyboard-active {
            padding-bottom: 0 !important;
          }
          
          .ios-keyboard-active .crisis-floating-button {
            bottom: 10px !important;
          }
        }
        
        /* Prevent iOS Safari bounce scrolling during auth */
        .auth-page {
          position: fixed;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        
        .auth-content {
          height: 100vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Fix for iOS Safari address bar hiding */
        .ios-viewport-fix {
          height: 100vh;
          height: -webkit-fill-available;
        }
      `;
      document.head.appendChild(iosStyles);

      return () => {
        window.removeEventListener('resize', handleViewportChange);
        window.removeEventListener('orientationchange', handleViewportChange);
      };
    }

    // Android Chrome specific optimizations
    if (/Android/.test(userAgent)) {
      // Handle address bar behavior
      const initialHeight = window.innerHeight;
      
      const handleAndroidResize = () => {
        const currentHeight = window.innerHeight;
        
        // Detect keyboard appearance (significant height change)
        if (currentHeight < initialHeight * 0.75) {
          document.body.classList.add('android-keyboard-active');
        } else {
          document.body.classList.remove('android-keyboard-active');
        }
        
        // Handle address bar hiding/showing
        if (Math.abs(currentHeight - initialHeight) < 150) {
          document.body.classList.toggle('android-address-bar-hidden', currentHeight > initialHeight);
        }
      };

      window.addEventListener('resize', handleAndroidResize);

      // Android-specific styles
      const androidStyles = document.createElement('style');
      androidStyles.textContent = `
        /* Android keyboard handling */
        .android-keyboard-active {
          padding-bottom: 0 !important;
        }
        
        .android-keyboard-active .crisis-floating-button {
          bottom: 10px !important;
        }
        
        /* Android address bar compensation */
        .android-address-bar-hidden .main-content {
          padding-bottom: 56px;
        }
        
        /* Prevent text zoom on rotation */
        html {
          -webkit-text-size-adjust: none;
          text-size-adjust: none;
        }
        
        /* Optimize touch targets for Android */
        .touch-target {
          min-height: 48px;
          min-width: 48px;
        }
        
        /* Hardware acceleration for smoother interactions */
        .btn-android-optimized {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `;
      document.head.appendChild(androidStyles);

      // Hardware back button handling for auth flows
      const handlePopState = (event: PopStateEvent) => {
        // Provide gentle feedback for back navigation during auth
        if (navigator.vibrate) {
          navigator.vibrate([25, 10, 25]);
        }
        
        // If user is in middle of sign-in, confirm navigation
        const isSigningIn = document.querySelector('.signing-in-state');
        if (isSigningIn) {
          event.preventDefault();
          const shouldExit = confirm('Are you sure you want to leave? Your sign-in progress will be lost.');
          if (shouldExit) {
            window.history.back();
          }
        }
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('resize', handleAndroidResize);
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [viewportHeight]);

  useEffect(() => {
    // General mobile optimizations for auth flows
    
    // Prevent pull-to-refresh during auth
    let touchStartY = 0;
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };
    
    const preventPullToRefreshMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touchY = e.touches[0].clientY;
        const touchDiff = touchY - touchStartY;
        
        // Prevent pull-to-refresh if scrolled to top and pulling down
        if (window.scrollY === 0 && touchDiff > 0) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('touchstart', preventPullToRefresh, { passive: false });
    document.addEventListener('touchmove', preventPullToRefreshMove, { passive: false });

    // Optimize popup positioning for auth
    const optimizePopupPositioning = () => {
      const style = document.createElement('style');
      style.textContent = `
        /* Ensure auth popups are visible on mobile */
        .firebase-auth-popup {
          max-width: 90vw !important;
          max-height: 90vh !important;
          left: 5vw !important;
          top: 5vh !important;
        }
        
        /* Crisis-safe auth error handling */
        .auth-error-container {
          background: rgba(164, 183, 146, 0.95);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(197, 165, 165, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin: 16px;
          color: #6b7556;
          font-size: 16px;
          line-height: 1.5;
          text-align: center;
        }
        
        .auth-error-container .error-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        
        .auth-error-container .error-message {
          font-weight: 500;
          margin-bottom: 8px;
        }
        
        .auth-error-container .error-help {
          font-size: 14px;
          opacity: 0.8;
        }
        
        /* Loading states optimized for anxiety */
        .auth-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px 20px;
        }
        
        .auth-loading .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(164, 183, 146, 0.3);
          border-top: 3px solid #a4b792;
          border-radius: 50%;
          animation: gentle-spin 1s linear infinite;
        }
        
        @keyframes gentle-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .auth-loading .loading-text {
          color: #6b7556;
          font-size: 16px;
          font-weight: 500;
          text-align: center;
        }
        
        .auth-loading .loading-subtext {
          color: rgba(107, 117, 86, 0.7);
          font-size: 14px;
          text-align: center;
          max-width: 300px;
          line-height: 1.4;
        }
      `;
      document.head.appendChild(style);
    };

    optimizePopupPositioning();

    return () => {
      document.removeEventListener('touchstart', preventPullToRefresh);
      document.removeEventListener('touchmove', preventPullToRefreshMove);
    };
  }, []);

  // Apply platform-specific classes to body
  useEffect(() => {
    if (isIOS) {
      document.body.classList.add('ios-device');
    }
    if (isAndroid) {
      document.body.classList.add('android-device');
    }
    
    return () => {
      document.body.classList.remove('ios-device', 'android-device');
    };
  }, [isIOS, isAndroid]);

  // This component doesn't render anything visible - it only applies optimizations
  return null;
}

// Helper function to detect if user is in crisis mode for enhanced auth support
export function enhanceAuthForCrisisMode() {
  const isCrisisMode = document.body.classList.contains('crisis-mode');
  
  if (isCrisisMode) {
    // Add extra visual and haptic feedback for auth actions
    const authButtons = document.querySelectorAll('[data-auth-button]');
    authButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      });
      
      // Increase touch target size in crisis mode
      (button as HTMLElement).style.minHeight = '72px';
      (button as HTMLElement).style.minWidth = '200px';
      (button as HTMLElement).style.padding = '20px';
    });
  }
}