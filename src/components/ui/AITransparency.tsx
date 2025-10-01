'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * AI Transparency Component for App Store Compliance
 * Ensures universal AI identification across all Khepera interactions
 * Maintains healing-centered experience while meeting regulatory requirements
 */

export interface AITransparencyConfig {
  showFullDisclosure?: boolean;
  includeCapabilityLimits?: boolean;
  emphasizeHumanConnection?: boolean;
  crisisMode?: boolean;
  contextualMode?: 'onboarding' | 'interaction' | 'settings' | 'crisis';
}

export interface AIIdentificationProps {
  response?: string;
  config?: AITransparencyConfig;
  className?: string;
}

interface AITransparencyProps {
  context?: 'onboarding' | 'journal' | 'insights' | 'general';
  className?: string;
}

/**
 * Universal AI identification validator
 * Ensures every Khepera response includes proper identification
 */
export const validateAIIdentification = (response: string): boolean => {
  const requiredIdentifiers = [
    '✨ I am Khepera',
    'I am Khepera',
    'khepera',
    'AI'
  ];
  
  const lowerResponse = response.toLowerCase();
  return requiredIdentifiers.some(identifier => 
    lowerResponse.includes(identifier.toLowerCase())
  );
};

/**
 * Ensures AI identification is present in response
 * If missing, prepends the standard identification
 */
export const ensureAIIdentification = (response: string, config?: AITransparencyConfig): string => {
  if (validateAIIdentification(response)) {
    return response;
  }
  
  // Crisis mode - gentle but clear identification
  if (config?.crisisMode) {
    return `✨ I am Khepera, an AI companion here to support you. ${response}`;
  }
  
  // Standard identification
  if (response.startsWith('✨ I am Khepera')) {
    return response;
  }
  
  return `✨ I am Khepera. ${response}`;
};

/**
 * AI Capability Disclaimer Component
 */
export const AICapabilityDisclaimer: React.FC<{ 
  mode?: 'minimal' | 'standard' | 'comprehensive';
  className?: string;
}> = ({ mode = 'standard', className = '' }) => {
  const disclaimers = {
    minimal: {
      text: "I'm an AI companion, not a licensed therapist or medical professional.",
      icon: "🤖"
    },
    standard: {
      text: "I'm Khepera, an AI companion designed to support your emotional journey. I'm not a replacement for professional mental health care.",
      icon: "✨"
    },
    comprehensive: {
      text: "I'm Khepera, an AI-powered emotional intelligence system. While I'm designed to provide supportive insights, I cannot replace professional therapy, medical advice, or crisis intervention services.",
      icon: "✨"
    }
  };

  const disclaimer = disclaimers[mode];
  
  return (
    <div className={`flex items-start gap-3 p-4 bg-[#a4b792]/5 border border-[#a4b792]/20 rounded-xl text-sm text-[#2e2e2e] ${className}`}>
      <span className="text-xl text-[#a4b792]" role="img" aria-label="AI indicator">
        {disclaimer.icon}
      </span>
      <p className="flex-1 leading-relaxed text-[#2e2e2e]/80">
        {disclaimer.text}
      </p>
    </div>
  );
};

/**
 * Crisis-Aware AI Transparency Component
 */
export const CrisisAwareAITransparency: React.FC<{
  severity?: 'low' | 'medium' | 'high';
  className?: string;
}> = ({ severity = 'medium', className = '' }) => {
  const crisisMessages = {
    low: {
      message: "I'm Khepera, an AI companion. For immediate professional support, please reach out to a counselor or therapist.",
      action: "Find Professional Support"
    },
    medium: {
      message: "I'm Khepera, an AI designed to support you. If you're experiencing a crisis, please contact a mental health professional immediately.",
      action: "Get Immediate Support"
    },
    high: {
      message: "I'm Khepera, an AI. This situation requires immediate human professional help. Please contact crisis services now.",
      action: "Call Crisis Line: 988"
    }
  };

  const crisis = crisisMessages[severity];
  
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-800 font-medium mb-2">{crisis.message}</p>
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
            {crisis.action}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AITransparency({ 
  context = 'general',
  className = ''
}: AITransparencyProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualMessage = () => {
    switch (context) {
      case 'onboarding':
        return {
          title: "Meet Khepera - Your AI Companion",
          description: "✨ I am Khepera, an AI designed to support your emotional journey. I analyze your responses to recommend personalized healing pathways, but you're always in control.",
          details: "I'm an artificial intelligence system trained on trauma-informed principles. I help personalize your experience by understanding your emotional patterns and suggesting relevant content. I'm not a replacement for professional therapy or medical care."
        };
      case 'journal':
        return {
          title: "Khepera's Writing Support",
          description: "✨ I am Khepera. I provide AI-generated prompts and reflection questions to support your journaling. Your writing remains private and my insights are suggestions, not medical advice.",
          details: "As an AI companion, I analyze your writing patterns to offer personalized prompts and reflections. These are tools for self-discovery, not therapeutic interventions. I cannot replace professional mental health support."
        };
      case 'insights':
        return {
          title: "Insights from Khepera",
          description: "✨ I am Khepera. I create personalized insights using AI analysis of your journal patterns. These are for reflection only and don't constitute professional advice.",
          details: "As your AI companion, I analyze patterns in your journaling to provide insights about your emotional journey. My observations are meant to support self-reflection, not replace professional guidance or medical diagnosis."
        };
      default:
        return {
          title: "Your AI Companion - Khepera",
          description: "✨ I am Khepera, an AI that personalizes your healing journey through pathway recommendations, reflection prompts, and emotional insights.",
          details: "As an artificial intelligence system, I help personalize your experience by analyzing your interactions, writing patterns, and preferences. I'm designed to support your emotional growth, but I'm not a replacement for professional mental health care."
        };
    }
  };

  const { title, description, details } = getContextualMessage();

  return (
    <div className={`bg-[#a4b792]/5 border border-[#a4b792]/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#a4b792]/10 flex items-center justify-center mt-0.5">
          <span className="text-[#a4b792] text-lg">✨</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-medium text-[#2e2e2e]">
              {title}
            </h3>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#a4b792] hover:text-[#93a682] text-sm font-medium transition-colors duration-200"
            >
              {isExpanded ? 'Less' : 'Learn More'}
            </button>
          </div>
          <p className="text-sm text-[#2e2e2e]/80 leading-relaxed">
            {description}
          </p>
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-[#a4b792]/20">
              <p className="text-sm text-[#2e2e2e]/70 leading-relaxed mb-4">
                {details}
              </p>
              <div className="flex gap-6 text-sm">
                <Link href="/privacy.html" className="text-[#a4b792] hover:text-[#93a682] font-medium transition-colors duration-200">
                  Privacy Policy →
                </Link>
                <Link href="/terms.html" className="text-[#a4b792] hover:text-[#93a682] font-medium transition-colors duration-200">
                  AI Usage Terms →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}