# Native Release Evidence

## Status

`RETURN FLOW CANDIDATE ARCHIVE RECORDED - TESTFLIGHT ENTITLEMENT PROOF REQUIRED`

Native remains in scope. This record preserves historical archive evidence for
prior candidates and records a local archive for product candidate
`f9c925d707263479953d271eadef69339a5a41bb` after the return-flow reliability
fix. `iosArchiveSameSha` remains false
until external RevenueCat dashboard proof and sandbox/TestFlight purchase or
restore evidence are attached for the archived build.

## Source Binding

| Field | Evidence |
| --- | --- |
| Historical archived candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| New authoritative candidate SHA | `f9c925d707263479953d271eadef69339a5a41bb` |
| Historical archive evidence-tail SHA | `fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a` |
| Current archive candidate SHA | `f9c925d707263479953d271eadef69339a5a41bb` |
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
| Capacitor sync | Passed; copied `out` to `ios/App/App/public`, created `ios/App/App/capacitor.config.json`, updated iOS plugins, ran `pod install`, and reported `@revenuecat/purchases-capacitor@13.1.5` among 9 iOS plugins |
| Repository validation | Passed on current candidate `f9c925d707263479953d271eadef69339a5a41bb` with clean pre-evidence worktree |

## Archive Evidence

| Field | Evidence |
| --- | --- |
| Archive path | `/tmp/alchm-return-flow-candidate.xcarchive` |
| Archive result | `ARCHIVE SUCCEEDED` |
| Archive timestamp | 2026-06-08 local run |
| Archive scheme | `App` |
| Archive actor/signing identity | `Apple Development: zadiewalker@gmail.com (AH6CMKPLYH)` |
| Team ID | `8J47J9Y3A7` |
| Architectures | arm64 |
| Archived bundle ID | `com.alchm.sanctuary` |
| Expected authority bundle ID | `com.alchm.sanctuary` |
| Bundle short version | `1.0` |
| Bundle version | `2` |
| App binary SHA-256 | Not recorded in this pass; archive identity was verified by bundle ID, version/build, frameworks, forbidden-file absence, and dSYM presence |
| dSYM presence | `/tmp/alchm-return-flow-candidate.xcarchive/dSYMs/App.app.dSYM` |
| Code signing identifier | `com.alchm.sanctuary` |

## RevenueCat Evidence

Source constants currently identify:

| Field | Source value |
| --- | --- |
| Entitlement constant | `ALCHM - Transformation` |
| Product constant | `alchm_transformation_monthly` |
| Monthly package constant | `$rc_monthly` |
| Default offering constant | `default` |
| Apple public API key | Present in `src/config/revenueCat.ts` |

Native archive evidence currently identifies:

| Field | Evidence |
| --- | --- |
| Capacitor Purchases plugin | `@revenuecat/purchases-capacitor@13.1.5` |
| RevenueCat plugin framework | `/tmp/alchm-return-flow-candidate.xcarchive/Products/Applications/App.app/Frameworks/RevenuecatPurchasesCapacitor.framework` |
| Purchases hybrid framework | `/tmp/alchm-return-flow-candidate.xcarchive/Products/Applications/App.app/Frameworks/PurchasesHybridCommon.framework` |
| RevenueCat framework | `/tmp/alchm-return-flow-candidate.xcarchive/Products/Applications/App.app/Frameworks/RevenueCat.framework` |
| `debug.html` in archive | Absent |
| `test.html` in archive | Absent |

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
`f9c925d707263479953d271eadef69339a5a41bb` because:

1. A same-SHA local archive has been recorded, but TestFlight/App Store Connect
   distribution proof for this exact archive is absent.
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
