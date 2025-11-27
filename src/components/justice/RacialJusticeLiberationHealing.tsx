/**
 * ALCHM Racial Justice & Liberation Healing System
 * 
 * Philosophy: "Healing in the context of systemic oppression is revolutionary work.
 * Your mental health struggles are not personal failings - they are normal responses
 * to abnormal systems. True healing includes working toward justice."
 * 
 * This system provides:
 * - Validation of experiences with racism and discrimination
 * - Reframing of anger and resistance as healthy responses
 * - Community healing and collective liberation approaches
 * - Resources for processing racial trauma and microaggressions
 * - Celebration of cultural resilience and resistance
 * - Connection to social justice as mental health practice
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface RacialIdentityContext {
  racialIdentity: string[];
  immigrationStatus?: 'citizen' | 'documented' | 'undocumented' | 'mixed_status';
  generationStatus?: 'first_generation' | 'second_generation' | 'multi_generational';
  discriminationExperiences: boolean;
  microaggressionFrequency?: 'daily' | 'weekly' | 'monthly' | 'rarely';
  communityConnection?: 'strong' | 'developing' | 'seeking' | 'isolated';
  activismInterest?: 'very_interested' | 'somewhat_interested' | 'not_interested';
  intersectionalIdentities?: string[];
}

interface LiberationHealingProps {
  racialContext: RacialIdentityContext;
  journalContent?: string;
  onHealingInteraction?: (type: string, content: string) => void;
}

interface LiberationHealing {
  id: string;
  category: 'validation' | 'resistance' | 'community' | 'resilience' | 'action' | 'ancestral';
  racialContext: string[];
  title: string;
  message: string;
  actionableStep?: string;
  resourceLink?: string;
  triggerWarning?: string;
}

export default function RacialJusticeLiberationHealing({ 
  racialContext, 
  journalContent = '',
  onHealingInteraction 
}: LiberationHealingProps) {
  const [currentHealing, setCurrentHealing] = useState<LiberationHealing | null>(null);
  const [showMicroaggressionProcessor, setShowMicroaggressionProcessor] = useState(false);
  const [showResistanceAffirmation, setShowResistanceAffirmation] = useState(false);
  const [activismMoodCheck, setActivismMoodCheck] = useState<string | null>(null);

  const liberationHealings: LiberationHealing[] = [
    // Universal Anti-Racism Healing
    {
      id: 'racism_not_personal',
      category: 'validation',
      racialContext: ['all'],
      title: 'Your Response to Racism is Normal',
      message: "Feeling angry, exhausted, or hypervigilant after experiencing racism isn't a mental health problem - it's a normal response to an abnormal system. Your nervous system is responding appropriately to real threats.",
      actionableStep: "Name one way racism has affected your mental health today. Acknowledge that this impact is not your fault."
    },
    {
      id: 'anger_as_information',
      category: 'resistance',
      racialContext: ['all'],
      title: 'Your Anger is Sacred Information',
      message: "Your anger at injustice isn't something to manage or fix - it's sacred information about what needs to change. Righteous anger is a form of love for what could be.",
      actionableStep: "What is your anger trying to tell you about what needs to change in the world?"
    },
    {
      id: 'community_healing',
      category: 'community',
      racialContext: ['all'],
      title: 'Healing Happens in Community',
      message: "Individual therapy is important, but healing from racial trauma also happens in community. When you heal, you contribute to the healing of your community and future generations.",
      actionableStep: "How can you connect with others who understand your experience this week?"
    },

    // Black/African Diaspora Specific
    {
      id: 'black_excellence_resistance',
      category: 'resilience',
      racialContext: ['black', 'african_american', 'african_diaspora'],
      title: 'Black Excellence is Resistance',
      message: "Your success, joy, and thriving are acts of resistance against systems designed to limit you. Every achievement honors the ancestors who dreamed of your freedom.",
      actionableStep: "Celebrate one way you embodied Black excellence this week, no matter how small."
    },
    {
      id: 'ancestral_strength_black',
      category: 'ancestral',
      racialContext: ['black', 'african_american', 'african_diaspora'],
      title: 'Ancestral Strength Lives in You',
      message: "You carry the DNA of people who survived the Middle Passage, slavery, Jim Crow, and countless other attempts to break their spirit. That unbreakable strength lives in you.",
      actionableStep: "Connect with your ancestral strength: What would your ancestors want you to know about your resilience?"
    },
    {
      id: 'code_switching_labor',
      category: 'validation',
      racialContext: ['black', 'african_american', 'african_diaspora'],
      title: 'Code-Switching is Emotional Labor',
      message: "Having to change how you speak, dress, or act in different spaces is emotional labor that takes a toll. Your exhaustion from code-switching is valid and real.",
      actionableStep: "Where do you feel most free to be your authentic self? How can you create or find more of those spaces?"
    },

    // Latinx/Hispanic Specific
    {
      id: 'cultural_bridge_builder',
      category: 'resilience',
      racialContext: ['latinx', 'hispanic', 'chicano', 'mexican_american'],
      title: 'You Are a Bridge Between Worlds',
      message: "Navigating between cultures makes you a bridge-builder. The emotional work of translating between worlds for family and community is a form of service and strength.",
      actionableStep: "How has being bicultural given you unique perspectives or strengths?"
    },
    {
      id: 'immigrant_family_strength',
      category: 'ancestral',
      racialContext: ['latinx', 'hispanic'],
      title: 'Immigrant Family Resilience',
      message: "Whether your family came recently or generations ago, you carry the courage of people who left everything familiar to create better lives. That courage runs in your blood.",
      actionableStep: "What family stories of resilience and courage do you carry? How do they strengthen you today?"
    },

    // Asian/Asian American Specific
    {
      id: 'model_minority_myth',
      category: 'validation',
      racialContext: ['asian', 'asian_american', 'pacific_islander'],
      title: 'The Model Minority Myth Harms You Too',
      message: "Being seen as the 'model minority' doesn't protect you from racism - it just makes your struggles invisible. Your mental health challenges are real and deserve attention.",
      actionableStep: "What struggles have been minimized or ignored because of stereotypes about your racial identity?"
    },
    {
      id: 'asian_mental_health_stigma',
      category: 'validation',
      racialContext: ['asian', 'asian_american'],
      title: 'Breaking Mental Health Stigma',
      message: "Seeking help for mental health in cultures that prioritize family image and perseverance takes courage. You're breaking generational patterns that will help your entire family.",
      actionableStep: "How can you honor your cultural values while also prioritizing your mental health?"
    },

    // Indigenous Specific
    {
      id: 'indigenous_survival_resistance',
      category: 'resilience',
      racialContext: ['indigenous', 'native_american', 'first_nations'],
      title: 'Your Existence is Resistance',
      message: "Indigenous peoples have survived 500+ years of attempted genocide. Your existence, your culture, your healing - all of it is resistance and victory.",
      actionableStep: "How do you carry forward your people's resilience and wisdom in your daily life?"
    },
    {
      id: 'land_connection_healing',
      category: 'ancestral',
      racialContext: ['indigenous', 'native_american', 'first_nations'],
      title: 'Land Holds Ancestral Memory',
      message: "Your connection to the land is about more than environment - it's about ancestral memory and healing. The earth recognizes you as belonging here.",
      actionableStep: "How does spending time on or near traditional territories affect your sense of well-being?"
    },

    // Middle Eastern/North African Specific
    {
      id: 'post_911_trauma',
      category: 'validation',
      racialContext: ['middle_eastern', 'arab', 'muslim', 'north_african'],
      title: 'Post-9/11 Trauma is Real',
      message: "The hypervigilance and anxiety many in your community experience is a result of decades of being scapegoated and surveilled. Your wariness is a rational response.",
      actionableStep: "How has Islamophobia or anti-Arab racism affected your daily life and mental health?"
    },

    // Multiracial/Mixed Race Specific
    {
      id: 'multiracial_belonging',
      category: 'validation',
      racialContext: ['multiracial', 'mixed_race', 'biracial'],
      title: 'You Belong in All Your Communities',
      message: "Being told you're 'not enough' of any one race is a form of racism. You don't have to choose sides or prove your authenticity to anyone.",
      actionableStep: "Where do you feel most seen and accepted for your full multiracial identity?"
    }
  ];

  const microaggressionProcessors = [
    {
      type: 'workplace',
      prompt: "Describe what happened at work today. Remember: their behavior reflects their limitations, not your worth.",
      followUp: "How did this interaction affect your energy and well-being? What do you need to restore yourself?"
    },
    {
      type: 'public_space',
      prompt: "You survived another interaction in a public space. Your hypervigilance afterward is normal and protective.",
      followUp: "What helped you feel safe again? What would you want to tell others who experience similar situations?"
    },
    {
      type: 'healthcare',
      prompt: "Medical racism is real and harmful. Your concerns about not being believed or treated fairly are valid.",
      followUp: "How can you advocate for yourself in healthcare settings? Who can support you in this advocacy?"
    },
    {
      type: 'education',
      prompt: "Educational spaces aren't always inclusive, despite their claims. Your experience of being marginalized is real.",
      followUp: "What would you tell another student who experiences similar treatment? How can you find allies in these spaces?"
    }
  ];

  const resistanceAffirmations = [
    "Your resistance to injustice is a form of self-care and community care.",
    "Every time you speak truth about racism, you create space for others to do the same.",
    "Your refusal to internalize racist messages is revolutionary healing work.",
    "Standing up to racism, even in small ways, breaks cycles of oppression.",
    "Your anger at injustice comes from love - love for yourself, your community, and justice itself.",
    "When you heal from racial trauma, you heal your lineage and future generations.",
    "Your joy and success in the face of racism is a form of resistance.",
    "Protecting your peace from racist toxicity is an act of revolutionary self-care."
  ];

  useEffect(() => {
    loadPersonalizedHealing();
  }, [racialContext, journalContent]);

  const loadPersonalizedHealing = () => {
    // Filter healings based on racial context
    let relevantHealings = liberationHealings.filter(healing => {
      if (healing.racialContext.includes('all')) return true;
      
      return healing.racialContext.some(context => 
        racialContext.racialIdentity.some(identity => 
          identity.toLowerCase().includes(context.toLowerCase()) ||
          context.toLowerCase().includes(identity.toLowerCase())
        )
      );
    });

    // Contextual filtering based on journal content
    const content = journalContent.toLowerCase();
    let contextualHealings = relevantHealings;

    if (content.includes('angry') || content.includes('mad') || content.includes('furious')) {
      contextualHealings = relevantHealings.filter(h => h.category === 'resistance');
    } else if (content.includes('discrimination') || content.includes('racism') || content.includes('microaggression')) {
      contextualHealings = relevantHealings.filter(h => h.category === 'validation');
    } else if (content.includes('community') || content.includes('together') || content.includes('support')) {
      contextualHealings = relevantHealings.filter(h => h.category === 'community');
    } else if (content.includes('ancestor') || content.includes('family') || content.includes('heritage')) {
      contextualHealings = relevantHealings.filter(h => h.category === 'ancestral');
    } else if (content.includes('strong') || content.includes('proud') || content.includes('overcome')) {
      contextualHealings = relevantHealings.filter(h => h.category === 'resilience');
    }

    const selectedHealing = contextualHealings.length > 0
      ? contextualHealings[Math.floor(Math.random() * contextualHealings.length)]
      : relevantHealings[Math.floor(Math.random() * relevantHealings.length)];

    if (selectedHealing) {
      setCurrentHealing(selectedHealing);
    }
  };

  const checkActivismMood = () => {
    const content = journalContent.toLowerCase();
    if (content.includes('change') || content.includes('fight') || content.includes('justice') || content.includes('action')) {
      setActivismMoodCheck('ready_for_action');
    } else if (content.includes('tired') || content.includes('exhausted') || content.includes('overwhelmed')) {
      setActivismMoodCheck('need_rest');
    } else if (content.includes('angry') || content.includes('frustrated') || content.includes('unfair')) {
      setActivismMoodCheck('processing_emotions');
    } else {
      setActivismMoodCheck('checking_in');
    }
  };

  if (!racialContext.racialIdentity.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Liberation Healing Message */}
      {currentHealing && (
        <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✊</span>
              <h3 className="text-lg font-medium text-red-800">
                Liberation Healing
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadPersonalizedHealing}
              className="text-red-600 hover:text-red-800"
            >
              ↻ New Message
            </Button>
          </div>
          
          <motion.div
            key={currentHealing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h4 className="font-medium text-red-900 mb-3">
              {currentHealing.title}
            </h4>
            
            <p className="text-red-800 leading-relaxed mb-4">
              {currentHealing.message}
            </p>
            
            {currentHealing.actionableStep && (
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  Reflection & Action:
                </p>
                <p className="text-red-700">
                  {currentHealing.actionableStep}
                </p>
              </div>
            )}

            {currentHealing.triggerWarning && (
              <div className="bg-yellow-100 border-l-4 border-yellow-400 p-3 mt-4">
                <p className="text-sm text-yellow-800">
                  <strong>Content Note:</strong> {currentHealing.triggerWarning}
                </p>
              </div>
            )}
          </motion.div>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHealingInteraction?.('affirm', currentHealing.message)}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              🔥 This Resonates
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHealingInteraction?.('share', currentHealing.message)}
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              📢 Share Wisdom
            </Button>
          </div>
        </Card>
      )}

      {/* Microaggression Processor */}
      {racialContext.discriminationExperiences && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h3 className="text-lg font-medium text-blue-800">
                Microaggression Processing
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMicroaggressionProcessor(!showMicroaggressionProcessor)}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              {showMicroaggressionProcessor ? 'Close' : 'Process'}
            </Button>
          </div>
          
          <p className="text-sm text-blue-700 mb-4">
            Microaggressions are real, harmful, and not in your head. Processing them is part of protecting your mental health.
          </p>
          
          {showMicroaggressionProcessor && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {microaggressionProcessors.map((processor, index) => (
                  <Card key={index} className="p-4 bg-white">
                    <h4 className="font-medium text-blue-800 mb-2 capitalize">
                      {processor.type.replace('_', ' ')}
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      {processor.prompt}
                    </p>
                    <p className="text-xs text-blue-600">
                      {processor.followUp}
                    </p>
                  </Card>
                ))}
              </div>
              
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  Remember:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You don't have to educate everyone who shows ignorance</li>
                  <li>• Protecting your energy is more important than changing minds</li>
                  <li>• Document patterns if it helps you feel empowered</li>
                  <li>• Your reaction to discrimination is normal and healthy</li>
                </ul>
              </div>
            </motion.div>
          )}
        </Card>
      )}

      {/* Resistance as Healing */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-medium text-purple-800">
              Resistance as Healing
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResistanceAffirmation(!showResistanceAffirmation)}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            Get Affirmation
          </Button>
        </div>
        
        <p className="text-sm text-purple-700 mb-4">
          Your resistance to injustice is a form of healing - for yourself, your community, and future generations.
        </p>
        
        {showResistanceAffirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-100 rounded-lg p-4"
          >
            <p className="text-purple-800 font-medium">
              {resistanceAffirmations[Math.floor(Math.random() * resistanceAffirmations.length)]}
            </p>
          </motion.div>
        )}
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-purple-800">Learn</p>
            <p className="text-xs text-purple-600">Understanding systems</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🗣️</div>
            <p className="text-sm font-medium text-purple-800">Speak</p>
            <p className="text-xs text-purple-600">Sharing your truth</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🤝</div>
            <p className="text-sm font-medium text-purple-800">Connect</p>
            <p className="text-xs text-purple-600">Building community</p>
          </div>
        </div>
      </Card>

      {/* Activism Energy Check */}
      {racialContext.activismInterest !== 'not_interested' && (
        <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h3 className="text-lg font-medium text-green-800">
                Activism Energy Check
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkActivismMood}
              className="text-green-600 border-green-300 hover:bg-green-50"
            >
              Check In
            </Button>
          </div>
          
          <p className="text-sm text-green-700 mb-4">
            Social justice work is marathon, not a sprint. Check in with your energy levels for sustainable activism.
          </p>
          
          {activismMoodCheck && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {activismMoodCheck === 'ready_for_action' && (
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="text-green-800 font-medium mb-2">You're Ready for Action!</p>
                  <p className="text-sm text-green-700 mb-3">Your energy is high and you're motivated to create change. Channel this energy wisely.</p>
                  <div className="space-y-2 text-sm">
                    <p>• Find local organizations aligned with your values</p>
                    <p>• Start small: one action this week</p>
                    <p>• Connect with like-minded activists</p>
                    <p>• Document your wins to maintain motivation</p>
                  </div>
                </div>
              )}
              
              {activismMoodCheck === 'need_rest' && (
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium mb-2">Rest is Revolutionary</p>
                  <p className="text-sm text-yellow-700 mb-3">Your body and mind need restoration. Taking breaks from activism is not giving up - it's sustaining yourself for the long haul.</p>
                  <div className="space-y-2 text-sm">
                    <p>• Your rest is productive and necessary</p>
                    <p>• Set boundaries around news consumption</p>
                    <p>• Practice joy and celebration</p>
                    <p>• Trust others to carry the work while you rest</p>
                  </div>
                </div>
              )}
              
              {activismMoodCheck === 'processing_emotions' && (
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-blue-800 font-medium mb-2">Emotional Processing Time</p>
                  <p className="text-sm text-blue-700 mb-3">Big emotions about injustice need space to be felt. This processing is part of your activism work.</p>
                  <div className="space-y-2 text-sm">
                    <p>• Your anger contains important information</p>
                    <p>• Talk to someone who understands your experience</p>
                    <p>• Creative expression can help process feelings</p>
                    <p>• Feeling your feelings is part of staying human</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </Card>
      )}
    </div>
  );
}

