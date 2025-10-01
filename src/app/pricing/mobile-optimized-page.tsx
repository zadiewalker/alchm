'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Mobile-Optimized Pricing Page with Trauma-Informed Design
// Focus: Crisis-safe interactions, accessible touch targets, emotional safety

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceMonthly: string;
  featured: boolean;
  features: string[];
  supportingText: string;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'ghost';
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Sanctuary',
    description: 'Complete foundation for your healing journey',
    price: 'Free',
    priceMonthly: 'Always',
    featured: false,
    features: [
      'Unlimited journaling with privacy encryption',
      'Khepera AI emotional support & insights',
      '24/7 crisis resource library',
      'Basic achievement badges & milestones',
      'Mobile app with offline writing',
      'Community safe space access',
      'Cultural affirmation tools',
      'Basic mood tracking & patterns'
    ],
    supportingText: 'Every healing journey deserves a solid foundation. Sanctuary provides everything you need to begin.',
    ctaText: 'Start Your Journey',
    ctaVariant: 'secondary'
  },
  {
    name: 'Deep Cut',
    description: 'Advanced insights for deeper self-discovery',
    price: '$4.99',
    priceMonthly: '/month',
    featured: true,
    features: [
      'Everything in Sanctuary',
      'Advanced emotional pattern recognition',
      'Unlimited AI conversations & reflections',
      'Complete badge tree & achievement system',
      'Priority crisis support routing',
      'Neuroplasticity habit tracking',
      'Custom AI personality training',
      'Advanced analytics & growth reports',
      'Goal setting & vision planning tools',
      'Priority community features'
    ],
    supportingText: 'For those ready to explore deeper layers of healing and growth with enhanced AI partnership.',
    ctaText: 'Deepen Your Practice',
    ctaVariant: 'primary'
  },
  {
    name: 'Oracle',
    description: 'Comprehensive wellness ecosystem for life transformation',
    price: '$9.99',
    priceMonthly: '/month',
    featured: false,
    features: [
      'Everything in Deep Cut',
      'Family & relationship feature access',
      'Professional therapist integration tools',
      'Advanced crisis prevention algorithms',
      'Custom AI model fine-tuning',
      'Holistic wellness tracking (sleep, nutrition)',
      'Career & purpose development modules',
      'Mentor coaching & peer support matching',
      'Research-grade data insights',
      'White-glove customer success support'
    ],
    supportingText: 'The complete transformation experience with professional-grade tools and human support.',
    ctaText: 'Transform Your Life',
    ctaVariant: 'primary'
  }
];

const faqs = [
  {
    question: 'Is my journal data truly private and secure?',
    answer: 'Absolutely. Your journal entries are encrypted at rest and in transit. We use industry-leading security practices and never sell your data. You own your healing journey completely.'
  },
  {
    question: 'Can I switch between plans or cancel anytime?',
    answer: 'Yes, you have complete control. Upgrade or downgrade instantly, cancel anytime with no penalties. Your data remains accessible even if you return to the free Sanctuary plan.'
  },
  {
    question: 'What if I\'m in crisis and need immediate help?',
    answer: 'All plans include immediate access to crisis resources and support. We maintain 24/7 crisis resource libraries and can connect you with appropriate local emergency services when needed.'
  },
  {
    question: 'How does the AI support work?',
    answer: 'Khepera AI is trained specifically for trauma-informed emotional support. It provides insights, prompts, and reflections while never replacing professional therapy. Think of it as a wise, always-available companion for your healing journey.'
  },
  {
    question: 'Is there support for different cultural backgrounds?',
    answer: 'Yes. ALCHM is designed with cultural responsiveness at its core. We support multiple languages and cultural healing approaches, recognizing that wellness looks different for everyone.'
  },
  {
    question: 'What if I can\'t afford a paid plan?',
    answer: 'The Sanctuary plan provides a complete, powerful journaling experience forever free. We also offer sliding scale pricing and hardship exemptions. Everyone deserves access to healing tools.'
  }
];

