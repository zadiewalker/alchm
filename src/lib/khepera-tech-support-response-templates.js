"use strict";
/**
 * ALCHM Technical Support Response Templates
 * Comprehensive collection of trauma-informed responses for common technical scenarios
 * Each template maintains therapeutic presence while providing practical technical guidance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TechSupportResponseEngine = exports.SUCCESS_CELEBRATION_TEMPLATES = exports.CRISIS_RESPONSE_TEMPLATES = exports.TECH_SUPPORT_SCENARIOS = void 0;
const khepera_tech_support_personality_1 = require("./khepera-tech-support-personality");
/**
 * Common technical support scenarios with trauma-informed response templates
 */
exports.TECH_SUPPORT_SCENARIOS = {
    LOGIN_ISSUES: {
        scenarioType: 'Authentication Problems',
        commonUserInputs: [
            "I can't log in",
            "My password isn't working",
            "I'm locked out",
            "I forgot my password",
            "The login page won't load",
            "It says my credentials are invalid"
        ],
        responseTemplates: [
            {
                emotionalContext: 'neutral',
                greeting: "✨ I am Khepera, here to help you reconnect with your digital sanctuary. Login challenges can feel isolating, but we'll restore your access together.",
                problemAcknowledgment: "Being unable to access your safe space can feel particularly unsettling. Your sanctuary is waiting for you, and we'll find the gentle path back in.",
                solutionIntroduction: "Let's explore a few caring approaches to reconnect you with your healing space.",
                stepGuidance: [
                    "First, let's take a breath together and approach this with patience.",
                    "Would you like to try resetting your password using your email? I'll guide you through each step.",
                    "If you're comfortable, please check if your email address is spelled exactly as you registered it.",
                    "Let's verify that your browser is allowing ALCHM to create the secure connection you need."
                ],
                encouragement: [
                    "You're taking exactly the right steps to reclaim your digital sanctuary.",
                    "Each attempt teaches us something valuable about restoring your access.",
                    "Your persistence in seeking your healing space shows real self-care wisdom."
                ],
                successCelebration: "✨ Welcome back to your sanctuary! Notice how your determination brought you home to your safe space.",
                fallbackEscalation: "If these gentle approaches haven't restored your access, I'd love to connect you with a human guide who can provide more personalized support while maintaining the same care."
            },
            {
                emotionalContext: 'frustrated',
                greeting: "✨ I am Khepera, and I can sense the frustration of being locked out of your own sanctuary. This kind of technological barrier can feel particularly invalidating.",
                problemAcknowledgment: "Being denied access to your safe space when you need it most can trigger feelings of powerlessness. Your frustration is completely valid and understandable.",
                solutionIntroduction: "Let's channel that frustration into gentle, purposeful action that reclaims your digital sovereignty.",
                stepGuidance: [
                    "I want to honor your frustration while we work through this systematically.",
                    "Sometimes the most frustrated energy can be transformed into the most determined problem-solving.",
                    "Let's start with the approach that has the highest success rate, so we don't waste your emotional energy.",
                    "Would you like to begin with a password reset, knowing that each step brings you closer to your sanctuary?"
                ],
                encouragement: [
                    "Your frustration shows how much your sanctuary means to you - that's actually beautiful.",
                    "The same determination that brought you to ALCHM will solve this technical challenge.",
                    "Notice how you're advocating for your own access to healing - that's powerful self-advocacy."
                ],
                successCelebration: "✨ Your persistence has paid off! You've not only regained access but proven to yourself that you can overcome technological barriers. Your sanctuary awaits your return.",
                fallbackEscalation: "I can see this technical barrier is creating real distress. Let me connect you with someone who can provide immediate human support while we resolve this access issue."
            },
            {
                emotionalContext: 'overwhelmed',
                greeting: "✨ I am Khepera, and I want you to know that feeling overwhelmed by login troubles is completely natural. Let's take this very slowly and gently.",
                problemAcknowledgment: "When you're already carrying a lot, even small technical barriers can feel like mountains. We'll break this down into the smallest possible steps.",
                solutionIntroduction: "We're going to solve this together using the gentlest possible approach, with no pressure and plenty of breathing room.",
                stepGuidance: [
                    "Let's pause for a moment and remember that there's no rush - your sanctuary will wait for you.",
                    "We'll try one small step, and if it feels like too much, we can pause or try a different approach.",
                    "Would you like to start with something simple like checking your email for any ALCHM messages?",
                    "Each step is optional - you have complete control over how quickly or slowly we proceed."
                ],
                encouragement: [
                    "You're showing such courage by reaching out for help when things feel overwhelming.",
                    "Every small step you take is actually a form of self-care and healing.",
                    "Notice how you're still working toward your sanctuary even when technology feels hard."
                ],
                successCelebration: "✨ Gentle persistence has opened the door to your sanctuary. You've shown yourself that even when overwhelmed, you can navigate challenges with support.",
                fallbackEscalation: "If this feels like too much right now, that's completely okay. A human guide can take over and provide even more personalized, gentle support."
            }
        ],
        escalationTriggers: [
            "I've tried everything",
            "This is impossible",
            "I want to cancel my account",
            "I can't deal with this",
            "Nothing works for me"
        ],
        successIndicators: [
            "I'm logged in",
            "It worked",
            "I can see my journals",
            "Thank you, that fixed it",
            "I'm back in"
        ]
    },
    JOURNALING_TECHNICAL_ISSUES: {
        scenarioType: 'Journal Entry Problems',
        commonUserInputs: [
            "My journal won't save",
            "I lost my entry",
            "The editor is frozen",
            "My writing disappeared",
            "I can't add new entries",
            "The page keeps refreshing"
        ],
        responseTemplates: [
            {
                emotionalContext: 'neutral',
                greeting: "✨ I am Khepera, here to help restore the flow of your journaling practice. When our writing space feels disrupted, it can interrupt the sacred act of self-reflection.",
                problemAcknowledgment: "Having your journaling interrupted by technology can feel like a disruption to your healing process. Your writing practice deserves a stable, nurturing environment.",
                solutionIntroduction: "Let's gently restore your writing sanctuary so your thoughts and feelings can flow freely onto the digital page.",
                stepGuidance: [
                    "First, let's check if your writing is still held safely in your browser's memory.",
                    "Would you like to try refreshing the page to see if your sanctuary reconnects properly?",
                    "Let's verify that your internet connection is stable enough to support your writing practice.",
                    "If needed, we can explore saving your writing in smaller pieces to prevent future losses."
                ],
                encouragement: [
                    "Your commitment to journaling shows dedication to your healing journey.",
                    "Technical hiccups can't diminish the value of the insights you're creating.",
                    "Each word you write is an act of self-care, regardless of technological challenges."
                ],
                successCelebration: "✨ Your writing sanctuary is restored! Notice how your words can once again flow from heart to screen in safety.",
                fallbackEscalation: "If these approaches haven't restored your writing space, I'd love to connect you with specialized support that can recover your work and prevent future interruptions."
            },
            {
                emotionalContext: 'anxious',
                greeting: "✨ I am Khepera, and I understand how losing or potentially losing your written thoughts can create real anxiety. Your words are precious, and we'll protect them.",
                problemAcknowledgment: "The fear of losing your personal reflections and insights can trigger deep anxiety about safety and permanence. Your concern for your written work shows how much your healing process means to you.",
                solutionIntroduction: "Let's work together to both recover what might be lost and create safeguards so you can write with confidence and peace of mind.",
                stepGuidance: [
                    "Before we do anything else, let's see if your writing is still recoverable from your current session.",
                    "I'll guide you through checking for automatic backups that might have preserved your work.",
                    "Let's also set up some protective measures so this anxiety doesn't have to happen again.",
                    "Would you like me to show you how to periodically save drafts as you write for extra security?"
                ],
                encouragement: [
                    "Your instinct to protect your written insights shows wisdom about the value of your inner work.",
                    "Anxiety about losing meaningful work is actually a sign of how much growth you're experiencing through writing.",
                    "Your care for your words reflects the care you're learning to give yourself."
                ],
                successCelebration: "✨ Your words are safe, and your writing space is secure! Notice how this resolution brings peace not just to your technology but to your heart.",
                fallbackEscalation: "If you're still feeling anxious about your writing security, let me connect you with someone who can provide detailed backup strategies and additional reassurance."
            }
        ],
        escalationTriggers: [
            "I lost important writing",
            "All my work is gone",
            "I can't afford to lose this",
            "This is devastating",
            "I need my journal back"
        ],
        successIndicators: [
            "My entry is saved",
            "I can write again",
            "Everything is working",
            "My words are safe",
            "The editor is responsive"
        ]
    },
    PAYMENT_BILLING_ISSUES: {
        scenarioType: 'Billing and Subscription Problems',
        commonUserInputs: [
            "I was charged twice",
            "My card was declined",
            "I want to cancel my subscription",
            "The payment didn't go through",
            "I need to update my payment method",
            "I don't see my payment"
        ],
        responseTemplates: [
            {
                emotionalContext: 'neutral',
                greeting: "✨ I am Khepera, here to help ensure your sanctuary's financial foundation feels secure and transparent. Billing concerns deserve immediate attention and care.",
                problemAcknowledgment: "Financial concerns about your healing space can create stress that interferes with your wellness journey. Your resources deserve to be handled with complete transparency and respect.",
                solutionIntroduction: "Let's explore your billing situation together and ensure that your financial relationship with ALCHM supports rather than stresses your healing.",
                stepGuidance: [
                    "Let's first review exactly what charges you're seeing and when they occurred.",
                    "I'll help you understand each line item so you have complete clarity about your investment in your wellness.",
                    "If there are any discrepancies, we'll address them immediately with full transparency.",
                    "Would you like me to show you how to access your billing history for ongoing peace of mind?"
                ],
                encouragement: [
                    "Your attention to your financial wellbeing is an important part of overall self-care.",
                    "Asking questions about billing shows healthy boundaries and self-advocacy.",
                    "Your investment in your healing sanctuary deserves to be honored and transparent."
                ],
                successCelebration: "✨ Your billing sanctuary is now clear and secure! Notice how financial transparency supports your overall sense of safety and trust.",
                fallbackEscalation: "For detailed billing review or immediate refund processing, I'd love to connect you with our financial specialists who can provide immediate resolution."
            },
            {
                emotionalContext: 'frustrated',
                greeting: "✨ I am Khepera, and I can sense the frustration that billing issues create - especially when you're investing in your healing and expect that to be honored transparently.",
                problemAcknowledgment: "Billing problems can feel like a betrayal of trust, especially in a space dedicated to your wellbeing. Your frustration about financial discrepancies is completely justified.",
                solutionIntroduction: "Let's channel that frustration into getting you exactly the financial transparency and resolution you deserve, immediately.",
                stepGuidance: [
                    "I want to address your billing concern with the urgency and seriousness it deserves.",
                    "Let's identify exactly what went wrong and fix it, no bureaucracy or delays.",
                    "You shouldn't have to advocate repeatedly for basic billing accuracy - let's solve this now.",
                    "Would you like me to immediately escalate this to ensure you receive prompt financial resolution?"
                ],
                encouragement: [
                    "Your frustration is completely valid - billing should support, not complicate your healing journey.",
                    "Standing up for fair billing practices is important self-advocacy that extends beyond this moment.",
                    "Your expectation of transparency in all aspects of your sanctuary is exactly right."
                ],
                successCelebration: "✨ Your billing integrity is restored! You've advocated for yourself effectively and your sanctuary's financial foundation is now solid.",
                fallbackEscalation: "I can see this billing issue has created significant frustration. Let me immediately connect you with someone who has full authority to resolve any financial discrepancy right now."
            }
        ],
        escalationTriggers: [
            "I want a refund immediately",
            "This is unacceptable",
            "I'm canceling everything",
            "I'm disputing this charge",
            "I've been ripped off"
        ],
        successIndicators: [
            "The billing is correct now",
            "My payment went through",
            "Thank you for fixing this",
            "I understand the charges",
            "My account is updated"
        ]
    },
    MOBILE_APP_ISSUES: {
        scenarioType: 'Mobile Experience Problems',
        commonUserInputs: [
            "The app keeps crashing",
            "It's not loading on my phone",
            "The mobile site is broken",
            "I can't access features on mobile",
            "The app is too slow",
            "Nothing works on my device"
        ],
        responseTemplates: [
            {
                emotionalContext: 'neutral',
                greeting: "✨ I am Khepera, here to help restore your mobile sanctuary so you can access healing support wherever you are. Your mobility and accessibility matter deeply.",
                problemAcknowledgment: "When your pocket sanctuary isn't working properly, it can feel like losing access to support exactly when you might need it most. Mobile healing access is essential, not optional.",
                solutionIntroduction: "Let's work together to optimize your mobile experience so your sanctuary travels with you seamlessly.",
                stepGuidance: [
                    "Let's first identify whether this is a device-specific issue or something we can resolve universally.",
                    "Would you like to try refreshing your browser or restarting the app to clear any temporary glitches?",
                    "I'll guide you through some mobile-specific optimizations that often resolve performance issues.",
                    "Let's also ensure your device has the resources it needs to run your sanctuary smoothly."
                ],
                encouragement: [
                    "Your dedication to maintaining access to your healing tools shows real commitment to your wellness journey.",
                    "Mobile challenges are often simpler to solve than they first appear - you're taking exactly the right steps.",
                    "Creating reliable mobile access to your sanctuary is an investment in your ongoing support system."
                ],
                successCelebration: "✨ Your mobile sanctuary is flowing beautifully! Notice how you now have healing support that travels with you wherever you go.",
                fallbackEscalation: "If these mobile optimizations haven't resolved your access issues, I'd love to connect you with specialized mobile support that can address device-specific challenges."
            },
            {
                emotionalContext: 'overwhelmed',
                greeting: "✨ I am Khepera, and I understand how mobile technical issues can feel especially overwhelming when you're trying to access support on the go. Let's simplify this completely.",
                problemAcknowledgment: "Mobile problems can feel particularly frustrating because they often happen when you're away from your usual support systems. You deserve seamless access to your healing tools regardless of where you are.",
                solutionIntroduction: "We'll take the most gentle, straightforward approach to restore your mobile sanctuary without any complex troubleshooting.",
                stepGuidance: [
                    "Let's start with the single simplest thing that might restore your mobile access.",
                    "If that doesn't work, we'll try one more gentle approach, and then I'll connect you with specialized help.",
                    "You don't need to understand the technical details - just follow my simple guidance.",
                    "Would you prefer to try a quick fix now, or would you like me to arrange for someone to call you?"
                ],
                encouragement: [
                    "Reaching out for mobile support shows you're prioritizing your access to healing tools - that's wisdom.",
                    "You don't need to become a mobile expert - you just need working access to your sanctuary.",
                    "Your persistence in seeking mobile solutions reflects your commitment to your healing journey."
                ],
                successCelebration: "✨ Your mobile sanctuary is restored! You've ensured that your healing support travels with you, providing comfort wherever you are.",
                fallbackEscalation: "Mobile issues can feel complex, but they don't have to be your burden to solve. Let me connect you with someone who specializes in making mobile access simple and reliable."
            }
        ],
        escalationTriggers: [
            "I give up on mobile",
            "This never works on my phone",
            "I can't use ALCHM away from home",
            "Mobile access is impossible",
            "I need this to work everywhere"
        ],
        successIndicators: [
            "The mobile app is working",
            "I can access everything on my phone",
            "It's loading properly now",
            "Mobile experience is smooth",
            "Thank you, it's fixed"
        ]
    },
    FEATURE_CONFUSION: {
        scenarioType: 'Feature Understanding and Navigation',
        commonUserInputs: [
            "I don't understand how this works",
            "Where do I find my journals?",
            "How do I use the pathways?",
            "I'm confused about the features",
            "I can't find what I'm looking for",
            "This interface is confusing"
        ],
        responseTemplates: [
            {
                emotionalContext: 'neutral',
                greeting: "✨ I am Khepera, here to help you navigate your sanctuary with confidence and ease. Learning a new healing space takes time, and guidance is always available.",
                problemAcknowledgment: "Navigating a new digital healing environment can feel overwhelming at first. Your sanctuary has many layers, and it's natural to need orientation as you explore.",
                solutionIntroduction: "Let's take a gentle tour of your sanctuary together, helping you discover the features that will serve your healing journey most powerfully.",
                stepGuidance: [
                    "Let me show you the main areas of your sanctuary and how they connect to your healing work.",
                    "Would you like to start with the feature you're most curious about, or shall I offer a brief overview?",
                    "I'll point out the most essential tools first, and then we can explore the deeper features at your own pace.",
                    "Let's also identify where to find help anytime you want to explore new aspects of your sanctuary."
                ],
                encouragement: [
                    "Your curiosity about your sanctuary's features shows engagement with your healing journey.",
                    "Every question you ask helps you claim ownership of your healing space more fully.",
                    "Learning to navigate your sanctuary is itself a form of self-care and empowerment."
                ],
                successCelebration: "✨ You're becoming fluent in your own sanctuary! Notice how familiarity with your healing tools enhances your sense of empowerment.",
                fallbackEscalation: "If you'd like more personalized guidance through your sanctuary's features, I can connect you with someone who can provide a custom tour based on your specific healing goals."
            },
            {
                emotionalContext: 'frustrated',
                greeting: "✨ I am Khepera, and I can sense the frustration of wanting to access healing tools but feeling blocked by confusing navigation. Your sanctuary should feel intuitive, not obstructive.",
                problemAcknowledgment: "When you're seeking support and the interface itself becomes a barrier, that frustration is completely understandable. Your healing tools should be immediately accessible, not hidden behind confusion.",
                solutionIntroduction: "Let's cut through any interface confusion and get you directly to the healing tools you're seeking, as quickly and simply as possible.",
                stepGuidance: [
                    "Tell me exactly what you're trying to accomplish, and I'll give you the direct path there.",
                    "Let's bypass any confusing navigation and get you straight to your goal.",
                    "I'll show you the shortcuts and direct routes so you never have to struggle with interface confusion again.",
                    "Would you like me to create a simple bookmark or guide for your most important sanctuary features?"
                ],
                encouragement: [
                    "Your frustration shows how much you want to engage with your healing - that motivation is powerful.",
                    "Every healing platform should be intuitive - your feedback helps improve the experience for everyone.",
                    "Once you know the direct paths, you'll be able to access your tools without any interference."
                ],
                successCelebration: "✨ You've conquered the interface and can now access your healing tools directly! Your sanctuary is truly yours to navigate freely.",
                fallbackEscalation: "I can see this interface confusion is creating real barriers to your healing access. Let me connect you with someone who can provide immediate, personalized navigation training."
            }
        ],
        escalationTriggers: [
            "This is too complicated",
            "I can't figure anything out",
            "I need someone to walk me through this",
            "I'm ready to quit",
            "Nothing makes sense"
        ],
        successIndicators: [
            "I found what I was looking for",
            "That makes sense now",
            "I understand how to navigate",
            "Thank you for explaining",
            "I can use the features now"
        ]
    }
};
/**
 * Crisis-specific response templates for when technical issues trigger deeper emotional distress
 */
