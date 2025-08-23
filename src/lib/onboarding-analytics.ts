// ALCHM Onboarding Analytics
// Privacy-first analytics for understanding onboarding effectiveness and user needs

export interface OnboardingAnalytics {
  sessionId: string;
  startTime: string;
  completionTime?: string;
  stepTiming: StepTiming[];
  userInteractions: UserInteraction[];
  accessibilityUsage: AccessibilityUsage;
  culturalContext: string;
  completionStatus: 'completed' | 'abandoned' | 'in_progress';
  dropOffPoint?: string;
  feedbackData?: OnboardingFeedback;
}

export interface StepTiming {
  step: 'sanctuary' | 'consent' | 'invitation' | 'khepera';
  startTime: string;
  endTime?: string;
  duration?: number; // milliseconds
  interactions: number;
  gestureUsed: boolean;
  buttonUsed: boolean;
}

export interface UserInteraction {
  timestamp: string;
  type: 'swipe' | 'tap' | 'focus' | 'scroll' | 'audio_toggle' | 'emotion_select' | 'text_input';
  element: string;
  value?: any;
  context: string;
}

export interface AccessibilityUsage {
  screenReaderDetected: boolean;
  highContrastMode: boolean;
  reducedMotionPreferred: boolean;
  keyboardNavigationUsed: boolean;
  audioEnabled: boolean;
  gesturesDisabled: boolean;
}

export interface OnboardingFeedback {
  overallSatisfaction: number; // 1-5 scale
  stepFeedback: {
    [step: string]: {
      clarity: number;
      comfort: number;
      culturalRelevance: number;
    };
  };
  suggestions: string[];
  culturalConsiderations: string[];
}

// ===== ONBOARDING ANALYTICS TRACKER =====

export class OnboardingAnalyticsTracker {
  private analytics: OnboardingAnalytics;
  private startTime: Date;
  private currentStep: string | null = null;

