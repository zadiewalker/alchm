# Provider Secret Lineage Evidence

## Status

`RECORDED - DEPLOYMENT AND RECEIPT BINDING STILL REQUIRED`

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
| Candidate SHA | `31ba4820fc5c53bdf84e33e941675011c51aa824` |
| Functions hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Rotation timestamp | `2026-05-29T02:54:13Z` |
| providerSecretLineageDigest | `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` |

This record does not include the secret value and does not by itself authorize
runtime continuity. Certification still requires same-SHA Functions deployment
evidence, rollback evidence, an approved verifier, and a signed production
runtime attestation receipt binding this digest. Current receipt evidence targets `31ba4820fc5c53bdf84e33e941675011c51aa824` and remains fail-closed until accepted by `npm run check:runtime-attestation`.

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

## Prohibited Evidence

Do not commit provider API keys, private keys, raw secret values, or screenshots
that reveal secret material.
