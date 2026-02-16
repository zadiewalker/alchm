'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { safeWindow } from '@/utils/browser';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/lib/storageKeys';

interface SafetyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  preferred_contact: 'phone' | 'text' | 'email';
  availability: '24/7' | 'business_hours' | 'evenings' | 'custom';
  is_professional: boolean;
  specialization?: string;
  notes?: string;
}

interface SafetyResource {
  id: string;
  name: string;
  type: 'crisis_line' | 'text_service' | 'chat_support' | 'emergency' | 'professional';
  contact_info: string;
  availability: string;
  description: string;
  languages?: string[];
  specialties?: string[];
  is_free: boolean;
  location?: string;
}

interface CrisisResponse {
  trigger: 'manual' | 'ai_detection' | 'pattern_recognition' | 'scheduled_check';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  timestamp: Date;
  actions_taken: string[];
  contacts_notified: string[];
  follow_up_scheduled: boolean;
}

export default function RealTimeSafetyNet() {
  const { user } = useAuth();
  const [safetyContacts, setSafetyContacts] = useState<SafetyContact[]>([]);
  const [safetyResources, setSafetyResources] = useState<SafetyResource[]>([]);
  const [isInCrisis, setIsInCrisis] = useState(false);
  const [activeCrisisResponse, setActiveCrisisResponse] = useState<CrisisResponse | null>(null);
  const [checkInReminders, setCheckInReminders] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);
  const [moodHistory, setMoodHistory] = useState<Array<{ mood: number; timestamp: Date }>>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showEmergencyActions, setShowEmergencyActions] = useState(false);

  useEffect(() => {
    loadSafetyNetwork();
    initializeDefaultResources();
    scheduleCheckInReminders();
  }, []);

  const loadSafetyNetwork = () => {
    try {
      const contacts = getStorageItemWithFallback('safety_contacts');
      if (contacts) {
        setSafetyContacts(JSON.parse(contacts));
      }

      const lastCheckInStr = getStorageItemWithFallback('last_check_in');
      if (lastCheckInStr) {
        setLastCheckIn(new Date(lastCheckInStr));
      }

      const moodHistoryStr = getStorageItemWithFallback('mood_history');
      if (moodHistoryStr) {
        const history = JSON.parse(moodHistoryStr);
        setMoodHistory(history.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading safety network:', error);
    }
  };

  const initializeDefaultResources = () => {
    const defaultResources: SafetyResource[] = [
      {
        id: 'crisis_lifeline',
        name: '988 Suicide & Crisis Lifeline',
        type: 'crisis_line',
        contact_info: '988',
        availability: '24/7',
        description: 'Free and confidential emotional support for people in suicidal crisis or emotional distress',
        languages: ['English', 'Spanish'],
        is_free: true,
        location: 'United States'
      },
      {
        id: 'crisis_text_line',
        name: 'Crisis Text Line',
        type: 'text_service',
        contact_info: 'Text HOME to 741741',
        availability: '24/7',
        description: 'Free crisis support via text message',
        languages: ['English'],
        is_free: true,
        location: 'United States'
      },
      {
        id: 'trevor_project',
        name: 'Trevor Project Lifeline',
        type: 'crisis_line',
        contact_info: '1-866-488-7386',
        availability: '24/7',
        description: 'Crisis support specifically for LGBTQ+ youth',
        languages: ['English'],
        specialties: ['LGBTQ+', 'Youth'],
        is_free: true,
        location: 'United States'
      },
      {
        id: 'veterans_crisis',
        name: 'Veterans Crisis Line',
        type: 'crisis_line',
        contact_info: '1-800-273-8255, Press 1',
        availability: '24/7',
        description: 'Crisis support for veterans and their families',
        languages: ['English'],
        specialties: ['Veterans', 'Military families'],
        is_free: true,
        location: 'United States'
      },
      {
        id: 'emergency_services',
        name: 'Emergency Services',
        type: 'emergency',
        contact_info: '911',
        availability: '24/7',
        description: 'Immediate emergency response for life-threatening situations',
        languages: ['Multiple'],
        is_free: true,
        location: 'United States'
      }
    ];

    setSafetyResources(defaultResources);
  };

  const scheduleCheckInReminders = () => {
    if (checkInReminders) {
      // Set up daily check-in reminder (simplified for demo)
      const now = new Date();
      const lastCheckInTime = lastCheckIn ? lastCheckIn.getTime() : 0;
      const timeSinceLastCheckIn = now.getTime() - lastCheckInTime;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (timeSinceLastCheckIn > oneDayMs) {
        // Show check-in prompt
        showCheckInPrompt();
      }
    }
  };

  const showCheckInPrompt = () => {
    if (confirm('How are you feeling today? Would you like to do a quick mood check-in?')) {
      performCheckIn();
    }
  };

  const performCheckIn = () => {
    const moodRating = prompt('On a scale of 1-10, how is your mood today? (1 = very low, 10 = excellent)');
    
    if (moodRating) {
      const mood = parseInt(moodRating);
      if (!isNaN(mood) && mood >= 1 && mood <= 10) {
        const newEntry = { mood, timestamp: new Date() };
        const updatedHistory = [newEntry, ...moodHistory].slice(0, 30); // Keep last 30 entries
        
        setMoodHistory(updatedHistory);
        setLastCheckIn(new Date());
        
        setStorageItemNormalized('mood_history', JSON.stringify(updatedHistory));
        setStorageItemNormalized('last_check_in', new Date().toISOString());

        // Check if crisis intervention needed
        if (mood <= 3) {
          triggerCrisisResponse('manual', 'moderate');
        } else if (mood <= 2) {
          triggerCrisisResponse('manual', 'high');
        }
      }
    }
  };

  const triggerCrisisResponse = (trigger: CrisisResponse['trigger'], severity: CrisisResponse['severity']) => {
    const crisisResponse: CrisisResponse = {
      trigger,
      severity,
      timestamp: new Date(),
      actions_taken: [],
      contacts_notified: [],
      follow_up_scheduled: false
    };

    setActiveCrisisResponse(crisisResponse);
    setIsInCrisis(true);
    setShowEmergencyActions(true);

    // Log the crisis response
    const crisisLog = getStorageItemWithFallback('crisis_responses') || '[]';
    const responses = JSON.parse(crisisLog);
    responses.push(crisisResponse);
    setStorageItemNormalized('crisis_responses', JSON.stringify(responses));
  };

  const addSafetyContact = (contact: Omit<SafetyContact, 'id'>) => {
    const newContact: SafetyContact = {
      ...contact,
      id: Date.now().toString()
    };

    const updatedContacts = [...safetyContacts, newContact];
    setSafetyContacts(updatedContacts);
    setStorageItemNormalized('safety_contacts', JSON.stringify(updatedContacts));
    setShowAddContact(false);
  };

  const contactSupport = async (contact: SafetyContact | SafetyResource, method: 'call' | 'text' | 'email') => {
    const contactInfo = 'contact_info' in contact ? contact.contact_info : contact.phone;
    
    if (activeCrisisResponse) {
      const updatedResponse = {
        ...activeCrisisResponse,
        actions_taken: [...activeCrisisResponse.actions_taken, `Contacted ${contact.name} via ${method}`],
        contacts_notified: [...activeCrisisResponse.contacts_notified, contact.name]
      };
      setActiveCrisisResponse(updatedResponse);
    }

    switch (method) {
      case 'call':
        safeWindow.open(`tel:${contactInfo}`, '_self');
        break;
      case 'text':
        safeWindow.open(`sms:${contactInfo}`, '_self');
        break;
      case 'email':
        if ('email' in contact && contact.email) {
          safeWindow.open(`mailto:${contact.email}`, '_self');
        }
        break;
    }
  };

  const endCrisisResponse = () => {
    if (activeCrisisResponse) {
      const finalResponse = {
        ...activeCrisisResponse,
        actions_taken: [...activeCrisisResponse.actions_taken, 'Crisis response ended by user'],
        follow_up_scheduled: true
      };

      // Update crisis log
      const crisisLog = getStorageItemWithFallback('crisis_responses') || '[]';
      const responses = JSON.parse(crisisLog);
      responses[responses.length - 1] = finalResponse;
      setStorageItemNormalized('crisis_responses', JSON.stringify(responses));
    }

    setIsInCrisis(false);
    setActiveCrisisResponse(null);
    setShowEmergencyActions(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-500/20';
      case 'high': return 'border-[#E5C97D] bg-[#E5C97D]/20';
      case 'moderate': return 'border-[#E5C97D] bg-[#E5C97D]/10';
      case 'low': return 'border-[#8B9A7C] bg-[#8B9A7C]/20';
      default: return 'border-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="real-time-safety-net max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">🛡️</div>
        <h2 className="text-2xl text-white font-light mb-3">Real-Time Safety Network</h2>
        <p className="text-white/70 text-sm">
          Your personalized support system for crisis prevention and immediate help
        </p>
      </div>

      {/* Crisis Alert Banner */}
      {isInCrisis && (
        <div className={`border-2 rounded-2xl p-6 mb-6 ${getSeverityColor(activeCrisisResponse?.severity || 'moderate')}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium text-lg">🚨 Crisis Response Active</h3>
              <p className="text-white/70 text-sm">
                Severity: {activeCrisisResponse?.severity} | Triggered: {activeCrisisResponse?.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={endCrisisResponse}
              className="bg-[#8B9A7C]/30 border border-[#8B9A7C]/30 text-[#8B9A7C] px-4 py-2 rounded-lg hover:bg-[#8B9A7C]/40 transition-colors"
            >
              End Crisis Response
            </button>
          </div>

          {activeCrisisResponse && (
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="text-white/80 mb-2">Actions Taken:</h4>
                <ul className="space-y-1">
                  {activeCrisisResponse.actions_taken.map((action, index) => (
                    <li key={index} className="text-white/60 flex items-start gap-2">
                      <span className="text-[#8B9A7C] mt-1">✓</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white/80 mb-2">Contacts Notified:</h4>
                <ul className="space-y-1">
                  {activeCrisisResponse.contacts_notified.map((contact, index) => (
                    <li key={index} className="text-white/60 flex items-start gap-2">
                      <span className="text-[#8B9A7C] mt-1">📞</span>
                      {contact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Immediate Crisis Resources */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <h3 className="text-white text-lg font-light mb-4">🆘 Immediate Crisis Support</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          {safetyResources.filter(resource => resource.type === 'crisis_line' || resource.type === 'emergency').map((resource) => (
            <div key={resource.id} className="bg-black/20 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">{resource.name}</h4>
              <p className="text-white/60 text-sm mb-3">{resource.description}</p>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => contactSupport(resource, 'call')}
                  className="w-full bg-red-600/30 hover:bg-red-600/40 border border-red-500/30 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  📞 {resource.contact_info}
                </button>
                
                {resource.type === 'crisis_line' && (
                  <div className="text-xs text-white/50 text-center">
                    Available: {resource.availability}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => triggerCrisisResponse('manual', 'high')}
            className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-200 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🚨 I'm in Crisis - Activate Safety Network
          </button>
        </div>
      </div>

      {/* Personal Safety Contacts */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-light">👥 Personal Support Network</h3>
          <button
            onClick={() => setShowAddContact(true)}
            className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            + Add Contact
          </button>
        </div>

        {safetyContacts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {safetyContacts.map((contact) => (
              <div key={contact.id} className="bg-black/20 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-medium">{contact.name}</h4>
                    <p className="text-white/60 text-sm">{contact.relationship}</p>
                    {contact.is_professional && contact.specialization && (
                      <span className="text-[#8B9A7C] text-xs">Specialist: {contact.specialization}</span>
                    )}
                  </div>
                  <span className="text-xs px-2 py-1 bg-[#8B9A7C]/20 text-[#8B9A7C] rounded">
                    {contact.availability}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => contactSupport(contact, 'call')}
                    className="flex-1 bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white py-2 rounded text-sm transition-colors"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={() => contactSupport(contact, 'text')}
                    className="flex-1 bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white py-2 rounded text-sm transition-colors"
                  >
                    💬 Text
                  </button>
                  {contact.email && (
                    <button
                      onClick={() => contactSupport(contact, 'email')}
                      className="flex-1 bg-[#A8B5A0]/30 hover:bg-[#A8B5A0]/40 border border-[#A8B5A0]/30 text-white py-2 rounded text-sm transition-colors"
                    >
                      📧 Email
                    </button>
                  )}
                </div>

                {contact.notes && (
                  <p className="text-white/50 text-xs mt-2 italic">{contact.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-3 opacity-50">👥</div>
            <p className="text-white/60 text-sm mb-4">
              Add trusted contacts to your safety network for quick access during difficult times.
            </p>
          </div>
        )}
      </div>

      {/* Text Support Services */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-6">
        <h3 className="text-white text-lg font-light mb-4">💬 Text & Chat Support</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {safetyResources.filter(resource => resource.type === 'text_service' || resource.type === 'chat_support').map((resource) => (
            <div key={resource.id} className="bg-black/20 p-4 rounded-lg">
              <h4 className="text-white font-medium mb-2">{resource.name}</h4>
              <p className="text-white/60 text-sm mb-3">{resource.description}</p>
              
              <button
                onClick={() => contactSupport(resource, 'text')}
                className="w-full bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white py-2 rounded-lg transition-colors"
              >
                💬 {resource.contact_info}
              </button>
              
              <div className="text-xs text-white/50 text-center mt-2">
                {resource.availability} • Free: {resource.is_free ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Check-In */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-lg font-light">📊 Daily Check-In</h3>
          <button
            onClick={performCheckIn}
            className="bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Quick Check-In
          </button>
        </div>

        {lastCheckIn && (
          <p className="text-white/60 text-sm mb-4">
            Last check-in: {lastCheckIn.toLocaleDateString()} at {lastCheckIn.toLocaleTimeString()}
          </p>
        )}

        {moodHistory.length > 0 && (
          <div className="bg-black/20 p-4 rounded-lg">
            <h4 className="text-white/80 font-medium mb-3">Recent Mood Trend</h4>
            <div className="flex items-end space-x-2 h-20">
              {moodHistory.slice(0, 14).reverse().map((entry, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-t transition-colors ${
                    entry.mood <= 3 ? 'bg-red-500' :
                    entry.mood <= 6 ? 'bg-[#E5C97D]' : 'bg-[#8B9A7C]'
                  }`}
                  style={{ height: `${Math.max(0, Math.min(100, ((entry.mood || 5) / 10) * 100))}%` }}
                  title={`Mood: ${entry.mood}/10 on ${entry.timestamp.toLocaleDateString()}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>Older</span>
              <span>Recent</span>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-white text-lg font-medium mb-4">Add Safety Contact</h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              addSafetyContact({
                name: formData.get('name') as string,
                relationship: formData.get('relationship') as string,
                phone: formData.get('phone') as string,
                email: formData.get('email') as string || undefined,
                preferred_contact: formData.get('preferred_contact') as any,
                availability: formData.get('availability') as any,
                is_professional: formData.get('is_professional') === 'on',
                specialization: formData.get('specialization') as string || undefined,
                notes: formData.get('notes') as string || undefined
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Name *</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Relationship *</label>
                  <input
                    name="relationship"
                    type="text"
                    required
                    placeholder="Friend, Family, Therapist, etc."
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Phone *</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Preferred Contact Method</label>
                  <select name="preferred_contact" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white">
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Availability</label>
                  <select name="availability" className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white">
                    <option value="24/7">24/7</option>
                    <option value="business_hours">Business Hours</option>
                    <option value="evenings">Evenings</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" name="is_professional" id="is_professional" className="rounded" />
                  <label htmlFor="is_professional" className="text-white/80 text-sm">Mental Health Professional</label>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1">Notes</label>
                  <textarea
                    name="notes"
                    rows={2}
                    className="w-full bg-black/30 border border-white/20 rounded-lg p-3 text-white resize-none"
                    placeholder="Any additional notes about this contact..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="flex-1 bg-gray-600/30 border border-gray-500/30 text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#8B9A7C]/30 hover:bg-[#8B9A7C]/40 border border-[#8B9A7C]/30 text-white py-2 rounded-lg transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
