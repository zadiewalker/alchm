'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  FileText, 
  Database, 
  Users, 
  BarChart3, 
  Mail, 
  Globe, 
  Download,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface ConsentOption {
  id: string;
  title: string;
  description: string;
  legalBasis: 'consent' | 'legitimate_interest' | 'legal_obligation' | 'contract';
  required: boolean;
  category: 'essential' | 'analytics' | 'marketing' | 'personalization';
  icon: React.ComponentType<any>;
  enabled: boolean;
  details: string[];
  dataTypes: string[];
  retentionPeriod: string;
  thirdParties: string[];
}

interface PrivacyConsentFlowProps {
  ageGroup: 'under13' | 'teen' | 'adult';
  requiresParentalConsent: boolean;
  onConsentComplete: (consents: Record<string, boolean>, consentId: string) => void;
  onBack: () => void;
}

interface ConsentState {
  step: 'overview' | 'essential' | 'optional' | 'rights' | 'review';
  consents: Record<string, boolean>;
  consentVersion: string;
  timestamp: number;
  userAgent: string;
  ipAddress?: string; // Will be logged server-side for audit
}

export default function PrivacyConsentFlow({ 
  ageGroup, 
  requiresParentalConsent, 
  onConsentComplete, 
  onBack 
}: PrivacyConsentFlowProps) {
  const [state, setState] = useState<ConsentState>({
    step: 'overview',
    consents: {},
    consentVersion: '1.0.0',
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : ''
  });

  // GDPR Article 7 compliant consent options
  const consentOptions: ConsentOption[] = [
    {
      id: 'essential_functionality',
      title: 'Essential Platform Functionality',
      description: 'Core features needed for ALCHM to work including secure journaling and crisis support.',
      legalBasis: 'contract',
      required: true,
      category: 'essential',
      icon: Shield,
      enabled: true,
      details: [
        'User authentication and account management',
        'Secure journal entry storage and retrieval',
        'Crisis detection and safety interventions',
        'Basic platform functionality and navigation'
      ],
      dataTypes: ['Account information', 'Journal entries', 'Session data', 'Safety interactions'],
      retentionPeriod: 'Account lifetime + 30 days',
      thirdParties: ['Firebase (Google Cloud)', 'Stripe (payment processing)']
    },
    {
      id: 'enhanced_ai_features',
      title: 'AI-Powered Insights and Khepera Integration',
      description: 'Advanced AI features for personalized insights, emotional pattern recognition, and guided reflections.',
      legalBasis: 'consent',
      required: false,
      category: 'personalization',
      icon: BarChart3,
      enabled: false,
      details: [
        'Emotional pattern analysis and insights',
        'Personalized reflection prompts and guidance',
        'AI-powered wellness recommendations',
        'Khepera transformation tracking and support'
      ],
      dataTypes: ['Journal content analysis', 'Emotional patterns', 'User preferences', 'AI interaction history'],
      retentionPeriod: '2 years or until consent withdrawn',
      thirdParties: ['OpenAI (AI processing)', 'Anthropic (AI processing)']
    },
    {
      id: 'platform_analytics',
      title: 'Platform Improvement Analytics',
      description: 'Anonymous usage analytics to improve platform performance and user experience.',
      legalBasis: 'legitimate_interest',
      required: false,
      category: 'analytics',
      icon: Database,
      enabled: ageGroup === 'adult', // Default to false for minors
      details: [
        'Anonymous usage patterns and feature adoption',
        'Performance metrics and error tracking',
        'Platform optimization and bug detection',
        'Aggregated wellness trend analysis (fully anonymized)'
      ],
      dataTypes: ['Anonymized usage data', 'Performance metrics', 'Error logs', 'Feature engagement'],
      retentionPeriod: '18 months (anonymized after 6 months)',
      thirdParties: ['Firebase Analytics', 'Sentry (error tracking)']
    },
    {
      id: 'safety_communications',
      title: 'Safety and Wellness Communications',
      description: 'Important communications about safety features, wellness resources, and platform updates.',
      legalBasis: 'legitimate_interest',
      required: true,
      category: 'essential',
      icon: Mail,
      enabled: true,
      details: [
        'Critical safety feature updates and notifications',
        'Wellness resource recommendations and crisis support',
        'Platform security and privacy policy updates',
        'Account security notifications'
      ],
      dataTypes: ['Email address', 'Communication preferences', 'Safety interaction history'],
      retentionPeriod: 'Account lifetime + 1 year',
      thirdParties: ['SendGrid (email delivery)', 'Firebase Cloud Messaging']
    },
    {
      id: 'research_participation',
      title: 'Anonymous Research Participation',
      description: 'Contribute anonymized data to mental health and trauma-informed care research.',
      legalBasis: 'consent',
      required: false,
      category: 'analytics',
      icon: Globe,
      enabled: false,
      details: [
        'Fully anonymized mental health outcome research',
        'Trauma-informed care effectiveness studies',
        'Youth mental health support system research',
        'Crisis intervention improvement research'
      ],
      dataTypes: ['Anonymized wellness patterns', 'De-identified crisis interactions', 'General demographic categories'],
      retentionPeriod: 'Indefinite (fully anonymized)',
      thirdParties: ['Research institutions (anonymized data only)']
    }
  ];

  useEffect(() => {
    // Initialize consent state based on age group and requirements
    const initialConsents: Record<string, boolean> = {};
    
    consentOptions.forEach(option => {
      if (option.required) {
        initialConsents[option.id] = true;
      } else {
        // Conservative defaults for minors
        if (ageGroup === 'under13') {
          initialConsents[option.id] = false;
        } else if (ageGroup === 'teen') {
          initialConsents[option.id] = option.category === 'essential';
        } else {
          initialConsents[option.id] = option.enabled;
        }
      }
    });

    setState(prev => ({ ...prev, consents: initialConsents }));
  }, [ageGroup]);

  const updateConsent = (optionId: string, enabled: boolean) => {
    setState(prev => ({
      ...prev,
      consents: {
        ...prev.consents,
        [optionId]: enabled
      }
    }));
  };

  const getStepTitle = () => {
    switch (state.step) {
      case 'overview': return 'Privacy & Data Protection';
      case 'essential': return 'Essential Platform Features';
      case 'optional': return 'Optional Features & Analytics';
      case 'rights': return 'Your Privacy Rights';
      case 'review': return 'Review Your Choices';
      default: return 'Privacy Consent';
    }
  };

  const handleComplete = () => {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Log consent for audit trail
    console.log('[PRIVACY_CONSENT]', {
      consentId,
      ageGroup,
      requiresParentalConsent,
      consents: state.consents,
      consentVersion: state.consentVersion,
      timestamp: new Date().toISOString(),
      userAgent: state.userAgent
    });

    onConsentComplete(state.consents, consentId);
  };

  if (state.step === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <Shield className="w-20 h-20 text-purple-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{getStepTitle()}</h1>
            <p className="text-gray-600 text-lg">
              Your privacy and safety are our highest priorities. Let's set up your data protection preferences.
            </p>
          </div>

          {requiresParentalConsent && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-900">Parental Consent Required</p>
                  <p className="text-amber-800 text-sm">
                    {ageGroup === 'under13' 
                      ? 'As a user under 13, COPPA law requires verified parental consent before using ALCHM.'
                      : 'As a teen user, enhanced privacy protections apply and parental awareness is required.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                What We Protect
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Your journal entries are encrypted and private</li>
                <li>• Crisis support data is protected and confidential</li>
                <li>• Minimal data collection with purpose limitation</li>
                <li>• No sale of personal information to third parties</li>
                <li>• Transparent AI processing with user control</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                Your Rights
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Access and download your data anytime</li>
                <li>• Delete your account and data completely</li>
                <li>• Withdraw consent for optional features</li>
                <li>• Update privacy preferences easily</li>
                <li>• Contact our Data Protection Officer</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'essential' }))} 
              className="w-full text-lg py-3"
            >
              Continue to Privacy Setup
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onBack} 
                className="flex-1"
              >
                Back to Age Verification
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.open('/privacy-policy.html', '_blank')} 
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Read Privacy Policy
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'essential') {
    const essentialOptions = consentOptions.filter(opt => opt.category === 'essential');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">
              These essential features are required for ALCHM to function safely and securely.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {essentialOptions.map(option => {
              const IconComponent = option.icon;
              return (
                <div key={option.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                        <p className="text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="text-sm text-gray-500">
                          <p><strong>Legal Basis:</strong> {option.legalBasis.replace('_', ' ')}</p>
                          <p><strong>Data Retention:</strong> {option.retentionPeriod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-green-700 font-medium mr-3">Required</span>
                      <Switch checked={true} disabled={true} />
                    </div>
                  </div>
                  
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View details and data types
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-600">
                      <div>
                        <strong>Features:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {option.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Data Types:</strong> {option.dataTypes.join(', ')}
                      </div>
                      <div>
                        <strong>Third Parties:</strong> {option.thirdParties.join(', ')}
                      </div>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'optional' }))} 
              className="w-full"
            >
              Continue to Optional Features
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'overview' }))} 
              className="w-full"
            >
              Back to Overview
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'optional') {
    const optionalOptions = consentOptions.filter(opt => !opt.required);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">
              These optional features enhance your experience. You can change these settings anytime.
            </p>
          </div>

          {ageGroup !== 'adult' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900">Enhanced Protection Active</p>
                  <p className="text-yellow-800 text-sm">
                    {ageGroup === 'under13' 
                      ? 'COPPA protections: Limited data collection, no behavioral tracking, enhanced deletion rights.'
                      : 'Teen protections: Enhanced privacy controls, limited data sharing, stricter content moderation.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6 mb-8">
            {optionalOptions.map(option => {
              const IconComponent = option.icon;
              const isEnabled = state.consents[option.id] || false;
              
              return (
                <div key={option.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${isEnabled ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`w-6 h-6 ${isEnabled ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                        <p className="text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="text-sm text-gray-500">
                          <p><strong>Legal Basis:</strong> {option.legalBasis.replace('_', ' ')}</p>
                          <p><strong>Data Retention:</strong> {option.retentionPeriod}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 font-medium mr-3">
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <Switch 
                        checked={isEnabled} 
                        onCheckedChange={(checked) => updateConsent(option.id, checked)}
                      />
                    </div>
                  </div>
                  
                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                      View details and data types
                    </summary>
                    <div className="mt-3 space-y-2 text-gray-600">
                      <div>
                        <strong>Features:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          {option.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <strong>Data Types:</strong> {option.dataTypes.join(', ')}
                      </div>
                      <div>
                        <strong>Third Parties:</strong> {option.thirdParties.join(', ')}
                      </div>
                    </div>
                  </details>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'rights' }))} 
              className="w-full"
            >
              Continue to Your Rights
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'essential' }))} 
              className="w-full"
            >
              Back to Essential Features
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'rights') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">
              Understand your privacy rights and how to exercise them in ALCHM.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <Download className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Right to Data Portability</h3>
                  <p className="text-gray-600 text-sm">
                    Download all your data in a machine-readable format. Available in your account settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <Trash2 className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Right to Erasure</h3>
                  <p className="text-gray-600 text-sm">
                    Delete your account and all associated data permanently. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Right to Access</h3>
                  <p className="text-gray-600 text-sm">
                    Request a copy of all personal data we hold about you and how it's being processed.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Right to Withdraw Consent</h3>
                  <p className="text-gray-600 text-sm">
                    Change your privacy preferences anytime. Withdrawing consent doesn't affect past processing.
                  </p>
                </div>
              </div>
            </div>

            {(ageGroup === 'under13' || ageGroup === 'teen') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Enhanced Rights for Minors</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Priority processing for deletion requests</li>
                  <li>• Enhanced parental access and control rights</li>
                  <li>• Stricter data minimization and retention limits</li>
                  <li>• Additional safeguards for sensitive data</li>
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => setState(prev => ({ ...prev, step: 'review' }))} 
              className="w-full"
            >
              Review and Complete Setup
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'optional' }))} 
              className="w-full"
            >
              Back to Optional Features
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (state.step === 'review') {
    const enabledConsents = Object.entries(state.consents).filter(([_, enabled]) => enabled);
    const disabledConsents = Object.entries(state.consents).filter(([_, enabled]) => !enabled);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 shadow-lg">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h1>
            <p className="text-gray-600">
              Review your privacy preferences before completing setup.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-3">Enabled Features</h3>
              <div className="space-y-2">
                {enabledConsents.map(([consentId]) => {
                  const option = consentOptions.find(opt => opt.id === consentId);
                  if (!option) return null;
                  
                  return (
                    <div key={consentId} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-900 font-medium">{option.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {disabledConsents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Disabled Features</h3>
                <div className="space-y-2">
                  {disabledConsents.map(([consentId]) => {
                    const option = consentOptions.find(opt => opt.id === consentId);
                    if (!option || option.required) return null;
                    
                    return (
                      <div key={consentId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-5 h-5 rounded-full border-2 border-gray-400" />
                        <span className="text-gray-700">{option.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Consent Record</h3>
              <div className="text-blue-800 text-sm space-y-1">
                <p><strong>Consent Version:</strong> {state.consentVersion}</p>
                <p><strong>Age Group:</strong> {ageGroup}</p>
                <p><strong>Timestamp:</strong> {new Date(state.timestamp).toLocaleString()}</p>
                {requiresParentalConsent && (
                  <p><strong>Parental Consent:</strong> Required (will be processed next)</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleComplete} 
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {requiresParentalConsent ? 'Continue to Parental Consent' : 'Complete Privacy Setup'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setState(prev => ({ ...prev, step: 'optional' }))} 
              className="w-full"
            >
              Modify Choices
            </Button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              You can change these preferences anytime in your account settings. 
              This consent record will be securely stored for legal compliance.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}