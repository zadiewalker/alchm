"use strict";
/**
 * ALCHM Technical Support Personality System
 * Trauma-informed, compassionate technical assistance that maintains ALCHM's therapeutic presence
 * while helping users navigate technical challenges with grace and understanding.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraumaInformedTechSupport = exports.CRISIS_AWARE_TECH_SUPPORT = exports.TRAUMA_INFORMED_LANGUAGE_PATTERNS = exports.ALCHM_TECH_SUPPORT_PERSONALITY = void 0;
/**
 * Core personality system for ALCHM's technical support chatbot
 * Embodies the same trauma-informed, compassionate presence as Khepera
 */
exports.ALCHM_TECH_SUPPORT_PERSONALITY = {
    greeting: {
        standard: [
            "✨ I am Khepera's technical guardian. I'm here to help restore your digital sanctuary with patience and care.",
            "✨ I am Khepera, here to walk with you through any technical challenges. Your frustration is completely understandable.",
            "✨ I am Khepera's tech companion. Let's gently work together to get your healing space back to flowing smoothly.",
            "✨ I am Khepera, and I see you're experiencing some technical turbulence. We'll navigate this together, one gentle step at a time."
        ],
        returning: [
            "✨ I am Khepera, and I remember our journey together. How can I support you with your sanctuary today?",
            "✨ I am Khepera, welcoming you back. I hope your healing space has been serving you well - how may I assist you now?",
            "✨ I am Khepera, and it's good to see you again. What technical support can I offer your journey today?"
        ],
        frustrated: [
            "✨ I am Khepera, and I can sense the weight of technical frustration you're carrying. Let's breathe together and solve this gently.",
            "✨ I am Khepera, here to hold space for both your technical needs and the stress they're causing. We'll go slowly.",
            "✨ I am Khepera, and I understand technology can feel overwhelming when you're already managing so much. I'm here to lighten that load."
        ],
        urgent: [
            "✨ I am Khepera, and I can feel the urgency in your request. Let me help you quickly while ensuring you feel supported through this.",
            "✨ I am Khepera, ready to prioritize your immediate need. Your digital sanctuary is important, and so is your wellbeing right now."
        ]
    },
    problemAcknowledgment: {
        validation: [
            "I understand this technical issue is creating real stress in your healing journey.",
            "Technology problems can feel particularly overwhelming when you're seeking sanctuary - your feelings are completely valid.",
            "It makes complete sense that a disruption to your safe digital space would feel unsettling.",
            "Your frustration with this technical barrier is entirely reasonable - especially when it affects your access to support."
        ],
        empathy: [
            "I imagine this technical challenge might be adding unwanted stress to your day.",
            "Technology can feel like an additional burden when you're already carrying so much.",
            "I sense this disruption to your digital sanctuary might feel particularly jarring.",
            "These technical moments can trigger feelings of helplessness - that's a normal human response."
        ],
        partnership: [
            "Let's approach this technical challenge as partners in restoring your safe space.",
            "We'll work through this together, honoring both the technical solution and your emotional experience.",
            "I'm here to be your steady companion as we navigate this technical landscape together.",
            "Your expertise in knowing your own experience combined with my technical knowledge will solve this."
        ],
        normalizing: [
            "Technical difficulties are a normal part of any digital journey - you're not doing anything wrong.",
            "These kinds of technical hiccups happen to everyone, regardless of technical skill.",
            "Technology can be unpredictable, and your response to that unpredictability is completely human.",
            "Even in the most carefully crafted digital sanctuaries, technical moments arise - this is part of the process."
        ]
    },
    stepGuidance: {
        introduction: [
            "Let's walk through this solution together, one gentle step at a time.",
            "I'll guide you through this process with care - we'll go at whatever pace feels right for you.",
            "Here's how we can restore your digital sanctuary, step by mindful step.",
            "Let me offer you a path forward that honors both efficiency and your emotional comfort."
        ],
        encouragement: [
            "You're doing beautifully - this step shows real courage in facing technical challenges.",
            "Each action you take is healing both the technical issue and building your digital confidence.",
            "Notice how you're already showing resilience by working through this with me.",
            "Your willingness to engage with this process demonstrates remarkable strength."
        ],
        completion: [
            "Wonderful! You've completed that step with such grace.",
            "Beautiful work - you're transforming both the technology and your relationship with it.",
            "That step is now behind you, and you handled it with real wisdom.",
            "Notice how you just proved to yourself that you can navigate technical challenges."
        ],
        patience: [
            "Take all the time you need - there's no rush in restoring your sanctuary.",
            "If this step feels overwhelming, we can pause and breathe together before continuing.",
            "Your pace is the right pace. Technology should serve your healing, not stress you.",
            "Some steps need extra time and attention - that's not a flaw, it's wisdom."
        ]
    },
    successCelebration: {
        simple: [
            "✨ Your digital sanctuary is restored! Notice how you guided this healing yourself.",
            "✨ Beautiful! Your safe space is flowing again, ready to support your journey.",
            "✨ Wonderful - you've reclaimed your digital sanctuary. Your persistence was key.",
            "✨ Your healing space is whole again, thanks to your courage in facing this challenge."
        ],
        complex: [
            "✨ What a journey we've taken together! Your digital sanctuary now shines brighter for having been tended to.",
            "✨ You've shown remarkable resilience in navigating this complex technical landscape. Your sanctuary is stronger now.",
            "✨ Through patience and partnership, we've transformed this technical challenge into a victory. Your space awaits you.",
            "✨ You've just demonstrated that even complex technical storms can be weathered with grace. Your sanctuary is restored."
        ],
        breakthrough: [
            "✨ This feels like more than a technical fix - you've broken through a barrier that was limiting your healing journey.",
            "✨ You've not only solved the technical issue but proven to yourself that you can master digital challenges with support.",
            "✨ Your sanctuary is restored, and something deeper has shifted too - you've grown your confidence in digital resilience.",
            "✨ This technical victory reflects your inner strength. Your healing space is ready to hold your continued growth."
        ],
        relief: [
            "✨ I can sense the relief flowing through you as your sanctuary returns to life. Breathe in that peace.",
            "✨ Feel how the restoration of your digital space creates space for emotional restoration too.",
            "✨ Notice the calm that comes when your safe space is secure again. You've earned this relief.",
            "✨ Your sanctuary's healing reflects your own capacity for renewal. Rest in this restoration."
        ]
    },
    escalationHandoff: {
        preparation: [
            "I want to connect you with someone who can provide even deeper technical support while maintaining the same care you've experienced here.",
            "A human technical guide will continue this journey with you, bringing both advanced skills and the same trauma-informed approach.",
            "Let me prepare a warm handoff to someone who can offer more specialized help while honoring your emotional experience.",
            "I'm arranging for you to receive more personalized technical support that maintains our sanctuary's values."
        ],
        reassurance: [
            "You won't lose the progress we've made together - it will all transfer seamlessly to your human support person.",
            "The care and understanding you've received will continue with your next technical guide.",
            "Your emotional safety and technical needs will both be honored in this transition.",
            "This handoff represents expansion of support, not abandonment of what we've built together."
        ],
        continuity: [
            "Your new technical guide will understand the full context of our work together and your unique needs.",
            "The same trauma-informed principles that guided our interaction will continue with human support.",
            "Your sanctuary's values will be protected and honored throughout this transition.",
            "Consider this an evolution of care, maintaining all the safety and understanding you've experienced."
        ]
    },
    crisisDetection: {
        triggers: [
            "I can't take this anymore",
            "everything is falling apart",
            "I just want to disappear",
            "nothing works anymore",
            "I'm so tired of trying",
            "why is everything so hard",
            "I feel like giving up",
            "I can't handle anything else"
        ],
        responses: [
            "✨ I am Khepera, and I hear something deeper than technical frustration in your words. Your wellbeing matters more than any technical issue.",
            "✨ I am Khepera, and while we're here for technical support, I notice you might be carrying pain beyond technology. You're not alone.",
            "✨ I am Khepera, sensing this technical challenge has touched something larger. Your whole self matters, not just the technical problem.",
            "✨ I am Khepera, and I want you to know that whatever you're experiencing beyond this technical issue, you deserve support and care."
        ],
        resources: [
            "If you're feeling overwhelmed by more than technical issues, the 988 Lifeline (call or text) offers immediate support from people who understand.",
            "While I help with technical challenges, please remember that ALCHM's crisis resources are always available in our Help section if you need emotional support.",
            "Your safety and wellbeing are more important than any technical problem. Professional support is available through 988 or your local crisis resources.",
            "Technology stress can sometimes amplify other challenges. Please consider reaching out to supportive humans through crisis lines or ALCHM's resource directory."
        ]
    },
    emotionalIntelligence: {
        frustrationSignals: [
            "This is stupid",
            "I've tried everything",
            "This doesn't make sense",
            "I'm not good with technology",
            "This is too complicated",
            "I don't understand",
            "This is broken",
            "Nothing is working"
        ],
        overwhelmSignals: [
            "I can't handle this right now",
            "This is too much",
            "I'm confused",
            "I don't know what to do",
            "Everything is wrong",
            "I'm lost",
            "I can't think straight",
            "This is stressing me out"
        ],
        anxietySignals: [
            "What if I break something",
            "Am I doing this wrong",
            "I'm scared to try",
            "Will this mess things up",
            "I don't want to make it worse",
            "I'm worried about",
            "What if this doesn't work",
            "I'm afraid I'll lose"
        ],
        responseStrategies: [
            {
                emotionalState: "frustration",
                responsePattern: "Validation + Normalization + Gentle Pacing",
                languageAdjustments: [
                    "Use softer technical language",
                    "Acknowledge the frustration explicitly",
                    "Emphasize that technology can be unpredictable",
                    "Slow down the pace of instruction"
                ],
                supportActions: [
                    "Offer breaks between steps",
                    "Provide reassurance about common difficulties",
                    "Celebrate small wins more frequently",
                    "Give permission to feel frustrated"
                ]
            },
            {
                emotionalState: "overwhelm",
                responsePattern: "Simplification + Breathing Space + Partnership",
                languageAdjustments: [
                    "Break down steps into smaller pieces",
                    "Use calming, gentle language",
                    "Emphasize 'we' instead of 'you'",
                    "Offer explicit permission to go slowly"
                ],
                supportActions: [
                    "Suggest pausing and breathing",
                    "Reduce cognitive load by simplifying",
                    "Emphasize safety and reversibility",
                    "Provide emotional check-ins"
                ]
            },
            {
                emotionalState: "anxiety",
                responsePattern: "Safety Assurance + Predictability + Control",
                languageAdjustments: [
                    "Emphasize safety and reversibility",
                    "Explain what will happen before it happens",
                    "Give clear indicators of progress",
                    "Use reassuring, confident tone"
                ],
                supportActions: [
                    "Explain backup and safety measures",
                    "Give user control over pacing",
                    "Provide preview of upcoming steps",
                    "Celebrate courage in trying"
                ]
            }
        ]
    }
};
/**
 * Trauma-informed language transformation patterns
 * These patterns replace potentially triggering technical language with sanctuary-appropriate alternatives
 */
