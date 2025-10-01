/**
 * ALCHM Advanced Emotional Pattern Recognition Engine
 * Revolutionary AI-powered emotional intelligence with temporal analysis
 * Philosophy: "Understanding the symphony of human emotion through patterns invisible to the naked eye"
 */

import { EmotionalContext, WritingPatterns } from './emotional-intelligence';

// Sophisticated emotional dimensions beyond basic categories
export interface EmotionalDimensions {
  valence: number;        // -1 (negative) to +1 (positive)
  arousal: number;        // 0 (calm) to 1 (highly aroused)
  dominance: number;      // 0 (controlled by circumstances) to 1 (in control)
  authenticity: number;   // 0 (surface level) to 1 (deeply authentic)
  complexity: number;     // 0 (single emotion) to 1 (complex emotional blend)
  temporal_stability: number; // 0 (fluctuating) to 1 (stable over time)
}

// Advanced emotional patterns detected through ML analysis
export interface EmotionalPattern {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  emotional_signature: EmotionalDimensions;
  frequency: number;
  last_occurrence: Date;
  growth_potential: number;
  support_strategy: string;
  cultural_variations?: Record<string, EmotionalDimensions>;
}

// Temporal emotional trajectory analysis
export interface EmotionalTrajectory {
  timeline: {
    timestamp: Date;
    dimensions: EmotionalDimensions;
    trigger_event?: string;
    context?: string;
  }[];
  trend_direction: 'ascending' | 'descending' | 'cyclical' | 'stable' | 'chaotic';
  volatility_score: number;
  resilience_indicators: string[];
  growth_moments: Date[];
  intervention_opportunities: Date[];
}

// Advanced linguistic analysis for emotional detection
export interface LinguisticFeatures {
  lexical_density: number;
  emotional_intensity_markers: string[];
  metaphorical_language: string[];
  temporal_references: {
    past_oriented: number;
    present_oriented: number;
    future_oriented: number;
  };
  agency_markers: {
    self_agency: number;
    external_locus: number;
  };
  relational_markers: {
    connection_seeking: number;
    isolation_indicators: number;
    boundary_setting: number;
  };
  somatic_references: string[];
  spiritual_indicators: string[];
}

// Cultural emotional intelligence adaptation
export interface CulturalEmotionalContext {
  culture_code: string; // ISO codes: en, es, pt, ko, hi, de
  emotional_expression_norms: {
    intensity_scaling: number;
    directness_preference: number;
    collective_vs_individual: number;
    hierarchical_consideration: number;
  };
  cultural_emotional_vocabulary: Record<string, EmotionalDimensions>;
  sacred_emotional_concepts: string[];
  taboo_expressions: string[];
  healing_traditions: string[];
}

// Predictive emotional modeling
export interface EmotionalPrediction {
  predicted_state: EmotionalDimensions;
  confidence_score: number;
  time_horizon: number; // hours ahead
  risk_factors: string[];
  protective_factors: string[];
  recommended_interventions: {
    type: 'preventive' | 'supportive' | 'therapeutic';
    urgency: 'low' | 'medium' | 'high' | 'crisis';
    description: string;
    cultural_adaptation?: string;
  }[];
}

// Advanced pattern recognition using sophisticated NLP
class AdvancedEmotionalPatternEngine {
  private patterns: Map<string, EmotionalPattern> = new Map();
  private trajectories: Map<string, EmotionalTrajectory> = new Map();
  private culturalContexts: Map<string, CulturalEmotionalContext> = new Map();

  constructor() {
    this.initializePatterns();
    this.initializeCulturalContexts();
  }

