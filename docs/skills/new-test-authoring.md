# Skill: authoring a new test

## Decide the layer first

- **API test** (`tests/api/`) if the behavior is observable over REST — fastest,
  most stable, no browser. Default choice.
- **E2E test** (`tests/e2e/`) only for behavior that genuinely lives in the UI
  (navigation, rendering, client-side state like the cart badge).
- **Contract test** (`tests/api/contract.spec.ts`) when adding coverage for a
  response shape.
- **Visual / a11y** for layout integrity and WCAG, on key pages only.

## Rules

1. Import `test`/`expect` from `src/fixtures/test.fixtures.ts`, never from
   `@playwright/test` directly (you'd lose the fixture layers).
2. Arrange state via the API (`data.seedCart`, factories, `apiAsCustomer`) —
   the browser is only for the behavior under test.
3. Tag it: `@smoke` (PR-blocking, <10s, core paths), `@regression` (nightly+PR),
   `@contract`, `@a11y`, `@visual`. Add `@bug-sensitive` ONLY if you verified
   the test fails on `TARGET=with-bugs`.
4. Unique data comes from factories — never reuse a hardcoded email; parallel
   workers share the SUT.
5. Assertion messages: every non-obvious `expect` carries a message that reads
   as a bug title ("API must honor sort=price,asc").
6. Before pushing run: `npm run lint && npm run typecheck`, the new spec against
   `TARGET=production`, and (if you tagged it `@bug-sensitive`)
   against `TARGET=with-bugs` to confirm it fails there.
