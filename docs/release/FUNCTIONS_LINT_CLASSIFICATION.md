# Functions Lint Classification

## Status

Functions lint is a release blocker. The full command executes and currently
reports substantial existing debt; this document prevents trust-critical
findings from being hidden among style-only output.

Observed again on 2026-05-27 in the dirty integration worktree:

| Command | Result | Certification treatment |
| --- | --- | --- |
| `npm run check:functions-trust-lint` | Failed: 284 errors in Tier 1 files, including quote style, explicit `any`, and unused values. | Blocks candidate validation until remediated on a fixed SHA. |
| `npm --prefix functions run lint` | Failed: 2,583 errors across the expanded dirty Functions source tree. | Blocks release unless resolved or deployment scope is formally narrowed and validated. |

These counts describe the inspected worktree only; they are not attached to a
fixed candidate SHA.

The new continuity files `functions/src/containerTransitions.ts`,
`functions/src/containerTransitionsCore.ts`, and
`functions/src/continuityRuntimeGateCore.ts`, and
`functions/src/runtimeAttestationVerifierCore.ts` require targeted ESLint execution
on 2026-05-27; the reported Tier 1 failures remain in existing authority
files.

## Tier 1 - Trust, Security, and Release Authority

These files are subject to the focused command
`npm run check:functions-trust-lint`:

| File | Why it is Tier 1 |
| --- | --- |
| `functions/src/kheperaGateway.ts` | Provider secret access and callable server authority |
| `functions/src/kheperaGatewayCore.ts` | Authentication, crisis re-check, validation, and rate limiting |
| `functions/src/containerTransitions.ts` | Authenticated continuity transition persistence and provenance |
| `functions/src/containerTransitionsCore.ts` | Allowed activation contract and authority validation |
| `functions/src/continuityRuntimeGateCore.ts` | Fail-closed runtime attestation decision boundary |
| `functions/src/runtimeAttestationVerifierCore.ts` | Signed receipt, candidate binding, expiry, and replay verification boundary |
| `functions/src/privacyService.ts` | Export/deletion workflow authority and sensitive data handling |
| `functions/src/dataRetentionService.ts` | Disabled retention enforcement and deletion authority |
| `functions/src/auth.ts` | Authentication boundary |
| `functions/src/adminAuth.ts` | Privileged authorization boundary |
| `functions/src/index.ts` | Exported deployed Functions surface |

Tier 1 failures block release review even when they are styling rules, because
these files must be individually reviewable and must pass their declared
validation on the fixed candidate SHA.

## Tier 2 - Operational Clarity

Community, monitoring, consent, alerting, and shared backend service files may
contain dead paths, duplicate behavior, or unclear ownership. These require a
bounded follow-up review before their exported status or deployment scope is
accepted.

## Tier 3 - Style and Mechanical Consistency

Quote-style, indentation, and similar mechanical findings outside Tier 1 may
be corrected in a separate formatting-only change after authority scope is
fixed. They must not be mixed with release-critical behavioral remediation.

## Closing Evidence

Before certification, require:

- Passing `npm run check:functions-trust-lint`.
- Passing `npm --prefix functions run lint`, or an intentionally reviewed,
  candidate-bound narrowing of the deployed Functions source scope.
- Review of every exported Function included in the selected deployment
  authority.
