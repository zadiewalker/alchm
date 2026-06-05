# Production Runtime Attestation Signing

## Status

`SIGNING PATH IMPLEMENTED - EXTERNAL PRIVATE KEY REQUIRED`

This process issues the production runtime-attestation receipt expected by
`scripts/check-runtime-attestation-evidence.mjs`. It does not store private key
material and does not authorize native release evidence.

## Verifier

| Field | Value |
| --- | --- |
| Verifier ID | `alchm-release-owner-2026-05` |
| Receipt algorithm | `RSA-SHA256` |
| Product candidate | `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` |
| Evidence-tail input | `b67dc13759412d5c65c29f94c8a6fefbfd127e6e` |
| Function hash binding | `4f7568b4d268d26b06f6d6725982ed3c02fdbd33` |
| Vercel deployment binding | `dpl_6smNjSnhdYGHNEWAqevVSfVEegYD` |
| Provider secret binding | `ANTHROPIC_API_KEY` version `1` |

## Command

Run from the evidence-tail checkout, or from a later clean evidence-only
descendant that contains this signing process:

```bash
ALCHM_RUNTIME_ATTESTATION_PRIVATE_KEY_PATH=/external/path/alchm-runtime-verifier-rsa-private.pem \
node docs/release/issue-production-runtime-attestation-receipt.mjs
```

Optional environment:

```bash
ALCHM_RUNTIME_ATTESTATION_RECEIPT_ID=prod-unique-id
ALCHM_RUNTIME_ATTESTATION_RECEIPT_TTL_HOURS=24
ALCHM_RUNTIME_ATTESTATION_VERIFIER_ID=alchm-release-owner-2026-05
```

## Safety Rules

- The private key path is required.
- The private key path must resolve outside the repository.
- The external private key must derive to the approved public verifier
  fingerprint in `docs/release/trusted-runtime-verifiers.json`.
- The worktree must be clean before signing.
- The evidence-tail input above must be an ancestor of current HEAD.
- Any commits after the evidence-tail input must contain only release-evidence
  paths.
- The product candidate must be an ancestor of current HEAD.
- The evidence-tail may contain only allowed release-evidence paths.
- The script refuses to overwrite an existing receipt.
- Secret values and private key material are never logged.

## Output

The script writes only `docs/release/runtime-attestation-evidence.json`,
changing the runtime attestation status to `ATTESTED` and embedding the signed
receipt. After signing, run:

```bash
npm run check:runtime-attestation
npm run check:release-authority
npm run check:release-trust
npm run validate
git diff --check
```

Commit the evidence update only when those checks pass and the receipt was
issued with the external production verifier key.
