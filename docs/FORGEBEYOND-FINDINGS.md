# ForgeBeyond — findings from initial comprehensive test run

Date: 2026-07-05 · Target: https://forgebeyond.ai (production)

Suite results: **29/29 passing** (web/SEO/routing/a11y lanes) with one product
finding held in the accessibility known-issues register.

## Product findings

### 1. Color contrast below WCAG AA (serious, all four pages)
Badge components (`.badge--red`, `.badge--blue`) and muted hero text
(`.hero__note`) fail the 4.5:1 contrast ratio on the dark theme —
7–9 elements per page on `/`, `/products/`, `/labs/`, and the case study.

- **Status:** registered in `tests/forgebeyond/a11y/known-issues.ts` — reported
  in every run (axe JSON attached per page) but not failing the pipeline.
- **Fix:** brighten badge/muted-text foregrounds to reach ≥4.5:1.
- **Gate mechanics:** once fixed, the register entry must be removed — the
  suite fails on stale register entries, so the debt cannot silently linger.

### 2. No security headers (informational, not gated)
No `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options`,
or `X-Content-Type-Options` on responses. Low risk for a static marketing site
but cheap to add at the CloudFront level (response headers policy). Not
asserted in the suite until a policy decision is made.

## What is verified green

- **SEO contract:** every page has exactly one h1, a canonical URL, and a
  50–180 char meta description; robots.txt allows crawling and points at the
  sitemap; the sitemap matches the product registry exactly (drift gate);
  og-image and favicon resolve.
- **Routing:** http→https 301, trailing-slash canonicalization, www→apex
  canonical, honest 404 status for unknown paths (no soft 404s).
- **Link integrity:** zero broken internal links on any page.
- **Performance budgets (deterministic):** every document ≤150KB; zero
  render-blocking third-party scripts in head.
- **Visual:** full-page Linux baselines for all four pages (via the baseline
  workflow), no masks — any pixel drift fails.
