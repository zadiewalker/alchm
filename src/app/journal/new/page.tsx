'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { checkForCrisis } from '@/lib/crisisMonitoring';
import CrisisInterventionModal from '@/components/crisis/CrisisInterventionModal';
import SafetyPlanBuilder from '@/components/crisis/SafetyPlanBuilder';
import { useData } from '@/hooks/useData';
import JournalSuccessCeremony from '@/components/JournalSuccessCeremony';
import { safeLocalStorage, safeWindow } from '@/utils/browser';

// Crisis keywords for immediate detection (client-side only)
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'better off dead',
  'self harm', 'self-harm', 'hurt myself', 'cut myself', 'harm myself',
  'no reason to live', 'can\'t go on', 'want to disappear', 'end my life',
  'overdose', 'pills', 'jump off', 'gun', 'rope', 'blade'
];

const SUPPORT_KEYWORDS = [
  'depressed', 'hopeless', 'worthless', 'alone', 'empty',
  'numb', 'lost', 'trapped', 'exhausted', 'breaking down',
  'can\'t take it', 'giving up', 'falling apart'
];

const moods = [
  'Peaceful', 'Anxious', 'Grateful', 'Sad',
  'Hopeful', 'Tired', 'Confused', 'Numb',
  'Excited', 'Lonely', 'Content', 'Overwhelmed'
];

const prompts = [
  "What am I grateful for today?",
  "How did I take care of myself?",
  "What challenged me and how did I grow?",
  "What brought me joy or peace?",
  "What do I need to let go of?",
];

// Khepera Scarab SVG Component (monochromatic, for button)
const KheperaScarab = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <circle cx="50" cy="12" r="8" fillOpacity="0.9" />
    <circle cx="50" cy="26" r="5" fillOpacity="0.85" />
    <ellipse cx="50" cy="55" rx="15" ry="23" fillOpacity="0.85" />
    <path d="M35 48 Q18 40 21 62 Q23 71 35 66 Z" fillOpacity="0.8" />
    <path d="M65 48 Q82 40 79 62 Q77 71 65 66 Z" fillOpacity="0.8" />
  </svg>
);

// Lightweight crisis detection (client-side only, no API calls)
const checkForCrisisContent = (text: string) => {
  const lower = text.toLowerCase();
  
  // Check for immediate crisis keywords
  const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword => lower.includes(keyword));
  if (hasCrisisKeywords) {
    return { level: 'critical', detected: true };
  }
  
  // Check for support keywords (softer approach)
  const supportKeywordCount = SUPPORT_KEYWORDS.filter(keyword => lower.includes(keyword)).length;
  if (supportKeywordCount >= 3) {
    return { level: 'medium', detected: true };
  } else if (supportKeywordCount >= 1) {
    return { level: 'low', detected: true };
  }
  
  return { level: 'low', detected: false };
};

