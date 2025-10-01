'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/textarea';
import { 
  type EphemeralCommunityIdentity,
  TraumaInformedModerator 
} from '@/lib/community/privacy-engine';
import { useRouter } from 'next/navigation';

interface CrisisSafeCommunityResponseProps {
  ephemeralIdentity: EphemeralCommunityIdentity;
}

interface CrisisAlert {
  id: string;
  alertLevel: 'low' | 'moderate' | 'high' | 'emergency';
  triggerContent: string;
  ephemeralUserId: string;
  detectedKeywords: string[];
  professionalEscalated: boolean;
  communityResponseNeeded: boolean;
  responseCount: number;
  resolvedAt?: Date;
  createdAt: Date;
}

interface CommunityResponse {
  id: string;
  crisisAlertId: string;
  responderEphemeralId: string;
  responseType: 'immediate-support' | 'resource-sharing' | 'professional-referral' | 'gentle-presence';
  responseContent: string;
  isVerified: boolean;
  helpfulnessScore: number;
  createdAt: Date;
}

interface CrisisResource {
  id: string;
  name: string;
  type: 'hotline' | 'text' | 'chat' | 'emergency' | 'professional';
  contactInfo: string;
  description: string;
  languages: string[];
  availability: string;
  culturalSpecialty?: string;
  isInternational: boolean;
  priority: number;
}

const CRISIS_RESOURCES: CrisisResource[] = [
  {
    id: '988-lifeline',
    name: '988 Suicide & Crisis Lifeline',
    type: 'hotline',
    contactInfo: '988',
    description: 'Free and confidential 24/7 support for people in distress',
    languages: ['English', 'Spanish'],
    availability: '24/7',
    isInternational: false,
    priority: 1
  },
  {
    id: 'crisis-text',
    name: 'Crisis Text Line',
    type: 'text',
    contactInfo: 'Text HOME to 741741',
    description: '24/7 crisis support via text message',
    languages: ['English'],
    availability: '24/7',
    isInternational: false,
    priority: 1
  },
  {
    id: 'lgbt-hotline',
    name: 'LGBT National Hotline',
    type: 'hotline',
    contactInfo: '1-888-843-4564',
    description: 'Confidential support for LGBTQ+ individuals',
    languages: ['English'],
    availability: 'M-F 4PM-12AM, Sat 12PM-5PM EST',
    culturalSpecialty: 'LGBTQ+',
    isInternational: false,
    priority: 2
  },
  {
    id: 'samhsa-national',
    name: 'SAMHSA National Helpline',
    type: 'hotline',
    contactInfo: '1-800-662-4357',
    description: 'Treatment referral and information service for mental health and substance use',
    languages: ['English', 'Spanish'],
    availability: '24/7',
    isInternational: false,
    priority: 2
  },
  {
    id: 'international-association',
    name: 'International Association for Suicide Prevention',
    type: 'professional',
    contactInfo: 'https://www.iasp.info/resources/Crisis_Centres/',
    description: 'Directory of crisis centers worldwide',
    languages: ['Multiple'],
    availability: 'Varies by location',
    isInternational: true,
    priority: 3
  },
  {
    id: 'veterans-crisis',
    name: 'Veterans Crisis Line',
    type: 'hotline',
    contactInfo: '1-800-273-8255, Press 1',
    description: 'Confidential support for veterans and their families',
    languages: ['English'],
    availability: '24/7',
    culturalSpecialty: 'Veterans',
    isInternational: false,
    priority: 2
  }
];

const RESPONSE_TEMPLATES = [
  {
    type: 'immediate-support',
    title: 'Immediate Gentle Presence',
    template: `I see you and I'm here with you right now. You're not alone in this moment. 

Your pain is real and valid. You don't have to carry this by yourself.

Would it help to know that I'm sitting here holding space for you? You don't have to respond - just know that someone cares about you right now.

Please consider reaching out to the crisis resources if you need immediate help. Your life has value.`
  },
  {
    type: 'resource-sharing',
    title: 'Gentle Resource Sharing',
    template: `I want you to know that there are people trained specifically to help you through this moment. 

Here are some immediate resources:
• 988 Suicide & Crisis Lifeline: Call or text 988
• Crisis Text Line: Text HOME to 741741

These are confidential, free, and available 24/7. The people there understand crisis and want to help.

You deserve support right now. Please consider reaching out.`
  },
  {
    type: 'professional-referral',
    title: 'Professional Support Recommendation',
    template: `What you're sharing sounds really heavy, and I'm concerned for you. This might be a good time to connect with professional support.

Professional help doesn't mean you're broken - it means you're being wise about getting the right kind of support for what you're going through.

Would you consider talking to:
• A therapist or counselor
• Your doctor
• A crisis counselor (988 or Crisis Text Line)

You deserve expert care for what you're experiencing.`
  },
  {
    type: 'gentle-presence',
    title: 'Compassionate Witnessing',
    template: `Thank you for sharing something so personal and difficult. It takes courage to put words to pain.

I want you to know that you've been heard. Your feelings are valid, and your struggle is real.

You don't have to figure everything out right now. Sometimes it's enough to just get through this moment, and then the next one.

Please be gentle with yourself. You're doing the best you can with what you have right now.`
  }
];

