/**
 * ALCHM Support Knowledge Base
 * 
 * Comprehensive database of known issues, solutions, and troubleshooting steps
 * specifically for ALCHM's trauma-informed journaling platform. Includes
 * Firebase-specific issues, Next.js routing problems, mobile PWA concerns,
 * and therapeutic feature complications.
 */

import type { Solution, SolutionStep } from './technical-support-triage-engine';

export interface KnownIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  frequency: 'common' | 'occasional' | 'rare';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPlatforms: string[];
  symptoms: string[];
  rootCauses: string[];
  solutions: Solution[];
  preventionTips: string[];
  relatedIssues: string[];
  traumaInformedNotes?: string;
}

export interface ALCHMSystemContext {
  platform: 'firebase-hosting' | 'vercel' | 'local-dev';
  nextjsVersion: string;
  firebaseFeatures: string[];
  userAgent: string;
  authProvider: 'google' | 'apple' | 'email' | 'anonymous';
  subscriptionTier: 'sanctuary' | 'oracle' | 'architect';
}

// Known ALCHM-specific issues with detailed solutions
export const ALCHM_KNOWN_ISSUES: Record<string, KnownIssue> = {
  firebase_auth_popup_blocked: {
    id: 'firebase_auth_popup_blocked',
    title: 'Firebase Auth Popup Blocked by Browser',
    description: 'Google/Apple sign-in popup is blocked, preventing authentication',
    category: 'login_auth',
    subcategory: 'Google/Apple Login',
    frequency: 'common',
    severity: 'high',
    affectedPlatforms: ['desktop', 'mobile-web'],
    symptoms: [
      'Sign in button doesn\'t respond',
      'No popup appears when clicking Google/Apple login',
      'Browser shows popup blocked notification',
      'Authentication fails silently'
    ],
    rootCauses: [
      'Browser popup blocker enabled',
      'Third-party cookies disabled',
      'Strict privacy settings',
      'Ad blocker interference'
    ],
    solutions: [
      {
        id: 'enable_popups',
        title: 'Enable Popups for ALCHM',
        description: 'Allow popups specifically for ALCHM domain',
        steps: [
          {
            order: 1,
            instruction: 'Look for popup blocked icon in browser address bar',
            traumaInformedVersion: 'Let\'s gently check if your browser is protecting you from popups - we need to allow ALCHM to open a secure sign-in typeof window !== 'undefined' && window',
            encouragement: 'This is a common security feature that just needs a small adjustment'
          },
          {
            order: 2,
            instruction: 'Click the popup blocked icon and select "Always allow popups from alchm.app"',
            traumaInformedVersion: 'When you\'re ready, you can tell your browser that ALCHM is a trusted site for popup typeof window !== 'undefined' && windows',
            deviceSpecific: {
              chrome: 'Click the popup icon in address bar → Always allow popups and redirects',
              firefox: 'Click shield icon → Disable Tracking Protection for this site',
              safari: 'Safari menu → Preferences → Websites → Pop-up Windows → Allow'
            }
          },
          {
            order: 3,
            instruction: 'Try signing in again',
            traumaInformedVersion: 'Now let\'s try accessing your sanctuary again - the sign-in should work smoothly',
            encouragement: 'You\'ve just made your sanctuary more accessible'
          }
        ],
        deviceSpecific: true,
        estimatedTime: '2-3 minutes',
        difficulty: 'easy',
        successRate: 0.9
      },
      {
        id: 'redirect_signin',
        title: 'Use Redirect Sign-In Method',
        description: 'Alternative sign-in method that doesn\'t use popups',
        steps: [
          {
            order: 1,
            instruction: 'Look for "Having trouble? Use redirect method" link under sign-in buttons',
            traumaInformedVersion: 'If the popup method feels uncomfortable, we have a gentler alternative that works within the same typeof window !== 'undefined' && window',
            encouragement: 'This method is equally secure and often more reliable'
          },
          {
            order: 2,
            instruction: 'Click the redirect option to sign in without popups',
            traumaInformedVersion: 'This will guide you through sign-in in the same typeof window !== 'undefined' && window, keeping everything in one peaceful space',
            encouragement: 'Many users prefer this method for its simplicity'
          }
        ],
        deviceSpecific: false,
        estimatedTime: '1-2 minutes',
        difficulty: 'easy',
        successRate: 0.95
      }
    ],
    preventionTips: [
      'Add ALCHM to browser\'s trusted sites list',
      'Keep browser updated for best compatibility',
      'Consider using redirect sign-in for consistent experience'
    ],
    relatedIssues: ['third_party_cookies_disabled', 'auth_state_mismatch'],
    traumaInformedNotes: 'Authentication problems can trigger feelings of rejection. Emphasize that this is a technical protection, not a personal barrier.'
  },

  journal_auto_save_failure: {
    id: 'journal_auto_save_failure',
    title: 'Journal Auto-Save Not Working',
    description: 'Writing is not being automatically saved, risk of data loss',
    category: 'journal_writing',
    subcategory: 'Auto-Save Issues',
    frequency: 'occasional',
    severity: 'high',
    affectedPlatforms: ['all'],
    symptoms: [
      'No "Saved" indicator appears while writing',
      'Writing disappears after browser refresh',
      'Draft recovery not available',
      'Manual save button not responding'
    ],
    rootCauses: [
      'Browser storage quota exceeded',
      'Incognito/private browsing mode',
      'Browser extension interference',
      'Network connectivity issues',
      'Firebase offline persistence disabled'
    ],
    solutions: [
      {
        id: 'check_storage_quota',
        title: 'Check Browser Storage Space',
        description: 'Clear browser storage to enable auto-save',
        steps: [
          {
            order: 1,
            instruction: 'Open browser developer tools (F12) and check Application/Storage tab',
            traumaInformedVersion: 'Let\'s check if your browser has enough space to safely store your precious writing',
            encouragement: 'This technical check helps protect your journal entries'
          },
          {
            order: 2,
            instruction: 'Clear old website data except for ALCHM',
            traumaInformedVersion: 'We\'ll make space for your healing words by clearing unnecessary data while keeping ALCHM safe',
            warningMessage: 'Only clear data from sites you don\'t mind signing into again'
          },
          {
            order: 3,
            instruction: 'Test auto-save by writing a few words and watching for save indicator',
            traumaInformedVersion: 'Let\'s test your sanctuary\'s protection by writing something small and watching it get saved automatically',
            encouragement: 'You\'ll see a gentle confirmation when your words are safe'
          }
        ],
        deviceSpecific: true,
        estimatedTime: '5-7 minutes',
        difficulty: 'moderate',
        successRate: 0.8
      },
      {
        id: 'manual_save_backup',
        title: 'Use Manual Save as Backup',
        description: 'Establish manual saving habits while auto-save is restored',
        steps: [
          {
            order: 1,
            instruction: 'Use Ctrl+S (Cmd+S on Mac) frequently while writing',
            traumaInformedVersion: 'While we work on auto-save, you can protect your writing by pressing Ctrl+S every few sentences',
            encouragement: 'This creates a rhythm of care for your words'
          },
          {
            order: 2,
            instruction: 'Look for the manual "Save" button and use it after each paragraph',
            traumaInformedVersion: 'The save button becomes a gentle ritual of protecting your thoughts as they flow',
            encouragement: 'Many writers find this intentional saving quite meditative'
          }
        ],
        deviceSpecific: false,
        estimatedTime: 'Ongoing habit',
        difficulty: 'easy',
        successRate: 0.95
      }
    ],
    preventionTips: [
      'Avoid incognito mode for journaling sessions',
      'Regularly clear browser cache while preserving ALCHM data',
      'Use manual save (Ctrl+S) as backup to auto-save',
      'Ensure stable internet connection while writing'
    ],
    relatedIssues: ['browser_storage_full', 'network_connectivity_issues'],
    traumaInformedNotes: 'Lost writing can feel like losing part of oneself. Provide immediate reassurance about recovery possibilities and emphasize prevention strategies.'
  },

  mobile_pwa_install_issues: {
    id: 'mobile_pwa_install_issues',
    title: 'Mobile PWA Installation Problems',
    description: 'Unable to install ALCHM as a mobile app (PWA)',
    category: 'mobile_app',
    subcategory: 'Installation Issues',
    frequency: 'common',
    severity: 'medium',
    affectedPlatforms: ['mobile'],
    symptoms: [
      'No "Add to Home Screen" option appears',
      'Install prompt doesn\'t show',
      'App icon not appearing on home screen',
      'PWA opens in browser instead of app mode'
    ],
    rootCauses: [
      'PWA criteria not met',
      'Service worker not registered',
      'Manifest file issues',
      'Browser doesn\'t support PWA',
      'User already dismissed install prompt'
    ],
    solutions: [
      {
        id: 'manual_add_to_homescreen',
        title: 'Manually Add ALCHM to Home Screen',
        description: 'Add ALCHM to home screen using browser menu',
        steps: [
          {
            order: 1,
            instruction: 'Open ALCHM in mobile browser',
            traumaInformedVersion: 'First, let\'s make sure you\'re in your ALCHM sanctuary using your mobile browser',
            encouragement: 'We\'re going to make your healing space just one tap away'
          },
          {
            order: 2,
            instruction: 'Tap browser menu (three dots or share button)',
            traumaInformedVersion: 'Find your browser\'s menu - it\'s usually three dots or a share symbol',
            deviceSpecific: {
              ios_safari: 'Tap the share button (square with arrow)',
              android_chrome: 'Tap the three-dot menu in top right',
              ios_chrome: 'Tap three dots menu → Add to Home Screen'
            }
          },
          {
            order: 3,
            instruction: 'Select "Add to Home Screen" or "Install App"',
            traumaInformedVersion: 'Look for "Add to Home Screen" - this creates a direct path to your sanctuary',
            encouragement: 'Your healing space will soon have its own icon on your home screen'
          },
          {
            order: 4,
            instruction: 'Customize the app name if desired and confirm',
            traumaInformedVersion: 'You can name your sanctuary app whatever feels right for you, then confirm the installation',
            encouragement: 'You\'re creating your personal gateway to healing'
          }
        ],
        deviceSpecific: true,
        estimatedTime: '2-3 minutes',
        difficulty: 'easy',
        successRate: 0.85
      }
    ],
    preventionTips: [
      'Use supported browsers (Chrome, Safari, Firefox)',
      'Ensure you\'re on HTTPS version of ALCHM',
      'Don\'t dismiss install prompts if you want PWA functionality'
    ],
    relatedIssues: ['service_worker_not_loading', 'manifest_file_errors'],
    traumaInformedNotes: 'Mobile access is crucial for mental health support. Frame installation as creating a "pocket sanctuary" that travels with them.'
  },

  firestore_quota_exceeded: {
    id: 'firestore_quota_exceeded',
    title: 'Firestore Database Quota Exceeded',
    description: 'Unable to save new entries due to database limits',
    category: 'sync_data',
    subcategory: 'Data Storage',
    frequency: 'rare',
    severity: 'critical',
    affectedPlatforms: ['all'],
    symptoms: [
      'Cannot save new journal entries',
      'Error messages about storage limits',
      'Sync failures across devices',
      'App becomes read-only'
    ],
    rootCauses: [
      'User has exceeded free tier limits',
      'Billing issues with Firebase project',
      'Data model inefficiency',
      'Bulk operations consuming quota'
    ],
    solutions: [
      {
        id: 'quota_escalation',
        title: 'Escalate to Technical Team',
        description: 'Immediate escalation required for quota issues',
        steps: [
          {
            order: 1,
            instruction: 'Contact ALCHM support immediately',
            traumaInformedVersion: 'This is a system-level issue that our technical team needs to resolve immediately - your sanctuary access is our priority',
            encouragement: 'We\'ll work quickly to restore your full access'
          },
          {
            order: 2,
            instruction: 'Provide user ID and timestamp of error',
            traumaInformedVersion: 'Share your user information so we can locate and fix your specific sanctuary',
            warningMessage: 'Never share passwords - we only need your user ID'
          }
        ],
        deviceSpecific: false,
        estimatedTime: 'Immediate escalation',
        difficulty: 'easy',
        successRate: 0.95
      }
    ],
    preventionTips: [
      'This is a system-level issue handled by ALCHM team',
      'Users don\'t need to prevent this - it\'s our responsibility'
    ],
    relatedIssues: ['billing_issues', 'data_sync_failures'],
    traumaInformedNotes: 'CRITICAL: Users may fear losing all their healing work. Provide immediate reassurance that data is safe and being recovered.'
  },

  nextjs_routing_errors: {
    id: 'nextjs_routing_errors',
    title: 'Page Navigation and Routing Errors',
    description: 'Links not working, pages not loading, routing issues',
    category: 'feature_confusion',
    subcategory: 'Navigation Problems',
    frequency: 'occasional',
    severity: 'medium',
    affectedPlatforms: ['all'],
    symptoms: [
      'Clicking links results in 404 errors',
      'Pages load but show wrong content',
      'Browser back button not working properly',
      'URLs don\'t match expected pages'
    ],
    rootCauses: [
      'Browser cache containing old routes',
      'Service worker serving stale content',
      'Client-side navigation issues',
      'Deployment routing configuration'
    ],
    solutions: [
      {
        id: 'clear_navigation_cache',
        title: 'Clear Navigation Cache',
        description: 'Reset browser navigation and routing cache',
        steps: [
          {
            order: 1,
            instruction: 'Press Ctrl+Shift+R (Cmd+Shift+R on Mac) to hard refresh',
            traumaInformedVersion: 'Let\'s give your sanctuary a complete refresh to clear any navigation confusion',
            encouragement: 'This often resolves routing issues immediately'
          },
          {
            order: 2,
            instruction: 'Clear browser cache specifically for ALCHM domain',
            traumaInformedVersion: 'We\'ll clear old navigation data while keeping your login and preferences safe',
            deviceSpecific: {
              chrome: 'Settings → Privacy → Clear browsing data → Select ALCHM site data',
              firefox: 'Settings → Privacy → Manage Data → Find and remove ALCHM cache',
              safari: 'Develop menu → Empty Caches (or Safari → Clear History)'
            }
          },
          {
            order: 3,
            instruction: 'Test navigation by visiting different pages',
            traumaInformedVersion: 'Now let\'s test your sanctuary\'s pathways to ensure smooth movement between healing spaces',
            encouragement: 'Each page should load smoothly and quickly now'
          }
        ],
        deviceSpecific: true,
        estimatedTime: '3-5 minutes',
        difficulty: 'moderate',
        successRate: 0.8
      }
    ],
    preventionTips: [
      'Avoid using browser back button excessively',
      'Use internal ALCHM navigation links instead of bookmarks',
      'Keep browser updated for best routing support'
    ],
    relatedIssues: ['service_worker_cache_issues', 'deployment_problems'],
    traumaInformedNotes: 'Navigation problems can create anxiety about losing access to healing tools. Emphasize that content is safe and accessible.'
  },

  stripe_payment_processing_errors: {
    id: 'stripe_payment_processing_errors',
    title: 'Payment Processing and Subscription Errors',
    description: 'Credit card declined, subscription issues, billing failures',
    category: 'payment_billing',
    subcategory: 'Payment Processing',
    frequency: 'occasional',
    severity: 'high',
    affectedPlatforms: ['all'],
    symptoms: [
      'Credit card declined error',
      'Subscription not activating after payment',
      'Multiple charges for same subscription',
      'Unable to update payment method'
    ],
    rootCauses: [
      'Bank fraud protection blocking payment',
      'Expired or invalid payment method',
      'Billing address mismatch',
      'Stripe webhook delivery issues',
      'Currency conversion problems'
    ],
    solutions: [
      {
        id: 'verify_payment_method',
        title: 'Verify Payment Method Details',
        description: 'Check and update payment information',
        steps: [
          {
            order: 1,
            instruction: 'Verify card number, expiration date, and CVV are correct',
            traumaInformedVersion: 'Let\'s gently double-check your payment information to ensure everything is accurate',
            encouragement: 'Small typos in payment details are very common and easily fixed'
          },
          {
            order: 2,
            instruction: 'Confirm billing address matches your bank records',
            traumaInformedVersion: 'We\'ll verify that your address matches what your bank has on file',
            warningMessage: 'Never share payment details with support - we can help without seeing your card information'
          },
          {
            order: 3,
            instruction: 'Contact your bank if payment continues to decline',
            traumaInformedVersion: 'Sometimes banks protect against new online charges - a quick call can often resolve this',
            encouragement: 'Banks are usually very helpful with authorizing legitimate subscription services'
          }
        ],
        deviceSpecific: false,
        estimatedTime: '5-10 minutes',
        difficulty: 'easy',
        successRate: 0.85
      },
      {
        id: 'alternative_payment_method',
        title: 'Try Alternative Payment Method',
        description: 'Use different card or payment service',
        steps: [
          {
            order: 1,
            instruction: 'Try a different credit or debit card',
            traumaInformedVersion: 'If one payment method isn\'t working, we can try another approach to access your healing sanctuary',
            encouragement: 'Having backup payment options is wise for important services like this'
          },
          {
            order: 2,
            instruction: 'Consider using PayPal or other payment services if available',
            traumaInformedVersion: 'Alternative payment methods like PayPal sometimes work better for subscription services',
            encouragement: 'Different payment methods have different strengths'
          }
        ],
        deviceSpecific: false,
        estimatedTime: '3-5 minutes',
        difficulty: 'easy',
        successRate: 0.9
      }
    ],
    preventionTips: [
      'Keep payment methods updated before expiration',
      'Ensure sufficient funds for subscription charges',
      'Contact bank about online subscription authorizations',
      'Save backup payment methods in account'
    ],
    relatedIssues: ['billing_webhook_failures', 'currency_conversion_issues'],
    traumaInformedNotes: 'Payment issues can trigger financial anxiety and shame. Approach with transparency and emphasize that these are common, solvable problems.'
  },

  crisis_button_not_responding: {
    id: 'crisis_button_not_responding',
    title: 'Crisis Support Button Not Working',
    description: 'Emergency crisis support features not functioning',
    category: 'crisis_technical',
    subcategory: 'Crisis Button Failures',
    frequency: 'rare',
    severity: 'critical',
    affectedPlatforms: ['all'],
    symptoms: [
      'Crisis button doesn\'t respond to clicks',
      'Emergency resources not loading',
      'Crisis chat not connecting',
      'Emergency contact features disabled'
    ],
    rootCauses: [
      'JavaScript errors blocking button functionality',
      'Network issues preventing resource loading',
      'Browser compatibility problems',
      'Service worker cache issues'
    ],
    solutions: [
      {
        id: 'immediate_crisis_resources',
        title: 'Immediate Emergency Resources',
        description: 'Direct access to crisis support while technical issues are resolved',
        steps: [
          {
            order: 1,
            instruction: 'Call 988 Suicide & Crisis Lifeline immediately',
            traumaInformedVersion: 'While we fix the technical issue, please call 988 right now - they\'re available 24/7 and ready to help',
            encouragement: 'You deserve immediate support, regardless of any technical problems'
          },
          {
            order: 2,
            instruction: 'Text HOME to 741741 for Crisis Text Line',
            traumaInformedVersion: 'If calling feels difficult, you can text HOME to 741741 for immediate text-based crisis support',
            encouragement: 'These services are specifically designed to help you through this moment'
          },
          {
            order: 3,
            instruction: 'Call 911 if you are in immediate physical danger',
            traumaInformedVersion: 'If you\'re in immediate physical danger, please call 911 without delay',
            warningMessage: 'Your immediate safety is more important than any app or technical issue'
          }
        ],
        deviceSpecific: false,
        estimatedTime: 'Immediate',
        difficulty: 'easy',
        successRate: 1.0
      },
      {
        id: 'technical_crisis_fix',
        title: 'Technical Resolution for Crisis Features',
        description: 'Fix technical issues preventing crisis feature access',
        steps: [
          {
            order: 1,
            instruction: 'Refresh page and clear browser cache immediately',
            traumaInformedVersion: 'After getting immediate human support, we can work on restoring your digital crisis tools',
            encouragement: 'We\'ll get your full support system working again'
          },
          {
            order: 2,
            instruction: 'Try accessing crisis resources from a different browser or device',
            traumaInformedVersion: 'Sometimes using a different browser or device can restore access to crisis features',
            encouragement: 'We want every path to help available to you'
          }
        ],
        deviceSpecific: false,
        estimatedTime: '2-3 minutes',
        difficulty: 'easy',
        successRate: 0.8
      }
    ],
    preventionTips: [
      'Keep emergency phone numbers saved in phone contacts',
      'Test crisis features periodically during non-crisis times',
      'Know alternative ways to access crisis support'
    ],
    relatedIssues: ['javascript_errors', 'network_connectivity_issues'],
    traumaInformedNotes: 'CRITICAL PRIORITY: When crisis features fail, immediately provide alternative crisis resources. Technical problems during crisis can be life-threatening.'
  }
};

