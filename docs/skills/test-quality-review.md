# Skill: test quality review (falsifiability + best practices)

Use to review any new or changed test — human PR review, the CI test-review
agent, or self-review before pushing. The output of this skill is a verdict
per test: **approve**, **needs-work** (with concrete items), or **reject**.

## 1. Falsifiability check — would this test ever fail?

For every assertion ask: *what product bug makes this go red?* If you cannot
name one, the assertion is decoration, not a test.

Screening questions (fast, for review):
- If the API returned an empty list, wrong status, or unsorted data — fails?
- If the button stopped working or the page rendered blank — fails?
- If the copy/schema/redirect silently changed — fails?

Screening is not proof. For new tests, and whenever an audit flags a suspect,
run the operational procedure in
[falsifiability-audit.md](falsifiability-audit.md): identify each assertion's
oracle, then **witness the test red** using the cheapest technique for its
layer (with-bugs target, oracle mutation, `page.route` wire corruption,
injected layout/a11y breaks). A test nobody has seen fail is unverified.

Red flags that make a test vacuous:
- `expect(x).toBeDefined()` on something that is always defined
- asserting only status 200 when the *content* is the behavior under test
- wide status nets like `expect([200, 201, 204, 404]).toContain(status)`
- try/catch around the assertion, or conditional assertions (`if (visible)`)
- asserting against a value computed from the same response being tested
  (tautology) instead of an independent oracle or invariant

For Toolshop tests: `@bug-sensitive` is **earned** — run the test against
`TARGET=with-bugs` and watch it fail before adding the tag. The nightly
falsifiability gate depends on that tag being honest.

Hard rule for test-generating agents: a generated test that has never been
witnessed red does not get committed (see falsifiability-audit.md).

## 2. Definite DOs

- **DO** assert invariants over snapshots: "prices non-decreasing after sort",
  "every hit contains the term", "total = Σ(price × qty)".
- **DO** arrange through the API, assert through the layer under test.
- **DO** give every non-obvious `expect` a message that reads as a bug title.
- **DO** use factories/builders for data; unique data per test, always.
- **DO** use web-first assertions / network anchoring / `pollUntil` for waits.
- **DO** keep one behavior per test; a second unrelated assertion is a
  second test.
- **DO** put selectors in page objects only; use the `data-test` contract
  (Toolshop) or the accessibility tree (content sites).
- **DO** make failures diagnosable: attach context, keep API logs (redacted).

## 3. Definite DON'Ts

- **DON'T** use `waitForTimeout` — ever (lint-banned).
- **DON'T** weaken an assertion to make a red test green; classify first
  (see failure-triage skill).
- **DON'T** share mutable state between tests (shared carts, shared counters,
  login attempts against shared accounts — lockout poisons everyone).
- **DON'T** hardcode environment specifics (URLs, credentials) in specs —
  they belong in `src/config/`.
- **DON'T** assert on implementation details (CSS classes, DOM depth,
  internal field names) when a behavioral surface exists.
- **DON'T** leave secrets in assertions, logs, or attachments — everything
  that leaves the process goes through `src/utils/redact.ts`.
- **DON'T** catch-and-ignore; a swallowed error is a lie in the report.

## 4. Tagging rules

| Tag | Meaning | Rule |
| --- | --- | --- |
| `@smoke` | PR-blocking core path | fast (<10s), high-signal, no deep data setup |
| `@regression` | full functional coverage | nightly + PR lanes |
| `@contract` | schema/API-shape conformance | must reference an external oracle (OpenAPI/zod) |
| `@a11y` | accessibility gate | axe scans; gate critical (+serious on self-owned sites) |
| `@visual` | screenshot comparison | Linux baselines only, masks documented |
| `@seo` | discoverability contract | canonical/robots/sitemap/meta |
| `@perf` | deterministic budgets | never wall-clock on shared runners |
| `@bug-sensitive` | verified falsifiable vs with-bugs build | tag only after seeing it fail there |

Every test carries at least one lane tag (`@smoke`/`@regression`) — untagged
tests do not run in any scheduled lane and are dead code.

## 5. Review output format

```
VERDICT: approve | needs-work | reject
Falsifiability: <which product bug each key assertion catches>
Issues: <numbered, each with file:line and a concrete fix>
Tags: <ok | missing/wrong with correction>
```
