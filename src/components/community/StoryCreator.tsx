'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { 
  X, 
  Heart, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Lightbulb,
  Users,
  BookOpen
} from 'lucide-react';

interface StoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: any) => void;
}

interface StoryFormData {
  title: string;
  content: string;
  healingStage: string;
  wisdomTags: string[];
  isAnonymous: boolean;
  shareLocation: boolean;
}

export default function StoryCreator({ isOpen, onClose, onStoryCreated }: StoryCreatorProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    content: '',
    healingStage: 'processing',
    wisdomTags: [],
    isAnonymous: true,
    shareLocation: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const healingStages = [
    { value: 'beginning', label: 'Beginning My Journey', description: 'Just starting to acknowledge and address my healing needs' },
    { value: 'processing', label: 'Processing & Learning', description: 'Actively working through challenges and developing coping skills' },
    { value: 'integrating', label: 'Integrating Growth', description: 'Applying lessons learned and building new patterns' },
    { value: 'thriving', label: 'Thriving & Rebuilding', description: 'Experiencing sustained well-being and personal growth' },
    { value: 'wisdom_sharing', label: 'Sharing Wisdom', description: 'Supporting others while continuing my own growth' }
  ];

  const suggestedTags = [
    'anxiety', 'depression', 'trauma', 'grief', 'self_care', 'mindfulness',
    'therapy', 'medication', 'support_system', 'breakthrough', 'setback',
    'gratitude', 'self_compassion', 'boundaries', 'healing', 'recovery',
    'hope', 'courage', 'resilience', 'growth', 'acceptance'
  ];

  const communityGuidelines = [
    {
      icon: Heart,
      title: 'Share with Compassion',
      description: 'Write from your heart while being mindful of others who may be in vulnerable places'
    },
    {
      icon: Shield,
      title: 'Maintain Anonymity',
      description: 'Never share identifying information about yourself or others'
    },
    {
      icon: Users,
      title: 'Foster Connection',
      description: 'Focus on experiences that others might relate to and find helpful'
    },
    {
      icon: BookOpen,
      title: 'Offer Hope',
      description: 'Share what has helped you or what you wish you had known earlier'
    }
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (formData.content.length < 50) {
      setError('Please share a bit more - stories should be at least 50 characters to be meaningful to the community.');
      return;
    }

    if (formData.content.length > 5000) {
      setError('Please keep your story under 5000 characters to ensure it\'s accessible to all community members.');
      return;
    }

    if (formData.wisdomTags.length === 0) {
      setError('Please add at least one tag to help others find and connect with your story.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/create-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionToken: await user.getIdToken(),
          storyData: {
            title: formData.title.trim() || undefined,
            content: formData.content.trim(),
            healingStage: formData.healingStage,
            wisdomTags: formData.wisdomTags,
            location: formData.shareLocation ? {
              country: 'US', // Would be detected from user profile
              region: 'CA'
            } : undefined
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        onStoryCreated(result);
        onClose();
        // Reset form
        setFormData({
          title: '',
          content: '',
          healingStage: 'processing',
          wisdomTags: [],
          isAnonymous: true,
          shareLocation: false
        });
        setCurrentStep(1);
      } else {
        setError(result.error || 'Failed to share your story. Please try again.');
      }
    } catch (error) {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (!formData.wisdomTags.includes(tag) && formData.wisdomTags.length < 5) {
      setFormData(prev => ({
        ...prev,
        wisdomTags: [...prev.wisdomTags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      wisdomTags: prev.wisdomTags.filter(t => t !== tag)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Share Your Story</h2>
            <p className="text-gray-600 mt-1">Your anonymous story can inspire and support others</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Community Guidelines Popup */}
        {showGuidelines && (
          <div className="absolute inset-4 bg-white rounded-lg shadow-2xl z-10 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Community Guidelines</h3>
                <button
                  onClick={() => setShowGuidelines(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {communityGuidelines.map((guideline, index) => (
                  <div key={index} className="flex gap-4">
                    <guideline.icon className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{guideline.title}</h4>
                      <p className="text-gray-600">{guideline.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900">Content Moderation</h4>
                    <p className="text-purple-700 text-sm mt-1">
                      All stories are reviewed by our AI moderation system for safety. 
                      Content with crisis indicators will be escalated to professional support resources.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGuidelines(false)}
                className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 ${
                        currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Healing Stage & Title */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Where are you in your healing journey?
                  </label>
                  <div className="space-y-3">
                    {healingStages.map((stage) => (
                      <label
                        key={stage.value}
                        className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.healingStage === stage.value
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="healingStage"
                          value={stage.value}
                          checked={formData.healingStage === stage.value}
                          onChange={(e) => setFormData(prev => ({ ...prev, healingStage: e.target.value }))}
                          className="sr-only"
                        />
                        <div className="font-medium text-gray-900">{stage.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{stage.description}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Story Title (Optional)
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Give your story a title that captures its essence..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    maxLength={100}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Story Content */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="content" className="text-sm font-medium text-gray-700">
                      Your Story
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowGuidelines(true)}
                      className="text-purple-600 text-sm hover:text-purple-700 flex items-center gap-1"
                    >
                      <Lightbulb className="w-4 h-4" />
                      Guidelines
                    </button>
                  </div>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience, insights, or what you've learned... Your words might be exactly what someone else needs to hear today."
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    maxLength={5000}
                    required
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Minimum 50 characters for meaningful sharing</span>
                    <span>{formData.content.length}/5000</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={formData.content.length < 50}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Tags & Privacy */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Help others find your story)
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        disabled={formData.wisdomTags.includes(tag) || formData.wisdomTags.length >= 5}
                        className={`p-2 rounded text-sm transition-colors ${
                          formData.wisdomTags.includes(tag)
                            ? 'bg-purple-100 text-purple-700 cursor-default'
                            : formData.wisdomTags.length >= 5
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-700 cursor-pointer'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                  
                  {formData.wisdomTags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.wisdomTags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            #{tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-purple-500 hover:text-purple-700"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Select up to 5 tags that best describe your story's themes
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Anonymous Sharing</p>
                      <p className="text-sm text-green-700">
                        Your identity will remain completely anonymous. You'll be assigned a random community name.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shareLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, shareLocation: e.target.checked }))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Share General Location</p>
                      <p className="text-sm text-gray-600">
                        Share your country/region (not city) to help others find local context
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || formData.wisdomTags.length === 0}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Share Story
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800">{error}</p>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}