/**
 * Regenerates the typed API surface from the live OpenAPI document.
 *
 * Output: src/api/generated/toolshop-schema.d.ts (committed).
 * We commit generated types so that:
 *  1. the repo typechecks without network access,
 *  2. spec drift shows up as a reviewable diff in PRs (a free contract check).
 *
 * CI runs this in the nightly "contract" lane and fails if the diff is dirty,
 * which means the provider changed their API contract.
 */
import fs from 'node:fs';
import path from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';

const SPEC_URL = 'https://api.practicesoftwaretesting.com/docs?api-docs.json';
const OUT_FILE = path.join(import.meta.dirname, '..', 'src', 'api', 'generated', 'toolshop-schema.d.ts');

async function main(): Promise<void> {
  console.log(`Fetching OpenAPI spec: ${SPEC_URL}`);
  const ast = await openapiTS(new URL(SPEC_URL), {
    // Keep output deterministic across runs for clean diffs.
    alphabetize: true,
  });
  const header = [
    '/**',
    ' * AUTO-GENERATED from the Toolshop OpenAPI document. DO NOT EDIT.',
    ' * Regenerate with: npm run generate:types',
    ' */',
    '',
  ].join('\n');
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, header + astToString(ast));
  console.log(`Wrote ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
