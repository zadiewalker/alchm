# ALCHM Production Certification

Current status: release-candidate eligible after local certification; not production certified until external gates are green.

## Certification Boundary

Locally certified is not the same as production certified.

Repository-side hardened is not the same as external release authority green.

App Hosting de-scoped in docs is not the same as disabled externally.

## Local Certification Commands

Run from the repository root:

```bash
npm ci
npm audit --omit=dev --audit-level=moderate
npm run lint
npm run typecheck
npm run verify:manifest-assets
npm run verify:deployment-topology
npm run test:offline-replay
npm run build:ios-release
npm run verify:native-bundle
npm run release:manifest
npm run verify:release-manifest
npm run certify:release
```

`npm run verify:release-manifest` must run from a clean release tree. Use `ALLOW_DIRTY_RELEASE_MANIFEST=true` only for local remediation validation before committing source changes.

## Required External Checks

Production certification requires:

- GitHub `main` branch protection enabled and passing `npm run verify:branch-protection`.
- Validate green.
- Navigation E2E green.
- CodeQL green.
- Operational Certification green.
- Vercel production deployment green for the release commit.
- Xcode Cloud Archive - iOS green, or an approved native archive equivalent.
- Firebase App Hosting `studio` disabled, removed, or explicitly re-certified.

## Production Release Gate

Do not release publicly unless:

1. The local certification commands pass from a clean tree.
2. The generated release manifest is archived with the release.
3. Branch protection is enabled.
4. The authoritative deployment target is green.
5. Xcode Cloud uses `ios/App/App.xcworkspace` and scheme `App`.
6. Security audit passes or a risk acceptance entry is externally approved.
7. Sentry release binding and source-map upload are proven for the production build.

## Evidence Artifacts

- `release-artifacts/release-manifest.json`
- Operational Certification GitHub Actions artifact: `release-manifest`
- Operational Certification GitHub Actions artifact: `static-export-out`
- Native bundle verification output
- Xcode Cloud archive logs
- Vercel deployment status for the release commit

## Rollback Procedure

Vercel:

1. Identify the last known good deployment for the release commit.
2. Promote or roll back to that deployment in Vercel.
3. Confirm route smoke checks and GitHub deployment status.

Firebase Hosting `alchmapp`:

1. Use Firebase Hosting release history for site `alchmapp`.
2. Roll back to the prior static-export release.
3. Confirm redirect behavior to the authoritative web target.

iOS:

1. Check out the prior release commit.
2. Run `npm ci` and `npm run build:ios-release`.
3. Generate a release manifest.
4. Archive using `ios/App/App.xcworkspace`, scheme `App`.

## Known Blockers

- Branch protection must be enabled externally if `npm run verify:branch-protection` fails.
- Xcode Cloud must be corrected externally if it still references `ios/ALCHM/ALCHM.xcworkspace`.
- Firebase App Hosting `studio` must be disabled, removed, or re-certified externally.
- Sentry source-map upload requires production credentials and CI evidence.

## Current Authority Notes

Authoritative production web target: Vercel.

Firebase Hosting `alchmapp` is a static compatibility/redirect target that deploys `out/`.

Firebase App Hosting `studio` is non-authoritative until explicitly re-certified.

Xcode Cloud authority requires workspace `ios/App/App.xcworkspace` and scheme `App`.
