# Test strategy

## What gets tested where

| Layer | Scope | Budget | Examples |
| --- | --- | --- | --- |
| API (`tests/api/`) | every behavior observable over REST | seconds | sorting, search, RBAC boundaries, checkout math, tenant isolation |
| Contract (`@contract`) | response shapes vs published schema | seconds | zod runtime checks + OpenAPI type-drift gate in CI |
| E2E (`tests/e2e/`) | behavior that lives in the UI | tens of seconds | checkout wizard, cart badge, login redirects, admin nav |
| Visual (`tests/visual/`) | layout integrity of key pages | tens of seconds | home/login/contact, dynamic regions masked |
| A11y (`tests/a11y/`) | WCAG 2.0/2.1 A+AA via axe | seconds | zero critical violations is a hard gate |

The default layer is the API. A UI test must justify its existence: it covers
rendering, navigation, or client state that an API test cannot see. Everything
a UI test needs *arranged* is arranged through the API (carts seeded, users
registered, tokens minted) — the browser only executes the behavior under test.

## Tags

- `@smoke` — PR-blocking, core paths, fast. Run: `npm run test:smoke`.
- `@regression` — full functional coverage; PR + nightly.
- `@contract` — schema conformance.
- `@a11y`, `@visual` — non-functional gates.
- `@bug-sensitive` — verified to fail on the `with-bugs` build. This tag is
  earned, not declared: you must run the test against the broken build and see
  it fail before adding the tag.

## Falsifiability: the with-bugs lane

A suite that has never been seen failing is unverified. Nightly, the entire
suite runs against the vendor's intentionally broken deployment, and
`scripts/assert-falsifiable.ts` **fails the pipeline if fewer than 8 tests
fail**. This inverts the usual incentive: a vacuously green suite becomes a
red pipeline. Current score: 20/35 tests catch planted bugs
(see BUG-HUNT-FINDINGS.md).

## Flake policy

1. Retries: CI-only (`retries: 2`), with `trace: on-first-retry`. A test that
   passes on retry is *flaky*, not passing — the JSON report keeps the
   distinction and the triage agent reports it.
2. A flake gets one of two outcomes within its sprint: a real synchronization
   fix (web-first assertion, network anchor, pollUntil) or quarantine via
   `test.fixme` with a tracking issue. It does not get a `waitForTimeout`
   (lint-banned) or a loosened assertion.
3. Shared-environment realism: the public SUT is used by other people. Tests
   are written to be insensitive to foreign data (unique factory data, no
   assumptions about catalog contents beyond seeded invariants) rather than
   pretending the environment is private.

## Oracles

Assertions prefer *invariants* over snapshots of today's data: "prices are
non-decreasing after sort=price,asc", "every search hit contains the term",
"invoice total equals Σ(price × qty)", "an unknown id is a 404". These survive
catalog edits; hardcoded expectations don't.

## What is deliberately out of scope

- Performance/load (k6 belongs in a separate repo with its own SLOs).
- Mobile webviews and cross-browser matrices (Chromium-only here; the
  architecture supports adding projects, the demo doesn't need the runtime).
- Testing the vendor's email flows (MailCatcher exists only in `local`).
