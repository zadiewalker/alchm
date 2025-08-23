'use client';

import React, { useState, useEffect } from 'react';
import { useSacredMicrocopy, useSacredButton, useSacredPrompt } from '@/components/SacredMicrocopyProvider';
import { useSacredTimeAware } from '@/components/SacredMicrocopyProvider';

// ===== WITNESSING SPACE TYPES =====

export interface WitnessedReflection {
  id: string;
  authorId: string;
  authorName: string; // Anonymous or chosen sacred name
  content: string;
  sacredPrompt?: string; // The invitation that inspired this reflection
  culturalContext?: string;
  emotionalTone: 'gentle' | 'vulnerable' | 'celebrating' | 'processing' | 'seeking';
  createdAt: Date;
  spaceType: 'open_witness' | 'circle_specific' | 'cultural_bridge' | 'healing_focused';
  witnessInvitation: string; // How the author wants to be witnessed
  boundaries: {
    responseType: 'silent_witness' | 'gentle_affirmation' | 'shared_resonance' | 'wisdom_offering';
    culturalSensitivity: 'universal' | 'specific_background' | 'bridge_building';
    anonymityLevel: 'full' | 'sacred_name' | 'gradual_reveal';
  };
  witnesses: WitnessResponse[];
  viewCount: number;
  lastWitnessed: Date;
}

export interface WitnessResponse {
  id: string;
  witnessId: string;
  witnessName: string;
  responseType: 'silent_witness' | 'gentle_affirmation' | 'shared_resonance' | 'wisdom_offering';
  content?: string; // Optional text response
  sacredOffering?: {
    symbol: string; // Emoji or cultural symbol
    intention: string; // The meaning behind the offering
    culturalContext?: string;
  };
  createdAt: Date;
  isAnonymous: boolean;
}

export interface WitnessingPrompt {
  id: string;
  prompt: string;
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'east_asian' | 'latin_american' | 'middle_eastern' | 'european' | 'bridge';
  emotionalContainer: 'gentle_opening' | 'deep_exploration' | 'joyful_celebration' | 'challenge_processing' | 'wisdom_seeking';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night' | 'seasonal' | 'timeless';
  healingFocus?: string[]; // Areas of healing this prompt supports
  backgroundWisdom?: string; // Cultural or spiritual context for the prompt
}

// ===== WITNESSING SPACE COMPONENT =====

export interface SacredWitnessingSpaceProps {
  userId: string;
  userCulturalContext?: string;
  spaceType?: WitnessedReflection['spaceType'];
  initialView?: 'browse' | 'share' | 'my_reflections' | 'prompts';
  className?: string;
}

