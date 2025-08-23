// ALCHM Social Justice and Equity-Focused Activities
// Trauma-informed reflection activities that honor youth voices and lived experiences
// Designed to build critical consciousness while maintaining safety and cultural responsiveness

export interface SocialJusticeActivity {
  id: string;
  title: string;
  category: 'identity_affirmation' | 'systemic_awareness' | 'community_healing' | 'action_reflection' | 'cultural_reclamation' | 'resistance_celebration';
  focusArea: 'personal_power' | 'collective_strength' | 'historical_awareness' | 'future_visioning' | 'healing_justice' | 'cultural_wisdom';
  culturalContext: 'universal' | 'indigenous' | 'african_diaspora' | 'latino_hispanic' | 'asian_pacific' | 'middle_eastern' | 'lgbtq_plus' | 'disability_justice';
  gradeLevel: 'elementary' | 'middle' | 'high_school' | 'all_ages';
  timeRequired: '5_minutes' | '15_minutes' | '30_minutes' | 'ongoing';
  traumaInformed: boolean;
  prompt: string;
  guidingQuestions: string[];
  culturalWisdom?: string;
  safetyConsiderations: string[];
  followUpActions?: string[];
  resourceLinks?: string[];
  adaptations: {
    neurodivergent: string;
    traumaSurvivors: string;
    emergingEnglish: string;
  };
}

// ===== IDENTITY AFFIRMATION ACTIVITIES =====

export const IDENTITY_AFFIRMATION_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'ancestral-strength-meditation',
    title: 'Ancestral Strength Meditation',
    category: 'identity_affirmation',
    focusArea: 'personal_power',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'Your ancestors survived incredible challenges to bring you here. What strength from your lineage - biological, chosen, or spiritual - do you carry within you today?',
    guidingQuestions: [
      'What qualities do you admire in the people who came before you?',
      'How do you see their resilience showing up in your own life?',
      'What would they be proud of you for today?',
      'How can you honor their journey through your own choices?'
    ],
    culturalWisdom: 'Every person carries the unbroken line of survivors. Your existence is proof of countless acts of courage, love, and resistance.',
    safetyConsiderations: [
      'Allow space for chosen family and non-biological ancestry',
      'Honor diverse family structures and backgrounds',
      'Provide alternative for students who may have complex family trauma'
    ],
    followUpActions: [
      'Create an ancestral strength symbol or artwork',
      'Write a letter of gratitude to your ancestors',
      'Share a family story or tradition with someone you trust'
    ],
    adaptations: {
      neurodivergent: 'Offer sensory grounding options like holding a meaningful object while reflecting',
      traumaSurvivors: 'Frame ancestors broadly to include chosen family, mentors, or community elders',
      emergingEnglish: 'Encourage reflection in native language with optional translation'
    }
  },
  
  {
    id: 'cultural-gifts-inventory',
    title: 'Cultural Gifts Inventory',
    category: 'identity_affirmation',
    focusArea: 'cultural_wisdom',
    culturalContext: 'universal',
    gradeLevel: 'middle',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'Your cultural background gives you unique gifts, perspectives, and ways of knowing. What cultural wisdom do you carry that the world needs?',
    guidingQuestions: [
      'What traditions, values, or practices from your culture bring you strength?',
      'What perspective do you offer that others might not have?',
      'How has your cultural experience taught you about resilience?',
      'What would you want others to understand about your community?'
    ],
    safetyConsiderations: [
      'Honor mixed-heritage and adopted students',
      'Avoid assumptions about cultural knowledge or connection',
      'Create space for questioning and exploration of identity'
    ],
    followUpActions: [
      'Research a cultural tradition you want to learn more about',
      'Share your cultural perspective in a school or community setting',
      'Connect with cultural organizations or communities'
    ],
    adaptations: {
      neurodivergent: 'Provide visual or creative expression options beyond writing',
      traumaSurvivors: 'Allow for complex relationships with cultural identity',
      emergingEnglish: 'Encourage bilingual or multilingual expression'
    }
  },

  {
    id: 'intersectional-identity-map',
    title: 'Intersectional Identity Mapping',
    category: 'identity_affirmation',
    focusArea: 'personal_power',
    culturalContext: 'universal',
    gradeLevel: 'high_school',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'You are beautifully complex, holding multiple identities that intersect and create your unique experience. How do these different aspects of yourself work together to create your power?',
    guidingQuestions: [
      'What identities do you hold? (race, class, gender, sexuality, ability, religion, etc.)',
      'How do these identities intersect to create unique experiences?',
      'Where do you find strength in your intersectionality?',
      'What perspectives do you have because of your multiple identities?'
    ],
    culturalWisdom: 'Your intersections are not burdens to carry - they are sources of wisdom and power that make you uniquely equipped to contribute to justice.',
    safetyConsiderations: [
      'Respect privacy around identity disclosure',
      'Honor fluidity and questioning in identity development',
      'Provide content warnings about discussing discrimination'
    ],
    followUpActions: [
      'Connect with affinity groups that reflect your identities',
      'Research intersectional leaders who share aspects of your identity',
      'Create art or writing that celebrates your intersections'
    ],
    adaptations: {
      neurodivergent: 'Offer visual mapping tools and alternative organization methods',
      traumaSurvivors: 'Allow partial sharing and private reflection options',
      emergingEnglish: 'Provide identity terms in multiple languages'
    }
  }
];

