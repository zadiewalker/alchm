// Personalized Insight Card - UI component for trauma-informed AI responses
// Creates the magical "ALCHM just gets me" user experience

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Lightbulb, 
  Shield, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface PersonalizedInsightProps {
  insight: string;
  encouragement: string;
  gentleAction?: string;
  resources?: string[];
  metadata: {
    confidenceScore: number;
    personalizationLevel: number;
    responseType: 'validation' | 'insight' | 'guidance' | 'crisis_support';
    processingTime: number;
    triggerRisk: 'none' | 'low' | 'medium' | 'high';
    qualityMetrics: {
      traumaInformed: boolean;
      personalized: boolean;
      actionable: boolean;
      empathetic: boolean;
      culturallySensitive: boolean;
      strengthsBased: boolean;
      boundaryRespecting: boolean;
    };
  };
  responseId: string;
  onFeedback?: (feedback: 'helpful' | 'not_helpful' | 'triggering' | 'perfect') => void;
  showMetrics?: boolean; // For debugging/admin view
}

export default function PersonalizedInsightCard({
  insight,
  encouragement,
  gentleAction,
  resources,
  metadata,
  responseId,
  onFeedback,
  showMetrics = false
}: PersonalizedInsightProps) {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);

  const handleFeedback = (feedback: 'helpful' | 'not_helpful' | 'triggering' | 'perfect') => {
    setSelectedFeedback(feedback);
    setFeedbackGiven(true);
    onFeedback?.(feedback);
  };

  const getResponseTypeIcon = () => {
    switch (metadata.responseType) {
      case 'validation':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'insight':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'guidance':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'crisis_support':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Sparkles className="h-5 w-5 text-purple-500" />;
    }
  };

  const getPersonalizationBadge = () => {
    const level = metadata.personalizationLevel;
    if (level >= 0.8) return { text: 'Highly Personalized', color: 'bg-green-100 text-green-800' };
    if (level >= 0.5) return { text: 'Personalized', color: 'bg-blue-100 text-blue-800' };
    if (level >= 0.3) return { text: 'Learning Your Style', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Getting To Know You', color: 'bg-gray-100 text-gray-800' };
  };

  const getTriggerRiskColor = () => {
    switch (metadata.triggerRisk) {
      case 'none': return 'text-green-600';
      case 'low': return 'text-yellow-600';
      case 'medium': return 'text-orange-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const personalizationBadge = getPersonalizationBadge();

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getResponseTypeIcon()}
            <CardTitle className="text-lg font-semibold text-gray-800">
              Your Personal Insight
            </CardTitle>
          </div>
          <Badge className={personalizationBadge.color}>
            {personalizationBadge.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Insight */}
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-400">
          <p className="text-gray-800 leading-relaxed font-medium">
            {insight}
          </p>
        </div>

        {/* Encouragement */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 italic">
              {encouragement}
            </p>
          </div>
        </div>

        {/* Gentle Action */}
        {gentleAction && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">Gentle Suggestion</p>
                <p className="text-blue-700">
                  {gentleAction}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Crisis Resources */}
        {resources && resources.length > 0 && (
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="w-full">
                <p className="text-sm font-medium text-red-800 mb-2">Support Resources</p>
                <ul className="space-y-2">
                  {resources.map((resource, index) => (
                    <li key={index} className="flex items-center gap-2 text-red-700">
                      <ExternalLink className="h-4 w-4" />
                      <span className="text-sm">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {!feedbackGiven ? (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-3">How did this insight feel for you?</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback('perfect')}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Heart className="h-4 w-4 mr-1" />
                Perfect
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback('helpful')}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback('not_helpful')}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Not helpful
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFeedback('triggering')}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                Triggering
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              <p className="text-sm text-gray-600">
                Thank you for your feedback! This helps me understand you better.
              </p>
            </div>
          </div>
        )}

        {/* Debug/Admin Metrics */}
        {showMetrics && (
          <div className="border-t pt-4 mt-4 bg-gray-50 rounded-lg p-3">
            <details className="text-sm">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Debug Metrics
              </summary>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Confidence:</strong> {(metadata.confidenceScore * 100).toFixed(1)}%</p>
                    <p><strong>Personalization:</strong> {(metadata.personalizationLevel * 100).toFixed(1)}%</p>
                    <p><strong>Processing Time:</strong> {metadata.processingTime}ms</p>
                    <p><strong>Response Type:</strong> {metadata.responseType}</p>
                    <p className={getTriggerRiskColor()}>
                      <strong>Trigger Risk:</strong> {metadata.triggerRisk}
                    </p>
                  </div>
                  <div>
                    <p><strong>Quality Metrics:</strong></p>
                    <ul className="mt-1 space-y-1">
                      <li>✓ Trauma-informed: {metadata.qualityMetrics.traumaInformed ? '✅' : '❌'}</li>
                      <li>✓ Personalized: {metadata.qualityMetrics.personalized ? '✅' : '❌'}</li>
                      <li>✓ Actionable: {metadata.qualityMetrics.actionable ? '✅' : '❌'}</li>
                      <li>✓ Empathetic: {metadata.qualityMetrics.empathetic ? '✅' : '❌'}</li>
                      <li>✓ Culturally Sensitive: {metadata.qualityMetrics.culturallySensitive ? '✅' : '❌'}</li>
                      <li>✓ Strengths-based: {metadata.qualityMetrics.strengthsBased ? '✅' : '❌'}</li>
                    </ul>
                  </div>
                </div>
                <p><strong>Response ID:</strong> {responseId}</p>
              </div>
            </details>
          </div>
        )}
      </CardContent>
    </Card>
  );
}