/**
 * ALCHM Crisis Detection Types
 * 
 * Type definitions for the crisis detection and intervention system
 */

export type InterventionLevel = 'none' | 'gentle' | 'supportive' | 'immediate';

export type CrisisSeverity = 'low' | 'medium' | 'high';

export type CrisisCategory = 'suicidal' | 'self_harm' | 'depression' | 'anxiety' | 'crisis' | 'distress';

export type ContactType = 'phone' | 'text' | 'chat' | 'email' | 'website';

export interface CrisisPattern {
  id: string;
  category: CrisisCategory;
  severity: CrisisSeverity;
  patterns: RegExp[];
  contextModifiers?: Record<string, RegExp>;
  weight: number;
}

export interface CrisisResource {
  id: string;
  name: string;
  contact: string;
  contactType: ContactType;
  description: string;
  priority: number;
  specializations: string[];
  availability: string;
  languages?: string[];
  website?: string;
  additionalInfo?: string;
}

export interface CrisisDetectionResult {
  interventionLevel: InterventionLevel;
  crisisScore: number;
  detectedPatterns: CrisisPattern[];
  recommendedResources: CrisisResource[];
  confidence: number;
  timestamp: Date;
  processingTime: number;
  error?: string;
}

export interface CrisisInterventionConfig {
  enabled: boolean;
  realTimeAnalysis: boolean;
  interventionThresholds: {
    gentle: number;
    supportive: number;
    immediate: number;
  };
  resourceDisplay: {
    maxResources: number;
    showSpecialized: boolean;
    prioritizeLocal: boolean;
  };
  analytics: {
    trackInterventions: boolean;
    trackResourceAccess: boolean;
    anonymizeData: boolean;
  };
}

export interface CrisisAnalyticsEvent {
  type: 'detection' | 'intervention' | 'resource_access' | 'escalation';
  userId: string;
  interventionLevel?: InterventionLevel;
  crisisScore?: number;
  confidence?: number;
  resourceId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface EmergencyEscalation {
  userId: string;
  detectionResult: CrisisDetectionResult;
  escalationType: 'automatic' | 'manual';
  contactAttempts: {
    method: ContactType;
    timestamp: Date;
    success: boolean;
    response?: string;
  }[];
  resolution?: {
    outcome: 'resolved' | 'referred' | 'ongoing';
    timestamp: Date;
    notes: string;
  };
}

export interface CrisisInterventionSettings {
  showImmediateResources: boolean;
  enableRealTimeDetection: boolean;
  allowEmergencyEscalation: boolean;
  preferredContactMethods: ContactType[];
  culturalPreferences: string[];
  languagePreference: string;
  emergencyContacts?: {
    name: string;
    relationship: string;
    contact: string;
    contactType: ContactType;
  }[];
}