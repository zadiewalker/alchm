# TypeScript Strictness Validation

`tsconfig.json` now enables `strict: true`. `next.config.js` no longer permits
TypeScript or ESLint errors to be ignored during production builds.

Validation completed on May 24, 2026:

- `npm run typecheck` passes with `strict: true` after stale generated
  `.next/types` declarations for deleted routes were quarantined as generated
  output.

Ownership-boundary parsing still recommended for further hardening:

- `src/services/offline/localQueue.ts`: IndexedDB request results need a
  queue-item decoder rather than `QueuedEntry` assertions.
- `src/services/journal/entriesService.ts` and
  `src/services/data/dataService.ts`: Firestore snapshot data needs explicit
  journal/container DTO deserializers.
- `src/services/subscriptions/revenueCatService.ts`: cached entitlement and
  plugin error payloads need runtime narrowing.
- `src/services/storage/storageMigrationService.ts`: legacy stored values need
  discriminated migration decoders.
- `src/services/auth/authService.ts`: Firebase profile and offline-auth
  representations need separate typed DTO construction.
- `src/services/notifications/notificationService.ts` and
  `src/services/notifications/notificationLoader.ts`: Capacitor plugin payloads
  and registry access need runtime guards.

Test-tooling limitations:

- `eslint.config.mjs` currently ignores `.ts` and `.tsx` because the repository
  has not configured a TypeScript ESLint parser. `npm run lint` is constrained
  to source/config paths and validates runnable JavaScript checks, while
  `npm run typecheck` is the enforced TypeScript gate.
- The repository does not include `@firebase/rules-unit-testing` or
  `firebase-tools`; `src/__tests__/firestoreRulesContract.test.mjs` therefore
  validates canonical paths and deny/owner rule shape, but does not execute
  emulator authorization requests.
- `src/__tests__/kheperaAdaptivePipeline.test.mjs` cannot currently execute
  through plain `node --test`: Node cannot resolve extensionless TypeScript
  imports reached from `src/services/khepera/analyzeEntry.ts`.

Migration rule: correct these types at their ownership boundaries; do not use
`as any`, `@ts-ignore`, `@ts-expect-error`, or new non-null assertions to make
strict mode pass.
