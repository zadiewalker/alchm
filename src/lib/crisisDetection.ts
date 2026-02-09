// Crisis Detection Service - Client-side pattern analysis for early intervention

interface CrisisIndicators {
  suicidalIdeation: number; // 0-1 confidence score
  hopelessness: number;
  socialIsolation: number;
  substanceUse: number;
  sleepDisruption: number;
  emotionalVolatility: number;
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
}

interface CrisisPattern {
  type: 'acute' | 'chronic' | 'escalating' | 'stable';
  timeframe: string;
  triggers: string[];
  protectiveFactors: string[];
  recommendations: string[];
}

export class CrisisDetectionService {
  private readonly crisisKeywords = {
    suicidalIdeation: [
      'kill myself', 'end my life', 'suicide', 'suicidal', 'better off dead',
      'want to die', 'end it all', 'not worth living', 'cant go on',
      'escape this pain', 'permanent solution'
    ],
    hopelessness: [
      'hopeless', 'no point', 'no way out', 'nothing matters', 'give up',
      'no future', 'pointless', 'meaningless', 'trapped', 'stuck forever'
    ],
    socialIsolation: [
      'alone', 'nobody cares', 'isolated', 'disconnected', 'no friends',
      'abandoned', 'forgotten', 'invisible', 'shut out', 'lonely'
    ],
    substanceUse: [
      'drinking too much', 'drugs', 'high', 'drunk', 'pills', 'numbing',
      'escape through', 'substance', 'alcohol', 'addiction'
    ],
    sleepDisruption: [
      'cant sleep', 'insomnia', 'nightmares', 'exhausted', 'tired',
      'sleep all day', 'no energy', 'fatigue', 'restless'
    ],
    emotionalVolatility: [
      'mood swings', 'angry outbursts', 'explosive', 'rage', 'uncontrollable',
      'emotional rollercoaster', 'ups and downs', 'volatile'
    ]
  };

  private readonly protectiveFactors = [
    'family', 'friends', 'therapy', 'support', 'hope', 'goals', 'future',
    'love', 'care', 'help', 'treatment', 'better', 'improving', 'grateful',
    'blessed', 'lucky', 'strong', 'resilient', 'survive', 'overcome'
  ];

  private readonly escalationPatterns = [
    'getting worse', 'spiraling', 'downward', 'deteriorating', 'cant take',
    'breaking point', 'last straw', 'final', 'enough', 'overwhelmed'
  ];

  analyzeJournalEntry(content: string, mood?: number, emotions?: string[]): CrisisIndicators {
    const text = content.toLowerCase();
    const words = text.split(/\s+/);
    const totalWords = words.length;

    // Calculate individual risk indicators
    const suicidalIdeation = this.calculateIndicator(text, this.crisisKeywords.suicidalIdeation, totalWords);
    const hopelessness = this.calculateIndicator(text, this.crisisKeywords.hopelessness, totalWords);
    const socialIsolation = this.calculateIndicator(text, this.crisisKeywords.socialIsolation, totalWords);
    const substanceUse = this.calculateIndicator(text, this.crisisKeywords.substanceUse, totalWords);
    const sleepDisruption = this.calculateIndicator(text, this.crisisKeywords.sleepDisruption, totalWords);
    const emotionalVolatility = this.calculateIndicator(text, this.crisisKeywords.emotionalVolatility, totalWords);

    // Weight mood score if available
    let moodWeight = 1;
    if (mood !== undefined) {
      if (mood <= 2) moodWeight = 2.5; // Severely low mood increases risk
      else if (mood <= 4) moodWeight = 1.8;
      else if (mood >= 8) moodWeight = 0.6; // High mood is protective
    }

    // Calculate protective factors
    const protectiveScore = this.calculateIndicator(text, this.protectiveFactors, totalWords);
    const protectiveWeight = Math.max(0.3, 1 - protectiveScore);

    // Calculate overall risk with weighting
    const riskScore = (
      suicidalIdeation * 3.0 + // Highest weight for suicidal ideation
      hopelessness * 2.0 +
      socialIsolation * 1.5 +
      substanceUse * 1.8 +
      sleepDisruption * 1.2 +
      emotionalVolatility * 1.3
    ) * moodWeight * protectiveWeight / 11.8; // Normalize

    // Determine risk level
    let overallRisk: CrisisIndicators['overallRisk'];
    let confidence: number;

    if (suicidalIdeation > 0.3 || riskScore > 0.7) {
      overallRisk = 'critical';
      confidence = Math.min(0.95, 0.7 + riskScore * 0.3);
    } else if (riskScore > 0.5) {
      overallRisk = 'high';
      confidence = Math.min(0.9, 0.6 + riskScore * 0.3);
    } else if (riskScore > 0.3) {
      overallRisk = 'moderate';
      confidence = Math.min(0.8, 0.5 + riskScore * 0.3);
    } else {
      overallRisk = 'low';
      confidence = Math.min(0.7, 0.4 + (1 - riskScore) * 0.3);
    }

    return {
      suicidalIdeation,
      hopelessness,
      socialIsolation,
      substanceUse,
      sleepDisruption,
      emotionalVolatility,
      overallRisk,
      confidence
    };
  }

