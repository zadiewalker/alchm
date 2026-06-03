# Provider Secret Lineage Evidence

## Status

`RECORDED FOR NEW CANDIDATE - DEPLOYMENT AND RECEIPT BINDING STILL REQUIRED`

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
| Candidate SHA | `fcf06d42757136c1693afb3c1447d80df7d32ce6` |
| Functions hash | `b6a7829da9eb0b4bbcb08d15a92ce635b5031a07` |
| Rotation timestamp | `2026-05-29T02:54:13Z` |
| providerSecretLineageDigest | `ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a` |

This record does not include the secret value and does not by itself authorize
runtime continuity. Certification still requires same-SHA Functions deployment
evidence, rollback evidence, an approved verifier, and a signed production
runtime attestation receipt binding this digest. Previous receipt evidence
targeted `16e3a5d19ceee278957a413fb01b69178dca97cf` and is invalid for the
new source-bearing candidate `fcf06d42757136c1693afb3c1447d80df7d32ce6`.

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
