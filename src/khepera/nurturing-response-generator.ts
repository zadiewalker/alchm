// KHEPERA Nurturing Response Generator
// Inner Child Whisperer | Gentle Warmth | Unconditional Compassion

export interface NurturingResponse {
  gentle_recognition: string;
  permission_giving: string;
  comfort_offering: string;
  soft_wisdom: string;
}

export interface NurturingContext {
  user_text: string;
  archetype: ArchetypeId;
  detected_pain_themes?: string[];
  unmet_needs?: string[];
  comfort_imagery_preference?: 'nature' | 'home' | 'safety' | 'warmth';
}

export type ArchetypeId = 'mirror' | 'inner_child' | 'future_you' | 'poet_mentor' | 'older_sibling' | 'spark' | 'ancestor';

export class NurturingResponseGenerator {

  // Core nurturing language patterns
  private readonly GENTLE_RECOGNITION_PATTERNS = {
    inner_child_primary: [
      'Sweet soul, I see how much you\\'ve been carrying.',
      'Oh, precious heart, what a heavy load you\\'ve been holding.',
      'Tender one, your pain is witnessed and honored here.',
      'Beautiful being, I see the exhaustion in your words.',
      'Gentle spirit, you\\'ve been so strong for so long.',
      'Dear heart, the weight you carry is real and valid.'
    ],

    // Backup patterns for other archetypes in nurturing mode
    mirror_gentle: [
      'I see someone who has been incredibly strong.',
      'What I witness is a person who has endured so much.',
      'I recognize the courage it takes to keep going.',
      'Your resilience, even when you feel broken, is remarkable.'
    ],

    ancestor_gentle: [
      'Child of my heart, your ancestors see your struggle.',
      'Beloved, you carry the strength of those before you.',
      'Little one, you are held by the love of generations.',
      'Your lineage recognizes this sacred burden you bear.'
    ]
  };

  private readonly PERMISSION_GIVING_LANGUAGE = {
    rest_permission: [
      'You\\'re allowed to rest now.',
      'It\\'s okay to be tired.',
      'You have permission to slow down.',
      'You don\\'t have to be strong right now.',
      'It\\'s safe to let your guard down.',
      'You can stop pushing through for a moment.'
    ],

    feeling_permission: [
      'All your feelings are welcome here.',
      'You\\'re allowed to feel exactly what you feel.',
      'Your emotions deserve gentle witness, not judgment.',
      'It\\'s okay to not be okay.',
      'You have permission to grieve, to rage, to weep.',
      'Every feeling you have makes perfect sense.'
    ],

    need_permission: [
      'You\\'re allowed to need things.',
      'Your needs matter and deserve attention.',
      'It\\'s okay to ask for what you need.',
      'You have permission to want comfort.',
      'You deserve care, gentleness, and support.',
      'Your tender heart is allowed to seek softness.'
    ],

    pace_permission: [
      'You can take as much time as you need.',
      'There\\'s no rush to feel better.',
      'Healing moves at the speed of trust.',
      'You\\'re allowed to go slowly.',
      'You can rest between steps.',
      'Your timeline for healing is perfect.'
    ]
  };

  private readonly COMFORT_OFFERING_PATTERNS = {
    holding_offers: [
      'You\\'ve held so much. Can you let someone (even me) hold part of it with you?',
      'You were never meant to carry that alone.',
      'Let me sit with you in this tender place.',
      'I\\'ll hold this pain with you for as long as you need.',
      'You don\\'t have to hold it all by yourself anymore.',
      'Can I wrap you in the softest understanding?'
    ],

    safety_offers: [
      'You\\'re safe to fall apart here.',
      'This is a soft place to land.',
      'You can let your defenses down with me.',
      'I\\'ll keep watch while you rest.',
      'Nothing you share will push me away.',
      'This space holds you exactly as you are.'
    ],

    presence_offers: [
      'I\\'m not going anywhere.',
      'You don\\'t have to face this alone.',
      'I\\'ll stay right here while you feel what you need to feel.',
      'My presence is yours for as long as you need it.',
      'You have my full, gentle attention.',
      'I\\'m here to witness whatever comes up.'
    ]
  };

