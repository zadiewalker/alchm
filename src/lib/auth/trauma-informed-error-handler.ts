/**
 * Trauma-Informed Error Handling System
 * 
 * Provides gentle, supportive error messages and recovery options
 * specifically designed for users experiencing emotional distress:
 * - Non-shaming language
 * - Clear next steps without overwhelming choices
 * - Immediate crisis support access
 * - Validation and reassurance
 * - Multiple recovery pathways
 */

export interface TraumaInformedError {
  type: 'authentication' | 'network' | 'server' | 'validation' | 'crisis';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  originalError?: Error;
  userContext?: {
    isFirstAttempt: boolean;
    failedAttempts: number;
    timeSpentOnPage: number;
    crisisIndicators: boolean;
    deviceStress: 'low' | 'moderate' | 'high';
    batteryLevel?: number;
    isOffline: boolean;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'late_night';
  };
}

export interface TraumaInformedResponse {
  primaryMessage: string;
  supportingMessage?: string;
  actionOptions: Array<{
    label: string;
    action: () => void | string;
    priority: 'primary' | 'secondary' | 'crisis';
    icon?: string;
    description?: string;
  }>;
  crisisSupport?: {
    show: boolean;
    urgency: 'low' | 'moderate' | 'high' | 'immediate';
    resources: Array<{
      name: string;
      action: string;
      description: string;
    }>;
  };
  validationMessage?: string;
  recoveryGuidance: string[];
  emotionalSupport: {
    affirmation: string;
    reassurance: string;
    empowerment: string;
  };
}

export class TraumaInformedErrorHandler {
  private readonly affirmations = [
    "You're doing something brave by taking care of your mental health.",
    "It's okay to take your time. There's no pressure here.",
    "Your feelings are valid, and you deserve support.",
    "You're not alone in this. Many people face similar challenges.",
    "Taking this step shows incredible strength and self-compassion.",
    "It's okay if things feel difficult right now.",
    "You deserve a safe space to process your thoughts and feelings."
  ];

  private readonly reassurances = [
    "This is a safe space designed with your wellbeing in mind.",
    "We understand that technology can sometimes feel overwhelming.",
    "Your privacy and safety are our highest priorities.",
    "There's no judgment here - just support and understanding.",
    "You can take as much time as you need.",
    "Help is available 24/7 if you need someone to talk to.",
    "You have control over your experience here."
  ];

  private readonly empowerments = [
    "You have the strength to get through this.",
    "Every small step forward is meaningful.",
    "You know yourself best, and your instincts matter.",
    "Asking for help is a sign of courage, not weakness.",
    "You're the expert on your own experience.",
    "You have options and choices in how to move forward.",
    "Your wellbeing matters, and you're worth investing in."
  ];

  /**
   * Generate trauma-informed response to authentication errors
   */
  generateResponse(error: TraumaInformedError): TraumaInformedResponse {
    const context = error.userContext;
    const isHighStress = context?.crisisIndicators || context?.deviceStress === 'high' || error.severity === 'critical';
    const isRepeatedFailure = (context?.failedAttempts || 0) > 2;
    const isLateNight = context?.timeOfDay === 'late_night';

    // Build response based on error type and context
    const response: TraumaInformedResponse = {
      primaryMessage: this.generatePrimaryMessage(error),
      supportingMessage: this.generateSupportingMessage(error),
      actionOptions: this.generateActionOptions(error),
      validationMessage: this.generateValidationMessage(error),
      recoveryGuidance: this.generateRecoveryGuidance(error),
      emotionalSupport: {
        affirmation: this.selectAffirmation(context),
        reassurance: this.selectReassurance(context),
        empowerment: this.selectEmpowerment(context)
      }
    };

    // Add crisis support if needed
    if (isHighStress || isLateNight || isRepeatedFailure) {
      response.crisisSupport = this.generateCrisisSupport(error);
    }

    return response;
  }

