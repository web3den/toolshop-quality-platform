# Bug-hunt findings: what this suite catches

Evidence that the suite is falsifiable. Same suite, two deployments of the
same product, verified on 2026-06-12:

- `TARGET=production` → **35 passed, 0 failed**
- `TARGET=with-bugs` → **15 passed, 20 failed**

Every failure below is a *planted product bug* in the vendor's `with-bugs`
build that the suite caught. Verdicts confirmed by the AI triage agent and by
manual API probes.

## API-level catches

| # | Bug | Caught by | Evidence |
| --- | --- | --- | --- |
| 1 | `GET /products` leaks internal fields (`stock`, `brand_id`, `category_id`, `product_image_id`) and drops the public `in_stock` field | `contract.spec.ts` › products schema `@bug-sensitive` | zod: unexpected keys; `in_stock` missing |
| 2 | Entity IDs returned as numbers instead of ULID strings across products/brands/categories | contract specs (zod `invalid_type` ×48) | `"expected":"string","received":"number"` |
| 3 | Unknown product id returns `200` with empty body instead of `404` | `products.spec.ts` › unknown id `@bug-sensitive` | expected 404/422, got 200 |
| 4 | `POST /carts` returns no cart id → entire cart/checkout API chain broken | `cart-checkout.spec.ts` (4 tests) | `404` on `POST /carts/{id}` follow-up |
| 5 | Duplicate registration returns `422` instead of `409 Conflict` | `auth-users.spec.ts` › already-used email | status mismatch |
| 6 | Registration rejects the documented nested `address` object (validates legacy flat fields) | `auth-users.spec.ts` › register from factory | `"The address field must be a string."` |
| 7 | `GET /products/search?q=` (empty query) returns the full catalog (29) instead of 0 | manual probe; covered by search invariant test | total 0 vs 29 |
| 8 | `GET /brands` returns 10 entries vs 2 in the stable build (test-data pollution / wrong dataset) | brands contract spec | count + schema diff |

## UI-level catches

| # | Bug | Caught by | Evidence |
| --- | --- | --- | --- |
| 9 | Login broken end-to-end in the UI (form interaction changes, no redirect to `/account`) | `auth.spec.ts` (3 tests) | timeout at fill/redirect assertions |
| 10 | Admin dashboard/nav inaccessible for admin user | `auth.spec.ts` › admin RBAC | dashboard heading never renders |
| 11 | Contact form: country/subject control changed type; valid submissions fail | `contact.spec.ts` (2 tests) | `not a <select>` interaction error |
| 12 | Checkout wizard broken before payment step | `shopping-journey.spec.ts` › full checkout | address step never becomes valid |
| 13 | Pre-authenticated session not recognized (token storage contract changed) | storageState smoke test | `nav-menu` absent |

## Accessibility catches

| # | Bug | Caught by | Evidence |
| --- | --- | --- | --- |
| 14 | Product images shipped without alt text (WCAG 1.1.1, critical) | `a11y/critical-pages.spec.ts` › home | axe `image-alt` violation |

## Why this matters

A green checkmark is only meaningful if the same suite goes red when the
product is broken. The nightly pipeline re-proves this automatically: the
falsifiability gate fails the run if fewer than 8 tests catch the planted bugs
(guarding against assertions degrading into tautologies over time).
