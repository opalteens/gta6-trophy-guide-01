// Leonida Nights — a gta6-trophy-guide-01 entry (Node 22, standard library
// only). The guide is this directory's app/ folder: plain static files the
// browser opens at app/index.html (ES modules, CSS, no build step), offline —
// it loads nothing over the network, and its trophy list and guides are
// app/data/trophies.json. This program hands it in: it copies app/ and
// screenshots/ from beside this file to the output directory and writes
// dossier.json there with buildDossier from the vendored make.fun library.
// Leave vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy writes.
//
// Before copying, the program checks its own inputs and refuses to hand in
// a broken entry: app/index.html must exist, app/data/trophies.json must
// parse and name all 55 official trophies with a non-blank guide each, and
// screenshots/ must hold 3 or 4 images. Those are the same limits the gate
// enforces, checked here first so a bad build fails loudly at home.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const TROPHY_COUNT = 55;
const MIN_SCREENSHOTS = 3;
const MAX_SCREENSHOTS = 4;
const DOSSIER_TEXT_MAX_BYTES = 163840;
const SCREENSHOT_MAX_BYTES = 262144;
const APP_MAX_FILES = 993;
const APP_MAX_BYTES = 50331648;

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  throw new Error(`Leonida Nights: ${message}`);
}

function checkInputs(): string[] {
  if (!existsSync(join(here, 'app', 'index.html'))) fail('app/index.html is missing');
  const trophiesPath = join(here, 'app', 'data', 'trophies.json');
  if (!existsSync(trophiesPath)) fail('app/data/trophies.json is missing');
  let data: unknown;
  try {
    data = JSON.parse(readFileSync(trophiesPath, 'utf8'));
  } catch {
    fail('app/data/trophies.json does not parse as JSON');
  }
  const list = (data as { trophies?: unknown[] }).trophies;
  if (!Array.isArray(list) || list.length !== TROPHY_COUNT) {
    fail(`app/data/trophies.json must hold ${TROPHY_COUNT} trophies, found ${Array.isArray(list) ? list.length : 'none'}`);
  }
  const names = new Set<string>();
  let missable = 0;
  for (const trophy of list) {
    const item = trophy as { name?: unknown; guide?: unknown; missable?: unknown };
    if (typeof item.name !== 'string' || item.name.length === 0) fail('a trophy has no name');
    if (names.has(item.name)) fail(`trophy "${item.name}" is named twice`);
    names.add(item.name);
    if (typeof item.guide !== 'string' || item.guide.trim().length === 0) fail(`trophy "${item.name}" has no guide`);
    if (item.missable === true) missable += 1;
  }
  if (missable !== 1) fail(`exactly one trophy must be flagged missable, found ${missable}`);
  const shots = existsSync(join(here, 'screenshots'))
    ? readdirSync(join(here, 'screenshots')).filter((name) => !name.startsWith('.'))
    : [];
  if (shots.length < MIN_SCREENSHOTS || shots.length > MAX_SCREENSHOTS) {
    fail(`screenshots/ must hold ${MIN_SCREENSHOTS} to ${MAX_SCREENSHOTS} images, found ${shots.length}`);
  }
  for (const shot of shots) {
    const size = statSync(join(here, 'screenshots', shot)).size;
    if (size > SCREENSHOT_MAX_BYTES) fail(`screenshot ${shot} is ${size} bytes, over the ${SCREENSHOT_MAX_BYTES} byte cap`);
  }
  return shots;
}

const shots = checkInputs();

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: DOSSIER_TEXT_MAX_BYTES, screenshots: { max: MAX_SCREENSHOTS, max_bytes: SCREENSHOT_MAX_BYTES }, app_max_files: APP_MAX_FILES, app_max_bytes: APP_MAX_BYTES }),
);

console.log(`Leonida Nights: ${TROPHY_COUNT} trophies, ${shots.length} screenshots, dossier written to ${join(out, 'dossier.json')}`);
