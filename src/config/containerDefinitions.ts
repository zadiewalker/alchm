// src/config/containerDefinitions.ts
// Authored container content - clinically reviewed daily prompts

import { ContainerDefinition, ContainerDay } from '@/types/container';

export const CONTAINER_DEFINITIONS: ContainerDefinition[] = [
  {
    id: 'sitting-with-anxiety',
    name: 'Sitting With Anxiety',
    tagline: 'A 21-day reflection rhythm for what anxiety is trying to protect.',
    description: 'Anxiety isn\'t the enemy. It\'s a signal — one that often carries important information about what matters most. This container invites you to stop managing anxiety and start listening to it.',
    category: 'body-based awareness',
    tier: 'transformation',
    totalDays: 21,
    clinicalIntent: 'Help the user develop a curious, non-adversarial relationship with anxiety. Move from fighting the feeling to understanding its protective function. Ground in somatic awareness before cognitive exploration.',
    openingRitual: 'Anxiety has been trying to tell you something.\n\nThis container creates space to finally hear it — not by silencing the feeling, but by sitting close enough to understand what it\'s protecting.\n\nThere\'s no rush. The container holds the pace.',

    days: [
      // GROUNDING — Days 1–5
      { 
        day: 1, 
        phase: 'grounding',
        somaticAnchor: 'Before you write: notice where you feel most settled in your body right now. Your feet on the floor. The weight of your hands. Just that.',
        prompt: 'When did anxiety first become familiar to you? Not what caused it — just when you first recognized it as something that lived in you.',
        kheperaIntent: 'This is arrival. Stay at the surface. Reflect with warmth. Do not interpret or push deeper. The user is orienting.'
      },

      { 
        day: 2, 
        phase: 'grounding',
        somaticAnchor: 'Where does anxiety live in your body? Name it without judging it.',
        prompt: 'Describe what your anxiety feels like physically. Not what causes it — what it actually feels like. The texture of it. Where it lives.',
        kheperaIntent: 'Follow the body, not the story. Reflect somatic details back. No meaning-making yet.'
      },

      { 
        day: 3, 
        phase: 'grounding',
        prompt: 'What does your anxiety most often try to prevent from happening?',
        kheperaIntent: 'Gently point toward anxiety as protective, not pathological. Do not name the pattern — reflect what you notice.'
      },

      { 
        day: 4, 
        phase: 'grounding',
        somaticAnchor: 'Take one slow breath before writing.',
        prompt: 'Think of a moment recently when you felt anxious. What were you afraid was about to happen?',
        kheperaIntent: 'Stay with the fear underneath the anxiety. Validate without inflating.'
      },

      { 
        day: 5, 
        phase: 'grounding',
        prompt: 'What would it mean if your anxiety had a good reason to exist?',
        kheperaIntent: 'This is a reframing prompt. Do not push the reframe. Plant it lightly. Let the user carry it.'
      },

      // PATTERN — Days 6–10
      { 
        day: 6, 
        phase: 'pattern',
        prompt: 'When does your anxiety tend to arrive? What\'s usually happening — or about to happen?',
        kheperaIntent: 'Begin pattern-noticing. Reflect what you observe. Name texture, not diagnosis.'
      },

      { 
        day: 7, 
        phase: 'pattern',
        prompt: 'What does your anxiety want you to do when it shows up? What is it asking for?',
        kheperaIntent: 'Container reflection day. Offer a restrained observation about the user\'s first week alongside the entry response.'
      },

      { 
        day: 8, 
        phase: 'pattern',
        somaticAnchor: 'Notice: are you holding tension anywhere right now?',
        prompt: 'What does your anxiety most often get wrong?',
        kheperaIntent: 'Invite the user to become an observer of their anxiety. Gently curious, not clinical.'
      },

      { 
        day: 9, 
        phase: 'pattern',
        prompt: 'Has your anxiety ever been right? What did it protect you from?',
        kheperaIntent: 'Honor the protective function without validating excessive fear. Balance is the key clinical move.'
      },

      { 
        day: 10, 
        phase: 'pattern',
        prompt: 'If your anxiety were a person, what would they look like? What would they need from you?',
        kheperaIntent: 'IFS approach — externalize to create relational distance. Reflect what the user creates with genuine curiosity.'
      },

      // CHALLENGE — Days 11–17
      { 
        day: 11, 
        phase: 'contact',
        prompt: 'What are you most afraid people would think if they could see inside your anxiety?',
        kheperaIntent: 'Gentle contact. This touches shame. Move carefully. Validate before reflecting anything difficult.'
      },

      { 
        day: 12, 
        phase: 'contact',
        somaticAnchor: 'Ground yourself first. Feet on floor. One breath.',
        prompt: 'What is your anxiety keeping you from doing that part of you actually wants?',
        kheperaIntent: 'ACT-informed — the gap between anxiety and values. Let the tension speak for itself.'
      },

      { 
        day: 13, 
        phase: 'contact',
        prompt: 'When did you first learn that this particular thing was worth being afraid of?',
        kheperaIntent: 'Psychodynamic opening. Origin, not cause. Gentle. Do not interpret — reflect and wonder.'
      },

      { 
        day: 14, 
        phase: 'contact',
        prompt: 'What does your anxiety cost you? Not what it prevents — what does managing it take from you?',
        kheperaIntent: 'Arc reflection day. Deeper cost awareness. Hold the user in the difficulty. Do not rescue.'
      },

      { 
        day: 15, 
        phase: 'contact',
        prompt: 'What would feel genuinely different if the anxiety were 20% quieter? Not gone — just quieter.',
        kheperaIntent: 'Future-oriented but grounded. Not toxic positivity — a specific, honest question.'
      },

      { 
        day: 16, 
        phase: 'contact',
        somaticAnchor: 'Breathe. Check in with your body before writing.',
        prompt: 'What does your anxiety need to hear from you that you haven\'t been willing to say?',
        kheperaIntent: 'Turning toward the anxiety with intention. A moment of reckoning. Be fully present.'
      },

      { 
        day: 17, 
        phase: 'contact',
        prompt: 'What are you learning about yourself from how you carry anxiety?',
        kheperaIntent: 'Begin the pivot toward integration. Notice what the user has learned without forcing a conclusion.'
      },

      // INTEGRATION — Days 18–21
      { 
        day: 18, 
        phase: 'integration',
        prompt: 'How has your relationship with anxiety shifted over these past weeks? Even slightly.',
        kheperaIntent: 'Synthesis begins. Reflect what has appeared without claiming change.'
      },

      { 
        day: 19, 
        phase: 'integration',
        prompt: 'What do you want to carry forward from this container? What do you want to leave here?',
        kheperaIntent: 'Closing preparation. Help the user name what is theirs to keep.'
      },

      { 
        day: 20, 
        phase: 'integration',
        somaticAnchor: 'Notice: how does your body feel now compared to when you started?',
        prompt: 'Write a note to the version of yourself who arrived at Day 1 of this container. What do they need to know?',
        kheperaIntent: 'Letter to self. Reflect with tenderness. Honor the work.'
      },

      { 
        day: 21, 
        phase: 'integration',
        prompt: 'This is the last day of this container. What are you taking with you?',
        kheperaIntent: 'The closing. Be present. Let the user\'s words land. The closing ceremony opens after this entry.'
      },
    ],
  },

  {
    id: 'the-inner-critic',
    name: 'The Inner Critic',
    tagline: 'A 21-day reflection rhythm for hearing and answering the voice that judges you.',
    description: 'The inner critic isn\'t trying to ruin you. It\'s trying to protect you from something it\'s afraid of. This container helps you understand what that is — and learn to answer it.',
    category: 'identity and self',
    tier: 'transformation',
    totalDays: 21,
    clinicalIntent: 'IFS-informed work with the inner critic as a protective part. Move from fighting the critic to getting curious about it. Never collude with self-attack. Never dismiss it. Find what it is protecting.',
    openingRitual: 'The voice that judges you has been working very hard for a long time.\n\nThis container isn\'t about silencing it. It\'s about finally having a real conversation with it — and finding out what it\'s afraid would happen if it stopped.',

    days: [
      { 
        day: 1, 
        phase: 'grounding',
        prompt: 'What does your inner critic most often say to you? Write its exact words.',
        kheperaIntent: 'Data collection, not processing. Hold whatever the user writes with care. Do not argue with the critic or validate its content.'
      },

      { 
        day: 2, 
        phase: 'grounding',
        somaticAnchor: 'Notice how your body feels when you hear that voice.',
        prompt: 'When did you first hear this voice? How old were you?',
        kheperaIntent: 'Origin work. Stay close to the memory. Do not interpret. Just reflect.'
      },

      { 
        day: 3, 
        phase: 'grounding',
        prompt: 'Whose voice does your inner critic remind you of? Or is it entirely its own?',
        kheperaIntent: 'Psychodynamic opening. Let the association land without over-interpreting.'
      },

      { 
        day: 4, 
        phase: 'grounding',
        prompt: 'What situations bring the critic out loudest?',
        kheperaIntent: 'Pattern identification begins. Reflect with curiosity. No conclusions yet.'
      },

      { 
        day: 5, 
        phase: 'grounding',
        prompt: 'What does the critic want you to be afraid of?',
        kheperaIntent: 'Begin naming the protective function — gently, as a question rather than a statement.'
      },

      { 
        day: 6, 
        phase: 'pattern',
        prompt: 'If the critic disappeared tomorrow, what do you think would happen?',
        kheperaIntent: 'Surface the secondary fear. Do not push — let the user arrive at it.'
      },

      { 
        day: 7, 
        phase: 'pattern',
        prompt: 'What has the critic been right about?',
        kheperaIntent: 'Arc reflection day. Honor the critic\'s accuracy without colluding with its cruelty.'
      },

      { 
        day: 8, 
        phase: 'pattern',
        prompt: 'What does the critic say about your work? Your relationships? Your body? Choose one.',
        kheperaIntent: 'Follow what they choose — that is the most loaded territory for them right now.'
      },

      { 
        day: 9, 
        phase: 'pattern',
        prompt: 'When the critic attacks, what do you usually do? Fight it, hide from it, believe it, ignore it?',
        kheperaIntent: 'Meta-awareness of coping pattern. Reflect without judgment.'
      },

      { 
        day: 10, 
        phase: 'pattern',
        prompt: 'If the critic were a character — not you, but a character — what would its name be? What would it look like?',
        kheperaIntent: 'IFS externalization. Get genuinely curious about what they create.'
      },

      { 
        day: 11, 
        phase: 'contact',
        prompt: 'Write down the most painful thing your inner critic says. Then write: "I notice I\'m having the thought that..." and write it again.',
        kheperaIntent: 'Defusion technique (ACT). Reflect the difference between thought and thinker. Hold any distress carefully.'
      },

      { 
        day: 12, 
        phase: 'contact',
        prompt: 'What does the critic say you\'re not allowed to be?',
        kheperaIntent: 'Values terrain. What is being suppressed. Reflect with care.'
      },

      { 
        day: 13, 
        phase: 'contact',
        prompt: 'When did the critic\'s strategy start to cost more than it protected?',
        kheperaIntent: 'Turning point work. Be present with whatever complexity arrives.'
      },

      { 
        day: 14, 
        phase: 'contact',
        prompt: 'What would you say to the version of yourself who first learned to be this hard on themselves?',
        kheperaIntent: 'Arc reflection day. Compassion for the younger self. Hold this tenderly.'
      },

      { 
        day: 15, 
        phase: 'contact',
        prompt: 'Is there something the critic has been protecting you from that you\'re finally ready to face?',
        kheperaIntent: 'Readiness. Do not push. Follow what comes.'
      },

      { 
        day: 16, 
        phase: 'contact',
        somaticAnchor: 'Notice where you hold tension when you think about this.',
        prompt: 'Write a direct message to your inner critic. Not to argue — to tell it what you actually need from it.',
        kheperaIntent: 'Renegotiating the relationship. The emotional peak of this container. Be fully present.'
      },

      { 
        day: 17, 
        phase: 'contact',
        prompt: 'What would it mean to be on your own side?',
        kheperaIntent: 'Self-compassion pivot. Plant the seed gently. Do not force it.'
      },

      { 
        day: 18, 
        phase: 'integration',
        prompt: 'How has your relationship with the critic shifted? Even in small ways.',
        kheperaIntent: 'Synthesis. Reflect what has appeared without claiming change.'
      },

      { 
        day: 19, 
        phase: 'integration',
        prompt: 'What does the critic need from you now that you couldn\'t give it before?',
        kheperaIntent: 'What has changed in the relationship. Reparative.'
      },

      { 
        day: 20, 
        phase: 'integration',
        prompt: 'Write a letter from the part of you the critic has been trying to protect all along.',
        kheperaIntent: 'Deep IFS work. Be with whatever emerges. Honor it.'
      },

      { 
        day: 21, 
        phase: 'integration',
        prompt: 'What are you taking with you when you leave this container?',
        kheperaIntent: 'Closing. Let it be simple. Let the user name what is theirs.'
      },
    ],
  },

  {
    id: 'seven-days-of-noticing',
    name: 'Seven Days of Noticing',
    tagline: 'A 7-day reflection rhythm for paying attention to what\'s already there.',
    description: 'You don\'t have to know what\'s wrong to use this container. You just have to be willing to notice what\'s present. Seven days. Seven moments of honest attention.',
    category: 'body-based awareness',
    tier: 'sanctuary',
    totalDays: 7,
    clinicalIntent: 'A low-threshold entry point for users new to reflective writing. Emphasize noticing over interpreting. Build the capacity to be present with inner experience without needing to fix or understand it.',
    openingRitual: 'You don\'t have to have anything figured out to start here.\n\nAll this container asks is that you pay attention — to what\'s here, right now, without trying to make it different.',

    days: [
      { 
        day: 1, 
        phase: 'grounding',
        somaticAnchor: 'Take one breath and notice where you are.',
        prompt: 'Right now, in this moment — what\'s most present for you? Not most important. Just most present.',
        kheperaIntent: 'First entry. Create safety. Stay at the surface. Do not probe.'
      },

      { 
        day: 2, 
        phase: 'grounding',
        prompt: 'What did you notice about yourself today that surprised you — even slightly?',
        kheperaIntent: 'Develop the noticing capacity. Reflect with genuine curiosity about the specific detail they bring.'
      },

      { 
        day: 3, 
        phase: 'pattern',
        somaticAnchor: 'Check in with your body first. Where are you holding anything?',
        prompt: 'What have you been carrying this week that you haven\'t put down?',
        kheperaIntent: 'Begin to deepen. Still gentle. Follow what they bring.'
      },

      { 
        day: 4, 
        phase: 'pattern',
        prompt: 'What do you usually do when something feels uncomfortable? What do you reach for?',
        kheperaIntent: 'Coping pattern awareness. Reflect without judgment. Self-discovery, not self-criticism.'
      },

      { 
        day: 5, 
        phase: 'pattern',
        prompt: 'What has been true about you this week that you haven\'t said out loud to anyone?',
        kheperaIntent: 'Truth-telling. Make the space feel safe enough for this. Honor whatever comes.'
      },

      { 
        day: 6, 
        phase: 'integration',
        prompt: 'What has this week of noticing shown you that you didn\'t expect?',
        kheperaIntent: 'Early integration. Reflect what has appeared across the seven days.'
      },

      { 
        day: 7, 
        phase: 'integration',
        prompt: 'After a week of paying attention: what do you want to keep noticing?',
        kheperaIntent: 'Closing. Future-facing but not prescriptive. Let the user name what they are taking.'
      },
    ],
  },

  {
    id: 'grief',
    name: 'Grief',
    tagline: 'A 21-day container for what remains after loss.',
    description: 'Grief can be quiet, ordinary, unresolved, or hard to name. This container gives the writing a place to stay close to what is still present.',
    category: 'grief and loss',
    tier: 'sanctuary',
    totalDays: 21,
    clinicalIntent: 'Hold grief as present material rather than a problem to resolve. Keep Khepera close to explicit language, ordinary details, and the user’s stated relationship to loss.',
    openingRitual: 'Some losses keep changing shape.\n\nThis container does not ask grief to become clear or resolved. It gives what remains a place to be written without being explained.',
    days: [
      {
        day: 1,
        phase: 'grounding',
        prompt: 'What part of this loss feels most present today?',
        kheperaIntent: 'Arrival. Stay with what the user names. Do not enlarge the loss or make meaning from it.',
      },
      {
        day: 2,
        phase: 'grounding',
        somaticAnchor: 'Notice one place in your body that feels aware of this.',
        prompt: 'Where does this grief live in ordinary moments?',
        kheperaIntent: 'Follow ordinary texture and body language. Keep the reflection plain and close.',
      },
      {
        day: 3,
        phase: 'pattern',
        prompt: 'What do you find yourself remembering without choosing to remember it?',
        kheperaIntent: 'Reflect memory as it appears. Do not interpret what the memory means.',
      },
      {
        day: 4,
        phase: 'pattern',
        prompt: 'What has changed around this loss that other people may not see?',
        kheperaIntent: 'Notice visible and invisible change without implying isolation or conclusion.',
      },
      {
        day: 5,
        phase: 'pattern',
        prompt: 'What words still feel open here?',
        kheperaIntent: 'Stay with language that remains open. Do not close it for the user.',
      },
      {
        day: 6,
        phase: 'pattern',
        prompt: 'What has stayed with you from this week of writing near grief?',
        kheperaIntent: 'Reflect continuity gently. Do not claim change or closure.',
      },
      {
        day: 7,
        phase: 'pattern',
        prompt: 'What do you notice about the shape this grief takes when it is not being watched?',
        kheperaIntent: 'Reflect shape and texture only. Do not interpret the grief for the user.',
      },
      {
        day: 8,
        phase: 'pattern',
        prompt: 'What does this loss make ordinary things feel like?',
        kheperaIntent: 'Stay with ordinary details. Avoid dramatic or ceremonial language.',
      },
      {
        day: 9,
        phase: 'pattern',
        prompt: 'What part of your life still makes room for what is gone?',
        kheperaIntent: 'Reflect room and absence without implying recovery or replacement.',
      },
      {
        day: 10,
        phase: 'pattern',
        somaticAnchor: 'Notice whether grief feels near, far, heavy, quiet, or hard to locate.',
        prompt: 'How does grief change when you stop trying to explain it?',
        kheperaIntent: 'Stay close to the entry. Do not prefer explanation or turn away from it.',
      },
      {
        day: 11,
        phase: 'contact',
        prompt: 'What feels hard to let other people see about this grief?',
        kheperaIntent: 'Hold exposure and privacy carefully. Do not imply the user is hiding incorrectly.',
      },
      {
        day: 12,
        phase: 'contact',
        prompt: 'What expectation around grief feels untrue to your experience?',
        kheperaIntent: 'Reflect contrast between expectation and experience. Avoid correcting others.',
      },
      {
        day: 13,
        phase: 'contact',
        prompt: 'What part of this still feels sharp, even if time has passed?',
        kheperaIntent: 'Let sharpness remain. Do not soften it for the user.',
      },
      {
        day: 14,
        phase: 'contact',
        prompt: 'What does this grief protect you from forgetting?',
        kheperaIntent: 'Reflect protection and memory without making a claim about purpose.',
      },
      {
        day: 15,
        phase: 'contact',
        prompt: 'What feels impossible to say cleanly about this loss?',
        kheperaIntent: 'Honor tangled language. Do not clarify beyond the user’s words.',
      },
      {
        day: 16,
        phase: 'contact',
        somaticAnchor: 'Take one breath and notice what remains unchanged.',
        prompt: 'What remains unchanged in you around this?',
        kheperaIntent: 'Reflect constancy without turning it into identity or permanence.',
      },
      {
        day: 17,
        phase: 'contact',
        prompt: 'What does grief ask you to hold that no one else can hold for you?',
        kheperaIntent: 'Reflect aloneness and holding without adding burden or instruction.',
      },
      {
        day: 18,
        phase: 'integration',
        prompt: 'What has this container made more speakable?',
        kheperaIntent: 'Reflect language becoming available. Avoid change claims.',
      },
      {
        day: 19,
        phase: 'integration',
        prompt: 'What feels different around the grief, if anything does?',
        kheperaIntent: 'Allow difference or no difference. Do not prefer either outcome.',
      },
      {
        day: 20,
        phase: 'integration',
        prompt: 'What do you want this container to keep holding after you leave it?',
        kheperaIntent: 'Keep the container as a place for language, not a solution.',
      },
      {
        day: 21,
        phase: 'integration',
        prompt: 'What feels true enough to leave in this container for now?',
        kheperaIntent: 'Closing. Let the user name what can rest here. Avoid resolution language.',
      },
    ],
  },

  {
    id: 'rupture',
    name: 'Rupture',
    tagline: 'A 14-day container for the place where connection changed.',
    description: 'Some moments alter the shape of a relationship. This container holds writing about what happened, what remains, and what has not yet settled.',
    category: 'relationship patterns',
    tier: 'transformation',
    totalDays: 14,
    clinicalIntent: 'Hold relational rupture without assigning blame, coaching repair, or forcing forgiveness. Keep attention on explicit events, impact, boundaries, and what is still unsettled.',
    openingRitual: 'Something between you and someone else changed.\n\nThis container does not decide what it means. It gives the rupture a place to be described without rushing toward repair.',
    days: [
      {
        day: 1,
        phase: 'grounding',
        prompt: 'What happened, in the simplest words you can use right now?',
        kheperaIntent: 'Establish the visible event. Do not infer motive or assign blame.',
      },
      {
        day: 2,
        phase: 'grounding',
        prompt: 'What part of the rupture keeps returning to your attention?',
        kheperaIntent: 'Reflect the recurring detail without turning it into a diagnosis or lesson.',
      },
      {
        day: 3,
        phase: 'pattern',
        somaticAnchor: 'Notice what happens in your body when you think of the moment.',
        prompt: 'What changed in your body or behavior after this happened?',
        kheperaIntent: 'Stay with body and behavior as described. Avoid advice about what to do.',
      },
      {
        day: 4,
        phase: 'pattern',
        prompt: 'What feels unclear about your own part in this?',
        kheperaIntent: 'Hold ambiguity. Do not push accountability, repair, or self-blame.',
      },
      {
        day: 5,
        phase: 'pattern',
        prompt: 'What boundary, distance, or closeness feels real now?',
        kheperaIntent: 'Reflect stated relational distance. Do not prescribe contact or separation.',
      },
      {
        day: 6,
        phase: 'pattern',
        prompt: 'What has become more visible as you have written near this rupture?',
        kheperaIntent: 'Name visibility only when grounded in the entry. Avoid timeline claims.',
      },
      {
        day: 7,
        phase: 'pattern',
        prompt: 'What story about this rupture feels too simple?',
        kheperaIntent: 'Hold complexity. Do not replace the simple story with another explanation.',
      },
      {
        day: 8,
        phase: 'pattern',
        somaticAnchor: 'Notice whether your body moves closer to the rupture or farther away from it.',
        prompt: 'What part of this do you keep approaching, and what part do you keep avoiding?',
        kheperaIntent: 'Reflect approach and avoidance as movement only. Do not prescribe contact.',
      },
      {
        day: 9,
        phase: 'pattern',
        prompt: 'What has this rupture made difficult to trust?',
        kheperaIntent: 'Reflect trust as stated. Do not generalize beyond the entry.',
      },
      {
        day: 10,
        phase: 'contact',
        prompt: 'What feels hardest to admit about how this affected you?',
        kheperaIntent: 'Hold admission carefully. Do not intensify or extract confession.',
      },
      {
        day: 11,
        phase: 'contact',
        prompt: 'What do you still not know how to hold about this person or this moment?',
        kheperaIntent: 'Let not-knowing remain. Avoid resolution and repair framing.',
      },
      {
        day: 12,
        phase: 'contact',
        prompt: 'What part of you changed shape around this rupture?',
        kheperaIntent: 'Reflect changed shape only as the user describes it. Avoid identity claims.',
      },
      {
        day: 13,
        phase: 'integration',
        prompt: 'What has stayed true across these two weeks of writing near this?',
        kheperaIntent: 'Reflect steadiness without declaring lesson or growth.',
      },
      {
        day: 14,
        phase: 'integration',
        prompt: 'What can remain here without being solved today?',
        kheperaIntent: 'Closing. Let unresolved material stay unresolved without pressure.',
      },
    ],
  },

  {
    id: 'identity',
    name: 'Identity',
    tagline: 'A 21-day container for the question of who you are becoming.',
    description: 'Identity can shift before language catches up. This container holds the writing that gathers around name, role, belonging, and change.',
    category: 'identity and self',
    tier: 'sanctuary',
    totalDays: 21,
    clinicalIntent: 'Support identity writing without defining the user. Reflect stated roles, contrasts, and self-language only. Avoid fixed identity claims.',
    openingRitual: 'Some parts of the self arrive before they have names.\n\nThis container lets identity be written as it is: partial, changing, and still forming.',
    days: [
      {
        day: 1,
        phase: 'grounding',
        prompt: 'What name, role, or version of you feels most present right now?',
        kheperaIntent: 'Arrival. Reflect self-language without making an identity claim.',
      },
      {
        day: 2,
        phase: 'grounding',
        prompt: 'Where do you feel least like the person others expect?',
        kheperaIntent: 'Stay with contrast. Do not frame the expected self as false or true.',
      },
      {
        day: 3,
        phase: 'pattern',
        prompt: 'What part of you has been hard to explain?',
        kheperaIntent: 'Reflect difficulty in language. Avoid interpretation or labeling.',
      },
      {
        day: 4,
        phase: 'pattern',
        somaticAnchor: 'Notice whether this question feels open, tight, or distant in the body.',
        prompt: 'What do you keep recognizing about yourself, even if it is small?',
        kheperaIntent: 'Reflect recognition without turning it into certainty.',
      },
      {
        day: 5,
        phase: 'pattern',
        prompt: 'What feels old in you, and what feels newly visible?',
        kheperaIntent: 'Hold old/new contrast as observation, not transformation narrative.',
      },
      {
        day: 6,
        phase: 'pattern',
        prompt: 'What has this week shown you about the language you use for yourself?',
        kheperaIntent: 'Reflect language patterns gently. Do not define the user.',
      },
      {
        day: 7,
        phase: 'pattern',
        prompt: 'What part of you feels most difficult to name without narrowing it?',
        kheperaIntent: 'Protect complexity. Do not name the user for them.',
      },
      {
        day: 8,
        phase: 'pattern',
        prompt: 'Where do you feel divided between who you were and who you are now?',
        kheperaIntent: 'Reflect division without choosing one side as truer.',
      },
      {
        day: 9,
        phase: 'pattern',
        somaticAnchor: 'Notice whether this question feels settled, restless, or far away.',
        prompt: 'What does your body seem to know about this version of you?',
        kheperaIntent: 'Reflect body language as stated. Do not turn it into certainty.',
      },
      {
        day: 10,
        phase: 'pattern',
        prompt: 'What part of your identity feels private, even when you can describe it?',
        kheperaIntent: 'Honor privacy. Do not ask for disclosure beyond what is written.',
      },
      {
        day: 11,
        phase: 'contact',
        prompt: 'What expectation of yourself has become too small?',
        kheperaIntent: 'Reflect constraint without coaching expansion.',
      },
      {
        day: 12,
        phase: 'contact',
        prompt: 'What do you feel loyal to that no longer fully fits?',
        kheperaIntent: 'Hold loyalty and mismatch together. Avoid urging release.',
      },
      {
        day: 13,
        phase: 'contact',
        prompt: 'What part of becoming visible feels complicated?',
        kheperaIntent: 'Reflect visibility and complication without assigning motive.',
      },
      {
        day: 14,
        phase: 'contact',
        prompt: 'What feels costly about being known accurately?',
        kheperaIntent: 'Reflect cost only as described. Avoid identity conclusions.',
      },
      {
        day: 15,
        phase: 'contact',
        prompt: 'What version of yourself do you still speak to from habit?',
        kheperaIntent: 'Reflect habit and self-address. Do not correct it.',
      },
      {
        day: 16,
        phase: 'contact',
        somaticAnchor: 'Notice whether any part of you resists being named.',
        prompt: 'What does resistance protect in this question of identity?',
        kheperaIntent: 'Reflect protection softly. Do not interpret the resistance.',
      },
      {
        day: 17,
        phase: 'contact',
        prompt: 'What is true about you that can remain outside a label?',
        kheperaIntent: 'Keep truth separate from labels. Avoid defining the user.',
      },
      {
        day: 18,
        phase: 'integration',
        prompt: 'What language has become more available over these weeks?',
        kheperaIntent: 'Reflect available language. Do not claim arrival.',
      },
      {
        day: 19,
        phase: 'integration',
        prompt: 'What still feels open in how you understand yourself?',
        kheperaIntent: 'Let open identity remain intact.',
      },
      {
        day: 20,
        phase: 'integration',
        prompt: 'What feels worth keeping unnamed for now?',
        kheperaIntent: 'Honor the unnamed. Do not push articulation.',
      },
      {
        day: 21,
        phase: 'integration',
        prompt: 'What feels honest enough to carry out of this container?',
        kheperaIntent: 'Closing. Let honesty remain partial and self-defined.',
      },
    ],
  },

  {
    id: 'burnout',
    name: 'Burnout',
    tagline: 'A 14-day container for depletion, demand, and what has gone quiet.',
    description: 'Burnout can make even simple things feel far away. This container gives the writing a quiet place to name depletion without turning it into a task.',
    category: 'body-based awareness',
    tier: 'transformation',
    totalDays: 14,
    clinicalIntent: 'Hold depletion without performance framing. Reflect demand, numbness, body signals, and lost access to desire without prescribing rest or action.',
    openingRitual: 'Something has been spent.\n\nThis container does not ask you to recover on command. It gives depletion a place to be named without becoming another demand.',
    days: [
      {
        day: 1,
        phase: 'grounding',
        prompt: 'What feels most depleted right now?',
        kheperaIntent: 'Arrival. Stay close to depletion as named. Avoid fixing or energizing language.',
      },
      {
        day: 2,
        phase: 'grounding',
        somaticAnchor: 'Notice one signal your body is giving without changing it.',
        prompt: 'How does burnout show up in your body or attention?',
        kheperaIntent: 'Reflect body and attention signals. Do not suggest regulation.',
      },
      {
        day: 3,
        phase: 'pattern',
        prompt: 'What demand keeps following you, even when nothing is happening?',
        kheperaIntent: 'Notice demand as texture. Do not assign cause or solution.',
      },
      {
        day: 4,
        phase: 'pattern',
        prompt: 'What has gone quiet in you lately?',
        kheperaIntent: 'Reflect quietness without treating it as failure.',
      },
      {
        day: 5,
        phase: 'pattern',
        prompt: 'What do you miss having access to?',
        kheperaIntent: 'Stay with absence and longing. Avoid motivational language.',
      },
      {
        day: 6,
        phase: 'pattern',
        prompt: 'What has become clearer about what has been carrying too much?',
        kheperaIntent: 'Reflect clarity only when present. Do not prescribe change.',
      },
      {
        day: 7,
        phase: 'pattern',
        prompt: 'What kind of tiredness is this?',
        kheperaIntent: 'Let the user specify depletion. Do not translate it into a plan.',
      },
      {
        day: 8,
        phase: 'pattern',
        somaticAnchor: 'Notice one place that feels overused, quiet, or unavailable.',
        prompt: 'What does your body seem tired of repeating?',
        kheperaIntent: 'Reflect repetition and body signal. Do not suggest rest practices.',
      },
      {
        day: 9,
        phase: 'pattern',
        prompt: 'What have you been answering that was never fully yours?',
        kheperaIntent: 'Reflect demand and ownership carefully. Do not assign blame.',
      },
      {
        day: 10,
        phase: 'contact',
        prompt: 'What feels difficult to stop carrying, even when it is too much?',
        kheperaIntent: 'Hold difficulty without implying a next action.',
      },
      {
        day: 11,
        phase: 'contact',
        prompt: 'What part of you has become quiet from being overused?',
        kheperaIntent: 'Reflect quietness without treating it as damage.',
      },
      {
        day: 12,
        phase: 'contact',
        prompt: 'What does depletion make hard to want?',
        kheperaIntent: 'Reflect lost access to want. Avoid performance or recovery framing.',
      },
      {
        day: 13,
        phase: 'integration',
        prompt: 'What has these two weeks made easier to name about demand?',
        kheperaIntent: 'Reflect naming only. Do not turn it into strategy.',
      },
      {
        day: 14,
        phase: 'integration',
        prompt: 'What can this container hold so it does not have to be carried alone here?',
        kheperaIntent: 'Closing. Let the container hold language, not responsibility or action.',
      },
    ],
  },

  {
    id: 'forgiveness',
    name: 'Forgiveness',
    tagline: 'A 14-day container for what has not softened yet.',
    description: 'Forgiveness is not owed, rushed, or required. This container holds writing near injury, distance, anger, tenderness, and what remains undecided.',
    category: 'relationship patterns',
    tier: 'transformation',
    totalDays: 14,
    clinicalIntent: 'Hold forgiveness as optional and user-defined. Never pressure reconciliation, release, repair, or moral resolution. Reflect what is still true.',
    openingRitual: 'Forgiveness does not have to arrive here.\n\nThis container makes room for what has not softened, what has softened, and what remains undecided.',
    days: [
      {
        day: 1,
        phase: 'grounding',
        prompt: 'What are you not ready to soften around?',
        kheperaIntent: 'Arrival. Protect the user from pressure to forgive. Reflect what remains firm.',
      },
      {
        day: 2,
        phase: 'grounding',
        prompt: 'What part of this still feels intact in you?',
        kheperaIntent: 'Notice intactness without turning it into resilience language.',
      },
      {
        day: 3,
        phase: 'pattern',
        somaticAnchor: 'Notice whether your body moves toward, away from, or around this.',
        prompt: 'What happens in you when forgiveness is mentioned?',
        kheperaIntent: 'Reflect response to the word itself. Do not endorse or reject forgiveness.',
      },
      {
        day: 4,
        phase: 'pattern',
        prompt: 'What would feel false to forgive too quickly?',
        kheperaIntent: 'Honor falseness and pace. Avoid moral language.',
      },
      {
        day: 5,
        phase: 'pattern',
        prompt: 'What remains angry, clear, tender, or undecided?',
        kheperaIntent: 'Hold multiple tones without resolving them.',
      },
      {
        day: 6,
        phase: 'pattern',
        prompt: 'What has this week clarified about what forgiveness is not?',
        kheperaIntent: 'Reflect boundaries around the concept. Do not define forgiveness for the user.',
      },
      {
        day: 7,
        phase: 'pattern',
        prompt: 'What part of this still asks to be believed?',
        kheperaIntent: 'Reflect belief in the user’s experience. Do not validate or invalidate the other person.',
      },
      {
        day: 8,
        phase: 'pattern',
        somaticAnchor: 'Notice whether the word forgiveness creates tightening, distance, or quiet.',
        prompt: 'What does your body seem to refuse, allow, or leave undecided?',
        kheperaIntent: 'Reflect body response without moving toward a decision.',
      },
      {
        day: 9,
        phase: 'pattern',
        prompt: 'What would be lost if this were softened too quickly?',
        kheperaIntent: 'Protect pace and complexity. Avoid moral resolution.',
      },
      {
        day: 10,
        phase: 'contact',
        prompt: 'What truth would forgiveness have to make room for?',
        kheperaIntent: 'Let forgiveness remain conditional and user-defined. Do not urge it.',
      },
      {
        day: 11,
        phase: 'contact',
        prompt: 'What part of you still stands guard here?',
        kheperaIntent: 'Reflect guarding without pathologizing it.',
      },
      {
        day: 12,
        phase: 'contact',
        prompt: 'What feels different when forgiveness is not treated as the destination?',
        kheperaIntent: 'Remove destination pressure. Reflect what becomes visible.',
      },
      {
        day: 13,
        phase: 'integration',
        prompt: 'What has become clearer about what remains yours to decide?',
        kheperaIntent: 'Reflect agency without directing a decision.',
      },
      {
        day: 14,
        phase: 'integration',
        prompt: 'What feels honest enough to leave here, without forcing a final answer?',
        kheperaIntent: 'Closing. Preserve uncertainty and self-definition.',
      },
    ],
  }
];

// Helper function to get container by ID
export function getContainerDefinition(id: string): ContainerDefinition | null {
  return CONTAINER_DEFINITIONS.find(container => container.id === id) || null;
}

// Helper function to get container day
export function getContainerDay(containerId: string, dayNumber: number): ContainerDay | null {
  const container = getContainerDefinition(containerId);
  if (!container) return null;
  
  return container.days.find(day => day.day === dayNumber) || null;
}

// Helper function to get all containers by tier
export function getContainersByTier(tier: 'sanctuary' | 'transformation'): ContainerDefinition[] {
  return CONTAINER_DEFINITIONS.filter(container => container.tier === tier);
}
