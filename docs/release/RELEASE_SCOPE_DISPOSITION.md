# Release Scope Disposition

## Status

`PARTIALLY NORMALIZED - GENERATED OUTPUT EXCLUDED`

No duplicate path is silently accepted for certification.

| Path | Disposition | Certification effect |
| --- | --- | --- |
| `functions/functions/` | Removed/non-authoritative | Must remain absent |
| `ios/App 2/` | Removed/non-authoritative | Must remain absent |
| `alchm-clean/` | Removed/non-authoritative | Must remain absent |
| `emergency-backups/` | Removed/non-authoritative | Must remain absent |
| `artifacts/` | Removed/non-authoritative | Must remain absent unless candidate-bound evidence path is approved |
| `.github/workflows 2/` | Removed/non-authoritative | Must remain absent |
| `.github/workflows 3/` | Removed/non-authoritative | Must remain absent |
| `.next/` | Generated Next output | Excluded/generated; must not be committed as authority |
| `out/` | Generated export output | Excluded/generated; must not be committed as authority |
| `functions/lib/` | Generated Functions output | Not source authority; deployment policy unresolved |

## Required Closure

Certification requires a clean candidate SHA with exactly one authoritative
source tree for app, Functions, workflows, Firestore rules, and native release
inputs.

Current dirty state includes broad source, generated-output, evidence-doc, and
human-review changes. It cannot become a clean immutable candidate until a
human release authority reviews, stages, commits, and pushes the intended
candidate scope. Generated paths remain non-authoritative even when present
after validation.

`npm run check:release-scope` currently passes when the removed duplicate
authority paths remain absent. Generated output paths may still exist locally
after builds, but they are excluded from release authority and must not be used
as deployment evidence without same-SHA attestation.

## Dirty Candidate Classification - 2026-05-28

Candidate SHA under review:
`d3106eefc9a63ff72198bba8cb9bb5c6890fb9a4`.

Branch under review: `release/clinical-architecture-integration`.

The worktree is not clean. Certification remains blocked until a human release
authority reviews and commits the intended candidate scope.

| Classification | Paths | Required action |
| --- | --- | --- |
| Release candidate source | `.github/workflows/validate.yml`, root package/config files, `firebase.json`, `firestore.rules`, `storage.rules`, `src/**`, `functions/src/**`, `functions/__tests__/**`, `scripts/check-*.mjs`, `scripts/run-firestore-emulator-evidence.mjs`, `capacitor.config.ts`, authoritative `ios/App/**` inputs | Human review, then stage only intentional source changes |
| Release evidence | `docs/release/**`, `DATA_RIGHTS_MAP.md`, release certification scripts, candidate-bound evidence JSON | Human review, then stage only evidence that is candidate-bound and not diagnostic-only |
| Generated artifact | `.next/**`, `out/**`, `functions/lib/**`, `ios/App/.next/**`, `ios/App/out/**` | Do not use as source authority; regenerate from the committed SHA during validation |
| Local-only artifact | `ios/App/alchm_*test*.png`, transient logs, local QA screenshots not declared as release assets | Remove locally or keep ignored; do not stage |
| Discard after approval | `alchm-v2/**`, `alchm-vite/**`, `ios/App 2/**` | If the duplicate trees are intentionally removed from release authority, stage the deletions after human review |
| Human review required | Broad modified app, Functions, native, docs, assets, and tests currently present in the dirty tree | Cannot be auto-certified or silently discarded |

## Exact Candidate Finalization Action

Do not use `git add -A` until the duplicate-tree deletions and generated
artifacts have been reviewed.

Recommended human sequence:

1. Review the dirty set with `git status --short --branch`,
   `git diff --name-only`, and targeted `git diff -- <path>` checks.
2. Confirm whether `alchm-v2/**`, `alchm-vite/**`, and `ios/App 2/**` are
   intentionally removed from release authority.
3. Keep generated artifacts out of source authority:
   `functions/lib/**`, `.next/**`, `out/**`, `ios/App/.next/**`,
   and `ios/App/out/**`.
4. Stage reviewed source and evidence intentionally, including duplicate-tree
   deletions only if approved.
5. Commit the candidate and capture the new full SHA.
6. Re-run release validation and evidence capture from that clean SHA.

Until that sequence is complete, the release decision remains
`PARTIALLY REMEDIATED, NOT CERTIFIED`.
