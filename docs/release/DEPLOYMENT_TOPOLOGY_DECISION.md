# Deployment Topology Decision

## Status

`DECIDED - INTENTIONAL SPLIT SELECTED, SAME-SHA EVIDENCE PENDING`

Selected topology: `INTENTIONAL_SPLIT`

## Allowed Topologies

- `FIREBASE_AUTHORITATIVE`
- `VERCEL_AUTHORITATIVE`
- `INTENTIONAL_SPLIT`

The selected topology is an intentional split:

- Hosting authority: Vercel serves the Next.js static export generated from this repository.
- Firebase Hosting authority: Firebase Hosting is retained only as a redirecting edge to the Vercel hosting authority.
- Functions deployment authority: Firebase Functions own callable/server-authoritative operations, including Khepera gateway and continuity transitions.
- Firestore rules deployment authority: Firebase Firestore rules own sensitive write denial and owner-scoped access policy.
- Rollback authority: rollback requires matching Vercel deployment rollback plus Firebase Functions/rules rollback evidence for the same candidate SHA.
- Provider-secret deployment authority: provider secrets must be verified in the Firebase Functions deployment environment, not in client/static artifacts.
- Native authority if mobile release is in scope: Capacitor must be synced from the same candidate SHA and must target the selected hosting/gateway authorities.

## Required Authority Evidence

- Functions deployment authority.
- Firestore rules deployment authority.
- Hosting authority.
- Rollback authority.
- Provider-secret deployment authority.
- Native authority if mobile release is in scope.
- Same-SHA binding for deployed Functions, rules, hosting, and native artifacts.

## Certification Effect

Deployment ambiguity is resolved to `INTENTIONAL_SPLIT`, but certification remains
blocked until same-SHA deployment lineage, rollback evidence, provider-secret
lineage, Java-backed Firestore emulator evidence, and verifier-issued runtime
attestation are present. Runtime continuity must remain unavailable until
deployment lineage and verifier-issued attestation are both present.
