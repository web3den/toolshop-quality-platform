# Skill: create tests from acceptance criteria / docs

Use when turning a user story, AC list, API doc, or product spec into tests
in this framework.

## Procedure

### 1. Extract testable claims
Rewrite every AC as one or more falsifiable claims with an explicit oracle:

> AC: "Users can sort products by price."
> Claims:
> - `GET /products?sort=price,asc` returns items in non-decreasing price order (oracle: sort invariant)
> - the UI grid re-renders in that order after selecting the option (oracle: same invariant via visible prices)
> - invalid sort keys are rejected or ignored without a 5xx (oracle: status contract)

If a claim has no oracle ("page looks good"), push it to `@visual` with a
baseline, or back to the author for a measurable criterion.

### 2. Choose the cheapest layer that can falsify each claim
API > contract > E2E > visual (see TEST-STRATEGY). One claim may map to two
layers (API invariant + thin UI check) — never duplicate the full assertion
in both.

### 3. Map to framework primitives
- Data the test needs → existing factory/builder, or extend one (never inline).
- New page interactions → page-object methods, named after user intent
  (`sortBy`, not `selectOption`).
- New endpoints → typed client already has them (regenerate types if the
  spec grew); add zod schema if the claim is contract-shaped.
- Eventual consistency in the claim ("appears in the account") → `pollUntil`.

### 4. Name and tag
- Test title = the claim, readable as a bug report when it fails:
  `'API must honor sort=price,asc'`.
- Tag per the tagging rules in test-quality-review.md. New user-facing core
  path → `@smoke`; everything else starts as `@regression`.

### 5. Prove it can fail
Before pushing, break the claim once using the layer-appropriate technique
from [falsifiability-audit.md](falsifiability-audit.md) — with-bugs target,
oracle mutation, `page.route` wire corruption, injected layout/a11y break.
Watch it fail with a readable message, then restore. State which technique
you used when presenting the test. A test born green and never seen red is
unverified and does not get committed.

## Worked example

AC: *"Visitors can contact us; messages under 50 characters are rejected."*

| Claim | Layer | Test |
| --- | --- | --- |
| valid message accepted, confirmation shown | E2E `@regression` | fill via `buildContactMessage()`, expect success alert |
| <50 chars rejected with field error | E2E `@regression` | `buildContactMessage({ message: 'too short' })`, expect `message-error` |
| API rejects short message with 422 + field key | API `@contract` | POST /messages, assert status + error envelope shape |

Factory provides validity by default; the invalid case overrides exactly one
field — the one under test.
