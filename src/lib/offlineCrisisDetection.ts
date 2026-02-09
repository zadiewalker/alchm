/**
 * Offline Crisis Detection System
 * 
 * CRITICAL: This system must work without network connectivity
 * to ensure user safety during mental health emergencies
 */

// Expanded crisis keyword patterns for comprehensive detection
const CRISIS_PATTERNS = {
  // Immediate suicide risk indicators
  suicide: {
    keywords: [
      'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
      'no reason to live', 'can\'t go on', 'want to disappear', 'end it all',
      'done with life', 'take my own life', 'not worth living', 'everyone would be better without me'
    ],
    severity: 'critical',
    urgency: 'immediate'
  },

  // Self-harm indicators
  selfHarm: {
    keywords: [
      'self harm', 'self-harm', 'hurt myself', 'cut myself', 'harm myself',
      'cutting', 'burning myself', 'punish myself', 'deserve pain', 'need to hurt',
      'razor', 'blade', 'slice', 'carve', 'scratch myself'
    ],
    severity: 'high',
    urgency: 'urgent'
  },

  // Suicide method references (highest risk)
  methods: {
    keywords: [
      'overdose', 'pills', 'jump off', 'gun', 'rope', 'bridge', 'poison',
      'hanging', 'noose', 'cliff', 'train', 'carbon monoxide', 'exhaust'
    ],
    severity: 'critical',
    urgency: 'immediate'
  },

  // Hopelessness and despair
  hopelessness: {
    keywords: [
      'hopeless', 'no hope', 'pointless', 'nothing matters', 'give up',
      'can\'t take it', 'breaking down', 'falling apart', 'losing it',
      'can\'t cope', 'overwhelmed', 'drowning', 'suffocating'
    ],
    severity: 'medium',
    urgency: 'high'
  },

  // Isolation and withdrawal
  isolation: {
    keywords: [
      'alone', 'nobody cares', 'no one understands', 'isolated', 'lonely',
      'abandoned', 'rejected', 'worthless', 'burden', 'waste of space',
      'invisible', 'forgotten', 'unloved'
    ],
    severity: 'medium',
    urgency: 'moderate'
  }
};

// Crisis resource contacts (always available offline)
const EMERGENCY_CONTACTS = [
  {
    name: "988 Suicide & Crisis Lifeline",
    phone: "988",
    type: "call",
    description: "24/7 crisis support - Call or chat",
    urgent: true,
    availability: "24/7"
  },
  {
    name: "Crisis Text Line",
    phone: "741741",
    type: "text",
    message: "HOME",
    description: "Text HOME to 741741 for crisis support",
    urgent: true,
    availability: "24/7"
  },
  {
    name: "Emergency Services",
    phone: "911",
    type: "call",
    description: "For immediate life-threatening emergencies",
    urgent: true,
    availability: "24/7"
  }
];

export interface CrisisDetectionResult {
  detected: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'moderate' | 'high' | 'urgent' | 'immediate';
  matchedPatterns: string[];
  detectedKeywords: string[];
  recommendedAction: string;
  resources: typeof EMERGENCY_CONTACTS;
  confidence: number;
}

/**
 * Offline crisis detection - NO NETWORK REQUIRED
 * This function MUST work without any external dependencies
 */
