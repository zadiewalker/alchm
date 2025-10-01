/**
 * ALCHM Technical Support Intelligent Triage Engine
 * 
 * Core system for understanding user problems in natural language,
 * auto-categorizing issues, detecting device/browser context,
 * assessing urgency, and routing to appropriate solutions.
 * 
 * Integrates with Khepera's therapeutic personality system to maintain
 * trauma-informed, compassionate responses throughout technical support.
 */

import { TraumaInformedTechSupport } from './khepera-tech-support-personality';
import { TechSupportResponseEngine } from './khepera-tech-support-response-templates';

// Core issue categories with natural language patterns
export interface IssueCategory {
  id: string;
  name: string;
  description: string;
  patterns: string[];
  subcategories: string[];
  urgencyMultiplier: number;
  traumaInformedContext?: string;
}

export interface DeviceContext {
  userAgent: string;
  platform: 'desktop' | 'mobile' | 'tablet' | 'unknown';
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  screenSize: { width: number; height: number };
  isMobile: boolean;
  isLowEndDevice: boolean;
  supportLevel: 'full' | 'limited' | 'basic';
}

export interface UrgencyAssessment {
  level: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  factors: string[];
  timeToResponse: string;
  escalationTriggers: string[];
  traumaInformed: boolean;
}

export interface TriageResult {
  category: IssueCategory;
  subcategory: string;
  confidence: number;
  urgency: UrgencyAssessment;
  deviceContext: DeviceContext;
  recommendedSolutions: Solution[];
  escalationRequired: boolean;
  crisisDetected: boolean;
  emotionalState: string;
  supportPersonality: 'gentle' | 'direct' | 'crisis-aware';
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  steps: SolutionStep[];
  deviceSpecific: boolean;
  estimatedTime: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  successRate: number;
  fallbackSolution?: string;
}

export interface SolutionStep {
  order: number;
  instruction: string;
  traumaInformedVersion: string;
  screenshot?: string;
  videoUrl?: string;
  deviceSpecific?: Record<string, string>;
  warningMessage?: string;
  encouragement?: string;
}

