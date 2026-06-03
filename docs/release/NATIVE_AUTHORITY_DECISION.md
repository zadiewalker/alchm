# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, CANDIDATE ARCHIVE PRODUCED, REVENUECAT EVIDENCE PENDING`

The native archive produced for attested candidate
`16e3a5d19ceee278957a413fb01b69178dca97cf` confirms the archive bundle
identifier is `com.alchm.sanctuary`. Native release approval remains blocked
until RevenueCat dashboard and sandbox/TestFlight entitlement evidence is
attached.

Native scope decision: `NATIVE_IN_SCOPE`

## Observed Identity State

| Source | Observed value | Authority state |
| --- | --- | --- |
| `capacitor.config.ts` | `appId: 'com.alchm.sanctuary'` | Canonical source identifier |
| `ios/App/App/capacitor.config.json` | `appId: "com.alchm.sanctuary"` | Reconciled generated/native identifier |
| `ios/App 2/` | Multiple copied application and Pods trees | Non-canonical; excluded from release scope |

## Required Decision and Evidence

- Attach RevenueCat dashboard proof for bundle `com.alchm.sanctuary`.
- Attach RevenueCat entitlement/product/offering proof for
  `ALCHM - Transformation`, `alchm_transformation_monthly`, `$rc_monthly`, and
  `default`.
- Attach sandbox/TestFlight purchase or restore evidence for the archived build.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until RevenueCat runtime
entitlement evidence exists, native release certification remains blocked.