  private generatePrimaryMessage(error: TraumaInformedError): string {
    const { type, severity, userContext } = error;
    const isFirstAttempt = userContext?.isFirstAttempt ?? true;
    const failedAttempts = userContext?.failedAttempts || 0;
    const isOffline = userContext?.isOffline || false;
    const crisisIndicators = userContext?.crisisIndicators || false;

    if (crisisIndicators) {
      return "We care about you and want you to be safe. You don't need to sign in to access support right now.";
    }

    if (type === 'crisis') {
      return "We noticed you might be going through a difficult time. Support is available immediately, and signing in is optional.";
    }

    if (isOffline) {
      return "You're currently offline, but crisis resources and some tools are still available to you.";
    }

    if (type === 'network') {
      if (userContext?.batteryLevel && userContext.batteryLevel < 20) {
        return "Your connection seems unstable and your battery is low. Let's try the most reliable way to get you connected.";
      }
      return "There seems to be a connection hiccup. Let's try a different approach that might work better.";
    }

    if (type === 'authentication') {
      if (failedAttempts === 0 || isFirstAttempt) {
        return "Let's double-check your sign-in information. Sometimes it just takes a small adjustment.";
      } else if (failedAttempts === 1) {
        return "That didn't work quite right. Take a breath - let's try once more with a different approach.";
      } else if (failedAttempts >= 2) {
        return "It seems like there might be an issue with your account. Let's explore some other ways to get you connected safely.";
      }
    }

    if (type === 'server') {
      return "Our systems are having a gentle hiccup. This isn't your fault, and we have some alternatives that should work.";
    }

    if (type === 'validation') {
      return "Let's adjust a small detail to get this working smoothly for you.";
    }

    // Default gentle message
    return "Something unexpected happened, but it's nothing you did wrong. Let's find a way forward together.";
  }

  private generateSupportingMessage(error: TraumaInformedError): string | undefined {
    const { type, userContext } = error;
    const timeSpent = userContext?.timeSpentOnPage || 0;
    const isLongSession = timeSpent > 300000; // 5 minutes
    const isLateNight = userContext?.timeOfDay === 'late_night';

    if (isLateNight) {
      return "We know late nights can be especially difficult. Take your time, and remember that support is available 24/7.";
    }

    if (isLongSession) {
      return "We notice you've been here for a while. If you're feeling frustrated, that's completely understandable. You can always take a break and come back.";
    }

    if (type === 'authentication' && (userContext?.failedAttempts || 0) >= 2) {
      return "Multiple sign-in attempts can be frustrating. This happens to everyone, and there are several ways we can help you get connected.";
    }

    if (userContext?.crisisIndicators) {
      return "Your wellbeing is more important than signing in. All the support you need is available right now, no account required.";
    }

    return undefined;
  }

  private generateActionOptions(error: TraumaInformedError): TraumaInformedResponse['actionOptions'] {
    const options: TraumaInformedResponse['actionOptions'] = [];
    const { type, userContext } = error;
    const crisisIndicators = userContext?.crisisIndicators || false;

    // Crisis-priority actions
    if (crisisIndicators || error.severity === 'critical') {
      options.push(
        {
          label: 'I need help right now',
          action: 'tel:988',
          priority: 'crisis',
          icon: '🆘',
          description: 'Immediate crisis support - available 24/7'
        },
        {
          label: 'Text someone for support',
          action: 'sms:741741&body=HOME',
          priority: 'crisis',
          icon: '💬',
          description: 'Confidential text support with trained counselors'
        },
        {
          label: 'Access safe space without signing in',
          action: 'create_guest_session',
          priority: 'primary',
          icon: '🏠',
          description: 'Use journaling tools and resources as a guest'
        }
      );
    }

    // Authentication-specific options
    if (type === 'authentication') {
      options.push(
        {
          label: 'Try signing in again',
          action: 'retry_auth',
          priority: 'primary',
          icon: '🔑',
          description: 'Double-check your email and password'
        },
        {
          label: 'Send me a secure sign-in link',
          action: 'request_magic_link',
          priority: 'secondary',
          icon: '📧',
          description: 'Get a secure link sent to your email'
        },
        {
          label: 'Reset my password',
          action: 'reset_password',
          priority: 'secondary',
          icon: '🔓',
          description: 'Create a new password for your account'
        }
      );
    }

    // Network/connectivity options
    if (type === 'network' || userContext?.isOffline) {
      options.push(
        {
          label: 'Try again with current connection',
          action: 'retry_connection',
          priority: 'primary',
          icon: '🔄',
          description: 'Attempt to reconnect with your current network'
        },
        {
          label: 'Use offline tools',
          action: 'enable_offline_mode',
          priority: 'secondary',
          icon: '📱',
          description: 'Access journaling and crisis resources offline'
        }
      );
    }

    // Universal supportive options
    options.push(
      {
        label: 'Use as a guest for now',
        action: 'create_guest_session',
        priority: 'secondary',
        icon: '👤',
        description: 'Access tools and resources without an account'
      },
      {
        label: 'Get technical help',
        action: 'contact_support',
        priority: 'secondary',
        icon: '💡',
        description: 'Chat with our support team for assistance'
      }
    );

    return options.slice(0, 4); // Limit options to prevent overwhelm
  }

