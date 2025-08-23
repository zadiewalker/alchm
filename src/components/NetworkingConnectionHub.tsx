// ALCHM Networking & Real-World Connection Hub
// Tools for interviews, shadowing, mentorship, and professional networking

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  NetworkingProfile,
  InformationalInterview,
  NetworkingEvent,
  ProfessionalMentor,
  CareerOption
} from '@/types/career-future-readiness-schema';
import { IdentityExplorationProfile } from '@/types/identity-pathway-schema';
import { CulturalContext } from '@/types/identity-schema';

interface NetworkingHubProps {
  userId: string;
  networkingProfile: NetworkingProfile;
  identityProfile: IdentityExplorationProfile;
  culturalContext: CulturalContext;
  targetCareers: CareerOption[];
  onConnectionRequest?: (connectionRequest: ConnectionRequest) => void;
  onInterviewScheduled?: (interview: InformationalInterview) => void;
  onNetworkingEventJoin?: (eventId: string) => void;
}

interface ConnectionRequest {
  requestId: string;
  requestType: 'informational_interview' | 'job_shadowing' | 'mentorship' | 'general_networking';
  targetPerson: ProfessionalContact;
  message: string;
  purpose: string;
  timeframe: string;
  culturalConsiderations: string[];
}

interface ProfessionalContact {
  contactId: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  experience: number; // years
  expertise: string[];
  culturalBackground: string[];
  communicationPreferences: CommunicationPreference[];
  availabilityType: 'high' | 'medium' | 'low';
  connectionPath: string; // how they're connected to the user
  profileUrl: string;
  lastActive: Date;
}

interface OpportunityDiscovery {
  opportunityId: string;
  type: 'job_opening' | 'internship' | 'volunteer' | 'project_collaboration' | 'speaking_opportunity';
  title: string;
  organization: string;
  description: string;
  requirements: string[];
  benefits: string[];
  culturalFit: number; // 0-1
  careerRelevance: number; // 0-1
  applicationDeadline: Date;
  source: string;
  contactPerson?: ProfessionalContact;
}

