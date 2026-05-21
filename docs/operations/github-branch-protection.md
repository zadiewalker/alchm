# GitHub Branch Protection

Production certification requires branch protection on `main`.

Required settings:

- Require pull request before merge.
- Require status checks before merge.
- Require branches to be up to date before merge if queueing is not enabled.
- Block force pushes.
- Block branch deletion.
- Include administrators if project policy allows.
- Require linear history if the release process uses squash or rebase merges.

Required checks:

- `Validate`
- `Navigation E2E`
- `CodeQL`
- `Operational Certification`
- Xcode Cloud archive check, or approved equivalent native archive check
- Authoritative deployment check: Vercel production deployment

Read-only verification:

```bash
npm run verify:branch-protection
```

This script is read-only. It uses the GitHub CLI and fails when `main` is not protected or when required gates are missing.

The script currently verifies:

- protection exists for `main`
- pull request review or equivalent protected linear-history policy exists
- strict required status checks are enabled
- `Validate`, `Navigation E2E`, `CodeQL`, and `Operational Certification` are present
- force pushes are disabled
- branch deletion is disabled

External checks that cannot be normalized through the GitHub protection API, such as Xcode Cloud and Vercel deployment status names, must still be confirmed in the GitHub branch protection UI before production certification.
