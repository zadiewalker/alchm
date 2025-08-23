// ALCHM Collaborative Reflection System
// Sacred peer learning spaces that honor safety, consent, and diverse ways of sharing
// Designed for trauma-informed community building and collective healing

export interface CollaborativeSpace {
  id: string;
  name: string;
  type: 'circle' | 'gallery' | 'story_exchange' | 'wisdom_pool' | 'action_planning';
  theme: string;
  description: string;
  facilitationStyle: 'peer_led' | 'guided' | 'self_organizing' | 'ceremonial';
  privacyLevel: 'anonymous' | 'first_name' | 'chosen_identity' | 'full_identity';
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'latino_hispanic' | 'asian_pacific' | 'lgbtq_plus' | 'neurodivergent' | 'multi_cultural';
  accessRequirements: string[];
  safetyProtocols: string[];
  participationModes: ParticipationMode[];
  maxParticipants?: number;
  duration: '15_minutes' | '30_minutes' | '60_minutes' | 'ongoing';
  moderationLevel: 'peer_accountability' | 'ai_assisted' | 'educator_present' | 'community_guided';
}

export interface ParticipationMode {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  supportProvided: string[];
}

export interface SharedReflection {
  id: string;
  authorId: string;
  authorIdentity: string; // Based on chosen privacy level
  spaceId: string;
  content: string;
  reflectionType: 'story' | 'question' | 'wisdom' | 'celebration' | 'challenge' | 'vision';
  culturalElements?: string[];
  triggerWarnings?: string[];
  supportRequested?: string[];
  timestamp: Date;
  reactions: ReflectionReaction[];
  responses: ReflectionResponse[];
  visibility: 'public' | 'circle_only' | 'selected_peers';
  moderation: {
    flagged: boolean;
    reviewStatus: 'pending' | 'approved' | 'needs_support' | 'archived';
    supportProvided?: string[];
  };
}

export interface ReflectionReaction {
  type: 'witness' | 'solidarity' | 'gratitude' | 'resonance' | 'offer_support';
  fromUserId: string;
  fromIdentity: string;
  timestamp: Date;
  message?: string;
}

export interface ReflectionResponse {
  id: string;
  fromUserId: string;
  fromIdentity: string;
  content: string;
  responseType: 'encouragement' | 'shared_experience' | 'wisdom_offering' | 'question' | 'resources';
  timestamp: Date;
}

// ===== COLLABORATIVE SPACE DEFINITIONS =====

