'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';

interface UniversalUpgradeButtonProps {
  variant?: 'subtle' | 'prominent' | 'glass';
  contextualMessage?: string;
  showOnlyForFree?: boolean;
}

export default function UniversalUpgradeButton({ 
  variant = 'subtle',
  contextualMessage,
  showOnlyForFree = true 
}: UniversalUpgradeButtonProps) {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [userTier, setUserTier] = useState<string>('free');

  useEffect(() => {
    // Show button after user has been on page for 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Check user tier from Firestore or local storage
    const checkUserTier = async () => {
      if (user) {
        try {
          // This would normally check Firestore for user subscription
          const tier = localStorage.getItem('alchm_user_tier') || 'free';
          setUserTier(tier);
        } catch (error) {
          console.warn('Could not determine user tier');
        }
      }
    };

    checkUserTier();
    return () => clearTimeout(timer);
  }, [user]);

  // Don't show if user is premium and showOnlyForFree is true
  if (showOnlyForFree && userTier !== 'free') {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const getVariantStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: 'var(--space-breath)',
      right: 'var(--space-breath)',
      zIndex: 999,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-whisper)',
      padding: 'var(--space-whisper) var(--space-breath)',
      borderRadius: '24px',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s var(--ease-sanctuary)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--font-medium)',
      letterSpacing: 'var(--tracking-wide)',
      minHeight: '44px',
      outline: 'none',
      userSelect: 'none' as const,
      WebkitUserSelect: 'none' as const
    };

    switch (variant) {
      case 'prominent':
        return {
          ...baseStyles,
          background: 'linear-gradient(145deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
          color: 'var(--sanctuary-white)',
          border: '1px solid rgba(164, 183, 146, 0.3)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(164, 183, 146, 0.4), 0 4px 16px rgba(0, 0, 0, 0.15)' 
            : '0 4px 16px rgba(164, 183, 146, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
          transform: isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)'
        };
        
      case 'glass':
        return {
          ...baseStyles,
          background: 'rgba(164, 183, 146, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: 'var(--sanctuary-white)',
          border: '1px solid rgba(164, 183, 146, 0.2)',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(164, 183, 146, 0.2), 0 4px 16px rgba(255, 255, 255, 0.1)' 
            : '0 4px 16px rgba(164, 183, 146, 0.1), 0 2px 8px rgba(255, 255, 255, 0.05)',
          transform: isHovered ? 'scale(1.02) translateY(-1px)' : 'scale(1)'
        };
        
      case 'subtle':
      default:
        return {
          ...baseStyles,
          background: 'rgba(254, 252, 251, 0.05)',
          color: 'rgba(254, 252, 251, 0.9)',
          border: '1px solid rgba(164, 183, 146, 0.15)',
          boxShadow: isHovered 
            ? '0 4px 16px rgba(164, 183, 146, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05)' 
            : '0 2px 8px rgba(164, 183, 146, 0.1)',
          transform: isHovered ? 'scale(1.01) translateY(-1px)' : 'scale(1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        };
    }
  };

  const getButtonText = () => {
    if (contextualMessage) return contextualMessage;
    
    switch (variant) {
      case 'prominent':
        return 'Unlock More';
      case 'glass':
        return 'Deepen Journey';
      case 'subtle':
      default:
        return 'Enhance';
    }
  };

  return (
    <Link
      href="/pricing"
      style={getVariantStyles()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Enhance your ALCHM journey with premium features"
    >
      {/* Gentle sparkle icon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.1) rotate(10deg)' : 'scale(1)',
        transition: 'transform 0.2s var(--ease-sanctuary)'
      }}>
        <span style={{
          fontSize: '14px',
          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
        }}>
          ✨
        </span>
      </div>
      
      <span style={{
        opacity: isHovered ? 1 : 0.9,
        transition: 'opacity 0.2s var(--ease-sanctuary)'
      }}>
        {getButtonText()}
      </span>
      
      {/* Subtle gradient overlay on hover */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '24px',
        background: `linear-gradient(145deg, rgba(164, 183, 146, ${isHovered ? '0.1' : '0'}) 0%, rgba(164, 183, 146, ${isHovered ? '0.05' : '0'}) 100%)`,
        transition: 'all 0.3s var(--ease-sanctuary)',
        pointerEvents: 'none'
      }} />
    </Link>
  );
}