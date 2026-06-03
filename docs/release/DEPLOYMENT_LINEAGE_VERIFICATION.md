# Deployment Lineage Verification

## Status

`STALE FOR NEW CANDIDATE - SAME-SHA DEPLOYMENT EVIDENCE REQUIRED`

This record identifies the same-SHA evidence that must connect source
provenance to deployed reflective behavior. It does not choose the deployment
topology or authorize deployment.

The executable evidence-register preflight and immutable candidate
expectations are specified in
`docs/release/CANDIDATE_BOUND_LINEAGE_VERIFICATION.md`.
Signed receipt and digest binding semantics are specified in
`docs/release/EXECUTABLE_SAME_SHA_VERIFICATION.md`.

## Deployment Authorities

| Authority | Current observation | Required lineage evidence |
| --- | --- | --- |
| Firebase Functions | Previous deployment to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-02 | Stale for candidate `fcf06d42757136c1693afb3c1447d80df7d32ce6`; redeploy Functions and capture hashes/revisions |
| Firestore rules | Previous rules deployment to project `alchm-463017` by `zadiewalker@gmail.com` on 2026-06-02 | Local emulator result is `CANDIDATE_BOUND_PASS` for `fcf06d42757136c1693afb3c1447d80df7d32ce6`; production rules deployment evidence for the new candidate is still required |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | Previous Vercel production deployment `dpl_B8FUdpb8N3CbwsTzZ79ZBQ6Ev4vh` is `Ready` | Stale for candidate `fcf06d42757136c1693afb3c1447d80df7d32ce6`; redeploy or provide source/artifact proof for the new candidate |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Redacted lineage digest remains recorded; deployment binding must be reattached to new same-SHA Functions evidence |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | New sync/archive identity and RevenueCat entitlement evidence tied to `fcf06d42757136c1693afb3c1447d80df7d32ce6` required |
| RevenueCat | Native plugin and subscription source exist | Approved entitlement/runtime verification tied to native candidate |

## Candidate-Bound Verification Chain

The certification evidence chain must identify:

1. One clean reviewed commit SHA.
2. Required CI results for that identical SHA.
3. Functions and Firestore rules deployment records for that identical SHA.
4. Firestore emulator authorization output produced from that candidate's
   rules and tests.
5. Hosting and native artifacts, if in release scope, linked to that SHA.
6. Provider-secret presence and rollback authority attached to the selected
   deployment authority.

Record provenance fields such as `generatedBy`, `transitionedBy`, and
`continuityVersion` are not same-SHA runtime evidence.

## Runtime Enablement Consequence

Continuity transition exposure must remain denied while any lineage element is
absent, conflicting, or only asserted through environment configuration.
`docs/release/RUNTIME_ATTESTATION_MODEL.md` defines that fail-closed runtime
contract. Runtime attestation cannot be reissued for
`fcf06d42757136c1693afb3c1447d80df7d32ce6` until deployment lineage, rollback,
and native evidence are rebuilt for that candidate.
