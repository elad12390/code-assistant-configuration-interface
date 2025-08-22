# GitHub Actions CI/CD Standards — v1.0 (2025-08-22)

> Applies to all repositories. Terms MUST/SHOULD/MAY use RFC‑2119 meanings. Save this file at the repo root as `GH-ACTIONS-STANDARDS.md`.

---

## 0) Principles

- Secure by default (least privilege, short‑lived credentials, immutable inputs).
- Reusable and DRY (centralized, versioned building blocks).
- Deterministic (pinned dependencies, locked toolchains, reproducible builds).
- Fast feedback (targeted triggers, concurrency cancellation, small surfaces on PRs).
- Observable (clear logs, annotations, standard artifact names).
- Compliant (supply‑chain provenance, auditable exceptions, policyable checks).

---

## 1) Repository conventions

- All workflows reside in `.github/workflows/`.
- Reusable workflows are kept either in `.github/workflows/reusable/` within the repo or in a central "standards" repository.
- Composite actions reside in `.github/actions/<name>/action.yaml` when shared across jobs in a single repo.
- Workflow names follow `area-purpose` (e.g., `ci`, `build`, `scan`, `release`, `deploy-<env>`).
- Runners are pinned to a specific image release (e.g., a fixed Ubuntu version) rather than moving aliases.

---

## 2) Security baseline (MUST)

- Pin all actions by full commit SHA; do not use floating tags or branches.
- Restrict third‑party actions at the org/repo level to GitHub‑owned and explicitly allow‑listed creators.
- Set a default `GITHUB_TOKEN` permission of read‑only at the org level. Elevate per job only to the minimal required scopes.
- Do not place secrets in global environment variables. Pass secrets explicitly only to the steps that require them.
- Use OpenID Connect (OIDC) for cloud authentication. Avoid long‑lived cloud keys entirely.
- Treat code from forks as untrusted: do not expose secrets on fork PR workflows and avoid patterns that grant elevated permissions to untrusted code.
- Do not run public‑repo or fork‑PR workflows on self‑hosted runners.
- Self‑hosted runners, where used, must be ephemeral per job, network‑isolated, image‑minimal, time‑limited, and allow‑listed by label for specific repos only.
- Set explicit job timeouts. Ensure each job defines a reasonable upper bound based on its class (CI, build, deploy, etc.).
- Enable concurrency groups to cancel superseded runs for the same branch or ref.
- Enforce shell safety flags globally and within scripts; fail fast on errors and undefined variables.

---

## 3) Environments & release gates (MUST)

- Use environments such as `dev`, `staging`, and `production` with:
  - Required reviewers appropriate to risk (e.g., production requires at least two human approvers).
  - Optional wait timers to provide rollback windows.
  - Environment‑scoped secrets and variables; do not reuse production secrets outside production.
- Deployment jobs must reference the target environment explicitly.
- Promote build artifacts or container images across environments; do not rebuild binaries for higher environments.

---

## 4) Triggers, paths & concurrency (SHOULD)

- Use pull‑request events for validation and push events to protected branches for integration and release workflows.
- Apply path filters so workflows only run when relevant files change.
- Configure concurrency to cancel in‑progress runs targeting the same branch or ref for the same workflow.

---

## 5) Step hygiene & shell defaults (MUST)

- Set a single default shell and working directory for all runs in a workflow.
- Ensure shell invocations enable strict modes (error on failure, unset variables, and pipeline failures).
- Lock tool versions explicitly (language toolchains, build tools, CLIs).
- Avoid remote execution patterns that bypass verification. Prefer verified distributions, checksums, and signatures.

---

## 6) Caching, artifacts & dependencies

- Cache only deterministic and rebuildable assets (package caches). Cache keys include lockfile hashes and platform identifiers.
- Artifacts are limited to what is necessary for diagnostics, promotion, or releases. Do not include secrets or sensitive tokens.
- Artifacts use a standard naming convention combining repository, workflow name, run number, and artifact role.
- Artifact retention defaults to the shortest period that still supports audits and rollbacks (commonly 7–14 days).

---

## 7) Reuse first (MUST)

