/**
 * AI auto-fix agent (guard-railed).
 *
 * Consumes triage-output/triage.json, picks failures that look like TEST bugs
 * (never product bugs — we don't own the SUT), asks the LLM for a unified
 * diff limited to tests/ and src/, validates it with `git apply --check`
 * plus a TypeScript compile, and leaves the changes in the working tree.
 * CI (autofix.yml) turns the working tree into a pull request for human
 * review — the agent itself never pushes or merges anything.
 *
 * Exit codes: 0 = patch applied & compiles (PR-worthy), 78 = nothing to fix.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync, spawnSync } from 'node:child_process';

interface TriageFailure {
  title: string;
  file: string;
  line: number;
  project: string;
  flaky: boolean;
  error: string;
}

const TRIAGE_PATH = 'triage-output/triage.json';
const MODEL = process.env.TRIAGE_MODEL ?? 'openai/gpt-4o-mini';
const ALLOWED_PREFIXES = ['tests/', 'src/'];
const MAX_CANDIDATES = 3;

function looksLikeTestBug(f: TriageFailure): boolean {
  // Heuristic pre-filter; the LLM makes the final call. Product-bug signatures
  // (4xx/5xx contract mismatches) are excluded — those belong in bug reports.
  const e = f.error.toLowerCase();
  if (f.flaky) return false;
  return (
    e.includes('locator') ||
    e.includes('not found') ||
    e.includes('strict mode violation') ||
    e.includes('not an <input>') ||
    e.includes('not a <select>')
  );
}

function readSource(relPath: string): string | null {
  const full = path.resolve(relPath);
  if (!fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

async function requestPatch(failures: TriageFailure[], token: string): Promise<string | null> {
  const context = failures
    .map((f) => {
      const specPath = path.join('tests', f.file);
      const source = readSource(specPath) ?? readSource(f.file) ?? '(source unavailable)';
      return `## Failure: ${f.title}\nFile: ${specPath}\nError:\n${f.error}\n\nCurrent source of ${specPath}:\n\`\`\`ts\n${source.slice(0, 6_000)}\n\`\`\``;
    })
    .join('\n\n');

  const res = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0,
      max_tokens: 3_000,
      messages: [
        {
          role: 'system',
          content: [
            'You are a senior SDET fixing broken Playwright tests in a TypeScript repo.',
            'Output ONLY a valid unified diff (git apply format, a/ b/ prefixes).',
            'Only touch files under tests/ or src/. Keep changes minimal and surgical.',
            'If you cannot produce a safe fix, output exactly: NO_SAFE_FIX',
          ].join('\n'),
        },
        { role: 'user', content: context },
      ],
    }),
  });
  if (!res.ok) {
    console.error(`GitHub Models API error ${res.status}: ${await res.text()}`);
    return null;
  }
  const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const raw = body.choices?.[0]?.message?.content ?? '';
  if (raw.includes('NO_SAFE_FIX')) return null;
  // Strip markdown fences if the model added them despite instructions.
  const match = raw.match(/```(?:diff)?\n([\s\S]*?)```/);
  return (match?.[1] ?? raw).trim() + '\n';
}

function patchTouchesOnlyAllowedPaths(patch: string): boolean {
  const files = [...patch.matchAll(/^\+\+\+ b\/(.+)$/gm)].map((m) => m[1] ?? '');
  return files.length > 0 && files.every((f) => ALLOWED_PREFIXES.some((p) => f.startsWith(p)));
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_MODELS_TOKEN;
  if (!token) {
    console.log('No GITHUB_TOKEN — auto-fix requires GitHub Models access.');
    process.exit(78);
  }
  if (!fs.existsSync(TRIAGE_PATH)) {
    console.log('No triage.json found — run the triage agent first.');
    process.exit(78);
  }
  const { failures } = JSON.parse(fs.readFileSync(TRIAGE_PATH, 'utf8')) as { failures: TriageFailure[] };
  const candidates = failures.filter(looksLikeTestBug).slice(0, MAX_CANDIDATES);
  if (candidates.length === 0) {
    console.log('No test-bug candidates among failures (product bugs / flakes are not auto-fixed).');
    process.exit(78);
  }

  console.log(`Requesting fix for ${candidates.length} candidate(s):`);
  for (const c of candidates) console.log(`  - ${c.title}`);

  const patch = await requestPatch(candidates, token);
  if (!patch) {
    console.log('Model declined to produce a safe fix.');
    process.exit(78);
  }
  if (!patchTouchesOnlyAllowedPaths(patch)) {
    console.error('Patch touches files outside tests/ or src/ — rejected.');
    process.exit(78);
  }

  fs.writeFileSync('triage-output/autofix.patch', patch);
  const check = spawnSync('git', ['apply', '--check', 'triage-output/autofix.patch'], { encoding: 'utf8' });
  if (check.status !== 0) {
    console.error(`Patch failed git apply --check:\n${check.stderr}`);
    process.exit(78);
  }
  execSync('git apply triage-output/autofix.patch', { stdio: 'inherit' });

  const tsc = spawnSync('npx', ['tsc', '--noEmit'], { encoding: 'utf8' });
  if (tsc.status !== 0) {
    console.error(`Patched code does not compile — reverting.\n${tsc.stdout}`);
    execSync('git apply -R triage-output/autofix.patch', { stdio: 'inherit' });
    process.exit(78);
  }

  console.log('Auto-fix patch applied and compiles. CI will open a PR for human review.');
}

main().catch((err) => {
  console.error('Auto-fix agent error:', err);
  process.exit(78);
});
