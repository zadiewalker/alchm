import type {
  ReflectionExportDocument,
  ReflectionExportInput,
  ReflectionExportSelectedExcerpt,
  ReflectionExportSourceManifest,
  ReflectionExportSourceType,
  ReflectionExportValidationIssue,
  ReflectionExportValidationResult,
  ReflectionExportValidationWarning,
} from '../../types/exports';
import { REFLECTION_EXPORT_BOUNDARY_NOTE, REFLECTION_EXPORT_VERSION } from '../../config/exports/reflectionExportConstants';
import reflectionExportSchema from '../../config/exports/reflectionExportSchema.json' with { type: 'json' };

type JsonSchemaNode = {
  type?: 'object' | 'array' | 'string' | 'number';
  format?: 'date-time';
  enum?: string[];
  const?: string;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  required?: string[];
  additionalProperties?: boolean;
  properties?: Record<string, JsonSchemaNode>;
  items?: JsonSchemaNode;
};

const DIAGNOSTIC_PATTERNS = [
  /\bdiagnos(?:is|e|ed|ing)\b/i,
  /\bclinical (?:finding|assessment|impression)\b/i,
  /\bptsd|ocd|bpd|adhd|depression|anxiety disorder|panic disorder\b/i,
  /\bthis indicates\b/i,
];

const TREATMENT_PATTERNS = [
  /\btreatment\b/i,
  /\bintervention\b/i,
  /\bcare plan\b/i,
  /\bmedication\b/i,
  /\btherapeutic modality\b/i,
];

const THERAPIST_INSTRUCTION_PATTERNS = [
  /\bthe therapist should\b/i,
  /\bbring this to your therapist so they can\b/i,
  /\byour therapist should\b/i,
  /\bnext session should focus on\b/i,
];

const BEHAVIOR_INFERENCE_PATTERNS = [
  /\byou tend to\b/i,
  /\byour behavior\b/i,
  /\bbehavior pattern\b/i,
  /\bhidden cause\b/i,
  /\bunderlying pathology\b/i,
];

let cachedSchema: JsonSchemaNode | null = null;

const ABSTRACT_LANGUAGE_PATTERNS = [
  /\bthings\b/i,
  /\bstuff\b/i,
  /\bissues\b/i,
  /\bpatterns\b/i,
];

const GENERIC_EMOTIONAL_LANDSCAPE_PATTERNS = [
  /\bdifficult emotions\b/i,
  /\bmixed feelings\b/i,
  /\bvarious emotions\b/i,
  /\bmany feelings\b/i,
];

const GENERIC_PURPOSE_PATTERNS = [
  /\bsummary of things\b/i,
  /\bsummary of stuff\b/i,
  /\breflection of things\b/i,
];

