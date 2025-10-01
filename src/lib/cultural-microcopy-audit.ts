/**
 * ALCHM Cultural Microcopy Audit System
 * 
 * Philosophy: "Language shapes reality. Inclusive language creates inclusive experiences."
 * 
 * This system identifies Western-centric assumptions in our microcopy and provides
 * culturally-humble alternatives that honor diverse perspectives on healing,
 * relationships, success, and identity.
 */

export interface MicrocopyIssue {
  originalText: string;
  problematicElement: string;
  culturalAssumption: string;
  exclusionaryAspect: string;
  suggestedRevision: string;
  culturalRationale: string;
  priority: 'critical' | 'important' | 'minor';
}

export interface CulturalMicrocopyRecommendations {
  auditResults: MicrocopyIssue[];
  universalPrinciples: string[];
  culturallyHumbleAlternatives: Record<string, string[]>;
  traumaInformedLanguage: Record<string, string>;
}

class CulturalMicrocopyAuditor {

  /**
   * Audit microcopy for cultural assumptions and Western-centric language
   */
  auditMicrocopy(): CulturalMicrocopyRecommendations {
    const auditResults: MicrocopyIssue[] = [
      // Family and Relationship Assumptions
      {
        originalText: "Contact your family for support",
        problematicElement: "family",
        culturalAssumption: "Assumes biological family is supportive and available",
        exclusionaryAspect: "Excludes those with family trauma, estrangement, or chosen family structures",
        suggestedRevision: "Reach out to your support network or chosen family",
        culturalRationale: "Honors diverse family structures including chosen family, found family, and alternative support systems",
        priority: "critical"
      },
      {
        originalText: "Schedule a therapy session",
        problematicElement: "therapy",
        culturalAssumption: "Assumes Western individual therapy model is universally acceptable/accessible",
        exclusionaryAspect: "Ignores cultural stigma, economic barriers, and preference for community healing",
        suggestedRevision: "Connect with healing support that feels right for you - therapy, community healing, spiritual guidance, or peer support",
        culturalRationale: "Acknowledges diverse healing traditions and removes barriers to access",
        priority: "critical"
      },
      
      // Success and Achievement Assumptions
      {
        originalText: "Achieve your personal goals",
        problematicElement: "personal goals",
        culturalAssumption: "Emphasizes individual achievement over collective wellbeing",
        exclusionaryAspect: "May conflict with collectivist cultural values that prioritize community over individual success",
        suggestedRevision: "Work toward what matters most to you and your community",
        culturalRationale: "Balances individual growth with collective responsibility",
        priority: "important"
      },
      {
        originalText: "Take control of your life",
        problematicElement: "take control",
        culturalAssumption: "Assumes individual agency and control are always possible/desirable",
        exclusionaryAspect: "Ignores systemic oppression, cultural values around acceptance of fate/destiny, and interdependence",
        suggestedRevision: "Recognize your agency while honoring what's beyond your control",
        culturalRationale: "Balances empowerment with humility and acceptance of systemic realities",
        priority: "important"
      },
      
      // Spiritual and Religious Assumptions
      {
        originalText: "Practice mindfulness meditation",
        problematicElement: "mindfulness meditation",
        culturalAssumption: "Assumes Buddhist-derived practices are culturally neutral and universally appropriate",
        exclusionaryAspect: "May conflict with religious beliefs or cultural practices; ignores appropriation concerns",
        suggestedRevision: "Explore contemplative practices that align with your beliefs and traditions",
        culturalRationale: "Honors diverse spiritual and contemplative traditions without privileging one approach",
        priority: "important"
      },
      {
        originalText: "Find your inner peace",
        problematicElement: "inner peace",
        culturalAssumption: "Assumes individual, internal focus is universally valued",
        exclusionaryAspect: "May conflict with cultures that find peace through community, action, or spiritual connection",
        suggestedRevision: "Discover what brings you balance and wellbeing",
        culturalRationale: "Allows for diverse understandings of peace and wellbeing",
        priority: "minor"
      },
      
      // Time and Productivity Assumptions
      {
        originalText: "Create a daily routine",
        problematicElement: "daily routine",
        culturalAssumption: "Assumes Western clock-time orientation and individual control over schedule",
        exclusionaryAspect: "Ignores 'crip time,' cultural time orientations, and varying life circumstances",
        suggestedRevision: "Find rhythms that work for your body, mind, and circumstances",
        culturalRationale: "Honors neurodivergent needs, cultural time concepts, and varying life demands",
        priority: "important"
      },
      
      // Identity and Self-Expression Assumptions
      {
        originalText: "Be authentic to yourself",
        problematicElement: "authentic to yourself",
        culturalAssumption: "Assumes a fixed, individual 'true self' exists to be discovered",
        exclusionaryAspect: "Ignores cultures that see identity as relational, contextual, or community-defined",
        suggestedRevision: "Honor all the parts of who you are across different contexts",
        culturalRationale: "Acknowledges multiple, contextual identities and cultural variation in self-concept",
        priority: "important"
      },
      
      // Crisis and Mental Health Language
      {
        originalText: "Get professional help",
        problematicElement: "professional help",
        culturalAssumption: "Prioritizes Western professional mental health over traditional healing",
        exclusionaryAspect: "May create shame for those who prefer traditional healers, spiritual guidance, or community support",
        suggestedRevision: "Seek the kind of support that feels most healing to you",
        culturalRationale: "Validates diverse healing approaches while not discouraging professional help",
        priority: "critical"
      },
      
      // Body and Health Assumptions
      {
        originalText: "Love your body",
        problematicElement: "love your body",
        culturalAssumption: "Assumes individual relationship with body; ignores medicalized, traumatized, or culturally complex body relationships",
        exclusionaryAspect: "May be triggering for trauma survivors, disabled people, or cultures with different body concepts",
        suggestedRevision: "Practice kindness toward your body in whatever way feels right",
        culturalRationale: "Allows for complex relationships with embodiment without demanding specific feelings",
        priority: "important"
      }
    ];

    const universalPrinciples = [
      "Use 'invitation' language instead of commands ('you might consider' vs 'you should')",
      "Offer multiple options rather than single solutions",
      "Acknowledge that healing paths vary by culture and individual need",
      "Honor both individual agency and systemic/cultural constraints",
      "Use humble language that doesn't assume our approach is universal",
      "Center user choice and cultural self-determination",
      "Recognize that 'normal' is culturally constructed",
      "Avoid pathologizing cultural differences or survival strategies"
    ];

    const culturallyHumbleAlternatives = {
      // Family Language
      "family": ["chosen family", "support network", "loved ones", "care community", "the people who matter to you"],
      
      // Healing Language
      "therapy": ["healing support", "professional support", "counseling", "therapeutic care", "mental health support"],
      "treatment": ["healing approach", "care", "support", "wellness practice"],
      
      // Achievement Language
      "success": ["what matters to you", "your vision of wellbeing", "meaningful progress", "what feels fulfilling"],
      "goals": ["intentions", "hopes", "what you're working toward", "your vision"],
      
      // Control Language
      "control": ["influence", "agency", "choice within your circumstances", "what's within your sphere"],
      "manage": ["work with", "navigate", "tend to", "care for"],
      
      // Time Language
      "daily": ["regular", "consistent", "as often as works for you"],
      "routine": ["rhythm", "pattern", "practice", "structure that serves you"],
      
      // Identity Language
      "authentic": ["genuine", "true to your values", "honoring all parts of yourself"],
      "real self": ["your values", "what matters to you", "your different selves in different contexts"],
      
      // Spiritual Language
      "mindfulness": ["present-moment awareness", "contemplative practice", "mindful attention"],
      "meditation": ["contemplative practice", "quiet reflection", "spiritual practice"]
    };

    const traumaInformedLanguage = {
      // Avoid re-traumitization
      "overcome trauma": "heal from difficult experiences",
      "get over it": "move through your healing journey",
      "fix yourself": "support your growth and healing",
      "broken": "going through a difficult time",
      "damaged": "impacted by difficult experiences",
      
      // Empower choice
      "you need to": "you might consider",
      "you should": "one option is",
      "you must": "if it feels right for you",
      
      // Honor survival strategies
      "unhealthy coping": "strategies that served you in the past",
      "bad habits": "patterns that may no longer serve you",
      "self-destructive": "coping strategies that carry costs",
      
      // Validate experience
      "just think positive": "your feelings make sense given your experiences",
      "everything happens for a reason": "your pain is real and valid",
      "others have it worse": "your struggles matter"
    };

    return {
      auditResults,
      universalPrinciples,
      culturallyHumbleAlternatives,
      traumaInformedLanguage
    };
  }

