'use client';

import { useEffect } from 'react';

export default function IOSWebViewFix() {
  useEffect(() => {
    // iOS WebView initialization fix
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
      
      // Force render after a short delay
      setTimeout(() => {
        console.log('🍎 iOS WebView initialization complete');
        // Trigger a re-render by slightly modifying the DOM
        const rootEl = document.getElementById('__next');
        if (rootEl && rootEl.innerHTML === '') {
          console.log('⚠️ Root element is empty, triggering fallback render');
          rootEl.innerHTML = `
            <div style="min-height: 100vh; background: linear-gradient(to bottom, #8B9A7C, #A8B5A0); display: flex; align-items: center; justify-content: center; flex-direction: column; color: white; text-align: center; padding: 2rem;">
              <div style="margin-bottom: 2rem;">
                <svg viewBox="0 0 100 100" style="width: 4rem; height: 4rem;">
                  <circle cx="50" cy="12" r="10" fill="#E5C97D" />
                  <circle cx="50" cy="28" r="6" fill="white" fill-opacity="0.8" />
                  <ellipse cx="50" cy="58" rx="18" ry="28" fill="white" fill-opacity="0.8" />
                </svg>
              </div>
              <h1 style="font-size: 2.5rem; font-weight: 200; letter-spacing: 0.3em; margin-bottom: 1rem;">ALCHM</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 2rem;">Your digital sanctuary for healing and transformation</p>
              <a href="/dashboard/" style="background: #E5C97D; color: white; padding: 1rem 2rem; border-radius: 2rem; text-decoration: none; font-size: 0.875rem; letter-spacing: 0.2em; text-transform: uppercase;">Begin Your Journey</a>
            </div>
          `;
        }
      }, 100);
    }
  }, []);

  return null;
}