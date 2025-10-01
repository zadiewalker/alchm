'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { SacredLayout, SacredNav } from '@/components/layout/SacredLayout';
import { CrisisFloatingButton } from '@/components/ui/CrisisFloatingButtonNew';
import { CriticalErrorBoundary } from '@/components/ErrorBoundary';

// Sacred Journey Button - Embodying Jony Ive's "Simplicity is the ultimate sophistication"
function SacredJourneyButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handleSacredTransition = async () => {
    // Gentle haptic feedback for physical connection
    if ('vibrate' in navigator) {
      navigator.vibrate([50]);
    }
    
    setIsPressed(true);
    
    // Sacred breathing pause before transition
    await new Promise(resolve => setTimeout(resolve, 600));
    window.location.href = '/auth/login';
  };

  const buttonVariants = {
    idle: { 
      scale: 1, 
      boxShadow: "0 8px 32px rgba(164, 183, 146, 0.15)" 
    },
    hover: { 
      scale: 1.02, 
      y: -2,
      boxShadow: "0 16px 64px rgba(164, 183, 146, 0.25)" 
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.button
      onClick={handleSacredTransition}
      className="alchm-button alchm-button--primary"
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      disabled={isPressed}
      aria-label="Begin your healing journey with ALCHM"
    >
      {isPressed ? (
        <motion.div 
          className="sanctuary-flex sanctuary-flex--center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-sanctuary/30 border-t-sanctuary rounded-full mr-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className="text-base font-light">Opening sanctuary...</span>
        </motion.div>
      ) : (
        <span className="text-base font-medium tracking-wide">Begin Healing</span>
      )}
    </motion.button>
  );
}

// Sacred Sanctuary - Jony Ive's "Simplicity is the ultimate sophistication"
function SacredSanctuary() {
  return (
    <SacredLayout variant="sanctuary" showBackground={true}>
      {/* Sacred Navigation - Invisible Until Needed */}
      <SacredNav variant="minimal" showCrisisButton={true} />

      {/* Sacred Hero - ONE Message, ONE Action */}
      <div className="sacred-hero">
        <motion.div 
          className="sacred-hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Single Sacred Message */}
          <motion.h1 
            className="sacred-hero-title animate-breathing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            Your sanctuary for healing
          </motion.h1>
          
          <motion.p 
            className="sacred-hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Safe, private, trauma-informed support for your emotional journey
          </motion.p>
          
          {/* Single Sacred Action */}
          <motion.div 
            className="sacred-hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <SacredJourneyButton />
          </motion.div>
          
          {/* Essential Trust Signals - Minimal */}
          <motion.div 
            className="mt-8 text-sanctuary/70 text-small"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <div className="sanctuary-flex sanctuary-flex--center">
              <span>Always free</span>
              <span className="opacity-40 mx-3">•</span>
              <span>Private & secure</span>
              <span className="opacity-40 mx-3">•</span>
              <span>Ages 18+</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sacred Footer - Legal Essentials */}
      <motion.footer 
        className="mt-auto pt-8 pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <div className="sanctuary-container text-center">
          <div className="sanctuary-flex sanctuary-flex--center text-sanctuary/50 text-small">
            <motion.a 
              href="/privacy-policy.html"
              className="text-sanctuary/50 hover:text-sanctuary/80 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Privacy
            </motion.a>
            <span className="opacity-30 mx-4">•</span>
            <motion.a 
              href="/terms.html"
              className="text-sanctuary/50 hover:text-sanctuary/80 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Terms
            </motion.a>
          </div>
        </div>
      </motion.footer>
    </SacredLayout>
  );
}

// Sacred Loading State - Embodying Anticipation
function SacredLoading() {
  return (
    <SacredLayout variant="sanctuary" showBackground={true}>
      <div className="sacred-hero">
        <motion.div 
          className="sacred-hero-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xlarge font-ultralight text-sanctuary mb-8 tracking-tight"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ALCHM
          </motion.h1>
          
          <motion.p 
            className="text-medium font-light text-sanctuary/80 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Preparing your sanctuary...
          </motion.p>
          
          <motion.div
            className="w-8 h-8 border-2 border-sanctuary/30 border-t-sanctuary rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    </SacredLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<SacredLoading />}>
      <SacredSanctuary />
      
      {/* Sacred Crisis Support - Always Present */}
      <CriticalErrorBoundary>
        <CrisisFloatingButton 
          position="bottom-right" 
          size="large" 
          autoDetect={true} 
          offlineMode={false}
        />
      </CriticalErrorBoundary>
    </Suspense>
  );
}