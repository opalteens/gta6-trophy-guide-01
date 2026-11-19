// Leonida Nights boot: load the trophy data, wire filters, tabs, spoiler setting and progress I/O.
import { loadProgress, saveProgress, toggleEarned, exportProgress, parseImportedProgress } from './store.js';
import { filterTrophies } from './filters.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissable } from './views.js';

const listEl = document.getElementById('trophyList');
const countEl = document.getElementById('listCount');
const emptyEl = document.getElementById('emptyNote');
const detailPane = document.getElementById('detailPane');
const earnedCountEl = document.getElementById('earnedCount');
const progressFillEl = document.getElementById('progressFill');
const progressNoteEl = document.getElementById('progressNote');
const searchInput = document.getElementById('searchInput');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const earnedFilter = document.getElementById('earnedFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const roadmapView = document.getElementById('roadmapView');
const missableView = document.getElementById('missableView');
const roadmapStages = document.getElementById('roadmapStages');
const missableList = document.getElementById('missableList');

let trophies = [];
let earned = loadProgress();
let selectedId = null;
let view = 'checklist';

function currentFilters() {
  return {
    query: searchInput.value,
    kind: kindFilter.value,
    grade: gradeFilter.value,
    earned: earnedFilter.value,
  };
}

function updateProgress() {
  earnedCountEl.textContent = String(earned.size);
  const pct = Math.round((earned.size / 55) * 100);
  progressFillEl.style.width = `${pct}%`;
  progressNoteEl.textContent = earned.size >= 55
    ? 'Platinum: Vice Got a Price! — earned!'
    : `Platinum: Vice Got a Price! — ${pct}% complete`;
}

function renderAll() {
  updateProgress();
  const filtered = filterTrophies(trophies, currentFilters(), earned);
  const selected = trophies.find((t) => t.id === selectedId) || null;
  renderChecklist(listEl, countEl, emptyEl, filtered, earned, spoilerToggle.checked, selectedId, selectTrophy, toggleTrophy);
  renderDetail(detailPane, selected, earned, spoilerToggle.checked);
  renderRoadmap(roadmapStages, trophies, earned);
  renderMissable(missableList, trophies, earned);
}

function selectTrophy(id) {
  selectedId = id;
  renderAll();
}

function toggleTrophy(id) {
  earned = toggleEarned(earned, id);
  renderAll();
}

function setView(next) {
  view = next;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === next));
  const checklist = next === 'checklist';
  document.querySelector('.layout').hidden = !checklist;
  document.querySelector('.toolbar').hidden = !checklist;
  document.querySelector('.grade-line').hidden = !checklist;
  roadmapView.hidden = next !== 'roadmap';
  missableView.hidden = next !== 'missable';
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => setView(tab.dataset.view));
});
for (const el of [searchInput, kindFilter, gradeFilter, earnedFilter, spoilerToggle]) {
  el.addEventListener('input', renderAll);
  el.addEventListener('change', renderAll);
}

document.getElementById('exportBtn').addEventListener('click', () => exportProgress(earned));
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  try {
    const imported = parseImportedProgress(await file.text());
    earned = imported;
    saveProgress(earned);
    renderAll();
  } catch (err) {
    alert('Could not import that file: ' + err.message);
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Clear all earned trophies in this tracker?')) {
    earned = new Set();
    saveProgress(earned);
    renderAll();
  }
});

// Query-string deep links for screenshots and sharing: ?view=roadmap, ?view=missable,
// ?trophy=<id>, ?spoiler=1, ?seed=13 (seeds 13 earned trophies for a demo view).
const params = new URLSearchParams(location.search);
if (params.get('spoiler') === '1') spoilerToggle.checked = true;
if (params.get('seed') === '13') {
  earned = new Set([2, 3, 4, 5, 6, 8, 15, 16, 21, 28, 35, 42, 44]);
  saveProgress(earned);
}
if (params.get('view') === 'roadmap' || params.get('view') === 'missable') setView(params.get('view'));
if (params.get('trophy')) {
  const id = Number(params.get('trophy'));
  if (Number.isInteger(id)) selectedId = id;
}

fetch('data/trophies.json')
  .then((response) => {
    if (!response.ok) throw new Error('Could not load data/trophies.json');
    return response.json();
  })
  .then((data) => {
    trophies = Array.isArray(data) ? data : data.trophies;
    renderAll();
  })
  .catch((err) => {
    listEl.innerHTML = '';
    emptyEl.hidden = false;
    emptyEl.textContent = 'Could not load the trophy list: ' + err.message;
  });
