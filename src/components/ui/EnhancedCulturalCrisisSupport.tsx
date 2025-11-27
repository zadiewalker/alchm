/**
 * Enhanced Cultural Crisis Support Component
 * Integrates culturally-specific resources and marginalized youth protections
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { culturalCrisisResourceManager } from '@/lib/cultural-crisis-resources';
import { marginalizedYouthPrivacyManager } from '@/lib/marginalized-youth-privacy';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisResource {
  name: string;
  contact: string;
  description: string;
  culturallySpecific?: boolean;
  safeForMarginalized?: boolean;
  available24h?: boolean;
  languages?: string[];
}

interface EnhancedCulturalCrisisSupportProps {
  isVisible: boolean;
  onContinueWriting: () => void;
  className?: string;
  urgencyLevel?: 'low' | 'moderate' | 'high' | 'critical';
}

export function EnhancedCulturalCrisisSupport({ 
  isVisible, 
  onContinueWriting, 
  className = "", 
  urgencyLevel = 'moderate' 
}: EnhancedCulturalCrisisSupportProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [culturalResources, setCulturalResources] = useState<CrisisResource[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showSafetyOptions, setShowSafetyOptions] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isVisible && user?.uid) {
      loadCulturalResources();
    }
  }, [isVisible, user?.uid]);

  const loadCulturalResources = async () => {
    if (!user?.uid) return;

    try {
      // Get user's vulnerability profile for safer resources
      const vulnerabilityProfile = await marginalizedYouthPrivacyManager.getVulnerabilityProfile(user.uid);
      
      // Get culturally appropriate crisis resources
      const resources = await culturalCrisisResourceManager.getCulturalCrisisResources({
        culturalBackground: vulnerabilityProfile?.culturalConsiderations.culturalBackgrounds || [],
        lgbtqIdentity: vulnerabilityProfile?.riskFactors.lgbtqRejectionRisk || false,
        immigrationStatus: vulnerabilityProfile?.riskFactors.immigrationRisk ? 'undocumented' : 'documented',
        country: 'United States',
        ageGroup: 'youth',
        urgencyLevel: urgencyLevel,
        safetyRequirements: {
          policeFree: vulnerabilityProfile?.riskFactors.racialTargetingRisk || false,
          familySecure: vulnerabilityProfile?.riskFactors.lgbtqRejectionRisk || false,
          undocumentedSafe: vulnerabilityProfile?.riskFactors.immigrationRisk || false
        }
      }, 5);

      setCulturalResources(resources.map(r => ({
        name: r.name,
        contact: r.contact,
        description: r.description,
        culturallySpecific: r.blackYouthSpecific || r.lgbtqAffirming || r.culturallyCompetent,
        safeForMarginalized: r.policeFree && r.familySecure && r.undocumentedSafe,
        available24h: r.available24h,
        languages: r.languages
      })));
      
      setUserProfile(vulnerabilityProfile);
    } catch (error) {
      console.error('Error loading cultural resources:', error);
      // Fallback to standard resources
      setCulturalResources(getUniversalCrisisResources());
    }
  };

  const getUniversalCrisisResources = (): CrisisResource[] => [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "988",
      description: "Free and confidential emotional support 24/7",
      available24h: true,
      languages: ['English', 'Spanish']
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      description: "Free 24/7 support via text message",
      available24h: true,
      languages: ['English', 'Spanish']
    }
  ];

  if (!isVisible) return null;

  const getCrisisMessage = () => {
    if (userProfile?.culturalConsiderations.culturalBackgrounds?.includes('black')) {
      return "We see you're going through something really hard right now. Your feelings are valid, and your life has immense value. There are people who understand your experience and want to help.";
    }
    
    if (userProfile?.riskFactors.lgbtqRejectionRisk) {
      return "We see you're struggling right now. Your identity is beautiful, and you deserve support from people who truly understand what you're going through. You are not alone.";
    }
    
    return "We see you're going through something really hard right now. Your feelings matter, and so do you.";
  };

  const handleEmergencyDelete = async () => {
    if (user?.uid) {
      const confirmed = window.confirm(
        "This will immediately and permanently delete all your ALCHM data. This cannot be undone. Are you sure?"
      );
      
      if (confirmed) {
        const phrase = window.prompt("Enter your emergency deletion phrase:");
        if (phrase) {
          const success = await marginalizedYouthPrivacyManager.emergencyDataDeletion(user.uid, phrase);
          if (success) {
            alert("Your data has been safely deleted. Please clear your browser history.");
            window.location.href = '/';
          } else {
            alert("Incorrect phrase or deletion failed. Please try again.");
          }
        }
      }
    }
  };

  return (
    <motion.div 
      className={`mb-6 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Main Crisis Support Card */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 text-lg">💜</span>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-800 text-sm leading-relaxed mb-4">
              {getCrisisMessage()}
            </p>
            
            {!isExpanded ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setIsExpanded(true)}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  Show support options
                </Button>
                <Button
                  onClick={onContinueWriting}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Keep writing - I'm okay for now
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 text-sm">
                  Here are support options chosen specifically for your background and needs:
                </p>
                
                {/* Cultural Crisis Resources */}
                <div className="grid gap-3">
                  {culturalResources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white rounded-lg border border-purple-200 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 flex items-center gap-2">
                            {resource.name}
                            {resource.culturallySpecific && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Culturally Specific
                              </span>
                            )}
                            {resource.safeForMarginalized && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                Safe Space
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                          {resource.languages && resource.languages.length > 1 && (
                            <p className="text-xs text-gray-500 mt-2">
                              Available in: {resource.languages.join(', ')}
                            </p>
                          )}
                        </div>
                        
                        {resource.contact.startsWith('tel:') || resource.contact.includes('-') || resource.contact === '988' ? (
                          <a
                            href={resource.contact.startsWith('tel:') ? resource.contact : `tel:${resource.contact}`}
                            className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                          >
                            Call Now
                          </a>
                        ) : resource.contact.includes('text') || resource.contact.includes('Text') ? (
                          <a
                            href={`sms:${resource.contact.match(/\d+/)?.[0] || '741741'}`}
                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Text Now
                          </a>
                        ) : (
                          <div className="ml-4 text-sm font-medium text-gray-600">
                            {resource.contact}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Additional Safety Options */}
                {userProfile?.riskFactors && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Additional Safety Options</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowSafetyOptions(!showSafetyOptions)}
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                      >
                        {showSafetyOptions ? 'Hide' : 'Show'} Privacy Options
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={onContinueWriting}
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        I'm Safe - Keep Writing
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {showSafetyOptions && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <div className="text-sm text-yellow-700">
                            <p className="mb-3">
                              <strong>Your safety is our priority.</strong> If you're in immediate danger or need to protect your privacy:
                            </p>
                            
                            <div className="space-y-2">
                              <Button
                                variant="outline"
                                onClick={handleEmergencyDelete}
                                className="w-full border-red-300 text-red-700 hover:bg-red-100"
                              >
                                Emergency Data Deletion
                              </Button>
                              
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Clear browser data
                                  if ('serviceWorker' in navigator) {
                                    navigator.serviceWorker.getRegistrations().then(registrations => {
                                      registrations.forEach(registration => registration.unregister());
                                    });
                                  }
                                  localStorage.clear();
                                  sessionStorage.clear();
                                  alert('Browser data cleared. Consider using incognito mode in the future.');
                                }}
                                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                              >
                                Clear Browser Data
                              </Button>
                              
                              <div className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded">
                                <strong>Safety Tip:</strong> If you're worried about someone seeing this conversation, 
                                you can close this tab and use private/incognito browsing for future sessions.
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                
                <div className="mt-4 pt-4 border-t border-purple-200">
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    Hide options
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* Continued Support Message */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4"
        >
          <Card className="p-4 bg-green-50 border border-green-200">
            <div className="text-center">
              <span className="text-green-600 text-lg mb-2 block">🌱</span>
              <p className="text-sm text-green-800">
                We're staying right here with you. You don't have to face this alone.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

export default EnhancedCulturalCrisisSupport;
