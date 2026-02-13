'use client';

import { useEffect } from 'react';

export default function IOSWebViewFix() {
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isCapacitor = !!(window as any).Capacitor;
    
    if (isIOS && isCapacitor) {
      console.log('🍎 iOS Capacitor detected, applying WebView fixes...');
      
      // Force viewport meta tag for iOS WebView
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Force body background immediately for iOS
      document.body.style.background = 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)';
      document.documentElement.style.background = 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)';
      
      // Add iOS-specific styles
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
        }
        
        html, body {
          height: 100vh;
          overflow-x: hidden;
          background: linear-gradient(to bottom, #8B9A7C, #A8B5A0) !important;
        }
        
        #__next {
          min-height: 100vh;
          background: linear-gradient(to bottom, #8B9A7C, #A8B5A0);
        }
      `;
      document.head.appendChild(style);
      
      console.log('🍎 iOS WebView initialization complete');
    }
  }, []);

  return null;
}
