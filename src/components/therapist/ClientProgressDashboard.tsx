'use client';

/**
 * HIPAA-Compliant Client Progress Dashboard
 * 
 * Professional-grade dashboard for therapists to visualize client progress
 * with journey visualization, pattern recognition, and outcome tracking.
 * All data sharing requires explicit client consent and follows HIPAA guidelines.
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { therapistToolsPlatform, type ClientConnection, type SessionPrepData, type OutcomeTracking } from '@/lib/professional/therapist-tools-platform';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ClientProgressDashboardProps {
  therapistId: string;
  selectedClientId?: string;
}

interface ProgressMetrics {
  journalConsistency: number;
  pathwayCompletion: number;
  moodImprovement: number;
  crisisResourceUsage: number;
  sessionAttendance: number;
}

interface JourneyVisualization {
  pathwayName: string;
  completionPercentage: number;
  timeSpent: number;
  keyMilestones: string[];
  lastActivity: Date;
}

export default function ClientProgressDashboard({ 
  therapistId, 
  selectedClientId 
}: ClientProgressDashboardProps) {
  const [connectedClients, setConnectedClients] = useState<ClientConnection[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientConnection | null>(null);
  const [progressMetrics, setProgressMetrics] = useState<ProgressMetrics | null>(null);
  const [journeyData, setJourneyData] = useState<JourneyVisualization[]>([]);
  const [outcomeData, setOutcomeData] = useState<OutcomeTracking | null>(null);
  const [sessionPrepHistory, setSessionPrepHistory] = useState<SessionPrepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'journeys' | 'outcomes' | 'prep'>('overview');

  useEffect(() => {
    loadConnectedClients();
  }, [therapistId]);

  useEffect(() => {
    if (selectedClientId && connectedClients.length > 0) {
      const client = connectedClients.find(c => c.clientUserId === selectedClientId);
      if (client) {
        setSelectedClient(client);
        loadClientData(client);
      }
    }
  }, [selectedClientId, connectedClients]);

  const loadConnectedClients = async () => {
    try {
      const clientsQuery = query(
        collection(db, 'clientConnections'),
        where('therapistId', '==', therapistId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(clientsQuery);
      const clients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClientConnection[];
      
      setConnectedClients(clients);
      
      if (clients.length > 0 && !selectedClient) {
        setSelectedClient(clients[0]);
        loadClientData(clients[0]);
      }
    } catch (error) {
      console.error('Error loading connected clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientData = async (client: ClientConnection) => {
    if (!client.clientConsent.shareProgressData) {
      setProgressMetrics(null);
      setJourneyData([]);
      setOutcomeData(null);
      return;
    }

    try {
      await Promise.all([
        loadProgressMetrics(client.clientUserId),
        loadJourneyVisualization(client.clientUserId),
        loadOutcomeTracking(client),
        loadSessionPrepHistory(client)
      ]);
    } catch (error) {
      console.error('Error loading client data:', error);
    }
  };

  const loadProgressMetrics = async (clientUserId: string) => {
    // Mock implementation - would integrate with ALCHM's analytics
    const metrics: ProgressMetrics = {
      journalConsistency: 0.85,
      pathwayCompletion: 0.67,
      moodImprovement: 0.23,
      crisisResourceUsage: 0.12,
      sessionAttendance: 0.95
    };
    
    setProgressMetrics(metrics);
  };

  const loadJourneyVisualization = async (clientUserId: string) => {
    // Mock implementation - would fetch actual pathway data
    const journeys: JourneyVisualization[] = [
      {
        pathwayName: 'Emotional Regulation Fundamentals',
        completionPercentage: 78,
        timeSpent: 240, // minutes
        keyMilestones: ['Breathing Techniques', 'Trigger Identification'],
        lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        pathwayName: 'Anxiety Management Toolkit',
        completionPercentage: 45,
        timeSpent: 180,
        keyMilestones: ['Grounding Exercises'],
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
    
    setJourneyData(journeys);
  };

  const loadOutcomeTracking = async (client: ClientConnection) => {
    try {
      const outcomeQuery = query(
        collection(db, 'outcomeTracking'),
        where('therapistId', '==', therapistId),
        where('clientUserId', '==', client.clientUserId)
      );
      
      const snapshot = await getDocs(outcomeQuery);
      if (!snapshot.empty) {
        const outcome = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as OutcomeTracking;
        setOutcomeData(outcome);
      }
    } catch (error) {
      console.error('Error loading outcome tracking:', error);
    }
  };

  const loadSessionPrepHistory = async (client: ClientConnection) => {
    try {
      const prepQuery = query(
        collection(db, 'sessionPrep'),
        where('therapistId', '==', therapistId),
        where('clientUserId', '==', client.clientUserId),
        orderBy('sessionDate', 'desc'),
        orderBy('generatedAt', 'desc')
      );
      
      const snapshot = await getDocs(prepQuery);
      const prepData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SessionPrepData[];
      
      setSessionPrepHistory(prepData);
    } catch (error) {
      console.error('Error loading session prep history:', error);
    }
  };

  const generateNewSessionPrep = async () => {
    if (!selectedClient) return;
    
    try {
      const sessionDate = new Date();
      sessionDate.setDate(sessionDate.getDate() + 1); // Tomorrow
      
      await therapistToolsPlatform.generateSessionPrep(
        therapistId,
        selectedClient.clientUserId,
        sessionDate
      );
      
      await loadSessionPrepHistory(selectedClient);
    } catch (error) {
      console.error('Error generating session prep:', error);
    }
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;
  const formatDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading client dashboard...</div>
      </div>
    );
  }

  if (connectedClients.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-medium mb-4">No Connected Clients</h3>
        <p className="text-gray-600 mb-6">
          Generate a connection code to invite clients to share their ALCHM progress with you.
        </p>
        <Button>Generate Connection Code</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Client Selector */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Client Progress Dashboard</h2>
            <p className="text-sm text-gray-600">HIPAA-compliant therapeutic insights</p>
          </div>
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = connectedClients.find(c => c.id === e.target.value);
              if (client) {
                setSelectedClient(client);
                loadClientData(client);
              }
            }}
            className="px-3 py-2 border rounded-md"
          >
            {connectedClients.map(client => (
              <option key={client.id} value={client.id}>
                Client {client.id.slice(-6)} {/* Anonymized display */}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {selectedClient && (
        <>
          {/* Consent Status */}
          <Card className="p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Data Sharing Consent</h3>
                <div className="flex gap-2 mt-2">
                  <Badge variant={selectedClient.clientConsent.shareProgressData ? 'default' : 'secondary'}>
                    Progress Data: {selectedClient.clientConsent.shareProgressData ? 'Consented' : 'Not Consented'}
                  </Badge>
                  <Badge variant={selectedClient.clientConsent.shareConcernAlerts ? 'default' : 'secondary'}>
                    Concern Alerts: {selectedClient.clientConsent.shareConcernAlerts ? 'Consented' : 'Not Consented'}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Consent Date: {selectedClient.clientConsent.consentDate.toDate().toLocaleDateString()}
              </div>
            </div>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'journeys', label: 'Pathways' },
              { key: 'outcomes', label: 'Outcomes' },
              { key: 'prep', label: 'Session Prep' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Panels */}
          {!selectedClient.clientConsent.shareProgressData ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Data Sharing Not Consented</h3>
              <p className="text-gray-600">
                This client has not consented to share their progress data.
                Please discuss data sharing benefits during your next session.
              </p>
            </Card>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && progressMetrics && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <h4 className="font-medium mb-4">Engagement Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Journal Consistency</span>
                        <span className="font-medium">{formatPercentage(progressMetrics.journalConsistency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pathway Completion</span>
                        <span className="font-medium">{formatPercentage(progressMetrics.pathwayCompletion)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session Attendance</span>
                        <span className="font-medium">{formatPercentage(progressMetrics.sessionAttendance)}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-medium mb-4">Wellness Indicators</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Mood Improvement</span>
                        <span className="font-medium text-green-600">+{formatPercentage(progressMetrics.moodImprovement)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Crisis Resource Usage</span>
                        <span className="font-medium">{formatPercentage(progressMetrics.crisisResourceUsage)}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h4 className="font-medium mb-4">Treatment Goals</h4>
                    <div className="space-y-2">
                      {selectedClient.treatmentGoals.length > 0 ? (
                        selectedClient.treatmentGoals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="block text-left">
                            {goal}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600">No treatment goals set</p>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* Pathways Tab */}
              {activeTab === 'journeys' && (
                <div className="space-y-4">
                  {journeyData.map((journey, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-medium">{journey.pathwayName}</h4>
                          <p className="text-sm text-gray-600">
                            Last activity: {formatDaysAgo(journey.lastActivity)}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {journey.completionPercentage}% Complete
                        </Badge>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${journey.completionPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Time Spent: {Math.floor(journey.timeSpent / 60)}h {journey.timeSpent % 60}m</span>
                        <span>Milestones: {journey.keyMilestones.join(', ')}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Outcomes Tab */}
              {activeTab === 'outcomes' && outcomeData && (
                <Card className="p-6">
                  <h4 className="font-medium mb-4">Outcome Tracking</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-3">Baseline Measures</h5>
                      <div className="space-y-2">
                        {outcomeData.baseline.depressionScore && (
                          <div className="flex justify-between">
                            <span>Depression Score</span>
                            <span>{outcomeData.baseline.depressionScore}</span>
                          </div>
                        )}
                        {outcomeData.baseline.anxietyScore && (
                          <div className="flex justify-between">
                            <span>Anxiety Score</span>
                            <span>{outcomeData.baseline.anxietyScore}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-3">Latest Checkpoint</h5>
                      {outcomeData.checkpoints.length > 0 && (
                        <div className="space-y-2">
                          {outcomeData.checkpoints[outcomeData.checkpoints.length - 1].depressionScore && (
                            <div className="flex justify-between">
                              <span>Depression Score</span>
                              <span className="text-green-600">
                                {outcomeData.checkpoints[outcomeData.checkpoints.length - 1].depressionScore}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Session Prep Tab */}
              {activeTab === 'prep' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Session Preparation History</h4>
                    <Button onClick={generateNewSessionPrep}>
                      Generate New Session Prep
                    </Button>
                  </div>
                  
                  {sessionPrepHistory.map(prep => (
                    <Card key={prep.id} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="font-medium">
                          Session: {prep.sessionDate.toDate().toLocaleDateString()}
                        </h5>
                        <Badge variant={prep.isReviewed ? 'default' : 'secondary'}>
                          {prep.isReviewed ? 'Reviewed' : 'Pending Review'}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h6 className="font-medium mb-2">Suggested Discussion Topics</h6>
                          <ul className="text-sm space-y-1">
                            {prep.suggestedTopics.map((topic, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="font-medium mb-2">Questions to Explore</h6>
                          <ul className="text-sm space-y-1">
                            {prep.questionsToExplore.map((question, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-600 mr-2">?</span>
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}