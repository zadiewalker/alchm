'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import MedicalDisclaimer from '@/components/ui/MedicalDisclaimer';

// Optimized static data - moved outside component to prevent recreation
interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceMonthly: string;
  featured: boolean;
  features: readonly string[];
  supportingText: string;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'ghost';
}

interface Testimonial {
  quote: string;
  author: string;
  plan: string;
}

const PRICING_TIERS: readonly PricingTier[] = [
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
    ] as const,
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
    ] as const,
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
    ] as const,
    supportingText: 'The complete transformation experience with professional-grade tools and human support.',
    ctaText: 'Transform Your Life',
    ctaVariant: 'primary'
  }
] as const;

const FAQ_DATA = [
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
    answer: 'The Sanctuary plan provides a complete, powerful journaling experience forever free. Everyone deserves access to healing tools.'
  }
] as const;

const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote: "ALCHM helped me understand my emotions in a way therapy alone couldn't. The AI feels like having a wise friend who's always there.",
    author: "Sarah M.",
    plan: "Deep Cut"
  },
  {
    quote: "As a trauma survivor, I needed something that felt safe. The free plan gave me everything I needed to start healing on my terms.",
    author: "Marcus R.",
    plan: "Sanctuary"
  },
  {
    quote: "The cultural responsiveness is what sold me. Finally, an app that understands my background and doesn't make assumptions.",
    author: "Priya K.",
    plan: "Oracle"
  }
] as const;

interface PricingPageProps {
  params: { locale: string };
}

