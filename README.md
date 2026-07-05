# Toolshop Quality Platform

A senior-level, **multi-product** test platform built with Playwright +
TypeScript. One framework, two real products under test:

| Product | What it is | Lanes |
| --- | --- | --- |
| [Toolshop](https://practicesoftwaretesting.com) | e-commerce app: Angular UI + documented Laravel REST API (56 endpoints, OpenAPI 3.0) | API · contract · E2E · visual · a11y |
| [forgebeyond.ai](https://forgebeyond.ai) | production marketing site (Astro on CloudFront) | web · SEO · routing · link-integrity · perf budgets · visual · a11y |

This is not a tutorial repo. It is the answer to a concrete question:
**what does production-grade test infrastructure look like, end to end** —
typed contracts, layered fixtures, parallel-safe data, tagged execution lanes,
redacted API transcripts on every test, Allure trend reporting, AI-assisted
triage in CI, and a built-in proof that the suite actually catches bugs.

## The falsifiability proof

Most demo suites are only ever shown passing — which proves nothing. The
Toolshop vendor runs two deployments of the same product:

| Build | Result of this suite |
| --- | --- |
| `practicesoftwaretesting.com` (stable) | **35/35 pass** |
| `with-bugs.practicesoftwaretesting.com` (planted bugs) | **20/35 fail, loudly** |

The nightly **bug-hunt** workflow runs the full suite against the broken build
and a falsifiability gate (`scripts/assert-falsifiable.ts`) fails the pipeline
if fewer than 8 tests catch bugs — guarding against assertions going vacuous.
See [docs/BUG-HUNT-FINDINGS.md](docs/BUG-HUNT-FINDINGS.md) for every bug
caught, and [docs/FORGEBEYOND-FINDINGS.md](docs/FORGEBEYOND-FINDINGS.md) for
the real product findings from the marketing-site suite (including a WCAG
contrast issue held in a self-policing known-issues register).

## Architecture at a glance

```
                ┌────────────────────────────────────────────┐
                │ OpenAPI spec (live)                        │
                │   └─ npm run generate:types                │
                │      → src/api/generated (4k lines, typed) │
                └────────────────┬───────────────────────────┘
                                 ▼
   src/config/     product registry (toolshop targets, forgebeyond)
   src/api/        typed client (openapi-fetch) + lockout-aware auth
                   + ApiLog middleware → redacted transcript per test
   src/data/       factories (faker) · builders (fluent invoice) · API seeding
   src/utils/      pollUntil · allSettledOrThrow · concurrency cap · redact
   src/fixtures/   per-product composition roots (pages → api → data lifecycle)
   src/pages/      POM: data-test contract (Toolshop) / a11y tree (ForgeBeyond)
   tests/
     toolshop/     api/ · e2e/ · visual/ · a11y/
     forgebeyond/  web/ · a11y/ · visual/
```

Key decisions are ADRs in [docs/adr/](docs/adr/) — product choice, typed
client, Linux-pinned visual baselines, AI triage guardrails, multi-product +
reporting + redaction.

### What to look at if you have five minutes

1. [`src/api/logging.ts`](src/api/logging.ts) + [`src/utils/redact.ts`](src/utils/redact.ts) —
   every API test ships a full HTTP transcript in its report; passwords,
   tokens, and JWTs are structurally impossible to leak.
2. [`src/api/auth.ts`](src/api/auth.ts) — self-healing identity on a shared
   environment (seeded account locked? fall back, register, persist per run).
3. [`tests/forgebeyond/a11y/known-issues.ts`](tests/forgebeyond/a11y/known-issues.ts) —
   an accessibility-debt register that fails when an entry goes stale, so the
   gate can never rot into a tautology.
4. [`scripts/triage/triage-agent.ts`](scripts/triage/triage-agent.ts) — AI
   failure triage via GitHub Models (free for public repos, zero secrets).
5. [`eslint.config.mjs`](eslint.config.mjs) — architecture enforced by lint:
   no raw locators in specs, no hard sleeps anywhere.

## Reporting

- **Allure** (stakeholder-grade): merged across all lanes and shards, with
  history/trends preserved on `gh-pages` and republished on every main-branch
  run — pass-rate and duration trends, per-suite drilldowns, attachments.
- **Playwright HTML** (engineer-grade): traces, videos, screenshots, and the
  per-test redacted API transcript (`api-log.json` + `api-transcript.txt`).
- **PR comments**: AI triage verdicts (product-bug / test-bug / flake /
  environment) and an advisory AI test-quality review of changed specs.

## CI design

| Workflow | Trigger | What it proves |
| --- | --- | --- |
| **CI** | PR / push | lint + typecheck + OpenAPI drift gate → Toolshop API lane → sharded Toolshop e2e+a11y → ForgeBeyond web+a11y → visual (both products) → merged HTML report → Allure publish. On failure: AI triage as PR comment. On PRs: AI test-quality review of changed specs. |
| **Nightly bug hunt** | cron | full suite vs the with-bugs build + falsifiability gate + AI triage; full production regression across both products. |
| **Update visual baselines** | manual | regenerates Linux-pinned baselines for both products, opens a reviewable PR. |
| **AI auto-fix** | manual | reproduces failures, triages, and lets a guard-railed agent propose a patch (only `tests/`+`src/`, must compile, must turn the lane green, ships as a PR). |

## AI-assisted engineering, with guardrails

Agents follow a written contract — [AGENTS.md](AGENTS.md) — and task
playbooks in [docs/skills/](docs/skills/):

- [test-quality-review](docs/skills/test-quality-review.md) — falsifiability
  audit, definite DOs/DON'Ts, tagging rules (this is the system prompt of the
  CI review agent, so humans and agents enforce the same bar)
- [test-from-acceptance-criteria](docs/skills/test-from-acceptance-criteria.md) —
  AC → falsifiable claims → cheapest layer → framework primitives → prove it fails
- [exploratory-testing](docs/skills/exploratory-testing.md) — charter-driven
  sessions through the Chrome DevTools MCP: tours, below-the-surface
  console/network/perf observation, findings that harden the scripted suite
  (example session: [docs/exploratory/](docs/exploratory/))
- [bug-reverification](docs/skills/bug-reverification.md) — Jira ticket →
  re-reproduce on the affected build → verify the fix → verdict with evidence
  → regression test
- [failure-triage](docs/skills/failure-triage.md) · [locator-repair](docs/skills/locator-repair.md) ·
  [visual-baseline-review](docs/skills/visual-baseline-review.md) · [new-test-authoring](docs/skills/new-test-authoring.md)

Hard rules: never weaken an assertion to get green, never "fix" a product bug
in test code, never edit generated files, never push without review.

## Running it yourself

```bash
git clone <this repo> && cd toolshop-quality-platform
npm ci && npx playwright install chromium

npm run test:toolshop      # ~25s — 35 tests vs the live e-commerce app
npm run test:forgebeyond   # ~5s  — 29 tests vs the live marketing site
npm run test:smoke         # PR-blocking core paths across both products
npm run test:bug-hunt      # full Toolshop suite vs the broken build — watch it fail
npm run report             # Playwright HTML report
npm run report:allure      # Allure report (requires Java)
```

No environment setup needed — default targets are the public instances.
`TARGET=with-bugs|local` switches Toolshop deployments; `FB_BASE_URL`
repoints the ForgeBeyond suite (e.g. at a preview deploy).

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, boundaries, data flow
- [docs/TEST-STRATEGY.md](docs/TEST-STRATEGY.md) — what gets tested where, tags, flake policy
- [docs/BUG-HUNT-FINDINGS.md](docs/BUG-HUNT-FINDINGS.md) — every planted bug the suite catches
- [docs/FORGEBEYOND-FINDINGS.md](docs/FORGEBEYOND-FINDINGS.md) — real findings on the marketing site
- [docs/adr/](docs/adr/) — architecture decision records

## License

MIT. The Toolshop product is © [Testsmith](https://github.com/testsmith-io/practice-software-testing)
and is used here as a public practice target, as intended by its authors.
forgebeyond.ai is tested with its owner's consent.
