# ADR-0003: Visual baselines are Linux-rendered, updated only via workflow PR

Status: accepted · Date: 2026-06-12

## Context

Screenshot bytes differ across OSes (font rendering, antialiasing, scrollbars).
Mixed-platform baselines guarantee false positives.

## Decision

- Baselines are produced exclusively by the *Update visual baselines* GitHub
  Actions workflow (ubuntu runner) and land as a reviewable PR.
- Local macOS/Windows runs never update baselines; `snapshotPathTemplate` keys
  on project name so platform pollution is structurally impossible to miss in
  review.
- Dynamic content (rotating product images, cart badge) is masked; thresholds
  stay tight (`maxDiffPixelRatio: 0.02`) so layout breaks still fail.

## Consequences

- Baseline changes are always intentional, attributed, and reviewed as image
  diffs — never silent.
- The visual lane in CI skips with a notice until the first baseline PR is
  merged (bootstrap path), after which it is a normal blocking lane.
- Trade-off: contributors can't refresh baselines offline; accepted, because
  unreviewable baseline churn is the bigger failure mode.
