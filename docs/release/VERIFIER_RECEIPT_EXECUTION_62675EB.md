# Verifier Admission and Production Receipt Execution

Candidate SHA: `62675eb845260407a39d1769b1f74e87dacc508b`

## Verifier Required Fields

`docs/release/trusted-runtime-verifiers.json` requires:

- `verifierId`
- `keyId`
- `publicKeyPem`
- `publicKeyFingerprintSha256`
- `authorityScope`: `runtime-continuity-attestation`
- `status`: `approved`
- `approvedBy`
- `approvedAt`
- `expiresAt`
- `trustRootReference`
- `lineageReference`
- `operator.name`
- `operator.contact`
- `revokedAt`: `null`

`approvedBy`, `trustRootReference`, and `lineageReference` must not self-attest
the verifier. Private key material must not be committed.

## Admission JSON Template

```json
{
  "verifierId": "release-owner-verifier-2026-05-30",
  "keyId": "release-owner-verifier-2026-05-30-key-1",
  "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n<FILL_PUBLIC_KEY_ONLY>\n-----END PUBLIC KEY-----",
  "publicKeyFingerprintSha256": "<FILL_SHA256_OF_PUBLIC_KEY_PEM_TRIMMED_AS_CHECKER_COMPUTES>",
  "authorityScope": "runtime-continuity-attestation",
  "status": "approved",
  "approvedBy": "<FILL_SEPARATE_RELEASE_AUTHORITY>",
  "approvedAt": "<FILL_ISO_8601_APPROVAL_TIMESTAMP>",
  "expiresAt": "<FILL_ISO_8601_EXPIRATION_TIMESTAMP>",
  "trustRootReference": "<FILL_NON_SELF_ATTESTED_RELEASE_AUTHORITY_REFERENCE>",
  "lineageReference": "<FILL_VERIFIER_BUILD_AND_CUSTODY_REFERENCE>",
  "operator": {
    "name": "<FILL_OPERATOR_NAME>",
    "contact": "<FILL_OPERATOR_CONTACT>"
  },
  "revokedAt": null
}
```

## Runtime Evidence Template

Each evidence `sha` must equal candidate SHA for the current checker.
Evidence-specific digests are recorded in `reference`.

```json
{
  "schemaVersion": 1,
  "attestationStatus": "ATTESTED",
  "runtimeEnablementAuthorized": true,
  "candidateSha": "62675eb845260407a39d1769b1f74e87dacc508b",
  "deploymentEnvironment": "production",
  "verifiedAt": "<FILL_ISO_8601_VERIFIED_AT>",
  "verificationAuthority": {
    "status": "verified",
    "reference": "<FILL_RELEASE_AUTHORITY_APPROVAL_REFERENCE>"
  },
  "consumedReceiptIds": [],
  "evidence": {
    "cleanCandidate": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "git rev-parse HEAD = 62675eb845260407a39d1769b1f74e87dacc508b; clean worktree"
    },
    "releaseScope": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "npm run check:release-scope passed"
    },
    "firestoreEmulatorAuthorization": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "npm run check:firestore-emulator-evidence passed 6/6; firestoreRulesDigest=e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6"
    },
    "functionsDeployment": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "functionsHash=b6a7829da9eb0b4bbcb08d15a92ce635b5031a07; Firebase Functions deployment revision=<FILL_DEPLOYED_REVISION>"
    },
    "firestoreRulesDeployment": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "firebaseProject=alchm-463017; firestoreRulesDigest=e142868652eeb0d0f876491cc540357c08f870198d9b2253485e6467a6a982e6"
    },
    "providerSecretPresence": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "providerSecretLineageDigest=ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a firebaseProject=alchm-463017 functionsHash=b6a7829da9eb0b4bbcb08d15a92ce635b5031a07 secretRef=ANTHROPIC_API_KEY secretVersion=1 rotationTimestamp=2026-05-29T02:54:13Z"
    },
    "deploymentAuthority": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "Vercel production deployment dpl_5wnejochTEuHLBMcSUcqL2dUcK2C; Firebase project alchm-463017"
    },
    "rollbackAuthority": {
      "verified": true,
      "sha": "62675eb845260407a39d1769b1f74e87dacc508b",
      "reference": "<FILL_ROLLBACK_EVIDENCE_REFERENCE>"
    }
  }
}
```

## Production Receipt Payload Template

The final signed receipt must be placed at `receipt` in
`docs/release/runtime-attestation-evidence.json`.

```json
{
  "algorithm": "RSA-SHA256",
  "payload": {
    "schemaVersion": 1,
    "receiptId": "<FILL_UNIQUE_PRODUCTION_RECEIPT_ID>",
    "verifierId": "release-owner-verifier-2026-05-30",
    "candidateSha": "62675eb845260407a39d1769b1f74e87dacc508b",
    "evidenceDigest": "76cc7f0307185a690b777d64a3a671314b32a185ecb58c43ba20e0c054832d33",
    "deploymentEnvironment": "production",
    "functionsDeploymentSha": "62675eb845260407a39d1769b1f74e87dacc508b",
    "firestoreRulesDeploymentSha": "62675eb845260407a39d1769b1f74e87dacc508b",
    "deploymentEvidenceDigest": "20c9fc85567167b4377a2a1c541b984c53ec178717c6884f69cee465871902e9",
    "providerSecretLineageDigest": "add822952eb58e78c92cd1f1b5b0c11ba69a5dc2e2df1c155becd52e4980f186",
    "authorizationScope": "continuity-transitions",
    "issuedAt": "<FILL_ISO_8601_ISSUED_AT>",
    "expiresAt": "<FILL_ISO_8601_EXPIRES_AT>"
  },
  "signatureBase64": "<FILL_RSA_SHA256_SIGNATURE_OVER_CANONICAL_RECEIPT_PAYLOAD>"
}
```

The recorded provider lineage digest remains:
`ee5a09c29733523f48c39d3524f492b4c5d201d4f8909b966d987886e7dacd7a`.
The receipt field above is the checker-derived digest for the full
`providerSecretPresence` evidence item.

## Verification Command

```bash
npm run check:runtime-attestation
```
