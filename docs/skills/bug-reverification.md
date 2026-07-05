# Skill: bug re-verification from Jira

Use when a ticket moves to *Ready for QA / Resolved* and the fix needs
verification, or during periodic sweeps of the "fixed long ago, never
verified" backlog. The deliverable is a **verdict with evidence**, a ticket
update, and (usually) a regression test.

> **No Jira on this project?** The procedure is tracker-agnostic. Swap the
> Jira MCP/REST calls for GitHub Issues (`gh issue view/comment/close`) —
> everything else stands. The Jira wiring below is kept demo-ready.

## Setup (Jira access)

Via the Atlassian MCP server (or plain REST with a token):

```json
{
  "mcpServers": {
    "atlassian": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.atlassian.com/v1/sse"]
    }
  }
}
```

Needed fields per ticket: summary, description, reproduction steps, affected
version/environment, fix version, linked PR/commit, priority, reporter.

## 1. Intake — refuse vague tickets early

Read the ticket and extract: **steps**, **expected**, **actual**,
**environment**. If any is missing, don't guess — comment on the ticket
asking for the gap and move on. Verifying a bug you had to reinterpret
produces a worthless "verified".

Check the linked PR/commit: what actually changed? A fix that touched code
nowhere near the reported symptom is a red flag — note it.

## 2. Re-reproduce on the affected build first (when available)

Before testing the fix, confirm you can still trigger the original failure on
the affected version (for Toolshop: the `with-bugs` build is exactly this).
This proves your reproduction is faithful. Skipping this step is how "cannot
reproduce → closed" ships live bugs.

## 3. Verify on the fixed build

- Follow the ticket's steps **exactly** — resist "improving" them.
- Then go one step beyond: nearest boundaries (empty/max input, other user
  role, second submission), and the same flow via the API when one exists —
  a UI-only fix over a broken endpoint is a half-fix.
- Capture evidence for both outcomes: screenshots/trace, API
  request/response (redacted — passwords/tokens masked, as everywhere else
  in this repo), console output if relevant.

## 4. Verdict — exactly one of

| Verdict | Meaning | Ticket action |
| --- | --- | --- |
| **VERIFIED-FIXED** | steps pass on fix version, boundaries hold | close/QA-pass, attach evidence |
| **NOT-FIXED** | original symptom still reproduces | reopen with fresh evidence + exact build tested |
| **PARTIALLY-FIXED** | main case passes, a boundary/sibling path fails | reopen or file linked follow-up; never silently pass |
| **CANNOT-VERIFY** | steps unclear, env unavailable, feature moved | comment asking for what's missing; do NOT close |

## 5. Ticket comment template

```
Re-verification of <KEY> on <build/version, environment, date>

Original repro on affected build: [reproduced / not reproducible / n-a]
Fix verification: <verdict>

Steps executed: <numbered, as run>
Evidence: <attachments/links — redacted>
Beyond-the-steps checks: <boundaries tried and results>
Regression test: <added at tests/... / already covered by <spec> / not warranted because ...>
```

## 6. Pin it with a regression test

Default is YES for anything user-visible or data-corrupting. Write it via
[test-from-acceptance-criteria](test-from-acceptance-criteria.md) (ticket =
AC), reference the ticket above the test, tag `@regression` — and prove the
test fails on the affected build when one exists (`@bug-sensitive` on
Toolshop's with-bugs target). Skip only for one-off data issues or removed
features, and say so in the ticket comment.
