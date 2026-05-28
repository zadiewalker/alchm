# Deployment Authority Decision

## Status

`DECIDED - INTENTIONAL SPLIT SELECTED, EVIDENCE PENDING`

This record selects the deployment architecture observed in the integration
worktree. It does not approve a deploy or certify production evidence.

Selected topology: `INTENTIONAL_SPLIT`

## Observed Competing Authorities

| Option | Current evidence | Authority it would own | Required evidence before certification |
| --- | --- | --- | --- |
| Firebase Hosting + Functions | `firebase.json` declares hosting, rules, and Functions configuration, while hosting redirects application traffic to Vercel. | Hosting redirects, callable Functions, Firestore/storage rules, Firebase project identity. | Approved Firebase project, deployed rules/Functions identity for one SHA, configured provider secret presence, and routing tests. |
| Vercel server/API mode | `SERVER_DEPLOYMENT.md` states server/API mode and uses a Vercel production URL. | Next runtime and any server API routes served from Vercel. | Approved project/deployment identity for one SHA, environment/secret verification, and removal or reconciliation of contradictory Firebase/static guidance. |
| Static export only | `next.config.js` uses `output: 'export'`; local builds emit `out/`. | Static web artifact only; it cannot by itself establish server-authoritative reflection generation. | Approved hosting target, evidence that server-only Khepera remains available through a separately deployed gateway, and no unsupported API assumptions. |
| Capacitor/native runtime | `capacitor.config.ts` supports bundled static content by default and optional server mode. | iOS runtime packaging and selected web-hosting dependency. | Selected runtime mode, reconciled native config, Capacitor sync/archive evidence for the same SHA, and dependency on an approved gateway authority. |

## Trust Implications

- Khepera production capability requires a deployed server-owned gateway and
  provider secret verification; a static artifact alone cannot authorize it.
- Privacy, export, deletion, support, and transparency claims may be evaluated
  as deployed only after the selected runtime and backing Functions/rules are
  identified for the same candidate SHA.
- Rejecting an option requires removing or quarantining its configuration,
  generated output, or operational documentation from release authority. No
  such cleanup is authorized by this record.

## Decision

The release candidate uses these authorities:

1. Vercel is the production web hosting authority for the exported Next artifact.
2. Firebase Functions and Firestore rules remain the server-side authority for Khepera gateway, continuity mutations, privacy/export/deletion backends, and Firestore authorization.
3. Firebase Hosting is retained as a redirecting edge only.
4. Capacitor uses the same candidate artifact and depends on the selected hosting plus Firebase gateway authorities.
5. Same-SHA evidence and rollback records are still required for Vercel hosting, Firebase Functions, Firestore rules, provider-secret lineage, and native artifacts.

Until that evidence is recorded and verified, production certification is
blocked.
