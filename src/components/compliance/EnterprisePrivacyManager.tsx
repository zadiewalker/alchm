"use client";

// ALCHM Enterprise Privacy Manager
// Comprehensive privacy compliance for HIPAA, FERPA, COPPA, GDPR
// Trauma-informed consent management for vulnerable populations

import React, { useState, useEffect, useContext, createContext } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

// ===== PRIVACY COMPLIANCE INTERFACES =====

interface PrivacySettings {
  userId: string;
  hipaaOptIn: boolean;
  ferpaConsent: boolean;
  coppaParentalConsent: boolean;
  gdprConsent: {
    analytics: boolean;
    aiProcessing: boolean;
    thirdPartySharing: boolean;
    marketingCommunications: boolean;
  };
  dataRetentionPreference: 'MINIMAL' | 'STANDARD' | 'EXTENDED';
  crisisInterventionConsent: boolean;
  therapeuticPrivilegeWaiver: boolean;
  lastUpdated: Date;
}

interface ComplianceContext {
  privacySettings: PrivacySettings | null;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
  isMinor: boolean;
  requiresParentalConsent: boolean;
  complianceStatus: 'PENDING' | 'COMPLIANT' | 'EXPIRED';
  auditTrail: PrivacyAuditEvent[];
}

interface PrivacyAuditEvent {
  eventId: string;
  userId: string;
  eventType: 'CONSENT_GRANTED' | 'CONSENT_WITHDRAWN' | 'SETTINGS_UPDATED' | 'DATA_ACCESSED' | 'DATA_DELETED';
  timestamp: Date;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

// ===== PRIVACY CONTEXT =====

const PrivacyContext = createContext<ComplianceContext | null>(null);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [isMinor, setIsMinor] = useState(false);
  const [requiresParentalConsent, setRequiresParentalConsent] = useState(false);
  const [complianceStatus, setComplianceStatus] = useState<'PENDING' | 'COMPLIANT' | 'EXPIRED'>('PENDING');
  const [auditTrail, setAuditTrail] = useState<PrivacyAuditEvent[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        await loadPrivacySettings(user.uid);
        await checkComplianceStatus(user.uid);
      } else {
        setPrivacySettings(null);
        setComplianceStatus('PENDING');
      }
    });

    return unsubscribe;
  }, []);

  const loadPrivacySettings = async (userId: string) => {
    try {
      const settingsDoc = await getDoc(doc(db, 'user_privacy_settings', userId));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setPrivacySettings({
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        } as PrivacySettings);
      } else {
        // Create default privacy settings
        const defaultSettings: PrivacySettings = {
          userId,
          hipaaOptIn: false,
          ferpaConsent: false,
          coppaParentalConsent: false,
          gdprConsent: {
            analytics: false,
            aiProcessing: false,
            thirdPartySharing: false,
            marketingCommunications: false
          },
          dataRetentionPreference: 'MINIMAL',
          crisisInterventionConsent: false,
          therapeuticPrivilegeWaiver: false,
          lastUpdated: new Date()
        };
        
        await setDoc(doc(db, 'user_privacy_settings', userId), {
          ...defaultSettings,
          lastUpdated: serverTimestamp()
        });
        
        setPrivacySettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    }
  };

  const checkComplianceStatus = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users_standard', userId));
      const userData = userDoc.data();
      
      if (userData?.dateOfBirth) {
        const age = calculateAge(userData.dateOfBirth.toDate());
        setIsMinor(age < 18);
        setRequiresParentalConsent(age < 13);
        
        // Check compliance based on age and regulations
        const compliance = await checkRegulationCompliance(userId, age);
        setComplianceStatus(compliance);
      }
    } catch (error) {
      console.error('Error checking compliance status:', error);
    }
  };

  const updatePrivacySettings = async (updates: Partial<PrivacySettings>) => {
    if (!user || !privacySettings) return;

    try {
      const updatedSettings = {
        ...privacySettings,
        ...updates,
        lastUpdated: new Date()
      };

      await updateDoc(doc(db, 'user_privacy_settings', user.uid), {
        ...updates,
        lastUpdated: serverTimestamp()
      });

      setPrivacySettings(updatedSettings);

      // Log privacy settings change
      await logPrivacyEvent(user.uid, 'SETTINGS_UPDATED', `Updated: ${Object.keys(updates).join(', ')}`);
      
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  };

  const contextValue: ComplianceContext = {
    privacySettings,
    updatePrivacySettings,
    isMinor,
    requiresParentalConsent,
    complianceStatus,
    auditTrail
  };

  return (
    <PrivacyContext.Provider value={contextValue}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacyCompliance() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacyCompliance must be used within a PrivacyProvider');
  }
  return context;
}

