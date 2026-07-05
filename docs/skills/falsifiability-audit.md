# Skill: falsifiability audit — prove a test can fail

A test is falsifiable when a plausible product bug flips it red **and you
have witnessed it red at least once**. "It would probably fail" is a guess;
this skill replaces the guess with a procedure. Use it in two modes:

- **Authoring mode** — you just wrote a test (or generated one from ACs):
  prove it before pushing.
- **Audit mode** — inspect existing tests, one spec file at a time, and
  produce a verdict per test.

The repo-level gate (`scripts/assert-falsifiable.ts`, nightly vs the
with-bugs build) checks the *suite in aggregate*. This skill is the
*per-test* discipline that keeps that gate meaningful.

## Step 1 — identify the oracle of every assertion

For each `expect`, write down (mentally in authoring mode, in the audit table
in audit mode) what independent source of truth it compares against:

| Oracle type | Example | Strength |
| --- | --- | --- |
| External contract | zod schema from OpenAPI, sitemap registry | strong |
| Invariant | prices non-decreasing after sort; badge == Σ quantities | strong |
| Independent fixture value | factory input echoed back by the API | strong |
| Cross-layer agreement | UI total equals API invoice total | strong |
| Copy/status snapshot | `toHaveText('Stop spelunking…')`, `toBe(404)` | ok — breaks loudly, review on product change |
| Same-response tautology | asserting `res.id === res.id`-shaped checks | **not an oracle** — rewrite |
| Existence only | `toBeDefined()`, `toBeTruthy()` on always-set values | **not an oracle** — rewrite or delete |

If you cannot name the bug that flips an assertion red, the assertion is
decoration. Fix it before bothering to run anything.

## Step 2 — break it on purpose (choose the cheapest technique per layer)

Never trust a test you've only seen green. One witnessed red per test, using
whichever technique is cheapest for its layer:

### Toolshop functional tests — the with-bugs build (free, preferred)
```bash
TARGET=with-bugs npx playwright test <spec> -g "<title>"
```
If it fails there for the *right reason*, tag it `@bug-sensitive` (the tag is
earned by this run, never declared). If with-bugs happens not to plant a bug
in this behavior, fall through to the techniques below.

### API tests — mutate the oracle, run, restore
Temporarily invert or corrupt the expectation (flip a `zod` field type,
change the expected status, reverse the sort invariant). Run the single test.
It must fail **with a message a stranger could act on**. Restore. Two-minute
job; do it in a dirty working tree, never commit the mutation.

### E2E tests — corrupt the wire, not the code
`page.route` lets you simulate the product bug without touching the SUT or
the test:

```ts
// simulate: search endpoint returns wrong/empty data
await page.route('**/products/search*', (route) =>
  route.fulfill({ status: 200, body: JSON.stringify({ data: [] }) }),
);
// simulate: 500 on checkout
await page.route('**/invoices', (route) => route.fulfill({ status: 500 }));
```
Drop the route into the test temporarily (or a scratch copy), watch it go
red, delete the route. If the test still passes with an empty grid or a 500,
it is not testing what its title claims.

### Visual tests — inject a layout break
```ts
await page.addStyleTag({ content: 'h1 { margin-left: 200px !important }' });
```
before the screenshot: the diff must trip. If a 200px shift passes,
`maxDiffPixelRatio` or the masks are too loose.

### A11y tests — plant a violation
```ts
await page.evaluate(() => {
  const img = document.createElement('img'); // no alt — axe must flag it
  document.body.prepend(img);
});
```
If the axe gate doesn't fail, the impact filter or known-issues register is
swallowing more than intended.

### Content/SEO tests — mutate the registry
Add a fake path to the product registry's `sitemapPaths` (or remove a real
one): the drift gate must fail in both directions. Restore.

## Step 3 — judge the failure, not just the color

A witnessed red only counts if:

1. the failure message reads like a bug title (says *what behavior* broke,
   not `expected true, received false`) — if not, add assertion messages;
2. it points at the right layer (an API contract break should fail the API
   test, not only a downstream E2E symptom);
3. it fails in bounded time (no 15-minute hang before the timeout).

## Audit mode — sweeping the existing suite

1. **Mechanical pass first** (cheap, catches the worst offenders):

```bash
rg -n 'toBeDefined\(\)|toBeTruthy\(\)' tests/          # existence-only asserts
rg -n 'expect\(\[.*,.*,.*\]\)\.toContain' tests/       # wide status nets
rg -n 'try\s*\{[^}]*expect' -U tests/                  # swallowed assertions
rg -n 'if\s*\(.*\)\s*\{\s*await expect' -U tests/      # conditional assertions
rg -n '@bug-sensitive' tests/                          # tags that claim verification
```
Every `@bug-sensitive` hit must be re-earned when touched: run it vs
with-bugs and confirm it still fails there.

2. **Per-test pass**: for each test in the spec, fill one row:

```
| test title | oracle (from step 1) | technique used (step 2) | witnessed red? | failure message quality | verdict |
```

Verdicts: `falsifiable` · `falsifiable-after-fix` (say what changed) ·
`vacuous — rewrite` · `vacuous — delete` (superseded by a stronger test).

3. **Deliverable**: the table plus diffs for any rewrites, passed through
[test-quality-review](test-quality-review.md) like any other test change.
Never "fix" a vacuous test by loosening it further; either give it a real
oracle or remove it and say so.

## For test-generating agents (hard rule)

Any agent that creates a test (from ACs, from a bug ticket, from exploration)
**must run step 2 before presenting the test as done**, and must state in its
output which technique it used and what the witnessed failure message was.
A generated test that has never been red does not get committed.
