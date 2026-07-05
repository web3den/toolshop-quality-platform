# Exploratory session — Toolshop money tour (mobile + garbage input)

Ran per [docs/skills/exploratory-testing.md](../skills/exploratory-testing.md).

```
CHARTER: Explore the browse → product → cart path
         with a mobile viewport (375×667), rapid double-submits, and hostile
         search input, observing console + network below the UI
         to discover state inconsistencies, swallowed errors, and XSS-shaped
         input handling
TARGET:  https://practicesoftwaretesting.com (TARGET=production)
TIMEBOX: 20 min (actual ~15 min, agent-driven headless Chromium via CDP)
OUT OF SCOPE: checkout payment step (covered by scripted suite), admin
```

## Coverage

Home (mobile + desktop), first product detail page, cart badge behavior under
rapid clicks, `/checkout` cart page as guest, search with hostile input.
Not touched: category filters, language switcher, favorites, pagination.

## Bugs / findings

### 1. Cart badge disagrees with the cart after rapid add-to-cart clicks
- **Steps**: product detail → click *Add to cart* 3× in quick succession →
  read the header badge → open `/checkout`.
- **Expected**: badge and cart agree (whatever the debounce policy is).
- **Actual**: badge showed **2**, cart page quantity field showed **1**.
- **Evidence**: session console/network capture; reproducible pattern of the
  add-to-cart POST racing the cart-creation response.
- **Severity**: minor-major (trust: users see phantom items in the badge).
- **Suite follow-up**: the scripted suite pins single-add badge behavior
  (`adding to cart updates the cart badge @smoke`); a rapid-multi-add
  invariant test (badge == Σ cart quantities) is a candidate once the
  intended debounce behavior is confirmed — see Questions.

### 2. Uncaught TypeError on the guest cart page (console)
- **Steps**: as a guest with an in-flight cart, navigate to `/checkout`.
- **Actual**: repeated uncaught
  `TypeError: Cannot read properties of undefined (reading 'cart_items')`
  from the Angular template (`chunk-VFZ57YP5.js`) while the page renders —
  UI eventually recovers, so scripted E2E passes right over it.
- **Severity**: minor today, but template exceptions are pre-bugs: any
  rendering-order change turns this into a blank cart.
- **Suite follow-up**: candidate for a console-error gate on key pages
  (assert zero uncaught exceptions during the money path).

### 3. Guest pages fire `/users/me` and log 401s as errors (console noise)
- Every guest page load logs `401 GET /users/me` plus an unhandled
  `ERROR {message: Unauthorized}`. Expected control flow being reported as
  an error trains developers to ignore the console.
- **Severity**: trivial, hygiene.

## Questions (need a product ruling, not bugs yet)

- What is the *intended* rapid-click policy on add-to-cart — debounce to one,
  or count every click? (Determines the assertion in finding 1.)
- Hostile search input (`<script>…</script>` ×20) triggered neither the
  results caption nor a no-results message. No script execution observed
  (good), but the empty response state deserves a defined behavior.

## Praise

- `data-test` attributes were present on every control the tour needed —
  the product's testability contract held up under exploration.
- No swallowed 5xx anywhere on the money path; API errors surface fast.

## Follow-up charters

- Slow-network tour (3G emulation) of the same path — finding 1 suggests
  race windows that widen under latency.
- Back-button tour through the checkout wizard steps.