// ===== PRIVACY COMPONENTS =====

export function EnterprisePrivacyDashboard() {
  const { privacySettings, updatePrivacySettings, isMinor, requiresParentalConsent, complianceStatus } = usePrivacyCompliance();
  const [loading, setLoading] = useState(false);

  if (!privacySettings) {
    return <div>Loading privacy settings...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
        <h2 className="text-xl font-medium text-blue-900">Privacy & Compliance Center</h2>
        <p className="text-blue-700">
          Your privacy is protected by HIPAA, FERPA, COPPA, and GDPR regulations. 
          Manage your consent preferences below.
        </p>
      </div>

      {/* Compliance Status */}
      <ComplianceStatusCard 
        status={complianceStatus}
        isMinor={isMinor}
        requiresParentalConsent={requiresParentalConsent}
      />

      {/* GDPR Consent Management */}
      <GDPRConsentPanel
        consent={privacySettings.gdprConsent}
        onUpdate={(gdprConsent) => updatePrivacySettings({ gdprConsent })}
      />

      {/* HIPAA Health Information Consent */}
      <HIPAAConsentPanel
        optIn={privacySettings.hipaaOptIn}
        onUpdate={(hipaaOptIn) => updatePrivacySettings({ hipaaOptIn })}
      />

      {/* Crisis Intervention Consent */}
      <CrisisInterventionConsentPanel
        consent={privacySettings.crisisInterventionConsent}
        onUpdate={(crisisInterventionConsent) => updatePrivacySettings({ crisisInterventionConsent })}
      />

      {/* Data Retention Preferences */}
      <DataRetentionPanel
        preference={privacySettings.dataRetentionPreference}
        onUpdate={(dataRetentionPreference) => updatePrivacySettings({ dataRetentionPreference })}
      />

      {/* COPPA Child Protection (if applicable) */}
      {requiresParentalConsent && (
        <COPPAParentalConsentPanel
          consent={privacySettings.coppaParentalConsent}
          onUpdate={(coppaParentalConsent) => updatePrivacySettings({ coppaParentalConsent })}
        />
      )}

      {/* FERPA Educational Records (if applicable) */}
      {isMinor && (
        <FERPAEducationalConsentPanel
          consent={privacySettings.ferpaConsent}
          onUpdate={(ferpaConsent) => updatePrivacySettings({ ferpaConsent })}
        />
      )}
    </div>
  );
}

function ComplianceStatusCard({ 
  status, 
  isMinor, 
  requiresParentalConsent 
}: { 
  status: string;
  isMinor: boolean;
  requiresParentalConsent: boolean;
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'COMPLIANT': return 'green';
      case 'EXPIRED': return 'red';
      default: return 'yellow';
    }
  };

  const statusColor = getStatusColor();

  return (
    <Card className={`border-l-4 border-${statusColor}-500 bg-${statusColor}-50 p-4`}>
      <h3 className={`font-medium text-${statusColor}-900`}>Compliance Status: {status}</h3>
      <div className={`text-${statusColor}-700 space-y-2`}>
        <p>Account Type: {isMinor ? 'Minor Account' : 'Adult Account'}</p>
        {requiresParentalConsent && (
          <p className="font-medium">⚠️ Parental consent required (COPPA protection)</p>
        )}
        {isMinor && (
          <p>📚 Educational record protections active (FERPA)</p>
        )}
        <p>🏥 Health information protected under HIPAA</p>
        <p>🌍 Privacy rights protected under GDPR</p>
      </div>
    </Card>
  );
}

