/**
 * Predictive Wellness Engine
 * AI-powered wellness prediction and proactive support
 */

export interface WellnessMetrics {
  emotionalState: number; // 0-100
  stressLevel: number; // 0-100
  energyLevel: number; // 0-100
  socialConnection: number; // 0-100
  selfCareConsistency: number; // 0-100
}

export interface WellnessPrediction {
  likelihood: number; // 0-1 probability
  timeframe: string;
  indicators: string[];
  preventiveActions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface WellnessRecommendation {
  type: 'preventive' | 'supportive' | 'immediate';
  priority: 'low' | 'medium' | 'high';
  action: string;
  rationale: string;
  timeframe: string;
}

export class PredictiveWellnessEngine {
  static analyzeWellnessTrends(journalData: any[], userMetrics: any): WellnessMetrics {
    // Simplified implementation - would use ML models in production
    return {
      emotionalState: 75,
      stressLevel: 35,
      energyLevel: 80,
      socialConnection: 65,
      selfCareConsistency: 85
    };
  }

  static predictWellnessEvents(metrics: WellnessMetrics, historicalData: any[]): WellnessPrediction[] {
    const predictions: WellnessPrediction[] = [];

    // Stress level prediction
    if (metrics.stressLevel > 70) {
      predictions.push({
        likelihood: 0.8,
        timeframe: 'Next 3-7 days',
        indicators: ['Rising stress indicators', 'Decreased self-care'],
        preventiveActions: [
          'Schedule stress-reducing activities',
          'Prioritize sleep and rest',
          'Connect with support system'
        ],
        riskLevel: 'high'
      });
    }

    // Energy depletion prediction
    if (metrics.energyLevel < 40) {
      predictions.push({
        likelihood: 0.7,
        timeframe: 'Next 1-3 days',
        indicators: ['Low energy patterns', 'Inconsistent self-care'],
        preventiveActions: [
          'Gentle movement or stretching',
          'Nutrition assessment',
          'Earlier bedtime routine'
        ],
        riskLevel: 'medium'
      });
    }

    return predictions;
  }

  static generateRecommendations(
    metrics: WellnessMetrics, 
    predictions: WellnessPrediction[]
  ): WellnessRecommendation[] {
    const recommendations: WellnessRecommendation[] = [];

    // High stress intervention
    if (metrics.stressLevel > 60) {
      recommendations.push({
        type: 'immediate',
        priority: 'high',
        action: 'Take 5 deep breaths and check in with your body',
        rationale: 'Your stress indicators suggest you could benefit from immediate grounding',
        timeframe: 'Now'
      });
    }

    // Social connection support
    if (metrics.socialConnection < 50) {
      recommendations.push({
        type: 'supportive',
        priority: 'medium',
        action: 'Reach out to one person who brings you joy',
        rationale: 'Social connection is a key protective factor for wellbeing',
        timeframe: 'Today'
      });
    }

    // Self-care consistency
    if (metrics.selfCareConsistency < 60) {
      recommendations.push({
        type: 'preventive',
        priority: 'medium',
        action: 'Choose one small self-care act for tomorrow',
        rationale: 'Consistent small acts build resilience over time',
        timeframe: 'Tomorrow'
      });
    }

    return recommendations;
  }

  static calculateWellnessRisk(metrics: WellnessMetrics): 'low' | 'medium' | 'high' {
    const riskFactors = [
      metrics.emotionalState < 40,
      metrics.stressLevel > 70,
      metrics.energyLevel < 30,
      metrics.socialConnection < 40,
      metrics.selfCareConsistency < 50
    ];

    const riskCount = riskFactors.filter(Boolean).length;

    if (riskCount >= 3) return 'high';
    if (riskCount >= 2) return 'medium';
    return 'low';
  }
}

export default PredictiveWellnessEngine;