// IKIGAI Discovery Engine - Purpose-finding through guided assessment
import { z } from 'zod';

// IKIGAI assessment input schema
export const IkigaiAssessmentInput = z.object({
  userId: z.string(),
  sessionId: z.string(),
  currentStep: z.number().min(1).max(7),
  responses: z.record(z.any()),
  journalEntries: z.array(z.string()).optional(),
  previousSessions: z.array(z.object({
    sessionId: z.string(),
    step: z.number(),
    responses: z.record(z.any()),
    completedAt: z.string()
  })).optional(),
  timestamp: z.number().optional()
});

// IKIGAI assessment output schema
export const IkigaiAssessmentOutput = z.object({
  currentStep: z.number(),
  stepComplete: z.boolean(),
  nextStep: z.number().optional(),
  stepResults: z.object({
    whatYouLove: z.array(z.string()).optional(),
    whatYoureGoodAt: z.array(z.string()).optional(),
    whatTheWorldNeeds: z.array(z.string()).optional(),
    whatYouCanBePaidFor: z.array(z.string()).optional(),
    intersections: z.object({
      passion: z.array(z.string()).optional(), // Love + Good at
      mission: z.array(z.string()).optional(), // Love + World needs
      profession: z.array(z.string()).optional(), // Good at + Paid for
      vocation: z.array(z.string()).optional() // World needs + Paid for
    }).optional(),
    ikigai: z.array(z.string()).optional() // All four circles intersection
  }),
  purposeStatement: z.string().optional(),
  actionableSteps: z.array(z.string()),
  progressPercentage: z.number().min(0).max(100),
  insights: z.array(z.string()),
  careerSuggestions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    alignment: z.number().min(0).max(1),
    steps: z.array(z.string())
  })).optional(),
  nextSessionPrompt: z.string().optional(),
  completionBadges: z.array(z.string()).optional()
});

export type IkigaiAssessmentInputType = z.infer<typeof IkigaiAssessmentInput>;
export type IkigaiAssessmentOutputType = z.infer<typeof IkigaiAssessmentOutput>;

// IKIGAI Assessment Steps
export const IKIGAI_STEPS = {
  1: {
    title: "What You Love ❤️",
    description: "Discover your passions and what brings you joy",
    questions: [
      "What activities make you lose track of time?",
      "What would you do for free if money wasn't a concern?",
      "What topics do you love learning about?",
      "What experiences have brought you the most fulfillment?",
      "When do you feel most energized and alive?"
    ],
    timeEstimate: "5-7 minutes"
  },
  2: {
    title: "What You're Good At 🎯",
    description: "Identify your natural talents and developed skills",
    questions: [
      "What do people often ask for your help with?",
      "What skills do you pick up easily?",
      "What compliments do you receive regularly?",
      "What achievements are you most proud of?",
      "What comes naturally to you that others find difficult?"
    ],
    timeEstimate: "5-7 minutes"
  },
  3: {
    title: "What the World Needs 🌍",
    description: "Explore how you can contribute to something greater",
    questions: [
      "What problems in the world concern you most?",
      "How do you want to make a positive impact?",
      "What causes do you feel passionate about?",
      "What would you change if you had unlimited resources?",
      "How do you want to be remembered?"
    ],
    timeEstimate: "5-7 minutes"
  },
  4: {
    title: "What You Can Be Paid For 💰",
    description: "Identify how your value can translate to income",
    questions: [
      "What valuable services can you provide?",
      "What expertise do people pay others for that you possess?",
      "What problems can you solve that people would pay to fix?",
      "What industries align with your skills and interests?",
      "How can you monetize your passions and talents?"
    ],
    timeEstimate: "5-7 minutes"
  },
  5: {
    title: "Finding Intersections 🔗",
    description: "Discover where your circles overlap",
    questions: [
      "Where do your passions and skills intersect?",
      "How can your talents serve the world's needs?",
      "What work would fulfill you while providing value?",
      "Where do opportunity and purpose align?",
      "What activities energize you AND help others?"
    ],
    timeEstimate: "7-10 minutes"
  },
  6: {
    title: "Your IKIGAI Center ⭐",
    description: "Craft your purpose statement",
    questions: [
      "Based on your discoveries, what is your core purpose?",
      "How would you describe your ideal contribution to the world?",
      "What legacy do you want to build?",
      "What would your purpose statement be?",
      "How does this purpose feel in your body and heart?"
    ],
    timeEstimate: "10-15 minutes"
  },
  7: {
    title: "Action Planning 🚀",
    description: "Create your path forward",
    questions: [
      "What's one small step you can take this week toward your IKIGAI?",
      "What skills do you need to develop?",
      "Who can support you on this journey?",
      "What obstacles might you face and how will you overcome them?",
      "How will you stay connected to your purpose daily?"
    ],
    timeEstimate: "10-15 minutes"
  }
};

