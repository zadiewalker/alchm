'use client';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';

// Premium Sanctuary Pricing - Digital Sanctuary Philosophy
// "Investment in healing, not payment for features" - Jony Ive restraint meets healing invitation

interface SanctuaryOffering {
  name: string;
  sanctuary_description: string;
  investment: string;
  investment_period: string;
  is_premium: boolean;
  sanctuary_enhancements: string[];
  healing_promise: string;
  invitation_text: string;
  invitation_style: 'primary' | 'secondary' | 'ghost';
  stripe_price_id?: string;
}

const sanctuaryOfferings: SanctuaryOffering[] = [
  {
    name: 'Essential Sanctuary',
    sanctuary_description: 'Your complete foundation for healing and growth',
    investment: 'Gifted',
    investment_period: 'Always available',
    is_premium: false,
    sanctuary_enhancements: [
      'Unlimited private journaling sanctuary',
      'Khepera wisdom companion for gentle guidance',
      'Crisis support sanctuary with 24/7 resources',
      'Healing milestone celebrations',
      'Offline sanctuary for anywhere reflection',
      'Community circle for shared wisdom',
      'Cultural healing traditions integration',
      'Emotional pattern recognition beginnings'
    ],
    healing_promise: 'Every soul deserves a sanctuary to begin their healing journey. This foundation honors your courage to seek growth.',
    invitation_text: 'Enter Your Sanctuary',
    invitation_style: 'secondary'
  },
  {
    name: 'Premium Sanctuary',
    sanctuary_description: 'Deeper wisdom and expanded healing capabilities',
    investment: '$4.99',
    investment_period: '/month',
    is_premium: true,
    sanctuary_enhancements: [
      'All Essential Sanctuary capabilities',
      'Advanced emotional wisdom mapping',
      'Unlimited Khepera conversations for deeper insight',
      'Complete healing achievement garden',
      'Priority sanctuary for enhanced crisis support',
      'Neuroplasticity habit cultivation tools',
      'Personalized AI wisdom training',
      'Comprehensive growth reflection reports',
      'Vision manifestation planning tools',
      'Enhanced community sanctuary privileges',
      'Trauma-informed progress tracking',
      'Sacred ritual and ceremony guides'
    ],
    healing_promise: 'For travelers ready to explore the deeper chambers of their sanctuary, with enhanced wisdom partnership and advanced healing tools.',
    invitation_text: 'Invest in Deeper Wisdom',
    invitation_style: 'primary',
    stripe_price_id: 'price_premium_sanctuary_monthly'
  },
  {
    name: 'Oracle Sanctuary',
    sanctuary_description: 'Advanced spiritual guidance and premium healing capabilities',
    investment: '$9.99',
    investment_period: '/month',
    is_premium: true,
    sanctuary_enhancements: [
      'All Premium Sanctuary capabilities',
      'Oracle-level Khepera wisdom with advanced spiritual guidance',
      'Personalized healing archetype analysis and development',
      'Advanced neuroplasticity programming and habit mastery',
      'Priority crisis intervention with specialist support',
      'Comprehensive trauma pattern recognition and healing',
      'Sacred ceremony guides and ritual planning',
      'Vision manifestation coaching and goal achievement',
      'Advanced community leadership privileges',
      'Research participation opportunities',
      'Direct access to healing mentors and guides',
      'Comprehensive wellness prediction and optimization'
    ],
    healing_promise: 'For dedicated healers ready for the deepest transformation. Oracle Sanctuary provides the most advanced wisdom partnership and comprehensive healing support.',
    invitation_text: 'Access Oracle Wisdom',
    invitation_style: 'primary',
    stripe_price_id: 'price_oracle_sanctuary_monthly'
  }
];