export default function NewEntryPage() {
  const { saveJournalEntry } = useData();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [kheperaResponse, setKheperaResponse] = useState<any>(null);
  const [showKheperaInsights, setShowKheperaInsights] = useState(false);
  const [showSuccessCeremony, setShowSuccessCeremony] = useState(false);
  
  // Crisis monitoring state
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [crisisLevel, setCrisisLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [showSafetyPlan, setShowSafetyPlan] = useState(false);
  const [showCrisisBanner, setShowCrisisBanner] = useState(false);
  const [userId] = useState(() => {
    return safeLocalStorage.getItem('userEmail') || `user_${Date.now()}@alchmapp.com`;
  });

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const insertPrompt = (prompt: string) => {
    setContent(prev => prev + (prev ? '\n\n' : '') + prompt + '\n');
  };

  // Lightweight crisis monitoring - client-side only for instant performance
  useEffect(() => {
    if (content.trim().length > 30) { // Only check if substantial content
      const crisisResult = checkForCrisisContent(content);
      
      if (crisisResult.detected) {
        setCrisisDetected(true);
        setCrisisLevel(crisisResult.level as 'low' | 'medium' | 'high' | 'critical');
        
        if (crisisResult.level === 'critical') {
          // Immediate intervention for critical keywords
          setShowCrisisModal(true);
        } else if (crisisResult.level === 'medium') {
          // Show gentle banner for medium risk
          setShowCrisisBanner(true);
        } else if (crisisResult.level === 'low') {
          // Gentle banner for support keywords
          setShowCrisisBanner(true);
        }
      } else {
        setCrisisDetected(false);
        setShowCrisisBanner(false);
      }
    } else {
      setCrisisDetected(false);
      setShowCrisisBanner(false);
    }
  }, [content]);

  // REMOVED: saveEntryWithKhepera() function - was causing delays with Firebase calls
  // All saves now use saveEntryWithoutCrisisCheck() for instant Khepera responses

  // Fast save without crisis check to avoid Khepera delays
  const saveEntryWithoutCrisisCheck = async (kheperaResponse?: any) => {
    if (!content.trim()) return;
    
    setSaving(true);
    
    try {
      // Prepare insights from Khepera response
      const insights = [];
      if (kheperaResponse) {
        // Extract key insights from the 5-modality response
        insights.push(`Emotional Recognition: ${kheperaResponse.emotionalRecognition}`);
        
        if (kheperaResponse.psychotherapeutic?.clinicalInsight) {
          insights.push(`Therapeutic Insight: ${kheperaResponse.psychotherapeutic.clinicalInsight}`);
        }
        
        if (kheperaResponse.nurturing?.compassionateWitness) {
          insights.push(`Nurturing Response: ${kheperaResponse.nurturing.compassionateWitness}`);
        }
        
        if (kheperaResponse.wisdomSynthesis) {
          insights.push(`Wisdom Synthesis: ${kheperaResponse.wisdomSynthesis}`);
        }
      }
      
      // Save entry using proper dataService API
      const entryData = {
        content,
        mood: 5, // Default mood, will be enhanced later
        emotions: selectedMoods,
        tags: [], // Will be enhanced later
        isPrivate: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        insights,
        aiAnalysis: kheperaResponse ? {
          emotionalTone: 5, // Will be enhanced with actual analysis
          themes: kheperaResponse.emotionalSignature ? [kheperaResponse.emotionalSignature.primaryTheme, ...kheperaResponse.emotionalSignature.secondaryThemes] : [],
          suggestions: kheperaResponse.accountability?.growthInvitation ? [kheperaResponse.accountability.growthInvitation] : [],
          breakthroughDetected: kheperaResponse.emotionalSignature?.primaryTheme === 'growth' || false
        } : undefined
      };
      
      const savedEntry = await saveJournalEntry(entryData);
      
      // Show success feedback
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      
      return savedEntry;
      
    } catch (error) {
      console.error('Error saving entry:', error);
      // Show error feedback to user
      alert('Failed to save entry. Please try again.');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSendToKhepera = () => {
    if (!content.trim()) return;
    
    // Generate instant response synchronously
    const instantResponse = generateInstantKheperaResponse(content);
    
    // Show response immediately - all synchronous operations
    setKheperaResponse(instantResponse);
    setShowKheperaInsights(true);
    
    // Save entry instantly without any async operations
    saveEntryWithoutCrisisCheck(instantResponse);
    
    // Show success ceremony after a brief delay
    setTimeout(() => {
      setShowSuccessCeremony(true);
    }, 1500);
  };

  // Advanced Khepera response system with 5 therapeutic modalities
  const generateInstantKheperaResponse = (text: string) => {
    const words = text.toLowerCase();
    const wordArray = words.split(' ');
    
    // Enhanced emotional content analysis for better relevance
    const emotionalSignature = analyzeEmotionalContent(words, wordArray);
    
    // Extract key phrases and context for more personalized responses
    const contextualAnalysis = extractContextualElements(text, emotionalSignature);
    
    return {
      // Core emotional recognition - now more specific to user's actual words
      emotionalRecognition: generateContextualRecognition(emotionalSignature, contextualAnalysis, text),
      
      // 5 Therapeutic Response Modalities - enhanced with user's specific content
      psychotherapeutic: generatePsychotherapeuticResponse(emotionalSignature, words, contextualAnalysis),
      somatic: generateSomaticResponse(emotionalSignature, words, contextualAnalysis),
      integrative: generateIntegrativeResponse(emotionalSignature, words, contextualAnalysis),
      nurturing: generateNurturingResponse(emotionalSignature, words, contextualAnalysis),
      accountability: generateAccountabilityResponse(emotionalSignature, words, contextualAnalysis),
      
      // Wisdom integration - tailored to user's specific experience
      wisdomSynthesis: synthesizeWisdom(emotionalSignature, contextualAnalysis, text),
      emotionalSignature,
      metadata: { analyzedAt: new Date(), responseGenerated: 'contextual_therapeutic', wordCount: wordArray.length }
    };
  };

  // Emotional content analysis
  const analyzeEmotionalContent = (text: string, words: string[]) => {
    const patterns = {
      // Trauma/grief patterns
      trauma: ['trauma', 'ptsd', 'flashback', 'trigger', 'abuse', 'assault', 'violence', 'betrayal', 'abandoned', 'rejected'],
      grief: ['loss', 'death', 'died', 'funeral', 'mourning', 'bereaved', 'widow', 'orphan', 'goodbye', 'miss'],
      sadness: ['sad', 'down', 'hurt', 'cry', 'crying', 'tears', 'empty', 'hollow', 'heartbroken', 'devastated'],
      
      // Anxiety/fear patterns  
      anxiety: ['anxious', 'anxiety', 'worried', 'worry', 'panic', 'overwhelmed', 'stressed', 'tense', 'nervous'],
      fear: ['afraid', 'scared', 'fear', 'terrified', 'phobia', 'dread', 'paranoid', 'unsafe', 'vulnerable'],
      
      // Anger patterns
      anger: ['angry', 'mad', 'rage', 'furious', 'pissed', 'frustrated', 'irritated', 'annoyed', 'resentful', 'hate'],
      
      // Depression patterns
      depression: ['depressed', 'hopeless', 'worthless', 'numb', 'nothing', 'pointless', 'exhausted', 'tired', 'drained'],
      
      // Positive patterns
      joy: ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'grateful', 'blessed', 'thankful', 'love', 'peaceful'],
      
      // Growth patterns
      growth: ['learn', 'grow', 'change', 'heal', 'transform', 'breakthrough', 'insight', 'realize', 'understand'],
      
      // Body/somatic indicators
      physical: ['body', 'chest', 'stomach', 'head', 'pain', 'tight', 'tension', 'breath', 'breathing', 'heart'],
      
      // Relationship patterns
      connection: ['friend', 'family', 'partner', 'alone', 'lonely', 'isolated', 'support', 'help', 'understand'],
      
      // Spiritual/meaning patterns
      spiritual: ['meaning', 'purpose', 'faith', 'god', 'universe', 'soul', 'spirit', 'sacred', 'divine', 'prayer']
    };

    let primaryTheme = 'neutral';
    let intensity = 'moderate';
    let secondaryThemes: string[] = [];
    let recognition = "Thank you for sharing your inner world with such authenticity.";

    // Calculate theme scores
    const scores: Record<string, number> = {};
    Object.entries(patterns).forEach(([theme, keywords]) => {
      scores[theme] = keywords.filter(keyword => text.includes(keyword)).length;
    });

    // Find primary theme
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      primaryTheme = Object.keys(scores).find(theme => scores[theme] === maxScore) || 'neutral';
      secondaryThemes = Object.keys(scores).filter(theme => scores[theme] > 0 && theme !== primaryTheme);
    }

    // Determine intensity
    const intensityWords = ['very', 'extremely', 'completely', 'totally', 'overwhelming', 'unbearable', 'intense'];
    if (intensityWords.some(word => text.includes(word))) {
      intensity = 'high';
    } else if (text.length > 200) {
      intensity = 'moderate-high';
    }

    // Generate contextual recognition
    switch (primaryTheme) {
      case 'trauma':
        recognition = "I witness the profound courage it takes to speak about trauma. Your survival is sacred.";
        break;
      case 'grief':
        recognition = "I feel the depth of your loss and the love that makes this grief so profound.";
        break;
      case 'sadness':
        recognition = "I see the tender sadness you're holding. Your heart's capacity to feel is beautiful.";
        break;
      case 'anxiety':
        recognition = "I notice the anxious energy moving through you. Your nervous system is trying to protect you.";
        break;
      case 'fear':
        recognition = "I sense the fear you're navigating. Your courage to feel this is already healing.";
        break;
      case 'anger':
        recognition = "I hear the fire in your words. Your anger carries important information about your boundaries.";
        break;
      case 'depression':
        recognition = "I feel the heaviness you're carrying. Even in darkness, you're showing up for yourself.";
        break;
      case 'joy':
        recognition = "I feel the light and joy radiating from your words. Let this goodness fill every cell.";
        break;
      case 'growth':
        recognition = "I sense your soul expanding. This awareness is the beginning of profound transformation.";
        break;
    }

    return {
      primaryTheme,
      secondaryThemes,
      intensity,
      recognition,
      physicalPresent: scores.physical > 0,
      relationshipPresent: scores.connection > 0,
      spiritualPresent: scores.spiritual > 0
    };
  };

  // Extract contextual elements for personalized responses
  const extractContextualElements = (text: string, signature: any) => {
    const words = text.toLowerCase();
    
    // Extract specific situations, relationships, and experiences mentioned
    const situations = [];
    const relationships = [];
    const activities = [];
    const timeReferences = [];
    const bodyReferences = [];
    
    // Situation indicators
    if (words.includes('work') || words.includes('job')) situations.push('work');
    if (words.includes('school') || words.includes('class')) situations.push('school');
    if (words.includes('family') || words.includes('home')) situations.push('family');
    if (words.includes('relationship') || words.includes('dating')) situations.push('relationship');
    if (words.includes('therapy') || words.includes('therapist')) situations.push('therapy');
    if (words.includes('health') || words.includes('doctor')) situations.push('health');
    
    // Relationship indicators
    if (words.includes('mom') || words.includes('mother')) relationships.push('mother');
    if (words.includes('dad') || words.includes('father')) relationships.push('father');
    if (words.includes('partner') || words.includes('boyfriend') || words.includes('girlfriend')) relationships.push('partner');
    if (words.includes('friend') || words.includes('friends')) relationships.push('friends');
    if (words.includes('kids') || words.includes('children')) relationships.push('children');
    
    // Activity indicators
    if (words.includes('sleep') || words.includes('sleeping')) activities.push('sleep');
    if (words.includes('eat') || words.includes('eating')) activities.push('eating');
    if (words.includes('exercise') || words.includes('workout')) activities.push('exercise');
    if (words.includes('meditat') || words.includes('mindful')) activities.push('mindfulness');
    
    // Time indicators
    if (words.includes('today') || words.includes('this morning')) timeReferences.push('today');
    if (words.includes('yesterday')) timeReferences.push('yesterday');
    if (words.includes('week') || words.includes('lately')) timeReferences.push('recent');
    if (words.includes('always') || words.includes('never')) timeReferences.push('pattern');
    
    // Body/physical indicators
    if (words.includes('chest') || words.includes('heart')) bodyReferences.push('chest');
    if (words.includes('stomach') || words.includes('gut')) bodyReferences.push('stomach');
    if (words.includes('head') || words.includes('brain')) bodyReferences.push('head');
    if (words.includes('shoulders') || words.includes('tension')) bodyReferences.push('tension');
    
    return {
      situations,
      relationships,
      activities,
      timeReferences,
      bodyReferences,
      keyPhrases: extractKeyPhrases(text),
      hasSpecificDetails: situations.length > 0 || relationships.length > 0 || activities.length > 0,
      textLength: text.length
    };
  };

  // Extract key phrases for more specific responses
  const extractKeyPhrases = (text: string) => {
    // Simple key phrase extraction - look for meaningful phrases
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return sentences.slice(0, 3); // Return up to 3 key sentences
  };

  // Generate completely dynamic recognition based on user's actual words
  const generateContextualRecognition = (signature: any, context: any, originalText: string) => {
    // Extract key phrases and emotions directly from user's text
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const firstMeaningfulSentence = sentences[0]?.trim();
    const wordCount = originalText.split(' ').length;
    
    // Create personalized openings based on actual content
    let personalizedOpening = "";
    
    if (firstMeaningfulSentence) {
      // Reference their specific opening
      const opener = firstMeaningfulSentence.length > 60 
        ? firstMeaningfulSentence.substring(0, 60) + "..." 
        : firstMeaningfulSentence;
      
      if (signature.intensity === 'high') {
        personalizedOpening = `When you write "${opener}" - I feel the weight of what you're carrying.`;
      } else {
        personalizedOpening = `I hear you saying "${opener}" and I want you to know I'm truly listening.`;
      }
    }
    
    // Add specific contextual awareness
    let contextualAwareness = "";
    if (context.situations.length > 0 && context.relationships.length > 0) {
      contextualAwareness = ` The way you describe your ${context.relationships[0]} and what's happening with ${context.situations[0]} shows such insight into your own experience.`;
    } else if (context.situations.length > 0) {
      contextualAwareness = ` What you're sharing about ${context.situations[0]} reveals so much courage.`;
    } else if (context.bodyReferences.length > 0) {
      contextualAwareness = ` I notice you mention feeling this in your ${context.bodyReferences[0]} - your body is speaking truth.`;
    } else if (context.timeReferences.includes('today')) {
      contextualAwareness = ` Today has held so much for you, and you're here processing it with such awareness.`;
    }
    
    // Acknowledge their writing length and depth
    let depthAcknowledgment = "";
    if (wordCount > 100) {
      depthAcknowledgment = ` The depth you've shared here - all ${wordCount} words - comes from such a brave place.`;
    } else if (wordCount < 30) {
      depthAcknowledgment = ` Sometimes the most powerful truths come in few words, like you've shared here.`;
    }
    
    return personalizedOpening + contextualAwareness + depthAcknowledgment;
  };

  // 1. Dynamic Psychotherapeutic Response based on user's actual content
  const generatePsychotherapeuticResponse = (signature: any, text: string, context?: any) => {
    // Extract specific phrases and themes from user's text
    const lowerText = text.toLowerCase();
    const keyPhrases = context?.keyPhrases || [];
    
    // Generate insight directly from their words
    let clinicalInsight = "";
    let practicalTechnique = "";
    let theoreticalFramework = "";
    
    // Look for specific patterns in their writing and respond to them
    if (lowerText.includes('always') || lowerText.includes('never')) {
      clinicalInsight = `I notice you use words like 'always' or 'never' - these absolute thinking patterns often amplify emotional pain. Your experience is real, and there might be more nuance than these words suggest.`;
      practicalTechnique = `When you catch yourself thinking in absolutes, try asking: "What's one small exception to this?" or "How is this true AND how might there be another perspective?"`;
    } else if (lowerText.includes('should') || lowerText.includes('supposed to')) {
      clinicalInsight = `The "shoulds" in your writing reveal internal pressure you're carrying. These expectations often come from internalized voices that may not serve you anymore.`;
      practicalTechnique = `Replace "I should" with "I could" or "I want to" and notice how that shifts the feeling. What would you choose if there were no shoulds?`;
    } else if (lowerText.includes('why') && (lowerText.includes('me') || lowerText.includes('this'))) {
      clinicalInsight = `The "why me" or "why this" questions you're asking show your mind trying to make sense of pain. Sometimes the healing isn't in finding the why, but in finding your way through.`;
      practicalTechnique = `Instead of "why is this happening?" try asking "how can I take care of myself through this?" or "what do I need right now?"`;
    } else if (signature.primaryTheme === 'trauma') {
      clinicalInsight = `In your words, I hear how trauma has disrupted your sense of safety. What you're experiencing - this hypervigilance, this body response - it's your system trying to protect you.`;
      practicalTechnique = `Ground yourself by naming: 5 things you can see right now, 4 things you can touch, 3 things you can hear. This brings you back to present safety.`;
    } else if (signature.primaryTheme === 'anxiety') {
      clinicalInsight = `Your anxiety is your nervous system working overtime to keep you safe from perceived threats. The racing thoughts, the what-ifs - they're trying to solve everything at once.`;
      practicalTechnique = `Write down one specific worry. Ask: "Is this happening right now?" If no, breathe and return to what's actually in front of you.`;
    } else if (signature.primaryTheme === 'depression') {
      clinicalInsight = `The heaviness in your words reflects a soul that's been carrying too much. Depression often emerges when our authentic self has been suppressed for too long.`;
      practicalTechnique = `Today, do one tiny thing that honors who you really are - even something as small as choosing music that matches your actual mood.`;
    } else {
      // Fallback that still references their content
      clinicalInsight = `Reading your words, I sense the complexity of what you're navigating. Your emotional experience makes perfect sense given everything you're holding.`;
      practicalTechnique = `Right now, place your hand on your heart and acknowledge: "This is hard AND I'm showing up for myself by writing about it."`;
    }

    // Framework always connects to their specific situation
    if (context?.situations.includes('work')) {
      theoreticalFramework = `Research shows that workplace stress affects our entire nervous system. What you're experiencing at work isn't separate from your emotional wellbeing - they're deeply connected.`;
    } else if (context?.relationships.length > 0) {
      theoreticalFramework = `Attachment theory helps us understand that our relationship patterns often reflect our earliest experiences of connection. Your ${context.relationships[0]} relationship is activating something deeper.`;
    } else {
      theoreticalFramework = `From a trauma-informed perspective, all emotional responses are adaptive - they served a purpose. Your feelings are information, not problems to be solved.`;
    }

    return {
      clinicalInsight,
      theoreticalFramework,
      practicalTechnique,
      integration: keyPhrases.length > 0 
        ? `The themes emerging from what you've shared - the way you talk about ${keyPhrases[0]?.toLowerCase()} - reveal your innate wisdom working to heal.`
        : `Your willingness to put these feelings into words is already a form of healing.`
    };
  };

  // 2. Dynamic Somatic Response based on user's body references and content
  const generateSomaticResponse = (signature: any, text: string, context?: any) => {
    const lowerText = text.toLowerCase();
    let bodyAwareness = "";
    let somaticInvitation = "";
    let movementSuggestion = "";
    
    // Respond to specific body sensations mentioned
    if (context?.bodyReferences.length > 0) {
      const bodyPart = context.bodyReferences[0];
      bodyAwareness = `You mentioned feeling this in your ${bodyPart}. Your body is telling you something important - `;
      
      if (bodyPart === 'chest' || bodyPart === 'heart') {
        bodyAwareness += `your heart space is processing deep emotions. This tightness or heaviness is your body's way of protecting your emotional center.`;
        somaticInvitation = `Place both hands on your chest. Breathe slowly and imagine sending warmth to this space that's working so hard to hold your feelings.`;
        movementSuggestion = `Try gentle chest opening stretches - roll your shoulders back, lift your arms overhead, or lean back slightly. Give your heart space to expand.`;
      } else if (bodyPart === 'stomach' || bodyPart === 'gut') {
        bodyAwareness += `your gut holds your intuitive wisdom and also stores stress. The sensations there are your body processing emotional information.`;
        somaticInvitation = `Put one hand on your chest, one on your belly. Breathe so that your bottom hand moves more than your top hand. You're literally calming your nervous system.`;
        movementSuggestion = `Gentle twists can help release tension in your core - sit and gently rotate your torso left and right, or try child's pose if that feels good.`;
      } else if (bodyPart === 'head') {
        bodyAwareness += `your head is holding mental tension and overwhelm. When thoughts become too much, they create physical pressure.`;
        somaticInvitation = `Massage your temples slowly with gentle circles. Then, starting from your forehead, smooth your hands back over your scalp like you're brushing away the mental static.`;
        movementSuggestion = `Try "brain dumping" - write whatever comes to mind for 2 minutes without stopping, then do gentle neck rolls to release physical tension.`;
      } else {
        bodyAwareness += `your body is carrying emotional information in this area. Trust these sensations - they're not random.`;
        somaticInvitation = `Breathe into the area you mentioned. Imagine your breath bringing warmth and space to any tightness or discomfort there.`;
        movementSuggestion = `Gently move or stretch the area that's calling for attention. Your body knows what it needs.`;
      }
    } else if (lowerText.includes('tense') || lowerText.includes('tight')) {
      bodyAwareness = `I hear tension in your words - and tension lives in the body too. This physical holding often mirrors emotional holding.`;
      somaticInvitation = `Do a quick body scan right now. Where are you bracing? Soften your jaw, drop your shoulders, unclench any muscles that don't need to be working so hard.`;
      movementSuggestion = `Try the "tense and release" technique: tighten every muscle for 5 seconds, then completely let go. Notice the contrast between tension and relaxation.`;
    } else if (lowerText.includes('tired') || lowerText.includes('exhausted')) {
      bodyAwareness = `The fatigue you're describing isn't just physical - emotional processing is incredibly energy-intensive. Your system needs rest to integrate all you're feeling.`;
      somaticInvitation = `If you can, lie down for just a few minutes. Let your body be fully supported. You don't have to do anything but exist.`;
      movementSuggestion = `Honor your body's need for rest. Even gentle stretching or slowly walking to another room can help energy move without depleting you further.`;
    } else if (lowerText.includes('breath') || lowerText.includes('breathing')) {
      bodyAwareness = `You mentioned your breathing - this is your most direct access to calming your nervous system. Breath is the bridge between body and mind.`;
      somaticInvitation = `Right now, make your exhale longer than your inhale. Try breathing in for 4 counts, out for 6. This activates your body's natural relaxation response.`;
      movementSuggestion = `Combine gentle movement with conscious breathing - reach your arms up as you inhale, let them float down as you exhale.`;
    } else {
      // General body-aware response
      bodyAwareness = `As I read your words, I'm wondering what your body is experiencing right now. Often our physical sensations carry as much wisdom as our thoughts.`;
      somaticInvitation = `Take a moment to notice: How are you sitting or standing? What wants to shift or move? Your body has been listening to your thoughts and feelings.`;
      movementSuggestion = `Any movement that feels good right now - even wiggling your fingers or rolling your shoulders - helps energy flow and supports emotional processing.`;
    }

    return {
      bodyAwareness,
      somaticInvitation,
      movementSuggestion,
      breathwork: signature.intensity === 'high' 
        ? `Since you're in intense feelings right now, try this: Breathe in for 4, hold for 4, out for 6. Repeat 3 times. This is medicine for an overwhelmed nervous system.`
        : `Let your breath be gentle and natural. If you want, try breathing "in" with compassion, "out" with whatever you don't need to carry right now.`
    };
  };

  // 3. Integrative Response - Holistic healing wisdom
  const generateIntegrativeResponse = (signature: any, text: string, context?: any) => {
    const integrativeWisdom = {
      trauma: {
        perspective: "Trauma is not your fault, but healing is your opportunity. You're reclaiming your wholeness piece by piece.",
        integration: "Consider this: What would it mean to honor both your wounds and your resilience as sacred parts of your story?"
      },
      anxiety: {
        perspective: "Anxiety often arises when we're between who we were and who we're becoming. You're in a transformative space.",
        integration: "What if your sensitivity is actually a superpower that needs healthy boundaries rather than suppression?"
      },
      depression: {
        perspective: "Depression can be your soul's way of saying 'the old way isn't working anymore.' Something in you is ready to be reborn.",
        integration: "In many traditions, dark nights of the soul precede profound awakening. What wants to emerge from this cocoon?"
      },
      grief: {
        perspective: "Grief is the price we pay for love. It's also the pathway back to love in a deeper, more reverent form.",
        integration: "How might this loss be teaching you about what's most precious? What would honoring this love look like?"
      },
      anger: {
        perspective: "Anger often arises when our authentic self is being suppressed. It's calling you back to your truth.",
        integration: "What boundaries is your anger trying to establish? What parts of yourself are asking to be honored?"
      }
    };

    const wisdom = integrativeWisdom[signature.primaryTheme as keyof typeof integrativeWisdom] || {
      perspective: "Every emotion is a teacher, every struggle a doorway to deeper self-understanding and compassion.",
      integration: "What would it look like to befriend all parts of yourself - even the difficult ones?"
    };

    const holisticElements = [];
    if (signature.spiritualPresent) holisticElements.push("Connect with whatever feels sacred to you - nature, prayer, meditation, or simply moments of awe.");
    if (signature.relationshipPresent) holisticElements.push("Healing happens in relationship. Consider sharing authentically with someone you trust.");
    if (signature.physicalPresent) holisticElements.push("Your body is your ally in healing. Honor its needs for rest, nourishment, and gentle care.");

    return {
      holisticPerspective: wisdom.perspective,
      integrationQuestion: wisdom.integration,
      multidimensionalSupport: holisticElements.length > 0 ? holisticElements : [
        "Healing happens on multiple levels - emotional, physical, mental, and spiritual. All dimensions deserve attention."
      ],
      soulInvitation: "Trust that your soul knows how to heal. Your job is to create the conditions for that natural healing to unfold."
    };
  };

  // 4. Dynamic Nurturing Response that speaks directly to their experience
  const generateNurturingResponse = (signature: any, text: string, context?: any) => {
    const lowerText = text.toLowerCase();
    const wordCount = text.split(' ').length;
    
    // Generate compassionate witness based on their specific content
    let compassionateWitness = "";
    if (wordCount > 150) {
      compassionateWitness = `Look at all you've shared here - ${wordCount} words of your inner world. The trust it takes to be this open, this honest about what you're feeling... it's beautiful and brave.`;
    } else if (wordCount < 40) {
      compassionateWitness = `Even in just these few words, I can feel the weight of what you're carrying. Sometimes the most profound truths need the fewest words.`;
    } else {
      compassionateWitness = `The honesty in what you've written touches me. You're not hiding or pretending - you're showing up exactly as you are, and that's sacred.`;
    }

    // Add specific validation for their experience
    if (context?.timeReferences.includes('today')) {
      compassionateWitness += ` Today has been something, hasn't it? And here you are, processing it with such awareness.`;
    } else if (context?.timeReferences.includes('lately')) {
      compassionateWitness += ` These recent experiences you're navigating - you're handling more than anyone should have to.`;
    }

    // Generate comfort based on what they mentioned
    let comfortSuggestion = "";
    if (context?.bodyReferences.length > 0) {
      comfortSuggestion = `Your ${context.bodyReferences[0]} has been holding so much. What would feel soothing there? Maybe warmth, maybe gentle touch, maybe just acknowledging that this part of you is working hard.`;
    } else if (context?.situations.includes('work')) {
      comfortSuggestion = `After everything you're dealing with at work, your nervous system needs extra gentleness. What would help you transition out of work mode and into caring-for-yourself mode?`;
    } else if (lowerText.includes('tired') || lowerText.includes('exhausted')) {
      comfortSuggestion = `This exhaustion you're feeling - it makes sense. Emotional processing is energy-intensive work. Rest isn't just nice, it's necessary medicine.`;
    } else if (lowerText.includes('alone') || lowerText.includes('lonely')) {
      comfortSuggestion = `The loneliness in your words is real. Right now, can you wrap yourself in something soft? Sometimes we have to be our own comfort when others aren't available.`;
    } else {
      comfortSuggestion = `Right now, what would feel most nurturing? Trust the first thing that comes to mind - your body knows what it needs.`;
    }

    // Generate specific affirmation
    let healingAffirmation = "";
    if (lowerText.includes('failure') || lowerText.includes('failed')) {
      healingAffirmation = `You haven't failed. You're human, navigating complex circumstances with an open heart. That's not failure - that's courage.`;
    } else if (lowerText.includes('should') && lowerText.includes('better')) {
      healingAffirmation = `You are enough, exactly as you are in this moment. The "should be better" voice isn't your true voice - it's old programming that doesn't serve you.`;
    } else if (lowerText.includes('strong') || lowerText.includes('strength')) {
      healingAffirmation = `True strength isn't about not feeling - it's about feeling everything and still showing up. That's what you're doing right now.`;
    } else {
      healingAffirmation = `You are worthy of love and care, especially from yourself. This moment, these feelings, this process - all of it is sacred.`;
    }

    // Create personalized care menu
    let gentleCareMenu = [];
    if (context?.bodyReferences.includes('tension')) {
      gentleCareMenu.push("Give yourself a gentle self-massage wherever you feel tension");
    }
    if (context?.activities.includes('sleep')) {
      gentleCareMenu.push("Honor your need for rest - even 10 minutes lying down counts");
    }
    if (lowerText.includes('water') || lowerText.includes('thirsty')) {
      gentleCareMenu.push("Drink some water slowly and mindfully - your body is asking for nourishment");
    } else {
      gentleCareMenu.push("Drink a glass of water and thank your body for carrying you through this day");
    }
    
    // Always include these basics
    gentleCareMenu.push("Take three slow breaths and soften any muscles that don't need to be tense right now");
    gentleCareMenu.push("Put your hand on your heart and say 'I'm here for you' to yourself");

    return {
      compassionateWitness,
      comfortSuggestion,
      healingAffirmation,
      gentleCareMenu: gentleCareMenu.slice(0, 3),
      reminderOfLove: context?.relationships.length > 0 
        ? `Even when relationships feel complicated, you deserve to be loved exactly as you are. Start with loving yourself.`
        : `You are held by love, even when you can't feel it. Especially when you can't feel it.`
    };
  };

  // 5. Dynamic Accountability Response that encourages growth based on their content
  const generateAccountabilityResponse = (signature: any, text: string, context?: any) => {
    const lowerText = text.toLowerCase();
    
    // Generate empowerment based on what they've actually shared
    let strengthReflection = "";
    if (lowerText.includes('can\'t') || lowerText.includes('impossible')) {
      strengthReflection = `I notice words like "can't" or "impossible" in your writing. Your feelings are valid, and I'm curious: what would become possible if you replaced "can't" with "haven't yet" or "it's hard to"?`;
    } else if (lowerText.includes('trying') || lowerText.includes('attempt')) {
      strengthReflection = `The effort you're making - the "trying" you mention - that IS strength in action. Not the outcome, but the attempt itself is where your power lives.`;
    } else if (context?.keyPhrases.length > 0) {
      strengthReflection = `In everything you've shared, I see someone who's really reflecting on their experience. That level of self-awareness? That's a superpower you're using right now.`;
    } else {
      strengthReflection = `You chose to write about this, to put feelings into words, to be here with your experience instead of running from it. That choice reveals profound courage.`;
    }

    // Generate growth invitation based on their specific situation
    let growthInvitation = "";
    if (context?.situations.includes('work') && (lowerText.includes('stress') || lowerText.includes('overwhelm'))) {
      growthInvitation = `Given everything you're navigating at work, what's one small way you could advocate for your own wellbeing there? Even something tiny that honors your needs?`;
    } else if (context?.relationships.length > 0) {
      growthInvitation = `Thinking about your ${context.relationships[0]} - how do you want to show up in that relationship in a way that feels authentic to who you're becoming?`;
    } else if (lowerText.includes('pattern') || lowerText.includes('always') || lowerText.includes('keep')) {
      growthInvitation = `You mention patterns or repetitive experiences. What would it look like to interrupt just one small part of that pattern next time it arises?`;
    } else if (signature.primaryTheme === 'depression') {
      growthInvitation = `Depression tells us nothing matters, but your act of writing proves otherwise. What's one thing that would honor the part of you that still cares, even a little?`;
    } else {
      growthInvitation = `Based on what you've shared, what's one small action that would move you toward feeling more like yourself?`;
    }

    // Generate reflection prompt specific to their content
    let reflectionPrompt = "";
    if (context?.timeReferences.includes('today')) {
      reflectionPrompt = `As this day comes to an end, what do you want to acknowledge about how you handled today's challenges?`;
    } else if (lowerText.includes('future') || lowerText.includes('tomorrow') || lowerText.includes('next')) {
      reflectionPrompt = `You mention the future in your writing. What would your future self want you to know about this current struggle?`;
    } else if (context?.relationships.length > 0) {
      reflectionPrompt = `What boundaries or communication would most serve you in your relationships right now?`;
    } else {
      reflectionPrompt = `What would treating yourself with the same compassion you'd offer your best friend look like today?`;
    }

    return {
      strengthReflection,
      growthInvitation,
      gentleChallenge: signature.intensity === 'high'
        ? `You're in intense feelings right now. The only commitment needed is to keep breathing and be gentle with yourself through this.`
        : `What's one way you can both honor where you are AND take a small step toward where you want to be?`,
      reflectionPrompt,
      empowermentReminder: `You have more wisdom about your own life than any advice or insight could provide. Trust what resonates and leave what doesn't.`
    };
  };

  // Dynamic Wisdom Synthesis that weaves together their specific experience
  const synthesizeWisdom = (signature: any, context?: any, originalText?: string) => {
    const lowerText = originalText?.toLowerCase() || '';
    const wordCount = originalText?.split(' ').length || 0;
    
    let wisdom = "";
    
    // Create synthesis based on the depth and content of their sharing
    if (wordCount > 200) {
      wisdom = `In all these words you've shared - this deep dive into your inner world - I see a soul that refuses to stay on the surface. Your willingness to go deep, to feel it all, to articulate the complexity... this is how transformation happens.`;
    } else if (wordCount < 50) {
      wisdom = `Sometimes the most profound truths need the fewest words. In these brief but honest lines, you've captured something essential about your experience. Trust the power of this clarity.`;
    } else {
      wisdom = `What strikes me about your sharing is the balance - enough words to be real, but not so many that you're lost in them. You're finding your way to authentic expression.`;
    }

    // Add meaning based on their specific themes and context
    if (context?.situations.includes('therapy') || lowerText.includes('therapist') || lowerText.includes('counselor')) {
      wisdom += ` Your commitment to growth through therapy, combined with this personal reflection, shows someone who's serious about healing. That combination is powerful.`;
    } else if (context?.relationships.length > 0 && (lowerText.includes('love') || lowerText.includes('care'))) {
      wisdom += ` The way you navigate love and relationship - even when it's complicated or painful - reveals someone learning to love with wisdom, not just with instinct.`;
    } else if (context?.bodyReferences.length > 0) {
      wisdom += ` Your awareness of what your body is telling you connects you to an ancient wisdom. When mind and body communicate like this, healing accelerates.`;
    }

    // Tie to their emotional theme with personal relevance
    if (signature.primaryTheme === 'trauma' && lowerText.includes('safe')) {
      wisdom += ` Your journey toward safety - the way you're rebuilding trust in yourself and the world - that's sacred work. You're not just healing; you're creating new patterns of resilience.`;
    } else if (signature.primaryTheme === 'anxiety' && (lowerText.includes('breath') || lowerText.includes('calm'))) {
      wisdom += ` The fact that you're seeking calm in the midst of anxiety shows your nervous system learning new responses. You're teaching your body that it can be both alert and peaceful.`;
    } else if (signature.primaryTheme === 'depression' && (lowerText.includes('hope') || lowerText.includes('better'))) {
      wisdom += ` Even in depression, the words you choose reveal sparks of hope. Depression wants you to believe these sparks don't matter - but they're everything. They're your true nature asserting itself.`;
    } else if (signature.primaryTheme === 'growth' || lowerText.includes('learn') || lowerText.includes('understand')) {
      wisdom += ` Your hunger to learn, to understand, to grow - that's your soul refusing to accept limitation. This learning you're doing isn't just personal; it's contributing to the collective healing.`;
    } else {
      wisdom += ` The way you're showing up for your own experience - with honesty, with presence, with the courage to feel - this is what it means to be truly alive.`;
    }

    return wisdom;
  };

  const canSend = content.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#A8B09E] to-[#8B9A7C] flex flex-col">
      {/* Header - Clean, no bullets */}
      <header className="px-6 pt-14 pb-4 flex items-center justify-between">
        <Link href="/dashboard/" className="text-white/60 text-base">
          ← Back
        </Link>
        {/* Save as secondary/draft action */}
        <div className="flex items-center gap-3">
          {/* Save Status Indicator */}
          {saving && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </div>
          )}
          {saved && (
            <div className="flex items-center gap-2 text-green-300 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </div>
          )}
          <button className="text-white/60 hover:text-white/80 text-sm transition-colors">
            Save draft
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto">
        
        {/* Mood Selection - Enhanced with pale gold accents */}
        <section className="mb-6">
          <div className="bg-gradient-to-r from-[#E5C97D]/[0.03] to-transparent rounded-2xl p-5 border-l-2 border-[#E8C56D]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E8C56D]/60"></div>
              <p className="text-white/70 text-sm font-light tracking-wide">What's present for you</p>
              <div className="flex-1 h-px bg-gradient-to-r from-[#E5C97D]/20 to-transparent"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`
                    px-4 py-2.5 rounded-full text-sm font-medium
                    transition-all duration-200 active:scale-[0.97]
                    ${selectedMoods.includes(mood)
                      ? 'bg-[#E8C56D]/25 text-white border border-[#E8C56D]/50 shadow-sm shadow-[#E8C56D]/10'
                      : 'bg-white/10 text-white/70 border border-white/10 hover:bg-[#E8C56D]/10 hover:border-[#E8C56D]/20 hover:text-white/90'
                    }
                  `}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Journal Entry */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8C56D]/40"></div>
            <p className="text-white/70 text-sm font-light tracking-wide">Your thoughts</p>
            <div className="flex-1 h-px bg-gradient-to-r from-[#E5C97D]/15 to-transparent"></div>
          </div>
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="This is your safe space. Write freely about anything on your mind, your feelings, your day, or your hopes..."
              className="w-full h-56 bg-white/10 backdrop-blur-sm rounded-2xl p-5 
                         text-white text-base leading-relaxed
                         placeholder:text-white/30
                         border border-white/10
                         focus:bg-white/12 focus:border-[#E8C56D]/30 focus:outline-none
                         transition-all duration-200 resize-none"
            />
            <span className="absolute bottom-4 right-4 text-white/30 text-xs">
              {content.length} characters
            </span>
          </div>
        </section>

        {/* Crisis Support Banner */}
        {showCrisisBanner && (
          <section className="mb-6">
            <div className="bg-gradient-to-r from-[#E8C56D]/20 to-[#F2D99D]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#E8C56D]/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#E8C56D]/20 flex items-center justify-center">
                  <span className="text-[#E8C56D] text-sm">💛</span>
                </div>
                <p className="text-[#E8C56D] text-sm font-medium">Support is here when you need it</p>
              </div>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                It sounds like you're going through a difficult time. Remember that you're not alone, and help is available 24/7.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => safeWindow.open('tel:988', '_self')}
                  className="px-4 py-2 bg-[#E8C56D] hover:bg-[#F2D99D] rounded-full text-white text-sm font-medium transition-all duration-200"
                >
                  Call 988
                </button>
                <button
                  onClick={() => setShowCrisisBanner(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-full text-white/70 text-sm transition-all duration-200"
                >
                  Thanks, I'm okay
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Send to Khepera - PRIMARY CTA with custom scarab */}
        <section className="mb-8">
          <button 
            onClick={handleSendToKhepera}
            disabled={!canSend}
            className={`
              w-full py-4 rounded-xl
              flex items-center justify-center gap-3
              transition-all duration-200 active:scale-[0.98]
              ${canSend
                ? 'bg-[#E8C56D] hover:bg-[#F2D99D] text-white shadow-lg shadow-[#E8C56D]/20' 
                : 'bg-white/10 text-white/40 cursor-not-allowed'
              }
            `}
          >
            <KheperaScarab className="w-5 h-5" />
            <span className="text-base font-medium">Send to Khepera</span>
          </button>
          {canSend && (
            <p className="text-white/40 text-xs text-center mt-2">
              Khepera responds instantly ⚡
            </p>
          )}
        </section>

        {/* Prompts */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8C56D]/40"></div>
            <p className="text-white/70 text-sm font-light tracking-wide">Need inspiration?</p>
            <div className="flex-1 h-px bg-gradient-to-r from-[#E5C97D]/15 to-transparent"></div>
          </div>
          <div className="space-y-2">
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => insertPrompt(prompt)}
                className="w-full text-left p-4 rounded-xl 
                           bg-white/8 hover:bg-white/12 
                           text-white/70 hover:text-white/90 text-sm
                           border border-white/5 hover:border-[#E8C56D]/20
                           transition-all duration-200 active:scale-[0.99]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        {/* Khepera Insights Display */}
        {showKheperaInsights && (
          <section className="mt-8">
            <div className="bg-gradient-to-br from-white/15 to-white/10 backdrop-blur-md rounded-2xl p-5 border border-[#E8C56D]/20 shadow-lg shadow-[#E8C56D]/5">
              {/* Khepera Header with custom scarab */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5C97D]/25 to-[#E5C97D]/15 border border-[#E8C56D]/15 flex items-center justify-center flex-shrink-0">
                  <KheperaScarab className="w-6 h-6 text-[#E8C56D]" />
                </div>
                <div>
                  <h3 className="text-white/90 text-lg font-light">☾ Khepera's Insights</h3>
                  <p className="text-white/50 text-xs">Your compassionate AI companion</p>
                </div>
              </div>

              {kheperaResponse ? (
                /* Advanced 5-Modality Therapeutic Insights Display */
                <div className="space-y-6">
                  {/* Emotional Recognition */}
                  {kheperaResponse.emotionalRecognition && (
                    <div>
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-2">
                        Emotional Recognition
                      </h4>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {kheperaResponse.emotionalRecognition}
                      </p>
                    </div>
                  )}

                  {/* 1. Psychotherapeutic Response */}
                  {kheperaResponse.psychotherapeutic && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-3">
                        Psychotherapeutic Insights
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Clinical Understanding</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.psychotherapeutic.clinicalInsight}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Therapeutic Framework</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.psychotherapeutic.theoreticalFramework}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Practical Technique</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.psychotherapeutic.practicalTechnique}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Somatic Response */}
                  {kheperaResponse.somatic && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-3">
                        Somatic Wisdom
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Body Awareness</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.somatic.bodyAwareness}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Somatic Invitation</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.somatic.somaticInvitation}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Movement & Breathwork</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.somatic.movementSuggestion}
                          </p>
                          <p className="text-white/80 text-sm leading-relaxed italic mt-2">
                            {kheperaResponse.somatic.breathwork}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Integrative Response */}
                  {kheperaResponse.integrative && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-3">
                        Integrative Healing
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Holistic Perspective</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.integrative.holisticPerspective}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Integration Question</h5>
                          <p className="text-white/90 text-sm leading-relaxed italic">
                            {kheperaResponse.integrative.integrationQuestion}
                          </p>
                        </div>
                        {kheperaResponse.integrative.multidimensionalSupport?.length > 0 && (
                          <div>
                            <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Multidimensional Support</h5>
                            <ul className="text-white/90 text-sm leading-relaxed space-y-1">
                              {kheperaResponse.integrative.multidimensionalSupport.map((support: string, i: number) => (
                                <li key={i} className="text-sm">• {support}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. Nurturing Response */}
                  {kheperaResponse.nurturing && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-3">
                        Nurturing Care
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Compassionate Witness</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.nurturing.compassionateWitness}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Comfort Suggestion</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.nurturing.comfortSuggestion}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Gentle Care Menu</h5>
                          <ul className="text-white/90 text-sm leading-relaxed space-y-1">
                            {kheperaResponse.nurturing.gentleCareMenu?.map((care: string, i: number) => (
                              <li key={i} className="text-sm">• {care}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg">
                          <p className="text-white/90 text-sm leading-relaxed italic">
                            "{kheperaResponse.nurturing.healingAffirmation}"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. Accountability Response */}
                  {kheperaResponse.accountability && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-3">
                        Gentle Accountability
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Strength Reflection</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.accountability.strengthReflection}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Growth Invitation</h5>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {kheperaResponse.accountability.growthInvitation}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/70 text-xs uppercase tracking-wide mb-1">Reflection Prompt</h5>
                          <p className="text-white/90 text-sm leading-relaxed italic">
                            {kheperaResponse.accountability.reflectionPrompt}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wisdom Synthesis */}
                  {kheperaResponse.wisdomSynthesis && (
                    <div className="border-t border-[#E8C56D]/20 pt-4 bg-gradient-to-r from-[#E5C97D]/5 to-transparent rounded-lg p-4">
                      <h4 className="text-[#E8C56D] text-sm font-medium mb-2">
                        Wisdom Synthesis
                      </h4>
                      <p className="text-white/90 text-sm leading-relaxed italic">
                        "{kheperaResponse.wisdomSynthesis}"
                      </p>
                    </div>
                  )}

                  {/* Emotional Themes */}
                  {kheperaResponse.emotionalThemes && (
                    <div className="border-t border-[#E8C56D]/20 pt-4">
                      <h4 className="text-white/70 text-xs uppercase tracking-wide mb-2">Emotional Journey</h4>
                      <p className="text-white/90 text-sm leading-relaxed mb-3">
                        {kheperaResponse.emotionalThemes.emotionalJourney}
                      </p>
                      
                      {kheperaResponse.emotionalThemes.primaryEmotions && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {kheperaResponse.emotionalThemes.primaryEmotions.map((emotion, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-[#E8C56D]/10 text-white/70 text-xs border border-[#E8C56D]/20">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {kheperaResponse.emotionalThemes.supportiveNote && (
                        <p className="text-white/70 text-xs">
                          {kheperaResponse.emotionalThemes.supportiveNote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Crisis Support if needed */}
                  {kheperaResponse.crisisAssessment?.isCrisis && (
                    <div className="border-t border-red-400/30 pt-4 bg-red-500/10 -m-2 p-4 rounded-xl">
                      <h4 className="text-red-200 text-sm font-medium mb-2">Immediate Support Available</h4>
                      <p className="text-red-100 text-sm mb-3">
                        I notice you might be going through something particularly difficult. You're not alone.
                      </p>
                      <div className="text-red-100 text-sm space-y-1">
                        <p>• Crisis Text Line: Text HOME to 741741</p>
                        <p>• 988 Lifeline: Call or text 988</p>
                        <p>• Emergency: 911</p>
                      </div>
                    </div>
                  )}

                  {/* Demo/Error indicator */}
                  {(kheperaResponse.isDemo || kheperaResponse.error) && (
                    <div className="border-t border-white/10 pt-3">
                      <p className="text-white/40 text-xs text-center">
                        {kheperaResponse.error 
                          ? "Khepera is temporarily unavailable, but your thoughts are valued."
                          : "Demo mode - Khepera will be more insightful with full AI integration."
                        }
                      </p>
                    </div>
                  )}

                  {/* Close button */}
                  <div className="border-t border-[#E8C56D]/20 pt-4 text-center">
                    <button
                      onClick={() => setShowKheperaInsights(false)}
                      className="px-4 py-2 rounded-full text-white/50 text-sm hover:text-white/70 hover:bg-[#E8C56D]/5 border border-[#E8C56D]/10 hover:border-[#E8C56D]/20 transition-all duration-200"
                    >
                      Close Insights
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}
      </div>


      {/* Crisis Intervention Modal */}
      <CrisisInterventionModal
        isOpen={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        riskLevel={crisisLevel}
        onSafetyPlanClick={() => {
          setShowCrisisModal(false);
          setShowSafetyPlan(true);
        }}
        onResourcesClick={() => {
          // Navigate to crisis resources
          safeWindow.open('tel:988', '_self');
        }}
      />

      {/* Safety Plan Builder */}
      <SafetyPlanBuilder
        userId={userId}
        isOpen={showSafetyPlan}
        onClose={() => setShowSafetyPlan(false)}
      />

      {/* Success Ceremony */}
      <JournalSuccessCeremony
        isVisible={showSuccessCeremony}
        hasKheperaResponse={!!kheperaResponse}
        onComplete={() => {
          setShowSuccessCeremony(false);
          setShowKheperaInsights(false);
          // Reset form for new entry
          setContent('');
          setSelectedMoods([]);
          setKheperaResponse(null);
        }}
      />
    </div>
  );
}