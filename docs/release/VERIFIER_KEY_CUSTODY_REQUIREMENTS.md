# Verifier Key Custody Requirements

## Status

`LOCAL RELEASE KEY CUSTODY RECORDED - PRIVATE KEY EXTERNAL`

The verifier public key for `alchm-release-owner-2026-05` is recorded in
`docs/release/trusted-runtime-verifiers.json`. The corresponding private key is
kept outside the repository at the release operator's local custody path and
must never be committed.

## Current Runtime Verifier Key

| Field | Value |
| --- | --- |
| Verifier ID | `alchm-release-owner-2026-05` |
| Public key path | `~/.alchm/release-keys/alchm-release-owner-2026-05.public.pem` |
| Private key path | `~/.alchm/release-keys/alchm-release-owner-2026-05.private.pem` |
| Public key fingerprint | `02382b8c6fa145385e8a44d6337425921bbb7e19a88b071f65511c2a6f463de0` |
| Public key file SHA-256 | `9d219f59ac5ed5636a84deeda30863d1450b717328ce3777e56ded61cd3bfeb0` |
| Rotation date | `2026-06-06` |
| Release candidate | `62d5a383e5404633dc5ab3d04e813b3cdeeedb4f` |
| Evidence-tail | `cc5725543bc1d6d2ce2e4c00d3af27c5f96ec443` |

## Requirements

- Private keys must never be committed to the repository.
- Private key material must never be printed in release logs.
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