/**
 * Racial Healing Community Connector
 * Helps users find culturally-specific support and community
 */
export function RacialHealingCommunityConnector({ 
  racialIdentity, 
  location 
}: { 
  racialIdentity: string[]; 
  location?: string 
}) {
  const [communityResources] = useState([
    {
      identity: 'black',
      resources: [
        { name: 'Black Lives Matter Healing Justice Committee', type: 'activism', national: true },
        { name: 'Black Mental Health Alliance', type: 'mental_health', national: true },
        { name: 'Therapy for Black Girls', type: 'therapy', national: true },
        { name: 'Black Men Heal', type: 'support', national: true }
      ]
    },
    {
      identity: 'latinx',
      resources: [
        { name: 'National Queer and Trans People of Color Coalition', type: 'intersectional', national: true },
        { name: 'UnidosUS', type: 'advocacy', national: true },
        { name: 'Latino Mental Health Association', type: 'mental_health', national: true }
      ]
    },
    {
      identity: 'asian',
      resources: [
        { name: 'Asian Mental Health Collective', type: 'mental_health', national: true },
        { name: 'Stop AAPI Hate', type: 'advocacy', national: true },
        { name: 'National Asian Pacific American Women\'s Forum', type: 'intersectional', national: true }
      ]
    }
  ]);

  const getRelevantResources = () => {
    return communityResources.filter(community =>
      racialIdentity.some(identity =>
        identity.toLowerCase().includes(community.identity) ||
        community.identity.includes(identity.toLowerCase())
      )
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <h3 className="text-lg font-medium text-indigo-800 mb-4">
        🌍 Community Healing Resources
      </h3>
      
      <p className="text-sm text-indigo-700 mb-6">
        Healing from racial trauma happens best in community with others who understand your experience.
      </p>
      
      <div className="space-y-4">
        {getRelevantResources().map((community, index) => (
          <div key={index}>
            <h4 className="font-medium text-indigo-800 mb-2 capitalize">
              {community.identity} Community Resources
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {community.resources.map((resource, idx) => (
                <Card key={idx} className="p-3 bg-white">
                  <p className="font-medium text-sm text-indigo-800">{resource.name}</p>
                  <p className="text-xs text-indigo-600 capitalize">{resource.type.replace('_', ' ')}</p>
                  {resource.national && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mt-1 inline-block">
                      National
                    </span>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Button
          variant="outline"
          size="sm"
          className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
        >
          🔍 Find Local Resources
        </Button>
      </div>
    </Card>
  );
}