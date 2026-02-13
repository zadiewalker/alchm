'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeWindow } from '@/utils/browser';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [showCancelMessage, setShowCancelMessage] = useState(false);

  // Check for URL parameters on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(safeWindow.location.search);
    if (urlParams.get('canceled') === 'true') {
      setShowCancelMessage(true);
      setTimeout(() => setShowCancelMessage(false), 5000);
    }
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      // Stripe Payment Link for Transformation subscription
      const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/cNi7sK34kefhbhAaGW73G00';
      
      // Redirect to Stripe Payment Link
      safeWindow.open(STRIPE_PAYMENT_LINK, '_self');
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header */}
      <header className="px-6 pt-14 pb-6">
        <Link href="/dashboard" className="text-white/60 text-base mb-4 inline-block">
          ← Back
        </Link>
        
        {/* Cancel Message */}
        {showCancelMessage && (
          <div className="mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <p className="text-yellow-200 text-sm">
              Payment was canceled. No worries - you can subscribe anytime when you're ready.
            </p>
          </div>
        )}
        
        <h1 className="text-white text-3xl font-light">Support Your Practice</h1>
        <p className="text-white/60 text-base mt-2 leading-relaxed">
          ALCHM is free to use. Premium unlocks deeper tools when you're ready.
        </p>
      </header>

      {/* Pricing Cards */}
      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        <div className="space-y-4">
          
          {/* Growth Tier */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-white text-2xl font-light">Growth</h2>
              <span className="text-white/50 text-sm">Forever</span>
            </div>
            <p className="text-white/50 text-sm mb-5">
              Your healing journey starts here
            </p>
            
            <div className="space-y-3 mb-6">
              {['Unlimited journaling', 'Khepera AI companion', 'Two guided pathways', 'Insights & reflections'].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8C56D]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#E8C56D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="py-3 rounded-xl bg-white/5 text-center">
              <span className="text-white/40 text-sm">Your current plan</span>
            </div>
          </div>

          {/* Transformation Tier */}
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
            <div className="flex items-baseline justify-between mb-1">
              <h2 className="text-white text-2xl font-light">Transformation</h2>
              <div>
                <span className="text-white text-2xl font-light">$4.99</span>
                <span className="text-white/50 text-sm">/month</span>
              </div>
            </div>
            <p className="text-white/50 text-sm mb-5">
              Deeper work for profound change
            </p>
            
            <div className="space-y-3 mb-6">
              {[
                'Everything in Growth',
                'All five pathways',
                'Khepera remembers your history',
                'Deeper pattern insights',
                'Export your journal anytime'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#E8C56D]/25 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#E8C56D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#E8C56D] hover:bg-[#F2D99D] transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#E8C56D]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white text-base font-medium">
                {loading ? 'Processing...' : 'Subscribe'}
              </span>
            </button>
            
            <p className="text-white/40 text-xs text-center mt-3">
              $4.99/month. Cancel anytime.
            </p>
          </div>

        </div>

        {/* Trust Section */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm leading-relaxed">
            No ads. No data selling. Cancel anytime.<br />
            Your healing is the only thing that matters.
          </p>
        </div>

        {/* Philosophy */}
        <div className="mt-6 bg-white/5 rounded-2xl p-5">
          <p className="text-white/50 text-sm leading-relaxed text-center">
            ALCHM will always have a meaningful free tier.<br />
            Healing shouldn't be locked behind a paywall.
          </p>
        </div>

      </div>
    </div>
  );
}
