'use client';

/**
 * Pathway Prescription System for Therapeutic Assignments
 * 
 * Professional tool allowing therapists to prescribe specific ALCHM pathways
 * as therapeutic homework with customization, progress tracking, and integration
 * with treatment goals. Supports evidence-based pathway selection and monitoring.
 */

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface PathwayPrescriptionProps {
  therapistId: string;
  clientUserId: string;
}

interface PathwayTemplate {
  id: string;
  name: string;
  category: 'emotional-regulation' | 'anxiety-management' | 'depression-support' | 'trauma-recovery' | 'mindfulness' | 'creative-expression' | 'social-skills';
  description: string;
  estimatedDuration: number; // in days
  modulesCount: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  evidenceBase: string[];
  therapeuticOutcomes: string[];
  contraindications: string[];
  prerequisites: string[];
}

interface PathwayPrescription {
  id?: string;
  therapistId: string;
  clientUserId: string;
  pathwayId: string;
  pathwayName: string;
  
  // Prescription Details
  prescriptionDate: Timestamp;
  startDate: Timestamp;
  targetCompletionDate: Timestamp;
  
  // Therapeutic Integration
  treatmentGoals: string[];
  customInstructions: string;
  checkInFrequency: 'daily' | 'weekly' | 'biweekly';
  progressReportingEnabled: boolean;
  
  // Customizations
  modifiedModules: Array<{
    moduleId: string;
    modifications: string;
    reasoning: string;
  }>;
  additionalResources: string[];
  
  // Monitoring
  completionStatus: 'prescribed' | 'started' | 'in-progress' | 'completed' | 'discontinued';
  progressPercentage: number;
  lastActivity?: Timestamp;
  therapistNotes: string;
  
