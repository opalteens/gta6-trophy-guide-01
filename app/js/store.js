// Progress store: earned trophy ids saved in localStorage, with export and import.
export const STORAGE_KEY = 'leonida-nights-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.earned)) return new Set();
    return new Set(parsed.earned.map(Number).filter((n) => Number.isInteger(n)));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...earned].sort((a, b) => a - b), savedAt: new Date().toISOString() }));
  } catch {
    // Storage full or unavailable: progress stays in memory for this session.
  }
}

export function toggleEarned(earned, id) {
  const next = new Set(earned);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveProgress(next);
  return next;
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ app: 'Leonida Nights', earned: [...earned].sort((a, b) => a - b), exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-nights-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedProgress(text) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('Import file has no earned list.');
  const ids = list.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 55);
  return new Set(ids);
}
