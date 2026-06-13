# Toolshop Quality Platform

A senior-level test architecture reference built with **Playwright + TypeScript**
against a real product: [Toolshop](https://practicesoftwaretesting.com), a public
e-commerce demo app with an Angular UI and a documented Laravel REST API
(56 endpoints, OpenAPI 3.0).

This is not a tutorial repo. It is the answer to a concrete question:
**what does production-grade test infrastructure look like, end to end** —
typed contracts, layered fixtures, parallel-safe data, tagged execution lanes,
visual + accessibility gates, AI-assisted triage in CI, and a built-in proof
that the suite actually catches bugs.

## The falsifiability proof

Most demo suites are only ever shown passing — which proves nothing. The
vendor of the SUT runs two deployments of the same product:

| Build | Result of this suite |
| --- | --- |
| `practicesoftwaretesting.com` (stable) | **35/35 pass** |
| `with-bugs.practicesoftwaretesting.com` (planted bugs) | **20/35 fail, loudly** |

The nightly **bug-hunt** workflow runs the full suite against the broken build
and a falsifiability gate (`scripts/assert-falsifiable.ts`) fails the pipeline
if fewer than 8 tests catch bugs — guarding against assertions going vacuous.
Real bugs caught there include: API contract violations (internal fields like
`stock`/`brand_id` leaked, IDs typed as numbers instead of strings), unknown
product IDs returning `200` instead of `404`, broken cart creation, duplicate
registration returning the wrong status, and an accessibility regression
(missing image alt text). See [docs/BUG-HUNT-FINDINGS.md](docs/BUG-HUNT-FINDINGS.md).

## Architecture at a glance

```
                ┌────────────────────────────────────────────┐
                │ OpenAPI spec (live)                        │
                │   └─ npm run generate:types                │
                │      → src/api/generated (4k lines, typed) │
                └────────────────┬───────────────────────────┘
                                 ▼
   src/api/        typed client (openapi-fetch) + auth token cache
   src/data/       factories (faker) · builders (fluent invoice) · API seeding
   src/utils/      pollUntil (backoff poller) · allSettledOrThrow · concurrency cap
   src/fixtures/   layered fixtures: pages → api clients → data lifecycle
   src/pages/      POM, data-test contract only (lint-enforced boundary)
   tests/          api/ · e2e/ · visual/ · a11y/  — tagged @smoke @regression
                   @contract @a11y @visual @bug-sensitive
```

Key decisions are documented as ADRs in [docs/adr/](docs/adr/).

### What to look at if you have five minutes

1. [`src/fixtures/test.fixtures.ts`](src/fixtures/test.fixtures.ts) — layered
   fixture composition with LIFO data cleanup.
2. [`src/data/builders/invoice.builder.ts`](src/data/builders/invoice.builder.ts) —
   fluent builder over a discriminated payment union.
3. [`tests/api/contract.spec.ts`](tests/api/contract.spec.ts) — runtime contract
   checks (zod) on top of compile-time OpenAPI types.
4. [`scripts/triage/triage-agent.ts`](scripts/triage/triage-agent.ts) — AI
   failure triage in CI via GitHub Models (free for public repos, zero secrets).
5. [`eslint.config.mjs`](eslint.config.mjs) — architecture enforced by lint:
   no raw locators in specs, no hard sleeps anywhere.

## CI design

| Workflow | Trigger | What it proves |
| --- | --- | --- |
| **CI** | PR / push | lint + typecheck + OpenAPI drift gate → API lane → sharded e2e + a11y → visual → merged HTML report. On failure, the **AI triage agent** posts a verdict table (product-bug / test-bug / flake / environment) as a PR comment. |
| **Nightly bug hunt** | cron | full suite vs the with-bugs build + falsifiability gate + AI triage of everything caught. |
| **Update visual baselines** | manual | regenerates Linux-pinned baselines and opens a reviewable PR — baselines never change silently. |
| **AI auto-fix** | manual | reproduces failures, triages, and lets a guard-railed agent propose a patch (only `tests/`+`src/`, must compile, must turn the lane green, ships as a PR for human review). |

## AI-assisted engineering, with guardrails

The agents in this repo follow a written contract — [AGENTS.md](AGENTS.md) —
and task playbooks in [docs/skills/](docs/skills/) (failure triage, locator
repair, visual baseline review, test authoring). The hard rules: never weaken
an assertion to get green, never "fix" a product bug in test code, never edit
generated files, never push without review.

## Running it yourself

```bash
git clone <this repo> && cd toolshop-quality-platform
npm ci && npx playwright install chromium

npm run test:api        # ~6s   — 21 API + contract tests vs production
npm run test:e2e        # ~25s  — browser journeys (checkout, auth, RBAC)
npm run test:a11y       #        axe-core WCAG scans
npm run test:bug-hunt   #        full suite vs the broken build — watch it fail
npm run triage          #        AI triage of the last run (needs GITHUB_TOKEN)
```

No environment setup needed — the default target is the public production
instance with seeded credentials. `TARGET=local` works against the vendor's
docker-compose stack for hermetic runs.

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — layers, boundaries, data flow
- [docs/TEST-STRATEGY.md](docs/TEST-STRATEGY.md) — what gets tested where, tags, flake policy
- [docs/BUG-HUNT-FINDINGS.md](docs/BUG-HUNT-FINDINGS.md) — every planted bug the suite catches, with evidence
- [docs/adr/](docs/adr/) — architecture decision records

## License

MIT. The Toolshop product is © [Testsmith](https://github.com/testsmith-io/practice-software-testing)
and is used here as a public practice target, as intended by its authors.
