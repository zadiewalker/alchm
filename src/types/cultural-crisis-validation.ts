/**
 * Type definitions for Cultural Crisis Validation System
 */

export interface CulturalContext {
  historicalTrauma: string[];
  protectiveFractors: string[];
  communicationStyle: string;
  healingTraditions: string[];
}

export interface CrisisPattern {
  id: string;
  community: string;
  pattern: string;
  severity: 'low' | 'moderate' | 'high' | 'emergency';
  culturalNuances: string[];
  validated: boolean;
}

export interface ValidationResult {
  hasCrisisIndicators: boolean;
  indicators: any[];
  culturalContext: string[];
  confidence: number;
  recommendations: string[];
  biasRisk: 'low' | 'moderate' | 'high';
  validationSource: string;
  expectedResult?: boolean;
  accuracy?: boolean;
}