# ADR-0002: Generate the API surface from OpenAPI; commit the output

Status: accepted · Date: 2026-06-12

## Decision

`openapi-typescript` generates a typed schema from the live OpenAPI document;
`openapi-fetch` provides the client. The generated file is committed.

## Alternatives considered

- **Hand-written client + interfaces** — drifts silently from the real API;
  every drift is discovered at runtime. Rejected.
- **Generate at install time (not committed)** — repo can't typecheck offline;
  drift becomes invisible in code review. Rejected.
- **Full SDK generators (openapi-generator)** — heavyweight output, generated
  classes obscure test intent. Rejected: openapi-fetch keeps call sites
  looking like fetch, but typed.

## Consequences

- Contract drift = dirty git diff on `npm run generate:types`. CI runs this on
  every PR as a contract gate (cheap, no test execution needed).
- Compile-time safety for paths/params/bodies; zod adds runtime conformance
  checks in `@contract` tests (types are erased at runtime, so both layers
  are needed).
- One quirk inherited from the SUT's spec: some GETs declare empty `query`
  objects — call sites must match the generated signature exactly, which is
  the point.