// Process step responses
export function processStepResponses(
  step: number,
  responses: Record<string, any>
): { results: string[]; insights: string[] } {
  
  const insights: string[] = [];
  const results: string[] = [];

  switch (step) {
    case 1: // What You Love
      const passions = extractKeyThemes(responses);
      results.push(...passions);
      
      if (passions.some(p => p.includes('creative') || p.includes('art'))) {
        insights.push('You have strong creative tendencies');
      }
      if (passions.some(p => p.includes('help') || p.includes('support'))) {
        insights.push('Service to others energizes you');
      }
      if (passions.length > 5) {
        insights.push('You have diverse interests - consider how they might connect');
      }
      break;

    case 2: // What You're Good At
      const skills = extractKeyThemes(responses);
      results.push(...skills);
      
      if (skills.some(s => s.includes('communication') || s.includes('speaking'))) {
        insights.push('Communication is one of your core strengths');
      }
      if (skills.some(s => s.includes('analytical') || s.includes('problem'))) {
        insights.push('You excel at analytical thinking and problem-solving');
      }
      break;

    case 3: // What the World Needs
      const causes = extractKeyThemes(responses);
      results.push(...causes);
      
      if (causes.some(c => c.includes('education') || c.includes('learning'))) {
        insights.push('Education and knowledge sharing resonate with you');
      }
      if (causes.some(c => c.includes('environment') || c.includes('sustainability'))) {
        insights.push('Environmental stewardship is important to you');
      }
      break;

    case 4: // What You Can Be Paid For
      const monetizable = extractKeyThemes(responses);
      results.push(...monetizable);
      
      if (monetizable.some(m => m.includes('consulting') || m.includes('advice'))) {
        insights.push('Your expertise has consulting potential');
      }
      if (monetizable.some(m => m.includes('teaching') || m.includes('training'))) {
        insights.push('Knowledge transfer could be a revenue stream');
      }
      break;

    default:
      results.push(...extractKeyThemes(responses));
  }

  return { results, insights };
}

// Extract key themes from text responses
function extractKeyThemes(responses: Record<string, any>): string[] {
  const themes: string[] = [];
  
  Object.values(responses).forEach(response => {
    if (typeof response === 'string' && response.length > 0) {
      // Simple keyword extraction (could be enhanced with NLP)
      const words = response.toLowerCase()
        .split(/[^\w]+/)
        .filter(word => word.length > 3)
        .filter(word => !['that', 'with', 'have', 'this', 'they', 'would', 'could', 'should'].includes(word));
      
      themes.push(...words);
    } else if (Array.isArray(response)) {
      themes.push(...response.map(item => String(item).toLowerCase()));
    }
  });

  // Return unique themes, sorted by frequency
  const themeCount = themes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(themeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([theme]) => theme);
}

