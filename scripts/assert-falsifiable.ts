/**
 * Falsifiability gate.
 *
 * Runs in the nightly bug-hunt lane AFTER the suite executes against the
 * intentionally broken "with-bugs" deployment. If the suite does NOT fail
 * loudly there, our assertions have gone vacuous — that is itself a P1 bug
 * in the test framework, so this script fails the job.
 */
import fs from 'node:fs';

const REPORT = process.env.PW_JSON ?? 'test-results/results.json';
const MIN_EXPECTED_FAILURES = Number(process.env.MIN_EXPECTED_FAILURES ?? 8);

const report = JSON.parse(fs.readFileSync(REPORT, 'utf8')) as {
  stats?: { unexpected?: number; expected?: number };
};
const failed = report.stats?.unexpected ?? 0;
const passed = report.stats?.expected ?? 0;

console.log(`with-bugs run: ${passed} passed, ${failed} failed (minimum required failures: ${MIN_EXPECTED_FAILURES})`);

if (failed < MIN_EXPECTED_FAILURES) {
  console.error(
    `FALSIFIABILITY CHECK FAILED: only ${failed} tests failed against the intentionally broken build. ` +
      'Assertions may have gone vacuous — investigate before trusting green runs.',
  );
  process.exit(1);
}
console.log('Falsifiability check passed: the suite demonstrably catches planted bugs.');