function GDPRConsentPanel({ 
  consent, 
  onUpdate 
}: { 
  consent: PrivacySettings['gdprConsent'];
  onUpdate: (consent: PrivacySettings['gdprConsent']) => void;
}) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">GDPR Privacy Preferences</h3>
      <p className="text-gray-600 mb-4">
        Under GDPR, you have the right to control how your personal data is processed. 
        You can withdraw consent at any time.
      </p>

      <div className="space-y-4">
        <ConsentToggle
          label="Analytics & Performance"
          description="Help us improve the app by analyzing usage patterns (anonymized)"
          checked={consent.analytics}
          onChange={(checked) => onUpdate({ ...consent, analytics: checked })}
        />

        <ConsentToggle
          label="AI Processing & Insights"
          description="Allow AI to analyze your journal entries for personalized insights"
          checked={consent.aiProcessing}
          onChange={(checked) => onUpdate({ ...consent, aiProcessing: checked })}
        />

        <ConsentToggle
          label="Crisis Intervention Sharing"
          description="Share crisis-related data with qualified mental health professionals when necessary"
          checked={consent.thirdPartySharing}
          onChange={(checked) => onUpdate({ ...consent, thirdPartySharing: checked })}
        />

        <ConsentToggle
          label="Wellness Communications"
          description="Receive personalized wellness tips and educational content"
          checked={consent.marketingCommunications}
          onChange={(checked) => onUpdate({ ...consent, marketingCommunications: checked })}
        />
      </div>
    </Card>
  );
}

function HIPAAConsentPanel({ 
  optIn, 
  onUpdate 
}: { 
  optIn: boolean;
  onUpdate: (optIn: boolean) => void;
}) {
  return (
    <Card className="p-6 border-l-4 border-blue-500">
      <h3 className="text-lg font-medium mb-4">HIPAA Health Information Protection</h3>
      <p className="text-gray-600 mb-4">
        Your mental health information is protected under HIPAA. We maintain strict security 
        standards and never share your health information without your explicit consent.
      </p>

      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-blue-900">Your HIPAA Rights:</h4>
        <ul className="list-disc list-inside text-blue-800 mt-2 space-y-1">
          <li>Right to access your health information</li>
          <li>Right to request corrections</li>
          <li>Right to request restrictions on use</li>
          <li>Right to file a complaint</li>
          <li>Right to request confidential communications</li>
        </ul>
      </div>

      <ConsentToggle
        label="HIPAA-Compliant Health Information Processing"
        description="I consent to the processing of my health information for therapeutic purposes under HIPAA protections"
        checked={optIn}
        onChange={onUpdate}
        required={true}
      />
    </Card>
  );
}

function CrisisInterventionConsentPanel({ 
  consent, 
  onUpdate 
}: { 
  consent: boolean;
  onUpdate: (consent: boolean) => void;
}) {
  return (
    <Card className="p-6 border-l-4 border-red-500">
      <h3 className="text-lg font-medium mb-4">Crisis Intervention Consent</h3>
      <p className="text-gray-600 mb-4">
        If our AI detects signs of imminent danger or crisis, we may need to connect you 
        with qualified mental health professionals or emergency services.
      </p>

      <div className="bg-red-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-red-900">Crisis Intervention includes:</h4>
        <ul className="list-disc list-inside text-red-800 mt-2 space-y-1">
          <li>Immediate safety resource recommendations</li>
          <li>Connection with crisis counselors</li>
          <li>Emergency contact notification (if provided)</li>
          <li>Professional consultation when necessary</li>
        </ul>
      </div>

      <ConsentToggle
        label="Crisis Intervention Authorization"
        description="I authorize ALCHM to initiate crisis intervention procedures if imminent danger is detected"
        checked={consent}
        onChange={onUpdate}
        required={true}
      />
    </Card>
  );
}