const NetworkingConnectionHub: React.FC<NetworkingHubProps> = ({
  userId,
  networkingProfile,
  identityProfile,
  culturalContext,
  targetCareers,
  onConnectionRequest,
  onInterviewScheduled,
  onNetworkingEventJoin
}) => {
  // State management
  const [activeTab, setActiveTab] = useState<'discover' | 'connect' | 'events' | 'opportunities' | 'my_network'>('discover');
  const [searchFilters, setSearchFilters] = useState({
    industry: '',
    role: '',
    experience: '',
    location: '',
    culturalBackground: '',
    availability: ''
  });
  
  const [discoveredContacts, setDiscoveredContacts] = useState<ProfessionalContact[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityDiscovery[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<NetworkingEvent[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ProfessionalContact | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [connectionPurpose, setConnectionPurpose] = useState('');
  const [connectionType, setConnectionType] = useState<ConnectionRequest['requestType']>('informational_interview');

  // Initialize networking data
  useEffect(() => {
    loadNetworkingData();
  }, [userId, targetCareers]);

  const loadNetworkingData = async () => {
    try {
      // Load discovered contacts based on career interests
      const contacts = await discoverProfessionalContacts(
        targetCareers,
        culturalContext,
        searchFilters
      );
      setDiscoveredContacts(contacts);

      // Load opportunities
      const opportunitiesData = await discoverOpportunities(
        targetCareers,
        identityProfile,
        culturalContext
      );
      setOpportunities(opportunitiesData);

      // Load networking events
      const events = await loadNetworkingEvents(
        targetCareers,
        culturalContext.region
      );
      setUpcomingEvents(events);

    } catch (error) {
      console.error('Error loading networking data:', error);
    }
  };

  // Handle connection request
  const handleConnectionRequest = useCallback(async () => {
    if (!selectedContact || !connectionMessage.trim()) return;

    const request: ConnectionRequest = {
      requestId: `request_${Date.now()}`,
      requestType: connectionType,
      targetPerson: selectedContact,
      message: connectionMessage,
      purpose: connectionPurpose,
      timeframe: getConnectionTimeframe(connectionType),
      culturalConsiderations: generateCulturalConsiderations(
        selectedContact,
        culturalContext
      )
    };

    try {
      await submitConnectionRequest(request);
      setConnectionRequests(prev => [...prev, request]);
      onConnectionRequest?.(request);
      
      // Reset modal
      setShowConnectionModal(false);
      setSelectedContact(null);
      setConnectionMessage('');
      setConnectionPurpose('');
      
    } catch (error) {
      console.error('Error submitting connection request:', error);
    }
  }, [selectedContact, connectionMessage, connectionPurpose, connectionType, culturalContext, onConnectionRequest]);

  // Render discovery tab
  const renderDiscoveryTab = () => {
    return (
      <div className="space-y-6">
        {/* Search filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Discover Professionals</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              value={searchFilters.industry}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, industry: e.target.value }))}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              {getIndustryOptions().map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            
            <select
              value={searchFilters.role}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, role: e.target.value }))}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {getRoleOptions().map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select
              value={searchFilters.location}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Locations</option>
              {getLocationOptions().map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <button
            onClick={loadNetworkingData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Search Professionals
          </button>
        </div>

        {/* Discovered contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoveredContacts.map((contact) => (
            <div
              key={contact.contactId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800">{contact.name}</h4>
                  <p className="text-gray-600 text-sm">{contact.title}</p>
                  <p className="text-gray-500 text-sm">{contact.company}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  contact.availabilityType === 'high' ? 'bg-green-100 text-green-700' :
                  contact.availabilityType === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {contact.availabilityType} availability
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Experience:</span>
                  <span className="ml-2 font-medium">{contact.experience} years</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2">{contact.location}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Connection:</span>
                  <span className="ml-2">{contact.connectionPath}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Expertise:</div>
                <div className="flex flex-wrap gap-1">
                  {contact.expertise.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {contact.expertise.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{contact.expertise.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {contact.culturalBackground.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Cultural Background:</div>
                  <div className="text-sm text-purple-600">
                    {contact.culturalBackground.join(', ')}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedContact(contact);
                    setConnectionType('informational_interview');
                    setShowConnectionModal(true);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Request Interview
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setConnectionType('job_shadowing');
                      setShowConnectionModal(true);
                    }}
                    className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50"
                  >
                    Job Shadow
                  </button>
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setConnectionType('mentorship');
                      setShowConnectionModal(true);
                    }}
                    className="px-3 py-1 border border-purple-600 text-purple-600 rounded text-sm hover:bg-purple-50"
                  >
                    Mentorship
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render opportunities tab
  const renderOpportunitiesTab = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Real-World Opportunities
          </h3>
          <p className="text-gray-600">
            Discover internships, volunteer opportunities, projects, and openings aligned with your career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.opportunityId}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${
                    opportunity.type === 'job_opening' ? 'bg-green-100 text-green-700' :
                    opportunity.type === 'internship' ? 'bg-blue-100 text-blue-700' :
                    opportunity.type === 'volunteer' ? 'bg-purple-100 text-purple-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {opportunity.type.replace('_', ' ').toUpperCase()}
                  </div>
                  <h4 className="font-semibold text-gray-800">{opportunity.title}</h4>
                  <p className="text-gray-600 text-sm">{opportunity.organization}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Deadline: {opportunity.applicationDeadline.toLocaleDateString()}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4">{opportunity.description}</p>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Requirements:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {opportunity.requirements.slice(0, 3).map((req, index) => (
                      <li key={index}>• {req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Benefits:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {opportunity.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cultural Fit:</span>
                    <span className="ml-1 font-medium text-purple-600">
                      {Math.round(opportunity.culturalFit * 100)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Career Relevance:</span>
                    <span className="ml-1 font-medium text-blue-600">
                      {Math.round(opportunity.careerRelevance * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Apply Now
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  Save
                </button>
                {opportunity.contactPerson && (
                  <button
                    onClick={() => {
                      setSelectedContact(opportunity.contactPerson!);
                      setConnectionType('general_networking');
                      setShowConnectionModal(true);
                    }}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render events tab
  const renderEventsTab = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Networking Events & Opportunities
          </h3>
          <p className="text-gray-600">
            Join industry events, workshops, and networking sessions in your area
          </p>
        </div>

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.eventId}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      event.eventType === 'in_person' ? 'bg-green-100 text-green-700' :
                      event.eventType === 'virtual' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {event.eventType}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{event.date.toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{event.startTime} - {event.endTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="ml-2">{event.location}</span>
                    </div>
                  </div>

                  {event.targetAudience && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Target Audience:</span>
                      <span className="ml-2 text-sm">{event.targetAudience}</span>
                    </div>
                  )}

                  {event.culturalFocus && (
                    <div className="mt-2">
                      <span className="text-sm text-purple-600">Cultural Focus: {event.culturalFocus}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button
                    onClick={() => onNetworkingEventJoin?.(event.eventId)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Join Event
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                    Save for Later
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render connection modal
  const renderConnectionModal = () => {
    if (!showConnectionModal || !selectedContact) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Connect with {selectedContact.name}
            </h3>
            <button
              onClick={() => setShowConnectionModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection Type
              </label>
              <select
                value={connectionType}
                onChange={(e) => setConnectionType(e.target.value as ConnectionRequest['requestType'])}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="informational_interview">Informational Interview</option>
                <option value="job_shadowing">Job Shadowing</option>
                <option value="mentorship">Mentorship</option>
                <option value="general_networking">General Networking</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose (What do you hope to learn or gain?)
              </label>
              <input
                type="text"
                value={connectionPurpose}
                onChange={(e) => setConnectionPurpose(e.target.value)}
                placeholder="e.g., Learn about day-to-day responsibilities in your role"
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message
              </label>
              <textarea
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                placeholder="Write a personalized message explaining your background and interest..."
                className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 min-h-32 resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Connection Tips</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Be specific about what you're looking for</li>
                <li>• Mention any shared connections or experiences</li>
                <li>• Show genuine interest in their career journey</li>
                <li>• Be respectful of their time and availability</li>
                <li>• Follow up appropriately after any interaction</li>
              </ul>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setShowConnectionModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConnectionRequest}
                disabled={!connectionMessage.trim() || !connectionPurpose.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Connection Request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderConnectionModal()}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Networking & Professional Connections
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with professionals, discover opportunities, and build meaningful relationships 
            that advance your career goals.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
          <div className="flex space-x-4">
            {[
              { id: 'discover', label: 'Discover People', icon: '🔍' },
              { id: 'opportunities', label: 'Opportunities', icon: '🎯' },
              { id: 'events', label: 'Events', icon: '📅' },
              { id: 'my_network', label: 'My Network', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'discover' && renderDiscoveryTab()}
        {activeTab === 'opportunities' && renderOpportunitiesTab()}
        {activeTab === 'events' && renderEventsTab()}
        {activeTab === 'my_network' && (
          <div className="text-center py-12">
            <p className="text-gray-600">My Network tab content would be implemented here</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
const getIndustryOptions = () => [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 
  'Design', 'Engineering', 'Sales', 'Human Resources', 'Consulting'
];

const getRoleOptions = () => [
  'Entry Level', 'Mid-Level', 'Senior Level', 'Management', 'Executive',
  'Freelancer', 'Entrepreneur', 'Consultant'
];

const getLocationOptions = () => [
  'Local', 'Remote', 'San Francisco', 'New York', 'Los Angeles', 
  'Chicago', 'Boston', 'Seattle', 'Austin', 'International'
];

const getConnectionTimeframe = (type: ConnectionRequest['requestType']): string => {
  switch (type) {
    case 'informational_interview': return '30-60 minutes';
    case 'job_shadowing': return '4-8 hours';
    case 'mentorship': return 'Ongoing relationship';
    case 'general_networking': return 'Brief introduction';
    default: return 'Flexible';
  }
};

const generateCulturalConsiderations = (
  contact: ProfessionalContact, 
  culturalContext: CulturalContext
): string[] => {
  const considerations = [];
  
  if (contact.culturalBackground.includes(culturalContext.primaryCulture)) {
    considerations.push('Shared cultural background');
  }
  
  if (culturalContext.communicationStyle === 'high_context') {
    considerations.push('High-context communication preferred');
  }
  
  return considerations;
};

// API functions (would be implemented)
const discoverProfessionalContacts = async (
  careers: CareerOption[], 
  cultural: CulturalContext, 
  filters: any
): Promise<ProfessionalContact[]> => {
  // Implementation would discover professionals
  return [];
};

const discoverOpportunities = async (
  careers: CareerOption[], 
  identity: IdentityExplorationProfile, 
  cultural: CulturalContext
): Promise<OpportunityDiscovery[]> => {
  // Implementation would discover opportunities
  return [];
};

const loadNetworkingEvents = async (
  careers: CareerOption[], 
  region: string
): Promise<NetworkingEvent[]> => {
  // Implementation would load events
  return [];
};

const submitConnectionRequest = async (request: ConnectionRequest): Promise<void> => {
  // Implementation would submit connection request
};

// Supporting interfaces
interface CommunicationPreference {
  method: 'email' | 'phone' | 'video_call' | 'in_person';
  timePreference: 'morning' | 'afternoon' | 'evening' | 'weekend';
  responseTime: 'immediate' | 'same_day' | 'few_days' | 'week';
}

export default NetworkingConnectionHub;