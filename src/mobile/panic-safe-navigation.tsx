'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  crisisLevel: 'safe' | 'elevated' | 'crisis';
  description: string;
  immediateHelp?: boolean;
}

interface PanicSafeNavigationProps {
  currentPath?: string;
  emergencyMode?: boolean;
  onNavigationStart?: () => void;
  onNavigationComplete?: () => void;
  crisisLevel?: 'stable' | 'elevated' | 'crisis';
}

const CORE_NAVIGATION: NavigationItem[] = [
  {
    id: 'crisis-help',
    label: 'Get Help Now',
    path: '/crisis-resources',
    icon: '🆘',
    crisisLevel: 'crisis',
    description: 'Immediate crisis support and emergency contacts',
    immediateHelp: true
  },
  {
    id: 'journal',
    label: 'Write',
    path: '/journal',
    icon: '✏️',
    crisisLevel: 'safe',
    description: 'Express your feelings in a safe space'
  },
  {
    id: 'dashboard',
    label: 'Home',
    path: '/dashboard',
    icon: '🏠',
    crisisLevel: 'safe',
    description: 'Your personal sanctuary dashboard'
  },
  {
    id: 'community',
    label: 'Connect',
    path: '/community',
    icon: '🤝',
    crisisLevel: 'elevated',
    description: 'Connect with supportive community'
  },
  {
    id: 'therapist',
    label: 'Therapist',
    path: '/therapist-contact',
    icon: '👩‍⚕️',
    crisisLevel: 'elevated',
    description: 'Contact your mental health professional'
  }
];

const EMERGENCY_NAVIGATION: NavigationItem[] = [
  {
    id: 'crisis-help',
    label: 'Crisis Support',
    path: '/crisis-resources',
    icon: '🆘',
    crisisLevel: 'crisis',
    description: 'Emergency help and crisis hotlines',
    immediateHelp: true
  },
  {
    id: 'breathe',
    label: 'Breathe',
    path: '/breathe',
    icon: '🫁',
    crisisLevel: 'safe',
    description: 'Guided breathing exercises'
  },
  {
    id: 'safe-space',
    label: 'Safe Space',
    path: '/safe-space',
    icon: '🛡️',
    crisisLevel: 'safe',
    description: 'Calm, protective environment'
  }
];

