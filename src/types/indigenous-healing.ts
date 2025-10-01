/**
 * Type definitions for Indigenous Healing Integration System
 */

export interface IndigenousHealingProtocol {
  id: string;
  tribalNation: string;
  healingPractice: string;
  accessibility: 'tribal-only' | 'community-invited' | 'appropriate-partnerships' | 'general-principles';
  requirements: string[];
  reciprocityExpected: string[];
  oversightRequired: boolean;
}

export interface SovereigntyCompliance {
  compliant: boolean;
  violations: string[];
  remediationRequired: string[];
  consultationNeeded: boolean;
  tribalApprovalRequired: boolean;
}

export interface ReciprocityAgreement {
  id: string;
  type: 'financial' | 'resource-sharing' | 'community-benefit' | 'cultural-exchange';
  description: string;
  deliverables: string[];
  timeline: string;
  oversight: string;
  fulfilled: boolean;
}