// Solution templates for common ALCHM scenarios
export const SOLUTION_TEMPLATES = {
  browser_refresh: {
    gentle: 'Sometimes giving your sanctuary a gentle refresh helps everything flow more smoothly',
    standard: 'Refresh the page to reload the latest version',
    urgent: 'Please refresh the page immediately to restore functionality'
  },
  cache_clear: {
    gentle: 'Let\'s clear some temporary files to make space for your healing tools to work better',
    standard: 'Clear your browser cache for this site',
    urgent: 'Clear browser cache immediately to resolve critical issues'
  },
  contact_support: {
    gentle: 'I\'d love to connect you with a human guide who can provide more personalized assistance',
    standard: 'Please contact our support team for additional help',
    urgent: 'Immediate human support escalation required'
  }
};

// Device-specific instruction variations
export const DEVICE_INSTRUCTIONS = {
  clear_cache: {
    chrome_desktop: 'Press Ctrl+Shift+Delete → Select "Cached images and files" → Clear data',
    chrome_mobile: 'Chrome menu → Settings → Privacy → Clear browsing data',
    safari_desktop: 'Safari menu → Preferences → Privacy → Manage Website Data → Remove All',
    safari_mobile: 'Settings → Safari → Clear History and Website Data',
    firefox_desktop: 'Ctrl+Shift+Delete → Check "Cache" → Clear Now',
    firefox_mobile: 'Firefox menu → Settings → Delete browsing data'
  },
  hard_refresh: {
    desktop: 'Press Ctrl+Shift+R (Cmd+Shift+R on Mac)',
    mobile: 'Pull down on the page to refresh, or use browser refresh button'
  },
  developer_tools: {
    desktop: 'Press F12 or right-click → Inspect Element',
    mobile: 'Use desktop browser for developer tools access'
  }
};

