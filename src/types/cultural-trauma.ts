/**
 * Type definitions for Cultural Trauma Recognition System
 */

export interface TraumaPattern {
  id: string;
  type: 'intergenerational' | 'religious' | 'immigration' | 'systemic' | 'identity-based';
  description: string;
  culturalContext: string[];
  severity: 'mild' | 'moderate' | 'severe';
  triggers: string[];
}

export interface TraumaValidationResult {
  hasTraumaIndicators: boolean;
  detectedTraumas: any[];
  culturalContext: string[];
  confidence: number;
  validationRequired: boolean;
  culturallyInformedResponse: string;
  healingRecommendations: any[];
  safeguards: any[];
  communityResources: any[];
  testCase?: any;
  accuracy?: boolean;
}

export interface CulturalTraumaContext {
  community: string;
  historicalEvents: string[];
  manifestations: string[];
  healingTraditions: string[];
  modernChallenges: string[];
}