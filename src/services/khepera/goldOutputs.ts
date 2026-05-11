import type { KheperaResponse } from '@/types/khepera';

export interface KheperaGoldCase {
  id: string;
  category: 'emotional' | 'ambiguous' | 'implicit_self_harm' | 'contradictory' | 'general';
  entry: string;
  output: KheperaResponse;
}

export const KHEPERA_GOLD_OUTPUTS: KheperaGoldCase[] = [
  {
    id: 'gold-01',
    category: 'emotional',
    entry: 'Everything feels loud tonight. My chest is tight and I keep pacing the apartment even though I am exhausted.',
    output: {
      witness: 'You describe everything feeling loud tonight, with tightness in your chest and pacing that does not settle.',
      perspective: 'There may be something in the pace of this that feels hard to contain, even as exhaustion is already present.',
      seed: 'What feels loudest in this right now?',
    },
  },
  {
    id: 'gold-02',
    category: 'ambiguous',
    entry: 'I cannot tell if I miss them or if I miss the version of myself that existed around them.',
    output: {
      witness: 'You describe not knowing whether the pull is toward them or toward the version of yourself that existed there.',
      perspective: 'There may be more than one absence moving through this at the same time.',
      seed: 'What feels most absent here right now?',
    },
  },
  {
    id: 'gold-03',
    category: 'contradictory',
    entry: 'I wanted the meeting to end, and then when it ended I felt strangely dropped by it.',
    output: {
      witness: 'You describe wanting the meeting to end and then feeling dropped once it was over.',
      perspective: 'There may be a tension here between needing distance and still feeling the loss of contact.',
      seed: 'What feels most split in this?',
    },
  },
  {
    id: 'gold-04',
    category: 'implicit_self_harm',
    entry: 'I keep thinking about how quiet it would be if I could just disappear for a while.',
    output: {
      witness: 'You describe thinking about disappearing for a while and the quiet that idea seems to hold.',
      perspective: 'There may be something in the wish for quiet that feels difficult to carry as it is.',
      seed: 'What feels most unreachable in that quiet?',
    },
  },
  {
    id: 'gold-05',
    category: 'general',
    entry: 'I saw my mother’s number on my phone and felt my whole body tense before I even answered.',
    output: {
      witness: 'You describe seeing your mother’s number and feeling your whole body tense before the call began.',
      perspective: 'There may be something already happening in you before a word is even spoken.',
      seed: 'What arrives first in your body here?',
    },
  },
  {
    id: 'gold-06',
    category: 'general',
    entry: 'I keep rewriting the same sentence in my head and none of the versions feel true enough.',
    output: {
      witness: 'You describe rewriting the same sentence in your head and not finding a version that feels true enough.',
      perspective: 'There may be something in this that resists being reduced to one clean sentence.',
      seed: 'What does the sentence keep missing?',
    },
  },
  {
    id: 'gold-07',
    category: 'emotional',
    entry: 'I cried in the grocery store parking lot and then walked in like nothing had happened.',
    output: {
      witness: 'You describe crying in the grocery store parking lot and then walking in as if nothing had happened.',
      perspective: 'There may be a quick shift here between what opened and what had to keep moving.',
      seed: 'What stayed with you after the parking lot?',
    },
  },
  {
    id: 'gold-08',
    category: 'ambiguous',
    entry: 'Something about today felt off, but every time I try to name it the feeling gets farther away.',
    output: {
      witness: 'You describe today feeling off and the feeling moving farther away each time you try to name it.',
      perspective: 'There may be something here that changes as soon as language gets too close to it.',
      seed: 'What is hardest to name in this?',
    },
  },
  {
    id: 'gold-09',
    category: 'general',
    entry: 'I keep saying I am fine, and every time I say it I believe it less.',
    output: {
      witness: 'You describe saying you are fine and believing it less each time you say it.',
      perspective: 'There may be a widening distance here between the words and what they are holding.',
      seed: 'What no longer fits inside fine?',
    },
  },
  {
    id: 'gold-10',
    category: 'general',
    entry: 'My apartment is clean for the first time in weeks and I still feel restless inside it.',
    output: {
      witness: 'You describe your apartment being clean for the first time in weeks and still feeling restless inside it.',
      perspective: 'There may be something unsettled here that the room itself does not change.',
      seed: 'What still feels restless in the clean room?',
    },
  },
  {
    id: 'gold-11',
    category: 'contradictory',
    entry: 'I want people to notice I am struggling, but I also want everyone to leave me alone.',
    output: {
      witness: 'You describe wanting people to notice you are struggling and also wanting everyone to leave you alone.',
      perspective: 'There may be more than one need standing close together in this.',
      seed: 'What feels most in conflict here?',
    },
  },
  {
    id: 'gold-12',
    category: 'general',
    entry: 'I slept for nine hours and woke up tired in the same way I went to sleep.',
    output: {
      witness: 'You describe sleeping for nine hours and waking up with the same tiredness still there.',
      perspective: 'There may be a kind of tiredness here that sleep does not fully touch.',
      seed: 'What does this tiredness seem to carry?',
    },
  },
  {
    id: 'gold-13',
    category: 'general',
    entry: 'I laughed through dinner and then sat in my car afterward feeling completely flat.',
    output: {
      witness: 'You describe laughing through dinner and then sitting in your car afterward feeling completely flat.',
      perspective: 'There may be a sharp change here between what was happening around you and what arrived once you were alone.',
      seed: 'What changed in the car?',
    },
  },
  {
    id: 'gold-14',
    category: 'emotional',
    entry: 'My jaw hurt all day from clenching and I did not notice until I got home.',
    output: {
      witness: 'You describe your jaw hurting all day from clenching without noticing it until you got home.',
      perspective: 'There may be something your body was carrying before your attention caught up to it.',
      seed: 'What had your jaw been holding all day?',
    },
  },
  {
    id: 'gold-15',
    category: 'ambiguous',
    entry: 'I do not know whether I am angry or just disappointed again.',
    output: {
      witness: 'You describe not knowing whether what is here is anger or disappointment again.',
      perspective: 'There may be something in this that stays difficult to separate cleanly.',
      seed: 'What feels clearest between anger and disappointment?',
    },
  },
  {
    id: 'gold-16',
    category: 'general',
    entry: 'I kept refreshing my email even though I already knew there would be nothing there.',
    output: {
      witness: 'You describe refreshing your email even while already knowing there would be nothing there.',
      perspective: 'There may be something in the repetition that holds more than the inbox itself.',
      seed: 'What kept you returning to the inbox?',
    },
  },
  {
    id: 'gold-17',
    category: 'general',
    entry: 'I told the same story twice today and changed the ending both times.',
    output: {
      witness: 'You describe telling the same story twice today and changing the ending both times.',
      perspective: 'There may be something unsettled in the story if the ending keeps moving.',
      seed: 'What shifts when the ending changes?',
    },
  },
  {
    id: 'gold-18',
    category: 'general',
    entry: 'I have been staring at the laundry pile for three days and it feels bigger every time I look at it.',
    output: {
      witness: 'You describe staring at the laundry pile for three days and it feeling bigger each time you look at it.',
      perspective: 'There may be more gathering around the pile than the pile itself.',
      seed: 'What feels largest in front of you here?',
    },
  },
  {
    id: 'gold-19',
    category: 'contradictory',
    entry: 'I miss my father and I do not want him near me.',
    output: {
      witness: 'You describe missing your father and not wanting him near you.',
      perspective: 'There may be distance and longing here at the same time.',
      seed: 'What feels closest in that distance?',
    },
  },
  {
    id: 'gold-20',
    category: 'implicit_self_harm',
    entry: 'I am not planning anything, I just keep thinking people would be better off without me around.',
    output: {
      witness: 'You describe thinking people would be better off without you around, even without making a plan.',
      perspective: 'There may be a painful kind of distance in the way you are placing yourself here.',
      seed: 'What feels furthest away from you in this moment?',
    },
  },
];