// ===== SYSTEMIC AWARENESS ACTIVITIES =====

export const SYSTEMIC_AWARENESS_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'power-structure-reflection',
    title: 'Understanding Power Structures',
    category: 'systemic_awareness',
    focusArea: 'historical_awareness',
    culturalContext: 'universal',
    gradeLevel: 'high_school',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'Power shapes our world in ways both visible and invisible. How do you see power operating in your community, school, and society?',
    guidingQuestions: [
      'Who holds decision-making power in spaces you navigate?',
      'What systems or structures affect your daily life?',
      'Where do you see fairness? Where do you see inequity?',
      'How might your identities affect how you experience these systems?'
    ],
    safetyConsiderations: [
      'Frame as observation and analysis, not personal attack',
      'Acknowledge student experiences without retraumatizing',
      'Provide support for students who may feel overwhelmed'
    ],
    followUpActions: [
      'Research the history of an institution you interact with',
      'Interview a community elder about changes they\'ve witnessed',
      'Explore how young people have created change historically'
    ],
    adaptations: {
      neurodivergent: 'Break complex concepts into smaller, visual components',
      traumaSurvivors: 'Focus on empowerment rather than victimization',
      emergingEnglish: 'Use concrete examples from students\' home countries'
    }
  },

  {
    id: 'media-representation-analysis',
    title: 'Media Representation Critical Analysis',
    category: 'systemic_awareness',
    focusArea: 'collective_strength',
    culturalContext: 'universal',
    gradeLevel: 'middle',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'Stories shape how we see ourselves and each other. What stories about people like you do you see in media, and what stories are missing?',
    guidingQuestions: [
      'How are people who share your identities represented in movies, TV, books, or social media?',
      'What narratives feel authentic? What feels limiting or harmful?',
      'What stories about your communities aren\'t being told?',
      'How do these representations affect how you see yourself?'
    ],
    safetyConsiderations: [
      'Acknowledge the pain of misrepresentation without dwelling on it',
      'Focus on agency and critical thinking skills',
      'Celebrate positive representation when it exists'
    ],
    followUpActions: [
      'Seek out media created by people from your communities',
      'Support independent creators who tell authentic stories',
      'Create your own content that represents your perspective'
    ],
    adaptations: {
      neurodivergent: 'Use multimedia examples and varied analysis formats',
      traumaSurvivors: 'Focus on empowering representation rather than traumatic portrayals',
      emergingEnglish: 'Include global media and non-English content'
    }
  }
];

// ===== COMMUNITY HEALING ACTIVITIES =====