function loadSchema(): JsonSchemaNode {
  if (cachedSchema) {
    return cachedSchema;
  }

  cachedSchema = reflectionExportSchema as JsonSchemaNode;
  return cachedSchema;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSourceType(value: unknown): value is ReflectionExportSourceType {
  return value === 'journal_entry' || value === 'khepera_reflection' || value === 'return';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isSelectedExcerpt(value: unknown): value is ReflectionExportSelectedExcerpt {
  return isRecord(value)
    && typeof value.sourceId === 'string'
    && isSourceType(value.sourceType)
    && typeof value.createdAt === 'string'
    && typeof value.excerpt === 'string';
}

function isSourceManifest(value: unknown): value is ReflectionExportSourceManifest {
  return isRecord(value)
    && isStringArray(value.selectedSourceIds)
    && isStringArray(value.selectedExcerptIds)
    && typeof value.sourceCount === 'number'
    && typeof value.excerptCount === 'number';
}

function isReflectionExportDocument(value: unknown): value is ReflectionExportDocument {
  return isRecord(value)
    && typeof value.documentTitle === 'string'
    && typeof value.generatedAt === 'string'
    && typeof value.exportVersion === 'string'
    && typeof value.purpose === 'string'
    && typeof value.whatHasBeenPresent === 'string'
    && isStringArray(value.recurringThreads)
    && typeof value.emotionalLandscape === 'string'
    && Array.isArray(value.selectedExcerpts)
    && value.selectedExcerpts.every(isSelectedExcerpt)
    && isStringArray(value.conversationOpenings)
    && (value.userNote === undefined || typeof value.userNote === 'string')
    && typeof value.boundaryNote === 'string'
    && (value.sourceManifest === undefined || isSourceManifest(value.sourceManifest));
}

function pushIssue(
  issues: ReflectionExportValidationIssue[],
  code: ReflectionExportValidationIssue['code'],
  path: string,
  message: string
): void {
  issues.push({ code, path, message });
}

function pushWarning(
  warnings: ReflectionExportValidationWarning[],
  code: ReflectionExportValidationWarning['code'],
  path: string,
  message: string
): void {
  warnings.push({ code, path, message });
}

function validateDateTime(value: string): boolean {
  return !Number.isNaN(Date.parse(value)) && /\d{4}-\d{2}-\d{2}T/.test(value);
}

function validateAgainstSchema(
  schema: JsonSchemaNode,
  value: unknown,
  path: string,
  issues: ReflectionExportValidationIssue[]
): void {
  if (schema.type === 'object') {
    if (!isRecord(value)) {
      pushIssue(issues, 'schema_type', path, 'Expected object.');
      return;
    }

    const properties = schema.properties ?? {};
    const required = schema.required ?? [];

    required.forEach((key) => {
      if (!(key in value)) {
        pushIssue(issues, 'schema_required', `${path}.${key}`, 'Required property is missing.');
      }
    });

    if (schema.additionalProperties === false) {
      Object.keys(value).forEach((key) => {
        if (!(key in properties)) {
          pushIssue(issues, 'schema_additional_property', `${path}.${key}`, 'Additional properties are not allowed.');
        }
      });
    }

    Object.entries(properties).forEach(([key, propertySchema]) => {
      if (key in value) {
        validateAgainstSchema(propertySchema, value[key], `${path}.${key}`, issues);
      }
    });
    return;
  }

  if (schema.type === 'array') {
    if (!Array.isArray(value)) {
      pushIssue(issues, 'schema_type', path, 'Expected array.');
      return;
    }

    if (typeof schema.minItems === 'number' && value.length < schema.minItems) {
      pushIssue(issues, 'schema_min_items', path, `Expected at least ${schema.minItems} items.`);
    }
    if (typeof schema.maxItems === 'number' && value.length > schema.maxItems) {
      pushIssue(issues, 'schema_max_items', path, `Expected no more than ${schema.maxItems} items.`);
    }

    if (schema.items) {
      value.forEach((item, index) => {
        validateAgainstSchema(schema.items as JsonSchemaNode, item, `${path}[${index}]`, issues);
      });
    }
    return;
  }

  if (schema.type === 'string') {
    if (typeof value !== 'string') {
      pushIssue(issues, 'schema_type', path, 'Expected string.');
      return;
    }

    if (typeof schema.const === 'string' && value !== schema.const) {
      pushIssue(issues, 'schema_const', path, 'Value does not match required constant.');
    }
    if (schema.enum && !schema.enum.includes(value)) {
      pushIssue(issues, 'schema_enum', path, 'Value is not in the allowed enum.');
    }
    if (typeof schema.minLength === 'number' && value.length < schema.minLength) {
      pushIssue(issues, 'schema_min_length', path, `Expected minimum length ${schema.minLength}.`);
    }
    if (typeof schema.maxLength === 'number' && value.length > schema.maxLength) {
      pushIssue(issues, 'schema_max_length', path, `Expected maximum length ${schema.maxLength}.`);
    }
    if (schema.format === 'date-time' && !validateDateTime(value)) {
      pushIssue(issues, 'schema_format', path, 'Expected ISO date-time string.');
    }
    return;
  }

  if (schema.type === 'number' && typeof value !== 'number') {
    pushIssue(issues, 'schema_type', path, 'Expected number.');
  }
}

function lintGeneratedField(
  issues: ReflectionExportValidationIssue[],
  path: string,
  value: string
): void {
  if (DIAGNOSTIC_PATTERNS.some((pattern) => pattern.test(value))) {
    pushIssue(issues, 'banned_diagnostic_language', path, 'Generated text contains diagnostic framing.');
  }
  if (TREATMENT_PATTERNS.some((pattern) => pattern.test(value))) {
    pushIssue(issues, 'banned_treatment_language', path, 'Generated text contains treatment framing.');
  }
  if (THERAPIST_INSTRUCTION_PATTERNS.some((pattern) => pattern.test(value))) {
    pushIssue(issues, 'banned_therapist_instruction', path, 'Generated text contains therapist instruction.');
  }
  if (BEHAVIOR_INFERENCE_PATTERNS.some((pattern) => pattern.test(value))) {
    pushIssue(issues, 'banned_behavior_inference', path, 'Generated text contains unsupported behavior framing.');
  }
}

function buildAllowedExcerptMap(input: ReflectionExportInput): Map<string, ReflectionExportSelectedExcerpt> {
  const map = new Map<string, ReflectionExportSelectedExcerpt>();
  input.selectedExcerpts.forEach((excerpt) => {
    const key = [
      excerpt.sourceId,
      excerpt.sourceType,
      excerpt.createdAt,
      excerpt.excerpt.trim(),
    ].join('::');

    map.set(key, {
      sourceId: excerpt.sourceId,
      sourceType: excerpt.sourceType,
      createdAt: excerpt.createdAt,
      excerpt: excerpt.excerpt,
    });
  });
  return map;
}

function validateExcerptSelection(
  value: ReflectionExportDocument,
  input: ReflectionExportInput,
  issues: ReflectionExportValidationIssue[]
): void {
  const allowed = buildAllowedExcerptMap(input);

  value.selectedExcerpts.forEach((excerpt, index) => {
    const key = [
      excerpt.sourceId,
      excerpt.sourceType,
      excerpt.createdAt,
      excerpt.excerpt.trim(),
    ].join('::');

    if (!allowed.has(key)) {
      pushIssue(
        issues,
        'unselected_excerpt',
        `$.selectedExcerpts[${index}]`,
        'Excerpt was not explicitly selected for export.'
      );
    }
  });
}

export function parseReflectionExportJson(rawOutput: string): ReflectionExportValidationResult {
  try {
    const parsed: unknown = JSON.parse(rawOutput);
    if (!isReflectionExportDocument(parsed)) {
      return {
        ok: false,
        issues: [{
          code: 'schema_type',
          path: '$',
          message: 'Parsed export does not match the required document structure.',
        }],
        warnings: [],
      };
    }

    return {
      ok: true,
      issues: [],
      warnings: [],
      value: parsed,
    };
  } catch (error) {
    return {
      ok: false,
      issues: [
        {
          code: 'invalid_json',
          path: '$',
          message: error instanceof Error ? error.message : 'Invalid JSON output.',
        },
      ],
      warnings: [],
    };
  }
}

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function addQualityWarnings(
  document: ReflectionExportDocument,
  warnings: ReflectionExportValidationWarning[]
): void {
  if (wordCount(document.purpose) < 8) {
    pushWarning(warnings, 'weak_purpose', '$.purpose', 'Purpose is too short to be useful.');
  }

  if (
    ABSTRACT_LANGUAGE_PATTERNS.some((pattern) => pattern.test(document.purpose)) ||
    GENERIC_PURPOSE_PATTERNS.some((pattern) => pattern.test(document.purpose))
  ) {
    pushWarning(warnings, 'abstract_language', '$.purpose', 'Purpose uses abstract language without enough grounding.');
  }

  if (GENERIC_PURPOSE_PATTERNS.some((pattern) => pattern.test(document.purpose))) {
    pushWarning(warnings, 'weak_purpose', '$.purpose', 'Purpose is too vague to be useful.');
  }

  document.recurringThreads.forEach((thread, index) => {
    if (wordCount(thread) < 5) {
      pushWarning(
        warnings,
        'shallow_recurring_thread',
        `$.recurringThreads[${index}]`,
        'Recurring thread is too shallow to be useful.'
      );
    }

    if (ABSTRACT_LANGUAGE_PATTERNS.some((pattern) => pattern.test(thread))) {
      pushWarning(
        warnings,
        'abstract_language',
        `$.recurringThreads[${index}]`,
        'Recurring thread uses abstract language without enough grounding.'
      );
    }
  });

  if (
    wordCount(document.emotionalLandscape) < 8 ||
    GENERIC_EMOTIONAL_LANDSCAPE_PATTERNS.some((pattern) => pattern.test(document.emotionalLandscape))
  ) {
    pushWarning(
      warnings,
      'generic_emotional_landscape',
      '$.emotionalLandscape',
      'Emotional landscape is too generic to be useful.'
    );
  }

  if (ABSTRACT_LANGUAGE_PATTERNS.some((pattern) => pattern.test(document.emotionalLandscape))) {
    pushWarning(
      warnings,
      'abstract_language',
      '$.emotionalLandscape',
      'Emotional landscape uses abstract language without enough grounding.'
    );
  }

  const normalizedOpenings = new Set<string>();
  document.conversationOpenings.forEach((opening, index) => {
    const normalized = opening.trim().toLowerCase().replace(/\s+/g, ' ');
    if (wordCount(opening) < 6) {
      pushWarning(
        warnings,
        'weak_conversation_opening',
        `$.conversationOpenings[${index}]`,
        'Carry-forward line is too slight to be useful.'
      );
    }

    if (normalizedOpenings.has(normalized)) {
      pushWarning(
        warnings,
        'repetitive_conversation_opening',
        `$.conversationOpenings[${index}]`,
        'Carry-forward line repeats an earlier line.'
      );
    }
    normalizedOpenings.add(normalized);

    if (ABSTRACT_LANGUAGE_PATTERNS.some((pattern) => pattern.test(opening))) {
      pushWarning(
        warnings,
        'abstract_language',
        `$.conversationOpenings[${index}]`,
        'Carry-forward line uses abstract language without enough grounding.'
      );
    }
  });
}

export function validateReflectionExport(
  value: unknown,
  input: ReflectionExportInput
): ReflectionExportValidationResult {
  const schema = loadSchema();
  const issues: ReflectionExportValidationIssue[] = [];
  const warnings: ReflectionExportValidationWarning[] = [];
  validateAgainstSchema(schema, value, '$', issues);

  if (issues.length > 0 || !isReflectionExportDocument(value)) {
    if (issues.length === 0) {
      pushIssue(issues, 'schema_type', '$', 'Validated export does not match the required document structure.');
    }
    return { ok: false, issues, warnings };
  }

  const document = value;

  lintGeneratedField(issues, '$.documentTitle', document.documentTitle);
  lintGeneratedField(issues, '$.purpose', document.purpose);
  lintGeneratedField(issues, '$.whatHasBeenPresent', document.whatHasBeenPresent);
  document.recurringThreads.forEach((thread, index) => {
    lintGeneratedField(issues, `$.recurringThreads[${index}]`, thread);
  });
  lintGeneratedField(issues, '$.emotionalLandscape', document.emotionalLandscape);
  document.conversationOpenings.forEach((opening, index) => {
    lintGeneratedField(issues, `$.conversationOpenings[${index}]`, opening);
  });

  validateExcerptSelection(document, input, issues);

  if (document.exportVersion !== REFLECTION_EXPORT_VERSION) {
    pushIssue(issues, 'schema_const', '$.exportVersion', 'Export version must match the canonical version.');
  }

  if (document.boundaryNote !== REFLECTION_EXPORT_BOUNDARY_NOTE) {
    pushIssue(issues, 'schema_const', '$.boundaryNote', 'Boundary note must match the required constant.');
  }

  if (issues.length > 0) {
    return { ok: false, issues, warnings };
  }

  addQualityWarnings(document, warnings);

  return {
    ok: true,
    issues: [],
    warnings,
    value: document,
  };
}
