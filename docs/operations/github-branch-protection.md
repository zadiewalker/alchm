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
- `ALCHM | Default | Archive - iOS`, or the exact Xcode Cloud/native archive context configured for this repository
- `Vercel`, or the exact authoritative Vercel production deployment context configured for this repository

Read-only verification:

```bash
npm run verify:branch-protection
```

This script is read-only. It uses the GitHub CLI and fails when `main` is not protected or when required gates are missing.

The script currently verifies:

- protection exists for `main`
- pull request review or equivalent protected linear-history policy exists
- strict required status checks are enabled
- required status contexts are present
- force pushes are disabled
- branch deletion is disabled

By default the script requires:

```text
Validate,Navigation E2E,CodeQL,Operational Certification,ALCHM | Default | Archive - iOS,Vercel
```

If GitHub uses different exact status names, pass them explicitly:

```bash
REQUIRED_BRANCH_CHECKS="Validate,Navigation E2E,CodeQL,Operational Certification,<xcode context>,<vercel context>" npm run verify:branch-protection
```

External checks must still be green for the certified commit before production certification.
