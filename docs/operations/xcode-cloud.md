# Xcode Cloud Release Configuration

ALCHM's authoritative Capacitor iOS workspace is:

- Workspace: `ios/App/App.xcworkspace`
- Scheme: `App`
- Build action: Archive
- Repository working directory: repository root

The stale path `ios/ALCHM/ALCHM.xcworkspace` is not valid for this repository.

## Required Xcode Cloud Setup

Configure the Xcode Cloud workflow in App Store Connect or Xcode with:

1. Workspace: `ios/App/App.xcworkspace`
2. Scheme: `App`
3. Archive action for iOS
4. Post-clone script support enabled for `ci_scripts/ci_post_clone.sh`
5. Pre-xcodebuild script support enabled for `ci_scripts/ci_pre_xcodebuild.sh`

The repository scripts run:

```bash
npm ci
npm run build
npx cap sync ios
cd ios/App
pod install
npm run verify:native-bundle
```

## Release Authority Requirement

Xcode Cloud is release-authoritative only when the current commit has a green archive check for the `App` scheme using `ios/App/App.xcworkspace`.

If Xcode Cloud is intentionally replaced by another native archive system, the replacement must provide equivalent evidence:

- exact git commit
- dependency install from lockfile
- `npm run build`
- `npx cap sync ios`
- native bundle verification
- successful unsigned or signed iOS archive
- retained logs/artifacts
