# Verifier Admission Packet

## Status

`NO APPROVED PRODUCTION VERIFIER`

`docs/release/trusted-runtime-verifiers.json` must remain empty until a human
release authority approves a verifier with custody evidence.

## Required Admission Evidence

- Immutable verifier ID.
- Public key PEM and SHA-256 fingerprint.
- Verifier operator name and contact.
- Authority scope: `runtime-continuity-attestation`.
- Approval timestamp and expiration timestamp.
- Trust-root reference that is not controlled by the verifier being admitted.
- Lineage reference for verifier build and operating environment.
- Revocation and rotation contact path.
- Compromise-response owner.

## Rejection Rules

Admission must fail for duplicate verifier IDs, duplicate key fingerprints,
self-attested trust roots, missing operator metadata, missing expiration,
revoked status, expired trust, incomplete lineage, or unverifiable approval.

## Certification Effect

An empty verifier registry is correct and blocks runtime continuity enablement.
Certification requires a verifier admission record tied to the candidate SHA and
deployment lineage evidence.