// ALCHM-specific issue categories with trauma-informed context
export const ALCHM_ISSUE_CATEGORIES: Record<string, IssueCategory> = {
  LOGIN_AUTHENTICATION: {
    id: 'login_auth',
    name: 'Login & Authentication Issues',
    description: 'Problems accessing account, password issues, authentication failures',
    patterns: [
      "can't log in", "can't sign in", "password not working", "locked out",
      "forgot password", "invalid credentials", "authentication failed",
      "won't let me in", "access denied", "account locked", "login error",
      "sign in problem", "password reset", "two factor", "2fa", "verification"
    ],
    subcategories: [
      'Password Reset', 'Account Locked', 'Two-Factor Authentication', 
      'Google/Apple Login', 'Email Verification', 'Account Recovery'
    ],
    urgencyMultiplier: 1.5,
    traumaInformedContext: 'Being locked out of a safe space can trigger feelings of rejection or abandonment. Approach with extra patience and reassurance.'
  },

  JOURNAL_WRITING_ISSUES: {
    id: 'journal_writing',
    name: 'Journal Writing & Saving Problems',
    description: 'Issues with writing, saving, or accessing journal entries',
    patterns: [
      "journal won't save", "lost my writing", "can't write", "editor not working",
      "text disappeared", "writing not saving", "journal entry lost", "can't type",
      "keyboard not working", "auto-save failed", "draft lost", "writing vanished",
      "can't edit", "text editor frozen", "save button not working", "entry deleted"
    ],
    subcategories: [
      'Auto-Save Issues', 'Editor Freezing', 'Text Disappearing', 
      'Manual Save Problems', 'Draft Recovery', 'Entry Corruption'
    ],
    urgencyMultiplier: 2.0,
    traumaInformedContext: 'Lost writing can feel like losing part of oneself. Validate the emotional impact and prioritize recovery efforts.'
  },

  SYNC_DATA_ISSUES: {
    id: 'sync_data',
    name: 'Data Sync & Recovery Problems',
    description: 'Issues with data synchronization, missing entries, backup problems',
    patterns: [
      "entries missing", "data not syncing", "journals disappeared", "can't find entries",
      "sync failed", "backup not working", "data loss", "entries not showing",
      "missing journals", "synchronization error", "cloud sync issue", "data corruption",
      "can't access old entries", "history missing", "entries vanished", "restore backup"
    ],
    subcategories: [
      'Missing Entries', 'Sync Failures', 'Data Recovery', 
      'Backup Issues', 'Cross-Device Sync', 'Data Corruption'
    ],
    urgencyMultiplier: 1.8,
    traumaInformedContext: 'Missing personal data can trigger anxiety about loss and safety. Provide immediate reassurance about recovery possibilities.'
  },

  PAYMENT_BILLING: {
    id: 'payment_billing',
    name: 'Payment & Billing Issues',
    description: 'Subscription, payment, billing, and pricing problems',
    patterns: [
      "charged twice", "payment failed", "card declined", "billing error", "refund",
      "cancel subscription", "payment not working", "billing problem", "wrong charge",
      "subscription issue", "payment method", "credit card", "invoice error",
      "overcharged", "unauthorized charge", "payment history", "billing cycle",
      "upgrade problem", "downgrade issue", "promo code", "discount not applied"
    ],
    subcategories: [
      'Double Charges', 'Payment Failures', 'Subscription Management', 
      'Refund Requests', 'Billing Inquiries', 'Payment Method Updates'
    ],
    urgencyMultiplier: 1.7,
    traumaInformedContext: 'Financial stress can compound emotional distress. Address billing issues with transparency and immediate action.'
  },

  MOBILE_APP_ISSUES: {
    id: 'mobile_app',
    name: 'Mobile App & PWA Problems',
    description: 'Mobile-specific issues, app crashes, performance problems',
    patterns: [
      "app crashes", "app won't open", "mobile not working", "phone app broken",
      "app keeps closing", "mobile site broken", "app freezing", "installation failed",
      "pwa not working", "app store issue", "mobile performance", "touch not working",
      "app loading slow", "mobile layout broken", "offline not working", "notifications broken"
    ],
    subcategories: [
      'App Crashes', 'Installation Issues', 'Performance Problems', 
      'Offline Functionality', 'Push Notifications', 'Touch Interface'
    ],
    urgencyMultiplier: 1.6,
    traumaInformedContext: 'Mobile issues can feel isolating since phones are often our most personal devices. Emphasize portable sanctuary restoration.'
  },

  PERFORMANCE_SPEED: {
    id: 'performance_speed',
    name: 'Performance & Speed Issues',
    description: 'Slow loading, timeouts, performance degradation',
    patterns: [
      "slow loading", "site is slow", "takes forever", "timeout", "performance issues",
      "page won't load", "loading problems", "site hanging", "freezing up",
      "very slow", "not responding", "connection timeout", "load time", "sluggish",
      "app is slow", "pages loading slowly", "performance degraded", "speed issues"
    ],
    subcategories: [
      'Slow Page Loading', 'Connection Timeouts', 'Browser Performance', 
      'Network Issues', 'Server Response Time', 'Resource Loading'
    ],
    urgencyMultiplier: 1.2,
    traumaInformedContext: 'Slow technology can increase anxiety and frustration. Validate the stress and offer patience-building strategies.'
  },

  FEATURE_CONFUSION: {
    id: 'feature_confusion',
    name: 'Feature Understanding & Navigation',
    description: 'Confusion about how features work, navigation problems',
    patterns: [
      "don't understand", "how does this work", "confused about", "can't find",
      "don't know how to", "where is", "navigation problem", "interface confusing",
      "can't figure out", "need help with", "explain how", "tutorial needed",
      "feature not clear", "instructions unclear", "interface difficult", "workflow confusing"
    ],
    subcategories: [
      'Feature Tutorials', 'Navigation Help', 'Interface Explanation', 
      'Workflow Guidance', 'Settings Configuration', 'Feature Discovery'
    ],
    urgencyMultiplier: 1.0,
    traumaInformedContext: 'Confusion can trigger feelings of inadequacy. Emphasize learning as growth rather than failure.'
  },

  CRISIS_TECHNICAL: {
    id: 'crisis_technical',
    name: 'Crisis-Related Technical Issues',
    description: 'Technical problems when user is in emotional crisis',
    patterns: [
      "crisis button not working", "emergency features broken", "can't access help",
      "need help now", "crisis support not loading", "emergency contact failed",
      "suicide resources not showing", "crisis chat not working", "help button broken"
    ],
    subcategories: [
      'Crisis Button Failures', 'Emergency Resource Access', 'Crisis Chat Issues', 
      'Urgent Support Needs', 'Safety Feature Problems'
    ],
    urgencyMultiplier: 3.0,
    traumaInformedContext: 'CRITICAL: Technical barriers during crisis can be life-threatening. Immediate escalation with emergency resource provision required.'
  }
};