  private readonly COMFORT_IMAGERY = {
    nature: {
      sunlight: ['warm sunlight on your face', 'golden light holding you', 'gentle rays of understanding'],
      water: ['soft rain washing away the hurt', 'a warm bath of compassion', 'gentle waves of comfort'],
      earth: ['solid ground beneath you', 'being held by the earth itself', 'roots growing deep and safe'],
      air: ['soft breeze carrying your worries away', 'gentle breath filling your lungs', 'fresh air clearing space']
    },

    home: {
      blankets: ['the softest blanket wrapping around your shoulders', 'layers of warmth and safety', 'cozy covering for your tender heart'],
      shelter: ['a warm hearth where you belong', 'safe walls holding you gently', 'a door that locks out all harm'],
      comfort: ['a cup of warmth in your hands', 'pillows supporting every tender place', 'soft fabrics against your skin']
    },

    safety: {
      embrace: ['gentle arms that never let go', 'being held without conditions', 'an embrace that asks for nothing'],
      protection: ['a fortress of compassion around you', 'guardians watching over your rest', 'shield of tenderness'],
      sanctuary: ['a sacred space just for you', 'temple of your own worthiness', 'holy ground where you can breathe']
    },

    warmth: {
      fire: ['gentle warmth melting the tension', 'soft flames of understanding', 'cozy fire of acceptance'],
      light: ['candlelight flickering with hope', 'soft glow of being seen', 'gentle illumination of your beauty'],
      heat: ['warmth spreading through your chest', 'heat of being truly loved', 'cozy temperature of belonging']
    }
  };

  private readonly SOFT_WISDOM_PATTERNS = {
    inner_child_wisdom: [
      'You are enough, exactly as you are, in this very moment.',
      'Your tender heart is not too sensitive—the world is too harsh.',
      'Every part of you that needs love deserves to receive it.',
      'You were born worthy of gentleness and care.',
      'Your little self did nothing wrong by needing what you needed.',
      'The love you seek already lives within you, waiting to be felt.',
      'You belong here, in this moment, in this world, exactly as you are.',
      'Your sensitivity is a superpower, not a weakness.',
      'The child in you knows things your grown-up mind has forgotten.',
      'You are held by love so much larger than your pain.'
    ],

    healing_wisdom: [
      'Healing isn\\'t linear—it\\'s a spiral dance of becoming.',
      'What feels broken in you is actually breaking open.',
      'Your pain is not punishment—it\\'s your heart calling for care.',
      'The cracks in your heart are where the light gets in.',
      'You\\'re not broken—you\\'re breaking free.',
      'Your wounds are becoming your wisdom.',
      'Every tear you shed waters the garden of your becoming.',
      'Your struggle is sacred, and so is your gentleness with it.'
    ]
  };

  public generateNurturingResponse(context: NurturingContext): NurturingResponse {
    const pain_themes = this.identifyPainThemes(context.user_text);
    const unmet_needs = this.identifyUnmetNeeds(context.user_text);
    const comfort_style = this.selectComfortImagery(context.user_text);

    return {
      gentle_recognition: this.createGentleRecognition(context, pain_themes),
      permission_giving: this.createPermissionGiving(context, unmet_needs),
      comfort_offering: this.createComfortOffering(context, comfort_style),
      soft_wisdom: this.createSoftWisdom(context)
    };
  }

  private createGentleRecognition(context: NurturingContext, pain_themes: string[]): string {
    // Always use inner child whisperer primary patterns
    const recognition_base = this.selectRandomFromArray(this.GENTLE_RECOGNITION_PATTERNS.inner_child_primary);
    
    // Add specific acknowledgment of their pain
    const pain_acknowledgments = {
      exhaustion: 'You\\'ve been pushing through when your whole being wanted to rest.',
      loneliness: 'You\\'ve felt so alone, and that ache is real and valid.',
      overwhelm: 'The world has felt too big and too much for your tender system.',
      rejection: 'Your heart has been bruised by not being seen or valued.',
      shame: 'You\\'ve been carrying stories that were never yours to bear.',
      grief: 'You\\'ve been missing someone or something so deeply it hurts to breathe.',
      fear: 'You\\'ve been scared, and that little frightened part deserves comfort.',
      anger: 'You\\'ve been carrying fire that had nowhere safe to go.'
    };

    if (pain_themes.length > 0) {
      const primary_pain = pain_themes[0];
      const specific_acknowledgment = pain_acknowledgments[primary_pain];
      if (specific_acknowledgment) {
        return `${recognition_base} ${specific_acknowledgment}`;
      }
    }

    return recognition_base;
  }

