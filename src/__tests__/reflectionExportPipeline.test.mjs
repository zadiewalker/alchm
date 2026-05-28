import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildReflectionExport,
  buildReflectionExportGenerationRequest,
  normalizeReflectionExportModelOutput,
  validateReflectionExportModelOutput,
} from '../services/exports/buildReflectionExport.ts';
import { renderReflectionExportMarkdown } from '../services/exports/renderReflectionExportMarkdown.ts';
import { renderReflectionExportPdfDocument } from '../services/exports/renderReflectionExportPdfDocument.ts';
import { REFLECTION_EXPORT_BOUNDARY_NOTE, REFLECTION_EXPORT_VERSION } from '../config/exports/reflectionExportConstants.ts';

const baseInput = {
  generatedAt: '2026-03-27T15:00:00.000Z',
  purpose: 'conversation_summary',
  selectedSources: [
    {
      id: 'entry-1',
      sourceType: 'journal_entry',
      createdAt: '2026-03-20T09:30:00.000Z',
      content: 'I keep circling the same fear when the room gets quiet.',
    },
    {
      id: 'return-1',
      sourceType: 'return',
      createdAt: '2026-03-24T10:00:00.000Z',
      content: 'What returns is the wish to feel less alone inside this.',
    },
  ],
  selectedExcerpts: [
    {
      id: 'excerpt-1',
      sourceId: 'entry-1',
      sourceType: 'journal_entry',
      createdAt: '2026-03-20T09:30:00.000Z',
      excerpt: 'I keep circling the same fear when the room gets quiet.',
    },
  ],
  themeTags: ['fear_uncertainty', 'rest_recovery'],
  emotionalTones: ['anxiety', 'tenderness'],
  includeSourceManifest: true,
  userNote: 'I want to talk about how silence changes the tone of the day.',
};

const validDocument = {
  documentTitle: 'Reflection Summary for Conversation',
  generatedAt: '2026-03-27T15:00:00.000Z',
  exportVersion: REFLECTION_EXPORT_VERSION,
  purpose: 'A conversation summary drawn from selected writing to help bring what has been present into conversation.',
  whatHasBeenPresent: 'Across these selected pieces, the writing returns to fear arriving in quiet moments and to a wish for steadier company inside that experience.',
  recurringThreads: [
    'Quiet moments tend to bring the same fear back into view.',
    'The selected material returns to wanting less aloneness inside what is being felt.',
  ],
  emotionalLandscape: 'The selected material carries anxiety and tenderness together, with a sense of bracing that sits beside a wish for steadier ground.',
  selectedExcerpts: [
    {
      sourceId: 'entry-1',
      sourceType: 'journal_entry',
      createdAt: '2026-03-20T09:30:00.000Z',
      excerpt: 'I keep circling the same fear when the room gets quiet.',
    },
  ],
  conversationOpenings: [
    'What seems to happen inside the quiet moments when fear returns?',
    'What kind of support feels missing when the writing turns toward aloneness?',
  ],
  userNote: 'I want to talk about how silence changes the tone of the day.',
  boundaryNote: REFLECTION_EXPORT_BOUNDARY_NOTE,
  sourceManifest: {
    selectedSourceIds: ['entry-1', 'return-1'],
    selectedExcerptIds: ['excerpt-1'],
    sourceCount: 2,
    excerptCount: 1,
  },
};

test('valid payload passes schema and boundary validation', () => {
  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(validDocument));
  assert.equal(result.ok, true);
  assert.equal(result.issues.length, 0);
});

test('extra properties fail validation', () => {
  const payload = {
    ...validDocument,
    extra: 'not allowed',
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.match(result.issues[0].code, /schema_additional_property/);
});

test('missing required fields fail validation', () => {
  const payload = { ...validDocument };
  delete payload.emotionalLandscape;

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'schema_required'));
});

test('invalid enum in excerpt sourceType fails validation', () => {
  const payload = {
    ...validDocument,
    selectedExcerpts: [
      {
        ...validDocument.selectedExcerpts[0],
        sourceType: 'therapy_note',
      },
    ],
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'schema_enum'));
});

test('diagnosis language is rejected', () => {
  const payload = {
    ...validDocument,
    whatHasBeenPresent: 'This indicates anxiety disorder and shows a diagnostic profile emerging in the writing.',
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'banned_diagnostic_language'));
});

test('treatment and therapist instruction language are rejected', () => {
  const payload = {
    ...validDocument,
    conversationOpenings: [
      'The therapist should focus on treatment planning for this.',
    ],
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'banned_treatment_language' || issue.code === 'banned_therapist_instruction'));
});

test('unsupported behavior framing is rejected', () => {
  const payload = {
    ...validDocument,
    emotionalLandscape: 'Your behavior shows a pattern where you tend to avoid stillness whenever fear appears.',
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(payload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'banned_behavior_inference'));
});

