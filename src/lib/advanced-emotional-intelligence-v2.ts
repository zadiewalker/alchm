/**
 * ALCHM Advanced Emotional Intelligence System v2
 * Enhanced pattern recognition with cultural responsiveness and deeper wisdom
 */

export interface EmotionalPattern {
  id: string;
  name: string;
  description: string;
  indicators: string[];
  culturalVariations: Record<string, string[]>;
  severity: 'low' | 'medium' | 'high';
  growthOpportunities: string[];
  therapeuticApproaches: string[];
}

export interface EmotionalIntelligenceResult {
  primaryEmotions: {
    emotion: string;
    intensity: number;
    confidence: number;
    culturalContext: string[];
  }[];
  patterns: {
    pattern: EmotionalPattern;
    evidence: string[];
    confidence: number;
  }[];
  insights: {
    emotional: string[];
    behavioral: string[];
    cognitive: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  culturalConsiderations: string[];
  traumaInformed: {
    indicators: string[];
    resources: string[];
    safeguards: string[];
  };
}

export interface CulturalEmotionalContext {
  culture: string;
  emotionalExpression: 'direct' | 'indirect' | 'contextual';
  collectivism: 'individual' | 'collective' | 'mixed';
  authorityRelation: 'hierarchical' | 'egalitarian' | 'contextual';
  emotionalValidation: string[];
  healingTraditions: string[];
}

const CULTURAL_CONTEXTS: Record<string, CulturalEmotionalContext> = {
  'east-asian': {
    culture: 'East Asian',
    emotionalExpression: 'indirect',
    collectivism: 'collective',
    authorityRelation: 'hierarchical',
    emotionalValidation: ['harmony', 'balance', 'family honor', 'collective well-being'],
    healingTraditions: ['Traditional Chinese Medicine', 'mindfulness', 'ancestor wisdom', 'qi cultivation']
  },
  'latin': {
    culture: 'Latino/Hispanic',
    emotionalExpression: 'contextual',
    collectivism: 'collective',
    authorityRelation: 'hierarchical',
    emotionalValidation: ['family connection', 'emotional expression', 'community support', 'spiritual faith'],
    healingTraditions: ['curanderismo', 'sobadoras', 'prayer circles', 'family rituals']
  },
  'indigenous': {
    culture: 'Indigenous',
    emotionalExpression: 'contextual',
    collectivism: 'collective',
    authorityRelation: 'contextual',
    emotionalValidation: ['connection to nature', 'community healing', 'ancestral wisdom', 'spiritual balance'],
    healingTraditions: ['ceremony', 'plant medicine', 'storytelling', 'community circles']
  },
  'african': {
    culture: 'African/African-American',
    emotionalExpression: 'contextual',
    collectivism: 'collective',
    authorityRelation: 'contextual',
    emotionalValidation: ['community strength', 'resilience', 'spiritual connection', 'family bonds'],
    healingTraditions: ['communal healing', 'spiritual practices', 'music therapy', 'storytelling']
  },
  'western': {
    culture: 'Western',
    emotionalExpression: 'direct',
    collectivism: 'individual',
    authorityRelation: 'egalitarian',
    emotionalValidation: ['individual growth', 'self-expression', 'personal achievement', 'autonomy'],
    healingTraditions: ['talk therapy', 'cognitive approaches', 'medication', 'self-help']
  }
};

const EMOTIONAL_PATTERNS: EmotionalPattern[] = [
  {
    id: 'perfectionism',
    name: 'Perfectionist Tendencies',
    description: 'High standards that may become self-defeating',
    indicators: ['should', 'must', 'always', 'never', 'failure', 'mistake', 'not good enough'],
    culturalVariations: {
      'east-asian': ['honor', 'shame', 'family expectations', 'academic pressure'],
      'western': ['achievement', 'success', 'competition', 'self-criticism'],
      'latin': ['family pride', 'responsibility', 'respect', 'duty']
    },
    severity: 'medium',
    growthOpportunities: ['self-compassion', 'progress over perfection', 'failure reframing'],
    therapeuticApproaches: ['cognitive behavioral therapy', 'mindfulness', 'acceptance and commitment therapy']
  },
  {
    id: 'emotional_overwhelm',
    name: 'Emotional Overwhelm',
    description: 'Feeling flooded by intense emotions',
    indicators: ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'flood', 'intense'],
    culturalVariations: {
      'east-asian': ['imbalance', 'harmony disrupted', 'qi blocked'],
      'western': ['stressed', 'breakdown', 'burnout'],
      'indigenous': ['spirit disconnected', 'out of balance with nature'],
      'latin': ['nervios', 'susto', 'emotional burden']
    },
    severity: 'high',
    growthOpportunities: ['emotional regulation', 'grounding techniques', 'support seeking'],
    therapeuticApproaches: ['somatic therapy', 'mindfulness', 'nervous system regulation']
  },
  {
    id: 'isolation',
    name: 'Social Isolation',
    description: 'Feeling disconnected from others',
    indicators: ['alone', 'lonely', 'isolated', 'no one understands', 'disconnected'],
    culturalVariations: {
      'collective': ['family disconnection', 'community shame', 'cultural displacement'],
      'individual': ['social anxiety', 'introversion', 'independence struggle']
    },
    severity: 'medium',
    growthOpportunities: ['connection building', 'vulnerability practice', 'community engagement'],
    therapeuticApproaches: ['group therapy', 'community healing', 'social skills training']
  },
  {
    id: 'trauma_response',
    name: 'Trauma Response Patterns',
    description: 'Responses consistent with trauma processing',
    indicators: ['triggered', 'flashback', 'hypervigilant', 'numb', 'dissociate', 'frozen'],
    culturalVariations: {
      'indigenous': ['soul loss', 'spirit injury', 'ancestral trauma'],
      'african': ['historical trauma', 'racial trauma', 'systemic stress'],
      'latin': ['generational trauma', 'immigration trauma', 'family secrets']
    },
    severity: 'high',
    growthOpportunities: ['trauma integration', 'somatic healing', 'nervous system regulation'],
    therapeuticApproaches: ['EMDR', 'somatic experiencing', 'trauma-informed yoga', 'culturally specific healing']
  }
];