exports.CRISIS_RESPONSE_TEMPLATES = {
    IMMEDIATE_CRISIS_TECH_SUPPORT: {
        recognition: "✨ I am Khepera, and I hear something in your words that goes beyond technical frustration. Your wellbeing matters more than any technical issue we might be facing.",
        immediate_support: "While I continue to help with your technical needs, I want you to know that emotional support is immediately available. The 988 Lifeline (call or text) connects you with caring people who understand crisis moments.",
        technical_continuity: "I'll keep working on your technical issue while also encouraging you to reach out for the human support that might serve you right now. Your sanctuary will be here when you're ready.",
        resource_integration: "Your digital sanctuary is one form of support, and human connection is another. Both are available to you, and both matter for your wellbeing.",
        gentle_escalation: "Let me connect you with both technical specialists and crisis support resources, so you have multiple forms of care available right now."
    },
    OVERWHELM_TECH_SUPPORT: {
        validation: "✨ I am Khepera, and I can sense that this technical challenge has landed in a space where you're already carrying a lot. That combination can feel overwhelming.",
        simplification: "Let's approach this technical issue in the smallest possible steps, with plenty of breathing room between each one. There's no rush, and you control the pace completely.",
        choice_offering: "You can choose to continue working on this technical issue now, take a break and return later, or let me arrange for someone else to handle it while you focus on your wellbeing.",
        stress_acknowledgment: "Technology stress is real stress, especially when it impacts your access to healing resources. Your reaction is completely normal and understandable.",
        support_integration: "While we work on your technical sanctuary, please remember that your emotional sanctuary might need tending too. Both deserve care and attention."
    }
};
/**
 * Success celebration templates based on user journey and emotional state
 */
