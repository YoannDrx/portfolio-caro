#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

failed=0

report_files() {
  local label="$1"
  local matches="$2"
  if [[ -n "$matches" ]]; then
    echo "Security check failed: $label"
    echo "$matches" | sed -n '1,20p'
    local count
    count="$(echo "$matches" | wc -l | tr -d ' ')"
    if [[ "$count" -gt 20 ]]; then
      echo "... and $((count - 20)) more file(s)"
    fi
    failed=1
  fi
}

tracked_archives="$({
  git ls-files | rg '^(backups|exports|archives)/|\.(backup|dump|sql\.gz|tar\.zst|age)$' || true
} | while IFS= read -r path; do
  if [[ -e "$path" ]]; then
    printf '%s\n' "$path"
  fi
done)"
report_files "tracked backup or archive files" "$tracked_archives"

password_fallbacks="$(rg -l 'ADMIN_PASSWORD\s*(\?\?|\|\|)' prisma scripts lib app --glob '*.{ts,tsx,js,mjs}' || true)"
report_files "ADMIN_PASSWORD fallback detected" "$password_fallbacks"

literal_passwords="$(rg -l '(const|let|var)\s+[^=]*(password|secret|token)\s*=\s*["'"'][^"'"']+["'"']' prisma scripts lib app --glob '*.{ts,tsx,js,mjs}' || true)"
report_files "literal password, secret, or token detected" "$literal_passwords"

sensitive_logs="$(rg -l 'console\.(log|info|debug|warn)\([^\n]*(password|token|DATABASE_URL|DIRECT_URL)' prisma scripts lib app --glob '*.{ts,tsx,js,mjs}' || true)"
report_files "sensitive value may be logged" "$sensitive_logs"

if rg -q 'db:seed(:prod)?' scripts/vercel-build.js; then
  report_files "deployment build invokes a seed" "scripts/vercel-build.js"
fi

if [[ "$failed" -ne 0 ]]; then
  exit 1
fi

echo "Security checks passed."
