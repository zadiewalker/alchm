# Native Release Evidence

## Status

`CAPACITOR SYNC RECORDED - ARCHIVE AND REVENUECAT EVIDENCE REQUIRED`

Native remains in scope. This record preserves historical archive evidence for
prior candidates and records that Capacitor sync passed for product candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa`. `iosArchiveSameSha` remains false
until a same-SHA archive, external RevenueCat dashboard proof, and
sandbox/TestFlight entitlement evidence are attached for the current candidate's
archived build.

## Source Binding

| Field | Evidence |
| --- | --- |
| Historical archived candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| New authoritative candidate SHA | `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` |
| Historical archive evidence-tail SHA | `fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a` |
| Current archive candidate SHA | Not recorded for `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` |
| Native archive worktree | `/Users/zadiewalker/Desktop/alchm` |
| Worktree before native run | Clean according to `git status --short --branch` before evidence updates |
| Canonical Capacitor source ID | Candidate `capacitor.config.ts` declares `appId: 'com.alchm.sanctuary'` |
| Generated Capacitor config ID after sync | Candidate sync generated `ios/App/App/capacitor.config.json` with `appId: "com.alchm.sanctuary"` |
| Native Xcode target ID | Candidate `ios/App/App.xcodeproj/project.pbxproj` declares `PRODUCT_BUNDLE_IDENTIFIER = com.alchm.sanctuary` for Debug and Release |

## Bundle ID Decision

`com.alchm.sanctuary` is the authoritative native bundle identifier.

`com.alchm.app` was stale Xcode project drift. The app `Info.plist` uses
`$(PRODUCT_BUNDLE_IDENTIFIER)`, so the archive inherited the stale Xcode target
setting even though Capacitor and release authority already named
`com.alchm.sanctuary`.

## Commands Run

```bash
git status --short --branch
git rev-parse HEAD
npm run design:validate
npm run typecheck
npm run lint
npm test
npm run build
npm --prefix functions run build
npm --prefix functions run lint
npx cap sync ios
node --test src/__tests__/architectureInvariants.test.mjs
node --test src/__tests__/kheperaAdaptivePipeline.test.mjs
npm run check:firestore-rules
npm run check:integrity
npm run check:khepera-gateway
npm run check:container-transitions
npm run check:sensitive-write-authority
git diff --check
```

## Build and Sync Evidence

| Step | Result |
| --- | --- |
| Next build | Passed; static export generated 36 app routes |
| Capacitor sync | Passed; copied `out` to `ios/App/App/public`, created `ios/App/App/capacitor.config.json`, updated iOS plugins, and ran `pod install` |
| Repository validation | Passed on current candidate `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` with clean pre-evidence worktree |

## Archive Evidence

| Field | Evidence |
| --- | --- |
| Archive path | Not recorded for candidate `7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` |
| Archive result | Not recorded for current candidate |
| Archive timestamp | Not recorded for current candidate |
| Archive scheme | Not recorded for current candidate |
| Archive actor/signing identity | Not recorded for current candidate |
| Team ID | Not recorded for current candidate |
| Architectures | Not recorded for current candidate |
| Archived bundle ID | Not recorded for current candidate |
| Expected authority bundle ID | `com.alchm.sanctuary` |
| Bundle short version | Not recorded for current candidate |
| Bundle version | Not recorded for current candidate |
| App binary SHA-256 | Not recorded for current candidate |
| dSYM presence | Not recorded for current candidate |
| Code signing identifier | Not recorded for current candidate |

## RevenueCat Evidence

Source constants currently identify:

| Field | Source value |
| --- | --- |
| Entitlement constant | `ALCHM - Transformation` |
| Product constant | `alchm_transformation_monthly` |
| Monthly package constant | `$rc_monthly` |
| Default offering constant | `default` |
| Apple public API key | Present in `src/config/revenueCat.ts` |

Release approval still requires external RevenueCat evidence:

- RevenueCat project/app identifier.
- Dashboard proof that the native app bundle ID matches the archived bundle.
- Dashboard proof of the transformation entitlement.
- Product proof for `alchm_transformation_monthly`.
- Sandbox/TestFlight purchase or restore result for this archived build.
- Evidence must hide private keys, private API keys, customer identifiers, and
  secret material.

## Certification Consequence

`iosArchiveSameSha` remains blocked for current candidate
`7aecc5afc7885f4c1ff43a0b5342cc9a7be361aa` because:

1. A same-SHA archive has not been recorded for this candidate.
2. RevenueCat dashboard evidence for bundle `com.alchm.sanctuary` is absent.
3. RevenueCat dashboard evidence for entitlement `ALCHM - Transformation`,
   product `alchm_transformation_monthly`, package `$rc_monthly`, and offering
   `default` is absent.
4. Sandbox/TestFlight purchase or restore evidence proving the archived build
   receives the expected entitlement is absent.

## Exact Next Commands

Before setting `iosArchiveSameSha` to `true`, collect RevenueCat evidence for
the current candidate-bound archive:

```bash
git status --short --branch
git rev-parse HEAD
npm run build
npx cap sync ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-$(git rev-parse --short HEAD).xcarchive archive
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:CFBundleIdentifier' /tmp/alchm-$(git rev-parse --short HEAD).xcarchive/Info.plist
shasum -a 256 /tmp/alchm-$(git rev-parse --short HEAD).xcarchive/Products/Applications/App.app/App
```

Attach RevenueCat dashboard and sandbox/TestFlight entitlement evidence for the
archived build before setting `iosArchiveSameSha` to `true`.
