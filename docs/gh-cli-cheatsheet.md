
# GitHub CLI (gh) – Comprehensive Cheat Sheet

> **Purpose:** Quick, copy‑paste friendly reference that shows how to do the most common and useful things with `gh`.  
> **Conventions:**  
> - Replace placeholders like `<RUN_ID>`, `<REPO>`, `<ORG>`, `<ENV>`, `<PR#>` with your values.  
> - Use `-R OWNER/REPO` to target another repo from anywhere.  
> - Add `--json ...`, `--jq ...`, or `--template ...` to format output.  
> - `gh help <command>` shows full docs. `gh <cmd> -h` for flags.

---

## 0) Project-Specific Workflow

**⚠️ REQUIRED: Issue → Branch → PR Workflow**

All changes to this project MUST follow this workflow (master branch is protected):

```bash
# 1. Create issue for your work
gh issue create --title "Add feature X" --body "Description..." --label enhancement

# 2. Create feature branch from master
git checkout master && git pull
git checkout -b feature/add-feature-x

# 3. Make changes, commit, and push
git add . && git commit -m "feat: add feature X"
git push -u origin feature/add-feature-x

# 4. Create PR linking to issue
gh pr create --title "Add feature X" --body "Implements feature X.

Closes #123" --label enhancement

# 5. Wait for CI checks and approval, then merge
gh pr merge --squash --delete-branch
```

**Branch Protection Rules Active:**
- ✅ Required CI checks: Lint, Type Check, Format, Build, Unit Tests, Integration Tests
- ✅ 1 required approval for PRs
- ✅ No direct pushes to master
- ✅ Stale reviews dismissed on new commits

## 0) Quick Setup & Global Tips

```bash
# Install (macOS)
brew install gh

# Authenticate
gh auth login
gh auth status
gh auth token              # print current token (masked)
gh auth refresh            # refresh token scopes
gh auth switch --hostname github.com  # switch account/host

# Work in a repository without cd:
export GH_REPO="owner/repo"   # or use -R owner/repo per command

# Output & filtering
gh <cmd> --json fields --jq '<jq expr>'
gh <cmd> --template '{{.field}}'

# Open the current repo in browser
gh browse
```

---

## 1) Repos (`gh repo`)

**Common**
```bash
gh repo view -R <REPO>
gh repo clone <REPO> [dir]
gh repo create <NAME> --public|--private --source=. --push
gh repo fork -R <REPO> --clone
gh repo list <OWNER> --limit 50
```

**Admin & metadata**
```bash
gh repo edit -R <REPO> --description "..." --homepage "https://..."
gh repo rename -R <REPO> <NEW_NAME>
gh repo archive -R <REPO>
gh repo unarchive -R <REPO>
```

**Branch Protection** (via `gh api`)
```bash
# View current branch protection
gh api repos/{owner}/{repo}/branches/{branch}/protection

# Set up comprehensive branch protection
echo '{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint Check", "Type Check", "Format Check", "Build & Package", "Unit Tests", "Integration Tests"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false
}' | gh api -X PUT repos/{owner}/{repo}/branches/{branch}/protection --input -

# Remove branch protection
gh api -X DELETE repos/{owner}/{repo}/branches/{branch}/protection
```

**Extras**
```bash
gh repo gitignore list
gh repo gitignore view <TEMPLATE>
gh repo license list
gh repo license view mit
gh repo set-default <REPO>
gh repo sync -R <FORK> --source <UPSTREAM> --force
```

---

## 2) Pull Requests (`gh pr`)

**Create, check out, and view**
```bash
gh pr create -t "Title" -b "Body" -B main -H my-branch --draft
gh pr checkout <PR#|URL>
gh pr view <PR#> --web           # open in browser
gh pr status                      # mine + assigned + requested
```

**Reviews & merge**
```bash
gh pr review <PR#> --approve|--request-changes -b "Looks good"
gh pr merge <PR#> --squash --delete-branch --auto
gh pr update-branch <PR#>        # update with base branch
```