// Calculate intersections between IKIGAI circles
export function calculateIntersections(stepResults: any) {
  const { whatYouLove, whatYoureGoodAt, whatTheWorldNeeds, whatYouCanBePaidFor } = stepResults;

  if (!whatYouLove || !whatYoureGoodAt || !whatTheWorldNeeds || !whatYouCanBePaidFor) {
    return {};
  }

  const intersections = {
    passion: findCommonThemes(whatYouLove, whatYoureGoodAt),
    mission: findCommonThemes(whatYouLove, whatTheWorldNeeds),
    profession: findCommonThemes(whatYoureGoodAt, whatYouCanBePaidFor),
    vocation: findCommonThemes(whatTheWorldNeeds, whatYouCanBePaidFor)
  };

  // Find the center (all four circles)
  const ikigai = findCommonThemes(
    intersections.passion,
    findCommonThemes(whatTheWorldNeeds, whatYouCanBePaidFor)
  );

  return { ...intersections, ikigai };
}

// Find common themes between two arrays
function findCommonThemes(array1: string[], array2: string[]): string[] {
  if (!array1 || !array2) return [];
  
  const common: string[] = [];
  
  array1.forEach(item1 => {
    array2.forEach(item2 => {
      // Check for exact matches or semantic similarity
      if (item1 === item2 || 
          item1.includes(item2) || 
          item2.includes(item1) ||
          calculateSimilarity(item1, item2) > 0.7) {
        common.push(item1);
      }
    });
  });

  return [...new Set(common)];
}

// Simple similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

// Generate purpose statement
export function generatePurposeStatement(intersections: any, allResponses: Record<string, any>): string {
  const { ikigai, passion, mission } = intersections;
  
  if (ikigai && ikigai.length > 0) {
    const primaryPurpose = ikigai[0];
    return `My purpose is to use my ${primaryPurpose} to create meaningful impact in the world.`;
  }
  
  if (passion && mission && passion.length > 0 && mission.length > 0) {
    return `I am called to combine my passion for ${passion[0]} with my mission to ${mission[0]}.`;
  }
  
  // Fallback based on user responses
  const values = Object.values(allResponses).join(' ').toLowerCase();
  
  if (values.includes('help') || values.includes('support')) {
    return "My purpose is to help others grow and thrive through my unique gifts.";
  }
  
  if (values.includes('create') || values.includes('build')) {
    return "My purpose is to create value and positive change in the world.";
  }
  
  return "My purpose is to live authentically and contribute my gifts to something greater than myself.";
}

// Generate career suggestions
export function generateCareerSuggestions(
  intersections: any,
  stepResults: any
): Array<{ title: string; description: string; alignment: number; steps: string[] }> {
  
  const suggestions: Array<{ title: string; description: string; alignment: number; steps: string[] }> = [];
  
  const { whatYouLove, whatYoureGoodAt, whatTheWorldNeeds, whatYouCanBePaidFor } = stepResults;
  const { passion, mission, profession, ikigai } = intersections;

  // High alignment careers (IKIGAI center)
  if (ikigai && ikigai.length > 0) {
    ikigai.forEach((theme: string) => {
      const careerMap = getCareerMappings(theme);
      suggestions.push(...careerMap.map(career => ({ ...career, alignment: 0.9 })));
    });
  }

  // Medium-high alignment (intersections)
  if (passion && passion.length > 0) {
    passion.forEach((theme: string) => {
      const careerMap = getCareerMappings(theme);
      suggestions.push(...careerMap.map(career => ({ ...career, alignment: 0.7 })));
    });
  }

  // Ensure we have suggestions
  if (suggestions.length === 0) {
    suggestions.push({
      title: "Purpose-Driven Professional",
      description: "A role that combines your skills with meaningful impact",
      alignment: 0.6,
      steps: [
        "Identify organizations aligned with your values",
        "Develop skills that bridge your passions and market needs",
        "Network with professionals in purpose-driven fields",
        "Consider freelancing or consulting to test alignment"
      ]
    });
  }

  return suggestions.slice(0, 5); // Limit to top 5
}

