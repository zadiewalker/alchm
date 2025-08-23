// ALCHM Strength-Based Language Engine
// Eliminates deficit-based "fixing" language in favor of empowerment and growth

// ===== STRENGTH-BASED LANGUAGE TYPES =====

export interface LanguageTransformation {
  deficitTerm: string;
  strengthBasedAlternative: string;
  context: 'general' | 'therapeutic' | 'technical' | 'crisis';
  culturalSensitivity: 'universal' | 'western' | 'indigenous' | 'mixed';
}

export interface LanguageAuditResult {
  passed: boolean;
  score: number; // 0-100
  findings: DeficitLanguageFlag[];
  strengthBasedAlternatives: string[];
  recommendations: string[];
}

export interface DeficitLanguageFlag {
  pattern: string;
  matches: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  context: string;
}

export interface StrengthBasedResponse {
  originalText: string;
  transformedText: string;
  transformations: LanguageTransformation[];
  empowermentScore: number;
  culturalAlignment: string[];
}

// ===== CORE LANGUAGE TRANSFORMATIONS =====

export const coreLanguageTransformations: LanguageTransformation[] = [
  // Fundamental deficit terms
  {
    deficitTerm: 'broken',
    strengthBasedAlternative: 'navigating complexity',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'wrong',
    strengthBasedAlternative: 'exploring alternatives',
    context: 'general', 
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'problem',
    strengthBasedAlternative: 'growth opportunity',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'issue',
    strengthBasedAlternative: 'invitation for wisdom',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  
  // Therapeutic/clinical language
  {
    deficitTerm: 'disorder',
    strengthBasedAlternative: 'unique response pattern',
    context: 'therapeutic',
    culturalSensitivity: 'western'
  },
  {
    deficitTerm: 'dysfunction',
    strengthBasedAlternative: 'adaptive navigation',
    context: 'therapeutic',
    culturalSensitivity: 'western'
  },
  {
    deficitTerm: 'pathology',
    strengthBasedAlternative: 'life response pattern',
    context: 'therapeutic',
    culturalSensitivity: 'western'
  },
  {
    deficitTerm: 'abnormal',
    strengthBasedAlternative: 'distinctly human',
    context: 'therapeutic',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'symptoms',
    strengthBasedAlternative: 'human responses',
    context: 'therapeutic',
    culturalSensitivity: 'western'
  },
  
  // Support/help language
  {
    deficitTerm: 'need help',
    strengthBasedAlternative: 'deserve support',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'requires treatment',
    strengthBasedAlternative: 'invites healing support',
    context: 'therapeutic',
    culturalSensitivity: 'western'
  },
  {
    deficitTerm: 'fix',
    strengthBasedAlternative: 'transform',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'repair',
    strengthBasedAlternative: 'restore',
    context: 'general',
    culturalSensitivity: 'universal'
  },
  
  // Technical/system language
  {
    deficitTerm: 'performance issue',
    strengthBasedAlternative: 'performance optimization',
    context: 'technical',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'security issue',
    strengthBasedAlternative: 'security enhancement',
    context: 'technical',
    culturalSensitivity: 'universal'
  },
  {
    deficitTerm: 'connection problem',
    strengthBasedAlternative: 'connection exploration',
    context: 'technical',
    culturalSensitivity: 'universal'
  }
];

// ===== CONTEXTUAL TRANSFORMATIONS =====

export const contextualTransformations = {
  crisis: {
    'broken': 'whole person navigating profound complexity',
    'can\'t be fixed': 'has inherent wholeness that can be rediscovered',
    'beyond repair': 'capable of healing and transformation',
    'hopeless': 'in a place where new possibilities can emerge'
  },
  
  therapeutic: {
    'mental illness': 'human responses to life circumstances',
    'psychiatric condition': 'unique adaptation patterns',
    'chemical imbalance': 'neurodiversity in action',
    'treatment needed': 'support and care available'
  },
  
  technical: {
    'system failure': 'system recalibration opportunity',
    'error occurred': 'unexpected pathway discovered',
    'bug detected': 'improvement opportunity identified',
    'crashed': 'system resting and preparing to restart'
  },
  
  general: {
    'something went wrong': 'let\'s explore what happened',
    'this is bad': 'this is challenging and deserves attention',
    'you\'re struggling': 'you\'re navigating complexity with courage',
    'that\'s a mistake': 'that\'s a learning opportunity'
  }
};

// ===== STRENGTH-BASED LANGUAGE ENGINE =====

export class StrengthBasedLanguageEngine {
  private transformationMap: Map<string, LanguageTransformation>;
  private contextualMap: Map<string, Map<string, string>>;
  
  constructor() {
    this.transformationMap = new Map();
    this.contextualMap = new Map();
    this.initializeTransformations();
  }
  
  private initializeTransformations(): void {
    // Load core transformations
    coreLanguageTransformations.forEach(transform => {
      this.transformationMap.set(transform.deficitTerm.toLowerCase(), transform);
    });
    
    // Load contextual transformations
    Object.entries(contextualTransformations).forEach(([context, transforms]) => {
      const contextMap = new Map(Object.entries(transforms));
      this.contextualMap.set(context, contextMap);
    });
  }
  
  // ===== MAIN TRANSFORMATION METHODS =====
  
  transformToStrengthBased(
    text: string, 
    context: 'general' | 'therapeutic' | 'technical' | 'crisis' = 'general'
  ): StrengthBasedResponse {
    let transformedText = text;
    const appliedTransformations: LanguageTransformation[] = [];
    
    // Apply contextual transformations first (more specific)
    const contextMap = this.contextualMap.get(context);
    if (contextMap) {
      contextMap.forEach((replacement, term) => {
        const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
        if (regex.test(transformedText)) {
          transformedText = transformedText.replace(regex, replacement);
          appliedTransformations.push({
            deficitTerm: term,
            strengthBasedAlternative: replacement,
            context,
            culturalSensitivity: 'universal'
          });
        }
      });
    }
    
    // Apply core transformations
    this.transformationMap.forEach((transformation, term) => {
      const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
      if (regex.test(transformedText)) {
        transformedText = transformedText.replace(regex, transformation.strengthBasedAlternative);
        appliedTransformations.push(transformation);
      }
    });
    
    return {
      originalText: text,
      transformedText,
      transformations: appliedTransformations,
      empowermentScore: this.calculateEmpowermentScore(text, transformedText),
      culturalAlignment: this.assessCulturalAlignment(appliedTransformations)
    };
  }
  
  // ===== LANGUAGE AUDIT METHODS =====
  
  auditForDeficitLanguage(text: string): LanguageAuditResult {
    const findings: DeficitLanguageFlag[] = [];
    
    // Define deficit patterns by severity
    const deficitPatterns = [
      {
        pattern: /\b(broken|wrong|problem|issue|fix|disorder)\b/gi,
        severity: 'high' as const,
        category: 'Core Deficit Language'
      },
      {
        pattern: /\b(abnormal|dysfunction|pathology|symptoms)\b/gi,
        severity: 'critical' as const,
        category: 'Pathologizing Language'
      },
      {
        pattern: /\b(requires?\s+treatment|needs?\s+help)\b/gi,
        severity: 'medium' as const,
        category: 'Dependency Language'
      },
      {
        pattern: /\b(mental\s+illness|psychiatric\s+condition)\b/gi,
        severity: 'critical' as const,
        category: 'Clinical Pathology'
      }
    ];
    
    deficitPatterns.forEach(({ pattern, severity, category }) => {
      const matches = text.match(pattern);
      if (matches) {
        findings.push({
          pattern: pattern.source,
          matches: matches,
          severity,
          recommendation: this.getTransformationRecommendation(matches[0]),
          context: category
        });
      }
    });
    
    const score = this.calculateAuditScore(text, findings);
    
    return {
      passed: findings.length === 0 && score >= 90,
      score,
      findings,
      strengthBasedAlternatives: this.generateAlternatives(findings),
      recommendations: this.generateRecommendations(findings)
    };
  }
  
  // ===== EMPOWERMENT-FOCUSED GENERATION =====
  
  generateEmpowermentResponse(
    userInput: string,
    responseType: 'validation' | 'reframe' | 'exploration' | 'growth'
  ): string {
    const empowermentTemplates = {
      validation: [
        "Your experience makes complete sense given what you've been navigating.",
        "What you're feeling is a natural human response to complex circumstances.",
        "Your awareness and courage in sharing this shows tremendous strength."
      ],
      
      reframe: [
        "What if this challenge is actually your system's way of seeking growth?",
        "This difficulty might be pointing toward something that wants to transform.",
        "Your struggle could be the doorway to discovering new strengths."
      ],
      
      exploration: [
        "What wisdom might this experience be offering you?",
        "How has navigating this complexity revealed your resilience?",
        "What aspects of this situation invite deeper exploration?"
      ],
      
      growth: [
        "How might this experience be expanding your capacity for life?",
        "What growth edge is this situation revealing?",
        "How is this challenge contributing to your evolution as a human being?"
      ]
    };
    
    const templates = empowermentTemplates[responseType];
    const baseResponse = templates[Math.floor(Math.random() * templates.length)];
    
    // Transform any remaining deficit language
    const strengthBasedResponse = this.transformToStrengthBased(baseResponse, 'therapeutic');
    
    return strengthBasedResponse.transformedText;
  }
  
  // ===== CULTURAL ADAPTATION =====
  
  adaptToCulturalContext(
    text: string,
    culturalContext: 'western' | 'indigenous' | 'collectivist' | 'individualist'
  ): string {
    const culturalAdaptations = {
      western: {
        'support': 'professional support',
        'healing': 'therapeutic healing',
        'wisdom': 'insight and understanding'
      },
      
      indigenous: {
        'support': 'community care and ancestral wisdom',
        'healing': 'restoring balance and connection',
        'wisdom': 'teachings from the ancestors'
      },
      
      collectivist: {
        'individual growth': 'growth that serves the community',
        'personal strength': 'strength that honors family and culture',
        'self-care': 'caring for oneself to better serve others'
      },
      
      individualist: {
        'community support': 'personal support network',
        'collective wisdom': 'gathered insights and learning',
        'group healing': 'shared healing journey'
      }
    };
    
    let adaptedText = text;
    const adaptations = culturalAdaptations[culturalContext];
    
    if (adaptations) {
      Object.entries(adaptations).forEach(([term, adaptation]) => {
        const regex = new RegExp(`\\b${this.escapeRegex(term)}\\b`, 'gi');
        adaptedText = adaptedText.replace(regex, adaptation);
      });
    }
    
    return adaptedText;
  }
  
  // ===== UTILITY METHODS =====
  
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  private calculateEmpowermentScore(original: string, transformed: string): number {
    const empowermentWords = [
      'strength', 'wisdom', 'growth', 'navigate', 'explore', 'transform',
      'resilience', 'courage', 'capacity', 'possibility', 'opportunity'
    ];
    
    const deficitWords = [
      'broken', 'wrong', 'problem', 'issue', 'disorder', 'dysfunction',
      'pathology', 'abnormal', 'symptoms', 'illness'
    ];
    
    let empowermentCount = 0;
    let deficitCount = 0;
    
    empowermentWords.forEach(word => {
      const matches = transformed.match(new RegExp(`\\b${word}\\b`, 'gi'));
      empowermentCount += matches ? matches.length : 0;
    });
    
    deficitWords.forEach(word => {
      const matches = transformed.match(new RegExp(`\\b${word}\\b`, 'gi'));
      deficitCount += matches ? matches.length : 0;
    });
    
    const totalWords = transformed.split(/\s+/).length;
    const empowermentRatio = empowermentCount / totalWords;
    const deficitPenalty = deficitCount * 10; // Heavy penalty for deficit language
    
    return Math.max(0, Math.min(100, (empowermentRatio * 100) - deficitPenalty));
  }
  
  private calculateAuditScore(text: string, findings: DeficitLanguageFlag[]): number {
    if (findings.length === 0) return 100;
    
    const severityWeights = { low: 1, medium: 3, high: 5, critical: 10 };
    const totalPenalty = findings.reduce((penalty, finding) => {
      return penalty + (finding.matches.length * severityWeights[finding.severity]);
    }, 0);
    
    const wordCount = text.split(/\s+/).length;
    const penaltyRatio = totalPenalty / wordCount;
    
    return Math.max(0, 100 - (penaltyRatio * 100));
  }
  
  private assessCulturalAlignment(transformations: LanguageTransformation[]): string[] {
    const alignments = new Set<string>();
    
    transformations.forEach(transform => {
      alignments.add(transform.culturalSensitivity);
    });
    
    return Array.from(alignments);
  }
  
  private getTransformationRecommendation(deficitTerm: string): string {
    const transformation = this.transformationMap.get(deficitTerm.toLowerCase());
    
    if (transformation) {
      return `Replace "${deficitTerm}" with "${transformation.strengthBasedAlternative}"`;
    }
    
    return `Consider reframing "${deficitTerm}" with strength-based language`;
  }
  
  private generateAlternatives(findings: DeficitLanguageFlag[]): string[] {
    const alternatives: string[] = [];
    
    findings.forEach(finding => {
      finding.matches.forEach(match => {
        const transformation = this.transformationMap.get(match.toLowerCase());
        if (transformation) {
          alternatives.push(transformation.strengthBasedAlternative);
        }
      });
    });
    
    return alternatives;
  }
  
  private generateRecommendations(findings: DeficitLanguageFlag[]): string[] {
    const recommendations: string[] = [];
    
    if (findings.some(f => f.severity === 'critical')) {
      recommendations.push('Eliminate all pathologizing language immediately');
    }
    
    if (findings.some(f => f.context === 'Clinical Pathology')) {
      recommendations.push('Replace clinical terminology with humanizing language');
    }
    
    if (findings.some(f => f.context === 'Core Deficit Language')) {
      recommendations.push('Reframe deficit language toward growth and exploration');
    }
    
    if (findings.length > 5) {
      recommendations.push('Consider comprehensive language review and training');
    }
    
    return recommendations;
  }
}

// ===== UTILITY FUNCTIONS =====

export function quickTransformDeficitLanguage(text: string): string {
  const engine = new StrengthBasedLanguageEngine();
  return engine.transformToStrengthBased(text).transformedText;
}

export function auditTextForDeficitLanguage(text: string): LanguageAuditResult {
  const engine = new StrengthBasedLanguageEngine();
  return engine.auditForDeficitLanguage(text);
}

export function generateEmpowermentPrompt(
  userInput: string,
  type: 'validation' | 'reframe' | 'exploration' | 'growth' = 'validation'
): string {
  const engine = new StrengthBasedLanguageEngine();
  return engine.generateEmpowermentResponse(userInput, type);
}

// Export the main engine
export default StrengthBasedLanguageEngine;