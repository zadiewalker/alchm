/**
 * ALCHM Culturally Responsive Onboarding
 * 
 * Philosophy: "Every person brings wisdom traditions. Every identity deserves affirmation.
 * Onboarding should feel like coming home to yourself, not conforming to our expectations."
 * 
 * This onboarding system:
 * - Centers cultural identity and healing traditions
 * - Assesses safety needs for marginalized youth
 * - Offers culturally-specific pathways and resources
 * - Provides trauma-informed, intersectional intake
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/useAuth';
import { setupVulnerableYouthProtection } from '@/lib/marginalized-youth-privacy';
import { culturalPromptsEngine } from '@/lib/cultural-prompts-engine';
import { getCulturalEmergencyContacts } from '@/lib/cultural-crisis-resources';

interface CulturalOnboardingData {
  // Identity and Cultural Background
  culturalIdentities: string[];
  languagePreferences: string[];
  healingTraditions: string[];
  
  // Intersectional Identities
  lgbtqIdentity?: boolean;
  neurodivergent?: boolean;
  disabilityStatus?: string;
  immigrationStatus?: 'documented' | 'undocumented' | 'mixed_status' | 'prefer_not_to_say';
  
  // Safety Assessment
  safetyNeeds: {
    familyAcceptance: 'supportive' | 'mixed' | 'rejecting' | 'unknown';
    schoolSafety: 'safe' | 'mixed' | 'unsafe' | 'not_applicable';
    communitySafety: 'safe' | 'mixed' | 'unsafe' | 'unknown';
    economicStability: 'stable' | 'unstable' | 'crisis';
    mentalHealthStigma: boolean;
    needsPseudonym: boolean;
    needsExtraPrivacy: boolean;
  };
  
  // Healing Preferences
  healingApproaches: string[];
  preferredTone: 'gentle' | 'direct' | 'encouraging' | 'validating';
  celebrationStyle: 'subtle' | 'warm' | 'joyful';
  
  // Support Preferences
  prefersCulturallyMatchedSupport: boolean;
  interestedInCommunity: boolean;
  preferredCrisisSupport: 'hotline' | 'text' | 'chat' | 'peer_support' | 'community_based';
}

interface OnboardingStepProps {
  data: Partial<CulturalOnboardingData>;
  onUpdate: (updates: Partial<CulturalOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

// Step 1: Cultural Identity and Background
function CulturalIdentityStep({ data, onUpdate, onNext, isFirst }: OnboardingStepProps) {
  const [selectedIdentities, setSelectedIdentities] = useState<string[]>(data.culturalIdentities || []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(data.languagePreferences || []);
  
  const culturalOptions = [
    { id: 'black', label: 'Black/African American', emoji: '🖤' },
    { id: 'indigenous', label: 'Indigenous/Native American', emoji: '🪶' },
    { id: 'latinx', label: 'Latinx/Hispanic', emoji: '🌮' },
    { id: 'asian', label: 'Asian/Asian American', emoji: '🏮' },
    { id: 'middle_eastern', label: 'Middle Eastern/North African', emoji: '🕌' },
    { id: 'white', label: 'White/European American', emoji: '🤍' },
    { id: 'multiracial', label: 'Multiracial/Mixed', emoji: '🌈' },
    { id: 'immigrant', label: 'Immigrant/Refugee', emoji: '🌍' },
    { id: 'first_generation', label: 'First-generation American', emoji: '🗽' },
    { id: 'prefer_not_to_say', label: 'Prefer not to share', emoji: '🤐' }
  ];
  
  const languageOptions = [
    'English', 'Spanish', 'Mandarin', 'Arabic', 'French', 'Portuguese', 'Korean', 
    'Vietnamese', 'Hindi', 'Tagalog', 'Somali', 'Russian', 'Other'
  ];
  
  const handleNext = () => {
    onUpdate({ 
      culturalIdentities: selectedIdentities,
      languagePreferences: selectedLanguages 
    });
    onNext();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-4">Welcome to Your Healing Journey</h2>
          <p className="text-gray-600">
            We want to honor all the identities and wisdom traditions you bring. 
            This helps us create a space that truly feels like home for you.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">How do you identify culturally?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Select all that feel true for you. Your identities are complex and beautiful.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {culturalOptions.map(option => (
              <button
                key={option.id}
                onClick={() => {
                  if (selectedIdentities.includes(option.id)) {
                    setSelectedIdentities(prev => prev.filter(id => id !== option.id));
                  } else {
                    setSelectedIdentities(prev => [...prev, option.id]);
                  }
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${
                  selectedIdentities.includes(option.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">What languages do you speak?</h3>
          <p className="text-sm text-gray-500 mb-6">
            We believe healing can happen in any language. Select all that you're comfortable with.
          </p>
          
          <div className="grid grid-cols-3 gap-2">
            {languageOptions.map(language => (
              <button
                key={language}
                onClick={() => {
                  if (selectedLanguages.includes(language)) {
                    setSelectedLanguages(prev => prev.filter(lang => lang !== language));
                  } else {
                    setSelectedLanguages(prev => [...prev, language]);
                  }
                }}
                className={`p-3 rounded-lg text-sm transition-all ${
                  selectedLanguages.includes(language)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleNext} className="px-8">
            Continue
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Step 2: Intersectional Identity Assessment
function IntersectionalIdentityStep({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [identityData, setIdentityData] = useState({
    lgbtqIdentity: data.lgbtqIdentity || false,
    neurodivergent: data.neurodivergent || false,
    immigrationStatus: data.immigrationStatus || 'prefer_not_to_say'
  });
  
  const handleNext = () => {
    onUpdate(identityData);
    onNext();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-4">Your Full Self</h2>
          <p className="text-gray-600">
            We know identity is complex. This helps us provide support that honors all parts of who you are.
            You can skip any question that doesn't feel safe or relevant.
          </p>
        </div>
        
        {/* LGBTQ+ Identity */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Sexual Orientation & Gender Identity</h3>
          <p className="text-sm text-gray-500 mb-4">
            This helps us connect you with affirming resources and support.
          </p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={identityData.lgbtqIdentity}
                onChange={(e) => setIdentityData(prev => ({ ...prev, lgbtqIdentity: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <div>
                <div className="font-medium">I identify as LGBTQ+</div>
                <div className="text-sm text-gray-500">This includes lesbian, gay, bisexual, transgender, queer, questioning, and other identities</div>
              </div>
            </label>
          </div>
        </div>
        
        {/* Neurodivergence */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Neurodivergence</h3>
          <p className="text-sm text-gray-500 mb-4">
            Different brains need different support. We celebrate neurodiversity.
          </p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={identityData.neurodivergent}
                onChange={(e) => setIdentityData(prev => ({ ...prev, neurodivergent: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <div>
                <div className="font-medium">I identify as neurodivergent</div>
                <div className="text-sm text-gray-500">This includes ADHD, autism, dyslexia, and other neurological differences</div>
              </div>
            </label>
          </div>
        </div>
        
        {/* Immigration Status */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Immigration Status</h3>
          <p className="text-sm text-gray-500 mb-4">
            This helps us connect you with safe, appropriate resources. Your information is always encrypted.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'documented', label: 'I have legal documentation/citizenship' },
              { value: 'undocumented', label: 'I am undocumented' },
              { value: 'mixed_status', label: 'My family has mixed immigration status' },
              { value: 'prefer_not_to_say', label: 'I prefer not to share this information' }
            ].map(option => (
              <label key={option.value} className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="immigration_status"
                  value={option.value}
                  checked={identityData.immigrationStatus === option.value}
                  onChange={(e) => setIdentityData(prev => ({ ...prev, immigrationStatus: e.target.value as any }))}
                  className="rounded border-gray-300"
                />
                <div className="font-medium">{option.label}</div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext} className="px-8">
            Continue
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Step 3: Safety Assessment
function SafetyAssessmentStep({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [safetyData, setSafetyData] = useState(data.safetyNeeds || {
    familyAcceptance: 'unknown' as const,
    schoolSafety: 'not_applicable' as const,
    communitySafety: 'unknown' as const,
    economicStability: 'stable' as const,
    mentalHealthStigma: false,
    needsPseudonym: false,
    needsExtraPrivacy: false
  });
  
  const handleNext = () => {
    onUpdate({ safetyNeeds: safetyData });
    onNext();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-4">Your Safety Matters</h2>
          <p className="text-gray-600">
            We want to make sure ALCHM feels completely safe for you. 
            These questions help us customize your privacy settings and support.
          </p>
        </div>
        
        {/* Family Acceptance */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">How accepting is your family of your identity and mental health needs?</h3>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { value: 'supportive', label: '🤗 Very supportive - they celebrate who I am', color: 'green' },
              { value: 'mixed', label: '🤔 Mixed - some supportive, some not', color: 'yellow' },
              { value: 'rejecting', label: '❌ Not supportive - they reject parts of who I am', color: 'red' },
              { value: 'unknown', label: '🤷 I\'m not sure or prefer not to answer', color: 'gray' }
            ].map(option => (
              <label key={option.value} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                safetyData.familyAcceptance === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="family_acceptance"
                  value={option.value}
                  checked={safetyData.familyAcceptance === option.value}
                  onChange={(e) => setSafetyData(prev => ({ ...prev, familyAcceptance: e.target.value as any }))}
                  className="rounded border-gray-300"
                />
                <div className="font-medium">{option.label}</div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Additional Safety Needs */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Privacy & Safety Preferences</h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyData.mentalHealthStigma}
                onChange={(e) => setSafetyData(prev => ({ ...prev, mentalHealthStigma: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <div>
                <div className="font-medium">My culture/community has stigma around mental health</div>
                <div className="text-sm text-gray-500">We'll provide culturally sensitive support and resources</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyData.needsPseudonym}
                onChange={(e) => setSafetyData(prev => ({ ...prev, needsPseudonym: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <div>
                <div className="font-medium">I'd prefer to use a pseudonym instead of my real name</div>
                <div className="text-sm text-gray-500">We can generate a meaningful name that feels right for you</div>
              </div>
            </label>
            
            <label className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={safetyData.needsExtraPrivacy}
                onChange={(e) => setSafetyData(prev => ({ ...prev, needsExtraPrivacy: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <div>
                <div className="font-medium">I need extra privacy protection for my data</div>
                <div className="text-sm text-gray-500">We'll use enhanced encryption and additional security measures</div>
              </div>
            </label>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext} className="px-8">
            Continue
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Step 4: Healing Preferences
function HealingPreferencesStep({ data, onUpdate, onNext, onBack, isLast }: OnboardingStepProps) {
  const [preferences, setPreferences] = useState({
    healingApproaches: data.healingApproaches || [],
    preferredTone: data.preferredTone || 'gentle' as const,
    celebrationStyle: data.celebrationStyle || 'warm' as const,
    prefersCulturallyMatchedSupport: data.prefersCulturallyMatchedSupport ?? true,
    interestedInCommunity: data.interestedInCommunity ?? true,
    preferredCrisisSupport: data.preferredCrisisSupport || 'text' as const
  });
  
  const healingOptions = [
    { id: 'community_centered', label: 'Community & relationship-based healing', emoji: '🤝' },
    { id: 'somatic_body_based', label: 'Body-based practices (movement, breathwork)', emoji: '🧘‍♀️' },
    { id: 'ritual_ceremonial', label: 'Ritual and ceremonial practices', emoji: '🕯️' },
    { id: 'storytelling_narrative', label: 'Storytelling and narrative healing', emoji: '📖' },
    { id: 'creative_expression', label: 'Creative and artistic expression', emoji: '🎨' },
    { id: 'nature_land_based', label: 'Nature and land-based healing', emoji: '🌿' },
    { id: 'spiritual_prayer', label: 'Spiritual practices and prayer', emoji: '🙏' },
    { id: 'analytical_cognitive', label: 'Analytical and cognitive approaches', emoji: '🧠' }
  ];
  
  const handleNext = async () => {
    onUpdate(preferences);
    onNext();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium mb-4">Your Healing Style</h2>
          <p className="text-gray-600">
            There are many paths to healing. Let's find the ones that resonate with your soul.
          </p>
        </div>
        
        {/* Healing Approaches */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">What approaches to healing feel right for you?</h3>
          <p className="text-sm text-gray-500 mb-6">Select all that speak to you</p>
          
          <div className="grid grid-cols-1 gap-3">
            {healingOptions.map(option => (
              <label key={option.id} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                preferences.healingApproaches.includes(option.id)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  checked={preferences.healingApproaches.includes(option.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPreferences(prev => ({ 
                        ...prev, 
                        healingApproaches: [...prev.healingApproaches, option.id] 
                      }));
                    } else {
                      setPreferences(prev => ({
                        ...prev,
                        healingApproaches: prev.healingApproaches.filter(id => id !== option.id)
                      }));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span className="text-2xl">{option.emoji}</span>
                <div className="font-medium">{option.label}</div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Communication Preferences */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">How do you prefer to receive support?</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tone of AI responses</label>
              <select 
                value={preferences.preferredTone}
                onChange={(e) => setPreferences(prev => ({ ...prev, preferredTone: e.target.value as any }))}
                className="w-full p-3 border rounded-lg"
              >
                <option value="gentle">Gentle and soothing</option>
                <option value="direct">Direct and straightforward</option>
                <option value="encouraging">Encouraging and uplifting</option>
                <option value="validating">Validating and understanding</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Celebration style</label>
              <select 
                value={preferences.celebrationStyle}
                onChange={(e) => setPreferences(prev => ({ ...prev, celebrationStyle: e.target.value as any }))}
                className="w-full p-3 border rounded-lg"
              >
                <option value="subtle">Subtle acknowledgments</option>
                <option value="warm">Warm celebrations</option>
                <option value="joyful">Joyful and enthusiastic</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleNext} className="px-8">
            {isLast ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

// Main Culturally Responsive Onboarding Component
export default function CulturallyResponsiveOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<Partial<CulturalOnboardingData>>({});
  const [isCompleting, setIsCompleting] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  
  const steps = [
    CulturalIdentityStep,
    IntersectionalIdentityStep,
    SafetyAssessmentStep,
    HealingPreferencesStep
  ];
  
  const CurrentStepComponent = steps[currentStep];
  
  const handleUpdate = (updates: Partial<CulturalOnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };
  
  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Complete onboarding
      await completeOnboarding();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const completeOnboarding = async () => {
    if (!user?.uid || isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      // Setup enhanced privacy for vulnerable youth
      if (onboardingData.safetyNeeds?.needsExtraPrivacy || 
          onboardingData.safetyNeeds?.familyAcceptance === 'rejecting' ||
          onboardingData.lgbtqIdentity ||
          onboardingData.immigrationStatus === 'undocumented') {
        
        await setupVulnerableYouthProtection(user.uid, {
          identityRejectionRisk: onboardingData.safetyNeeds?.familyAcceptance === 'rejecting' || false,
          familyUnsafe: onboardingData.safetyNeeds?.familyAcceptance === 'rejecting' || false,
          immigrationConcerns: onboardingData.immigrationStatus === 'undocumented' || onboardingData.immigrationStatus === 'mixed_status',
          economicallyVulnerable: onboardingData.safetyNeeds?.economicStability === 'unstable' || onboardingData.safetyNeeds?.economicStability === 'crisis',
          mentalHealthStigma: onboardingData.safetyNeeds?.mentalHealthStigma || false,
          culturalBackground: onboardingData.culturalIdentities || []
        });
      }
      
      // Store onboarding data in Firestore
      const { doc, setDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      await setDoc(doc(db, 'users', user.uid, 'profile', 'onboarding'), {
        ...onboardingData,
        completedAt: new Date(),
        version: '2.0' // Cultural responsiveness version
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Handle error gracefully
    } finally {
      setIsCompleting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      {/* Progress indicator */}
      <div className="max-w-2xl mx-auto mb-8 px-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <CurrentStepComponent
          key={currentStep}
          data={onboardingData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onBack={handleBack}
          isFirst={currentStep === 0}
          isLast={currentStep === steps.length - 1}
        />
      </AnimatePresence>
      
      {isCompleting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium">Setting up your personalized healing space...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment.</p>
          </Card>
        </div>
      )}
    </div>
  );
}