  /**
   * Initialize sophisticated emotional patterns based on psychological research
   */
  private initializePatterns(): void {
    const corePatterns: EmotionalPattern[] = [
      {
        id: 'shadow_integration',
        name: 'Shadow Work Integration',
        description: 'Recognition and integration of rejected aspects of self',
        triggers: ['shame', 'anger_at_self', 'perfectionism', 'self_criticism'],
        emotional_signature: {
          valence: -0.3,
          arousal: 0.7,
          dominance: 0.4,
          authenticity: 0.9,
          complexity: 0.8,
          temporal_stability: 0.3
        },
        frequency: 0,
        last_occurrence: new Date(),
        growth_potential: 0.95,
        support_strategy: 'Compassionate self-acceptance guidance with gentle shadow work exploration'
      },
      {
        id: 'authentic_emergence',
        name: 'Authentic Self Emergence',
        description: 'Movement toward authentic self-expression and identity',
        triggers: ['identity_questioning', 'values_alignment', 'courage', 'truth_seeking'],
        emotional_signature: {
          valence: 0.6,
          arousal: 0.5,
          dominance: 0.8,
          authenticity: 0.95,
          complexity: 0.6,
          temporal_stability: 0.7
        },
        frequency: 0,
        last_occurrence: new Date(),
        growth_potential: 0.9,
        support_strategy: 'Empowering validation with identity exploration prompts'
      },
      {
        id: 'trauma_integration',
        name: 'Trauma Integration Process',
        description: 'Healthy processing and integration of traumatic experiences',
        triggers: ['flashbacks', 'body_memories', 'safety_concerns', 'hypervigilance'],
        emotional_signature: {
          valence: -0.6,
          arousal: 0.8,
          dominance: 0.2,
          authenticity: 0.8,
          complexity: 0.9,
          temporal_stability: 0.2
        },
        frequency: 0,
        last_occurrence: new Date(),
        growth_potential: 0.85,
        support_strategy: 'Trauma-informed support with grounding techniques and professional resources'
      },
      {
        id: 'relational_healing',
        name: 'Relational Healing Journey',
        description: 'Healing patterns in relationships and attachment',
        triggers: ['boundary_setting', 'trust_issues', 'intimacy_fears', 'abandonment'],
        emotional_signature: {
          valence: 0.2,
          arousal: 0.6,
          dominance: 0.5,
          authenticity: 0.7,
          complexity: 0.8,
          temporal_stability: 0.4
        },
        frequency: 0,
        last_occurrence: new Date(),
        growth_potential: 0.8,
        support_strategy: 'Attachment-focused support with relational skills development'
      },
      {
        id: 'spiritual_awakening',
        name: 'Spiritual Awakening Process',
        description: 'Expansion of consciousness and spiritual awareness',
        triggers: ['meaning_seeking', 'transcendence', 'interconnectedness', 'mystical_experience'],
        emotional_signature: {
          valence: 0.7,
          arousal: 0.4,
          dominance: 0.3,
          authenticity: 0.9,
          complexity: 0.7,
          temporal_stability: 0.5
        },
        frequency: 0,
        last_occurrence: new Date(),
        growth_potential: 0.85,
        support_strategy: 'Spiritually-informed guidance with integration support'
      }
    ];

    corePatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }

  /**
   * Initialize cultural emotional contexts for multilingual support
   */
  private initializeCulturalContexts(): void {
    const cultures: CulturalEmotionalContext[] = [
      {
        culture_code: 'en',
        emotional_expression_norms: {
          intensity_scaling: 1.0,
          directness_preference: 0.8,
          collective_vs_individual: 0.3,
          hierarchical_consideration: 0.4
        },
        cultural_emotional_vocabulary: {
          'overwhelmed': { valence: -0.6, arousal: 0.8, dominance: 0.2, authenticity: 0.8, complexity: 0.6, temporal_stability: 0.3 },
          'blessed': { valence: 0.8, arousal: 0.3, dominance: 0.4, authenticity: 0.9, complexity: 0.4, temporal_stability: 0.8 }
        },
        sacred_emotional_concepts: ['soul', 'spirit', 'heart', 'blessing', 'grace'],
        taboo_expressions: ['weakness', 'failure', 'broken'],
        healing_traditions: ['mindfulness', 'therapy', 'journaling', 'meditation']
      },
      {
        culture_code: 'es',
        emotional_expression_norms: {
          intensity_scaling: 1.2,
          directness_preference: 0.7,
          collective_vs_individual: 0.7,
          hierarchical_consideration: 0.6
        },
        cultural_emotional_vocabulary: {
          'sufrimiento': { valence: -0.7, arousal: 0.6, dominance: 0.3, authenticity: 0.9, complexity: 0.8, temporal_stability: 0.4 },
          'esperanza': { valence: 0.8, arousal: 0.5, dominance: 0.6, authenticity: 0.9, complexity: 0.5, temporal_stability: 0.7 }
        },
        sacred_emotional_concepts: ['alma', 'corazón', 'fe', 'esperanza', 'bendición'],
        taboo_expressions: [],
        healing_traditions: ['familia', 'fe', 'comunidad', 'música', 'arte']
      }
      // Additional cultures would be added here
    ];

    cultures.forEach(culture => {
      this.culturalContexts.set(culture.culture_code, culture);
    });
  }

