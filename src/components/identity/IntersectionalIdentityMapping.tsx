/**
 * ALCHM Intersectional Identity Mapping System
 * 
 * Philosophy: "You are not a single identity - you are a complex, beautiful intersection
 * of multiple identities that interact, overlap, and create unique experiences.
 * True healing honors ALL parts of who you are, not just fragments."
 * 
 * This system provides:
 * - Visual mapping of intersectional identities and their interactions
 * - Recognition of unique challenges faced by multiply-marginalized people
 * - Celebration of the strength that comes from navigating multiple worlds
 * - Specific support for intersectional experiences (e.g., queer POC, disabled immigrants)
 * - Community connections based on shared intersectional experiences
 * - Resources that understand complexity rather than single-issue approaches
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface IdentityDimension {
  category: 'race_ethnicity' | 'gender' | 'sexuality' | 'class' | 'ability' | 'religion' | 'age' | 'immigration' | 'body' | 'mental_health';
  labels: string[];
  marginalizationLevel: 'privileged' | 'mixed' | 'marginalized';
  visibilityLevel: 'invisible' | 'sometimes_visible' | 'visible';
  communityConnection: 'strong' | 'developing' | 'seeking' | 'none';
}

interface IntersectionalProfile {
  identities: IdentityDimension[];
  intersectionalExperiences: {
    multipleMarginalization: boolean;
    identityConflicts: boolean; // e.g., religious beliefs vs LGBTQ+ identity
    invisibleIdentities: boolean;
    tokenism: boolean;
    codeSwiteching: boolean;
    communityExclusion: boolean;
  };
  strengths: string[];
  challenges: string[];
  supportNeeds: string[];
}

interface IntersectionalMappingProps {
  profile: IntersectionalProfile;
  onIdentityUpdate?: (profile: IntersectionalProfile) => void;
}

interface IntersectionalInsight {
  id: string;
  identityIntersection: string[];
  title: string;
  insight: string;
  validation: string;
  actionStep?: string;
  communityResource?: string;
}

export default function IntersectionalIdentityMapping({ 
  profile, 
  onIdentityUpdate 
}: IntersectionalMappingProps) {
  const [selectedView, setSelectedView] = useState<'map' | 'insights' | 'community' | 'strengths'>('map');
  const [currentInsight, setCurrentInsight] = useState<IntersectionalInsight | null>(null);
  const [identityInteractions, setIdentityInteractions] = useState<Array<{id1: string, id2: string, type: 'synergy' | 'tension' | 'complexity'}>>([]);

  const intersectionalInsights: IntersectionalInsight[] = [
    // Queer POC
    {
      id: 'queer_poc_belonging',
      identityIntersection: ['lgbtq+', 'black', 'latinx', 'asian', 'indigenous', 'middle_eastern'],
      title: 'Belonging in Multiple Communities',
      insight: "As a queer person of color, you may sometimes feel like you have to choose between your racial/ethnic community and your LGBTQ+ community. The truth is: you belong fully in both.",
      validation: "The experience of feeling 'too queer' for your racial community or 'too brown/black' for queer spaces is real and painful. These communities should celebrate all of you.",
      actionStep: "Seek out QT/POC spaces where you can be your full self without code-switching.",
      communityResource: "National Queer and Trans People of Color Coalition"
    },
    {
      id: 'queer_poc_family',
      identityIntersection: ['lgbtq+', 'black', 'latinx', 'asian', 'family_oriented_culture'],
      title: 'Navigating Family and Cultural Expectations',
      insight: "Coming out in cultures that prioritize family unity and have different concepts of gender and sexuality requires extra courage and often involves complex negotiations.",
      validation: "Your love for your family and culture AND your need to live authentically are both valid. You shouldn't have to choose.",
      actionStep: "Find other queer people from your cultural background who've navigated similar family dynamics."
    },

    // Disabled POC
    {
      id: 'disabled_poc_advocacy',
      identityIntersection: ['disabled', 'black', 'latinx', 'asian', 'indigenous'],
      title: 'Disability Justice + Racial Justice',
      insight: "Your experience of disability is shaped by racism, and your experience of racism is shaped by ableism. Both forms of oppression interact and compound.",
      validation: "When disability spaces are predominantly white or racial justice spaces ignore disability, your full experience gets erased. This is not your fault.",
      actionStep: "Connect with disability justice organizations led by people of color.",
      communityResource: "Sins Invalid - disability justice collective"
    },

    // Trans POC
    {
      id: 'trans_poc_safety',
      identityIntersection: ['transgender', 'black', 'latinx', 'indigenous'],
      title: 'Intersectional Safety Concerns',
      insight: "Trans people of color face higher rates of violence and discrimination than white trans people. Your heightened awareness of safety isn't paranoia - it's survival.",
      validation: "Your safety concerns are valid and based in reality. You deserve protection and support from all your communities.",
      actionStep: "Build safety networks with other trans POC who understand your specific risks."
    },

    // Neurodivergent POC
    {
      id: 'neurodivergent_poc_masking',
      identityIntersection: ['neurodivergent', 'black', 'latinx', 'asian'],
      title: 'Cultural Masking + Neurodivergent Masking',
      insight: "You may be masking both your neurodivergent traits AND code-switching for racial/ethnic contexts. This double masking is exhausting and takes a toll on mental health.",
      validation: "Having to hide multiple parts of yourself to be accepted is overwhelming. Your exhaustion from constant code-switching and masking is real.",
      actionStep: "Find spaces where you can unmask both culturally and neurodivergently."
    },

    // Working Class POC
    {
      id: 'working_class_poc_education',
      identityIntersection: ['working_class', 'first_generation_college', 'black', 'latinx'],
      title: 'Class Mobility + Cultural Identity',
      insight: "Achieving educational or economic success while maintaining connection to your cultural community can create identity tension and survivor's guilt.",
      validation: "Feeling caught between worlds - not fully belonging in middle-class spaces but feeling distant from your origins - is a common experience for upwardly mobile POC.",
      actionStep: "Connect with other first-gen college students or professionals from your cultural background."
    },

    // Immigrant LGBTQ+
    {
      id: 'immigrant_lgbtq_documentation',
      identityIntersection: ['undocumented', 'lgbtq+'],
      title: 'Immigration Status + LGBTQ+ Identity',
      insight: "Being undocumented and LGBTQ+ creates unique vulnerabilities - fear of deportation may prevent you from accessing LGBTQ+ resources or reporting discrimination.",
      validation: "Your fears about accessing services or being visible are rational given the real risks you face. Your safety comes first.",
      actionStep: "Seek out immigrant rights organizations that are LGBTQ+ affirming and know how to protect undocumented LGBTQ+ people."
    },

    // Muslim Women
    {
      id: 'muslim_women_hijab',
      identityIntersection: ['muslim', 'women', 'hijab_wearing'],
      title: 'Visible Faith + Gender + Islamophobia',
      insight: "Wearing hijab makes you visible as Muslim and woman simultaneously, creating unique experiences of both Islamophobia and sexism.",
      validation: "Experiencing discrimination that targets both your faith and your gender is real. Others may not understand this intersectional experience.",
      actionStep: "Connect with other Muslim women who share your experience of navigating faith, gender, and visibility."
    },

    // Fat POC
    {
      id: 'fat_poc_healthcare',
      identityIntersection: ['fat', 'black', 'latinx', 'indigenous'],
      title: 'Body Size + Race in Healthcare',
      insight: "Fat people of color face both weight stigma and medical racism, leading to more severe healthcare discrimination and delayed diagnoses.",
      validation: "When doctors dismiss your concerns due to both your weight and race, you're experiencing intersectional medical discrimination.",
      actionStep: "Find healthcare providers who are both weight-neutral and culturally competent."
    },

    // Elderly LGBTQ+ POC
    {
      id: 'elderly_lgbtq_poc_isolation',
      identityIntersection: ['elderly', 'lgbtq+', 'black', 'latinx'],
      title: 'Aging at the Intersections',
      insight: "Older LGBTQ+ people of color may face ageism within LGBTQ+ spaces, homophobia/transphobia in elder care, and racism in both contexts.",
      validation: "Your concerns about aging while holding multiple marginalized identities are valid. You deserve care that honors all parts of who you are.",
      actionStep: "Look for LGBTQ+ elder services and SAGE (Services & Advocacy for Gay, Lesbian, Bisexual & Transgender Elders)."
    }
  ];

  useEffect(() => {
    generateIntersectionalInsight();
    analyzeIdentityInteractions();
  }, [profile]);

  const generateIntersectionalInsight = () => {
    // Find insights relevant to user's intersectional identities
    const userIdentityLabels = profile.identities.flatMap(id => id.labels.map(label => label.toLowerCase()));
    
    const relevantInsights = intersectionalInsights.filter(insight => {
      const requiredIntersections = insight.identityIntersection.length;
      const matchingIntersections = insight.identityIntersection.filter(intersection => 
        userIdentityLabels.some(userLabel => 
          userLabel.includes(intersection.toLowerCase()) || 
          intersection.toLowerCase().includes(userLabel)
        )
      ).length;
      
      return matchingIntersections >= Math.min(2, requiredIntersections); // At least 2 matching intersections or all if fewer than 2
    });

    if (relevantInsights.length > 0) {
      const randomInsight = relevantInsights[Math.floor(Math.random() * relevantInsights.length)];
      setCurrentInsight(randomInsight);
    }
  };

  const analyzeIdentityInteractions = () => {
    const interactions: Array<{id1: string, id2: string, type: 'synergy' | 'tension' | 'complexity'}> = [];
    
    // Identify common tensions and synergies
    const identityTypes = profile.identities.map(id => id.category);
    
    if (identityTypes.includes('religion') && identityTypes.includes('sexuality')) {
      interactions.push({
        id1: 'religion', 
        id2: 'sexuality', 
        type: profile.intersectionalExperiences.identityConflicts ? 'tension' : 'complexity'
      });
    }
    
    if (identityTypes.includes('race_ethnicity') && identityTypes.includes('class')) {
      interactions.push({ id1: 'race_ethnicity', id2: 'class', type: 'complexity' });
    }
    
    if (identityTypes.includes('gender') && identityTypes.includes('ability')) {
      interactions.push({ id1: 'gender', id2: 'ability', type: 'complexity' });
    }

    setIdentityInteractions(interactions);
  };

  const getIdentityColor = (category: string) => {
    const colors = {
      race_ethnicity: '#DC2626', // red-600
      gender: '#EC4899', // pink-500
      sexuality: '#8B5CF6', // violet-500
      class: '#059669', // emerald-600
      ability: '#0284C7', // sky-600
      religion: '#D97706', // amber-600
      age: '#65A30D', // lime-600
      immigration: '#0D9488', // teal-600
      body: '#BE185D', // pink-700
      mental_health: '#7C3AED' // violet-600
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const IdentityMapView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-purple-800 mb-2">Your Intersectional Identity Map</h3>
        <p className="text-purple-600 text-sm">
          Each circle represents an aspect of your identity. Overlapping areas show intersections.
        </p>
      </div>

      {/* Visual Identity Map */}
      <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 min-h-[400px]">
        <svg width="100%" height="300" viewBox="0 0 400 300">
          {profile.identities.map((identity, index) => {
            const angle = (index / profile.identities.length) * 2 * Math.PI;
            const centerX = 200;
            const centerY = 150;
            const radius = 80;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="40"
                  fill={getIdentityColor(identity.category)}
                  fillOpacity="0.3"
                  stroke={getIdentityColor(identity.category)}
                  strokeWidth="2"
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy="0.35em"
                  className="text-xs font-medium"
                  fill={getIdentityColor(identity.category)}
                >
                  {identity.category.replace('_', ' ')}
                </text>
              </g>
            );
          })}
          
          {/* Center intersection */}
          <circle
            cx="200"
            cy="150"
            r="25"
            fill="gold"
            fillOpacity="0.6"
            stroke="#F59E0B"
            strokeWidth="2"
          />
          <text
            x="200"
            y="150"
            textAnchor="middle"
            dy="0.35em"
            className="text-xs font-bold"
            fill="#92400E"
          >
            YOU
          </text>
        </svg>
      </div>

      {/* Identity Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.identities.map((identity, index) => (
          <Card key={index} className="p-4" style={{ borderColor: getIdentityColor(identity.category) }}>
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getIdentityColor(identity.category) }}
              />
              <h4 className="font-semibold capitalize">
                {identity.category.replace('_', ' ')}
              </h4>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>Identity:</strong> {identity.labels.join(', ')}</p>
              <p><strong>Community:</strong> {identity.communityConnection}</p>
              <p><strong>Visibility:</strong> {identity.visibilityLevel.replace('_', ' ')}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const IntersectionalInsightsView = () => (
    <div className="space-y-6">
      {currentInsight && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h3 className="text-lg font-semibold text-indigo-800">
                Intersectional Insight
              </h3>
            </div>
            <Button
              onClick={generateIntersectionalInsight}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              New Insight
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-indigo-900 mb-2">{currentInsight.title}</h4>
              <p className="text-indigo-800">{currentInsight.insight}</p>
            </div>

            <div className="bg-indigo-100 rounded-lg p-4">
              <h5 className="font-semibold text-indigo-900 mb-2">Validation:</h5>
              <p className="text-indigo-800">{currentInsight.validation}</p>
            </div>

            {currentInsight.actionStep && (
              <div className="bg-purple-100 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-2">Action Step:</h5>
                <p className="text-purple-800">{currentInsight.actionStep}</p>
              </div>
            )}

            {currentInsight.communityResource && (
              <div className="bg-green-100 rounded-lg p-4">
                <h5 className="font-semibold text-green-900 mb-2">Community Resource:</h5>
                <p className="text-green-800">{currentInsight.communityResource}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Intersectional Experiences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Intersectional Experiences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.multipleMarginalization ? 'bg-red-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Multiple marginalized identities</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.identityConflicts ? 'bg-yellow-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Identity conflicts/tensions</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.invisibleIdentities ? 'bg-blue-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Invisible identities</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.tokenism ? 'bg-orange-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Tokenism experiences</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.codeSwiteching ? 'bg-purple-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Code-switching needs</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${profile.intersectionalExperiences.communityExclusion ? 'bg-pink-500' : 'bg-gray-300'}`} />
              <span className="text-sm">Community exclusion</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const IntersectionalStrengthsView = () => (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          💪 Intersectional Strengths
        </h3>
        <p className="text-green-700 mb-6">
          Your multiple identities give you unique strengths and perspectives that the world needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-green-800 mb-3">Your Superpowers:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✨</span>
                <span className="text-sm">Bridge-building between communities</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">🧠</span>
                <span className="text-sm">Complex problem-solving abilities</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">💖</span>
                <span className="text-sm">Deep empathy for multiple experiences</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">🎭</span>
                <span className="text-sm">Cultural code-switching skills</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">🔍</span>
                <span className="text-sm">Ability to see multiple perspectives</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-green-800 mb-3">Your Wisdom:</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">🌟</span>
                <span className="text-sm">Understanding of intersectional oppression</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">🛡️</span>
                <span className="text-sm">Resilience from navigating multiple challenges</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">🤝</span>
                <span className="text-sm">Coalition-building instincts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">📚</span>
                <span className="text-sm">Intuitive understanding of complexity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">💬</span>
                <span className="text-sm">Ability to translate between worlds</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800 font-medium text-center">
            "Your intersectional identity is not a burden to bear - it's a gift that makes you uniquely powerful and wise."
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={selectedView === 'map' ? 'default' : 'outline'}
            onClick={() => setSelectedView('map')}
            size="sm"
            className="text-sm"
          >
            🗺️ Identity Map
          </Button>
          <Button
            variant={selectedView === 'insights' ? 'default' : 'outline'}
            onClick={() => setSelectedView('insights')}
            size="sm"
            className="text-sm"
          >
            🔍 Intersectional Insights
          </Button>
          <Button
            variant={selectedView === 'strengths' ? 'default' : 'outline'}
            onClick={() => setSelectedView('strengths')}
            size="sm"
            className="text-sm"
          >
            💪 Your Strengths
          </Button>
        </div>
      </Card>

      {/* Views */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === 'map' && <IdentityMapView />}
          {selectedView === 'insights' && <IntersectionalInsightsView />}
          {selectedView === 'strengths' && <IntersectionalStrengthsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Intersectional Community Finder
 * Helps users find communities and resources that understand their specific intersections
 */
export function IntersectionalCommunityFinder({ 
  profile 
}: { 
  profile: IntersectionalProfile 
}) {
  const [communityRecommendations, setCommunityRecommendations] = useState<Array<{
    name: string;
    description: string;
    intersections: string[];
    type: 'online' | 'local' | 'organization' | 'support_group';
    link?: string;
  }>>([]);

  const communityDatabase = [
    {
      name: "National Queer and Trans People of Color Coalition",
      description: "National organization supporting QTPOC through advocacy and community building",
      intersections: ['lgbtq+', 'black', 'latinx', 'asian', 'indigenous', 'transgender'],
      type: 'organization' as const,
      link: "https://www.nqttc.org/"
    },
    {
      name: "Sins Invalid",
      description: "Disability justice collective centering artists of color and queer/trans disabled people",
      intersections: ['disabled', 'black', 'latinx', 'lgbtq+', 'queer', 'transgender'],
      type: 'organization' as const,
      link: "https://www.sinsinvalid.org/"
    },
    {
      name: "Black Lives Matter Healing Justice Committee",
      description: "Focuses on healing justice within racial justice movement",
      intersections: ['black', 'african_american', 'healing', 'justice'],
      type: 'organization' as const
    },
    {
      name: "Asian Mental Health Collective",
      description: "Mental health resources specifically for Asian and Pacific Islander communities",
      intersections: ['asian', 'pacific_islander', 'mental_health'],
      type: 'organization' as const
    },
    {
      name: "Fireweed Collective",
      description: "Mental health education for marginalized communities",
      intersections: ['black', 'indigenous', 'poc', 'lgbtq+', 'mental_health'],
      type: 'organization' as const
    }
  ];

  useEffect(() => {
    // Find communities that match user's intersections
    const userIdentityLabels = profile.identities.flatMap(id => id.labels.map(label => label.toLowerCase()));
    
    const relevantCommunities = communityDatabase.filter(community => {
      const matchingIntersections = community.intersections.filter(intersection => 
        userIdentityLabels.some(userLabel => 
          userLabel.includes(intersection.toLowerCase()) || 
          intersection.toLowerCase().includes(userLabel)
        )
      ).length;
      
      return matchingIntersections >= 1; // At least one matching intersection
    });

    setCommunityRecommendations(relevantCommunities);
  }, [profile]);

  return (
    <Card className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-teal-200">
      <h3 className="text-lg font-semibold text-teal-800 mb-4">
        🌍 Intersectional Community Resources
      </h3>
      
      <p className="text-teal-700 mb-6">
        These organizations and communities understand the complexity of your intersectional identity.
      </p>
      
      <div className="space-y-4">
        {communityRecommendations.map((community, index) => (
          <Card key={index} className="p-4 bg-white border-teal-100">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-teal-800">{community.name}</h4>
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full capitalize">
                {community.type.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-teal-700 mb-3">{community.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {community.intersections.map((intersection, idx) => (
                <span key={idx} className="text-xs bg-teal-50 text-teal-600 px-2 py-1 rounded">
                  {intersection}
                </span>
              ))}
            </div>
            
            {community.link && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(community.link, '_blank')}
                className="text-teal-600 border-teal-300 hover:bg-teal-50"
              >
                Learn More
              </Button>
            )}
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-teal-100 rounded-lg">
        <p className="text-sm text-teal-800">
          <strong>Remember:</strong> You deserve communities that celebrate ALL parts of your identity, not just fragments. 
          Don't settle for spaces that ask you to hide parts of yourself.
        </p>
      </div>
    </Card>
  );
}