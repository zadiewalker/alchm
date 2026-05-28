# Provider Secret Lineage Evidence

## Status

`MISSING - HUMAN SECRET AUTHORITY REQUIRED`

No provider secret value is stored here. Certification requires redacted lineage
evidence, not the secret itself.

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
