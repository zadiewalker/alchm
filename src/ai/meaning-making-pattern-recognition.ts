/**
 * ALCHM Meaning-Making Pattern Recognition System
 * 
 * AI system that identifies how users create meaning from their experiences
 * and suggests pathway enhancements based on their unique meaning-making patterns.
 * Supports both spiritual and secular approaches to finding purpose and significance.
 */

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';

// Core meaning-making types
export interface MeaningMakingPattern {
  userId: string;
  patternType: MeaningMakingType;
  frequency: number;
  confidence: number;
  examples: MeaningExample[];
  triggers: string[];
  frameworks: string[];
  evolutionStage: 'emerging' | 'developing' | 'established' | 'integrated';
  culturalInfluences: string[];
  lastDetected: Date;
  strengthIndicators: string[];
  growthOpportunities: string[];
}

export type MeaningMakingType = 
  | 'narrative-coherence'        // Creating coherent life stories
  | 'causal-attribution'         // Finding causes and explanations
  | 'value-alignment'            // Connecting experiences to values
  | 'spiritual-interpretation'   // Finding spiritual/divine meaning
  | 'growth-orientation'         // Seeing challenges as growth opportunities
  | 'service-purpose'            // Finding meaning through helping others
  | 'legacy-building'            // Creating lasting impact
  | 'existential-acceptance'     // Accepting uncertainty while creating meaning
  | 'collective-meaning'         // Finding meaning through community/culture
  | 'transcendent-connection'    // Connecting to something greater
  | 'resilience-narrative'       // Building stories of overcoming
  | 'wisdom-integration'         // Synthesizing lessons learned;

export interface MeaningExample {
  text: string;
  entryId: string;
  timestamp: Date;
  confidence: number;
  framework: string;
  culturalContext?: string;
  emotionalTone: 'positive' | 'neutral' | 'negative' | 'mixed';
}

export interface MeaningMakingProfile {
  userId: string;
  dominantPatterns: MeaningMakingPattern[];
  secondaryPatterns: MeaningMakingPattern[];
  meaningMakingStyle: MeaningMakingStyle;
  frameworks: MeaningFramework[];
  culturalInfluences: CulturalMeaningInfluence[];
  developmentalStage: DevelopmentalStage;
  triggers: MeaningTrigger[];
  blockers: MeaningBlocker[];
  preferences: MeaningPreferences;
  progressMetrics: MeaningProgressMetric[];
  lastUpdated: Date;
  confidenceScore: number;
}

export interface MeaningMakingStyle {
  primary: 'rational' | 'emotional' | 'spiritual' | 'experiential' | 'relational' | 'creative';
  secondary?: string;
  integrationLevel: 'fragmented' | 'developing' | 'integrated' | 'fluid';
  adaptability: 'rigid' | 'moderate' | 'flexible' | 'highly-flexible';
  timeOrientation: 'past-focused' | 'present-focused' | 'future-focused' | 'integrated-temporal';
}

export interface MeaningFramework {
  name: string;
  category: 'religious' | 'spiritual' | 'philosophical' | 'psychological' | 'cultural' | 'scientific';
  usage: number; // How often user employs this framework
  effectiveness: number; // How well it serves the user
  examples: string[];
  sources: string[];
}

export interface CulturalMeaningInfluence {
  culture: string;
  influence: 'strong' | 'moderate' | 'weak';
  aspects: string[];
  harmonious: boolean;
  conflicts?: string[];
}

export interface DevelopmentalStage {
  stage: 'conventional' | 'individuative' | 'conjunctive' | 'universalizing';
  characteristics: string[];
  challenges: string[];
  opportunities: string[];
  supportNeeds: string[];
}

export interface MeaningTrigger {
  type: 'crisis' | 'transition' | 'achievement' | 'loss' | 'relationship' | 'spiritual' | 'existential';
  description: string;
  frequency: number;
  effectiveness: number;
  patterns: string[];
}

export interface MeaningBlocker {
  type: 'cognitive' | 'emotional' | 'spiritual' | 'social' | 'cultural' | 'trauma-related';
  description: string;
  impact: 'low' | 'moderate' | 'high';
  interventions: string[];
  progressStatus: 'identified' | 'addressing' | 'improving' | 'resolved';
}

export interface MeaningPreferences {
  vocabulary: 'secular' | 'spiritual' | 'religious' | 'mixed';
  complexity: 'simple' | 'moderate' | 'complex';
  communityOriented: boolean;
  actionOriented: boolean;
  reflectiveOriented: boolean;
  evidenceBased: boolean;
  intuitionBased: boolean;
}