export const COLLABORATIVE_SPACES: CollaborativeSpace[] = [
  {
    id: 'morning-intentions-circle',
    name: 'Morning Intentions Circle',
    type: 'circle',
    theme: 'Setting daily intentions and offering mutual support',
    description: 'Sacred space to share what you\'re bringing to the day and receive encouragement from peers',
    facilitationStyle: 'ceremonial',
    privacyLevel: 'chosen_identity',
    culturalContext: 'universal',
    accessRequirements: ['consent_acknowledgment'],
    safetyProtocols: [
      'Speak from personal experience only',
      'Listen with sacred attention',
      'Honor all sharing as sacred',
      'Maintain confidentiality'
    ],
    participationModes: [
      {
        id: 'verbal_sharing',
        name: 'Voice Sharing',
        description: 'Share intentions verbally with the circle',
        requirements: ['microphone_access'],
        supportProvided: ['active_listening', 'verbal_encouragement']
      },
      {
        id: 'text_sharing',
        name: 'Written Sharing',
        description: 'Share intentions through text for reading aloud or silent witnessing',
        requirements: [],
        supportProvided: ['text_responses', 'emoji_reactions']
      },
      {
        id: 'silent_witness',
        name: 'Silent Witnessing',
        description: 'Hold space for others without sharing your own intention',
        requirements: [],
        supportProvided: ['presence', 'energy_holding']
      }
    ],
    maxParticipants: 12,
    duration: '15_minutes',
    moderationLevel: 'peer_accountability'
  },

  {
    id: 'story-medicine-exchange',
    name: 'Story Medicine Exchange',
    type: 'story_exchange',
    theme: 'Sharing stories of resilience, culture, and healing',
    description: 'Intergenerational storytelling space where personal narratives become medicine for the community',
    facilitationStyle: 'peer_led',
    privacyLevel: 'first_name',
    culturalContext: 'multi_cultural',
    accessRequirements: ['story_preparation', 'cultural_humility_agreement'],
    safetyProtocols: [
      'Honor cultural protocols around storytelling',
      'Ask permission before responding to cultural stories',
      'Distinguish between sharing and appropriating',
      'Support storytellers with presence and gratitude'
    ],
    participationModes: [
      {
        id: 'story_sharing',
        name: 'Story Sharing',
        description: 'Share a personal story that carries medicine for others',
        requirements: ['story_reflection', 'boundary_setting'],
        supportProvided: ['witness_circle', 'gratitude_expressions', 'follow_up_support']
      },
      {
        id: 'story_witnessing',
        name: 'Story Witnessing',
        description: 'Hold sacred space for stories being shared',
        requirements: ['active_listening_commitment'],
        supportProvided: ['presence_holding', 'gratitude_offering']
      },
      {
        id: 'wisdom_reflecting',
        name: 'Wisdom Reflecting',
        description: 'Offer reflections on themes and wisdom that emerge',
        requirements: ['cultural_humility'],
        supportProvided: ['theme_synthesis', 'connection_making']
      }
    ],
    maxParticipants: 8,
    duration: '60_minutes',
    moderationLevel: 'community_guided'
  },

  {
    id: 'solidarity-action-planning',
    name: 'Solidarity Action Planning',
    type: 'action_planning',
    theme: 'Collective organizing for justice and community care',
    description: 'Youth-led space for planning actions that serve liberation and community healing',
    facilitationStyle: 'self_organizing',
    privacyLevel: 'chosen_identity',
    culturalContext: 'universal',
    accessRequirements: ['social_justice_orientation', 'consensus_agreement'],
    safetyProtocols: [
      'Center directly impacted voices',
      'Practice trauma-informed organizing',
      'Respect different levels of risk tolerance',
      'Support collective decision-making'
    ],
    participationModes: [
      {
        id: 'action_planning',
        name: 'Action Planning',
        description: 'Collaborate on planning community actions and campaigns',
        requirements: ['organizing_experience', 'time_commitment'],
        supportProvided: ['skill_sharing', 'resource_pooling', 'accountability_partnerships']
      },
      {
        id: 'skill_sharing',
        name: 'Skill Sharing',
        description: 'Teach and learn organizing skills from peers',
        requirements: ['specific_skill'],
        supportProvided: ['learning_support', 'practice_opportunities']
      },
      {
        id: 'support_offering',
        name: 'Support Offering',
        description: 'Provide various forms of support for actions being planned',
        requirements: ['capacity_assessment'],
        supportProvided: ['resource_sharing', 'emotional_support', 'logistics_help']
      }
    ],
    maxParticipants: 15,
    duration: 'ongoing',
    moderationLevel: 'peer_accountability'
  },

  {
    id: 'healing-arts-gallery',
    name: 'Healing Arts Gallery',
    type: 'gallery',
    theme: 'Creative expression for processing and celebrating',
    description: 'Sacred gallery space for sharing art, music, poetry, and creative expressions of the healing journey',
    facilitationStyle: 'guided',
    privacyLevel: 'chosen_identity',
    culturalContext: 'universal',
    accessRequirements: ['creative_consent'],
    safetyProtocols: [
      'Honor all forms of creative expression',
      'Provide content guidance for sensitive themes',
      'Support artists with encouragement and witness',
      'Respect intellectual and cultural property'
    ],
    participationModes: [
      {
        id: 'art_sharing',
        name: 'Art Sharing',
        description: 'Share visual art, music, poetry, or other creative works',
        requirements: ['content_guidance_review'],
        supportProvided: ['witness_appreciation', 'artistic_feedback', 'emotional_support']
      },
      {
        id: 'collaborative_creating',
        name: 'Collaborative Creating',
        description: 'Work together on collective artistic expressions',
        requirements: ['collaboration_agreement'],
        supportProvided: ['co_creation_support', 'skill_exchange', 'shared_vision_building']
      },
      {
        id: 'art_witnessing',
        name: 'Art Witnessing',
        description: 'Experience and appreciate art shared by community members',
        requirements: [],
        supportProvided: ['mindful_viewing', 'appreciation_expression', 'artist_encouragement']
      }
    ],
    duration: 'ongoing',
    moderationLevel: 'ai_assisted'
  },

  {
    id: 'ancestral-wisdom-pool',
    name: 'Ancestral Wisdom Pool',
    type: 'wisdom_pool',
    theme: 'Sharing wisdom from elders, ancestors, and cultural traditions',
    description: 'Intergenerational space for collecting and sharing wisdom that guides healing and growth',
    facilitationStyle: 'ceremonial',
    privacyLevel: 'chosen_identity',
    culturalContext: 'multi_cultural',
    accessRequirements: ['cultural_respect_agreement', 'wisdom_preparation'],
    safetyProtocols: [
      'Honor the source of wisdom being shared',
      'Distinguish between sharing and appropriating',
      'Acknowledge when wisdom comes from closed cultural practices',
      'Express gratitude to wisdom keepers'
    ],
    participationModes: [
      {
        id: 'wisdom_sharing',
        name: 'Wisdom Sharing',
        description: 'Share wisdom from your cultural tradition, elders, or ancestors',
        requirements: ['cultural_permission', 'context_providing'],
        supportProvided: ['respectful_receiving', 'gratitude_expression', 'wisdom_preservation']
      },
      {
        id: 'wisdom_seeking',
        name: 'Wisdom Seeking',
        description: 'Ask questions and seek guidance from community wisdom',
        requirements: ['specific_question', 'openness_to_receive'],
        supportProvided: ['wisdom_offerings', 'resource_sharing', 'guidance_synthesis']
      },
      {
        id: 'wisdom_bridging',
        name: 'Wisdom Bridging',
        description: 'Help connect different wisdom traditions and modern applications',
        requirements: ['multi_cultural_awareness'],
        supportProvided: ['connection_making', 'synthesis_offering', 'application_support']
      }
    ],
    maxParticipants: 20,
    duration: 'ongoing',
    moderationLevel: 'community_guided'
  }
];