// Priority matrix for urgency assessment
const URGENCY_FACTORS = {
  crisisKeywords: {
    weight: 10,
    patterns: [
      'suicide', 'kill myself', 'end it all', 'crisis', 'emergency', 
      'help me now', 'desperate', 'can\'t take it', 'need help immediately'
    ]
  },
  lossKeywords: {
    weight: 8,
    patterns: [
      'lost all my', 'everything is gone', 'can\'t recover', 'data loss',
      'work disappeared', 'months of writing', 'all my journals'
    ]
  },
  timeConstraints: {
    weight: 6,
    patterns: [
      'deadline', 'urgent', 'asap', 'right now', 'immediately', 
      'time sensitive', 'can\'t wait', 'need today'
    ]
  },
  blockingIssues: {
    weight: 7,
    patterns: [
      'completely broken', 'nothing works', 'can\'t use', 'totally stuck',
      'completely locked out', 'system down', 'not functioning'
    ]
  },
  emotionalDistress: {
    weight: 5,
    patterns: [
      'frustrated', 'stressed out', 'overwhelmed', 'anxious about',
      'worried', 'panicking', 'afraid', 'upset'
    ]
  }
};

export class TechnicalSupportTriageEngine {
  private traumaInformedSupport: TraumaInformedTechSupport;
  private responseEngine: TechSupportResponseEngine;

  constructor() {
    this.traumaInformedSupport = new TraumaInformedTechSupport();
    this.responseEngine = new TechSupportResponseEngine();
  }

  /**
   * Main triage function - analyzes user input and returns comprehensive support plan
   */
  async analyzeUserIssue(
    userInput: string,
    deviceContext?: Partial<DeviceContext>,
    userHistory?: string[]
  ): Promise<TriageResult> {
    // Step 1: Detect device/browser context
    const fullDeviceContext = await this.detectDeviceContext(deviceContext);

    // Step 2: Categorize the issue using NLP patterns
    const categoryResult = this.categorizeIssue(userInput);

    // Step 3: Assess urgency level
    const urgencyAssessment = this.assessUrgency(userInput, categoryResult.category);

    // Step 4: Analyze emotional state for trauma-informed response
    const emotionalAssessment = this.traumaInformedSupport.assessEmotionalState(userInput);

    // Step 5: Check for crisis indicators
    const crisisDetected = this.detectCrisisPattern(userInput);

    // Step 6: Generate recommended solutions
    const solutions = await this.generateSolutions(
      categoryResult.category,
      categoryResult.subcategory,
      fullDeviceContext,
      urgencyAssessment.level
    );

    // Step 7: Determine if escalation is needed
    const escalationRequired = this.shouldEscalate(
      urgencyAssessment,
      emotionalAssessment,
      crisisDetected,
      solutions.length === 0
    );

    // Step 8: Select appropriate support personality
    const supportPersonality = this.selectSupportPersonality(
      emotionalAssessment.emotionalState,
      urgencyAssessment.level,
      crisisDetected
    );

    return {
      category: categoryResult.category,
      subcategory: categoryResult.subcategory,
      confidence: categoryResult.confidence,
      urgency: urgencyAssessment,
      deviceContext: fullDeviceContext,
      recommendedSolutions: solutions,
      escalationRequired,
      crisisDetected,
      emotionalState: emotionalAssessment.emotionalState,
      supportPersonality
    };
  }