  analyzeCrisisPattern(entries: Array<{
    content: string;
    mood?: number;
    createdAt: Date;
    emotions?: string[];
  }>): CrisisPattern {
    if (entries.length < 3) {
      return {
        type: 'stable',
        timeframe: 'insufficient data',
        triggers: [],
        protectiveFactors: [],
        recommendations: ['Continue journaling for better pattern analysis']
      };
    }

    // Analyze each entry
    const analyses = entries.map(entry => ({
      ...this.analyzeJournalEntry(entry.content, entry.mood, entry.emotions),
      date: entry.createdAt
    }));

    // Calculate trend
    const recentAnalyses = analyses.slice(0, 7); // Last 7 entries
    const riskScores = recentAnalyses.map(a => this.getRiskScore(a.overallRisk));
    const trend = this.calculateTrend(riskScores);

    // Determine pattern type
    let patternType: CrisisPattern['type'];
    const highRiskRecent = recentAnalyses.filter(a => a.overallRisk === 'high' || a.overallRisk === 'critical').length;
    const avgRisk = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;

    if (trend > 0.3) {
      patternType = 'escalating';
    } else if (highRiskRecent >= 2) {
      patternType = 'acute';
    } else if (avgRisk > 2) {
      patternType = 'chronic';
    } else {
      patternType = 'stable';
    }

    // Extract common triggers and protective factors
    const allTexts = entries.map(e => e.content.toLowerCase()).join(' ');
    const triggers = this.extractTriggers(allTexts);
    const protectiveFactors = this.extractProtectiveFactors(allTexts);

    // Generate recommendations
    const recommendations = this.generateRecommendations(patternType, triggers, analyses);

    return {
      type: patternType,
      timeframe: `Based on ${entries.length} recent entries`,
      triggers,
      protectiveFactors,
      recommendations
    };
  }

  shouldTriggerIntervention(indicators: CrisisIndicators): boolean {
    return indicators.overallRisk === 'critical' || 
           (indicators.overallRisk === 'high' && indicators.suicidalIdeation > 0.2);
  }

  generateInterventionPlan(indicators: CrisisIndicators, pattern: CrisisPattern): {
    immediateActions: string[];
    shortTermActions: string[];
    longTermActions: string[];
    emergencyContacts: boolean;
    professionalHelp: boolean;
  } {
    const plan = {
      immediateActions: [] as string[],
      shortTermActions: [] as string[],
      longTermActions: [] as string[],
      emergencyContacts: false,
      professionalHelp: false
    };

    // Immediate actions based on risk level
    if (indicators.overallRisk === 'critical') {
      plan.immediateActions.push(
        'Contact crisis support immediately (988)',
        'Remove access to means of self-harm',
        'Stay with trusted person',
        'Go to emergency room if thoughts persist'
      );
      plan.emergencyContacts = true;
      plan.professionalHelp = true;
    } else if (indicators.overallRisk === 'high') {
      plan.immediateActions.push(
        'Reach out to support person',
        'Use safety plan coping strategies',
        'Practice grounding techniques',
        'Avoid alcohol and substances'
      );
      plan.professionalHelp = true;
    }

    // Pattern-specific actions
    if (pattern.type === 'escalating') {
      plan.shortTermActions.push(
        'Schedule emergency therapy appointment',
        'Daily safety check-ins',
        'Medication review if applicable',
        'Remove stressors where possible'
      );
    }

    // Trigger-specific interventions
    pattern.triggers.forEach(trigger => {
      if (trigger.includes('work') || trigger.includes('job')) {
        plan.shortTermActions.push('Consider work accommodations or time off');
      }
      if (trigger.includes('relationship') || trigger.includes('family')) {
        plan.shortTermActions.push('Family/couples therapy consultation');
      }
    });

    // Long-term strategies
    plan.longTermActions.push(
      'Regular therapy sessions',
      'Develop comprehensive safety plan',
      'Build stronger support network',
      'Practice stress management skills',
      'Consider support group participation'
    );

    return plan;
  }

