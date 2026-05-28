import type { ReflectionExportGenerationRequest, ReflectionExportInput } from '../../types/exports';
import { REFLECTION_EXPORT_BOUNDARY_NOTE, REFLECTION_EXPORT_VERSION } from './reflectionExportConstants';

export const REFLECTION_EXPORT_GENERATOR_PROMPT_VERSION = '1.0.0';

export const REFLECTION_EXPORT_GENERATOR_SYSTEM_PROMPT = `You generate calm, schema-valid JSON for an ALCHM Reflection Export.

Return JSON only.
Do not include markdown.
Do not include prose outside the JSON object.
Do not include fields that are not in the schema.

Use only the material explicitly selected for export.
Do not use any unselected journal text.
Do not invent excerpts.
Do not infer hidden causes, pathology, treatment needs, or therapist actions.

The output must remain observational.
It must not diagnose, coach, prescribe, optimize, or interpret beyond the selected material.

Prohibited framing includes:
- diagnosis
- symptoms as conclusions
- treatment recommendations
- therapist instructions
- behavior inference
- statements about what the user "really" is

Before returning JSON, check:
1. Every field matches the schema.
2. selectedExcerpts contains only explicitly selected excerpts.
3. boundaryNote matches the required constant exactly.
4. additionalProperties are absent.
5. The document reads like a reflection aid, not a clinical report.`;

function buildSelectedMaterialBlock(input: ReflectionExportInput): string {
  const sources = [...input.selectedSources]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
    .map((source) => ({
      id: source.id,
      sourceType: source.sourceType,
      createdAt: source.createdAt,
      content: source.content,
    }));

  const excerpts = [...input.selectedExcerpts]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
    .map((excerpt) => ({
      id: excerpt.id,
      sourceId: excerpt.sourceId,
      sourceType: excerpt.sourceType,
      createdAt: excerpt.createdAt,
      excerpt: excerpt.excerpt,
    }));

  return JSON.stringify(
    {
      generatedAt: input.generatedAt,
      purposePreference: input.purpose,
      selectedSources: sources,
      selectedExcerpts: excerpts,
      themeTags: input.themeTags ?? [],
      emotionalTones: input.emotionalTones ?? [],
      userNote: input.userNote ?? null,
      requiredBoundaryNote: REFLECTION_EXPORT_BOUNDARY_NOTE,
      exportVersion: REFLECTION_EXPORT_VERSION,
    },
    null,
    2
  );
}

export function buildReflectionExportGeneratorPrompt(
  input: ReflectionExportInput,
  schemaJson: string
): ReflectionExportGenerationRequest {
  const userPrompt = `Generate one valid JSON object for the Reflection Export schema below.

Schema:
${schemaJson}

Selected export material:
${buildSelectedMaterialBlock(input)}

Behavior rules:
- documentTitle should remain calm and printable.
- purpose should explain that this is a reflection aid built from selected material.
- whatHasBeenPresent should stay grounded in the selected material.
- recurringThreads should be concise.
- emotionalLandscape should stay descriptive, not diagnostic.
- conversationOpenings should be possible topics to bring into conversation, not advice.
- selectedExcerpts must include only explicitly selected excerpts, word-for-word.
- userNote must appear only if one was provided in the selected input.
- sourceManifest should appear only if the request includes includeSourceManifest = true.

Final check before output:
- Return valid JSON only.
- No additional properties.
- No unsupported interpretation.
- No diagnosis, treatment, or therapist instruction language.`;

  return {
    schemaName: 'reflection_export',
    schemaVersion: REFLECTION_EXPORT_GENERATOR_PROMPT_VERSION,
    systemPrompt: REFLECTION_EXPORT_GENERATOR_SYSTEM_PROMPT,
    userPrompt,
  };
}
