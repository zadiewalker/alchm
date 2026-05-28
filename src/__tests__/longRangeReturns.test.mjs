import test from 'node:test';
import assert from 'node:assert/strict';
import { selectLongRangeReturns } from '../utils/selectLongRangeReturns.ts';

function daysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

test('sanctuary-level recent entries do not produce long-range returns', () => {
  const result = selectLongRangeReturns(
    [
      { id: 'recent-1', content: 'recent', createdAt: daysAgo(10) },
    ],
    [
      { sessionId: 'recent-1', sessionDate: daysAgo(10), tone: 'processing', themes: ['identity'] },
    ],
  );

  assert.equal(result.length, 0);
});

test('transformation long-range selection prefers distant resonant writing', () => {
  const result = selectLongRangeReturns(
    [
      { id: 'old-1', content: 'I keep coming back to boundaries with my family.', createdAt: daysAgo(120) },
      { id: 'recent-1', content: 'I am writing about the same boundary now.', createdAt: daysAgo(5) },
    ],
    [
      { sessionId: 'old-1', sessionDate: daysAgo(120), tone: 'processing', themes: ['boundary_setting'] },
      { sessionId: 'recent-1', sessionDate: daysAgo(5), tone: 'processing', themes: ['boundary_setting'] },
    ],
  );

  assert.equal(result[0]?.entryId, 'old-1');
  assert.match(result[0]?.framing ?? '', /familiar|returns|thread/i);
});

test('repetition suppression keeps duplicate theme signatures from spamming', () => {
  const result = selectLongRangeReturns(
    [
      { id: 'old-1', content: 'boundary one', createdAt: daysAgo(120) },
      { id: 'old-2', content: 'boundary two', createdAt: daysAgo(140) },
      { id: 'recent-1', content: 'boundary now', createdAt: daysAgo(4) },
    ],
    [
      { sessionId: 'old-1', sessionDate: daysAgo(120), tone: 'processing', themes: ['boundary_setting'] },
      { sessionId: 'old-2', sessionDate: daysAgo(140), tone: 'processing', themes: ['boundary_setting'] },
      { sessionId: 'recent-1', sessionDate: daysAgo(4), tone: 'processing', themes: ['boundary_setting'] },
    ],
    3,
  );

  assert.equal(result.length, 1);
});

test('long-range framing avoids analysis language', () => {
  const result = selectLongRangeReturns(
    [
      { id: 'old-1', content: 'something familiar', createdAt: daysAgo(200) },
      { id: 'recent-1', content: 'familiar now', createdAt: daysAgo(2) },
    ],
    [
      { sessionId: 'old-1', sessionDate: daysAgo(200), tone: 'tenderness', themes: ['grief_loss'] },
      { sessionId: 'recent-1', sessionDate: daysAgo(2), tone: 'tenderness', themes: ['grief_loss'] },
    ],
  );

  assert.equal(/pattern|insight|behavior|you tend/i.test(result[0]?.framing ?? ''), false);
});
