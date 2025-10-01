/**
 * Panic-Attack Safe Navigation System
 * Gentle, trauma-informed navigation that works during crisis states
 * Philosophy: "Navigation that breathes with you"
 */

"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavigationProps {
  isInCrisis?: boolean;
  userPreferences?: {
    reducedMotion?: boolean;
    highContrast?: boolean;
    largeText?: boolean;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: string;
  priority: 'critical' | 'high' | 'medium';
  crisisOnly?: boolean;
}

const panicSafeNavItems: NavItem[] = [
  { href: '/write', label: 'Write', icon: '✍️', priority: 'high' },
  { href: '/journal', label: 'Journal', icon: '📔', priority: 'high' },
  { href: '/crisis-resources', label: 'Crisis Support', icon: '❤️', priority: 'critical', crisisOnly: true },
  { href: '/dashboard', label: 'Dashboard', icon: '🏠', priority: 'medium' },
  { href: '/pathways', label: 'Pathways', icon: '🌱', priority: 'medium' }
];

export default function PanicSafeNavigation({ isInCrisis = false, userPreferences = {} }: NavigationProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [breathingAnimation, setBreathingAnimation] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  
  // Hide navigation on auth pages to prevent blocking sign-in
  const isAuthPage = pathname?.includes('/auth') || pathname?.includes('/login');
  
  if (isAuthPage) {
    return null;
  }

  // Gentle breathing animation every 6 seconds when in crisis
  useEffect(() => {
    if (!isInCrisis || userPreferences.reducedMotion) return;

    const breathingInterval = setInterval(() => {
      setBreathingAnimation(true);
      setTimeout(() => setBreathingAnimation(false), 2000);
    }, 6000);

    return () => clearInterval(breathingInterval);
  }, [isInCrisis, userPreferences.reducedMotion]);

  // Auto-hide on inactivity during panic attacks to reduce overwhelm
  useEffect(() => {
    if (!isInCrisis) return;

    let hideTimer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(hideTimer);
      setIsVisible(true);
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 10000); // Hide after 10 seconds of inactivity
    };

    const events = ['touchstart', 'touchmove', 'mousemove', 'keydown', 'scroll'];
    events.forEach(event => {
      typeof window !== 'undefined' && window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer(); // Start timer

    return () => {
      clearTimeout(hideTimer);
      events.forEach(event => {
        typeof window !== 'undefined' && window.removeEventListener(event, resetTimer);
      });
    };
  }, [isInCrisis]);

  const getVisibleNavItems = () => {
    if (isInCrisis) {
      // During crisis, show critical items first, then essential navigation
      return panicSafeNavItems.filter(item => 
        item.priority === 'critical' || 
        (item.priority === 'high' && !item.crisisOnly)
      );
    }
    return panicSafeNavItems.filter(item => !item.crisisOnly);
  };

  const navItems = getVisibleNavItems();

  // Crisis mode styles
  const crisisStyles = isInCrisis ? {
    background: 'rgba(220, 38, 38, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '2px solid rgba(220, 38, 38, 0.2)',
    boxShadow: '0 8px 32px rgba(220, 38, 38, 0.15)'
  } : {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(164, 183, 146, 0.2)',
    boxShadow: '0 4px 24px rgba(164, 183, 146, 0.1)'
  };

  return (
    <>
      {/* Floating Navigation - Crisis Accessible */}
      <nav
        ref={navigationRef}
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-25 transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        } ${breathingAnimation && !userPreferences.reducedMotion ? 'animate-gentle-breath' : ''}`}
        style={{
          ...crisisStyles,
          borderRadius: '24px',
          padding: '12px 16px',
          touchAction: 'manipulation',
          maxWidth: '90vw'
        }}
        aria-label={isInCrisis ? "Crisis-safe navigation" : "Main navigation"}
      >
        <div className="flex items-center justify-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isCritical = item.priority === 'critical';
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`touch-target ${isCritical ? 'crisis-accessible' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: isCritical ? '64px' : '52px', // Larger for crisis
                  minHeight: isCritical ? '64px' : '52px',
                  borderRadius: '20px',
                  padding: '8px',
                  textDecoration: 'none',
                  transition: userPreferences.reducedMotion ? 'none' : 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  background: isActive ? 
                    (isCritical ? 'rgba(220, 38, 38, 0.15)' : 'rgba(164, 183, 146, 0.15)') : 
                    'transparent',
                  border: isActive ? 
                    (isCritical ? '2px solid rgba(220, 38, 38, 0.3)' : '2px solid rgba(164, 183, 146, 0.3)') :
                    '2px solid transparent',
                  color: isCritical ? '#dc2626' : (isActive ? '#6b7556' : '#8a8a8a'),
                  fontSize: userPreferences.largeText ? '20px' : '16px',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  if (userPreferences.reducedMotion) return;
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.background = isCritical ? 
                    'rgba(220, 38, 38, 0.2)' : 'rgba(164, 183, 146, 0.2)';
                }}
                onMouseLeave={(e) => {
                  if (userPreferences.reducedMotion) return;
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = isActive ? 
                    (isCritical ? 'rgba(220, 38, 38, 0.15)' : 'rgba(164, 183, 146, 0.15)') : 
                    'transparent';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${isCritical ? 'rgba(220, 38, 38, 0.5)' : 'rgba(164, 183, 146, 0.5)'}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onTouchStart={() => {
                  // Gentle haptic feedback
                  if (typeof window !== 'undefined' && navigator.vibrate) {
                    typeof window !== 'undefined' && navigator.vibrate(isCritical ? [100, 50, 100] : 25);
                  }
                }}
                aria-label={`${item.label}${isCritical ? ' (Emergency)' : ''}${isActive ? ' (Current)' : ''}`}
              >
                <span 
                  style={{ 
                    fontSize: isCritical ? '24px' : '20px',
                    marginBottom: '2px',
                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                  }}
                >
                  {item.icon}
                </span>
                <span 
                  style={{
                    fontSize: userPreferences.largeText ? '14px' : '11px',
                    fontWeight: isActive ? '600' : '500',
                    textAlign: 'center',
                    lineHeight: '1.2'
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Crisis Indicator */}
        {isInCrisis && (
          <div 
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            style={{
              animation: userPreferences.reducedMotion ? 'none' : 'pulse 2s infinite',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
            }}
            aria-label="Crisis mode active"
          >
            <span className="text-white text-xs font-bold">!</span>
          </div>
        )}
      </nav>

      {/* Touch-to-Show Indicator (Crisis Mode) */}
      {isInCrisis && !isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-24"
          style={{
            background: 'rgba(220, 38, 38, 0.9)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: '600',
            touchAction: 'manipulation',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)'
          }}
          onTouchStart={() => {
            if (typeof window !== 'undefined' && navigator.vibrate) typeof window !== 'undefined' && navigator.vibrate(50);
          }}
          aria-label="Show crisis navigation"
        >
          🧭 Touch for help
        </button>
      )}

      {/* Breadcrumb Trail (Reduced Anxiety) */}
      <div
        className="fixed top-6 left-6 z-15"
        style={{
          background: isInCrisis ? 'rgba(220, 38, 38, 0.1)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isInCrisis ? 'rgba(220, 38, 38, 0.2)' : 'rgba(164, 183, 146, 0.2)'}`,
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '14px',
          fontWeight: '500',
          color: isInCrisis ? '#dc2626' : '#6b7556'
        }}
      >
        <span style={{ opacity: 0.7 }}>You are in:</span>{' '}
        <span style={{ fontWeight: '600' }}>
          {navItems.find(item => item.href === pathname)?.label || 'ALCHM'}
        </span>
      </div>

      {/* Emergency Exit (Crisis Mode Only) */}
      {isInCrisis && (
        <button
          onClick={() => {
            if (confirm('Are you sure you want to exit ALCHM? Your progress will be saved.')) {
              // Save any unsaved work
              typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('emergency-exit'));
              // Close typeof window !== 'undefined' && window/tab
              typeof window !== 'undefined' && window.close();
            }
          }}
          className="fixed top-6 right-6 z-15 crisis-accessible"
          style={{
            background: 'rgba(220, 38, 38, 0.9)',
            color: 'white',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '600',
            touchAction: 'manipulation',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)',
            minWidth: '52px',
            minHeight: '52px'
          }}
          onTouchStart={() => {
            if (typeof window !== 'undefined' && navigator.vibrate) typeof window !== 'undefined' && navigator.vibrate([100, 50, 100]);
          }}
          aria-label="Emergency exit from app"
        >
          🚪 Exit
        </button>
      )}

      {/* Gentle Animations */}
      <style jsx>{`
        @keyframes gentle-breath {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.02); }
        }

        .animate-gentle-breath {
          animation: gentle-breath 4s ease-in-out;
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          nav {
            background: ${userPreferences.highContrast ? '#ffffff !important' : ''};
            border: ${userPreferences.highContrast ? '3px solid #000000 !important' : ''};
          }
          
          .touch-target {
            border: ${userPreferences.highContrast ? '2px solid #000000 !important' : ''};
            color: ${userPreferences.highContrast ? '#000000 !important' : ''};
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
          
          .touch-target:active {
            transition: background-color 0.1s ease !important;
            background-color: rgba(164, 183, 146, 0.2) !important;
          }
        }
      `}</style>
    </>
  );
}