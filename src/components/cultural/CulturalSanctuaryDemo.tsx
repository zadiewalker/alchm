/*
 * ALCHM Cultural Sanctuary Demo
 * Example implementation showing culturally-grounded design elements in action
 * Demonstrates inclusive healing space that honors diverse traditions
 */

import React, { useState } from 'react';
import { CulturalText, CulturalHeading, CulturalParagraph } from './CulturalTypography';
import { CulturalIcons, CulturalContext, HealingTradition } from './CulturalIconSystem';
import { CulturalCommunityHub, SupportCircle } from '../community/CulturalCommunityHub';
import { 
  SacredSpace, 
  GratitudeCircle, 
  BreathingSpace, 
  IntentionSetter, 
  WisdomReflection, 
  EnergyVisualization 
} from '../sacred/InclusiveSacredElements';

interface CulturalSanctuaryDemoProps {
  userProfile: {
    id: string;
    name: string;
    culturalContext: 'individualist' | 'collectivist' | 'mixed';
    preferredLang: string;
    spiritualPractices?: string[];
    healingTraditions?: string[];
  };
  className?: string;
}

const CulturalSanctuaryDemo: React.FC<CulturalSanctuaryDemoProps> = ({
  userProfile,
  className = '',
}) => {
  const [activeSection, setActiveSection] = useState<'welcome' | 'community' | 'sacred' | 'healing'>('welcome');
  const [gratitudes, setGratitudes] = useState<string[]>([
    'The wisdom of my ancestors',
    'Community that holds me',
    'The breath that sustains me',
  ]);

  // Sample community data
  const communityMembers = [
    {
      id: '1',
      name: 'Maya Chen',
      relationshipType: 'chosen-family' as const,
      culturalBackground: 'Chinese-American',
      pronouns: 'she/her',
      connectionStrength: 'family' as const,
      sharedJourneys: ['Identity exploration', 'Career transition'],
      mutualSupport: true,
      lastConnection: new Date('2024-09-28'),
    },
    {
      id: '2',
      name: 'Ahmed Hassan',
      relationshipType: 'spiritual-family' as const,
      culturalBackground: 'Egyptian-Canadian',
      pronouns: 'he/him',
      connectionStrength: 'soul' as const,
      sharedJourneys: ['Spiritual growth', 'Community service'],
      mutualSupport: true,
      lastConnection: new Date('2024-09-30'),
    },
    {
      id: '3',
      name: 'River Tallas',
      relationshipType: 'mentor' as const,
      culturalBackground: 'Indigenous (Cree/Métis)',
      pronouns: 'they/them',
      connectionStrength: 'close' as const,
      sharedJourneys: ['Traditional healing', 'Land connection'],
      mutualSupport: true,
      lastConnection: new Date('2024-09-25'),
    },
  ];

  const wisdomQuestions = [
    'What wisdom does your body hold today?',
    'How has your cultural heritage shaped your healing journey?',
    'What would you tell your younger self about belonging?',
    'How do you honor both your individual needs and community connections?',
  ];

  const healingTraditions = [
    {
      tradition: 'nature' as const,
      title: 'Earth Connection',
      description: 'Finding healing through connection with the natural world',
    },
    {
      tradition: 'community' as const,
      title: 'Collective Healing',
      description: 'Healing happens in relationship with others',
    },
    {
      tradition: 'movement' as const,
      title: 'Embodied Wisdom',
      description: 'The body holds wisdom and healing through movement',
    },
    {
      tradition: 'breath' as const,
      title: 'Sacred Breath',
      description: 'Breath as a bridge between body, mind, and spirit',
    },
  ];

  const renderWelcomeSection = () => (
    <div className="welcome-section">
      <CulturalContext culturalContext={userProfile.culturalContext}>
        <div className="cultural-sanctuary">
          <div className="cultural-glass p-8 mb-8">
            <CulturalHeading
              lang={userProfile.preferredLang}
              level={1}
              size="3xl"
              className="text-center mb-6"
            >
              Welcome to Your Cultural Sanctuary
            </CulturalHeading>
            
            <CulturalParagraph
              lang={userProfile.preferredLang}
              culturalContext={userProfile.culturalContext}
              className="text-center text-lg mb-8"
            >
              This space honors your whole self - your cultural heritage, your chosen paths, 
              and the unique wisdom you bring. Here, healing happens in ways that resonate 
              with your authentic identity.
            </CulturalParagraph>

            {/* Cultural Context Indicator */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full bg-terracotta-100 text-terracotta-800`}>
                <CulturalIcons.Community size="sm" />
                <span className="text-sm font-medium">
                  {userProfile.culturalContext === 'collectivist' ? 'Community-Centered' : 
                   userProfile.culturalContext === 'individualist' ? 'Individual-Focused' : 
                   'Balanced Approach'} Healing Space
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'community', icon: CulturalIcons.Community, label: 'Sacred Circle', color: 'terracotta' },
                { key: 'sacred', icon: CulturalIcons.Wisdom, label: 'Sacred Practices', color: 'sage' },
                { key: 'healing', icon: CulturalIcons.Growth, label: 'Healing Ways', color: 'blush' },
              ].map(({ key, icon: IconComponent, label, color }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-300
                    hover:scale-105 flex flex-col items-center gap-3
                    ${color === 'terracotta' ? 'bg-terracotta-50 border-terracotta-200 hover:bg-terracotta-100' :
                      color === 'sage' ? 'bg-sage-50 border-sage-200 hover:bg-sage-100' :
                      'bg-blush-50 border-blush-200 hover:bg-blush-100'
                    }
                  `}
                >
                  <IconComponent size="lg" color={color as any} />
                  <CulturalText
                    lang={userProfile.preferredLang}
                    variant="emphasis"
                    size="sm"
                  >
                    {label}
                  </CulturalText>
                </button>
              ))}
            </div>
          </div>

          {/* Healing Traditions Overview */}
          <div className="healing-traditions-preview">
            <CulturalHeading
              lang={userProfile.preferredLang}
              level={2}
              size="xl"
              className="text-center mb-6"
            >
              Honored Healing Traditions
            </CulturalHeading>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healingTraditions.map((tradition) => (
                <HealingTradition
                  key={tradition.tradition}
                  tradition={tradition.tradition}
                  title={tradition.title}
                  description={tradition.description}
                  className="h-full"
                />
              ))}
            </div>
          </div>
        </div>
      </CulturalContext>
    </div>
  );

  const renderCommunitySection = () => (
    <div className="community-section">
      <CulturalCommunityHub
        currentUser={{
          id: userProfile.id,
          name: userProfile.name,
          culturalContext: userProfile.culturalContext,
          preferredRelationshipStyle: 'multi-layered',
          lang: userProfile.preferredLang,
        }}
        members={communityMembers}
        onConnect={(memberId) => console.log('Connecting with:', memberId)}
        onSupport={(memberId, type) => console.log('Supporting:', memberId, type)}
      />
      
      <div className="mt-8">
        <SupportCircle
          currentUser={{
            name: userProfile.name,
            lang: userProfile.preferredLang,
            culturalContext: userProfile.culturalContext,
          }}
          availableSupport={communityMembers}
          emergencyContacts={communityMembers.slice(0, 2)}
          onRequestSupport={(type) => console.log('Requesting support:', type)}
        />
      </div>
    </div>
  );

  const renderSacredSection = () => (
    <div className="sacred-section space-y-8">
      {/* Daily Gratitude */}
      <GratitudeCircle
        gratitudes={gratitudes}
        onAddGratitude={(gratitude) => setGratitudes([...gratitudes, gratitude])}
        lang={userProfile.preferredLang}
      />

      {/* Sacred Breath Practice */}
      <BreathingSpace
        technique="calm"
        duration={180}
        lang={userProfile.preferredLang}
        onComplete={() => console.log('Breathing practice completed')}
      />

      {/* Intention Setting */}
      <IntentionSetter
        lang={userProfile.preferredLang}
        onSetIntention={(intention, category) => 
          console.log('Intention set:', { intention, category })
        }
      />

      {/* Wisdom Reflection */}
      <WisdomReflection
        questions={wisdomQuestions}
        lang={userProfile.preferredLang}
        onReflection={(question, reflection) => 
          console.log('Reflection:', { question, reflection })
        }
      />

      {/* Energy Visualization */}
      <EnergyVisualization
        energyType="healing"
        duration={300}
        lang={userProfile.preferredLang}
        onComplete={() => console.log('Energy work completed')}
      />
    </div>
  );

  const renderHealingSection = () => (
    <div className="healing-section">
      <SacredSpace
        intention="Exploring Diverse Healing Paths"
        culturalContext="spiritual-inclusive"
      >
        <CulturalHeading
          lang={userProfile.preferredLang}
          level={2}
          size="2xl"
          className="text-center mb-8"
        >
          Your Healing Constellation
        </CulturalHeading>

        <CulturalParagraph
          lang={userProfile.preferredLang}
          culturalContext={userProfile.culturalContext}
          className="text-center mb-8"
        >
          Healing is not one-size-fits-all. Your path may draw from ancient wisdom, 
          modern understanding, cultural practices, and personal insights. All are 
          honored here.
        </CulturalParagraph>

        {/* Healing Modalities */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              name: 'Somatic Healing',
              description: 'Body-based approaches that honor the wisdom held in your nervous system',
              icon: CulturalIcons.Movement,
              color: 'terracotta',
            },
            {
              name: 'Cultural Reclamation',
              description: 'Reconnecting with healing practices from your cultural heritage',
              icon: CulturalIcons.Story,
              color: 'sage',
            },
            {
              name: 'Community Care',
              description: 'Healing that happens in relationship and mutual support',
              icon: CulturalIcons.Community,
              color: 'blush',
            },
            {
              name: 'Nature Connection',
              description: 'Earth-based healing that honors our interdependence',
              icon: CulturalIcons.Nature,
              color: 'sage',
            },
            {
              name: 'Creative Expression',
              description: 'Art, music, movement, and creativity as pathways to healing',
              icon: CulturalIcons.Creativity,
              color: 'terracotta',
            },
            {
              name: 'Sacred Activism',
              description: 'Healing through working toward justice and collective liberation',
              icon: CulturalIcons.Growth,
              color: 'blush',
            },
          ].map((modality, index) => (
            <div
              key={index}
              className={`
                tree-of-connection p-6 text-center
                ${modality.color === 'terracotta' ? 'bg-gradient-to-br from-terracotta-50 to-terracotta-100' :
                  modality.color === 'sage' ? 'bg-gradient-to-br from-sage-50 to-sage-100' :
                  'bg-gradient-to-br from-blush-50 to-blush-100'
                }
              `}
            >
              <modality.icon 
                size="lg" 
                color={modality.color as any}
                className="mx-auto mb-4"
              />
              
              <CulturalHeading
                lang={userProfile.preferredLang}
                level={4}
                size="base"
                className="mb-3"
              >
                {modality.name}
              </CulturalHeading>
              
              <CulturalText
                lang={userProfile.preferredLang}
                variant="body"
                size="sm"
              >
                {modality.description}
              </CulturalText>
            </div>
          ))}
        </div>
      </SacredSpace>
    </div>
  );

  return (
    <div className={`cultural-sanctuary-demo ${className}`}>
      {/* Back Navigation */}
      {activeSection !== 'welcome' && (
        <div className="mb-6">
          <button
            onClick={() => setActiveSection('welcome')}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-sage-100 hover:bg-sage-200 text-sage-800
              transition-colors duration-200
            "
          >
            <span>←</span>
            <CulturalText
              lang={userProfile.preferredLang}
              variant="emphasis"
              size="sm"
            >
              Return to Sanctuary
            </CulturalText>
          </button>
        </div>
      )}

      {/* Section Content */}
      {activeSection === 'welcome' && renderWelcomeSection()}
      {activeSection === 'community' && renderCommunitySection()}
      {activeSection === 'sacred' && renderSacredSection()}
      {activeSection === 'healing' && renderHealingSection()}
    </div>
  );
};

export default CulturalSanctuaryDemo;