  /**
   * Categorize issue using natural language pattern matching
   */
  private categorizeIssue(userInput: string): {
    category: IssueCategory;
    subcategory: string;
    confidence: number;
  } {
    const input = userInput.toLowerCase();
    let bestMatch = {
      category: ALCHM_ISSUE_CATEGORIES.FEATURE_CONFUSION,
      subcategory: 'General Help',
      confidence: 0.3
    };

    for (const [key, category] of Object.entries(ALCHM_ISSUE_CATEGORIES)) {
      let matchScore = 0;
      let matchedPatterns = 0;

      for (const pattern of category.patterns) {
        if (input.includes(pattern.toLowerCase())) {
          matchScore += 1;
          matchedPatterns++;
        }
      }

      if (matchedPatterns > 0) {
        const confidence = Math.min(0.95, (matchScore / category.patterns.length) * 2);
        
        if (confidence > bestMatch.confidence) {
          // Determine subcategory based on specific patterns
          const subcategory = this.determineSubcategory(input, category);
          
          bestMatch = {
            category,
            subcategory,
            confidence
          };
        }
      }
    }

    return bestMatch;
  }

  /**
   * Determine subcategory based on more specific pattern matching
   */
  private determineSubcategory(input: string, category: IssueCategory): string {
    // Specific subcategory patterns for more precise routing
    const subcategoryPatterns: Record<string, Record<string, string[]>> = {
      login_auth: {
        'Password Reset': ['forgot password', 'reset password', 'password not working'],
        'Account Locked': ['locked out', 'account locked', 'access denied'],
        'Two-Factor Authentication': ['2fa', 'two factor', 'verification code'],
        'Google/Apple Login': ['google login', 'apple login', 'social login', 'oauth'],
        'Email Verification': ['verify email', 'confirmation email', 'activation']
      },
      journal_writing: {
        'Auto-Save Issues': ['auto save', 'automatically save', 'save automatically'],
        'Editor Freezing': ['editor frozen', 'editor stuck', 'can\'t type'],
        'Text Disappearing': ['text disappeared', 'writing vanished', 'text missing'],
        'Manual Save Problems': ['save button', 'manual save', 'won\'t save'],
        'Draft Recovery': ['recover draft', 'restore writing', 'get back text']
      },
      mobile_app: {
        'App Crashes': ['app crash', 'app closes', 'app stops'],
        'Installation Issues': ['install', 'download', 'app store'],
        'Performance Problems': ['app slow', 'mobile slow', 'performance'],
        'Offline Functionality': ['offline', 'no internet', 'connection'],
        'Touch Interface': ['touch', 'tap', 'swipe', 'gesture']
      }
    };

    const categoryPatterns = subcategoryPatterns[category.id];
    if (!categoryPatterns) {
      return category.subcategories[0] || 'General';
    }

    for (const [subcategory, patterns] of Object.entries(categoryPatterns)) {
      for (const pattern of patterns) {
        if (input.includes(pattern)) {
          return subcategory;
        }
      }
    }

    return category.subcategories[0] || 'General';
  }

