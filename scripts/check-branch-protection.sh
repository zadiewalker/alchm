#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-zadiewalker/alchm}"
BRANCH="${1:-main}"
# Require GitHub status context names, not workflow display labels.
REQUIRED_CHECKS="${REQUIRED_BRANCH_CHECKS:-validate,navigation-e2e,CodeQL,release-integrity,ALCHM | Default | Archive - iOS,Vercel}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required to verify branch protection." >&2
  exit 1
fi

PROTECTION_JSON="$(mktemp)"
trap 'rm -f "${PROTECTION_JSON}"' EXIT

if ! gh api "repos/${REPO}/branches/${BRANCH}/protection" >"${PROTECTION_JSON}"; then
  cat >&2 <<EOF
Branch protection is not enabled for ${REPO}:${BRANCH}.

Required production settings:
- require pull requests before merge
- require strict status checks: ${REQUIRED_CHECKS}
- block force pushes and branch deletion
EOF
  exit 1
fi

failures=0
STATUS_CONTEXTS="$(
  gh api "repos/${REPO}/branches/${BRANCH}/protection" \
    --jq '.required_status_checks.contexts[]?, .required_status_checks.checks[]?.context'
)"

require_json() {
  local jq_filter="$1"
  local message="$2"

  if ! gh api "repos/${REPO}/branches/${BRANCH}/protection" --jq "${jq_filter}" | grep -qx "true"; then
    echo "Branch protection verification failed: ${message}" >&2
    failures=$((failures + 1))
  fi
}

require_check() {
  local expected="$1"

  if ! grep -Fxq "${expected}" <<<"${STATUS_CONTEXTS}"; then
    echo "Branch protection verification failed: missing required status check '${expected}'." >&2
    failures=$((failures + 1))
  fi
}

require_json '.required_pull_request_reviews != null or .required_linear_history.enabled == true' \
  "main must require pull requests before merge or enforce an equivalent protected linear-history gate."
require_json '.required_status_checks != null and .required_status_checks.strict == true' \
  "main must require strict status checks."
require_json '(.allow_force_pushes.enabled // false) == false' \
  "force pushes must be disabled."
require_json '(.allow_deletions.enabled // false) == false' \
  "branch deletion must be disabled."

IFS=',' read -r -a required_checks <<<"${REQUIRED_CHECKS}"
for check in "${required_checks[@]}"; do
  trimmed="$(echo "${check}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')"
  if [ -n "${trimmed}" ]; then
    require_check "${trimmed}"
  fi
done

if [ "${failures}" -gt 0 ]; then
  cat >&2 <<EOF

Required production settings:
- protect ${BRANCH}
- require pull requests before merge
- require strict status checks: ${REQUIRED_CHECKS}
- block force pushes and branch deletion
EOF
  exit 1
fi

echo "Branch protection is enabled and required release gates are present for ${REPO}:${BRANCH}."
