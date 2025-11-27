'use client';

// SACRED CRISIS SUPPORT: Trauma-informed emergency page
// Philosophy: Hold, don't alarm. Illuminate, don't glare. Guide, don't push.
// Target: <10KB bundle size for 3G networks

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SacredCrisisScarab from '@/components/ui/SacredCrisisScarab';

// Crisis resources - redesigned with trauma-informed principles
const SACRED_CRISIS_RESOURCES = [
  {
    id: 'crisis-call-988',
    name: '988 Lifeline',
    action: () => window.open('tel:988', '_self'),
    primary: 'Call 988',
    secondary: '24/7 Suicide & Crisis Lifeline',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="#a4b792" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    priority: 1,
    borderColor: 'rgba(164, 183, 146, 0.3)'
  },
  {
    id: 'crisis-text-741741',
    name: 'Crisis Text Line',
    action: () => window.open('sms:741741&body=HOME', '_self'),
    primary: 'Text HOME to 741741',
    secondary: 'Free 24/7 crisis counseling',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#a4b792" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    priority: 1,
    borderColor: 'rgba(164, 183, 146, 0.3)'
  },
  {
    id: 'emergency-911',
    name: 'Emergency Services',
    action: () => window.open('tel:911', '_self'),
    primary: 'Call 911',
    secondary: 'For life-threatening emergencies',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="#cb997e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    priority: 0,
    borderColor: 'rgba(203, 153, 126, 0.3)'
  }
];

// Crisis severity levels for proper response
type CrisisSeverity = 'immediate' | 'urgent' | 'support';

interface SacredCrisisPageProps {
  severity?: CrisisSeverity;
  onContinueToJournal?: () => void;
  backupText?: string;
}

