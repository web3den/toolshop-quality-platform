# Skill: failure triage

Classify every failed test into exactly one verdict before touching any code.

## Verdicts and signatures

| Verdict | Typical signature | Action |
| --- | --- | --- |
| **product-bug** | Wrong HTTP status on stable endpoint; schema/contract violation; correct selector finds wrong data; fails on `with-bugs` only | File/report the bug. Do NOT change the test. |
| **test-bug** | Selector not found after UI change; wrong element interaction (`fill` on `<select>`); stale expectation after intentional product change | Fix the test, keeping the assertion's intent. |
| **flake** | Passed on retry; timeout-only failure; depends on shared mutable state | Stabilize the wait/isolation, never loosen the assertion. |
| **environment** | DNS/5xx across all tests; auth provider down; CI runner OOM | Re-run; if persistent, report infrastructure issue. |

## Procedure

1. Read the error and the page snapshot in `error-context.md` (test-results/).
2. Check whether the test passes against `TARGET=production` but fails against
   `TARGET=with-bugs` — that combination means the suite is working; stop.
3. Check retry behavior in the JSON report: pass-on-retry strongly suggests flake.
4. Reproduce the API-level behavior with the typed client or curl before
   blaming the UI layer.
5. Write the verdict with evidence (status codes, selector counts, timings) —
   never "probably".

## Anti-patterns

- Adding `waitForTimeout` to "fix" a flake (lint-banned anyway).
- Widening `expect([400, 401, 403, 404, 500]).toContain(...)` to make red green.
- Marking a product bug as flaky to get CI passing.