  /**
   * Advanced linguistic feature extraction using NLP
   */
  extractLinguisticFeatures(content: string, locale: string = 'en'): LinguisticFeatures {
    const words = content.toLowerCase().split(/\s+/).filter(Boolean);
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    
    // Calculate lexical density
    const lexical_density = this.calculateLexicalDensity(words);
    
    // Extract emotional intensity markers
    const intensity_patterns = [
      /\b(very|extremely|incredibly|absolutely|completely|totally|utterly|deeply|profoundly)\b/gi,
      /[!]{2,}/g,
      /[A-Z]{3,}/g, // ALL CAPS words
      /\b\w*ly\b/g // Adverbs often indicate intensity
    ];
    
    const emotional_intensity_markers = intensity_patterns
      .flatMap(pattern => content.match(pattern) || [])
      .filter(Boolean);

    // Detect metaphorical language
    const metaphor_patterns = [
      /like\s+[a-z]+/gi,
      /as\s+if/gi,
      /feels?\s+like/gi,
      /\b(drowning|suffocating|flying|soaring|burning|melting|breaking|cracking|blooming|growing)\b/gi
    ];
    
    const metaphorical_language = metaphor_patterns
      .flatMap(pattern => content.match(pattern) || [])
      .filter(Boolean);

    // Analyze temporal references
    const past_markers = (content.match(/\b(was|were|had|did|used to|before|yesterday|last|ago|then|once)\b/gi) || []).length;
    const present_markers = (content.match(/\b(am|is|are|now|today|currently|right now|at this moment)\b/gi) || []).length;
    const future_markers = (content.match(/\b(will|going to|tomorrow|next|soon|hope|dream|plan|want to)\b/gi) || []).length;
    
    const total_temporal = past_markers + present_markers + future_markers || 1;
    
    // Analyze agency markers
    const self_agency_markers = (content.match(/\b(I\s+(will|can|choose|decide|create|make|do|am)\b)/gi) || []).length;
    const external_locus_markers = (content.match(/\b(they|it|life|circumstances|fate|luck|others)\s+(make|force|control|decide)\b/gi) || []).length;
    
    // Relational markers
    const connection_seeking = (content.match(/\b(need|want|wish|miss|love|care|connect|belong|together|with)\b/gi) || []).length;
    const isolation_indicators = (content.match(/\b(alone|lonely|isolated|empty|disconnected|distant|apart)\b/gi) || []).length;
    const boundary_setting = (content.match(/\b(no|stop|enough|boundary|limit|protect|space|respect)\b/gi) || []).length;

    // Somatic references
    const somatic_patterns = /\b(heart|chest|stomach|throat|shoulders|back|tense|tight|heavy|light|breath|breathing|shake|tremble)\b/gi;
    const somatic_references = content.match(somatic_patterns) || [];

    // Spiritual indicators
    const spiritual_patterns = /\b(soul|spirit|divine|sacred|holy|blessed|prayer|meditation|universe|higher|transcend|awaken)\b/gi;
    const spiritual_indicators = content.match(spiritual_patterns) || [];

    return {
      lexical_density,
      emotional_intensity_markers,
      metaphorical_language,
      temporal_references: {
        past_oriented: past_markers / total_temporal,
        present_oriented: present_markers / total_temporal,
        future_oriented: future_markers / total_temporal
      },
      agency_markers: {
        self_agency: self_agency_markers / (words.length || 1),
        external_locus: external_locus_markers / (words.length || 1)
      },
      relational_markers: {
        connection_seeking: connection_seeking / (words.length || 1),
        isolation_indicators: isolation_indicators / (words.length || 1),
        boundary_setting: boundary_setting / (words.length || 1)
      },
      somatic_references,
      spiritual_indicators
    };
  }

