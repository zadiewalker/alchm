'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Headphones,
  Globe
} from 'lucide-react';
import { CrisisDetectionEngine } from './CrisisDetectionEngine';
import { CrisisResourceDirectory } from './CrisisResourceDirectory';
import { EmergencyContactSystem } from './EmergencyContactSystem';

interface CrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'chat' | 'text' | 'local_service' | 'emergency';
  phone?: string;
  website?: string;
  textNumber?: string;
  availability: string;
  languages: string[];
  specialties: string[];
  description: string;
  responseTime: string;
  isVerified: boolean;
  location?: string;
  culturallySpecific?: boolean;
}

interface CrisisDetection {
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  triggers: string[];
  recommendations: string[];
  immediateActions: string[];
}

export const CrisisSupportIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('resources');
  const [userLocation, setUserLocation] = useState<string>('');
  const [currentCrisisLevel, setCurrentCrisisLevel] = useState<'none' | 'low' | 'moderate' | 'high' | 'critical'>('none');
  const [crisisResources, setCrisisResources] = useState<CrisisResource[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  useEffect(() => {
    loadCrisisResources();
    detectUserLocation();
  }, []);

  const loadCrisisResources = async () => {
    const resources: CrisisResource[] = [
      {
        id: '1',
        name: '988 Suicide & Crisis Lifeline',
        type: 'hotline',
        phone: '988',
        website: 'https://988lifeline.org',
        availability: '24/7/365',
        languages: ['English', 'Spanish'],
        specialties: ['Suicide Prevention', 'Crisis Counseling'],
        description: 'Free, confidential emotional support for people in suicidal crisis or emotional distress.',
        responseTime: 'Immediate',
        isVerified: true,
        culturallySpecific: false
      },
      {
        id: '2',
        name: 'Crisis Text Line',
        type: 'text',
        textNumber: '741741',
        website: 'https://crisistextline.org',
        availability: '24/7/365',
        languages: ['English'],
        specialties: ['Crisis Counseling', 'Text Support'],
        description: 'Free, 24/7 support via text message for people in crisis.',
        responseTime: '< 5 minutes',
        isVerified: true,
        culturallySpecific: false
      },
      {
        id: '3',
        name: 'Trans Lifeline',
        type: 'hotline',
        phone: '877-565-8860',
        website: 'https://translifeline.org',
        availability: '24/7/365',
        languages: ['English'],
        specialties: ['Transgender Support', 'Suicide Prevention'],
        description: 'Peer support hotline run by and for transgender people.',
        responseTime: 'Immediate',
        isVerified: true,
        culturallySpecific: true
      },
      {
        id: '4',
        name: 'LGBTQ National Hotline',
        type: 'hotline',
        phone: '1-888-843-4564',
        website: 'https://lgbtqnationalhotline.org',
        availability: 'Mon-Fri 4PM-12AM ET, Sat 12PM-5PM ET',
        languages: ['English'],
        specialties: ['LGBTQ+ Support', 'Crisis Counseling'],
        description: 'Confidential support for LGBTQ+ individuals in crisis.',
        responseTime: 'Immediate',
        isVerified: true,
        culturallySpecific: true
      },
      {
        id: '5',
        name: 'National Sexual Assault Hotline',
        type: 'hotline',
        phone: '1-800-656-4673',
        website: 'https://rainn.org',
        availability: '24/7/365',
        languages: ['English', 'Spanish'],
        specialties: ['Sexual Assault', 'Trauma Support'],
        description: 'Free, confidential support for survivors of sexual violence.',
        responseTime: 'Immediate',
        isVerified: true,
        culturallySpecific: false
      },
      {
        id: '6',
        name: 'Veterans Crisis Line',
        type: 'hotline',
        phone: '1-800-273-8255',
        website: 'https://veteranscrisisline.net',
        availability: '24/7/365',
        languages: ['English', 'Spanish'],
        specialties: ['Veterans Support', 'PTSD', 'Suicide Prevention'],
        description: 'Specialized crisis support for veterans and their families.',
        responseTime: 'Immediate',
        isVerified: true,
        culturallySpecific: true
      }
    ];

    setCrisisResources(resources);
  };

  const detectUserLocation = async () => {
    // In production, this would use geolocation or IP-based location
    setUserLocation('United States');
  };

  const handleEmergencyActivation = () => {
    setEmergencyMode(true);
    setCurrentCrisisLevel('critical');
    setActiveTab('emergency');
    
    // Log emergency activation for follow-up
    console.log('Emergency mode activated:', new Date().toISOString());
  };

  const getCrisisLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-300';
      default: return 'text-green-600 bg-green-100 border-green-300';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'hotline': return <Phone size={20} className="text-red-600" />;
      case 'text': return <MessageCircle size={20} className="text-blue-600" />;
      case 'chat': return <MessageCircle size={20} className="text-green-600" />;
      case 'emergency': return <AlertTriangle size={20} className="text-red-600" />;
      default: return <Heart size={20} className="text-sage-600" />;
    }
  };

  const TabButton = ({ id, label, icon: Icon, urgent = false }: { 
    id: string; 
    label: string; 
    icon: React.ComponentType<any>;
    urgent?: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-300
        ${activeTab === id 
          ? urgent 
            ? 'bg-red-100 text-red-800 shadow-md border border-red-300' 
            : 'bg-sage-100 text-sage-800 shadow-md' 
          : urgent 
            ? 'text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-sage-700'
        }
        ${urgent ? 'animate-pulse' : ''}
      `}
    >
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
      {urgent && (
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-sanctuary-background">
      {/* Emergency Banner */}
      {emergencyMode && (
        <div className="bg-red-600 text-white py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle size={24} />
              <div>
                <h2 className="text-lg font-medium">Emergency Support Activated</h2>
                <p className="text-sm text-red-100">
                  Immediate help is available. You are not alone.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={() => window.open('tel:988')}
                className="bg-white text-red-600 hover:bg-red-50"
              >
                <Phone size={16} className="mr-2" />
                Call 988
              </Button>
              <Button 
                onClick={() => window.open('sms:741741')}
                className="bg-white text-red-600 hover:bg-red-50"
              >
                <MessageCircle size={16} className="mr-2" />
                Text 741741
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-800 tracking-wide mb-2">
                Crisis Support & Safety
              </h1>
              <p className="text-slate-600 tracking-wide">
                Immediate support, resources, and safety tools available 24/7
              </p>
            </div>
            
            {!emergencyMode && (
              <Button 
                onClick={handleEmergencyActivation}
                className="bg-red-600 hover:bg-red-700 text-white pulse-animation"
                size="lg"
              >
                <AlertTriangle size={20} className="mr-2" />
                I Need Help Now
              </Button>
            )}
          </div>
        </div>

        {/* Current Status */}
        <Card className={`p-4 mb-6 border ${getCrisisLevelColor(currentCrisisLevel)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield size={20} />
              <div>
                <p className="font-medium text-sm">Crisis Support Status</p>
                <p className="text-xs opacity-80">
                  {currentCrisisLevel === 'none' 
                    ? 'Monitoring active - You are in a safe space'
                    : `${currentCrisisLevel.toUpperCase()} risk detected - Support resources activated`
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin size={14} />
              <span>{userLocation}</span>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-soft">
            <TabButton id="resources" label="Crisis Resources" icon={Phone} />
            <TabButton id="detection" label="Safety Monitoring" icon={Shield} />
            <TabButton 
              id="emergency" 
              label="Emergency Help" 
              icon={AlertTriangle} 
              urgent={emergencyMode}
            />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'resources' && (
            <div className="space-y-6">
              {/* Quick Access */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 border-red-200 bg-red-50">
                  <div className="text-center">
                    <Phone className="text-red-600 mx-auto mb-2" size={32} />
                    <h3 className="font-medium text-red-800 mb-1">Call for Help</h3>
                    <p className="text-sm text-red-700 mb-3">Immediate voice support</p>
                    <Button 
                      onClick={() => window.open('tel:988')}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      Call 988
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-blue-200 bg-blue-50">
                  <div className="text-center">
                    <MessageCircle className="text-blue-600 mx-auto mb-2" size={32} />
                    <h3 className="font-medium text-blue-800 mb-1">Text Support</h3>
                    <p className="text-sm text-blue-700 mb-3">Private text counseling</p>
                    <Button 
                      onClick={() => window.open('sms:741741')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Text 741741
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-purple-200 bg-purple-50">
                  <div className="text-center">
                    <Globe className="text-purple-600 mx-auto mb-2" size={32} />
                    <h3 className="font-medium text-purple-800 mb-1">Online Chat</h3>
                    <p className="text-sm text-purple-700 mb-3">Web-based support</p>
                    <Button 
                      onClick={() => window.open('https://988lifeline.org/chat/')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Start Chat
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Resource Directory */}
              <Card className="p-6 border-sage-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-800 tracking-wide">
                    Crisis Resources Directory
                  </h3>
                  <div className="text-sm text-slate-500">
                    {crisisResources.length} verified resources
                  </div>
                </div>

                <div className="space-y-4">
                  {crisisResources.map(resource => (
                    <div key={resource.id} className="p-4 bg-sanctuary-background rounded-lg border border-slate-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3">
                          {getResourceIcon(resource.type)}
                          <div>
                            <h4 className="font-medium text-slate-800 tracking-wide">
                              {resource.name}
                              {resource.culturallySpecific && (
                                <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                  Culturally Specific
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-slate-600 tracking-wide">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          {resource.phone && (
                            <Button 
                              size="sm"
                              onClick={() => window.open(`tel:${resource.phone}`)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Phone size={14} className="mr-1" />
                              Call
                            </Button>
                          )}
                          {resource.textNumber && (
                            <Button 
                              size="sm"
                              onClick={() => window.open(`sms:${resource.textNumber}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <MessageCircle size={14} className="mr-1" />
                              Text
                            </Button>
                          )}
                          {resource.website && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(resource.website)}
                            >
                              <ExternalLink size={14} className="mr-1" />
                              Visit
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-slate-500">Availability:</span>
                          <p className="text-slate-700 font-medium">{resource.availability}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Response Time:</span>
                          <p className="text-slate-700 font-medium">{resource.responseTime}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Languages:</span>
                          <p className="text-slate-700 font-medium">{resource.languages.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Specialties:</span>
                          <p className="text-slate-700 font-medium">{resource.specialties.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'detection' && (
            <CrisisDetectionEngine onCrisisDetected={setCurrentCrisisLevel} />
          )}

          {activeTab === 'emergency' && (
            <EmergencyContactSystem 
              userLocation={userLocation}
              crisisLevel={currentCrisisLevel}
            />
          )}
        </div>

        {/* Safety Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center">
          <p className="text-sm text-slate-600 tracking-wide mb-2">
            <strong>Remember:</strong> If you are in immediate danger, call emergency services (911 in the US).
          </p>
          <p className="text-xs text-slate-500 tracking-wide">
            Crisis resources are available 24/7. You are not alone, and help is always available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrisisSupportIntegration;