# Skill: locator repair

Use when a test fails with "element(s) not found", strict-mode violations, or
"not an `<input>`/`<select>`" interaction errors.

## Procedure

1. Open the failure's `error-context.md` — it contains an accessibility
   snapshot of the page at failure time. Find what is actually rendered.
2. Locate the authoritative selector in the SUT source
   (`testsmith-io/practice-software-testing`, `sprint5/UI/src/app/**.html`).
   This repo's selector contract is the `data-test` attribute, nothing else.
3. Update the locator **in the page object** (`src/pages/`), never in the spec.
4. If the element moved into a dropdown/dialog, encode the opening interaction
   in the page object method so every spec gets it for free.
5. If the element type changed (input → select), change the interaction method
   (`fill` → `selectOption`) and check whether sibling fields changed too.
6. Re-run the affected spec against `TARGET=production`; then run
   `npm run lint` to confirm no spec-level locators were introduced.

## Known traps in this SUT

- The login `password` field is a custom `<app-password-input>`; its inner
  input carries `data-test="password"`.
- The billing address step auto-fills street/city/state from the postcode
  lookup — fields are not free-form (server rejects mismatched city/country).
- Admin nav links (`nav-admin-*`) are inside the user dropdown (`nav-menu`);
  they exist in the DOM only after the dropdown opens.
- The product grid re-renders after each search/sort API response; anchor waits
  on the network response, not on the caption text.