// ===== PARTICIPATION MODES SYSTEM =====

export const PARTICIPATION_MODES: { [key: string]: ParticipationMode } = {
  verbal_sharing: {
    id: 'verbal_sharing',
    name: 'Voice Sharing',
    description: 'Share through spoken word using voice chat or video',
    requirements: ['microphone_access', 'comfort_with_voice'],
    supportProvided: ['active_listening', 'verbal_encouragement', 'real_time_support']
  },
  
  text_sharing: {
    id: 'text_sharing',
    name: 'Written Expression',
    description: 'Share through written text that can be read aloud or silently',
    requirements: ['text_comfort'],
    supportProvided: ['written_responses', 'emoji_reactions', 'text_encouragement']
  },
  
  visual_sharing: {
    id: 'visual_sharing',
    name: 'Visual Expression',
    description: 'Share through images, drawings, or visual symbols',
    requirements: ['image_upload_capability'],
    supportProvided: ['visual_appreciation', 'symbolic_interpretation', 'artistic_encouragement']
  },
  
  silent_witness: {
    id: 'silent_witness',
    name: 'Silent Witnessing',
    description: 'Hold space and provide presence without sharing content',
    requirements: ['presence_commitment'],
    supportProvided: ['energy_holding', 'witness_presence', 'gratitude_receiving']
  },
  
  movement_expression: {
    id: 'movement_expression',
    name: 'Movement Expression',
    description: 'Share through dance, gesture, or embodied expression',
    requirements: ['video_access', 'movement_comfort'],
    supportProvided: ['embodied_witness', 'movement_mirroring', 'somatic_support']
  },
  
  question_offering: {
    id: 'question_offering',
    name: 'Question Offering',
    description: 'Contribute by asking thoughtful questions that deepen reflection',
    requirements: ['question_preparation'],
    supportProvided: ['question_responses', 'inquiry_expansion', 'wisdom_gathering']
  }
};

// ===== CULTURAL ADAPTATIONS =====

export const CULTURAL_SPACE_ADAPTATIONS = {
  indigenous: {
    ceremonyOpening: 'Land acknowledgment and gratitude to ancestors',
    sharingProtocol: 'Speaking stick or token passing',
    closingRitual: 'Gratitude circle and energy clearing',
    leadershipModel: 'Elder guidance with youth voice',
    decisionMaking: 'Consensus building with seven generations consideration'
  },
  
  african_diaspora: {
    ceremonyOpening: 'Call and response greeting or libation',
    sharingProtocol: 'Call and response or praise circle format',
    closingRitual: 'Ubuntu affirmation and collective blessing',
    leadershipModel: 'Rotating leadership with community accountability',
    decisionMaking: 'Community dialogue with elder consultation'
  },
  
  latino_hispanic: {
    ceremonyOpening: 'Corazón opening and family acknowledgment',
    sharingProtocol: 'Testimonio or story circle sharing',
    closingRitual: 'Blessing circle and community commitment',
    leadershipModel: 'Familia-style shared leadership',
    decisionMaking: 'Community dialogue with familia consideration'
  },
  
  asian_pacific: {
    ceremonyOpening: 'Mindful breathing and ancestor honoring',
    sharingProtocol: 'Respectful turn-taking with silence honoring',
    closingRitual: 'Gratitude practice and harmony intention',
    leadershipModel: 'Collective leadership with elder respect',
    decisionMaking: 'Consensus building with harmony seeking'
  },
  
  lgbtq_plus: {
    ceremonyOpening: 'Name and pronoun sharing with chosen family acknowledgment',
    sharingProtocol: 'Brave space agreements with identity affirmation',
    closingRitual: 'Pride affirmation and community commitment',
    leadershipModel: 'Rotating leadership with identity representation',
    decisionMaking: 'Consensus with intersectional analysis'
  },
  
  neurodivergent: {
    ceremonyOpening: 'Sensory check-in and accommodation setting',
    sharingProtocol: 'Multiple communication methods with processing time',
    closingRitual: 'Energy regulation and transition support',
    leadershipModel: 'Accessible leadership with diverse communication styles',
    decisionMaking: 'Accessible processes with multiple input methods'
  }
};

