# Executable Deployment Receipt Lifecycle

## Status

`LIFECYCLE CONTRACT DEFINED - NO RECEIPT ISSUED`

This record defines receipt lifecycle semantics for deployment-attested
continuity authorization. It does not issue a receipt or authorize runtime
continuity.

## Issuance

A receipt may be issued only by an approved verifier after the verifier has
validated:

- clean immutable candidate SHA;
- normalized release scope;
- emulator authorization evidence;
- same-SHA Firebase Functions evidence;
- same-SHA Firestore rules evidence;
- provider-secret lineage digest;
- deployment evidence digest;
- rollback lineage;
- selected deployment topology.

## Expiration

Each receipt has an explicit `expiresAt`. Expired receipts fail both release
preflight and runtime verification.

## Invalidation

A receipt is invalidated by:

- candidate SHA change;
- Functions or rules deployment change;
- provider-secret lineage change;
- deployment evidence change;
- rollback authority change;
- verifier revocation or expiration;
- consumed receipt ID;
- release-scope mutation.

## Replay

Receipt IDs are single-use. The runtime evidence register tracks
`consumedReceiptIds`; a receipt listed there cannot authorize continuity again.

## Rollback And Supersession

Rollback requires a separately attested rollback receipt or an explicitly
documented fail-closed rollback state. A newer deployment supersedes prior
deployment-bound receipts unless the rollback lineage explicitly authorizes
reuse.

## Current State

No receipt exists. The registry contains no approved verifier. Runtime
continuity remains unavailable.