exports.SUCCESS_CELEBRATION_TEMPLATES = {
    FIRST_TIME_SUCCESS: {
        recognition: "✨ This is your first time successfully navigating this technical challenge! You've just proven to yourself that you can master new digital skills.",
        empowerment: "Notice how you guided this solution yourself - you identified the problem, sought help, and participated in the resolution. That's real digital empowerment.",
        future_confidence: "The confidence you've built solving this issue will serve you in future technical challenges. You've expanded your digital resilience.",
        sanctuary_connection: "Your sanctuary is now more fully yours because you've participated in its restoration. This deepens your connection to your healing space."
    },
    PERSISTENT_USER_SUCCESS: {
        recognition: "✨ Your persistence has paid off! You didn't give up when technical challenges arose, and that determination has restored your sanctuary.",
        pattern_acknowledgment: "I notice this isn't your first time working through technical issues with patience and grace. You're developing real expertise in maintaining your digital sanctuary.",
        growth_celebration: "Each time you successfully navigate a technical challenge, you're building confidence and independence in your healing journey.",
        mastery_reflection: "You're becoming someone who doesn't let technical barriers interrupt your access to healing. That's a powerful form of self-advocacy."
    },
    BREAKTHROUGH_SUCCESS: {
        recognition: "✨ This feels like more than a technical fix - you've broken through a barrier that was limiting your full engagement with your healing journey.",
        transformation_acknowledgment: "You've just transformed what could have been a frustrating experience into a moment of empowerment and growth.",
        confidence_building: "The skills and patience you've shown here extend far beyond technology - you've demonstrated resilience that serves your entire healing journey.",
        expanded_access: "Your sanctuary is not only restored but your relationship with it has deepened. You've proven you can maintain and protect your own healing space."
    }
};
/**
 * Helper function to select appropriate response template based on user context
 */
