/**
 * Writing Analytics Engine for ALCHM Journal
 * 
 * Analyzes writing patterns, emotional progression, and therapeutic indicators
 * to provide meaningful insights for personal growth and premium conversion.
 */

export interface WritingAnalytics {
  // Core Metrics
  wordCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  readingLevel: number;
  writingTime?: number;

  // Emotional Analysis
  emotionalTone: {
    primary: string;
    secondary?: string;
    intensity: number; // 0-1
    confidence: number; // 0-1
  };
  
  // Sentiment Progression
  sentimentProgression: {
    beginning: number; // -1 to 1
    middle: number;
    end: number;
    overallTrend: 'improving' | 'declining' | 'stable' | 'mixed';
  };

  // Therapeutic Indicators
  therapeuticValue: {
    score: number; // 0-1
    indicators: {
      selfReflection: number;
      emotionalProcessing: number;
      problemSolving: number;
      gratitude: number;
      meaningMaking: number;
    };
  };

  // Growth Metrics
  growthIndicators: {
    vocabulary: {
      complexity: number;
      emotionalRange: number;
      uniqueWords: number;
    };
    patterns: {
      breakthroughMoments: string[];
      recurringThemes: string[];
      progressMarkers: string[];
    };
  };

  // Wellness Indicators
  wellnessSignals: {
    resilience: number;
    selfCompassion: number;
    futureOrientation: number;
    socialConnection: number;
    copingSkills: number;
  };
}

// Emotional vocabulary for analysis
const EMOTIONAL_LEXICON = {
  positive: {
    high: ['ecstatic', 'euphoric', 'blissful', 'radiant', 'triumphant', 'exhilarated'],
    medium: ['happy', 'joyful', 'grateful', 'content', 'hopeful', 'peaceful', 'confident'],
    low: ['okay', 'fine', 'decent', 'alright', 'stable']
  },
  negative: {
    high: ['devastated', 'anguished', 'tormented', 'despairing', 'livid', 'traumatized'],
    medium: ['sad', 'angry', 'frustrated', 'disappointed', 'anxious', 'overwhelmed'],
    low: ['bothered', 'concerned', 'tired', 'uneasy', 'mildly upset']
  },
  complex: ['bittersweet', 'conflicted', 'ambivalent', 'nostalgic', 'poignant', 'cathartic']
};

// Therapeutic indicators
const THERAPEUTIC_PATTERNS = {
  selfReflection: [
    'i realize', 'i understand', 'i see that', 'i notice', 'i\'m learning',
    'looking back', 'in hindsight', 'i\'m beginning to', 'it occurs to me'
  ],
  emotionalProcessing: [
    'i feel', 'i\'m feeling', 'emotionally', 'my heart', 'this feeling',
    'i\'m experiencing', 'what i\'m going through', 'processing', 'working through'
  ],
  problemSolving: [
    'i could', 'maybe i should', 'next time', 'i\'ll try', 'my plan',
    'i want to', 'i\'m going to', 'i need to', 'moving forward'
  ],
  gratitude: [
    'grateful', 'thankful', 'appreciate', 'blessed', 'fortunate',
    'i\'m glad', 'i love that', 'what i value', 'i\'m grateful for'
  ],
  meaningMaking: [
    'this means', 'i believe', 'my purpose', 'what matters', 'the reason',
    'significance', 'meaningful', 'this experience taught me', 'i\'ve grown'
  ]
};

// Wellness signal patterns
const WELLNESS_PATTERNS = {
  resilience: [
    'bounce back', 'overcome', 'get through', 'survive', 'persevere',
    'stay strong', 'keep going', 'won\'t give up', 'i can handle'
  ],
  selfCompassion: [
    'be kind to myself', 'i forgive myself', 'it\'s okay', 'i\'m only human',
    'treat myself gently', 'self-care', 'i deserve', 'be patient with myself'
  ],
  futureOrientation: [
    'tomorrow', 'next week', 'in the future', 'someday', 'i hope',
    'looking forward', 'my goals', 'i want to become', 'working toward'
  ],
  socialConnection: [
    'my friends', 'family', 'people i love', 'support', 'together',
    'community', 'relationship', 'connected', 'not alone'
  ],
  copingSkills: [
    'breathe', 'meditate', 'take a walk', 'talk to someone', 'journal',
    'music helps', 'exercise', 'pray', 'creative', 'nature'
  ]
};

/**
 * Analyzes writing content and mood to provide comprehensive insights
 */
