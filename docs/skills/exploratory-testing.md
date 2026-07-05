# Skill: exploratory testing agent (Chrome DevTools MCP)

Use for charter-driven exploratory sessions against a live deployment,
driven by an AI agent through the official
[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
server. Exploration finds what scripted checks cannot; its output feeds the
scripted suite (see step 6).

## Setup

Register the MCP server in your agent host (Cursor, Claude Desktop, or any
MCP client):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest", "--isolated"]
    }
  }
}
```

`--isolated` gives a throwaway profile — no cookies or credentials from the
operator's own browser can leak into the session (or into screenshots).

Key tools the agent gets: `navigate_page`, `take_snapshot` (a11y tree),
`take_screenshot`, `click`, `fill`, `list_console_messages`,
`list_network_requests`, `get_network_request`,
`performance_start_trace` / `performance_stop_trace`, `emulate_cpu`,
`emulate_network`, `resize_page`.

## 1. Charter — never explore without one

One session = one charter = 30–60 minutes of focus. Template:

```
CHARTER: Explore <area/flow>
         with <resources: personas, devices, data, throttling>
         to discover <risk: data loss, broken flows, console errors, perf, a11y>
TARGET:  <deployment URL + TARGET/FB_BASE_URL value>
TIMEBOX: <minutes>
OUT OF SCOPE: <what to deliberately ignore>
```

Pick charters from risk, not habit: recent changes, complex logic
(Toolshop checkout, postcode lookup), integration seams (payment providers),
and whatever the bug-hunt build says the vendor likes to break.

## 2. Tours — structured ways to walk the product

- **Money tour**: the paths revenue depends on (browse → cart → checkout).
- **Landmark tour**: every nav destination once; verify each page's one job.
- **Garbage-collector tour**: junk input everywhere — long strings, emoji,
  RTL text, `<script>` payloads, negative quantities, 0, MAX_INT.
- **Back-button tour**: every flow interrupted with back/refresh/deep-link;
  SPAs (Toolshop is Angular) fail here more than anywhere.
- **Slow-network tour**: `emulate_network` Slow 3G + `emulate_cpu` 4× —
  race conditions, double-submits, and missing spinners surface.
- **Viewport tour**: `resize_page` to 375×667 and 1920×1080; hunt overflow,
  unreachable buttons, layout collapse.

## 3. Observe below the surface — this is why we use CDP

After every meaningful interaction:

1. `list_console_messages` — any error or warning is a finding, even when the
   UI looks fine. Silent console errors are pre-bugs.
2. `list_network_requests` — hunt for 4xx/5xx the UI swallowed, duplicate
   calls (double-submit), requests that never resolve, and payloads carrying
   more data than the feature needs (over-fetching, PII exposure).
3. `take_snapshot` — the a11y tree IS the user interface for assistive tech;
   a control missing from the snapshot is invisible to screen readers.
4. On flows that feel slow: wrap them in `performance_start_trace` /
   `performance_stop_trace` and record LCP/CLS and long tasks.

## 4. Evidence discipline

Every observation gets captured **at the moment of discovery**:
screenshot, console excerpt, the specific network request/response
(`get_network_request`), exact steps so far. Reproduce once before writing
it up; note "not reproduced on retry" honestly if it fails — flaky evidence
labeled as solid is how teams lose trust in QA.

**Redaction applies here too**: never paste tokens, cookies, or passwords
from captured requests into notes or tickets. Same rules as
`src/utils/redact.ts` — mask, keep a length hint.

## 5. Session report

File under `docs/exploratory/<date>-<charter-slug>.md`:

```
CHARTER / TARGET / TIMEBOX (planned vs actual)
COVERAGE: what was actually touched, and what wasn't
BUGS: numbered; each with steps, expected vs actual, evidence links, severity
QUESTIONS: behavior that needs a product owner's ruling (not bugs yet)
PRAISE: what worked well (calibrates severity and keeps signal honest)
FOLLOW-UP CHARTERS: risks noticed but out of scope this session
```

## 6. Feed the scripted suite

Exploration that doesn't harden the suite evaporates. For each confirmed bug
or near-miss, decide:

- worth a permanent check → write it via
  [test-from-acceptance-criteria](test-from-acceptance-criteria.md) (the bug
  report is the AC) and pass it through
  [test-quality-review](test-quality-review.md);
- environment/instance quirk → note it in the target config docs;
- product question → route to the owner, don't automate a guess.

A finding that becomes a `@regression` test gets the bug/ticket reference in
a comment above the test title.