export const COMMUNITY_HEALING_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'healing-justice-circle',
    title: 'Community Healing Circle',
    category: 'community_healing',
    focusArea: 'healing_justice',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'Individual healing and community healing are connected. How can we hold space for both personal growth and collective wellbeing?',
    guidingQuestions: [
      'What does healing look like for you personally?',
      'What wounds does your community carry that need tending?',
      'How can individual healing contribute to community healing?',
      'What would a truly healed community look like to you?'
    ],
    culturalWisdom: 'Ubuntu teaches us that we heal in relationship. Your healing serves the liberation of your community, and community healing supports your individual journey.',
    safetyConsiderations: [
      'Create clear boundaries about sharing personal trauma',
      'Focus on hope and collective possibility',
      'Provide multiple ways to participate (speaking, listening, art, movement)'
    ],
    followUpActions: [
      'Participate in community healing practices (meditation, art, movement)',
      'Learn about healing justice movements',
      'Offer care to someone in your community'
    ],
    adaptations: {
      neurodivergent: 'Provide sensory regulation tools and flexible participation options',
      traumaSurvivors: 'Emphasize safety, consent, and personal agency in healing',
      emergingEnglish: 'Honor healing practices from students\' cultures of origin'
    }
  },

  {
    id: 'intergenerational-wisdom-exchange',
    title: 'Intergenerational Wisdom Exchange',
    category: 'community_healing',
    focusArea: 'cultural_wisdom',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: 'ongoing',
    traumaInformed: true,
    prompt: 'Each generation carries unique wisdom shaped by their historical moment. What wisdom do you want to receive from elders, and what wisdom do you have to offer?',
    guidingQuestions: [
      'What questions do you have for people from older generations?',
      'What unique perspective does your generation bring?',
      'How have different generations faced challenges and created change?',
      'What would you want older and younger people to understand about your experience?'
    ],
    safetyConsiderations: [
      'Honor complexity in intergenerational relationships',
      'Acknowledge generational trauma while focusing on strength',
      'Create opportunities for authentic exchange rather than tokenism'
    ],
    followUpActions: [
      'Facilitate an intergenerational conversation in your community',
      'Document stories from elders in your life',
      'Share your perspective with younger or older community members'
    ],
    adaptations: {
      neurodivergent: 'Offer multiple communication methods and processing time',
      traumaSurvivors: 'Allow choice in which relationships to engage',
      emergingEnglish: 'Support multilingual storytelling and translation'
    }
  }
];

// ===== ACTION REFLECTION ACTIVITIES =====

export const ACTION_REFLECTION_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'youth-led-change-analysis',
    title: 'Youth-Led Change Movement Analysis',
    category: 'action_reflection',
    focusArea: 'future_visioning',
    culturalContext: 'universal',
    gradeLevel: 'middle',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'Young people have always been catalysts for social change. What movements led by young people inspire you, and what change do you want to help create?',
    guidingQuestions: [
      'What social justice movements led by young people do you know about?',
      'What strategies have young activists used to create change?',
      'What issues in your community or world concern you most?',
      'What small action could you take to move toward the change you want to see?'
    ],
    culturalWisdom: 'Throughout history, young people have been the conscience of their societies, refusing to accept injustice as normal.',
    safetyConsiderations: [
      'Focus on age-appropriate actions and advocacy',
      'Emphasize safety in activism and community organizing',
      'Support various forms of contribution, not just protest'
    ],
    followUpActions: [
      'Research a young activist whose work inspires you',
      'Identify one concrete action you can take in your community',
      'Connect with youth-led organizations working on issues you care about'
    ],
    adaptations: {
      neurodivergent: 'Provide examples of diverse forms of activism and contribution',
      traumaSurvivors: 'Emphasize healing-centered and sustainable approaches to activism',
      emergingEnglish: 'Include global examples of youth-led movements'
    }
  },

  {
    id: 'personal-activism-reflection',
    title: 'Personal Activism Reflection',
    category: 'action_reflection',
    focusArea: 'personal_power',
    culturalContext: 'universal',
    gradeLevel: 'high_school',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'Activism takes many forms - from individual choices to collective action. How do you currently practice your values, and how might you expand your impact?',
    guidingQuestions: [
      'What values guide your daily choices?',
      'How do you already practice activism in your life?',
      'What barriers or challenges do you face in living your values?',
      'What would feel like authentic next steps for you?'
    ],
    safetyConsiderations: [
      'Honor different levels of risk tolerance and capacity',
      'Validate various forms of resistance and activism',
      'Acknowledge systemic constraints on individual action'
    ],
    followUpActions: [
      'Choose one daily practice that aligns with your values',
      'Connect your personal interests to social justice issues',
      'Find one way to amplify voices of people directly affected by issues you care about'
    ],
    adaptations: {
      neurodivergent: 'Support different forms of advocacy that match individual strengths',
      traumaSurvivors: 'Focus on agency and choice in level of engagement',
      emergingEnglish: 'Honor activism practices from students\' cultures of origin'
    }
  }
];

