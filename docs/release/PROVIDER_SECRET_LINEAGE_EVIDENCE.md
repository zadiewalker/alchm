# Provider Secret Lineage Evidence

## Status

`DEPLOYMENT CHECKED - PROVIDER SECRET BINDING NOT VERIFIED`

No provider secret value is stored here. Certification requires redacted lineage
evidence, not the secret itself.

## Recorded Lineage

| Field | Value |
| --- | --- |
| Provider | `anthropic` |
| Secret reference | `ANTHROPIC_API_KEY` |
| Secret version | `1` |
| Deployment environment | `production` |
| Firebase project | `alchm-463017` |
| Candidate SHA | `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` |
| Functions hash | `1dc3db804da29d30c9bae70ee4ae58d8e61cca68` |
| Rotation timestamp | `2026-05-29T02:54:13Z` |
| providerSecretLineageDigest | Not recorded for current candidate |

This record does not include the secret value and does not by itself authorize
runtime continuity. Targeted Firebase Functions deployment was completed for
the current candidate lineage on 2026-06-05, but post-deploy provider metadata
does not verify the expected Anthropic secret binding.

`functions/src/kheperaGateway.ts` reads `process.env.ANTHROPIC_API_KEY`.
`firebase functions:list --project alchm-463017 --json` reports deployed
`generateKheperaReflection` as ACTIVE with hash
`1dc3db804da29d30c9bae70ee4ae58d8e61cca68`, but its environment metadata does
not show `ANTHROPIC_API_KEY`. Local `functions/.env` does not contain
`ANTHROPIC_API_KEY`. `firebase functions:secrets:access ANTHROPIC_API_KEY
--project alchm-463017` failed without printing the secret value. `gcloud
secrets describe ANTHROPIC_API_KEY --project alchm-463017 --format=json`
failed because the current gcloud auth token refresh returned `invalid_grant`.

Previous receipt evidence targeted
`16e3a5d19ceee278957a413fb01b69178dca97cf` and is invalid for the current
source-bearing candidate `cf92af3579e9736665f2876a3a44c31032805a42`.
It is also invalid for source-bearing candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`.

## Evidence Format

- provider name
- deployment environment
- secret version identifier or manager reference
- redacted SHA-256 lineage digest
- rotation timestamp
- deployment timestamp
- deployment actor or approver metadata when available
- rollback invalidation rule
- candidate SHA binding
- deployment digest binding
- verifier receipt binding

## Runtime Binding

Runtime attestation receipts must include `providerSecretLineageDigest`.
Receipts with missing or mismatched provider-secret lineage must fail.

The lineage digest must be computed from redacted metadata only. It must prove
which provider-secret generation was present in the selected deployment
environment without storing or printing the secret value.

## Deployment Binding

| Field | Evidence |
| --- | --- |
| Secret access check | Failed without printing the secret value |
| Bound function | `generateKheperaReflection(us-central1)` |
| Deployed function hash after deployment | `1dc3db804da29d30c9bae70ee4ae58d8e61cca68` |
| Deployed environment key evidence | `firebase functions:list --project alchm-463017 --json` does not show `ANTHROPIC_API_KEY` for `generateKheperaReflection` |
| Local secret cleanup | `functions/.env` does not contain `ANTHROPIC_API_KEY` |

## Prohibited Evidence

Do not commit provider API keys, private keys, raw secret values, or screenshots
that reveal secret material.
