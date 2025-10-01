'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import EnhancedParentalConsentManager from './EnhancedParentalConsentManager';
import FERPAEducationalRecordsManager from './FERPAEducationalRecordsManager';
import GDPRDataSubjectRightsCenter from './GDPRDataSubjectRightsCenter';
import CCPACaliforniaPrivacyRights from './CCPACaliforniaPrivacyRights';
import { DataSubjectRightsManager } from './DataSubjectRightsManager';

interface UniversalPrivacyRightsCenterProps {
  userId: string;
}

interface UserPrivacyProfile {
  userId: string;
  age: number;
  location: {
    country: string;
    state?: string;
    region?: string;
    isEUResident: boolean;
    isCaliforniaResident: boolean;
  };
  userRole: 'student' | 'educator' | 'parent' | 'school_official' | 'researcher' | 'general';
  educationalContext?: {
    schoolDistrict?: string;
    institution?: string;
    gradeLevel?: string;
    isMinor?: boolean;
  };
  applicableRegulations: Array<'COPPA' | 'FERPA' | 'GDPR' | 'CCPA'>;
  parentalConsentRequired: boolean;
  lastUpdated: string;
  complianceStatus: {
    coppa: 'compliant' | 'required' | 'pending' | 'violation';
    ferpa: 'compliant' | 'needs_review' | 'violation' | 'not_applicable';
    gdpr: 'compliant' | 'pending' | 'violation' | 'not_applicable';
    ccpa: 'compliant' | 'pending' | 'violation' | 'not_applicable';
    overall: 'compliant' | 'pending' | 'violation';
  };
}

