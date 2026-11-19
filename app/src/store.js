// Progress storage for Leonida Nights: localStorage only, no network.
// On a first visit the checklist is seeded with 13 earned trophies so the
// progress bar shows real progress; after that the player's own ticks win.
export const STORAGE_KEY = 'leonida-nights-progress-v1';
export const SPOILER_KEY = 'leonida-nights-spoiler-v1';
export const SEED_EARNED = [2, 3, 4, 5, 8, 16, 20, 21, 33, 44, 46, 49, 51];

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const seeded = new Set(SEED_EARNED);
      saveProgress(seeded);
      return seeded;
    }
    const ids = JSON.parse(raw);
    return new Set(Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []);
  } catch {
    return new Set(SEED_EARNED);
  }
}

export function saveProgress(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoiler(on) {
  localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
}

// Parse an imported progress file: an array of trophy ids, or an object
// with an "earned" array. Returns a Set, or null when the file is unusable.
export function parseImport(text) {
  const data = JSON.parse(text);
  const ids = Array.isArray(data) ? data : data.earned;
  if (!Array.isArray(ids)) return null;
  if (!ids.every((n) => Number.isInteger(n))) return null;
  return new Set(ids);
}

export function exportText(earned) {
  return JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort((a, b) => a - b) }, null, 2);
}