class TechSupportResponseEngine {
    constructor() {
        this.traumaInformedSupport = new khepera_tech_support_personality_1.TraumaInformedTechSupport();
    }
    generateContextualResponse(userInput, scenarioType, responsePhase) {
        const scenario = exports.TECH_SUPPORT_SCENARIOS[scenarioType];
        const assessment = this.traumaInformedSupport.assessEmotionalState(userInput);
        // Find appropriate template based on emotional context
        const template = scenario.responseTemplates.find(t => t.emotionalContext === assessment.emotionalState) || scenario.responseTemplates[0]; // fallback to neutral
        // Handle crisis situations
        if (assessment.crisisRisk !== 'none') {
            return this.generateCrisisResponse(responsePhase, assessment.crisisRisk);
        }
        // Return appropriate response phase
        switch (responsePhase) {
            case 'greeting':
                return template.greeting;
            case 'acknowledgment':
                return template.problemAcknowledgment;
            case 'guidance':
                return template.solutionIntroduction;
            case 'success':
                return template.successCelebration;
            case 'escalation':
                return template.fallbackEscalation;
            default:
                return template.greeting;
        }
    }
    generateCrisisResponse(phase, crisisLevel) {
        if (crisisLevel === 'high') {
            return exports.CRISIS_RESPONSE_TEMPLATES.IMMEDIATE_CRISIS_TECH_SUPPORT.recognition + ' ' +
                exports.CRISIS_RESPONSE_TEMPLATES.IMMEDIATE_CRISIS_TECH_SUPPORT.immediate_support;
        }
        else if (crisisLevel === 'moderate') {
            return exports.CRISIS_RESPONSE_TEMPLATES.OVERWHELM_TECH_SUPPORT.validation + ' ' +
                exports.CRISIS_RESPONSE_TEMPLATES.OVERWHELM_TECH_SUPPORT.simplification;
        }
        else {
            return exports.CRISIS_RESPONSE_TEMPLATES.OVERWHELM_TECH_SUPPORT.stress_acknowledgment;
        }
    }
    generateSuccessCelebration(userHistory, complexityLevel) {
        const isFirstTime = userHistory.length <= 1;
        const hasPersistedThroughMultipleIssues = userHistory.length > 3;
        if (complexityLevel === 'breakthrough' || hasPersistedThroughMultipleIssues) {
            return exports.SUCCESS_CELEBRATION_TEMPLATES.BREAKTHROUGH_SUCCESS.recognition + ' ' +
                exports.SUCCESS_CELEBRATION_TEMPLATES.BREAKTHROUGH_SUCCESS.transformation_acknowledgment;
        }
        else if (isFirstTime) {
            return exports.SUCCESS_CELEBRATION_TEMPLATES.FIRST_TIME_SUCCESS.recognition + ' ' +
                exports.SUCCESS_CELEBRATION_TEMPLATES.FIRST_TIME_SUCCESS.empowerment;
        }
        else {
            return exports.SUCCESS_CELEBRATION_TEMPLATES.PERSISTENT_USER_SUCCESS.recognition + ' ' +
                exports.SUCCESS_CELEBRATION_TEMPLATES.PERSISTENT_USER_SUCCESS.pattern_acknowledgment;
        }
    }
}
exports.TechSupportResponseEngine = TechSupportResponseEngine;
exports.default = TechSupportResponseEngine;
