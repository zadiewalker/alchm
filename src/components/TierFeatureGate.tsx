// Sanctuary Feature Gate - Investment-Based Access with Compassion
// Gentle invitations to expand sanctuary, never blocking with shame
// Legacy compatibility maintained while transitioning to sanctuary model

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';

interface TierFeatureGateProps {
  userTier: 'essential' | 'premium' | 'sanctuary' | 'deep-cut' | 'oracle'; // Legacy support
  requiredTier: 'premium' | 'deep-cut' | 'oracle';
  children: React.ReactNode;
  showUpgrade?: boolean;
  className?: string;
  emotionalState?: 'crisis' | 'difficult' | 'neutral' | 'good';
  sanctuaryMessage?: string;
}

export function TierFeatureGate({ 
  userTier, 
  requiredTier, 
  children, 
  showUpgrade = true,
  className = "",
  emotionalState = 'neutral'
}: TierFeatureGateProps) {
  
  const getTierLevel = (tier: string) => {
    switch (tier) {
      case 'oracle': return 3;
      case 'premium':
      case 'deep-cut': return 2;
      case 'essential':
      case 'sanctuary': return 1;
      default: return 0;
    }
  };

  const hasAccess = getTierLevel(userTier) >= getTierLevel(requiredTier);

  // Respect emotional state - never show upgrade prompts during crisis or difficult times
  const shouldShowUpgrade = showUpgrade && !(['crisis', 'difficult'].includes(emotionalState));

  const getTierInfo = () => {
    switch (requiredTier) {
      case 'oracle':
        return {
          name: 'Oracle Sanctuary',
          icon: Crown,
          color: 'text-sage-400',
          bgColor: 'from-sage-100/30 to-sage-200/20',
          borderColor: 'border-sage-400/30',
          price: '$14.99/mo',
          benefits: [
            'Complete healing ecosystem',
            'Professional integration tools',
            'Advanced crisis prevention',
            'Holistic wellness tracking',
            'White-glove sanctuary support'
          ]
        };
      case 'premium':
      case 'deep-cut':
        return {
          name: 'Premium Sanctuary',
          icon: Sparkles,
          color: 'text-sage-400',
          bgColor: 'from-sage-100/30 to-sage-200/20',
          borderColor: 'border-sage-400/30',
          price: '$7.99/mo',
          benefits: [
            'Enhanced emotional wisdom mapping',
            'Unlimited Khepera conversations',
            'Advanced healing achievement garden',
            'Neuroplasticity habit cultivation',
            'Priority sanctuary support'
          ]
        };
    }
  };

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  if (!shouldShowUpgrade) {
    return null;
  }

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;

  return (
    <Card className={`bg-gradient-to-r ${tierInfo.bgColor} border ${tierInfo.borderColor} ${className}`}>
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TierIcon className={`h-6 w-6 ${tierInfo.color}`} />
            <Badge 
              variant="outline" 
              className={`${tierInfo.borderColor} ${tierInfo.color} border-opacity-50`}
            >
              {tierInfo.name} Enhancement
            </Badge>
          </div>
          
          <h3 className="font-medium text-sanctuary-gray-800 mb-2">
            Expand Your {tierInfo.name}
          </h3>
          
          <p className="text-sm text-sanctuary-gray-600 mb-4">
            This sanctuary enhancement is available with {tierInfo.name} investment ({tierInfo.price})
          </p>
          
          <div className="space-y-2 mb-4">
            {tierInfo.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-sanctuary-gray-600">
                <div className={`w-1.5 h-1.5 rounded-full ${tierInfo.color.replace('text-', 'bg-')}`}></div>
                <span>{benefit}</span>
              </div>
            ))}
            {tierInfo.benefits.length > 3 && (
              <div className="text-xs text-sanctuary-gray-500">
                +{tierInfo.benefits.length - 3} more sanctuary enhancements...
              </div>
            )}
          </div>
          
          <Button 
            variant="primary"
            className="w-full font-medium"
            onClick={() => {
              window.location.href = '/pricing';
            }}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Invest in {tierInfo.name}
          </Button>
          
          <p className="text-xs text-sanctuary-gray-500 mt-2">
            Cancel anytime • Essential Sanctuary always available
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified version for inline use
export function TierBadge({ 
  requiredTier, 
  size = 'sm' 
}: { 
  requiredTier: 'deep-cut' | 'oracle'; 
  size?: 'sm' | 'md' 
}) {
  const isOracle = requiredTier === 'oracle';
  const Icon = isOracle ? Crown : Sparkles;
  
  return (
    <Badge 
      variant="outline" 
      className={`${
        isOracle 
          ? 'border-gold-400 text-gold-300' 
          : 'border-purple-400 text-purple-300'
      } border-opacity-50 ${size === 'md' ? 'text-sm py-1' : 'text-xs'}`}
    >
      <Icon className={`${size === 'md' ? 'h-4 w-4' : 'h-3 w-3'} mr-1`} />
      {requiredTier === 'oracle' ? 'Oracle' : 'Deep Cut'}
    </Badge>
  );
}

// Hook for checking sanctuary access
export function useSanctuaryAccess(userTier: 'essential' | 'premium' | 'sanctuary' | 'deep-cut' | 'oracle') {
  const hasEssentialAccess = ['essential', 'premium', 'sanctuary', 'deep-cut', 'oracle'].includes(userTier);
  const hasPremiumAccess = ['premium', 'deep-cut', 'oracle'].includes(userTier);
  const hasOracleAccess = userTier === 'oracle';
  
  return {
    hasEssentialAccess,
    hasPremiumAccess,
    hasOracleAccess,
    isEssentialTier: ['essential', 'sanctuary'].includes(userTier),
    isPremiumTier: ['premium', 'deep-cut'].includes(userTier),
    canAccess: (requiredTier: 'premium' | 'deep-cut' | 'oracle') => {
      switch (requiredTier) {
        case 'premium':
        case 'deep-cut':
          return hasPremiumAccess;
        case 'oracle':
          return hasOracleAccess;
        default:
          return false;
      }
    }
  };
}

// Legacy export for backwards compatibility
export const useTierAccess = useSanctuaryAccess;