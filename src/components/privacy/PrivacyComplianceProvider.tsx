'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  consentManager, 
  validateFeatureAccess, 
  createUserConsent,
  type ConsentRecord 
} from '@/lib/privacy/consent-management';
import { 
  ageVerificationSystem,
  initiateAgeVerification,
  processAgeVerification,
  validateAgeVerification,
  type AgeGroup,
  type AgeVerificationRecord
} from '@/lib/privacy/age-verification';

interface PrivacyComplianceState {
  // Age Verification
  ageVerified: boolean;
  ageGroup: AgeGroup | null;
  ageVerificationRecord: AgeVerificationRecord | null;
  
  // Consent Management
  consentRecord: ConsentRecord | null;
  requiresParentalConsent: boolean;
  parentalConsentVerified: boolean;
  
  // Compliance Status
  isCompliant: boolean;
  complianceErrors: string[];
  
  // Privacy Controls
  dataMinimizationActive: boolean;
  encryptionEnabled: boolean;
  analyticsConsent: boolean;
  
  // Legal Framework
  jurisdiction: string;
  applicableLaws: string[];
  
  // Loading States
  isInitializing: boolean;
  isVerifying: boolean;
}

interface PrivacyComplianceActions {
  // Age Verification
  initiateAgeVerification: () => Promise<{ verificationId: string; canProceed: boolean }>;
  submitAgeVerification: (birthData: { birthMonth: string; birthYear: string }) => Promise<boolean>;
  
  // Consent Management
  grantConsent: (consentChoices: Record<string, boolean>) => Promise<void>;
  withdrawConsent: (features: string[]) => Promise<void>;
  updateConsentChoices: (choices: Record<string, boolean>) => Promise<void>;
  
  // Privacy Rights
  exerciseDataRights: (rightType: 'access' | 'rectification' | 'erasure' | 'portability') => Promise<string>;
  
  // Feature Access
  validateFeatureAccess: (feature: string) => Promise<boolean>;
  
  // Parental Consent
  initiateParentalConsent: (parentalData: any) => Promise<string>;
  
  // Compliance Validation
  validateCompliance: () => Promise<boolean>;
  refreshComplianceStatus: () => Promise<void>;
}

const PrivacyComplianceContext = createContext<PrivacyComplianceState & PrivacyComplianceActions>({} as any);

export function usePrivacyCompliance() {
  const context = useContext(PrivacyComplianceContext);
  if (!context) {
    throw new Error('usePrivacyCompliance must be used within a PrivacyComplianceProvider');
  }
  return context;
}

interface PrivacyComplianceProviderProps {
  children: ReactNode;
}

