# Native Release Evidence

## Status

`ARCHIVE PRODUCED - BUNDLE ID ALIGNED, RELEASE BLOCKED BY REVENUECAT EVIDENCE`

Native remains in scope. This record captures the local native build/archive
attempt for the current release branch. It does not approve native release and
does not close `iosArchiveSameSha`.

## Source Binding

| Field | Evidence |
| --- | --- |
| Inspected HEAD | `88f7427639740972dc5958417dcc267e35e0ba99` |
| Worktree before native run | Clean according to `git status --short --branch` |
| Canonical Capacitor source ID | `capacitor.config.ts` declares `appId: 'com.alchm.sanctuary'` |
| Generated Capacitor config ID after sync | `ios/App/App/capacitor.config.json` declares `appId: "com.alchm.sanctuary"` |
| Native Xcode target ID | `ios/App/App.xcodeproj/project.pbxproj` declares `PRODUCT_BUNDLE_IDENTIFIER = com.alchm.sanctuary` for Debug and Release |

## Bundle ID Decision

`com.alchm.sanctuary` is the authoritative native bundle identifier.

`com.alchm.app` was stale Xcode project drift. The app `Info.plist` uses
`$(PRODUCT_BUNDLE_IDENTIFIER)`, so the archive inherited the stale Xcode target
setting even though Capacitor and release authority already named
`com.alchm.sanctuary`.

## Commands Run

```bash
npm run build
npx cap sync ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-88f7427639740972dc5958417dcc267e35e0ba99.xcarchive archive
npx cap sync ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-native-bundle-check.xcarchive archive
/usr/libexec/PlistBuddy -c "Print :ApplicationProperties:CFBundleIdentifier" /tmp/alchm-native-bundle-check.xcarchive/Info.plist
```

## Build and Sync Evidence

| Step | Result |
| --- | --- |
| Next build | Passed; static export generated 36 app routes |
| Capacitor sync | Passed; copied `out` to `ios/App/App/public`, created `ios/App/App/capacitor.config.json`, updated iOS plugins, and ran `pod install` |

## Archive Evidence

| Field | Evidence |
| --- | --- |
| Archive path | `/tmp/alchm-native-bundle-check.xcarchive` |
| Archive result | `** ARCHIVE SUCCEEDED **` |
| Archive timestamp | `2026-06-01T22:02:43Z` |
| Archive scheme | `App` |
| Archive actor/signing identity | `Apple Development: zadiewalker@gmail.com (AH6CMKPLYH)` |
| Team ID | `8J47J9Y3A7` |
| Architectures | `arm64` |
| Archived bundle ID | `com.alchm.sanctuary` |
| Expected authority bundle ID | `com.alchm.sanctuary` |
| Bundle short version | `1.0` |
| Bundle version | `2` |
| App binary SHA-256 | `f76fba2db0efb5899e74cb92d8c7f0813a053184931d6ec0d0a847f8af3f2aa2` |

## RevenueCat Evidence

Source constants currently identify:

| Field | Source value |
| --- | --- |
| Entitlement constant | `ALCHM - Transformation` |
| Product constant | `alchm_transformation_monthly` |
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

1. RevenueCat entitlement/product evidence for the archived build is absent.
2. Same-SHA linkage cannot be certified until RevenueCat dashboard/runtime
   evidence agrees with the archived bundle ID and candidate source.

## Exact Next Commands

Before setting `iosArchiveSameSha` to `true`, collect RevenueCat evidence for
the aligned archive:

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
