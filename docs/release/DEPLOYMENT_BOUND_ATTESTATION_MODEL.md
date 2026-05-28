# Deployment-Bound Attestation Model

## Status

`RECEIPT BINDING CONTRACT IMPLEMENTED - DEPLOYMENT LINEAGE NOT ESTABLISHED`

This record defines the deployment-bound receipt contract for runtime
continuity. It does not establish production lineage or authorize runtime
continuity.

## Deployment Binding

An attestation receipt must bind the continuity authorization decision to:

- one immutable candidate SHA;
- one deployment environment;
- the deployed Firebase Functions SHA;
- the deployed Firestore rules SHA;
- the release evidence digest;
- the deployment evidence digest;
- the provider-secret lineage digest;
- the verifier identity;
- the `continuity-transitions` scope.

The deployment evidence digest covers Functions deployment evidence, Firestore
rules deployment evidence, provider-secret presence evidence, deployment
authority, and rollback authority. The provider-secret lineage digest is also
bound separately so continuity cannot be authorized when secret-presence
evidence drifts. A change in any of those records requires a new receipt.

## Rejection Conditions

The release preflight and runtime verifier reject:

- missing deployment environment;
- Functions SHA mismatch;
- Firestore rules SHA mismatch;
- deployment evidence digest mismatch;
- provider-secret lineage digest mismatch;
- stale deployment lineage;
- duplicate authority paths;
- dirty release scope;
- unapproved verifier identity;
- expired, revoked, or self-attested verifier trust;
- consumed receipt IDs.

## Runtime Authorization Requirements

Deployment-bound receipt verification is necessary but not sufficient. Runtime
continuity also requires emulator authorization evidence, a clean reviewed
candidate, approved deployment topology, provider-secret lineage, rollback
lineage, and an adapter reviewed to pass the verified result into the runtime
continuity gate.

That adapter is intentionally absent. Runtime continuity therefore remains
fail closed.

## Certification Requirements

Release certification requires same-SHA evidence for source, Functions, rules,
authorization tests, provider-secret verification, rollback authority, and the
deployment-bound receipt. Local source-level success or a standalone signature
does not certify production behavior.
