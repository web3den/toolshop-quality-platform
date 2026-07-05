/**
 * Test-review agent — applies docs/skills/test-quality-review.md to changed
 * spec files on a PR and posts a review comment.
 *
 * The skill document itself is the system prompt: the checklist humans review
 * with is exactly what the agent enforces, so the two never drift apart.
 * Read-only by construction; verdicts are advisory (a human merges).
 */
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const MODEL = process.env.TRIAGE_MODEL ?? 'openai/gpt-4o-mini';
const SKILL_PATH = 'docs/skills/test-quality-review.md';
const OUT_PATH = 'triage-output/test-review.md';
const MAX_FILES = 6;
const MAX_FILE_CHARS = 9_000;

function changedSpecFiles(baseRef: string): string[] {
  const diff = execSync(`git diff --name-only --diff-filter=ACM ${baseRef}...HEAD`, {
    encoding: 'utf8',
  });
  return diff
    .split('\n')
    .filter((f) => /\.spec\.ts$/.test(f) && fs.existsSync(f))
    .slice(0, MAX_FILES);
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN ?? process.env.GH_MODELS_TOKEN;
  const baseRef = process.env.BASE_REF ?? 'origin/main';
  fs.mkdirSync('triage-output', { recursive: true });

  const files = changedSpecFiles(baseRef);
  if (files.length === 0) {
    fs.writeFileSync(OUT_PATH, 'No spec files changed — nothing to review.');
    console.log('No spec files changed.');
    return;
  }
  if (!token) {
    fs.writeFileSync(OUT_PATH, 'Test review skipped: no GITHUB_TOKEN for GitHub Models.');
    console.log('No token — skipping.');
    return;
  }

  const skill = fs.readFileSync(SKILL_PATH, 'utf8');
  const sources = files
    .map((f) => `### ${f}\n\`\`\`ts\n${fs.readFileSync(f, 'utf8').slice(0, MAX_FILE_CHARS)}\n\`\`\``)
    .join('\n\n');

  const res = await fetch('https://models.github.ai/inference/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 2_500,
      messages: [
        {
          role: 'system',
          content:
            'You are a QA lead reviewing Playwright tests. Apply the following skill checklist ' +
            'EXACTLY, including its review output format. Review each changed file. Be specific ' +
            '(file + test title), be brief, and only flag real issues — do not invent problems.\n\n' +
            skill,
        },
        { role: 'user', content: `Changed spec files:\n\n${sources}` },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    fs.writeFileSync(OUT_PATH, `Test review unavailable (GitHub Models ${res.status}).`);
    console.error(`GitHub Models error ${res.status}: ${detail}`);
    return;
  }
  const body = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const review = body.choices?.[0]?.message?.content ?? '(empty review)';
  const md = `## Test quality review (agent)\n\nFiles reviewed: ${files.map((f) => `\`${f}\``).join(', ')}\n\n${review}`;
  fs.writeFileSync(OUT_PATH, md);
  console.log(md);
}

main().catch((err) => {
  // Advisory job — never fail the pipeline.
  console.error('Test review agent error (non-fatal):', err);
});