export default function CrisisEmergencyPage({ 
  severity = 'support',
  onContinueToJournal,
  backupText = ''
}: SacredCrisisPageProps) {
  const [hasReachedOut, setHasReachedOut] = useState(false);
  const [showMoreResources, setShowMoreResources] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Sacred entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSacredAction = (resource: typeof SACRED_CRISIS_RESOURCES[0]) => {
    setHasReachedOut(true);
    
    // Gentle haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Brief pause before action (allows for presence/intention)
    setTimeout(() => {
      resource.action();
    }, 400);
  };

  const getSacredMessage = () => {
    switch (severity) {
      case 'immediate':
        return {
          title: "You're Not Alone",
          subtitle: "Help is here, right now, exactly as you are.",
          description: "Your life matters deeply. These resources are here to hold you through this moment."
        };
      case 'urgent':
        return {
          title: "You're Not Alone", 
          subtitle: "You've shown incredible strength reaching out.",
          description: "Crisis support is available immediately. You deserve care and compassion."
        };
      default:
        return {
          title: "You're Not Alone",
          subtitle: "If you're in crisis or need support right now, these resources are here for you - always.",
          description: "Free, confidential support available 24/7. Your life has value."
        };
    }
  };

  const sacredMessage = getSacredMessage();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ 
        background: 'linear-gradient(180deg, #a4b792 0%, #b8c8a8 50%, #eeddd3 100%)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-md"
          >
            {/* Sacred Scarab - Crisis Mode */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-center"
              style={{ marginTop: '80px', marginBottom: '56px' }}
            >
              <SacredCrisisScarab size={96} animate={true} />
            </motion.div>

            {/* Sacred Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h1 
                className="font-medium tracking-tight leading-none text-off-white mb-5"
                style={{ fontSize: '36px', color: '#f7f7f2', letterSpacing: '-0.8px' }}
              >
                {sacredMessage.title}
              </h1>
              <p 
                className="leading-relaxed text-center"
                style={{ 
                  fontSize: '17px', 
                  color: 'rgba(247, 247, 242, 0.85)',
                  lineHeight: '1.6',
                  maxWidth: '400px',
                  margin: '0 auto 20px'
                }}
              >
                {sacredMessage.subtitle}
              </p>
              <p 
                className="leading-relaxed text-center"
                style={{ 
                  fontSize: '15px', 
                  color: 'rgba(247, 247, 242, 0.7)',
                  lineHeight: '1.6',
                  maxWidth: '380px',
                  margin: '0 auto'
                }}
              >
                {sacredMessage.description}
              </p>
            </motion.div>

            {/* Sacred Crisis Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="space-y-4 mb-8"
            >
              {SACRED_CRISIS_RESOURCES
                .filter(resource => severity === 'immediate' || resource.priority > 0)
                .map((resource, index) => (
                  <motion.button
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + (index * 0.1) }}
                    onClick={() => handleSacredAction(resource)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(164, 183, 146, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                      e.currentTarget.style.borderColor = resource.borderColor;
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(247, 247, 242, 1)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.background = 'rgba(247, 247, 242, 0.95)';
                    }}
                    className="w-full flex items-center text-left cursor-pointer"
                    style={{
                      background: 'rgba(247, 247, 242, 0.95)',
                      backdropFilter: 'blur(8px)',
                      border: `2px solid ${resource.borderColor}`,
                      borderRadius: '16px',
                      padding: '20px 24px',
                      minHeight: '68px',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#2e2e2e',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      touchAction: 'manipulation'
                    }}
                  >
                    <div className="flex items-center justify-center" style={{ minWidth: '24px', marginRight: '16px' }}>
                      {resource.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-lg" style={{ color: '#2e2e2e', marginBottom: '4px' }}>
                        {resource.primary}
                      </div>
                      <div className="text-sm opacity-60" style={{ color: '#2e2e2e' }}>
                        {resource.secondary}
                      </div>
                    </div>
                  </motion.button>
                ))
              }
            </motion.div>

            {/* Additional Support Section */}
            {severity !== 'immediate' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="text-center mb-8"
              >
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={() => setShowMoreResources(!showMoreResources)}
                    className="inline-flex items-center gap-2 bg-white/50 border border-white/20 rounded-full px-5 py-3 text-sm font-medium text-gray-800 hover:bg-white/75 hover:border-white/40 transition-all duration-200"
                    style={{ touchAction: 'manipulation', minHeight: '44px' }}
                  >
                    <span>🌐</span>
                    <span>International Crisis Lines</span>
                  </button>
                  <button
                    onClick={() => setShowMoreResources(!showMoreResources)}
                    className="inline-flex items-center gap-2 bg-white/50 border border-white/20 rounded-full px-5 py-3 text-sm font-medium text-gray-800 hover:bg-white/75 hover:border-white/40 transition-all duration-200"
                    style={{ touchAction: 'manipulation', minHeight: '44px' }}
                  >
                    <span>💭</span>
                    <span>Self-Care Strategies</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Continue to Journal Option */}
            {severity !== 'immediate' && onContinueToJournal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="text-center mb-8"
              >
                <button
                  onClick={onContinueToJournal}
                  className="w-full p-4 bg-white/30 border border-white/20 rounded-2xl text-white/90 hover:bg-white/40 hover:border-white/40 transition-all duration-200"
                  style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    minHeight: '68px',
                    touchAction: 'manipulation'
                  }}
                >
                  <div className="font-medium">Continue with healing practices</div>
                  <div className="text-sm opacity-75 mt-1">Sometimes writing helps process feelings</div>
                </button>
              </motion.div>
            )}

            {/* Connection Status Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-sm font-medium"
              style={{ color: 'rgba(247, 247, 242, 0.7)' }}
            >
              <div 
                className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
                style={{ animation: 'pulse 2s infinite' }}
              />
              <span>Resources available offline</span>
            </motion.div>

            {/* Optional: Gentle Exit Path */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              onClick={() => window.history.back()}
              className="absolute top-6 left-6 bg-transparent border-none text-white/60 hover:text-white/90 text-sm font-medium p-3 cursor-pointer transition-colors duration-200"
              style={{ touchAction: 'manipulation' }}
            >
              ← I entered my birth year incorrectly
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}