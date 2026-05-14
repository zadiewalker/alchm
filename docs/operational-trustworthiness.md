# Operational Trustworthiness

ALCHM should be calm operationally for the same reason it is calm emotionally: hidden instability erodes trust.

## Build Lifecycle

Canonical build flow:

1. Clean `.next/` and `out/`
2. Run `next build`
3. Generate static pages
4. Export assets
5. Exit cleanly

`scripts/prepare-next-build.js` owns artifact cleanup. This prevents stale export files from causing late `EEXIST` copy collisions during static export.

## Principles

- Prefer deterministic cleanup over manual instructions.
- Prefer explicit lifecycle ownership over hidden process state.
- Prefer small scripts over broad build-tool rewrites.
- Do not disable observability unless it is proven causal.
- Treat repeated builds as the reliability baseline.

## Known Build Warnings

Sentry/OpenTelemetry may emit static-analysis warnings during `next build`. These warnings are noisy but not the current build blocker. Do not redesign telemetry to silence them unless there is a proven runtime or CI failure.

## Validation Baseline

```bash
npm run qa:governance
npx tsc --noEmit --skipLibCheck -p tsconfig.json
npm run build
npm run build
```
