/**
 * ALCHM Anti-Oppression Framework
 * 
 * Philosophy: "True healing cannot happen in systems that perpetuate harm.
 * Every feature, every interaction, every piece of content must be examined
 * for how it either challenges or reinforces systems of oppression."
 * 
 * This framework provides:
 * - Real-time bias detection and interruption in AI responses
 * - Oppression pattern recognition in user experiences
 * - Systemic harm validation and response
 * - Liberation-oriented healing approaches
 * - Community accountability systems
 * - Continuous education on power, privilege, and justice
 */

'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface OppressionExperience {
  type: 'microaggression' | 'discrimination' | 'systemic_barrier' | 'gaslighting' | 'tokenism' | 'violence';
  contexts: string[]; // workplace, healthcare, education, family, public_spaces, online
  identity_targeted: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  impact_level: 'mild' | 'moderate' | 'severe' | 'trauma';
  support_available: boolean;
  reporting_safe: boolean;
}

interface LibeationGoals {
  personal: string[];
  community: string[];
  systemic: string[];
  immediate_needs: string[];
  long_term_vision: string[];
}

interface AntiOppressionProfile {
  oppression_experiences: OppressionExperience[];
  liberation_goals: LibeationGoals;
  activism_capacity: 'high' | 'moderate' | 'low' | 'none';
  learning_areas: string[];
  allyship_opportunities: string[];
  safety_level: 'very_safe' | 'mostly_safe' | 'somewhat_safe' | 'unsafe';
}

interface BiasAlert {
  id: string;
  type: 'stereotype' | 'cultural_assumption' | 'ableist_language' | 'heteronormative' | 'classist' | 'racist';
  content: string;
  explanation: string;
  better_approach: string;
  resource_link?: string;
}

interface SystemicValidation {
  pattern: string;
  validation_message: string;
  reframe: string;
  action_steps: string[];
  community_resources: string[];
}

const AntiOppressionContext = createContext<{
  profile: AntiOppressionProfile;
  biasAlerts: BiasAlert[];
  addBiasAlert: (alert: BiasAlert) => void;
  systemicValidations: SystemicValidation[];
} | null>(null);

export function AntiOppressionProvider({ 
  children, 
  profile 
}: { 
  children: React.ReactNode; 
  profile: AntiOppressionProfile;
}) {
  const [biasAlerts, setBiasAlerts] = useState<BiasAlert[]>([]);
  const [systemicValidations] = useState<SystemicValidation[]>([
    {
      pattern: "healthcare_discrimination",
      validation_message: "Medical professionals dismissing your concerns is not uncommon for people with your identities. This is medical discrimination, not a reflection of your worth or the validity of your symptoms.",
      reframe: "Your body's signals are real. Your pain is valid. You deserve competent, respectful healthcare.",
      action_steps: [
        "Bring an advocate to medical appointments if possible",
        "Document your symptoms and interactions",
        "Ask for refusals to be documented in your medical record",
        "Seek second opinions from different healthcare systems"
      ],
      community_resources: ["Black Women's Health Imperative", "National Association of Social Workers"]
    },
    {
      pattern: "workplace_microaggressions",
      validation_message: "Workplace microaggressions are real and harmful. The constant need to prove your competence, navigate coded language, or be the 'only one' takes a psychological toll.",
      reframe: "Your professional skills and worth are not up for debate. The problem is bias, not you.",
      action_steps: [
        "Document incidents with dates and witnesses",
        "Find allies and mentors within the organization",
        "Connect with employee resource groups",
        "Know your company's diversity and inclusion policies"
      ],
      community_resources: ["Equal Employment Opportunity Commission", "Professional associations for your identity"]
    },
    {
      pattern: "educational_barriers",
      validation_message: "Educational institutions often reproduce systemic inequalities. Being questioned, underestimated, or facing financial barriers is not a reflection of your intelligence or potential.",
      reframe: "You belong in educational spaces. Your perspective and contributions are valuable.",
      action_steps: [
        "Connect with student organizations for your identity",
        "Utilize academic support services",
        "Find mentors who understand your experience",
        "Advocate for inclusive curriculum and policies"
      ],
      community_resources: ["TRIO Programs", "United Negro College Fund", "Hispanic Scholarship Fund"]
    }
  ]);

  const addBiasAlert = (alert: BiasAlert) => {
    setBiasAlerts(prev => [...prev, alert]);
  };

  return (
    <AntiOppressionContext.Provider value={{ profile, biasAlerts, addBiasAlert, systemicValidations }}>
      {children}
    </AntiOppressionContext.Provider>
  );
}

