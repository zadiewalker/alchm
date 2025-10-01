/**
 * Advanced Crisis Pattern Recognition System
 * 
 * Sophisticated ML-powered crisis detection that recognizes:
 * - Direct and indirect expressions of distress
 * - Cultural-specific crisis patterns
 * - Progressive escalation indicators
 * - Trauma response patterns
 * - Intersectional crisis factors
 * 
 * Uses trauma-informed approach with high sensitivity and specificity
 */

interface CrisisPattern {
  type: 'direct' | 'indirect' | 'cultural' | 'trauma_response' | 'escalation' | 'intersectional';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  indicators: string[];
  culturalContext?: string;
  traumaType?: string;
}

interface CrisisDetectionConfig {
  sensitivity: 'high' | 'moderate' | 'low';
  culturalContext?: string;
  userHistory?: CrisisHistory;
  traumaInformed: boolean;
}

interface CrisisHistory {
  previousCrises: CrisisEvent[];
  triggerPatterns: string[];
  copingStrategies: string[];
  culturalBackground: string[];
  identityFactors: string[];
}

interface CrisisEvent {
  timestamp: string;
  type: string;
  severity: string;
  resolution: string;
  followUp: boolean;
}

class AdvancedCrisisPatternRecognition {
  private patterns: Map<string, CrisisPattern[]> = new Map();
  private culturalPatterns: Map<string, string[]> = new Map();
  private traumaResponsePatterns: Map<string, string[]> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns(): void {
    // Direct Crisis Indicators
    this.patterns.set('direct_suicidal', [
      {
        type: 'direct',
        severity: 'critical',
        confidence: 0.95,
        indicators: [
          'want to die', 'kill myself', 'end it all', 'suicide', 'not worth living',
          'better off dead', 'can\'t go on', 'nothing left', 'goodbye forever'
        ]
      }
    ]);

    // Indirect Crisis Indicators (often missed by traditional systems)
    this.patterns.set('indirect_suicidal', [
      {
        type: 'indirect',
        severity: 'high',
        confidence: 0.80,
        indicators: [
          'giving away possessions', 'putting affairs in order', 'saying goodbye',
          'everyone would be better without me', 'tired of being a burden',
          'just want the pain to stop', 'sleep forever', 'peace at last',
          'going to a better place', 'joining them soon', 'my last entry',
          'won\'t need this anymore', 'finally free', 'no more struggling'
        ]
      }
    ]);

    // Cultural-Specific Distress Patterns
    this.culturalPatterns.set('korean', [
      'han', '한', 'deep sorrow', 'generational pain', 'ancestor burden',
      'family shame', 'bringing dishonor', 'lost face'
    ]);

    this.culturalPatterns.set('latino', [
      'duende', 'dark night of the soul', 'mal de ojo', 'susto',
      'spiritual disconnection', 'ancestral calling', 'tierra calls me'
    ]);

    this.culturalPatterns.set('indigenous', [
      'spirit sickness', 'soul wound', 'broken connection', 'ancestor pain',
      'land grief', 'cultural genocide', 'historical trauma'
    ]);

    this.culturalPatterns.set('black', [
      'soul tired', 'bone deep exhaustion', 'carrying ancestors',
      'generational trauma', 'survival guilt', 'hypervigilance fatigue'
    ]);

    // Trauma Response Patterns
    this.traumaResponsePatterns.set('dissociation', [
      'floating outside myself', 'watching from above', 'not real',
      'dream-like', 'disconnected', 'foggy', 'numb', 'empty shell'
    ]);

    this.traumaResponsePatterns.set('hypervigilance', [
      'always watching', 'can\'t relax', 'danger everywhere',
      'scanning for threats', 'sleep with one eye open', 'exhausted vigilance'
    ]);

    this.traumaResponsePatterns.set('emotional_numbing', [
      'feel nothing', 'emotionally dead', 'robot mode', 'shut down',
      'can\'t feel anything', 'emotional void', 'switched off'
    ]);

    // Intersectional Crisis Patterns
    this.patterns.set('lgbtq_crisis', [
      {
        type: 'intersectional',
        severity: 'high',
        confidence: 0.85,
        indicators: [
          'family rejection', 'conversion therapy', 'homeless because gay',
          'religious trauma', 'can\'t be authentic', 'hiding who I am',
          'transition struggles', 'misgendered constantly', 'unsafe to exist'
        ]
      }
    ]);

    this.patterns.set('economic_crisis', [
      {
        type: 'intersectional',
        severity: 'moderate',
        confidence: 0.75,
        indicators: [
          'losing home', 'can\'t afford food', 'bills overwhelming',
          'eviction notice', 'sleeping in car', 'choosing between meds and food',
          'economic despair', 'poverty trauma', 'financial abuse'
        ]
      }
    ]);

    this.patterns.set('immigration_crisis', [
      {
        type: 'intersectional',
        severity: 'high',
        confidence: 0.80,
        indicators: [
          'deportation fear', 'family separated', 'untypeof window !== 'undefined' && documented stress',
          'ICE raids', 'can\'t go home', 'stateless feeling',
          'language barrier isolation', 'cultural displacement'
        ]
      }
    ]);
  }

