'use client';

import React, { useState, useEffect } from 'react';
import { SacredCard, SacredText, SacredButton, SacredInput, SacredGrid } from '@/components/SacredUIFoundation';
import type { AnonymizedYouthProfile, YouthFeedbackInput, YouthFeaturePriority } from '@/lib/youth-advisory/youth-co-creation-engine';

// ===== YOUTH VOICE PANEL TYPES =====

export interface YouthVoicePanelProps {
  feature?: string;
  allowAnonymous?: boolean;
  compensationEligible?: boolean;
  showPriorityVoting?: boolean;
  showAdvisoryApplication?: boolean;
  className?: string;
}

export interface YouthFeedbackFormData {
  feedbackType: 'feature_request' | 'bug_report' | 'design_feedback' | 'priority_input' | 'cultural_input';
  content: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  anonymityPreferred: boolean;
  demographicInfo?: Partial<AnonymizedYouthProfile>;
  culturalPerspectives?: string[];
}

export interface YouthPriorityVote {
  featureId: string;
  priorityScore: number; // 1-10
  justification: string;
  culturalImpact: string;
  accessibilityImpact: string;
}

// ===== YOUTH VOICE PANEL COMPONENT =====

export function YouthVoicePanel({
  feature,
  allowAnonymous = true,
  compensationEligible = true,
  showPriorityVoting = true,
  showAdvisoryApplication = true,
  className = ''
}: YouthVoicePanelProps) {
  const [activeTab, setActiveTab] = useState<'feedback' | 'voting' | 'advisory'>('feedback');
  const [isYouthUser, setIsYouthUser] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Check if user qualifies as youth (would be integrated with auth system)
  useEffect(() => {
    checkYouthEligibility();
  }, []);

  const checkYouthEligibility = async () => {
    // Implementation would check user age/eligibility
    // For demo purposes, assume eligible
    setIsYouthUser(true);
  };

  if (!isYouthUser) {
    return (
      <YouthVoiceInfoPanel />
    );
  }

  return (
    <SacredCard variant="warm" className={`youth-voice-panel ${className}`}>
      <div className="space-y-ritual">
        <YouthVoiceHeader />
        
        <YouthVoiceTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showPriorityVoting={showPriorityVoting}
          showAdvisoryApplication={showAdvisoryApplication}
        />

        <div className="tab-content">
          {activeTab === 'feedback' && (
            <YouthFeedbackForm
              feature={feature}
              allowAnonymous={allowAnonymous}
              compensationEligible={compensationEligible}
              onSubmitted={() => setFeedbackSubmitted(true)}
            />
          )}
          
          {activeTab === 'voting' && showPriorityVoting && (
            <YouthPriorityVoting />
          )}
          
          {activeTab === 'advisory' && showAdvisoryApplication && (
            <YouthAdvisoryApplication />
          )}
        </div>

        {feedbackSubmitted && (
          <YouthFeedbackConfirmation />
        )}
      </div>
    </SacredCard>
  );
}

// ===== YOUTH VOICE HEADER =====

function YouthVoiceHeader() {
  return (
    <div className="text-center space-y-breath">
      <div className="text-3xl">🌟</div>
      <SacredText variant="title" as="h3">
        Youth Voice Matters
      </SacredText>
      <SacredText variant="body">
        Your perspective shapes ALCHM's future. Share your thoughts, vote on priorities, 
        and help co-create a platform that truly serves youth.
      </SacredText>
      <div className="flex items-center justify-center gap-gentle text-xs text-subtle">
        <span>💰 Compensation available</span>
        <span>•</span>
        <span>🔒 Privacy protected</span>
        <span>•</span>
        <span>🌍 Culturally inclusive</span>
      </div>
    </div>
  );
}

// ===== YOUTH VOICE TABS =====

interface YouthVoiceTabsProps {
  activeTab: 'feedback' | 'voting' | 'advisory';
  onTabChange: (tab: 'feedback' | 'voting' | 'advisory') => void;
  showPriorityVoting: boolean;
  showAdvisoryApplication: boolean;
}

