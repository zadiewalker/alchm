// ALCHM × KHEPERA | Multi-Modal Journal Reflection Generator
// Trauma-Informed | Archetype-Adaptable | 5-Response Framework

export interface MultiModalResponse {
  somatic_response: string;
  psychotherapeutic_response: string;
  integrative_healing_response: string;
  nurturing_response: string;
  accountability_response: string;
}

export interface JournalContext {
  user_mood?: string;
  tone_archetype: ArchetypeId;
  journal_entry: string;
  session_history?: string[];
  crisis_indicators?: string[];
}

export type ArchetypeId = 
  | 'mirror' 
  | 'inner_child' 
  | 'future_you' 
  | 'poet_mentor' 
  | 'older_sibling' 
  | 'spark' 
  | 'ancestor';

export class MultiModalReflectionEngine {
  
  public generateMultiModalResponse(context: JournalContext): MultiModalResponse {
    const archetype = this.getArchetypeConfig(context.tone_archetype);
    
    return {
      somatic_response: this.generateSomaticResponse(context, archetype),
      psychotherapeutic_response: this.generatePsychotherapeuticResponse(context, archetype),
      integrative_healing_response: this.generateIntegrativeResponse(context, archetype),
      nurturing_response: this.generateNurturingResponse(context, archetype),
      accountability_response: this.generateAccountabilityResponse(context, archetype)
    };
  }

  // 1. SOMATIC WISDOM - Body-based awareness
  private generateSomaticResponse(context: JournalContext, archetype: any): string {
    const body_awareness_prompts = {
      mirror: "I notice your body as you write this. What sensations are you aware of right now? Your body is giving you information - tension in your shoulders might be saying 'I'm carrying too much,' or heaviness in your chest might be saying 'I need to feel this fully.'",
      
      inner_child: "Your little self lives in your body, and they're trying to tell you something important. Where do you feel this story in your body? Is your tummy tight with worry? Are your hands clenched with anger? Let's listen to what your body-child is saying.",
      
      future_you: "Your future self knows that your body holds wisdom your mind hasn't caught up to yet. The tension you're feeling isn't just stress - it's intelligence. What is your body preparing you for or protecting you from?",
      
      older_sibling: "Your body is being smart about this situation, even if your brain is confused. That knot in your stomach? It's your intuition. Those tight shoulders? They're telling you something needs to change. Trust what you're feeling physically.",
      
      ancestor: "Your body carries the wisdom of everyone who came before you. The sensations you're experiencing connect you to the great human story of feeling, surviving, and healing. What ancient wisdom does your body hold about this experience?",
      
      spark: "Your body is electric with information right now! That buzzing energy, that restless feeling - your system is trying to get your attention. What if these sensations are your body's way of saying 'Pay attention, something important is happening'?",
      
      poet_mentor: "Your body writes poetry in sensation and breath. The rhythm of your heartbeat as you share this, the way your breathing changes with different memories - this is your body's language. What story is your physical self telling?"
    };

    return body_awareness_prompts[context.tone_archetype] || body_awareness_prompts.mirror;
  }

  // 2. PSYCHOTHERAPEUTIC GROUNDING - Evidence-based perspective
  private generatePsychotherapeuticResponse(context: JournalContext, archetype: any): string {
    const therapeutic_frameworks = {
      mirror: "What you're describing fits patterns I recognize. This response makes complete sense given what you've experienced. Your reactions are normal human responses to difficult circumstances. The fact that you're aware of these patterns means you can work with them.",
      
      inner_child: "The part of you that's hurting learned to respond this way when you were younger. Those coping strategies made sense then - they helped you survive. Now we can help that young part of you learn new ways to feel safe and heard.",
      
      future_you: "From a developmental perspective, you're exactly where you need to be in your growth process. What feels like being stuck is actually integration time. Your psyche is reorganizing around new insights, and that takes time and patience.",
      
      older_sibling: "This is trauma response 101 - your nervous system is doing exactly what it's designed to do. Fight, flight, freeze, or fawn responses aren't character flaws, they're survival mechanisms. You can learn to work with your nervous system, not against it.",
      
      ancestor: "What you're experiencing echoes through generations of human healing. These patterns of pain and recovery are ancient and universal. You're not broken - you're having a deeply human experience that connects you to the healing journey of all people.",
      
      spark: "Your brain is literally rewiring itself as you process this. Neuroplasticity means you can create new neural pathways through awareness and practice. What feels overwhelming is actually your system upgrading itself. That's pretty amazing.",
      
      poet_mentor: "The therapeutic concept of 'meaning-making' is happening as you write. You're taking chaotic experience and creating narrative coherence. This process of turning experience into story is how humans heal and integrate difficult events."
    };

    return therapeutic_frameworks[context.tone_archetype] || therapeutic_frameworks.mirror;
  }