export interface MeaningProgressMetric {
  dimension: string;
  baseline: number;
  current: number;
  target: number;
  measurementMethod: string;
  trend: 'improving' | 'stable' | 'declining';
  lastMeasured: Date;
}

export interface PathwayEnhancement {
  pathwayId: string;
  enhancements: Enhancement[];
  rationale: string;
  expectedOutcomes: string[];
  customizations: Customization[];
  progressAdaptations: ProgressAdaptation[];
}

export interface Enhancement {
  type: 'content' | 'practice' | 'reflection' | 'community' | 'measurement';
  modification: string;
  reasoning: string;
  implementationGuide: string[];
}

export interface Customization {
  aspect: string;
  customization: string;
  culturalSensitivity?: string;
  personalRelevance: string;
}

export interface ProgressAdaptation {
  metric: string;
  adaptedMeasurement: string;
  frequency: string;
  meaningfulFramework: string;
}

export class MeaningMakingPatternRecognition {
  private static instance: MeaningMakingPatternRecognition;
  
  private constructor() {}
  
  static getInstance(): MeaningMakingPatternRecognition {
    if (!MeaningMakingPatternRecognition.instance) {
      MeaningMakingPatternRecognition.instance = new MeaningMakingPatternRecognition();
    }
    return MeaningMakingPatternRecognition.instance;
  }

  /**
   * Analyze journal entry for meaning-making patterns
   */
  async analyzeMeaningMakingPatterns(
    userId: string, 
    journalText: string, 
    entryId: string
  ): Promise<MeaningMakingPattern[]> {
    try {
      const patterns: MeaningMakingPattern[] = [];
      const text = journalText.toLowerCase();

      // Pattern detection for each meaning-making type
      const patternDetectors = {
        'narrative-coherence': this.detectNarrativeCoherence,
        'causal-attribution': this.detectCausalAttribution,
        'value-alignment': this.detectValueAlignment,
        'spiritual-interpretation': this.detectSpiritualInterpretation,
        'growth-orientation': this.detectGrowthOrientation,
        'service-purpose': this.detectServicePurpose,
        'legacy-building': this.detectLegacyBuilding,
        'existential-acceptance': this.detectExistentialAcceptance,
        'collective-meaning': this.detectCollectiveMeaning,
        'transcendent-connection': this.detectTranscendentConnection,
        'resilience-narrative': this.detectResilienceNarrative,
        'wisdom-integration': this.detectWisdomIntegration
      };

      for (const [patternType, detector] of Object.entries(patternDetectors)) {
        const detection = await detector.call(this, text, journalText, entryId);
        if (detection.confidence > 0.3) {
          patterns.push({
            userId,
            patternType: patternType as MeaningMakingType,
            frequency: 1, // Will be aggregated later
            confidence: detection.confidence,
            examples: detection.examples,
            triggers: detection.triggers,
            frameworks: detection.frameworks,
            evolutionStage: detection.stage || 'emerging',
            culturalInfluences: detection.culturalInfluences || [],
            lastDetected: new Date(),
            strengthIndicators: detection.strengths || [],
            growthOpportunities: detection.opportunities || []
          });
        }
      }

      // Store patterns for aggregation
      await this.storeMeaningPatternDetection(userId, patterns);

      return patterns;

    } catch (error) {
      console.error('Error analyzing meaning-making patterns:', error);
      return [];
    }
  }

  /**
   * Build comprehensive meaning-making profile for user
   */
  async buildMeaningMakingProfile(userId: string): Promise<MeaningMakingProfile> {
    try {
      // Get existing profile
      const existingProfile = await this.getMeaningMakingProfile(userId);
      
      // Get recent pattern detections
      const recentDetections = await this.getRecentPatternDetections(userId, 60); // Last 60 days
      
      // Aggregate patterns
      const aggregatedPatterns = this.aggregatePatterns(recentDetections);
      
      // Classify into dominant and secondary patterns
      const sortedPatterns = aggregatedPatterns.sort((a, b) => b.frequency - a.frequency);
      const dominantPatterns = sortedPatterns.slice(0, 3);
      const secondaryPatterns = sortedPatterns.slice(3, 6);

      // Determine meaning-making style
      const meaningMakingStyle = this.determineMeaningMakingStyle(dominantPatterns);
      
      // Identify frameworks
      const frameworks = this.identifyMeaningFrameworks(recentDetections);
      
      // Assess cultural influences
      const culturalInfluences = this.assessCulturalInfluences(recentDetections);
      
      // Determine developmental stage
      const developmentalStage = this.assessDevelopmentalStage(dominantPatterns, frameworks);
      
      // Identify triggers and blockers
      const triggers = this.identifyMeaningTriggers(recentDetections);
      const blockers = this.identifyMeaningBlockers(recentDetections, existingProfile);
      
      // Determine preferences
      const preferences = this.determineMeaningPreferences(dominantPatterns, frameworks);
      
      // Set up progress metrics
      const progressMetrics = this.setupProgressMetrics(dominantPatterns, existingProfile);

      const profile: MeaningMakingProfile = {
        userId,
        dominantPatterns,
        secondaryPatterns,
        meaningMakingStyle,
        frameworks,
        culturalInfluences,
        developmentalStage,
        triggers,
        blockers,
        preferences,
        progressMetrics,
        lastUpdated: new Date(),
        confidenceScore: this.calculateConfidenceScore(recentDetections.length, dominantPatterns)
      };

      // Store updated profile
      await this.storeMeaningMakingProfile(profile);
      
      return profile;

    } catch (error) {
      console.error('Error building meaning-making profile:', error);
      throw error;
    }
  }