  private generateCrisisSupport(error: TraumaInformedError): TraumaInformedResponse['crisisSupport'] {
    const { severity, userContext } = error;
    const crisisIndicators = userContext?.crisisIndicators || false;
    const isLateNight = userContext?.timeOfDay === 'late_night';
    const repeatedFailures = (userContext?.failedAttempts || 0) > 3;

    let urgency: 'low' | 'moderate' | 'high' | 'immediate' = 'low';

    if (crisisIndicators || severity === 'critical') {
      urgency = 'immediate';
    } else if (isLateNight && repeatedFailures) {
      urgency = 'high';
    } else if (isLateNight || repeatedFailures) {
      urgency = 'moderate';
    }

    return {
      show: true,
      urgency,
      resources: [
        {
          name: '988 Crisis Lifeline',
          action: 'tel:988',
          description: 'Free, confidential 24/7 crisis support'
        },
        {
          name: 'Crisis Text Line',
          action: 'sms:741741&body=HOME',
          description: 'Text HOME to connect with a counselor'
        },
        {
          name: 'Emergency Services',
          action: 'tel:911',
          description: 'For immediate life-threatening emergencies'
        }
      ]
    };
  }

  private generateValidationMessage(error: TraumaInformedError): string | undefined {
    const { userContext } = error;
    
    if (userContext?.crisisIndicators) {
      return "What you're feeling right now is valid. It takes courage to seek support, and you're in the right place.";
    }

    if ((userContext?.failedAttempts || 0) > 2) {
      return "Technology can be frustrating, especially when you're already dealing with difficult emotions. This isn't a reflection of you - it's just a technical hiccup.";
    }

    if (userContext?.timeOfDay === 'late_night') {
      return "Many people find that late-night hours can feel especially challenging. You're not alone in feeling this way.";
    }

    return "It's completely normal to encounter technical difficulties. This happens to everyone, and it's not a sign of anything wrong with you.";
  }

  private generateRecoveryGuidance(error: TraumaInformedError): string[] {
    const { type, userContext } = error;
    const guidance: string[] = [];

    if (userContext?.crisisIndicators) {
      return [
        "Your safety is the top priority right now",
        "Crisis support is available 24/7 without needing to sign in",
        "You can use guest access to journal if writing helps",
        "There's no pressure to do anything except take care of yourself"
      ];
    }

    if (type === 'authentication') {
      guidance.push(
        "Check that your email address is typed correctly",
        "Make sure your password is entered exactly as you created it",
        "If you've forgotten your password, that's totally normal - you can reset it",
        "Sometimes browsers save old passwords - try typing it fresh"
      );
    }

    if (type === 'network') {
      guidance.push(
        "Check your internet connection if possible",
        "Try switching between WiFi and cellular data",
        "Emergency calling still works even with poor connection",
        "Offline tools are available if you need them"
      );
    }

    // Universal guidance
    guidance.push(
      "Take your time - there's no rush",
      "It's okay to take a break and come back later",
      "Guest access is always available if you need it"
    );

    return guidance.slice(0, 4); // Limit to prevent overwhelm
  }

  private selectAffirmation(context?: TraumaInformedError['userContext']): string {
    if (context?.crisisIndicators) {
      return "You're doing something brave by seeking support during a difficult time.";
    }

    if (context?.timeOfDay === 'late_night') {
      return "It takes strength to reach out, especially during challenging late-night hours.";
    }

    if ((context?.failedAttempts || 0) > 2) {
      return "Your persistence shows real determination to take care of your mental health.";
    }

    // Random selection for variety
    return this.affirmations[Math.floor(Math.random() * this.affirmations.length)];
  }

  private selectReassurance(context?: TraumaInformedError['userContext']): string {
    if (context?.crisisIndicators) {
      return "This is a safe space designed to support you, especially during difficult moments.";
    }

    if (context?.isOffline) {
      return "Even offline, you have access to important crisis resources and support tools.";
    }

    // Random selection for variety
    return this.reassurances[Math.floor(Math.random() * this.reassurances.length)];
  }

  private selectEmpowerment(context?: TraumaInformedError['userContext']): string {
    if (context?.crisisIndicators) {
      return "You have the power to choose what kind of support feels right for you right now.";
    }

    // Random selection for variety
    return this.empowerments[Math.floor(Math.random() * this.empowerments.length)];
  }
}

// Export singleton instance
export const traumaInformedErrorHandler = new TraumaInformedErrorHandler();