const sanctuaryWisdom = [
  {
    question: 'How sacred is my privacy within this sanctuary?',
    answer: 'Your sanctuary is completely sacred. Every word you write is encrypted with the highest protection, never shared, never sold. Your healing journey belongs entirely to you. We are merely guardians of the space you create.'
  },
  {
    question: 'Can I change my sanctuary investment or step away when needed?',
    answer: 'Absolutely. Your sanctuary adapts to your needs. Expand or simplify your sanctuary anytime without penalty. Even if you step back to Essential Sanctuary, your sacred writings and progress remain safely protected.'
  },
  {
    question: 'What happens during a crisis or overwhelming moment?',
    answer: 'Every sanctuary level includes immediate crisis sanctuary access. Our 24/7 resource sanctuary connects you with local emergency services when needed. Your safety is our highest priority, always.'
  },
  {
    question: 'How does Khepera wisdom companion support my healing?',
    answer: 'Khepera is trained in trauma-informed wisdom and emotional alchemy. It offers gentle insights, reflective prompts, and compassionate understanding while never replacing human therapeutic support. Think of it as a wise, ever-present companion for your journey.'
  },
  {
    question: 'Does this sanctuary honor different cultural healing traditions?',
    answer: 'Yes, profoundly. ALCHM sanctuary is built with cultural responsiveness at its foundation. We integrate multiple languages and healing traditions, recognizing that wellness wisdom comes in many beautiful forms.'
  },
  {
    question: 'What if financial stress makes investment difficult?',
    answer: 'Essential Sanctuary provides a complete, powerful healing experience forever gifted. We also offer sliding scale sanctuary access and hardship exemptions. Financial struggle should never block the path to healing.'
  },
  {
    question: 'How do I know this investment serves my healing?',
    answer: 'Start with Essential Sanctuary to experience our approach. Premium Sanctuary expands when you\'re ready for deeper work. Every feature serves healing, never distraction. Your growth guides the value.'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<SanctuaryOffering | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for success celebration from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('celebration') === 'true') {
      setShowSuccess(true);
    }
  }, []);

  const handleOfferingSelection = (offering: SanctuaryOffering) => {
    if (!offering.is_premium) {
      // Free sanctuary - redirect to sign up
      window.location.href = '/auth/signup';
    } else {
      setSelectedOffering(offering);
    }
  };

  const handlePaymentSuccess = () => {
    setSelectedOffering(null);
    setShowSuccess(true);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(error + '\n\nFor assistance or sliding scale options, please contact support.');
    setSelectedOffering(null);
  };

  if (showSuccess) {
    return (
      <SanctuarySuccessCelebration 
        onContinue={() => {
          setShowSuccess(false);
          window.location.href = '/dashboard';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-400 via-sage-500 to-sage-600">
      {/* Sacred Sanctuary Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-sanctuary/10 via-transparent to-sanctuary/5 pointer-events-none animate-breathing"></div>
      
      {/* Floating sacred elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sanctuary/20 rounded-full animate-sanctuary-float animation-delay-1000"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-sanctuary/30 rounded-full animate-sanctuary-float animation-delay-2000"></div>
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-sanctuary/25 rounded-full animate-sanctuary-float animation-delay-3000"></div>
      
      {/* Sacred Header - Premium Investment Philosophy */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-phi-lg sm:px-phi-xl lg:px-phi-2xl pt-phi-3xl pb-phi-4xl">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-phi-3xl md:text-8xl font-extralight tracking-wide text-sanctuary mb-phi-xl animate-gentle-breathe">
              Invest in Your
              <span className="block text-sanctuary/90 mt-phi-sm">Sacred Sanctuary</span>
            </h1>
            <p className="text-phi-lg md:text-phi-xl text-sanctuary/80 leading-relaxed mb-phi-2xl font-light tracking-wide">
              Not a subscription, but a sacred investment in your healing journey.
              <span className="block mt-phi-sm">Choose the sanctuary that honors your soul's path.</span>
            </p>
            <div className="sanctuary-glass border border-sanctuary/30 rounded-3xl p-phi-xs shadow-floating backdrop-blur-xl inline-flex items-center space-x-phi-xs animate-sanctuary-float">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-phi-lg py-phi-sm rounded-2xl text-small font-light transition-all duration-400 tracking-wide ${
                  billingPeriod === 'monthly'
                    ? 'bg-sanctuary text-sage-700 shadow-soft hover:scale-105'
                    : 'text-sanctuary/80 hover:text-sanctuary hover:bg-sanctuary/10'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-phi-lg py-phi-sm rounded-2xl text-small font-light transition-all duration-400 tracking-wide ${
                  billingPeriod === 'yearly'
                    ? 'bg-sanctuary text-sage-700 shadow-soft hover:scale-105'
                    : 'text-sanctuary/80 hover:text-sanctuary hover:bg-sanctuary/10'
                }`}
              >
                <span className="inline-flex items-center gap-phi-xs">
                  Yearly
                  <span className="text-phi-xs bg-warm-amber/90 text-sanctuary px-phi-xs py-0.5 rounded-full animate-gentle-pulse">
                    Save 20%
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sacred Sanctuary Offerings - Premium Card Experience */}
      <div className="max-w-7xl mx-auto px-phi-lg sm:px-phi-xl lg:px-phi-2xl -mt-phi-3xl pb-phi-4xl">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-phi-xl md:gap-phi-2xl">
          {sanctuaryOfferings.map((offering, index) => (
            <div
              key={offering.name}
              className={`organic-container sanctuary-glass border shadow-floating transition-all duration-600 hover:scale-105 active:scale-98 group relative overflow-hidden ${
                offering.is_premium 
                  ? 'border-sage-400/40 shadow-sacred bg-gradient-to-br from-sanctuary/95 to-sage-50/90' 
                  : 'border-sanctuary/30 hover:shadow-sacred'
              }`}
            >
              {offering.is_premium && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-sage-400 to-sage-500 text-sanctuary text-center py-phi-sm text-phi-xs font-light tracking-wide rounded-t-3xl">
                  Sacred Premium Sanctuary
                </div>
              )}
              
              <div className={`p-phi-xl ${offering.is_premium ? 'pt-phi-2xl pb-phi-xl' : 'pt-phi-xl pb-phi-lg'} text-center`}>
                <h2 className={`text-xlarge font-light tracking-normal mb-phi-lg animate-gentle-breathe ${
                  offering.is_premium ? 'text-sage-800' : 'text-sage-800'
                }`}>
                  {offering.name}
                </h2>
                
                {/* Sacred Investment Display */}
                <div className="mb-phi-lg">
                  <div className="flex items-baseline justify-center mb-phi-sm">
                    <span className={`text-3xlarge md:text-8xl font-light tracking-normal animate-gentle-pulse ${
                      offering.is_premium ? 'text-sage-700' : 'text-sage-800'
                    }`}>
                      {offering.investment}
                    </span>
                    <span className={`ml-phi-sm text-medium font-light tracking-normal ${
                      offering.is_premium ? 'text-sage-600' : 'text-sage-700'
                    }`}>
                      {offering.investment_period}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && offering.is_premium && (
                    <div className="sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl inline-block">
                      <p className="text-phi-xs font-light text-sage-700 tracking-wide">
                        Annual sanctuary • 20% wisdom savings
                      </p>
                    </div>
                  )}
                </div>
                
                <p className={`text-base leading-relaxed mb-phi-lg font-normal tracking-normal ${
                  offering.is_premium ? 'text-sage-700' : 'text-sage-700'
                }`}>
                  {offering.sanctuary_description}
                </p>
              </div>

              <div className="px-phi-xl pb-phi-sm">
                <div className={`sanctuary-glass border border-sanctuary/20 rounded-2xl p-phi-lg mb-phi-lg backdrop-blur-xl ${
                  offering.is_premium ? 'bg-sage-100/30' : 'bg-sage-50/60'
                }`}>
                  <p className={`text-phi-sm leading-relaxed italic font-light tracking-wide ${
                    offering.is_premium ? 'text-sage-700' : 'text-sage-800'
                  }`}>
                    "{offering.healing_promise}"
                  </p>
                </div>
                
                <div className="space-y-phi-sm">
                  {offering.sanctuary_enhancements.slice(0, 6).map((enhancement, enhancementIndex) => (
                    <div key={enhancementIndex} className="flex items-start space-x-phi-sm group">
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-0.5 transition-all duration-400 group-hover:scale-110 ${
                        offering.is_premium ? 'bg-sage-400/20 border border-sage-400/30' : 'bg-sage-100/80 border border-sage-200/60'
                      } flex items-center justify-center backdrop-blur-sm`}>
                        <svg className={`w-3 h-3 transition-all duration-400 group-hover:animate-gentle-pulse ${
                          offering.is_premium ? 'text-sage-600' : 'text-sage-500'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className={`text-phi-sm leading-relaxed font-light tracking-wide transition-all duration-400 group-hover:text-sage-800 ${
                        offering.is_premium ? 'text-sage-700' : 'text-sage-700'
                      }`}>
                        {enhancement}
                      </span>
                    </div>
                  ))}
                  
                  {offering.sanctuary_enhancements.length > 6 && (
                    <div className="text-center pt-phi-sm">
                      <div className={`sanctuary-glass border border-sanctuary/30 rounded-2xl px-phi-sm py-phi-xs backdrop-blur-xl inline-block ${
                        offering.is_premium ? 'text-sage-600' : 'text-sage-600'
                      }`}>
                        <span className="text-phi-xs font-light tracking-wide">
                          + {offering.sanctuary_enhancements.length - 6} more sacred enhancements
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-phi-xl pt-phi-lg">
                <SanctuaryPaymentFlow
                  offering={offering}
                  billingPeriod={billingPeriod}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
              
              {/* Sacred Card Decorations */}
              <div className="absolute -top-2 -right-2 text-phi-sm opacity-60 animate-gentle-sparkle">
                {offering.is_premium ? '💎' : '✨'}
              </div>
              {offering.is_premium && (
                <div className="absolute -bottom-1 -left-1 text-warm-amber opacity-50 animate-gentle-sparkle animation-delay-1000">⭐</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee Section - Trust Building */}
      <div className="bg-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-light text-sanctuary-gray-900 mb-6">
              Your Peace of Mind Matters
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-sanctuary-gray-900 mb-2">Privacy First</h3>
                <p className="text-sanctuary-gray-600 text-sm leading-relaxed">
                  Your data is encrypted, private, and never sold. You own your healing journey completely.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-sanctuary-gray-900 mb-2">Cancel Anytime</h3>
                <p className="text-sanctuary-gray-600 text-sm leading-relaxed">
                  No contracts, no penalties. Change plans or cancel whenever you need. Your data stays accessible.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-sanctuary-gray-900 mb-2">Sliding Scale</h3>
                <p className="text-sanctuary-gray-600 text-sm leading-relaxed">
                  Financial hardship shouldn't prevent healing. We offer sliding scale pricing and hardship exemptions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sanctuary Wisdom Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-sanctuary-gray-900 mb-4">
            Sanctuary Wisdom
          </h2>
          <p className="text-xl text-sanctuary-gray-600 leading-relaxed">
            Gentle answers to honor your thoughtful questions about investing in healing.
          </p>
        </div>

        <div className="space-y-4">
          {sanctuaryWisdom.map((wisdom, index) => (
            <Card key={index} variant="sanctuary" className="overflow-hidden">
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full text-left"
              >
                <CardHeader className="hover:bg-sage-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <CardTitle level="h3" className="text-lg">
                      {wisdom.question}
                    </CardTitle>
                    <div className={`transform transition-transform duration-300 ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}>
                      <svg className="w-5 h-5 text-sage-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <p className="text-sanctuary-gray-600 leading-relaxed pb-4">
                    {wisdom.answer}
                  </p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Proof - Authentic Testimonials */}
      <div className="bg-sanctuary-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-sanctuary-gray-900 mb-4">
              Voices from Our Community
            </h2>
            <p className="text-xl text-sanctuary-gray-600 leading-relaxed">
              Real experiences from people on their healing journeys.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "My sanctuary has become sacred space where I can be completely honest. The Premium features helped me understand patterns I never saw before.",
                author: "Sarah M.",
                sanctuary: "Premium Sanctuary"
              },
              {
                quote: "As a trauma survivor, I needed something that felt genuinely safe. The Essential Sanctuary gave me everything I needed to begin healing on my terms.",
                author: "Marcus R.",
                sanctuary: "Essential Sanctuary"
              },
              {
                quote: "The cultural responsiveness touched my soul. Finally, a sanctuary that honors my background and healing traditions without assumptions.",
                author: "Priya K.",
                sanctuary: "Premium Sanctuary"
              }
            ].map((testimonial, index) => (
              <Card key={index} variant="sanctuary" className="h-full">
                <CardContent className="p-6">
                  <p className="text-sanctuary-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sanctuary-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-sage-600">{testimonial.sanctuary}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-warm-amber" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA - Sacred Invitation */}
      <div className="bg-gradient-to-br from-sage-400 to-sage-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Your Healing Sanctuary
            <span className="block mt-2">Awaits Your Investment</span>
          </h2>
          <p className="text-xl text-sage-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands who've chosen to invest in their emotional growth and healing. 
            Every sanctuary is unique, every investment in yourself matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-sage-600 hover:bg-sanctuary-gray-50"
              onClick={() => window.location.href = '/auth/signup'}
            >
              Enter Essential Sanctuary
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white border-white hover:bg-white/10"
              onClick={() => setSelectedOffering(sanctuaryOfferings.find(o => o.is_premium) || null)}
            >
              Invest in Premium Sanctuary
            </Button>
          </div>
          <p className="text-sage-200 text-sm mt-6">
            No credit card required for Essential • Invest anytime • Your sanctuary data stays sacred
          </p>
        </div>
      </div>
      
      {/* Import Payment Flow Components */}
      {selectedOffering && (
        <SanctuaryPaymentFlow
          offering={selectedOffering}
          billingPeriod={billingPeriod}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
}

// Import the payment flow components
import { SanctuaryPaymentFlow, SanctuarySuccessCelebration } from '@/components/ui/SanctuaryPaymentFlow';