import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relativePath) => fs.readFileSync(path.join(repo, relativePath), 'utf8');

test('integrity doctrine is documented and encoded as static configuration', () => {
  const productDoctrine = read('docs/integrity/PRODUCT_DOCTRINE.md');
  const constitution = read('docs/integrity/KHEPERA_REFLECTION_CONSTITUTION.md');
  const operatingRules = read('docs/integrity/OPERATING_RULES.md');
  const config = read('src/config/productIntegrity.ts');
  const agents = read('AGENTS.md');

  assert.match(productDoctrine, /Emotionally trustworthy reflection infrastructure/i);
  assert.match(productDoctrine, /Streaks, scores, badges/i);
  assert.match(constitution, /Witness/);
  assert.match(constitution, /Perspective Offer/);
  assert.match(constitution, /Seed Question/);
  assert.match(operatingRules, /private model-provider credentials and model invocation must be server-only/i);
  assert.match(config, /streaks: false/);
  assert.match(config, /diagnosis: false/);
  assert.match(config, /directAdvice: false/);
  assert.match(config, /therapySimulation: false/);
  assert.match(config, /trainingOnJournalEntries: false/);
  assert.match(config, /manipulativeEngagementCopy: false/);
  assert.match(agents, /docs\/integrity\/PRODUCT_DOCTRINE\.md/);
});

test('Khepera implementation remains aligned with the reflection constitution', () => {
  const systemPrompt = read('src/services/khepera/systemPrompt.ts');
  const guards = read('src/services/khepera/qualityGuards.ts');
  const validation = read('src/services/khepera/outputValidation.ts');

  assert.match(systemPrompt, /"witness": string/);
  assert.match(systemPrompt, /"perspective": string/);
  assert.match(systemPrompt, /"seed": string/);
  assert.match(systemPrompt, /exactly one open-ended, non-directive question/);
  assert.match(systemPrompt, /not a therapist, coach, or assistant/);
  assert.match(guards, /diagnostic_language/);
  assert.match(guards, /coaching_language/);
  assert.match(guards, /productivity_framing/);
  assert.match(validation, /directive_language/);
  assert.match(validation, /seed_question_count/);
});

test('selected live copy avoids therapy, progress, and dependency framing', () => {
  const liveCopy = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/auth/login/page.tsx',
    'src/app/auth/signup/page.tsx',
    'src/app/onboarding/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/journal/page.tsx',
    'src/app/insights/page.tsx',
    'src/app/terms/page.tsx',
    'src/components/HealthDisclaimer.tsx',
    'src/components/ui/FooterNav.tsx',
  ].map(read).join('\n');

  assert.doesNotMatch(
    liveCopy,
    /healing sanctuary|healing and transformation|begin your journey|companion in reflection|go deeper|AI companion/i,
  );
  assert.doesNotMatch(liveCopy, /\b(?:streak|achievement|falling behind|catch up)\b/i);
});
