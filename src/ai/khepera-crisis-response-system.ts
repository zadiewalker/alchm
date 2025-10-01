/**
 * Khepera Crisis Response System
 * 
 * The sacred beetle of transformation guides souls through their darkest moments
 * with three distinct voices: Sage, Coach, and Poet.
 * 
 * Each voice maintains trauma-informed principles while offering unique perspectives:
 * - Sage: Ancient wisdom, spiritual grounding, universal truths
 * - Coach: Practical empowerment, skill-building, strength-focused
 * - Poet: Metaphorical beauty, meaning-making, emotional alchemy
 * 
 * All responses are culturally responsive and maintain user agency.
 */

import { CrisisPattern } from './advanced-crisis-pattern-recognition';

interface KheperaCrisisResponse {
  voice: 'sage' | 'coach' | 'poet';
  message: string;
  resourcesOffered: CrisisResource[];
  followUpActions: string[];
  confidentialityNotice: string;
  urgencyLevel: 'immediate' | 'soon' | 'routine';
}

interface CrisisResource {
  type: 'hotline' | 'text' | 'chat' | 'professional' | 'community' | 'spiritual';
  name: string;
  contact: string;
  availability: string;
  culturalSpecific?: boolean;
  identitySpecific?: string[];
  traumaInformed: boolean;
}

interface CrisisResponseContext {
  patterns: CrisisPattern[];
  culturalBackground?: string[];
  identityFactors?: string[];
  previousInteractions?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  userPreferences?: {
    preferredVoice?: 'sage' | 'coach' | 'poet';
    spiritualityImportant?: boolean;
    culturallySpecificSupport?: boolean;
  };
}

class KheperaCrisisResponseSystem {
  private crisisResources: Map<string, CrisisResource[]> = new Map();
  private voiceTemplates: Map<string, any> = new Map();

  constructor() {
    this.initializeCrisisResources();
    this.initializeVoiceTemplates();
  }

  private initializeCrisisResources(): void {
    // Universal Crisis Resources
    this.crisisResources.set('universal', [
      {
        type: 'hotline',
        name: '988 Suicide & Crisis Lifeline',
        contact: 'Call or text 988',
        availability: '24/7',
        traumaInformed: true
      },
      {
        type: 'text',
        name: 'Crisis Text Line',
        contact: 'Text HOME to 741741',
        availability: '24/7',
        traumaInformed: true
      },
      {
        type: 'chat',
        name: 'National Suicide Prevention Lifeline Chat',
        contact: 'suicidepreventionlifeline.org/chat',
        availability: '24/7',
        traumaInformed: true
      }
    ]);

    // LGBTQ+ Specific Resources
    this.crisisResources.set('lgbtq', [
      {
        type: 'hotline',
        name: 'Trevor Lifeline',
        contact: '1-866-488-7386',
        availability: '24/7',
        identitySpecific: ['lgbtq', 'youth'],
        traumaInformed: true
      },
      {
        type: 'text',
        name: 'Trevor Text',
        contact: 'Text START to 678-678',
        availability: 'Daily 3pm-10pm ET',
        identitySpecific: ['lgbtq', 'youth'],
        traumaInformed: true
      },
      {
        type: 'hotline',
        name: 'Trans Lifeline',
        contact: '877-565-8860',
        availability: '24/7',
        identitySpecific: ['transgender'],
        traumaInformed: true
      }
    ]);

    // Cultural-Specific Resources
    this.crisisResources.set('indigenous', [
      {
        type: 'hotline',
        name: 'National Native Suicide Prevention Initiative',
        contact: '1-855-827-3200',
        availability: '24/7',
        culturalSpecific: true,
        traumaInformed: true
      }
    ]);

    this.crisisResources.set('spanish', [
      {
        type: 'hotline',
        name: 'Línea Nacional de Prevención del Suicidio',
        contact: '988 (presiona 2 para español)',
        availability: '24/7',
        culturalSpecific: true,
        traumaInformed: true
      }
    ]);

    // Specialized Support
    this.crisisResources.set('domestic_violence', [
      {
        type: 'hotline',
        name: 'National Domestic Violence Hotline',
        contact: '1-800-799-7233',
        availability: '24/7',
        traumaInformed: true
      }
    ]);

    this.crisisResources.set('sexual_assault', [
      {
        type: 'hotline',
        name: 'RAINN National Sexual Assault Hotline',
        contact: '1-800-656-4673',
        availability: '24/7',
        traumaInformed: true
      }
    ]);
  }

