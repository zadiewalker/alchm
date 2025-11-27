'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  href: string;
  icon: string;
  activeIcon: string;
  label: string;
  isActive: (pathname: string) => boolean;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const navItems: NavItem[] = [
    {
      href: '/dashboard',
      icon: '🏠',
      activeIcon: '🏠',
      label: 'Home',
      isActive: (path) => path === '/dashboard' || path === '/'
    },
    {
      href: '/journal',
      icon: '✍️',
      activeIcon: '✨',
      label: 'Write',
      isActive: (path) => path.includes('/journal') || path.includes('/write')
    },
    {
      href: '/pathways',
      icon: '🛤️',
      activeIcon: '🌟',
      label: 'Pathways',
      isActive: (path) => path.includes('/pathways')
    },
    {
      href: '/badges',
      icon: '🏆',
      activeIcon: '🎯',
      label: 'Growth',
      isActive: (path) => path.includes('/badges') || path.includes('/achievements')
    }
  ];

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Handle scroll for auto-hide behavior
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Don't render on desktop, certain pages, or when crisis panel is open
  if (!isMobile || pathname.includes('/auth') || pathname.includes('/onboarding')) {
    return null;
  }

  const handleNavClick = (href: string) => {
    // Trauma-informed haptic feedback - gentle and reassuring
    if (navigator.vibrate) {
      navigator.vibrate([15, 5, 10]); // More nuanced feedback pattern
    }
    
    // Save scroll position and current state for anxiety-free navigation
    sessionStorage.setItem(`scroll_${pathname}`, window.scrollY.toString());
    sessionStorage.setItem(`nav_timestamp`, Date.now().toString());
  };

  return (
    <>
      {/* Safe area padding for iPhone home indicator */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 998
      }} />
      
      {/* Bottom Navigation */}
      <nav 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, rgba(164, 183, 146, 0.12) 0%, rgba(164, 183, 146, 0.20) 100%)',
          backdropFilter: 'blur(32px) saturate(130%) brightness(105%)',
          WebkitBackdropFilter: 'blur(32px) saturate(130%) brightness(105%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.25)',
          padding: `24px 20px calc(24px + env(safe-area-inset-bottom, 0px))`, 
          zIndex: 999,
          transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 280ms cubic-bezier(0.4, 0, 0.2, 1)', 
          boxShadow: '0 -16px 48px rgba(164, 183, 146, 0.18), 0 -8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
          borderRadius: '28px 28px 0 0', 
          maxHeight: '110px',
          // Luxury iOS-style blur enhancement
          overflow: 'hidden'
        }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {navItems.map((item) => {
            const isActive = item.isActive(pathname);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => handleNavClick(item.href)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  minWidth: '76px', 
                  minHeight: '64px', 
                  justifyContent: 'center',
                  transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive 
                    ? 'rgba(164, 183, 146, 0.18)' 
                    : 'transparent',
                  transform: isActive ? 'scale(1.08)' : 'scale(1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isActive 
                    ? '0 4px 12px rgba(164, 183, 146, 0.15)' 
                    : 'none',
                  backdropFilter: isActive ? 'blur(8px)' : 'none'
                }}
                onTouchStart={(e) => {
                  // Jony Ive luxury touch feedback
                  e.currentTarget.style.transform = isActive ? 'scale(1.05)' : 'scale(0.95)';
                  e.currentTarget.style.background = 'rgba(164, 183, 146, 0.25)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(164, 183, 146, 0.2)';
                  // Premium haptic confirmation
                  if (navigator.vibrate) navigator.vibrate([4, 2, 4]);
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = isActive ? 'scale(1.08)' : 'scale(1)';
                  e.currentTarget.style.background = isActive ? 'rgba(164, 183, 146, 0.18)' : 'transparent';
                  e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(164, 183, 146, 0.15)' : 'none';
                }}
                onTouchCancel={(e) => {
                  // Graceful luxury restoration
                  e.currentTarget.style.transform = isActive ? 'scale(1.08)' : 'scale(1)';
                  e.currentTarget.style.background = isActive ? 'rgba(164, 183, 146, 0.18)' : 'transparent';
                  e.currentTarget.style.boxShadow = isActive ? '0 4px 12px rgba(164, 183, 146, 0.15)' : 'none';
                }}
                aria-label={item.label}
                role="button"
              >
                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    boxShadow: '0 0 8px rgba(164, 183, 146, 0.6)'
                  }} />
                )}
                
                {/* Icon */}
                <div style={{
                  fontSize: '22px',
                  lineHeight: '1',
                  filter: isActive 
                    ? 'drop-shadow(0 2px 4px rgba(164, 183, 146, 0.3))' 
                    : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}>
                  {isActive ? item.activeIcon : item.icon}
                </div>
                
                {/* Label */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 'var(--font-medium)' : 'var(--font-medium)',
                  color: isActive 
                    ? 'var(--color-primary)' 
                    : 'rgba(254, 252, 251, 0.7)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s var(--ease-sanctuary)'
                }}>
                  {item.label}
                </span>
                
                {/* Ripple effect background */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle, rgba(164, 183, 146, 0.1) 0%, transparent 70%)',
                    borderRadius: '12px',
                    animation: 'nav-ripple 2s ease-in-out infinite',
                    zIndex: -1
                  }} />
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Jony Ive signature floating pill */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '380px',
          height: '65px',
          background: 'linear-gradient(135deg, rgba(164, 183, 146, 0.08) 0%, rgba(164, 183, 146, 0.04) 100%)',
          borderRadius: '32px',
          border: '1px solid rgba(164, 183, 146, 0.15)',
          boxShadow: 'inset 0 1px 0 rgba(164, 183, 146, 0.1), 0 2px 8px rgba(164, 183, 146, 0.05)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />
      </nav>
    </>
  );
}

// Ripple animation for active nav items
const rippleKeyframes = `
  @keyframes nav-ripple {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.1); opacity: 0.05; }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'mobile-nav-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = rippleKeyframes;
    document.head.appendChild(style);
  }
}