export default function MobileOptimizedPricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState('unknown');

  // Mobile detection and performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Detect connection speed for 3G optimization
    const connection = (navigator as any).connection;
    if (connection) {
      setConnectionSpeed(connection.effectiveType);
    }
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // iOS safe area support
    if (typeof window !== 'undefined' && window.navigator.userAgent.includes('iPhone')) {
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      
      // Prevent iOS zoom on input focus
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Crisis detection based on interaction patterns
  useEffect(() => {
    let rapidTaps = 0;
    const resetTaps = () => setTimeout(() => { rapidTaps = 0; }, 2000);
    
    const handleTap = () => {
      rapidTaps++;
      if (rapidTaps > 5) {
        setShowCrisisSupport(true);
      }
      resetTaps();
    };
    
    document.addEventListener('touchstart', handleTap);
    return () => document.removeEventListener('touchstart', handleTap);
  }, []);

  return (
    <div className="min-h-screen bg-sanctuary-white relative" style={{
      paddingTop: 'max(env(safe-area-inset-top), 20px)',
      paddingBottom: 'max(env(safe-area-inset-bottom), 20px)'
    }}>
      {/* Crisis Support Floating Button - Always Accessible */}
      <button
        onClick={() => setShowCrisisSupport(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center touch-safe"
        style={{ 
          minHeight: '64px',
          minWidth: '64px',
          touchAction: 'manipulation'
        }}
        aria-label="Crisis Support - Get immediate help"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Crisis Support Modal */}
      {showCrisisSupport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-medium text-gray-900 mb-4 text-center">Immediate Support Available</h3>
            <p className="text-gray-600 mb-6 text-center text-lg leading-relaxed">You don't have to handle this alone. Free support is always available.</p>
            <div className="space-y-4">
              <a 
                href="tel:988" 
                className="block w-full bg-red-500 hover:bg-red-600 text-white text-center py-4 rounded-xl font-medium text-lg transition-colors duration-200"
                style={{ minHeight: '60px', touchAction: 'manipulation' }}
              >
                Crisis Lifeline: 988
              </a>
              <a 
                href="tel:911" 
                className="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center py-4 rounded-xl font-medium text-lg transition-colors duration-200"
                style={{ minHeight: '60px', touchAction: 'manipulation' }}
              >
                Emergency: 911
              </a>
              <button
                onClick={() => setShowCrisisSupport(false)}
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-4 rounded-xl font-medium text-lg transition-colors duration-200"
                style={{ minHeight: '60px', touchAction: 'manipulation' }}
              >
                Continue to Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sacred Header - Mobile Optimized */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 to-sanctuary-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-12 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-6xl font-light tracking-tight text-sanctuary-gray-900 mb-4 md:mb-6 leading-tight">
              Choose Your
              <span className="block text-sage-400 mt-1 md:mt-2">Healing Journey</span>
            </h1>
            <p className="text-lg md:text-2xl text-sanctuary-gray-600 leading-relaxed mb-6 md:mb-8 font-light px-2">
              Every path is valid. Every journey is sacred.
              <span className="block mt-2">Start where you are, grow at your pace.</span>
            </p>
            
            {/* Mobile-Optimized Billing Toggle */}
            <div className="inline-flex items-center space-x-1 bg-white rounded-2xl p-1 shadow-gentle">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 md:px-6 py-4 md:py-3 rounded-xl text-base md:text-sm font-medium transition-all duration-300 min-h-[52px] touch-safe ${
                  billingPeriod === 'monthly'
                    ? 'bg-sage-400 text-white shadow-soft'
                    : 'text-sanctuary-gray-600 hover:text-sage-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 md:px-6 py-4 md:py-3 rounded-xl text-base md:text-sm font-medium transition-all duration-300 min-h-[52px] touch-safe ${
                  billingPeriod === 'yearly'
                    ? 'bg-sage-400 text-white shadow-soft'
                    : 'text-sanctuary-gray-600 hover:text-sage-600'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                Yearly
                <span className="ml-2 text-xs bg-warm-amber text-white px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers - Mobile-First Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-12 pb-12 md:pb-24">
        
        {/* Mobile Crisis Notice */}
        {isMobile && (
          <div className="bg-sage-50 border-l-4 border-sage-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-sage-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-base font-medium text-sage-800 mb-1">Take Your Time</p>
                <p className="text-base text-sage-700 leading-relaxed">No pressure. Start with our free Sanctuary plan and upgrade when you're ready. Your healing journey is yours to control.</p>
              </div>
            </div>
          </div>
        )}

        {/* Connection Speed Notice for 3G users */}
        {connectionSpeed === '3g' && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-base font-medium text-blue-800 mb-1">Slower Connection Detected</p>
                <p className="text-base text-blue-700 leading-relaxed">All features work offline. Payment processing may take a moment longer.</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-3 gap-6 md:gap-6 lg:gap-8">
          {pricingTiers.map((tier, index) => (
            <Card
              key={tier.name}
              variant={tier.featured ? 'sage' : 'sanctuary'}
              className={`relative overflow-hidden ${
                tier.featured 
                  ? 'md:scale-105 md:z-10 shadow-sacred border-2 border-sage-300' 
                  : 'shadow-soft hover:shadow-nurturing'
              } transition-all duration-400`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-0 right-0 bg-sage-600 text-white text-center py-3 text-base font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={tier.featured ? 'pt-16 md:pt-12' : 'pt-6'}>
                <CardTitle level="h2" className={`text-2xl md:text-xl ${tier.featured ? 'text-white' : ''}`}>
                  {tier.name}
                </CardTitle>
                <CardDescription className={`text-lg md:text-base leading-relaxed ${tier.featured ? 'text-sage-100' : ''}`}>
                  {tier.description}
                </CardDescription>
                
                {/* Mobile-Optimized Pricing Display */}
                <div className="mt-6 mb-4">
                  <div className="flex items-baseline">
                    <span className={`text-5xl md:text-4xl font-light tracking-tight ${
                      tier.featured ? 'text-white' : 'text-sanctuary-gray-900'
                    }`}>
                      {tier.price}
                    </span>
                    <span className={`ml-2 text-xl md:text-lg ${
                      tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-600'
                    }`}>
                      {tier.priceMonthly}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && tier.price !== 'Free' && (
                    <p className={`text-base md:text-sm mt-1 ${
                      tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-500'
                    }`}>
                      Billed annually • Save 20%
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className={`text-base md:text-sm leading-relaxed mb-6 ${
                  tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-600'
                }`}>
                  {tier.supportingText}
                </p>
                
                <ul className="space-y-4 md:space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className={`w-6 h-6 md:w-5 md:h-5 rounded-full flex-shrink-0 mt-0.5 ${
                        tier.featured ? 'bg-sage-200' : 'bg-sage-100'
                      } flex items-center justify-center`}>
                        <svg className={`w-4 h-4 md:w-3 md:h-3 ${
                          tier.featured ? 'text-sage-600' : 'text-sage-500'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-base md:text-sm leading-relaxed ${
                        tier.featured ? 'text-sage-50' : 'text-sanctuary-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  variant={tier.featured ? 'secondary' : tier.ctaVariant}
                  size={isMobile ? 'touch' : 'lg'}
                  className={`w-full ${isMobile ? 'min-h-[64px] text-lg py-4' : ''} transition-all duration-200`}
                  style={{ touchAction: 'manipulation' }}
                >
                  {tier.ctaText}
                </Button>
                {tier.name === 'Sanctuary' && isMobile && (
                  <p className="text-sm text-sage-600 text-center mt-3 leading-relaxed">
                    Always free • No commitment • Full privacy
                  </p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile-Optimized Financial Safety Notice */}
      {isMobile && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-green-800 mb-3 text-center">Financial Safety Promise</h3>
            <div className="space-y-3 text-base text-green-700">
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                Cancel anytime, no questions asked
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                Sliding scale pricing for financial hardship
              </p>
              <p className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">✓</span>
                Your data stays accessible even if you downgrade
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Guarantee Section - Mobile Optimized */}
      <div className="bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-light text-sanctuary-gray-900 mb-8 md:mb-6">
              Your Peace of Mind Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-lg font-medium text-sanctuary-gray-900 mb-3 md:mb-2">Privacy First</h3>
                <p className="text-sanctuary-gray-600 text-base md:text-sm leading-relaxed">
                  Your data is encrypted, private, and never sold. You own your healing journey completely.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-lg font-medium text-sanctuary-gray-900 mb-3 md:mb-2">Cancel Anytime</h3>
                <p className="text-sanctuary-gray-600 text-base md:text-sm leading-relaxed">
                  No contracts, no penalties. Change plans or cancel whenever you need. Your data stays accessible.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-lg font-medium text-sanctuary-gray-900 mb-3 md:mb-2">Sliding Scale</h3>
                <p className="text-sanctuary-gray-600 text-base md:text-sm leading-relaxed">
                  Financial hardship shouldn't prevent healing. We offer sliding scale pricing and hardship exemptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Mobile-First Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-sanctuary-gray-900 mb-4">
            Questions We Often Hear
          </h2>
          <p className="text-lg md:text-xl text-sanctuary-gray-600 leading-relaxed">
            Your concerns matter. Here are thoughtful answers to common questions.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} variant="sanctuary" className="overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left"
                style={{ 
                  minHeight: '64px',
                  touchAction: 'manipulation'
                }}
              >
                <CardHeader className="hover:bg-sage-50 transition-colors duration-200 py-6">
                  <div className="flex items-center justify-between">
                    <CardTitle level="h3" className="text-lg md:text-lg pr-4">
                      {faq.question}
                    </CardTitle>
                    <div className={`transform transition-transform duration-300 flex-shrink-0 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-6 h-6 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${
                expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <CardContent>
                  <p className="text-sanctuary-gray-600 leading-relaxed pb-4 text-base">
                    {faq.answer}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA - Mobile-Optimized */}
      <div className="bg-gradient-to-br from-sage-400 to-sage-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6">
            Your Healing Journey
            <span className="block mt-2">Starts Here</span>
          </h2>
          <p className="text-lg md:text-xl text-sage-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands of people who've chosen to prioritize their mental health and emotional growth. 
            Every journey is unique, every step matters.
          </p>
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto">
            <Button 
              variant="secondary" 
              size={isMobile ? 'touch' : 'lg'} 
              className={`bg-white text-sage-600 hover:bg-sanctuary-gray-50 ${isMobile ? 'min-h-[64px] text-lg' : ''}`}
              style={{ touchAction: 'manipulation' }}
            >
              Start Free with Sanctuary
            </Button>
            <Button 
              variant="ghost" 
              size={isMobile ? 'touch' : 'lg'} 
              className={`text-white border-white hover:bg-white/10 ${isMobile ? 'min-h-[64px] text-lg' : ''}`}
              style={{ touchAction: 'manipulation' }}
            >
              Explore Deep Cut Features
            </Button>
          </div>
          <p className="text-sage-200 text-base md:text-sm mt-6">
            No credit card required • Cancel anytime • Your data stays private
          </p>
        </div>
      </div>
    </div>
  );
}