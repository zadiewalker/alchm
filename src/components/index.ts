// ALCHM Component Library - Jony Ive Inspired Design System
// "Simplicity is the ultimate sophistication" - Leonardo da Vinci
// Every component serves the sacred purpose of healing and growth

// Onboarding & User Experience
export { default as ProgressiveOnboardingFlow } from './onboarding/ProgressiveOnboardingFlow';
export { default as ComprehensiveGuidedExperience, SanctuaryTransition, CrisisSafetyLayer } from './guided-experience/ComprehensiveGuidedExperience';

// Navigation & Wayfinding
export { 
  SanctuaryNavigation, 
  SanctuaryBreadcrumbs, 
  QuickNavigation, 
  SanctuaryPageHeader 
} from './nav/SanctuaryNavigation';

// Intelligent Prompts & Writing
export { 
  IntelligentPromptSystem, 
  QuickPromptSuggestion 
} from './prompts/IntelligentPromptSystem';

export { 
  SupportiveWritingEnvironment, 
  WritingModeSelector 
} from './writing/SupportiveWritingEnvironment';

// Enhanced UI Components
export { Button } from './ui/button';
export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from './ui/card';

// Design System Usage Examples
export const DesignSystemUsage = {
  // Color usage examples for components
  colors: {
    primary: 'Use sage-400 for primary actions and key interactive elements',
    accent: 'Use sage-50/100 for subtle backgrounds and gentle highlights',
    text: 'Use sanctuary-gray-800 for primary text, sanctuary-gray-600 for secondary',
    success: 'Use sage-600 for success states and positive feedback',
    warning: 'Use warm-amber for gentle warnings and attention states',
    crisis: 'Use warm-amber for crisis support elements (never harsh red)'
  },
  
  spacing: {
    component: 'Use space-6 (24px) for component padding, space-4 (16px) for smaller elements',
    section: 'Use space-16 (64px) for section spacing, space-12 (48px) for subsections',
    touch: 'Minimum 44px touch targets, prefer 48px+ for anxiety-friendly interactions'
  },
  
  transitions: {
    gentle: 'Use transition-gentle (200ms) for subtle state changes',
    smooth: 'Use transition-smooth (300ms) for modal/overlay animations',
    breathe: 'Use transition-breathe (500ms) for calming, meditative effects'
  },
  
  shadows: {
    cards: 'Use shadow-gentle for cards, shadow-soft for hover states',
    modals: 'Use shadow-nurturing for important overlays and dialogs',
    sacred: 'Use shadow-sacred sparingly for special elements'
  }
};

// Trauma-Informed Design Principles for Developers
export const TraumaInformedGuidelines = {
  safety: {
    exits: 'Always provide clear, accessible exit routes from any flow',
    control: 'Give users control over pace, content, and engagement level',
    predictability: 'Maintain consistent patterns and avoid sudden changes'
  },
  
  trustworthiness: {
    transparency: 'Be clear about what data is collected and how it\'s used',
    reliability: 'Ensure features work consistently and as expected',
    boundaries: 'Respect user boundaries and preferences clearly'
  },
  
  collaboration: {
    voice: 'Center user voice and choice in all interactions',
    agency: 'Support user agency rather than directing or controlling',
    respect: 'Honor diverse healing paths and cultural backgrounds'
  },
  
  empowerment: {
    strengths: 'Build on user strengths and existing resilience',
    choice: 'Provide meaningful choices and customization options',
    growth: 'Support gradual growth at user-determined pace'
  }
};

// Accessibility Considerations
export const AccessibilityFeatures = {
  visual: {
    contrast: 'All color combinations meet WCAG 2.1 AA standards',
    sizing: 'Text remains readable at 200% zoom',
    motion: 'Respects prefers-reduced-motion for sensitive users'
  },
  
  motor: {
    targets: 'Touch targets minimum 44px, prefer 48px+',
    timing: 'No time limits on interactions, generous timeouts',
    navigation: 'Full keyboard navigation support'
  },
  
  cognitive: {
    language: 'Clear, simple language avoiding jargon',
    structure: 'Logical heading structure and content organization',
    focus: 'Clear focus indicators and manageable cognitive load'
  }
};

// Component Integration Examples
export const IntegrationExamples = {
  // Basic dashboard with navigation
  basicDashboard: `
    <SanctuaryNavigation />
    <SanctuaryPageHeader 
      title="Your Sanctuary"
      subtitle="Safe space for reflection"
      icon="🕊️"
    />
    <QuickNavigation />
  `,
  
  // Writing flow with prompts
  writingFlow: `
    <IntelligentPromptSystem 
      userState={{ mood: 'calm', timeAvailable: 'medium' }}
      onPromptSelect={handlePromptSelect}
    />
    <SupportiveWritingEnvironment
      prompt="Selected prompt text"
      onSave={handleSave}
      onExit={handleExit}
    />
  `,
  
  // Onboarding integration
  onboardingIntegration: `
    <CrisisSafetyLayer>
      <ProgressiveOnboardingFlow />
    </CrisisSafetyLayer>
  `
};