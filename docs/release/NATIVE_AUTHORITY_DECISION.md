# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, CURRENT ARCHIVE REQUIRED`

Capacitor sync passed for current product candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`, and the canonical source
identifier remains `com.alchm.sanctuary`. A same-SHA archive, distribution
signing proof, RevenueCat dashboard proof, and TestFlight entitlement proof
remain required before native release certification.

Native scope decision: `NATIVE_IN_SCOPE`

## Observed Identity State

| Source | Observed value | Authority state |
| --- | --- | --- |
| `capacitor.config.ts` | `appId: 'com.alchm.sanctuary'` | Canonical source identifier |
| `ios/App/App/capacitor.config.json` | `appId: "com.alchm.sanctuary"` | Reconciled generated/native identifier |
| `ios/App 2/` | Multiple copied application and Pods trees | Non-canonical; excluded from release scope |

## Required Decision and Evidence

- Attach RevenueCat dashboard proof for bundle `com.alchm.sanctuary`.
- Preserve candidate-bound archive evidence in
  `docs/release/NATIVE_RELEASE_EVIDENCE.md`.
- Attach RevenueCat entitlement/product/offering proof for
  `ALCHM - Transformation`, `alchm_transformation_monthly`, `$rc_monthly`, and
  `default`.
- Attach sandbox/TestFlight purchase or restore evidence for the archived build.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until RevenueCat runtime
entitlement evidence exists, native release certification remains blocked.
