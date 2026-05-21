#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-zadiewalker/alchm}"
BRANCH="${1:-main}"

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
- require status checks: Validate, Navigation E2E, CodeQL, Operational Certification
- include Xcode Cloud or approved native archive equivalent
- include authoritative deploy target status
- block force pushes and branch deletion
EOF
  exit 1
fi

failures=0

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

  if ! gh api "repos/${REPO}/branches/${BRANCH}/protection" \
    --jq '.required_status_checks.contexts[]?, .required_status_checks.checks[]?.context' \
    | grep -Fxq "${expected}"; then
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

require_check "Validate"
require_check "Navigation E2E"
require_check "CodeQL"
require_check "Operational Certification"

if [ "${failures}" -gt 0 ]; then
  cat >&2 <<EOF

Required production settings:
- protect ${BRANCH}
- require pull requests before merge
- require strict status checks: Validate, Navigation E2E, CodeQL, Operational Certification
- include Xcode Cloud or approved native archive equivalent
- include authoritative deploy target status
- block force pushes and branch deletion
EOF
  exit 1
fi

echo "Branch protection is enabled and required release gates are present for ${REPO}:${BRANCH}."
