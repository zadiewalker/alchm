'use client';

import React from 'react';
import { SacredCard, SacredText } from '@/components/SacredUIFoundation';

// ===== SAFE SPACE INDICATOR TYPES =====

export interface SafeSpaceIndicatorProps {
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
  className?: string;
}

// ===== SAFE SPACE INDICATOR COMPONENT =====

export function SafeSpaceIndicator({ 
  variant = 'default', 
  showIcon = true,
  className = '' 
}: SafeSpaceIndicatorProps) {
  
  if (variant === 'compact') {
    return (
      <div className={`safe-space-compact flex items-center gap-gentle ${className}`}>
        {showIcon && <span className="rainbow-accent text-sm">🏳️‍🌈</span>}
        <SacredText variant="caption" className="text-xs font-medium">
          Safe Space
        </SacredText>
      </div>
    );
  }

  return (
    <SacredCard 
      variant="warm" 
      className={`safe-space-indicator ${className}`}
    >
      <div className="flex items-start gap-breath">
        {showIcon && (
          <div className="flex-shrink-0">
            <div className="rainbow-border-accent w-1 h-16 rounded-full" />
          </div>
        )}
        
        <div className="flex-grow space-y-whisper">
          <div className="flex items-center gap-gentle">
            {showIcon && <span className="text-lg">🏳️‍🌈</span>}
            <SacredText variant="caption" className="font-medium text-grounding-earth">
              Safe Space Commitment
            </SacredText>
          </div>
          
          {variant === 'detailed' ? (
            <div className="space-y-whisper">
              <SacredText variant="caption">
                ALCHM celebrates and affirms all identities, orientations, and expressions.
              </SacredText>
              <SacredText variant="caption" className="text-xs">
                This is a space where every part of you is welcomed, honored, and celebrated.
                Your authentic self is not just accepted—it's cherished.
              </SacredText>
            </div>
          ) : (
            <SacredText variant="caption">
              ALCHM celebrates and affirms all identities, orientations, and expressions.
            </SacredText>
          )}
        </div>
      </div>
    </SacredCard>
  );
}

// ===== PRIDE FLAG COMPONENT =====

export function PrideFlagBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`pride-flag-border ${className}`}>
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full" />
    </div>
  );
}

// ===== LGBTQ+ AFFIRMATION BANNER =====

export interface LGBTQAffirmationBannerProps {
  message?: string;
  showFlag?: boolean;
  className?: string;
}

export function LGBTQAffirmationBanner({
  message = "Your identity is beautiful and valid",
  showFlag = true,
  className = ''
}: LGBTQAffirmationBannerProps) {
  return (
    <SacredCard variant="sacred" className={`lgbtq-affirmation-banner ${className}`}>
      {showFlag && <PrideFlagBorder className="mb-breath" />}
      
      <div className="text-center space-y-gentle">
        <SacredText variant="sacred" className="text-grounding-earth">
          {message}
        </SacredText>
        
        <SacredText variant="caption" className="text-xs">
          Every part of your identity is welcomed and celebrated here
        </SacredText>
      </div>
      
      {showFlag && <PrideFlagBorder className="mt-breath" />}
    </SacredCard>
  );
}

// ===== INCLUSIVE LANGUAGE INDICATOR =====

export function InclusiveLanguageIndicator({ className = '' }: { className?: string }) {
  return (
    <div className={`inclusive-language-indicator ${className}`}>
      <div className="flex items-center gap-whisper">
        <div className="w-2 h-2 rounded-full bg-strength-sage" />
        <SacredText variant="caption" className="text-xs text-subtle">
          Inclusive language
        </SacredText>
      </div>
    </div>
  );
}

// ===== PRONOUN RESPECT REMINDER =====

export function PronounRespectReminder({ className = '' }: { className?: string }) {
  return (
    <div className={`pronoun-respect-reminder ${className}`}>
      <SacredText variant="caption" className="text-xs text-subtle flex items-center gap-whisper">
        <span className="text-compassion-rose">💙</span>
        Pronouns are a form of respect and recognition
      </SacredText>
    </div>
  );
}

// ===== COMMUNITY WELCOME MESSAGE =====

export interface CommunityWelcomeProps {
  userName?: string;
  pronouns?: string;
  showPersonalization?: boolean;
  className?: string;
}

export function CommunityWelcome({
  userName,
  pronouns,
  showPersonalization = true,
  className = ''
}: CommunityWelcomeProps) {
  const getWelcomeMessage = () => {
    if (!showPersonalization || !userName) {
      return "Welcome to your authentic self's sanctuary";
    }
    
    if (pronouns) {
      return `Welcome ${userName} (${pronouns}) to your sacred space`;
    }
    
    return `Welcome ${userName} to your authentic self's sanctuary`;
  };

  return (
    <SacredCard variant="gentle" className={`community-welcome ${className}`}>
      <div className="text-center space-y-gentle">
        <SacredText variant="title" className="text-deep-presence">
          {getWelcomeMessage()}
        </SacredText>
        
        <SafeSpaceIndicator variant="compact" />
        
        <SacredText variant="caption">
          This is a space where your full, authentic self is not just welcomed—it's celebrated
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== EXPORT ALL COMPONENTS =====

export {
  SafeSpaceIndicator as default,
  PrideFlagBorder,
  LGBTQAffirmationBanner,
  InclusiveLanguageIndicator,
  PronounRespectReminder,
  CommunityWelcome
};