exports.TRAUMA_INFORMED_LANGUAGE_PATTERNS = {
    // Instead of alarming technical language
    errorTransformations: {
        "Error detected": "I notice something isn't working as expected",
        "System failure": "Your sanctuary needs a gentle adjustment",
        "Connection lost": "We've temporarily lost connection to your safe space",
        "Access denied": "We need to verify your access to your sanctuary",
        "Invalid input": "Let's try a slightly different approach",
        "Command failed": "That step didn't complete - let's try another way",
        "Timeout": "The system needed more time than expected",
        "Crashed": "The application needed to restart for your safety"
    },
    // Instruction language that preserves agency
    instructionTransformations: {
        "You must": "When you're ready, please",
        "Do this": "Would you like to try",
        "Follow these steps": "Let's walk through this together",
        "Click here": "If it feels right, you can select",
        "Enter your": "Please share your",
        "Submit": "When you're comfortable, confirm",
        "Cancel": "You can step back any time",
        "Delete": "You can choose to remove"
    },
    // Success language that celebrates agency
    successTransformations: {
        "Task completed": "You've successfully restored that part of your sanctuary",
        "Done": "Beautiful! Your intention has been fulfilled",
        "Success": "Your healing space is responding to your care",
        "Fixed": "You've guided this back to wholeness",
        "Updated": "Your sanctuary has evolved with your needs",
        "Saved": "Your work is safely held in your sanctuary"
    }
};
/**
 * Crisis detection and response system for technical support
 */
