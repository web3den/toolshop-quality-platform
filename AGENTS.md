# Agent instructions for this repository

This file is the contract for any AI coding agent (Cursor, Claude Code, Copilot
Workspace, the CI triage/auto-fix agents) operating on this repo.

## What this repo is

A Playwright + TypeScript **multi-product** test platform:

1. **Toolshop** (`tests/toolshop/`) — public demo e-commerce app
   (`practicesoftwaretesting.com`). We do not own this SUT. Three deployments:

   | Target | Purpose | How to select |
   | --- | --- | --- |
   | `production` | stable build — suite must be green | `TARGET=production` (default) |
   | `with-bugs` | intentionally broken build — suite must fail | `TARGET=with-bugs` |
   | `local` | docker-compose build for hermetic runs | `TARGET=local` |

2. **ForgeBeyond** (`tests/forgebeyond/`) — the owner's production marketing
   site (`forgebeyond.ai`). Self-owned: findings here are real product bugs to
   report, and the a11y bar is stricter (critical + serious gate with a
   known-issues register in `tests/forgebeyond/a11y/known-issues.ts`).

Playwright projects are product-prefixed (`toolshop-api`, `forgebeyond-web`,
...). Never mix products in one spec, fixture file, or page object.

## Commands you may rely on

```bash
npm ci                      # install
npm run typecheck           # tsc --noEmit
npm run lint                # eslint (enforces architecture rules)
npm run generate:types      # regenerate typed API surface from live OpenAPI
npm run test:toolshop       # all Toolshop lanes (API + e2e + a11y)
npm run test:forgebeyond    # all ForgeBeyond lanes (web + a11y)
npm run test:api            # Toolshop API + contract lane (fastest signal)
npm run test:smoke          # @smoke across both products
npm run test:bug-hunt       # Toolshop suite vs with-bugs build (expected to fail)
npm run triage              # AI triage of test-results/results.json
```

## Hard rules

1. **Never weaken an assertion to make a test pass.** If a test fails against
   `production`, first reproduce, then decide: product changed (update test to
   the new *correct* behavior) vs test bug (fix the test logic). If it fails
   only against `with-bugs`, that is the test working as designed — do nothing.
2. **Selectors live in `src/pages/` only.** Specs may not call `page.locator`
   (lint enforces this). Add locators to the relevant page object, using the
   app's `data-test` attributes.
3. **No hard sleeps.** `waitForTimeout` is lint-banned. Use web-first
   assertions, `expect.poll`, or `pollUntil` from `src/utils/poller.ts`.
4. **Test data comes from factories/builders** (`src/data/`). Never hardcode
   emails or addresses in specs; billing addresses must come from
   `resolveBillingAddress()` because the SUT cross-validates city/state against
   its postcode-lookup service.
5. **Generated code is read-only.** `src/api/generated/**` is produced by
   `npm run generate:types`. Never hand-edit it; a dirty diff there means the
   provider changed their API contract.
6. **Visual baselines are Linux-only.** Never commit baselines generated on
   macOS/Windows. Use the *Update visual baselines* workflow.
7. **Auto-fix scope.** CI agents may only modify `tests/` and `src/`, must keep
   `tsc --noEmit` green, and deliver changes as a PR — never push to `main`.
8. **Redaction is mandatory.** Anything that leaves the process (attachments,
   assertion messages, LLM payloads, console output) goes through
   `src/utils/redact.ts`. Never log a raw password, token, JWT, or cookie —
   there is no acceptable exception.
9. **Shared accounts are fragile.** Toolshop locks accounts after failed
   logins (423). Negative-credential tests use `registerFreshUser()`
   disposable accounts only; customer identity comes from
   `resolveCustomerCredentials()` / the `customerCreds` fixture, never a
   hardcoded seeded email.

## Skills

Task-specific playbooks live in `docs/skills/`:

- `docs/skills/test-quality-review.md` — falsifiability audit, definite
  DOs/DON'Ts, tagging rules (also the CI review agent's system prompt)
- `docs/skills/test-from-acceptance-criteria.md` — turn ACs/docs into tests
- `docs/skills/failure-triage.md` — classify failures (product-bug / test-bug / flake / environment)
- `docs/skills/locator-repair.md` — repair selector drift correctly
- `docs/skills/visual-baseline-review.md` — review screenshot diffs
- `docs/skills/new-test-authoring.md` — add a new test the right way

Read the relevant skill before doing that category of work.