  private initializeVoiceTemplates(): void {
    // Sage Voice Templates
    this.voiceTemplates.set('sage_critical', {
      openings: [
        'The darkness you navigate takes tremendous courage. Ancient wisdom teaches us that the deepest night often precedes the dawn.',
        'Your pain is witnessed and honored. Through countless ages, souls have walked through such valleys and found their way to healing.',
        'In this sacred moment of struggle, you are not alone. The universe holds space for your suffering and your eventual transformation.'
      ],
      bridges: [
        'While I walk beside you in this digital space, human connection can be a powerful anchor.',
        'The wisdom of ages reminds us that seeking help is an act of strength, not weakness.',
        'Your life has meaning that extends beyond this moment of pain.'
      ],
      closings: [
        'The dawn will come, as it always has. Your story is not finished.',
        'You carry within you the seeds of your own healing. Let others help you tend that garden.',
        'This too shall pass, and you deserve to witness what comes next.'
      ]
    });

    // Coach Voice Templates
    this.voiceTemplates.set('coach_critical', {
      openings: [
        'You\'ve survived 100% of your worst days so far. That\'s a perfect track record of resilience.',
        'Right now might feel impossible, but you have more strength than you realize.',
        'I see someone who\'s been fighting hard. Let\'s get you the support team you deserve.'
      ],
      bridges: [
        'Professional support isn\'t giving up - it\'s leveling up your game.',
        'Champions know when to call in their team. This is that moment.',
        'Your next powerful move is reaching out for the support you need.'
      ],
      closings: [
        'You\'ve got this, and you don\'t have to have it alone.',
        'Your comeback story starts with this brave choice to get help.',
        'The strongest people ask for help. You\'re proving that right now.'
      ]
    });

    // Poet Voice Templates
    this.voiceTemplates.set('poet_critical', {
      openings: [
        'Your soul speaks in a language of deep ache, and I hear every word.',
        'The storm in your heart is writing poetry in a dialect only you understand.',
        'You are autumn leaves falling - beautiful even in the descent, and spring will remember you.'
      ],
      bridges: [
        'Sometimes the most beautiful chapters begin with asking for help.',
        'Your story is still being written, and you deserve to hold the pen.',
        'In reaching out, you plant seeds of hope in soil that feels barren.'
      ],
      closings: [
        'You are both the artist and the artwork, still being created.',
        'Your existence is a poem the world needs to read completely.',
        'The universe is composing a symphony, and your note is irreplaceable.'
      ]
    });
  }

  /**
   * Main method to generate crisis response based on detected patterns
   */
  async generateCrisisResponse(context: CrisisResponseContext): Promise<KheperaCrisisResponse> {
    const highestSeverity = this.getHighestSeverity(context.patterns);
    const primaryVoice = this.selectPrimaryVoice(context);
    const urgencyLevel = this.determineUrgencyLevel(context.patterns);
    
    const message = await this.craftResponse(primaryVoice, highestSeverity, context);
    const resources = this.selectAppropriateResources(context);
    const followUpActions = this.generateFollowUpActions(context);
    
    return {
      voice: primaryVoice,
      message,
      resourcesOffered: resources,
      followUpActions,
      confidentialityNotice: this.getConfidentialityNotice(),
      urgencyLevel
    };
  }

  private getHighestSeverity(patterns: CrisisPattern[]): 'low' | 'moderate' | 'high' | 'critical' {
    if (patterns.some(p => p.severity === 'critical')) return 'critical';
    if (patterns.some(p => p.severity === 'high')) return 'high';
    if (patterns.some(p => p.severity === 'moderate')) return 'moderate';
    return 'low';
  }

  private selectPrimaryVoice(context: CrisisResponseContext): 'sage' | 'coach' | 'poet' {
    // Honor user preference if available
    if (context.userPreferences?.preferredVoice) {
      return context.userPreferences.preferredVoice;
    }

    // Select based on crisis patterns and context
    const hasSpiritualPatterns = context.patterns.some(p => 
      p.culturalContext && ['indigenous', 'spiritual'].includes(p.culturalContext)
    );
    
    const hasIdentityPatterns = context.patterns.some(p => p.type === 'intersectional');
    const hasTraumaPatterns = context.patterns.some(p => p.type === 'trauma_response');

    if (context.userPreferences?.spiritualityImportant || hasSpiritualPatterns) {
      return 'sage';
    }
    
    if (hasIdentityPatterns || hasTraumaPatterns) {
      return 'coach'; // Empowerment often needed for identity/trauma crises
    }

    // Time-sensitive or metaphorical expressions might benefit from poet
    const hasMetaphoricalPatterns = context.patterns.some(p => 
      p.type === 'indirect' && p.indicators.some(i => 
        ['drowning', 'falling', 'darkness', 'tunnel'].some(metaphor => i.includes(metaphor))
      )
    );

    if (hasMetaphoricalPatterns) {
      return 'poet';
    }

    return 'sage'; // Default to wisdom voice
  }