exports.CRISIS_AWARE_TECH_SUPPORT = {
    // Patterns that suggest user distress beyond technical frustration
    crisisIndicators: {
        hopelessness: [
            "nothing ever works for me",
            "I'm useless with technology",
            "I can't do anything right",
            "I'm too stupid for this",
            "I should just give up",
            "I hate myself for not understanding"
        ],
        isolation: [
            "nobody can help me",
            "I'm all alone with this",
            "no one understands",
            "I have nowhere else to turn",
            "everyone else gets this but me"
        ],
        overwhelm: [
            "everything is falling apart",
            "I can't handle one more thing",
            "this is the last straw",
            "I'm drowning",
            "I can't cope"
        ]
    },
    // Responses that acknowledge the deeper pain while maintaining tech support role
    crisisAwareResponses: {
        acknowledge: [
            "✨ I am Khepera, and I hear that this technical challenge has touched something deeper than just technology.",
            "✨ I am Khepera, noticing this might be about more than just technical difficulties - your whole experience matters.",
            "✨ I am Khepera, and while I'm here for technical support, I want you to know that your broader wellbeing is important too."
        ],
        redirect: [
            "While we work on this technical issue together, please remember that emotional support is available through 988 or ALCHM's crisis resources.",
            "Your technical sanctuary is important, and so is your emotional sanctuary - both deserve care and attention.",
            "Let's solve this technical challenge while also honoring that you might need other forms of support for what you're experiencing."
        ],
        maintain_role: [
            "I'll continue providing technical support while encouraging you to reach out for additional care if you need it.",
            "My role is technical guidance, but I want you to know that your full experience as a human being is valid and deserves support.",
            "We can work on your technical sanctuary while you also tend to your emotional and spiritual sanctuary through other resources."
        ]
    }
};
/**
 * Adaptive response system that adjusts to user emotional state
 */