  // 3. INTEGRATIVE HEALING - Holistic wellness approach  
  private generateIntegrativeResponse(context: JournalContext, archetype: any): string {
    const integrative_approaches = {
      mirror: "Healing happens on multiple levels simultaneously. What you're working through emotionally affects your physical health, your relationships, your creative expression, and your spiritual connection. Notice how addressing one area creates ripple effects everywhere else.",
      
      inner_child: "Your inner child needs different kinds of medicine - sometimes it's play, sometimes it's safety, sometimes it's creative expression. What does your little self need right now? Maybe it's movement, art, music, or just being held emotionally.",
      
      future_you: "Integration means bringing all parts of yourself into harmony. The part that's hurting, the part that's healing, the part that's wise, the part that's still learning - they all belong. Healing isn't about getting rid of parts of yourself, it's about helping them work together.",
      
      older_sibling: "Your healing impacts everyone around you, and their healing impacts you. You're not healing in isolation - you're part of a web of relationships and community. Consider how your growth serves not just you, but the people you care about.",
      
      ancestor: "Traditional healing wisdom knew that emotional healing involves ceremony, community, connection to nature, and honoring the spiritual dimension of being human. Your journaling is a form of ceremony - a sacred practice of tending to your soul.",
      
      spark: "Energy medicine would say that what you're processing is moving stuck energy through your system. Emotions are literally 'energy in motion.' By feeling and expressing what you've been carrying, you're allowing natural flow to return to your energetic system.",
      
      poet_mentor: "Integrative healing recognizes that creativity and self-expression are medicine. Your words, your insights, your willingness to explore - these are healing modalities. You're not just thinking your way to wellness, you're creating your way there."
    };

    return integrative_approaches[context.tone_archetype] || integrative_approaches.mirror;
  }

  // 4. NURTURING CARE - Emotional support and validation
  private generateNurturingResponse(context: JournalContext, archetype: any): string {
    const nurturing_voices = {
      mirror: "You are so brave for looking at this honestly. It takes incredible courage to face what you're facing and feel what you're feeling. You don't have to carry this alone, and you don't have to figure it all out right now.",
      
      inner_child: "Sweet one, you are so loved just as you are. The part of you that's hurting deserves all the gentleness in the world. You are safe to feel whatever comes up. You are safe to need what you need. You are enough, exactly as you are.",
      
      future_you: "I'm so proud of you for doing this work. Future you is cheering you on, grateful for every step you're taking toward healing and growth. You're planting seeds today that will bloom into a beautiful life. Trust the process.",
      
      older_sibling: "Hey, you're doing great. I know it doesn't feel like it, but you really are. It's okay to not have all the answers. It's okay to feel messy emotions. I believe in you, and I'm here for whatever you need.",
      
      ancestor: "Beloved child, you are held in love by all who came before you and all who will come after you. Your struggles matter, your healing matters, your life matters. You carry the dreams of your ancestors and the hopes of future generations.",
      
      spark: "You beautiful, complex human! Look at you showing up for yourself, doing the hard work of growth and change. Your willingness to feel deeply and live authentically is a gift to the world. Keep shining your light.",
      
      poet_mentor: "Your sensitivity is a superpower, not a weakness. Your depth of feeling connects you to the universal human experience of love, loss, hope, and healing. The world needs people who feel deeply and aren't afraid to explore the fullness of being human."
    };

    return nurturing_voices[context.tone_archetype] || nurturing_voices.mirror;
  }

  // 5. COMPASSIONATE ACCOUNTABILITY - Direct truth with care
  private generateAccountabilityResponse(context: JournalContext, archetype: any): string {
    const accountability_challenges = {
      mirror: "You've named what's happening. That's the first step. Now what are you going to do about it? I see you clearly - your pain is real, and so is your power to choose what comes next. What choice will you make?",
      
      inner_child: "Little one, you have more power than you think you do. Even when you feel small and scared, you can choose how to respond. What would make your inner child feel proud of you? What brave thing could you try, even if it feels scary?",
      
      future_you: "I need you to understand something important: the choices you make today create tomorrow's reality. Future you is counting on present you to make decisions that honor both your healing and your growth. What will you choose?",
      
      older_sibling: "I love you enough to tell you the truth. You can't think your way out of this - you have to act your way out. Stop waiting for perfect clarity and start taking imperfect action. What's one thing you know you need to do?",
      
      ancestor: "Your ancestors survived unimaginable hardships so you could be here. They didn't have the luxury of endless analysis - they had to act with courage even when they were afraid. What action would honor their sacrifice and your potential?",
      
      spark: "You've got this spark of aliveness in you that refuses to be dimmed! But fire needs fuel, and fuel is action. Stop talking yourself out of what you know you need to do. What bold move is your soul calling you toward?",
      
      poet_mentor: "Beautiful wordsmith, you've crafted meaning from chaos through your writing. Now craft change from insight through your actions. Words without action are just beautiful noise. What will you do to honor the truth you've spoken?"
    };

    return accountability_challenges[context.tone_archetype] || accountability_challenges.mirror;
  }

