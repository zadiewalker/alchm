'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { betaUserService } from '@/lib/beta/betaUserService';
import { BetaRecruitment as BetaRecruitmentType, ApplicationQuestion } from '@/types/beta';

interface BetaRecruitmentProps {
  onApplicationSubmit?: (applicationId: string) => void;
}

export function BetaRecruitment({ onApplicationSubmit }: BetaRecruitmentProps) {
  const [recruitments, setRecruitments] = useState<BetaRecruitmentType[]>([]);
  const [selectedRecruitment, setSelectedRecruitment] = useState<BetaRecruitmentType | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadRecruitments();
  }, []);

  const loadRecruitments = async () => {
    try {
      setLoading(true);
      const activeRecruitments = await betaUserService.getActiveRecruitments();
      setRecruitments(activeRecruitments);
    } catch (err) {
      setError('Failed to load recruitment opportunities');
      console.error('Error loading recruitments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (recruitment: BetaRecruitmentType) => {
    setSelectedRecruitment(recruitment);
    setApplicationData({});
    setShowApplication(true);
    setError(null);
    setSuccess(false);
  };

  const handleInputChange = (questionId: string, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const validateApplication = (): boolean => {
    if (!selectedRecruitment) return false;

    // Check required fields
    const requiredQuestions = selectedRecruitment.application.questions
      .filter(q => q.required)
      .map(q => q.id);

    const missingFields = requiredQuestions.filter(id => !applicationData[id]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields`);
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (applicationData.email && !emailRegex.test(applicationData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const submitApplication = async () => {
    if (!selectedRecruitment || !validateApplication()) return;

    try {
      setSubmitting(true);
      setError(null);

      const application = await betaUserService.submitApplication({
        recruitmentId: selectedRecruitment.id,
        applicantEmail: applicationData.email,
        answers: applicationData
      });

      setSuccess(true);
      setShowApplication(false);
      
      if (onApplicationSubmit) {
        onApplicationSubmit(application.id);
      }

      // Refresh recruitments to show updated counts
      await loadRecruitments();

    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error('Error submitting application:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question: ApplicationQuestion) => {
    const value = applicationData[question.id] || '';

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={value}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              maxLength={question.maxLength}
              rows={4}
              placeholder="Enter your response..."
            />
            {question.maxLength && (
              <div className="text-xs text-gray-500 mt-1">
                {value.length}/{question.maxLength} characters
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={question.id} className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => handleInputChange(question.id, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">
                {question.question}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="text-green-600 text-2xl mb-4">✓</div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Application Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-6">
          Thank you for your interest in joining our beta testing program. We'll review your application and get back to you within 2-3 business days.
        </p>
        <Button onClick={() => setSuccess(false)}>
          View Other Opportunities
        </Button>
      </Card>
    );
  }

  if (showApplication && selectedRecruitment) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowApplication(false)}
              className="mb-4"
            >
              ← Back to Opportunities
            </Button>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              Apply for {selectedRecruitment.title}
            </h2>
            <p className="text-gray-600">
              {selectedRecruitment.description}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitApplication();
            }}
          >
            {/* Email field (always required) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={applicationData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            {selectedRecruitment.application.questions.map(renderQuestion)}

            {/* Terms and Conditions */}
            <div className="mb-6 space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={applicationData.agreedToTerms || false}
                  onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                  className="mr-2 mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the Terms of Service and Beta Testing Agreement
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>

              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={applicationData.agreedToNDA || false}
                  onChange={(e) => handleInputChange('agreedToNDA', e.target.checked)}
                  className="mr-2 mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the Non-Disclosure Agreement (NDA)
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowApplication(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-medium text-gray-900 mb-4">
          Join Our Beta Testing Program
        </h1>
        <p className="text-lg text-gray-600">
          Help us build the future of digital wellness by testing new features and providing valuable feedback.
        </p>
      </div>

      {recruitments.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No Active Recruitments
          </h3>
          <p className="text-gray-600">
            We don't have any open beta testing opportunities at the moment. Please check back later!
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {recruitments.map((recruitment) => (
            <Card key={recruitment.id} className="p-6">
              <div className="mb-4">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {recruitment.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {recruitment.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {recruitment.currentCount} of {recruitment.targetCount} spots filled
                  </span>
                  {recruitment.closesAt && (
                    <span>
                      Closes: {new Date(recruitment.closesAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, (recruitment.currentCount / recruitment.targetCount) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recruitment.criteria.minAge && (
                    <li>• Age: {recruitment.criteria.minAge}+ years</li>
                  )}
                  {recruitment.criteria.devices && recruitment.criteria.devices.length > 0 && (
                    <li>• Devices: {recruitment.criteria.devices.join(', ')}</li>
                  )}
                  {recruitment.criteria.availability && (
                    <li>• Availability: {recruitment.criteria.availability} hours/week</li>
                  )}
                </ul>
              </div>

              <Button
                onClick={() => handleApply(recruitment)}
                disabled={recruitment.currentCount >= recruitment.targetCount}
                className="w-full"
              >
                {recruitment.currentCount >= recruitment.targetCount ? 'Full' : 'Apply Now'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}