  constructor(culturalContext: string = 'universal') {
    this.startTime = new Date();
    this.analytics = {
      sessionId: `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: this.startTime.toISOString(),
      stepTiming: [],
      userInteractions: [],
      accessibilityUsage: this.detectAccessibilityUsage(),
      culturalContext,
      completionStatus: 'in_progress'
    };
  }

  // ===== STEP TRACKING =====

  startStep(step: 'sanctuary' | 'consent' | 'invitation' | 'khepera') {
    // End previous step if exists
    if (this.currentStep) {
      this.endStep();
    }

    this.currentStep = step;
    this.analytics.stepTiming.push({
      step,
      startTime: new Date().toISOString(),
      interactions: 0,
      gestureUsed: false,
      buttonUsed: false
    });
  }

  endStep() {
    if (!this.currentStep) return;

    const stepIndex = this.analytics.stepTiming.findIndex(
      timing => timing.step === this.currentStep && !timing.endTime
    );

    if (stepIndex !== -1) {
      const endTime = new Date();
      const startTime = new Date(this.analytics.stepTiming[stepIndex].startTime);
      
      this.analytics.stepTiming[stepIndex].endTime = endTime.toISOString();
      this.analytics.stepTiming[stepIndex].duration = endTime.getTime() - startTime.getTime();
    }

    this.currentStep = null;
  }

  // ===== INTERACTION TRACKING =====

  trackInteraction(
    type: UserInteraction['type'], 
    element: string, 
    value?: any, 
    context: string = 'unknown'
  ) {
    this.analytics.userInteractions.push({
      timestamp: new Date().toISOString(),
      type,
      element,
      value,
      context
    });

    // Update current step interaction count
    if (this.currentStep) {
      const stepIndex = this.analytics.stepTiming.findIndex(
        timing => timing.step === this.currentStep && !timing.endTime
      );
      
      if (stepIndex !== -1) {
        this.analytics.stepTiming[stepIndex].interactions++;
        
        // Track interaction types
        if (type === 'swipe') {
          this.analytics.stepTiming[stepIndex].gestureUsed = true;
        } else if (type === 'tap') {
          this.analytics.stepTiming[stepIndex].buttonUsed = true;
        }
      }
    }
  }

  // ===== COMPLETION TRACKING =====

  markCompleted(config: any) {
    this.endStep(); // End final step
    
    this.analytics.completionTime = new Date().toISOString();
    this.analytics.completionStatus = 'completed';
    
    // Track completion preferences (anonymized)
    this.trackInteraction('completion', 'onboarding_complete', {
      reflectionMode: config.reflectionMode,
      audioEnabled: config.audioPreference,
      breathingEnabled: config.breathingGuideEnabled,
      culturalContext: config.culturalContext
    }, 'completion');

    this.sendAnalytics();
  }

  markAbandoned(dropOffPoint: string, reason?: string) {
    this.endStep();
    
    this.analytics.completionStatus = 'abandoned';
    this.analytics.dropOffPoint = dropOffPoint;
    
    this.trackInteraction('abandon', dropOffPoint, { reason }, 'abandonment');
    this.sendAnalytics();
  }

  // ===== FEEDBACK COLLECTION =====

  addFeedback(feedback: OnboardingFeedback) {
    this.analytics.feedbackData = feedback;
  }

  // ===== ACCESSIBILITY DETECTION =====

  private detectAccessibilityUsage(): AccessibilityUsage {
    if (typeof window === 'undefined') {
      return {
        screenReaderDetected: false,
        highContrastMode: false,
        reducedMotionPreferred: false,
        keyboardNavigationUsed: false,
        audioEnabled: false,
        gesturesDisabled: false
      };
    }

    return {
      screenReaderDetected: this.detectScreenReader(),
      highContrastMode: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotionPreferred: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      keyboardNavigationUsed: false, // Will be updated during interactions
      audioEnabled: false, // Will be updated when user enables audio
      gesturesDisabled: !('ontouchstart' in window) || window.matchMedia('(hover: none)').matches === false
    };
  }

  private detectScreenReader(): boolean {
    // Multiple methods to detect screen reader usage
    if (typeof window === 'undefined') return false;

    // Check for common screen reader indicators
    const indicators = [
      // NVDA
      () => window.navigator.userAgent.includes('NVDA'),
      // JAWS
      () => window.speechSynthesis && window.speechSynthesis.getVoices().length > 0,
      // Check for accessibility tree modifications
      () => document.body.hasAttribute('aria-live'),
      // Check for screen reader CSS
      () => {
        const style = window.getComputedStyle(document.body);
        return style.getPropertyValue('-ms-high-contrast') === 'active';
      }
    ];

    return indicators.some(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });
  }

  // ===== ANALYTICS INSIGHTS =====

  generateInsights(): OnboardingInsights {
    const totalDuration = this.analytics.completionTime 
      ? new Date(this.analytics.completionTime).getTime() - new Date(this.analytics.startTime).getTime()
      : new Date().getTime() - new Date(this.analytics.startTime).getTime();

    const stepInsights = this.analytics.stepTiming.map(step => ({
      step: step.step,
      duration: step.duration || 0,
      interactionRate: step.interactions / ((step.duration || 1) / 1000), // interactions per second
      preferredInteractionType: step.gestureUsed ? 'gesture' : 'button',
      completionRate: step.endTime ? 1 : 0
    }));

    const mostEngagingStep = stepInsights.reduce((max, step) => 
      step.interactionRate > max.interactionRate ? step : max
    );

    const bottleneckStep = stepInsights.reduce((max, step) => 
      step.duration > max.duration ? step : max
    );

    return {
      sessionId: this.analytics.sessionId,
      totalDuration,
      completionRate: this.analytics.completionStatus === 'completed' ? 1 : 0,
      accessibilityScore: this.calculateAccessibilityScore(),
      culturalRelevanceScore: this.calculateCulturalRelevanceScore(),
      stepInsights,
      mostEngagingStep: mostEngagingStep.step,
      bottleneckStep: bottleneckStep.step,
      recommendations: this.generateRecommendations()
    };
  }

  private calculateAccessibilityScore(): number {
    const usage = this.analytics.accessibilityUsage;
    let score = 1; // Base score

    // Positive indicators
    if (usage.screenReaderDetected) score += 0.3;
    if (usage.keyboardNavigationUsed) score += 0.2;
    if (usage.highContrastMode) score += 0.2;
    if (usage.reducedMotionPreferred) score += 0.1;

    // Negative indicators (features that weren't accessible)
    if (usage.gesturesDisabled && !usage.keyboardNavigationUsed) score -= 0.3;
    if (usage.screenReaderDetected && this.analytics.userInteractions.some(i => i.type === 'swipe')) {
      score -= 0.2; // Screen reader users shouldn't need to swipe
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateCulturalRelevanceScore(): number {
    // This would be enhanced with cultural feedback data
    const feedback = this.analytics.feedbackData;
    if (feedback) {
      const culturalScores = Object.values(feedback.stepFeedback)
        .map(step => step.culturalRelevance);
      return culturalScores.reduce((sum, score) => sum + score, 0) / culturalScores.length / 5;
    }

    // Default moderate relevance
    return 0.7;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const insights = this.generateInsights();

    // Accessibility recommendations
    if (insights.accessibilityScore < 0.7) {
      recommendations.push('Improve keyboard navigation and screen reader support');
    }

    // Cultural relevance recommendations
    if (insights.culturalRelevanceScore < 0.6) {
      recommendations.push('Enhance cultural adaptations for better relevance');
    }

    // Step-specific recommendations
    if (insights.bottleneckStep) {
      recommendations.push(`Simplify the ${insights.bottleneckStep} step to reduce completion time`);
    }

    // Completion recommendations
    if (insights.completionRate < 0.8) {
      recommendations.push('Add progress indicators and motivation to improve completion rates');
    }

    return recommendations;
  }

  // ===== DATA TRANSMISSION =====

  private async sendAnalytics() {
    try {
      // Only send anonymized, aggregated data
      const anonymizedData = this.anonymizeData();
      
      await fetch('/api/analytics/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(anonymizedData)
      });
    } catch (error) {
      console.error('Failed to send onboarding analytics:', error);
      // Store locally as fallback
      this.storeLocalAnalytics();
    }
  }

  private anonymizeData() {
    return {
      sessionId: this.analytics.sessionId,
      culturalContext: this.analytics.culturalContext,
      completionStatus: this.analytics.completionStatus,
      totalDuration: this.analytics.completionTime 
        ? new Date(this.analytics.completionTime).getTime() - new Date(this.analytics.startTime).getTime()
        : null,
      stepTiming: this.analytics.stepTiming.map(step => ({
        step: step.step,
        duration: step.duration,
        interactions: step.interactions,
        gestureUsed: step.gestureUsed,
        buttonUsed: step.buttonUsed
      })),
      accessibilityUsage: this.analytics.accessibilityUsage,
      dropOffPoint: this.analytics.dropOffPoint,
      // Remove specific interaction data and user values
      interactionCounts: this.analytics.userInteractions.reduce((counts, interaction) => {
        counts[interaction.type] = (counts[interaction.type] || 0) + 1;
        return counts;
      }, {} as Record<string, number>)
    };
  }

  private storeLocalAnalytics() {
    try {
      const anonymizedData = this.anonymizeData();
      localStorage.setItem(
        `alchm_onboarding_analytics_${this.analytics.sessionId}`,
        JSON.stringify(anonymizedData)
      );
    } catch (error) {
      console.error('Failed to store local analytics:', error);
    }
  }
}

// ===== SUPPORTING INTERFACES =====

export interface OnboardingInsights {
  sessionId: string;
  totalDuration: number;
  completionRate: number;
  accessibilityScore: number;
  culturalRelevanceScore: number;
  stepInsights: StepInsight[];
  mostEngagingStep: string;
  bottleneckStep: string;
  recommendations: string[];
}

export interface StepInsight {
  step: string;
  duration: number;
  interactionRate: number;
  preferredInteractionType: 'gesture' | 'button';
  completionRate: number;
}

export { OnboardingAnalyticsTracker };