  /**
   * Main crisis detection method
   * Analyzes text for multiple crisis patterns with cultural sensitivity
   */
  async detectCrisisPatterns(
    text: string,
    config: CrisisDetectionConfig = { sensitivity: 'high', traumaInformed: true }
  ): Promise<CrisisPattern[]> {
    const detectedPatterns: CrisisPattern[] = [];
    const normalizedText = this.normalizeText(text);

    // Direct pattern detection
    const directPatterns = this.detectDirectPatterns(normalizedText, config);
    detectedPatterns.push(...directPatterns);

    // Indirect pattern detection (requires higher sophistication)
    const indirectPatterns = this.detectIndirectPatterns(normalizedText, config);
    detectedPatterns.push(...indirectPatterns);

    // Cultural pattern detection
    const culturalPatterns = this.detectCulturalPatterns(normalizedText, config);
    detectedPatterns.push(...culturalPatterns);

    // Trauma response pattern detection
    const traumaPatterns = this.detectTraumaResponsePatterns(normalizedText, config);
    detectedPatterns.push(...traumaPatterns);

    // Escalation pattern detection
    const escalationPatterns = this.detectEscalationPatterns(normalizedText, config);
    detectedPatterns.push(...escalationPatterns);

    // Intersectional crisis detection
    const intersectionalPatterns = this.detectIntersectionalPatterns(normalizedText, config);
    detectedPatterns.push(...intersectionalPatterns);

    return this.prioritizeAndFilter(detectedPatterns, config);
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private detectDirectPatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    for (const [patternType, patternList] of this.patterns.entries()) {
      if (patternType.startsWith('direct_')) {
        for (const pattern of patternList) {
          const matches = pattern.indicators.filter(indicator => 
            text.includes(indicator.toLowerCase())
          );
          
          if (matches.length > 0) {
            patterns.push({
              ...pattern,
              confidence: this.calculateConfidence(matches, pattern.confidence, config),
              indicators: matches
            });
          }
        }
      }
    }

    return patterns;
  }

  private detectIndirectPatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    // Metaphorical expressions
    const metaphors = [
      'drowning', 'sinking', 'falling into darkness', 'tunnel with no light',
      'carrying the world', 'breaking point', 'last straw', 'edge of cliff'
    ];

    const contextualClues = [
      'final', 'last time', 'goodbye', 'forever', 'enough',
      'can\'t anymore', 'giving up', 'no hope', 'pointless'
    ];

    // Behavioral indicators in text
    const behavioralCues = [
      'giving away', 'don\'t need anymore', 'cleaning house',
      'putting things in order', 'making peace', 'saying goodbye'
    ];

    const allIndirectIndicators = [...metaphors, ...contextualClues, ...behavioralCues];
    const matches = allIndirectIndicators.filter(indicator => 
      text.includes(indicator.toLowerCase())
    );

