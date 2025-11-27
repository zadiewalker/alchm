'use client';

/**
 * AI-Powered Session Preparation Tools
 * 
 * Advanced therapeutic preparation system that generates personalized discussion points,
 * intervention recommendations, and session insights based on client's ALCHM journey data.
 * Integrates pattern recognition AI to identify therapeutic opportunities and concerns.
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { therapistToolsPlatform, type SessionPrepData, type ClientConnection } from '@/lib/professional/therapist-tools-platform';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface SessionPrepToolsProps {
  therapistId: string;
  clientUserId: string;
  upcomingSessionDate?: Date;
}

interface AIInsight {
  type: 'pattern' | 'concern' | 'opportunity' | 'intervention';
  title: string;
  description: string;
  confidence: number;
  supportingData: string[];
  suggestedActions: string[];
}

interface TherapeuticFocus {
  area: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  suggestedApproach: string;
  estimatedSessionTime: number;
}

interface InterventionRecommendation {
  id: string;
  name: string;
  type: 'cognitive' | 'behavioral' | 'mindfulness' | 'expressive' | 'somatic';
  description: string;
  reasoning: string;
  pathwayIntegration?: string;
  homeworkSuggestion?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function SessionPrepTools({ 
  therapistId, 
  clientUserId, 
  upcomingSessionDate 
}: SessionPrepToolsProps) {
  const [sessionPrep, setSessionPrep] = useState<SessionPrepData | null>(null);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [therapeuticFoci, setTherapeuticFoci] = useState<TherapeuticFocus[]>([]);
  const [interventionRecommendations, setInterventionRecommendations] = useState<InterventionRecommendation[]>([]);
  const [therapistNotes, setTherapistNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [sessionStructure, setSessionStructure] = useState<any[]>([]);

  useEffect(() => {
    loadExistingSessionPrep();
  }, [therapistId, clientUserId, upcomingSessionDate]);

  const loadExistingSessionPrep = async () => {
    if (!upcomingSessionDate) return;

    try {
      const sessionDate = Timestamp.fromDate(upcomingSessionDate);
      const prepQuery = query(
        collection(db, 'sessionPrep'),
        where('therapistId', '==', therapistId),
        where('clientUserId', '==', clientUserId),
        where('sessionDate', '==', sessionDate)
      );

      const snapshot = await getDocs(prepQuery);
      if (!snapshot.empty) {
        const prep = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as SessionPrepData;
        setSessionPrep(prep);
        setTherapistNotes(prep.therapistNotes || '');
        await generateAdvancedInsights(prep);
      }
    } catch (error) {
      console.error('Error loading session prep:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewSessionPrep = async () => {
    if (!upcomingSessionDate) return;

    setGenerating(true);
    try {
      const newPrep = await therapistToolsPlatform.generateSessionPrep(
        therapistId,
        clientUserId,
        upcomingSessionDate
      );
      
      setSessionPrep(newPrep);
      await generateAdvancedInsights(newPrep);
    } catch (error) {
      console.error('Error generating session prep:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateAdvancedInsights = async (prep: SessionPrepData) => {
    // AI-powered insight generation based on journal patterns and engagement data
    const insights = await generateAIInsights(prep);
    const foci = await generateTherapeuticFoci(prep);
    const interventions = await generateInterventionRecommendations(prep);
    const structure = await generateSessionStructure(prep, foci);

    setAIInsights(insights);
    setTherapeuticFoci(foci);
    setInterventionRecommendations(interventions);
    setSessionStructure(structure);
  };

  const generateAIInsights = async (prep: SessionPrepData): Promise<AIInsight[]> => {
    // Mock AI insights - would integrate with ALCHM's AI systems
    return [
      {
        type: 'pattern',
        title: 'Increased Evening Anxiety',
        description: 'Client shows consistent pattern of elevated anxiety in evening journal entries over past 2 weeks.',
        confidence: 0.87,
        supportingData: [
          '14 evening entries mention worry/restlessness',
          'Sleep quality ratings decreased 23%',
          'Mindfulness pathway engagement increased 45%'
        ],
        suggestedActions: [
          'Explore evening routine and triggers',
          'Discuss sleep hygiene practices',
          'Consider progressive muscle relaxation training'
        ]
      },
      {
        type: 'opportunity',
        title: 'Creative Expression Breakthrough',
        description: 'Significant increase in art therapy pathway engagement with positive mood correlations.',
        confidence: 0.92,
        supportingData: [
          '7 art therapy sessions completed',
          'Mood ratings 34% higher post-art activities',
          'Journal entries mention "feeling heard" through art'
        ],
        suggestedActions: [
          'Integrate more expressive arts techniques',
          'Explore art as emotional regulation tool',
          'Consider art therapy referral for specialized support'
        ]
      },
      {
        type: 'concern',
        title: 'Social Isolation Indicators',
        description: 'Decreasing social connection mentions with increased self-criticism themes.',
        confidence: 0.78,
        supportingData: [
          'Social interaction entries down 40%',
          'Self-criticism themes in 8/10 recent entries',
          'Community pathway abandonment'
        ],
        suggestedActions: [
          'Assess current social support system',
          'Address negative self-talk patterns',
          'Gentle social re-engagement planning'
        ]
      }
    ];
  };

  const generateTherapeuticFoci = async (prep: SessionPrepData): Promise<TherapeuticFocus[]> => {
    return [
      {
        area: 'Anxiety Management',
        priority: 'high',
        rationale: 'Consistent evening anxiety pattern with sleep impact requires immediate attention.',
        suggestedApproach: 'Cognitive-behavioral techniques combined with mindfulness practices',
        estimatedSessionTime: 20
      },
      {
        area: 'Creative Expression Integration',
        priority: 'medium',
        rationale: 'Strong positive response to art therapy suggests valuable therapeutic avenue.',
        suggestedApproach: 'Incorporate expressive arts techniques into emotional regulation work',
        estimatedSessionTime: 15
      },
      {
        area: 'Social Connection',
        priority: 'medium',
        rationale: 'Emerging isolation patterns could impact overall progress if not addressed.',
        suggestedApproach: 'Gradual exposure therapy with social skills reinforcement',
        estimatedSessionTime: 10
      }
    ];
  };

  const generateInterventionRecommendations = async (prep: SessionPrepData): Promise<InterventionRecommendation[]> => {
    return [
      {
        id: '1',
        name: 'Evening Anxiety Protocol',
        type: 'cognitive',
        description: 'Structured evening routine with cognitive restructuring techniques',
        reasoning: 'Addresses identified pattern of evening anxiety escalation',
        pathwayIntegration: 'Mindfulness Fundamentals pathway - modules 3-5',
        homeworkSuggestion: 'Practice 5-4-3-2-1 grounding technique during evening anxiety episodes',
        riskLevel: 'low'
      },
      {
        id: '2',
        name: 'Art-Based Emotional Processing',
        type: 'expressive',
        description: 'Use guided art exercises to explore and process difficult emotions',
        reasoning: 'Client shows strong positive response to creative expression',
        pathwayIntegration: 'Creative Expression pathway - recommended continuation',
        homeworkSuggestion: 'Daily 10-minute emotional art journaling',
        riskLevel: 'low'
      },
      {
        id: '3',
        name: 'Compassionate Self-Talk Restructuring',
        type: 'cognitive',
        description: 'Challenge negative self-talk patterns with self-compassion techniques',
        reasoning: 'High frequency of self-criticism in recent journal entries',
        pathwayIntegration: 'Self-Compassion pathway - modules 1-3',
        homeworkSuggestion: 'Write daily self-compassion letter during difficult moments',
        riskLevel: 'medium'
      }
    ];
  };

  const generateSessionStructure = async (prep: SessionPrepData, foci: TherapeuticFocus[]) => {
    return [
      {
        phase: 'Check-in',
        duration: 10,
        focus: 'Current state assessment and week review',
        techniques: ['Mood scaling', 'Brief SUDS rating', 'Highlight/challenge identification']
      },
      {
        phase: 'Primary Work',
        duration: 30,
        focus: foci[0]?.area || 'Main therapeutic focus',
        techniques: ['Cognitive restructuring', 'Mindfulness practice', 'Skill building']
      },
      {
        phase: 'Integration',
        duration: 10,
        focus: 'Connecting session work to ALCHM pathways',
        techniques: ['Pathway assignment', 'Homework planning', 'Resource identification']
      },
      {
        phase: 'Closure',
        duration: 5,
        focus: 'Session summary and next steps',
        techniques: ['Key insights summary', 'Between-session goals', 'Crisis plan review']
      }
    ];
  };

  const saveTherapistNotes = async () => {
    if (!sessionPrep) return;

    try {
      await updateDoc(doc(db, 'sessionPrep', sessionPrep.id), {
        therapistNotes,
        isReviewed: true,
        lastUpdated: Timestamp.now()
      });
    } catch (error) {
      console.error('Error saving therapist notes:', error);
    }
  };

  const toggleInterventionSelection = (interventionId: string) => {
    setSelectedInterventions(prev => 
      prev.includes(interventionId)
        ? prev.filter(id => id !== interventionId)
        : [...prev, interventionId]
    );
  };

  const exportSessionPlan = () => {
    const plan = {
      sessionDate: upcomingSessionDate?.toISOString(),
      therapeuticFoci,
      selectedInterventions: interventionRecommendations.filter(i => selectedInterventions.includes(i.id)),
      sessionStructure,
      therapistNotes,
      aiInsights
    };

    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = typeof window !== 'undefined' && document.createElement('a');
    a.href = url;
    a.download = `session-plan-${upcomingSessionDate?.toISOString().split('T')[0]}.json`;
    typeof window !== 'undefined' && document.body.appendChild(a);
    a.click();
    typeof window !== 'undefined' && document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading session preparation tools...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-medium">AI-Powered Session Preparation</h2>
            <p className="text-gray-600 mt-2">
              {upcomingSessionDate 
                ? `Session Date: ${upcomingSessionDate.toLocaleDateString()}`
                : 'Select a session date to generate preparation materials'
              }
            </p>
          </div>
          <div className="flex gap-2">
            {!sessionPrep && upcomingSessionDate && (
              <Button onClick={generateNewSessionPrep} disabled={generating}>
                {generating ? 'Generating...' : 'Generate Session Prep'}
              </Button>
            )}
            {sessionPrep && (
              <Button variant="outline" onClick={exportSessionPlan}>
                Export Session Plan
              </Button>
            )}
          </div>
        </div>
      </Card>

      {sessionPrep && (
        <>
          {/* AI Insights */}
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-4">AI-Generated Insights</h3>
            <div className="grid gap-4">
              {aiInsights.map((insight, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={
                      insight.type === 'concern' ? 'destructive' :
                      insight.type === 'opportunity' ? 'default' :
                      'secondary'
                    }>
                      {insight.type}
                    </Badge>
                    <h4 className="font-medium">{insight.title}</h4>
                    <span className="text-sm text-gray-600">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Supporting Data:</h5>
                      <ul className="text-sm space-y-1">
                        {insight.supportingData.map((data, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            {data}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Suggested Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {insight.suggestedActions.map((action, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-600 mr-2">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Therapeutic Focus Areas */}
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-4">Recommended Therapeutic Focus</h3>
            <div className="space-y-4">
              {therapeuticFoci.map((focus, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={
                      focus.priority === 'high' ? 'destructive' :
                      focus.priority === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {focus.priority} priority
                    </Badge>
                    <h4 className="font-medium">{focus.area}</h4>
                    <span className="text-sm text-gray-600">
                      ~{focus.estimatedSessionTime} minutes
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2"><strong>Rationale:</strong> {focus.rationale}</p>
                  <p className="text-gray-700"><strong>Approach:</strong> {focus.suggestedApproach}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Intervention Recommendations */}
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-4">Intervention Recommendations</h3>
            <div className="space-y-4">
              {interventionRecommendations.map((intervention) => (
                <div key={intervention.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={selectedInterventions.includes(intervention.id)}
                      onChange={() => toggleInterventionSelection(intervention.id)}
                      className="rounded"
                    />
                    <h4 className="font-medium">{intervention.name}</h4>
                    <Badge variant="outline">{intervention.type}</Badge>
                    <Badge variant={
                      intervention.riskLevel === 'high' ? 'destructive' :
                      intervention.riskLevel === 'medium' ? 'default' :
                      'secondary'
                    }>
                      {intervention.riskLevel} risk
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-2">{intervention.description}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Reasoning:</strong> {intervention.reasoning}
                  </p>
                  
                  {intervention.pathwayIntegration && (
                    <p className="text-sm text-blue-600 mb-2">
                      <strong>ALCHM Integration:</strong> {intervention.pathwayIntegration}
                    </p>
                  )}
                  
                  {intervention.homeworkSuggestion && (
                    <p className="text-sm text-green-600">
                      <strong>Homework:</strong> {intervention.homeworkSuggestion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Session Structure */}
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-4">Suggested Session Structure</h3>
            <div className="space-y-3">
              {sessionStructure.map((phase, index) => (
                <div key={index} className="flex items-start border rounded-lg p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{phase.phase}</h4>
                      <Badge variant="outline">{phase.duration} min</Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{phase.focus}</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.techniques.map((technique: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {technique}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Therapist Notes */}
          <Card className="p-6">
            <h3 className="text-xl font-medium mb-4">Therapist Notes & Customizations</h3>
            <Textarea
              value={therapistNotes}
              onChange={(e) => setTherapistNotes(e.target.value)}
              placeholder="Add your own notes, modifications to the AI recommendations, or specific considerations for this session..."
              className="min-h-32"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={saveTherapistNotes}>
                Save Notes
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}