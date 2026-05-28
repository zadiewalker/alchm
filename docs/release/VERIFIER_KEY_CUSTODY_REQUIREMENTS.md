# Verifier Key Custody Requirements

## Status

`HUMAN SECURITY AUTHORITY REQUIRED`

No verifier private key custody evidence is present in this repository.

## Requirements

- Private keys must never be committed to the repository.
- Public verifier keys must be fingerprinted with SHA-256 before admission.
- Key custody must identify operator, storage boundary, rotation path, and
  revocation authority.
- Production verifier keys must be separate from non-production test keys.
- Test receipts must be marked test-only and rejected for production runtime
  continuity.

## Rotation and Revocation

- Rotation requires a new verifier record and explicit supersession of the old
  fingerprint.
- Revocation must immediately invalidate outstanding receipts from that
  verifier unless a release authority documents a narrower response.
- Compromise response must include candidate SHA, deployment environment, and
  receipt ID ranges affected.
