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
npm run verify:vercel-authority
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

Authoritative production web target: Vercel project `alchm`.

Firebase Hosting `alchmapp` is a static compatibility/redirect target that deploys `out/`.

Firebase App Hosting `studio` is non-authoritative until explicitly re-certified.

Xcode Cloud authority requires workspace `ios/App/App.xcworkspace` and scheme `App`.

## External Gate Matrix

| Gate | Evidence Required | Current Evidence | Status | Blocking |
|---|---|---|---|---|
| Clean git tree | `git status --short` returns empty before release manifest verification | Required for release; local generated dirt must be removed or ignored | Locally controllable | Yes if dirty |
| Commit pushed to origin | `git merge-base --is-ancestor HEAD origin/main` succeeds or release PR exists for `HEAD` | PR #27 contains the promotion branch and exposes the candidate SHA to external checks | Pushed PR provenance established | No for PR candidate |
| Local release certification | `npm run certify:release` passes on the release commit | Passed locally on the promotion branch after release-integrity remediation | Repository-certified | No |
| npm production audit | `npm audit --omit=dev --audit-level=moderate` returns zero vulnerabilities | Passed locally and in GitHub Operational Certification after the `qs` lockfile remediation | Repository-certified and externally checked | No |
| Release integrity | GitHub Operational Certification `release-integrity` passes with the pinned native toolchain | PR #27 established a green external run after pinning supported Intel runner, Ruby `3.4.8`, CocoaPods `1.16.2`, and npm `11.4.2`; recheck current PR head after every new commit | External check required per candidate | Yes if absent/failing |
| Native/web bundle verification | `npm run verify:native-bundle` passes after `npm run build:ios-release` | Passed locally during repository certification | Repository-certified | No |
| Release manifest verification | `npm run release:manifest` then `npm run verify:release-manifest` pass on a clean tree | Passed locally during repository certification | Repository-certified | No |
| Xcode local build | `xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Debug -sdk iphonesimulator CODE_SIGNING_ALLOWED=NO clean build` passes | Passed locally | Local-only evidence | No |
| Branch protection | `npm run verify:branch-protection` passes with required status checks | Fails when GitHub reports `main` is not protected | External blocker | Yes |
| Required GitHub checks | Validate, Navigation E2E, CodeQL, Operational Certification, Xcode/native archive, and Vercel/deploy checks green for the release commit | PR #27 exposes GitHub/Vercel preview checks; Xcode archive and production deploy checks are still absent/unproven | Partially proven; external blocker remains | Yes |
| Xcode Cloud archive | Green Archive - iOS for the release commit using `ios/App/App.xcworkspace`, scheme `App` | Local workspace/scheme verified; external archive unproven | External blocker | Yes |
| Vercel project authority | `npm run verify:vercel-authority` passes and Vercel evidence comes from project `alchm` | Repository verifier rejects the known non-authoritative `alchm-authoritative` local link; `.vercel` must remain ignored or explicitly match the production project id in CI | Repository guardrail | Yes if failing |
| Vercel production deploy | Green Vercel production deployment for the release commit on project `alchm` | `alchm` production alias is Ready, but its current production deployment was created on May 21, 2026; PR #27 Vercel results are Preview and do not attest a production deployment for the promotion candidate | External blocker | Yes |
| Firebase App Hosting `studio` | Backend disabled/removed, green and explicitly re-certified, or proven unable to affect production authority | External CLI query on May 23, 2026 confirms active backend `studio` in `us-central1`, last updated May 22, 2026; it remains documented non-authoritative but not externally disabled | External blocker | Yes |
| Sentry source-map proof | Sentry release exists for the release commit and source maps match deployed artifact | Source-map upload is configured when Sentry env vars exist; upload is not externally proven | External blocker unless exception approved | Yes |
| Rollback procedure | Vercel, Firebase Hosting, and iOS rollback steps documented | Documented in this file and deployment topology doc | Documented | No |
| Deployment topology verification | `npm run verify:deployment-topology` passes | Passed locally during repository certification | Repository-certified | No |

## Required Operator Actions

1. Enable `main` branch protection and require these checks, using exact context names from GitHub:
   - `Validate`
   - `Navigation E2E`
   - `CodeQL`
   - `Operational Certification`
   - Xcode Cloud/native archive check
   - Vercel production deployment check
2. Correct Xcode Cloud if needed:
   - Workspace: `ios/App/App.xcworkspace`
   - Scheme: `App`
   - Action: Archive
   - Prebuild: lockfile install, `npm run build:ios-release`, native bundle verification, pod install where applicable
3. Disable/remove Firebase App Hosting `studio`, or re-certify it and update `docs/operations/deployment-topology.md`.
4. Prove Vercel production deploy green for the certified commit on project `alchm`; PR preview success is not production deploy evidence.
5. Prove Sentry release/source-map upload for the deployed artifact, or approve a formal observability exception.
