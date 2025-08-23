// ALCHM Sacred Component: RitualGate
// Sacred threshold for important ceremonies and decisions
// Replaces: Modal/Dialog

import React, { useEffect, useRef } from 'react';
import { useSacredMotion } from '@/components/motion/SacredMotionProvider';

export interface RitualGateProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  ceremony?: 'gentle' | 'presence' | 'sacred' | 'transformative';
  threshold?: 'whisper' | 'breath' | 'presence' | 'ceremony';
  sacredness?: 'everyday' | 'meaningful' | 'profound' | 'life-changing';
  preventClose?: boolean;
  className?: string;
}

export function RitualGate({
  isOpen,
  onClose,
  children,
  ceremony = 'gentle',
  threshold = 'breath',
  sacredness = 'meaningful',
  preventClose = false,
  className = ''
}: RitualGateProps) {
  const gateRef = useRef<HTMLDivElement>(null);
  const { adaptToNervousSystemState } = useSacredMotion();

  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll
      document.body.style.overflow = 'hidden';
      
      // Focus management for accessibility
      const firstFocusable = gateRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  const gateClasses = [
    'ritual-gate',
    `ceremony-${ceremony}`,
    `threshold-${threshold}`,
    `sacredness-${sacredness}`,
    isOpen && 'active',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      {/* Sacred Veil */}
      <div 
        className="ritual-veil"
        onClick={!preventClose ? onClose : undefined}
        aria-label="Close ritual gate"
      />
      
      {/* Ritual Gate Container */}
      <div
        ref={gateRef}
        className={gateClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ritual-gate-title"
      >
        <div className="gate-content">
          {!preventClose && (
            <button
              className="gate-close-intention sacred-intention-whisper"
              onClick={onClose}
              aria-label="Close sacred gate"
              type="button"
            >
              <span className="close-symbol">×</span>
            </button>
          )}
          
          <div className="sacred-content">
            {children}
          </div>
        </div>
        
        {/* Sacred energy indicators */}
        <div className="gate-energy-field" aria-hidden="true">
          <div className="energy-pulse energy-1" />
          <div className="energy-pulse energy-2" />
          <div className="energy-pulse energy-3" />
        </div>
      </div>
    </>
  );
}

// Heart Conversation - More intimate dialog variant
export interface HeartConversationProps extends Omit<RitualGateProps, 'ceremony' | 'sacredness'> {
  intimacy?: 'tender' | 'vulnerable' | 'profound' | 'soul-deep';
}

export function HeartConversation({
  intimacy = 'tender',
  ...gateProps
}: HeartConversationProps) {
  return (
    <RitualGate
      {...gateProps}
      ceremony="gentle"
      sacredness="profound"
      className={`heart-conversation intimacy-${intimacy} ${gateProps.className || ''}`}
    >
      <div className="heart-space">
        <div className="conversation-aura" aria-hidden="true" />
        {gateProps.children}
      </div>
    </RitualGate>
  );
}

export default RitualGate;