**Info & maintenance**
```bash
gh pr list --search "label:bug state:open" --limit 30
gh pr checks <PR#>               # CI status
gh pr diff <PR#>
gh pr edit <PR#> --add-label "needs-tests"
gh pr lock <PR#>; gh pr unlock <PR#>
gh pr close <PR#>; gh pr reopen <PR#>
```

---

## 3) Issues (`gh issue`)

```bash
gh issue create -t "Bug: title" -b "steps..." -l bug -a @me
gh issue list --search "is:open label:bug" --limit 50
gh issue view <ISSUE#> --comments
gh issue comment <ISSUE#> -b "On it."
gh issue edit <ISSUE#> --add-label triage --remove-label backlog
gh issue close <ISSUE#>; gh issue reopen <ISSUE#>
gh issue transfer <ISSUE#> <NEW_OWNER/REPO>
```

**Labels**
```bash
gh label list
gh label create "bug" --color FF0000 --description "Something is broken"
gh label edit "bug" --color CC0000
gh label delete "old-label"
```

---

## 4) Actions – Workflows & Runs

### Workflows (`gh workflow`)
```bash
gh workflow list
gh workflow view <NAME.yml|ID> --web
gh workflow run <NAME.yml> -f key=value -f another=123
gh workflow disable <NAME.yml>; gh workflow enable <NAME.yml>
```

### Runs (`gh run`)
```bash
gh run list --limit 20
gh run view <RUN_ID> --log                  # show logs
gh run download <RUN_ID>                    # artifacts
gh run cancel <RUN_ID>
gh run delete <RUN_ID>
```

**Re-run scenarios**
```bash
# Re-run all failed jobs from a run
gh run rerun <RUN_ID> --failed

# Re-run a specific job from a run:
jid=$(gh run view <RUN_ID> --json jobs --jq '.jobs[] | select(.name=="<JOB_NAME>") | .databaseId')
gh run rerun <RUN_ID> --job "$jid"          # reruns job + dependents

# Re-run with debug logging (runner + step debugging)
gh run rerun <RUN_ID> --failed --debug

# Watch run progress
gh run watch <RUN_ID>
```

**Cache (Actions)** (`gh cache`)
```bash
gh cache list -R <REPO>
gh cache delete <CACHE_ID> -R <REPO>
```

---

## 5) Releases (`gh release`)

```bash
gh release list
gh release create v1.2.3 --notes-file CHANGELOG.md --title "v1.2.3"
gh release upload v1.2.3 dist/*.tgz
gh release download v1.2.3 -p "dist/*.tgz" -D ./downloads
gh release edit v1.2.3 --draft=false
gh release delete v1.2.3
gh release view v1.2.3 --web
```

---

## 6) Secrets & Variables

**Secrets (`gh secret`)**
```bash
# Repo-level
gh secret set MY_TOKEN --body "$TOKEN"
gh secret list

# Org-level
gh secret set MY_SECRET --org <ORG> --repos <REPO1>,<REPO2>
gh secret list --org <ORG>

# Environment-level
gh secret set DEPLOY_KEY --env <ENV> --body @key.pem
```

**Variables (`gh variable`)**
```bash
gh variable set NODE_ENV --body production
gh variable list
# Org & environment scopes
gh variable set MY_VAR --org <ORG> --repos <REPO1>,<REPO2>
gh variable set API_URL --env <ENV> --body https://example.com
```

---

## 7) Search (`gh search`)

```bash
gh search repos "topic:cli language:go"
gh search issues "repo:<REPO> is:open label:bug"
gh search prs "org:<ORG> author:@me is:merged"
gh search commits "repo:<REPO> fix(sso)"
gh search code "org:<ORG> path:/infra/ terraform"
```

---

## 8) Gists (`gh gist`)

```bash
gh gist create file.txt --public -d "Helpful snippet"
gh gist list
gh gist view <ID> --web
gh gist edit <ID> -a another.txt
gh gist delete <ID>
```

---

## 9) Codespaces (`gh codespace`)

