/**
 * Type definitions for Multilingual Crisis Testing System
 */

export interface MultilingualTestResult {
  testId: string;
  language: string;
  testText: string;
  expectedCrisis: boolean;
  detectedCrisis: boolean;
  confidence: number;
  culturalContext: string[];
  accuracy: boolean;
  culturalNuancesDetected: string[];
  resourcesProvided: string[];
  issues: string[];
  recommendations: string[];
}

export interface LanguageCrisisPattern {
  language: string;
  pattern: string;
  culturalMeaning: string;
  severity: string;
  communitySpecific: boolean;
}

export interface CulturalCrisisExpression {
  expression: string;
  literal: string;
  culturalMeaning: string;
  severity: 'low' | 'moderate' | 'high' | 'emergency';
  context: string;
  falsePositiveRisk: boolean;
  requiredCulturalKnowledge: string[];
}