export default function CrisisSafeCommunityResponse({ ephemeralIdentity }: CrisisSafeCommunityResponseProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<'dashboard' | 'respond-to-crisis' | 'resources' | 'training'>('dashboard');
  const [availableAlerts, setAvailableAlerts] = useState<CrisisAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<CrisisAlert | null>(null);
  const [responseContent, setResponseContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isTrainedResponder, setIsTrainedResponder] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock crisis alerts for demonstration
  useEffect(() => {
    const mockAlerts: CrisisAlert[] = [
      {
        id: 'alert-1',
        alertLevel: 'high',
        triggerContent: 'Person expressing feelings of hopelessness and isolation',
        ephemeralUserId: 'user-crisis-123',
        detectedKeywords: ['hopeless', 'alone', 'can\'t go on'],
        professionalEscalated: false,
        communityResponseNeeded: true,
        responseCount: 1,
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        id: 'alert-2',
        alertLevel: 'moderate',
        triggerContent: 'Person struggling with severe anxiety and panic',
        ephemeralUserId: 'user-crisis-456',
        detectedKeywords: ['panic', 'can\'t breathe', 'scared'],
        professionalEscalated: false,
        communityResponseNeeded: true,
        responseCount: 0,
        createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      }
    ];
    
    setAvailableAlerts(mockAlerts);
  }, []);

  const handleSubmitResponse = async () => {
    if (!selectedAlert || !responseContent.trim()) return;

    setIsSubmitting(true);

    try {
      // Moderate response content
      const moderation = await TraumaInformedModerator.moderateContent(responseContent);
      if (!moderation.approved) {
        alert('Your response contains content that needs review. Please ensure your response is supportive and crisis-safe.');
        setIsSubmitting(false);
        return;
      }

      const response: Partial<CommunityResponse> = {
        id: `response-${Date.now()}`,
        crisisAlertId: selectedAlert.id,
        responderEphemeralId: ephemeralIdentity.ephemeralId,
        responseType: selectedTemplate as any,
        responseContent: responseContent.trim(),
        isVerified: isTrainedResponder,
        helpfulnessScore: 0,
        createdAt: new Date()
      };

      // Update alert response count
      setAvailableAlerts(prev => prev.map(alert => 
        alert.id === selectedAlert.id 
          ? { ...alert, responseCount: alert.responseCount + 1 }
          : alert
      ));

      // Clear form
      setResponseContent('');
      setSelectedTemplate('');
      setSelectedAlert(null);

      alert('Your compassionate response has been sent anonymously. Thank you for supporting a community member in crisis.');

    } catch (error) {
      console.error('Error submitting response:', error);
      alert('There was an issue sending your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">🛡️</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Crisis-Safe Community Response</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
          A trauma-informed system where trained community members provide immediate support 
          while ensuring professional resources are always prioritized.
        </p>
      </div>

      {/* Emergency Banner */}
      <Card className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/20 p-6">
        <div className="text-center">
          <h2 className="text-red-200 font-medium text-lg mb-2">🆘 In Crisis? Get Immediate Help</h2>
          <p className="text-red-200/80 text-sm mb-4">
            If you're thinking of suicide or in immediate danger, please reach out for professional help right now.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.open('tel:988')}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Call 988 - Suicide & Crisis Lifeline
            </Button>
            <Button
              onClick={() => setCurrentView('resources')}
              className="bg-red-500/80 hover:bg-red-600 text-white"
            >
              View All Crisis Resources
            </Button>
          </div>
        </div>
      </Card>

      {/* System Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-blue-500/10 border-blue-500/20 p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-400/20 flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
            <h3 className="text-blue-200 font-medium mb-2">Crisis Detection</h3>
            <p className="text-blue-200/80 text-sm">
              AI monitors community content for crisis indicators while protecting privacy
            </p>
          </div>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-400/20 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-green-200 font-medium mb-2">Community Support</h3>
            <p className="text-green-200/80 text-sm">
              Trained community members provide immediate compassionate response
            </p>
          </div>
        </Card>

        <Card className="bg-purple-500/10 border-purple-500/20 p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-400/20 flex items-center justify-center">
              <span className="text-2xl">👩‍⚕️</span>
            </div>
            <h3 className="text-purple-200 font-medium mb-2">Professional Escalation</h3>
            <p className="text-purple-200/80 text-sm">
              Automatic routing to professional resources for high-risk situations
            </p>
          </div>
        </Card>
      </div>

      {/* Active Crisis Alerts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-white">Community Members Need Support</h2>
          <Button
            onClick={() => setCurrentView('training')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Crisis Response Training
          </Button>
        </div>

        {availableAlerts.length === 0 ? (
          <Card className="bg-green-500/10 border-green-500/20 p-8 text-center">
            <h3 className="text-green-200 font-medium mb-2">No Active Crisis Alerts</h3>
            <p className="text-green-200/80 text-sm">
              Our community is currently stable. Thank you to all responders for your care.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableAlerts.map((alert) => (
              <Card key={alert.id} className={`border p-6 ${
                alert.alertLevel === 'emergency' ? 'bg-red-500/10 border-red-500/20' :
                alert.alertLevel === 'high' ? 'bg-orange-500/10 border-orange-500/20' :
                alert.alertLevel === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/20' :
                'bg-blue-500/10 border-blue-500/20'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {alert.alertLevel === 'emergency' ? '🚨' :
                         alert.alertLevel === 'high' ? '⚠️' :
                         alert.alertLevel === 'moderate' ? '💛' : '💙'}
                      </span>
                      <h3 className="text-white font-medium">
                        {alert.alertLevel.toUpperCase()} - Community Support Needed
                      </h3>
                    </div>
                    <p className="text-white/80 text-sm mb-3">{alert.triggerContent}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <span>{alert.responseCount} responses</span>
                      <span>{Math.floor((Date.now() - alert.createdAt.getTime()) / (1000 * 60))} minutes ago</span>
                      {alert.professionalEscalated && <span className="text-green-300">Professional contacted</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <Button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setCurrentView('respond-to-crisis');
                      }}
                      disabled={!isTrainedResponder}
                      className="bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50 text-sm"
                    >
                      {isTrainedResponder ? 'Respond with Care' : 'Training Required'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Responder Status */}
      <Card className="bg-white/5 border-white/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium mb-1">
              {isTrainedResponder ? 'Certified Crisis Responder' : 'Community Member'}
            </h3>
            <p className="text-white/70 text-sm">
              {isTrainedResponder 
                ? 'You\'re trained to provide trauma-informed crisis support to community members.'
                : 'Complete crisis response training to help community members in need.'
              }
            </p>
          </div>
          {!isTrainedResponder && (
            <Button
              onClick={() => setCurrentView('training')}
              className="bg-[#5E8E7F] hover:bg-[#4A6B5E]"
            >
              Start Training
            </Button>
          )}
        </div>
      </Card>
    </div>
  );

  const renderRespondToCrisis = () => {
    if (!selectedAlert) return null;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-400/20 to-rose-400/20 flex items-center justify-center">
            <span className="text-2xl">💝</span>
          </div>
          <h1 className="text-2xl font-light text-white mb-2">Respond with Compassion</h1>
          <p className="text-white/80 text-sm max-w-md mx-auto">
            A community member needs support. Your response could make a life-saving difference.
          </p>
        </div>

        <Card className={`p-6 ${
          selectedAlert.alertLevel === 'emergency' ? 'bg-red-500/10 border-red-500/20' :
          selectedAlert.alertLevel === 'high' ? 'bg-orange-500/10 border-orange-500/20' :
          selectedAlert.alertLevel === 'moderate' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-blue-500/10 border-blue-500/20'
        }`}>
          <h3 className="text-white font-medium mb-2">
            Crisis Level: {selectedAlert.alertLevel.toUpperCase()}
          </h3>
          <p className="text-white/80 text-sm mb-3">{selectedAlert.triggerContent}</p>
          <div className="text-xs text-white/60">
            Detected indicators: {selectedAlert.detectedKeywords.join(', ')}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-4">Choose Response Template</h3>
          <div className="space-y-2">
            {RESPONSE_TEMPLATES.map((template) => (
              <button
                key={template.type}
                onClick={() => {
                  setSelectedTemplate(template.type);
                  setResponseContent(template.template);
                }}
                className={`w-full p-3 rounded-lg border text-left transition-all duration-200 ${
                  selectedTemplate === template.type
                    ? 'border-[#5E8E7F] bg-[#5E8E7F]/20 text-[#5E8E7F]'
                    : 'border-white/10 hover:border-white/20 text-white/80'
                }`}
              >
                <p className="text-sm font-medium">{template.title}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 p-6">
          <h3 className="text-white/90 font-medium mb-4">Your Response</h3>
          <TextArea
            placeholder="Write a compassionate, supportive response. Remember: you're offering presence and care, not therapy or advice."
            value={responseContent}
            onChange={(e) => setResponseContent(e.target.value)}
            className="min-h-48 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#5E8E7F] resize-none"
          />
          <div className="text-right text-xs text-white/40 mt-1">
            {responseContent.length}/1000 characters
          </div>
        </Card>

        <Card className="bg-green-500/10 border-green-500/20 p-4">
          <h3 className="text-green-200 font-medium mb-2">Crisis Response Guidelines</h3>
          <ul className="text-green-200/80 text-xs space-y-1">
            <li>• Validate their pain without minimizing it</li>
            <li>• Always include professional resources for crisis support</li>
            <li>• Avoid giving advice or trying to "fix" their situation</li>
            <li>• Use "I" statements to share your care and concern</li>
            <li>• Don\'t ask for details about their crisis</li>
            <li>• Remember: you\'re offering presence, not therapy</li>
          </ul>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmitResponse}
            disabled={!responseContent.trim() || isSubmitting}
            className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
          >
            {isSubmitting ? 'Sending Support...' : 'Send Compassionate Response'}
          </Button>
        </div>
      </div>
    );
  };

  const renderResources = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-400/20 to-pink-400/20 flex items-center justify-center">
          <span className="text-2xl">🆘</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Crisis Resources</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Professional crisis support available 24/7. These resources are confidential and specifically trained for crisis intervention.
        </p>
      </div>

      <div className="grid gap-4">
        {CRISIS_RESOURCES.sort((a, b) => a.priority - b.priority).map((resource) => (
          <Card key={resource.id} className={`p-6 ${
            resource.priority === 1 ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">
                    {resource.type === 'emergency' ? '🚨' :
                     resource.type === 'hotline' ? '📞' :
                     resource.type === 'text' ? '💬' :
                     resource.type === 'chat' ? '💻' : '🏥'}
                  </span>
                  <h3 className="text-white font-medium">{resource.name}</h3>
                  {resource.priority === 1 && <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-300 text-xs">Priority</span>}
                </div>
                <p className="text-white/80 text-sm mb-3">{resource.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-white/60 mb-2">
                  <span>📅 {resource.availability}</span>
                  <span>🌐 {resource.languages.join(', ')}</span>
                  {resource.culturalSpecialty && <span>👥 {resource.culturalSpecialty}</span>}
                  {resource.isInternational && <span>🌍 International</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-mono text-sm mb-2">{resource.contactInfo}</div>
                {resource.type === 'hotline' && (
                  <Button
                    onClick={() => window.open(`tel:${resource.contactInfo}`)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                  >
                    Call Now
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setCurrentView('dashboard')}
        variant="outline"
        className="w-full border-white/20 text-white hover:bg-white/10"
      >
        Back to Crisis Response Dashboard
      </Button>
    </div>
  );

  const renderTraining = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 flex items-center justify-center">
          <span className="text-2xl">🎓</span>
        </div>
        <h1 className="text-2xl font-light text-white mb-2">Crisis Response Training</h1>
        <p className="text-white/80 text-sm max-w-md mx-auto">
          Learn trauma-informed approaches to supporting community members in crisis while maintaining appropriate boundaries.
        </p>
      </div>

      <Card className="bg-blue-500/10 border-blue-500/20 p-6">
        <h3 className="text-blue-200 font-medium mb-4">Training Modules</h3>
        <div className="space-y-3">
          {[
            'Understanding Crisis and Trauma',
            'Trauma-Informed Communication',
            'Crisis De-escalation Techniques',
            'When and How to Escalate',
            'Self-Care for Crisis Responders',
            'Cultural Sensitivity in Crisis Response'
          ].map((module, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
              <span className="w-6 h-6 rounded-full bg-blue-400/20 flex items-center justify-center text-xs text-blue-300 font-medium">
                {index + 1}
              </span>
              <span className="text-blue-200 text-sm">{module}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-white/5 border-white/10 p-6">
        <h3 className="text-white/90 font-medium mb-4">Training Requirements</h3>
        <ul className="text-white/70 text-sm space-y-2">
          <li>• Complete all 6 training modules (approximately 2 hours)</li>
          <li>• Pass final assessment with 80% or higher</li>
          <li>• Commit to trauma-informed response principles</li>
          <li>• Agree to regular self-care and boundary maintenance</li>
          <li>• Renew training every 6 months</li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Button
          onClick={() => setCurrentView('dashboard')}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            setIsTrainedResponder(true);
            alert('Training completed! You are now certified as a crisis responder and can provide support to community members in need.');
            setCurrentView('dashboard');
          }}
          className="flex-1 bg-[#5E8E7F] hover:bg-[#4A6B5E]"
        >
          Start Training
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'respond-to-crisis' && renderRespondToCrisis()}
      {currentView === 'resources' && renderResources()}
      {currentView === 'training' && renderTraining()}
    </div>
  );
}