export default function PricingPage({ params }: PricingPageProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Memoized event handlers to prevent unnecessary re-renders
  const handlePlanSelection = useCallback((tier: PricingTier) => {
    if (tier.name === 'Sanctuary') {
      window.location.href = `/${params.locale}/auth/signup`;
    } else {
      alert(`${tier.name} plan coming soon! For now, enjoy the free Sanctuary plan with all core features.`);
    }
  }, [params.locale]);

  const handleBillingChange = useCallback((period: 'monthly' | 'yearly') => {
    setBillingPeriod(period);
  }, []);

  const handleFaqToggle = useCallback((index: number) => {
    setExpandedFaq(current => current === index ? null : index);
  }, []);

  // Memoized computed values
  const billingButtons = useMemo(() => ([
    { period: 'monthly' as const, label: 'Monthly' },
    { period: 'yearly' as const, label: 'Yearly', badge: 'Save 20%' }
  ]), []);

  const handleFreePlanCTA = useCallback(() => {
    window.location.href = `/${params.locale}/auth/signup`;
  }, [params.locale]);

  const handlePaidPlanCTA = useCallback(() => {
    alert('Deep Cut features coming soon! Start with the free Sanctuary plan.');
  }, []);

  return (
    <div className="min-h-screen bg-sanctuary-white">
      {/* Sacred Header - Jony Ive minimal perfection */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage-50 to-sanctuary-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-sanctuary-gray-900 mb-6">
              Choose Your
              <span className="block text-[#a4b792] mt-2">Healing Journey</span>
            </h1>
            <p className="text-lg md:text-xl text-sanctuary-gray-600 leading-relaxed mb-8 font-light">
              Every path is valid. Every journey is sacred.
              <span className="block mt-2">Start where you are, grow at your pace.</span>
            </p>
            <div className="inline-flex items-center space-x-1 bg-white rounded-2xl p-1 shadow-gentle">
              {billingButtons.map(({ period, label, badge }) => (
                <button
                  key={period}
                  onClick={() => handleBillingChange(period)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    billingPeriod === period
                      ? 'bg-[#a4b792] text-white shadow-soft'
                      : 'text-sanctuary-gray-600 hover:text-[#a4b792]'
                  }`}
                >
                  {label}
                  {badge && (
                    <span className="ml-2 text-xs bg-warm-amber text-white px-2 py-1 rounded-full">
                      {badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers - Sacred Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-24">
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.name}
              variant={tier.featured ? 'sage' : 'sanctuary'}
              className={`relative overflow-hidden ${
                tier.featured 
                  ? 'md:scale-105 md:z-10 shadow-sacred' 
                  : 'shadow-soft hover:shadow-nurturing'
              } transition-all duration-400`}
            >
              {tier.featured && (
                <div className="absolute top-0 left-0 right-0 bg-sage-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={tier.featured ? 'pt-12' : ''}>
                <CardTitle level="h2" className={tier.featured ? 'text-white' : ''}>
                  {tier.name}
                </CardTitle>
                <CardDescription className={tier.featured ? 'text-sage-100' : ''}>
                  {tier.description}
                </CardDescription>
                
                {/* Pricing Display - Jony Ive Typography */}
                <div className="mt-6 mb-4">
                  <div className="flex items-baseline">
                    <span className={`text-4xl md:text-5xl font-light tracking-tight ${
                      tier.featured ? 'text-white' : 'text-sanctuary-gray-900'
                    }`}>
                      {tier.price}
                    </span>
                    <span className={`ml-2 text-lg ${
                      tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-600'
                    }`}>
                      {tier.priceMonthly}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && tier.price !== 'Free' && (
                    <p className={`text-sm mt-1 ${
                      tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-500'
                    }`}>
                      Billed annually • Save 20%
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <p className={`text-sm leading-relaxed mb-6 ${
                  tier.featured ? 'text-sage-100' : 'text-sanctuary-gray-600'
                }`}>
                  {tier.supportingText}
                </p>
                
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={`${tier.name}-${featureIndex}`} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 ${
                        tier.featured ? 'bg-sage-200' : 'bg-sage-100'
                      } flex items-center justify-center`}>
                        <svg className={`w-3 h-3 ${
                          tier.featured ? 'text-sage-600' : 'text-sage-500'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className={`text-sm leading-relaxed ${
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
                  size="lg"
                  className="w-full"
                  onClick={() => handlePlanSelection(tier)}
                >
                  {tier.ctaText}
                </Button>
              </CardFooter>
            </Card>
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
                <div className="w-12 h-12 bg-[#a4b792] rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-12 h-12 bg-[#a4b792] rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="w-12 h-12 bg-[#a4b792] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-sanctuary-gray-900 mb-2">Quality Service</h3>
                <p className="text-sanctuary-gray-600 text-sm leading-relaxed">
                  Professional-grade tools and support designed for your healing journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section - Jony Ive Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-sanctuary-gray-900 mb-4">
            Questions We Often Hear
          </h2>
          <p className="text-xl text-sanctuary-gray-600 leading-relaxed">
            Your concerns matter. Here are thoughtful answers to common questions.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => (
            <Card key={`faq-${index}`} variant="sanctuary" className="overflow-hidden">
              <button
                onClick={() => handleFaqToggle(index)}
                className="w-full text-left"
                aria-expanded={expandedFaq === index}
                aria-controls={`faq-answer-${index}`}
              >
                <CardHeader className="hover:bg-sage-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <CardTitle level="h3" className="text-lg">
                      {faq.question}
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
              
              <div 
                id={`faq-answer-${index}`}
                className={`transition-all duration-300 overflow-hidden ${
                  expandedFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={expandedFaq !== index}
              >
                <CardContent>
                  <p className="text-sanctuary-gray-600 leading-relaxed pb-4">
                    {faq.answer}
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((testimonial, index) => (
              <Card key={`testimonial-${testimonial.author}`} variant="sanctuary" className="h-full">
                <CardContent className="p-6">
                  <p className="text-sanctuary-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sanctuary-gray-900">{testimonial.author}</p>
                      <p className="text-sm text-[#a4b792]">{testimonial.plan} Plan</p>
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
      <div className="bg-gradient-to-br from-[#a4b792] to-[#93a682]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Your Healing Journey
            <span className="block mt-2">Starts Here</span>
          </h2>
          <p className="text-xl text-sage-100 leading-relaxed mb-8 max-w-2xl mx-auto">
            Join thousands of people who've chosen to prioritize their mental health and emotional growth. 
            Every journey is unique, every step matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              className="bg-white text-[#a4b792] hover:bg-sanctuary-gray-50"
              onClick={handleFreePlanCTA}
            >
              Start Free with Sanctuary
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="text-white border-white hover:bg-white/10"
              onClick={handlePaidPlanCTA}
            >
              Explore Deep Cut Features
            </Button>
          </div>
          <p className="text-sage-200 text-sm mt-6">
            No credit card required • Cancel anytime • Your data stays private
          </p>
        </div>
      </div>
      
      {/* Medical Disclaimer - Essential for trauma-informed care */}
      <MedicalDisclaimer />
    </div>
  );
}