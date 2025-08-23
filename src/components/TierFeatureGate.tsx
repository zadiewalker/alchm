// Tier Feature Gate - Controls access to premium features
// Ensures proper tier-based access control with upgrade prompts

'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';

interface TierFeatureGateProps {
  userTier: 'free' | 'deep-cut' | 'oracle';
  requiredTier: 'deep-cut' | 'oracle';
  children: React.ReactNode;
  showUpgrade?: boolean;
  className?: string;
}

export function TierFeatureGate({ 
  userTier, 
  requiredTier, 
  children, 
  showUpgrade = true,
  className = ""
}: TierFeatureGateProps) {
  
  const getTierLevel = (tier: string) => {
    switch (tier) {
      case 'oracle': return 3;
      case 'deep-cut': return 2;
      case 'free': return 1;
      default: return 0;
    }
  };

  const hasAccess = getTierLevel(userTier) >= getTierLevel(requiredTier);

  const getTierInfo = () => {
    switch (requiredTier) {
      case 'oracle':
        return {
          name: 'Oracle',
          icon: Crown,
          color: 'text-gold-400',
          bgColor: 'from-gold-900/20 to-amber-900/20',
          borderColor: 'border-gold-500/30',
          price: '$14.99/mo',
          benefits: [
            'AI Mentor conversations',
            'Inner circle sharing',
            'Executive coaching',
            'Unlimited storage',
            'Priority support'
          ]
        };
      case 'deep-cut':
        return {
          name: 'Deep Cut',
          icon: Sparkles,
          color: 'text-purple-400',
          bgColor: 'from-purple-900/20 to-pink-900/20',
          borderColor: 'border-purple-500/30',
          price: '$7.99/mo',
          benefits: [
            'Advanced pattern analysis',
            'Unlimited storage',
            'Export capabilities',
            'Auto-save',
            'Enhanced insights'
          ]
        };
    }
  };

  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  if (!showUpgrade) {
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
              {tierInfo.name} Feature
            </Badge>
          </div>
          
          <h3 className="font-medium text-white mb-2">
            Unlock {tierInfo.name} Features
          </h3>
          
          <p className="text-sm text-gray-300 mb-4">
            This feature is available with {tierInfo.name} tier ({tierInfo.price})
          </p>
          
          <div className="space-y-2 mb-4">
            {tierInfo.benefits.slice(0, 3).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-300">
                <div className={`w-1.5 h-1.5 rounded-full ${tierInfo.color.replace('text-', 'bg-')}`}></div>
                <span>{benefit}</span>
              </div>
            ))}
            {tierInfo.benefits.length > 3 && (
              <div className="text-xs text-gray-400">
                +{tierInfo.benefits.length - 3} more features...
              </div>
            )}
          </div>
          
          <Button 
            className={`w-full ${
              requiredTier === 'oracle' 
                ? 'bg-gold-600 hover:bg-gold-700 text-black' 
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } font-medium`}
            onClick={() => {
              // In a real app, this would navigate to the upgrade flow
              console.log(`Upgrade to ${tierInfo.name} tier`);
            }}
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Upgrade to {tierInfo.name}
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            Cancel anytime • 7-day free trial
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

// Hook for checking tier access
export function useTierAccess(userTier: 'free' | 'deep-cut' | 'oracle') {
  const hasDeepCutAccess = ['deep-cut', 'oracle'].includes(userTier);
  const hasOracleAccess = userTier === 'oracle';
  
  return {
    hasDeepCutAccess,
    hasOracleAccess,
    canAccess: (requiredTier: 'deep-cut' | 'oracle') => {
      return requiredTier === 'deep-cut' ? hasDeepCutAccess : hasOracleAccess;
    }
  };
}