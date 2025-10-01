// ALCHM Khepera Complete Integration
// Transforms ALCHM into "Duolingo for Emotions" with AI emotional concierge

'use client';

import React, { useState, useEffect } from 'react';
import { KheperaChat } from './KheperaChat';
import { KheperaMobileChat } from './KheperaMobileChat';
import { DuolingoStyleGamification } from '../gamification/DuolingoStyleGamification';
import { KheperaCrisisSafeChat } from './KheperaCrisisSafeChat';
import { CommunityHealingCircles } from '../community/CommunityHealingCircles';
import { KheperaPersonalityIntegration } from '../../lib/khepera-personality-integration';
import { useAuth } from '../../contexts/AuthContext';

interface KheperaIntegrationProps {
  currentPage: 'dashboard' | 'journal' | 'pricing' | 'analytics' | 'community';
  userTier: 'sanctuary' | 'seeker' | 'oracle';
  enabledFeatures?: {
    chat?: boolean;
    gamification?: boolean;
    communityCircles?: boolean;
    culturalResponsiveness?: boolean;
    crisisDetection?: boolean;
  };
  onFeatureIntroduction?: (feature: string) => void;
  onCrisisDetected?: () => void;
}

export function KheperaIntegration({
  currentPage,
  userTier,
  enabledFeatures = {
    chat: true,
    gamification: true,
    communityCircles: true,
    culturalResponsiveness: true,
    crisisDetection: true
  },
  onFeatureIntroduction,
  onCrisisDetected
}: KheperaIntegrationProps) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [kheperaActive, setKheperaActive] = useState(false);
  const [conversationContext, setConversationContext] = useState<any>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize conversation context based on current page
  useEffect(() => {
    const getContextualGreeting = async () => {
      if (!user || !kheperaActive) return;

      const context = {
        page: currentPage,
        userTier,
        timeOfDay: new Date().getHours(),
        returning: localStorage.getItem('khepera_last_visit') !== null
      };

      // Get contextual response from Khepera personality system
      const response = await KheperaPersonalityIntegration.enhanceKheperaResponse({
        text: `User visiting ${currentPage} page`,
        userTier,
        currentPage,
        context: 'page_visit'
      });

      setConversationContext(response);
    };

    getContextualGreeting();
  }, [currentPage, userTier, user, kheperaActive]);

  // Handle Khepera activation
  const handleKheperaActivation = () => {
    setKheperaActive(true);
    localStorage.setItem('khepera_last_visit', new Date().toISOString());
  };

  // Handle crisis detection from any component
  const handleCrisisDetection = () => {
    if (onCrisisDetected) {
      onCrisisDetected();
    }
    // Crisis support will be handled by the crisis-safe chat component
  };

  // Handle feature introductions
  const handleFeatureIntroduction = (feature: string) => {
    if (onFeatureIntroduction) {
      onFeatureIntroduction(feature);
    }
  };

  // Page-specific Khepera behaviors
  const getPageSpecificFeatures = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          introMessage: "Welcome to your emotional sanctuary! I'm here to guide you through your healing journey. 🌿",
          suggestedActions: ['Start journaling', 'Check your progress', 'Explore new features'],
          gamificationFocus: 'streaks'
        };
      case 'journal':
        return {
          introMessage: "Ready to explore your inner world? I'll be here to support your reflection. ✍️",
          suggestedActions: ['Choose your mood', 'Begin writing', 'Try voice journaling'],
          gamificationFocus: 'vocabulary'
        };
      case 'pricing':
        return {
          introMessage: "Investing in your emotional growth is one of the most valuable choices you can make. 💎",
          suggestedActions: ['Explore features', 'Consider your needs', 'Start with what feels right'],
          gamificationFocus: 'features'
        };
      case 'analytics':
        return {
          introMessage: "Your emotional intelligence is growing! Let's explore your patterns together. 📊",
          suggestedActions: ['Review your progress', 'Celebrate growth', 'Set new intentions'],
          gamificationFocus: 'insights'
        };
      case 'community':
        return {
          introMessage: "Healing happens in connection. Welcome to your community of growth. 🤝",
          suggestedActions: ['Join a circle', 'Share wisdom', 'Find your people'],
          gamificationFocus: 'community'
        };
      default:
        return {
          introMessage: "I'm here to support your emotional wellness journey. How can I help? 🌟",
          suggestedActions: ['Tell me how you\'re feeling', 'Explore ALCHM features', 'Ask me anything'],
          gamificationFocus: 'general'
        };
    }
  };

  const pageFeatures = getPageSpecificFeatures();

  if (!user) {
    return null; // Don't show Khepera if user isn't authenticated
  }

  return (
    <div className="khepera-integration">
      {/* Main Chat Interface */}
      {enabledFeatures.chat && (
        <>
          {isMobile ? (
            <KheperaMobileChat
              isActive={kheperaActive}
              onActivate={handleKheperaActivation}
              pageContext={pageFeatures}
              conversationContext={conversationContext}
              crisisDetectionEnabled={enabledFeatures.crisisDetection}
              onCrisisDetected={handleCrisisDetection}
              onFeatureIntroduction={handleFeatureIntroduction}
            />
          ) : (
            enabledFeatures.crisisDetection ? (
              <KheperaCrisisSafeChat
                isActive={kheperaActive}
                onActivate={handleKheperaActivation}
                pageContext={pageFeatures}
                conversationContext={conversationContext}
                onFeatureIntroduction={handleFeatureIntroduction}
              />
            ) : (
              <KheperaChat
                isActive={kheperaActive}
                onActivate={handleKheperaActivation}
                pageContext={pageFeatures}
                conversationContext={conversationContext}
                onFeatureIntroduction={handleFeatureIntroduction}
              />
            )
          )}
        </>
      )}

      {/* Duolingo-Style Gamification */}
      {enabledFeatures.gamification && kheperaActive && (
        <DuolingoStyleGamification
          userId={user.uid}
          currentPage={currentPage}
          userTier={userTier}
          focusArea={pageFeatures.gamificationFocus}
          onMilestoneReached={(milestone) => {
            handleFeatureIntroduction(`milestone_${milestone}`);
          }}
        />
      )}

      {/* Community Healing Circles (when on community page) */}
      {enabledFeatures.communityCircles && currentPage === 'community' && (
        <CommunityHealingCircles
          userTier={userTier}
          culturalBackground={conversationContext?.culturalContext}
          onCircleJoined={(circleId) => {
            handleFeatureIntroduction(`community_circle_${circleId}`);
          }}
        />
      )}

      {/* Khepera Integration Styles */}
      <style jsx>{`
        .khepera-integration {
          position: relative;
          z-index: 999;
        }

        /* Ensure Khepera doesn't interfere with crisis support button */
        .khepera-integration .khepera-chat,
        .khepera-integration .khepera-mobile-chat {
          bottom: ${currentPage === 'journal' ? '140px' : '100px'};
        }

        /* Page-specific positioning adjustments */
        @media (max-width: 768px) {
          .khepera-integration .khepera-mobile-chat {
            bottom: ${currentPage === 'journal' ? '120px' : '80px'};
          }
        }

        /* Smooth integration with existing ALCHM design */
        .khepera-integration * {
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
}

// Hook for easy integration in existing pages
export function useKheperaIntegration(currentPage: string, userTier: string = 'sanctuary') {
  const [kheperaEnabled, setKheperaEnabled] = useState(true);
  
  // Can be used to enable/disable Khepera based on user preferences
  const toggleKhepera = () => setKheperaEnabled(prev => !prev);
  
  return {
    kheperaEnabled,
    toggleKhepera,
    KheperaComponent: () => (
      <KheperaIntegration
        currentPage={currentPage as any}
        userTier={userTier as any}
        enabledFeatures={{
          chat: kheperaEnabled,
          gamification: kheperaEnabled,
          communityCircles: kheperaEnabled,
          culturalResponsiveness: kheperaEnabled,
          crisisDetection: true // Always enabled for safety
        }}
      />
    )
  };
}

export default KheperaIntegration;