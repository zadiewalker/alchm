'use client';

import { useEffect, useState } from 'react';

/**
 * Dynamic Style Loader for ALCHM Performance Optimization
 * 
 * Loads non-critical CSS after initial render to improve:
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP) 
 * - Time to Interactive (TTI)
 * 
 * Critical for users in crisis who need immediate access
 */

interface StyleLoaderProps {
  /** Load styles only when user interacts (saves bandwidth for crisis users) */
  loadOnInteraction?: boolean;
  /** Preload styles for likely next pages */
  preloadNextPageStyles?: boolean;
}

const CORE_STYLES = [
  // Essential trauma-informed styles
  '/styles/mobile-trauma-informed.css',
  '/styles/mobile-crisis-core.css',
  
  // Core foundation (smallest first)
  '/styles/mobile-compatibility.css',
] as const;

const ENHANCED_STYLES = [
  // Visual enhancements (load after core functionality)
  '/styles/sanctuary.css',
  '/styles/jony-ive-sage-system.css',
  
  // Design system (load last)
  '/styles/alchm-design-system.css',
] as const;

export default function StyleLoader({ 
  loadOnInteraction = false,
  preloadNextPageStyles = false 
}: StyleLoaderProps) {
  const [coreLoaded, setCoreLoaded] = useState(false);
  const [enhancedLoaded, setEnhancedLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(!loadOnInteraction);

  useEffect(() => {
    // Load core styles immediately after critical render
    const loadCoreStyles = () => {
      CORE_STYLES.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'all';
        document.head.appendChild(link);
      });
      setCoreLoaded(true);
    };

    // Use requestIdleCallback or fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadCoreStyles, { timeout: 1000 });
    } else {
      setTimeout(loadCoreStyles, 100);
    }
  }, []);

  useEffect(() => {
    if (!coreLoaded || !userInteracted) return;

    // Load enhanced styles after core styles and user interaction
    const loadEnhancedStyles = () => {
      ENHANCED_STYLES.forEach((href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.media = 'all';
        document.head.appendChild(link);
      });
      setEnhancedLoaded(true);
    };

    // Delay enhanced styles to not block interactions
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadEnhancedStyles, { timeout: 2000 });
    } else {
      setTimeout(loadEnhancedStyles, 500);
    }
  }, [coreLoaded, userInteracted]);

  useEffect(() => {
    if (loadOnInteraction && !userInteracted) {
      const handleInteraction = () => {
        setUserInteracted(true);
        // Remove listeners after first interaction
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };

      document.addEventListener('click', handleInteraction, { passive: true });
      document.addEventListener('scroll', handleInteraction, { passive: true });
      document.addEventListener('touchstart', handleInteraction, { passive: true });

      return () => {
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('scroll', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };
    }
  }, [loadOnInteraction, userInteracted]);

  // Preload next page styles on hover/focus
  useEffect(() => {
    if (!preloadNextPageStyles || !enhancedLoaded) return;

    const preloadStyles = ['journal', 'dashboard', 'pricing'].map(page => 
      `/styles/${page}.css`
    );

    const handleLinkHover = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.href) {
        const page = target.pathname.split('/')[1];
        const styleUrl = `/styles/${page}.css`;
        
        if (preloadStyles.includes(styleUrl)) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'style';
          link.href = styleUrl;
          document.head.appendChild(link);
        }
      }
    };

    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    document.addEventListener('focusin', handleLinkHover, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
      document.removeEventListener('focusin', handleLinkHover);
    };
  }, [preloadNextPageStyles, enhancedLoaded]);

  // No visual render - this is a utility component
  return null;
}