  // Outcomes
  clientFeedback?: string;
  therapeuticOutcomes?: string[];
  effectivenessRating?: number;
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface ProgressMetrics {
  modulesCompleted: number;
  totalModules: number;
  averageEngagementTime: number;
  consistencyScore: number;
  lastActivityDate: Date;
  challengingAreas: string[];
  breakthroughMoments: string[];
}

export default function PathwayPrescription({ therapistId, clientUserId }: PathwayPrescriptionProps) {
  const [availablePathways, setAvailablePathways] = useState<PathwayTemplate[]>([]);
  const [activePrescriptions, setActivePrescriptions] = useState<PathwayPrescription[]>([]);
  const [completedPrescriptions, setCompletedPrescriptions] = useState<PathwayPrescription[]>([]);
  const [selectedPathway, setSelectedPathway] = useState<PathwayTemplate | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [progressMetrics, setProgressMetrics] = useState<Record<string, ProgressMetrics>>({});
  const [loading, setLoading] = useState(true);

  // Prescription Form State
  const [prescriptionForm, setPrescriptionForm] = useState({
    startDate: '',
    targetDuration: 14,
    treatmentGoals: [''],
    customInstructions: '',
    checkInFrequency: 'weekly' as const,
    progressReportingEnabled: true,
    additionalResources: ['']
  });

  useEffect(() => {
    loadPathwayData();
  }, [therapistId, clientUserId]);

  const loadPathwayData = async () => {
    try {
      await Promise.all([
        loadAvailablePathways(),
        loadPrescriptions(),
        loadProgressMetrics()
      ]);
    } catch (error) {
      console.error('Error loading pathway data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailablePathways = async () => {
    // Mock pathway templates - would come from ALCHM's pathway registry
    const pathways: PathwayTemplate[] = [
      {
        id: 'emotional-regulation-basics',
        name: 'Emotional Regulation Fundamentals',
        category: 'emotional-regulation',
        description: 'Build core skills for recognizing, understanding, and managing emotions effectively.',
        estimatedDuration: 21,
        modulesCount: 12,
        difficultyLevel: 'beginner',
        evidenceBase: ['CBT', 'DBT', 'Mindfulness-based interventions'],
        therapeuticOutcomes: ['Improved emotional awareness', 'Reduced emotional reactivity', 'Enhanced coping skills'],
        contraindications: ['Active psychosis', 'Severe cognitive impairment'],
        prerequisites: []
      },
      {
        id: 'anxiety-toolkit',
        name: 'Comprehensive Anxiety Management Toolkit',
        category: 'anxiety-management',
        description: 'Evidence-based strategies for understanding and managing anxiety symptoms.',
        estimatedDuration: 28,
        modulesCount: 16,
        difficultyLevel: 'intermediate',
        evidenceBase: ['CBT', 'ACT', 'Exposure therapy principles'],
        therapeuticOutcomes: ['Reduced anxiety symptoms', 'Improved functional capacity', 'Enhanced self-efficacy'],
        contraindications: ['Untreated trauma', 'Substance abuse'],
        prerequisites: ['Basic emotional regulation skills']
      },
      {
        id: 'trauma-recovery-foundation',
        name: 'Trauma Recovery Foundation',
        category: 'trauma-recovery',
        description: 'Gentle, trauma-informed approach to building safety and resilience.',
        estimatedDuration: 42,
        modulesCount: 20,
        difficultyLevel: 'intermediate',
        evidenceBase: ['Trauma-informed care', 'EMDR principles', 'Somatic approaches'],
        therapeuticOutcomes: ['Increased sense of safety', 'Improved emotional regulation', 'Reduced trauma symptoms'],
        contraindications: ['Active substance abuse', 'Severe dissociation'],
        prerequisites: ['Established therapeutic relationship', 'Basic grounding skills']
      },
      {
        id: 'mindfulness-mastery',
        name: 'Mindfulness Mastery Program',
        category: 'mindfulness',
        description: 'Comprehensive mindfulness training for mental health and well-being.',
        estimatedDuration: 35,
        modulesCount: 14,
        difficultyLevel: 'beginner',
        evidenceBase: ['MBSR', 'MBCT', 'Mindfulness-based interventions'],
        therapeuticOutcomes: ['Increased present-moment awareness', 'Reduced rumination', 'Improved stress management'],
        contraindications: ['Acute psychosis', 'Severe depression with concentration issues'],
        prerequisites: []
      },
      {
        id: 'creative-healing',
        name: 'Creative Expression for Healing',
        category: 'creative-expression',
        description: 'Use art, writing, and creative practices for emotional processing and growth.',
        estimatedDuration: 30,
        modulesCount: 18,
        difficultyLevel: 'beginner',
        evidenceBase: ['Art therapy', 'Expressive arts therapy', 'Creative writing therapy'],
        therapeuticOutcomes: ['Enhanced emotional expression', 'Increased self-awareness', 'Improved mood'],
        contraindications: ['Severe perfectionism affecting engagement'],
        prerequisites: []
      }
    ];
    
    setAvailablePathways(pathways);
  };

  const loadPrescriptions = async () => {
    try {
      const prescriptionsQuery = query(
        collection(db, 'pathwayPrescriptions'),
        where('therapistId', '==', therapistId),
        where('clientUserId', '==', clientUserId)
      );

      const snapshot = await getDocs(prescriptionsQuery);
      const prescriptions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PathwayPrescription[];

      const active = prescriptions.filter(p => 
        ['prescribed', 'started', 'in-progress'].includes(p.completionStatus)
      );
      const completed = prescriptions.filter(p => 
        ['completed', 'discontinued'].includes(p.completionStatus)
      );

      setActivePrescriptions(active);
      setCompletedPrescriptions(completed);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    }
  };

  const loadProgressMetrics = async () => {
    // Mock progress metrics - would integrate with ALCHM's analytics
    const mockMetrics: Record<string, ProgressMetrics> = {
      'emotional-regulation-basics': {
        modulesCompleted: 8,
        totalModules: 12,
        averageEngagementTime: 25,
        consistencyScore: 0.78,
        lastActivityDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        challengingAreas: ['Distress tolerance', 'Interpersonal effectiveness'],
        breakthroughMoments: ['Recognized anger as secondary emotion', 'Successfully used grounding technique during panic']
      }
    };
    
    setProgressMetrics(mockMetrics);
  };

  const prescribePathway = async () => {
    if (!selectedPathway) return;

    try {
      const startDate = new Date(prescriptionForm.startDate);
      const targetCompletion = new Date(startDate);
      targetCompletion.setDate(targetCompletion.getDate() + prescriptionForm.targetDuration);

      const prescription: Omit<PathwayPrescription, 'id'> = {
        therapistId,
        clientUserId,
        pathwayId: selectedPathway.id,
        pathwayName: selectedPathway.name,
        prescriptionDate: Timestamp.now(),
        startDate: Timestamp.fromDate(startDate),
        targetCompletionDate: Timestamp.fromDate(targetCompletion),
        treatmentGoals: prescriptionForm.treatmentGoals.filter(goal => goal.trim()),
        customInstructions: prescriptionForm.customInstructions,
        checkInFrequency: prescriptionForm.checkInFrequency,
        progressReportingEnabled: prescriptionForm.progressReportingEnabled,
        modifiedModules: [],
        additionalResources: prescriptionForm.additionalResources.filter(resource => resource.trim()),
        completionStatus: 'prescribed',
        progressPercentage: 0,
        therapistNotes: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      await addDoc(collection(db, 'pathwayPrescriptions'), prescription);
      await loadPrescriptions();
      setShowPrescriptionForm(false);
      setSelectedPathway(null);
      resetPrescriptionForm();
    } catch (error) {
      console.error('Error prescribing pathway:', error);
    }
  };

  const updatePrescriptionNotes = async (prescriptionId: string, notes: string) => {
    try {
      await updateDoc(doc(db, 'pathwayPrescriptions', prescriptionId), {
        therapistNotes: notes,
        updatedAt: Timestamp.now()
      });
      await loadPrescriptions();
    } catch (error) {
      console.error('Error updating prescription notes:', error);
    }
  };

  const discontinuePathway = async (prescriptionId: string, reason: string) => {
    try {
      await updateDoc(doc(db, 'pathwayPrescriptions', prescriptionId), {
        completionStatus: 'discontinued',
        therapistNotes: `Discontinued: ${reason}`,
        updatedAt: Timestamp.now()
      });
      await loadPrescriptions();
    } catch (error) {
      console.error('Error discontinuing pathway:', error);
    }
  };

  const resetPrescriptionForm = () => {
    setPrescriptionForm({
      startDate: '',
      targetDuration: 14,
      treatmentGoals: [''],
      customInstructions: '',
      checkInFrequency: 'weekly',
      progressReportingEnabled: true,
      additionalResources: ['']
    });
  };

  const addFormField = (field: 'treatmentGoals' | 'additionalResources') => {
    setPrescriptionForm(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateFormField = (field: 'treatmentGoals' | 'additionalResources', index: number, value: string) => {
    setPrescriptionForm(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prescribed': return 'bg-blue-100 text-blue-800';
      case 'started': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading pathway prescription system...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-medium">Pathway Prescription System</h2>
            <p className="text-gray-600 mt-2">
              Prescribe evidence-based ALCHM pathways as therapeutic homework
            </p>
          </div>
          <Button onClick={() => setShowPrescriptionForm(true)}>
            Prescribe New Pathway
          </Button>
        </div>
      </Card>

      {/* Active Prescriptions */}
      {activePrescriptions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">Active Prescriptions</h3>
          <div className="space-y-4">
            {activePrescriptions.map(prescription => {
              const metrics = progressMetrics[prescription.pathwayId];
              return (
                <div key={prescription.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{prescription.pathwayName}</h4>
                      <p className="text-sm text-gray-600">
                        Prescribed: {prescription.prescriptionDate.toDate().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(prescription.completionStatus)}>
                        {prescription.completionStatus}
                      </Badge>
                      {metrics && (
                        <Badge variant="outline">
                          {metrics.modulesCompleted}/{metrics.totalModules} modules
                        </Badge>
                      )}
                    </div>
                  </div>

                  {metrics && (
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">Progress Overview</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion</span>
                            <span>{Math.round((metrics.modulesCompleted / metrics.totalModules) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(metrics.modulesCompleted / metrics.totalModules) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Consistency: {Math.round(metrics.consistencyScore * 100)}%</span>
                            <span>Last activity: {metrics.lastActivityDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium mb-2">Key Insights</h5>
                        <div className="text-sm space-y-1">
                          {metrics.breakthroughMoments.length > 0 && (
                            <div>
                              <span className="text-green-600 font-medium">Breakthrough:</span>
                              <p className="text-gray-700">{metrics.breakthroughMoments[0]}</p>
                            </div>
                          )}
                          {metrics.challengingAreas.length > 0 && (
                            <div>
                              <span className="text-orange-600 font-medium">Challenging areas:</span>
                              <p className="text-gray-700">{metrics.challengingAreas.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {prescription.treatmentGoals.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Treatment Goals</h5>
                      <div className="flex flex-wrap gap-2">
                        {prescription.treatmentGoals.map((goal, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {prescription.customInstructions && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Custom Instructions</h5>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {prescription.customInstructions}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Progress Details
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const notes = prompt('Add notes for this prescription:');
                        if (notes && prescription.id) {
                          updatePrescriptionNotes(prescription.id, notes);
                        }
                      }}
                    >
                      Add Notes
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        const reason = prompt('Reason for discontinuation:');
                        if (reason && prescription.id) {
                          discontinuePathway(prescription.id, reason);
                        }
                      }}
                    >
                      Discontinue
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Prescription Form Modal */}
      {showPrescriptionForm && (
        <Card className="p-6 border-2 border-blue-200">
          <h3 className="text-xl font-medium mb-4">Prescribe New Pathway</h3>
          
          {!selectedPathway ? (
            <div className="space-y-4">
              <h4 className="font-medium">Select a Pathway</h4>
              <div className="grid gap-4">
                {availablePathways.map(pathway => (
                  <div 
                    key={pathway.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedPathway(pathway)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{pathway.name}</h5>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(pathway.difficultyLevel)}>
                          {pathway.difficultyLevel}
                        </Badge>
                        <Badge variant="outline">
                          {pathway.estimatedDuration} days
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{pathway.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Evidence Base:</span>
                        <p className="text-gray-600">{pathway.evidenceBase.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Outcomes:</span>
                        <p className="text-gray-600">{pathway.therapeuticOutcomes.join(', ')}</p>
                      </div>
                    </div>

                    {pathway.contraindications.length > 0 && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-red-600">Contraindications:</span>
                        <p className="text-red-600">{pathway.contraindications.join(', ')}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="font-medium text-blue-900">{selectedPathway.name}</h4>
                <p className="text-blue-800 text-sm">{selectedPathway.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={prescriptionForm.startDate}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-md"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Duration (days)</label>
                  <input
                    type="number"
                    value={prescriptionForm.targetDuration}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, targetDuration: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-md"
                    min="7"
                    max="90"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Treatment Goals</label>
                {prescriptionForm.treatmentGoals.map((goal, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateFormField('treatmentGoals', index, e.target.value)}
                      placeholder="Enter treatment goal..."
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => addFormField('treatmentGoals')}
                >
                  Add Goal
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Instructions</label>
                <Textarea
                  value={prescriptionForm.customInstructions}
                  onChange={(e) => setPrescriptionForm(prev => ({ ...prev, customInstructions: e.target.value }))}
                  placeholder="Specific instructions, modifications, or focus areas for this client..."
                  className="min-h-24"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Check-in Frequency</label>
                  <select
                    value={prescriptionForm.checkInFrequency}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, checkInFrequency: e.target.value as any }))}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={prescriptionForm.progressReportingEnabled}
                    onChange={(e) => setPrescriptionForm(prev => ({ ...prev, progressReportingEnabled: e.target.checked }))}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Enable progress reporting</label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={prescribePathway}>
                  Prescribe Pathway
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPathway(null);
                    setShowPrescriptionForm(false);
                    resetPrescriptionForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Completed Prescriptions */}
      {completedPrescriptions.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-medium mb-4">Completed Prescriptions</h3>
          <div className="space-y-3">
            {completedPrescriptions.map(prescription => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{prescription.pathwayName}</h4>
                    <p className="text-sm text-gray-600">
                      {prescription.prescriptionDate.toDate().toLocaleDateString()} - 
                      {prescription.updatedAt.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(prescription.completionStatus)}>
                      {prescription.completionStatus}
                    </Badge>
                    {prescription.effectivenessRating && (
                      <Badge variant="outline">
                        {prescription.effectivenessRating}/5 stars
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}