export function SacredWitnessingSpace({
  userId,
  userCulturalContext = 'universal',
  spaceType = 'open_witness',
  initialView = 'browse',
  className = ''
}: SacredWitnessingSpaceProps) {
  const [currentView, setCurrentView] = useState(initialView);
  const [reflections, setReflections] = useState<WitnessedReflection[]>([]);
  const [myReflections, setMyReflections] = useState<WitnessedReflection[]>([]);
  const [availablePrompts, setAvailablePrompts] = useState<WitnessingPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<WitnessingPrompt | null>(null);
  const [newReflection, setNewReflection] = useState('');
  const [witnessingInvitation, setWitnessingInvitation] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  const { copy, getContextualCopy } = useSacredMicrocopy();
  const { timeOfDay, getContextualPrompt } = useSacredTimeAware();

  // Initialize witnessing space data
  useEffect(() => {
    initializeWitnessingSpace();
  }, [spaceType, userCulturalContext]);

  const initializeWitnessingSpace = async () => {
    // Load sample prompts based on cultural context and time
    const samplePrompts: WitnessingPrompt[] = [
      {
        id: 'universal-1',
        prompt: 'What truth is your heart speaking today that needs to be witnessed?',
        culturalContext: 'universal',
        emotionalContainer: 'gentle_opening',
        timeContext: timeOfDay,
        healingFocus: ['self_expression', 'emotional_awareness']
      },
      {
        id: 'universal-2',
        prompt: 'Share a moment of growth that happened quietly, without anyone noticing.',
        culturalContext: 'universal',
        emotionalContainer: 'joyful_celebration',
        timeContext: 'timeless',
        healingFocus: ['self_recognition', 'inner_growth']
      },
      {
        id: 'bridge-1',
        prompt: 'How did your ancestors\' wisdom guide you through a recent challenge?',
        culturalContext: 'bridge',
        emotionalContainer: 'wisdom_seeking',
        timeContext: 'timeless',
        healingFocus: ['cultural_connection', 'ancestral_wisdom'],
        backgroundWisdom: 'Honors the continuous guidance of those who came before us'
      },
      {
        id: 'universal-3',
        prompt: 'What are you learning about yourself in this season of your life?',
        culturalContext: 'universal',
        emotionalContainer: 'deep_exploration',
        timeContext: 'seasonal',
        healingFocus: ['self_awareness', 'personal_evolution']
      }
    ];

    setAvailablePrompts(samplePrompts);

    // Load sample reflections for browsing
    const sampleReflections: WitnessedReflection[] = [
      {
        id: 'reflection-1',
        authorId: 'user-2',
        authorName: 'Gentle Seeker',
        content: 'I realized today that healing isn\'t linear. I had a moment of deep sadness about something I thought I had processed, and instead of judging myself, I held space for that feeling. It felt revolutionary to not try to fix or rush past it.',
        sacredPrompt: 'What truth is your heart speaking today that needs to be witnessed?',
        culturalContext: 'universal',
        emotionalTone: 'processing',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        spaceType: 'open_witness',
        witnessInvitation: 'I would love gentle affirmation that non-linear healing is okay',
        boundaries: {
          responseType: 'gentle_affirmation',
          culturalSensitivity: 'universal',
          anonymityLevel: 'sacred_name'
        },
        witnesses: [
          {
            id: 'witness-1',
            witnessId: 'user-3',
            witnessName: 'Sacred Companion',
            responseType: 'gentle_affirmation',
            content: 'Your gentle acceptance of your own process is so beautiful. Healing really does happen in spirals, not lines. ❤️',
            createdAt: new Date(Date.now() - 90 * 60 * 1000),
            isAnonymous: false
          },
          {
            id: 'witness-2',
            witnessId: 'user-4',
            witnessName: 'Anonymous Witness',
            responseType: 'shared_resonance',
            content: 'I needed to read this today. Thank you for your courage in sharing.',
            createdAt: new Date(Date.now() - 45 * 60 * 1000),
            isAnonymous: true
          }
        ],
        viewCount: 12,
        lastWitnessed: new Date(Date.now() - 45 * 60 * 1000)
      }
    ];

    setReflections(sampleReflections);
  };

  const shareReflection = async () => {
    if (!newReflection.trim() || !witnessingInvitation.trim()) return;

    const reflection: WitnessedReflection = {
      id: `reflection-${Date.now()}`,
      authorId: userId,
      authorName: 'Sacred Seeker', // Would come from user profile
      content: newReflection,
      sacredPrompt: selectedPrompt?.prompt,
      culturalContext: userCulturalContext,
      emotionalTone: 'seeking', // Could be determined from content analysis
      createdAt: new Date(),
      spaceType: spaceType,
      witnessInvitation: witnessingInvitation,
      boundaries: {
        responseType: 'gentle_affirmation',
        culturalSensitivity: 'universal',
        anonymityLevel: 'sacred_name'
      },
      witnesses: [],
      viewCount: 0,
      lastWitnessed: new Date()
    };

    setMyReflections(prev => [reflection, ...prev]);
    setReflections(prev => [reflection, ...prev]);
    setNewReflection('');
    setWitnessingInvitation('');
    setSelectedPrompt(null);
    setShowShareModal(false);
    setCurrentView('browse');
  };

  return (
    <div className={`sacred-witnessing-space ${className}`}>
      {/* Sacred Navigation */}
      <nav className="sacred-navigation surface-elevated-gentle p-gentle mb-ritual rounded-gentle">
        <div className="flex space-x-breath">
          <button
            onClick={() => setCurrentView('browse')}
            className={`sacred-nav-button ${currentView === 'browse' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">👁️</span>
            Witness Reflections
          </button>
          <button
            onClick={() => setCurrentView('prompts')}
            className={`sacred-nav-button ${currentView === 'prompts' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">✨</span>
            Sacred Prompts
          </button>
          <button
            onClick={() => setCurrentView('share')}
            className={`sacred-nav-button ${currentView === 'share' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">📝</span>
            Share Reflection
          </button>
          <button
            onClick={() => setCurrentView('my_reflections')}
            className={`sacred-nav-button ${currentView === 'my_reflections' ? 'active' : ''}`}
          >
            <span className="text-lg mr-whisper">🌱</span>
            My Reflections
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="sacred-content-area">
        {currentView === 'browse' && (
          <BrowseReflectionsView
            reflections={reflections}
            userId={userId}
            onWitness={(reflectionId, witness) => {
              setReflections(prev => prev.map(r => 
                r.id === reflectionId 
                  ? { ...r, witnesses: [...r.witnesses, witness] }
                  : r
              ));
            }}
          />
        )}
        
        {currentView === 'prompts' && (
          <PromptsView
            prompts={availablePrompts}
            culturalContext={userCulturalContext}
            timeOfDay={timeOfDay}
            onSelectPrompt={(prompt) => {
              setSelectedPrompt(prompt);
              setCurrentView('share');
            }}
          />
        )}
        
        {currentView === 'share' && (
          <ShareReflectionView
            selectedPrompt={selectedPrompt}
            newReflection={newReflection}
            setNewReflection={setNewReflection}
            witnessingInvitation={witnessingInvitation}
            setWitnessingInvitation={setWitnessingInvitation}
            onShare={shareReflection}
            onCancel={() => {
              setNewReflection('');
              setWitnessingInvitation('');
              setSelectedPrompt(null);
              setCurrentView('browse');
            }}
          />
        )}
        
        {currentView === 'my_reflections' && (
          <MyReflectionsView
            reflections={myReflections}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
}

// ===== BROWSE REFLECTIONS VIEW =====

interface BrowseReflectionsViewProps {
  reflections: WitnessedReflection[];
  userId: string;
  onWitness: (reflectionId: string, witness: WitnessResponse) => void;
}

function BrowseReflectionsView({ reflections, userId, onWitness }: BrowseReflectionsViewProps) {
  if (reflections.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">🌸</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Space Awaiting
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          This witnessing space is holding space for the first brave soul to share their reflection.
        </p>
        <button
          onClick={() => {/* Switch to share view */}}
          className="sacred-button intention-sacred"
        >
          Be the first to share
        </button>
      </div>
    );
  }

  return (
    <div className="browse-reflections">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Reflections Seeking Witness
        </h2>
        <p className="text-presence text-secondary">
          Hold space for fellow travelers by offering your gentle presence and wisdom.
        </p>
      </div>

      <div className="space-y-ritual">
        {reflections.map(reflection => (
          <ReflectionCard
            key={reflection.id}
            reflection={reflection}
            userId={userId}
            onWitness={onWitness}
          />
        ))}
      </div>
    </div>
  );
}

// ===== REFLECTION CARD COMPONENT =====

interface ReflectionCardProps {
  reflection: WitnessedReflection;
  userId: string;
  onWitness: (reflectionId: string, witness: WitnessResponse) => void;
}

function ReflectionCard({ reflection, userId, onWitness }: ReflectionCardProps) {
  const [showWitnessForm, setShowWitnessForm] = useState(false);
  const [witnessResponse, setWitnessResponse] = useState('');
  const [responseType, setResponseType] = useState<WitnessResponse['responseType']>('gentle_affirmation');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const getEmotionalIcon = (tone: WitnessedReflection['emotionalTone']) => {
    const iconMap = {
      'gentle': '🌸',
      'vulnerable': '💙',
      'celebrating': '✨',
      'processing': '🌊',
      'seeking': '🔍'
    };
    return iconMap[tone];
  };

  const submitWitness = () => {
    if (!witnessResponse.trim() && responseType !== 'silent_witness') return;

    const witness: WitnessResponse = {
      id: `witness-${Date.now()}`,
      witnessId: userId,
      witnessName: 'Sacred Witness', // Would come from user profile
      responseType: responseType,
      content: witnessResponse || undefined,
      createdAt: new Date(),
      isAnonymous: false // Could be a user choice
    };

    onWitness(reflection.id, witness);
    setWitnessResponse('');
    setShowWitnessForm(false);
  };

  return (
    <div className="reflection-card surface-card-gentle p-ritual rounded-gentle border border-healing-mist">
      {/* Reflection Header */}
      <div className="flex items-start justify-between mb-gentle">
        <div className="flex items-center gap-breath">
          <span className="text-xl">{getEmotionalIcon(reflection.emotionalTone)}</span>
          <div>
            <h4 className="text-grounding font-presence text-primary">{reflection.authorName}</h4>
            <p className="text-breath text-tertiary">{formatTimeAgo(reflection.createdAt)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-whisper text-tertiary">{reflection.witnesses.length} witnesses</p>
          <p className="text-whisper text-tertiary">{reflection.viewCount} views</p>
        </div>
      </div>

      {/* Sacred Prompt (if applicable) */}
      {reflection.sacredPrompt && (
        <div className="sacred-prompt bg-healing-mist p-breath rounded-breath mb-gentle">
          <p className="text-breath text-secondary italic">
            Inspired by: "{reflection.sacredPrompt}"
          </p>
        </div>
      )}

      {/* Reflection Content */}
      <div className="reflection-content mb-gentle">
        <p className="text-presence text-primary leading-spacious">
          {reflection.content}
        </p>
      </div>

      {/* Witnessing Invitation */}
      <div className="witnessing-invitation bg-tender-embrace p-breath rounded-breath mb-gentle">
        <p className="text-breath text-secondary">
          <span className="font-presence text-primary">How to witness:</span> {reflection.witnessInvitation}
        </p>
      </div>

      {/* Existing Witnesses */}
      {reflection.witnesses.length > 0 && (
        <div className="existing-witnesses mb-gentle">
          <h5 className="text-breath font-presence text-secondary mb-breath">Sacred Witnesses:</h5>
          <div className="space-y-breath">
            {reflection.witnesses.map(witness => (
              <div key={witness.id} className="witness-response bg-moon-whisper p-breath rounded-breath">
                <div className="flex items-start justify-between mb-whisper">
                  <span className="text-breath font-presence text-primary">{witness.witnessName}</span>
                  <span className="text-whisper text-tertiary">{formatTimeAgo(witness.createdAt)}</span>
                </div>
                {witness.content && (
                  <p className="text-breath text-secondary leading-spacious">{witness.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Witness Actions */}
      <div className="witness-actions pt-breath border-t border-healing-mist">
        {!showWitnessForm ? (
          <div className="flex gap-breath">
            <button
              onClick={() => setShowWitnessForm(true)}
              className="sacred-button intention-sacred flex-1"
            >
              <span className="mr-whisper">🙏</span>
              Offer witness
            </button>
            <button className="sacred-button intention-gentle">
              <span className="mr-whisper">👁️</span>
              Silent witness
            </button>
          </div>
        ) : (
          <div className="witness-form">
            <div className="mb-breath">
              <label className="block text-breath font-presence text-primary mb-whisper">
                How would you like to witness?
              </label>
              <select
                value={responseType}
                onChange={(e) => setResponseType(e.target.value as WitnessResponse['responseType'])}
                className="w-full p-breath border border-healing-mist rounded-breath focus:outline-none focus:border-primary"
              >
                <option value="gentle_affirmation">Gentle affirmation</option>
                <option value="shared_resonance">Shared resonance</option>
                <option value="wisdom_offering">Wisdom offering</option>
                <option value="silent_witness">Silent witness (no words)</option>
              </select>
            </div>

            {responseType !== 'silent_witness' && (
              <div className="mb-gentle">
                <textarea
                  value={witnessResponse}
                  onChange={(e) => setWitnessResponse(e.target.value)}
                  placeholder="Share your witness response with care and intention..."
                  className="w-full p-breath border border-healing-mist rounded-breath resize-none h-20 focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="flex gap-breath justify-end">
              <button
                onClick={() => {
                  setShowWitnessForm(false);
                  setWitnessResponse('');
                }}
                className="sacred-button intention-gentle"
              >
                Close the space
              </button>
              <button
                onClick={submitWitness}
                disabled={responseType !== 'silent_witness' && !witnessResponse.trim()}
                className="sacred-button intention-sacred disabled:opacity-50"
              >
                Send witness
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== PROMPTS VIEW COMPONENT =====

interface PromptsViewProps {
  prompts: WitnessingPrompt[];
  culturalContext: string;
  timeOfDay: string;
  onSelectPrompt: (prompt: WitnessingPrompt) => void;
}

function PromptsView({ prompts, culturalContext, timeOfDay, onSelectPrompt }: PromptsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categorizedPrompts = prompts.filter(prompt => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'cultural') return prompt.culturalContext !== 'universal';
    if (selectedCategory === 'time') return prompt.timeContext === timeOfDay;
    return prompt.emotionalContainer === selectedCategory;
  });

  return (
    <div className="prompts-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Sacred Prompts for Reflection
        </h2>
        <p className="text-presence text-secondary">
          Choose a prompt that resonates with your heart and share your reflection for witnessing.
        </p>
      </div>

      {/* Category Filter */}
      <div className="prompt-categories mb-gentle">
        <div className="flex gap-whisper flex-wrap">
          {['all', 'gentle_opening', 'deep_exploration', 'joyful_celebration', 'cultural', 'time'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-breath py-whisper rounded-breath text-breath transition-all timing-breath ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-healing-mist text-secondary hover:bg-tender-embrace'
              }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-gentle md:grid-cols-2">
        {categorizedPrompts.map(prompt => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onSelect={() => onSelectPrompt(prompt)}
          />
        ))}
      </div>
    </div>
  );
}

// ===== PROMPT CARD COMPONENT =====

interface PromptCardProps {
  prompt: WitnessingPrompt;
  onSelect: () => void;
}

function PromptCard({ prompt, onSelect }: PromptCardProps) {
  const getContainerIcon = (container: WitnessingPrompt['emotionalContainer']) => {
    const iconMap = {
      'gentle_opening': '🌱',
      'deep_exploration': '🔍',
      'joyful_celebration': '✨',
      'challenge_processing': '🌊',
      'wisdom_seeking': '🦉'
    };
    return iconMap[container];
  };

  return (
    <div className="prompt-card surface-elevated-gentle p-gentle rounded-gentle border border-healing-mist hover:shadow-breath transition-all timing-breath">
      <div className="flex items-start gap-breath mb-gentle">
        <span className="text-xl">{getContainerIcon(prompt.emotionalContainer)}</span>
        <div className="flex-1">
          <div className="flex items-center gap-whisper mb-whisper">
            <span className="text-whisper bg-healing-mist px-whisper py-whisper rounded-breath">
              {prompt.culturalContext}
            </span>
            <span className="text-whisper bg-tender-embrace px-whisper py-whisper rounded-breath">
              {prompt.timeContext}
            </span>
          </div>
        </div>
      </div>

      <p className="text-presence text-primary font-presence leading-spacious mb-gentle italic">
        "{prompt.prompt}"
      </p>

      {prompt.backgroundWisdom && (
        <p className="text-breath text-secondary leading-spacious mb-gentle">
          {prompt.backgroundWisdom}
        </p>
      )}

      {prompt.healingFocus && (
        <div className="mb-gentle">
          <div className="flex gap-whisper flex-wrap">
            {prompt.healingFocus.map(focus => (
              <span key={focus} className="text-whisper bg-moon-whisper px-whisper py-whisper rounded-breath">
                {focus.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onSelect}
        className="sacred-button intention-sacred w-full"
      >
        <span className="mr-whisper">✍️</span>
        Reflect with this prompt
      </button>
    </div>
  );
}

// ===== SHARE REFLECTION VIEW =====

interface ShareReflectionViewProps {
  selectedPrompt: WitnessingPrompt | null;
  newReflection: string;
  setNewReflection: (value: string) => void;
  witnessingInvitation: string;
  setWitnessingInvitation: (value: string) => void;
  onShare: () => void;
  onCancel: () => void;
}

function ShareReflectionView({
  selectedPrompt,
  newReflection,
  setNewReflection,
  witnessingInvitation,
  setWitnessingInvitation,
  onShare,
  onCancel
}: ShareReflectionViewProps) {
  return (
    <div className="share-reflection-view">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Share Your Sacred Reflection
        </h2>
        <p className="text-presence text-secondary">
          Offer your reflection to the community for gentle witnessing and support.
        </p>
      </div>

      {/* Selected Prompt */}
      {selectedPrompt && (
        <div className="selected-prompt bg-healing-mist p-gentle rounded-gentle mb-ritual">
          <h4 className="text-grounding font-presence text-primary mb-breath">
            Reflecting on:
          </h4>
          <p className="text-presence text-secondary italic leading-spacious">
            "{selectedPrompt.prompt}"
          </p>
        </div>
      )}

      {/* Reflection Content */}
      <div className="mb-ritual">
        <label className="block text-presence font-presence text-primary mb-breath">
          Your Sacred Reflection
        </label>
        <textarea
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          placeholder="Let your reflection flow here... What wants to be witnessed?"
          className="w-full p-gentle border border-healing-mist rounded-breath resize-none h-32 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Witnessing Invitation */}
      <div className="mb-ritual">
        <label className="block text-presence font-presence text-primary mb-breath">
          How would you like to be witnessed?
        </label>
        <textarea
          value={witnessingInvitation}
          onChange={(e) => setWitnessingInvitation(e.target.value)}
          placeholder="Guide your witnesses... What kind of response would feel most supportive?"
          className="w-full p-gentle border border-healing-mist rounded-breath resize-none h-20 focus:outline-none focus:border-primary"
        />
        <p className="text-breath text-tertiary mt-whisper">
          Example: "I would love gentle affirmation" or "Share if this resonates with your experience"
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-gentle justify-end">
        <button
          onClick={onCancel}
          className="sacred-button intention-gentle"
        >
          Close the space
        </button>
        <button
          onClick={onShare}
          disabled={!newReflection.trim() || !witnessingInvitation.trim()}
          className="sacred-button intention-sacred disabled:opacity-50"
        >
          <span className="mr-whisper">🕊️</span>
          Share for witnessing
        </button>
      </div>
    </div>
  );
}

// ===== MY REFLECTIONS VIEW =====

interface MyReflectionsViewProps {
  reflections: WitnessedReflection[];
  userId: string;
}

function MyReflectionsView({ reflections, userId }: MyReflectionsViewProps) {
  if (reflections.length === 0) {
    return (
      <div className="text-center py-sanctuary">
        <div className="text-4xl mb-gentle">📝</div>
        <h3 className="text-ceremonial font-grounding text-primary mb-breath">
          Your Sacred Reflection Collection
        </h3>
        <p className="text-presence text-secondary mb-ritual">
          Your shared reflections and the witnesses they've received will appear here.
        </p>
        <button
          onClick={() => {/* Switch to share view */}}
          className="sacred-button intention-sacred"
        >
          Share your first reflection
        </button>
      </div>
    );
  }

  return (
    <div className="my-reflections">
      <div className="mb-ritual">
        <h2 className="text-ceremonial font-grounding text-primary mb-breath">
          Your Sacred Reflections
        </h2>
        <p className="text-presence text-secondary">
          See how your reflections have been received and witnessed by the community.
        </p>
      </div>

      <div className="space-y-ritual">
        {reflections.map(reflection => (
          <div key={reflection.id} className="my-reflection-card surface-card-gentle p-ritual rounded-gentle border border-healing-mist">
            <div className="flex items-start justify-between mb-gentle">
              <div>
                <p className="text-breath text-tertiary mb-whisper">
                  Shared {new Date(reflection.createdAt).toLocaleDateString()}
                </p>
                {reflection.sacredPrompt && (
                  <p className="text-breath text-secondary italic">
                    "{reflection.sacredPrompt}"
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-breath text-primary font-presence">{reflection.witnesses.length} witnesses</p>
                <p className="text-whisper text-tertiary">{reflection.viewCount} views</p>
              </div>
            </div>

            <p className="text-presence text-primary leading-spacious mb-gentle">
              {reflection.content}
            </p>

            {reflection.witnesses.length > 0 && (
              <div className="witnesses-summary">
                <h5 className="text-breath font-presence text-secondary mb-breath">Recent Witnesses:</h5>
                <div className="space-y-breath">
                  {reflection.witnesses.slice(0, 2).map(witness => (
                    <div key={witness.id} className="witness-summary bg-moon-whisper p-breath rounded-breath">
                      <div className="flex items-center justify-between mb-whisper">
                        <span className="text-breath font-presence text-primary">{witness.witnessName}</span>
                        <span className="text-whisper text-tertiary">
                          {new Date(witness.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {witness.content && (
                        <p className="text-breath text-secondary">{witness.content}</p>
                      )}
                    </div>
                  ))}
                  {reflection.witnesses.length > 2 && (
                    <p className="text-breath text-tertiary">
                      +{reflection.witnesses.length - 2} more witnesses
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SacredWitnessingSpace;