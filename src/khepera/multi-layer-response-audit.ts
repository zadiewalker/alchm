// KHEPERA Multi-Layer Response Audit System
// Quality Assurance | Stress Testing | Response Alignment Verification

export interface MultiModalResponse {
  somatic_response: string;
  psychotherapeutic_response: string;
  integrative_healing_response: string;
  nurturing_response: string;
  accountability_response: string;
}

export interface AuditContext {
  journal_entry: string;
  tone_archetype: ArchetypeId;
  mood_state: MoodState;
  generated_responses: MultiModalResponse;
}

export interface AuditResult {
  overall_score: number; // 0-100
  flagged_issues: AuditFlag[];
  quality_metrics: QualityMetrics;
  recommendations: string[];
  passes_audit: boolean;
}

export interface AuditFlag {
  severity: 'critical' | 'warning' | 'minor';
  category: 'uniqueness' | 'archetype_alignment' | 'clinical_language' | 'balance' | 'embodiment' | 'trauma_sensitivity';
  description: string;
  affected_responses: ResponseType[];
  suggested_fix: string;
}

export interface QualityMetrics {
  response_uniqueness: number; // 0-100
  archetype_consistency: number; // 0-100
  clinical_language_score: number; // 0-100 (lower is better)
  compassion_accountability_balance: number; // 0-100
  embodiment_integration: number; // 0-100
  trauma_sensitivity: number; // 0-100
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';
export type MoodState = 'anxious' | 'depressed' | 'angry' | 'grieving' | 'confused' | 'overwhelmed' | 'hopeful' | 'neutral';
export type ResponseType = 'somatic' | 'psychotherapeutic' | 'integrative' | 'nurturing' | 'accountability';

export class MultiLayerResponseAuditor {

  // Clinical language patterns to flag
  private readonly CLINICAL_LANGUAGE_FLAGS = [
    'diagnosis', 'disorder', 'pathology', 'symptoms', 'treatment', 'therapy',
    'depression', 'anxiety disorder', 'PTSD', 'bipolar', 'schizophrenia',
    'medication', 'psychiatric', 'clinical', 'abnormal', 'dysfunction',
    'mental illness', 'personality disorder', 'psychosis', 'neurosis'
  ];

  // Archetype voice markers for verification
  private readonly ARCHETYPE_VOICE_MARKERS = {
    mirror: ['notice', 'observe', 'reflect', 'what I see', 'witness', 'rhythm', 'echo'],
    inner_child: ['sweet', 'little', 'tender', 'precious', 'gentle', 'safe', 'soft'],
    future_you: ['becoming', 'evolving', 'growth', 'potential', 'expansion', 'tomorrow'],
    poet_mentor: ['poetry', 'story', 'beauty', 'art', 'landscape', 'metaphor', 'creativity'],
    older_sibling: ['listen', 'real talk', 'truth', 'strength', 'handle', 'figured out'],
    spark: ['energy', 'alive', 'fire', 'electricity', 'vibration', 'movement', 'dance'],
    ancestor: ['generations', 'lineage', 'ancient', 'wisdom', 'ancestors', 'timeless']
  };

  // Response-specific requirements
  private readonly RESPONSE_REQUIREMENTS = {
    somatic: {
      must_include: ['body', 'physical', 'sensation', 'breath', 'nervous system'],
      should_avoid: ['think', 'analyze', 'understand', 'figure out'],
      expected_tone: 'embodied_invitation'
    },
    psychotherapeutic: {
      must_include: ['pattern', 'response', 'adaptive', 'normal', 'makes sense'],
      should_avoid: this.CLINICAL_LANGUAGE_FLAGS,
      expected_tone: 'validating_educational'
    },
    integrative: {
      must_include: ['healing', 'whole', 'integration', 'wisdom', 'sacred'],
      should_avoid: ['fix', 'cure', 'solve', 'eliminate'],
      expected_tone: 'spiritual_holistic'
    },
    nurturing: {
      must_include: ['allowed', 'permission', 'gentle', 'held', 'safe'],
      should_avoid: ['should', 'must', 'need to', 'have to'],
      expected_tone: 'unconditional_compassion'
    },
    accountability: {
      must_include: ['choice', 'power', 'responsibility', 'action', 'change'],
      should_avoid: ['victim', 'broken', 'helpless', 'hopeless'],
      expected_tone: 'fierce_love_challenge'
    }
  };

