/**
 * ALCHM Community Wisdom Sharing System with Appropriation Safeguards
 * 
 * Philosophy: "Cultural wisdom belongs to communities, not individuals to extract.
 * True sharing honors the source, asks permission, offers reciprocity,
 * and ensures benefits flow back to originating communities."
 * 
 * This system provides:
 * - Community-controlled sharing of cultural wisdom
 * - Rigorous appropriation prevention protocols
 * - Attribution and reciprocity systems
 * - Sacred practice protection
 * - Intergenerational knowledge preservation
 * - Benefit-sharing with originating communities
 * - Education about cultural respect and boundaries
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CulturalWisdom {
  id: string;
  title: string;
  description: string;
  cultural_origin: {
    community: string;
    specific_tradition?: string;
    knowledge_keeper?: string;
  };
  sharing_permissions: {
    shareable_outside_community: boolean;
    requires_community_context: boolean;
    adaptation_allowed: boolean;
    commercial_use_prohibited: boolean;
    sacred_or_closed: boolean;
  };
  attribution_requirements: {
    source_community: string;
    knowledge_keeper_credit?: string;
    citation_format: string;
    reciprocity_suggestions: string[];
  };
  educational_context: {
    why_shared: string;
    respectful_use_guidelines: string[];
    what_not_to_do: string[];
    deeper_learning_resources: string[];
  };
  verification: {
    verified_by_community: boolean;
    verification_date?: Date;
    verifying_organization?: string;
    community_consent_level: 'full' | 'conditional' | 'educational_only' | 'not_verified';
  };
  category: 'healing_practice' | 'wisdom_teaching' | 'cultural_concept' | 'community_value' | 'historical_context';
}

interface CommunityMember {
  user_id: string;
  cultural_identities: string[];
  community_roles: string[]; // elder, knowledge_keeper, cultural_educator, etc.
  sharing_permissions: {
    can_share_from_communities: string[];
    can_verify_wisdom: boolean;
    can_moderate_sharing: boolean;
  };
  verification_status: {
    identity_verified: boolean;
    community_endorsed: boolean;
    knowledge_keeper_status: boolean;
  };
}

interface SharingRequest {
  wisdom_id: string;
  requester_id: string;
  intended_use: string;
  cultural_background: string[];
  reciprocity_plan: string;
  community_benefit: string;
  status: 'pending' | 'approved' | 'denied' | 'needs_modification';
  community_feedback: string[];
}

export default function CommunityWisdomSharingSystem() {
  const [availableWisdom, setAvailableWisdom] = useState<CulturalWisdom[]>([]);
  const [selectedWisdom, setSelectedWisdom] = useState<CulturalWisdom | null>(null);
  const [showSharingGuidelines, setShowSharingGuidelines] = useState(false);
  const [appropriationAlert, setAppropriationAlert] = useState<string | null>(null);

  const culturalWisdomDatabase: CulturalWisdom[] = [
    {
      id: 'ubuntu_philosophy',
      title: 'Ubuntu: "I am because we are"',
      description: 'Ubuntu is an African philosophy that emphasizes our interconnectedness and shared humanity. It teaches that individual well-being is inseparable from community well-being.',
      cultural_origin: {
        community: 'Various African cultures, particularly South African',
        specific_tradition: 'Nguni Bantu philosophy',
        knowledge_keeper: 'Elder councils and Ubuntu practitioners'
      },
      sharing_permissions: {
        shareable_outside_community: true,
        requires_community_context: true,
        adaptation_allowed: false,
        commercial_use_prohibited: true,
        sacred_or_closed: false
      },
      attribution_requirements: {
        source_community: 'African Ubuntu philosophy',
        citation_format: 'Ubuntu philosophy from African Nguni Bantu traditions',
        reciprocity_suggestions: [
          'Support African-led organizations and businesses',
          'Learn about African history and contemporary issues',
          'Advocate against anti-African racism',
          'Support Ubuntu educational initiatives'
        ]
      },
      educational_context: {
        why_shared: 'Ubuntu offers profound wisdom about interconnection that can help heal individualistic thinking, but it must be understood within its African context.',
        respectful_use_guidelines: [
          'Always attribute to African origins',
          'Learn about the broader African context',
          'Don\'t commercialize or trademark the concept',
          'Connect Ubuntu to contemporary African issues',
          'Support African Ubuntu educators and organizations'
        ],
        what_not_to_do: [
          'Don\'t claim it as universal without African attribution',
          'Don\'t use it to sell products or services',
          'Don\'t strip it of its African identity',
          'Don\'t ignore contemporary African struggles',
          'Don\'t present it as "ancient wisdom" without modern context'
        ],
        deeper_learning_resources: [
          'Books by African Ubuntu scholars',
          'Ubuntu Research Centre',
          'African philosophy courses',
          'Contemporary African Ubuntu practitioners'
        ]
      },
      verification: {
        verified_by_community: true,
        verification_date: new Date('2023-01-15'),
        verifying_organization: 'African Philosophy Network',
        community_consent_level: 'educational_only'
      },
      category: 'wisdom_teaching'
    },
    {
      id: 'indigenous_land_connection',
      title: 'Land as First Teacher',
      description: 'Many Indigenous traditions recognize the land as our first teacher and source of wisdom. This understanding sees humans as part of nature, not separate from it.',
      cultural_origin: {
        community: 'Various Indigenous nations globally',
        specific_tradition: 'Universal Indigenous concept with nation-specific expressions'
      },
      sharing_permissions: {
        shareable_outside_community: true,
        requires_community_context: true,
        adaptation_allowed: false,
        commercial_use_prohibited: true,
        sacred_or_closed: false
      },
      attribution_requirements: {
        source_community: 'Indigenous wisdom traditions',
        citation_format: 'Indigenous land-based wisdom (specific nations when known)',
        reciprocity_suggestions: [
          'Learn whose land you live on',
          'Support Indigenous land rights',
          'Follow Indigenous environmental activists',
          'Buy from Indigenous businesses',
          'Support Indigenous-led environmental organizations'
        ]
      },
      educational_context: {
        why_shared: 'This concept can help heal human-nature disconnection, but it must be understood as Indigenous wisdom, not "universal truth."',
        respectful_use_guidelines: [
          'Always attribute to Indigenous origins',
          'Learn about local Indigenous history',
          'Support Indigenous land rights',
          'Don\'t appropriate specific ceremonies',
          'Connect to contemporary Indigenous issues'
        ],
        what_not_to_do: [
          'Don\'t present as "ancient wisdom" without Indigenous attribution',
          'Don\'t use to sell nature retreats or products',
          'Don\'t appropriate specific sacred practices',
          'Don\'t ignore ongoing colonialism',
          'Don\'t romanticisize Indigenous peoples'
        ],
        deeper_learning_resources: [
          'Native-Land.ca',
          'Indigenous environmental organizations',
          'Books by Indigenous authors',
          'Indigenous-led educational programs'
        ]
      },
      verification: {
        verified_by_community: true,
        community_consent_level: 'educational_only'
      },
      category: 'wisdom_teaching'
    },
    {
      id: 'curanderismo_concept',
      title: 'Curanderismo: Community-Based Healing',
      description: 'Curanderismo is a traditional healing system from Mexico and Latin America that integrates physical, mental, and spiritual healing within community context.',
      cultural_origin: {
        community: 'Mexican and Latin American communities',
        specific_tradition: 'Traditional Mexican healing system'
      },
      sharing_permissions: {
        shareable_outside_community: false, // Requires practitioner guidance
        requires_community_context: true,
        adaptation_allowed: false,
        commercial_use_prohibited: true,
        sacred_or_closed: true
      },
      attribution_requirements: {
        source_community: 'Mexican and Latin American curanderismo tradition',
        citation_format: 'Curanderismo from Mexican/Latin American healing traditions',
        reciprocity_suggestions: [
          'Support Latinx-led health organizations',
          'Learn about Mexican and Latin American history',
          'Support immigration justice',
          'Buy from Latinx businesses',
          'Advocate against anti-Latinx discrimination'
        ]
      },
      educational_context: {
        why_shared: 'Information about curanderismo helps people understand holistic healing approaches, but practice requires proper training from community elders.',
        respectful_use_guidelines: [
          'Only learn from certified curanderas/os',
          'Understand the cultural and spiritual context',
          'Don\'t practice without proper training',
          'Support traditional practitioners',
          'Learn Spanish if engaging deeply'
        ],
        what_not_to_do: [
          'Don\'t practice curanderismo without proper training',
          'Don\'t commercialize sacred practices',
          'Don\'t strip cultural context',
          'Don\'t appropriate specific rituals or ceremonies',
          'Don\'t present as "alternative medicine" without cultural context'
        ],
        deeper_learning_resources: [
          'Certified curandera/o training programs',
          'Mexican healing traditions courses',
          'Latinx cultural centers',
          'Traditional medicine research by Latinx scholars'
        ]
      },
      verification: {
        verified_by_community: true,
        community_consent_level: 'educational_only'
      },
      category: 'healing_practice'
    }
  ];

  const appropriationWarnings = [
    {
      trigger: ['sage', 'smudging', 'cleansing ceremony'],
      warning: 'Sage burning and smudging are sacred Indigenous practices. White sage is being over-harvested. Consider alternatives like opening windows, using ethically-sourced herbs from your own heritage, or supporting Indigenous-led businesses.'
    },
    {
      trigger: ['chakra', 'chakras', 'kundalini'],
      warning: 'Chakras and Kundalini are from specific Hindu and Buddhist traditions. If you\'re not from these cultures, learn about the proper context and consider how to engage respectfully without appropriating sacred concepts.'
    },
    {
      trigger: ['medicine wheel', 'sacred circle'],
      warning: 'Medicine wheels are sacred to specific Indigenous nations. Using this term or creating similar structures without proper cultural connection and permission is appropriation.'
    },
    {
      trigger: ['spirit animal', 'animal guide'],
      warning: '"Spirit animal" is from specific Indigenous traditions and is often misused. Consider "power animal" or simply "animal that guides me" if you\'re not from cultures that use this concept.'
    }
  ];

  useEffect(() => {
    // Load community-verified wisdom
    setAvailableWisdom(culturalWisdomDatabase.filter(wisdom => 
      wisdom.verification.verified_by_community && 
      wisdom.sharing_permissions.shareable_outside_community
    ));
  }, []);

  const checkForAppropriation = (content: string) => {
    const lowerContent = content.toLowerCase();
    for (const warning of appropriationWarnings) {
      if (warning.trigger.some(trigger => lowerContent.includes(trigger))) {
        setAppropriationAlert(warning.warning);
        setTimeout(() => setAppropriationAlert(null), 8000);
        return;
      }
    }
    setAppropriationAlert(null);
  };

  const WisdomCard = ({ wisdom }: { wisdom: CulturalWisdom }) => (
    <Card 
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        selectedWisdom?.id === wisdom.id ? 'ring-2 ring-green-500 bg-green-50' : 'bg-white hover:bg-green-25'
      }`}
      onClick={() => setSelectedWisdom(wisdom)}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-green-800">{wisdom.title}</h4>
        <div className="flex gap-1">
          {wisdom.verification.verified_by_community && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              ✓ Community Verified
            </span>
          )}
          {wisdom.sharing_permissions.commercial_use_prohibited && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
              Non-Commercial
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm text-green-700 mb-3">{wisdom.description}</p>
      
      <div className="text-xs text-green-600">
        <p><strong>Origin:</strong> {wisdom.cultural_origin.community}</p>
        <p><strong>Sharing:</strong> {wisdom.verification.community_consent_level.replace('_', ' ')}</p>
      </div>
    </Card>
  );

  const AppropriationGuidelines = () => (
    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300">
      <h3 className="text-lg font-medium text-yellow-800 mb-4">
        🛡️ Cultural Appropriation Prevention Guidelines
      </h3>
      
      <div className="space-y-4">
        <div className="bg-yellow-100 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Before Sharing Cultural Wisdom:</h4>
          <ul className="space-y-1 text-sm text-yellow-800">
            <li>• Is this from my own cultural heritage?</li>
            <li>• Do I have permission from the originating community?</li>
            <li>• Am I attributing properly and offering reciprocity?</li>
            <li>• Is this sacred knowledge that shouldn't be shared outside the community?</li>
            <li>• How am I benefiting the originating community?</li>
          </ul>
        </div>
        
        <div className="bg-orange-100 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-2">Red Flags of Appropriation:</h4>
          <ul className="space-y-1 text-sm text-orange-800">
            <li>• Profiting from cultural practices not your own</li>
            <li>• Stripping cultural context from practices</li>
            <li>• Using sacred symbols as aesthetic decoration</li>
            <li>• Presenting as "universal" without cultural attribution</li>
            <li>• Ignoring contemporary struggles of originating communities</li>
          </ul>
        </div>
        
        <div className="bg-green-100 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Respectful Engagement:</h4>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Learn from community members, not internet extraction</li>
            <li>• Support businesses and organizations from originating communities</li>
            <li>• Understand historical and contemporary context</li>
            <li>• Practice cultural humility and continuous learning</li>
            <li>• Use your privilege to amplify community voices</li>
          </ul>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Appropriation Alert System */}
      <AnimatePresence>
        {appropriationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Cultural Appropriation Alert</h4>
                  <p className="text-red-700 text-sm">{appropriationAlert}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-medium text-green-800 mb-2">
              🌍 Community Wisdom Sharing
            </h2>
            <p className="text-green-700">
              Cultural wisdom shared with community permission, proper attribution, and reciprocity.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSharingGuidelines(!showSharingGuidelines)}
            className="text-green-600 border-green-300 hover:bg-green-50"
          >
            📋 Guidelines
          </Button>
        </div>
        
        {showSharingGuidelines && <AppropriationGuidelines />}
      </Card>

      {/* Wisdom Library */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableWisdom.map(wisdom => (
          <WisdomCard key={wisdom.id} wisdom={wisdom} />
        ))}
      </div>

      {/* Selected Wisdom Details */}
      {selectedWisdom && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-white border-green-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-green-800">
                {selectedWisdom.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedWisdom(null)}
                className="text-green-600"
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Description and Context */}
              <div>
                <p className="text-green-800 mb-4">{selectedWisdom.description}</p>
                <p className="text-sm text-green-700">{selectedWisdom.educational_context.why_shared}</p>
              </div>
              
              {/* Attribution */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Attribution & Origin</h4>
                <p className="text-blue-800 mb-2">
                  <strong>Source Community:</strong> {selectedWisdom.attribution_requirements.source_community}
                </p>
                <p className="text-blue-800 mb-2">
                  <strong>Proper Citation:</strong> {selectedWisdom.attribution_requirements.citation_format}
                </p>
                {selectedWisdom.cultural_origin.knowledge_keeper && (
                  <p className="text-blue-800">
                    <strong>Knowledge Keepers:</strong> {selectedWisdom.cultural_origin.knowledge_keeper}
                  </p>
                )}
              </div>
              
              {/* Respectful Use Guidelines */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">How to Engage Respectfully</h4>
                <ul className="space-y-1">
                  {selectedWisdom.educational_context.respectful_use_guidelines.map((guideline, index) => (
                    <li key={index} className="text-green-800 text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* What NOT to Do */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">What NOT to Do</h4>
                <ul className="space-y-1">
                  {selectedWisdom.educational_context.what_not_to_do.map((warning, index) => (
                    <li key={index} className="text-red-800 text-sm flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Reciprocity Suggestions */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2">Ways to Give Back (Reciprocity)</h4>
                <ul className="space-y-1">
                  {selectedWisdom.attribution_requirements.reciprocity_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-purple-800 text-sm flex items-start gap-2">
                      <span className="text-purple-600 mt-1">💝</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Learning Resources */}
              <div className="bg-teal-50 rounded-lg p-4">
                <h4 className="font-medium text-teal-900 mb-2">Deepen Your Learning</h4>
                <ul className="space-y-1">
                  {selectedWisdom.educational_context.deeper_learning_resources.map((resource, index) => (
                    <li key={index} className="text-teal-800 text-sm flex items-start gap-2">
                      <span className="text-teal-600 mt-1">📚</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Verification Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Verification Status</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-800">
                    <strong>Community Verified:</strong> {selectedWisdom.verification.verified_by_community ? 'Yes' : 'No'}
                  </p>
                  <p className="text-gray-800">
                    <strong>Consent Level:</strong> {selectedWisdom.verification.community_consent_level.replace('_', ' ')}
                  </p>
                  {selectedWisdom.verification.verifying_organization && (
                    <p className="text-gray-800">
                      <strong>Verified By:</strong> {selectedWisdom.verification.verifying_organization}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Community Submission Process */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <h3 className="text-lg font-medium text-purple-800 mb-4">
          🤝 Submit Community Wisdom
        </h3>
        
        <p className="text-purple-700 mb-4">
          Are you a cultural knowledge keeper who wants to share wisdom from your community? 
          We have a rigorous process to ensure respectful sharing.
        </p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">1</span>
            <span className="text-sm text-purple-800">Community identity verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">2</span>
            <span className="text-sm text-purple-800">Knowledge keeper status confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">3</span>
            <span className="text-sm text-purple-800">Community consent documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">4</span>
            <span className="text-sm text-purple-800">Reciprocity agreement establishment</span>
          </div>
        </div>
        
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Begin Submission Process
        </Button>
      </Card>

      {/* Search Function with Appropriation Check */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          🔍 Search Cultural Practices (with Appropriation Check)
        </h3>
        
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for cultural practices or wisdom..."
            className="w-full p-3 border rounded-lg"
            onChange={(e) => checkForAppropriation(e.target.value)}
          />
        </div>
        
        <p className="text-sm text-gray-600">
          Our system will alert you if you search for practices that are commonly appropriated 
          and provide guidance on respectful engagement.
        </p>
      </Card>
    </div>
  );
}

/**
 * Cultural Knowledge Keeper Verification System
 */
export function CulturalKnowledgeKeeperVerification() {
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    cultural_identity: '',
    community_role: '',
    knowledge_areas: [] as string[],
    community_endorsement: '',
    reciprocity_commitment: ''
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
      <h3 className="text-lg font-medium text-indigo-800 mb-6">
        🎓 Knowledge Keeper Verification Process
      </h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map(step => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= verificationStep 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(verificationStep / 4) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {verificationStep === 1 && (
          <div>
            <h4 className="font-medium text-indigo-900 mb-4">Step 1: Cultural Identity</h4>
            <p className="text-indigo-700 mb-4">
              Please provide information about your cultural identity and community connection.
            </p>
            <textarea
              className="w-full p-3 border rounded-lg h-24"
              placeholder="Describe your cultural identity, tribal affiliation, community role, and how you came to hold cultural knowledge..."
              value={verificationData.cultural_identity}
              onChange={(e) => setVerificationData(prev => ({ ...prev, cultural_identity: e.target.value }))}
            />
          </div>
        )}
        
        {verificationStep === 2 && (
          <div>
            <h4 className="font-medium text-indigo-900 mb-4">Step 2: Community Endorsement</h4>
            <p className="text-indigo-700 mb-4">
              We need verification from your community that you have permission to share this knowledge.
            </p>
            <textarea
              className="w-full p-3 border rounded-lg h-24"
              placeholder="Provide contact information for community elders, cultural leaders, or organizations who can verify your status as a knowledge keeper..."
              value={verificationData.community_endorsement}
              onChange={(e) => setVerificationData(prev => ({ ...prev, community_endorsement: e.target.value }))}
            />
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setVerificationStep(Math.max(1, verificationStep - 1))}
            disabled={verificationStep === 1}
            className="text-indigo-600 border-indigo-300"
          >
            Previous
          </Button>
          <Button
            onClick={() => setVerificationStep(Math.min(4, verificationStep + 1))}
            disabled={verificationStep === 4}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {verificationStep === 4 ? 'Submit for Review' : 'Next Step'}
          </Button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
        <p className="text-sm text-indigo-800">
          <strong>Why verification?</strong> Cultural appropriation causes real harm to communities. 
          Our verification process ensures that cultural wisdom is shared by community members 
          with permission, proper context, and reciprocity arrangements.
        </p>
      </div>
    </Card>
  );
}