export default function PrivacyComplianceProvider({ children }: PrivacyComplianceProviderProps) {
  const { user } = useAuth();
  const [state, setState] = useState<PrivacyComplianceState>({
    ageVerified: false,
    ageGroup: null,
    ageVerificationRecord: null,
    consentRecord: null,
    requiresParentalConsent: false,
    parentalConsentVerified: false,
    isCompliant: false,
    complianceErrors: [],
    dataMinimizationActive: true,
    encryptionEnabled: true,
    analyticsConsent: false,
    jurisdiction: 'US',
    applicableLaws: ['COPPA', 'CCPA'],
    isInitializing: true,
    isVerifying: false
  });

  // Detect user's jurisdiction for compliance requirements
  const detectJurisdiction = async (): Promise<string> => {
    try {
      // In production, use proper geolocation service
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone.includes('Europe')) return 'EU';
      if (timezone.includes('America')) return 'US';
      return 'US'; // Default fallback
    } catch (error) {
      console.error('Failed to detect jurisdiction:', error);
      return 'US';
    }
  };

  // Generate device fingerprint for fraud prevention (privacy-preserving)
  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('ALCHM Privacy Fingerprint', 2, 2);
    }
    
    const fingerprint = {
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      canvas: canvas.toDataURL().slice(-50) // Last 50 chars only
    };
    
    return btoa(JSON.stringify(fingerprint)).slice(0, 32);
  };

  // Initialize privacy compliance on mount
  useEffect(() => {
    initializePrivacyCompliance();
  }, []);

  // Re-validate compliance when user changes
  useEffect(() => {
    if (user) {
      validateUserCompliance();
    }
  }, [user]);

  const initializePrivacyCompliance = async () => {
    try {
      setState(prev => ({ ...prev, isInitializing: true }));
      
      // Detect jurisdiction and applicable laws
      const jurisdiction = await detectJurisdiction();
      const applicableLaws = getApplicableLaws(jurisdiction);
      
      setState(prev => ({
        ...prev,
        jurisdiction,
        applicableLaws,
        isInitializing: false
      }));
      
    } catch (error) {
      console.error('Failed to initialize privacy compliance:', error);
      setState(prev => ({
        ...prev,
        isInitializing: false,
        complianceErrors: ['Failed to initialize privacy system']
      }));
    }
  };

  const validateUserCompliance = async () => {
    if (!user) return;
    
    try {
      // Check existing consent records
      const userConsents = await consentManager.getUserConsents(user.uid);
      const latestConsent = userConsents[0];
      
      if (latestConsent) {
        // Validate age verification
        const ageValidation = await validateAgeVerification(latestConsent.consentId);
        
        setState(prev => ({
          ...prev,
          ageVerified: ageValidation.isValid,
          ageGroup: ageValidation.ageGroup || null,
          consentRecord: latestConsent,
          requiresParentalConsent: ageValidation.requiresParentalConsent,
          parentalConsentVerified: !ageValidation.requiresParentalConsent || 
                                  (latestConsent.parentalConsent?.verificationStatus === 'verified'),
          isCompliant: ageValidation.isValid && 
                      (!ageValidation.requiresParentalConsent || 
                       latestConsent.parentalConsent?.verificationStatus === 'verified'),
          analyticsConsent: latestConsent.consentChoices.platform_analytics || false
        }));
      }
    } catch (error) {
      console.error('Failed to validate user compliance:', error);
    }
  };

  const initiateAgeVerificationFlow = async (): Promise<{ verificationId: string; canProceed: boolean }> => {
    try {
      setState(prev => ({ ...prev, isVerifying: true }));
      
      const sessionData = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userAgent: navigator.userAgent,
        deviceFingerprint: generateDeviceFingerprint(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`
      };
      
      const result = await initiateAgeVerification(sessionData);
      
      if (!result.canProceed) {
        setState(prev => ({
          ...prev,
          isVerifying: false,
          complianceErrors: [result.reason || 'Age verification blocked']
        }));
      }
      
      return {
        verificationId: result.verificationId || '',
        canProceed: result.canProceed
      };
    } catch (error) {
      console.error('Failed to initiate age verification:', error);
      setState(prev => ({
        ...prev,
        isVerifying: false,
        complianceErrors: ['Failed to start age verification']
      }));
      throw error;
    }
  };

  const submitAgeVerificationData = async (birthData: { birthMonth: string; birthYear: string }): Promise<boolean> => {
    try {
      const verificationStartTime = Date.now();
      
      // Get current verification session
      const sessionData = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userAgent: navigator.userAgent,
        deviceFingerprint: generateDeviceFingerprint(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`
      };
      
      const initiationResult = await initiateAgeVerification(sessionData);
      if (!initiationResult.canProceed || !initiationResult.verificationId) {
        return false;
      }
      
      const result = await processAgeVerification(
        initiationResult.verificationId,
        birthData,
        {
          verificationStartTime,
          userBehaviorSignals: {
            mouseMovements: 10, // Would track actual mouse movements
            keystrokes: 5,
            timeSpentReading: Date.now() - verificationStartTime
          }
        }
      );
      
      if (result.success && result.ageGroup) {
        setState(prev => ({
          ...prev,
          ageVerified: true,
          ageGroup: result.ageGroup || null,
          ageVerificationRecord: result.verificationRecord || null,
          requiresParentalConsent: result.requiresParentalConsent,
          isVerifying: false
        }));
        
        // Auto-create consent record for verified users
        if (user && result.ageGroup) {
          await createInitialConsentRecord(result.ageGroup);
        }
        
        return true;
      } else {
        setState(prev => ({
          ...prev,
          isVerifying: false,
          complianceErrors: result.suspiciousActivity || ['Age verification failed']
        }));
        return false;
      }
    } catch (error) {
      console.error('Failed to submit age verification:', error);
      setState(prev => ({
        ...prev,
        isVerifying: false,
        complianceErrors: ['Age verification submission failed']
      }));
      return false;
    }
  };

  const createInitialConsentRecord = async (ageGroup: AgeGroup) => {
    if (!user) return;
    
    try {
      const defaultConsents = {
        essential_functionality: true,
        safety_communications: true,
        enhanced_ai_features: false,
        platform_analytics: false,
        research_participation: false
      };
      
      const consentRecord = await createUserConsent(
        user.uid,
        ageGroup,
        defaultConsents,
        {
          userAgent: navigator.userAgent,
          jurisdiction: state.jurisdiction
        }
      );
      
      setState(prev => ({
        ...prev,
        consentRecord,
        isCompliant: !consentRecord.requiresParentalConsent || 
                    (consentRecord.parentalConsent?.verificationStatus === 'verified')
      }));
    } catch (error) {
      console.error('Failed to create consent record:', error);
    }
  };

  const grantUserConsent = async (consentChoices: Record<string, boolean>) => {
    if (!user || !state.ageGroup) return;
    
    try {
      const consentRecord = await createUserConsent(
        user.uid,
        state.ageGroup,
        consentChoices,
        {
          userAgent: navigator.userAgent,
          jurisdiction: state.jurisdiction
        }
      );
      
      setState(prev => ({
        ...prev,
        consentRecord,
        analyticsConsent: consentChoices.platform_analytics || false
      }));
    } catch (error) {
      console.error('Failed to grant consent:', error);
    }
  };

  const withdrawUserConsent = async (features: string[]) => {
    if (!user || !state.consentRecord) return;
    
    try {
      await consentManager.withdrawConsent(user.uid, features);
      await validateUserCompliance(); // Refresh state
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
    }
  };

  const updateUserConsentChoices = async (choices: Record<string, boolean>) => {
    await grantUserConsent(choices);
  };

  const exerciseUserDataRights = async (rightType: 'access' | 'rectification' | 'erasure' | 'portability'): Promise<string> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const requestId = await consentManager.exercisePrivacyRight(user.uid, rightType, {});
      return requestId;
    } catch (error) {
      console.error('Failed to exercise data rights:', error);
      throw error;
    }
  };

  const validateUserFeatureAccess = async (feature: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await validateFeatureAccess(user.uid, feature);
    } catch (error) {
      console.error('Failed to validate feature access:', error);
      return false;
    }
  };

  const initiateParentalConsentFlow = async (parentalData: any): Promise<string> => {
    if (!user || !state.consentRecord) throw new Error('Invalid state for parental consent');
    
    try {
      const parentalConsentId = await consentManager.createParentalConsent(
        state.consentRecord.consentId,
        parentalData,
        {
          userAgent: navigator.userAgent
        }
      );
      
      return parentalConsentId;
    } catch (error) {
      console.error('Failed to initiate parental consent:', error);
      throw error;
    }
  };

  const validateCurrentCompliance = async (): Promise<boolean> => {
    try {
      await validateUserCompliance();
      return state.isCompliant;
    } catch (error) {
      console.error('Failed to validate compliance:', error);
      return false;
    }
  };

  const refreshComplianceStatus = async () => {
    await validateUserCompliance();
  };

  // Helper function to get applicable laws based on jurisdiction
  const getApplicableLaws = (jurisdiction: string): string[] => {
    const laws = [];
    
    if (jurisdiction === 'EU' || jurisdiction === 'EEA') {
      laws.push('GDPR');
    }
    
    if (jurisdiction === 'US' || jurisdiction === 'CA') {
      laws.push('CCPA', 'COPPA');
    }
    
    return laws;
  };

  const value = {
    ...state,
    initiateAgeVerification: initiateAgeVerificationFlow,
    submitAgeVerification: submitAgeVerificationData,
    grantConsent: grantUserConsent,
    withdrawConsent: withdrawUserConsent,
    updateConsentChoices: updateUserConsentChoices,
    exerciseDataRights: exerciseUserDataRights,
    validateFeatureAccess: validateUserFeatureAccess,
    initiateParentalConsent: initiateParentalConsentFlow,
    validateCompliance: validateCurrentCompliance,
    refreshComplianceStatus
  };

  return (
    <PrivacyComplianceContext.Provider value={value}>
      {children}
    </PrivacyComplianceContext.Provider>
  );
}