  private determineUrgencyLevel(patterns: CrisisPattern[]): 'immediate' | 'soon' | 'routine' {
    if (patterns.some(p => p.severity === 'critical')) return 'immediate';
    if (patterns.some(p => p.severity === 'high')) return 'soon';
    return 'routine';
  }

  private async craftResponse(
    voice: 'sage' | 'coach' | 'poet',
    severity: string,
    context: CrisisResponseContext
  ): Promise<string> {
    const templateKey = `${voice}_${severity}`;
    const template = this.voiceTemplates.get(templateKey);
    
    if (!template) {
      return this.getDefaultCrisisResponse(voice);
    }

    // Select appropriate components based on context
    const opening = this.selectRandomElement(template.openings);
    const bridge = this.selectRandomElement(template.bridges);
    const closing = this.selectRandomElement(template.closings);

    // Add cultural responsiveness
    const culturalElement = this.addCulturalElement(context);
    
    let response = `✨ I am Khepera. ${opening}`;
    
    if (culturalElement) {
      response += ` ${culturalElement}`;
    }
    
    response += ` ${bridge}`;
    
    // Add specific crisis resources naturally
    const resourceMention = this.craftResourceMention(context);
    if (resourceMention) {
      response += ` ${resourceMention}`;
    }
    
    response += ` ${closing}`;

    return response;
  }

