/**
 * Type definitions for Community Resource Validation System
 */

export interface CommunityResourceMap {
  [community: string]: CrisisResource[];
}

export interface ResourceValidation {
  resourceId: string;
  validationDate: Date;
  checks: any;
  overallScore: number;
  isRecommended: boolean;
  issues: string[];
  improvements: string[];
}

export interface AccessibilityCheck {
  score: number;
  barriers: string[];
  strengths: string[];
  recommendations: string[];
}

export interface CulturalCompetencyValidation {
  score: number;
  certifications: string[];
  issues: string[];
  strengths: string[];
  communitySpecificRatings: Map<string, number>;
}

export interface AvailabilityValidation {
  score: number;
  is24Hours: boolean;
  emergencyAvailable: boolean;
  averageWaitTime: string;
  responseTime: string;
  issues: string[];
}

export interface QualityAssessment {
  score: number;
  lastValidated: Date;
  communityEndorsements: number;
  activeIssues: number;
  recommendations: string[];
}

export interface CommunityEndorsementValidation {
  totalEndorsements: number;
  recentEndorsements: number;
  averageRating: number;
  endorsingOrganizations: string[];
  needsUpdate: boolean;
}