// ===== CULTURAL RECLAMATION ACTIVITIES =====

export const CULTURAL_RECLAMATION_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'indigenous-land-acknowledgment',
    title: 'Land and Water Acknowledgment Practice',
    category: 'cultural_reclamation',
    focusArea: 'historical_awareness',
    culturalContext: 'indigenous',
    gradeLevel: 'all_ages',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'The land and water you live on have stories and original caretakers. How can you deepen your relationship with this place and honor Indigenous sovereignty?',
    guidingQuestions: [
      'Whose ancestral lands do you live, learn, and play on?',
      'What is the history of Indigenous peoples in your area?',
      'How can you support Indigenous sovereignty and rights?',
      'What does it mean to be a respectful guest on Indigenous land?'
    ],
    culturalWisdom: 'Land acknowledgment is not just words - it\'s the beginning of a relationship of accountability and support for Indigenous peoples.',
    safetyConsiderations: [
      'Ensure accuracy in tribal nation names and territories',
      'Move beyond performative acknowledgment to actionable solidarity',
      'Support Indigenous-led educational initiatives'
    ],
    followUpActions: [
      'Learn about Indigenous nations in your area from Indigenous sources',
      'Support Indigenous-led environmental and sovereignty campaigns',
      'Pay the Indigenous-led "Honor Tax" or similar land-based reparations'
    ],
    adaptations: {
      neurodivergent: 'Include sensory connection to land and place-based learning',
      traumaSurvivors: 'Acknowledge trauma from colonization while focusing on resilience',
      emergingEnglish: 'Include information about Indigenous peoples in students\' countries of origin'
    }
  },

  {
    id: 'language-liberation-practice',
    title: 'Language Liberation Practice',
    category: 'cultural_reclamation',
    focusArea: 'cultural_wisdom',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'Language carries culture, resistance, and power. How can you honor and reclaim the languages that connect you to your roots and communities?',
    guidingQuestions: [
      'What languages do you speak, understand, or want to learn?',
      'What stories do you know about language in your family or community?',
      'How has language been used as a tool of oppression or liberation?',
      'How can you celebrate and preserve linguistic diversity?'
    ],
    culturalWisdom: 'Every language carries unique ways of understanding the world. Multilingualism is a superpower that connects us across cultures and histories.',
    safetyConsiderations: [
      'Honor complex relationships with heritage languages',
      'Address shame around accents or non-native English speaking',
      'Celebrate all forms of communication, including ASL and alternative communication'
    ],
    followUpActions: [
      'Learn a phrase in a heritage language or language of solidarity',
      'Support community language preservation efforts',
      'Challenge English-only policies in your school or community'
    ],
    adaptations: {
      neurodivergent: 'Honor all forms of communication and language processing',
      traumaSurvivors: 'Acknowledge language-based trauma while celebrating linguistic identity',
      emergingEnglish: 'Center multilingualism as strength rather than deficit'
    }
  }
];

// ===== RESISTANCE CELEBRATION ACTIVITIES =====