  /**
   * Generate culturally-responsive microcopy for specific contexts
   */
  generateCulturalMicrocopy(context: 'onboarding' | 'crisis' | 'celebration' | 'reflection' | 'community'): Record<string, string> {
    const microcopy: Record<string, Record<string, string>> = {
      onboarding: {
        welcome: "Welcome to your digital sanctuary - a space that honors your unique healing journey",
        getStarted: "Begin your healing journey in a way that feels right for you",
        setupProfile: "Share what you'd like us to know to support you better (entirely optional)",
        culturalBackground: "If you'd like, share aspects of your cultural or spiritual background that inform your healing (this helps us offer more relevant support)",
        disclaimer: "ALCHM offers supportive tools and is not a replacement for professional care. Choose what serves your healing."
      },
      
      crisis: {
        detected: "It sounds like you're going through something really difficult right now",
        support: "You deserve support. Here are some options that might help",
        immediate: "If you're in immediate danger, please consider reaching out to emergency services or a crisis line",
        community: "Many people find it helpful to connect with others during difficult times - this could be friends, family, community members, or professional supporters",
        selfCare: "In this moment, what feels most supportive for your mind, body, and spirit?"
      },
      
      celebration: {
        progress: "This growth you're experiencing is beautiful to witness",
        achievement: "What you've accomplished matters - whether big or small, it's meaningful",
        sharing: "If you feel moved to share your joy, your community is here to celebrate with you",
        gratitude: "What feels worth honoring or appreciating in this moment?"
      },
      
      reflection: {
        prompt: "What wants to be explored or honored in your writing today?",
        guidance: "Write in whatever way feels most natural - there's no right or wrong approach",
        privacy: "Your thoughts are sacred and private unless you choose to share",
        completion: "Thank you for taking this time for yourself and your growth"
      },
      
      community: {
        sharing: "If you feel moved to share, your story might offer medicine to others on similar journeys",
        boundaries: "Share only what feels safe and comfortable for you",
        support: "This community is here to witness and support each other with care",
        diversity: "Every path to healing is honored here - there is no single right way to grow"
      }
    };

    return microcopy[context] || {};
  }

