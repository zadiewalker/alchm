'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  transitionDuration?: number;
  preserveScroll?: boolean;
}

export default function PageTransitionWrapper({ 
  children, 
  transitionDuration = 400,
  preserveScroll = false
}: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward' | 'fade'>('fade');

  useEffect(() => {
    // Handle browser back/forward navigation
    const handlePopState = (event: PopStateEvent) => {
      const direction = event.state?.direction || 'backward';
      setTransitionDirection(direction);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Detect transition direction based on route hierarchy
    const getTransitionDirection = (newPath: string, prevPath?: string): 'forward' | 'backward' | 'fade' => {
      if (!prevPath) return 'fade';
      
      // Route hierarchy for determining direction
      const routeHierarchy = [
        '/',
        '/auth/login',
        '/dashboard',
        '/journal',
        '/pathways',
        '/badges',
        '/settings'
      ];
      
      const newIndex = routeHierarchy.findIndex(route => newPath.startsWith(route));
      const prevIndex = routeHierarchy.findIndex(route => prevPath.startsWith(route));
      
      if (newIndex > prevIndex) return 'forward';
      if (newIndex < prevIndex) return 'backward';
      return 'fade';
    };

    const previousPath = sessionStorage.getItem('alchm_previous_path');
    const direction = getTransitionDirection(pathname, previousPath || undefined);
    setTransitionDirection(direction);

    if (previousPath && previousPath !== pathname) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
        
        // Restore scroll position if needed
        if (preserveScroll) {
          const savedScrollPosition = sessionStorage.getItem(`scroll_${pathname}`);
          if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10));
          }
        } else {
          // Smooth scroll to top for new pages
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }

    // Save current path for next transition
    sessionStorage.setItem('alchm_previous_path', pathname);
    
    // Save scroll position
    if (preserveScroll) {
      const handleScroll = () => {
        sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
    
    return undefined;
  }, [pathname, children, transitionDuration, preserveScroll]);

  const getTransitionStyles = () => {
    const baseStyles = {
      width: '100%',
      height: '100%',
      transition: `all ${transitionDuration}ms var(--ease-sanctuary)`,
    };

    if (!isTransitioning) {
      return {
        ...baseStyles,
        opacity: 1,
        transform: 'translateX(0) scale(1)',
        filter: 'blur(0px)'
      };
    }

    switch (transitionDirection) {
      case 'forward':
        return {
          ...baseStyles,
          opacity: 0.3,
          transform: 'translateX(-20px) scale(0.98)',
          filter: 'blur(2px)'
        };
        
      case 'backward':
        return {
          ...baseStyles,
          opacity: 0.3,
          transform: 'translateX(20px) scale(0.98)',
          filter: 'blur(2px)'
        };
        
      case 'fade':
      default:
        return {
          ...baseStyles,
          opacity: 0.3,
          transform: 'scale(0.98)',
          filter: 'blur(2px)'
        };
    }
  };

  return (
    <div style={getTransitionStyles()}>
      {displayChildren}
      
      {/* Loading overlay for transitions */}
      {isTransitioning && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%)',
          zIndex: 9999,
          animation: `sanctuary-loading ${transitionDuration}ms ease-out`
        }} />
      )}
    </div>
  );
}

// CSS for loading animation
const loadingKeyframes = `
  @keyframes sanctuary-loading {
    0% { transform: translateX(-100%); }
    50% { transform: translateX(0%); }
    100% { transform: translateX(100%); }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'page-transition-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = loadingKeyframes;
    document.head.appendChild(style);
  }
}