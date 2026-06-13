# Architecture

## Layer map and dependency rules

```
tests/**            (specs: intent + assertions only)
  │ may import
  ▼
src/fixtures/**     (composition root: pages + api + data lifecycle)
  │
  ├─ src/pages/**   (POM — owns every selector; data-test contract only)
  ├─ src/api/**     (typed client over generated OpenAPI schema + auth cache)
  ├─ src/data/**    (factories, builders, API seeding)
  └─ src/utils/**   (poller, parallel helpers — no Playwright imports)

src/api/generated/** is machine-written (npm run generate:types). Read-only.
src/config/env.ts    is the single source of truth for targets/credentials.
```

Two of these boundaries are enforced mechanically by ESLint, not by convention:
specs cannot call `page.locator(...)` (selectors belong to page objects) and
nothing may call `waitForTimeout` (hard sleeps mask real synchronization).

## The typed API surface

`scripts/generate-types.ts` pulls the live OpenAPI document and emits
`toolshop-schema.d.ts` (~4,200 lines covering 56 endpoints / 33 schemas).
The generated file is **committed**, which buys two properties:

1. The repo typechecks offline.
2. Provider contract drift shows up as a reviewable diff. CI regenerates the
   types on every PR and fails if the diff is dirty — a free contract gate
   before a single test runs.

`openapi-fetch` consumes the schema, so a path typo, a wrong parameter, or a
misshapen body is a compile error, not a 3 a.m. CI failure.

## Data strategy

- **Factories** (`user.factory.ts`, `message.factory.ts`) produce *valid by
  default* randomized payloads; uniqueness is guaranteed structurally
  (timestamp + pid + sequence) so parallel workers can't collide.
- **Builders** (`invoice.builder.ts`) cover payloads whose shape depends on
  choices — the payment-method discriminated union — so a test reads as
  `new InvoiceBuilder().forCart(id).payByCreditCard().build()`.
- **Seeding** goes through the API, never the UI. `seedCart` creates a cart and
  fans out product additions with a concurrency cap (`mapWithConcurrency`).
- **The postcode-lookup lesson**: the SUT cross-validates billing city/state
  against its own postcode service, so the only contract-correct address source
  is the SUT itself (`resolveBillingAddress()`). The page object mirrors this:
  the billing form takes country + postcode + house number, like the real UI.

## Auth model

API-side: one JWT per (user, target), cached per worker (`src/api/auth.ts`).
Browser-side: a `setup` project logs in via the API and plants the token into
`localStorage['auth-token']` — exactly where the Angular `TokenStorageService`
reads it — then saves `storageState` per role. Browser tests start
authenticated without ever touching the login form (the login form has its own
dedicated tests; nothing else should pay its cost).

Note: SUT tokens expire in ~5 minutes. The setup project runs immediately
before the browser projects in the same job, which keeps the window safe; a
suite that grows beyond that should re-mint tokens per worker via the existing
token cache rather than extending storageState lifetimes.

## Synchronization

Three tools, in order of preference:

1. **Web-first assertions** (`expect(locator).toHaveText(...)`) for UI state.
2. **Network anchoring** for re-renders: the product grid swaps after the
   search/sort API resolves, so the page object awaits the response, not a
   caption that renders early.
3. **`pollUntil`** (`src/utils/poller.ts`) for API-side eventual consistency
   (e.g. invoice visibility after checkout), with backoff and rich timeout
   diagnostics. Hard sleeps are lint-banned.

## Execution lanes

Playwright *projects* are lanes (api / setup / e2e-chromium / visual / a11y),
*tags* are filters (@smoke / @regression / @contract / @a11y / @visual /
@bug-sensitive). Lanes give CI structure (the API lane needs no browser and
returns signal in seconds); tags give selection within and across lanes.

## Targets

`src/config/env.ts` resolves `TARGET` to one of three deployments of the same
product: `production` (must be green), `with-bugs` (must be red — see
TEST-STRATEGY on falsifiability), `local` (vendor docker-compose for hermetic
runs). Credentials are the vendor's public seeded users, so the repo carries
no secrets at all.
