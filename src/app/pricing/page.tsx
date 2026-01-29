'use client';
import Link from 'next/link';

export default function PricingPage() {

  const plans = [
    {
      id: 'sanctuary',
      name: 'Sanctuary',
      price: 'Free',
      period: '',
      description: 'Your safe space to begin healing',
      features: [
        'Unlimited journaling',
        'Basic Khepera insights',
        'Crisis support resources',
        'Privacy protection'
      ],
      current: true
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$4.99',
      period: '/month',
      description: 'Deepen your healing journey',
      features: [
        'Everything in Sanctuary',
        'Advanced AI insights',
        'Healing pathways',
        'Progress tracking',
        'Community access'
      ],
      popular: true
    },
    {
      id: 'transformation',
      name: 'Transformation',
      price: '$9.99',
      period: '/month',
      description: 'Complete healing ecosystem',
      features: [
        'Everything in Growth',
        'Priority Khepera responses',
        'Personalized healing plans',
        'Expert content access',
        'One-on-one guidance'
      ]
    }
  ];

  const handleSelectPlan = (planId: string) => {
    // For demo purposes, just log the selection
    console.log('Selected plan:', planId);
  };

  return (
    <div className="page-container bg-gradient-to-b from-[#8B9A7C] to-[#A8B5A0]">
      {/* Fixed Header */}
      <header className="px-6 pt-4 pb-2 flex items-center">
        <Link href="/dashboard" className="group relative">
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 group-active:bg-white/15 rounded-lg transition-all duration-300" />
          <span className="relative text-white/70 text-lg">← Back</span>
        </Link>
        <h1 className="text-white text-xl font-light ml-4">Choose Your Journey</h1>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* Intro */}
        <div className="text-center mb-8">
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Every healing journey is unique. Choose the level of support that feels right for you today.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative ${
                plan.popular 
                  ? 'bg-white/20 border-2 border-white/40' 
                  : 'bg-white/10 border border-white/20'
              } p-6 rounded-xl backdrop-blur-sm`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/30 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              {/* Current Badge */}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/30 text-white text-xs px-3 py-1 rounded-full">
                  Current Plan
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl text-white font-light mb-2">
                  {plan.name}
                </h3>
                <div className="mb-3">
                  <span className="text-3xl text-white font-light">
                    {plan.price}
                  </span>
                  <span className="text-white/70 text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="text-white/70 text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-white/80 text-sm">
                    <span className="text-white/60 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.current}
                className={`w-full group relative py-3 ${
                  plan.current ? 'opacity-50' : ''
                }`}
              >
                <div className={`absolute inset-0 transition-all duration-300 rounded-lg ${
                  plan.popular
                    ? 'bg-white/30 group-hover:bg-white/40 group-active:bg-white/45'
                    : 'bg-white/20 group-hover:bg-white/30 group-active:bg-white/35'
                }`} />
                <span className="relative text-white font-medium">
                  {plan.current 
                    ? 'Current Plan'
                    : plan.id === 'sanctuary' 
                    ? 'Get Started Free'
                    : `Choose ${plan.name}`
                  }
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm max-w-md mx-auto">
            <h3 className="text-white font-light mb-4">🔒 Your Trust, Our Promise</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>• Cancel anytime, no questions asked</li>
              <li>• Your data always stays private</li>
              <li>• No ads, ever</li>
              <li>• Dedicated to your healing, not profit</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-[#A8B5A0] to-transparent">
        <p className="text-white/50 text-sm text-center">Invest in your healing journey</p>
      </div>
    </div>
  );
}