// Map themes to potential careers
function getCareerMappings(theme: string): Array<{ title: string; description: string; steps: string[] }> {
  const careerMaps: Record<string, Array<{ title: string; description: string; steps: string[] }>> = {
    teaching: [{
      title: "Educator/Trainer",
      description: "Share knowledge and help others grow",
      steps: [
        "Get teaching certification or credentials",
        "Start with tutoring or workshops",
        "Build a portfolio of educational content",
        "Network with educational institutions"
      ]
    }],
    creativity: [{
      title: "Creative Professional",
      description: "Use artistic talents to inspire and communicate",
      steps: [
        "Build a strong portfolio",
        "Develop digital marketing skills",
        "Network with other creatives",
        "Consider freelance projects to start"
      ]
    }],
    technology: [{
      title: "Tech for Good Professional",
      description: "Use technology to solve meaningful problems",
      steps: [
        "Learn relevant programming languages",
        "Contribute to open source projects",
        "Join tech communities focused on social impact",
        "Build projects that demonstrate your values"
      ]
    }],
    helping: [{
      title: "Helper/Coach",
      description: "Support others in achieving their goals",
      steps: [
        "Get relevant certifications",
        "Start with informal mentoring",
        "Develop active listening and communication skills",
        "Build a network of potential clients"
      ]
    }]
  };

  return careerMaps[theme] || [{
    title: "Purpose-Aligned Professional",
    description: `Leverage your interest in ${theme} for meaningful work`,
    steps: [
      "Research industries related to your interests",
      "Connect with professionals in the field",
      "Develop relevant skills and experience",
      "Start with side projects or volunteer work"
    ]
  }];
}

// Generate actionable next steps
export function generateActionableSteps(
  step: number,
  intersections: any,
  purposeStatement?: string
): string[] {
  
  const baseSteps = [
    "Reflect on today's insights in your journal",
    "Share your discoveries with someone you trust",
    "Notice how these insights show up in your daily life"
  ];

  switch (step) {
    case 1:
      return [
        ...baseSteps,
        "Schedule time this week for an activity you love",
        "Pay attention to what energizes vs. drains you"
      ];
    
    case 2:
      return [
        ...baseSteps,
        "Ask three people what they see as your strengths",
        "Practice one of your key skills this week"
      ];
    
    case 3:
      return [
        ...baseSteps,
        "Research one cause you care about",
        "Find one small way to contribute this week"
      ];
    
    case 4:
      return [
        ...baseSteps,
        "Research career paths related to your skills",
        "Identify one skill you could monetize"
      ];
    
    case 5:
      return [
        ...baseSteps,
        "Look for patterns across your four circles",
        "Notice where your energy and impact align"
      ];
    
    case 6:
      return [
        ...baseSteps,
        "Write your purpose statement somewhere visible",
        "Consider how to live this purpose daily"
      ];
    
    case 7:
      return [
        "Take one concrete step toward your IKIGAI this week",
        "Set up regular check-ins with your purpose",
        "Connect with others on similar journeys",
        "Celebrate your progress and insights"
      ];
    
    default:
      return baseSteps;
  }
}