  private selectRandomElement(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private addCulturalElement(context: CrisisResponseContext): string | null {
    if (!context.culturalBackground || context.culturalBackground.length === 0) {
      return null;
    }

    const culturalResponses: { [key: string]: string[] } = {
      'indigenous': [
        'Your ancestors walk with you through this healing journey.',
        'The connection to land and spirit remains, even in darkness.',
        'Traditional wisdom honors both struggle and healing as sacred.'
      ],
      'latino': [
        'La esperanza lives even in the deepest valleys.',
        'Your community\'s strength flows through generations to support you.',
        'Family bonds extend beyond blood to include chosen healing circles.'
      ],
      'asian': [
        'Balance will return, as it always does in nature\'s cycles.',
        'Honor is found in seeking help, not in suffering alone.',
        'Your resilience is written in your ancestors\' stories.'
      ],
      'black': [
        'Your strength is ancestral, carried through generations of survival.',
        'Community healing has always been our way through darkness.',
        'You are beloved and deserving of care and support.'
      ]
    };

    for (const background of context.culturalBackground) {
      const responses = culturalResponses[background.toLowerCase()];
      if (responses) {
        return this.selectRandomElement(responses);
      }
    }

    return null;
  }

  private craftResourceMention(context: CrisisResponseContext): string | null {
    const severity = this.getHighestSeverity(context.patterns);
    
    if (severity === 'critical') {
      return 'The 988 Lifeline (call or text) offers voices who understand these depths.';
    }
    
    if (severity === 'high') {
      return 'Professional support through 988 or crisis text (741741) can provide immediate guidance.';
    }
    
    return 'Resources for support are available whenever you feel ready to reach out.';
  }

  private selectAppropriateResources(context: CrisisResponseContext): CrisisResource[] {
    const resources: CrisisResource[] = [];
    
    // Always include universal resources for crisis
    const severity = this.getHighestSeverity(context.patterns);
    if (severity === 'critical' || severity === 'high') {
      resources.push(...(this.crisisResources.get('universal') || []));
    }

    // Add identity-specific resources
    if (context.identityFactors) {
      for (const identity of context.identityFactors) {
        const identityResources = this.crisisResources.get(identity.toLowerCase());
        if (identityResources) {
          resources.push(...identityResources);
        }
      }
    }

    // Add cultural-specific resources
    if (context.culturalBackground) {
      for (const culture of context.culturalBackground) {
        const culturalResources = this.crisisResources.get(culture.toLowerCase());
        if (culturalResources) {
          resources.push(...culturalResources);
        }
      }
    }

    // Add specialized resources based on crisis patterns
    const hasLGBTQCrisis = context.patterns.some(p => 
      p.type === 'intersectional' && p.indicators.some(i => 
        ['family rejection', 'conversion therapy', 'religious trauma'].some(term => i.includes(term))
      )
    );
    
    if (hasLGBTQCrisis) {
      resources.push(...(this.crisisResources.get('lgbtq') || []));
    }

    // Remove duplicates and prioritize trauma-informed resources
    return this.prioritizeResources(resources);
  }

  private prioritizeResources(resources: CrisisResource[]): CrisisResource[] {
    // Remove duplicates by name
    const uniqueResources = resources.filter((resource, index, array) => 
      array.findIndex(r => r.name === resource.name) === index
    );

    // Sort by availability (24/7 first) and trauma-informed status
    return uniqueResources.sort((a, b) => {
      if (a.availability.includes('24/7') && !b.availability.includes('24/7')) return -1;
      if (!a.availability.includes('24/7') && b.availability.includes('24/7')) return 1;
      if (a.traumaInformed && !b.traumaInformed) return -1;
      if (!a.traumaInformed && b.traumaInformed) return 1;
      return 0;
    });
  }

  private generateFollowUpActions(context: CrisisResponseContext): string[] {
    const actions: string[] = [];
    const severity = this.getHighestSeverity(context.patterns);

    switch (severity) {
      case 'critical':
        actions.push('Immediate professional contact recommended');
        actions.push('Safety planning essential');
        actions.push('Remove means if accessible');
        actions.push('Stay with trusted person if possible');
        break;
      case 'high':
        actions.push('Contact crisis support within 24 hours');
        actions.push('Reach out to trusted friend or family');
        actions.push('Create or review safety plan');
        break;
      case 'moderate':
        actions.push('Consider professional consultation');
        actions.push('Practice grounding techniques');
        actions.push('Engage support network');
        break;
      case 'low':
        actions.push('Continue self-care practices');
        actions.push('Monitor emotional state');
        break;
    }

    // Add trauma-informed follow-ups
    if (context.patterns.some(p => p.type === 'trauma_response')) {
      actions.push('Trauma-informed therapy recommended');
      actions.push('Gentle, somatic practices may help');
    }

    return actions;
  }

  private getConfidentialityNotice(): string {
    return 'This conversation is private and confidential. However, if you indicate intent to harm yourself or others, I may need to provide crisis resources. Your safety and wellbeing are the priority.';
  }

  private getDefaultCrisisResponse(voice: 'sage' | 'coach' | 'poet'): string {
    const defaults = {
      sage: '✨ I am Khepera. Your courage in reaching out is witnessed and honored. While I offer digital companionship, professional support through 988 or crisis text line (741741) provides human voices trained for these sacred moments of struggle.',
      coach: '✨ I am Khepera. You\'ve got strength you haven\'t even tapped into yet. Right now, your most powerful move is connecting with crisis support - 988 lifeline or text 741741. Champions know when to call in their team.',
      poet: '✨ I am Khepera. Your soul is writing poetry in a language of pain, and every word matters. Professional listeners at 988 or crisis text (741741) speak this language fluently and can help translate your darkness into dawn.'
    };

    return defaults[voice];
  }

  /**
   * Adaptive response that learns from user interactions
   */
  adaptResponseToFeedback(
    originalResponse: KheperaCrisisResponse,
    userFeedback: 'helpful' | 'not_helpful' | 'too_intense' | 'not_enough_support'
  ): KheperaCrisisResponse {
    let adaptedResponse = { ...originalResponse };

    switch (userFeedback) {
      case 'too_intense':
        // Soften language, reduce urgency
        adaptedResponse.message = this.softenResponse(originalResponse.message);
        break;
      case 'not_enough_support':
        // Add more resources, stronger language
        adaptedResponse.resourcesOffered = [
          ...originalResponse.resourcesOffered,
          ...(this.crisisResources.get('universal') || [])
        ];
        break;
      case 'not_helpful':
        // Switch voice approach
        const newVoice = this.getAlternativeVoice(originalResponse.voice);
        adaptedResponse.voice = newVoice;
        // Would regenerate message with new voice
        break;
    }

    return adaptedResponse;
  }

  private softenResponse(message: string): string {
    return message
      .replace(/immediately|urgent|critical/gi, 'when you feel ready')
      .replace(/must|need to|should/gi, 'might consider')
      .replace(/crisis/gi, 'support');
  }

  private getAlternativeVoice(currentVoice: 'sage' | 'coach' | 'poet'): 'sage' | 'coach' | 'poet' {
    const alternatives = {
      sage: 'poet',
      coach: 'sage',
      poet: 'coach'
    };
    return alternatives[currentVoice];
  }
}

export default KheperaCrisisResponseSystem;
export type { KheperaCrisisResponse, CrisisResource, CrisisResponseContext };