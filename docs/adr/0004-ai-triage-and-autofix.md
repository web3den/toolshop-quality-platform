# ADR-0004: AI triage and auto-fix via GitHub Models, with hard guardrails

Status: accepted · Date: 2026-06-12

## Context

Failure triage is the highest-toil activity in test infrastructure. LLMs are
good at exactly this shape of work (classify, explain, suggest), but an agent
that can silently edit tests can also silently destroy a suite's value.

## Decision

Two agents, both running on **GitHub Models** (free for public repos,
authenticated by the workflow's own `GITHUB_TOKEN`, `models: read` permission —
zero secrets to manage, zero spend):

1. **Triage agent** (`scripts/triage/triage-agent.ts`): reads the Playwright
   JSON report, clusters failures, produces a verdict table
   (product-bug / test-bug / flake / environment) posted as a PR comment and
   job summary. Read-only by construction.
2. **Auto-fix agent** (`scripts/triage/autofix-agent.ts`): only considers
   failures pre-filtered as probable *test* bugs (selector drift, wrong element
   interaction); the patch must (a) touch only `tests/` and `src/`,
   (b) pass `git apply --check`, (c) keep `tsc --noEmit` green, and (d) turn
   the failing lane green on re-run — then it ships as a PR for human review.
   It never pushes, never merges, never touches assertions of product behavior.

## Alternatives considered

- **BYO Anthropic/OpenAI key** — better models, but requires a paid secret in
  a public portfolio repo. Rejected as default; the agents read a standard
  env var, so swapping the endpoint is a config change.
- **Full agentic harness in CI (Claude Code action etc.)** — powerful but
  unbounded write access to the repo. Rejected: triage is a classification
  problem, not an autonomy problem.

## Consequences

- Triage degrades gracefully: without a token it still emits the deterministic
  failure digest; the LLM layer adds verdicts when available.
- The falsifiability lane doubles as a live demo: nightly, the triage agent
  classifies ~20 real (planted) product bugs.
