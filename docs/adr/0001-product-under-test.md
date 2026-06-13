# ADR-0001: Product under test — Toolshop (practicesoftwaretesting.com)

Status: accepted · Date: 2026-06-12

## Context

A portfolio test framework needs a SUT that is public, stable, non-trivial,
and testable at both the API and UI layers. Candidates evaluated:

- **SauceDemo** — UI-only, no API, shallow domain. Rejected.
- **restful-booker** — API-only, no real UI. Rejected.
- **RealWorld/Conduit apps** — community instances are unstable/stale. Rejected.
- **Toolshop (Practice Software Testing)** — Angular UI + Laravel REST API,
  56 documented endpoints (OpenAPI 3.0), seeded customer/admin roles, full
  e-commerce domain (catalog, cart, checkout with 5 payment methods, favorites,
  messages, admin PIM/reports). Self-hostable via docker-compose. **Accepted.**

## The deciding factor

The vendor operates an intentionally broken twin deployment
(`with-bugs.practicesoftwaretesting.com`). That enables the strongest claim a
test repo can make: *the suite demonstrably fails when the product is broken*
(see TEST-STRATEGY, falsifiability). No other candidate offered this.

## Consequences

- The public instance is shared and periodically reseeded → tests assert
  invariants, generate unique data, and never assume exclusive access.
- We do not own the SUT → product bugs found are documented, never worked
  around by weakening assertions; `local` target exists for hermetic runs.
- Seeded credentials are public → zero secrets in the repo.