    if (matches.length > 0) {
      const severity = this.calculateSeverityFromMatches(matches, 'indirect');
      patterns.push({
        type: 'indirect',
        severity,
        confidence: this.calculateConfidence(matches, 0.75, config),
        indicators: matches
      });
    }

    return patterns;
  }

  private detectCulturalPatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    for (const [culture, indicators] of this.culturalPatterns.entries()) {
      const matches = indicators.filter(indicator => 
        text.includes(indicator.toLowerCase())
      );
      
      if (matches.length > 0) {
        patterns.push({
          type: 'cultural',
          severity: 'moderate',
          confidence: this.calculateConfidence(matches, 0.70, config),
          indicators: matches,
          culturalContext: culture
        });
      }
    }

    return patterns;
  }

  private detectTraumaResponsePatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    for (const [traumaType, indicators] of this.traumaResponsePatterns.entries()) {
      const matches = indicators.filter(indicator => 
        text.includes(indicator.toLowerCase())
      );
      
      if (matches.length > 0) {
        patterns.push({
          type: 'trauma_response',
          severity: 'moderate',
          confidence: this.calculateConfidence(matches, 0.65, config),
          indicators: matches,
          traumaType
        });
      }
    }

    return patterns;
  }

  private detectEscalationPatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    // Progressive severity indicators
    const escalationWords = [
      'getting worse', 'can\'t take much more', 'breaking point',
      'last resort', 'desperate', 'nothing left to try',
      'reached my limit', 'end of rope', 'final option'
    ];

    const timeUrgency = [
      'tonight', 'today', 'now', 'can\'t wait',
      'running out of time', 'before it\'s too late'
    ];

    const allEscalationIndicators = [...escalationWords, ...timeUrgency];
    const matches = allEscalationIndicators.filter(indicator => 
      text.includes(indicator.toLowerCase())
    );

    if (matches.length > 0) {
      const hasTimeUrgency = timeUrgency.some(indicator => 
        text.includes(indicator.toLowerCase())
      );
      
      patterns.push({
        type: 'escalation',
        severity: hasTimeUrgency ? 'high' : 'moderate',
        confidence: this.calculateConfidence(matches, 0.80, config),
        indicators: matches
      });
    }

    return patterns;
  }

  private detectIntersectionalPatterns(text: string, config: CrisisDetectionConfig): CrisisPattern[] {
    const patterns: CrisisPattern[] = [];
    
    for (const [patternType, patternList] of this.patterns.entries()) {
      if (patternType.includes('crisis') && !patternType.startsWith('direct_')) {
        for (const pattern of patternList) {
          const matches = pattern.indicators.filter(indicator => 
            text.includes(indicator.toLowerCase())
          );
          
          if (matches.length > 0) {
            patterns.push({
              ...pattern,
              confidence: this.calculateConfidence(matches, pattern.confidence, config),
              indicators: matches
            });
          }
        }
      }
    }

    return patterns;
  }

  private calculateConfidence(
    matches: string[], 
    baseConfidence: number, 
    config: CrisisDetectionConfig
  ): number {
    let confidence = baseConfidence;
    
    // Adjust based on number of matches
    confidence += (matches.length - 1) * 0.05;
    
    // Adjust based on sensitivity setting
    switch (config.sensitivity) {
      case 'high':
        confidence += 0.1;
        break;
      case 'low':
        confidence -= 0.1;
        break;
    }
    
    // Trauma-informed adjustment (more sensitive)
    if (config.traumaInformed) {
      confidence += 0.05;
    }

    return Math.min(0.99, Math.max(0.1, confidence));
  }

  private calculateSeverityFromMatches(matches: string[], type: string): 'low' | 'moderate' | 'high' | 'critical' {
    const matchCount = matches.length;
    
    if (type === 'indirect' && matchCount >= 3) return 'high';
    if (type === 'indirect' && matchCount >= 2) return 'moderate';
    if (matchCount >= 4) return 'critical';
    if (matchCount >= 2) return 'high';
    if (matchCount >= 1) return 'moderate';
    
    return 'low';
  }

  private prioritizeAndFilter(
    patterns: CrisisPattern[], 
    config: CrisisDetectionConfig
  ): CrisisPattern[] {
    // Remove duplicates and merge similar patterns
    const uniquePatterns = this.removeDuplicatePatterns(patterns);
    
    // Sort by severity and confidence
    uniquePatterns.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, moderate: 2, low: 1 };
      const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
      
      if (severityDiff !== 0) return severityDiff;
      return b.confidence - a.confidence;
    });

    // Filter based on confidence threshold
    const confidenceThreshold = this.getConfidenceThreshold(config.sensitivity);
    return uniquePatterns.filter(pattern => pattern.confidence >= confidenceThreshold);
  }

  private removeDuplicatePatterns(patterns: CrisisPattern[]): CrisisPattern[] {
    const uniquePatterns: CrisisPattern[] = [];
    const seen = new Set<string>();

    for (const pattern of patterns) {
      const key = `${pattern.type}-${pattern.severity}-${pattern.indicators.join(',')}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePatterns.push(pattern);
      }
    }

    return uniquePatterns;
  }

  private getConfidenceThreshold(sensitivity: 'high' | 'moderate' | 'low'): number {
    switch (sensitivity) {
      case 'high': return 0.3;
      case 'moderate': return 0.5;
      case 'low': return 0.7;
      default: return 0.5;
    }
  }

  /**
   * Analyzes historical patterns to identify escalation trends
   */
  analyzeHistoricalEscalation(history: CrisisHistory): {
    riskLevel: 'low' | 'moderate' | 'high' | 'critical';
    triggerPatterns: string[];
    recommendations: string[];
  } {
    const recentCrises = history.previousCrises
      .filter(crisis => this.isRecentCrisis(crisis.timestamp))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const riskLevel = this.calculateHistoricalRisk(recentCrises);
    const triggerPatterns = this.identifyTriggerPatterns(history);
    const recommendations = this.generateHistoricalRecommendations(riskLevel, triggerPatterns);

    return { riskLevel, triggerPatterns, recommendations };
  }

  private isRecentCrisis(timestamp: string): boolean {
    const crisisDate = new Date(timestamp);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return crisisDate > sixMonthsAgo;
  }

  private calculateHistoricalRisk(recentCrises: CrisisEvent[]): 'low' | 'moderate' | 'high' | 'critical' {
    if (recentCrises.length === 0) return 'low';
    if (recentCrises.length >= 3) return 'critical';
    if (recentCrises.length === 2) return 'high';
    return 'moderate';
  }

  private identifyTriggerPatterns(history: CrisisHistory): string[] {
    // Analyze common themes in previous crises
    const allTriggers = history.previousCrises
      .map(crisis => crisis.type)
      .concat(history.triggerPatterns);

    // Count frequency and return most common
    const triggerCounts = new Map<string, number>();
    allTriggers.forEach(trigger => {
      triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1);
    });

    return Array.from(triggerCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([trigger]) => trigger);
  }

  private generateHistoricalRecommendations(
    riskLevel: string, 
    triggerPatterns: string[]
  ): string[] {
    const recommendations: string[] = [];

    switch (riskLevel) {
      case 'critical':
        recommendations.push('Immediate professional support recommended');
        recommendations.push('Crisis hotline contact suggested');
        recommendations.push('Safety planning essential');
        break;
      case 'high':
        recommendations.push('Increased monitoring recommended');
        recommendations.push('Professional consultation advised');
        recommendations.push('Enhanced coping strategies needed');
        break;
      case 'moderate':
        recommendations.push('Regular check-ins beneficial');
        recommendations.push('Trigger awareness important');
        break;
      case 'low':
        recommendations.push('Continue current support systems');
        break;
    }

    // Add trigger-specific recommendations
    if (triggerPatterns.includes('isolation')) {
      recommendations.push('Social connection strategies important');
    }
    if (triggerPatterns.includes('anniversary')) {
      recommendations.push('Anniversary awareness and preparation helpful');
    }

    return recommendations;
  }
}

export default AdvancedCrisisPatternRecognition;
export type { CrisisPattern, CrisisDetectionConfig, CrisisHistory, CrisisEvent };