  /**
   * Generate pathway enhancements based on meaning-making patterns
   */
  async generatePathwayEnhancements(
    userId: string, 
    pathwayId: string
  ): Promise<PathwayEnhancement> {
    try {
      const profile = await this.getMeaningMakingProfile(userId);
      if (!profile) {
        throw new Error('No meaning-making profile found for user');
      }

      const pathway = await this.getPathwayDetails(pathwayId);
      
      // Generate enhancements based on dominant patterns
      const enhancements = this.generateEnhancementsForPatterns(
        profile.dominantPatterns, 
        pathway
      );
      
      // Generate customizations
      const customizations = this.generateCustomizations(profile, pathway);
      
      // Adapt progress tracking
      const progressAdaptations = this.adaptProgressTracking(profile, pathway);
      
      // Generate rationale
      const rationale = this.generateEnhancementRationale(profile, enhancements);
      
      // Predict outcomes
      const expectedOutcomes = this.predictEnhancementOutcomes(profile, enhancements);

      const enhancement: PathwayEnhancement = {
        pathwayId,
        enhancements,
        rationale,
        expectedOutcomes,
        customizations,
        progressAdaptations
      };

      return enhancement;

    } catch (error) {
      console.error('Error generating pathway enhancements:', error);
      throw error;
    }
  }

  /**
   * Track meaning-making progress over time
   */
  async trackMeaningMakingProgress(userId: string): Promise<{
    currentMetrics: MeaningProgressMetric[];
    trends: any[];
    insights: string[];
    recommendations: string[];
  }> {
    try {
      const profile = await this.getMeaningMakingProfile(userId);
      if (!profile) {
        throw new Error('No meaning-making profile found');
      }

      // Get historical data
      const historicalData = await this.getHistoricalMeaningData(userId);
      
      // Calculate trends
      const trends = this.calculateMeaningTrends(historicalData);
      
      // Generate insights
      const insights = this.generateMeaningInsights(profile, trends);
      
      // Generate recommendations
      const recommendations = this.generateMeaningRecommendations(profile, trends);

      return {
        currentMetrics: profile.progressMetrics,
        trends,
        insights,
        recommendations
      };

    } catch (error) {
      console.error('Error tracking meaning-making progress:', error);
      throw error;
    }
  }

  // Pattern Detection Methods

