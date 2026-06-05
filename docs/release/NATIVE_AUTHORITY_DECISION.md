# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, REVENUECAT EVIDENCE REQUIRED`

The native archive produced for current product candidate
`cf92af3579e9736665f2876a3a44c31032805a42` confirmed the archive bundle
identifier was `com.alchm.sanctuary`, with version/build `1.0 / 2`.

Native scope decision: `NATIVE_IN_SCOPE`

## Observed Identity State

| Source | Observed value | Authority state |
| --- | --- | --- |
| `capacitor.config.ts` | `appId: 'com.alchm.sanctuary'` | Canonical source identifier |
| `ios/App/App/capacitor.config.json` | `appId: "com.alchm.sanctuary"` | Reconciled generated/native identifier |
| `ios/App 2/` | Multiple copied application and Pods trees | Non-canonical; excluded from release scope |

## Required Decision and Evidence

- Attach RevenueCat dashboard proof for bundle `com.alchm.sanctuary`.
- Preserve the current archive evidence in
  `docs/release/NATIVE_RELEASE_EVIDENCE.md`.
- Attach RevenueCat entitlement/product/offering proof for
  `ALCHM - Transformation`, `alchm_transformation_monthly`, `$rc_monthly`, and
  `default`.
- Attach sandbox/TestFlight purchase or restore evidence for the archived build.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until RevenueCat runtime
entitlement evidence exists, native release certification remains blocked.
