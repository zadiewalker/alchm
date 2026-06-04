# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, NEW CANDIDATE ARCHIVE REQUIRED`

The native archive produced for previous candidate
`16e3a5d19ceee278957a413fb01b69178dca97cf` confirmed the archive bundle
identifier was `com.alchm.sanctuary`. That archive is stale for new candidate
`3a7c6d93140527de77c2fcc91ea3a9f73013b9da`.

Native scope decision: `NATIVE_IN_SCOPE`

## Observed Identity State

| Source | Observed value | Authority state |
| --- | --- | --- |
| `capacitor.config.ts` | `appId: 'com.alchm.sanctuary'` | Canonical source identifier |
| `ios/App/App/capacitor.config.json` | `appId: "com.alchm.sanctuary"` | Reconciled generated/native identifier |
| `ios/App 2/` | Multiple copied application and Pods trees | Non-canonical; excluded from release scope |

## Required Decision and Evidence

- Attach RevenueCat dashboard proof for bundle `com.alchm.sanctuary`.
- Build a new iOS archive from candidate
  `3a7c6d93140527de77c2fcc91ea3a9f73013b9da`.
- Attach RevenueCat entitlement/product/offering proof for
  `ALCHM - Transformation`, `alchm_transformation_monthly`, `$rc_monthly`, and
  `default`.
- Attach sandbox/TestFlight purchase or restore evidence for the archived build.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until RevenueCat runtime
entitlement evidence exists, native release certification remains blocked.
