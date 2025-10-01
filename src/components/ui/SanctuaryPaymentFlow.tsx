// Sanctuary Payment Flow - Investment in Healing Journey
// Translucent glass aesthetic with heart-sparkle success motifs

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirectToSanctuaryCheckout, SANCTUARY_PRICES } from '@/lib/stripe';

interface SanctuaryPaymentFlowProps {
  offering: {
    name: string;
    sanctuary_description: string;
    investment: string;
    investment_period: string;
    is_premium: boolean;
    stripe_price_id?: string;
    healing_promise: string;
  };
  billingPeriod: 'monthly' | 'yearly';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function SanctuaryPaymentFlow({ 
  offering, 
  billingPeriod, 
  onSuccess, 
  onError 
}: SanctuaryPaymentFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInvestmentFlow = async () => {
    if (!offering.is_premium) {
      // Free sanctuary - redirect to signup
      window.location.href = '/auth/signup';
      return;
    }

    if (!offering.stripe_price_id) {
      onError?.('Sanctuary investment configuration unavailable. Please contact support for assistance.');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmedInvestment = async () => {
    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      // Determine price ID based on billing period
      const price_id = billingPeriod === 'yearly' 
        ? SANCTUARY_PRICES.premium_yearly 
        : SANCTUARY_PRICES.premium_monthly;

      await redirectToSanctuaryCheckout(price_id, {
        success_url: `${window.location.origin}/dashboard?sanctuary=premium&celebration=true`,
        cancel_url: `${window.location.origin}/pricing?return=sanctuary`,
      });

      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sanctuary investment processing error';
      onError?.(errorMessage);
      setIsProcessing(false);
    }
  };

  // Confirmation Modal with Sanctuary Aesthetic
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <Card variant="sanctuary" className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <CardTitle level="h2" className="text-sage-700">
              Invest in Your {offering.name}?
            </CardTitle>
            <CardDescription className="text-sanctuary-gray-600 leading-relaxed">
              You're about to invest {offering.investment}{offering.investment_period} in expanding your healing sanctuary.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="bg-sage-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-sanctuary-gray-700 leading-relaxed">
                {offering.healing_promise}
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <p className="text-sm text-sanctuary-gray-600">
                • Cancel anytime, no penalties<br/>
                • Your sanctuary data remains safe<br/>
                • Sliding scale available if needed
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowConfirmation(false)}
              >
                Return to Sanctuary
              </Button>
              <Button 
                variant="primary" 
                className="flex-1"
                onClick={handleConfirmedInvestment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Invest in Healing'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Button
      variant={offering.is_premium ? 'primary' : 'secondary'}
      size="lg"
      className="w-full"
      onClick={handleInvestmentFlow}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      ) : (
        offering.is_premium ? 'Invest in Deeper Wisdom' : 'Enter Your Sanctuary'
      )}
    </Button>
  );
}

// Success Celebration Component
export function SanctuarySuccessCelebration({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-sage-400/20 to-sage-500/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Card variant="sanctuary" className="max-w-lg w-full text-center">
        <CardContent className="p-8">
          {/* Heart Sparkle Animation */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-sage-400 to-sage-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            {/* Sparkle effects */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-warm-amber rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
          
          <CardTitle level="h1" className="text-sage-700 mb-4">
            Welcome to Premium Sanctuary
          </CardTitle>
          
          <CardDescription className="text-sanctuary-gray-600 leading-relaxed mb-6">
            Your investment in healing expands your sanctuary today. 
            Deeper wisdom and enhanced capabilities await your exploration.
          </CardDescription>
          
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onContinue}
            className="w-full"
          >
            Explore Your Expanded Sanctuary
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}