  /**
   * Calculate lexical density (ratio of content words to total words)
   */
  private calculateLexicalDensity(words: string[]): number {
    const function_words = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 
      'above', 'below', 'between', 'among', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
      'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their',
      'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
      'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'shall'
    ]);
    
    const content_words = words.filter(word => !function_words.has(word.toLowerCase()));
    return content_words.length / (words.length || 1);
  }

  /**
   * Advanced emotional dimension analysis using multiple indicators
   */
  analyzeEmotionalDimensions(content: string, linguistic: LinguisticFeatures, locale: string = 'en'): EmotionalDimensions {
    const cultural_context = this.culturalContexts.get(locale);
    
    // Valence analysis (positive/negative emotional tone)
    const positive_markers = (content.match(/\b(happy|joy|love|grateful|blessed|amazing|wonderful|beautiful|hope|excited|proud)\b/gi) || []).length;
    const negative_markers = (content.match(/\b(sad|angry|hurt|pain|fear|anxiety|depressed|worried|frustrated|disappointed)\b/gi) || []).length;
    const total_emotional_markers = positive_markers + negative_markers || 1;
    
    let valence = (positive_markers - negative_markers) / total_emotional_markers;
    
    // Cultural adjustment for valence expression
    if (cultural_context) {
      valence *= cultural_context.emotional_expression_norms.intensity_scaling;
    }

    // Arousal analysis (emotional intensity/activation)
    const arousal_indicators = [
      linguistic.emotional_intensity_markers.length / 100,
      linguistic.somatic_references.length / 20,
      Math.min(linguistic.metaphorical_language.length / 10, 1),
      1 - linguistic.lexical_density // Lower density might indicate high arousal/stream of consciousness
    ];
    
    const arousal = Math.min(arousal_indicators.reduce((a, b) => a + b, 0) / arousal_indicators.length, 1);

    // Dominance analysis (sense of control/agency)
    const dominance = Math.min(Math.max(
      linguistic.agency_markers.self_agency * 2 - linguistic.agency_markers.external_locus,
      0
    ), 1);

    // Authenticity analysis (depth of genuine expression)
    const authenticity_indicators = [
      linguistic.somatic_references.length > 0 ? 0.8 : 0.3, // Body awareness indicates authenticity
      linguistic.spiritual_indicators.length > 0 ? 0.9 : 0.5, // Spiritual language often authentic
      linguistic.metaphorical_language.length / 10, // Metaphors indicate deep expression
      Math.min(linguistic.lexical_density * 1.5, 1) // Rich vocabulary suggests authentic expression
    ];
    
    const authenticity = Math.min(authenticity_indicators.reduce((a, b) => a + b, 0) / authenticity_indicators.length, 1);

    // Complexity analysis (multiple emotions present)
    const complexity_indicators = [
      linguistic.emotional_intensity_markers.length > 3 ? 0.8 : 0.3,
      linguistic.relational_markers.connection_seeking > 0 && linguistic.relational_markers.boundary_setting > 0 ? 0.9 : 0.4,
      linguistic.temporal_references.past_oriented > 0.2 && linguistic.temporal_references.future_oriented > 0.2 ? 0.7 : 0.3
    ];
    
    const complexity = Math.min(complexity_indicators.reduce((a, b) => a + b, 0) / complexity_indicators.length, 1);

    // Temporal stability (will be updated based on historical analysis)
    const temporal_stability = 0.5; // Default, updated by trajectory analysis

    return {
      valence: Math.max(-1, Math.min(1, valence)),
      arousal: Math.max(0, Math.min(1, arousal)),
      dominance: Math.max(0, Math.min(1, dominance)),
      authenticity: Math.max(0, Math.min(1, authenticity)),
      complexity: Math.max(0, Math.min(1, complexity)),
      temporal_stability: Math.max(0, Math.min(1, temporal_stability))
    };
  }

  /**
   * Detect sophisticated emotional patterns in content
   */
  detectAdvancedPatterns(
    content: string, 
    dimensions: EmotionalDimensions, 
    linguistic: LinguisticFeatures, 
    user_id: string
  ): EmotionalPattern[] {
    const detected_patterns: EmotionalPattern[] = [];
    
    // Shadow work pattern detection
    if (dimensions.authenticity > 0.7 && dimensions.valence < -0.3 && 
        linguistic.somatic_references.length > 0 &&
        (content.includes('shame') || content.includes('judge') || content.includes('hate myself'))) {
      
      const pattern = this.patterns.get('shadow_integration');
      if (pattern) {
        detected_patterns.push({
          ...pattern,
          frequency: pattern.frequency + 1,
          last_occurrence: new Date()
        });
      }
    }

    // Authentic emergence pattern
    if (dimensions.authenticity > 0.8 && dimensions.dominance > 0.6 &&
        linguistic.agency_markers.self_agency > 0.05 &&
        (content.includes('real') || content.includes('true') || content.includes('authentic'))) {
      
      const pattern = this.patterns.get('authentic_emergence');
      if (pattern) {
        detected_patterns.push({
          ...pattern,
          frequency: pattern.frequency + 1,
          last_occurrence: new Date()
        });
      }
    }

    // Trauma integration pattern
    if (dimensions.arousal > 0.7 && dimensions.dominance < 0.3 &&
        linguistic.somatic_references.length > 2 &&
        (content.includes('trigger') || content.includes('flashback') || content.includes('safe'))) {
      
      const pattern = this.patterns.get('trauma_integration');
      if (pattern) {
        detected_patterns.push({
          ...pattern,
          frequency: pattern.frequency + 1,
          last_occurrence: new Date()
        });
      }
    }

    // Relational healing pattern
    if (dimensions.complexity > 0.6 && 
        linguistic.relational_markers.connection_seeking > 0.03 &&
        linguistic.relational_markers.boundary_setting > 0.02) {
      
      const pattern = this.patterns.get('relational_healing');
      if (pattern) {
        detected_patterns.push({
          ...pattern,
          frequency: pattern.frequency + 1,
          last_occurrence: new Date()
        });
      }
    }

    // Spiritual awakening pattern
    if (linguistic.spiritual_indicators.length > 2 && dimensions.authenticity > 0.8 &&
        dimensions.valence > 0.4) {
      
      const pattern = this.patterns.get('spiritual_awakening');
      if (pattern) {
        detected_patterns.push({
          ...pattern,
          frequency: pattern.frequency + 1,
          last_occurrence: new Date()
        });
      }
    }

    // Update pattern frequencies
    detected_patterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });

    return detected_patterns;
  }

  /**
   * Generate predictive emotional insights
   */
  generatePredictiveInsights(
    user_id: string,
    current_dimensions: EmotionalDimensions,
    recent_patterns: EmotionalPattern[],
    trajectory: EmotionalTrajectory,
    locale: string = 'en'
  ): EmotionalPrediction {
    const cultural_context = this.culturalContexts.get(locale);
    
    // Predict emotional state 24 hours ahead based on patterns
    let predicted_valence = current_dimensions.valence;
    let predicted_arousal = current_dimensions.arousal;
    let predicted_dominance = current_dimensions.dominance;
    
    // Adjust predictions based on trajectory
    if (trajectory.trend_direction === 'ascending') {
      predicted_valence += 0.2;
      predicted_dominance += 0.1;
    } else if (trajectory.trend_direction === 'descending') {
      predicted_valence -= 0.15;
      predicted_arousal += 0.1;
    }

    // Adjust for volatility
    if (trajectory.volatility_score > 0.7) {
      predicted_arousal += 0.2;
    }

    // Pattern-based adjustments
    recent_patterns.forEach(pattern => {
      if (pattern.id === 'shadow_integration' && pattern.frequency > 2) {
        predicted_valence += 0.3; // Shadow work leads to integration
        predicted_dominance += 0.2;
      }
      if (pattern.id === 'trauma_integration' && pattern.frequency > 1) {
        predicted_arousal -= 0.1; // Processing reduces arousal over time
      }
    });

    // Constrain predictions
    predicted_valence = Math.max(-1, Math.min(1, predicted_valence));
    predicted_arousal = Math.max(0, Math.min(1, predicted_arousal));
    predicted_dominance = Math.max(0, Math.min(1, predicted_dominance));

    const predicted_state: EmotionalDimensions = {
      valence: predicted_valence,
      arousal: predicted_arousal,
      dominance: predicted_dominance,
      authenticity: current_dimensions.authenticity,
      complexity: current_dimensions.complexity,
      temporal_stability: 0.7 // Prediction assumes some stability
    };

    // Assess confidence based on data quality
    const confidence_score = Math.min(
      0.4 + (trajectory.timeline.length / 50) * 0.3 + 
      (recent_patterns.length / 10) * 0.3,
      0.95
    );

    // Identify risk factors
    const risk_factors: string[] = [];
    if (trajectory.volatility_score > 0.8) risk_factors.push('High emotional volatility');
    if (predicted_arousal > 0.8 && predicted_dominance < 0.3) risk_factors.push('Potential overwhelm');
    if (predicted_valence < -0.6) risk_factors.push('Extended negative emotional state');

    // Identify protective factors
    const protective_factors: string[] = [];
    if (recent_patterns.some(p => p.id === 'authentic_emergence')) protective_factors.push('Growing self-awareness');
    if (trajectory.resilience_indicators.length > 2) protective_factors.push('Strong resilience patterns');
    if (predicted_dominance > 0.6) protective_factors.push('Sense of personal agency');

    // Generate culturally-aware recommendations
    const recommendations = this.generateRecommendations(
      predicted_state, 
      risk_factors, 
      protective_factors, 
      recent_patterns,
      cultural_context
    );

    return {
      predicted_state,
      confidence_score,
      time_horizon: 24,
      risk_factors,
      protective_factors,
      recommended_interventions: recommendations
    };
  }

  /**
   * Generate culturally-aware intervention recommendations
   */
  private generateRecommendations(
    predicted_state: EmotionalDimensions,
    risk_factors: string[],
    protective_factors: string[],
    patterns: EmotionalPattern[],
    cultural_context?: CulturalEmotionalContext
  ): EmotionalPrediction['recommended_interventions'] {
    const recommendations: EmotionalPrediction['recommended_interventions'] = [];

    // High-risk interventions
    if (predicted_state.valence < -0.7 && predicted_state.arousal > 0.8) {
      recommendations.push({
        type: 'therapeutic',
        urgency: 'high',
        description: 'Consider professional mental health support for intense emotional distress',
        cultural_adaptation: cultural_context?.healing_traditions.includes('therapy') ? 
          'Professional counseling aligns with your cultural healing traditions' : 
          'Explore culturally-responsive healing practices alongside professional support'
      });
    }

    // Preventive interventions
    if (risk_factors.includes('High emotional volatility')) {
      recommendations.push({
        type: 'preventive',
        urgency: 'medium',
        description: 'Establish grounding routines and emotional regulation practices',
        cultural_adaptation: cultural_context?.healing_traditions.includes('meditation') ?
          'Daily meditation practice from your cultural tradition' :
          'Breathing exercises and mindfulness techniques'
      });
    }

    // Supportive interventions for growth
    if (patterns.some(p => p.id === 'authentic_emergence')) {
      recommendations.push({
        type: 'supportive',
        urgency: 'low',
        description: 'Nurture your authentic self-expression through creative practices',
        cultural_adaptation: cultural_context?.healing_traditions.includes('arte') ?
          'Express through traditional art forms from your culture' :
          'Explore journaling, art, or movement as self-expression'
      });
    }

    // Shadow work support
    if (patterns.some(p => p.id === 'shadow_integration')) {
      recommendations.push({
        type: 'therapeutic',
        urgency: 'medium',
        description: 'Continue shadow integration work with compassionate self-awareness',
        cultural_adaptation: 'Honor your cultural understanding of wholeness and self-acceptance'
      });
    }

    return recommendations;
  }
}

// Export singleton instance
export const emotionalPatternEngine = new AdvancedEmotionalPatternEngine();

// Export utility functions
export function analyzeEmotionalContent(
  content: string, 
  user_id: string, 
  locale: string = 'en'
): {
  dimensions: EmotionalDimensions;
  linguistic: LinguisticFeatures;
  patterns: EmotionalPattern[];
  predictions?: EmotionalPrediction;
} {
  const linguistic = emotionalPatternEngine.extractLinguisticFeatures(content, locale);
  const dimensions = emotionalPatternEngine.analyzeEmotionalDimensions(content, linguistic, locale);
  const patterns = emotionalPatternEngine.detectAdvancedPatterns(content, dimensions, linguistic, user_id);
  
  return {
    dimensions,
    linguistic,
    patterns
  };
}