  /**
   * Assess urgency level based on multiple factors
   */
  private assessUrgency(userInput: string, category: IssueCategory): UrgencyAssessment {
    const input = userInput.toLowerCase();
    let urgencyScore = 0;
    const factors: string[] = [];

    // Check for urgency factors
    for (const [factorName, factor] of Object.entries(URGENCY_FACTORS)) {
      for (const pattern of factor.patterns) {
        if (input.includes(pattern)) {
          urgencyScore += factor.weight;
          factors.push(`${factorName}: "${pattern}"`);
        }
      }
    }

    // Apply category multiplier
    urgencyScore *= category.urgencyMultiplier;

    // Determine urgency level
    let level: UrgencyAssessment['level'];
    let timeToResponse: string;
    let escalationTriggers: string[];

    if (urgencyScore >= 25 || category.id === 'crisis_technical') {
      level = 'critical';
      timeToResponse = 'Immediate (< 5 minutes)';
      escalationTriggers = ['Human intervention required', 'Emergency protocols activated'];
    } else if (urgencyScore >= 15) {
      level = 'high';
      timeToResponse = 'Within 30 minutes';
      escalationTriggers = ['No resolution within 15 minutes', 'User expresses extreme frustration'];
    } else if (urgencyScore >= 8) {
      level = 'medium';
      timeToResponse = 'Within 2 hours';
      escalationTriggers = ['Multiple failed solutions', 'User requests human support'];
    } else {
      level = 'low';
      timeToResponse = 'Within 24 hours';
      escalationTriggers = ['Solution complexity exceeds user comfort level'];
    }

    return {
      level,
      score: urgencyScore,
      factors,
      timeToResponse,
      escalationTriggers,
      traumaInformed: category.traumaInformedContext !== undefined
    };
  }

  /**
   * Detect device and browser context for targeted solutions
   */
  private async detectDeviceContext(provided?: Partial<DeviceContext>): Promise<DeviceContext> {
    // If running in browser environment, detect from navigator
    let userAgent = provided?.userAgent || '';
    let platform: DeviceContext['platform'] = 'unknown';
    let browser = 'unknown';
    let os = 'unknown';
    let isMobile = false;

    if (typeof navigator !== 'undefined') {
      userAgent = navigator.userAgent;
      
      // Platform detection
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        platform = 'mobile';
        isMobile = true;
      } else if (/iPad/i.test(userAgent)) {
        platform = 'tablet';
      } else {
        platform = 'desktop';
      }

      // Browser detection
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';

      // OS detection
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS')) os = 'iOS';
    }

    // Screen size detection
    const screenSize = {
      width: typeof window !== 'undefined' ? window.screen.width : 1920,
      height: typeof window !== 'undefined' ? window.screen.height : 1080
    };

    // Low-end device detection (basic heuristics)
    const isLowEndDevice = platform === 'mobile' && (
      screenSize.width < 768 || 
      userAgent.includes('Android 4') ||
      userAgent.includes('Android 5')
    );

    // Support level determination
    let supportLevel: DeviceContext['supportLevel'] = 'full';
    if (isLowEndDevice) supportLevel = 'basic';
    else if (platform === 'mobile') supportLevel = 'limited';