function YouthVoiceTabs({ activeTab, onTabChange, showPriorityVoting, showAdvisoryApplication }: YouthVoiceTabsProps) {
  const tabs = [
    { id: 'feedback', label: 'Share Feedback', icon: '💬' },
    ...(showPriorityVoting ? [{ id: 'voting' as const, label: 'Vote on Priorities', icon: '🗳️' }] : []),
    ...(showAdvisoryApplication ? [{ id: 'advisory' as const, label: 'Join Advisory Board', icon: '👥' }] : [])
  ];

  return (
    <div className="flex border-b border-tender-embrace">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 px-breath py-gentle text-center border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-grounding-earth text-grounding-earth'
              : 'border-transparent text-subtle hover:text-deep-presence'
          }`}
        >
          <div className="space-y-whisper">
            <div className="text-lg">{tab.icon}</div>
            <SacredText variant="caption" className="font-medium">
              {tab.label}
            </SacredText>
          </div>
        </button>
      ))}
    </div>
  );
}

// ===== YOUTH FEEDBACK FORM =====

interface YouthFeedbackFormProps {
  feature?: string;
  allowAnonymous: boolean;
  compensationEligible: boolean;
  onSubmitted: () => void;
}

function YouthFeedbackForm({ feature, allowAnonymous, compensationEligible, onSubmitted }: YouthFeedbackFormProps) {
  const [formData, setFormData] = useState<YouthFeedbackFormData>({
    feedbackType: 'feature_request',
    content: '',
    urgencyLevel: 'medium',
    anonymityPreferred: true,
    demographicInfo: {},
    culturalPerspectives: []
  });

  const [showDemographics, setShowDemographics] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Implementation would submit to youth feedback system
    console.log('Youth feedback submitted:', formData);
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-ritual">
      <div className="space-y-breath">
        <SacredText variant="caption" className="font-semibold">
          What type of feedback are you sharing?
        </SacredText>
        
        <SacredGrid columns={2} gap="gentle">
          {[
            { value: 'feature_request', label: 'Feature Request', icon: '✨' },
            { value: 'bug_report', label: 'Bug Report', icon: '🐛' },
            { value: 'design_feedback', label: 'Design Feedback', icon: '🎨' },
            { value: 'cultural_input', label: 'Cultural Input', icon: '🌍' }
          ].map(type => (
            <label
              key={type.value}
              className={`cursor-pointer p-breath border rounded-lg transition-colors ${
                formData.feedbackType === type.value
                  ? 'border-grounding-earth bg-tender-embrace'
                  : 'border-gray-300 hover:border-grounding-earth'
              }`}
            >
              <input
                type="radio"
                name="feedbackType"
                value={type.value}
                checked={formData.feedbackType === type.value}
                onChange={(e) => setFormData(prev => ({ ...prev, feedbackType: e.target.value as any }))}
                className="sr-only"
              />
              <div className="text-center space-y-whisper">
                <div className="text-xl">{type.icon}</div>
                <SacredText variant="caption" className="text-xs">
                  {type.label}
                </SacredText>
              </div>
            </label>
          ))}
        </SacredGrid>
      </div>

      {feature && (
        <div className="p-breath bg-healing-mist rounded-lg">
          <SacredText variant="caption" className="text-xs font-medium">
            Providing feedback about: {feature}
          </SacredText>
        </div>
      )}

      <SacredInput
        label="Share your thoughts"
        isTextArea
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        placeholder="What would make ALCHM better for you and other youth? Be specific about your experience and needs."
        helpText="Your voice helps shape features that truly serve young people"
      />

      <div className="space-y-breath">
        <SacredText variant="caption" className="font-semibold">
          How urgent is this feedback?
        </SacredText>
        
        <div className="flex gap-breath">
          {[
            { value: 'low', label: 'Future consideration', color: 'bg-healing-mist' },
            { value: 'medium', label: 'Next quarter', color: 'bg-tender-embrace' },
            { value: 'high', label: 'Soon please', color: 'bg-grounding-earth text-white' }
          ].map(urgency => (
            <label
              key={urgency.value}
              className={`flex-1 cursor-pointer p-gentle rounded-lg text-center transition-colors ${
                formData.urgencyLevel === urgency.value
                  ? urgency.color
                  : 'border border-gray-300 hover:border-grounding-earth'
              }`}
            >
              <input
                type="radio"
                name="urgencyLevel"
                value={urgency.value}
                checked={formData.urgencyLevel === urgency.value}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value as any }))}
                className="sr-only"
              />
              <SacredText variant="caption" className="text-xs">
                {urgency.label}
              </SacredText>
            </label>
          ))}
        </div>
      </div>

      {allowAnonymous && (
        <div className="space-y-breath">
          <label className="flex items-center gap-gentle cursor-pointer">
            <input
              type="checkbox"
              checked={formData.anonymityPreferred}
              onChange={(e) => setFormData(prev => ({ ...prev, anonymityPreferred: e.target.checked }))}
              className="rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
            />
            <SacredText variant="caption">
              Keep my feedback anonymous (recommended)
            </SacredText>
          </label>
          
          <SacredText variant="caption" className="text-xs text-subtle">
            Anonymous feedback is still valuable and helps us understand youth needs
          </SacredText>
        </div>
      )}

      <div className="space-y-breath">
        <button
          type="button"
          onClick={() => setShowDemographics(!showDemographics)}
          className="text-grounding-earth hover:underline text-sm"
        >
          {showDemographics ? '−' : '+'} Optional: Share demographic context 
          {compensationEligible && ' (increases compensation eligibility)'}
        </button>
        
        {showDemographics && (
          <YouthDemographicForm
            data={formData.demographicInfo || {}}
            onChange={(demographics) => setFormData(prev => ({ ...prev, demographicInfo: demographics }))}
          />
        )}
      </div>

      <div className="flex gap-breath justify-end">
        <SacredButton
          type="submit"
          intention="primary"
          size="comfortable"
          disabled={!formData.content.trim()}
        >
          Share My Voice
        </SacredButton>
      </div>
      
      {compensationEligible && (
        <div className="text-center">
          <SacredText variant="caption" className="text-xs text-subtle">
            💰 This feedback may be eligible for compensation through our Youth Voice program
          </SacredText>
        </div>
      )}
    </form>
  );
}

// ===== YOUTH DEMOGRAPHIC FORM =====

interface YouthDemographicFormProps {
  data: Partial<AnonymizedYouthProfile>;
  onChange: (data: Partial<AnonymizedYouthProfile>) => void;
}

function YouthDemographicForm({ data, onChange }: YouthDemographicFormProps) {
  const updateField = (field: keyof AnonymizedYouthProfile, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <SacredCard variant="gentle" className="space-y-breath">
      <SacredText variant="caption" className="font-semibold text-xs">
        Demographic Context (Optional & Anonymous)
      </SacredText>
      
      <div className="space-y-breath">
        <div>
          <SacredText variant="caption" className="text-xs mb-whisper">
            Age Group
          </SacredText>
          <select
            value={data.ageGroup || ''}
            onChange={(e) => updateField('ageGroup', e.target.value)}
            className="w-full p-gentle border border-gray-300 rounded focus:border-grounding-earth"
          >
            <option value="">Prefer not to share</option>
            <option value="early_teen">Early teen (13-15)</option>
            <option value="mid_teen">Mid teen (16-17)</option>
            <option value="late_teen">Late teen (18-19)</option>
            <option value="young_adult">Young adult (20-25)</option>
          </select>
        </div>

        <div>
          <SacredText variant="caption" className="text-xs mb-whisper">
            Geographic Context
          </SacredText>
          <select
            value={data.geographicRegion || ''}
            onChange={(e) => updateField('geographicRegion', e.target.value)}
            className="w-full p-gentle border border-gray-300 rounded focus:border-grounding-earth"
          >
            <option value="">Prefer not to share</option>
            <option value="urban">Urban area</option>
            <option value="suburban">Suburban area</option>
            <option value="rural">Rural area</option>
            <option value="international">International</option>
          </select>
        </div>

        <SacredInput
          label="Cultural backgrounds (optional)"
          value={data.culturalBackgrounds?.join(', ') || ''}
          onChange={(e) => updateField('culturalBackgrounds', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="e.g., Mexican-American, Nigerian, Korean, Indigenous"
          helpText="This helps us understand diverse perspectives"
        />
      </div>
    </SacredCard>
  );
}

// ===== YOUTH PRIORITY VOTING =====

function YouthPriorityVoting() {
  const [currentFeatures] = useState([
    {
      id: 'peer_mentorship',
      title: 'Peer Mentorship Program',
      description: 'Connect with other youth for support and guidance',
      youthRequested: true
    },
    {
      id: 'cultural_prompts',
      title: 'More Cultural Journal Prompts',
      description: 'Prompts that reflect diverse cultural experiences',
      youthRequested: true
    },
    {
      id: 'anonymous_sharing',
      title: 'Anonymous Peer Sharing',
      description: 'Share insights anonymously with other youth',
      youthRequested: false
    },
    {
      id: 'crisis_support',
      title: 'Enhanced Crisis Support',
      description: 'Better crisis detection and youth-appropriate resources',
      youthRequested: false
    }
  ]);

  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          Help Us Prioritize
        </SacredText>
        <SacredText variant="body">
          Vote on which features matter most to you. Your votes directly influence our development roadmap.
        </SacredText>
      </div>

      <div className="space-y-breath">
        {currentFeatures.map(feature => (
          <YouthFeatureVoteCard key={feature.id} feature={feature} />
        ))}
      </div>
    </div>
  );
}

// ===== YOUTH FEATURE VOTE CARD =====

interface YouthFeatureVoteCardProps {
  feature: {
    id: string;
    title: string;
    description: string;
    youthRequested: boolean;
  };
}

function YouthFeatureVoteCard({ feature }: YouthFeatureVoteCardProps) {
  const [vote, setVote] = useState<YouthPriorityVote | null>(null);
  const [showJustification, setShowJustification] = useState(false);

  const handleVote = (priorityScore: number) => {
    setVote({
      featureId: feature.id,
      priorityScore,
      justification: '',
      culturalImpact: '',
      accessibilityImpact: ''
    });
    setShowJustification(true);
  };

  return (
    <SacredCard variant={feature.youthRequested ? 'warm' : 'default'}>
      <div className="space-y-breath">
        <div className="flex items-start justify-between">
          <div className="flex-grow">
            <div className="flex items-center gap-gentle mb-whisper">
              <SacredText variant="caption" className="font-semibold">
                {feature.title}
              </SacredText>
              {feature.youthRequested && (
                <span className="text-xs bg-grounding-earth text-white px-whisper py-1 rounded">
                  Youth Requested
                </span>
              )}
            </div>
            <SacredText variant="caption" className="text-xs text-subtle">
              {feature.description}
            </SacredText>
          </div>
        </div>

        <div className="space-y-breath">
          <SacredText variant="caption" className="text-xs font-medium">
            How important is this to you? (1 = low, 10 = critical)
          </SacredText>
          
          <div className="flex gap-whisper">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
              <button
                key={score}
                onClick={() => handleVote(score)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                  vote?.priorityScore === score
                    ? 'bg-grounding-earth text-white'
                    : 'border border-gray-300 hover:border-grounding-earth hover:bg-tender-embrace'
                }`}
              >
                {score}
              </button>
            ))}
          </div>
        </div>

        {showJustification && vote && (
          <div className="space-y-breath border-t border-tender-embrace pt-breath">
            <SacredInput
              label="Why is this important to you? (optional)"
              isTextArea
              value={vote.justification}
              onChange={(e) => setVote(prev => prev ? { ...prev, justification: e.target.value } : null)}
              placeholder="Share your perspective on why this feature matters..."
            />
          </div>
        )}
      </div>
    </SacredCard>
  );
}

