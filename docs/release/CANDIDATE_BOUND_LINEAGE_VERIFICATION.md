# Candidate-Bound Lineage Verification

## Status

`EXECUTABLE CHECK PRESENT - NO ATTESTATION ACCEPTED`

This record defines the bounded executable verification contract for runtime
continuity exposure. It does not authorize deployment or select a production
runtime.

## Evidence Register

`docs/release/runtime-attestation-evidence.json` is a release evidence
register. In the current worktree it intentionally records `NOT ATTESTED` and
contains no candidate SHA or external authority references.
`docs/release/trusted-runtime-verifiers.json` intentionally contains no
approved verifier key. A verifier record is invalid if it is duplicated,
expired, revoked, incomplete, or self-attested.

Run:

```bash
npm run check:runtime-attestation
```

The command must fail until a clean reviewed candidate and externally
verifiable evidence exist. A passing structural check would validate a
recorded evidence chain; it would not by itself deploy code or create proof
from unsupported environment assertions.

## Required Candidate-Bound Chain

| Authority | Required record | Current state |
| --- | --- | --- |
| Candidate source | Full immutable SHA matching a clean authoritative checkout | Unavailable |
| Release scope | Evidence that duplicate authority paths are absent or dispositioned | Unavailable |
| Firestore authorization | Emulator result attributable to candidate rules/tests | Unavailable |
| Firebase Functions | Deployment revision/reference attributable to candidate SHA | Unavailable |
| Firestore rules | Deployed rules reference attributable to candidate SHA | Unavailable |
| Provider secret | Presence evidence for the selected server environment, without value disclosure | Unavailable |
| Deployment authority | Approved Firebase/Vercel/static/native topology record | Human decision required |
| Rollback authority | Named rollback reference and procedure tied to selected authority | Unavailable |

## Runtime Boundary

The server continuity gate does not read this local register or accept
environment assertions as runtime authority. Source now defines verification
for a signed, expiring, candidate-and-evidence-bound, deployment-bound,
replay-rejected receipt; no approved verifier or runtime adapter currently
supplies one. Therefore sanctuary transitions remain unavailable even if local
values are edited or deployment environment variables are populated.

## Certification Consequence

Certification remains blocked unless:

1. The evidence chain is complete for one clean candidate SHA.
2. The accepted verification authority is documented and externally
   inspectable.
3. A separately reviewed runtime adapter consumes a verifier-issued receipt
   without exposing continuity through mutable environment assertions.
4. The receipt binds deployment environment, deployed Functions SHA, deployed
   Firestore rules SHA, and deployment evidence digest.
5. Same-SHA deployment, emulator, privacy/lifecycle, native, and rollback
   evidence are complete.
