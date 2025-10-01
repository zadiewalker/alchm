'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Calendar, Clock, TrendingDown, Heart, Eye, EyeOff, BookOpen, Phone } from 'lucide-react';

interface MoodDataPoint {
  date: string;
  mood: number;
  emotions: string[];
  activities: string[];
  journalLength: number;
  vocabularyScore: number;
}

interface TriggerPattern {
  id: string;
  type: 'emotional' | 'temporal' | 'activity' | 'environmental';
  name: string;
  description: string;
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  triggers: string[];
  correlatedMoodDrop: number;
  timePattern?: {
    dayOfWeek?: string[];
    timeOfDay?: string[];
    seasonality?: string;
  };
  recommendations: {
    immediate: string[];
    longTerm: string[];
    professional: string[];
  };
  crisisRisk: boolean;
}

interface TriggerPatternIdentificationProps {
  userId: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  moodData: MoodDataPoint[];
}

const TriggerPatternCard: React.FC<{ pattern: TriggerPattern; onViewDetails: () => void }> = ({ 
  pattern, 
  onViewDetails 
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      default: return 'border-sage-200 bg-sage-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default: return <Shield className="w-5 h-5 text-sage-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'temporal': return <Clock className="w-4 h-4" />;
      case 'activity': return <Calendar className="w-4 h-4" />;
      case 'emotional': return <Heart className="w-4 h-4" />;
      default: return <TrendingDown className="w-4 h-4" />;
    }
  };

  return (
    <Card className={`p-4 border-2 ${getSeverityColor(pattern.severity)} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getSeverityIcon(pattern.severity)}
          <div>
            <h4 className="font-medium text-sage-800">{pattern.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              {getTypeIcon(pattern.type)}
              <span className="text-xs text-sage-500 capitalize">{pattern.type} Pattern</span>
              <span className="text-xs text-sage-500">•</span>
              <span className="text-xs text-sage-500">{pattern.confidence}% confidence</span>
            </div>
          </div>
        </div>
        {pattern.crisisRisk && (
          <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
            Crisis Risk
          </div>
        )}
      </div>

      <p className="text-sm text-sage-700 mb-3">{pattern.description}</p>

      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div>
          <span className="text-sage-500">Frequency:</span>
          <span className="ml-2 font-medium">{pattern.frequency}x per {pattern.timeframe || 'month'}</span>
        </div>
        <div>
          <span className="text-sage-500">Mood Impact:</span>
          <span className="ml-2 font-medium text-red-600">-{pattern.correlatedMoodDrop.toFixed(1)}</span>
        </div>
      </div>

      <div className="mb-4">
        <h5 className="text-sm font-medium text-sage-700 mb-2">Key Triggers:</h5>
        <div className="flex flex-wrap gap-2">
          {pattern.triggers.slice(0, 3).map((trigger, index) => (
            <span 
              key={index}
              className="bg-white px-2 py-1 rounded text-xs text-sage-600 border"
            >
              {trigger}
            </span>
          ))}
          {pattern.triggers.length > 3 && (
            <span className="text-xs text-sage-500">+{pattern.triggers.length - 3} more</span>
          )}
        </div>
      </div>

      <Button
        onClick={onViewDetails}
        size="sm"
        variant="outline"
        className="w-full text-sage-600 border-sage-300 hover:bg-sage-50"
      >
        <Eye className="w-4 h-4 mr-2" />
        View Recommendations
      </Button>
    </Card>
  );
};

const TriggerDetailsModal: React.FC<{ 
  pattern: TriggerPattern; 
  onClose: () => void;
  onContactCrisisSupport: () => void;
}> = ({ pattern, onClose, onContactCrisisSupport }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-medium text-sage-800 mb-2">{pattern.name}</h3>
              <p className="text-sage-600">{pattern.description}</p>
            </div>
            <Button
              onClick={onClose}
              size="sm"
              variant="outline"
              className="text-sage-600"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>

          {pattern.crisisRisk && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-800">Crisis Risk Detected</h4>
              </div>
              <p className="text-red-700 text-sm mb-3">
                This pattern may indicate increased risk for emotional crisis. Immediate support is recommended.
              </p>
              <Button
                onClick={onContactCrisisSupport}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Crisis Support
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {/* Pattern Details */}
            <div>
              <h4 className="font-medium text-sage-800 mb-3">Pattern Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="font-medium text-sage-700 mb-1">Detection Confidence</div>
                  <div className="text-sage-600">{pattern.confidence}%</div>
                </div>
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="font-medium text-sage-700 mb-1">Average Mood Impact</div>
                  <div className="text-sage-600">-{pattern.correlatedMoodDrop.toFixed(1)} points</div>
                </div>
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="font-medium text-sage-700 mb-1">Occurrence Frequency</div>
                  <div className="text-sage-600">{pattern.frequency}x per month</div>
                </div>
                <div className="bg-sage-50 rounded-lg p-3">
                  <div className="font-medium text-sage-700 mb-1">Pattern Type</div>
                  <div className="text-sage-600 capitalize">{pattern.type}</div>
                </div>
              </div>
            </div>

            {/* Time Patterns */}
            {pattern.timePattern && (
              <div>
                <h4 className="font-medium text-sage-800 mb-3">Temporal Patterns</h4>
                <div className="space-y-3">
                  {pattern.timePattern.dayOfWeek && (
                    <div className="bg-eucalyptus-50 rounded-lg p-3">
                      <div className="font-medium text-sage-700 mb-2">Days of Week</div>
                      <div className="flex flex-wrap gap-2">
                        {pattern.timePattern.dayOfWeek.map((day, index) => (
                          <span key={index} className="bg-white px-2 py-1 rounded text-xs text-sage-600 border">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {pattern.timePattern.timeOfDay && (
                    <div className="bg-eucalyptus-50 rounded-lg p-3">
                      <div className="font-medium text-sage-700 mb-2">Time of Day</div>
                      <div className="flex flex-wrap gap-2">
                        {pattern.timePattern.timeOfDay.map((time, index) => (
                          <span key={index} className="bg-white px-2 py-1 rounded text-xs text-sage-600 border">
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Triggers */}
            <div>
              <h4 className="font-medium text-sage-800 mb-3">Identified Triggers</h4>
              <div className="grid gap-2">
                {pattern.triggers.map((trigger, index) => (
                  <div key={index} className="bg-amber-50 border border-amber-200 rounded p-2 text-sm text-amber-800">
                    {trigger}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-sage-800 mb-3">Personalized Recommendations</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Immediate Coping Strategies
                  </h5>
                  <ul className="space-y-1 text-sm text-sage-700">
                    {pattern.recommendations.immediate.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-blue-700 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Long-term Strategies
                  </h5>
                  <ul className="space-y-1 text-sm text-sage-700">
                    {pattern.recommendations.longTerm.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-purple-700 mb-2 flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Professional Support
                  </h5>
                  <ul className="space-y-1 text-sm text-sage-700">
                    {pattern.recommendations.professional.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const TriggerPatternIdentification: React.FC<TriggerPatternIdentificationProps> = ({
  userId,
  timeframe,
  moodData
}) => {
  const [selectedPattern, setSelectedPattern] = useState<TriggerPattern | null>(null);
  const [showOnlyHighRisk, setShowOnlyHighRisk] = useState(false);

  const identifiedPatterns = useMemo((): TriggerPattern[] => {
    const patterns: TriggerPattern[] = [];
    
    // Analyze mood drops and surrounding context
    moodData.forEach((dataPoint, index) => {
      if (index === 0) return;
      
      const moodDrop = moodData[index - 1].mood - dataPoint.mood;
      if (moodDrop >= 2) { // Significant mood drop
        
        // Weekend Pattern Detection
        const date = new Date(dataPoint.date);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          const weekendMoodDrops = moodData.filter((d, i) => {
            if (i === 0) return false;
            const dropDate = new Date(d.date);
            const drop = moodData[i - 1].mood - d.mood;
            return (dropDate.getDay() === 0 || dropDate.getDay() === 6) && drop >= 1.5;
          });
          
          if (weekendMoodDrops.length >= 3) {
            patterns.push({
              id: 'weekend-pattern',
              type: 'temporal',
              name: 'Weekend Emotional Dips',
              description: 'Mood tends to decline during weekends, possibly due to schedule changes or social isolation.',
              frequency: weekendMoodDrops.length,
              severity: weekendMoodDrops.length >= 5 ? 'high' : 'medium',
              confidence: 85,
              triggers: ['schedule disruption', 'social isolation', 'lack of structure'],
              correlatedMoodDrop: weekendMoodDrops.reduce((sum, d, i) => sum + (moodData[i - 1]?.mood - d.mood || 0), 0) / weekendMoodDrops.length,
              timePattern: {
                dayOfWeek: ['Saturday', 'Sunday']
              },
              recommendations: {
                immediate: [
                  'Create a structured weekend routine',
                  'Plan social activities for weekends',
                  'Practice mindfulness during transitions'
                ],
                longTerm: [
                  'Develop consistent sleep schedule for weekends',
                  'Build weekend rituals that bring joy',
                  'Consider weekend support groups'
                ],
                professional: [
                  'Discuss weekend depression patterns with therapist',
                  'Explore underlying causes of weekend anxiety'
                ]
              },
              crisisRisk: false
            });
          }
        }

        // High Stress Activity Pattern
        const stressActivities = ['work', 'conflict', 'deadline', 'meeting'];
        const hasStressActivity = dataPoint.activities.some(activity => 
          stressActivities.some(stress => activity.toLowerCase().includes(stress.toLowerCase()))
        );
        
        if (hasStressActivity) {
          const stressRelatedDrops = moodData.filter(d => 
            d.activities.some(activity => 
              stressActivities.some(stress => activity.toLowerCase().includes(stress.toLowerCase()))
            )
          );
          
          if (stressRelatedDrops.length >= 4) {
            patterns.push({
              id: 'stress-activity-pattern',
              type: 'activity',
              name: 'Work-Related Stress Response',
              description: 'Mood consistently drops in connection with work-related activities and pressures.',
              frequency: stressRelatedDrops.length,
              severity: stressRelatedDrops.length >= 8 ? 'high' : 'medium',
              confidence: 78,
              triggers: ['work pressure', 'deadlines', 'conflicts', 'meetings'],
              correlatedMoodDrop: 2.3,
              recommendations: {
                immediate: [
                  'Practice breathing exercises before work stress',
                  'Take regular breaks during high-pressure periods',
                  'Use grounding techniques when overwhelmed'
                ],
                longTerm: [
                  'Develop better work-life boundaries',
                  'Learn stress management techniques',
                  'Consider workplace accommodation if needed'
                ],
                professional: [
                  'Discuss work stress patterns with therapist',
                  'Consider occupational therapy consultation',
                  'Explore stress-related medical evaluation'
                ]
              },
              crisisRisk: stressRelatedDrops.length >= 10
            });
          }
        }

        // Emotional Vocabulary Decline Pattern
        if (dataPoint.vocabularyScore < 40 && dataPoint.emotions.includes('overwhelmed')) {
          patterns.push({
            id: 'emotional-overwhelm-pattern',
            type: 'emotional',
            name: 'Emotional Overwhelm Cascade',
            description: 'When feeling overwhelmed, emotional vocabulary decreases and mood drops significantly.',
            frequency: 6,
            severity: 'high',
            confidence: 92,
            triggers: ['overwhelm', 'emotional flooding', 'reduced self-expression'],
            correlatedMoodDrop: 3.1,
            recommendations: {
              immediate: [
                'Use the STOP technique (Stop, Take a breath, Observe, Proceed)',
                'Practice naming emotions with simple words',
                'Reach out to support person immediately'
              ],
              longTerm: [
                'Build emotional vocabulary through daily practice',
                'Develop early warning system for overwhelm',
                'Create overwhelm response protocol'
              ],
              professional: [
                'Discuss overwhelm patterns in therapy',
                'Consider DBT skills training',
                'Evaluate for underlying trauma responses'
              ]
            },
            crisisRisk: true
          });
        }
      }
    });

    // Remove duplicates and sort by severity and confidence
    const uniquePatterns = patterns.filter((pattern, index, self) => 
      index === self.findIndex(p => p.id === pattern.id)
    );
    
    return uniquePatterns.sort((a, b) => {
      if (a.crisisRisk !== b.crisisRisk) return a.crisisRisk ? -1 : 1;
      if (a.severity !== b.severity) {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      }
      return b.confidence - a.confidence;
    });
  }, [moodData]);

  const filteredPatterns = showOnlyHighRisk 
    ? identifiedPatterns.filter(p => p.crisisRisk || p.severity === 'high')
    : identifiedPatterns;

  const handleContactCrisisSupport = () => {
    // Trigger crisis support modal or redirect
    window.dispatchEvent(new CustomEvent('openCrisisSupport'));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-amber-50 to-red-50">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-sage-800 mb-2">
              Trigger Pattern Analysis
            </h3>
            <p className="text-sage-600 text-sm mb-4">
              Gentle warnings and insights to help you recognize patterns that may impact your wellbeing.
            </p>
            {identifiedPatterns.some(p => p.crisisRisk) && (
              <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">
                  Some patterns indicate increased emotional risk. Please consider reaching out for support.
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowOnlyHighRisk(!showOnlyHighRisk)}
              size="sm"
              variant="outline"
              className={`${showOnlyHighRisk ? 'bg-red-50 border-red-200 text-red-700' : 'text-sage-600 border-sage-200'}`}
            >
              {showOnlyHighRisk ? 'Show All' : 'High Risk Only'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Patterns Grid */}
      {filteredPatterns.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPatterns.map((pattern) => (
            <TriggerPatternCard
              key={pattern.id}
              pattern={pattern}
              onViewDetails={() => setSelectedPattern(pattern)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 text-sage-400" />
          <h3 className="text-lg font-medium text-sage-800 mb-2">
            {showOnlyHighRisk ? 'No High-Risk Patterns Detected' : 'No Patterns Detected'}
          </h3>
          <p className="text-sage-600">
            {showOnlyHighRisk 
              ? 'Your current patterns show stable emotional patterns. Continue your self-care practices.'
              : 'Continue journaling to build enough data for pattern analysis. This typically takes 2-3 weeks of consistent use.'
            }
          </p>
        </Card>
      )}

      {/* Educational Note */}
      <Card className="p-4 bg-sage-50 border-sage-200">
        <div className="flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-sage-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-sage-800 mb-1">Understanding Trigger Patterns</h4>
            <p className="text-sage-600 text-sm">
              These patterns are identified through gentle analysis of your emotional data. They're meant to 
              increase awareness, not create anxiety. Each pattern includes supportive recommendations and 
              emphasizes your agency in healing.
            </p>
          </div>
        </div>
      </Card>

      {/* Pattern Details Modal */}
      {selectedPattern && (
        <TriggerDetailsModal
          pattern={selectedPattern}
          onClose={() => setSelectedPattern(null)}
          onContactCrisisSupport={handleContactCrisisSupport}
        />
      )}
    </div>
  );
};