// ===== SAFETY AND MODERATION SYSTEM =====

export interface SafetyProtocol {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  responseActions: string[];
  escalationPath: string[];
}

export const SAFETY_PROTOCOLS: SafetyProtocol[] = [
  {
    id: 'content_guidance',
    name: 'Content Guidance and Trigger Warnings',
    description: 'Proactive support for content that may be activating',
    triggerConditions: ['trauma_content', 'violence_mention', 'self_harm_reference'],
    responseActions: ['provide_content_warning', 'offer_support_resources', 'check_in_with_sharer'],
    escalationPath: ['peer_support', 'trained_moderator', 'crisis_intervention']
  },
  
  {
    id: 'boundary_violation',
    name: 'Boundary Violation Response',
    description: 'Addressing when community agreements are not honored',
    triggerConditions: ['personal_attack', 'cultural_appropriation', 'privacy_violation'],
    responseActions: ['pause_conversation', 'review_agreements', 'request_repair'],
    escalationPath: ['peer_accountability', 'moderator_intervention', 'space_restriction']
  },
  
  {
    id: 'crisis_intervention',
    name: 'Crisis Intervention Protocol',
    description: 'Immediate response to mental health crises',
    triggerConditions: ['self_harm_disclosure', 'suicidal_ideation', 'abuse_disclosure'],
    responseActions: ['immediate_support_offer', 'crisis_resource_sharing', 'follow_up_check_in'],
    escalationPath: ['trained_crisis_responder', 'professional_referral', 'emergency_services']
  }
];

// ===== COLLABORATIVE SPACE MANAGER =====

export class CollaborativeSpaceManager {
  
  static getAvailableSpaces(
    userAge: number,
    culturalContext: string,
    accessRequirements: string[]
  ): CollaborativeSpace[] {
    return COLLABORATIVE_SPACES.filter(space => {
      // Check cultural context match
      const cultureMatch = space.culturalContext === 'universal' || 
                          space.culturalContext === culturalContext ||
                          space.culturalContext === 'multi_cultural';
      
      // Check access requirements
      const accessMatch = space.accessRequirements.every(req => 
        accessRequirements.includes(req)
      );
      
      return cultureMatch && accessMatch;
    });
  }
  
  static validateParticipation(
    spaceId: string,
    participationMode: string,
    userCapabilities: string[]
  ): boolean {
    const space = COLLABORATIVE_SPACES.find(s => s.id === spaceId);
    if (!space) return false;
    
    const mode = space.participationModes.find(m => m.id === participationMode);
    if (!mode) return false;
    
    return mode.requirements.every(req => userCapabilities.includes(req));
  }
  
  static moderateContent(content: string, spaceContext: string): {
    needsReview: boolean;
    supportNeeded: boolean;
    triggerWarnings: string[];
    recommendations: string[];
  } {
    // AI-assisted content moderation focused on support rather than censorship
    const triggerPatterns = {
      trauma: /trauma|abuse|violence|assault/gi,
      selfHarm: /self.harm|cutting|suicide|kill myself/gi,
      substance: /drugs|alcohol|addiction/gi,
      mentalHealth: /depression|anxiety|panic|crisis/gi
    };
    
    const triggerWarnings: string[] = [];
    let needsReview = false;
    let supportNeeded = false;
    
    for (const [category, pattern] of Object.entries(triggerPatterns)) {
      if (pattern.test(content)) {
        triggerWarnings.push(category);
        if (category === 'selfHarm') {
          needsReview = true;
          supportNeeded = true;
        }
      }
    }
    
    const recommendations = this.generateSupportRecommendations(triggerWarnings);
    
    return {
      needsReview,
      supportNeeded,
      triggerWarnings,
      recommendations
    };
  }
  
