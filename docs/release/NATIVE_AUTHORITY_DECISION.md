# Native Authority Decision

## Status

`DECIDED - SOURCE IDENTITY RECONCILED, ARCHIVE EVIDENCE PENDING`

No native archive or synchronization result is approved by this record.

Native scope decision: `NATIVE_IN_SCOPE`

## Observed Identity State

| Source | Observed value | Authority state |
| --- | --- | --- |
| `capacitor.config.ts` | `appId: 'com.alchm.sanctuary'` | Canonical source identifier |
| `ios/App/App/capacitor.config.json` | `appId: "com.alchm.sanctuary"` | Reconciled generated/native identifier |
| `ios/App 2/` | Multiple copied application and Pods trees | Non-canonical; blocks release scope until dispositioned |

## Required Decision and Evidence

- Capture the exact sync command, clean candidate SHA, generated native diff,
  and iOS archive/build identity tied to that SHA.
- Explicitly disposition copied native trees without silently deleting
  unreviewed material.

The intended bundle/application identifier is `com.alchm.sanctuary`, and
`ios/App/` is the native source tree for release work. Until same-SHA native
sync and archive evidence exists, native release certification is blocked.