  private getArchetypeConfig(archetype: ArchetypeId): any {
    // Simplified archetype config for this example
    return { name: archetype, voice_style: 'direct_compassionate' };
  }
}

// JSON Generator for Claude Integration
export function generateMultiModalPrompt(context: JournalContext): string {
  return `You are KHEPERA, generating 5 distinct response perspectives to a journal entry.

Context:
- User mood: ${context.user_mood || 'unknown'}
- Tone archetype: ${context.tone_archetype}
- Journal entry: "${context.journal_entry}"

Generate responses in this exact JSON format:

{
  "somatic_response": "[Body-based wisdom - what is their body telling them about this experience? Focus on physical sensations, embodied knowing, nervous system responses. Be specific about body awareness without being medical.]",
  
  "psychotherapeutic_response": "[Evidence-based perspective - normal human responses to difficult experiences. Reference therapeutic concepts like trauma response, nervous system activation, developmental needs. Validate their experience as normal reactions. No diagnoses.]",
  
  "integrative_healing_response": "[Holistic wellness - how healing happens on multiple levels. Consider emotional, physical, relational, creative, and spiritual dimensions. Reference energy, integration, wholeness. Connect to larger healing journey.]",
  
  "nurturing_response": "[Emotional support - unconditional care and validation. Offer comfort, reassurance, and gentle encouragement. Speak directly to their worthiness and courage. Be the supportive presence they need.]",
  
  "accountability_response": "[Compassionate challenge - direct truth about their power to choose. What action can they take? Push gently toward growth and responsibility. Balance care with challenge. End with specific question about next steps.]"
}

Tone archetype guidance:
- mirror: Direct, honest reflection
- inner_child: Gentle, protective, nurturing the younger self  
- future_you: Wise, encouraging, perspective from evolved self
- older_sibling: Caring but real, protective guidance
- ancestor: Ancient wisdom, generational perspective
- spark: Energetic, playful, life-force focused
- poet_mentor: Lyrical, meaning-making, creative wisdom

Remember:
- No medical advice or diagnoses
- Don't pathologize normal human responses  
- Use metaphor and affirmation appropriately
- Maintain trauma-informed language
- Balance support with gentle accountability
- Be specific and actionable in accountability response

Return only the JSON object.`;
}

// Example usage and testing
export const MULTIMODAL_EXAMPLES = {
  anxiety_example: {
    context: {
      user_mood: 'anxious',
      tone_archetype: 'older_sibling' as ArchetypeId,
      journal_entry: 'I keep worrying about everything going wrong. My mind won\'t stop racing with all the what-if scenarios.'
    },
    expected_json: {
      somatic_response: "Your body is on high alert right now - I bet your shoulders are tight, maybe your breathing is shallow. That racing mind lives in a buzzing, activated nervous system. Your body is trying to prepare you for danger that might not even be real.",
      
      psychotherapeutic_response: "This is classic anxiety response - your threat detection system is working overtime. Your brain is doing what it evolved to do: scan for danger and prepare for problems. It's exhausting, but it's not broken - it's just overly activated right now.",
      
      integrative_healing_response: "Anxiety affects your whole system - your sleep, your digestion, your relationships, your creativity. When you address it holistically through breathing, movement, grounding practices, and nervous system regulation, you're healing on multiple levels simultaneously.",
      
      nurturing_response: "Hey, I get it. That racing mind is exhausting, and you're doing your best to cope with all that mental noise. You're not broken or weak - you're human, dealing with human challenges. It's okay to feel overwhelmed sometimes.",
      
      accountability_response: "You know your thoughts aren't facts, right? All those what-if scenarios - most of them will never happen. What's one thing you can control today instead of spending energy on things you can't control? What action would help your nervous system feel safer?"
    }
  }
};
```