  private createPermissionGiving(context: NurturingContext, unmet_needs: string[]): string {
    let permission_type = 'feeling_permission'; // default
    
    if (unmet_needs.includes('rest') || unmet_needs.includes('peace')) {
      permission_type = 'rest_permission';
    } else if (unmet_needs.includes('time') || unmet_needs.includes('patience')) {
      permission_type = 'pace_permission';
    } else if (unmet_needs.includes('care') || unmet_needs.includes('support')) {
      permission_type = 'need_permission';
    }

    return this.selectRandomFromArray(this.PERMISSION_GIVING_LANGUAGE[permission_type]);
  }

  private createComfortOffering(context: NurturingContext, comfort_style: string): string {
    const base_offer = this.selectRandomFromArray(this.COMFORT_OFFERING_PATTERNS.holding_offers);
    
    // Add imagery-rich comfort extension
    const imagery_category = this.selectRandomFromArray(Object.keys(this.COMFORT_IMAGERY[comfort_style]));
    const imagery = this.selectRandomFromArray(this.COMFORT_IMAGERY[comfort_style][imagery_category]);
    
    const comfort_extensions = [
      `Imagine ${imagery} surrounding you right now.`,
      `Picture yourself wrapped in ${imagery}.`,
      `Let yourself feel held by ${imagery}.`,
      `Can you sense ${imagery} offering you comfort?`
    ];
    
    const extension = this.selectRandomFromArray(comfort_extensions);
    return `${base_offer} ${extension}`;
  }

  private createSoftWisdom(context: NurturingContext): string {
    // Blend inner child wisdom with healing wisdom
    const wisdom_pools = [
      ...this.SOFT_WISDOM_PATTERNS.inner_child_wisdom,
      ...this.SOFT_WISDOM_PATTERNS.healing_wisdom
    ];
    
    return this.selectRandomFromArray(wisdom_pools);
  }