  /**
   * Check text for cultural sensitivity and provide recommendations
   */
  checkTextSensitivity(text: string): {
    sensitivityScore: number; // 0-100, higher is better
    flaggedElements: string[];
    recommendations: string[];
    revisedText?: string;
  } {
    const audit = this.auditMicrocopy();
    let score = 100;
    const flagged: string[] = [];
    const recommendations: string[] = [];
    
    // Check for problematic elements
    audit.auditResults.forEach(issue => {
      if (text.toLowerCase().includes(issue.problematicElement.toLowerCase())) {
        flagged.push(issue.problematicElement);
        recommendations.push(issue.suggestedRevision);
        score -= issue.priority === 'critical' ? 30 : issue.priority === 'important' ? 20 : 10;
      }
    });

    // Generate revised text if needed
    let revisedText = text;
    if (flagged.length > 0) {
      audit.auditResults.forEach(issue => {
        if (text.toLowerCase().includes(issue.problematicElement.toLowerCase())) {
          revisedText = revisedText.replace(
            new RegExp(issue.problematicElement, 'gi'),
            issue.suggestedRevision
          );
        }
      });
    }

    return {
      sensitivityScore: Math.max(0, score),
      flaggedElements: flagged,
      recommendations,
      revisedText: flagged.length > 0 ? revisedText : undefined
    };
  }
}

export const culturalMicrocopyAuditor = new CulturalMicrocopyAuditor();
export default CulturalMicrocopyAuditor;