// Main IKIGAI assessment processing function
export async function processIkigaiAssessment(input: IkigaiAssessmentInputType): Promise<IkigaiAssessmentOutputType> {
  try {
    const { currentStep, responses, previousSessions } = input;
    
    // Process current step responses
    const stepData = processStepResponses(currentStep, responses);
    
    // Build cumulative results
    const allResults = buildCumulativeResults(currentStep, stepData.results, previousSessions || []);
    
    // Calculate intersections if we have enough data
    const intersections = currentStep >= 5 ? calculateIntersections(allResults) : {};
    
    // Generate purpose statement if at step 6+
    const purposeStatement = currentStep >= 6 ? generatePurposeStatement(intersections, responses) : undefined;
    
    // Generate career suggestions if at step 7
    const careerSuggestions = currentStep === 7 ? generateCareerSuggestions(intersections, allResults) : undefined;
    
    // Calculate progress
    const progressPercentage = Math.round((currentStep / 7) * 100);
    
    // Generate actionable steps
    const actionableSteps = generateActionableSteps(currentStep, intersections, purposeStatement);
    
    // Check if step is complete and determine next step
    const stepComplete = Object.keys(responses).length >= 3; // Minimum responses required
    const nextStep = stepComplete && currentStep < 7 ? currentStep + 1 : undefined;
    
    // Generate insights
    const insights = [
      ...stepData.insights,
      ...(currentStep >= 5 ? generateIntersectionInsights(intersections) : [])
    ];

    // Generate completion badges
    const completionBadges = generateCompletionBadges(currentStep, progressPercentage);
    
    // Generate next session prompt
    const nextSessionPrompt = nextStep ? generateNextSessionPrompt(nextStep) : undefined;

    return {
      currentStep,
      stepComplete,
      nextStep,
      stepResults: allResults,
      purposeStatement,
      actionableSteps,
      progressPercentage,
      insights,
      careerSuggestions,
      nextSessionPrompt,
      completionBadges
    };

  } catch (error) {
    console.error('Error in IKIGAI assessment processing:', error);
    throw new Error('Failed to process IKIGAI assessment');
  }
}

// Build cumulative results from all sessions
function buildCumulativeResults(currentStep: number, currentResults: string[], previousSessions: any[]) {
  const results: any = {};
  
  // Process previous sessions
  previousSessions.forEach(session => {
    const stepKey = getStepKey(session.step);
    if (stepKey) {
      results[stepKey] = processStepResponses(session.step, session.responses).results;
    }
  });
  
  // Add current step results
  const currentStepKey = getStepKey(currentStep);
  if (currentStepKey) {
    results[currentStepKey] = currentResults;
  }
  
  return results;
}

// Get the key for each step
function getStepKey(step: number): string | null {
  const stepKeys: Record<number, string> = {
    1: 'whatYouLove',
    2: 'whatYoureGoodAt',
    3: 'whatTheWorldNeeds',
    4: 'whatYouCanBePaidFor'
  };
  
  return stepKeys[step] || null;
}

// Generate insights about intersections
function generateIntersectionInsights(intersections: any): string[] {
  const insights: string[] = [];
  
  if (intersections.ikigai && intersections.ikigai.length > 0) {
    insights.push(`You've found potential IKIGAI in: ${intersections.ikigai.join(', ')}`);
  }
  
  if (intersections.passion && intersections.passion.length > 0) {
    insights.push(`Your passion zone includes: ${intersections.passion.join(', ')}`);
  }
  
  if (intersections.mission && intersections.mission.length > 0) {
    insights.push(`Your mission aligns with: ${intersections.mission.join(', ')}`);
  }
  
  return insights;
}

// Generate completion badges
function generateCompletionBadges(step: number, progress: number): string[] {
  const badges: string[] = [];
  
  if (step >= 1) badges.push("💝 Passion Explorer");
  if (step >= 2) badges.push("🎯 Talent Identifier");
  if (step >= 3) badges.push("🌍 World Changer");
  if (step >= 4) badges.push("💰 Value Creator");
  if (step >= 5) badges.push("🔗 Connection Maker");
  if (step >= 6) badges.push("⭐ Purpose Definer");
  if (step >= 7) badges.push("🚀 Action Planner");
  
  if (progress === 100) badges.push("🏆 IKIGAI Master");
  
  return badges;
}

// Generate prompt for next session
function generateNextSessionPrompt(nextStep: number): string {
  const prompts: Record<number, string> = {
    2: "Ready to explore your natural talents and skills? Let's discover what you're truly good at!",
    3: "Time to connect with your deeper purpose - how do you want to serve the world?",
    4: "Let's explore how your gifts can create value and sustainable income.",
    5: "Now we'll find the magical intersections where your circles overlap!",
    6: "Ready to craft your personal IKIGAI and purpose statement?",
    7: "Time to create your action plan and bring your IKIGAI to life!"
  };
  
  return prompts[nextStep] || "Continue your IKIGAI journey when you're ready!";
}