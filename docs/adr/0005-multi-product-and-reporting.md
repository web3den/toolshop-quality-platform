# ADR-0005: Multi-product architecture, Allure reporting, always-on redaction

Status: accepted · Date: 2026-07-05

## Context

The platform grew from one SUT (Toolshop) to two (plus forgebeyond.ai, a
static marketing site). Requirements: neither product's suite may degrade the
other's signal; reports must be stakeholder-grade with history/trends; API
logs are invaluable for triage but must never leak credentials.

## Decisions

### 1. Products are namespaces, not branches
One repo, one config. Playwright projects are product-prefixed
(`toolshop-api`, `forgebeyond-web`, ...); specs live under
`tests/<product>/`, page objects under `src/pages/<product>/` (Toolshop
predates the convention and keeps its flat layout), fixtures are per-product
composition roots. Shared plumbing (poller, parallel helpers, redaction,
reporting) is product-agnostic in `src/utils`. Visual baselines key on project
name, so cross-product pollution is structurally impossible.

Rejected: separate repos (duplicates all infrastructure, halves the demo
value), single shared fixture file (a static site and a transactional app
have nothing to share at that layer — coupling there is how frameworks rot).

### 2. Allure for stakeholder reporting, Playwright HTML for engineers
Every lane writes `allure-results`; CI merges them across jobs/shards,
restores `history/` from the `gh-pages` branch, regenerates the report, and
republishes — giving trend charts (pass rate, duration, retries/flakiness)
across runs at a stable URL. The Playwright HTML report (traces, videos,
per-test attachments) remains the engineer-facing artifact. PR runs skip
publishing (no write permissions, and trends belong to `main`).

Rejected: self-made dashboard (maintenance sink), ReportPortal (needs a
hosted service — wrong weight for this repo).

### 3. Redaction is structural, not best-effort
All HTTP traffic through the typed client is captured by an `ApiLog`
middleware and attached to every test (JSON + human transcript) — after
passing through `src/utils/redact.ts`, which masks sensitive keys
(password/token/authorization/cookie/…), scrubs JWT/Bearer patterns from
free text, and truncates oversized bodies. `unwrap()` error messages pass
through the same module, so assertion output in CI logs is covered too.
Call sites cannot opt out; there is no unredacted path.

### 4. Shared-environment resilience beats fixed identity
The public Toolshop instance locks accounts (HTTP 423) after failed logins by
*anyone*. Customer identity is therefore resolved at runtime
(seeded customer → customer2 → freshly registered account), persisted per run
so all workers agree. House rule enforced in review: negative-credential tests
use disposable registered accounts only.

## Consequences

- One `npm ci` + one config tests both products; a third product is a folder,
  a fixture file, and a config entry away.
- The a11y gate for the self-owned site is stricter (critical+serious) with a
  known-issues register that fails when stale — debt is visible, bounded, and
  cannot rot into a vacuous gate.
- Allure history lives on `gh-pages`; deleting the branch resets trends but
  nothing else.
