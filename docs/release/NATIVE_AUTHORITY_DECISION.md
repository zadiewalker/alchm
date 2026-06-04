# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, REVENUECAT EVIDENCE REQUIRED`

The native archive produced for pushed evidence-tail
`fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a` confirmed the archive bundle
identifier was `com.alchm.sanctuary`. The attested product candidate remains
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
- Preserve the current archive evidence in
  `docs/release/NATIVE_RELEASE_EVIDENCE.md`.
- Attach RevenueCat entitlement/product/offering proof for
  `ALCHM - Transformation`, `alchm_transformation_monthly`, `$rc_monthly`, and
  `default`.
- Attach sandbox/TestFlight purchase or restore evidence for the archived build.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until RevenueCat runtime
entitlement evidence exists, native release certification remains blocked.
