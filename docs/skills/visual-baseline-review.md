# Skill: visual baseline review

Use when the visual lane fails or a baseline-update PR needs review.

## Reviewing a visual failure

1. Download the `visual-diffs` artifact: it contains `*-actual.png`,
   `*-expected.png` and `*-diff.png` for each failure.
2. Classify the diff:
   - **Layout shift** (elements moved/overlap/missing) → real regression, file it.
   - **Content change** (new product image, copy change) → check the mask list
     in `tests/visual/*.spec.ts`; rotating content should be masked, not asserted.
   - **Rendering noise** (font antialiasing, sub-pixel) → should be absorbed by
     `maxDiffPixelRatio: 0.02`; if it isn't, the page likely has an animation
     that needs disabling, not a higher threshold.
3. Only after classifying: either fix the product expectation, extend the mask,
   or regenerate baselines via the *Update visual baselines* workflow.

## Reviewing a baseline-update PR

- Every changed image must be explainable by an intentional UI change.
- Never merge a baseline update that was generated locally (macOS/Windows
  pixels differ); the workflow is the only legitimate producer.
- Raising `maxDiffPixelRatio` is a last resort and needs a comment justifying it.
