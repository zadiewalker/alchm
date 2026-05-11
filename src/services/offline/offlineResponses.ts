import type { KheperaResponse } from '@/types/khepera';

// These are written to Khepera's voice and quality standard.
// They acknowledge the act of writing without referencing content.
// They are used ONLY when the Anthropic API is unreachable.
// The user will see them briefly — the real response syncs later.

interface OfflineResponse {
  witness: string;
  perspective: string;
  seed: string;
}

const OFFLINE_RESPONSES: OfflineResponse[] = [
  {
    witness: `You wrote, and the words are here.`,
    perspective: `I can’t answer in the usual way right now. Your entry is safe, and this can stay here until the full response returns.`,
    seed: 'What feels most present in what you wrote?',
  },
  {
    witness: `This entry has been received.`,
    perspective: `The response is delayed right now, but your writing remains here. Nothing about it has been lost.`,
    seed: 'What in these words feels closest to the surface?',
  },
  {
    witness: `The writing arrived, even without the return yet.`,
    perspective: `I’m not able to complete the reflection right now. Your entry can remain exactly as it is until the connection returns.`,
    seed: 'What feels unfinished in what you wrote?',
  },
  {
    witness: `These words are here now.`,
    perspective: `The reflection is paused for the moment. Your entry is still held, and the fuller response can arrive later.`,
    seed: 'What feels steady in what you wrote?',
  },
  {
    witness: `Your writing is here, even while the response is delayed.`,
    perspective: `I can’t complete the return right now, but the entry remains safe in this space until I can.`,
    seed: 'What feels most alive in these words right now?',
  },
];

export function getOfflineResponse(): KheperaResponse {
  return OFFLINE_RESPONSES[
    Math.floor(Math.random() * OFFLINE_RESPONSES.length)
  ];
}

// A lighter message shown in the UI while online sync completes
export const SYNCING_MESSAGE =
  "Khepera is reading what you wrote. One moment.";

// Message shown when sync succeeds and real response replaces offline one
export const SYNC_COMPLETE_MESSAGE =
  "Khepera has responded to what you wrote.";
