import { lintKheperaResponse } from './outputValidation';
import { KHEPERA_GOLD_OUTPUTS } from './goldOutputs';
import type { KheperaResponse } from '@/types/khepera';
import { combineKheperaResponse } from '@/utils/khepera';

interface ValidationResult {
  testName: string;
  passed: boolean;
  response?: {
    reflection: string;
    seed: string;
    wordCount: number;
    seedWordCount: number;
  };
  error?: string;
  analysis?: {
    structureValid: boolean;
    clinicalInvariantValid: boolean;
    toneConsistent: boolean;
  };
}

function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

function hasSingleQuestion(seed: string): boolean {
  return (seed.match(/\?/g) || []).length === 1 && seed.trim().endsWith('?');
}

function isToneConsistent(response: KheperaResponse): boolean {
  const combined = `${response.witness}\n${response.perspective}\n${response.seed}`;
  return !/[!]/.test(combined)
    && !/\n- /.test(combined)
    && !/\b(always|never|everyone|nobody)\b/i.test(combined)
    && getWordCount(response.seed) <= 20;
}

function isStructureValid(response: KheperaResponse): boolean {
  return Boolean(
    response.witness.trim()
    && response.perspective.trim()
    && response.seed.trim()
    && hasSingleQuestion(response.seed)
  );
}

export async function runKheperaValidation(): Promise<ValidationResult[]> {
  return KHEPERA_GOLD_OUTPUTS.map((goldCase) => {
    const lintIssues = lintKheperaResponse(goldCase.output, goldCase.entry);
    const structureValid = isStructureValid(goldCase.output);
    const clinicalInvariantValid = lintIssues.length === 0;
    const toneConsistent = isToneConsistent(goldCase.output);

    return {
      testName: `${goldCase.id} — ${goldCase.category}`,
      passed: structureValid && clinicalInvariantValid && toneConsistent,
      response: {
        reflection: combineKheperaResponse(goldCase.output),
        seed: goldCase.output.seed,
        wordCount: getWordCount(combineKheperaResponse(goldCase.output)),
        seedWordCount: getWordCount(goldCase.output.seed),
      },
      analysis: {
        structureValid,
        clinicalInvariantValid,
        toneConsistent,
      },
      error: lintIssues.length > 0
        ? lintIssues.map((issue) => issue.code).join(', ')
        : undefined,
    };
  });
}

export async function runSingleTest(testIndex: number): Promise<ValidationResult> {
  if (testIndex < 0 || testIndex >= KHEPERA_GOLD_OUTPUTS.length) {
    throw new Error('Invalid test index');
  }

  const results = await runKheperaValidation();
  return results[testIndex];
}