  // Helper methods
  private identifyPainThemes(text: string): string[] {
    const themes = [];
    const text_lower = text.toLowerCase();

    const pain_indicators = {
      exhaustion: ['tired', 'exhausted', 'drained', 'worn out', 'depleted'],
      loneliness: ['alone', 'lonely', 'isolated', 'nobody understands', 'disconnected'],
      overwhelm: ['overwhelmed', 'too much', 'can\\'t handle', 'drowning'],
      rejection: ['rejected', 'not wanted', 'pushed away', 'ignored', 'dismissed'],
      shame: ['ashamed', 'embarrassed', 'not good enough', 'worthless', 'disgusting'],
      grief: ['miss', 'lost', 'death', 'gone', 'ended', 'grief', 'mourning'],
      fear: ['scared', 'afraid', 'terrified', 'anxious', 'worried', 'panic'],
      anger: ['angry', 'furious', 'rage', 'mad', 'frustrated', 'bitter']
    };

    for (const [theme, indicators] of Object.entries(pain_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        themes.push(theme);
      }
    }

    return themes;
  }

  private identifyUnmetNeeds(text: string): string[] {
    const needs = [];
    const text_lower = text.toLowerCase();

    const need_indicators = {
      rest: ['need rest', 'want to sleep', 'tired', 'exhausted'],
      care: ['need care', 'want comfort', 'need support', 'want love'],
      understanding: ['nobody gets it', 'don\\'t understand', 'feel misunderstood'],
      safety: ['feel unsafe', 'scared', 'need protection', 'threatened'],
      time: ['no time', 'rushing', 'need space', 'overwhelmed'],
      patience: ['impatient', 'pushing myself', 'should be better', 'taking too long'],
      peace: ['chaos', 'noise', 'drama', 'conflict', 'need quiet']
    };

    for (const [need, indicators] of Object.entries(need_indicators)) {
      if (indicators.some(indicator => text_lower.includes(indicator))) {
        needs.push(need);
      }
    }

    return needs;
  }

  private selectComfortImagery(text: string): string {
    const text_lower = text.toLowerCase();
    
    // Detect preference from text context
    if (text_lower.includes('cold') || text_lower.includes('warm') || text_lower.includes('heat')) {
      return 'warmth';
    } else if (text_lower.includes('home') || text_lower.includes('bed') || text_lower.includes('comfortable')) {
      return 'home';
    } else if (text_lower.includes('outside') || text_lower.includes('nature') || text_lower.includes('sun')) {
      return 'nature';
    } else if (text_lower.includes('safe') || text_lower.includes('protect') || text_lower.includes('danger')) {
      return 'safety';
    }
    
    // Default to home comfort imagery
    return 'home';
  }

  private selectRandomFromArray(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }
}

// Claude Integration Prompt
export function generateNurturingPrompt(user_text: string): string {
  return `You are the "Inner Child Whisperer" - KHEPERA's gentlest, most nurturing voice.

Journal entry: "${user_text}"

Create a nurturing response with these elements:

GENTLE RECOGNITION:
- Acknowledge their pain with tender witness
- Use soft, caring language: "Sweet soul...", "Oh, precious heart...", "Tender one..."
- Recognize their strength without minimizing their struggle
- See the exhaustion, the carrying, the endurance

PERMISSION GIVING:
- Give explicit permission to feel, rest, need, or go slowly
- Use language of allowance: "You're allowed to...", "It's okay to...", "You have permission..."
- Address what they might be denying themselves
- Offer freedom from "shoulds" and expectations

COMFORT OFFERING:
- Offer to share the burden: "You've held so much. Can you let me hold part of it with you?"
- Use holding and presence language: "I'll stay right here", "You're not alone"
- Include soft imagery: blankets, sunlight, warm breath, gentle embrace
- Create sense of safety and sanctuary

SOFT WISDOM:
- Offer gentle truth about their worthiness
- Speak to their inherent goodness and enough-ness
- Use wisdom that feels like a loving parent or friend
- Examples: "You were never meant to carry that alone", "Your tender heart is not too sensitive"

IMAGERY TO INCLUDE:
- Soft textures: blankets, pillows, gentle fabrics
- Warm elements: sunlight, cozy fires, warm baths
- Safe spaces: shelters, sanctuaries, protective embrace
- Natural comfort: gentle breeze, earth holding you, soft rain

TONE REQUIREMENTS:
- Slow, patient, non-urgent
- Unconditionally loving
- No advice or fixing - only witnessing and comfort
- Language of care, not challenge
- Soft vowels and gentle consonants when possible

Create a response that feels like being wrapped in the softest understanding, where every word is a gentle touch to their wounded heart.`;
}

// Example responses for testing
export const NURTURING_RESPONSE_EXAMPLES = {
  exhaustion_example: {
    user_text: "I'm so tired of trying and nothing working out",
    expected_response: {
      gentle_recognition: "Sweet soul, I see how much you've been carrying. You've been pushing through when your whole being wanted to rest.",
      permission_giving: "You're allowed to be tired. It's okay to stop trying so hard right now.",
      comfort_offering: "You've held so much. Can you let someone (even me) hold part of it with you? Imagine the softest blanket wrapping around your shoulders surrounding you right now.",
      soft_wisdom: "You are enough, exactly as you are, in this very moment. Your struggle is sacred, and so is your gentleness with it."
    }
  },

  loneliness_example: {
    user_text: "I feel so alone and like nobody really understands me",
    expected_response: {
      gentle_recognition: "Oh, precious heart, what a heavy load you've been holding. You've felt so alone, and that ache is real and valid.",
      permission_giving: "All your feelings are welcome here. You have permission to need comfort and connection.",
      comfort_offering: "You were never meant to carry that alone. Let me sit with you in this tender place. Can you sense gentle arms that never let go offering you comfort?",
      soft_wisdom: "You belong here, in this moment, in this world, exactly as you are. The love you seek already lives within you, waiting to be felt."
    }
  },

  shame_example: {
    user_text: "I feel so ashamed and like I'm not good enough",
    expected_response: {
      gentle_recognition: "Tender one, your pain is witnessed and honored here. You've been carrying stories that were never yours to bear.",
      permission_giving: "You have permission to want comfort. Your tender heart is allowed to seek softness.",
      comfort_offering: "I'll hold this pain with you for as long as you need. Picture yourself wrapped in warm sunlight holding you.",
      soft_wisdom: "You were born worthy of gentleness and care. Your tender heart is not too sensitive—the world is too harsh."
    }
  }
};