/**
 * ALCHM Crisis-to-Community Bridge System
 * 
 * Transforms moments of crisis into opportunities for connection and support.
 * Provides gentle pathways from vulnerability to community healing without
 * compromising privacy or adding pressure.
 * 
 * This system recognizes that crisis moments are often when we need community most,
 * but also when we feel least able to reach out.
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Shield, 
  Compass, 
  Lightbulb,
  MessageCircle,
  UserCheck,
  Flower2,
  HandHeart,
  Waves,
  TreePine,
  Star
} from 'lucide-react';

interface CrisisIndicator {
  type: 'emotional_distress' | 'isolation' | 'overwhelm' | 'identity_crisis' | 'relationship_stress' | 'existential_questioning';
  confidence: number;
  evidence: string[];
  severity: 'mild' | 'moderate' | 'significant' | 'severe';
  detectedAt: Date;
}

interface CommunityBridge {
  id: string;
  title: string;
  description: string;
  connectionType: 'anonymous_support' | 'peer_circles' | 'wisdom_sharing' | 'collective_healing' | 'guided_community';
  participantCount: number;
  safetyLevel: 'maximum_privacy' | 'anonymous_sharing' | 'pseudonymous' | 'community_visible';
  emergencySupport: boolean;
  crisisSpecific: boolean;
  icon: React.ReactNode;
  color: string;
}

interface SupportOffer {
  id: string;
  type: 'peer_support' | 'professional_referral' | 'community_invitation' | 'resource_sharing' | 'crisis_intervention';
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  anonymous: boolean;
  immediatelyAvailable: boolean;
  estimatedWaitTime?: string;
}

interface DigitalCompanion {
  name: string;
  personality: 'gentle_guide' | 'wise_elder' | 'supportive_peer' | 'crisis_counselor';
  avatar: React.ReactNode;
  specialties: string[];
  available24x7: boolean;
}

const communityBridges: CommunityBridge[] = [
  {
    id: 'anonymous_circles',
    title: 'Anonymous Healing Circles',
    description: 'Join others on similar journeys without revealing your identity. Share struggles and celebrate growth together.',
    connectionType: 'anonymous_support',
    participantCount: 156,
    safetyLevel: 'maximum_privacy',
    emergencySupport: true,
    crisisSpecific: false,
    icon: <Users className="w-5 h-5" />,
    color: 'emerald'
  },
  {
    id: 'crisis_sanctuary',
    title: 'Crisis Sanctuary',
    description: 'Immediate support for difficult moments. Anonymous, judgment-free, always available.',
    connectionType: 'peer_circles',
    participantCount: 89,
    safetyLevel: 'anonymous_sharing',
    emergencySupport: true,
    crisisSpecific: true,
    icon: <Shield className="w-5 h-5" />,
    color: 'purple'
  },
  {
    id: 'wisdom_sharing',
    title: 'Wisdom Exchange',
    description: 'Share and receive insights from others who\'ve walked similar paths. Stories of resilience and hope.',
    connectionType: 'wisdom_sharing',
    participantCount: 234,
    safetyLevel: 'pseudonymous',
    emergencySupport: false,
    crisisSpecific: false,
    icon: <Lightbulb className="w-5 h-5" />,
    color: 'amber'
  },
  {
    id: 'guided_support',
    title: 'Guided Community Healing',
    description: 'Structured support groups with trained facilitators. Focus on specific healing themes.',
    connectionType: 'guided_community',
    participantCount: 67,
    safetyLevel: 'community_visible',
    emergencySupport: false,
    crisisSpecific: false,
    icon: <Compass className="w-5 h-5" />,
    color: 'blue'
  }
];

const digitalCompanions: DigitalCompanion[] = [
  {
    name: 'Sage',
    personality: 'wise_elder',
    avatar: <TreePine className="w-6 h-6" />,
    specialties: ['pattern recognition', 'perspective shifting', 'wisdom sharing'],
    available24x7: true
  },
  {
    name: 'River',
    personality: 'gentle_guide',
    avatar: <Waves className="w-6 h-6" />,
    specialties: ['emotional regulation', 'breathing techniques', 'grounding'],
    available24x7: true
  },
  {
    name: 'Echo',
    personality: 'supportive_peer',
    avatar: <Star className="w-6 h-6" />,
    specialties: ['peer support', 'shared experiences', 'encouragement'],
    available24x7: true
  },
  {
    name: 'Haven',
    personality: 'crisis_counselor',
    avatar: <HandHeart className="w-6 h-6" />,
    specialties: ['crisis support', 'safety planning', 'professional resources'],
    available24x7: true
  }
];

export default function CrisisToConnection({
  journalEntry,
  crisisIndicators = [],
  autoSuggest = true,
  emergencyMode = false
}: {
  journalEntry?: any;
  crisisIndicators?: CrisisIndicator[];
  autoSuggest?: boolean;
  emergencyMode?: boolean;
}) {
  const { user } = useAuth();
  const [showSupportOffers, setShowSupportOffers] = useState(false);
  const [selectedBridge, setSelectedBridge] = useState<CommunityBridge | null>(null);
  const [supportOffers, setSupportOffers] = useState<SupportOffer[]>([]);
  const [availableCompanions, setAvailableCompanions] = useState<DigitalCompanion[]>(digitalCompanions);
  const [userCrisisState, setUserCrisisState] = useState<CrisisIndicator | null>(null);
  const [connectionPreferences, setConnectionPreferences] = useState({
    anonymityLevel: 'maximum_privacy' as const,
    participationComfort: 'observer' as 'observer' | 'participant' | 'contributor',
    crisisSupport: true,
    professionalReferrals: false
  });

  /**
   * Analyze content for crisis indicators
   */
  const analyzeCrisisIndicators = useCallback((content: string): CrisisIndicator[] => {
    const indicators: CrisisIndicator[] = [];
    const contentLower = content.toLowerCase();

    // Emotional distress patterns
    const distressPatterns = [
      { pattern: /(can't|cannot) (cope|handle|deal)/gi, weight: 0.8 },
      { pattern: /overwhelmed|drowning|suffocating/gi, weight: 0.7 },
      { pattern: /falling apart|breaking down/gi, weight: 0.9 },
      { pattern: /don't know what to do/gi, weight: 0.6 }
    ];

    // Isolation patterns
    const isolationPatterns = [
      { pattern: /alone|lonely|isolated/gi, weight: 0.6 },
      { pattern: /no one (understands|cares)/gi, weight: 0.8 },
      { pattern: /pushing (everyone|people) away/gi, weight: 0.7 }
    ];

    // Identity crisis patterns
    const identityPatterns = [
      { pattern: /don't know who I am/gi, weight: 0.8 },
      { pattern: /lost|confused about myself/gi, weight: 0.6 },
      { pattern: /questioning everything/gi, weight: 0.5 }
    ];

    // Check emotional distress
    let distressScore = 0;
    const distressEvidence: string[] = [];
    distressPatterns.forEach(({ pattern, weight }) => {
      const matches = contentLower.match(pattern);
      if (matches) {
        distressScore += matches.length * weight;
        distressEvidence.push(...matches);
      }
    });

    if (distressScore > 0.5) {
      indicators.push({
        type: 'emotional_distress',
        confidence: Math.min(100, distressScore * 50),
        evidence: distressEvidence,
        severity: distressScore > 1.5 ? 'significant' : distressScore > 1 ? 'moderate' : 'mild',
        detectedAt: new Date()
      });
    }

    // Check isolation
    let isolationScore = 0;
    const isolationEvidence: string[] = [];
    isolationPatterns.forEach(({ pattern, weight }) => {
      const matches = contentLower.match(pattern);
      if (matches) {
        isolationScore += matches.length * weight;
        isolationEvidence.push(...matches);
      }
    });

    if (isolationScore > 0.4) {
      indicators.push({
        type: 'isolation',
        confidence: Math.min(100, isolationScore * 60),
        evidence: isolationEvidence,
        severity: isolationScore > 1.2 ? 'significant' : isolationScore > 0.8 ? 'moderate' : 'mild',
        detectedAt: new Date()
      });
    }

    // Check identity crisis
    let identityScore = 0;
    const identityEvidence: string[] = [];
    identityPatterns.forEach(({ pattern, weight }) => {
      const matches = contentLower.match(pattern);
      if (matches) {
        identityScore += matches.length * weight;
        identityEvidence.push(...matches);
      }
    });

    if (identityScore > 0.3) {
      indicators.push({
        type: 'identity_crisis',
        confidence: Math.min(100, identityScore * 70),
        evidence: identityEvidence,
        severity: identityScore > 1 ? 'significant' : identityScore > 0.6 ? 'moderate' : 'mild',
        detectedAt: new Date()
      });
    }

    return indicators;
  }, []);

  /**
   * Generate appropriate support offers based on crisis indicators
   */
  const generateSupportOffers = useCallback((indicators: CrisisIndicator[]): SupportOffer[] => {
    const offers: SupportOffer[] = [];

    indicators.forEach(indicator => {
      switch (indicator.type) {
        case 'emotional_distress':
          offers.push({
            id: 'crisis_sanctuary_invite',
            type: 'community_invitation',
            title: 'Crisis Sanctuary',
            description: 'Connect with others who understand. Anonymous, immediate support available.',
            urgency: indicator.severity === 'significant' ? 'high' : 'medium',
            anonymous: true,
            immediatelyAvailable: true
          });
          
          if (indicator.severity === 'significant') {
            offers.push({
              id: 'professional_support',
              type: 'professional_referral',
              title: 'Professional Support',
              description: 'Connect with trained counselors who specialize in crisis support.',
              urgency: 'high',
              anonymous: false,
              immediatelyAvailable: false,
              estimatedWaitTime: '24-48 hours'
            });
          }
          break;

        case 'isolation':
          offers.push({
            id: 'anonymous_circles_invite',
            type: 'community_invitation',
            title: 'Healing Circles',
            description: 'Join others on similar journeys. No pressure to share - just knowing you\'re not alone.',
            urgency: 'medium',
            anonymous: true,
            immediatelyAvailable: true
          });

          offers.push({
            id: 'digital_companion',
            type: 'peer_support',
            title: 'Digital Companion',
            description: 'Chat with an AI companion trained in supportive conversation.',
            urgency: 'low',
            anonymous: true,
            immediatelyAvailable: true
          });
          break;

        case 'identity_crisis':
          offers.push({
            id: 'wisdom_exchange_invite',
            type: 'community_invitation',
            title: 'Wisdom Exchange',
            description: 'Read stories from others who\'ve navigated identity questions and found their way.',
            urgency: 'low',
            anonymous: true,
            immediatelyAvailable: true
          });
          break;
      }
    });

    // Always offer gentle companion support
    offers.push({
      id: 'gentle_companion',
      type: 'peer_support',
      title: 'Gentle Support',
      description: 'A compassionate digital guide available whenever you need someone to listen.',
      urgency: 'low',
      anonymous: true,
      immediatelyAvailable: true
    });

    return offers;
  }, []);

  /**
   * Handle journal entry analysis
   */
  useEffect(() => {
    if (!journalEntry?.content || !autoSuggest) return;

    const indicators = analyzeCrisisIndicators(journalEntry.content);
    
    if (indicators.length > 0) {
      setUserCrisisState(indicators[0]); // Use most significant indicator
      const offers = generateSupportOffers(indicators);
      setSupportOffers(offers);
      
      // Show support offers for moderate+ crisis indicators
      if (indicators.some(i => i.severity !== 'mild')) {
        setShowSupportOffers(true);
      }
    }
  }, [journalEntry, analyzeCrisisIndicators, generateSupportOffers, autoSuggest]);

  /**
   * Handle support offer selection
   */
  const handleSupportOfferSelect = async (offer: SupportOffer) => {
    try {
      switch (offer.type) {
        case 'community_invitation':
          // Find matching community bridge
          const bridge = communityBridges.find(b => 
            offer.title.toLowerCase().includes(b.title.toLowerCase().split(' ')[0])
          );
          if (bridge) {
            setSelectedBridge(bridge);
          }
          break;

        case 'peer_support':
          // Start companion session
          await initializeCompanionSession(offer);
          break;

        case 'professional_referral':
          // Handle professional referral
          await handleProfessionalReferral(offer);
          break;

        case 'resource_sharing':
          // Open resource library
          await openResourceLibrary(offer);
          break;
      }
    } catch (error) {
      console.error('Error handling support offer:', error);
    }
  };

  const initializeCompanionSession = async (offer: SupportOffer) => {
    // Would initialize AI companion session
    console.log('Initializing companion session:', offer);
  };

  const handleProfessionalReferral = async (offer: SupportOffer) => {
    // Would handle professional referral process
    console.log('Handling professional referral:', offer);
  };

  const openResourceLibrary = async (offer: SupportOffer) => {
    // Would open curated resource library
    console.log('Opening resource library:', offer);
  };

  /**
   * Join community bridge
   */
  const joinCommunityBridge = async (bridge: CommunityBridge) => {
    try {
      // Would handle community joining process
      console.log('Joining community bridge:', bridge);
      setSelectedBridge(null);
      setShowSupportOffers(false);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  return (
    <div className="crisis-to-connection">
      {/* Emergency Mode Banner */}
      {emergencyMode && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-900">
                Crisis Support Available
              </h3>
              <p className="text-xs text-red-700 mt-1">
                Immediate support options are available. You don't have to go through this alone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Support Offers Modal */}
      <AnimatePresence>
        {showSupportOffers && supportOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="text-center mb-4">
                <Heart className="w-8 h-8 text-rose-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  You Don't Have to Face This Alone
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  We've noticed you might be going through a difficult time. 
                  Here are some gentle ways to find support.
                </p>
              </div>

              <div className="space-y-3 mb-4">
                {supportOffers.slice(0, 3).map(offer => (
                  <SupportOfferCard
                    key={offer.id}
                    offer={offer}
                    onSelect={() => handleSupportOfferSelect(offer)}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSupportOffers(false)}
                  className="flex-1 py-2 px-4 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => setShowSupportOffers(false)}
                  className="flex-1 py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  I'm Okay for Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Community Bridge Selection Modal */}
      <AnimatePresence>
        {selectedBridge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl"
            >
              <CommunityBridgeDetail
                bridge={selectedBridge}
                onJoin={() => joinCommunityBridge(selectedBridge)}
                onCancel={() => setSelectedBridge(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gentle Community Suggestions */}
      {!showSupportOffers && !emergencyMode && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-start space-x-3">
            <Users className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Community Connection
              </h4>
              <p className="text-xs text-blue-700 mb-3">
                Healing happens in community. Explore safe spaces to connect with others on similar journeys.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {communityBridges.slice(0, 2).map(bridge => (
                  <button
                    key={bridge.id}
                    onClick={() => setSelectedBridge(bridge)}
                    className="text-left p-2 bg-white/60 hover:bg-white/80 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`text-${bridge.color}-600`}>{bridge.icon}</div>
                      <span className="text-xs font-medium text-gray-900">
                        {bridge.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {bridge.participantCount} members
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crisis State Indicator */}
      {userCrisisState && (
        <div className="mt-4 flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          <Flower2 className="w-4 h-4" />
          <span>
            We're here with you through this difficult moment. 
            Support is available whenever you're ready.
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Support Offer Card Component
 */
const SupportOfferCard = ({
  offer,
  onSelect
}: {
  offer: SupportOffer;
  onSelect: () => void;
}) => {
  const getUrgencyColor = () => {
    switch (offer.urgency) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'high': return 'border-orange-200 bg-orange-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const getIcon = () => {
    switch (offer.type) {
      case 'community_invitation': return <Users className="w-4 h-4" />;
      case 'peer_support': return <MessageCircle className="w-4 h-4" />;
      case 'professional_referral': return <UserCheck className="w-4 h-4" />;
      default: return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-lg border-2 hover:shadow-sm transition-all ${getUrgencyColor()}`}
    >
      <div className="flex items-start space-x-3">
        <div className="text-gray-600 mt-1">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {offer.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">
            {offer.description}
          </p>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {offer.anonymous && (
              <span className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Anonymous</span>
              </span>
            )}
            {offer.immediatelyAvailable && (
              <span className="text-green-600">Available now</span>
            )}
            {offer.estimatedWaitTime && (
              <span>~{offer.estimatedWaitTime}</span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

/**
 * Community Bridge Detail Component
 */
const CommunityBridgeDetail = ({
  bridge,
  onJoin,
  onCancel
}: {
  bridge: CommunityBridge;
  onJoin: () => void;
  onCancel: () => void;
}) => {
  return (
    <div>
      <div className="text-center mb-4">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-${bridge.color}-100 mb-3`}>
          <div className={`text-${bridge.color}-600`}>{bridge.icon}</div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {bridge.title}
        </h3>
        <p className="text-sm text-gray-600">
          {bridge.description}
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Current members</span>
          <span className="font-medium text-gray-900">{bridge.participantCount}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Privacy level</span>
          <span className="font-medium text-gray-900 capitalize">
            {bridge.safetyLevel.replace('_', ' ')}
          </span>
        </div>
        
        {bridge.emergencySupport && (
          <div className="flex items-center space-x-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
            <Shield className="w-3 h-3" />
            <span>24/7 crisis support available</span>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2 px-4 text-sm text-gray-600 hover:text-gray-700 transition-colors"
        >
          Not Now
        </button>
        <button
          onClick={onJoin}
          className={`flex-1 py-2 px-4 bg-${bridge.color}-600 hover:bg-${bridge.color}-700 text-white text-sm font-medium rounded-lg transition-colors`}
        >
          Join Safely
        </button>
      </div>
    </div>
  );
};