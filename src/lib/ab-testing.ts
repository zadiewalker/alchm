import React from 'react';

// A/B Test Variant Definition
export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // 0-1, total should equal 1
  config?: Record<string, any>;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  targetMetric: string;
  audienceFilter?: (user: any) => boolean;
  conversionGoals: string[];
}

// Storage for active tests
let activeTests: Map<string, ABTest> = new Map();

// User assignment storage (in production, this would be persisted)
const userAssignments: Map<string, Map<string, string>> = new Map();

class ABTestingFramework {
  private tests: Map<string, ABTest> = new Map();
  private assignments: Map<string, Map<string, string>> = new Map();
  private analytics: any;

  constructor() {
    this.loadTestsFromConfig();
  }

  // Load A/B tests from configuration
  private loadTestsFromConfig() {
    const testConfigs: ABTest[] = [
      {
        id: 'onboarding_pathway_quiz',
        name: 'Onboarding Pathway Quiz Optimization',
        description: 'Test different onboarding quiz flows for better pathway matching',
        variants: [
          {
            id: 'control',
            name: 'Current 5-Question Quiz',
            weight: 0.5,
            config: { questionCount: 5, format: 'standard' }
          },
          {
            id: 'extended',
            name: 'Extended 8-Question Quiz',
            weight: 0.5,
            config: { questionCount: 8, format: 'detailed' }
          }
        ],
        isActive: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-02-28'),
        targetMetric: 'pathway_completion_rate',
        conversionGoals: ['pathway_started', 'first_reflection_completed']
      },
      {
        id: 'journal_prompt_style',
        name: 'Journal Prompt Style Test',
        description: 'Test different AI prompt styles for journal entries',
        variants: [
          {
            id: 'empathetic',
            name: 'Empathetic & Nurturing Prompts',
            weight: 0.33,
            config: { tone: 'empathetic', style: 'nurturing' }
          },
          {
            id: 'direct',
            name: 'Direct & Action-Oriented Prompts',
            weight: 0.33,
            config: { tone: 'direct', style: 'actionable' }
          },
          {
            id: 'reflective',
            name: 'Reflective & Contemplative Prompts',
            weight: 0.34,
            config: { tone: 'reflective', style: 'contemplative' }
          }
        ],
        isActive: true,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-03-15'),
        targetMetric: 'journal_engagement_score',
        conversionGoals: ['journal_entry_completed', 'journal_session_extended']
      },
      {
        id: 'dashboard_layout',
        name: 'Dashboard Layout Optimization',
        description: 'Test different dashboard layouts for user engagement',
        variants: [
          {
            id: 'card_focused',
            name: 'Card-Based Layout',
            weight: 0.5,
            config: { layout: 'cards', emphasis: 'visual' }
          },
          {
            id: 'list_focused',
            name: 'List-Based Layout',
            weight: 0.5,
            config: { layout: 'list', emphasis: 'content' }
          }
        ],
        isActive: false, // Can be activated later
        startDate: new Date('2025-02-01'),
        targetMetric: 'dashboard_engagement_time',
        conversionGoals: ['dashboard_action_taken', 'feature_explored']
      },
      {
        id: 'crisis_intervention_ui',
        name: 'Crisis Intervention UI Test',
        description: 'Test different crisis support interface designs',
        variants: [
          {
            id: 'calm_blue',
            name: 'Calm Blue Theme',
            weight: 0.5,
            config: { theme: 'calm', primaryColor: '#4A90E2' }
          },
          {
            id: 'warm_green',
            name: 'Warm Green Theme',
            weight: 0.5,
            config: { theme: 'warm', primaryColor: '#7ED321' }
          }
        ],
        isActive: true,
        startDate: new Date('2025-01-01'),
        targetMetric: 'crisis_support_engagement',
        audienceFilter: (user: any) => user?.riskLevel === 'elevated',
        conversionGoals: ['crisis_resource_accessed', 'professional_contact_made']
      }
    ];

    testConfigs.forEach(test => {
      this.tests.set(test.id, test);
    });
  }

  // Assign user to test variant using deterministic hash
  public assignUserToVariant(userId: string, testId: string): string | null {
    const test = this.tests.get(testId);
    if (!test || !test.isActive) {
      return null;
    }

    // Check if user already has assignment
    const userTests = this.assignments.get(userId) || new Map();
    if (userTests.has(testId)) {
      return userTests.get(testId)!;
    }

    // Apply audience filter if present
    if (test.audienceFilter) {
      // In production, you'd get user data here
      // For now, we'll assume all users pass the filter
    }

    // Deterministic assignment based on user ID and test ID
    const hash = this.hashString(`${userId}_${testId}`);
    const hashValue = hash / 2147483647; // Normalize to 0-1

    let cumulativeWeight = 0;
    let selectedVariant = test.variants[0]?.id || 'default'; // Fallback

    for (const variant of test.variants) {
      cumulativeWeight += variant.weight;
      if (hashValue <= cumulativeWeight) {
        selectedVariant = variant.id;
        break;
      }
    }

    // Store assignment
    if (!this.assignments.has(userId)) {
      this.assignments.set(userId, new Map());
    }
    this.assignments.get(userId)!.set(testId, selectedVariant);

    // Track assignment event
    this.trackEvent('ab_test_assignment', {
      test_id: testId,
      variant_id: selectedVariant,
      user_id: userId
    });

    return selectedVariant;
  }