- Consolidate repeated logic into reusable workflows with typed inputs, secrets, and outputs.
- Use composite actions for small, reusable step bundles local to a repo or organization.
- Consumers pass secrets explicitly to reusable components. Avoid inheriting broad secret scopes.
- Reusable workflows are versioned immutably and pinned by commit in callers; human‑readable tags map to those SHAs out of band.

---

## 8) Supply‑chain (MUST)

- Generate and store build provenance (e.g., SLSA) for released artifacts.
- Enforce SHA pinning for all actions via org policy where available.
- Run OpenSSF Scorecards on the default branch on a regular schedule and track regressions.
- Enable dependency update automation for both actions and package ecosystems with guarded auto‑merge policies.

---

## 9) Scanning & quality gates

- Enable static application security testing appropriate to the languages in the repository.
- Enable secret scanning and fail pipelines or block merges on high‑confidence findings until remediated.
- Produce a Software Bill of Materials (SBOM) during builds and attach it to artifacts and releases.
- Publish and enforce minimum automated test coverage thresholds commensurate with the repo's risk profile.

---

## 10) Deployments

- Use OIDC with narrowly scoped roles for cloud deployments.
- Deployments to the same environment run serially unless documented otherwise.
- All deploys include post‑deploy health verification and an automated rollback strategy based on measurable criteria.
- Post a deployment summary with commit ranges, artifact references, and environment links for auditability.

---

## 11) Observability & debugging

- Use structured logging and grouping to improve readability in workflow logs.
- Emit annotations for lint, test, and scan failures to improve pull‑request ergonomics.
- Restrict verbose runner or step debug modes to intentional re‑runs or maintainers only.

---

## 12) Naming & labels (SHOULD)

- Jobs adopt standard names (for example: `lint`, `test`, `build`, `scan`, `publish`, `deploy-<env>`).
- Runner labels describe trust and capabilities (for example: `ephemeral`, `trusted`, OS version, architecture, GPU).
- Artifacts use short, descriptive names for platform and role (for example: `app-linux-x64`, `sbom`, `provenance`, `coverage`).

---

## 13) Exceptions (MUST)

- Any deviation from this standard requires an entry in `/SECURITY-EXCEPTIONS.md` including:
  - Reason and scope.
  - Owner and approver.
  - Expiry date and mitigation plan.
- Exceptions are reviewed on a cadence and expire automatically; expired exceptions cause CI failures until addressed.

---

## 14) Policy checklist (for issue templates and reviews)

- [ ] All actions pinned by full SHA.
- [ ] Org policy restricts third‑party actions to approved creators.
- [ ] Workflow‑level permissions default to read‑only; per‑job elevation is minimal and explicit.
- [ ] No secrets exposed to untrusted code paths (especially forks); no misuse of elevated PR events.
- [ ] Cloud access via OIDC only; no static cloud keys stored.
- [ ] Path filters and concurrency cancellation in place.
- [ ] Job timeouts defined; strict shell behavior enforced.
- [ ] Cache keys derive from lockfiles; artifacts named consistently and retained ≤ 14 days by default.
- [ ] Reusable workflows/composite actions used; secrets passed explicitly; immutably pinned versions.
- [ ] Code, secret, and dependency scanning enabled; SBOM and provenance produced for releases.
- [ ] All exceptions recorded with owner and expiry and actively monitored.

---

## 15) Migration playbook

- Replace floating action versions with commit SHAs. Enforce via policy and auditing.
- Centralize duplicated steps into reusable workflows and publish them in a standards repository.
- Lower org default `GITHUB_TOKEN` permissions to read‑only and elevate per job where necessary.
- Introduce environments with required reviewers and environment‑scoped secrets.
- Migrate cloud deployments to OIDC and remove long‑lived keys from secrets stores.
- Establish scheduled Scorecards and dependency updates with safe auto‑merge rules.
- Add SBOM and provenance generation to release workflows.

---

## 16) Housekeeping automation (MAY)

- Scheduled validation that no exceptions have passed their expiry date.
- CI lints to detect forbidden patterns (e.g., floating action tags, missing timeouts, broad permissions).
- Automated PR comments or checks highlighting policy violations and suggesting compliant fixes.

---

**Ownership & updates**  
- This standard is owned by the DevEx/Security Engineering group. Proposed changes follow normal RFC review.  
- Review at least quarterly or after major GitHub Actions platform changes.