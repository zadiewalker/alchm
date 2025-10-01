'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TherapyCostComparison } from './TherapyCostComparison';
import { MentalHealthInvestment } from './MentalHealthInvestment';
import { ProfessionalTestimonials } from './ProfessionalTestimonials';
import { FlexiblePaymentOptions } from './FlexiblePaymentOptions';
import { Sparkles, Heart, Shield, TrendingUp, Star, Check } from 'lucide-react';

interface PremiumSanctuaryExperienceProps {
  onSubscribe?: (planId: string) => void;
  userId?: string;
  userIncomeLevel?: 'low' | 'medium' | 'high' | null;
}

export function PremiumSanctuaryExperience({ 
  onSubscribe, 
  userId, 
  userIncomeLevel 
}: PremiumSanctuaryExperienceProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationPhase(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleInvestInSanctuary = () => {
    if (onSubscribe) {
      onSubscribe(selectedPaymentOption || 'premium-monthly');
    }
  };

  const premiumFeatures = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Emotional Alchemy",
      description: "Transform patterns into profound insights through Khepera's advanced emotional intelligence"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Unlimited Sacred Expression",
      description: "Write, create, and explore without limits in your personal healing sanctuary"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Crisis-Safe Guardian System",
      description: "24/7 protective monitoring with immediate access to professional resources"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Professional Progress Reports",
      description: "Shareable insights for therapists, coaches, and healthcare providers"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Poetic Header */}
        <div className={`text-center space-y-6 transition-all duration-1000 ${
          animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium">
            <Star className="w-4 h-4" />
            Invest in Your Healing Journey
          </div>
          
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-800">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 font-medium">Premium Sanctuary</span> Awaits
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Where healing becomes an art, growth becomes a gift, and transformation becomes your sacred right.
          </p>
        </div>

        {/* Main Investment Card */}
        <Card className="p-8 md:p-12 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Investment Proposition */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-light text-slate-800">
                  An Investment in Yourself
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  At the cost of one therapy session, unlock 18 months of unlimited healing support, 
                  professional-grade insights, and a sanctuary that grows with you.
                </p>
              </div>

              {/* Value Comparison */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Your Return on Investment</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold text-green-700">$150</div>
                    <div className="text-green-600">One therapy session</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">$8.33</div>
                    <div className="text-green-600">Per month with ALCHM</div>
                  </div>
                </div>
              </div>

              {/* Premium Features */}
              <div className="space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 p-3 rounded-lg transition-all duration-500 delay-${index * 100} ${
                      animationPhase >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                  >
                    <div className="text-purple-600 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-medium text-slate-800">{feature.title}</h3>
                      <p className="text-sm text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Investment Action */}
            <div className="space-y-6">
              <MentalHealthInvestment />
              
              <div className="text-center space-y-4">
                <Button 
                  onClick={handleInvestInSanctuary}
                  className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Invest in Your Sanctuary
                </Button>
                
                <p className="text-sm text-slate-500">
                  No commitment pressure. Cancel anytime. Your healing, your timeline.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Therapy Cost Comparison */}
        <div className="space-y-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full text-left p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:bg-white/80 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-800 group-hover:text-purple-700 transition-colors">
                  Compare with Traditional Therapy Costs
                </h3>
                <p className="text-slate-600">See how ALCHM transforms your mental health investment</p>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </button>
          
          {showComparison && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <TherapyCostComparison />
            </div>
          )}
        </div>

        {/* Professional Testimonials */}
        <div className="space-y-4">
          <button
            onClick={() => setShowTestimonials(!showTestimonials)}
            className="w-full text-left p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 hover:bg-white/80 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-800 group-hover:text-purple-700 transition-colors">
                  Trusted by Mental Health Professionals
                </h3>
                <p className="text-slate-600">See what therapists and coaches say about client progress</p>
              </div>
              <Star className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </button>
          
          {showTestimonials && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <ProfessionalTestimonials />
            </div>
          )}
        </div>

        {/* Flexible Payment Options */}
        <FlexiblePaymentOptions 
          userIncomeLevel={userIncomeLevel}
          onPaymentOptionSelect={setSelectedPaymentOption}
        />

        {/* Sacred Promise */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100">
          <div className="text-center space-y-4">
            <Shield className="w-8 h-8 text-purple-600 mx-auto" />
            <h3 className="text-xl font-light text-slate-800">Our Sacred Promise</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Your healing journey is sacred. We commit to transparency, accessibility, and never 
              compromising your privacy or well-being for profit. This is more than software—it's 
              a sanctuary for your soul.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                No hidden fees
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Data ownership guaranteed
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}