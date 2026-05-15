# Repository Coherence

ALCHM depends on repository calm for product calm. Contributors should be able to find the canonical path quickly and extend it without inheriting stale experiments.

## Coherence Principles

- Prefer explicit ownership over implicit behavior.
- Prefer deletion over preserving abandoned experiments.
- Prefer deterministic validation over manual cleanup.
- Prefer one canonical path per domain.
- Prefer static configuration and pure helpers before orchestration.
- Keep governance narrow, visible, and CI-enforced.

## Safe Extension Pattern

Use this sequence for new product surfaces:

1. Static config
2. Pure helper
3. Guardrail
4. Presentation layer
5. Minimal orchestration

Do not introduce hidden shared state, emotional inference engines, duplicate service flows, or runtime language systems.

## Operational Pattern

Use this sequence for operational work:

1. Explicit cleanup
2. Deterministic validation
3. Static CI checks
4. Minimal runtime complexity
5. Clean exit

`npm run build` is the canonical build path and owns `.next/` and `out/` cleanup.

## Mandatory Review Zones

Changes require extra review when they touch:

- Khepera prompts, schema, or crisis-adjacent code
- return selection, suppression, routing, or notifications
- memory persistence or emotional metadata
- onboarding, community, or archive language
- build/export lifecycle scripts
- CI governance scripts
- new app roots, duplicate apps, or legacy migration paths
- Firebase Functions deployment surfaces

## Retired Legacy Roots

The repository retired these legacy app roots:

- `alchm-v2/`
- `alchm-vite/`

Do not recreate or edit these as active product surfaces. Historical context remains in Git history. If old implementation details are needed, inspect history instead of restoring parallel app roots.

## Firebase Functions Boundary

`functions/` is a retired compatibility surface for Firebase Hosting rewrites and health checks. It must not contain AI analysis, predictive crisis logic, therapeutic-progress systems, emotional analytics, or alternate reflection generation.

The canonical reflection and crisis-ordering path remains `src/services/journal/submissionPipeline.ts`. If future server functionality is needed, introduce it through an explicit architecture review instead of restoring old functions modules.

Do not commit generated or installed function artifacts:

- `functions/lib/`
- `functions/node_modules/`

Do not commit duplicate iOS roots:

- `ios/App 2/`
- `ios/capacitor-cordova-ios-plugins 2/`

## Stale Artifact Policy

Do not commit source artifacts ending in:

- `.bak`
- `.backup`
- `.disabled`
- `.old`

Use version control for history. Local build artifacts should remain ignored.
