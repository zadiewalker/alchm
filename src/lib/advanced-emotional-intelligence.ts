/**
 * ALCHM Advanced Emotional Intelligence System
 * Revolutionary quantum-inspired emotional state detection and analysis
 * Philosophy: "Emotions are not just states—they are multidimensional experiences in superposition"
 */

import { EmotionalContext, WritingPatterns } from './emotional-intelligence';
import { 
  EmotionalDimensions, 
  EmotionalPattern, 
  EmotionalTrajectory, 
  LinguisticFeatures,
  CulturalEmotionalContext,
  EmotionalPrediction,
  emotionalPatternEngine
} from './advanced-emotional-pattern-recognition';

// Quantum-inspired emotional state representation
export interface QuantumEmotionalState {
  primaryEmotion: {
    name: string;
    intensity: number;
    valence: number;
    arousal: number;
    dominance: number;
  };
  secondaryEmotions: Array<{
    name: string;
    probability: number;
    intensity: number;
  }>;
  emotionalSuperposition: number; // Measure of emotional complexity/multiple states
  coherence: number; // How unified/fragmented the emotional state is
  temporal_stability: number; // How stable this state is over time
  cultural_expression_factor: number; // Cultural adaptation of expression
  neurological_correlates: {
    prefrontal_activation: number; // Executive function involvement
    limbic_activation: number; // Emotional processing intensity
    default_mode_network: number; // Self-referential processing
    mirror_neuron_activity: number; // Empathic resonance
  };
  somatic_markers: {
    embodied_awareness: number; // Body awareness level
    tension_patterns: string[];
    energy_level: number;
    breathing_pattern: 'shallow' | 'deep' | 'irregular' | 'calm';
  };
  shadow_aspects: {
    suppressed_emotions: string[];
    projection_risk: number; // Likelihood of projecting onto others
    integration_opportunity: number; // Potential for shadow integration
  };
}

// Advanced neural emotional profile
export interface NeuralEmotionalProfile {
  user_id: string;
  baseline_emotional_signature: EmotionalDimensions;
  emotional_volatility_pattern: {
    amplitude: number; // How extreme the swings are
    frequency: number; // How often swings occur
    recovery_time: number; // How quickly they return to baseline
    triggers: string[]; // What causes volatility
  };
  emotional_intelligence_metrics: {
    self_awareness: number;
    self_regulation: number;
    motivation: number;
    empathy: number;
    social_skills: number;
  };
  archetype_resonance: Record<string, number>; // How strongly they resonate with each archetype
  growth_trajectory: {
    development_stage: 'exploration' | 'consolidation' | 'integration' | 'mastery' | 'transcendence';
    growth_velocity: number;
    next_developmental_edge: string;
    readiness_for_challenge: number;
  };
  trauma_informed_markers: {
    hypervigilance_indicators: number;
    dissociation_markers: number;
    somatic_awareness: number;
    safety_perception: number;
    trust_capacity: number;
  };
  cultural_emotional_adaptation: {
    expression_style: 'direct' | 'indirect' | 'contextual' | 'ritualized';
    intensity_modulation: number; // Cultural scaling factor
    collectivist_vs_individualist: number;
    power_distance_sensitivity: number;
  };
}

// Multi-dimensional emotion detection engine
class AdvancedEmotionDetector {
  private culturalContexts: Map<string, CulturalEmotionalContext> = new Map();
  private userProfiles: Map<string, NeuralEmotionalProfile> = new Map();

  constructor() {
    this.initializeCulturalContexts();
  }

