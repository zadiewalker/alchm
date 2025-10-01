/**
 * Sacred Pricing Page - Jony Ive Design System
 * "We don't design according to price. Price is a consequence of the design."
 * - Jonathan Ive
 * 
 * Focus: Transparent value, not complex tiers
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SacredLayout, SacredNav } from '@/components/layout/SacredLayout';

// Sacred Pricing Card - One clear choice
function SacredPricingCard({ 
  title, 
  price, 
  description, 
  features, 
  isPrimary = false,
  comingSoon = false 
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPrimary?: boolean;
  comingSoon?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`alchm-card ${isPrimary ? 'ring-2 ring-sanctuary/20' : ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sacred Header */}
      <div className="text-center mb-6">
        <h3 className="text-large font-light text-sage-active mb-2">
          {title}
        </h3>
        <div className="mb-4">
          <span className="text-2xlarge font-thin text-sage-active">
            {price}
          </span>
          {price !== 'Free' && (
            <span className="text-base text-sage-active/60 ml-1">
              /month
            </span>
          )}
        </div>
        <p className="text-base text-sage-active/80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Sacred Features */}
      <div className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="sanctuary-flex"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="w-4 h-4 rounded-full bg-sage-primary/20 border border-sage-primary mr-3 mt-1 flex-shrink-0" />
            <span className="text-base text-sage-active/90 font-light">
              {feature}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Sacred Action */}
      <div className="mt-auto">
        {comingSoon ? (
          <div className="text-center py-3 text-sage-active/60 text-base font-light">
            Coming Soon
          </div>
        ) : (
          <motion.button
            className={`w-full ${isPrimary ? 'alchm-button--primary' : 'alchm-button--secondary'} alchm-button`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={comingSoon}
          >
            {price === 'Free' ? 'Start Healing' : 'Choose This Plan'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// Sacred FAQ Section
function SacredFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is ALCHM really free?",
      answer: "Yes, completely free. No hidden costs, no trials that expire. We believe healing should be accessible to everyone."
    },
    {
      question: "Is my data private and secure?",
      answer: "Absolutely. Your journal entries are encrypted and never shared. We follow strict privacy standards designed for mental health."
    },
    {
      question: "Do I need insurance or a prescription?",
      answer: "No insurance or prescription needed. ALCHM is peer support, not medical treatment. Always consult healthcare providers for medical concerns."
    },
    {
      question: "What makes ALCHM different?",
      answer: "ALCHM is built specifically for trauma survivors, with cultural competency and crisis safety as core features, not add-ons."
    }
  ];

  return (
    <div className="sacred-content sacred-content-narrow">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-xlarge font-light text-sanctuary text-center mb-8">
          Common Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="alchm-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left sanctuary-flex sanctuary-flex--between"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-medium font-light text-sage-active">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-sage-active/60 ml-4"
                >
                  ↓
                </motion.div>
              </button>
              
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-sage-primary/20"
                >
                  <p className="text-base text-sage-active/80 font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Sacred Trust Signals
function SacredTrust() {
  return (
    <motion.div
      className="sacred-content text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="alchm-card">
        <h3 className="text-large font-light text-sage-active mb-6">
          Built with Care
        </h3>
        
        <div className="sacred-grid-3">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-sage-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sage-primary text-xl">🔒</span>
            </div>
            <h4 className="text-base font-medium text-sage-active mb-2">
              Privacy First
            </h4>
            <p className="text-small text-sage-active/70 font-light">
              End-to-end encryption, no data selling, HIPAA-inspired security
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-sage-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sage-primary text-xl">🌍</span>
            </div>
            <h4 className="text-base font-medium text-sage-active mb-2">
              Culturally Aware
            </h4>
            <p className="text-small text-sage-active/70 font-light">
              Designed for diverse communities and intersectional identities
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-sage-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sage-primary text-xl">🆘</span>
            </div>
            <h4 className="text-base font-medium text-sage-active mb-2">
              Crisis Ready
            </h4>
            <p className="text-small text-sage-active/70 font-light">
              24/7 crisis detection with immediate emergency resources
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Main Sacred Pricing Page
export default function SacredPricingPage() {
  return (
    <SacredLayout variant="sanctuary" showBackground={true}>
      {/* Sacred Navigation */}
      <SacredNav variant="full" showCrisisButton={true} />

      {/* Sacred Hero */}
      <div className="sacred-hero">
        <motion.div
          className="sacred-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="sacred-hero-title">
            Healing should be accessible
          </h1>
          <p className="sacred-hero-subtitle">
            ALCHM is completely free because we believe everyone deserves support
          </p>
        </motion.div>
      </div>

      {/* Sacred Pricing Grid */}
      <div className="sacred-content">
        <motion.div
          className="sacred-grid-1 max-w-md mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SacredPricingCard
            title="ALCHM Sanctuary"
            price="Free"
            description="Everything you need for your healing journey"
            features={[
              "Unlimited private journaling",
              "AI-powered emotional insights",
              "Crisis safety detection",
              "Cultural competency features",
              "Trauma-informed design",
              "24/7 emergency resources",
              "Privacy-first security",
              "Mobile-optimized experience"
            ]}
            isPrimary={true}
          />
        </motion.div>
      </div>

      {/* Sacred Trust Section */}
      <SacredTrust />

      {/* Sacred FAQ */}
      <SacredFAQ />

      {/* Sacred Final CTA */}
      <motion.div
        className="sacred-content text-center mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="alchm-card max-w-lg mx-auto">
          <h2 className="text-large font-light text-sage-active mb-4">
            Ready to begin?
          </h2>
          <p className="text-base text-sage-active/80 mb-6 font-light">
            Join thousands finding healing through ALCHM's trauma-informed approach
          </p>
          <motion.button
            className="alchm-button alchm-button--primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/auth/login'}
          >
            Start Your Journey
          </motion.button>
        </div>
      </motion.div>
    </SacredLayout>
  );
}