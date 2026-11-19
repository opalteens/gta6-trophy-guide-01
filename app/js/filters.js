// Filtering: search text, kind, grade, earned state, and the spoiler rule.
export function normalizeText(value) {
  return (value || '').toLowerCase().trim();
}

export function matchesSearch(trophy, query) {
  const q = normalizeText(query);
  if (!q) return true;
  return normalizeText(trophy.name).includes(q) || normalizeText(trophy.description).includes(q);
}

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false;
  return trophy.kind === kind;
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function matchesEarned(trophy, earnedFilter, earned) {
  if (earnedFilter === 'earned') return earned.has(trophy.id);
  if (earnedFilter === 'unearned') return !earned.has(trophy.id);
  return true;
}

export function filterTrophies(trophies, filters, earned) {
  return trophies.filter((t) =>
    matchesSearch(t, filters.query) &&
    matchesKind(t, filters.kind) &&
    matchesGrade(t, filters.grade) &&
    matchesEarned(t, filters.earned, earned));
}

// A trophy is spoiler-hidden when the spoiler setting is on, it is hidden on
// PlayStation, it is a story trophy, and the player has not earned it yet.
export function isSpoilerHidden(trophy, spoilerOn, earned) {
  return spoilerOn && trophy.hidden === true && trophy.kind === 'story' && !earned.has(trophy.id);
}
