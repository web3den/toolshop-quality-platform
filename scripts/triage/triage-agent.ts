/**
 * AI failure-triage agent.
 *
 * Reads the Playwright JSON report, clusters failures, and asks an LLM
 * (GitHub Models — free for public repos, authenticated with GITHUB_TOKEN)
 * to classify each cluster:
 *   - verdict: product-bug | test-bug | flake | environment
 *   - severity, affected area, suggested owner
 *   - for test-bugs: a concrete suggested fix (file + change)
 *
 * Output: triage-output/triage-report.md (posted as a PR comment / job
 * summary by CI) and triage-output/triage.json (machine-readable).
 *
 * Design notes:
 *  - The agent NEVER mutates test code. Suggested fixes go through the
 *    auto-fix workflow which opens a PR for human review (see autofix.yml).
 *  - Token budget guarded: error text truncated per failure, clusters capped.
 *  - Degrades gracefully: without a token it emits the deterministic,
 *    non-LLM portion of the report and exits 0 so CI never blocks on it.
 */
import fs from 'node:fs';
import path from 'node:path';

interface PwError { message?: string }
interface PwResult { status: string; error?: PwError; errors?: PwError[]; retry: number; duration: number }
interface PwTest { results: PwResult[]; projectName?: string; status?: string }
interface PwSpec { title: string; ok: boolean; file: string; line: number; tests: PwTest[]; tags?: string[] }
interface PwSuite { title: string; file?: string; specs?: PwSpec[]; suites?: PwSuite[] }
interface PwReport { suites?: PwSuite[]; stats?: { expected?: number; unexpected?: number; flaky?: number; skipped?: number } }

interface Failure {
  title: string;
  file: string;
  line: number;
  project: string;
  retries: number;
  flaky: boolean;
  error: string;
}

const REPORT_PATH = process.env.PW_JSON ?? 'test-results/results.json';
const OUT_DIR = 'triage-output';
const MODEL = process.env.TRIAGE_MODEL ?? 'openai/gpt-4o-mini';
const MAX_ERROR_CHARS = 1_500;
const MAX_FAILURES_TO_LLM = 12;

function stripAnsi(s: string): string {
  return s.replace(/\u001b\[[0-9;]*m/g, '');
}

function collectFailures(report: PwReport): Failure[] {
  const failures: Failure[] = [];
  const walk = (suite: PwSuite): void => {
    for (const spec of suite.specs ?? []) {
      for (const t of spec.tests) {
        const last = t.results[t.results.length - 1];
        if (!last) continue;
        const failed = last.status !== 'passed' && last.status !== 'skipped';
        const flaky = last.status === 'passed' && t.results.length > 1;
        if (!failed && !flaky) continue;
        const rawError =
          last.error?.message ?? last.errors?.map((e) => e.message).join('\n') ?? '(no error captured)';
        failures.push({
          title: spec.title,
          file: spec.file,
          line: spec.line,
          project: t.projectName ?? 'unknown',
          retries: t.results.length - 1,
          flaky,
          error: stripAnsi(rawError).slice(0, MAX_ERROR_CHARS),
        });
      }
    }
    for (const child of suite.suites ?? []) walk(child);
  };
  for (const s of report.suites ?? []) walk(s);
  return failures;
}

async function classifyWithLLM(failures: Failure[]): Promise<string | null> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_MODELS_TOKEN;
  if (!token) {
    console.log('No GITHUB_TOKEN available — skipping LLM classification.');
    return null;
  }
  const payload = failures.slice(0, MAX_FAILURES_TO_LLM).map((f, i) => ({
    id: i + 1,
    test: f.title,
    file: `${f.file}:${f.line}`,
    project: f.project,
    retries: f.retries,
    flaky: f.flaky,
    error: f.error,
  }));

  const system = [
    'You are a senior SDET triaging an automated test run for the Toolshop e-commerce app',
    '(Angular UI + Laravel REST API, tested with Playwright/TypeScript).',
    'For each failure decide a verdict: product-bug, test-bug, flake, or environment.',
    'Rules of thumb:',
    '- Contract/schema mismatches and wrong HTTP statuses on a stable endpoint => product-bug.',
    '- Selector not found after an app redesign, wrong expectations => test-bug (suggest a concrete fix).',
    '- Passes on retry, timeout-only, network blips => flake.',
    '- DNS/5xx/timeouts on every test => environment.',
    'Return STRICT markdown: a summary line, then a table',
    '(| # | Test | Verdict | Severity | Why | Suggested action |), then a "Suggested fixes" section',
    'with concrete code-level suggestions for any test-bug.',
  ].join('\n');

  const res = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 2_000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Failures (JSON):\n${JSON.stringify(payload, null, 2)}` },
      ],
    }),
  });

  if (!res.ok) {
    console.error(`GitHub Models API error ${res.status}: ${await res.text()}`);
    return null;
  }
  const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return body.choices?.[0]?.message?.content ?? null;
}

async function main(): Promise<void> {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log(`No Playwright JSON report at ${REPORT_PATH}; nothing to triage.`);
    return;
  }
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8')) as PwReport;
  const failures = collectFailures(report);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const stats = report.stats ?? {};
  const header = [
    '## Automated failure triage',
    '',
    `Run stats: ${stats.expected ?? '?'} passed, ${stats.unexpected ?? '?'} failed, ${stats.flaky ?? 0} flaky, ${stats.skipped ?? 0} skipped.`,
    '',
  ];

  if (failures.length === 0) {
    const md = [...header, 'No failures or flaky tests. Nothing to triage. ✅'].join('\n');
    fs.writeFileSync(path.join(OUT_DIR, 'triage-report.md'), md);
    fs.writeFileSync(path.join(OUT_DIR, 'triage.json'), JSON.stringify({ failures: [] }, null, 2));
    console.log(md);
    return;
  }

  const deterministic = failures
    .map(
      (f, i) =>
        `### ${i + 1}. ${f.title} ${f.flaky ? '(FLAKY — passed on retry)' : ''}\n` +
        `- File: \`${f.file}:${f.line}\` | Project: \`${f.project}\` | Retries: ${f.retries}\n` +
        '```\n' + f.error.slice(0, 600) + '\n```',
    )
    .join('\n\n');

  const llmVerdict = await classifyWithLLM(failures);

  const md = [
    ...header,
    llmVerdict ? `${llmVerdict}\n\n<details><summary>Raw failure details</summary>\n\n${deterministic}\n\n</details>` : deterministic,
  ].join('\n');

  fs.writeFileSync(path.join(OUT_DIR, 'triage-report.md'), md);
  fs.writeFileSync(path.join(OUT_DIR, 'triage.json'), JSON.stringify({ failures }, null, 2));
  console.log(md);
}

main().catch((err) => {
  // Triage must never fail the pipeline it reports on.
  console.error('Triage agent error (non-fatal):', err);
});
