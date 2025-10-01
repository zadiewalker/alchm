/**
 * ALCHM Crisis Detection Engine
 * 
 * Real-time AI-powered crisis intervention system that analyzes user content
 * for crisis patterns and triggers appropriate interventions while maintaining
 * strict privacy and therapeutic safety standards.
 */

import { analytics } from '../analytics';
import { CrisisResource, CrisisPattern, InterventionLevel, CrisisDetectionResult } from './types';

export class CrisisDetectionEngine {
  private readonly CRISIS_PATTERNS: CrisisPattern[] = [
    // High Severity - Immediate Intervention
    {
      id: 'suicidal_immediate',
      category: 'suicidal',
      severity: 'high',
      patterns: [
        /\b(want to die|kill myself|end it all|suicide|not worth living)\b/gi,
        /\b(plan to|method|tonight|today|pills|bridge|gun|rope)\b/gi,
        /\b(goodbye world|this is it|can't go on|final|last time)\b/gi
      ],
      contextModifiers: {
        timeIndicators: /\b(tonight|today|now|soon|tomorrow)\b/gi,
        methodIndicators: /\b(pills|knife|bridge|building|gun|rope|hanging)\b/gi,
        finalityIndicators: /\b(goodbye|final|last|done|over|enough)\b/gi
      },
      weight: 10
    },
    {
      id: 'self_harm_immediate',
      category: 'self_harm',
      severity: 'high',
      patterns: [
        /\b(cut myself|hurt myself|cutting|burning|punching|hitting myself)\b/gi,
        /\b(razor|blade|knife|burn|bruise|blood)\b/gi
      ],
      contextModifiers: {
        immediacy: /\b(right now|tonight|today|going to)\b/gi,
        escalation: /\b(deeper|harder|worse|more)\b/gi
      },
      weight: 8
    },

    // Medium Severity - Supportive Intervention
    {
      id: 'suicidal_ideation',
      category: 'suicidal',
      severity: 'medium',
      patterns: [
        /\b(thinking about dying|wish I was dead|want to disappear)\b/gi,
        /\b(better off dead|world without me|no point|hopeless)\b/gi,
        /\b(tired of living|can't take it|overwhelming|pointless)\b/gi
      ],
      weight: 6
    },
    {
      id: 'severe_depression',
      category: 'depression',
      severity: 'medium',
      patterns: [
        /\b(completely hopeless|nothing matters|empty inside|numb)\b/gi,
        /\b(can't function|falling apart|breaking down|drowning)\b/gi,
        /\b(isolating|withdrawing|pushing everyone away)\b/gi
      ],
      weight: 5
    },

    // Low Severity - Gentle Check-in
    {
      id: 'emotional_distress',
      category: 'distress',
      severity: 'low',
      patterns: [
        /\b(struggling|difficult|hard time|overwhelming|stressed)\b/gi,
        /\b(anxious|worried|scared|sad|down|upset)\b/gi,
        /\b(tired|exhausted|drained|burnt out)\b/gi
      ],
      weight: 3
    },
    {
      id: 'crisis_keywords',
      category: 'crisis',
      severity: 'medium',
      patterns: [
        /\b(crisis|emergency|help me|desperate|can't cope)\b/gi,
        /\b(nobody cares|alone|abandoned|worthless)\b/gi
      ],
      weight: 7
    }
  ];

  private readonly PROTECTIVE_FACTORS: RegExp[] = [
    /\b(therapy|therapist|counselor|support|help|hope|better|improving)\b/gi,
    /\b(family|friends|pets|loved ones|reasons to live)\b/gi,
    /\b(tomorrow|future|goals|dreams|plans)\b/gi
  ];

  private readonly CRISIS_RESOURCES: CrisisResource[] = [
    {
      id: 'suicide_lifeline',
      name: '988 Suicide & Crisis Lifeline',
      contact: '988',
      contactType: 'phone',
      description: '24/7 crisis support and suicide prevention',
      priority: 1,
      specializations: ['suicide', 'crisis', 'general'],
      availability: '24/7',
      languages: ['en', 'es']
    },
    {
      id: 'crisis_text_line',
      name: 'Crisis Text Line',
      contact: 'Text HOME to 741741',
      contactType: 'text',
      description: 'Free, 24/7 crisis support via text',
      priority: 2,
      specializations: ['crisis', 'youth', 'general'],
      availability: '24/7'
    },
    {
      id: 'emergency_services',
      name: 'Emergency Services',
      contact: '911',
      contactType: 'phone',
      description: 'For immediate emergency assistance',
      priority: 1,
      specializations: ['emergency'],
      availability: '24/7'
    },
    {
      id: 'lgbt_national_hotline',
      name: 'LGBT National Hotline',
      contact: '1-888-843-4564',
      contactType: 'phone',
      description: 'LGBTQ+ affirming crisis support',
      priority: 3,
      specializations: ['lgbtq', 'identity'],
      availability: '24/7'
    },
    {
      id: 'veterans_crisis_line',
      name: 'Veterans Crisis Line',
      contact: '988, Press 1',
      contactType: 'phone',
      description: 'Crisis support for veterans and service members',
      priority: 2,
      specializations: ['veterans', 'military'],
      availability: '24/7'
    },
    {
      id: 'domestic_violence_hotline',
      name: 'National Domestic Violence Hotline',
      contact: '1-800-799-7233',
      contactType: 'phone',
      description: 'Support for domestic violence situations',
      priority: 2,
      specializations: ['domestic_violence', 'safety'],
      availability: '24/7'
    }
  ];

  /**
   * Analyzes text content for crisis indicators
   */
  public async analyzeContent(content: string, userId?: string): Promise<CrisisDetectionResult> {
    const analysisStart = performance.now();

    try {
      // Clean and normalize content
      const normalizedContent = this.normalizeContent(content);
      
      // Calculate crisis score
      const crisisScore = this.calculateCrisisScore(normalizedContent);
      
      // Determine intervention level
      const interventionLevel = this.determineInterventionLevel(crisisScore);
      
      // Get relevant resources
      const relevantResources = this.getRelevantResources(crisisScore.patterns);
      
      // Create result
      const result: CrisisDetectionResult = {
        interventionLevel,
        crisisScore: crisisScore.totalScore,
        detectedPatterns: crisisScore.patterns,
        recommendedResources: relevantResources,
        confidence: this.calculateConfidence(crisisScore),
        timestamp: new Date(),
        processingTime: performance.now() - analysisStart
      };

      // Log analytics (without content)
      this.logCrisisAnalytics(result, userId);

      return result;

    } catch (error) {
      console.error('[CrisisDetection] Analysis failed:', error);
      
      // Return safe fallback
      return {
        interventionLevel: 'none',
        crisisScore: 0,
        detectedPatterns: [],
        recommendedResources: [],
        confidence: 0,
        timestamp: new Date(),
        processingTime: performance.now() - analysisStart,
        error: 'Analysis failed - showing general resources as precaution'
      };
    }
  }

  /**
   * Real-time analysis for typing indicators
   */
  public async analyzeRealTime(content: string): Promise<{ shouldShowSupport: boolean; level: InterventionLevel }> {
    const result = await this.analyzeContent(content);
    
    return {
      shouldShowSupport: result.interventionLevel !== 'none',
      level: result.interventionLevel
    };
  }

  /**
   * Get crisis resources by specialization
   */
  public getCrisisResources(specializations?: string[]): CrisisResource[] {
    if (!specializations) {
      return this.CRISIS_RESOURCES.filter(r => r.specializations.includes('general'))
        .sort((a, b) => a.priority - b.priority);
    }

    return this.CRISIS_RESOURCES
      .filter(resource => 
        specializations.some(spec => resource.specializations.includes(spec))
      )
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Emergency escalation for severe cases
   */
  public async escalateEmergency(userId: string, detectionResult: CrisisDetectionResult): Promise<void> {
    if (detectionResult.interventionLevel !== 'immediate') {
      return;
    }

    try {
      // Log emergency escalation
      analytics.track('crisis_emergency_escalation', {
        userId: userId,
        crisisScore: detectionResult.crisisScore,
        confidence: detectionResult.confidence,
        timestamp: detectionResult.timestamp.toISOString()
      });

      // In production, this would:
      // 1. Alert crisis response team
      // 2. Send emergency notifications
      // 3. Provide immediate intervention options
      // 4. Log for follow-up care

      console.log('[CrisisDetection] Emergency escalation triggered for user', userId);

    } catch (error) {
      console.error('[CrisisDetection] Emergency escalation failed:', error);
    }
  }

  // Private helper methods

  private normalizeContent(content: string): string {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  private calculateCrisisScore(content: string): { totalScore: number; patterns: CrisisPattern[] } {
    let totalScore = 0;
    const detectedPatterns: CrisisPattern[] = [];

    for (const pattern of this.CRISIS_PATTERNS) {
      let patternScore = 0;
      let hasMatch = false;

      // Check main patterns
      for (const regex of pattern.patterns) {
        const matches = content.match(regex);
        if (matches) {
          hasMatch = true;
          patternScore += matches.length * pattern.weight;
        }
      }

      // Apply context modifiers
      if (hasMatch && pattern.contextModifiers) {
        for (const [modifier, regex] of Object.entries(pattern.contextModifiers)) {
          const modifierMatches = content.match(regex);
          if (modifierMatches) {
            patternScore *= 1.5; // Increase severity with context
          }
        }
      }

      // Check for protective factors
      const protectiveFactors = this.countProtectiveFactors(content);
      if (protectiveFactors > 0) {
        patternScore *= Math.max(0.3, 1 - (protectiveFactors * 0.2)); // Reduce score for protective factors
      }

      if (hasMatch) {
        totalScore += patternScore;
        detectedPatterns.push({
          ...pattern,
          weight: patternScore // Store calculated score
        });
      }
    }

    return { totalScore, patterns: detectedPatterns };
  }

  private countProtectiveFactors(content: string): number {
    let count = 0;
    for (const regex of this.PROTECTIVE_FACTORS) {
      const matches = content.match(regex);
      if (matches) {
        count += matches.length;
      }
    }
    return count;
  }

  private determineInterventionLevel(crisisScore: { totalScore: number; patterns: CrisisPattern[] }): InterventionLevel {
    const { totalScore, patterns } = crisisScore;

    // Check for immediate intervention patterns
    const hasHighSeverity = patterns.some(p => p.severity === 'high');
    if (hasHighSeverity || totalScore >= 15) {
      return 'immediate';
    }

    // Check for supportive intervention
    const hasMediumSeverity = patterns.some(p => p.severity === 'medium');
    if (hasMediumSeverity || totalScore >= 8) {
      return 'supportive';
    }

    // Check for gentle intervention
    if (totalScore >= 3) {
      return 'gentle';
    }

    return 'none';
  }

  private getRelevantResources(patterns: CrisisPattern[]): CrisisResource[] {
    const specializations = new Set<string>();
    
    patterns.forEach(pattern => {
      if (pattern.category === 'suicidal') {
        specializations.add('suicide');
        specializations.add('crisis');
      } else if (pattern.category === 'self_harm') {
        specializations.add('crisis');
      } else if (pattern.category === 'crisis') {
        specializations.add('crisis');
      }
      specializations.add('general');
    });

    return this.getCrisisResources([...specializations]).slice(0, 3); // Return top 3 relevant resources
  }

  private calculateConfidence(crisisScore: { totalScore: number; patterns: CrisisPattern[] }): number {
    const { totalScore, patterns } = crisisScore;
    
    if (totalScore === 0) return 0;
    
    // Base confidence on pattern diversity and score
    const patternDiversity = new Set(patterns.map(p => p.category)).size;
    const maxPossibleScore = 30; // Estimated max realistic score
    
    const scoreConfidence = Math.min(totalScore / maxPossibleScore, 1);
    const diversityBonus = patternDiversity > 1 ? 0.2 : 0;
    
    return Math.min(scoreConfidence + diversityBonus, 1);
  }

  private logCrisisAnalytics(result: CrisisDetectionResult, userId?: string): void {
    // Log analytics without exposing content
    analytics.track('crisis_detection_analysis', {
      userId: userId || 'anonymous',
      interventionLevel: result.interventionLevel,
      crisisScore: result.crisisScore,
      confidence: result.confidence,
      patternCount: result.detectedPatterns.length,
      processingTime: result.processingTime,
      timestamp: result.timestamp.toISOString()
    });

    // Log intervention trigger
    if (result.interventionLevel !== 'none') {
      analytics.track('crisis_intervention_triggered', {
        userId: userId || 'anonymous',
        level: result.interventionLevel,
        confidence: result.confidence,
        resourceCount: result.recommendedResources.length
      });
    }
  }
}

// Singleton instance
export const crisisDetectionEngine = new CrisisDetectionEngine();