export function analyzeWritingProgress(content: string, mood?: string): WritingAnalytics {
  if (!content || content.trim().length < 10) {
    return getEmptyAnalytics();
  }

  const normalizedContent = content.toLowerCase();
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = content.trim().split(/\s+/);
  
  return {
    // Core Metrics
    wordCount: words.length,
    sentenceCount: sentences.length,
    averageWordsPerSentence: Math.round(words.length / Math.max(sentences.length, 1)),
    readingLevel: calculateReadingLevel(content),

    // Emotional Analysis
    emotionalTone: analyzeEmotionalTone(normalizedContent, mood),
    
    // Sentiment Progression
    sentimentProgression: analyzeSentimentProgression(content),

    // Therapeutic Value
    therapeuticValue: analyzeTherapeuticValue(normalizedContent),

    // Growth Indicators
    growthIndicators: analyzeGrowthIndicators(normalizedContent, words),

    // Wellness Signals
    wellnessSignals: analyzeWellnessSignals(normalizedContent)
  };
}

function getEmptyAnalytics(): WritingAnalytics {
  return {
    wordCount: 0,
    sentenceCount: 0,
    averageWordsPerSentence: 0,
    readingLevel: 0,
    emotionalTone: {
      primary: 'neutral',
      intensity: 0,
      confidence: 0
    },
    sentimentProgression: {
      beginning: 0,
      middle: 0,
      end: 0,
      overallTrend: 'stable'
    },
    therapeuticValue: {
      score: 0,
      indicators: {
        selfReflection: 0,
        emotionalProcessing: 0,
        problemSolving: 0,
        gratitude: 0,
        meaningMaking: 0
      }
    },
    growthIndicators: {
      vocabulary: {
        complexity: 0,
        emotionalRange: 0,
        uniqueWords: 0
      },
      patterns: {
        breakthroughMoments: [],
        recurringThemes: [],
        progressMarkers: []
      }
    },
    wellnessSignals: {
      resilience: 0,
      selfCompassion: 0,
      futureOrientation: 0,
      socialConnection: 0,
      copingSkills: 0
    }
  };
}

function calculateReadingLevel(content: string): number {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const words = content.trim().split(/\s+/);
  const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  // Simplified Flesch-Kincaid grade level
  const avgSentenceLength = words.length / sentences.length;
  const avgSyllablesPerWord = syllables / words.length;
  
  return Math.max(0, 0.39 * avgSentenceLength + 11.8 * avgSyllablesPerWord - 15.59);
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  
  if (word.endsWith('e')) count--;
  if (word.endsWith('le') && word.length > 2) count++;
  
  return Math.max(1, count);
}

function analyzeEmotionalTone(content: string, mood?: string): WritingAnalytics['emotionalTone'] {
  const emotionScores = {
    positive: 0,
    negative: 0,
    complex: 0
  };

  // Analyze emotional vocabulary
  Object.entries(EMOTIONAL_LEXICON).forEach(([category, intensities]) => {
    if (category === 'complex') {
      const matches = (intensities as string[]).filter(word => content.includes(word));
      emotionScores.complex += matches.length * 0.8;
    } else {
      Object.entries(intensities).forEach(([intensity, words]) => {
        const matches = words.filter(word => content.includes(word));
        const weight = intensity === 'high' ? 1.0 : intensity === 'medium' ? 0.6 : 0.3;
        emotionScores[category as 'positive' | 'negative'] += matches.length * weight;
      });
    }
  });

  // Factor in mood if provided
  if (mood) {
    const moodLower = mood.toLowerCase();
    if (moodLower.includes('happy') || moodLower.includes('good') || moodLower.includes('positive')) {
      emotionScores.positive += 0.5;
    } else if (moodLower.includes('sad') || moodLower.includes('down') || moodLower.includes('negative')) {
      emotionScores.negative += 0.5;
    }
  }

  const totalScore = Object.values(emotionScores).reduce((sum, score) => sum + score, 0);
  
  if (totalScore === 0) {
    return { primary: 'neutral', intensity: 0, confidence: 0 };
  }

  const primary = Object.entries(emotionScores).reduce((a, b) => 
    emotionScores[a[0] as keyof typeof emotionScores] > emotionScores[b[0] as keyof typeof emotionScores] ? a : b
  )[0];

  return {
    primary,
    intensity: Math.min(totalScore / 5, 1),
    confidence: Math.min(totalScore / 3, 1)
  };
}

function analyzeSentimentProgression(content: string): WritingAnalytics['sentimentProgression'] {
  const words = content.split(/\s+/);
  const thirds = Math.ceil(words.length / 3);
  
  const beginning = words.slice(0, thirds).join(' ').toLowerCase();
  const middle = words.slice(thirds, thirds * 2).join(' ').toLowerCase();
  const end = words.slice(thirds * 2).join(' ').toLowerCase();
  
  const analyzeSentiment = (text: string): number => {
    let score = 0;
    
    // Positive indicators
    const positiveWords = ['good', 'great', 'happy', 'love', 'hope', 'better', 'wonderful', 'amazing'];
    positiveWords.forEach(word => {
      score += (text.match(new RegExp(word, 'g')) || []).length * 0.5;
    });
    
    // Negative indicators
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'horrible', 'worse', 'difficult', 'painful'];
    negativeWords.forEach(word => {
      score -= (text.match(new RegExp(word, 'g')) || []).length * 0.5;
    });
    
    return Math.max(-1, Math.min(1, score / 3));
  };

  const beginningSentiment = analyzeSentiment(beginning);
  const middleSentiment = analyzeSentiment(middle);
  const endSentiment = analyzeSentiment(end);
  
  let trend: 'improving' | 'declining' | 'stable' | 'mixed' = 'stable';
  const change = endSentiment - beginningSentiment;
  
  if (Math.abs(change) > 0.3) {
    trend = change > 0 ? 'improving' : 'declining';
  } else if (Math.abs(middleSentiment - beginningSentiment) > 0.3 || Math.abs(endSentiment - middleSentiment) > 0.3) {
    trend = 'mixed';
  }

  return {
    beginning: beginningSentiment,
    middle: middleSentiment,
    end: endSentiment,
    overallTrend: trend
  };
}