// Emergency escalation criteria
export const ESCALATION_CRITERIA = {
  immediate: [
    'crisis_button_not_responding',
    'firestore_quota_exceeded',
    'auth_completely_broken'
  ],
  high_priority: [
    'journal_auto_save_failure',
    'stripe_payment_processing_errors',
    'mobile_pwa_critical_failure'
  ],
  standard: [
    'firebase_auth_popup_blocked',
    'nextjs_routing_errors',
    'mobile_pwa_install_issues'
  ]
};

/**
 * Knowledge Base Query Engine
 */
export class ALCHMKnowledgeBase {
  /**
   * Find known issues matching symptoms
   */
  findMatchingIssues(symptoms: string[], category?: string): KnownIssue[] {
    const matches: Array<{ issue: KnownIssue; score: number }> = [];

    for (const issue of Object.values(ALCHM_KNOWN_ISSUES)) {
      if (category && issue.category !== category) continue;

      let score = 0;
      const lowerSymptoms = symptoms.map(s => s.toLowerCase());

      // Check symptom matches
      for (const symptom of issue.symptoms) {
        const lowerSymptom = symptom.toLowerCase();
        for (const userSymptom of lowerSymptoms) {
          if (lowerSymptom.includes(userSymptom) || userSymptom.includes(lowerSymptom)) {
            score += 1;
          }
        }
      }

      if (score > 0) {
        matches.push({ issue, score });
      }
    }

    // Sort by score and frequency
    return matches
      .sort((a, b) => {
        if (a.score !== b.score) return b.score - a.score;
        const frequencyOrder = { common: 3, occasional: 2, rare: 1 };
        return frequencyOrder[b.issue.frequency] - frequencyOrder[a.issue.frequency];
      })
      .map(m => m.issue);
  }

