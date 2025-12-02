/**
 * ALCHM Emotional Awareness Pathway
 * 
 * The foundation of all healing: learning to recognize, name, and feel emotions fully.
 * This is where every journey begins — with the courage to feel.
 */

import type { Pathway } from '@/types/pathways';

export const EMOTIONAL_AWARENESS_PATHWAY: Pathway = {
  id: 'emotional-awareness',
  title: 'Emotional Awareness',
  subtitle: 'The Foundation of All Healing',
  description: 'Learn to recognize, name, and feel your emotions fully. This is where every journey begins — with the courage to feel.',
  icon: 'wave',
  color: '#6B7FD7',
  
  difficulty: 'gentle',
  estimatedDuration: '1-2 weeks',
  totalXP: 350,
  
  archetypeGuide: 'The Witness',
  coreWound: 'Emotional disconnection or overwhelm',
  coreGift: 'Emotional fluency and resilience',
  
  lessons: [
    // AWAKENING
    {
      id: 'ea-1-landscape-of-feeling',
      pathwayId: 'emotional-awareness',
      order: 1,
      stage: 'awakening',
      type: 'teaching',
      title: 'The Landscape of Feeling',
      subtitle: 'You are not your emotions. You are the one who feels them.',
      epigraph: {
        text: 'The only way out is through.',
        attribution: 'Robert Frost'
      },
      sections: [
        {
          type: 'text',
          content: `Most of us were never taught what to do with our feelings. We learned to suppress them, perform them, or be overwhelmed by them. But there is another way: to be with them.`
        },
        {
          type: 'teaching',
          content: `Emotions are not problems to solve. They are messengers carrying vital information about our needs, boundaries, and desires. When we learn to listen, they become our greatest guides.`
        },
        {
          type: 'question',
          content: `Think of an emotion you tend to avoid. What might happen if you welcomed it instead?`,
          pauseForReflection: true
        },
        {
          type: 'story',
          storyType: 'parable',
          content: `There is a Sufi teaching about a man who tried to outrun his shadow. He ran faster and faster, but his shadow kept pace. Finally, exhausted, he sat down in the shade of a tree — and his shadow disappeared. Our emotions work the same way. The more we run, the more they chase. When we stop and allow ourselves to rest in awareness, they integrate naturally.`
        }
      ],
      practices: [
        {
          id: 'ea-1-body-scan',
          type: 'bodywork',
          title: 'The Body Scan',
          intention: 'To reconnect with the physical reality of emotion',
          duration: '10 minutes',
          instructions: [
            'Find a comfortable position, sitting or lying down.',
            'Close your eyes and take three deep breaths.',
            'Beginning at the top of your head, slowly move your attention down through your body.',
            'At each region — head, face, neck, shoulders, arms, chest, belly, hips, legs, feet — pause and notice.',
            'What sensations are present? Tension? Warmth? Numbness? Tingling?',
            'Don\'t try to change anything. Simply notice with curiosity.',
            'When you reach your feet, take a full breath and gently open your eyes.'
          ],
          closingReflection: 'What did you discover? Where does your body hold the most tension?'
        }
      ],
      journalPrompts: [
        {
          prompt: 'What was your family\'s relationship with emotions? What did you learn was acceptable to feel, and what was not?',
          depth: 'deep',
          pillarConnection: 'shadow'
        },
        {
          prompt: 'List five emotions you\'ve felt today. For each, note where you felt it in your body.',
          depth: 'surface',
          pillarConnection: 'body'
        }
      ],
      xpReward: 50,
      completionAffirmation: 'You have taken the first step. Awareness is the beginning of all transformation.',
      minimumTimeMinutes: 15
    },
    
    // AWAKENING (continued)
    {
      id: 'ea-2-vocabulary-of-feeling',
      pathwayId: 'emotional-awareness',
      order: 2,
      stage: 'awakening',
      type: 'teaching',
      title: 'The Vocabulary of Feeling',
      subtitle: 'If you can name it, you can work with it.',
      sections: [
        {
          type: 'teaching',
          content: `Research shows that the simple act of naming an emotion reduces its intensity. This is called "affect labeling." When we put language to feeling, we engage the prefrontal cortex, which helps regulate the emotional brain. Naming is taming.`
        },
        {
          type: 'text',
          content: `Most people operate with a vocabulary of five emotions: happy, sad, angry, scared, fine. But human experience is infinitely more nuanced. The difference between "sad" and "melancholy" is vast. Between "angry" and "betrayed" is a universe.`
        },
        {
          type: 'teaching',
          content: `We will work with an expanded emotional vocabulary, building your capacity to name precisely what you feel. Precision creates power.`
        }
      ],
      practices: [
        {
          id: 'ea-2-emotional-granularity',
          type: 'journaling',
          title: 'Emotional Granularity Exercise',
          intention: 'To expand your emotional vocabulary',
          duration: '15 minutes',
          instructions: [
            'Think of a recent experience that stirred emotion.',
            'Write the first emotion word that comes to mind.',
            'Now, go deeper. Was it really "sad"? Or was it disappointed? Grieving? Longing? Wistful?',
            'Try to find at least 5 different words that capture nuances of what you felt.',
            'For each word, write one sentence about why that word fits.'
          ]
        }
      ],
      journalPrompts: [
        {
          prompt: 'What emotion do you feel most often but rarely name? What might change if you named it precisely?',
          depth: 'medium',
          pillarConnection: 'therapist'
        }
      ],
      xpReward: 50,
      completionAffirmation: 'Your vocabulary is expanding. With new words come new possibilities.',
      minimumTimeMinutes: 12
    },
    
    // DEEPENING
    {
      id: 'ea-3-emotions-you-exile',
      pathwayId: 'emotional-awareness',
      order: 3,
      stage: 'deepening',
      type: 'reflection',
      title: 'The Emotions You Exile',
      subtitle: 'What we cannot feel, we cannot heal.',
      triggerWarning: 'This lesson explores emotions that may have been forbidden in your upbringing.',
      sections: [
        {
          type: 'text',
          content: `Every family, every culture, has emotions that are acceptable and emotions that are not. Perhaps anger was forbidden in your home. Perhaps sadness was seen as weakness. Perhaps joy made you a target.`
        },
        {
          type: 'question',
          content: `What emotion, if you expressed it fully, would most shock the people who raised you?`,
          pauseForReflection: true
        },
        {
          type: 'teaching',
          content: `Exiled emotions don't disappear. They go underground. They emerge sideways — as anxiety, numbness, depression, physical symptoms, or eruptions we don't understand. Reclaiming them is essential work.`
        }
      ],
      practices: [
        {
          id: 'ea-3-meeting-exiled-emotion',
          type: 'dialogue',
          title: 'Meeting the Exiled Emotion',
          intention: 'To begin dialogue with a forbidden feeling',
          duration: '15-20 minutes',
          instructions: [
            'Identify one emotion that was not allowed in your childhood.',
            'Close your eyes. Imagine this emotion as a character, a figure, a presence.',
            'What does it look like? How old is it? Where has it been living?',
            'In your mind, approach it gently. Say: "I see you. I know you\'ve been waiting."',
            'Ask it: "What do you need me to know?"',
            'Listen. Whatever comes is valid.',
            'Thank this part of yourself for surviving, for waiting.',
            'Slowly return to the room.'
          ],
          closingReflection: 'What did you learn? What does this exiled emotion need from you?'
        }
      ],
      journalPrompts: [
        {
          prompt: 'Write a letter to an emotion you\'ve rejected. Apologize for exiling it. Ask what it needs.',
          depth: 'deep',
          pillarConnection: 'shadow'
        }
      ],
      xpReward: 50,
      completionAffirmation: 'You are calling yourself home, one exiled piece at a time.',
      minimumTimeMinutes: 20,
      groundingPractice: {
        id: 'ea-3-grounding-breath',
        type: 'breathwork',
        title: 'Grounding Breath',
        intention: 'To return to the present moment',
        duration: '2 minutes',
        instructions: [
          'Feel your feet on the floor.',
          'Breathe in for 4 counts.',
          'Hold for 4 counts.',
          'Exhale for 6 counts.',
          'Repeat 4 times.',
          'Name 3 things you can see in the room.'
        ]
      }
    },
    
    // DESCENT
    {
      id: 'ea-4-sitting-in-fire',
      pathwayId: 'emotional-awareness',
      order: 4,
      stage: 'descent',
      type: 'practice',
      title: 'Sitting in the Fire',
      subtitle: 'The only way to complete an emotion is to feel it.',
      sections: [
        {
          type: 'text',
          content: `We have spent our lives trying to escape discomfort. Today, we practice staying. Not forever — but longer than usual. Long enough for the emotion to complete its cycle.`
        },
        {
          type: 'teaching',
          content: `Emotions, when fully felt, have a natural lifespan. Research suggests most emotions, if not fed by rumination, last about 90 seconds. But we rarely give them 90 seconds. We distract, numb, or argue with them. Today, we let them be.`
        }
      ],
      practices: [
        {
          id: 'ea-4-ninety-second-practice',
          type: 'meditation',
          title: 'The 90-Second Practice',
          intention: 'To experience an emotion from beginning to end',
          duration: '10-15 minutes',
          hasGuidedAudio: true,
          instructions: [
            'Bring to mind a situation that evokes emotion — start with something moderately difficult, not your deepest wound.',
            'Notice where the emotion lives in your body.',
            'Set a timer for 90 seconds.',
            'For these 90 seconds, simply feel. No story, no narrative, no "why." Just sensation.',
            'Breathe into the sensation. Allow it to be exactly as it is.',
            'Notice: Does it shift? Move? Intensify? Soften?',
            'When the timer sounds, take three deep breaths.',
            'Notice what remains.'
          ],
          closingReflection: 'What happened when you stopped resisting and simply felt?'
        }
      ],
      journalPrompts: [
        {
          prompt: 'Describe the emotion you just felt as if it were weather. What kind of storm was it? How did it move through?',
          depth: 'medium',
          pillarConnection: 'body'
        }
      ],
      xpReward: 50,
      completionAffirmation: 'You sat in the fire and survived. This is the beginning of emotional freedom.',
      minimumTimeMinutes: 15,
      recommendedBreakAfter: true
    },
    
    // THRESHOLD
    {
      id: 'ea-5-core-wound',
      pathwayId: 'emotional-awareness',
      order: 5,
      stage: 'threshold',
      type: 'threshold',
      title: 'The Core Wound',
      subtitle: 'Every pattern leads back to a moment. Today, we approach that moment.',
      triggerWarning: 'This lesson invites contact with early emotional wounds. Go gently.',
      sections: [
        {
          type: 'text',
          content: `Behind every emotional pattern is a moment — or many moments — when we learned that feeling wasn't safe. This lesson is an invitation to approach that place with compassion.`
        },
        {
          type: 'quote',
          content: `"The wound is the place where the Light enters you." — Rumi`
        },
        {
          type: 'teaching',
          content: `You do not have to "fix" anything today. You do not have to resolve or release. You are simply making contact. Witnessing. Letting that younger part of you know: I'm here now. You're not alone anymore.`
        }
      ],
      practices: [
        {
          id: 'ea-5-meeting-younger-self',
          type: 'visualization',
          title: 'Meeting the Younger Self',
          intention: 'To offer presence to an earlier version of yourself who needed it',
          duration: '20 minutes',
          hasGuidedAudio: true,
          instructions: [
            'Close your eyes. Take several deep breaths.',
            'Allow your mind to drift back to an early moment of emotional pain. Don\'t force it — let a memory surface.',
            'See yourself at that age. Notice how young you were. What you were wearing. Where you were.',
            'Approach your younger self slowly, with love.',
            'Sit beside them. You don\'t need to say anything.',
            'If it feels right, put a gentle hand on their shoulder.',
            'Let them know: "I\'m from your future. You survive this. You survive everything that comes."',
            'Ask if there\'s anything they need. Listen.',
            'Stay as long as feels right.',
            'When ready, let them know you\'ll return. Slowly come back to the present.'
          ],
          closingReflection: 'What did your younger self need? What did you learn about your patterns?'
        }
      ],
      journalPrompts: [
        {
          prompt: 'Write a letter from your current self to yourself at the age you just visited. Tell them what you wish they knew.',
          depth: 'deep',
          pillarConnection: 'nurturer'
        }
      ],
      xpReward: 75,
      completionAffirmation: 'You approached the wound with compassion. This is sacred work.',
      minimumTimeMinutes: 25,
      groundingPractice: {
        id: 'ea-5-self-holding',
        type: 'bodywork',
        title: 'Self-Holding Practice',
        intention: 'To provide physical comfort',
        duration: '3 minutes',
        instructions: [
          'Cross your arms and place each hand on the opposite shoulder.',
          'Give yourself a gentle squeeze.',
          'Rock slightly if it feels soothing.',
          'Say to yourself: "I\'m here. I\'m safe. I\'m loved."',
          'Breathe deeply for several breaths.',
          'Release when ready.'
        ]
      },
      recommendedBreakAfter: true
    },
    
    // INTEGRATION
    {
      id: 'ea-6-making-meaning',
      pathwayId: 'emotional-awareness',
      order: 6,
      stage: 'integration',
      type: 'integration',
      title: 'Making Meaning',
      subtitle: 'Transformation happens when we weave our experiences into a larger story.',
      sections: [
        {
          type: 'text',
          content: `You have traveled deep. You have felt what was unfelt. You have met younger versions of yourself. Now we begin to integrate — to make meaning of the journey so far.`
        },
        {
          type: 'teaching',
          content: `Integration is not about deciding everything is "fine" or "for the best." It is about acknowledging what happened, honoring its impact, and choosing what you carry forward. You cannot change the past. But you can change your relationship to it.`
        },
        {
          type: 'question',
          content: `What strength did your emotional struggles forge in you? What capacity do you have now that you wouldn\'t have without that pain?`,
          pauseForReflection: true
        }
      ],
      practices: [
        {
          id: 'ea-6-integration-narrative',
          type: 'journaling',
          title: 'The Integration Narrative',
          intention: 'To write your story with new understanding',
          duration: '20-30 minutes',
          instructions: [
            'You are going to write the story of your emotional journey.',
            'Begin: "I was a child who learned that emotions were..."',
            'Write about what you learned, how you coped, what you shut down.',
            'Then write: "And now I am someone who..."',
            'Write about who you are becoming. What\'s changing. What\'s possible.',
            'End with: "My emotions are now..."',
            'Let the writing flow. Don\'t edit.'
          ]
        }
      ],
      journalPrompts: [
        {
          prompt: 'If your emotional journey were a book, what would you title each chapter? What would the final chapter be called?',
          depth: 'medium',
          pillarConnection: 'sage'
        }
      ],
      xpReward: 50,
      completionAffirmation: 'You are authoring a new story. This is the power of integration.',
      minimumTimeMinutes: 20
    },
    
    // EMERGENCE
    {
      id: 'ea-7-feeling-self',
      pathwayId: 'emotional-awareness',
      order: 7,
      stage: 'emergence',
      type: 'celebration',
      title: 'The Feeling Self',
      subtitle: 'You have crossed a threshold. You are not who you were.',
      sections: [
        {
          type: 'text',
          content: `Something has shifted. You may not be able to name it yet. But you have done profound work — you have faced emotions that were buried, welcomed parts that were exiled, and begun to build a new relationship with your inner world.`
        },
        {
          type: 'quote',
          content: `"We do not become healed by staying in the light. We become healed by shining light into the darkness." — Carl Jung`
        },
        {
          type: 'teaching',
          content: `Emergence is not a final destination. It is a threshold — you step through into a new way of being, but the journey continues. What you have learned here is the foundation for all the pathways to come.`
        }
      ],
      practices: [
        {
          id: 'ea-7-emergence-ritual',
          type: 'ritual',
          title: 'The Emergence Ritual',
          intention: 'To mark your transformation',
          duration: '10 minutes',
          instructions: [
            'Find or create a symbol of this journey — a stone, a drawing, a word written on paper.',
            'Hold it in your hands.',
            'Speak aloud (or silently): "I honor the part of me that disconnected from feeling. It kept me safe."',
            'Continue: "I welcome the part of me that is learning to feel again. I am ready for this."',
            'Continue: "I am becoming someone who feels fully and survives."',
            'Place the symbol somewhere you will see it — a reminder of this commitment.',
            'Take a deep breath. The pathway is complete.'
          ]
        }
      ],
      journalPrompts: [
        {
          prompt: 'What is different now? Complete this sentence: "Before this pathway, I... Now, I..."',
          depth: 'medium',
          pillarConnection: 'therapist'
        }
      ],
      xpReward: 75,
      completionAffirmation: 'You have completed Emotional Awareness. The foundation is laid. Every pathway that follows builds on what you have learned here.',
      minimumTimeMinutes: 15
    }
  ],
  
  supportResources: [
    {
      type: 'crisis',
      title: '988 Suicide & Crisis Lifeline',
      description: 'Call or text 988, available 24/7',
      phone: '988'
    },
    {
      type: 'book',
      title: 'The Language of Emotions',
      description: 'by Karla McLaren — An excellent guide to understanding emotions',
      url: 'https://karlamclaren.com/the-language-of-emotions/'
    }
  ]
};