    return {
      userAgent,
      platform,
      browser,
      browserVersion: 'unknown', // Could be enhanced with more parsing
      os,
      osVersion: 'unknown', // Could be enhanced with more parsing
      screenSize,
      isMobile,
      isLowEndDevice,
      supportLevel,
      ...provided
    };
  }

  /**
   * Generate device-specific solutions for the identified issue
   */
  private async generateSolutions(
    category: IssueCategory,
    subcategory: string,
    deviceContext: DeviceContext,
    urgencyLevel: string
  ): Promise<Solution[]> {
    // This would typically query a solution database
    // For now, we'll return category-specific solutions
    
    const solutions: Solution[] = [];

    // Add solutions based on category and device context
    if (category.id === 'login_auth') {
      solutions.push(this.getLoginSolutions(subcategory, deviceContext));
    } else if (category.id === 'journal_writing') {
      solutions.push(...this.getJournalSolutions(subcategory, deviceContext));
    } else if (category.id === 'mobile_app') {
      solutions.push(...this.getMobileSolutions(subcategory, deviceContext));
    } else if (category.id === 'payment_billing') {
      solutions.push(...this.getBillingSolutions(subcategory, deviceContext));
    }

    // Sort by success rate and difficulty
    return solutions.sort((a, b) => {
      if (urgencyLevel === 'critical') return a.difficulty === 'easy' ? -1 : 1;
      return b.successRate - a.successRate;
    });
  }

  /**
   * Generate login-specific solutions
   */
  private getLoginSolutions(subcategory: string, deviceContext: DeviceContext): Solution {
    const baseSteps: SolutionStep[] = [
      {
        order: 1,
        instruction: 'Check that your email address is spelled correctly',
        traumaInformedVersion: 'Let\'s gently verify your email address - sometimes small typos can block access to your sanctuary',
        encouragement: 'This simple check resolves many access issues'
      },
      {
        order: 2,
        instruction: 'Try using the "Forgot Password" link',
        traumaInformedVersion: 'If you\'d like to reset your password, you can use the "Forgot Password" option when you\'re ready',
        encouragement: 'Password resets are completely normal and secure'
      }
    ];

    // Add device-specific steps
    if (deviceContext.isMobile) {
      baseSteps.push({
        order: 3,
        instruction: 'Clear your mobile browser cache',
        traumaInformedVersion: 'Sometimes clearing your browser\'s temporary files can restore access to your mobile sanctuary',
        deviceSpecific: {
          ios: 'Settings > Safari > Clear History and Website Data',
          android: 'Chrome menu > Settings > Privacy > Clear browsing data'
        }
      });
    }

    return {
      id: 'login_basic',
      title: 'Basic Login Troubleshooting',
      description: 'Step-by-step guide to resolve common login issues',
      steps: baseSteps,
      deviceSpecific: deviceContext.isMobile,
      estimatedTime: '3-5 minutes',
      difficulty: 'easy',
      successRate: 0.85,
      fallbackSolution: 'account_recovery'
    };
  }

  /**
   * Generate journal writing solutions
   */
  private getJournalSolutions(subcategory: string, deviceContext: DeviceContext): Solution[] {
    const solutions: Solution[] = [];

    if (subcategory === 'Text Disappearing' || subcategory === 'Auto-Save Issues') {
      solutions.push({
        id: 'journal_recovery',
        title: 'Recover Lost Journal Text',
        description: 'Attempt to recover your writing from browser storage',
        steps: [
          {
            order: 1,
            instruction: 'Check browser history for auto-saved drafts',
            traumaInformedVersion: 'Let\'s look for any drafts that might have been automatically saved - your words are precious and worth recovering',
            encouragement: 'ALCHM tries to protect your writing automatically'
          },
          {
            order: 2,
            instruction: 'Refresh the page to reload any cached content',
            traumaInformedVersion: 'Sometimes a gentle refresh can restore your writing - we\'ll take this slowly',
            warningMessage: 'Only do this if you\'re comfortable - you can always try other approaches first'
          }
        ],
        deviceSpecific: true,
        estimatedTime: '2-3 minutes',
        difficulty: 'easy',
        successRate: 0.7
      });
    }

    return solutions;
  }

  /**
   * Generate mobile-specific solutions
   */
  private getMobileSolutions(subcategory: string, deviceContext: DeviceContext): Solution[] {
    const solutions: Solution[] = [];

    if (deviceContext.platform === 'mobile') {
      solutions.push({
        id: 'mobile_optimization',
        title: 'Optimize Mobile Performance',
        description: 'Steps to improve ALCHM\'s performance on your mobile device',
        steps: [
          {
            order: 1,
            instruction: 'Close other browser tabs to free up memory',
            traumaInformedVersion: 'Let\'s create more space for your healing app to work smoothly by closing other tabs',
            encouragement: 'This often makes a noticeable difference in performance'
          },
          {
            order: 2,
            instruction: 'Restart your browser app',
            traumaInformedVersion: 'Sometimes giving your browser a fresh start helps everything flow better',
            deviceSpecific: {
              ios: 'Double-tap home button, swipe up on browser app',
              android: 'Use recent apps button, swipe away browser'
            }
          }
        ],
        deviceSpecific: true,
        estimatedTime: '1-2 minutes',
        difficulty: 'easy',
        successRate: 0.8
      });
    }

    return solutions;
  }

  /**
   * Generate billing and payment solutions
   */
  private getBillingSolutions(subcategory: string, deviceContext: DeviceContext): Solution[] {
    return [{
      id: 'billing_review',
      title: 'Review Billing and Payment Information',
      description: 'Check your payment details and billing history',
      steps: [
        {
          order: 1,
          instruction: 'Navigate to Account Settings > Billing',
          traumaInformedVersion: 'Let\'s gently review your billing information together to ensure everything is transparent and correct',
          encouragement: 'You have every right to understand your billing clearly'
        },
        {
          order: 2,
          instruction: 'Check your payment method for any issues',
          traumaInformedVersion: 'We\'ll verify that your payment method is current and working properly',
          warningMessage: 'Never share your full card details with support - we can help without that information'
        }
      ],
      deviceSpecific: false,
      estimatedTime: '3-5 minutes',
      difficulty: 'easy',
      successRate: 0.9
    }];
  }

  /**
   * Detect crisis patterns that require immediate escalation
   */
  private detectCrisisPattern(input: string): boolean {
    const crisisPatterns = [
      'suicide', 'kill myself', 'end it all', 'want to die', 'crisis',
      'emergency', 'help me now', 'desperate', 'can\'t take it anymore'
    ];

    const lowerInput = input.toLowerCase();
    return crisisPatterns.some(pattern => lowerInput.includes(pattern));
  }

  /**
   * Determine if issue should be escalated to human support
   */
  private shouldEscalate(
    urgency: UrgencyAssessment,
    emotional: any,
    crisis: boolean,
    noSolutions: boolean
  ): boolean {
    return (
      crisis ||
      urgency.level === 'critical' ||
      emotional.crisisRisk !== 'none' ||
      noSolutions ||
      emotional.emotionalState === 'overwhelm'
    );
  }

  /**
   * Select appropriate support personality based on user state
   */
  private selectSupportPersonality(
    emotionalState: string,
    urgencyLevel: string,
    crisisDetected: boolean
  ): 'gentle' | 'direct' | 'crisis-aware' {
    if (crisisDetected) return 'crisis-aware';
    if (urgencyLevel === 'critical') return 'direct';
    if (emotionalState === 'overwhelm' || emotionalState === 'anxiety') return 'gentle';
    return 'direct';
  }

  /**
   * Generate a complete support response using the triage results
   */
  async generateSupportResponse(triageResult: TriageResult, userInput: string): Promise<{
    greeting: string;
    problemAcknowledgment: string;
    solutionPlan: string;
    nextSteps: string[];
    escalationInfo?: string;
    emergencyResources?: any;
  }> {
    const category = triageResult.category;
    const personality = this.selectResponseType(triageResult);

    const response = this.responseEngine.generateContextualResponse(
      userInput,
      category.id as any,
      'greeting'
    );

    const solutionPlan = triageResult.recommendedSolutions.length > 0
      ? `I found ${triageResult.recommendedSolutions.length} potential solution(s) for your ${category.name.toLowerCase()}. Let's start with the most effective approach.`
      : `I understand you're experiencing ${category.name.toLowerCase()}. Let me connect you with specialized support for this situation.`;

    const nextSteps = triageResult.recommendedSolutions.length > 0
      ? triageResult.recommendedSolutions[0].steps.slice(0, 3).map(step => step.traumaInformedVersion || step.instruction)
      : ['Let me arrange for a human support specialist to assist you personally.'];

    let escalationInfo;
    let emergencyResources;

    if (triageResult.escalationRequired) {
      escalationInfo = 'I\'m connecting you with a human support specialist who can provide more personalized assistance.';
    }

    if (triageResult.crisisDetected) {
      emergencyResources = {
        phone: '988 Suicide & Crisis Lifeline',
        text: 'Text HOME to 741741',
        message: 'Your safety is the priority. Professional help is available right now.'
      };
    }

    return {
      greeting: response,
      problemAcknowledgment: this.responseEngine.generateContextualResponse(userInput, category.id as any, 'acknowledgment'),
      solutionPlan,
      nextSteps,
      escalationInfo,
      emergencyResources
    };
  }

  private selectResponseType(triageResult: TriageResult): string {
    if (triageResult.crisisDetected) return 'crisis';
    if (triageResult.emotionalState === 'overwhelm') return 'overwhelm';
    if (triageResult.urgency.level === 'critical') return 'urgent';
    return 'standard';
  }
}

export default TechnicalSupportTriageEngine;