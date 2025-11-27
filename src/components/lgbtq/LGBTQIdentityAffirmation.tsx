/**
 * ALCHM LGBTQ+ Identity Affirmation System
 * 
 * Philosophy: "Your authentic self is not something to be fixed, managed, or minimized.
 * Your queer identity is a source of strength, beauty, and wisdom. 
 * Healing happens when you can be fully yourself."
 * 
 * This system provides:
 * - Identity-specific affirmations and celebrations
 * - Chosen family and community connection support
 * - Transition-informed mental health resources
 * - Queer joy cultivation practices
 * - Safety and resilience building for hostile environments
 * - Intersectional support for multiply-marginalized identities
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface LGBTQIdentityProfile {
  sexualOrientation?: string[];
  genderIdentity?: string[];
  transitionStatus?: 'not_transitioning' | 'considering' | 'in_process' | 'post_transition' | 'non_binary_journey';
  preferredTerms?: string[];
  safetyLevel?: 'very_safe' | 'mostly_safe' | 'somewhat_safe' | 'unsafe';
  chosenFamilySupport?: 'strong' | 'developing' | 'seeking' | 'none';
  intersectionalIdentities?: string[];
}

interface IdentityAffirmationProps {
  identityProfile: LGBTQIdentityProfile;
  journalContent?: string;
  onAffirmationInteraction?: (type: string, content: string) => void;
}

interface Affirmation {
  id: string;
  category: 'identity' | 'resilience' | 'joy' | 'community' | 'transition' | 'intersectional';
  identity: string[];
  message: string;
  actionPrompt?: string;
  safetyLevel: 'universal' | 'safe_spaces_only';
  intersectionalContext?: string;
}

export default function LGBTQIdentityAffirmation({ 
  identityProfile, 
  journalContent = '',
  onAffirmationInteraction 
}: IdentityAffirmationProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation | null>(null);
  const [affirmationHistory, setAffirmationHistory] = useState<string[]>([]);
  const [queerJoyMoment, setQueerJoyMoment] = useState<string | null>(null);
  const [showChosenFamilyBuilder, setShowChosenFamilyBuilder] = useState(false);

  const affirmations: Affirmation[] = [
    // Universal LGBTQ+ Affirmations
    {
      id: 'authentic_self',
      category: 'identity',
      identity: ['all'],
      message: "Your authentic self is not a burden to carry - it's a gift to celebrate. Every day you choose authenticity, you make space for others to do the same.",
      actionPrompt: "What's one small way you expressed your authentic self today?",
      safetyLevel: 'universal'
    },
    {
      id: 'chosen_family_power',
      category: 'community',
      identity: ['all'],
      message: "The family you choose is as sacred and valid as any other. Your chosen family sees and celebrates every part of who you are.",
      actionPrompt: "Send appreciation to someone in your chosen family today.",
      safetyLevel: 'universal'
    },
    {
      id: 'queer_joy_resistance',
      category: 'joy',
      identity: ['all'],
      message: "Your joy is revolutionary. In a world that often tells queer people to hide, your happiness is an act of beautiful rebellion.",
      actionPrompt: "What brought you queer joy this week?",
      safetyLevel: 'universal'
    },
    {
      id: 'resilience_strength',
      category: 'resilience',
      identity: ['all'],
      message: "You have survived everything life has thrown at you so far. That includes navigating a world that wasn't built for you. You are stronger than you know.",
      safetyLevel: 'universal'
    },

    // Gender Identity Specific
    {
      id: 'trans_courage',
      category: 'identity',
      identity: ['transgender', 'trans', 'nonbinary', 'genderfluid', 'genderqueer'],
      message: "Living as your true gender in a world that questions it takes immense courage. You are brave simply by existing as yourself.",
      actionPrompt: "How has embracing your gender identity made you stronger?",
      safetyLevel: 'safe_spaces_only'
    },
    {
      id: 'nonbinary_validity',
      category: 'identity',
      identity: ['nonbinary', 'genderfluid', 'agender', 'demigender'],
      message: "Your gender is valid exactly as it is. You don't owe anyone a performance of gender that doesn't fit your truth.",
      actionPrompt: "What does gender freedom mean to you?",
      safetyLevel: 'universal'
    },
    {
      id: 'transition_journey',
      category: 'transition',
      identity: ['transgender', 'trans', 'nonbinary'],
      message: "Your transition is your own unique journey. Whether you're considering, beginning, or years into your path - you're exactly where you need to be.",
      actionPrompt: "What part of your journey are you most proud of?",
      safetyLevel: 'safe_spaces_only'
    },

    // Sexual Orientation Specific
    {
      id: 'lesbian_power',
      category: 'identity',
      identity: ['lesbian', 'wlw'],
      message: "Your love for women is beautiful and complete. You don't need anyone's validation to know that your identity is real and valid.",
      safetyLevel: 'universal'
    },
    {
      id: 'gay_pride',
      category: 'identity',
      identity: ['gay', 'mlm'],
      message: "Your love is not less than anyone else's. Your relationships and attractions are beautiful expressions of human diversity.",
      safetyLevel: 'universal'
    },
    {
      id: 'bisexual_validity',
      category: 'identity',
      identity: ['bisexual', 'pansexual', 'omnisexual'],
      message: "Your attraction to multiple genders is not confusion - it's expansion. Your identity is valid regardless of who you're currently dating.",
      safetyLevel: 'universal'
    },
    {
      id: 'asexual_affirmation',
      category: 'identity',
      identity: ['asexual', 'aromantic', 'ace', 'aro'],
      message: "Your way of experiencing attraction and relationships is completely valid. You are whole exactly as you are.",
      actionPrompt: "How do you experience love and connection in your own unique way?",
      safetyLevel: 'universal'
    },

    // Intersectional Affirmations
    {
      id: 'qtpoc_strength',
      category: 'intersectional',
      identity: ['all'],
      message: "Being queer and a person of color means you carry multiple sources of strength. Your intersectional identity is powerful, not problematic.",
      intersectionalContext: 'poc',
      safetyLevel: 'safe_spaces_only'
    },
    {
      id: 'queer_disabled_wholeness',
      category: 'intersectional',
      identity: ['all'],
      message: "Your queerness and your disability are both parts of your beautiful, complex identity. You are whole, not broken.",
      intersectionalContext: 'disabled',
      safetyLevel: 'universal'
    },
    {
      id: 'queer_neurodivergent_uniqueness',
      category: 'intersectional',
      identity: ['all'],
      message: "Your queer neurodivergent brain processes the world in beautifully unique ways. Your perspective is needed and valued.",
      intersectionalContext: 'neurodivergent',
      safetyLevel: 'universal'
    }
  ];

  const queerJoyPrompts = [
    "What made you feel most authentically yourself this week?",
    "Describe a moment when your queer identity brought you unexpected joy.",
    "What's something about your community that fills you with pride?",
    "How has embracing your identity opened up new possibilities in your life?",
    "What would you tell your younger, newly-out self?",
    "Describe a time when you felt truly seen and celebrated for who you are.",
    "What's your favorite thing about queer culture or community?",
    "How do you celebrate your identity in small, daily ways?"
  ];

  const chosenFamilyPrompts = [
    "Who in your life truly sees and celebrates all of you?",
    "What makes someone part of your chosen family?",
    "How do you show care for the people you've chosen as family?",
    "What traditions or rituals have you created with your chosen family?",
    "Who do you turn to when you need unconditional support?",
    "How has your chosen family helped you grow?",
    "What boundaries help protect your chosen family relationships?"
  ];

  useEffect(() => {
    loadPersonalizedAffirmation();
  }, [identityProfile, journalContent]);

  const loadPersonalizedAffirmation = () => {
    // Filter affirmations based on identity profile
    let relevantAffirmations = affirmations.filter(affirmation => {
      // Check identity match
      if (affirmation.identity.includes('all')) return true;
      
      const userIdentities = [
        ...(identityProfile.sexualOrientation || []),
        ...(identityProfile.genderIdentity || []),
        ...(identityProfile.preferredTerms || [])
      ];
      
      const hasIdentityMatch = affirmation.identity.some(id => 
        userIdentities.some(userIdentity => 
          userIdentity.toLowerCase().includes(id.toLowerCase()) ||
          id.toLowerCase().includes(userIdentity.toLowerCase())
        )
      );
      
      if (hasIdentityMatch) return true;
      
      // Check intersectional context
      if (affirmation.intersectionalContext) {
        return identityProfile.intersectionalIdentities?.includes(affirmation.intersectionalContext) || false;
      }
      
      return false;
    });

    // Filter by safety level
    if (identityProfile.safetyLevel !== 'very_safe' && identityProfile.safetyLevel !== 'mostly_safe') {
      relevantAffirmations = relevantAffirmations.filter(a => a.safetyLevel === 'universal');
    }

    // Filter out recently shown affirmations
    relevantAffirmations = relevantAffirmations.filter(a => !affirmationHistory.includes(a.id));

    // Select contextually relevant affirmation based on journal content
    const content = journalContent.toLowerCase();
    let contextualAffirmations = relevantAffirmations;

    if (content.includes('family') || content.includes('alone') || content.includes('support')) {
      contextualAffirmations = relevantAffirmations.filter(a => a.category === 'community');
    } else if (content.includes('authentic') || content.includes('real') || content.includes('myself')) {
      contextualAffirmations = relevantAffirmations.filter(a => a.category === 'identity');
    } else if (content.includes('happy') || content.includes('joy') || content.includes('celebration')) {
      contextualAffirmations = relevantAffirmations.filter(a => a.category === 'joy');
    } else if (content.includes('hard') || content.includes('difficult') || content.includes('struggle')) {
      contextualAffirmations = relevantAffirmations.filter(a => a.category === 'resilience');
    } else if (content.includes('transition') || content.includes('gender') || content.includes('change')) {
      contextualAffirmations = relevantAffirmations.filter(a => a.category === 'transition');
    }

    const selectedAffirmation = contextualAffirmations.length > 0 
      ? contextualAffirmations[Math.floor(Math.random() * contextualAffirmations.length)]
      : relevantAffirmations[Math.floor(Math.random() * relevantAffirmations.length)];

    if (selectedAffirmation) {
      setCurrentAffirmation(selectedAffirmation);
      setAffirmationHistory(prev => [...prev, selectedAffirmation.id].slice(-5)); // Keep last 5
    }
  };

  const handleAffirmationInteraction = (type: 'love' | 'share' | 'save') => {
    if (currentAffirmation && onAffirmationInteraction) {
      onAffirmationInteraction(type, currentAffirmation.message);
    }
  };

  const generateQueerJoyMoment = () => {
    const prompt = queerJoyPrompts[Math.floor(Math.random() * queerJoyPrompts.length)];
    setQueerJoyMoment(prompt);
  };

  if (!identityProfile.sexualOrientation?.length && !identityProfile.genderIdentity?.length) {
    return null; // No LGBTQ+ identity indicated
  }

  return (
    <div className="space-y-6">
      {/* Main Identity Affirmation */}
      {currentAffirmation && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏳️‍🌈</span>
              <h3 className="text-lg font-medium text-purple-800">
                Identity Affirmation
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPersonalizedAffirmation}
              className="text-purple-600 hover:text-purple-800"
            >
              ↻ New
            </Button>
          </div>
          
          <motion.div
            key={currentAffirmation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <p className="text-purple-900 leading-relaxed mb-4">
              {currentAffirmation.message}
            </p>
            
            {currentAffirmation.actionPrompt && (
              <div className="bg-purple-100 rounded-lg p-4">
                <p className="text-sm text-purple-800 font-medium mb-2">
                  Reflection Prompt:
                </p>
                <p className="text-purple-700">
                  {currentAffirmation.actionPrompt}
                </p>
              </div>
            )}
          </motion.div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAffirmationInteraction('love')}
              className="text-pink-600 border-pink-300 hover:bg-pink-50"
            >
              💖 This Speaks to Me
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAffirmationInteraction('save')}
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              📝 Save for Later
            </Button>
          </div>
        </Card>
      )}

      {/* Queer Joy Cultivator */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-medium text-yellow-800">
              Queer Joy Moment
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generateQueerJoyMoment}
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            Generate Joy
          </Button>
        </div>
        
        <p className="text-sm text-yellow-700 mb-4">
          Your joy is resistance. Your happiness creates space for others to be joyful too.
        </p>
        
        {queerJoyMoment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-yellow-100 rounded-lg p-4"
          >
            <p className="text-yellow-800 font-medium">
              {queerJoyMoment}
            </p>
          </motion.div>
        )}
      </Card>

      {/* Chosen Family Connection */}
      {identityProfile.chosenFamilySupport !== 'strong' && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤗</span>
            <h3 className="text-lg font-medium text-blue-800">
              Chosen Family Builder
            </h3>
          </div>
          
          <p className="text-sm text-blue-700 mb-4">
            Building chosen family takes time. Every authentic connection is a step toward community.
          </p>
          
          {!showChosenFamilyBuilder ? (
            <Button
              onClick={() => setShowChosenFamilyBuilder(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Building Connections
            </Button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">
                  Chosen Family Reflection:
                </p>
                <p className="text-blue-700">
                  {chosenFamilyPrompts[Math.floor(Math.random() * chosenFamilyPrompts.length)]}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-white">
                  <h4 className="font-medium text-blue-800 mb-2">Online Communities</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Discord servers for your identity</li>
                    <li>• Reddit communities (r/lgbt, r/trans, etc.)</li>
                    <li>• Instagram accounts that celebrate your identity</li>
                    <li>• TikTok creators who share your experience</li>
                  </ul>
                </Card>
                
                <Card className="p-4 bg-white">
                  <h4 className="font-medium text-blue-800 mb-2">Local Connections</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• LGBTQ+ community centers</li>
                    <li>• Pride organizations</li>
                    <li>• Queer book clubs or hobby groups</li>
                    <li>• Support groups for your identity</li>
                  </ul>
                </Card>
              </div>
            </motion.div>
          )}
        </Card>
      )}

      {/* Safety and Resilience (for users in unsafe environments) */}
      {(identityProfile.safetyLevel === 'unsafe' || identityProfile.safetyLevel === 'somewhat_safe') && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🛡️</span>
            <h3 className="text-lg font-medium text-green-800">
              Safety & Resilience
            </h3>
          </div>
          
          <p className="text-sm text-green-700 mb-4">
            Staying safe while honoring your authentic self requires strategy and support.
          </p>
          
          <div className="space-y-3">
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-green-800 font-medium mb-1">Digital Safety</p>
              <p className="text-sm text-green-700">
                Use privacy settings, separate accounts, and trusted devices for LGBTQ+ content.
              </p>
            </div>
            
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-green-800 font-medium mb-1">Emotional Resilience</p>
              <p className="text-sm text-green-700">
                Your authentic self exists even when you can't express it openly. Internal validation matters.
              </p>
            </div>
            
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-green-800 font-medium mb-1">Future Planning</p>
              <p className="text-sm text-green-700">
                Every small step toward independence is progress toward living authentically.
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://www.thetrevorproject.org/', '_blank')}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              🆘 Crisis Support Resources
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

/**
 * LGBTQ+ Identity Evolution Tracker
 * Celebrates the journey of identity discovery and affirmation
 */
export function LGBTQIdentityEvolution({ 
  onEvolutionMilestone 
}: { 
  onEvolutionMilestone?: (milestone: string) => void 
}) {
  const [milestones] = useState([
    { id: 'questioning', label: 'First questioned my identity', completed: false },
    { id: 'research', label: 'Researched LGBTQ+ identities and community', completed: false },
    { id: 'self_acceptance', label: 'Started accepting myself', completed: false },
    { id: 'first_person', label: 'Came out to my first person', completed: false },
    { id: 'community', label: 'Connected with LGBTQ+ community', completed: false },
    { id: 'celebration', label: 'Celebrated my identity publicly', completed: false },
    { id: 'advocacy', label: 'Advocated for LGBTQ+ rights/visibility', completed: false },
    { id: 'mentorship', label: 'Supported another LGBTQ+ person', completed: false }
  ]);

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <h3 className="text-lg font-medium text-indigo-800 mb-4">
        🌈 Your Identity Journey
      </h3>
      
      <p className="text-sm text-indigo-700 mb-6">
        Every step in your identity journey deserves celebration. Check off milestones that resonate with your experience.
      </p>
      
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={milestone.completed}
              onChange={() => onEvolutionMilestone?.(milestone.label)}
              className="rounded border-indigo-300 text-indigo-600"
            />
            <span className={`text-sm flex-1 ${milestone.completed ? 'text-indigo-600 font-medium' : 'text-gray-700'}`}>
              {milestone.label}
            </span>
            {milestone.completed && <span className="text-indigo-500">🎉</span>}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
        <p className="text-sm text-indigo-800">
          <strong>Remember:</strong> There's no timeline for identity discovery. Some people know from childhood, others realize later in life. Both paths are valid and beautiful.
        </p>
      </div>
    </Card>
  );
}