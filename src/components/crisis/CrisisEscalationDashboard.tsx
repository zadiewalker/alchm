/**
 * ALCHM Crisis Escalation Dashboard
 * 
 * Professional interface for managing crisis interventions, monitoring
 * escalation levels, and coordinating emergency responses.
 * 
 * Features:
 * - Real-time crisis event monitoring
 * - Multi-level escalation tracking
 * - Professional assignment and coordination
 * - Resource allocation dashboard
 * - Compliance and documentation oversight
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Types from our crisis system
interface CrisisEvent {
  id: string;
  userId: string;
  timestamp: Date;
  severity: 'low' | 'moderate' | 'high' | 'severe' | 'imminent';
  triggerType: 'ai_detection' | 'user_reported' | 'professional_assessment' | 'emergency_contact';
  currentLevel: 1 | 2 | 3 | 4;
  status: 'active' | 'in_progress' | 'resolved' | 'escalated';
  assignedProfessional?: string;
  estimatedResponseTime?: Date;
  culturalContext?: {
    primaryLanguage: string;
    culturalBackground?: string;
    specialNeeds?: string[];
  };
  location?: {
    region: string;
    timezone: string;
  };
}

interface ProfessionalStatus {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'busy' | 'in_session' | 'offline';
  currentCaseload: number;
  maxCaseload: number;
  specialties: string[];
  responseTime: number;
  culturalCompetencies: string[];
}

interface EscalationMetrics {
  totalActiveEvents: number;
  level1Events: number;
  level2Events: number;
  level3Events: number;
  level4Events: number;
  averageResponseTime: number;
  professionalUtilization: number;
  resolutionRate: number;
  escalationRate: number;
}

interface CrisisResource {
  id: string;
  name: string;
  type: 'mobile_team' | 'crisis_line' | 'emergency_service' | 'community_resource';
  availability: 'available' | 'busy' | 'offline';
  responseTime: number;
  coverage: string[];
  capacity: number;
  currentUtilization: number;
}

export function CrisisEscalationDashboard() {
  const [activeEvents, setActiveEvents] = useState<CrisisEvent[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalStatus[]>([]);
  const [metrics, setMetrics] = useState<EscalationMetrics | null>(null);
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Real-time data updates
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In real implementation, these would be API calls
        setActiveEvents(mockActiveEvents);
        setProfessionals(mockProfessionals);
        setMetrics(mockMetrics);
        setResources(mockResources);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEventSelect = useCallback((event: CrisisEvent) => {
    setSelectedEvent(event);
  }, []);

  const handleAssignProfessional = useCallback(async (eventId: string, professionalId: string) => {
    try {
      // API call to assign professional
      setActiveEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, assignedProfessional: professionalId, status: 'in_progress' as const }
          : event
      ));
    } catch (error) {
      console.error('Failed to assign professional:', error);
    }
  }, []);

  const handleEscalateEvent = useCallback(async (eventId: string, targetLevel: number) => {
    try {
      // API call to escalate event
      setActiveEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, currentLevel: targetLevel as 1 | 2 | 3 | 4, status: 'escalated' as const }
          : event
      ));
    } catch (error) {
      console.error('Failed to escalate event:', error);
    }
  }, []);

  const filteredEvents = activeEvents.filter(event => {
    const severityMatch = filterSeverity === 'all' || event.severity === filterSeverity;
    const levelMatch = filterLevel === 'all' || event.currentLevel.toString() === filterLevel;
    return severityMatch && levelMatch;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'imminent': return 'bg-red-100 text-red-800 border-red-200';
      case 'severe': return 'bg-red-50 text-red-700 border-red-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'moderate': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-purple-100 text-purple-800';
      case 3: return 'bg-red-100 text-red-800';
      case 4: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'escalated': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading crisis dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">Crisis Escalation Command Center</h1>
          <p className="text-gray-600">Real-time monitoring and coordination of emergency interventions</p>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Events</p>
                  <p className="text-3xl font-medium text-red-600">{metrics.totalActiveEvents}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex space-x-2">
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">L3: {metrics.level3Events}</span>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">L2: {metrics.level2Events}</span>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-3xl font-medium text-blue-600">{metrics.averageResponseTime}m</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-3xl font-medium text-green-600">{Math.round(metrics.resolutionRate * 100)}%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Professional Utilization</p>
                  <p className="text-3xl font-medium text-purple-600">{Math.round(metrics.professionalUtilization * 100)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Events Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium text-gray-900">Active Crisis Events</h2>
                <div className="flex space-x-4">
                  <select 
                    value={filterSeverity} 
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Severities</option>
                    <option value="imminent">Imminent</option>
                    <option value="severe">Severe</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                  <select 
                    value={filterLevel} 
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="all">All Levels</option>
                    <option value="1">Level 1 - AI Detection</option>
                    <option value="2">Level 2 - Professional</option>
                    <option value="3">Level 3 - Emergency</option>
                    <option value="4">Level 4 - Follow-up</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No crisis events match current filters
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <div 
                      key={event.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedEvent?.id === event.id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleEventSelect(event)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(event.currentLevel)}`}>
                            Level {event.currentLevel}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                            {event.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        ID: {event.id} • Trigger: {event.triggerType.replace('_', ' ')}
                      </div>
                      
                      {event.culturalContext && (
                        <div className="text-xs text-gray-500 mb-2">
                          Language: {event.culturalContext.primaryLanguage} 
                          {event.culturalContext.culturalBackground && (
                            <> • Background: {event.culturalContext.culturalBackground}</>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {event.assignedProfessional ? (
                            <>Assigned to: {event.assignedProfessional}</>
                          ) : (
                            <>Unassigned</>
                          )}
                        </div>
                        {event.estimatedResponseTime && (
                          <div className="text-xs text-gray-500">
                            ETA: {new Date(event.estimatedResponseTime).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Professional Resources Panel */}
          <div className="space-y-6">
            {/* Available Professionals */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Professionals</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {professionals.filter(p => p.status === 'available').map((professional) => (
                  <div key={professional.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-green-900">{professional.name}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {professional.responseTime}m avg
                      </span>
                    </div>
                    <div className="text-xs text-green-700 mb-1">
                      {professional.role} • {professional.currentCaseload}/{professional.maxCaseload} cases
                    </div>
                    <div className="text-xs text-green-600">
                      {professional.specialties.slice(0, 2).join(', ')}
                      {professional.specialties.length > 2 && ` +${professional.specialties.length - 2}`}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Busy Professionals */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Busy Professionals</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {professionals.filter(p => p.status !== 'available' && p.status !== 'offline').map((professional) => (
                  <div key={professional.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-yellow-900">{professional.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        professional.status === 'in_session' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {professional.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      {professional.currentCaseload}/{professional.maxCaseload} cases
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Crisis Resources */}
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Crisis Resources</h3>
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{resource.name}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        resource.availability === 'available' ? 'bg-green-100 text-green-800' : 
                        resource.availability === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {resource.availability}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {resource.type.replace('_', ' ')} • {resource.responseTime}m response
                    </div>
                    <div className="text-xs text-gray-500">
                      Capacity: {resource.currentUtilization}/{resource.capacity}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Event Detail Panel */}
        {selectedEvent && (
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Crisis Event Details - {selectedEvent.id}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Event Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Severity:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${getSeverityColor(selectedEvent.severity)}`}>
                        {selectedEvent.severity}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Current Level:</span> {selectedEvent.currentLevel}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${getStatusColor(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Trigger:</span> {selectedEvent.triggerType.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Started:</span> {new Date(selectedEvent.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="space-y-2">
                    {!selectedEvent.assignedProfessional && (
                      <Button 
                        onClick={() => {
                          const availableProfessional = professionals.find(p => p.status === 'available');
                          if (availableProfessional) {
                            handleAssignProfessional(selectedEvent.id, availableProfessional.id);
                          }
                        }}
                        className="w-full"
                      >
                        Assign Professional
                      </Button>
                    )}
                    
                    {selectedEvent.currentLevel < 3 && (
                      <Button 
                        onClick={() => handleEscalateEvent(selectedEvent.id, selectedEvent.currentLevel + 1)}
                        variant="outline"
                        className="w-full"
                      >
                        Escalate to Level {selectedEvent.currentLevel + 1}
                      </Button>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      View Documentation
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      Contact Professional
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data for demonstration
const mockActiveEvents: CrisisEvent[] = [
  {
    id: 'evt_001',
    userId: 'user_001',
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    severity: 'severe',
    triggerType: 'ai_detection',
    currentLevel: 2,
    status: 'active',
    culturalContext: {
      primaryLanguage: 'es',
      culturalBackground: 'latino',
      specialNeeds: ['interpreter_needed']
    },
    location: {
      region: 'metro_west',
      timezone: 'America/Los_Angeles'
    }
  },
  {
    id: 'evt_002',
    userId: 'user_002',
    timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    severity: 'high',
    triggerType: 'user_reported',
    currentLevel: 2,
    status: 'in_progress',
    assignedProfessional: 'prof_001',
    estimatedResponseTime: new Date(Date.now() + 300000),
    culturalContext: {
      primaryLanguage: 'en'
    }
  }
];

const mockProfessionals: ProfessionalStatus[] = [
  {
    id: 'prof_001',
    name: 'Dr. Sarah Chen',
    role: 'Crisis Counselor',
    status: 'in_session',
    currentCaseload: 2,
    maxCaseload: 3,
    specialties: ['crisis_intervention', 'trauma_therapy'],
    responseTime: 3,
    culturalCompetencies: ['english', 'mandarin', 'asian_american']
  },
  {
    id: 'prof_002',
    name: 'Maria Rodriguez, LCSW',
    role: 'Crisis Counselor',
    status: 'available',
    currentCaseload: 1,
    maxCaseload: 4,
    specialties: ['bilingual_counseling', 'family_therapy'],
    responseTime: 2,
    culturalCompetencies: ['english', 'spanish', 'latino_hispanic']
  }
];

const mockMetrics: EscalationMetrics = {
  totalActiveEvents: 7,
  level1Events: 2,
  level2Events: 3,
  level3Events: 1,
  level4Events: 1,
  averageResponseTime: 4.2,
  professionalUtilization: 0.75,
  resolutionRate: 0.92,
  escalationRate: 0.15
};

const mockResources: CrisisResource[] = [
  {
    id: 'res_001',
    name: 'Mobile Crisis Team A',
    type: 'mobile_team',
    availability: 'available',
    responseTime: 15,
    coverage: ['metro_west', 'metro_central'],
    capacity: 4,
    currentUtilization: 1
  },
  {
    id: 'res_002',
    name: '24/7 Crisis Hotline',
    type: 'crisis_line',
    availability: 'available',
    responseTime: 1,
    coverage: ['statewide'],
    capacity: 20,
    currentUtilization: 8
  }
];