# Executable Trusted Verifier Integration

## Status

`INTEGRATION CONTRACT IMPLEMENTED - NO TRUSTED VERIFIER ADMITTED`

This record defines the executable verifier integration boundary. It does not
approve a verifier, issue a receipt, or enable runtime continuity.

## Verifier Governance

Verifier admission requires a reviewed registry entry in
`docs/release/trusted-runtime-verifiers.json` with:

- unique `verifierId`;
- immutable `keyId`;
- `publicKeyFingerprintSha256` that matches `publicKeyPem`;
- `authorityScope` exactly `runtime-continuity-attestation`;
- approved public key;
- separate `approvedBy` release authority;
- valid `approvedAt`;
- optional `expiresAt` and `revokedAt` lifecycle;
- nonempty `trustRootReference`.
- nonempty `lineageReference`;
- nonempty operator name and contact metadata.

The runtime verifier and release preflight reject duplicate verifier IDs,
duplicate public key fingerprints, incomplete trust records, invalid authority
scope, public key fingerprint mismatch, expired trust, revoked trust, and
self-attested trust. The registry is intentionally empty until a human release
authority approves an external verifier.

## Receipt Semantics

The receipt payload must bind:

- candidate SHA;
- release evidence digest;
- deployment environment;
- same-SHA Functions deployment SHA;
- same-SHA Firestore rules deployment SHA;
- deployment evidence digest;
- provider-secret lineage digest;
- verifier identity;
- `continuity-transitions` scope;
- bounded issuance and expiry timestamps.

Receipt IDs are single-use. A consumed receipt is invalid, even if its signature
and timestamp window remain otherwise valid.

## Runtime Verification Semantics

Runtime continuity can only receive a structured verified attestation result
from a reviewed adapter. The current callable has no such adapter, so source
verification capability cannot expose continuity.

Environment variables, edited JSON, or a private key controlled by the runtime
cannot create verifier trust. Signatures are accepted only after verifier
admission and deployment-bound evidence verification.

## Compromise And Rollback

A verifier compromise requires immediate registry revocation, new release
candidate evidence, invalidation of unconsumed receipts, and rollback lineage
review. Revoked or expired verifier records fail both runtime verification and
release preflight.

## Certification Requirements

Certification requires:

- approved verifier admission;
- clean candidate scope;
- candidate-bound emulator authorization evidence;
- same-SHA Functions and rules deployment evidence;
- provider-secret lineage evidence;
- rollback authority;
- deployment-bound signed receipt;
- runtime adapter review;
- proof that missing, stale, replayed, self-attested, or deployment-mismatched
  receipts fail closed.
