#!/usr/bin/env bash
set -euo pipefail

FLAG="${CLAUDE_PROJECT_DIR:-$PWD}/.claude/sanity.ok"

# If Claude already verified and wrote PASS, allow stop and reset the flag.
if [ -f "$FLAG" ]; then
  rm -f "$FLAG"
  exit 0
fi

# Otherwise, block stop and tell Claude exactly what to do.
cat >&2 <<'MSG'
Rule: Never claim “Finished” until you PROVE it works and CI is green after push.

Before finishing:
1) Summarize what changed + expected behavior (1–2 lines).
2) Sanity checks (run what applies): Build ok · Runtime ok (health 200 / CLI exit 0) · Lint ok · Tests ok.
3) Push and wait for GitHub Actions on this branch to complete successfully:
   BR=$(git rev-parse --abbrev-ref HEAD)
   RUN=$(gh run list --branch "$BR" --limit 1 --json databaseId -q '.[0].databaseId')
   gh run watch "$RUN" --exit-status

Output at the end:
Sanity PASS:
- build: ok
- runtime: ok
- lint: ok
- tests: ok (N passed)
- CI: ok (run $RUN)

Then write `.claude/sanity.ok` with `PASS` and only then say “Finished”.
MSG
# Exit code 2 on Stop/SubagentStop blocks the stop and feeds the message to Claude.
exit 2
