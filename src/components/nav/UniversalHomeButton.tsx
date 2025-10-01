'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UniversalHomeButtonProps {
  variant?: 'light' | 'dark' | 'glass';
  showLabel?: boolean;
  preserveState?: boolean;
}

export default function UniversalHomeButton({ 
  variant = 'glass', 
  showLabel = false,
  preserveState = true 
}: UniversalHomeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Don't show on home page itself
  if (pathname === '/') return null;

  const handleHomeNavigation = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (preserveState) {
      // Save current page state before navigation
      const currentState = {
        path: pathname,
        timestamp: Date.now(),
        scrollPosition: window.scrollY
      };
      
      try {
        sessionStorage.setItem('alchm_return_path', JSON.stringify(currentState));
      } catch (error) {
        console.warn('Could not save return path state');
      }
    }
    
    // Gentle haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    router.push('/dashboard');
  };

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 'var(--space-breath)',
      left: 'var(--space-breath)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-whisper)',
      padding: showLabel ? 'var(--space-whisper) var(--space-breath)' : 'var(--space-whisper)',
      borderRadius: showLabel ? '24px' : '50%',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s var(--ease-sanctuary)',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const,
      outline: 'none',
      border: 'none',
      fontFamily: 'inherit',
      fontSize: showLabel ? 'var(--text-sm)' : 'inherit',
      fontWeight: 'var(--font-medium)',
      letterSpacing: showLabel ? 'var(--tracking-wide)' : 'normal',
      minHeight: '44px', // Minimum touch target
      minWidth: '44px'
    };

    switch (variant) {
      case 'light':
        return {
          ...baseStyles,
          background: 'var(--sanctuary-white)',
          color: 'var(--color-primary-dark)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(164, 183, 146, 0.25), 0 4px 16px rgba(0, 0, 0, 0.1)' 
            : '0 4px 16px rgba(164, 183, 146, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(164, 183, 146, 0.2)',
          transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)'
        };
        
      case 'dark':
        return {
          ...baseStyles,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'var(--sanctuary-white)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)'
        };
        
      case 'glass':
      default:
        return {
          ...baseStyles,
          background: 'rgba(254, 252, 251, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: 'var(--sanctuary-white)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(164, 183, 146, 0.2), 0 4px 16px rgba(255, 255, 255, 0.1)' 
            : '0 4px 16px rgba(164, 183, 146, 0.1), 0 2px 8px rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(164, 183, 146, 0.2)',
          transform: isPressed ? 'scale(0.95)' : isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)'
        };
    }
  };

  return (
    <button
      onClick={handleHomeNavigation}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={getVariantStyles()}
      aria-label={showLabel ? "Return to sanctuary" : "Home"}
      title="Return to your sanctuary"
    >
      {/* ALCHM Sacred Mark */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        position: 'relative'
      }}>
        <span style={{
          fontSize: '20px',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.2s var(--ease-sanctuary)'
        }}>
          🌿
        </span>
        
        {/* Subtle pulse effect */}
        <div style={{
          position: 'absolute',
          inset: '-4px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(164, 183, 146, ${isHovered ? '0.2' : '0.1'}) 0%, transparent 70%)`,
          animation: isHovered ? 'sanctuary-pulse 2s ease-in-out infinite' : 'none',
          pointerEvents: 'none'
        }} />
      </div>
      
      {showLabel && (
        <span style={{
          opacity: isHovered ? 1 : 0.9,
          transition: 'opacity 0.2s var(--ease-sanctuary)'
        }}>
          Sanctuary
        </span>
      )}
    </button>
  );
}

// CSS Animation for pulse effect
const pulseKeyframes = `
  @keyframes sanctuary-pulse {
    0%, 100% { transform: scale(1); opacity: 0.1; }
    50% { transform: scale(1.2); opacity: 0.2; }
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleId = 'universal-home-button-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
  }
}