export function useAntiOppression() {
  const context = useContext(AntiOppressionContext);
  if (!context) {
    throw new Error('useAntiOppression must be used within AntiOppressionProvider');
  }
  return context;
}

/**
 * Real-time Bias Detection and Interruption
 */
export function BiasInterruptionSystem({ content }: { content: string }) {
  const { addBiasAlert } = useAntiOppression();
  const [detectedBias, setDetectedBias] = useState<BiasAlert[]>([]);

  const biasPatterns = [
    {
      pattern: /\b(crazy|insane|psycho|schizo)\b/gi,
      type: 'ableist_language' as const,
      explanation: "This language perpetuates stigma against people with mental health conditions.",
      better_approach: "Try: 'that's intense', 'overwhelming', 'chaotic', or 'surprising' instead."
    },
    {
      pattern: /\b(normal|typical)\s+(family|relationship|person)\b/gi,
      type: 'heteronormative' as const,
      explanation: "Using 'normal' implies other family structures are abnormal.",
      better_approach: "Consider: 'traditional', 'nuclear family', or simply describe what you mean specifically."
    },
    {
      pattern: /\b(articulate|well-spoken)\b/gi,
      type: 'racist' as const,
      explanation: "These terms can carry racial undertones, implying surprise that someone can speak well.",
      better_approach: "If you want to compliment communication skills, be specific: 'clear', 'thoughtful', 'eloquent'."
    },
    {
      pattern: /\b(ghetto|hood|trashy|classy)\b/gi,
      type: 'classist' as const,
      explanation: "These terms reinforce class hierarchies and judgments.",
      better_approach: "Describe specific behaviors or qualities without class-based judgments."
    },
    {
      pattern: /\b(exotic|oriental)\b/gi,
      type: 'racist' as const,
      explanation: "These terms otherize and fetishize people from other cultures.",
      better_approach: "Use specific cultural or geographic identifiers if relevant."
    }
  ];

  useEffect(() => {
    const alerts: BiasAlert[] = [];
    
    biasPatterns.forEach((pattern, index) => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        const alert: BiasAlert = {
          id: `bias_${index}_${Date.now()}`,
          type: pattern.type,
          content: matches[0],
          explanation: pattern.explanation,
          better_approach: pattern.better_approach
        };
        alerts.push(alert);
        addBiasAlert(alert);
      }
    });

    setDetectedBias(alerts);
  }, [content, addBiasAlert]);

  if (detectedBias.length === 0) return null;

  return (
    <AnimatePresence>
      {detectedBias.map(alert => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4"
        >
          <Card className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-xl">⚠️</span>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Language Check: "{alert.content}"
                </h4>
                <p className="text-sm text-yellow-700 mb-3">{alert.explanation}</p>
                <div className="bg-yellow-100 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Consider instead:</strong> {alert.better_approach}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

/**
 * Systemic Oppression Validator
 * Helps users understand their experiences within systemic context
 */
export function SystemicOppressionValidator({ 
  userExperience, 
  identityContext 
}: { 
  userExperience: string; 
  identityContext: string[];
}) {
  const { systemicValidations } = useAntiOppression();
  const [relevantValidation, setRelevantValidation] = useState<SystemicValidation | null>(null);
  const [showFullValidation, setShowFullValidation] = useState(false);

  useEffect(() => {
    const experience = userExperience.toLowerCase();
    
    // Pattern matching for systemic issues
    let matchedValidation: SystemicValidation | null = null;
    
    if ((experience.includes('doctor') || experience.includes('medical') || experience.includes('health')) &&
        (experience.includes('ignore') || experience.includes('dismiss') || experience.includes('pain'))) {
      matchedValidation = systemicValidations.find(v => v.pattern === 'healthcare_discrimination') || null;
    } else if ((experience.includes('work') || experience.includes('job') || experience.includes('boss')) &&
               (experience.includes('comment') || experience.includes('said') || experience.includes('treat'))) {
      matchedValidation = systemicValidations.find(v => v.pattern === 'workplace_microaggressions') || null;
    } else if ((experience.includes('school') || experience.includes('college') || experience.includes('class')) &&
               (experience.includes('question') || experience.includes('doubt') || experience.includes('belong'))) {
      matchedValidation = systemicValidations.find(v => v.pattern === 'educational_barriers') || null;
    }

    setRelevantValidation(matchedValidation);
  }, [userExperience, systemicValidations]);

  if (!relevantValidation) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <h3 className="text-lg font-semibold text-red-800">
            Systemic Context
          </h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFullValidation(!showFullValidation)}
          className="text-red-600 border-red-300 hover:bg-red-50"
        >
          {showFullValidation ? 'Minimize' : 'Full Support'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="bg-red-100 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">This is Systemic, Not Personal</h4>
          <p className="text-red-800">{relevantValidation.validation_message}</p>
        </div>

        <div className="bg-orange-100 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-2">Reframe</h4>
          <p className="text-orange-800">{relevantValidation.reframe}</p>
        </div>

        <AnimatePresence>
          {showFullValidation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="bg-green-100 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Action Steps</h4>
                <ul className="space-y-1">
                  {relevantValidation.action_steps.map((step, index) => (
                    <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-100 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Community Resources</h4>
                <ul className="space-y-1">
                  {relevantValidation.community_resources.map((resource, index) => (
                    <li key={index} className="text-blue-800 text-sm flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

/**
 * Liberation-Oriented Healing Approaches
 */
export function LiberationHealingApproaches({ profile }: { profile: AntiOppressionProfile }) {
  const [selectedApproach, setSelectedApproach] = useState<'personal' | 'community' | 'systemic' | 'all'>('all');

  const healingApproaches = {
    personal: [
      {
        title: "Internalized Oppression Healing",
        description: "Work to identify and heal the ways you've internalized negative messages about your identities.",
        practices: ["Self-compassion practices", "Identity affirmation work", "Challenging inner critic"],
        timeframe: "Ongoing personal work"
      },
      {
        title: "Trauma-Informed Self-Care",
        description: "Self-care that acknowledges trauma from oppression and doesn't blame individuals for systemic harm.",
        practices: ["Boundary setting with oppressive people", "Somatic healing practices", "Cultural self-care"],
        timeframe: "Daily practices"
      },
      {
        title: "Identity Integration",
        description: "Learning to hold all parts of your identity with pride, even when society sends different messages.",
        practices: ["Identity mapping exercises", "Cultural reclamation", "Chosen family building"],
        timeframe: "Lifelong journey"
      }
    ],
    community: [
      {
        title: "Collective Healing Circles",
        description: "Healing happens in community with others who share similar experiences of oppression.",
        practices: ["Support groups for your identities", "Community organizing", "Mutual aid participation"],
        timeframe: "Weekly/monthly gatherings"
      },
      {
        title: "Cultural Revival and Preservation",
        description: "Reconnecting with cultural practices and traditions that may have been suppressed or lost.",
        practices: ["Learning ancestral practices", "Language reclamation", "Traditional healing methods"],
        timeframe: "Long-term cultural work"
      },
      {
        title: "Intergenerational Healing",
        description: "Healing that acknowledges and works with generational trauma and resilience.",
        practices: ["Family healing work", "Ancestor honoring", "Breaking cycles for future generations"],
        timeframe: "Generational timelines"
      }
    ],
    systemic: [
      {
        title: "Social Justice as Mental Health Practice",
        description: "Understanding that working for justice is a form of healing and mental health maintenance.",
        practices: ["Community organizing", "Policy advocacy", "Educational activism"],
        timeframe: "Campaign-based work"
      },
      {
        title: "Institution Transformation",
        description: "Working to make systems more equitable rather than just helping individuals cope with inequity.",
        practices: ["Organizational change work", "Anti-bias training", "Policy development"],
        timeframe: "Years of sustained effort"
      },
      {
        title: "Creating Alternative Systems",
        description: "Building new systems and institutions that operate from principles of liberation rather than oppression.",
        practices: ["Cooperative development", "Alternative healing spaces", "Liberation education"],
        timeframe: "Long-term vision work"
      }
    ]
  };

  const getApproaches = () => {
    if (selectedApproach === 'all') {
      return [...healingApproaches.personal, ...healingApproaches.community, ...healingApproaches.systemic];
    }
    return healingApproaches[selectedApproach];
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <h3 className="text-lg font-semibold text-purple-800 mb-6">
        🌟 Liberation-Oriented Healing
      </h3>

      {/* Approach Selection */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {(['all', 'personal', 'community', 'systemic'] as const).map(approach => (
          <Button
            key={approach}
            variant={selectedApproach === approach ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedApproach(approach)}
            className={selectedApproach === approach ? 'bg-purple-600 text-white' : 'text-purple-600 border-purple-300'}
          >
            {approach === 'all' ? '🌈 All Levels' : 
             approach === 'personal' ? '💖 Personal' :
             approach === 'community' ? '🤝 Community' : '🏛️ Systemic'}
          </Button>
        ))}
      </div>

      {/* Healing Approaches */}
      <div className="space-y-4">
        {getApproaches().map((approach, index) => (
          <Card key={index} className="p-4 bg-white border-purple-100">
            <h4 className="font-semibold text-purple-900 mb-2">{approach.title}</h4>
            <p className="text-purple-800 mb-3">{approach.description}</p>
            
            <div className="mb-3">
              <h5 className="font-medium text-purple-800 mb-1">Practices:</h5>
              <ul className="space-y-1">
                {approach.practices.map((practice, idx) => (
                  <li key={idx} className="text-sm text-purple-700 flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Timeline: {approach.timeframe}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-100 rounded-lg">
        <p className="text-purple-800 text-sm">
          <strong>Remember:</strong> Liberation healing works on multiple levels simultaneously. 
          Personal healing without systemic change is incomplete, and systemic change without 
          personal healing is unsustainable. You need both individual and collective approaches.
        </p>
      </div>
    </Card>
  );
}

/**
 * Power and Privilege Education
 */
export function PowerPrivilegeEducation() {
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);

  const educationTopics = [
    {
      id: 'intersectionality',
      title: 'Intersectionality 101',
      content: "Coined by Kimberlé Crenshaw, intersectionality describes how different forms of discrimination overlap and compound. A Black woman doesn't experience racism and sexism separately - she experiences both simultaneously in ways that create unique challenges.",
      action: "Think about your own intersecting identities. How do they interact to create your unique experience?"
    },
    {
      id: 'privilege',
      title: 'Understanding Privilege',
      content: "Privilege doesn't mean your life is easy - it means certain aspects of your identity give you advantages that others don't have. You can have privilege in some areas while being oppressed in others.",
      action: "Consider one area where you have privilege and one where you face oppression. How do they interact?"
    },
    {
      id: 'microaggressions',
      title: 'Microaggressions Explained',
      content: "Microaggressions are everyday slights, invalidations, and put-downs that members of marginalized groups experience. They're often unconscious but have cumulative harmful effects on mental health.",
      action: "Reflect on microaggressions you've experienced or witnessed. How did they impact you or others?"
    },
    {
      id: 'allyship',
      title: 'Active Allyship',
      content: "True allyship involves using your privilege to advocate for marginalized groups, amplifying their voices, and working for systemic change. It's active, ongoing work, not a passive identity.",
      action: "Identify one concrete action you can take this week to be a better ally to a community you're not part of."
    },
    {
      id: 'liberation',
      title: 'Liberation vs. Equality',
      content: "Equality means everyone gets the same resources. Liberation means everyone gets what they need to thrive. Sometimes equal treatment perpetuates inequality when people start from different places.",
      action: "Think of an area where you need liberation, not just equality. What would true liberation look like?"
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
      <h3 className="text-lg font-semibold text-green-800 mb-6">
        📚 Power & Privilege Education
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {educationTopics.map(topic => (
          <Card 
            key={topic.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              currentTopic === topic.id ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:bg-green-25'
            }`}
            onClick={() => setCurrentTopic(currentTopic === topic.id ? null : topic.id)}
          >
            <h4 className="font-semibold text-green-800 mb-2">{topic.title}</h4>
            <p className="text-sm text-green-600">
              {currentTopic === topic.id ? 'Click to collapse' : 'Click to learn more'}
            </p>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {currentTopic && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {educationTopics.map(topic => (
              topic.id === currentTopic && (
                <Card key={topic.id} className="p-6 bg-white border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4">{topic.title}</h4>
                  <p className="text-green-800 mb-4 leading-relaxed">{topic.content}</p>
                  <div className="bg-green-100 rounded-lg p-4">
                    <h5 className="font-semibold text-green-900 mb-2">Reflection:</h5>
                    <p className="text-green-800">{topic.action}</p>
                  </div>
                </Card>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center">
        <p className="text-sm text-green-700 mb-4">
          Understanding power and privilege is ongoing work. These concepts help us build more just and equitable communities.
        </p>
        
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 border-green-300 hover:bg-green-50"
        >
          📖 More Resources
        </Button>
      </div>
    </Card>
  );
}