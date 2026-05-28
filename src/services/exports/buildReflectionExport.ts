import type {
  ReflectionExportBuildResult,
  ReflectionExportDocument,
  ReflectionExportDocumentOutput,
  ReflectionExportGenerationRequest,
  ReflectionExportInput,
  ReflectionExportSourceManifest,
  ReflectionExportValidationResult,
} from '../../types/exports';
import { REFLECTION_EXPORT_BOUNDARY_NOTE, REFLECTION_EXPORT_VERSION } from '../../config/exports/reflectionExportConstants';
import { buildReflectionExportGeneratorPrompt } from '../../config/exports/reflectionExportGeneratorPrompt';
import reflectionExportSchema from '../../config/exports/reflectionExportSchema.json' with { type: 'json' };
import { renderReflectionExportMarkdown } from './renderReflectionExportMarkdown';
import { renderReflectionExportPdfDocument } from './renderReflectionExportPdfDocument';
import { parseReflectionExportJson, validateReflectionExport } from './validateReflectionExport';

const QUOTE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/[\u2018\u2019\u201A\u201B]/g, "'"],
  [/[\u201C\u201D\u201E\u201F]/g, '"'],
];

function loadSchemaJson(): string {
  return JSON.stringify(reflectionExportSchema, null, 2);
}

function buildSourceManifest(input: ReflectionExportInput): ReflectionExportSourceManifest {
  return {
    selectedSourceIds: input.selectedSources.map((source) => source.id).sort(),
    selectedExcerptIds: input.selectedExcerpts.map((excerpt) => excerpt.id).sort(),
    sourceCount: input.selectedSources.length,
    excerptCount: input.selectedExcerpts.length,
  };
}

function stripCodeFences(value: string): string {
  const exactMatch = value.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (exactMatch) {
    return exactMatch[1];
  }

  const wrappedMatch = value.match(/^([\s\S]*?)```(?:json)?\s*([\s\S]*?)\s*```([\s\S]*)$/i);
  if (!wrappedMatch) {
    return value;
  }

  const [, prefix, inner, suffix] = wrappedMatch;
  const wrapperPattern = /^[A-Za-z0-9 _.:,\-\n]*$/;
  if (wrapperPattern.test(prefix.trim()) && wrapperPattern.test(suffix.trim())) {
    return inner;
  }

  return value;
}

function stripWrapperNoise(value: string): string {
  const firstBrace = value.indexOf('{');
  const lastBrace = value.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return value;
  }

  const prefix = value.slice(0, firstBrace).trim();
  const suffix = value.slice(lastBrace + 1).trim();
  const wrapperPattern = /^[A-Za-z0-9 _.:,\-]*$/;

  if ((prefix === '' || wrapperPattern.test(prefix)) && (suffix === '' || wrapperPattern.test(suffix))) {
    return value.slice(firstBrace, lastBrace + 1);
  }

  return value;
}

export function normalizeReflectionExportModelOutput(rawOutput: string): string {
  let normalized = rawOutput.replace(/\r\n/g, '\n').replace(/\u00A0/g, ' ').trim();

  normalized = stripCodeFences(normalized);
  normalized = stripWrapperNoise(normalized).trim();

  for (const [pattern, replacement] of QUOTE_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized;
}

function normalizeDocument(
  document: ReflectionExportDocument,
  input: ReflectionExportInput
): ReflectionExportDocument {
  const userNote = document.userNote?.trim() || undefined;

  return {
    ...document,
    documentTitle: document.documentTitle.trim(),
    purpose: document.purpose.trim(),
    whatHasBeenPresent: document.whatHasBeenPresent.trim(),
    recurringThreads: document.recurringThreads.map((thread) => thread.trim()),
    emotionalLandscape: document.emotionalLandscape.trim(),
    selectedExcerpts: document.selectedExcerpts.map((excerpt) => ({
      ...excerpt,
      excerpt: excerpt.excerpt,
    })),
    conversationOpenings: document.conversationOpenings.map((opening) => opening.trim()),
    boundaryNote: REFLECTION_EXPORT_BOUNDARY_NOTE,
    exportVersion: REFLECTION_EXPORT_VERSION,
    sourceManifest: input.includeSourceManifest ? buildSourceManifest(input) : undefined,
    ...(userNote ? { userNote } : {}),
  };
}

function toFileName(title: string, generatedAt: string): string {
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const date = generatedAt.slice(0, 10);
  return `${safeTitle || 'reflection-summary'}-${date}.html`;
}

export function buildReflectionExportGenerationRequest(
  input: ReflectionExportInput
): ReflectionExportGenerationRequest {
  return buildReflectionExportGeneratorPrompt(input, loadSchemaJson());
}

export function validateReflectionExportModelOutput(
  input: ReflectionExportInput,
  rawOutput: string
): ReflectionExportValidationResult {
  const normalizedOutput = normalizeReflectionExportModelOutput(rawOutput);
  const parsed = parseReflectionExportJson(normalizedOutput);
  if (!parsed.ok || !parsed.value) {
    return parsed;
  }

  const initialValidation = validateReflectionExport(parsed.value, input);
  if (!initialValidation.ok || !initialValidation.value) {
    return initialValidation;
  }

  const normalized = normalizeDocument(initialValidation.value, input);
  return validateReflectionExport(normalized, input);
}

export function buildReflectionExport(
  input: ReflectionExportInput,
  rawOutput: string
): ReflectionExportBuildResult {
  const validation = validateReflectionExportModelOutput(input, rawOutput);

  if (!validation.ok || !validation.value) {
    const first = validation.issues[0];
    throw new Error(`Reflection export validation failed: ${first?.code ?? 'unknown_error'} at ${first?.path ?? '$'}`);
  }

  const document = validation.value;
  const output: ReflectionExportDocumentOutput = {
    fileName: toFileName(document.documentTitle, document.generatedAt),
    markdown: renderReflectionExportMarkdown(document),
    html: renderReflectionExportPdfDocument(document, input),
  };

  return {
    input,
    document,
    output,
    warnings: validation.warnings,
  };
}