export class AdvancedEmotionalIntelligence {
  private patterns = EMOTIONAL_PATTERNS;
  private culturalContexts = CULTURAL_CONTEXTS;
  private emotionLexicon: Map<string, { 
    intensity: number; 
    category: string; 
    culturalNuances: Record<string, string> 
  }> = new Map();

  constructor() {
    this.initializeEmotionLexicon();
    console.log('🧠 Advanced Emotional Intelligence v2 initialized with cultural responsiveness');
  }

  private initializeEmotionLexicon(): void {
    const emotions = [
      // Joy family
      { word: 'happy', intensity: 0.6, category: 'joy' },
      { word: 'joyful', intensity: 0.8, category: 'joy' },
      { word: 'ecstatic', intensity: 0.95, category: 'joy' },
      { word: 'content', intensity: 0.4, category: 'joy' },
      { word: 'peaceful', intensity: 0.5, category: 'joy' },
      
      // Sadness family
      { word: 'sad', intensity: 0.6, category: 'sadness' },
      { word: 'depressed', intensity: 0.85, category: 'sadness' },
      { word: 'melancholy', intensity: 0.5, category: 'sadness' },
      { word: 'grief', intensity: 0.9, category: 'sadness' },
      { word: 'heartbroken', intensity: 0.9, category: 'sadness' },
      
      // Fear family
      { word: 'anxious', intensity: 0.7, category: 'fear' },
      { word: 'worried', intensity: 0.6, category: 'fear' },
      { word: 'terrified', intensity: 0.95, category: 'fear' },
      { word: 'nervous', intensity: 0.5, category: 'fear' },
      { word: 'panic', intensity: 0.9, category: 'fear' },
      
      // Anger family
      { word: 'angry', intensity: 0.7, category: 'anger' },
      { word: 'furious', intensity: 0.9, category: 'anger' },
      { word: 'frustrated', intensity: 0.6, category: 'anger' },
      { word: 'irritated', intensity: 0.4, category: 'anger' },
      { word: 'rage', intensity: 0.95, category: 'anger' },
      
      // Shame family
      { word: 'ashamed', intensity: 0.8, category: 'shame' },
      { word: 'guilty', intensity: 0.7, category: 'shame' },
      { word: 'embarrassed', intensity: 0.6, category: 'shame' },
      { word: 'humiliated', intensity: 0.9, category: 'shame' },
      
      // Complex emotions
      { word: 'conflicted', intensity: 0.6, category: 'complex' },
      { word: 'overwhelmed', intensity: 0.8, category: 'complex' },
      { word: 'empty', intensity: 0.7, category: 'complex' },
      { word: 'numb', intensity: 0.6, category: 'complex' }
    ];

    emotions.forEach(emotion => {
      this.emotionLexicon.set(emotion.word, {
        intensity: emotion.intensity,
        category: emotion.category,
        culturalNuances: this.getCulturalNuances(emotion.word)
      });
    });
  }