// ===== YOUTH ADVISORY APPLICATION =====

function YouthAdvisoryApplication() {
  return (
    <div className="space-y-ritual">
      <div className="text-center space-y-breath">
        <SacredText variant="title" as="h4">
          Join Our Youth Advisory Board
        </SacredText>
        <SacredText variant="body">
          Help shape ALCHM's future as an official youth advisor. Compensation provided for your time and expertise.
        </SacredText>
      </div>

      <div className="space-y-breath">
        <SacredText variant="caption" className="font-semibold">
          What Youth Advisors Do:
        </SacredText>
        <ul className="space-y-whisper text-sm text-subtle">
          <li>• Provide feedback on new features before they launch</li>
          <li>• Help prioritize the development roadmap</li>
          <li>• Create content that speaks to youth experiences</li>
          <li>• Advocate for cultural inclusivity and accessibility</li>
          <li>• Mentor newer youth users</li>
        </ul>
      </div>

      <div className="space-y-breath">
        <SacredText variant="caption" className="font-semibold">
          Commitment & Compensation:
        </SacredText>
        <ul className="space-y-whisper text-sm text-subtle">
          <li>• 2 hours per month (flexible scheduling)</li>
          <li>• $50 stipend per month</li>
          <li>• Skill development certificates</li>
          <li>• Leadership experience for college/career</li>
          <li>• 6-month commitment with renewal option</li>
        </ul>
      </div>

      <SacredButton
        intention="primary"
        size="comfortable"
        className="w-full"
        onClick={() => {
          // Implementation would open application form
          console.log('Opening youth advisory application...');
        }}
      >
        Apply to Join Advisory Board
      </SacredButton>
    </div>
  );
}