export function PanicSafeNavigation({
  currentPath,
  emergencyMode = false,
  onNavigationStart,
  onNavigationComplete,
  crisisLevel = 'stable'
}: PanicSafeNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [navigationVisible, setNavigationVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const currentPathRef = useRef(currentPath || pathname);

  // Update current path reference
  useEffect(() => {
    currentPathRef.current = currentPath || pathname;
  }, [currentPath, pathname]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Choose navigation items based on emergency mode
  const navigationItems = emergencyMode ? EMERGENCY_NAVIGATION : CORE_NAVIGATION;

  // Filter items based on crisis level
  const visibleItems = navigationItems.filter(item => {
    if (crisisLevel === 'crisis') {
      return item.crisisLevel === 'crisis' || item.crisisLevel === 'safe';
    }
    if (crisisLevel === 'elevated') {
      return item.crisisLevel !== 'crisis' || item.immediateHelp;
    }
    return true;
  });

  // Panic-safe navigation with confirmation for critical actions
  const handleNavigation = useCallback(async (item: NavigationItem) => {
    const now = Date.now();
    
    // Prevent accidental double-taps
    if (now - lastTapTime < 300) {
      return;
    }
    setLastTapTime(now);

    // Skip if already on the page
    if (currentPathRef.current === item.path) {
      return;
    }

    setIsNavigating(true);
    onNavigationStart?.();

    try {
      // For crisis resources, navigate immediately
      if (item.immediateHelp) {
        await router.push(item.path);
        return;
      }

      // Add slight delay for visual feedback on other navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      await router.push(item.path);
      
    } catch (error) {
      console.error('Navigation failed:', error);
      
      // Fallback navigation strategy
      try {
        window.location.href = item.path;
      } catch (fallbackError) {
        console.error('Fallback navigation failed:', fallbackError);
        
        // Show error message but don't crash
        alert(`Navigation failed. Please try again or contact support.`);
      }
    } finally {
      setIsNavigating(false);
      onNavigationComplete?.();
    }
  }, [lastTapTime, router, onNavigationStart, onNavigationComplete]);

  // Emergency escape - triple tap to reveal crisis resources
  const handleEmergencyTap = useCallback(() => {
    const crisisItem = navigationItems.find(item => item.immediateHelp);
    if (crisisItem) {
      handleNavigation(crisisItem);
    }
  }, [navigationItems, handleNavigation]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Emergency shortcut: Ctrl/Cmd + Shift + H
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        handleEmergencyTap();
        return;
      }

      // Escape key to show/hide navigation
      if (event.key === 'Escape') {
        setNavigationVisible(!navigationVisible);
        return;
      }

      // Number keys for quick navigation
      const numKey = parseInt(event.key);
      if (numKey >= 1 && numKey <= visibleItems.length) {
        event.preventDefault();
        const targetItem = visibleItems[numKey - 1];
        if (targetItem) {
          handleNavigation(targetItem);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleEmergencyTap, navigationVisible, visibleItems, handleNavigation]);

  // Auto-hide navigation on scroll (mobile optimization)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navigation when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavigationVisible(false);
      } else {
        setNavigationVisible(true);
      }
      
      lastScrollY = currentScrollY;

      // Show navigation after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setNavigationVisible(true);
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {navigationVisible && (
        <motion.nav
          ref={navigationRef}
          className="panic-safe-navigation"
          initial={{ y: reducedMotion ? 0 : 100, opacity: reducedMotion ? 1 : 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reducedMotion ? 0 : 100, opacity: reducedMotion ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
          aria-label="Main navigation"
          role="navigation"
        >
          {/* Crisis indicator */}
          {(crisisLevel !== 'stable' || emergencyMode) && (
            <div className="crisis-indicator-nav" aria-live="polite">
              <span className="crisis-dot" />
              <span className="sr-only">
                {emergencyMode ? 'Emergency mode active' : 'Crisis support available'}
              </span>
            </div>
          )}

          {/* Navigation items */}
          <div className="nav-items" role="list">
            {visibleItems.map((item, index) => {
              const isActive = currentPathRef.current === item.path;
              const isCrisisItem = item.immediateHelp;
              
              return (
                <motion.button
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''} ${isCrisisItem ? 'crisis-item' : ''}`}
                  onClick={() => handleNavigation(item)}
                  disabled={isNavigating && !isCrisisItem}
                  whileTap={reducedMotion ? undefined : { scale: 0.95 }}
                  aria-label={`${item.label}: ${item.description}${isActive ? ' (current page)' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  title={`${item.label} (${index + 1})`}
                  role="listitem"
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="nav-label">{item.label}</span>
                  <span className="nav-description">{item.description}</span>
                  
                  {/* Loading indicator */}
                  {isNavigating && !isCrisisItem && (
                    <div className="loading-indicator" aria-hidden="true">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                  
                  {/* Shortcut indicator */}
                  <span className="nav-shortcut" aria-hidden="true">
                    {index + 1}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Emergency tap area - invisible but functional */}
          <button
            className="emergency-tap-area"
            onClick={handleEmergencyTap}
            aria-label="Emergency access to crisis support (triple tap)"
            onTouchStart={(e) => {
              e.preventDefault();
              handleEmergencyTap();
            }}
          >
            <span className="sr-only">Emergency help</span>
          </button>

          {/* Keyboard shortcuts info */}
          <div className="keyboard-shortcuts" aria-hidden="true">
            <small>Press 1-{visibleItems.length} for quick access • Ctrl+Shift+H for emergency</small>
          </div>

          <style jsx>{`
            .panic-safe-navigation {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              background: rgba(255, 255, 255, 0.95);
              backdrop-filter: blur(10px);
              border-top: 1px solid rgba(0, 0, 0, 0.1);
              padding: 8px 16px 16px;
              z-index: 1000;
              box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            }

            .crisis-indicator-nav {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 8px;
              background: #ff6b6b;
              color: white;
              border-radius: 4px;
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 500;
            }

            .crisis-dot {
              width: 6px;
              height: 6px;
              background: white;
              border-radius: 50%;
              animation: ${reducedMotion ? 'none' : 'pulse 2s infinite'};
            }

            .nav-items {
              display: flex;
              gap: 8px;
              justify-content: space-between;
              max-width: 600px;
              margin: 0 auto;
            }

            .nav-item {
              flex: 1;
              min-height: 64px;
              padding: 12px 8px;
              border: none;
              border-radius: 12px;
              background: #f8f9fa;
              color: #333;
              cursor: pointer;
              transition: ${reducedMotion ? 'none' : 'all 0.2s ease'};
              position: relative;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 4px;
              min-width: 56px;
              touch-action: manipulation;
              -webkit-tap-highlight-color: transparent;
            }

            .nav-item:hover,
            .nav-item:focus {
              background: #e9ecef;
              transform: ${reducedMotion ? 'none' : 'translateY(-2px)'};
            }

            .nav-item:focus {
              outline: 3px solid #4A90E2;
              outline-offset: 2px;
            }

            .nav-item.active {
              background: #4A90E2;
              color: white;
            }

            .nav-item.crisis-item {
              background: #ff4444;
              color: white;
              animation: ${reducedMotion ? 'none' : 'subtle-pulse 3s infinite'};
            }

            .nav-item.crisis-item:hover {
              background: #ff3333;
            }

            .nav-item:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            .nav-icon {
              font-size: 20px;
              line-height: 1;
            }

            .nav-label {
              font-size: 12px;
              font-weight: 600;
              line-height: 1.2;
              text-align: center;
            }

            .nav-description {
              display: none;
              font-size: 10px;
              opacity: 0.8;
              text-align: center;
              line-height: 1.2;
            }

            .nav-shortcut {
              position: absolute;
              top: 2px;
              right: 4px;
              font-size: 10px;
              opacity: 0.6;
              background: rgba(255, 255, 255, 0.8);
              color: #333;
              padding: 2px 4px;
              border-radius: 3px;
            }

            .nav-item.active .nav-shortcut {
              background: rgba(255, 255, 255, 0.9);
            }

            .nav-item.crisis-item .nav-shortcut {
              background: rgba(255, 255, 255, 0.9);
              color: #333;
            }

            .loading-indicator {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(255, 255, 255, 0.9);
              border-radius: 50%;
              padding: 8px;
            }

            .loading-spinner {
              width: 16px;
              height: 16px;
              border: 2px solid #ddd;
              border-top: 2px solid #4A90E2;
              border-radius: 50%;
              animation: ${reducedMotion ? 'none' : 'spin 1s linear infinite'};
            }

            .emergency-tap-area {
              position: absolute;
              top: -20px;
              left: 0;
              right: 0;
              height: 20px;
              background: transparent;
              border: none;
              cursor: pointer;
              opacity: 0;
            }

            .keyboard-shortcuts {
              text-align: center;
              padding-top: 4px;
              opacity: 0.6;
            }

            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }

            /* Emergency mode styling */
            :global(.emergency-mode) .panic-safe-navigation {
              background: rgba(26, 26, 26, 0.95);
            }

            :global(.emergency-mode) .nav-item {
              background: #333;
              color: white;
              min-height: 72px;
              font-size: 14px;
            }

            :global(.emergency-mode) .nav-item:hover {
              background: #444;
            }

            :global(.emergency-mode) .nav-item.active {
              background: #4A90E2;
            }

            /* High contrast mode */
            @media (prefers-contrast: high) {
              .panic-safe-navigation {
                background: white;
                border-top: 2px solid black;
              }

              .nav-item {
                background: white;
                border: 2px solid black;
                color: black;
              }

              .nav-item.active {
                background: black;
                color: white;
              }

              .nav-item:focus {
                outline: 4px solid blue;
              }
            }

            /* Large text support */
            @media (prefers-font-size: large) {
              .nav-label {
                font-size: 14px;
              }

              .nav-description {
                font-size: 12px;
              }

              .nav-item {
                min-height: 80px;
              }
            }

            /* Landscape orientation */
            @media (orientation: landscape) and (max-height: 500px) {
              .nav-items {
                gap: 4px;
              }

              .nav-item {
                min-height: 48px;
                padding: 8px 4px;
              }

              .nav-icon {
                font-size: 16px;
              }

              .nav-label {
                font-size: 10px;
              }
            }

            /* Small screens */
            @media (max-width: 360px) {
              .nav-items {
                gap: 4px;
              }

              .nav-item {
                padding: 8px 4px;
                min-width: 48px;
              }

              .nav-label {
                font-size: 10px;
              }
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }

            @keyframes subtle-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.9; }
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}

export default PanicSafeNavigation;