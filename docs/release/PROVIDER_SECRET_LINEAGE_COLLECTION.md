# Provider Secret Lineage Collection

Candidate SHA: `a8d89db0606fa326af97f36962a90f59db8bb9c6`

## Required Metadata

- Provider name: `anthropic`
- Secret name or manager reference for `ANTHROPIC_API_KEY`
- Deployment environment: `production`
- Firebase project: `alchm-463017`
- Secret version identifier or rotation generation
- Rotation timestamp
- Deployment actor
- Deployment timestamp
- Rollback invalidation rule
- Binding to Vercel deployment `dpl_5wnejochTEuHLBMcSUcqL2dUcK2C`
- Binding to Firebase Functions deployment revision
- Binding to production runtime attestation receipt ID

## Prohibited Data

- Raw provider API keys
- Screenshots that reveal secret values
- Private verifier keys
- Secret manager access tokens
- User data

## Digest Format

Compute a SHA-256 digest over redacted metadata only:

```text
provider=anthropic
secretRef=<redacted-manager-reference>
secretVersion=<version-or-generation>
environment=production
firebaseProject=alchm-463017
candidateSha=a8d89db0606fa326af97f36962a90f59db8bb9c6
functionsDeployment=<deployed-functions-revision>
rotationTimestamp=<ISO-8601>
deploymentTimestamp=<ISO-8601>
rollbackInvalidation=<rule-id-or-procedure>
```

## Collection Steps

1. Confirm `ANTHROPIC_API_KEY` exists in the production Firebase Functions environment.
2. Record only the secret manager reference and version/generation.
3. Record rotation timestamp and approver.
4. Record the Firebase Functions deployment revision using that secret generation.
5. Compute the redacted metadata digest.
6. Store the digest and metadata reference in release evidence.

## Recorded Lineage Digest

```text
providerSecretLineageDigest=ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a
candidateSha=a8d89db0606fa326af97f36962a90f59db8bb9c6
firebaseProject=alchm-463017
functionsHash=b6a7829da9eb0b4bbcb08d15a92ce635b5031a07
secretRef=ANTHROPIC_API_KEY
secretVersion=1
rotationTimestamp=2026-05-29T02:54:13Z
```

## Verification Steps

1. Verify no raw secret value appears in logs or committed files.
2. Verify the digest input references candidate `a8d89db0606fa326af97f36962a90f59db8bb9c6`.
3. Verify the digest input references the deployed Functions revision.
4. Verify the production attestation receipt includes `providerSecretLineageDigest`.
5. Run `npm run check:runtime-attestation`.