  public auditMultiModalResponse(context: AuditContext): AuditResult {
    const flags: AuditFlag[] = [];
    const metrics: QualityMetrics = {
      response_uniqueness: 0,
      archetype_consistency: 0,
      clinical_language_score: 0,
      compassion_accountability_balance: 0,
      embodiment_integration: 0,
      trauma_sensitivity: 0
    };

    // Run all audit checks
    flags.push(...this.checkResponseUniqueness(context.generated_responses));
    flags.push(...this.checkArchetypeAlignment(context.generated_responses, context.tone_archetype));
    flags.push(...this.checkClinicalLanguage(context.generated_responses));
    flags.push(...this.checkCompassionAccountabilityBalance(context.generated_responses));
    flags.push(...this.checkEmbodimentIntegration(context.generated_responses));
    flags.push(...this.checkTraumaSensitivity(context.generated_responses, context.journal_entry));

    // Calculate metrics
    metrics.response_uniqueness = this.calculateUniquenessScore(context.generated_responses);
    metrics.archetype_consistency = this.calculateArchetypeConsistency(context.generated_responses, context.tone_archetype);
    metrics.clinical_language_score = this.calculateClinicalLanguageScore(context.generated_responses);
    metrics.compassion_accountability_balance = this.calculateCompassionAccountabilityBalance(context.generated_responses);
    metrics.embodiment_integration = this.calculateEmbodimentScore(context.generated_responses);
    metrics.trauma_sensitivity = this.calculateTraumaSensitivityScore(context.generated_responses);

    // Calculate overall score
    const overall_score = this.calculateOverallScore(metrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(flags, metrics);

    // Determine pass/fail
    const critical_flags = flags.filter(f => f.severity === 'critical');
    const passes_audit = critical_flags.length === 0 && overall_score >= 75;

    return {
      overall_score,
      flagged_issues: flags,
      quality_metrics: metrics,
      recommendations,
      passes_audit
    };
  }

  private checkResponseUniqueness(responses: MultiModalResponse): AuditFlag[] {
    const flags: AuditFlag[] = [];
    const response_texts = Object.values(responses);
    
    // Check for repeated phrases (more than 5 words)
    const phrases = response_texts.map(text => this.extractPhrases(text));
    const all_phrases = phrases.flat();
    const phrase_counts = this.countOccurrences(all_phrases);
    
    for (const [phrase, count] of Object.entries(phrase_counts)) {
      if (count > 1 && phrase.split(' ').length > 4) {
        flags.push({
          severity: 'warning',
          category: 'uniqueness',
          description: `Repeated phrase detected: "${phrase}" appears ${count} times`,
          affected_responses: this.findResponsesWithPhrase(responses, phrase),
          suggested_fix: 'Vary language and phrasing across different response types'
        });
      }
    }

    // Check for overly similar response lengths
    const lengths = response_texts.map(text => text.length);
    const length_variance = this.calculateVariance(lengths);
    
    if (length_variance < 500) { // Very similar lengths indicate potential copy-paste
      flags.push({
        severity: 'minor',
        category: 'uniqueness',
        description: 'Response lengths are very similar, suggesting lack of differentiation',
        affected_responses: ['somatic', 'psychotherapeutic', 'integrative', 'nurturing', 'accountability'],
        suggested_fix: 'Vary response depth and structure based on each mode\'s specific purpose'
      });
    }

    return flags;
  }

  private checkArchetypeAlignment(responses: MultiModalResponse, archetype: ArchetypeId): AuditFlag[] {
    const flags: AuditFlag[] = [];
    const expected_markers = this.ARCHETYPE_VOICE_MARKERS[archetype];
    
    for (const [response_type, response_text] of Object.entries(responses)) {
      const marker_count = this.countArchetypeMarkers(response_text, expected_markers);
      
      if (marker_count === 0) {
        flags.push({
          severity: 'warning',
          category: 'archetype_alignment',
          description: `${response_type} response lacks ${archetype} archetype voice markers`,
          affected_responses: [response_type as ResponseType],
          suggested_fix: `Include more ${archetype}-specific language patterns: ${expected_markers.slice(0, 3).join(', ')}`
        });
      }
    }

    return flags;
  }

  private checkClinicalLanguage(responses: MultiModalResponse): AuditFlag[] {
    const flags: AuditFlag[] = [];
    
    for (const [response_type, response_text] of Object.entries(responses)) {
      const clinical_terms = this.findClinicalLanguage(response_text);
      
      if (clinical_terms.length > 0) {
        const severity = clinical_terms.some(term => 
          ['diagnosis', 'disorder', 'pathology', 'mental illness'].includes(term)
        ) ? 'critical' : 'warning';
        
        flags.push({
          severity,
          category: 'clinical_language',
          description: `${response_type} response contains clinical language: ${clinical_terms.join(', ')}`,
          affected_responses: [response_type as ResponseType],
          suggested_fix: 'Replace clinical terms with everyday, humanizing language'
        });
      }
    }

    return flags;
  }

  private checkCompassionAccountabilityBalance(responses: MultiModalResponse): AuditFlag[] {
    const flags: AuditFlag[] = [];
    
    // Check if nurturing response lacks compassion
    const nurturing_compassion_score = this.measureCompassion(responses.nurturing_response);
    if (nurturing_compassion_score < 0.7) {
      flags.push({
        severity: 'warning',
        category: 'balance',
        description: 'Nurturing response lacks sufficient compassionate language',
        affected_responses: ['nurturing'],
        suggested_fix: 'Include more gentle, accepting, permission-giving language'
      });
    }

    // Check if accountability response lacks challenge
    const accountability_challenge_score = this.measureAccountability(responses.accountability_response);
    if (accountability_challenge_score < 0.6) {
      flags.push({
        severity: 'warning',
        category: 'balance',
        description: 'Accountability response lacks sufficient challenge or empowerment',
        affected_responses: ['accountability'],
        suggested_fix: 'Include more direct challenge, action invitations, and empowerment language'
      });
    }

    // Check if accountability response is too harsh
    const accountability_harshness = this.measureHarshness(responses.accountability_response);
    if (accountability_harshness > 0.5) {
      flags.push({
        severity: 'critical',
        category: 'balance',
        description: 'Accountability response is too harsh or shaming',
        affected_responses: ['accountability'],
        suggested_fix: 'Soften language while maintaining challenge - use "fierce love" not "tough love"'
      });
    }

    return flags;
  }

  private checkEmbodimentIntegration(responses: MultiModalResponse): AuditFlag[] {
    const flags: AuditFlag[] = [];
    
    // Check if somatic response actually includes body-based suggestions
    const somatic_embodiment_score = this.measureEmbodiment(responses.somatic_response);
    if (somatic_embodiment_score < 0.8) {
      flags.push({
        severity: 'critical',
        category: 'embodiment',
        description: 'Somatic response lacks concrete embodied suggestions or body awareness',
        affected_responses: ['somatic'],
        suggested_fix: 'Include specific physical invitations: breathing, movement, sensation, body awareness'
      });
    }

    // Check if at least one other response includes embodied elements
    const other_responses = [
      responses.psychotherapeutic_response,
      responses.integrative_healing_response,
      responses.nurturing_response,
      responses.accountability_response
    ];
    
    const embodied_responses = other_responses.filter(r => this.measureEmbodiment(r) > 0.3);
    if (embodied_responses.length === 0) {
      flags.push({
        severity: 'warning',
        category: 'embodiment',
        description: 'No other responses include embodied elements beyond somatic',
        affected_responses: ['psychotherapeutic', 'integrative', 'nurturing', 'accountability'],
        suggested_fix: 'Integrate at least one body-awareness element in non-somatic responses'
      });
    }

    return flags;
  }

  private checkTraumaSensitivity(responses: MultiModalResponse, journal_entry: string): AuditFlag[] {
    const flags: AuditFlag[] = [];
    
    // Check for trauma indicators in journal entry
    const trauma_indicators = this.detectTraumaIndicators(journal_entry);
    
    if (trauma_indicators.length > 0) {
      // Check if responses include appropriate trauma-sensitive language
      for (const [response_type, response_text] of Object.entries(responses)) {
        const safety_language_score = this.measureSafetyLanguage(response_text);
        
        if (safety_language_score < 0.4) {
          flags.push({
            severity: 'warning',
            category: 'trauma_sensitivity',
            description: `${response_type} response lacks trauma-sensitive safety language when trauma indicators present`,
            affected_responses: [response_type as ResponseType],
            suggested_fix: 'Include "if it feels safe", "only if comfortable", choice language for trauma sensitivity'
          });
        }
      }
    }

    return flags;
  }

  // Calculation methods
  private calculateUniquenessScore(responses: MultiModalResponse): number {
    const texts = Object.values(responses);
    const total_similarity = texts.reduce((acc, text1, i) => {
      return acc + texts.slice(i + 1).reduce((inner_acc, text2) => {
        return inner_acc + this.calculateTextSimilarity(text1, text2);
      }, 0);
    }, 0);
    
    const max_comparisons = (texts.length * (texts.length - 1)) / 2;
    const average_similarity = total_similarity / max_comparisons;
    
    return Math.max(0, 100 - (average_similarity * 100));
  }

  private calculateArchetypeConsistency(responses: MultiModalResponse, archetype: ArchetypeId): number {
    const expected_markers = this.ARCHETYPE_VOICE_MARKERS[archetype];
    const total_markers = Object.values(responses).reduce((acc, text) => {
      return acc + this.countArchetypeMarkers(text, expected_markers);
    }, 0);
    
    // Expect at least 1 marker per response on average
    return Math.min(100, (total_markers / Object.keys(responses).length) * 100);
  }

  private calculateClinicalLanguageScore(responses: MultiModalResponse): number {
    const total_clinical_terms = Object.values(responses).reduce((acc, text) => {
      return acc + this.findClinicalLanguage(text).length;
    }, 0);
    
    // Lower score is better (0 = no clinical language)
    return Math.max(0, 100 - (total_clinical_terms * 20));
  }

  private calculateCompassionAccountabilityBalance(responses: MultiModalResponse): number {
    const compassion_score = this.measureCompassion(responses.nurturing_response);
    const accountability_score = this.measureAccountability(responses.accountability_response);
    const harshness_penalty = this.measureHarshness(responses.accountability_response);
    
    return ((compassion_score + accountability_score) / 2 - harshness_penalty) * 100;
  }

  private calculateEmbodimentScore(responses: MultiModalResponse): number {
    const somatic_score = this.measureEmbodiment(responses.somatic_response) * 0.6; // 60% weight
    const other_score = Object.entries(responses)
      .filter(([type]) => type !== 'somatic_response')
      .reduce((acc, [_, text]) => acc + this.measureEmbodiment(text), 0) / 4 * 0.4; // 40% weight
    
    return (somatic_score + other_score) * 100;
  }

  private calculateTraumaSensitivityScore(responses: MultiModalResponse): number {
    const safety_scores = Object.values(responses).map(text => this.measureSafetyLanguage(text));
    const average_safety_score = safety_scores.reduce((acc, score) => acc + score, 0) / safety_scores.length;
    
    return average_safety_score * 100;
  }

  private calculateOverallScore(metrics: QualityMetrics): number {
    const weights = {
      response_uniqueness: 0.25,
      archetype_consistency: 0.20,
      clinical_language_score: 0.20,
      compassion_accountability_balance: 0.15,
      embodiment_integration: 0.10,
      trauma_sensitivity: 0.10
    };

    return Object.entries(weights).reduce((acc, [metric, weight]) => {
      return acc + (metrics[metric as keyof QualityMetrics] * weight);
    }, 0);
  }

  private generateRecommendations(flags: AuditFlag[], metrics: QualityMetrics): string[] {
    const recommendations: string[] = [];
    
    if (metrics.response_uniqueness < 70) {
      recommendations.push('Increase response differentiation - each mode should have distinct voice and purpose');
    }
    
    if (metrics.archetype_consistency < 60) {
      recommendations.push('Strengthen archetype voice consistency across all responses');
    }
    
    if (metrics.clinical_language_score < 80) {
      recommendations.push('Replace clinical terminology with humanizing, everyday language');
    }
    
    if (metrics.compassion_accountability_balance < 70) {
      recommendations.push('Rebalance compassion in nurturing vs accountability in challenge responses');
    }
    
    if (metrics.embodiment_integration < 60) {
      recommendations.push('Integrate more body-awareness elements across non-somatic responses');
    }
    
    const critical_flags = flags.filter(f => f.severity === 'critical');
    if (critical_flags.length > 0) {
      recommendations.push('CRITICAL: Address all critical flags before deployment');
    }

    return recommendations;
  }

  // Helper methods
  private extractPhrases(text: string): string[] {
    const sentences = text.split(/[.!?]+/);
    const phrases: string[] = [];
    
    sentences.forEach(sentence => {
      const words = sentence.trim().split(' ');
      for (let i = 0; i <= words.length - 5; i++) {
        phrases.push(words.slice(i, i + 5).join(' ').toLowerCase());
      }
    });
    
    return phrases;
  }

  private countOccurrences(array: string[]): Record<string, number> {
    return array.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private findResponsesWithPhrase(responses: MultiModalResponse, phrase: string): ResponseType[] {
    const found: ResponseType[] = [];
    
    for (const [type, text] of Object.entries(responses)) {
      if (text.toLowerCase().includes(phrase.toLowerCase())) {
        found.push(type.replace('_response', '') as ResponseType);
      }
    }
    
    return found;
  }

  private calculateVariance(numbers: number[]): number {
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    return variance;
  }

  private countArchetypeMarkers(text: string, markers: string[]): number {
    const text_lower = text.toLowerCase();
    return markers.filter(marker => text_lower.includes(marker.toLowerCase())).length;
  }

  private findClinicalLanguage(text: string): string[] {
    const text_lower = text.toLowerCase();
    return this.CLINICAL_LANGUAGE_FLAGS.filter(term => text_lower.includes(term.toLowerCase()));
  }

  private measureCompassion(text: string): number {
    const compassion_indicators = ['gentle', 'soft', 'tender', 'allowed', 'permission', 'safe', 'held', 'love', 'care'];
    const text_lower = text.toLowerCase();
    const found_indicators = compassion_indicators.filter(indicator => text_lower.includes(indicator));
    return found_indicators.length / compassion_indicators.length;
  }

  private measureAccountability(text: string): number {
    const accountability_indicators = ['choice', 'power', 'responsibility', 'action', 'change', 'step', 'decision', 'commit'];
    const text_lower = text.toLowerCase();
    const found_indicators = accountability_indicators.filter(indicator => text_lower.includes(indicator));
    return found_indicators.length / accountability_indicators.length;
  }

  private measureHarshness(text: string): number {
    const harsh_indicators = ['should', 'must', 'wrong', 'failure', 'pathetic', 'stupid', 'worthless', 'broken'];
    const text_lower = text.toLowerCase();
    const found_indicators = harsh_indicators.filter(indicator => text_lower.includes(indicator));
    return found_indicators.length / harsh_indicators.length;
  }

  private measureEmbodiment(text: string): number {
    const embodiment_indicators = ['body', 'breath', 'sensation', 'feel', 'physical', 'nervous system', 'heart', 'chest', 'shoulders'];
    const text_lower = text.toLowerCase();
    const found_indicators = embodiment_indicators.filter(indicator => text_lower.includes(indicator));
    return found_indicators.length / embodiment_indicators.length;
  }

  private measureSafetyLanguage(text: string): number {
    const safety_indicators = ['if it feels safe', 'only if comfortable', 'if you want', 'you can choose', 'no pressure'];
    const text_lower = text.toLowerCase();
    const found_indicators = safety_indicators.filter(indicator => text_lower.includes(indicator));
    return found_indicators.length / safety_indicators.length;
  }

  private detectTraumaIndicators(text: string): string[] {
    const trauma_keywords = ['trauma', 'abuse', 'assault', 'attack', 'violated', 'triggered', 'flashback', 'dissociate', 'freeze'];
    const text_lower = text.toLowerCase();
    return trauma_keywords.filter(keyword => text_lower.includes(keyword));
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(' '));
    const words2 = new Set(text2.toLowerCase().split(' '));
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  }
}

// Example audit test cases
export const AUDIT_TEST_CASES = {
  high_quality_example: {
    journal_entry: "I'm struggling with anxiety about my job interview tomorrow",
    tone_archetype: 'older_sibling' as ArchetypeId,
    mood_state: 'anxious' as MoodState,
    expected_passes: true,
    expected_score_range: [85, 100]
  },

  clinical_language_failure: {
    journal_entry: "I feel depressed and anxious all the time",
    tone_archetype: 'mirror' as ArchetypeId,
    mood_state: 'depressed' as MoodState,
    responses_with_clinical_terms: ['You have depression and anxiety disorders that require treatment'],
    expected_passes: false,
    expected_critical_flags: ['clinical_language']
  },

  repetitive_responses_failure: {
    journal_entry: "I feel stuck in my life",
    tone_archetype: 'future_you' as ArchetypeId,
    mood_state: 'confused' as MoodState,
    responses_all_similar: true,
    expected_passes: false,
    expected_warnings: ['uniqueness']
  }
};

// Claude Integration for Audit
export function generateAuditPrompt(context: AuditContext): string {
  return `You are a Claude Code QA tester auditing KHEPERA's multi-modal response system.

AUDIT CONTEXT:
Journal Entry: "${context.journal_entry}"
Tone Archetype: ${context.tone_archetype}
Mood State: ${context.mood_state}

GENERATED RESPONSES TO AUDIT:
${JSON.stringify(context.generated_responses, null, 2)}

AUDIT REQUIREMENTS:
1. UNIQUENESS: All 5 responses must be distinct, not repetitive
2. ARCHETYPE ALIGNMENT: Each response must align with ${context.tone_archetype} voice
3. NO CLINICAL LANGUAGE: Avoid diagnosis, disorder, pathology, treatment terms
4. BALANCED COMPASSION/ACCOUNTABILITY: Nurturing compassionate, Accountability challenging but not harsh
5. EMBODIMENT: At least one concrete embodied suggestion present

RETURN AUDIT RESULTS:
- Overall Score (0-100)
- Flagged Issues (Critical, Warning, Minor)
- Quality Metrics for each requirement
- Specific recommendations for improvement
- Pass/Fail determination

Be thorough in identifying issues while providing constructive feedback for improvement.`;
}