  private getCulturalNuances(emotion: string): Record<string, string> {
    const nuances: Record<string, Record<string, string>> = {
      'shame': {
        'east-asian': 'Loss of face, family dishonor',
        'latin': 'Vergüenza, family reflection',
        'indigenous': 'Community disconnection',
        'african': 'Community judgment'
      },
      'anger': {
        'east-asian': 'Disruption of harmony',
        'western': 'Boundary violation',
        'latin': 'Family disrespect',
        'african': 'Injustice response'
      },
      'sadness': {
        'indigenous': 'Soul grief, ancestral pain',
        'african': 'Historical sorrow',
        'latin': 'Corazón roto, deep heart pain',
        'east-asian': 'Imbalance of qi'
      }
    };

    return nuances[emotion] || {};
  }

  /**
   * Analyze emotional intelligence with cultural sensitivity
   */
  public analyzeEmotionalIntelligence(
    text: string,
    culturalContext?: string[],
    userLanguage: string = 'en'
  ): EmotionalIntelligenceResult {
    console.log('🧠 Analyzing emotional intelligence with cultural context:', culturalContext);
    
    const primaryEmotions = this.extractEmotions(text, culturalContext);
    const patterns = this.identifyPatterns(text, culturalContext);
    const insights = this.generateInsights(primaryEmotions, patterns, culturalContext);
    const recommendations = this.generateRecommendations(patterns, culturalContext);
    const culturalConsiderations = this.generateCulturalConsiderations(culturalContext, primaryEmotions);
    const traumaInformed = this.assessTraumaInformed(text, patterns);

    return {
      primaryEmotions,
      patterns,
      insights,
      recommendations,
      culturalConsiderations,
      traumaInformed
    };
  }

  private extractEmotions(text: string, culturalContext?: string[]): EmotionalIntelligenceResult['primaryEmotions'] {
    const lowerText = text.toLowerCase();
    const detectedEmotions: EmotionalIntelligenceResult['primaryEmotions'] = [];

    this.emotionLexicon.forEach((emotionData, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      
      if (matches) {
        const baseIntensity = emotionData.intensity;
        const contextModifier = this.getContextualModifier(text, word);
        const intensity = Math.min(baseIntensity * contextModifier, 1.0);
        
        detectedEmotions.push({
          emotion: word,
          intensity,
          confidence: this.calculateEmotionConfidence(text, word),
          culturalContext: this.getRelevantCulturalContext(word, culturalContext)
        });
      }
    });

    return detectedEmotions.sort((a, b) => (b.intensity * b.confidence) - (a.intensity * a.confidence));
  }

  private getContextualModifier(text: string, emotion: string): number {
    const intensifiers = ['very', 'extremely', 'incredibly', 'so', 'really', 'deeply'];
    const diminishers = ['slightly', 'somewhat', 'a bit', 'kind of', 'sort of'];
    
    const emotionIndex = text.toLowerCase().indexOf(emotion);
    const contextWindow = text.slice(Math.max(0, emotionIndex - 50), emotionIndex + 50).toLowerCase();
    
    let modifier = 1.0;
    
    intensifiers.forEach(intensifier => {
      if (contextWindow.includes(intensifier)) modifier += 0.3;
    });
    
    diminishers.forEach(diminisher => {
      if (contextWindow.includes(diminisher)) modifier -= 0.2;
    });
    
    return Math.max(0.1, Math.min(2.0, modifier));
  }

