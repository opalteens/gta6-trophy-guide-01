// Leonida Nights boot: load the trophy data, wire the checklist, the
// roadmap, the missable page, the filters, the spoiler setting and the
// export and import of progress. Deep links work through the hash:
// #view=roadmap, #view=missable, #trophy=<id>, #spoiler=on.
import { loadProgress, saveProgress, loadSpoiler, saveSpoiler, parseImport, exportText, SEED_EARNED } from './store.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissable } from './views.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

let earned = loadProgress();
let spoilerOn = loadSpoiler();
let selectedId = null;

const list = document.getElementById('trophyList');
const search = document.getElementById('search');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const earnedFilter = document.getElementById('earnedFilter');
const spoilerToggle = document.getElementById('spoilerToggle');

function filters() {
  return { query: search.value, kind: kindFilter.value, grade: gradeFilter.value, earnedFilter: earnedFilter.value };
}

function updateProgress() {
  document.getElementById('progressText').textContent = `${earned.size} of ${trophies.length} earned`;
  document.getElementById('progressFill').style.width = `${(earned.size / trophies.length) * 100}%`;
}

function render() {
  updateProgress();
  renderChecklist(list, trophies, earned, filters(), spoilerOn, selectedId, select, toggle);
  const selected = trophies.find((t) => t.id === selectedId) ?? null;
  renderDetail(selected, earned, spoilerOn, toggle);
}

function select(id) {
  selectedId = id;
  history.replaceState(null, '', `#trophy=${id}`);
  render();
}

function toggle(id, on) {
  if (on) earned.add(id);
  else earned.delete(id);
  saveProgress(earned);
  render();
}

function showView(name) {
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === name);
  }
  document.getElementById('view-checklist').hidden = name !== 'checklist';
  document.getElementById('view-roadmap').hidden = name !== 'roadmap';
  document.getElementById('view-missable').hidden = name !== 'missable';
}

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => showView(tab.dataset.view));
}

for (const input of [search, kindFilter, gradeFilter, earnedFilter]) {
  input.addEventListener('input', render);
}

spoilerToggle.checked = spoilerOn;
spoilerToggle.addEventListener('change', () => {
  spoilerOn = spoilerToggle.checked;
  saveSpoiler(spoilerOn);
  render();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([exportText(earned)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-nights-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const imported = parseImport(await file.text());
    if (!imported) throw new Error('bad file');
    const known = new Set(trophies.map((t) => t.id));
    earned = new Set([...imported].filter((id) => known.has(id)));
    saveProgress(earned);
    render();
  } catch {
    alert('That file is not a Leonida Nights progress export.');
  }
  event.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveProgress(earned);
  render();
});

renderRoadmap(document.getElementById('roadmapStages'));
renderMissable(document.getElementById('missableCard'), trophies.find((t) => t.missable));

// Deep links from the hash, so a screenshot or a share can open one view.
// Runs on load and on every hash change, because a new hash on the same
// page does not reload it.
function applyHash() {
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('spoiler') === 'on') {
    spoilerOn = true;
    spoilerToggle.checked = true;
  }
  if (hash.get('view') === 'roadmap') showView('roadmap');
  else if (hash.get('view') === 'missable') showView('missable');
  else showView('checklist');
  if (hash.get('trophy')) {
    const id = Number(hash.get('trophy'));
    if (trophies.some((t) => t.id === id)) selectedId = id;
  }
  render();
}

window.addEventListener('hashchange', applyHash);
applyHash();
