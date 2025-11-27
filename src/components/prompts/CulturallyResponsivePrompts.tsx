/**
 * ALCHM Culturally-Responsive Prompts System
 * Adaptive journaling prompts that honor diverse cultural experiences and identities
 * 
 * Philosophy: "Every culture has wisdom about healing - prompts should reflect this diversity"
 * 
 * Features:
 * - Intersectional identity-aware prompt generation
 * - Culturally-specific emotional vocabulary
 * - Community and chosen family recognition
 * - Economic justice and systemic oppression awareness
 * - Neurodiversity and accessibility accommodations
 * - Healing traditions integration (with proper attribution)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  IntersectionalIdentity, 
  CulturalHealingTradition,
  culturallyInformedKhepera 
} from '@/ai/culturally-informed-khepera';

interface CulturalPrompt {
  id: string;
  category: 'identity_affirmation' | 'cultural_navigation' | 'community_healing' | 'ancestral_wisdom' | 'systemic_awareness' | 'chosen_family' | 'intersectional_strength';
  prompt: string;
  culturalContext: string[];
  identityAffirming: string[];
  healingTradition?: string;
  accessibilityNotes?: string[];
  languageAdaptations: Record<string, string>;
  communityOriented: boolean;
  traumaInformed: boolean;
  attribution?: string;
  safetyConsiderations: string[];
}

interface CulturallyResponsivePromptsProps {
  intersectionalIdentity?: IntersectionalIdentity;
  onPromptSelected?: (prompt: CulturalPrompt) => void;
  userLanguage?: string;
  accessibilityNeeds?: string[];
}

export function CulturallyResponsivePrompts({
  intersectionalIdentity,
  onPromptSelected,
  userLanguage = 'en',
  accessibilityNeeds = []
}: CulturallyResponsivePromptsProps) {
  const [availablePrompts, setAvailablePrompts] = useState<CulturalPrompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredPrompts, setFilteredPrompts] = useState<CulturalPrompt[]>([]);

  useEffect(() => {
    initializeCulturalPrompts();
  }, [intersectionalIdentity]);

  useEffect(() => {
    filterPrompts();
  }, [availablePrompts, selectedCategory]);

  const initializeCulturalPrompts = () => {
    const allPrompts: CulturalPrompt[] = [
      // Black/African Diaspora Identity Affirmation
      {
        id: 'ancestral_strength_reflection',
        category: 'ancestral_wisdom',
        prompt: 'What ancestral strength do you carry within you today? How do the struggles and triumphs of those who came before you show up in your own resilience?',
        culturalContext: ['african_diaspora', 'black_american', 'caribbean', 'african'],
        identityAffirming: ['black', 'african_diaspora'],
        healingTradition: 'african_diaspora_healing',
        languageAdaptations: {
          'en': 'What ancestral strength do you carry within you today?',
          'es': '¿Qué fuerza ancestral llevas dentro de ti hoy?',
          'fr': 'Quelle force ancestrale portez-vous en vous aujourd\'hui?'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Inspired by African concepts of ancestral connection and Ubuntu philosophy',
        safetyConsiderations: ['Acknowledge historical trauma', 'Honor cultural resilience', 'Validate discrimination experiences']
      },
      {
        id: 'melanin_magic_celebration',
        category: 'identity_affirmation',
        prompt: 'How does your Blackness show up as magic in your life today? What beauty, creativity, or strength flows through your melanin-rich existence?',
        culturalContext: ['black_identity', 'melanin_positivity', 'afrocentric'],
        identityAffirming: ['black', 'african_diaspora'],
        languageAdaptations: {
          'en': 'How does your Blackness show up as magic in your life today?',
          'es': '¿Cómo se manifiesta tu negritud como magia en tu vida hoy?'
        },
        communityOriented: false,
        traumaInformed: true,
        attribution: 'Rooted in Black self-love and afrocentric beauty movements',
        safetyConsiderations: ['Celebrate Black identity', 'Counter negative stereotypes', 'Affirm inherent worth']
      },

      // LGBTQ+ Identity and Chosen Family
      {
        id: 'chosen_family_gratitude',
        category: 'chosen_family',
        prompt: 'Who are the people who see and celebrate all of you? Reflect on your chosen family - the souls who choose to love you exactly as you are.',
        culturalContext: ['lgbtq+', 'chosen_family', 'queer_community'],
        identityAffirming: ['lgbtq+', 'queer', 'trans', 'non_binary', 'gay', 'lesbian', 'bisexual'],
        languageAdaptations: {
          'en': 'Who are the people who see and celebrate all of you?',
          'es': '¿Quiénes son las personas que te ven y celebran tal como eres?'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Rooted in LGBTQ+ community traditions of chosen family and mutual support',
        safetyConsiderations: ['Validate chosen family relationships', 'May trigger family rejection trauma', 'Honor authentic self-expression']
      },
      {
        id: 'authenticity_journey',
        category: 'identity_affirmation',
        prompt: 'What does coming home to yourself feel like? Explore the journey of becoming more authentically you, one brave moment at a time.',
        culturalContext: ['lgbtq+', 'gender_identity', 'sexual_orientation', 'authenticity'],
        identityAffirming: ['lgbtq+', 'questioning', 'exploring'],
        languageAdaptations: {
          'en': 'What does coming home to yourself feel like?',
          'es': '¿Cómo se siente regresar a casa contigo mismo/a/e?'
        },
        communityOriented: false,
        traumaInformed: true,
        attribution: 'Inspired by LGBTQ+ narratives of self-discovery and authentic living',
        safetyConsiderations: ['Support identity exploration', 'Respect questioning process', 'Validate authentic expression']
      },

      // Immigration and Cultural Navigation
      {
        id: 'bicultural_bridges',
        category: 'cultural_navigation',
        prompt: 'You are a bridge between worlds. How do you honor both your homeland in your heart and the new ground beneath your feet?',
        culturalContext: ['immigrant', 'bicultural', 'multicultural', 'diaspora'],
        identityAffirming: ['immigrant', 'first_generation', 'second_generation', 'refugee'],
        languageAdaptations: {
          'en': 'You are a bridge between worlds.',
          'es': 'Eres un puente entre mundos.',
          'ar': 'أنت جسر بين العوالم',
          'zh': '你是世界之间的桥梁'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Honoring the experiences of immigrant and refugee communities',
        safetyConsiderations: ['Acknowledge acculturation stress', 'Validate identity conflicts', 'Honor multiple belongings']
      },
      {
        id: 'code_switching_strength',
        category: 'cultural_navigation',
        prompt: 'Code-switching is a superpower. How do you adapt and flow between different cultural spaces while keeping your core self intact?',
        culturalContext: ['code_switching', 'multicultural_navigation', 'adaptive_identity'],
        identityAffirming: ['bicultural', 'multilingual', 'multicultural'],
        languageAdaptations: {
          'en': 'Code-switching is a superpower.',
          'es': 'El cambio de código es un superpoder.'
        },
        communityOriented: false,
        traumaInformed: true,
        attribution: 'Recognizing the skill and resilience in cultural code-switching',
        safetyConsiderations: ['Validate adaptive strategies', 'Acknowledge cultural fatigue', 'Celebrate linguistic abilities']
      },

      // Neurodiversity and Disability Justice
      {
        id: 'neurodivergent_gifts',
        category: 'identity_affirmation',
        prompt: 'Your neurodivergent brain is beautifully unique. What gifts does your neurotype bring to the world? How does your mind\'s different wiring create magic?',
        culturalContext: ['neurodiversity', 'autism', 'adhd', 'disability_justice'],
        identityAffirming: ['autistic', 'adhd', 'neurodivergent', 'learning_differences'],
        accessibilityNotes: ['Literal language preferred', 'Clear structure', 'No metaphors that might confuse'],
        languageAdaptations: {
          'en': 'Your neurodivergent brain is beautifully unique.',
          'es': 'Tu cerebro neurodivergente es hermosamente único.'
        },
        communityOriented: false,
        traumaInformed: true,
        attribution: 'Rooted in neurodiversity affirmation and disability justice movements',
        safetyConsiderations: ['Avoid deficit language', 'Celebrate neurological differences', 'Counter ableist messaging']
      },
      {
        id: 'stim_celebration',
        category: 'identity_affirmation',
        prompt: 'Stimming is self-regulation, not something to hide. What movements, sounds, or sensations help your nervous system feel calm and centered?',
        culturalContext: ['autism', 'sensory_processing', 'self_regulation'],
        identityAffirming: ['autistic', 'sensory_processing_differences'],
        accessibilityNotes: ['Sensory-friendly language', 'Validate stimming behaviors'],
        languageAdaptations: {
          'en': 'Stimming is self-regulation, not something to hide.',
          'es': 'El stimming es autorregulación, no algo que esconder.'
        },
        communityOriented: false,
        traumaInformed: true,
        attribution: 'Supporting autistic self-advocacy and sensory acceptance',
        safetyConsiderations: ['Validate stimming needs', 'Counter masking pressure', 'Support sensory autonomy']
      },

      // Economic Justice and Class Awareness
      {
        id: 'resourcefulness_resilience',
        category: 'systemic_awareness',
        prompt: 'Your worth is not measured by your bank account. How do you find abundance and create beauty even when resources are scarce?',
        culturalContext: ['economic_justice', 'working_class', 'poverty_resilience'],
        identityAffirming: ['working_class', 'economic_insecurity', 'resourceful'],
        languageAdaptations: {
          'en': 'Your worth is not measured by your bank account.',
          'es': 'Tu valor no se mide por tu cuenta bancaria.'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Honoring working-class wisdom and economic resilience',
        safetyConsiderations: ['Validate economic stress', 'Avoid money shame', 'Recognize systemic barriers']
      },
      {
        id: 'class_navigation',
        category: 'systemic_awareness',
        prompt: 'Navigating different class spaces can be exhausting. How do you honor your roots while moving through spaces that weren\'t built for people like you?',
        culturalContext: ['class_mobility', 'first_generation_professional', 'class_consciousness'],
        identityAffirming: ['first_generation_college', 'class_mobile', 'working_class_roots'],
        languageAdaptations: {
          'en': 'Navigating different class spaces can be exhausting.',
          'es': 'Navegar diferentes espacios de clase puede ser agotador.'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Recognizing the complexity of class mobility and identity',
        safetyConsiderations: ['Validate imposter syndrome', 'Honor class origins', 'Acknowledge systemic barriers']
      },

      // Intersectional Strength and Resistance
      {
        id: 'intersectional_power',
        category: 'intersectional_strength',
        prompt: 'You hold multiple identities, and each one adds power to who you are. How do your various identity pieces create a unique whole that the world needs?',
        culturalContext: ['intersectionality', 'multiple_identities', 'complex_belonging'],
        identityAffirming: ['multiracial', 'lgbtq+_poc', 'immigrant_queer', 'neurodivergent_poc'],
        languageAdaptations: {
          'en': 'You hold multiple identities, and each one adds power to who you are.',
          'es': 'Tienes múltiples identidades, y cada una añade poder a quien eres.'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Celebrating intersectional identity complexity and strength',
        safetyConsiderations: ['Validate identity complexity', 'Counter single-story narratives', 'Honor multiple belongings']
      },
      {
        id: 'resistance_as_healing',
        category: 'systemic_awareness',
        prompt: 'Your resistance to oppression is a form of healing - for yourself and your community. How does fighting for justice feed your soul?',
        culturalContext: ['social_justice', 'community_organizing', 'resistance_healing'],
        identityAffirming: ['activist', 'organizer', 'change_maker'],
        languageAdaptations: {
          'en': 'Your resistance to oppression is a form of healing.',
          'es': 'Tu resistencia a la opresión es una forma de sanación.'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Rooted in liberation psychology and community organizing traditions',
        safetyConsiderations: ['Validate activist fatigue', 'Support sustainable resistance', 'Honor collective healing']
      },

      // Community and Collective Healing
      {
        id: 'community_medicine',
        category: 'community_healing',
        prompt: 'Your community is medicine. How do the people around you help you heal? How do you contribute to the collective healing of your communities?',
        culturalContext: ['community_healing', 'collective_wellness', 'mutual_aid'],
        identityAffirming: ['community_oriented', 'collective_focused'],
        languageAdaptations: {
          'en': 'Your community is medicine.',
          'es': 'Tu comunidad es medicina.',
          'ko': '당신의 공동체는 약입니다'
        },
        communityOriented: true,
        traumaInformed: true,
        attribution: 'Inspired by community-centered healing traditions worldwide',
        safetyConsiderations: ['Validate community importance', 'Support collective healing', 'Honor interdependence']
      }
    ];

    // Filter prompts based on user's intersectional identity
    const relevantPrompts = intersectionalIdentity ? 
      allPrompts.filter(prompt => {
        // Check if prompt affirms any of the user's identities
        const hasRelevantIdentity = prompt.identityAffirming.some(identity => {
          return (
            intersectionalIdentity.identityDimensions.racialEthnicIdentity.primary.some(id => id.includes(identity)) ||
            intersectionalIdentity.identityDimensions.genderSexualIdentity.genderIdentity.includes(identity) ||
            intersectionalIdentity.identityDimensions.genderSexualIdentity.sexualOrientation.includes(identity) ||
            intersectionalIdentity.identityDimensions.neurodiversityProfile.neurodivergentIdentities.includes(identity) ||
            intersectionalIdentity.identityDimensions.economicIdentity.classBackground === identity ||
            intersectionalIdentity.identityDimensions.immigrationExperience.immigrantStatus.includes(identity)
          );
        });

        // Also include community-oriented prompts if user values community
        const isRelevantForCommunityFocus = prompt.communityOriented && 
          (intersectionalIdentity.identityDimensions.racialEthnicIdentity.primary.some(id => 
            ['black', 'latina', 'indigenous', 'asian'].includes(id)
          ) || intersectionalIdentity.identityDimensions.immigrationExperience.immigrantStatus !== 'not_applicable');

        return hasRelevantIdentity || isRelevantForCommunityFocus;
      }) : allPrompts;

    setAvailablePrompts(relevantPrompts);
  };

  const filterPrompts = () => {
    if (selectedCategory === 'all') {
      setFilteredPrompts(availablePrompts);
    } else {
      setFilteredPrompts(availablePrompts.filter(prompt => prompt.category === selectedCategory));
    }
  };

  const handlePromptSelection = (prompt: CulturalPrompt) => {
    onPromptSelected?.(prompt);
  };

  const getPromptText = (prompt: CulturalPrompt): string => {
    return prompt.languageAdaptations[userLanguage] || prompt.prompt;
  };

  const getCategoryDisplayName = (category: string): string => {
    const categoryNames: Record<string, string> = {
      'all': 'All Prompts',
      'identity_affirmation': 'Identity Affirmation',
      'cultural_navigation': 'Cultural Navigation',
      'community_healing': 'Community Healing',
      'ancestral_wisdom': 'Ancestral Wisdom',
      'systemic_awareness': 'Systemic Awareness',
      'chosen_family': 'Chosen Family',
      'intersectional_strength': 'Intersectional Strength'
    };
    return categoryNames[category] || category;
  };

  const renderPromptCard = (prompt: CulturalPrompt) => (
    <div 
      key={prompt.id} 
      className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => handlePromptSelection(prompt)}
    >
      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">
            {getCategoryDisplayName(prompt.category)}
          </span>
          {prompt.communityOriented && (
            <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
              Community-Oriented
            </span>
          )}
        </div>
        
        <p className="text-gray-800 text-lg leading-relaxed">
          {getPromptText(prompt)}
        </p>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-gray-700 mb-2">Cultural Context:</h4>
        <div className="flex flex-wrap gap-2">
          {prompt.culturalContext.map(context => (
            <span key={context} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
              {context.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h4 className="font-medium text-gray-700 mb-2">Identity-Affirming For:</h4>
        <div className="flex flex-wrap gap-2">
          {prompt.identityAffirming.map(identity => (
            <span key={identity} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
              {identity.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {prompt.attribution && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 italic">
            <strong>Attribution:</strong> {prompt.attribution}
          </p>
        </div>
      )}

      {prompt.accessibilityNotes && prompt.accessibilityNotes.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-gray-700 mb-1">Accessibility Notes:</h4>
          <ul className="text-xs text-gray-600">
            {prompt.accessibilityNotes.map((note, index) => (
              <li key={index}>• {note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          {prompt.traumaInformed && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              Trauma-Informed
            </span>
          )}
        </div>
        <span>Click to use this prompt</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Culturally-Responsive Prompts</h1>
        <p className="text-lg text-gray-600">
          Journaling prompts that honor your intersectional identity and cultural wisdom. 
          These prompts are designed to affirm who you are while supporting your healing journey.
        </p>
      </div>

      {/* Cultural Safety Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Cultural Responsiveness & Safety</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Prompts are developed with input from community members and cultural practitioners</li>
          <li>• All cultural references include proper attribution and respect cultural origins</li>
          <li>• Trauma-informed design acknowledges systemic oppression and historical trauma</li>
          <li>• Identity-affirming language celebrates rather than pathologizes differences</li>
        </ul>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Filter by Category:</h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'identity_affirmation', 'cultural_navigation', 'community_healing', 'ancestral_wisdom', 'systemic_awareness', 'chosen_family', 'intersectional_strength'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getCategoryDisplayName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6">
        {filteredPrompts.length > 0 ? (
          filteredPrompts.map(renderPromptCard)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No prompts found for the selected category. Try selecting "All Prompts" or a different category.
            </p>
          </div>
        )}
      </div>

      {/* Cultural Attribution Footer */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-800 mb-3">Cultural Acknowledgments</h3>
        <p className="text-sm text-gray-600 mb-2">
          These prompts are created with deep respect for the wisdom traditions of marginalized communities. 
          We acknowledge the sources of cultural knowledge and commit to supporting community-led healing initiatives.
        </p>
        <p className="text-sm text-gray-600">
          Revenue from this platform supports community organizations, cultural practitioners, and healing justice movements.
        </p>
      </div>
    </div>
  );
}

export default CulturallyResponsivePrompts;