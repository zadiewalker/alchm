# Provider Secret Lineage Evidence

## Status

`RECORDED FOR NEW CANDIDATE - DEPLOYED PROVIDER SECRET BINDING VERIFIED`

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
| Candidate SHA | `d255aded50d97a5325b56c7db431969249546f85` |
| Functions hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Rotation timestamp | `2026-05-29T02:54:13Z` |
| providerSecretLineageDigest | `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` |

This record does not include the secret value and does not by itself authorize
runtime continuity. Targeted Firebase Functions deployment was completed for
the current candidate lineage on 2026-06-04, and post-deploy provider metadata
now verifies the expected Anthropic secret binding.

`functions/src/kheperaGateway.ts` reads `process.env.ANTHROPIC_API_KEY`.
`firebase functions:secrets:access ANTHROPIC_API_KEY --project alchm-463017`
succeeded without printing the secret value. `generateKheperaReflection` was
then redeployed with that secret material bound to `ANTHROPIC_API_KEY`, and
`firebase functions:list --project alchm-463017 --json` reports deployed
`generateKheperaReflection` environment keys including `ANTHROPIC_API_KEY`.

Previous receipt evidence targeted
`16e3a5d19ceee278957a413fb01b69178dca97cf` and is invalid for the current
source-bearing candidate `d255aded50d97a5325b56c7db431969249546f85`.

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
| Secret access check | `firebase functions:secrets:access ANTHROPIC_API_KEY --project alchm-463017` exited successfully without printing the secret value |
| Bound function | `generateKheperaReflection(us-central1)` |
| Deployed function hash after rebinding | `ea67e160fcd9a01e3d8ea587d67a63bb207c2c3f` |
| Deployed environment key evidence | `firebase functions:list --project alchm-463017 --json` shows `ANTHROPIC_API_KEY` in `envKeys` for `generateKheperaReflection` |
| Local secret cleanup | ignored `functions/.env` was restored after deploy and no `ANTHROPIC_API_KEY` remained in the local file |

## Prohibited Evidence

Do not commit provider API keys, private keys, raw secret values, or screenshots
that reveal secret material.
