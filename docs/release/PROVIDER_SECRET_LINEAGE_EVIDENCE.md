# Provider Secret Lineage Evidence

## Status

`DEPLOYMENT CHECKED - PROVIDER SECRET BINDING VERIFIED`

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
| Candidate SHA | `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30` |
| Functions hash | `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` |
| Rotation timestamp | `2026-05-29T02:54:13Z` |
| providerSecretLineageDigest | Not recorded for current candidate |

This record does not include the secret value and does not by itself authorize
runtime continuity. Targeted Firebase Functions deployment was completed for
candidate `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` on 2026-06-05, and
post-deploy provider metadata verifies the expected Anthropic secret binding.
Product candidate `ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30` changes native
RevenueCat subscription integration only; Functions source and Firebase secret
binding are unchanged, so provider-secret lineage carries forward without
printing or rotating secret material.

`functions/src/kheperaGateway.ts` reads `process.env.ANTHROPIC_API_KEY`.
`firebase functions:list --project alchm-463017 --json` reports deployed
`generateKheperaReflection` as ACTIVE with hash
`4f7568b4d268d26b06f6d6725982ed3c02fdbd33`; its
`secretEnvironmentVariables` metadata includes key `ANTHROPIC_API_KEY`, secret
`ANTHROPIC_API_KEY`, version `1`. `firebase functions:secrets:access
ANTHROPIC_API_KEY --project alchm-463017` previously succeeded with output
redirected to `/dev/null`, proving access without printing the secret value.
Source inspection shows `generateKheperaReflection` is bound with
`functions.runWith({ secrets: ["ANTHROPIC_API_KEY"] })` and still reads
`process.env.ANTHROPIC_API_KEY`.

Previous receipt evidence targeted
`16e3a5d19ceee278957a413fb01b69178dca97cf` and is invalid for the current
source-bearing candidate `cf92af3579e9736665f2876a3a44c31032805a42`.
It is also invalid for source-bearing candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`.
It is also invalid for source-bearing candidate
`62d5a383e5404633dc5ab3d04e813b3cdeeedb4f`.
It is also invalid for native subscription candidate
`ba21195ad0b7feff7e3cd8aeb7e04966ad8ccf30`; a new receipt is recorded in
`docs/release/runtime-attestation-evidence.json`.

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
| Secret access check | Succeeded with output redirected to `/dev/null`; no secret value printed |
| Bound function | `generateKheperaReflection(us-central1)` |
| Deployed function hash after deployment | `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` |
| Deployed environment key evidence | `firebase functions:list --project alchm-463017 --json` shows `secretEnvironmentVariables` key `ANTHROPIC_API_KEY` for `generateKheperaReflection` |
| Source binding evidence | `functions.runWith({ secrets: ["ANTHROPIC_API_KEY"] })` on `generateKheperaReflection` |

## Prohibited Evidence

Do not commit provider API keys, private keys, raw secret values, or screenshots
that reveal secret material.
