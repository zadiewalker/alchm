'use client';

import { useOnboardingTest, useJournalPromptsTest, useDashboardLayoutTest, useFeatureFlags } from '@/components/ABTestProvider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Example: Onboarding Quiz with A/B Testing
export function OnboardingQuizExample() {
  const { variant, config, trackConversion } = useOnboardingTest();

  if (!variant) {
    return <div>Loading onboarding...</div>;
  }

  const handleQuizComplete = () => {
    trackConversion('pathway_started');
  };

  if (variant === 'extended') {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-medium mb-4">Extended Pathway Discovery (8 Questions)</h2>
        <p className="text-gray-600 mb-4">
          This extended version helps us better understand your unique journey.
        </p>
        <div className="space-y-4">
          {/* 8 questions would go here */}
          <div className="p-3 border rounded">Question 1: What brings you to ALCHM today?</div>
          <div className="p-3 border rounded">Question 2: How would you describe your current emotional state?</div>
          <div className="p-3 border rounded">Question 3: What healing modalities resonate with you?</div>
          <div className="p-3 border rounded">Question 4: How do you prefer to process emotions?</div>
          <div className="p-3 border rounded">Question 5: What time of day do you feel most reflective?</div>
          <div className="p-3 border rounded">Question 6: How important is community support to you?</div>
          <div className="p-3 border rounded">Question 7: What are your wellness goals?</div>
          <div className="p-3 border rounded">Question 8: How do you handle stress?</div>
        </div>
        <Button onClick={handleQuizComplete} className="mt-6">
          Complete Extended Assessment
        </Button>
      </Card>
    );
  }

  // Control variant (standard 5 questions)
  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Pathway Discovery (5 Questions)</h2>
      <p className="text-gray-600 mb-4">
        Help us recommend the perfect healing pathway for you.
      </p>
      <div className="space-y-4">
        {/* 5 questions would go here */}
        <div className="p-3 border rounded">Question 1: What's your biggest challenge right now?</div>
        <div className="p-3 border rounded">Question 2: How do you typically cope with stress?</div>
        <div className="p-3 border rounded">Question 3: What does healing mean to you?</div>
        <div className="p-3 border rounded">Question 4: When do you feel most at peace?</div>
        <div className="p-3 border rounded">Question 5: What support do you need most?</div>
      </div>
      <Button onClick={handleQuizComplete} className="mt-6">
        Find My Pathway
      </Button>
    </Card>
  );
}

// Example: Journal Prompts with A/B Testing
export function JournalPromptsExample() {
  const { variant, config, trackConversion } = useJournalPromptsTest();

  if (!variant) {
    return <div>Loading prompts...</div>;
  }

  const handlePromptUsed = () => {
    trackConversion('journal_entry_completed');
  };

  const getPrompts = () => {
    switch (variant) {
      case 'empathetic':
        return [
          "💝 How are you feeling in your heart right now, and what does it need?",
          "🌱 What small act of self-kindness can you offer yourself today?",
          "🤗 If you could give yourself a warm hug, what would you whisper?"
        ];
      case 'direct':
        return [
          "🎯 What's one specific action you can take today to move forward?",
          "💪 What challenge are you ready to tackle head-on?",
          "🚀 What outcome do you want to create this week?"
        ];
      case 'reflective':
        return [
          "🌙 What patterns in your thoughts deserve gentle attention?",
          "🍃 How has this experience shaped who you're becoming?",
          "💭 What wisdom is trying to emerge from this moment?"
        ];
      default:
        return ["What's on your mind today?"];
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">
        Journal Prompts - {config?.tone} Style
      </h3>
      <div className="space-y-3">
        {getPrompts().map((prompt, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100">
            <p className="text-gray-800">{prompt}</p>
            <Button 
              size="sm" 
              className="mt-2"
              onClick={handlePromptUsed}
            >
              Start Writing
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Example: Dashboard Layout with A/B Testing
export function DashboardLayoutExample() {
  const { variant, config } = useDashboardLayoutTest();

  if (!variant) {
    return <div>Loading dashboard...</div>;
  }

  if (variant === 'list_focused') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-medium">Your Journey (List View)</h2>
        <div className="space-y-2">
          <div className="p-4 border rounded flex items-center justify-between">
            <div>
              <h3 className="font-medium">Recent Entry: Morning Reflection</h3>
              <p className="text-sm text-gray-600">2 hours ago • Pathway: Resilience</p>
            </div>
            <Button size="sm">Continue</Button>
          </div>
          <div className="p-4 border rounded flex items-center justify-between">
            <div>
              <h3 className="font-medium">Milestone: Week 2 Complete</h3>
              <p className="text-sm text-gray-600">Yesterday • 7 entries this week</p>
            </div>
            <Button size="sm" variant="outline">View</Button>
          </div>
          <div className="p-4 border rounded flex items-center justify-between">
            <div>
              <h3 className="font-medium">Insight: Emotional Pattern</h3>
              <p className="text-sm text-gray-600">3 days ago • Morning clarity trend</p>
            </div>
            <Button size="sm" variant="outline">Explore</Button>
          </div>
        </div>
      </div>
    );
  }

  // Control variant (card-based)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium">Your Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-medium mb-2">Recent Entry</h3>
          <p className="text-sm text-gray-600 mb-4">Morning Reflection • 2 hours ago</p>
          <Button size="sm">Continue Writing</Button>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium mb-2">Weekly Progress</h3>
          <p className="text-sm text-gray-600 mb-4">7 entries completed</p>
          <Button size="sm" variant="outline">View Details</Button>
        </Card>
        <Card className="p-6">
          <h3 className="font-medium mb-2">New Insight</h3>
          <p className="text-sm text-gray-600 mb-4">Morning clarity pattern detected</p>
          <Button size="sm" variant="outline">Explore</Button>
        </Card>
      </div>
    </div>
  );
}

// Example: Feature Flag Usage
export function FeatureFlagsExample() {
  const featureFlags = useFeatureFlags();

  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Available Features</h3>
      <div className="space-y-2">
        {featureFlags.advancedAnalytics && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Advanced Analytics Dashboard</span>
          </div>
        )}
        {featureFlags.communityFeatures && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Community Sharing Circles</span>
          </div>
        )}
        {featureFlags.aiInsights && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>AI-Powered Insights</span>
          </div>
        )}
        {featureFlags.crisisDetection && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Crisis Detection & Support</span>
          </div>
        )}
        {featureFlags.therapistDashboard && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Therapist Dashboard (Enterprise)</span>
          </div>
        )}
        {featureFlags.exportFeatures && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Data Export & PDF Generation</span>
          </div>
        )}
      </div>
    </Card>
  );
}

// Example: Complete A/B Testing Showcase
export default function ABTestExamples() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-medium mb-2">A/B Testing Examples</h1>
        <p className="text-gray-600">
          These components demonstrate how A/B tests adapt user experience in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <OnboardingQuizExample />
          <JournalPromptsExample />
        </div>
        <div className="space-y-6">
          <DashboardLayoutExample />
          <FeatureFlagsExample />
        </div>
      </div>
    </div>
  );
}