export const RESISTANCE_CELEBRATION_ACTIVITIES: SocialJusticeActivity[] = [
  {
    id: 'everyday-resistance-recognition',
    title: 'Everyday Resistance Recognition',
    category: 'resistance_celebration',
    focusArea: 'personal_power',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: '15_minutes',
    traumaInformed: true,
    prompt: 'Resistance isn\'t always loud or dramatic. How do you and people in your community resist oppression through daily choices, cultural practices, and ways of being?',
    guidingQuestions: [
      'What are subtle ways you resist negative messages about your identities?',
      'How do cultural practices in your community serve as forms of resistance?',
      'What daily choices help you maintain your authenticity?',
      'How do you support others in resisting harmful systems or messages?'
    ],
    culturalWisdom: 'Joy, celebration, cultural practice, and self-love are all forms of resistance against systems that seek to diminish your humanity.',
    safetyConsiderations: [
      'Validate both visible and invisible forms of resistance',
      'Honor survival strategies without romanticizing struggle',
      'Celebrate resilience without minimizing injustice'
    ],
    followUpActions: [
      'Document resistance practices in your community',
      'Support businesses or initiatives that represent your values',
      'Practice one form of cultural celebration or self-affirmation'
    ],
    adaptations: {
      neurodivergent: 'Honor neurodivergent ways of being as resistance to neurotypical supremacy',
      traumaSurvivors: 'Recognize healing and boundary-setting as forms of resistance',
      emergingEnglish: 'Celebrate maintaining cultural practices as resistance to assimilation'
    }
  },

  {
    id: 'liberation-dreaming-session',
    title: 'Liberation Dreaming Session',
    category: 'resistance_celebration',
    focusArea: 'future_visioning',
    culturalContext: 'universal',
    gradeLevel: 'all_ages',
    timeRequired: '30_minutes',
    traumaInformed: true,
    prompt: 'Imagination is a tool of liberation. What would your community, your school, and your world look like if they were truly just and free?',
    guidingQuestions: [
      'What would change if all people were truly valued and free?',
      'How would systems like education, healthcare, and justice work differently?',
      'What would you do with your time and energy in a liberated world?',
      'What values would guide decision-making in your ideal community?'
    ],
    culturalWisdom: 'We cannot create what we cannot imagine. Dreaming of liberation is the first step toward building it.',
    safetyConsiderations: [
      'Focus on possibility rather than current limitations',
      'Honor diverse visions of liberation',
      'Ground dreams in collective values rather than individual gain'
    ],
    followUpActions: [
      'Share your vision with others and listen to theirs',
      'Identify one element of your vision you could help create now',
      'Connect with organizations working toward similar visions'
    ],
    adaptations: {
      neurodivergent: 'Use diverse creative modalities for expression (visual, movement, music)',
      traumaSurvivors: 'Focus on safety and healing as foundational to liberation',
      emergingEnglish: 'Encourage dreaming in native languages and cross-cultural vision sharing'
    }
  }
];

// ===== CULTURAL CONTEXT ADAPTATIONS =====

export const CULTURAL_ADAPTATIONS = {
  indigenous: {
    frameShift: 'Center relationship to land, sovereignty, and seven-generation thinking',
    additionalWisdom: 'Indigenous resistance has preserved ways of knowing that can heal the earth and humanity',
    culturalPractices: ['Land-based reflection', 'Circle sharing', 'Seasonal ceremony acknowledgment']
  },
  
  african_diaspora: {
    frameShift: 'Center collective liberation, Ubuntu philosophy, and ancestral wisdom',
    additionalWisdom: 'The African diaspora carries traditions of resistance, creativity, and community that have survived across continents',
    culturalPractices: ['Call and response reflection', 'Praise and celebration', 'Storytelling circles']
  },
  
  latino_hispanic: {
    frameShift: 'Center familia, corazón wisdom, and intersectional solidarity across borders',
    additionalWisdom: 'Latino communities embody resilience through migration, bilingualism, and maintaining cultural practices',
    culturalPractices: ['Testimonio sharing', 'Community celebration', 'Bilingual expression']
  },
  
  asian_pacific: {
    frameShift: 'Center collective harmony, intergenerational wisdom, and model minority myth resistance',
    additionalWisdom: 'Asian Pacific communities navigate complex relationships between tradition and assimilation, collectivism and individual expression',
    culturalPractices: ['Silent reflection', 'Calligraphy meditation', 'Tea ceremony mindfulness']
  },
  
  lgbtq_plus: {
    frameShift: 'Center chosen family, authentic self-expression, and intersectional solidarity',
    additionalWisdom: 'LGBTQ+ communities create families of choice and show the world the beauty of diverse expressions of love and identity',
    culturalPractices: ['Name and pronoun honoring', 'Pride celebration', 'Ally building']
  },
  
  disability_justice: {
    frameShift: 'Center access, interdependence, and disabled wisdom as community strength',
    additionalWisdom: 'Disability justice teaches us that our differences are not deficits but sources of knowledge and community resilience',
    culturalPractices: ['Access checking', 'Spoon theory reflection', 'Community care planning']
  }
};