```bash
gh codespace list
gh codespace create -r <REPO> -b main -m standardLinux
gh codespace ssh -c <CODESPACE_NAME>
gh codespace ports list -c <CODESPACE_NAME>
gh codespace stop -c <CODESPACE_NAME>
gh codespace logs -c <CODESPACE_NAME>
```

---

## 10) Projects (`gh project` – Project v2)

```bash
gh project list --owner <ORG|USER>
gh project view <NUMBER> --owner <ORG> --web
gh project item-add --owner <ORG> --number <N> --url https://github.com/<REPO>/issues/<ISSUE#>
gh project field-list --owner <ORG> --number <N>
gh project item-edit --owner <ORG> --number <N> --id <ITEM_ID> --field "Status" --value "In Progress"
gh project close --owner <ORG> --number <N>
```

---

## 11) Orgs, Rulesets, Keys

**Orgs & teams (selection)**
```bash
gh org list
# (Use gh api for advanced org/team ops where no first-class cmd exists.)
```

**Rulesets (`gh ruleset`)**
```bash
gh ruleset list -R <REPO>
gh ruleset view <ID> -R <REPO>
gh ruleset check -R <REPO> --ref main
```

**SSH/GPG keys**
```bash
gh ssh-key list
gh ssh-key add ~/.ssh/id_ed25519.pub -t "Laptop"
gh ssh-key delete <KEY_ID>

gh gpg-key list
gh gpg-key add <PUBLIC_KEY_FILE>
gh gpg-key delete <KEY_ID>
```

---

## 12) Browsing & Status

```bash
gh browse                     # open repo in browser
gh browse <PATH>              # open a file or dir
gh status                     # overview of issues/PRs assigned, etc.
```

---

## 13) Aliases & Extensions

**Aliases (`gh alias`)**
```bash
gh alias list
gh alias set bugs 'issue list --label="bug" --state=open'
gh alias delete bugs
```

**Extensions (`gh extension`)**
```bash
gh extension search <keyword>
gh extension install owner/gh-some-ext
gh extension list
gh extension upgrade --all
gh extension exec <ext> -- <args>
gh extension remove owner/gh-some-ext
```

---

## 14) Config & Completion

```bash
gh config list
gh config get editor
gh config set editor "code --wait"
gh completion -s bash|zsh|fish|powershell > /usr/local/etc/bash_completion.d/gh
```

---

## 15) Power‑User: `gh api` (REST/GraphQL)

```bash
# REST
gh api repos/{owner}/{repo}/issues --jq '.[].title'

# GraphQL (POST)
gh api graphql -f query='
  query($name:String!, $owner:String!){
    repository(name:$name, owner:$owner){ issues(last:5){ nodes{ title } } }
  }' -F name='{repo}' -F owner='{owner}'

# Paginate + slurp
gh api graphql --paginate --slurp -f query='
  query($endCursor:String){ viewer { repositories(first:100, after:$endCursor){ nodes{ name } pageInfo{ hasNextPage endCursor } } } }'
```

---

## 16) Notes for CI Sanity (useful for Agents)

1) **Verify Actions aren’t failing**
```bash
gh run list -R <REPO> --json status,conclusion,headBranch,displayTitle --limit 20 --jq \
  '.[] | select(.status=="completed") | {title: .displayTitle, branch: .headBranch, conclusion}'
```

2) **Re-run only the failed job in a run**
```bash
jid=$(gh run view <RUN_ID> --json jobs --jq '.jobs[] | select(.conclusion=="failure") | .databaseId')
gh run rerun <RUN_ID> --job "$jid"
```

3) **Check lint/tests/build on a PR**
```bash
gh pr checks <PR#> --watch
```

4) **Ensure GitHub Pages/Release assets exist**
```bash
gh release view <TAG> --json assets --jq '.assets[].name'
```

---

## 17) Troubleshooting
- Use `GH_DEBUG=api gh ...` or add `--verbose` on `gh api` to inspect HTTP traffic.  
- If a feature is missing, it might exist via `gh api` or an extension.  
- For Actions reruns: job **databaseId** is required for `--job` re-runs, not the numeric tail in the URL.  

---

### End