  private async detectNarrativeCoherence(text: string, fullText: string, entryId: string): Promise<any> {
    const patterns = [
      /this reminds me of/gi,
      /looking back/gi,
      /the story of/gi,
      /chapter in my life/gi,
      /connects to/gi,
      /pattern/gi,
      /journey/gi,
      /thread/gi
    ];

    const examples: MeaningExample[] = [];
    let confidence = 0;

    patterns.forEach(pattern => {
      const matches = fullText.match(pattern);
      if (matches) {
        confidence += matches.length * 0.1;
        examples.push({
          text: matches[0],
          entryId,
          timestamp: new Date(),
          confidence: 0.7,
          framework: 'narrative',
          emotionalTone: 'neutral'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['reflection', 'life review', 'storytelling'],
      frameworks: ['narrative therapy', 'life story', 'autobiographical reasoning'],
      stage: confidence > 0.7 ? 'established' : 'developing',
      strengths: ['coherent life story', 'pattern recognition'],
      opportunities: ['deeper narrative integration', 'sharing wisdom stories']
    };
  }

  private async detectCausalAttribution(text: string, fullText: string, entryId: string): Promise<any> {
    const patterns = [
      /because/gi,
      /caused by/gi,
      /the reason/gi,
      /resulted in/gi,
      /led to/gi,
      /due to/gi,
      /therefore/gi,
      /as a result/gi
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    patterns.forEach(pattern => {
      const matches = fullText.match(pattern);
      if (matches) {
        confidence += matches.length * 0.15;
        examples.push({
          text: matches[0],
          entryId,
          timestamp: new Date(),
          confidence: 0.8,
          framework: 'causal',
          emotionalTone: 'neutral'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['problem-solving', 'analysis', 'understanding'],
      frameworks: ['attribution theory', 'causal reasoning', 'logical analysis'],
      stage: confidence > 0.6 ? 'established' : 'developing',
      strengths: ['analytical thinking', 'cause-effect understanding'],
      opportunities: ['complex systems thinking', 'multicausal analysis']
    };
  }

  private async detectValueAlignment(text: string, fullText: string, entryId: string): Promise<any> {
    const valueWords = [
      'important', 'matters', 'value', 'principle', 'belief', 'stand for',
      'right', 'wrong', 'should', 'ought', 'moral', 'ethical', 'meaningful'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    valueWords.forEach(word => {
      if (text.includes(word)) {
        confidence += 0.1;
        examples.push({
          text: word,
          entryId,
          timestamp: new Date(),
          confidence: 0.6,
          framework: 'values',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['moral decisions', 'value conflicts', 'purpose reflection'],
      frameworks: ['values clarification', 'moral psychology', 'ethical reflection'],
      stage: confidence > 0.5 ? 'developing' : 'emerging',
      strengths: ['value awareness', 'ethical sensitivity'],
      opportunities: ['value prioritization', 'value-action alignment']
    };
  }

  private async detectSpiritualInterpretation(text: string, fullText: string, entryId: string): Promise<any> {
    const spiritualTerms = [
      'god', 'divine', 'sacred', 'spiritual', 'soul', 'prayer', 'faith',
      'universe', 'cosmic', 'transcendent', 'holy', 'blessed', 'grace'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    spiritualTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.15;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.9,
          framework: 'spiritual',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['spiritual experiences', 'crisis', 'wonder', 'gratitude'],
      frameworks: ['theology', 'mysticism', 'spiritual psychology', 'religious studies'],
      stage: confidence > 0.7 ? 'established' : 'developing',
      strengths: ['spiritual awareness', 'transcendent connection'],
      opportunities: ['spiritual practices', 'interfaith dialogue']
    };
  }

  private async detectGrowthOrientation(text: string, fullText: string, entryId: string): Promise<any> {
    const growthTerms = [
      'learn', 'grow', 'opportunity', 'challenge', 'develop', 'improve',
      'lesson', 'teach', 'strength', 'resilience', 'overcome', 'progress'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    growthTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.1;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.7,
          framework: 'growth',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['challenges', 'setbacks', 'learning opportunities'],
      frameworks: ['growth mindset', 'post-traumatic growth', 'resilience theory'],
      stage: confidence > 0.6 ? 'established' : 'developing',
      strengths: ['resilience', 'adaptability', 'learning orientation'],
      opportunities: ['challenge reframing', 'strength identification']
    };
  }

  private async detectServicePurpose(text: string, fullText: string, entryId: string): Promise<any> {
    const serviceTerms = [
      'help', 'serve', 'contribute', 'give', 'support', 'volunteer',
      'make a difference', 'impact', 'community', 'others', 'care'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    serviceTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.12;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.8,
          framework: 'service',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['service opportunities', 'community needs', 'altruistic impulses'],
      frameworks: ['service learning', 'altruism', 'prosocial behavior'],
      stage: confidence > 0.5 ? 'developing' : 'emerging',
      strengths: ['compassion', 'community connection', 'purpose clarity'],
      opportunities: ['service expansion', 'impact measurement']
    };
  }

  private async detectLegacyBuilding(text: string, fullText: string, entryId: string): Promise<any> {
    const legacyTerms = [
      'legacy', 'future', 'children', 'next generation', 'leave behind',
      'remember', 'impact', 'lasting', 'endure', 'inheritance', 'tradition'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    legacyTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.15;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.8,
          framework: 'legacy',
          emotionalTone: 'mixed'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['aging', 'parenthood', 'mortality awareness', 'achievement'],
      frameworks: ['generativity theory', 'mortality salience', 'intergenerational thinking'],
      stage: confidence > 0.6 ? 'developing' : 'emerging',
      strengths: ['future orientation', 'impact awareness'],
      opportunities: ['legacy planning', 'mentoring others']
    };
  }

  private async detectExistentialAcceptance(text: string, fullText: string, entryId: string): Promise<any> {
    const existentialTerms = [
      'accept', 'uncertainty', 'unknown', 'mystery', 'paradox', 'ambiguity',
      'complex', 'both', 'neither', 'embrace', 'surrender', 'letting go'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    existentialTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.13;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.7,
          framework: 'existential',
          emotionalTone: 'neutral'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['existential crisis', 'paradoxes', 'uncertainty'],
      frameworks: ['existential psychology', 'acceptance therapy', 'philosophical inquiry'],
      stage: confidence > 0.7 ? 'integrated' : 'developing',
      strengths: ['tolerance for ambiguity', 'philosophical depth'],
      opportunities: ['existential exploration', 'paradox integration']
    };
  }

  private async detectCollectiveMeaning(text: string, fullText: string, entryId: string): Promise<any> {
    const collectiveTerms = [
      'we', 'us', 'together', 'community', 'family', 'culture', 'tradition',
      'belong', 'connected', 'shared', 'collective', 'group', 'society'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    collectiveTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.08;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.6,
          framework: 'collective',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['community events', 'cultural celebrations', 'group challenges'],
      frameworks: ['collectivism', 'social identity theory', 'cultural psychology'],
      stage: confidence > 0.5 ? 'established' : 'developing',
      strengths: ['social connection', 'cultural awareness'],
      opportunities: ['community engagement', 'cultural exploration']
    };
  }

  private async detectTranscendentConnection(text: string, fullText: string, entryId: string): Promise<any> {
    const transcendentTerms = [
      'beyond', 'transcend', 'greater', 'infinite', 'eternal', 'higher',
      'sublime', 'awe', 'wonder', 'mystery', 'cosmos', 'universal'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    transcendentTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.14;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.8,
          framework: 'transcendent',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['peak experiences', 'nature encounters', 'spiritual moments'],
      frameworks: ['transpersonal psychology', 'mysticism', 'peak experience theory'],
      stage: confidence > 0.6 ? 'developing' : 'emerging',
      strengths: ['transcendent awareness', 'spiritual openness'],
      opportunities: ['mystical practices', 'nature connection']
    };
  }

  private async detectResilienceNarrative(text: string, fullText: string, entryId: string): Promise<any> {
    const resilienceTerms = [
      'survived', 'overcome', 'stronger', 'resilient', 'bounce back',
      'endure', 'persevere', 'tough', 'warrior', 'fighter', 'courage'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    resilienceTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.12;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.8,
          framework: 'resilience',
          emotionalTone: 'positive'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['adversity', 'challenges', 'recovery'],
      frameworks: ['resilience theory', 'trauma recovery', 'strength-based approaches'],
      stage: confidence > 0.6 ? 'established' : 'developing',
      strengths: ['resilience', 'courage', 'survivor identity'],
      opportunities: ['trauma integration', 'post-traumatic growth']
    };
  }

  private async detectWisdomIntegration(text: string, fullText: string, entryId: string): Promise<any> {
    const wisdomTerms = [
      'wisdom', 'insight', 'understand', 'realize', 'perspective', 'truth',
      'clarity', 'enlighten', 'aware', 'conscious', 'integrate', 'synthesize'
    ];

    let confidence = 0;
    const examples: MeaningExample[] = [];

    wisdomTerms.forEach(term => {
      if (text.includes(term)) {
        confidence += 0.11;
        examples.push({
          text: term,
          entryId,
          timestamp: new Date(),
          confidence: 0.7,
          framework: 'wisdom',
          emotionalTone: 'neutral'
        });
      }
    });

    return {
      confidence: Math.min(1, confidence),
      examples: examples.slice(0, 3),
      triggers: ['life experiences', 'reflection', 'learning'],
      frameworks: ['wisdom traditions', 'integral theory', 'developmental psychology'],
      stage: confidence > 0.7 ? 'integrated' : 'developing',
      strengths: ['wisdom integration', 'insight development'],
      opportunities: ['wisdom sharing', 'teaching others']
    };
  }

  // Helper methods
  private async storeMeaningPatternDetection(userId: string, patterns: MeaningMakingPattern[]): Promise<void> {
    try {
      for (const pattern of patterns) {
        await addDoc(collection(db, 'meaning_pattern_detections'), {
          ...pattern,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error storing meaning pattern detection:', error);
    }
  }

  private async getMeaningMakingProfile(userId: string): Promise<MeaningMakingProfile | null> {
    try {
      const docRef = doc(db, 'meaning_making_profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as MeaningMakingProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting meaning-making profile:', error);
      return null;
    }
  }

  private async storeMeaningMakingProfile(profile: MeaningMakingProfile): Promise<void> {
    try {
      const docRef = doc(db, 'meaning_making_profiles', profile.userId);
      await setDoc(docRef, profile);
    } catch (error) {
      console.error('Error storing meaning-making profile:', error);
    }
  }

  private async getRecentPatternDetections(userId: string, days: number): Promise<any[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, 'meaning_pattern_detections'),
        where('userId', '==', userId),
        where('timestamp', '>=', cutoffDate),
        orderBy('timestamp', 'desc'),
        limit(200)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error('Error getting recent pattern detections:', error);
      return [];
    }
  }

  private aggregatePatterns(detections: any[]): MeaningMakingPattern[] {
    const patternMap = new Map<string, MeaningMakingPattern>();

    detections.forEach(detection => {
      const key = detection.patternType;
      if (patternMap.has(key)) {
        const existing = patternMap.get(key)!;
        existing.frequency += 1;
        existing.confidence = (existing.confidence + detection.confidence) / 2;
        existing.examples = [...existing.examples, ...detection.examples].slice(0, 5);
      } else {
        patternMap.set(key, detection);
      }
    });

    return Array.from(patternMap.values());
  }

  private determineMeaningMakingStyle(patterns: MeaningMakingPattern[]): MeaningMakingStyle {
    // Analyze patterns to determine style
    const styleMap = {
      'rational': ['causal-attribution', 'wisdom-integration'],
      'emotional': ['growth-orientation', 'resilience-narrative'],
      'spiritual': ['spiritual-interpretation', 'transcendent-connection'],
      'relational': ['collective-meaning', 'service-purpose'],
      'experiential': ['narrative-coherence', 'existential-acceptance'],
      'creative': ['legacy-building', 'value-alignment']
    };

    let maxScore = 0;
    let primaryStyle = 'experiential';

    Object.entries(styleMap).forEach(([style, patternTypes]) => {
      const score = patterns
        .filter(p => patternTypes.includes(p.patternType))
        .reduce((sum, p) => sum + p.frequency, 0);
      
      if (score > maxScore) {
        maxScore = score;
        primaryStyle = style;
      }
    });

    return {
      primary: primaryStyle as any,
      integrationLevel: maxScore > 5 ? 'integrated' : 'developing',
      adaptability: 'moderate',
      timeOrientation: 'integrated-temporal'
    };
  }

  private identifyMeaningFrameworks(detections: any[]): MeaningFramework[] {
    const frameworkMap = new Map<string, MeaningFramework>();

    detections.forEach(detection => {
      detection.frameworks?.forEach((framework: string) => {
        if (frameworkMap.has(framework)) {
          const existing = frameworkMap.get(framework)!;
          existing.usage += 1;
        } else {
          frameworkMap.set(framework, {
            name: framework,
            category: this.categorizeFram

,
            usage: 1,
            effectiveness: 0.7, // Default effectiveness
            examples: [],
            sources: []
          });
        }
      });
    });

    return Array.from(frameworkMap.values()).slice(0, 8);
  }

  private categorizeFramework(framework: string): MeaningFramework['category'] {
    const categories = {
      'religious': ['theology', 'christian', 'islamic', 'jewish', 'hindu', 'buddhist'],
      'spiritual': ['mysticism', 'spiritual', 'transcendent', 'sacred'],
      'philosophical': ['existential', 'wisdom', 'ethical', 'moral'],
      'psychological': ['therapy', 'psychology', 'cognitive', 'behavioral'],
      'cultural': ['cultural', 'collective', 'tradition', 'community'],
      'scientific': ['research', 'evidence', 'scientific', 'empirical']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => framework.toLowerCase().includes(keyword))) {
        return category as MeaningFramework['category'];
      }
    }

    return 'philosophical';
  }

  private assessCulturalInfluences(detections: any[]): CulturalMeaningInfluence[] {
    // Analyze cultural references in meaning-making
    return [];
  }

  private assessDevelopmentalStage(patterns: MeaningMakingPattern[], frameworks: MeaningFramework[]): DevelopmentalStage {
    // Assess developmental stage based on complexity and integration
    const complexityScore = patterns.length + frameworks.length;
    
    if (complexityScore > 8) {
      return {
        stage: 'universalizing',
        characteristics: ['Integrated multiple perspectives', 'Complex meaning-making'],
        challenges: ['Overwhelm from complexity'],
        opportunities: ['Teaching others', 'Wisdom sharing'],
        supportNeeds: ['Advanced practices', 'Community connection']
      };
    }
    
    return {
      stage: 'individuative',
      characteristics: ['Developing personal meaning system'],
      challenges: ['Balancing multiple perspectives'],
      opportunities: ['Framework integration', 'Practice development'],
      supportNeeds: ['Guidance', 'Structured support']
    };
  }

  private identifyMeaningTriggers(detections: any[]): MeaningTrigger[] {
    const triggerMap = new Map<string, MeaningTrigger>();

    detections.forEach(detection => {
      detection.triggers?.forEach((trigger: string) => {
        if (triggerMap.has(trigger)) {
          const existing = triggerMap.get(trigger)!;
          existing.frequency += 1;
        } else {
          triggerMap.set(trigger, {
            type: this.categorizeTrigger(trigger),
            description: trigger,
            frequency: 1,
            effectiveness: 0.7,
            patterns: [detection.patternType]
          });
        }
      });
    });

    return Array.from(triggerMap.values()).slice(0, 5);
  }

  private categorizeTrigger(trigger: string): MeaningTrigger['type'] {
    const categories = {
      'crisis': ['crisis', 'emergency', 'trauma', 'loss'],
      'transition': ['transition', 'change', 'move', 'new'],
      'achievement': ['achievement', 'success', 'accomplish', 'goal'],
      'relationship': ['relationship', 'love', 'family', 'friend'],
      'spiritual': ['spiritual', 'divine', 'sacred', 'transcendent'],
      'existential': ['existential', 'meaning', 'purpose', 'death']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => trigger.toLowerCase().includes(keyword))) {
        return category as MeaningTrigger['type'];
      }
    }

    return 'existential';
  }

  private identifyMeaningBlockers(detections: any[], existingProfile?: MeaningMakingProfile | null): MeaningBlocker[] {
    // Identify patterns that might indicate meaning-making difficulties
    return [];
  }

  private determineMeaningPreferences(patterns: MeaningMakingPattern[], frameworks: MeaningFramework[]): MeaningPreferences {
    const spiritualPatterns = patterns.filter(p => 
      ['spiritual-interpretation', 'transcendent-connection'].includes(p.patternType)
    ).length;

    const religiousFrameworks = frameworks.filter(f => f.category === 'religious').length;
    const secularFrameworks = frameworks.filter(f => f.category === 'scientific').length;

    let vocabulary: MeaningPreferences['vocabulary'];
    if (religiousFrameworks > spiritualPatterns && religiousFrameworks > secularFrameworks) {
      vocabulary = 'religious';
    } else if (spiritualPatterns > 0) {
      vocabulary = 'spiritual';
    } else if (secularFrameworks > 0) {
      vocabulary = 'secular';
    } else {
      vocabulary = 'mixed';
    }

    return {
      vocabulary,
      complexity: patterns.length > 5 ? 'complex' : 'moderate',
      communityOriented: patterns.some(p => p.patternType === 'collective-meaning'),
      actionOriented: patterns.some(p => p.patternType === 'service-purpose'),
      reflectiveOriented: patterns.some(p => p.patternType === 'narrative-coherence'),
      evidenceBased: frameworks.some(f => f.category === 'scientific'),
      intuitionBased: patterns.some(p => p.patternType === 'spiritual-interpretation')
    };
  }

  private setupProgressMetrics(patterns: MeaningMakingPattern[], existingProfile?: MeaningMakingProfile | null): MeaningProgressMetric[] {
    const metrics: MeaningProgressMetric[] = [
      {
        dimension: 'Meaning Clarity',
        baseline: 5,
        current: 5,
        target: 8,
        measurementMethod: 'Weekly meaning assessment (1-10 scale)',
        trend: 'stable',
        lastMeasured: new Date()
      },
      {
        dimension: 'Pattern Integration',
        baseline: patterns.length,
        current: patterns.length,
        target: Math.min(8, patterns.length + 2),
        measurementMethod: 'Bi-weekly pattern analysis',
        trend: 'stable',
        lastMeasured: new Date()
      }
    ];

    return metrics;
  }

  private calculateConfidenceScore(detectionCount: number, patterns: MeaningMakingPattern[]): number {
    const baseConfidence = Math.min(90, detectionCount * 2);
    const patternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length * 100;
    
    return Math.round((baseConfidence + patternConfidence) / 2);
  }

  private async getPathwayDetails(pathwayId: string): Promise<any> {
    // Fetch pathway details from registry
    return {};
  }

  private generateEnhancementsForPatterns(patterns: MeaningMakingPattern[], pathway: any): Enhancement[] {
    const enhancements: Enhancement[] = [];

    patterns.forEach(pattern => {
      switch (pattern.patternType) {
        case 'narrative-coherence':
          enhancements.push({
            type: 'reflection',
            modification: 'Add story-based reflection prompts',
            reasoning: 'User shows strong narrative meaning-making pattern',
            implementationGuide: [
              'Include "How does this connect to your life story?" prompts',
              'Add chapter/theme reflection exercises',
              'Encourage story-sharing opportunities'
            ]
          });
          break;
        
        case 'spiritual-interpretation':
          enhancements.push({
            type: 'content',
            modification: 'Include spiritual interpretation options',
            reasoning: 'User demonstrates spiritual meaning-making preference',
            implementationGuide: [
              'Provide spiritual language alternatives',
              'Include prayer/meditation options',
              'Add sacred text reflection opportunities'
            ]
          });
          break;
        
        case 'service-purpose':
          enhancements.push({
            type: 'practice',
            modification: 'Integrate service-oriented practices',
            reasoning: 'User finds meaning through service to others',
            implementationGuide: [
              'Add community service suggestions',
              'Include helping behavior tracking',
              'Provide volunteer opportunity connections'
            ]
          });
          break;
      }
    });

    return enhancements;
  }

  private generateCustomizations(profile: MeaningMakingProfile, pathway: any): Customization[] {
    const customizations: Customization[] = [];

    // Vocabulary customization
    customizations.push({
      aspect: 'Vocabulary',
      customization: `Adapt language to ${profile.preferences.vocabulary} preference`,
      personalRelevance: 'Uses vocabulary that resonates with user\'s meaning-making style'
    });

    // Complexity customization
    customizations.push({
      aspect: 'Complexity',
      customization: `Adjust content complexity to ${profile.preferences.complexity} level`,
      personalRelevance: 'Matches user\'s cognitive preference for complexity'
    });

    return customizations;
  }

  private adaptProgressTracking(profile: MeaningMakingProfile, pathway: any): ProgressAdaptation[] {
    const adaptations: ProgressAdaptation[] = [];

    profile.dominantPatterns.forEach(pattern => {
      adaptations.push({
        metric: `${pattern.patternType} development`,
        adaptedMeasurement: `Track ${pattern.patternType} pattern strength and integration`,
        frequency: 'Weekly',
        meaningfulFramework: pattern.frameworks[0] || 'general'
      });
    });

    return adaptations;
  }

  private generateEnhancementRationale(profile: MeaningMakingProfile, enhancements: Enhancement[]): string {
    return `Based on your meaning-making patterns (${profile.dominantPatterns.map(p => p.patternType).join(', ')}), ` +
           `these enhancements will help you create deeper meaning through your preferred approaches. ` +
           `Your ${profile.meaningMakingStyle.primary} style and ${profile.preferences.vocabulary} vocabulary ` +
           `preferences have been incorporated throughout.`;
  }

  private predictEnhancementOutcomes(profile: MeaningMakingProfile, enhancements: Enhancement[]): string[] {
    const outcomes: string[] = [
      'Increased meaning clarity and coherence',
      'Enhanced connection between experiences and values',
      'Deeper integration of personal wisdom',
      'Stronger sense of purpose and direction'
    ];

    // Add pattern-specific outcomes
    profile.dominantPatterns.forEach(pattern => {
      switch (pattern.patternType) {
        case 'narrative-coherence':
          outcomes.push('More coherent and empowering life story');
          break;
        case 'spiritual-interpretation':
          outcomes.push('Deeper spiritual connection and understanding');
          break;
        case 'service-purpose':
          outcomes.push('Increased sense of contribution and impact');
          break;
      }
    });

    return outcomes.slice(0, 6); // Limit to top 6 outcomes
  }

  private async getHistoricalMeaningData(userId: string): Promise<any[]> {
    // Fetch historical meaning-making data
    return [];
  }

  private calculateMeaningTrends(historicalData: any[]): any[] {
    // Calculate trends in meaning-making over time
    return [];
  }

  private generateMeaningInsights(profile: MeaningMakingProfile, trends: any[]): string[] {
    const insights: string[] = [];

    insights.push(
      `Your primary meaning-making style is ${profile.meaningMakingStyle.primary}, ` +
      `which shows ${profile.meaningMakingStyle.integrationLevel} integration.`
    );

    profile.dominantPatterns.forEach(pattern => {
      insights.push(
        `You frequently use ${pattern.patternType.replace('-', ' ')} to create meaning, ` +
        `with ${pattern.confidence.toFixed(0)}% confidence in this pattern.`
      );
    });

    return insights;
  }

  private generateMeaningRecommendations(profile: MeaningMakingProfile, trends: any[]): string[] {
    const recommendations: string[] = [];

    // General recommendations based on style
    if (profile.meaningMakingStyle.primary === 'spiritual') {
      recommendations.push('Explore additional spiritual practices and contemplative traditions');
    }

    if (profile.preferences.communityOriented) {
      recommendations.push('Engage with community meaning-making activities and group reflection');
    }

    // Pattern-specific recommendations
    profile.dominantPatterns.forEach(pattern => {
      recommendations.push(...(pattern.growthOpportunities || []));
    });

    return recommendations.slice(0, 5);
  }
}

export default MeaningMakingPatternRecognition;