test('selected excerpts render exactly and unselected excerpts fail closed', () => {
  const buildResult = buildReflectionExport(baseInput, JSON.stringify(validDocument));
  assert.match(buildResult.output.markdown, /> I keep circling the same fear when the room gets quiet\./);

  const unselectedPayload = {
    ...validDocument,
    selectedExcerpts: [
      {
        sourceId: 'entry-1',
        sourceType: 'journal_entry',
        createdAt: '2026-03-20T09:30:00.000Z',
        excerpt: 'This line was never selected for export.',
      },
    ],
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(unselectedPayload));
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'unselected_excerpt'));
});

test('markdown renderer keeps required order and omits optional sections correctly', () => {
  const withoutOptionalSections = {
    ...validDocument,
    selectedExcerpts: [],
    userNote: undefined,
    sourceManifest: undefined,
  };

  const markdown = renderReflectionExportMarkdown(withoutOptionalSections);
  const purposeIndex = markdown.indexOf('## Purpose');
  const presentIndex = markdown.indexOf('## What Has Been Present');
  const recurringIndex = markdown.indexOf('## Recurring Threads');
  const emotionalIndex = markdown.indexOf('## Emotional Landscape');
  const conversationIndex = markdown.indexOf('## What You May Want to Carry Forward');
  const boundaryIndex = markdown.indexOf('## Boundary Note');

  assert.ok(purposeIndex < presentIndex);
  assert.ok(presentIndex < recurringIndex);
  assert.ok(recurringIndex < emotionalIndex);
  assert.ok(emotionalIndex < conversationIndex);
  assert.ok(conversationIndex < boundaryIndex);
  assert.equal(markdown.includes('## Selected Excerpts'), false);
  assert.equal(markdown.includes('## User Note'), false);
  assert.ok(markdown.includes(REFLECTION_EXPORT_BOUNDARY_NOTE));
});

test('generation request is deterministic and includes schema-bound instructions', () => {
  const request = buildReflectionExportGenerationRequest(baseInput);
  assert.equal(request.schemaName, 'reflection_export');
  assert.equal(request.schemaVersion, '1.0.0');
  assert.ok(request.systemPrompt.includes('Return JSON only.'));
  assert.ok(request.userPrompt.includes('"selectedSources"'));
  assert.ok(request.userPrompt.includes(REFLECTION_EXPORT_BOUNDARY_NOTE));
});

test('normalization strips code fences and harmless wrapper noise', () => {
  const raw = `Here is the JSON:\n\`\`\`json\n${JSON.stringify(validDocument, null, 2)}\n\`\`\`\nThank you.`;
  const normalized = normalizeReflectionExportModelOutput(raw);

  assert.ok(normalized.startsWith('{'));
  assert.ok(normalized.endsWith('}'));
  assert.equal(normalized.includes('```'), false);
  assert.equal(normalized.includes('Here is the JSON'), false);
});

test('normalization safely normalizes curly quotes and whitespace', () => {
  const raw = `\n\n${JSON.stringify(validDocument).replace(/"/g, '“')}\n`;
  const normalized = normalizeReflectionExportModelOutput(raw);
  assert.ok(normalized.startsWith('{'));
  assert.ok(normalized.includes('"documentTitle"'));
});

test('normalization still fails closed on truly invalid JSON', () => {
  const raw = '```json\n{ invalid json }\n```';
  const result = validateReflectionExportModelOutput(baseInput, raw);
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.code === 'invalid_json'));
});

test('weak but valid output produces quality warnings', () => {
  const weakPayload = {
    ...validDocument,
    purpose: 'A summary of things that have been present.',
    recurringThreads: ['Hard things keep happening.'],
    emotionalLandscape: 'Mixed feelings and various emotions were present.',
    conversationOpenings: [
      'Talk about these things.',
      'Talk about these things.',
    ],
  };

  const result = validateReflectionExportModelOutput(baseInput, JSON.stringify(weakPayload));
  assert.equal(result.ok, true);
  assert.ok(result.warnings.some((warning) => warning.code === 'weak_purpose'));
  assert.ok(result.warnings.some((warning) => warning.code === 'shallow_recurring_thread'));
  assert.ok(result.warnings.some((warning) => warning.code === 'generic_emotional_landscape'));
  assert.ok(result.warnings.some((warning) => warning.code === 'weak_conversation_opening'));
  assert.ok(result.warnings.some((warning) => warning.code === 'repetitive_conversation_opening'));
});

test('pdf rendering remains stable and preserves structure', () => {
  const html = renderReflectionExportPdfDocument(validDocument);
  assert.ok(html.includes(`<h1>${validDocument.documentTitle}</h1>`));
  assert.ok(html.includes('<h2>Purpose</h2>'));
  assert.ok(html.includes('<blockquote>I keep circling the same fear when the room gets quiet.</blockquote>'));
  assert.ok(html.includes(REFLECTION_EXPORT_BOUNDARY_NOTE));
  assert.ok(html.includes('font-family: "Jost", "Avenir Next", "Segoe UI", sans-serif;'));
});
