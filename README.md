# ALCHM

ALCHM is a trauma-informed return-based writing system.

The product shape is intentionally narrow:

- user writes once
- time passes
- something comes back
- a new entry begins only when the user chooses it

ALCHM is not a productivity tool, coaching product, therapy replacement, mood analytics dashboard, or engagement system.

## Contributor Entry Points

- `CONTRIBUTING.md` defines the daily implementation contract.
- `docs/emotional-language-governance.md` defines user-facing language boundaries.
- `docs/operational-trustworthiness.md` defines deterministic build expectations.
- `docs/repository-coherence.md` defines repository extension and retirement rules.

## Validation Baseline

Use the canonical checks before opening or merging changes:

```bash
npm run qa:governance
npx tsc --noEmit --skipLibCheck -p tsconfig.json
npm run build
```

For operational changes, run `npm run build` twice. The build command owns `.next/` and `out/` cleanup through `scripts/prepare-next-build.js`.

## Extension Model

Prefer:

1. Static config
2. Pure helper
3. Guardrails
4. Presentation layer
5. Minimal orchestration

Avoid hidden lifecycle behavior, duplicate flows, runtime emotional interpretation, new persistence for emotional state, and SDK usage outside `src/services/`.