// ===== YOUTH FEEDBACK CONFIRMATION =====

function YouthFeedbackConfirmation() {
  return (
    <SacredCard variant="sacred" className="text-center">
      <div className="space-y-breath">
        <div className="text-3xl">🙏</div>
        <SacredText variant="title" as="h4">
          Thank You for Your Voice
        </SacredText>
        <SacredText variant="body">
          Your feedback has been received and will be reviewed by our team. 
          Youth perspectives are essential to building a platform that truly serves young people.
        </SacredText>
        <SacredText variant="caption" className="text-xs text-subtle">
          You'll receive updates on how your feedback influences ALCHM's development
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== YOUTH VOICE INFO PANEL =====

function YouthVoiceInfoPanel() {
  return (
    <SacredCard variant="gentle">
      <div className="text-center space-y-breath">
        <div className="text-3xl">🌟</div>
        <SacredText variant="title" as="h4">
          Youth Voices Shape ALCHM
        </SacredText>
        <SacredText variant="body">
          ALCHM is co-created with and by young people. Youth advisors help prioritize features, 
          create content, and ensure the platform serves diverse youth experiences.
        </SacredText>
        <SacredText variant="caption" className="text-xs text-subtle">
          If you're between 13-25, you can participate in our Youth Voice program
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== EXPORT COMPONENT =====

export {
  YouthVoicePanel as default,
  YouthFeedbackForm,
  YouthPriorityVoting,
  YouthAdvisoryApplication
};