  private calculateEmotionConfidence(text: string, emotion: string): number {
    const contextClues = {
      'sad': ['cry', 'tear', 'hurt', 'pain', 'loss'],
      'happy': ['smile', 'laugh', 'joy', 'celebrate', 'grateful'],
      'angry': ['mad', 'furious', 'upset', 'annoyed'],
      'anxious': ['worry', 'stress', 'nervous', 'fear', 'panic']
    };
    
    const relevantClues = contextClues[emotion as keyof typeof contextClues] || [];
    const lowerText = text.toLowerCase();
    const supportingEvidence = relevantClues.filter(clue => lowerText.includes(clue)).length;
    
    return Math.min(0.95, 0.5 + (supportingEvidence * 0.15));
  }

  private getRelevantCulturalContext(emotion: string, culturalContext?: string[]): string[] {
    if (!culturalContext) return [];
    
    return culturalContext.filter(context => {
      const emotionData = this.emotionLexicon.get(emotion);
      return emotionData?.culturalNuances[context];
    });
  }

  private identifyPatterns(text: string, culturalContext?: string[]): EmotionalIntelligenceResult['patterns'] {
    const identifiedPatterns: EmotionalIntelligenceResult['patterns'] = [];
    
    this.patterns.forEach(pattern => {
      const evidence = this.findPatternEvidence(text, pattern, culturalContext);
      
      if (evidence.length > 0) {
        const confidence = this.calculatePatternConfidence(evidence, pattern);
        
        identifiedPatterns.push({
          pattern,
          evidence,
          confidence
        });
      }
    });

    return identifiedPatterns.sort((a, b) => b.confidence - a.confidence);
  }

  private findPatternEvidence(
    text: string, 
    pattern: EmotionalPattern, 
    culturalContext?: string[]
  ): string[] {
    const lowerText = text.toLowerCase();
    const evidence: string[] = [];
    
    // Check standard indicators
    pattern.indicators.forEach(indicator => {
      if (lowerText.includes(indicator.toLowerCase())) {
        evidence.push(`Standard indicator: "${indicator}"`);
      }
    });
    
    // Check cultural variations if context is provided
    if (culturalContext) {
      culturalContext.forEach(context => {
        const variations = pattern.culturalVariations[context];
        if (variations) {
          variations.forEach(variation => {
            if (lowerText.includes(variation.toLowerCase())) {
              evidence.push(`Cultural indicator (${context}): "${variation}"`);
            }
          });
        }
      });
    }
    
    return evidence;
  }

  private calculatePatternConfidence(evidence: string[], pattern: EmotionalPattern): number {
    const baseConfidence = Math.min(evidence.length * 0.25, 0.8);
    const severityMultiplier = { low: 0.8, medium: 1.0, high: 1.2 }[pattern.severity];
    
    return Math.min(0.95, baseConfidence * severityMultiplier);
  }

  private generateInsights(
    emotions: EmotionalIntelligenceResult['primaryEmotions'],
    patterns: EmotionalIntelligenceResult['patterns'],
    culturalContext?: string[]
  ): EmotionalIntelligenceResult['insights'] {
    const insights = {
      emotional: [] as string[],
      behavioral: [] as string[],
      cognitive: [] as string[]
    };

    // Emotional insights
    if (emotions.length > 0) {
      const dominantEmotion = emotions[0];
      insights.emotional.push(`Primary emotional state: ${dominantEmotion.emotion} (${(dominantEmotion.intensity * 100).toFixed(0)}% intensity)`);
      
      if (emotions.length > 1) {
        insights.emotional.push(`Complex emotional landscape with ${emotions.length} distinct emotions detected`);
      }
      
      const highIntensityEmotions = emotions.filter(e => e.intensity > 0.7);
      if (highIntensityEmotions.length > 0) {
        insights.emotional.push('High emotional intensity detected - may benefit from grounding techniques');
      }
    }

    // Pattern-based insights
    patterns.forEach(patternResult => {
      const pattern = patternResult.pattern;
      
      insights.behavioral.push(`${pattern.name}: ${pattern.description}`);
      
      if (pattern.severity === 'high') {
        insights.cognitive.push(`High priority pattern: ${pattern.name} - consider professional support`);
      }
      
      pattern.growthOpportunities.forEach(opportunity => {
        insights.cognitive.push(`Growth opportunity: ${opportunity}`);
      });
    });

    return insights;
  }