  /**
   * Get solutions for specific issue
   */
  getSolutions(issueId: string, deviceContext?: any): Solution[] {
    const issue = ALCHM_KNOWN_ISSUES[issueId];
    if (!issue) return [];

    return issue.solutions.filter(solution => {
      if (!solution.deviceSpecific) return true;
      if (!deviceContext) return true;
      
      // Filter based on device capabilities
      if (deviceContext.platform === 'mobile' && solution.difficulty === 'advanced') {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Get device-specific instructions
   */
  getDeviceInstructions(action: string, userAgent: string, platform: string): string {
    const instructions = DEVICE_INSTRUCTIONS[action as keyof typeof DEVICE_INSTRUCTIONS];
    if (!instructions) return 'Follow standard browser instructions';

    // Detect specific browser and platform
    if (platform === 'mobile') {
      if (userAgent.includes('Chrome')) return instructions.chrome_mobile;
      if (userAgent.includes('Safari')) return instructions.safari_mobile;
      if (userAgent.includes('Firefox')) return instructions.firefox_mobile;
      return instructions.mobile || 'Use your mobile browser\'s settings menu';
    } else {
      if (userAgent.includes('Chrome')) return instructions.chrome_desktop;
      if (userAgent.includes('Safari')) return instructions.safari_desktop;
      if (userAgent.includes('Firefox')) return instructions.firefox_desktop;
      return instructions.desktop || 'Use your browser\'s settings menu';
    }
  }

  /**
   * Check if issue requires immediate escalation
   */
  requiresEscalation(issueId: string): 'immediate' | 'high_priority' | 'standard' | 'none' {
    if (ESCALATION_CRITERIA.immediate.includes(issueId)) return 'immediate';
    if (ESCALATION_CRITERIA.high_priority.includes(issueId)) return 'high_priority';
    if (ESCALATION_CRITERIA.standard.includes(issueId)) return 'standard';
    return 'none';
  }

  /**
   * Get trauma-informed notes for an issue
   */
  getTraumaInformedNotes(issueId: string): string | null {
    const issue = ALCHM_KNOWN_ISSUES[issueId];
    return issue?.traumaInformedNotes || null;
  }

  /**
   * Get prevention tips for completed resolutions
   */
  getPreventionTips(issueId: string): string[] {
    const issue = ALCHM_KNOWN_ISSUES[issueId];
    return issue?.preventionTips || [];
  }

  /**
   * Find related issues for proactive support
   */
  getRelatedIssues(issueId: string): KnownIssue[] {
    const issue = ALCHM_KNOWN_ISSUES[issueId];
    if (!issue?.relatedIssues) return [];

    return issue.relatedIssues
      .map(id => ALCHM_KNOWN_ISSUES[id])
      .filter(Boolean);
  }
}

export default ALCHMKnowledgeBase;