// ===== ACTIVITY SELECTOR AND SAFETY FRAMEWORK =====

export class SocialJusticeActivitySelector {
  
  static selectActivity(
    focusArea: string,
    gradeLevel: string,
    timeAvailable: string,
    culturalContext: string = 'universal'
  ): SocialJusticeActivity | null {
    
    const allActivities = [
      ...IDENTITY_AFFIRMATION_ACTIVITIES,
      ...SYSTEMIC_AWARENESS_ACTIVITIES,
      ...COMMUNITY_HEALING_ACTIVITIES,
      ...ACTION_REFLECTION_ACTIVITIES,
      ...CULTURAL_RECLAMATION_ACTIVITIES,
      ...RESISTANCE_CELEBRATION_ACTIVITIES
    ];
    
    const filteredActivities = allActivities.filter(activity => {
      const gradeMatch = activity.gradeLevel === gradeLevel || activity.gradeLevel === 'all_ages';
      const timeMatch = this.timeMatches(activity.timeRequired, timeAvailable);
      const cultureMatch = activity.culturalContext === culturalContext || activity.culturalContext === 'universal';
      const focusMatch = activity.focusArea === focusArea;
      
      return gradeMatch && timeMatch && cultureMatch && focusMatch;
    });
    
    if (filteredActivities.length === 0) return null;
    
    return filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
  }
  
  private static timeMatches(required: string, available: string): boolean {
    const timeOrder = ['5_minutes', '15_minutes', '30_minutes', 'ongoing'];
    const requiredIndex = timeOrder.indexOf(required);
    const availableIndex = timeOrder.indexOf(available);
    
    return requiredIndex <= availableIndex;
  }
  
  static validateTraumaInformed(activity: SocialJusticeActivity): boolean {
    return activity.traumaInformed && 
           activity.safetyConsiderations.length > 0 &&
           activity.adaptations.traumaSurvivors.length > 0;
  }
  
  static getCulturalAdaptation(activity: SocialJusticeActivity, culturalContext: string): any {
    const adaptation = CULTURAL_ADAPTATIONS[culturalContext as keyof typeof CULTURAL_ADAPTATIONS];
    
    if (!adaptation) return null;
    
    return {
      ...activity,
      culturalWisdom: `${activity.culturalWisdom} ${adaptation.additionalWisdom}`,
      prompt: `${adaptation.frameShift}: ${activity.prompt}`,
      additionalPractices: adaptation.culturalPractices
    };
  }
}

// ===== SAFETY AND ETHICS FRAMEWORK =====

export const SOCIAL_JUSTICE_ETHICS = {
  coreValues: [
    'Nothing about us without us - center directly impacted voices',
    'Trauma-informed approach that doesn\'t retraumatize',
    'Intersectional analysis that honors complexity',
    'Action-oriented reflection that builds agency',
    'Culturally responsive practices that honor different ways of knowing',
    'Youth voice and leadership development'
  ],
  
  preventingHarm: [
    'Avoid deficit-based language about communities',
    'Don\'t center guilt or shame as motivators',
    'Prevent saviorism and charity mindset',
    'Avoid tokenizing individual stories',
    'Don\'t appropriate closed cultural practices',
    'Respect privacy and consent in sharing'
  ],
  
  buildingPower: [
    'Develop critical thinking and analysis skills',
    'Build collective identity and solidarity',
    'Practice authentic allyship and accompliceship',
    'Strengthen cultural identity and pride',
    'Create opportunities for youth leadership',
    'Connect to broader movements for justice'
  ]
};

// ===== EXPORTS =====

export {
  IDENTITY_AFFIRMATION_ACTIVITIES,
  SYSTEMIC_AWARENESS_ACTIVITIES,
  COMMUNITY_HEALING_ACTIVITIES,
  ACTION_REFLECTION_ACTIVITIES,
  CULTURAL_RECLAMATION_ACTIVITIES,
  RESISTANCE_CELEBRATION_ACTIVITIES,
  SocialJusticeActivitySelector,
  SOCIAL_JUSTICE_ETHICS
};