function analyzeTherapeuticValue(content: string): WritingAnalytics['therapeuticValue'] {
  const indicators = {
    selfReflection: 0,
    emotionalProcessing: 0,
    problemSolving: 0,
    gratitude: 0,
    meaningMaking: 0
  };

  Object.entries(THERAPEUTIC_PATTERNS).forEach(([indicator, patterns]) => {
    const matches = patterns.filter(pattern => content.includes(pattern)).length;
    indicators[indicator as keyof typeof indicators] = Math.min(matches / 2, 1);
  });

  const totalScore = Object.values(indicators).reduce((sum, score) => sum + score, 0) / 5;

  return {
    score: totalScore,
    indicators
  };
}

function analyzeGrowthIndicators(content: string, words: string[]): WritingAnalytics['growthIndicators'] {
  const uniqueWords = new Set(words.map(w => w.toLowerCase())).size;
  const complexWords = words.filter(word => word.length > 6).length;
  
  // Emotional vocabulary analysis
  const emotionalWords = Object.values(EMOTIONAL_LEXICON).flat().flat()
    .filter(word => content.includes(word));
  
  // Pattern detection
  const breakthroughPhrases = [
    'i realized', 'suddenly understood', 'it clicked', 'aha moment',
    'breakthrough', 'epiphany', 'lightbulb moment'
  ];
  
  const progressPhrases = [
    'i\'ve grown', 'i\'m better at', 'i can now', 'i\'ve learned',
    'progress', 'improvement', 'getting better'
  ];

  const breakthroughMoments = breakthroughPhrases.filter(phrase => content.includes(phrase));
  const progressMarkers = progressPhrases.filter(phrase => content.includes(phrase));

  return {
    vocabulary: {
      complexity: Math.min(complexWords / Math.max(words.length, 1), 1),
      emotionalRange: Math.min(emotionalWords.length / 10, 1),
      uniqueWords
    },
    patterns: {
      breakthroughMoments,
      recurringThemes: [], // Would require historical analysis
      progressMarkers
    }
  };
}

function analyzeWellnessSignals(content: string): WritingAnalytics['wellnessSignals'] {
  const signals = {
    resilience: 0,
    selfCompassion: 0,
    futureOrientation: 0,
    socialConnection: 0,
    copingSkills: 0
  };

  Object.entries(WELLNESS_PATTERNS).forEach(([signal, patterns]) => {
    const matches = patterns.filter(pattern => content.includes(pattern)).length;
    signals[signal as keyof typeof signals] = Math.min(matches / 3, 1);
  });

  return signals;
}

/**
 * Generates premium insights based on analytics
 */
export function generatePremiumInsights(analytics: WritingAnalytics): {
  insights: string[];
  upgradePrompts: string[];
} {
  const insights: string[] = [];
  const upgradePrompts: string[] = [];

  // Therapeutic value insights
  if (analytics.therapeuticValue.score > 0.6) {
    insights.push('Your writing shows strong therapeutic processing. You\'re actively working through emotions and gaining insights.');
    upgradePrompts.push('Unlock detailed therapeutic progress tracking and personalized growth recommendations with Premium.');
  }

  // Emotional progression insights
  if (analytics.sentimentProgression.overallTrend === 'improving') {
    insights.push('Your emotional journey within this entry shows positive progression - a sign of healthy processing.');
  }

  // Growth indicators
  if (analytics.growthIndicators.patterns.breakthroughMoments.length > 0) {
    insights.push('Breakthrough moments detected! Your self-awareness is expanding through your writing practice.');
    upgradePrompts.push('Premium members get detailed breakthrough analysis and guided follow-up exercises.');
  }

  // Wellness signals
  const avgWellness = Object.values(analytics.wellnessSignals).reduce((sum, val) => sum + val, 0) / 5;
  if (avgWellness > 0.5) {
    insights.push('Your writing reveals strong wellness indicators and healthy coping strategies.');
  }

  return { insights, upgradePrompts };
}

export default {
  analyzeWritingProgress,
  generatePremiumInsights
};