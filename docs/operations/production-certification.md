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

## External Checks Matrix

| Gate | Required Evidence | Current Status | Blocking? |
|---|---|---|---|
| Clean git tree | `git status --short` returns empty before release manifest verification | Required for release; local generated dirt must be removed or ignored | Yes if dirty |
| Local release certification | `npm run certify:release` passes on the release commit | Passed locally for `fc8afd64f52532548d1076306a9910bca35b488a` | No |
| npm production audit | `npm audit --omit=dev --audit-level=moderate` returns zero vulnerabilities | Passed locally | No |
| Native/web bundle verification | `npm run verify:native-bundle` passes after `npm run build:ios-release` | Passed locally | No |
| Release manifest verification | `npm run release:manifest` then `npm run verify:release-manifest` pass on a clean tree | Passed locally | No |
| Xcode local build | `xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO clean build` passes | Passed locally | No |
| Xcode Cloud external archive | Green archive for the release commit using `ios/App/App.xcworkspace`, scheme `App` | Unproven for `fc8afd64f52532548d1076306a9910bca35b488a` | Yes |
| Vercel production deploy | Green Vercel production deployment for the release commit | Unproven for `fc8afd64f52532548d1076306a9910bca35b488a` | Yes |
| Firebase App Hosting `studio` | Backend disabled/removed, or green and explicitly re-certified | Documented non-authoritative; external disable/removal/re-certification unproven | Yes |
| Branch protection | `npm run verify:branch-protection` passes with required status checks | Fails when GitHub reports branch not protected | Yes |
| Sentry source-map upload | Sentry release exists for the release commit and source maps match deployed artifact | Configured, not externally proven | Yes unless exception approved |
| Rollback procedure | Vercel, Firebase Hosting, and iOS rollback steps documented | Documented in this file and deployment topology doc | No |
| Deployment topology verification | `npm run verify:deployment-topology` passes | Passed locally | No |

## Required Operator Actions

1. Push the certified commit to the protected release branch or merge it through a PR.
2. Enable `main` branch protection and require these checks, using exact context names from GitHub:
   - `Validate`
   - `Navigation E2E`
   - `CodeQL`
   - `Operational Certification`
   - Xcode Cloud/native archive check
   - Vercel production deployment check
3. Correct Xcode Cloud if needed:
   - Workspace: `ios/App/App.xcworkspace`
   - Scheme: `App`
   - Action: Archive
   - Prebuild: lockfile install, `npm run build:ios-release`, native bundle verification, pod install where applicable
4. Disable/remove Firebase App Hosting `studio`, or re-certify it and update `docs/operations/deployment-topology.md`.
5. Prove Vercel production deploy green for the certified commit.
6. Prove Sentry release/source-map upload for the deployed artifact, or approve a formal observability exception.