  private static generateSupportRecommendations(triggers: string[]): string[] {
    const recommendations: string[] = [];
    
    if (triggers.includes('trauma')) {
      recommendations.push('Consider providing trauma-informed support resources');
    }
    
    if (triggers.includes('selfHarm')) {
      recommendations.push('Immediate crisis support may be needed');
      recommendations.push('Connect with trained crisis counselor');
    }
    
    if (triggers.includes('mentalHealth')) {
      recommendations.push('Offer mental health resources and peer support');
    }
    
    return recommendations;
  }
  
  static generateCulturalAdaptation(
    space: CollaborativeSpace,
    culturalContext: string
  ): any {
    const adaptation = CULTURAL_SPACE_ADAPTATIONS[culturalContext as keyof typeof CULTURAL_SPACE_ADAPTATIONS];
    
    if (!adaptation) return space;
    
    return {
      ...space,
      culturalProtocols: adaptation,
      facilitationStyle: this.adaptFacilitation(space.facilitationStyle, adaptation),
      safetyProtocols: [...space.safetyProtocols, ...this.getCulturalSafetyProtocols(culturalContext)]
    };
  }
  
  private static adaptFacilitation(style: string, adaptation: any): string {
    if (style === 'ceremonial') {
      return `${style}_with_cultural_protocols`;
    }
    return style;
  }
  
  private static getCulturalSafetyProtocols(culturalContext: string): string[] {
    const protocols: { [key: string]: string[] } = {
      indigenous: ['Honor sacred protocols', 'Acknowledge tribal sovereignty'],
      african_diaspora: ['Respect Ubuntu principles', 'Honor ancestral wisdom'],
      latino_hispanic: ['Honor familia connections', 'Respect testimonio tradition'],
      asian_pacific: ['Maintain harmony and respect', 'Honor elder wisdom'],
      lgbtq_plus: ['Respect chosen identity', 'Maintain brave space principles'],
      neurodivergent: ['Provide sensory accommodation', 'Honor diverse communication styles']
    };
    
    return protocols[culturalContext] || [];
  }
}

// ===== PEER SUPPORT SYSTEM =====

export interface PeerSupport {
  id: string;
  type: 'encouragement' | 'resource_sharing' | 'experience_sharing' | 'skill_exchange' | 'accountability';
  fromUser: string;
  toUser: string;
  spaceContext: string;
  content: string;
  resources?: string[];
  followUpOffered: boolean;
  timestamp: Date;
}

export class PeerSupportSystem {
  
  static generateSupportSuggestions(
    sharedReflection: SharedReflection,
    supporterProfile: any
  ): string[] {
    const suggestions: string[] = [];
    
    // Generate contextual support suggestions
    if (sharedReflection.supportRequested?.includes('encouragement')) {
      suggestions.push('Offer words of encouragement and validation');
    }
    
    if (sharedReflection.supportRequested?.includes('resources')) {
      suggestions.push('Share helpful resources or tools');
    }
    
    if (sharedReflection.supportRequested?.includes('experience')) {
      suggestions.push('Share a related experience if appropriate');
    }
    
    // Cultural context suggestions
    if (sharedReflection.culturalElements?.length) {
      suggestions.push('Honor cultural context in your response');
    }
    
    return suggestions;
  }
  
  static validateSupportResponse(
    support: PeerSupport,
    communityGuidelines: string[]
  ): boolean {
    // Validate that peer support follows community guidelines
    const validationChecks = [
      support.content.length > 10, // Substantive response
      !this.containsHarmfulContent(support.content),
      this.respectsCulturalBoundaries(support)
    ];
    
    return validationChecks.every(check => check);
  }
  
  private static containsHarmfulContent(content: string): boolean {
    const harmfulPatterns = [
      /you should|you need to|you must/gi,
      /just get over it|just think positive/gi,
      /that's not that bad|others have it worse/gi
    ];
    
    return harmfulPatterns.some(pattern => pattern.test(content));
  }
  
  private static respectsCulturalBoundaries(support: PeerSupport): boolean {
    // Check for cultural appropriation or insensitive responses
    // This would be more sophisticated in a real implementation
    return !support.content.toLowerCase().includes('spirit animal');
  }
}

// ===== EXPORTS =====

export {
  COLLABORATIVE_SPACES,
  PARTICIPATION_MODES,
  CULTURAL_SPACE_ADAPTATIONS,
  SAFETY_PROTOCOLS,
  CollaborativeSpaceManager,
  PeerSupportSystem
};