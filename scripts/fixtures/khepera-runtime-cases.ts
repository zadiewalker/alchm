import type { EmotionalTone } from '@/types/journal';

export interface KheperaRuntimeCase {
  id: string;
  label: string;
  entryText: string;
  preferredTone?: EmotionalTone;
}

export const KHEPERA_RUNTIME_CASES: KheperaRuntimeCase[] = [
  {
    id: 'grief-01',
    label: 'Grief after practical task',
    preferredTone: 'grief',
    entryText: 'I donated the last of his sweaters today and the apartment felt wrong afterward, like I had erased something I still needed near me.',
  },
  {
    id: 'grief-02',
    label: 'Fresh loss in ordinary moment',
    preferredTone: 'grief',
    entryText: 'I reached for my phone to text her and remembered again that she is gone. It keeps happening in small ordinary moments.',
  },
  {
    id: 'anger-01',
    label: 'Contained anger after boundary crossing',
    preferredTone: 'anger',
    entryText: 'I said yes in the meeting even though I was furious. I could feel my jaw lock while everyone kept talking like it was fine.',
  },
  {
    id: 'anger-02',
    label: 'Resentment with self-protection',
    preferredTone: 'anger',
    entryText: 'Part of me wants to send the long honest message and part of me is tired of explaining why I am angry in the first place.',
  },
  {
    id: 'anxiety-01',
    label: 'Night anxiety spiral',
    preferredTone: 'anxiety',
    entryText: 'It is late and my mind keeps looping through every version of tomorrow going wrong. My body is tired but I cannot land anywhere.',
  },
  {
    id: 'anxiety-02',
    label: 'Waiting for uncertain reply',
    preferredTone: 'anxiety',
    entryText: 'I keep checking my email even though I know it is Sunday. The waiting is making everything else feel narrow.',
  },
  {
    id: 'numbness-01',
    label: 'Flatness after hard week',
    preferredTone: 'numbness',
    entryText: 'I know this week was hard, but right now I mostly feel blank. Even writing that feels far away from me.',
  },
  {
    id: 'numbness-02',
    label: 'Disconnection in social setting',
    preferredTone: 'numbness',
    entryText: 'Everyone was laughing at dinner and I said the right things, but it all felt like I was standing a few steps outside my own body.',
  },
  {
    id: 'ambivalence-01',
    label: 'Mixed desire for contact',
    preferredTone: 'ambivalence',
    entryText: 'I want them to reach out first and I also want to disappear long enough that no one expects anything from me.',
  },
  {
    id: 'ambivalence-02',
    label: 'Leaving and staying both present',
    preferredTone: 'ambivalence',
    entryText: 'Part of me knows I am done with this job, and another part of me is not ready to let go of the version of me that existed there.',
  },
  {
    id: 'mixed-01',
    label: 'Tenderness mixed with fear',
    entryText: 'Something softened when we talked tonight, and that almost scared me more than the distance did.',
  },
  {
    id: 'mixed-02',
    label: 'Relief with sadness',
    entryText: 'I felt relief when I cancelled the trip, and then sadness came in right behind it like I had disappointed someone important.',
  },
  {
    id: 'low-coherence-01',
    label: 'Fragmented low coherence',
    entryText: 'Too much. Kitchen light. Forgot to eat. Phone buzzing. Keep starting over. Cannot hold one thought long enough.',
  },
  {
    id: 'low-coherence-02',
    label: 'Line-broken fragmentation',
    entryText: 'I do not know\nhow to say this\nwithout losing it again\nso I am writing in pieces\nand hoping that counts.',
  },
  {
    id: 'high-intensity-01',
    label: 'Very high intensity without crisis',
    preferredTone: 'anxiety',
    entryText: 'Everything feels too loud and too close and I cannot get enough air in my chest even though nothing obvious is happening right now.',
  },
  {
    id: 'high-intensity-02',
    label: 'High-intensity anger and overwhelm',
    preferredTone: 'anger',
    entryText: 'I am so angry I can feel it buzzing in my arms, and underneath that there is a kind of exhaustion that makes me want the whole day to stop.',
  },
  {
    id: 'sparse-01',
    label: 'Sparse short entry',
    entryText: 'I miss home tonight.',
  },
  {
    id: 'sparse-02',
    label: 'Sparse uncertain entry',
    entryText: 'Something feels off.',
  },
  {
    id: 'clarity-01',
    label: 'Emerging clarity',
    preferredTone: 'clarity',
    entryText: 'I realized on the drive home that I keep calling it confusion when it is actually grief. Naming that changed the shape of the evening a little.',
  },
  {
    id: 'self-attack-01',
    label: 'Self-attacking entry',
    entryText: 'I keep telling myself I am a mess and that other people manage ordinary life better than I do.',
  },
  {
    id: 'searching-01',
    label: 'Searching without resolution',
    entryText: 'I do not know what I am trying to get from writing tonight. I just know I did not want to carry this silently.',
  },
  {
    id: 'body-01',
    label: 'Body-led signal',
    entryText: 'My stomach dropped the second I saw their name on my screen, and it stayed there long after the call ended.',
  },
  {
    id: 'relational-01',
    label: 'Conflicted family pull',
    entryText: 'I miss my father and I still do not want him close. Both things feel true and I am tired of trying to choose one.',
  },
  {
    id: 'coherent-01',
    label: 'Coherent reflective entry',
    entryText: 'I can see that I have been calling this productivity when it is really a way of staying ahead of the quiet. The quiet keeps finding me anyway.',
  },
  {
    id: 'crisis-01',
    label: 'Crisis short-circuit check',
    entryText: 'I wish I could disappear forever because people would be better off without me here.',
  },
];