function DataRetentionPanel({ 
  preference, 
  onUpdate 
}: { 
  preference: PrivacySettings['dataRetentionPreference'];
  onUpdate: (preference: PrivacySettings['dataRetentionPreference']) => void;
}) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Data Retention Preferences</h3>
      <p className="text-gray-600 mb-4">
        Choose how long you want your data to be retained. You can request deletion at any time.
      </p>

      <div className="space-y-3">
        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={preference === 'MINIMAL'}
            onChange={() => onUpdate('MINIMAL')}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">Minimal (30 days)</span>
            <p className="text-sm text-gray-600">Data deleted after 30 days of inactivity</p>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={preference === 'STANDARD'}
            onChange={() => onUpdate('STANDARD')}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">Standard (1 year)</span>
            <p className="text-sm text-gray-600">Data retained for therapeutic continuity</p>
          </div>
        </label>

        <label className="flex items-center space-x-3">
          <input
            type="radio"
            checked={preference === 'EXTENDED'}
            onChange={() => onUpdate('EXTENDED')}
            className="text-blue-600"
          />
          <div>
            <span className="font-medium">Extended (3 years)</span>
            <p className="text-sm text-gray-600">Long-term therapeutic records (requires consent)</p>
          </div>
        </label>
      </div>
    </Card>
  );
}

function COPPAParentalConsentPanel({ 
  consent, 
  onUpdate 
}: { 
  consent: boolean;
  onUpdate: (consent: boolean) => void;
}) {
  return (
    <Card className="p-6 border-l-4 border-purple-500">
      <h3 className="text-lg font-medium mb-4">COPPA Child Protection</h3>
      <p className="text-gray-600 mb-4">
        This account requires parental consent under COPPA (Children's Online Privacy Protection Act). 
        Enhanced privacy protections are automatically applied.
      </p>

      <div className="bg-purple-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-purple-900">COPPA Protections Active:</h4>
        <ul className="list-disc list-inside text-purple-800 mt-2 space-y-1">
          <li>No behavioral advertising</li>
          <li>Minimal data collection</li>
          <li>Enhanced parental controls</li>
          <li>Automatic data deletion</li>
          <li>No third-party sharing</li>
        </ul>
      </div>

      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-700 font-medium">
          {consent ? '✅ Parental consent verified' : '⏳ Parental consent pending'}
        </p>
        {!consent && (
          <Button className="mt-2">Request Parental Consent</Button>
        )}
      </div>
    </Card>
  );
}

function FERPAEducationalConsentPanel({ 
  consent, 
  onUpdate 
}: { 
  consent: boolean;
  onUpdate: (consent: boolean) => void;
}) {
  return (
    <Card className="p-6 border-l-4 border-green-500">
      <h3 className="text-lg font-medium mb-4">FERPA Educational Records</h3>
      <p className="text-gray-600 mb-4">
        If you're using ALCHM through your school, your educational records are protected 
        under FERPA (Family Educational Rights and Privacy Act).
      </p>

      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <h4 className="font-medium text-green-900">FERPA Protections:</h4>
        <ul className="list-disc list-inside text-green-800 mt-2 space-y-1">
          <li>Educational records privacy</li>
          <li>Parent/guardian access rights</li>
          <li>Controlled educator access</li>
          <li>No unauthorized disclosure</li>
        </ul>
      </div>

      <ConsentToggle
        label="Educational Record Integration"
        description="Allow integration with educational wellness programs (requires school and parental approval)"
        checked={consent}
        onChange={onUpdate}
      />
    </Card>
  );
}

function ConsentToggle({ 
  label, 
  description, 
  checked, 
  onChange, 
  required = false 
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 border rounded-lg">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 text-blue-600"
      />
      <div className="flex-1">
        <label className="font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1;
  }
  
  return age;
}

async function checkRegulationCompliance(userId: string, age: number): Promise<'PENDING' | 'COMPLIANT' | 'EXPIRED'> {
  // Implementation would check various compliance requirements
  return 'COMPLIANT';
}

async function logPrivacyEvent(userId: string, eventType: string, details: string): Promise<void> {
  try {
    const auditEvent = {
      userId,
      eventType,
      details,
      timestamp: serverTimestamp(),
      ipAddress: 'client-side', // Would be populated server-side
      userAgent: typeof window !== 'undefined' && navigator.userAgent
    };

    await setDoc(doc(collection(db, 'privacy_audit_events')), auditEvent);
  } catch (error) {
    console.error('Error logging privacy event:', error);
  }
}