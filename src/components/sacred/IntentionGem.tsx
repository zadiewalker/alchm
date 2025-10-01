// ALCHM Sacred Component: IntentionGem
// Sacred action crystallized into form
// Replaces: Button

import React, { forwardRef } from 'react';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';

export interface IntentionGemProps {
  children: React.ReactNode;
  intent?: 'healing' | 'growth' | 'connection' | 'wisdom' | 'transformation' | 'celebration';
  energy?: 'gentle' | 'presence' | 'ceremony' | 'ritual';
  manifestation?: 'whisper' | 'breath' | 'voice' | 'call' | 'declaration';
  sacred?: boolean;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  'aria-label'?: string;
}

export const IntentionGem = forwardRef<HTMLButtonElement, IntentionGemProps>(({
  children,
  intent = 'healing',
  energy = 'gentle',
  manifestation = 'breath',
  sacred = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const { getSacredButton } = useSacredMicrocopy();

  const gemClasses = [
    'intention-gem',
    `intent-${intent}`,
    `energy-${energy}`,
    `manifestation-${manifestation}`,
    sacred && 'sacred-gem',
    disabled && 'gem-dormant',
    loading && 'gem-activating',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    // Add ceremonial ripple effect
    const gem = e.currentTarget;
    const ripple = typeof window !== 'undefined' && document.createElement('div');
    ripple.className = 'sacred-ripple';
    
    const rect = gem.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    gem.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
    
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={gemClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || getSacredButton(intent, children?.toString() || '')}
      aria-busy={loading}
      {...props}
    >
      <span className="gem-surface">
        {loading && (
          <span className="gem-activation" aria-hidden="true">
            <div className="activation-pulse" />
          </span>
        )}
        
        <span className="gem-content">
          {children}
        </span>
        
        {sacred && (
          <span className="sacred-indicator" aria-hidden="true">
            <div className="sacred-glow" />
          </span>
        )}
      </span>
      
      <span className="gem-aura" aria-hidden="true" />
    </button>
  );
});

IntentionGem.displayName = 'IntentionGem';

// Specialized intention gems for common actions
export const HealingGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="healing" />
);

export const GrowthGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="growth" />
);

export const ConnectionGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="connection" />
);

export const WisdomGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="wisdom" />
);

export const TransformationGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="transformation" />
);

export const CelebrationGem = (props: Omit<IntentionGemProps, 'intent'>) => (
  <IntentionGem {...props} intent="celebration" />
);

export default IntentionGem;