  /**
   * Initialize cultural contexts for sophisticated emotion interpretation
   */
  private initializeCulturalContexts(): void {
    const contexts: CulturalEmotionalContext[] = [
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
          'blessed': { valence: 0.8, arousal: 0.3, dominance: 0.4, authenticity: 0.9, complexity: 0.4, temporal_stability: 0.8 },
          'triggered': { valence: -0.8, arousal: 0.9, dominance: 0.1, authenticity: 0.9, complexity: 0.7, temporal_stability: 0.2 },
          'grounded': { valence: 0.5, arousal: 0.2, dominance: 0.7, authenticity: 0.8, complexity: 0.3, temporal_stability: 0.9 }
        },
        sacred_emotional_concepts: ['soul', 'spirit', 'heart', 'blessing', 'grace', 'authentic', 'sacred'],
        taboo_expressions: ['weakness', 'failure', 'broken', 'crazy'],
        healing_traditions: ['therapy', 'mindfulness', 'journaling', 'meditation', 'somatic_work']
      },
      {
        culture_code: 'es',
        emotional_expression_norms: {
          intensity_scaling: 1.3,
          directness_preference: 0.7,
          collective_vs_individual: 0.7,
          hierarchical_consideration: 0.6
        },
        cultural_emotional_vocabulary: {
          'sufrimiento': { valence: -0.7, arousal: 0.6, dominance: 0.3, authenticity: 0.9, complexity: 0.8, temporal_stability: 0.4 },
          'esperanza': { valence: 0.8, arousal: 0.5, dominance: 0.6, authenticity: 0.9, complexity: 0.5, temporal_stability: 0.7 },
          'coraje': { valence: 0.6, arousal: 0.8, dominance: 0.9, authenticity: 0.8, complexity: 0.5, temporal_stability: 0.6 },
          'paz': { valence: 0.7, arousal: 0.1, dominance: 0.5, authenticity: 0.9, complexity: 0.3, temporal_stability: 0.9 }
        },
        sacred_emotional_concepts: ['alma', 'corazón', 'fe', 'esperanza', 'bendición', 'sagrado'],
        taboo_expressions: ['débil', 'fracaso'],
        healing_traditions: ['familia', 'fe', 'comunidad', 'música', 'arte', 'curanderismo']
      },
      {
        culture_code: 'ko',
        emotional_expression_norms: {
          intensity_scaling: 0.7,
          directness_preference: 0.4,
          collective_vs_individual: 0.8,
          hierarchical_consideration: 0.9
        },
        cultural_emotional_vocabulary: {
          'jeong': { valence: 0.6, arousal: 0.3, dominance: 0.4, authenticity: 0.9, complexity: 0.8, temporal_stability: 0.8 },
          'han': { valence: -0.5, arousal: 0.4, dominance: 0.3, authenticity: 0.9, complexity: 0.9, temporal_stability: 0.7 },
          'nunchi': { valence: 0.5, arousal: 0.2, dominance: 0.6, authenticity: 0.8, complexity: 0.7, temporal_stability: 0.8 }
        },
        sacred_emotional_concepts: ['마음', '정', '한', '눈치', '인연'],
        taboo_expressions: ['분노', '실패'],
        healing_traditions: ['명상', '차', '자연', '공동체', '예의']
      }
    ];

    contexts.forEach(context => {
      this.culturalContexts.set(context.culture_code, context);
    });
  }

  /**
   * Detect quantum emotional state with multidimensional analysis
   */
  async detectQuantumEmotionalState(
    content: string, 
    context: { userId?: string; locale?: string; pathway?: string; timeContext?: string } = {}
  ): Promise<QuantumEmotionalState> {
    const { userId, locale = 'en', pathway, timeContext } = context;
    
    // Get cultural context
    const culturalContext = this.culturalContexts.get(locale) || this.culturalContexts.get('en')!;
    
    // Extract linguistic features
    const linguistic = emotionalPatternEngine.extractLinguisticFeatures(content, locale);
    
    // Analyze emotional dimensions
    const dimensions = emotionalPatternEngine.analyzeEmotionalDimensions(content, linguistic, locale);
    
    // Detect primary emotion with quantum superposition
    const emotionDetection = this.detectPrimaryEmotionWithSuperposition(
      content, 
      dimensions, 
      linguistic, 
      culturalContext
    );
    
    // Analyze neurological correlates
    const neurological_correlates = this.analyzeNeurologicalCorrelates(content, linguistic, dimensions);
    
    // Detect somatic markers
    const somatic_markers = this.detectSomaticMarkers(content, linguistic);
    
    // Analyze shadow aspects
    const shadow_aspects = this.analyzeShadowAspects(content, linguistic, dimensions);
    
    // Calculate coherence and stability
    const coherence = this.calculateEmotionalCoherence(emotionDetection, dimensions);
    const temporal_stability = this.estimateTemporalStability(dimensions, linguistic);
    
    return {
      primaryEmotion: emotionDetection.primary,
      secondaryEmotions: emotionDetection.secondary,
      emotionalSuperposition: emotionDetection.superposition,
      coherence,
      temporal_stability,
      cultural_expression_factor: culturalContext.emotional_expression_norms.intensity_scaling,
      neurological_correlates,
      somatic_markers,
      shadow_aspects
    };
  }

  /**
   * Analyze emotional patterns over time for trajectory tracking
   */
  async analyzeEmotionalTrajectory(
    userId: string,
    emotionalStates: Array<{ state: QuantumEmotionalState; timestamp: Date; context?: string }>,
    timeWindow: number = 30 // days
  ): Promise<EmotionalTrajectory> {
    const sortedStates = emotionalStates
      .filter(s => (Date.now() - s.timestamp.getTime()) / (1000 * 60 * 60 * 24) <= timeWindow)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    const timeline = sortedStates.map(s => ({
      timestamp: s.timestamp,
      dimensions: {
        valence: s.state.primaryEmotion.valence,
        arousal: s.state.primaryEmotion.arousal,
        dominance: s.state.primaryEmotion.dominance,
        authenticity: s.state.coherence, // Using coherence as proxy for authenticity
        complexity: s.state.emotionalSuperposition,
        temporal_stability: s.state.temporal_stability
      },
      trigger_event: s.context,
      context: undefined
    }));

    // Analyze trend direction
    const trend_direction = this.analyzeTrendDirection(timeline);
    
    // Calculate volatility
    const volatility_score = this.calculateVolatility(timeline);
    
    // Identify resilience indicators
    const resilience_indicators = this.identifyResilienceIndicators(timeline);
    
    // Identify growth moments
    const growth_moments = this.identifyGrowthMoments(timeline);
    
    // Identify intervention opportunities
    const intervention_opportunities = this.identifyInterventionOpportunities(timeline);

    return {
      timeline,
      trend_direction,
      volatility_score,
      resilience_indicators,
      growth_moments,
      intervention_opportunities
    };
  }

  /**
   * Generate predictive emotional insights
   */
  async generatePredictiveInsights(
    userId: string,
    currentState: QuantumEmotionalState,
    trajectory: EmotionalTrajectory,
    patterns: EmotionalPattern[],
    locale: string = 'en'
  ): Promise<EmotionalPrediction> {
    return emotionalPatternEngine.generatePredictiveInsights(
      userId,
      {
        valence: currentState.primaryEmotion.valence,
        arousal: currentState.primaryEmotion.arousal,
        dominance: currentState.primaryEmotion.dominance,
        authenticity: currentState.coherence,
        complexity: currentState.emotionalSuperposition,
        temporal_stability: currentState.temporal_stability
      },
      patterns,
      trajectory,
      locale
    );
  }

  /**
   * Build or update neural emotional profile for a user
   */
  async buildNeuralEmotionalProfile(
    userId: string,
    emotionalStates: QuantumEmotionalState[],
    journalEntries: Array<{ content: string; createdAt: Date; mood?: string }>,
    locale: string = 'en'
  ): Promise<NeuralEmotionalProfile> {
    const culturalContext = this.culturalContexts.get(locale);
    
    // Calculate baseline emotional signature
    const baseline_emotional_signature = this.calculateBaselineSignature(emotionalStates);
    
    // Analyze volatility patterns
    const emotional_volatility_pattern = this.analyzeVolatilityPattern(emotionalStates);
    
    // Calculate emotional intelligence metrics
    const emotional_intelligence_metrics = this.calculateEmotionalIntelligenceMetrics(
      emotionalStates,
      journalEntries
    );
    
    // Analyze archetype resonance
    const archetype_resonance = this.analyzeArchetypeResonance(journalEntries);
    
    // Determine growth trajectory
    const growth_trajectory = this.determineGrowthTrajectory(emotionalStates, journalEntries);
    
    // Analyze trauma-informed markers
    const trauma_informed_markers = this.analyzeTraumaInformedMarkers(emotionalStates, journalEntries);
    
    // Determine cultural adaptation style
    const cultural_emotional_adaptation = this.determineCulturalAdaptation(
      emotionalStates,
      culturalContext
    );

    const profile: NeuralEmotionalProfile = {
      user_id: userId,
      baseline_emotional_signature,
      emotional_volatility_pattern,
      emotional_intelligence_metrics,
      archetype_resonance,
      growth_trajectory,
      trauma_informed_markers,
      cultural_emotional_adaptation
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  // Private helper methods

  private detectPrimaryEmotionWithSuperposition(
    content: string,
    dimensions: EmotionalDimensions,
    linguistic: LinguisticFeatures,
    cultural: CulturalEmotionalContext
  ): {
    primary: QuantumEmotionalState['primaryEmotion'];
    secondary: QuantumEmotionalState['secondaryEmotions'];
    superposition: number;
  } {
    // Advanced emotion detection using multiple signals
    const emotionScores = new Map<string, number>();
    
    // Primary emotion categories with sophisticated detection
    const emotions = {
      'joy': { patterns: ['happy', 'joyful', 'excited', 'elated', 'euphoric'], valence: 0.8, arousal: 0.6 },
      'love': { patterns: ['love', 'adore', 'cherish', 'devoted', 'affection'], valence: 0.9, arousal: 0.4 },
      'peace': { patterns: ['peaceful', 'calm', 'serene', 'tranquil', 'centered'], valence: 0.6, arousal: 0.2 },
      'anger': { patterns: ['angry', 'furious', 'rage', 'irritated', 'outraged'], valence: -0.7, arousal: 0.8 },
      'sadness': { patterns: ['sad', 'depressed', 'melancholy', 'grief', 'sorrow'], valence: -0.6, arousal: 0.3 },
      'fear': { patterns: ['afraid', 'scared', 'terrified', 'anxious', 'worried'], valence: -0.5, arousal: 0.7 },
      'shame': { patterns: ['ashamed', 'guilty', 'embarrassed', 'humiliated', 'mortified'], valence: -0.8, arousal: 0.5 },
      'curiosity': { patterns: ['curious', 'intrigued', 'wonder', 'fascinated', 'interested'], valence: 0.5, arousal: 0.5 },
      'gratitude': { patterns: ['grateful', 'thankful', 'blessed', 'appreciative', 'humble'], valence: 0.7, arousal: 0.3 },
      'confusion': { patterns: ['confused', 'puzzled', 'bewildered', 'perplexed', 'uncertain'], valence: -0.2, arousal: 0.6 }
    };

    const lowerContent = content.toLowerCase();
    
    // Score emotions based on pattern matching
    Object.entries(emotions).forEach(([emotion, { patterns, valence, arousal }]) => {
      let score = 0;
      patterns.forEach(pattern => {
        const matches = (lowerContent.match(new RegExp(pattern, 'g')) || []).length;
        score += matches * 0.2;
      });
      
      // Cultural vocabulary enhancement
      if (cultural.cultural_emotional_vocabulary[emotion]) {
        const culturalDimensions = cultural.cultural_emotional_vocabulary[emotion];
        score *= (1 + culturalDimensions.authenticity * 0.5);
      }
      
      emotionScores.set(emotion, score);
    });

    // Find primary emotion
    const sortedEmotions = Array.from(emotionScores.entries())
      .sort(([,a], [,b]) => b - a);

    const primaryEmotion = sortedEmotions[0] || ['peace', 0];
    const emotionData = emotions[primaryEmotion[0] as keyof typeof emotions];

    const primary = {
      name: primaryEmotion[0],
      intensity: Math.min(1, primaryEmotion[1]),
      valence: dimensions.valence || emotionData.valence,
      arousal: dimensions.arousal || emotionData.arousal,
      dominance: dimensions.dominance || 0.5
    };

    // Calculate secondary emotions (top 3 after primary)
    const secondary = sortedEmotions
      .slice(1, 4)
      .filter(([, score]) => score > 0.1)
      .map(([emotion, score]) => ({
        name: emotion,
        probability: Math.min(1, score),
        intensity: Math.min(0.8, score * 0.8) // Secondary emotions are generally less intense
      }));

    // Calculate superposition (emotional complexity)
    const totalEmotionalActivity = Array.from(emotionScores.values())
      .reduce((sum, score) => sum + score, 0);
    const superposition = Math.min(1, totalEmotionalActivity / 5); // Normalize to 0-1

    return { primary, secondary, superposition };
  }

  private analyzeNeurologicalCorrelates(
    content: string,
    linguistic: LinguisticFeatures,
    dimensions: EmotionalDimensions
  ): QuantumEmotionalState['neurological_correlates'] {
    // Sophisticated analysis of cognitive patterns indicating brain region activity
    
    // Prefrontal cortex activation (executive function, planning, self-awareness)
    const prefrontal_indicators = [
      linguistic.agency_markers.self_agency, // Self-directed action
      linguistic.temporal_references.future_oriented, // Future planning
      dimensions.dominance, // Sense of control
      linguistic.lexical_density // Complex language processing
    ];
    const prefrontal_activation = prefrontal_indicators.reduce((a, b) => a + b, 0) / prefrontal_indicators.length;

    // Limbic system activation (emotional processing)
    const limbic_indicators = [
      dimensions.arousal, // Emotional intensity
      linguistic.emotional_intensity_markers.length / 10, // Emotional language
      linguistic.somatic_references.length / 5, // Body awareness (amygdala-body connection)
      1 - dimensions.temporal_stability // Emotional volatility
    ];
    const limbic_activation = Math.min(1, limbic_indicators.reduce((a, b) => a + b, 0) / limbic_indicators.length);

    // Default mode network (self-referential processing, mind-wandering)
    const dmn_indicators = [
      linguistic.temporal_references.past_oriented, // Rumination on past
      content.toLowerCase().split(' ').filter(word => ['i', 'me', 'my', 'myself'].includes(word)).length / 100, // Self-referential language
      dimensions.complexity, // Complex self-reflection
      linguistic.metaphorical_language.length / 10 // Abstract thinking
    ];
    const default_mode_network = Math.min(1, dmn_indicators.reduce((a, b) => a + b, 0) / dmn_indicators.length);

    // Mirror neuron activity (empathy, social cognition)
    const mirror_neuron_indicators = [
      linguistic.relational_markers.connection_seeking,
      linguistic.relational_markers.isolation_indicators * -1 + 0.5, // Inverted isolation
      content.toLowerCase().includes('others') ? 0.3 : 0,
      content.toLowerCase().includes('understand') ? 0.2 : 0
    ];
    const mirror_neuron_activity = Math.max(0, Math.min(1, mirror_neuron_indicators.reduce((a, b) => a + b, 0) / mirror_neuron_indicators.length));

    return {
      prefrontal_activation,
      limbic_activation,
      default_mode_network,
      mirror_neuron_activity
    };
  }

  private detectSomaticMarkers(
    content: string,
    linguistic: LinguisticFeatures
  ): QuantumEmotionalState['somatic_markers'] {
    const embodied_awareness = Math.min(1, linguistic.somatic_references.length / 5);
    
    // Detect tension patterns from language
    const tension_patterns: string[] = [];
    if (content.toLowerCase().includes('tight') || content.toLowerCase().includes('tense')) tension_patterns.push('muscle_tension');
    if (content.toLowerCase().includes('chest') || content.toLowerCase().includes('heart')) tension_patterns.push('chest_constriction');
    if (content.toLowerCase().includes('stomach') || content.toLowerCase().includes('gut')) tension_patterns.push('abdominal_tension');
    if (content.toLowerCase().includes('shoulder') || content.toLowerCase().includes('neck')) tension_patterns.push('upper_body_tension');

    // Estimate energy level
    const energy_indicators = [
      content.toLowerCase().includes('tired') ? -0.3 : 0,
      content.toLowerCase().includes('exhausted') ? -0.5 : 0,
      content.toLowerCase().includes('energized') ? 0.4 : 0,
      content.toLowerCase().includes('alive') ? 0.3 : 0,
      linguistic.emotional_intensity_markers.length > 3 ? 0.2 : 0
    ];
    const energy_level = Math.max(0, Math.min(1, 0.5 + energy_indicators.reduce((a, b) => a + b, 0)));

    // Analyze breathing pattern indicators
    let breathing_pattern: 'shallow' | 'deep' | 'irregular' | 'calm' = 'calm';
    if (content.toLowerCase().includes('breath') || content.toLowerCase().includes('breathing')) {
      if (content.toLowerCase().includes('shallow') || content.toLowerCase().includes('short')) {
        breathing_pattern = 'shallow';
      } else if (content.toLowerCase().includes('deep') || content.toLowerCase().includes('full')) {
        breathing_pattern = 'deep';
      } else if (content.toLowerCase().includes('irregular') || content.toLowerCase().includes('uneven')) {
        breathing_pattern = 'irregular';
      }
    }

    return {
      embodied_awareness,
      tension_patterns,
      energy_level,
      breathing_pattern
    };
  }

  private analyzeShadowAspects(
    content: string,
    linguistic: LinguisticFeatures,
    dimensions: EmotionalDimensions
  ): QuantumEmotionalState['shadow_aspects'] {
    const lowerContent = content.toLowerCase();
    
    // Detect suppressed emotions through linguistic markers
    const suppressed_emotions: string[] = [];
    
    // Look for denial patterns
    if (lowerContent.includes('not angry') || lowerContent.includes("don't feel angry")) {
      suppressed_emotions.push('anger');
    }
    if (lowerContent.includes('not sad') || lowerContent.includes('fine')) {
      suppressed_emotions.push('sadness');
    }
    if (lowerContent.includes('not scared') || lowerContent.includes('not afraid')) {
      suppressed_emotions.push('fear');
    }

    // Look for projection language
    const projection_indicators = [
      lowerContent.includes('they always'),
      lowerContent.includes('people are'),
      lowerContent.includes('everyone else'),
      lowerContent.includes('why do they'),
      lowerContent.includes('if only they')
    ];
    const projection_risk = projection_indicators.filter(Boolean).length / projection_indicators.length;

    // Calculate integration opportunity
    const integration_opportunity = Math.min(1, 
      dimensions.authenticity * 0.4 + // High authenticity enables integration
      linguistic.somatic_references.length / 10 * 0.3 + // Body awareness helps integration
      (suppressed_emotions.length > 0 ? 0.3 : 0) // Recognition is first step to integration
    );

    return {
      suppressed_emotions,
      projection_risk,
      integration_opportunity
    };
  }

  private calculateEmotionalCoherence(
    emotionDetection: { primary: any; secondary: any; superposition: number },
    dimensions: EmotionalDimensions
  ): number {
    // Coherence is high when emotions align and there's not excessive fragmentation
    const primary_strength = emotionDetection.primary.intensity;
    const secondary_dispersion = emotionDetection.secondary.length > 0 ? 
      emotionDetection.secondary.reduce((sum, emotion) => sum + emotion.intensity, 0) / emotionDetection.secondary.length : 0;
    
    // High coherence when primary emotion is strong and secondary emotions are not overwhelming
    const coherence = Math.max(0, Math.min(1, 
      primary_strength - (secondary_dispersion * 0.5) + (dimensions.temporal_stability * 0.3)
    ));
    
    return coherence;
  }

  private estimateTemporalStability(
    dimensions: EmotionalDimensions,
    linguistic: LinguisticFeatures
  ): number {
    // Estimate how stable this emotional state is likely to be over time
    const stability_indicators = [
      dimensions.authenticity, // Authentic emotions tend to be more stable
      1 - dimensions.arousal, // High arousal emotions are less stable
      linguistic.somatic_references.length > 0 ? 0.7 : 0.3, // Embodied emotions more stable
      linguistic.temporal_references.present_oriented, // Present focus more stable
      linguistic.lexical_density // Complex expression suggests processing, leading to stability
    ];
    
    return Math.min(1, stability_indicators.reduce((a, b) => a + b, 0) / stability_indicators.length);
  }

  // Additional helper methods for trajectory analysis
  private analyzeTrendDirection(timeline: EmotionalTrajectory['timeline']): EmotionalTrajectory['trend_direction'] {
    if (timeline.length < 3) return 'stable';
    
    const recentStates = timeline.slice(-5);
    const earlierStates = timeline.slice(0, Math.min(5, timeline.length - 5));
    
    const recentAvgValence = recentStates.reduce((sum, state) => sum + state.dimensions.valence, 0) / recentStates.length;
    const earlierAvgValence = earlierStates.length > 0 ? 
      earlierStates.reduce((sum, state) => sum + state.dimensions.valence, 0) / earlierStates.length : recentAvgValence;
    
    const valenceDiff = recentAvgValence - earlierAvgValence;
    const volatility = this.calculateVolatilityFromStates(recentStates);
    
    if (volatility > 0.5) return 'chaotic';
    if (valenceDiff > 0.2) return 'ascending';
    if (valenceDiff < -0.2) return 'descending';
    if (this.detectCyclicalPattern(timeline)) return 'cyclical';
    return 'stable';
  }

  private calculateVolatility(timeline: EmotionalTrajectory['timeline']): number {
    return this.calculateVolatilityFromStates(timeline);
  }

  private calculateVolatilityFromStates(states: Array<{ dimensions: EmotionalDimensions }>): number {
    if (states.length < 2) return 0;
    
    let totalVariance = 0;
    for (let i = 1; i < states.length; i++) {
      const diff = Math.abs(states[i]!.dimensions.valence - states[i-1]!.dimensions.valence);
      totalVariance += diff;
    }
    
    return totalVariance / (states.length - 1);
  }

  private detectCyclicalPattern(timeline: EmotionalTrajectory['timeline']): boolean {
    // Simplified cyclical detection - would use more sophisticated pattern recognition in production
    if (timeline.length < 6) return false;
    
    const valences = timeline.map(state => state.dimensions.valence);
    const peaks = valences.filter((val, i) => 
      i > 0 && i < valences.length - 1 && 
      val > valences[i-1]! && val > valences[i+1]!
    );
    
    return peaks.length >= 2;
  }

  private identifyResilienceIndicators(timeline: EmotionalTrajectory['timeline']): string[] {
    const indicators: string[] = [];
    
    // Look for recovery patterns after low points
    let recoveryCount = 0;
    for (let i = 1; i < timeline.length - 1; i++) {
      const prev = timeline[i-1]!.dimensions.valence;
      const current = timeline[i]!.dimensions.valence;
      const next = timeline[i+1]!.dimensions.valence;
      
      if (prev < -0.3 && current < -0.2 && next > 0.1) {
        recoveryCount++;
      }
    }
    
    if (recoveryCount > 0) indicators.push('Emotional recovery patterns detected');
    
    // Look for stable baseline maintenance
    const avgValence = timeline.reduce((sum, state) => sum + state.dimensions.valence, 0) / timeline.length;
    if (avgValence > -0.1 && avgValence < 0.8) indicators.push('Stable emotional baseline');
    
    return indicators;
  }

  private identifyGrowthMoments(timeline: EmotionalTrajectory['timeline']): Date[] {
    const growthMoments: Date[] = [];
    
    // Look for significant positive shifts
    for (let i = 1; i < timeline.length; i++) {
      const prev = timeline[i-1]!.dimensions;
      const current = timeline[i]!.dimensions;
      
      if (current.valence > prev.valence + 0.3 && 
          current.authenticity > prev.authenticity + 0.2) {
        growthMoments.push(timeline[i]!.timestamp);
      }
    }
    
    return growthMoments;
  }

  private identifyInterventionOpportunities(timeline: EmotionalTrajectory['timeline']): Date[] {
    const opportunities: Date[] = [];
    
    // Look for concerning patterns
    for (let i = 2; i < timeline.length; i++) {
      const recent = timeline.slice(i-2, i+1);
      const avgValence = recent.reduce((sum, state) => sum + state.dimensions.valence, 0) / recent.length;
      const avgArousal = recent.reduce((sum, state) => sum + state.dimensions.arousal, 0) / recent.length;
      
      if (avgValence < -0.5 && avgArousal > 0.7) {
        opportunities.push(timeline[i]!.timestamp);
      }
    }
    
    return opportunities;
  }

  // Additional helper methods for neural profile building
  private calculateBaselineSignature(states: QuantumEmotionalState[]): EmotionalDimensions {
    if (states.length === 0) {
      return { valence: 0, arousal: 0.3, dominance: 0.5, authenticity: 0.5, complexity: 0.3, temporal_stability: 0.5 };
    }
    
    const avgValence = states.reduce((sum, state) => sum + state.primaryEmotion.valence, 0) / states.length;
    const avgArousal = states.reduce((sum, state) => sum + state.primaryEmotion.arousal, 0) / states.length;
    const avgDominance = states.reduce((sum, state) => sum + state.primaryEmotion.dominance, 0) / states.length;
    const avgAuthenticity = states.reduce((sum, state) => sum + state.coherence, 0) / states.length;
    const avgComplexity = states.reduce((sum, state) => sum + state.emotionalSuperposition, 0) / states.length;
    const avgStability = states.reduce((sum, state) => sum + state.temporal_stability, 0) / states.length;
    
    return {
      valence: avgValence,
      arousal: avgArousal,
      dominance: avgDominance,
      authenticity: avgAuthenticity,
      complexity: avgComplexity,
      temporal_stability: avgStability
    };
  }

  private analyzeVolatilityPattern(states: QuantumEmotionalState[]): NeuralEmotionalProfile['emotional_volatility_pattern'] {
    if (states.length < 3) {
      return { amplitude: 0.3, frequency: 0.1, recovery_time: 12, triggers: [] };
    }
    
    // Calculate amplitude (how extreme the emotional swings are)
    const valences = states.map(state => state.primaryEmotion.valence);
    const maxValence = Math.max(...valences);
    const minValence = Math.min(...valences);
    const amplitude = maxValence - minValence;
    
    // Calculate frequency (how often significant changes occur)
    let changeCount = 0;
    for (let i = 1; i < valences.length; i++) {
      if (Math.abs(valences[i]! - valences[i-1]!) > 0.3) {
        changeCount++;
      }
    }
    const frequency = changeCount / Math.max(1, valences.length - 1);
    
    // Estimate recovery time (simplified)
    const recovery_time = amplitude > 0.6 ? 24 : amplitude > 0.3 ? 12 : 6; // hours
    
    // Identify common triggers (simplified)
    const triggers = ['stress', 'relationships', 'work', 'health']; // Would be more sophisticated in production
    
    return { amplitude, frequency, recovery_time, triggers };
  }

  private calculateEmotionalIntelligenceMetrics(
    states: QuantumEmotionalState[],
    entries: Array<{ content: string; createdAt: Date; mood?: string }>
  ): NeuralEmotionalProfile['emotional_intelligence_metrics'] {
    // Sophisticated EI calculation based on various indicators
    const avgCoherence = states.length > 0 ? 
      states.reduce((sum, state) => sum + state.coherence, 0) / states.length : 0.5;
    
    // Self-awareness: coherence + somatic awareness
    const self_awareness = Math.min(1, avgCoherence + 
      (states.reduce((sum, state) => sum + state.somatic_markers.embodied_awareness, 0) / Math.max(1, states.length)) * 0.3);
    
    // Self-regulation: temporal stability + low volatility
    const avgStability = states.length > 0 ?
      states.reduce((sum, state) => sum + state.temporal_stability, 0) / states.length : 0.5;
    const self_regulation = avgStability;
    
    // Motivation: growth orientation (simplified)
    const motivation = 0.7; // Would analyze goal-oriented language in production
    
    // Empathy: mirror neuron activity
    const avgMirrorActivity = states.length > 0 ?
      states.reduce((sum, state) => sum + state.neurological_correlates.mirror_neuron_activity, 0) / states.length : 0.5;
    const empathy = avgMirrorActivity;
    
    // Social skills: relational language (simplified)
    const social_skills = 0.6; // Would analyze relational language patterns
    
    return { self_awareness, self_regulation, motivation, empathy, social_skills };
  }

  private analyzeArchetypeResonance(entries: Array<{ content: string; mood?: string }>): Record<string, number> {
    // Simplified archetype resonance analysis
    const archetypes = {
      'healer': 0.5,
      'warrior': 0.4,
      'sage': 0.6,
      'innocent': 0.3,
      'explorer': 0.5,
      'creator': 0.4,
      'lover': 0.5,
      'caregiver': 0.6
    };
    
    // Would analyze content for archetype-specific language patterns
    return archetypes;
  }

  private determineGrowthTrajectory(
    states: QuantumEmotionalState[],
    entries: Array<{ content: string }>
  ): NeuralEmotionalProfile['growth_trajectory'] {
    // Simplified growth trajectory analysis
    const development_stage: 'exploration' | 'consolidation' | 'integration' | 'mastery' | 'transcendence' = 'integration';
    const growth_velocity = 0.6;
    const next_developmental_edge = 'Shadow integration work';
    const readiness_for_challenge = 0.7;
    
    return { development_stage, growth_velocity, next_developmental_edge, readiness_for_challenge };
  }

  private analyzeTraumaInformedMarkers(
    states: QuantumEmotionalState[],
    entries: Array<{ content: string }>
  ): NeuralEmotionalProfile['trauma_informed_markers'] {
    // Sophisticated trauma-informed analysis
    const avgHypervigilance = states.length > 0 ?
      states.reduce((sum, state) => sum + (state.primaryEmotion.arousal > 0.7 && state.primaryEmotion.valence < 0 ? 0.8 : 0.2), 0) / states.length : 0.3;
    
    const avgDissociation = states.length > 0 ?
      states.reduce((sum, state) => sum + (1 - state.somatic_markers.embodied_awareness), 0) / states.length : 0.3;
    
    const avgSomaticAwareness = states.length > 0 ?
      states.reduce((sum, state) => sum + state.somatic_markers.embodied_awareness, 0) / states.length : 0.5;
    
    const avgSafety = states.length > 0 ?
      states.reduce((sum, state) => sum + state.primaryEmotion.dominance, 0) / states.length : 0.5;
    
    const avgTrust = 0.6; // Would analyze relational language for trust indicators
    
    return {
      hypervigilance_indicators: avgHypervigilance,
      dissociation_markers: avgDissociation,
      somatic_awareness: avgSomaticAwareness,
      safety_perception: avgSafety,
      trust_capacity: avgTrust
    };
  }

  private determineCulturalAdaptation(
    states: QuantumEmotionalState[],
    cultural?: CulturalEmotionalContext
  ): NeuralEmotionalProfile['cultural_emotional_adaptation'] {
    if (!cultural) {
      return {
        expression_style: 'direct',
        intensity_modulation: 1.0,
        collectivist_vs_individualist: 0.3,
        power_distance_sensitivity: 0.4
      };
    }
    
    const expression_style: 'direct' | 'indirect' | 'contextual' | 'ritualized' = 
      cultural.emotional_expression_norms.directness_preference > 0.7 ? 'direct' :
      cultural.emotional_expression_norms.directness_preference > 0.5 ? 'contextual' :
      cultural.emotional_expression_norms.directness_preference > 0.3 ? 'indirect' : 'ritualized';
    
    return {
      expression_style,
      intensity_modulation: cultural.emotional_expression_norms.intensity_scaling,
      collectivist_vs_individualist: cultural.emotional_expression_norms.collective_vs_individual,
      power_distance_sensitivity: cultural.emotional_expression_norms.hierarchical_consideration
    };
  }
}

// Export singleton instance
export const advancedEmotionDetector = new AdvancedEmotionDetector();

// Export utility functions
export {
  AdvancedEmotionDetector
};