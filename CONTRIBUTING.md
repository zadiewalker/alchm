# ALCHM Contributor Operating Guide

ALCHM is a trauma-informed return-based writing system. Contributions should preserve emotional restraint, deterministic operations, and maintainability before adding capability.

## Before Changing Code

Ask whether the change preserves:

- crisis access within two taps
- Khepera as reflection, not assistant
- metadata-only memory continuity
- missed days remaining silent
- returns as standalone events, not write funnels
- no gamification, analytics, coaching, progress, or pressure language

If the change makes ALCHM feel smarter but less trustworthy, do not ship it.

## Safe Extension Pattern

Prefer:

1. Static config
2. Pure helper
3. Guardrail
4. Presentation layer
5. Minimal orchestration

Avoid:

- hidden lifecycle behavior
- runtime emotional interpretation
- new persistence for emotional state
- behavioral tracking
- AI rewriting or moderation systems
- broad shared state

## Operational Workflow

Use the canonical build command:

```bash
npm run build
```

The build script owns `.next/` and `out/` cleanup. Do not rely on manual cleanup in CI.

Run the governance checks for copy, returns, and Khepera-facing changes:

```bash
npm run qa:governance
npx tsc --noEmit --skipLibCheck -p tsconfig.json
```

## Review Required

Escalate before changing:

- `src/services/khepera/*`
- crisis detection or emergency routes
- memory persistence schema
- return selection/suppression
- notification language
- onboarding language
- community or analytics surfaces
- build/export scripts

See `docs/emotional-language-governance.md` for language rules and retired-surface policy.
See `docs/repository-coherence.md` before adding new scripts, workflows, app roots, or architectural entry points.