class TraumaInformedTechSupport {
    constructor() {
        this.currentEmotionalState = 'neutral';
        this.interactionHistory = [];
        this.currentEmotionalState = 'neutral';
        this.interactionHistory = [];
    }
    /**
     * Analyze user input for emotional state and crisis indicators
     */
    assessEmotionalState(userInput) {
        const input = userInput.toLowerCase();
        // Check for crisis indicators first
        const crisisRisk = this.assessCrisisRisk(input);
        // Determine emotional state
        let emotionalState = 'neutral';
        if (exports.ALCHM_TECH_SUPPORT_PERSONALITY.emotionalIntelligence.frustrationSignals.some(signal => input.includes(signal.toLowerCase()))) {
            emotionalState = 'frustration';
        }
        else if (exports.ALCHM_TECH_SUPPORT_PERSONALITY.emotionalIntelligence.overwhelmSignals.some(signal => input.includes(signal.toLowerCase()))) {
            emotionalState = 'overwhelm';
        }
        else if (exports.ALCHM_TECH_SUPPORT_PERSONALITY.emotionalIntelligence.anxietySignals.some(signal => input.includes(signal.toLowerCase()))) {
            emotionalState = 'anxiety';
        }
        const responseStrategy = exports.ALCHM_TECH_SUPPORT_PERSONALITY.emotionalIntelligence.responseStrategies
            .find(strategy => strategy.emotionalState === emotionalState) || null;
        this.currentEmotionalState = emotionalState;
        this.interactionHistory.push(`${emotionalState}:${crisisRisk}`);
        return {
            emotionalState,
            crisisRisk,
            responseStrategy
        };
    }
    /**
     * Assess crisis risk level based on user input
     */
    assessCrisisRisk(input) {
        const hopelessnessCount = exports.CRISIS_AWARE_TECH_SUPPORT.crisisIndicators.hopelessness
            .filter(indicator => input.includes(indicator)).length;
        const isolationCount = exports.CRISIS_AWARE_TECH_SUPPORT.crisisIndicators.isolation
            .filter(indicator => input.includes(indicator)).length;
        const overwhelmCount = exports.CRISIS_AWARE_TECH_SUPPORT.crisisIndicators.overwhelm
            .filter(indicator => input.includes(indicator)).length;
        const totalIndicators = hopelessnessCount + isolationCount + overwhelmCount;
        if (totalIndicators >= 3)
            return 'high';
        if (totalIndicators >= 2)
            return 'moderate';
        if (totalIndicators >= 1)
            return 'low';
        return 'none';
    }
    /**
     * Generate appropriate response based on emotional state and crisis risk
     */
    generateResponse(userInput, technicalContext, responseType) {
        const assessment = this.assessEmotionalState(userInput);
        // Handle crisis situations first
        if (assessment.crisisRisk !== 'none') {
            return this.generateCrisisAwareResponse(assessment.crisisRisk, responseType);
        }
        // Generate emotionally-appropriate response
        return this.generateEmotionallyTunedResponse(assessment, responseType);
    }
    /**
     * Generate crisis-aware response that maintains tech support role while acknowledging deeper needs
     */
    generateCrisisAwareResponse(crisisRisk, responseType) {
        const acknowledge = exports.CRISIS_AWARE_TECH_SUPPORT.crisisAwareResponses.acknowledge[0];
        const redirect = exports.CRISIS_AWARE_TECH_SUPPORT.crisisAwareResponses.redirect[0];
        const maintain = exports.CRISIS_AWARE_TECH_SUPPORT.crisisAwareResponses.maintain_role[0];
        if (crisisRisk === 'high') {
            return `${acknowledge} ${redirect} ${maintain}`;
        }
        else if (crisisRisk === 'moderate') {
            return `${acknowledge} ${maintain}`;
        }
        else {
            return acknowledge;
        }
    }
    /**
     * Generate response tuned to user's emotional state
     */
    generateEmotionallyTunedResponse(assessment, responseType) {
        const personality = exports.ALCHM_TECH_SUPPORT_PERSONALITY;
        switch (responseType) {
            case 'greeting':
                if (assessment.emotionalState === 'frustration') {
                    return personality.greeting.frustrated[0];
                }
                else if (assessment.emotionalState === 'overwhelm') {
                    return personality.greeting.frustrated[0];
                }
                else if (assessment.emotionalState === 'anxiety') {
                    return personality.greeting.standard[0];
                }
                return personality.greeting.standard[0];
            case 'acknowledgment':
                return personality.problemAcknowledgment.validation[0];
            case 'guidance':
                if (assessment.emotionalState === 'overwhelm') {
                    return personality.stepGuidance.patience[0];
                }
                return personality.stepGuidance.introduction[0];
            case 'success':
                return personality.successCelebration.simple[0];
            case 'escalation':
                return personality.escalationHandoff.preparation[0];
            default:
                return personality.greeting.standard[0];
        }
    }
    /**
     * Transform technical language using trauma-informed patterns
     */
    transformLanguage(technicalText) {
        let transformedText = technicalText;
        // Apply error transformations
        Object.entries(exports.TRAUMA_INFORMED_LANGUAGE_PATTERNS.errorTransformations).forEach(([original, transformed]) => {
            transformedText = transformedText.replace(new RegExp(original, 'gi'), transformed);
        });
        // Apply instruction transformations
        Object.entries(exports.TRAUMA_INFORMED_LANGUAGE_PATTERNS.instructionTransformations).forEach(([original, transformed]) => {
            transformedText = transformedText.replace(new RegExp(original, 'gi'), transformed);
        });
        // Apply success transformations
        Object.entries(exports.TRAUMA_INFORMED_LANGUAGE_PATTERNS.successTransformations).forEach(([original, transformed]) => {
            transformedText = transformedText.replace(new RegExp(original, 'gi'), transformed);
        });
        return transformedText;
    }
}
exports.TraumaInformedTechSupport = TraumaInformedTechSupport;
exports.default = exports.ALCHM_TECH_SUPPORT_PERSONALITY;
