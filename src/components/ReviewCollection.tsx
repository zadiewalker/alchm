'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ReviewData {
  overallRating: number;
  categoryRatings: {
    traumaInformed: number;
    aiQuality: number;
    userExperience: number;
    privacy: number;
    effectiveness: number;
  };
  writtenReview: string;
  wouldRecommend: boolean;
  userJourneyStage: string;
  improvementSuggestions: string;
  permitPublicUse: boolean;
  demographicInfo?: {
    ageRange: string;
    traumaType: string;
    previousTherapy: boolean;
  };
}

interface ReviewCollectionProps {
  userId: string;
  userStats: {
    streakDays: number;
    badgesEarned: number;
    journalEntries: number;
    daysUsing: number;
  };
  onSubmit: (reviewData: ReviewData) => void;
  onSkip: () => void;
}

export default function ReviewCollection({ userId, userStats, onSubmit, onSkip }: ReviewCollectionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reviewData, setReviewData] = useState<ReviewData>({
    overallRating: 0,
    categoryRatings: {
      traumaInformed: 0,
      aiQuality: 0,
      userExperience: 0,
      privacy: 0,
      effectiveness: 0
    },
    writtenReview: '',
    wouldRecommend: false,
    userJourneyStage: '',
    improvementSuggestions: '',
    permitPublicUse: false
  });

  const steps = [
    { id: 'overall', title: 'Overall Experience', description: 'How has ALCHM been for you?' },
    { id: 'categories', title: 'Detailed Ratings', description: 'Rate specific aspects' },
    { id: 'written', title: 'Your Story', description: 'Share your experience' },
    { id: 'recommendations', title: 'Improvements', description: 'Help us grow' },
    { id: 'permissions', title: 'Sharing Options', description: 'How can we use your review?' }
  ];

  const OverallRatingStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-2">How would you rate your ALCHM experience?</h2>
        <p className="text-gray-600">Your feedback helps us improve trauma-informed care for everyone</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-medium text-blue-600">{userStats.daysUsing}</div>
            <div className="text-sm text-blue-700">Days with ALCHM</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-green-600">{userStats.streakDays}</div>
            <div className="text-sm text-green-700">Current Streak</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-purple-600">{userStats.badgesEarned}</div>
            <div className="text-sm text-purple-700">Badges Earned</div>
          </div>
          <div>
            <div className="text-2xl font-medium text-amber-600">{userStats.journalEntries}</div>
            <div className="text-sm text-amber-700">Journal Entries</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => setReviewData(prev => ({ ...prev, overallRating: rating }))}
            className={`p-3 transition-all ${
              reviewData.overallRating >= rating
                ? 'text-yellow-400 transform scale-110'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>

      <div className="text-center">
        {reviewData.overallRating > 0 && (
          <p className="text-gray-600 mb-4">
            {reviewData.overallRating === 5 ? '🌟 Excellent! We\'re honored to be part of your healing journey.' :
             reviewData.overallRating === 4 ? '💜 Great! Thank you for trusting us with your wellness.' :
             reviewData.overallRating === 3 ? '👍 Good! We appreciate your feedback and commitment to growth.' :
             reviewData.overallRating === 2 ? '🤝 Thank you for your honesty. We\'re here to improve.' :
             '💙 We hear you. Your feedback helps us create better trauma-informed care.'}
          </p>
        )}
      </div>

      <Button
        onClick={() => setCurrentStep(1)}
        disabled={reviewData.overallRating === 0}
        className="w-full bg-purple-600 hover:bg-purple-700 py-3"
      >
        Continue
      </Button>
    </div>
  );

  const CategoryRatingsStep = () => {
    const categories = [
      {
        key: 'traumaInformed',
        title: '🛡️ Trauma-Informed Design',
        description: 'How well does ALCHM honor trauma-informed principles?'
      },
      {
        key: 'aiQuality',
        title: '🤖 AI Response Quality',
        description: 'How helpful and validating are the AI insights?'
      },
      {
        key: 'userExperience',
        title: '✨ User Experience',
        description: 'How intuitive and enjoyable is the interface?'
      },
      {
        key: 'privacy',
        title: '🔒 Privacy & Security',
        description: 'How safe do you feel sharing vulnerable thoughts?'
      },
      {
        key: 'effectiveness',
        title: '🌱 Personal Growth',
        description: 'How much has ALCHM helped your healing journey?'
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-2">Rate Specific Aspects</h2>
          <p className="text-gray-600">Help us understand what's working well</p>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category.key} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-gray-800">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setReviewData(prev => ({
                      ...prev,
                      categoryRatings: {
                        ...prev.categoryRatings,
                        [category.key]: rating
                      }
                    }))}
                    className={`p-1 transition-all ${
                      reviewData.categoryRatings[category.key as keyof typeof reviewData.categoryRatings] >= rating
                        ? 'text-purple-500'
                        : 'text-gray-300 hover:text-purple-400'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => setCurrentStep(2)}
          disabled={Object.values(reviewData.categoryRatings).some(rating => rating === 0)}
          className="w-full bg-purple-600 hover:bg-purple-700 py-3"
        >
          Continue to Written Review
        </Button>
      </div>
    );
  };

  const WrittenReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Share Your ALCHM Story</h2>
        <p className="text-gray-600">Your story could help others on their healing journey</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you tell someone considering ALCHM? (Optional)
          </label>
          <textarea
            value={reviewData.writtenReview}
            onChange={(e) => setReviewData(prev => ({ ...prev, writtenReview: e.target.value }))}
            placeholder="Share how ALCHM has impacted your wellness journey, what surprised you, or what you'd want others to know..."
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where are you in your healing journey with ALCHM?
          </label>
          <select
            value={reviewData.userJourneyStage}
            onChange={(e) => setReviewData(prev => ({ ...prev, userJourneyStage: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select your stage...</option>
            <option value="just_started">Just getting started (0-2 weeks)</option>
            <option value="building_habits">Building habits (2-8 weeks)</option>
            <option value="seeing_progress">Seeing real progress (2-6 months)</option>
            <option value="integrated_practice">ALCHM is part of my life (6+ months)</option>
            <option value="transformative_impact">Life-changing experience (1+ year)</option>
          </select>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={reviewData.wouldRecommend}
              onChange={(e) => setReviewData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
              className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-purple-800">
              <strong>I would recommend ALCHM to others on a healing journey</strong>
            </span>
          </label>
        </div>
      </div>

      <Button
        onClick={() => setCurrentStep(3)}
        className="w-full bg-purple-600 hover:bg-purple-700 py-3"
      >
        Continue
      </Button>
    </div>
  );

  const ImprovementsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Help Us Improve</h2>
        <p className="text-gray-600">Your insights guide our trauma-informed development</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What could make ALCHM even better for your healing journey? (Optional)
        </label>
        <textarea
          value={reviewData.improvementSuggestions}
          onChange={(e) => setReviewData(prev => ({ ...prev, improvementSuggestions: e.target.value }))}
          placeholder="Features you'd love to see, improvements to existing functionality, or ways we could better support trauma healing..."
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">💡 Your feedback shapes ALCHM's future</h3>
        <p className="text-sm text-blue-700">
          Every suggestion helps us build more effective, compassionate tools for trauma-informed wellness.
          Your voice matters in creating technology that truly serves healing.
        </p>
      </div>

      <Button
        onClick={() => setCurrentStep(4)}
        className="w-full bg-purple-600 hover:bg-purple-700 py-3"
      >
        Continue to Privacy Settings
      </Button>
    </div>
  );

  const PermissionsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Review Sharing Options</h2>
        <p className="text-gray-600">You have complete control over your review's visibility</p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={reviewData.permitPublicUse}
              onChange={(e) => setReviewData(prev => ({ ...prev, permitPublicUse: e.target.checked }))}
              className="rounded border-green-300 text-green-600 focus:ring-green-500 mt-1"
            />
            <div>
              <span className="font-medium text-green-800">
                Permission to use my review publicly (always anonymous)
              </span>
              <p className="text-sm text-green-700 mt-1">
                We may feature your review on our website, marketing materials, or app stores to help others 
                discover trauma-informed wellness. Your identity is never shared - only your words and ratings.
              </p>
            </div>
          </label>
        </div>

        {reviewData.permitPublicUse && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Optional Demographic Context</h3>
            <p className="text-sm text-yellow-700 mb-3">
              This helps others with similar backgrounds relate to your story. Always anonymous.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                className="p-2 border border-yellow-300 rounded text-sm"
                onChange={(e) => setReviewData(prev => ({
                  ...prev,
                  demographicInfo: {
                    ...prev.demographicInfo,
                    ageRange: e.target.value,
                    traumaType: prev.demographicInfo?.traumaType || '',
                    previousTherapy: prev.demographicInfo?.previousTherapy || false
                  }
                }))}
              >
                <option value="">Age range (optional)</option>
                <option value="18-25">18-25</option>
                <option value="26-35">26-35</option>
                <option value="36-45">36-45</option>
                <option value="46-55">46-55</option>
                <option value="56+">56+</option>
              </select>

              <select
                className="p-2 border border-yellow-300 rounded text-sm"
                onChange={(e) => setReviewData(prev => ({
                  ...prev,
                  demographicInfo: {
                    ...prev.demographicInfo,
                    ageRange: prev.demographicInfo?.ageRange || '',
                    traumaType: e.target.value,
                    previousTherapy: prev.demographicInfo?.previousTherapy || false
                  }
                }))}
              >
                <option value="">Experience type (optional)</option>
                <option value="anxiety">Anxiety/Depression</option>
                <option value="ptsd">PTSD/Trauma</option>
                <option value="complex_trauma">Complex Trauma</option>
                <option value="grief">Grief/Loss</option>
                <option value="general_wellness">General Wellness</option>
              </select>

              <label className="flex items-center space-x-2 p-2">
                <input
                  type="checkbox"
                  className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500"
                  onChange={(e) => setReviewData(prev => ({
                    ...prev,
                    demographicInfo: {
                      ...prev.demographicInfo,
                      ageRange: prev.demographicInfo?.ageRange || '',
                      traumaType: prev.demographicInfo?.traumaType || '',
                      previousTherapy: e.target.checked
                    }
                  }))}
                />
                <span className="text-sm text-yellow-800">Previous therapy</span>
              </label>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">🔒 Privacy Guarantee</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Your name and email are never shared</li>
            <li>• Reviews are only used to help others discover ALCHM</li>
            <li>• You can request removal of your review anytime</li>
            <li>• All data follows strict privacy and security protocols</li>
          </ul>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => onSubmit(reviewData)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 py-3"
        >
          Submit Review
        </Button>
        <Button
          onClick={onSkip}
          variant="outline"
          className="px-6 py-3"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );

  const steps_components = [OverallRatingStep, CategoryRatingsStep, WrittenReviewStep, ImprovementsStep, PermissionsStep];
  const CurrentStepComponent = steps_components[currentStep];

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (!CurrentStepComponent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <CurrentStepComponent />
        </div>

        {/* Navigation */}
        {currentStep > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}