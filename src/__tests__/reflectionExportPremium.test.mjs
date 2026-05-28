import test from 'node:test';
import assert from 'node:assert/strict';
import { composeReflectionExportDraft } from '../services/exports/composeReflectionExportDraft.ts';
import { buildReflectionExport } from '../services/exports/buildReflectionExport.ts';
import { REFLECTION_EXPORT_TRUST_LINE, REFLECTION_EXPORT_COMPLETION_BODY } from '../config/exports/reflectionExportUi.ts';

function makeInput(overrides = {}) {
  return {
    generatedAt: '2026-03-30T12:00:00.000Z',
    purpose: 'reflection_export',
    framing: 'shareable_reflection',
    timeWindow: 'last_month',
    selectedSources: [
      {
        id: 'entry-1',
        sourceType: 'journal_entry',
        createdAt: '2026-03-01T12:00:00.000Z',
        content: 'I keep circling the same boundary with my mother and it leaves me tired.',
      },
    ],
    selectedExcerpts: [
      {
        id: 'entry-1:excerpt',
        sourceId: 'entry-1',
        sourceType: 'journal_entry',
        createdAt: '2026-03-01T12:00:00.000Z',
        excerpt: 'I keep circling the same boundary with my mother and it leaves me tired.',
      },
    ],
    includeSourceManifest: true,
    ...overrides,
  };
}

test('framing selector changes only framing display fields', () => {
  const shareable = JSON.parse(composeReflectionExportDraft(makeInput({ framing: 'shareable_reflection' })));
  const personal = JSON.parse(composeReflectionExportDraft(makeInput({ framing: 'personal_conversation' })));

  assert.notEqual(shareable.documentTitle, personal.documentTitle);
  assert.notEqual(shareable.purpose, personal.purpose);
  assert.deepEqual(shareable.selectedExcerpts, personal.selectedExcerpts);
  assert.equal(shareable.boundaryNote, personal.boundaryNote);
});

test('time-window metadata stays explicit in the rendered document', () => {
  const build = buildReflectionExport(
    makeInput({ timeWindow: 'last_3_months' }),
    composeReflectionExportDraft(makeInput({ timeWindow: 'last_3_months' })),
  );

  assert.equal(build.input.timeWindow, 'last_3_months');
  assert.match(build.output.html, /Last 3 months/);
});

test('preview output includes trust line and boundary note', () => {
  const input = makeInput();
  const build = buildReflectionExport(input, composeReflectionExportDraft(input));

  assert.match(build.output.html, new RegExp(REFLECTION_EXPORT_TRUST_LINE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(build.output.html, /Boundary Note/);
});

test('completion copy stays calm and ownership-based', () => {
  assert.match(REFLECTION_EXPORT_COMPLETION_BODY, /keep this, share it, or leave it with yourself for now/i);
  assert.doesNotMatch(REFLECTION_EXPORT_COMPLETION_BODY, /diagnos|treatment|insight|optimi/i);
});
