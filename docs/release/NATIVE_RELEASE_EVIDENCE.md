# Native Release Evidence

## Status

`CURRENT LOCAL ARCHIVE RECORDED - REVENUECAT EVIDENCE REQUIRED`

Native remains in scope. This record preserves historical archive evidence for
previous candidate `16e3a5d19ceee278957a413fb01b69178dca97cf` and records the
current local archive produced from pushed evidence-tail
`fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a`, whose attested product candidate is
`3a7c6d93140527de77c2fcc91ea3a9f73013b9da`. `iosArchiveSameSha` remains false
until external RevenueCat dashboard plus sandbox/TestFlight entitlement evidence
is attached for the archived build.

## Source Binding

| Field | Evidence |
| --- | --- |
| Historical archived candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| New authoritative candidate SHA | `3a7c6d93140527de77c2fcc91ea3a9f73013b9da` |
| Current archive evidence-tail SHA | `fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a` |
| Native archive worktree | `/Users/zadiewalker/Desktop/alchm` |
| Worktree before native run | Clean according to `git status --short --branch` |
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
npm run check:invariants
npm run check:firestore-rules
npm run check:integrity
npm run check:khepera-gateway
npm run check:container-transitions
npm run check:sensitive-write-authority
git diff --check
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive archive
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:CFBundleIdentifier' /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive/Info.plist
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:SigningIdentity' /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive/Info.plist
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:Team' /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive/Info.plist
shasum -a 256 /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive/Products/Applications/App.app/App
find /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256
/usr/bin/codesign -dv --verbose=4 /tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive/Products/Applications/App.app
```

## Build and Sync Evidence

| Step | Result |
| --- | --- |
| Next build | Passed; static export generated 36 app routes |
| Capacitor sync | Passed; copied `out` to `ios/App/App/public`, created `ios/App/App/capacitor.config.json`, updated iOS plugins, and ran `pod install` |
| Repository validation | Passed on pushed evidence-tail `fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a` with clean worktree at `2026-06-04T16:05:25Z` |

## Archive Evidence

| Field | Evidence |
| --- | --- |
| Archive path | `/tmp/alchm-fe0bf5ee342f1be5177b2a1a843c48c1c8306d3a.xcarchive` |
| Archive result | `** ARCHIVE SUCCEEDED **` |
| Archive timestamp | `2026-06-04T11:04:27Z` |
| Archive scheme | `App` |
| Archive actor/signing identity | `Apple Development: zadiewalker@gmail.com (AH6CMKPLYH)` |
| Team ID | `8J47J9Y3A7` |
| Architectures | `arm64` |
| Archived bundle ID | `com.alchm.sanctuary` |
| Expected authority bundle ID | `com.alchm.sanctuary` |
| Bundle short version | `1.0` |
| Bundle version | `2` |
| App binary SHA-256 | `bbca891d2b4fb503439ffe56f036bc497456b68cfd80c8ea7e4d44b35dbe3375` |
| Archive file-manifest SHA-256 | `6384ad49fedf80d253156dc2b97ed5869064d3e6a89afcb9665ac3f8234b5a91` |
| Code signing identifier | `com.alchm.sanctuary` |
| Code signing CDHash | `20972f2d179b67063bc14406323ebe7b871e4a36` |

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

`iosArchiveSameSha` remains blocked because:

1. RevenueCat dashboard evidence for bundle `com.alchm.sanctuary` is absent.
2. RevenueCat dashboard evidence for entitlement `ALCHM - Transformation`,
   product `alchm_transformation_monthly`, package `$rc_monthly`, and offering
   `default` is absent.
3. Sandbox/TestFlight purchase or restore evidence proving the archived build
   receives the expected entitlement is absent.

## Exact Next Commands

Before setting `iosArchiveSameSha` to `true`, collect RevenueCat evidence for
the candidate-bound archive:

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