export default function UniversalPrivacyRightsCenter({ userId }: UniversalPrivacyRightsCenterProps) {
  const [privacyProfile, setPrivacyProfile] = useState<UserPrivacyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'coppa' | 'ferpa' | 'gdpr' | 'ccpa' | 'settings'>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.currentUser) {
      loadUserPrivacyProfile();
    }
  }, [userId]);

  const loadUserPrivacyProfile = async () => {
    try {
      setLoading(true);
      const profileRef = doc(db, 'user_privacy_profiles', userId);
      const profileDoc = await getDoc(profileRef);

      if (profileDoc.exists()) {
        const profile = profileDoc.data() as UserPrivacyProfile;
        setPrivacyProfile(profile);
      } else {
        // Create initial privacy profile
        const initialProfile = await createInitialPrivacyProfile();
        setPrivacyProfile(initialProfile);
      }
    } catch (err) {
      console.error('Error loading privacy profile:', err);
      setError('Failed to load privacy profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createInitialPrivacyProfile = async (): Promise<UserPrivacyProfile> => {
    // This would typically gather information from user registration, geolocation, etc.
    const initialProfile: UserPrivacyProfile = {
      userId,
      age: 18, // Default adult age, should be gathered during onboarding
      location: {
        country: 'US', // Default, should be detected via geolocation
        state: 'CA', // Default, should be detected
        region: 'North America',
        isEUResident: false,
        isCaliforniaResident: true // Default for demo
      },
      userRole: 'general',
      applicableRegulations: ['CCPA'], // Will be determined based on location and context
      parentalConsentRequired: false,
      lastUpdated: new Date().toISOString(),
      complianceStatus: {
        coppa: 'compliant',
        ferpa: 'not_applicable',
        gdpr: 'not_applicable',
        ccpa: 'compliant',
        overall: 'compliant'
      }
    };

    // Determine applicable regulations
    initialProfile.applicableRegulations = determineApplicableRegulations(initialProfile);
    
    // Check if parental consent is required
    initialProfile.parentalConsentRequired = checkParentalConsentRequired(initialProfile);

    await setDoc(doc(db, 'user_privacy_profiles', userId), initialProfile);
    return initialProfile;
  };

  const determineApplicableRegulations = (profile: UserPrivacyProfile): Array<'COPPA' | 'FERPA' | 'GDPR' | 'CCPA'> => {
    const regulations: Array<'COPPA' | 'FERPA' | 'GDPR' | 'CCPA'> = [];

    // COPPA applies to users under 13, or enhanced protection for users under 18 in certain contexts
    if (profile.age < 13 || (profile.age < 18 && profile.educationalContext)) {
      regulations.push('COPPA');
    }

    // FERPA applies to users in educational contexts
    if (profile.userRole === 'student' || profile.userRole === 'educator' || profile.educationalContext) {
      regulations.push('FERPA');
    }

    // GDPR applies to EU residents
    if (profile.location.isEUResident) {
      regulations.push('GDPR');
    }

    // CCPA applies to California residents
    if (profile.location.isCaliforniaResident) {
      regulations.push('CCPA');
    }

    return regulations;
  };

  const checkParentalConsentRequired = (profile: UserPrivacyProfile): boolean => {
    // COPPA requires parental consent for users under 13
    if (profile.age < 13) return true;
    
    // Enhanced protection may require parental consent for users 13-17 in educational contexts
    if (profile.age < 18 && profile.educationalContext?.isMinor) return true;
    
    return false;
  };

  const updateComplianceStatus = (
    regulation: keyof UserPrivacyProfile['complianceStatus'], 
    status: UserPrivacyProfile['complianceStatus'][keyof UserPrivacyProfile['complianceStatus']]
  ) => {
    if (!privacyProfile || regulation === 'overall') return;

    const updatedStatus = {
      ...privacyProfile.complianceStatus,
      [regulation]: status
    };

    // Update overall status
    const statuses = [updatedStatus.coppa, updatedStatus.ferpa, updatedStatus.gdpr, updatedStatus.ccpa]
      .filter(s => s !== 'not_applicable');
    
    if (statuses.includes('violation')) {
      updatedStatus.overall = 'violation';
    } else if (statuses.includes('pending') || statuses.includes('required')) {
      updatedStatus.overall = 'pending';
    } else {
      updatedStatus.overall = 'compliant';
    }

    setPrivacyProfile(prev => prev ? { ...prev, complianceStatus: updatedStatus } : prev);
    
    // Update in database
    updateDoc(doc(db, 'user_privacy_profiles', userId), { 
      complianceStatus: updatedStatus,
      lastUpdated: new Date().toISOString()
    });
  };

  const updatePrivacyProfile = async (updates: Partial<UserPrivacyProfile>) => {
    if (!privacyProfile) return;

    try {
      const updatedProfile = {
        ...privacyProfile,
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      // Recalculate applicable regulations and consent requirements
      updatedProfile.applicableRegulations = determineApplicableRegulations(updatedProfile);
      updatedProfile.parentalConsentRequired = checkParentalConsentRequired(updatedProfile);

      await updateDoc(doc(db, 'user_privacy_profiles', userId), updatedProfile);
      setPrivacyProfile(updatedProfile);

    } catch (err) {
      console.error('Error updating privacy profile:', err);
      setError('Failed to update privacy profile.');
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-800 bg-green-100';
      case 'violation': return 'text-red-800 bg-red-100';
      case 'pending': case 'required': case 'needs_review': return 'text-yellow-800 bg-yellow-100';
      case 'not_applicable': return 'text-gray-800 bg-gray-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Privacy Rights Center</h2>
          <p className="text-gray-600">Initializing your comprehensive privacy protection system...</p>
        </div>
      </div>
    );
  }

  if (!privacyProfile) {
    return (
      <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200">
        <div className="text-center">
          <span className="text-6xl block mb-4">⚠️</span>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Privacy Profile Error</h2>
          <p className="text-red-700 mb-4">Unable to load your privacy profile.</p>
          <button
            onClick={loadUserPrivacyProfile}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-4xl">🛡️</span>
          <div>
            <h1 className="text-3xl font-bold mb-2">Universal Privacy Rights Center</h1>
            <p className="text-blue-100">
              Comprehensive privacy protection under COPPA, FERPA, GDPR, and CCPA regulations
            </p>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold">Overall Compliance Status</h3>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              privacyProfile.complianceStatus.overall === 'compliant' ? 'bg-green-500 text-white' :
              privacyProfile.complianceStatus.overall === 'violation' ? 'bg-red-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              {privacyProfile.complianceStatus.overall.toUpperCase()}
            </span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            {privacyProfile.applicableRegulations.includes('COPPA') && (
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${getComplianceColor(privacyProfile.complianceStatus.coppa)}`}>
                  COPPA
                </div>
                <div className="text-sm text-blue-100 capitalize">
                  {privacyProfile.complianceStatus.coppa}
                </div>
              </div>
            )}
            {privacyProfile.applicableRegulations.includes('FERPA') && (
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${getComplianceColor(privacyProfile.complianceStatus.ferpa)}`}>
                  FERPA
                </div>
                <div className="text-sm text-blue-100 capitalize">
                  {privacyProfile.complianceStatus.ferpa}
                </div>
              </div>
            )}
            {privacyProfile.applicableRegulations.includes('GDPR') && (
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${getComplianceColor(privacyProfile.complianceStatus.gdpr)}`}>
                  GDPR
                </div>
                <div className="text-sm text-blue-100 capitalize">
                  {privacyProfile.complianceStatus.gdpr}
                </div>
              </div>
            )}
            {privacyProfile.applicableRegulations.includes('CCPA') && (
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${getComplianceColor(privacyProfile.complianceStatus.ccpa)}`}>
                  CCPA
                </div>
                <div className="text-sm text-blue-100 capitalize">
                  {privacyProfile.complianceStatus.ccpa}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            📊 Overview
          </button>
          
          {privacyProfile.applicableRegulations.includes('COPPA') && (
            <button
              onClick={() => setActiveTab('coppa')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'coppa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              👨‍👩‍👧‍👦 COPPA
            </button>
          )}
          
          {privacyProfile.applicableRegulations.includes('FERPA') && (
            <button
              onClick={() => setActiveTab('ferpa')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'ferpa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              🎓 FERPA
            </button>
          )}
          
          {privacyProfile.applicableRegulations.includes('GDPR') && (
            <button
              onClick={() => setActiveTab('gdpr')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'gdpr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              🇪🇺 GDPR
            </button>
          )}
          
          {privacyProfile.applicableRegulations.includes('CCPA') && (
            <button
              onClick={() => setActiveTab('ccpa')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'ccpa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              🐻 CCPA
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-screen">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* User Privacy Profile Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>👤</span>
                Your Privacy Profile
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Personal Information</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Age:</strong> {privacyProfile.age} years</p>
                    <p><strong>Location:</strong> {privacyProfile.location.country}</p>
                    <p><strong>Role:</strong> {privacyProfile.userRole.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Parental Consent Required:</strong> {privacyProfile.parentalConsentRequired ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Applicable Regulations</h3>
                  <div className="flex flex-wrap gap-2">
                    {privacyProfile.applicableRegulations.map(reg => (
                      <span key={reg} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {reg}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(privacyProfile.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Universal Data Rights */}
            <DataSubjectRightsManager 
              userAgeStatus={privacyProfile.age < 18 ? 'teen' : 'adult'}
              onRightsExercised={(action, success) => {
                console.log(`Rights action ${action}: ${success ? 'success' : 'failed'}`);
              }}
            />
          </div>
        )}

        {activeTab === 'coppa' && privacyProfile.applicableRegulations.includes('COPPA') && (
          <EnhancedParentalConsentManager
            userId={userId}
            userAge={privacyProfile.age}
            onConsentStatusChange={(status) => {
              updateComplianceStatus('coppa', status === 'verified' ? 'compliant' : 
                                             status === 'required' ? 'required' : 'pending');
            }}
          />
        )}

        {activeTab === 'ferpa' && privacyProfile.applicableRegulations.includes('FERPA') && (
          <FERPAEducationalRecordsManager
            userId={userId}
            userRole={privacyProfile.userRole}
            educationalContext={{
              schoolDistrict: privacyProfile.educationalContext?.schoolDistrict,
              institution: privacyProfile.educationalContext?.institution,
              gradeLevel: privacyProfile.educationalContext?.gradeLevel,
              isMinor: privacyProfile.age < 18
            }}
            onComplianceStatusChange={(status) => {
              updateComplianceStatus('ferpa', status);
            }}
          />
        )}

        {activeTab === 'gdpr' && privacyProfile.applicableRegulations.includes('GDPR') && (
          <GDPRDataSubjectRightsCenter
            userId={userId}
            userLocation={privacyProfile.location}
            onGDPRComplianceChange={(status) => {
              updateComplianceStatus('gdpr', status);
            }}
          />
        )}

        {activeTab === 'ccpa' && privacyProfile.applicableRegulations.includes('CCPA') && (
          <CCPACaliforniaPrivacyRights
            userId={userId}
            userLocation={privacyProfile.location}
            onCCPAComplianceChange={(status) => {
              updateComplianceStatus('ccpa', status);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚙️</span>
              Privacy Settings
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Location Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={privacyProfile.location.country}
                      onChange={(e) => updatePrivacyProfile({
                        location: { 
                          ...privacyProfile.location, 
                          country: e.target.value,
                          isEUResident: ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK'].includes(e.target.value),
                          isCaliforniaResident: e.target.value === 'US' && privacyProfile.location.state === 'CA'
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="AU">Australia</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  {privacyProfile.location.country === 'US' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <select
                        value={privacyProfile.location.state || ''}
                        onChange={(e) => updatePrivacyProfile({
                          location: { 
                            ...privacyProfile.location, 
                            state: e.target.value,
                            isCaliforniaResident: e.target.value === 'CA'
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select State</option>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Role Information</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <select
                    value={privacyProfile.userRole}
                    onChange={(e) => updatePrivacyProfile({
                      userRole: e.target.value as UserPrivacyProfile['userRole']
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General User</option>
                    <option value="student">Student</option>
                    <option value="educator">Educator</option>
                    <option value="parent">Parent/Guardian</option>
                    <option value="researcher">Researcher</option>
                  </select>
                </div>
              </div>

              {(privacyProfile.userRole === 'student' || privacyProfile.userRole === 'educator') && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">Educational Context</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={privacyProfile.educationalContext?.institution || ''}
                        onChange={(e) => updatePrivacyProfile({
                          educationalContext: {
                            ...privacyProfile.educationalContext,
                            institution: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="School or Institution Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                      <select
                        value={privacyProfile.educationalContext?.gradeLevel || ''}
                        onChange={(e) => updatePrivacyProfile({
                          educationalContext: {
                            ...privacyProfile.educationalContext,
                            gradeLevel: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Grade Level</option>
                        <option value="elementary">Elementary (K-5)</option>
                        <option value="middle">Middle School (6-8)</option>
                        <option value="high">High School (9-12)</option>
                        <option value="college">College</option>
                        <option value="graduate">Graduate School</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">Privacy Protection Summary</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Regulations Applied:</strong> {privacyProfile.applicableRegulations.join(', ')}</p>
                  <p><strong>Enhanced Protection:</strong> {privacyProfile.age < 18 ? 'Yes (Minor)' : 'No'}</p>
                  <p><strong>Data Retention:</strong> {privacyProfile.age < 18 ? '12 months' : '24 months'} default</p>
                  <p><strong>Parental Rights:</strong> {privacyProfile.parentalConsentRequired ? 'Required' : 'Not applicable'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-800">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm underline mt-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}