export function detectCrisisOffline(text: string): CrisisDetectionResult {
  if (!text || typeof text !== 'string') {
    return createSafeResult();
  }

  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/);
  
  let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
  let highestUrgency: 'low' | 'moderate' | 'high' | 'urgent' | 'immediate' = 'low';
  const matchedPatterns: string[] = [];
  const detectedKeywords: string[] = [];
  let totalMatches = 0;

  // Analyze each crisis pattern
  Object.entries(CRISIS_PATTERNS).forEach(([patternName, pattern]) => {
    const matches = pattern.keywords.filter(keyword => 
      normalizedText.includes(keyword)
    );
    
    if (matches.length > 0) {
      matchedPatterns.push(patternName);
      detectedKeywords.push(...matches);
      totalMatches += matches.length;

      // Update severity and urgency based on highest risk found
      if (getSeverityLevel(pattern.severity) > getSeverityLevel(highestSeverity)) {
        highestSeverity = pattern.severity as any;
      }
      if (getUrgencyLevel(pattern.urgency) > getUrgencyLevel(highestUrgency)) {
        highestUrgency = pattern.urgency as any;
      }
    }
  });

  // Check for multiple concerning phrases (escalates severity)
  if (totalMatches >= 5 && highestSeverity === 'medium') {
    highestSeverity = 'high';
  }
  if (totalMatches >= 8 && highestSeverity === 'high') {
    highestSeverity = 'critical';
  }

  // Check text length for context (longer text = more concerning if crisis words present)
  const textLength = words.length;
  if (textLength > 100 && totalMatches > 0 && highestUrgency === 'moderate') {
    highestUrgency = 'high';
  }

  // Calculate confidence based on keyword density and pattern diversity
  const keywordDensity = totalMatches / Math.max(words.length, 1);
  const patternDiversity = matchedPatterns.length / Object.keys(CRISIS_PATTERNS).length;
  const confidence = Math.min(100, 
    (keywordDensity * 50) + (patternDiversity * 30) + (totalMatches * 5)
  );

  const detected = totalMatches > 0;

  return {
    detected,
    severity: detected ? highestSeverity : 'low',
    urgency: detected ? highestUrgency : 'low',
    matchedPatterns,
    detectedKeywords,
    recommendedAction: getRecommendedAction(highestSeverity, highestUrgency),
    resources: detected ? EMERGENCY_CONTACTS : [],
    confidence: Math.round(confidence)
  };
}

// Helper functions
function getSeverityLevel(severity: string): number {
  const levels = { low: 1, medium: 2, high: 3, critical: 4 };
  return levels[severity as keyof typeof levels] || 1;
}

function getUrgencyLevel(urgency: string): number {
  const levels = { low: 1, moderate: 2, high: 3, urgent: 4, immediate: 5 };
  return levels[urgency as keyof typeof levels] || 1;
}

function getRecommendedAction(severity: string, urgency: string): string {
  if (severity === 'critical' || urgency === 'immediate') {
    return 'IMMEDIATE_INTERVENTION_REQUIRED';
  }
  if (severity === 'high' || urgency === 'urgent') {
    return 'URGENT_SUPPORT_NEEDED';
  }
  if (severity === 'medium' || urgency === 'high') {
    return 'CRISIS_SUPPORT_RECOMMENDED';
  }
  return 'MONITOR_CLOSELY';
}

function createSafeResult(): CrisisDetectionResult {
  return {
    detected: false,
    severity: 'low',
    urgency: 'low',
    matchedPatterns: [],
    detectedKeywords: [],
    recommendedAction: 'MONITOR_CLOSELY',
    resources: [],
    confidence: 0
  };
}

/**
 * Emergency contact helper - works offline
 */
export function getEmergencyContactsOffline() {
  return EMERGENCY_CONTACTS;
}

/**
 * Trigger emergency intervention (offline capable)
 */
export function triggerOfflineIntervention(severity: string, urgency: string) {
  // Store crisis event locally for when network returns
  const crisisEvent = {
    timestamp: new Date().toISOString(),
    severity,
    urgency,
    offline: true,
    id: `crisis_${Date.now()}`
  };

  try {
    const existingEvents = localStorage.getItem('offline_crisis_events');
    const events = existingEvents ? JSON.parse(existingEvents) : [];
    events.push(crisisEvent);
    localStorage.setItem('offline_crisis_events', JSON.stringify(events));
  } catch (error) {
    console.error('Failed to store offline crisis event:', error);
  }

  // Dispatch custom event for immediate UI response
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('offline-crisis-detected', {
      detail: { severity, urgency, resources: EMERGENCY_CONTACTS }
    });
    window.dispatchEvent(event);
  }

  return crisisEvent;
}

/**
 * Real-time crisis monitoring hook (offline-first)
 */
export function useOfflineCrisisDetection() {
  if (typeof window === 'undefined') {
    return {
      analyzeText: detectCrisisOffline,
      getEmergencyContacts: getEmergencyContactsOffline,
      isOnline: false
    };
  }

  const isOnline = navigator.onLine;

  return {
    analyzeText: detectCrisisOffline,
    getEmergencyContacts: getEmergencyContactsOffline,
    triggerIntervention: triggerOfflineIntervention,
    isOnline
  };
}