  // Get test configuration for a variant
  public getVariantConfig(testId: string, variantId: string): Record<string, any> | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const variant = test.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  // Check if user is in a specific test variant
  public isUserInVariant(userId: string, testId: string, variantId: string): boolean {
    const assignment = this.getUserAssignment(userId, testId);
    return assignment === variantId;
  }

  // Get user's assignment for a test
  public getUserAssignment(userId: string, testId: string): string | null {
    return this.assignments.get(userId)?.get(testId) || null;
  }

  // Track conversion event
  public trackConversion(userId: string, testId: string, goal: string, value?: number) {
    const assignment = this.getUserAssignment(userId, testId);
    if (!assignment) return;

    this.trackEvent('ab_test_conversion', {
      test_id: testId,
      variant_id: assignment,
      goal,
      value: value || 1,
      user_id: userId
    });
  }

  // Track custom event for A/B test analysis
  public trackEvent(event: string, properties: Record<string, any>) {
    // Integration with analytics service would go here
    // Only log in development mode and not during build
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      console.log('AB Test Event:', event, {
        ...properties,
        timestamp: Date.now(),
        session_id: this.getSessionId()
      });
    }
  }

  // Get test results summary
  public getTestResults(testId: string): ABTestResults | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    // In production, this would query your analytics database
    // For now, return mock results structure
    return {
      testId,
      testName: test.name,
      variants: test.variants.map(variant => ({
        variantId: variant.id,
        variantName: variant.name,
        participants: 0, // Would be populated from analytics
        conversions: 0,
        conversionRate: 0,
        confidence: 0,
        isWinner: false,
        metrics: {}
      })),
      status: test.isActive ? 'running' : 'completed',
      startDate: test.startDate,
      endDate: test.endDate,
      significance: 0,
      winningVariant: null
    };
  }

  // Activate/deactivate test
  public setTestStatus(testId: string, isActive: boolean) {
    const test = this.tests.get(testId);
    if (test) {
      test.isActive = isActive;
      this.trackEvent('ab_test_status_changed', {
        test_id: testId,
        is_active: isActive
      });
    }
  }

  // Get all active tests
  public getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.isActive);
  }

  // Feature flag functionality
  public isFeatureEnabled(userId: string, featureFlag: string): boolean {
    // Check if user is in a test that enables this feature
    const testId = `feature_${featureFlag}`;
    const assignment = this.getUserAssignment(userId, testId);
    
    if (assignment === 'enabled') {
      return true;
    }
    
    // Default feature flag values
    const defaultFlags: Record<string, boolean> = {
      'advanced_analytics': true,
      'community_features': true,
      'ai_insights': true,
      'crisis_detection': true,
      'therapist_dashboard': false, // Enterprise only
      'export_features': true
    };

    return defaultFlags[featureFlag] || false;
  }

  // Simple hash function for deterministic assignment
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getSessionId(): string {
    // In production, this would be your session ID
    return 'session_' + Date.now();
  }
}

// Test results interface
export interface ABTestResults {
  testId: string;
  testName: string;
  variants: VariantResult[];
  status: 'running' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  significance: number;
  winningVariant: string | null;
}

export interface VariantResult {
  variantId: string;
  variantName: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  isWinner: boolean;
  metrics: Record<string, number>;
}

// Global instance
export const abTesting = new ABTestingFramework();

// React Hook for A/B Testing
export function useABTest(testId: string, userId: string) {
  const assignment = abTesting.assignUserToVariant(userId, testId);
  const config = assignment ? abTesting.getVariantConfig(testId, assignment) : null;

  return {
    variant: assignment,
    config,
    isInVariant: (variantId: string) => assignment === variantId,
    trackConversion: (goal: string, value?: number) => {
      if (assignment) {
        abTesting.trackConversion(userId, testId, goal, value);
      }
    }
  };
}

// Feature flag hook
export function useFeatureFlag(featureFlag: string, userId: string) {
  return abTesting.isFeatureEnabled(userId, featureFlag);
}

// HOC for A/B testing components
export function withABTest(testId: string) {
  return function<T extends {}>(Component: React.ComponentType<T>) {
    return function ABTestWrapper(props: T & { userId: string }) {
      const { userId, ...componentProps } = props;
      const { variant, config, trackConversion } = useABTest(testId, userId);

      return React.createElement(Component, {
        ...(componentProps as unknown as T),
        abTestVariant: variant,
        abTestConfig: config,
        trackConversion: trackConversion
      } as any);
    };
  };
}

export default abTesting;