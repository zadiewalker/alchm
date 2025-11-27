/**
 * ALCHM Community Healing Circles
 * Culturally-responsive collective healing spaces for marginalized communities
 * 
 * Philosophy: "Healing happens in community - we are not meant to carry our burdens alone"
 * 
 * Features:
 * - Anonymous wisdom sharing circles
 * - Cultural healing tradition integration
 * - Identity-affirming community spaces
 * - Intersectional support groups
 * - Ancestor wisdom sharing
 * - Collective resistance and empowerment
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  IntersectionalIdentity, 
  CulturalHealingTradition,
  culturallyInformedKhepera 
} from '@/ai/culturally-informed-khepera';

interface HealingCircle {
  id: string;
  name: string;
  description: string;
  culturalTraditions: string[];
  identityAffirming: string[];
  healingFocus: 'ancestral_wisdom' | 'cultural_identity' | 'community_resistance' | 'intergenerational_healing' | 'chosen_family' | 'spiritual_connection';
  participants: number;
  isOpen: boolean;
  nextSession: Date;
  culturalGuidance: {
    tradition: string;
    attribution: string;
    permissions: string;
    facilitators: string[];
  };
  accessibilityFeatures: string[];
  languagesSupported: string[];
  communityGuidelines: string[];
}

interface WisdomSharing {
  id: string;
  circleId: string;
  wisdom: string;
  culturalContext: string;
  healingTradition?: string;
  ancestralConnection: boolean;
  supportingVoices: number;
  createdAt: Date;
  isAnonymous: boolean;
}

interface CommunityHealingCirclesProps {
  userId: string;
  intersectionalIdentity?: IntersectionalIdentity;
  onJoinCircle?: (circleId: string) => void;
  onShareWisdom?: (wisdom: WisdomSharing) => void;
}

export function CommunityHealingCircles({
  userId,
  intersectionalIdentity,
  onJoinCircle,
  onShareWisdom
}: CommunityHealingCirclesProps) {
  const [healingCircles, setHealingCircles] = useState<HealingCircle[]>([]);
  const [wisdomSharings, setWisdomSharings] = useState<WisdomSharing[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<HealingCircle | null>(null);
  const [newWisdom, setNewWisdom] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState<string>('');

  useEffect(() => {
    initializeHealingCircles();
    loadWisdomSharings();
  }, [intersectionalIdentity]);

  const initializeHealingCircles = () => {
    // Initialize culturally-specific healing circles
    const circles: HealingCircle[] = [
      {
        id: 'black_healing_circle',
        name: 'Ancestral Strength Circle',
        description: 'A space for Black and African diaspora community members to connect with ancestral wisdom and collective strength',
        culturalTraditions: ['african_diaspora', 'ubuntu', 'call_and_response'],
        identityAffirming: ['black', 'african_diaspora', 'afrocaribbean', 'afrolatinx'],
        healingFocus: 'ancestral_wisdom',
        participants: 47,
        isOpen: true,
        nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        culturalGuidance: {
          tradition: 'African Diaspora Community Healing',
          attribution: 'Inspired by African traditional healing practices and Black liberation psychology',
          permissions: 'Developed in partnership with Black Mental Health Alliance',
          facilitators: ['Dr. Keisha Williams (Black Psychologist)', 'Elder Mary Johnson (Community Wisdom Keeper)']
        },
        accessibilityFeatures: ['ASL interpretation', 'closed captions', 'audio-only option', 'mobile accessible'],
        languagesSupported: ['English', 'Spanish', 'French', 'Yoruba'],
        communityGuidelines: [
          'Center Black voices and experiences',
          'Honor ancestral wisdom and knowledge',
          'Maintain confidentiality and trust',
          'Practice cultural humility',
          'Support collective liberation'
        ]
      },
      {
        id: 'lgbtq_chosen_family',
        name: 'Chosen Family Haven',
        description: 'A safe space for LGBTQ+ community members to share experiences, build chosen family bonds, and celebrate authentic selves',
        culturalTraditions: ['queer_lineage', 'chosen_family', 'ball_culture'],
        identityAffirming: ['lgbtq+', 'transgender', 'non_binary', 'queer', 'questioning'],
        healingFocus: 'chosen_family',
        participants: 62,
        isOpen: true,
        nextSession: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        culturalGuidance: {
          tradition: 'LGBTQ+ Community Resilience Practices',
          attribution: 'Rooted in LGBTQ+ liberation history and chosen family wisdom',
          permissions: 'Developed with input from LGBTQ+ elders and community leaders',
          facilitators: ['Alex Rivera (Trans Community Organizer)', 'Jamie Chen (Queer Therapist)']
        },
        accessibilityFeatures: ['pronoun respect', 'trigger warnings', 'content warnings', 'flexible participation'],
        languagesSupported: ['English', 'Spanish', 'ASL'],
        communityGuidelines: [
          'Respect all identities and pronouns',
          'Honor chosen family relationships',
          'Practice consent and boundaries',
          'Celebrate authentic self-expression',
          'Support community liberation'
        ]
      },
      {
        id: 'immigrant_strength_circle',
        name: 'Bridges Between Worlds',
        description: 'A multilingual space for immigrants and refugees to share bicultural navigation experiences and build community strength',
        culturalTraditions: ['multicultural_wisdom', 'intergenerational_knowledge', 'border_crossing_resilience'],
        identityAffirming: ['immigrant', 'refugee', 'first_generation', 'undocumented', 'bicultural'],
        healingFocus: 'cultural_identity',
        participants: 38,
        isOpen: true,
        nextSession: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        culturalGuidance: {
          tradition: 'Multicultural Community Resilience',
          attribution: 'Drawing from diverse immigration experiences and cultural wisdom traditions',
          permissions: 'Created in partnership with immigrant rights organizations',
          facilitators: ['Maria Santos (Immigration Counselor)', 'Ahmed Hassan (Community Navigator)']
        },
        accessibilityFeatures: ['multilingual support', 'interpretation services', 'documentation-safe space'],
        languagesSupported: ['English', 'Spanish', 'Arabic', 'Mandarin', 'French', 'Somali'],
        communityGuidelines: [
          'Honor all cultural backgrounds',
          'Respect documentation status privacy',
          'Share resources and mutual aid',
          'Practice cultural exchange',
          'Build bridges between communities'
        ]
      },
      {
        id: 'neurodivergent_sanctuary',
        name: 'Neurodivergent Sanctuary',
        description: 'A sensory-friendly space for neurodivergent community members to share experiences and celebrate cognitive diversity',
        culturalTraditions: ['neurodiversity_affirmation', 'spoon_theory', 'stimming_celebration'],
        identityAffirming: ['autistic', 'adhd', 'neurodivergent', 'learning_differences', 'sensory_processing'],
        healingFocus: 'community_resistance',
        participants: 29,
        isOpen: true,
        nextSession: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        culturalGuidance: {
          tradition: 'Neurodiversity Affirmation Movement',
          attribution: 'Rooted in disability justice and neurodiversity advocacy',
          permissions: 'Developed by and for neurodivergent community members',
          facilitators: ['Sam Park (Autistic Advocate)', 'Dr. Riley Thompson (ADHD Specialist)']
        },
        accessibilityFeatures: ['low sensory options', 'fidget-friendly', 'processing time', 'multiple communication styles'],
        languagesSupported: ['English', 'ASL', 'AAC devices supported'],
        communityGuidelines: [
          'Respect all neurotypes and communication styles',
          'Honor sensory needs and boundaries',
          'Celebrate stims and self-regulation',
          'Practice patience and accommodation',
          'Advocate for neurodiversity acceptance'
        ]
      },
      {
        id: 'indigenous_land_connection',
        name: 'Land and Ancestors Circle',
        description: 'A sacred space for Indigenous community members to connect with traditional knowledge and land-based healing (Indigenous-led only)',
        culturalTraditions: ['talking_circles', 'land_based_healing', 'ancestral_connection'],
        identityAffirming: ['indigenous', 'native_american', 'first_nations', 'aboriginal', 'tribal'],
        healingFocus: 'spiritual_connection',
        participants: 18,
        isOpen: false, // Requires Indigenous identity verification
        nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        culturalGuidance: {
          tradition: 'Indigenous Traditional Healing Practices',
          attribution: 'Led by Indigenous knowledge keepers and elders',
          permissions: 'Requires permission from tribal councils and Indigenous facilitators',
          facilitators: ['Elder Joseph Crow Feather (Lakota)', 'Dr. Sarah Littlewolf (Indigenous Psychologist)']
        },
        accessibilityFeatures: ['ceremonial protocols respected', 'land-based when possible', 'culturally appropriate'],
        languagesSupported: ['English', 'Lakota', 'Navajo', 'Ojibwe'],
        communityGuidelines: [
          'Indigenous identity required for participation',
          'Respect sacred protocols and traditions',
          'Honor the land and all relations',
          'Maintain ceremonial confidentiality',
          'Support Indigenous sovereignty'
        ]
      }
    ];

    // Filter circles based on user's intersectional identity
    const relevantCircles = intersectionalIdentity ? 
      circles.filter(circle => {
        return circle.identityAffirming.some(identity => 
          intersectionalIdentity.identityDimensions.racialEthnicIdentity.primary.includes(identity) ||
          intersectionalIdentity.identityDimensions.genderSexualIdentity.genderIdentity.includes(identity) ||
          intersectionalIdentity.identityDimensions.genderSexualIdentity.sexualOrientation.includes(identity) ||
          intersectionalIdentity.identityDimensions.neurodiversityProfile.neurodivergentIdentities.includes(identity) ||
          intersectionalIdentity.identityDimensions.immigrationExperience.immigrantStatus.includes(identity)
        );
      }) : circles;

    setHealingCircles(relevantCircles);
  };

  const loadWisdomSharings = () => {
    // Load anonymous wisdom sharings from community
    const mockWisdom: WisdomSharing[] = [
      {
        id: 'wisdom_1',
        circleId: 'black_healing_circle',
        wisdom: 'My grandmother always said "when the roots of a tree go deep, the storm cannot shake it." I am learning that my ancestors\' strength flows through me, even in the hardest moments.',
        culturalContext: 'African American family wisdom',
        healingTradition: 'ancestral_wisdom',
        ancestralConnection: true,
        supportingVoices: 23,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isAnonymous: true
      },
      {
        id: 'wisdom_2',
        circleId: 'lgbtq_chosen_family',
        wisdom: 'Coming out to my chosen family felt like coming home to myself. They saw me before I could even see myself clearly. That\'s the magic of chosen family - they choose to love all of you.',
        culturalContext: 'LGBTQ+ chosen family experience',
        healingTradition: 'chosen_family',
        ancestralConnection: false,
        supportingVoices: 47,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isAnonymous: true
      },
      {
        id: 'wisdom_3',
        circleId: 'immigrant_strength_circle',
        wisdom: 'I carry two worlds in my heart - the homeland in my memory and the new land under my feet. Both are home. Both are me. I am not torn between them; I am enriched by them.',
        culturalContext: 'Bicultural immigrant experience',
        healingTradition: 'multicultural_wisdom',
        ancestralConnection: true,
        supportingVoices: 31,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isAnonymous: true
      }
    ];

    setWisdomSharings(mockWisdom);
  };

  const handleJoinCircle = (circle: HealingCircle) => {
    setSelectedCircle(circle);
    onJoinCircle?.(circle.id);
  };

  const handleShareWisdom = async () => {
    if (!newWisdom.trim() || !selectedCircle) return;

    setIsSharing(true);

    const wisdom: WisdomSharing = {
      id: `wisdom_${Date.now()}`,
      circleId: selectedCircle.id,
      wisdom: newWisdom,
      culturalContext: selectedTradition || 'personal experience',
      healingTradition: selectedTradition,
      ancestralConnection: selectedTradition.includes('ancestral'),
      supportingVoices: 0,
      createdAt: new Date(),
      isAnonymous: true
    };

    setWisdomSharings(prev => [wisdom, ...prev]);
    setNewWisdom('');
    setSelectedTradition('');
    onShareWisdom?.(wisdom);
    setIsSharing(false);
  };

  const renderHealingCircle = (circle: HealingCircle) => (
    <div key={circle.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{circle.name}</h3>
          <p className="text-gray-600 mb-3">{circle.description}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            {circle.participants} members
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Cultural Traditions Honored:</h4>
        <div className="flex flex-wrap gap-2">
          {circle.culturalTraditions.map(tradition => (
            <span key={tradition} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
              {tradition.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Identity-Affirming For:</h4>
        <div className="flex flex-wrap gap-2">
          {circle.identityAffirming.map(identity => (
            <span key={identity} className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-sm">
              {identity.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Cultural Guidance:</h4>
        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600 mb-1">
            <strong>Tradition:</strong> {circle.culturalGuidance.tradition}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Attribution:</strong> {circle.culturalGuidance.attribution}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Facilitators:</strong> {circle.culturalGuidance.facilitators.join(', ')}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Accessibility & Languages:</h4>
        <div className="text-sm text-gray-600">
          <p><strong>Accessibility:</strong> {circle.accessibilityFeatures.join(', ')}</p>
          <p><strong>Languages:</strong> {circle.languagesSupported.join(', ')}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Next session: {circle.nextSession.toLocaleDateString()}
        </div>
        <button
          onClick={() => handleJoinCircle(circle)}
          disabled={!circle.isOpen}
          className={`px-4 py-2 rounded font-medium ${
            circle.isOpen
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {circle.isOpen ? 'Join Circle' : 'Invitation Only'}
        </button>
      </div>
    </div>
  );

  const renderWisdomSharing = (wisdom: WisdomSharing) => (
    <div key={wisdom.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 mb-4">
      <div className="mb-4">
        <p className="text-gray-800 italic text-lg leading-relaxed">"{wisdom.wisdom}"</p>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div>
          <span className="font-medium">Cultural Context:</span> {wisdom.culturalContext}
          {wisdom.healingTradition && (
            <span className="ml-4">
              <span className="font-medium">Tradition:</span> {wisdom.healingTradition.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {wisdom.ancestralConnection && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
              Ancestral Wisdom
            </span>
          )}
          <span>{wisdom.supportingVoices} supporting voices</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-800 mb-4">Community Healing Circles</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Culturally-responsive spaces where healing happens in community. These circles honor diverse 
          healing traditions while creating safe, identity-affirming spaces for marginalized communities 
          to share wisdom, build connection, and support collective liberation.
        </p>
      </div>

      {/* Cultural Safety Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <h3 className="font-medium text-blue-800 mb-2">Cultural Safety & Community Guidelines</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• All healing traditions are honored with proper attribution and community permissions</li>
          <li>• Facilitators are community members and cultural practitioners</li>
          <li>• Revenue sharing supports community-led healing initiatives</li>
          <li>• Spaces are designed by and for the communities they serve</li>
          <li>• Ongoing cultural competency education for all platform staff</li>
        </ul>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Healing Circles */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">Available Healing Circles</h2>
          <div className="space-y-6">
            {healingCircles.map(renderHealingCircle)}
          </div>
        </div>

        {/* Community Wisdom Sharing */}
        <div>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">Community Wisdom Sharing</h2>
          
          {selectedCircle && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-medium text-gray-800 mb-4">Share Your Wisdom</h3>
              <p className="text-sm text-gray-600 mb-4">
                Sharing in: <strong>{selectedCircle.name}</strong>
              </p>
              
              <textarea
                value={newWisdom}
                onChange={(e) => setNewWisdom(e.target.value)}
                placeholder="Share your wisdom, experience, or insight that might help others in this community..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="mt-4">
                <select
                  value={selectedTradition}
                  onChange={(e) => setSelectedTradition(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                >
                  <option value="">Select cultural context (optional)</option>
                  <option value="ancestral_wisdom">Ancestral Wisdom</option>
                  <option value="family_tradition">Family Tradition</option>
                  <option value="community_teaching">Community Teaching</option>
                  <option value="personal_experience">Personal Experience</option>
                  <option value="spiritual_insight">Spiritual Insight</option>
                </select>
              </div>
              
              <button
                onClick={handleShareWisdom}
                disabled={!newWisdom.trim() || isSharing}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isSharing ? 'Sharing...' : 'Share Anonymously'}
              </button>
            </div>
          )}

          <div>
            <h3 className="font-medium text-gray-800 mb-4">Recent Community Wisdom</h3>
            {wisdomSharings.length > 0 ? (
              wisdomSharings.map(renderWisdomSharing)
            ) : (
              <p className="text-gray-500 text-center py-8">
                No wisdom shared yet. Be the first to share your insights with the community.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityHealingCircles;