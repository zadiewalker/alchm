/**
 * ALCHM Cultural Guided Experience
 * 
 * Philosophy: "Every person deserves to be met where they are, with the wisdom of their ancestors
 * and the strength of their community guiding their healing journey."
 * 
 * This component creates culturally-responsive guided experiences that:
 * - Honor diverse healing traditions and spiritual practices
 * - Adapt to different cultural communication styles  
 * - Support intersectional identities with nuanced understanding
 * - Provide trauma-informed pathways for marginalized communities
 * - Center community wisdom alongside individual growth
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { culturalPromptsEngine, CulturalPromptContext } from '@/lib/cultural-prompts-engine';
import { culturalEngagementAnalytics, trackCulturalExpression } from '@/lib/analytics/cultural-engagement-analytics';

interface CulturalGuidanceStep {
  id: string;
  title: string;
  culturalFramework: string;
  healingApproach: 'individual' | 'community' | 'ancestral' | 'land-based' | 'somatic' | 'narrative';
  component: React.ComponentType<CulturalStepProps>;
  culturalOrigin: string;
  respectfulGuidance: string;
  adaptedForTrauma: boolean;
  intersectionalAware: boolean;
}

interface CulturalStepProps {
  userContext: CulturalPromptContext;
  onComplete: (data: any) => void;
  onSkip: () => void;
  culturalFramework: string;
}

interface CulturalGuidedExperienceProps {
  userContext: CulturalPromptContext;
  experienceType: 'onboarding' | 'check_in' | 'crisis_support' | 'identity_exploration' | 'community_healing';
  onComplete: (results: any) => void;
}

// Cultural Check-In Component
function CulturalCheckIn({ userContext, onComplete, onSkip }: CulturalStepProps) {
  const [currentState, setCurrentState] = useState({
    culturalConnection: '',
    identityAffirmation: '',
    communityFeeling: '',
    ancestralWisdom: ''
  });

  const getCulturalCheckInPrompts = () => {
    const basePrompts = {
      culturalConnection: "How connected do you feel to your cultural identity today?",
      identityAffirmation: "What part of your identity feels strongest right now?",
      communityFeeling: "How supported do you feel by your community?",
      ancestralWisdom: "What wisdom from your ancestors or elders speaks to you today?"
    };

    // Adapt based on cultural background
    if (userContext.culturalBackground?.includes('african_diaspora')) {
      basePrompts.ancestralWisdom = "What strength from your lineage do you feel moving through you today?";
    } else if (userContext.culturalBackground?.includes('asian_traditions')) {
      basePrompts.identityAffirmation = "How is balance showing up in your life today?";
    } else if (userContext.culturalBackground?.includes('latin_american')) {
      basePrompts.communityFeeling = "How is familia (chosen or biological) holding you today?";
    } else if (userContext.culturalBackground?.includes('indigenous')) {
      basePrompts.culturalConnection = "What is the land teaching you about yourself today?";
    }

    return basePrompts;
  };

  const prompts = getCulturalCheckInPrompts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-4">Cultural Check-In</h2>
        <p className="text-gray-600">
          Let's pause and honor how you're showing up as your full, cultural self today.
        </p>
      </div>

      <div className="space-y-6">
        {Object.entries(prompts).map(([key, prompt]) => (
          <div key={key} className="space-y-3">
            <label className="block text-lg font-medium">{prompt}</label>
            <textarea
              value={currentState[key as keyof typeof currentState]}
              onChange={(e) => setCurrentState(prev => ({
                ...prev,
                [key]: e.target.value
              }))}
              className="w-full p-4 border rounded-lg min-h-[100px] resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Take your time to reflect..."
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button 
          onClick={() => onComplete(currentState)}
          disabled={!Object.values(currentState).some(value => value.trim())}
        >
          Continue with wisdom
        </Button>
      </div>
    </motion.div>
  );
}

// Identity Affirmation Component
function IdentityAffirmation({ userContext, onComplete, onSkip }: CulturalStepProps) {
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [customAffirmation, setCustomAffirmation] = useState('');

  const getCulturalAffirmations = () => {
    const baseAffirmations = [
      "I am worthy of love exactly as I am",
      "My identity is beautiful and complex",
      "I honor all parts of myself",
      "My voice and experience matter"
    ];

    // Add culturally-specific affirmations
    if (userContext.culturalBackground?.includes('african_diaspora')) {
      baseAffirmations.push(
        "I carry the strength of my ancestors",
        "My melanin is magic, my heritage is power",
        "I am part of an unbroken chain of resilience"
      );
    }

    if (userContext.lgbtqIdentity) {
      baseAffirmations.push(
        "My queerness is a gift to the world",
        "I belong in spaces that celebrate my authentic self",
        "Love is love, and I am love"
      );
    }

    if (userContext.culturalBackground?.includes('multicultural')) {
      baseAffirmations.push(
        "I am a bridge between worlds",
        "My multiple cultures are a source of wisdom",
        "I navigate complexity with grace"
      );
    }

    if (userContext.neurodivergent) {
      baseAffirmations.push(
        "My brain is beautifully different",
        "I think in ways that contribute unique value",
        "Neurodiversity is natural and valuable"
      );
    }

    if (userContext.culturalBackground?.includes('indigenous')) {
      baseAffirmations.push(
        "I am connected to the wisdom of the earth",
        "My relationship with the land guides my healing",
        "I honor the teachings of my ancestors"
      );
    }

    return baseAffirmations;
  };

  const culturalAffirmations = getCulturalAffirmations();

  const toggleAffirmation = (affirmation: string) => {
    setAffirmations(prev => 
      prev.includes(affirmation)
        ? prev.filter(a => a !== affirmation)
        : [...prev, affirmation]
    );
  };

  const handleComplete = async () => {
    const finalAffirmations = [...affirmations];
    if (customAffirmation.trim()) {
      finalAffirmations.push(customAffirmation.trim());
    }

    // Track cultural expression
    await trackCulturalExpression(userContext, 'identity_affirmation', 'high');

    onComplete({ selectedAffirmations: finalAffirmations });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-4">Identity Affirmation</h2>
        <p className="text-gray-600">
          Choose the affirmations that resonate with your soul today. 
          Your identity deserves celebration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {culturalAffirmations.map((affirmation, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleAffirmation(affirmation)}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              affirmations.includes(affirmation)
                ? 'border-purple-500 bg-purple-50 text-purple-900'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                affirmations.includes(affirmation)
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {affirmations.includes(affirmation) && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{affirmation}</span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="space-y-3">
        <label className="block text-lg font-medium">
          Create your own affirmation:
        </label>
        <textarea
          value={customAffirmation}
          onChange={(e) => setCustomAffirmation(e.target.value)}
          className="w-full p-4 border rounded-lg min-h-[100px] resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="I am... (write what feels true for you)"
        />
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={affirmations.length === 0 && !customAffirmation.trim()}
        >
          Embrace these truths
        </Button>
      </div>
    </motion.div>
  );
}

// Ancestral Wisdom Component
function AncestralWisdom({ userContext, onComplete, onSkip }: CulturalStepProps) {
  const [reflection, setReflection] = useState('');
  const [selectedWisdomTradition, setSelectedWisdomTradition] = useState('');

  const getWisdomTraditions = () => {
    const traditions = [
      { id: 'elders', name: 'Elder Teachings', description: 'Wisdom from older family or community members' },
      { id: 'spiritual', name: 'Spiritual Teachers', description: 'Guidance from spiritual or religious leaders' },
      { id: 'chosen_family', name: 'Chosen Family Wisdom', description: 'Lessons from your chosen family' },
      { id: 'cultural_stories', name: 'Cultural Stories', description: 'Traditional stories and folktales' },
      { id: 'lived_experience', name: 'Lived Experience', description: 'Wisdom from your own journey' }
    ];

    // Add culturally-specific traditions
    if (userContext.culturalBackground?.includes('african_diaspora')) {
      traditions.push({
        id: 'ancestral_spirits',
        name: 'Ancestral Spirits',
        description: 'Guidance from those who came before'
      });
    }

    if (userContext.culturalBackground?.includes('indigenous')) {
      traditions.push({
        id: 'land_teachings',
        name: 'Land Teachings',
        description: 'Wisdom from the natural world'
      });
    }

    return traditions;
  };

  const wisdomTraditions = getWisdomTraditions();

  const getWisdomPrompt = () => {
    if (!selectedWisdomTradition) {
      return "What source of wisdom would you like to connect with today?";
    }

    const prompts = {
      'elders': 'What would an elder who loves you want you to remember today?',
      'spiritual': 'What spiritual teaching or practice offers you strength right now?',
      'chosen_family': 'What wisdom has your chosen family shared that guides you?',
      'cultural_stories': 'What story from your culture offers medicine for this moment?',
      'lived_experience': 'What have you learned that you want to honor and remember?',
      'ancestral_spirits': 'What are your ancestors whispering to your heart today?',
      'land_teachings': 'What is the earth trying to teach you through this season of your life?'
    };

    return prompts[selectedWisdomTradition as keyof typeof prompts] || prompts['lived_experience'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-4">Ancestral Wisdom</h2>
        <p className="text-gray-600">
          Connect with the wisdom that flows through your lineage - biological, spiritual, or chosen.
        </p>
      </div>

      {!selectedWisdomTradition ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Choose a source of wisdom:</h3>
          <div className="grid grid-cols-1 gap-3">
            {wisdomTraditions.map((tradition) => (
              <button
                key={tradition.id}
                onClick={() => setSelectedWisdomTradition(tradition.id)}
                className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
              >
                <div className="font-medium">{tradition.name}</div>
                <div className="text-sm text-gray-600 mt-1">{tradition.description}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {wisdomTraditions.find(t => t.id === selectedWisdomTradition)?.name}
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedWisdomTradition('')}
              >
                Change
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-medium">
              {getWisdomPrompt()}
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="w-full p-4 border rounded-lg min-h-[150px] resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Listen deeply... what emerges?"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        {selectedWisdomTradition && (
          <Button 
            onClick={() => onComplete({ 
              wisdomTradition: selectedWisdomTradition,
              reflection: reflection 
            })}
            disabled={!reflection.trim()}
          >
            Honor this wisdom
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Main Cultural Guided Experience Component
export default function CulturalGuidedExperience({
  userContext,
  experienceType,
  onComplete
}: CulturalGuidedExperienceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [experienceData, setExperienceData] = useState<any>({});
  const [isComplete, setIsComplete] = useState(false);

  // Define experience flows based on type
  const getExperienceSteps = (): CulturalGuidanceStep[] => {
    const baseSteps: CulturalGuidanceStep[] = [
      {
        id: 'cultural_checkin',
        title: 'Cultural Check-In',
        culturalFramework: 'Holistic self-assessment',
        healingApproach: 'individual',
        component: CulturalCheckIn,
        culturalOrigin: 'Cross-cultural wellness practices',
        respectfulGuidance: 'Honor your current state without judgment',
        adaptedForTrauma: true,
        intersectionalAware: true
      },
      {
        id: 'identity_affirmation',
        title: 'Identity Affirmation',
        culturalFramework: 'Identity celebration',
        healingApproach: 'individual',
        component: IdentityAffirmation,
        culturalOrigin: 'Identity-based healing movements',
        respectfulGuidance: 'Choose only what resonates with your truth',
        adaptedForTrauma: true,
        intersectionalAware: true
      },
      {
        id: 'ancestral_wisdom',
        title: 'Ancestral Wisdom',
        culturalFramework: 'Intergenerational healing',
        healingApproach: 'ancestral',
        component: AncestralWisdom,
        culturalOrigin: 'Cross-cultural ancestral reverence',
        respectfulGuidance: 'Ancestors can be biological, spiritual, or chosen',
        adaptedForTrauma: true,
        intersectionalAware: true
      }
    ];

    return baseSteps;
  };

  const experienceSteps = getExperienceSteps();
  const currentStep = experienceSteps[currentStepIndex];
  const CurrentStepComponent = currentStep?.component;

  const handleStepComplete = async (stepData: any) => {
    const updatedData = {
      ...experienceData,
      [currentStep.id]: stepData
    };
    setExperienceData(updatedData);

    // Track cultural engagement
    await culturalEngagementAnalytics.trackCulturalEvent({
      event_type: 'cultural_engagement',
      user_context: userContext,
      cultural_significance: 'medium',
      healing_tradition_honored: currentStep.culturalFramework
    });

    if (currentStepIndex < experienceSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(updatedData);
    }
  };

  const handleStepSkip = () => {
    if (currentStepIndex < experienceSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
      onComplete(experienceData);
    }
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-6">🌟</div>
        <h2 className="text-3xl font-medium mb-4">Journey Complete</h2>
        <p className="text-xl text-gray-600">
          You've honored your cultural wisdom and embraced your authentic self.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-medium">Cultural Guided Experience</h1>
          <div className="text-sm text-gray-600">
            Step {currentStepIndex + 1} of {experienceSteps.length}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / experienceSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Cultural context notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-xl">ℹ️</div>
          <div>
            <h3 className="font-medium text-blue-900">Cultural Respect Notice</h3>
            <p className="text-blue-700 text-sm mt-1">
              {currentStep.respectfulGuidance} This experience honors {currentStep.culturalOrigin}.
            </p>
          </div>
        </div>
      </div>

      {/* Current step */}
      <Card className="p-8">
        <AnimatePresence mode="wait">
          {CurrentStepComponent && (
            <CurrentStepComponent
              key={currentStep.id}
              userContext={userContext}
              onComplete={handleStepComplete}
              onSkip={handleStepSkip}
              culturalFramework={currentStep.culturalFramework}
            />
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}