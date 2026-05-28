# ALCHM Integrity Operating Rules

This document turns product doctrine into review and release behavior.

## Emotional Safety Rules

- Prefer observational language to interpretation.
- Prefer optionality to prompts that create obligation.
- Do not use absence, elapsed time, frequency, or return timing to imply failure or improvement.
- Do not surface raw journal writing outside user-directed views or explicit export.
- Crisis resources remain reachable independent of paid access.

## AI Boundary Rules

- The browser may perform an early synchronous crisis check; it is not a trusted server boundary.
- Private model-provider credentials and model invocation must be server-only for production.
- Until a verified server-owned generation gateway exists, client-delivered builds must fail closed and use guarded local fallback rather than call model providers directly.
- Secondary model operations, including theme extraction, follow the same consent and safety boundary as reflection generation.
- AI output is validated before persistence or display.

## Privacy and Data Minimization

- Use `DATA_RIGHTS_MAP.md` when adding persistence, export, deletion, or retention behavior.
- Khepera memory is metadata only: theme tags and emotional tone.
- Do not retain raw writing in operational analytics, diagnostics, support tickets, or audit logs.
- Do not promise deletion, export, encryption, retention, or consent controls until they are implemented and tested.

## Required Checks

Before an integrity-sensitive change is complete:

- Run `npm run check:integrity`.
- Run `npm test`, `npm run typecheck`, and `npm run lint`.
- Run `npm run build` for client-visible or configuration changes.
- Run Functions compilation for backend changes.
- Treat AI authority, broad Firestore rules, unverified native artifacts, or ambiguous deployment identity as release blockers rather than assumptions.
- Do not automatically schedule writing-return notifications without a distinct, recorded user choice for that behavior.
