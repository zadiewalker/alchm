# Native Release Evidence

## Status

`CANDIDATE ARCHIVE PRODUCED - BUNDLE ID ALIGNED, RELEASE BLOCKED BY REVENUECAT EVIDENCE`

Native remains in scope. This record captures a local native build/archive run
from the attested candidate SHA
`16e3a5d19ceee278957a413fb01b69178dca97cf`. It does not approve native
release and does not close `iosArchiveSameSha` because external RevenueCat
dashboard and sandbox/TestFlight entitlement evidence is still absent.

## Source Binding

| Field | Evidence |
| --- | --- |
| Attested candidate SHA | `16e3a5d19ceee278957a413fb01b69178dca97cf` |
| Native archive worktree | Detached worktree at `/tmp/alchm-ios-candidate-16e3` |
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
npm run build
npx cap sync ios
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -archivePath /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive archive
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:CFBundleIdentifier' /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive/Info.plist
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:SigningIdentity' /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive/Info.plist
/usr/libexec/PlistBuddy -c 'Print :ApplicationProperties:Team' /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive/Info.plist
shasum -a 256 /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive/Products/Applications/App.app/App
find /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive -type f -print0 | sort -z | xargs -0 shasum -a 256 | shasum -a 256
/usr/bin/codesign -dv --verbose=4 /tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive/Products/Applications/App.app
```

## Build and Sync Evidence

| Step | Result |
| --- | --- |
| Next build | Passed; static export generated 36 app routes |
| Capacitor sync | Passed; copied `out` to `ios/App/App/public`, created `ios/App/App/capacitor.config.json`, updated iOS plugins, and ran `pod install` |

## Archive Evidence

| Field | Evidence |
| --- | --- |
| Archive path | `/tmp/alchm-16e3a5d19ceee278957a413fb01b69178dca97cf.xcarchive` |
| Archive result | `** ARCHIVE SUCCEEDED **` |
| Archive timestamp | `2026-06-03T04:16:31Z` |
| Archive scheme | `App` |
| Archive actor/signing identity | `Apple Development: zadiewalker@gmail.com (AH6CMKPLYH)` |
| Team ID | `8J47J9Y3A7` |
| Architectures | `arm64` |
| Archived bundle ID | `com.alchm.sanctuary` |
| Expected authority bundle ID | `com.alchm.sanctuary` |
| Bundle short version | `1.0` |
| Bundle version | `2` |
| App binary SHA-256 | `37668584456f4449a53dc0b9999fb0ec634f95da23972f43fd80c4c9fdb28398` |
| Archive file-manifest SHA-256 | `74f474c2cf284801f8eb4f7032008302aabf43fba02a390bae4e33f295377a9d` |
| Code signing identifier | `com.alchm.sanctuary` |
| Code signing CDHash | `2c77600ccbe3701691462b6bf1311839646a4111` |

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