  private generateRecommendations(
    patterns: EmotionalIntelligenceResult['patterns'],
    culturalContext?: string[]
  ): EmotionalIntelligenceResult['recommendations'] {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    // General recommendations
    recommendations.immediate.push('Practice deep breathing or grounding techniques');
    recommendations.immediate.push('Acknowledge your emotions without judgment');
    
    // Pattern-specific recommendations
    patterns.forEach(patternResult => {
      const pattern = patternResult.pattern;
      
      if (pattern.id === 'emotional_overwhelm') {
        recommendations.immediate.push('Use the 5-4-3-2-1 grounding technique');
        recommendations.shortTerm.push('Develop daily emotional regulation practices');
      }
      
      if (pattern.id === 'perfectionism') {
        recommendations.shortTerm.push('Practice self-compassion exercises');
        recommendations.longTerm.push('Explore underlying beliefs about worth and achievement');
      }
      
      if (pattern.id === 'isolation') {
        recommendations.immediate.push('Reach out to one trusted person');
        recommendations.shortTerm.push('Gradually increase social connections');
        recommendations.longTerm.push('Build a supportive community network');
      }
      
      if (pattern.id === 'trauma_response') {
        recommendations.immediate.push('Ensure physical and emotional safety');
        recommendations.shortTerm.push('Consider trauma-informed professional support');
        recommendations.longTerm.push('Explore trauma healing modalities that resonate with you');
      }
    });

    // Cultural adaptations
    if (culturalContext) {
      culturalContext.forEach(context => {
        const culturalData = this.culturalContexts[context];
        if (culturalData) {
          culturalData.healingTraditions.forEach(tradition => {
            recommendations.longTerm.push(`Explore ${tradition} as a healing modality`);
          });
        }
      });
    }

    return recommendations;
  }

  private generateCulturalConsiderations(
    culturalContext?: string[],
    emotions?: EmotionalIntelligenceResult['primaryEmotions']
  ): string[] {
    const considerations: string[] = [];
    
    if (!culturalContext || culturalContext.length === 0) {
      return ['Cultural context not specified - recommendations are general'];
    }

    culturalContext.forEach(context => {
      const culturalData = this.culturalContexts[context];
      if (culturalData) {
        considerations.push(`${culturalData.culture} context: Values ${culturalData.emotionalValidation.join(', ')}`);
        
        if (culturalData.collectivism === 'collective') {
          considerations.push('Collective culture: Consider family and community impact in healing journey');
        }
        
        if (culturalData.emotionalExpression === 'indirect') {
          considerations.push('Indirect emotional expression culture: Honor subtle and contextual emotional communication');
        }
        
        considerations.push(`Traditional healing approaches: ${culturalData.healingTraditions.join(', ')}`);
      }
    });

    return considerations;
  }

  private assessTraumaInformed(
    text: string,
    patterns: EmotionalIntelligenceResult['patterns']
  ): EmotionalIntelligenceResult['traumaInformed'] {
    const traumaIndicators: string[] = [];
    const resources: string[] = [];
    const safeguards: string[] = [];

    // Check for trauma-related patterns
    const traumaPattern = patterns.find(p => p.pattern.id === 'trauma_response');
    if (traumaPattern) {
      traumaIndicators.push('Trauma response patterns detected');
      resources.push('Trauma-informed therapy');
      resources.push('Somatic healing practices');
      safeguards.push('Prioritize safety and self-care');
      safeguards.push('Work at your own pace');
    }

    // Check text for trauma-related language
    const traumaKeywords = ['trigger', 'flashback', 'numb', 'dissociate', 'hypervigilant', 'frozen'];
    const lowerText = text.toLowerCase();
    
    traumaKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        traumaIndicators.push(`Trauma-related language: "${keyword}"`);
      }
    });

    if (traumaIndicators.length > 0) {
      resources.push('EMDR therapy');
      resources.push('Trauma-sensitive yoga');
      resources.push('Crisis hotlines');
      safeguards.push('Create a safety plan');
      safeguards.push('Build a support network');
    }

    return { indicators: traumaIndicators, resources, safeguards };
  }
}

export const advancedEmotionalIntelligence = new AdvancedEmotionalIntelligence();