  private calculateIndicator(text: string, keywords: string[], totalWords: number): number {
    let matches = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        matches++;
      }
    });
    
    // Normalize by text length and keyword frequency with NaN protection
    const safeTotalWords = Math.max(1, totalWords || 1);
    const density = matches / Math.max(1, safeTotalWords / 100); // Per 100 words
    const safeKeywordsLength = Math.max(1, keywords.length || 1);
    const result = density / safeKeywordsLength * 10;
    return Math.min(1, isNaN(result) ? 0 : result); // Scale to 0-1 with NaN protection
  }

  private getRiskScore(riskLevel: string): number {
    switch (riskLevel) {
      case 'critical': return 4;
      case 'high': return 3;
      case 'moderate': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private calculateTrend(scores: number[]): number {
    if (scores.length < 3) return 0;
    
    // Simple linear regression to determine trend
    const n = scores.length;
    const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
    const sumY = scores.reduce((a, b) => a + b, 0);
    const sumXY = scores.reduce((sum, score, index) => sum + score * index, 0);
    const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope; // Positive = increasing risk, Negative = decreasing risk
  }

  private extractTriggers(text: string): string[] {
    const commonTriggers = [
      'work', 'job', 'boss', 'career', 'money', 'financial',
      'relationship', 'breakup', 'divorce', 'family', 'parents',
      'health', 'illness', 'pain', 'medical', 'death', 'loss',
      'school', 'exam', 'graduation', 'failure', 'rejection'
    ];

    return commonTriggers.filter(trigger => 
      text.includes(trigger) && text.split(' ').filter(word => word.includes(trigger)).length > 1
    );
  }

  private extractProtectiveFactors(text: string): string[] {
    return this.protectiveFactors.filter(factor => text.includes(factor));
  }

  private generateRecommendations(
    patternType: CrisisPattern['type'], 
    triggers: string[], 
    analyses: any[]
  ): string[] {
    const recommendations: string[] = [];

    // Pattern-based recommendations
    switch (patternType) {
      case 'escalating':
        recommendations.push(
          'Immediate professional intervention recommended',
          'Daily mood and safety monitoring',
          'Consider inpatient or intensive outpatient treatment'
        );
        break;
      case 'acute':
        recommendations.push(
          'Crisis stabilization plan activation',
          'Emergency therapy sessions',
          'Safety plan review and updates'
        );
        break;
      case 'chronic':
        recommendations.push(
          'Long-term therapeutic relationship',
          'Medication evaluation',
          'Lifestyle modifications for mental health'
        );
        break;
      case 'stable':
        recommendations.push(
          'Continue current treatment plan',
          'Maintain healthy coping strategies',
          'Regular mental health check-ins'
        );
        break;
    }

    // Trigger-specific recommendations
    if (triggers.includes('work') || triggers.includes('job')) {
      recommendations.push('Workplace stress management strategies');
    }
    if (triggers.includes('relationship') || triggers.includes('family')) {
      recommendations.push('Relationship counseling or family therapy');
    }
    if (triggers.includes('health') || triggers.includes('pain')) {
      recommendations.push('Integrated medical and mental health care');
    }

    return recommendations;
  }
}

export const crisisDetection = new CrisisDetectionService();