/**
 * ALCHM Intersectional Wellness Hub
 * 
 * Philosophy: "Healing happens at the intersections. Every person holds multiple identities,
 * and each intersection creates unique wisdom, challenges, and strengths."
 * 
 * This component provides:
 * - Intersectional identity navigation support
 * - Code-switching and identity integration tools
 * - Culturally-specific resources and affirmations
 * - Community connections for shared experiences
 * - Systemic awareness and anti-oppression framing
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/Chip';
import { useAuth } from '@/lib/useAuth';

interface IntersectionalIdentity {
  id: string;
  label: string;
  category: 'race_ethnicity' | 'sexual_orientation' | 'gender_identity' | 'neurodivergence' | 
           'disability' | 'socioeconomic' | 'immigration' | 'religion_spirituality' | 'age' | 'other';
  emoji: string;
  strength: string;
  challenge: string;
  affirmation: string;
  communityResources: string[];
  intersectionalConsiderations: string[];
}

interface IntersectionalExperience {
  identities: string[];
  uniqueChallenges: string[];
  uniqueStrengths: string[];
  supportNeeds: string[];
  communityConnections: string[];
  systemicFactors: string[];
}

interface IntersectionalWellnessHubProps {
  userIdentities?: IntersectionalIdentity[];
  onIdentityExploration?: (experience: IntersectionalExperience) => void;
}

// Pre-defined intersectional identities with respectful, affirming descriptions
const INTERSECTIONAL_IDENTITIES: IntersectionalIdentity[] = [
  // Race & Ethnicity
  {
    id: 'black',
    label: 'Black/African American',
    category: 'race_ethnicity',
    emoji: '🖤',
    strength: 'Ancestral resilience and community strength',
    challenge: 'Navigating systemic racism and cultural stereotypes',
    affirmation: 'I carry the wisdom and strength of my ancestors',
    communityResources: ['Black mental health professionals', 'African American cultural centers'],
    intersectionalConsiderations: ['Anti-Black racism', 'Cultural pride', 'Ancestral connection']
  },
  {
    id: 'latinx',
    label: 'Latinx/Hispanic',
    category: 'race_ethnicity',
    emoji: '🌮',
    strength: 'Familismo and cultural richness',
    challenge: 'Language barriers and cultural navigation',
    affirmation: 'My cultura es mi fuerza - my culture is my strength',
    communityResources: ['Latino community centers', 'Bilingual mental health services'],
    intersectionalConsiderations: ['Immigration stress', 'Language identity', 'Family expectations']
  },
  {
    id: 'asian_american',
    label: 'Asian/Asian American',
    category: 'race_ethnicity',
    emoji: '🏮',
    strength: 'Cultural wisdom and resilience traditions',
    challenge: 'Model minority myth and cultural expectations',
    affirmation: 'I honor my heritage while creating my own path',
    communityResources: ['Asian American mental health resources', 'Cultural associations'],
    intersectionalConsiderations: ['Academic pressure', 'Family honor', 'Cultural identity conflict']
  },
  {
    id: 'indigenous',
    label: 'Indigenous/Native American',
    category: 'race_ethnicity',
    emoji: '🪶',
    strength: 'Connection to land and traditional healing',
    challenge: 'Historical trauma and cultural preservation',
    affirmation: 'I am connected to the wisdom of my ancestors and the earth',
    communityResources: ['Tribal mental health services', 'Traditional healers'],
    intersectionalConsiderations: ['Historical trauma', 'Land connection', 'Cultural preservation']
  },
  {
    id: 'middle_eastern',
    label: 'Middle Eastern/North African',
    category: 'race_ethnicity',
    emoji: '🕌',
    strength: 'Rich cultural traditions and community bonds',
    challenge: 'Islamophobia and cultural misunderstanding',
    affirmation: 'My heritage is beautiful and my faith is strength',
    communityResources: ['Cultural centers', 'Faith-based counseling'],
    intersectionalConsiderations: ['Religious identity', 'Cultural stereotypes', 'Family honor']
  },
  
  // LGBTQ+ Identities
  {
    id: 'lesbian',
    label: 'Lesbian',
    category: 'sexual_orientation',
    emoji: '🏳️‍🌈',
    strength: 'Authentic self-expression and chosen family',
    challenge: 'Heteronormativity and visibility struggles',
    affirmation: 'My love is beautiful and my authenticity is powerful',
    communityResources: ['LGBTQ+ centers', 'Lesbian support groups'],
    intersectionalConsiderations: ['Coming out stress', 'Family acceptance', 'Workplace safety']
  },
  {
    id: 'gay',
    label: 'Gay',
    category: 'sexual_orientation',
    emoji: '🏳️‍🌈',
    strength: 'Community resilience and creative expression',
    challenge: 'Homophobia and family rejection risks',
    affirmation: 'I am proud of who I love and how I love',
    communityResources: ['Gay men\'s support groups', 'LGBTQ+ mental health specialists'],
    intersectionalConsiderations: ['Masculinity expectations', 'HIV stigma', 'Age and community']
  },
  {
    id: 'bisexual',
    label: 'Bisexual/Pansexual',
    category: 'sexual_orientation',
    emoji: '💗',
    strength: 'Capacity for diverse love and connection',
    challenge: 'Bi-erasure and validity questioning',
    affirmation: 'My attraction is valid regardless of who I\'m with',
    communityResources: ['Bisexual support networks', 'Pan/bi community groups'],
    intersectionalConsiderations: ['Bi-erasure', 'Community acceptance', 'Identity validation']
  },
  {
    id: 'transgender',
    label: 'Transgender',
    category: 'gender_identity',
    emoji: '🏳️‍⚧️',
    strength: 'Courage to live authentically',
    challenge: 'Transphobia and medical barriers',
    affirmation: 'I am brave, I am valid, I am enough exactly as I am',
    communityResources: ['Trans support groups', 'Gender-affirming care providers'],
    intersectionalConsiderations: ['Medical access', 'Legal recognition', 'Safety concerns']
  },
  {
    id: 'nonbinary',
    label: 'Non-binary/Genderqueer',
    category: 'gender_identity',
    emoji: '💛',
    strength: 'Freedom from binary constraints',
    challenge: 'Lack of recognition and understanding',
    affirmation: 'My gender is valid and beautiful in its uniqueness',
    communityResources: ['Non-binary support groups', 'Gender-inclusive spaces'],
    intersectionalConsiderations: ['Pronoun respect', 'Binary systems navigation', 'Identity explanation fatigue']
  },
  
  // Neurodivergence & Disability
  {
    id: 'adhd',
    label: 'ADHD',
    category: 'neurodivergence',
    emoji: '🧠',
    strength: 'Creative thinking and hyperfocus abilities',
    challenge: 'Executive function and attention struggles',
    affirmation: 'My brain works differently and that is a gift',
    communityResources: ['ADHD support groups', 'Neurodiversity advocates'],
    intersectionalConsiderations: ['Academic accommodations', 'Workplace modifications', 'Self-advocacy']
  },
  {
    id: 'autism',
    label: 'Autistic',
    category: 'neurodivergence',
    emoji: '♾️',
    strength: 'Detailed thinking and authentic communication',
    challenge: 'Social navigation and sensory overwhelm',
    affirmation: 'I communicate and connect in my own beautiful way',
    communityResources: ['Autistic self-advocacy groups', 'Sensory-friendly spaces'],
    intersectionalConsiderations: ['Masking fatigue', 'Sensory needs', 'Communication differences']
  },
  {
    id: 'chronic_illness',
    label: 'Chronic Illness/Disability',
    category: 'disability',
    emoji: '🦽',
    strength: 'Resilience and advocacy skills',
    challenge: 'Ableism and accessibility barriers',
    affirmation: 'My body and experience are valid exactly as they are',
    communityResources: ['Disability advocacy groups', 'Chronic illness support networks'],
    intersectionalConsiderations: ['Accessibility needs', 'Medical advocacy', 'Invisible disability challenges']
  },
  
  // Other Intersectional Identities
  {
    id: 'immigrant',
    label: 'Immigrant/Refugee',
    category: 'immigration',
    emoji: '🌍',
    strength: 'Cultural bridge-building and adaptability',
    challenge: 'Documentation stress and cultural navigation',
    affirmation: 'I carry the strength of two worlds within me',
    communityResources: ['Immigrant support services', 'Cultural community centers'],
    intersectionalConsiderations: ['Documentation anxiety', 'Language barriers', 'Cultural identity']
  },
  {
    id: 'first_generation',
    label: 'First-Generation College/American',
    category: 'socioeconomic',
    emoji: '🎓',
    strength: 'Trailblazing spirit and family pride',
    challenge: 'Navigating systems without family guidance',
    affirmation: 'I am breaking generational barriers with courage',
    communityResources: ['First-gen support programs', 'Academic mentorship'],
    intersectionalConsiderations: ['Imposter syndrome', 'Family expectations', 'Cultural navigation']
  }
];

// Identity Explorer Component
function IdentityExplorer({ 
  onIdentitiesSelected 
}: { 
  onIdentitiesSelected: (identities: IntersectionalIdentity[]) => void 
}) {
  const [selectedIdentities, setSelectedIdentities] = useState<IntersectionalIdentity[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  
  const categories = [
    { id: 'all', label: 'All', emoji: '🌈' },
    { id: 'race_ethnicity', label: 'Race & Ethnicity', emoji: '🌍' },
    { id: 'sexual_orientation', label: 'Sexual Orientation', emoji: '🏳️‍🌈' },
    { id: 'gender_identity', label: 'Gender Identity', emoji: '💫' },
    { id: 'neurodivergence', label: 'Neurodivergence', emoji: '🧠' },
    { id: 'disability', label: 'Disability', emoji: '♿' },
    { id: 'immigration', label: 'Immigration', emoji: '🌍' },
    { id: 'socioeconomic', label: 'Socioeconomic', emoji: '📚' }
  ];
  
  const filteredIdentities = currentCategory === 'all' 
    ? INTERSECTIONAL_IDENTITIES
    : INTERSECTIONAL_IDENTITIES.filter(identity => identity.category === currentCategory);
  
  const toggleIdentity = (identity: IntersectionalIdentity) => {
    setSelectedIdentities(prev => {
      const exists = prev.find(i => i.id === identity.id);
      if (exists) {
        return prev.filter(i => i.id !== identity.id);
      } else {
        return [...prev, identity];
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Identity Explorer</h3>
        <p className="text-gray-600">
          Select the identities that feel true for you. You are complex and multifaceted.
        </p>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map(category => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentCategory(category.id)}
            className="flex items-center gap-2"
          >
            <span>{category.emoji}</span>
            <span>{category.label}</span>
          </Button>
        ))}
      </div>
      
      {/* Identity grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {filteredIdentities.map(identity => {
          const isSelected = selectedIdentities.some(i => i.id === identity.id);
          return (
            <motion.div
              key={identity.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => toggleIdentity(identity)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{identity.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{identity.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{identity.strength}</div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
      
      {selectedIdentities.length > 0 && (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Your Selected Identities:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedIdentities.map(identity => (
                <Chip
                  key={identity.id}
                  variant="purple"
                  className="flex items-center gap-2"
                >
                  <span>{identity.emoji}</span>
                  <span>{identity.label}</span>
                </Chip>
              ))}
            </div>
          </div>
          
          <Button
            onClick={() => onIdentitiesSelected(selectedIdentities)}
            className="w-full"
            disabled={selectedIdentities.length === 0}
          >
            Continue with these identities
          </Button>
        </div>
      )}
    </div>
  );
}

// Intersectional Insights Component
function IntersectionalInsights({ 
  identities,
  onExperienceMapping 
}: { 
  identities: IntersectionalIdentity[];
  onExperienceMapping: (experience: IntersectionalExperience) => void;
}) {
  const [reflections, setReflections] = useState({
    uniqueChallenges: '',
    uniqueStrengths: '',
    supportNeeds: '',
    systemicFactors: ''
  });
  
  // Generate intersectional considerations
  const generateIntersectionalInsights = () => {
    const allConsiderations = identities.flatMap(i => i.intersectionalConsiderations);
    const uniqueConsiderations = [...new Set(allConsiderations)];
    
    const intersections = [];
    if (identities.length > 1) {
      for (let i = 0; i < identities.length; i++) {
        for (let j = i + 1; j < identities.length; j++) {
          intersections.push(`${identities[i].label} + ${identities[j].label}`);
        }
      }
    }
    
    return { uniqueConsiderations, intersections };
  };
  
  const { uniqueConsiderations, intersections } = generateIntersectionalInsights();
  
  const handleComplete = () => {
    const experience: IntersectionalExperience = {
      identities: identities.map(i => i.id),
      uniqueChallenges: reflections.uniqueChallenges.split(',').map(s => s.trim()).filter(Boolean),
      uniqueStrengths: reflections.uniqueStrengths.split(',').map(s => s.trim()).filter(Boolean),
      supportNeeds: reflections.supportNeeds.split(',').map(s => s.trim()).filter(Boolean),
      communityConnections: identities.flatMap(i => i.communityResources),
      systemicFactors: reflections.systemicFactors.split(',').map(s => s.trim()).filter(Boolean)
    };
    
    onExperienceMapping(experience);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Intersectional Insights</h3>
        <p className="text-gray-600">
          Let's explore how your identities intersect to create your unique experience.
        </p>
      </div>
      
      {/* Identity intersections */}
      {intersections.length > 0 && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Your Identity Intersections:</h4>
          <div className="space-y-2">
            {intersections.map((intersection, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-purple-500">⊕</span>
                <span>{intersection}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Intersectional considerations */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Considerations for your identities:</h4>
        <div className="grid grid-cols-2 gap-2">
          {uniqueConsiderations.map((consideration, index) => (
            <Chip key={index} variant="blue" size="sm">
              {consideration}
            </Chip>
          ))}
        </div>
      </Card>
      
      {/* Reflection prompts */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="block font-medium">
            What unique challenges do you face at the intersection of your identities?
          </label>
          <textarea
            value={reflections.uniqueChallenges}
            onChange={(e) => setReflections(prev => ({ ...prev, uniqueChallenges: e.target.value }))}
            className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
            placeholder="Consider how your identities combine to create specific experiences..."
          />
        </div>
        
        <div className="space-y-3">
          <label className="block font-medium">
            What unique strengths emerge from your intersectional experience?
          </label>
          <textarea
            value={reflections.uniqueStrengths}
            onChange={(e) => setReflections(prev => ({ ...prev, uniqueStrengths: e.target.value }))}
            className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
            placeholder="How do your identities give you special insights or abilities..."
          />
        </div>
        
        <div className="space-y-3">
          <label className="block font-medium">
            What support would help you thrive in all aspects of your identity?
          </label>
          <textarea
            value={reflections.supportNeeds}
            onChange={(e) => setReflections(prev => ({ ...prev, supportNeeds: e.target.value }))}
            className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
            placeholder="What kind of community, resources, or understanding do you need..."
          />
        </div>
        
        <div className="space-y-3">
          <label className="block font-medium">
            What systemic factors impact your wellbeing? (Optional but important)
          </label>
          <textarea
            value={reflections.systemicFactors}
            onChange={(e) => setReflections(prev => ({ ...prev, systemicFactors: e.target.value }))}
            className="w-full p-3 border rounded-lg min-h-[100px] resize-none"
            placeholder="Consider discrimination, access barriers, institutional challenges..."
          />
          <p className="text-sm text-gray-600">
            Understanding systemic impacts helps us address root causes, not just individual symptoms.
          </p>
        </div>
      </div>
      
      <Button
        onClick={handleComplete}
        className="w-full"
        disabled={!reflections.uniqueStrengths && !reflections.uniqueChallenges}
      >
        Complete Intersectional Mapping
      </Button>
    </div>
  );
}

// Affirmations & Resources Component
function AffirmationsAndResources({ 
  identities,
  experience 
}: { 
  identities: IntersectionalIdentity[];
  experience: IntersectionalExperience;
}) {
  const [selectedAffirmations, setSelectedAffirmations] = useState<string[]>([]);
  const [customAffirmation, setCustomAffirmation] = useState('');
  
  const allAffirmations = identities.map(i => i.affirmation);
  const allResources = [...new Set(identities.flatMap(i => i.communityResources))];
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">Your Affirmations & Resources</h3>
        <p className="text-gray-600">
          Celebrate your identities and connect with supportive communities.
        </p>
      </div>
      
      {/* Identity Affirmations */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Identity Affirmations</h4>
        <div className="space-y-3">
          {allAffirmations.map((affirmation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
            >
              <p className="text-purple-900 font-medium italic">"{affirmation}"</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 space-y-3">
          <label className="block font-medium">Create your personal affirmation:</label>
          <textarea
            value={customAffirmation}
            onChange={(e) => setCustomAffirmation(e.target.value)}
            className="w-full p-3 border rounded-lg min-h-[80px] resize-none"
            placeholder="I am... (write what feels most true and empowering for you)"
          />
        </div>
      </Card>
      
      {/* Community Resources */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Community Resources</h4>
        <p className="text-gray-600 mb-4">
          These resources understand the complexity of your intersectional experience:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allResources.map((resource, index) => (
            <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-900 font-medium">{resource}</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Intersectional Strengths */}
      {experience.uniqueStrengths.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium mb-4">Your Intersectional Strengths</h4>
          <div className="space-y-2">
            {experience.uniqueStrengths.map((strength, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-green-500">✨</span>
                <p className="text-green-900">{strength}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Support Needs */}
      {experience.supportNeeds.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium mb-4">Your Support Needs</h4>
          <p className="text-gray-600 mb-3">
            Knowing what you need is the first step to getting it:
          </p>
          <div className="space-y-2">
            {experience.supportNeeds.map((need, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-blue-500">🤝</span>
                <p className="text-blue-900">{need}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// Main Intersectional Wellness Hub Component
export default function IntersectionalWellnessHub({
  userIdentities,
  onIdentityExploration
}: IntersectionalWellnessHubProps) {
  const [currentStep, setCurrentStep] = useState<'explore' | 'insights' | 'resources'>('explore');
  const [selectedIdentities, setSelectedIdentities] = useState<IntersectionalIdentity[]>(userIdentities || []);
  const [experience, setExperience] = useState<IntersectionalExperience | null>(null);
  
  const handleIdentitiesSelected = (identities: IntersectionalIdentity[]) => {
    setSelectedIdentities(identities);
    setCurrentStep('insights');
  };
  
  const handleExperienceMapping = (mappedExperience: IntersectionalExperience) => {
    setExperience(mappedExperience);
    setCurrentStep('resources');
    onIdentityExploration?.(mappedExperience);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium mb-4">Intersectional Wellness Hub</h1>
        <p className="text-xl text-gray-600">
          Celebrating the complexity and beauty of your multifaceted identity
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {[
            { id: 'explore', label: 'Explore', emoji: '🔍' },
            { id: 'insights', label: 'Insights', emoji: '💡' },
            { id: 'resources', label: 'Resources', emoji: '🌟' }
          ].map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                currentStep === step.id
                  ? 'bg-purple-500 text-white'
                  : index < ['explore', 'insights', 'resources'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.emoji}
              </div>
              <span className="ml-2 font-medium">{step.label}</span>
              {index < 2 && (
                <div className="mx-4 w-8 h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Step Content */}
      <Card className="p-8">
        <AnimatePresence mode="wait">
          {currentStep === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <IdentityExplorer onIdentitiesSelected={handleIdentitiesSelected} />
            </motion.div>
          )}
          
          {currentStep === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <IntersectionalInsights 
                identities={selectedIdentities}
                onExperienceMapping={handleExperienceMapping}
              />
            </motion.div>
          )}
          
          {currentStep === 'resources' && experience && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <AffirmationsAndResources 
                identities={selectedIdentities}
                experience={experience}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      {/* Navigation */}
      {currentStep !== 'explore' && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => {
              if (currentStep === 'insights') setCurrentStep('explore');
              if (currentStep === 'resources') setCurrentStep('insights');
            }}
          >
            ← Back
          </Button>
        </div>
      )}
    </div>
  );
}