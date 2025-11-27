'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { RealWorldApplication, EmotionalCompetency } from '@/lib/emotional-learning/badge-ecosystem';

interface RealWorldSkillTrackerProps {
  userId: string;
  className?: string;
}

interface SkillTransferMetric {
  skill: EmotionalCompetency;
  totalApplications: number;
  successRate: number;
  averageConfidence: number;
  longestStreak: number;
  currentStreak: number;
  lastApplication: Date | null;
  mostCommonSituations: string[];
  celebrationMoments: string[];
  challengeAreas: string[];
  witnessValidations: number;
}

const RealWorldSkillTracker: React.FC<RealWorldSkillTrackerProps> = ({
  userId,
  className = ''
}) => {
  const [applications, setApplications] = useState<RealWorldApplication[]>([]);
  const [skillMetrics, setSkillMetrics] = useState<SkillTransferMetric[]>([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<EmotionalCompetency>('emotional_awareness');

  // Mock data - in production, this would come from Firebase
  useEffect(() => {
    const mockApplications: RealWorldApplication[] = [
      {
        situation: 'Difficult conversation with partner about boundaries',
        skillApplied: 'emotional_awareness',
        outcome: 'successful',
        reflection: 'I noticed my frustration rising and named it instead of reacting',
        celebrationMoments: ['Stayed present', 'Spoke from awareness'],
        applicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        situation: 'Stressful meeting at work',
        skillApplied: 'self_regulation',
        outcome: 'partially_successful',
        reflection: 'Used breathing technique to calm down before responding',
        improvementAreas: ['Could have paused longer before speaking'],
        celebrationMoments: ['Remembered to breathe'],
        applicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockMetrics: SkillTransferMetric[] = [
      {
        skill: 'emotional_awareness',
        totalApplications: 12,
        successRate: 75,
        averageConfidence: 7.2,
        longestStreak: 5,
        currentStreak: 2,
        lastApplication: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mostCommonSituations: ['Relationship conflicts', 'Work stress', 'Family interactions'],
        celebrationMoments: ['Catching emotions early', 'Staying present'],
        challengeAreas: ['High stress situations', 'When tired'],
        witnessValidations: 3
      },
      {
        skill: 'self_regulation',
        totalApplications: 8,
        successRate: 62,
        averageConfidence: 6.8,
        longestStreak: 3,
        currentStreak: 1,
        lastApplication: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mostCommonSituations: ['Work meetings', 'Traffic stress', 'Social anxiety'],
        celebrationMoments: ['Using breath techniques', 'Choosing responses'],
        challengeAreas: ['Unexpected triggers', 'Multiple stressors'],
        witnessValidations: 1
      }
    ];

    setApplications(mockApplications);
    setSkillMetrics(mockMetrics);
  }, [userId]);

  const handleNewApplication = (applicationData: Partial<RealWorldApplication>) => {
    const newApplication: RealWorldApplication = {
      situation: applicationData.situation || '',
      skillApplied: selectedSkill,
      outcome: applicationData.outcome || 'learning_opportunity',
      reflection: applicationData.reflection || '',
      celebrationMoments: applicationData.celebrationMoments || [],
      improvementAreas: applicationData.improvementAreas || [],
      applicationDate: new Date()
    };

    setApplications(prev => [newApplication, ...prev]);
    setShowApplicationForm(false);

    // Update metrics
    setSkillMetrics(prev => prev.map(metric => {
      if (metric.skill === selectedSkill) {
        const isSuccess = newApplication.outcome === 'successful' || newApplication.outcome === 'partially_successful';
        const newSuccessRate = ((metric.successRate * metric.totalApplications) + (isSuccess ? 100 : 0)) / (metric.totalApplications + 1);
        
        return {
          ...metric,
          totalApplications: metric.totalApplications + 1,
          successRate: Math.round(newSuccessRate),
          currentStreak: isSuccess ? metric.currentStreak + 1 : 0,
          longestStreak: isSuccess ? Math.max(metric.longestStreak, metric.currentStreak + 1) : metric.longestStreak,
          lastApplication: new Date()
        };
      }
      return metric;
    }));
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className={`real-world-skill-tracker ${className}`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-medium text-gray-800">Real-World Skill Transfer</h2>
            <p className="text-gray-600">Track how your emotional intelligence skills show up in daily life</p>
          </div>
          <Button
            onClick={() => setShowApplicationForm(true)}
            className="bg-sage-600 hover:bg-sage-700"
          >
            Log Application
          </Button>
        </div>

        {/* Skill Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {skillMetrics.map(metric => (
            <Card key={metric.skill} className="p-6 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 capitalize">
                    {metric.skill.replace('_', ' ')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {metric.totalApplications} real-world applications
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-medium ${getSuccessColor(metric.successRate)}`}>
                    {metric.successRate}%
                  </div>
                  <div className="text-xs text-gray-500">success rate</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Streak</span>
                  <span className="font-medium text-orange-600">
                    {metric.currentStreak} days
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence Level</span>
                  <span className="font-medium text-blue-600">
                    {metric.averageConfidence}/10
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs font-medium text-gray-700 mb-2">Most Common Situations:</div>
                  <div className="flex flex-wrap gap-1">
                    {metric.mostCommonSituations.slice(0, 2).map((situation, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {situation}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">Recent Celebrations:</div>
                  <div className="space-y-1">
                    {metric.celebrationMoments.slice(0, 2).map((moment, index) => (
                      <div key={index} className="text-xs text-green-600 flex items-center gap-1">
                        <span>✨</span>
                        <span>{moment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {metric.witnessValidations > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-xs text-purple-600 font-medium">
                    🏆 {metric.witnessValidations} peer validations
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Recent Applications */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Applications</h3>
          
          <div className="space-y-4">
            {applications.slice(0, 3).map((application, index) => (
              <div key={index} className="border-l-4 border-sage-200 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 capitalize">
                      {application.skillApplied.replace('_', ' ')} Applied
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {application.situation}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      application.outcome === 'successful' ? 'bg-green-100 text-green-700' :
                      application.outcome === 'partially_successful' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {application.outcome.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.floor((Date.now() - application.applicationDate.getTime()) / (24 * 60 * 60 * 1000))} days ago
                    </span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-2 italic">
                  "{application.reflection}"
                </div>
                
                {application.celebrationMoments && application.celebrationMoments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {application.celebrationMoments.map((moment, idx) => (
                      <span key={idx} className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✨ {moment}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Log Real-World Application</h3>
              <button
                onClick={() => setShowApplicationForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleNewApplication({
                situation: formData.get('situation') as string,
                outcome: formData.get('outcome') as RealWorldApplication['outcome'],
                reflection: formData.get('reflection') as string,
                celebrationMoments: [formData.get('celebration') as string].filter(Boolean)
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emotional Skill Applied
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value as EmotionalCompetency)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="emotional_awareness">Emotional Awareness</option>
                    <option value="self_regulation">Self Regulation</option>
                    <option value="trauma_healing">Trauma Healing</option>
                    <option value="relationship_skills">Relationship Skills</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Situation
                  </label>
                  <input
                    name="situation"
                    placeholder="Briefly describe the situation..."
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outcome
                  </label>
                  <select name="outcome" className="w-full p-2 border border-gray-300 rounded" required>
                    <option value="successful">Successful</option>
                    <option value="partially_successful">Partially Successful</option>
                    <option value="challenging">Challenging</option>
                    <option value="learning_opportunity">Learning Opportunity</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reflection
                  </label>
                  <textarea
                    name="reflection"
                    placeholder="What did you notice? How did it feel to use this skill?"
                    className="w-full p-2 border border-gray-300 rounded h-20"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Something to Celebrate
                  </label>
                  <input
                    name="celebration"
                    placeholder="What went well or what are you proud of?"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="bg-sage-600 hover:bg-sage-700 flex-1">
                  Log Application
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RealWorldSkillTracker;