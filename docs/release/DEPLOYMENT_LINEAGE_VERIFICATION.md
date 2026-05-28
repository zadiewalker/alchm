# Deployment Lineage Verification

## Status

`UNRESOLVED - RUNTIME EVIDENCE REQUIRED`

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
| Firebase Functions | Configuration exists for Functions deployment | Immutable candidate SHA, deployed function revision identity, and callable inventory |
| Firestore rules | `firebase.json` names `firestore.rules` | Candidate SHA, emulator result for the same rules, and deployed rules identity |
| Hosting | Firebase Hosting is retained as redirect edge to Vercel | Deployed redirect configuration identity and rollback target |
| Vercel/static export | `output: 'export'` emits the production web artifact | Deployed artifact digest, deployment actor, timestamp, environment, and candidate SHA |
| Provider secret | Khepera reads `ANTHROPIC_API_KEY` server-side | Secret-presence verification in selected Functions environment without value disclosure |
| Native runtime | Capacitor and generated iOS identifiers are reconciled to `com.alchm.sanctuary` | Sync evidence, archive identity, and RevenueCat entitlement evidence tied to SHA |
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
contract.
