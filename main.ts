// Leonida Nights — GTA 6 trophy guide entry for gta6-trophy-guide-01.
//
// main.ts (Node 22, standard library only) hands the guide in: it copies this
// repository's app/ (static files: index.html, CSS, ES modules, data/trophies.json
// with the official 55 trophies and this guide's own-words guides) and screenshots/
// (4 real browser renders of the app) to /output, and writes /output/dossier.json
// with buildDossier from vendor/makefun-frontend.ts, the kit's copy, unchanged.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Determinism: the copy is a plain recursive copy of fixed files and the dossier
// is computed from those bytes alone, so two runs write identical bytes.

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Pre-flight sanity check on the trophy data: the gate requires all 55 official
// trophies named with a non-blank guide, so refuse to hand in a broken list
// rather than discovering it at grading time.
const trophyData = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyList = Array.isArray(trophyData) ? trophyData : trophyData.trophies;
if (!Array.isArray(trophyList) || trophyList.length !== 55) {
  throw new Error(`trophies.json must hold exactly 55 trophies, found ${Array.isArray(trophyList) ? trophyList.length : 'none'}`);
}
const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
for (const t of trophyList) {
  if (typeof t.name !== 'string' || !t.name.trim()) throw new Error('trophy with no name in trophies.json');
  if (typeof t.guide !== 'string' || !t.guide.trim()) throw new Error(`trophy "${t.name}" has no guide`);
  if (!(t.grade in grades)) throw new Error(`trophy "${t.name}" has unknown grade "${t.grade}"`);
  grades[t.grade] += 1;
}
if (grades.platinum !== 1 || grades.gold !== 2 || grades.silver !== 6 || grades.bronze !== 46) {
  throw new Error(`unexpected grade counts: ${JSON.stringify(grades)}`);
}
const missable = trophyList.filter((t) => t.missable === true);
if (missable.length !== 1) throw new Error(`expected exactly 1 missable trophy, found ${missable.length}`);

// Start from a clean output directory so stale files from an earlier run can
// never leak into the handed-in entry.
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): text_max_bytes shapes the dossier
// text; the other caps refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 48 MiB of app files — app/ counts beside /output's own 1000-entry cap).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
console.log(`Leonida Nights handed in to ${out} — 55 trophies, grades ${JSON.stringify(grades)}, missable: ${missable[0].name}`);
