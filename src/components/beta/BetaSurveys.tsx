'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBetaAccess } from '@/hooks/useBetaAccess';
import { surveyService } from '@/lib/beta/surveyService';
import { BetaSurvey, SurveyQuestion, BetaInterview } from '@/types/beta';

interface BetaSurveysProps {
  view?: 'user' | 'admin';
}

export function BetaSurveys({ view = 'user' }: BetaSurveysProps) {
  const { isBetaUser, betaUser, canAccessFeature } = useBetaAccess();
  const [surveys, setSurveys] = useState<BetaSurvey[]>([]);
  const [interviews, setInterviews] = useState<BetaInterview[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<BetaSurvey | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'surveys' | 'interviews'>('surveys');
  const [error, setError] = useState<string | null>(null);

  if (!isBetaUser || !canAccessFeature('surveys')) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Survey Access Required
        </h3>
        <p className="text-gray-600">
          You need survey permissions to access this feature.
        </p>
      </Card>
    );
  }

  useEffect(() => {
    loadData();
  }, [activeTab, betaUser]);

  const loadData = async () => {
    if (!betaUser) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (activeTab === 'surveys') {
        const surveyList = view === 'admin' 
          ? await surveyService.getSurveys({ status: 'active', limit: 20 })
          : await surveyService.getSurveys({ status: 'active', limit: 10 });
        setSurveys(surveyList);
      } else {
        const interviewList = await surveyService.getInterviews({
          userId: view === 'admin' ? undefined : betaUser.uid,
          limit: 20
        });
        setInterviews(interviewList);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error('Data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSurveyResponse = (questionId: string, value: any) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const submitSurvey = async () => {
    if (!selectedSurvey || !betaUser) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Validate required questions
      const requiredQuestions = selectedSurvey.questions.filter(q => q.required);
      const missingAnswers = requiredQuestions.filter(q => !surveyResponses[q.id]);
      
      if (missingAnswers.length > 0) {
        setError('Please answer all required questions');
        return;
      }
      
      await surveyService.submitSurveyResponse({
        userId: betaUser.uid,
        surveyId: selectedSurvey.id,
        answers: surveyResponses,
        timeSpent: 0 // Would track actual time in production
      });
      
      setSelectedSurvey(null);
      setSurveyResponses({});
      await loadData();
      
    } catch (err) {
      setError('Failed to submit survey response');
      console.error('Survey submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInterviewAction = async (interviewId: string, action: 'confirm' | 'reschedule' | 'cancel') => {
    try {
      switch (action) {
        case 'confirm':
          await surveyService.updateInterviewStatus(interviewId, 'scheduled');
          break;
        case 'cancel':
          await surveyService.updateInterviewStatus(interviewId, 'cancelled');
          break;
        // Reschedule would need additional implementation
      }
      
      await loadData();
    } catch (err) {
      console.error('Interview action error:', err);
    }
  };

  const canTakeSurvey = (survey: BetaSurvey): boolean => {
    if (!betaUser) return false;
    
    // Check if user already responded (this would need to be checked against responses)
    // For now, we'll assume they can take it
    
    // Check if survey is still active and not expired
    if (survey.status !== 'active') return false;
    if (survey.expiresAt && survey.expiresAt < new Date()) return false;
    
    return true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (selectedSurvey) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSurvey(null);
                setSurveyResponses({});
                setError(null);
              }}
              className="mb-4"
            >
              ← Back to Surveys
            </Button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedSurvey.title}
            </h2>
            <p className="text-gray-600 mb-4">
              {selectedSurvey.description}
            </p>
            
            {selectedSurvey.expiresAt && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <p className="text-yellow-800 text-sm">
                  This survey expires on {selectedSurvey.expiresAt.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {selectedSurvey.questions.map((question, index) => (
              <SurveyQuestionComponent
                key={question.id}
                question={question}
                questionNumber={index + 1}
                value={surveyResponses[question.id]}
                onChange={(value) => handleSurveyResponse(question.id, value)}
              />
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedSurvey(null);
                setSurveyResponses({});
                setError(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submitSurvey}
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Survey'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {view === 'admin' ? 'Survey Management' : 'Surveys & Interviews'}
        </h1>
        <p className="text-gray-600">
          {view === 'admin' 
            ? 'Manage beta testing surveys and interviews'
            : 'Participate in surveys and interviews to help improve the product'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('surveys')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'surveys'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Surveys
          </button>
          <button
            onClick={() => setActiveTab('interviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'interviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Interviews
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Surveys Tab */}
      {activeTab === 'surveys' && (
        <div>
          {surveys.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Surveys
              </h3>
              <p className="text-gray-600">
                There are no surveys available at the moment. Check back later!
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {surveys.map(survey => (
                <Card key={survey.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {survey.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {survey.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {survey.questions.length} questions
                        </span>
                        <span>
                          Type: {survey.type.replace('_', ' ')}
                        </span>
                        {survey.expiresAt && (
                          <span>
                            Expires: {survey.expiresAt.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <Button
                        onClick={() => {
                          setSelectedSurvey(survey);
                          setSurveyResponses({});
                        }}
                        disabled={!canTakeSurvey(survey)}
                      >
                        {canTakeSurvey(survey) ? 'Take Survey' : 'Completed'}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interviews Tab */}
      {activeTab === 'interviews' && (
        <div>
          {interviews.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Scheduled Interviews
              </h3>
              <p className="text-gray-600">
                You don't have any interviews scheduled at the moment.
              </p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {interviews.map(interview => (
                <Card key={interview.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {interview.type.replace('_', ' ')} Interview
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>
                          <strong>Scheduled:</strong> {interview.scheduledAt.toLocaleString()}
                        </div>
                        <div>
                          <strong>Duration:</strong> {interview.duration} minutes
                        </div>
                        <div>
                          <strong>Interviewer:</strong> {interview.interviewer}
                        </div>
                        <div>
                          <strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {interview.status}
                          </span>
                        </div>
                      </div>
                      
                      {interview.topics.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Topics:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {interview.topics.map((topic, index) => (
                              <li key={index}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {interview.status === 'scheduled' && (
                      <div className="ml-6 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInterviewAction(interview.id, 'reschedule')}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInterviewAction(interview.id, 'cancel')}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleInterviewAction(interview.id, 'confirm')}
                        >
                          Confirm
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Survey Question Component
interface SurveyQuestionComponentProps {
  question: SurveyQuestion;
  questionNumber: number;
  value: any;
  onChange: (value: any) => void;
}

function SurveyQuestionComponent({ question, questionNumber, value, onChange }: SurveyQuestionComponentProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter your response..."
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onChange(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={value === true}
                onChange={() => onChange(true)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={value === false}
                onChange={() => onChange(false)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        );

      case 'rating':
        const minValue = question.minValue || 1;
        const maxValue = question.maxValue || 5;
        
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{minValue}</span>
            <div className="flex gap-1">
              {Array.from({ length: maxValue - minValue + 1 }, (_, i) => {
                const ratingValue = minValue + i;
                return (
                  <button
                    key={ratingValue}
                    type="button"
                    onClick={() => onChange(ratingValue)}
                    className={`w-8 h-8 rounded-full border-2 font-medium text-sm ${
                      value === ratingValue
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    {ratingValue}
                  </button>
                );
              })}
            </div>
            <span className="text-sm text-gray-500">{maxValue}</span>
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={question.minValue || 0}
              max={question.maxValue || 100}
              value={value || question.minValue || 0}
              onChange={(e) => onChange(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{question.minValue || 0}</span>
              <span className="font-medium">{value || question.minValue || 0}</span>
              <span>{question.maxValue || 100}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="mb-3">
        <h3 className="text-lg font-medium text-gray-900">
          {questionNumber}. {question.question}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </h3>
      </div>
      
      {renderInput()}
    </div>
  );
}