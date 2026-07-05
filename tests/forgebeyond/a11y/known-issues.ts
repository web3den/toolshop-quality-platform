/**
 * Accessibility debt register for forgebeyond.ai.
 *
 * Rules listed here are ACKNOWLEDGED product findings, not noise: the a11y
 * suite reports them in every run but does not fail on them. The suite DOES
 * fail if:
 *   - a violation appears that is not in this register (regression), or
 *   - a registered violation stops reproducing (fixed → remove the entry,
 *     keeping the register honest and the gate falsifiable).
 *
 * Every entry needs an owner-facing description and a tracking note.
 */
export const KNOWN_A11Y_ISSUES: Record<string, string[]> = {
  // Badge components (.badge--red/.badge--blue) and muted hero text
  // (.hero__note) fail WCAG AA contrast on the dark theme. Found 2026-07-05,
  // 7–9 nodes per page. Fix: bump badge/muted-text colors to ≥4.5:1.
  '/': ['color-contrast'],
  '/products/': ['color-contrast'],
  '/labs/': ['color-contrast'],
  '/case-studies/ci-failure-memory/': ['color-contrast'],
};
